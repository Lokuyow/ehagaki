import { b$ as xs, c0 as as, c1 as kh, c2 as jc, c3 as gs, aJ as Kc, c4 as pi, c5 as gi, c6 as Lo, c7 as Fo, c8 as Yc, aI as zc, c9 as yi, ca as Qc, aH as eo, cb as Mi, cc as Fd, aO as Wc, aG as en, cd as Dh, aE as mi, ce as Jc, aF as fr, cf as _l, ai as Gc, aL as La, cg as El, I as _, aR as Kt, aP as Ee, K as be, aS as Mt, aT as Kr, aU as xr, aV as Ir, ch as Th, ci as Mh, cj as bi, ck as ul, cl as Zc, cm as hl, cn as Oh, b1 as no, aQ as la, co as Lh, a_ as Le, bZ as Fh, H as Ha, Q as Us, V as bs, $ as qs, cp as Xc, cq as fl, cr as vl, bc as eu, N as Tn, M as Ma, aA as ir, a4 as at, cs as ro, A as Hh, bT as ao, L as Ro, O as Ci, ct as $h, cu as Nh, cv as Bh, b_ as Xo, cw as Uh, cx as qh, cy as Vh, cz as jh, cA as tu, cB as Al, cC as ns, cD as wi, cE as ei, W as Pa, cF as Kh, cG as Yh, cH as zh, cI as Qh, b7 as Wh, cJ as ai, cK as Jh, w as nu, cL as kl, cM as Dl, cN as Tl, cO as ru, cP as Pi, cQ as pl, cR as Hd, cS as Gh, cT as Zh, cU as Zs, cV as ti, cW as Xh, cX as au, cY as Ml, cZ as es, c_ as ys, c$ as ef, d0 as su, d1 as Ol, d2 as Ll, d3 as tf, d4 as $d, d5 as nf, d6 as ou, d7 as Nd, d8 as rf, d9 as Oi, da as Li, db as iu, dc as af, dd as sf, de as of, df as lu, dg as lf, dh as df, di as Fi, dj as cf, dk as Fl, dl as du, dm as cu, dn as uu, bb as uf, dp as hf, dq as Bd, dr as ff, ds as vf, dt as hu, du as xi, dv as Hl, dw as pf, dx as gf, aY as yf, dy as mf, aB as Ud, al as bf, aC as Hi, dz as qd, bB as Cf, S as Ls, dA as wf, dB as Pf, s as Vd, ba as xf, ay as If } from "./App-CBRbsegU.js";
import { aN as Ke, u as ca, aR as I, a, b as p, aS as ye, aJ as lr, a_ as Sf, b7 as Yr, b0 as Ot, b1 as Ae, b2 as Z, b3 as E, b4 as Lt, b5 as S, ba as j, b8 as T, n as Sr, bh as ss, Z as ge, bi as J, b9 as A, b6 as Ft, bf as L, aO as fu, bj as $s, bF as $l, ap as ni, bC as _o, aq as vu, bl as pu, bk as Mn, bE as Nl, a$ as da, bH as Rf } from "./entry-wxgtzGEF.js";
import { b as _f } from "./input-BDR009Ra.js";
import { D as gu, a as yu } from "./DialogWrapper-BRiQEO8D.js";
import { M as Jn, a as ts, P as mu, b as gl, u as Ef, c as Af, d as kf, p as Df, e as jd, D as Kd, f as Yd, g as zd, h as Tf, r as Mf, i as Of, j as $i } from "./postBroadcastService-CFx4BCyR.js";
import { H as Lf } from "./hidden-input-wj7hXzb3.js";
import { P as Ff, b as Hf, a as $f } from "./popover-trigger-BtOsnlV4.js";
function Ni(t, e) {
  return t - e * Math.floor(t / e);
}
const bu = 1721426;
function Qo(t, e, n, r) {
  e = Bl(t, e);
  let o = e - 1, s = -2;
  return n <= 2 ? s = 0 : ri(e) && (s = -1), bu - 1 + 365 * o + Math.floor(o / 4) - Math.floor(o / 100) + Math.floor(o / 400) + Math.floor((367 * n - 362) / 12 + s + r);
}
function ri(t) {
  return t % 4 === 0 && (t % 100 !== 0 || t % 400 === 0);
}
function Bl(t, e) {
  return t === "BC" ? 1 - e : e;
}
function Nf(t) {
  let e = "AD";
  return t <= 0 && (e = "BC", t = 1 - t), [
    e,
    t
  ];
}
const Bf = {
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
class to {
  fromJulianDay(e) {
    let n = e, r = n - bu, o = Math.floor(r / 146097), s = Ni(r, 146097), l = Math.floor(s / 36524), c = Ni(s, 36524), u = Math.floor(c / 1461), b = Ni(c, 1461), g = Math.floor(b / 365), y = o * 400 + l * 100 + u * 4 + g + (l !== 4 && g !== 4 ? 1 : 0), [x, f] = Nf(y), R = n - Qo(x, f, 1, 1), w = 2;
    n < Qo(x, f, 3, 1) ? w = 0 : ri(f) && (w = 1);
    let m = Math.floor(((R + w) * 12 + 373) / 367), i = n - Qo(x, f, m, 1) + 1;
    return new Ps(x, f, m, i);
  }
  toJulianDay(e) {
    return Qo(e.era, e.year, e.month, e.day);
  }
  getDaysInMonth(e) {
    return Bf[ri(e.year) ? "leapyear" : "standard"][e.month - 1];
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getMonthsInYear(e) {
    return 12;
  }
  getDaysInYear(e) {
    return ri(e.year) ? 366 : 365;
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
const Uf = {
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
function ps(t, e) {
  return e = ea(e, t.calendar), t.era === e.era && t.year === e.year && t.month === e.month && t.day === e.day;
}
function Ul(t, e) {
  return e = ea(e, t.calendar), t = yl(t), e = yl(e), t.era === e.era && t.year === e.year && t.month === e.month;
}
function qf(t, e) {
  var n, r, o, s;
  return (s = (o = (n = t.isEqual) === null || n === void 0 ? void 0 : n.call(t, e)) !== null && o !== void 0 ? o : (r = e.isEqual) === null || r === void 0 ? void 0 : r.call(e, t)) !== null && s !== void 0 ? s : t.identifier === e.identifier;
}
function Vf(t, e) {
  return ps(t, Kf(e));
}
function Cu(t, e, n) {
  let r = t.calendar.toJulianDay(t), o = Wf(e), s = Math.ceil(r + 1 - o) % 7;
  return s < 0 && (s += 7), s;
}
function jf(t) {
  return Oa(Date.now(), t);
}
function Kf(t) {
  return Zf(jf(t));
}
function wu(t, e) {
  return t.calendar.toJulianDay(t) - e.calendar.toJulianDay(e);
}
function Yf(t, e) {
  return Qd(t) - Qd(e);
}
function Qd(t) {
  return t.hour * 36e5 + t.minute * 6e4 + t.second * 1e3 + t.millisecond;
}
let Bi = null;
function ms() {
  return Bi == null && (Bi = new Intl.DateTimeFormat().resolvedOptions().timeZone), Bi;
}
function yl(t) {
  return t.subtract({
    days: t.day - 1
  });
}
function zf(t) {
  return t.add({
    days: t.calendar.getDaysInMonth(t) - t.day
  });
}
const Wd = /* @__PURE__ */ new Map(), Ui = /* @__PURE__ */ new Map();
function Qf(t) {
  if (Intl.Locale) {
    let n = Wd.get(t);
    return n || (n = new Intl.Locale(t).maximize().region, n && Wd.set(t, n)), n;
  }
  let e = t.split("-")[1];
  return e === "u" ? void 0 : e;
}
function Wf(t) {
  let e = Ui.get(t);
  if (!e) {
    if (Intl.Locale) {
      let r = new Intl.Locale(t);
      if ("getWeekInfo" in r && (e = r.getWeekInfo(), e))
        return Ui.set(t, e), e.firstDay;
    }
    let n = Qf(t);
    if (t.includes("-fw-")) {
      let r = t.split("-fw-")[1].split("-")[0];
      r === "mon" ? e = {
        firstDay: 1
      } : r === "tue" ? e = {
        firstDay: 2
      } : r === "wed" ? e = {
        firstDay: 3
      } : r === "thu" ? e = {
        firstDay: 4
      } : r === "fri" ? e = {
        firstDay: 5
      } : r === "sat" ? e = {
        firstDay: 6
      } : e = {
        firstDay: 0
      };
    } else t.includes("-ca-iso8601") ? e = {
      firstDay: 1
    } : e = {
      firstDay: n && Uf[n] || 0
    };
    Ui.set(t, e);
  }
  return e.firstDay;
}
function Cs(t) {
  t = ea(t, new to());
  let e = Bl(t.era, t.year);
  return Pu(e, t.month, t.day, t.hour, t.minute, t.second, t.millisecond);
}
function Pu(t, e, n, r, o, s, l) {
  let c = /* @__PURE__ */ new Date();
  return c.setUTCHours(r, o, s, l), c.setUTCFullYear(t, e - 1, n), c.getTime();
}
function Mo(t, e) {
  if (e === "UTC") return 0;
  if (t > 0 && e === ms()) return new Date(t).getTimezoneOffset() * -6e4;
  let { year: n, month: r, day: o, hour: s, minute: l, second: c } = xu(t, e);
  return Pu(n, r, o, s, l, c, 0) - Math.floor(t / 1e3) * 1e3;
}
const Jd = /* @__PURE__ */ new Map();
function xu(t, e) {
  let n = Jd.get(e);
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
  }), Jd.set(e, n));
  let r = n.formatToParts(new Date(t)), o = {};
  for (let s of r) s.type !== "literal" && (o[s.type] = s.value);
  return {
    // Firefox returns B instead of BC... https://bugzilla.mozilla.org/show_bug.cgi?id=1752253
    year: o.era === "BC" || o.era === "B" ? -o.year + 1 : +o.year,
    month: +o.month,
    day: +o.day,
    hour: o.hour === "24" ? 0 : +o.hour,
    minute: +o.minute,
    second: +o.second
  };
}
const si = 864e5;
function Jf(t, e) {
  let n = Cs(t), r = n - Mo(n - si, e), o = n - Mo(n + si, e);
  return Iu(t, e, r, o);
}
function Iu(t, e, n, r) {
  return (n === r ? [
    n
  ] : [
    n,
    r
  ]).filter((s) => Gf(t, e, s));
}
function Gf(t, e, n) {
  let r = xu(n, e);
  return t.year === r.year && t.month === r.month && t.day === r.day && t.hour === r.hour && t.minute === r.minute && t.second === r.second;
}
function Ta(t, e, n = "compatible") {
  let r = ws(t);
  if (e === "UTC") return Cs(r);
  if (e === ms() && n === "compatible") {
    r = ea(r, new to());
    let u = /* @__PURE__ */ new Date(), b = Bl(r.era, r.year);
    return u.setFullYear(b, r.month - 1, r.day), u.setHours(r.hour, r.minute, r.second, r.millisecond), u.getTime();
  }
  let o = Cs(r), s = Mo(o - si, e), l = Mo(o + si, e), c = Iu(r, e, o - s, o - l);
  if (c.length === 1) return c[0];
  if (c.length > 1) switch (n) {
    // 'compatible' means 'earlier' for "fall back" transitions
    case "compatible":
    case "earlier":
      return c[0];
    case "later":
      return c[c.length - 1];
    case "reject":
      throw new RangeError("Multiple possible absolute times found");
  }
  switch (n) {
    case "earlier":
      return Math.min(o - s, o - l);
    // 'compatible' means 'later' for "spring forward" transitions
    case "compatible":
    case "later":
      return Math.max(o - s, o - l);
    case "reject":
      throw new RangeError("No such absolute time found");
  }
}
function Su(t, e, n = "compatible") {
  return new Date(Ta(t, e, n));
}
function Oa(t, e) {
  let n = Mo(t, e), r = new Date(t + n), o = r.getUTCFullYear(), s = r.getUTCMonth() + 1, l = r.getUTCDate(), c = r.getUTCHours(), u = r.getUTCMinutes(), b = r.getUTCSeconds(), g = r.getUTCMilliseconds();
  return new Fa(o < 1 ? "BC" : "AD", o < 1 ? -o + 1 : o, s, l, e, n, c, u, b, g);
}
function Zf(t) {
  return new Ps(t.calendar, t.era, t.year, t.month, t.day);
}
function ws(t, e) {
  let n = 0, r = 0, o = 0, s = 0;
  if ("timeZone" in t) ({ hour: n, minute: r, second: o, millisecond: s } = t);
  else if ("hour" in t && !e) return t;
  return e && ({ hour: n, minute: r, second: o, millisecond: s } = e), new os(t.calendar, t.era, t.year, t.month, t.day, n, r, o, s);
}
function ea(t, e) {
  if (qf(t.calendar, e)) return t;
  let n = e.fromJulianDay(t.calendar.toJulianDay(t)), r = t.copy();
  return r.calendar = e, r.era = n.era, r.year = n.year, r.month = n.month, r.day = n.day, Ns(r), r;
}
function Xf(t, e, n) {
  if (t instanceof Fa)
    return t.timeZone === e ? t : tv(t, e);
  let r = Ta(t, e, n);
  return Oa(r, e);
}
function ev(t) {
  let e = Cs(t) - t.offset;
  return new Date(e);
}
function tv(t, e) {
  let n = Cs(t) - t.offset;
  return ea(Oa(n, e), t.calendar);
}
const yo = 36e5;
function Ii(t, e) {
  let n = t.copy(), r = "hour" in n ? sv(n, e) : 0;
  ml(n, e.years || 0), n.calendar.balanceYearMonth && n.calendar.balanceYearMonth(n, t), n.month += e.months || 0, bl(n), Ru(n), n.day += (e.weeks || 0) * 7, n.day += e.days || 0, n.day += r, nv(n), n.calendar.balanceDate && n.calendar.balanceDate(n), n.year < 1 && (n.year = 1, n.month = 1, n.day = 1);
  let o = n.calendar.getYearsInEra(n);
  if (n.year > o) {
    var s, l;
    let u = (s = (l = n.calendar).isInverseEra) === null || s === void 0 ? void 0 : s.call(l, n);
    n.year = o, n.month = u ? 1 : n.calendar.getMonthsInYear(n), n.day = u ? 1 : n.calendar.getDaysInMonth(n);
  }
  n.month < 1 && (n.month = 1, n.day = 1);
  let c = n.calendar.getMonthsInYear(n);
  return n.month > c && (n.month = c, n.day = n.calendar.getDaysInMonth(n)), n.day = Math.max(1, Math.min(n.calendar.getDaysInMonth(n), n.day)), n;
}
function ml(t, e) {
  var n, r;
  !((n = (r = t.calendar).isInverseEra) === null || n === void 0) && n.call(r, t) && (e = -e), t.year += e;
}
function bl(t) {
  for (; t.month < 1; )
    ml(t, -1), t.month += t.calendar.getMonthsInYear(t);
  let e = 0;
  for (; t.month > (e = t.calendar.getMonthsInYear(t)); )
    t.month -= e, ml(t, 1);
}
function nv(t) {
  for (; t.day < 1; )
    t.month--, bl(t), t.day += t.calendar.getDaysInMonth(t);
  for (; t.day > t.calendar.getDaysInMonth(t); )
    t.day -= t.calendar.getDaysInMonth(t), t.month++, bl(t);
}
function Ru(t) {
  t.month = Math.max(1, Math.min(t.calendar.getMonthsInYear(t), t.month)), t.day = Math.max(1, Math.min(t.calendar.getDaysInMonth(t), t.day));
}
function Ns(t) {
  t.calendar.constrainDate && t.calendar.constrainDate(t), t.year = Math.max(1, Math.min(t.calendar.getYearsInEra(t), t.year)), Ru(t);
}
function _u(t) {
  let e = {};
  for (let n in t) typeof t[n] == "number" && (e[n] = -t[n]);
  return e;
}
function Eu(t, e) {
  return Ii(t, _u(e));
}
function ql(t, e) {
  let n = t.copy();
  return e.era != null && (n.era = e.era), e.year != null && (n.year = e.year), e.month != null && (n.month = e.month), e.day != null && (n.day = e.day), Ns(n), n;
}
function oi(t, e) {
  let n = t.copy();
  return e.hour != null && (n.hour = e.hour), e.minute != null && (n.minute = e.minute), e.second != null && (n.second = e.second), e.millisecond != null && (n.millisecond = e.millisecond), av(n), n;
}
function rv(t) {
  t.second += Math.floor(t.millisecond / 1e3), t.millisecond = Wo(t.millisecond, 1e3), t.minute += Math.floor(t.second / 60), t.second = Wo(t.second, 60), t.hour += Math.floor(t.minute / 60), t.minute = Wo(t.minute, 60);
  let e = Math.floor(t.hour / 24);
  return t.hour = Wo(t.hour, 24), e;
}
function av(t) {
  t.millisecond = Math.max(0, Math.min(t.millisecond, 1e3)), t.second = Math.max(0, Math.min(t.second, 59)), t.minute = Math.max(0, Math.min(t.minute, 59)), t.hour = Math.max(0, Math.min(t.hour, 23));
}
function Wo(t, e) {
  let n = t % e;
  return n < 0 && (n += e), n;
}
function sv(t, e) {
  return t.hour += e.hours || 0, t.minute += e.minutes || 0, t.second += e.seconds || 0, t.millisecond += e.milliseconds || 0, rv(t);
}
function Vl(t, e, n, r) {
  let o = t.copy();
  switch (e) {
    case "era": {
      let c = t.calendar.getEras(), u = c.indexOf(t.era);
      if (u < 0) throw new Error("Invalid era: " + t.era);
      u = rs(u, n, 0, c.length - 1, r?.round), o.era = c[u], Ns(o);
      break;
    }
    case "year":
      var s, l;
      !((s = (l = o.calendar).isInverseEra) === null || s === void 0) && s.call(l, o) && (n = -n), o.year = rs(t.year, n, -1 / 0, 9999, r?.round), o.year === -1 / 0 && (o.year = 1), o.calendar.balanceYearMonth && o.calendar.balanceYearMonth(o, t);
      break;
    case "month":
      o.month = rs(t.month, n, 1, t.calendar.getMonthsInYear(t), r?.round);
      break;
    case "day":
      o.day = rs(t.day, n, 1, t.calendar.getDaysInMonth(t), r?.round);
      break;
    default:
      throw new Error("Unsupported field " + e);
  }
  return t.calendar.balanceDate && t.calendar.balanceDate(o), Ns(o), o;
}
function Au(t, e, n, r) {
  let o = t.copy();
  switch (e) {
    case "hour": {
      let s = t.hour, l = 0, c = 23;
      if (r?.hourCycle === 12) {
        let u = s >= 12;
        l = u ? 12 : 0, c = u ? 23 : 11;
      }
      o.hour = rs(s, n, l, c, r?.round);
      break;
    }
    case "minute":
      o.minute = rs(t.minute, n, 0, 59, r?.round);
      break;
    case "second":
      o.second = rs(t.second, n, 0, 59, r?.round);
      break;
    case "millisecond":
      o.millisecond = rs(t.millisecond, n, 0, 999, r?.round);
      break;
    default:
      throw new Error("Unsupported field " + e);
  }
  return o;
}
function rs(t, e, n, r, o = !1) {
  if (o) {
    t += Math.sign(e), t < n && (t = r);
    let s = Math.abs(e);
    e > 0 ? t = Math.ceil(t / s) * s : t = Math.floor(t / s) * s, t > r && (t = n);
  } else
    t += e, t < n ? t = r - (n - t - 1) : t > r && (t = n + (t - r - 1));
  return t;
}
function ku(t, e) {
  let n;
  if (e.years != null && e.years !== 0 || e.months != null && e.months !== 0 || e.weeks != null && e.weeks !== 0 || e.days != null && e.days !== 0) {
    let o = Ii(ws(t), {
      years: e.years,
      months: e.months,
      weeks: e.weeks,
      days: e.days
    });
    n = Ta(o, t.timeZone);
  } else
    n = Cs(t) - t.offset;
  n += e.milliseconds || 0, n += (e.seconds || 0) * 1e3, n += (e.minutes || 0) * 6e4, n += (e.hours || 0) * 36e5;
  let r = Oa(n, t.timeZone);
  return ea(r, t.calendar);
}
function ov(t, e) {
  return ku(t, _u(e));
}
function iv(t, e, n, r) {
  switch (e) {
    case "hour": {
      let o = 0, s = 23;
      if (r?.hourCycle === 12) {
        let R = t.hour >= 12;
        o = R ? 12 : 0, s = R ? 23 : 11;
      }
      let l = ws(t), c = ea(oi(l, {
        hour: o
      }), new to()), u = [
        Ta(c, t.timeZone, "earlier"),
        Ta(c, t.timeZone, "later")
      ].filter((R) => Oa(R, t.timeZone).day === c.day)[0], b = ea(oi(l, {
        hour: s
      }), new to()), g = [
        Ta(b, t.timeZone, "earlier"),
        Ta(b, t.timeZone, "later")
      ].filter((R) => Oa(R, t.timeZone).day === b.day).pop(), y = Cs(t) - t.offset, x = Math.floor(y / yo), f = y % yo;
      return y = rs(x, n, Math.floor(u / yo), Math.floor(g / yo), r?.round) * yo + f, ea(Oa(y, t.timeZone), t.calendar);
    }
    case "minute":
    case "second":
    case "millisecond":
      return Au(t, e, n, r);
    case "era":
    case "year":
    case "month":
    case "day": {
      let o = Vl(ws(t), e, n, r), s = Ta(o, t.timeZone);
      return ea(Oa(s, t.timeZone), t.calendar);
    }
    default:
      throw new Error("Unsupported field " + e);
  }
}
function lv(t, e, n) {
  let r = ws(t), o = oi(ql(r, e), e);
  if (o.compare(r) === 0) return t;
  let s = Ta(o, t.timeZone, n);
  return ea(Oa(s, t.timeZone), t.calendar);
}
const dv = /^([+-]\d{6}|\d{4})-(\d{2})-(\d{2})$/, cv = /^([+-]\d{6}|\d{4})-(\d{2})-(\d{2})(?:T(\d{2}))?(?::(\d{2}))?(?::(\d{2}))?(\.\d+)?$/, uv = /^([+-]\d{6}|\d{4})-(\d{2})-(\d{2})(?:T(\d{2}))?(?::(\d{2}))?(?::(\d{2}))?(\.\d+)?(?:([+-]\d{2})(?::?(\d{2}))?(?::?(\d{2}))?)?\[(.*?)\]$/, Du = /^([+-]\d{6}|\d{4})-(\d{2})-(\d{2})(?:T(\d{2}))?(?::(\d{2}))?(?::(\d{2}))?(\.\d+)?(?:(?:([+-]\d{2})(?::?(\d{2}))?)|Z)$/;
function jl(t) {
  let e = t.match(dv);
  if (!e)
    throw Du.test(t) ? new Error(`Invalid ISO 8601 date string: ${t}. Use parseAbsolute() instead.`) : new Error("Invalid ISO 8601 date string: " + t);
  let n = new Ps(Kn(e[1], 0, 9999), Kn(e[2], 1, 12), 1);
  return n.day = Kn(e[3], 1, n.calendar.getDaysInMonth(n)), n;
}
function Tu(t) {
  let e = t.match(cv);
  if (!e)
    throw Du.test(t) ? new Error(`Invalid ISO 8601 date time string: ${t}. Use parseAbsolute() instead.`) : new Error("Invalid ISO 8601 date time string: " + t);
  let n = Kn(e[1], -9999, 9999), r = n < 1 ? "BC" : "AD", o = new os(r, n < 1 ? -n + 1 : n, Kn(e[2], 1, 12), 1, e[4] ? Kn(e[4], 0, 23) : 0, e[5] ? Kn(e[5], 0, 59) : 0, e[6] ? Kn(e[6], 0, 59) : 0, e[7] ? Kn(e[7], 0, 1 / 0) * 1e3 : 0);
  return o.day = Kn(e[3], 0, o.calendar.getDaysInMonth(o)), o;
}
function Mu(t, e) {
  let n = t.match(uv);
  if (!n) throw new Error("Invalid ISO 8601 date time string: " + t);
  let r = Kn(n[1], -9999, 9999), o = r < 1 ? "BC" : "AD", s = new Fa(o, r < 1 ? -r + 1 : r, Kn(n[2], 1, 12), 1, n[11], 0, n[4] ? Kn(n[4], 0, 23) : 0, n[5] ? Kn(n[5], 0, 59) : 0, n[6] ? Kn(n[6], 0, 59) : 0, n[7] ? Kn(n[7], 0, 1 / 0) * 1e3 : 0);
  s.day = Kn(n[3], 0, s.calendar.getDaysInMonth(s));
  let l = ws(s), c;
  if (n[8]) {
    let g = Kn(n[8], -23, 23);
    var u, b;
    if (s.offset = Math.sign(g) * (Math.abs(g) * 36e5 + Kn((u = n[9]) !== null && u !== void 0 ? u : "0", 0, 59) * 6e4 + Kn((b = n[10]) !== null && b !== void 0 ? b : "0", 0, 59) * 1e3), c = Cs(s) - s.offset, !Jf(l, s.timeZone).includes(c)) throw new Error(`Offset ${Lu(s.offset)} is invalid for ${Kl(s)} in ${s.timeZone}`);
  } else
    c = Ta(ws(l), s.timeZone, e);
  return Oa(c, s.timeZone);
}
function Kn(t, e, n) {
  let r = Number(t);
  if (r < e || r > n) throw new RangeError(`Value out of range: ${e} <= ${r} <= ${n}`);
  return r;
}
function hv(t) {
  return `${String(t.hour).padStart(2, "0")}:${String(t.minute).padStart(2, "0")}:${String(t.second).padStart(2, "0")}${t.millisecond ? String(t.millisecond / 1e3).slice(1) : ""}`;
}
function Ou(t) {
  let e = ea(t, new to()), n;
  return e.era === "BC" ? n = e.year === 1 ? "0000" : "-" + String(Math.abs(1 - e.year)).padStart(6, "00") : n = String(e.year).padStart(4, "0"), `${n}-${String(e.month).padStart(2, "0")}-${String(e.day).padStart(2, "0")}`;
}
function Kl(t) {
  return `${Ou(t)}T${hv(t)}`;
}
function Lu(t) {
  let e = Math.sign(t) < 0 ? "-" : "+";
  t = Math.abs(t);
  let n = Math.floor(t / 36e5), r = Math.floor(t % 36e5 / 6e4), o = Math.floor(t % 36e5 % 6e4 / 1e3), s = `${e}${String(n).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
  return o !== 0 && (s += `:${String(o).padStart(2, "0")}`), s;
}
function fv(t) {
  return `${Kl(t)}${Lu(t.offset)}[${t.timeZone}]`;
}
function vv(t, e) {
  if (e.has(t))
    throw new TypeError("Cannot initialize the same private elements twice on an object");
}
function Yl(t, e, n) {
  vv(t, e), e.set(t, n);
}
function zl(t) {
  let e = typeof t[0] == "object" ? t.shift() : new to(), n;
  if (typeof t[0] == "string") n = t.shift();
  else {
    let l = e.getEras();
    n = l[l.length - 1];
  }
  let r = t.shift(), o = t.shift(), s = t.shift();
  return [
    e,
    n,
    r,
    o,
    s
  ];
}
var pv = /* @__PURE__ */ new WeakMap();
class Ps {
  /** Returns a copy of this date. */
  copy() {
    return this.era ? new Ps(this.calendar, this.era, this.year, this.month, this.day) : new Ps(this.calendar, this.year, this.month, this.day);
  }
  /** Returns a new `CalendarDate` with the given duration added to it. */
  add(e) {
    return Ii(this, e);
  }
  /** Returns a new `CalendarDate` with the given duration subtracted from it. */
  subtract(e) {
    return Eu(this, e);
  }
  /** Returns a new `CalendarDate` with the given fields set to the provided values. Other fields will be constrained accordingly. */
  set(e) {
    return ql(this, e);
  }
  /**
  * Returns a new `CalendarDate` with the given field adjusted by a specified amount.
  * When the resulting value reaches the limits of the field, it wraps around.
  */
  cycle(e, n, r) {
    return Vl(this, e, n, r);
  }
  /** Converts the date to a native JavaScript Date object, with the time set to midnight in the given time zone. */
  toDate(e) {
    return Su(this, e);
  }
  /** Converts the date to an ISO 8601 formatted string. */
  toString() {
    return Ou(this);
  }
  /** Compares this date with another. A negative result indicates that this date is before the given one, and a positive date indicates that it is after. */
  compare(e) {
    return wu(this, e);
  }
  constructor(...e) {
    Yl(this, pv, {
      writable: !0,
      value: void 0
    });
    let [n, r, o, s, l] = zl(e);
    this.calendar = n, this.era = r, this.year = o, this.month = s, this.day = l, Ns(this);
  }
}
var gv = /* @__PURE__ */ new WeakMap();
class os {
  /** Returns a copy of this date. */
  copy() {
    return this.era ? new os(this.calendar, this.era, this.year, this.month, this.day, this.hour, this.minute, this.second, this.millisecond) : new os(this.calendar, this.year, this.month, this.day, this.hour, this.minute, this.second, this.millisecond);
  }
  /** Returns a new `CalendarDateTime` with the given duration added to it. */
  add(e) {
    return Ii(this, e);
  }
  /** Returns a new `CalendarDateTime` with the given duration subtracted from it. */
  subtract(e) {
    return Eu(this, e);
  }
  /** Returns a new `CalendarDateTime` with the given fields set to the provided values. Other fields will be constrained accordingly. */
  set(e) {
    return ql(oi(this, e), e);
  }
  /**
  * Returns a new `CalendarDateTime` with the given field adjusted by a specified amount.
  * When the resulting value reaches the limits of the field, it wraps around.
  */
  cycle(e, n, r) {
    switch (e) {
      case "era":
      case "year":
      case "month":
      case "day":
        return Vl(this, e, n, r);
      default:
        return Au(this, e, n, r);
    }
  }
  /** Converts the date to a native JavaScript Date object in the given time zone. */
  toDate(e, n) {
    return Su(this, e, n);
  }
  /** Converts the date to an ISO 8601 formatted string. */
  toString() {
    return Kl(this);
  }
  /** Compares this date with another. A negative result indicates that this date is before the given one, and a positive date indicates that it is after. */
  compare(e) {
    let n = wu(this, e);
    return n === 0 ? Yf(this, ws(e)) : n;
  }
  constructor(...e) {
    Yl(this, gv, {
      writable: !0,
      value: void 0
    });
    let [n, r, o, s, l] = zl(e);
    this.calendar = n, this.era = r, this.year = o, this.month = s, this.day = l, this.hour = e.shift() || 0, this.minute = e.shift() || 0, this.second = e.shift() || 0, this.millisecond = e.shift() || 0, Ns(this);
  }
}
var yv = /* @__PURE__ */ new WeakMap();
class Fa {
  /** Returns a copy of this date. */
  copy() {
    return this.era ? new Fa(this.calendar, this.era, this.year, this.month, this.day, this.timeZone, this.offset, this.hour, this.minute, this.second, this.millisecond) : new Fa(this.calendar, this.year, this.month, this.day, this.timeZone, this.offset, this.hour, this.minute, this.second, this.millisecond);
  }
  /** Returns a new `ZonedDateTime` with the given duration added to it. */
  add(e) {
    return ku(this, e);
  }
  /** Returns a new `ZonedDateTime` with the given duration subtracted from it. */
  subtract(e) {
    return ov(this, e);
  }
  /** Returns a new `ZonedDateTime` with the given fields set to the provided values. Other fields will be constrained accordingly. */
  set(e, n) {
    return lv(this, e, n);
  }
  /**
  * Returns a new `ZonedDateTime` with the given field adjusted by a specified amount.
  * When the resulting value reaches the limits of the field, it wraps around.
  */
  cycle(e, n, r) {
    return iv(this, e, n, r);
  }
  /** Converts the date to a native JavaScript Date object. */
  toDate() {
    return ev(this);
  }
  /** Converts the date to an ISO 8601 formatted string, including the UTC offset and time zone identifier. */
  toString() {
    return fv(this);
  }
  /** Converts the date to an ISO 8601 formatted string in UTC. */
  toAbsoluteString() {
    return this.toDate().toISOString();
  }
  /** Compares this date with another. A negative result indicates that this date is before the given one, and a positive date indicates that it is after. */
  compare(e) {
    return this.toDate().getTime() - Xf(e, this.timeZone).toDate().getTime();
  }
  constructor(...e) {
    Yl(this, yv, {
      writable: !0,
      value: void 0
    });
    let [n, r, o, s, l] = zl(e), c = e.shift(), u = e.shift();
    this.calendar = n, this.era = r, this.year = o, this.month = s, this.day = l, this.timeZone = c, this.offset = u, this.hour = e.shift() || 0, this.minute = e.shift() || 0, this.second = e.shift() || 0, this.millisecond = e.shift() || 0, Ns(this);
  }
}
let qi = /* @__PURE__ */ new Map();
class ka {
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
    let r = this.formatter.formatToParts(e), o = this.formatter.formatToParts(n);
    return [
      ...r.map((s) => ({
        ...s,
        source: "startRange"
      })),
      {
        type: "literal",
        value: " – ",
        source: "shared"
      },
      ...o.map((s) => ({
        ...s,
        source: "endRange"
      }))
    ];
  }
  /** Returns the resolved formatting options based on the values passed to the constructor. */
  resolvedOptions() {
    let e = this.formatter.resolvedOptions();
    return Cv() && (this.resolvedHourCycle || (this.resolvedHourCycle = wv(e.locale, this.options)), e.hourCycle = this.resolvedHourCycle, e.hour12 = this.resolvedHourCycle === "h11" || this.resolvedHourCycle === "h12"), e.calendar === "ethiopic-amete-alem" && (e.calendar = "ethioaa"), e;
  }
  constructor(e, n = {}) {
    this.formatter = Fu(e, n), this.options = n;
  }
}
const mv = {
  true: {
    // Only Japanese uses the h11 style for 12 hour time. All others use h12.
    ja: "h11"
  },
  false: {}
};
function Fu(t, e = {}) {
  if (typeof e.hour12 == "boolean" && bv()) {
    e = {
      ...e
    };
    let o = mv[String(e.hour12)][t.split("-")[0]], s = e.hour12 ? "h12" : "h23";
    e.hourCycle = o ?? s, delete e.hour12;
  }
  let n = t + (e ? Object.entries(e).sort((o, s) => o[0] < s[0] ? -1 : 1).join() : "");
  if (qi.has(n)) return qi.get(n);
  let r = new Intl.DateTimeFormat(t, e);
  return qi.set(n, r), r;
}
let Vi = null;
function bv() {
  return Vi == null && (Vi = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    hour12: !1
  }).format(new Date(2020, 2, 3, 0)) === "24"), Vi;
}
let ji = null;
function Cv() {
  return ji == null && (ji = new Intl.DateTimeFormat("fr", {
    hour: "numeric",
    hour12: !1
  }).resolvedOptions().hourCycle === "h12"), ji;
}
function wv(t, e) {
  if (!e.timeStyle && !e.hour) return;
  t = t.replace(/(-u-)?-nu-[a-zA-Z0-9]+/, ""), t += (t.includes("-u-") ? "" : "-u") + "-nu-latn";
  let n = Fu(t, {
    ...e,
    timeZone: void 0
    // use local timezone
  }), r = parseInt(n.formatToParts(new Date(2020, 2, 3, 0)).find((s) => s.type === "hour").value, 10), o = parseInt(n.formatToParts(new Date(2020, 2, 3, 23)).find((s) => s.type === "hour").value, 10);
  if (r === 0 && o === 23) return "h23";
  if (r === 24 && o === 23) return "h24";
  if (r === 0 && o === 11) return "h11";
  if (r === 12 && o === 11) return "h12";
  throw new Error("Unexpected hour cycle result");
}
function Pv(t) {
  if (!xs || !t)
    return null;
  let e = t.querySelector("[data-bits-announcer]");
  const n = (o) => {
    const s = t.createElement("div");
    return s.role = "log", s.ariaLive = o, s.setAttribute("aria-relevant", "additions"), s;
  };
  if (!as(e)) {
    const o = t.createElement("div");
    o.style.cssText = kh, o.setAttribute("data-bits-announcer", ""), o.appendChild(n("assertive")), o.appendChild(n("polite")), e = o, t.body.insertBefore(e, t.body.firstChild);
  }
  return {
    getLog: (o) => {
      if (!as(e))
        return null;
      const s = e.querySelector(`[aria-live="${o}"]`);
      return as(s) ? s : null;
    }
  };
}
function ii(t) {
  const e = Pv(t);
  function n(r, o = "assertive", s = 7500) {
    if (!e || !xs || !t)
      return;
    const l = e.getLog(o), c = t.createElement("div");
    return typeof r == "number" ? r = r.toString() : r === null ? r = "Empty" : r = r.trim(), c.innerText = r, o === "assertive" ? l?.replaceChildren(c) : l?.appendChild(c), setTimeout(() => {
      c.remove();
    }, s);
  }
  return {
    announce: n
  };
}
const xv = {
  defaultValue: void 0,
  granularity: "day"
};
function Iv(t) {
  const e = { ...xv, ...t }, { defaultValue: n, granularity: r, minValue: o, maxValue: s } = e;
  if (Array.isArray(n) && n.length)
    return n[n.length - 1];
  if (n && !Array.isArray(n))
    return n;
  {
    let l = /* @__PURE__ */ new Date();
    o && l < o.toDate(ms()) ? l = o.toDate(ms()) : s && l > s.toDate(ms()) && (l = s.toDate(ms()));
    const c = l.getFullYear(), u = l.getMonth() + 1, b = l.getDate();
    return ["hour", "minute", "second"].includes(r ?? "day") ? new os(c, u, b, 0, 0, 0) : new Ps(c, u, b);
  }
}
function Hu(t, e) {
  let n;
  return e instanceof Fa ? n = Mu(t) : e instanceof os ? n = Tu(t) : n = jl(t), n.calendar !== e.calendar ? ea(n, e.calendar) : n;
}
function jr(t, e = ms()) {
  return t instanceof Fa ? t.toDate() : t.toDate(e);
}
function Sv(t) {
  if (t instanceof Ps)
    return "date";
  if (t instanceof os)
    return "datetime";
  if (t instanceof Fa)
    return "zoneddatetime";
  throw new Error("Unknown date type");
}
function Rv(t, e) {
  switch (e) {
    case "date":
      return jl(t);
    case "datetime":
      return Tu(t);
    case "zoneddatetime":
      return Mu(t);
    default:
      throw new Error(`Unknown date type: ${e}`);
  }
}
function _v(t) {
  return t instanceof os;
}
function Ql(t) {
  return t instanceof Fa;
}
function li(t) {
  return _v(t) || Ql(t);
}
function Oo(t) {
  if (t instanceof Date) {
    const e = t.getFullYear(), n = t.getMonth() + 1;
    return new Date(e, n, 0).getDate();
  } else
    return t.set({ day: 100 }).day;
}
function Bs(t, e) {
  return t.compare(e) < 0;
}
function Ev(t, e) {
  return t.compare(e) > 0;
}
function Gd(t, e, n) {
  const r = Cu(t, n);
  return e > r ? t.subtract({ days: r + 7 - e }) : e === r ? t : t.subtract({ days: r - e });
}
function Zd(t, e, n) {
  const r = Cu(t, n), o = e === 0 ? 6 : e - 1;
  return r === o ? t : r > o ? t.add({ days: 7 - r + o }) : t.add({ days: o - r });
}
const Si = ["day", "month", "year"], Wl = ["hour", "minute", "second", "dayPeriod"], Av = ["literal", "timeZoneName"], Ho = [
  ...Si,
  ...Wl
], kv = [
  ...Ho,
  ...Av
], Dv = [
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
], Tv = ["year", "month", "day"], Ki = {
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
function Mv(t) {
  if (Xd(t))
    return Ki[t];
  {
    const e = Hv(t);
    return Xd(e) ? Ki[e] : Ki.en;
  }
}
function Yi(t, e, n) {
  return Ov(t) ? Mv(n)[t] : Fv(t) ? e : Lv(t) ? "––" : "";
}
function Xd(t) {
  return Dv.includes(t);
}
function Ov(t) {
  return Tv.includes(t);
}
function Lv(t) {
  return t === "hour" || t === "minute" || t === "second";
}
function Fv(t) {
  return t === "era" || t === "dayPeriod";
}
function Hv(t) {
  return Intl.Locale ? new Intl.Locale(t).language : t.split("-")[0];
}
function zi(t) {
  const e = ["hour", "minute", "second"], n = Ho.map((r) => r === "dayPeriod" ? [r, "AM"] : [r, null]).filter(([r]) => r === "literal" || r === null ? !1 : t === "day" ? !e.includes(r) : !0);
  return Object.fromEntries(n);
}
function $v(t) {
  const { segmentValues: e, formatter: n, locale: r, dateRef: o } = t, s = Object.keys(e).reduce((c, u) => {
    if (!$u(u))
      return c;
    if ("hour" in e && u === "dayPeriod") {
      const b = e[u];
      gs(b) ? c[u] = Yi(u, "AM", r) : c[u] = b;
    } else
      c[u] = l(u);
    return c;
  }, {});
  function l(c) {
    if ("hour" in e) {
      const u = e[c], b = typeof u == "string" && u?.startsWith("0"), g = u !== null ? Number.parseInt(u) : null;
      if (u === "0" && c !== "year")
        return "0";
      if (!gs(u) && !gs(g)) {
        const y = n.part(o.set({ [c]: u }), c, {
          hourCycle: t.hourCycle === 24 ? "h23" : void 0
        }), x = t.hourCycle === 12 || t.hourCycle === void 0 && Bu(r) === 12;
        if (c === "hour" && x) {
          if (g > 12) {
            const f = g - 12;
            return f === 0 ? "12" : f < 10 ? `0${f}` : `${f}`;
          }
          return g === 0 ? "12" : g < 10 ? `0${g}` : `${g}`;
        }
        return c === "year" ? `${u}` : b && y.length === 1 ? `0${y}` : y;
      } else
        return Yi(c, "", r);
    } else {
      if (Ri(c)) {
        const u = e[c], b = typeof u == "string" && u?.startsWith("0");
        if (u === "0")
          return "0";
        if (gs(u))
          return Yi(c, "", r);
        {
          const g = n.part(o.set({ [c]: u }), c);
          return c === "year" ? `${u}` : b && g.length === 1 ? `0${g}` : g;
        }
      }
      return "";
    }
  }
  return s;
}
function Nv(t) {
  const { granularity: e, dateRef: n, formatter: r, contentObj: o, hideTimeZone: s, hourCycle: l } = t;
  return r.toParts(n, Uv(e, l)).map((b) => ["literal", "dayPeriod", "timeZoneName", null].includes(b.type) || !$u(b.type) ? {
    part: b.type,
    value: b.value
  } : {
    part: b.type,
    value: o[b.type]
  }).filter((b) => !(gs(b.part) || gs(b.value) || b.part === "timeZoneName" && (!Ql(n) || s)));
}
function Bv(t) {
  const e = $v(t), n = Nv({
    contentObj: e,
    ...t
  });
  return {
    obj: e,
    arr: n
  };
}
function Uv(t, e) {
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
function ec() {
  return Ho.reduce((t, e) => (t[e] = {
    lastKeyZero: !1,
    hasLeftFocus: !0,
    updating: null
  }, t), {});
}
function Ri(t) {
  return Si.includes(t);
}
function $u(t) {
  return Ho.includes(t);
}
function qv(t) {
  return kv.includes(t);
}
function Nu(t) {
  return !xs || !t ? [] : Zl(t).map((n) => n.dataset.segment).filter((n) => Ho.includes(n));
}
function Vv(t) {
  const { segmentObj: e, fieldNode: n, dateRef: r } = t, o = Nu(n);
  let s = r;
  for (const l of o)
    if ("hour" in e) {
      const c = e[l];
      if (gs(c))
        continue;
      s = s.set({ [l]: e[l] });
    } else if (Ri(l)) {
      const c = e[l];
      if (gs(c))
        continue;
      s = s.set({ [l]: e[l] });
    }
  return s;
}
function jv(t, e) {
  const n = Nu(e);
  for (const r of n)
    if ("hour" in t) {
      if (t[r] === null)
        return !1;
    } else if (Ri(r) && t[r] === null)
      return !1;
  return !0;
}
function Kv(t) {
  return typeof t != "object" || t === null ? !1 : Object.entries(t).every(([e, n]) => (Wl.includes(e) || Si.includes(e)) && (e === "dayPeriod" ? n === "AM" || n === "PM" || n === null : typeof n == "string" || typeof n == "number" || n === null));
}
function Yv(t, e) {
  return e || (li(t) ? "minute" : "day");
}
function Jl(t) {
  return !!([
    Kc,
    pi,
    gi,
    Lo,
    Fo,
    Yc,
    zc
  ].includes(t) || yi(t));
}
function zv(t, e) {
  if (!xs)
    return !1;
  const n = Zl(e);
  return n.length ? n[0].id === t : !1;
}
function Qv(t) {
  const { id: e, formatter: n, value: r, doc: o } = t;
  if (!xs)
    return;
  const s = n.selectedDate(r), l = o.getElementById(e);
  if (l)
    l.innerText = `Selected Date: ${s}`;
  else {
    const c = o.createElement("div");
    c.style.cssText = jc({
      display: "none"
    }), c.id = e, c.innerText = `Selected Date: ${s}`, o.body.appendChild(c);
  }
}
function Wv(t, e) {
  if (!xs)
    return;
  const n = e.getElementById(t);
  n && e.body.removeChild(n);
}
function Bu(t) {
  return new Intl.DateTimeFormat(t, { hour: "numeric" }).formatToParts(/* @__PURE__ */ new Date("2023-01-01T13:00:00")).find((o) => o.type === "hour")?.value === "1" ? 12 : 24;
}
function $o(t, e) {
  const n = t.currentTarget;
  if (!as(n))
    return;
  const { prev: r, next: o } = Gl(n, e);
  if (t.key === Lo) {
    if (!r)
      return;
    r.focus();
  } else if (t.key === Fo) {
    if (!o)
      return;
    o.focus();
  }
}
function Jv(t, e) {
  const n = e.indexOf(t);
  if (n === e.length - 1 || n === -1)
    return null;
  const r = n + 1;
  return e[r];
}
function Gv(t, e) {
  const n = e.indexOf(t);
  if (n === 0 || n === -1)
    return null;
  const r = n - 1;
  return e[r];
}
function Gl(t, e) {
  const n = Zl(e);
  return n.length ? {
    next: Jv(t, n),
    prev: Gv(t, n)
  } : {
    next: null,
    prev: null
  };
}
function Uu(t, e) {
  const n = t.currentTarget;
  if (!as(n))
    return;
  const { next: r } = Gl(n, e);
  r && r.focus();
}
function qu(t, e) {
  const n = t.currentTarget;
  if (!as(n))
    return;
  const { prev: r } = Gl(n, e);
  r && r.focus();
}
function No(t) {
  return t === Fo || t === Lo;
}
function Zl(t) {
  return t ? Array.from(t.querySelectorAll("[data-segment]")).filter((n) => {
    if (!as(n))
      return !1;
    const r = n.dataset.segment;
    return r === "trigger" ? !0 : !(!qv(r) || r === "literal");
  }) : [];
}
const Zv = {
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric"
};
function Vu(t) {
  let e = t.initialLocale;
  function n(f) {
    e = f;
  }
  function r() {
    return e;
  }
  function o(f, R) {
    return new ka(e, R).format(f);
  }
  function s(f, R = !0) {
    return li(f) && R ? o(jr(f), {
      dateStyle: "long",
      timeStyle: "long"
    }) : o(jr(f), {
      dateStyle: "long"
    });
  }
  function l(f) {
    if (typeof t.monthFormat.current != "function" && typeof t.yearFormat.current != "function")
      return new ka(e, {
        month: t.monthFormat.current,
        year: t.yearFormat.current
      }).format(f);
    const R = typeof t.monthFormat.current == "function" ? t.monthFormat.current(f.getMonth() + 1) : new ka(e, { month: t.monthFormat.current }).format(f), w = typeof t.yearFormat.current == "function" ? t.yearFormat.current(f.getFullYear()) : new ka(e, { year: t.yearFormat.current }).format(f);
    return `${R} ${w}`;
  }
  function c(f) {
    return new ka(e, { month: "long" }).format(f);
  }
  function u(f) {
    return new ka(e, { year: "numeric" }).format(f);
  }
  function b(f, R) {
    return Ql(f) ? new ka(e, {
      ...R,
      timeZone: f.timeZone
    }).formatToParts(jr(f)) : new ka(e, R).formatToParts(jr(f));
  }
  function g(f, R = "narrow") {
    return new ka(e, { weekday: R }).format(f);
  }
  function y(f, R = void 0) {
    return new ka(e, {
      hour: "numeric",
      minute: "numeric",
      hourCycle: R === 24 ? "h23" : void 0
    }).formatToParts(f).find((i) => i.type === "dayPeriod")?.value === "PM" ? "PM" : "AM";
  }
  function x(f, R, w = {}) {
    const m = { ...Zv, ...w }, O = b(f, m).find((W) => W.type === R);
    return O ? O.value : "";
  }
  return {
    setLocale: n,
    getLocale: r,
    fullMonth: c,
    fullYear: u,
    fullMonthAndYear: l,
    toParts: b,
    custom: o,
    part: x,
    dayPeriod: y,
    selectedDate: s,
    dayOfWeek: g
  };
}
function Xv(t) {
  return !(!as(t) || !t.hasAttribute("data-bits-day"));
}
function tc(t, e) {
  const n = [];
  let r = t.add({ days: 1 });
  const o = e;
  for (; r.compare(o) < 0; )
    n.push(r), r = r.add({ days: 1 });
  return n;
}
function Qi(t) {
  const { dateObj: e, weekStartsOn: n, fixedWeeks: r, locale: o } = t, s = Oo(e), l = Array.from({ length: s }, (m, i) => e.set({ day: i + 1 })), c = yl(e), u = zf(e), b = n !== void 0 ? Gd(c, n, "en-US") : Gd(c, 0, o), g = n !== void 0 ? Zd(u, n, "en-US") : Zd(u, 0, o), y = tc(b.subtract({ days: 1 }), c), x = tc(u, g.add({ days: 1 })), f = y.length + l.length + x.length;
  if (r && f < 42) {
    const m = 42 - f;
    let i = x[x.length - 1];
    i || (i = e.add({ months: 1 }).set({ day: 1 }));
    let O = m;
    x.length === 0 && (O = m - 1, x.push(i));
    const W = Array.from({ length: O }, ($, X) => {
      const me = X + 1;
      return i.add({ days: me });
    });
    x.push(...W);
  }
  const R = y.concat(l, x), w = Dh(R, 7);
  return { value: e, dates: R, weeks: w };
}
function Bo(t) {
  const { numberOfMonths: e, dateObj: n, ...r } = t, o = [];
  if (!e || e === 1)
    return o.push(Qi({ ...r, dateObj: n })), o;
  o.push(Qi({ ...r, dateObj: n }));
  for (let s = 1; s < e; s++) {
    const l = n.add({ months: s });
    o.push(Qi({ ...r, dateObj: l }));
  }
  return o;
}
function Wi(t) {
  return t ? Array.from(t.querySelectorAll("[data-bits-day]:not([data-disabled]):not([data-outside-visible-months])")).filter((n) => as(n)) : [];
}
function nc(t, e) {
  const n = t.getAttribute("data-value");
  n && (e.current = Hu(n, e.current));
}
function ep({
  node: t,
  add: e,
  placeholder: n,
  calendarNode: r,
  isPrevButtonDisabled: o,
  isNextButtonDisabled: s,
  months: l,
  numberOfMonths: c
}) {
  const u = Wi(r);
  if (!u.length) return;
  const g = u.indexOf(t) + e;
  if (Mi(g, u)) {
    const y = u[g];
    return nc(y, n), y.focus();
  }
  if (g < 0) {
    if (o) return;
    const y = l[0]?.value;
    if (!y) return;
    n.current = y.subtract({ months: c }), Fd(() => {
      const x = Wi(r);
      if (!x.length) return;
      const f = x.length - Math.abs(g);
      if (Mi(f, x)) {
        const R = x[f];
        return nc(R, n), R.focus();
      }
    });
  }
  if (g >= u.length) {
    if (s) return;
    const y = l[0]?.value;
    if (!y) return;
    n.current = y.add({ months: c }), Fd(() => {
      const x = Wi(r);
      if (!x.length) return;
      const f = g - u.length;
      if (Mi(f, x))
        return x[f].focus();
    });
  }
}
const rc = [
  gi,
  pi,
  Lo,
  Fo
], ac = [Kc, zc];
function tp({ event: t, handleCellClick: e, shiftFocus: n, placeholderValue: r }) {
  const o = t.target;
  if (!Xv(o) || !rc.includes(t.key) && !ac.includes(t.key)) return;
  t.preventDefault();
  const s = {
    [gi]: 7,
    [pi]: -7,
    [Lo]: -1,
    [Fo]: 1
  };
  if (rc.includes(t.key)) {
    const l = s[t.key];
    l !== void 0 && n(o, l);
  }
  if (ac.includes(t.key)) {
    const l = o.getAttribute("data-value");
    if (!l) return;
    e(t, Hu(l, r));
  }
}
function np({
  months: t,
  setMonths: e,
  numberOfMonths: n,
  pagedNavigation: r,
  weekStartsOn: o,
  locale: s,
  fixedWeeks: l,
  setPlaceholder: c
}) {
  const u = t[0]?.value;
  if (u)
    if (r)
      c(u.add({ months: n }));
    else {
      const b = u.add({ months: 1 }), g = Bo({
        dateObj: b,
        weekStartsOn: o,
        locale: s,
        fixedWeeks: l,
        numberOfMonths: n
      });
      c(b), e(g);
    }
}
function rp({
  months: t,
  setMonths: e,
  numberOfMonths: n,
  pagedNavigation: r,
  weekStartsOn: o,
  locale: s,
  fixedWeeks: l,
  setPlaceholder: c
}) {
  const u = t[0]?.value;
  if (u)
    if (r)
      c(u.subtract({ months: n }));
    else {
      const b = u.subtract({ months: 1 }), g = Bo({
        dateObj: b,
        weekStartsOn: o,
        locale: s,
        fixedWeeks: l,
        numberOfMonths: n
      });
      c(b), e(g);
    }
}
function ap({ months: t, formatter: e, weekdayFormat: n }) {
  if (!t.length) return [];
  const o = t[0].weeks[0];
  return o ? o.map((s) => e.dayOfWeek(jr(s), n)) : [];
}
function sp(t) {
  Ke(() => {
    const e = t.weekStartsOn.current, n = t.locale.current, r = t.fixedWeeks.current, o = t.numberOfMonths.current;
    ca(() => {
      const s = t.placeholder.current;
      if (!s) return;
      const l = { weekStartsOn: e, locale: n, fixedWeeks: r, numberOfMonths: o };
      t.setMonths(Bo({ ...l, dateObj: s }));
    });
  });
}
function op({ calendarNode: t, label: e, accessibleHeadingId: n }) {
  const r = Qc(t), o = r.createElement("div");
  o.style.cssText = jc({
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
  const s = r.createElement("div");
  return s.textContent = e, s.id = n, s.role = "heading", s.ariaLevel = "2", t.insertBefore(o, t.firstChild), o.appendChild(s), () => {
    const l = r.getElementById(n);
    l && (o.parentElement?.removeChild(o), l.remove());
  };
}
function ip({
  placeholder: t,
  getVisibleMonths: e,
  weekStartsOn: n,
  locale: r,
  fixedWeeks: o,
  numberOfMonths: s,
  setMonths: l
}) {
  Ke(() => {
    t.current, ca(() => {
      if (e().some((u) => Ul(u, t.current)))
        return;
      const c = {
        weekStartsOn: n.current,
        locale: r.current,
        fixedWeeks: o.current,
        numberOfMonths: s.current
      };
      l(Bo({ ...c, dateObj: t.current }));
    });
  });
}
function lp({ maxValue: t, months: e, disabled: n }) {
  if (!t || !e.length) return !1;
  if (n) return !0;
  const r = e[e.length - 1]?.value;
  if (!r) return !1;
  const o = r.add({ months: 1 }).set({ day: 1 });
  return Ev(o, t);
}
function dp({ minValue: t, months: e, disabled: n }) {
  if (!t || !e.length) return !1;
  if (n) return !0;
  const r = e[0]?.value;
  if (!r) return !1;
  const o = r.subtract({ months: 1 }).set({ day: 35 });
  return Bs(o, t);
}
function cp({ months: t, locale: e, formatter: n }) {
  if (!t.length) return "";
  if (e !== n.getLocale() && n.setLocale(e), t.length === 1) {
    const g = jr(t[0].value);
    return `${n.fullMonthAndYear(g)}`;
  }
  const r = jr(t[0].value), o = jr(t[t.length - 1].value), s = n.fullMonth(r), l = n.fullMonth(o), c = n.fullYear(r), u = n.fullYear(o);
  return c === u ? `${s} - ${l} ${u}` : `${s} ${c} - ${l} ${u}`;
}
function up({ fullCalendarLabel: t, id: e, isInvalid: n, disabled: r, readonly: o }) {
  return {
    id: e,
    role: "application",
    "aria-label": t,
    "data-invalid": en(n),
    "data-disabled": en(r),
    "data-readonly": en(o)
  };
}
function hp(t) {
  const n = Qc(t.target).querySelector("[data-bits-day][data-focused]");
  n && (t.preventDefault(), n?.focus());
}
function fp(t) {
  if (!xs) return;
  const e = Array.from(t.querySelectorAll("[data-bits-day]:not([aria-disabled=true])"));
  if (e.length === 0) return;
  const n = e[0], r = n?.getAttribute("data-value"), o = n?.getAttribute("data-type");
  if (!(!r || !o))
    return Rv(r, o);
}
function vp({
  ref: t,
  placeholder: e,
  defaultPlaceholder: n,
  minValue: r,
  maxValue: o,
  isDateDisabled: s
}) {
  function l(c) {
    return !!(s.current(c) || r.current && Bs(c, r.current) || o.current && Bs(o.current, c));
  }
  eo(() => t.current, () => {
    t.current && e.current && ps(e.current, n) && l(n) && (e.current = fp(t.current) ?? n);
  });
}
function pp(t, e) {
  return !t || !e ? t : li(t) && li(e) ? t.set({
    hour: e.hour,
    minute: e.minute,
    millisecond: e.millisecond,
    second: e.second
  }) : t;
}
const gp = Wc({
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
function yp(t) {
  const e = (/* @__PURE__ */ new Date()).getFullYear(), n = Math.max(t.placeholderYear, e);
  let r, o;
  if (t.minValue)
    r = t.minValue.year;
  else {
    const l = n - 100;
    r = t.placeholderYear < l ? t.placeholderYear - 10 : l;
  }
  t.maxValue ? o = t.maxValue.year : o = n + 10, r > o && (r = o);
  const s = o - r + 1;
  return Array.from({ length: s }, (l, c) => r + c);
}
const xa = new mi("Calendar.Root | RangeCalender.Root");
class Xl {
  static create(e) {
    return xa.set(new Xl(e));
  }
  opts;
  #e = I(() => this.months.map((e) => e.value));
  get visibleMonths() {
    return a(this.#e);
  }
  set visibleMonths(e) {
    p(this.#e, e);
  }
  formatter;
  accessibleHeadingId = Jc();
  domContext;
  attachment;
  #t = ye(lr([]));
  get months() {
    return a(this.#t);
  }
  set months(e) {
    p(this.#t, e, !0);
  }
  announcer;
  constructor(e) {
    this.opts = e, this.attachment = fr(this.opts.ref), this.domContext = new _l(e.ref), this.announcer = ii(null), this.formatter = Vu({
      initialLocale: this.opts.locale.current,
      monthFormat: this.opts.monthFormat,
      yearFormat: this.opts.yearFormat
    }), this.setMonths = this.setMonths.bind(this), this.nextPage = this.nextPage.bind(this), this.prevPage = this.prevPage.bind(this), this.prevYear = this.prevYear.bind(this), this.nextYear = this.nextYear.bind(this), this.setYear = this.setYear.bind(this), this.setMonth = this.setMonth.bind(this), this.isOutsideVisibleMonths = this.isOutsideVisibleMonths.bind(this), this.isDateDisabled = this.isDateDisabled.bind(this), this.isDateSelected = this.isDateSelected.bind(this), this.shiftFocus = this.shiftFocus.bind(this), this.handleCellClick = this.handleCellClick.bind(this), this.handleMultipleUpdate = this.handleMultipleUpdate.bind(this), this.handleSingleUpdate = this.handleSingleUpdate.bind(this), this.onkeydown = this.onkeydown.bind(this), this.getBitsAttr = this.getBitsAttr.bind(this), Gc(() => {
      this.announcer = ii(this.domContext.getDocument());
    }), this.months = Bo({
      dateObj: this.opts.placeholder.current,
      weekStartsOn: this.opts.weekStartsOn.current,
      locale: this.opts.locale.current,
      fixedWeeks: this.opts.fixedWeeks.current,
      numberOfMonths: this.opts.numberOfMonths.current
    }), this.#s(), this.#i(), this.#l(), ip({
      placeholder: this.opts.placeholder,
      getVisibleMonths: () => this.visibleMonths,
      weekStartsOn: this.opts.weekStartsOn,
      locale: this.opts.locale,
      fixedWeeks: this.opts.fixedWeeks,
      numberOfMonths: this.opts.numberOfMonths,
      setMonths: (n) => this.months = n
    }), sp({
      fixedWeeks: this.opts.fixedWeeks,
      locale: this.opts.locale,
      numberOfMonths: this.opts.numberOfMonths,
      placeholder: this.opts.placeholder,
      setMonths: this.setMonths,
      weekStartsOn: this.opts.weekStartsOn
    }), eo(() => this.fullCalendarLabel, (n) => {
      const r = this.domContext.getElementById(this.accessibleHeadingId);
      r && (r.textContent = n);
    }), eo(() => this.opts.value.current, () => {
      const n = this.opts.value.current;
      if (Array.isArray(n) && n.length) {
        const r = n[n.length - 1];
        r && this.opts.placeholder.current !== r && (this.opts.placeholder.current = r);
      } else !Array.isArray(n) && n && this.opts.placeholder.current !== n && (this.opts.placeholder.current = n);
    }), vp({
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
  #n = I(
    /**
     * This derived state holds an array of localized day names for the current
     * locale and calendar view. It dynamically syncs with the 'weekStartsOn' option,
     * updating its content when the option changes. Using this state to render the
     * calendar's days of the week is strongly recommended, as it guarantees that
     * the days are correctly formatted for the current locale and calendar view.
     */
    () => ap({
      months: this.months,
      formatter: this.formatter,
      weekdayFormat: this.opts.weekdayFormat.current
    })
  );
  get weekdays() {
    return a(this.#n);
  }
  set weekdays(e) {
    p(this.#n, e);
  }
  #r = I(() => ca(() => this.opts.placeholder.current.year));
  get initialPlaceholderYear() {
    return a(this.#r);
  }
  set initialPlaceholderYear(e) {
    p(this.#r, e);
  }
  #a = I(() => yp({
    minValue: this.opts.minValue.current,
    maxValue: this.opts.maxValue.current,
    placeholderYear: this.initialPlaceholderYear
  }));
  get defaultYears() {
    return a(this.#a);
  }
  set defaultYears(e) {
    p(this.#a, e);
  }
  #s() {
    Ke(() => {
      if (ca(() => this.opts.initialFocus.current)) {
        const n = this.opts.ref.current?.querySelector("[data-focused]");
        n && n.focus();
      }
    });
  }
  #i() {
    Ke(() => this.opts.ref.current ? op({
      calendarNode: this.opts.ref.current,
      label: this.fullCalendarLabel,
      accessibleHeadingId: this.accessibleHeadingId
    }) : void 0);
  }
  #l() {
    Sf(() => {
      this.formatter.getLocale() !== this.opts.locale.current && this.formatter.setLocale(this.opts.locale.current);
    });
  }
  /**
   * Navigates to the next page of the calendar.
   */
  nextPage() {
    np({
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
    rp({
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
  #o = I(() => lp({
    maxValue: this.opts.maxValue.current,
    months: this.months,
    disabled: this.opts.disabled.current
  }));
  get isNextButtonDisabled() {
    return a(this.#o);
  }
  set isNextButtonDisabled(e) {
    p(this.#o, e);
  }
  #d = I(() => dp({
    minValue: this.opts.minValue.current,
    months: this.months,
    disabled: this.opts.disabled.current
  }));
  get isPrevButtonDisabled() {
    return a(this.#d);
  }
  set isPrevButtonDisabled(e) {
    p(this.#d, e);
  }
  #c = I(() => {
    const e = this.opts.value.current, n = this.opts.isDateDisabled.current, r = this.opts.isDateUnavailable.current;
    if (Array.isArray(e)) {
      if (!e.length) return !1;
      for (const o of e)
        if (n(o) || r(o)) return !0;
    } else {
      if (!e) return !1;
      if (n(e) || r(e)) return !0;
    }
    return !1;
  });
  get isInvalid() {
    return a(this.#c);
  }
  set isInvalid(e) {
    p(this.#c, e);
  }
  #u = I(() => (this.opts.monthFormat.current, this.opts.yearFormat.current, cp({
    months: this.months,
    formatter: this.formatter,
    locale: this.opts.locale.current
  })));
  get headingValue() {
    return a(this.#u);
  }
  set headingValue(e) {
    p(this.#u, e);
  }
  #h = I(() => `${this.opts.calendarLabel.current} ${this.headingValue}`);
  get fullCalendarLabel() {
    return a(this.#h);
  }
  set fullCalendarLabel(e) {
    p(this.#h, e);
  }
  isOutsideVisibleMonths(e) {
    return !this.visibleMonths.some((n) => Ul(e, n));
  }
  isDateDisabled(e) {
    if (this.opts.isDateDisabled.current(e) || this.opts.disabled.current) return !0;
    const n = this.opts.minValue.current, r = this.opts.maxValue.current;
    return !!(n && Bs(e, n) || r && Bs(r, e));
  }
  isDateSelected(e) {
    const n = this.opts.value.current;
    return Array.isArray(n) ? n.some((r) => ps(r, e)) : n ? ps(n, e) : !1;
  }
  shiftFocus(e, n) {
    return ep({
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
    const r = this.opts.value.current;
    if (this.opts.type.current === "multiple")
      (Array.isArray(r) || r === void 0) && (this.opts.value.current = this.handleMultipleUpdate(r, n));
    else if (!Array.isArray(r)) {
      const s = this.handleSingleUpdate(r, n);
      s ? this.announcer.announce(`Selected Date: ${this.formatter.selectedDate(s, !1)}`, "polite") : this.announcer.announce("Selected date is now empty.", "polite", 5e3), this.opts.value.current = pp(s, r), s !== void 0 && this.opts.onDateSelect?.current?.();
    }
  }
  handleMultipleUpdate(e, n) {
    if (!e) {
      const s = [n];
      return this.#f(s) ? s : [n];
    }
    if (!Array.isArray(e))
      return;
    const r = e.findIndex((s) => ps(s, n)), o = this.opts.preventDeselect.current;
    if (r === -1) {
      const s = [...e, n];
      return this.#f(s) ? s : [n];
    } else {
      if (o)
        return e;
      {
        const s = e.filter((l) => !ps(l, n));
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
    if (!this.opts.preventDeselect.current && ps(e, n)) {
      this.opts.placeholder.current = n;
      return;
    }
    return n;
  }
  onkeydown(e) {
    tp({
      event: e,
      handleCellClick: this.handleCellClick,
      shiftFocus: this.shiftFocus,
      placeholderValue: this.opts.placeholder.current
    });
  }
  #v = I(() => ({ months: this.months, weekdays: this.weekdays }));
  get snippetProps() {
    return a(this.#v);
  }
  set snippetProps(e) {
    p(this.#v, e);
  }
  getBitsAttr = (e) => gp.getAttr(e);
  #p = I(() => ({
    ...up({
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
    return a(this.#p);
  }
  set props(e) {
    p(this.#p, e);
  }
}
class ed {
  static create(e) {
    return new ed(e, xa.get());
  }
  opts;
  root;
  attachment;
  constructor(e, n) {
    this.opts = e, this.root = n, this.attachment = fr(this.opts.ref);
  }
  #e = I(() => ({
    id: this.opts.id.current,
    "aria-hidden": El(!0),
    "data-disabled": en(this.root.opts.disabled.current),
    "data-readonly": en(this.root.opts.readonly.current),
    [this.root.getBitsAttr("heading")]: "",
    ...this.attachment
  }));
  get props() {
    return a(this.#e);
  }
  set props(e) {
    p(this.#e, e);
  }
}
const ju = new mi("Calendar.Cell | RangeCalendar.Cell");
class td {
  static create(e) {
    return ju.set(new td(e, xa.get()));
  }
  opts;
  root;
  #e = I(() => jr(this.opts.date.current));
  get cellDate() {
    return a(this.#e);
  }
  set cellDate(e) {
    p(this.#e, e);
  }
  #t = I(() => this.root.opts.isDateUnavailable.current(this.opts.date.current));
  get isUnavailable() {
    return a(this.#t);
  }
  set isUnavailable(e) {
    p(this.#t, e);
  }
  #n = I(() => Vf(this.opts.date.current, ms()));
  get isDateToday() {
    return a(this.#n);
  }
  set isDateToday(e) {
    p(this.#n, e);
  }
  #r = I(() => !Ul(this.opts.date.current, this.opts.month.current));
  get isOutsideMonth() {
    return a(this.#r);
  }
  set isOutsideMonth(e) {
    p(this.#r, e);
  }
  #a = I(() => this.root.isOutsideVisibleMonths(this.opts.date.current));
  get isOutsideVisibleMonths() {
    return a(this.#a);
  }
  set isOutsideVisibleMonths(e) {
    p(this.#a, e);
  }
  #s = I(() => this.root.isDateDisabled(this.opts.date.current) || this.isOutsideMonth && this.root.opts.disableDaysOutsideMonth.current);
  get isDisabled() {
    return a(this.#s);
  }
  set isDisabled(e) {
    p(this.#s, e);
  }
  #i = I(() => ps(this.opts.date.current, this.root.opts.placeholder.current));
  get isFocusedDate() {
    return a(this.#i);
  }
  set isFocusedDate(e) {
    p(this.#i, e);
  }
  #l = I(() => this.root.isDateSelected(this.opts.date.current));
  get isSelectedDate() {
    return a(this.#l);
  }
  set isSelectedDate(e) {
    p(this.#l, e);
  }
  #o = I(() => this.root.formatter.custom(this.cellDate, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  }));
  get labelText() {
    return a(this.#o);
  }
  set labelText(e) {
    p(this.#o, e);
  }
  attachment;
  constructor(e, n) {
    this.opts = e, this.root = n, this.attachment = fr(this.opts.ref);
  }
  #d = I(() => ({
    disabled: this.isDisabled,
    unavailable: this.isUnavailable,
    selected: this.isSelectedDate,
    day: `${this.opts.date.current.day}`
  }));
  get snippetProps() {
    return a(this.#d);
  }
  set snippetProps(e) {
    p(this.#d, e);
  }
  #c = I(() => this.isDisabled || this.isOutsideMonth && this.root.opts.disableDaysOutsideMonth.current || this.isUnavailable);
  get ariaDisabled() {
    return a(this.#c);
  }
  set ariaDisabled(e) {
    p(this.#c, e);
  }
  #u = I(() => ({
    "data-unavailable": en(this.isUnavailable),
    "data-today": this.isDateToday ? "" : void 0,
    "data-outside-month": this.isOutsideMonth ? "" : void 0,
    "data-outside-visible-months": this.isOutsideVisibleMonths ? "" : void 0,
    "data-focused": this.isFocusedDate ? "" : void 0,
    "data-selected": en(this.isSelectedDate),
    "data-value": this.opts.date.current.toString(),
    "data-type": Sv(this.opts.date.current),
    "data-disabled": en(this.isDisabled || this.isOutsideMonth && this.root.opts.disableDaysOutsideMonth.current)
  }));
  get sharedDataAttrs() {
    return a(this.#u);
  }
  set sharedDataAttrs(e) {
    p(this.#u, e);
  }
  #h = I(() => ({
    id: this.opts.id.current,
    role: "gridcell",
    "aria-selected": La(this.isSelectedDate),
    "aria-disabled": La(this.ariaDisabled),
    ...this.sharedDataAttrs,
    [this.root.getBitsAttr("cell")]: "",
    ...this.attachment
  }));
  get props() {
    return a(this.#h);
  }
  set props(e) {
    p(this.#h, e);
  }
}
class nd {
  static create(e) {
    return new nd(e, ju.get());
  }
  opts;
  cell;
  attachment;
  constructor(e, n) {
    this.opts = e, this.cell = n, this.onclick = this.onclick.bind(this), this.attachment = fr(this.opts.ref);
  }
  #e = I(() => this.cell.isOutsideMonth && this.cell.root.opts.disableDaysOutsideMonth.current || this.cell.isDisabled ? void 0 : this.cell.isFocusedDate ? 0 : -1);
  onclick(e) {
    this.cell.isDisabled || this.cell.root.handleCellClick(e, this.cell.opts.date.current);
  }
  #t = I(() => ({
    disabled: this.cell.isDisabled,
    unavailable: this.cell.isUnavailable,
    selected: this.cell.isSelectedDate,
    day: `${this.cell.opts.date.current.day}`
  }));
  get snippetProps() {
    return a(this.#t);
  }
  set snippetProps(e) {
    p(this.#t, e);
  }
  #n = I(() => ({
    id: this.opts.id.current,
    role: "button",
    "aria-label": this.cell.labelText,
    "aria-disabled": La(this.cell.ariaDisabled),
    ...this.cell.sharedDataAttrs,
    tabindex: a(this.#e),
    [this.cell.root.getBitsAttr("day")]: "",
    "data-bits-day": "",
    onclick: this.onclick,
    ...this.attachment
  }));
  get props() {
    return a(this.#n);
  }
  set props(e) {
    p(this.#n, e);
  }
}
class rd {
  static create(e) {
    return new rd(e, xa.get());
  }
  opts;
  root;
  #e = I(() => this.root.isNextButtonDisabled);
  get isDisabled() {
    return a(this.#e);
  }
  set isDisabled(e) {
    p(this.#e, e);
  }
  attachment;
  constructor(e, n) {
    this.opts = e, this.root = n, this.onclick = this.onclick.bind(this), this.attachment = fr(this.opts.ref);
  }
  onclick(e) {
    this.isDisabled || this.root.nextPage();
  }
  #t = I(() => ({
    id: this.opts.id.current,
    role: "button",
    type: "button",
    "aria-label": "Next",
    "aria-disabled": La(this.isDisabled),
    "data-disabled": en(this.isDisabled),
    disabled: this.isDisabled,
    [this.root.getBitsAttr("next-button")]: "",
    //
    onclick: this.onclick,
    ...this.attachment
  }));
  get props() {
    return a(this.#t);
  }
  set props(e) {
    p(this.#t, e);
  }
}
class ad {
  static create(e) {
    return new ad(e, xa.get());
  }
  opts;
  root;
  #e = I(() => this.root.isPrevButtonDisabled);
  get isDisabled() {
    return a(this.#e);
  }
  set isDisabled(e) {
    p(this.#e, e);
  }
  attachment;
  constructor(e, n) {
    this.opts = e, this.root = n, this.onclick = this.onclick.bind(this), this.attachment = fr(this.opts.ref);
  }
  onclick(e) {
    this.isDisabled || this.root.prevPage();
  }
  #t = I(() => ({
    id: this.opts.id.current,
    role: "button",
    type: "button",
    "aria-label": "Previous",
    "aria-disabled": La(this.isDisabled),
    "data-disabled": en(this.isDisabled),
    disabled: this.isDisabled,
    [this.root.getBitsAttr("prev-button")]: "",
    //
    onclick: this.onclick,
    ...this.attachment
  }));
  get props() {
    return a(this.#t);
  }
  set props(e) {
    p(this.#t, e);
  }
}
class sd {
  static create(e) {
    return new sd(e, xa.get());
  }
  opts;
  root;
  attachment;
  constructor(e, n) {
    this.opts = e, this.root = n, this.attachment = fr(this.opts.ref);
  }
  #e = I(() => ({
    id: this.opts.id.current,
    tabindex: -1,
    role: "grid",
    "aria-readonly": La(this.root.opts.readonly.current),
    "aria-disabled": La(this.root.opts.disabled.current),
    "data-readonly": en(this.root.opts.readonly.current),
    "data-disabled": en(this.root.opts.disabled.current),
    [this.root.getBitsAttr("grid")]: "",
    ...this.attachment
  }));
  get props() {
    return a(this.#e);
  }
  set props(e) {
    p(this.#e, e);
  }
}
class od {
  static create(e) {
    return new od(e, xa.get());
  }
  opts;
  root;
  attachment;
  constructor(e, n) {
    this.opts = e, this.root = n, this.attachment = fr(this.opts.ref);
  }
  #e = I(() => ({
    id: this.opts.id.current,
    "data-disabled": en(this.root.opts.disabled.current),
    "data-readonly": en(this.root.opts.readonly.current),
    [this.root.getBitsAttr("grid-body")]: "",
    ...this.attachment
  }));
  get props() {
    return a(this.#e);
  }
  set props(e) {
    p(this.#e, e);
  }
}
class id {
  static create(e) {
    return new id(e, xa.get());
  }
  opts;
  root;
  attachment;
  constructor(e, n) {
    this.opts = e, this.root = n, this.attachment = fr(this.opts.ref);
  }
  #e = I(() => ({
    id: this.opts.id.current,
    "data-disabled": en(this.root.opts.disabled.current),
    "data-readonly": en(this.root.opts.readonly.current),
    [this.root.getBitsAttr("grid-head")]: "",
    ...this.attachment
  }));
  get props() {
    return a(this.#e);
  }
  set props(e) {
    p(this.#e, e);
  }
}
class ld {
  static create(e) {
    return new ld(e, xa.get());
  }
  opts;
  root;
  attachment;
  constructor(e, n) {
    this.opts = e, this.root = n, this.attachment = fr(this.opts.ref);
  }
  #e = I(() => ({
    id: this.opts.id.current,
    "data-disabled": en(this.root.opts.disabled.current),
    "data-readonly": en(this.root.opts.readonly.current),
    [this.root.getBitsAttr("grid-row")]: "",
    ...this.attachment
  }));
  get props() {
    return a(this.#e);
  }
  set props(e) {
    p(this.#e, e);
  }
}
class dd {
  static create(e) {
    return new dd(e, xa.get());
  }
  opts;
  root;
  attachment;
  constructor(e, n) {
    this.opts = e, this.root = n, this.attachment = fr(this.opts.ref);
  }
  #e = I(() => ({
    id: this.opts.id.current,
    "data-disabled": en(this.root.opts.disabled.current),
    "data-readonly": en(this.root.opts.readonly.current),
    [this.root.getBitsAttr("head-cell")]: "",
    ...this.attachment
  }));
  get props() {
    return a(this.#e);
  }
  set props(e) {
    p(this.#e, e);
  }
}
class cd {
  static create(e) {
    return new cd(e, xa.get());
  }
  opts;
  root;
  attachment;
  constructor(e, n) {
    this.opts = e, this.root = n, this.attachment = fr(this.opts.ref);
  }
  #e = I(() => ({
    id: this.opts.id.current,
    "data-disabled": en(this.root.opts.disabled.current),
    "data-readonly": en(this.root.opts.readonly.current),
    [this.root.getBitsAttr("header")]: "",
    ...this.attachment
  }));
  get props() {
    return a(this.#e);
  }
  set props(e) {
    p(this.#e, e);
  }
}
var mp = j("<div><!></div>");
function Ku(t, e) {
  const n = Yr();
  Ot(e, !0);
  let r = _(e, "children", 7), o = _(e, "child", 7), s = _(e, "ref", 15, null), l = _(e, "id", 23, () => Kt(n)), c = Ir(e, [
    "$$slots",
    "$$events",
    "$$legacy",
    "$$host",
    "children",
    "child",
    "ref",
    "id"
  ]);
  const u = nd.create({
    id: Ee(() => l()),
    ref: Ee(() => s(), (w) => s(w))
  }), b = I(() => xr(c, u.props));
  var g = {
    get children() {
      return r();
    },
    set children(w) {
      r(w), S();
    },
    get child() {
      return o();
    },
    set child(w) {
      o(w), S();
    },
    get ref() {
      return s();
    },
    set ref(w = null) {
      s(w), S();
    },
    get id() {
      return l();
    },
    set id(w = Kt(n)) {
      l(w), S();
    }
  }, y = Ae(), x = Z(y);
  {
    var f = (w) => {
      var m = Ae(), i = Z(m);
      {
        let O = I(() => ({ props: a(b), ...u.snippetProps }));
        Mt(i, o, () => a(O));
      }
      E(w, m);
    }, R = (w) => {
      var m = mp();
      Kr(m, () => ({ ...a(b) }));
      var i = T(m);
      {
        var O = ($) => {
          var X = Ae(), me = Z(X);
          Mt(me, () => r() ?? Sr, () => u.snippetProps), E($, X);
        }, W = ($) => {
          var X = ss();
          ge(() => J(X, u.cell.opts.date.current.day)), E($, X);
        };
        be(i, ($) => {
          r() ? $(O) : $(W, -1);
        });
      }
      A(m), E(w, m);
    };
    be(x, (w) => {
      o() ? w(f) : w(R, -1);
    });
  }
  return E(t, y), Lt(g);
}
Ft(Ku, { children: {}, child: {}, ref: {}, id: {} }, [], [], { mode: "open" });
var bp = j("<table><!></table>");
function Yu(t, e) {
  const n = Yr();
  Ot(e, !0);
  let r = _(e, "children", 7), o = _(e, "child", 7), s = _(e, "ref", 15, null), l = _(e, "id", 23, () => Kt(n)), c = Ir(e, [
    "$$slots",
    "$$events",
    "$$legacy",
    "$$host",
    "children",
    "child",
    "ref",
    "id"
  ]);
  const u = sd.create({
    id: Ee(() => l()),
    ref: Ee(() => s(), (w) => s(w))
  }), b = I(() => xr(c, u.props));
  var g = {
    get children() {
      return r();
    },
    set children(w) {
      r(w), S();
    },
    get child() {
      return o();
    },
    set child(w) {
      o(w), S();
    },
    get ref() {
      return s();
    },
    set ref(w = null) {
      s(w), S();
    },
    get id() {
      return l();
    },
    set id(w = Kt(n)) {
      l(w), S();
    }
  }, y = Ae(), x = Z(y);
  {
    var f = (w) => {
      var m = Ae(), i = Z(m);
      Mt(i, o, () => ({ props: a(b) })), E(w, m);
    }, R = (w) => {
      var m = bp();
      Kr(m, () => ({ ...a(b) }));
      var i = T(m);
      Mt(i, () => r() ?? Sr), A(m), E(w, m);
    };
    be(x, (w) => {
      o() ? w(f) : w(R, -1);
    });
  }
  return E(t, y), Lt(g);
}
Ft(Yu, { children: {}, child: {}, ref: {}, id: {} }, [], [], { mode: "open" });
var Cp = j("<tbody><!></tbody>");
function zu(t, e) {
  const n = Yr();
  Ot(e, !0);
  let r = _(e, "children", 7), o = _(e, "child", 7), s = _(e, "ref", 15, null), l = _(e, "id", 23, () => Kt(n)), c = Ir(e, [
    "$$slots",
    "$$events",
    "$$legacy",
    "$$host",
    "children",
    "child",
    "ref",
    "id"
  ]);
  const u = od.create({
    id: Ee(() => l()),
    ref: Ee(() => s(), (w) => s(w))
  }), b = I(() => xr(c, u.props));
  var g = {
    get children() {
      return r();
    },
    set children(w) {
      r(w), S();
    },
    get child() {
      return o();
    },
    set child(w) {
      o(w), S();
    },
    get ref() {
      return s();
    },
    set ref(w = null) {
      s(w), S();
    },
    get id() {
      return l();
    },
    set id(w = Kt(n)) {
      l(w), S();
    }
  }, y = Ae(), x = Z(y);
  {
    var f = (w) => {
      var m = Ae(), i = Z(m);
      Mt(i, o, () => ({ props: a(b) })), E(w, m);
    }, R = (w) => {
      var m = Cp();
      Kr(m, () => ({ ...a(b) }));
      var i = T(m);
      Mt(i, () => r() ?? Sr), A(m), E(w, m);
    };
    be(x, (w) => {
      o() ? w(f) : w(R, -1);
    });
  }
  return E(t, y), Lt(g);
}
Ft(zu, { children: {}, child: {}, ref: {}, id: {} }, [], [], { mode: "open" });
var wp = j("<td><!></td>");
function Qu(t, e) {
  const n = Yr();
  Ot(e, !0);
  let r = _(e, "children", 7), o = _(e, "child", 7), s = _(e, "ref", 15, null), l = _(e, "id", 23, () => Kt(n)), c = _(e, "date", 7), u = _(e, "month", 7), b = Ir(e, [
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
  const g = td.create({
    id: Ee(() => l()),
    ref: Ee(() => s(), (i) => s(i)),
    date: Ee(() => c()),
    month: Ee(() => u())
  }), y = I(() => xr(b, g.props));
  var x = {
    get children() {
      return r();
    },
    set children(i) {
      r(i), S();
    },
    get child() {
      return o();
    },
    set child(i) {
      o(i), S();
    },
    get ref() {
      return s();
    },
    set ref(i = null) {
      s(i), S();
    },
    get id() {
      return l();
    },
    set id(i = Kt(n)) {
      l(i), S();
    },
    get date() {
      return c();
    },
    set date(i) {
      c(i), S();
    },
    get month() {
      return u();
    },
    set month(i) {
      u(i), S();
    }
  }, f = Ae(), R = Z(f);
  {
    var w = (i) => {
      var O = Ae(), W = Z(O);
      {
        let $ = I(() => ({ props: a(y), ...g.snippetProps }));
        Mt(W, o, () => a($));
      }
      E(i, O);
    }, m = (i) => {
      var O = wp();
      Kr(O, () => ({ ...a(y) }));
      var W = T(O);
      Mt(W, () => r() ?? Sr, () => g.snippetProps), A(O), E(i, O);
    };
    be(R, (i) => {
      o() ? i(w) : i(m, -1);
    });
  }
  return E(t, f), Lt(x);
}
Ft(
  Qu,
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
var Pp = j("<thead><!></thead>");
function Wu(t, e) {
  const n = Yr();
  Ot(e, !0);
  let r = _(e, "children", 7), o = _(e, "child", 7), s = _(e, "ref", 15, null), l = _(e, "id", 23, () => Kt(n)), c = Ir(e, [
    "$$slots",
    "$$events",
    "$$legacy",
    "$$host",
    "children",
    "child",
    "ref",
    "id"
  ]);
  const u = id.create({
    id: Ee(() => l()),
    ref: Ee(() => s(), (w) => s(w))
  }), b = I(() => xr(c, u.props));
  var g = {
    get children() {
      return r();
    },
    set children(w) {
      r(w), S();
    },
    get child() {
      return o();
    },
    set child(w) {
      o(w), S();
    },
    get ref() {
      return s();
    },
    set ref(w = null) {
      s(w), S();
    },
    get id() {
      return l();
    },
    set id(w = Kt(n)) {
      l(w), S();
    }
  }, y = Ae(), x = Z(y);
  {
    var f = (w) => {
      var m = Ae(), i = Z(m);
      Mt(i, o, () => ({ props: a(b) })), E(w, m);
    }, R = (w) => {
      var m = Pp();
      Kr(m, () => ({ ...a(b) }));
      var i = T(m);
      Mt(i, () => r() ?? Sr), A(m), E(w, m);
    };
    be(x, (w) => {
      o() ? w(f) : w(R, -1);
    });
  }
  return E(t, y), Lt(g);
}
Ft(Wu, { children: {}, child: {}, ref: {}, id: {} }, [], [], { mode: "open" });
var xp = j("<th><!></th>");
function Ju(t, e) {
  const n = Yr();
  Ot(e, !0);
  let r = _(e, "children", 7), o = _(e, "child", 7), s = _(e, "ref", 15, null), l = _(e, "id", 23, () => Kt(n)), c = Ir(e, [
    "$$slots",
    "$$events",
    "$$legacy",
    "$$host",
    "children",
    "child",
    "ref",
    "id"
  ]);
  const u = dd.create({
    id: Ee(() => l()),
    ref: Ee(() => s(), (w) => s(w))
  }), b = I(() => xr(c, u.props));
  var g = {
    get children() {
      return r();
    },
    set children(w) {
      r(w), S();
    },
    get child() {
      return o();
    },
    set child(w) {
      o(w), S();
    },
    get ref() {
      return s();
    },
    set ref(w = null) {
      s(w), S();
    },
    get id() {
      return l();
    },
    set id(w = Kt(n)) {
      l(w), S();
    }
  }, y = Ae(), x = Z(y);
  {
    var f = (w) => {
      var m = Ae(), i = Z(m);
      Mt(i, o, () => ({ props: a(b) })), E(w, m);
    }, R = (w) => {
      var m = xp();
      Kr(m, () => ({ ...a(b) }));
      var i = T(m);
      Mt(i, () => r() ?? Sr), A(m), E(w, m);
    };
    be(x, (w) => {
      o() ? w(f) : w(R, -1);
    });
  }
  return E(t, y), Lt(g);
}
Ft(Ju, { children: {}, child: {}, ref: {}, id: {} }, [], [], { mode: "open" });
var Ip = j("<tr><!></tr>");
function Cl(t, e) {
  const n = Yr();
  Ot(e, !0);
  let r = _(e, "children", 7), o = _(e, "child", 7), s = _(e, "ref", 15, null), l = _(e, "id", 23, () => Kt(n)), c = Ir(e, [
    "$$slots",
    "$$events",
    "$$legacy",
    "$$host",
    "children",
    "child",
    "ref",
    "id"
  ]);
  const u = ld.create({
    id: Ee(() => l()),
    ref: Ee(() => s(), (w) => s(w))
  }), b = I(() => xr(c, u.props));
  var g = {
    get children() {
      return r();
    },
    set children(w) {
      r(w), S();
    },
    get child() {
      return o();
    },
    set child(w) {
      o(w), S();
    },
    get ref() {
      return s();
    },
    set ref(w = null) {
      s(w), S();
    },
    get id() {
      return l();
    },
    set id(w = Kt(n)) {
      l(w), S();
    }
  }, y = Ae(), x = Z(y);
  {
    var f = (w) => {
      var m = Ae(), i = Z(m);
      Mt(i, o, () => ({ props: a(b) })), E(w, m);
    }, R = (w) => {
      var m = Ip();
      Kr(m, () => ({ ...a(b) }));
      var i = T(m);
      Mt(i, () => r() ?? Sr), A(m), E(w, m);
    };
    be(x, (w) => {
      o() ? w(f) : w(R, -1);
    });
  }
  return E(t, y), Lt(g);
}
Ft(Cl, { children: {}, child: {}, ref: {}, id: {} }, [], [], { mode: "open" });
var Sp = j("<header><!></header>");
function Gu(t, e) {
  const n = Yr();
  Ot(e, !0);
  let r = _(e, "children", 7), o = _(e, "child", 7), s = _(e, "ref", 15, null), l = _(e, "id", 23, () => Kt(n)), c = Ir(e, [
    "$$slots",
    "$$events",
    "$$legacy",
    "$$host",
    "children",
    "child",
    "ref",
    "id"
  ]);
  const u = cd.create({
    id: Ee(() => l()),
    ref: Ee(() => s(), (w) => s(w))
  }), b = I(() => xr(c, u.props));
  var g = {
    get children() {
      return r();
    },
    set children(w) {
      r(w), S();
    },
    get child() {
      return o();
    },
    set child(w) {
      o(w), S();
    },
    get ref() {
      return s();
    },
    set ref(w = null) {
      s(w), S();
    },
    get id() {
      return l();
    },
    set id(w = Kt(n)) {
      l(w), S();
    }
  }, y = Ae(), x = Z(y);
  {
    var f = (w) => {
      var m = Ae(), i = Z(m);
      Mt(i, o, () => ({ props: a(b) })), E(w, m);
    }, R = (w) => {
      var m = Sp();
      Kr(m, () => ({ ...a(b) }));
      var i = T(m);
      Mt(i, () => r() ?? Sr), A(m), E(w, m);
    };
    be(x, (w) => {
      o() ? w(f) : w(R, -1);
    });
  }
  return E(t, y), Lt(g);
}
Ft(Gu, { children: {}, child: {}, ref: {}, id: {} }, [], [], { mode: "open" });
var Rp = j("<div><!></div>");
function Zu(t, e) {
  const n = Yr();
  Ot(e, !0);
  let r = _(e, "children", 7), o = _(e, "child", 7), s = _(e, "ref", 15, null), l = _(e, "id", 23, () => Kt(n)), c = Ir(e, [
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
    id: Ee(() => l()),
    ref: Ee(() => s(), (w) => s(w))
  }), b = I(() => xr(c, u.props));
  var g = {
    get children() {
      return r();
    },
    set children(w) {
      r(w), S();
    },
    get child() {
      return o();
    },
    set child(w) {
      o(w), S();
    },
    get ref() {
      return s();
    },
    set ref(w = null) {
      s(w), S();
    },
    get id() {
      return l();
    },
    set id(w = Kt(n)) {
      l(w), S();
    }
  }, y = Ae(), x = Z(y);
  {
    var f = (w) => {
      var m = Ae(), i = Z(m);
      Mt(i, o, () => ({
        props: a(b),
        headingValue: u.root.headingValue
      })), E(w, m);
    }, R = (w) => {
      var m = Rp();
      Kr(m, () => ({ ...a(b) }));
      var i = T(m);
      {
        var O = ($) => {
          var X = Ae(), me = Z(X);
          Mt(me, () => r() ?? Sr, () => ({ headingValue: u.root.headingValue })), E($, X);
        }, W = ($) => {
          var X = ss();
          ge(() => J(X, u.root.headingValue)), E($, X);
        };
        be(i, ($) => {
          r() ? $(O) : $(W, -1);
        });
      }
      A(m), E(w, m);
    };
    be(x, (w) => {
      o() ? w(f) : w(R, -1);
    });
  }
  return E(t, y), Lt(g);
}
Ft(Zu, { children: {}, child: {}, ref: {}, id: {} }, [], [], { mode: "open" });
var _p = j("<button><!></button>");
function Xu(t, e) {
  const n = Yr();
  Ot(e, !0);
  let r = _(e, "children", 7), o = _(e, "child", 7), s = _(e, "id", 23, () => Kt(n)), l = _(e, "ref", 15, null), c = _(e, "tabindex", 7, 0), u = Ir(e, [
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
  const b = rd.create({
    id: Ee(() => s()),
    ref: Ee(() => l(), (m) => l(m))
  }), g = I(() => xr(u, b.props, { tabindex: c() }));
  var y = {
    get children() {
      return r();
    },
    set children(m) {
      r(m), S();
    },
    get child() {
      return o();
    },
    set child(m) {
      o(m), S();
    },
    get id() {
      return s();
    },
    set id(m = Kt(n)) {
      s(m), S();
    },
    get ref() {
      return l();
    },
    set ref(m = null) {
      l(m), S();
    },
    get tabindex() {
      return c();
    },
    set tabindex(m = 0) {
      c(m), S();
    }
  }, x = Ae(), f = Z(x);
  {
    var R = (m) => {
      var i = Ae(), O = Z(i);
      Mt(O, o, () => ({ props: a(g) })), E(m, i);
    }, w = (m) => {
      var i = _p();
      Kr(i, () => ({ ...a(g) }));
      var O = T(i);
      Mt(O, () => r() ?? Sr), A(i), E(m, i);
    };
    be(f, (m) => {
      o() ? m(R) : m(w, -1);
    });
  }
  return E(t, x), Lt(y);
}
Ft(Xu, { children: {}, child: {}, id: {}, ref: {}, tabindex: {} }, [], [], { mode: "open" });
var Ep = j("<button><!></button>");
function eh(t, e) {
  const n = Yr();
  Ot(e, !0);
  let r = _(e, "children", 7), o = _(e, "child", 7), s = _(e, "id", 23, () => Kt(n)), l = _(e, "ref", 15, null), c = _(e, "tabindex", 7, 0), u = Ir(e, [
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
  const b = ad.create({
    id: Ee(() => s()),
    ref: Ee(() => l(), (m) => l(m))
  }), g = I(() => xr(u, b.props, { tabindex: c() }));
  var y = {
    get children() {
      return r();
    },
    set children(m) {
      r(m), S();
    },
    get child() {
      return o();
    },
    set child(m) {
      o(m), S();
    },
    get id() {
      return s();
    },
    set id(m = Kt(n)) {
      s(m), S();
    },
    get ref() {
      return l();
    },
    set ref(m = null) {
      l(m), S();
    },
    get tabindex() {
      return c();
    },
    set tabindex(m = 0) {
      c(m), S();
    }
  }, x = Ae(), f = Z(x);
  {
    var R = (m) => {
      var i = Ae(), O = Z(i);
      Mt(O, o, () => ({ props: a(g) })), E(m, i);
    }, w = (m) => {
      var i = Ep();
      Kr(i, () => ({ ...a(g) }));
      var O = T(i);
      Mt(O, () => r() ?? Sr), A(i), E(m, i);
    };
    be(f, (m) => {
      o() ? m(R) : m(w, -1);
    });
  }
  return E(t, x), Lt(y);
}
Ft(eh, { children: {}, child: {}, id: {}, ref: {}, tabindex: {} }, [], [], { mode: "open" });
const ud = Wc({
  component: "date-field",
  parts: ["input", "label", "segment"]
}), so = {
  day: {
    min: 1,
    max: (t) => {
      const e = t.segmentValues.month, n = t.value.current ?? t.placeholder.current;
      return Oo(e ? n.set({ month: Number.parseInt(e) }) : n);
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
    max: (t) => t.hourCycle.current === 24 ? 23 : t.hourCycle.current === 12 || Bu(t.locale.current) === 12 ? 12 : 23,
    cycle: 1,
    canBeZero: !0,
    padZero: !0
  },
  minute: { min: 0, max: 59, cycle: 1, canBeZero: !0, padZero: !0 },
  second: { min: 0, max: 59, cycle: 1, canBeZero: !0, padZero: !0 }
}, Vs = new mi("DateField.Root");
class hd {
  static create(e, n) {
    return Vs.set(new hd(e, n));
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
  descriptionId = Jc();
  formatter;
  initialSegments;
  #e = ye();
  get segmentValues() {
    return a(this.#e);
  }
  set segmentValues(e) {
    p(this.#e, e, !0);
  }
  announcer;
  #t = I(() => new Set(this.readonlySegments.current));
  get readonlySegmentsSet() {
    return a(this.#t);
  }
  set readonlySegmentsSet(e) {
    p(this.#t, e);
  }
  segmentStates = ec();
  #n = ye(null);
  #r = ye(null);
  #a = ye(null);
  get descriptionNode() {
    return a(this.#a);
  }
  set descriptionNode(e) {
    p(this.#a, e, !0);
  }
  #s = ye(null);
  get validationNode() {
    return a(this.#s);
  }
  set validationNode(e) {
    p(this.#s, e, !0);
  }
  states = ec();
  #i = ye(null);
  get dayPeriodNode() {
    return a(this.#i);
  }
  set dayPeriodNode(e) {
    p(this.#i, e, !0);
  }
  rangeRoot = void 0;
  #l = ye("");
  get name() {
    return a(this.#l);
  }
  set name(e) {
    p(this.#l, e, !0);
  }
  domContext = new _l(() => null);
  constructor(e, n) {
    this.rangeRoot = n, this.value = e.value, this.placeholder = n ? n.opts.placeholder : e.placeholder, this.validate = n ? Th(void 0) : e.validate, this.minValue = n ? n.opts.minValue : e.minValue, this.maxValue = n ? n.opts.maxValue : e.maxValue, this.disabled = n ? n.opts.disabled : e.disabled, this.readonly = n ? n.opts.readonly : e.readonly, this.granularity = n ? n.opts.granularity : e.granularity, this.readonlySegments = n ? n.opts.readonlySegments : e.readonlySegments, this.hourCycle = n ? n.opts.hourCycle : e.hourCycle, this.locale = n ? n.opts.locale : e.locale, this.hideTimeZone = n ? n.opts.hideTimeZone : e.hideTimeZone, this.required = n ? n.opts.required : e.required, this.onInvalid = n ? n.opts.onInvalid : e.onInvalid, this.errorMessageId = n ? n.opts.errorMessageId : e.errorMessageId, this.isInvalidProp = e.isInvalidProp, this.formatter = Vu({
      initialLocale: this.locale.current,
      monthFormat: Ee(() => "long"),
      yearFormat: Ee(() => "numeric")
    }), this.initialSegments = zi(this.inferredGranularity), this.segmentValues = this.initialSegments, this.announcer = ii(null), this.getFieldNode = this.getFieldNode.bind(this), this.updateSegment = this.updateSegment.bind(this), this.handleSegmentClick = this.handleSegmentClick.bind(this), this.getBaseSegmentAttrs = this.getBaseSegmentAttrs.bind(this), Ke(() => {
      ca(() => {
        this.initialSegments = zi(this.inferredGranularity);
      });
    }), Gc(() => {
      this.announcer = ii(this.domContext.getDocument());
    }), Mh(() => {
      n || Wv(this.descriptionId, this.domContext.getDocument());
    }), Ke(() => {
      n || this.formatter.getLocale() !== this.locale.current && this.formatter.setLocale(this.locale.current);
    }), Ke(() => {
      if (n) return;
      if (this.value.current) {
        const o = ca(() => this.descriptionId);
        Qv({
          id: o,
          formatter: this.formatter,
          value: this.value.current,
          doc: this.domContext.getDocument()
        });
      }
      const r = ca(() => this.placeholder.current);
      this.value.current && r !== this.value.current && ca(() => {
        this.value.current && (this.placeholder.current = this.value.current);
      });
    }), this.value.current && this.syncSegmentValues(this.value.current), Ke(() => {
      this.locale.current, this.value.current && this.syncSegmentValues(this.value.current), this.#o();
    }), Ke(() => {
      this.value.current === void 0 && (this.segmentValues = zi(this.inferredGranularity));
    }), eo(() => this.validationStatus, () => {
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
    p(this.#n, e, !0);
  }
  /**
   * Gets the correct field node for the date field regardless of whether it's being
   * used in a standalone context or within a `DateRangeField` component.
   */
  getFieldNode() {
    return this.rangeRoot ? this.rangeRoot.fieldNode : a(this.#n);
  }
  /**
   * Sets the label node for the `DateFieldRootState` instance. We use this method so we can
   * keep `#labelNode` private to prevent accidental usage of the incorrect label node.
   */
  setLabelNode(e) {
    p(this.#r, e, !0);
  }
  /**
   * Gets the correct label node for the date field regardless of whether it's being used in
   * a standalone context or within a `DateRangeField` component.
   */
  getLabelNode() {
    return this.rangeRoot ? this.rangeRoot.labelNode : a(this.#r);
  }
  #o() {
    this.states.day.updating = null, this.states.month.updating = null, this.states.year.updating = null, this.states.hour.updating = null, this.states.minute.updating = null, this.states.dayPeriod.updating = null;
  }
  setValue(e) {
    this.value.current = e;
  }
  syncSegmentValues(e) {
    const n = Si.map((r) => {
      const o = e[r];
      if (r === "month") {
        if (this.states.month.updating)
          return [r, this.states.month.updating];
        if (o < 10)
          return [r, `0${o}`];
      }
      if (r === "day") {
        if (this.states.day.updating)
          return [r, this.states.day.updating];
        if (o < 10)
          return [r, `0${o}`];
      }
      if (r === "year") {
        if (this.states.year.updating)
          return [r, this.states.year.updating];
        const l = 4 - `${o}`.length;
        if (l > 0)
          return [r, `${"0".repeat(l)}${o}`];
      }
      return [r, `${o}`];
    });
    if ("hour" in e) {
      const r = Wl.map((s) => {
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
      }), o = [...n, ...r];
      this.segmentValues = Object.fromEntries(o), this.#o();
      return;
    }
    this.segmentValues = Object.fromEntries(n);
  }
  #d = I(() => {
    const e = this.value.current;
    if (!e) return !1;
    const n = this.validate.current?.(e);
    if (n)
      return { reason: "custom", message: n };
    const r = this.minValue.current;
    if (r && Bs(e, r))
      return { reason: "min" };
    const o = this.maxValue.current;
    return o && Bs(o, e) ? { reason: "max" } : !1;
  });
  get validationStatus() {
    return a(this.#d);
  }
  set validationStatus(e) {
    p(this.#d, e);
  }
  #c = I(() => this.validationStatus === !1 ? !1 : (this.isInvalidProp.current, !0));
  get isInvalid() {
    return a(this.#c);
  }
  set isInvalid(e) {
    p(this.#c, e);
  }
  #u = I(() => {
    const e = this.granularity.current;
    return e || Yv(this.placeholder.current, this.granularity.current);
  });
  get inferredGranularity() {
    return a(this.#u);
  }
  set inferredGranularity(e) {
    p(this.#u, e);
  }
  #h = I(() => this.value.current !== void 0 ? this.value.current : this.placeholder.current);
  get dateRef() {
    return a(this.#h);
  }
  set dateRef(e) {
    p(this.#h, e);
  }
  #f = I(() => Bv({
    segmentValues: this.segmentValues,
    formatter: this.formatter,
    locale: this.locale.current,
    granularity: this.inferredGranularity,
    dateRef: this.dateRef,
    hideTimeZone: this.hideTimeZone.current,
    hourCycle: this.hourCycle.current
  }));
  get allSegmentContent() {
    return a(this.#f);
  }
  set allSegmentContent(e) {
    p(this.#f, e);
  }
  #v = I(() => this.allSegmentContent.arr);
  get segmentContents() {
    return a(this.#v);
  }
  set segmentContents(e) {
    p(this.#v, e);
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
  #p(e) {
    return `${e} ${this.getLabelNode()?.id ?? ""}`;
  }
  updateSegment(e, n) {
    const r = this.disabled.current, o = this.readonly.current, s = this.readonlySegmentsSet;
    if (r || o || s.has(e)) return;
    const l = this.segmentValues;
    let c = l;
    const u = this.placeholder.current;
    if (Kv(l)) {
      const b = l[e], g = n;
      if (e === "month") {
        const y = g(b);
        if (this.states.month.updating = y, y !== null && l.day !== null) {
          const x = u.set({ month: Number.parseInt(y) }), f = Oo(jr(x));
          Number.parseInt(l.day) > f && (l.day = `${f}`);
        }
        c = { ...l, [e]: y };
      } else if (e === "dayPeriod") {
        const y = g(b);
        this.states.dayPeriod.updating = y;
        const x = this.value.current;
        if (x && "hour" in x) {
          const f = x.hour;
          y === "AM" ? f >= 12 && (l.hour = `${f - 12}`) : y === "PM" && f < 12 && (l.hour = `${f + 12}`);
        }
        c = { ...l, [e]: y };
      } else if (e === "hour") {
        const y = g(b);
        if (this.states.hour.updating = y, y !== null && l.dayPeriod !== null) {
          const x = this.formatter.dayPeriod(jr(u.set({ hour: Number.parseInt(y) })), this.hourCycle.current);
          (x === "AM" || x === "PM") && (l.dayPeriod = x);
        }
        c = { ...l, [e]: y };
      } else if (e === "minute") {
        const y = g(b);
        this.states.minute.updating = y, c = { ...l, [e]: y };
      } else if (e === "second") {
        const y = g(b);
        this.states.second.updating = y, c = { ...l, [e]: y };
      } else if (e === "year") {
        const y = g(b);
        this.states.year.updating = y, c = { ...l, [e]: y };
      } else if (e === "day") {
        const y = g(b);
        this.states.day.updating = y, c = { ...l, [e]: y };
      } else {
        const y = g(b);
        c = { ...l, [e]: y };
      }
    } else if (Ri(e)) {
      const b = l[e], g = n, y = g(b);
      if (e === "month" && y !== null && l.day !== null) {
        this.states.month.updating = y;
        const x = u.set({ month: Number.parseInt(y) }), f = Oo(jr(x));
        Number.parseInt(l.day) > f && (l.day = `${f}`), c = { ...l, [e]: y };
      } else if (e === "year") {
        const x = g(b);
        this.states.year.updating = x, c = { ...l, [e]: x };
      } else if (e === "day") {
        const x = g(b);
        this.states.day.updating = x, c = { ...l, [e]: x };
      } else
        c = { ...l, [e]: y };
    }
    this.segmentValues = c, jv(c, a(this.#n)) ? this.setValue(Vv({
      segmentObj: c,
      fieldNode: a(this.#n),
      dateRef: this.placeholder.current
    })) : (this.setValue(void 0), this.segmentValues = c);
  }
  handleSegmentClick(e) {
    this.disabled.current && e.preventDefault();
  }
  getBaseSegmentAttrs(e, n) {
    const r = this.readonlySegmentsSet.has(e), o = {
      "aria-invalid": El(this.isInvalid),
      "aria-disabled": La(this.disabled.current),
      "aria-readonly": La(this.readonly.current || r),
      "data-invalid": en(this.isInvalid),
      "data-disabled": en(this.disabled.current),
      "data-readonly": en(this.readonly.current || r),
      "data-segment": `${e}`,
      [ud.segment]: ""
    };
    if (e === "literal") return o;
    const s = this.descriptionNode?.id, l = zv(n, a(this.#n)) && s, c = this.errorMessageId?.current, u = l ? `${s} ${this.isInvalid && c ? c : ""}` : void 0, b = !(this.readonly.current || r || this.disabled.current);
    return {
      ...o,
      "aria-labelledby": this.#p(n),
      contenteditable: b ? "true" : void 0,
      "aria-describedby": u,
      tabindex: this.disabled.current ? void 0 : 0
    };
  }
}
class fd {
  static create(e) {
    return new fd(e, Vs.get());
  }
  opts;
  root;
  domContext;
  attachment;
  constructor(e, n) {
    this.opts = e, this.root = n, this.domContext = new _l(e.ref), this.root.domContext = this.domContext, this.attachment = fr(e.ref, (r) => this.root.setFieldNode(r)), eo(() => this.opts.name.current, (r) => {
      this.root.setName(r);
    });
  }
  #e = I(() => {
    if (!(!xs || !this.domContext.getElementById(this.root.descriptionId)))
      return this.root.descriptionId;
  });
  #t = I(() => ({
    id: this.opts.id.current,
    role: "group",
    "aria-labelledby": this.root.getLabelNode()?.id ?? void 0,
    "aria-describedby": a(this.#e),
    "aria-disabled": La(this.root.disabled.current),
    "data-invalid": this.root.isInvalid ? "" : void 0,
    "data-disabled": en(this.root.disabled.current),
    [ud.input]: "",
    ...this.attachment
  }));
  get props() {
    return a(this.#t);
  }
  set props(e) {
    p(this.#t, e);
  }
}
class vd {
  static create() {
    return new vd(Vs.get());
  }
  root;
  #e = I(() => this.root.name !== "");
  get shouldRender() {
    return a(this.#e);
  }
  set shouldRender(e) {
    p(this.#e, e);
  }
  #t = I(() => this.root.value.current ? this.root.value.current.toString() : "");
  get isoValue() {
    return a(this.#t);
  }
  set isoValue(e) {
    p(this.#t, e);
  }
  constructor(e) {
    this.root = e;
  }
  #n = I(() => ({
    name: this.root.name,
    value: this.isoValue,
    required: this.root.required.current
  }));
  get props() {
    return a(this.#n);
  }
  set props(e) {
    p(this.#n, e);
  }
}
class oo {
  opts;
  root;
  announcer;
  part;
  config;
  attachment;
  constructor(e, n, r, o) {
    this.opts = e, this.root = n, this.part = r, this.config = o, this.announcer = n.announcer, this.onkeydown = this.onkeydown.bind(this), this.onfocusout = this.onfocusout.bind(this), this.attachment = fr(e.ref);
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
    const r = String(e);
    return n && this.config.padZero && r.length === 1 ? `0${e}` : r;
  }
  onkeydown(e) {
    const n = this.root.value.current ?? this.root.placeholder.current;
    if (!(e.ctrlKey || e.metaKey || this.root.disabled.current) && !((this.part === "hour" || this.part === "minute" || this.part === "second") && !(this.part in n)) && (e.key !== bi && e.preventDefault(), !!Jl(e.key))) {
      if (md(e.key)) {
        this.#a(n);
        return;
      }
      if (bd(e.key)) {
        this.#s(n);
        return;
      }
      if (yi(e.key)) {
        this.#i(e);
        return;
      }
      if (Cd(e.key)) {
        this.#l(e);
        return;
      }
      No(e.key) && $o(e, this.root.getFieldNode());
    }
  }
  #a(e) {
    const n = this.part;
    n in this.root.states && (this.root.states[n].hasLeftFocus = !1), this.root.updateSegment(this.part, (r) => {
      if (r === null) {
        const l = e[this.part];
        return this.announcer.announce(this.#n(l)), this.#r(l);
      }
      const s = e.set({ [this.part]: Number.parseInt(r) }).cycle(this.part, this.config.cycle)[this.part];
      return this.announcer.announce(this.#n(s)), this.#r(s);
    });
  }
  #s(e) {
    const n = this.part;
    n in this.root.states && (this.root.states[n].hasLeftFocus = !1), this.root.updateSegment(this.part, (r) => {
      if (r === null) {
        const l = e[this.part];
        return this.announcer.announce(this.#n(l)), this.#r(l);
      }
      const s = e.set({ [this.part]: Number.parseInt(r) }).cycle(this.part, -this.config.cycle)[this.part];
      return this.announcer.announce(this.#n(s)), this.#r(s);
    });
  }
  #i(e) {
    const n = Number.parseInt(e.key);
    let r = !1;
    const o = this.#e(), s = Math.floor(o / 10), l = n === 0, c = this.part;
    this.root.updateSegment(this.part, (u) => {
      if (c in this.root.states && this.root.states[c].hasLeftFocus && (u = null, this.root.states[c].hasLeftFocus = !1), u === null)
        return l ? (c in this.root.states && (this.root.states[c].lastKeyZero = !0), this.announcer.announce("0"), "0") : (c in this.root.states && (this.root.states[c].lastKeyZero || n > s) && (r = !0), c in this.root.states && (this.root.states[c].lastKeyZero = !1), r && String(n).length === 1 ? (this.announcer.announce(n), `0${n}`) : `${n}`);
      if (c in this.root.states && this.root.states[c].lastKeyZero)
        return n !== 0 ? (r = !0, this.root.states[c].lastKeyZero = !1, `0${n}`) : this.part === "hour" && n === 0 && this.root.hourCycle.current === 24 ? (r = !0, this.root.states[c].lastKeyZero = !1, "00") : (this.part === "minute" || this.part === "second") && n === 0 ? (r = !0, this.root.states[c].lastKeyZero = !1, "00") : u;
      const b = Number.parseInt(u + n.toString());
      return b > o ? (r = !0, `0${n}`) : (r = !0, `${b}`);
    }), r && Uu(e, this.root.getFieldNode());
  }
  #l(e) {
    const n = this.part;
    n in this.root.states && (this.root.states[n].hasLeftFocus = !1);
    let r = !1;
    this.root.updateSegment(this.part, (o) => {
      if (o === null)
        return r = !0, this.announcer.announce(null), null;
      if (o.length === 2 && o.startsWith("0"))
        return this.announcer.announce(null), null;
      const s = o.toString();
      if (s.length === 1)
        return this.announcer.announce(null), null;
      const l = Number.parseInt(s.slice(0, -1));
      return this.announcer.announce(this.#n(l)), `${l}`;
    }), r && qu(e, this.root.getFieldNode());
  }
  onfocusout(e) {
    const n = this.part;
    n in this.root.states && (this.root.states[n].hasLeftFocus = !0), this.config.padZero && this.root.updateSegment(this.part, (r) => r && r.length === 1 ? `0${r}` : r);
  }
  getSegmentProps() {
    const e = this.root.segmentValues, n = this.root.placeholder.current, r = e[this.part] === null;
    let o = n;
    e[this.part] && (o = n.set({ [this.part]: Number.parseInt(e[this.part]) }));
    const s = o[this.part], l = this.#t(), c = this.#e();
    let u = r ? "Empty" : `${s}`;
    return this.part === "hour" && "dayPeriod" in e && e.dayPeriod && (u = r ? "Empty" : `${s} ${e.dayPeriod}`), {
      "aria-label": `${this.part}, `,
      "aria-valuemin": l,
      "aria-valuemax": c,
      "aria-valuenow": s,
      "aria-valuetext": u
    };
  }
  #o = I(() => ({
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
    return a(this.#o);
  }
  set props(e) {
    p(this.#o, e);
  }
}
class Ap extends oo {
  #e = [];
  #t = 0;
  constructor(e, n) {
    super(e, n, "year", so.year);
  }
  onkeydown(e) {
    if (!(e.ctrlKey || e.metaKey || this.root.disabled.current) && (e.key !== bi && e.preventDefault(), !!Jl(e.key))) {
      if (md(e.key)) {
        this.#n(), super.onkeydown(e);
        return;
      }
      if (bd(e.key)) {
        this.#n(), super.onkeydown(e);
        return;
      }
      if (yi(e.key)) {
        this.#a(e);
        return;
      }
      if (Cd(e.key)) {
        this.#s(e);
        return;
      }
      No(e.key) && $o(e, this.root.getFieldNode());
    }
  }
  #n() {
    this.#t = 0;
  }
  #r() {
    this.#t++;
  }
  #a(e) {
    this.#e.push(e.key);
    let n = !1;
    const r = Number.parseInt(e.key);
    this.root.updateSegment("year", (o) => {
      if (this.root.states.year.hasLeftFocus && (o = null, this.root.states.year.hasLeftFocus = !1), o === null)
        return this.announcer.announce(r), `000${r}`;
      const s = o.toString() + r.toString(), l = Number.parseInt(s);
      if (String(l).length < 4)
        return this.#t > 0 && this.#e.length <= this.#t && s.length <= 4 ? (this.announcer.announce(l), s) : (this.announcer.announce(l), sc(l));
      this.announcer.announce(l), n = !0;
      const u = `${l}`;
      return u.length > 4 ? u.slice(0, 4) : u;
    }), (this.#e.length === 4 || this.#e.length === this.#t) && (n = !0), n && Uu(e, this.root.getFieldNode());
  }
  #s(e) {
    this.#e = [], this.#r();
    let n = !1;
    this.root.updateSegment("year", (r) => {
      if (this.root.states.year.hasLeftFocus = !1, r === null)
        return n = !0, this.announcer.announce(null), null;
      const o = r.toString();
      if (o.length === 1)
        return this.announcer.announce(null), null;
      const s = o.slice(0, -1);
      return this.announcer.announce(s), `${s}`;
    }), n && qu(e, this.root.getFieldNode());
  }
  onfocusout(e) {
    this.root.states.year.hasLeftFocus = !0, this.#e = [], this.#n(), this.root.updateSegment("year", (n) => n && n.length !== 4 ? sc(Number.parseInt(n)) : n);
  }
}
class kp extends oo {
  constructor(e, n) {
    super(e, n, "day", so.day);
  }
}
class Dp extends oo {
  constructor(e, n) {
    super(e, n, "month", so.month);
  }
}
class Tp extends oo {
  constructor(e, n) {
    super(e, n, "hour", so.hour);
  }
  // Override to handle special hour logic
  onkeydown(e) {
    if (yi(e.key)) {
      const n = this.root.updateSegment.bind(this.root);
      this.root.updateSegment = (r, o) => {
        const s = n(r, o);
        return r === "hour" && "hour" in this.root.segmentValues && this.root.segmentValues.hour === "0" && this.root.dayPeriodNode && this.root.hourCycle.current !== 24 && (this.root.segmentValues.hour = "12"), s;
      };
    }
    super.onkeydown(e), this.root.updateSegment = this.root.updateSegment.bind(this.root);
  }
}
class Mp extends oo {
  constructor(e, n) {
    super(e, n, "minute", so.minute);
  }
}
class Op extends oo {
  constructor(e, n) {
    super(e, n, "second", so.second);
  }
}
class pd {
  static create(e) {
    return new pd(e, Vs.get());
  }
  opts;
  root;
  attachment;
  #e;
  constructor(e, n) {
    this.opts = e, this.root = n, this.#e = this.root.announcer, this.onkeydown = this.onkeydown.bind(this), this.attachment = fr(e.ref, (r) => this.root.dayPeriodNode = r);
  }
  onkeydown(e) {
    if (!(e.ctrlKey || e.metaKey || this.root.disabled.current) && (e.key !== bi && e.preventDefault(), !!Fp(e.key))) {
      if (md(e.key) || bd(e.key)) {
        this.root.updateSegment("dayPeriod", (n) => {
          if (n === "AM")
            return this.#e.announce("PM"), "PM";
          const r = "AM";
          return this.#e.announce(r), r;
        });
        return;
      }
      Cd(e.key) && (this.root.states.dayPeriod.hasLeftFocus = !1, this.root.updateSegment("dayPeriod", () => (this.#e.announce("AM"), "AM"))), (e.key === ul || e.key === Zc || hl) && this.root.updateSegment("dayPeriod", () => {
        const n = e.key === ul || e.key === hl ? "AM" : "PM";
        return this.#e.announce(n), n;
      }), No(e.key) && $o(e, this.root.getFieldNode());
    }
  }
  #t = I(() => {
    const e = this.root.segmentValues;
    if (!("dayPeriod" in e)) return;
    const n = 0, r = 12, o = e.dayPeriod === "AM" ? 0 : 12, s = e.dayPeriod ?? "AM";
    return {
      ...this.root.sharedSegmentAttrs,
      id: this.opts.id.current,
      inputmode: "text",
      "aria-label": "AM/PM",
      "aria-valuemin": n,
      "aria-valuemax": r,
      "aria-valuenow": o,
      "aria-valuetext": s,
      onkeydown: this.onkeydown,
      onclick: this.root.handleSegmentClick,
      ...this.root.getBaseSegmentAttrs("dayPeriod", this.opts.id.current),
      ...this.attachment
    };
  });
  get props() {
    return a(this.#t);
  }
  set props(e) {
    p(this.#t, e);
  }
}
class gd {
  static create(e) {
    return new gd(e, Vs.get());
  }
  opts;
  root;
  attachment;
  constructor(e, n) {
    this.opts = e, this.root = n, this.attachment = fr(e.ref);
  }
  #e = I(() => ({
    id: this.opts.id.current,
    "aria-hidden": El(!0),
    ...this.root.getBaseSegmentAttrs("literal", this.opts.id.current),
    ...this.attachment
  }));
  get props() {
    return a(this.#e);
  }
  set props(e) {
    p(this.#e, e);
  }
}
class yd {
  static create(e) {
    return new yd(e, Vs.get());
  }
  opts;
  root;
  attachment;
  constructor(e, n) {
    this.opts = e, this.root = n, this.onkeydown = this.onkeydown.bind(this), this.attachment = fr(e.ref);
  }
  onkeydown(e) {
    e.key !== bi && e.preventDefault(), !this.root.disabled.current && No(e.key) && $o(e, this.root.getFieldNode());
  }
  #e = I(() => ({
    role: "textbox",
    id: this.opts.id.current,
    "aria-label": "timezone, ",
    style: { caretColor: "transparent" },
    onkeydown: this.onkeydown,
    ...this.root.getBaseSegmentAttrs("timeZoneName", this.opts.id.current),
    "data-readonly": en(!0),
    ...this.attachment
  }));
  get props() {
    return a(this.#e);
  }
  set props(e) {
    p(this.#e, e);
  }
}
class Lp {
  static create(e, n) {
    const r = Vs.get();
    switch (e) {
      case "day":
        return new kp(n, r);
      case "month":
        return new Dp(n, r);
      case "year":
        return new Ap(n, r);
      case "hour":
        return new Tp(n, r);
      case "minute":
        return new Mp(n, r);
      case "second":
        return new Op(n, r);
      case "dayPeriod":
        return new pd(n, r);
      case "literal":
        return new gd(n, r);
      case "timeZoneName":
        return new yd(n, r);
    }
  }
}
function Fp(t) {
  return Jl(t) || t === ul || t === Zc || t === hl || t === Oh;
}
function md(t) {
  return t === pi;
}
function bd(t) {
  return t === gi;
}
function Cd(t) {
  return t === Yc;
}
function sc(t) {
  const n = 4 - String(t).length;
  return `${"0".repeat(n)}${t}`;
}
function th(t, e) {
  Ot(e, !0);
  const n = vd.create();
  var r = Ae(), o = Z(r);
  {
    var s = (l) => {
      Lf(l, no(() => n.props));
    };
    be(o, (l) => {
      n.shouldRender && l(s);
    });
  }
  E(t, r), Lt();
}
Ft(th, {}, [], [], { mode: "open" });
var Hp = j("<div><!></div>"), $p = j("<!> <!>", 1);
function nh(t, e) {
  const n = Yr();
  Ot(e, !0);
  let r = _(e, "id", 23, () => Kt(n)), o = _(e, "ref", 15, null), s = _(e, "name", 7, ""), l = _(e, "children", 7), c = _(e, "child", 7), u = Ir(e, [
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
  const b = fd.create({
    id: Ee(() => r()),
    ref: Ee(() => o(), (i) => o(i)),
    name: Ee(() => s())
  }), g = I(() => xr(u, b.props));
  var y = {
    get id() {
      return r();
    },
    set id(i = Kt(n)) {
      r(i), S();
    },
    get ref() {
      return o();
    },
    set ref(i = null) {
      o(i), S();
    },
    get name() {
      return s();
    },
    set name(i = "") {
      s(i), S();
    },
    get children() {
      return l();
    },
    set children(i) {
      l(i), S();
    },
    get child() {
      return c();
    },
    set child(i) {
      c(i), S();
    }
  }, x = $p(), f = Z(x);
  {
    var R = (i) => {
      var O = Ae(), W = Z(O);
      Mt(W, c, () => ({
        props: a(g),
        segments: b.root.segmentContents
      })), E(i, O);
    }, w = (i) => {
      var O = Hp();
      Kr(O, () => ({ ...a(g) }));
      var W = T(O);
      Mt(W, () => l() ?? Sr, () => ({ segments: b.root.segmentContents })), A(O), E(i, O);
    };
    be(f, (i) => {
      c() ? i(R) : i(w, -1);
    });
  }
  var m = L(f, 2);
  return th(m, {}), E(t, x), Lt(y);
}
Ft(nh, { id: {}, ref: {}, name: {}, children: {}, child: {} }, [], [], { mode: "open" });
var Np = j("<span><!></span>");
function rh(t, e) {
  const n = Yr();
  Ot(e, !0);
  let r = _(e, "id", 23, () => Kt(n)), o = _(e, "ref", 15, null), s = _(e, "children", 7), l = _(e, "child", 7), c = _(e, "part", 7), u = Ir(e, [
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
  const b = Lp.create(c(), {
    id: Ee(() => r()),
    ref: Ee(() => o(), (m) => o(m))
  }), g = I(() => xr(u, b.props));
  var y = {
    get id() {
      return r();
    },
    set id(m = Kt(n)) {
      r(m), S();
    },
    get ref() {
      return o();
    },
    set ref(m = null) {
      o(m), S();
    },
    get children() {
      return s();
    },
    set children(m) {
      s(m), S();
    },
    get child() {
      return l();
    },
    set child(m) {
      l(m), S();
    },
    get part() {
      return c();
    },
    set part(m) {
      c(m), S();
    }
  }, x = Ae(), f = Z(x);
  {
    var R = (m) => {
      var i = Ae(), O = Z(i);
      Mt(O, l, () => ({ props: a(g) })), E(m, i);
    }, w = (m) => {
      var i = Np();
      Kr(i, () => ({ ...a(g) }));
      var O = T(i);
      Mt(O, () => s() ?? Sr), A(i), E(m, i);
    };
    be(f, (m) => {
      l() ? m(R) : m(w, -1);
    });
  }
  return E(t, x), Lt(y);
}
Ft(rh, { id: {}, ref: {}, children: {}, child: {}, part: {} }, [], [], { mode: "open" });
const ah = new mi("DatePicker.Root");
class wd {
  static create(e) {
    return ah.set(new wd(e));
  }
  opts;
  constructor(e) {
    this.opts = e;
  }
}
function sh(t, e) {
  Ot(e, !0);
  let n = _(e, "open", 15, !1), r = _(e, "onOpenChange", 7, la), o = _(e, "onOpenChangeComplete", 7, la), s = _(e, "value", 15), l = _(e, "onValueChange", 7, la), c = _(e, "placeholder", 15), u = _(e, "onPlaceholderChange", 7, la), b = _(e, "isDateUnavailable", 7, () => !1), g = _(e, "validate", 7, la), y = _(e, "onInvalid", 7, la), x = _(e, "minValue", 7), f = _(e, "maxValue", 7), R = _(e, "disabled", 7, !1), w = _(e, "readonly", 7, !1), m = _(e, "granularity", 7), i = _(e, "readonlySegments", 23, () => []), O = _(e, "hourCycle", 7), W = _(e, "locale", 7), $ = _(e, "hideTimeZone", 7, !1), X = _(e, "required", 7, !1), me = _(e, "calendarLabel", 7, "Event"), D = _(e, "disableDaysOutsideMonth", 7, !0), ee = _(e, "preventDeselect", 7, !1), ve = _(e, "pagedNavigation", 7, !1), Re = _(e, "weekStartsOn", 7), ae = _(e, "weekdayFormat", 7, "narrow"), fe = _(e, "isDateDisabled", 7, () => !1), ne = _(e, "fixedWeeks", 7, !1), ke = _(e, "numberOfMonths", 7, 1), He = _(e, "closeOnDateSelect", 7, !0), xe = _(e, "initialFocus", 7, !1), se = _(e, "errorMessageId", 7), G = _(e, "children", 7), de = _(e, "monthFormat", 7, "long"), Se = _(e, "yearFormat", 7, "numeric");
  const $e = Iv({
    granularity: m(),
    defaultValue: s(),
    minValue: x(),
    maxValue: f()
  });
  function te() {
    c() === void 0 && c($e);
  }
  te(), eo.pre(() => c(), () => {
    te();
  });
  function M() {
    He() && n(!1);
  }
  const F = wd.create({
    open: Ee(() => n(), (q) => {
      n(q), r()(q);
    }),
    value: Ee(() => s(), (q) => {
      s(q), l()(q);
    }),
    placeholder: Ee(() => c(), (q) => {
      c(q), u()(q);
    }),
    isDateUnavailable: Ee(() => b()),
    minValue: Ee(() => x()),
    maxValue: Ee(() => f()),
    disabled: Ee(() => R()),
    readonly: Ee(() => w()),
    granularity: Ee(() => m()),
    readonlySegments: Ee(() => i()),
    hourCycle: Ee(() => O()),
    locale: Lh(() => W()),
    hideTimeZone: Ee(() => $()),
    required: Ee(() => X()),
    calendarLabel: Ee(() => me()),
    disableDaysOutsideMonth: Ee(() => D()),
    preventDeselect: Ee(() => ee()),
    pagedNavigation: Ee(() => ve()),
    weekStartsOn: Ee(() => Re()),
    weekdayFormat: Ee(() => ae()),
    isDateDisabled: Ee(() => fe()),
    fixedWeeks: Ee(() => ne()),
    numberOfMonths: Ee(() => ke()),
    initialFocus: Ee(() => xe()),
    onDateSelect: Ee(() => M),
    defaultPlaceholder: $e,
    monthFormat: Ee(() => de()),
    yearFormat: Ee(() => Se())
  });
  Ff.create({
    open: F.opts.open,
    onOpenChangeComplete: Ee(() => o())
  }), hd.create({
    value: F.opts.value,
    disabled: F.opts.disabled,
    readonly: F.opts.readonly,
    readonlySegments: F.opts.readonlySegments,
    validate: Ee(() => g()),
    onInvalid: Ee(() => y()),
    minValue: F.opts.minValue,
    maxValue: F.opts.maxValue,
    granularity: F.opts.granularity,
    hideTimeZone: F.opts.hideTimeZone,
    hourCycle: F.opts.hourCycle,
    locale: F.opts.locale,
    required: F.opts.required,
    placeholder: F.opts.placeholder,
    errorMessageId: Ee(() => se()),
    isInvalidProp: Ee(() => {
    })
  });
  var U = {
    get open() {
      return n();
    },
    set open(q = !1) {
      n(q), S();
    },
    get onOpenChange() {
      return r();
    },
    set onOpenChange(q = la) {
      r(q), S();
    },
    get onOpenChangeComplete() {
      return o();
    },
    set onOpenChangeComplete(q = la) {
      o(q), S();
    },
    get value() {
      return s();
    },
    set value(q) {
      s(q), S();
    },
    get onValueChange() {
      return l();
    },
    set onValueChange(q = la) {
      l(q), S();
    },
    get placeholder() {
      return c();
    },
    set placeholder(q) {
      c(q), S();
    },
    get onPlaceholderChange() {
      return u();
    },
    set onPlaceholderChange(q = la) {
      u(q), S();
    },
    get isDateUnavailable() {
      return b();
    },
    set isDateUnavailable(q = () => !1) {
      b(q), S();
    },
    get validate() {
      return g();
    },
    set validate(q = la) {
      g(q), S();
    },
    get onInvalid() {
      return y();
    },
    set onInvalid(q = la) {
      y(q), S();
    },
    get minValue() {
      return x();
    },
    set minValue(q) {
      x(q), S();
    },
    get maxValue() {
      return f();
    },
    set maxValue(q) {
      f(q), S();
    },
    get disabled() {
      return R();
    },
    set disabled(q = !1) {
      R(q), S();
    },
    get readonly() {
      return w();
    },
    set readonly(q = !1) {
      w(q), S();
    },
    get granularity() {
      return m();
    },
    set granularity(q) {
      m(q), S();
    },
    get readonlySegments() {
      return i();
    },
    set readonlySegments(q = []) {
      i(q), S();
    },
    get hourCycle() {
      return O();
    },
    set hourCycle(q) {
      O(q), S();
    },
    get locale() {
      return W();
    },
    set locale(q) {
      W(q), S();
    },
    get hideTimeZone() {
      return $();
    },
    set hideTimeZone(q = !1) {
      $(q), S();
    },
    get required() {
      return X();
    },
    set required(q = !1) {
      X(q), S();
    },
    get calendarLabel() {
      return me();
    },
    set calendarLabel(q = "Event") {
      me(q), S();
    },
    get disableDaysOutsideMonth() {
      return D();
    },
    set disableDaysOutsideMonth(q = !0) {
      D(q), S();
    },
    get preventDeselect() {
      return ee();
    },
    set preventDeselect(q = !1) {
      ee(q), S();
    },
    get pagedNavigation() {
      return ve();
    },
    set pagedNavigation(q = !1) {
      ve(q), S();
    },
    get weekStartsOn() {
      return Re();
    },
    set weekStartsOn(q) {
      Re(q), S();
    },
    get weekdayFormat() {
      return ae();
    },
    set weekdayFormat(q = "narrow") {
      ae(q), S();
    },
    get isDateDisabled() {
      return fe();
    },
    set isDateDisabled(q = () => !1) {
      fe(q), S();
    },
    get fixedWeeks() {
      return ne();
    },
    set fixedWeeks(q = !1) {
      ne(q), S();
    },
    get numberOfMonths() {
      return ke();
    },
    set numberOfMonths(q = 1) {
      ke(q), S();
    },
    get closeOnDateSelect() {
      return He();
    },
    set closeOnDateSelect(q = !0) {
      He(q), S();
    },
    get initialFocus() {
      return xe();
    },
    set initialFocus(q = !1) {
      xe(q), S();
    },
    get errorMessageId() {
      return se();
    },
    set errorMessageId(q) {
      se(q), S();
    },
    get children() {
      return G();
    },
    set children(q) {
      G(q), S();
    },
    get monthFormat() {
      return de();
    },
    set monthFormat(q = "long") {
      de(q), S();
    },
    get yearFormat() {
      return Se();
    },
    set yearFormat(q = "numeric") {
      Se(q), S();
    }
  }, ce = Ae(), pe = Z(ce);
  return Le(pe, () => Fh, (q, De) => {
    De(q, {
      children: (nt, rt) => {
        var ue = Ae(), Fe = Z(ue);
        Mt(Fe, () => G() ?? Sr), E(nt, ue);
      },
      $$slots: { default: !0 }
    });
  }), E(t, ce), Lt(U);
}
Ft(
  sh,
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
var Bp = j("<div><!></div>");
function oh(t, e) {
  const n = Yr();
  Ot(e, !0);
  let r = _(e, "children", 7), o = _(e, "child", 7), s = _(e, "id", 23, () => Kt(n)), l = _(e, "ref", 15, null), c = Ir(e, [
    "$$slots",
    "$$events",
    "$$legacy",
    "$$host",
    "children",
    "child",
    "id",
    "ref"
  ]);
  const u = ah.get(), b = Xl.create({
    id: Ee(() => s()),
    ref: Ee(() => l(), (m) => l(m)),
    calendarLabel: u.opts.calendarLabel,
    fixedWeeks: u.opts.fixedWeeks,
    isDateDisabled: u.opts.isDateDisabled,
    isDateUnavailable: u.opts.isDateUnavailable,
    locale: u.opts.locale,
    numberOfMonths: u.opts.numberOfMonths,
    pagedNavigation: u.opts.pagedNavigation,
    preventDeselect: u.opts.preventDeselect,
    readonly: u.opts.readonly,
    type: Ee(() => "single"),
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
    maxDays: Ee(() => {
    }),
    monthFormat: u.opts.monthFormat,
    yearFormat: u.opts.yearFormat
  }), g = I(() => xr(c, b.props));
  var y = {
    get children() {
      return r();
    },
    set children(m) {
      r(m), S();
    },
    get child() {
      return o();
    },
    set child(m) {
      o(m), S();
    },
    get id() {
      return s();
    },
    set id(m = Kt(n)) {
      s(m), S();
    },
    get ref() {
      return l();
    },
    set ref(m = null) {
      l(m), S();
    }
  }, x = Ae(), f = Z(x);
  {
    var R = (m) => {
      var i = Ae(), O = Z(i);
      {
        let W = I(() => ({ props: a(g), ...b.snippetProps }));
        Mt(O, o, () => a(W));
      }
      E(m, i);
    }, w = (m) => {
      var i = Bp();
      Kr(i, () => ({ ...a(g) }));
      var O = T(i);
      Mt(O, () => r() ?? Sr, () => b.snippetProps), A(i), E(m, i);
    };
    be(f, (m) => {
      o() ? m(R) : m(w, -1);
    });
  }
  return E(t, x), Lt(y);
}
Ft(oh, { children: {}, child: {}, id: {}, ref: {} }, [], [], { mode: "open" });
function ih(t, e) {
  Ot(e, !0);
  let n = _(e, "ref", 15, null), r = _(e, "onOpenAutoFocus", 7), o = Ir(e, [
    "$$slots",
    "$$events",
    "$$legacy",
    "$$host",
    "ref",
    "onOpenAutoFocus"
  ]);
  const s = I(() => xr({ onOpenAutoFocus: r() }, { onOpenAutoFocus: hp }));
  var l = {
    get ref() {
      return n();
    },
    set ref(c = null) {
      n(c), S();
    },
    get onOpenAutoFocus() {
      return r();
    },
    set onOpenAutoFocus(c) {
      r(c), S();
    }
  };
  return Hf(t, no(() => a(s), () => o, {
    get ref() {
      return n();
    },
    set ref(c) {
      n(c);
    }
  })), Lt(l);
}
Ft(ih, { ref: {}, onOpenAutoFocus: {} }, [], [], { mode: "open" });
function lh(t, e) {
  Ot(e, !0);
  let n = _(e, "ref", 15, null), r = _(e, "onkeydown", 7), o = Ir(e, [
    "$$slots",
    "$$events",
    "$$legacy",
    "$$host",
    "ref",
    "onkeydown"
  ]);
  function s(u) {
    if (No(u.key)) {
      const g = u.currentTarget.closest(ud.selector("input"));
      if (!g) return;
      $o(u, g);
    }
  }
  const l = I(() => xr({ onkeydown: r() }, { onkeydown: s }));
  var c = {
    get ref() {
      return n();
    },
    set ref(u = null) {
      n(u), S();
    },
    get onkeydown() {
      return r();
    },
    set onkeydown(u) {
      r(u), S();
    }
  };
  return $f(t, no(() => o, { "data-segment": "trigger" }, () => a(l), {
    get ref() {
      return n();
    },
    set ref(u) {
      n(u);
    }
  })), Lt(c);
}
Ft(lh, { ref: {}, onkeydown: {} }, [], [], { mode: "open" });
var Up = j('<div class="copy-icon svg-icon" aria-hidden="true"></div> <span> </span>', 1), qp = j('<div class="raw-json-icon svg-icon" aria-hidden="true"></div> <span> </span>', 1), Vp = j('<div class="open-in-new-icon svg-icon" aria-hidden="true"></div> <span> </span>', 1), jp = j("<!> <!>", 1), Kp = j("<!> <!>", 1), Yp = j("<!> <!>", 1), zp = j('<div class="broadcast-icon svg-icon" aria-hidden="true"></div> <span> </span>', 1), Qp = j('<div class="trash-icon svg-icon" aria-hidden="true"></div> <span> </span>', 1), Wp = j("<!> <!>", 1), Jp = j("<!> <!> <!> <!>", 1);
const Gp = {
  hash: "svelte-8tu42h",
  code: ".open-in-new-icon {mask-image:var(--ehagaki-icon-6f70656e5f696e5f6e65775f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}"
};
function Do(t, e) {
  Ot(e, !0), Ha(t, Gp);
  const n = () => bs(qs, "$_", r), [r, o] = Us(), s = (G) => {
    var de = Ae(), Se = Z(de);
    Le(Se, () => Jn, ($e, te) => {
      te($e, {
        class: "menu-action-button",
        get onpointerdown() {
          return R();
        },
        get onSelect() {
          return w();
        },
        children: (M, F) => {
          var U = Up(), ce = L(Z(U), 2), pe = T(ce, !0);
          A(ce), ge((q) => J(pe, q), [
            () => u() ? n()("postHistory.copyFailed") : n()("postHistory.copyNevent")
          ]), E(M, U);
        },
        $$slots: { default: !0 }
      });
    }), E(G, de);
  }, l = (G) => {
    var de = Ae(), Se = Z(de);
    Le(Se, () => Jn, ($e, te) => {
      te($e, {
        class: "menu-action-button",
        onSelect: () => O()(),
        children: (M, F) => {
          var U = qp(), ce = L(Z(U), 2), pe = T(ce, !0);
          A(ce), ge((q) => J(pe, q), [() => n()("postHistory.rawJson")]), E(M, U);
        },
        $$slots: { default: !0 }
      });
    }), E(G, de);
  };
  let c = _(e, "order", 7), u = _(e, "copyFailed", 7), b = _(e, "showBroadcast", 7), g = _(e, "broadcastSending", 7), y = _(e, "showDelete", 7), x = _(e, "showDeleteSeparator", 7), f = _(e, "deletionSending", 7), R = _(e, "onCopyPointerDown", 7), w = _(e, "onCopyNevent", 7), m = _(e, "externalClientLabel", 7, void 0), i = _(e, "onOpenExternalClient", 7, void 0), O = _(e, "onShowRawJson", 7), W = _(e, "onBroadcastPointerDown", 7), $ = _(e, "onBroadcastPost", 7), X = _(e, "onOpenDeleteConfirm", 7);
  var me = {
    get order() {
      return c();
    },
    set order(G) {
      c(G), S();
    },
    get copyFailed() {
      return u();
    },
    set copyFailed(G) {
      u(G), S();
    },
    get showBroadcast() {
      return b();
    },
    set showBroadcast(G) {
      b(G), S();
    },
    get broadcastSending() {
      return g();
    },
    set broadcastSending(G) {
      g(G), S();
    },
    get showDelete() {
      return y();
    },
    set showDelete(G) {
      y(G), S();
    },
    get showDeleteSeparator() {
      return x();
    },
    set showDeleteSeparator(G) {
      x(G), S();
    },
    get deletionSending() {
      return f();
    },
    set deletionSending(G) {
      f(G), S();
    },
    get onCopyPointerDown() {
      return R();
    },
    set onCopyPointerDown(G) {
      R(G), S();
    },
    get onCopyNevent() {
      return w();
    },
    set onCopyNevent(G) {
      w(G), S();
    },
    get externalClientLabel() {
      return m();
    },
    set externalClientLabel(G = void 0) {
      m(G), S();
    },
    get onOpenExternalClient() {
      return i();
    },
    set onOpenExternalClient(G = void 0) {
      i(G), S();
    },
    get onShowRawJson() {
      return O();
    },
    set onShowRawJson(G) {
      O(G), S();
    },
    get onBroadcastPointerDown() {
      return W();
    },
    set onBroadcastPointerDown(G) {
      W(G), S();
    },
    get onBroadcastPost() {
      return $();
    },
    set onBroadcastPost(G) {
      $(G), S();
    },
    get onOpenDeleteConfirm() {
      return X();
    },
    set onOpenDeleteConfirm(G) {
      X(G), S();
    }
  }, D = Jp(), ee = Z(D);
  {
    var ve = (G) => {
      var de = jp(), Se = Z(de);
      Le(Se, () => Jn, (te, M) => {
        M(te, {
          class: "menu-action-button",
          get onSelect() {
            return i();
          },
          children: (F, U) => {
            var ce = Vp(), pe = L(Z(ce), 2), q = T(pe, !0);
            A(pe), ge(() => J(q, m())), E(F, ce);
          },
          $$slots: { default: !0 }
        });
      });
      var $e = L(Se, 2);
      Le($e, () => ts, (te, M) => {
        M(te, { class: "post-history-menu-separator" });
      }), E(G, de);
    };
    be(ee, (G) => {
      m() && i() && G(ve);
    });
  }
  var Re = L(ee, 2);
  {
    var ae = (G) => {
      var de = Kp(), Se = Z(de);
      l(Se);
      var $e = L(Se, 2);
      s($e), E(G, de);
    }, fe = (G) => {
      var de = Yp(), Se = Z(de);
      s(Se);
      var $e = L(Se, 2);
      l($e), E(G, de);
    };
    be(Re, (G) => {
      c() === "raw-json-first" ? G(ae) : G(fe, -1);
    });
  }
  var ne = L(Re, 2);
  {
    var ke = (G) => {
      var de = Ae(), Se = Z(de);
      Le(Se, () => Jn, ($e, te) => {
        te($e, {
          class: "menu-action-button",
          get disabled() {
            return g();
          },
          get onpointerdown() {
            return W();
          },
          get onSelect() {
            return $();
          },
          children: (M, F) => {
            var U = zp(), ce = L(Z(U), 2), pe = T(ce, !0);
            A(ce), ge((q) => J(pe, q), [() => n()("postHistory.broadcast")]), E(M, U);
          },
          $$slots: { default: !0 }
        });
      }), E(G, de);
    };
    be(ne, (G) => {
      b() && G(ke);
    });
  }
  var He = L(ne, 2);
  {
    var xe = (G) => {
      var de = Wp(), Se = Z(de);
      {
        var $e = (M) => {
          var F = Ae(), U = Z(F);
          Le(U, () => ts, (ce, pe) => {
            pe(ce, { class: "post-history-menu-separator" });
          }), E(M, F);
        };
        be(Se, (M) => {
          x() && M($e);
        });
      }
      var te = L(Se, 2);
      Le(te, () => Jn, (M, F) => {
        F(M, {
          class: "menu-action-button menu-action-button-danger",
          get disabled() {
            return f();
          },
          onSelect: () => X()(),
          children: (U, ce) => {
            var pe = Qp(), q = L(Z(pe), 2), De = T(q, !0);
            A(q), ge((nt) => J(De, nt), [
              () => f() ? n()("postHistory.deleteSending") : n()("postHistory.delete")
            ]), E(U, pe);
          },
          $$slots: { default: !0 }
        });
      }), E(G, de);
    };
    be(He, (G) => {
      y() && G(xe);
    });
  }
  E(t, D);
  var se = Lt(me);
  return o(), se;
}
Ft(
  Do,
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
var Zp = j('<img class="post-history-related-avatar svelte-1g9bqtt"/>'), Xp = j('<span class="post-history-related-avatar-placeholder svelte-1g9bqtt" aria-hidden="true"></span>'), eg = j('<article class="post-history-related-card svelte-1g9bqtt"><!> <div class="post-history-related-card-body svelte-1g9bqtt"><div class="post-history-related-author svelte-1g9bqtt"><!> <span class="post-history-related-author-name svelte-1g9bqtt"> </span></div> <!> <!></div></article>');
const tg = {
  hash: "svelte-1g9bqtt",
  code: `.post-history-related-card.svelte-1g9bqtt {display:grid;--post-history-related-card-bg: color-mix(\r
            in srgb,\r
            var(--dialog-bg),\r
            var(--border-hr) 24%\r
        );border-inline-start:2px solid\r
            color-mix(in srgb, var(--theme), transparent 45%);background:var(--post-history-related-card-bg);color:var(--text);font-size:0.9rem;padding-inline-start:2px;}.post-history-related-card-body.svelte-1g9bqtt {display:grid;gap:2px;padding:2px 10px 0 8px;}.post-history-related-author.svelte-1g9bqtt {display:flex;align-items:center;min-width:0;gap:8px;}.post-history-related-avatar.svelte-1g9bqtt,\r
    .post-history-related-avatar-placeholder.svelte-1g9bqtt {width:24px;height:24px;flex:0 0 auto;border-radius:50%;background:var(--border-hr);object-fit:cover;}.post-history-related-avatar-placeholder.svelte-1g9bqtt {display:inline-block;mask-image:var(--ehagaki-icon-6163636f756e745f636972636c655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);background-color:var(--text-muted);}.post-history-related-author-name.svelte-1g9bqtt {min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:600;}.post-history-related-card .post-history-related-content {margin:0;white-space:pre-wrap;overflow-wrap:anywhere;line-height:1.45;}`
};
function Pd(t, e) {
  Ot(e, !0), Ha(t, tg);
  let n = _(e, "event", 7), r = _(e, "profile", 7, null), o = _(e, "media", 7, void 0), s = _(e, "model", 7, void 0), l = _(e, "emojiLoadStateByUrl", 23, () => ({})), c = _(e, "emojiImageMetaByUrl", 23, () => ({})), u = _(e, "scrollRoot", 7, null), b = _(e, "onImageOpen", 7, void 0), g = _(e, "topActions", 7, void 0), y = _(e, "footerLeftExtras", 7, void 0), x = _(e, "footerActions", 7, void 0), f = _(e, "footerMenu", 7, void 0), R = I(() => {
    const ne = r()?.displayName?.trim() || r()?.name?.trim();
    return ne || eu(fu.npubEncode(n().pubkey), 12, 4);
  }), w = I(() => s() ?? fl({
    sourceContent: n().content,
    tags: n().tags,
    media: o()
  })), m = I(() => vl(n().created_at * 1e3));
  var i = {
    get event() {
      return n();
    },
    set event(ne) {
      n(ne), S();
    },
    get profile() {
      return r();
    },
    set profile(ne = null) {
      r(ne), S();
    },
    get media() {
      return o();
    },
    set media(ne = void 0) {
      o(ne), S();
    },
    get model() {
      return s();
    },
    set model(ne = void 0) {
      s(ne), S();
    },
    get emojiLoadStateByUrl() {
      return l();
    },
    set emojiLoadStateByUrl(ne = {}) {
      l(ne), S();
    },
    get emojiImageMetaByUrl() {
      return c();
    },
    set emojiImageMetaByUrl(ne = {}) {
      c(ne), S();
    },
    get scrollRoot() {
      return u();
    },
    set scrollRoot(ne = null) {
      u(ne), S();
    },
    get onImageOpen() {
      return b();
    },
    set onImageOpen(ne = void 0) {
      b(ne), S();
    },
    get topActions() {
      return g();
    },
    set topActions(ne = void 0) {
      g(ne), S();
    },
    get footerLeftExtras() {
      return y();
    },
    set footerLeftExtras(ne = void 0) {
      y(ne), S();
    },
    get footerActions() {
      return x();
    },
    set footerActions(ne = void 0) {
      x(ne), S();
    },
    get footerMenu() {
      return f();
    },
    set footerMenu(ne = void 0) {
      f(ne), S();
    }
  }, O = eg(), W = T(O);
  Mt(W, () => g() ?? Sr);
  var $ = L(W, 2), X = T($), me = T(X);
  {
    var D = (ne) => {
      var ke = Zp();
      ge(() => {
        Tn(ke, "src", r().picture), Tn(ke, "alt", a(R));
      }), E(ne, ke);
    }, ee = (ne) => {
      var ke = Xp();
      E(ne, ke);
    };
    be(me, (ne) => {
      r()?.picture ? ne(D) : ne(ee, -1);
    });
  }
  var ve = L(me, 2), Re = T(ve, !0);
  A(ve), A(X);
  var ae = L(X, 2);
  Xc(ae, {
    get model() {
      return a(w);
    },
    density: "compact",
    contentClass: "post-history-related-content",
    get emojiLoadStateByUrl() {
      return l();
    },
    get emojiImageMetaByUrl() {
      return c();
    },
    get scrollRoot() {
      return u();
    },
    get onImageOpen() {
      return b();
    }
  });
  var fe = L(ae, 2);
  return mu(fe, {
    get formattedDate() {
      return a(m);
    },
    density: "compact",
    get leftExtras() {
      return y();
    },
    get actions() {
      return x();
    },
    get trailing() {
      return f();
    }
  }), A($), A(O), ge(() => J(Re, a(R))), E(t, O), Lt(i);
}
Ft(
  Pd,
  {
    event: {},
    profile: {},
    media: {},
    model: {},
    emojiLoadStateByUrl: {},
    emojiImageMetaByUrl: {},
    scrollRoot: {},
    onImageOpen: {},
    topActions: {},
    footerLeftExtras: {},
    footerActions: {},
    footerMenu: {}
  },
  [],
  [],
  { mode: "open" }
);
var ng = j('<article class="post-history-quote-status-card svelte-1rnem6w"><div class="post-history-quote-status-body svelte-1rnem6w"><p> </p> <!></div></article>');
const rg = {
  hash: "svelte-1rnem6w",
  code: `.post-history-quote-status-card.svelte-1rnem6w {display:grid;border-inline-start:2px solid
            color-mix(in srgb, var(--theme), transparent 45%);background:color-mix(in srgb, var(--dialog-bg), var(--border-hr) 24%);color:var(--text);font-size:0.9rem;}.post-history-quote-status-body.svelte-1rnem6w {display:grid;gap:8px;padding:2px 10px 10px;}.post-history-quote-status-message.svelte-1rnem6w {margin:0;color:var(--text-muted);line-height:1.45;}.post-history-quote-status-error.svelte-1rnem6w {color:var(--danger);}.post-history-quote-retry-button {justify-self:start;}`
};
function dh(t, e) {
  Ot(e, !0), Ha(t, rg);
  const n = () => bs(qs, "$_", r), [r, o] = Us();
  let s = _(e, "preview", 7), l = _(e, "model", 7, void 0), c = _(e, "emojiLoadStateByUrl", 23, () => ({})), u = _(e, "emojiImageMetaByUrl", 23, () => ({})), b = _(e, "scrollRoot", 7, null), g = _(e, "onImageOpen", 7, void 0), y = _(e, "onRetry", 7, void 0), x = _(e, "footerMenu", 7, void 0);
  function f() {
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
  var R = {
    get preview() {
      return s();
    },
    set preview($) {
      s($), S();
    },
    get model() {
      return l();
    },
    set model($ = void 0) {
      l($), S();
    },
    get emojiLoadStateByUrl() {
      return c();
    },
    set emojiLoadStateByUrl($ = {}) {
      c($), S();
    },
    get emojiImageMetaByUrl() {
      return u();
    },
    set emojiImageMetaByUrl($ = {}) {
      u($), S();
    },
    get scrollRoot() {
      return b();
    },
    set scrollRoot($ = null) {
      b($), S();
    },
    get onImageOpen() {
      return g();
    },
    set onImageOpen($ = void 0) {
      g($), S();
    },
    get onRetry() {
      return y();
    },
    set onRetry($ = void 0) {
      y($), S();
    },
    get footerMenu() {
      return x();
    },
    set footerMenu($ = void 0) {
      x($), S();
    }
  }, w = Ae(), m = Z(w);
  {
    var i = ($) => {
      Pd($, {
        get event() {
          return s().event;
        },
        get profile() {
          return s().profile;
        },
        get model() {
          return l();
        },
        get emojiLoadStateByUrl() {
          return c();
        },
        get emojiImageMetaByUrl() {
          return u();
        },
        get scrollRoot() {
          return b();
        },
        get onImageOpen() {
          return g();
        },
        get footerMenu() {
          return x();
        }
      });
    }, O = ($) => {
      var X = ng(), me = T(X), D = T(me);
      let ee;
      var ve = T(D, !0);
      A(D);
      var Re = L(D, 2);
      {
        var ae = (fe) => {
          ir(fe, {
            type: "button",
            className: "post-history-quote-retry-button",
            onClick: () => y()?.(s().eventId),
            children: (ne, ke) => {
              $s();
              var He = ss();
              ge((xe) => J(He, xe), [() => n()("postHistory.contextRetry")]), E(ne, He);
            },
            $$slots: { default: !0 }
          });
        };
        be(Re, (fe) => {
          s().status === "error" && fe(ae);
        });
      }
      A(me), A(X), ge(
        (fe) => {
          ee = Ma(D, 1, "post-history-quote-status-message svelte-1rnem6w", null, ee, {
            "post-history-quote-status-error": s().status === "error"
          }), J(ve, fe);
        },
        [() => f()]
      ), E($, X);
    };
    be(m, ($) => {
      s().status === "resolved" ? $(i) : $(O, -1);
    });
  }
  E(t, w);
  var W = Lt(R);
  return o(), W;
}
Ft(
  dh,
  {
    preview: {},
    model: {},
    emojiLoadStateByUrl: {},
    emojiImageMetaByUrl: {},
    scrollRoot: {},
    onImageOpen: {},
    onRetry: {},
    footerMenu: {}
  },
  [],
  [],
  { mode: "open" }
);
const ag = 500, sg = 250, og = /^[0-9a-f]{64}$/;
function ig() {
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
    appliedDeletionPostCount: 0
  };
}
function lg(t) {
  return { ...t };
}
function dg(t) {
  return t.tags.filter(
    (e) => e[0] === "e" && typeof e[1] == "string" && og.test(e[1])
  ).length;
}
class cg {
  postHistoryRepository;
  deletionRequestsRepository;
  constructor(e = {}) {
    this.postHistoryRepository = e.postHistoryRepository ?? at, this.deletionRequestsRepository = e.deletionRequestsRepository ?? ro;
  }
  async importFile(e) {
    const n = ig(), r = /* @__PURE__ */ new Set(), o = [];
    let s = !1, l = null;
    const c = Number.isFinite(e.file.size) && e.file.size > 0 ? e.file.size : 0;
    let u = 0;
    const b = () => n.invalidJsonCount > 0 || n.invalidStructureCount > 0 || n.invalidIdOrSignatureCount > 0, g = () => e.signal?.aborted ? "cancelled" : e.getCurrentPubkeyHex() !== e.ownerPubkeyHex ? "account-changed" : null, y = ($ = !1) => {
      if (!e.onProgress)
        return;
      const X = performance.now();
      !$ && l !== null && X - l < sg || (l = X, e.onProgress({
        result: lg(n),
        processedBytes: u,
        totalBytes: c
      }));
    }, x = ($) => {
      $ <= 0 || (u = Math.min(
        c,
        Math.max(u, u + $)
      ));
    }, f = async () => {
      if (o.length === 0)
        return g();
      const $ = g();
      if ($)
        return o.length = 0, $;
      const X = o.filter((ee) => ee.type === "post").map((ee) => ({
        event: ee.event,
        attestation: ee.attestation
      })), me = o.filter((ee) => ee.type === "deletion").map((ee) => ee.event);
      if (o.length = 0, X.length > 0)
        try {
          const ee = await this.postHistoryRepository.upsertFetchedEvents({
            events: X
          });
          n.insertedPostCount += ee.insertedCount, n.updatedPostCount += ee.updatedCount, n.unchangedPostCount += ee.unchangedCount, n.appliedDeletionPostCount += ee.appliedDeletionCount;
        } catch {
          n.failedPostEventCount += X.length, s = !0;
        }
      const D = g();
      if (D)
        return D;
      if (me.length > 0)
        try {
          const ee = await this.deletionRequestsRepository.upsertImportedDeletionEvents({
            ownerPubkeyHex: e.ownerPubkeyHex,
            deletionEvents: me
          });
          n.insertedDeletionRequestCount += ee.insertedCount, n.updatedDeletionRequestCount += ee.updatedCount, n.unchangedDeletionRequestCount += ee.unchangedCount, n.unsupportedDeletionEventCount += ee.ignoredCount, n.appliedDeletionPostCount += ee.appliedDeletionCount;
        } catch {
          n.failedDeletionEventCount += me.length, s = !0;
        }
      return y(), g();
    }, R = async ($) => {
      const X = g();
      if (X)
        return X;
      if ($.trim().length === 0)
        return null;
      n.nonEmptyLineCount += 1;
      let me;
      try {
        me = JSON.parse($);
      } catch {
        return n.invalidJsonCount += 1, null;
      }
      if (!$l(me))
        return n.invalidStructureCount += 1, null;
      const D = me;
      if (D.pubkey !== e.ownerPubkeyHex)
        return n.otherAccountCount += 1, null;
      if (D.kind !== 1 && D.kind !== 42 && D.kind !== 5)
        return n.unsupportedKindCount += 1, null;
      const ee = Hh(D);
      if (!ee)
        return n.invalidIdOrSignatureCount += 1, null;
      if (r.has(D.id))
        return n.fileDuplicateCount += 1, null;
      if (r.add(D.id), D.kind === 1 || D.kind === 42)
        n.uniquePostEventCount += 1, o.push({ type: "post", ...ee });
      else if (D.kind === 5) {
        n.uniqueDeletionEventCount += 1;
        const ve = dg(D);
        if (n.validDeletionETagCount += ve, ve === 0)
          return n.unsupportedDeletionEventCount += 1, null;
        o.push({ type: "deletion", ...ee });
      }
      return o.length >= ag ? f() : null;
    };
    let w;
    try {
      w = e.file.stream().getReader();
    } catch {
      return n.status = "failed", y(!0), n;
    }
    const m = () => {
      w.cancel().catch(() => {
      });
    };
    e.signal?.addEventListener("abort", m, { once: !0 });
    const i = new TextDecoder("utf-8", { fatal: !0 });
    let O = "";
    try {
      for (; ; ) {
        const $ = g();
        if ($)
          return n.status = $, await w.cancel().catch(() => {
          }), o.length = 0, y(!0), n;
        const X = await w.read();
        if (X.done) {
          if (O += i.decode(), O.length > 0) {
            const D = await R(O.replace(/\r$/, ""));
            if (D)
              return n.status = D, o.length = 0, y(!0), n;
          }
          break;
        }
        O += i.decode(X.value, { stream: !0 });
        const me = O.split(`
`);
        O = me.pop() ?? "";
        for (const D of me) {
          const ee = await R(D.replace(/\r$/, ""));
          if (ee)
            return n.status = ee, await w.cancel().catch(() => {
            }), o.length = 0, y(!0), n;
        }
        x(X.value.byteLength), y();
      }
    } catch {
      const $ = g();
      if ($)
        return n.status = $, o.length = 0, y(!0), n;
      const X = await f();
      return X ? (n.status = X, y(!0), n) : (n.status = n.nonEmptyLineCount > 0 ? "partial" : "failed", y(!0), n);
    } finally {
      e.signal?.removeEventListener("abort", m), w.releaseLock();
    }
    const W = await f();
    return W ? (n.status = W, y(!0), n) : (n.status = s || b() ? "partial" : "completed", y(!0), n);
  }
}
const ug = new cg();
var hg = j('<div class="xmark-icon svg-icon svelte-1qfqhib" aria-hidden="true"></div>'), fg = j('<span class="import-icon svg-icon svelte-1qfqhib" aria-hidden="true"></span> <span> </span>', 1), vg = j('<div aria-live="polite"> </div>'), pg = j('<div class="import-progress-indicator"></div>'), gg = j('<div class="import-progress svelte-1qfqhib"><!> <div class="import-progress-summary svelte-1qfqhib"><span class="import-progress-metric svelte-1qfqhib"><span> </span> <span class="import-progress-number svelte-1qfqhib"> </span></span> <span class="import-progress-metric svelte-1qfqhib"><span> </span> <span class="import-progress-number svelte-1qfqhib"> </span></span> <span class="import-progress-metric svelte-1qfqhib"><span> </span> <span class="import-progress-number svelte-1qfqhib"> </span></span></div> <!></div>'), yg = j('<div class="import-results svelte-1qfqhib"><section aria-labelledby="post-history-import-input-heading" class="svelte-1qfqhib"><h3 id="post-history-import-input-heading" class="svelte-1qfqhib"> </h3> <dl class="svelte-1qfqhib"><div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div> <div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div> <div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div> <div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div> <div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div> <div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div> <div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div></dl></section> <section aria-labelledby="post-history-import-post-heading" class="svelte-1qfqhib"><h3 id="post-history-import-post-heading" class="svelte-1qfqhib"> </h3> <dl class="svelte-1qfqhib"><div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div> <div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div> <div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div> <div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div> <div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div> <div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div></dl></section> <section aria-labelledby="post-history-import-deletion-heading" class="svelte-1qfqhib"><h3 id="post-history-import-deletion-heading" class="svelte-1qfqhib"> </h3> <dl class="svelte-1qfqhib"><div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div> <div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div> <div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div> <div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div> <div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div> <div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div> <div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div></dl></section></div>'), mg = j('<div class="import-heading svelte-1qfqhib"><h2 class="svelte-1qfqhib"> </h2> <p class="svelte-1qfqhib"> </p></div> <input class="visually-hidden import-file-input" type="file"/> <div role="presentation"><!> <p class="import-drop-hint svelte-1qfqhib"> </p></div> <!> <!>', 1);
const bg = {
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
function ch(t, e) {
  Ot(e, !0), Ha(t, bg);
  const n = () => bs(qs, "$_", r), [r, o] = Us();
  let s = _(e, "open", 15, !1), l = _(e, "ownerPubkeyHex", 7), c = _(e, "getCurrentPubkeyHex", 7), u = _(e, "onOpenChange", 7, void 0), b = _(e, "onImported", 7, void 0), g = ye(null), y = ye(!1), x = ye(null), f = ye(null), R = ye(0), w = ye(0), m = ye(0), i = ye(0), O = null, W = null, $ = null, X = 0, me = !1, D = I(() => a(f)?.processedBytes ?? a(R)), ee = I(() => a(f)?.totalBytes ?? a(w)), ve = I(() => a(ee) <= 0 ? 0 : Math.min(100, Math.max(0, Math.round(a(D) / a(ee) * 100)))), Re = I(() => {
    if (a(D) <= 0 || a(ee) <= 0 || a(D) >= a(ee) || a(m) < 1e3)
      return null;
    const ue = a(D) / a(m), Fe = (a(ee) - a(D)) / ue;
    return Number.isFinite(Fe) && Fe >= 0 ? Fe : null;
  }), ae = I(() => a(y) ? a(Re) === null ? n()("postHistory.importRemainingTimeCalculating") : fe(a(Re)) : a(x)?.status === "completed" || a(x)?.status === "partial" ? fe(0) : n()("postHistory.importRemainingTimeUnavailable"));
  function fe(ue) {
    const Fe = Math.max(0, Math.floor(ue / 1e3)), Ue = String(Fe % 60).padStart(2, "0"), re = Math.floor(Fe / 60), Ge = re % 60;
    return re < 60 ? `${Ge}:${Ue}` : `${Math.floor(re / 60)}:${String(Ge).padStart(2, "0")}:${Ue}`;
  }
  function ne() {
    $ !== null && p(m, Math.max(0, performance.now() - $), !0);
  }
  function ke() {
    W !== null && (clearInterval(W), W = null), $ = null;
  }
  function He() {
    ke(), p(m, 0), $ = performance.now(), W = setInterval(ne, 1e3);
  }
  function xe() {
    ke(), p(f, null), p(R, 0), p(w, 0), p(m, 0);
  }
  function se(ue) {
    return `translate: -${100 - ue}% 0;`;
  }
  let G = I(() => a(y) ? "postHistory.importReading" : a(x) ? a(x).status === "completed" ? "postHistory.importComplete" : a(x).status === "partial" ? "postHistory.importPartial" : a(x).status === "account-changed" ? "postHistory.importAccountChanged" : a(x).status === "cancelled" ? "postHistory.importCancelled" : "postHistory.importFailed" : null);
  function de() {
    p(x, null), p(y, !1), xe(), p(i, 0), O = null, a(g) && (a(g).value = "");
  }
  function Se() {
    X += 1, O?.abort(), O = null, p(y, !1), xe(), p(i, 0);
  }
  function $e(ue) {
    ue || Se(), u()?.(ue);
  }
  function te() {
    !a(y) && l() && a(g)?.click();
  }
  function M(ue) {
    return ue ? Array.from(ue.types).includes("Files") || ue.files.length > 0 : !1;
  }
  function F(ue) {
    M(ue.dataTransfer) && (ue.preventDefault(), p(i, a(i) + 1));
  }
  function U(ue) {
    ue.preventDefault(), M(ue.dataTransfer);
  }
  function ce(ue) {
    a(i) === 0 && !M(ue.dataTransfer) || p(i, Math.max(0, a(i) - 1), !0);
  }
  function pe(ue) {
    if (ue.preventDefault(), !M(ue.dataTransfer))
      return;
    p(i, 0);
    const Fe = ue.dataTransfer?.files[0];
    Fe && q(Fe);
  }
  async function q(ue) {
    if (a(y) || !l())
      return;
    const Fe = ++X, Ue = new AbortController();
    O = Ue, p(y, !0), p(x, null), p(f, null), p(R, 0), p(w, Number.isFinite(ue.size) && ue.size > 0 ? ue.size : 0, !0), He();
    try {
      const re = await ug.importFile({
        file: ue,
        ownerPubkeyHex: l(),
        getCurrentPubkeyHex: c(),
        signal: Ue.signal,
        onProgress: (kt) => {
          Fe === X && s() && (p(
            f,
            {
              result: { ...kt.result },
              processedBytes: kt.processedBytes,
              totalBytes: kt.totalBytes
            },
            !0
          ), p(R, kt.processedBytes, !0), p(w, kt.totalBytes, !0), p(x, { ...kt.result }, !0), ne());
        }
      });
      if (Fe !== X || !s())
        return;
      p(x, re, !0), re.insertedPostCount + re.updatedPostCount + re.appliedDeletionPostCount > 0 && await b()?.();
    } finally {
      Fe === X && (p(y, !1), ke(), O = null);
    }
  }
  async function De(ue) {
    const Fe = ue.currentTarget, Ue = Fe.files?.[0];
    Fe.value = "", Ue && await q(Ue);
  }
  Ke(() => {
    s() && !me ? de() : !s() && me && Se(), me = s();
  }), ao(ke);
  var nt = {
    get open() {
      return s();
    },
    set open(ue = !1) {
      s(ue), S();
    },
    get ownerPubkeyHex() {
      return l();
    },
    set ownerPubkeyHex(ue) {
      l(ue), S();
    },
    get getCurrentPubkeyHex() {
      return c();
    },
    set getCurrentPubkeyHex(ue) {
      c(ue), S();
    },
    get onOpenChange() {
      return u();
    },
    set onOpenChange(ue = void 0) {
      u(ue), S();
    },
    get onImported() {
      return b();
    },
    set onImported(ue = void 0) {
      b(ue), S();
    }
  };
  {
    const ue = (re) => {
      var Ge = Ae(), kt = Z(Ge);
      {
        const vt = (xt, st) => {
          let tn = () => st?.().props;
          {
            let yt = I(() => n()("global.close"));
            ir(xt, no(tn, {
              className: "modal-close",
              shape: "square",
              get ariaLabel() {
                return a(yt);
              },
              children: (Ze, ot) => {
                var It = hg();
                E(Ze, It);
              },
              $$slots: { default: !0 }
            }));
          }
        };
        Le(kt, () => yu, (xt, st) => {
          st(xt, { child: vt, $$slots: { child: !0 } });
        });
      }
      E(re, Ge);
    };
    let Fe = I(() => n()("postHistory.importTitle")), Ue = I(() => n()("postHistory.importDescription"));
    gu(t, {
      onOpenChange: $e,
      get title() {
        return a(Fe);
      },
      get description() {
        return a(Ue);
      },
      contentClass: "post-history-import-dialog",
      footerVariant: "close-button",
      initialFocus: "content",
      get open() {
        return s();
      },
      set open(re) {
        s(re);
      },
      footer: ue,
      children: (re, Ge) => {
        var kt = mg(), vt = Z(kt), xt = T(vt), st = T(xt, !0);
        A(xt);
        var tn = L(xt, 2), yt = T(tn, !0);
        A(tn), A(vt);
        var Ze = L(vt, 2);
        Ro(Ze, (mt) => p(g, mt), () => a(g));
        var ot = L(Ze, 2);
        let It;
        var pt = T(ot);
        {
          let mt = I(() => a(y) || !l()), Ht = I(() => n()("postHistory.importChooseFile"));
          ir(pt, {
            className: "post-history-import-file-button",
            variant: "default",
            shape: "pill",
            get disabled() {
              return a(mt);
            },
            get ariaLabel() {
              return a(Ht);
            },
            onClick: te,
            children: (mn, bn) => {
              var Yt = fg(), Cn = L(Z(Yt), 2), On = T(Cn, !0);
              A(Cn), ge((Yn) => J(On, Yn), [() => n()("postHistory.importChooseFile")]), E(mn, Yt);
            },
            $$slots: { default: !0 }
          });
        }
        var ut = L(pt, 2), $n = T(ut, !0);
        A(ut), A(ot);
        var nn = L(ot, 2);
        {
          var An = (mt) => {
            var Ht = gg(), mn = T(Ht);
            {
              var bn = (fn) => {
                var wn = vg();
                let gr;
                var yr = T(wn, !0);
                A(wn), ge(
                  (Er) => {
                    gr = Ma(wn, 1, "import-progress-status svelte-1qfqhib", null, gr, {
                      "import-progress-status-error": a(x)?.status === "failed"
                    }), J(yr, Er);
                  },
                  [() => n()(a(G))]
                ), E(fn, wn);
              };
              be(mn, (fn) => {
                a(G) && fn(bn);
              });
            }
            var Yt = L(mn, 2), Cn = T(Yt), On = T(Cn), Yn = T(On, !0);
            A(On);
            var hn = L(On, 2), Xe = T(hn);
            A(hn), A(Cn);
            var Gn = L(Cn, 2), bt = T(Gn), St = T(bt, !0);
            A(bt);
            var Ne = L(bt, 2), Dt = T(Ne, !0);
            A(Ne), A(Gn);
            var Rr = L(Gn, 2), pr = T(Rr), dr = T(pr, !0);
            A(pr);
            var Ln = L(pr, 2), _r = T(Ln, !0);
            A(Ln), A(Rr), A(Yt);
            var ua = L(Yt, 2);
            {
              let fn = I(() => n()("postHistory.importProgressBarLabel")), wn = I(() => `${a(ve)}%`);
              Le(ua, () => $h, (gr, yr) => {
                yr(gr, {
                  get value() {
                    return a(ve);
                  },
                  max: 100,
                  get "aria-label"() {
                    return a(fn);
                  },
                  get "aria-valuetext"() {
                    return a(wn);
                  },
                  class: "import-progress-root",
                  children: (Er, zr) => {
                    var Zn = pg();
                    ge((Qr) => Ci(Zn, Qr), [() => se(a(ve))]), E(Er, Zn);
                  },
                  $$slots: { default: !0 }
                });
              });
            }
            A(Ht), ge(
              (fn, wn, gr, yr, Er) => {
                Tn(Ht, "aria-label", fn), J(Yn, wn), J(Xe, `${a(ve) ?? ""}%`), J(St, gr), J(Dt, yr), J(dr, Er), J(_r, a(ae));
              },
              [
                () => n()("postHistory.importProgress"),
                () => n()("postHistory.importProgress"),
                () => n()("postHistory.importElapsedTime"),
                () => fe(a(m)),
                () => n()("postHistory.importEstimatedRemainingTime")
              ]
            ), E(mt, Ht);
          };
          be(nn, (mt) => {
            (a(y) || a(x)) && mt(An);
          });
        }
        var vr = L(nn, 2);
        {
          var Tr = (mt) => {
            var Ht = yg(), mn = T(Ht), bn = T(mn), Yt = T(bn, !0);
            A(bn);
            var Cn = L(bn, 2), On = T(Cn), Yn = T(On), hn = T(Yn, !0);
            A(Yn);
            var Xe = L(Yn), Gn = T(Xe, !0);
            A(Xe), A(On);
            var bt = L(On, 2), St = T(bt), Ne = T(St, !0);
            A(St);
            var Dt = L(St), Rr = T(Dt, !0);
            A(Dt), A(bt);
            var pr = L(bt, 2), dr = T(pr), Ln = T(dr, !0);
            A(dr);
            var _r = L(dr), ua = T(_r, !0);
            A(_r), A(pr);
            var fn = L(pr, 2), wn = T(fn), gr = T(wn, !0);
            A(wn);
            var yr = L(wn), Er = T(yr, !0);
            A(yr), A(fn);
            var zr = L(fn, 2), Zn = T(zr), Qr = T(Zn, !0);
            A(Zn);
            var ha = L(Zn), Ar = T(ha, !0);
            A(ha), A(zr);
            var Wr = L(zr, 2), $a = T(Wr), Mr = T($a, !0);
            A($a);
            var fa = L($a), Is = T(fa, !0);
            A(fa), A(Wr);
            var va = L(Wr, 2), Ia = T(va), ta = T(Ia, !0);
            A(Ia);
            var pa = L(Ia), is = T(pa, !0);
            A(pa), A(va), A(Cn), A(mn);
            var Sa = L(mn, 2), Na = T(Sa), ga = T(Na, !0);
            A(Na);
            var Pn = L(Na, 2), Ba = T(Pn), Or = T(Ba), Ss = T(Or, !0);
            A(Or);
            var Ua = L(Or), qa = T(Ua, !0);
            A(Ua), A(Ba);
            var ya = L(Ba, 2), ma = T(ya), Ra = T(ma, !0);
            A(ma);
            var Va = L(ma), Rs = T(Va, !0);
            A(Va), A(ya);
            var Xn = L(ya, 2), Lr = T(Xn), d = T(Lr, !0);
            A(Lr);
            var C = L(Lr), H = T(C, !0);
            A(C), A(Xn);
            var N = L(Xn, 2), V = T(N), Q = T(V, !0);
            A(V);
            var le = L(V), Te = T(le, !0);
            A(le), A(N);
            var oe = L(N, 2), we = T(oe), _e = T(we, !0);
            A(we);
            var Me = L(we), Oe = T(Me, !0);
            A(Me), A(oe);
            var it = L(oe, 2), lt = T(it), Tt = T(lt, !0);
            A(lt);
            var Be = L(lt), Ye = T(Be, !0);
            A(Be), A(it), A(Pn), A(Sa);
            var qt = L(Sa, 2), rn = T(qt), er = T(rn, !0);
            A(rn);
            var mr = L(rn, 2), Ie = T(mr), je = T(Ie), zt = T(je, !0);
            A(je);
            var xn = L(je), Rt = T(xn, !0);
            A(xn), A(Ie);
            var na = L(Ie, 2), ls = T(na), ja = T(ls, !0);
            A(ls);
            var ba = L(ls), _s = T(ba, !0);
            A(ba), A(na);
            var Ka = L(na, 2), Ya = T(Ka), js = T(Ya, !0);
            A(Ya);
            var Es = L(Ya), io = T(Es, !0);
            A(Es), A(Ka);
            var As = L(Ka, 2), ks = T(As), lo = T(ks, !0);
            A(ks);
            var Ks = L(ks), Ys = T(Ks, !0);
            A(Ks), A(As);
            var ds = L(As, 2), cs = T(ds), co = T(cs, !0);
            A(cs);
            var Ds = L(cs), za = T(Ds, !0);
            A(Ds), A(ds);
            var v = L(ds, 2), P = T(v), k = T(P, !0);
            A(P);
            var K = L(P), z = T(K, !0);
            A(K), A(v);
            var ie = L(v, 2), he = T(ie), qe = T(he, !0);
            A(he);
            var Ve = L(he), et = T(Ve, !0);
            A(Ve), A(ie), A(mr), A(qt), A(Ht), ge(
              ($t, Nn, cr, Ct, ln, Ca, ra, Qa, Fr, _a, Wa, zs, us, Uo, Hr, h, B, Ce, Pe, Qe, an, vn, _t) => {
                J(Yt, $t), J(hn, Nn), J(Gn, a(x).nonEmptyLineCount), J(Ne, cr), J(Rr, a(x).fileDuplicateCount), J(Ln, Ct), J(ua, a(x).otherAccountCount), J(gr, ln), J(Er, a(x).unsupportedKindCount), J(Qr, Ca), J(Ar, a(x).invalidJsonCount), J(Mr, ra), J(Is, a(x).invalidStructureCount), J(ta, Qa), J(is, a(x).invalidIdOrSignatureCount), J(ga, Fr), J(Ss, _a), J(qa, a(x).uniquePostEventCount), J(Ra, Wa), J(Rs, a(x).insertedPostCount), J(d, zs), J(H, a(x).updatedPostCount), J(Q, us), J(Te, a(x).unchangedPostCount), J(_e, Uo), J(Oe, a(x).failedPostEventCount), J(Tt, Hr), J(Ye, a(x).appliedDeletionPostCount), J(er, h), J(zt, B), J(Rt, a(x).uniqueDeletionEventCount), J(ja, Ce), J(_s, a(x).validDeletionETagCount), J(js, Pe), J(io, a(x).insertedDeletionRequestCount), J(lo, Qe), J(Ys, a(x).updatedDeletionRequestCount), J(co, an), J(za, a(x).unchangedDeletionRequestCount), J(k, vn), J(z, a(x).unsupportedDeletionEventCount), J(qe, _t), J(et, a(x).failedDeletionEventCount);
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
            ), E(mt, Ht);
          };
          be(vr, (mt) => {
            a(x) && mt(Tr);
          });
        }
        ge(
          (mt, Ht, mn, bn) => {
            J(st, mt), J(yt, Ht), Tn(Ze, "aria-label", mn), It = Ma(ot, 1, "import-drop-zone svelte-1qfqhib", null, It, { "import-drop-zone-active": a(i) > 0 }), J($n, bn);
          },
          [
            () => n()("postHistory.importTitle"),
            () => n()("postHistory.importDescription"),
            () => n()("postHistory.importChooseFile"),
            () => a(i) > 0 ? n()("postHistory.importDropActive") : n()("postHistory.importDropHint")
          ]
        ), ni("change", Ze, De), _o("dragenter", ot, F), _o("dragover", ot, U), _o("dragleave", ot, ce), _o("drop", ot, pe), E(re, kt);
      },
      $$slots: { footer: !0, default: !0 }
    });
  }
  var rt = Lt(nt);
  return o(), rt;
}
vu(["change"]);
Ft(
  ch,
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
var Cg = j('<span class="post-preview-replies-badge svelte-11vk23d" aria-hidden="true"> </span>'), wg = j("<!> <!>", 1);
const Pg = {
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
function xd(t, e) {
  Ot(e, !0), Ha(t, Pg);
  let n = _(e, "count", 7), r = _(e, "selected", 7), o = _(e, "ariaLabel", 7), s = _(e, "onClick", 7), l = _(e, "tooltipContent", 23, o);
  const c = pu().overlayTarget;
  var u = {
    get count() {
      return n();
    },
    set count(y) {
      n(y), S();
    },
    get selected() {
      return r();
    },
    set selected(y) {
      r(y), S();
    },
    get ariaLabel() {
      return o();
    },
    set ariaLabel(y) {
      o(y), S();
    },
    get onClick() {
      return s();
    },
    set onClick(y) {
      s(y), S();
    },
    get tooltipContent() {
      return l();
    },
    set tooltipContent(y = o) {
      l(y), S();
    }
  }, b = Ae(), g = Z(b);
  return Le(g, () => qh, (y, x) => {
    x(y, {
      children: (f, R) => {
        var w = Ae(), m = Z(w);
        Le(m, () => Nh, (i, O) => {
          O(i, {
            delayDuration: 500,
            children: (W, $) => {
              var X = wg(), me = Z(X);
              {
                const ee = (ve, Re) => {
                  let ae = () => Re?.().props;
                  const fe = I(() => {
                    const { onclick: ne, ...ke } = ae();
                    return { tooltipOnclick: ne, restProps: ke };
                  });
                  ir(ve, no(
                    {
                      type: "button",
                      class: "post-preview-replies-badge-button",
                      get ariaLabel() {
                        return o();
                      },
                      contentLayout: "icon",
                      shape: "circle",
                      get selected() {
                        return r();
                      },
                      onClick: (ne) => {
                        s()(), typeof a(fe).tooltipOnclick == "function" && a(fe).tooltipOnclick(ne);
                      }
                    },
                    () => a(fe).restProps,
                    {
                      children: (ne, ke) => {
                        var He = Cg(), xe = T(He, !0);
                        A(He), ge(() => J(xe, n())), E(ne, He);
                      },
                      $$slots: { default: !0 }
                    }
                  ));
                };
                Le(me, () => Bh, (ve, Re) => {
                  Re(ve, { child: ee, $$slots: { child: !0 } });
                });
              }
              var D = L(me, 2);
              Le(D, () => Xo, (ee, ve) => {
                ve(ee, {
                  get to() {
                    return c;
                  },
                  children: (Re, ae) => {
                    var fe = Ae(), ne = Z(fe);
                    Le(ne, () => Uh, (ke, He) => {
                      He(ke, {
                        sideOffset: 8,
                        class: "tooltip-content post-preview-tooltip-content",
                        children: (xe, se) => {
                          $s();
                          var G = ss();
                          ge(() => J(G, l())), E(xe, G);
                        },
                        $$slots: { default: !0 }
                      });
                    }), E(Re, fe);
                  },
                  $$slots: { default: !0 }
                });
              }), E(W, X);
            },
            $$slots: { default: !0 }
          });
        }), E(f, w);
      },
      $$slots: { default: !0 }
    });
  }), E(t, b), Lt(u);
}
Ft(
  xd,
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
var xg = j('<span class="post-history-thread-toggle-spinner post-history-thread-action-spinner svelte-cenxtw" aria-hidden="true"></span>'), Ig = j('<span class="post-history-thread-toggle-icon-wrapper svelte-cenxtw" aria-hidden="true"><span></span></span>');
const Sg = {
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
function Id(t, e) {
  Ot(e, !0), Ha(t, Sg);
  let n = _(e, "expanded", 7), r = _(e, "ariaLabel", 7), o = _(e, "title", 23, r), s = _(e, "loading", 7, !1), l = _(e, "onClick", 7), c = I(() => [s() ? "is-loading" : ""].filter(Boolean).join(" "));
  var u = {
    get expanded() {
      return n();
    },
    set expanded(b) {
      n(b), S();
    },
    get ariaLabel() {
      return r();
    },
    set ariaLabel(b) {
      r(b), S();
    },
    get title() {
      return o();
    },
    set title(b = r) {
      o(b), S();
    },
    get loading() {
      return s();
    },
    set loading(b = !1) {
      s(b), S();
    },
    get onClick() {
      return l();
    },
    set onClick(b) {
      l(b), S();
    }
  };
  {
    let b = I(() => `post-history-thread-toggle-button ${a(c)}`.trim());
    ir(t, {
      type: "button",
      get className() {
        return a(b);
      },
      get ariaLabel() {
        return r();
      },
      get title() {
        return o();
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
        return l();
      },
      children: (g, y) => {
        var x = Ae(), f = Z(x);
        {
          var R = (m) => {
            var i = xg();
            E(m, i);
          }, w = (m) => {
            var i = Ig(), O = T(i);
            A(i), ge(() => Ma(
              O,
              1,
              `post-history-thread-toggle-icon ${n() ? "post-history-thread-toggle-icon-collapse" : "post-history-thread-toggle-icon-arrow-top-right"} svg-icon`,
              "svelte-cenxtw"
            )), E(m, i);
          };
          be(f, (m) => {
            s() ? m(R) : m(w, -1);
          });
        }
        E(g, x);
      },
      $$slots: { default: !0 }
    });
  }
  return Lt(u);
}
Ft(
  Id,
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
var Rg = j("<span> </span>");
const _g = {
  hash: "svelte-1uufmpv",
  code: ".post-history-status-pill.svelte-1uufmpv {display:inline-flex;align-items:center;justify-content:center;min-height:18px;padding:0 8px;border:1px solid color-mix(in srgb, currentColor 18%, transparent);border-radius:999px;background:color-mix(in srgb, currentColor 8%, transparent);font-size:0.72rem;line-height:1;white-space:nowrap;}.post-history-status-pill-muted.svelte-1uufmpv {color:var(--text-muted, currentColor);}.post-history-status-pill-danger.svelte-1uufmpv {color:var(--destructive-fg, currentColor);}"
};
function uh(t, e) {
  Ot(e, !0), Ha(t, _g);
  let n = _(e, "label", 7), r = _(e, "tone", 7), o = _(e, "className", 7, "");
  var s = {
    get label() {
      return n();
    },
    set label(u) {
      n(u), S();
    },
    get tone() {
      return r();
    },
    set tone(u) {
      r(u), S();
    },
    get className() {
      return o();
    },
    set className(u = "") {
      o(u), S();
    }
  }, l = Rg(), c = T(l, !0);
  return A(l), ge(
    (u) => {
      Ma(l, 1, u, "svelte-1uufmpv"), Tn(l, "aria-label", n()), Tn(l, "title", n()), J(c, n());
    },
    [
      () => Vh(`post-history-status-pill post-history-status-pill-${r()} ${o()}`.trim())
    ]
  ), E(t, l), Lt(s);
}
Ft(uh, { label: {}, tone: {}, className: {} }, [], [], { mode: "open" });
function hh(t, e) {
  Ot(e, !0);
  const n = () => bs(qs, "$_", r), [r, o] = Us();
  let s = _(e, "eventId", 7), l = I(() => {
    if (s())
      return jh[s()];
  });
  function c(R) {
    return R === "pending" || R === "processing" ? n()("postHistory.deleteSending") : R === "failed" ? n()("postHistory.deleteFailed") : null;
  }
  let u = I(() => c(a(l)));
  var b = {
    get eventId() {
      return s();
    },
    set eventId(R) {
      s(R), S();
    }
  }, g = Ae(), y = Z(g);
  {
    var x = (R) => {
      {
        let w = I(() => a(l) === "failed" ? "danger" : "muted"), m = I(() => `post-history-deletion-lifecycle-status ${a(l) ?? ""}`.trim());
        uh(R, {
          get label() {
            return a(u);
          },
          get tone() {
            return a(w);
          },
          get className() {
            return a(m);
          }
        });
      }
    };
    be(y, (R) => {
      a(u) && R(x);
    });
  }
  E(t, g);
  var f = Lt(b);
  return o(), f;
}
Ft(hh, { eventId: {} }, [], [], { mode: "open" });
function fh(t, e) {
  Ot(e, !0);
  let n = _(e, "node", 7), r = _(e, "model", 7, void 0), o = _(e, "emojiLoadStateByUrl", 23, () => ({})), s = _(e, "emojiImageMetaByUrl", 23, () => ({})), l = _(e, "scrollRoot", 7, null), c = _(e, "onImageOpen", 7, void 0), u = _(e, "topActions", 7, void 0), b = _(e, "footerLeftExtras", 7, void 0), g = _(e, "footerActions", 7, void 0), y = _(e, "footerMenu", 7, void 0);
  var x = {
    get node() {
      return n();
    },
    set node(f) {
      n(f), S();
    },
    get model() {
      return r();
    },
    set model(f = void 0) {
      r(f), S();
    },
    get emojiLoadStateByUrl() {
      return o();
    },
    set emojiLoadStateByUrl(f = {}) {
      o(f), S();
    },
    get emojiImageMetaByUrl() {
      return s();
    },
    set emojiImageMetaByUrl(f = {}) {
      s(f), S();
    },
    get scrollRoot() {
      return l();
    },
    set scrollRoot(f = null) {
      l(f), S();
    },
    get onImageOpen() {
      return c();
    },
    set onImageOpen(f = void 0) {
      c(f), S();
    },
    get topActions() {
      return u();
    },
    set topActions(f = void 0) {
      u(f), S();
    },
    get footerLeftExtras() {
      return b();
    },
    set footerLeftExtras(f = void 0) {
      b(f), S();
    },
    get footerActions() {
      return g();
    },
    set footerActions(f = void 0) {
      g(f), S();
    },
    get footerMenu() {
      return y();
    },
    set footerMenu(f = void 0) {
      y(f), S();
    }
  };
  return Pd(t, {
    get event() {
      return n().event;
    },
    get profile() {
      return n().profile;
    },
    get model() {
      return r();
    },
    get emojiLoadStateByUrl() {
      return o();
    },
    get emojiImageMetaByUrl() {
      return s();
    },
    get scrollRoot() {
      return l();
    },
    get onImageOpen() {
      return c();
    },
    get topActions() {
      return u();
    },
    get footerLeftExtras() {
      return b();
    },
    get footerActions() {
      return g();
    },
    get footerMenu() {
      return y();
    }
  }), Lt(x);
}
Ft(
  fh,
  {
    node: {},
    model: {},
    emojiLoadStateByUrl: {},
    emojiImageMetaByUrl: {},
    scrollRoot: {},
    onImageOpen: {},
    topActions: {},
    footerLeftExtras: {},
    footerActions: {},
    footerMenu: {}
  },
  [],
  [],
  { mode: "open" }
);
const Eg = 5, Ag = 0.5, kg = 2.5;
function En(t, e) {
  return `${t}:${e}`;
}
function Dg(t) {
  return t < 0 ? Math.max(
    0,
    Eg + t
  ) : t;
}
function vh(t) {
  return Math.min(
    Dg(t) * Ag,
    kg
  );
}
function Ji() {
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
function wl(t) {
  return tu(t.rawEvent, t) ? Al(t.rawEvent) : {
    id: t.eventId,
    pubkey: t.pubkeyHex,
    kind: t.kind,
    content: t.content,
    tags: t.tags.map((e) => [...e]),
    created_at: t.createdAt,
    sig: ""
  };
}
function Eo(t) {
  const e = {
    id: t.eventId,
    pubkey: t.authorPubkey,
    kind: t.kind,
    content: t.content,
    tags: t.tags.map((n) => [...n]),
    created_at: t.createdAt,
    sig: ""
  };
  return wi(t.rawEvent) && t.rawEvent.id === e.id && t.rawEvent.pubkey === e.pubkey && t.rawEvent.kind === e.kind && t.rawEvent.content === e.content && t.rawEvent.created_at === e.created_at && JSON.stringify(t.rawEvent.tags) === JSON.stringify(e.tags) ? Al(t.rawEvent) : e;
}
function mo(t) {
  const e = ns(t.event);
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
function bo(t, e) {
  if (!t)
    return e;
  const n = Array.from(/* @__PURE__ */ new Set([
    ...t.relayUrls,
    ...e.relayUrls
  ])).sort((o, s) => o.localeCompare(s)), r = Array.from(/* @__PURE__ */ new Set([
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
    sources: r
  };
}
function oc(t, e) {
  return [...t].sort((n, r) => {
    const o = e[n]?.event, s = e[r]?.event;
    return !o || !s ? n.localeCompare(r) : o.created_at !== s.created_at ? o.created_at - s.created_at : o.id.localeCompare(s.id);
  });
}
var Tg = j('<span class="post-history-context-deleted-label svelte-1kez5et"> </span>'), Mg = j('<p class="post-history-context-message svelte-1kez5et"> </p>'), Og = j('<p class="post-history-context-message post-history-context-error svelte-1kez5et"> </p> <!>', 1), Lg = j('<div class="post-history-thread-node-parent svelte-1kez5et"><!></div>'), Fg = j('<div class="post-history-thread-node-top-actions"><!></div>'), Hg = j('<div class="post-preview-footer-replies-slot"><!></div>'), $g = j('<div class="open-in-new-icon svg-icon" aria-hidden="true"></div> <span> </span>', 1), Ng = j("<!> <!>", 1), Bg = j('<div aria-hidden="true"></div> <span> </span>', 1), Ug = j("<!> <!> <!>", 1), qg = j('<div class="post-history-thread-node-children svelte-1kez5et"></div>'), Vg = j('<div class="post-history-thread-node-view svelte-1kez5et"><!> <div class="post-history-thread-node-anchor svelte-1kez5et"><!></div> <!></div>');
const jg = {
  hash: "svelte-1kez5et",
  code: `.post-history-thread-node-view.svelte-1kez5et {display:grid;gap:1px;}.post-history-thread-node-parent.svelte-1kez5et,
    .post-history-thread-node-children.svelte-1kez5et {display:grid;gap:2px;}.post-history-thread-node-parent.svelte-1kez5et {padding-inline-start:0;}.post-history-thread-node-anchor.svelte-1kez5et {display:grid;margin-inline-start:var(--thread-context-indent);}.post-history-thread-node-children.svelte-1kez5et {padding-inline-start:0;}.post-history-context-button {min-height:28px;padding:2px 6px;color:var(--text-muted);background:var(--btn-bg);font-size:0.82rem;}.post-history-context-message.svelte-1kez5et {margin:0;color:var(--text-muted);font-size:0.82rem;}.post-history-context-deleted-label.svelte-1kez5et {width:fit-content;min-height:28px;padding:2px 6px;color:var(--text-muted);background-color:transparent;border:1px solid var(--btn-border);font-size:0.82rem;font-weight:normal;cursor:default;user-select:none;display:flex;align-items:center;}.post-history-context-error.svelte-1kez5et {color:var(--danger);}`
};
function Xs(t, e) {
  Ot(e, !0), Ha(t, jg);
  const n = () => bs(qs, "$_", r), [r, o] = Us();
  let s = _(e, "state", 7), l = _(e, "previewModelByEventId", 23, () => ({})), c = _(e, "emojiLoadStateByUrl", 23, () => ({})), u = _(e, "emojiImageMetaByUrl", 23, () => ({})), b = _(e, "scrollRoot", 7, null), g = _(e, "onImageOpen", 7, void 0), y = _(e, "onToggleParent", 7, void 0), x = _(e, "onRetryParent", 7, void 0), f = _(e, "onToggleChildren", 7, void 0), R = _(e, "onRetryChildren", 7, void 0), w = _(e, "onCopyPointerDown", 7, void 0), m = _(e, "onCopyNevent", 7, void 0), i = _(e, "externalClientLabel", 7, void 0), O = _(e, "onOpenExternalClient", 7, void 0), W = _(e, "isCopyFailed", 7, void 0), $ = _(e, "onShowRawJson", 7, void 0), X = _(e, "onBroadcastPointerDown", 7, void 0), me = _(e, "onBroadcastPost", 7, void 0), D = _(e, "isBroadcastSending", 7, void 0), ee = _(e, "canDeleteNodePost", 7, void 0), ve = _(e, "isDeletionSending", 7, void 0), Re = _(e, "onOpenDeleteConfirm", 7, void 0), ae = I(() => ei(s().node.event.created_at * 1e3)), fe = I(() => `${vh(s().depthFromAnchor)}rem`), ne = I(() => s().repliesActionState.status === "loaded" && s().repliesActionState.replyCount > 0), ke = I(() => W()?.(s().node.eventId) ?? !1), He = I(() => D()?.(s().node.eventId) ?? !1), xe = I(() => ee()?.(s()) ?? !1), se = I(() => ve()?.(s().node.eventId) ?? !1);
  function G() {
    const re = s().repliesActionState;
    if (re.status === "loading")
      return n()("postHistory.checkingReplies");
    if (re.status === "failed")
      return n()("postHistory.recheckReplies");
    if (re.status === "loaded") {
      const Ge = re.replyCount;
      return Ge === 0 ? n()("postHistory.recheckReplies") : re.visible ? n()("postHistory.hideReplies") : n()("postHistory.showRepliesWithCount", { values: { count: Ge } });
    }
    return n()("postHistory.checkReplies");
  }
  function de() {
    const re = s().repliesActionState;
    if (re.status === "failed" || re.status === "loaded" && re.replyCount === 0) {
      R()?.(s().node.eventId);
      return;
    }
    f()?.(s().node.eventId);
  }
  function Se(re) {
    w()?.(s(), re);
  }
  function $e(re) {
    m()?.(s(), re);
  }
  function te() {
    $()?.(s());
  }
  function M(re) {
    X()?.(s(), re);
  }
  function F(re) {
    me()?.(s(), re);
  }
  function U() {
    Re()?.(s());
  }
  var ce = {
    get state() {
      return s();
    },
    set state(re) {
      s(re), S();
    },
    get previewModelByEventId() {
      return l();
    },
    set previewModelByEventId(re = {}) {
      l(re), S();
    },
    get emojiLoadStateByUrl() {
      return c();
    },
    set emojiLoadStateByUrl(re = {}) {
      c(re), S();
    },
    get emojiImageMetaByUrl() {
      return u();
    },
    set emojiImageMetaByUrl(re = {}) {
      u(re), S();
    },
    get scrollRoot() {
      return b();
    },
    set scrollRoot(re = null) {
      b(re), S();
    },
    get onImageOpen() {
      return g();
    },
    set onImageOpen(re = void 0) {
      g(re), S();
    },
    get onToggleParent() {
      return y();
    },
    set onToggleParent(re = void 0) {
      y(re), S();
    },
    get onRetryParent() {
      return x();
    },
    set onRetryParent(re = void 0) {
      x(re), S();
    },
    get onToggleChildren() {
      return f();
    },
    set onToggleChildren(re = void 0) {
      f(re), S();
    },
    get onRetryChildren() {
      return R();
    },
    set onRetryChildren(re = void 0) {
      R(re), S();
    },
    get onCopyPointerDown() {
      return w();
    },
    set onCopyPointerDown(re = void 0) {
      w(re), S();
    },
    get onCopyNevent() {
      return m();
    },
    set onCopyNevent(re = void 0) {
      m(re), S();
    },
    get externalClientLabel() {
      return i();
    },
    set externalClientLabel(re = void 0) {
      i(re), S();
    },
    get onOpenExternalClient() {
      return O();
    },
    set onOpenExternalClient(re = void 0) {
      O(re), S();
    },
    get isCopyFailed() {
      return W();
    },
    set isCopyFailed(re = void 0) {
      W(re), S();
    },
    get onShowRawJson() {
      return $();
    },
    set onShowRawJson(re = void 0) {
      $(re), S();
    },
    get onBroadcastPointerDown() {
      return X();
    },
    set onBroadcastPointerDown(re = void 0) {
      X(re), S();
    },
    get onBroadcastPost() {
      return me();
    },
    set onBroadcastPost(re = void 0) {
      me(re), S();
    },
    get isBroadcastSending() {
      return D();
    },
    set isBroadcastSending(re = void 0) {
      D(re), S();
    },
    get canDeleteNodePost() {
      return ee();
    },
    set canDeleteNodePost(re = void 0) {
      ee(re), S();
    },
    get isDeletionSending() {
      return ve();
    },
    set isDeletionSending(re = void 0) {
      ve(re), S();
    },
    get onOpenDeleteConfirm() {
      return Re();
    },
    set onOpenDeleteConfirm(re = void 0) {
      Re(re), S();
    }
  }, pe = Vg(), q = T(pe);
  {
    var De = (re) => {
      var Ge = Lg(), kt = T(Ge);
      {
        var vt = (yt) => {
          Xs(yt, {
            get state() {
              return s().parentNodeState;
            },
            get previewModelByEventId() {
              return l();
            },
            get emojiLoadStateByUrl() {
              return c();
            },
            get emojiImageMetaByUrl() {
              return u();
            },
            get scrollRoot() {
              return b();
            },
            get onImageOpen() {
              return g();
            },
            get onToggleParent() {
              return y();
            },
            get onRetryParent() {
              return x();
            },
            get onToggleChildren() {
              return f();
            },
            get onRetryChildren() {
              return R();
            },
            get onCopyPointerDown() {
              return w();
            },
            get onCopyNevent() {
              return m();
            },
            get externalClientLabel() {
              return i();
            },
            get onOpenExternalClient() {
              return O();
            },
            get isCopyFailed() {
              return W();
            },
            get onShowRawJson() {
              return $();
            },
            get onBroadcastPointerDown() {
              return X();
            },
            get onBroadcastPost() {
              return me();
            },
            get isBroadcastSending() {
              return D();
            },
            get canDeleteNodePost() {
              return ee();
            },
            get isDeletionSending() {
              return ve();
            },
            get onOpenDeleteConfirm() {
              return Re();
            }
          });
        }, xt = (yt) => {
          var Ze = Tg(), ot = T(Ze, !0);
          A(Ze), ge((It) => J(ot, It), [() => n()("postHistory.replyTargetDeleted")]), E(yt, Ze);
        }, st = (yt) => {
          var Ze = Mg(), ot = T(Ze, !0);
          A(Ze), ge((It) => J(ot, It), [() => n()("postHistory.contextNotFound")]), E(yt, Ze);
        }, tn = (yt) => {
          var Ze = Og(), ot = Z(Ze), It = T(ot, !0);
          A(ot);
          var pt = L(ot, 2);
          ir(pt, {
            type: "button",
            className: "post-history-context-button post-history-context-retry-button",
            onClick: () => x()?.(s().node.eventId),
            children: (ut, $n) => {
              $s();
              var nn = ss();
              ge((An) => J(nn, An), [() => n()("postHistory.contextRetry")]), E(ut, nn);
            },
            $$slots: { default: !0 }
          }), ge((ut) => J(It, ut), [() => n()("postHistory.contextFetchFailed")]), E(yt, Ze);
        };
        be(kt, (yt) => {
          s().parentExpansion.visibleParent && s().parentNodeState ? yt(vt) : s().parentExpansion.visibleParent && s().parentExpansion.parentDeleted ? yt(xt, 1) : s().parentExpansion.visibleParent && s().parentExpansion.parentMissing ? yt(st, 2) : s().parentExpansion.visibleParent && s().parentExpansion.parentError && yt(tn, 3);
        });
      }
      A(Ge), E(re, Ge);
    };
    be(q, (re) => {
      s().parentTargetId && re(De);
    });
  }
  var nt = L(q, 2), rt = T(nt);
  fh(rt, {
    get node() {
      return s().node;
    },
    get model() {
      return l()[s().node.eventId];
    },
    get emojiLoadStateByUrl() {
      return c();
    },
    get emojiImageMetaByUrl() {
      return u();
    },
    get scrollRoot() {
      return b();
    },
    get onImageOpen() {
      return g();
    },
    topActions: (xt) => {
      var st = Ae(), tn = Z(st);
      {
        var yt = (Ze) => {
          var ot = Fg(), It = T(ot);
          {
            let pt = I(() => s().parentExpansion.visibleParent ? n()("postHistory.hideReplyTarget") : n()("postHistory.showReplyTarget")), ut = I(() => s().parentExpansion.visibleParent ? n()("postHistory.hideReplyTarget") : n()("postHistory.showReplyTarget")), $n = I(() => s().parentExpansion.visibleParent && s().parentExpansion.showParentLoadingIndicator);
            Id(It, {
              get ariaLabel() {
                return a(pt);
              },
              get title() {
                return a(ut);
              },
              get expanded() {
                return s().parentExpansion.visibleParent;
              },
              get loading() {
                return a($n);
              },
              onClick: () => y()?.(s().node.eventId)
            });
          }
          A(ot), E(Ze, ot);
        };
        be(tn, (Ze) => {
          s().parentTargetId && !s().parentAlreadyInPath && !(s().parentExpansion.visibleParent && s().parentExpansion.parentDeleted) && Ze(yt);
        });
      }
      E(xt, st);
    },
    footerLeftExtras: (xt) => {
      hh(xt, {
        get eventId() {
          return s().node.eventId;
        }
      });
    },
    footerActions: (xt) => {
      var st = Hg(), tn = T(st);
      {
        var yt = (Ze) => {
          {
            let ot = I(G), It = I(G);
            xd(Ze, {
              get count() {
                return s().repliesActionState.replyCount;
              },
              get selected() {
                return s().repliesActionState.visible;
              },
              get ariaLabel() {
                return a(ot);
              },
              get tooltipContent() {
                return a(It);
              },
              onClick: de
            });
          }
        };
        be(tn, (Ze) => {
          a(ne) && Ze(yt);
        });
      }
      A(st), E(xt, st);
    },
    footerMenu: (xt) => {
      const st = I(() => n()("common.showActions"));
      gl(xt, {
        get triggerAriaLabel() {
          return a(st);
        },
        get tooltipContent() {
          return a(st);
        },
        enableTooltip: !0,
        get timestamp() {
          return a(ae);
        },
        items: (yt) => {
          var Ze = Ug(), ot = Z(Ze);
          {
            var It = ($n) => {
              var nn = Ng(), An = Z(nn);
              Le(An, () => Jn, (Tr, mt) => {
                mt(Tr, {
                  class: "menu-action-button",
                  onSelect: () => O()?.(s()),
                  children: (Ht, mn) => {
                    var bn = $g(), Yt = L(Z(bn), 2), Cn = T(Yt, !0);
                    A(Yt), ge(() => J(Cn, i())), E(Ht, bn);
                  },
                  $$slots: { default: !0 }
                });
              });
              var vr = L(An, 2);
              Le(vr, () => ts, (Tr, mt) => {
                mt(Tr, { class: "post-history-menu-separator" });
              }), E($n, nn);
            };
            be(ot, ($n) => {
              i() && O() && $n(It);
            });
          }
          var pt = L(ot, 2);
          {
            let $n = I(() => s().repliesActionState.status === "loading");
            Le(pt, () => Jn, (nn, An) => {
              An(nn, {
                class: "menu-action-button",
                get disabled() {
                  return a($n);
                },
                onSelect: de,
                children: (vr, Tr) => {
                  var mt = Bg(), Ht = Z(mt), mn = L(Ht, 2), bn = T(mn, !0);
                  A(mn), ge(
                    (Yt) => {
                      Ma(Ht, 1, `${s().repliesActionState.visible ? "collapse-content-icon" : "find_in_page-icon"} svg-icon`, "svelte-1kez5et"), J(bn, Yt);
                    },
                    [() => G()]
                  ), E(vr, mt);
                },
                $$slots: { default: !0 }
              });
            });
          }
          var ut = L(pt, 2);
          Do(ut, {
            order: "raw-json-first",
            get copyFailed() {
              return a(ke);
            },
            showBroadcast: !0,
            get broadcastSending() {
              return a(He);
            },
            get showDelete() {
              return a(xe);
            },
            showDeleteSeparator: !0,
            get deletionSending() {
              return a(se);
            },
            onCopyPointerDown: Se,
            onCopyNevent: $e,
            onShowRawJson: te,
            onBroadcastPointerDown: M,
            onBroadcastPost: F,
            onOpenDeleteConfirm: U
          }), E(yt, Ze);
        },
        $$slots: { items: !0 }
      });
    },
    $$slots: {
      topActions: !0,
      footerLeftExtras: !0,
      footerActions: !0,
      footerMenu: !0
    }
  }), A(nt);
  var ue = L(nt, 2);
  {
    var Fe = (re) => {
      var Ge = qg();
      Pa(Ge, 21, () => s().replyNodeStates, (kt) => kt.node.eventId, (kt, vt) => {
        Xs(kt, {
          get state() {
            return a(vt);
          },
          get previewModelByEventId() {
            return l();
          },
          get emojiLoadStateByUrl() {
            return c();
          },
          get emojiImageMetaByUrl() {
            return u();
          },
          get scrollRoot() {
            return b();
          },
          get onImageOpen() {
            return g();
          },
          get onToggleParent() {
            return y();
          },
          get onRetryParent() {
            return x();
          },
          get onToggleChildren() {
            return f();
          },
          get onRetryChildren() {
            return R();
          },
          get onCopyPointerDown() {
            return w();
          },
          get onCopyNevent() {
            return m();
          },
          get externalClientLabel() {
            return i();
          },
          get onOpenExternalClient() {
            return O();
          },
          get isCopyFailed() {
            return W();
          },
          get onShowRawJson() {
            return $();
          },
          get onBroadcastPointerDown() {
            return X();
          },
          get onBroadcastPost() {
            return me();
          },
          get isBroadcastSending() {
            return D();
          },
          get canDeleteNodePost() {
            return ee();
          },
          get isDeletionSending() {
            return ve();
          },
          get onOpenDeleteConfirm() {
            return Re();
          }
        });
      }), A(Ge), E(re, Ge);
    };
    be(ue, (re) => {
      s().repliesActionState.visible && s().replyNodeStates.length > 0 && re(Fe);
    });
  }
  A(pe), ge(() => {
    Ci(pe, `--thread-context-indent: ${a(fe)}`), Tn(nt, "data-post-history-thread-anchor-scope-id", s().anchorEventId), Tn(nt, "data-post-history-thread-anchor-event-id", s().node.eventId);
  }), E(t, pe);
  var Ue = Lt(ce);
  return o(), Ue;
}
Ft(
  Xs,
  {
    state: {},
    previewModelByEventId: {},
    emojiLoadStateByUrl: {},
    emojiImageMetaByUrl: {},
    scrollRoot: {},
    onImageOpen: {},
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
var Kg = j('<span class="post-history-context-deleted-label post-history-thread-direct-parent-context svelte-nb00ha"> </span>'), Yg = j('<p class="post-history-context-message post-history-thread-direct-parent-context svelte-nb00ha"> </p>'), zg = j('<p class="post-history-context-message post-history-context-error post-history-thread-direct-parent-context svelte-nb00ha"> </p> <!>', 1), Qg = j('<div class="post-history-thread-parent-panel svelte-nb00ha"><!> <div class="post-history-context-actions svelte-nb00ha"><!></div></div>'), Wg = j('<div class="post-history-thread-replies-panel svelte-nb00ha"><div class="post-history-thread-replies-list svelte-nb00ha"></div></div>');
const Jg = {
  hash: "svelte-nb00ha",
  code: `.post-history-thread-parent-panel.svelte-nb00ha,
    .post-history-thread-replies-panel.svelte-nb00ha {display:grid;gap:6px;}.post-history-thread-parent-panel.svelte-nb00ha {padding-bottom:4px;}.post-history-thread-replies-list.svelte-nb00ha {display:grid;}.post-history-context-actions.svelte-nb00ha {display:flex;flex-wrap:wrap;gap:6px;}.post-history-thread-direct-parent-context {margin-inline-start:var(--thread-direct-parent-indent);}.post-history-context-button {min-height:28px;padding:2px 6px;color:var(--text-muted);background:transparent;font-size:0.82rem;}

    @media (hover: hover) and (pointer: fine) {.post-history-context-button:hover:not(:disabled) {color:var(--theme);background:color-mix(in srgb, var(--theme) 10%, transparent);}
    }.post-history-context-message.svelte-nb00ha {margin:0;color:var(--text-muted);font-size:0.82rem;}.post-history-context-deleted-label.svelte-nb00ha {width:fit-content;min-height:28px;padding:2px 6px;color:var(--text-muted);background-color:transparent;border:1px solid var(--btn-border);font-size:0.82rem;font-weight:normal;cursor:default;user-select:none;display:flex;align-items:center;}.post-history-context-error.svelte-nb00ha {color:var(--danger);}`
};
function Pl(t, e) {
  Ot(e, !0), Ha(t, Jg);
  const n = () => bs(qs, "$_", r), [r, o] = Us();
  let s = _(e, "state", 7), l = _(e, "section", 7), c = _(e, "previewModelByEventId", 23, () => ({})), u = _(e, "emojiLoadStateByUrl", 23, () => ({})), b = _(e, "emojiImageMetaByUrl", 23, () => ({})), g = _(e, "scrollRoot", 7, null), y = _(e, "onImageOpen", 7, void 0), x = _(e, "onToggleParent", 7, void 0), f = _(e, "onRetryParent", 7, void 0), R = _(e, "onToggleNodeParent", 7, void 0), w = _(e, "onRetryNodeParent", 7, void 0), m = _(e, "onToggleNodeChildren", 7, void 0), i = _(e, "onRetryNodeChildren", 7, void 0), O = _(e, "onCopyPointerDown", 7, void 0), W = _(e, "onCopyNevent", 7, void 0), $ = _(e, "externalClientLabel", 7, void 0), X = _(e, "onOpenExternalClient", 7, void 0), me = _(e, "isCopyFailed", 7, void 0), D = _(e, "onShowRawJson", 7, void 0), ee = _(e, "onBroadcastPointerDown", 7, void 0), ve = _(e, "onBroadcastPost", 7, void 0), Re = _(e, "isBroadcastSending", 7, void 0), ae = _(e, "canDeleteNodePost", 7, void 0), fe = _(e, "isDeletionSending", 7, void 0), ne = _(e, "onOpenDeleteConfirm", 7, void 0);
  const ke = `${vh(-1)}rem`;
  let He = I(() => s().parentNode ? {
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
  var xe = {
    get state() {
      return s();
    },
    set state(te) {
      s(te), S();
    },
    get section() {
      return l();
    },
    set section(te) {
      l(te), S();
    },
    get previewModelByEventId() {
      return c();
    },
    set previewModelByEventId(te = {}) {
      c(te), S();
    },
    get emojiLoadStateByUrl() {
      return u();
    },
    set emojiLoadStateByUrl(te = {}) {
      u(te), S();
    },
    get emojiImageMetaByUrl() {
      return b();
    },
    set emojiImageMetaByUrl(te = {}) {
      b(te), S();
    },
    get scrollRoot() {
      return g();
    },
    set scrollRoot(te = null) {
      g(te), S();
    },
    get onImageOpen() {
      return y();
    },
    set onImageOpen(te = void 0) {
      y(te), S();
    },
    get onToggleParent() {
      return x();
    },
    set onToggleParent(te = void 0) {
      x(te), S();
    },
    get onRetryParent() {
      return f();
    },
    set onRetryParent(te = void 0) {
      f(te), S();
    },
    get onToggleNodeParent() {
      return R();
    },
    set onToggleNodeParent(te = void 0) {
      R(te), S();
    },
    get onRetryNodeParent() {
      return w();
    },
    set onRetryNodeParent(te = void 0) {
      w(te), S();
    },
    get onToggleNodeChildren() {
      return m();
    },
    set onToggleNodeChildren(te = void 0) {
      m(te), S();
    },
    get onRetryNodeChildren() {
      return i();
    },
    set onRetryNodeChildren(te = void 0) {
      i(te), S();
    },
    get onCopyPointerDown() {
      return O();
    },
    set onCopyPointerDown(te = void 0) {
      O(te), S();
    },
    get onCopyNevent() {
      return W();
    },
    set onCopyNevent(te = void 0) {
      W(te), S();
    },
    get externalClientLabel() {
      return $();
    },
    set externalClientLabel(te = void 0) {
      $(te), S();
    },
    get onOpenExternalClient() {
      return X();
    },
    set onOpenExternalClient(te = void 0) {
      X(te), S();
    },
    get isCopyFailed() {
      return me();
    },
    set isCopyFailed(te = void 0) {
      me(te), S();
    },
    get onShowRawJson() {
      return D();
    },
    set onShowRawJson(te = void 0) {
      D(te), S();
    },
    get onBroadcastPointerDown() {
      return ee();
    },
    set onBroadcastPointerDown(te = void 0) {
      ee(te), S();
    },
    get onBroadcastPost() {
      return ve();
    },
    set onBroadcastPost(te = void 0) {
      ve(te), S();
    },
    get isBroadcastSending() {
      return Re();
    },
    set isBroadcastSending(te = void 0) {
      Re(te), S();
    },
    get canDeleteNodePost() {
      return ae();
    },
    set canDeleteNodePost(te = void 0) {
      ae(te), S();
    },
    get isDeletionSending() {
      return fe();
    },
    set isDeletionSending(te = void 0) {
      fe(te), S();
    },
    get onOpenDeleteConfirm() {
      return ne();
    },
    set onOpenDeleteConfirm(te = void 0) {
      ne(te), S();
    }
  }, se = Ae(), G = Z(se);
  {
    var de = (te) => {
      var M = Qg(), F = T(M);
      {
        var U = (Fe) => {
          Xs(Fe, {
            get state() {
              return s().parentNodeState;
            },
            get previewModelByEventId() {
              return c();
            },
            get emojiLoadStateByUrl() {
              return u();
            },
            get emojiImageMetaByUrl() {
              return b();
            },
            get scrollRoot() {
              return g();
            },
            get onImageOpen() {
              return y();
            },
            get onToggleParent() {
              return R();
            },
            get onRetryParent() {
              return w();
            },
            get onToggleChildren() {
              return m();
            },
            get onRetryChildren() {
              return i();
            },
            get onCopyPointerDown() {
              return O();
            },
            get onCopyNevent() {
              return W();
            },
            get externalClientLabel() {
              return $();
            },
            get onOpenExternalClient() {
              return X();
            },
            get isCopyFailed() {
              return me();
            },
            get onShowRawJson() {
              return D();
            },
            get onBroadcastPointerDown() {
              return ee();
            },
            get onBroadcastPost() {
              return ve();
            },
            get isBroadcastSending() {
              return Re();
            },
            get canDeleteNodePost() {
              return ae();
            },
            get isDeletionSending() {
              return fe();
            },
            get onOpenDeleteConfirm() {
              return ne();
            }
          });
        }, ce = (Fe) => {
          Xs(Fe, {
            get state() {
              return a(He);
            },
            get previewModelByEventId() {
              return c();
            },
            get emojiLoadStateByUrl() {
              return u();
            },
            get emojiImageMetaByUrl() {
              return b();
            },
            get scrollRoot() {
              return g();
            },
            get onImageOpen() {
              return y();
            },
            get onToggleParent() {
              return R();
            },
            get onRetryParent() {
              return w();
            },
            get onToggleChildren() {
              return m();
            },
            get onRetryChildren() {
              return i();
            },
            get onCopyPointerDown() {
              return O();
            },
            get onCopyNevent() {
              return W();
            },
            get externalClientLabel() {
              return $();
            },
            get onOpenExternalClient() {
              return X();
            },
            get isCopyFailed() {
              return me();
            },
            get onShowRawJson() {
              return D();
            },
            get onBroadcastPointerDown() {
              return ee();
            },
            get onBroadcastPost() {
              return ve();
            },
            get isBroadcastSending() {
              return Re();
            },
            get canDeleteNodePost() {
              return ae();
            },
            get isDeletionSending() {
              return fe();
            },
            get onOpenDeleteConfirm() {
              return ne();
            }
          });
        }, pe = (Fe) => {
          var Ue = Kg(), re = T(Ue, !0);
          A(Ue), ge((Ge) => J(re, Ge), [() => n()("postHistory.replyTargetDeleted")]), E(Fe, Ue);
        }, q = (Fe) => {
          var Ue = Yg(), re = T(Ue, !0);
          A(Ue), ge((Ge) => J(re, Ge), [() => n()("postHistory.contextNotFound")]), E(Fe, Ue);
        }, De = (Fe) => {
          var Ue = zg(), re = Z(Ue), Ge = T(re, !0);
          A(re);
          var kt = L(re, 2);
          ir(kt, {
            type: "button",
            className: "post-history-context-button post-history-context-retry-button",
            onClick: () => f()?.(),
            children: (vt, xt) => {
              $s();
              var st = ss();
              ge((tn) => J(st, tn), [() => n()("postHistory.contextRetry")]), E(vt, st);
            },
            $$slots: { default: !0 }
          }), ge((vt) => J(Ge, vt), [() => n()("postHistory.contextFetchFailed")]), E(Fe, Ue);
        };
        be(F, (Fe) => {
          s().parentExpansion.visibleParent && s().parentNodeState ? Fe(U) : s().parentExpansion.visibleParent && a(He) ? Fe(ce, 1) : s().parentExpansion.visibleParent && s().parentExpansion.parentDeleted ? Fe(pe, 2) : s().parentExpansion.visibleParent && s().parentExpansion.parentMissing ? Fe(q, 3) : s().parentExpansion.visibleParent && s().parentExpansion.parentError && Fe(De, 4);
        });
      }
      var nt = L(F, 2), rt = T(nt);
      {
        var ue = (Fe) => {
          {
            let Ue = I(() => s().parentExpansion.visibleParent ? n()("postHistory.hideReplyTarget") : n()("postHistory.showReplyTarget")), re = I(() => s().parentExpansion.visibleParent ? n()("postHistory.hideReplyTarget") : n()("postHistory.showReplyTarget")), Ge = I(() => s().parentExpansion.visibleParent && s().parentExpansion.showParentLoadingIndicator);
            Id(Fe, {
              get ariaLabel() {
                return a(Ue);
              },
              get title() {
                return a(re);
              },
              get expanded() {
                return s().parentExpansion.visibleParent;
              },
              get loading() {
                return a(Ge);
              },
              onClick: () => x()?.()
            });
          }
        };
        be(rt, (Fe) => {
          s().parentExpansion.visibleParent && s().parentExpansion.parentDeleted || Fe(ue);
        });
      }
      A(nt), A(M), ge(() => Ci(M, `--thread-direct-parent-indent: ${ke}`)), E(te, M);
    }, Se = (te) => {
      var M = Wg(), F = T(M);
      Pa(F, 21, () => s().replyNodeStates, (U) => U.node.eventId, (U, ce) => {
        Xs(U, {
          get state() {
            return a(ce);
          },
          get previewModelByEventId() {
            return c();
          },
          get emojiLoadStateByUrl() {
            return u();
          },
          get emojiImageMetaByUrl() {
            return b();
          },
          get scrollRoot() {
            return g();
          },
          get onImageOpen() {
            return y();
          },
          get onToggleParent() {
            return R();
          },
          get onRetryParent() {
            return w();
          },
          get onToggleChildren() {
            return m();
          },
          get onRetryChildren() {
            return i();
          },
          get onCopyPointerDown() {
            return O();
          },
          get onCopyNevent() {
            return W();
          },
          get externalClientLabel() {
            return $();
          },
          get onOpenExternalClient() {
            return X();
          },
          get isCopyFailed() {
            return me();
          },
          get onShowRawJson() {
            return D();
          },
          get onBroadcastPointerDown() {
            return ee();
          },
          get onBroadcastPost() {
            return ve();
          },
          get isBroadcastSending() {
            return Re();
          },
          get canDeleteNodePost() {
            return ae();
          },
          get isDeletionSending() {
            return fe();
          },
          get onOpenDeleteConfirm() {
            return ne();
          }
        });
      }), A(F), A(M), E(te, M);
    };
    be(G, (te) => {
      l() === "parent" && s().parentTargetId ? te(de) : l() === "children" && s().repliesActionState.visible && s().replyNodeStates.length > 0 && te(Se, 1);
    });
  }
  E(t, se);
  var $e = Lt(xe);
  return o(), $e;
}
Ft(
  Pl,
  {
    state: {},
    section: {},
    previewModelByEventId: {},
    emojiLoadStateByUrl: {},
    emojiImageMetaByUrl: {},
    scrollRoot: {},
    onImageOpen: {},
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
function Gg({
  getShow: t,
  getPosts: e,
  getRxNostr: n,
  getRelayConfig: r,
  getIsSearchMode: o
}) {
  let s = ye(lr({})), l = 0, c = [];
  function u() {
    c = [];
  }
  function b() {
    c.forEach((x) => x.release()), u();
  }
  function g() {
    b(), p(s, {}, !0);
  }
  function y(x, f) {
    if (x.kind !== 42)
      return null;
    if (!x.channelEventId)
      return f("postHistory.channelUnknown");
    const R = a(s)[x.channelEventId];
    return !R || R.status === "loading" ? f("postHistory.channelLoading") : R.status === "resolved" && R.name ? R.name : f("postHistory.channelUnknown");
  }
  return Ke(() => {
    t() || g();
  }), Ke(() => {
    if (t())
      return () => {
        b();
      };
  }), Ke(() => {
    if (!t())
      return;
    b();
    const x = e().filter((i) => i.kind === 42);
    if (x.length === 0)
      return;
    const f = Array.from(new Set(x.map((i) => i.channelEventId).filter((i) => typeof i == "string")));
    if (f.length === 0)
      return;
    const R = ++l, w = o() ? void 0 : n(), m = f.map((i) => {
      const O = Mn.sanitizeExternalRelayUrls(x.filter((W) => W.channelEventId === i).flatMap((W) => Kh(W)), { limit: Yh });
      return zh.resolveInternal({ eventId: i, relayHints: O }, w, r());
    });
    c = m, p(
      s,
      {
        ...ca(() => a(s)),
        ...Object.fromEntries(f.map((i) => [i, { status: "loading", name: null }]))
      },
      !0
    ), Promise.all(m.map((i) => i.cacheReady)).then((i) => {
      !t() || R !== l || p(
        s,
        {
          ...a(s),
          ...Object.fromEntries(i.map((O) => [
            O.context.eventId,
            Qh(O.cache, !!w)
          ]))
        },
        !0
      );
    }).catch((i) => {
      console.error("チャンネル表示のキャッシュ解決に失敗しました:", i);
    }), Promise.all(m.map((i) => i.refresh)).then((i) => {
      !t() || R !== l || (u(), p(
        s,
        {
          ...a(s),
          ...Object.fromEntries(i.map((O) => [
            O.snapshot.context.eventId,
            {
              status: O.snapshot.context.name ? "resolved" : "failed",
              name: O.snapshot.context.name
            }
          ]))
        },
        !0
      ));
    }).catch((i) => {
      R === l && u(), console.error("チャンネル表示のバックグラウンド解決に失敗しました:", i);
    });
  }), ao(() => {
    b();
  }), { getChannelText: y, cancelCurrentChannelResolution: b };
}
function Zg() {
  let t = ye(lr({})), e = ye(!1), n = ye(0), r = ye(0), o, s = ye(void 0);
  function l(f) {
    return Jh(f, nu.value);
  }
  function c() {
    o && (clearTimeout(o), o = void 0), p(e, !1), p(s, void 0);
  }
  function u(f, R) {
    p(
      s,
      {
        eventId: f.eventId,
        ...ai(R.clientX, R.clientY)
      },
      !0
    );
  }
  function b(f, R) {
    if (a(s)?.eventId === f.eventId)
      return {
        x: a(s).x,
        y: a(s).y
      };
    const w = R.currentTarget, m = w instanceof HTMLElement ? w.getBoundingClientRect() : null;
    return ai(m ? m.left + m.width / 2 : 0, m ? m.bottom + 8 : 0);
  }
  function g(f, R) {
    o && clearTimeout(o), p(n, f, !0), p(r, R, !0), p(e, !0), o = setTimeout(
      () => {
        p(e, !1), o = void 0;
      },
      1800
    );
  }
  async function y(f, R) {
    const w = b(f, R), m = l(f);
    if (m ? await Wh(m, "nevent", navigator, window) : !1) {
      p(t, { ...a(t), [f.eventId]: void 0 }, !0), g(w.x, w.y);
      return;
    }
    p(t, { ...a(t), [f.eventId]: "failed" }, !0), setTimeout(
      () => {
        p(t, { ...a(t), [f.eventId]: void 0 }, !0);
      },
      1800
    );
  }
  function x() {
    p(t, {}, !0), c();
  }
  return {
    get copyState() {
      return a(t);
    },
    get showCopyFloatingMessage() {
      return a(e);
    },
    get copyFloatingMessageX() {
      return a(n);
    },
    get copyFloatingMessageY() {
      return a(r);
    },
    captureCopyPointerPosition: u,
    hideCopyFloatingMessage: c,
    handleCopyNevent: y,
    resetState: x
  };
}
const Xg = 5e3, Gi = 8;
class ey {
  console;
  setTimeoutFn;
  clearTimeoutFn;
  constructor(e = {}) {
    this.console = e.console ?? (typeof console < "u" ? console : { log: () => {
    }, warn: () => {
    }, error: () => {
    } }), this.setTimeoutFn = e.setTimeoutFn ?? ((n, r) => setTimeout(n, r)), this.clearTimeoutFn = e.clearTimeoutFn ?? ((n) => clearTimeout(n));
  }
  fetchEventById(e, n) {
    const r = kl(), o = this.resolveRelayUrls(n.relayHints, n.relayConfig);
    let s = !1, l, c, u;
    const b = () => {
      c !== void 0 && (this.clearTimeoutFn(c), c = void 0), l?.unsubscribe?.(), l = void 0;
    }, g = (x) => (f) => {
      s || (s = !0, b(), x(f));
    };
    return {
      promise: new Promise((x) => {
        const f = g(x);
        u = f;
        try {
          l = Dl(e, r, {
            on: o.length > 0 ? { relays: o } : { defaultReadRelays: !0 }
          }).subscribe({
            next: (R) => {
              R.event?.id === n.eventId && f({
                event: R.event,
                relayUrl: typeof R.from == "string" ? R.from : null
              });
            },
            complete: () => {
              f({ event: null, relayUrl: null });
            },
            error: (R) => {
              this.console.error("post_history_context_fetch_error", R), f({ event: null, relayUrl: null });
            }
          }), r.emit({ ids: [n.eventId] }), r.over(), c = this.setTimeoutFn(() => {
            this.console.warn("post_history_context_fetch_timeout", n.eventId), f({ event: null, relayUrl: null });
          }, n.timeoutMs ?? Xg);
        } catch (R) {
          this.console.error("post_history_context_fetch_request_error", R), f({ event: null, relayUrl: null });
        }
      }),
      cancel: () => {
        u?.({ event: null, relayUrl: null });
      }
    };
  }
  resolveRelayUrls(e, n) {
    const r = Tl(
      e,
      Gi
    );
    if (r)
      return r;
    const o = n ? [
      ...Mn.extractReadRelays(n),
      ...Mn.extractWriteRelays(n)
    ] : [], s = Mn.sanitizeExternalRelayUrls([
      ...e ?? [],
      ...o
    ], { limit: Gi });
    return s.length > 0 ? s : Mn.sanitizeExternalRelayUrls(
      Nl,
      { limit: Gi }
    );
  }
}
const Sd = new ey();
function ty(t, e) {
  return t.length === e.length && t.every((n, r) => n === e[r]);
}
function Rd({
  getShow: t,
  getRxNostr: e,
  profileCache: n = ru,
  logger: r = console
}) {
  const o = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Set();
  let l = !1;
  const c = (f, R) => {
    if (!(l || f.disposed || o.get(f.pubkey) !== f || !t() || !R || f.lastProfile === R)) {
      f.lastProfile = R;
      for (const w of s)
        w(f.pubkey, R);
    }
  }, u = (f, R) => {
    if (f.pending || f.disposed || l)
      return;
    const w = f.relayHints;
    f.pending = n.getProfile(f.pubkey, {
      rxNostr: e(),
      additionalRelays: w,
      forceRefresh: R,
      allowBackgroundRefresh: !0
    }).then((m) => {
      c(f, m);
    }).catch((m) => {
      r.error("投稿履歴プロフィールの取得に失敗:", m);
    }).finally(() => {
      o.get(f.pubkey) === f && (f.pending = null, f.refreshQueued && (f.refreshQueued = !1, u(f, !0)));
    });
  }, b = (f, R = []) => {
    if (!f || l)
      return null;
    const w = Mn.sanitizeExternalRelayUrls(R), m = o.get(f);
    if (m) {
      const O = Mn.mergeRelayConfigs(
        m.relayHints,
        w
      );
      return ty(m.relayHints, O) || (m.relayHints = O, m.pending ? m.refreshQueued = !0 : u(m, !0)), m.lastProfile;
    }
    const i = {
      pubkey: f,
      relayHints: w,
      lastProfile: null,
      unsubscribe: () => {
      },
      pending: null,
      refreshQueued: !1,
      disposed: !1
    };
    return o.set(f, i), i.unsubscribe = n.subscribe(f, (O) => {
      c(i, O);
    }), u(i, !1), null;
  }, g = (f) => {
    if (l)
      return () => {
      };
    s.add(f);
    for (const R of o.values())
      R.lastProfile && f(R.pubkey, R.lastProfile);
    return () => s.delete(f);
  }, y = () => {
    for (const f of o.values())
      f.disposed = !0, f.unsubscribe();
    o.clear();
  };
  return {
    ensureProfile: b,
    subscribe: g,
    reset: y,
    dispose: () => {
      l || (y(), s.clear(), l = !0);
    }
  };
}
const ny = 8;
function Ao(t) {
  return Mn.sanitizeExternalRelayUrls(t, { limit: ny });
}
function ic(t, e) {
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
function lc(t) {
  return {
    targetEventId: t.targetEventId,
    status: "loading",
    event: null,
    profile: null,
    authorPubkey: t.authorHint ?? null,
    relayHints: Ao(t.relayHints ?? []),
    errorCode: null,
    updatedAt: null
  };
}
function _d({
  getShow: t,
  getRxNostr: e,
  getRelayConfig: n,
  postHistoryRepositoryImpl: r = at,
  contextFetchService: o = Sd,
  deletionRequestsRepositoryImpl: s = ro,
  deletionFetchService: l = Pi,
  profileSyncCoordinator: c = void 0
}) {
  const u = c ?? Rd({ getShow: t, getRxNostr: e }), b = !c;
  let g = ye({}), y = ye(lr({})), x = ye(lr({}));
  const f = /* @__PURE__ */ new Map(), R = /* @__PURE__ */ new Map(), w = /* @__PURE__ */ new Map(), m = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map(), O = /* @__PURE__ */ new Map(), W = /* @__PURE__ */ new Map();
  let $ = 0;
  function X(M) {
    p(
      y,
      {
        ...a(y),
        [M]: (a(y)[M] ?? 0) + 1
      },
      !0
    );
  }
  function me(M) {
    const F = R.get(M);
    if (F)
      for (const U of F)
        X(U);
  }
  function D(M, F) {
    const U = a(g)[M], ce = F(U);
    return U && U.status === ce.status && U.event === ce.event && U.profile === ce.profile && U.authorPubkey === ce.authorPubkey && U.errorCode === ce.errorCode && U.updatedAt === ce.updatedAt && pl(U.relayHints, ce.relayHints) ? U : (p(g, { ...a(g), [M]: ce }), me(M), ce);
  }
  function ee(M, F) {
    return D(M, (U) => {
      const ce = U ?? lc({ targetEventId: M });
      return {
        targetEventId: M,
        status: F.status ?? ce.status,
        event: F.event !== void 0 ? F.event : ce.event,
        profile: F.profile !== void 0 ? F.profile : ce.profile,
        authorPubkey: F.authorPubkey !== void 0 ? F.authorPubkey : ce.authorPubkey,
        relayHints: F.relayHints ? Ao(F.relayHints) : ce.relayHints,
        errorCode: F.errorCode !== void 0 ? F.errorCode : ce.errorCode,
        updatedAt: F.updatedAt !== void 0 ? F.updatedAt : ce.updatedAt
      };
    });
  }
  function ve(M) {
    const F = a(g)[M.targetEventId], U = Ao([...F?.relayHints ?? [], ...M.relayHints ?? []]), ce = F?.authorPubkey ?? M.authorHint ?? null, pe = !F || F.authorPubkey !== ce || !pl(F.relayHints, U);
    return ee(M.targetEventId, { authorPubkey: ce, relayHints: U }), pe;
  }
  function Re(M) {
    const F = f.get(M.scopeKey) ?? /* @__PURE__ */ new Set();
    F.add(M.targetEventId), f.set(M.scopeKey, F);
    const U = R.get(M.targetEventId) ?? /* @__PURE__ */ new Set();
    U.add(M.scopeKey), R.set(M.targetEventId, U), M.scopeKey in a(x) || p(x, { ...a(x), [M.scopeKey]: 0 }, !0), M.scopeKey in a(y) || p(y, { ...a(y), [M.scopeKey]: 0 }, !0);
  }
  async function ae(M, F) {
    return (await s.getDeletedTargets([{ targetAuthorPubkey: M, targetEventId: F }])).get(M)?.has(F) ?? !1;
  }
  function fe(M, F) {
    if (!(!M || !F))
      for (const [U, ce] of Object.entries(a(g)))
        ce.authorPubkey === M && ee(U, { profile: F });
  }
  function ne(M, F) {
    const U = u.ensureProfile(M, F);
    fe(M, U);
  }
  u.subscribe((M, F) => {
    t() && fe(M, F);
  });
  async function ke(M, F, U = {}) {
    if (!M.pubkey || !M.id)
      return !1;
    if (await ae(M.pubkey, M.id))
      return ee(M.id, {
        status: "deleted",
        event: null,
        authorPubkey: M.pubkey,
        relayHints: F,
        errorCode: null,
        updatedAt: Date.now()
      }), !0;
    if (i.has(M.id))
      return i.get(M.id) ?? !1;
    const ce = e();
    if (!ce)
      return !1;
    const pe = (async () => {
      try {
        const q = l.fetchDeletionRequests(ce, {
          targets: [{ event: M, relayUrls: F }],
          relayHints: F,
          relayConfig: n()
        });
        O.set(M.id, q);
        const De = await q.promise;
        De.events.length > 0 && await s.upsertValidDeletionRequests({
          targetEvents: [M],
          deletionEvents: De.events,
          fetchedAt: De.fetchedAt
        });
        const nt = await ae(M.pubkey, M.id);
        return nt && ee(M.id, {
          status: "deleted",
          event: null,
          authorPubkey: M.pubkey,
          relayHints: F,
          errorCode: null,
          updatedAt: Date.now()
        }), nt;
      } catch {
        return !1;
      } finally {
        O.delete(M.id), i.delete(M.id);
      }
    })();
    return i.set(M.id, pe), U.background ? !1 : pe;
  }
  function He(M, F) {
    return W.get(M) === F;
  }
  async function xe(M, F = {}) {
    Re(M);
    const U = a(g)[M.targetEventId], ce = ve(M), pe = a(g)[M.targetEventId] ?? lc(M), q = !!F.background && U?.status === "resolved";
    if (!F.force && U) {
      if (U.status === "resolved" || U.status === "deleted")
        return U.status === "resolved" && U.authorPubkey && ne(U.authorPubkey, a(g)[M.targetEventId]?.relayHints ?? U.relayHints), a(g)[M.targetEventId] ?? U;
      if (U.status === "loading" && w.has(M.targetEventId))
        return await w.get(M.targetEventId) ?? a(g)[M.targetEventId] ?? U;
      if (!ce && (U.status === "not-found" || U.status === "error"))
        return a(g)[M.targetEventId] ?? U;
    }
    if (!F.force && w.has(M.targetEventId))
      return await w.get(M.targetEventId) ?? a(g)[M.targetEventId] ?? pe;
    F.force && (m.get(M.targetEventId)?.cancel(), m.delete(M.targetEventId), w.delete(M.targetEventId));
    const De = ++$;
    W.set(M.targetEventId, De);
    const nt = (async () => {
      try {
        q || ee(M.targetEventId, { status: "loading", errorCode: null });
        const rt = await r.getByEventId(M.targetEventId);
        if (!He(M.targetEventId, De))
          return a(g)[M.targetEventId] ?? null;
        if (rt) {
          const vt = Ao([
            ...pe.relayHints,
            ...rt.relayHints,
            ...rt.acceptedRelays,
            ...rt.fetchedRelays ?? []
          ]);
          if (typeof rt.deletedAt == "number")
            return ee(M.targetEventId, {
              status: "deleted",
              event: null,
              authorPubkey: rt.pubkeyHex,
              relayHints: vt,
              errorCode: null,
              updatedAt: Date.now()
            });
          const xt = wl(rt), st = ee(M.targetEventId, {
            status: "resolved",
            event: xt,
            authorPubkey: xt.pubkey,
            relayHints: vt,
            errorCode: null,
            updatedAt: Date.now()
          });
          return ne(xt.pubkey, vt), ke(xt, vt, { background: !0 }), a(g)[M.targetEventId] ?? st;
        }
        if (M.authorHint) {
          const vt = await ke(ic(M.targetEventId, M.authorHint), pe.relayHints);
          if (!He(M.targetEventId, De))
            return a(g)[M.targetEventId] ?? null;
          if (vt)
            return a(g)[M.targetEventId] ?? null;
        }
        const ue = e();
        if (!ue || !t())
          return q ? a(g)[M.targetEventId] ?? pe : ee(M.targetEventId, {
            status: "error",
            event: null,
            authorPubkey: pe.authorPubkey,
            relayHints: pe.relayHints,
            errorCode: "nostr_not_ready",
            updatedAt: Date.now()
          });
        const Fe = o.fetchEventById(ue, {
          eventId: M.targetEventId,
          relayHints: pe.relayHints,
          relayConfig: n()
        });
        m.set(M.targetEventId, Fe);
        const Ue = await Fe.promise;
        if (m.delete(M.targetEventId), !He(M.targetEventId, De))
          return a(g)[M.targetEventId] ?? null;
        if (!Ue.event) {
          if (M.authorHint) {
            const vt = await ke(ic(M.targetEventId, M.authorHint), pe.relayHints);
            if (!He(M.targetEventId, De))
              return a(g)[M.targetEventId] ?? null;
            if (vt)
              return a(g)[M.targetEventId] ?? null;
          }
          return q ? a(g)[M.targetEventId] ?? pe : ee(M.targetEventId, {
            status: "not-found",
            event: null,
            authorPubkey: pe.authorPubkey,
            relayHints: pe.relayHints,
            errorCode: null,
            updatedAt: Date.now()
          });
        }
        const re = Ao([
          ...pe.relayHints,
          ...Ue.relayUrl ? [Ue.relayUrl] : []
        ]), Ge = await ke(Ue.event, re);
        if (!He(M.targetEventId, De))
          return a(g)[M.targetEventId] ?? null;
        if (Ge)
          return a(g)[M.targetEventId] ?? null;
        const kt = ee(M.targetEventId, {
          status: "resolved",
          event: Ue.event,
          authorPubkey: Ue.event.pubkey,
          relayHints: re,
          errorCode: null,
          updatedAt: Date.now()
        });
        return ne(Ue.event.pubkey, re), a(g)[M.targetEventId] ?? kt;
      } catch {
        return He(M.targetEventId, De) ? q ? a(g)[M.targetEventId] ?? pe : ee(M.targetEventId, {
          status: "error",
          event: null,
          authorPubkey: pe.authorPubkey,
          relayHints: pe.relayHints,
          errorCode: "fetch_failed",
          updatedAt: Date.now()
        }) : a(g)[M.targetEventId] ?? null;
      } finally {
        m.delete(M.targetEventId), w.delete(M.targetEventId);
      }
    })();
    return w.set(M.targetEventId, nt), await nt;
  }
  async function se(M, F = {}) {
    return await Promise.all(M.map((U) => xe(U, F)));
  }
  async function G(M, F = {}) {
    return await xe(M, { ...F, force: !0 });
  }
  function de(M) {
    return a(g)[M] ?? null;
  }
  function Se(M) {
    return a(y)[M] ?? 0;
  }
  function $e(M) {
    const F = f.get(M);
    if (F)
      for (const U of F) {
        const ce = R.get(U);
        ce && (ce.delete(M), !(ce.size > 0) && (R.delete(U), W.delete(U), m.get(U)?.cancel(), m.delete(U), O.get(U)?.cancel(), O.delete(U), w.delete(U), i.delete(U)));
      }
    f.delete(M), p(
      x,
      {
        ...a(x),
        [M]: (a(x)[M] ?? 0) + 1
      },
      !0
    ), X(M);
  }
  function te() {
    m.forEach((M) => M.cancel()), O.forEach((M) => M.cancel()), m.clear(), O.clear(), w.clear(), i.clear(), f.clear(), R.clear(), b && u.reset(), W.clear(), p(g, {}), p(y, {}, !0), p(x, {}, !0);
  }
  return {
    ensureTarget: xe,
    ensureTargets: se,
    retryTarget: G,
    getTargetSnapshot: de,
    getScopeRevision: Se,
    invalidateScope: $e,
    reset: te
  };
}
const ry = /nostr:[^\s<>"']+/gi, ay = /[),.!?:;\]\u3001\u3002\uff01\uff08\uff09\uff0c\uff0e\uff1a\uff1b\u300d\u300f\u3011]+$/u, sy = /^[\s),.!?:;\]\u3001\u3002\uff01\uff08\uff09\uff0c\uff0e\uff1a\uff1b\u300d\u300f\u3011]+$/u;
function oy(t) {
  return Mn.sanitizeExternalRelayUrls(
    typeof t == "string" && t.length > 0 ? [t] : [],
    { limit: 1 }
  )[0] ?? null;
}
function iy(t) {
  const e = t.match(ay);
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
function ly(t) {
  if (!t.toLowerCase().startsWith("nostr:"))
    return null;
  try {
    const e = fu.decode(t.slice(6));
    return e.type === "note" ? e.data : e.type === "nevent" ? e.data.id : null;
  } catch {
    return null;
  }
}
function dy(t) {
  const e = t.replace(/[ \t]{2,}/g, " ").trim();
  return e.length === 0 || sy.test(e) ? null : e;
}
function ph(t) {
  if (!t)
    return [];
  const e = /* @__PURE__ */ new Map();
  for (const n of t.tags) {
    if (!Array.isArray(n) || n[0] !== "q")
      continue;
    const r = n[1];
    if (!Hd(r))
      continue;
    const o = oy(n[2]), s = Hd(n[3]) ? n[3] : null, l = e.get(r);
    if (!l) {
      e.set(r, {
        eventId: r,
        relayHint: o,
        authorHint: s
      });
      continue;
    }
    !l.relayHint && o && (l.relayHint = o), !l.authorHint && s && (l.authorHint = s);
  }
  return Array.from(e.values());
}
function cy(t) {
  if (!t || typeof t.content != "string" || t.content.length === 0)
    return t?.content ?? "";
  const e = ph(t);
  if (e.length === 0)
    return t.content;
  const n = new Set(
    e.map((s) => s.eventId)
  );
  let r = !1;
  const o = t.content.split(/\r?\n/).map((s) => {
    if (!s)
      return s;
    let l = "", c = 0, u = !1;
    for (const b of s.matchAll(ry)) {
      const g = b.index ?? -1, y = b[0] ?? "";
      if (g < 0 || !y)
        continue;
      const { uri: x, trailingText: f } = iy(y), R = ly(x);
      !R || !n.has(R) || (u = !0, r = !0, l += s.slice(c, g), l += f, c = g + y.length);
    }
    return u ? (l += s.slice(c), dy(l)) : s;
  });
  return r ? o.filter((s) => s !== null).join(`
`) : t.content;
}
const uy = 8, Zi = {
  byPostId: {},
  contextsByEventId: {}
};
function Ed(t) {
  return Mn.sanitizeExternalRelayUrls(t, {
    limit: uy
  });
}
function gh(t) {
  return {
    sourceEventId: t.sourceEventId,
    targetEventId: t.targetEventId,
    relationKind: t.relationKind,
    relayHints: Ed(t.relayHints),
    authorHint: t.authorHint,
    scopeKey: t.scopeKey
  };
}
const Fs = {
  buildIndex(t) {
    const e = {}, n = {};
    for (const r of t) {
      const o = ph(r);
      if (o.length !== 0) {
        e[r.eventId] = o;
        for (const s of o) {
          const l = n[s.eventId];
          n[s.eventId] = {
            eventId: s.eventId,
            sourceEventId: l?.sourceEventId ?? r.eventId,
            authorHint: l?.authorHint ?? s.authorHint,
            relayHints: Ed([
              ...l?.relayHints ?? [],
              ...s.relayHint ? [s.relayHint] : [],
              ...r.relayHints,
              ...r.acceptedRelays,
              ...r.fetchedRelays ?? []
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
    return gh({
      sourceEventId: t.sourceEventId,
      targetEventId: t.eventId,
      relationKind: "quote",
      relayHints: t.relayHints,
      authorHint: t.authorHint,
      scopeKey: e
    });
  }
}, Xi = {
  getRelayHints(t, e) {
    const n = ns(e.event);
    return Ed([
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
    const e = ns(t.event);
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
    return gh({
      sourceEventId: t.sourceEventId,
      targetEventId: t.targetEventId,
      relationKind: "reply-parent",
      relayHints: t.relayHints,
      authorHint: t.authorHint,
      scopeKey: e
    });
  }
};
let hy = 0;
function fy(t) {
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
function vy(t, e) {
  const n = fy(e?.status);
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
        profile: e.profile ?? null
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
function py({
  getShow: t,
  getPosts: e,
  getRxNostr: n,
  getRelayConfig: r,
  postHistoryRepositoryImpl: o = at,
  contextFetchService: s = Sd,
  deletionRequestsRepositoryImpl: l = ro,
  deletionFetchService: c = Pi,
  profileSyncCoordinator: u = void 0,
  relatedTargetResolver: b = void 0
}) {
  const g = b ?? _d({
    getShow: t,
    getRxNostr: n,
    getRelayConfig: r,
    postHistoryRepositoryImpl: o,
    contextFetchService: s,
    deletionRequestsRepositoryImpl: l,
    deletionFetchService: c,
    profileSyncCoordinator: u
  }), y = !b, x = `post-history-quote-preview:${++hy}`;
  let f = ye(0), R = ye(lr(Zi));
  function w() {
    p(R, Zi, !0), y && g.reset();
  }
  function m(W) {
    return a(f), (a(R).byPostId[W.eventId] ?? []).map(($) => vy($.eventId, g.getTargetSnapshot($.eventId)));
  }
  function i(W) {
    const $ = a(R).contextsByEventId[W];
    $ && g.retryTarget(Fs.toDescriptor($, x));
  }
  async function O(W) {
    const $ = Fs.buildIndex(W), X = Object.values($.contextsByEventId);
    X.length !== 0 && await g.ensureTargets(X.map((me) => Fs.toDescriptor(me, x)), { force: !0 });
  }
  return Ke(() => {
    t() || p(R, Zi, !0);
  }), Ke(() => {
    t() && p(f, g.getScopeRevision(x), !0);
  }), Ke(() => {
    t() && p(R, Fs.buildIndex(e()), !0);
  }), Ke(() => {
    if (!t())
      return;
    n(), r();
    const W = Object.values(a(R).contextsByEventId);
    W.length !== 0 && g.ensureTargets(W.map(($) => Fs.toDescriptor($, x)));
  }), ao(() => {
    g.invalidateScope(x), w();
  }), { getQuotePreviews: m, retryQuotePreview: i, refreshQuotePreviews: O };
}
const di = {
  currentPage: 1,
  searchPage: 1,
  searchInput: "",
  searchQuery: ""
}, ci = /* @__PURE__ */ new Map();
function Ad(t) {
  if (typeof t != "string")
    return null;
  const e = t.trim();
  return e.length > 0 ? e : null;
}
function dc(t) {
  return typeof t != "number" || !Number.isFinite(t) ? 1 : Math.max(1, Math.trunc(t));
}
function ui(t) {
  return {
    currentPage: t.currentPage,
    searchPage: t.searchPage,
    searchInput: t.searchInput,
    searchQuery: t.searchQuery
  };
}
function gy(t) {
  const e = Ad(t);
  return ui(
    e ? ci.get(e) ?? di : di
  );
}
function cc(t, e) {
  const n = Ad(t);
  if (!n)
    return ui(
      di
    );
  const r = ci.get(n) ?? di, o = {
    currentPage: dc(e.currentPage ?? r.currentPage),
    searchPage: dc(e.searchPage ?? r.searchPage),
    searchInput: e.searchInput ?? r.searchInput,
    searchQuery: e.searchQuery ?? r.searchQuery
  };
  return ci.set(n, o), ui(o);
}
function uc(t) {
  const e = Ad(t);
  e && ci.delete(e);
}
function yy(t) {
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
function my(t) {
  return Number.isFinite(t) ? Math.max(1, Math.trunc(t)) : 1;
}
function by(t) {
  return Number.isFinite(t) ? Math.max(1, Math.trunc(t)) : 50;
}
function Cy(t) {
  return t.trim().toLowerCase().split(/\s+/).filter(Boolean);
}
function wy(t) {
  return t.join(" ");
}
function hc(t) {
  return {
    postHistory: Zs(t),
    channelMetadata: Zh()
  };
}
function el(t, e) {
  return t.postHistory === e.postHistory && t.channelMetadata === e.channelMetadata;
}
function Py(t, e) {
  return [
    t.content,
    t.eventId,
    String(t.kind),
    t.tags.flat().join(" "),
    ...t.media.flatMap((n) => [n.url, n.alt ?? ""]),
    t.channelEventId ?? "",
    t.relayHints.join(" "),
    t.acceptedRelays.join(" "),
    t.fetchedRelays?.join(" ") ?? "",
    e?.name ?? "",
    e?.about ?? ""
  ].join(`
`).toLowerCase();
}
function xy(t) {
  return Array.from(
    new Set(
      t.map((e) => e.channelEventId).filter(
        (e) => typeof e == "string" && e.length > 0
      )
    )
  );
}
class Iy {
  constructor(e = at, n = Gh) {
    this.postHistoryRepositoryImpl = e, this.channelMetadataRepositoryImpl = n;
  }
  resolvedCacheEntry = null;
  inFlightEntry = null;
  runtimeCacheToken = 0;
  clearCache() {
    this.resolvedCacheEntry = null, this.inFlightEntry = null, this.runtimeCacheToken += 1;
  }
  isResolvedCacheEntryCurrent(e, n, r, o) {
    return e.pubkeyHex === n && e.normalizedQueryKey === r && el(e.revision, o);
  }
  async buildFilteredPosts(e, n) {
    const r = await this.postHistoryRepositoryImpl.getAll({ pubkeyHex: e }), o = xy(r), s = /* @__PURE__ */ new Map();
    return o.length > 0 && (await this.channelMetadataRepositoryImpl.getMany(
      o
    )).forEach((c) => {
      s.set(c.channelEventId, c);
    }), r.filter((l) => {
      const c = Py(
        l,
        l.channelEventId ? s.get(l.channelEventId) ?? null : null
      );
      return n.every((u) => c.includes(u));
    });
  }
  startFilteredPostsBuild(e, n, r, o) {
    const s = Symbol("post-history-local-search"), l = this.runtimeCacheToken, c = {
      identity: s,
      runtimeCacheToken: l,
      pubkeyHex: e,
      normalizedQueryKey: n,
      revision: o,
      promise: Promise.resolve([])
    };
    return c.promise = (async () => {
      let u = o;
      for (let b = 0; b < 2; b += 1) {
        const g = await this.buildFilteredPosts(e, r), y = hc(e), x = el(
          u,
          y
        );
        if (x && this.inFlightEntry?.identity === s && this.runtimeCacheToken === l && (this.resolvedCacheEntry = {
          pubkeyHex: e,
          normalizedQueryKey: n,
          revision: u,
          filteredPosts: g
        }), x || b === 1)
          return g;
        u = y, this.inFlightEntry?.identity === s && this.runtimeCacheToken === l && (c.revision = u);
      }
      return [];
    })().finally(() => {
      this.inFlightEntry?.identity === s && (this.inFlightEntry = null);
    }), this.inFlightEntry = c, c;
  }
  async searchLocalPosts(e) {
    const n = Cy(e.query);
    if (!e.pubkeyHex || n.length === 0)
      return {
        items: [],
        total: 0,
        hasNext: !1
      };
    const r = my(e.page), o = by(e.pageSize), s = e.pubkeyHex, l = wy(n), c = hc(s), u = this.resolvedCacheEntry, b = u && this.isResolvedCacheEntryCurrent(
      u,
      s,
      l,
      c
    ) ? u.filteredPosts : await (() => {
      const x = this.inFlightEntry;
      return (x && x.runtimeCacheToken === this.runtimeCacheToken && x.pubkeyHex === s && x.normalizedQueryKey === l && el(x.revision, c) ? x : this.startFilteredPostsBuild(
        s,
        l,
        n,
        c
      )).promise;
    })(), g = (r - 1) * o, y = g + o;
    return {
      items: b.slice(g, y),
      total: b.length,
      hasNext: y < b.length
    };
  }
}
const Co = new Iy(), Sy = 500, Ry = 12, _y = 3600;
function Ey(t, e) {
  return t.status === "timeout" || t.status === "error" || t.status === "cancelled" ? t.status : t.hasMore || t.perRelayCounts.some((n) => n.rawCount >= e) ? "partial" : "complete";
}
function Ay(t) {
  return t === "partial";
}
function ky(t, e) {
  return t.hasMore || t.perRelayCounts.some((n) => n.rawCount >= e);
}
function Dy(t) {
  return typeof t.since == "number" && typeof t.until == "number" && t.until - t.since > _y;
}
function Ty(t) {
  if (!Dy(t))
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
class My {
  postHistoryRelayFetchService;
  postHistoryRepository;
  setTimeoutFn;
  clearTimeoutFn;
  console;
  constructor(e = {}) {
    this.postHistoryRelayFetchService = e.postHistoryRelayFetchService ?? ti, this.postHistoryRepository = e.postHistoryRepository ?? at, this.setTimeoutFn = e.setTimeoutFn ?? setTimeout, this.clearTimeoutFn = e.clearTimeoutFn ?? clearTimeout, this.console = e.console ?? (typeof globalThis.console < "u" ? globalThis.console : { debug: () => {
    } });
  }
  async waitBetweenFetches(e) {
    await new Promise((n) => {
      const r = this.setTimeoutFn(() => {
        e(null), n();
      }, Sy);
      e(() => {
        this.clearTimeoutFn(r), e(null), n();
      });
    });
  }
  refetchAroundCurrentView(e, n) {
    let r = !1, o = null, s = null;
    const l = n.preferredRanges.map((u) => ({
      kinds: [...u.kinds],
      rangeUnit: u.rangeUnit,
      ...typeof u.since == "number" ? { since: u.since } : {},
      ...typeof u.until == "number" ? { until: u.until } : {},
      limit: u.limit,
      splitDepth: 0
    }));
    return {
      promise: (async () => {
        let u = 0, b = 0, g = 0, y = 0, x = !1, f = !1, R = !1, w = !1, m = !1, i = 0, O = 0, W = !0;
        const $ = [];
        for (; l.length > 0; ) {
          const ve = l.shift();
          if (r || (y > 0 && await this.waitBetweenFetches(($e) => {
            s = $e;
          }), r))
            break;
          const Re = this.postHistoryRelayFetchService.fetchLatest(e, {
            pubkeyHex: n.pubkeyHex,
            relayConfig: n.relayConfig,
            reason: "repair-visible-range",
            kinds: ve.kinds,
            limit: ve.limit || au,
            timeoutMs: Xh,
            ...typeof ve.since == "number" ? { since: ve.since } : {},
            ...typeof ve.until == "number" ? { until: ve.until } : {}
          });
          o = Re;
          const ae = await Re.promise;
          o = null, y += 1, O += ae.events.length, R = R || ae.status === "error", w = w || ae.status === "timeout";
          const fe = ae.events.length === 0 && !ae.hasAnyRelayResponse && (ae.allRelaysFailed || ae.status === "error");
          W = W && fe;
          let ne = 0, ke = 0, He = 0;
          if (ae.events.length > 0) {
            const $e = await this.postHistoryRepository.upsertFetchedEvents({
              events: ae.events,
              fetchedAt: ae.fetchedAt
            });
            ne = $e.insertedCount, ke = $e.updatedCount, He = $e.unchangedCount, u += ne, b += ke, g += He, await n.onProgress?.({
              insertedCount: ne,
              updatedCount: ke,
              unchangedCount: He,
              processedRangeCount: $.length + 1,
              attemptedRangeCount: y,
              addedCount: u,
              totalUpdatedCount: b,
              totalUnchangedCount: g
            });
          }
          const xe = ky(ae, ve.limit);
          f = f || xe;
          const se = xe ? Ty(ve) : [], G = se.length > 0 && $.length + 1 + l.length + se.length <= Ry, de = xe ? "limit" : Ey(ae, ve.limit);
          if ($.push({
            source: "preferred",
            rangeUnit: ve.rangeUnit,
            ...typeof ve.since == "number" ? { since: ve.since } : {},
            ...typeof ve.until == "number" ? { until: ve.until } : {},
            requestedRelayUrls: [...ae.requestedRelayUrls],
            observedRelayUrls: [...ae.observedRelayUrls],
            eventRelayUrls: [...ae.eventRelayUrls],
            eoseRelayUrls: [...ae.eoseRelayUrls],
            closedRelayUrls: [...ae.closedRelayUrls],
            errorRelayUrls: [...ae.errorRelayUrls],
            downRelayUrls: [...ae.downRelayUrls],
            completedByRxNostr: ae.completedByRxNostr,
            completedByLocalTimeout: ae.completedByLocalTimeout,
            hasAnyRelayResponse: ae.hasAnyRelayResponse,
            allRelaysFailed: ae.allRelaysFailed,
            status: de,
            rawCount: ae.rawCount,
            uniqueCount: ae.uniqueCount,
            duplicateCount: ae.duplicateCount,
            insertedCount: ne,
            updatedCount: ke,
            unchangedCount: He
          }), xe && G ? (i += se.length, l.unshift(...se)) : xe && (m = !0), (Ay(de) || fe || xe && !G) && (x = !0), r || ae.status === "cancelled") {
            r = !0;
            break;
          }
        }
        const X = !r && y > 0 && O === 0 && W, me = x || m || X, ee = {
          status: r ? "cancelled" : me ? "partial" : "success",
          addedCount: u,
          updatedCount: b,
          unchangedCount: g,
          processedRangeCount: $.length,
          attemptedRangeCount: y,
          hadFailures: me,
          limitReached: f,
          hadFetchError: R,
          fetchFailed: X,
          hadTimeout: w,
          hadUnfinishedRanges: m,
          splitRetryCount: i,
          processedRanges: $
        };
        return this.console.debug("post_history_current_view_refetch_summary", {
          pubkeyHex: n.pubkeyHex,
          processedRangeCount: ee.processedRangeCount,
          addedCount: ee.addedCount,
          updatedCount: ee.updatedCount,
          hadFailures: ee.hadFailures,
          limitReached: ee.limitReached,
          hadFetchError: ee.hadFetchError,
          fetchFailed: ee.fetchFailed,
          hadTimeout: ee.hadTimeout,
          hadUnfinishedRanges: ee.hadUnfinishedRanges,
          splitRetryCount: ee.splitRetryCount,
          processedRanges: ee.processedRanges
        }), ee;
      })(),
      cancel: () => {
        r = !0, s?.(), o?.cancel();
      }
    };
  }
}
const Oy = new My(), kd = [
  "reply",
  "reaction",
  "quote"
];
function yh(t) {
  const e = t ?? kd;
  return Array.from(new Set(e.filter(
    (n) => n === "reply" || n === "reaction" || n === "quote"
  )));
}
function Ly(t, e) {
  const n = yh(
    e.relationKinds
  );
  return {
    source: t,
    relationKinds: n,
    parentEventIds: Array.from(new Set(e.savedParentEventIds)),
    shouldRefreshQuotePreviews: n.includes("quote") && e.quoteRepairApplied
  };
}
const wo = {
  status: "saved",
  savedParentEventIds: [],
  savedDirectReplyCount: 0,
  deletedEventIds: [],
  deletionConfirmationIncomplete: !1
};
function Fy(t) {
  const e = /* @__PURE__ */ new Map();
  for (const n of t) {
    if (!n.parentEventId || !n.event?.id || !n.event.pubkey || n.event.kind !== 1 && n.event.kind !== 42)
      continue;
    const r = e.get(n.event.id);
    e.set(n.event.id, {
      parentEventId: n.parentEventId,
      event: n.event,
      relayUrls: Array.from(/* @__PURE__ */ new Set([
        ...r?.relayUrls ?? [],
        ...n.relayUrls ?? []
      ]))
    });
  }
  return Array.from(e.values());
}
function Hy(t, e) {
  return t.filter((n) => e.get(n.event.pubkey)?.has(n.event.id)).map((n) => n.event.id);
}
function Po(t) {
  return {
    ...t,
    status: "cancelled",
    savedParentEventIds: [],
    savedDirectReplyCount: 0
  };
}
class $y {
  deletionFetchService;
  deletionRequestsRepository;
  childInteractionsRepository;
  now;
  constructor(e = {}) {
    this.deletionFetchService = e.deletionFetchService ?? Pi, this.deletionRequestsRepository = e.deletionRequestsRepository ?? ro, this.childInteractionsRepository = e.childInteractionsRepository ?? Ml, this.now = e.now ?? Date.now;
  }
  saveRepairDirectReplies(e, n) {
    let r = !0, o = null;
    const s = () => r && n.isActive?.() !== !1;
    return {
      promise: (async () => {
        const c = Fy(n.items);
        if (c.length === 0)
          return wo;
        const u = await this.filterKnownDeletedDirectReplies(c);
        let b = u.deletedEventIds;
        if (!s())
          return Po({
            ...wo,
            deletedEventIds: b
          });
        let g = u.visibleItems, y = !1;
        if (g.length > 0) {
          o = this.deletionFetchService.fetchDeletionRequests(e, {
            targets: g.map((w) => ({
              event: w.event,
              relayUrls: w.relayUrls
            })),
            relayHints: n.relayHints,
            relayConfig: n.relayConfig
          });
          const f = await o.promise;
          if (o = null, !s() || f.status === "cancelled")
            return Po({
              ...wo,
              deletedEventIds: b,
              deletionConfirmationIncomplete: y || f.status !== "success"
            });
          if (y = f.status !== "success", f.events.length > 0 && await this.deletionRequestsRepository.upsertValidDeletionRequests({
            targetEvents: g.map((w) => w.event),
            deletionEvents: f.events,
            fetchedAt: f.fetchedAt
          }), !s())
            return Po({
              ...wo,
              deletedEventIds: b,
              deletionConfirmationIncomplete: y
            });
          const R = await this.filterKnownDeletedDirectReplies(g);
          g = R.visibleItems, b = Array.from(/* @__PURE__ */ new Set([
            ...b,
            ...R.deletedEventIds
          ]));
        }
        if (!s())
          return Po({
            ...wo,
            deletedEventIds: b,
            deletionConfirmationIncomplete: y
          });
        const x = await this.saveVisibleDirectReplies(
          g,
          n.fetchedAt ?? this.now(),
          s
        );
        return s() ? {
          ...x,
          status: "saved",
          deletedEventIds: b,
          deletionConfirmationIncomplete: y
        } : Po({
          ...x,
          deletedEventIds: b,
          deletionConfirmationIncomplete: y
        });
      })(),
      cancel: () => {
        r = !1, o?.cancel();
      }
    };
  }
  async filterKnownDeletedDirectReplies(e) {
    const n = await this.deletionRequestsRepository.getDeletedTargets(
      e.map((s) => ({
        targetAuthorPubkey: s.event.pubkey,
        targetEventId: s.event.id
      }))
    ), r = Hy(e, n);
    await this.purgeDeletedReplyCache(r);
    const o = new Set(r);
    return {
      visibleItems: e.filter((s) => !o.has(s.event.id)),
      deletedEventIds: r
    };
  }
  async purgeDeletedReplyCache(e) {
    for (const n of new Set(e))
      await this.childInteractionsRepository.deleteChildInteractionByEventId(n);
  }
  async saveVisibleDirectReplies(e, n, r) {
    const o = /* @__PURE__ */ new Map();
    for (const c of e) {
      const u = o.get(c.parentEventId) ?? [];
      u.push({
        event: c.event,
        ...c.relayUrls ? { relayUrls: c.relayUrls } : {}
      }), o.set(c.parentEventId, u);
    }
    const s = [];
    let l = 0;
    for (const [c, u] of o.entries()) {
      if (!r())
        break;
      const b = await this.childInteractionsRepository.upsertChildInteractions({
        parentEventId: c,
        events: u,
        fetchedAt: n
      }), g = b.insertedCount + b.updatedCount;
      g > 0 && (s.push(c), l += g);
    }
    return {
      status: "saved",
      savedParentEventIds: s,
      savedDirectReplyCount: l
    };
  }
}
const Ny = new $y(), By = 150, fc = 30, Uy = 10, qy = 2, tl = 250, Vy = 6e3, nl = 8, jy = 6e4, Ky = kd, vc = {
  status: "success",
  targetParentEventIds: [],
  checkedParentEventIds: [],
  savedParentEventIds: [],
  savedDirectReplyCount: 0,
  attemptedChunkCount: 0,
  saturatedChunkCount: 0,
  incompleteParentEventIds: [],
  deletionConfirmationIncomplete: !1
};
function Yy(t, e) {
  const n = /* @__PURE__ */ new Map();
  for (const r of e)
    if (!(r.kind !== 1 && r.kind !== 42 || r.pubkeyHex !== t || !r.eventId || n.has(r.eventId)) && (n.set(r.eventId, r), n.size >= By))
      break;
  return Array.from(n.values());
}
function xl(t, e) {
  const n = [];
  for (let r = 0; r < t.length; r += e)
    n.push(t.slice(r, r + e));
  return n;
}
function zy(t, e) {
  return e.includeDirectReplies ? [1, 42].flatMap(
    (n) => xl(
      t.filter((r) => r.kind === n),
      fc
    ).map((r) => ({ posts: r, depth: 0 }))
  ) : xl(
    t,
    fc
  ).map((n) => ({ posts: n, depth: 0 }));
}
function Qy(t) {
  return Array.from(t.values()).map((e) => ({
    event: e.event,
    relayUrls: Array.from(e.relayUrls).sort((n, r) => n.localeCompare(r))
  })).sort((e, n) => e.event.created_at !== n.event.created_at ? n.event.created_at - e.event.created_at : e.event.id.localeCompare(n.event.id));
}
class Wy {
  directReplySaveService;
  childInteractionsRepository;
  quoteVisibleRangeRepairExecutor;
  console;
  setTimeoutFn;
  clearTimeoutFn;
  now;
  lastFetchTimeoutWarnAt = 0;
  constructor(e = {}) {
    this.directReplySaveService = e.directReplySaveService ?? Ny, this.childInteractionsRepository = e.childInteractionsRepository ?? Ml, this.quoteVisibleRangeRepairExecutor = e.quoteVisibleRangeRepairExecutor, this.console = e.console ?? (typeof globalThis.console < "u" ? globalThis.console : { warn: () => {
    }, error: () => {
    } }), this.setTimeoutFn = e.setTimeoutFn ?? ((n, r) => setTimeout(n, r)), this.clearTimeoutFn = e.clearTimeoutFn ?? ((n) => clearTimeout(n)), this.now = e.now ?? Date.now;
  }
  repairVisibleRangeChildInteractions(e, n) {
    return this.repairVisibleRangeChildInteractionsInternal(
      e,
      n,
      {
        includeDirectReplies: !0,
        includeReactions: !0
      }
    );
  }
  repairVisibleRangeRelations(e, n) {
    const r = yh(
      n.relationKinds ?? Ky
    ), o = this.repairVisibleRangeChildInteractionsInternal(
      e,
      n,
      {
        includeDirectReplies: r.includes("reply"),
        includeReactions: r.includes("reaction")
      }
    );
    return {
      promise: (async () => {
        const l = await o.promise;
        let c = !1;
        const u = n.quoteVisibleRangeRepairExecutor ?? this.quoteVisibleRangeRepairExecutor;
        return r.includes("quote") && l.status !== "cancelled" && n.isActive?.() !== !1 && u && (await u(e, n), c = !0), {
          ...l,
          relationKinds: r,
          quoteRepairApplied: c
        };
      })(),
      cancel: () => o.cancel()
    };
  }
  repairVisibleRangeChildInteractionsInternal(e, n, r) {
    let o = !0;
    const s = /* @__PURE__ */ new Set(), l = /* @__PURE__ */ new Set(), c = () => o && n.isActive?.() !== !1, u = Yy(n.ownerPubkeyHex, n.visiblePosts), b = u.map((y) => y.eventId);
    return {
      promise: (async () => {
        if (u.length === 0)
          return {
            ...vc,
            targetParentEventIds: b
          };
        const y = /* @__PURE__ */ new Set(), x = /* @__PURE__ */ new Set();
        let f = 0, R = 0, w = 0, m = !1, i = !1;
        const O = async (X) => {
          const me = [];
          let D = 0;
          const ee = Math.min(
            qy,
            X.length
          ), ve = async () => {
            for (; c(); ) {
              const Re = X[D++];
              if (!Re)
                return;
              R += 1;
              const ae = this.fetchCandidates(
                e,
                Re.posts,
                n.relayConfig,
                r
              );
              s.add(ae);
              const fe = await ae.promise;
              if (s.delete(ae), !c() || fe.status === "cancelled")
                return;
              fe.status !== "success" && (i = !0), fe.saturated && (w += 1, Re.depth === 0 ? me.push(
                ...xl(
                  Re.posts,
                  Uy
                ).map((xe) => ({ posts: xe, depth: 1 }))
              ) : i = !0);
              const ne = r.includeDirectReplies ? this.toDirectReplyItems(
                Re.posts,
                fe.items
              ) : [], ke = r.includeReactions ? this.toReactionItems(
                Re.posts,
                fe.items
              ) : [], He = fe.status === "success" && !fe.saturated;
              if (ne.length === 0 && ke.length === 0) {
                He && Re.posts.forEach((xe) => x.add(xe.eventId));
                continue;
              }
              if (ne.length > 0) {
                const xe = this.directReplySaveService.saveRepairDirectReplies(e, {
                  items: ne,
                  relayHints: [
                    ...this.collectParentRelayHints(Re.posts),
                    ...fe.relayUrls
                  ],
                  relayConfig: n.relayConfig,
                  fetchedAt: fe.fetchedAt,
                  isActive: c
                });
                l.add(xe);
                const se = await xe.promise;
                if (l.delete(xe), !c() || se.status === "cancelled")
                  return;
                se.savedParentEventIds.forEach(
                  (G) => y.add(G)
                ), f += se.savedDirectReplyCount, m = m || se.deletionConfirmationIncomplete;
              }
              if (ke.length > 0) {
                const xe = await this.saveReactionInteractions(
                  ke,
                  fe.fetchedAt,
                  c
                );
                if (!c())
                  return;
                xe.savedParentEventIds.forEach(
                  (se) => y.add(se)
                );
              }
              He && Re.posts.forEach((xe) => x.add(xe.eventId));
            }
          };
          return await Promise.all(Array.from({ length: ee }, () => ve())), me;
        }, W = await O(zy(u, r));
        if (c() && W.length > 0 && await O(W), !c())
          return {
            ...vc,
            status: "cancelled",
            targetParentEventIds: b,
            attemptedChunkCount: R,
            saturatedChunkCount: w,
            deletionConfirmationIncomplete: m
          };
        const $ = b.filter(
          (X) => !x.has(X)
        );
        return {
          status: i || $.length > 0 ? "partial" : "success",
          targetParentEventIds: b,
          checkedParentEventIds: Array.from(x),
          savedParentEventIds: Array.from(y),
          savedDirectReplyCount: f,
          attemptedChunkCount: R,
          saturatedChunkCount: w,
          incompleteParentEventIds: $,
          deletionConfirmationIncomplete: m
        };
      })(),
      cancel: () => {
        o = !1, s.forEach((y) => y.cancel()), l.forEach((y) => y.cancel());
      }
    };
  }
  toDirectReplyItems(e, n) {
    const r = new Map(e.flatMap((o) => {
      const s = es({
        event: {
          id: o.eventId,
          kind: o.kind,
          tags: o.tags,
          created_at: o.createdAt
        },
        relayHints: [
          ...o.relayHints,
          ...o.acceptedRelays,
          ...o.fetchedRelays ?? []
        ]
      });
      return s ? [[o.eventId, s]] : [];
    }));
    return n.flatMap((o) => {
      const s = ns(o.event).parentId, l = s ? r.get(s) : null;
      return !s || !l || !ys({ child: o.event, parent: l }).valid ? [] : [{
        parentEventId: s,
        event: o.event,
        relayUrls: o.relayUrls
      }];
    });
  }
  toReactionItems(e, n) {
    const r = new Set(e.map((o) => o.eventId));
    return n.flatMap((o) => {
      if (o.event.kind !== 7)
        return [];
      const s = ef(o.event);
      return !s || !r.has(s) || o.event.id === s ? [] : [{
        parentEventId: s,
        event: o.event,
        relayUrls: o.relayUrls
      }];
    });
  }
  async saveReactionInteractions(e, n, r) {
    const o = /* @__PURE__ */ new Map();
    for (const l of e) {
      const c = o.get(l.parentEventId) ?? [];
      c.push({
        event: l.event,
        relayUrls: l.relayUrls
      }), o.set(l.parentEventId, c);
    }
    const s = [];
    for (const [l, c] of o.entries()) {
      if (!r())
        break;
      const u = await this.childInteractionsRepository.upsertChildInteractions({
        parentEventId: l,
        events: c,
        fetchedAt: n
      });
      u.insertedCount + u.updatedCount > 0 && s.push(l);
    }
    return {
      savedParentEventIds: s
    };
  }
  fetchCandidates(e, n, r, o) {
    const s = this.resolveRelayUrls(n, r), l = n.map((i) => i.eventId), c = kl(), u = /* @__PURE__ */ new Map();
    let b = 0, g = !1, y, x, f;
    const R = () => {
      x !== void 0 && (this.clearTimeoutFn(x), x = void 0), y?.unsubscribe?.(), y = void 0;
    }, w = (i) => {
      const O = Qy(u);
      return {
        status: i,
        items: O,
        rawCount: b,
        saturated: b >= tl || O.length >= tl,
        fetchedAt: this.now(),
        relayUrls: s
      };
    };
    return {
      promise: new Promise((i) => {
        const O = (W) => {
          g || (g = !0, R(), i(w(W)));
        };
        f = O;
        try {
          if (l.length === 0) {
            O("success");
            return;
          }
          y = Dl(e, c, {
            on: s.length > 0 ? { relays: s } : { defaultReadRelays: !0 }
          }).subscribe({
            next: ($) => {
              b += 1, this.handleCandidatePacket(u, $);
            },
            complete: () => O("success"),
            error: ($) => {
              this.console.error("post_history_visible_child_interaction_repair_fetch_error", $), O("error");
            }
          });
          const W = Array.from(/* @__PURE__ */ new Set([
            ...o.includeDirectReplies ? n.map(($) => $.kind) : [],
            ...o.includeReactions ? [7] : []
          ])).filter(($) => $ === 1 || $ === 7 || $ === 42);
          c.emit({
            kinds: W,
            "#e": l,
            limit: tl
          }), c.over(), x = this.setTimeoutFn(() => {
            this.warnCandidateFetchTimeout(), O("timeout");
          }, Vy);
        } catch (W) {
          this.console.error("post_history_visible_child_interaction_repair_request_error", W), O("error");
        }
      }),
      cancel: () => f?.("cancelled")
    };
  }
  warnCandidateFetchTimeout() {
    const e = this.now();
    e - this.lastFetchTimeoutWarnAt < jy || (this.lastFetchTimeoutWarnAt = e, this.console.warn("post_history_visible_child_interaction_repair_fetch_timeout"));
  }
  handleCandidatePacket(e, n) {
    const r = n.event;
    if (!r?.id || r.kind !== 1 && r.kind !== 7 && r.kind !== 42)
      return;
    const o = Mn.sanitizeExternalRelayUrls(
      typeof n.from == "string" ? [n.from] : [],
      { limit: 1 }
    )[0], s = e.get(r.id);
    if (!s) {
      e.set(r.id, {
        event: r,
        relayUrls: new Set(o ? [o] : [])
      });
      return;
    }
    if (!su(s.event, r)) {
      this.console.warn("post_history_visible_child_interaction_repair_packet_conflict");
      return;
    }
    o && s.relayUrls.add(o);
  }
  collectParentRelayHints(e) {
    return e.flatMap((n) => [
      ...n.relayHints ?? [],
      ...n.acceptedRelays ?? [],
      ...n.fetchedRelays ?? []
    ]);
  }
  resolveRelayUrls(e, n) {
    const r = Tl(
      this.collectParentRelayHints(e),
      nl
    );
    if (r)
      return r;
    const o = n ? [
      ...Mn.extractReadRelays(n),
      ...Mn.extractWriteRelays(n)
    ] : [], s = Mn.sanitizeExternalRelayUrls([
      ...this.collectParentRelayHints(e),
      ...o
    ], { limit: nl });
    return s.length > 0 ? s : Mn.sanitizeExternalRelayUrls(
      Nl,
      { limit: nl }
    );
  }
}
const Jy = new Wy(), Gy = 300 * 1e3;
function Zy(t, e, n) {
  const r = new Set(
    n.map((s) => s.eventId)
  ), o = /* @__PURE__ */ new Map();
  for (const s of e)
    s.kind !== 1 && s.kind !== 42 || s.pubkeyHex !== t || !r.has(s.eventId) || o.has(s.eventId) || o.set(s.eventId, s);
  return Array.from(o.values());
}
function Xy(t, e, n, r, o = Gy) {
  return t.filter((s) => {
    if (n.has(s))
      return !1;
    const l = e.get(s);
    return typeof l != "number" || r - l >= o;
  });
}
function pc(t, e) {
  return {
    status: e ? t.status : "cancelled",
    savedDirectReplyCount: t.savedDirectReplyCount
  };
}
function em({
  getShow: t,
  getPubkeyHex: e,
  getRxNostr: n,
  getRelayConfig: r,
  getLoadedPosts: o,
  onChildInteractionBadgeRefreshRequested: s,
  onQuoteVisibleRangeRefreshRequested: l,
  quoteVisibleRangeRepairExecutor: c,
  relationRepairService: u = Jy,
  triggerDeletionLifecycle: b = Ol,
  now: g = Date.now
}) {
  let y = null, x = 0, f = 0, R = !1;
  const w = /* @__PURE__ */ new Set(), m = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Set();
  function O(se, G) {
    return !R && se === x && G();
  }
  function W(se, G, de) {
    return !R && se === f && t() && e() === G && n() === de;
  }
  function $(se) {
    const G = o();
    G.length === 0 || se.length === 0 || Promise.resolve(
      s(G, se)
    ).catch(() => {
    });
  }
  async function X(se) {
    const G = o();
    G.length === 0 || se.length === 0 || await s(G, se);
  }
  function me(se) {
    se.length !== 0 && Promise.resolve(
      l(se)
    ).catch(() => {
    });
  }
  async function D(se) {
    if (!se.isActive())
      return;
    const G = Ly(se.source, {
      relationKinds: se.result.relationKinds,
      savedParentEventIds: se.result.savedParentEventIds,
      checkedParentEventIds: se.result.checkedParentEventIds,
      quoteRepairApplied: se.result.quoteRepairApplied,
      status: se.result.status
    });
    if (G.shouldRefreshQuotePreviews && se.isActive() && me(se.quoteRefreshPosts), !(G.parentEventIds.length === 0 || !se.isActive())) {
      if (se.awaitBadgeRefresh) {
        await X(G.parentEventIds);
        return;
      }
      $(G.parentEventIds);
    }
  }
  function ee(se) {
    return u.repairVisibleRangeRelations(se.rxNostr, {
      ownerPubkeyHex: se.ownerPubkeyHex,
      visiblePosts: se.visiblePosts,
      relationKinds: kd,
      quoteVisibleRangeRepairExecutor: c,
      relayConfig: r(),
      isActive: se.isActive
    });
  }
  function ve(se, G, de, Se) {
    G.length !== 0 && b({
      source: se,
      parentEventIds: G,
      rxNostr: de,
      relayConfig: r(),
      isActive: Se
    }).then(($e) => {
      $e.status === "cancelled" || $e.deletedReactionEventIds.length === 0 && $e.deletedReplyEventIds.length === 0 || !Se() || $($e.checkedParentEventIds);
    }).catch(() => {
    });
  }
  async function Re(se) {
    if (se.visiblePosts.length === 0)
      return {
        status: "success",
        savedDirectReplyCount: 0
      };
    const G = ++x, de = () => O(G, se.isActive);
    ve(
      "listing-current-view",
      se.visiblePosts.map(($e) => $e.eventId),
      se.rxNostr,
      de
    );
    const Se = ee({
      ...se,
      isActive: de
    });
    y = Se;
    try {
      const $e = await Se.promise, te = de();
      return y === Se && (y = null), $e.status === "cancelled" || !te ? pc($e, !1) : (await D({
        source: "listing-manual-refetch",
        result: $e,
        quoteRefreshPosts: se.visiblePosts,
        isActive: de,
        awaitBadgeRefresh: !0
      }), pc($e, de()));
    } catch ($e) {
      throw y === Se && (y = null), $e;
    }
  }
  async function ae(se) {
    if (se.visiblePosts.length !== 0)
      try {
        ve(
          "listing-current-view",
          se.visiblePosts.map((Se) => Se.eventId),
          se.rxNostr,
          se.isActive
        );
        const de = await ee(se).promise;
        if (de.status === "cancelled" || !se.isActive())
          return;
        await D({
          source: "listing-current-view",
          result: de,
          quoteRefreshPosts: se.visiblePosts,
          isActive: se.isActive,
          awaitBadgeRefresh: !0
        });
      } catch {
      }
  }
  function fe(se) {
    const G = e(), de = n(), Se = f;
    if (!G || se.length === 0)
      return;
    const $e = Zy(
      G,
      se,
      o()
    );
    if ($e.length === 0)
      return;
    const te = $e.map((q) => q.eventId);
    if (!de)
      return;
    const M = () => W(
      Se,
      G,
      de
    );
    ve(
      "listing-older-reveal",
      te,
      de,
      M
    );
    const F = Xy(
      te,
      m,
      i,
      g()
    ), U = new Set(F), ce = $e.filter(
      (q) => U.has(q.eventId)
    );
    if (ce.length === 0)
      return;
    ce.forEach((q) => {
      i.add(q.eventId);
    });
    const pe = ee({
      ownerPubkeyHex: G,
      rxNostr: de,
      visiblePosts: ce,
      isActive: M
    });
    w.add(pe), pe.promise.then((q) => {
      !M() || q.status === "cancelled" || (D({
        source: "listing-older-reveal",
        result: q,
        quoteRefreshPosts: ce,
        isActive: M,
        awaitBadgeRefresh: !1
      }), q.checkedParentEventIds.length > 0 && q.checkedParentEventIds.forEach((De) => {
        m.set(De, g());
      }));
    }).catch(() => {
    }).finally(() => {
      Se === f && (w.delete(pe), ce.forEach((q) => {
        i.delete(q.eventId);
      }));
    });
  }
  function ne() {
    x += 1, y?.cancel(), y = null;
  }
  function ke() {
    f += 1, w.forEach((se) => se.cancel()), w.clear(), m.clear(), i.clear();
  }
  function He() {
    ne(), ke();
  }
  function xe() {
    R = !0, He();
  }
  return {
    repairCurrentView: Re,
    repairJump: ae,
    scheduleOlderRevealRepair: fe,
    cancelCurrentViewRepair: ne,
    resetOlderRevealRepairContext: ke,
    resetAllRepairs: He,
    dispose: xe
  };
}
const tm = "postHistoryJumpCacheAnchors:", rl = 200, al = 720 * 60 * 60 * 1e3;
function Jo(t) {
  return `${tm}${t}`;
}
function nm(t) {
  if (!t || typeof t != "object")
    return !1;
  const e = t;
  return Number.isFinite(e.centerCreatedAt) && Number.isFinite(e.radiusSec) && (e.radiusSec ?? 0) > 0 && Number.isFinite(e.fetchedAt);
}
function rm(t) {
  if (!t || typeof t != "object")
    return !1;
  const e = t;
  return typeof e.pubkeyHex == "string" && Array.isArray(e.anchors) && e.anchors.every((n) => nm(n));
}
function gc(t, e, n, r) {
  const o = e - Math.max(0, Math.trunc(n));
  return t.filter(
    (s) => Number.isFinite(s.centerCreatedAt) && Number.isFinite(s.radiusSec) && s.radiusSec > 0 && Number.isFinite(s.fetchedAt) && s.fetchedAt >= o
  ).sort((s, l) => l.fetchedAt - s.fetchedAt).slice(0, Math.max(1, Math.trunc(r)));
}
function am(t, e, n) {
  return t.findIndex(
    (r) => Math.abs(r.centerCreatedAt - e) <= Math.max(r.radiusSec, n)
  );
}
class sm {
  constructor(e = Ll, n = Date.now) {
    this.db = e, this.now = n;
  }
  async getForPubkey(e, n = {}) {
    const r = n.ttlMs ?? al, o = n.maxCount ?? rl, s = await this.db.meta.get(Jo(e));
    return !s || !rm(s.value) ? [] : gc(s.value.anchors, this.now(), r, o);
  }
  async addForPubkey(e) {
    const n = e.ttlMs ?? al, r = e.maxCount ?? rl, o = Number.isFinite(e.fetchedAt) ? Math.trunc(e.fetchedAt ?? 0) : this.now(), s = Number.isFinite(e.centerCreatedAt) ? Math.trunc(e.centerCreatedAt) : 0, l = Number.isFinite(e.radiusSec) ? Math.max(1, Math.trunc(e.radiusSec ?? 1)) : 1, c = await this.getForPubkey(e.pubkeyHex, {
      ttlMs: n,
      maxCount: r
    }), u = am(
      c,
      s,
      l
    ), b = [...c];
    if (u >= 0) {
      const y = b[u];
      b[u] = {
        centerCreatedAt: s,
        radiusSec: Math.max(y.radiusSec, l),
        fetchedAt: Math.max(y.fetchedAt, o)
      };
    } else
      b.unshift({
        centerCreatedAt: s,
        radiusSec: l,
        fetchedAt: o
      });
    const g = gc(
      b,
      this.now(),
      n,
      r
    );
    return await this.db.meta.put({
      key: Jo(e.pubkeyHex),
      value: {
        pubkeyHex: e.pubkeyHex,
        anchors: g
      },
      updatedAt: this.now()
    }), g;
  }
  async hasNearbyAnchorForPubkey(e) {
    const n = Number.isFinite(e.targetCreatedAt) ? Math.trunc(e.targetCreatedAt) : 0;
    return (await this.getForPubkey(e.pubkeyHex, {
      ttlMs: e.ttlMs,
      maxCount: e.maxCount
    })).some(
      (o) => Math.abs(n - o.centerCreatedAt) <= o.radiusSec
    );
  }
  async reconcileWithFrontier(e) {
    const n = Number.isFinite(e.frontierVisibleUntil) ? Math.trunc(e.frontierVisibleUntil) : 0, r = Number.isFinite(e.toleranceSec) ? Math.max(0, Math.trunc(e.toleranceSec ?? 0)) : 0, o = e.ttlMs ?? al, s = e.maxCount ?? rl, l = await this.getForPubkey(e.pubkeyHex, {
      ttlMs: o,
      maxCount: s
    }), c = l.filter((g) => {
      const y = g.centerCreatedAt + g.radiusSec;
      return Math.max(0, n - y) <= r;
    }), u = l.filter((g) => !c.includes(g)), b = c.length > 0 ? Math.min(
      n,
      ...c.map((g) => Math.max(0, g.centerCreatedAt - g.radiusSec))
    ) : n;
    return c.length > 0 && await this.db.meta.put({
      key: Jo(e.pubkeyHex),
      value: {
        pubkeyHex: e.pubkeyHex,
        anchors: u
      },
      updatedAt: this.now()
    }), {
      nextVisibleUntil: b,
      removedCount: c.length,
      anchors: u
    };
  }
  async clearForPubkey(e) {
    e && await this.db.meta.delete(Jo(e));
  }
}
const xo = new sm(), mh = "postHistoryVisibleRange:";
function sl(t, e) {
  return `${mh}${t}:${e}`;
}
function om(t) {
  if (!t || typeof t != "object")
    return !1;
  const e = t;
  return typeof e.pubkeyHex == "string" && typeof e.kindsKey == "string" && (typeof e.visibleUntil == "number" || e.visibleUntil === null);
}
function im(t) {
  const e = /* @__PURE__ */ new Set();
  for (const n of t)
    Number.isFinite(n) && e.add(Math.trunc(n));
  return [...e].sort((n, r) => n - r).join(",");
}
class lm {
  constructor(e = Ll, n = Date.now) {
    this.db = e, this.now = n;
  }
  async get(e, n) {
    const r = await this.db.meta.get(sl(e, n));
    return !r || !om(r.value) ? null : {
      ...r.value,
      updatedAt: r.updatedAt
    };
  }
  async save(e) {
    const n = this.now(), r = {
      ...e,
      updatedAt: n
    };
    return await this.db.meta.put({
      key: sl(e.pubkeyHex, e.kindsKey),
      value: {
        pubkeyHex: e.pubkeyHex,
        kindsKey: e.kindsKey,
        visibleUntil: e.visibleUntil
      },
      updatedAt: n
    }), r;
  }
  async clear(e, n) {
    await this.db.meta.delete(sl(e, n));
  }
  async clearForPubkey(e) {
    if (!e) return;
    const n = `${mh}${e}:`, r = await this.db.meta.filter((o) => o.key.startsWith(n)).primaryKeys();
    await this.db.meta.bulkDelete(r);
  }
}
const Gs = new lm();
function dm(t) {
  return t.map((e) => e.event?.id).filter((e) => !!e);
}
function cm({
  currentPosts: t,
  olderPosts: e,
  anchorEventId: n = null,
  maxVisiblePosts: r,
  keepAbove: o
}) {
  const s = [...t, ...e];
  if (s.length <= r)
    return {
      posts: s,
      didTrimForOlderAppend: !1,
      didDeferOlderPosts: !1
    };
  if (t.length < r) {
    const g = Math.max(0, r - t.length), y = e.slice(0, g);
    return {
      posts: [...t, ...y],
      didTrimForOlderAppend: !1,
      didDeferOlderPosts: y.length < e.length
    };
  }
  const l = typeof n == "string" ? s.findIndex((g) => g.eventId === n) : -1, c = (g) => {
    const y = s.slice(g, g + r), x = Math.max(0, y.length - Math.max(0, t.length - g));
    return {
      posts: y,
      didTrimForOlderAppend: !0,
      didDeferOlderPosts: x < e.length
    };
  };
  if (l < 0)
    return c(s.length - r);
  const u = Math.max(0, s.length - r), b = Math.min(u, Math.max(0, l - o));
  return c(b);
}
function um(t, e) {
  const n = new Set(t.map((r) => r.eventId));
  return e.filter((r) => !n.has(r.eventId));
}
const hi = {
  loadedPosts: [],
  searchPosts: [],
  searchQuery: "",
  totalCount: 0,
  totalCountKnown: !1,
  totalCountFailed: !1,
  searchTotalCount: 0,
  searchHasNext: !1,
  hasMoreRemote: !1,
  nextUntil: null,
  lastDialogOpenRefreshAt: null,
  visibleUntil: null,
  hasJumpCacheAnchors: !1,
  hasOlderLocal: !1,
  hasNewerLocal: !1
}, Io = im([...iu]), yc = 1440 * 60, mc = 4320 * 60, hm = 100, fm = 720 * 60;
function ol(t, e) {
  if (t.length === 0)
    return !0;
  const n = t[t.length - 1]?.createdAt;
  return Number.isFinite(n) ? (n ?? 0) > e : !0;
}
const bc = 720 * 60, vm = 3600, il = [
  720 * 60,
  1440 * 60,
  4320 * 60,
  10080 * 60,
  336 * 60 * 60,
  720 * 60 * 60
], pm = 6, gm = 720 * 60 * 60;
function ym({
  status: t,
  changed: e,
  didCursorAdvanceOlder: n,
  hitLimit: r,
  continuedWithinWindow: o,
  attemptIndex: s,
  maxAttempts: l,
  totalVisibleAdded: c,
  targetVisibleAdded: u,
  exploredSeconds: b,
  maxExploreSeconds: g
}) {
  return t !== "success" ? { shouldContinue: !1, reason: `status-${t}` } : n ? r && !o ? {
    shouldContinue: !1,
    reason: "hit-limit-continuation-unavailable"
  } : c >= u ? {
    shouldContinue: !1,
    reason: "target-visible-added-reached"
  } : b >= g ? { shouldContinue: !1, reason: "max-explore-seconds-reached" } : s >= l ? { shouldContinue: !1, reason: "max-attempts-reached" } : {
    shouldContinue: !0,
    reason: e ? "small-batch-continue" : "empty-window-continue"
  } : { shouldContinue: !1, reason: "cursor-not-advanced" };
}
const Dd = /* @__PURE__ */ new Map();
async function mm({
  nextUntil: t,
  visibleOldestCreatedAt: e,
  pubkeyHex: n,
  getOldestCreatedAt: r,
  getNowSeconds: o = () => Math.floor(Date.now() / 1e3)
}) {
  if (typeof t == "number")
    return t;
  if (typeof e == "number")
    return e;
  const s = await r(n);
  if (typeof s == "number")
    return s;
  const l = o();
  return Number.isFinite(l) ? l : null;
}
function Xr(t) {
  if (typeof t != "string")
    return null;
  const e = t.trim();
  return e.length > 0 ? e : null;
}
function Il(t) {
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
function bm(t) {
  const e = Xr(t);
  return Il(e ? Dd.get(e) ?? hi : hi);
}
function ll(t, e) {
  const n = Xr(t);
  n && Dd.set(n, Il(e));
}
function Cm(t) {
  const e = Xr(t);
  e && Dd.delete(e);
}
function wm({
  getShow: t,
  getPubkeyHex: e,
  getRxNostr: n,
  getRelayConfig: r,
  getSessionScrollState: o = () => null,
  onSessionScrollStateInvalidated: s = () => {
  },
  onSavedAuthoredPosts: l = () => {
  },
  onChildInteractionBadgeRefreshRequested: c = () => {
  },
  onQuoteVisibleRangeRefreshRequested: u = () => {
  },
  quoteVisibleRangeRepairExecutor: b = void 0,
  pageSize: g = ou,
  searchDebounceMs: y = 250
}) {
  const x = gy(e()), f = bm(e()), R = f.searchQuery === x.searchQuery && x.searchQuery.length > 0, w = f.totalCountKnown ?? f.totalCount > 0, m = f.totalCountFailed ? "failed" : w ? "ready" : "unknown", i = lr({
    loadedPosts: f.loadedPosts,
    searchPosts: R ? f.searchPosts : [],
    searchInput: x.searchInput,
    searchQuery: x.searchQuery,
    currentPage: 1,
    searchPage: R ? x.searchPage : 1,
    totalCount: f.totalCount,
    totalCountKnown: w,
    totalCountStatus: m,
    searchTotalCount: f.searchTotalCount,
    searchHasNext: f.searchHasNext,
    syncStatus: "idle",
    currentViewRefetchStatus: "idle",
    currentViewRefetchMessageKey: null,
    currentViewRefetchMessageValues: null,
    hasMoreRemote: f.hasMoreRemote,
    nextUntil: f.nextUntil,
    lastDialogOpenRefreshAt: f.lastDialogOpenRefreshAt,
    visibleUntil: f.visibleUntil,
    hasJumpCacheAnchors: f.hasJumpCacheAnchors,
    hasOlderLocal: f.hasOlderLocal,
    hasNewerLocal: f.hasNewerLocal,
    listingMode: "contiguous",
    sparseSource: null,
    hasSavedPostsOutsideVisibleRange: !1,
    latestOlderBackfillUiResult: null
  });
  let O = 0, W = !1, $ = ye(!1), X = ye(null), me = null, D = 0, ee = null, ve = 0, Re = ye(!1), ae = ye("idle"), fe = !1, ne = !1, ke = null, He = ye("idle"), xe = 0, se = Xr(e()), G = ye(lr(se)), de = null, Se = null, $e = 0, te = null, M = null, F = null, U = null, ce = n(), pe = R ? x.searchQuery : "", q = !R;
  const De = lr({
    windowSeconds: bc,
    nextUntil: null,
    consecutiveEmptyCount: 0,
    lastRange: null,
    continuationSince: null,
    exhausted: !1
  }), nt = Math.max(g * 3, g), rt = em({
    getShow: t,
    getPubkeyHex: e,
    getRxNostr: n,
    getRelayConfig: r,
    getLoadedPosts: () => i.loadedPosts,
    onChildInteractionBadgeRefreshRequested: c,
    onQuoteVisibleRangeRefreshRequested: u,
    quoteVisibleRangeRepairExecutor: b
  }), ue = I(() => i.searchQuery.length > 0), Fe = I(() => i.currentViewRefetchStatus === "refetching"), Ue = I(() => a(ue) ? i.searchPosts : i.loadedPosts), re = I(() => a(ue) ? i.searchPage : 1), Ge = I(() => a(ue) ? i.searchTotalCount : i.totalCount), kt = I(() => a(ue) ? Math.max(1, Math.ceil(i.searchTotalCount / g)) : 1), vt = I(() => !a(Fe) && a(ue) && i.searchPage > 1), xt = I(() => a(vt)), st = I(() => !a(Fe) && !a(Re) && a(ue) && i.searchHasNext), tn = I(() => a(st)), yt = I(() => !1), Ze = I(() => !a(Fe) && (a(ue) ? !a(Re) && i.searchHasNext : i.hasOlderLocal)), ot = I(() => !a(Fe) && !a(ue) && i.hasNewerLocal), It = I(() => !a(ue) && !a(Fe) && (i.listingMode === "sparse" || i.hasNewerLocal)), pt = I(() => a(Ue)[0]?.createdAt ?? null), ut = I(() => a(Ue).length > 0 ? a(Ue)[a(Ue).length - 1]?.createdAt ?? null : null), $n = I(() => !a(ue) && !a(Fe) && i.hasOlderLocal && (i.listingMode === "sparse" || !(typeof a(ut) == "number" && (i.visibleUntil === null ? i.hasJumpCacheAnchors : a(ut) < i.visibleUntil)))), nn = I(() => !a(ue) && !!e() && !!n() && !a(Fe) && !De.exhausted && i.syncStatus !== "syncing" && i.syncStatus !== "older-syncing"), An = I(() => !a(ue) && i.syncStatus === "older-syncing"), vr = I(() => !a(ue) && (i.syncStatus === "syncing" || i.syncStatus === "older-syncing")), Tr = I(() => !a(ue) && i.listingMode === "contiguous" && i.loadedPosts.length > 0 && !i.hasOlderLocal && i.syncStatus !== "syncing"), mt = I(() => !a(ue) && i.listingMode === "contiguous" && typeof i.visibleUntil == "number" && i.loadedPosts.length > 0 && !i.hasOlderLocal && i.hasSavedPostsOutsideVisibleRange), Ht = I(() => a(Ue).length), mn = I(() => !!e() && !!n() && !a(ue) && i.loadedPosts.length > 0 && !a(Fe) && i.syncStatus !== "syncing" && i.syncStatus !== "older-syncing"), bn = I(() => a(ue) || i.syncStatus === "idle" ? null : i.syncStatus === "syncing" || i.syncStatus === "older-syncing" ? "postHistory.syncing" : i.syncStatus === "synced" ? "postHistory.synced" : i.syncStatus === "no-more" ? null : "postHistory.syncFailed"), Yt = I(() => !a(ue) && (i.syncStatus === "syncing" || i.syncStatus === "older-syncing")), Cn = I(() => a(Yt) || a(Fe)), On = I(() => i.currentViewRefetchStatus === "refetching" ? "postHistory.repairing" : i.currentViewRefetchMessageKey), Yn = I(() => i.currentViewRefetchStatus === "refetching" ? null : i.currentViewRefetchMessageValues);
  function hn() {
    $e += 1, Se?.cancel(), Se = null;
  }
  function Xe() {
    M = null;
  }
  function Gn(v, P) {
    return !!v && !!P && v.postedAt === P.postedAt && v.createdAt === P.createdAt && v.eventId === P.eventId;
  }
  function bt(v) {
    return v === $e;
  }
  function St(v, P) {
    return t() && e() === v && P === O;
  }
  function Ne() {
    W = !1, p($, !1), p(X, null), me = null;
  }
  async function Dt(v, P, k) {
    return await da(), P() ? W ? (p(X, Xr(v), !0), !0) : k() ? (await new Promise((K) => {
      requestAnimationFrame(() => requestAnimationFrame(() => K()));
    }), P() ? (W = !0, p(X, Xr(v), !0), p($, !0), !0) : !1) : (W = !0, p(X, Xr(v), !0), p($, !0), !0) : !1;
  }
  function Rr() {
    te?.cancel(), te = null, rt.cancelCurrentViewRepair(), i.currentViewRefetchStatus === "refetching" && (i.currentViewRefetchStatus = "idle"), pr();
  }
  function pr() {
    F !== null && (clearTimeout(F), F = null);
  }
  function dr() {
    U !== null && (clearTimeout(U), U = null);
  }
  function Ln() {
    De.windowSeconds = bc, De.nextUntil = null, De.consecutiveEmptyCount = 0, De.lastRange = null, De.continuationSince = null, De.exhausted = !1;
  }
  function _r() {
    i.currentViewRefetchMessageKey = null, i.currentViewRefetchMessageValues = null, pr();
  }
  function ua() {
    pr();
    const v = /* @__PURE__ */ new Set([
      "postHistory.repairNoChanges",
      "postHistory.repairAdded",
      "postHistory.repairChildInteractionsAdded",
      "postHistory.repairPartialFailure",
      "postHistory.repairFetchFailed"
    ]);
    v.has(i.currentViewRefetchMessageKey ?? "") && (F = setTimeout(
      () => {
        i.currentViewRefetchMessageKey !== null && v.has(i.currentViewRefetchMessageKey) && (i.currentViewRefetchMessageKey = null, i.currentViewRefetchMessageValues = null), F = null;
      },
      3500
    ));
  }
  function fn() {
    dr(), !(i.syncStatus !== "synced" && i.syncStatus !== "failed") && (U = setTimeout(
      () => {
        (i.syncStatus === "synced" || i.syncStatus === "failed") && (i.syncStatus = "idle"), U = null;
      },
      3500
    ));
  }
  function wn() {
    ve += 1, p(Re, !1), p(ae, "idle"), Co.clearCache?.(), Ne(), i.searchInput = "", i.searchQuery = "", i.searchPage = 1, i.searchPosts = [], i.searchTotalCount = 0, i.searchHasNext = !1, pe = "", Er(), zr();
  }
  function gr() {
    Xe(), C(), i.loadedPosts = [], d({ known: !1, status: "unknown" }), i.currentPage = 1, i.syncStatus = "idle", i.hasMoreRemote = !1, i.nextUntil = null, i.lastDialogOpenRefreshAt = null, i.visibleUntil = null, i.hasJumpCacheAnchors = !1, i.hasOlderLocal = !1, i.hasNewerLocal = !1, i.listingMode = "contiguous", i.sparseSource = null, i.hasSavedPostsOutsideVisibleRange = !1, i.latestOlderBackfillUiResult = null, wn();
  }
  function yr() {
    const v = Xr(e());
    return !!v && v === a(G);
  }
  function Er() {
    yr() && cc(e(), {
      searchInput: i.searchInput,
      searchQuery: i.searchQuery,
      currentPage: i.currentPage,
      searchPage: i.searchPage
    });
  }
  function zr() {
    yr() && ll(e(), {
      loadedPosts: i.loadedPosts,
      searchPosts: i.searchPosts,
      searchQuery: i.searchQuery,
      totalCount: i.totalCount,
      totalCountKnown: i.totalCountKnown,
      totalCountFailed: i.totalCountStatus === "failed",
      searchTotalCount: i.searchTotalCount,
      searchHasNext: i.searchHasNext,
      hasMoreRemote: i.hasMoreRemote,
      nextUntil: i.nextUntil,
      lastDialogOpenRefreshAt: i.lastDialogOpenRefreshAt,
      visibleUntil: i.visibleUntil,
      hasJumpCacheAnchors: i.hasJumpCacheAnchors,
      hasOlderLocal: i.hasOlderLocal,
      hasNewerLocal: i.hasNewerLocal
    });
  }
  function Zn(v) {
    p(G, Xr(v), !0);
  }
  function Qr() {
    Xe(), C(), rt.resetOlderRevealRepairContext(), i.loadedPosts = [], i.searchPosts = [], d({ count: 0, known: !0, status: "ready" }), i.searchTotalCount = 0, i.searchHasNext = !1, i.currentPage = 1, i.searchPage = 1, i.hasMoreRemote = !1, i.nextUntil = null, i.lastDialogOpenRefreshAt = null, i.visibleUntil = null, i.hasJumpCacheAnchors = !1, i.hasOlderLocal = !1, i.hasNewerLocal = !1, i.listingMode = "contiguous", i.sparseSource = null, i.hasSavedPostsOutsideVisibleRange = !1, i.syncStatus = "idle", Ln(), _r(), dr(), wn(), fe = !0;
  }
  function ha() {
    return i.listingMode === "sparse" && (i.sparseSource === "saved" || i.sparseSource === "jump");
  }
  function Ar() {
    if (!ha())
      return !1;
    const v = e();
    return gr(), Ln(), _r(), dr(), uc(v), ll(v, { ...hi }), !0;
  }
  function Wr() {
    Xe(), O += 1, ve += 1, p(Re, !1), p(ae, "idle");
  }
  function $a() {
    const v = Ar();
    return hn(), Rr(), Wr(), C(), Co.clearCache?.(), rt.resetOlderRevealRepairContext(), v;
  }
  function Mr() {
    Ar(), hn(), Rr(), Wr(), C(), Co.clearCache?.(), rt.resetOlderRevealRepairContext(), i.syncStatus = "idle", Ln(), _r(), dr(), fe = !1, ne = !1, ke = null, xe += 1, p(He, "idle"), q = !1;
  }
  function fa(v) {
    const P = Fi(v);
    i.hasMoreRemote = P, i.nextUntil = P ? v.nextUntil : null;
  }
  function Is(v) {
    Fi(v) && i.nextUntil === null && (i.hasMoreRemote = !0, i.nextUntil = v.nextUntil);
  }
  async function va(v) {
    return typeof a(ut) == "number" && (i.visibleUntil === null ? i.hasJumpCacheAnchors : a(ut) < i.visibleUntil) ? a(ut) : typeof De.nextUntil == "number" ? De.nextUntil : mm({
      nextUntil: i.nextUntil,
      visibleOldestCreatedAt: a(ut),
      pubkeyHex: v,
      getOldestCreatedAt: (P) => at.getOldestCreatedAt(P)
    });
  }
  function Ia(v) {
    if (!Number.isFinite(v))
      return null;
    const P = Math.trunc(v) - 1;
    return P < 0 ? null : {
      since: (typeof De.continuationSince == "number" && De.continuationSince <= P ? De.continuationSince : null) ?? Math.max(0, P - De.windowSeconds),
      until: P,
      windowSeconds: De.windowSeconds
    };
  }
  function ta(v, P) {
    const k = [];
    return v.hasMore && k.push("hasMore"), v.rawCount >= P && k.push("rawCount"), v.perRelayCounts.some((K) => K.rawCount >= P) && k.push("perRelayRawCount"), k;
  }
  function pa(v) {
    return typeof v.oldestCreatedAt == "number" ? v.oldestCreatedAt : v.events.reduce(
      (P, k) => {
        const K = k.event.created_at;
        return Number.isFinite(K) && (P === null || K < P) ? Math.trunc(K) : P;
      },
      null
    );
  }
  function is(v, P) {
    De.nextUntil = v, De.continuationSince = P, De.exhausted = v === null, i.nextUntil = v, i.hasMoreRemote = v !== null;
  }
  function Sa(v, P, k) {
    ta(P, k), pa(P), P.rawCount ?? P.events.length, P.uniqueCount ?? P.events.length, typeof De.nextUntil == "number" && Ia(De.nextUntil);
  }
  function Na() {
    if (i.searchQuery)
      return [];
    const v = i.loadedPosts.map((K) => K.createdAt).filter((K) => Number.isFinite(K)).map((K) => Math.trunc(K));
    if (v.length === 0)
      return [];
    const P = Math.min(...v), k = Math.max(...v);
    return [
      {
        kinds: [...iu],
        rangeUnit: "custom",
        since: Math.max(0, P - yc),
        until: k + yc,
        limit: au
      }
    ];
  }
  async function ga(v) {
    return (await Gs.get(v, Io))?.visibleUntil ?? null;
  }
  async function Pn(v, P = null) {
    const k = await ga(v);
    return t() && e() === v && (P === null || P === O) && (i.visibleUntil = k), k;
  }
  async function Ba(v, P = null) {
    const K = (await xo.getForPubkey(v, { maxCount: 1 })).length > 0;
    return t() && e() === v && (P === null || P === O) && (i.hasJumpCacheAnchors = K), K;
  }
  async function Or(v, P) {
    const k = await ga(v), K = P.events.length === 0 ? null : Fi(P) ? P.nextUntil : typeof P.oldestCreatedAt == "number" ? P.oldestCreatedAt : null, z = typeof K == "number" ? typeof k == "number" ? Math.min(k, K) : K : k;
    return z !== k && await Gs.save({
      pubkeyHex: v,
      kindsKey: Io,
      visibleUntil: z
    }), i.visibleUntil = z, z;
  }
  async function Ss(v, P) {
    const k = await ga(v), K = pa(P), z = typeof K == "number" ? typeof k == "number" ? Math.min(k, K) : K : k;
    return z !== k && await Gs.save({
      pubkeyHex: v,
      kindsKey: Io,
      visibleUntil: z
    }), i.visibleUntil = z, z;
  }
  async function Ua(v, P, k) {
    if (typeof P != "number")
      return P;
    const K = k.filter((ie) => ie.source === "preferred" && ie.status === "complete" && typeof ie.since == "number" && typeof ie.until == "number" && ie.until >= P - 1).map((ie) => ie.since);
    if (K.length === 0)
      return P;
    const z = Math.min(P, ...K);
    return z === P ? P : (await Gs.save({
      pubkeyHex: v,
      kindsKey: Io,
      visibleUntil: z
    }), i.visibleUntil = z, z);
  }
  async function qa(v, P) {
    return typeof P == "number" ? at.countVisibleForPubkey(v, P) : at.countForPubkey(v);
  }
  async function ya(v, P) {
    if (typeof P == "number")
      return at.countVisibleForPubkey(v, P);
    const k = ee;
    return k?.pubkeyHex === v && (await k.promise, i.totalCountKnown) || i.totalCountKnown ? i.totalCount : at.countForPubkey(v);
  }
  function ma(v, P) {
    if (a(ue) || i.listingMode !== "contiguous" || i.sparseSource !== null || e() !== v || i.visibleUntil !== P.visibleUntil)
      return !1;
    const k = Q(i.loadedPosts[i.loadedPosts.length - 1]);
    return Gn(k, P.oldestCursor);
  }
  async function Ra(v, P) {
    const k = M;
    if (!k || k.pubkeyHex !== v)
      return null;
    const K = await Pn(v, P);
    if (!t() || e() !== v || P !== O || !ma(v, k))
      return null;
    const [z, ie] = await Promise.all([
      Promise.resolve(Zs(v)),
      ya(v, K)
    ]);
    return !ma(v, k) || z !== k.revision || ie !== k.totalVisibleCount ? null : k;
  }
  async function Va(v, P, k, K, z) {
    if (Xe(), k.length === 0 || !t() || e() !== v || P !== O || i.listingMode !== "contiguous" || i.sparseSource !== null)
      return !1;
    const ie = await ya(v, K), he = await ga(v), qe = Zs(v);
    if (qe !== z || he !== K || !t() || e() !== v || P !== O || i.listingMode !== "contiguous" || i.sparseSource !== null || i.loadedPosts[0]?.eventId !== k[0]?.eventId || i.loadedPosts[i.loadedPosts.length - 1]?.eventId !== k[k.length - 1]?.eventId)
      return !1;
    const Ve = Q(k[k.length - 1]);
    return Ve ? (M = {
      pubkeyHex: v,
      visibleUntil: K,
      revision: qe,
      totalVisibleCount: ie,
      reachedVisibleCount: k.length,
      oldestCursor: Ve,
      latestEventId: k[0]?.eventId ?? null
    }, !0) : !1;
  }
  async function Rs(v, P, k) {
    const K = M;
    if (!K || K.pubkeyHex !== v || a(ue) || i.listingMode !== "contiguous" || i.sparseSource !== null || e() !== v)
      return !1;
    const z = Q(i.loadedPosts[i.loadedPosts.length - 1]);
    if (!Gn(z, K.oldestCursor))
      return !1;
    const ie = await ya(v, P);
    return !t() || e() !== v || !Gn(z, Q(i.loadedPosts[i.loadedPosts.length - 1])) ? !1 : (M = {
      ...K,
      visibleUntil: P,
      revision: Zs(v),
      totalVisibleCount: ie
    }, !0);
  }
  async function Xn() {
    Xe(), await we();
  }
  function Lr(v, P = i.loadedPosts) {
    if (i.listingMode === "sparse" || i.hasJumpCacheAnchors)
      return !0;
    const k = P.length > 0 ? P[P.length - 1]?.createdAt ?? null : null;
    return typeof k != "number" ? !1 : v === null ? i.hasJumpCacheAnchors : k < v;
  }
  function d({ count: v, known: P, status: k }) {
    typeof v == "number" && (i.totalCount = v), i.totalCountKnown = P, i.totalCountStatus = k;
  }
  function C() {
    D += 1, ee = null, d({
      known: i.totalCountKnown,
      status: i.totalCountKnown ? "ready" : "unknown"
    });
  }
  function H(v, { force: P = !1 } = {}) {
    if (!t() || e() !== v || !P && ee?.pubkeyHex === v)
      return;
    const k = ++D;
    d({
      known: i.totalCountKnown,
      status: i.totalCountKnown ? "refreshing" : "loading"
    });
    const K = at.countForPubkey(v).then((z) => {
      k !== D || !t() || e() !== v || d({ count: z, known: !0, status: "ready" });
    }).catch(() => {
      k !== D || !t() || e() !== v || d({ known: i.totalCountKnown, status: "failed" });
    }).finally(() => {
      ee?.requestId === k && (ee = null);
    });
    ee = { requestId: k, pubkeyHex: v, promise: K };
  }
  function N({ force: v = !1 } = {}) {
    const P = e();
    !P || !t() || H(P, { force: v });
  }
  async function V(v, P, k = null, K = null) {
    const z = typeof P == "number" ? await at.hasPostsBeforeCreatedAt(v, P) : !1;
    !t() || e() !== v || k !== null && k !== O || K !== null && !bt(K) || (i.hasSavedPostsOutsideVisibleRange = z);
  }
  function Q(v) {
    return v ? {
      eventId: v.eventId,
      postedAt: v.postedAt,
      createdAt: v.createdAt
    } : null;
  }
  function le(v, P) {
    return v.length <= nt ? v : v.slice(0, nt);
  }
  function Te(v, P, k) {
    return cm({
      currentPosts: v,
      olderPosts: P,
      anchorEventId: k,
      maxVisiblePosts: nt,
      keepAbove: g
    });
  }
  async function oe(v, P = i.loadedPosts, k = null, K = {}) {
    if (P.length === 0) {
      t() && e() === v && (k === null || k === O) && (i.hasOlderLocal = !1, i.hasNewerLocal = !1);
      return;
    }
    const z = Q(P[0]), ie = Q(P[P.length - 1]), he = i.visibleUntil, qe = i.sparseSource === "saved" && typeof he == "number" ? z ? at.getSparseChunk({
      pubkeyHex: v,
      visibleUntil: he,
      cursor: z,
      direction: "newer",
      limit: 1
    }) : Promise.resolve([]) : z ? at.getNewerVisibleChunk({ pubkeyHex: v, visibleUntil: he, cursor: z, limit: 1 }) : Promise.resolve([]), Ve = K.skipOlderCheck ? Promise.resolve([]) : i.sparseSource === "saved" && typeof he == "number" ? ie ? at.getSparseChunk({
      pubkeyHex: v,
      visibleUntil: he,
      cursor: ie,
      direction: "older",
      limit: 1
    }) : Promise.resolve([]) : i.sparseSource === "jump" ? ie ? at.getOlderVisibleChunk({
      pubkeyHex: v,
      visibleUntil: null,
      cursor: ie,
      limit: 1
    }) : Promise.resolve([]) : ie ? at.getOlderVisibleChunk({ pubkeyHex: v, visibleUntil: he, cursor: ie, limit: 1 }) : Promise.resolve([]), [et, $t] = await Promise.all([qe, Ve]);
    !t() || e() !== v || k !== null && k !== O || (i.hasNewerLocal = et.length > 0, K.skipOlderCheck || (i.hasOlderLocal = $t.length > 0));
  }
  async function we({
    forceTotalCount: v = !1,
    skipTotalCountRefresh: P = !1,
    skipOlderAvailabilityCheck: k = !1,
    awaitProgress: K = !1
  } = {}) {
    Xe();
    const z = e();
    if (!z) {
      p(G, null), gr();
      return;
    }
    const ie = ++O, he = await Pn(z, ie), qe = Zs(z), Ve = await at.getLatestVisibleChunk({ pubkeyHex: z, limit: g, visibleUntil: he });
    if (!t() || e() !== z || ie !== O || (Zn(z), i.listingMode = "contiguous", i.sparseSource = null, i.loadedPosts = Ve, !await Dt(z, () => St(z, ie), () => i.loadedPosts.length > 0)))
      return;
    P || N({ force: v }), Ba(z, ie).catch(() => {
    });
    const et = Va(z, ie, Ve, he, qe);
    let $t = !1;
    K ? $t = await et.catch(() => (Xe(), !1)) : et.catch(() => {
      Xe();
    });
    const Nn = k && $t;
    k && !Nn ? i.hasOlderLocal = !1 : Nn && M && (i.hasOlderLocal = M.totalVisibleCount > M.reachedVisibleCount), V(z, he, ie).catch(() => {
    }), oe(z, Ve, ie, { skipOlderCheck: Nn }).then(() => {
      !t() || e() !== z || ie !== O || ba(z, Ve);
    }).catch(() => {
    });
  }
  async function _e({ skipTotalCountRefresh: v = !1 } = {}) {
    Xe();
    const P = e();
    if (!P || i.loadedPosts.length === 0) {
      await we({ skipTotalCountRefresh: v });
      return;
    }
    const k = i.loadedPosts[0], K = Q(k);
    if (!K) {
      await we({ skipTotalCountRefresh: v });
      return;
    }
    const z = ++O, ie = await Pn(P), qe = Lr(ie, i.loadedPosts) ? await at.getVisibleChunkFromCreatedAt({
      pubkeyHex: P,
      visibleUntil: ie,
      createdAt: k.createdAt,
      limit: i.loadedPosts.length,
      query: { contiguous: !1 }
    }) : await (i.loadedPosts.length > 1 ? at.getOlderVisibleChunk({
      pubkeyHex: P,
      visibleUntil: ie,
      cursor: K,
      limit: i.loadedPosts.length - 1
    }).then((Ve) => [k, ...Ve]) : Promise.resolve([k]));
    !t() || z !== O || (i.loadedPosts = qe, await Dt(P, () => St(P, z), () => i.loadedPosts.length > 0) && (v || N(), await oe(P, qe, z)));
  }
  function Me(v, P) {
    return !!v && (!P || v.requestedAt > P.savedAt);
  }
  async function Oe(v, P) {
    Xe();
    const k = e(), K = i.loadedPosts, z = Q(K[0]), ie = Q(K[K.length - 1]);
    if (!k || !t() || K.length === 0)
      return;
    const he = ++O, qe = await Pn(k), [Ve, et] = await Promise.all([
      z ? at.getNewerVisibleChunk({ pubkeyHex: k, visibleUntil: qe, cursor: z, limit: 1 }) : Promise.resolve([]),
      ie ? at.getOlderVisibleChunk({ pubkeyHex: k, visibleUntil: qe, cursor: ie, limit: 1 }) : Promise.resolve([])
    ]);
    if (!(!t() || he !== O)) {
      if (Me(P, v)) {
        s(), await we();
        return;
      }
      i.hasNewerLocal = Ve.length > 0, i.hasOlderLocal = et.length > 0, await Dt(k, () => St(k, he), () => i.loadedPosts.length > 0) && (N(), await oe(k, i.loadedPosts, he), St(k, he) && ba(k, i.loadedPosts));
    }
  }
  function it() {
    const v = o();
    return !v || v.mode !== "normal" || v.pubkeyHex !== e() ? null : v;
  }
  function lt(v) {
    return a(ue) || i.loadedPosts.length === 0 || !v ? !1 : i.loadedPosts.some((P) => P.eventId === v.anchor.eventId);
  }
  async function Tt(v) {
    Xe();
    const P = e();
    if (!P || !t())
      return !1;
    const k = ++O, K = await Pn(P), z = await at.getVisibleChunkAroundEventId({
      pubkeyHex: P,
      visibleUntil: K,
      eventId: v.anchor.eventId,
      limit: nt,
      keepAbove: g
    });
    return !t() || k !== O ? !1 : z.length === 0 ? (s(), await we(), !1) : (i.loadedPosts = z, !await Dt(P, () => St(P, k), () => i.loadedPosts.length > 0) || (N(), await oe(P, z, k), !St(P, k)) ? !1 : (ba(P, z), !0));
  }
  async function Be(v = {}) {
    const P = i.loadedPosts, k = v.metrics;
    k && (k.loadedPostsBeforeLength = P.length, k.loadedPostsAfterLength = P.length, k.olderPostsLength = 0, k.visibleOldestBefore = P.length > 0 ? P[P.length - 1]?.createdAt ?? null : null, k.visibleOldestAfter = P.length > 0 ? P[P.length - 1]?.createdAt ?? null : null, k.didTrimForOlderAppend = !1, k.didDeferOlderPosts = !1, k.maxVisiblePosts = nt);
    const K = e(), z = Q(i.loadedPosts[i.loadedPosts.length - 1]);
    if (!K || !z)
      return await we(), k && (k.loadedPostsAfterLength = i.loadedPosts.length, k.olderPostsLength = i.loadedPosts.length, k.visibleOldestAfter = i.loadedPosts.length > 0 ? i.loadedPosts[i.loadedPosts.length - 1]?.createdAt ?? null : null), i.loadedPosts.length > 0;
    const ie = v.useContiguousProgress !== !1 && M !== null, he = v.preserveContiguousProgressAfterDatabaseChange ? M : null, qe = ++O, Ve = ie ? await Ra(K, qe) : null;
    if (ie && !Ve)
      return await Xn(), k && (k.loadedPostsAfterLength = i.loadedPosts.length, k.visibleOldestAfter = i.loadedPosts.length > 0 ? i.loadedPosts[i.loadedPosts.length - 1]?.createdAt ?? null : null), !1;
    const et = Ve?.visibleUntil ?? await Pn(K, qe), $t = Ve ? Math.max(0, Ve.totalVisibleCount - Ve.reachedVisibleCount) : g;
    if (Ve && $t === 0)
      return i.hasOlderLocal = !1, k && (k.loadedPostsAfterLength = i.loadedPosts.length, k.visibleOldestAfter = i.loadedPosts.length > 0 ? i.loadedPosts[i.loadedPosts.length - 1]?.createdAt ?? null : null), await oe(K, i.loadedPosts, qe, { skipOlderCheck: !0 }), !1;
    const Nn = Math.min(g, $t), cr = await at.getOlderVisibleChunk({
      pubkeyHex: K,
      visibleUntil: et,
      cursor: z,
      limit: Nn
    });
    if (k && (k.olderPostsLength = cr.length), !t() || qe !== O)
      return !1;
    const Ct = Ve ? await Ra(K, qe) : null;
    if (Ve && !Ct)
      return await Xn(), !1;
    if (cr.length === 0)
      return Ve ? await Xn() : i.hasOlderLocal = !1, k && (k.loadedPostsAfterLength = i.loadedPosts.length, k.visibleOldestAfter = i.loadedPosts.length > 0 ? i.loadedPosts[i.loadedPosts.length - 1]?.createdAt ?? null : null), !1;
    const ln = Te(P, cr, v.anchorEventId), Ca = v.reason === "normal-older-reveal" ? um(P, ln.posts) : [];
    i.loadedPosts = ln.posts, Ca.length > 0 && rt.scheduleOlderRevealRepair(Ca), ln.didDeferOlderPosts && (i.hasOlderLocal = !0), ln.didTrimForOlderAppend && (i.hasNewerLocal = !0);
    const ra = Ca.length;
    Ct ? M = {
      ...Ct,
      reachedVisibleCount: Math.min(Ct.totalVisibleCount, Ct.reachedVisibleCount + ra),
      oldestCursor: Q(ln.posts[ln.posts.length - 1]) ?? Ct.oldestCursor
    } : !ie && he && Zs(K) === he.revision && (Gn(z, he.oldestCursor) ? M = {
      ...he,
      reachedVisibleCount: Math.min(he.totalVisibleCount, he.reachedVisibleCount + ra),
      oldestCursor: Q(ln.posts[ln.posts.length - 1]) ?? he.oldestCursor
    } : Xe());
    const Qa = ie && Ct !== null && M !== null, Fr = !!M && M.reachedVisibleCount >= M.totalVisibleCount;
    return Qa && M && (i.hasOlderLocal = M.totalVisibleCount > M.reachedVisibleCount), k && (k.loadedPostsAfterLength = ln.posts.length, k.visibleOldestAfter = ln.posts.length > 0 ? ln.posts[ln.posts.length - 1]?.createdAt ?? null : null, k.didTrimForOlderAppend = ln.didTrimForOlderAppend, k.didDeferOlderPosts = ln.didDeferOlderPosts), Qa ? (oe(K, ln.posts, qe, { skipOlderCheck: !0 }).catch(() => {
    }), !0) : (await oe(K, ln.posts, qe, {
      skipOlderCheck: ie && Fr
    }), !0);
  }
  async function Ye(v, P, k = {}) {
    Xe();
    const K = i.loadedPosts, z = K.length > 0 ? K[K.length - 1]?.createdAt ?? null : null;
    if (typeof z != "number")
      return !1;
    const ie = await at.getVisibleChunkFromCreatedAt({
      pubkeyHex: v,
      visibleUntil: i.visibleUntil,
      createdAt: Math.max(0, z - 1),
      limit: g,
      query: { contiguous: !1 }
    });
    if (!t() || P !== O)
      return !1;
    if (ie.length === 0)
      return i.hasOlderLocal = !1, !1;
    const he = Te(K, ie, k.anchorEventId);
    return i.loadedPosts = he.posts, await oe(v, he.posts, P), he.didDeferOlderPosts && (i.hasOlderLocal = !0), !0;
  }
  async function qt(v, P, k = {}) {
    Xe();
    const K = i.loadedPosts;
    if (typeof i.visibleUntil != "number")
      return !1;
    const z = Q(K[K.length - 1]);
    if (!z)
      return !1;
    const ie = await at.getSparseChunk({
      pubkeyHex: v,
      visibleUntil: i.visibleUntil,
      cursor: z,
      direction: "older",
      limit: g
    });
    if (!t() || P !== O)
      return !1;
    if (ie.length === 0)
      return i.hasOlderLocal = !1, !1;
    const he = Te(K, ie, k.anchorEventId);
    return i.loadedPosts = he.posts, await oe(v, he.posts, P), he.didDeferOlderPosts && (i.hasOlderLocal = !0), !0;
  }
  async function rn() {
    const v = e(), P = Q(i.loadedPosts[0]);
    if (!v || !P)
      return !1;
    const k = ++O, K = M, z = K ? await Ra(v, k) : null;
    if (K && !z)
      return await Xn(), !1;
    const ie = z?.visibleUntil ?? await Pn(v, k), he = await at.getNewerVisibleChunk({
      pubkeyHex: v,
      visibleUntil: ie,
      cursor: P,
      limit: g
    });
    if (!t() || k !== O)
      return !1;
    if (he.length === 0)
      return i.hasNewerLocal = !1, !1;
    if (z && !await Ra(v, k))
      return await Xn(), !1;
    const qe = i.loadedPosts, Ve = le([...he, ...qe]);
    if (i.loadedPosts = Ve, z) {
      const et = Math.max(0, qe.length + he.length - Ve.length);
      M = {
        ...z,
        reachedVisibleCount: Math.max(0, z.reachedVisibleCount - et),
        oldestCursor: Q(Ve[Ve.length - 1]) ?? z.oldestCursor
      };
    }
    return await oe(v, Ve, k), !(!t() || k !== O);
  }
  async function er(v) {
    Xe();
    const P = e();
    if (!P)
      return !1;
    const k = ++O, K = await Pn(P), z = await at.getVisibleChunkFromCreatedAt({ pubkeyHex: P, visibleUntil: K, createdAt: v, limit: g });
    if (!t() || k !== O)
      return !1;
    if (z.length === 0)
      return N(), i.loadedPosts = [], i.hasOlderLocal = !1, i.hasNewerLocal = !1, !1;
    if (!ol(z, v))
      return N(), i.listingMode = "contiguous", i.sparseSource = null, i.loadedPosts = z, Ln(), await oe(P, z, k), !0;
    if (v <= 0)
      return N(), i.listingMode = "contiguous", i.sparseSource = null, i.loadedPosts = z, Ln(), await oe(P, z, k), !0;
    const ie = await xo.hasNearbyAnchorForPubkey({ pubkeyHex: P, targetCreatedAt: v });
    if (!t() || k !== O)
      return !1;
    if (ie) {
      const Ct = await at.getVisibleChunkFromCreatedAt({
        pubkeyHex: P,
        visibleUntil: K,
        createdAt: v,
        limit: g,
        query: { contiguous: !1 }
      });
      if (!t() || k !== O)
        return !1;
      if (!ol(Ct, v))
        return N(), i.listingMode = "sparse", i.sparseSource = "jump", i.loadedPosts = Ct, Ln(), await oe(P, Ct, k), !0;
    }
    const he = n();
    if (!he)
      return N(), i.listingMode = "contiguous", i.sparseSource = null, i.loadedPosts = z, Ln(), await oe(P, z, k), !0;
    hn();
    const qe = ++$e;
    i.syncStatus = "syncing";
    const Ve = Math.max(0, v - mc), et = v, $t = ti.fetchLatest(he, {
      pubkeyHex: P,
      relayConfig: r(),
      reason: "repair-visible-range",
      limit: hm,
      since: Ve,
      until: et
    });
    Se = $t;
    const Nn = await $t.promise;
    if (!bt(qe) || Se !== $t)
      return !1;
    if (Se = null, !t() || Nn.status === "cancelled" || (Nn.events.length > 0 && (await at.upsertFetchedEvents({ events: Nn.events, fetchedAt: Nn.fetchedAt }), await xo.addForPubkey({
      pubkeyHex: P,
      centerCreatedAt: v,
      radiusSec: mc,
      fetchedAt: Nn.fetchedAt
    }), i.hasJumpCacheAnchors = !0), !t() || k !== O))
      return i.syncStatus = "idle", !1;
    const cr = await at.getVisibleChunkFromCreatedAt({
      pubkeyHex: P,
      visibleUntil: K,
      createdAt: v,
      limit: g,
      query: { contiguous: !1 }
    });
    return !t() || k !== O ? (i.syncStatus = "idle", !1) : (i.syncStatus = "idle", ol(cr, v) ? !1 : (N({ force: Nn.events.length > 0 }), i.listingMode = "sparse", i.sparseSource = "jump", i.loadedPosts = cr, Ln(), await oe(P, cr, k), rt.repairJump({
      ownerPubkeyHex: P,
      rxNostr: he,
      visiblePosts: cr,
      isActive: () => t() && e() === P && n() === he && k === O
    }).catch(() => {
    }), !0));
  }
  async function mr(v) {
    Xe();
    const P = e();
    if (!P || !v)
      return !1;
    const k = ++O, K = await Pn(P, k), z = (Ve) => at.getVisibleChunkAroundEventId({
      pubkeyHex: P,
      visibleUntil: Ve,
      eventId: v,
      limit: nt,
      keepAbove: g
    });
    let ie = await z(K);
    if (!t() || k !== O)
      return !1;
    const he = ie.some((Ve) => Ve.eventId === v);
    let qe = !1;
    return !he && typeof K == "number" && (ie = await z(null), qe = !0, !t() || k !== O) || !ie.some((Ve) => Ve.eventId === v) ? !1 : (N(), i.listingMode = qe ? "sparse" : "contiguous", i.sparseSource = qe ? "jump" : null, i.loadedPosts = ie, Ln(), await oe(P, ie, k), !0);
  }
  function Ie(v, P) {
    const k = [...v], K = new Set(v.map((z) => z.eventId));
    for (const z of P)
      K.has(z.eventId) || (K.add(z.eventId), k.push(z));
    return k;
  }
  function je(v, P, k) {
    return t() && v === ve && e() === k && P === i.searchQuery;
  }
  async function zt(v, P, k) {
    const K = e();
    if (!K || !P)
      return null;
    const z = await Co.searchLocalPosts({ pubkeyHex: K, query: P, page: v, pageSize: g });
    return je(k, P, K) ? z : null;
  }
  async function xn(v, P) {
    const k = e();
    if (!k || !P)
      return i.searchPosts = [], i.searchTotalCount = 0, i.searchHasNext = !1, !1;
    const K = ++ve, z = Math.max(1, Math.trunc(v));
    p(Re, !0), p(ae, "loading");
    try {
      const ie = await zt(z, P, K);
      if (!ie)
        return !1;
      const he = Nd(z, ie.total, g);
      return he !== z ? (K === ve && je(K, P, k) && p(ae, "ready"), !1) : (i.searchTotalCount = ie.total, i.searchPosts = z === 1 ? ie.items : Ie(i.searchPosts, ie.items), i.searchPage = he, i.searchHasNext = ie.hasNext, p(ae, "ready"), !(!W && !await Dt(k, () => je(K, P, k), () => i.searchPosts.length > 0)));
    } catch {
      return K === ve && p(ae, "failed"), !1;
    } finally {
      K === ve && p(Re, !1);
    }
  }
  async function Rt(v, P, k = ++ve) {
    const K = e();
    if (!K || !P)
      return !1;
    const z = Math.max(1, Math.trunc(v));
    p(Re, !0), p(ae, "loading");
    try {
      const ie = await zt(1, P, k);
      if (!ie)
        return !1;
      const he = Nd(z, ie.total, g);
      let qe = ie.items, Ve = ie;
      for (let et = 2; et <= he; et += 1) {
        const $t = await zt(et, P, k);
        if (!$t)
          return !1;
        qe = Ie(qe, $t.items), Ve = $t;
      }
      return i.searchPosts = qe, i.searchTotalCount = ie.total, i.searchPage = he, i.searchHasNext = Ve.hasNext, p(ae, "ready"), !(!W && !await Dt(K, () => je(k, P, K), () => i.searchPosts.length > 0));
    } catch {
      return k === ve && p(ae, "failed"), !1;
    } finally {
      k === ve && p(Re, !1);
    }
  }
  async function na() {
    Xe();
    const v = e(), P = n();
    if (!v || !P)
      return;
    hn();
    const k = ++$e;
    i.syncStatus = "syncing";
    const K = await Pn(v);
    if (!bt(k) || !t() || e() !== v)
      return;
    const z = ti.fetchLatest(P, {
      pubkeyHex: v,
      relayConfig: r(),
      reason: "bootstrap",
      limit: sf,
      timeoutMs: af
    });
    Se = z;
    const ie = await z.promise;
    let he = {
      insertedCount: 0,
      updatedCount: 0
    };
    if (!bt(k) || Se !== z || (Se = null, !t() || ie.status === "cancelled"))
      return;
    if (ie.events.length > 0) {
      he = await at.upsertFetchedEvents({ events: ie.events, fetchedAt: ie.fetchedAt });
      const et = dm(ie.events);
      et.length > 0 && await l(et);
    }
    if (!bt(k) || !t())
      return;
    const qe = await Or(v, ie);
    if (!bt(k) || !t())
      return;
    const Ve = qe !== K;
    fa(ie), i.searchQuery ? await Rt(i.searchPage, i.searchQuery) : i.loadedPosts.length === 0 || !i.hasNewerLocal ? await we({
      forceTotalCount: he.insertedCount + he.updatedCount > 0
    }) : (N({
      force: he.insertedCount + he.updatedCount > 0
    }), await oe(v)), i.syncStatus = Li(ie, he.insertedCount + he.updatedCount > 0 || Ve);
  }
  async function ls() {
    const v = e(), P = n();
    if (!v || !P)
      return;
    hn();
    const k = ++$e;
    i.syncStatus = "syncing", i.lastDialogOpenRefreshAt = Date.now();
    const K = await Pn(v);
    if (!bt(k) || !t() || e() !== v)
      return;
    const z = lu.runAuthored(P, {
      ownerPubkeyHex: v,
      relayConfig: r(),
      reason: "dialog-open-refresh",
      limit: df,
      timeoutMs: lf,
      onSavedSelfPosts: l
    });
    Se = z;
    const ie = await z.promise, he = ie.fetchResult, qe = ie.upsertSummary;
    if (!bt(k) || Se !== z || (Se = null, !t() || he.status === "cancelled") || !bt(k) || !t())
      return;
    const Ve = await Or(v, he);
    if (!bt(k) || !t())
      return;
    const et = yy({
      insertedCount: qe.insertedCount,
      updatedCount: qe.updatedCount,
      previousVisibleUntil: K,
      nextVisibleUntil: Ve,
      searchQuery: i.searchQuery,
      loadedPostsLength: i.loadedPosts.length,
      hasNewerLocal: i.hasNewerLocal
    });
    if (Is(he), i.syncStatus = Li(he, et.didMateriallyChange), fn(), et.applyAction === "reload-search-page")
      await Rt(i.searchPage, i.searchQuery);
    else if (et.applyAction === "load-latest-visible-posts") {
      const $t = et.didMateriallyChange && !et.didVisibleMateriallyChange;
      await we({
        forceTotalCount: et.didMateriallyChange,
        skipOlderAvailabilityCheck: $t,
        awaitProgress: $t
      });
    } else et.applyAction === "refresh-count-and-availability" && (et.didMateriallyChange ? await we({
      forceTotalCount: et.didMateriallyChange,
      skipOlderAvailabilityCheck: !et.didVisibleMateriallyChange,
      awaitProgress: !et.didVisibleMateriallyChange
    }) : (Xe(), N({ force: et.didMateriallyChange }), await oe(v)));
  }
  function ja() {
    return typeof i.lastDialogOpenRefreshAt != "number" ? !0 : Date.now() - i.lastDialogOpenRefreshAt >= of;
  }
  function ba(v, P) {
    if (!(fe || !t() || e() !== v || !n())) {
      if (fe = !0, P.length === 0) {
        na();
        return;
      }
      ja() && ls();
    }
  }
  function _s() {
    return !a(ue) || !a(vt) ? !1 : (i.searchPage -= 1, !0);
  }
  function Ka() {
    return !a(ue) || !a(xt) ? !1 : (i.searchPage = 1, !0);
  }
  async function Ya() {
    if (!a(ue) || !a(st))
      return !1;
    const v = i.searchPage + 1;
    return xn(v, i.searchQuery);
  }
  async function js() {
    return !a(ue) || !a(tn) ? !1 : (i.searchPage = a(kt), !0);
  }
  async function Es() {
    if (a(ue))
      return Ya();
    if (i.sparseSource === "saved") {
      const v = e();
      return v ? qt(v, ++O, {}) : !1;
    }
    if (i.sparseSource === "jump") {
      const v = e();
      return v ? Ye(v, ++O, {}) : !1;
    }
    return Be({ reason: "normal-older-reveal" });
  }
  async function io() {
    return a(ue) ? Promise.resolve(_s()) : i.sparseSource === "saved" ? cs() : rn();
  }
  async function As() {
    return a(ue) ? Promise.resolve(Ka()) : (await we(), !0);
  }
  async function ks() {
    const v = e();
    if (!v)
      return !1;
    const P = await Pn(v);
    if (typeof P != "number") return !1;
    const k = ++O, K = await at.getSparseChunk({
      pubkeyHex: v,
      visibleUntil: P,
      direction: "latest",
      limit: g
    });
    return !t() || e() !== v || k !== O ? !1 : K.length === 0 ? (i.hasSavedPostsOutsideVisibleRange = !1, !1) : (i.listingMode = "sparse", i.sparseSource = "saved", i.loadedPosts = K, N(), await oe(v, K, k), await V(v, P, k), !0);
  }
  async function lo() {
    if (a(ue) || !a($n))
      return !1;
    if (i.listingMode === "sparse") {
      Xe();
      const z = e();
      if (!z)
        return !1;
      const ie = ++O, he = await at.getOldestVisibleChunk({
        pubkeyHex: z,
        visibleUntil: i.visibleUntil,
        limit: g,
        query: { contiguous: !1 }
      });
      return !t() || ie !== O || he.length === 0 ? !1 : (N(), i.loadedPosts = he, Ln(), i.hasOlderLocal = !1, await oe(z, he, ie, { skipOlderCheck: !0 }), !0);
    }
    Xe();
    const v = e();
    if (!v)
      return !1;
    const P = ++O, k = await Pn(v, P), K = await at.getOldestVisibleChunk({ pubkeyHex: v, visibleUntil: k, limit: g });
    return !t() || P !== O ? !1 : K.length === 0 ? (N(), i.loadedPosts = [], i.hasOlderLocal = !1, i.hasNewerLocal = !1, !1) : (N(), i.listingMode = "contiguous", i.sparseSource = null, i.loadedPosts = K, Ln(), i.hasOlderLocal = !1, await oe(v, K, P, { skipOlderCheck: !0 }), !0);
  }
  async function Ks(v = {}) {
    const P = e(), k = n();
    if (!P || !k || !a(nn))
      return !1;
    hn();
    const K = ++$e;
    i.syncStatus = "older-syncing";
    const z = pm, ie = gm, he = Math.max(1, Math.min(g, 30));
    let qe = null, Ve = 0, et = 0, $t = 0, Nn = null, cr = null, Ct = !1, ln = 0, Ca = null;
    for (; ; ) {
      Ve += 1;
      const ra = Nn ?? await va(P), Qa = typeof Nn == "number", Fr = await Pn(P);
      if (!bt(K) || !t() || e() !== P)
        return Ct;
      const _a = typeof ra == "number" ? Qa ? ra : typeof Fr == "number" ? Math.min(ra, Fr) : ra : Fr;
      if (typeof _a != "number")
        return i.syncStatus = "idle", Ct;
      const Wa = Math.trunc(_a) - 1;
      if (Wa < 0)
        return is(null, null), i.syncStatus = "idle", Ct;
      const zs = Math.min($t, il.length - 1), us = il[zs], Hr = {
        since: (typeof cr == "number" && cr <= Wa ? cr : null) ?? Math.max(0, Wa - us),
        until: Wa,
        windowSeconds: us
      }, h = await qa(P, Fr);
      if (!bt(K) || !t() || e() !== P)
        return Ct;
      qe === null && (qe = h);
      let B = !1, Ce = {
        insertedCount: 0,
        updatedCount: 0
      };
      const Pe = ti.fetchLatest(k, {
        pubkeyHex: P,
        relayConfig: r(),
        reason: "older-backfill",
        limit: Oi,
        timeoutMs: rf,
        since: Hr.since,
        until: Hr.until
      });
      Se = Pe;
      const Qe = await Pe.promise;
      if (!bt(K) || Se !== Pe || (Se = null, !t() || Qe.status === "cancelled") || (Qe.events.length > 0 && (Ce = await at.upsertFetchedEvents({ events: Qe.events, fetchedAt: Qe.fetchedAt }), B = Ce.insertedCount + Ce.updatedCount > 0), !bt(K) || !t()))
        return Ct;
      const an = typeof a(ut) == "number" && (Fr === null ? i.hasJumpCacheAnchors : a(ut) < Fr), vn = an ? Fr : await Ss(P, Qe);
      if (!bt(K) || !t())
        return Ct;
      const _t = !an && typeof vn == "number" ? await xo.reconcileWithFrontier({
        pubkeyHex: P,
        frontierVisibleUntil: vn,
        toleranceSec: fm
      }) : null, zn = _t ? _t.nextVisibleUntil : vn;
      _t && (i.hasJumpCacheAnchors = _t.anchors.length > 0), _t && _t.nextVisibleUntil !== vn && (await Gs.save({
        pubkeyHex: P,
        kindsKey: Io,
        visibleUntil: _t.nextVisibleUntil
      }), i.visibleUntil = _t.nextVisibleUntil);
      const br = await qa(P, zn);
      if (!bt(K) || !t())
        return Ct;
      let $r = !1;
      if (an || ($r = await Rs(P, zn)), await V(P, zn, null, K), !bt(K) || !t())
        return Ct;
      const Jr = br > h, Ea = ta(Qe, Oi).length > 0, aa = pa(Qe), _i = typeof aa == "number" && aa > Hr.since ? aa - Hr.since : 0, ho = Qe.status === "success" && Ea && typeof aa == "number" && aa > Hr.since && _i >= vm;
      let Ja = Hr.since > 0 ? Hr.since : null, Qs = null;
      ho && typeof aa == "number" && (Ja = aa, Qs = Hr.since), De.windowSeconds = us, De.lastRange = { ...Hr, hitLimit: Ea }, Qe.status === "success" && Qe.events.length === 0 ? De.consecutiveEmptyCount += 1 : Qe.events.length > 0 && (De.consecutiveEmptyCount = 0), is(Ja, Qs), Sa(Hr, Qe, Oi);
      let qo = !1;
      const Nr = {
        loadedPostsBeforeLength: i.loadedPosts.length,
        loadedPostsAfterLength: i.loadedPosts.length,
        olderPostsLength: 0,
        visibleOldestBefore: i.loadedPosts.length > 0 ? i.loadedPosts[i.loadedPosts.length - 1]?.createdAt ?? null : null,
        visibleOldestAfter: i.loadedPosts.length > 0 ? i.loadedPosts[i.loadedPosts.length - 1]?.createdAt ?? null : null,
        didTrimForOlderAppend: !1,
        didDeferOlderPosts: !1,
        maxVisiblePosts: nt
      };
      i.searchQuery ? await Rt(i.searchPage, i.searchQuery) : (N({ force: B }), Jr || B ? qo = i.sparseSource === "saved" ? await qt(P, O, { anchorEventId: v.anchorEventId }) : an ? await Ye(P, O, { anchorEventId: v.anchorEventId }) : await Be({
        anchorEventId: v.anchorEventId,
        metrics: Nr,
        reason: "normal-older-reveal",
        useContiguousProgress: !1,
        preserveContiguousProgressAfterDatabaseChange: $r
      }) : await oe(P));
      const Vo = qo || Jr || B, wa = Ct || Vo, Ei = typeof Ja == "number" && Ja < _a, hs = br, fo = Math.max(0, hs - (qe ?? hs)), Ai = typeof Ja == "number" ? Math.max(0, _a - Ja) : Math.max(0, _a), vo = et + Ai, Ts = ym({
        status: Qe.status,
        changed: Vo,
        didCursorAdvanceOlder: Ei,
        hitLimit: Ea,
        continuedWithinWindow: ho,
        attemptIndex: Ve,
        maxAttempts: z,
        totalVisibleAdded: fo,
        targetVisibleAdded: he,
        exploredSeconds: vo,
        maxExploreSeconds: ie
      }), Ms = Ts.shouldContinue, jo = Ms ? ln + 1 : ln;
      if (et = vo, Ms) {
        i.latestOlderBackfillUiResult = {
          changed: wa,
          didTrimForOlderAppend: Nr.didTrimForOlderAppend,
          didDeferOlderPosts: Nr.didDeferOlderPosts,
          loadedPostsBeforeLength: Nr.loadedPostsBeforeLength,
          loadedPostsAfterLength: Nr.loadedPostsAfterLength,
          maxVisiblePosts: Nr.maxVisiblePosts,
          autoRetryCount: jo,
          autoRetryReason: Ts.reason,
          attemptIndex: Ve,
          maxAttempts: z,
          clickStartVisibleCount: qe ?? hs,
          currentVisibleCount: hs,
          totalVisibleAdded: fo,
          targetVisibleAdded: he,
          shouldContinueForSmallBatch: Ms,
          exploredSeconds: et,
          maxExploreSeconds: ie
        }, ln = jo, Ca = Ts.reason, Ct = wa, Nn = Ja, cr = Qs, ho || ($t = Math.min($t + 1, il.length - 1));
        continue;
      }
      return Ca = Ts.reason, Ct = wa, Ts.reason, i.latestOlderBackfillUiResult = {
        changed: Ct,
        didTrimForOlderAppend: Nr.didTrimForOlderAppend,
        didDeferOlderPosts: Nr.didDeferOlderPosts,
        loadedPostsBeforeLength: Nr.loadedPostsBeforeLength,
        loadedPostsAfterLength: Nr.loadedPostsAfterLength,
        maxVisiblePosts: Nr.maxVisiblePosts,
        autoRetryCount: ln,
        autoRetryReason: Ca,
        attemptIndex: Ve,
        maxAttempts: z,
        clickStartVisibleCount: qe ?? hs,
        currentVisibleCount: hs,
        totalVisibleAdded: fo,
        targetVisibleAdded: he,
        shouldContinueForSmallBatch: Ms,
        exploredSeconds: et,
        maxExploreSeconds: ie
      }, Qe.status !== "success" ? (i.syncStatus = "failed", fn(), Ct) : (i.syncStatus = Ct ? Li(Qe, !0) : "idle", fn(), Ct);
    }
  }
  async function Ys() {
    Xe();
    const v = e(), P = n();
    if (!v || !P || !a(mn))
      return;
    const k = Na();
    if (k.length === 0)
      return;
    _r(), i.currentViewRefetchStatus = "refetching";
    const K = await Pn(v), z = Oy.refetchAroundCurrentView(P, {
      pubkeyHex: v,
      relayConfig: r(),
      preferredRanges: k,
      onProgress: async () => {
      }
    });
    te = z;
    let ie = !1;
    try {
      const he = await z.promise;
      if (te !== z)
        return;
      if (!t() || he.status === "cancelled") {
        te = null, i.currentViewRefetchStatus = "idle";
        return;
      }
      await Ua(v, K, he.processedRanges), i.searchQuery ? await Rt(i.searchPage, i.searchQuery) : i.loadedPosts.length === 0 || !i.hasNewerLocal ? await we({ skipTotalCountRefresh: !0 }) : await _e({ skipTotalCountRefresh: !0 }), ie = !0;
      let qe = null;
      if (te === z && t() && e() === v && n() === P && i.loadedPosts.length > 0 && (qe = await rt.repairCurrentView({
        ownerPubkeyHex: v,
        rxNostr: P,
        visiblePosts: i.loadedPosts,
        isActive: () => te === z && t() && e() === v && n() === P
      }), te !== z || qe.status === "cancelled" || !t()) || te !== z || !t() || e() !== v || n() !== P)
        return;
      i.searchQuery || N({ force: !0 }), te = null, i.currentViewRefetchStatus = "idle", he.addedCount > 0 ? (i.currentViewRefetchMessageKey = "postHistory.repairAdded", i.currentViewRefetchMessageValues = {
        count: he.addedCount,
        processedRangeCount: he.processedRangeCount,
        updatedCount: he.updatedCount
      }) : (qe?.savedDirectReplyCount ?? 0) > 0 ? (i.currentViewRefetchMessageKey = "postHistory.repairChildInteractionsAdded", i.currentViewRefetchMessageValues = {
        count: qe?.savedDirectReplyCount ?? 0
      }) : he.fetchFailed ? (i.currentViewRefetchMessageKey = "postHistory.repairFetchFailed", i.currentViewRefetchMessageValues = null) : he.hadUnfinishedRanges || qe?.status === "partial" ? (i.currentViewRefetchMessageKey = "postHistory.repairPartialFailure", i.currentViewRefetchMessageValues = null) : (i.currentViewRefetchMessageKey = "postHistory.repairNoChanges", i.currentViewRefetchMessageValues = {
        processedRangeCount: he.processedRangeCount,
        updatedCount: he.updatedCount
      }), ua();
    } catch {
      if (te !== z)
        return;
      ie && !i.searchQuery && t() && e() === v && n() === P && N({ force: !0 }), te = null, i.currentViewRefetchStatus = "idle", i.currentViewRefetchMessageKey = "postHistory.repairFetchFailed", i.currentViewRefetchMessageValues = null, ua();
    }
  }
  async function ds() {
    const v = e();
    return v ? (hn(), Rr(), (await Promise.allSettled([
      at.deleteLocalHistoryForPubkey(v),
      xo.clearForPubkey(v),
      Gs.clearForPubkey(v)
    ])).some((k) => k.status === "rejected") ? (t() && e() === v && (C(), d({ known: i.totalCountKnown, status: "failed" })), _r(), i.currentViewRefetchMessageKey = "postHistory.deleteLocalHistoryFailed", i.currentViewRefetchMessageValues = null, !1) : (uc(v), Cm(v), Qr(), i.currentViewRefetchMessageKey = "postHistory.deleteLocalHistorySuccess", i.currentViewRefetchMessageValues = null, cc(v, {
      currentPage: 1,
      searchPage: 1,
      searchInput: "",
      searchQuery: ""
    }), ll(v, {
      ...hi,
      totalCount: 0,
      totalCountKnown: !0,
      totalCountFailed: !1
    }), !0)) : !1;
  }
  async function cs() {
    Xe();
    const v = e(), P = Q(i.loadedPosts[0]);
    if (!v || !P || typeof i.visibleUntil != "number")
      return !1;
    const k = ++O, K = await at.getSparseChunk({
      pubkeyHex: v,
      visibleUntil: i.visibleUntil,
      cursor: P,
      direction: "newer",
      limit: g
    });
    if (!t() || k !== O)
      return !1;
    if (K.length === 0)
      return i.hasNewerLocal = !1, !1;
    const z = le([...K, ...i.loadedPosts]);
    return i.loadedPosts = z, await oe(v, z, k), !0;
  }
  async function co() {
    if (Xe(), !!e()) {
      if (i.searchQuery) {
        await Rt(i.searchPage, i.searchQuery);
        return;
      }
      if (i.sparseSource === "saved") {
        const v = e();
        if (!v) return;
        const P = await Pn(v);
        N({ force: !0 }), await oe(v), await V(v, P);
        return;
      }
      await we({ forceTotalCount: !0 });
    }
  }
  function Ds(v, P, k) {
    const K = (z) => z.map((ie) => ie.eventId === v ? { ...ie, deletedAt: P, deletionEventId: k } : ie);
    i.loadedPosts = K(i.loadedPosts), i.searchPosts = K(i.searchPosts);
  }
  function za(v) {
    const P = e(), k = Xr(P);
    if (!P || !k)
      return;
    const K = ++xe;
    p(He, "loading"), v().then(() => {
      t() && e() === P && ke === k && K === xe && p(He, "ready");
    }).catch(() => {
      t() && e() === P && ke === k && K === xe && p(He, "failed");
    });
  }
  return Ke(() => {
    const v = Xr(e());
    v !== se && (se = v, Ne(), p(G, null), de = v, hn(), Rr(), Wr(), gr(), _r(), dr(), Ln(), rt.resetOlderRevealRepairContext(), fe = !1, ne = !1, ke = null, xe += 1, p(He, "idle"));
  }), Ke(() => {
    const v = n();
    v !== ce && (ce = v, rt.resetOlderRevealRepairContext());
  }), Ke(() => {
    Er();
  }), Ke(() => {
    zr();
  }), Ke(() => {
    t() || Mr();
  }), Ke(() => {
    if (t())
      return () => {
        hn();
      };
  }), Ke(() => () => {
    rt.dispose();
  }), Ke(() => {
    if (!t()) {
      dr();
      return;
    }
    return fn(), () => {
      dr();
    };
  }), Ke(() => {
    if (!t())
      return;
    const v = i.searchInput.trim();
    v !== i.searchQuery && p(ae, "loading");
    const P = setTimeout(
      () => {
        i.searchQuery = v;
      },
      y
    );
    return () => {
      clearTimeout(P);
    };
  }), Ke(() => {
    if (!t() || a(ue))
      return;
    const v = Xr(e()) ?? "";
    if (ne && ke === v)
      return;
    if (ne = !0, ke = v, de === v) {
      de = null, za(we);
      return;
    }
    const P = it(), k = tf(e());
    if (Me(k, P)) {
      s(), za(we);
      return;
    }
    if (lt(P)) {
      za(() => Oe(P, k));
      return;
    }
    if (P) {
      za(() => Tt(P));
      return;
    }
    za(we);
  }), Ke(() => {
    t() || Ne();
  }), Ke(() => {
    if (!t() || !a($) || a(X) !== Xr(e()))
      return;
    const v = a(Ue);
    if (v.length === 0 || !$d.canUsePersistentCache())
      return;
    const P = nf(v);
    if (P.length === 0)
      return;
    const k = [...P].sort().join("\0");
    k !== me && (me = k, Promise.resolve($d.prefetchCachedMediaDescriptors(P)).catch(() => {
    }));
  }), ao(() => {
    O += 1, ve += 1, xe += 1, p(He, "idle"), p(X, null), p($, !1);
  }), Ke(() => {
    if (t()) {
      if (!i.searchQuery) {
        const v = pe !== "";
        if (Ne(), ve += 1, p(Re, !1), p(ae, "idle"), Co.clearCache?.(), pe = "", q = !1, i.searchPage !== 1) {
          if (i.searchPage = 1, v) {
            const P = e();
            P && Dt(P, () => St(P, O), () => i.loadedPosts.length > 0);
          }
          return;
        }
        if (i.searchPosts = [], i.searchTotalCount = 0, i.searchHasNext = !1, v) {
          const P = e();
          P && Dt(P, () => St(P, O), () => i.loadedPosts.length > 0);
        }
        return;
      }
      if (i.searchQuery !== pe) {
        Ne(), pe === "" && i.searchPosts.length === 0 && (i.searchPosts = i.loadedPosts), pe = i.searchQuery, i.searchPage = 1, q = !0, xn(1, i.searchQuery);
        return;
      }
      if (pe = i.searchQuery, !q) {
        q = !0;
        const v = e(), P = i.searchQuery, k = ++ve, K = i.searchPosts.length > 0;
        v && K && Dt(v, () => je(k, P, v), () => i.searchPosts.length > 0), Rt(i.searchPage, P, k);
      }
    }
  }), {
    state: i,
    get isSearchMode() {
      return a(ue);
    },
    get posts() {
      return a(Ue);
    },
    get displayTotalCount() {
      return a(Ge);
    },
    get displayPage() {
      return a(re);
    },
    get totalPages() {
      return a(kt);
    },
    get canGoPrevious() {
      return a(vt);
    },
    get canGoFirst() {
      return a(xt);
    },
    get canGoNext() {
      return a(st);
    },
    get canGoLast() {
      return a(tn);
    },
    get showPaging() {
      return a(yt);
    },
    get canLoadOlder() {
      return a(Ze);
    },
    get canLoadNewer() {
      return a(ot);
    },
    get canReturnToLatest() {
      return a(It);
    },
    get canJumpToOldest() {
      return a($n);
    },
    get canFetchOlderFromRelays() {
      return a(nn);
    },
    get isFetchingOlderFromRelays() {
      return a(An);
    },
    get isFetchingFromRelays() {
      return a(vr);
    },
    get isRefetchingAroundCurrentView() {
      return a(Fe);
    },
    get showLocalExhaustedState() {
      return a(Tr);
    },
    get showSavedPostsBoundary() {
      return a(mt);
    },
    get isShowingSavedOlderPosts() {
      return i.listingMode === "sparse" && i.sparseSource === "saved";
    },
    get visibleNewestCreatedAt() {
      return a(pt);
    },
    get visibleOldestCreatedAt() {
      return a(ut);
    },
    get visiblePostCount() {
      return a(Ht);
    },
    get latestOlderBackfillUiResult() {
      return i.latestOlderBackfillUiResult;
    },
    get syncStatus() {
      return i.syncStatus;
    },
    get syncStatusMessageKey() {
      return a(bn);
    },
    get showSyncLoader() {
      return a(Yt);
    },
    get showStatusLoader() {
      return a(Cn);
    },
    get isSearchPageLoading() {
      return a(Re);
    },
    get searchResultStatus() {
      return a(ae);
    },
    get initialLocalLoadStatus() {
      return a(He);
    },
    get canRefetchAroundCurrentView() {
      return a(mn);
    },
    get currentViewRefetchStatusMessageKey() {
      return a(On);
    },
    get currentViewRefetchStatusMessageValues() {
      return a(Yn);
    },
    prepareForClose: $a,
    cancelCurrentSync: hn,
    cancelCurrentViewRefetch: Rr,
    loadOlder: Es,
    loadNewer: io,
    returnToLatest: As,
    showSavedOlderPosts: ks,
    jumpToOldest: lo,
    jumpToCreatedAt: er,
    jumpToEventId: mr,
    fetchOlderFromRelays: Ks,
    goFirstPage: Ka,
    goPreviousPage: _s,
    goToNextPage: Ya,
    goToLastPage: js,
    refetchAroundCurrentView: Ys,
    resetSearchState: wn,
    refreshAfterLocalImport: co,
    deleteLocalHistory: ds,
    patchDeletedPost: Ds
  };
}
const To = /* @__PURE__ */ new Map();
function Td(t) {
  if (typeof t != "string")
    return null;
  const e = t.trim();
  return e.length > 0 ? e : null;
}
function bh(t) {
  return typeof t == "string" ? t.trim() : "";
}
function Md(t) {
  const e = Td(t.pubkeyHex);
  if (!e)
    return null;
  const n = t.mode === "search" ? bh(t.searchQuery) : "";
  return `${e}:${t.mode}:${n}`;
}
function Pm(t) {
  const e = Md(t);
  if (!e)
    return null;
  const n = To.get(e);
  return n ? {
    ...n,
    anchor: { ...n.anchor }
  } : null;
}
function xm(t) {
  const e = Md(t), n = Td(t.pubkeyHex);
  !e || !n || To.set(e, {
    pubkeyHex: n,
    mode: t.mode,
    searchQuery: t.mode === "search" ? bh(t.searchQuery) : "",
    anchor: { ...t.anchor },
    savedAt: t.savedAt ?? Date.now()
  });
}
function Cc(t) {
  const e = Td(t.pubkeyHex);
  if (e) {
    if (t.mode) {
      const n = Md({
        pubkeyHex: e,
        mode: t.mode,
        searchQuery: t.searchQuery
      });
      n && To.delete(n);
      return;
    }
    for (const n of To.keys())
      n.startsWith(`${e}:`) && To.delete(n);
  }
}
const So = 1, Im = 2, Sm = 12;
function Rm(t) {
  return `${t.pubkeyHex}:${t.mode}:${t.searchQuery}:${t.anchor.eventId}:${t.savedAt}`;
}
function _m({
  getShow: t,
  getPubkeyHex: e,
  getPosts: n,
  getLocale: r,
  getContainer: o,
  getIsSearchMode: s,
  getSearchQuery: l
}) {
  let c = ye(null), u = ye(!0), b = ye(!0), g = null, y = ye(null), x = !1, f = null;
  function R() {
    return s() ? "search" : "normal";
  }
  function w() {
    return s() ? l() : "";
  }
  function m() {
    return Pm({
      pubkeyHex: e(),
      mode: R(),
      searchQuery: w()
    });
  }
  function i(F) {
    return !!F && n().some((U) => U.eventId === F.anchor.eventId);
  }
  function O() {
    const F = G();
    F && xm({
      pubkeyHex: e(),
      mode: R(),
      searchQuery: w(),
      anchor: F
    });
  }
  function W() {
    Cc({
      pubkeyHex: e(),
      mode: R(),
      searchQuery: w()
    }), p(y, null), f = null;
  }
  function $() {
    Cc({ pubkeyHex: e() }), p(y, null), f = null;
  }
  function X() {
    const F = o();
    F && (F.scrollTop = 0, D(), ee(), ne());
  }
  function me() {
    const F = o();
    F && (F.scrollTop = F.scrollHeight, D(), ee(), ne());
  }
  function D() {
    const F = o();
    if (!F) {
      p(u, !0);
      return;
    }
    p(u, F.scrollTop <= So);
  }
  function ee() {
    const F = o();
    if (!F) {
      p(b, !0);
      return;
    }
    const U = F.scrollHeight - F.clientHeight - F.scrollTop;
    p(b, U <= Im);
  }
  function ve() {
    const F = o();
    if (!F)
      return null;
    const U = F.getBoundingClientRect(), ce = U.top + Sm, pe = Array.from(F.querySelectorAll("[data-post-history-event-id]"));
    let q = null;
    for (const De of pe) {
      const nt = Number(De.dataset.postHistoryPostedAt);
      if (!Number.isFinite(nt))
        continue;
      const rt = De.getBoundingClientRect();
      if (rt.bottom > U.top + So && rt.top < U.bottom - So) {
        if (rt.top <= ce && rt.bottom > ce)
          return nt;
        q === null && (q = nt);
      }
    }
    return q;
  }
  function Re() {
    if (!t() || n().length === 0) {
      p(c, null);
      return;
    }
    const F = ve();
    p(
      c,
      F === null ? null : cf(F, r()),
      !0
    );
  }
  function ae() {
    fe(), Re(), S();
  }
  function fe() {
    g !== null && (cancelAnimationFrame(g), g = null);
  }
  function ne() {
    t() && (fe(), g = requestAnimationFrame(() => {
      g = null, Re();
    }));
  }
  function ke() {
    if (D(), ee(), a(b)) {
      ae();
      return;
    }
    ne();
  }
  function He() {
    da().then(() => {
      t() && X();
    });
  }
  function xe() {
    da().then(() => {
      t() && me();
    });
  }
  function se(F) {
    da().then(() => {
      t() && de({ eventId: F, offsetTop: 0 });
    });
  }
  function G() {
    const F = o();
    if (!F)
      return null;
    const U = F.getBoundingClientRect(), ce = Array.from(F.querySelectorAll("[data-post-history-event-id]"));
    for (const pe of ce) {
      const q = pe.dataset.postHistoryEventId;
      if (!q)
        continue;
      const De = pe.getBoundingClientRect();
      if (De.bottom > U.top + So && De.top < U.bottom - So)
        return { eventId: q, offsetTop: De.top - U.top };
    }
    return null;
  }
  function de(F) {
    const U = o();
    if (!F || !t() || !U)
      return !1;
    S();
    const ce = Array.from(U.querySelectorAll("[data-post-history-event-id]")).find((nt) => nt.dataset.postHistoryEventId === F.eventId);
    if (!ce)
      return !1;
    const pe = U.getBoundingClientRect(), De = ce.getBoundingClientRect().top - pe.top;
    return U.scrollTop += De - F.offsetTop, ne(), !0;
  }
  function Se(F, U) {
    const ce = o();
    return ce ? Array.from(ce.querySelectorAll("[data-post-history-thread-anchor-event-id]")).find((pe) => pe.dataset.postHistoryThreadAnchorScopeId === F && pe.dataset.postHistoryThreadAnchorEventId === U) ?? null : null;
  }
  function $e(F, U) {
    const ce = Se(F, U);
    return ce ? {
      scopeEventId: F,
      eventId: U,
      top: ce.getBoundingClientRect().top
    } : null;
  }
  function te(F) {
    const U = o();
    if (!F || !t() || !U)
      return !1;
    S();
    const ce = Se(F.scopeEventId, F.eventId);
    if (!ce)
      return !1;
    const pe = ce.getBoundingClientRect().top - F.top;
    return Math.abs(pe) < 0.5 || (U.scrollTop += pe, ne(), D(), ee()), !0;
  }
  async function M(F, U, ce) {
    const pe = $e(F, U), q = ce();
    await da(), te(pe), await q, await da(), te(pe);
  }
  return Ke(() => {
    if (!t()) {
      x = !1, p(y, null), f = null, p(c, null), fe();
      return;
    }
    x || (x = !0, p(y, m(), !0), f = null);
  }), Ke(() => {
    if (!t() || !i(a(y)))
      return;
    const F = a(y), U = Rm(F);
    f !== U && da().then(() => {
      !t() || a(y) !== F || (de(F.anchor), f = U, p(y, null));
    });
  }), Ke(() => {
    if (!t()) {
      p(c, null), fe();
      return;
    }
    return o(), n(), r(), da().then(() => {
      t() && (Re(), D(), ee());
    }), () => {
      fe();
    };
  }), {
    get currentMonthLabel() {
      return a(c);
    },
    get isHistoryScrolledToTop() {
      return a(u);
    },
    get isHistoryScrolledToBottom() {
      return a(b);
    },
    readCurrentSessionScrollState: m,
    saveCurrentSessionScrollAnchor: O,
    clearCurrentSessionScrollAnchor: W,
    clearAllSessionScrollAnchorsForCurrentPubkey: $,
    handleHistoryScroll: ke,
    resetHistoryScrollSoon: He,
    resetHistoryScrollToBottomSoon: xe,
    scrollHistoryEventToTopSoon: se,
    captureHistoryScrollAnchor: G,
    restoreHistoryScrollAnchor: de,
    preserveThreadParentToggleScroll: M
  };
}
const wc = 100, Em = 86400, Am = 6e3, Pc = 8;
function km(t) {
  return Number.isFinite(t) ? Math.max(1, Math.trunc(t ?? wc)) : wc;
}
function Dm(t) {
  return Array.from(t.values()).map((e) => ({
    parentEventId: e.parentEventId,
    event: e.event,
    relayUrls: Array.from(e.relayUrls).sort((n, r) => n.localeCompare(r))
  })).sort((e, n) => e.event.created_at !== n.event.created_at ? e.event.created_at - n.event.created_at : e.event.id.localeCompare(n.event.id));
}
function Tm(t) {
  if (t.parents) {
    const n = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Set();
    for (const o of t.parents) {
      if (!o.eventId || r.has(o.eventId))
        continue;
      const s = n.get(o.eventId);
      if (s && (s.eventKind !== o.eventKind || s.createdAt !== o.createdAt || s.channelEventId && o.channelEventId && s.channelEventId !== o.channelEventId)) {
        n.delete(o.eventId), r.add(o.eventId);
        continue;
      }
      n.set(o.eventId, {
        ...o,
        channelEventId: o.channelEventId ?? s?.channelEventId ?? null,
        relayHints: Array.from(/* @__PURE__ */ new Set([
          ...s?.relayHints ?? [],
          ...o.relayHints
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
class Mm {
  console;
  setTimeoutFn;
  clearTimeoutFn;
  now;
  constructor(e = {}) {
    this.console = e.console ?? (typeof console < "u" ? console : { log: () => {
    }, warn: () => {
    }, error: () => {
    } }), this.setTimeoutFn = e.setTimeoutFn ?? ((n, r) => setTimeout(n, r)), this.clearTimeoutFn = e.clearTimeoutFn ?? ((n) => clearTimeout(n)), this.now = e.now ?? Date.now;
  }
  fetchDirectReplies(e, n) {
    const r = kl(), o = Tm(n), s = new Map(o.map((W) => [W.eventId, W])), l = o.map((W) => W.eventId), c = this.resolveRelayUrls(
      [
        ...n.relayHints ?? [],
        ...o.flatMap((W) => W.relayHints)
      ],
      n.relayConfig,
      n.relayLimit
    ), u = km(n.limit), b = Math.max(
      0,
      Math.trunc(Math.min(...o.map((W) => W.createdAt))) - Em
    ), g = /* @__PURE__ */ new Map();
    let y = !1, x, f, R;
    const w = () => {
      f !== void 0 && (this.clearTimeoutFn(f), f = void 0), x?.unsubscribe?.(), x = void 0;
    }, m = (W) => ({
      status: W === "failed" && g.size > 0 ? "partial" : W,
      events: Dm(g),
      fetchedAt: this.now(),
      relayUrls: c
    }), i = (W) => ($) => {
      y || (y = !0, w(), W(m($)));
    };
    return {
      promise: new Promise((W) => {
        const $ = i(W);
        R = $;
        try {
          if (l.length === 0) {
            $("success");
            return;
          }
          x = Dl(e, r, {
            on: c.length > 0 ? { relays: c } : { defaultReadRelays: !0 }
          }).subscribe({
            next: (X) => {
              this.handlePacket(g, s, X);
            },
            complete: () => $("success"),
            error: (X) => {
              this.console.error("post_history_reply_fetch_error", X), $("failed");
            }
          }), r.emit({
            kinds: Array.from(new Set(o.map((X) => X.eventKind))).sort(),
            "#e": l,
            since: b,
            limit: u
          }), r.over(), f = this.setTimeoutFn(() => {
            this.console.warn("post_history_reply_fetch_timeout", l.join(",")), $("failed");
          }, n.timeoutMs ?? Am);
        } catch (X) {
          this.console.error("post_history_reply_fetch_request_error", X), $("failed");
        }
      }),
      cancel: () => {
        R?.("cancelled");
      }
    };
  }
  handlePacket(e, n, r) {
    const o = r.event;
    if (!o?.id || o.kind !== 1 && o.kind !== 42)
      return;
    const s = ns(o).parentId, l = s ? n.get(s) : null;
    if (!l || !ys({ child: o, parent: l }).valid)
      return;
    const c = Mn.sanitizeExternalRelayUrls(
      typeof r.from == "string" ? [r.from] : [],
      { limit: 1 }
    )[0], u = e.get(o.id);
    if (!u) {
      e.set(o.id, {
        parentEventId: l.eventId,
        event: o,
        relayUrls: new Set(c ? [c] : [])
      });
      return;
    }
    if (!su(u.event, o)) {
      this.console.warn("post_history_reply_fetch_packet_conflict", o.id);
      return;
    }
    c && u.relayUrls.add(c);
  }
  resolveRelayUrls(e, n, r) {
    const o = Number.isFinite(r) ? Math.max(1, Math.trunc(r ?? Pc)) : Pc, s = Tl(e, o);
    if (s)
      return s;
    const l = n ? [
      ...Mn.extractReadRelays(n),
      ...Mn.extractWriteRelays(n)
    ] : [], c = Mn.sanitizeExternalRelayUrls([
      ...e ?? [],
      ...l
    ], { limit: o });
    return c.length > 0 ? c : Mn.sanitizeExternalRelayUrls(
      Nl,
      { limit: o }
    );
  }
}
const Om = new Mm(), Lm = "postHistoryDirectReplyFetchMetadata:", Ch = 1;
function Go(t) {
  return Lm + t;
}
function fi(t) {
  return typeof t == "number" && Number.isFinite(t);
}
function xc(t) {
  if (!t || typeof t != "object")
    return !1;
  const e = t;
  return typeof e.parentEventId == "string" && (e.completeness === "complete" || e.completeness === "partial") && fi(e.fetchedAt) && fi(e.requestStartedAt) && e.schemaVersion === Ch;
}
function Fm(t, e) {
  return t ? t.requestStartedAt > e.requestStartedAt ? !0 : t.requestStartedAt === e.requestStartedAt && t.completeness === "complete" && e.completeness === "partial" : !1;
}
class Hm {
  constructor(e = Ll, n = Date.now) {
    this.db = e, this.now = n;
  }
  async get(e) {
    if (!e)
      return null;
    const n = await this.db.meta.get(Go(e));
    return !n || !xc(n.value) ? null : {
      ...n.value,
      updatedAt: n.updatedAt
    };
  }
  async getForParentEventIds(e) {
    const n = Array.from(
      new Set(e.filter((o) => !!o))
    );
    return n.length === 0 ? [] : (await this.db.meta.bulkGet(
      n.map(
        (o) => Go(o)
      )
    )).flatMap((o) => !o || !xc(o.value) ? [] : [{
      ...o.value,
      updatedAt: o.updatedAt
    }]);
  }
  async save(e) {
    return !e.parentEventId || !fi(e.fetchedAt) || !fi(e.requestStartedAt) ? null : this.db.transaction("rw", this.db.meta, async () => {
      const n = await this.get(e.parentEventId);
      if (Fm(n, e))
        return n;
      const r = this.now(), o = {
        parentEventId: e.parentEventId,
        completeness: e.completeness,
        fetchedAt: e.fetchedAt,
        requestStartedAt: e.requestStartedAt,
        schemaVersion: Ch
      };
      return await this.db.meta.put({
        key: Go(e.parentEventId),
        value: o,
        updatedAt: r
      }), {
        ...o,
        updatedAt: r
      };
    });
  }
  async clear(e) {
    e && await this.db.meta.delete(Go(e));
  }
}
const $m = new Hm(), Sl = {
  totalCount: 0,
  groups: []
};
function Nm(t) {
  if (!Fl(t.content))
    return;
  const e = du(t.content);
  if (e)
    return cu(t.tags ?? []).get(e)?.url;
}
function Bm(t) {
  if (t.length === 0)
    return Sl;
  const e = [], n = /* @__PURE__ */ new Map();
  let r = 0;
  for (const o of t) {
    if (o.kind !== 7)
      continue;
    r += 1;
    const s = Nm(o), l = n.get(o.content);
    if (l === void 0) {
      n.set(o.content, e.length), e.push(
        s ? {
          content: o.content,
          count: 1,
          emojiUrl: s
        } : {
          content: o.content,
          count: 1
        }
      );
      continue;
    }
    const c = e[l], u = c.emojiUrl ?? s;
    e[l] = {
      ...c,
      count: c.count + 1,
      ...u ? { emojiUrl: u } : {}
    };
  }
  return r === 0 ? Sl : {
    totalCount: r,
    groups: e
  };
}
const Rl = {
  totalCount: 0,
  groups: []
}, Um = new Intl.Segmenter(void 0, {
  granularity: "grapheme"
});
function qm(t) {
  if (!Fl(t.content))
    return;
  const e = du(t.content);
  if (e)
    return cu(t.tags ?? []).get(e)?.url;
}
function Vm(t) {
  const e = t.trim();
  if (!e)
    return "";
  if (Fl(e))
    return e;
  const n = Um.segment(e)[Symbol.iterator]().next();
  return n.done ? "" : n.value.segment;
}
function jm(t, e) {
  return t ? t instanceof Map ? t.get(e) ?? null : t[e] ?? null : null;
}
function Km(t) {
  try {
    return eu(uf(t), 9, 4);
  } catch {
    return t.slice(0, 12);
  }
}
function Ym(t) {
  return t.profile?.displayName?.trim() || t.profile?.name?.trim() || Km(t.pubkey);
}
async function zm(t, e = uu) {
  return t ? e.getReactionRecords(t) : [];
}
function Ic(t, e) {
  if (t.length === 0)
    return Rl;
  const n = [], r = /* @__PURE__ */ new Map();
  let o = 0;
  for (const s of t) {
    if (s.kind !== 7)
      continue;
    o += 1;
    const l = Vm(s.content);
    if (!l)
      continue;
    const c = {
      eventId: s.eventId,
      pubkey: s.authorPubkey,
      profile: jm(e, s.authorPubkey),
      createdAt: s.createdAt
    }, u = r.get(l), b = qm(s);
    if (u === void 0) {
      r.set(l, n.length), n.push({
        content: l,
        count: 1,
        ...b ? { emojiUrl: b } : {},
        reactors: [c]
      });
      continue;
    }
    const g = n[u], y = g.emojiUrl ?? b;
    n[u] = {
      ...g,
      count: g.count + 1,
      ...y ? { emojiUrl: y } : {},
      reactors: [...g.reactors, c]
    };
  }
  return o === 0 ? Rl : {
    totalCount: o,
    groups: n
  };
}
function Qm() {
  let t = 0, e = 0;
  const n = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map();
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
    replaceChildrenFetchTask(s, l) {
      r.get(s)?.cancel(), r.set(s, l);
    },
    deleteChildrenFetchTask(s) {
      r.delete(s);
    },
    replaceDeletionFetchTask(s, l) {
      o.get(s)?.cancel(), o.set(s, l);
    },
    deleteDeletionFetchTask(s) {
      o.delete(s);
    },
    cancelAndClearFetchTasks() {
      r.forEach((s) => s.cancel()), o.forEach((s) => s.cancel()), r.clear(), o.clear();
    }
  };
}
function Wm(t = {}) {
  const e = t.setTimeoutFn ?? ((s, l) => setTimeout(s, l)), n = t.clearTimeoutFn ?? ((s) => clearTimeout(s)), r = /* @__PURE__ */ new Map();
  function o(s) {
    const l = r.get(s);
    l && (n(l), r.delete(s));
  }
  return {
    schedule(s, l, c = 400) {
      o(s);
      const u = e(() => {
        r.delete(s), l();
      }, c);
      r.set(s, u);
    },
    clear: o,
    clearAll() {
      r.forEach((s) => n(s)), r.clear();
    }
  };
}
function Jm(t, e) {
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
function Hs(t, e = {}) {
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
function Sc(t, e) {
  return {
    ...t,
    loadingChildren: e.showInitialLoading,
    revalidatingChildren: !e.showInitialLoading,
    visibleChildren: e.prefetchOnly ? t.visibleChildren : t.visibleChildren || e.showInitialLoading,
    childrenError: null
  };
}
function ko(t, e = {}) {
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
function vi(t, e) {
  return {
    ...t,
    loadingChildren: !1,
    revalidatingChildren: !1,
    visibleChildren: t.visibleChildren,
    childrenError: e.nextError
  };
}
function Gm(t) {
  return t.status === "deleted" ? "deleted" : t.status === "not-found" ? "not-found" : t.status === "resolved" && t.event ? "resolved" : "failed";
}
function Zm(t) {
  return t.nextRecordsLength > 0 ? "resolved" : t.resultEventsLength > 0 ? "deleted" : "not-found";
}
function Xm(t) {
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
        ...Hs(e, {
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
        ...Hs(n, {
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
function e0(t) {
  const e = () => {
    t.updateExpansion((n) => ({
      ...ko(n, {
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
function t0(t) {
  t.updateExpansion((e) => ({
    ...e,
    loadingParent: !1,
    revalidatingParent: !1,
    visibleParent: e.visibleParent,
    parentError: t.showInitialLoading ? t.errorCode : e.parentError,
    showParentLoadingIndicator: !1
  }));
}
function wh(t) {
  t.updateExpansion((e) => ({
    ...vi(e, {
      nextError: t.showInitialLoading && !t.prefetchOnly ? t.errorCode ?? "fetch_failed" : e.childrenError
    })
  }));
}
function Ph(t) {
  return typeof t.lastFetchedAt != "number" ? !0 : (t.now ?? Date.now()) - t.lastFetchedAt >= t.ttlMs;
}
function n0(t) {
  return !t.displayedCached || t.force ? !1 : !Ph({
    lastFetchedAt: t.lastFetchedAt,
    ttlMs: t.ttlMs,
    now: t.now
  });
}
function r0(t) {
  const e = n0(t);
  return {
    skipRevalidate: e,
    shouldShowInitialLoading: !t.displayedCached,
    shouldPrefetchReplyCountsOnSkip: e && !t.prefetchOnly
  };
}
function a0(t) {
  return !t.loading && !t.revalidating ? !1 : (t.onInFlight(), t.loading && t.onLoadingInFlight?.(), !0);
}
function Rc(t) {
  return t.hasVisibleData ? Ph({
    lastFetchedAt: t.lastFetchedAt,
    ttlMs: t.ttlMs,
    now: t.now
  }) : !1;
}
async function _c(t) {
  let e = !1;
  const n = () => {
    const r = t.isActive();
    return !r && !e && (e = !0, t.onInactive?.()), r;
  };
  try {
    await t.run({ ensureActive: n });
  } catch (r) {
    n() && await t.onError?.(r);
  } finally {
    t.cleanup?.();
  }
}
async function Ec(t) {
  let e = !1;
  const n = () => {
    const o = t.isActive();
    return !o && !e && (e = !0, t.onInactive?.()), o;
  }, r = /* @__PURE__ */ new Map();
  if (t.prepareItem)
    for (const o of t.items)
      r.set(o, t.prepareItem(o));
  try {
    await t.run({ ensureActive: n }), n() && t.completeBatch?.(!0);
  } catch (o) {
    n() && (t.completeBatch?.(!1), await t.onError?.(o));
  } finally {
    if (t.cleanupItem)
      for (const o of t.items)
        r.has(o) && t.cleanupItem(o, r.get(o));
    t.cleanup?.();
  }
}
async function Ac(t) {
  const e = t.strategies[t.status] ?? t.fallback;
  e && await e();
}
async function s0(t) {
  if (t.skipRevalidate)
    return;
  const e = t.runRevalidate({
    showInitialLoading: t.shouldShowInitialLoading
  });
  t.awaitWhenInitialLoading && t.shouldShowInitialLoading && await e;
}
async function o0(t) {
  const e = r0(t);
  return e.shouldPrefetchReplyCountsOnSkip && t.onSkipPrefetchReplyCounts?.(), await s0({
    skipRevalidate: e.skipRevalidate,
    shouldShowInitialLoading: e.shouldShowInitialLoading,
    awaitWhenInitialLoading: t.awaitWhenInitialLoading,
    runRevalidate: t.runRevalidate
  }), e;
}
async function kc(t) {
  if (a0({
    loading: t.loading,
    revalidating: t.revalidating,
    onInFlight: t.onInFlight,
    onLoadingInFlight: t.onLoadingInFlight
  }) || t.shouldHandleLoadedState && await t.handleLoadedState())
    return;
  t.prepareFreshLoadState();
  const e = await t.displayCachedForFreshLoad();
  await o0({
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
function Da(t) {
  return Mn.sanitizeExternalRelayUrls(t, { limit: 8 });
}
function Dc(t) {
  return Array.from(new Set(t));
}
const i0 = 20, l0 = 12, d0 = 2, Tc = 4, c0 = 4, Mc = 300 * 1e3;
class xh extends Error {
}
function Oc(t) {
  if (t === "failed")
    throw new Error("post_history_reply_fetch_failed");
  if (t === "cancelled")
    throw new xh();
}
function u0(t) {
  return (e) => {
    if (e instanceof xh) {
      t.updateExpansion((n) => ({
        ...vi(n, { nextError: n.childrenError })
      }));
      return;
    }
    wh({ ...t, errorCode: "fetch_failed" });
  };
}
function Lc(t) {
  return t === "partial" ? "partial" : "complete";
}
function dl(t) {
  return t?.completeness === "complete" ? t.fetchedAt : null;
}
const Zo = 300 * 1e3;
let h0 = 0;
function f0(t, e) {
  const n = new Set(t.map((r) => r.eventId));
  return (e && e.length > 0 ? Array.from(new Set(e)) : Array.from(n)).filter((r) => n.has(r));
}
function Fc(t) {
  const e = es({
    event: t.parentNode.event,
    relayHints: t.parentNode.relayUrls
  });
  return !!e && ys({
    child: Eo(t.record),
    parent: e
  }).valid;
}
function Hc(t) {
  if (!t.parentNode)
    return null;
  const e = es({
    event: t.parentNode.event,
    relayHints: t.parentNode.relayUrls
  });
  return e && ys({ child: t.childNode.event, parent: e }).valid ? t.parentNode : null;
}
function v0({
  getShow: t,
  getPubkeyHex: e,
  getRxNostr: n,
  getRelayConfig: r,
  postHistoryRepositoryImpl: o = at,
  directReplyRecordsAdapterImpl: s = hf,
  reactionRecordsAdapterImpl: l = uu,
  childInteractionsRepositoryImpl: c = Ml,
  deletionRequestsRepositoryImpl: u = ro,
  directReplyFetchMetadataRepositoryImpl: b = $m,
  profileSyncCoordinator: g = void 0,
  contextFetchService: y = Sd,
  replyFetchService: x = Om,
  deletionFetchService: f = Pi,
  relatedTargetResolver: R = void 0
}) {
  const w = g ?? Rd({ getShow: t, getRxNostr: n }), m = !g, i = R ?? _d({
    getShow: t,
    getRxNostr: n,
    getRelayConfig: r,
    postHistoryRepositoryImpl: o,
    contextFetchService: y,
    deletionRequestsRepositoryImpl: u,
    deletionFetchService: f,
    profileSyncCoordinator: w
  }), O = !R, W = `post-history-thread-graph-parent:${++h0}`;
  let $ = ye({}), X = ye({}), me = ye({}), D = ye({}), ee = ye({}), ve = ye(0);
  const Re = Wm(), ae = /* @__PURE__ */ new Set(), fe = /* @__PURE__ */ new Set(), ne = /* @__PURE__ */ new Set(), ke = /* @__PURE__ */ new Set();
  let He = ye({}), xe = ye({}), se = ye({}), G = ye({});
  const de = Qm();
  function Se(d) {
    const C = a(xe)[d] ?? [];
    p(G, {
      ...a(G),
      [d]: Ic(C, a(se))
    });
  }
  function $e(d, C) {
    p(se, { ...a(se), [d]: C });
    for (const [H, N] of Object.entries(a(xe)))
      N.some((V) => V.authorPubkey === d) && Se(H);
  }
  function te(d) {
    return a(He)[d] ?? Sl;
  }
  function M(d) {
    return a(G)[d] ?? Rl;
  }
  function F(d, C) {
    return a(D)[En(d, C)] ?? Ji();
  }
  function U(d, C, H) {
    const N = En(d, C);
    p(D, {
      ...a(D),
      [N]: H(a(D)[N] ?? Ji())
    });
  }
  function ce(d) {
    const C = mo(d), H = bo(a($)[C.eventId], C);
    return p($, { ...a($), [H.eventId]: H }), H;
  }
  function pe(d, C) {
    C && p(X, { ...a(X), [d]: C });
  }
  function q(d, C) {
    const H = a(me)[d] ?? [], N = oc(Dc([...H, ...C]).filter((V) => V !== d && !$n(V)), a($));
    p(me, { ...a(me), [d]: N });
  }
  function De(d) {
    const C = wl(d);
    return mo({
      event: C,
      relayUrls: Da([
        ...d.relayHints,
        ...d.acceptedRelays,
        ...d.fetchedRelays ?? []
      ]),
      sources: ["anchor", "history-record"]
    });
  }
  function nt(d) {
    const C = De(d), H = ce({
      event: C.event,
      relayUrls: C.relayUrls,
      sources: C.sources
    });
    return pe(H.eventId, H.parentEventId), ue(H.authorPubkey, H.relayUrls), H;
  }
  function rt(d, C) {
    if (!d || !C)
      return;
    let H = !1;
    const N = { ...a($) };
    for (const [V, Q] of Object.entries(a($)))
      Q.authorPubkey === d && (N[V] = bo(Q, { ...Q, profile: C }), H = !0);
    H && p($, N);
  }
  function ue(d, C = []) {
    const H = w.ensureProfile(d, C);
    rt(d, H);
  }
  const Fe = w.subscribe((d, C) => {
    t() && (rt(d, C), $e(d, C));
  });
  async function Ue(d) {
    const C = Da(d.relayUrls ?? []), H = ce({ ...d, relayUrls: C });
    return ue(d.event.pubkey, C), H;
  }
  function re(d, C, H) {
    const N = Xi.buildContext(d, C, H);
    return N ? Xi.toDescriptor(N, W) : null;
  }
  function Ge(d) {
    if (!d)
      return null;
    const C = i.getTargetSnapshot(d.eventId);
    if (C?.status !== "resolved" || !C.event)
      return d;
    const H = Da([...d.relayUrls, ...C.relayHints]), N = C.profile ?? d.profile ?? null;
    return d.event === C.event && d.profile === N && pl(d.relayUrls, H) ? d : bo(d, {
      ...d,
      event: C.event,
      relayUrls: H,
      profile: N
    });
  }
  function kt(d, C) {
    return Xi.getRelayHints(d, C);
  }
  function vt(d, C) {
    const H = ns(C.event);
    return Da([
      ...C.relayUrls,
      ...H.relayHints,
      ...d.relayHints,
      ...d.acceptedRelays,
      ...d.fetchedRelays ?? []
    ]);
  }
  function xt(d, C) {
    return Mn.sanitizeExternalRelayUrls(
      [
        ...C.flatMap((H) => {
          const N = ns(H.event);
          return [...H.relayUrls, ...N.relayHints];
        }),
        ...d.relayHints,
        ...d.acceptedRelays,
        ...d.fetchedRelays ?? []
      ],
      { limit: c0 }
    );
  }
  function st(d) {
    Re.clear(d);
  }
  function tn(d, C) {
    const H = En(d, C);
    Re.schedule(H, () => {
      const N = F(d, C);
      !N.loadingParent || !N.visibleParent || U(d, C, (V) => ({ ...V, showParentLoadingIndicator: !0 }));
    });
  }
  function yt(d, C) {
    return (a(me)[d] ?? []).map((N) => Ge(a($)[N])).filter((N) => !!N).filter((N) => !ut(N.authorPubkey, N.eventId)).map((N) => ({
      event: N.event,
      profile: N.profile,
      relayUrls: [...N.relayUrls],
      isOwnReply: N.authorPubkey === C
    }));
  }
  function Ze(d) {
    return (a(me)[d] ?? []).filter((C) => {
      const H = a($)[C];
      return H && !ut(H.authorPubkey, H.eventId);
    });
  }
  function ot(d, C, H) {
    return Ze(d).filter((N) => !C.includes(N) && !H.has(N));
  }
  function It(d, C, H, N = [], V = 0, Q = /* @__PURE__ */ new Set()) {
    const le = Ge(a($)[C]);
    if (!le || ut(le.authorPubkey, le.eventId) || N.includes(C) || Q.has(C))
      return null;
    Q.add(C);
    const Te = [...N, C], oe = F(d, C), we = le.parentEventId, _e = we ? N.includes(we) : !1, Me = we ? Hc({
      childNode: le,
      parentNode: Ge(a($)[we] ?? null)
    }) : null, Oe = oe.visibleParent && Me && !_e && V > -20 ? It(d, Me.eventId, H, Te, V - 1, Q) : null, it = V < i0 ? ot(C, Te, Q) : [], lt = it.length, Tt = oe.visibleChildren && lt > 0, Be = Tt ? it.map((Ye) => It(d, Ye, H, Te, V + 1, Q)).filter((Ye) => Ye !== null) : [];
    return {
      anchorEventId: d,
      node: le,
      parentTargetId: we,
      parentNodeState: Oe,
      parentExpansion: oe,
      parentAlreadyInPath: _e,
      repliesActionState: {
        status: oe.loadingChildren ? "loading" : oe.childrenError ? "failed" : oe.loadedChildren ? "loaded" : "unloaded",
        visible: Tt,
        replies: it,
        replyCount: lt,
        error: oe.childrenError
      },
      replyNodeStates: Be,
      isOwnReply: le.authorPubkey === H,
      depthFromAnchor: V,
      cycleDetected: !1
    };
  }
  function pt(d) {
    a(ve);
    const C = Ge(a($)[d.eventId]) ?? De(d), H = F(d.eventId, d.eventId), N = e() ?? d.pubkeyHex, V = /* @__PURE__ */ new Set([d.eventId]), Q = C.parentEventId, le = Q ? Ge(a($)[Q] ?? null) : null, Te = le && !ut(le.authorPubkey, le.eventId) ? Hc({ childNode: C, parentNode: le }) : null, oe = Te && H.visibleParent ? It(d.eventId, Te.eventId, N, [d.eventId], -1, V) : null, we = ot(d.eventId, [d.eventId], V), _e = new Set(we), Me = yt(d.eventId, N).filter((Tt) => _e.has(Tt.event.id)), Oe = we.length, it = H.visibleChildren && Oe > 0, lt = it ? we.map((Tt) => It(d.eventId, Tt, N, [d.eventId], 1, V)).filter((Tt) => Tt !== null) : [];
    return {
      anchorEventId: d.eventId,
      parentTargetId: Q,
      parentNode: Te,
      parentNodeState: oe,
      parentExpansion: H,
      repliesActionState: {
        status: H.loadingChildren ? "loading" : H.childrenError ? "failed" : H.loadedChildren ? "loaded" : "unloaded",
        visible: it,
        replies: Me,
        replyCount: Oe,
        error: H.childrenError
      },
      reactionSummary: te(d.eventId),
      reactionReadModel: M(d.eventId),
      replyItems: Me,
      replyNodeStates: lt
    };
  }
  function ut(d, C) {
    return !d || !C ? !1 : !!a(ee)[d]?.[C];
  }
  function $n(d) {
    const C = a($)[d];
    return C ? ut(C.authorPubkey, d) : !1;
  }
  function nn(d, C) {
    !d || !C || ut(d, C) || p(ee, {
      ...a(ee),
      [d]: {
        ...a(ee)[d] ?? {},
        [C]: !0
      }
    });
  }
  function An(d, C, H = {}) {
    const N = /* @__PURE__ */ new Set();
    for (const [V, Q] of Object.entries(a(X))) {
      if (Q !== d)
        continue;
      const le = a($)[d];
      C && le && le.authorPubkey !== C || N.add(V);
    }
    if (N.size !== 0)
      for (const [V, Q] of Object.entries(a(D))) {
        const le = V.indexOf(":");
        if (le < 0)
          continue;
        const Te = V.slice(0, le), oe = V.slice(le + 1);
        N.has(oe) && (!Q?.loadedParent && !Q?.visibleParent || U(Te, oe, (we) => Hs(we, {
          visibleParent: H.revealKnownParent ? !0 : we.visibleParent,
          parentDeleted: !0,
          lastFetchedParentAt: Date.now()
        })));
      }
  }
  function vr(d, C = {}) {
    for (const [H, N] of d.entries())
      for (const V of N)
        An(V, H, C);
  }
  function Tr(d) {
    let C = a(ee), H = !1;
    for (const [N, V] of d.entries()) {
      const Q = C[N] ?? {};
      let le = Q;
      for (const Te of V)
        le[Te] || (le = { ...le, [Te]: !0 }, H = !0);
      le !== Q && (C = { ...C, [N]: le });
    }
    H && (p(ee, C), vr(d));
  }
  function mt(d) {
    const C = {};
    let H = !1;
    for (const [N, V] of Object.entries(a(me))) {
      const Q = V.filter((le) => le !== d);
      C[N] = Q, Q.length !== V.length && (H = !0);
    }
    if (H && p(me, C), a(X)[d]) {
      const { [d]: N, ...V } = a(X);
      p(X, V);
    }
  }
  async function Ht(d, C = {}) {
    if (!d?.id || ut(d.pubkey, d.id))
      return !0;
    if (C.checkPostHistoryRepository === !1)
      return !1;
    try {
      if (typeof (await o.getByEventId(d.id))?.deletedAt == "number")
        return nn(d.pubkey, d.id), mt(d.id), !0;
    } catch {
    }
    return !1;
  }
  async function mn(d) {
    Tr(d);
    for (const C of d.values())
      for (const H of C)
        mt(H), await c.deleteChildInteractionByEventId(H);
  }
  async function bn(d) {
    const C = await u.getDeletedTargets(d.map((H) => ({ targetAuthorPubkey: H.pubkey, targetEventId: H.id })));
    await mn(C);
  }
  async function Yt(d, C, H, N = "default") {
    if (C.length === 0)
      return;
    const V = n();
    if (!V)
      return;
    const Q = C.filter((oe) => !ut(oe.pubkey, oe.id));
    if (Q.length === 0)
      return;
    const le = `${d}:deletions:${N}`, Te = f.fetchDeletionRequests(V, {
      targets: Q.map((oe) => ({
        event: oe,
        relayUrls: a($)[oe.id]?.relayUrls ?? []
      })),
      relayHints: H,
      relayConfig: r()
    });
    de.replaceDeletionFetchTask(le, Te);
    try {
      const oe = await Te.promise;
      if (!t())
        return;
      await u.upsertValidDeletionRequests({
        targetEvents: Q,
        deletionEvents: oe.events,
        fetchedAt: oe.fetchedAt
      });
    } catch {
      return;
    } finally {
      de.deleteDeletionFetchTask(le);
    }
    t() && await bn(Q);
  }
  async function Cn(d) {
    await bn(d);
    const C = [];
    for (const H of d) {
      if (await Ht(H)) {
        await c.deleteChildInteractionByEventId(H.id);
        continue;
      }
      C.push(H);
    }
    return C;
  }
  async function On(d) {
    const C = d.map((Q) => Eo(Q)), H = await Cn(C), N = new Set(H.map((Q) => Q.id)), V = [];
    for (const Q of d)
      N.has(Q.eventId) && V.push(Q);
    return V;
  }
  async function Yn(d) {
    const C = await Cn(d.map((V) => V.event)), H = new Set(C.map((V) => V.id)), N = [];
    for (const V of d)
      H.has(V.event.id) && N.push(V);
    return N;
  }
  async function hn(d) {
    return await bn([d.event]), await Ht(d.event, { checkPostHistoryRepository: d.checkPostHistoryRepository }) ? !1 : (Yt(d.anchorEventId, [d.event], d.relayHints), !0);
  }
  function Xe(d, C = d) {
    st(En(d, C)), U(d, C, (H) => ({
      ...Hs(H, {
        visibleParent: !0,
        parentDeleted: !0,
        lastFetchedParentAt: Date.now()
      })
    }));
  }
  function Gn(d, C) {
    st(En(d, C)), U(d, C, (H) => ({
      ...H,
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
  async function bt(d, C, H) {
    const N = H.parentEventId;
    if (!N)
      return !1;
    const V = i.getTargetSnapshot(N);
    if (V?.status === "deleted")
      return V.authorPubkey && (nn(V.authorPubkey, N), An(N, V.authorPubkey, { revealKnownParent: !0 })), Xe(d.eventId, C), !0;
    const Q = Ge(a($)[N] ?? null);
    if (Q) {
      const le = es({
        event: Q.event,
        relayHints: Q.relayUrls
      });
      if (!le || !ys({ child: H.event, parent: le }).valid)
        return Gn(d.eventId, C), !1;
      const Te = Da([
        ...Q.relayUrls,
        ...kt(d, H)
      ]), oe = await hn({
        anchorEventId: d.eventId,
        event: Q.event,
        relayHints: Te,
        checkPostHistoryRepository: Q.authorPubkey === e()
      });
      return t() ? oe ? (U(d.eventId, C, (we) => ({
        ...Hs(we, {
          parentDeleted: we.parentDeleted,
          lastFetchedParentAt: V?.updatedAt ?? we.lastFetchedParentAt
        })
      })), !0) : (Xe(d.eventId, C), !0) : !1;
    }
    if (!V)
      return !1;
    if (V.authorPubkey && ut(V.authorPubkey, N))
      return Xe(d.eventId, C), !0;
    if (V.status === "resolved" && V.event) {
      const le = es({
        event: V.event,
        relayHints: V.relayHints
      });
      if (!le || !ys({ child: H.event, parent: le }).valid)
        return Gn(d.eventId, C), !1;
      const Te = ce({
        event: V.event,
        relayUrls: V.relayHints,
        sources: ["fetched-parent"],
        profile: V.profile
      });
      return pe(Te.eventId, Te.parentEventId), U(d.eventId, C, (oe) => ({
        ...Hs(oe, {
          parentDeleted: !1,
          lastFetchedParentAt: V.updatedAt ?? oe.lastFetchedParentAt
        })
      })), !0;
    }
    return V.status === "not-found" ? (U(d.eventId, C, (le) => ({
      ...Hs(le, {
        parentMissing: !0,
        parentDeleted: !1,
        lastFetchedParentAt: V.updatedAt ?? le.lastFetchedParentAt
      })
    })), !0) : !1;
  }
  async function St(d, C, H, N = {}) {
    const V = H.parentEventId;
    if (!V)
      return;
    const Q = de.incrementRequestId(), le = En(d.eventId, C);
    U(d.eventId, C, (Te) => ({
      ...Jm(Te, { showInitialLoading: !!N.showInitialLoading })
    })), N.showInitialLoading && tn(d.eventId, C), await _c({
      isActive: () => Q === de.getRequestId() && t(),
      cleanup: () => {
        st(le);
      },
      onError: () => {
        t0({
          updateExpansion: (Te) => U(d.eventId, C, Te),
          showInitialLoading: !!N.showInitialLoading,
          errorCode: "fetch_failed"
        });
      },
      run: async ({ ensureActive: Te }) => {
        const oe = re(d, C, H);
        if (!oe)
          return;
        const we = await i.ensureTarget(oe, { force: !0, background: !N.showInitialLoading });
        if (!Te() || (st(le), !we))
          return;
        if (we.status === "resolved" && we.event) {
          const Me = es({ event: we.event, relayHints: we.relayHints });
          if (!Me || !ys({ child: H.event, parent: Me }).valid) {
            Gn(d.eventId, C);
            return;
          }
        }
        const _e = Gm(we);
        await Ac({
          status: _e,
          strategies: Xm({
            snapshot: we,
            parentEventId: V,
            showInitialLoading: !!N.showInitialLoading,
            updateExpansion: (Me) => {
              U(d.eventId, C, Me);
            },
            hideEvent: nn,
            markParentDeletedForEvent: An,
            setParentDeleted: () => {
              Xe(d.eventId, C);
            },
            isDeletedEvent: ut,
            upsertNode: () => ce({
              event: we.event,
              relayUrls: we.relayHints,
              sources: ["fetched-parent"],
              profile: we.profile
            }),
            upsertParentEdge: pe
          })
        });
      }
    });
  }
  async function Ne(d, C, H = {}) {
    const N = C === d.eventId ? nt(d) : a($)[C];
    if (!N?.parentEventId)
      return;
    const V = F(d.eventId, C);
    await kc({
      loading: V.loadingParent,
      revalidating: V.revalidatingParent,
      onInFlight: () => {
        U(d.eventId, C, (Q) => ({
          ...Q,
          visibleParent: !0,
          showParentLoadingIndicator: !1
        }));
      },
      onLoadingInFlight: () => {
        tn(d.eventId, C);
      },
      shouldHandleLoadedState: !H.force && V.loadedParent,
      handleLoadedState: async () => {
        if (V.parentDeleted)
          return Xe(d.eventId, C), !0;
        U(d.eventId, C, (le) => ({
          ...le,
          visibleParent: !0,
          showParentLoadingIndicator: !1
        }));
        const Q = await bt(d, C, N);
        return Rc({
          hasVisibleData: Q,
          lastFetchedAt: V.lastFetchedParentAt,
          ttlMs: Zo
        }) && St(d, C, N), !0;
      },
      prepareFreshLoadState: () => {
        U(d.eventId, C, (Q) => ({
          ...Q,
          visibleParent: !0,
          loadingParent: !0,
          parentError: null,
          parentMissing: !1,
          parentDeleted: !1,
          showParentLoadingIndicator: !1
        })), tn(d.eventId, C);
      },
      displayCachedForFreshLoad: async () => {
        const Q = await bt(d, C, N), le = F(d.eventId, C);
        return {
          displayedCached: Q,
          lastFetchedAt: le.lastFetchedParentAt
        };
      },
      force: !!H.force,
      ttlMs: Zo,
      awaitWhenInitialLoading: !0,
      runRevalidate: ({ showInitialLoading: Q }) => St(d, C, N, { showInitialLoading: Q })
    });
  }
  async function Dt(d, C = {}) {
    await Ne(d, d.eventId, C);
  }
  function Rr(d) {
    pr(d.eventId, d.eventId);
  }
  function pr(d, C) {
    st(En(d, C)), U(d, C, (H) => ({
      ...H,
      visibleParent: !1,
      showParentLoadingIndicator: !1
    }));
  }
  async function dr(d) {
    if (F(d.eventId, d.eventId).visibleParent) {
      Rr(d);
      return;
    }
    await Dt(d);
  }
  function Ln(d) {
    Dt(d, { force: !0 });
  }
  async function _r(d, C) {
    if (F(d.eventId, C).visibleParent) {
      pr(d.eventId, C);
      return;
    }
    await Ne(d, C);
  }
  function ua(d, C) {
    Ne(d, C, { force: !0 });
  }
  function fn(d) {
    const C = d.map((H) => H.fetchedAt).filter((H) => Number.isFinite(H));
    return C.length > 0 ? Math.max(...C) : null;
  }
  async function wn(d) {
    try {
      return {
        metadata: await b.get(d),
        readFailed: !1
      };
    } catch {
      return { metadata: null, readFailed: !0 };
    }
  }
  async function gr(d, C) {
    const { metadata: H, readFailed: N } = await wn(d);
    return N ? null : H ? H.completeness === "complete" ? H.fetchedAt : null : fn(C);
  }
  async function yr(d, C, H, N = {}) {
    const V = await s.getDirectReplyRecords(C);
    Yt(d.eventId, V.map((oe) => Eo(oe)), vt(d, H));
    const Q = await On(V);
    if (!t() || Q.length === 0)
      return !1;
    const le = await Or(H, Q, ["reply-db"], { resolveProfiles: !N.prefetchOnly });
    if (!t() || le.length === 0)
      return !1;
    if (!t())
      return !0;
    const Te = await gr(C, le);
    return t() && U(d.eventId, C, (oe) => ({
      ...ko(oe, {
        visibleChildren: N.prefetchOnly ? oe.visibleChildren : !0,
        lastFetchedChildrenAt: Te
      })
    })), !0;
  }
  async function Er(d, C, H, N = {}) {
    const V = En(d.eventId, C), Q = de.getRequestId(), le = de.createChildRequestToken(V), Te = Date.now();
    U(d.eventId, C, (oe) => ({
      ...Sc(oe, {
        showInitialLoading: !!N.showInitialLoading,
        prefetchOnly: !!N.prefetchOnly
      })
    })), await _c({
      isActive: () => Q === de.getRequestId() && de.getChildRequestToken(V) === le && t(),
      cleanup: () => {
        de.deleteChildrenFetchTask(V), de.deleteChildRequestToken(V), Ar(d.eventId, C);
      },
      onError: u0({
        updateExpansion: (oe) => U(d.eventId, C, oe),
        showInitialLoading: !!N.showInitialLoading,
        prefetchOnly: !!N.prefetchOnly
      }),
      run: async ({ ensureActive: oe }) => {
        if (!oe())
          return;
        const we = n();
        if (!we) {
          U(d.eventId, C, (Ye) => ({
            ...vi(Ye, {
              nextError: N.showInitialLoading && !N.prefetchOnly ? "nostr_not_ready" : null
            })
          }));
          return;
        }
        const _e = x.fetchDirectReplies(we, {
          eventId: C,
          createdAt: H.event.created_at,
          relayHints: vt(d, H),
          parents: [
            es({
              event: H.event,
              relayHints: vt(d, H)
            })
          ].filter((Ye) => Ye !== null),
          relayConfig: r()
        });
        de.replaceChildrenFetchTask(V, _e);
        const Me = await _e.promise;
        if (de.deleteChildrenFetchTask(V), !oe())
          return;
        Oc(Me.status), Yt(d.eventId, Me.events.map((Ye) => Ye.event), [
          ...vt(d, H),
          ...Me.relayUrls
        ]);
        const Oe = await Yn(Me.events);
        Me.events.length > 0 && await c.upsertChildInteractions({
          parentEventId: C,
          events: Oe,
          fetchedAt: Me.status === "partial" ? null : Me.fetchedAt
        });
        const it = await b.save({
          parentEventId: C,
          completeness: Lc(Me.status),
          fetchedAt: Me.fetchedAt,
          requestStartedAt: Te
        }), lt = dl(it), Tt = await On(await s.getDirectReplyRecords(C));
        if (!oe())
          return;
        Tt.length > 0 && await Or(H, Tt, ["reply-db", "fetched-child"], { resolveProfiles: !N.prefetchOnly });
        const Be = Zm({
          nextRecordsLength: Tt.length,
          resultEventsLength: Me.events.length
        });
        await Ac({
          status: Be,
          strategies: e0({
            fetchedAt: lt,
            prefetchOnly: !!N.prefetchOnly,
            updateExpansion: (Ye) => {
              U(d.eventId, C, Ye);
            },
            prefetchChildReplyCounts: () => {
              ta(d, C);
            }
          })
        }), Na({
          anchorEventId: d.eventId,
          nodeEventId: C,
          effectiveFetchedAt: lt,
          replyCount: Tt.length
        });
      }
    });
  }
  function zr(d, C) {
    ne.add(En(d, C));
  }
  function Zn(d, C) {
    ne.delete(En(d, C));
  }
  function Qr(d, C) {
    return ne.has(En(d, C));
  }
  function ha(d, C) {
    ke.add(En(d, C));
  }
  function Ar(d, C) {
    ke.delete(En(d, C));
  }
  function Wr(d, C) {
    return ke.has(En(d, C));
  }
  function $a(d) {
    for (const C of ke)
      C.endsWith(`:${d}`) && ke.delete(C);
  }
  function Mr(d, C) {
    if (!Wr(d.eventId, C))
      return;
    const H = En(d.eventId, C);
    if (de.getChildRequestToken(H) !== void 0)
      return;
    const N = F(d.eventId, C);
    Ar(d.eventId, C), !(!t() || !N.visibleChildren) && va(d, C, { force: !0 });
  }
  function fa(d, C, H) {
    const N = En(d.eventId, C);
    return de.getChildRequestToken(N) === void 0 && !Qr(d.eventId, C) ? !1 : (H || (ha(d.eventId, C), U(d.eventId, C, (V) => ({ ...V, visibleChildren: !0 }))), !0);
  }
  function Is(d, C) {
    return C === d.eventId ? nt(d) : a($)[C];
  }
  async function va(d, C, H = {}) {
    const N = Is(d, C);
    if (!N || fa(d, C, !!H.prefetchOnly))
      return;
    const V = F(d.eventId, C);
    await kc({
      loading: V.loadingChildren,
      revalidating: V.revalidatingChildren,
      onInFlight: H.prefetchOnly ? () => {
      } : () => {
        U(d.eventId, C, (Q) => ({ ...Q, visibleChildren: !0 }));
      },
      shouldHandleLoadedState: !H.force && V.loadedChildren,
      handleLoadedState: async () => {
        if (H.prefetchOnly)
          return !0;
        const Q = Ze(C).length > 0;
        return U(d.eventId, C, (le) => ({ ...le, visibleChildren: Q })), Q && ta(d, C), Rc({
          hasVisibleData: !0,
          lastFetchedAt: V.lastFetchedChildrenAt,
          ttlMs: Zo
        }) && Er(d, C, N), !0;
      },
      prepareFreshLoadState: () => {
      },
      displayCachedForFreshLoad: async () => {
        const Q = await yr(d, C, N, H), le = F(d.eventId, C);
        return {
          displayedCached: Q,
          lastFetchedAt: le.lastFetchedChildrenAt
        };
      },
      force: !!H.force,
      ttlMs: Zo,
      prefetchOnly: !!H.prefetchOnly,
      awaitWhenInitialLoading: !1,
      onSkipPrefetchReplyCounts: () => {
        ta(d, C);
      },
      runRevalidate: ({ showInitialLoading: Q }) => Er(d, C, N, { prefetchOnly: H.prefetchOnly, showInitialLoading: Q })
    });
  }
  async function Ia(d, C = {}) {
    await va(d, d.eventId, C);
  }
  async function ta(d, C) {
    const H = En(d.eventId, C);
    if (!fe.has(H)) {
      fe.add(H);
      try {
        await pa(d, C);
      } finally {
        fe.delete(H);
      }
    }
  }
  async function pa(d, C) {
    const H = Date.now(), N = de.getRequestId(), V = Ze(C).filter((_e) => {
      const Me = F(d.eventId, _e), Oe = typeof Me.lastFetchedChildrenAt == "number" && H - Me.lastFetchedChildrenAt < Mc;
      return !Me.loadedChildren && !Me.loadingChildren && !Me.revalidatingChildren && !Oe;
    });
    if (V.length === 0)
      return;
    for (const _e of V)
      zr(d.eventId, _e);
    const Q = [];
    if (await Promise.all(V.map(async (_e) => {
      try {
        if (!t()) {
          Zn(d.eventId, _e);
          return;
        }
        const Me = await is(d, _e), Oe = F(d.eventId, _e), it = typeof Oe.lastFetchedChildrenAt == "number" && Date.now() - Oe.lastFetchedChildrenAt < Mc, lt = !Me || Oe.lastFetchedChildrenAt === null;
        lt && N === de.getRequestId() && t() && Qr(d.eventId, _e) && de.getChildRequestToken(En(d.eventId, _e)) === void 0 && !Oe.loadingChildren && !Oe.revalidatingChildren && (!Oe.loadedChildren || Oe.lastFetchedChildrenAt === null) && !it ? Q.push(_e) : (Zn(d.eventId, _e), lt ? Mr(d, _e) : Ar(d.eventId, _e));
      } catch {
        Zn(d.eventId, _e), Mr(d, _e);
      }
    })), Q.sort((_e, Me) => Number(Wr(d.eventId, Me)) - Number(Wr(d.eventId, _e))), Q.splice(l0).forEach((_e) => {
      Zn(d.eventId, _e), Mr(d, _e);
    }), !t() || Q.length === 0) {
      Q.forEach((_e) => {
        Zn(d.eventId, _e), Mr(d, _e);
      });
      return;
    }
    const le = [];
    for (let _e = 0; _e < Q.length; _e += Tc)
      le.push(Q.slice(_e, _e + Tc));
    let Te = 0;
    const oe = Math.min(d0, le.length), we = async () => {
      for (; t(); ) {
        const _e = Te;
        Te += 1;
        const Me = le[_e];
        if (!Me)
          return;
        await Ba(d, Me);
      }
    };
    try {
      await Promise.all(Array.from({ length: oe }, () => we()));
    } finally {
      V.forEach((_e) => Zn(d.eventId, _e));
    }
  }
  async function is(d, C) {
    const H = await s.getDirectReplyRecords(C), { metadata: N, readFailed: V } = await wn(C);
    if (!t())
      return !1;
    const Q = await On(H), le = a($)[C];
    if (!t() || !le || Q.length === 0 && !N)
      return !1;
    const Te = await Or(le, Q, ["reply-db"], { resolveProfiles: !1 });
    if (!t() || Te.length === 0 && !N)
      return !1;
    const oe = V ? null : N ? N.completeness === "complete" ? N.fetchedAt : null : fn(Te);
    return t() && U(d.eventId, C, (we) => ({
      ...ko(we, { lastFetchedChildrenAt: oe })
    })), !0;
  }
  function Sa(d, C) {
    const H = new Set(C), N = /* @__PURE__ */ new Map();
    for (const V of d) {
      if (!H.has(V.parentEventId))
        continue;
      const Q = N.get(V.parentEventId) ?? [];
      Q.push(V), N.set(V.parentEventId, Q);
    }
    for (const V of N.values())
      V.sort((Q, le) => Q.createdAt !== le.createdAt ? Q.createdAt - le.createdAt : Q.eventId.localeCompare(le.eventId));
    return N;
  }
  function Na(d) {
    return d.effectiveFetchedAt !== null || d.replyCount > 0 ? !1 : (U(d.anchorEventId, d.nodeEventId, (C) => ({
      ...C,
      loadedChildren: !1,
      loadingChildren: !1,
      revalidatingChildren: !1,
      childrenError: null,
      lastFetchedChildrenAt: null
    })), !0);
  }
  function ga(d) {
    const C = { ...a($) }, H = { ...a(X) }, N = { ...a(me) }, V = { ...a(D) }, Q = { ...a(He) }, le = { ...a(xe) }, Te = { ...a(se) }, oe = { ...a(G) };
    let we = !1, _e = !1, Me = !1, Oe = !1;
    const it = /* @__PURE__ */ new Map(), lt = (Be) => {
      const Ye = bo(C[Be.eventId], Be);
      return C[Ye.eventId] = Ye, we = !0, Ye;
    }, Tt = (Be, Ye) => {
      Ye && (H[Be] = Ye, _e = !0);
    };
    for (const Be of d.targetParentIds) {
      const Ye = d.anchorNodesByParentId.get(Be);
      if (!Ye)
        continue;
      const qt = lt(Ye);
      Tt(qt.eventId, qt.parentEventId);
      const rn = d.reactionRecordsByParentId.get(Be) ?? [];
      Q[Be] = Bm(rn), le[Be] = rn;
    }
    for (const [Be, Ye] of Object.entries(d.cachedReactionProfilesByPubkey))
      Te[Be] = Ye;
    for (const Be of d.targetParentIds) {
      if (!d.anchorNodesByParentId.get(Be))
        continue;
      const qt = [], rn = [];
      for (const xn of d.directReplyRecordsByParentId.get(Be) ?? []) {
        const Rt = Eo(xn);
        if (ut(Rt.pubkey, Rt.id))
          continue;
        const na = lt(mo({
          event: Rt,
          relayUrls: Da(xn.relayUrls),
          sources: ["reply-db", "inbound-sync"]
        }));
        na.eventId !== Be && (Tt(na.eventId, Be), rn.push(na.eventId), qt.push(xn));
      }
      it.set(Be, rn);
      const er = d.metadataByParentId.get(Be) ?? null, mr = d.metadataReadFailedParentIds.has(Be);
      if (qt.length === 0 && !er)
        continue;
      const Ie = d.postsByParentId.get(Be);
      if (!Ie)
        continue;
      const je = En(Ie.eventId, Be), zt = V[je] ?? Ji();
      V[je] = er?.completeness === "partial" && qt.length === 0 ? {
        ...zt,
        loadedChildren: !1,
        loadingChildren: !1,
        revalidatingChildren: !1,
        childrenError: null,
        lastFetchedChildrenAt: null
      } : ko(zt, {
        lastFetchedChildrenAt: mr ? null : er ? dl(er) : fn(qt)
      }), Oe = !0;
    }
    for (const [Be, Ye] of it) {
      const qt = N[Be] ?? [];
      N[Be] = oc(Dc([...qt, ...Ye]).filter((rn) => rn !== Be && !$n(rn)), C), Me = !0;
    }
    for (const [Be, Ye] of d.knownNodeProfilesByPubkey)
      if (Ye)
        for (const [qt, rn] of Object.entries(C))
          rn.authorPubkey === Be && (C[qt] = bo(rn, { ...rn, profile: Ye }), we = !0);
    for (const Be of d.targetParentIds)
      oe[Be] = Ic(le[Be] ?? [], Te);
    we && p($, C), _e && p(X, H), Me && p(me, N), Oe && p(D, V), p(He, Q), p(xe, le), p(se, Te), p(G, oe);
  }
  async function Pn(d, C) {
    if (!t() || d.length === 0)
      return;
    const H = f0(d, C);
    if (H.length === 0)
      return;
    const N = de.getRequestId(), V = !!C?.length, Q = new Map(d.map((le) => [le.eventId, le]));
    await Ec({
      items: H,
      isActive: () => N === de.getRequestId() && t(),
      run: async ({ ensureActive: le }) => {
        const Te = H.flatMap((Ie) => {
          const je = Q.get(Ie);
          if (!je || !le())
            return [];
          const zt = En(je.eventId, Ie), xn = F(je.eventId, Ie);
          return !V && (ae.has(zt) || xn.loadedChildren || xn.loadingChildren || xn.revalidatingChildren) ? (ae.add(zt), []) : (ae.add(zt), [{ parentEventId: Ie, post: je }]);
        });
        if (Te.length === 0 || !le())
          return;
        const oe = Te.map(({ parentEventId: Ie }) => Ie), we = c.getChildInteractionsForParents ? await c.getChildInteractionsForParents(oe) : (await Promise.all(oe.map(async (Ie) => {
          const [je, zt] = await Promise.all([
            zm(Ie, l),
            s.getDirectReplyRecords(Ie)
          ]);
          return [...je, ...zt];
        }))).flat();
        if (!le())
          return;
        let _e = [];
        const Me = /* @__PURE__ */ new Set();
        try {
          b.getForParentEventIds ? _e = await b.getForParentEventIds(oe) : _e = (await Promise.all(oe.map((je) => wn(je)))).flatMap(({ metadata: je, readFailed: zt }, xn) => zt ? (Me.add(oe[xn]), []) : je ? [je] : []);
        } catch {
          for (const Ie of oe)
            Me.add(Ie);
        }
        if (!le())
          return;
        const Oe = Sa(await On(we), oe);
        if (!le())
          return;
        const it = new Map(Te.map(({ parentEventId: Ie, post: je }) => [Ie, De(je)])), lt = /* @__PURE__ */ new Map(), Tt = /* @__PURE__ */ new Map(), Be = [], Ye = /* @__PURE__ */ new Set(), qt = /* @__PURE__ */ new Map(), rn = (Ie, je) => {
          qt.set(Ie, Da([...qt.get(Ie) ?? [], ...je]));
        };
        for (const Ie of oe) {
          const je = it.get(Ie);
          if (!je)
            continue;
          rn(je.authorPubkey, je.relayUrls);
          const zt = [], xn = [];
          for (const Rt of Oe.get(Ie) ?? [])
            Rt.kind === 7 ? (zt.push(Rt), Rt.authorPubkey && (Ye.add(Rt.authorPubkey), rn(Rt.authorPubkey, je.relayUrls))) : (Rt.kind === 1 || Rt.kind === 42) && (Fc({ parentNode: je, record: Rt }) ? (xn.push(Rt), rn(Rt.authorPubkey, Rt.relayUrls)) : Be.push(Rt.eventId));
          lt.set(Ie, zt), Tt.set(Ie, xn);
        }
        if (Be.length > 0 && (await Promise.all(Be.map((Ie) => c.deleteChildInteractionByEventId(Ie))), !le()))
          return;
        const er = Ye.size > 0 ? await ru.getProfiles(Array.from(Ye), { allowBackgroundRefresh: !1 }) : {};
        if (!le())
          return;
        const mr = /* @__PURE__ */ new Map();
        for (const [Ie, je] of qt)
          mr.set(Ie, w.ensureProfile(Ie, je));
        ga({
          postsByParentId: Q,
          targetParentIds: oe,
          anchorNodesByParentId: it,
          reactionRecordsByParentId: lt,
          directReplyRecordsByParentId: Tt,
          metadataByParentId: new Map(_e.map((Ie) => [Ie.parentEventId, Ie])),
          metadataReadFailedParentIds: Me,
          cachedReactionProfilesByPubkey: er,
          knownNodeProfilesByPubkey: mr
        });
      }
    });
  }
  async function Ba(d, C) {
    const H = C.map((Oe) => a($)[Oe]).filter((Oe) => !!Oe);
    if (H.length === 0)
      return;
    const N = de.getRequestId(), V = Date.now(), Q = /* @__PURE__ */ new Map(), le = /* @__PURE__ */ new Map();
    let Te = !1, oe = !1;
    const we = `${d.eventId}:children-prefetch:${C.join(",")}`, _e = () => Te || N !== de.getRequestId() || !t() ? !1 : C.every((Oe) => Qr(d.eventId, Oe) && de.getChildRequestToken(En(d.eventId, Oe)) === Q.get(Oe)), Me = (Oe) => {
      for (const it of C)
        wh({
          updateExpansion: (lt) => U(d.eventId, it, lt),
          showInitialLoading: !1,
          prefetchOnly: !0,
          errorCode: Oe
        });
    };
    await Ec({
      items: C,
      isActive: _e,
      prepareItem: (Oe) => {
        const it = En(d.eventId, Oe), lt = de.createChildRequestToken(it);
        return Q.set(Oe, lt), U(d.eventId, Oe, (Tt) => ({
          ...Sc(Tt, { showInitialLoading: !1, prefetchOnly: !0 })
        })), lt;
      },
      completeBatch: (Oe) => {
        if (Oe && _e())
          for (const it of C)
            U(d.eventId, it, (lt) => ({
              ...ko(lt, {
                loadedChildren: Oe && ((le.get(it) ?? null) !== null || Ze(it).length > 0),
                revalidatingChildren: !1,
                lastFetchedChildrenAt: le.get(it) ?? null
              })
            }));
      },
      cleanupItem: (Oe, it) => {
        const lt = En(d.eventId, Oe);
        de.getChildRequestToken(lt) === it && de.deleteChildRequestToken(lt), Zn(d.eventId, Oe), oe || Te ? Ar(d.eventId, Oe) : Mr(d, Oe);
      },
      cleanup: () => {
        de.deleteChildrenFetchTask(we);
      },
      onError: () => {
        Me("fetch_failed");
      },
      run: async ({ ensureActive: Oe }) => {
        if (!Oe())
          return;
        const it = n();
        if (!it) {
          Me("nostr_not_ready");
          return;
        }
        const lt = xt(d, H), Tt = x.fetchDirectReplies(it, {
          eventId: C[0] ?? "",
          eventIds: C,
          createdAt: Math.min(...H.map((Ie) => Ie.event.created_at)),
          relayHints: lt,
          parents: H.map((Ie) => es({
            event: Ie.event,
            relayHints: [
              ...Ie.relayUrls,
              ...ns(Ie.event).relayHints
            ]
          })).filter((Ie) => Ie !== null),
          relayConfig: r()
        });
        de.replaceChildrenFetchTask(we, Tt);
        const Be = await Tt.promise;
        if (de.deleteChildrenFetchTask(we), !Oe())
          return;
        if (Be.status === "cancelled") {
          Te = !0;
          for (const Ie of C)
            U(d.eventId, Ie, (je) => ({
              ...vi(je, { nextError: je.childrenError })
            }));
          return;
        }
        Oc(Be.status);
        const Ye = new Set(C), qt = Be.events.filter((Ie) => Ye.has(Ie.parentEventId) && Ie.event.id !== Ie.parentEventId);
        qt.length > 0 && await Yt(d.eventId, qt.map((Ie) => Ie.event), [...lt, ...Be.relayUrls], `children-prefetch:${C.join(",")}`);
        const rn = await Yn(qt);
        if (!Oe())
          return;
        const er = /* @__PURE__ */ new Map(), mr = new Map(qt.map((Ie) => [Ie.event.id, Ie.parentEventId]));
        for (const Ie of rn) {
          const je = mr.get(Ie.event.id);
          if (!je || !Ye.has(je))
            continue;
          const zt = er.get(je) ?? [];
          zt.push(Ie), er.set(je, zt);
        }
        for (const Ie of C) {
          const je = er.get(Ie) ?? [];
          if (je.length > 0 && await c.upsertChildInteractions({
            parentEventId: Ie,
            events: je,
            fetchedAt: Be.status === "partial" ? null : Be.fetchedAt
          }), !Oe())
            return;
          const zt = await b.save({
            parentEventId: Ie,
            completeness: Lc(Be.status),
            fetchedAt: Be.fetchedAt,
            requestStartedAt: V
          });
          le.set(Ie, dl(zt));
          const xn = await On(await s.getDirectReplyRecords(Ie)), Rt = a($)[Ie];
          Rt && await Or(Rt, xn, ["reply-db", "fetched-child"], { resolveProfiles: !1 });
        }
        Oe() && (oe = !0);
      }
    });
  }
  async function Or(d, C, H, N = {}) {
    const V = d.eventId, Q = [], le = [], Te = N.resolveProfiles !== !1;
    for (const oe of C) {
      const we = Eo(oe);
      if (!Fc({ parentNode: d, record: oe })) {
        await c.deleteChildInteractionByEventId(oe.eventId);
        continue;
      }
      if (ut(we.pubkey, we.id))
        continue;
      const _e = Te ? await Ue({ event: we, relayUrls: oe.relayUrls, sources: H }) : ce({
        event: we,
        relayUrls: Da(oe.relayUrls),
        sources: H
      });
      Te || ue(we.pubkey, Da(oe.relayUrls)), _e.eventId !== V && (pe(_e.eventId, V), Q.push(_e.eventId), le.push(oe));
    }
    return q(V, Q), le;
  }
  function Ss(d) {
    Ua(d.eventId, d.eventId);
  }
  function Ua(d, C) {
    Ar(d, C), U(d, C, (H) => ({ ...H, visibleChildren: !1 }));
  }
  function qa(d) {
    if (F(d.eventId, d.eventId).visibleChildren) {
      Ss(d);
      return;
    }
    Ia(d);
  }
  function ya(d) {
    Ia(d, { force: !0 });
  }
  function ma(d, C) {
    if (F(d.eventId, C).visibleChildren) {
      Ua(d.eventId, C);
      return;
    }
    va(d, C);
  }
  function Ra(d, C) {
    va(d, C, { force: !0 });
  }
  async function Va(d, C = []) {
    if (!d?.id || d.kind !== 1 && d.kind !== 42)
      return !0;
    const H = ns(d), N = H.parentId;
    if (!N)
      return !0;
    const V = C.find((Me) => Me.eventId === N) ?? null, Q = Object.keys(a(D)).filter((Me) => Me.endsWith(`:${N}`));
    if (!V && Q.length === 0)
      return !1;
    const le = i.getTargetSnapshot(N), Te = V ? a($)[N] ?? mo({
      event: wl(V),
      relayUrls: Da([
        ...V.relayHints,
        ...V.acceptedRelays,
        ...V.fetchedRelays ?? []
      ]),
      sources: ["history-record"]
    }) : a($)[N] ?? (le?.status === "resolved" && le.event ? mo({
      event: le.event,
      relayUrls: le.relayHints,
      sources: ["fetched-parent"]
    }) : null);
    if (!Te)
      return !1;
    const oe = es({ event: Te.event, relayHints: Te.relayUrls });
    if (!oe || !ys({ child: d, parent: oe }).valid || (await Cn([d])).length === 0)
      return !1;
    await c.upsertChildInteractions({
      parentEventId: N,
      events: [{ event: d, relayUrls: H.relayHints }]
    });
    const we = await On(await s.getDirectReplyRecords(N));
    if (!t())
      return !1;
    await Or(Te, we, ["reply-db", "posted-reply"]);
    const _e = (Me, Oe) => {
      U(Me, Oe, (it) => ({
        ...it,
        loadedChildren: !0,
        loadingChildren: !1,
        childrenError: null
      }));
    };
    V && _e(V.eventId, V.eventId);
    for (const Me of Q) {
      const Oe = Me.indexOf(":");
      Oe < 0 || _e(Me.slice(0, Oe), Me.slice(Oe + 1));
    }
    return !0;
  }
  async function Rs(d) {
    !d.eventId || !d.authorPubkey || ($a(d.eventId), nn(d.authorPubkey, d.eventId), mt(d.eventId), An(d.eventId, d.authorPubkey, { revealKnownParent: !0 }), d.deletionEvent && await u.upsertValidDeletionRequests({
      targetEvents: [
        {
          id: d.eventId,
          pubkey: d.authorPubkey,
          kind: 1,
          content: "",
          tags: [],
          created_at: d.deletionEvent.created_at,
          sig: ""
        }
      ],
      deletionEvents: [
        {
          event: d.deletionEvent,
          ...d.deletionEventAttestation ? { attestation: d.deletionEventAttestation } : {}
        }
      ],
      fetchedAt: Date.now()
    }), await c.deleteChildInteractionByEventId(d.eventId));
  }
  Ke(() => {
    t() && p(ve, i.getScopeRevision(W), !0);
  }), Ke(() => {
    if (t()) {
      a(ve);
      for (const d of Object.keys(a(D))) {
        const [C, H] = d.split(":"), V = a($)[H]?.parentEventId;
        if (!V)
          continue;
        const Q = i.getTargetSnapshot(V);
        Q?.status === "deleted" && (F(C, H).parentDeleted || (Q.authorPubkey && (nn(Q.authorPubkey, V), An(V, Q.authorPubkey, { revealKnownParent: !0 })), Xe(C, H)));
      }
    }
  });
  function Xn() {
    de.cancelAndClearFetchTasks(), de.clearChildRequestTokens(), ne.clear(), ke.clear(), m && w.reset(), Re.clearAll();
  }
  function Lr() {
    Xn(), O && i.reset(), de.incrementRequestId(), p($, {}), p(X, {}), p(me, {}), p(D, {}), p(ee, {}), p(He, {}), p(xe, {}), p(se, {}), ae.clear(), fe.clear();
  }
  return Ke(() => {
    t() || Lr();
  }), Ke(() => {
    if (t())
      return () => {
        Xn();
      };
  }), ao(() => {
    i.invalidateScope(W), Xn(), Fe(), O && i.reset(), m && w.dispose();
  }), {
    getAnchorState: pt,
    toggleParent: dr,
    retryParent: Ln,
    toggleNodeParent: _r,
    retryNodeParent: ua,
    toggleChildren: qa,
    retryChildren: ya,
    toggleNodeChildren: ma,
    retryNodeChildren: Ra,
    recordPostedReply: Va,
    recordDeletedEvent: Rs,
    loadCachedChildInteractionStateForPosts: Pn,
    cancelCurrentGraphFetches: Xn,
    resetState: Lr
  };
}
function $c(t) {
  return !!t && typeof t.use == "function";
}
function p0({
  getShow: t,
  getPubkeyHex: e,
  getRxNostr: n,
  getRelayConfig: r,
  getPosts: o,
  onSavedInboundInteractions: s = () => {
  },
  reconcileDirectReplyCandidates: l
}) {
  const c = lr({
    status: "idle",
    activePubkeyHex: null,
    hasStartedInitialDialogBootstrap: !1
  });
  let u = null, b = 0;
  function g() {
    b += 1, u?.cancel(), u = null, c.status = "idle";
  }
  async function y(f) {
    const R = e(), w = n();
    if (!t() || !R || !$c(w) || o().length === 0)
      return;
    if (f === "dialog-open-refresh") {
      const W = await Bd.get(R);
      if (typeof W?.lastDialogRefreshAt == "number" && Date.now() - W.lastDialogRefreshAt < ff)
        return;
    }
    g();
    const m = ++b;
    c.status = "syncing";
    const i = f === "dialog-open-refresh" ? lu.runInbound(w, {
      ownerPubkeyHex: R,
      relayConfig: r(),
      reason: f,
      reconcileDirectReplyCandidates: l
    }) : {
      ...vf.syncRecent(w, {
        ownerPubkeyHex: R,
        relayConfig: r(),
        reason: f,
        reconcileDirectReplyCandidates: l
      }),
      joinedExisting: !1
    };
    u = i;
    const O = await i.promise;
    m !== b || u !== i || !t() || e() !== R || (u = null, c.status = "idle", !(i.joinedExisting || O.status === "cancelled" || O.changedParentEventIds.length === 0) && (await s(O.changedParentEventIds), Ol({
      source: "dialog-inbound-sync",
      parentEventIds: O.changedParentEventIds,
      rxNostr: w,
      relayConfig: r(),
      isActive: () => t() && e() === R && n() === w
    }).then((W) => {
      if (!(W.status === "cancelled" || W.deletedReactionEventIds.length === 0 && W.deletedReplyEventIds.length === 0 || !t() || e() !== R || n() !== w))
        return Promise.resolve(s(O.changedParentEventIds)).catch(() => {
        });
    }).catch(() => {
    })));
  }
  async function x() {
    const f = e();
    if (!f)
      return;
    const R = await Bd.get(f);
    await y(R?.lastSyncedAt ? "dialog-open-refresh" : "initial-dialog-bootstrap");
  }
  return Ke(() => {
    const f = e() ?? null;
    f !== c.activePubkeyHex && (g(), c.activePubkeyHex = f, c.hasStartedInitialDialogBootstrap = !1);
  }), Ke(() => {
    if (!t()) {
      g(), c.hasStartedInitialDialogBootstrap = !1;
      return;
    }
    !e() || !$c(n()) || o().length === 0 || c.hasStartedInitialDialogBootstrap || (c.hasStartedInitialDialogBootstrap = !0, x());
  }), { state: c, cancelCurrentSync: g, runSync: y };
}
function g0(t) {
  return t.isSearchMode ? t.totalCount <= 0 ? null : {
    key: "postHistory.searchCountSummary",
    values: {
      total: t.totalCount
    }
  } : t.totalCountKnown ? {
    key: "postHistory.visibleCountSummary",
    values: {
      total: t.totalCount
    }
  } : t.totalCountStatus === "failed" ? { key: "postHistory.countUnavailable" } : { key: "postHistory.countLoading" };
}
function Nc(t) {
  return t.direction === "older" ? t.isSearchMode ? "postHistory.loadOlderSearchResults" : "postHistory.loadOlder" : t.isSearchMode ? "postHistory.loadNewerSearchResults" : "postHistory.loadNewer";
}
function y0(t) {
  return t.status === "loading" ? { key: "postHistory.checkingReplies" } : t.status === "failed" ? { key: "postHistory.recheckReplies" } : t.status === "loaded" ? t.replyCount === 0 ? { key: "postHistory.recheckReplies" } : t.visible ? { key: "postHistory.hideReplies" } : {
    key: "postHistory.showRepliesWithCount",
    values: {
      count: t.replyCount
    }
  } : { key: "postHistory.checkReplies" };
}
function m0(t) {
  return t.visible ? { key: "postHistory.hideReactions" } : {
    key: "postHistory.showReactionsWithCount",
    values: {
      count: t.reactionCount
    }
  };
}
function b0(t) {
  return t === "+";
}
const C0 = 1024 * 1024, w0 = 100, P0 = {
  status: "valid",
  ruleVersion: xi
}, cl = {
  status: "invalid",
  ruleVersion: xi
};
function x0(t) {
  return t?.ruleVersion === xi && (t.status === "valid" || t.status === "invalid");
}
function Ih(t) {
  return t?.status === "valid" && t.ruleVersion === xi;
}
function Sh(t) {
  if (wi(t))
    try {
      return `nostr:${Hl(t)}\0${t.id}\0${t.sig}`;
    } catch {
    }
  try {
    return `raw:${JSON.stringify(t)}`;
  } catch {
    return "raw:unserializable";
  }
}
function I0(t) {
  if (!wi(t))
    return { ...cl };
  try {
    const e = pf(t);
    return $l(e) && Hl(e) === e.id && Rf(e) ? { ...P0 } : { ...cl };
  } catch {
    return { ...cl };
  }
}
async function Bc(t, e) {
  for (const { id: n, fingerprint: r, verification: o } of t) {
    const s = await e.get(n);
    !s || Sh(s.rawEvent) !== r || await e.update(n, {
      rawEventVerification: o
    });
  }
}
function S0(t, e) {
  const n = (r) => ({
    get: async (o) => r.find((s) => s.id === o),
    update: async (o, s) => {
      const l = r.find((c) => c.id === o);
      l && Object.assign(l, s);
    }
  });
  return {
    post: n(t),
    deletion: n(e)
  };
}
async function R0(t, e, n, r) {
  const o = [
    ...t.map((y) => ({ type: "post", record: y })),
    ...e.map((y) => ({ type: "deletion", record: y }))
  ].filter((y) => !x0(y.record.rawEventVerification)), s = o.length;
  if (s === 0)
    return;
  let l = 0;
  const c = /* @__PURE__ */ new Map(), u = [], b = [];
  async function g() {
    if (u.length > 0) {
      const y = u.splice(0), x = () => Bc(y, n.post);
      await (n.transaction?.post ?? (async (f) => f()))(x);
    }
    if (b.length > 0) {
      const y = b.splice(0), x = () => Bc(y, n.deletion);
      await (n.transaction?.deletion ?? (async (f) => f()))(x);
    }
  }
  r?.({ phase: "verifying", processed: l, total: s });
  for (const y of o) {
    const x = Sh(y.record.rawEvent), f = c.get(x) ?? I0(y.record.rawEvent);
    c.set(x, f), y.record.rawEventVerification = f;
    const R = { id: y.record.id, fingerprint: x, verification: f };
    y.type === "post" ? u.push(R) : b.push(R), l += 1, l % w0 === 0 && (await g(), r?.({ phase: "verifying", processed: l, total: s }));
  }
  await g(), r?.({ phase: "verifying", processed: s, total: s });
}
function Rh(t, e) {
  if (!wi(t) || t.kind !== e)
    return !1;
  try {
    return $l(t) && Hl(t) === t.id;
  } catch {
    return !1;
  }
}
function Uc(t) {
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
function qc(t, e) {
  return t.created_at !== e.created_at ? t.created_at - e.created_at : t.id === e.id ? 0 : t.id < e.id ? -1 : 1;
}
function _0(t) {
  return t.rawEvent !== null && t.rawEvent !== void 0;
}
function E0(t, e, n) {
  return !Ih(t.rawEventVerification) || !Rh(e, 5) || e.pubkey !== n || t.targetAuthorPubkey !== n || t.deletionEventPubkey !== n || e.id !== t.deletionEventId ? !1 : hu(e).includes(t.targetEventId);
}
function A0() {
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
function k0(t, e) {
  if (t.length === 0)
    return {
      blob: new Blob([], { type: "application/x-ndjson;charset=utf-8" }),
      ...e ? { jsonl: "" } : {}
    };
  const n = [];
  let r = "";
  for (const o of t) {
    const s = `${JSON.stringify(o)}
`;
    r.length > 0 && r.length + s.length > C0 && (n.push(r), r = ""), r += s;
  }
  return r.length > 0 && n.push(r), {
    blob: new Blob(n, { type: "application/x-ndjson;charset=utf-8" }),
    ...e ? { jsonl: n.join("") } : {}
  };
}
async function D0(t, e, n, r = {}) {
  const o = A0(), s = [], l = [], c = /* @__PURE__ */ new Set(), u = /* @__PURE__ */ new Set(), b = /* @__PURE__ */ new Set(), g = e.filter((m) => m.pubkeyHex === t), y = n.filter(
    (m) => m.targetAuthorPubkey === t
  );
  for (const m of g)
    if (!(m.kind !== 1 && m.kind !== 42)) {
      if (!Ih(m.rawEventVerification) || !tu(m.rawEvent, m) || !Rh(m.rawEvent, m.kind)) {
        o.skippedPostCount += 1;
        continue;
      }
      s.push(Uc(m.rawEvent)), c.add(m.eventId), o.exportedPostEventCount += 1;
    }
  const x = /* @__PURE__ */ new Map();
  for (const m of y) {
    const i = x.get(m.deletionEventId) ?? [];
    i.push(m), x.set(m.deletionEventId, i);
  }
  for (const m of x.values()) {
    const i = m.find((O) => E0(O, O.rawEvent, t));
    if (i) {
      const O = Uc(i.rawEvent);
      l.push(O);
      for (const W of hu(O))
        u.add(W);
      o.exportedDeletionEventCount += 1;
      continue;
    }
    for (const O of m)
      b.add(O.targetEventId);
    m.every((O) => !_0(O)) ? o.missingDeletionRawEventCount += 1 : o.invalidDeletionRawEventCount += 1;
  }
  const f = /* @__PURE__ */ new Set();
  for (const m of g)
    m.kind !== 1 && m.kind !== 42 || m.deletedAt === void 0 || !c.has(m.eventId) || u.has(m.eventId) || b.has(m.eventId) || f.add(m.eventId);
  o.missingDeletionRawEventCount += f.size, s.sort(qc), l.sort(qc);
  const R = [...s, ...l];
  o.exportedEventCount = R.length, o.isPartial = o.skippedPostCount > 0 || o.missingDeletionRawEventCount > 0 || o.invalidDeletionRawEventCount > 0, r.onProgress?.({ phase: "creating" });
  const w = k0(R, r.includeJsonl === !0);
  return { result: o, ...w };
}
async function T0(t) {
  const e = t.postRecords.filter(
    (o) => o.pubkeyHex === t.pubkeyHex
  ), n = t.deletionRecords.filter(
    (o) => o.targetAuthorPubkey === t.pubkeyHex
  ), r = t.verificationStores ?? S0(e, n);
  return await R0(
    e,
    n,
    r,
    t.onProgress
  ), D0(
    t.pubkeyHex,
    e,
    n,
    t
  );
}
function Vc() {
  return {
    jsonl: "",
    exportedEventCount: 0,
    exportedPostEventCount: 0,
    exportedDeletionEventCount: 0,
    skippedPostCount: 0,
    missingDeletionRawEventCount: 0,
    invalidDeletionRawEventCount: 0,
    isPartial: !1
  };
}
class M0 {
  postHistoryRepository;
  deletionRequestsRepository;
  workerFactory;
  constructor(e = {}) {
    this.postHistoryRepository = e.postHistoryRepository ?? at, this.deletionRequestsRepository = e.deletionRequestsRepository ?? ro, this.workerFactory = e.workerFactory ?? (() => new Worker(
      new URL(
        /* @vite-ignore */
        "" + new URL("postHistoryJsonlExportWorker-BW9Cqqbr.js", import.meta.url).href,
        import.meta.url
      ),
      { type: "module" }
    ));
  }
  exportForPubkeyInWorker(e, n = {}) {
    if (!e) {
      const { jsonl: r, ...o } = Vc();
      return Promise.resolve({
        result: o,
        blob: new Blob([], { type: "application/x-ndjson;charset=utf-8" })
      });
    }
    return new Promise((r, o) => {
      const s = this.workerFactory();
      let l = !1;
      const c = () => {
        s.onmessage = null, s.onerror = null, n.signal?.removeEventListener("abort", b), s.terminate();
      }, u = (g) => {
        l || (l = !0, c(), o(g));
      }, b = () => u(new DOMException("Export aborted", "AbortError"));
      if (n.signal?.aborted) {
        b();
        return;
      }
      n.signal?.addEventListener("abort", b, { once: !0 }), s.onmessage = (g) => {
        const y = g.data;
        if (y.type === "progress") {
          n.onProgress?.(y.progress);
          return;
        }
        if (y.type === "error") {
          u(new Error(y.message));
          return;
        }
        if (y.type === "complete") {
          if (l) return;
          l = !0, c(), r({ result: y.result, blob: y.blob });
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
      return Vc();
    const [n, r] = await Promise.all([
      this.postHistoryRepository.getAll({ pubkeyHex: e }),
      this.deletionRequestsRepository.getAllForTargetAuthorPubkey(e)
    ]), o = await T0({
      pubkeyHex: e,
      postRecords: n,
      deletionRecords: r,
      includeJsonl: !0
    });
    return {
      ...o.result,
      jsonl: o.jsonl ?? ""
    };
  }
}
const O0 = new M0();
var L0 = j('<div class="xmark-icon svg-icon svelte-uxr0i8"></div>'), F0 = j('<h3 class="post-history-current-month-heading svelte-uxr0i8"><button type="button" class="post-history-current-month svelte-uxr0i8"> </button></h3>'), H0 = j('<div class="post-history-heading-summary svelte-uxr0i8"><div class="post-history-summary-row svelte-uxr0i8"><span class="post-history-summary-line post-history-summary-count svelte-uxr0i8"> </span></div></div>'), $0 = j('<div class="more-icon svg-icon"></div>'), N0 = j('<div class="search-icon svg-icon svelte-uxr0i8" aria-hidden="true"></div> <span class="svelte-uxr0i8"> </span>', 1), B0 = j('<div class="repair-icon svg-icon svelte-uxr0i8" aria-hidden="true"></div> <span class="svelte-uxr0i8"> </span>', 1), U0 = j('<div class="return-to-latest-icon svg-icon" aria-hidden="true"></div> <span class="svelte-uxr0i8"> </span>', 1), q0 = j('<div class="calendar-icon svg-icon" aria-hidden="true"></div> <span class="svelte-uxr0i8"> </span>', 1), V0 = j('<div class="jump-to-oldest-icon svg-icon" aria-hidden="true"></div> <span class="svelte-uxr0i8"> </span>', 1), j0 = j('<div class="export-icon svg-icon" aria-hidden="true"></div> <span class="svelte-uxr0i8"> </span>', 1), K0 = j('<div class="import-icon svg-icon svelte-uxr0i8" aria-hidden="true"></div> <span class="svelte-uxr0i8"> </span>', 1), Y0 = j('<div class="trash-icon svg-icon" aria-hidden="true"></div> <span class="svelte-uxr0i8"> </span>', 1), z0 = j('<div class="post-history-menu-body svelte-uxr0i8"><!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!></div>'), Q0 = j("<!> <!>", 1), W0 = j('<div class="search-icon svg-icon svelte-uxr0i8"></div>'), J0 = j('<div class="xmark-icon svg-icon svelte-uxr0i8" aria-hidden="true"></div>'), G0 = j('<div class="post-history-search-row svelte-uxr0i8"><div><div class="post-history-search-leading svelte-uxr0i8" aria-hidden="true"><!></div> <input class="post-history-search-input svelte-uxr0i8" type="search"/></div> <!></div>'), Z0 = j('<div class="calendar-icon svg-icon" aria-hidden="true"></div>'), X0 = j('<span class="post-history-date-picker-nav-icon post-history-date-picker-nav-icon-left svg-icon svelte-uxr0i8" aria-hidden="true"></span>'), eb = j('<span class="post-history-date-picker-nav-icon post-history-date-picker-nav-icon-right svg-icon svelte-uxr0i8" aria-hidden="true"></span>'), tb = j('<button type="button" class="post-history-date-picker-year-nav svelte-uxr0i8" aria-label="Previous year"><span class="post-history-date-picker-year-nav-icon post-history-date-picker-year-nav-icon-left svg-icon svelte-uxr0i8" aria-hidden="true"></span></button> <!> <!> <!> <button type="button" class="post-history-date-picker-year-nav svelte-uxr0i8" aria-label="Next year"><span class="post-history-date-picker-year-nav-icon post-history-date-picker-year-nav-icon-right svg-icon svelte-uxr0i8" aria-hidden="true"></span></button>', 1), nb = j("<!> <!>", 1), rb = j("<!> <!>", 1), ab = j("<!> <!> <!>", 1), sb = j('<div class="jump-icon svg-icon svelte-uxr0i8" aria-hidden="true"></div>'), ob = j('<div class="xmark-icon svg-icon svelte-uxr0i8" aria-hidden="true"></div>'), ib = j('<div class="post-history-utility-panel svelte-uxr0i8"><div class="post-history-utility-label svelte-uxr0i8" id="post-history-jump-date-label"> </div> <div class="post-history-utility-controls svelte-uxr0i8"><!> <!> <!></div></div>'), lb = j('<div class="post-history-list-loading svelte-uxr0i8" aria-hidden="true"><!></div>'), db = j('<div class="empty-state svelte-uxr0i8"><div class="empty-message svelte-uxr0i8"> </div></div>'), cb = j('<div class="keyboard-arrow-up-icon svg-icon" aria-hidden="true"></div> ', 1), ub = j('<div class="post-history-nav-row post-history-nav-row-top svelte-uxr0i8"><!></div>'), hb = j('<div class="post-history-auto-load-sentinel post-history-auto-load-newer-sentinel svelte-uxr0i8" aria-hidden="true"><!></div>'), fb = j('<div class="post-history-channel-row svelte-uxr0i8"><span class="channel-icon svg-icon svelte-uxr0i8" aria-hidden="true"></span> <span class="channel-label svelte-uxr0i8"> </span> <span class="channel-name svelte-uxr0i8"> </span></div>'), vb = j('<span class="deleted-badge svelte-uxr0i8"> </span>'), pb = j('<span class="delete-failed svelte-uxr0i8"> </span>'), gb = j('<div class="post-meta-inline svelte-uxr0i8"><!> <!></div>'), yb = j('<div class="more-icon svg-icon"></div>'), mb = j('<div class="calendar-icon svg-icon" aria-hidden="true"></div> <span class="svelte-uxr0i8"> </span>', 1), bb = j("<!> <!>", 1), Cb = j('<div class="post-history-menu-body svelte-uxr0i8"><div class="post-history-menu-timestamp"> </div> <!> <!> <!></div>'), wb = j("<!> <!>", 1), Pb = j('<span class="svelte-uxr0i8"> </span> <!>', 1), xb = j('<div class="post-preview-header svelte-uxr0i8"><!> <div class="post-preview-header-right svelte-uxr0i8"><!> <!></div></div>'), Ib = j('<div class="post-preview-quotes svelte-uxr0i8"></div>'), Sb = j('<div class="reply-icon svg-icon" aria-hidden="true"></div>'), Rb = j('<div class="quote-icon svg-icon" aria-hidden="true"></div>'), _b = j('<div class="favorite-icon svg-icon svelte-uxr0i8" aria-hidden="true"></div> <span class="svelte-uxr0i8"> </span>', 1), Eb = j('<div class="post-preview-action-buttons-group svelte-uxr0i8"><!> <div class="post-preview-footer-replies-slot svelte-uxr0i8"><!></div></div> <!> <div class="post-preview-footer-reaction-slot svelte-uxr0i8"><!></div>', 1), Ab = j('<div class="open-in-new-icon svg-icon" aria-hidden="true"></div> <span class="svelte-uxr0i8"> </span>', 1), kb = j('<div aria-hidden="true"></div> <span class="svelte-uxr0i8"> </span>', 1), Db = j('<div class="calendar-icon svg-icon" aria-hidden="true"></div> <span class="svelte-uxr0i8"> </span>', 1), Tb = j("<!> <!> <!> <!> <!>", 1), Mb = j('<div class="favorite-icon svg-icon post-preview-reaction-symbol svelte-uxr0i8" aria-hidden="true"></div>'), Ob = j('<span class="post-preview-reaction-content svelte-uxr0i8"> </span>'), Lb = j('<img class="post-preview-reaction-emoji" draggable="false" loading="lazy" decoding="async"/>'), Fb = j('<span class="post-preview-reaction-emoji-placeholder svelte-uxr0i8" aria-hidden="true"></span>'), Hb = j('<span class="post-preview-reaction-emoji-slot svelte-uxr0i8"><!></span>'), $b = j('<span class="post-preview-reaction-content svelte-uxr0i8"> </span>'), Nb = j('<span class="post-preview-reaction-actor svelte-uxr0i8"><!></span>'), Bb = j('<div class="post-preview-reaction-chip svelte-uxr0i8"><div class="post-preview-reaction-summary svelte-uxr0i8"><!> <span class="post-preview-reaction-count svelte-uxr0i8"> </span></div> <div class="post-preview-reaction-actors svelte-uxr0i8"></div></div>'), Ub = j('<div class="post-preview-reactions-panel svelte-uxr0i8"></div>'), qb = j("<!> <!>", 1), Vb = j('<span class="deleted-badge svelte-uxr0i8"> </span>'), jb = j('<span class="delete-failed svelte-uxr0i8"> </span>'), Kb = j('<div class="post-meta svelte-uxr0i8"><!> <!></div>'), Yb = j('<li><div class="post-history-main svelte-uxr0i8"><div class="post-preview svelte-uxr0i8"><!> <!> <div class="post-history-thread-anchor-post svelte-uxr0i8"><div class="post-preview-body svelte-uxr0i8"><!> <!></div> <!> <!></div></div> <!></div></li>'), zb = j('<div class="post-history-auto-load-sentinel svelte-uxr0i8" aria-hidden="true"><!></div>'), Qb = j('<div class="post-history-sparse-state svelte-uxr0i8" role="status"><p class="svelte-uxr0i8"> </p> <p class="svelte-uxr0i8"> </p></div>'), Wb = j('<div class="cloud-download-icon svg-icon" aria-hidden="true"></div> ', 1), Jb = j('<div class="keyboard-arrow-down-icon svg-icon" aria-hidden="true"></div> ', 1), Gb = j('<div class="post-history-saved-boundary svelte-uxr0i8" role="status"><div class="post-history-saved-boundary-actions svelte-uxr0i8"><!> <!></div></div>'), Zb = j('<div class="keyboard-arrow-down-icon svg-icon" aria-hidden="true"></div> ', 1), Xb = j('<div class="post-history-nav-row post-history-nav-row-bottom svelte-uxr0i8"><!></div>'), eC = j('<div class="keyboard-arrow-down-icon svg-icon" aria-hidden="true"></div> ', 1), tC = j('<div class="post-history-nav-row post-history-nav-row-bottom svelte-uxr0i8"><!></div>'), nC = j('<div class="cloud-download-icon svg-icon" aria-hidden="true"></div> ', 1), rC = j('<div class="post-history-exhausted-state svelte-uxr0i8"><!></div>'), aC = j('<!> <!> <ul class="post-history-list svelte-uxr0i8"></ul> <!> <!> <!>', 1), sC = j('<div class="vertical-align-top-icon svg-icon" aria-hidden="true"></div>'), oC = j('<div class="post-history-latest-row svelte-uxr0i8"><!></div>'), iC = j('<div class="post-history-heading svelte-uxr0i8"><div class="post-history-heading-main svelte-uxr0i8"><!></div> <div class="post-history-heading-actions svelte-uxr0i8"><!> <!> <!></div></div> <!> <!> <div><!></div> <!> <!> <!>', 1), lC = j('<div class="delete-confirm-body svelte-uxr0i8"><p class="delete-confirm-description svelte-uxr0i8"> </p> <p class="delete-confirm-warning svelte-uxr0i8"> </p></div>'), dC = j('<div class="delete-confirm-body svelte-uxr0i8"><p class="delete-confirm-description svelte-uxr0i8"> </p></div>'), cC = j("<div> </div>"), uC = j("<div> </div>"), hC = j("<div> </div>"), fC = j("<!> <!> <!> <!> <!> <!> <!>", 1);
const vC = {
  hash: "svelte-uxr0i8",
  code: `.post-history-dialog.dialog {top:0;translate:-50% 0;height:100svh;max-height:100svh;--btn-post-preview-action-hover: var(--svg);}.post-history-dialog.dialog.dialog-container-layout {height:100%;max-height:100%;}.post-history-dialog .dialog-content {position:relative;flex:1 1 auto;min-height:0;max-height:none;overflow:hidden;padding:0;}.post-history-heading.svelte-uxr0i8 {display:flex;align-items:stretch;justify-content:space-between;width:100%;padding:0;border-bottom:1px solid var(--border-hr);}.post-history-heading-main.svelte-uxr0i8 {flex:1 1 auto;min-width:0;align-self:stretch;}.post-history-current-month-heading.svelte-uxr0i8 {display:flex;align-items:center;height:100%;margin:0;}.post-history-current-month.svelte-uxr0i8 {color:var(--text-light);font-size:1.75rem;line-height:1.05;font-weight:600;letter-spacing:-0.04em;overflow-wrap:anywhere;padding:0 12px;--btn-bg: var(--dialog-bg);--text: var(--text-light);}.post-history-heading-actions.svelte-uxr0i8 {display:flex;align-items:center;justify-content:flex-end;align-self:stretch;flex:0 0 auto;min-width:0;gap:4px;}
            .post-history-action-button,
            .post-preview-reactions-button,
            .post-history-thread-toggle-button
         {color:var(--btn-post-preview-action);}
            .post-history-action-button .svg-icon,
            .post-preview-reactions-button .svg-icon,
            .post-history-thread-toggle-button .svg-icon
         {--svg: currentColor;}.post-history-heading-summary.svelte-uxr0i8 {display:flex;align-items:center;color:var(--text-muted);font-size:0.875rem;}.post-history-summary-row.svelte-uxr0i8 {display:flex;align-items:center;justify-content:flex-end;gap:8px;min-width:0;}.post-history-summary-line.svelte-uxr0i8 {overflow-wrap:anywhere;}.post-history-summary-count.svelte-uxr0i8 {flex:0 0 auto;white-space:nowrap;text-align:end;}.post-history-repair-button {white-space:nowrap;padding:6px 10px;font-size:0.82rem;}.post-history-search-row.svelte-uxr0i8 {display:flex;align-items:center;width:100%;}.post-history-search-input-wrapper.svelte-uxr0i8 {position:relative;flex:1 1 auto;min-width:0;border:1px solid var(--border-soft);background:var(--background);color:var(--text);font:inherit;border-bottom:1px solid var(--border-hr);}.post-history-search-leading.svelte-uxr0i8 {display:flex;position:absolute;inset:0 auto 0 0;width:40px;align-items:center;justify-content:center;color:var(--text-muted);pointer-events:none;}.post-history-search-leading .search-icon,
    .post-history-search-leading .inline-spinner {width:24px;height:24px;}.post-history-search-leading .loading-placeholder {width:24px;height:24px;flex:0 0 24px;}.post-history-search-active.svelte-uxr0i8 {border-bottom-color:color-mix(
            in srgb,
            var(--theme),
            var(--border-hr) 55%
        );}.post-history-search-input.svelte-uxr0i8 {display:block;width:100%;min-width:0;padding:10px 12px 10px 40px;border:0;background:transparent;color:inherit;font:inherit;}.post-history-search-close.square {flex:0 0 auto;min-height:40px;aspect-ratio:1;padding:0;background:var(--btn-bg);.svg-icon {width:28px;height:28px;}}.post-history-search-input.svelte-uxr0i8::placeholder {color:var(--text-muted);}.post-history-utility-panel.svelte-uxr0i8 {display:flex;flex-direction:column;padding:6px 16px 6px;border-bottom:1px solid var(--border-hr);gap:2px;}.post-history-utility-label.svelte-uxr0i8 {color:var(--text-muted);font-size:0.82rem;}.post-history-utility-controls.svelte-uxr0i8 {display:flex;flex-wrap:wrap;gap:4px;align-items:center;}.post-history-date-picker-input {display:inline-flex;align-items:stretch;gap:2px;min-width:0;padding:6px;height:40px;border:1px solid var(--border-hr);background:var(--background);color:var(--text);font:inherit;}.post-history-date-picker-segment {display:inline-flex;align-items:center;justify-content:center;min-width:1ch;height:auto;color:var(--text-muted);&[role="spinbutton"] {min-width:3ch;}&[data-segment="year"] {min-width:5ch;}}.post-history-date-picker-trigger {flex:0 0 auto;min-width:40px;min-height:40px;padding:0;}.post-history-date-picker-trigger .svg-icon {mask-image:var(--ehagaki-icon-63616c656e6461725f746f6461795f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);width:24px;height:24px;}.post-history-date-picker-content {z-index:110;background-color:var(--dialog-bg2);border:1px solid var(--border-soft);border-radius:8px;padding:8px;box-shadow:0 12px 28px rgb(0 0 0 / 0.16);}.post-history-date-picker-calendar {display:flex;flex-direction:column;gap:6px;}.post-history-date-picker-header {display:flex;align-items:center;justify-content:space-between;gap:8px;}.post-history-date-picker-heading {flex:1 1 auto;text-align:center;font-size:0.9rem;font-weight:600;}.post-history-date-picker-nav,
    .post-history-date-picker-year-nav {display:inline-flex;align-items:center;justify-content:center;width:30px;height:30px;border:1px solid var(--border-soft);border-radius:6px;background-color:var(--btn-bg2);color:var(--text);}.post-history-date-picker-nav-icon,
    .post-history-date-picker-year-nav-icon {width:24px;height:24px;background-color:currentColor;}.post-history-date-picker-nav-icon-left {margin-inline-end:1px;mask-image:var(--ehagaki-icon-6b6579626f6172645f6172726f775f6c6566745f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.post-history-date-picker-nav-icon-right {margin-inline-start:1px;mask-image:var(--ehagaki-icon-6b6579626f6172645f6172726f775f72696768745f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.post-history-date-picker-year-nav-icon-left {mask-image:var(--ehagaki-icon-6b6579626f6172645f646f75626c655f6172726f775f6c6566745f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.post-history-date-picker-year-nav-icon-right {mask-image:var(--ehagaki-icon-6b6579626f6172645f646f75626c655f6172726f775f72696768745f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.post-history-date-picker-grid {border-collapse:separate;border-spacing:2px;}.post-history-date-picker-weekday {color:var(--text-muted);font-size:0.74rem;font-weight:500;text-align:center;}.post-history-date-picker-day {display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:6px;font-size:0.86rem;}.post-history-date-picker-day[data-selected] {background:color-mix(in srgb, var(--theme), white 10%);color:white;}.post-history-date-picker-day[data-disabled] {opacity:0.45;}.post-history-utility-button {height:auto;min-height:40px;white-space:nowrap;}.post-history-utility-button.post-history-utility-submit-button,
    .post-history-utility-button.post-history-utility-close-button {min-width:70px;min-height:40px;}.post-history-nav-row.svelte-uxr0i8 {display:flex;justify-content:center;width:100%;padding:8px 16px;}.post-history-nav-row-top.svelte-uxr0i8 {padding-bottom:0;}.post-history-nav-row-bottom.svelte-uxr0i8 {padding-top:0;}.post-history-auto-load-sentinel.svelte-uxr0i8 {display:grid;min-height:1px;place-items:center;}.post-history-nav-button.primary {opacity:1;}.post-history-nav-button:not(.primary) {min-height:50px;white-space:nowrap;gap:4px;}.post-history-exhausted-state.svelte-uxr0i8 {display:flex;flex-direction:column;gap:10px;align-items:center;padding:0 16px 8px 16px;}.post-history-latest-row.svelte-uxr0i8 {position:absolute;inset:auto 16px 12px auto;display:flex;justify-content:flex-end;width:auto;margin:0;padding:0;z-index:3;.post-history-latest-button {min-width:50px;min-height:50px;background-color:color-mix(in srgb, var(--theme) 15%, transparent);backdrop-filter:blur(1px);.vertical-align-top-icon {mask-image:var(--ehagaki-icon-766572746963616c5f616c69676e5f746f705f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);width:26px;height:26px;opacity:0.6;}}}.post-history-container.svelte-uxr0i8 {flex:1 1 auto;min-height:0;width:100%;overflow-y:auto;}.post-history-container.post-history-auto-load-enabled.svelte-uxr0i8 {overflow-anchor:none;}.empty-state.svelte-uxr0i8 {display:grid;gap:8px;min-height:100px;align-content:center;}.post-history-list-loading.svelte-uxr0i8 {display:grid;min-height:100px;place-items:center;}.empty-message.svelte-uxr0i8 {display:flex;justify-content:center;align-items:center;height:100px;color:var(--text-muted);font-size:1rem;}.status-loading-placeholder {justify-content:flex-end;width:auto;column-gap:0;color:var(--text-muted);font-size:0.8rem;line-height:1.3;height:auto;}.status-loading-placeholder .loader-container {.square {background:currentColor;}}.status-loading-placeholder .placeholder-text {color:inherit;font-size:inherit;}.status-error {color:var(--danger);}.status-loading-placeholder.status-error .square {background-color:var(--danger);}.post-history-list.svelte-uxr0i8 {width:100%;margin:0;padding:0;list-style:none;}.post-history-item.svelte-uxr0i8 {display:flex;align-items:center;border-bottom:1px solid var(--border-hr-light);padding:6px;}.post-history-item.svelte-uxr0i8:last-child {border-bottom:none;}.post-history-item-deleted.svelte-uxr0i8 .post-meta-inline:where(.svelte-uxr0i8) > :where(.svelte-uxr0i8):not(.deleted-badge),
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
         {mask-image:var(--ehagaki-icon-766572746963616c5f616c69676e5f626f74746f6d5f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);background-color:currentColor;}.post-history-nav-button .keyboard-arrow-up-icon {mask-image:var(--ehagaki-icon-6b6579626f6172645f6172726f775f75705f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);width:28px;height:28px;}.post-history-nav-button .keyboard-arrow-down-icon {mask-image:var(--ehagaki-icon-6b6579626f6172645f6172726f775f646f776e5f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);width:28px;height:28px;}.post-history-nav-button .cloud-download-icon {mask-image:var(--ehagaki-icon-636c6f75645f646f776e6c6f61645f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);width:28px;height:28px;}.post-history-nav-loading-placeholder .loader-container .square {background-color:currentColor;}.post-preview.svelte-uxr0i8 {display:flex;flex-direction:column;min-width:0;color:var(--text);font-size:1rem;}.post-history-thread-anchor-post.svelte-uxr0i8 {display:flex;flex-direction:column;min-width:0;}.post-history-channel-row.svelte-uxr0i8 {display:flex;align-items:center;gap:6px;min-width:0;color:var(--text-muted);font-size:0.875rem;line-height:1.3;}.channel-icon.svelte-uxr0i8 {width:18px;height:18px;flex-shrink:0;mask-image:var(--ehagaki-icon-666f72756d5f323464705f3030303030305f46494c4c315f776768743430305f47524144305f6f70737a32342e737667);background-color:currentColor;}.channel-label.svelte-uxr0i8 {flex-shrink:0;}.channel-name.svelte-uxr0i8 {min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.post-preview-body.svelte-uxr0i8 {display:flex;flex-direction:column;padding-inline-start:1rem;gap:4px;.post-preview-content:where(.svelte-uxr0i8) {overflow-wrap:anywhere;white-space:pre-wrap;font-size:1rem;line-height:1.5;}.post-preview-media:where(.svelte-uxr0i8) {display:block;}.post-preview-quotes:where(.svelte-uxr0i8) {display:flex;flex-direction:column;gap:4px;}}.post-preview-reactions-button {display:flex;align-items:stretch;gap:4px;padding:0;padding-inline:6px;.favorite-icon.svelte-uxr0i8 {height:auto;mask-image:var(--ehagaki-icon-6661766f726974655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}span.svelte-uxr0i8 {flex:0 0 auto;height:auto;line-height:36px;}}.post-preview-reactions-button .svg-icon {width:22px;height:22px;}
            .post-history-thread-toggle-button.selected,
            .post-preview-reactions-button.selected
         {--btn-bg: var(--post-history-preview-footer-surface, var(--dialog-bg));color:var(--text-light);}

    @media (hover: hover) and (pointer: fine) {
                .post-history-thread-toggle-button.selected:hover:not(:disabled)
             {background-color:light-dark(
                color-mix(in srgb, var(--dialog-bg), black 20%),
                color-mix(in srgb, var(--dialog-bg), white 30%)
            );color:light-dark(
                color-mix(in srgb, var(--text), black 20%),
                color-mix(in srgb, var(--text), white 30%)
            );}
    }.post-preview-reactions-panel {display:flex;flex-wrap:wrap;gap:4px;padding:0 16px;}.post-preview-reaction-chip {display:inline-flex;align-items:center;gap:6px;min-height:32px;padding:4px 8px;border-radius:18px;background:color-mix(in srgb, var(--btn-bg), transparent 40%);color:var(--text);}.post-preview-reaction-summary {display:inline-flex;align-items:center;justify-content:center;gap:2px;row-gap:4px;flex-wrap:wrap;}.post-preview-reaction-content {font-size:20px;line-height:1;}.post-preview-reaction-count {font-size:1rem;line-height:1;}.post-preview-reaction-emoji-slot {display:inline-grid;margin:0;padding:0;}.post-preview-reaction-emoji,
    .post-preview-reaction-emoji-placeholder {width:100%;height:100%;}.post-preview-reaction-emoji {display:block;margin:0;padding:0;object-fit:contain;user-select:none;-webkit-user-drag:none;}.post-preview-reaction-emoji-placeholder {display:block;border-radius:4px;background:rgba(127, 127, 127, 0.18);}.post-preview-reaction-count {color:var(--text-muted);}.post-preview-reaction-actors {display:inline-flex;flex-wrap:wrap;gap:2px;align-items:center;}.post-preview-reaction-actor {display:inline-flex;align-items:center;justify-content:center;width:26px;height:26px;border-radius:999px;overflow:hidden;flex:0 0 auto;}.post-preview-reaction-avatar {width:100%;height:100%;}.post-preview-reaction-avatar-image {width:100%;height:100%;object-fit:cover;}.post-preview-reaction-avatar-fallback {width:100%;height:100%;}.post-preview-reaction-symbol {width:18px;height:18px;}.post-meta-inline.svelte-uxr0i8 {margin-inline-start:auto;display:flex;align-items:center;gap:6px;}.post-meta.svelte-uxr0i8 {display:flex;flex-wrap:wrap;justify-content:flex-end;gap:6px 10px;color:var(--text-muted);font-size:0.82rem;line-height:1.3;}.deleted-badge.svelte-uxr0i8 {padding:2px 6px;border-radius:999px;background:color-mix(in srgb, var(--danger), transparent 82%);color:var(--danger);font-weight:600;}.delete-failed.svelte-uxr0i8 {color:var(--danger);}.delete-confirm-body.svelte-uxr0i8 {display:flex;flex-direction:column;justify-content:center;gap:0.5rem;margin:10px 0 30px 0;margin-inline:auto;text-align:start;}.delete-confirm-description.svelte-uxr0i8,
    .delete-confirm-warning.svelte-uxr0i8 {line-height:1.5;margin:0;}.delete-confirm-warning.svelte-uxr0i8 {color:var(--text-light);font-size:0.875rem;}.copy-icon {mask-image:var(--ehagaki-icon-66696c655f636f70795f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.post-preview-reaction-symbol.svelte-uxr0i8 {mask-image:var(--ehagaki-icon-6661766f726974655f323464705f3030303030305f46494c4c315f776768743430305f47524144305f6f70737a32342e737667);background-color:rgb(249, 24, 128);width:20px;height:20px;}.search-icon.svelte-uxr0i8 {mask-image:var(--ehagaki-icon-7365617263685f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.repair-icon.svelte-uxr0i8 {mask-image:var(--ehagaki-icon-726566726573685f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.post-history-saved-boundary.svelte-uxr0i8,
    .post-history-sparse-state.svelte-uxr0i8 {display:grid;gap:8px;margin:16px 0;padding:12px;border:1px solid var(--border-hr);border-radius:10px;color:var(--text-muted);background:color-mix(in srgb, var(--bg-input) 72%, transparent);}.post-history-saved-boundary.svelte-uxr0i8 {padding:0;border:0;border-radius:0;background:transparent;}.post-history-saved-boundary.svelte-uxr0i8 p:where(.svelte-uxr0i8),
    .post-history-sparse-state.svelte-uxr0i8 p:where(.svelte-uxr0i8) {margin:0;}.post-history-saved-boundary-actions.svelte-uxr0i8 {display:flex;width:fit-content;max-width:100%;box-sizing:border-box;justify-self:center;flex-wrap:wrap;justify-content:center;align-items:flex-start;gap:8px;}.post-history-saved-boundary-actions .post-history-nav-button {height:52px;}

    @media (max-width: 600px) {.post-history-saved-boundary-actions.svelte-uxr0i8 {width:min(100%, 320px);flex-direction:column;align-items:center;}.post-history-saved-boundary-actions .post-history-nav-button {width:100%;flex:0 0 52px;}
    }.import-icon.svelte-uxr0i8 {mask-image:var(--ehagaki-icon-636c6f75645f646f776e6c6f61645f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.trash-icon {mask-image:var(--ehagaki-icon-64656c6574655f666f72657665725f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.xmark-icon.svelte-uxr0i8 {mask-image:var(--ehagaki-icon-636c6f73655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.jump-icon.svelte-uxr0i8 {mask-image:var(--ehagaki-icon-6b6579626f6172645f7461625f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}`
};
function pC(t, e) {
  Ot(e, !0), Ha(t, vC);
  const n = () => bs(Cf, "$locale", o), r = () => bs(qs, "$_", o), [o, s] = Us(), l = pu().overlayTarget, c = 18, u = 200;
  let b = _(e, "show", 15, !1), g = _(e, "onClose", 7), y = _(e, "onReplyPost", 7, void 0), x = _(e, "onQuotePost", 7, void 0), f = _(e, "pubkeyHex", 7, null), R = _(e, "rxNostr", 7, void 0), w = _(e, "relayConfig", 7, null), m = _(e, "latestPostedEvent", 7, null), i = _(e, "inboundInteractionSave", 7, null), O = _(e, "authoredSelfPostSave", 7, null), W = _(e, "reconcileInboundDirectReplyCandidates", 7, void 0), $ = _(e, "notifySavedAuthoredPosts", 7, void 0);
  const X = Rd({ getShow: () => b(), getRxNostr: () => R() }), me = _d({
    getShow: () => b(),
    getRxNostr: () => R(),
    getRelayConfig: () => w(),
    profileSyncCoordinator: X
  }), D = wm({
    getShow: () => b(),
    getPubkeyHex: () => f(),
    getRxNostr: () => R(),
    getRelayConfig: () => w(),
    getSessionScrollState: () => Ne.readCurrentSessionScrollState(),
    onSessionScrollStateInvalidated: () => Ne.clearAllSessionScrollAnchorsForCurrentPubkey(),
    onSavedAuthoredPosts: async (h) => {
      await $()?.(h);
    },
    onChildInteractionBadgeRefreshRequested: (h, B) => ae.loadCachedChildInteractionStateForPosts(h, B),
    onQuoteVisibleRangeRefreshRequested: (h) => ve.refreshQuotePreviews(h),
    quoteVisibleRangeRepairExecutor: async (h, B) => {
      const Ce = Re(B.visiblePosts);
      Ce.length !== 0 && await me.ensureTargets(Ce);
    },
    pageSize: ou
  }), ee = Gg({
    getShow: () => b(),
    getPosts: () => D.posts,
    getRxNostr: () => R(),
    getRelayConfig: () => w(),
    getIsSearchMode: () => D.isSearchMode
  }), ve = py({
    getShow: () => b(),
    getPosts: () => D.posts,
    getRxNostr: () => R(),
    getRelayConfig: () => w(),
    relatedTargetResolver: me,
    profileSyncCoordinator: X
  });
  function Re(h) {
    const B = Fs.buildIndex(h);
    return Object.values(B.contextsByEventId).map((Ce) => Fs.toDescriptor(Ce, "post-history-listing-quote-visible-range-repair"));
  }
  const ae = v0({
    getShow: () => b(),
    getPubkeyHex: () => f(),
    getRxNostr: () => R(),
    getRelayConfig: () => w(),
    relatedTargetResolver: me,
    profileSyncCoordinator: X
  });
  p0({
    getShow: () => b(),
    getPubkeyHex: () => f(),
    getRxNostr: () => R(),
    getRelayConfig: () => w(),
    getPosts: () => D.posts,
    onSavedInboundInteractions: (h) => ae.loadCachedChildInteractionStateForPosts(D.posts, h),
    reconcileDirectReplyCandidates: (h) => W()?.(h) ?? Promise.resolve({
      changedParentEventIds: [],
      savedDirectReplyCount: 0,
      unresolvedParentEventIds: h.map((B) => B.classification.parentEventId).filter((B) => !!B)
    })
  });
  const fe = Ef(), ne = Zg();
  function ke() {
    const h = /* @__PURE__ */ new Date(), B = `${h.getFullYear()}`, Ce = `${h.getMonth() + 1}`.padStart(2, "0"), Pe = `${h.getDate()}`.padStart(2, "0");
    return jl(`${B}-${Ce}-${Pe}`);
  }
  let He = ye(!1), xe = ye("none"), se = ye(!1), G = ye(lr(ke())), de = ye(lr(ke())), Se = ye(!1), $e = null, te = ye(!1), M = ye(!1), F = ye(!1), U = ye(lr({ phase: "loading" })), ce, pe, q = ye(!1), De = ye("postHistory.exportComplete"), nt = ye(lr({})), rt, ue = ye(!1), Fe = ye(null), Ue = ye(lr({})), re = ye(lr({})), Ge = ye(!1), kt = ye(0), vt = ye(0), xt = ye("postHistory.broadcastSent"), st, tn = ye(void 0), yt = ye(lr({})), Ze = ye(lr([])), ot = ye(-1), It = ye(!1), pt = ye(null), ut = ye(null), $n = ye(null), nn = ye(!1), An = ye(!1), vr = ye(null), Tr = ye(0), mt = !1, Ht = !1, mn = !1, bn = !1, Yt = null, Cn = null, On = 0, Yn = null, hn = null;
  const Xe = typeof IntersectionObserver < "u";
  let Gn = ye(null), bt = ye(!1);
  const St = Af({
    getShow: () => b(),
    getPosts: () => D.posts,
    getContainer: () => a(pt)
  }), Ne = _m({
    getShow: () => b(),
    getPubkeyHex: () => f(),
    getPosts: () => D.posts,
    getLocale: () => n(),
    getContainer: () => a(pt),
    getIsSearchMode: () => D.isSearchMode,
    getSearchQuery: () => D.state.searchQuery
  }), Dt = gf({
    getShow: () => b(),
    getEmojiUrls: () => a(Wr),
    onStateChanged: () => St.remeasure()
  });
  function Rr(h) {
    const B = cy(h);
    return fl({
      sourceContent: B,
      displayContent: B,
      tags: h.tags,
      media: h.media
    });
  }
  function pr(h) {
    return Dt.emojiLoadStateByUrl[h] === "ready";
  }
  function dr(h) {
    return Dt.emojiLoadStateByUrl[h] === "failed";
  }
  function Ln(h) {
    return Number.isInteger(h) ? `${h}` : h.toFixed(6).replace(/\.0+$/, "").replace(/(\.\d*?)0+$/, "$1");
  }
  function _r(h) {
    const B = Dt.emojiImageMetaByUrl[h]?.aspectRatio, Pe = typeof B == "number" && Number.isFinite(B) && B > 0 ? c * B : c;
    return [
      `width: ${Ln(Pe)}px;`,
      `height: ${c}px;`,
      "vertical-align: bottom;"
    ].join(" ");
  }
  let ua = I(() => {
    const h = {};
    for (const B of D.posts)
      h[B.eventId] = Rr(B);
    return h;
  }), fn = I(() => D.currentViewRefetchStatusMessageKey ?? D.syncStatusMessageKey), wn = I(() => D.currentViewRefetchStatusMessageKey ? D.currentViewRefetchStatusMessageValues : null), gr = I(() => D.syncStatus === "failed" || D.currentViewRefetchStatusMessageKey === "postHistory.repairPartialFailure" || D.currentViewRefetchStatusMessageKey === "postHistory.repairFetchFailed"), yr = I(() => D.canReturnToLatest || !Ne.isHistoryScrolledToTop), Er = I(() => D.canJumpToOldest || !Ne.isHistoryScrolledToBottom), zr = I(() => D.isSearchMode ? D.searchResultStatus === "loading" : D.initialLocalLoadStatus === "loading"), Zn = I(() => D.posts.length === 0 && (D.isSearchMode ? D.searchResultStatus === "ready" : D.initialLocalLoadStatus === "ready"));
  function Qr(h, B) {
    B[h.id] || (B[h.id] = fl({ sourceContent: h.content, tags: h.tags }));
  }
  function ha(h, B, Ce) {
    if (!(!h || Ce.has(h.node.eventId))) {
      Ce.add(h.node.eventId), Qr(h.node.event, B), ha(h.parentNodeState, B, Ce);
      for (const Pe of h.replyNodeStates)
        ha(Pe, B, Ce);
    }
  }
  let Ar = I(() => {
    const h = {};
    for (const B of D.posts) {
      const Ce = /* @__PURE__ */ new Set();
      for (const Qe of Xn(B))
        Qe.status === "resolved" && Qr(Qe.event, h);
      const Pe = ae.getAnchorState(B);
      Pe.parentNode && Qr(Pe.parentNode.event, h), ha(Pe.parentNodeState, h, Ce);
      for (const Qe of Pe.replyNodeStates)
        ha(Qe, h, Ce);
    }
    return h;
  }), Wr = I(() => {
    const h = /* @__PURE__ */ new Set();
    for (const B of [
      ...Object.values(a(ua)),
      ...Object.values(a(Ar))
    ])
      for (const Ce of B.previewContent.emojiUrls)
        h.add(Ce);
    for (const B of D.posts) {
      const Ce = ae.getAnchorState(B);
      if (a(yt)[B.eventId])
        for (const Pe of Ce.reactionReadModel.groups)
          Pe.emojiUrl && h.add(Pe.emojiUrl);
    }
    return [...h];
  });
  function $a() {
    X.reset(), ne.resetState(), it(), P(), fe.resetDeleteConfirmation(), p(M, !1), p(ue, !1), p(Fe, null), p(He, !1), p(xe, "none"), p(se, !1), p(G, ke(), !0), p(de, ke(), !0), p(Se, !1), p(te, !1), p(Ue, {}, !0), p(re, {}, !0), qd(), p(yt, {}, !0), Dt.resetState(), p(Ze, [], !0), p(ot, -1), p(It, !1);
  }
  function Mr() {
    ce?.abort();
  }
  function fa() {
    const h = D.isSearchMode;
    h && Ne.clearCurrentSessionScrollAnchor(), D.resetSearchState(), D.prepareForClose() ? Ne.clearAllSessionScrollAnchorsForCurrentPubkey() : h || Ne.saveCurrentSessionScrollAnchor(), ee.cancelCurrentChannelResolution(), ae.cancelCurrentGraphFetches(), fe.resetDeleteConfirmation(), p(M, !1), p(ue, !1), p(Fe, null), p(He, !1), p(te, !1), ne.hideCopyFloatingMessage(), it(), P(), Mr(), p(It, !1), p(Ze, [], !0), p(ot, -1), b(!1), g()?.();
  }
  function Is(h) {
    return h instanceof Element && h.closest(".ehagaki-pswp") !== null;
  }
  function va(h) {
    Is(h.target) && h.preventDefault();
  }
  function Ia(h) {
    a(It) && h.preventDefault();
  }
  yf(() => b(), fa, !0), Ke(() => {
    b() || (Mr(), $a());
  }), Ke(() => {
    a(F) && pe && f() !== pe && Mr();
  }), Ke(() => {
    if (!b() || !a(zr)) {
      p(bt, !1);
      return;
    }
    p(bt, !1);
    const h = setTimeout(
      () => {
        b() && a(zr) && p(bt, !0);
      },
      u
    );
    return () => {
      clearTimeout(h);
    };
  }), Ke(() => {
    const h = a(pt);
    if (!h) {
      Yt = null, Cn = null, p(vr, null);
      return;
    }
    const B = () => {
      const Pe = Math.max(0, h.clientHeight);
      if (Yt !== h) {
        Yt = h, Cn = Pe, p(vr, Pe, !0);
        return;
      }
      Cn !== Pe && (Cn = Pe, p(vr, Pe, !0), On += 1, p(Tr, On, !0));
    };
    if (B(), typeof ResizeObserver > "u")
      return;
    const Ce = new ResizeObserver(B);
    return Ce.observe(h), () => {
      Ce.disconnect(), Yt === h && (Yt = null, Cn = null, p(vr, null));
    };
  }), Ke(() => {
    const h = a(ut), B = a(pt), Ce = a(vr), Pe = a(Tr);
    if (!(b() && !!h && !!B && Ce !== null && Ce > 0 && !D.isSearchMode && D.state.listingMode === "contiguous" && D.state.hasOlderLocal && !D.isRefetchingAroundCurrentView) || !Xe) {
      mt = !1, mn = !1, Yn = null;
      return;
    }
    const an = Yn?.root === B && Yn.sentinel === h && Yn.resizeGeneration !== Pe && B.scrollTop <= Yn.scrollTop;
    Yn = { root: B, sentinel: h, resizeGeneration: Pe, scrollTop: B.scrollTop };
    let vn = !1;
    const _t = new IntersectionObserver(
      (zn) => {
        const br = zn.some((Jr) => Jr.isIntersecting), $r = !vn;
        if (vn = !0, mn = br, !br) {
          mt && !a(nn) && (mt = !1);
          return;
        }
        $r && an || Ba();
      },
      {
        root: B,
        rootMargin: `0px 0px ${Ce * 2}px 0px`,
        threshold: 0
      }
    );
    return _t.observe(h), () => {
      _t.disconnect();
    };
  }), Ke(() => {
    const h = a($n), B = a(pt), Ce = a(vr), Pe = a(Tr);
    if (!(b() && !!h && !!B && Ce !== null && Ce > 0 && !D.isSearchMode && D.state.listingMode === "contiguous" && D.state.hasNewerLocal && !a(se) && !D.isRefetchingAroundCurrentView) || !Xe) {
      Ht = !1, bn = !1, hn = null;
      return;
    }
    const an = hn?.root === B && hn.sentinel === h && hn.resizeGeneration !== Pe && B.scrollTop >= hn.scrollTop;
    hn = { root: B, sentinel: h, resizeGeneration: Pe, scrollTop: B.scrollTop };
    let vn = !1;
    const _t = new IntersectionObserver(
      (zn) => {
        const br = zn.some((Jr) => Jr.isIntersecting), $r = !vn;
        if (vn = !0, bn = br, !br) {
          Ht && !a(An) && (Ht = !1);
          return;
        }
        $r && an || Ss();
      },
      {
        root: B,
        rootMargin: `${Ce * 2}px 0px 0px 0px`,
        threshold: 0
      }
    );
    return _t.observe(h), () => {
      _t.disconnect();
    };
  }), ao(() => {
    Mr(), qd(), X.dispose(), P();
  }), Ke(() => {
    if (!b() || !m()?.id)
      return;
    const h = m().id;
    $e !== h && (D.posts, ae.recordPostedReply(m(), D.posts).then((B) => {
      B && ($e = h);
    }).catch(() => {
    }));
  }), Ke(() => {
    const h = D.posts;
    !b() || h.length === 0 || (mf(h.map((B) => B.eventId)).catch(() => {
    }), ca(() => ae.loadCachedChildInteractionStateForPosts(h)));
  }), Ke(() => {
    const h = i()?.revision ?? 0, B = i()?.parentEventIds ?? [], Ce = D.posts;
    !b() || h <= 0 || B.length === 0 || (ca(() => ae.loadCachedChildInteractionStateForPosts(Ce, B)), Ol({
      source: "dialog-inbound-save",
      parentEventIds: B,
      rxNostr: R(),
      relayConfig: w(),
      isActive: () => b()
    }).then((Pe) => {
      if (!(!b() || Pe.deletedReactionEventIds.length === 0 && Pe.deletedReplyEventIds.length === 0))
        return ae.loadCachedChildInteractionStateForPosts(D.posts, Pe.checkedParentEventIds);
    }).catch(() => {
    }));
  }), Ke(() => {
    const h = O()?.revision ?? 0;
    !b() || h <= 0 || D.isSearchMode || D.canReturnToLatest || ca(() => D.returnToLatest());
  }), Ke(() => {
    if (b())
      return () => {
        ee.cancelCurrentChannelResolution();
      };
  });
  function ta(h) {
    return h ? h.values ? r()(h.key, { values: h.values }) : r()(h.key) : null;
  }
  function pa() {
    return ta(g0({
      totalCount: D.displayTotalCount,
      totalCountKnown: D.state.totalCountKnown,
      totalCountStatus: D.state.totalCountStatus,
      isSearchMode: D.isSearchMode
    }));
  }
  function is(h) {
    if (!h)
      return null;
    const B = Number(h.year), Ce = Number(h.month), Pe = Number(h.day), an = new Date(B, Ce - 1, Pe, 23, 59, 59, 999).getTime();
    return Number.isFinite(an) ? Math.floor(an / 1e3) : null;
  }
  function Sa() {
    return r()(Nc({ direction: "older", isSearchMode: D.isSearchMode }));
  }
  function Na() {
    return r()(Nc({ direction: "newer", isSearchMode: D.isSearchMode }));
  }
  async function ga() {
    const h = D.isSearchMode, B = h ? Ne.captureHistoryScrollAnchor() : null;
    await D.loadOlder() && h && Ne.restoreHistoryScrollAnchor(B);
  }
  function Pn() {
    return b() && !D.isSearchMode && D.state.listingMode === "contiguous" && D.state.hasOlderLocal && !D.isRefetchingAroundCurrentView;
  }
  async function Ba() {
    if (a(nn) || mt || !Pn())
      return;
    const h = Ne.captureHistoryScrollAnchor();
    p(nn, !0), mt = !0;
    try {
      await D.loadOlder() && b() && (await da(), await St.flushPendingMeasurements(), Ne.restoreHistoryScrollAnchor(h));
    } finally {
      p(nn, !1), mn || (mt = !1);
    }
  }
  function Or() {
    return b() && !D.isSearchMode && D.state.listingMode === "contiguous" && D.state.hasNewerLocal && !a(se) && !D.isRefetchingAroundCurrentView;
  }
  async function Ss() {
    if (a(An) || Ht || !Or())
      return;
    const h = Ne.captureHistoryScrollAnchor();
    p(An, !0), Ht = !0;
    let B = !1;
    try {
      B = await D.loadNewer(), B && b() && (await da(), await St.flushPendingMeasurements());
    } finally {
      p(An, !1), B && b() && (await da(), Ne.restoreHistoryScrollAnchor(h)), bn || (Ht = !1);
    }
  }
  async function Ua() {
    await D.showSavedOlderPosts() && Ne.resetHistoryScrollSoon();
  }
  async function qa() {
    const h = Ne.captureHistoryScrollAnchor(), B = a(pt)?.scrollTop ?? null;
    D.state.loadedPosts.length, a(pt)?.scrollHeight, a(pt)?.clientHeight;
    const Ce = await D.fetchOlderFromRelays({ anchorEventId: h?.eventId });
    let Pe = !1;
    Ce && B !== null && b() && a(pt) && (Pe = Ne.restoreHistoryScrollAnchor(h), Pe || (a(pt).scrollTop = B)), D.latestOlderBackfillUiResult, a(pt)?.scrollTop, a(pt)?.scrollHeight;
  }
  async function ya() {
    const h = D.isSearchMode ? null : Ne.captureHistoryScrollAnchor();
    await D.loadNewer() && (D.isSearchMode ? Ne.resetHistoryScrollSoon() : Ne.restoreHistoryScrollAnchor(h));
  }
  async function ma() {
    Ne.clearAllSessionScrollAnchorsForCurrentPubkey();
    const h = D.canReturnToLatest ? await D.returnToLatest() : !1;
    p(se, !1), (h || !Ne.isHistoryScrolledToTop) && Ne.resetHistoryScrollSoon();
  }
  async function Ra() {
    const h = is(a(G));
    if (h === null)
      return;
    Ne.clearAllSessionScrollAnchorsForCurrentPubkey(), p(se, !0);
    const B = await D.jumpToCreatedAt(h);
    B || p(se, !1), B && (p(xe, "none"), p(Se, !1), Ne.resetHistoryScrollSoon());
  }
  function Va(h) {
    return a(ua)[h.eventId] ?? Rr(h);
  }
  function Rs(h) {
    return Va(h).hasRenderableText;
  }
  function Xn(h) {
    return ve.getQuotePreviews(h);
  }
  function Lr(h) {
    return a(Ue)[h.eventId] === "sending";
  }
  function d(h) {
    return a(Ue)[h.eventId] === "failed";
  }
  function C(h) {
    return a(re)[h.eventId] === "sending";
  }
  function H(h) {
    return Mf(h) !== null;
  }
  function N(h) {
    const B = ae.getAnchorState(h).repliesActionState;
    return ta(y0(B)) ?? "";
  }
  function V(h) {
    return !!a(yt)[h.eventId];
  }
  function Q(h) {
    const B = ae.getAnchorState(h).reactionSummary.totalCount;
    return ta(m0({ visible: V(h), reactionCount: B })) ?? "";
  }
  function le(h) {
    return ae.getAnchorState(h).reactionReadModel.groups;
  }
  function Te(h) {
    return Ym(h);
  }
  function oe(h) {
    p(
      yt,
      {
        ...a(yt),
        [h.eventId]: !a(yt)[h.eventId]
      },
      !0
    );
  }
  function we(h) {
    const B = ae.getAnchorState(h).repliesActionState;
    if (B.status === "failed" || B.status === "loaded" && B.replyCount === 0) {
      ae.retryChildren(h);
      return;
    }
    ae.toggleChildren(h);
  }
  function _e(h) {
    return zd(h, f());
  }
  function Me(h) {
    _e(h) && fe.openDeleteConfirm(h);
  }
  async function Oe(h, B) {
    if (C(h))
      return;
    const Ce = Tt(h, B);
    p(re, { ...a(re), [h.eventId]: "sending" }, !0);
    const Pe = await Of.broadcast({ post: h, rxNostr: R() });
    p(re, { ...a(re), [h.eventId]: void 0 }, !0), Be(Ce, Pe);
  }
  function it() {
    st && (clearTimeout(st), st = void 0), p(Ge, !1), p(tn, void 0);
  }
  function lt(h, B) {
    p(
      tn,
      {
        eventId: h.eventId,
        ...ai(B.clientX, B.clientY)
      },
      !0
    );
  }
  function Tt(h, B) {
    if (a(tn)?.eventId === h.eventId)
      return {
        x: a(tn).x,
        y: a(tn).y
      };
    const Ce = B.currentTarget, Pe = Ce instanceof HTMLElement ? Ce.getBoundingClientRect() : null;
    return ai(Pe ? Pe.left + Pe.width / 2 : 0, Pe ? Pe.bottom + 8 : 0);
  }
  function Be(h, B) {
    st && clearTimeout(st), p(kt, h.x, !0), p(vt, h.y, !0), p(
      xt,
      B.success ? (B.rejectedRelays?.length ?? 0) > 0 || (B.timedOutRelays?.length ?? 0) > 0 ? "postHistory.broadcastPartial" : "postHistory.broadcastSent" : "postHistory.broadcastFailed",
      !0
    ), p(Ge, !0), st = setTimeout(
      () => {
        p(Ge, !1), st = void 0;
      },
      1800
    );
  }
  function Ye(h) {
    const B = Date.now(), Ce = h.node.event.created_at * 1e3;
    return {
      id: h.node.eventId,
      eventId: h.node.eventId,
      pubkeyHex: h.node.authorPubkey,
      kind: h.node.event.kind,
      content: h.node.event.content,
      tags: h.node.event.tags.map((Pe) => [...Pe]),
      createdAt: Ce,
      postedAt: Ce,
      relayHints: [...h.node.relayUrls],
      acceptedRelays: [...h.node.relayUrls],
      fetchedRelays: [...h.node.relayUrls],
      media: [],
      rawEvent: h.node.event,
      updatedAt: B,
      schemaVersion: 1
    };
  }
  function qt(h) {
    const B = Date.now(), Ce = h.created_at * 1e3;
    return {
      id: h.id,
      eventId: h.id,
      pubkeyHex: h.pubkey,
      kind: h.kind,
      content: h.content,
      tags: h.tags.map((Pe) => [...Pe]),
      createdAt: Ce,
      postedAt: Ce,
      relayHints: [],
      acceptedRelays: [],
      fetchedRelays: [],
      media: [],
      rawEvent: h,
      updatedAt: B,
      schemaVersion: 1
    };
  }
  function rn(h, B) {
    return `quote-preview:${h}:${B}`;
  }
  function er(h, B) {
    B && fe.closeAllPostItemMenus(), fe.setPostMenuOpen(h, B);
  }
  function mr(h) {
    p(Fe, h, !0), p(ue, !0);
  }
  function Ie(h) {
    mr(h.node.event);
  }
  function je(h) {
    return ne.copyState[h] === "failed";
  }
  function zt(h) {
    return a(re)[h] === "sending";
  }
  function xn(h, B) {
    ne.captureCopyPointerPosition(Ye(h), B);
  }
  function Rt(h, B) {
    ne.handleCopyNevent(Ye(h), B);
  }
  function na(h) {
    ba(Ye(h));
  }
  function ls() {
    return {
      client: Vd.externalNostrClient,
      customUrlTemplate: Vd.externalNostrClientCustomUrl
    };
  }
  function ja() {
    const h = wf(ls());
    return h ? r()("postHistory.openInExternalClient", { values: { client: h } }) : r()("postHistory.openInExternalClientFallback");
  }
  function ba(h) {
    const B = Pf(h, ls(), nu.value);
    B && window.open(B, "_blank", "noopener,noreferrer");
  }
  function _s(h, B) {
    lt(Ye(h), B);
  }
  function Ka(h, B) {
    Oe(Ye(h), B);
  }
  function Ya(h) {
    return zd(Ye(h), f());
  }
  function js(h) {
    return a(Ue)[h] === "sending";
  }
  function Es(h) {
    const B = Ye(h);
    _e(B) && fe.openDeleteConfirm(B);
  }
  async function io(h) {
    y() && await y()(h) !== !1 && fa();
  }
  function As(h) {
    x() && (x()(h), fa());
  }
  function ks() {
    fe.cancelDeleteConfirm();
  }
  async function lo() {
    await da(), a(xe) === "search" && a(Gn)?.focus({ preventScroll: !0 });
  }
  function Ks() {
    if (a(xe) === "search") {
      Ys(), p(te, !1);
      return;
    }
    p(xe, "search"), p(te, !1), lo();
  }
  function Ys() {
    Ne.clearCurrentSessionScrollAnchor(), p(xe, "none"), D.resetSearchState();
  }
  async function ds(h) {
    if (p(se, !0), !await D.jumpToEventId(h.eventId)) {
      p(se, !1);
      return;
    }
    Ne.clearAllSessionScrollAnchorsForCurrentPubkey(), p(xe, "none"), D.resetSearchState(), Ne.scrollHistoryEventToTopSoon(h.eventId);
  }
  function cs() {
    const h = a(xe) !== "jump-date";
    p(xe, h ? "jump-date" : "none", !0), h || p(Se, !1), p(te, !1);
  }
  function co() {
    p(xe, "none"), p(Se, !1);
  }
  function Ds(h) {
    const B = a(de) ?? a(G);
    !B || h === 0 || p(de, B.add({ years: h }), !0);
  }
  function za() {
    p(He, !0), p(te, !1);
  }
  function v() {
    p(M, !0), p(te, !1);
  }
  function P() {
    rt && (clearTimeout(rt), rt = void 0), p(q, !1);
  }
  function k() {
    const h = /* @__PURE__ */ new Date();
    return [
      String(h.getFullYear()).padStart(4, "0"),
      String(h.getMonth() + 1).padStart(2, "0"),
      String(h.getDate()).padStart(2, "0")
    ].join("-");
  }
  function K(h) {
    P(), p(
      De,
      h.isPartial ? "postHistory.exportPartial" : "postHistory.exportComplete",
      !0
    ), p(
      nt,
      {
        exported: h.exportedEventCount,
        skipped: h.skippedPostCount + h.missingDeletionRawEventCount + h.invalidDeletionRawEventCount
      },
      !0
    ), p(q, !0), rt = setTimeout(
      () => {
        p(q, !1), rt = void 0;
      },
      5e3
    );
  }
  async function z() {
    if (!f() || a(F))
      return;
    p(F, !0), p(U, { phase: "loading" }, !0);
    const h = new AbortController();
    ce = h, pe = f(), p(te, !1), P();
    try {
      const { result: B, blob: Ce } = await O0.exportForPubkeyInWorker(f(), {
        signal: h.signal,
        onProgress: (an) => {
          p(U, an, !0);
        }
      });
      if (h.signal.aborted)
        return;
      const Pe = URL.createObjectURL(Ce), Qe = document.createElement("a");
      Qe.href = Pe, Qe.download = `ehagaki-post-history-${k()}.jsonl`, Qe.style.display = "none", l.appendChild(Qe), Qe.click(), setTimeout(
        () => {
          Qe.remove(), URL.revokeObjectURL?.(Pe);
        },
        1e3
      ), K(B);
    } catch (B) {
      if (h.signal.aborted || B instanceof DOMException && B.name === "AbortError")
        return;
      p(De, "postHistory.exportFailed"), p(nt, {}, !0), p(q, !0), rt = setTimeout(
        () => {
          p(q, !1), rt = void 0;
        },
        5e3
      );
    } finally {
      ce === h && (ce = void 0, pe = void 0, p(F, !1));
    }
  }
  async function ie() {
    const h = Ne.captureHistoryScrollAnchor(), B = a(pt)?.scrollTop ?? null;
    await D.refreshAfterLocalImport(), !D.isSearchMode && a(pt) && !Ne.restoreHistoryScrollAnchor(h) && B !== null && (a(pt).scrollTop = B);
  }
  function he() {
    p(te, !1), D.refetchAroundCurrentView();
  }
  function qe() {
    Ne.clearAllSessionScrollAnchorsForCurrentPubkey(), p(te, !1), D.jumpToOldest().then((h) => {
      (h || !Ne.isHistoryScrolledToBottom) && Ne.resetHistoryScrollToBottomSoon();
    });
  }
  function Ve() {
    p(te, !1), ma();
  }
  function et() {
    p(He, !1);
  }
  function $t(h) {
    p(Ze, h.mediaList, !0), p(ot, h.index, !0), p(It, h.mediaList.length > 0 && h.index >= 0, !0);
  }
  function Nn(h) {
    p(ot, h, !0);
  }
  function cr() {
    p(It, !1), p(Ze, [], !0), p(ot, -1);
  }
  async function Ct() {
    const h = fe.deleteTargetPost;
    if (!h)
      return;
    p(
      Ue,
      {
        ...a(Ue),
        [h.eventId]: "sending"
      },
      !0
    );
    const B = await Df.requestDeletion({ post: h, rxNostr: R() });
    B.success && typeof B.deletedAt == "number" && B.deletionEventId ? (D.patchDeletedPost(h.eventId, B.deletedAt, B.deletionEventId), ae.recordDeletedEvent({
      eventId: h.eventId,
      authorPubkey: h.pubkeyHex,
      deletionEvent: B.deletionEvent ?? null,
      deletionEventAttestation: B.deletionEventAttestation
    }).catch(() => {
    }), p(
      Ue,
      {
        ...a(Ue),
        [h.eventId]: void 0
      },
      !0
    )) : p(Ue, { ...a(Ue), [h.eventId]: "failed" }, !0), fe.clearDeleteTarget();
  }
  async function ln() {
    await D.deleteLocalHistory() && (Ne.clearAllSessionScrollAnchorsForCurrentPubkey(), p(He, !1), p(xe, "none"), Ne.resetHistoryScrollSoon());
  }
  var Ca = {
    get show() {
      return b();
    },
    set show(h = !1) {
      b(h), S();
    },
    get onClose() {
      return g();
    },
    set onClose(h) {
      g(h), S();
    },
    get onReplyPost() {
      return y();
    },
    set onReplyPost(h = void 0) {
      y(h), S();
    },
    get onQuotePost() {
      return x();
    },
    set onQuotePost(h = void 0) {
      x(h), S();
    },
    get pubkeyHex() {
      return f();
    },
    set pubkeyHex(h = null) {
      f(h), S();
    },
    get rxNostr() {
      return R();
    },
    set rxNostr(h = void 0) {
      R(h), S();
    },
    get relayConfig() {
      return w();
    },
    set relayConfig(h = null) {
      w(h), S();
    },
    get latestPostedEvent() {
      return m();
    },
    set latestPostedEvent(h = null) {
      m(h), S();
    },
    get inboundInteractionSave() {
      return i();
    },
    set inboundInteractionSave(h = null) {
      i(h), S();
    },
    get authoredSelfPostSave() {
      return O();
    },
    set authoredSelfPostSave(h = null) {
      O(h), S();
    },
    get reconcileInboundDirectReplyCandidates() {
      return W();
    },
    set reconcileInboundDirectReplyCandidates(h = void 0) {
      W(h), S();
    },
    get notifySavedAuthoredPosts() {
      return $();
    },
    set notifySavedAuthoredPosts(h = void 0) {
      $(h), S();
    }
  }, ra = fC(), Qa = Z(ra);
  {
    const h = (Pe) => {
      var Qe = Ae(), an = Z(Qe);
      {
        const vn = (_t, zn) => {
          let br = () => zn?.().props;
          {
            let $r = I(() => r()("global.close"));
            ir(_t, no(br, {
              className: "modal-close",
              shape: "square",
              get ariaLabel() {
                return a($r);
              },
              children: (Jr, uo) => {
                var Ea = L0();
                ge((aa) => Tn(Ea, "aria-label", aa), [() => r()("global.close")]), E(Jr, Ea);
              },
              $$slots: { default: !0 }
            }));
          }
        };
        Le(an, () => yu, (_t, zn) => {
          zn(_t, { child: vn, $$slots: { child: !0 } });
        });
      }
      E(Pe, Qe);
    };
    let B = I(() => r()("postHistory.title")), Ce = I(() => r()("postHistory.description"));
    gu(Qa, {
      onOpenChange: (Pe) => !Pe && fa(),
      onInteractOutside: va,
      onEscapeKeydown: Ia,
      trapFocus: !1,
      get title() {
        return a(B);
      },
      get description() {
        return a(Ce);
      },
      contentClass: "post-history-dialog",
      footerVariant: "close-button",
      showPagination: !1,
      initialFocus: "content",
      get open() {
        return b();
      },
      set open(Pe) {
        b(Pe);
      },
      footer: h,
      children: (Pe, Qe) => {
        var an = iC(), vn = Z(an), _t = T(vn), zn = T(_t);
        {
          var br = (We) => {
            var ht = F0(), Et = T(ht), tr = T(Et, !0);
            A(Et), A(ht), ge(() => J(tr, Ne.currentMonthLabel)), ni("click", Et, cs), E(We, ht);
          };
          be(zn, (We) => {
            Ne.currentMonthLabel && We(br);
          });
        }
        A(_t);
        var $r = L(_t, 2), Jr = T($r);
        {
          var uo = (We) => {
            {
              let ht = I(() => a(U).phase === "loading" ? r()("postHistory.exportLoading") : a(U).phase === "verifying" ? r()("postHistory.exportVerifying", {
                values: {
                  processed: a(U).processed ?? 0,
                  total: a(U).total ?? 0
                }
              }) : r()("postHistory.exportCreating"));
              Ls(We, {
                get text() {
                  return a(ht);
                },
                showLoader: !0,
                loaderSize: 30,
                state: "loading",
                customClass: "status-loading-placeholder"
              });
            }
          }, Ea = (We) => {
            {
              let ht = I(() => a(wn) ? r()(a(fn), { values: a(wn) }) : r()(a(fn))), Et = I(() => D.showStatusLoader ? "loading" : "complete"), tr = I(() => `status-loading-placeholder${a(gr) ? " status-error" : ""}`);
              Ls(We, {
                get text() {
                  return a(ht);
                },
                get showLoader() {
                  return D.showStatusLoader;
                },
                loaderSize: 30,
                get state() {
                  return a(Et);
                },
                get customClass() {
                  return a(tr);
                }
              });
            }
          };
          be(Jr, (We) => {
            a(F) ? We(uo) : a(fn) && We(Ea, 1);
          });
        }
        var aa = L(Jr, 2);
        {
          var _i = (We) => {
            var ht = H0(), Et = T(ht), tr = T(Et), nr = T(tr, !0);
            A(tr), A(Et), A(ht), ge((sa) => J(nr, sa), [() => pa()]), E(We, ht);
          }, ho = I(() => pa());
          be(aa, (We) => {
            a(ho) && We(_i);
          });
        }
        var Ja = L(aa, 2);
        Le(Ja, () => Yd, (We, ht) => {
          ht(We, {
            get open() {
              return a(te);
            },
            set open(Et) {
              p(te, Et, !0);
            },
            children: (Et, tr) => {
              var nr = Q0(), sa = Z(nr);
              {
                let Aa = I(() => `menu-trigger post-history-menu-trigger post-history-heading-menu-trigger ${a(te) ? "is-open" : ""}`.trim()), Bn = I(() => r()("postHistory.openMenu"));
                Le(sa, () => jd, (Br, In) => {
                  In(Br, {
                    get class() {
                      return a(Aa);
                    },
                    get "aria-label"() {
                      return a(Bn);
                    },
                    children: (rr, Gr) => {
                      var fs = $0();
                      E(rr, fs);
                    },
                    $$slots: { default: !0 }
                  });
                });
              }
              var oa = L(sa, 2);
              Le(oa, () => Xo, (Aa, Bn) => {
                Bn(Aa, {
                  get to() {
                    return l;
                  },
                  children: (Br, In) => {
                    var rr = Ae(), Gr = Z(rr);
                    Le(Gr, () => Kd, (fs, Ws) => {
                      Ws(fs, {
                        side: "bottom",
                        align: "end",
                        sideOffset: 8,
                        class: "post-history-menu-content",
                        trapFocus: !1,
                        preventScroll: !1,
                        onCloseAutoFocus: (vs) => vs.preventDefault(),
                        children: (vs, ft) => {
                          var Y = z0(), tt = T(Y);
                          Le(tt, () => Jn, (wt, Nt) => {
                            Nt(wt, {
                              class: "menu-action-button",
                              onSelect: Ks,
                              children: (gn, kn) => {
                                var ar = N0(), Qt = L(Z(ar), 2), dn = T(Qt, !0);
                                A(Qt), ge((Un) => J(dn, Un), [() => r()("postHistory.showSearch")]), E(gn, ar);
                              },
                              $$slots: { default: !0 }
                            });
                          });
                          var gt = L(tt, 2);
                          {
                            let wt = I(() => !D.canRefetchAroundCurrentView);
                            Le(gt, () => Jn, (Nt, gn) => {
                              gn(Nt, {
                                class: "menu-action-button",
                                get disabled() {
                                  return a(wt);
                                },
                                onSelect: he,
                                children: (kn, ar) => {
                                  var Qt = B0(), dn = L(Z(Qt), 2), Un = T(dn, !0);
                                  A(dn), ge((Zr) => J(Un, Zr), [() => r()("postHistory.repair")]), E(kn, Qt);
                                },
                                $$slots: { default: !0 }
                              });
                            });
                          }
                          var dt = L(gt, 2);
                          Le(dt, () => ts, (wt, Nt) => {
                            Nt(wt, { class: "post-history-menu-separator" });
                          });
                          var Qn = L(dt, 2);
                          {
                            let wt = I(() => !a(yr));
                            Le(Qn, () => Jn, (Nt, gn) => {
                              gn(Nt, {
                                class: "menu-action-button",
                                get disabled() {
                                  return a(wt);
                                },
                                onSelect: Ve,
                                children: (kn, ar) => {
                                  var Qt = U0(), dn = L(Z(Qt), 2), Un = T(dn, !0);
                                  A(dn), ge((Zr) => J(Un, Zr), [() => r()("postHistory.returnToLatest")]), E(kn, Qt);
                                },
                                $$slots: { default: !0 }
                              });
                            });
                          }
                          var Pt = L(Qn, 2);
                          Le(Pt, () => Jn, (wt, Nt) => {
                            Nt(wt, {
                              class: "menu-action-button",
                              onSelect: cs,
                              children: (gn, kn) => {
                                var ar = q0(), Qt = L(Z(ar), 2), dn = T(Qt, !0);
                                A(Qt), ge((Un) => J(dn, Un), [() => r()("postHistory.jumpToDate")]), E(gn, ar);
                              },
                              $$slots: { default: !0 }
                            });
                          });
                          var Sn = L(Pt, 2);
                          {
                            let wt = I(() => !a(Er));
                            Le(Sn, () => Jn, (Nt, gn) => {
                              gn(Nt, {
                                class: "menu-action-button",
                                get disabled() {
                                  return a(wt);
                                },
                                onSelect: qe,
                                children: (kn, ar) => {
                                  var Qt = V0(), dn = L(Z(Qt), 2), Un = T(dn, !0);
                                  A(dn), ge((Zr) => J(Un, Zr), [() => r()("postHistory.jumpToOldest")]), E(kn, Qt);
                                },
                                $$slots: { default: !0 }
                              });
                            });
                          }
                          var pn = L(Sn, 2);
                          Le(pn, () => ts, (wt, Nt) => {
                            Nt(wt, { class: "post-history-menu-separator" });
                          });
                          var Cr = L(pn, 2);
                          {
                            let wt = I(() => !f() || a(F));
                            Le(Cr, () => Jn, (Nt, gn) => {
                              gn(Nt, {
                                class: "menu-action-button",
                                get disabled() {
                                  return a(wt);
                                },
                                onSelect: z,
                                children: (kn, ar) => {
                                  var Qt = j0(), dn = L(Z(Qt), 2), Un = T(dn, !0);
                                  A(dn), ge((Zr) => J(Un, Zr), [() => r()("postHistory.export")]), E(kn, Qt);
                                },
                                $$slots: { default: !0 }
                              });
                            });
                          }
                          var ur = L(Cr, 2);
                          {
                            let wt = I(() => !f());
                            Le(ur, () => Jn, (Nt, gn) => {
                              gn(Nt, {
                                class: "menu-action-button",
                                get disabled() {
                                  return a(wt);
                                },
                                onSelect: v,
                                children: (kn, ar) => {
                                  var Qt = K0(), dn = L(Z(Qt), 2), Un = T(dn, !0);
                                  A(dn), ge((Zr) => J(Un, Zr), [() => r()("postHistory.import")]), E(kn, Qt);
                                },
                                $$slots: { default: !0 }
                              });
                            });
                          }
                          var Ur = L(ur, 2);
                          Le(Ur, () => ts, (wt, Nt) => {
                            Nt(wt, { class: "post-history-menu-separator" });
                          });
                          var Wn = L(Ur, 2);
                          Le(Wn, () => Jn, (wt, Nt) => {
                            Nt(wt, {
                              class: "menu-action-button menu-action-button-danger",
                              onSelect: za,
                              children: (gn, kn) => {
                                var ar = Y0(), Qt = L(Z(ar), 2), dn = T(Qt, !0);
                                A(Qt), ge((Un) => J(dn, Un), [() => r()("postHistory.deleteLocalHistory")]), E(gn, ar);
                              },
                              $$slots: { default: !0 }
                            });
                          }), A(Y), E(vs, Y);
                        },
                        $$slots: { default: !0 }
                      });
                    }), E(Br, rr);
                  },
                  $$slots: { default: !0 }
                });
              }), E(Et, nr);
            },
            $$slots: { default: !0 }
          });
        }), A($r), A(vn);
        var Qs = L(vn, 2);
        {
          var qo = (We) => {
            var ht = G0(), Et = T(ht);
            let tr;
            var nr = T(Et), sa = T(nr);
            {
              var oa = (In) => {
                Ls(In, {
                  variant: "spinner",
                  showLoader: !0,
                  loaderSize: 24,
                  ariaHidden: !0,
                  customClass: "post-history-search-spinner"
                });
              }, Aa = (In) => {
                var rr = W0();
                E(In, rr);
              };
              be(sa, (In) => {
                D.isSearchPageLoading ? In(oa) : In(Aa, -1);
              });
            }
            A(nr);
            var Bn = L(nr, 2);
            xf(Bn), Ro(Bn, (In) => p(Gn, In), () => a(Gn)), A(Et);
            var Br = L(Et, 2);
            {
              let In = I(() => r()("postHistory.hideSearch"));
              ir(Br, {
                type: "button",
                class: "post-history-search-close",
                contentLayout: "icon",
                shape: "square",
                get ariaLabel() {
                  return a(In);
                },
                onClick: Ys,
                children: (rr, Gr) => {
                  var fs = J0();
                  E(rr, fs);
                },
                $$slots: { default: !0 }
              });
            }
            A(ht), ge(
              (In, rr) => {
                tr = Ma(Et, 1, "post-history-search-input-wrapper svelte-uxr0i8", null, tr, { "post-history-search-active": D.isSearchMode }), Tn(Bn, "placeholder", In), Tn(Bn, "aria-label", rr), Tn(Bn, "aria-busy", D.isSearchPageLoading ? "true" : "false");
              },
              [
                () => r()("postHistory.searchPlaceholder"),
                () => r()("postHistory.search")
              ]
            ), _f(Bn, () => D.state.searchInput, (In) => D.state.searchInput = In), E(We, ht);
          };
          be(Qs, (We) => {
            a(xe) === "search" && We(qo);
          });
        }
        var Nr = L(Qs, 2);
        {
          var Vo = (We) => {
            var ht = ib(), Et = T(ht), tr = T(Et, !0);
            A(Et);
            var nr = L(Et, 2), sa = T(nr);
            {
              let Bn = I(() => n() ?? void 0), Br = I(() => r()("postHistory.jumpToDateLabel"));
              Le(sa, () => sh, (In, rr) => {
                rr(In, {
                  get locale() {
                    return a(Bn);
                  },
                  get calendarLabel() {
                    return a(Br);
                  },
                  get value() {
                    return a(G);
                  },
                  set value(Gr) {
                    p(G, Gr, !0);
                  },
                  get placeholder() {
                    return a(de);
                  },
                  set placeholder(Gr) {
                    p(de, Gr, !0);
                  },
                  get open() {
                    return a(Se);
                  },
                  set open(Gr) {
                    p(Se, Gr, !0);
                  },
                  children: (Gr, fs) => {
                    var Ws = ab(), vs = Z(Ws);
                    {
                      const tt = (gt, dt) => {
                        let Qn = () => dt?.().segments;
                        var Pt = Ae(), Sn = Z(Pt);
                        Pa(Sn, 19, Qn, (pn, Cr) => `${pn.part}-${Cr}`, (pn, Cr) => {
                          var ur = Ae(), Ur = Z(ur);
                          Le(Ur, () => rh, (Wn, wt) => {
                            wt(Wn, {
                              class: "post-history-date-picker-segment",
                              get part() {
                                return a(Cr).part;
                              },
                              children: (Nt, gn) => {
                                $s();
                                var kn = ss();
                                ge(() => J(kn, a(Cr).value)), E(Nt, kn);
                              },
                              $$slots: { default: !0 }
                            });
                          }), E(pn, ur);
                        }), E(gt, Pt);
                      };
                      Le(vs, () => nh, (gt, dt) => {
                        dt(gt, {
                          "aria-labelledby": "post-history-jump-date-label",
                          class: "post-history-date-picker-input",
                          children: tt,
                          $$slots: { default: !0 }
                        });
                      });
                    }
                    var ft = L(vs, 2);
                    {
                      let tt = I(() => r()("postHistory.jumpToDate"));
                      Le(ft, () => lh, (gt, dt) => {
                        dt(gt, {
                          class: "post-history-date-picker-trigger",
                          get "aria-label"() {
                            return a(tt);
                          },
                          children: (Qn, Pt) => {
                            var Sn = Z0();
                            E(Qn, Sn);
                          },
                          $$slots: { default: !0 }
                        });
                      });
                    }
                    var Y = L(ft, 2);
                    Le(Y, () => Xo, (tt, gt) => {
                      gt(tt, {
                        get to() {
                          return l;
                        },
                        children: (dt, Qn) => {
                          var Pt = Ae(), Sn = Z(Pt);
                          Le(Sn, () => ih, (pn, Cr) => {
                            Cr(pn, {
                              sideOffset: 8,
                              class: "post-history-date-picker-content",
                              children: (ur, Ur) => {
                                var Wn = Ae(), wt = Z(Wn);
                                {
                                  const Nt = (gn, kn) => {
                                    let ar = () => kn?.().months, Qt = () => kn?.().weekdays;
                                    var dn = rb(), Un = Z(dn);
                                    Le(Un, () => Gu, (Os, Ga) => {
                                      Ga(Os, {
                                        class: "post-history-date-picker-header",
                                        children: (sn, ct) => {
                                          var sr = tb(), qn = Z(sr), wr = L(qn, 2);
                                          Le(wr, () => eh, (Wt, Jt) => {
                                            Jt(Wt, {
                                              class: "post-history-date-picker-nav",
                                              "aria-label": "Previous month",
                                              children: (cn, ze) => {
                                                var Gt = X0();
                                                E(cn, Gt);
                                              },
                                              $$slots: { default: !0 }
                                            });
                                          });
                                          var kr = L(wr, 2);
                                          Le(kr, () => Zu, (Wt, Jt) => {
                                            Jt(Wt, { class: "post-history-date-picker-heading" });
                                          });
                                          var Dr = L(kr, 2);
                                          Le(Dr, () => Xu, (Wt, Jt) => {
                                            Jt(Wt, {
                                              class: "post-history-date-picker-nav",
                                              "aria-label": "Next month",
                                              children: (cn, ze) => {
                                                var Gt = eb();
                                                E(cn, Gt);
                                              },
                                              $$slots: { default: !0 }
                                            });
                                          });
                                          var Fn = L(Dr, 2);
                                          ni("click", qn, () => Ds(-1)), ni("click", Fn, () => Ds(1)), E(sn, sr);
                                        },
                                        $$slots: { default: !0 }
                                      });
                                    });
                                    var Zr = L(Un, 2);
                                    Pa(Zr, 19, ar, (Os, Ga) => `${Os.value.toString()}-${Ga}`, (Os, Ga) => {
                                      var sn = Ae(), ct = Z(sn);
                                      Le(ct, () => Yu, (sr, qn) => {
                                        qn(sr, {
                                          class: "post-history-date-picker-grid",
                                          children: (wr, kr) => {
                                            var Dr = nb(), Fn = Z(Dr);
                                            Le(Fn, () => Wu, (Jt, cn) => {
                                              cn(Jt, {
                                                children: (ze, Gt) => {
                                                  var Bt = Ae(), Vn = Z(Bt);
                                                  Le(Vn, () => Cl, (jn, Hn) => {
                                                    Hn(jn, {
                                                      children: (Rn, _n) => {
                                                        var on = Ae(), or = Z(on);
                                                        Pa(or, 19, Qt, (Dn, Ut) => `${Dn}-${Ut}`, (Dn, Ut) => {
                                                          var un = Ae(), Vt = Z(un);
                                                          Le(Vt, () => Ju, (Je, At) => {
                                                            At(Je, {
                                                              class: "post-history-date-picker-weekday",
                                                              children: (yn, Zt) => {
                                                                $s();
                                                                var Xt = ss();
                                                                ge(() => J(Xt, a(Ut))), E(yn, Xt);
                                                              },
                                                              $$slots: { default: !0 }
                                                            });
                                                          }), E(Dn, un);
                                                        }), E(Rn, on);
                                                      },
                                                      $$slots: { default: !0 }
                                                    });
                                                  }), E(ze, Bt);
                                                },
                                                $$slots: { default: !0 }
                                              });
                                            });
                                            var Wt = L(Fn, 2);
                                            Le(Wt, () => zu, (Jt, cn) => {
                                              cn(Jt, {
                                                children: (ze, Gt) => {
                                                  var Bt = Ae(), Vn = Z(Bt);
                                                  Pa(Vn, 19, () => a(Ga).weeks, (jn, Hn) => `${a(Ga).value.toString()}-week-${Hn}`, (jn, Hn) => {
                                                    var Rn = Ae(), _n = Z(Rn);
                                                    Le(_n, () => Cl, (on, or) => {
                                                      or(on, {
                                                        children: (Dn, Ut) => {
                                                          var un = Ae(), Vt = Z(un);
                                                          Pa(Vt, 19, () => a(Hn), (Je, At) => `${Je.toString()}-${At}`, (Je, At) => {
                                                            var yn = Ae(), Zt = Z(yn);
                                                            Le(Zt, () => Qu, (Xt, jt) => {
                                                              jt(Xt, {
                                                                get date() {
                                                                  return a(At);
                                                                },
                                                                get month() {
                                                                  return a(Ga).value;
                                                                },
                                                                children: (qr, hr) => {
                                                                  var ia = Ae(), Pr = Z(ia);
                                                                  Le(Pr, () => Ku, (Vr, ki) => {
                                                                    ki(Vr, {
                                                                      class: "post-history-date-picker-day",
                                                                      children: (Ko, Di) => {
                                                                        $s();
                                                                        var Yo = ss();
                                                                        ge(() => J(Yo, a(At).day)), E(Ko, Yo);
                                                                      },
                                                                      $$slots: { default: !0 }
                                                                    });
                                                                  }), E(qr, ia);
                                                                },
                                                                $$slots: { default: !0 }
                                                              });
                                                            }), E(Je, yn);
                                                          }), E(Dn, un);
                                                        },
                                                        $$slots: { default: !0 }
                                                      });
                                                    }), E(jn, Rn);
                                                  }), E(ze, Bt);
                                                },
                                                $$slots: { default: !0 }
                                              });
                                            }), E(wr, Dr);
                                          },
                                          $$slots: { default: !0 }
                                        });
                                      }), E(Os, sn);
                                    }), E(gn, dn);
                                  };
                                  Le(wt, () => oh, (gn, kn) => {
                                    kn(gn, {
                                      class: "post-history-date-picker-calendar",
                                      children: Nt,
                                      $$slots: { default: !0 }
                                    });
                                  });
                                }
                                E(ur, Wn);
                              },
                              $$slots: { default: !0 }
                            });
                          }), E(dt, Pt);
                        },
                        $$slots: { default: !0 }
                      });
                    }), E(Gr, Ws);
                  },
                  $$slots: { default: !0 }
                });
              });
            }
            var oa = L(sa, 2);
            {
              let Bn = I(() => r()("postHistory.jumpToDateSubmit"));
              ir(oa, {
                type: "button",
                variant: "primary",
                contentLayout: "icon",
                shape: "square",
                get ariaLabel() {
                  return a(Bn);
                },
                className: "post-history-utility-button post-history-utility-submit-button",
                onClick: () => void Ra(),
                children: (Br, In) => {
                  var rr = sb();
                  E(Br, rr);
                },
                $$slots: { default: !0 }
              });
            }
            var Aa = L(oa, 2);
            {
              let Bn = I(() => r()("postHistory.hideJumpToDate"));
              ir(Aa, {
                type: "button",
                variant: "default",
                contentLayout: "icon",
                shape: "square",
                get ariaLabel() {
                  return a(Bn);
                },
                className: "post-history-utility-button post-history-utility-close-button",
                onClick: co,
                children: (Br, In) => {
                  var rr = ob();
                  E(Br, rr);
                },
                $$slots: { default: !0 }
              });
            }
            A(nr), A(ht), ge((Bn) => J(tr, Bn), [() => r()("postHistory.jumpToDateLabel")]), E(We, ht);
          };
          be(Nr, (We) => {
            a(xe) === "jump-date" && We(Vo);
          });
        }
        var wa = L(Nr, 2), Ei = T(wa);
        {
          var hs = (We) => {
            var ht = lb(), Et = T(ht);
            Ls(Et, { variant: "spinner", showLoader: !0, loaderSize: 24 }), A(ht), E(We, ht);
          }, fo = (We) => {
            var ht = db(), Et = T(ht), tr = T(Et, !0);
            A(Et), A(ht), ge((nr) => J(tr, nr), [
              () => D.isSearchMode ? r()("postHistory.searchNoResults") : r()("postHistory.empty")
            ]), E(We, ht);
          }, Ai = (We) => {
            var ht = aC(), Et = Z(ht);
            {
              var tr = (ft) => {
                var Y = ub(), tt = T(Y);
                {
                  let gt = I(() => !D.canLoadNewer);
                  ir(tt, {
                    type: "button",
                    variant: "default",
                    className: "post-history-nav-button",
                    contentLayout: "iconText",
                    get disabled() {
                      return a(gt);
                    },
                    onClick: () => void ya(),
                    children: (dt, Qn) => {
                      var Pt = cb(), Sn = L(Z(Pt));
                      ge((pn) => J(Sn, ` ${pn ?? ""}`), [() => Na()]), E(dt, Pt);
                    },
                    $$slots: { default: !0 }
                  });
                }
                A(Y), E(ft, Y);
              };
              be(Et, (ft) => {
                (D.isSearchMode ? D.canLoadNewer : D.state.hasNewerLocal && (a(se) || !Xe || D.state.listingMode !== "contiguous")) && ft(tr);
              });
            }
            var nr = L(Et, 2);
            {
              var sa = (ft) => {
                var Y = hb(), tt = T(Y);
                {
                  var gt = (dt) => {
                    Ls(dt, {
                      variant: "spinner",
                      showLoader: !0,
                      loaderSize: 24,
                      ariaHidden: !0
                    });
                  };
                  be(tt, (dt) => {
                    a(An) && dt(gt);
                  });
                }
                A(Y), Ro(Y, (dt) => p($n, dt), () => a($n)), E(ft, Y);
              };
              be(nr, (ft) => {
                Xe && !D.isSearchMode && D.state.listingMode === "contiguous" && D.state.hasNewerLocal && !a(se) && ft(sa);
              });
            }
            var oa = L(nr, 2);
            Pa(oa, 21, () => D.posts, (ft) => ft.eventId, (ft, Y) => {
              const tt = I(() => ae.getAnchorState(a(Y)));
              var gt = Yb();
              let dt;
              var Qn = T(gt), Pt = T(Qn), Sn = T(Pt);
              {
                var pn = (sn) => {
                  var ct = xb(), sr = T(ct);
                  {
                    var qn = (ze) => {
                      var Gt = fb(), Bt = L(T(Gt), 2), Vn = T(Bt, !0);
                      A(Bt);
                      var jn = L(Bt, 2), Hn = T(jn, !0);
                      A(jn), A(Gt), ge(
                        (Rn, _n) => {
                          J(Vn, Rn), J(Hn, _n);
                        },
                        [
                          () => r()("postHistory.channel"),
                          () => ee.getChannelText(a(Y), r())
                        ]
                      ), E(ze, Gt);
                    };
                    be(sr, (ze) => {
                      a(Y).kind === 42 && ze(qn);
                    });
                  }
                  var wr = L(sr, 2), kr = T(wr);
                  {
                    var Dr = (ze) => {
                      var Gt = gb(), Bt = T(Gt);
                      {
                        var Vn = (_n) => {
                          var on = vb(), or = T(on, !0);
                          A(on), ge((Dn) => J(or, Dn), [() => r()("postHistory.deletedBadge")]), E(_n, on);
                        };
                        be(Bt, (_n) => {
                          a(Y).deletedAt && _n(Vn);
                        });
                      }
                      var jn = L(Bt, 2);
                      {
                        var Hn = (_n) => {
                          var on = pb(), or = T(on, !0);
                          A(on), ge((Dn) => J(or, Dn), [() => r()("postHistory.deleteFailed")]), E(_n, on);
                        }, Rn = I(() => d(a(Y)));
                        be(jn, (_n) => {
                          a(Rn) && _n(Hn);
                        });
                      }
                      A(Gt), E(ze, Gt);
                    }, Fn = I(() => a(Y).deletedAt || d(a(Y)));
                    be(kr, (ze) => {
                      a(Fn) && ze(Dr);
                    });
                  }
                  var Wt = L(kr, 2);
                  {
                    var Jt = (ze) => {
                      var Gt = Pb(), Bt = Z(Gt), Vn = T(Bt, !0);
                      A(Bt);
                      var jn = L(Bt, 2);
                      {
                        let Hn = I(() => fe.isPostMenuOpen(a(Y).eventId));
                        Le(jn, () => Yd, (Rn, _n) => {
                          _n(Rn, {
                            get open() {
                              return a(Hn);
                            },
                            onOpenChange: (on) => er(a(Y).eventId, on),
                            children: (on, or) => {
                              var Dn = wb(), Ut = Z(Dn);
                              Le(Ut, () => jd, (Vt, Je) => {
                                Je(Vt, {
                                  class: "menu-trigger post-history-menu-trigger",
                                  "aria-label": "アクションを表示",
                                  children: (At, yn) => {
                                    var Zt = yb();
                                    E(At, Zt);
                                  },
                                  $$slots: { default: !0 }
                                });
                              });
                              var un = L(Ut, 2);
                              Le(un, () => Xo, (Vt, Je) => {
                                Je(Vt, {
                                  get to() {
                                    return l;
                                  },
                                  children: (At, yn) => {
                                    var Zt = Ae(), Xt = Z(Zt);
                                    Le(Xt, () => Kd, (jt, qr) => {
                                      qr(jt, {
                                        side: "bottom",
                                        align: "start",
                                        sideOffset: 8,
                                        class: "post-history-menu-content",
                                        trapFocus: !1,
                                        preventScroll: !1,
                                        onCloseAutoFocus: (hr) => hr.preventDefault(),
                                        children: (hr, ia) => {
                                          var Pr = Cb(), Vr = T(Pr), ki = T(Vr, !0);
                                          A(Vr);
                                          var Ko = L(Vr, 2);
                                          Le(Ko, () => ts, (Za, Js) => {
                                            Js(Za, { class: "post-history-menu-separator" });
                                          });
                                          var Di = L(Ko, 2);
                                          {
                                            var Yo = (Za) => {
                                              var Js = bb(), zo = Z(Js);
                                              Le(zo, () => Jn, (po, go) => {
                                                go(po, {
                                                  class: "menu-action-button",
                                                  onSelect: () => void ds(a(Y)),
                                                  children: (Xa, gC) => {
                                                    var Od = mb(), Ld = L(Z(Od), 2), Eh = T(Ld, !0);
                                                    A(Ld), ge((Ah) => J(Eh, Ah), [() => r()("postHistory.showSurroundingPosts")]), E(Xa, Od);
                                                  },
                                                  $$slots: { default: !0 }
                                                });
                                              });
                                              var Ti = L(zo, 2);
                                              Le(Ti, () => ts, (po, go) => {
                                                go(po, { class: "post-history-menu-separator" });
                                              }), E(Za, Js);
                                            };
                                            be(Di, (Za) => {
                                              D.isSearchMode && Za(Yo);
                                            });
                                          }
                                          var _h = L(Di, 2);
                                          {
                                            let Za = I(() => ne.copyState[a(Y).eventId] === "failed"), Js = I(() => H(a(Y))), zo = I(() => C(a(Y))), Ti = I(() => _e(a(Y))), po = I(() => Lr(a(Y))), go = I(ja);
                                            Do(_h, {
                                              order: "standard",
                                              get copyFailed() {
                                                return a(Za);
                                              },
                                              get showBroadcast() {
                                                return a(Js);
                                              },
                                              get broadcastSending() {
                                                return a(zo);
                                              },
                                              get showDelete() {
                                                return a(Ti);
                                              },
                                              showDeleteSeparator: !1,
                                              get deletionSending() {
                                                return a(po);
                                              },
                                              onCopyPointerDown: (Xa) => ne.captureCopyPointerPosition(a(Y), Xa),
                                              onCopyNevent: (Xa) => void ne.handleCopyNevent(a(Y), Xa),
                                              get externalClientLabel() {
                                                return a(go);
                                              },
                                              onOpenExternalClient: () => ba(a(Y)),
                                              onShowRawJson: () => mr(a(Y).rawEvent),
                                              onBroadcastPointerDown: (Xa) => lt(a(Y), Xa),
                                              onBroadcastPost: (Xa) => void Oe(a(Y), Xa),
                                              onOpenDeleteConfirm: () => Me(a(Y))
                                            });
                                          }
                                          A(Pr), ge((Za) => J(ki, Za), [() => ei(a(Y).postedAt, n())]), E(hr, Pr);
                                        },
                                        $$slots: { default: !0 }
                                      });
                                    }), E(At, Zt);
                                  },
                                  $$slots: { default: !0 }
                                });
                              }), E(on, Dn);
                            },
                            $$slots: { default: !0 }
                          });
                        });
                      }
                      ge((Hn) => J(Vn, Hn), [() => vl(a(Y).postedAt)]), E(ze, Gt);
                    }, cn = I(() => !(y() || x() || St.shouldCollapsePost(a(Y))));
                    be(Wt, (ze) => {
                      a(cn) && ze(Jt);
                    });
                  }
                  A(wr), A(ct), E(sn, ct);
                }, Cr = I(() => a(Y).kind === 42 || a(Y).deletedAt || d(a(Y)) || !(y() || x() || St.shouldCollapsePost(a(Y))));
                be(Sn, (sn) => {
                  a(Cr) && sn(pn);
                });
              }
              var ur = L(Sn, 2);
              {
                let sn = I(ja);
                Pl(ur, {
                  get state() {
                    return a(tt);
                  },
                  section: "parent",
                  get previewModelByEventId() {
                    return a(Ar);
                  },
                  get emojiLoadStateByUrl() {
                    return Dt.emojiLoadStateByUrl;
                  },
                  get emojiImageMetaByUrl() {
                    return Dt.emojiImageMetaByUrl;
                  },
                  get scrollRoot() {
                    return a(pt);
                  },
                  onImageOpen: $t,
                  onToggleParent: () => Ne.preserveThreadParentToggleScroll(a(Y).eventId, a(Y).eventId, () => ae.toggleParent(a(Y))),
                  onRetryParent: () => ae.retryParent(a(Y)),
                  onToggleNodeParent: (ct) => Ne.preserveThreadParentToggleScroll(a(Y).eventId, ct, () => ae.toggleNodeParent(a(Y), ct)),
                  onRetryNodeParent: (ct) => ae.retryNodeParent(a(Y), ct),
                  onToggleNodeChildren: (ct) => ae.toggleNodeChildren(a(Y), ct),
                  onRetryNodeChildren: (ct) => ae.retryNodeChildren(a(Y), ct),
                  onCopyPointerDown: xn,
                  onCopyNevent: Rt,
                  get externalClientLabel() {
                    return a(sn);
                  },
                  onOpenExternalClient: na,
                  isCopyFailed: je,
                  onShowRawJson: Ie,
                  onBroadcastPointerDown: _s,
                  onBroadcastPost: Ka,
                  isBroadcastSending: zt,
                  canDeleteNodePost: Ya,
                  isDeletionSending: js,
                  onOpenDeleteConfirm: Es
                });
              }
              var Ur = L(ur, 2), Wn = T(Ur), wt = T(Wn);
              {
                const sn = (wr) => {
                  var kr = Ae(), Dr = Z(kr);
                  {
                    var Fn = (Jt) => {
                      {
                        let cn = I(() => St.isPostExpanded(a(Y))), ze = I(() => "post-preview-content-" + a(Y).eventId);
                        Tf(Jt, {
                          get expanded() {
                            return a(cn);
                          },
                          get controls() {
                            return a(ze);
                          },
                          onToggle: () => St.togglePostExpanded(a(Y).eventId)
                        });
                      }
                    }, Wt = I(() => Rs(a(Y)) && St.shouldCollapsePost(a(Y)));
                    be(Dr, (Jt) => {
                      a(Wt) && Jt(Fn);
                    });
                  }
                  E(wr, kr);
                };
                let ct = I(() => Va(a(Y))), sr = I(() => "post-preview-content-" + a(Y).eventId), qn = I(() => !St.isPostExpanded(a(Y)) && St.shouldCollapsePost(a(Y)));
                Xc(wt, {
                  get model() {
                    return a(ct);
                  },
                  density: "standard",
                  get emojiLoadStateByUrl() {
                    return Dt.emojiLoadStateByUrl;
                  },
                  get emojiImageMetaByUrl() {
                    return Dt.emojiImageMetaByUrl;
                  },
                  get scrollRoot() {
                    return a(pt);
                  },
                  get previewCollapseAction() {
                    return St.previewRef;
                  },
                  get previewCollapseEventId() {
                    return a(Y).eventId;
                  },
                  get previewContentId() {
                    return a(sr);
                  },
                  get isTextCollapsed() {
                    return a(qn);
                  },
                  onImageOpen: $t,
                  betweenContentAndMedia: sn,
                  $$slots: { betweenContentAndMedia: !0 }
                });
              }
              var Nt = L(wt, 2);
              {
                var gn = (sn) => {
                  var ct = Ib();
                  Pa(ct, 21, () => Xn(a(Y)), (sr) => sr.eventId, (sr, qn) => {
                    {
                      const wr = (Dr) => {
                        var Fn = Ae(), Wt = Z(Fn);
                        {
                          var Jt = (cn) => {
                            const ze = I(() => qt(a(qn).event)), Gt = I(() => rn(a(Y).eventId, a(ze).eventId)), Bt = I(() => r()("common.showActions"));
                            {
                              const Vn = (Rn) => {
                                {
                                  let _n = I(() => ne.copyState[a(ze).eventId] === "failed"), on = I(() => H(a(ze))), or = I(() => C(a(ze))), Dn = I(() => _e(a(ze))), Ut = I(() => Lr(a(ze))), un = I(ja);
                                  Do(Rn, {
                                    order: "standard",
                                    get copyFailed() {
                                      return a(_n);
                                    },
                                    get showBroadcast() {
                                      return a(on);
                                    },
                                    get broadcastSending() {
                                      return a(or);
                                    },
                                    get showDelete() {
                                      return a(Dn);
                                    },
                                    showDeleteSeparator: !0,
                                    get deletionSending() {
                                      return a(Ut);
                                    },
                                    onCopyPointerDown: (Vt) => ne.captureCopyPointerPosition(a(ze), Vt),
                                    onCopyNevent: (Vt) => void ne.handleCopyNevent(a(ze), Vt),
                                    get externalClientLabel() {
                                      return a(un);
                                    },
                                    onOpenExternalClient: () => ba(a(ze)),
                                    onShowRawJson: () => mr(a(ze).rawEvent),
                                    onBroadcastPointerDown: (Vt) => lt(a(ze), Vt),
                                    onBroadcastPost: (Vt) => void Oe(a(ze), Vt),
                                    onOpenDeleteConfirm: () => Me(a(ze))
                                  });
                                }
                              };
                              let jn = I(() => fe.isPostMenuOpen(a(Gt))), Hn = I(() => ei(a(ze).postedAt, n()));
                              gl(cn, {
                                get open() {
                                  return a(jn);
                                },
                                onOpenChange: (Rn) => er(a(Gt), Rn),
                                get triggerAriaLabel() {
                                  return a(Bt);
                                },
                                get tooltipContent() {
                                  return a(Bt);
                                },
                                enableTooltip: !0,
                                get timestamp() {
                                  return a(Hn);
                                },
                                items: Vn,
                                $$slots: { items: !0 }
                              });
                            }
                          };
                          be(Wt, (cn) => {
                            a(qn).status === "resolved" && cn(Jt);
                          });
                        }
                        E(Dr, Fn);
                      };
                      let kr = I(() => a(qn).status === "resolved" ? a(Ar)[a(qn).event.id] : void 0);
                      dh(sr, {
                        get preview() {
                          return a(qn);
                        },
                        get model() {
                          return a(kr);
                        },
                        get emojiLoadStateByUrl() {
                          return Dt.emojiLoadStateByUrl;
                        },
                        get emojiImageMetaByUrl() {
                          return Dt.emojiImageMetaByUrl;
                        },
                        get scrollRoot() {
                          return a(pt);
                        },
                        onImageOpen: $t,
                        onRetry: () => ve.retryQuotePreview(a(qn).eventId),
                        footerMenu: wr,
                        $$slots: { footerMenu: !0 }
                      });
                    }
                  }), A(ct), E(sn, ct);
                }, kn = I(() => Xn(a(Y)).length > 0);
                be(Nt, (sn) => {
                  a(kn) && sn(gn);
                });
              }
              A(Wn);
              var ar = L(Wn, 2);
              {
                var Qt = (sn) => {
                  const ct = I(() => N(a(Y))), sr = I(() => a(tt).repliesActionState.status === "loaded" && a(tt).repliesActionState.replyCount > 0);
                  var qn = qb(), wr = Z(qn);
                  {
                    const Wt = (Gt) => {
                      var Bt = Eb(), Vn = Z(Bt), jn = T(Vn);
                      {
                        var Hn = (Je) => {
                          {
                            let At = I(() => r()("replyQuote.reply_label")), yn = I(() => r()("replyQuote.reply_label"));
                            $i(Je, {
                              type: "button",
                              className: "post-preview-action-button post-history-action-button",
                              get ariaLabel() {
                                return a(At);
                              },
                              contentLayout: "icon",
                              shape: "circle",
                              onClick: () => io(a(Y)),
                              get tooltipContent() {
                                return a(yn);
                              },
                              children: (Zt, Xt) => {
                                var jt = Sb();
                                E(Zt, jt);
                              },
                              $$slots: { default: !0 }
                            });
                          }
                        };
                        be(jn, (Je) => {
                          y() && Je(Hn);
                        });
                      }
                      var Rn = L(jn, 2), _n = T(Rn);
                      {
                        var on = (Je) => {
                          xd(Je, {
                            get count() {
                              return a(tt).repliesActionState.replyCount;
                            },
                            get selected() {
                              return a(tt).repliesActionState.visible;
                            },
                            get ariaLabel() {
                              return a(ct);
                            },
                            get tooltipContent() {
                              return a(ct);
                            },
                            onClick: () => we(a(Y))
                          });
                        };
                        be(_n, (Je) => {
                          a(sr) && Je(on);
                        });
                      }
                      A(Rn), A(Vn);
                      var or = L(Vn, 2);
                      {
                        var Dn = (Je) => {
                          {
                            let At = I(() => r()("replyQuote.quote_label")), yn = I(() => r()("replyQuote.quote_label"));
                            $i(Je, {
                              type: "button",
                              className: "post-preview-action-button post-history-action-button",
                              get ariaLabel() {
                                return a(At);
                              },
                              contentLayout: "icon",
                              shape: "circle",
                              onClick: () => As(a(Y)),
                              get tooltipContent() {
                                return a(yn);
                              },
                              children: (Zt, Xt) => {
                                var jt = Rb();
                                E(Zt, jt);
                              },
                              $$slots: { default: !0 }
                            });
                          }
                        };
                        be(or, (Je) => {
                          x() && Je(Dn);
                        });
                      }
                      var Ut = L(or, 2), un = T(Ut);
                      {
                        var Vt = (Je) => {
                          {
                            let At = I(() => Q(a(Y))), yn = I(() => V(a(Y))), Zt = I(() => Q(a(Y)));
                            $i(Je, {
                              type: "button",
                              className: "post-preview-reactions-button",
                              get ariaLabel() {
                                return a(At);
                              },
                              shape: "pill",
                              get selected() {
                                return a(yn);
                              },
                              onClick: () => oe(a(Y)),
                              get tooltipContent() {
                                return a(Zt);
                              },
                              children: (Xt, jt) => {
                                var qr = _b(), hr = L(Z(qr), 2), ia = T(hr, !0);
                                A(hr), ge(() => J(ia, a(tt).reactionSummary.totalCount)), E(Xt, qr);
                              },
                              $$slots: { default: !0 }
                            });
                          }
                        };
                        be(un, (Je) => {
                          a(tt).reactionSummary.totalCount > 0 && Je(Vt);
                        });
                      }
                      A(Ut), E(Gt, Bt);
                    }, Jt = (Gt) => {
                      const Bt = I(() => r()("common.showActions"));
                      {
                        const Vn = (Rn) => {
                          var _n = Tb(), on = Z(_n);
                          Le(on, () => Jn, (Je, At) => {
                            At(Je, {
                              class: "menu-action-button",
                              onSelect: () => ba(a(Y)),
                              children: (yn, Zt) => {
                                var Xt = Ab(), jt = L(Z(Xt), 2), qr = T(jt, !0);
                                A(jt), ge((hr) => J(qr, hr), [() => ja()]), E(yn, Xt);
                              },
                              $$slots: { default: !0 }
                            });
                          });
                          var or = L(on, 2);
                          Le(or, () => ts, (Je, At) => {
                            At(Je, { class: "post-history-menu-separator" });
                          });
                          var Dn = L(or, 2);
                          {
                            let Je = I(() => a(tt).repliesActionState.status === "loading");
                            Le(Dn, () => Jn, (At, yn) => {
                              yn(At, {
                                class: "menu-action-button",
                                get disabled() {
                                  return a(Je);
                                },
                                onSelect: () => we(a(Y)),
                                children: (Zt, Xt) => {
                                  var jt = kb(), qr = Z(jt), hr = L(qr, 2), ia = T(hr, !0);
                                  A(hr), ge(() => {
                                    Ma(qr, 1, `${a(tt).repliesActionState.visible ? "collapse-content-icon" : "find_in_page-icon"} svg-icon`, "svelte-uxr0i8"), J(ia, a(ct));
                                  }), E(Zt, jt);
                                },
                                $$slots: { default: !0 }
                              });
                            });
                          }
                          var Ut = L(Dn, 2);
                          {
                            var un = (Je) => {
                              var At = Ae(), yn = Z(At);
                              Le(yn, () => Jn, (Zt, Xt) => {
                                Xt(Zt, {
                                  class: "menu-action-button",
                                  onSelect: () => void ds(a(Y)),
                                  children: (jt, qr) => {
                                    var hr = Db(), ia = L(Z(hr), 2), Pr = T(ia, !0);
                                    A(ia), ge((Vr) => J(Pr, Vr), [() => r()("postHistory.showSurroundingPosts")]), E(jt, hr);
                                  },
                                  $$slots: { default: !0 }
                                });
                              }), E(Je, At);
                            };
                            be(Ut, (Je) => {
                              D.isSearchMode && Je(un);
                            });
                          }
                          var Vt = L(Ut, 2);
                          {
                            let Je = I(() => ne.copyState[a(Y).eventId] === "failed"), At = I(() => H(a(Y))), yn = I(() => C(a(Y))), Zt = I(() => _e(a(Y))), Xt = I(() => Lr(a(Y)));
                            Do(Vt, {
                              order: "standard",
                              get copyFailed() {
                                return a(Je);
                              },
                              get showBroadcast() {
                                return a(At);
                              },
                              get broadcastSending() {
                                return a(yn);
                              },
                              get showDelete() {
                                return a(Zt);
                              },
                              showDeleteSeparator: !0,
                              get deletionSending() {
                                return a(Xt);
                              },
                              onCopyPointerDown: (jt) => ne.captureCopyPointerPosition(a(Y), jt),
                              onCopyNevent: (jt) => void ne.handleCopyNevent(a(Y), jt),
                              onShowRawJson: () => mr(a(Y).rawEvent),
                              onBroadcastPointerDown: (jt) => lt(a(Y), jt),
                              onBroadcastPost: (jt) => void Oe(a(Y), jt),
                              onOpenDeleteConfirm: () => Me(a(Y))
                            });
                          }
                          E(Rn, _n);
                        };
                        let jn = I(() => fe.isPostMenuOpen(a(Y).eventId)), Hn = I(() => ei(a(Y).postedAt, n()));
                        gl(Gt, {
                          get open() {
                            return a(jn);
                          },
                          onOpenChange: (Rn) => er(a(Y).eventId, Rn),
                          get triggerAriaLabel() {
                            return a(Bt);
                          },
                          get tooltipContent() {
                            return a(Bt);
                          },
                          enableTooltip: !0,
                          get timestamp() {
                            return a(Hn);
                          },
                          items: Vn,
                          $$slots: { items: !0 }
                        });
                      }
                    };
                    let cn = I(() => vl(a(Y).postedAt)), ze = I(() => !!a(Y).deletedAt);
                    mu(wr, {
                      get formattedDate() {
                        return a(cn);
                      },
                      get dimmed() {
                        return a(ze);
                      },
                      actions: Wt,
                      trailing: Jt,
                      $$slots: { actions: !0, trailing: !0 }
                    });
                  }
                  var kr = L(wr, 2);
                  {
                    var Dr = (Wt) => {
                      var Jt = Ub();
                      Pa(Jt, 21, () => le(a(Y)), (cn) => cn.content, (cn, ze) => {
                        var Gt = Bb(), Bt = T(Gt), Vn = T(Bt);
                        {
                          var jn = (Ut) => {
                            var un = Mb();
                            E(Ut, un);
                          }, Hn = I(() => b0(a(ze).content)), Rn = (Ut) => {
                            var un = Ae(), Vt = Z(un);
                            {
                              var Je = (Zt) => {
                                var Xt = Ob(), jt = T(Xt, !0);
                                A(Xt), ge(() => J(jt, a(ze).content)), E(Zt, Xt);
                              }, At = I(() => dr(a(ze).emojiUrl)), yn = (Zt) => {
                                var Xt = Hb(), jt = T(Xt);
                                {
                                  var qr = (Pr) => {
                                    var Vr = Lb();
                                    ge(() => {
                                      Tn(Vr, "src", a(ze).emojiUrl), Tn(Vr, "alt", a(ze).content), Tn(Vr, "title", a(ze).content);
                                    }), E(Pr, Vr);
                                  }, hr = I(() => pr(a(ze).emojiUrl)), ia = (Pr) => {
                                    var Vr = Fb();
                                    E(Pr, Vr);
                                  };
                                  be(jt, (Pr) => {
                                    a(hr) ? Pr(qr) : Pr(ia, -1);
                                  });
                                }
                                A(Xt), ge((Pr) => Ci(Xt, Pr), [
                                  () => _r(a(ze).emojiUrl)
                                ]), E(Zt, Xt);
                              };
                              be(Vt, (Zt) => {
                                a(At) ? Zt(Je) : Zt(yn, -1);
                              });
                            }
                            E(Ut, un);
                          }, _n = (Ut) => {
                            var un = $b(), Vt = T(un, !0);
                            A(un), ge(() => J(Vt, a(ze).content)), E(Ut, un);
                          };
                          be(Vn, (Ut) => {
                            a(Hn) ? Ut(jn) : a(ze).emojiUrl ? Ut(Rn, 1) : Ut(_n, -1);
                          });
                        }
                        var on = L(Vn, 2), or = T(on, !0);
                        A(on), A(Bt);
                        var Dn = L(Bt, 2);
                        Pa(Dn, 21, () => a(ze).reactors, (Ut) => Ut.eventId, (Ut, un) => {
                          const Vt = I(() => Te(a(un)));
                          var Je = Nb(), At = T(Je);
                          {
                            let yn = I(() => a(un).profile?.picture || "");
                            If(At, {
                              get src() {
                                return a(yn);
                              },
                              get alt() {
                                return a(Vt);
                              },
                              rootClassName: "post-preview-reaction-avatar",
                              imageClassName: "post-preview-reaction-avatar-image",
                              fallbackClassName: "post-preview-reaction-avatar-fallback",
                              get fallbackAriaLabel() {
                                return a(Vt);
                              },
                              fallbackDelayMs: 0
                            });
                          }
                          A(Je), ge(() => {
                            Tn(Je, "title", a(Vt)), Tn(Je, "aria-label", a(Vt));
                          }), E(Ut, Je);
                        }), A(Dn), A(Gt), ge(() => J(or, a(ze).count)), E(cn, Gt);
                      }), A(Jt), E(Wt, Jt);
                    }, Fn = I(() => a(tt).reactionSummary.totalCount > 0 && V(a(Y)));
                    be(kr, (Wt) => {
                      a(Fn) && Wt(Dr);
                    });
                  }
                  E(sn, qn);
                }, dn = I(() => y() || x() || St.shouldCollapsePost(a(Y)) || H(a(Y)) || a(tt).reactionSummary.totalCount > 0 || a(tt).repliesActionState.status === "loaded" && a(tt).repliesActionState.replyCount > 0);
                be(ar, (sn) => {
                  a(dn) && sn(Qt);
                });
              }
              var Un = L(ar, 2);
              {
                let sn = I(ja);
                Pl(Un, {
                  get state() {
                    return a(tt);
                  },
                  section: "children",
                  get previewModelByEventId() {
                    return a(Ar);
                  },
                  get emojiLoadStateByUrl() {
                    return Dt.emojiLoadStateByUrl;
                  },
                  get emojiImageMetaByUrl() {
                    return Dt.emojiImageMetaByUrl;
                  },
                  get scrollRoot() {
                    return a(pt);
                  },
                  onImageOpen: $t,
                  onToggleNodeParent: (ct) => Ne.preserveThreadParentToggleScroll(a(Y).eventId, ct, () => ae.toggleNodeParent(a(Y), ct)),
                  onRetryNodeParent: (ct) => ae.retryNodeParent(a(Y), ct),
                  onToggleNodeChildren: (ct) => ae.toggleNodeChildren(a(Y), ct),
                  onRetryNodeChildren: (ct) => ae.retryNodeChildren(a(Y), ct),
                  onCopyPointerDown: xn,
                  onCopyNevent: Rt,
                  get externalClientLabel() {
                    return a(sn);
                  },
                  onOpenExternalClient: na,
                  isCopyFailed: je,
                  onShowRawJson: Ie,
                  onBroadcastPointerDown: _s,
                  onBroadcastPost: Ka,
                  isBroadcastSending: zt,
                  canDeleteNodePost: Ya,
                  isDeletionSending: js,
                  onOpenDeleteConfirm: Es
                });
              }
              A(Ur), A(Pt);
              var Zr = L(Pt, 2);
              {
                var Os = (sn) => {
                  var ct = Kb(), sr = T(ct);
                  {
                    var qn = (Fn) => {
                      var Wt = Vb(), Jt = T(Wt, !0);
                      A(Wt), ge((cn) => J(Jt, cn), [() => r()("postHistory.deletedBadge")]), E(Fn, Wt);
                    };
                    be(sr, (Fn) => {
                      a(Y).deletedAt && Fn(qn);
                    });
                  }
                  var wr = L(sr, 2);
                  {
                    var kr = (Fn) => {
                      var Wt = jb(), Jt = T(Wt, !0);
                      A(Wt), ge((cn) => J(Jt, cn), [() => r()("postHistory.deleteFailed")]), E(Fn, Wt);
                    }, Dr = I(() => d(a(Y)));
                    be(wr, (Fn) => {
                      a(Dr) && Fn(kr);
                    });
                  }
                  A(ct), E(sn, ct);
                }, Ga = I(() => !(y() || St.shouldCollapsePost(a(Y))) && (a(Y).deletedAt || d(a(Y))));
                be(Zr, (sn) => {
                  a(Ga) && sn(Os);
                });
              }
              A(Qn), A(gt), ge(() => {
                dt = Ma(gt, 1, "post-history-item svelte-uxr0i8", null, dt, { "post-history-item-deleted": !!a(Y).deletedAt }), Tn(gt, "data-post-history-event-id", a(Y).eventId), Tn(gt, "data-post-history-posted-at", a(Y).postedAt), Tn(Ur, "data-post-history-thread-anchor-scope-id", a(Y).eventId), Tn(Ur, "data-post-history-thread-anchor-event-id", a(Y).eventId);
              }), E(ft, gt);
            }), A(oa);
            var Aa = L(oa, 2);
            {
              var Bn = (ft) => {
                var Y = zb(), tt = T(Y);
                {
                  var gt = (dt) => {
                    Ls(dt, {
                      variant: "spinner",
                      showLoader: !0,
                      loaderSize: 24,
                      ariaHidden: !0
                    });
                  };
                  be(tt, (dt) => {
                    a(nn) && dt(gt);
                  });
                }
                A(Y), Ro(Y, (dt) => p(ut, dt), () => a(ut)), E(ft, Y);
              };
              be(Aa, (ft) => {
                Xe && !D.isSearchMode && D.state.listingMode === "contiguous" && D.state.hasOlderLocal && !D.showSavedPostsBoundary && ft(Bn);
              });
            }
            var Br = L(Aa, 2);
            {
              var In = (ft) => {
                var Y = Qb(), tt = T(Y), gt = T(tt, !0);
                A(tt);
                var dt = L(tt, 2), Qn = T(dt, !0);
                A(dt), A(Y), ge(
                  (Pt, Sn) => {
                    J(gt, Pt), J(Qn, Sn);
                  },
                  [
                    () => r()("postHistory.savedOlderPostsShowing"),
                    () => r()("postHistory.savedOlderPostsGapNotice")
                  ]
                ), E(ft, Y);
              };
              be(Br, (ft) => {
                D.isShowingSavedOlderPosts && ft(In);
              });
            }
            var rr = L(Br, 2);
            {
              var Gr = (ft) => {
                var Y = Gb(), tt = T(Y), gt = T(tt);
                {
                  var dt = (Pt) => {
                    {
                      let Sn = I(() => D.isFetchingFromRelays || D.isRefetchingAroundCurrentView);
                      ir(Pt, {
                        type: "button",
                        variant: "primary",
                        className: "post-history-nav-button",
                        contentLayout: "iconText",
                        get disabled() {
                          return a(Sn);
                        },
                        onClick: () => void qa(),
                        children: (pn, Cr) => {
                          var ur = Wb(), Ur = L(Z(ur));
                          ge((Wn) => J(Ur, ` ${Wn ?? ""}`), [() => r()("postHistory.fetchOlderFromRelays")]), E(pn, ur);
                        },
                        $$slots: { default: !0 }
                      });
                    }
                  };
                  be(gt, (Pt) => {
                    (D.canFetchOlderFromRelays || D.isFetchingFromRelays) && Pt(dt);
                  });
                }
                var Qn = L(gt, 2);
                ir(Qn, {
                  type: "button",
                  variant: "default",
                  className: "post-history-nav-button",
                  contentLayout: "iconText",
                  onClick: () => void Ua(),
                  children: (Pt, Sn) => {
                    var pn = Jb(), Cr = L(Z(pn));
                    ge((ur) => J(Cr, ` ${ur ?? ""}`), [() => r()("postHistory.showSavedOlderPosts")]), E(Pt, pn);
                  },
                  $$slots: { default: !0 }
                }), A(tt), A(Y), E(ft, Y);
              }, fs = (ft) => {
                var Y = Xb(), tt = T(Y);
                {
                  let gt = I(() => !D.canLoadOlder);
                  ir(tt, {
                    type: "button",
                    variant: "default",
                    className: "post-history-nav-button",
                    contentLayout: "iconText",
                    get disabled() {
                      return a(gt);
                    },
                    onClick: () => void ga(),
                    children: (dt, Qn) => {
                      var Pt = Zb(), Sn = L(Z(Pt));
                      ge((pn) => J(Sn, ` ${pn ?? ""}`), [() => Sa()]), E(dt, Pt);
                    },
                    $$slots: { default: !0 }
                  });
                }
                A(Y), E(ft, Y);
              }, Ws = (ft) => {
                var Y = tC(), tt = T(Y);
                {
                  let gt = I(() => !D.canLoadOlder);
                  ir(tt, {
                    type: "button",
                    variant: "default",
                    className: "post-history-nav-button",
                    contentLayout: "iconText",
                    get disabled() {
                      return a(gt);
                    },
                    onClick: () => void ga(),
                    children: (dt, Qn) => {
                      var Pt = eC(), Sn = L(Z(Pt));
                      ge((pn) => J(Sn, ` ${pn ?? ""}`), [() => Sa()]), E(dt, Pt);
                    },
                    $$slots: { default: !0 }
                  });
                }
                A(Y), E(ft, Y);
              }, vs = (ft) => {
                var Y = rC(), tt = T(Y);
                {
                  var gt = (dt) => {
                    {
                      let Qn = I(() => D.isFetchingFromRelays || D.isRefetchingAroundCurrentView);
                      ir(dt, {
                        type: "button",
                        variant: "primary",
                        className: "post-history-nav-button",
                        contentLayout: "iconText",
                        get disabled() {
                          return a(Qn);
                        },
                        onClick: () => void qa(),
                        children: (Pt, Sn) => {
                          var pn = Ae(), Cr = Z(pn);
                          {
                            var ur = (Wn) => {
                              {
                                let wt = I(() => r()("postHistory.fetchOlderFromRelaysLoading"));
                                Ls(Wn, {
                                  get text() {
                                    return a(wt);
                                  },
                                  showLoader: !0,
                                  loaderSize: 28,
                                  customClass: "post-history-nav-loading-placeholder"
                                });
                              }
                            }, Ur = (Wn) => {
                              var wt = nC(), Nt = L(Z(wt));
                              ge((gn) => J(Nt, ` ${gn ?? ""}`), [() => r()("postHistory.fetchOlderFromRelays")]), E(Wn, wt);
                            };
                            be(Cr, (Wn) => {
                              D.isFetchingOlderFromRelays ? Wn(ur) : Wn(Ur, -1);
                            });
                          }
                          E(Pt, pn);
                        },
                        $$slots: { default: !0 }
                      });
                    }
                  };
                  be(tt, (dt) => {
                    (D.canFetchOlderFromRelays || D.isFetchingFromRelays || D.isRefetchingAroundCurrentView) && dt(gt);
                  });
                }
                A(Y), E(ft, Y);
              };
              be(rr, (ft) => {
                D.showSavedPostsBoundary ? ft(Gr) : D.isSearchMode && D.canLoadOlder ? ft(fs, 1) : !D.isSearchMode && D.state.hasOlderLocal && (D.state.listingMode === "sparse" || !Xe) ? ft(Ws, 2) : D.showLocalExhaustedState && ft(vs, 3);
              });
            }
            E(We, ht);
          };
          be(Ei, (We) => {
            D.posts.length === 0 && a(bt) ? We(hs) : a(Zn) ? We(fo, 1) : We(Ai, -1);
          });
        }
        A(wa), Ro(wa, (We) => p(pt, We), () => a(pt));
        var vo = L(wa, 2);
        {
          var Ts = (We) => {
            var ht = oC(), Et = T(ht);
            {
              let tr = I(() => r()("postHistory.returnToLatest"));
              ir(Et, {
                type: "button",
                variant: "default",
                shape: "circle",
                className: "post-history-latest-button",
                contentLayout: "icon",
                get ariaLabel() {
                  return a(tr);
                },
                onClick: () => void ma(),
                children: (nr, sa) => {
                  var oa = sC();
                  E(nr, oa);
                },
                $$slots: { default: !0 }
              });
            }
            A(ht), E(We, ht);
          };
          be(vo, (We) => {
            a(yr) && We(Ts);
          });
        }
        var Ms = L(vo, 2);
        ch(Ms, {
          get open() {
            return a(M);
          },
          get ownerPubkeyHex() {
            return f();
          },
          getCurrentPubkeyHex: () => f(),
          onOpenChange: (We) => p(M, We, !0),
          onImported: ie
        });
        var jo = L(Ms, 2);
        kf(jo, {
          get open() {
            return a(ue);
          },
          get rawEvent() {
            return a(Fe);
          },
          onOpenChange: (We) => p(ue, We, !0)
        }), ge(() => {
          Ma(wa, 1, `post-history-container${Xe && !D.isSearchMode && D.state.listingMode === "contiguous" ? " post-history-auto-load-enabled" : ""}`, "svelte-uxr0i8"), Tn(wa, "aria-busy", a(zr) || a(nn) ? "true" : "false");
        }), _o("scroll", wa, function(...We) {
          Ne.handleHistoryScroll?.apply(this, We);
        }), E(Pe, an);
      },
      $$slots: { footer: !0, default: !0 }
    });
  }
  var Fr = L(Qa, 2);
  {
    const h = (vn) => {
      var _t = lC(), zn = T(_t), br = T(zn, !0);
      A(zn);
      var $r = L(zn, 2), Jr = T($r, !0);
      A($r), A(_t), ge(
        (uo, Ea) => {
          J(br, uo), J(Jr, Ea);
        },
        [
          () => r()("postHistory.deleteRequestDescription"),
          () => r()("postHistory.deleteRequestWarning")
        ]
      ), E(vn, _t);
    };
    let B = I(() => r()("postHistory.deleteRequestTitle")), Ce = I(() => r()("postHistory.deleteRequestDescription")), Pe = I(() => fe.deleteTargetPost && Lr(fe.deleteTargetPost) ? r()("postHistory.deleteSending") : r()("postHistory.deleteConfirm")), Qe = I(() => r()("postHistory.deleteCancel")), an = I(() => fe.deleteTargetPost ? Lr(fe.deleteTargetPost) : !1);
    Ud(Fr, {
      get open() {
        return fe.deleteConfirmOpen;
      },
      get onOpenChange() {
        return fe.setDeleteConfirmOpen;
      },
      get title() {
        return a(B);
      },
      get description() {
        return a(Ce);
      },
      get confirmLabel() {
        return a(Pe);
      },
      get cancelLabel() {
        return a(Qe);
      },
      confirmVariant: "danger",
      get confirmDisabled() {
        return a(an);
      },
      onConfirm: Ct,
      onCancel: ks,
      contentClass: "post-history-delete-confirm",
      children: h,
      $$slots: { default: !0 }
    });
  }
  var _a = L(Fr, 2);
  {
    const h = (an) => {
      var vn = dC(), _t = T(vn), zn = T(_t, !0);
      A(_t), A(vn), ge((br) => J(zn, br), [() => r()("postHistory.deleteLocalHistoryDescription")]), E(an, vn);
    };
    let B = I(() => r()("postHistory.deleteLocalHistoryTitle")), Ce = I(() => r()("postHistory.deleteLocalHistoryDescription")), Pe = I(() => r()("postHistory.deleteLocalHistoryConfirm")), Qe = I(() => r()("postHistory.deleteLocalHistoryCancel"));
    Ud(_a, {
      get title() {
        return a(B);
      },
      get description() {
        return a(Ce);
      },
      get confirmLabel() {
        return a(Pe);
      },
      get cancelLabel() {
        return a(Qe);
      },
      confirmVariant: "danger",
      onConfirm: ln,
      onCancel: et,
      closeOnConfirm: !1,
      preventCloseWhileConfirming: !0,
      showConfirmSpinner: !0,
      contentClass: "post-history-local-delete-confirm",
      get open() {
        return a(He);
      },
      set open(an) {
        p(He, an, !0);
      },
      children: h,
      $$slots: { default: !0 }
    });
  }
  var Wa = L(_a, 2);
  {
    let h = I(() => a(Ze)[a(ot)]?.src ?? ""), B = I(() => a(Ze)[a(ot)]?.alt ?? "");
    bf(Wa, {
      get src() {
        return a(h);
      },
      get alt() {
        return a(B);
      },
      onClose: cr,
      get mediaList() {
        return a(Ze);
      },
      get currentIndex() {
        return a(ot);
      },
      onNavigate: Nn,
      get show() {
        return a(It);
      },
      set show(Ce) {
        p(It, Ce, !0);
      }
    });
  }
  var zs = L(Wa, 2);
  Hi(zs, {
    get show() {
      return ne.showCopyFloatingMessage;
    },
    get x() {
      return ne.copyFloatingMessageX;
    },
    get y() {
      return ne.copyFloatingMessageY;
    },
    children: (h, B) => {
      var Ce = cC(), Pe = T(Ce, !0);
      A(Ce), ge((Qe) => J(Pe, Qe), [() => r()("postHistory.copied")]), E(h, Ce);
    },
    $$slots: { default: !0 }
  });
  var us = L(zs, 2);
  Hi(us, {
    get show() {
      return a(Ge);
    },
    get x() {
      return a(kt);
    },
    get y() {
      return a(vt);
    },
    children: (h, B) => {
      var Ce = uC(), Pe = T(Ce, !0);
      A(Ce), ge((Qe) => J(Pe, Qe), [() => r()(a(xt))]), E(h, Ce);
    },
    $$slots: { default: !0 }
  });
  var Uo = L(us, 2);
  Hi(Uo, {
    get show() {
      return a(q);
    },
    variant: "top-right",
    children: (h, B) => {
      var Ce = hC(), Pe = T(Ce, !0);
      A(Ce), ge((Qe) => J(Pe, Qe), [
        () => r()(a(De), { values: a(nt) })
      ]), E(h, Ce);
    },
    $$slots: { default: !0 }
  }), E(t, ra);
  var Hr = Lt(Ca);
  return s(), Hr;
}
vu(["click"]);
Ft(
  pC,
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
  pC as default
};
