import { cf as Ta, cg as da, ch as Sh, ci as Fc, cj as Ia, b8 as Hc, ck as yi, cl as mi, cm as qs, cn as Us, co as Nc, b9 as $c, cp as bi, cq as Bc, cr as vs, cs as Ei, ct as Id, bf as qc, ba as mn, cu as Rh, b6 as Ci, cv as Uc, b7 as wr, cw as bl, an as Vc, bc as Vo, cx as Cl, N as R, bj as sn, bh as Oe, Q as Ce, bk as Kt, bl as Kr, bm as Ar, bn as Dr, cy as Ih, cz as _h, cA as Pi, cB as nl, cC as jc, cD as rl, cE as Eh, bg as Ah, aV as ps, bi as ho, cF as Dh, cG as kh, aS as He, cH as Mh, cd as Th, cb as Oh, M as Ko, W as Za, _ as Aa, $ as Xa, cI as Kc, cJ as ol, cK as al, b5 as Lh, U as Cr, T as xo, aK as ur, a9 as ct, cL as Vs, v as Pl, J as Fh, c5 as ys, S as ei, V as Yc, cM as Hh, cN as Nh, cO as $h, cc as ti, cP as Bh, cQ as qh, cR as Uh, cS as Vh, cT as ni, a0 as sa, cU as jh, cV as Kh, cW as Yh, cX as Qh, b0 as zh, cY as si, cZ as Wh, w as Qc, c_ as wl, c$ as xl, d0 as sl, d1 as Jh, d2 as zc, d3 as Wc, d4 as Gh, d5 as hs, d6 as ri, d7 as Zh, d8 as Jc, d9 as Sl, da as Rl, db as Xh, dc as _d, dd as ef, de as Gc, df as Ed, dg as tf, dh as Ai, di as Di, dj as Zc, dk as nf, dl as rf, dm as of, dn as Xc, dp as af, dq as sf, dr as ki, ds as lf, dt as df, du as cf, dv as za, dw as uf, dx as hf, dy as ff, dz as vf, dA as gf, dB as pf, dC as yf, dD as Sa, dE as mf, dF as Ad, dG as bf, dH as Cf, dI as eu, dJ as wi, dK as Il, dL as Pf, aQ as wf, dM as xf, aL as Dd, ar as Sf, aM as Mi, dN as kd, dO as Md, dP as Rf, dQ as If, bO as _f, X as Ka, a$ as Ef, dR as Af, dS as Df, s as Td, b3 as kf } from "./App-Ck79ufzA.js";
import { aO as Ge, u as Vr, aS as C, a as r, b as g, aT as be, aK as hr, a$ as tu, b7 as Yr, b0 as Wt, b1 as Re, b2 as W, b3 as A, b4 as Jt, b5 as S, ba as Q, b8 as O, n as Pr, bh as ca, Z as Ie, bi as te, b9 as M, b6 as Gt, bf as N, aP as nu, bj as Wa, bL as _l, ap as oi, bD as Ts, aq as ru, bl as ou, bW as El, c2 as Al, bS as _a, bQ as xi, bk as So, c0 as Od, ay as Bo, c4 as Mf, bI as Tf, bR as Of, bN as Lf } from "./entry-CLkZn30j.js";
import { D as au, a as su } from "./DialogWrapper-aT5t3sgb.js";
import { M as or, a as ia, P as iu, b as il, c as ll, d as dl, e as cl, f as Dl, p as Ff, g as Hf, r as Nf, h as Ld, E as $f, s as Bf, u as qf, i as Uf, j as Vf, k as jf, l as Kf, m as Fd, D as Hd, n as Nd, o as Yf, q as Qf, t as $d, v as Bd, w as zf, x as Wf, y as Jf, z as qd } from "./postBroadcastService-DDsWYlrN.js";
function Ti(t, e) {
  return t - e * Math.floor(t / e);
}
const lu = 1721426;
function Ws(t, e, n, o) {
  e = kl(t, e);
  let i = e - 1, s = -2;
  return n <= 2 ? s = 0 : ai(e) && (s = -1), lu - 1 + 365 * i + Math.floor(i / 4) - Math.floor(i / 100) + Math.floor(i / 400) + Math.floor((367 * n - 362) / 12 + s + o);
}
function ai(t) {
  return t % 4 === 0 && (t % 100 !== 0 || t % 400 === 0);
}
function kl(t, e) {
  return t === "BC" ? 1 - e : e;
}
function Gf(t) {
  let e = "AD";
  return t <= 0 && (e = "BC", t = 1 - t), [
    e,
    t
  ];
}
const Zf = {
  standard: [
    31,
    28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31
  ],
  leapyear: [
    31,
    29,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31
  ]
};
class gs {
  fromJulianDay(e) {
    let n = e, o = n - lu, i = Math.floor(o / 146097), s = Ti(o, 146097), d = Math.floor(s / 36524), h = Ti(s, 36524), u = Math.floor(h / 1461), I = Ti(h, 1461), f = Math.floor(I / 365), m = i * 400 + d * 100 + u * 4 + f + (d !== 4 && f !== 4 ? 1 : 0), [w, P] = Gf(m), T = n - Ws(w, P, 1, 1), p = 2;
    n < Ws(w, P, 3, 1) ? p = 0 : ai(P) && (p = 1);
    let x = Math.floor(((T + p) * 12 + 373) / 367), a = n - Ws(w, P, x, 1) + 1;
    return new Ma(w, P, x, a);
  }
  toJulianDay(e) {
    return Ws(e.era, e.year, e.month, e.day);
  }
  getDaysInMonth(e) {
    return Zf[ai(e.year) ? "leapyear" : "standard"][e.month - 1];
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getMonthsInYear(e) {
    return 12;
  }
  getDaysInYear(e) {
    return ai(e.year) ? 366 : 365;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getYearsInEra(e) {
    return 9999;
  }
  getEras() {
    return [
      "BC",
      "AD"
    ];
  }
  isInverseEra(e) {
    return e.era === "BC";
  }
  balanceDate(e) {
    e.year <= 0 && (e.era = e.era === "BC" ? "AD" : "BC", e.year = 1 - e.year);
  }
  constructor() {
    this.identifier = "gregory";
  }
}
const Xf = {
  "001": 1,
  AD: 1,
  AE: 6,
  AF: 6,
  AI: 1,
  AL: 1,
  AM: 1,
  AN: 1,
  AR: 1,
  AT: 1,
  AU: 1,
  AX: 1,
  AZ: 1,
  BA: 1,
  BE: 1,
  BG: 1,
  BH: 6,
  BM: 1,
  BN: 1,
  BY: 1,
  CH: 1,
  CL: 1,
  CM: 1,
  CN: 1,
  CR: 1,
  CY: 1,
  CZ: 1,
  DE: 1,
  DJ: 6,
  DK: 1,
  DZ: 6,
  EC: 1,
  EE: 1,
  EG: 6,
  ES: 1,
  FI: 1,
  FJ: 1,
  FO: 1,
  FR: 1,
  GB: 1,
  GE: 1,
  GF: 1,
  GP: 1,
  GR: 1,
  HR: 1,
  HU: 1,
  IE: 1,
  IQ: 6,
  IR: 6,
  IS: 1,
  IT: 1,
  JO: 6,
  KG: 1,
  KW: 6,
  KZ: 1,
  LB: 1,
  LI: 1,
  LK: 1,
  LT: 1,
  LU: 1,
  LV: 1,
  LY: 6,
  MC: 1,
  MD: 1,
  ME: 1,
  MK: 1,
  MN: 1,
  MQ: 1,
  MV: 5,
  MY: 1,
  NL: 1,
  NO: 1,
  NZ: 1,
  OM: 6,
  PL: 1,
  QA: 6,
  RE: 1,
  RO: 1,
  RS: 1,
  RU: 1,
  SD: 6,
  SE: 1,
  SI: 1,
  SK: 1,
  SM: 1,
  SY: 6,
  TJ: 1,
  TM: 1,
  TR: 1,
  UA: 1,
  UY: 1,
  UZ: 1,
  VA: 1,
  VN: 1,
  XK: 1
};
function Ra(t, e) {
  return e = eo(e, t.calendar), t.era === e.era && t.year === e.year && t.month === e.month && t.day === e.day;
}
function Ml(t, e) {
  return e = eo(e, t.calendar), t = ul(t), e = ul(e), t.era === e.era && t.year === e.year && t.month === e.month;
}
function ev(t, e) {
  var n, o, i, s;
  return (s = (i = (n = t.isEqual) === null || n === void 0 ? void 0 : n.call(t, e)) !== null && i !== void 0 ? i : (o = e.isEqual) === null || o === void 0 ? void 0 : o.call(e, t)) !== null && s !== void 0 ? s : t.identifier === e.identifier;
}
function tv(t, e) {
  return Ra(t, rv(e));
}
function du(t, e, n) {
  let o = t.calendar.toJulianDay(t), i = iv(e), s = Math.ceil(o + 1 - i) % 7;
  return s < 0 && (s += 7), s;
}
function nv(t) {
  return Uo(Date.now(), t);
}
function rv(t) {
  return cv(nv(t));
}
function cu(t, e) {
  return t.calendar.toJulianDay(t) - e.calendar.toJulianDay(e);
}
function ov(t, e) {
  return Ud(t) - Ud(e);
}
function Ud(t) {
  return t.hour * 36e5 + t.minute * 6e4 + t.second * 1e3 + t.millisecond;
}
let Oi = null;
function Ea() {
  return Oi == null && (Oi = new Intl.DateTimeFormat().resolvedOptions().timeZone), Oi;
}
function ul(t) {
  return t.subtract({
    days: t.day - 1
  });
}
function av(t) {
  return t.add({
    days: t.calendar.getDaysInMonth(t) - t.day
  });
}
const Vd = /* @__PURE__ */ new Map(), Li = /* @__PURE__ */ new Map();
function sv(t) {
  if (Intl.Locale) {
    let n = Vd.get(t);
    return n || (n = new Intl.Locale(t).maximize().region, n && Vd.set(t, n)), n;
  }
  let e = t.split("-")[1];
  return e === "u" ? void 0 : e;
}
function iv(t) {
  let e = Li.get(t);
  if (!e) {
    if (Intl.Locale) {
      let o = new Intl.Locale(t);
      if ("getWeekInfo" in o && (e = o.getWeekInfo(), e))
        return Li.set(t, e), e.firstDay;
    }
    let n = sv(t);
    if (t.includes("-fw-")) {
      let o = t.split("-fw-")[1].split("-")[0];
      o === "mon" ? e = {
        firstDay: 1
      } : o === "tue" ? e = {
        firstDay: 2
      } : o === "wed" ? e = {
        firstDay: 3
      } : o === "thu" ? e = {
        firstDay: 4
      } : o === "fri" ? e = {
        firstDay: 5
      } : o === "sat" ? e = {
        firstDay: 6
      } : e = {
        firstDay: 0
      };
    } else t.includes("-ca-iso8601") ? e = {
      firstDay: 1
    } : e = {
      firstDay: n && Xf[n] || 0
    };
    Li.set(t, e);
  }
  return e.firstDay;
}
function Da(t) {
  t = eo(t, new gs());
  let e = kl(t.era, t.year);
  return uu(e, t.month, t.day, t.hour, t.minute, t.second, t.millisecond);
}
function uu(t, e, n, o, i, s, d) {
  let h = /* @__PURE__ */ new Date();
  return h.setUTCHours(o, i, s, d), h.setUTCFullYear(t, e - 1, n), h.getTime();
}
function $s(t, e) {
  if (e === "UTC") return 0;
  if (t > 0 && e === Ea()) return new Date(t).getTimezoneOffset() * -6e4;
  let { year: n, month: o, day: i, hour: s, minute: d, second: h } = hu(t, e);
  return uu(n, o, i, s, d, h, 0) - Math.floor(t / 1e3) * 1e3;
}
const jd = /* @__PURE__ */ new Map();
function hu(t, e) {
  let n = jd.get(e);
  n || (n = new Intl.DateTimeFormat("en-US", {
    timeZone: e,
    hour12: !1,
    era: "short",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric"
  }), jd.set(e, n));
  let o = n.formatToParts(new Date(t)), i = {};
  for (let s of o) s.type !== "literal" && (i[s.type] = s.value);
  return {
    // Firefox returns B instead of BC... https://bugzilla.mozilla.org/show_bug.cgi?id=1752253
    year: i.era === "BC" || i.era === "B" ? -i.year + 1 : +i.year,
    month: +i.month,
    day: +i.day,
    hour: i.hour === "24" ? 0 : +i.hour,
    minute: +i.minute,
    second: +i.second
  };
}
const ii = 864e5;
function lv(t, e) {
  let n = Da(t), o = n - $s(n - ii, e), i = n - $s(n + ii, e);
  return fu(t, e, o, i);
}
function fu(t, e, n, o) {
  return (n === o ? [
    n
  ] : [
    n,
    o
  ]).filter((s) => dv(t, e, s));
}
function dv(t, e, n) {
  let o = hu(n, e);
  return t.year === o.year && t.month === o.month && t.day === o.day && t.hour === o.hour && t.minute === o.minute && t.second === o.second;
}
function qo(t, e, n = "compatible") {
  let o = ka(t);
  if (e === "UTC") return Da(o);
  if (e === Ea() && n === "compatible") {
    o = eo(o, new gs());
    let u = /* @__PURE__ */ new Date(), I = kl(o.era, o.year);
    return u.setFullYear(I, o.month - 1, o.day), u.setHours(o.hour, o.minute, o.second, o.millisecond), u.getTime();
  }
  let i = Da(o), s = $s(i - ii, e), d = $s(i + ii, e), h = fu(o, e, i - s, i - d);
  if (h.length === 1) return h[0];
  if (h.length > 1) switch (n) {
    // 'compatible' means 'earlier' for "fall back" transitions
    case "compatible":
    case "earlier":
      return h[0];
    case "later":
      return h[h.length - 1];
    case "reject":
      throw new RangeError("Multiple possible absolute times found");
  }
  switch (n) {
    case "earlier":
      return Math.min(i - s, i - d);
    // 'compatible' means 'later' for "spring forward" transitions
    case "compatible":
    case "later":
      return Math.max(i - s, i - d);
    case "reject":
      throw new RangeError("No such absolute time found");
  }
}
function vu(t, e, n = "compatible") {
  return new Date(qo(t, e, n));
}
function Uo(t, e) {
  let n = $s(t, e), o = new Date(t + n), i = o.getUTCFullYear(), s = o.getUTCMonth() + 1, d = o.getUTCDate(), h = o.getUTCHours(), u = o.getUTCMinutes(), I = o.getUTCSeconds(), f = o.getUTCMilliseconds();
  return new jo(i < 1 ? "BC" : "AD", i < 1 ? -i + 1 : i, s, d, e, n, h, u, I, f);
}
function cv(t) {
  return new Ma(t.calendar, t.era, t.year, t.month, t.day);
}
function ka(t, e) {
  let n = 0, o = 0, i = 0, s = 0;
  if ("timeZone" in t) ({ hour: n, minute: o, second: i, millisecond: s } = t);
  else if ("hour" in t && !e) return t;
  return e && ({ hour: n, minute: o, second: i, millisecond: s } = e), new ua(t.calendar, t.era, t.year, t.month, t.day, n, o, i, s);
}
function eo(t, e) {
  if (ev(t.calendar, e)) return t;
  let n = e.fromJulianDay(t.calendar.toJulianDay(t)), o = t.copy();
  return o.calendar = e, o.era = n.era, o.year = n.year, o.month = n.month, o.day = n.day, Ja(o), o;
}
function uv(t, e, n) {
  if (t instanceof jo)
    return t.timeZone === e ? t : fv(t, e);
  let o = qo(t, e, n);
  return Uo(o, e);
}
function hv(t) {
  let e = Da(t) - t.offset;
  return new Date(e);
}
function fv(t, e) {
  let n = Da(t) - t.offset;
  return eo(Uo(n, e), t.calendar);
}
const Is = 36e5;
function Si(t, e) {
  let n = t.copy(), o = "hour" in n ? yv(n, e) : 0;
  hl(n, e.years || 0), n.calendar.balanceYearMonth && n.calendar.balanceYearMonth(n, t), n.month += e.months || 0, fl(n), gu(n), n.day += (e.weeks || 0) * 7, n.day += e.days || 0, n.day += o, vv(n), n.calendar.balanceDate && n.calendar.balanceDate(n), n.year < 1 && (n.year = 1, n.month = 1, n.day = 1);
  let i = n.calendar.getYearsInEra(n);
  if (n.year > i) {
    var s, d;
    let u = (s = (d = n.calendar).isInverseEra) === null || s === void 0 ? void 0 : s.call(d, n);
    n.year = i, n.month = u ? 1 : n.calendar.getMonthsInYear(n), n.day = u ? 1 : n.calendar.getDaysInMonth(n);
  }
  n.month < 1 && (n.month = 1, n.day = 1);
  let h = n.calendar.getMonthsInYear(n);
  return n.month > h && (n.month = h, n.day = n.calendar.getDaysInMonth(n)), n.day = Math.max(1, Math.min(n.calendar.getDaysInMonth(n), n.day)), n;
}
function hl(t, e) {
  var n, o;
  !((n = (o = t.calendar).isInverseEra) === null || n === void 0) && n.call(o, t) && (e = -e), t.year += e;
}
function fl(t) {
  for (; t.month < 1; )
    hl(t, -1), t.month += t.calendar.getMonthsInYear(t);
  let e = 0;
  for (; t.month > (e = t.calendar.getMonthsInYear(t)); )
    t.month -= e, hl(t, 1);
}
function vv(t) {
  for (; t.day < 1; )
    t.month--, fl(t), t.day += t.calendar.getDaysInMonth(t);
  for (; t.day > t.calendar.getDaysInMonth(t); )
    t.day -= t.calendar.getDaysInMonth(t), t.month++, fl(t);
}
function gu(t) {
  t.month = Math.max(1, Math.min(t.calendar.getMonthsInYear(t), t.month)), t.day = Math.max(1, Math.min(t.calendar.getDaysInMonth(t), t.day));
}
function Ja(t) {
  t.calendar.constrainDate && t.calendar.constrainDate(t), t.year = Math.max(1, Math.min(t.calendar.getYearsInEra(t), t.year)), gu(t);
}
function pu(t) {
  let e = {};
  for (let n in t) typeof t[n] == "number" && (e[n] = -t[n]);
  return e;
}
function yu(t, e) {
  return Si(t, pu(e));
}
function Tl(t, e) {
  let n = t.copy();
  return e.era != null && (n.era = e.era), e.year != null && (n.year = e.year), e.month != null && (n.month = e.month), e.day != null && (n.day = e.day), Ja(n), n;
}
function li(t, e) {
  let n = t.copy();
  return e.hour != null && (n.hour = e.hour), e.minute != null && (n.minute = e.minute), e.second != null && (n.second = e.second), e.millisecond != null && (n.millisecond = e.millisecond), pv(n), n;
}
function gv(t) {
  t.second += Math.floor(t.millisecond / 1e3), t.millisecond = Js(t.millisecond, 1e3), t.minute += Math.floor(t.second / 60), t.second = Js(t.second, 60), t.hour += Math.floor(t.minute / 60), t.minute = Js(t.minute, 60);
  let e = Math.floor(t.hour / 24);
  return t.hour = Js(t.hour, 24), e;
}
function pv(t) {
  t.millisecond = Math.max(0, Math.min(t.millisecond, 1e3)), t.second = Math.max(0, Math.min(t.second, 59)), t.minute = Math.max(0, Math.min(t.minute, 59)), t.hour = Math.max(0, Math.min(t.hour, 23));
}
function Js(t, e) {
  let n = t % e;
  return n < 0 && (n += e), n;
}
function yv(t, e) {
  return t.hour += e.hours || 0, t.minute += e.minutes || 0, t.second += e.seconds || 0, t.millisecond += e.milliseconds || 0, gv(t);
}
function Ol(t, e, n, o) {
  let i = t.copy();
  switch (e) {
    case "era": {
      let h = t.calendar.getEras(), u = h.indexOf(t.era);
      if (u < 0) throw new Error("Invalid era: " + t.era);
      u = la(u, n, 0, h.length - 1, o?.round), i.era = h[u], Ja(i);
      break;
    }
    case "year":
      var s, d;
      !((s = (d = i.calendar).isInverseEra) === null || s === void 0) && s.call(d, i) && (n = -n), i.year = la(t.year, n, -1 / 0, 9999, o?.round), i.year === -1 / 0 && (i.year = 1), i.calendar.balanceYearMonth && i.calendar.balanceYearMonth(i, t);
      break;
    case "month":
      i.month = la(t.month, n, 1, t.calendar.getMonthsInYear(t), o?.round);
      break;
    case "day":
      i.day = la(t.day, n, 1, t.calendar.getDaysInMonth(t), o?.round);
      break;
    default:
      throw new Error("Unsupported field " + e);
  }
  return t.calendar.balanceDate && t.calendar.balanceDate(i), Ja(i), i;
}
function mu(t, e, n, o) {
  let i = t.copy();
  switch (e) {
    case "hour": {
      let s = t.hour, d = 0, h = 23;
      if (o?.hourCycle === 12) {
        let u = s >= 12;
        d = u ? 12 : 0, h = u ? 23 : 11;
      }
      i.hour = la(s, n, d, h, o?.round);
      break;
    }
    case "minute":
      i.minute = la(t.minute, n, 0, 59, o?.round);
      break;
    case "second":
      i.second = la(t.second, n, 0, 59, o?.round);
      break;
    case "millisecond":
      i.millisecond = la(t.millisecond, n, 0, 999, o?.round);
      break;
    default:
      throw new Error("Unsupported field " + e);
  }
  return i;
}
function la(t, e, n, o, i = !1) {
  if (i) {
    t += Math.sign(e), t < n && (t = o);
    let s = Math.abs(e);
    e > 0 ? t = Math.ceil(t / s) * s : t = Math.floor(t / s) * s, t > o && (t = n);
  } else
    t += e, t < n ? t = o - (n - t - 1) : t > o && (t = n + (t - o - 1));
  return t;
}
function bu(t, e) {
  let n;
  if (e.years != null && e.years !== 0 || e.months != null && e.months !== 0 || e.weeks != null && e.weeks !== 0 || e.days != null && e.days !== 0) {
    let i = Si(ka(t), {
      years: e.years,
      months: e.months,
      weeks: e.weeks,
      days: e.days
    });
    n = qo(i, t.timeZone);
  } else
    n = Da(t) - t.offset;
  n += e.milliseconds || 0, n += (e.seconds || 0) * 1e3, n += (e.minutes || 0) * 6e4, n += (e.hours || 0) * 36e5;
  let o = Uo(n, t.timeZone);
  return eo(o, t.calendar);
}
function mv(t, e) {
  return bu(t, pu(e));
}
function bv(t, e, n, o) {
  switch (e) {
    case "hour": {
      let i = 0, s = 23;
      if (o?.hourCycle === 12) {
        let T = t.hour >= 12;
        i = T ? 12 : 0, s = T ? 23 : 11;
      }
      let d = ka(t), h = eo(li(d, {
        hour: i
      }), new gs()), u = [
        qo(h, t.timeZone, "earlier"),
        qo(h, t.timeZone, "later")
      ].filter((T) => Uo(T, t.timeZone).day === h.day)[0], I = eo(li(d, {
        hour: s
      }), new gs()), f = [
        qo(I, t.timeZone, "earlier"),
        qo(I, t.timeZone, "later")
      ].filter((T) => Uo(T, t.timeZone).day === I.day).pop(), m = Da(t) - t.offset, w = Math.floor(m / Is), P = m % Is;
      return m = la(w, n, Math.floor(u / Is), Math.floor(f / Is), o?.round) * Is + P, eo(Uo(m, t.timeZone), t.calendar);
    }
    case "minute":
    case "second":
    case "millisecond":
      return mu(t, e, n, o);
    case "era":
    case "year":
    case "month":
    case "day": {
      let i = Ol(ka(t), e, n, o), s = qo(i, t.timeZone);
      return eo(Uo(s, t.timeZone), t.calendar);
    }
    default:
      throw new Error("Unsupported field " + e);
  }
}
function Cv(t, e, n) {
  let o = ka(t), i = li(Tl(o, e), e);
  if (i.compare(o) === 0) return t;
  let s = qo(i, t.timeZone, n);
  return eo(Uo(s, t.timeZone), t.calendar);
}
const Pv = /^([+-]\d{6}|\d{4})-(\d{2})-(\d{2})$/, wv = /^([+-]\d{6}|\d{4})-(\d{2})-(\d{2})(?:T(\d{2}))?(?::(\d{2}))?(?::(\d{2}))?(\.\d+)?$/, xv = /^([+-]\d{6}|\d{4})-(\d{2})-(\d{2})(?:T(\d{2}))?(?::(\d{2}))?(?::(\d{2}))?(\.\d+)?(?:([+-]\d{2})(?::?(\d{2}))?(?::?(\d{2}))?)?\[(.*?)\]$/, Cu = /^([+-]\d{6}|\d{4})-(\d{2})-(\d{2})(?:T(\d{2}))?(?::(\d{2}))?(?::(\d{2}))?(\.\d+)?(?:(?:([+-]\d{2})(?::?(\d{2}))?)|Z)$/;
function Ll(t) {
  let e = t.match(Pv);
  if (!e)
    throw Cu.test(t) ? new Error(`Invalid ISO 8601 date string: ${t}. Use parseAbsolute() instead.`) : new Error("Invalid ISO 8601 date string: " + t);
  let n = new Ma(Zn(e[1], 0, 9999), Zn(e[2], 1, 12), 1);
  return n.day = Zn(e[3], 1, n.calendar.getDaysInMonth(n)), n;
}
function Pu(t) {
  let e = t.match(wv);
  if (!e)
    throw Cu.test(t) ? new Error(`Invalid ISO 8601 date time string: ${t}. Use parseAbsolute() instead.`) : new Error("Invalid ISO 8601 date time string: " + t);
  let n = Zn(e[1], -9999, 9999), o = n < 1 ? "BC" : "AD", i = new ua(o, n < 1 ? -n + 1 : n, Zn(e[2], 1, 12), 1, e[4] ? Zn(e[4], 0, 23) : 0, e[5] ? Zn(e[5], 0, 59) : 0, e[6] ? Zn(e[6], 0, 59) : 0, e[7] ? Zn(e[7], 0, 1 / 0) * 1e3 : 0);
  return i.day = Zn(e[3], 0, i.calendar.getDaysInMonth(i)), i;
}
function wu(t, e) {
  let n = t.match(xv);
  if (!n) throw new Error("Invalid ISO 8601 date time string: " + t);
  let o = Zn(n[1], -9999, 9999), i = o < 1 ? "BC" : "AD", s = new jo(i, o < 1 ? -o + 1 : o, Zn(n[2], 1, 12), 1, n[11], 0, n[4] ? Zn(n[4], 0, 23) : 0, n[5] ? Zn(n[5], 0, 59) : 0, n[6] ? Zn(n[6], 0, 59) : 0, n[7] ? Zn(n[7], 0, 1 / 0) * 1e3 : 0);
  s.day = Zn(n[3], 0, s.calendar.getDaysInMonth(s));
  let d = ka(s), h;
  if (n[8]) {
    let f = Zn(n[8], -23, 23);
    var u, I;
    if (s.offset = Math.sign(f) * (Math.abs(f) * 36e5 + Zn((u = n[9]) !== null && u !== void 0 ? u : "0", 0, 59) * 6e4 + Zn((I = n[10]) !== null && I !== void 0 ? I : "0", 0, 59) * 1e3), h = Da(s) - s.offset, !lv(d, s.timeZone).includes(h)) throw new Error(`Offset ${Su(s.offset)} is invalid for ${Fl(s)} in ${s.timeZone}`);
  } else
    h = qo(ka(d), s.timeZone, e);
  return Uo(h, s.timeZone);
}
function Zn(t, e, n) {
  let o = Number(t);
  if (o < e || o > n) throw new RangeError(`Value out of range: ${e} <= ${o} <= ${n}`);
  return o;
}
function Sv(t) {
  return `${String(t.hour).padStart(2, "0")}:${String(t.minute).padStart(2, "0")}:${String(t.second).padStart(2, "0")}${t.millisecond ? String(t.millisecond / 1e3).slice(1) : ""}`;
}
function xu(t) {
  let e = eo(t, new gs()), n;
  return e.era === "BC" ? n = e.year === 1 ? "0000" : "-" + String(Math.abs(1 - e.year)).padStart(6, "00") : n = String(e.year).padStart(4, "0"), `${n}-${String(e.month).padStart(2, "0")}-${String(e.day).padStart(2, "0")}`;
}
function Fl(t) {
  return `${xu(t)}T${Sv(t)}`;
}
function Su(t) {
  let e = Math.sign(t) < 0 ? "-" : "+";
  t = Math.abs(t);
  let n = Math.floor(t / 36e5), o = Math.floor(t % 36e5 / 6e4), i = Math.floor(t % 36e5 % 6e4 / 1e3), s = `${e}${String(n).padStart(2, "0")}:${String(o).padStart(2, "0")}`;
  return i !== 0 && (s += `:${String(i).padStart(2, "0")}`), s;
}
function Rv(t) {
  return `${Fl(t)}${Su(t.offset)}[${t.timeZone}]`;
}
function Iv(t, e) {
  if (e.has(t))
    throw new TypeError("Cannot initialize the same private elements twice on an object");
}
function Hl(t, e, n) {
  Iv(t, e), e.set(t, n);
}
function Nl(t) {
  let e = typeof t[0] == "object" ? t.shift() : new gs(), n;
  if (typeof t[0] == "string") n = t.shift();
  else {
    let d = e.getEras();
    n = d[d.length - 1];
  }
  let o = t.shift(), i = t.shift(), s = t.shift();
  return [
    e,
    n,
    o,
    i,
    s
  ];
}
var _v = /* @__PURE__ */ new WeakMap();
class Ma {
  /** Returns a copy of this date. */
  copy() {
    return this.era ? new Ma(this.calendar, this.era, this.year, this.month, this.day) : new Ma(this.calendar, this.year, this.month, this.day);
  }
  /** Returns a new `CalendarDate` with the given duration added to it. */
  add(e) {
    return Si(this, e);
  }
  /** Returns a new `CalendarDate` with the given duration subtracted from it. */
  subtract(e) {
    return yu(this, e);
  }
  /** Returns a new `CalendarDate` with the given fields set to the provided values. Other fields will be constrained accordingly. */
  set(e) {
    return Tl(this, e);
  }
  /**
  * Returns a new `CalendarDate` with the given field adjusted by a specified amount.
  * When the resulting value reaches the limits of the field, it wraps around.
  */
  cycle(e, n, o) {
    return Ol(this, e, n, o);
  }
  /** Converts the date to a native JavaScript Date object, with the time set to midnight in the given time zone. */
  toDate(e) {
    return vu(this, e);
  }
  /** Converts the date to an ISO 8601 formatted string. */
  toString() {
    return xu(this);
  }
  /** Compares this date with another. A negative result indicates that this date is before the given one, and a positive date indicates that it is after. */
  compare(e) {
    return cu(this, e);
  }
  constructor(...e) {
    Hl(this, _v, {
      writable: !0,
      value: void 0
    });
    let [n, o, i, s, d] = Nl(e);
    this.calendar = n, this.era = o, this.year = i, this.month = s, this.day = d, Ja(this);
  }
}
var Ev = /* @__PURE__ */ new WeakMap();
class ua {
  /** Returns a copy of this date. */
  copy() {
    return this.era ? new ua(this.calendar, this.era, this.year, this.month, this.day, this.hour, this.minute, this.second, this.millisecond) : new ua(this.calendar, this.year, this.month, this.day, this.hour, this.minute, this.second, this.millisecond);
  }
  /** Returns a new `CalendarDateTime` with the given duration added to it. */
  add(e) {
    return Si(this, e);
  }
  /** Returns a new `CalendarDateTime` with the given duration subtracted from it. */
  subtract(e) {
    return yu(this, e);
  }
  /** Returns a new `CalendarDateTime` with the given fields set to the provided values. Other fields will be constrained accordingly. */
  set(e) {
    return Tl(li(this, e), e);
  }
  /**
  * Returns a new `CalendarDateTime` with the given field adjusted by a specified amount.
  * When the resulting value reaches the limits of the field, it wraps around.
  */
  cycle(e, n, o) {
    switch (e) {
      case "era":
      case "year":
      case "month":
      case "day":
        return Ol(this, e, n, o);
      default:
        return mu(this, e, n, o);
    }
  }
  /** Converts the date to a native JavaScript Date object in the given time zone. */
  toDate(e, n) {
    return vu(this, e, n);
  }
  /** Converts the date to an ISO 8601 formatted string. */
  toString() {
    return Fl(this);
  }
  /** Compares this date with another. A negative result indicates that this date is before the given one, and a positive date indicates that it is after. */
  compare(e) {
    let n = cu(this, e);
    return n === 0 ? ov(this, ka(e)) : n;
  }
  constructor(...e) {
    Hl(this, Ev, {
      writable: !0,
      value: void 0
    });
    let [n, o, i, s, d] = Nl(e);
    this.calendar = n, this.era = o, this.year = i, this.month = s, this.day = d, this.hour = e.shift() || 0, this.minute = e.shift() || 0, this.second = e.shift() || 0, this.millisecond = e.shift() || 0, Ja(this);
  }
}
var Av = /* @__PURE__ */ new WeakMap();
class jo {
  /** Returns a copy of this date. */
  copy() {
    return this.era ? new jo(this.calendar, this.era, this.year, this.month, this.day, this.timeZone, this.offset, this.hour, this.minute, this.second, this.millisecond) : new jo(this.calendar, this.year, this.month, this.day, this.timeZone, this.offset, this.hour, this.minute, this.second, this.millisecond);
  }
  /** Returns a new `ZonedDateTime` with the given duration added to it. */
  add(e) {
    return bu(this, e);
  }
  /** Returns a new `ZonedDateTime` with the given duration subtracted from it. */
  subtract(e) {
    return mv(this, e);
  }
  /** Returns a new `ZonedDateTime` with the given fields set to the provided values. Other fields will be constrained accordingly. */
  set(e, n) {
    return Cv(this, e, n);
  }
  /**
  * Returns a new `ZonedDateTime` with the given field adjusted by a specified amount.
  * When the resulting value reaches the limits of the field, it wraps around.
  */
  cycle(e, n, o) {
    return bv(this, e, n, o);
  }
  /** Converts the date to a native JavaScript Date object. */
  toDate() {
    return hv(this);
  }
  /** Converts the date to an ISO 8601 formatted string, including the UTC offset and time zone identifier. */
  toString() {
    return Rv(this);
  }
  /** Converts the date to an ISO 8601 formatted string in UTC. */
  toAbsoluteString() {
    return this.toDate().toISOString();
  }
  /** Compares this date with another. A negative result indicates that this date is before the given one, and a positive date indicates that it is after. */
  compare(e) {
    return this.toDate().getTime() - uv(e, this.timeZone).toDate().getTime();
  }
  constructor(...e) {
    Hl(this, Av, {
      writable: !0,
      value: void 0
    });
    let [n, o, i, s, d] = Nl(e), h = e.shift(), u = e.shift();
    this.calendar = n, this.era = o, this.year = i, this.month = s, this.day = d, this.timeZone = h, this.offset = u, this.hour = e.shift() || 0, this.minute = e.shift() || 0, this.second = e.shift() || 0, this.millisecond = e.shift() || 0, Ja(this);
  }
}
let Fi = /* @__PURE__ */ new Map();
class No {
  /** Formats a date as a string according to the locale and format options passed to the constructor. */
  format(e) {
    return this.formatter.format(e);
  }
  /** Formats a date to an array of parts such as separators, numbers, punctuation, and more. */
  formatToParts(e) {
    return this.formatter.formatToParts(e);
  }
  /** Formats a date range as a string. */
  formatRange(e, n) {
    if (typeof this.formatter.formatRange == "function")
      return this.formatter.formatRange(e, n);
    if (n < e) throw new RangeError("End date must be >= start date");
    return `${this.formatter.format(e)} – ${this.formatter.format(n)}`;
  }
  /** Formats a date range as an array of parts. */
  formatRangeToParts(e, n) {
    if (typeof this.formatter.formatRangeToParts == "function")
      return this.formatter.formatRangeToParts(e, n);
    if (n < e) throw new RangeError("End date must be >= start date");
    let o = this.formatter.formatToParts(e), i = this.formatter.formatToParts(n);
    return [
      ...o.map((s) => ({
        ...s,
        source: "startRange"
      })),
      {
        type: "literal",
        value: " – ",
        source: "shared"
      },
      ...i.map((s) => ({
        ...s,
        source: "endRange"
      }))
    ];
  }
  /** Returns the resolved formatting options based on the values passed to the constructor. */
  resolvedOptions() {
    let e = this.formatter.resolvedOptions();
    return Mv() && (this.resolvedHourCycle || (this.resolvedHourCycle = Tv(e.locale, this.options)), e.hourCycle = this.resolvedHourCycle, e.hour12 = this.resolvedHourCycle === "h11" || this.resolvedHourCycle === "h12"), e.calendar === "ethiopic-amete-alem" && (e.calendar = "ethioaa"), e;
  }
  constructor(e, n = {}) {
    this.formatter = Ru(e, n), this.options = n;
  }
}
const Dv = {
  true: {
    // Only Japanese uses the h11 style for 12 hour time. All others use h12.
    ja: "h11"
  },
  false: {}
};
function Ru(t, e = {}) {
  if (typeof e.hour12 == "boolean" && kv()) {
    e = {
      ...e
    };
    let i = Dv[String(e.hour12)][t.split("-")[0]], s = e.hour12 ? "h12" : "h23";
    e.hourCycle = i ?? s, delete e.hour12;
  }
  let n = t + (e ? Object.entries(e).sort((i, s) => i[0] < s[0] ? -1 : 1).join() : "");
  if (Fi.has(n)) return Fi.get(n);
  let o = new Intl.DateTimeFormat(t, e);
  return Fi.set(n, o), o;
}
let Hi = null;
function kv() {
  return Hi == null && (Hi = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    hour12: !1
  }).format(new Date(2020, 2, 3, 0)) === "24"), Hi;
}
let Ni = null;
function Mv() {
  return Ni == null && (Ni = new Intl.DateTimeFormat("fr", {
    hour: "numeric",
    hour12: !1
  }).resolvedOptions().hourCycle === "h12"), Ni;
}
function Tv(t, e) {
  if (!e.timeStyle && !e.hour) return;
  t = t.replace(/(-u-)?-nu-[a-zA-Z0-9]+/, ""), t += (t.includes("-u-") ? "" : "-u") + "-nu-latn";
  let n = Ru(t, {
    ...e,
    timeZone: void 0
    // use local timezone
  }), o = parseInt(n.formatToParts(new Date(2020, 2, 3, 0)).find((s) => s.type === "hour").value, 10), i = parseInt(n.formatToParts(new Date(2020, 2, 3, 23)).find((s) => s.type === "hour").value, 10);
  if (o === 0 && i === 23) return "h23";
  if (o === 24 && i === 23) return "h24";
  if (o === 0 && i === 11) return "h11";
  if (o === 12 && i === 11) return "h12";
  throw new Error("Unexpected hour cycle result");
}
function Ov(t) {
  if (!Ta || !t)
    return null;
  let e = t.querySelector("[data-bits-announcer]");
  const n = (i) => {
    const s = t.createElement("div");
    return s.role = "log", s.ariaLive = i, s.setAttribute("aria-relevant", "additions"), s;
  };
  if (!da(e)) {
    const i = t.createElement("div");
    i.style.cssText = Sh, i.setAttribute("data-bits-announcer", ""), i.appendChild(n("assertive")), i.appendChild(n("polite")), e = i, t.body.insertBefore(e, t.body.firstChild);
  }
  return {
    getLog: (i) => {
      if (!da(e))
        return null;
      const s = e.querySelector(`[aria-live="${i}"]`);
      return da(s) ? s : null;
    }
  };
}
function di(t) {
  const e = Ov(t);
  function n(o, i = "assertive", s = 7500) {
    if (!e || !Ta || !t)
      return;
    const d = e.getLog(i), h = t.createElement("div");
    return typeof o == "number" ? o = o.toString() : o === null ? o = "Empty" : o = o.trim(), h.innerText = o, i === "assertive" ? d?.replaceChildren(h) : d?.appendChild(h), setTimeout(() => {
      h.remove();
    }, s);
  }
  return {
    announce: n
  };
}
const Lv = {
  defaultValue: void 0,
  granularity: "day"
};
function Fv(t) {
  const e = { ...Lv, ...t }, { defaultValue: n, granularity: o, minValue: i, maxValue: s } = e;
  if (Array.isArray(n) && n.length)
    return n[n.length - 1];
  if (n && !Array.isArray(n))
    return n;
  {
    let d = /* @__PURE__ */ new Date();
    i && d < i.toDate(Ea()) ? d = i.toDate(Ea()) : s && d > s.toDate(Ea()) && (d = s.toDate(Ea()));
    const h = d.getFullYear(), u = d.getMonth() + 1, I = d.getDate();
    return ["hour", "minute", "second"].includes(o ?? "day") ? new ua(h, u, I, 0, 0, 0) : new Ma(h, u, I);
  }
}
function Iu(t, e) {
  let n;
  return e instanceof jo ? n = wu(t) : e instanceof ua ? n = Pu(t) : n = Ll(t), n.calendar !== e.calendar ? eo(n, e.calendar) : n;
}
function jr(t, e = Ea()) {
  return t instanceof jo ? t.toDate() : t.toDate(e);
}
function Hv(t) {
  if (t instanceof Ma)
    return "date";
  if (t instanceof ua)
    return "datetime";
  if (t instanceof jo)
    return "zoneddatetime";
  throw new Error("Unknown date type");
}
function Nv(t, e) {
  switch (e) {
    case "date":
      return Ll(t);
    case "datetime":
      return Pu(t);
    case "zoneddatetime":
      return wu(t);
    default:
      throw new Error(`Unknown date type: ${e}`);
  }
}
function $v(t) {
  return t instanceof ua;
}
function $l(t) {
  return t instanceof jo;
}
function ci(t) {
  return $v(t) || $l(t);
}
function Bs(t) {
  if (t instanceof Date) {
    const e = t.getFullYear(), n = t.getMonth() + 1;
    return new Date(e, n, 0).getDate();
  } else
    return t.set({ day: 100 }).day;
}
function Ga(t, e) {
  return t.compare(e) < 0;
}
function Bv(t, e) {
  return t.compare(e) > 0;
}
function Kd(t, e, n) {
  const o = du(t, n);
  return e > o ? t.subtract({ days: o + 7 - e }) : e === o ? t : t.subtract({ days: o - e });
}
function Yd(t, e, n) {
  const o = du(t, n), i = e === 0 ? 6 : e - 1;
  return o === i ? t : o > i ? t.add({ days: 7 - o + i }) : t.add({ days: i - o });
}
const Ri = ["day", "month", "year"], Bl = ["hour", "minute", "second", "dayPeriod"], qv = ["literal", "timeZoneName"], js = [
  ...Ri,
  ...Bl
], Uv = [
  ...js,
  ...qv
], Vv = [
  "ach",
  "af",
  "am",
  "an",
  "ar",
  "ast",
  "az",
  "be",
  "bg",
  "bn",
  "br",
  "bs",
  "ca",
  "cak",
  "ckb",
  "cs",
  "cy",
  "da",
  "de",
  "dsb",
  "el",
  "en",
  "eo",
  "es",
  "et",
  "eu",
  "fa",
  "ff",
  "fi",
  "fr",
  "fy",
  "ga",
  "gd",
  "gl",
  "he",
  "hr",
  "hsb",
  "hu",
  "ia",
  "id",
  "it",
  "ja",
  "ka",
  "kk",
  "kn",
  "ko",
  "lb",
  "lo",
  "lt",
  "lv",
  "meh",
  "ml",
  "ms",
  "nl",
  "nn",
  "no",
  "oc",
  "pl",
  "pt",
  "rm",
  "ro",
  "ru",
  "sc",
  "scn",
  "sk",
  "sl",
  "sr",
  "sv",
  "szl",
  "tg",
  "th",
  "tr",
  "uk",
  "zh-CN",
  "zh-TW"
], jv = ["year", "month", "day"], $i = {
  ach: { year: "mwaka", month: "dwe", day: "nino" },
  af: { year: "jjjj", month: "mm", day: "dd" },
  am: { year: "ዓዓዓዓ", month: "ሚሜ", day: "ቀቀ" },
  an: { year: "aaaa", month: "mm", day: "dd" },
  ar: { year: "سنة", month: "شهر", day: "يوم" },
  ast: { year: "aaaa", month: "mm", day: "dd" },
  az: { year: "iiii", month: "aa", day: "gg" },
  be: { year: "гггг", month: "мм", day: "дд" },
  bg: { year: "гггг", month: "мм", day: "дд" },
  bn: { year: "yyyy", month: "মিমি", day: "dd" },
  br: { year: "bbbb", month: "mm", day: "dd" },
  bs: { year: "gggg", month: "mm", day: "dd" },
  ca: { year: "aaaa", month: "mm", day: "dd" },
  cak: { year: "jjjj", month: "ii", day: "q'q'" },
  ckb: { year: "ساڵ", month: "مانگ", day: "ڕۆژ" },
  cs: { year: "rrrr", month: "mm", day: "dd" },
  cy: { year: "bbbb", month: "mm", day: "dd" },
  da: { year: "åååå", month: "mm", day: "dd" },
  de: { year: "jjjj", month: "mm", day: "tt" },
  dsb: { year: "llll", month: "mm", day: "źź" },
  el: { year: "εεεε", month: "μμ", day: "ηη" },
  en: { year: "yyyy", month: "mm", day: "dd" },
  eo: { year: "jjjj", month: "mm", day: "tt" },
  es: { year: "aaaa", month: "mm", day: "dd" },
  et: { year: "aaaa", month: "kk", day: "pp" },
  eu: { year: "uuuu", month: "hh", day: "ee" },
  fa: { year: "سال", month: "ماه", day: "روز" },
  ff: { year: "hhhh", month: "ll", day: "ññ" },
  fi: { year: "vvvv", month: "kk", day: "pp" },
  fr: { year: "aaaa", month: "mm", day: "jj" },
  fy: { year: "jjjj", month: "mm", day: "dd" },
  ga: { year: "bbbb", month: "mm", day: "ll" },
  gd: { year: "bbbb", month: "mm", day: "ll" },
  gl: { year: "aaaa", month: "mm", day: "dd" },
  he: { year: "שנה", month: "חודש", day: "יום" },
  hr: { year: "gggg", month: "mm", day: "dd" },
  hsb: { year: "llll", month: "mm", day: "dd" },
  hu: { year: "éééé", month: "hh", day: "nn" },
  ia: { year: "aaaa", month: "mm", day: "dd" },
  id: { year: "tttt", month: "bb", day: "hh" },
  it: { year: "aaaa", month: "mm", day: "gg" },
  ja: { year: " 年 ", month: "月", day: "日" },
  ka: { year: "წწწწ", month: "თთ", day: "რრ" },
  kk: { year: "жжжж", month: "аа", day: "кк" },
  kn: { year: "ವವವವ", month: "ಮಿಮೀ", day: "ದಿದಿ" },
  ko: { year: "연도", month: "월", day: "일" },
  lb: { year: "jjjj", month: "mm", day: "dd" },
  lo: { year: "ປປປປ", month: "ດດ", day: "ວວ" },
  lt: { year: "mmmm", month: "mm", day: "dd" },
  lv: { year: "gggg", month: "mm", day: "dd" },
  meh: { year: "aaaa", month: "mm", day: "dd" },
  ml: { year: "വർഷം", month: "മാസം", day: "തീയതി" },
  ms: { year: "tttt", month: "mm", day: "hh" },
  nl: { year: "jjjj", month: "mm", day: "dd" },
  nn: { year: "åååå", month: "mm", day: "dd" },
  no: { year: "åååå", month: "mm", day: "dd" },
  oc: { year: "aaaa", month: "mm", day: "jj" },
  pl: { year: "rrrr", month: "mm", day: "dd" },
  pt: { year: "aaaa", month: "mm", day: "dd" },
  rm: { year: "oooo", month: "mm", day: "dd" },
  ro: { year: "aaaa", month: "ll", day: "zz" },
  ru: { year: "гггг", month: "мм", day: "дд" },
  sc: { year: "aaaa", month: "mm", day: "dd" },
  scn: { year: "aaaa", month: "mm", day: "jj" },
  sk: { year: "rrrr", month: "mm", day: "dd" },
  sl: { year: "llll", month: "mm", day: "dd" },
  sr: { year: "гггг", month: "мм", day: "дд" },
  sv: { year: "åååå", month: "mm", day: "dd" },
  szl: { year: "rrrr", month: "mm", day: "dd" },
  tg: { year: "сссс", month: "мм", day: "рр" },
  th: { year: "ปปปป", month: "ดด", day: "วว" },
  tr: { year: "yyyy", month: "aa", day: "gg" },
  uk: { year: "рррр", month: "мм", day: "дд" },
  "zh-CN": { year: "年", month: "月", day: "日" },
  "zh-TW": { year: "年", month: "月", day: "日" }
};
function Kv(t) {
  if (Qd(t))
    return $i[t];
  {
    const e = Wv(t);
    return Qd(e) ? $i[e] : $i.en;
  }
}
function Bi(t, e, n) {
  return Yv(t) ? Kv(n)[t] : zv(t) ? e : Qv(t) ? "––" : "";
}
function Qd(t) {
  return Vv.includes(t);
}
function Yv(t) {
  return jv.includes(t);
}
function Qv(t) {
  return t === "hour" || t === "minute" || t === "second";
}
function zv(t) {
  return t === "era" || t === "dayPeriod";
}
function Wv(t) {
  return Intl.Locale ? new Intl.Locale(t).language : t.split("-")[0];
}
function qi(t) {
  const e = ["hour", "minute", "second"], n = js.map((o) => o === "dayPeriod" ? [o, "AM"] : [o, null]).filter(([o]) => o === "literal" || o === null ? !1 : t === "day" ? !e.includes(o) : !0);
  return Object.fromEntries(n);
}
function Jv(t) {
  const { segmentValues: e, formatter: n, locale: o, dateRef: i } = t, s = Object.keys(e).reduce((h, u) => {
    if (!_u(u))
      return h;
    if ("hour" in e && u === "dayPeriod") {
      const I = e[u];
      Ia(I) ? h[u] = Bi(u, "AM", o) : h[u] = I;
    } else
      h[u] = d(u);
    return h;
  }, {});
  function d(h) {
    if ("hour" in e) {
      const u = e[h], I = typeof u == "string" && u?.startsWith("0"), f = u !== null ? Number.parseInt(u) : null;
      if (u === "0" && h !== "year")
        return "0";
      if (!Ia(u) && !Ia(f)) {
        const m = n.part(i.set({ [h]: u }), h, {
          hourCycle: t.hourCycle === 24 ? "h23" : void 0
        }), w = t.hourCycle === 12 || t.hourCycle === void 0 && Au(o) === 12;
        if (h === "hour" && w) {
          if (f > 12) {
            const P = f - 12;
            return P === 0 ? "12" : P < 10 ? `0${P}` : `${P}`;
          }
          return f === 0 ? "12" : f < 10 ? `0${f}` : `${f}`;
        }
        return h === "year" ? `${u}` : I && m.length === 1 ? `0${m}` : m;
      } else
        return Bi(h, "", o);
    } else {
      if (Ii(h)) {
        const u = e[h], I = typeof u == "string" && u?.startsWith("0");
        if (u === "0")
          return "0";
        if (Ia(u))
          return Bi(h, "", o);
        {
          const f = n.part(i.set({ [h]: u }), h);
          return h === "year" ? `${u}` : I && f.length === 1 ? `0${f}` : f;
        }
      }
      return "";
    }
  }
  return s;
}
function Gv(t) {
  const { granularity: e, dateRef: n, formatter: o, contentObj: i, hideTimeZone: s, hourCycle: d } = t;
  return o.toParts(n, Xv(e, d)).map((I) => ["literal", "dayPeriod", "timeZoneName", null].includes(I.type) || !_u(I.type) ? {
    part: I.type,
    value: I.value
  } : {
    part: I.type,
    value: i[I.type]
  }).filter((I) => !(Ia(I.part) || Ia(I.value) || I.part === "timeZoneName" && (!$l(n) || s)));
}
function Zv(t) {
  const e = Jv(t), n = Gv({
    contentObj: e,
    ...t
  });
  return {
    obj: e,
    arr: n
  };
}
function Xv(t, e) {
  const n = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
    hourCycle: e === 24 ? "h23" : void 0,
    hour12: e === 24 ? !1 : void 0
  };
  return t === "day" && (delete n.second, delete n.hour, delete n.minute, delete n.timeZoneName), t === "hour" && delete n.minute, t === "minute" && delete n.second, n;
}
function zd() {
  return js.reduce((t, e) => (t[e] = {
    lastKeyZero: !1,
    hasLeftFocus: !0,
    updating: null
  }, t), {});
}
function Ii(t) {
  return Ri.includes(t);
}
function _u(t) {
  return js.includes(t);
}
function eg(t) {
  return Uv.includes(t);
}
function Eu(t) {
  return !Ta || !t ? [] : Vl(t).map((n) => n.dataset.segment).filter((n) => js.includes(n));
}
function tg(t) {
  const { segmentObj: e, fieldNode: n, dateRef: o } = t, i = Eu(n);
  let s = o;
  for (const d of i)
    if ("hour" in e) {
      const h = e[d];
      if (Ia(h))
        continue;
      s = s.set({ [d]: e[d] });
    } else if (Ii(d)) {
      const h = e[d];
      if (Ia(h))
        continue;
      s = s.set({ [d]: e[d] });
    }
  return s;
}
function ng(t, e) {
  const n = Eu(e);
  for (const o of n)
    if ("hour" in t) {
      if (t[o] === null)
        return !1;
    } else if (Ii(o) && t[o] === null)
      return !1;
  return !0;
}
function rg(t) {
  return typeof t != "object" || t === null ? !1 : Object.entries(t).every(([e, n]) => (Bl.includes(e) || Ri.includes(e)) && (e === "dayPeriod" ? n === "AM" || n === "PM" || n === null : typeof n == "string" || typeof n == "number" || n === null));
}
function og(t, e) {
  return e || (ci(t) ? "minute" : "day");
}
function ql(t) {
  return !!([
    Hc,
    yi,
    mi,
    qs,
    Us,
    Nc,
    $c
  ].includes(t) || bi(t));
}
function ag(t, e) {
  if (!Ta)
    return !1;
  const n = Vl(e);
  return n.length ? n[0].id === t : !1;
}
function sg(t) {
  const { id: e, formatter: n, value: o, doc: i } = t;
  if (!Ta)
    return;
  const s = n.selectedDate(o), d = i.getElementById(e);
  if (d)
    d.innerText = `Selected Date: ${s}`;
  else {
    const h = i.createElement("div");
    h.style.cssText = Fc({
      display: "none"
    }), h.id = e, h.innerText = `Selected Date: ${s}`, i.body.appendChild(h);
  }
}
function ig(t, e) {
  if (!Ta)
    return;
  const n = e.getElementById(t);
  n && e.body.removeChild(n);
}
function Au(t) {
  return new Intl.DateTimeFormat(t, { hour: "numeric" }).formatToParts(/* @__PURE__ */ new Date("2023-01-01T13:00:00")).find((i) => i.type === "hour")?.value === "1" ? 12 : 24;
}
function Ks(t, e) {
  const n = t.currentTarget;
  if (!da(n))
    return;
  const { prev: o, next: i } = Ul(n, e);
  if (t.key === qs) {
    if (!o)
      return;
    o.focus();
  } else if (t.key === Us) {
    if (!i)
      return;
    i.focus();
  }
}
function lg(t, e) {
  const n = e.indexOf(t);
  if (n === e.length - 1 || n === -1)
    return null;
  const o = n + 1;
  return e[o];
}
function dg(t, e) {
  const n = e.indexOf(t);
  if (n === 0 || n === -1)
    return null;
  const o = n - 1;
  return e[o];
}
function Ul(t, e) {
  const n = Vl(e);
  return n.length ? {
    next: lg(t, n),
    prev: dg(t, n)
  } : {
    next: null,
    prev: null
  };
}
function Du(t, e) {
  const n = t.currentTarget;
  if (!da(n))
    return;
  const { next: o } = Ul(n, e);
  o && o.focus();
}
function ku(t, e) {
  const n = t.currentTarget;
  if (!da(n))
    return;
  const { prev: o } = Ul(n, e);
  o && o.focus();
}
function Ys(t) {
  return t === Us || t === qs;
}
function Vl(t) {
  return t ? Array.from(t.querySelectorAll("[data-segment]")).filter((n) => {
    if (!da(n))
      return !1;
    const o = n.dataset.segment;
    return o === "trigger" ? !0 : !(!eg(o) || o === "literal");
  }) : [];
}
const cg = {
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric"
};
function Mu(t) {
  let e = t.initialLocale;
  function n(P) {
    e = P;
  }
  function o() {
    return e;
  }
  function i(P, T) {
    return new No(e, T).format(P);
  }
  function s(P, T = !0) {
    return ci(P) && T ? i(jr(P), {
      dateStyle: "long",
      timeStyle: "long"
    }) : i(jr(P), {
      dateStyle: "long"
    });
  }
  function d(P) {
    if (typeof t.monthFormat.current != "function" && typeof t.yearFormat.current != "function")
      return new No(e, {
        month: t.monthFormat.current,
        year: t.yearFormat.current
      }).format(P);
    const T = typeof t.monthFormat.current == "function" ? t.monthFormat.current(P.getMonth() + 1) : new No(e, { month: t.monthFormat.current }).format(P), p = typeof t.yearFormat.current == "function" ? t.yearFormat.current(P.getFullYear()) : new No(e, { year: t.yearFormat.current }).format(P);
    return `${T} ${p}`;
  }
  function h(P) {
    return new No(e, { month: "long" }).format(P);
  }
  function u(P) {
    return new No(e, { year: "numeric" }).format(P);
  }
  function I(P, T) {
    return $l(P) ? new No(e, {
      ...T,
      timeZone: P.timeZone
    }).formatToParts(jr(P)) : new No(e, T).formatToParts(jr(P));
  }
  function f(P, T = "narrow") {
    return new No(e, { weekday: T }).format(P);
  }
  function m(P, T = void 0) {
    return new No(e, {
      hour: "numeric",
      minute: "numeric",
      hourCycle: T === 24 ? "h23" : void 0
    }).formatToParts(P).find((a) => a.type === "dayPeriod")?.value === "PM" ? "PM" : "AM";
  }
  function w(P, T, p = {}) {
    const x = { ...cg, ...p }, k = I(P, x).find((Z) => Z.type === T);
    return k ? k.value : "";
  }
  return {
    setLocale: n,
    getLocale: o,
    fullMonth: h,
    fullYear: u,
    fullMonthAndYear: d,
    toParts: I,
    custom: i,
    part: w,
    dayPeriod: m,
    selectedDate: s,
    dayOfWeek: f
  };
}
function ug(t) {
  return !(!da(t) || !t.hasAttribute("data-bits-day"));
}
function Wd(t, e) {
  const n = [];
  let o = t.add({ days: 1 });
  const i = e;
  for (; o.compare(i) < 0; )
    n.push(o), o = o.add({ days: 1 });
  return n;
}
function Ui(t) {
  const { dateObj: e, weekStartsOn: n, fixedWeeks: o, locale: i } = t, s = Bs(e), d = Array.from({ length: s }, (x, a) => e.set({ day: a + 1 })), h = ul(e), u = av(e), I = n !== void 0 ? Kd(h, n, "en-US") : Kd(h, 0, i), f = n !== void 0 ? Yd(u, n, "en-US") : Yd(u, 0, i), m = Wd(I.subtract({ days: 1 }), h), w = Wd(u, f.add({ days: 1 })), P = m.length + d.length + w.length;
  if (o && P < 42) {
    const x = 42 - P;
    let a = w[w.length - 1];
    a || (a = e.add({ months: 1 }).set({ day: 1 }));
    let k = x;
    w.length === 0 && (k = x - 1, w.push(a));
    const Z = Array.from({ length: k }, (V, oe) => {
      const _ = oe + 1;
      return a.add({ days: _ });
    });
    w.push(...Z);
  }
  const T = m.concat(d, w), p = Rh(T, 7);
  return { value: e, dates: T, weeks: p };
}
function Qs(t) {
  const { numberOfMonths: e, dateObj: n, ...o } = t, i = [];
  if (!e || e === 1)
    return i.push(Ui({ ...o, dateObj: n })), i;
  i.push(Ui({ ...o, dateObj: n }));
  for (let s = 1; s < e; s++) {
    const d = n.add({ months: s });
    i.push(Ui({ ...o, dateObj: d }));
  }
  return i;
}
function Vi(t) {
  return t ? Array.from(t.querySelectorAll("[data-bits-day]:not([data-disabled]):not([data-outside-visible-months])")).filter((n) => da(n)) : [];
}
function Jd(t, e) {
  const n = t.getAttribute("data-value");
  n && (e.current = Iu(n, e.current));
}
function hg({
  node: t,
  add: e,
  placeholder: n,
  calendarNode: o,
  isPrevButtonDisabled: i,
  isNextButtonDisabled: s,
  months: d,
  numberOfMonths: h
}) {
  const u = Vi(o);
  if (!u.length) return;
  const f = u.indexOf(t) + e;
  if (Ei(f, u)) {
    const m = u[f];
    return Jd(m, n), m.focus();
  }
  if (f < 0) {
    if (i) return;
    const m = d[0]?.value;
    if (!m) return;
    n.current = m.subtract({ months: h }), Id(() => {
      const w = Vi(o);
      if (!w.length) return;
      const P = w.length - Math.abs(f);
      if (Ei(P, w)) {
        const T = w[P];
        return Jd(T, n), T.focus();
      }
    });
  }
  if (f >= u.length) {
    if (s) return;
    const m = d[0]?.value;
    if (!m) return;
    n.current = m.add({ months: h }), Id(() => {
      const w = Vi(o);
      if (!w.length) return;
      const P = f - u.length;
      if (Ei(P, w))
        return w[P].focus();
    });
  }
}
const Gd = [
  mi,
  yi,
  qs,
  Us
], Zd = [Hc, $c];
function fg({ event: t, handleCellClick: e, shiftFocus: n, placeholderValue: o }) {
  const i = t.target;
  if (!ug(i) || !Gd.includes(t.key) && !Zd.includes(t.key)) return;
  t.preventDefault();
  const s = {
    [mi]: 7,
    [yi]: -7,
    [qs]: -1,
    [Us]: 1
  };
  if (Gd.includes(t.key)) {
    const d = s[t.key];
    d !== void 0 && n(i, d);
  }
  if (Zd.includes(t.key)) {
    const d = i.getAttribute("data-value");
    if (!d) return;
    e(t, Iu(d, o));
  }
}
function vg({
  months: t,
  setMonths: e,
  numberOfMonths: n,
  pagedNavigation: o,
  weekStartsOn: i,
  locale: s,
  fixedWeeks: d,
  setPlaceholder: h
}) {
  const u = t[0]?.value;
  if (u)
    if (o)
      h(u.add({ months: n }));
    else {
      const I = u.add({ months: 1 }), f = Qs({
        dateObj: I,
        weekStartsOn: i,
        locale: s,
        fixedWeeks: d,
        numberOfMonths: n
      });
      h(I), e(f);
    }
}
function gg({
  months: t,
  setMonths: e,
  numberOfMonths: n,
  pagedNavigation: o,
  weekStartsOn: i,
  locale: s,
  fixedWeeks: d,
  setPlaceholder: h
}) {
  const u = t[0]?.value;
  if (u)
    if (o)
      h(u.subtract({ months: n }));
    else {
      const I = u.subtract({ months: 1 }), f = Qs({
        dateObj: I,
        weekStartsOn: i,
        locale: s,
        fixedWeeks: d,
        numberOfMonths: n
      });
      h(I), e(f);
    }
}
function pg({ months: t, formatter: e, weekdayFormat: n }) {
  if (!t.length) return [];
  const i = t[0].weeks[0];
  return i ? i.map((s) => e.dayOfWeek(jr(s), n)) : [];
}
function yg(t) {
  Ge(() => {
    const e = t.weekStartsOn.current, n = t.locale.current, o = t.fixedWeeks.current, i = t.numberOfMonths.current;
    Vr(() => {
      const s = t.placeholder.current;
      if (!s) return;
      const d = { weekStartsOn: e, locale: n, fixedWeeks: o, numberOfMonths: i };
      t.setMonths(Qs({ ...d, dateObj: s }));
    });
  });
}
function mg({ calendarNode: t, label: e, accessibleHeadingId: n }) {
  const o = Bc(t), i = o.createElement("div");
  i.style.cssText = Fc({
    border: "0px",
    clip: "rect(0px, 0px, 0px, 0px)",
    clipPath: "inset(50%)",
    height: "1px",
    margin: "-1px",
    overflow: "hidden",
    padding: "0px",
    position: "absolute",
    whiteSpace: "nowrap",
    width: "1px"
  });
  const s = o.createElement("div");
  return s.textContent = e, s.id = n, s.role = "heading", s.ariaLevel = "2", t.insertBefore(i, t.firstChild), i.appendChild(s), () => {
    const d = o.getElementById(n);
    d && (i.parentElement?.removeChild(i), d.remove());
  };
}
function bg({
  placeholder: t,
  getVisibleMonths: e,
  weekStartsOn: n,
  locale: o,
  fixedWeeks: i,
  numberOfMonths: s,
  setMonths: d
}) {
  Ge(() => {
    t.current, Vr(() => {
      if (e().some((u) => Ml(u, t.current)))
        return;
      const h = {
        weekStartsOn: n.current,
        locale: o.current,
        fixedWeeks: i.current,
        numberOfMonths: s.current
      };
      d(Qs({ ...h, dateObj: t.current }));
    });
  });
}
function Cg({ maxValue: t, months: e, disabled: n }) {
  if (!t || !e.length) return !1;
  if (n) return !0;
  const o = e[e.length - 1]?.value;
  if (!o) return !1;
  const i = o.add({ months: 1 }).set({ day: 1 });
  return Bv(i, t);
}
function Pg({ minValue: t, months: e, disabled: n }) {
  if (!t || !e.length) return !1;
  if (n) return !0;
  const o = e[0]?.value;
  if (!o) return !1;
  const i = o.subtract({ months: 1 }).set({ day: 35 });
  return Ga(i, t);
}
function wg({ months: t, locale: e, formatter: n }) {
  if (!t.length) return "";
  if (e !== n.getLocale() && n.setLocale(e), t.length === 1) {
    const f = jr(t[0].value);
    return `${n.fullMonthAndYear(f)}`;
  }
  const o = jr(t[0].value), i = jr(t[t.length - 1].value), s = n.fullMonth(o), d = n.fullMonth(i), h = n.fullYear(o), u = n.fullYear(i);
  return h === u ? `${s} - ${d} ${u}` : `${s} ${h} - ${d} ${u}`;
}
function xg({ fullCalendarLabel: t, id: e, isInvalid: n, disabled: o, readonly: i }) {
  return {
    id: e,
    role: "application",
    "aria-label": t,
    "data-invalid": mn(n),
    "data-disabled": mn(o),
    "data-readonly": mn(i)
  };
}
function Sg(t) {
  const n = Bc(t.target).querySelector("[data-bits-day][data-focused]");
  n && (t.preventDefault(), n?.focus());
}
function Rg(t) {
  if (!Ta) return;
  const e = Array.from(t.querySelectorAll("[data-bits-day]:not([aria-disabled=true])"));
  if (e.length === 0) return;
  const n = e[0], o = n?.getAttribute("data-value"), i = n?.getAttribute("data-type");
  if (!(!o || !i))
    return Nv(o, i);
}
function Ig({
  ref: t,
  placeholder: e,
  defaultPlaceholder: n,
  minValue: o,
  maxValue: i,
  isDateDisabled: s
}) {
  function d(h) {
    return !!(s.current(h) || o.current && Ga(h, o.current) || i.current && Ga(i.current, h));
  }
  vs(() => t.current, () => {
    t.current && e.current && Ra(e.current, n) && d(n) && (e.current = Rg(t.current) ?? n);
  });
}
function _g(t, e) {
  return !t || !e ? t : ci(t) && ci(e) ? t.set({
    hour: e.hour,
    minute: e.minute,
    millisecond: e.millisecond,
    second: e.second
  }) : t;
}
const Eg = qc({
  component: "calendar",
  parts: [
    "root",
    "grid",
    "cell",
    "next-button",
    "prev-button",
    "day",
    "grid-body",
    "grid-head",
    "grid-row",
    "head-cell",
    "header",
    "heading",
    "month-select",
    "year-select"
  ]
});
function Ag(t) {
  const e = (/* @__PURE__ */ new Date()).getFullYear(), n = Math.max(t.placeholderYear, e);
  let o, i;
  if (t.minValue)
    o = t.minValue.year;
  else {
    const d = n - 100;
    o = t.placeholderYear < d ? t.placeholderYear - 10 : d;
  }
  t.maxValue ? i = t.maxValue.year : i = n + 10, o > i && (o = i);
  const s = i - o + 1;
  return Array.from({ length: s }, (d, h) => o + h);
}
const Ro = new Ci("Calendar.Root | RangeCalender.Root");
class jl {
  static create(e) {
    return Ro.set(new jl(e));
  }
  opts;
  #e = C(() => this.months.map((e) => e.value));
  get visibleMonths() {
    return r(this.#e);
  }
  set visibleMonths(e) {
    g(this.#e, e);
  }
  formatter;
  accessibleHeadingId = Uc();
  domContext;
  attachment;
  #t = be(hr([]));
  get months() {
    return r(this.#t);
  }
  set months(e) {
    g(this.#t, e, !0);
  }
  announcer;
  constructor(e) {
    this.opts = e, this.attachment = wr(this.opts.ref), this.domContext = new bl(e.ref), this.announcer = di(null), this.formatter = Mu({
      initialLocale: this.opts.locale.current,
      monthFormat: this.opts.monthFormat,
      yearFormat: this.opts.yearFormat
    }), this.setMonths = this.setMonths.bind(this), this.nextPage = this.nextPage.bind(this), this.prevPage = this.prevPage.bind(this), this.prevYear = this.prevYear.bind(this), this.nextYear = this.nextYear.bind(this), this.setYear = this.setYear.bind(this), this.setMonth = this.setMonth.bind(this), this.isOutsideVisibleMonths = this.isOutsideVisibleMonths.bind(this), this.isDateDisabled = this.isDateDisabled.bind(this), this.isDateSelected = this.isDateSelected.bind(this), this.shiftFocus = this.shiftFocus.bind(this), this.handleCellClick = this.handleCellClick.bind(this), this.handleMultipleUpdate = this.handleMultipleUpdate.bind(this), this.handleSingleUpdate = this.handleSingleUpdate.bind(this), this.onkeydown = this.onkeydown.bind(this), this.getBitsAttr = this.getBitsAttr.bind(this), Vc(() => {
      this.announcer = di(this.domContext.getDocument());
    }), this.months = Qs({
      dateObj: this.opts.placeholder.current,
      weekStartsOn: this.opts.weekStartsOn.current,
      locale: this.opts.locale.current,
      fixedWeeks: this.opts.fixedWeeks.current,
      numberOfMonths: this.opts.numberOfMonths.current
    }), this.#a(), this.#i(), this.#l(), bg({
      placeholder: this.opts.placeholder,
      getVisibleMonths: () => this.visibleMonths,
      weekStartsOn: this.opts.weekStartsOn,
      locale: this.opts.locale,
      fixedWeeks: this.opts.fixedWeeks,
      numberOfMonths: this.opts.numberOfMonths,
      setMonths: (n) => this.months = n
    }), yg({
      fixedWeeks: this.opts.fixedWeeks,
      locale: this.opts.locale,
      numberOfMonths: this.opts.numberOfMonths,
      placeholder: this.opts.placeholder,
      setMonths: this.setMonths,
      weekStartsOn: this.opts.weekStartsOn
    }), vs(() => this.fullCalendarLabel, (n) => {
      const o = this.domContext.getElementById(this.accessibleHeadingId);
      o && (o.textContent = n);
    }), vs(() => this.opts.value.current, () => {
      const n = this.opts.value.current;
      if (Array.isArray(n) && n.length) {
        const o = n[n.length - 1];
        o && this.opts.placeholder.current !== o && (this.opts.placeholder.current = o);
      } else !Array.isArray(n) && n && this.opts.placeholder.current !== n && (this.opts.placeholder.current = n);
    }), Ig({
      placeholder: e.placeholder,
      defaultPlaceholder: e.defaultPlaceholder,
      isDateDisabled: e.isDateDisabled,
      maxValue: e.maxValue,
      minValue: e.minValue,
      ref: e.ref
    });
  }
  setMonths(e) {
    this.months = e;
  }
  #n = C(
    /**
     * This derived state holds an array of localized day names for the current
     * locale and calendar view. It dynamically syncs with the 'weekStartsOn' option,
     * updating its content when the option changes. Using this state to render the
     * calendar's days of the week is strongly recommended, as it guarantees that
     * the days are correctly formatted for the current locale and calendar view.
     */
    () => pg({
      months: this.months,
      formatter: this.formatter,
      weekdayFormat: this.opts.weekdayFormat.current
    })
  );
  get weekdays() {
    return r(this.#n);
  }
  set weekdays(e) {
    g(this.#n, e);
  }
  #r = C(() => Vr(() => this.opts.placeholder.current.year));
  get initialPlaceholderYear() {
    return r(this.#r);
  }
  set initialPlaceholderYear(e) {
    g(this.#r, e);
  }
  #o = C(() => Ag({
    minValue: this.opts.minValue.current,
    maxValue: this.opts.maxValue.current,
    placeholderYear: this.initialPlaceholderYear
  }));
  get defaultYears() {
    return r(this.#o);
  }
  set defaultYears(e) {
    g(this.#o, e);
  }
  #a() {
    Ge(() => {
      if (Vr(() => this.opts.initialFocus.current)) {
        const n = this.opts.ref.current?.querySelector("[data-focused]");
        n && n.focus();
      }
    });
  }
  #i() {
    Ge(() => this.opts.ref.current ? mg({
      calendarNode: this.opts.ref.current,
      label: this.fullCalendarLabel,
      accessibleHeadingId: this.accessibleHeadingId
    }) : void 0);
  }
  #l() {
    tu(() => {
      this.formatter.getLocale() !== this.opts.locale.current && this.formatter.setLocale(this.opts.locale.current);
    });
  }
  /**
   * Navigates to the next page of the calendar.
   */
  nextPage() {
    vg({
      fixedWeeks: this.opts.fixedWeeks.current,
      locale: this.opts.locale.current,
      numberOfMonths: this.opts.numberOfMonths.current,
      pagedNavigation: this.opts.pagedNavigation.current,
      setMonths: this.setMonths,
      setPlaceholder: (e) => this.opts.placeholder.current = e,
      weekStartsOn: this.opts.weekStartsOn.current,
      months: this.months
    });
  }
  /**
   * Navigates to the previous page of the calendar.
   */
  prevPage() {
    gg({
      fixedWeeks: this.opts.fixedWeeks.current,
      locale: this.opts.locale.current,
      numberOfMonths: this.opts.numberOfMonths.current,
      pagedNavigation: this.opts.pagedNavigation.current,
      setMonths: this.setMonths,
      setPlaceholder: (e) => this.opts.placeholder.current = e,
      weekStartsOn: this.opts.weekStartsOn.current,
      months: this.months
    });
  }
  nextYear() {
    this.opts.placeholder.current = this.opts.placeholder.current.add({ years: 1 });
  }
  prevYear() {
    this.opts.placeholder.current = this.opts.placeholder.current.subtract({ years: 1 });
  }
  setYear(e) {
    this.opts.placeholder.current = this.opts.placeholder.current.set({ year: e });
  }
  setMonth(e) {
    this.opts.placeholder.current = this.opts.placeholder.current.set({ month: e });
  }
  #s = C(() => Cg({
    maxValue: this.opts.maxValue.current,
    months: this.months,
    disabled: this.opts.disabled.current
  }));
  get isNextButtonDisabled() {
    return r(this.#s);
  }
  set isNextButtonDisabled(e) {
    g(this.#s, e);
  }
  #d = C(() => Pg({
    minValue: this.opts.minValue.current,
    months: this.months,
    disabled: this.opts.disabled.current
  }));
  get isPrevButtonDisabled() {
    return r(this.#d);
  }
  set isPrevButtonDisabled(e) {
    g(this.#d, e);
  }
  #c = C(() => {
    const e = this.opts.value.current, n = this.opts.isDateDisabled.current, o = this.opts.isDateUnavailable.current;
    if (Array.isArray(e)) {
      if (!e.length) return !1;
      for (const i of e)
        if (n(i) || o(i)) return !0;
    } else {
      if (!e) return !1;
      if (n(e) || o(e)) return !0;
    }
    return !1;
  });
  get isInvalid() {
    return r(this.#c);
  }
  set isInvalid(e) {
    g(this.#c, e);
  }
  #u = C(() => (this.opts.monthFormat.current, this.opts.yearFormat.current, wg({
    months: this.months,
    formatter: this.formatter,
    locale: this.opts.locale.current
  })));
  get headingValue() {
    return r(this.#u);
  }
  set headingValue(e) {
    g(this.#u, e);
  }
  #h = C(() => `${this.opts.calendarLabel.current} ${this.headingValue}`);
  get fullCalendarLabel() {
    return r(this.#h);
  }
  set fullCalendarLabel(e) {
    g(this.#h, e);
  }
  isOutsideVisibleMonths(e) {
    return !this.visibleMonths.some((n) => Ml(e, n));
  }
  isDateDisabled(e) {
    if (this.opts.isDateDisabled.current(e) || this.opts.disabled.current) return !0;
    const n = this.opts.minValue.current, o = this.opts.maxValue.current;
    return !!(n && Ga(e, n) || o && Ga(o, e));
  }
  isDateSelected(e) {
    const n = this.opts.value.current;
    return Array.isArray(n) ? n.some((o) => Ra(o, e)) : n ? Ra(n, e) : !1;
  }
  shiftFocus(e, n) {
    return hg({
      node: e,
      add: n,
      placeholder: this.opts.placeholder,
      calendarNode: this.opts.ref.current,
      isPrevButtonDisabled: this.isPrevButtonDisabled,
      isNextButtonDisabled: this.isNextButtonDisabled,
      months: this.months,
      numberOfMonths: this.opts.numberOfMonths.current
    });
  }
  #f(e) {
    if (this.opts.type.current !== "multiple" || !this.opts.maxDays.current) return !0;
    const n = e.length;
    return !(this.opts.maxDays.current && n > this.opts.maxDays.current);
  }
  handleCellClick(e, n) {
    if (this.opts.readonly.current || this.opts.isDateDisabled.current?.(n) || this.opts.isDateUnavailable.current?.(n))
      return;
    const o = this.opts.value.current;
    if (this.opts.type.current === "multiple")
      (Array.isArray(o) || o === void 0) && (this.opts.value.current = this.handleMultipleUpdate(o, n));
    else if (!Array.isArray(o)) {
      const s = this.handleSingleUpdate(o, n);
      s ? this.announcer.announce(`Selected Date: ${this.formatter.selectedDate(s, !1)}`, "polite") : this.announcer.announce("Selected date is now empty.", "polite", 5e3), this.opts.value.current = _g(s, o), s !== void 0 && this.opts.onDateSelect?.current?.();
    }
  }
  handleMultipleUpdate(e, n) {
    if (!e) {
      const s = [n];
      return this.#f(s) ? s : [n];
    }
    if (!Array.isArray(e))
      return;
    const o = e.findIndex((s) => Ra(s, n)), i = this.opts.preventDeselect.current;
    if (o === -1) {
      const s = [...e, n];
      return this.#f(s) ? s : [n];
    } else {
      if (i)
        return e;
      {
        const s = e.filter((d) => !Ra(d, n));
        if (!s.length) {
          this.opts.placeholder.current = n;
          return;
        }
        return s;
      }
    }
  }
  handleSingleUpdate(e, n) {
    if (!e) return n;
    if (!this.opts.preventDeselect.current && Ra(e, n)) {
      this.opts.placeholder.current = n;
      return;
    }
    return n;
  }
  onkeydown(e) {
    fg({
      event: e,
      handleCellClick: this.handleCellClick,
      shiftFocus: this.shiftFocus,
      placeholderValue: this.opts.placeholder.current
    });
  }
  #v = C(() => ({ months: this.months, weekdays: this.weekdays }));
  get snippetProps() {
    return r(this.#v);
  }
  set snippetProps(e) {
    g(this.#v, e);
  }
  getBitsAttr = (e) => Eg.getAttr(e);
  #g = C(() => ({
    ...xg({
      fullCalendarLabel: this.fullCalendarLabel,
      id: this.opts.id.current,
      isInvalid: this.isInvalid,
      disabled: this.opts.disabled.current,
      readonly: this.opts.readonly.current
    }),
    [this.getBitsAttr("root")]: "",
    //
    onkeydown: this.onkeydown,
    ...this.attachment
  }));
  get props() {
    return r(this.#g);
  }
  set props(e) {
    g(this.#g, e);
  }
}
class Kl {
  static create(e) {
    return new Kl(e, Ro.get());
  }
  opts;
  root;
  attachment;
  constructor(e, n) {
    this.opts = e, this.root = n, this.attachment = wr(this.opts.ref);
  }
  #e = C(() => ({
    id: this.opts.id.current,
    "aria-hidden": Cl(!0),
    "data-disabled": mn(this.root.opts.disabled.current),
    "data-readonly": mn(this.root.opts.readonly.current),
    [this.root.getBitsAttr("heading")]: "",
    ...this.attachment
  }));
  get props() {
    return r(this.#e);
  }
  set props(e) {
    g(this.#e, e);
  }
}
const Tu = new Ci("Calendar.Cell | RangeCalendar.Cell");
class Yl {
  static create(e) {
    return Tu.set(new Yl(e, Ro.get()));
  }
  opts;
  root;
  #e = C(() => jr(this.opts.date.current));
  get cellDate() {
    return r(this.#e);
  }
  set cellDate(e) {
    g(this.#e, e);
  }
  #t = C(() => this.root.opts.isDateUnavailable.current(this.opts.date.current));
  get isUnavailable() {
    return r(this.#t);
  }
  set isUnavailable(e) {
    g(this.#t, e);
  }
  #n = C(() => tv(this.opts.date.current, Ea()));
  get isDateToday() {
    return r(this.#n);
  }
  set isDateToday(e) {
    g(this.#n, e);
  }
  #r = C(() => !Ml(this.opts.date.current, this.opts.month.current));
  get isOutsideMonth() {
    return r(this.#r);
  }
  set isOutsideMonth(e) {
    g(this.#r, e);
  }
  #o = C(() => this.root.isOutsideVisibleMonths(this.opts.date.current));
  get isOutsideVisibleMonths() {
    return r(this.#o);
  }
  set isOutsideVisibleMonths(e) {
    g(this.#o, e);
  }
  #a = C(() => this.root.isDateDisabled(this.opts.date.current) || this.isOutsideMonth && this.root.opts.disableDaysOutsideMonth.current);
  get isDisabled() {
    return r(this.#a);
  }
  set isDisabled(e) {
    g(this.#a, e);
  }
  #i = C(() => Ra(this.opts.date.current, this.root.opts.placeholder.current));
  get isFocusedDate() {
    return r(this.#i);
  }
  set isFocusedDate(e) {
    g(this.#i, e);
  }
  #l = C(() => this.root.isDateSelected(this.opts.date.current));
  get isSelectedDate() {
    return r(this.#l);
  }
  set isSelectedDate(e) {
    g(this.#l, e);
  }
  #s = C(() => this.root.formatter.custom(this.cellDate, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  }));
  get labelText() {
    return r(this.#s);
  }
  set labelText(e) {
    g(this.#s, e);
  }
  attachment;
  constructor(e, n) {
    this.opts = e, this.root = n, this.attachment = wr(this.opts.ref);
  }
  #d = C(() => ({
    disabled: this.isDisabled,
    unavailable: this.isUnavailable,
    selected: this.isSelectedDate,
    day: `${this.opts.date.current.day}`
  }));
  get snippetProps() {
    return r(this.#d);
  }
  set snippetProps(e) {
    g(this.#d, e);
  }
  #c = C(() => this.isDisabled || this.isOutsideMonth && this.root.opts.disableDaysOutsideMonth.current || this.isUnavailable);
  get ariaDisabled() {
    return r(this.#c);
  }
  set ariaDisabled(e) {
    g(this.#c, e);
  }
  #u = C(() => ({
    "data-unavailable": mn(this.isUnavailable),
    "data-today": this.isDateToday ? "" : void 0,
    "data-outside-month": this.isOutsideMonth ? "" : void 0,
    "data-outside-visible-months": this.isOutsideVisibleMonths ? "" : void 0,
    "data-focused": this.isFocusedDate ? "" : void 0,
    "data-selected": mn(this.isSelectedDate),
    "data-value": this.opts.date.current.toString(),
    "data-type": Hv(this.opts.date.current),
    "data-disabled": mn(this.isDisabled || this.isOutsideMonth && this.root.opts.disableDaysOutsideMonth.current)
  }));
  get sharedDataAttrs() {
    return r(this.#u);
  }
  set sharedDataAttrs(e) {
    g(this.#u, e);
  }
  #h = C(() => ({
    id: this.opts.id.current,
    role: "gridcell",
    "aria-selected": Vo(this.isSelectedDate),
    "aria-disabled": Vo(this.ariaDisabled),
    ...this.sharedDataAttrs,
    [this.root.getBitsAttr("cell")]: "",
    ...this.attachment
  }));
  get props() {
    return r(this.#h);
  }
  set props(e) {
    g(this.#h, e);
  }
}
class Ql {
  static create(e) {
    return new Ql(e, Tu.get());
  }
  opts;
  cell;
  attachment;
  constructor(e, n) {
    this.opts = e, this.cell = n, this.onclick = this.onclick.bind(this), this.attachment = wr(this.opts.ref);
  }
  #e = C(() => this.cell.isOutsideMonth && this.cell.root.opts.disableDaysOutsideMonth.current || this.cell.isDisabled ? void 0 : this.cell.isFocusedDate ? 0 : -1);
  onclick(e) {
    this.cell.isDisabled || this.cell.root.handleCellClick(e, this.cell.opts.date.current);
  }
  #t = C(() => ({
    disabled: this.cell.isDisabled,
    unavailable: this.cell.isUnavailable,
    selected: this.cell.isSelectedDate,
    day: `${this.cell.opts.date.current.day}`
  }));
  get snippetProps() {
    return r(this.#t);
  }
  set snippetProps(e) {
    g(this.#t, e);
  }
  #n = C(() => ({
    id: this.opts.id.current,
    role: "button",
    "aria-label": this.cell.labelText,
    "aria-disabled": Vo(this.cell.ariaDisabled),
    ...this.cell.sharedDataAttrs,
    tabindex: r(this.#e),
    [this.cell.root.getBitsAttr("day")]: "",
    "data-bits-day": "",
    onclick: this.onclick,
    ...this.attachment
  }));
  get props() {
    return r(this.#n);
  }
  set props(e) {
    g(this.#n, e);
  }
}
class zl {
  static create(e) {
    return new zl(e, Ro.get());
  }
  opts;
  root;
  #e = C(() => this.root.isNextButtonDisabled);
  get isDisabled() {
    return r(this.#e);
  }
  set isDisabled(e) {
    g(this.#e, e);
  }
  attachment;
  constructor(e, n) {
    this.opts = e, this.root = n, this.onclick = this.onclick.bind(this), this.attachment = wr(this.opts.ref);
  }
  onclick(e) {
    this.isDisabled || this.root.nextPage();
  }
  #t = C(() => ({
    id: this.opts.id.current,
    role: "button",
    type: "button",
    "aria-label": "Next",
    "aria-disabled": Vo(this.isDisabled),
    "data-disabled": mn(this.isDisabled),
    disabled: this.isDisabled,
    [this.root.getBitsAttr("next-button")]: "",
    //
    onclick: this.onclick,
    ...this.attachment
  }));
  get props() {
    return r(this.#t);
  }
  set props(e) {
    g(this.#t, e);
  }
}
class Wl {
  static create(e) {
    return new Wl(e, Ro.get());
  }
  opts;
  root;
  #e = C(() => this.root.isPrevButtonDisabled);
  get isDisabled() {
    return r(this.#e);
  }
  set isDisabled(e) {
    g(this.#e, e);
  }
  attachment;
  constructor(e, n) {
    this.opts = e, this.root = n, this.onclick = this.onclick.bind(this), this.attachment = wr(this.opts.ref);
  }
  onclick(e) {
    this.isDisabled || this.root.prevPage();
  }
  #t = C(() => ({
    id: this.opts.id.current,
    role: "button",
    type: "button",
    "aria-label": "Previous",
    "aria-disabled": Vo(this.isDisabled),
    "data-disabled": mn(this.isDisabled),
    disabled: this.isDisabled,
    [this.root.getBitsAttr("prev-button")]: "",
    //
    onclick: this.onclick,
    ...this.attachment
  }));
  get props() {
    return r(this.#t);
  }
  set props(e) {
    g(this.#t, e);
  }
}
class Jl {
  static create(e) {
    return new Jl(e, Ro.get());
  }
  opts;
  root;
  attachment;
  constructor(e, n) {
    this.opts = e, this.root = n, this.attachment = wr(this.opts.ref);
  }
  #e = C(() => ({
    id: this.opts.id.current,
    tabindex: -1,
    role: "grid",
    "aria-readonly": Vo(this.root.opts.readonly.current),
    "aria-disabled": Vo(this.root.opts.disabled.current),
    "data-readonly": mn(this.root.opts.readonly.current),
    "data-disabled": mn(this.root.opts.disabled.current),
    [this.root.getBitsAttr("grid")]: "",
    ...this.attachment
  }));
  get props() {
    return r(this.#e);
  }
  set props(e) {
    g(this.#e, e);
  }
}
class Gl {
  static create(e) {
    return new Gl(e, Ro.get());
  }
  opts;
  root;
  attachment;
  constructor(e, n) {
    this.opts = e, this.root = n, this.attachment = wr(this.opts.ref);
  }
  #e = C(() => ({
    id: this.opts.id.current,
    "data-disabled": mn(this.root.opts.disabled.current),
    "data-readonly": mn(this.root.opts.readonly.current),
    [this.root.getBitsAttr("grid-body")]: "",
    ...this.attachment
  }));
  get props() {
    return r(this.#e);
  }
  set props(e) {
    g(this.#e, e);
  }
}
class Zl {
  static create(e) {
    return new Zl(e, Ro.get());
  }
  opts;
  root;
  attachment;
  constructor(e, n) {
    this.opts = e, this.root = n, this.attachment = wr(this.opts.ref);
  }
  #e = C(() => ({
    id: this.opts.id.current,
    "data-disabled": mn(this.root.opts.disabled.current),
    "data-readonly": mn(this.root.opts.readonly.current),
    [this.root.getBitsAttr("grid-head")]: "",
    ...this.attachment
  }));
  get props() {
    return r(this.#e);
  }
  set props(e) {
    g(this.#e, e);
  }
}
class Xl {
  static create(e) {
    return new Xl(e, Ro.get());
  }
  opts;
  root;
  attachment;
  constructor(e, n) {
    this.opts = e, this.root = n, this.attachment = wr(this.opts.ref);
  }
  #e = C(() => ({
    id: this.opts.id.current,
    "data-disabled": mn(this.root.opts.disabled.current),
    "data-readonly": mn(this.root.opts.readonly.current),
    [this.root.getBitsAttr("grid-row")]: "",
    ...this.attachment
  }));
  get props() {
    return r(this.#e);
  }
  set props(e) {
    g(this.#e, e);
  }
}
class ed {
  static create(e) {
    return new ed(e, Ro.get());
  }
  opts;
  root;
  attachment;
  constructor(e, n) {
    this.opts = e, this.root = n, this.attachment = wr(this.opts.ref);
  }
  #e = C(() => ({
    id: this.opts.id.current,
    "data-disabled": mn(this.root.opts.disabled.current),
    "data-readonly": mn(this.root.opts.readonly.current),
    [this.root.getBitsAttr("head-cell")]: "",
    ...this.attachment
  }));
  get props() {
    return r(this.#e);
  }
  set props(e) {
    g(this.#e, e);
  }
}
class td {
  static create(e) {
    return new td(e, Ro.get());
  }
  opts;
  root;
  attachment;
  constructor(e, n) {
    this.opts = e, this.root = n, this.attachment = wr(this.opts.ref);
  }
  #e = C(() => ({
    id: this.opts.id.current,
    "data-disabled": mn(this.root.opts.disabled.current),
    "data-readonly": mn(this.root.opts.readonly.current),
    [this.root.getBitsAttr("header")]: "",
    ...this.attachment
  }));
  get props() {
    return r(this.#e);
  }
  set props(e) {
    g(this.#e, e);
  }
}
var Dg = Q("<div><!></div>");
function Ou(t, e) {
  const n = Yr();
  Wt(e, !0);
  let o = R(e, "children", 7), i = R(e, "child", 7), s = R(e, "ref", 15, null), d = R(e, "id", 23, () => sn(n)), h = Dr(e, [
    "$$slots",
    "$$events",
    "$$legacy",
    "$$host",
    "children",
    "child",
    "ref",
    "id"
  ]);
  const u = Ql.create({
    id: Oe(() => d()),
    ref: Oe(() => s(), (p) => s(p))
  }), I = C(() => Ar(h, u.props));
  var f = {
    get children() {
      return o();
    },
    set children(p) {
      o(p), S();
    },
    get child() {
      return i();
    },
    set child(p) {
      i(p), S();
    },
    get ref() {
      return s();
    },
    set ref(p = null) {
      s(p), S();
    },
    get id() {
      return d();
    },
    set id(p = sn(n)) {
      d(p), S();
    }
  }, m = Re(), w = W(m);
  {
    var P = (p) => {
      var x = Re(), a = W(x);
      {
        let k = C(() => ({ props: r(I), ...u.snippetProps }));
        Kt(a, i, () => r(k));
      }
      A(p, x);
    }, T = (p) => {
      var x = Dg();
      Kr(x, () => ({ ...r(I) }));
      var a = O(x);
      {
        var k = (V) => {
          var oe = Re(), _ = W(oe);
          Kt(_, () => o() ?? Pr, () => u.snippetProps), A(V, oe);
        }, Z = (V) => {
          var oe = ca();
          Ie(() => te(oe, u.cell.opts.date.current.day)), A(V, oe);
        };
        Ce(a, (V) => {
          o() ? V(k) : V(Z, -1);
        });
      }
      M(x), A(p, x);
    };
    Ce(w, (p) => {
      i() ? p(P) : p(T, -1);
    });
  }
  return A(t, m), Jt(f);
}
Gt(Ou, { children: {}, child: {}, ref: {}, id: {} }, [], [], { mode: "open" });
var kg = Q("<table><!></table>");
function Lu(t, e) {
  const n = Yr();
  Wt(e, !0);
  let o = R(e, "children", 7), i = R(e, "child", 7), s = R(e, "ref", 15, null), d = R(e, "id", 23, () => sn(n)), h = Dr(e, [
    "$$slots",
    "$$events",
    "$$legacy",
    "$$host",
    "children",
    "child",
    "ref",
    "id"
  ]);
  const u = Jl.create({
    id: Oe(() => d()),
    ref: Oe(() => s(), (p) => s(p))
  }), I = C(() => Ar(h, u.props));
  var f = {
    get children() {
      return o();
    },
    set children(p) {
      o(p), S();
    },
    get child() {
      return i();
    },
    set child(p) {
      i(p), S();
    },
    get ref() {
      return s();
    },
    set ref(p = null) {
      s(p), S();
    },
    get id() {
      return d();
    },
    set id(p = sn(n)) {
      d(p), S();
    }
  }, m = Re(), w = W(m);
  {
    var P = (p) => {
      var x = Re(), a = W(x);
      Kt(a, i, () => ({ props: r(I) })), A(p, x);
    }, T = (p) => {
      var x = kg();
      Kr(x, () => ({ ...r(I) }));
      var a = O(x);
      Kt(a, () => o() ?? Pr), M(x), A(p, x);
    };
    Ce(w, (p) => {
      i() ? p(P) : p(T, -1);
    });
  }
  return A(t, m), Jt(f);
}
Gt(Lu, { children: {}, child: {}, ref: {}, id: {} }, [], [], { mode: "open" });
var Mg = Q("<tbody><!></tbody>");
function Fu(t, e) {
  const n = Yr();
  Wt(e, !0);
  let o = R(e, "children", 7), i = R(e, "child", 7), s = R(e, "ref", 15, null), d = R(e, "id", 23, () => sn(n)), h = Dr(e, [
    "$$slots",
    "$$events",
    "$$legacy",
    "$$host",
    "children",
    "child",
    "ref",
    "id"
  ]);
  const u = Gl.create({
    id: Oe(() => d()),
    ref: Oe(() => s(), (p) => s(p))
  }), I = C(() => Ar(h, u.props));
  var f = {
    get children() {
      return o();
    },
    set children(p) {
      o(p), S();
    },
    get child() {
      return i();
    },
    set child(p) {
      i(p), S();
    },
    get ref() {
      return s();
    },
    set ref(p = null) {
      s(p), S();
    },
    get id() {
      return d();
    },
    set id(p = sn(n)) {
      d(p), S();
    }
  }, m = Re(), w = W(m);
  {
    var P = (p) => {
      var x = Re(), a = W(x);
      Kt(a, i, () => ({ props: r(I) })), A(p, x);
    }, T = (p) => {
      var x = Mg();
      Kr(x, () => ({ ...r(I) }));
      var a = O(x);
      Kt(a, () => o() ?? Pr), M(x), A(p, x);
    };
    Ce(w, (p) => {
      i() ? p(P) : p(T, -1);
    });
  }
  return A(t, m), Jt(f);
}
Gt(Fu, { children: {}, child: {}, ref: {}, id: {} }, [], [], { mode: "open" });
var Tg = Q("<td><!></td>");
function Hu(t, e) {
  const n = Yr();
  Wt(e, !0);
  let o = R(e, "children", 7), i = R(e, "child", 7), s = R(e, "ref", 15, null), d = R(e, "id", 23, () => sn(n)), h = R(e, "date", 7), u = R(e, "month", 7), I = Dr(e, [
    "$$slots",
    "$$events",
    "$$legacy",
    "$$host",
    "children",
    "child",
    "ref",
    "id",
    "date",
    "month"
  ]);
  const f = Yl.create({
    id: Oe(() => d()),
    ref: Oe(() => s(), (a) => s(a)),
    date: Oe(() => h()),
    month: Oe(() => u())
  }), m = C(() => Ar(I, f.props));
  var w = {
    get children() {
      return o();
    },
    set children(a) {
      o(a), S();
    },
    get child() {
      return i();
    },
    set child(a) {
      i(a), S();
    },
    get ref() {
      return s();
    },
    set ref(a = null) {
      s(a), S();
    },
    get id() {
      return d();
    },
    set id(a = sn(n)) {
      d(a), S();
    },
    get date() {
      return h();
    },
    set date(a) {
      h(a), S();
    },
    get month() {
      return u();
    },
    set month(a) {
      u(a), S();
    }
  }, P = Re(), T = W(P);
  {
    var p = (a) => {
      var k = Re(), Z = W(k);
      {
        let V = C(() => ({ props: r(m), ...f.snippetProps }));
        Kt(Z, i, () => r(V));
      }
      A(a, k);
    }, x = (a) => {
      var k = Tg();
      Kr(k, () => ({ ...r(m) }));
      var Z = O(k);
      Kt(Z, () => o() ?? Pr, () => f.snippetProps), M(k), A(a, k);
    };
    Ce(T, (a) => {
      i() ? a(p) : a(x, -1);
    });
  }
  return A(t, P), Jt(w);
}
Gt(
  Hu,
  {
    children: {},
    child: {},
    ref: {},
    id: {},
    date: {},
    month: {}
  },
  [],
  [],
  { mode: "open" }
);
var Og = Q("<thead><!></thead>");
function Nu(t, e) {
  const n = Yr();
  Wt(e, !0);
  let o = R(e, "children", 7), i = R(e, "child", 7), s = R(e, "ref", 15, null), d = R(e, "id", 23, () => sn(n)), h = Dr(e, [
    "$$slots",
    "$$events",
    "$$legacy",
    "$$host",
    "children",
    "child",
    "ref",
    "id"
  ]);
  const u = Zl.create({
    id: Oe(() => d()),
    ref: Oe(() => s(), (p) => s(p))
  }), I = C(() => Ar(h, u.props));
  var f = {
    get children() {
      return o();
    },
    set children(p) {
      o(p), S();
    },
    get child() {
      return i();
    },
    set child(p) {
      i(p), S();
    },
    get ref() {
      return s();
    },
    set ref(p = null) {
      s(p), S();
    },
    get id() {
      return d();
    },
    set id(p = sn(n)) {
      d(p), S();
    }
  }, m = Re(), w = W(m);
  {
    var P = (p) => {
      var x = Re(), a = W(x);
      Kt(a, i, () => ({ props: r(I) })), A(p, x);
    }, T = (p) => {
      var x = Og();
      Kr(x, () => ({ ...r(I) }));
      var a = O(x);
      Kt(a, () => o() ?? Pr), M(x), A(p, x);
    };
    Ce(w, (p) => {
      i() ? p(P) : p(T, -1);
    });
  }
  return A(t, m), Jt(f);
}
Gt(Nu, { children: {}, child: {}, ref: {}, id: {} }, [], [], { mode: "open" });
var Lg = Q("<th><!></th>");
function $u(t, e) {
  const n = Yr();
  Wt(e, !0);
  let o = R(e, "children", 7), i = R(e, "child", 7), s = R(e, "ref", 15, null), d = R(e, "id", 23, () => sn(n)), h = Dr(e, [
    "$$slots",
    "$$events",
    "$$legacy",
    "$$host",
    "children",
    "child",
    "ref",
    "id"
  ]);
  const u = ed.create({
    id: Oe(() => d()),
    ref: Oe(() => s(), (p) => s(p))
  }), I = C(() => Ar(h, u.props));
  var f = {
    get children() {
      return o();
    },
    set children(p) {
      o(p), S();
    },
    get child() {
      return i();
    },
    set child(p) {
      i(p), S();
    },
    get ref() {
      return s();
    },
    set ref(p = null) {
      s(p), S();
    },
    get id() {
      return d();
    },
    set id(p = sn(n)) {
      d(p), S();
    }
  }, m = Re(), w = W(m);
  {
    var P = (p) => {
      var x = Re(), a = W(x);
      Kt(a, i, () => ({ props: r(I) })), A(p, x);
    }, T = (p) => {
      var x = Lg();
      Kr(x, () => ({ ...r(I) }));
      var a = O(x);
      Kt(a, () => o() ?? Pr), M(x), A(p, x);
    };
    Ce(w, (p) => {
      i() ? p(P) : p(T, -1);
    });
  }
  return A(t, m), Jt(f);
}
Gt($u, { children: {}, child: {}, ref: {}, id: {} }, [], [], { mode: "open" });
var Fg = Q("<tr><!></tr>");
function vl(t, e) {
  const n = Yr();
  Wt(e, !0);
  let o = R(e, "children", 7), i = R(e, "child", 7), s = R(e, "ref", 15, null), d = R(e, "id", 23, () => sn(n)), h = Dr(e, [
    "$$slots",
    "$$events",
    "$$legacy",
    "$$host",
    "children",
    "child",
    "ref",
    "id"
  ]);
  const u = Xl.create({
    id: Oe(() => d()),
    ref: Oe(() => s(), (p) => s(p))
  }), I = C(() => Ar(h, u.props));
  var f = {
    get children() {
      return o();
    },
    set children(p) {
      o(p), S();
    },
    get child() {
      return i();
    },
    set child(p) {
      i(p), S();
    },
    get ref() {
      return s();
    },
    set ref(p = null) {
      s(p), S();
    },
    get id() {
      return d();
    },
    set id(p = sn(n)) {
      d(p), S();
    }
  }, m = Re(), w = W(m);
  {
    var P = (p) => {
      var x = Re(), a = W(x);
      Kt(a, i, () => ({ props: r(I) })), A(p, x);
    }, T = (p) => {
      var x = Fg();
      Kr(x, () => ({ ...r(I) }));
      var a = O(x);
      Kt(a, () => o() ?? Pr), M(x), A(p, x);
    };
    Ce(w, (p) => {
      i() ? p(P) : p(T, -1);
    });
  }
  return A(t, m), Jt(f);
}
Gt(vl, { children: {}, child: {}, ref: {}, id: {} }, [], [], { mode: "open" });
var Hg = Q("<header><!></header>");
function Bu(t, e) {
  const n = Yr();
  Wt(e, !0);
  let o = R(e, "children", 7), i = R(e, "child", 7), s = R(e, "ref", 15, null), d = R(e, "id", 23, () => sn(n)), h = Dr(e, [
    "$$slots",
    "$$events",
    "$$legacy",
    "$$host",
    "children",
    "child",
    "ref",
    "id"
  ]);
  const u = td.create({
    id: Oe(() => d()),
    ref: Oe(() => s(), (p) => s(p))
  }), I = C(() => Ar(h, u.props));
  var f = {
    get children() {
      return o();
    },
    set children(p) {
      o(p), S();
    },
    get child() {
      return i();
    },
    set child(p) {
      i(p), S();
    },
    get ref() {
      return s();
    },
    set ref(p = null) {
      s(p), S();
    },
    get id() {
      return d();
    },
    set id(p = sn(n)) {
      d(p), S();
    }
  }, m = Re(), w = W(m);
  {
    var P = (p) => {
      var x = Re(), a = W(x);
      Kt(a, i, () => ({ props: r(I) })), A(p, x);
    }, T = (p) => {
      var x = Hg();
      Kr(x, () => ({ ...r(I) }));
      var a = O(x);
      Kt(a, () => o() ?? Pr), M(x), A(p, x);
    };
    Ce(w, (p) => {
      i() ? p(P) : p(T, -1);
    });
  }
  return A(t, m), Jt(f);
}
Gt(Bu, { children: {}, child: {}, ref: {}, id: {} }, [], [], { mode: "open" });
var Ng = Q("<div><!></div>");
function qu(t, e) {
  const n = Yr();
  Wt(e, !0);
  let o = R(e, "children", 7), i = R(e, "child", 7), s = R(e, "ref", 15, null), d = R(e, "id", 23, () => sn(n)), h = Dr(e, [
    "$$slots",
    "$$events",
    "$$legacy",
    "$$host",
    "children",
    "child",
    "ref",
    "id"
  ]);
  const u = Kl.create({
    id: Oe(() => d()),
    ref: Oe(() => s(), (p) => s(p))
  }), I = C(() => Ar(h, u.props));
  var f = {
    get children() {
      return o();
    },
    set children(p) {
      o(p), S();
    },
    get child() {
      return i();
    },
    set child(p) {
      i(p), S();
    },
    get ref() {
      return s();
    },
    set ref(p = null) {
      s(p), S();
    },
    get id() {
      return d();
    },
    set id(p = sn(n)) {
      d(p), S();
    }
  }, m = Re(), w = W(m);
  {
    var P = (p) => {
      var x = Re(), a = W(x);
      Kt(a, i, () => ({
        props: r(I),
        headingValue: u.root.headingValue
      })), A(p, x);
    }, T = (p) => {
      var x = Ng();
      Kr(x, () => ({ ...r(I) }));
      var a = O(x);
      {
        var k = (V) => {
          var oe = Re(), _ = W(oe);
          Kt(_, () => o() ?? Pr, () => ({ headingValue: u.root.headingValue })), A(V, oe);
        }, Z = (V) => {
          var oe = ca();
          Ie(() => te(oe, u.root.headingValue)), A(V, oe);
        };
        Ce(a, (V) => {
          o() ? V(k) : V(Z, -1);
        });
      }
      M(x), A(p, x);
    };
    Ce(w, (p) => {
      i() ? p(P) : p(T, -1);
    });
  }
  return A(t, m), Jt(f);
}
Gt(qu, { children: {}, child: {}, ref: {}, id: {} }, [], [], { mode: "open" });
var $g = Q("<button><!></button>");
function Uu(t, e) {
  const n = Yr();
  Wt(e, !0);
  let o = R(e, "children", 7), i = R(e, "child", 7), s = R(e, "id", 23, () => sn(n)), d = R(e, "ref", 15, null), h = R(e, "tabindex", 7, 0), u = Dr(e, [
    "$$slots",
    "$$events",
    "$$legacy",
    "$$host",
    "children",
    "child",
    "id",
    "ref",
    "tabindex"
  ]);
  const I = zl.create({
    id: Oe(() => s()),
    ref: Oe(() => d(), (x) => d(x))
  }), f = C(() => Ar(u, I.props, { tabindex: h() }));
  var m = {
    get children() {
      return o();
    },
    set children(x) {
      o(x), S();
    },
    get child() {
      return i();
    },
    set child(x) {
      i(x), S();
    },
    get id() {
      return s();
    },
    set id(x = sn(n)) {
      s(x), S();
    },
    get ref() {
      return d();
    },
    set ref(x = null) {
      d(x), S();
    },
    get tabindex() {
      return h();
    },
    set tabindex(x = 0) {
      h(x), S();
    }
  }, w = Re(), P = W(w);
  {
    var T = (x) => {
      var a = Re(), k = W(a);
      Kt(k, i, () => ({ props: r(f) })), A(x, a);
    }, p = (x) => {
      var a = $g();
      Kr(a, () => ({ ...r(f) }));
      var k = O(a);
      Kt(k, () => o() ?? Pr), M(a), A(x, a);
    };
    Ce(P, (x) => {
      i() ? x(T) : x(p, -1);
    });
  }
  return A(t, w), Jt(m);
}
Gt(Uu, { children: {}, child: {}, id: {}, ref: {}, tabindex: {} }, [], [], { mode: "open" });
var Bg = Q("<button><!></button>");
function Vu(t, e) {
  const n = Yr();
  Wt(e, !0);
  let o = R(e, "children", 7), i = R(e, "child", 7), s = R(e, "id", 23, () => sn(n)), d = R(e, "ref", 15, null), h = R(e, "tabindex", 7, 0), u = Dr(e, [
    "$$slots",
    "$$events",
    "$$legacy",
    "$$host",
    "children",
    "child",
    "id",
    "ref",
    "tabindex"
  ]);
  const I = Wl.create({
    id: Oe(() => s()),
    ref: Oe(() => d(), (x) => d(x))
  }), f = C(() => Ar(u, I.props, { tabindex: h() }));
  var m = {
    get children() {
      return o();
    },
    set children(x) {
      o(x), S();
    },
    get child() {
      return i();
    },
    set child(x) {
      i(x), S();
    },
    get id() {
      return s();
    },
    set id(x = sn(n)) {
      s(x), S();
    },
    get ref() {
      return d();
    },
    set ref(x = null) {
      d(x), S();
    },
    get tabindex() {
      return h();
    },
    set tabindex(x = 0) {
      h(x), S();
    }
  }, w = Re(), P = W(w);
  {
    var T = (x) => {
      var a = Re(), k = W(a);
      Kt(k, i, () => ({ props: r(f) })), A(x, a);
    }, p = (x) => {
      var a = Bg();
      Kr(a, () => ({ ...r(f) }));
      var k = O(a);
      Kt(k, () => o() ?? Pr), M(a), A(x, a);
    };
    Ce(P, (x) => {
      i() ? x(T) : x(p, -1);
    });
  }
  return A(t, w), Jt(m);
}
Gt(Vu, { children: {}, child: {}, id: {}, ref: {}, tabindex: {} }, [], [], { mode: "open" });
const nd = qc({
  component: "date-field",
  parts: ["input", "label", "segment"]
}), ms = {
  day: {
    min: 1,
    max: (t) => {
      const e = t.segmentValues.month, n = t.value.current ?? t.placeholder.current;
      return Bs(e ? n.set({ month: Number.parseInt(e) }) : n);
    },
    cycle: 1,
    padZero: !0
  },
  month: {
    min: 1,
    max: 12,
    cycle: 1,
    padZero: !0,
    getAnnouncement: (t, e) => e.placeholder.current ? `${t} - ${e.formatter.fullMonth(jr(e.placeholder.current.set({ month: t })))}` : ""
  },
  year: { min: 1, max: 9999, cycle: 1, padZero: !1 },
  hour: {
    min: (t) => t.hourCycle.current === 12 ? 1 : 0,
    max: (t) => t.hourCycle.current === 24 ? 23 : t.hourCycle.current === 12 || Au(t.locale.current) === 12 ? 12 : 23,
    cycle: 1,
    canBeZero: !0,
    padZero: !0
  },
  minute: { min: 0, max: 59, cycle: 1, canBeZero: !0, padZero: !0 },
  second: { min: 0, max: 59, cycle: 1, canBeZero: !0, padZero: !0 }
}, es = new Ci("DateField.Root");
class rd {
  static create(e, n) {
    return es.set(new rd(e, n));
  }
  value;
  placeholder;
  validate;
  minValue;
  maxValue;
  disabled;
  readonly;
  granularity;
  readonlySegments;
  hourCycle;
  locale;
  hideTimeZone;
  required;
  onInvalid;
  errorMessageId;
  isInvalidProp;
  descriptionId = Uc();
  formatter;
  initialSegments;
  #e = be();
  get segmentValues() {
    return r(this.#e);
  }
  set segmentValues(e) {
    g(this.#e, e, !0);
  }
  announcer;
  #t = C(() => new Set(this.readonlySegments.current));
  get readonlySegmentsSet() {
    return r(this.#t);
  }
  set readonlySegmentsSet(e) {
    g(this.#t, e);
  }
  segmentStates = zd();
  #n = be(null);
  #r = be(null);
  #o = be(null);
  get descriptionNode() {
    return r(this.#o);
  }
  set descriptionNode(e) {
    g(this.#o, e, !0);
  }
  #a = be(null);
  get validationNode() {
    return r(this.#a);
  }
  set validationNode(e) {
    g(this.#a, e, !0);
  }
  states = zd();
  #i = be(null);
  get dayPeriodNode() {
    return r(this.#i);
  }
  set dayPeriodNode(e) {
    g(this.#i, e, !0);
  }
  rangeRoot = void 0;
  #l = be("");
  get name() {
    return r(this.#l);
  }
  set name(e) {
    g(this.#l, e, !0);
  }
  domContext = new bl(() => null);
  constructor(e, n) {
    this.rangeRoot = n, this.value = e.value, this.placeholder = n ? n.opts.placeholder : e.placeholder, this.validate = n ? Ih(void 0) : e.validate, this.minValue = n ? n.opts.minValue : e.minValue, this.maxValue = n ? n.opts.maxValue : e.maxValue, this.disabled = n ? n.opts.disabled : e.disabled, this.readonly = n ? n.opts.readonly : e.readonly, this.granularity = n ? n.opts.granularity : e.granularity, this.readonlySegments = n ? n.opts.readonlySegments : e.readonlySegments, this.hourCycle = n ? n.opts.hourCycle : e.hourCycle, this.locale = n ? n.opts.locale : e.locale, this.hideTimeZone = n ? n.opts.hideTimeZone : e.hideTimeZone, this.required = n ? n.opts.required : e.required, this.onInvalid = n ? n.opts.onInvalid : e.onInvalid, this.errorMessageId = n ? n.opts.errorMessageId : e.errorMessageId, this.isInvalidProp = e.isInvalidProp, this.formatter = Mu({
      initialLocale: this.locale.current,
      monthFormat: Oe(() => "long"),
      yearFormat: Oe(() => "numeric")
    }), this.initialSegments = qi(this.inferredGranularity), this.segmentValues = this.initialSegments, this.announcer = di(null), this.getFieldNode = this.getFieldNode.bind(this), this.updateSegment = this.updateSegment.bind(this), this.handleSegmentClick = this.handleSegmentClick.bind(this), this.getBaseSegmentAttrs = this.getBaseSegmentAttrs.bind(this), Ge(() => {
      Vr(() => {
        this.initialSegments = qi(this.inferredGranularity);
      });
    }), Vc(() => {
      this.announcer = di(this.domContext.getDocument());
    }), _h(() => {
      n || ig(this.descriptionId, this.domContext.getDocument());
    }), Ge(() => {
      n || this.formatter.getLocale() !== this.locale.current && this.formatter.setLocale(this.locale.current);
    }), Ge(() => {
      if (n) return;
      if (this.value.current) {
        const i = Vr(() => this.descriptionId);
        sg({
          id: i,
          formatter: this.formatter,
          value: this.value.current,
          doc: this.domContext.getDocument()
        });
      }
      const o = Vr(() => this.placeholder.current);
      this.value.current && o !== this.value.current && Vr(() => {
        this.value.current && (this.placeholder.current = this.value.current);
      });
    }), this.value.current && this.syncSegmentValues(this.value.current), Ge(() => {
      this.locale.current, this.value.current && this.syncSegmentValues(this.value.current), this.#s();
    }), Ge(() => {
      this.value.current === void 0 && (this.segmentValues = qi(this.inferredGranularity));
    }), vs(() => this.validationStatus, () => {
      this.validationStatus !== !1 && this.onInvalid.current?.(this.validationStatus.reason, this.validationStatus.message);
    });
  }
  setName(e) {
    this.name = e;
  }
  /**
   * Sets the field node for the `DateFieldRootState` instance. We use this method so we can
   * keep `#fieldNode` private to prevent accidental usage of the incorrect field node.
   */
  setFieldNode(e) {
    g(this.#n, e, !0);
  }
  /**
   * Gets the correct field node for the date field regardless of whether it's being
   * used in a standalone context or within a `DateRangeField` component.
   */
  getFieldNode() {
    return this.rangeRoot ? this.rangeRoot.fieldNode : r(this.#n);
  }
  /**
   * Sets the label node for the `DateFieldRootState` instance. We use this method so we can
   * keep `#labelNode` private to prevent accidental usage of the incorrect label node.
   */
  setLabelNode(e) {
    g(this.#r, e, !0);
  }
  /**
   * Gets the correct label node for the date field regardless of whether it's being used in
   * a standalone context or within a `DateRangeField` component.
   */
  getLabelNode() {
    return this.rangeRoot ? this.rangeRoot.labelNode : r(this.#r);
  }
  #s() {
    this.states.day.updating = null, this.states.month.updating = null, this.states.year.updating = null, this.states.hour.updating = null, this.states.minute.updating = null, this.states.dayPeriod.updating = null;
  }
  setValue(e) {
    this.value.current = e;
  }
  syncSegmentValues(e) {
    const n = Ri.map((o) => {
      const i = e[o];
      if (o === "month") {
        if (this.states.month.updating)
          return [o, this.states.month.updating];
        if (i < 10)
          return [o, `0${i}`];
      }
      if (o === "day") {
        if (this.states.day.updating)
          return [o, this.states.day.updating];
        if (i < 10)
          return [o, `0${i}`];
      }
      if (o === "year") {
        if (this.states.year.updating)
          return [o, this.states.year.updating];
        const d = 4 - `${i}`.length;
        if (d > 0)
          return [o, `${"0".repeat(d)}${i}`];
      }
      return [o, `${i}`];
    });
    if ("hour" in e) {
      const o = Bl.map((s) => {
        if (s === "dayPeriod")
          return this.states.dayPeriod.updating ? [s, this.states.dayPeriod.updating] : [s, this.formatter.dayPeriod(jr(e))];
        if (s === "hour") {
          if (this.states.hour.updating)
            return [s, this.states.hour.updating];
          if (e[s] !== void 0 && e[s] < 10)
            return [s, `0${e[s]}`];
          if (e[s] === 0 && this.dayPeriodNode)
            return [s, "12"];
        } else if (s === "minute") {
          if (this.states.minute.updating)
            return [s, this.states.minute.updating];
          if (e[s] !== void 0 && e[s] < 10)
            return [s, `0${e[s]}`];
        } else if (s === "second") {
          if (this.states.second.updating)
            return [s, this.states.second.updating];
          if (e[s] !== void 0 && e[s] < 10)
            return [s, `0${e[s]}`];
        }
        return [s, `${e[s]}`];
      }), i = [...n, ...o];
      this.segmentValues = Object.fromEntries(i), this.#s();
      return;
    }
    this.segmentValues = Object.fromEntries(n);
  }
  #d = C(() => {
    const e = this.value.current;
    if (!e) return !1;
    const n = this.validate.current?.(e);
    if (n)
      return { reason: "custom", message: n };
    const o = this.minValue.current;
    if (o && Ga(e, o))
      return { reason: "min" };
    const i = this.maxValue.current;
    return i && Ga(i, e) ? { reason: "max" } : !1;
  });
  get validationStatus() {
    return r(this.#d);
  }
  set validationStatus(e) {
    g(this.#d, e);
  }
  #c = C(() => this.validationStatus === !1 ? !1 : (this.isInvalidProp.current, !0));
  get isInvalid() {
    return r(this.#c);
  }
  set isInvalid(e) {
    g(this.#c, e);
  }
  #u = C(() => {
    const e = this.granularity.current;
    return e || og(this.placeholder.current, this.granularity.current);
  });
  get inferredGranularity() {
    return r(this.#u);
  }
  set inferredGranularity(e) {
    g(this.#u, e);
  }
  #h = C(() => this.value.current !== void 0 ? this.value.current : this.placeholder.current);
  get dateRef() {
    return r(this.#h);
  }
  set dateRef(e) {
    g(this.#h, e);
  }
  #f = C(() => Zv({
    segmentValues: this.segmentValues,
    formatter: this.formatter,
    locale: this.locale.current,
    granularity: this.inferredGranularity,
    dateRef: this.dateRef,
    hideTimeZone: this.hideTimeZone.current,
    hourCycle: this.hourCycle.current
  }));
  get allSegmentContent() {
    return r(this.#f);
  }
  set allSegmentContent(e) {
    g(this.#f, e);
  }
  #v = C(() => this.allSegmentContent.arr);
  get segmentContents() {
    return r(this.#v);
  }
  set segmentContents(e) {
    g(this.#v, e);
  }
  sharedSegmentAttrs = {
    role: "spinbutton",
    contenteditable: "true",
    tabindex: 0,
    spellcheck: !1,
    inputmode: "numeric",
    autocorrect: "off",
    enterkeyhint: "next",
    style: { caretColor: "transparent" },
    onbeforeinput: (e) => {
      (!e.data || e.data.length <= 1) && e.preventDefault();
    }
  };
  #g(e) {
    return `${e} ${this.getLabelNode()?.id ?? ""}`;
  }
  updateSegment(e, n) {
    const o = this.disabled.current, i = this.readonly.current, s = this.readonlySegmentsSet;
    if (o || i || s.has(e)) return;
    const d = this.segmentValues;
    let h = d;
    const u = this.placeholder.current;
    if (rg(d)) {
      const I = d[e], f = n;
      if (e === "month") {
        const m = f(I);
        if (this.states.month.updating = m, m !== null && d.day !== null) {
          const w = u.set({ month: Number.parseInt(m) }), P = Bs(jr(w));
          Number.parseInt(d.day) > P && (d.day = `${P}`);
        }
        h = { ...d, [e]: m };
      } else if (e === "dayPeriod") {
        const m = f(I);
        this.states.dayPeriod.updating = m;
        const w = this.value.current;
        if (w && "hour" in w) {
          const P = w.hour;
          m === "AM" ? P >= 12 && (d.hour = `${P - 12}`) : m === "PM" && P < 12 && (d.hour = `${P + 12}`);
        }
        h = { ...d, [e]: m };
      } else if (e === "hour") {
        const m = f(I);
        if (this.states.hour.updating = m, m !== null && d.dayPeriod !== null) {
          const w = this.formatter.dayPeriod(jr(u.set({ hour: Number.parseInt(m) })), this.hourCycle.current);
          (w === "AM" || w === "PM") && (d.dayPeriod = w);
        }
        h = { ...d, [e]: m };
      } else if (e === "minute") {
        const m = f(I);
        this.states.minute.updating = m, h = { ...d, [e]: m };
      } else if (e === "second") {
        const m = f(I);
        this.states.second.updating = m, h = { ...d, [e]: m };
      } else if (e === "year") {
        const m = f(I);
        this.states.year.updating = m, h = { ...d, [e]: m };
      } else if (e === "day") {
        const m = f(I);
        this.states.day.updating = m, h = { ...d, [e]: m };
      } else {
        const m = f(I);
        h = { ...d, [e]: m };
      }
    } else if (Ii(e)) {
      const I = d[e], f = n, m = f(I);
      if (e === "month" && m !== null && d.day !== null) {
        this.states.month.updating = m;
        const w = u.set({ month: Number.parseInt(m) }), P = Bs(jr(w));
        Number.parseInt(d.day) > P && (d.day = `${P}`), h = { ...d, [e]: m };
      } else if (e === "year") {
        const w = f(I);
        this.states.year.updating = w, h = { ...d, [e]: w };
      } else if (e === "day") {
        const w = f(I);
        this.states.day.updating = w, h = { ...d, [e]: w };
      } else
        h = { ...d, [e]: m };
    }
    this.segmentValues = h, ng(h, r(this.#n)) ? this.setValue(tg({
      segmentObj: h,
      fieldNode: r(this.#n),
      dateRef: this.placeholder.current
    })) : (this.setValue(void 0), this.segmentValues = h);
  }
  handleSegmentClick(e) {
    this.disabled.current && e.preventDefault();
  }
  getBaseSegmentAttrs(e, n) {
    const o = this.readonlySegmentsSet.has(e), i = {
      "aria-invalid": Cl(this.isInvalid),
      "aria-disabled": Vo(this.disabled.current),
      "aria-readonly": Vo(this.readonly.current || o),
      "data-invalid": mn(this.isInvalid),
      "data-disabled": mn(this.disabled.current),
      "data-readonly": mn(this.readonly.current || o),
      "data-segment": `${e}`,
      [nd.segment]: ""
    };
    if (e === "literal") return i;
    const s = this.descriptionNode?.id, d = ag(n, r(this.#n)) && s, h = this.errorMessageId?.current, u = d ? `${s} ${this.isInvalid && h ? h : ""}` : void 0, I = !(this.readonly.current || o || this.disabled.current);
    return {
      ...i,
      "aria-labelledby": this.#g(n),
      contenteditable: I ? "true" : void 0,
      "aria-describedby": u,
      tabindex: this.disabled.current ? void 0 : 0
    };
  }
}
class od {
  static create(e) {
    return new od(e, es.get());
  }
  opts;
  root;
  domContext;
  attachment;
  constructor(e, n) {
    this.opts = e, this.root = n, this.domContext = new bl(e.ref), this.root.domContext = this.domContext, this.attachment = wr(e.ref, (o) => this.root.setFieldNode(o)), vs(() => this.opts.name.current, (o) => {
      this.root.setName(o);
    });
  }
  #e = C(() => {
    if (!(!Ta || !this.domContext.getElementById(this.root.descriptionId)))
      return this.root.descriptionId;
  });
  #t = C(() => ({
    id: this.opts.id.current,
    role: "group",
    "aria-labelledby": this.root.getLabelNode()?.id ?? void 0,
    "aria-describedby": r(this.#e),
    "aria-disabled": Vo(this.root.disabled.current),
    "data-invalid": this.root.isInvalid ? "" : void 0,
    "data-disabled": mn(this.root.disabled.current),
    [nd.input]: "",
    ...this.attachment
  }));
  get props() {
    return r(this.#t);
  }
  set props(e) {
    g(this.#t, e);
  }
}
class ad {
  static create() {
    return new ad(es.get());
  }
  root;
  #e = C(() => this.root.name !== "");
  get shouldRender() {
    return r(this.#e);
  }
  set shouldRender(e) {
    g(this.#e, e);
  }
  #t = C(() => this.root.value.current ? this.root.value.current.toString() : "");
  get isoValue() {
    return r(this.#t);
  }
  set isoValue(e) {
    g(this.#t, e);
  }
  constructor(e) {
    this.root = e;
  }
  #n = C(() => ({
    name: this.root.name,
    value: this.isoValue,
    required: this.root.required.current
  }));
  get props() {
    return r(this.#n);
  }
  set props(e) {
    g(this.#n, e);
  }
}
class bs {
  opts;
  root;
  announcer;
  part;
  config;
  attachment;
  constructor(e, n, o, i) {
    this.opts = e, this.root = n, this.part = o, this.config = i, this.announcer = n.announcer, this.onkeydown = this.onkeydown.bind(this), this.onfocusout = this.onfocusout.bind(this), this.attachment = wr(e.ref);
  }
  #e() {
    return typeof this.config.max == "function" ? this.config.max(this.root) : this.config.max;
  }
  #t() {
    return typeof this.config.min == "function" ? this.config.min(this.root) : this.config.min;
  }
  #n(e) {
    return this.config.getAnnouncement ? this.config.getAnnouncement(e, this.root) : e;
  }
  #r(e, n = !0) {
    const o = String(e);
    return n && this.config.padZero && o.length === 1 ? `0${e}` : o;
  }
  onkeydown(e) {
    const n = this.root.value.current ?? this.root.placeholder.current;
    if (!(e.ctrlKey || e.metaKey || this.root.disabled.current) && !((this.part === "hour" || this.part === "minute" || this.part === "second") && !(this.part in n)) && (e.key !== Pi && e.preventDefault(), !!ql(e.key))) {
      if (dd(e.key)) {
        this.#o(n);
        return;
      }
      if (cd(e.key)) {
        this.#a(n);
        return;
      }
      if (bi(e.key)) {
        this.#i(e);
        return;
      }
      if (ud(e.key)) {
        this.#l(e);
        return;
      }
      Ys(e.key) && Ks(e, this.root.getFieldNode());
    }
  }
  #o(e) {
    const n = this.part;
    n in this.root.states && (this.root.states[n].hasLeftFocus = !1), this.root.updateSegment(this.part, (o) => {
      if (o === null) {
        const d = e[this.part];
        return this.announcer.announce(this.#n(d)), this.#r(d);
      }
      const s = e.set({ [this.part]: Number.parseInt(o) }).cycle(this.part, this.config.cycle)[this.part];
      return this.announcer.announce(this.#n(s)), this.#r(s);
    });
  }
  #a(e) {
    const n = this.part;
    n in this.root.states && (this.root.states[n].hasLeftFocus = !1), this.root.updateSegment(this.part, (o) => {
      if (o === null) {
        const d = e[this.part];
        return this.announcer.announce(this.#n(d)), this.#r(d);
      }
      const s = e.set({ [this.part]: Number.parseInt(o) }).cycle(this.part, -this.config.cycle)[this.part];
      return this.announcer.announce(this.#n(s)), this.#r(s);
    });
  }
  #i(e) {
    const n = Number.parseInt(e.key);
    let o = !1;
    const i = this.#e(), s = Math.floor(i / 10), d = n === 0, h = this.part;
    this.root.updateSegment(this.part, (u) => {
      if (h in this.root.states && this.root.states[h].hasLeftFocus && (u = null, this.root.states[h].hasLeftFocus = !1), u === null)
        return d ? (h in this.root.states && (this.root.states[h].lastKeyZero = !0), this.announcer.announce("0"), "0") : (h in this.root.states && (this.root.states[h].lastKeyZero || n > s) && (o = !0), h in this.root.states && (this.root.states[h].lastKeyZero = !1), o && String(n).length === 1 ? (this.announcer.announce(n), `0${n}`) : `${n}`);
      if (h in this.root.states && this.root.states[h].lastKeyZero)
        return n !== 0 ? (o = !0, this.root.states[h].lastKeyZero = !1, `0${n}`) : this.part === "hour" && n === 0 && this.root.hourCycle.current === 24 ? (o = !0, this.root.states[h].lastKeyZero = !1, "00") : (this.part === "minute" || this.part === "second") && n === 0 ? (o = !0, this.root.states[h].lastKeyZero = !1, "00") : u;
      const I = Number.parseInt(u + n.toString());
      return I > i ? (o = !0, `0${n}`) : (o = !0, `${I}`);
    }), o && Du(e, this.root.getFieldNode());
  }
  #l(e) {
    const n = this.part;
    n in this.root.states && (this.root.states[n].hasLeftFocus = !1);
    let o = !1;
    this.root.updateSegment(this.part, (i) => {
      if (i === null)
        return o = !0, this.announcer.announce(null), null;
      if (i.length === 2 && i.startsWith("0"))
        return this.announcer.announce(null), null;
      const s = i.toString();
      if (s.length === 1)
        return this.announcer.announce(null), null;
      const d = Number.parseInt(s.slice(0, -1));
      return this.announcer.announce(this.#n(d)), `${d}`;
    }), o && ku(e, this.root.getFieldNode());
  }
  onfocusout(e) {
    const n = this.part;
    n in this.root.states && (this.root.states[n].hasLeftFocus = !0), this.config.padZero && this.root.updateSegment(this.part, (o) => o && o.length === 1 ? `0${o}` : o);
  }
  getSegmentProps() {
    const e = this.root.segmentValues, n = this.root.placeholder.current, o = e[this.part] === null;
    let i = n;
    e[this.part] && (i = n.set({ [this.part]: Number.parseInt(e[this.part]) }));
    const s = i[this.part], d = this.#t(), h = this.#e();
    let u = o ? "Empty" : `${s}`;
    return this.part === "hour" && "dayPeriod" in e && e.dayPeriod && (u = o ? "Empty" : `${s} ${e.dayPeriod}`), {
      "aria-label": `${this.part}, `,
      "aria-valuemin": d,
      "aria-valuemax": h,
      "aria-valuenow": s,
      "aria-valuetext": u
    };
  }
  #s = C(() => ({
    ...this.root.sharedSegmentAttrs,
    id: this.opts.id.current,
    ...this.getSegmentProps(),
    onkeydown: this.onkeydown,
    onfocusout: this.onfocusout,
    onclick: this.root.handleSegmentClick,
    ...this.root.getBaseSegmentAttrs(this.part, this.opts.id.current),
    ...this.attachment
  }));
  get props() {
    return r(this.#s);
  }
  set props(e) {
    g(this.#s, e);
  }
}
class qg extends bs {
  #e = [];
  #t = 0;
  constructor(e, n) {
    super(e, n, "year", ms.year);
  }
  onkeydown(e) {
    if (!(e.ctrlKey || e.metaKey || this.root.disabled.current) && (e.key !== Pi && e.preventDefault(), !!ql(e.key))) {
      if (dd(e.key)) {
        this.#n(), super.onkeydown(e);
        return;
      }
      if (cd(e.key)) {
        this.#n(), super.onkeydown(e);
        return;
      }
      if (bi(e.key)) {
        this.#o(e);
        return;
      }
      if (ud(e.key)) {
        this.#a(e);
        return;
      }
      Ys(e.key) && Ks(e, this.root.getFieldNode());
    }
  }
  #n() {
    this.#t = 0;
  }
  #r() {
    this.#t++;
  }
  #o(e) {
    this.#e.push(e.key);
    let n = !1;
    const o = Number.parseInt(e.key);
    this.root.updateSegment("year", (i) => {
      if (this.root.states.year.hasLeftFocus && (i = null, this.root.states.year.hasLeftFocus = !1), i === null)
        return this.announcer.announce(o), `000${o}`;
      const s = i.toString() + o.toString(), d = Number.parseInt(s);
      if (String(d).length < 4)
        return this.#t > 0 && this.#e.length <= this.#t && s.length <= 4 ? (this.announcer.announce(d), s) : (this.announcer.announce(d), Xd(d));
      this.announcer.announce(d), n = !0;
      const u = `${d}`;
      return u.length > 4 ? u.slice(0, 4) : u;
    }), (this.#e.length === 4 || this.#e.length === this.#t) && (n = !0), n && Du(e, this.root.getFieldNode());
  }
  #a(e) {
    this.#e = [], this.#r();
    let n = !1;
    this.root.updateSegment("year", (o) => {
      if (this.root.states.year.hasLeftFocus = !1, o === null)
        return n = !0, this.announcer.announce(null), null;
      const i = o.toString();
      if (i.length === 1)
        return this.announcer.announce(null), null;
      const s = i.slice(0, -1);
      return this.announcer.announce(s), `${s}`;
    }), n && ku(e, this.root.getFieldNode());
  }
  onfocusout(e) {
    this.root.states.year.hasLeftFocus = !0, this.#e = [], this.#n(), this.root.updateSegment("year", (n) => n && n.length !== 4 ? Xd(Number.parseInt(n)) : n);
  }
}
class Ug extends bs {
  constructor(e, n) {
    super(e, n, "day", ms.day);
  }
}
class Vg extends bs {
  constructor(e, n) {
    super(e, n, "month", ms.month);
  }
}
class jg extends bs {
  constructor(e, n) {
    super(e, n, "hour", ms.hour);
  }
  // Override to handle special hour logic
  onkeydown(e) {
    if (bi(e.key)) {
      const n = this.root.updateSegment.bind(this.root);
      this.root.updateSegment = (o, i) => {
        const s = n(o, i);
        return o === "hour" && "hour" in this.root.segmentValues && this.root.segmentValues.hour === "0" && this.root.dayPeriodNode && this.root.hourCycle.current !== 24 && (this.root.segmentValues.hour = "12"), s;
      };
    }
    super.onkeydown(e), this.root.updateSegment = this.root.updateSegment.bind(this.root);
  }
}
class Kg extends bs {
  constructor(e, n) {
    super(e, n, "minute", ms.minute);
  }
}
class Yg extends bs {
  constructor(e, n) {
    super(e, n, "second", ms.second);
  }
}
class sd {
  static create(e) {
    return new sd(e, es.get());
  }
  opts;
  root;
  attachment;
  #e;
  constructor(e, n) {
    this.opts = e, this.root = n, this.#e = this.root.announcer, this.onkeydown = this.onkeydown.bind(this), this.attachment = wr(e.ref, (o) => this.root.dayPeriodNode = o);
  }
  onkeydown(e) {
    if (!(e.ctrlKey || e.metaKey || this.root.disabled.current) && (e.key !== Pi && e.preventDefault(), !!zg(e.key))) {
      if (dd(e.key) || cd(e.key)) {
        this.root.updateSegment("dayPeriod", (n) => {
          if (n === "AM")
            return this.#e.announce("PM"), "PM";
          const o = "AM";
          return this.#e.announce(o), o;
        });
        return;
      }
      ud(e.key) && (this.root.states.dayPeriod.hasLeftFocus = !1, this.root.updateSegment("dayPeriod", () => (this.#e.announce("AM"), "AM"))), (e.key === nl || e.key === jc || rl) && this.root.updateSegment("dayPeriod", () => {
        const n = e.key === nl || e.key === rl ? "AM" : "PM";
        return this.#e.announce(n), n;
      }), Ys(e.key) && Ks(e, this.root.getFieldNode());
    }
  }
  #t = C(() => {
    const e = this.root.segmentValues;
    if (!("dayPeriod" in e)) return;
    const n = 0, o = 12, i = e.dayPeriod === "AM" ? 0 : 12, s = e.dayPeriod ?? "AM";
    return {
      ...this.root.sharedSegmentAttrs,
      id: this.opts.id.current,
      inputmode: "text",
      "aria-label": "AM/PM",
      "aria-valuemin": n,
      "aria-valuemax": o,
      "aria-valuenow": i,
      "aria-valuetext": s,
      onkeydown: this.onkeydown,
      onclick: this.root.handleSegmentClick,
      ...this.root.getBaseSegmentAttrs("dayPeriod", this.opts.id.current),
      ...this.attachment
    };
  });
  get props() {
    return r(this.#t);
  }
  set props(e) {
    g(this.#t, e);
  }
}
class id {
  static create(e) {
    return new id(e, es.get());
  }
  opts;
  root;
  attachment;
  constructor(e, n) {
    this.opts = e, this.root = n, this.attachment = wr(e.ref);
  }
  #e = C(() => ({
    id: this.opts.id.current,
    "aria-hidden": Cl(!0),
    ...this.root.getBaseSegmentAttrs("literal", this.opts.id.current),
    ...this.attachment
  }));
  get props() {
    return r(this.#e);
  }
  set props(e) {
    g(this.#e, e);
  }
}
class ld {
  static create(e) {
    return new ld(e, es.get());
  }
  opts;
  root;
  attachment;
  constructor(e, n) {
    this.opts = e, this.root = n, this.onkeydown = this.onkeydown.bind(this), this.attachment = wr(e.ref);
  }
  onkeydown(e) {
    e.key !== Pi && e.preventDefault(), !this.root.disabled.current && Ys(e.key) && Ks(e, this.root.getFieldNode());
  }
  #e = C(() => ({
    role: "textbox",
    id: this.opts.id.current,
    "aria-label": "timezone, ",
    style: { caretColor: "transparent" },
    onkeydown: this.onkeydown,
    ...this.root.getBaseSegmentAttrs("timeZoneName", this.opts.id.current),
    "data-readonly": mn(!0),
    ...this.attachment
  }));
  get props() {
    return r(this.#e);
  }
  set props(e) {
    g(this.#e, e);
  }
}
class Qg {
  static create(e, n) {
    const o = es.get();
    switch (e) {
      case "day":
        return new Ug(n, o);
      case "month":
        return new Vg(n, o);
      case "year":
        return new qg(n, o);
      case "hour":
        return new jg(n, o);
      case "minute":
        return new Kg(n, o);
      case "second":
        return new Yg(n, o);
      case "dayPeriod":
        return new sd(n, o);
      case "literal":
        return new id(n, o);
      case "timeZoneName":
        return new ld(n, o);
    }
  }
}
function zg(t) {
  return ql(t) || t === nl || t === jc || t === rl || t === Eh;
}
function dd(t) {
  return t === yi;
}
function cd(t) {
  return t === mi;
}
function ud(t) {
  return t === Nc;
}
function Xd(t) {
  const n = 4 - String(t).length;
  return `${"0".repeat(n)}${t}`;
}
function ju(t, e) {
  Wt(e, !0);
  const n = ad.create();
  var o = Re(), i = W(o);
  {
    var s = (d) => {
      Ah(d, ps(() => n.props));
    };
    Ce(i, (d) => {
      n.shouldRender && d(s);
    });
  }
  A(t, o), Jt();
}
Gt(ju, {}, [], [], { mode: "open" });
var Wg = Q("<div><!></div>"), Jg = Q("<!> <!>", 1);
function Ku(t, e) {
  const n = Yr();
  Wt(e, !0);
  let o = R(e, "id", 23, () => sn(n)), i = R(e, "ref", 15, null), s = R(e, "name", 7, ""), d = R(e, "children", 7), h = R(e, "child", 7), u = Dr(e, [
    "$$slots",
    "$$events",
    "$$legacy",
    "$$host",
    "id",
    "ref",
    "name",
    "children",
    "child"
  ]);
  const I = od.create({
    id: Oe(() => o()),
    ref: Oe(() => i(), (a) => i(a)),
    name: Oe(() => s())
  }), f = C(() => Ar(u, I.props));
  var m = {
    get id() {
      return o();
    },
    set id(a = sn(n)) {
      o(a), S();
    },
    get ref() {
      return i();
    },
    set ref(a = null) {
      i(a), S();
    },
    get name() {
      return s();
    },
    set name(a = "") {
      s(a), S();
    },
    get children() {
      return d();
    },
    set children(a) {
      d(a), S();
    },
    get child() {
      return h();
    },
    set child(a) {
      h(a), S();
    }
  }, w = Jg(), P = W(w);
  {
    var T = (a) => {
      var k = Re(), Z = W(k);
      Kt(Z, h, () => ({
        props: r(f),
        segments: I.root.segmentContents
      })), A(a, k);
    }, p = (a) => {
      var k = Wg();
      Kr(k, () => ({ ...r(f) }));
      var Z = O(k);
      Kt(Z, () => d() ?? Pr, () => ({ segments: I.root.segmentContents })), M(k), A(a, k);
    };
    Ce(P, (a) => {
      h() ? a(T) : a(p, -1);
    });
  }
  var x = N(P, 2);
  return ju(x, {}), A(t, w), Jt(m);
}
Gt(Ku, { id: {}, ref: {}, name: {}, children: {}, child: {} }, [], [], { mode: "open" });
var Gg = Q("<span><!></span>");
function Yu(t, e) {
  const n = Yr();
  Wt(e, !0);
  let o = R(e, "id", 23, () => sn(n)), i = R(e, "ref", 15, null), s = R(e, "children", 7), d = R(e, "child", 7), h = R(e, "part", 7), u = Dr(e, [
    "$$slots",
    "$$events",
    "$$legacy",
    "$$host",
    "id",
    "ref",
    "children",
    "child",
    "part"
  ]);
  const I = Qg.create(h(), {
    id: Oe(() => o()),
    ref: Oe(() => i(), (x) => i(x))
  }), f = C(() => Ar(u, I.props));
  var m = {
    get id() {
      return o();
    },
    set id(x = sn(n)) {
      o(x), S();
    },
    get ref() {
      return i();
    },
    set ref(x = null) {
      i(x), S();
    },
    get children() {
      return s();
    },
    set children(x) {
      s(x), S();
    },
    get child() {
      return d();
    },
    set child(x) {
      d(x), S();
    },
    get part() {
      return h();
    },
    set part(x) {
      h(x), S();
    }
  }, w = Re(), P = W(w);
  {
    var T = (x) => {
      var a = Re(), k = W(a);
      Kt(k, d, () => ({ props: r(f) })), A(x, a);
    }, p = (x) => {
      var a = Gg();
      Kr(a, () => ({ ...r(f) }));
      var k = O(a);
      Kt(k, () => s() ?? Pr), M(a), A(x, a);
    };
    Ce(P, (x) => {
      d() ? x(T) : x(p, -1);
    });
  }
  return A(t, w), Jt(m);
}
Gt(Yu, { id: {}, ref: {}, children: {}, child: {}, part: {} }, [], [], { mode: "open" });
const Qu = new Ci("DatePicker.Root");
class hd {
  static create(e) {
    return Qu.set(new hd(e));
  }
  opts;
  constructor(e) {
    this.opts = e;
  }
}
function zu(t, e) {
  Wt(e, !0);
  let n = R(e, "open", 15, !1), o = R(e, "onOpenChange", 7, ho), i = R(e, "onOpenChangeComplete", 7, ho), s = R(e, "value", 15), d = R(e, "onValueChange", 7, ho), h = R(e, "placeholder", 15), u = R(e, "onPlaceholderChange", 7, ho), I = R(e, "isDateUnavailable", 7, () => !1), f = R(e, "validate", 7, ho), m = R(e, "onInvalid", 7, ho), w = R(e, "minValue", 7), P = R(e, "maxValue", 7), T = R(e, "disabled", 7, !1), p = R(e, "readonly", 7, !1), x = R(e, "granularity", 7), a = R(e, "readonlySegments", 23, () => []), k = R(e, "hourCycle", 7), Z = R(e, "locale", 7), V = R(e, "hideTimeZone", 7, !1), oe = R(e, "required", 7, !1), _ = R(e, "calendarLabel", 7, "Event"), ee = R(e, "disableDaysOutsideMonth", 7, !0), fe = R(e, "preventDeselect", 7, !1), he = R(e, "pagedNavigation", 7, !1), me = R(e, "weekStartsOn", 7), ke = R(e, "weekdayFormat", 7, "narrow"), Ee = R(e, "isDateDisabled", 7, () => !1), $e = R(e, "fixedWeeks", 7, !1), Pe = R(e, "numberOfMonths", 7, 1), re = R(e, "closeOnDateSelect", 7, !0), ve = R(e, "initialFocus", 7, !1), de = R(e, "errorMessageId", 7), j = R(e, "children", 7), ne = R(e, "monthFormat", 7, "long"), xe = R(e, "yearFormat", 7, "numeric");
  const Le = Fv({
    granularity: x(),
    defaultValue: s(),
    minValue: w(),
    maxValue: P()
  });
  function Fe() {
    h() === void 0 && h(Le);
  }
  Fe(), vs.pre(() => h(), () => {
    Fe();
  });
  function D() {
    re() && n(!1);
  }
  const J = hd.create({
    open: Oe(() => n(), (B) => {
      n(B), o()(B);
    }),
    value: Oe(() => s(), (B) => {
      s(B), d()(B);
    }),
    placeholder: Oe(() => h(), (B) => {
      h(B), u()(B);
    }),
    isDateUnavailable: Oe(() => I()),
    minValue: Oe(() => w()),
    maxValue: Oe(() => P()),
    disabled: Oe(() => T()),
    readonly: Oe(() => p()),
    granularity: Oe(() => x()),
    readonlySegments: Oe(() => a()),
    hourCycle: Oe(() => k()),
    locale: Dh(() => Z()),
    hideTimeZone: Oe(() => V()),
    required: Oe(() => oe()),
    calendarLabel: Oe(() => _()),
    disableDaysOutsideMonth: Oe(() => ee()),
    preventDeselect: Oe(() => fe()),
    pagedNavigation: Oe(() => he()),
    weekStartsOn: Oe(() => me()),
    weekdayFormat: Oe(() => ke()),
    isDateDisabled: Oe(() => Ee()),
    fixedWeeks: Oe(() => $e()),
    numberOfMonths: Oe(() => Pe()),
    initialFocus: Oe(() => ve()),
    onDateSelect: Oe(() => D),
    defaultPlaceholder: Le,
    monthFormat: Oe(() => ne()),
    yearFormat: Oe(() => xe())
  });
  kh.create({
    open: J.opts.open,
    onOpenChangeComplete: Oe(() => i())
  }), rd.create({
    value: J.opts.value,
    disabled: J.opts.disabled,
    readonly: J.opts.readonly,
    readonlySegments: J.opts.readonlySegments,
    validate: Oe(() => f()),
    onInvalid: Oe(() => m()),
    minValue: J.opts.minValue,
    maxValue: J.opts.maxValue,
    granularity: J.opts.granularity,
    hideTimeZone: J.opts.hideTimeZone,
    hourCycle: J.opts.hourCycle,
    locale: J.opts.locale,
    required: J.opts.required,
    placeholder: J.opts.placeholder,
    errorMessageId: Oe(() => de()),
    isInvalidProp: Oe(() => {
    })
  });
  var L = {
    get open() {
      return n();
    },
    set open(B = !1) {
      n(B), S();
    },
    get onOpenChange() {
      return o();
    },
    set onOpenChange(B = ho) {
      o(B), S();
    },
    get onOpenChangeComplete() {
      return i();
    },
    set onOpenChangeComplete(B = ho) {
      i(B), S();
    },
    get value() {
      return s();
    },
    set value(B) {
      s(B), S();
    },
    get onValueChange() {
      return d();
    },
    set onValueChange(B = ho) {
      d(B), S();
    },
    get placeholder() {
      return h();
    },
    set placeholder(B) {
      h(B), S();
    },
    get onPlaceholderChange() {
      return u();
    },
    set onPlaceholderChange(B = ho) {
      u(B), S();
    },
    get isDateUnavailable() {
      return I();
    },
    set isDateUnavailable(B = () => !1) {
      I(B), S();
    },
    get validate() {
      return f();
    },
    set validate(B = ho) {
      f(B), S();
    },
    get onInvalid() {
      return m();
    },
    set onInvalid(B = ho) {
      m(B), S();
    },
    get minValue() {
      return w();
    },
    set minValue(B) {
      w(B), S();
    },
    get maxValue() {
      return P();
    },
    set maxValue(B) {
      P(B), S();
    },
    get disabled() {
      return T();
    },
    set disabled(B = !1) {
      T(B), S();
    },
    get readonly() {
      return p();
    },
    set readonly(B = !1) {
      p(B), S();
    },
    get granularity() {
      return x();
    },
    set granularity(B) {
      x(B), S();
    },
    get readonlySegments() {
      return a();
    },
    set readonlySegments(B = []) {
      a(B), S();
    },
    get hourCycle() {
      return k();
    },
    set hourCycle(B) {
      k(B), S();
    },
    get locale() {
      return Z();
    },
    set locale(B) {
      Z(B), S();
    },
    get hideTimeZone() {
      return V();
    },
    set hideTimeZone(B = !1) {
      V(B), S();
    },
    get required() {
      return oe();
    },
    set required(B = !1) {
      oe(B), S();
    },
    get calendarLabel() {
      return _();
    },
    set calendarLabel(B = "Event") {
      _(B), S();
    },
    get disableDaysOutsideMonth() {
      return ee();
    },
    set disableDaysOutsideMonth(B = !0) {
      ee(B), S();
    },
    get preventDeselect() {
      return fe();
    },
    set preventDeselect(B = !1) {
      fe(B), S();
    },
    get pagedNavigation() {
      return he();
    },
    set pagedNavigation(B = !1) {
      he(B), S();
    },
    get weekStartsOn() {
      return me();
    },
    set weekStartsOn(B) {
      me(B), S();
    },
    get weekdayFormat() {
      return ke();
    },
    set weekdayFormat(B = "narrow") {
      ke(B), S();
    },
    get isDateDisabled() {
      return Ee();
    },
    set isDateDisabled(B = () => !1) {
      Ee(B), S();
    },
    get fixedWeeks() {
      return $e();
    },
    set fixedWeeks(B = !1) {
      $e(B), S();
    },
    get numberOfMonths() {
      return Pe();
    },
    set numberOfMonths(B = 1) {
      Pe(B), S();
    },
    get closeOnDateSelect() {
      return re();
    },
    set closeOnDateSelect(B = !0) {
      re(B), S();
    },
    get initialFocus() {
      return ve();
    },
    set initialFocus(B = !1) {
      ve(B), S();
    },
    get errorMessageId() {
      return de();
    },
    set errorMessageId(B) {
      de(B), S();
    },
    get children() {
      return j();
    },
    set children(B) {
      j(B), S();
    },
    get monthFormat() {
      return ne();
    },
    set monthFormat(B = "long") {
      ne(B), S();
    },
    get yearFormat() {
      return xe();
    },
    set yearFormat(B = "numeric") {
      xe(B), S();
    }
  }, G = Re(), ue = W(G);
  return He(ue, () => Mh, (B, Ae) => {
    Ae(B, {
      children: (ae, je) => {
        var ie = Re(), qe = W(ie);
        Kt(qe, () => j() ?? Pr), A(ae, ie);
      },
      $$slots: { default: !0 }
    });
  }), A(t, G), Jt(L);
}
Gt(
  zu,
  {
    open: {},
    onOpenChange: {},
    onOpenChangeComplete: {},
    value: {},
    onValueChange: {},
    placeholder: {},
    onPlaceholderChange: {},
    isDateUnavailable: {},
    validate: {},
    onInvalid: {},
    minValue: {},
    maxValue: {},
    disabled: {},
    readonly: {},
    granularity: {},
    readonlySegments: {},
    hourCycle: {},
    locale: {},
    hideTimeZone: {},
    required: {},
    calendarLabel: {},
    disableDaysOutsideMonth: {},
    preventDeselect: {},
    pagedNavigation: {},
    weekStartsOn: {},
    weekdayFormat: {},
    isDateDisabled: {},
    fixedWeeks: {},
    numberOfMonths: {},
    closeOnDateSelect: {},
    initialFocus: {},
    errorMessageId: {},
    children: {},
    monthFormat: {},
    yearFormat: {}
  },
  [],
  [],
  { mode: "open" }
);
var Zg = Q("<div><!></div>");
function Wu(t, e) {
  const n = Yr();
  Wt(e, !0);
  let o = R(e, "children", 7), i = R(e, "child", 7), s = R(e, "id", 23, () => sn(n)), d = R(e, "ref", 15, null), h = Dr(e, [
    "$$slots",
    "$$events",
    "$$legacy",
    "$$host",
    "children",
    "child",
    "id",
    "ref"
  ]);
  const u = Qu.get(), I = jl.create({
    id: Oe(() => s()),
    ref: Oe(() => d(), (x) => d(x)),
    calendarLabel: u.opts.calendarLabel,
    fixedWeeks: u.opts.fixedWeeks,
    isDateDisabled: u.opts.isDateDisabled,
    isDateUnavailable: u.opts.isDateUnavailable,
    locale: u.opts.locale,
    numberOfMonths: u.opts.numberOfMonths,
    pagedNavigation: u.opts.pagedNavigation,
    preventDeselect: u.opts.preventDeselect,
    readonly: u.opts.readonly,
    type: Oe(() => "single"),
    weekStartsOn: u.opts.weekStartsOn,
    weekdayFormat: u.opts.weekdayFormat,
    disabled: u.opts.disabled,
    disableDaysOutsideMonth: u.opts.disableDaysOutsideMonth,
    maxValue: u.opts.maxValue,
    minValue: u.opts.minValue,
    placeholder: u.opts.placeholder,
    value: u.opts.value,
    onDateSelect: u.opts.onDateSelect,
    initialFocus: u.opts.initialFocus,
    defaultPlaceholder: u.opts.defaultPlaceholder,
    maxDays: Oe(() => {
    }),
    monthFormat: u.opts.monthFormat,
    yearFormat: u.opts.yearFormat
  }), f = C(() => Ar(h, I.props));
  var m = {
    get children() {
      return o();
    },
    set children(x) {
      o(x), S();
    },
    get child() {
      return i();
    },
    set child(x) {
      i(x), S();
    },
    get id() {
      return s();
    },
    set id(x = sn(n)) {
      s(x), S();
    },
    get ref() {
      return d();
    },
    set ref(x = null) {
      d(x), S();
    }
  }, w = Re(), P = W(w);
  {
    var T = (x) => {
      var a = Re(), k = W(a);
      {
        let Z = C(() => ({ props: r(f), ...I.snippetProps }));
        Kt(k, i, () => r(Z));
      }
      A(x, a);
    }, p = (x) => {
      var a = Zg();
      Kr(a, () => ({ ...r(f) }));
      var k = O(a);
      Kt(k, () => o() ?? Pr, () => I.snippetProps), M(a), A(x, a);
    };
    Ce(P, (x) => {
      i() ? x(T) : x(p, -1);
    });
  }
  return A(t, w), Jt(m);
}
Gt(Wu, { children: {}, child: {}, id: {}, ref: {} }, [], [], { mode: "open" });
function Ju(t, e) {
  Wt(e, !0);
  let n = R(e, "ref", 15, null), o = R(e, "onOpenAutoFocus", 7), i = Dr(e, [
    "$$slots",
    "$$events",
    "$$legacy",
    "$$host",
    "ref",
    "onOpenAutoFocus"
  ]);
  const s = C(() => Ar({ onOpenAutoFocus: o() }, { onOpenAutoFocus: Sg }));
  var d = {
    get ref() {
      return n();
    },
    set ref(h = null) {
      n(h), S();
    },
    get onOpenAutoFocus() {
      return o();
    },
    set onOpenAutoFocus(h) {
      o(h), S();
    }
  };
  return Th(t, ps(() => r(s), () => i, {
    get ref() {
      return n();
    },
    set ref(h) {
      n(h);
    }
  })), Jt(d);
}
Gt(Ju, { ref: {}, onOpenAutoFocus: {} }, [], [], { mode: "open" });
function Gu(t, e) {
  Wt(e, !0);
  let n = R(e, "ref", 15, null), o = R(e, "onkeydown", 7), i = Dr(e, [
    "$$slots",
    "$$events",
    "$$legacy",
    "$$host",
    "ref",
    "onkeydown"
  ]);
  function s(u) {
    if (Ys(u.key)) {
      const f = u.currentTarget.closest(nd.selector("input"));
      if (!f) return;
      Ks(u, f);
    }
  }
  const d = C(() => Ar({ onkeydown: o() }, { onkeydown: s }));
  var h = {
    get ref() {
      return n();
    },
    set ref(u = null) {
      n(u), S();
    },
    get onkeydown() {
      return o();
    },
    set onkeydown(u) {
      o(u), S();
    }
  };
  return Oh(t, ps(() => i, { "data-segment": "trigger" }, () => r(d), {
    get ref() {
      return n();
    },
    set ref(u) {
      n(u);
    }
  })), Jt(h);
}
Gt(Gu, { ref: {}, onkeydown: {} }, [], [], { mode: "open" });
var Xg = Q('<div class="copy-icon svg-icon" aria-hidden="true"></div> <span> </span>', 1), ep = Q('<div class="raw-json-icon svg-icon" aria-hidden="true"></div> <span> </span>', 1), tp = Q('<div class="open-in-new-icon svg-icon" aria-hidden="true"></div> <span> </span>', 1), np = Q("<!> <!>", 1), rp = Q("<!> <!>", 1), op = Q("<!> <!>", 1), ap = Q('<div class="broadcast-icon svg-icon" aria-hidden="true"></div> <span> </span>', 1), sp = Q('<div class="trash-icon svg-icon" aria-hidden="true"></div> <span> </span>', 1), ip = Q("<!> <!>", 1), lp = Q("<!> <!> <!> <!>", 1);
const dp = {
  hash: "svelte-8tu42h",
  code: ".open-in-new-icon {mask-image:var(--ehagaki-icon-6f70656e5f696e5f6e65775f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}"
};
function Hs(t, e) {
  Wt(e, !0), Ko(t, dp);
  const n = () => Aa(Xa, "$_", o), [o, i] = Za(), s = (j) => {
    var ne = Re(), xe = W(ne);
    He(xe, () => or, (Le, Fe) => {
      Fe(Le, {
        class: "menu-action-button",
        get onpointerdown() {
          return T();
        },
        get onSelect() {
          return p();
        },
        children: (D, J) => {
          var L = Xg(), G = N(W(L), 2), ue = O(G, !0);
          M(G), Ie((B) => te(ue, B), [
            () => u() ? n()("postHistory.copyFailed") : n()("postHistory.copyNevent")
          ]), A(D, L);
        },
        $$slots: { default: !0 }
      });
    }), A(j, ne);
  }, d = (j) => {
    var ne = Re(), xe = W(ne);
    He(xe, () => or, (Le, Fe) => {
      Fe(Le, {
        class: "menu-action-button",
        onSelect: () => k()(),
        children: (D, J) => {
          var L = ep(), G = N(W(L), 2), ue = O(G, !0);
          M(G), Ie((B) => te(ue, B), [() => n()("postHistory.rawJson")]), A(D, L);
        },
        $$slots: { default: !0 }
      });
    }), A(j, ne);
  };
  let h = R(e, "order", 7), u = R(e, "copyFailed", 7), I = R(e, "showBroadcast", 7), f = R(e, "broadcastSending", 7), m = R(e, "showDelete", 7), w = R(e, "showDeleteSeparator", 7), P = R(e, "deletionSending", 7), T = R(e, "onCopyPointerDown", 7), p = R(e, "onCopyNevent", 7), x = R(e, "externalClientLabel", 7, void 0), a = R(e, "onOpenExternalClient", 7, void 0), k = R(e, "onShowRawJson", 7), Z = R(e, "onBroadcastPointerDown", 7), V = R(e, "onBroadcastPost", 7), oe = R(e, "onOpenDeleteConfirm", 7);
  var _ = {
    get order() {
      return h();
    },
    set order(j) {
      h(j), S();
    },
    get copyFailed() {
      return u();
    },
    set copyFailed(j) {
      u(j), S();
    },
    get showBroadcast() {
      return I();
    },
    set showBroadcast(j) {
      I(j), S();
    },
    get broadcastSending() {
      return f();
    },
    set broadcastSending(j) {
      f(j), S();
    },
    get showDelete() {
      return m();
    },
    set showDelete(j) {
      m(j), S();
    },
    get showDeleteSeparator() {
      return w();
    },
    set showDeleteSeparator(j) {
      w(j), S();
    },
    get deletionSending() {
      return P();
    },
    set deletionSending(j) {
      P(j), S();
    },
    get onCopyPointerDown() {
      return T();
    },
    set onCopyPointerDown(j) {
      T(j), S();
    },
    get onCopyNevent() {
      return p();
    },
    set onCopyNevent(j) {
      p(j), S();
    },
    get externalClientLabel() {
      return x();
    },
    set externalClientLabel(j = void 0) {
      x(j), S();
    },
    get onOpenExternalClient() {
      return a();
    },
    set onOpenExternalClient(j = void 0) {
      a(j), S();
    },
    get onShowRawJson() {
      return k();
    },
    set onShowRawJson(j) {
      k(j), S();
    },
    get onBroadcastPointerDown() {
      return Z();
    },
    set onBroadcastPointerDown(j) {
      Z(j), S();
    },
    get onBroadcastPost() {
      return V();
    },
    set onBroadcastPost(j) {
      V(j), S();
    },
    get onOpenDeleteConfirm() {
      return oe();
    },
    set onOpenDeleteConfirm(j) {
      oe(j), S();
    }
  }, ee = lp(), fe = W(ee);
  {
    var he = (j) => {
      var ne = np(), xe = W(ne);
      He(xe, () => or, (Fe, D) => {
        D(Fe, {
          class: "menu-action-button",
          get onSelect() {
            return a();
          },
          children: (J, L) => {
            var G = tp(), ue = N(W(G), 2), B = O(ue, !0);
            M(ue), Ie(() => te(B, x())), A(J, G);
          },
          $$slots: { default: !0 }
        });
      });
      var Le = N(xe, 2);
      He(Le, () => ia, (Fe, D) => {
        D(Fe, { class: "post-history-menu-separator" });
      }), A(j, ne);
    };
    Ce(fe, (j) => {
      x() && a() && j(he);
    });
  }
  var me = N(fe, 2);
  {
    var ke = (j) => {
      var ne = rp(), xe = W(ne);
      d(xe);
      var Le = N(xe, 2);
      s(Le), A(j, ne);
    }, Ee = (j) => {
      var ne = op(), xe = W(ne);
      s(xe);
      var Le = N(xe, 2);
      d(Le), A(j, ne);
    };
    Ce(me, (j) => {
      h() === "raw-json-first" ? j(ke) : j(Ee, -1);
    });
  }
  var $e = N(me, 2);
  {
    var Pe = (j) => {
      var ne = Re(), xe = W(ne);
      He(xe, () => or, (Le, Fe) => {
        Fe(Le, {
          class: "menu-action-button",
          get disabled() {
            return f();
          },
          get onpointerdown() {
            return Z();
          },
          get onSelect() {
            return V();
          },
          children: (D, J) => {
            var L = ap(), G = N(W(L), 2), ue = O(G, !0);
            M(G), Ie((B) => te(ue, B), [() => n()("postHistory.broadcast")]), A(D, L);
          },
          $$slots: { default: !0 }
        });
      }), A(j, ne);
    };
    Ce($e, (j) => {
      I() && j(Pe);
    });
  }
  var re = N($e, 2);
  {
    var ve = (j) => {
      var ne = ip(), xe = W(ne);
      {
        var Le = (D) => {
          var J = Re(), L = W(J);
          He(L, () => ia, (G, ue) => {
            ue(G, { class: "post-history-menu-separator" });
          }), A(D, J);
        };
        Ce(xe, (D) => {
          w() && D(Le);
        });
      }
      var Fe = N(xe, 2);
      He(Fe, () => or, (D, J) => {
        J(D, {
          class: "menu-action-button menu-action-button-danger",
          get disabled() {
            return P();
          },
          onSelect: () => oe()(),
          children: (L, G) => {
            var ue = sp(), B = N(W(ue), 2), Ae = O(B, !0);
            M(B), Ie((ae) => te(Ae, ae), [
              () => P() ? n()("postHistory.deleteSending") : n()("postHistory.delete")
            ]), A(L, ue);
          },
          $$slots: { default: !0 }
        });
      }), A(j, ne);
    };
    Ce(re, (j) => {
      m() && j(ve);
    });
  }
  A(t, ee);
  var de = Jt(_);
  return i(), de;
}
Gt(
  Hs,
  {
    order: {},
    copyFailed: {},
    showBroadcast: {},
    broadcastSending: {},
    showDelete: {},
    showDeleteSeparator: {},
    deletionSending: {},
    onCopyPointerDown: {},
    onCopyNevent: {},
    externalClientLabel: {},
    onOpenExternalClient: {},
    onShowRawJson: {},
    onBroadcastPointerDown: {},
    onBroadcastPost: {},
    onOpenDeleteConfirm: {}
  },
  [],
  [],
  { mode: "open" }
);
var cp = Q('<img class="post-history-related-avatar svelte-1g9bqtt"/>'), up = Q('<span class="post-history-related-avatar-placeholder svelte-1g9bqtt" aria-hidden="true"></span>'), hp = Q('<article class="post-history-related-card svelte-1g9bqtt"><!> <div class="post-history-related-card-body svelte-1g9bqtt"><div class="post-history-related-author svelte-1g9bqtt"><!> <span class="post-history-related-author-name svelte-1g9bqtt"> </span></div> <!> <!> <!></div></article>');
const fp = {
  hash: "svelte-1g9bqtt",
  code: `.post-history-related-card.svelte-1g9bqtt {display:grid;margin-inline-start:-2px;--post-history-related-card-bg: color-mix(
            in srgb,
            var(--dialog-bg),
            var(--border-hr) 24%
        );border-inline-start:2px solid
            color-mix(in srgb, var(--theme), transparent 45%);background:var(--post-history-related-card-bg);color:var(--text);font-size:0.9rem;}.post-history-related-card-body.svelte-1g9bqtt {display:grid;grid-template-columns:minmax(0, 1fr);min-width:0;gap:2px;padding:2px 10px 0 8px;}.post-history-related-card .post-preview-footer {margin-inline:-8px -10px;}.post-history-related-author.svelte-1g9bqtt {display:flex;align-items:center;min-width:0;gap:8px;}.post-history-related-avatar.svelte-1g9bqtt,
    .post-history-related-avatar-placeholder.svelte-1g9bqtt {width:24px;height:24px;flex:0 0 auto;border-radius:50%;background:var(--border-hr);object-fit:cover;}.post-history-related-avatar-placeholder.svelte-1g9bqtt {display:inline-block;mask-image:var(--ehagaki-icon-6163636f756e745f636972636c655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);background-color:var(--text-muted);}.post-history-related-author-name.svelte-1g9bqtt {min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:600;}.post-history-related-card .post-history-related-content {margin:0;white-space:pre-wrap;overflow-wrap:anywhere;line-height:1.45;}`
};
function fd(t, e) {
  Wt(e, !0), Ko(t, fp);
  let n = R(e, "event", 7), o = R(e, "profile", 7, null), i = R(e, "media", 7, void 0), s = R(e, "model", 7, void 0), d = R(e, "loadSensitiveBody", 7, void 0), h = R(e, "emojiLoadStateByUrl", 23, () => ({})), u = R(e, "emojiImageMetaByUrl", 23, () => ({})), I = R(e, "scrollRoot", 7, null), f = R(e, "onImageOpen", 7, void 0), m = R(e, "topActions", 7, void 0), w = R(e, "footerLeftExtras", 7, void 0), P = R(e, "footerActions", 7, void 0), T = R(e, "footerDetails", 7, void 0), p = R(e, "footerMenu", 7, void 0), x = C(() => {
    const ve = o()?.displayName?.trim() || o()?.name?.trim();
    return ve || Lh(nu.npubEncode(n().pubkey), 12, 4);
  }), a = C(() => s() ?? ol({
    kind: n().kind,
    sourceContent: n().content,
    tags: n().tags,
    media: i()
  })), k = C(() => al(n().created_at * 1e3));
  var Z = {
    get event() {
      return n();
    },
    set event(ve) {
      n(ve), S();
    },
    get profile() {
      return o();
    },
    set profile(ve = null) {
      o(ve), S();
    },
    get media() {
      return i();
    },
    set media(ve = void 0) {
      i(ve), S();
    },
    get model() {
      return s();
    },
    set model(ve = void 0) {
      s(ve), S();
    },
    get loadSensitiveBody() {
      return d();
    },
    set loadSensitiveBody(ve = void 0) {
      d(ve), S();
    },
    get emojiLoadStateByUrl() {
      return h();
    },
    set emojiLoadStateByUrl(ve = {}) {
      h(ve), S();
    },
    get emojiImageMetaByUrl() {
      return u();
    },
    set emojiImageMetaByUrl(ve = {}) {
      u(ve), S();
    },
    get scrollRoot() {
      return I();
    },
    set scrollRoot(ve = null) {
      I(ve), S();
    },
    get onImageOpen() {
      return f();
    },
    set onImageOpen(ve = void 0) {
      f(ve), S();
    },
    get topActions() {
      return m();
    },
    set topActions(ve = void 0) {
      m(ve), S();
    },
    get footerLeftExtras() {
      return w();
    },
    set footerLeftExtras(ve = void 0) {
      w(ve), S();
    },
    get footerActions() {
      return P();
    },
    set footerActions(ve = void 0) {
      P(ve), S();
    },
    get footerDetails() {
      return T();
    },
    set footerDetails(ve = void 0) {
      T(ve), S();
    },
    get footerMenu() {
      return p();
    },
    set footerMenu(ve = void 0) {
      p(ve), S();
    }
  }, V = hp(), oe = O(V);
  Kt(oe, () => m() ?? Pr);
  var _ = N(oe, 2), ee = O(_), fe = O(ee);
  {
    var he = (ve) => {
      var de = cp();
      Ie(() => {
        Cr(de, "src", o().picture), Cr(de, "alt", r(x));
      }), A(ve, de);
    }, me = (ve) => {
      var de = up();
      A(ve, de);
    };
    Ce(fe, (ve) => {
      o()?.picture ? ve(he) : ve(me, -1);
    });
  }
  var ke = N(fe, 2), Ee = O(ke, !0);
  M(ke), M(ee);
  var $e = N(ee, 2);
  Kc($e, {
    get model() {
      return r(a);
    },
    get loadSensitiveBody() {
      return d();
    },
    get contentWarningEventId() {
      return n().id;
    },
    density: "compact",
    contentClass: "post-history-related-content",
    get emojiLoadStateByUrl() {
      return h();
    },
    get emojiImageMetaByUrl() {
      return u();
    },
    get scrollRoot() {
      return I();
    },
    get onImageOpen() {
      return f();
    }
  });
  var Pe = N($e, 2);
  iu(Pe, {
    get formattedDate() {
      return r(k);
    },
    density: "compact",
    get leftExtras() {
      return w();
    },
    get actions() {
      return P();
    },
    get trailing() {
      return p();
    }
  });
  var re = N(Pe, 2);
  return Kt(re, () => T() ?? Pr), M(_), M(V), Ie(() => te(Ee, r(x))), A(t, V), Jt(Z);
}
Gt(
  fd,
  {
    event: {},
    profile: {},
    media: {},
    model: {},
    loadSensitiveBody: {},
    emojiLoadStateByUrl: {},
    emojiImageMetaByUrl: {},
    scrollRoot: {},
    onImageOpen: {},
    topActions: {},
    footerLeftExtras: {},
    footerActions: {},
    footerDetails: {},
    footerMenu: {}
  },
  [],
  [],
  { mode: "open" }
);
var vp = Q('<article class="post-history-quote-status-card svelte-1rnem6w"><div class="post-history-quote-status-body svelte-1rnem6w"><p> </p> <!></div></article>');
const gp = {
  hash: "svelte-1rnem6w",
  code: `.post-history-quote-status-card.svelte-1rnem6w {display:grid;border-inline-start:2px solid
            color-mix(in srgb, var(--theme), transparent 45%);background:color-mix(in srgb, var(--dialog-bg), var(--border-hr) 24%);color:var(--text);font-size:0.9rem;}.post-history-quote-status-body.svelte-1rnem6w {display:grid;gap:8px;padding:2px 10px 10px;}.post-history-quote-status-message.svelte-1rnem6w {margin:0;color:var(--text-muted);line-height:1.45;}.post-history-quote-status-error.svelte-1rnem6w {color:var(--danger);}.post-history-quote-retry-button {justify-self:start;}`
};
function Zu(t, e) {
  Wt(e, !0), Ko(t, gp);
  const n = () => Aa(Xa, "$_", o), [o, i] = Za();
  let s = R(e, "preview", 7), d = R(e, "model", 7, void 0), h = R(e, "loadSensitiveBody", 7, void 0), u = R(e, "emojiLoadStateByUrl", 23, () => ({})), I = R(e, "emojiImageMetaByUrl", 23, () => ({})), f = R(e, "scrollRoot", 7, null), m = R(e, "onImageOpen", 7, void 0), w = R(e, "onRetry", 7, void 0), P = R(e, "footerActions", 7, void 0), T = R(e, "footerDetails", 7, void 0), p = R(e, "footerMenu", 7, void 0);
  function x() {
    switch (s().status) {
      case "deleted":
        return n()("postHistory.quoteDeleted");
      case "not-found":
        return n()("postHistory.quoteNotFound");
      case "error":
        return n()("postHistory.quoteFetchFailed");
      default:
        return n()("postHistory.quoteLoading");
    }
  }
  var a = {
    get preview() {
      return s();
    },
    set preview(ee) {
      s(ee), S();
    },
    get model() {
      return d();
    },
    set model(ee = void 0) {
      d(ee), S();
    },
    get loadSensitiveBody() {
      return h();
    },
    set loadSensitiveBody(ee = void 0) {
      h(ee), S();
    },
    get emojiLoadStateByUrl() {
      return u();
    },
    set emojiLoadStateByUrl(ee = {}) {
      u(ee), S();
    },
    get emojiImageMetaByUrl() {
      return I();
    },
    set emojiImageMetaByUrl(ee = {}) {
      I(ee), S();
    },
    get scrollRoot() {
      return f();
    },
    set scrollRoot(ee = null) {
      f(ee), S();
    },
    get onImageOpen() {
      return m();
    },
    set onImageOpen(ee = void 0) {
      m(ee), S();
    },
    get onRetry() {
      return w();
    },
    set onRetry(ee = void 0) {
      w(ee), S();
    },
    get footerActions() {
      return P();
    },
    set footerActions(ee = void 0) {
      P(ee), S();
    },
    get footerDetails() {
      return T();
    },
    set footerDetails(ee = void 0) {
      T(ee), S();
    },
    get footerMenu() {
      return p();
    },
    set footerMenu(ee = void 0) {
      p(ee), S();
    }
  }, k = Re(), Z = W(k);
  {
    var V = (ee) => {
      fd(ee, {
        get event() {
          return s().event;
        },
        get profile() {
          return s().profile;
        },
        get model() {
          return d();
        },
        get loadSensitiveBody() {
          return h();
        },
        get emojiLoadStateByUrl() {
          return u();
        },
        get emojiImageMetaByUrl() {
          return I();
        },
        get scrollRoot() {
          return f();
        },
        get onImageOpen() {
          return m();
        },
        get footerActions() {
          return P();
        },
        get footerDetails() {
          return T();
        },
        get footerMenu() {
          return p();
        }
      });
    }, oe = (ee) => {
      var fe = vp(), he = O(fe), me = O(he);
      let ke;
      var Ee = O(me, !0);
      M(me);
      var $e = N(me, 2);
      {
        var Pe = (re) => {
          ur(re, {
            type: "button",
            className: "post-history-quote-retry-button",
            onClick: () => w()?.(s().eventId),
            children: (ve, de) => {
              Wa();
              var j = ca();
              Ie((ne) => te(j, ne), [() => n()("postHistory.contextRetry")]), A(ve, j);
            },
            $$slots: { default: !0 }
          });
        };
        Ce($e, (re) => {
          s().status === "error" && re(Pe);
        });
      }
      M(he), M(fe), Ie(
        (re) => {
          ke = xo(me, 1, "post-history-quote-status-message svelte-1rnem6w", null, ke, {
            "post-history-quote-status-error": s().status === "error"
          }), te(Ee, re);
        },
        [() => x()]
      ), A(ee, fe);
    };
    Ce(Z, (ee) => {
      s().status === "resolved" ? ee(V) : ee(oe, -1);
    });
  }
  A(t, k);
  var _ = Jt(a);
  return i(), _;
}
Gt(
  Zu,
  {
    preview: {},
    model: {},
    loadSensitiveBody: {},
    emojiLoadStateByUrl: {},
    emojiImageMetaByUrl: {},
    scrollRoot: {},
    onImageOpen: {},
    onRetry: {},
    footerActions: {},
    footerDetails: {},
    footerMenu: {}
  },
  [],
  [],
  { mode: "open" }
);
const pp = 500, yp = 250, mp = /^[0-9a-f]{64}$/;
function bp() {
  return {
    status: "completed",
    nonEmptyLineCount: 0,
    invalidJsonCount: 0,
    invalidStructureCount: 0,
    invalidIdOrSignatureCount: 0,
    fileDuplicateCount: 0,
    otherAccountCount: 0,
    unsupportedKindCount: 0,
    uniquePostEventCount: 0,
    insertedPostCount: 0,
    updatedPostCount: 0,
    unchangedPostCount: 0,
    failedPostEventCount: 0,
    uniqueDeletionEventCount: 0,
    validDeletionETagCount: 0,
    insertedDeletionRequestCount: 0,
    updatedDeletionRequestCount: 0,
    unchangedDeletionRequestCount: 0,
    unsupportedDeletionEventCount: 0,
    failedDeletionEventCount: 0,
    appliedDeletionPostCount: 0,
    uniquePayloadEventCount: 0,
    savedPayloadCandidateCount: 0,
    failedPayloadEventCount: 0
  };
}
function Cp(t) {
  return { ...t };
}
function Pp(t) {
  return t.tags.filter(
    (e) => e[0] === "e" && typeof e[1] == "string" && mp.test(e[1])
  ).length;
}
class wp {
  postHistoryRepository;
  deletionRequestsRepository;
  sensitivePayloadRepository;
  constructor(e = {}) {
    this.postHistoryRepository = e.postHistoryRepository ?? ct, this.deletionRequestsRepository = e.deletionRequestsRepository ?? Vs, this.sensitivePayloadRepository = e.sensitivePayloadRepository ?? Pl;
  }
  async importFile(e) {
    const n = bp(), o = /* @__PURE__ */ new Set(), i = [];
    let s = !1, d = null;
    const h = Number.isFinite(e.file.size) && e.file.size > 0 ? e.file.size : 0;
    let u = 0;
    const I = () => n.invalidJsonCount > 0 || n.invalidStructureCount > 0 || n.invalidIdOrSignatureCount > 0, f = () => e.signal?.aborted ? "cancelled" : e.getCurrentPubkeyHex() !== e.ownerPubkeyHex ? "account-changed" : null, m = (V = !1) => {
      if (!e.onProgress)
        return;
      const oe = performance.now();
      !V && d !== null && oe - d < yp || (d = oe, e.onProgress({
        result: Cp(n),
        processedBytes: u,
        totalBytes: h
      }));
    }, w = (V) => {
      V <= 0 || (u = Math.min(
        h,
        Math.max(u, u + V)
      ));
    }, P = async () => {
      if (i.length === 0)
        return f();
      const V = f();
      if (V)
        return i.length = 0, V;
      const oe = i.filter((he) => he.type === "post").map((he) => ({
        event: he.event,
        attestation: he.attestation
      })), _ = i.filter((he) => he.type === "deletion").map((he) => he.event), ee = i.filter((he) => he.type === "payload").map((he) => ({ event: he.event, attestation: he.attestation }));
      if (i.length = 0, oe.length > 0)
        try {
          const he = await this.postHistoryRepository.upsertFetchedEvents({
            events: oe
          });
          n.insertedPostCount += he.insertedCount, n.updatedPostCount += he.updatedCount, n.unchangedPostCount += he.unchangedCount, n.appliedDeletionPostCount += he.appliedDeletionCount;
        } catch {
          n.failedPostEventCount += oe.length, s = !0;
        }
      const fe = f();
      if (fe)
        return fe;
      if (_.length > 0)
        try {
          const he = await this.deletionRequestsRepository.upsertImportedDeletionEvents({
            ownerPubkeyHex: e.ownerPubkeyHex,
            deletionEvents: _
          });
          n.insertedDeletionRequestCount += he.insertedCount, n.updatedDeletionRequestCount += he.updatedCount, n.unchangedDeletionRequestCount += he.unchangedCount, n.unsupportedDeletionEventCount += he.ignoredCount, n.appliedDeletionPostCount += he.appliedDeletionCount;
        } catch {
          n.failedDeletionEventCount += _.length, s = !0;
        }
      for (const he of ee)
        try {
          await this.sensitivePayloadRepository.putCandidate(he), n.savedPayloadCandidateCount += 1;
        } catch {
          n.failedPayloadEventCount += 1, s = !0;
        }
      return m(), f();
    }, T = async (V) => {
      const oe = f();
      if (oe)
        return oe;
      if (V.trim().length === 0)
        return null;
      n.nonEmptyLineCount += 1;
      let _;
      try {
        _ = JSON.parse(V);
      } catch {
        return n.invalidJsonCount += 1, null;
      }
      if (!_l(_))
        return n.invalidStructureCount += 1, null;
      const ee = _;
      if (ee.pubkey !== e.ownerPubkeyHex)
        return n.otherAccountCount += 1, null;
      if (![1, 36, 42, 1111, 5].includes(ee.kind))
        return n.unsupportedKindCount += 1, null;
      const fe = Fh(ee);
      if (!fe)
        return n.invalidIdOrSignatureCount += 1, null;
      if (o.has(ee.id))
        return n.fileDuplicateCount += 1, null;
      if (o.add(ee.id), ee.kind === 36)
        n.uniquePayloadEventCount += 1, i.push({ type: "payload", ...fe });
      else if ([1, 42, 1111].includes(ee.kind))
        n.uniquePostEventCount += 1, i.push({ type: "post", ...fe });
      else if (ee.kind === 5) {
        n.uniqueDeletionEventCount += 1;
        const he = Pp(ee);
        if (n.validDeletionETagCount += he, he === 0)
          return n.unsupportedDeletionEventCount += 1, null;
        i.push({ type: "deletion", ...fe });
      }
      return i.length >= pp ? P() : null;
    };
    let p;
    try {
      p = e.file.stream().getReader();
    } catch {
      return n.status = "failed", m(!0), n;
    }
    const x = () => {
      p.cancel().catch(() => {
      });
    };
    e.signal?.addEventListener("abort", x, { once: !0 });
    const a = new TextDecoder("utf-8", { fatal: !0 });
    let k = "";
    try {
      for (; ; ) {
        const V = f();
        if (V)
          return n.status = V, await p.cancel().catch(() => {
          }), i.length = 0, m(!0), n;
        const oe = await p.read();
        if (oe.done) {
          if (k += a.decode(), k.length > 0) {
            const ee = await T(k.replace(/\r$/, ""));
            if (ee)
              return n.status = ee, i.length = 0, m(!0), n;
          }
          break;
        }
        k += a.decode(oe.value, { stream: !0 });
        const _ = k.split(`
`);
        k = _.pop() ?? "";
        for (const ee of _) {
          const fe = await T(ee.replace(/\r$/, ""));
          if (fe)
            return n.status = fe, await p.cancel().catch(() => {
            }), i.length = 0, m(!0), n;
        }
        w(oe.value.byteLength), m();
      }
    } catch {
      const V = f();
      if (V)
        return n.status = V, i.length = 0, m(!0), n;
      const oe = await P();
      return oe ? (n.status = oe, m(!0), n) : (n.status = n.nonEmptyLineCount > 0 ? "partial" : "failed", m(!0), n);
    } finally {
      e.signal?.removeEventListener("abort", x), p.releaseLock();
    }
    const Z = await P();
    return Z ? (n.status = Z, m(!0), n) : (n.status = s || I() ? "partial" : "completed", m(!0), n);
  }
}
const xp = new wp();
var Sp = Q('<div class="xmark-icon svg-icon svelte-1qfqhib" aria-hidden="true"></div>'), Rp = Q('<span class="import-icon svg-icon svelte-1qfqhib" aria-hidden="true"></span> <span> </span>', 1), Ip = Q('<div aria-live="polite"> </div>'), _p = Q('<div class="import-progress-indicator"></div>'), Ep = Q('<div class="import-progress svelte-1qfqhib"><!> <div class="import-progress-summary svelte-1qfqhib"><span class="import-progress-metric svelte-1qfqhib"><span> </span> <span class="import-progress-number svelte-1qfqhib"> </span></span> <span class="import-progress-metric svelte-1qfqhib"><span> </span> <span class="import-progress-number svelte-1qfqhib"> </span></span> <span class="import-progress-metric svelte-1qfqhib"><span> </span> <span class="import-progress-number svelte-1qfqhib"> </span></span></div> <!></div>'), Ap = Q('<div class="import-results svelte-1qfqhib"><section aria-labelledby="post-history-import-input-heading" class="svelte-1qfqhib"><h3 id="post-history-import-input-heading" class="svelte-1qfqhib"> </h3> <dl class="svelte-1qfqhib"><div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div> <div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div> <div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div> <div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div> <div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div> <div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div> <div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div></dl></section> <section aria-labelledby="post-history-import-post-heading" class="svelte-1qfqhib"><h3 id="post-history-import-post-heading" class="svelte-1qfqhib"> </h3> <dl class="svelte-1qfqhib"><div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div> <div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div> <div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div> <div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div> <div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div> <div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div></dl></section> <section aria-labelledby="post-history-import-deletion-heading" class="svelte-1qfqhib"><h3 id="post-history-import-deletion-heading" class="svelte-1qfqhib"> </h3> <dl class="svelte-1qfqhib"><div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div> <div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div> <div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div> <div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div> <div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div> <div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div> <div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div></dl></section></div>'), Dp = Q('<div class="import-heading svelte-1qfqhib"><h2 class="svelte-1qfqhib"> </h2> <p class="svelte-1qfqhib"> </p></div> <input class="visually-hidden import-file-input" type="file"/> <div role="presentation"><!> <p class="import-drop-hint svelte-1qfqhib"> </p></div> <!> <!>', 1);
const kp = {
  hash: "svelte-1qfqhib",
  code: `.import-heading.svelte-1qfqhib {width:100%;text-align:left;}.import-heading.svelte-1qfqhib h2:where(.svelte-1qfqhib),
    .import-heading.svelte-1qfqhib p:where(.svelte-1qfqhib) {margin:0;}.import-heading.svelte-1qfqhib h2:where(.svelte-1qfqhib) {font-size:1.1rem;}.import-heading.svelte-1qfqhib p:where(.svelte-1qfqhib) {margin-top:6px;color:var(--text-muted);font-size:0.88rem;line-height:1.5;}.post-history-import-file-button {margin-top:0;}.import-drop-zone.svelte-1qfqhib {width:100%;margin-top:16px;padding:0;border:1px dashed transparent;border-radius:10px;text-align:center;transition:background-color 120ms ease, border-color 120ms ease;}.import-drop-zone-active.svelte-1qfqhib {border-color:var(--accent-color);background:color-mix(in srgb, var(--accent-color), transparent 90%);}.import-drop-hint.svelte-1qfqhib {display:none;margin:8px 0 0;color:var(--text-muted);font-size:0.8rem;}

    @media (hover: hover) and (pointer: fine) {.import-drop-zone.svelte-1qfqhib {min-height:136px;box-sizing:border-box;padding:20px 16px 28px;}.import-drop-hint.svelte-1qfqhib {display:block;}
    }.import-icon.svelte-1qfqhib {mask-image:var(--ehagaki-icon-636c6f75645f646f776e6c6f61645f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.xmark-icon.svelte-1qfqhib {mask-image:var(--ehagaki-icon-636c6f73655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.import-progress.svelte-1qfqhib {width:100%;margin-top:12px;}.import-progress-status.svelte-1qfqhib {margin-bottom:8px;color:var(--text);font-size:0.9rem;}.import-progress-status-error.svelte-1qfqhib {color:var(--error-color, #d32f2f);}.import-progress-summary.svelte-1qfqhib {display:grid;grid-template-columns:repeat(3, minmax(0, 1fr));gap:8px;margin-bottom:8px;color:var(--text-muted);font-size:0.82rem;font-variant-numeric:tabular-nums;}.import-progress-metric.svelte-1qfqhib {display:flex;flex-direction:column;align-items:center;gap:3px;min-width:0;}.import-progress-number.svelte-1qfqhib {color:var(--text);text-align:center;}.import-progress-root {width:100%;height:12px;border-radius:999px;background-color:color-mix(in srgb, var(--text) 12%, transparent);overflow:hidden;}.import-progress-indicator {width:100%;height:100%;border-radius:inherit;background-color:var(--theme);transition:translate 0.3s ease;}

    @media (prefers-reduced-motion: reduce) {.import-progress-indicator {transition:none;}
    }.import-results.svelte-1qfqhib {display:grid;grid-template-columns:repeat(3, minmax(0, 1fr));gap:8px;width:100%;margin-top:12px;}.import-results.svelte-1qfqhib section:where(.svelte-1qfqhib) {min-width:0;padding:10px;border:1px solid var(--border-hr);border-radius:8px;}.import-results.svelte-1qfqhib h3:where(.svelte-1qfqhib) {margin:0 0 8px;font-size:0.9rem;}.import-results.svelte-1qfqhib dl:where(.svelte-1qfqhib),
    .import-results.svelte-1qfqhib dl:where(.svelte-1qfqhib) div:where(.svelte-1qfqhib) {margin:0;}.import-results.svelte-1qfqhib dl:where(.svelte-1qfqhib) div:where(.svelte-1qfqhib) {display:flex;justify-content:space-between;gap:8px;padding-block:3px;font-size:0.8rem;}.import-results.svelte-1qfqhib dt:where(.svelte-1qfqhib) {min-width:0;color:var(--text-muted);}.import-results.svelte-1qfqhib dd:where(.svelte-1qfqhib) {flex:0 0 auto;font-variant-numeric:tabular-nums;}.post-history-import-dialog {max-width:min(760px, calc(100% - 10px));}

    @media (max-width: 680px) {.import-progress-summary.svelte-1qfqhib {grid-template-columns:1fr;}.import-progress-metric.svelte-1qfqhib {flex-direction:row;justify-content:space-between;gap:6px;}.import-progress-number.svelte-1qfqhib {text-align:right;}.import-results.svelte-1qfqhib {grid-template-columns:1fr;}
    }`
};
function Xu(t, e) {
  Wt(e, !0), Ko(t, kp);
  const n = () => Aa(Xa, "$_", o), [o, i] = Za();
  let s = R(e, "open", 15, !1), d = R(e, "ownerPubkeyHex", 7), h = R(e, "getCurrentPubkeyHex", 7), u = R(e, "onOpenChange", 7, void 0), I = R(e, "onImported", 7, void 0), f = be(null), m = be(!1), w = be(null), P = be(null), T = be(0), p = be(0), x = be(0), a = be(0), k = null, Z = null, V = null, oe = 0, _ = !1, ee = C(() => r(P)?.processedBytes ?? r(T)), fe = C(() => r(P)?.totalBytes ?? r(p)), he = C(() => r(fe) <= 0 ? 0 : Math.min(100, Math.max(0, Math.round(r(ee) / r(fe) * 100)))), me = C(() => {
    if (r(ee) <= 0 || r(fe) <= 0 || r(ee) >= r(fe) || r(x) < 1e3)
      return null;
    const ie = r(ee) / r(x), qe = (r(fe) - r(ee)) / ie;
    return Number.isFinite(qe) && qe >= 0 ? qe : null;
  }), ke = C(() => r(m) ? r(me) === null ? n()("postHistory.importRemainingTimeCalculating") : Ee(r(me)) : r(w)?.status === "completed" || r(w)?.status === "partial" ? Ee(0) : n()("postHistory.importRemainingTimeUnavailable"));
  function Ee(ie) {
    const qe = Math.max(0, Math.floor(ie / 1e3)), Ze = String(qe % 60).padStart(2, "0"), bt = Math.floor(qe / 60), Ct = bt % 60;
    return bt < 60 ? `${Ct}:${Ze}` : `${Math.floor(bt / 60)}:${String(Ct).padStart(2, "0")}:${Ze}`;
  }
  function $e() {
    V !== null && g(x, Math.max(0, performance.now() - V), !0);
  }
  function Pe() {
    Z !== null && (clearInterval(Z), Z = null), V = null;
  }
  function re() {
    Pe(), g(x, 0), V = performance.now(), Z = setInterval($e, 1e3);
  }
  function ve() {
    Pe(), g(P, null), g(T, 0), g(p, 0), g(x, 0);
  }
  function de(ie) {
    return `translate: -${100 - ie}% 0;`;
  }
  let j = C(() => r(m) ? "postHistory.importReading" : r(w) ? r(w).status === "completed" ? "postHistory.importComplete" : r(w).status === "partial" ? "postHistory.importPartial" : r(w).status === "account-changed" ? "postHistory.importAccountChanged" : r(w).status === "cancelled" ? "postHistory.importCancelled" : "postHistory.importFailed" : null);
  function ne() {
    g(w, null), g(m, !1), ve(), g(a, 0), k = null, r(f) && (r(f).value = "");
  }
  function xe() {
    oe += 1, k?.abort(), k = null, g(m, !1), ve(), g(a, 0);
  }
  function Le(ie) {
    ie || xe(), u()?.(ie);
  }
  function Fe() {
    !r(m) && d() && r(f)?.click();
  }
  function D(ie) {
    return ie ? Array.from(ie.types).includes("Files") || ie.files.length > 0 : !1;
  }
  function J(ie) {
    D(ie.dataTransfer) && (ie.preventDefault(), g(a, r(a) + 1));
  }
  function L(ie) {
    ie.preventDefault(), D(ie.dataTransfer);
  }
  function G(ie) {
    r(a) === 0 && !D(ie.dataTransfer) || g(a, Math.max(0, r(a) - 1), !0);
  }
  function ue(ie) {
    if (ie.preventDefault(), !D(ie.dataTransfer))
      return;
    g(a, 0);
    const qe = ie.dataTransfer?.files[0];
    qe && B(qe);
  }
  async function B(ie) {
    if (r(m) || !d())
      return;
    const qe = ++oe, Ze = new AbortController();
    k = Ze, g(m, !0), g(w, null), g(P, null), g(T, 0), g(p, Number.isFinite(ie.size) && ie.size > 0 ? ie.size : 0, !0), re();
    try {
      const bt = await xp.importFile({
        file: ie,
        ownerPubkeyHex: d(),
        getCurrentPubkeyHex: h(),
        signal: Ze.signal,
        onProgress: (_t) => {
          qe === oe && s() && (g(
            P,
            {
              result: { ..._t.result },
              processedBytes: _t.processedBytes,
              totalBytes: _t.totalBytes
            },
            !0
          ), g(T, _t.processedBytes, !0), g(p, _t.totalBytes, !0), g(w, { ..._t.result }, !0), $e());
        }
      });
      if (qe !== oe || !s())
        return;
      g(w, bt, !0), bt.insertedPostCount + bt.updatedPostCount + bt.appliedDeletionPostCount > 0 && await I()?.();
    } finally {
      qe === oe && (g(m, !1), Pe(), k = null);
    }
  }
  async function Ae(ie) {
    const qe = ie.currentTarget, Ze = qe.files?.[0];
    qe.value = "", Ze && await B(Ze);
  }
  Ge(() => {
    s() && !_ ? ne() : !s() && _ && xe(), _ = s();
  }), ys(Pe);
  var ae = {
    get open() {
      return s();
    },
    set open(ie = !1) {
      s(ie), S();
    },
    get ownerPubkeyHex() {
      return d();
    },
    set ownerPubkeyHex(ie) {
      d(ie), S();
    },
    get getCurrentPubkeyHex() {
      return h();
    },
    set getCurrentPubkeyHex(ie) {
      h(ie), S();
    },
    get onOpenChange() {
      return u();
    },
    set onOpenChange(ie = void 0) {
      u(ie), S();
    },
    get onImported() {
      return I();
    },
    set onImported(ie = void 0) {
      I(ie), S();
    }
  };
  {
    const ie = (bt) => {
      var Ct = Re(), _t = W(Ct);
      {
        const ln = (Xe, ut) => {
          let it = () => ut?.().props;
          {
            let X = C(() => n()("global.close"));
            ur(Xe, ps(it, {
              className: "modal-close",
              shape: "square",
              get ariaLabel() {
                return r(X);
              },
              children: (nt, St) => {
                var dn = Sp();
                A(nt, dn);
              },
              $$slots: { default: !0 }
            }));
          }
        };
        He(_t, () => su, (Xe, ut) => {
          ut(Xe, { child: ln, $$slots: { child: !0 } });
        });
      }
      A(bt, Ct);
    };
    let qe = C(() => n()("postHistory.importTitle")), Ze = C(() => n()("postHistory.importDescription"));
    au(t, {
      onOpenChange: Le,
      get title() {
        return r(qe);
      },
      get description() {
        return r(Ze);
      },
      contentClass: "post-history-import-dialog",
      footerVariant: "close-button",
      initialFocus: "content",
      get open() {
        return s();
      },
      set open(bt) {
        s(bt);
      },
      footer: ie,
      children: (bt, Ct) => {
        var _t = Dp(), ln = W(_t), Xe = O(ln), ut = O(Xe, !0);
        M(Xe);
        var it = N(Xe, 2), X = O(it, !0);
        M(it), M(ln);
        var nt = N(ln, 2);
        ei(nt, (gt) => g(f, gt), () => r(f));
        var St = N(nt, 2);
        let dn;
        var jn = O(St);
        {
          let gt = C(() => r(m) || !d()), Pt = C(() => n()("postHistory.importChooseFile"));
          ur(jn, {
            className: "post-history-import-file-button",
            variant: "default",
            shape: "pill",
            get disabled() {
              return r(gt);
            },
            get ariaLabel() {
              return r(Pt);
            },
            onClick: Fe,
            children: (Qt, cn) => {
              var Rt = Rp(), $t = N(W(Rt), 2), It = O($t, !0);
              M($t), Ie((bn) => te(It, bn), [() => n()("postHistory.importChooseFile")]), A(Qt, Rt);
            },
            $$slots: { default: !0 }
          });
        }
        var vt = N(jn, 2), Yt = O(vt, !0);
        M(vt), M(St);
        var et = N(St, 2);
        {
          var wt = (gt) => {
            var Pt = Ep(), Qt = O(Pt);
            {
              var cn = (On) => {
                var Pn = Ip();
                let fr;
                var vr = O(Pn, !0);
                M(Pn), Ie(
                  (Sr) => {
                    fr = xo(Pn, 1, "import-progress-status svelte-1qfqhib", null, fr, {
                      "import-progress-status-error": r(w)?.status === "failed"
                    }), te(vr, Sr);
                  },
                  [() => n()(r(j))]
                ), A(On, Pn);
              };
              Ce(Qt, (On) => {
                r(j) && On(cn);
              });
            }
            var Rt = N(Qt, 2), $t = O(Rt), It = O($t), bn = O(It, !0);
            M(It);
            var Lt = N(It, 2), Ye = O(Lt);
            M(Lt), M($t);
            var tn = N($t, 2), ht = O(tn), nn = O(ht, !0);
            M(ht);
            var rn = N(ht, 2), un = O(rn, !0);
            M(rn), M(tn);
            var xr = N(tn, 2), ar = O(xr), Kn = O(ar, !0);
            M(ar);
            var Cn = N(ar, 2), Ke = O(Cn, !0);
            M(Cn), M(xr), M(Rt);
            var An = N(Rt, 2);
            {
              let On = C(() => n()("postHistory.importProgressBarLabel")), Pn = C(() => `${r(he)}%`);
              He(An, () => Hh, (fr, vr) => {
                vr(fr, {
                  get value() {
                    return r(he);
                  },
                  max: 100,
                  get "aria-label"() {
                    return r(On);
                  },
                  get "aria-valuetext"() {
                    return r(Pn);
                  },
                  class: "import-progress-root",
                  children: (Sr, vo) => {
                    var Xn = _p();
                    Ie((go) => Yc(Xn, go), [() => de(r(he))]), A(Sr, Xn);
                  },
                  $$slots: { default: !0 }
                });
              });
            }
            M(Pt), Ie(
              (On, Pn, fr, vr, Sr) => {
                Cr(Pt, "aria-label", On), te(bn, Pn), te(Ye, `${r(he) ?? ""}%`), te(nn, fr), te(un, vr), te(Kn, Sr), te(Ke, r(ke));
              },
              [
                () => n()("postHistory.importProgress"),
                () => n()("postHistory.importProgress"),
                () => n()("postHistory.importElapsedTime"),
                () => Ee(r(x)),
                () => n()("postHistory.importEstimatedRemainingTime")
              ]
            ), A(gt, Pt);
          };
          Ce(et, (gt) => {
            (r(m) || r(w)) && gt(wt);
          });
        }
        var rt = N(et, 2);
        {
          var en = (gt) => {
            var Pt = Ap(), Qt = O(Pt), cn = O(Qt), Rt = O(cn, !0);
            M(cn);
            var $t = N(cn, 2), It = O($t), bn = O(It), Lt = O(bn, !0);
            M(bn);
            var Ye = N(bn), tn = O(Ye, !0);
            M(Ye), M(It);
            var ht = N(It, 2), nn = O(ht), rn = O(nn, !0);
            M(nn);
            var un = N(nn), xr = O(un, !0);
            M(un), M(ht);
            var ar = N(ht, 2), Kn = O(ar), Cn = O(Kn, !0);
            M(Kn);
            var Ke = N(Kn), An = O(Ke, !0);
            M(Ke), M(ar);
            var On = N(ar, 2), Pn = O(On), fr = O(Pn, !0);
            M(Pn);
            var vr = N(Pn), Sr = O(vr, !0);
            M(vr), M(On);
            var vo = N(On, 2), Xn = O(vo), go = O(Xn, !0);
            M(Xn);
            var Io = N(Xn), to = O(Io, !0);
            M(Io), M(vo);
            var kr = N(vo, 2), no = O(kr), Hr = O(no, !0);
            M(no);
            var ha = N(no), Oa = O(ha, !0);
            M(ha), M(kr);
            var Nr = N(kr, 2), Qr = O(Nr), _o = O(Qr, !0);
            M(Qr);
            var Eo = N(Qr), fa = O(Eo, !0);
            M(Eo), M(Nr), M($t), M(Qt);
            var ro = N(Qt, 2), Ao = O(ro), Do = O(Ao, !0);
            M(Ao);
            var Dn = N(Ao, 2), Yo = O(Dn), Mr = O(Yo), La = O(Mr, !0);
            M(Mr);
            var ko = N(Mr), Qo = O(ko, !0);
            M(ko), M(Yo);
            var po = N(Yo, 2), yo = O(po), Mo = O(yo, !0);
            M(yo);
            var zo = N(yo), Fa = O(zo, !0);
            M(zo), M(po);
            var gr = N(po, 2), To = O(gr), l = O(To, !0);
            M(To);
            var y = N(To), F = O(y, !0);
            M(y), M(gr);
            var $ = N(gr, 2), U = O($), z = O(U, !0);
            M(U);
            var ce = N(U), Me = O(ce, !0);
            M(ce), M($);
            var le = N($, 2), Se = O(le), De = O(Se, !0);
            M(Se);
            var Ne = N(Se), Be = O(Ne, !0);
            M(Ne), M(le);
            var pt = N(le, 2), yt = O(pt), Et = O(yt, !0);
            M(yt);
            var Ve = N(yt), tt = O(Ve, !0);
            M(Ve), M(pt), M(Dn), M(ro);
            var Zt = N(ro, 2), Xt = O(Zt), Rr = O(Xt, !0);
            M(Xt);
            var zr = N(Xt, 2), we = O(zr), Qe = O(we), wn = O(Qe, !0);
            M(Qe);
            var kn = N(Qe), Ft = O(kn, !0);
            M(kn), M(we);
            var mo = N(we, 2), Ha = O(mo), ts = O(Ha, !0);
            M(Ha);
            var Wo = N(Ha), Na = O(Wo, !0);
            M(Wo), M(mo);
            var Jo = N(mo, 2), Go = O(Jo), ns = O(Go, !0);
            M(Go);
            var $a = N(Go), Zo = O($a, !0);
            M($a), M(Jo);
            var Oo = N(Jo, 2), va = O(Oo), rs = O(va, !0);
            M(va);
            var Ba = N(va), os = O(Ba, !0);
            M(Ba), M(Oo);
            var ga = N(Oo, 2), Lo = O(ga), pa = O(Lo, !0);
            M(Lo);
            var as = N(Lo), Xo = O(as, !0);
            M(as), M(ga);
            var v = N(ga, 2), b = O(v), E = O(b, !0);
            M(b);
            var q = N(b), Y = O(q, !0);
            M(q), M(v);
            var se = N(v, 2), ge = O(se), Ue = O(ge, !0);
            M(ge);
            var Te = N(ge), We = O(Te, !0);
            M(Te), M(se), M(zr), M(Zt), M(Pt), Ie(
              (_e, Bt, xn, ze, Ht, At, Wr, bo, $r, Co, oo, Cs, qa, zs, Tr, Ua, ea, ya, ma, Yn, ta, ba, ao) => {
                te(Rt, _e), te(Lt, Bt), te(tn, r(w).nonEmptyLineCount), te(rn, xn), te(xr, r(w).fileDuplicateCount), te(Cn, ze), te(An, r(w).otherAccountCount), te(fr, Ht), te(Sr, r(w).unsupportedKindCount), te(go, At), te(to, r(w).invalidJsonCount), te(Hr, Wr), te(Oa, r(w).invalidStructureCount), te(_o, bo), te(fa, r(w).invalidIdOrSignatureCount), te(Do, $r), te(La, Co), te(Qo, r(w).uniquePostEventCount), te(Mo, oo), te(Fa, r(w).insertedPostCount), te(l, Cs), te(F, r(w).updatedPostCount), te(z, qa), te(Me, r(w).unchangedPostCount), te(De, zs), te(Be, r(w).failedPostEventCount), te(Et, Tr), te(tt, r(w).appliedDeletionPostCount), te(Rr, Ua), te(wn, ea), te(Ft, r(w).uniqueDeletionEventCount), te(ts, ya), te(Na, r(w).validDeletionETagCount), te(ns, ma), te(Zo, r(w).insertedDeletionRequestCount), te(rs, Yn), te(os, r(w).updatedDeletionRequestCount), te(pa, ta), te(Xo, r(w).unchangedDeletionRequestCount), te(E, ba), te(Y, r(w).unsupportedDeletionEventCount), te(Ue, ao), te(We, r(w).failedDeletionEventCount);
              },
              [
                () => n()("postHistory.importInputResults"),
                () => n()("postHistory.importNonEmptyLines"),
                () => n()("postHistory.importFileDuplicates"),
                () => n()("postHistory.importOtherAccount"),
                () => n()("postHistory.importUnsupportedKind"),
                () => n()("postHistory.importInvalidJson"),
                () => n()("postHistory.importInvalidStructure"),
                () => n()("postHistory.importInvalidCrypto"),
                () => n()("postHistory.importPostResults"),
                () => n()("postHistory.importPostEvents"),
                () => n()("postHistory.importInserted"),
                () => n()("postHistory.importUpdated"),
                () => n()("postHistory.importUnchanged"),
                () => n()("postHistory.importPostFailures"),
                () => n()("postHistory.importDeletionApplied"),
                () => n()("postHistory.importDeletionResults"),
                () => n()("postHistory.importDeletionEvents"),
                () => n()("postHistory.importDeletionTags"),
                () => n()("postHistory.importDeletionRequestsInserted"),
                () => n()("postHistory.importDeletionRequestsUpdated"),
                () => n()("postHistory.importDeletionRequestsUnchanged"),
                () => n()("postHistory.importUnsupportedDeletion"),
                () => n()("postHistory.importDeletionFailures")
              ]
            ), A(gt, Pt);
          };
          Ce(rt, (gt) => {
            r(w) && gt(en);
          });
        }
        Ie(
          (gt, Pt, Qt, cn) => {
            te(ut, gt), te(X, Pt), Cr(nt, "aria-label", Qt), dn = xo(St, 1, "import-drop-zone svelte-1qfqhib", null, dn, { "import-drop-zone-active": r(a) > 0 }), te(Yt, cn);
          },
          [
            () => n()("postHistory.importTitle"),
            () => n()("postHistory.importDescription"),
            () => n()("postHistory.importChooseFile"),
            () => r(a) > 0 ? n()("postHistory.importDropActive") : n()("postHistory.importDropHint")
          ]
        ), oi("change", nt, Ae), Ts("dragenter", St, J), Ts("dragover", St, L), Ts("dragleave", St, G), Ts("drop", St, ue), A(bt, _t);
      },
      $$slots: { footer: !0, default: !0 }
    });
  }
  var je = Jt(ae);
  return i(), je;
}
ru(["change"]);
Gt(
  Xu,
  {
    open: {},
    ownerPubkeyHex: {},
    getCurrentPubkeyHex: {},
    onOpenChange: {},
    onImported: {}
  },
  [],
  [],
  { mode: "open" }
);
var Mp = Q('<span class="post-preview-replies-badge svelte-11vk23d" aria-hidden="true"> </span>'), Tp = Q("<!> <!>", 1);
const Op = {
  hash: "svelte-11vk23d",
  code: `.post-preview-replies-badge-button {width:36px;min-width:36px;min-height:auto;color:var(--btn-post-preview-action);--btn-bg: var(--post-history-preview-footer-surface, var(--dialog-bg));background-color:var(
            --post-history-preview-footer-surface,
            var(--dialog-bg)
        );}.post-preview-replies-badge.svelte-11vk23d {display:inline-flex;align-items:center;justify-content:center;aspect-ratio:1;width:20px;height:20px;border-radius:999px;background:var(--btn-post-preview-action);color:var(--post-history-preview-footer-surface, var(--dialog-bg));font-size:0.6875rem;font-weight:700;line-height:20px;text-align:center;}
            .post-preview-replies-badge-button.selected
                .post-preview-replies-badge
         {background-color:var(--text-light);}

    @media (hover: hover) and (pointer: fine) {
                .post-preview-replies-badge-button:hover:not(:disabled)
                    .post-preview-replies-badge
             {background-color:var(--text);}
    }`
};
function vd(t, e) {
  Wt(e, !0), Ko(t, Op);
  let n = R(e, "count", 7), o = R(e, "selected", 7), i = R(e, "ariaLabel", 7), s = R(e, "onClick", 7), d = R(e, "tooltipContent", 23, i);
  const h = ou().overlayTarget;
  var u = {
    get count() {
      return n();
    },
    set count(m) {
      n(m), S();
    },
    get selected() {
      return o();
    },
    set selected(m) {
      o(m), S();
    },
    get ariaLabel() {
      return i();
    },
    set ariaLabel(m) {
      i(m), S();
    },
    get onClick() {
      return s();
    },
    set onClick(m) {
      s(m), S();
    },
    get tooltipContent() {
      return d();
    },
    set tooltipContent(m = i) {
      d(m), S();
    }
  }, I = Re(), f = W(I);
  return He(f, () => qh, (m, w) => {
    w(m, {
      children: (P, T) => {
        var p = Re(), x = W(p);
        He(x, () => Nh, (a, k) => {
          k(a, {
            delayDuration: 500,
            children: (Z, V) => {
              var oe = Tp(), _ = W(oe);
              {
                const fe = (he, me) => {
                  let ke = () => me?.().props;
                  const Ee = C(() => {
                    const { onclick: $e, ...Pe } = ke();
                    return { tooltipOnclick: $e, restProps: Pe };
                  });
                  ur(he, ps(
                    {
                      type: "button",
                      class: "post-preview-replies-badge-button",
                      get ariaLabel() {
                        return i();
                      },
                      contentLayout: "icon",
                      shape: "circle",
                      get selected() {
                        return o();
                      },
                      onClick: ($e) => {
                        s()(), typeof r(Ee).tooltipOnclick == "function" && r(Ee).tooltipOnclick($e);
                      }
                    },
                    () => r(Ee).restProps,
                    {
                      children: ($e, Pe) => {
                        var re = Mp(), ve = O(re, !0);
                        M(re), Ie(() => te(ve, n())), A($e, re);
                      },
                      $$slots: { default: !0 }
                    }
                  ));
                };
                He(_, () => $h, (he, me) => {
                  me(he, { child: fe, $$slots: { child: !0 } });
                });
              }
              var ee = N(_, 2);
              He(ee, () => ti, (fe, he) => {
                he(fe, {
                  get to() {
                    return h;
                  },
                  children: (me, ke) => {
                    var Ee = Re(), $e = W(Ee);
                    He($e, () => Bh, (Pe, re) => {
                      re(Pe, {
                        sideOffset: 8,
                        class: "tooltip-content post-preview-tooltip-content",
                        children: (ve, de) => {
                          Wa();
                          var j = ca();
                          Ie(() => te(j, d())), A(ve, j);
                        },
                        $$slots: { default: !0 }
                      });
                    }), A(me, Ee);
                  },
                  $$slots: { default: !0 }
                });
              }), A(Z, oe);
            },
            $$slots: { default: !0 }
          });
        }), A(P, p);
      },
      $$slots: { default: !0 }
    });
  }), A(t, I), Jt(u);
}
Gt(
  vd,
  {
    count: {},
    selected: {},
    ariaLabel: {},
    onClick: {},
    tooltipContent: {}
  },
  [],
  [],
  { mode: "open" }
);
var Lp = Q('<span class="post-history-thread-toggle-spinner post-history-thread-action-spinner svelte-cenxtw" aria-hidden="true"></span>'), Fp = Q('<span class="post-history-thread-toggle-icon-wrapper svelte-cenxtw" aria-hidden="true"><span></span></span>');
const Hp = {
  hash: "svelte-cenxtw",
  code: `.post-history-thread-node-top-actions {width:100%;height:28px;}\r
            .post-history-context-actions .post-history-thread-toggle-button,\r
            .post-history-thread-node-top-actions\r
                .post-history-thread-toggle-button\r
         {position:relative;width:40px;height:28px;min-height:28px;background:inherit;}.post-history-thread-toggle-icon-wrapper.svelte-cenxtw {position:relative;display:inline-flex;align-items:center;justify-content:center;flex:0 0 22px;}.post-history-thread-toggle-icon.svelte-cenxtw {--icon-size: 24px;}.post-history-thread-toggle-icon-arrow-top-right.svelte-cenxtw {mask-image:var(--ehagaki-icon-6172726f775f746f705f72696768745f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.post-history-thread-toggle-icon-collapse.svelte-cenxtw {--icon-size: 28px;mask-image:var(--ehagaki-icon-636f6c6c617073655f636f6e74656e745f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.post-history-thread-toggle-spinner.svelte-cenxtw {width:22px;height:22px;border:2px solid currentColor;border-right-color:transparent;border-radius:50%;\r
        animation: svelte-cenxtw-post-history-thread-toggle-spinner 0.8s linear infinite;}\r
\r
    @media (prefers-reduced-motion: reduce) {.post-history-thread-toggle-spinner.svelte-cenxtw {\r
            animation: none;}\r
    }\r
\r
    @keyframes svelte-cenxtw-post-history-thread-toggle-spinner {\r
        to {\r
            rotate: 360deg;\r
        }\r
    }`
};
function gd(t, e) {
  Wt(e, !0), Ko(t, Hp);
  let n = R(e, "expanded", 7), o = R(e, "ariaLabel", 7), i = R(e, "title", 23, o), s = R(e, "loading", 7, !1), d = R(e, "onClick", 7), h = C(() => [s() ? "is-loading" : ""].filter(Boolean).join(" "));
  var u = {
    get expanded() {
      return n();
    },
    set expanded(I) {
      n(I), S();
    },
    get ariaLabel() {
      return o();
    },
    set ariaLabel(I) {
      o(I), S();
    },
    get title() {
      return i();
    },
    set title(I = o) {
      i(I), S();
    },
    get loading() {
      return s();
    },
    set loading(I = !1) {
      s(I), S();
    },
    get onClick() {
      return d();
    },
    set onClick(I) {
      d(I), S();
    }
  };
  {
    let I = C(() => `post-history-thread-toggle-button ${r(h)}`.trim());
    ur(t, {
      type: "button",
      get className() {
        return r(I);
      },
      get ariaLabel() {
        return o();
      },
      get title() {
        return i();
      },
      contentLayout: "icon",
      shape: "rounded",
      get selected() {
        return n();
      },
      get disabled() {
        return s();
      },
      get onClick() {
        return d();
      },
      children: (f, m) => {
        var w = Re(), P = W(w);
        {
          var T = (x) => {
            var a = Lp();
            A(x, a);
          }, p = (x) => {
            var a = Fp(), k = O(a);
            M(a), Ie(() => xo(
              k,
              1,
              `post-history-thread-toggle-icon ${n() ? "post-history-thread-toggle-icon-collapse" : "post-history-thread-toggle-icon-arrow-top-right"} svg-icon`,
              "svelte-cenxtw"
            )), A(x, a);
          };
          Ce(P, (x) => {
            s() ? x(T) : x(p, -1);
          });
        }
        A(f, w);
      },
      $$slots: { default: !0 }
    });
  }
  return Jt(u);
}
Gt(
  gd,
  {
    expanded: {},
    ariaLabel: {},
    title: {},
    loading: {},
    onClick: {}
  },
  [],
  [],
  { mode: "open" }
);
var Np = Q("<span> </span>");
const $p = {
  hash: "svelte-1uufmpv",
  code: ".post-history-status-pill.svelte-1uufmpv {display:inline-flex;align-items:center;justify-content:center;min-height:18px;padding:0 8px;border:1px solid color-mix(in srgb, currentColor 18%, transparent);border-radius:999px;background:color-mix(in srgb, currentColor 8%, transparent);font-size:0.72rem;line-height:1;white-space:nowrap;}.post-history-status-pill-muted.svelte-1uufmpv {color:var(--text-muted, currentColor);}.post-history-status-pill-danger.svelte-1uufmpv {color:var(--destructive-fg, currentColor);}"
};
function eh(t, e) {
  Wt(e, !0), Ko(t, $p);
  let n = R(e, "label", 7), o = R(e, "tone", 7), i = R(e, "className", 7, "");
  var s = {
    get label() {
      return n();
    },
    set label(u) {
      n(u), S();
    },
    get tone() {
      return o();
    },
    set tone(u) {
      o(u), S();
    },
    get className() {
      return i();
    },
    set className(u = "") {
      i(u), S();
    }
  }, d = Np(), h = O(d, !0);
  return M(d), Ie(
    (u) => {
      xo(d, 1, u, "svelte-1uufmpv"), Cr(d, "aria-label", n()), Cr(d, "title", n()), te(h, n());
    },
    [
      () => Uh(`post-history-status-pill post-history-status-pill-${o()} ${i()}`.trim())
    ]
  ), A(t, d), Jt(s);
}
Gt(eh, { label: {}, tone: {}, className: {} }, [], [], { mode: "open" });
function th(t, e) {
  Wt(e, !0);
  const n = () => Aa(Xa, "$_", o), [o, i] = Za();
  let s = R(e, "eventId", 7), d = C(() => {
    if (s())
      return Vh[s()];
  });
  function h(T) {
    return T === "pending" || T === "processing" ? n()("postHistory.deleteSending") : T === "failed" ? n()("postHistory.deleteFailed") : null;
  }
  let u = C(() => h(r(d)));
  var I = {
    get eventId() {
      return s();
    },
    set eventId(T) {
      s(T), S();
    }
  }, f = Re(), m = W(f);
  {
    var w = (T) => {
      {
        let p = C(() => r(d) === "failed" ? "danger" : "muted"), x = C(() => `post-history-deletion-lifecycle-status ${r(d) ?? ""}`.trim());
        eh(T, {
          get label() {
            return r(u);
          },
          get tone() {
            return r(p);
          },
          get className() {
            return r(x);
          }
        });
      }
    };
    Ce(m, (T) => {
      r(u) && T(w);
    });
  }
  A(t, f);
  var P = Jt(I);
  return i(), P;
}
Gt(th, { eventId: {} }, [], [], { mode: "open" });
function nh(t, e) {
  Wt(e, !0);
  let n = R(e, "node", 7), o = R(e, "model", 7, void 0), i = R(e, "loadSensitiveBody", 7, void 0), s = R(e, "emojiLoadStateByUrl", 23, () => ({})), d = R(e, "emojiImageMetaByUrl", 23, () => ({})), h = R(e, "scrollRoot", 7, null), u = R(e, "onImageOpen", 7, void 0), I = R(e, "topActions", 7, void 0), f = R(e, "footerLeftExtras", 7, void 0), m = R(e, "footerActions", 7, void 0), w = R(e, "footerDetails", 7, void 0), P = R(e, "footerMenu", 7, void 0);
  var T = {
    get node() {
      return n();
    },
    set node(p) {
      n(p), S();
    },
    get model() {
      return o();
    },
    set model(p = void 0) {
      o(p), S();
    },
    get loadSensitiveBody() {
      return i();
    },
    set loadSensitiveBody(p = void 0) {
      i(p), S();
    },
    get emojiLoadStateByUrl() {
      return s();
    },
    set emojiLoadStateByUrl(p = {}) {
      s(p), S();
    },
    get emojiImageMetaByUrl() {
      return d();
    },
    set emojiImageMetaByUrl(p = {}) {
      d(p), S();
    },
    get scrollRoot() {
      return h();
    },
    set scrollRoot(p = null) {
      h(p), S();
    },
    get onImageOpen() {
      return u();
    },
    set onImageOpen(p = void 0) {
      u(p), S();
    },
    get topActions() {
      return I();
    },
    set topActions(p = void 0) {
      I(p), S();
    },
    get footerLeftExtras() {
      return f();
    },
    set footerLeftExtras(p = void 0) {
      f(p), S();
    },
    get footerActions() {
      return m();
    },
    set footerActions(p = void 0) {
      m(p), S();
    },
    get footerDetails() {
      return w();
    },
    set footerDetails(p = void 0) {
      w(p), S();
    },
    get footerMenu() {
      return P();
    },
    set footerMenu(p = void 0) {
      P(p), S();
    }
  };
  return fd(t, {
    get event() {
      return n().event;
    },
    get profile() {
      return n().profile;
    },
    get model() {
      return o();
    },
    get loadSensitiveBody() {
      return i();
    },
    get emojiLoadStateByUrl() {
      return s();
    },
    get emojiImageMetaByUrl() {
      return d();
    },
    get scrollRoot() {
      return h();
    },
    get onImageOpen() {
      return u();
    },
    get topActions() {
      return I();
    },
    get footerLeftExtras() {
      return f();
    },
    get footerActions() {
      return m();
    },
    get footerDetails() {
      return w();
    },
    get footerMenu() {
      return P();
    }
  }), Jt(T);
}
Gt(
  nh,
  {
    node: {},
    model: {},
    loadSensitiveBody: {},
    emojiLoadStateByUrl: {},
    emojiImageMetaByUrl: {},
    scrollRoot: {},
    onImageOpen: {},
    topActions: {},
    footerLeftExtras: {},
    footerActions: {},
    footerDetails: {},
    footerMenu: {}
  },
  [],
  [],
  { mode: "open" }
);
var Bp = Q('<span class="post-history-context-deleted-label svelte-1kez5et"> </span>'), qp = Q('<p class="post-history-context-message svelte-1kez5et"> </p>'), Up = Q('<p class="post-history-context-message post-history-context-error svelte-1kez5et"> </p> <!>', 1), Vp = Q('<div class="post-history-thread-node-parent svelte-1kez5et"><!></div>'), jp = Q('<div class="post-history-thread-node-top-actions"><!></div>'), Kp = Q('<div class="open-in-new-icon svg-icon" aria-hidden="true"></div> <span> </span>', 1), Yp = Q("<!> <!>", 1), Qp = Q('<div aria-hidden="true"></div> <span> </span>', 1), zp = Q("<!> <!> <!>", 1), Wp = Q('<div class="post-history-thread-node-children svelte-1kez5et"></div>'), Jp = Q('<div class="post-history-thread-node-view svelte-1kez5et"><!> <div class="post-history-thread-node-anchor svelte-1kez5et"><!></div> <!></div>');
const Gp = {
  hash: "svelte-1kez5et",
  code: `.post-history-thread-node-view.svelte-1kez5et {display:grid;gap:1px;}.post-history-thread-node-parent.svelte-1kez5et,
    .post-history-thread-node-children.svelte-1kez5et {display:grid;gap:2px;}.post-history-thread-node-parent.svelte-1kez5et {padding-inline-start:0;}.post-history-thread-node-anchor.svelte-1kez5et {display:grid;min-width:0;}.post-history-thread-node-children.svelte-1kez5et {padding-inline-start:0;}.post-history-context-button {min-height:28px;padding:2px 6px;color:var(--text-muted);background:var(--btn-bg);font-size:0.82rem;}.post-history-context-message.svelte-1kez5et {margin:0;color:var(--text-muted);font-size:0.82rem;}.post-history-context-deleted-label.svelte-1kez5et {width:fit-content;min-height:28px;padding:2px 6px;color:var(--text-muted);background-color:transparent;border:1px solid var(--btn-border);font-size:0.82rem;font-weight:normal;cursor:default;user-select:none;display:flex;align-items:center;}.post-history-context-error.svelte-1kez5et {color:var(--danger);}`
};
function fs(t, e) {
  Wt(e, !0), Ko(t, Gp);
  const n = () => Aa(Xa, "$_", o), [o, i] = Za();
  let s = R(e, "state", 7), d = R(e, "previewModelByEventId", 23, () => ({})), h = R(e, "getSensitiveBodyLoader", 7, void 0), u = R(e, "emojiLoadStateByUrl", 23, () => ({})), I = R(e, "emojiImageMetaByUrl", 23, () => ({})), f = R(e, "scrollRoot", 7, null), m = R(e, "onImageOpen", 7, void 0), w = R(e, "buildPostRecordForNode", 7, void 0), P = R(e, "onReplyPost", 7, void 0), T = R(e, "onQuotePost", 7, void 0), p = R(e, "getReactionReadModel", 7, void 0), x = R(e, "isReactionExpanded", 7, void 0), a = R(e, "getReactionLabel", 7, void 0), k = R(e, "onToggleReaction", 7, void 0), Z = R(e, "onToggleParent", 7, void 0), V = R(e, "onRetryParent", 7, void 0), oe = R(e, "onToggleChildren", 7, void 0), _ = R(e, "onRetryChildren", 7, void 0), ee = R(e, "onCopyPointerDown", 7, void 0), fe = R(e, "onCopyNevent", 7, void 0), he = R(e, "externalClientLabel", 7, void 0), me = R(e, "onOpenExternalClient", 7, void 0), ke = R(e, "isCopyFailed", 7, void 0), Ee = R(e, "onShowRawJson", 7, void 0), $e = R(e, "onBroadcastPointerDown", 7, void 0), Pe = R(e, "onBroadcastPost", 7, void 0), re = R(e, "isBroadcastSending", 7, void 0), ve = R(e, "canDeleteNodePost", 7, void 0), de = R(e, "isDeletionSending", 7, void 0), j = R(e, "onOpenDeleteConfirm", 7, void 0), ne = C(() => ni(s().node.event.created_at * 1e3)), xe = C(() => s().repliesActionState.status === "loaded" && s().repliesActionState.replyCount > 0), Le = C(() => ke()?.(s().node.eventId) ?? !1), Fe = C(() => re()?.(s().node.eventId) ?? !1), D = C(() => ve()?.(s()) ?? !1), J = C(() => de()?.(s().node.eventId) ?? !1);
  function L() {
    const X = s().repliesActionState;
    if (X.status === "loading")
      return n()("postHistory.checkingReplies");
    if (X.status === "failed")
      return n()("postHistory.recheckReplies");
    if (X.status === "loaded") {
      const nt = X.replyCount;
      return nt === 0 ? n()("postHistory.recheckReplies") : X.visible ? n()("postHistory.hideReplies") : n()("postHistory.showRepliesWithCount", { values: { count: nt } });
    }
    return n()("postHistory.checkReplies");
  }
  function G() {
    const X = s().repliesActionState;
    if (X.status === "failed" || X.status === "loaded" && X.replyCount === 0) {
      _()?.(s().node.eventId);
      return;
    }
    oe()?.(s().node.eventId);
  }
  function ue(X) {
    ee()?.(s(), X);
  }
  function B(X) {
    fe()?.(s(), X);
  }
  function Ae() {
    Ee()?.(s());
  }
  function ae(X) {
    $e()?.(s(), X);
  }
  function je(X) {
    Pe()?.(s(), X);
  }
  function ie() {
    j()?.(s());
  }
  var qe = {
    get state() {
      return s();
    },
    set state(X) {
      s(X), S();
    },
    get previewModelByEventId() {
      return d();
    },
    set previewModelByEventId(X = {}) {
      d(X), S();
    },
    get getSensitiveBodyLoader() {
      return h();
    },
    set getSensitiveBodyLoader(X = void 0) {
      h(X), S();
    },
    get emojiLoadStateByUrl() {
      return u();
    },
    set emojiLoadStateByUrl(X = {}) {
      u(X), S();
    },
    get emojiImageMetaByUrl() {
      return I();
    },
    set emojiImageMetaByUrl(X = {}) {
      I(X), S();
    },
    get scrollRoot() {
      return f();
    },
    set scrollRoot(X = null) {
      f(X), S();
    },
    get onImageOpen() {
      return m();
    },
    set onImageOpen(X = void 0) {
      m(X), S();
    },
    get buildPostRecordForNode() {
      return w();
    },
    set buildPostRecordForNode(X = void 0) {
      w(X), S();
    },
    get onReplyPost() {
      return P();
    },
    set onReplyPost(X = void 0) {
      P(X), S();
    },
    get onQuotePost() {
      return T();
    },
    set onQuotePost(X = void 0) {
      T(X), S();
    },
    get getReactionReadModel() {
      return p();
    },
    set getReactionReadModel(X = void 0) {
      p(X), S();
    },
    get isReactionExpanded() {
      return x();
    },
    set isReactionExpanded(X = void 0) {
      x(X), S();
    },
    get getReactionLabel() {
      return a();
    },
    set getReactionLabel(X = void 0) {
      a(X), S();
    },
    get onToggleReaction() {
      return k();
    },
    set onToggleReaction(X = void 0) {
      k(X), S();
    },
    get onToggleParent() {
      return Z();
    },
    set onToggleParent(X = void 0) {
      Z(X), S();
    },
    get onRetryParent() {
      return V();
    },
    set onRetryParent(X = void 0) {
      V(X), S();
    },
    get onToggleChildren() {
      return oe();
    },
    set onToggleChildren(X = void 0) {
      oe(X), S();
    },
    get onRetryChildren() {
      return _();
    },
    set onRetryChildren(X = void 0) {
      _(X), S();
    },
    get onCopyPointerDown() {
      return ee();
    },
    set onCopyPointerDown(X = void 0) {
      ee(X), S();
    },
    get onCopyNevent() {
      return fe();
    },
    set onCopyNevent(X = void 0) {
      fe(X), S();
    },
    get externalClientLabel() {
      return he();
    },
    set externalClientLabel(X = void 0) {
      he(X), S();
    },
    get onOpenExternalClient() {
      return me();
    },
    set onOpenExternalClient(X = void 0) {
      me(X), S();
    },
    get isCopyFailed() {
      return ke();
    },
    set isCopyFailed(X = void 0) {
      ke(X), S();
    },
    get onShowRawJson() {
      return Ee();
    },
    set onShowRawJson(X = void 0) {
      Ee(X), S();
    },
    get onBroadcastPointerDown() {
      return $e();
    },
    set onBroadcastPointerDown(X = void 0) {
      $e(X), S();
    },
    get onBroadcastPost() {
      return Pe();
    },
    set onBroadcastPost(X = void 0) {
      Pe(X), S();
    },
    get isBroadcastSending() {
      return re();
    },
    set isBroadcastSending(X = void 0) {
      re(X), S();
    },
    get canDeleteNodePost() {
      return ve();
    },
    set canDeleteNodePost(X = void 0) {
      ve(X), S();
    },
    get isDeletionSending() {
      return de();
    },
    set isDeletionSending(X = void 0) {
      de(X), S();
    },
    get onOpenDeleteConfirm() {
      return j();
    },
    set onOpenDeleteConfirm(X = void 0) {
      j(X), S();
    }
  }, Ze = Jp(), bt = O(Ze);
  {
    var Ct = (X) => {
      var nt = Vp(), St = O(nt);
      {
        var dn = (et) => {
          fs(et, {
            get state() {
              return s().parentNodeState;
            },
            get previewModelByEventId() {
              return d();
            },
            get getSensitiveBodyLoader() {
              return h();
            },
            get emojiLoadStateByUrl() {
              return u();
            },
            get emojiImageMetaByUrl() {
              return I();
            },
            get scrollRoot() {
              return f();
            },
            get onImageOpen() {
              return m();
            },
            get buildPostRecordForNode() {
              return w();
            },
            get onReplyPost() {
              return P();
            },
            get onQuotePost() {
              return T();
            },
            get getReactionReadModel() {
              return p();
            },
            get isReactionExpanded() {
              return x();
            },
            get getReactionLabel() {
              return a();
            },
            get onToggleReaction() {
              return k();
            },
            get onToggleParent() {
              return Z();
            },
            get onRetryParent() {
              return V();
            },
            get onToggleChildren() {
              return oe();
            },
            get onRetryChildren() {
              return _();
            },
            get onCopyPointerDown() {
              return ee();
            },
            get onCopyNevent() {
              return fe();
            },
            get externalClientLabel() {
              return he();
            },
            get onOpenExternalClient() {
              return me();
            },
            get isCopyFailed() {
              return ke();
            },
            get onShowRawJson() {
              return Ee();
            },
            get onBroadcastPointerDown() {
              return $e();
            },
            get onBroadcastPost() {
              return Pe();
            },
            get isBroadcastSending() {
              return re();
            },
            get canDeleteNodePost() {
              return ve();
            },
            get isDeletionSending() {
              return de();
            },
            get onOpenDeleteConfirm() {
              return j();
            }
          });
        }, jn = (et) => {
          var wt = Bp(), rt = O(wt, !0);
          M(wt), Ie((en) => te(rt, en), [() => n()("postHistory.replyTargetDeleted")]), A(et, wt);
        }, vt = (et) => {
          var wt = qp(), rt = O(wt, !0);
          M(wt), Ie((en) => te(rt, en), [() => n()("postHistory.contextNotFound")]), A(et, wt);
        }, Yt = (et) => {
          var wt = Up(), rt = W(wt), en = O(rt, !0);
          M(rt);
          var gt = N(rt, 2);
          ur(gt, {
            type: "button",
            className: "post-history-context-button post-history-context-retry-button",
            onClick: () => V()?.(s().node.eventId),
            children: (Pt, Qt) => {
              Wa();
              var cn = ca();
              Ie((Rt) => te(cn, Rt), [() => n()("postHistory.contextRetry")]), A(Pt, cn);
            },
            $$slots: { default: !0 }
          }), Ie((Pt) => te(en, Pt), [() => n()("postHistory.contextFetchFailed")]), A(et, wt);
        };
        Ce(St, (et) => {
          s().parentExpansion.visibleParent && s().parentNodeState ? et(dn) : s().parentExpansion.visibleParent && s().parentExpansion.parentDeleted ? et(jn, 1) : s().parentExpansion.visibleParent && s().parentExpansion.parentMissing ? et(vt, 2) : s().parentExpansion.visibleParent && s().parentExpansion.parentError && et(Yt, 3);
        });
      }
      M(nt), A(X, nt);
    };
    Ce(bt, (X) => {
      s().parentTargetId && X(Ct);
    });
  }
  var _t = N(bt, 2), ln = O(_t);
  {
    const X = (Yt) => {
      var et = Re(), wt = W(et);
      {
        var rt = (en) => {
          var gt = jp(), Pt = O(gt);
          {
            let Qt = C(() => s().parentExpansion.visibleParent ? n()("postHistory.hideReplyTarget") : n()("postHistory.showReplyTarget")), cn = C(() => s().parentExpansion.visibleParent ? n()("postHistory.hideReplyTarget") : n()("postHistory.showReplyTarget")), Rt = C(() => s().parentExpansion.visibleParent && s().parentExpansion.showParentLoadingIndicator);
            gd(Pt, {
              get ariaLabel() {
                return r(Qt);
              },
              get title() {
                return r(cn);
              },
              get expanded() {
                return s().parentExpansion.visibleParent;
              },
              get loading() {
                return r(Rt);
              },
              onClick: () => Z()?.(s().node.eventId)
            });
          }
          M(gt), A(en, gt);
        };
        Ce(wt, (en) => {
          s().parentTargetId && !s().parentAlreadyInPath && !(s().parentExpansion.visibleParent && s().parentExpansion.parentDeleted) && en(rt);
        });
      }
      A(Yt, et);
    }, nt = (Yt) => {
      th(Yt, {
        get eventId() {
          return s().node.eventId;
        }
      });
    }, St = (Yt) => {
      var et = Re(), wt = W(et);
      {
        var rt = (en) => {
          {
            const gt = ($t) => {
              var It = Re(), bn = W(It);
              {
                var Lt = (Ye) => {
                  {
                    let tn = C(L), ht = C(L);
                    vd(Ye, {
                      get count() {
                        return s().repliesActionState.replyCount;
                      },
                      get selected() {
                        return s().repliesActionState.visible;
                      },
                      get ariaLabel() {
                        return r(tn);
                      },
                      get tooltipContent() {
                        return r(ht);
                      },
                      onClick: G
                    });
                  }
                };
                Ce(bn, (Ye) => {
                  r(xe) && Ye(Lt);
                });
              }
              A($t, It);
            }, Pt = ($t) => {
              const It = C(() => p()?.(s().node.eventId));
              var bn = Re(), Lt = W(bn);
              {
                var Ye = (tn) => {
                  {
                    let ht = C(() => x()?.(s().node.eventId) ?? !1), nn = C(() => a()?.(s().node.eventId) ?? "");
                    cl(tn, {
                      get count() {
                        return r(It).totalCount;
                      },
                      get expanded() {
                        return r(ht);
                      },
                      get ariaLabel() {
                        return r(nn);
                      },
                      onToggle: () => k()?.(s().node.eventId)
                    });
                  }
                };
                Ce(Lt, (tn) => {
                  r(It) && r(It).totalCount > 0 && tn(Ye);
                });
              }
              A($t, bn);
            };
            let Qt = C(() => w()(s())), cn = C(() => s().node.event.kind !== 42 ? P() : void 0), Rt = C(() => s().node.event.kind !== 42 ? T() : void 0);
            ll(en, {
              get post() {
                return r(Qt);
              },
              get onReplyPost() {
                return r(cn);
              },
              get onQuotePost() {
                return r(Rt);
              },
              replyExtras: gt,
              reactionExtras: Pt,
              $$slots: { replyExtras: !0, reactionExtras: !0 }
            });
          }
        };
        Ce(wt, (en) => {
          w() && en(rt);
        });
      }
      A(Yt, et);
    }, dn = (Yt) => {
      const et = C(() => p()?.(s().node.eventId));
      var wt = Re(), rt = W(wt);
      {
        var en = (Pt) => {
          dl(Pt, {
            get readModel() {
              return r(et);
            },
            get emojiLoadStateByUrl() {
              return u();
            },
            get emojiImageMetaByUrl() {
              return I();
            }
          });
        }, gt = C(() => r(et) && r(et).totalCount > 0 && (x()?.(s().node.eventId) ?? !1));
        Ce(rt, (Pt) => {
          r(gt) && Pt(en);
        });
      }
      A(Yt, wt);
    }, jn = (Yt) => {
      const et = C(() => n()("common.showActions"));
      il(Yt, {
        get triggerAriaLabel() {
          return r(et);
        },
        get tooltipContent() {
          return r(et);
        },
        enableTooltip: !0,
        get timestamp() {
          return r(ne);
        },
        items: (rt) => {
          var en = zp(), gt = W(en);
          {
            var Pt = (Rt) => {
              var $t = Yp(), It = W($t);
              He(It, () => or, (Lt, Ye) => {
                Ye(Lt, {
                  class: "menu-action-button",
                  onSelect: () => me()?.(s()),
                  children: (tn, ht) => {
                    var nn = Kp(), rn = N(W(nn), 2), un = O(rn, !0);
                    M(rn), Ie(() => te(un, he())), A(tn, nn);
                  },
                  $$slots: { default: !0 }
                });
              });
              var bn = N(It, 2);
              He(bn, () => ia, (Lt, Ye) => {
                Ye(Lt, { class: "post-history-menu-separator" });
              }), A(Rt, $t);
            };
            Ce(gt, (Rt) => {
              he() && me() && Rt(Pt);
            });
          }
          var Qt = N(gt, 2);
          {
            let Rt = C(() => s().repliesActionState.status === "loading");
            He(Qt, () => or, ($t, It) => {
              It($t, {
                class: "menu-action-button",
                get disabled() {
                  return r(Rt);
                },
                onSelect: G,
                children: (bn, Lt) => {
                  var Ye = Qp(), tn = W(Ye), ht = N(tn, 2), nn = O(ht, !0);
                  M(ht), Ie(
                    (rn) => {
                      xo(tn, 1, `${s().repliesActionState.visible ? "collapse-content-icon" : "find_in_page-icon"} svg-icon`, "svelte-1kez5et"), te(nn, rn);
                    },
                    [() => L()]
                  ), A(bn, Ye);
                },
                $$slots: { default: !0 }
              });
            });
          }
          var cn = N(Qt, 2);
          Hs(cn, {
            order: "raw-json-first",
            get copyFailed() {
              return r(Le);
            },
            showBroadcast: !0,
            get broadcastSending() {
              return r(Fe);
            },
            get showDelete() {
              return r(D);
            },
            showDeleteSeparator: !0,
            get deletionSending() {
              return r(J);
            },
            onCopyPointerDown: ue,
            onCopyNevent: B,
            onShowRawJson: Ae,
            onBroadcastPointerDown: ae,
            onBroadcastPost: je,
            onOpenDeleteConfirm: ie
          }), A(rt, en);
        },
        $$slots: { items: !0 }
      });
    };
    let vt = C(() => h()?.(s().node.event));
    nh(ln, {
      get node() {
        return s().node;
      },
      get model() {
        return d()[s().node.eventId];
      },
      get loadSensitiveBody() {
        return r(vt);
      },
      get emojiLoadStateByUrl() {
        return u();
      },
      get emojiImageMetaByUrl() {
        return I();
      },
      get scrollRoot() {
        return f();
      },
      get onImageOpen() {
        return m();
      },
      topActions: X,
      footerLeftExtras: nt,
      footerActions: St,
      footerDetails: dn,
      footerMenu: jn,
      $$slots: {
        topActions: !0,
        footerLeftExtras: !0,
        footerActions: !0,
        footerDetails: !0,
        footerMenu: !0
      }
    });
  }
  M(_t);
  var Xe = N(_t, 2);
  {
    var ut = (X) => {
      var nt = Wp();
      sa(nt, 21, () => s().replyNodeStates, (St) => St.node.eventId, (St, dn) => {
        fs(St, {
          get state() {
            return r(dn);
          },
          get previewModelByEventId() {
            return d();
          },
          get getSensitiveBodyLoader() {
            return h();
          },
          get emojiLoadStateByUrl() {
            return u();
          },
          get emojiImageMetaByUrl() {
            return I();
          },
          get scrollRoot() {
            return f();
          },
          get onImageOpen() {
            return m();
          },
          get buildPostRecordForNode() {
            return w();
          },
          get onReplyPost() {
            return P();
          },
          get onQuotePost() {
            return T();
          },
          get getReactionReadModel() {
            return p();
          },
          get isReactionExpanded() {
            return x();
          },
          get getReactionLabel() {
            return a();
          },
          get onToggleReaction() {
            return k();
          },
          get onToggleParent() {
            return Z();
          },
          get onRetryParent() {
            return V();
          },
          get onToggleChildren() {
            return oe();
          },
          get onRetryChildren() {
            return _();
          },
          get onCopyPointerDown() {
            return ee();
          },
          get onCopyNevent() {
            return fe();
          },
          get externalClientLabel() {
            return he();
          },
          get onOpenExternalClient() {
            return me();
          },
          get isCopyFailed() {
            return ke();
          },
          get onShowRawJson() {
            return Ee();
          },
          get onBroadcastPointerDown() {
            return $e();
          },
          get onBroadcastPost() {
            return Pe();
          },
          get isBroadcastSending() {
            return re();
          },
          get canDeleteNodePost() {
            return ve();
          },
          get isDeletionSending() {
            return de();
          },
          get onOpenDeleteConfirm() {
            return j();
          }
        });
      }), M(nt), A(X, nt);
    };
    Ce(Xe, (X) => {
      s().repliesActionState.visible && s().replyNodeStates.length > 0 && X(ut);
    });
  }
  M(Ze), Ie(() => {
    Cr(_t, "data-post-history-thread-anchor-scope-id", s().anchorEventId), Cr(_t, "data-post-history-thread-anchor-event-id", s().node.eventId);
  }), A(t, Ze);
  var it = Jt(qe);
  return i(), it;
}
Gt(
  fs,
  {
    state: {},
    previewModelByEventId: {},
    getSensitiveBodyLoader: {},
    emojiLoadStateByUrl: {},
    emojiImageMetaByUrl: {},
    scrollRoot: {},
    onImageOpen: {},
    buildPostRecordForNode: {},
    onReplyPost: {},
    onQuotePost: {},
    getReactionReadModel: {},
    isReactionExpanded: {},
    getReactionLabel: {},
    onToggleReaction: {},
    onToggleParent: {},
    onRetryParent: {},
    onToggleChildren: {},
    onRetryChildren: {},
    onCopyPointerDown: {},
    onCopyNevent: {},
    externalClientLabel: {},
    onOpenExternalClient: {},
    isCopyFailed: {},
    onShowRawJson: {},
    onBroadcastPointerDown: {},
    onBroadcastPost: {},
    isBroadcastSending: {},
    canDeleteNodePost: {},
    isDeletionSending: {},
    onOpenDeleteConfirm: {}
  },
  [],
  [],
  { mode: "open" }
);
const Zp = 5, Xp = 0.5, ey = 2.5;
function Nn(t, e) {
  return `${t}:${e}`;
}
function ty(t) {
  return Math.max(
    0,
    Zp + t
  );
}
function ny(t) {
  return Math.min(
    ty(t) * Xp,
    ey
  );
}
function ji() {
  return {
    loadedParent: !1,
    visibleParent: !1,
    loadingParent: !1,
    parentError: null,
    parentMissing: !1,
    parentDeleted: !1,
    showParentLoadingIndicator: !1,
    revalidatingParent: !1,
    loadedChildren: !1,
    visibleChildren: !1,
    loadingChildren: !1,
    revalidatingChildren: !1,
    childrenError: null,
    lastFetchedParentAt: null,
    lastFetchedChildrenAt: null
  };
}
function gl(t) {
  return El(t.rawEvent, t) ? Al(t.rawEvent) : {
    id: t.eventId,
    pubkey: t.pubkeyHex,
    kind: t.kind,
    content: t.content,
    tags: t.tags.map((e) => [...e]),
    created_at: t.createdAt,
    sig: ""
  };
}
function Os(t) {
  const e = {
    id: t.eventId,
    pubkey: t.authorPubkey,
    kind: t.kind,
    content: t.content,
    tags: t.tags.map((n) => [...n]),
    created_at: t.createdAt,
    sig: ""
  };
  return xi(t.rawEvent) && t.rawEvent.id === e.id && t.rawEvent.pubkey === e.pubkey && t.rawEvent.kind === e.kind && t.rawEvent.content === e.content && t.rawEvent.created_at === e.created_at && JSON.stringify(t.rawEvent.tags) === JSON.stringify(e.tags) ? Al(t.rawEvent) : e;
}
function _s(t) {
  const e = _a(t.event);
  return {
    eventId: t.event.id,
    event: Al(t.event),
    authorPubkey: t.event.pubkey,
    rootEventId: e.rootId,
    parentEventId: e.parentId,
    profile: t.profile ?? null,
    relayUrls: [...t.relayUrls ?? []],
    sources: [...t.sources]
  };
}
function Es(t, e) {
  if (!t)
    return e;
  const n = Array.from(/* @__PURE__ */ new Set([
    ...t.relayUrls,
    ...e.relayUrls
  ])).sort((i, s) => i.localeCompare(s)), o = Array.from(/* @__PURE__ */ new Set([
    ...t.sources,
    ...e.sources
  ]));
  return {
    ...t,
    event: e.event,
    authorPubkey: e.authorPubkey,
    rootEventId: e.rootEventId,
    parentEventId: e.parentEventId,
    profile: e.profile ?? t.profile,
    relayUrls: n,
    sources: o
  };
}
function ec(t, e) {
  return [...t].sort((n, o) => {
    const i = e[n]?.event, s = e[o]?.event;
    return !i || !s ? n.localeCompare(o) : i.created_at !== s.created_at ? i.created_at - s.created_at : i.id.localeCompare(s.id);
  });
}
var ry = Q('<span class="post-history-context-deleted-label post-history-thread-direct-parent-context svelte-nb00ha"> </span>'), oy = Q('<p class="post-history-context-message post-history-thread-direct-parent-context svelte-nb00ha"> </p>'), ay = Q('<p class="post-history-context-message post-history-context-error post-history-thread-direct-parent-context svelte-nb00ha"> </p> <!>', 1), sy = Q('<div class="post-history-thread-parent-panel svelte-nb00ha"><!> <div class="post-history-context-actions svelte-nb00ha"><!></div></div>'), iy = Q('<div class="post-history-thread-replies-panel svelte-nb00ha"><div class="post-history-thread-replies-list svelte-nb00ha"></div></div>');
const ly = {
  hash: "svelte-nb00ha",
  code: `.post-history-thread-parent-panel.svelte-nb00ha,
    .post-history-thread-replies-panel.svelte-nb00ha {display:grid;gap:6px;}.post-history-thread-parent-panel.svelte-nb00ha {padding-bottom:4px;}.post-history-thread-replies-list.svelte-nb00ha {display:grid;}.post-history-context-actions.svelte-nb00ha {display:flex;flex-wrap:wrap;gap:6px;}.post-history-thread-direct-parent-context {margin-inline-start:var(--thread-direct-parent-indent);}.post-history-context-button {min-height:28px;padding:2px 6px;color:var(--text-muted);background:transparent;font-size:0.82rem;}

    @media (hover: hover) and (pointer: fine) {.post-history-context-button:hover:not(:disabled) {color:var(--theme);background:color-mix(in srgb, var(--theme) 10%, transparent);}
    }.post-history-context-message.svelte-nb00ha {margin:0;color:var(--text-muted);font-size:0.82rem;}.post-history-context-deleted-label.svelte-nb00ha {width:fit-content;min-height:28px;padding:2px 6px;color:var(--text-muted);background-color:transparent;border:1px solid var(--btn-border);font-size:0.82rem;font-weight:normal;cursor:default;user-select:none;display:flex;align-items:center;}.post-history-context-error.svelte-nb00ha {color:var(--danger);}`
};
function pl(t, e) {
  Wt(e, !0), Ko(t, ly);
  const n = () => Aa(Xa, "$_", o), [o, i] = Za();
  let s = R(e, "state", 7), d = R(e, "section", 7), h = R(e, "previewModelByEventId", 23, () => ({})), u = R(e, "getSensitiveBodyLoader", 7, void 0), I = R(e, "emojiLoadStateByUrl", 23, () => ({})), f = R(e, "emojiImageMetaByUrl", 23, () => ({})), m = R(e, "scrollRoot", 7, null), w = R(e, "onImageOpen", 7, void 0), P = R(e, "buildPostRecordForNode", 7, void 0), T = R(e, "onReplyPost", 7, void 0), p = R(e, "onQuotePost", 7, void 0), x = R(e, "getReactionReadModel", 7, void 0), a = R(e, "isReactionExpanded", 7, void 0), k = R(e, "getReactionLabel", 7, void 0), Z = R(e, "onToggleReaction", 7, void 0), V = R(e, "onToggleParent", 7, void 0), oe = R(e, "onRetryParent", 7, void 0), _ = R(e, "onToggleNodeParent", 7, void 0), ee = R(e, "onRetryNodeParent", 7, void 0), fe = R(e, "onToggleNodeChildren", 7, void 0), he = R(e, "onRetryNodeChildren", 7, void 0), me = R(e, "onCopyPointerDown", 7, void 0), ke = R(e, "onCopyNevent", 7, void 0), Ee = R(e, "externalClientLabel", 7, void 0), $e = R(e, "onOpenExternalClient", 7, void 0), Pe = R(e, "isCopyFailed", 7, void 0), re = R(e, "onShowRawJson", 7, void 0), ve = R(e, "onBroadcastPointerDown", 7, void 0), de = R(e, "onBroadcastPost", 7, void 0), j = R(e, "isBroadcastSending", 7, void 0), ne = R(e, "canDeleteNodePost", 7, void 0), xe = R(e, "isDeletionSending", 7, void 0), Le = R(e, "onOpenDeleteConfirm", 7, void 0);
  const Fe = `${ny(-1)}rem`;
  let D = C(() => s().parentNode ? {
    anchorEventId: s().anchorEventId,
    node: s().parentNode,
    parentTargetId: null,
    parentNodeState: null,
    parentExpansion: {
      loadedParent: !1,
      visibleParent: !1,
      loadingParent: !1,
      parentError: null,
      parentMissing: !1,
      parentDeleted: !1,
      showParentLoadingIndicator: !1,
      revalidatingParent: !1,
      loadedChildren: !1,
      visibleChildren: !1,
      loadingChildren: !1,
      revalidatingChildren: !1,
      childrenError: null,
      lastFetchedParentAt: null,
      lastFetchedChildrenAt: null
    },
    parentAlreadyInPath: !0,
    repliesActionState: {
      status: "unloaded",
      visible: !1,
      replies: [],
      replyCount: 0,
      error: null
    },
    replyNodeStates: [],
    isOwnReply: !1,
    depthFromAnchor: -1,
    cycleDetected: !1
  } : null);
  var J = {
    get state() {
      return s();
    },
    set state(ae) {
      s(ae), S();
    },
    get section() {
      return d();
    },
    set section(ae) {
      d(ae), S();
    },
    get previewModelByEventId() {
      return h();
    },
    set previewModelByEventId(ae = {}) {
      h(ae), S();
    },
    get getSensitiveBodyLoader() {
      return u();
    },
    set getSensitiveBodyLoader(ae = void 0) {
      u(ae), S();
    },
    get emojiLoadStateByUrl() {
      return I();
    },
    set emojiLoadStateByUrl(ae = {}) {
      I(ae), S();
    },
    get emojiImageMetaByUrl() {
      return f();
    },
    set emojiImageMetaByUrl(ae = {}) {
      f(ae), S();
    },
    get scrollRoot() {
      return m();
    },
    set scrollRoot(ae = null) {
      m(ae), S();
    },
    get onImageOpen() {
      return w();
    },
    set onImageOpen(ae = void 0) {
      w(ae), S();
    },
    get buildPostRecordForNode() {
      return P();
    },
    set buildPostRecordForNode(ae = void 0) {
      P(ae), S();
    },
    get onReplyPost() {
      return T();
    },
    set onReplyPost(ae = void 0) {
      T(ae), S();
    },
    get onQuotePost() {
      return p();
    },
    set onQuotePost(ae = void 0) {
      p(ae), S();
    },
    get getReactionReadModel() {
      return x();
    },
    set getReactionReadModel(ae = void 0) {
      x(ae), S();
    },
    get isReactionExpanded() {
      return a();
    },
    set isReactionExpanded(ae = void 0) {
      a(ae), S();
    },
    get getReactionLabel() {
      return k();
    },
    set getReactionLabel(ae = void 0) {
      k(ae), S();
    },
    get onToggleReaction() {
      return Z();
    },
    set onToggleReaction(ae = void 0) {
      Z(ae), S();
    },
    get onToggleParent() {
      return V();
    },
    set onToggleParent(ae = void 0) {
      V(ae), S();
    },
    get onRetryParent() {
      return oe();
    },
    set onRetryParent(ae = void 0) {
      oe(ae), S();
    },
    get onToggleNodeParent() {
      return _();
    },
    set onToggleNodeParent(ae = void 0) {
      _(ae), S();
    },
    get onRetryNodeParent() {
      return ee();
    },
    set onRetryNodeParent(ae = void 0) {
      ee(ae), S();
    },
    get onToggleNodeChildren() {
      return fe();
    },
    set onToggleNodeChildren(ae = void 0) {
      fe(ae), S();
    },
    get onRetryNodeChildren() {
      return he();
    },
    set onRetryNodeChildren(ae = void 0) {
      he(ae), S();
    },
    get onCopyPointerDown() {
      return me();
    },
    set onCopyPointerDown(ae = void 0) {
      me(ae), S();
    },
    get onCopyNevent() {
      return ke();
    },
    set onCopyNevent(ae = void 0) {
      ke(ae), S();
    },
    get externalClientLabel() {
      return Ee();
    },
    set externalClientLabel(ae = void 0) {
      Ee(ae), S();
    },
    get onOpenExternalClient() {
      return $e();
    },
    set onOpenExternalClient(ae = void 0) {
      $e(ae), S();
    },
    get isCopyFailed() {
      return Pe();
    },
    set isCopyFailed(ae = void 0) {
      Pe(ae), S();
    },
    get onShowRawJson() {
      return re();
    },
    set onShowRawJson(ae = void 0) {
      re(ae), S();
    },
    get onBroadcastPointerDown() {
      return ve();
    },
    set onBroadcastPointerDown(ae = void 0) {
      ve(ae), S();
    },
    get onBroadcastPost() {
      return de();
    },
    set onBroadcastPost(ae = void 0) {
      de(ae), S();
    },
    get isBroadcastSending() {
      return j();
    },
    set isBroadcastSending(ae = void 0) {
      j(ae), S();
    },
    get canDeleteNodePost() {
      return ne();
    },
    set canDeleteNodePost(ae = void 0) {
      ne(ae), S();
    },
    get isDeletionSending() {
      return xe();
    },
    set isDeletionSending(ae = void 0) {
      xe(ae), S();
    },
    get onOpenDeleteConfirm() {
      return Le();
    },
    set onOpenDeleteConfirm(ae = void 0) {
      Le(ae), S();
    }
  }, L = Re(), G = W(L);
  {
    var ue = (ae) => {
      var je = sy(), ie = O(je);
      {
        var qe = (it) => {
          fs(it, {
            get state() {
              return s().parentNodeState;
            },
            get previewModelByEventId() {
              return h();
            },
            get getSensitiveBodyLoader() {
              return u();
            },
            get emojiLoadStateByUrl() {
              return I();
            },
            get emojiImageMetaByUrl() {
              return f();
            },
            get scrollRoot() {
              return m();
            },
            get onImageOpen() {
              return w();
            },
            get buildPostRecordForNode() {
              return P();
            },
            get onReplyPost() {
              return T();
            },
            get onQuotePost() {
              return p();
            },
            get getReactionReadModel() {
              return x();
            },
            get isReactionExpanded() {
              return a();
            },
            get getReactionLabel() {
              return k();
            },
            get onToggleReaction() {
              return Z();
            },
            get onToggleParent() {
              return _();
            },
            get onRetryParent() {
              return ee();
            },
            get onToggleChildren() {
              return fe();
            },
            get onRetryChildren() {
              return he();
            },
            get onCopyPointerDown() {
              return me();
            },
            get onCopyNevent() {
              return ke();
            },
            get externalClientLabel() {
              return Ee();
            },
            get onOpenExternalClient() {
              return $e();
            },
            get isCopyFailed() {
              return Pe();
            },
            get onShowRawJson() {
              return re();
            },
            get onBroadcastPointerDown() {
              return ve();
            },
            get onBroadcastPost() {
              return de();
            },
            get isBroadcastSending() {
              return j();
            },
            get canDeleteNodePost() {
              return ne();
            },
            get isDeletionSending() {
              return xe();
            },
            get onOpenDeleteConfirm() {
              return Le();
            }
          });
        }, Ze = (it) => {
          fs(it, {
            get state() {
              return r(D);
            },
            get previewModelByEventId() {
              return h();
            },
            get getSensitiveBodyLoader() {
              return u();
            },
            get emojiLoadStateByUrl() {
              return I();
            },
            get emojiImageMetaByUrl() {
              return f();
            },
            get scrollRoot() {
              return m();
            },
            get onImageOpen() {
              return w();
            },
            get buildPostRecordForNode() {
              return P();
            },
            get onReplyPost() {
              return T();
            },
            get onQuotePost() {
              return p();
            },
            get getReactionReadModel() {
              return x();
            },
            get isReactionExpanded() {
              return a();
            },
            get getReactionLabel() {
              return k();
            },
            get onToggleReaction() {
              return Z();
            },
            get onToggleParent() {
              return _();
            },
            get onRetryParent() {
              return ee();
            },
            get onToggleChildren() {
              return fe();
            },
            get onRetryChildren() {
              return he();
            },
            get onCopyPointerDown() {
              return me();
            },
            get onCopyNevent() {
              return ke();
            },
            get externalClientLabel() {
              return Ee();
            },
            get onOpenExternalClient() {
              return $e();
            },
            get isCopyFailed() {
              return Pe();
            },
            get onShowRawJson() {
              return re();
            },
            get onBroadcastPointerDown() {
              return ve();
            },
            get onBroadcastPost() {
              return de();
            },
            get isBroadcastSending() {
              return j();
            },
            get canDeleteNodePost() {
              return ne();
            },
            get isDeletionSending() {
              return xe();
            },
            get onOpenDeleteConfirm() {
              return Le();
            }
          });
        }, bt = (it) => {
          var X = ry(), nt = O(X, !0);
          M(X), Ie((St) => te(nt, St), [() => n()("postHistory.replyTargetDeleted")]), A(it, X);
        }, Ct = (it) => {
          var X = oy(), nt = O(X, !0);
          M(X), Ie((St) => te(nt, St), [() => n()("postHistory.contextNotFound")]), A(it, X);
        }, _t = (it) => {
          var X = ay(), nt = W(X), St = O(nt, !0);
          M(nt);
          var dn = N(nt, 2);
          ur(dn, {
            type: "button",
            className: "post-history-context-button post-history-context-retry-button",
            onClick: () => oe()?.(),
            children: (jn, vt) => {
              Wa();
              var Yt = ca();
              Ie((et) => te(Yt, et), [() => n()("postHistory.contextRetry")]), A(jn, Yt);
            },
            $$slots: { default: !0 }
          }), Ie((jn) => te(St, jn), [() => n()("postHistory.contextFetchFailed")]), A(it, X);
        };
        Ce(ie, (it) => {
          s().parentExpansion.visibleParent && s().parentNodeState ? it(qe) : s().parentExpansion.visibleParent && r(D) ? it(Ze, 1) : s().parentExpansion.visibleParent && s().parentExpansion.parentDeleted ? it(bt, 2) : s().parentExpansion.visibleParent && s().parentExpansion.parentMissing ? it(Ct, 3) : s().parentExpansion.visibleParent && s().parentExpansion.parentError && it(_t, 4);
        });
      }
      var ln = N(ie, 2), Xe = O(ln);
      {
        var ut = (it) => {
          {
            let X = C(() => s().parentExpansion.visibleParent ? n()("postHistory.hideReplyTarget") : n()("postHistory.showReplyTarget")), nt = C(() => s().parentExpansion.visibleParent ? n()("postHistory.hideReplyTarget") : n()("postHistory.showReplyTarget")), St = C(() => s().parentExpansion.visibleParent && s().parentExpansion.showParentLoadingIndicator);
            gd(it, {
              get ariaLabel() {
                return r(X);
              },
              get title() {
                return r(nt);
              },
              get expanded() {
                return s().parentExpansion.visibleParent;
              },
              get loading() {
                return r(St);
              },
              onClick: () => V()?.()
            });
          }
        };
        Ce(Xe, (it) => {
          s().parentExpansion.visibleParent && s().parentExpansion.parentDeleted || it(ut);
        });
      }
      M(ln), M(je), Ie(() => Yc(je, `--thread-direct-parent-indent: ${Fe}`)), A(ae, je);
    }, B = (ae) => {
      var je = iy(), ie = O(je);
      sa(ie, 21, () => s().replyNodeStates, (qe) => qe.node.eventId, (qe, Ze) => {
        fs(qe, {
          get state() {
            return r(Ze);
          },
          get previewModelByEventId() {
            return h();
          },
          get getSensitiveBodyLoader() {
            return u();
          },
          get emojiLoadStateByUrl() {
            return I();
          },
          get emojiImageMetaByUrl() {
            return f();
          },
          get scrollRoot() {
            return m();
          },
          get onImageOpen() {
            return w();
          },
          get buildPostRecordForNode() {
            return P();
          },
          get onReplyPost() {
            return T();
          },
          get onQuotePost() {
            return p();
          },
          get getReactionReadModel() {
            return x();
          },
          get isReactionExpanded() {
            return a();
          },
          get getReactionLabel() {
            return k();
          },
          get onToggleReaction() {
            return Z();
          },
          get onToggleParent() {
            return _();
          },
          get onRetryParent() {
            return ee();
          },
          get onToggleChildren() {
            return fe();
          },
          get onRetryChildren() {
            return he();
          },
          get onCopyPointerDown() {
            return me();
          },
          get onCopyNevent() {
            return ke();
          },
          get externalClientLabel() {
            return Ee();
          },
          get onOpenExternalClient() {
            return $e();
          },
          get isCopyFailed() {
            return Pe();
          },
          get onShowRawJson() {
            return re();
          },
          get onBroadcastPointerDown() {
            return ve();
          },
          get onBroadcastPost() {
            return de();
          },
          get isBroadcastSending() {
            return j();
          },
          get canDeleteNodePost() {
            return ne();
          },
          get isDeletionSending() {
            return xe();
          },
          get onOpenDeleteConfirm() {
            return Le();
          }
        });
      }), M(ie), M(je), A(ae, je);
    };
    Ce(G, (ae) => {
      d() === "parent" && s().parentTargetId ? ae(ue) : d() === "children" && s().repliesActionState.visible && s().replyNodeStates.length > 0 && ae(B, 1);
    });
  }
  A(t, L);
  var Ae = Jt(J);
  return i(), Ae;
}
Gt(
  pl,
  {
    state: {},
    section: {},
    previewModelByEventId: {},
    getSensitiveBodyLoader: {},
    emojiLoadStateByUrl: {},
    emojiImageMetaByUrl: {},
    scrollRoot: {},
    onImageOpen: {},
    buildPostRecordForNode: {},
    onReplyPost: {},
    onQuotePost: {},
    getReactionReadModel: {},
    isReactionExpanded: {},
    getReactionLabel: {},
    onToggleReaction: {},
    onToggleParent: {},
    onRetryParent: {},
    onToggleNodeParent: {},
    onRetryNodeParent: {},
    onToggleNodeChildren: {},
    onRetryNodeChildren: {},
    onCopyPointerDown: {},
    onCopyNevent: {},
    externalClientLabel: {},
    onOpenExternalClient: {},
    isCopyFailed: {},
    onShowRawJson: {},
    onBroadcastPointerDown: {},
    onBroadcastPost: {},
    isBroadcastSending: {},
    canDeleteNodePost: {},
    isDeletionSending: {},
    onOpenDeleteConfirm: {}
  },
  [],
  [],
  { mode: "open" }
);
function dy({
  getShow: t,
  getPosts: e,
  getRxNostr: n,
  getRelayConfig: o,
  getIsSearchMode: i
}) {
  let s = be(hr({})), d = 0, h = [];
  function u() {
    h = [];
  }
  function I() {
    h.forEach((w) => w.release()), u();
  }
  function f() {
    I(), g(s, {}, !0);
  }
  function m(w, P) {
    if (w.kind !== 42)
      return null;
    if (!w.channelEventId)
      return P("postHistory.channelUnknown");
    const T = r(s)[w.channelEventId];
    return !T || T.status === "loading" ? P("postHistory.channelLoading") : T.status === "resolved" && T.name ? T.name : P("postHistory.channelUnknown");
  }
  return Ge(() => {
    t() || f();
  }), Ge(() => {
    if (t())
      return () => {
        I();
      };
  }), Ge(() => {
    if (!t())
      return;
    I();
    const w = e().filter((a) => a.kind === 42);
    if (w.length === 0)
      return;
    const P = Array.from(new Set(w.map((a) => a.channelEventId).filter((a) => typeof a == "string")));
    if (P.length === 0)
      return;
    const T = ++d, p = i() ? void 0 : n(), x = P.map((a) => {
      const k = So.sanitizeExternalRelayUrls(w.filter((Z) => Z.channelEventId === a).flatMap((Z) => jh(Z)), { limit: Kh });
      return Yh.resolveInternal({ eventId: a, relayHints: k }, p, o());
    });
    h = x, g(
      s,
      {
        ...Vr(() => r(s)),
        ...Object.fromEntries(P.map((a) => [a, { status: "loading", name: null }]))
      },
      !0
    ), Promise.all(x.map((a) => a.cacheReady)).then((a) => {
      !t() || T !== d || g(
        s,
        {
          ...r(s),
          ...Object.fromEntries(a.map((k) => [
            k.context.eventId,
            Qh(k.cache, !!p)
          ]))
        },
        !0
      );
    }).catch((a) => {
      console.error("チャンネル表示のキャッシュ解決に失敗しました:", a);
    }), Promise.all(x.map((a) => a.refresh)).then((a) => {
      !t() || T !== d || (u(), g(
        s,
        {
          ...r(s),
          ...Object.fromEntries(a.map((k) => [
            k.snapshot.context.eventId,
            {
              status: k.snapshot.context.name ? "resolved" : "failed",
              name: k.snapshot.context.name
            }
          ]))
        },
        !0
      ));
    }).catch((a) => {
      T === d && u(), console.error("チャンネル表示のバックグラウンド解決に失敗しました:", a);
    });
  }), ys(() => {
    I();
  }), { getChannelText: m, cancelCurrentChannelResolution: I };
}
function cy() {
  let t = be(hr({})), e = be(!1), n = be(0), o = be(0), i, s = be(void 0);
  function d(P) {
    return Wh(P, Qc.value);
  }
  function h() {
    i && (clearTimeout(i), i = void 0), g(e, !1), g(s, void 0);
  }
  function u(P, T) {
    g(
      s,
      {
        eventId: P.eventId,
        ...si(T.clientX, T.clientY)
      },
      !0
    );
  }
  function I(P, T) {
    if (r(s)?.eventId === P.eventId)
      return {
        x: r(s).x,
        y: r(s).y
      };
    const p = T.currentTarget, x = p instanceof HTMLElement ? p.getBoundingClientRect() : null;
    return si(x ? x.left + x.width / 2 : 0, x ? x.bottom + 8 : 0);
  }
  function f(P, T) {
    i && clearTimeout(i), g(n, P, !0), g(o, T, !0), g(e, !0), i = setTimeout(
      () => {
        g(e, !1), i = void 0;
      },
      1800
    );
  }
  async function m(P, T) {
    const p = I(P, T), x = d(P);
    if (x ? await zh(x, "nevent", navigator, window) : !1) {
      g(t, { ...r(t), [P.eventId]: void 0 }, !0), f(p.x, p.y);
      return;
    }
    g(t, { ...r(t), [P.eventId]: "failed" }, !0), setTimeout(
      () => {
        g(t, { ...r(t), [P.eventId]: void 0 }, !0);
      },
      1800
    );
  }
  function w() {
    g(t, {}, !0), h();
  }
  return {
    get copyState() {
      return r(t);
    },
    get showCopyFloatingMessage() {
      return r(e);
    },
    get copyFloatingMessageX() {
      return r(n);
    },
    get copyFloatingMessageY() {
      return r(o);
    },
    captureCopyPointerPosition: u,
    hideCopyFloatingMessage: h,
    handleCopyNevent: m,
    resetState: w
  };
}
const uy = 8;
function Ls(t) {
  return So.sanitizeExternalRelayUrls(t, { limit: uy });
}
function tc(t, e) {
  return {
    id: t,
    pubkey: e,
    kind: 1,
    content: "",
    tags: [],
    created_at: 0,
    sig: ""
  };
}
function nc(t) {
  return {
    targetEventId: t.targetEventId,
    status: "loading",
    event: null,
    profile: null,
    authorPubkey: t.authorHint ?? null,
    relayHints: Ls(t.relayHints ?? []),
    errorCode: null,
    updatedAt: null
  };
}
function pd({
  getShow: t,
  getRxNostr: e,
  getRelayConfig: n,
  postHistoryRepositoryImpl: o = ct,
  contextFetchService: i = wl,
  deletionRequestsRepositoryImpl: s = Vs,
  deletionFetchService: d = xl,
  profileSyncCoordinator: h = void 0
}) {
  const u = h ?? Dl({ getShow: t, getRxNostr: e }), I = !h;
  let f = be({}), m = be(hr({})), w = be(hr({}));
  const P = /* @__PURE__ */ new Map(), T = /* @__PURE__ */ new Map(), p = /* @__PURE__ */ new Map(), x = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map(), k = /* @__PURE__ */ new Map(), Z = /* @__PURE__ */ new Map();
  let V = 0;
  function oe(D) {
    g(
      m,
      {
        ...r(m),
        [D]: (r(m)[D] ?? 0) + 1
      },
      !0
    );
  }
  function _(D) {
    const J = T.get(D);
    if (J)
      for (const L of J)
        oe(L);
  }
  function ee(D, J) {
    const L = r(f)[D], G = J(L);
    return L && L.status === G.status && L.event === G.event && L.profile === G.profile && L.authorPubkey === G.authorPubkey && L.errorCode === G.errorCode && L.updatedAt === G.updatedAt && sl(L.relayHints, G.relayHints) ? L : (g(f, { ...r(f), [D]: G }), _(D), G);
  }
  function fe(D, J) {
    return ee(D, (L) => {
      const G = L ?? nc({ targetEventId: D });
      return {
        targetEventId: D,
        status: J.status ?? G.status,
        event: J.event !== void 0 ? J.event : G.event,
        profile: J.profile !== void 0 ? J.profile : G.profile,
        authorPubkey: J.authorPubkey !== void 0 ? J.authorPubkey : G.authorPubkey,
        relayHints: J.relayHints ? Ls(J.relayHints) : G.relayHints,
        errorCode: J.errorCode !== void 0 ? J.errorCode : G.errorCode,
        updatedAt: J.updatedAt !== void 0 ? J.updatedAt : G.updatedAt
      };
    });
  }
  function he(D) {
    const J = r(f)[D.targetEventId], L = Ls([...J?.relayHints ?? [], ...D.relayHints ?? []]), G = J?.authorPubkey ?? D.authorHint ?? null, ue = !J || J.authorPubkey !== G || !sl(J.relayHints, L);
    return fe(D.targetEventId, { authorPubkey: G, relayHints: L }), ue;
  }
  function me(D) {
    const J = P.get(D.scopeKey) ?? /* @__PURE__ */ new Set();
    J.add(D.targetEventId), P.set(D.scopeKey, J);
    const L = T.get(D.targetEventId) ?? /* @__PURE__ */ new Set();
    L.add(D.scopeKey), T.set(D.targetEventId, L), D.scopeKey in r(w) || g(w, { ...r(w), [D.scopeKey]: 0 }, !0), D.scopeKey in r(m) || g(m, { ...r(m), [D.scopeKey]: 0 }, !0);
  }
  async function ke(D, J) {
    return (await s.getDeletedTargets([{ targetAuthorPubkey: D, targetEventId: J }])).get(D)?.has(J) ?? !1;
  }
  function Ee(D, J) {
    if (!(!D || !J))
      for (const [L, G] of Object.entries(r(f)))
        G.authorPubkey === D && fe(L, { profile: J });
  }
  function $e(D, J) {
    const L = u.ensureProfile(D, J);
    Ee(D, L);
  }
  u.subscribe((D, J) => {
    t() && Ee(D, J);
  });
  async function Pe(D, J, L = {}) {
    if (!D.pubkey || !D.id)
      return !1;
    if (await ke(D.pubkey, D.id))
      return fe(D.id, {
        status: "deleted",
        event: null,
        authorPubkey: D.pubkey,
        relayHints: J,
        errorCode: null,
        updatedAt: Date.now()
      }), !0;
    if (a.has(D.id))
      return a.get(D.id) ?? !1;
    const G = e();
    if (!G)
      return !1;
    const ue = (async () => {
      try {
        const B = d.fetchDeletionRequests(G, {
          targets: [{ event: D, relayUrls: J }],
          relayHints: J,
          relayConfig: n()
        });
        k.set(D.id, B);
        const Ae = await B.promise;
        Ae.events.length > 0 && await s.upsertValidDeletionRequests({
          targetEvents: [D],
          deletionEvents: Ae.events,
          fetchedAt: Ae.fetchedAt
        });
        const ae = await ke(D.pubkey, D.id);
        return ae && fe(D.id, {
          status: "deleted",
          event: null,
          authorPubkey: D.pubkey,
          relayHints: J,
          errorCode: null,
          updatedAt: Date.now()
        }), ae;
      } catch {
        return !1;
      } finally {
        k.delete(D.id), a.delete(D.id);
      }
    })();
    return a.set(D.id, ue), L.background ? !1 : ue;
  }
  function re(D, J) {
    return Z.get(D) === J;
  }
  async function ve(D, J = {}) {
    me(D);
    const L = r(f)[D.targetEventId], G = he(D), ue = r(f)[D.targetEventId] ?? nc(D), B = !!J.background && L?.status === "resolved";
    if (!J.force && L) {
      if (L.status === "resolved" || L.status === "deleted")
        return L.status === "resolved" && L.authorPubkey && $e(L.authorPubkey, r(f)[D.targetEventId]?.relayHints ?? L.relayHints), r(f)[D.targetEventId] ?? L;
      if (L.status === "loading" && p.has(D.targetEventId))
        return await p.get(D.targetEventId) ?? r(f)[D.targetEventId] ?? L;
      if (!G && (L.status === "not-found" || L.status === "error"))
        return r(f)[D.targetEventId] ?? L;
    }
    if (!J.force && p.has(D.targetEventId))
      return await p.get(D.targetEventId) ?? r(f)[D.targetEventId] ?? ue;
    J.force && (x.get(D.targetEventId)?.cancel(), x.delete(D.targetEventId), p.delete(D.targetEventId));
    const Ae = ++V;
    Z.set(D.targetEventId, Ae);
    const ae = (async () => {
      try {
        B || fe(D.targetEventId, { status: "loading", errorCode: null });
        const je = await o.getByEventId(D.targetEventId);
        if (!re(D.targetEventId, Ae))
          return r(f)[D.targetEventId] ?? null;
        if (je) {
          const ut = Ls([
            ...ue.relayHints,
            ...je.relayHints,
            ...je.acceptedRelays,
            ...je.fetchedRelays ?? []
          ]);
          if (typeof je.deletedAt == "number")
            return fe(D.targetEventId, {
              status: "deleted",
              event: null,
              authorPubkey: je.pubkeyHex,
              relayHints: ut,
              errorCode: null,
              updatedAt: Date.now()
            });
          const X = gl(je), nt = ut, St = fe(D.targetEventId, {
            status: "resolved",
            event: X,
            authorPubkey: X.pubkey,
            relayHints: nt,
            errorCode: null,
            updatedAt: Date.now()
          });
          return $e(X.pubkey, nt), Pe(X, nt, { background: !0 }), r(f)[D.targetEventId] ?? St;
        }
        if (D.authorHint) {
          const ut = await Pe(tc(D.targetEventId, D.authorHint), ue.relayHints);
          if (!re(D.targetEventId, Ae))
            return r(f)[D.targetEventId] ?? null;
          if (ut)
            return r(f)[D.targetEventId] ?? null;
        }
        const ie = e();
        if (!ie || !t())
          return B ? r(f)[D.targetEventId] ?? ue : fe(D.targetEventId, {
            status: "error",
            event: null,
            authorPubkey: ue.authorPubkey,
            relayHints: ue.relayHints,
            errorCode: "nostr_not_ready",
            updatedAt: Date.now()
          });
        const qe = i.fetchEventById(ie, {
          eventId: D.targetEventId,
          relayHints: ue.relayHints,
          relayConfig: n()
        });
        x.set(D.targetEventId, qe);
        const Ze = await qe.promise;
        if (x.delete(D.targetEventId), !re(D.targetEventId, Ae))
          return r(f)[D.targetEventId] ?? null;
        if (!Ze.event) {
          if (D.authorHint) {
            const ut = await Pe(tc(D.targetEventId, D.authorHint), ue.relayHints);
            if (!re(D.targetEventId, Ae))
              return r(f)[D.targetEventId] ?? null;
            if (ut)
              return r(f)[D.targetEventId] ?? null;
          }
          return B ? r(f)[D.targetEventId] ?? ue : fe(D.targetEventId, {
            status: "not-found",
            event: null,
            authorPubkey: ue.authorPubkey,
            relayHints: ue.relayHints,
            errorCode: null,
            updatedAt: Date.now()
          });
        }
        const bt = Ls([
          ...Ze.relayUrl ? [Ze.relayUrl] : [],
          ...ue.relayHints
        ]), Ct = Ze.event, _t = bt, ln = await Pe(Ct, _t);
        if (!re(D.targetEventId, Ae))
          return r(f)[D.targetEventId] ?? null;
        if (ln)
          return Ct.id !== D.targetEventId && fe(D.targetEventId, {
            status: "deleted",
            event: null,
            authorPubkey: Ct.pubkey,
            relayHints: _t,
            errorCode: null,
            updatedAt: Date.now()
          }), r(f)[D.targetEventId] ?? null;
        const Xe = fe(D.targetEventId, {
          status: "resolved",
          event: Ct,
          authorPubkey: Ct.pubkey,
          relayHints: _t,
          errorCode: null,
          updatedAt: Date.now()
        });
        return $e(Ct.pubkey, _t), r(f)[D.targetEventId] ?? Xe;
      } catch {
        return re(D.targetEventId, Ae) ? B ? r(f)[D.targetEventId] ?? ue : fe(D.targetEventId, {
          status: "error",
          event: null,
          authorPubkey: ue.authorPubkey,
          relayHints: ue.relayHints,
          errorCode: "fetch_failed",
          updatedAt: Date.now()
        }) : r(f)[D.targetEventId] ?? null;
      } finally {
        x.delete(D.targetEventId), p.delete(D.targetEventId);
      }
    })();
    return p.set(D.targetEventId, ae), await ae;
  }
  async function de(D, J = {}) {
    return await Promise.all(D.map((L) => ve(L, J)));
  }
  async function j(D, J = {}) {
    return await ve(D, { ...J, force: !0 });
  }
  function ne(D) {
    return r(f)[D] ?? null;
  }
  function xe(D) {
    return r(m)[D] ?? 0;
  }
  function Le(D) {
    const J = P.get(D);
    if (J)
      for (const L of J) {
        const G = T.get(L);
        G && (G.delete(D), !(G.size > 0) && (T.delete(L), Z.delete(L), x.get(L)?.cancel(), x.delete(L), k.get(L)?.cancel(), k.delete(L), p.delete(L), a.delete(L)));
      }
    P.delete(D), g(
      w,
      {
        ...r(w),
        [D]: (r(w)[D] ?? 0) + 1
      },
      !0
    ), oe(D);
  }
  function Fe() {
    x.forEach((D) => D.cancel()), k.forEach((D) => D.cancel()), x.clear(), k.clear(), p.clear(), a.clear(), P.clear(), T.clear(), I && u.reset(), Z.clear(), g(f, {}), g(m, {}, !0), g(w, {}, !0);
  }
  return {
    ensureTarget: ve,
    ensureTargets: de,
    retryTarget: j,
    getTargetSnapshot: ne,
    getScopeRevision: xe,
    invalidateScope: Le,
    reset: Fe
  };
}
const hy = /nostr:[^\s<>"']+/gi, fy = /[),.!?:;\]\u3001\u3002\uff01\uff08\uff09\uff0c\uff0e\uff1a\uff1b\u300d\u300f\u3011]+$/u, vy = /^[\s),.!?:;\]\u3001\u3002\uff01\uff08\uff09\uff0c\uff0e\uff1a\uff1b\u300d\u300f\u3011]+$/u;
function gy(t) {
  return So.sanitizeExternalRelayUrls(
    typeof t == "string" && t.length > 0 ? [t] : [],
    { limit: 1 }
  )[0] ?? null;
}
function py(t) {
  const e = t.match(fy);
  if (!e)
    return {
      uri: t,
      trailingText: ""
    };
  const n = e[0];
  return {
    uri: t.slice(0, -n.length),
    trailingText: n
  };
}
function yy(t) {
  if (!t.toLowerCase().startsWith("nostr:"))
    return null;
  try {
    const e = nu.decode(t.slice(6));
    return e.type === "note" ? e.data : e.type === "nevent" ? e.data.id : null;
  } catch {
    return null;
  }
}
function my(t) {
  const e = t.replace(/[ \t]{2,}/g, " ").trim();
  return e.length === 0 || vy.test(e) ? null : e;
}
function rh(t) {
  if (!t)
    return [];
  const e = /* @__PURE__ */ new Map();
  for (const n of t.tags) {
    if (!Array.isArray(n) || n[0] !== "q")
      continue;
    const o = n[1];
    if (!Od(o))
      continue;
    const i = gy(n[2]), s = Od(n[3]) ? n[3] : null, d = e.get(o);
    if (!d) {
      e.set(o, {
        eventId: o,
        relayHint: i,
        authorHint: s
      });
      continue;
    }
    !d.relayHint && i && (d.relayHint = i), !d.authorHint && s && (d.authorHint = s);
  }
  return Array.from(e.values());
}
function rc(t) {
  if (!t || typeof t.content != "string" || t.content.length === 0)
    return t?.content ?? "";
  const e = rh(t);
  if (e.length === 0)
    return t.content;
  const n = new Set(
    e.map((s) => s.eventId)
  );
  let o = !1;
  const i = t.content.split(/\r?\n/).map((s) => {
    if (!s)
      return s;
    let d = "", h = 0, u = !1;
    for (const I of s.matchAll(hy)) {
      const f = I.index ?? -1, m = I[0] ?? "";
      if (f < 0 || !m)
        continue;
      const { uri: w, trailingText: P } = py(m), T = yy(w);
      !T || !n.has(T) || (u = !0, o = !0, d += s.slice(h, f), d += P, h = f + m.length);
    }
    return u ? (d += s.slice(h), my(d)) : s;
  });
  return o ? i.filter((s) => s !== null).join(`
`) : t.content;
}
const by = 8, oc = {
  byPostId: {},
  contextsByEventId: {}
};
function yd(t) {
  return So.sanitizeExternalRelayUrls(t, {
    limit: by
  });
}
function oh(t) {
  return {
    sourceEventId: t.sourceEventId,
    targetEventId: t.targetEventId,
    relationKind: t.relationKind,
    relayHints: yd(t.relayHints),
    authorHint: t.authorHint,
    scopeKey: t.scopeKey
  };
}
const Ya = {
  buildIndex(t) {
    const e = {}, n = {};
    for (const o of t) {
      const i = rh(o);
      if (i.length !== 0) {
        e[o.eventId] = i;
        for (const s of i) {
          const d = n[s.eventId];
          n[s.eventId] = {
            eventId: s.eventId,
            sourceEventId: d?.sourceEventId ?? o.eventId,
            authorHint: d?.authorHint ?? s.authorHint,
            relayHints: yd([
              ...d?.relayHints ?? [],
              ...s.relayHint ? [s.relayHint] : [],
              ...o.relayHints,
              ...o.acceptedRelays,
              ...o.fetchedRelays ?? []
            ])
          };
        }
      }
    }
    return {
      byPostId: e,
      contextsByEventId: n
    };
  },
  toDescriptor(t, e) {
    return oh({
      sourceEventId: t.sourceEventId,
      targetEventId: t.eventId,
      relationKind: "quote",
      relayHints: t.relayHints,
      authorHint: t.authorHint,
      scopeKey: e
    });
  }
}, Ki = {
  getRelayHints(t, e) {
    const n = _a(e.event);
    return yd([
      ...n.replyRelayHint ? [n.replyRelayHint] : [],
      ...n.rootRelayHint ? [n.rootRelayHint] : [],
      ...e.relayUrls,
      ...n.relayHints,
      ...t.relayHints,
      ...t.acceptedRelays,
      ...t.fetchedRelays ?? []
    ]);
  },
  getAuthorHint(t) {
    const e = _a(t.event);
    return e.parentId ? e.parentId === e.replyId ? e.replyAuthorHint : e.parentId === e.rootId ? e.rootAuthorHint : e.replyAuthorHint ?? e.rootAuthorHint : null;
  },
  buildContext(t, e, n) {
    return n.parentEventId ? {
      sourceEventId: e,
      targetEventId: n.parentEventId,
      authorHint: this.getAuthorHint(n),
      relayHints: this.getRelayHints(t, n)
    } : null;
  },
  toDescriptor(t, e) {
    return oh({
      sourceEventId: t.sourceEventId,
      targetEventId: t.targetEventId,
      relationKind: "reply-parent",
      relayHints: t.relayHints,
      authorHint: t.authorHint,
      scopeKey: e
    });
  }
};
let Cy = 0;
function Py(t) {
  switch (t) {
    case void 0:
      return "idle";
    case "resolved":
    case "not-found":
    case "deleted":
    case "error":
      return t;
    default:
      return "loading";
  }
}
function wy(t, e) {
  const n = Py(e?.status);
  switch (n) {
    case "idle":
      return { eventId: t, status: n };
    case "loading":
      return { eventId: t, status: n };
    case "resolved":
      return e?.event ? {
        eventId: t,
        status: n,
        event: e.event,
        profile: e.profile ?? null,
        relayHints: e.relayHints
      } : {
        eventId: t,
        status: "error",
        errorCode: e?.errorCode ?? "fetch_failed"
      };
    case "not-found":
      return { eventId: t, status: n };
    case "deleted":
      return { eventId: t, status: n };
    case "error":
      return { eventId: t, status: n, errorCode: e?.errorCode ?? null };
  }
}
function xy({
  getShow: t,
  getPosts: e,
  getRxNostr: n,
  getRelayConfig: o,
  postHistoryRepositoryImpl: i = ct,
  contextFetchService: s = wl,
  deletionRequestsRepositoryImpl: d = Vs,
  deletionFetchService: h = xl,
  profileSyncCoordinator: u = void 0,
  relatedTargetResolver: I = void 0
}) {
  const f = I ?? pd({
    getShow: t,
    getRxNostr: n,
    getRelayConfig: o,
    postHistoryRepositoryImpl: i,
    contextFetchService: s,
    deletionRequestsRepositoryImpl: d,
    deletionFetchService: h,
    profileSyncCoordinator: u
  }), m = !I, w = `post-history-quote-preview:${++Cy}`;
  let P = be(0), T = null, p = oc;
  function x() {
    const oe = e();
    return oe !== T && (T = oe, p = Ya.buildIndex(oe)), t() ? p : oc;
  }
  function a() {
    m && f.reset();
  }
  function k(oe) {
    return r(P), (x().byPostId[oe.eventId] ?? []).map((_) => wy(_.eventId, f.getTargetSnapshot(_.eventId)));
  }
  function Z(oe) {
    const _ = x().contextsByEventId[oe];
    _ && f.retryTarget(Ya.toDescriptor(_, w));
  }
  async function V(oe) {
    const _ = Ya.buildIndex(oe), ee = Object.values(_.contextsByEventId);
    ee.length !== 0 && await f.ensureTargets(ee.map((fe) => Ya.toDescriptor(fe, w)), { force: !0 });
  }
  return Ge(() => {
    t() && g(P, f.getScopeRevision(w), !0);
  }), Ge(() => {
    if (!t())
      return;
    n(), o();
    const oe = Object.values(x().contextsByEventId);
    oe.length !== 0 && f.ensureTargets(oe.map((_) => Ya.toDescriptor(_, w)));
  }), ys(() => {
    f.invalidateScope(w), a();
  }), { getQuotePreviews: k, retryQuotePreview: Z, refreshQuotePreviews: V };
}
const ui = {
  currentPage: 1,
  searchPage: 1,
  searchInput: "",
  searchQuery: ""
}, hi = /* @__PURE__ */ new Map();
function md(t) {
  if (typeof t != "string")
    return null;
  const e = t.trim();
  return e.length > 0 ? e : null;
}
function ac(t) {
  return typeof t != "number" || !Number.isFinite(t) ? 1 : Math.max(1, Math.trunc(t));
}
function fi(t) {
  return {
    currentPage: t.currentPage,
    searchPage: t.searchPage,
    searchInput: t.searchInput,
    searchQuery: t.searchQuery
  };
}
function Sy(t) {
  const e = md(t);
  return fi(
    e ? hi.get(e) ?? ui : ui
  );
}
function sc(t, e) {
  const n = md(t);
  if (!n)
    return fi(
      ui
    );
  const o = hi.get(n) ?? ui, i = {
    currentPage: ac(e.currentPage ?? o.currentPage),
    searchPage: ac(e.searchPage ?? o.searchPage),
    searchInput: e.searchInput ?? o.searchInput,
    searchQuery: e.searchQuery ?? o.searchQuery
  };
  return hi.set(n, i), fi(i);
}
function ic(t) {
  const e = md(t);
  e && hi.delete(e);
}
function Ry(t) {
  const e = t.nextVisibleUntil !== t.previousVisibleUntil, n = t.insertedCount + t.updatedCount > 0 || e;
  return n ? t.searchQuery.length > 0 ? {
    didVisibleMateriallyChange: e,
    didMateriallyChange: n,
    applyAction: "reload-search-page"
  } : t.loadedPostsLength === 0 || !t.hasNewerLocal ? {
    didVisibleMateriallyChange: e,
    didMateriallyChange: n,
    applyAction: "load-latest-visible-posts"
  } : {
    didVisibleMateriallyChange: e,
    didMateriallyChange: n,
    applyAction: "refresh-count-and-availability"
  } : {
    didVisibleMateriallyChange: e,
    didMateriallyChange: n,
    applyAction: "none"
  };
}
const Iy = 2e3;
function _y(t) {
  return Number.isFinite(t) ? Math.max(1, Math.trunc(t)) : 1;
}
function Ey(t) {
  return Number.isFinite(t) ? Math.max(1, Math.trunc(t)) : 50;
}
function Ay(t) {
  return t.trim().toLowerCase().split(/\s+/).filter(Boolean);
}
function Dy(t) {
  return t.join(" ");
}
function Yi(t) {
  return {
    postHistory: hs(t),
    channelMetadata: Gh()
  };
}
function As(t, e) {
  return t.postHistory === e.postHistory && t.channelMetadata === e.channelMetadata;
}
function ky(t, e, n = "") {
  return [
    t.content,
    n,
    t.eventId,
    String(t.kind),
    t.tags.flat().join(" "),
    ...t.media.flatMap((o) => [o.url, o.alt ?? ""]),
    t.channelEventId ?? "",
    t.relayHints.join(" "),
    t.acceptedRelays.join(" "),
    t.fetchedRelays?.join(" ") ?? "",
    e?.name ?? "",
    e?.about ?? ""
  ].join(`
`).toLowerCase();
}
function My(t) {
  return Array.from(
    new Set(
      t.map((e) => e.channelEventId).filter(
        (e) => typeof e == "string" && e.length > 0
      )
    )
  );
}
class Ty {
  constructor(e = ct, n = Jh, o = Pl) {
    this.postHistoryRepositoryImpl = e, this.channelMetadataRepositoryImpl = n, this.sensitivePayloadRepositoryImpl = o;
  }
  resolvedCacheEntry = null;
  inFlightEntry = null;
  runtimeCacheToken = 0;
  clearCache() {
    this.resolvedCacheEntry = null, this.inFlightEntry = null, this.runtimeCacheToken += 1;
  }
  isResolvedCacheEntryCurrent(e, n, o, i) {
    return e.pubkeyHex === n && e.normalizedQueryKey === o && As(e.revision, i);
  }
  assertBuildActive(e) {
    if (this.inFlightEntry !== e || this.runtimeCacheToken !== e.runtimeCacheToken)
      throw new DOMException("Post history search was superseded", "AbortError");
  }
  async notifyListener(e, n, o = "partial") {
    this.assertBuildActive(e);
    const i = Math.min(n.pageSize, e.filteredPosts.length);
    o === "partial" && i <= n.publishedCount || (n.publishedCount = i, await n.onProgress({ phase: o, items: e.filteredPosts.slice(0, i) }));
  }
  async filterBatch(e, n, o, i) {
    const s = n.flatMap((f) => {
      if (!El(f.rawEvent, f)) return [];
      const m = f.rawEvent, w = zc(m);
      return w ? [{ structure: m, payloadId: w.eventId }] : [];
    }), d = s.length > 0 ? await this.sensitivePayloadRepositoryImpl.getByIds(
      s.map(({ payloadId: f }) => f)
    ) : [];
    this.assertBuildActive(e);
    const h = new Map(d.map((f) => [f.id, f])), u = /* @__PURE__ */ new Map();
    for (const { structure: f, payloadId: m } of s) {
      const w = h.get(m);
      if (!w || w.deletedAt !== void 0) continue;
      const P = w.rawEvent;
      Wc(f, P, m) && u.set(f.id, P.content);
    }
    const I = My(n).filter((f) => !i.has(f));
    if (I.length > 0) {
      const f = await this.channelMetadataRepositoryImpl.getMany(
        I
      );
      this.assertBuildActive(e), I.forEach((m) => i.set(m, null)), f.forEach((m) => {
        i.set(m.channelEventId, m);
      });
    }
    return n.filter((f) => {
      const m = ky(
        f,
        f.channelEventId ? i.get(f.channelEventId) ?? null : null,
        u.get(f.eventId) ?? ""
      );
      return o.every((w) => m.includes(w));
    });
  }
  async buildFilteredPosts(e, n, o) {
    const i = /* @__PURE__ */ new Map();
    let s;
    for (; ; ) {
      this.assertBuildActive(e);
      const d = await this.postHistoryRepositoryImpl.getSearchScanChunk({
        pubkeyHex: e.pubkeyHex,
        cursor: s,
        limit: Iy
      });
      this.assertBuildActive(e);
      const h = await this.filterBatch(e, d.items, n, i), u = As(e.revision, Yi(e.pubkeyHex));
      if (!u && o) break;
      if (e.filteredPosts.push(...h), u)
        for (const I of e.listeners)
          await this.notifyListener(e, I);
      if (this.assertBuildActive(e), !d.hasMore || !d.nextCursor) break;
      s = d.nextCursor;
    }
    return e.filteredPosts;
  }
  startFilteredPostsBuild(e, n, o, i) {
    const s = Symbol("post-history-local-search"), d = this.runtimeCacheToken, h = {
      identity: s,
      runtimeCacheToken: d,
      pubkeyHex: e,
      normalizedQueryKey: n,
      revision: i,
      promise: Promise.resolve([]),
      filteredPosts: [],
      listeners: /* @__PURE__ */ new Set()
    };
    return this.inFlightEntry = h, h.promise = (async () => {
      let u = i;
      for (let I = 0; I < 2; I += 1) {
        const f = await this.buildFilteredPosts(h, o, I === 0);
        this.assertBuildActive(h);
        const m = Yi(e), w = As(
          u,
          m
        );
        if (w && this.inFlightEntry?.identity === s && this.runtimeCacheToken === d && (this.resolvedCacheEntry = {
          pubkeyHex: e,
          normalizedQueryKey: n,
          revision: u,
          filteredPosts: f
        }), w || I === 1)
          return f;
        u = m, this.inFlightEntry?.identity === s && this.runtimeCacheToken === d && (h.revision = u), h.filteredPosts = [];
        for (const P of h.listeners)
          await this.notifyListener(h, P, "reset");
      }
      return [];
    })().finally(() => {
      this.inFlightEntry?.identity === s && (this.inFlightEntry = null);
    }), this.inFlightEntry = h, h;
  }
  async searchLocalPosts(e) {
    const n = Ay(e.query);
    if (!e.pubkeyHex || n.length === 0)
      return {
        items: [],
        total: 0,
        hasNext: !1
      };
    const o = _y(e.page), i = Ey(e.pageSize), s = e.pubkeyHex, d = Dy(n), h = Yi(s);
    this.inFlightEntry && (this.inFlightEntry.pubkeyHex !== s || this.inFlightEntry.normalizedQueryKey !== d || !As(this.inFlightEntry.revision, h)) && (this.inFlightEntry = null);
    const u = this.resolvedCacheEntry, I = u && this.isResolvedCacheEntryCurrent(
      u,
      s,
      d,
      h
    ) ? u.filteredPosts : await (async () => {
      const w = this.inFlightEntry, P = w && w.runtimeCacheToken === this.runtimeCacheToken && w.pubkeyHex === s && w.normalizedQueryKey === d && As(w.revision, h) ? w : this.startFilteredPostsBuild(
        s,
        d,
        n,
        h
      ), T = o === 1 && e.onProgress ? { pageSize: i, publishedCount: 0, onProgress: e.onProgress } : null;
      T && P.listeners.add(T);
      try {
        const [p] = await Promise.all([
          P.promise,
          T ? this.notifyListener(P, T) : Promise.resolve()
        ]);
        return p;
      } finally {
        T && P.listeners.delete(T);
      }
    })(), f = (o - 1) * i, m = f + i;
    return {
      items: I.slice(f, m),
      total: I.length,
      hasNext: m < I.length
    };
  }
}
const cs = new Ty(), Oy = 500, Ly = 12, Fy = 3600;
class lc extends Error {
  phase;
  phaseStartedAt;
  errorClass;
  constructor(e, n, o) {
    super(e), this.name = "PostHistoryCurrentViewRefetchFailure", this.phase = e, this.phaseStartedAt = o, this.errorClass = n instanceof Error ? n.name : typeof n, this.cause = n;
  }
}
function Hy(t, e) {
  return t.status === "timeout" || t.status === "error" || t.status === "cancelled" ? t.status : typeof t.coverageComplete == "boolean" ? t.coverageComplete && !t.coverageSaturated ? "complete" : "partial" : t.hasMore || t.perRelayCounts.some((n) => n.rawCount >= e) ? "partial" : "complete";
}
function Ny(t) {
  return t === "partial" || t === "timeout" || t === "error";
}
function $y(t, e) {
  return typeof t.coverageSaturated == "boolean" ? t.coverageSaturated : t.hasMore || t.perRelayCounts.some((n) => n.rawCount >= e);
}
function By(t) {
  return typeof t.since == "number" && typeof t.until == "number" && t.until - t.since > Fy;
}
function qy(t) {
  if (!By(t))
    return [];
  const e = Math.floor((t.since + t.until) / 2);
  return e < t.since || e + 1 > t.until ? [] : [
    {
      ...t,
      until: e,
      splitDepth: t.splitDepth + 1
    },
    {
      ...t,
      since: e + 1,
      splitDepth: t.splitDepth + 1
    }
  ];
}
class Uy {
  postHistoryRelayFetchService;
  postHistoryRepository;
  setTimeoutFn;
  clearTimeoutFn;
  console;
  now;
  constructor(e = {}) {
    this.postHistoryRelayFetchService = e.postHistoryRelayFetchService ?? ri, this.postHistoryRepository = e.postHistoryRepository ?? ct, this.setTimeoutFn = e.setTimeoutFn ?? setTimeout, this.clearTimeoutFn = e.clearTimeoutFn ?? clearTimeout, this.console = e.console ?? (typeof globalThis.console < "u" ? globalThis.console : { debug: () => {
    } }), this.now = e.now ?? Date.now;
  }
  async waitBetweenFetches(e) {
    await new Promise((n) => {
      const o = this.setTimeoutFn(() => {
        e(null), n();
      }, Oy);
      e(() => {
        this.clearTimeoutFn(o), e(null), n();
      });
    });
  }
  refetchAroundCurrentView(e, n) {
    let o = !1, i = null, s = null;
    const d = n.preferredRanges.map((u) => ({
      kinds: [...u.kinds],
      rangeUnit: u.rangeUnit,
      ...typeof u.since == "number" ? { since: u.since } : {},
      ...typeof u.until == "number" ? { until: u.until } : {},
      limit: u.limit,
      splitDepth: 0
    }));
    return {
      promise: (async () => {
        let u = 0, I = 0, f = 0, m = 0, w = !1, P = !1, T = !1, p = !1, x = !1, a = 0, k = 0, Z = 0, V = 0, oe = 0, _ = !0;
        const ee = [];
        for (; d.length > 0; ) {
          const Ee = d.shift();
          if (o || (m > 0 && await this.waitBetweenFetches((G) => {
            s = G;
          }), o))
            break;
          const $e = this.postHistoryRelayFetchService.fetchLatest(e, {
            pubkeyHex: n.pubkeyHex,
            relayConfig: n.relayConfig,
            reason: "repair-visible-range",
            kinds: Ee.kinds,
            limit: Ee.limit || Jc,
            timeoutMs: Zh,
            ...typeof Ee.since == "number" ? { since: Ee.since } : {},
            ...typeof Ee.until == "number" ? { until: Ee.until } : {}
          });
          i = $e;
          const Pe = this.now();
          let re;
          try {
            re = await $e.promise;
          } catch (G) {
            const ue = this.now();
            throw Z += Math.max(0, ue - Pe), new lc(
              "primary-fetch",
              G,
              Pe
            );
          }
          Z += Math.max(0, this.now() - Pe), i = null, m += 1, k += re.events.length, T = T || re.status === "error", p = p || re.status === "timeout";
          const ve = typeof re.coverageComplete == "boolean", de = re.events.length === 0 && (ve ? re.allCoverageRelaysFailed === !0 : !re.hasAnyRelayResponse && (re.allRelaysFailed || re.status === "error"));
          _ = _ && de;
          let j = 0, ne = 0, xe = 0;
          if (re.events.length > 0) {
            const G = this.now();
            oe += 1;
            let ue;
            try {
              ue = await this.postHistoryRepository.upsertFetchedEvents({
                events: re.events,
                fetchedAt: re.fetchedAt
              });
            } catch (B) {
              throw V += Math.max(0, this.now() - G), new lc(
                "primary-persist",
                B,
                G
              );
            }
            V += Math.max(0, this.now() - G), j = ue.insertedCount, ne = ue.updatedCount, xe = ue.unchangedCount, u += j, I += ne, f += xe, await n.onProgress?.({
              insertedCount: j,
              updatedCount: ne,
              unchangedCount: xe,
              processedRangeCount: ee.length + 1,
              attemptedRangeCount: m,
              addedCount: u,
              totalUpdatedCount: I,
              totalUnchangedCount: f
            });
          }
          const Le = $y(re, Ee.limit);
          P = P || Le;
          const Fe = Le ? qy(Ee) : [], D = Fe.length > 0 && ee.length + 1 + d.length + Fe.length <= Ly, J = Le ? "limit" : Hy(re, Ee.limit);
          if (ee.push({
            source: "preferred",
            rangeUnit: Ee.rangeUnit,
            ...typeof Ee.since == "number" ? { since: Ee.since } : {},
            ...typeof Ee.until == "number" ? { until: Ee.until } : {},
            requestedRelayUrls: [...re.requestedRelayUrls],
            observedRelayUrls: [...re.observedRelayUrls],
            eventRelayUrls: [...re.eventRelayUrls],
            eoseRelayUrls: [...re.eoseRelayUrls],
            closedRelayUrls: [...re.closedRelayUrls],
            errorRelayUrls: [...re.errorRelayUrls],
            downRelayUrls: [...re.downRelayUrls],
            completedByRxNostr: re.completedByRxNostr,
            completedByLocalTimeout: re.completedByLocalTimeout,
            hasAnyRelayResponse: re.hasAnyRelayResponse,
            allRelaysFailed: re.allRelaysFailed,
            ...typeof re.coverageComplete == "boolean" ? {
              coverageRelayUrls: [...re.coverageRelayUrls ?? []],
              coverageEoseRelayUrls: [...re.coverageEoseRelayUrls ?? []],
              bestEffortRelayUrls: [...re.bestEffortRelayUrls ?? []],
              coverageComplete: re.coverageComplete,
              coverageSaturated: re.coverageSaturated ?? !1,
              allCoverageRelaysFailed: re.allCoverageRelaysFailed ?? !1
            } : {},
            status: J,
            rawCount: re.rawCount,
            uniqueCount: re.uniqueCount,
            duplicateCount: re.duplicateCount,
            insertedCount: j,
            updatedCount: ne,
            unchangedCount: xe
          }), Le && D ? (a += Fe.length, d.unshift(...Fe)) : Le && (x = !0), (Ny(J) || de || Le && !D) && (w = !0), o || re.status === "cancelled") {
            o = !0;
            break;
          }
        }
        const fe = !o && m > 0 && k === 0 && _, he = w || x || fe, ke = {
          status: o ? "cancelled" : he ? "partial" : "success",
          addedCount: u,
          updatedCount: I,
          unchangedCount: f,
          processedRangeCount: ee.length,
          attemptedRangeCount: m,
          hadFailures: he,
          limitReached: P,
          hadFetchError: T,
          fetchFailed: fe,
          hadTimeout: p,
          hadUnfinishedRanges: x,
          splitRetryCount: a,
          processedRanges: ee,
          timing: {
            primaryFetchDurationMs: Z,
            primaryPersistDurationMs: V,
            primaryPersistAttemptCount: oe
          }
        };
        return this.console.debug("post_history_current_view_refetch_summary", {
          pubkeyHex: n.pubkeyHex,
          processedRangeCount: ke.processedRangeCount,
          addedCount: ke.addedCount,
          updatedCount: ke.updatedCount,
          hadFailures: ke.hadFailures,
          limitReached: ke.limitReached,
          hadFetchError: ke.hadFetchError,
          fetchFailed: ke.fetchFailed,
          hadTimeout: ke.hadTimeout,
          hadUnfinishedRanges: ke.hadUnfinishedRanges,
          splitRetryCount: ke.splitRetryCount,
          processedRanges: ke.processedRanges
        }), ke;
      })(),
      cancel: () => {
        o = !0, s?.(), i?.cancel();
      }
    };
  }
}
const Vy = new Uy(), jy = 300 * 1e3;
function Ky(t, e, n) {
  const o = new Set(
    n.map((s) => s.eventId)
  ), i = /* @__PURE__ */ new Map();
  for (const s of e)
    ![1, 42, 1111].includes(s.kind) || s.pubkeyHex !== t || !o.has(s.eventId) || i.has(s.eventId) || i.set(s.eventId, s);
  return Array.from(i.values());
}
function Yy(t, e, n, o, i = jy) {
  return t.filter((s) => {
    if (n.has(s))
      return !1;
    const d = e.get(s);
    return typeof d != "number" || o - d >= i;
  });
}
function dc(t, e) {
  return {
    status: e ? t.status : "cancelled",
    savedDirectReplyCount: t.savedDirectReplyCount
  };
}
function Qy({
  getShow: t,
  getPubkeyHex: e,
  getRxNostr: n,
  getRelayConfig: o,
  getLoadedPosts: i,
  onChildInteractionBadgeRefreshRequested: s,
  onQuoteVisibleRangeRefreshRequested: d,
  quoteVisibleRangeRepairExecutor: h,
  relationRepairService: u = Ff,
  triggerDeletionLifecycle: I = Sl,
  now: f = Date.now
}) {
  let m = null, w = 0, P = 0, T = !1;
  const p = /* @__PURE__ */ new Set(), x = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Set();
  function k(de, j) {
    return !T && de === w && j();
  }
  function Z(de, j, ne) {
    return !T && de === P && t() && e() === j && n() === ne;
  }
  function V(de) {
    const j = i();
    j.length === 0 || de.length === 0 || Promise.resolve(
      s(j, de)
    ).catch(() => {
    });
  }
  async function oe(de) {
    const j = i();
    j.length === 0 || de.length === 0 || await s(j, de);
  }
  function _(de) {
    de.length !== 0 && Promise.resolve(
      d(de)
    ).catch(() => {
    });
  }
  async function ee(de) {
    if (!de.isActive())
      return;
    const j = Nf(de.source, {
      relationKinds: de.result.relationKinds,
      savedParentEventIds: de.result.savedParentEventIds,
      checkedParentEventIds: de.result.checkedParentEventIds,
      quoteRepairApplied: de.result.quoteRepairApplied,
      status: de.result.status
    });
    if (j.shouldRefreshQuotePreviews && de.isActive() && _(de.quoteRefreshPosts), !(j.parentEventIds.length === 0 || !de.isActive())) {
      if (de.awaitBadgeRefresh) {
        await oe(j.parentEventIds);
        return;
      }
      V(j.parentEventIds);
    }
  }
  function fe(de) {
    return u.repairVisibleRangeRelations(de.rxNostr, {
      ownerPubkeyHex: de.ownerPubkeyHex,
      visiblePosts: de.visiblePosts,
      relationKinds: Hf,
      quoteVisibleRangeRepairExecutor: h,
      relayConfig: o(),
      isActive: de.isActive
    });
  }
  function he(de, j, ne, xe) {
    j.length !== 0 && I({
      source: de,
      parentEventIds: j,
      rxNostr: ne,
      relayConfig: o(),
      isActive: xe
    }).then((Le) => {
      Le.status === "cancelled" || Le.deletedReactionEventIds.length === 0 && Le.deletedReplyEventIds.length === 0 || !xe() || V(Le.checkedParentEventIds);
    }).catch(() => {
    });
  }
  async function me(de) {
    if (de.visiblePosts.length === 0)
      return {
        status: "success",
        savedDirectReplyCount: 0
      };
    const j = ++w, ne = () => k(j, de.isActive);
    he(
      "listing-current-view",
      de.visiblePosts.map((Fe) => Fe.eventId),
      de.rxNostr,
      ne
    );
    const xe = fe({
      ...de,
      isActive: ne
    }), Le = f();
    m = xe;
    try {
      const Fe = await xe.promise, D = Math.max(0, f() - Le), J = ne();
      if (m === xe && (m = null), Fe.status === "cancelled" || !J)
        return dc(Fe, !1);
      const L = f();
      try {
        await ee({
          source: "listing-manual-refetch",
          result: Fe,
          quoteRefreshPosts: de.visiblePosts,
          isActive: ne,
          awaitBadgeRefresh: !0
        });
      } catch (G) {
        return {
          status: ne() ? "partial" : "cancelled",
          savedDirectReplyCount: Fe.savedDirectReplyCount,
          relationRepairDurationMs: D,
          failurePhase: "badge-refresh",
          failureDurationMs: Math.max(0, f() - L),
          failureErrorClass: G instanceof Error ? G.name : typeof G
        };
      }
      return {
        ...dc(Fe, ne()),
        relationRepairDurationMs: D,
        badgeRefreshDurationMs: Math.max(0, f() - L)
      };
    } catch (Fe) {
      return m === xe && (m = null), {
        status: ne() ? "partial" : "cancelled",
        savedDirectReplyCount: 0,
        failurePhase: "relation-repair",
        failureDurationMs: Math.max(0, f() - Le),
        failureErrorClass: Fe instanceof Error ? Fe.name : typeof Fe
      };
    }
  }
  async function ke(de) {
    if (de.visiblePosts.length !== 0)
      try {
        he(
          "listing-current-view",
          de.visiblePosts.map((xe) => xe.eventId),
          de.rxNostr,
          de.isActive
        );
        const ne = await fe(de).promise;
        if (ne.status === "cancelled" || !de.isActive())
          return;
        await ee({
          source: "listing-current-view",
          result: ne,
          quoteRefreshPosts: de.visiblePosts,
          isActive: de.isActive,
          awaitBadgeRefresh: !0
        });
      } catch {
      }
  }
  function Ee(de) {
    const j = e(), ne = n(), xe = P;
    if (!j || de.length === 0)
      return;
    const Le = Ky(
      j,
      de,
      i()
    );
    if (Le.length === 0)
      return;
    const Fe = Le.map((B) => B.eventId);
    if (!ne)
      return;
    const D = () => Z(
      xe,
      j,
      ne
    );
    he(
      "listing-older-reveal",
      Fe,
      ne,
      D
    );
    const J = Yy(
      Fe,
      x,
      a,
      f()
    ), L = new Set(J), G = Le.filter(
      (B) => L.has(B.eventId)
    );
    if (G.length === 0)
      return;
    G.forEach((B) => {
      a.add(B.eventId);
    });
    const ue = fe({
      ownerPubkeyHex: j,
      rxNostr: ne,
      visiblePosts: G,
      isActive: D
    });
    p.add(ue), ue.promise.then((B) => {
      !D() || B.status === "cancelled" || (ee({
        source: "listing-older-reveal",
        result: B,
        quoteRefreshPosts: G,
        isActive: D,
        awaitBadgeRefresh: !1
      }), B.checkedParentEventIds.length > 0 && B.checkedParentEventIds.forEach((Ae) => {
        x.set(Ae, f());
      }));
    }).catch(() => {
    }).finally(() => {
      xe === P && (p.delete(ue), G.forEach((B) => {
        a.delete(B.eventId);
      }));
    });
  }
  function $e() {
    w += 1, m?.cancel(), m = null;
  }
  function Pe() {
    P += 1, p.forEach((de) => de.cancel()), p.clear(), x.clear(), a.clear();
  }
  function re() {
    $e(), Pe();
  }
  function ve() {
    T = !0, re();
  }
  return {
    repairCurrentView: me,
    repairJump: ke,
    scheduleOlderRevealRepair: Ee,
    cancelCurrentViewRepair: $e,
    resetOlderRevealRepairContext: Pe,
    resetAllRepairs: re,
    dispose: ve
  };
}
const zy = "postHistoryJumpCacheAnchors:", Qi = 200, zi = 720 * 60 * 60 * 1e3;
function Gs(t) {
  return `${zy}${t}`;
}
function Wy(t) {
  if (!t || typeof t != "object")
    return !1;
  const e = t;
  return Number.isFinite(e.centerCreatedAt) && Number.isFinite(e.radiusSec) && (e.radiusSec ?? 0) > 0 && Number.isFinite(e.fetchedAt);
}
function Jy(t) {
  if (!t || typeof t != "object")
    return !1;
  const e = t;
  return typeof e.pubkeyHex == "string" && Array.isArray(e.anchors) && e.anchors.every((n) => Wy(n));
}
function cc(t, e, n, o) {
  const i = e - Math.max(0, Math.trunc(n));
  return t.filter(
    (s) => Number.isFinite(s.centerCreatedAt) && Number.isFinite(s.radiusSec) && s.radiusSec > 0 && Number.isFinite(s.fetchedAt) && s.fetchedAt >= i
  ).sort((s, d) => d.fetchedAt - s.fetchedAt).slice(0, Math.max(1, Math.trunc(o)));
}
function Gy(t, e, n) {
  return t.findIndex(
    (o) => Math.abs(o.centerCreatedAt - e) <= Math.max(o.radiusSec, n)
  );
}
class Zy {
  constructor(e = Rl, n = Date.now) {
    this.db = e, this.now = n;
  }
  async getForPubkey(e, n = {}) {
    const o = n.ttlMs ?? zi, i = n.maxCount ?? Qi, s = await this.db.meta.get(Gs(e));
    return !s || !Jy(s.value) ? [] : cc(s.value.anchors, this.now(), o, i);
  }
  async addForPubkey(e) {
    const n = e.ttlMs ?? zi, o = e.maxCount ?? Qi, i = Number.isFinite(e.fetchedAt) ? Math.trunc(e.fetchedAt ?? 0) : this.now(), s = Number.isFinite(e.centerCreatedAt) ? Math.trunc(e.centerCreatedAt) : 0, d = Number.isFinite(e.radiusSec) ? Math.max(1, Math.trunc(e.radiusSec ?? 1)) : 1, h = await this.getForPubkey(e.pubkeyHex, {
      ttlMs: n,
      maxCount: o
    }), u = Gy(
      h,
      s,
      d
    ), I = [...h];
    if (u >= 0) {
      const m = I[u];
      I[u] = {
        centerCreatedAt: s,
        radiusSec: Math.max(m.radiusSec, d),
        fetchedAt: Math.max(m.fetchedAt, i)
      };
    } else
      I.unshift({
        centerCreatedAt: s,
        radiusSec: d,
        fetchedAt: i
      });
    const f = cc(
      I,
      this.now(),
      n,
      o
    );
    return await this.db.meta.put({
      key: Gs(e.pubkeyHex),
      value: {
        pubkeyHex: e.pubkeyHex,
        anchors: f
      },
      updatedAt: this.now()
    }), f;
  }
  async hasNearbyAnchorForPubkey(e) {
    const n = Number.isFinite(e.targetCreatedAt) ? Math.trunc(e.targetCreatedAt) : 0;
    return (await this.getForPubkey(e.pubkeyHex, {
      ttlMs: e.ttlMs,
      maxCount: e.maxCount
    })).some(
      (i) => Math.abs(n - i.centerCreatedAt) <= i.radiusSec
    );
  }
  async reconcileWithFrontier(e) {
    const n = Number.isFinite(e.frontierVisibleUntil) ? Math.trunc(e.frontierVisibleUntil) : 0, o = Number.isFinite(e.toleranceSec) ? Math.max(0, Math.trunc(e.toleranceSec ?? 0)) : 0, i = e.ttlMs ?? zi, s = e.maxCount ?? Qi, d = await this.getForPubkey(e.pubkeyHex, {
      ttlMs: i,
      maxCount: s
    }), h = d.filter((f) => {
      const m = f.centerCreatedAt + f.radiusSec;
      return Math.max(0, n - m) <= o;
    }), u = d.filter((f) => !h.includes(f)), I = h.length > 0 ? Math.min(
      n,
      ...h.map((f) => Math.max(0, f.centerCreatedAt - f.radiusSec))
    ) : n;
    return h.length > 0 && await this.db.meta.put({
      key: Gs(e.pubkeyHex),
      value: {
        pubkeyHex: e.pubkeyHex,
        anchors: u
      },
      updatedAt: this.now()
    }), {
      nextVisibleUntil: I,
      removedCount: h.length,
      anchors: u
    };
  }
  async clearForPubkey(e) {
    e && await this.db.meta.delete(Gs(e));
  }
}
const Ds = new Zy(), ah = "postHistoryVisibleRange:";
function Wi(t, e) {
  return `${ah}${t}:${e}`;
}
function Xy(t) {
  if (!t || typeof t != "object")
    return !1;
  const e = t;
  return typeof e.pubkeyHex == "string" && typeof e.kindsKey == "string" && (typeof e.visibleUntil == "number" || e.visibleUntil === null);
}
function em(t) {
  const e = /* @__PURE__ */ new Set();
  for (const n of t)
    Number.isFinite(n) && e.add(Math.trunc(n));
  return [...e].sort((n, o) => n - o).join(",");
}
class tm {
  constructor(e = Rl, n = Date.now) {
    this.db = e, this.now = n;
  }
  async get(e, n) {
    const o = await this.db.meta.get(Wi(e, n));
    return !o || !Xy(o.value) ? null : {
      ...o.value,
      updatedAt: o.updatedAt
    };
  }
  async save(e) {
    const n = this.now(), o = {
      ...e,
      updatedAt: n
    };
    return await this.db.meta.put({
      key: Wi(e.pubkeyHex, e.kindsKey),
      value: {
        pubkeyHex: e.pubkeyHex,
        kindsKey: e.kindsKey,
        visibleUntil: e.visibleUntil
      },
      updatedAt: n
    }), o;
  }
  async clear(e, n) {
    await this.db.meta.delete(Wi(e, n));
  }
  async clearForPubkey(e) {
    if (!e) return;
    const n = `${ah}${e}:`, o = await this.db.meta.filter((i) => i.key.startsWith(n)).primaryKeys();
    await this.db.meta.bulkDelete(o);
  }
}
const us = new tm();
function nm(t) {
  const e = t.error, n = t.errorClass ?? (e instanceof Error ? e.name : e === void 0 ? void 0 : typeof e);
  return {
    phase: t.phase,
    durationMs: t.durationMs ?? Math.max(0, (t.finishedAt ?? Date.now()) - t.startedAt),
    ...n ? { errorClass: n } : {},
    ...t.counts ?? {}
  };
}
function fo(t) {
  const e = nm(t);
  "errorClass" in e ? console.warn("post_history_manual_repair_phase", e) : console.debug("post_history_manual_repair_phase", e);
}
function rm(t) {
  return t.map((e) => e.event?.id).filter((e) => !!e);
}
function om({
  currentPosts: t,
  olderPosts: e,
  anchorEventId: n = null,
  maxVisiblePosts: o,
  keepAbove: i
}) {
  const s = [...t, ...e];
  if (s.length <= o)
    return {
      posts: s,
      didTrimForOlderAppend: !1,
      didDeferOlderPosts: !1
    };
  if (t.length < o) {
    const f = Math.max(0, o - t.length), m = e.slice(0, f);
    return {
      posts: [...t, ...m],
      didTrimForOlderAppend: !1,
      didDeferOlderPosts: m.length < e.length
    };
  }
  const d = typeof n == "string" ? s.findIndex((f) => f.eventId === n) : -1, h = (f) => {
    const m = s.slice(f, f + o), w = Math.max(0, m.length - Math.max(0, t.length - f));
    return {
      posts: m,
      didTrimForOlderAppend: !0,
      didDeferOlderPosts: w < e.length
    };
  };
  if (d < 0)
    return h(s.length - o);
  const u = Math.max(0, s.length - o), I = Math.min(u, Math.max(0, d - i));
  return h(I);
}
function am(t, e) {
  const n = new Set(t.map((o) => o.eventId));
  return e.filter((o) => !n.has(o.eventId));
}
const vi = {
  loadedPosts: [],
  searchPosts: [],
  searchQuery: "",
  totalCount: 0,
  totalCountKnown: !1,
  totalCountFailed: !1,
  searchTotalCount: 0,
  searchTotalCountKnown: !1,
  searchHasNext: !1,
  hasMoreRemote: !1,
  nextUntil: null,
  lastDialogOpenRefreshAt: null,
  visibleUntil: null,
  hasJumpCacheAnchors: !1,
  hasOlderLocal: !1,
  hasNewerLocal: !1
}, ks = em([...Zc]), uc = 1440 * 60, hc = 4320 * 60, sm = 100, im = 720 * 60;
function Ji(t, e) {
  if (t.length === 0)
    return !0;
  const n = t[t.length - 1]?.createdAt;
  return Number.isFinite(n) ? (n ?? 0) > e : !0;
}
const fc = 720 * 60, lm = 3600, Gi = [
  720 * 60,
  1440 * 60,
  4320 * 60,
  10080 * 60,
  336 * 60 * 60,
  720 * 60 * 60
], dm = 6, cm = 720 * 60 * 60;
function um({
  status: t,
  changed: e,
  didCursorAdvanceOlder: n,
  hitLimit: o,
  continuedWithinWindow: i,
  attemptIndex: s,
  maxAttempts: d,
  totalVisibleAdded: h,
  targetVisibleAdded: u,
  exploredSeconds: I,
  maxExploreSeconds: f
}) {
  return t !== "success" ? { shouldContinue: !1, reason: `status-${t}` } : n ? o && !i ? {
    shouldContinue: !1,
    reason: "hit-limit-continuation-unavailable"
  } : h >= u ? {
    shouldContinue: !1,
    reason: "target-visible-added-reached"
  } : I >= f ? { shouldContinue: !1, reason: "max-explore-seconds-reached" } : s >= d ? { shouldContinue: !1, reason: "max-attempts-reached" } : {
    shouldContinue: !0,
    reason: e ? "small-batch-continue" : "empty-window-continue"
  } : { shouldContinue: !1, reason: "cursor-not-advanced" };
}
const bd = /* @__PURE__ */ new Map();
async function hm({
  nextUntil: t,
  visibleOldestCreatedAt: e,
  pubkeyHex: n,
  getOldestCreatedAt: o,
  getNowSeconds: i = () => Math.floor(Date.now() / 1e3)
}) {
  if (typeof t == "number")
    return t;
  if (typeof e == "number")
    return e;
  const s = await o(n);
  if (typeof s == "number")
    return s;
  const d = i();
  return Number.isFinite(d) ? d : null;
}
function Xr(t) {
  if (typeof t != "string")
    return null;
  const e = t.trim();
  return e.length > 0 ? e : null;
}
function yl(t) {
  return {
    loadedPosts: [...t.loadedPosts],
    searchPosts: [...t.searchPosts],
    searchQuery: t.searchQuery ?? "",
    totalCount: t.totalCount,
    // Older in-memory snapshots did not distinguish a zero count from an
    // unavailable count. A positive legacy value is safe to preserve; a
    // legacy zero is deliberately treated as unknown until refreshed.
    totalCountKnown: t.totalCountKnown ?? t.totalCount > 0,
    totalCountFailed: t.totalCountFailed ?? !1,
    searchTotalCount: t.searchTotalCount,
    searchTotalCountKnown: t.searchTotalCountKnown ?? t.searchTotalCount > 0,
    searchHasNext: t.searchHasNext,
    hasMoreRemote: t.hasMoreRemote,
    nextUntil: t.nextUntil,
    lastDialogOpenRefreshAt: t.lastDialogOpenRefreshAt,
    visibleUntil: t.visibleUntil,
    hasJumpCacheAnchors: t.hasJumpCacheAnchors ?? !1,
    hasOlderLocal: t.hasOlderLocal,
    hasNewerLocal: t.hasNewerLocal
  };
}
function fm(t) {
  const e = Xr(t);
  return yl(e ? bd.get(e) ?? vi : vi);
}
function Zi(t, e) {
  const n = Xr(t);
  n && bd.set(n, yl(e));
}
function vm(t) {
  const e = Xr(t);
  e && bd.delete(e);
}
function gm({
  getShow: t,
  getPubkeyHex: e,
  getRxNostr: n,
  getRelayConfig: o,
  getSessionScrollState: i = () => null,
  onSessionScrollStateInvalidated: s = () => {
  },
  onSavedAuthoredPosts: d = () => {
  },
  onChildInteractionBadgeRefreshRequested: h = () => {
  },
  onQuoteVisibleRangeRefreshRequested: u = () => {
  },
  quoteVisibleRangeRepairExecutor: I = void 0,
  pageSize: f = Gc,
  searchDebounceMs: m = 250
}) {
  const w = Sy(e()), P = fm(e()), T = P.searchQuery === w.searchQuery && w.searchQuery.length > 0, p = P.totalCountKnown ?? P.totalCount > 0, x = P.totalCountFailed ? "failed" : p ? "ready" : "unknown", a = hr({
    loadedPosts: P.loadedPosts,
    searchPosts: T ? P.searchPosts : [],
    searchInput: w.searchInput,
    searchQuery: w.searchQuery,
    currentPage: 1,
    searchPage: T ? w.searchPage : 1,
    totalCount: P.totalCount,
    totalCountKnown: p,
    totalCountStatus: x,
    searchTotalCount: P.searchTotalCount,
    searchTotalCountKnown: T && (P.searchTotalCountKnown ?? P.searchTotalCount > 0),
    searchHasNext: P.searchHasNext,
    syncStatus: "idle",
    currentViewRefetchStatus: "idle",
    currentViewRefetchMessageKey: null,
    currentViewRefetchMessageValues: null,
    hasMoreRemote: P.hasMoreRemote,
    nextUntil: P.nextUntil,
    lastDialogOpenRefreshAt: P.lastDialogOpenRefreshAt,
    visibleUntil: P.visibleUntil,
    hasJumpCacheAnchors: P.hasJumpCacheAnchors,
    hasOlderLocal: P.hasOlderLocal,
    hasNewerLocal: P.hasNewerLocal,
    listingMode: "contiguous",
    sparseSource: null,
    hasSavedPostsOutsideVisibleRange: !1,
    latestOlderBackfillUiResult: null
  });
  let k = 0, Z = !1, V = be(!1), oe = be(null), _ = null, ee = 0, fe = null, he = 0, me = be(!1), ke = be("idle"), Ee = !1, $e = !1, Pe = null, re = be("idle"), ve = 0, de = Xr(e()), j = be(hr(de)), ne = null, xe = null, Le = 0, Fe = null, D = null, J = null, L = null, G = n(), ue = T ? w.searchQuery : "", B = !T;
  const Ae = hr({
    windowSeconds: fc,
    nextUntil: null,
    consecutiveEmptyCount: 0,
    lastRange: null,
    continuationSince: null,
    exhausted: !1
  }), ae = Math.max(f * 3, f), je = Qy({
    getShow: t,
    getPubkeyHex: e,
    getRxNostr: n,
    getRelayConfig: o,
    getLoadedPosts: () => a.loadedPosts,
    onChildInteractionBadgeRefreshRequested: h,
    onQuoteVisibleRangeRefreshRequested: u,
    quoteVisibleRangeRepairExecutor: I
  }), ie = C(() => a.searchQuery.length > 0), qe = C(() => a.currentViewRefetchStatus === "refetching"), Ze = C(() => r(ie) ? a.searchPosts : a.loadedPosts), bt = C(() => r(ie) ? a.searchPage : 1), Ct = C(() => r(ie) ? a.searchTotalCount : a.totalCount), _t = C(() => r(ie) ? Math.max(1, Math.ceil(a.searchTotalCount / f)) : 1), ln = C(() => !r(qe) && r(ie) && a.searchPage > 1), Xe = C(() => r(ln)), ut = C(() => !r(qe) && !r(me) && r(ie) && a.searchHasNext), it = C(() => r(ut)), X = C(() => !1), nt = C(() => !r(qe) && (r(ie) ? !r(me) && a.searchHasNext : a.hasOlderLocal)), St = C(() => !r(qe) && !r(ie) && a.hasNewerLocal), dn = C(() => !r(ie) && !r(qe) && (a.listingMode === "sparse" || a.hasNewerLocal)), jn = C(() => r(Ze)[0]?.createdAt ?? null), vt = C(() => r(Ze).length > 0 ? r(Ze)[r(Ze).length - 1]?.createdAt ?? null : null), Yt = C(() => !r(ie) && !r(qe) && a.hasOlderLocal && (a.listingMode === "sparse" || !(typeof r(vt) == "number" && (a.visibleUntil === null ? a.hasJumpCacheAnchors : r(vt) < a.visibleUntil)))), et = C(() => !r(ie) && !!e() && !!n() && !r(qe) && !Ae.exhausted && a.syncStatus !== "syncing" && a.syncStatus !== "older-syncing"), wt = C(() => !r(ie) && a.syncStatus === "older-syncing"), rt = C(() => !r(ie) && (a.syncStatus === "syncing" || a.syncStatus === "older-syncing")), en = C(() => !r(ie) && a.listingMode === "contiguous" && a.loadedPosts.length > 0 && !a.hasOlderLocal && a.syncStatus !== "syncing"), gt = C(() => !r(ie) && a.listingMode === "contiguous" && typeof a.visibleUntil == "number" && a.loadedPosts.length > 0 && !a.hasOlderLocal && a.hasSavedPostsOutsideVisibleRange), Pt = C(() => r(Ze).length), Qt = C(() => !!e() && !!n() && !r(ie) && a.loadedPosts.length > 0 && !r(qe) && a.syncStatus !== "syncing" && a.syncStatus !== "older-syncing"), cn = C(() => r(ie) || a.syncStatus === "idle" ? null : a.syncStatus === "syncing" || a.syncStatus === "older-syncing" ? "postHistory.syncing" : a.syncStatus === "synced" ? "postHistory.synced" : a.syncStatus === "no-more" ? null : "postHistory.syncFailed"), Rt = C(() => !r(ie) && (a.syncStatus === "syncing" || a.syncStatus === "older-syncing")), $t = C(() => r(Rt) || r(qe)), It = C(() => a.currentViewRefetchStatus === "refetching" ? "postHistory.repairing" : a.currentViewRefetchMessageKey), bn = C(() => a.currentViewRefetchStatus === "refetching" ? null : a.currentViewRefetchMessageValues);
  function Lt() {
    Le += 1, xe?.cancel(), xe = null;
  }
  function Ye() {
    D = null;
  }
  function tn(v, b) {
    return !!v && !!b && v.postedAt === b.postedAt && v.createdAt === b.createdAt && v.eventId === b.eventId;
  }
  function ht(v) {
    return v === Le;
  }
  function nn(v, b) {
    return t() && e() === v && b === k;
  }
  function rn() {
    Z = !1, g(V, !1), g(oe, null), _ = null;
  }
  async function un(v, b, E) {
    return await Bo(), b() ? Z ? (g(oe, Xr(v), !0), !0) : E() ? (await new Promise((q) => {
      requestAnimationFrame(() => requestAnimationFrame(() => q()));
    }), b() ? (Z = !0, g(oe, Xr(v), !0), g(V, !0), !0) : !1) : (Z = !0, g(oe, Xr(v), !0), g(V, !0), !0) : !1;
  }
  function xr() {
    Fe?.cancel(), Fe = null, je.cancelCurrentViewRepair(), a.currentViewRefetchStatus === "refetching" && (a.currentViewRefetchStatus = "idle"), ar();
  }
  function ar() {
    J !== null && (clearTimeout(J), J = null);
  }
  function Kn() {
    L !== null && (clearTimeout(L), L = null);
  }
  function Cn() {
    Ae.windowSeconds = fc, Ae.nextUntil = null, Ae.consecutiveEmptyCount = 0, Ae.lastRange = null, Ae.continuationSince = null, Ae.exhausted = !1;
  }
  function Ke() {
    a.currentViewRefetchMessageKey = null, a.currentViewRefetchMessageValues = null, ar();
  }
  function An() {
    ar();
    const v = /* @__PURE__ */ new Set([
      "postHistory.repairNoChanges",
      "postHistory.repairAdded",
      "postHistory.repairChildInteractionsAdded",
      "postHistory.repairFetchFailed"
    ]);
    v.has(a.currentViewRefetchMessageKey ?? "") && (J = setTimeout(
      () => {
        a.currentViewRefetchMessageKey !== null && v.has(a.currentViewRefetchMessageKey) && (a.currentViewRefetchMessageKey = null, a.currentViewRefetchMessageValues = null), J = null;
      },
      3500
    ));
  }
  function On() {
    Kn(), !(a.syncStatus !== "synced" && a.syncStatus !== "failed") && (L = setTimeout(
      () => {
        (a.syncStatus === "synced" || a.syncStatus === "failed") && (a.syncStatus = "idle"), L = null;
      },
      3500
    ));
  }
  function Pn() {
    he += 1, g(me, !1), g(ke, "idle"), cs.clearCache?.(), rn(), a.searchInput = "", a.searchQuery = "", a.searchPage = 1, a.searchPosts = [], a.searchTotalCount = 0, a.searchTotalCountKnown = !1, a.searchHasNext = !1, ue = "", Sr(), vo();
  }
  function fr() {
    Ye(), y(), a.loadedPosts = [], l({ known: !1, status: "unknown" }), a.currentPage = 1, a.syncStatus = "idle", a.hasMoreRemote = !1, a.nextUntil = null, a.lastDialogOpenRefreshAt = null, a.visibleUntil = null, a.hasJumpCacheAnchors = !1, a.hasOlderLocal = !1, a.hasNewerLocal = !1, a.listingMode = "contiguous", a.sparseSource = null, a.hasSavedPostsOutsideVisibleRange = !1, a.latestOlderBackfillUiResult = null, Pn();
  }
  function vr() {
    const v = Xr(e());
    return !!v && v === r(j);
  }
  function Sr() {
    vr() && sc(e(), {
      searchInput: a.searchInput,
      searchQuery: a.searchQuery,
      currentPage: a.currentPage,
      searchPage: a.searchPage
    });
  }
  function vo() {
    vr() && Zi(e(), {
      loadedPosts: a.loadedPosts,
      searchPosts: a.searchPosts,
      searchQuery: a.searchQuery,
      totalCount: a.totalCount,
      totalCountKnown: a.totalCountKnown,
      totalCountFailed: a.totalCountStatus === "failed",
      searchTotalCount: a.searchTotalCount,
      searchTotalCountKnown: a.searchTotalCountKnown,
      searchHasNext: a.searchHasNext,
      hasMoreRemote: a.hasMoreRemote,
      nextUntil: a.nextUntil,
      lastDialogOpenRefreshAt: a.lastDialogOpenRefreshAt,
      visibleUntil: a.visibleUntil,
      hasJumpCacheAnchors: a.hasJumpCacheAnchors,
      hasOlderLocal: a.hasOlderLocal,
      hasNewerLocal: a.hasNewerLocal
    });
  }
  function Xn(v) {
    g(j, Xr(v), !0);
  }
  function go() {
    Ye(), y(), je.resetOlderRevealRepairContext(), a.loadedPosts = [], a.searchPosts = [], l({ count: 0, known: !0, status: "ready" }), a.searchTotalCount = 0, a.searchTotalCountKnown = !1, a.searchHasNext = !1, a.currentPage = 1, a.searchPage = 1, a.hasMoreRemote = !1, a.nextUntil = null, a.lastDialogOpenRefreshAt = null, a.visibleUntil = null, a.hasJumpCacheAnchors = !1, a.hasOlderLocal = !1, a.hasNewerLocal = !1, a.listingMode = "contiguous", a.sparseSource = null, a.hasSavedPostsOutsideVisibleRange = !1, a.syncStatus = "idle", Cn(), Ke(), Kn(), Pn(), Ee = !0;
  }
  function Io() {
    return a.listingMode === "sparse" && (a.sparseSource === "saved" || a.sparseSource === "jump");
  }
  function to() {
    if (!Io())
      return !1;
    const v = e();
    return fr(), Cn(), Ke(), Kn(), ic(v), Zi(v, { ...vi }), !0;
  }
  function kr() {
    Ye(), k += 1, he += 1, g(me, !1), g(ke, "idle");
  }
  function no() {
    const v = to();
    return Lt(), xr(), kr(), y(), cs.clearCache?.(), je.resetOlderRevealRepairContext(), v;
  }
  function Hr() {
    to(), Lt(), xr(), kr(), y(), cs.clearCache?.(), je.resetOlderRevealRepairContext(), a.syncStatus = "idle", Cn(), Ke(), Kn(), Ee = !1, $e = !1, Pe = null, ve += 1, g(re, "idle"), B = !1;
  }
  function ha(v) {
    const b = ki(v);
    a.hasMoreRemote = b, a.nextUntil = b ? v.nextUntil : null;
  }
  function Oa(v) {
    ki(v) && a.nextUntil === null && (a.hasMoreRemote = !0, a.nextUntil = v.nextUntil);
  }
  async function Nr(v) {
    return typeof r(vt) == "number" && (a.visibleUntil === null ? a.hasJumpCacheAnchors : r(vt) < a.visibleUntil) ? r(vt) : typeof Ae.nextUntil == "number" ? Ae.nextUntil : hm({
      nextUntil: a.nextUntil,
      visibleOldestCreatedAt: r(vt),
      pubkeyHex: v,
      getOldestCreatedAt: (b) => ct.getOldestCreatedAt(b)
    });
  }
  function Qr(v) {
    if (!Number.isFinite(v))
      return null;
    const b = Math.trunc(v) - 1;
    return b < 0 ? null : {
      since: (typeof Ae.continuationSince == "number" && Ae.continuationSince <= b ? Ae.continuationSince : null) ?? Math.max(0, b - Ae.windowSeconds),
      until: b,
      windowSeconds: Ae.windowSeconds
    };
  }
  function _o(v, b) {
    const E = [];
    return v.hasMore && E.push("hasMore"), v.rawCount >= b && E.push("rawCount"), v.perRelayCounts.some((q) => q.rawCount >= b) && E.push("perRelayRawCount"), E;
  }
  function Eo(v) {
    return typeof v.oldestCreatedAt == "number" ? v.oldestCreatedAt : v.events.reduce(
      (b, E) => {
        const q = E.event.created_at;
        return Number.isFinite(q) && (b === null || q < b) ? Math.trunc(q) : b;
      },
      null
    );
  }
  function fa(v, b) {
    Ae.nextUntil = v, Ae.continuationSince = b, Ae.exhausted = v === null, a.nextUntil = v, a.hasMoreRemote = v !== null;
  }
  function ro(v, b, E) {
    _o(b, E), Eo(b), b.rawCount ?? b.events.length, b.uniqueCount ?? b.events.length, typeof Ae.nextUntil == "number" && Qr(Ae.nextUntil);
  }
  function Ao() {
    if (a.searchQuery)
      return [];
    const v = a.loadedPosts.map((q) => q.createdAt).filter((q) => Number.isFinite(q)).map((q) => Math.trunc(q));
    if (v.length === 0)
      return [];
    const b = Math.min(...v), E = Math.max(...v);
    return [
      {
        kinds: [...Zc],
        rangeUnit: "custom",
        since: Math.max(0, b - uc),
        until: E + uc,
        limit: Jc
      }
    ];
  }
  async function Do(v) {
    return (await us.get(v, ks))?.visibleUntil ?? null;
  }
  async function Dn(v, b = null) {
    const E = await Do(v);
    return t() && e() === v && (b === null || b === k) && (a.visibleUntil = E), E;
  }
  async function Yo(v, b = null) {
    const q = (await Ds.getForPubkey(v, { maxCount: 1 })).length > 0;
    return t() && e() === v && (b === null || b === k) && (a.hasJumpCacheAnchors = q), q;
  }
  async function Mr(v, b) {
    const E = await Do(v), q = b.events.length === 0 ? null : ki(b) ? b.nextUntil : typeof b.oldestCreatedAt == "number" ? b.oldestCreatedAt : null, Y = typeof q == "number" ? typeof E == "number" ? Math.min(E, q) : q : E;
    return Y !== E && await us.save({
      pubkeyHex: v,
      kindsKey: ks,
      visibleUntil: Y
    }), a.visibleUntil = Y, Y;
  }
  async function La(v, b) {
    const E = await Do(v), q = Eo(b), Y = typeof q == "number" ? typeof E == "number" ? Math.min(E, q) : q : E;
    return Y !== E && await us.save({
      pubkeyHex: v,
      kindsKey: ks,
      visibleUntil: Y
    }), a.visibleUntil = Y, Y;
  }
  async function ko(v, b, E) {
    if (typeof b != "number")
      return b;
    const q = E.filter((se) => se.source === "preferred" && se.status === "complete" && typeof se.since == "number" && typeof se.until == "number" && se.until >= b - 1).map((se) => se.since);
    if (q.length === 0)
      return b;
    const Y = Math.min(b, ...q);
    return Y === b ? b : (await us.save({
      pubkeyHex: v,
      kindsKey: ks,
      visibleUntil: Y
    }), a.visibleUntil = Y, Y);
  }
  async function Qo(v, b) {
    return typeof b == "number" ? ct.countVisibleForPubkey(v, b) : ct.countForPubkey(v);
  }
  async function po(v, b) {
    if (typeof b == "number")
      return ct.countVisibleForPubkey(v, b);
    const E = fe;
    return E?.pubkeyHex === v && (await E.promise, a.totalCountKnown) || a.totalCountKnown ? a.totalCount : ct.countForPubkey(v);
  }
  function yo(v, b) {
    if (r(ie) || a.listingMode !== "contiguous" || a.sparseSource !== null || e() !== v || a.visibleUntil !== b.visibleUntil)
      return !1;
    const E = z(a.loadedPosts[a.loadedPosts.length - 1]);
    return tn(E, b.oldestCursor);
  }
  async function Mo(v, b) {
    const E = D;
    if (!E || E.pubkeyHex !== v)
      return null;
    const q = await Dn(v, b);
    if (!t() || e() !== v || b !== k || !yo(v, E))
      return null;
    const [Y, se] = await Promise.all([
      Promise.resolve(hs(v)),
      po(v, q)
    ]);
    return !yo(v, E) || Y !== E.revision || se !== E.totalVisibleCount ? null : E;
  }
  async function zo(v, b, E, q, Y) {
    if (Ye(), E.length === 0 || !t() || e() !== v || b !== k || a.listingMode !== "contiguous" || a.sparseSource !== null)
      return !1;
    const se = await po(v, q), ge = await Do(v), Ue = hs(v);
    if (Ue !== Y || ge !== q || !t() || e() !== v || b !== k || a.listingMode !== "contiguous" || a.sparseSource !== null || a.loadedPosts[0]?.eventId !== E[0]?.eventId || a.loadedPosts[a.loadedPosts.length - 1]?.eventId !== E[E.length - 1]?.eventId)
      return !1;
    const Te = z(E[E.length - 1]);
    return Te ? (D = {
      pubkeyHex: v,
      visibleUntil: q,
      revision: Ue,
      totalVisibleCount: se,
      reachedVisibleCount: E.length,
      oldestCursor: Te,
      latestEventId: E[0]?.eventId ?? null
    }, !0) : !1;
  }
  async function Fa(v, b, E) {
    const q = D;
    if (!q || q.pubkeyHex !== v || r(ie) || a.listingMode !== "contiguous" || a.sparseSource !== null || e() !== v)
      return !1;
    const Y = z(a.loadedPosts[a.loadedPosts.length - 1]);
    if (!tn(Y, q.oldestCursor))
      return !1;
    const se = await po(v, b);
    return !t() || e() !== v || !tn(Y, z(a.loadedPosts[a.loadedPosts.length - 1])) ? !1 : (D = {
      ...q,
      visibleUntil: b,
      revision: hs(v),
      totalVisibleCount: se
    }, !0);
  }
  async function gr() {
    Ye(), await Se();
  }
  function To(v, b = a.loadedPosts) {
    if (a.listingMode === "sparse" || a.hasJumpCacheAnchors)
      return !0;
    const E = b.length > 0 ? b[b.length - 1]?.createdAt ?? null : null;
    return typeof E != "number" ? !1 : v === null ? a.hasJumpCacheAnchors : E < v;
  }
  function l({ count: v, known: b, status: E }) {
    typeof v == "number" && (a.totalCount = v), a.totalCountKnown = b, a.totalCountStatus = E;
  }
  function y() {
    ee += 1, fe = null, l({
      known: a.totalCountKnown,
      status: a.totalCountKnown ? "ready" : "unknown"
    });
  }
  function F(v, { force: b = !1 } = {}) {
    if (!t() || e() !== v || !b && fe?.pubkeyHex === v)
      return;
    const E = ++ee;
    l({
      known: a.totalCountKnown,
      status: a.totalCountKnown ? "refreshing" : "loading"
    });
    const q = ct.countForPubkey(v).then((Y) => {
      E !== ee || !t() || e() !== v || l({ count: Y, known: !0, status: "ready" });
    }).catch(() => {
      E !== ee || !t() || e() !== v || l({ known: a.totalCountKnown, status: "failed" });
    }).finally(() => {
      fe?.requestId === E && (fe = null);
    });
    fe = { requestId: E, pubkeyHex: v, promise: q };
  }
  function $({ force: v = !1 } = {}) {
    const b = e();
    !b || !t() || F(b, { force: v });
  }
  async function U(v, b, E = null, q = null) {
    const Y = typeof b == "number" ? await ct.hasPostsBeforeCreatedAt(v, b) : !1;
    !t() || e() !== v || E !== null && E !== k || q !== null && !ht(q) || (a.hasSavedPostsOutsideVisibleRange = Y);
  }
  function z(v) {
    return v ? {
      eventId: v.eventId,
      postedAt: v.postedAt,
      createdAt: v.createdAt
    } : null;
  }
  function ce(v, b) {
    return v.length <= ae ? v : v.slice(0, ae);
  }
  function Me(v, b, E) {
    return om({
      currentPosts: v,
      olderPosts: b,
      anchorEventId: E,
      maxVisiblePosts: ae,
      keepAbove: f
    });
  }
  async function le(v, b = a.loadedPosts, E = null, q = {}) {
    if (b.length === 0) {
      t() && e() === v && (E === null || E === k) && (a.hasOlderLocal = !1, a.hasNewerLocal = !1);
      return;
    }
    const Y = z(b[0]), se = z(b[b.length - 1]), ge = a.visibleUntil, Ue = a.sparseSource === "saved" && typeof ge == "number" ? Y ? ct.getSparseChunk({
      pubkeyHex: v,
      visibleUntil: ge,
      cursor: Y,
      direction: "newer",
      limit: 1
    }) : Promise.resolve([]) : Y ? ct.getNewerVisibleChunk({ pubkeyHex: v, visibleUntil: ge, cursor: Y, limit: 1 }) : Promise.resolve([]), Te = q.skipOlderCheck ? Promise.resolve([]) : a.sparseSource === "saved" && typeof ge == "number" ? se ? ct.getSparseChunk({
      pubkeyHex: v,
      visibleUntil: ge,
      cursor: se,
      direction: "older",
      limit: 1
    }) : Promise.resolve([]) : a.sparseSource === "jump" ? se ? ct.getOlderVisibleChunk({
      pubkeyHex: v,
      visibleUntil: null,
      cursor: se,
      limit: 1
    }) : Promise.resolve([]) : se ? ct.getOlderVisibleChunk({ pubkeyHex: v, visibleUntil: ge, cursor: se, limit: 1 }) : Promise.resolve([]), [We, _e] = await Promise.all([Ue, Te]);
    !t() || e() !== v || E !== null && E !== k || (a.hasNewerLocal = We.length > 0, q.skipOlderCheck || (a.hasOlderLocal = _e.length > 0));
  }
  async function Se({
    forceTotalCount: v = !1,
    skipTotalCountRefresh: b = !1,
    skipOlderAvailabilityCheck: E = !1,
    awaitProgress: q = !1
  } = {}) {
    Ye();
    const Y = e();
    if (!Y) {
      g(j, null), fr();
      return;
    }
    const se = ++k, ge = await Dn(Y, se), Ue = hs(Y), Te = await ct.getLatestVisibleChunk({ pubkeyHex: Y, limit: f, visibleUntil: ge });
    if (!t() || e() !== Y || se !== k || (Xn(Y), a.listingMode = "contiguous", a.sparseSource = null, a.loadedPosts = Te, !await un(Y, () => nn(Y, se), () => a.loadedPosts.length > 0)))
      return;
    b || $({ force: v }), Yo(Y, se).catch(() => {
    });
    const We = zo(Y, se, Te, ge, Ue);
    let _e = !1;
    q ? _e = await We.catch(() => (Ye(), !1)) : We.catch(() => {
      Ye();
    });
    const Bt = E && _e;
    E && !Bt ? a.hasOlderLocal = !1 : Bt && D && (a.hasOlderLocal = D.totalVisibleCount > D.reachedVisibleCount), U(Y, ge, se).catch(() => {
    }), le(Y, Te, se, { skipOlderCheck: Bt }).then(() => {
      !t() || e() !== Y || se !== k || Wo(Y, Te);
    }).catch(() => {
    });
  }
  async function De({ skipTotalCountRefresh: v = !1 } = {}) {
    Ye();
    const b = e();
    if (!b || a.loadedPosts.length === 0) {
      await Se({ skipTotalCountRefresh: v });
      return;
    }
    const E = a.loadedPosts[0], q = z(E);
    if (!q) {
      await Se({ skipTotalCountRefresh: v });
      return;
    }
    const Y = ++k, se = await Dn(b), Ue = To(se, a.loadedPosts) ? await ct.getVisibleChunkFromCreatedAt({
      pubkeyHex: b,
      visibleUntil: se,
      createdAt: E.createdAt,
      limit: a.loadedPosts.length,
      query: { contiguous: !1 }
    }) : await (a.loadedPosts.length > 1 ? ct.getOlderVisibleChunk({
      pubkeyHex: b,
      visibleUntil: se,
      cursor: q,
      limit: a.loadedPosts.length - 1
    }).then((Te) => [E, ...Te]) : Promise.resolve([E]));
    !t() || Y !== k || (a.loadedPosts = Ue, await un(b, () => nn(b, Y), () => a.loadedPosts.length > 0) && (v || $(), await le(b, Ue, Y)));
  }
  function Ne(v, b) {
    return !!v && (!b || v.requestedAt > b.savedAt);
  }
  async function Be(v, b) {
    Ye();
    const E = e(), q = a.loadedPosts, Y = z(q[0]), se = z(q[q.length - 1]);
    if (!E || !t() || q.length === 0)
      return;
    const ge = ++k, Ue = await Dn(E), [Te, We] = await Promise.all([
      Y ? ct.getNewerVisibleChunk({ pubkeyHex: E, visibleUntil: Ue, cursor: Y, limit: 1 }) : Promise.resolve([]),
      se ? ct.getOlderVisibleChunk({ pubkeyHex: E, visibleUntil: Ue, cursor: se, limit: 1 }) : Promise.resolve([])
    ]);
    if (!(!t() || ge !== k)) {
      if (Ne(b, v)) {
        s(), await Se();
        return;
      }
      a.hasNewerLocal = Te.length > 0, a.hasOlderLocal = We.length > 0, await un(E, () => nn(E, ge), () => a.loadedPosts.length > 0) && ($(), await le(E, a.loadedPosts, ge), nn(E, ge) && Wo(E, a.loadedPosts));
    }
  }
  function pt() {
    const v = i();
    return !v || v.mode !== "normal" || v.pubkeyHex !== e() ? null : v;
  }
  function yt(v) {
    return r(ie) || a.loadedPosts.length === 0 || !v ? !1 : a.loadedPosts.some((b) => b.eventId === v.anchor.eventId);
  }
  async function Et(v) {
    Ye();
    const b = e();
    if (!b || !t())
      return !1;
    const E = ++k, q = await Dn(b), Y = await ct.getVisibleChunkAroundEventId({
      pubkeyHex: b,
      visibleUntil: q,
      eventId: v.anchor.eventId,
      limit: ae,
      keepAbove: f
    });
    return !t() || E !== k ? !1 : Y.length === 0 ? (s(), await Se(), !1) : (a.loadedPosts = Y, !await un(b, () => nn(b, E), () => a.loadedPosts.length > 0) || ($(), await le(b, Y, E), !nn(b, E)) ? !1 : (Wo(b, Y), !0));
  }
  async function Ve(v = {}) {
    const b = a.loadedPosts, E = v.metrics;
    E && (E.loadedPostsBeforeLength = b.length, E.loadedPostsAfterLength = b.length, E.olderPostsLength = 0, E.visibleOldestBefore = b.length > 0 ? b[b.length - 1]?.createdAt ?? null : null, E.visibleOldestAfter = b.length > 0 ? b[b.length - 1]?.createdAt ?? null : null, E.didTrimForOlderAppend = !1, E.didDeferOlderPosts = !1, E.maxVisiblePosts = ae);
    const q = e(), Y = z(a.loadedPosts[a.loadedPosts.length - 1]);
    if (!q || !Y)
      return await Se(), E && (E.loadedPostsAfterLength = a.loadedPosts.length, E.olderPostsLength = a.loadedPosts.length, E.visibleOldestAfter = a.loadedPosts.length > 0 ? a.loadedPosts[a.loadedPosts.length - 1]?.createdAt ?? null : null), a.loadedPosts.length > 0;
    const se = v.useContiguousProgress !== !1 && D !== null, ge = v.preserveContiguousProgressAfterDatabaseChange ? D : null, Ue = ++k, Te = se ? await Mo(q, Ue) : null;
    if (se && !Te)
      return await gr(), E && (E.loadedPostsAfterLength = a.loadedPosts.length, E.visibleOldestAfter = a.loadedPosts.length > 0 ? a.loadedPosts[a.loadedPosts.length - 1]?.createdAt ?? null : null), !1;
    const We = Te?.visibleUntil ?? await Dn(q, Ue), _e = Te ? Math.max(0, Te.totalVisibleCount - Te.reachedVisibleCount) : f;
    if (Te && _e === 0)
      return a.hasOlderLocal = !1, E && (E.loadedPostsAfterLength = a.loadedPosts.length, E.visibleOldestAfter = a.loadedPosts.length > 0 ? a.loadedPosts[a.loadedPosts.length - 1]?.createdAt ?? null : null), await le(q, a.loadedPosts, Ue, { skipOlderCheck: !0 }), !1;
    const Bt = Math.min(f, _e), xn = await ct.getOlderVisibleChunk({
      pubkeyHex: q,
      visibleUntil: We,
      cursor: Y,
      limit: Bt
    });
    if (E && (E.olderPostsLength = xn.length), !t() || Ue !== k)
      return !1;
    const ze = Te ? await Mo(q, Ue) : null;
    if (Te && !ze)
      return await gr(), !1;
    if (xn.length === 0)
      return Te ? await gr() : a.hasOlderLocal = !1, E && (E.loadedPostsAfterLength = a.loadedPosts.length, E.visibleOldestAfter = a.loadedPosts.length > 0 ? a.loadedPosts[a.loadedPosts.length - 1]?.createdAt ?? null : null), !1;
    const Ht = v.autoLoadViewportCommit ? v.autoLoadViewportCommit.captureAnchorEventId() : null;
    if (v.autoLoadViewportCommit && !Ht)
      return !1;
    const At = Me(b, xn, Ht ?? v.anchorEventId), Wr = v.reason === "normal-older-reveal" ? am(b, At.posts) : [];
    if (v.autoLoadViewportCommit && (!Ht || !At.posts.some((oo) => oo.eventId === Ht) || Wr.length === 0) || v.autoLoadViewportCommit && !v.autoLoadViewportCommit.canCommitWindowChange("older", b, At.posts))
      return !1;
    a.loadedPosts = At.posts, Wr.length > 0 && je.scheduleOlderRevealRepair(Wr), At.didDeferOlderPosts && (a.hasOlderLocal = !0), At.didTrimForOlderAppend && (a.hasNewerLocal = !0);
    const bo = Wr.length;
    ze ? D = {
      ...ze,
      reachedVisibleCount: Math.min(ze.totalVisibleCount, ze.reachedVisibleCount + bo),
      oldestCursor: z(At.posts[At.posts.length - 1]) ?? ze.oldestCursor
    } : !se && ge && hs(q) === ge.revision && (tn(Y, ge.oldestCursor) ? D = {
      ...ge,
      reachedVisibleCount: Math.min(ge.totalVisibleCount, ge.reachedVisibleCount + bo),
      oldestCursor: z(At.posts[At.posts.length - 1]) ?? ge.oldestCursor
    } : Ye());
    const $r = se && ze !== null && D !== null, Co = !!D && D.reachedVisibleCount >= D.totalVisibleCount;
    return $r && D && (a.hasOlderLocal = D.totalVisibleCount > D.reachedVisibleCount), E && (E.loadedPostsAfterLength = At.posts.length, E.visibleOldestAfter = At.posts.length > 0 ? At.posts[At.posts.length - 1]?.createdAt ?? null : null, E.didTrimForOlderAppend = At.didTrimForOlderAppend, E.didDeferOlderPosts = At.didDeferOlderPosts), v.autoLoadViewportCommit?.onCommitted(), $r ? (le(q, At.posts, Ue, { skipOlderCheck: !0 }).catch(() => {
    }), !0) : (await le(q, At.posts, Ue, {
      skipOlderCheck: se && Co
    }), !0);
  }
  async function tt(v, b, E = {}) {
    Ye();
    const q = a.loadedPosts, Y = q.length > 0 ? q[q.length - 1]?.createdAt ?? null : null;
    if (typeof Y != "number")
      return !1;
    const se = await ct.getVisibleChunkFromCreatedAt({
      pubkeyHex: v,
      visibleUntil: a.visibleUntil,
      createdAt: Math.max(0, Y - 1),
      limit: f,
      query: { contiguous: !1 }
    });
    if (!t() || b !== k)
      return !1;
    if (se.length === 0)
      return a.hasOlderLocal = !1, !1;
    const ge = Me(q, se, E.anchorEventId);
    return a.loadedPosts = ge.posts, await le(v, ge.posts, b), ge.didDeferOlderPosts && (a.hasOlderLocal = !0), !0;
  }
  async function Zt(v, b, E = {}) {
    Ye();
    const q = a.loadedPosts;
    if (typeof a.visibleUntil != "number")
      return !1;
    const Y = z(q[q.length - 1]);
    if (!Y)
      return !1;
    const se = await ct.getSparseChunk({
      pubkeyHex: v,
      visibleUntil: a.visibleUntil,
      cursor: Y,
      direction: "older",
      limit: f
    });
    if (!t() || b !== k)
      return !1;
    if (se.length === 0)
      return a.hasOlderLocal = !1, !1;
    const ge = Me(q, se, E.anchorEventId);
    return a.loadedPosts = ge.posts, await le(v, ge.posts, b), ge.didDeferOlderPosts && (a.hasOlderLocal = !0), !0;
  }
  async function Xt(v) {
    const b = e(), E = z(a.loadedPosts[0]);
    if (!b || !E)
      return !1;
    const q = ++k, Y = D, se = Y ? await Mo(b, q) : null;
    if (Y && !se)
      return await gr(), !1;
    const ge = se?.visibleUntil ?? await Dn(b, q), Ue = await ct.getNewerVisibleChunk({
      pubkeyHex: b,
      visibleUntil: ge,
      cursor: E,
      limit: f
    });
    if (!t() || q !== k)
      return !1;
    if (Ue.length === 0)
      return a.hasNewerLocal = !1, !1;
    if (se && !await Mo(b, q))
      return await gr(), !1;
    const Te = v?.captureAnchorEventId();
    if (v && !Te)
      return !1;
    const We = a.loadedPosts, _e = ce([...Ue, ...We]);
    if (v && !_e.some((xn) => xn.eventId === Te) || v && !v.canCommitWindowChange("newer", We, _e))
      return !1;
    a.loadedPosts = _e;
    const Bt = Math.max(0, We.length + Ue.length - _e.length);
    return se && (D = {
      ...se,
      reachedVisibleCount: Math.max(0, se.reachedVisibleCount - Bt),
      oldestCursor: z(_e[_e.length - 1]) ?? se.oldestCursor
    }), v && Bt > 0 && (a.hasOlderLocal = !0), v?.onCommitted(), await le(b, _e, q), !(!t() || q !== k);
  }
  async function Rr(v) {
    Ye();
    const b = e();
    if (!b)
      return !1;
    const E = ++k, q = await Dn(b), Y = await ct.getVisibleChunkFromCreatedAt({ pubkeyHex: b, visibleUntil: q, createdAt: v, limit: f });
    if (!t() || E !== k)
      return !1;
    if (Y.length === 0)
      return $(), a.loadedPosts = [], a.hasOlderLocal = !1, a.hasNewerLocal = !1, !1;
    if (!Ji(Y, v))
      return $(), a.listingMode = "contiguous", a.sparseSource = null, a.loadedPosts = Y, Cn(), await le(b, Y, E), !0;
    if (v <= 0)
      return $(), a.listingMode = "contiguous", a.sparseSource = null, a.loadedPosts = Y, Cn(), await le(b, Y, E), !0;
    const se = await Ds.hasNearbyAnchorForPubkey({ pubkeyHex: b, targetCreatedAt: v });
    if (!t() || E !== k)
      return !1;
    if (se) {
      const ze = await ct.getVisibleChunkFromCreatedAt({
        pubkeyHex: b,
        visibleUntil: q,
        createdAt: v,
        limit: f,
        query: { contiguous: !1 }
      });
      if (!t() || E !== k)
        return !1;
      if (!Ji(ze, v))
        return $(), a.listingMode = "sparse", a.sparseSource = "jump", a.loadedPosts = ze, Cn(), await le(b, ze, E), !0;
    }
    const ge = n();
    if (!ge)
      return $(), a.listingMode = "contiguous", a.sparseSource = null, a.loadedPosts = Y, Cn(), await le(b, Y, E), !0;
    Lt();
    const Ue = ++Le;
    a.syncStatus = "syncing";
    const Te = Math.max(0, v - hc), We = v, _e = ri.fetchLatest(ge, {
      pubkeyHex: b,
      relayConfig: o(),
      reason: "repair-visible-range",
      limit: sm,
      since: Te,
      until: We
    });
    xe = _e;
    const Bt = await _e.promise;
    if (!ht(Ue) || xe !== _e)
      return !1;
    if (xe = null, !t() || Bt.status === "cancelled" || (Bt.events.length > 0 && (await ct.upsertFetchedEvents({ events: Bt.events, fetchedAt: Bt.fetchedAt }), await Ds.addForPubkey({
      pubkeyHex: b,
      centerCreatedAt: v,
      radiusSec: hc,
      fetchedAt: Bt.fetchedAt
    }), a.hasJumpCacheAnchors = !0), !t() || E !== k))
      return a.syncStatus = "idle", !1;
    const xn = await ct.getVisibleChunkFromCreatedAt({
      pubkeyHex: b,
      visibleUntil: q,
      createdAt: v,
      limit: f,
      query: { contiguous: !1 }
    });
    return !t() || E !== k ? (a.syncStatus = "idle", !1) : (a.syncStatus = "idle", Ji(xn, v) ? !1 : ($({ force: Bt.events.length > 0 }), a.listingMode = "sparse", a.sparseSource = "jump", a.loadedPosts = xn, Cn(), await le(b, xn, E), je.repairJump({
      ownerPubkeyHex: b,
      rxNostr: ge,
      visiblePosts: xn,
      isActive: () => t() && e() === b && n() === ge && E === k
    }).catch(() => {
    }), !0));
  }
  async function zr(v) {
    Ye();
    const b = e();
    if (!b || !v)
      return !1;
    const E = ++k, q = await Dn(b, E), Y = (Te) => ct.getVisibleChunkAroundEventId({
      pubkeyHex: b,
      visibleUntil: Te,
      eventId: v,
      limit: ae,
      keepAbove: f
    });
    let se = await Y(q);
    if (!t() || E !== k)
      return !1;
    const ge = se.some((Te) => Te.eventId === v);
    let Ue = !1;
    return !ge && typeof q == "number" && (se = await Y(null), Ue = !0, !t() || E !== k) || !se.some((Te) => Te.eventId === v) ? !1 : ($(), a.listingMode = Ue ? "sparse" : "contiguous", a.sparseSource = Ue ? "jump" : null, a.loadedPosts = se, a.hasOlderLocal = !1, a.hasNewerLocal = !1, Cn(), le(b, se, E).catch(() => {
    }), !0);
  }
  function we(v, b) {
    const E = [...v], q = new Set(v.map((Y) => Y.eventId));
    for (const Y of b)
      q.has(Y.eventId) || (q.add(Y.eventId), E.push(Y));
    return E;
  }
  function Qe(v, b, E) {
    return v === he && t() && e() === E && b === a.searchQuery;
  }
  async function wn(v, b, E, q = !1) {
    const Y = e();
    if (!Y || !b)
      return null;
    const se = { items: null }, ge = await cs.searchLocalPosts({
      pubkeyHex: Y,
      query: b,
      page: v,
      pageSize: f,
      onProgress: q ? async (Te) => {
        Qe(E, b, Y) && (se.items = Te.items, a.searchPosts = Te.items, a.searchTotalCountKnown = !1, a.searchHasNext = !1, Te.phase === "partial" && !Z && await un(Y, () => Qe(E, b, Y), () => a.searchPosts.length > 0));
      } : void 0
    });
    if (!Qe(E, b, Y)) return null;
    const Ue = se.items;
    return Ue !== null && Ue.length === ge.items.length && ge.items.every((Te, We) => Te === Ue[We]) ? { ...ge, items: a.searchPosts } : ge;
  }
  async function kn(v, b) {
    const E = e();
    if (!E || !b)
      return a.searchPosts = [], a.searchTotalCount = 0, a.searchTotalCountKnown = !1, a.searchHasNext = !1, !1;
    const q = ++he, Y = Math.max(1, Math.trunc(v));
    g(me, !0), g(ke, "loading"), a.searchTotalCountKnown = !1;
    try {
      const se = await wn(Y, b, q, Y === 1);
      if (!se)
        return !1;
      const ge = Ed(Y, se.total, f);
      return ge !== Y ? (q === he && Qe(q, b, E) && g(ke, "ready"), !1) : (a.searchTotalCount = se.total, a.searchTotalCountKnown = !0, a.searchPosts = Y === 1 ? se.items : we(a.searchPosts, se.items), a.searchPage = ge, a.searchHasNext = se.hasNext, g(ke, "ready"), !(!Z && !await un(E, () => Qe(q, b, E), () => a.searchPosts.length > 0)));
    } catch {
      return q === he && g(ke, "failed"), !1;
    } finally {
      q === he && g(me, !1);
    }
  }
  async function Ft(v, b, E = ++he) {
    const q = e();
    if (!q || !b)
      return !1;
    const Y = Math.max(1, Math.trunc(v));
    g(me, !0), g(ke, "loading"), a.searchTotalCountKnown = !1;
    try {
      const se = await wn(1, b, E, Y === 1);
      if (!se)
        return !1;
      const ge = Ed(Y, se.total, f);
      let Ue = se.items, Te = se;
      for (let We = 2; We <= ge; We += 1) {
        const _e = await wn(We, b, E);
        if (!_e)
          return !1;
        Ue = we(Ue, _e.items), Te = _e;
      }
      return a.searchPosts = Ue, a.searchTotalCount = se.total, a.searchTotalCountKnown = !0, a.searchPage = ge, a.searchHasNext = Te.hasNext, g(ke, "ready"), !(!Z && !await un(q, () => Qe(E, b, q), () => a.searchPosts.length > 0));
    } catch {
      return E === he && g(ke, "failed"), !1;
    } finally {
      E === he && g(me, !1);
    }
  }
  async function mo() {
    Ye();
    const v = e(), b = n();
    if (!v || !b)
      return;
    Lt();
    const E = ++Le;
    a.syncStatus = "syncing";
    const q = await Dn(v);
    if (!ht(E) || !t() || e() !== v)
      return;
    const Y = ri.fetchLatest(b, {
      pubkeyHex: v,
      relayConfig: o(),
      reason: "bootstrap",
      limit: rf,
      timeoutMs: nf
    });
    xe = Y;
    const se = await Y.promise;
    let ge = {
      insertedCount: 0,
      updatedCount: 0
    };
    if (!ht(E) || xe !== Y || (xe = null, !t() || se.status === "cancelled"))
      return;
    if (se.events.length > 0) {
      ge = await ct.upsertFetchedEvents({ events: se.events, fetchedAt: se.fetchedAt });
      const We = rm(se.events);
      We.length > 0 && await d(We);
    }
    if (!ht(E) || !t())
      return;
    const Ue = await Mr(v, se);
    if (!ht(E) || !t())
      return;
    const Te = Ue !== q;
    ha(se), a.searchQuery ? await Ft(a.searchPage, a.searchQuery) : a.loadedPosts.length === 0 || !a.hasNewerLocal ? await Se({
      forceTotalCount: ge.insertedCount + ge.updatedCount > 0
    }) : ($({
      force: ge.insertedCount + ge.updatedCount > 0
    }), await le(v)), a.syncStatus = Di(se, ge.insertedCount + ge.updatedCount > 0 || Te);
  }
  async function Ha() {
    const v = e(), b = n();
    if (!v || !b)
      return;
    Lt();
    const E = ++Le;
    a.syncStatus = "syncing", a.lastDialogOpenRefreshAt = Date.now();
    const q = await Dn(v);
    if (!ht(E) || !t() || e() !== v)
      return;
    const Y = Xc.runAuthored(b, {
      ownerPubkeyHex: v,
      relayConfig: o(),
      reason: "dialog-open-refresh",
      limit: sf,
      timeoutMs: af,
      onSavedSelfPosts: d
    });
    xe = Y;
    const se = await Y.promise, ge = se.fetchResult, Ue = se.upsertSummary;
    if (!ht(E) || xe !== Y || (xe = null, !t() || ge.status === "cancelled") || !ht(E) || !t())
      return;
    const Te = await Mr(v, ge);
    if (!ht(E) || !t())
      return;
    const We = Ry({
      insertedCount: Ue.insertedCount,
      updatedCount: Ue.updatedCount,
      previousVisibleUntil: q,
      nextVisibleUntil: Te,
      searchQuery: a.searchQuery,
      loadedPostsLength: a.loadedPosts.length,
      hasNewerLocal: a.hasNewerLocal
    });
    if (Oa(ge), a.syncStatus = Di(ge, We.didMateriallyChange), On(), We.applyAction === "reload-search-page")
      await Ft(a.searchPage, a.searchQuery);
    else if (We.applyAction === "load-latest-visible-posts") {
      const _e = We.didMateriallyChange && !We.didVisibleMateriallyChange;
      await Se({
        forceTotalCount: We.didMateriallyChange,
        skipOlderAvailabilityCheck: _e,
        awaitProgress: _e
      });
    } else We.applyAction === "refresh-count-and-availability" && (We.didMateriallyChange ? await Se({
      forceTotalCount: We.didMateriallyChange,
      skipOlderAvailabilityCheck: !We.didVisibleMateriallyChange,
      awaitProgress: !We.didVisibleMateriallyChange
    }) : (Ye(), $({ force: We.didMateriallyChange }), await le(v)));
  }
  function ts() {
    return typeof a.lastDialogOpenRefreshAt != "number" ? !0 : Date.now() - a.lastDialogOpenRefreshAt >= of;
  }
  function Wo(v, b) {
    if (!(Ee || !t() || e() !== v || !n())) {
      if (Ee = !0, b.length === 0) {
        mo();
        return;
      }
      ts() && Ha();
    }
  }
  function Na() {
    return !r(ie) || !r(ln) ? !1 : (a.searchPage -= 1, !0);
  }
  function Jo() {
    return !r(ie) || !r(Xe) ? !1 : (a.searchPage = 1, !0);
  }
  async function Go() {
    if (!r(ie) || !r(ut))
      return !1;
    const v = a.searchPage + 1;
    return kn(v, a.searchQuery);
  }
  async function ns() {
    return !r(ie) || !r(it) ? !1 : (a.searchPage = r(_t), !0);
  }
  async function $a(v) {
    if (r(ie))
      return Go();
    if (a.sparseSource === "saved") {
      const b = e();
      return b ? Zt(b, ++k, {}) : !1;
    }
    if (a.sparseSource === "jump") {
      const b = e();
      return b ? tt(b, ++k, {}) : !1;
    }
    return Ve({ reason: "normal-older-reveal", autoLoadViewportCommit: v });
  }
  async function Zo(v) {
    return r(ie) ? Promise.resolve(Na()) : a.sparseSource === "saved" ? Lo() : Xt(v);
  }
  async function Oo() {
    return r(ie) ? Promise.resolve(Jo()) : (await Se(), !0);
  }
  async function va() {
    const v = e();
    if (!v)
      return !1;
    const b = await Dn(v);
    if (typeof b != "number") return !1;
    const E = ++k, q = await ct.getSparseChunk({
      pubkeyHex: v,
      visibleUntil: b,
      direction: "latest",
      limit: f
    });
    return !t() || e() !== v || E !== k ? !1 : q.length === 0 ? (a.hasSavedPostsOutsideVisibleRange = !1, !1) : (a.listingMode = "sparse", a.sparseSource = "saved", a.loadedPosts = q, $(), await le(v, q, E), await U(v, b, E), !0);
  }
  async function rs() {
    if (r(ie) || !r(Yt))
      return !1;
    if (a.listingMode === "sparse") {
      Ye();
      const Y = e();
      if (!Y)
        return !1;
      const se = ++k, ge = await ct.getOldestVisibleChunk({
        pubkeyHex: Y,
        visibleUntil: a.visibleUntil,
        limit: f,
        query: { contiguous: !1 }
      });
      return !t() || se !== k || ge.length === 0 ? !1 : ($(), a.loadedPosts = ge, Cn(), a.hasOlderLocal = !1, await le(Y, ge, se, { skipOlderCheck: !0 }), !0);
    }
    Ye();
    const v = e();
    if (!v)
      return !1;
    const b = ++k, E = await Dn(v, b), q = await ct.getOldestVisibleChunk({ pubkeyHex: v, visibleUntil: E, limit: f });
    return !t() || b !== k ? !1 : q.length === 0 ? ($(), a.loadedPosts = [], a.hasOlderLocal = !1, a.hasNewerLocal = !1, !1) : ($(), a.listingMode = "contiguous", a.sparseSource = null, a.loadedPosts = q, Cn(), a.hasOlderLocal = !1, await le(v, q, b, { skipOlderCheck: !0 }), !0);
  }
  async function Ba(v = {}) {
    const b = e(), E = n();
    if (!b || !E || !r(et))
      return !1;
    Lt();
    const q = ++Le;
    a.syncStatus = "older-syncing";
    const Y = dm, se = cm, ge = Math.max(1, Math.min(f, 30));
    let Ue = null, Te = 0, We = 0, _e = 0, Bt = null, xn = null, ze = !1, Ht = 0, At = null;
    for (; ; ) {
      Te += 1;
      const Wr = Bt ?? await Nr(b), bo = typeof Bt == "number", $r = await Dn(b);
      if (!ht(q) || !t() || e() !== b)
        return ze;
      const Co = typeof Wr == "number" ? bo ? Wr : typeof $r == "number" ? Math.min(Wr, $r) : Wr : $r;
      if (typeof Co != "number")
        return a.syncStatus = "idle", ze;
      const oo = Math.trunc(Co) - 1;
      if (oo < 0)
        return fa(null, null), a.syncStatus = "idle", ze;
      const Cs = Math.min(_e, Gi.length - 1), qa = Gi[Cs], Tr = {
        since: (typeof xn == "number" && xn <= oo ? xn : null) ?? Math.max(0, oo - qa),
        until: oo,
        windowSeconds: qa
      }, Ua = await Qo(b, $r);
      if (!ht(q) || !t() || e() !== b)
        return ze;
      Ue === null && (Ue = Ua);
      let ea = !1, ya = {
        insertedCount: 0,
        updatedCount: 0
      };
      const ma = ri.fetchLatest(E, {
        pubkeyHex: b,
        relayConfig: o(),
        reason: "older-backfill",
        limit: Ai,
        timeoutMs: tf,
        since: Tr.since,
        until: Tr.until
      });
      xe = ma;
      const Yn = await ma.promise;
      if (!ht(q) || xe !== ma || (xe = null, !t() || Yn.status === "cancelled") || (Yn.events.length > 0 && (ya = await ct.upsertFetchedEvents({ events: Yn.events, fetchedAt: Yn.fetchedAt }), ea = ya.insertedCount + ya.updatedCount > 0), !ht(q) || !t()))
        return ze;
      const ta = typeof r(vt) == "number" && ($r === null ? a.hasJumpCacheAnchors : r(vt) < $r), ba = ta ? $r : await La(b, Yn);
      if (!ht(q) || !t())
        return ze;
      const ao = !ta && typeof ba == "number" ? await Ds.reconcileWithFrontier({
        pubkeyHex: b,
        frontierVisibleUntil: ba,
        toleranceSec: im
      }) : null, c = ao ? ao.nextVisibleUntil : ba;
      ao && (a.hasJumpCacheAnchors = ao.anchors.length > 0), ao && ao.nextVisibleUntil !== ba && (await us.save({
        pubkeyHex: b,
        kindsKey: ks,
        visibleUntil: ao.nextVisibleUntil
      }), a.visibleUntil = ao.nextVisibleUntil);
      const H = await Qo(b, c);
      if (!ht(q) || !t())
        return ze;
      let pe = !1;
      if (ta || (pe = await Fa(b, c)), await U(b, c, null, q), !ht(q) || !t())
        return ze;
      const ye = H > Ua, Mt = _o(Yn, Ai).length > 0, hn = Eo(Yn), er = typeof hn == "number" && hn > Tr.since ? hn - Tr.since : 0, Sn = Yn.status === "success" && Mt && typeof hn == "number" && hn > Tr.since && er >= lm;
      let fn = Tr.since > 0 ? Tr.since : null, Un = null;
      Sn && typeof hn == "number" && (fn = hn, Un = Tr.since), Ae.windowSeconds = qa, Ae.lastRange = { ...Tr, hitLimit: Mt }, Yn.status === "success" && Yn.events.length === 0 ? Ae.consecutiveEmptyCount += 1 : Yn.events.length > 0 && (Ae.consecutiveEmptyCount = 0), fa(fn, Un), ro(Tr, Yn, Ai);
      let Br = !1;
      const vn = {
        loadedPostsBeforeLength: a.loadedPosts.length,
        loadedPostsAfterLength: a.loadedPosts.length,
        olderPostsLength: 0,
        visibleOldestBefore: a.loadedPosts.length > 0 ? a.loadedPosts[a.loadedPosts.length - 1]?.createdAt ?? null : null,
        visibleOldestAfter: a.loadedPosts.length > 0 ? a.loadedPosts[a.loadedPosts.length - 1]?.createdAt ?? null : null,
        didTrimForOlderAppend: !1,
        didDeferOlderPosts: !1,
        maxVisiblePosts: ae
      };
      a.searchQuery ? await Ft(a.searchPage, a.searchQuery) : ($({ force: ea }), ye || ea ? Br = a.sparseSource === "saved" ? await Zt(b, k, { anchorEventId: v.anchorEventId }) : ta ? await tt(b, k, { anchorEventId: v.anchorEventId }) : await Ve({
        anchorEventId: v.anchorEventId,
        metrics: vn,
        reason: "normal-older-reveal",
        useContiguousProgress: !1,
        preserveContiguousProgressAfterDatabaseChange: pe
      }) : await le(b));
      const tr = Br || ye || ea, so = ze || tr, nr = typeof fn == "number" && fn < Co, Ln = H, pr = Math.max(0, Ln - (Ue ?? Ln)), Ir = typeof fn == "number" ? Math.max(0, Co - fn) : Math.max(0, Co), ss = We + Ir, Fo = um({
        status: Yn.status,
        changed: tr,
        didCursorAdvanceOlder: nr,
        hitLimit: Mt,
        continuedWithinWindow: Sn,
        attemptIndex: Te,
        maxAttempts: Y,
        totalVisibleAdded: pr,
        targetVisibleAdded: ge,
        exploredSeconds: ss,
        maxExploreSeconds: se
      }), is = Fo.shouldContinue, Ps = is ? Ht + 1 : Ht;
      if (We = ss, is) {
        a.latestOlderBackfillUiResult = {
          changed: so,
          didTrimForOlderAppend: vn.didTrimForOlderAppend,
          didDeferOlderPosts: vn.didDeferOlderPosts,
          loadedPostsBeforeLength: vn.loadedPostsBeforeLength,
          loadedPostsAfterLength: vn.loadedPostsAfterLength,
          maxVisiblePosts: vn.maxVisiblePosts,
          autoRetryCount: Ps,
          autoRetryReason: Fo.reason,
          attemptIndex: Te,
          maxAttempts: Y,
          clickStartVisibleCount: Ue ?? Ln,
          currentVisibleCount: Ln,
          totalVisibleAdded: pr,
          targetVisibleAdded: ge,
          shouldContinueForSmallBatch: is,
          exploredSeconds: We,
          maxExploreSeconds: se
        }, Ht = Ps, At = Fo.reason, ze = so, Bt = fn, xn = Un, Sn || (_e = Math.min(_e + 1, Gi.length - 1));
        continue;
      }
      return At = Fo.reason, ze = so, Fo.reason, a.latestOlderBackfillUiResult = {
        changed: ze,
        didTrimForOlderAppend: vn.didTrimForOlderAppend,
        didDeferOlderPosts: vn.didDeferOlderPosts,
        loadedPostsBeforeLength: vn.loadedPostsBeforeLength,
        loadedPostsAfterLength: vn.loadedPostsAfterLength,
        maxVisiblePosts: vn.maxVisiblePosts,
        autoRetryCount: Ht,
        autoRetryReason: At,
        attemptIndex: Te,
        maxAttempts: Y,
        clickStartVisibleCount: Ue ?? Ln,
        currentVisibleCount: Ln,
        totalVisibleAdded: pr,
        targetVisibleAdded: ge,
        shouldContinueForSmallBatch: is,
        exploredSeconds: We,
        maxExploreSeconds: se
      }, Yn.status !== "success" ? (a.syncStatus = "failed", On(), ze) : (a.syncStatus = ze ? Di(Yn, !0) : "idle", On(), ze);
    }
  }
  async function os() {
    Ye();
    const v = e(), b = n();
    if (!v || !b || !r(Qt))
      return;
    const E = Ao();
    if (E.length === 0)
      return;
    Ke(), a.currentViewRefetchStatus = "refetching";
    let q = null, Y;
    const se = Date.now();
    try {
      Y = await Dn(v), fo({
        phase: "visible-range-state",
        startedAt: se
      });
    } catch (_e) {
      fo({
        phase: "visible-range-state",
        startedAt: se,
        error: _e
      }), a.currentViewRefetchStatus = "idle", a.currentViewRefetchMessageKey = "postHistory.repairFetchFailed", a.currentViewRefetchMessageValues = null, An();
      return;
    }
    let ge;
    const Ue = Date.now();
    try {
      ge = Vy.refetchAroundCurrentView(b, {
        pubkeyHex: v,
        relayConfig: o(),
        preferredRanges: E,
        onProgress: async () => {
        }
      });
    } catch (_e) {
      fo({
        phase: "primary-fetch",
        startedAt: Ue,
        error: _e
      }), a.currentViewRefetchStatus = "idle", a.currentViewRefetchMessageKey = "postHistory.repairFetchFailed", a.currentViewRefetchMessageValues = null, An();
      return;
    }
    Fe = ge;
    let Te = !1, We = Ue;
    try {
      const _e = await ge.promise;
      if (Fe !== ge)
        return;
      if (fo({
        phase: "primary-fetch",
        startedAt: Ue,
        durationMs: _e.timing?.primaryFetchDurationMs ?? 0,
        counts: {
          processedRangeCount: _e.processedRangeCount,
          rawCount: _e.processedRanges.reduce((Ht, At) => Ht + (At.rawCount ?? 0), 0),
          uniqueCount: _e.processedRanges.reduce((Ht, At) => Ht + (At.uniqueCount ?? 0), 0),
          requestedRelayCount: _e.processedRanges.reduce((Ht, At) => Ht + (At.requestedRelayUrls?.length ?? 0), 0),
          eoseRelayCount: _e.processedRanges.reduce((Ht, At) => Ht + (At.eoseRelayUrls?.length ?? 0), 0)
        }
      }), (_e.timing?.primaryPersistAttemptCount ?? 0) > 0 && fo({
        phase: "primary-persist",
        startedAt: Ue,
        durationMs: _e.timing?.primaryPersistDurationMs ?? 0,
        counts: {
          persistedRangeCount: _e.timing?.primaryPersistAttemptCount ?? 0
        }
      }), !t() || _e.status === "cancelled") {
        Fe = null, a.currentViewRefetchStatus = "idle";
        return;
      }
      const Bt = Date.now();
      We = Bt;
      try {
        await ko(v, Y, _e.processedRanges), fo({
          phase: "visible-range-state",
          startedAt: Bt,
          counts: { processedRangeCount: _e.processedRangeCount }
        });
      } catch (Ht) {
        throw q = "visible-range-state", fo({
          phase: "visible-range-state",
          startedAt: Bt,
          error: Ht,
          counts: { processedRangeCount: _e.processedRangeCount }
        }), Ht;
      }
      const xn = Date.now();
      We = xn;
      try {
        a.searchQuery ? await Ft(a.searchPage, a.searchQuery) : a.loadedPosts.length === 0 || !a.hasNewerLocal ? await Se({ skipTotalCountRefresh: !0 }) : await De({ skipTotalCountRefresh: !0 }), fo({
          phase: "visible-window-reload",
          startedAt: xn,
          counts: { processedRangeCount: _e.processedRangeCount }
        });
      } catch (Ht) {
        throw q = "visible-window-reload", fo({
          phase: "visible-window-reload",
          startedAt: xn,
          error: Ht,
          counts: { processedRangeCount: _e.processedRangeCount }
        }), Ht;
      }
      Te = !0;
      let ze = null;
      if (Fe === ge && t() && e() === v && n() === b && a.loadedPosts.length > 0) {
        const Ht = Date.now();
        if (We = Ht, ze = await je.repairCurrentView({
          ownerPubkeyHex: v,
          rxNostr: b,
          visiblePosts: a.loadedPosts,
          isActive: () => Fe === ge && t() && e() === v && n() === b
        }), Fe !== ge || ze.status === "cancelled" || !t())
          return;
        fo({
          phase: "relation-repair",
          startedAt: Ht,
          durationMs: ze.relationRepairDurationMs ?? (ze.failurePhase === "relation-repair" ? ze.failureDurationMs : void 0),
          errorClass: ze.failurePhase === "relation-repair" ? ze.failureErrorClass : void 0,
          counts: {
            savedDirectReplyCount: ze.savedDirectReplyCount
          }
        }), (typeof ze.badgeRefreshDurationMs == "number" || ze.failurePhase === "badge-refresh") && fo({
          phase: "badge-refresh",
          startedAt: Ht,
          durationMs: ze.badgeRefreshDurationMs ?? ze.failureDurationMs,
          errorClass: ze.failurePhase === "badge-refresh" ? ze.failureErrorClass : void 0
        });
      }
      if (Fe !== ge || !t() || e() !== v || n() !== b)
        return;
      a.searchQuery || $({ force: !0 }), Fe = null, a.currentViewRefetchStatus = "idle", _e.addedCount > 0 ? (a.currentViewRefetchMessageKey = "postHistory.repairAdded", a.currentViewRefetchMessageValues = {
        count: _e.addedCount,
        processedRangeCount: _e.processedRangeCount,
        updatedCount: _e.updatedCount
      }) : (ze?.savedDirectReplyCount ?? 0) > 0 ? (a.currentViewRefetchMessageKey = "postHistory.repairChildInteractionsAdded", a.currentViewRefetchMessageValues = {
        count: ze?.savedDirectReplyCount ?? 0
      }) : _e.fetchFailed ? (a.currentViewRefetchMessageKey = "postHistory.repairFetchFailed", a.currentViewRefetchMessageValues = null) : (a.currentViewRefetchMessageKey = "postHistory.repairNoChanges", a.currentViewRefetchMessageValues = {
        processedRangeCount: _e.processedRangeCount,
        updatedCount: _e.updatedCount
      }), An();
    } catch (_e) {
      if (Fe !== ge)
        return;
      const Bt = typeof _e == "object" && _e !== null ? _e.phase : void 0, xn = typeof _e == "object" && _e !== null && typeof _e.phaseStartedAt == "number" ? _e.phaseStartedAt : We, ze = typeof _e == "object" && _e !== null && typeof _e.errorClass == "string" ? _e.errorClass : void 0;
      q || fo({
        phase: q ?? (Bt === "primary-fetch" || Bt === "primary-persist" ? Bt : Te ? "relation-repair" : "primary-fetch"),
        startedAt: xn,
        error: _e,
        errorClass: ze
      }), Te && !a.searchQuery && t() && e() === v && n() === b && $({ force: !0 }), Fe = null, a.currentViewRefetchStatus = "idle", a.currentViewRefetchMessageKey = Te ? "postHistory.repairNoChanges" : "postHistory.repairFetchFailed", a.currentViewRefetchMessageValues = null, An();
    }
  }
  async function ga() {
    const v = e();
    return v ? (Lt(), xr(), (await Promise.allSettled([
      ct.deleteLocalHistoryForPubkey(v),
      Ds.clearForPubkey(v),
      us.clearForPubkey(v)
    ])).some((E) => E.status === "rejected") ? (t() && e() === v && (y(), l({ known: a.totalCountKnown, status: "failed" })), Ke(), a.currentViewRefetchMessageKey = "postHistory.deleteLocalHistoryFailed", a.currentViewRefetchMessageValues = null, !1) : (ic(v), vm(v), go(), a.currentViewRefetchMessageKey = "postHistory.deleteLocalHistorySuccess", a.currentViewRefetchMessageValues = null, sc(v, {
      currentPage: 1,
      searchPage: 1,
      searchInput: "",
      searchQuery: ""
    }), Zi(v, {
      ...vi,
      totalCount: 0,
      totalCountKnown: !0,
      totalCountFailed: !1
    }), !0)) : !1;
  }
  async function Lo() {
    Ye();
    const v = e(), b = z(a.loadedPosts[0]);
    if (!v || !b || typeof a.visibleUntil != "number")
      return !1;
    const E = ++k, q = await ct.getSparseChunk({
      pubkeyHex: v,
      visibleUntil: a.visibleUntil,
      cursor: b,
      direction: "newer",
      limit: f
    });
    if (!t() || E !== k)
      return !1;
    if (q.length === 0)
      return a.hasNewerLocal = !1, !1;
    const Y = ce([...q, ...a.loadedPosts]);
    return a.loadedPosts = Y, await le(v, Y, E), !0;
  }
  async function pa() {
    if (Ye(), !!e()) {
      if (a.searchQuery) {
        await Ft(a.searchPage, a.searchQuery);
        return;
      }
      if (a.sparseSource === "saved") {
        const v = e();
        if (!v) return;
        const b = await Dn(v);
        $({ force: !0 }), await le(v), await U(v, b);
        return;
      }
      await Se({ forceTotalCount: !0 });
    }
  }
  function as(v, b, E) {
    const q = (Y) => Y.map((se) => se.eventId === v ? { ...se, deletedAt: b, deletionEventId: E } : se);
    a.loadedPosts = q(a.loadedPosts), a.searchPosts = q(a.searchPosts);
  }
  function Xo(v) {
    const b = e(), E = Xr(b);
    if (!b || !E)
      return;
    const q = ++ve;
    g(re, "loading"), v().then(() => {
      t() && e() === b && Pe === E && q === ve && g(re, "ready");
    }).catch(() => {
      t() && e() === b && Pe === E && q === ve && g(re, "failed");
    });
  }
  return Ge(() => {
    const v = Xr(e());
    v !== de && (de = v, rn(), g(j, null), ne = v, Lt(), xr(), kr(), fr(), Ke(), Kn(), Cn(), je.resetOlderRevealRepairContext(), Ee = !1, $e = !1, Pe = null, ve += 1, g(re, "idle"));
  }), Ge(() => {
    const v = n();
    v !== G && (G = v, je.resetOlderRevealRepairContext());
  }), Ge(() => {
    Sr();
  }), Ge(() => {
    vo();
  }), Ge(() => {
    t() || Hr();
  }), Ge(() => {
    if (t())
      return () => {
        Lt();
      };
  }), Ge(() => () => {
    je.dispose();
  }), Ge(() => {
    if (!t()) {
      Kn();
      return;
    }
    return On(), () => {
      Kn();
    };
  }), Ge(() => {
    if (!t())
      return;
    const v = a.searchInput.trim();
    v !== a.searchQuery && g(ke, "loading");
    const b = setTimeout(
      () => {
        a.searchQuery = v;
      },
      m
    );
    return () => {
      clearTimeout(b);
    };
  }), Ge(() => {
    if (!t() || r(ie))
      return;
    const v = Xr(e()) ?? "";
    if ($e && Pe === v)
      return;
    if ($e = !0, Pe = v, ne === v) {
      ne = null, Xo(Se);
      return;
    }
    const b = pt(), E = Xh(e());
    if (Ne(E, b)) {
      s(), Xo(Se);
      return;
    }
    if (yt(b)) {
      Xo(() => Be(b, E));
      return;
    }
    if (b) {
      Xo(() => Et(b));
      return;
    }
    Xo(Se);
  }), Ge(() => {
    t() || rn();
  }), Ge(() => {
    if (!t() || !r(V) || r(oe) !== Xr(e()))
      return;
    const v = r(Ze);
    if (v.length === 0 || !_d.canUsePersistentCache())
      return;
    const b = ef(v);
    if (b.length === 0)
      return;
    const E = [...b].sort().join("\0");
    E !== _ && (_ = E, Promise.resolve(_d.prefetchCachedMediaDescriptors(b)).catch(() => {
    }));
  }), ys(() => {
    k += 1, he += 1, ve += 1, cs.clearCache?.(), g(re, "idle"), g(oe, null), g(V, !1);
  }), Ge(() => {
    if (t()) {
      if (!a.searchQuery) {
        const v = ue !== "";
        if (rn(), he += 1, g(me, !1), g(ke, "idle"), cs.clearCache?.(), ue = "", B = !1, a.searchPage !== 1) {
          if (a.searchPage = 1, v) {
            const b = e();
            b && un(b, () => nn(b, k), () => a.loadedPosts.length > 0);
          }
          return;
        }
        if (a.searchPosts = [], a.searchTotalCount = 0, a.searchTotalCountKnown = !1, a.searchHasNext = !1, v) {
          const b = e();
          b && un(b, () => nn(b, k), () => a.loadedPosts.length > 0);
        }
        return;
      }
      if (a.searchQuery !== ue) {
        rn(), ue === "" && a.searchPosts.length === 0 && (a.searchPosts = a.loadedPosts), ue = a.searchQuery, a.searchPage = 1, B = !0, kn(1, a.searchQuery);
        return;
      }
      if (ue = a.searchQuery, !B) {
        B = !0;
        const v = e(), b = a.searchQuery, E = ++he, q = a.searchPosts.length > 0;
        v && q && un(v, () => Qe(E, b, v), () => a.searchPosts.length > 0), Ft(a.searchPage, b, E);
      }
    }
  }), {
    state: a,
    get isSearchMode() {
      return r(ie);
    },
    get posts() {
      return r(Ze);
    },
    get displayTotalCount() {
      return r(Ct);
    },
    get displayTotalCountKnown() {
      return r(ie) ? a.searchTotalCountKnown : a.totalCountKnown;
    },
    get displayTotalCountStatus() {
      return r(ie) ? a.searchTotalCountKnown ? "ready" : r(ke) === "failed" ? "failed" : "loading" : a.totalCountStatus;
    },
    get displayPage() {
      return r(bt);
    },
    get totalPages() {
      return r(_t);
    },
    get canGoPrevious() {
      return r(ln);
    },
    get canGoFirst() {
      return r(Xe);
    },
    get canGoNext() {
      return r(ut);
    },
    get canGoLast() {
      return r(it);
    },
    get showPaging() {
      return r(X);
    },
    get canLoadOlder() {
      return r(nt);
    },
    get canLoadNewer() {
      return r(St);
    },
    get canReturnToLatest() {
      return r(dn);
    },
    get canJumpToOldest() {
      return r(Yt);
    },
    get canFetchOlderFromRelays() {
      return r(et);
    },
    get isFetchingOlderFromRelays() {
      return r(wt);
    },
    get isFetchingFromRelays() {
      return r(rt);
    },
    get isRefetchingAroundCurrentView() {
      return r(qe);
    },
    get showLocalExhaustedState() {
      return r(en);
    },
    get showSavedPostsBoundary() {
      return r(gt);
    },
    get isShowingSavedOlderPosts() {
      return a.listingMode === "sparse" && a.sparseSource === "saved";
    },
    get visibleNewestCreatedAt() {
      return r(jn);
    },
    get visibleOldestCreatedAt() {
      return r(vt);
    },
    get visiblePostCount() {
      return r(Pt);
    },
    get latestOlderBackfillUiResult() {
      return a.latestOlderBackfillUiResult;
    },
    get syncStatus() {
      return a.syncStatus;
    },
    get syncStatusMessageKey() {
      return r(cn);
    },
    get showSyncLoader() {
      return r(Rt);
    },
    get showStatusLoader() {
      return r($t);
    },
    get isSearchPageLoading() {
      return r(me);
    },
    get searchResultStatus() {
      return r(ke);
    },
    get initialLocalLoadStatus() {
      return r(re);
    },
    get canRefetchAroundCurrentView() {
      return r(Qt);
    },
    get currentViewRefetchStatusMessageKey() {
      return r(It);
    },
    get currentViewRefetchStatusMessageValues() {
      return r(bn);
    },
    prepareForClose: no,
    cancelCurrentSync: Lt,
    cancelCurrentViewRefetch: xr,
    loadOlder: $a,
    loadNewer: Zo,
    returnToLatest: Oo,
    showSavedOlderPosts: va,
    jumpToOldest: rs,
    jumpToCreatedAt: Rr,
    jumpToEventId: zr,
    fetchOlderFromRelays: Ba,
    goFirstPage: Jo,
    goPreviousPage: Na,
    goToNextPage: Go,
    goToLastPage: ns,
    refetchAroundCurrentView: os,
    resetSearchState: Pn,
    refreshAfterLocalImport: pa,
    deleteLocalHistory: ga,
    patchDeletedPost: as
  };
}
const Ns = /* @__PURE__ */ new Map();
function Cd(t) {
  if (typeof t != "string")
    return null;
  const e = t.trim();
  return e.length > 0 ? e : null;
}
function sh(t) {
  return typeof t == "string" ? t.trim() : "";
}
function Pd(t) {
  const e = Cd(t.pubkeyHex);
  if (!e)
    return null;
  const n = t.mode === "search" ? sh(t.searchQuery) : "";
  return `${e}:${t.mode}:${n}`;
}
function pm(t) {
  const e = Pd(t);
  if (!e)
    return null;
  const n = Ns.get(e);
  return n ? {
    ...n,
    anchor: { ...n.anchor }
  } : null;
}
function ym(t) {
  const e = Pd(t), n = Cd(t.pubkeyHex);
  !e || !n || Ns.set(e, {
    pubkeyHex: n,
    mode: t.mode,
    searchQuery: t.mode === "search" ? sh(t.searchQuery) : "",
    anchor: { ...t.anchor },
    savedAt: t.savedAt ?? Date.now()
  });
}
function vc(t) {
  const e = Cd(t.pubkeyHex);
  if (e) {
    if (t.mode) {
      const n = Pd({
        pubkeyHex: e,
        mode: t.mode,
        searchQuery: t.searchQuery
      });
      n && Ns.delete(n);
      return;
    }
    for (const n of Ns.keys())
      n.startsWith(`${e}:`) && Ns.delete(n);
  }
}
const Ms = 1, ih = 2, mm = 12;
function gc(t, e, n, o) {
  return (t === "older" ? e : n) + ih >= o;
}
function bm(t) {
  return `${t.pubkeyHex}:${t.mode}:${t.searchQuery}:${t.anchor.eventId}:${t.savedAt}`;
}
function Cm({
  getShow: t,
  getPubkeyHex: e,
  getPosts: n,
  getLocale: o,
  getContainer: i,
  getIsSearchMode: s,
  getSearchQuery: d
}) {
  let h = be(null), u = be(!0), I = be(!0), f = null, m = be(null), w = !1, P = null;
  function T() {
    return s() ? "search" : "normal";
  }
  function p() {
    return s() ? d() : "";
  }
  function x() {
    return pm({
      pubkeyHex: e(),
      mode: T(),
      searchQuery: p()
    });
  }
  function a(L) {
    return !!L && n().some((G) => G.eventId === L.anchor.eventId);
  }
  function k() {
    const L = j();
    L && ym({
      pubkeyHex: e(),
      mode: T(),
      searchQuery: p(),
      anchor: L
    });
  }
  function Z() {
    vc({
      pubkeyHex: e(),
      mode: T(),
      searchQuery: p()
    }), g(m, null), P = null;
  }
  function V() {
    vc({ pubkeyHex: e() }), g(m, null), P = null;
  }
  function oe() {
    const L = i();
    L && (L.scrollTop = 0, ee(), fe(), $e());
  }
  function _() {
    const L = i();
    L && (L.scrollTop = L.scrollHeight, ee(), fe(), $e());
  }
  function ee() {
    const L = i();
    if (!L) {
      g(u, !0);
      return;
    }
    g(u, L.scrollTop <= Ms);
  }
  function fe() {
    const L = i();
    if (!L) {
      g(I, !0);
      return;
    }
    const G = L.scrollHeight - L.clientHeight - L.scrollTop;
    g(I, G <= ih);
  }
  function he() {
    const L = i();
    if (!L)
      return null;
    const G = L.getBoundingClientRect(), ue = G.top + mm, B = Array.from(L.querySelectorAll("[data-post-history-event-id]"));
    let Ae = 0, ae = B.length;
    const je = G.top + Ms;
    for (; Ae < ae; ) {
      const qe = Math.floor((Ae + ae) / 2);
      B[qe].getBoundingClientRect().bottom > je ? ae = qe : Ae = qe + 1;
    }
    let ie = null;
    for (let qe = Ae; qe < B.length; qe += 1) {
      const Ze = B[qe], bt = Ze.getBoundingClientRect();
      if (bt.top >= G.bottom - Ms)
        break;
      const Ct = Number(Ze.dataset.postHistoryPostedAt);
      if (Number.isFinite(Ct)) {
        if (bt.top <= ue && bt.bottom > ue)
          return Ct;
        ie === null && (ie = Ct);
      }
    }
    return ie;
  }
  function me() {
    if (!t() || n().length === 0) {
      g(h, null);
      return;
    }
    const L = he();
    g(
      h,
      L === null ? null : lf(L, o()),
      !0
    );
  }
  function ke() {
    Ee(), me(), S();
  }
  function Ee() {
    f !== null && (cancelAnimationFrame(f), f = null);
  }
  function $e() {
    t() && (Ee(), f = requestAnimationFrame(() => {
      f = null, me();
    }));
  }
  function Pe() {
    if (ee(), fe(), r(I)) {
      ke();
      return;
    }
    $e();
  }
  function re() {
    Bo().then(() => {
      t() && oe();
    });
  }
  function ve() {
    Bo().then(() => {
      t() && _();
    });
  }
  function de(L) {
    Bo().then(() => {
      t() && ne({ eventId: L, offsetTop: 0 });
    });
  }
  function j() {
    const L = i();
    if (!L)
      return null;
    const G = L.getBoundingClientRect(), ue = Array.from(L.querySelectorAll("[data-post-history-event-id]"));
    for (const B of ue) {
      const Ae = B.dataset.postHistoryEventId;
      if (!Ae)
        continue;
      const ae = B.getBoundingClientRect();
      if (ae.bottom > G.top + Ms && ae.top < G.bottom - Ms)
        return { eventId: Ae, offsetTop: ae.top - G.top };
    }
    return null;
  }
  function ne(L, G = {}) {
    const ue = i();
    if (!L || !t() || !ue)
      return !1;
    G.flushUpdates !== !1 && S();
    const B = Array.from(ue.querySelectorAll("[data-post-history-event-id]")).find((ie) => ie.dataset.postHistoryEventId === L.eventId);
    if (!B)
      return !1;
    const Ae = ue.getBoundingClientRect(), je = B.getBoundingClientRect().top - Ae.top;
    return ue.scrollTop += je - L.offsetTop, $e(), !0;
  }
  function xe(L, G, ue) {
    const B = i();
    if (!B || G.length === 0)
      return !1;
    const Ae = new Set(ue.map((Xe) => Xe.eventId)), ae = new Map(Array.from(B.querySelectorAll(".post-history-item"), (Xe) => [Xe.dataset.postHistoryEventId, Xe])), je = G.map((Xe) => ({ post: Xe, element: ae.get(Xe.eventId) ?? null }));
    if (je.some(({ element: Xe }) => !Xe))
      return !1;
    if (L === "older") {
      const Xe = je.find(({ post: nt }) => Ae.has(nt.eventId));
      if (!Xe?.element)
        return !1;
      if (Xe.post.eventId === G[0]?.eventId)
        return !0;
      const ut = je[0]?.element?.getBoundingClientRect(), it = Xe.element.getBoundingClientRect();
      if (!ut || !it)
        return !1;
      const X = it.top - ut.top;
      return gc("older", B.scrollTop, 0, X);
    }
    let ie = -1;
    for (let Xe = 0; Xe < je.length; Xe += 1) {
      const ut = je[Xe];
      ut && Ae.has(ut.post.eventId) && (ie = Xe);
    }
    if (ie < 0 || ie === je.length - 1)
      return ie >= 0;
    const qe = je[ie]?.element, Ze = je.at(-1)?.element;
    if (!qe || !Ze)
      return !1;
    const bt = qe.getBoundingClientRect(), _t = Ze.getBoundingClientRect().bottom - bt.bottom, ln = B.scrollHeight - B.clientHeight - B.scrollTop;
    return gc("newer", 0, ln, _t);
  }
  function Le(L, G) {
    const ue = i();
    return ue ? Array.from(ue.querySelectorAll("[data-post-history-thread-anchor-event-id]")).find((B) => B.dataset.postHistoryThreadAnchorScopeId === L && B.dataset.postHistoryThreadAnchorEventId === G) ?? null : null;
  }
  function Fe(L, G) {
    const ue = Le(L, G);
    return ue ? {
      scopeEventId: L,
      eventId: G,
      top: ue.getBoundingClientRect().top
    } : null;
  }
  function D(L) {
    const G = i();
    if (!L || !t() || !G)
      return !1;
    S();
    const ue = Le(L.scopeEventId, L.eventId);
    if (!ue)
      return !1;
    const B = ue.getBoundingClientRect().top - L.top;
    return Math.abs(B) < 0.5 || (G.scrollTop += B, $e(), ee(), fe()), !0;
  }
  async function J(L, G, ue) {
    const B = Fe(L, G), Ae = ue();
    await Bo(), D(B), await Ae, await Bo(), D(B);
  }
  return Ge(() => {
    if (!t()) {
      w = !1, g(m, null), P = null, g(h, null), Ee();
      return;
    }
    w || (w = !0, g(m, x(), !0), P = null);
  }), Ge(() => {
    if (!t() || !a(r(m)))
      return;
    const L = r(m), G = bm(L);
    P !== G && Bo().then(() => {
      !t() || r(m) !== L || (ne(L.anchor), P = G, g(m, null));
    });
  }), Ge(() => {
    if (!t()) {
      g(h, null), Ee();
      return;
    }
    return i(), n(), o(), Bo().then(() => {
      t() && (me(), ee(), fe());
    }), () => {
      Ee();
    };
  }), {
    get currentMonthLabel() {
      return r(h);
    },
    get isHistoryScrolledToTop() {
      return r(u);
    },
    get isHistoryScrolledToBottom() {
      return r(I);
    },
    readCurrentSessionScrollState: x,
    saveCurrentSessionScrollAnchor: k,
    clearCurrentSessionScrollAnchor: Z,
    clearAllSessionScrollAnchorsForCurrentPubkey: V,
    handleHistoryScroll: Pe,
    resetHistoryScrollSoon: re,
    resetHistoryScrollToBottomSoon: ve,
    scrollHistoryEventToTopSoon: de,
    captureHistoryScrollAnchor: j,
    canCommitAutoLoadWindowChange: xe,
    restoreHistoryScrollAnchor: ne,
    preserveThreadParentToggleScroll: J
  };
}
const pc = 100, Pm = 86400, wm = 6e3, yc = 8;
function xm(t) {
  return Number.isFinite(t) ? Math.max(1, Math.trunc(t ?? pc)) : pc;
}
function Sm(t) {
  return Array.from(t.values()).map((e) => ({
    parentEventId: e.parentEventId,
    event: e.event,
    relayUrls: Array.from(e.relayUrls).sort((n, o) => n.localeCompare(o))
  })).sort((e, n) => e.event.created_at !== n.event.created_at ? e.event.created_at - n.event.created_at : e.event.id.localeCompare(n.event.id));
}
function Rm(t) {
  if (t.parents) {
    const n = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Set();
    for (const i of t.parents) {
      if (!i.eventId || o.has(i.eventId))
        continue;
      const s = n.get(i.eventId);
      if (s && (s.eventKind !== i.eventKind || s.createdAt !== i.createdAt || s.channelEventId && i.channelEventId && s.channelEventId !== i.channelEventId)) {
        n.delete(i.eventId), o.add(i.eventId);
        continue;
      }
      n.set(i.eventId, {
        ...i,
        channelEventId: i.channelEventId ?? s?.channelEventId ?? null,
        relayHints: Array.from(/* @__PURE__ */ new Set([
          ...s?.relayHints ?? [],
          ...i.relayHints
        ]))
      });
    }
    return Array.from(n.values());
  }
  const e = t.eventIds && t.eventIds.length > 0 ? t.eventIds : [t.eventId];
  return Array.from(new Set(e.filter((n) => !!n))).map((n) => ({
    eventId: n,
    eventKind: 1,
    channelEventId: null,
    createdAt: t.createdAt,
    relayHints: t.relayHints ?? []
  }));
}
class Im {
  console;
  setTimeoutFn;
  clearTimeoutFn;
  now;
  constructor(e = {}) {
    this.console = e.console ?? (typeof console < "u" ? console : { log: () => {
    }, warn: () => {
    }, error: () => {
    } }), this.setTimeoutFn = e.setTimeoutFn ?? ((n, o) => setTimeout(n, o)), this.clearTimeoutFn = e.clearTimeoutFn ?? ((n) => clearTimeout(n)), this.now = e.now ?? Date.now;
  }
  fetchDirectReplies(e, n) {
    const o = df(), i = Rm(n), s = new Map(i.map((Z) => [Z.eventId, Z])), d = i.map((Z) => Z.eventId), h = this.resolveRelayUrls(
      [
        ...n.relayHints ?? [],
        ...i.flatMap((Z) => Z.relayHints)
      ],
      n.relayConfig,
      n.relayLimit
    ), u = xm(n.limit), I = Math.max(
      0,
      Math.trunc(Math.min(...i.map((Z) => Z.createdAt))) - Pm
    ), f = /* @__PURE__ */ new Map();
    let m = !1, w, P, T;
    const p = () => {
      P !== void 0 && (this.clearTimeoutFn(P), P = void 0), w?.unsubscribe?.(), w = void 0;
    }, x = (Z) => ({
      status: Z === "failed" && f.size > 0 ? "partial" : Z,
      events: Sm(f),
      fetchedAt: this.now(),
      relayUrls: h
    }), a = (Z) => (V) => {
      m || (m = !0, p(), Z(x(V)));
    };
    return {
      promise: new Promise((Z) => {
        const V = a(Z);
        T = V;
        try {
          if (d.length === 0) {
            V("success");
            return;
          }
          w = cf(e, o, {
            on: h.length > 0 ? { relays: h } : { defaultReadRelays: !0 }
          }).subscribe({
            next: (_) => {
              this.handlePacket(f, s, _);
            },
            complete: () => V("success"),
            error: (_) => {
              this.console.error("post_history_reply_fetch_error", _), V("failed");
            }
          });
          const oe = Array.from(new Set(i.flatMap((_) => _.eventKind === 42 ? [42] : _.eventKind === 1 ? [1, 1111] : _.eventKind === 1111 ? [1111] : []))).sort();
          o.emit({
            kinds: oe,
            "#e": d,
            since: I,
            limit: u
          }), o.over(), P = this.setTimeoutFn(() => {
            this.console.warn("post_history_reply_fetch_timeout", d.join(",")), V("failed");
          }, n.timeoutMs ?? wm);
        } catch (oe) {
          this.console.error("post_history_reply_fetch_request_error", oe), V("failed");
        }
      }),
      cancel: () => {
        T?.("cancelled");
      }
    };
  }
  handlePacket(e, n, o) {
    const i = o.event;
    if (!i?.id || ![1, 42, 1111].includes(i.kind))
      return;
    const s = _a(i).parentId, d = s ? n.get(s) : null;
    if (!d || !za({ child: i, parent: d }).valid)
      return;
    const h = So.sanitizeExternalRelayUrls(
      typeof o.from == "string" ? [o.from] : [],
      { limit: 1 }
    )[0], u = e.get(i.id);
    if (!u) {
      e.set(i.id, {
        parentEventId: d.eventId,
        event: i,
        relayUrls: new Set(h ? [h] : [])
      });
      return;
    }
    if (!Mf(u.event, i)) {
      this.console.warn("post_history_reply_fetch_packet_conflict", i.id);
      return;
    }
    h && u.relayUrls.add(h);
  }
  resolveRelayUrls(e, n, o) {
    const i = Number.isFinite(o) ? Math.max(1, Math.trunc(o ?? yc)) : yc, s = uf(e, i);
    if (s)
      return s;
    const d = n ? [
      ...So.extractReadRelays(n),
      ...So.extractWriteRelays(n)
    ] : [], h = So.sanitizeExternalRelayUrls([
      ...e ?? [],
      ...d
    ], { limit: i });
    return h.length > 0 ? h : So.sanitizeExternalRelayUrls(
      Tf,
      { limit: i }
    );
  }
}
const _m = new Im(), Em = "postHistoryDirectReplyFetchMetadata:", lh = 1;
function Zs(t) {
  return Em + t;
}
function gi(t) {
  return typeof t == "number" && Number.isFinite(t);
}
function mc(t) {
  if (!t || typeof t != "object")
    return !1;
  const e = t;
  return typeof e.parentEventId == "string" && (e.completeness === "complete" || e.completeness === "partial") && gi(e.fetchedAt) && gi(e.requestStartedAt) && e.schemaVersion === lh;
}
function Am(t, e) {
  return t ? t.requestStartedAt > e.requestStartedAt ? !0 : t.requestStartedAt === e.requestStartedAt && t.completeness === "complete" && e.completeness === "partial" : !1;
}
class Dm {
  constructor(e = Rl, n = Date.now) {
    this.db = e, this.now = n;
  }
  async get(e) {
    if (!e)
      return null;
    const n = await this.db.meta.get(Zs(e));
    return !n || !mc(n.value) ? null : {
      ...n.value,
      updatedAt: n.updatedAt
    };
  }
  async getForParentEventIds(e) {
    const n = Array.from(
      new Set(e.filter((i) => !!i))
    );
    return n.length === 0 ? [] : (await this.db.meta.bulkGet(
      n.map(
        (i) => Zs(i)
      )
    )).flatMap((i) => !i || !mc(i.value) ? [] : [{
      ...i.value,
      updatedAt: i.updatedAt
    }]);
  }
  async save(e) {
    return !e.parentEventId || !gi(e.fetchedAt) || !gi(e.requestStartedAt) ? null : this.db.transaction("rw", this.db.meta, async () => {
      const n = await this.get(e.parentEventId);
      if (Am(n, e))
        return n;
      const o = this.now(), i = {
        parentEventId: e.parentEventId,
        completeness: e.completeness,
        fetchedAt: e.fetchedAt,
        requestStartedAt: e.requestStartedAt,
        schemaVersion: lh
      };
      return await this.db.meta.put({
        key: Zs(e.parentEventId),
        value: i,
        updatedAt: o
      }), {
        ...i,
        updatedAt: o
      };
    });
  }
  async clear(e) {
    e && await this.db.meta.delete(Zs(e));
  }
}
const km = new Dm(), ml = {
  totalCount: 0,
  groups: []
};
function Mm(t) {
  if (!hf(t.content))
    return;
  const e = ff(t.content);
  if (e)
    return vf(t.tags ?? []).get(e)?.url;
}
function Tm(t) {
  if (t.length === 0)
    return ml;
  const e = [], n = /* @__PURE__ */ new Map();
  let o = 0;
  for (const i of t) {
    if (i.kind !== 7)
      continue;
    o += 1;
    const s = Mm(i), d = n.get(i.content);
    if (d === void 0) {
      n.set(i.content, e.length), e.push(
        s ? {
          content: i.content,
          count: 1,
          emojiUrl: s
        } : {
          content: i.content,
          count: 1
        }
      );
      continue;
    }
    const h = e[d], u = h.emojiUrl ?? s;
    e[d] = {
      ...h,
      count: h.count + 1,
      ...u ? { emojiUrl: u } : {}
    };
  }
  return o === 0 ? ml : {
    totalCount: o,
    groups: e
  };
}
function Om() {
  let t = 0, e = 0;
  const n = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
  return {
    getRequestId() {
      return t;
    },
    incrementRequestId() {
      return t += 1, t;
    },
    createChildRequestToken(s) {
      return e += 1, n.set(s, e), e;
    },
    getChildRequestToken(s) {
      return n.get(s);
    },
    deleteChildRequestToken(s) {
      n.delete(s);
    },
    clearChildRequestTokens() {
      n.clear();
    },
    replaceChildrenFetchTask(s, d) {
      o.get(s)?.cancel(), o.set(s, d);
    },
    deleteChildrenFetchTask(s) {
      o.delete(s);
    },
    replaceDeletionFetchTask(s, d) {
      i.get(s)?.cancel(), i.set(s, d);
    },
    deleteDeletionFetchTask(s) {
      i.delete(s);
    },
    cancelAndClearFetchTasks() {
      o.forEach((s) => s.cancel()), i.forEach((s) => s.cancel()), o.clear(), i.clear();
    }
  };
}
function Lm(t = {}) {
  const e = t.setTimeoutFn ?? ((s, d) => setTimeout(s, d)), n = t.clearTimeoutFn ?? ((s) => clearTimeout(s)), o = /* @__PURE__ */ new Map();
  function i(s) {
    const d = o.get(s);
    d && (n(d), o.delete(s));
  }
  return {
    schedule(s, d, h = 400) {
      i(s);
      const u = e(() => {
        o.delete(s), d();
      }, h);
      o.set(s, u);
    },
    clear: i,
    clearAll() {
      o.forEach((s) => n(s)), o.clear();
    }
  };
}
function Fm(t, e) {
  return {
    ...t,
    loadingParent: e.showInitialLoading,
    revalidatingParent: !e.showInitialLoading,
    visibleParent: t.visibleParent || e.showInitialLoading,
    parentError: null,
    parentMissing: !1,
    parentDeleted: !1,
    showParentLoadingIndicator: !1
  };
}
function Qa(t, e = {}) {
  return {
    ...t,
    loadedParent: !0,
    visibleParent: e.visibleParent ?? t.visibleParent,
    loadingParent: !1,
    revalidatingParent: e.revalidatingParent ?? t.revalidatingParent,
    parentError: e.parentError ?? null,
    parentMissing: e.parentMissing ?? !1,
    parentDeleted: e.parentDeleted ?? !1,
    showParentLoadingIndicator: !1,
    lastFetchedParentAt: e.lastFetchedParentAt ?? t.lastFetchedParentAt
  };
}
function bc(t, e) {
  return {
    ...t,
    loadingChildren: e.showInitialLoading,
    revalidatingChildren: !e.showInitialLoading,
    visibleChildren: e.prefetchOnly ? t.visibleChildren : t.visibleChildren || e.showInitialLoading,
    childrenError: null
  };
}
function Fs(t, e = {}) {
  return {
    ...t,
    loadedChildren: e.loadedChildren ?? !0,
    visibleChildren: e.visibleChildren ?? t.visibleChildren,
    loadingChildren: !1,
    revalidatingChildren: e.revalidatingChildren ?? t.revalidatingChildren,
    childrenError: null,
    lastFetchedChildrenAt: e.lastFetchedChildrenAt !== void 0 ? e.lastFetchedChildrenAt : t.lastFetchedChildrenAt
  };
}
function pi(t, e) {
  return {
    ...t,
    loadingChildren: !1,
    revalidatingChildren: !1,
    visibleChildren: t.visibleChildren,
    childrenError: e.nextError
  };
}
function Hm(t) {
  return t.status === "deleted" ? "deleted" : t.status === "not-found" ? "not-found" : t.status === "resolved" && t.event ? "resolved" : "failed";
}
function Nm(t) {
  return t.nextRecordsLength > 0 ? "resolved" : t.resultEventsLength > 0 ? "deleted" : "not-found";
}
function $m(t) {
  return {
    deleted: () => {
      t.snapshot.authorPubkey && (t.hideEvent(t.snapshot.authorPubkey, t.parentEventId), t.markParentDeletedForEvent(
        t.parentEventId,
        t.snapshot.authorPubkey,
        { revealKnownParent: !0 }
      )), t.setParentDeleted();
    },
    "not-found": () => {
      t.updateExpansion((e) => ({
        ...Qa(e, {
          revalidatingParent: !1,
          parentMissing: t.showInitialLoading ? !0 : e.parentMissing,
          parentDeleted: !1,
          lastFetchedParentAt: t.snapshot.updatedAt ?? Date.now()
        })
      }));
    },
    resolved: () => {
      if (!t.snapshot.event)
        return;
      if (t.snapshot.authorPubkey && t.isDeletedEvent(t.snapshot.authorPubkey, t.parentEventId)) {
        t.setParentDeleted();
        return;
      }
      const e = t.upsertNode();
      t.upsertParentEdge(e.eventId, e.parentEventId), t.updateExpansion((n) => ({
        ...Qa(n, {
          revalidatingParent: !1,
          parentMissing: !1,
          parentDeleted: !1,
          lastFetchedParentAt: t.snapshot.updatedAt ?? Date.now()
        })
      }));
    },
    failed: () => {
      t.updateExpansion((e) => ({
        ...e,
        loadingParent: !1,
        revalidatingParent: !1,
        visibleParent: e.visibleParent,
        parentError: t.showInitialLoading ? t.snapshot.errorCode ?? "fetch_failed" : e.parentError,
        showParentLoadingIndicator: !1
      }));
    }
  };
}
function Bm(t) {
  const e = () => {
    t.updateExpansion((n) => ({
      ...Fs(n, {
        revalidatingChildren: !1,
        lastFetchedChildrenAt: t.fetchedAt
      })
    })), t.prefetchOnly || t.prefetchChildReplyCounts();
  };
  return {
    resolved: e,
    "not-found": e,
    deleted: e
  };
}
function qm(t) {
  t.updateExpansion((e) => ({
    ...e,
    loadingParent: !1,
    revalidatingParent: !1,
    visibleParent: e.visibleParent,
    parentError: t.showInitialLoading ? t.errorCode : e.parentError,
    showParentLoadingIndicator: !1
  }));
}
function dh(t) {
  t.updateExpansion((e) => ({
    ...pi(e, {
      nextError: t.showInitialLoading && !t.prefetchOnly ? t.errorCode ?? "fetch_failed" : e.childrenError
    })
  }));
}
function ch(t) {
  return typeof t.lastFetchedAt != "number" ? !0 : (t.now ?? Date.now()) - t.lastFetchedAt >= t.ttlMs;
}
function Um(t) {
  return !t.displayedCached || t.force ? !1 : !ch({
    lastFetchedAt: t.lastFetchedAt,
    ttlMs: t.ttlMs,
    now: t.now
  });
}
function Vm(t) {
  const e = Um(t);
  return {
    skipRevalidate: e,
    shouldShowInitialLoading: !t.displayedCached,
    shouldPrefetchReplyCountsOnSkip: e && !t.prefetchOnly
  };
}
function jm(t) {
  return !t.loading && !t.revalidating ? !1 : (t.onInFlight(), t.loading && t.onLoadingInFlight?.(), !0);
}
function Cc(t) {
  return t.hasVisibleData ? ch({
    lastFetchedAt: t.lastFetchedAt,
    ttlMs: t.ttlMs,
    now: t.now
  }) : !1;
}
async function Pc(t) {
  let e = !1;
  const n = () => {
    const o = t.isActive();
    return !o && !e && (e = !0, t.onInactive?.()), o;
  };
  try {
    await t.run({ ensureActive: n });
  } catch (o) {
    n() && await t.onError?.(o);
  } finally {
    t.cleanup?.();
  }
}
async function wc(t) {
  let e = !1;
  const n = () => {
    const i = t.isActive();
    return !i && !e && (e = !0, t.onInactive?.()), i;
  }, o = /* @__PURE__ */ new Map();
  if (t.prepareItem)
    for (const i of t.items)
      o.set(i, t.prepareItem(i));
  try {
    await t.run({ ensureActive: n }), n() && t.completeBatch?.(!0);
  } catch (i) {
    n() && (t.completeBatch?.(!1), await t.onError?.(i));
  } finally {
    if (t.cleanupItem)
      for (const i of t.items)
        o.has(i) && t.cleanupItem(i, o.get(i));
    t.cleanup?.();
  }
}
async function xc(t) {
  const e = t.strategies[t.status] ?? t.fallback;
  e && await e();
}
async function Km(t) {
  if (t.skipRevalidate)
    return;
  const e = t.runRevalidate({
    showInitialLoading: t.shouldShowInitialLoading
  });
  t.awaitWhenInitialLoading && t.shouldShowInitialLoading && await e;
}
async function Ym(t) {
  const e = Vm(t);
  return e.shouldPrefetchReplyCountsOnSkip && t.onSkipPrefetchReplyCounts?.(), await Km({
    skipRevalidate: e.skipRevalidate,
    shouldShowInitialLoading: e.shouldShowInitialLoading,
    awaitWhenInitialLoading: t.awaitWhenInitialLoading,
    runRevalidate: t.runRevalidate
  }), e;
}
async function Sc(t) {
  if (jm({
    loading: t.loading,
    revalidating: t.revalidating,
    onInFlight: t.onInFlight,
    onLoadingInFlight: t.onLoadingInFlight
  }) || t.shouldHandleLoadedState && await t.handleLoadedState())
    return;
  t.prepareFreshLoadState();
  const e = await t.displayCachedForFreshLoad();
  await Ym({
    displayedCached: e.displayedCached,
    force: t.force,
    lastFetchedAt: e.lastFetchedAt,
    ttlMs: t.ttlMs,
    prefetchOnly: t.prefetchOnly,
    now: t.now,
    awaitWhenInitialLoading: t.awaitWhenInitialLoading,
    onSkipPrefetchReplyCounts: t.onSkipPrefetchReplyCounts,
    runRevalidate: t.runRevalidate
  });
}
function $o(t) {
  return So.sanitizeExternalRelayUrls(t, { limit: 8 });
}
function Rc(t) {
  return Array.from(new Set(t));
}
const Qm = 20, zm = 12, Wm = 2, Ic = 4, Jm = 4, _c = 300 * 1e3;
class uh extends Error {
}
function Ec(t) {
  if (t === "failed")
    throw new Error("post_history_reply_fetch_failed");
  if (t === "cancelled")
    throw new uh();
}
function Gm(t) {
  return (e) => {
    if (e instanceof uh) {
      t.updateExpansion((n) => ({
        ...pi(n, { nextError: n.childrenError })
      }));
      return;
    }
    dh({ ...t, errorCode: "fetch_failed" });
  };
}
function Ac(t) {
  return t === "partial" ? "partial" : "complete";
}
function Xi(t) {
  return t?.completeness === "complete" ? t.fetchedAt : null;
}
const Xs = 300 * 1e3;
let Zm = 0;
function Xm(t, e) {
  const n = new Set(t.map((o) => o.eventId));
  return (e && e.length > 0 ? Array.from(new Set(e)) : Array.from(n)).filter((o) => n.has(o));
}
function Dc(t) {
  const e = Sa({
    event: t.parentNode.event,
    relayHints: t.parentNode.relayUrls
  });
  return !!e && za({
    child: Os(t.record),
    parent: e
  }).valid;
}
function kc(t) {
  if (!t.parentNode)
    return null;
  const e = Sa({
    event: t.parentNode.event,
    relayHints: t.parentNode.relayUrls
  });
  return e && za({ child: t.childNode.event, parent: e }).valid ? t.parentNode : null;
}
function eb({
  getShow: t,
  getPubkeyHex: e,
  getRxNostr: n,
  getRelayConfig: o,
  postHistoryRepositoryImpl: i = ct,
  directReplyRecordsAdapterImpl: s = gf,
  reactionRecordsAdapterImpl: d = pf,
  childInteractionsRepositoryImpl: h = yf,
  deletionRequestsRepositoryImpl: u = Vs,
  directReplyFetchMetadataRepositoryImpl: I = km,
  profileSyncCoordinator: f = void 0,
  contextFetchService: m = wl,
  replyFetchService: w = _m,
  deletionFetchService: P = xl,
  relatedTargetResolver: T = void 0
}) {
  const p = f ?? Dl({ getShow: t, getRxNostr: n }), x = !f, a = T ?? pd({
    getShow: t,
    getRxNostr: n,
    getRelayConfig: o,
    postHistoryRepositoryImpl: i,
    contextFetchService: m,
    deletionRequestsRepositoryImpl: u,
    deletionFetchService: P,
    profileSyncCoordinator: p
  }), k = !T, Z = `post-history-thread-graph-parent:${++Zm}`;
  let V = be({}), oe = be({}), _ = be({}), ee = be({}), fe = be({}), he = be(0);
  const me = Lm(), ke = /* @__PURE__ */ new Set(), Ee = /* @__PURE__ */ new Set(), $e = /* @__PURE__ */ new Set(), Pe = /* @__PURE__ */ new Set();
  let re = be({}), ve = be({}), de = be({}), j = be({});
  const ne = Om();
  function xe(l) {
    const y = r(ve)[l] ?? [];
    g(j, {
      ...r(j),
      [l]: Ld(y, r(de))
    });
  }
  function Le(l, y) {
    g(de, { ...r(de), [l]: y });
    for (const [F, $] of Object.entries(r(ve)))
      $.some((U) => U.authorPubkey === l) && xe(F);
  }
  function Fe(l) {
    return r(re)[l] ?? ml;
  }
  function D(l) {
    return r(j)[l] ?? $f;
  }
  function J(l, y) {
    return r(ee)[Nn(l, y)] ?? ji();
  }
  function L(l, y, F) {
    const $ = Nn(l, y);
    g(ee, {
      ...r(ee),
      [$]: F(r(ee)[$] ?? ji())
    });
  }
  function G(l) {
    const y = _s(l), F = Es(r(V)[y.eventId], y);
    return g(V, { ...r(V), [F.eventId]: F }), F;
  }
  function ue(l, y) {
    y && g(oe, { ...r(oe), [l]: y });
  }
  function B(l, y) {
    const F = r(_)[l] ?? [], $ = ec(Rc([...F, ...y]).filter((U) => U !== l && !Yt(U)), r(V));
    g(_, { ...r(_), [l]: $ });
  }
  function Ae(l) {
    const y = gl(l);
    return _s({
      event: y,
      relayUrls: $o([
        ...l.relayHints,
        ...l.acceptedRelays,
        ...l.fetchedRelays ?? []
      ]),
      sources: ["anchor", "history-record"]
    });
  }
  function ae(l) {
    const y = Ae(l), F = G({
      event: y.event,
      relayUrls: y.relayUrls,
      sources: y.sources
    });
    return ue(F.eventId, F.parentEventId), ie(F.authorPubkey, F.relayUrls), F;
  }
  function je(l, y) {
    if (!l || !y)
      return;
    let F = !1;
    const $ = { ...r(V) };
    for (const [U, z] of Object.entries(r(V)))
      z.authorPubkey === l && ($[U] = Es(z, { ...z, profile: y }), F = !0);
    F && g(V, $);
  }
  function ie(l, y = []) {
    const F = p.ensureProfile(l, y);
    je(l, F);
  }
  const qe = p.subscribe((l, y) => {
    t() && (je(l, y), Le(l, y));
  });
  async function Ze(l) {
    const y = $o(l.relayUrls ?? []), F = G({ ...l, relayUrls: y });
    return ie(l.event.pubkey, y), F;
  }
  function bt(l, y, F) {
    const $ = Ki.buildContext(l, y, F);
    return $ ? Ki.toDescriptor($, Z) : null;
  }
  function Ct(l) {
    if (!l)
      return null;
    const y = a.getTargetSnapshot(l.eventId);
    if (y?.status !== "resolved" || !y.event)
      return l;
    const F = $o([...l.relayUrls, ...y.relayHints]), $ = y.profile ?? l.profile ?? null;
    return l.event === y.event && l.profile === $ && sl(l.relayUrls, F) ? l : Es(l, {
      ...l,
      event: y.event,
      relayUrls: F,
      profile: $
    });
  }
  function _t(l, y) {
    return Ki.getRelayHints(l, y);
  }
  function ln(l, y) {
    const F = _a(y.event);
    return $o([
      ...y.relayUrls,
      ...F.relayHints,
      ...l.relayHints,
      ...l.acceptedRelays,
      ...l.fetchedRelays ?? []
    ]);
  }
  function Xe(l, y) {
    return So.sanitizeExternalRelayUrls(
      [
        ...y.flatMap((F) => {
          const $ = _a(F.event);
          return [...F.relayUrls, ...$.relayHints];
        }),
        ...l.relayHints,
        ...l.acceptedRelays,
        ...l.fetchedRelays ?? []
      ],
      { limit: Jm }
    );
  }
  function ut(l) {
    me.clear(l);
  }
  function it(l, y) {
    const F = Nn(l, y);
    me.schedule(F, () => {
      const $ = J(l, y);
      !$.loadingParent || !$.visibleParent || L(l, y, (U) => ({ ...U, showParentLoadingIndicator: !0 }));
    });
  }
  function X(l, y) {
    return (r(_)[l] ?? []).map(($) => Ct(r(V)[$])).filter(($) => !!$).filter(($) => !vt($.authorPubkey, $.eventId)).map(($) => ({
      event: $.event,
      profile: $.profile,
      relayUrls: [...$.relayUrls],
      isOwnReply: $.authorPubkey === y
    }));
  }
  function nt(l) {
    return (r(_)[l] ?? []).filter((y) => {
      const F = r(V)[y];
      return F && !vt(F.authorPubkey, F.eventId);
    });
  }
  function St(l, y, F) {
    return nt(l).filter(($) => !y.includes($) && !F.has($));
  }
  function dn(l, y, F, $ = [], U = 0, z = /* @__PURE__ */ new Set()) {
    const ce = Ct(r(V)[y]);
    if (!ce || vt(ce.authorPubkey, ce.eventId) || $.includes(y) || z.has(y))
      return null;
    z.add(y);
    const Me = [...$, y], le = J(l, y), Se = ce.parentEventId, De = Se ? $.includes(Se) : !1, Ne = Se ? kc({
      childNode: ce,
      parentNode: Ct(r(V)[Se] ?? null)
    }) : null, Be = le.visibleParent && Ne && !De && U > -20 ? dn(l, Ne.eventId, F, Me, U - 1, z) : null, pt = U < Qm ? St(y, Me, z) : [], yt = pt.length, Et = le.visibleChildren && yt > 0, Ve = Et ? pt.map((tt) => dn(l, tt, F, Me, U + 1, z)).filter((tt) => tt !== null) : [];
    return {
      anchorEventId: l,
      node: ce,
      parentTargetId: Se,
      parentNodeState: Be,
      parentExpansion: le,
      parentAlreadyInPath: De,
      repliesActionState: {
        status: le.loadingChildren ? "loading" : le.childrenError ? "failed" : le.loadedChildren ? "loaded" : "unloaded",
        visible: Et,
        replies: pt,
        replyCount: yt,
        error: le.childrenError
      },
      replyNodeStates: Ve,
      isOwnReply: ce.authorPubkey === F,
      depthFromAnchor: U,
      cycleDetected: !1
    };
  }
  function jn(l) {
    r(he);
    const y = Ct(r(V)[l.eventId]) ?? Ae(l), F = J(l.eventId, l.eventId), $ = e() ?? l.pubkeyHex, U = /* @__PURE__ */ new Set([l.eventId]), z = y.parentEventId, ce = z ? Ct(r(V)[z] ?? null) : null, Me = ce && !vt(ce.authorPubkey, ce.eventId) ? kc({ childNode: y, parentNode: ce }) : null, le = Me && F.visibleParent ? dn(l.eventId, Me.eventId, $, [l.eventId], -1, U) : null, Se = St(l.eventId, [l.eventId], U), De = new Set(Se), Ne = X(l.eventId, $).filter((Et) => De.has(Et.event.id)), Be = Se.length, pt = F.visibleChildren && Be > 0, yt = pt ? Se.map((Et) => dn(l.eventId, Et, $, [l.eventId], 1, U)).filter((Et) => Et !== null) : [];
    return {
      anchorEventId: l.eventId,
      parentTargetId: z,
      parentNode: Me,
      parentNodeState: le,
      parentExpansion: F,
      repliesActionState: {
        status: F.loadingChildren ? "loading" : F.childrenError ? "failed" : F.loadedChildren ? "loaded" : "unloaded",
        visible: pt,
        replies: Ne,
        replyCount: Be,
        error: F.childrenError
      },
      reactionSummary: Fe(l.eventId),
      reactionReadModel: D(l.eventId),
      replyItems: Ne,
      replyNodeStates: yt
    };
  }
  function vt(l, y) {
    return !l || !y ? !1 : !!r(fe)[l]?.[y];
  }
  function Yt(l) {
    const y = r(V)[l];
    return y ? vt(y.authorPubkey, l) : !1;
  }
  function et(l, y) {
    !l || !y || vt(l, y) || g(fe, {
      ...r(fe),
      [l]: {
        ...r(fe)[l] ?? {},
        [y]: !0
      }
    });
  }
  function wt(l, y, F = {}) {
    const $ = /* @__PURE__ */ new Set();
    for (const [U, z] of Object.entries(r(oe))) {
      if (z !== l)
        continue;
      const ce = r(V)[l];
      y && ce && ce.authorPubkey !== y || $.add(U);
    }
    if ($.size !== 0)
      for (const [U, z] of Object.entries(r(ee))) {
        const ce = U.indexOf(":");
        if (ce < 0)
          continue;
        const Me = U.slice(0, ce), le = U.slice(ce + 1);
        $.has(le) && (!z?.loadedParent && !z?.visibleParent || L(Me, le, (Se) => Qa(Se, {
          visibleParent: F.revealKnownParent ? !0 : Se.visibleParent,
          parentDeleted: !0,
          lastFetchedParentAt: Date.now()
        })));
      }
  }
  function rt(l, y = {}) {
    for (const [F, $] of l.entries())
      for (const U of $)
        wt(U, F, y);
  }
  function en(l) {
    let y = r(fe), F = !1;
    for (const [$, U] of l.entries()) {
      const z = y[$] ?? {};
      let ce = z;
      for (const Me of U)
        ce[Me] || (ce = { ...ce, [Me]: !0 }, F = !0);
      ce !== z && (y = { ...y, [$]: ce });
    }
    F && (g(fe, y), rt(l));
  }
  function gt(l) {
    const y = {};
    let F = !1;
    for (const [$, U] of Object.entries(r(_))) {
      const z = U.filter((ce) => ce !== l);
      y[$] = z, z.length !== U.length && (F = !0);
    }
    if (F && g(_, y), r(oe)[l]) {
      const { [l]: $, ...U } = r(oe);
      g(oe, U);
    }
  }
  async function Pt(l, y = {}) {
    if (!l?.id || vt(l.pubkey, l.id))
      return !0;
    if (y.checkPostHistoryRepository === !1)
      return !1;
    try {
      if (typeof (await i.getByEventId(l.id))?.deletedAt == "number")
        return et(l.pubkey, l.id), gt(l.id), !0;
    } catch {
    }
    return !1;
  }
  async function Qt(l) {
    en(l);
    for (const y of l.values())
      for (const F of y)
        gt(F), await h.deleteChildInteractionByEventId(F);
  }
  async function cn(l) {
    const y = await u.getDeletedTargets(l.map((F) => ({ targetAuthorPubkey: F.pubkey, targetEventId: F.id })));
    await Qt(y);
  }
  async function Rt(l, y, F, $ = "default") {
    if (y.length === 0)
      return;
    const U = n();
    if (!U)
      return;
    const z = y.filter((le) => !vt(le.pubkey, le.id));
    if (z.length === 0)
      return;
    const ce = `${l}:deletions:${$}`, Me = P.fetchDeletionRequests(U, {
      targets: z.map((le) => ({
        event: le,
        relayUrls: r(V)[le.id]?.relayUrls ?? []
      })),
      relayHints: F,
      relayConfig: o()
    });
    ne.replaceDeletionFetchTask(ce, Me);
    try {
      const le = await Me.promise;
      if (!t())
        return;
      await u.upsertValidDeletionRequests({
        targetEvents: z,
        deletionEvents: le.events,
        fetchedAt: le.fetchedAt
      });
    } catch {
      return;
    } finally {
      ne.deleteDeletionFetchTask(ce);
    }
    t() && await cn(z);
  }
  async function $t(l) {
    await cn(l);
    const y = [];
    for (const F of l) {
      if (await Pt(F)) {
        await h.deleteChildInteractionByEventId(F.id);
        continue;
      }
      y.push(F);
    }
    return y;
  }
  async function It(l) {
    const y = l.map((z) => Os(z)), F = await $t(y), $ = new Set(F.map((z) => z.id)), U = [];
    for (const z of l)
      $.has(z.eventId) && U.push(z);
    return U;
  }
  async function bn(l) {
    const y = await $t(l.map((U) => U.event)), F = new Set(y.map((U) => U.id)), $ = [];
    for (const U of l)
      F.has(U.event.id) && $.push(U);
    return $;
  }
  async function Lt(l) {
    return await cn([l.event]), await Pt(l.event, { checkPostHistoryRepository: l.checkPostHistoryRepository }) ? !1 : (Rt(l.anchorEventId, [l.event], l.relayHints), !0);
  }
  function Ye(l, y = l) {
    ut(Nn(l, y)), L(l, y, (F) => ({
      ...Qa(F, {
        visibleParent: !0,
        parentDeleted: !0,
        lastFetchedParentAt: Date.now()
      })
    }));
  }
  function tn(l, y) {
    ut(Nn(l, y)), L(l, y, (F) => ({
      ...F,
      loadedParent: !1,
      visibleParent: !1,
      loadingParent: !1,
      revalidatingParent: !1,
      parentError: null,
      parentMissing: !1,
      parentDeleted: !1,
      showParentLoadingIndicator: !1,
      lastFetchedParentAt: null
    }));
  }
  async function ht(l, y, F) {
    const $ = F.parentEventId;
    if (!$)
      return !1;
    const U = a.getTargetSnapshot($);
    if (U?.status === "deleted")
      return U.authorPubkey && (et(U.authorPubkey, $), wt($, U.authorPubkey, { revealKnownParent: !0 })), Ye(l.eventId, y), !0;
    const z = Ct(r(V)[$] ?? null);
    if (z) {
      const ce = Sa({
        event: z.event,
        relayHints: z.relayUrls
      });
      if (!ce || !za({ child: F.event, parent: ce }).valid)
        return tn(l.eventId, y), !1;
      const Me = $o([
        ...z.relayUrls,
        ..._t(l, F)
      ]), le = await Lt({
        anchorEventId: l.eventId,
        event: z.event,
        relayHints: Me,
        checkPostHistoryRepository: z.authorPubkey === e()
      });
      return t() ? le ? (L(l.eventId, y, (Se) => ({
        ...Qa(Se, {
          parentDeleted: Se.parentDeleted,
          lastFetchedParentAt: U?.updatedAt ?? Se.lastFetchedParentAt
        })
      })), !0) : (Ye(l.eventId, y), !0) : !1;
    }
    if (!U)
      return !1;
    if (U.authorPubkey && vt(U.authorPubkey, $))
      return Ye(l.eventId, y), !0;
    if (U.status === "resolved" && U.event) {
      const ce = Sa({
        event: U.event,
        relayHints: U.relayHints
      });
      if (!ce || !za({ child: F.event, parent: ce }).valid)
        return tn(l.eventId, y), !1;
      const Me = G({
        event: U.event,
        relayUrls: U.relayHints,
        sources: ["fetched-parent"],
        profile: U.profile
      });
      return ue(Me.eventId, Me.parentEventId), L(l.eventId, y, (le) => ({
        ...Qa(le, {
          parentDeleted: !1,
          lastFetchedParentAt: U.updatedAt ?? le.lastFetchedParentAt
        })
      })), !0;
    }
    return U.status === "not-found" ? (L(l.eventId, y, (ce) => ({
      ...Qa(ce, {
        parentMissing: !0,
        parentDeleted: !1,
        lastFetchedParentAt: U.updatedAt ?? ce.lastFetchedParentAt
      })
    })), !0) : !1;
  }
  async function nn(l, y, F, $ = {}) {
    const U = F.parentEventId;
    if (!U)
      return;
    const z = ne.incrementRequestId(), ce = Nn(l.eventId, y);
    L(l.eventId, y, (Me) => ({
      ...Fm(Me, { showInitialLoading: !!$.showInitialLoading })
    })), $.showInitialLoading && it(l.eventId, y), await Pc({
      isActive: () => z === ne.getRequestId() && t(),
      cleanup: () => {
        ut(ce);
      },
      onError: () => {
        qm({
          updateExpansion: (Me) => L(l.eventId, y, Me),
          showInitialLoading: !!$.showInitialLoading,
          errorCode: "fetch_failed"
        });
      },
      run: async ({ ensureActive: Me }) => {
        const le = bt(l, y, F);
        if (!le)
          return;
        const Se = await a.ensureTarget(le, { force: !0, background: !$.showInitialLoading });
        if (!Me() || (ut(ce), !Se))
          return;
        if (Se.status === "resolved" && Se.event) {
          const Ne = Sa({ event: Se.event, relayHints: Se.relayHints });
          if (!Ne || !za({ child: F.event, parent: Ne }).valid) {
            tn(l.eventId, y);
            return;
          }
        }
        const De = Hm(Se);
        await xc({
          status: De,
          strategies: $m({
            snapshot: Se,
            parentEventId: U,
            showInitialLoading: !!$.showInitialLoading,
            updateExpansion: (Ne) => {
              L(l.eventId, y, Ne);
            },
            hideEvent: et,
            markParentDeletedForEvent: wt,
            setParentDeleted: () => {
              Ye(l.eventId, y);
            },
            isDeletedEvent: vt,
            upsertNode: () => G({
              event: Se.event,
              relayUrls: Se.relayHints,
              sources: ["fetched-parent"],
              profile: Se.profile
            }),
            upsertParentEdge: ue
          })
        });
      }
    });
  }
  async function rn(l, y, F = {}) {
    const $ = y === l.eventId ? ae(l) : r(V)[y];
    if (!$?.parentEventId)
      return;
    const U = J(l.eventId, y);
    await Sc({
      loading: U.loadingParent,
      revalidating: U.revalidatingParent,
      onInFlight: () => {
        L(l.eventId, y, (z) => ({
          ...z,
          visibleParent: !0,
          showParentLoadingIndicator: !1
        }));
      },
      onLoadingInFlight: () => {
        it(l.eventId, y);
      },
      shouldHandleLoadedState: !F.force && U.loadedParent,
      handleLoadedState: async () => {
        if (U.parentDeleted)
          return Ye(l.eventId, y), !0;
        L(l.eventId, y, (ce) => ({
          ...ce,
          visibleParent: !0,
          showParentLoadingIndicator: !1
        }));
        const z = await ht(l, y, $);
        return Cc({
          hasVisibleData: z,
          lastFetchedAt: U.lastFetchedParentAt,
          ttlMs: Xs
        }) && nn(l, y, $), !0;
      },
      prepareFreshLoadState: () => {
        L(l.eventId, y, (z) => ({
          ...z,
          visibleParent: !0,
          loadingParent: !0,
          parentError: null,
          parentMissing: !1,
          parentDeleted: !1,
          showParentLoadingIndicator: !1
        })), it(l.eventId, y);
      },
      displayCachedForFreshLoad: async () => {
        const z = await ht(l, y, $), ce = J(l.eventId, y);
        return {
          displayedCached: z,
          lastFetchedAt: ce.lastFetchedParentAt
        };
      },
      force: !!F.force,
      ttlMs: Xs,
      awaitWhenInitialLoading: !0,
      runRevalidate: ({ showInitialLoading: z }) => nn(l, y, $, { showInitialLoading: z })
    });
  }
  async function un(l, y = {}) {
    await rn(l, l.eventId, y);
  }
  function xr(l) {
    ar(l.eventId, l.eventId);
  }
  function ar(l, y) {
    ut(Nn(l, y)), L(l, y, (F) => ({
      ...F,
      visibleParent: !1,
      showParentLoadingIndicator: !1
    }));
  }
  async function Kn(l) {
    if (J(l.eventId, l.eventId).visibleParent) {
      xr(l);
      return;
    }
    await un(l);
  }
  function Cn(l) {
    un(l, { force: !0 });
  }
  async function Ke(l, y) {
    if (J(l.eventId, y).visibleParent) {
      ar(l.eventId, y);
      return;
    }
    await rn(l, y);
  }
  function An(l, y) {
    rn(l, y, { force: !0 });
  }
  function On(l) {
    const y = l.map((F) => F.fetchedAt).filter((F) => Number.isFinite(F));
    return y.length > 0 ? Math.max(...y) : null;
  }
  async function Pn(l) {
    try {
      return {
        metadata: await I.get(l),
        readFailed: !1
      };
    } catch {
      return { metadata: null, readFailed: !0 };
    }
  }
  async function fr(l, y) {
    const { metadata: F, readFailed: $ } = await Pn(l);
    return $ ? null : F ? F.completeness === "complete" ? F.fetchedAt : null : On(y);
  }
  async function vr(l, y, F, $ = {}) {
    const U = await s.getDirectReplyRecords(y);
    Rt(l.eventId, U.map((le) => Os(le)), ln(l, F));
    const z = await It(U);
    if (!t() || z.length === 0)
      return !1;
    const ce = await Mr(F, z, ["reply-db"], { resolveProfiles: !$.prefetchOnly });
    if (!t() || ce.length === 0)
      return !1;
    if (!t())
      return !0;
    const Me = await fr(y, ce);
    return t() && L(l.eventId, y, (le) => ({
      ...Fs(le, {
        visibleChildren: $.prefetchOnly ? le.visibleChildren : !0,
        lastFetchedChildrenAt: Me
      })
    })), !0;
  }
  async function Sr(l, y, F, $ = {}) {
    const U = Nn(l.eventId, y), z = ne.getRequestId(), ce = ne.createChildRequestToken(U), Me = Date.now();
    L(l.eventId, y, (le) => ({
      ...bc(le, {
        showInitialLoading: !!$.showInitialLoading,
        prefetchOnly: !!$.prefetchOnly
      })
    })), await Pc({
      isActive: () => z === ne.getRequestId() && ne.getChildRequestToken(U) === ce && t(),
      cleanup: () => {
        ne.deleteChildrenFetchTask(U), ne.deleteChildRequestToken(U), to(l.eventId, y);
      },
      onError: Gm({
        updateExpansion: (le) => L(l.eventId, y, le),
        showInitialLoading: !!$.showInitialLoading,
        prefetchOnly: !!$.prefetchOnly
      }),
      run: async ({ ensureActive: le }) => {
        if (!le())
          return;
        const Se = n();
        if (!Se) {
          L(l.eventId, y, (tt) => ({
            ...pi(tt, {
              nextError: $.showInitialLoading && !$.prefetchOnly ? "nostr_not_ready" : null
            })
          }));
          return;
        }
        const De = w.fetchDirectReplies(Se, {
          eventId: y,
          createdAt: F.event.created_at,
          relayHints: ln(l, F),
          parents: [
            Sa({
              event: F.event,
              relayHints: ln(l, F)
            })
          ].filter((tt) => tt !== null),
          relayConfig: o()
        });
        ne.replaceChildrenFetchTask(U, De);
        const Ne = await De.promise;
        if (ne.deleteChildrenFetchTask(U), !le())
          return;
        Ec(Ne.status), Rt(l.eventId, Ne.events.map((tt) => tt.event), [
          ...ln(l, F),
          ...Ne.relayUrls
        ]);
        const Be = await bn(Ne.events);
        Ne.events.length > 0 && await h.upsertChildInteractions({
          parentEventId: y,
          events: Be,
          fetchedAt: Ne.status === "partial" ? null : Ne.fetchedAt
        });
        const pt = await I.save({
          parentEventId: y,
          completeness: Ac(Ne.status),
          fetchedAt: Ne.fetchedAt,
          requestStartedAt: Me
        }), yt = Xi(pt), Et = await It(await s.getDirectReplyRecords(y));
        if (!le())
          return;
        Et.length > 0 && await Mr(F, Et, ["reply-db", "fetched-child"], { resolveProfiles: !$.prefetchOnly });
        const Ve = Nm({
          nextRecordsLength: Et.length,
          resultEventsLength: Ne.events.length
        });
        await xc({
          status: Ve,
          strategies: Bm({
            fetchedAt: yt,
            prefetchOnly: !!$.prefetchOnly,
            updateExpansion: (tt) => {
              L(l.eventId, y, tt);
            },
            prefetchChildReplyCounts: () => {
              _o(l, y);
            }
          })
        }), Ao({
          anchorEventId: l.eventId,
          nodeEventId: y,
          effectiveFetchedAt: yt,
          replyCount: Et.length
        });
      }
    });
  }
  function vo(l, y) {
    $e.add(Nn(l, y));
  }
  function Xn(l, y) {
    $e.delete(Nn(l, y));
  }
  function go(l, y) {
    return $e.has(Nn(l, y));
  }
  function Io(l, y) {
    Pe.add(Nn(l, y));
  }
  function to(l, y) {
    Pe.delete(Nn(l, y));
  }
  function kr(l, y) {
    return Pe.has(Nn(l, y));
  }
  function no(l) {
    for (const y of Pe)
      y.endsWith(`:${l}`) && Pe.delete(y);
  }
  function Hr(l, y) {
    if (!kr(l.eventId, y))
      return;
    const F = Nn(l.eventId, y);
    if (ne.getChildRequestToken(F) !== void 0)
      return;
    const $ = J(l.eventId, y);
    to(l.eventId, y), !(!t() || !$.visibleChildren) && Nr(l, y, { force: !0 });
  }
  function ha(l, y, F) {
    const $ = Nn(l.eventId, y);
    return ne.getChildRequestToken($) === void 0 && !go(l.eventId, y) ? !1 : (F || (Io(l.eventId, y), L(l.eventId, y, (U) => ({ ...U, visibleChildren: !0 }))), !0);
  }
  function Oa(l, y) {
    return y === l.eventId ? ae(l) : r(V)[y];
  }
  async function Nr(l, y, F = {}) {
    const $ = Oa(l, y);
    if (!$ || ha(l, y, !!F.prefetchOnly))
      return;
    const U = J(l.eventId, y);
    await Sc({
      loading: U.loadingChildren,
      revalidating: U.revalidatingChildren,
      onInFlight: F.prefetchOnly ? () => {
      } : () => {
        L(l.eventId, y, (z) => ({ ...z, visibleChildren: !0 }));
      },
      shouldHandleLoadedState: !F.force && U.loadedChildren,
      handleLoadedState: async () => {
        if (F.prefetchOnly)
          return !0;
        const z = nt(y).length > 0;
        return L(l.eventId, y, (ce) => ({ ...ce, visibleChildren: z })), z && _o(l, y), Cc({
          hasVisibleData: !0,
          lastFetchedAt: U.lastFetchedChildrenAt,
          ttlMs: Xs
        }) && Sr(l, y, $), !0;
      },
      prepareFreshLoadState: () => {
      },
      displayCachedForFreshLoad: async () => {
        const z = await vr(l, y, $, F), ce = J(l.eventId, y);
        return {
          displayedCached: z,
          lastFetchedAt: ce.lastFetchedChildrenAt
        };
      },
      force: !!F.force,
      ttlMs: Xs,
      prefetchOnly: !!F.prefetchOnly,
      awaitWhenInitialLoading: !1,
      onSkipPrefetchReplyCounts: () => {
        _o(l, y);
      },
      runRevalidate: ({ showInitialLoading: z }) => Sr(l, y, $, { prefetchOnly: F.prefetchOnly, showInitialLoading: z })
    });
  }
  async function Qr(l, y = {}) {
    await Nr(l, l.eventId, y);
  }
  async function _o(l, y) {
    const F = Nn(l.eventId, y);
    if (!Ee.has(F)) {
      Ee.add(F);
      try {
        await Eo(l, y);
      } finally {
        Ee.delete(F);
      }
    }
  }
  async function Eo(l, y) {
    const F = Date.now(), $ = ne.getRequestId(), U = nt(y).filter((De) => {
      const Ne = J(l.eventId, De), Be = typeof Ne.lastFetchedChildrenAt == "number" && F - Ne.lastFetchedChildrenAt < _c;
      return !Ne.loadedChildren && !Ne.loadingChildren && !Ne.revalidatingChildren && !Be;
    });
    if (U.length === 0)
      return;
    for (const De of U)
      vo(l.eventId, De);
    const z = [];
    if (await Promise.all(U.map(async (De) => {
      try {
        if (!t()) {
          Xn(l.eventId, De);
          return;
        }
        const Ne = await fa(l, De), Be = J(l.eventId, De), pt = typeof Be.lastFetchedChildrenAt == "number" && Date.now() - Be.lastFetchedChildrenAt < _c, yt = !Ne || Be.lastFetchedChildrenAt === null;
        yt && $ === ne.getRequestId() && t() && go(l.eventId, De) && ne.getChildRequestToken(Nn(l.eventId, De)) === void 0 && !Be.loadingChildren && !Be.revalidatingChildren && (!Be.loadedChildren || Be.lastFetchedChildrenAt === null) && !pt ? z.push(De) : (Xn(l.eventId, De), yt ? Hr(l, De) : to(l.eventId, De));
      } catch {
        Xn(l.eventId, De), Hr(l, De);
      }
    })), z.sort((De, Ne) => Number(kr(l.eventId, Ne)) - Number(kr(l.eventId, De))), z.splice(zm).forEach((De) => {
      Xn(l.eventId, De), Hr(l, De);
    }), !t() || z.length === 0) {
      z.forEach((De) => {
        Xn(l.eventId, De), Hr(l, De);
      });
      return;
    }
    const ce = [];
    for (let De = 0; De < z.length; De += Ic)
      ce.push(z.slice(De, De + Ic));
    let Me = 0;
    const le = Math.min(Wm, ce.length), Se = async () => {
      for (; t(); ) {
        const De = Me;
        Me += 1;
        const Ne = ce[De];
        if (!Ne)
          return;
        await Yo(l, Ne);
      }
    };
    try {
      await Promise.all(Array.from({ length: le }, () => Se()));
    } finally {
      U.forEach((De) => Xn(l.eventId, De));
    }
  }
  async function fa(l, y) {
    const F = await s.getDirectReplyRecords(y), { metadata: $, readFailed: U } = await Pn(y);
    if (!t())
      return !1;
    const z = await It(F), ce = r(V)[y];
    if (!t() || !ce || z.length === 0 && !$)
      return !1;
    const Me = await Mr(ce, z, ["reply-db"], { resolveProfiles: !1 });
    if (!t() || Me.length === 0 && !$)
      return !1;
    const le = U ? null : $ ? $.completeness === "complete" ? $.fetchedAt : null : On(Me);
    return t() && L(l.eventId, y, (Se) => ({
      ...Fs(Se, { lastFetchedChildrenAt: le })
    })), !0;
  }
  function ro(l, y) {
    const F = new Set(y), $ = /* @__PURE__ */ new Map();
    for (const U of l) {
      if (!F.has(U.parentEventId))
        continue;
      const z = $.get(U.parentEventId) ?? [];
      z.push(U), $.set(U.parentEventId, z);
    }
    for (const U of $.values())
      U.sort((z, ce) => z.createdAt !== ce.createdAt ? z.createdAt - ce.createdAt : z.eventId.localeCompare(ce.eventId));
    return $;
  }
  function Ao(l) {
    return l.effectiveFetchedAt !== null || l.replyCount > 0 ? !1 : (L(l.anchorEventId, l.nodeEventId, (y) => ({
      ...y,
      loadedChildren: !1,
      loadingChildren: !1,
      revalidatingChildren: !1,
      childrenError: null,
      lastFetchedChildrenAt: null
    })), !0);
  }
  function Do(l) {
    const y = { ...r(V) }, F = { ...r(oe) }, $ = { ...r(_) }, U = { ...r(ee) }, z = { ...r(re) }, ce = { ...r(ve) }, Me = { ...r(de) }, le = { ...r(j) };
    let Se = !1, De = !1, Ne = !1, Be = !1;
    const pt = /* @__PURE__ */ new Map(), yt = (Ve) => {
      const tt = Es(y[Ve.eventId], Ve);
      return y[tt.eventId] = tt, Se = !0, tt;
    }, Et = (Ve, tt) => {
      tt && (F[Ve] = tt, De = !0);
    };
    for (const Ve of l.targetParentIds) {
      const tt = l.anchorNodesByParentId.get(Ve);
      if (!tt)
        continue;
      const Zt = yt(tt);
      Et(Zt.eventId, Zt.parentEventId);
      const Xt = l.reactionRecordsByParentId.get(Ve) ?? [];
      z[Ve] = Tm(Xt), ce[Ve] = Xt;
    }
    for (const [Ve, tt] of Object.entries(l.cachedReactionProfilesByPubkey))
      Me[Ve] = tt;
    for (const Ve of l.targetParentIds) {
      if (!l.anchorNodesByParentId.get(Ve))
        continue;
      const Zt = [], Xt = [];
      for (const kn of l.directReplyRecordsByParentId.get(Ve) ?? []) {
        const Ft = Os(kn);
        if (vt(Ft.pubkey, Ft.id))
          continue;
        const mo = yt(_s({
          event: Ft,
          relayUrls: $o(kn.relayUrls),
          sources: ["reply-db", "inbound-sync"]
        }));
        mo.eventId !== Ve && (Et(mo.eventId, Ve), Xt.push(mo.eventId), Zt.push(kn));
      }
      pt.set(Ve, Xt);
      const Rr = l.metadataByParentId.get(Ve) ?? null, zr = l.metadataReadFailedParentIds.has(Ve);
      if (Zt.length === 0 && !Rr)
        continue;
      const we = l.postsByParentId.get(Ve);
      if (!we)
        continue;
      const Qe = Nn(we.eventId, Ve), wn = U[Qe] ?? ji();
      U[Qe] = Rr?.completeness === "partial" && Zt.length === 0 ? {
        ...wn,
        loadedChildren: !1,
        loadingChildren: !1,
        revalidatingChildren: !1,
        childrenError: null,
        lastFetchedChildrenAt: null
      } : Fs(wn, {
        lastFetchedChildrenAt: zr ? null : Rr ? Xi(Rr) : On(Zt)
      }), Be = !0;
    }
    for (const [Ve, tt] of pt) {
      const Zt = $[Ve] ?? [];
      $[Ve] = ec(Rc([...Zt, ...tt]).filter((Xt) => Xt !== Ve && !Yt(Xt)), y), Ne = !0;
    }
    for (const [Ve, tt] of l.knownNodeProfilesByPubkey)
      if (tt)
        for (const [Zt, Xt] of Object.entries(y))
          Xt.authorPubkey === Ve && (y[Zt] = Es(Xt, { ...Xt, profile: tt }), Se = !0);
    for (const Ve of l.targetParentIds)
      le[Ve] = Ld(ce[Ve] ?? [], Me);
    Se && g(V, y), De && g(oe, F), Ne && g(_, $), Be && g(ee, U), g(re, z), g(ve, ce), g(de, Me), g(j, le);
  }
  async function Dn(l, y) {
    if (!t() || l.length === 0)
      return;
    const F = Xm(l, y);
    if (F.length === 0)
      return;
    const $ = ne.getRequestId(), U = !!y?.length, z = new Map(l.map((ce) => [ce.eventId, ce]));
    await wc({
      items: F,
      isActive: () => $ === ne.getRequestId() && t(),
      run: async ({ ensureActive: ce }) => {
        const Me = F.flatMap((we) => {
          const Qe = z.get(we);
          if (!Qe || !ce())
            return [];
          const wn = Nn(Qe.eventId, we), kn = J(Qe.eventId, we);
          return !U && (ke.has(wn) || kn.loadedChildren || kn.loadingChildren || kn.revalidatingChildren) ? (ke.add(wn), []) : (ke.add(wn), [{ parentEventId: we, post: Qe }]);
        });
        if (Me.length === 0 || !ce())
          return;
        const le = Me.map(({ parentEventId: we }) => we), Se = h.getChildInteractionsForParents ? await h.getChildInteractionsForParents(le) : (await Promise.all(le.map(async (we) => {
          const [Qe, wn] = await Promise.all([
            Bf(we, d),
            s.getDirectReplyRecords(we)
          ]);
          return [...Qe, ...wn];
        }))).flat();
        if (!ce())
          return;
        let De = [];
        const Ne = /* @__PURE__ */ new Set();
        try {
          I.getForParentEventIds ? De = await I.getForParentEventIds(le) : De = (await Promise.all(le.map((Qe) => Pn(Qe)))).flatMap(({ metadata: Qe, readFailed: wn }, kn) => wn ? (Ne.add(le[kn]), []) : Qe ? [Qe] : []);
        } catch {
          for (const we of le)
            Ne.add(we);
        }
        if (!ce())
          return;
        const Be = ro(await It(Se), le);
        if (!ce())
          return;
        const pt = new Map(Me.map(({ parentEventId: we, post: Qe }) => [we, Ae(Qe)])), yt = /* @__PURE__ */ new Map(), Et = /* @__PURE__ */ new Map(), Ve = [], tt = /* @__PURE__ */ new Set(), Zt = /* @__PURE__ */ new Map(), Xt = (we, Qe) => {
          Zt.set(we, $o([...Zt.get(we) ?? [], ...Qe]));
        };
        for (const we of le) {
          const Qe = pt.get(we);
          if (!Qe)
            continue;
          Xt(Qe.authorPubkey, Qe.relayUrls);
          const wn = [], kn = [];
          for (const Ft of Be.get(we) ?? [])
            Ft.kind === 7 ? (wn.push(Ft), Ft.authorPubkey && (tt.add(Ft.authorPubkey), Xt(Ft.authorPubkey, Qe.relayUrls))) : [1, 42, 1111].includes(Ft.kind) && (Dc({ parentNode: Qe, record: Ft }) ? (kn.push(Ft), Xt(Ft.authorPubkey, Ft.relayUrls)) : Ve.push(Ft.eventId));
          yt.set(we, wn), Et.set(we, kn);
        }
        if (Ve.length > 0 && (await Promise.all(Ve.map((we) => h.deleteChildInteractionByEventId(we))), !ce()))
          return;
        const Rr = tt.size > 0 ? await mf.getProfiles(Array.from(tt), { allowBackgroundRefresh: !1 }) : {};
        if (!ce())
          return;
        const zr = /* @__PURE__ */ new Map();
        for (const [we, Qe] of Zt)
          zr.set(we, p.ensureProfile(we, Qe));
        Do({
          postsByParentId: z,
          targetParentIds: le,
          anchorNodesByParentId: pt,
          reactionRecordsByParentId: yt,
          directReplyRecordsByParentId: Et,
          metadataByParentId: new Map(De.map((we) => [we.parentEventId, we])),
          metadataReadFailedParentIds: Ne,
          cachedReactionProfilesByPubkey: Rr,
          knownNodeProfilesByPubkey: zr
        });
      }
    });
  }
  async function Yo(l, y) {
    const F = y.map((Be) => r(V)[Be]).filter((Be) => !!Be);
    if (F.length === 0)
      return;
    const $ = ne.getRequestId(), U = Date.now(), z = /* @__PURE__ */ new Map(), ce = /* @__PURE__ */ new Map();
    let Me = !1, le = !1;
    const Se = `${l.eventId}:children-prefetch:${y.join(",")}`, De = () => Me || $ !== ne.getRequestId() || !t() ? !1 : y.every((Be) => go(l.eventId, Be) && ne.getChildRequestToken(Nn(l.eventId, Be)) === z.get(Be)), Ne = (Be) => {
      for (const pt of y)
        dh({
          updateExpansion: (yt) => L(l.eventId, pt, yt),
          showInitialLoading: !1,
          prefetchOnly: !0,
          errorCode: Be
        });
    };
    await wc({
      items: y,
      isActive: De,
      prepareItem: (Be) => {
        const pt = Nn(l.eventId, Be), yt = ne.createChildRequestToken(pt);
        return z.set(Be, yt), L(l.eventId, Be, (Et) => ({
          ...bc(Et, { showInitialLoading: !1, prefetchOnly: !0 })
        })), yt;
      },
      completeBatch: (Be) => {
        if (Be && De())
          for (const pt of y)
            L(l.eventId, pt, (yt) => ({
              ...Fs(yt, {
                loadedChildren: Be && ((ce.get(pt) ?? null) !== null || nt(pt).length > 0),
                revalidatingChildren: !1,
                lastFetchedChildrenAt: ce.get(pt) ?? null
              })
            }));
      },
      cleanupItem: (Be, pt) => {
        const yt = Nn(l.eventId, Be);
        ne.getChildRequestToken(yt) === pt && ne.deleteChildRequestToken(yt), Xn(l.eventId, Be), le || Me ? to(l.eventId, Be) : Hr(l, Be);
      },
      cleanup: () => {
        ne.deleteChildrenFetchTask(Se);
      },
      onError: () => {
        Ne("fetch_failed");
      },
      run: async ({ ensureActive: Be }) => {
        if (!Be())
          return;
        const pt = n();
        if (!pt) {
          Ne("nostr_not_ready");
          return;
        }
        const yt = Xe(l, F), Et = w.fetchDirectReplies(pt, {
          eventId: y[0] ?? "",
          eventIds: y,
          createdAt: Math.min(...F.map((we) => we.event.created_at)),
          relayHints: yt,
          parents: F.map((we) => Sa({
            event: we.event,
            relayHints: [
              ...we.relayUrls,
              ..._a(we.event).relayHints
            ]
          })).filter((we) => we !== null),
          relayConfig: o()
        });
        ne.replaceChildrenFetchTask(Se, Et);
        const Ve = await Et.promise;
        if (ne.deleteChildrenFetchTask(Se), !Be())
          return;
        if (Ve.status === "cancelled") {
          Me = !0;
          for (const we of y)
            L(l.eventId, we, (Qe) => ({
              ...pi(Qe, { nextError: Qe.childrenError })
            }));
          return;
        }
        Ec(Ve.status);
        const tt = new Set(y), Zt = Ve.events.filter((we) => tt.has(we.parentEventId) && we.event.id !== we.parentEventId);
        Zt.length > 0 && await Rt(l.eventId, Zt.map((we) => we.event), [...yt, ...Ve.relayUrls], `children-prefetch:${y.join(",")}`);
        const Xt = await bn(Zt);
        if (!Be())
          return;
        const Rr = /* @__PURE__ */ new Map(), zr = new Map(Zt.map((we) => [we.event.id, we.parentEventId]));
        for (const we of Xt) {
          const Qe = zr.get(we.event.id);
          if (!Qe || !tt.has(Qe))
            continue;
          const wn = Rr.get(Qe) ?? [];
          wn.push(we), Rr.set(Qe, wn);
        }
        for (const we of y) {
          const Qe = Rr.get(we) ?? [];
          if (Qe.length > 0 && await h.upsertChildInteractions({
            parentEventId: we,
            events: Qe,
            fetchedAt: Ve.status === "partial" ? null : Ve.fetchedAt
          }), !Be())
            return;
          const wn = await I.save({
            parentEventId: we,
            completeness: Ac(Ve.status),
            fetchedAt: Ve.fetchedAt,
            requestStartedAt: U
          });
          ce.set(we, Xi(wn));
          const kn = await It(await s.getDirectReplyRecords(we)), Ft = r(V)[we];
          Ft && await Mr(Ft, kn, ["reply-db", "fetched-child"], { resolveProfiles: !1 });
        }
        Be() && (le = !0);
      }
    });
  }
  async function Mr(l, y, F, $ = {}) {
    const U = l.eventId, z = [], ce = [], Me = $.resolveProfiles !== !1;
    for (const le of y) {
      const Se = Os(le);
      if (!Dc({ parentNode: l, record: le })) {
        await h.deleteChildInteractionByEventId(le.eventId);
        continue;
      }
      if (vt(Se.pubkey, Se.id))
        continue;
      const De = Me ? await Ze({ event: Se, relayUrls: le.relayUrls, sources: F }) : G({
        event: Se,
        relayUrls: $o(le.relayUrls),
        sources: F
      });
      Me || ie(Se.pubkey, $o(le.relayUrls)), De.eventId !== U && (ue(De.eventId, U), z.push(De.eventId), ce.push(le));
    }
    return B(U, z), ce;
  }
  function La(l) {
    ko(l.eventId, l.eventId);
  }
  function ko(l, y) {
    to(l, y), L(l, y, (F) => ({ ...F, visibleChildren: !1 }));
  }
  function Qo(l) {
    if (J(l.eventId, l.eventId).visibleChildren) {
      La(l);
      return;
    }
    Qr(l);
  }
  function po(l) {
    Qr(l, { force: !0 });
  }
  function yo(l, y) {
    if (J(l.eventId, y).visibleChildren) {
      ko(l.eventId, y);
      return;
    }
    Nr(l, y);
  }
  function Mo(l, y) {
    Nr(l, y, { force: !0 });
  }
  async function zo(l, y = []) {
    if (!l?.id || ![1, 42, 1111].includes(l.kind))
      return !0;
    const F = _a(l), $ = F.parentId;
    if (!$)
      return !0;
    const U = y.find((Ne) => Ne.eventId === $) ?? null, z = Object.keys(r(ee)).filter((Ne) => Ne.endsWith(`:${$}`));
    if (!U && z.length === 0)
      return !1;
    const ce = a.getTargetSnapshot($), Me = U ? r(V)[$] ?? _s({
      event: gl(U),
      relayUrls: $o([
        ...U.relayHints,
        ...U.acceptedRelays,
        ...U.fetchedRelays ?? []
      ]),
      sources: ["history-record"]
    }) : r(V)[$] ?? (ce?.status === "resolved" && ce.event ? _s({
      event: ce.event,
      relayUrls: ce.relayHints,
      sources: ["fetched-parent"]
    }) : null);
    if (!Me)
      return !1;
    const le = Sa({ event: Me.event, relayHints: Me.relayUrls });
    if (!le || !za({ child: l, parent: le }).valid || (await $t([l])).length === 0)
      return !1;
    await h.upsertChildInteractions({
      parentEventId: $,
      events: [{ event: l, relayUrls: F.relayHints }]
    });
    const Se = await It(await s.getDirectReplyRecords($));
    if (!t())
      return !1;
    await Mr(Me, Se, ["reply-db", "posted-reply"]);
    const De = (Ne, Be) => {
      L(Ne, Be, (pt) => ({
        ...pt,
        loadedChildren: !0,
        loadingChildren: !1,
        childrenError: null
      }));
    };
    U && De(U.eventId, U.eventId);
    for (const Ne of z) {
      const Be = Ne.indexOf(":");
      Be < 0 || De(Ne.slice(0, Be), Ne.slice(Be + 1));
    }
    return !0;
  }
  async function Fa(l) {
    !l.eventId || !l.authorPubkey || (no(l.eventId), et(l.authorPubkey, l.eventId), gt(l.eventId), wt(l.eventId, l.authorPubkey, { revealKnownParent: !0 }), l.deletionEvent && await u.upsertValidDeletionRequests({
      targetEvents: [
        {
          id: l.eventId,
          pubkey: l.authorPubkey,
          kind: 1,
          content: "",
          tags: [],
          created_at: l.deletionEvent.created_at,
          sig: ""
        }
      ],
      deletionEvents: [
        {
          event: l.deletionEvent,
          ...l.deletionEventAttestation ? { attestation: l.deletionEventAttestation } : {}
        }
      ],
      fetchedAt: Date.now()
    }), await h.deleteChildInteractionByEventId(l.eventId));
  }
  Ge(() => {
    t() && g(he, a.getScopeRevision(Z), !0);
  }), Ge(() => {
    if (t()) {
      r(he);
      for (const l of Object.keys(r(ee))) {
        const [y, F] = l.split(":"), U = r(V)[F]?.parentEventId;
        if (!U)
          continue;
        const z = a.getTargetSnapshot(U);
        z?.status === "deleted" && (J(y, F).parentDeleted || (z.authorPubkey && (et(z.authorPubkey, U), wt(U, z.authorPubkey, { revealKnownParent: !0 })), Ye(y, F)));
      }
    }
  });
  function gr() {
    ne.cancelAndClearFetchTasks(), ne.clearChildRequestTokens(), $e.clear(), Pe.clear(), x && p.reset(), me.clearAll();
  }
  function To() {
    gr(), k && a.reset(), ne.incrementRequestId(), g(V, {}), g(oe, {}), g(_, {}), g(ee, {}), g(fe, {}), g(re, {}), g(ve, {}), g(de, {}), ke.clear(), Ee.clear();
  }
  return Ge(() => {
    t() || To();
  }), Ge(() => {
    if (t())
      return () => {
        gr();
      };
  }), ys(() => {
    a.invalidateScope(Z), gr(), qe(), k && a.reset(), x && p.dispose();
  }), {
    getAnchorState: jn,
    toggleParent: Kn,
    retryParent: Cn,
    toggleNodeParent: Ke,
    retryNodeParent: An,
    toggleChildren: Qo,
    retryChildren: po,
    toggleNodeChildren: yo,
    retryNodeChildren: Mo,
    recordPostedReply: zo,
    recordDeletedEvent: Fa,
    loadCachedChildInteractionStateForPosts: Dn,
    cancelCurrentGraphFetches: gr,
    resetState: To
  };
}
function Mc(t) {
  return !!t && typeof t.use == "function";
}
function tb({
  getShow: t,
  getPubkeyHex: e,
  getRxNostr: n,
  getRelayConfig: o,
  getPosts: i,
  onSavedInboundInteractions: s = () => {
  },
  reconcileDirectReplyCandidates: d
}) {
  const h = hr({
    status: "idle",
    activePubkeyHex: null,
    hasStartedInitialDialogBootstrap: !1
  });
  let u = null, I = 0;
  function f() {
    I += 1, u?.cancel(), u = null, h.status = "idle";
  }
  async function m(P) {
    const T = e(), p = n();
    if (!t() || !T || !Mc(p) || i().length === 0)
      return;
    if (P === "dialog-open-refresh") {
      const Z = await Ad.get(T);
      if (typeof Z?.lastDialogRefreshAt == "number" && Date.now() - Z.lastDialogRefreshAt < bf)
        return;
    }
    f();
    const x = ++I;
    h.status = "syncing";
    const a = P === "dialog-open-refresh" ? Xc.runInbound(p, {
      ownerPubkeyHex: T,
      relayConfig: o(),
      reason: P,
      reconcileDirectReplyCandidates: d
    }) : {
      ...Cf.syncRecent(p, {
        ownerPubkeyHex: T,
        relayConfig: o(),
        reason: P,
        reconcileDirectReplyCandidates: d
      }),
      joinedExisting: !1
    };
    u = a;
    const k = await a.promise;
    x !== I || u !== a || !t() || e() !== T || (u = null, h.status = "idle", !(a.joinedExisting || k.status === "cancelled" || k.changedParentEventIds.length === 0) && (await s(k.changedParentEventIds), Sl({
      source: "dialog-inbound-sync",
      parentEventIds: k.changedParentEventIds,
      rxNostr: p,
      relayConfig: o(),
      isActive: () => t() && e() === T && n() === p
    }).then((Z) => {
      if (!(Z.status === "cancelled" || Z.deletedReactionEventIds.length === 0 && Z.deletedReplyEventIds.length === 0 || !t() || e() !== T || n() !== p))
        return Promise.resolve(s(k.changedParentEventIds)).catch(() => {
        });
    }).catch(() => {
    })));
  }
  async function w() {
    const P = e();
    if (!P)
      return;
    const T = await Ad.get(P);
    await m(T?.lastSyncedAt ? "dialog-open-refresh" : "initial-dialog-bootstrap");
  }
  return Ge(() => {
    const P = e() ?? null;
    P !== h.activePubkeyHex && (f(), h.activePubkeyHex = P, h.hasStartedInitialDialogBootstrap = !1);
  }), Ge(() => {
    if (!t()) {
      f(), h.hasStartedInitialDialogBootstrap = !1;
      return;
    }
    !e() || !Mc(n()) || i().length === 0 || h.hasStartedInitialDialogBootstrap || (h.hasStartedInitialDialogBootstrap = !0, w());
  }), { state: h, cancelCurrentSync: f, runSync: m };
}
const nb = 1024 * 1024, rb = 100, ob = {
  status: "valid",
  ruleVersion: wi
}, el = {
  status: "invalid",
  ruleVersion: wi
};
function ab(t) {
  return t?.ruleVersion === wi && (t.status === "valid" || t.status === "invalid");
}
function hh(t) {
  return t?.status === "valid" && t.ruleVersion === wi;
}
function fh(t) {
  if (xi(t))
    try {
      return `nostr:${Il(t)}\0${t.id}\0${t.sig}`;
    } catch {
    }
  try {
    return `raw:${JSON.stringify(t)}`;
  } catch {
    return "raw:unserializable";
  }
}
function sb(t) {
  if (!xi(t))
    return { ...el };
  try {
    const e = Of(t);
    return _l(e) && Il(e) === e.id && Lf(e) ? { ...ob } : { ...el };
  } catch {
    return { ...el };
  }
}
async function Tc(t, e) {
  for (const { id: n, fingerprint: o, verification: i } of t) {
    const s = await e.get(n);
    !s || fh(s.rawEvent) !== o || await e.update(n, {
      rawEventVerification: i
    });
  }
}
function ib(t, e) {
  const n = (o) => ({
    get: async (i) => o.find((s) => s.id === i),
    update: async (i, s) => {
      const d = o.find((h) => h.id === i);
      d && Object.assign(d, s);
    }
  });
  return {
    post: n(t),
    deletion: n(e)
  };
}
async function lb(t, e, n, o) {
  const i = [
    ...t.map((m) => ({ type: "post", record: m })),
    ...e.map((m) => ({ type: "deletion", record: m }))
  ].filter((m) => !ab(m.record.rawEventVerification)), s = i.length;
  if (s === 0)
    return;
  let d = 0;
  const h = /* @__PURE__ */ new Map(), u = [], I = [];
  async function f() {
    if (u.length > 0) {
      const m = u.splice(0), w = () => Tc(m, n.post);
      await (n.transaction?.post ?? (async (P) => P()))(w);
    }
    if (I.length > 0) {
      const m = I.splice(0), w = () => Tc(m, n.deletion);
      await (n.transaction?.deletion ?? (async (P) => P()))(w);
    }
  }
  o?.({ phase: "verifying", processed: d, total: s });
  for (const m of i) {
    const w = fh(m.record.rawEvent), P = h.get(w) ?? sb(m.record.rawEvent);
    h.set(w, P), m.record.rawEventVerification = P;
    const T = { id: m.record.id, fingerprint: w, verification: P };
    m.type === "post" ? u.push(T) : I.push(T), d += 1, d % rb === 0 && (await f(), o?.({ phase: "verifying", processed: d, total: s }));
  }
  await f(), o?.({ phase: "verifying", processed: s, total: s });
}
function vh(t, e) {
  if (!xi(t) || t.kind !== e)
    return !1;
  try {
    return _l(t) && Il(t) === t.id;
  } catch {
    return !1;
  }
}
function tl(t) {
  return {
    id: t.id,
    pubkey: t.pubkey,
    created_at: t.created_at,
    kind: t.kind,
    tags: t.tags.map((e) => [...e]),
    content: t.content,
    sig: t.sig
  };
}
function Oc(t, e) {
  return t.created_at !== e.created_at ? t.created_at - e.created_at : t.id === e.id ? 0 : t.id < e.id ? -1 : 1;
}
function db(t) {
  return t.rawEvent !== null && t.rawEvent !== void 0;
}
function cb(t, e, n) {
  return !hh(t.rawEventVerification) || !vh(e, 5) || e.pubkey !== n || t.targetAuthorPubkey !== n || t.deletionEventPubkey !== n || e.id !== t.deletionEventId ? !1 : eu(e).includes(t.targetEventId);
}
function ub() {
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
function hb(t, e) {
  if (t.length === 0)
    return {
      blob: new Blob([], { type: "application/x-ndjson;charset=utf-8" }),
      ...e ? { jsonl: "" } : {}
    };
  const n = [];
  let o = "";
  for (const i of t) {
    const s = `${JSON.stringify(i)}
`;
    o.length > 0 && o.length + s.length > nb && (n.push(o), o = ""), o += s;
  }
  return o.length > 0 && n.push(o), {
    blob: new Blob(n, { type: "application/x-ndjson;charset=utf-8" }),
    ...e ? { jsonl: n.join("") } : {}
  };
}
async function fb(t, e, n, o = {}) {
  const i = ub(), s = [], d = [], h = /* @__PURE__ */ new Set(), u = /* @__PURE__ */ new Set(), I = /* @__PURE__ */ new Set(), f = e.filter((k) => k.pubkeyHex === t), m = n.filter(
    (k) => k.targetAuthorPubkey === t
  ), w = new Map(
    (o.sensitivePayloadRecords ?? []).filter((k) => k.pubkeyHex === t && k.deletedAt === void 0).map((k) => [k.id, k])
  ), P = /* @__PURE__ */ new Set();
  for (const k of f) {
    if (![1, 42, 1111].includes(k.kind))
      continue;
    if (!hh(k.rawEventVerification) || !El(k.rawEvent, k) || !vh(k.rawEvent, k.kind)) {
      i.skippedPostCount += 1;
      continue;
    }
    s.push(tl(k.rawEvent)), h.add(k.eventId), i.exportedPostEventCount += 1;
    const Z = k.rawEvent, V = zc(Z);
    if (!V) continue;
    const _ = w.get(V.eventId)?.rawEvent;
    if (!_ || !Wc(Z, _, V.eventId)) {
      i.missingPayloadEventCount += 1;
      continue;
    }
    P.has(_.id) || (P.add(_.id), s.push(tl(_)), i.exportedPayloadEventCount += 1);
  }
  const T = /* @__PURE__ */ new Map();
  for (const k of m) {
    const Z = T.get(k.deletionEventId) ?? [];
    Z.push(k), T.set(k.deletionEventId, Z);
  }
  for (const k of T.values()) {
    const Z = k.find((V) => cb(V, V.rawEvent, t));
    if (Z) {
      const V = tl(Z.rawEvent);
      d.push(V);
      for (const oe of eu(V))
        u.add(oe);
      i.exportedDeletionEventCount += 1;
      continue;
    }
    for (const V of k)
      I.add(V.targetEventId);
    k.every((V) => !db(V)) ? i.missingDeletionRawEventCount += 1 : i.invalidDeletionRawEventCount += 1;
  }
  const p = /* @__PURE__ */ new Set();
  for (const k of f)
    ![1, 42, 1111].includes(k.kind) || k.deletedAt === void 0 || !h.has(k.eventId) || u.has(k.eventId) || I.has(k.eventId) || p.add(k.eventId);
  i.missingDeletionRawEventCount += p.size, s.sort(Oc), d.sort(Oc);
  const x = [...s, ...d];
  i.exportedEventCount = x.length, i.isPartial = i.skippedPostCount > 0 || i.missingDeletionRawEventCount > 0 || i.invalidDeletionRawEventCount > 0 || i.missingPayloadEventCount > 0, o.onProgress?.({ phase: "creating" });
  const a = hb(x, o.includeJsonl === !0);
  return { result: i, ...a };
}
async function vb(t) {
  const e = t.postRecords.filter(
    (i) => i.pubkeyHex === t.pubkeyHex
  ), n = t.deletionRecords.filter(
    (i) => i.targetAuthorPubkey === t.pubkeyHex
  ), o = t.verificationStores ?? ib(e, n);
  return await lb(
    e,
    n,
    o,
    t.onProgress
  ), fb(
    t.pubkeyHex,
    e,
    n,
    t
  );
}
function Lc() {
  return {
    jsonl: "",
    exportedEventCount: 0,
    exportedPostEventCount: 0,
    exportedDeletionEventCount: 0,
    skippedPostCount: 0,
    missingDeletionRawEventCount: 0,
    invalidDeletionRawEventCount: 0,
    exportedPayloadEventCount: 0,
    missingPayloadEventCount: 0,
    isPartial: !1
  };
}
class gb {
  postHistoryRepository;
  deletionRequestsRepository;
  workerFactory;
  sensitivePayloadRepository;
  constructor(e = {}) {
    this.postHistoryRepository = e.postHistoryRepository ?? ct, this.deletionRequestsRepository = e.deletionRequestsRepository ?? Vs, this.workerFactory = e.workerFactory ?? (() => new Worker(
      new URL(
        /* @vite-ignore */
        "" + new URL("postHistoryJsonlExportWorker-BT0zxH3l.js", import.meta.url).href,
        import.meta.url
      ),
      { type: "module" }
    )), this.sensitivePayloadRepository = e.sensitivePayloadRepository ?? Pl;
  }
  exportForPubkeyInWorker(e, n = {}) {
    if (!e) {
      const { jsonl: o, ...i } = Lc();
      return Promise.resolve({
        result: i,
        blob: new Blob([], { type: "application/x-ndjson;charset=utf-8" })
      });
    }
    return new Promise((o, i) => {
      const s = this.workerFactory();
      let d = !1;
      const h = () => {
        s.onmessage = null, s.onerror = null, n.signal?.removeEventListener("abort", I), s.terminate();
      }, u = (f) => {
        d || (d = !0, h(), i(f));
      }, I = () => u(new DOMException("Export aborted", "AbortError"));
      if (n.signal?.aborted) {
        I();
        return;
      }
      n.signal?.addEventListener("abort", I, { once: !0 }), s.onmessage = (f) => {
        const m = f.data;
        if (m.type === "progress") {
          n.onProgress?.(m.progress);
          return;
        }
        if (m.type === "error") {
          u(new Error(m.message));
          return;
        }
        if (m.type === "complete") {
          if (d) return;
          d = !0, h(), o({ result: m.result, blob: m.blob });
        }
      }, s.onerror = () => u(new Error("post_history_export_worker_failed")), s.postMessage({ type: "export", pubkeyHex: e });
    });
  }
  /**
   * Compatibility API for non-UI callers and detailed tests. It delegates
   * to the same engine used by the production Worker; the Worker path asks
   * the engine for a Blob without joining the complete JSONL string.
   */
  async exportForPubkey(e) {
    if (!e)
      return Lc();
    const [n, o, i] = await Promise.all([
      this.postHistoryRepository.getAll({ pubkeyHex: e }),
      this.deletionRequestsRepository.getAllForTargetAuthorPubkey(e),
      this.sensitivePayloadRepository.getAllForPubkey(e)
    ]), s = await vb({
      pubkeyHex: e,
      postRecords: n,
      deletionRecords: o,
      sensitivePayloadRecords: i,
      includeJsonl: !0
    });
    return {
      ...s.result,
      jsonl: s.jsonl ?? ""
    };
  }
}
const pb = new gb();
var yb = Q('<div class="xmark-icon svg-icon svelte-uxr0i8"></div>'), mb = Q('<p role="status"> </p>'), bb = Q('<h3 class="post-history-current-month-heading svelte-uxr0i8"><button type="button" class="post-history-current-month svelte-uxr0i8"> </button></h3>'), Cb = Q('<div class="post-history-heading-summary svelte-uxr0i8"><div class="post-history-summary-row svelte-uxr0i8"><span class="post-history-summary-line post-history-summary-count svelte-uxr0i8"> </span></div></div>'), Pb = Q('<div class="more-icon svg-icon"></div>'), wb = Q('<div class="search-icon svg-icon svelte-uxr0i8" aria-hidden="true"></div> <span> </span>', 1), xb = Q('<div class="repair-icon svg-icon svelte-uxr0i8" aria-hidden="true"></div> <span> </span>', 1), Sb = Q('<div class="return-to-latest-icon svg-icon" aria-hidden="true"></div> <span> </span>', 1), Rb = Q('<div class="calendar-icon svg-icon" aria-hidden="true"></div> <span> </span>', 1), Ib = Q('<div class="jump-to-oldest-icon svg-icon" aria-hidden="true"></div> <span> </span>', 1), _b = Q('<div class="export-icon svg-icon" aria-hidden="true"></div> <span> </span>', 1), Eb = Q('<div class="import-icon svg-icon svelte-uxr0i8" aria-hidden="true"></div> <span> </span>', 1), Ab = Q('<div class="trash-icon svg-icon" aria-hidden="true"></div> <span> </span>', 1), Db = Q('<div class="post-history-menu-body"><!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!></div>'), kb = Q("<!> <!>", 1), Mb = Q('<div class="search-icon svg-icon svelte-uxr0i8"></div>'), Tb = Q('<div class="xmark-icon svg-icon svelte-uxr0i8" aria-hidden="true"></div>'), Ob = Q('<div class="post-history-search-row svelte-uxr0i8"><div><div class="post-history-search-leading svelte-uxr0i8" aria-hidden="true"><!></div> <input class="post-history-search-input svelte-uxr0i8" type="search"/></div> <!></div>'), Lb = Q('<div class="calendar-icon svg-icon" aria-hidden="true"></div>'), Fb = Q('<span class="post-history-date-picker-nav-icon post-history-date-picker-nav-icon-left svg-icon svelte-uxr0i8" aria-hidden="true"></span>'), Hb = Q('<span class="post-history-date-picker-nav-icon post-history-date-picker-nav-icon-right svg-icon svelte-uxr0i8" aria-hidden="true"></span>'), Nb = Q('<button type="button" class="post-history-date-picker-year-nav" aria-label="Previous year"><span class="post-history-date-picker-year-nav-icon post-history-date-picker-year-nav-icon-left svg-icon" aria-hidden="true"></span></button> <!> <!> <!> <button type="button" class="post-history-date-picker-year-nav" aria-label="Next year"><span class="post-history-date-picker-year-nav-icon post-history-date-picker-year-nav-icon-right svg-icon" aria-hidden="true"></span></button>', 1), $b = Q("<!> <!>", 1), Bb = Q("<!> <!>", 1), qb = Q("<!> <!> <!>", 1), Ub = Q('<div class="jump-icon svg-icon svelte-uxr0i8" aria-hidden="true"></div>'), Vb = Q('<div class="xmark-icon svg-icon svelte-uxr0i8" aria-hidden="true"></div>'), jb = Q('<div class="post-history-utility-panel svelte-uxr0i8"><div class="post-history-utility-label svelte-uxr0i8" id="post-history-jump-date-label"> </div> <div class="post-history-utility-controls svelte-uxr0i8"><!> <!> <!></div></div>'), Kb = Q('<div class="post-history-list-loading svelte-uxr0i8" aria-hidden="true"><!></div>'), Yb = Q('<div class="empty-state svelte-uxr0i8"><div class="empty-message svelte-uxr0i8"> </div></div>'), Qb = Q('<div class="keyboard-arrow-up-icon svg-icon" aria-hidden="true"></div> ', 1), zb = Q('<div class="post-history-nav-row post-history-nav-row-top svelte-uxr0i8"><!></div>'), Wb = Q('<div class="post-history-auto-load-sentinel post-history-auto-load-newer-sentinel svelte-uxr0i8"><!></div>'), Jb = Q('<div aria-hidden="true"><!></div>'), Gb = Q('<div class="post-history-channel-row svelte-uxr0i8"><span class="channel-icon svg-icon svelte-uxr0i8" aria-hidden="true"></span> <span class="channel-label svelte-uxr0i8"> </span> <span class="channel-name svelte-uxr0i8"> </span></div>'), Zb = Q('<span class="deleted-badge svelte-uxr0i8"> </span>'), Xb = Q('<span class="delete-failed svelte-uxr0i8"> </span>'), e0 = Q('<div class="post-meta-inline svelte-uxr0i8"><!> <!></div>'), t0 = Q('<div class="more-icon svg-icon"></div>'), n0 = Q('<div class="calendar-icon svg-icon" aria-hidden="true"></div> <span> </span>', 1), r0 = Q("<!> <!>", 1), o0 = Q('<div class="post-history-menu-body"><div class="post-history-menu-timestamp"> </div> <!> <!> <!></div>'), a0 = Q("<!> <!>", 1), s0 = Q('<span class="svelte-uxr0i8"> </span> <!>', 1), i0 = Q('<div class="post-preview-header svelte-uxr0i8"><!> <div class="post-preview-header-right svelte-uxr0i8"><!> <!></div></div>'), l0 = Q('<div class="post-preview-quotes svelte-uxr0i8"></div>'), d0 = Q('<div class="open-in-new-icon svg-icon" aria-hidden="true"></div> <span class="svelte-uxr0i8"> </span>', 1), c0 = Q('<div aria-hidden="true"></div> <span class="svelte-uxr0i8"> </span>', 1), u0 = Q('<div class="calendar-icon svg-icon" aria-hidden="true"></div> <span class="svelte-uxr0i8"> </span>', 1), h0 = Q("<!> <!> <!> <!> <!>", 1), f0 = Q('<li><div class="post-history-main svelte-uxr0i8"><div class="post-preview svelte-uxr0i8"><!> <!> <div class="post-history-thread-anchor-post svelte-uxr0i8"><div class="post-preview-body svelte-uxr0i8"><!></div> <!> <!> <!></div></div></div></li>'), v0 = Q('<div class="post-history-auto-load-sentinel svelte-uxr0i8"><!></div>'), g0 = Q('<div class="post-history-auto-load-slot svelte-uxr0i8" aria-hidden="true"><!></div>'), p0 = Q('<div class="post-history-sparse-state svelte-uxr0i8" role="status"><p class="svelte-uxr0i8"> </p> <p class="svelte-uxr0i8"> </p></div>'), y0 = Q('<div class="cloud-download-icon svg-icon" aria-hidden="true"></div> ', 1), m0 = Q('<div class="keyboard-arrow-down-icon svg-icon" aria-hidden="true"></div> ', 1), b0 = Q('<div class="post-history-saved-boundary svelte-uxr0i8" role="status"><div class="post-history-saved-boundary-actions svelte-uxr0i8"><!> <!></div></div>'), C0 = Q('<div class="keyboard-arrow-down-icon svg-icon" aria-hidden="true"></div> ', 1), P0 = Q('<div class="post-history-nav-row post-history-nav-row-bottom svelte-uxr0i8"><!></div>'), w0 = Q('<div class="keyboard-arrow-down-icon svg-icon" aria-hidden="true"></div> ', 1), x0 = Q('<div class="post-history-nav-row post-history-nav-row-bottom svelte-uxr0i8"><!></div>'), S0 = Q('<div class="cloud-download-icon svg-icon" aria-hidden="true"></div> ', 1), R0 = Q('<div class="post-history-exhausted-state svelte-uxr0i8"><!></div>'), I0 = Q('<div class="post-history-search-bottom-spacer svelte-uxr0i8" aria-hidden="true"></div>'), _0 = Q('<!> <!> <ul class="post-history-list svelte-uxr0i8"></ul> <!> <!> <!>', 1), E0 = Q('<div class="vertical-align-top-icon svg-icon" aria-hidden="true"></div>'), A0 = Q('<div class="post-history-latest-row svelte-uxr0i8"><!></div>'), D0 = Q('<!> <div class="post-history-heading svelte-uxr0i8"><div class="post-history-heading-main svelte-uxr0i8"><!></div> <div class="post-history-heading-actions svelte-uxr0i8"><!> <!> <!></div></div> <!> <!> <div><!></div> <!> <!> <!>', 1), k0 = Q('<div class="delete-confirm-body svelte-uxr0i8"><p class="delete-confirm-description svelte-uxr0i8"> </p> <p class="delete-confirm-warning svelte-uxr0i8"> </p></div>'), M0 = Q('<div class="delete-confirm-body svelte-uxr0i8"><p class="delete-confirm-description svelte-uxr0i8"> </p></div>'), T0 = Q("<div> </div>"), O0 = Q("<div> </div>"), L0 = Q("<div> </div>"), F0 = Q("<!> <!> <!> <!> <!> <!> <!>", 1);
const H0 = {
  hash: "svelte-uxr0i8",
  code: `.post-history-dialog.dialog {top:0;translate:-50% 0;height:100svh;max-height:100svh;--btn-post-preview-action-hover: var(--svg);}.post-history-dialog.dialog.dialog-container-layout {height:100%;max-height:100%;}.post-history-dialog .dialog-content {position:relative;flex:1 1 auto;min-height:0;max-height:none;overflow:hidden;padding:0;}.post-history-heading.svelte-uxr0i8 {display:flex;align-items:stretch;justify-content:space-between;width:100%;height:48px;min-height:48px;flex:0 0 48px;overflow:hidden;padding:0;border-bottom:1px solid var(--border-hr);}.post-history-heading-main.svelte-uxr0i8 {flex:1 1 auto;min-width:0;align-self:stretch;}.post-history-current-month-heading.svelte-uxr0i8 {display:flex;align-items:center;height:100%;margin:0;}.post-history-current-month.svelte-uxr0i8 {color:var(--text-light);font-size:1.75rem;line-height:1.05;font-weight:600;letter-spacing:-0.04em;min-width:0;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;padding:0 12px;--btn-bg: var(--dialog-bg);--text: var(--text-light);}.post-history-heading-actions.svelte-uxr0i8 {display:flex;align-items:center;justify-content:flex-end;align-self:stretch;flex:0 0 auto;min-width:0;gap:4px;white-space:nowrap;}
            .post-history-action-button,
            .post-history-thread-toggle-button
         {color:var(--btn-post-preview-action);}
            .post-history-action-button .svg-icon,
            .post-history-thread-toggle-button .svg-icon
         {--svg: currentColor;}.post-history-heading-summary.svelte-uxr0i8 {display:flex;align-items:center;color:var(--text-muted);font-size:0.875rem;}.post-history-summary-row.svelte-uxr0i8 {display:flex;align-items:center;justify-content:flex-end;gap:8px;min-width:0;}.post-history-summary-line.svelte-uxr0i8 {overflow-wrap:anywhere;}.post-history-summary-count.svelte-uxr0i8 {flex:0 0 auto;white-space:nowrap;text-align:end;}.post-history-repair-button {white-space:nowrap;padding:6px 10px;font-size:0.82rem;}.post-history-search-row.svelte-uxr0i8 {display:flex;align-items:center;width:100%;}.post-history-search-input-wrapper.svelte-uxr0i8 {position:relative;flex:1 1 auto;min-width:0;border:1px solid var(--border-soft);background:var(--background);color:var(--text);font:inherit;border-bottom:1px solid var(--border-hr);}.post-history-search-leading.svelte-uxr0i8 {display:flex;position:absolute;inset:0 auto 0 0;width:40px;align-items:center;justify-content:center;color:var(--text-muted);pointer-events:none;}.post-history-search-leading .search-icon,
    .post-history-search-leading .inline-spinner {width:24px;height:24px;}.post-history-search-leading .loading-placeholder {width:24px;height:24px;flex:0 0 24px;}.post-history-search-active.svelte-uxr0i8 {border-bottom-color:color-mix(
            in srgb,
            var(--theme),
            var(--border-hr) 55%
        );}.post-history-search-input.svelte-uxr0i8 {display:block;width:100%;min-width:0;padding:10px 12px 10px 40px;border:0;background:transparent;color:inherit;font:inherit;}.post-history-search-close.square {flex:0 0 auto;min-height:40px;aspect-ratio:1;padding:0;background:var(--btn-bg);.svg-icon {width:28px;height:28px;}}.post-history-search-input.svelte-uxr0i8::placeholder {color:var(--text-muted);}.post-history-utility-panel.svelte-uxr0i8 {display:flex;flex-direction:column;padding:6px 16px 6px;border-bottom:1px solid var(--border-hr);gap:2px;}.post-history-utility-label.svelte-uxr0i8 {color:var(--text-muted);font-size:0.82rem;}.post-history-utility-controls.svelte-uxr0i8 {display:flex;flex-wrap:wrap;gap:4px;align-items:center;}.post-history-date-picker-input {display:inline-flex;align-items:stretch;gap:2px;min-width:0;padding:6px;height:40px;border:1px solid var(--border-hr);background:var(--background);color:var(--text);font:inherit;}.post-history-date-picker-segment {display:inline-flex;align-items:center;justify-content:center;min-width:1ch;height:auto;color:var(--text-muted);&[role="spinbutton"] {min-width:3ch;}&[data-segment="year"] {min-width:5ch;}}.post-history-date-picker-trigger {flex:0 0 auto;min-width:40px;min-height:40px;padding:0;}.post-history-date-picker-trigger .svg-icon {mask-image:var(--ehagaki-icon-63616c656e6461725f746f6461795f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);width:24px;height:24px;}.post-history-date-picker-content {z-index:110;background-color:var(--dialog-bg2);border:1px solid var(--border-soft);border-radius:8px;padding:8px;box-shadow:0 12px 28px rgb(0 0 0 / 0.16);}.post-history-date-picker-calendar {display:flex;flex-direction:column;gap:6px;}.post-history-date-picker-header {display:flex;align-items:center;justify-content:space-between;gap:8px;}.post-history-date-picker-heading {flex:1 1 auto;text-align:center;font-size:0.9rem;font-weight:600;}.post-history-date-picker-nav,
    .post-history-date-picker-year-nav {display:inline-flex;align-items:center;justify-content:center;width:30px;height:30px;border:1px solid var(--border-soft);border-radius:6px;background-color:var(--btn-bg2);color:var(--text);}.post-history-date-picker-nav-icon,
    .post-history-date-picker-year-nav-icon {width:24px;height:24px;background-color:currentColor;}.post-history-date-picker-nav-icon-left {margin-inline-end:1px;mask-image:var(--ehagaki-icon-6b6579626f6172645f6172726f775f6c6566745f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.post-history-date-picker-nav-icon-right {margin-inline-start:1px;mask-image:var(--ehagaki-icon-6b6579626f6172645f6172726f775f72696768745f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.post-history-date-picker-year-nav-icon-left {mask-image:var(--ehagaki-icon-6b6579626f6172645f646f75626c655f6172726f775f6c6566745f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.post-history-date-picker-year-nav-icon-right {mask-image:var(--ehagaki-icon-6b6579626f6172645f646f75626c655f6172726f775f72696768745f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.post-history-date-picker-grid {border-collapse:separate;border-spacing:2px;}.post-history-date-picker-weekday {color:var(--text-muted);font-size:0.74rem;font-weight:500;text-align:center;}.post-history-date-picker-day {display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:6px;font-size:0.86rem;}.post-history-date-picker-day[data-selected] {background:color-mix(in srgb, var(--theme), white 10%);color:white;}.post-history-date-picker-day[data-disabled] {opacity:0.45;}.post-history-utility-button {height:auto;min-height:40px;white-space:nowrap;}.post-history-utility-button.post-history-utility-submit-button,
    .post-history-utility-button.post-history-utility-close-button {min-width:70px;min-height:40px;}.post-history-nav-row.svelte-uxr0i8 {display:flex;justify-content:center;width:100%;padding:8px 16px;}.post-history-nav-row-top.svelte-uxr0i8 {padding-bottom:0;}.post-history-nav-row-bottom.svelte-uxr0i8 {padding-top:0;}.post-history-search-bottom-spacer.svelte-uxr0i8 {
        /* Clear the 50px return-to-latest button and its 12px bottom inset. */height:62px;}.post-history-auto-load-sentinel.svelte-uxr0i8 {display:grid;width:100%;min-height:24px;place-items:center;}.post-history-auto-load-slot.svelte-uxr0i8 {display:grid;height:24px;min-height:24px;place-items:center;}.post-history-auto-load-newer-slot.svelte-uxr0i8:not(.post-history-auto-load-newer-slot-reserved) {height:0;min-height:0;}.post-history-nav-button.primary {opacity:1;}.post-history-nav-button:not(.primary) {min-height:50px;white-space:nowrap;gap:4px;}.post-history-exhausted-state.svelte-uxr0i8 {display:flex;flex-direction:column;gap:10px;align-items:center;padding:0 16px 8px 16px;}.post-history-latest-row.svelte-uxr0i8 {position:absolute;inset:auto 16px 12px auto;display:flex;justify-content:flex-end;width:auto;margin:0;padding:0;z-index:3;.post-history-latest-button {min-width:50px;min-height:50px;background-color:color-mix(in srgb, var(--theme) 15%, transparent);backdrop-filter:blur(1px);.vertical-align-top-icon {mask-image:var(--ehagaki-icon-766572746963616c5f616c69676e5f746f705f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);width:26px;height:26px;opacity:0.6;}}}.post-history-container.svelte-uxr0i8 {flex:1 1 auto;min-height:0;width:100%;overflow-y:auto;}.post-history-container.post-history-auto-load-enabled.svelte-uxr0i8 {overflow-anchor:none;}.empty-state.svelte-uxr0i8 {display:grid;gap:8px;min-height:100px;align-content:center;}.post-history-list-loading.svelte-uxr0i8 {display:grid;min-height:100px;place-items:center;}.empty-message.svelte-uxr0i8 {display:flex;justify-content:center;align-items:center;height:100px;color:var(--text-muted);font-size:1rem;}.status-loading-placeholder {justify-content:flex-end;width:auto;max-width:min(38vw, 240px);min-width:0;overflow:hidden;flex:0 1 auto;white-space:nowrap;column-gap:0;color:var(--text-muted);font-size:0.8rem;line-height:1.3;height:auto;}.status-loading-placeholder .loader-container {.square {background:currentColor;}}.status-loading-placeholder .placeholder-text {color:inherit;font-size:inherit;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.status-error {color:var(--danger);}.status-loading-placeholder.status-error .square {background-color:var(--danger);}.post-history-list.svelte-uxr0i8 {width:100%;margin:0;padding:0;list-style:none;}.post-history-item.svelte-uxr0i8 {display:flex;align-items:center;border-bottom:1px solid var(--border-hr-light);padding:6px;}.post-history-item.svelte-uxr0i8:last-child {border-bottom:none;}.post-history-item-deleted.svelte-uxr0i8 .post-meta-inline:where(.svelte-uxr0i8) > :where(.svelte-uxr0i8):not(.deleted-badge),
    .post-history-item-deleted.svelte-uxr0i8 .post-preview-body:where(.svelte-uxr0i8) {opacity:0.65;}.post-history-main.svelte-uxr0i8 {display:flex;flex-direction:column;flex:1 1 0;min-width:0;gap:2px;}.post-preview-header.svelte-uxr0i8 {display:flex;align-items:center;justify-content:space-between;gap:8px;color:var(--text-muted);font-size:0.875rem;line-height:1.3;}.post-preview-header-right.svelte-uxr0i8 {display:flex;align-items:center;gap:2px;flex-shrink:0;margin-inline-start:auto;}.post-preview-header-right.svelte-uxr0i8 > span:where(.svelte-uxr0i8) {white-space:nowrap;}.post-history-menu-content .menu-action-button .calendar-icon {mask-image:var(--ehagaki-icon-63616c656e6461725f746f6461795f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);background-color:currentColor;}.post-history-menu-content .menu-action-button .find_in_page-icon {mask-image:var(--ehagaki-icon-66696e645f696e5f706167655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);background-color:currentColor;}.post-history-menu-content .menu-action-button .broadcast-icon {mask-image:var(--ehagaki-icon-63656c6c5f746f7765725f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);background-color:currentColor;}.post-history-menu-content .menu-action-button .raw-json-icon {mask-image:var(--ehagaki-icon-646174615f6f626a6563745f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);background-color:currentColor;}.post-history-menu-content .menu-action-button .export-icon {mask-image:var(--ehagaki-icon-75706c6f61645f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);background-color:currentColor;}.post-history-menu-content .menu-action-button .import-icon {mask-image:var(--ehagaki-icon-646f776e6c6f61645f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);background-color:currentColor;}
            .post-history-menu-content
                .menu-action-button
                .collapse-content-icon
         {mask-image:var(--ehagaki-icon-636f6c6c617073655f636f6e74656e745f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);background-color:currentColor;width:24px;height:24px;}
            .post-history-menu-content
                .menu-action-button
                .return-to-latest-icon
         {mask-image:var(--ehagaki-icon-766572746963616c5f616c69676e5f746f705f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);background-color:currentColor;}
            .post-history-menu-content .menu-action-button .jump-to-oldest-icon
         {mask-image:var(--ehagaki-icon-766572746963616c5f616c69676e5f626f74746f6d5f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);background-color:currentColor;}.post-history-nav-button .keyboard-arrow-up-icon {mask-image:var(--ehagaki-icon-6b6579626f6172645f6172726f775f75705f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);width:28px;height:28px;}.post-history-nav-button .keyboard-arrow-down-icon {mask-image:var(--ehagaki-icon-6b6579626f6172645f6172726f775f646f776e5f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);width:28px;height:28px;}.post-history-nav-button .cloud-download-icon {mask-image:var(--ehagaki-icon-636c6f75645f646f776e6c6f61645f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);width:28px;height:28px;}.post-history-nav-loading-placeholder .loader-container .square {background-color:currentColor;}.post-preview.svelte-uxr0i8 {display:flex;flex-direction:column;min-width:0;color:var(--text);font-size:1rem;}.post-history-thread-anchor-post.svelte-uxr0i8 {display:flex;flex-direction:column;min-width:0;}.post-history-channel-row.svelte-uxr0i8 {display:flex;align-items:center;gap:6px;min-width:0;color:var(--text-muted);font-size:0.875rem;line-height:1.3;}.channel-icon.svelte-uxr0i8 {width:18px;height:18px;flex-shrink:0;mask-image:var(--ehagaki-icon-666f72756d5f323464705f3030303030305f46494c4c315f776768743430305f47524144305f6f70737a32342e737667);background-color:currentColor;}.channel-label.svelte-uxr0i8 {flex-shrink:0;}.channel-name.svelte-uxr0i8 {min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.post-preview-body.svelte-uxr0i8 {display:flex;flex-direction:column;padding-inline-start:1rem;gap:4px;.post-preview-content:where(.svelte-uxr0i8) {overflow-wrap:anywhere;white-space:pre-wrap;font-size:1rem;line-height:1.5;}.post-preview-media:where(.svelte-uxr0i8) {display:block;}.post-preview-quotes:where(.svelte-uxr0i8) {display:flex;flex-direction:column;gap:4px;margin-inline-start:-1rem;}}.post-history-thread-toggle-button.selected {--btn-bg: var(--post-history-preview-footer-surface, var(--dialog-bg));color:var(--text-light);}

    @media (hover: hover) and (pointer: fine) {
                .post-history-thread-toggle-button.selected:hover:not(:disabled)
             {background-color:light-dark(
                color-mix(in srgb, var(--dialog-bg), black 20%),
                color-mix(in srgb, var(--dialog-bg), white 30%)
            );color:light-dark(
                color-mix(in srgb, var(--text), black 20%),
                color-mix(in srgb, var(--text), white 30%)
            );}
    }.post-meta-inline.svelte-uxr0i8 {margin-inline-start:auto;display:flex;align-items:center;gap:6px;}.deleted-badge.svelte-uxr0i8 {padding:2px 6px;border-radius:999px;background:color-mix(in srgb, var(--danger), transparent 82%);color:var(--danger);font-weight:600;}.delete-failed.svelte-uxr0i8 {color:var(--danger);}.delete-confirm-body.svelte-uxr0i8 {display:flex;flex-direction:column;justify-content:center;gap:0.5rem;margin:10px 0 30px 0;margin-inline:auto;text-align:start;}.delete-confirm-description.svelte-uxr0i8,
    .delete-confirm-warning.svelte-uxr0i8 {line-height:1.5;margin:0;}.delete-confirm-warning.svelte-uxr0i8 {color:var(--text-light);font-size:0.875rem;}.copy-icon {mask-image:var(--ehagaki-icon-66696c655f636f70795f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.search-icon.svelte-uxr0i8 {mask-image:var(--ehagaki-icon-7365617263685f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.repair-icon.svelte-uxr0i8 {mask-image:var(--ehagaki-icon-726566726573685f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.post-history-saved-boundary.svelte-uxr0i8,
    .post-history-sparse-state.svelte-uxr0i8 {display:grid;gap:8px;margin:16px 0;padding:12px;border:1px solid var(--border-hr);border-radius:10px;color:var(--text-muted);background:color-mix(in srgb, var(--bg-input) 72%, transparent);}.post-history-saved-boundary.svelte-uxr0i8 {padding:0;border:0;border-radius:0;background:transparent;}.post-history-saved-boundary.svelte-uxr0i8 p:where(.svelte-uxr0i8),
    .post-history-sparse-state.svelte-uxr0i8 p:where(.svelte-uxr0i8) {margin:0;}.post-history-saved-boundary-actions.svelte-uxr0i8 {display:flex;width:fit-content;max-width:100%;box-sizing:border-box;justify-self:center;flex-wrap:wrap;justify-content:center;align-items:flex-start;gap:8px;}.post-history-saved-boundary-actions .post-history-nav-button {height:52px;}

    @media (max-width: 600px) {.post-history-saved-boundary-actions.svelte-uxr0i8 {width:min(100%, 320px);flex-direction:column;align-items:center;}.post-history-saved-boundary-actions .post-history-nav-button {width:100%;flex:0 0 52px;}
    }.import-icon.svelte-uxr0i8 {mask-image:var(--ehagaki-icon-636c6f75645f646f776e6c6f61645f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.trash-icon {mask-image:var(--ehagaki-icon-64656c6574655f666f72657665725f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.xmark-icon.svelte-uxr0i8 {mask-image:var(--ehagaki-icon-636c6f73655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.jump-icon.svelte-uxr0i8 {mask-image:var(--ehagaki-icon-6b6579626f6172645f7461625f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}`
};
function N0(t, e) {
  Wt(e, !0), Ko(t, H0);
  const n = () => Aa(_f, "$locale", i), o = () => Aa(Xa, "$_", i), [i, s] = Za(), d = ou().overlayTarget, h = 200;
  let u = R(e, "show", 15, !1), I = R(e, "onClose", 7), f = R(e, "onReplyPost", 7, void 0), m = R(e, "onQuotePost", 7, void 0), w = R(e, "pubkeyHex", 7, null), P = R(e, "rxNostr", 7, void 0), T = R(e, "relayConfig", 7, null), p = R(e, "latestPostedEvent", 7, null), x = R(e, "inboundInteractionSave", 7, null), a = R(e, "authoredSelfPostSave", 7, null), k = R(e, "reconcileInboundDirectReplyCandidates", 7, void 0), Z = R(e, "notifySavedAuthoredPosts", 7, void 0);
  const V = Dl({ getShow: () => u(), getRxNostr: () => P() }), oe = pd({
    getShow: () => u(),
    getRxNostr: () => P(),
    getRelayConfig: () => T(),
    profileSyncCoordinator: V
  }), _ = gm({
    getShow: () => u(),
    getPubkeyHex: () => w(),
    getRxNostr: () => P(),
    getRelayConfig: () => T(),
    getSessionScrollState: () => Ke.readCurrentSessionScrollState(),
    onSessionScrollStateInvalidated: () => Ke.clearAllSessionScrollAnchorsForCurrentPubkey(),
    onSavedAuthoredPosts: async (c) => {
      await Z()?.(c);
    },
    onChildInteractionBadgeRefreshRequested: (c, H) => me.loadCachedChildInteractionStateForPosts(c, H),
    onQuoteVisibleRangeRefreshRequested: (c) => fe.refreshQuotePreviews(c),
    quoteVisibleRangeRepairExecutor: async (c, H) => {
      const pe = he(H.visiblePosts);
      pe.length !== 0 && await oe.ensureTargets(pe);
    },
    pageSize: Gc
  }), ee = dy({
    getShow: () => u(),
    getPosts: () => _.posts,
    getRxNostr: () => P(),
    getRelayConfig: () => T(),
    getIsSearchMode: () => _.isSearchMode
  }), fe = xy({
    getShow: () => u(),
    getPosts: () => _.posts,
    getRxNostr: () => P(),
    getRelayConfig: () => T(),
    relatedTargetResolver: oe,
    profileSyncCoordinator: V
  });
  function he(c) {
    const H = Ya.buildIndex(c);
    return Object.values(H.contextsByEventId).map((pe) => Ya.toDescriptor(pe, "post-history-listing-quote-visible-range-repair"));
  }
  const me = eb({
    getShow: () => u(),
    getPubkeyHex: () => w(),
    getRxNostr: () => P(),
    getRelayConfig: () => T(),
    relatedTargetResolver: oe,
    profileSyncCoordinator: V
  });
  function ke() {
    const c = /* @__PURE__ */ new Map(), H = (ye, lt) => {
      !ye || _.posts.some((Mt) => Mt.eventId === ye) || c.set(ye, Array.from(/* @__PURE__ */ new Set([...c.get(ye) ?? [], ...lt])));
    }, pe = (ye) => {
      ye && (H(ye.node.eventId, ye.node.relayUrls), pe(ye.parentNodeState), ye.replyNodeStates.forEach(pe));
    };
    for (const ye of _.posts) {
      const lt = me.getAnchorState(ye);
      pe(lt.parentNodeState), lt.replyNodeStates.forEach(pe);
      for (const Mt of fe.getQuotePreviews(ye))
        Mt.status === "resolved" && H(Mt.event.id, Mt.relayHints);
    }
    return Array.from(c, ([ye, lt]) => ({ eventId: ye, relayHints: lt }));
  }
  let Ee = C(ke);
  const $e = qf({
    getShow: () => u(),
    getPubkeyHex: () => w(),
    getRxNostr: () => P(),
    getRelayConfig: () => T(),
    getTargets: () => r(Ee),
    profileSync: V
  });
  tb({
    getShow: () => u(),
    getPubkeyHex: () => w(),
    getRxNostr: () => P(),
    getRelayConfig: () => T(),
    getPosts: () => _.posts,
    onSavedInboundInteractions: (c) => me.loadCachedChildInteractionStateForPosts(_.posts, c),
    reconcileDirectReplyCandidates: (c) => k()?.(c) ?? Promise.resolve({
      changedParentEventIds: [],
      savedDirectReplyCount: 0,
      unresolvedParentEventIds: c.map((H) => H.classification.parentEventId).filter((H) => !!H)
    })
  });
  const Pe = Uf(), re = cy();
  function ve() {
    const c = /* @__PURE__ */ new Date(), H = `${c.getFullYear()}`, pe = `${c.getMonth() + 1}`.padStart(2, "0"), ye = `${c.getDate()}`.padStart(2, "0");
    return Ll(`${H}-${pe}-${ye}`);
  }
  let de = be(!1), j = be("none"), ne = be(!1), xe = 0, Le = be(hr(ve())), Fe = be(hr(ve())), D = be(!1), J = null, L = be(!1), G = be(!1), ue = be(!1), B = be(hr({ phase: "loading" })), Ae, ae, je = be(!1), ie = be("postHistory.exportComplete"), qe = be(hr({})), Ze, bt = be(!1), Ct = be(null), _t = be(hr([])), ln = be(0), Xe = be(hr({})), ut = be(hr({})), it = be(!1), X = be(0), nt = be(0), St = be("postHistory.broadcastSent"), dn, jn = be(void 0), vt = be(hr({})), Yt = be(hr([])), et = be(-1), wt = be(!1), rt = be(null), en = be(null), gt = be(!1), Pt = be(!1), Qt = be(null), cn = be(0), Rt = !1, $t = !1, It = !1, bn = !1, Lt = null, Ye = null, tn = 0, ht = null, nn = null;
  const rn = typeof IntersectionObserver < "u";
  let un = be(!1), xr = null, ar = be(null), Kn = be(!1);
  const Cn = Vf({
    getShow: () => u(),
    getPosts: () => _.posts.map((c) => ({
      ...c,
      content: kd(c.content, c.tags)
    })),
    getContainer: () => r(rt)
  }), Ke = Cm({
    getShow: () => u(),
    getPubkeyHex: () => w(),
    getPosts: () => _.posts,
    getLocale: () => n(),
    getContainer: () => r(rt),
    getIsSearchMode: () => _.isSearchMode,
    getSearchQuery: () => _.state.searchQuery
  }), An = Pf({
    getShow: () => u(),
    getEmojiUrls: () => r(ha),
    onStateChanged: () => Cn.remeasure()
  });
  function On(c) {
    const H = kd(c.content, c.tags), pe = rc({ ...c, content: H });
    return ol({
      kind: c.kind,
      sourceContent: H,
      displayContent: pe,
      tags: c.tags,
      media: c.media
    });
  }
  function Pn(c) {
    return If({
      ownerPubkey: w(),
      structure: c,
      rxNostr: P(),
      relayConfig: T()
    });
  }
  let fr = C(() => {
    const c = {};
    for (const H of _.posts)
      c[H.eventId] = On(H);
    return c;
  }), vr = C(() => _.currentViewRefetchStatusMessageKey ?? _.syncStatusMessageKey), Sr = C(() => _.currentViewRefetchStatusMessageKey ? _.currentViewRefetchStatusMessageValues : null), vo = C(() => _.syncStatus === "failed" || _.currentViewRefetchStatusMessageKey === "postHistory.repairFetchFailed"), Xn = C(() => _.canReturnToLatest || !Ke.isHistoryScrolledToTop), go = C(() => _.canJumpToOldest || !Ke.isHistoryScrolledToBottom), Io = C(() => _.isSearchMode ? _.searchResultStatus === "loading" : _.initialLocalLoadStatus === "loading"), to = C(() => _.posts.length === 0 && (_.isSearchMode ? _.searchResultStatus === "ready" : _.initialLocalLoadStatus === "ready"));
  function kr(c, H) {
    H[c.id] || (H[c.id] = ol({
      kind: c.kind,
      sourceContent: c.content,
      tags: c.tags
    }));
  }
  function no(c, H, pe) {
    if (!(!c || pe.has(c.node.eventId))) {
      pe.add(c.node.eventId), kr(c.node.event, H), no(c.parentNodeState, H, pe);
      for (const ye of c.replyNodeStates)
        no(ye, H, pe);
    }
  }
  let Hr = C(() => {
    const c = {};
    for (const H of _.posts) {
      const pe = /* @__PURE__ */ new Set();
      for (const lt of y(H))
        lt.status === "resolved" && kr(lt.event, c);
      const ye = me.getAnchorState(H);
      ye.parentNode && kr(ye.parentNode.event, c), no(ye.parentNodeState, c, pe);
      for (const lt of ye.replyNodeStates)
        no(lt, c, pe);
    }
    return c;
  }), ha = C(() => {
    const c = /* @__PURE__ */ new Set();
    for (const H of [
      ...Object.values(r(fr)),
      ...Object.values(r(Hr))
    ])
      for (const pe of H.previewContent.emojiUrls)
        c.add(pe);
    for (const H of _.posts) {
      const pe = me.getAnchorState(H);
      if (r(vt)[H.eventId])
        for (const ye of pe.reactionReadModel.groups)
          ye.emojiUrl && c.add(ye.emojiUrl);
    }
    for (const H of r(Ee)) {
      if (!r(vt)[H.eventId]) continue;
      const pe = De(H.eventId);
      for (const ye of pe?.groups ?? [])
        ye.emojiUrl && c.add(ye.emojiUrl);
    }
    return [...c];
  });
  function Oa() {
    xe += 1, V.reset(), re.resetState(), Zt(), Te(), Pe.resetDeleteConfirmation(), g(G, !1), g(bt, !1), g(Ct, null), g(de, !1), g(j, "none"), g(ne, !1), g(Le, ve(), !0), g(Fe, ve(), !0), g(D, !1), g(L, !1), g(Xe, {}, !0), g(ut, {}, !0), Md(), g(vt, {}, !0), An.resetState(), g(Yt, [], !0), g(et, -1), g(wt, !1);
  }
  function Nr() {
    Ae?.abort();
  }
  function Qr() {
    xe += 1;
    const c = _.isSearchMode;
    c && Ke.clearCurrentSessionScrollAnchor(), _.resetSearchState(), _.prepareForClose() ? Ke.clearAllSessionScrollAnchorsForCurrentPubkey() : c || Ke.saveCurrentSessionScrollAnchor(), ee.cancelCurrentChannelResolution(), me.cancelCurrentGraphFetches(), Pe.resetDeleteConfirmation(), g(G, !1), g(bt, !1), g(Ct, null), g(de, !1), g(L, !1), re.hideCopyFloatingMessage(), Zt(), Te(), Nr(), g(wt, !1), g(Yt, [], !0), g(et, -1), u(!1), I()?.();
  }
  function _o(c) {
    return c instanceof Element && c.closest(".ehagaki-pswp") !== null;
  }
  function Eo(c) {
    _o(c.target) && c.preventDefault();
  }
  function fa(c) {
    r(wt) && c.preventDefault();
  }
  wf(() => u(), Qr, !0), tu(() => {
    const c = rn && !_.isSearchMode && _.state.listingMode === "contiguous" && !r(ne) && _.state.hasNewerLocal;
    Vr(() => r(un)) !== c && (xr = { anchor: Ke.captureHistoryScrollAnchor() }, g(un, c, !0));
  }), Ge(() => {
    r(un);
    const c = Vr(() => xr);
    c && (Ke.restoreHistoryScrollAnchor(c.anchor), xr = null);
  }), Ge(() => {
    u() || (Nr(), Oa());
  }), Ge(() => {
    r(ue) && ae && w() !== ae && Nr();
  }), Ge(() => {
    if (!u() || !r(Io)) {
      g(Kn, !1);
      return;
    }
    g(Kn, !1);
    const c = setTimeout(
      () => {
        u() && r(Io) && g(Kn, !0);
      },
      h
    );
    return () => {
      clearTimeout(c);
    };
  }), Ge(() => {
    const c = r(rt);
    if (!c) {
      Lt = null, Ye = null, g(Qt, null);
      return;
    }
    const H = () => {
      const ye = Math.max(0, c.clientHeight);
      if (Lt !== c) {
        Lt = c, Ye = ye, g(Qt, ye, !0);
        return;
      }
      Ye !== ye && (Ye = ye, g(Qt, ye, !0), tn += 1, g(cn, tn, !0));
    };
    if (H(), typeof ResizeObserver > "u")
      return;
    const pe = new ResizeObserver(H);
    return pe.observe(c), () => {
      pe.disconnect(), Lt === c && (Lt = null, Ye = null, g(Qt, null));
    };
  }), Ge(() => {
    const c = r(en), H = r(rt), pe = r(Qt), ye = r(cn);
    if (!(u() && !!c && !!H && pe !== null && pe > 0 && !_.isSearchMode && _.state.listingMode === "contiguous" && _.state.hasOlderLocal && !_.isRefetchingAroundCurrentView) || !rn) {
      Rt = !1, It = !1, ht = null;
      return;
    }
    const Mt = ht, hn = Mt?.scrollTop, er = Mt?.root === H && Mt.sentinel === c && Mt.resizeGeneration !== ye;
    ht = { root: H, sentinel: c, resizeGeneration: ye, scrollTop: H.scrollTop };
    let Sn = !1, fn = !0, Un = !1, Br = H.scrollTop;
    const vn = () => {
      const nr = H.getBoundingClientRect(), Ln = c.getBoundingClientRect();
      return Ln.left < nr.right && Ln.right > nr.left && Ln.top <= nr.bottom + pe * 2 && Ln.bottom >= nr.top;
    }, tr = () => {
      if (!fn || !Un)
        return;
      const nr = H.scrollTop, Ln = nr > Br;
      Br = nr, !(!Un || !Ln || !It || !vn()) && (Un = !1, H.removeEventListener("scroll", tr), Qo());
    }, so = new IntersectionObserver(
      (nr) => {
        if (!fn)
          return;
        const Ln = nr.some((Ir) => Ir.isIntersecting), pr = !Sn;
        if (Sn = !0, It = Ln, !Ln) {
          Un = !1, H.removeEventListener("scroll", tr), Rt && !r(gt) && (Rt = !1);
          return;
        }
        if (pr && er && typeof hn == "number" && H.scrollTop <= hn) {
          Un = Ln, Un && H.addEventListener("scroll", tr, { passive: !0 });
          return;
        }
        Un = !1, H.removeEventListener("scroll", tr), Qo();
      },
      {
        root: H,
        rootMargin: `0px 0px ${pe * 2}px 0px`,
        threshold: 0
      }
    );
    return so.observe(c), () => {
      fn = !1, Un = !1, H.removeEventListener("scroll", tr), so.disconnect();
    };
  }), Ge(() => {
    const c = r(rt), H = r(Qt), pe = r(cn);
    if (!(u() && !!c && H !== null && H > 0 && !_.isSearchMode && _.state.listingMode === "contiguous" && _.state.hasNewerLocal && r(un) && !r(ne) && !_.isRefetchingAroundCurrentView) || !rn) {
      $t = !1, bn = !1, nn = null;
      return;
    }
    const lt = nn, Mt = lt?.scrollTop;
    let hn = !0, er = () => {
    }, Sn = null;
    return Bo().then(() => {
      hn && (Sn = requestAnimationFrame(() => {
        if (Sn = null, !hn)
          return;
        const fn = c.querySelector(".post-history-auto-load-newer-sentinel");
        if (!fn || r(rt) !== c)
          return;
        const Un = lt?.root === c && lt.sentinel === fn && lt.resizeGeneration !== pe;
        nn = { root: c, sentinel: fn, resizeGeneration: pe, scrollTop: c.scrollTop };
        let Br = !1, vn = !1, tr = c.scrollTop;
        const so = () => {
          const pr = c.getBoundingClientRect(), Ir = fn.getBoundingClientRect();
          return Ir.left < pr.right && Ir.right > pr.left && Ir.bottom >= pr.top - H * 2 && Ir.top <= pr.bottom;
        }, nr = () => {
          if (!hn || !vn)
            return;
          const pr = c.scrollTop, Ir = pr < tr;
          tr = pr, !(!vn || !Ir || !bn || !so()) && (vn = !1, c.removeEventListener("scroll", nr), yo());
        }, Ln = new IntersectionObserver(
          (pr) => {
            if (!hn)
              return;
            const Ir = pr.some((Fo) => Fo.isIntersecting), ss = !Br;
            if (Br = !0, bn = Ir, !Ir) {
              vn = !1, c.removeEventListener("scroll", nr), $t && !r(Pt) && ($t = !1);
              return;
            }
            if (ss && Un && typeof Mt == "number" && c.scrollTop >= Mt) {
              vn = Ir, vn && c.addEventListener("scroll", nr, { passive: !0 });
              return;
            }
            vn = !1, c.removeEventListener("scroll", nr), yo();
          },
          {
            root: c,
            rootMargin: `${H * 2}px 0px 0px 0px`,
            threshold: 0
          }
        );
        Ln.observe(fn), er = () => {
          c.removeEventListener("scroll", nr), Ln.disconnect();
        };
      }));
    }), () => {
      hn = !1, Sn !== null && cancelAnimationFrame(Sn), er();
    };
  }), ys(() => {
    xe += 1, Nr(), Md(), V.dispose(), Te();
  }), Ge(() => {
    if (!u() || !p()?.id)
      return;
    const c = p().id;
    J !== c && (_.posts, me.recordPostedReply(p(), _.posts).then((H) => {
      H && (J = c);
    }).catch(() => {
    }));
  }), Ge(() => {
    const c = _.posts;
    !u() || c.length === 0 || (xf(c.map((H) => H.eventId)).catch(() => {
    }), Vr(() => me.loadCachedChildInteractionStateForPosts(c)));
  }), Ge(() => {
    const c = x()?.revision ?? 0, H = x()?.parentEventIds ?? [], pe = _.posts;
    !u() || c <= 0 || H.length === 0 || (Vr(() => me.loadCachedChildInteractionStateForPosts(pe, H)), Sl({
      source: "dialog-inbound-save",
      parentEventIds: H,
      rxNostr: P(),
      relayConfig: T(),
      isActive: () => u()
    }).then((ye) => {
      if (!(!u() || ye.deletedReactionEventIds.length === 0 && ye.deletedReplyEventIds.length === 0))
        return me.loadCachedChildInteractionStateForPosts(_.posts, ye.checkedParentEventIds);
    }).catch(() => {
    }));
  }), Ge(() => {
    const c = a()?.revision ?? 0;
    !u() || c <= 0 || _.isSearchMode || _.canReturnToLatest || Vr(() => _.returnToLatest());
  }), Ge(() => {
    if (u())
      return () => {
        ee.cancelCurrentChannelResolution();
      };
  });
  function ro(c) {
    return c ? c.values ? o()(c.key, { values: c.values }) : o()(c.key) : null;
  }
  function Ao() {
    return ro(Qf({
      totalCount: _.displayTotalCount,
      totalCountKnown: _.displayTotalCountKnown,
      totalCountStatus: _.displayTotalCountStatus,
      isSearchMode: _.isSearchMode
    }));
  }
  function Do(c) {
    if (!c)
      return null;
    const H = Number(c.year), pe = Number(c.month), ye = Number(c.day), Mt = new Date(H, pe - 1, ye, 23, 59, 59, 999).getTime();
    return Number.isFinite(Mt) ? Math.floor(Mt / 1e3) : null;
  }
  function Dn() {
    return o()(qd({ direction: "older", isSearchMode: _.isSearchMode }));
  }
  function Yo() {
    return o()(qd({ direction: "newer", isSearchMode: _.isSearchMode }));
  }
  async function Mr() {
    const c = _.isSearchMode, H = c ? Ke.captureHistoryScrollAnchor() : null;
    await _.loadOlder() && c && Ke.restoreHistoryScrollAnchor(H);
  }
  function La() {
    return u() && !_.isSearchMode && _.state.listingMode === "contiguous" && _.state.hasOlderLocal && !_.isRefetchingAroundCurrentView;
  }
  function ko() {
    let c = null;
    return {
      captureAnchorEventId: () => (c = Ke.captureHistoryScrollAnchor(), c?.eventId ?? null),
      canCommitWindowChange: (H, pe, ye) => Ke.canCommitAutoLoadWindowChange(H, pe, ye),
      onCommitted: () => {
        S(), Ke.restoreHistoryScrollAnchor(c, { flushUpdates: !1 });
      }
    };
  }
  async function Qo() {
    if (!(r(gt) || Rt || !La())) {
      g(gt, !0), Rt = !0;
      try {
        await _.loadOlder(ko());
      } finally {
        g(gt, !1), It || (Rt = !1);
      }
    }
  }
  function po() {
    return u() && !_.isSearchMode && _.state.listingMode === "contiguous" && _.state.hasNewerLocal && !r(ne) && !_.isRefetchingAroundCurrentView;
  }
  async function yo() {
    if (!(r(Pt) || $t || !po())) {
      g(Pt, !0), $t = !0;
      try {
        await _.loadNewer(ko());
      } finally {
        g(Pt, !1), bn || ($t = !1);
      }
    }
  }
  async function Mo() {
    await _.showSavedOlderPosts() && Ke.resetHistoryScrollSoon();
  }
  async function zo() {
    const c = Ke.captureHistoryScrollAnchor(), H = r(rt)?.scrollTop ?? null;
    _.state.loadedPosts.length, r(rt)?.scrollHeight, r(rt)?.clientHeight;
    const pe = await _.fetchOlderFromRelays({ anchorEventId: c?.eventId });
    let ye = !1;
    pe && H !== null && u() && r(rt) && (ye = Ke.restoreHistoryScrollAnchor(c), ye || (r(rt).scrollTop = H)), _.latestOlderBackfillUiResult, r(rt)?.scrollTop, r(rt)?.scrollHeight;
  }
  async function Fa() {
    const c = _.isSearchMode ? null : Ke.captureHistoryScrollAnchor();
    await _.loadNewer() && (_.isSearchMode ? Ke.resetHistoryScrollSoon() : Ke.restoreHistoryScrollAnchor(c));
  }
  async function gr() {
    Ke.clearAllSessionScrollAnchorsForCurrentPubkey();
    const c = _.canReturnToLatest ? await _.returnToLatest() : !1;
    g(ne, !1), (c || !Ke.isHistoryScrolledToTop) && Ke.resetHistoryScrollSoon();
  }
  async function To() {
    const c = Do(r(Le));
    if (c === null)
      return;
    Ke.clearAllSessionScrollAnchorsForCurrentPubkey(), g(ne, !0);
    const H = await _.jumpToCreatedAt(c);
    H || g(ne, !1), H && (g(j, "none"), g(D, !1), Ke.resetHistoryScrollSoon());
  }
  function l(c) {
    return r(fr)[c.eventId] ?? On(c);
  }
  function y(c) {
    return fe.getQuotePreviews(c);
  }
  function F(c) {
    return r(Xe)[c.eventId] === "sending";
  }
  function $(c) {
    return r(Xe)[c.eventId] === "failed";
  }
  function U(c) {
    return r(ut)[c.eventId] === "sending";
  }
  function z(c) {
    return Jf(c) !== null;
  }
  function ce(c) {
    const H = me.getAnchorState(c).repliesActionState;
    return ro(Wf(H)) ?? "";
  }
  function Me(c) {
    return !!r(vt)[c.eventId];
  }
  function le(c) {
    return !!r(vt)[c];
  }
  function Se(c) {
    g(
      vt,
      {
        ...r(vt),
        [c]: !r(vt)[c]
      },
      !0
    );
  }
  function De(c) {
    const H = _.posts.find((pe) => pe.eventId === c);
    return H ? me.getAnchorState(H).reactionReadModel : $e.getReadModel(c);
  }
  function Ne(c) {
    const H = De(c);
    return ro(Bd({
      visible: le(c),
      reactionCount: H?.totalCount ?? 0
    })) ?? "";
  }
  function Be(c) {
    const H = me.getAnchorState(c).reactionSummary.totalCount;
    return ro(Bd({ visible: Me(c), reactionCount: H })) ?? "";
  }
  function pt(c) {
    Se(c.eventId);
  }
  function yt(c) {
    const H = me.getAnchorState(c).repliesActionState;
    if (H.status === "failed" || H.status === "loaded" && H.replyCount === 0) {
      me.retryChildren(c);
      return;
    }
    me.toggleChildren(c);
  }
  function Et(c) {
    return $d(c, w());
  }
  function Ve(c) {
    Et(c) && Pe.openDeleteConfirm(c);
  }
  async function tt(c, H) {
    if (U(c))
      return;
    const pe = Rr(c, H);
    g(ut, { ...r(ut), [c.eventId]: "sending" }, !0);
    const ye = await zf.broadcast({ post: c, rxNostr: P() });
    g(ut, { ...r(ut), [c.eventId]: void 0 }, !0), zr(pe, ye);
  }
  function Zt() {
    dn && (clearTimeout(dn), dn = void 0), g(it, !1), g(jn, void 0);
  }
  function Xt(c, H) {
    g(
      jn,
      {
        eventId: c.eventId,
        ...si(H.clientX, H.clientY)
      },
      !0
    );
  }
  function Rr(c, H) {
    if (r(jn)?.eventId === c.eventId)
      return {
        x: r(jn).x,
        y: r(jn).y
      };
    const pe = H.currentTarget, ye = pe instanceof HTMLElement ? pe.getBoundingClientRect() : null;
    return si(ye ? ye.left + ye.width / 2 : 0, ye ? ye.bottom + 8 : 0);
  }
  function zr(c, H) {
    dn && clearTimeout(dn), g(X, c.x, !0), g(nt, c.y, !0), g(
      St,
      H.success ? (H.rejectedRelays?.length ?? 0) > 0 || (H.timedOutRelays?.length ?? 0) > 0 ? "postHistory.broadcastPartial" : "postHistory.broadcastSent" : "postHistory.broadcastFailed",
      !0
    ), g(it, !0), dn = setTimeout(
      () => {
        g(it, !1), dn = void 0;
      },
      1800
    );
  }
  function we(c) {
    const H = Date.now(), pe = c.node.event.created_at * 1e3;
    return {
      id: c.node.eventId,
      eventId: c.node.eventId,
      pubkeyHex: c.node.authorPubkey,
      kind: c.node.event.kind,
      content: c.node.event.content,
      tags: c.node.event.tags.map((ye) => [...ye]),
      createdAt: pe,
      postedAt: pe,
      relayHints: [...c.node.relayUrls],
      acceptedRelays: [...c.node.relayUrls],
      fetchedRelays: [...c.node.relayUrls],
      media: [],
      rawEvent: c.node.event,
      updatedAt: H,
      schemaVersion: 1
    };
  }
  function Qe(c) {
    const H = Date.now(), pe = c.created_at * 1e3;
    return {
      id: c.id,
      eventId: c.id,
      pubkeyHex: c.pubkey,
      kind: c.kind,
      content: c.content,
      tags: c.tags.map((ye) => [...ye]),
      createdAt: pe,
      postedAt: pe,
      relayHints: [],
      acceptedRelays: [],
      fetchedRelays: [],
      media: [],
      rawEvent: c,
      updatedAt: H,
      schemaVersion: 1
    };
  }
  function wn(c, H) {
    return `quote-preview:${c}:${H}`;
  }
  function kn(c, H) {
    H && Pe.closeAllPostItemMenus(), Pe.setPostMenuOpen(c, H);
  }
  function Ft(c, H = []) {
    g(Ct, c, !0), g(_t, [...H], !0), g(ln, r(ln) + 1), g(bt, !0);
  }
  function mo(c, H) {
    const pe = P(), ye = w();
    return Rf({
      structure: c,
      relayHints: r(_t),
      rxNostr: pe,
      relayConfig: T(),
      signal: H
    }).then((lt) => H.aborted || pe !== P() || ye !== w() ? null : lt);
  }
  function Ha(c, H) {
    return Pn(c)?.observe?.(H) ?? (() => {
    });
  }
  function ts(c) {
    Ft(c.node.event, c.node.relayUrls);
  }
  function Wo(c) {
    return re.copyState[c] === "failed";
  }
  function Na(c) {
    return r(ut)[c] === "sending";
  }
  function Jo(c, H) {
    re.captureCopyPointerPosition(we(c), H);
  }
  function Go(c, H) {
    re.handleCopyNevent(we(c), H);
  }
  function ns(c) {
    Oo(we(c));
  }
  function $a() {
    return {
      client: Td.externalNostrClient,
      customUrlTemplate: Td.externalNostrClientCustomUrl
    };
  }
  function Zo() {
    const c = Af($a());
    return c ? o()("postHistory.openInExternalClient", { values: { client: c } }) : o()("postHistory.openInExternalClientFallback");
  }
  function Oo(c) {
    const H = Df(c, $a(), Qc.value);
    H && window.open(H, "_blank", "noopener,noreferrer");
  }
  function va(c, H) {
    Xt(we(c), H);
  }
  function rs(c, H) {
    tt(we(c), H);
  }
  function Ba(c) {
    return $d(we(c), w());
  }
  function os(c) {
    return r(Xe)[c] === "sending";
  }
  function ga(c) {
    const H = we(c);
    Et(H) && Pe.openDeleteConfirm(H);
  }
  async function Lo(c) {
    f() && await f()(c) !== !1 && Qr();
  }
  function pa(c) {
    m() && (m()(c), Qr());
  }
  function as() {
    Pe.cancelDeleteConfirm();
  }
  async function Xo() {
    await Bo(), r(j) === "search" && r(ar)?.focus({ preventScroll: !0 });
  }
  function v() {
    if (r(j) === "search") {
      b(), g(L, !1);
      return;
    }
    g(j, "search"), g(L, !1), Xo();
  }
  function b() {
    Ke.clearCurrentSessionScrollAnchor(), g(j, "none"), _.resetSearchState();
  }
  async function E(c) {
    const H = ++xe;
    g(ne, !0);
    const pe = await _.jumpToEventId(c.eventId);
    if (!(H !== xe || !u())) {
      if (!pe) {
        g(ne, !1);
        return;
      }
      Ke.clearAllSessionScrollAnchorsForCurrentPubkey(), g(j, "none"), _.resetSearchState(), Ke.scrollHistoryEventToTopSoon(c.eventId);
    }
  }
  function q() {
    const c = r(j) !== "jump-date";
    g(j, c ? "jump-date" : "none", !0), c || g(D, !1), g(L, !1);
  }
  function Y() {
    g(j, "none"), g(D, !1);
  }
  function se(c) {
    const H = r(Fe) ?? r(Le);
    !H || c === 0 || g(Fe, H.add({ years: c }), !0);
  }
  function ge() {
    g(de, !0), g(L, !1);
  }
  function Ue() {
    g(G, !0), g(L, !1);
  }
  function Te() {
    Ze && (clearTimeout(Ze), Ze = void 0), g(je, !1);
  }
  function We() {
    const c = /* @__PURE__ */ new Date();
    return [
      String(c.getFullYear()).padStart(4, "0"),
      String(c.getMonth() + 1).padStart(2, "0"),
      String(c.getDate()).padStart(2, "0")
    ].join("-");
  }
  function _e(c) {
    Te(), g(
      ie,
      c.isPartial ? "postHistory.exportPartial" : "postHistory.exportComplete",
      !0
    ), g(
      qe,
      {
        exported: c.exportedEventCount,
        skipped: c.skippedPostCount + c.missingDeletionRawEventCount + c.invalidDeletionRawEventCount
      },
      !0
    ), g(je, !0), Ze = setTimeout(
      () => {
        g(je, !1), Ze = void 0;
      },
      5e3
    );
  }
  async function Bt() {
    if (!w() || r(ue))
      return;
    g(ue, !0), g(B, { phase: "loading" }, !0);
    const c = new AbortController();
    Ae = c, ae = w(), g(L, !1), Te();
    try {
      const { result: H, blob: pe } = await pb.exportForPubkeyInWorker(w(), {
        signal: c.signal,
        onProgress: (Mt) => {
          g(B, Mt, !0);
        }
      });
      if (c.signal.aborted)
        return;
      const ye = URL.createObjectURL(pe), lt = document.createElement("a");
      lt.href = ye, lt.download = `ehagaki-post-history-${We()}.jsonl`, lt.style.display = "none", d.appendChild(lt), lt.click(), setTimeout(
        () => {
          lt.remove(), URL.revokeObjectURL?.(ye);
        },
        1e3
      ), _e(H);
    } catch (H) {
      if (c.signal.aborted || H instanceof DOMException && H.name === "AbortError")
        return;
      g(ie, "postHistory.exportFailed"), g(qe, {}, !0), g(je, !0), Ze = setTimeout(
        () => {
          g(je, !1), Ze = void 0;
        },
        5e3
      );
    } finally {
      Ae === c && (Ae = void 0, ae = void 0, g(ue, !1));
    }
  }
  async function xn() {
    const c = Ke.captureHistoryScrollAnchor(), H = r(rt)?.scrollTop ?? null;
    await _.refreshAfterLocalImport(), !_.isSearchMode && r(rt) && !Ke.restoreHistoryScrollAnchor(c) && H !== null && (r(rt).scrollTop = H);
  }
  function ze() {
    g(L, !1), _.refetchAroundCurrentView();
  }
  function Ht() {
    Ke.clearAllSessionScrollAnchorsForCurrentPubkey(), g(L, !1), _.jumpToOldest().then((c) => {
      (c || !Ke.isHistoryScrolledToBottom) && Ke.resetHistoryScrollToBottomSoon();
    });
  }
  function At() {
    g(L, !1), gr();
  }
  function Wr() {
    g(de, !1);
  }
  function bo(c) {
    g(Yt, c.mediaList, !0), g(et, c.index, !0), g(wt, c.mediaList.length > 0 && c.index >= 0, !0);
  }
  function $r(c) {
    g(et, c, !0);
  }
  function Co() {
    g(wt, !1), g(Yt, [], !0), g(et, -1);
  }
  let oo = be(!1);
  Ge(() => {
    u() || g(oo, !1);
  });
  async function Cs() {
    const c = Pe.deleteTargetPost;
    if (!c)
      return;
    g(
      Xe,
      {
        ...r(Xe),
        [c.eventId]: "sending"
      },
      !0
    );
    const H = await Kf.requestDeletion({ post: c, rxNostr: P() });
    g(oo, H.success && H.sensitivePayloadOmitted === !0, !0), H.success && typeof H.deletedAt == "number" && H.deletionEventId ? (_.patchDeletedPost(c.eventId, H.deletedAt, H.deletionEventId), me.recordDeletedEvent({
      eventId: c.eventId,
      authorPubkey: c.pubkeyHex,
      deletionEvent: H.deletionEvent ?? null,
      deletionEventAttestation: H.deletionEventAttestation
    }).catch(() => {
    }), g(
      Xe,
      {
        ...r(Xe),
        [c.eventId]: void 0
      },
      !0
    )) : g(Xe, { ...r(Xe), [c.eventId]: "failed" }, !0), Pe.clearDeleteTarget();
  }
  async function qa() {
    await _.deleteLocalHistory() && (Ke.clearAllSessionScrollAnchorsForCurrentPubkey(), g(de, !1), g(j, "none"), Ke.resetHistoryScrollSoon());
  }
  var zs = {
    get show() {
      return u();
    },
    set show(c = !1) {
      u(c), S();
    },
    get onClose() {
      return I();
    },
    set onClose(c) {
      I(c), S();
    },
    get onReplyPost() {
      return f();
    },
    set onReplyPost(c = void 0) {
      f(c), S();
    },
    get onQuotePost() {
      return m();
    },
    set onQuotePost(c = void 0) {
      m(c), S();
    },
    get pubkeyHex() {
      return w();
    },
    set pubkeyHex(c = null) {
      w(c), S();
    },
    get rxNostr() {
      return P();
    },
    set rxNostr(c = void 0) {
      P(c), S();
    },
    get relayConfig() {
      return T();
    },
    set relayConfig(c = null) {
      T(c), S();
    },
    get latestPostedEvent() {
      return p();
    },
    set latestPostedEvent(c = null) {
      p(c), S();
    },
    get inboundInteractionSave() {
      return x();
    },
    set inboundInteractionSave(c = null) {
      x(c), S();
    },
    get authoredSelfPostSave() {
      return a();
    },
    set authoredSelfPostSave(c = null) {
      a(c), S();
    },
    get reconcileInboundDirectReplyCandidates() {
      return k();
    },
    set reconcileInboundDirectReplyCandidates(c = void 0) {
      k(c), S();
    },
    get notifySavedAuthoredPosts() {
      return Z();
    },
    set notifySavedAuthoredPosts(c = void 0) {
      Z(c), S();
    }
  }, Tr = F0(), Ua = W(Tr);
  {
    const c = (ye) => {
      var lt = Re(), Mt = W(lt);
      {
        const hn = (er, Sn) => {
          let fn = () => Sn?.().props;
          {
            let Un = C(() => o()("global.close"));
            ur(er, ps(fn, {
              className: "modal-close",
              shape: "square",
              get ariaLabel() {
                return r(Un);
              },
              children: (Br, vn) => {
                var tr = yb();
                Ie((so) => Cr(tr, "aria-label", so), [() => o()("global.close")]), A(Br, tr);
              },
              $$slots: { default: !0 }
            }));
          }
        };
        He(Mt, () => su, (er, Sn) => {
          Sn(er, { child: hn, $$slots: { child: !0 } });
        });
      }
      A(ye, lt);
    };
    let H = C(() => o()("postHistory.title")), pe = C(() => o()("postHistory.description"));
    au(Ua, {
      onOpenChange: (ye) => !ye && Qr(),
      onInteractOutside: Eo,
      onEscapeKeydown: fa,
      trapFocus: !1,
      get title() {
        return r(H);
      },
      get description() {
        return r(pe);
      },
      contentClass: "post-history-dialog",
      footerVariant: "close-button",
      showPagination: !1,
      initialFocus: "content",
      get open() {
        return u();
      },
      set open(ye) {
        u(ye);
      },
      footer: c,
      children: (ye, lt) => {
        var Mt = D0(), hn = W(Mt);
        {
          var er = (Je) => {
            var ft = mb(), Tt = O(ft, !0);
            M(ft), Ie((Qn) => te(Tt, Qn), [() => o()("postHistory.sensitivePayloadDeletionOmitted")]), A(Je, ft);
          };
          Ce(hn, (Je) => {
            r(oo) && Je(er);
          });
        }
        var Sn = N(hn, 2), fn = O(Sn), Un = O(fn);
        {
          var Br = (Je) => {
            var ft = bb(), Tt = O(ft), Qn = O(Tt, !0);
            M(Tt), M(ft), Ie(() => te(Qn, Ke.currentMonthLabel)), oi("click", Tt, q), A(Je, ft);
          };
          Ce(Un, (Je) => {
            Ke.currentMonthLabel && Je(Br);
          });
        }
        M(fn);
        var vn = N(fn, 2), tr = O(vn);
        {
          var so = (Je) => {
            {
              let ft = C(() => r(B).phase === "loading" ? o()("postHistory.exportLoading") : r(B).phase === "verifying" ? o()("postHistory.exportVerifying", {
                values: {
                  processed: r(B).processed ?? 0,
                  total: r(B).total ?? 0
                }
              }) : o()("postHistory.exportCreating"));
              Ka(Je, {
                get text() {
                  return r(ft);
                },
                showLoader: !0,
                loaderSize: 30,
                state: "loading",
                customClass: "status-loading-placeholder"
              });
            }
          }, nr = (Je) => {
            {
              let ft = C(() => r(Sr) ? o()(r(vr), { values: r(Sr) }) : o()(r(vr))), Tt = C(() => _.showStatusLoader ? "loading" : "complete"), Qn = C(() => `status-loading-placeholder${r(vo) ? " status-error" : ""}`);
              Ka(Je, {
                get text() {
                  return r(ft);
                },
                get showLoader() {
                  return _.showStatusLoader;
                },
                loaderSize: 30,
                get state() {
                  return r(Tt);
                },
                get customClass() {
                  return r(Qn);
                }
              });
            }
          };
          Ce(tr, (Je) => {
            r(ue) ? Je(so) : r(vr) && Je(nr, 1);
          });
        }
        var Ln = N(tr, 2);
        {
          var pr = (Je) => {
            var ft = Cb(), Tt = O(ft), Qn = O(Tt), sr = O(Qn, !0);
            M(Qn), M(Tt), M(ft), Ie((io) => te(sr, io), [() => Ao()]), A(Je, ft);
          }, Ir = C(() => Ao());
          Ce(Ln, (Je) => {
            r(Ir) && Je(pr);
          });
        }
        var ss = N(Ln, 2);
        He(ss, () => Nd, (Je, ft) => {
          ft(Je, {
            get open() {
              return r(L);
            },
            set open(Tt) {
              g(L, Tt, !0);
            },
            children: (Tt, Qn) => {
              var sr = kb(), io = W(sr);
              {
                let Ho = C(() => `menu-trigger post-history-menu-trigger post-history-heading-menu-trigger ${r(L) ? "is-open" : ""}`.trim()), zn = C(() => o()("postHistory.openMenu"));
                He(io, () => Fd, (qr, Fn) => {
                  Fn(qr, {
                    get class() {
                      return r(Ho);
                    },
                    get "aria-label"() {
                      return r(zn);
                    },
                    children: (ir, Jr) => {
                      var Ca = Pb();
                      A(ir, Ca);
                    },
                    $$slots: { default: !0 }
                  });
                });
              }
              var lo = N(io, 2);
              He(lo, () => ti, (Ho, zn) => {
                zn(Ho, {
                  get to() {
                    return d;
                  },
                  children: (qr, Fn) => {
                    var ir = Re(), Jr = W(ir);
                    He(Jr, () => Hd, (Ca, ls) => {
                      ls(Ca, {
                        side: "bottom",
                        align: "end",
                        sideOffset: 8,
                        class: "post-history-menu-content",
                        trapFocus: !1,
                        preventScroll: !1,
                        onCloseAutoFocus: (Pa) => Pa.preventDefault(),
                        children: (Pa, ws) => {
                          var dt = Db(), K = O(dt);
                          He(K, () => or, (mt, Nt) => {
                            Nt(mt, {
                              class: "menu-action-button",
                              onSelect: v,
                              children: (Rn, In) => {
                                var yr = wb(), pn = N(W(yr), 2), _n = O(pn, !0);
                                M(pn), Ie((kt) => te(_n, kt), [() => o()("postHistory.showSearch")]), A(Rn, yr);
                              },
                              $$slots: { default: !0 }
                            });
                          });
                          var ot = N(K, 2);
                          {
                            let mt = C(() => !_.canRefetchAroundCurrentView);
                            He(ot, () => or, (Nt, Rn) => {
                              Rn(Nt, {
                                class: "menu-action-button",
                                get disabled() {
                                  return r(mt);
                                },
                                onSelect: ze,
                                children: (In, yr) => {
                                  var pn = xb(), _n = N(W(pn), 2), kt = O(_n, !0);
                                  M(_n), Ie((Hn) => te(kt, Hn), [() => o()("postHistory.repair")]), A(In, pn);
                                },
                                $$slots: { default: !0 }
                              });
                            });
                          }
                          var Dt = N(ot, 2);
                          He(Dt, () => ia, (mt, Nt) => {
                            Nt(mt, { class: "post-history-menu-separator" });
                          });
                          var qt = N(Dt, 2);
                          {
                            let mt = C(() => !r(Xn));
                            He(qt, () => or, (Nt, Rn) => {
                              Rn(Nt, {
                                class: "menu-action-button",
                                get disabled() {
                                  return r(mt);
                                },
                                onSelect: At,
                                children: (In, yr) => {
                                  var pn = Sb(), _n = N(W(pn), 2), kt = O(_n, !0);
                                  M(_n), Ie((Hn) => te(kt, Hn), [() => o()("postHistory.returnToLatest")]), A(In, pn);
                                },
                                $$slots: { default: !0 }
                              });
                            });
                          }
                          var zt = N(qt, 2);
                          He(zt, () => or, (mt, Nt) => {
                            Nt(mt, {
                              class: "menu-action-button",
                              onSelect: q,
                              children: (Rn, In) => {
                                var yr = Rb(), pn = N(W(yr), 2), _n = O(pn, !0);
                                M(pn), Ie((kt) => te(_n, kt), [() => o()("postHistory.jumpToDate")]), A(Rn, yr);
                              },
                              $$slots: { default: !0 }
                            });
                          });
                          var xt = N(zt, 2);
                          {
                            let mt = C(() => !r(go));
                            He(xt, () => or, (Nt, Rn) => {
                              Rn(Nt, {
                                class: "menu-action-button",
                                get disabled() {
                                  return r(mt);
                                },
                                onSelect: Ht,
                                children: (In, yr) => {
                                  var pn = Ib(), _n = N(W(pn), 2), kt = O(_n, !0);
                                  M(_n), Ie((Hn) => te(kt, Hn), [() => o()("postHistory.jumpToOldest")]), A(In, pn);
                                },
                                $$slots: { default: !0 }
                              });
                            });
                          }
                          var gn = N(xt, 2);
                          He(gn, () => ia, (mt, Nt) => {
                            Nt(mt, { class: "post-history-menu-separator" });
                          });
                          var Ot = N(gn, 2);
                          {
                            let mt = C(() => !w() || r(ue));
                            He(Ot, () => or, (Nt, Rn) => {
                              Rn(Nt, {
                                class: "menu-action-button",
                                get disabled() {
                                  return r(mt);
                                },
                                onSelect: Bt,
                                children: (In, yr) => {
                                  var pn = _b(), _n = N(W(pn), 2), kt = O(_n, !0);
                                  M(_n), Ie((Hn) => te(kt, Hn), [() => o()("postHistory.export")]), A(In, pn);
                                },
                                $$slots: { default: !0 }
                              });
                            });
                          }
                          var lr = N(Ot, 2);
                          {
                            let mt = C(() => !w());
                            He(lr, () => or, (Nt, Rn) => {
                              Rn(Nt, {
                                class: "menu-action-button",
                                get disabled() {
                                  return r(mt);
                                },
                                onSelect: Ue,
                                children: (In, yr) => {
                                  var pn = Eb(), _n = N(W(pn), 2), kt = O(_n, !0);
                                  M(_n), Ie((Hn) => te(kt, Hn), [() => o()("postHistory.import")]), A(In, pn);
                                },
                                $$slots: { default: !0 }
                              });
                            });
                          }
                          var Or = N(lr, 2);
                          He(Or, () => ia, (mt, Nt) => {
                            Nt(mt, { class: "post-history-menu-separator" });
                          });
                          var Lr = N(Or, 2);
                          He(Lr, () => or, (mt, Nt) => {
                            Nt(mt, {
                              class: "menu-action-button menu-action-button-danger",
                              onSelect: ge,
                              children: (Rn, In) => {
                                var yr = Ab(), pn = N(W(yr), 2), _n = O(pn, !0);
                                M(pn), Ie((kt) => te(_n, kt), [() => o()("postHistory.deleteLocalHistory")]), A(Rn, yr);
                              },
                              $$slots: { default: !0 }
                            });
                          }), M(dt), A(Pa, dt);
                        },
                        $$slots: { default: !0 }
                      });
                    }), A(qr, ir);
                  },
                  $$slots: { default: !0 }
                });
              }), A(Tt, sr);
            },
            $$slots: { default: !0 }
          });
        }), M(vn), M(Sn);
        var Fo = N(Sn, 2);
        {
          var is = (Je) => {
            var ft = Ob(), Tt = O(ft);
            let Qn;
            var sr = O(Tt), io = O(sr);
            {
              var lo = (Fn) => {
                Ka(Fn, {
                  variant: "spinner",
                  showLoader: !0,
                  loaderSize: 24,
                  ariaHidden: !0,
                  customClass: "post-history-search-spinner"
                });
              }, Ho = (Fn) => {
                var ir = Mb();
                A(Fn, ir);
              };
              Ce(io, (Fn) => {
                _.isSearchPageLoading ? Fn(lo) : Fn(Ho, -1);
              });
            }
            M(sr);
            var zn = N(sr, 2);
            kf(zn), ei(zn, (Fn) => g(ar, Fn), () => r(ar)), M(Tt);
            var qr = N(Tt, 2);
            {
              let Fn = C(() => o()("postHistory.hideSearch"));
              ur(qr, {
                type: "button",
                class: "post-history-search-close",
                contentLayout: "icon",
                shape: "square",
                get ariaLabel() {
                  return r(Fn);
                },
                onClick: b,
                children: (ir, Jr) => {
                  var Ca = Tb();
                  A(ir, Ca);
                },
                $$slots: { default: !0 }
              });
            }
            M(ft), Ie(
              (Fn, ir) => {
                Qn = xo(Tt, 1, "post-history-search-input-wrapper svelte-uxr0i8", null, Qn, { "post-history-search-active": _.isSearchMode }), Cr(zn, "placeholder", Fn), Cr(zn, "aria-label", ir), Cr(zn, "aria-busy", _.isSearchPageLoading ? "true" : "false");
              },
              [
                () => o()("postHistory.searchPlaceholder"),
                () => o()("postHistory.search")
              ]
            ), Ef(zn, () => _.state.searchInput, (Fn) => _.state.searchInput = Fn), A(Je, ft);
          };
          Ce(Fo, (Je) => {
            r(j) === "search" && Je(is);
          });
        }
        var Ps = N(Fo, 2);
        {
          var gh = (Je) => {
            var ft = jb(), Tt = O(ft), Qn = O(Tt, !0);
            M(Tt);
            var sr = N(Tt, 2), io = O(sr);
            {
              let zn = C(() => n() ?? void 0), qr = C(() => o()("postHistory.jumpToDateLabel"));
              He(io, () => zu, (Fn, ir) => {
                ir(Fn, {
                  get locale() {
                    return r(zn);
                  },
                  get calendarLabel() {
                    return r(qr);
                  },
                  get value() {
                    return r(Le);
                  },
                  set value(Jr) {
                    g(Le, Jr, !0);
                  },
                  get placeholder() {
                    return r(Fe);
                  },
                  set placeholder(Jr) {
                    g(Fe, Jr, !0);
                  },
                  get open() {
                    return r(D);
                  },
                  set open(Jr) {
                    g(D, Jr, !0);
                  },
                  children: (Jr, Ca) => {
                    var ls = qb(), Pa = W(ls);
                    {
                      const K = (ot, Dt) => {
                        let qt = () => Dt?.().segments;
                        var zt = Re(), xt = W(zt);
                        sa(xt, 19, qt, (gn, Ot) => `${gn.part}-${Ot}`, (gn, Ot) => {
                          var lr = Re(), Or = W(lr);
                          He(Or, () => Yu, (Lr, mt) => {
                            mt(Lr, {
                              class: "post-history-date-picker-segment",
                              get part() {
                                return r(Ot).part;
                              },
                              children: (Nt, Rn) => {
                                Wa();
                                var In = ca();
                                Ie(() => te(In, r(Ot).value)), A(Nt, In);
                              },
                              $$slots: { default: !0 }
                            });
                          }), A(gn, lr);
                        }), A(ot, zt);
                      };
                      He(Pa, () => Ku, (ot, Dt) => {
                        Dt(ot, {
                          "aria-labelledby": "post-history-jump-date-label",
                          class: "post-history-date-picker-input",
                          children: K,
                          $$slots: { default: !0 }
                        });
                      });
                    }
                    var ws = N(Pa, 2);
                    {
                      let K = C(() => o()("postHistory.jumpToDate"));
                      He(ws, () => Gu, (ot, Dt) => {
                        Dt(ot, {
                          class: "post-history-date-picker-trigger",
                          get "aria-label"() {
                            return r(K);
                          },
                          children: (qt, zt) => {
                            var xt = Lb();
                            A(qt, xt);
                          },
                          $$slots: { default: !0 }
                        });
                      });
                    }
                    var dt = N(ws, 2);
                    He(dt, () => ti, (K, ot) => {
                      ot(K, {
                        get to() {
                          return d;
                        },
                        children: (Dt, qt) => {
                          var zt = Re(), xt = W(zt);
                          He(xt, () => Ju, (gn, Ot) => {
                            Ot(gn, {
                              sideOffset: 8,
                              class: "post-history-date-picker-content",
                              children: (lr, Or) => {
                                var Lr = Re(), mt = W(Lr);
                                {
                                  const Nt = (Rn, In) => {
                                    let yr = () => In?.().months, pn = () => In?.().weekdays;
                                    var _n = Bb(), kt = W(_n);
                                    He(kt, () => Bu, (_r, Ut) => {
                                      Ut(_r, {
                                        class: "post-history-date-picker-header",
                                        children: (Gr, co) => {
                                          var mr = Nb(), Fr = W(mr), Ur = N(Fr, 2);
                                          He(Ur, () => Vu, (on, Vt) => {
                                            Vt(on, {
                                              class: "post-history-date-picker-nav",
                                              "aria-label": "Previous month",
                                              children: (at, $n) => {
                                                var Er = Fb();
                                                A(at, Er);
                                              },
                                              $$slots: { default: !0 }
                                            });
                                          });
                                          var br = N(Ur, 2);
                                          He(br, () => qu, (on, Vt) => {
                                            Vt(on, { class: "post-history-date-picker-heading" });
                                          });
                                          var yn = N(br, 2);
                                          He(yn, () => Uu, (on, Vt) => {
                                            Vt(on, {
                                              class: "post-history-date-picker-nav",
                                              "aria-label": "Next month",
                                              children: (at, $n) => {
                                                var Er = Hb();
                                                A(at, Er);
                                              },
                                              $$slots: { default: !0 }
                                            });
                                          });
                                          var En = N(yn, 2);
                                          oi("click", Fr, () => se(-1)), oi("click", En, () => se(1)), A(Gr, mr);
                                        },
                                        $$slots: { default: !0 }
                                      });
                                    });
                                    var Hn = N(kt, 2);
                                    sa(Hn, 19, yr, (_r, Ut) => `${_r.value.toString()}-${Ut}`, (_r, Ut) => {
                                      var Gr = Re(), co = W(Gr);
                                      He(co, () => Lu, (mr, Fr) => {
                                        Fr(mr, {
                                          class: "post-history-date-picker-grid",
                                          children: (Ur, br) => {
                                            var yn = $b(), En = W(yn);
                                            He(En, () => Nu, (Vt, at) => {
                                              at(Vt, {
                                                children: ($n, Er) => {
                                                  var Bn = Re(), Wn = W(Bn);
                                                  He(Wn, () => vl, (Zr, Jn) => {
                                                    Jn(Zr, {
                                                      children: (an, Vn) => {
                                                        var qn = Re(), Mn = W(qn);
                                                        sa(Mn, 19, pn, (st, Tn) => `${st}-${Tn}`, (st, Tn) => {
                                                          var jt = Re(), rr = W(jt);
                                                          He(rr, () => $u, (dr, Gn) => {
                                                            Gn(dr, {
                                                              class: "post-history-date-picker-weekday",
                                                              children: (cr, wa) => {
                                                                Wa();
                                                                var uo = ca();
                                                                Ie(() => te(uo, r(Tn))), A(cr, uo);
                                                              },
                                                              $$slots: { default: !0 }
                                                            });
                                                          }), A(st, jt);
                                                        }), A(an, qn);
                                                      },
                                                      $$slots: { default: !0 }
                                                    });
                                                  }), A($n, Bn);
                                                },
                                                $$slots: { default: !0 }
                                              });
                                            });
                                            var on = N(En, 2);
                                            He(on, () => Fu, (Vt, at) => {
                                              at(Vt, {
                                                children: ($n, Er) => {
                                                  var Bn = Re(), Wn = W(Bn);
                                                  sa(Wn, 19, () => r(Ut).weeks, (Zr, Jn) => `${r(Ut).value.toString()}-week-${Jn}`, (Zr, Jn) => {
                                                    var an = Re(), Vn = W(an);
                                                    He(Vn, () => vl, (qn, Mn) => {
                                                      Mn(qn, {
                                                        children: (st, Tn) => {
                                                          var jt = Re(), rr = W(jt);
                                                          sa(rr, 19, () => r(Jn), (dr, Gn) => `${dr.toString()}-${Gn}`, (dr, Gn) => {
                                                            var cr = Re(), wa = W(cr);
                                                            He(wa, () => Hu, (uo, na) => {
                                                              na(uo, {
                                                                get date() {
                                                                  return r(Gn);
                                                                },
                                                                get month() {
                                                                  return r(Ut).value;
                                                                },
                                                                children: (ra, ja) => {
                                                                  var oa = Re(), Po = W(oa);
                                                                  He(Po, () => Ou, (_i, wo) => {
                                                                    wo(_i, {
                                                                      class: "post-history-date-picker-day",
                                                                      children: (xa, xs) => {
                                                                        Wa();
                                                                        var ds = ca();
                                                                        Ie(() => te(ds, r(Gn).day)), A(xa, ds);
                                                                      },
                                                                      $$slots: { default: !0 }
                                                                    });
                                                                  }), A(ra, oa);
                                                                },
                                                                $$slots: { default: !0 }
                                                              });
                                                            }), A(dr, cr);
                                                          }), A(st, jt);
                                                        },
                                                        $$slots: { default: !0 }
                                                      });
                                                    }), A(Zr, an);
                                                  }), A($n, Bn);
                                                },
                                                $$slots: { default: !0 }
                                              });
                                            }), A(Ur, yn);
                                          },
                                          $$slots: { default: !0 }
                                        });
                                      }), A(_r, Gr);
                                    }), A(Rn, _n);
                                  };
                                  He(mt, () => Wu, (Rn, In) => {
                                    In(Rn, {
                                      class: "post-history-date-picker-calendar",
                                      children: Nt,
                                      $$slots: { default: !0 }
                                    });
                                  });
                                }
                                A(lr, Lr);
                              },
                              $$slots: { default: !0 }
                            });
                          }), A(Dt, zt);
                        },
                        $$slots: { default: !0 }
                      });
                    }), A(Jr, ls);
                  },
                  $$slots: { default: !0 }
                });
              });
            }
            var lo = N(io, 2);
            {
              let zn = C(() => o()("postHistory.jumpToDateSubmit"));
              ur(lo, {
                type: "button",
                variant: "primary",
                contentLayout: "icon",
                shape: "square",
                get ariaLabel() {
                  return r(zn);
                },
                className: "post-history-utility-button post-history-utility-submit-button",
                onClick: () => void To(),
                children: (qr, Fn) => {
                  var ir = Ub();
                  A(qr, ir);
                },
                $$slots: { default: !0 }
              });
            }
            var Ho = N(lo, 2);
            {
              let zn = C(() => o()("postHistory.hideJumpToDate"));
              ur(Ho, {
                type: "button",
                variant: "default",
                contentLayout: "icon",
                shape: "square",
                get ariaLabel() {
                  return r(zn);
                },
                className: "post-history-utility-button post-history-utility-close-button",
                onClick: Y,
                children: (qr, Fn) => {
                  var ir = Vb();
                  A(qr, ir);
                },
                $$slots: { default: !0 }
              });
            }
            M(sr), M(ft), Ie((zn) => te(Qn, zn), [() => o()("postHistory.jumpToDateLabel")]), A(Je, ft);
          };
          Ce(Ps, (Je) => {
            r(j) === "jump-date" && Je(gh);
          });
        }
        var Va = N(Ps, 2), ph = O(Va);
        {
          var yh = (Je) => {
            var ft = Kb(), Tt = O(ft);
            Ka(Tt, { variant: "spinner", showLoader: !0, loaderSize: 24 }), M(ft), A(Je, ft);
          }, mh = (Je) => {
            var ft = Yb(), Tt = O(ft), Qn = O(Tt, !0);
            M(Tt), M(ft), Ie((sr) => te(Qn, sr), [
              () => _.isSearchMode ? o()("postHistory.searchNoResults") : o()("postHistory.empty")
            ]), A(Je, ft);
          }, bh = (Je) => {
            var ft = _0(), Tt = W(ft);
            {
              var Qn = (dt) => {
                var K = zb(), ot = O(K);
                {
                  let Dt = C(() => !_.canLoadNewer);
                  ur(ot, {
                    type: "button",
                    variant: "default",
                    className: "post-history-nav-button",
                    contentLayout: "iconText",
                    get disabled() {
                      return r(Dt);
                    },
                    onClick: () => void Fa(),
                    children: (qt, zt) => {
                      var xt = Qb(), gn = N(W(xt));
                      Ie((Ot) => te(gn, ` ${Ot ?? ""}`), [() => Yo()]), A(qt, xt);
                    },
                    $$slots: { default: !0 }
                  });
                }
                M(K), A(dt, K);
              };
              Ce(Tt, (dt) => {
                (_.isSearchMode ? _.canLoadNewer : _.state.hasNewerLocal && (r(ne) || !rn || _.state.listingMode !== "contiguous")) && dt(Qn);
              });
            }
            var sr = N(Tt, 2);
            {
              var io = (dt) => {
                var K = Jb();
                let ot;
                var Dt = O(K);
                {
                  var qt = (zt) => {
                    var xt = Wb(), gn = O(xt);
                    {
                      var Ot = (lr) => {
                        Ka(lr, {
                          variant: "spinner",
                          showLoader: !0,
                          loaderSize: 24,
                          ariaHidden: !0
                        });
                      };
                      Ce(gn, (lr) => {
                        r(Pt) && lr(Ot);
                      });
                    }
                    M(xt), A(zt, xt);
                  };
                  Ce(Dt, (zt) => {
                    r(un) && _.state.hasNewerLocal && zt(qt);
                  });
                }
                M(K), Ie(() => ot = xo(K, 1, "post-history-auto-load-slot post-history-auto-load-newer-slot svelte-uxr0i8", null, ot, {
                  "post-history-auto-load-newer-slot-reserved": r(un)
                })), A(dt, K);
              };
              Ce(sr, (dt) => {
                rn && !_.isSearchMode && _.state.listingMode === "contiguous" && !r(ne) && dt(io);
              });
            }
            var lo = N(sr, 2);
            sa(lo, 21, () => _.posts, (dt) => dt.eventId, (dt, K) => {
              const ot = C(() => me.getAnchorState(r(K)));
              var Dt = f0();
              let qt;
              var zt = O(Dt), xt = O(zt), gn = O(xt);
              {
                var Ot = (kt) => {
                  var Hn = i0(), _r = O(Hn);
                  {
                    var Ut = (yn) => {
                      var En = Gb(), on = N(O(En), 2), Vt = O(on, !0);
                      M(on);
                      var at = N(on, 2), $n = O(at, !0);
                      M(at), M(En), Ie(
                        (Er, Bn) => {
                          te(Vt, Er), te($n, Bn);
                        },
                        [
                          () => o()("postHistory.channel"),
                          () => ee.getChannelText(r(K), o())
                        ]
                      ), A(yn, En);
                    };
                    Ce(_r, (yn) => {
                      r(K).kind === 42 && yn(Ut);
                    });
                  }
                  var Gr = N(_r, 2), co = O(Gr);
                  {
                    var mr = (yn) => {
                      var En = e0(), on = O(En);
                      {
                        var Vt = (Bn) => {
                          var Wn = Zb(), Zr = O(Wn, !0);
                          M(Wn), Ie((Jn) => te(Zr, Jn), [() => o()("postHistory.deletedBadge")]), A(Bn, Wn);
                        };
                        Ce(on, (Bn) => {
                          r(K).deletedAt && Bn(Vt);
                        });
                      }
                      var at = N(on, 2);
                      {
                        var $n = (Bn) => {
                          var Wn = Xb(), Zr = O(Wn, !0);
                          M(Wn), Ie((Jn) => te(Zr, Jn), [() => o()("postHistory.deleteFailed")]), A(Bn, Wn);
                        }, Er = C(() => $(r(K)));
                        Ce(at, (Bn) => {
                          r(Er) && Bn($n);
                        });
                      }
                      M(En), A(yn, En);
                    }, Fr = C(() => r(K).deletedAt || $(r(K)));
                    Ce(co, (yn) => {
                      r(Fr) && yn(mr);
                    });
                  }
                  var Ur = N(co, 2);
                  {
                    var br = (yn) => {
                      var En = s0(), on = W(En), Vt = O(on, !0);
                      M(on);
                      var at = N(on, 2);
                      {
                        let $n = C(() => Pe.isPostMenuOpen(r(K).eventId));
                        He(at, () => Nd, (Er, Bn) => {
                          Bn(Er, {
                            get open() {
                              return r($n);
                            },
                            onOpenChange: (Wn) => kn(r(K).eventId, Wn),
                            children: (Wn, Zr) => {
                              var Jn = a0(), an = W(Jn);
                              He(an, () => Fd, (qn, Mn) => {
                                Mn(qn, {
                                  class: "menu-trigger post-history-menu-trigger",
                                  "aria-label": "アクションを表示",
                                  children: (st, Tn) => {
                                    var jt = t0();
                                    A(st, jt);
                                  },
                                  $$slots: { default: !0 }
                                });
                              });
                              var Vn = N(an, 2);
                              He(Vn, () => ti, (qn, Mn) => {
                                Mn(qn, {
                                  get to() {
                                    return d;
                                  },
                                  children: (st, Tn) => {
                                    var jt = Re(), rr = W(jt);
                                    He(rr, () => Hd, (dr, Gn) => {
                                      Gn(dr, {
                                        side: "bottom",
                                        align: "start",
                                        sideOffset: 8,
                                        class: "post-history-menu-content",
                                        trapFocus: !1,
                                        preventScroll: !1,
                                        onCloseAutoFocus: (cr) => cr.preventDefault(),
                                        children: (cr, wa) => {
                                          var uo = o0(), na = O(uo), ra = O(na, !0);
                                          M(na);
                                          var ja = N(na, 2);
                                          He(ja, () => ia, (wo, xa) => {
                                            xa(wo, { class: "post-history-menu-separator" });
                                          });
                                          var oa = N(ja, 2);
                                          {
                                            var Po = (wo) => {
                                              var xa = r0(), xs = W(xa);
                                              He(xs, () => or, (Ss, Rs) => {
                                                Rs(Ss, {
                                                  class: "menu-action-button",
                                                  onSelect: () => void E(r(K)),
                                                  children: (aa, $0) => {
                                                    var Sd = n0(), Rd = N(W(Sd), 2), wh = O(Rd, !0);
                                                    M(Rd), Ie((xh) => te(wh, xh), [() => o()("postHistory.showSurroundingPosts")]), A(aa, Sd);
                                                  },
                                                  $$slots: { default: !0 }
                                                });
                                              });
                                              var ds = N(xs, 2);
                                              He(ds, () => ia, (Ss, Rs) => {
                                                Rs(Ss, { class: "post-history-menu-separator" });
                                              }), A(wo, xa);
                                            };
                                            Ce(oa, (wo) => {
                                              _.isSearchMode && wo(Po);
                                            });
                                          }
                                          var _i = N(oa, 2);
                                          {
                                            let wo = C(() => re.copyState[r(K).eventId] === "failed"), xa = C(() => z(r(K))), xs = C(() => U(r(K))), ds = C(() => Et(r(K))), Ss = C(() => F(r(K))), Rs = C(Zo);
                                            Hs(_i, {
                                              order: "standard",
                                              get copyFailed() {
                                                return r(wo);
                                              },
                                              get showBroadcast() {
                                                return r(xa);
                                              },
                                              get broadcastSending() {
                                                return r(xs);
                                              },
                                              get showDelete() {
                                                return r(ds);
                                              },
                                              showDeleteSeparator: !1,
                                              get deletionSending() {
                                                return r(Ss);
                                              },
                                              onCopyPointerDown: (aa) => re.captureCopyPointerPosition(r(K), aa),
                                              onCopyNevent: (aa) => void re.handleCopyNevent(r(K), aa),
                                              get externalClientLabel() {
                                                return r(Rs);
                                              },
                                              onOpenExternalClient: () => Oo(r(K)),
                                              onShowRawJson: () => Ft(r(K).rawEvent, [
                                                ...r(K).relayHints,
                                                ...r(K).acceptedRelays,
                                                ...r(K).fetchedRelays ?? []
                                              ]),
                                              onBroadcastPointerDown: (aa) => Xt(r(K), aa),
                                              onBroadcastPost: (aa) => void tt(r(K), aa),
                                              onOpenDeleteConfirm: () => Ve(r(K))
                                            });
                                          }
                                          M(uo), Ie((wo) => te(ra, wo), [() => ni(r(K).postedAt, n())]), A(cr, uo);
                                        },
                                        $$slots: { default: !0 }
                                      });
                                    }), A(st, jt);
                                  },
                                  $$slots: { default: !0 }
                                });
                              }), A(Wn, Jn);
                            },
                            $$slots: { default: !0 }
                          });
                        });
                      }
                      Ie(($n) => te(Vt, $n), [() => al(r(K).postedAt)]), A(yn, En);
                    };
                    Ce(Ur, (yn) => {
                      f() || m() || yn(br);
                    });
                  }
                  M(Gr), M(Hn), A(kt, Hn);
                }, lr = C(() => r(K).kind === 42 || r(K).deletedAt || $(r(K)) || !(f() || m()));
                Ce(gn, (kt) => {
                  r(lr) && kt(Ot);
                });
              }
              var Or = N(gn, 2);
              {
                let kt = C(() => f() ? Lo : void 0), Hn = C(() => m() ? pa : void 0), _r = C(Zo);
                pl(Or, {
                  get state() {
                    return r(ot);
                  },
                  section: "parent",
                  get previewModelByEventId() {
                    return r(Hr);
                  },
                  getSensitiveBodyLoader: Pn,
                  get emojiLoadStateByUrl() {
                    return An.emojiLoadStateByUrl;
                  },
                  get emojiImageMetaByUrl() {
                    return An.emojiImageMetaByUrl;
                  },
                  get scrollRoot() {
                    return r(rt);
                  },
                  onImageOpen: bo,
                  buildPostRecordForNode: we,
                  get onReplyPost() {
                    return r(kt);
                  },
                  get onQuotePost() {
                    return r(Hn);
                  },
                  onToggleParent: () => Ke.preserveThreadParentToggleScroll(r(K).eventId, r(K).eventId, () => me.toggleParent(r(K))),
                  onRetryParent: () => me.retryParent(r(K)),
                  onToggleNodeParent: (Ut) => Ke.preserveThreadParentToggleScroll(r(K).eventId, Ut, () => me.toggleNodeParent(r(K), Ut)),
                  onRetryNodeParent: (Ut) => me.retryNodeParent(r(K), Ut),
                  onToggleNodeChildren: (Ut) => me.toggleNodeChildren(r(K), Ut),
                  onRetryNodeChildren: (Ut) => me.retryNodeChildren(r(K), Ut),
                  onCopyPointerDown: Jo,
                  onCopyNevent: Go,
                  get externalClientLabel() {
                    return r(_r);
                  },
                  onOpenExternalClient: ns,
                  isCopyFailed: Wo,
                  onShowRawJson: ts,
                  onBroadcastPointerDown: va,
                  onBroadcastPost: rs,
                  isBroadcastSending: Na,
                  canDeleteNodePost: Ba,
                  isDeletionSending: os,
                  onOpenDeleteConfirm: ga
                });
              }
              var Lr = N(Or, 2), mt = O(Lr), Nt = O(mt);
              {
                const kt = (mr) => {
                  {
                    let Fr = C(() => Cn.shouldCollapsePost(r(K))), Ur = C(() => Cn.isPostExpanded(r(K))), br = C(() => "post-preview-content-" + r(K).eventId);
                    Yf(mr, {
                      placement: "overlay",
                      get visible() {
                        return r(Fr);
                      },
                      get expanded() {
                        return r(Ur);
                      },
                      get controls() {
                        return r(br);
                      },
                      onToggle: () => Cn.togglePostExpanded(r(K).eventId)
                    });
                  }
                }, Hn = (mr) => {
                  var Fr = Re(), Ur = W(Fr);
                  {
                    var br = (En) => {
                      var on = l0();
                      sa(on, 21, () => y(r(K)), (Vt) => Vt.eventId, (Vt, at) => {
                        {
                          const $n = (Jn) => {
                            var an = Re(), Vn = W(an);
                            {
                              var qn = (st) => {
                                const Tn = C(() => Qe(r(at).event));
                                {
                                  const jt = (Gn) => {
                                    const cr = C(() => De(r(at).event.id));
                                    var wa = Re(), uo = W(wa);
                                    {
                                      var na = (ra) => {
                                        {
                                          let ja = C(() => le(r(at).event.id)), oa = C(() => Ne(r(at).event.id));
                                          cl(ra, {
                                            get count() {
                                              return r(cr).totalCount;
                                            },
                                            get expanded() {
                                              return r(ja);
                                            },
                                            get ariaLabel() {
                                              return r(oa);
                                            },
                                            onToggle: () => Se(r(at).event.id)
                                          });
                                        }
                                      };
                                      Ce(uo, (ra) => {
                                        r(cr) && r(cr).totalCount > 0 && ra(na);
                                      });
                                    }
                                    A(Gn, wa);
                                  };
                                  let rr = C(() => r(at).event.kind !== 42 && f() ? Lo : void 0), dr = C(() => r(at).event.kind !== 42 && m() ? pa : void 0);
                                  ll(st, {
                                    get post() {
                                      return r(Tn);
                                    },
                                    get onReplyPost() {
                                      return r(rr);
                                    },
                                    get onQuotePost() {
                                      return r(dr);
                                    },
                                    reactionExtras: jt,
                                    $$slots: { reactionExtras: !0 }
                                  });
                                }
                              }, Mn = C(() => r(at).status === "resolved" && (r(at).event.kind !== 42 || (De(r(at).event.id)?.totalCount ?? 0) > 0));
                              Ce(Vn, (st) => {
                                r(Mn) && st(qn);
                              });
                            }
                            A(Jn, an);
                          }, Er = (Jn) => {
                            var an = Re(), Vn = W(an);
                            {
                              var qn = (Mn) => {
                                const st = C(() => De(r(at).event.id));
                                var Tn = Re(), jt = W(Tn);
                                {
                                  var rr = (Gn) => {
                                    dl(Gn, {
                                      get readModel() {
                                        return r(st);
                                      },
                                      get emojiLoadStateByUrl() {
                                        return An.emojiLoadStateByUrl;
                                      },
                                      get emojiImageMetaByUrl() {
                                        return An.emojiImageMetaByUrl;
                                      }
                                    });
                                  }, dr = C(() => r(st) && r(st).totalCount > 0 && le(r(at).event.id));
                                  Ce(jt, (Gn) => {
                                    r(dr) && Gn(rr);
                                  });
                                }
                                A(Mn, Tn);
                              };
                              Ce(Vn, (Mn) => {
                                r(at).status === "resolved" && Mn(qn);
                              });
                            }
                            A(Jn, an);
                          }, Bn = (Jn) => {
                            var an = Re(), Vn = W(an);
                            {
                              var qn = (Mn) => {
                                const st = C(() => Qe(r(at).event)), Tn = C(() => wn(r(K).eventId, r(st).eventId)), jt = C(() => o()("common.showActions"));
                                {
                                  const rr = (cr) => {
                                    {
                                      let wa = C(() => re.copyState[r(st).eventId] === "failed"), uo = C(() => z(r(st))), na = C(() => U(r(st))), ra = C(() => Et(r(st))), ja = C(() => F(r(st))), oa = C(Zo);
                                      Hs(cr, {
                                        order: "standard",
                                        get copyFailed() {
                                          return r(wa);
                                        },
                                        get showBroadcast() {
                                          return r(uo);
                                        },
                                        get broadcastSending() {
                                          return r(na);
                                        },
                                        get showDelete() {
                                          return r(ra);
                                        },
                                        showDeleteSeparator: !0,
                                        get deletionSending() {
                                          return r(ja);
                                        },
                                        onCopyPointerDown: (Po) => re.captureCopyPointerPosition(r(st), Po),
                                        onCopyNevent: (Po) => void re.handleCopyNevent(r(st), Po),
                                        get externalClientLabel() {
                                          return r(oa);
                                        },
                                        onOpenExternalClient: () => Oo(r(st)),
                                        onShowRawJson: () => Ft(r(st).rawEvent, [
                                          ...r(st).relayHints,
                                          ...r(st).acceptedRelays,
                                          ...r(st).fetchedRelays ?? []
                                        ]),
                                        onBroadcastPointerDown: (Po) => Xt(r(st), Po),
                                        onBroadcastPost: (Po) => void tt(r(st), Po),
                                        onOpenDeleteConfirm: () => Ve(r(st))
                                      });
                                    }
                                  };
                                  let dr = C(() => Pe.isPostMenuOpen(r(Tn))), Gn = C(() => ni(r(st).postedAt, n()));
                                  il(Mn, {
                                    get open() {
                                      return r(dr);
                                    },
                                    onOpenChange: (cr) => kn(r(Tn), cr),
                                    get triggerAriaLabel() {
                                      return r(jt);
                                    },
                                    get tooltipContent() {
                                      return r(jt);
                                    },
                                    enableTooltip: !0,
                                    get timestamp() {
                                      return r(Gn);
                                    },
                                    items: rr,
                                    $$slots: { items: !0 }
                                  });
                                }
                              };
                              Ce(Vn, (Mn) => {
                                r(at).status === "resolved" && Mn(qn);
                              });
                            }
                            A(Jn, an);
                          };
                          let Wn = C(() => r(at).status === "resolved" ? Pn(r(at).event) : void 0), Zr = C(() => r(at).status === "resolved" ? r(Hr)[r(at).event.id] : void 0);
                          Zu(Vt, {
                            get preview() {
                              return r(at);
                            },
                            get loadSensitiveBody() {
                              return r(Wn);
                            },
                            get model() {
                              return r(Zr);
                            },
                            get emojiLoadStateByUrl() {
                              return An.emojiLoadStateByUrl;
                            },
                            get emojiImageMetaByUrl() {
                              return An.emojiImageMetaByUrl;
                            },
                            get scrollRoot() {
                              return r(rt);
                            },
                            onImageOpen: bo,
                            onRetry: () => fe.retryQuotePreview(r(at).eventId),
                            footerActions: $n,
                            footerDetails: Er,
                            footerMenu: Bn,
                            $$slots: { footerActions: !0, footerDetails: !0, footerMenu: !0 }
                          });
                        }
                      }), M(on), A(En, on);
                    }, yn = C(() => y(r(K)).length > 0);
                    Ce(Ur, (En) => {
                      r(yn) && En(br);
                    });
                  }
                  A(mr, Fr);
                };
                let _r = C(() => l(r(K))), Ut = C(() => Pn(r(K).rawEvent)), Gr = C(() => "post-preview-content-" + r(K).eventId), co = C(() => !Cn.isPostExpanded(r(K)));
                Kc(Nt, {
                  get model() {
                    return r(_r);
                  },
                  get loadSensitiveBody() {
                    return r(Ut);
                  },
                  resolveSensitiveDisplayContent: (mr) => rc({ content: mr, tags: r(K).tags }),
                  get contentWarningEventId() {
                    return r(K).eventId;
                  },
                  density: "standard",
                  get emojiLoadStateByUrl() {
                    return An.emojiLoadStateByUrl;
                  },
                  get emojiImageMetaByUrl() {
                    return An.emojiImageMetaByUrl;
                  },
                  get scrollRoot() {
                    return r(rt);
                  },
                  get previewCollapseAction() {
                    return Cn.previewRef;
                  },
                  get previewCollapseEventId() {
                    return r(K).eventId;
                  },
                  get previewContentId() {
                    return r(Gr);
                  },
                  get isTextCollapsed() {
                    return r(co);
                  },
                  onImageOpen: bo,
                  textOverlay: kt,
                  afterContentAndMedia: Hn,
                  $$slots: { textOverlay: !0, afterContentAndMedia: !0 }
                });
              }
              M(mt);
              var Rn = N(mt, 2);
              {
                const kt = (Gr) => {
                  {
                    const co = (br) => {
                      var yn = Re(), En = W(yn);
                      {
                        var on = (Vt) => {
                          {
                            let at = C(() => ce(r(K))), $n = C(() => ce(r(K)));
                            vd(Vt, {
                              get count() {
                                return r(ot).repliesActionState.replyCount;
                              },
                              get selected() {
                                return r(ot).repliesActionState.visible;
                              },
                              get ariaLabel() {
                                return r(at);
                              },
                              get tooltipContent() {
                                return r($n);
                              },
                              onClick: () => yt(r(K))
                            });
                          }
                        };
                        Ce(En, (Vt) => {
                          r(ot).repliesActionState.status === "loaded" && r(ot).repliesActionState.replyCount > 0 && Vt(on);
                        });
                      }
                      A(br, yn);
                    }, mr = (br) => {
                      var yn = Re(), En = W(yn);
                      {
                        var on = (Vt) => {
                          {
                            let at = C(() => Me(r(K))), $n = C(() => Be(r(K)));
                            cl(Vt, {
                              get count() {
                                return r(ot).reactionSummary.totalCount;
                              },
                              get expanded() {
                                return r(at);
                              },
                              get ariaLabel() {
                                return r($n);
                              },
                              onToggle: () => pt(r(K))
                            });
                          }
                        };
                        Ce(En, (Vt) => {
                          r(ot).reactionSummary.totalCount > 0 && Vt(on);
                        });
                      }
                      A(br, yn);
                    };
                    let Fr = C(() => f() ? Lo : void 0), Ur = C(() => m() ? pa : void 0);
                    ll(Gr, {
                      get post() {
                        return r(K);
                      },
                      get onReplyPost() {
                        return r(Fr);
                      },
                      get onQuotePost() {
                        return r(Ur);
                      },
                      replyExtras: co,
                      reactionExtras: mr,
                      $$slots: { replyExtras: !0, reactionExtras: !0 }
                    });
                  }
                }, Hn = (Gr) => {
                  const co = C(() => o()("common.showActions"));
                  var mr = Re(), Fr = W(mr);
                  {
                    var Ur = (br) => {
                      {
                        const yn = (Vt) => {
                          var at = h0(), $n = W(at);
                          He($n, () => or, (an, Vn) => {
                            Vn(an, {
                              class: "menu-action-button",
                              onSelect: () => Oo(r(K)),
                              children: (qn, Mn) => {
                                var st = d0(), Tn = N(W(st), 2), jt = O(Tn, !0);
                                M(Tn), Ie((rr) => te(jt, rr), [() => Zo()]), A(qn, st);
                              },
                              $$slots: { default: !0 }
                            });
                          });
                          var Er = N($n, 2);
                          He(Er, () => ia, (an, Vn) => {
                            Vn(an, { class: "post-history-menu-separator" });
                          });
                          var Bn = N(Er, 2);
                          {
                            let an = C(() => r(ot).repliesActionState.status === "loading");
                            He(Bn, () => or, (Vn, qn) => {
                              qn(Vn, {
                                class: "menu-action-button",
                                get disabled() {
                                  return r(an);
                                },
                                onSelect: () => yt(r(K)),
                                children: (Mn, st) => {
                                  var Tn = c0(), jt = W(Tn), rr = N(jt, 2), dr = O(rr, !0);
                                  M(rr), Ie(
                                    (Gn) => {
                                      xo(jt, 1, `${r(ot).repliesActionState.visible ? "collapse-content-icon" : "find_in_page-icon"} svg-icon`, "svelte-uxr0i8"), te(dr, Gn);
                                    },
                                    [() => ce(r(K))]
                                  ), A(Mn, Tn);
                                },
                                $$slots: { default: !0 }
                              });
                            });
                          }
                          var Wn = N(Bn, 2);
                          {
                            var Zr = (an) => {
                              var Vn = Re(), qn = W(Vn);
                              He(qn, () => or, (Mn, st) => {
                                st(Mn, {
                                  class: "menu-action-button",
                                  onSelect: () => void E(r(K)),
                                  children: (Tn, jt) => {
                                    var rr = u0(), dr = N(W(rr), 2), Gn = O(dr, !0);
                                    M(dr), Ie((cr) => te(Gn, cr), [() => o()("postHistory.showSurroundingPosts")]), A(Tn, rr);
                                  },
                                  $$slots: { default: !0 }
                                });
                              }), A(an, Vn);
                            };
                            Ce(Wn, (an) => {
                              _.isSearchMode && an(Zr);
                            });
                          }
                          var Jn = N(Wn, 2);
                          {
                            let an = C(() => re.copyState[r(K).eventId] === "failed"), Vn = C(() => z(r(K))), qn = C(() => U(r(K))), Mn = C(() => Et(r(K))), st = C(() => !!(f() || m())), Tn = C(() => F(r(K)));
                            Hs(Jn, {
                              order: "standard",
                              get copyFailed() {
                                return r(an);
                              },
                              get showBroadcast() {
                                return r(Vn);
                              },
                              get broadcastSending() {
                                return r(qn);
                              },
                              get showDelete() {
                                return r(Mn);
                              },
                              get showDeleteSeparator() {
                                return r(st);
                              },
                              get deletionSending() {
                                return r(Tn);
                              },
                              onCopyPointerDown: (jt) => re.captureCopyPointerPosition(r(K), jt),
                              onCopyNevent: (jt) => void re.handleCopyNevent(r(K), jt),
                              onShowRawJson: () => Ft(r(K).rawEvent, [
                                ...r(K).relayHints,
                                ...r(K).acceptedRelays,
                                ...r(K).fetchedRelays ?? []
                              ]),
                              onBroadcastPointerDown: (jt) => Xt(r(K), jt),
                              onBroadcastPost: (jt) => void tt(r(K), jt),
                              onOpenDeleteConfirm: () => Ve(r(K))
                            });
                          }
                          A(Vt, at);
                        };
                        let En = C(() => Pe.isPostMenuOpen(r(K).eventId)), on = C(() => ni(r(K).postedAt, n()));
                        il(br, {
                          lazy: !0,
                          get open() {
                            return r(En);
                          },
                          onOpenChange: (Vt) => kn(r(K).eventId, Vt),
                          get triggerAriaLabel() {
                            return r(co);
                          },
                          get tooltipContent() {
                            return r(co);
                          },
                          enableTooltip: !0,
                          get timestamp() {
                            return r(on);
                          },
                          items: yn,
                          $$slots: { items: !0 }
                        });
                      }
                    };
                    Ce(Fr, (br) => {
                      (f() || m()) && br(Ur);
                    });
                  }
                  A(Gr, mr);
                };
                let _r = C(() => f() || m() ? al(r(K).postedAt) : ""), Ut = C(() => !!r(K).deletedAt);
                iu(Rn, {
                  get formattedDate() {
                    return r(_r);
                  },
                  get dimmed() {
                    return r(Ut);
                  },
                  actions: kt,
                  trailing: Hn,
                  $$slots: { actions: !0, trailing: !0 }
                });
              }
              var In = N(Rn, 2);
              {
                var yr = (kt) => {
                  dl(kt, {
                    get readModel() {
                      return r(ot).reactionReadModel;
                    },
                    get emojiLoadStateByUrl() {
                      return An.emojiLoadStateByUrl;
                    },
                    get emojiImageMetaByUrl() {
                      return An.emojiImageMetaByUrl;
                    }
                  });
                }, pn = C(() => r(ot).reactionSummary.totalCount > 0 && Me(r(K)));
                Ce(In, (kt) => {
                  r(pn) && kt(yr);
                });
              }
              var _n = N(In, 2);
              {
                let kt = C(() => f() ? Lo : void 0), Hn = C(() => m() ? pa : void 0), _r = C(Zo);
                pl(_n, {
                  get state() {
                    return r(ot);
                  },
                  section: "children",
                  get previewModelByEventId() {
                    return r(Hr);
                  },
                  getSensitiveBodyLoader: Pn,
                  get emojiLoadStateByUrl() {
                    return An.emojiLoadStateByUrl;
                  },
                  get emojiImageMetaByUrl() {
                    return An.emojiImageMetaByUrl;
                  },
                  get scrollRoot() {
                    return r(rt);
                  },
                  onImageOpen: bo,
                  buildPostRecordForNode: we,
                  get onReplyPost() {
                    return r(kt);
                  },
                  get onQuotePost() {
                    return r(Hn);
                  },
                  getReactionReadModel: De,
                  isReactionExpanded: le,
                  getReactionLabel: Ne,
                  onToggleReaction: Se,
                  onToggleNodeParent: (Ut) => Ke.preserveThreadParentToggleScroll(r(K).eventId, Ut, () => me.toggleNodeParent(r(K), Ut)),
                  onRetryNodeParent: (Ut) => me.retryNodeParent(r(K), Ut),
                  onToggleNodeChildren: (Ut) => me.toggleNodeChildren(r(K), Ut),
                  onRetryNodeChildren: (Ut) => me.retryNodeChildren(r(K), Ut),
                  onCopyPointerDown: Jo,
                  onCopyNevent: Go,
                  get externalClientLabel() {
                    return r(_r);
                  },
                  onOpenExternalClient: ns,
                  isCopyFailed: Wo,
                  onShowRawJson: ts,
                  onBroadcastPointerDown: va,
                  onBroadcastPost: rs,
                  isBroadcastSending: Na,
                  canDeleteNodePost: Ba,
                  isDeletionSending: os,
                  onOpenDeleteConfirm: ga
                });
              }
              M(Lr), M(xt), M(zt), M(Dt), Ie(() => {
                qt = xo(Dt, 1, "post-history-item svelte-uxr0i8", null, qt, { "post-history-item-deleted": !!r(K).deletedAt }), Cr(Dt, "data-post-history-event-id", r(K).eventId), Cr(Dt, "data-post-history-posted-at", r(K).postedAt), Cr(Lr, "data-post-history-thread-anchor-scope-id", r(K).eventId), Cr(Lr, "data-post-history-thread-anchor-event-id", r(K).eventId);
              }), A(dt, Dt);
            }), M(lo);
            var Ho = N(lo, 2);
            {
              var zn = (dt) => {
                var K = g0(), ot = O(K);
                {
                  var Dt = (qt) => {
                    var zt = v0(), xt = O(zt);
                    {
                      var gn = (Ot) => {
                        Ka(Ot, {
                          variant: "spinner",
                          showLoader: !0,
                          loaderSize: 24,
                          ariaHidden: !0
                        });
                      };
                      Ce(xt, (Ot) => {
                        r(gt) && Ot(gn);
                      });
                    }
                    M(zt), ei(zt, (Ot) => g(en, Ot), () => r(en)), A(qt, zt);
                  };
                  Ce(ot, (qt) => {
                    _.state.hasOlderLocal && qt(Dt);
                  });
                }
                M(K), A(dt, K);
              };
              Ce(Ho, (dt) => {
                rn && !_.isSearchMode && _.state.listingMode === "contiguous" && !_.showSavedPostsBoundary && dt(zn);
              });
            }
            var qr = N(Ho, 2);
            {
              var Fn = (dt) => {
                var K = p0(), ot = O(K), Dt = O(ot, !0);
                M(ot);
                var qt = N(ot, 2), zt = O(qt, !0);
                M(qt), M(K), Ie(
                  (xt, gn) => {
                    te(Dt, xt), te(zt, gn);
                  },
                  [
                    () => o()("postHistory.savedOlderPostsShowing"),
                    () => o()("postHistory.savedOlderPostsGapNotice")
                  ]
                ), A(dt, K);
              };
              Ce(qr, (dt) => {
                _.isShowingSavedOlderPosts && dt(Fn);
              });
            }
            var ir = N(qr, 2);
            {
              var Jr = (dt) => {
                var K = b0(), ot = O(K), Dt = O(ot);
                {
                  var qt = (xt) => {
                    {
                      let gn = C(() => _.isFetchingFromRelays || _.isRefetchingAroundCurrentView);
                      ur(xt, {
                        type: "button",
                        variant: "primary",
                        className: "post-history-nav-button",
                        contentLayout: "iconText",
                        get disabled() {
                          return r(gn);
                        },
                        onClick: () => void zo(),
                        children: (Ot, lr) => {
                          var Or = y0(), Lr = N(W(Or));
                          Ie((mt) => te(Lr, ` ${mt ?? ""}`), [() => o()("postHistory.fetchOlderFromRelays")]), A(Ot, Or);
                        },
                        $$slots: { default: !0 }
                      });
                    }
                  };
                  Ce(Dt, (xt) => {
                    (_.canFetchOlderFromRelays || _.isFetchingFromRelays) && xt(qt);
                  });
                }
                var zt = N(Dt, 2);
                ur(zt, {
                  type: "button",
                  variant: "default",
                  className: "post-history-nav-button",
                  contentLayout: "iconText",
                  onClick: () => void Mo(),
                  children: (xt, gn) => {
                    var Ot = m0(), lr = N(W(Ot));
                    Ie((Or) => te(lr, ` ${Or ?? ""}`), [() => o()("postHistory.showSavedOlderPosts")]), A(xt, Ot);
                  },
                  $$slots: { default: !0 }
                }), M(ot), M(K), A(dt, K);
              }, Ca = (dt) => {
                var K = P0(), ot = O(K);
                {
                  let Dt = C(() => !_.canLoadOlder);
                  ur(ot, {
                    type: "button",
                    variant: "default",
                    className: "post-history-nav-button",
                    contentLayout: "iconText",
                    get disabled() {
                      return r(Dt);
                    },
                    onClick: () => void Mr(),
                    children: (qt, zt) => {
                      var xt = C0(), gn = N(W(xt));
                      Ie((Ot) => te(gn, ` ${Ot ?? ""}`), [() => Dn()]), A(qt, xt);
                    },
                    $$slots: { default: !0 }
                  });
                }
                M(K), A(dt, K);
              }, ls = (dt) => {
                var K = x0(), ot = O(K);
                {
                  let Dt = C(() => !_.canLoadOlder);
                  ur(ot, {
                    type: "button",
                    variant: "default",
                    className: "post-history-nav-button",
                    contentLayout: "iconText",
                    get disabled() {
                      return r(Dt);
                    },
                    onClick: () => void Mr(),
                    children: (qt, zt) => {
                      var xt = w0(), gn = N(W(xt));
                      Ie((Ot) => te(gn, ` ${Ot ?? ""}`), [() => Dn()]), A(qt, xt);
                    },
                    $$slots: { default: !0 }
                  });
                }
                M(K), A(dt, K);
              }, Pa = (dt) => {
                var K = R0(), ot = O(K);
                {
                  var Dt = (qt) => {
                    {
                      let zt = C(() => _.isFetchingFromRelays || _.isRefetchingAroundCurrentView);
                      ur(qt, {
                        type: "button",
                        variant: "primary",
                        className: "post-history-nav-button",
                        contentLayout: "iconText",
                        get disabled() {
                          return r(zt);
                        },
                        onClick: () => void zo(),
                        children: (xt, gn) => {
                          var Ot = Re(), lr = W(Ot);
                          {
                            var Or = (mt) => {
                              {
                                let Nt = C(() => o()("postHistory.fetchOlderFromRelaysLoading"));
                                Ka(mt, {
                                  get text() {
                                    return r(Nt);
                                  },
                                  showLoader: !0,
                                  loaderSize: 28,
                                  customClass: "post-history-nav-loading-placeholder"
                                });
                              }
                            }, Lr = (mt) => {
                              var Nt = S0(), Rn = N(W(Nt));
                              Ie((In) => te(Rn, ` ${In ?? ""}`), [() => o()("postHistory.fetchOlderFromRelays")]), A(mt, Nt);
                            };
                            Ce(lr, (mt) => {
                              _.isFetchingOlderFromRelays ? mt(Or) : mt(Lr, -1);
                            });
                          }
                          A(xt, Ot);
                        },
                        $$slots: { default: !0 }
                      });
                    }
                  };
                  Ce(ot, (qt) => {
                    (_.canFetchOlderFromRelays || _.isFetchingFromRelays || _.isRefetchingAroundCurrentView) && qt(Dt);
                  });
                }
                M(K), A(dt, K);
              }, ws = (dt) => {
                var K = I0();
                A(dt, K);
              };
              Ce(ir, (dt) => {
                _.showSavedPostsBoundary ? dt(Jr) : _.isSearchMode && _.canLoadOlder ? dt(Ca, 1) : !_.isSearchMode && _.state.hasOlderLocal && (_.state.listingMode === "sparse" || !rn) ? dt(ls, 2) : _.showLocalExhaustedState ? dt(Pa, 3) : _.isSearchMode && _.posts.length > 0 && dt(ws, 4);
              });
            }
            A(Je, ft);
          };
          Ce(ph, (Je) => {
            _.posts.length === 0 && r(Kn) ? Je(yh) : r(to) ? Je(mh, 1) : Je(bh, -1);
          });
        }
        M(Va), ei(Va, (Je) => g(rt, Je), () => r(rt));
        var wd = N(Va, 2);
        {
          var Ch = (Je) => {
            var ft = A0(), Tt = O(ft);
            {
              let Qn = C(() => o()("postHistory.returnToLatest"));
              ur(Tt, {
                type: "button",
                variant: "default",
                shape: "circle",
                className: "post-history-latest-button",
                contentLayout: "icon",
                get ariaLabel() {
                  return r(Qn);
                },
                onClick: () => void gr(),
                children: (sr, io) => {
                  var lo = E0();
                  A(sr, lo);
                },
                $$slots: { default: !0 }
              });
            }
            M(ft), A(Je, ft);
          };
          Ce(wd, (Je) => {
            r(Xn) && Je(Ch);
          });
        }
        var xd = N(wd, 2);
        Xu(xd, {
          get open() {
            return r(G);
          },
          get ownerPubkeyHex() {
            return w();
          },
          getCurrentPubkeyHex: () => w(),
          onOpenChange: (Je) => g(G, Je, !0),
          onImported: xn
        });
        var Ph = N(xd, 2);
        jf(Ph, {
          get open() {
            return r(bt);
          },
          get rawEvent() {
            return r(Ct);
          },
          get resetKey() {
            return r(ln);
          },
          loadPayloadEvent: mo,
          observePayloadStatus: Ha,
          onOpenChange: (Je) => g(bt, Je, !0)
        }), Ie(() => {
          xo(Va, 1, `post-history-container${rn && !_.isSearchMode && _.state.listingMode === "contiguous" ? " post-history-auto-load-enabled" : ""}`, "svelte-uxr0i8"), Cr(Va, "aria-busy", r(Io) || r(gt) ? "true" : "false");
        }), Ts("scroll", Va, function(...Je) {
          Ke.handleHistoryScroll?.apply(this, Je);
        }), A(ye, Mt);
      },
      $$slots: { footer: !0, default: !0 }
    });
  }
  var ea = N(Ua, 2);
  {
    const c = (hn) => {
      var er = k0(), Sn = O(er), fn = O(Sn, !0);
      M(Sn);
      var Un = N(Sn, 2), Br = O(Un, !0);
      M(Un), M(er), Ie(
        (vn, tr) => {
          te(fn, vn), te(Br, tr);
        },
        [
          () => o()("postHistory.deleteRequestDescription"),
          () => o()("postHistory.deleteRequestWarning")
        ]
      ), A(hn, er);
    };
    let H = C(() => o()("postHistory.deleteRequestTitle")), pe = C(() => o()("postHistory.deleteRequestDescription")), ye = C(() => Pe.deleteTargetPost && F(Pe.deleteTargetPost) ? o()("postHistory.deleteSending") : o()("postHistory.deleteConfirm")), lt = C(() => o()("postHistory.deleteCancel")), Mt = C(() => Pe.deleteTargetPost ? F(Pe.deleteTargetPost) : !1);
    Dd(ea, {
      get open() {
        return Pe.deleteConfirmOpen;
      },
      get onOpenChange() {
        return Pe.setDeleteConfirmOpen;
      },
      get title() {
        return r(H);
      },
      get description() {
        return r(pe);
      },
      get confirmLabel() {
        return r(ye);
      },
      get cancelLabel() {
        return r(lt);
      },
      confirmVariant: "danger",
      get confirmDisabled() {
        return r(Mt);
      },
      onConfirm: Cs,
      onCancel: as,
      contentClass: "post-history-delete-confirm",
      children: c,
      $$slots: { default: !0 }
    });
  }
  var ya = N(ea, 2);
  {
    const c = (Mt) => {
      var hn = M0(), er = O(hn), Sn = O(er, !0);
      M(er), M(hn), Ie((fn) => te(Sn, fn), [() => o()("postHistory.deleteLocalHistoryDescription")]), A(Mt, hn);
    };
    let H = C(() => o()("postHistory.deleteLocalHistoryTitle")), pe = C(() => o()("postHistory.deleteLocalHistoryDescription")), ye = C(() => o()("postHistory.deleteLocalHistoryConfirm")), lt = C(() => o()("postHistory.deleteLocalHistoryCancel"));
    Dd(ya, {
      get title() {
        return r(H);
      },
      get description() {
        return r(pe);
      },
      get confirmLabel() {
        return r(ye);
      },
      get cancelLabel() {
        return r(lt);
      },
      confirmVariant: "danger",
      onConfirm: qa,
      onCancel: Wr,
      closeOnConfirm: !1,
      preventCloseWhileConfirming: !0,
      showConfirmSpinner: !0,
      contentClass: "post-history-local-delete-confirm",
      get open() {
        return r(de);
      },
      set open(Mt) {
        g(de, Mt, !0);
      },
      children: c,
      $$slots: { default: !0 }
    });
  }
  var ma = N(ya, 2);
  {
    let c = C(() => r(Yt)[r(et)]?.src ?? ""), H = C(() => r(Yt)[r(et)]?.alt ?? "");
    Sf(ma, {
      get src() {
        return r(c);
      },
      get alt() {
        return r(H);
      },
      onClose: Co,
      get mediaList() {
        return r(Yt);
      },
      get currentIndex() {
        return r(et);
      },
      onNavigate: $r,
      get show() {
        return r(wt);
      },
      set show(pe) {
        g(wt, pe, !0);
      }
    });
  }
  var Yn = N(ma, 2);
  Mi(Yn, {
    get show() {
      return re.showCopyFloatingMessage;
    },
    get x() {
      return re.copyFloatingMessageX;
    },
    get y() {
      return re.copyFloatingMessageY;
    },
    children: (c, H) => {
      var pe = T0(), ye = O(pe, !0);
      M(pe), Ie((lt) => te(ye, lt), [() => o()("postHistory.copied")]), A(c, pe);
    },
    $$slots: { default: !0 }
  });
  var ta = N(Yn, 2);
  Mi(ta, {
    get show() {
      return r(it);
    },
    get x() {
      return r(X);
    },
    get y() {
      return r(nt);
    },
    children: (c, H) => {
      var pe = O0(), ye = O(pe, !0);
      M(pe), Ie((lt) => te(ye, lt), [() => o()(r(St))]), A(c, pe);
    },
    $$slots: { default: !0 }
  });
  var ba = N(ta, 2);
  Mi(ba, {
    get show() {
      return r(je);
    },
    variant: "top-right",
    children: (c, H) => {
      var pe = L0(), ye = O(pe, !0);
      M(pe), Ie((lt) => te(ye, lt), [
        () => o()(r(ie), { values: r(qe) })
      ]), A(c, pe);
    },
    $$slots: { default: !0 }
  }), A(t, Tr);
  var ao = Jt(zs);
  return s(), ao;
}
ru(["click"]);
Gt(
  N0,
  {
    show: {},
    onClose: {},
    onReplyPost: {},
    onQuotePost: {},
    pubkeyHex: {},
    rxNostr: {},
    relayConfig: {},
    latestPostedEvent: {},
    inboundInteractionSave: {},
    authoredSelfPostSave: {},
    reconcileInboundDirectReplyCandidates: {},
    notifySavedAuthoredPosts: {}
  },
  [],
  [],
  { mode: "open" }
);
export {
  N0 as default
};
