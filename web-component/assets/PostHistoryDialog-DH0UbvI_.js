import { b$ as _s, c0 as as, c1 as Mh, c2 as Yc, c3 as Cs, aJ as zc, c4 as mi, c5 as bi, c6 as Uo, c7 as qo, c8 as Qc, aI as Wc, c9 as Ci, ca as Jc, aH as ro, cb as Oi, cc as Ld, aO as Gc, aG as en, cd as Oh, aE as wi, ce as Zc, aF as vr, cf as Il, ai as Xc, aL as Fa, cg as _l, I as A, aR as Yt, aP as Me, K as we, aS as Mt, aT as Kr, aU as Rr, aV as Sr, ch as Lh, ci as Fh, cj as Pi, ck as cl, cl as eu, cm as ul, cn as Hh, b1 as so, aQ as ia, co as $h, a_ as He, bZ as Nh, H as $a, Q as Ns, V as xs, $ as Bs, cp as tu, cq as hl, cr as fl, bc as nu, N as Hn, M as Oa, aA as ir, a4 as it, cs as oo, A as Bh, bT as io, L as To, O as xi, ct as Uh, cu as qh, cv as Vh, b_ as ni, cw as jh, cx as Kh, cy as Yh, cz as zh, cA as ri, W as ba, cB as Qh, cC as Wh, cD as Jh, cE as Gh, b7 as Zh, cF as ii, cG as Xh, w as ru, cH as El, cI as Al, cJ as kl, cK as au, cL as Ri, cM as pl, cN as ef, cO as tf, cP as to, cQ as ai, cR as nf, cS as su, cT as Dl, cU as es, cV as ws, cW as rf, cX as Tl, cY as Ml, cZ as af, c_ as Fd, c$ as sf, d0 as ou, d1 as Hd, d2 as of, d3 as Li, d4 as Fi, d5 as iu, d6 as lf, d7 as df, d8 as cf, d9 as lu, da as uf, db as hf, dc as Hi, dd as ff, de as Ol, df as du, dg as cu, dh as uu, bb as pf, di as vf, dj as $d, dk as gf, dl as yf, dm as hu, dn as Si, dp as Ll, dq as mf, aY as bf, dr as Cf, aB as Nd, al as wf, aC as $i, ds as Bd, bB as Pf, S as Ms, dt as xf, du as Rf, s as Ud, ba as Sf, ay as If } from "./App-BmKERuNr.js";
import { aN as ze, u as ca, aR as R, a, b as g, aS as be, aJ as lr, a_ as _f, b7 as Yr, b0 as Ot, b1 as Oe, b2 as ee, b3 as D, b4 as Lt, b5 as I, ba as j, b8 as M, n as Ir, bh as ss, Z as me, bi as G, b9 as T, b6 as Ft, bf as F, aO as fu, bj as Fs, bL as Fl, ap as si, bD as Mo, aq as pu, bl as vu, bS as gu, b_ as Hl, bQ as ns, bO as Ii, bk as hn, bI as $l, bY as qd, bX as Ef, b$ as yu, a$ as da, bP as Af, bN as kf } from "./entry-COr0Xz6m.js";
import { b as Df } from "./input-jxEk8QB_.js";
import { D as mu, a as bu } from "./DialogWrapper-DHXofWjt.js";
import { M as Xn, a as ts, P as Cu, b as vl, u as Tf, c as Mf, d as Of, p as Lf, e as Vd, D as jd, f as Kd, g as Yd, h as Ff, r as Hf, i as $f, j as Ni } from "./postBroadcastService-BwryR9jo.js";
import { H as Nf } from "./hidden-input-DwgoDpUw.js";
import { P as Bf, b as Uf, a as qf } from "./popover-trigger-5a1hFGhv.js";
function Bi(t, e) {
  return t - e * Math.floor(t / e);
}
const wu = 1721426;
function Go(t, e, n, r) {
  e = Nl(t, e);
  let o = e - 1, s = -2;
  return n <= 2 ? s = 0 : oi(e) && (s = -1), wu - 1 + 365 * o + Math.floor(o / 4) - Math.floor(o / 100) + Math.floor(o / 400) + Math.floor((367 * n - 362) / 12 + s + r);
}
function oi(t) {
  return t % 4 === 0 && (t % 100 !== 0 || t % 400 === 0);
}
function Nl(t, e) {
  return t === "BC" ? 1 - e : e;
}
function Vf(t) {
  let e = "AD";
  return t <= 0 && (e = "BC", t = 1 - t), [
    e,
    t
  ];
}
const jf = {
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
class ao {
  fromJulianDay(e) {
    let n = e, r = n - wu, o = Math.floor(r / 146097), s = Bi(r, 146097), l = Math.floor(s / 36524), c = Bi(s, 36524), u = Math.floor(c / 1461), b = Bi(c, 1461), p = Math.floor(b / 365), y = o * 400 + l * 100 + u * 4 + p + (l !== 4 && p !== 4 ? 1 : 0), [x, f] = Vf(y), S = n - Go(x, f, 1, 1), w = 2;
    n < Go(x, f, 3, 1) ? w = 0 : oi(f) && (w = 1);
    let m = Math.floor(((S + w) * 12 + 373) / 367), i = n - Go(x, f, m, 1) + 1;
    return new Is(x, f, m, i);
  }
  toJulianDay(e) {
    return Go(e.era, e.year, e.month, e.day);
  }
  getDaysInMonth(e) {
    return jf[oi(e.year) ? "leapyear" : "standard"][e.month - 1];
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getMonthsInYear(e) {
    return 12;
  }
  getDaysInYear(e) {
    return oi(e.year) ? 366 : 365;
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
const Kf = {
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
function bs(t, e) {
  return e = Gr(e, t.calendar), t.era === e.era && t.year === e.year && t.month === e.month && t.day === e.day;
}
function Bl(t, e) {
  return e = Gr(e, t.calendar), t = gl(t), e = gl(e), t.era === e.era && t.year === e.year && t.month === e.month;
}
function Yf(t, e) {
  var n, r, o, s;
  return (s = (o = (n = t.isEqual) === null || n === void 0 ? void 0 : n.call(t, e)) !== null && o !== void 0 ? o : (r = e.isEqual) === null || r === void 0 ? void 0 : r.call(e, t)) !== null && s !== void 0 ? s : t.identifier === e.identifier;
}
function zf(t, e) {
  return bs(t, Wf(e));
}
function Pu(t, e, n) {
  let r = t.calendar.toJulianDay(t), o = Xf(e), s = Math.ceil(r + 1 - o) % 7;
  return s < 0 && (s += 7), s;
}
function Qf(t) {
  return La(Date.now(), t);
}
function Wf(t) {
  return np(Qf(t));
}
function xu(t, e) {
  return t.calendar.toJulianDay(t) - e.calendar.toJulianDay(e);
}
function Jf(t, e) {
  return zd(t) - zd(e);
}
function zd(t) {
  return t.hour * 36e5 + t.minute * 6e4 + t.second * 1e3 + t.millisecond;
}
let Ui = null;
function Ps() {
  return Ui == null && (Ui = new Intl.DateTimeFormat().resolvedOptions().timeZone), Ui;
}
function gl(t) {
  return t.subtract({
    days: t.day - 1
  });
}
function Gf(t) {
  return t.add({
    days: t.calendar.getDaysInMonth(t) - t.day
  });
}
const Qd = /* @__PURE__ */ new Map(), qi = /* @__PURE__ */ new Map();
function Zf(t) {
  if (Intl.Locale) {
    let n = Qd.get(t);
    return n || (n = new Intl.Locale(t).maximize().region, n && Qd.set(t, n)), n;
  }
  let e = t.split("-")[1];
  return e === "u" ? void 0 : e;
}
function Xf(t) {
  let e = qi.get(t);
  if (!e) {
    if (Intl.Locale) {
      let r = new Intl.Locale(t);
      if ("getWeekInfo" in r && (e = r.getWeekInfo(), e))
        return qi.set(t, e), e.firstDay;
    }
    let n = Zf(t);
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
      firstDay: n && Kf[n] || 0
    };
    qi.set(t, e);
  }
  return e.firstDay;
}
function Rs(t) {
  t = Gr(t, new ao());
  let e = Nl(t.era, t.year);
  return Ru(e, t.month, t.day, t.hour, t.minute, t.second, t.millisecond);
}
function Ru(t, e, n, r, o, s, l) {
  let c = /* @__PURE__ */ new Date();
  return c.setUTCHours(r, o, s, l), c.setUTCFullYear(t, e - 1, n), c.getTime();
}
function No(t, e) {
  if (e === "UTC") return 0;
  if (t > 0 && e === Ps()) return new Date(t).getTimezoneOffset() * -6e4;
  let { year: n, month: r, day: o, hour: s, minute: l, second: c } = Su(t, e);
  return Ru(n, r, o, s, l, c, 0) - Math.floor(t / 1e3) * 1e3;
}
const Wd = /* @__PURE__ */ new Map();
function Su(t, e) {
  let n = Wd.get(e);
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
  }), Wd.set(e, n));
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
const li = 864e5;
function ep(t, e) {
  let n = Rs(t), r = n - No(n - li, e), o = n - No(n + li, e);
  return Iu(t, e, r, o);
}
function Iu(t, e, n, r) {
  return (n === r ? [
    n
  ] : [
    n,
    r
  ]).filter((s) => tp(t, e, s));
}
function tp(t, e, n) {
  let r = Su(n, e);
  return t.year === r.year && t.month === r.month && t.day === r.day && t.hour === r.hour && t.minute === r.minute && t.second === r.second;
}
function Ma(t, e, n = "compatible") {
  let r = Ss(t);
  if (e === "UTC") return Rs(r);
  if (e === Ps() && n === "compatible") {
    r = Gr(r, new ao());
    let u = /* @__PURE__ */ new Date(), b = Nl(r.era, r.year);
    return u.setFullYear(b, r.month - 1, r.day), u.setHours(r.hour, r.minute, r.second, r.millisecond), u.getTime();
  }
  let o = Rs(r), s = No(o - li, e), l = No(o + li, e), c = Iu(r, e, o - s, o - l);
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
function _u(t, e, n = "compatible") {
  return new Date(Ma(t, e, n));
}
function La(t, e) {
  let n = No(t, e), r = new Date(t + n), o = r.getUTCFullYear(), s = r.getUTCMonth() + 1, l = r.getUTCDate(), c = r.getUTCHours(), u = r.getUTCMinutes(), b = r.getUTCSeconds(), p = r.getUTCMilliseconds();
  return new Ha(o < 1 ? "BC" : "AD", o < 1 ? -o + 1 : o, s, l, e, n, c, u, b, p);
}
function np(t) {
  return new Is(t.calendar, t.era, t.year, t.month, t.day);
}
function Ss(t, e) {
  let n = 0, r = 0, o = 0, s = 0;
  if ("timeZone" in t) ({ hour: n, minute: r, second: o, millisecond: s } = t);
  else if ("hour" in t && !e) return t;
  return e && ({ hour: n, minute: r, second: o, millisecond: s } = e), new os(t.calendar, t.era, t.year, t.month, t.day, n, r, o, s);
}
function Gr(t, e) {
  if (Yf(t.calendar, e)) return t;
  let n = e.fromJulianDay(t.calendar.toJulianDay(t)), r = t.copy();
  return r.calendar = e, r.era = n.era, r.year = n.year, r.month = n.month, r.day = n.day, Hs(r), r;
}
function rp(t, e, n) {
  if (t instanceof Ha)
    return t.timeZone === e ? t : sp(t, e);
  let r = Ma(t, e, n);
  return La(r, e);
}
function ap(t) {
  let e = Rs(t) - t.offset;
  return new Date(e);
}
function sp(t, e) {
  let n = Rs(t) - t.offset;
  return Gr(La(n, e), t.calendar);
}
const xo = 36e5;
function _i(t, e) {
  let n = t.copy(), r = "hour" in n ? dp(n, e) : 0;
  yl(n, e.years || 0), n.calendar.balanceYearMonth && n.calendar.balanceYearMonth(n, t), n.month += e.months || 0, ml(n), Eu(n), n.day += (e.weeks || 0) * 7, n.day += e.days || 0, n.day += r, op(n), n.calendar.balanceDate && n.calendar.balanceDate(n), n.year < 1 && (n.year = 1, n.month = 1, n.day = 1);
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
function yl(t, e) {
  var n, r;
  !((n = (r = t.calendar).isInverseEra) === null || n === void 0) && n.call(r, t) && (e = -e), t.year += e;
}
function ml(t) {
  for (; t.month < 1; )
    yl(t, -1), t.month += t.calendar.getMonthsInYear(t);
  let e = 0;
  for (; t.month > (e = t.calendar.getMonthsInYear(t)); )
    t.month -= e, yl(t, 1);
}
function op(t) {
  for (; t.day < 1; )
    t.month--, ml(t), t.day += t.calendar.getDaysInMonth(t);
  for (; t.day > t.calendar.getDaysInMonth(t); )
    t.day -= t.calendar.getDaysInMonth(t), t.month++, ml(t);
}
function Eu(t) {
  t.month = Math.max(1, Math.min(t.calendar.getMonthsInYear(t), t.month)), t.day = Math.max(1, Math.min(t.calendar.getDaysInMonth(t), t.day));
}
function Hs(t) {
  t.calendar.constrainDate && t.calendar.constrainDate(t), t.year = Math.max(1, Math.min(t.calendar.getYearsInEra(t), t.year)), Eu(t);
}
function Au(t) {
  let e = {};
  for (let n in t) typeof t[n] == "number" && (e[n] = -t[n]);
  return e;
}
function ku(t, e) {
  return _i(t, Au(e));
}
function Ul(t, e) {
  let n = t.copy();
  return e.era != null && (n.era = e.era), e.year != null && (n.year = e.year), e.month != null && (n.month = e.month), e.day != null && (n.day = e.day), Hs(n), n;
}
function di(t, e) {
  let n = t.copy();
  return e.hour != null && (n.hour = e.hour), e.minute != null && (n.minute = e.minute), e.second != null && (n.second = e.second), e.millisecond != null && (n.millisecond = e.millisecond), lp(n), n;
}
function ip(t) {
  t.second += Math.floor(t.millisecond / 1e3), t.millisecond = Zo(t.millisecond, 1e3), t.minute += Math.floor(t.second / 60), t.second = Zo(t.second, 60), t.hour += Math.floor(t.minute / 60), t.minute = Zo(t.minute, 60);
  let e = Math.floor(t.hour / 24);
  return t.hour = Zo(t.hour, 24), e;
}
function lp(t) {
  t.millisecond = Math.max(0, Math.min(t.millisecond, 1e3)), t.second = Math.max(0, Math.min(t.second, 59)), t.minute = Math.max(0, Math.min(t.minute, 59)), t.hour = Math.max(0, Math.min(t.hour, 23));
}
function Zo(t, e) {
  let n = t % e;
  return n < 0 && (n += e), n;
}
function dp(t, e) {
  return t.hour += e.hours || 0, t.minute += e.minutes || 0, t.second += e.seconds || 0, t.millisecond += e.milliseconds || 0, ip(t);
}
function ql(t, e, n, r) {
  let o = t.copy();
  switch (e) {
    case "era": {
      let c = t.calendar.getEras(), u = c.indexOf(t.era);
      if (u < 0) throw new Error("Invalid era: " + t.era);
      u = rs(u, n, 0, c.length - 1, r?.round), o.era = c[u], Hs(o);
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
  return t.calendar.balanceDate && t.calendar.balanceDate(o), Hs(o), o;
}
function Du(t, e, n, r) {
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
function Tu(t, e) {
  let n;
  if (e.years != null && e.years !== 0 || e.months != null && e.months !== 0 || e.weeks != null && e.weeks !== 0 || e.days != null && e.days !== 0) {
    let o = _i(Ss(t), {
      years: e.years,
      months: e.months,
      weeks: e.weeks,
      days: e.days
    });
    n = Ma(o, t.timeZone);
  } else
    n = Rs(t) - t.offset;
  n += e.milliseconds || 0, n += (e.seconds || 0) * 1e3, n += (e.minutes || 0) * 6e4, n += (e.hours || 0) * 36e5;
  let r = La(n, t.timeZone);
  return Gr(r, t.calendar);
}
function cp(t, e) {
  return Tu(t, Au(e));
}
function up(t, e, n, r) {
  switch (e) {
    case "hour": {
      let o = 0, s = 23;
      if (r?.hourCycle === 12) {
        let S = t.hour >= 12;
        o = S ? 12 : 0, s = S ? 23 : 11;
      }
      let l = Ss(t), c = Gr(di(l, {
        hour: o
      }), new ao()), u = [
        Ma(c, t.timeZone, "earlier"),
        Ma(c, t.timeZone, "later")
      ].filter((S) => La(S, t.timeZone).day === c.day)[0], b = Gr(di(l, {
        hour: s
      }), new ao()), p = [
        Ma(b, t.timeZone, "earlier"),
        Ma(b, t.timeZone, "later")
      ].filter((S) => La(S, t.timeZone).day === b.day).pop(), y = Rs(t) - t.offset, x = Math.floor(y / xo), f = y % xo;
      return y = rs(x, n, Math.floor(u / xo), Math.floor(p / xo), r?.round) * xo + f, Gr(La(y, t.timeZone), t.calendar);
    }
    case "minute":
    case "second":
    case "millisecond":
      return Du(t, e, n, r);
    case "era":
    case "year":
    case "month":
    case "day": {
      let o = ql(Ss(t), e, n, r), s = Ma(o, t.timeZone);
      return Gr(La(s, t.timeZone), t.calendar);
    }
    default:
      throw new Error("Unsupported field " + e);
  }
}
function hp(t, e, n) {
  let r = Ss(t), o = di(Ul(r, e), e);
  if (o.compare(r) === 0) return t;
  let s = Ma(o, t.timeZone, n);
  return Gr(La(s, t.timeZone), t.calendar);
}
const fp = /^([+-]\d{6}|\d{4})-(\d{2})-(\d{2})$/, pp = /^([+-]\d{6}|\d{4})-(\d{2})-(\d{2})(?:T(\d{2}))?(?::(\d{2}))?(?::(\d{2}))?(\.\d+)?$/, vp = /^([+-]\d{6}|\d{4})-(\d{2})-(\d{2})(?:T(\d{2}))?(?::(\d{2}))?(?::(\d{2}))?(\.\d+)?(?:([+-]\d{2})(?::?(\d{2}))?(?::?(\d{2}))?)?\[(.*?)\]$/, Mu = /^([+-]\d{6}|\d{4})-(\d{2})-(\d{2})(?:T(\d{2}))?(?::(\d{2}))?(?::(\d{2}))?(\.\d+)?(?:(?:([+-]\d{2})(?::?(\d{2}))?)|Z)$/;
function Vl(t) {
  let e = t.match(fp);
  if (!e)
    throw Mu.test(t) ? new Error(`Invalid ISO 8601 date string: ${t}. Use parseAbsolute() instead.`) : new Error("Invalid ISO 8601 date string: " + t);
  let n = new Is(Wn(e[1], 0, 9999), Wn(e[2], 1, 12), 1);
  return n.day = Wn(e[3], 1, n.calendar.getDaysInMonth(n)), n;
}
function Ou(t) {
  let e = t.match(pp);
  if (!e)
    throw Mu.test(t) ? new Error(`Invalid ISO 8601 date time string: ${t}. Use parseAbsolute() instead.`) : new Error("Invalid ISO 8601 date time string: " + t);
  let n = Wn(e[1], -9999, 9999), r = n < 1 ? "BC" : "AD", o = new os(r, n < 1 ? -n + 1 : n, Wn(e[2], 1, 12), 1, e[4] ? Wn(e[4], 0, 23) : 0, e[5] ? Wn(e[5], 0, 59) : 0, e[6] ? Wn(e[6], 0, 59) : 0, e[7] ? Wn(e[7], 0, 1 / 0) * 1e3 : 0);
  return o.day = Wn(e[3], 0, o.calendar.getDaysInMonth(o)), o;
}
function Lu(t, e) {
  let n = t.match(vp);
  if (!n) throw new Error("Invalid ISO 8601 date time string: " + t);
  let r = Wn(n[1], -9999, 9999), o = r < 1 ? "BC" : "AD", s = new Ha(o, r < 1 ? -r + 1 : r, Wn(n[2], 1, 12), 1, n[11], 0, n[4] ? Wn(n[4], 0, 23) : 0, n[5] ? Wn(n[5], 0, 59) : 0, n[6] ? Wn(n[6], 0, 59) : 0, n[7] ? Wn(n[7], 0, 1 / 0) * 1e3 : 0);
  s.day = Wn(n[3], 0, s.calendar.getDaysInMonth(s));
  let l = Ss(s), c;
  if (n[8]) {
    let p = Wn(n[8], -23, 23);
    var u, b;
    if (s.offset = Math.sign(p) * (Math.abs(p) * 36e5 + Wn((u = n[9]) !== null && u !== void 0 ? u : "0", 0, 59) * 6e4 + Wn((b = n[10]) !== null && b !== void 0 ? b : "0", 0, 59) * 1e3), c = Rs(s) - s.offset, !ep(l, s.timeZone).includes(c)) throw new Error(`Offset ${Hu(s.offset)} is invalid for ${jl(s)} in ${s.timeZone}`);
  } else
    c = Ma(Ss(l), s.timeZone, e);
  return La(c, s.timeZone);
}
function Wn(t, e, n) {
  let r = Number(t);
  if (r < e || r > n) throw new RangeError(`Value out of range: ${e} <= ${r} <= ${n}`);
  return r;
}
function gp(t) {
  return `${String(t.hour).padStart(2, "0")}:${String(t.minute).padStart(2, "0")}:${String(t.second).padStart(2, "0")}${t.millisecond ? String(t.millisecond / 1e3).slice(1) : ""}`;
}
function Fu(t) {
  let e = Gr(t, new ao()), n;
  return e.era === "BC" ? n = e.year === 1 ? "0000" : "-" + String(Math.abs(1 - e.year)).padStart(6, "00") : n = String(e.year).padStart(4, "0"), `${n}-${String(e.month).padStart(2, "0")}-${String(e.day).padStart(2, "0")}`;
}
function jl(t) {
  return `${Fu(t)}T${gp(t)}`;
}
function Hu(t) {
  let e = Math.sign(t) < 0 ? "-" : "+";
  t = Math.abs(t);
  let n = Math.floor(t / 36e5), r = Math.floor(t % 36e5 / 6e4), o = Math.floor(t % 36e5 % 6e4 / 1e3), s = `${e}${String(n).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
  return o !== 0 && (s += `:${String(o).padStart(2, "0")}`), s;
}
function yp(t) {
  return `${jl(t)}${Hu(t.offset)}[${t.timeZone}]`;
}
function mp(t, e) {
  if (e.has(t))
    throw new TypeError("Cannot initialize the same private elements twice on an object");
}
function Kl(t, e, n) {
  mp(t, e), e.set(t, n);
}
function Yl(t) {
  let e = typeof t[0] == "object" ? t.shift() : new ao(), n;
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
var bp = /* @__PURE__ */ new WeakMap();
class Is {
  /** Returns a copy of this date. */
  copy() {
    return this.era ? new Is(this.calendar, this.era, this.year, this.month, this.day) : new Is(this.calendar, this.year, this.month, this.day);
  }
  /** Returns a new `CalendarDate` with the given duration added to it. */
  add(e) {
    return _i(this, e);
  }
  /** Returns a new `CalendarDate` with the given duration subtracted from it. */
  subtract(e) {
    return ku(this, e);
  }
  /** Returns a new `CalendarDate` with the given fields set to the provided values. Other fields will be constrained accordingly. */
  set(e) {
    return Ul(this, e);
  }
  /**
  * Returns a new `CalendarDate` with the given field adjusted by a specified amount.
  * When the resulting value reaches the limits of the field, it wraps around.
  */
  cycle(e, n, r) {
    return ql(this, e, n, r);
  }
  /** Converts the date to a native JavaScript Date object, with the time set to midnight in the given time zone. */
  toDate(e) {
    return _u(this, e);
  }
  /** Converts the date to an ISO 8601 formatted string. */
  toString() {
    return Fu(this);
  }
  /** Compares this date with another. A negative result indicates that this date is before the given one, and a positive date indicates that it is after. */
  compare(e) {
    return xu(this, e);
  }
  constructor(...e) {
    Kl(this, bp, {
      writable: !0,
      value: void 0
    });
    let [n, r, o, s, l] = Yl(e);
    this.calendar = n, this.era = r, this.year = o, this.month = s, this.day = l, Hs(this);
  }
}
var Cp = /* @__PURE__ */ new WeakMap();
class os {
  /** Returns a copy of this date. */
  copy() {
    return this.era ? new os(this.calendar, this.era, this.year, this.month, this.day, this.hour, this.minute, this.second, this.millisecond) : new os(this.calendar, this.year, this.month, this.day, this.hour, this.minute, this.second, this.millisecond);
  }
  /** Returns a new `CalendarDateTime` with the given duration added to it. */
  add(e) {
    return _i(this, e);
  }
  /** Returns a new `CalendarDateTime` with the given duration subtracted from it. */
  subtract(e) {
    return ku(this, e);
  }
  /** Returns a new `CalendarDateTime` with the given fields set to the provided values. Other fields will be constrained accordingly. */
  set(e) {
    return Ul(di(this, e), e);
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
        return ql(this, e, n, r);
      default:
        return Du(this, e, n, r);
    }
  }
  /** Converts the date to a native JavaScript Date object in the given time zone. */
  toDate(e, n) {
    return _u(this, e, n);
  }
  /** Converts the date to an ISO 8601 formatted string. */
  toString() {
    return jl(this);
  }
  /** Compares this date with another. A negative result indicates that this date is before the given one, and a positive date indicates that it is after. */
  compare(e) {
    let n = xu(this, e);
    return n === 0 ? Jf(this, Ss(e)) : n;
  }
  constructor(...e) {
    Kl(this, Cp, {
      writable: !0,
      value: void 0
    });
    let [n, r, o, s, l] = Yl(e);
    this.calendar = n, this.era = r, this.year = o, this.month = s, this.day = l, this.hour = e.shift() || 0, this.minute = e.shift() || 0, this.second = e.shift() || 0, this.millisecond = e.shift() || 0, Hs(this);
  }
}
var wp = /* @__PURE__ */ new WeakMap();
class Ha {
  /** Returns a copy of this date. */
  copy() {
    return this.era ? new Ha(this.calendar, this.era, this.year, this.month, this.day, this.timeZone, this.offset, this.hour, this.minute, this.second, this.millisecond) : new Ha(this.calendar, this.year, this.month, this.day, this.timeZone, this.offset, this.hour, this.minute, this.second, this.millisecond);
  }
  /** Returns a new `ZonedDateTime` with the given duration added to it. */
  add(e) {
    return Tu(this, e);
  }
  /** Returns a new `ZonedDateTime` with the given duration subtracted from it. */
  subtract(e) {
    return cp(this, e);
  }
  /** Returns a new `ZonedDateTime` with the given fields set to the provided values. Other fields will be constrained accordingly. */
  set(e, n) {
    return hp(this, e, n);
  }
  /**
  * Returns a new `ZonedDateTime` with the given field adjusted by a specified amount.
  * When the resulting value reaches the limits of the field, it wraps around.
  */
  cycle(e, n, r) {
    return up(this, e, n, r);
  }
  /** Converts the date to a native JavaScript Date object. */
  toDate() {
    return ap(this);
  }
  /** Converts the date to an ISO 8601 formatted string, including the UTC offset and time zone identifier. */
  toString() {
    return yp(this);
  }
  /** Converts the date to an ISO 8601 formatted string in UTC. */
  toAbsoluteString() {
    return this.toDate().toISOString();
  }
  /** Compares this date with another. A negative result indicates that this date is before the given one, and a positive date indicates that it is after. */
  compare(e) {
    return this.toDate().getTime() - rp(e, this.timeZone).toDate().getTime();
  }
  constructor(...e) {
    Kl(this, wp, {
      writable: !0,
      value: void 0
    });
    let [n, r, o, s, l] = Yl(e), c = e.shift(), u = e.shift();
    this.calendar = n, this.era = r, this.year = o, this.month = s, this.day = l, this.timeZone = c, this.offset = u, this.hour = e.shift() || 0, this.minute = e.shift() || 0, this.second = e.shift() || 0, this.millisecond = e.shift() || 0, Hs(this);
  }
}
let Vi = /* @__PURE__ */ new Map();
class Da {
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
    return Rp() && (this.resolvedHourCycle || (this.resolvedHourCycle = Sp(e.locale, this.options)), e.hourCycle = this.resolvedHourCycle, e.hour12 = this.resolvedHourCycle === "h11" || this.resolvedHourCycle === "h12"), e.calendar === "ethiopic-amete-alem" && (e.calendar = "ethioaa"), e;
  }
  constructor(e, n = {}) {
    this.formatter = $u(e, n), this.options = n;
  }
}
const Pp = {
  true: {
    // Only Japanese uses the h11 style for 12 hour time. All others use h12.
    ja: "h11"
  },
  false: {}
};
function $u(t, e = {}) {
  if (typeof e.hour12 == "boolean" && xp()) {
    e = {
      ...e
    };
    let o = Pp[String(e.hour12)][t.split("-")[0]], s = e.hour12 ? "h12" : "h23";
    e.hourCycle = o ?? s, delete e.hour12;
  }
  let n = t + (e ? Object.entries(e).sort((o, s) => o[0] < s[0] ? -1 : 1).join() : "");
  if (Vi.has(n)) return Vi.get(n);
  let r = new Intl.DateTimeFormat(t, e);
  return Vi.set(n, r), r;
}
let ji = null;
function xp() {
  return ji == null && (ji = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    hour12: !1
  }).format(new Date(2020, 2, 3, 0)) === "24"), ji;
}
let Ki = null;
function Rp() {
  return Ki == null && (Ki = new Intl.DateTimeFormat("fr", {
    hour: "numeric",
    hour12: !1
  }).resolvedOptions().hourCycle === "h12"), Ki;
}
function Sp(t, e) {
  if (!e.timeStyle && !e.hour) return;
  t = t.replace(/(-u-)?-nu-[a-zA-Z0-9]+/, ""), t += (t.includes("-u-") ? "" : "-u") + "-nu-latn";
  let n = $u(t, {
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
function Ip(t) {
  if (!_s || !t)
    return null;
  let e = t.querySelector("[data-bits-announcer]");
  const n = (o) => {
    const s = t.createElement("div");
    return s.role = "log", s.ariaLive = o, s.setAttribute("aria-relevant", "additions"), s;
  };
  if (!as(e)) {
    const o = t.createElement("div");
    o.style.cssText = Mh, o.setAttribute("data-bits-announcer", ""), o.appendChild(n("assertive")), o.appendChild(n("polite")), e = o, t.body.insertBefore(e, t.body.firstChild);
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
function ci(t) {
  const e = Ip(t);
  function n(r, o = "assertive", s = 7500) {
    if (!e || !_s || !t)
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
const _p = {
  defaultValue: void 0,
  granularity: "day"
};
function Ep(t) {
  const e = { ..._p, ...t }, { defaultValue: n, granularity: r, minValue: o, maxValue: s } = e;
  if (Array.isArray(n) && n.length)
    return n[n.length - 1];
  if (n && !Array.isArray(n))
    return n;
  {
    let l = /* @__PURE__ */ new Date();
    o && l < o.toDate(Ps()) ? l = o.toDate(Ps()) : s && l > s.toDate(Ps()) && (l = s.toDate(Ps()));
    const c = l.getFullYear(), u = l.getMonth() + 1, b = l.getDate();
    return ["hour", "minute", "second"].includes(r ?? "day") ? new os(c, u, b, 0, 0, 0) : new Is(c, u, b);
  }
}
function Nu(t, e) {
  let n;
  return e instanceof Ha ? n = Lu(t) : e instanceof os ? n = Ou(t) : n = Vl(t), n.calendar !== e.calendar ? Gr(n, e.calendar) : n;
}
function jr(t, e = Ps()) {
  return t instanceof Ha ? t.toDate() : t.toDate(e);
}
function Ap(t) {
  if (t instanceof Is)
    return "date";
  if (t instanceof os)
    return "datetime";
  if (t instanceof Ha)
    return "zoneddatetime";
  throw new Error("Unknown date type");
}
function kp(t, e) {
  switch (e) {
    case "date":
      return Vl(t);
    case "datetime":
      return Ou(t);
    case "zoneddatetime":
      return Lu(t);
    default:
      throw new Error(`Unknown date type: ${e}`);
  }
}
function Dp(t) {
  return t instanceof os;
}
function zl(t) {
  return t instanceof Ha;
}
function ui(t) {
  return Dp(t) || zl(t);
}
function Bo(t) {
  if (t instanceof Date) {
    const e = t.getFullYear(), n = t.getMonth() + 1;
    return new Date(e, n, 0).getDate();
  } else
    return t.set({ day: 100 }).day;
}
function $s(t, e) {
  return t.compare(e) < 0;
}
function Tp(t, e) {
  return t.compare(e) > 0;
}
function Jd(t, e, n) {
  const r = Pu(t, n);
  return e > r ? t.subtract({ days: r + 7 - e }) : e === r ? t : t.subtract({ days: r - e });
}
function Gd(t, e, n) {
  const r = Pu(t, n), o = e === 0 ? 6 : e - 1;
  return r === o ? t : r > o ? t.add({ days: 7 - r + o }) : t.add({ days: o - r });
}
const Ei = ["day", "month", "year"], Ql = ["hour", "minute", "second", "dayPeriod"], Mp = ["literal", "timeZoneName"], Vo = [
  ...Ei,
  ...Ql
], Op = [
  ...Vo,
  ...Mp
], Lp = [
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
], Fp = ["year", "month", "day"], Yi = {
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
function Hp(t) {
  if (Zd(t))
    return Yi[t];
  {
    const e = Up(t);
    return Zd(e) ? Yi[e] : Yi.en;
  }
}
function zi(t, e, n) {
  return $p(t) ? Hp(n)[t] : Bp(t) ? e : Np(t) ? "––" : "";
}
function Zd(t) {
  return Lp.includes(t);
}
function $p(t) {
  return Fp.includes(t);
}
function Np(t) {
  return t === "hour" || t === "minute" || t === "second";
}
function Bp(t) {
  return t === "era" || t === "dayPeriod";
}
function Up(t) {
  return Intl.Locale ? new Intl.Locale(t).language : t.split("-")[0];
}
function Qi(t) {
  const e = ["hour", "minute", "second"], n = Vo.map((r) => r === "dayPeriod" ? [r, "AM"] : [r, null]).filter(([r]) => r === "literal" || r === null ? !1 : t === "day" ? !e.includes(r) : !0);
  return Object.fromEntries(n);
}
function qp(t) {
  const { segmentValues: e, formatter: n, locale: r, dateRef: o } = t, s = Object.keys(e).reduce((c, u) => {
    if (!Bu(u))
      return c;
    if ("hour" in e && u === "dayPeriod") {
      const b = e[u];
      Cs(b) ? c[u] = zi(u, "AM", r) : c[u] = b;
    } else
      c[u] = l(u);
    return c;
  }, {});
  function l(c) {
    if ("hour" in e) {
      const u = e[c], b = typeof u == "string" && u?.startsWith("0"), p = u !== null ? Number.parseInt(u) : null;
      if (u === "0" && c !== "year")
        return "0";
      if (!Cs(u) && !Cs(p)) {
        const y = n.part(o.set({ [c]: u }), c, {
          hourCycle: t.hourCycle === 24 ? "h23" : void 0
        }), x = t.hourCycle === 12 || t.hourCycle === void 0 && qu(r) === 12;
        if (c === "hour" && x) {
          if (p > 12) {
            const f = p - 12;
            return f === 0 ? "12" : f < 10 ? `0${f}` : `${f}`;
          }
          return p === 0 ? "12" : p < 10 ? `0${p}` : `${p}`;
        }
        return c === "year" ? `${u}` : b && y.length === 1 ? `0${y}` : y;
      } else
        return zi(c, "", r);
    } else {
      if (Ai(c)) {
        const u = e[c], b = typeof u == "string" && u?.startsWith("0");
        if (u === "0")
          return "0";
        if (Cs(u))
          return zi(c, "", r);
        {
          const p = n.part(o.set({ [c]: u }), c);
          return c === "year" ? `${u}` : b && p.length === 1 ? `0${p}` : p;
        }
      }
      return "";
    }
  }
  return s;
}
function Vp(t) {
  const { granularity: e, dateRef: n, formatter: r, contentObj: o, hideTimeZone: s, hourCycle: l } = t;
  return r.toParts(n, Kp(e, l)).map((b) => ["literal", "dayPeriod", "timeZoneName", null].includes(b.type) || !Bu(b.type) ? {
    part: b.type,
    value: b.value
  } : {
    part: b.type,
    value: o[b.type]
  }).filter((b) => !(Cs(b.part) || Cs(b.value) || b.part === "timeZoneName" && (!zl(n) || s)));
}
function jp(t) {
  const e = qp(t), n = Vp({
    contentObj: e,
    ...t
  });
  return {
    obj: e,
    arr: n
  };
}
function Kp(t, e) {
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
function Xd() {
  return Vo.reduce((t, e) => (t[e] = {
    lastKeyZero: !1,
    hasLeftFocus: !0,
    updating: null
  }, t), {});
}
function Ai(t) {
  return Ei.includes(t);
}
function Bu(t) {
  return Vo.includes(t);
}
function Yp(t) {
  return Op.includes(t);
}
function Uu(t) {
  return !_s || !t ? [] : Gl(t).map((n) => n.dataset.segment).filter((n) => Vo.includes(n));
}
function zp(t) {
  const { segmentObj: e, fieldNode: n, dateRef: r } = t, o = Uu(n);
  let s = r;
  for (const l of o)
    if ("hour" in e) {
      const c = e[l];
      if (Cs(c))
        continue;
      s = s.set({ [l]: e[l] });
    } else if (Ai(l)) {
      const c = e[l];
      if (Cs(c))
        continue;
      s = s.set({ [l]: e[l] });
    }
  return s;
}
function Qp(t, e) {
  const n = Uu(e);
  for (const r of n)
    if ("hour" in t) {
      if (t[r] === null)
        return !1;
    } else if (Ai(r) && t[r] === null)
      return !1;
  return !0;
}
function Wp(t) {
  return typeof t != "object" || t === null ? !1 : Object.entries(t).every(([e, n]) => (Ql.includes(e) || Ei.includes(e)) && (e === "dayPeriod" ? n === "AM" || n === "PM" || n === null : typeof n == "string" || typeof n == "number" || n === null));
}
function Jp(t, e) {
  return e || (ui(t) ? "minute" : "day");
}
function Wl(t) {
  return !!([
    zc,
    mi,
    bi,
    Uo,
    qo,
    Qc,
    Wc
  ].includes(t) || Ci(t));
}
function Gp(t, e) {
  if (!_s)
    return !1;
  const n = Gl(e);
  return n.length ? n[0].id === t : !1;
}
function Zp(t) {
  const { id: e, formatter: n, value: r, doc: o } = t;
  if (!_s)
    return;
  const s = n.selectedDate(r), l = o.getElementById(e);
  if (l)
    l.innerText = `Selected Date: ${s}`;
  else {
    const c = o.createElement("div");
    c.style.cssText = Yc({
      display: "none"
    }), c.id = e, c.innerText = `Selected Date: ${s}`, o.body.appendChild(c);
  }
}
function Xp(t, e) {
  if (!_s)
    return;
  const n = e.getElementById(t);
  n && e.body.removeChild(n);
}
function qu(t) {
  return new Intl.DateTimeFormat(t, { hour: "numeric" }).formatToParts(/* @__PURE__ */ new Date("2023-01-01T13:00:00")).find((o) => o.type === "hour")?.value === "1" ? 12 : 24;
}
function jo(t, e) {
  const n = t.currentTarget;
  if (!as(n))
    return;
  const { prev: r, next: o } = Jl(n, e);
  if (t.key === Uo) {
    if (!r)
      return;
    r.focus();
  } else if (t.key === qo) {
    if (!o)
      return;
    o.focus();
  }
}
function ev(t, e) {
  const n = e.indexOf(t);
  if (n === e.length - 1 || n === -1)
    return null;
  const r = n + 1;
  return e[r];
}
function tv(t, e) {
  const n = e.indexOf(t);
  if (n === 0 || n === -1)
    return null;
  const r = n - 1;
  return e[r];
}
function Jl(t, e) {
  const n = Gl(e);
  return n.length ? {
    next: ev(t, n),
    prev: tv(t, n)
  } : {
    next: null,
    prev: null
  };
}
function Vu(t, e) {
  const n = t.currentTarget;
  if (!as(n))
    return;
  const { next: r } = Jl(n, e);
  r && r.focus();
}
function ju(t, e) {
  const n = t.currentTarget;
  if (!as(n))
    return;
  const { prev: r } = Jl(n, e);
  r && r.focus();
}
function Ko(t) {
  return t === qo || t === Uo;
}
function Gl(t) {
  return t ? Array.from(t.querySelectorAll("[data-segment]")).filter((n) => {
    if (!as(n))
      return !1;
    const r = n.dataset.segment;
    return r === "trigger" ? !0 : !(!Yp(r) || r === "literal");
  }) : [];
}
const nv = {
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric"
};
function Ku(t) {
  let e = t.initialLocale;
  function n(f) {
    e = f;
  }
  function r() {
    return e;
  }
  function o(f, S) {
    return new Da(e, S).format(f);
  }
  function s(f, S = !0) {
    return ui(f) && S ? o(jr(f), {
      dateStyle: "long",
      timeStyle: "long"
    }) : o(jr(f), {
      dateStyle: "long"
    });
  }
  function l(f) {
    if (typeof t.monthFormat.current != "function" && typeof t.yearFormat.current != "function")
      return new Da(e, {
        month: t.monthFormat.current,
        year: t.yearFormat.current
      }).format(f);
    const S = typeof t.monthFormat.current == "function" ? t.monthFormat.current(f.getMonth() + 1) : new Da(e, { month: t.monthFormat.current }).format(f), w = typeof t.yearFormat.current == "function" ? t.yearFormat.current(f.getFullYear()) : new Da(e, { year: t.yearFormat.current }).format(f);
    return `${S} ${w}`;
  }
  function c(f) {
    return new Da(e, { month: "long" }).format(f);
  }
  function u(f) {
    return new Da(e, { year: "numeric" }).format(f);
  }
  function b(f, S) {
    return zl(f) ? new Da(e, {
      ...S,
      timeZone: f.timeZone
    }).formatToParts(jr(f)) : new Da(e, S).formatToParts(jr(f));
  }
  function p(f, S = "narrow") {
    return new Da(e, { weekday: S }).format(f);
  }
  function y(f, S = void 0) {
    return new Da(e, {
      hour: "numeric",
      minute: "numeric",
      hourCycle: S === 24 ? "h23" : void 0
    }).formatToParts(f).find((i) => i.type === "dayPeriod")?.value === "PM" ? "PM" : "AM";
  }
  function x(f, S, w = {}) {
    const m = { ...nv, ...w }, O = b(f, m).find((J) => J.type === S);
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
    dayOfWeek: p
  };
}
function rv(t) {
  return !(!as(t) || !t.hasAttribute("data-bits-day"));
}
function ec(t, e) {
  const n = [];
  let r = t.add({ days: 1 });
  const o = e;
  for (; r.compare(o) < 0; )
    n.push(r), r = r.add({ days: 1 });
  return n;
}
function Wi(t) {
  const { dateObj: e, weekStartsOn: n, fixedWeeks: r, locale: o } = t, s = Bo(e), l = Array.from({ length: s }, (m, i) => e.set({ day: i + 1 })), c = gl(e), u = Gf(e), b = n !== void 0 ? Jd(c, n, "en-US") : Jd(c, 0, o), p = n !== void 0 ? Gd(u, n, "en-US") : Gd(u, 0, o), y = ec(b.subtract({ days: 1 }), c), x = ec(u, p.add({ days: 1 })), f = y.length + l.length + x.length;
  if (r && f < 42) {
    const m = 42 - f;
    let i = x[x.length - 1];
    i || (i = e.add({ months: 1 }).set({ day: 1 }));
    let O = m;
    x.length === 0 && (O = m - 1, x.push(i));
    const J = Array.from({ length: O }, (N, Z) => {
      const ge = Z + 1;
      return i.add({ days: ge });
    });
    x.push(...J);
  }
  const S = y.concat(l, x), w = Oh(S, 7);
  return { value: e, dates: S, weeks: w };
}
function Yo(t) {
  const { numberOfMonths: e, dateObj: n, ...r } = t, o = [];
  if (!e || e === 1)
    return o.push(Wi({ ...r, dateObj: n })), o;
  o.push(Wi({ ...r, dateObj: n }));
  for (let s = 1; s < e; s++) {
    const l = n.add({ months: s });
    o.push(Wi({ ...r, dateObj: l }));
  }
  return o;
}
function Ji(t) {
  return t ? Array.from(t.querySelectorAll("[data-bits-day]:not([data-disabled]):not([data-outside-visible-months])")).filter((n) => as(n)) : [];
}
function tc(t, e) {
  const n = t.getAttribute("data-value");
  n && (e.current = Nu(n, e.current));
}
function av({
  node: t,
  add: e,
  placeholder: n,
  calendarNode: r,
  isPrevButtonDisabled: o,
  isNextButtonDisabled: s,
  months: l,
  numberOfMonths: c
}) {
  const u = Ji(r);
  if (!u.length) return;
  const p = u.indexOf(t) + e;
  if (Oi(p, u)) {
    const y = u[p];
    return tc(y, n), y.focus();
  }
  if (p < 0) {
    if (o) return;
    const y = l[0]?.value;
    if (!y) return;
    n.current = y.subtract({ months: c }), Ld(() => {
      const x = Ji(r);
      if (!x.length) return;
      const f = x.length - Math.abs(p);
      if (Oi(f, x)) {
        const S = x[f];
        return tc(S, n), S.focus();
      }
    });
  }
  if (p >= u.length) {
    if (s) return;
    const y = l[0]?.value;
    if (!y) return;
    n.current = y.add({ months: c }), Ld(() => {
      const x = Ji(r);
      if (!x.length) return;
      const f = p - u.length;
      if (Oi(f, x))
        return x[f].focus();
    });
  }
}
const nc = [
  bi,
  mi,
  Uo,
  qo
], rc = [zc, Wc];
function sv({ event: t, handleCellClick: e, shiftFocus: n, placeholderValue: r }) {
  const o = t.target;
  if (!rv(o) || !nc.includes(t.key) && !rc.includes(t.key)) return;
  t.preventDefault();
  const s = {
    [bi]: 7,
    [mi]: -7,
    [Uo]: -1,
    [qo]: 1
  };
  if (nc.includes(t.key)) {
    const l = s[t.key];
    l !== void 0 && n(o, l);
  }
  if (rc.includes(t.key)) {
    const l = o.getAttribute("data-value");
    if (!l) return;
    e(t, Nu(l, r));
  }
}
function ov({
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
      const b = u.add({ months: 1 }), p = Yo({
        dateObj: b,
        weekStartsOn: o,
        locale: s,
        fixedWeeks: l,
        numberOfMonths: n
      });
      c(b), e(p);
    }
}
function iv({
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
      const b = u.subtract({ months: 1 }), p = Yo({
        dateObj: b,
        weekStartsOn: o,
        locale: s,
        fixedWeeks: l,
        numberOfMonths: n
      });
      c(b), e(p);
    }
}
function lv({ months: t, formatter: e, weekdayFormat: n }) {
  if (!t.length) return [];
  const o = t[0].weeks[0];
  return o ? o.map((s) => e.dayOfWeek(jr(s), n)) : [];
}
function dv(t) {
  ze(() => {
    const e = t.weekStartsOn.current, n = t.locale.current, r = t.fixedWeeks.current, o = t.numberOfMonths.current;
    ca(() => {
      const s = t.placeholder.current;
      if (!s) return;
      const l = { weekStartsOn: e, locale: n, fixedWeeks: r, numberOfMonths: o };
      t.setMonths(Yo({ ...l, dateObj: s }));
    });
  });
}
function cv({ calendarNode: t, label: e, accessibleHeadingId: n }) {
  const r = Jc(t), o = r.createElement("div");
  o.style.cssText = Yc({
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
function uv({
  placeholder: t,
  getVisibleMonths: e,
  weekStartsOn: n,
  locale: r,
  fixedWeeks: o,
  numberOfMonths: s,
  setMonths: l
}) {
  ze(() => {
    t.current, ca(() => {
      if (e().some((u) => Bl(u, t.current)))
        return;
      const c = {
        weekStartsOn: n.current,
        locale: r.current,
        fixedWeeks: o.current,
        numberOfMonths: s.current
      };
      l(Yo({ ...c, dateObj: t.current }));
    });
  });
}
function hv({ maxValue: t, months: e, disabled: n }) {
  if (!t || !e.length) return !1;
  if (n) return !0;
  const r = e[e.length - 1]?.value;
  if (!r) return !1;
  const o = r.add({ months: 1 }).set({ day: 1 });
  return Tp(o, t);
}
function fv({ minValue: t, months: e, disabled: n }) {
  if (!t || !e.length) return !1;
  if (n) return !0;
  const r = e[0]?.value;
  if (!r) return !1;
  const o = r.subtract({ months: 1 }).set({ day: 35 });
  return $s(o, t);
}
function pv({ months: t, locale: e, formatter: n }) {
  if (!t.length) return "";
  if (e !== n.getLocale() && n.setLocale(e), t.length === 1) {
    const p = jr(t[0].value);
    return `${n.fullMonthAndYear(p)}`;
  }
  const r = jr(t[0].value), o = jr(t[t.length - 1].value), s = n.fullMonth(r), l = n.fullMonth(o), c = n.fullYear(r), u = n.fullYear(o);
  return c === u ? `${s} - ${l} ${u}` : `${s} ${c} - ${l} ${u}`;
}
function vv({ fullCalendarLabel: t, id: e, isInvalid: n, disabled: r, readonly: o }) {
  return {
    id: e,
    role: "application",
    "aria-label": t,
    "data-invalid": en(n),
    "data-disabled": en(r),
    "data-readonly": en(o)
  };
}
function gv(t) {
  const n = Jc(t.target).querySelector("[data-bits-day][data-focused]");
  n && (t.preventDefault(), n?.focus());
}
function yv(t) {
  if (!_s) return;
  const e = Array.from(t.querySelectorAll("[data-bits-day]:not([aria-disabled=true])"));
  if (e.length === 0) return;
  const n = e[0], r = n?.getAttribute("data-value"), o = n?.getAttribute("data-type");
  if (!(!r || !o))
    return kp(r, o);
}
function mv({
  ref: t,
  placeholder: e,
  defaultPlaceholder: n,
  minValue: r,
  maxValue: o,
  isDateDisabled: s
}) {
  function l(c) {
    return !!(s.current(c) || r.current && $s(c, r.current) || o.current && $s(o.current, c));
  }
  ro(() => t.current, () => {
    t.current && e.current && bs(e.current, n) && l(n) && (e.current = yv(t.current) ?? n);
  });
}
function bv(t, e) {
  return !t || !e ? t : ui(t) && ui(e) ? t.set({
    hour: e.hour,
    minute: e.minute,
    millisecond: e.millisecond,
    second: e.second
  }) : t;
}
const Cv = Gc({
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
function wv(t) {
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
const Ca = new wi("Calendar.Root | RangeCalender.Root");
class Zl {
  static create(e) {
    return Ca.set(new Zl(e));
  }
  opts;
  #e = R(() => this.months.map((e) => e.value));
  get visibleMonths() {
    return a(this.#e);
  }
  set visibleMonths(e) {
    g(this.#e, e);
  }
  formatter;
  accessibleHeadingId = Zc();
  domContext;
  attachment;
  #t = be(lr([]));
  get months() {
    return a(this.#t);
  }
  set months(e) {
    g(this.#t, e, !0);
  }
  announcer;
  constructor(e) {
    this.opts = e, this.attachment = vr(this.opts.ref), this.domContext = new Il(e.ref), this.announcer = ci(null), this.formatter = Ku({
      initialLocale: this.opts.locale.current,
      monthFormat: this.opts.monthFormat,
      yearFormat: this.opts.yearFormat
    }), this.setMonths = this.setMonths.bind(this), this.nextPage = this.nextPage.bind(this), this.prevPage = this.prevPage.bind(this), this.prevYear = this.prevYear.bind(this), this.nextYear = this.nextYear.bind(this), this.setYear = this.setYear.bind(this), this.setMonth = this.setMonth.bind(this), this.isOutsideVisibleMonths = this.isOutsideVisibleMonths.bind(this), this.isDateDisabled = this.isDateDisabled.bind(this), this.isDateSelected = this.isDateSelected.bind(this), this.shiftFocus = this.shiftFocus.bind(this), this.handleCellClick = this.handleCellClick.bind(this), this.handleMultipleUpdate = this.handleMultipleUpdate.bind(this), this.handleSingleUpdate = this.handleSingleUpdate.bind(this), this.onkeydown = this.onkeydown.bind(this), this.getBitsAttr = this.getBitsAttr.bind(this), Xc(() => {
      this.announcer = ci(this.domContext.getDocument());
    }), this.months = Yo({
      dateObj: this.opts.placeholder.current,
      weekStartsOn: this.opts.weekStartsOn.current,
      locale: this.opts.locale.current,
      fixedWeeks: this.opts.fixedWeeks.current,
      numberOfMonths: this.opts.numberOfMonths.current
    }), this.#s(), this.#i(), this.#l(), uv({
      placeholder: this.opts.placeholder,
      getVisibleMonths: () => this.visibleMonths,
      weekStartsOn: this.opts.weekStartsOn,
      locale: this.opts.locale,
      fixedWeeks: this.opts.fixedWeeks,
      numberOfMonths: this.opts.numberOfMonths,
      setMonths: (n) => this.months = n
    }), dv({
      fixedWeeks: this.opts.fixedWeeks,
      locale: this.opts.locale,
      numberOfMonths: this.opts.numberOfMonths,
      placeholder: this.opts.placeholder,
      setMonths: this.setMonths,
      weekStartsOn: this.opts.weekStartsOn
    }), ro(() => this.fullCalendarLabel, (n) => {
      const r = this.domContext.getElementById(this.accessibleHeadingId);
      r && (r.textContent = n);
    }), ro(() => this.opts.value.current, () => {
      const n = this.opts.value.current;
      if (Array.isArray(n) && n.length) {
        const r = n[n.length - 1];
        r && this.opts.placeholder.current !== r && (this.opts.placeholder.current = r);
      } else !Array.isArray(n) && n && this.opts.placeholder.current !== n && (this.opts.placeholder.current = n);
    }), mv({
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
  #n = R(
    /**
     * This derived state holds an array of localized day names for the current
     * locale and calendar view. It dynamically syncs with the 'weekStartsOn' option,
     * updating its content when the option changes. Using this state to render the
     * calendar's days of the week is strongly recommended, as it guarantees that
     * the days are correctly formatted for the current locale and calendar view.
     */
    () => lv({
      months: this.months,
      formatter: this.formatter,
      weekdayFormat: this.opts.weekdayFormat.current
    })
  );
  get weekdays() {
    return a(this.#n);
  }
  set weekdays(e) {
    g(this.#n, e);
  }
  #r = R(() => ca(() => this.opts.placeholder.current.year));
  get initialPlaceholderYear() {
    return a(this.#r);
  }
  set initialPlaceholderYear(e) {
    g(this.#r, e);
  }
  #a = R(() => wv({
    minValue: this.opts.minValue.current,
    maxValue: this.opts.maxValue.current,
    placeholderYear: this.initialPlaceholderYear
  }));
  get defaultYears() {
    return a(this.#a);
  }
  set defaultYears(e) {
    g(this.#a, e);
  }
  #s() {
    ze(() => {
      if (ca(() => this.opts.initialFocus.current)) {
        const n = this.opts.ref.current?.querySelector("[data-focused]");
        n && n.focus();
      }
    });
  }
  #i() {
    ze(() => this.opts.ref.current ? cv({
      calendarNode: this.opts.ref.current,
      label: this.fullCalendarLabel,
      accessibleHeadingId: this.accessibleHeadingId
    }) : void 0);
  }
  #l() {
    _f(() => {
      this.formatter.getLocale() !== this.opts.locale.current && this.formatter.setLocale(this.opts.locale.current);
    });
  }
  /**
   * Navigates to the next page of the calendar.
   */
  nextPage() {
    ov({
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
    iv({
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
  #o = R(() => hv({
    maxValue: this.opts.maxValue.current,
    months: this.months,
    disabled: this.opts.disabled.current
  }));
  get isNextButtonDisabled() {
    return a(this.#o);
  }
  set isNextButtonDisabled(e) {
    g(this.#o, e);
  }
  #d = R(() => fv({
    minValue: this.opts.minValue.current,
    months: this.months,
    disabled: this.opts.disabled.current
  }));
  get isPrevButtonDisabled() {
    return a(this.#d);
  }
  set isPrevButtonDisabled(e) {
    g(this.#d, e);
  }
  #c = R(() => {
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
    g(this.#c, e);
  }
  #u = R(() => (this.opts.monthFormat.current, this.opts.yearFormat.current, pv({
    months: this.months,
    formatter: this.formatter,
    locale: this.opts.locale.current
  })));
  get headingValue() {
    return a(this.#u);
  }
  set headingValue(e) {
    g(this.#u, e);
  }
  #h = R(() => `${this.opts.calendarLabel.current} ${this.headingValue}`);
  get fullCalendarLabel() {
    return a(this.#h);
  }
  set fullCalendarLabel(e) {
    g(this.#h, e);
  }
  isOutsideVisibleMonths(e) {
    return !this.visibleMonths.some((n) => Bl(e, n));
  }
  isDateDisabled(e) {
    if (this.opts.isDateDisabled.current(e) || this.opts.disabled.current) return !0;
    const n = this.opts.minValue.current, r = this.opts.maxValue.current;
    return !!(n && $s(e, n) || r && $s(r, e));
  }
  isDateSelected(e) {
    const n = this.opts.value.current;
    return Array.isArray(n) ? n.some((r) => bs(r, e)) : n ? bs(n, e) : !1;
  }
  shiftFocus(e, n) {
    return av({
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
      s ? this.announcer.announce(`Selected Date: ${this.formatter.selectedDate(s, !1)}`, "polite") : this.announcer.announce("Selected date is now empty.", "polite", 5e3), this.opts.value.current = bv(s, r), s !== void 0 && this.opts.onDateSelect?.current?.();
    }
  }
  handleMultipleUpdate(e, n) {
    if (!e) {
      const s = [n];
      return this.#f(s) ? s : [n];
    }
    if (!Array.isArray(e))
      return;
    const r = e.findIndex((s) => bs(s, n)), o = this.opts.preventDeselect.current;
    if (r === -1) {
      const s = [...e, n];
      return this.#f(s) ? s : [n];
    } else {
      if (o)
        return e;
      {
        const s = e.filter((l) => !bs(l, n));
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
    if (!this.opts.preventDeselect.current && bs(e, n)) {
      this.opts.placeholder.current = n;
      return;
    }
    return n;
  }
  onkeydown(e) {
    sv({
      event: e,
      handleCellClick: this.handleCellClick,
      shiftFocus: this.shiftFocus,
      placeholderValue: this.opts.placeholder.current
    });
  }
  #p = R(() => ({ months: this.months, weekdays: this.weekdays }));
  get snippetProps() {
    return a(this.#p);
  }
  set snippetProps(e) {
    g(this.#p, e);
  }
  getBitsAttr = (e) => Cv.getAttr(e);
  #v = R(() => ({
    ...vv({
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
    return a(this.#v);
  }
  set props(e) {
    g(this.#v, e);
  }
}
class Xl {
  static create(e) {
    return new Xl(e, Ca.get());
  }
  opts;
  root;
  attachment;
  constructor(e, n) {
    this.opts = e, this.root = n, this.attachment = vr(this.opts.ref);
  }
  #e = R(() => ({
    id: this.opts.id.current,
    "aria-hidden": _l(!0),
    "data-disabled": en(this.root.opts.disabled.current),
    "data-readonly": en(this.root.opts.readonly.current),
    [this.root.getBitsAttr("heading")]: "",
    ...this.attachment
  }));
  get props() {
    return a(this.#e);
  }
  set props(e) {
    g(this.#e, e);
  }
}
const Yu = new wi("Calendar.Cell | RangeCalendar.Cell");
class ed {
  static create(e) {
    return Yu.set(new ed(e, Ca.get()));
  }
  opts;
  root;
  #e = R(() => jr(this.opts.date.current));
  get cellDate() {
    return a(this.#e);
  }
  set cellDate(e) {
    g(this.#e, e);
  }
  #t = R(() => this.root.opts.isDateUnavailable.current(this.opts.date.current));
  get isUnavailable() {
    return a(this.#t);
  }
  set isUnavailable(e) {
    g(this.#t, e);
  }
  #n = R(() => zf(this.opts.date.current, Ps()));
  get isDateToday() {
    return a(this.#n);
  }
  set isDateToday(e) {
    g(this.#n, e);
  }
  #r = R(() => !Bl(this.opts.date.current, this.opts.month.current));
  get isOutsideMonth() {
    return a(this.#r);
  }
  set isOutsideMonth(e) {
    g(this.#r, e);
  }
  #a = R(() => this.root.isOutsideVisibleMonths(this.opts.date.current));
  get isOutsideVisibleMonths() {
    return a(this.#a);
  }
  set isOutsideVisibleMonths(e) {
    g(this.#a, e);
  }
  #s = R(() => this.root.isDateDisabled(this.opts.date.current) || this.isOutsideMonth && this.root.opts.disableDaysOutsideMonth.current);
  get isDisabled() {
    return a(this.#s);
  }
  set isDisabled(e) {
    g(this.#s, e);
  }
  #i = R(() => bs(this.opts.date.current, this.root.opts.placeholder.current));
  get isFocusedDate() {
    return a(this.#i);
  }
  set isFocusedDate(e) {
    g(this.#i, e);
  }
  #l = R(() => this.root.isDateSelected(this.opts.date.current));
  get isSelectedDate() {
    return a(this.#l);
  }
  set isSelectedDate(e) {
    g(this.#l, e);
  }
  #o = R(() => this.root.formatter.custom(this.cellDate, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  }));
  get labelText() {
    return a(this.#o);
  }
  set labelText(e) {
    g(this.#o, e);
  }
  attachment;
  constructor(e, n) {
    this.opts = e, this.root = n, this.attachment = vr(this.opts.ref);
  }
  #d = R(() => ({
    disabled: this.isDisabled,
    unavailable: this.isUnavailable,
    selected: this.isSelectedDate,
    day: `${this.opts.date.current.day}`
  }));
  get snippetProps() {
    return a(this.#d);
  }
  set snippetProps(e) {
    g(this.#d, e);
  }
  #c = R(() => this.isDisabled || this.isOutsideMonth && this.root.opts.disableDaysOutsideMonth.current || this.isUnavailable);
  get ariaDisabled() {
    return a(this.#c);
  }
  set ariaDisabled(e) {
    g(this.#c, e);
  }
  #u = R(() => ({
    "data-unavailable": en(this.isUnavailable),
    "data-today": this.isDateToday ? "" : void 0,
    "data-outside-month": this.isOutsideMonth ? "" : void 0,
    "data-outside-visible-months": this.isOutsideVisibleMonths ? "" : void 0,
    "data-focused": this.isFocusedDate ? "" : void 0,
    "data-selected": en(this.isSelectedDate),
    "data-value": this.opts.date.current.toString(),
    "data-type": Ap(this.opts.date.current),
    "data-disabled": en(this.isDisabled || this.isOutsideMonth && this.root.opts.disableDaysOutsideMonth.current)
  }));
  get sharedDataAttrs() {
    return a(this.#u);
  }
  set sharedDataAttrs(e) {
    g(this.#u, e);
  }
  #h = R(() => ({
    id: this.opts.id.current,
    role: "gridcell",
    "aria-selected": Fa(this.isSelectedDate),
    "aria-disabled": Fa(this.ariaDisabled),
    ...this.sharedDataAttrs,
    [this.root.getBitsAttr("cell")]: "",
    ...this.attachment
  }));
  get props() {
    return a(this.#h);
  }
  set props(e) {
    g(this.#h, e);
  }
}
class td {
  static create(e) {
    return new td(e, Yu.get());
  }
  opts;
  cell;
  attachment;
  constructor(e, n) {
    this.opts = e, this.cell = n, this.onclick = this.onclick.bind(this), this.attachment = vr(this.opts.ref);
  }
  #e = R(() => this.cell.isOutsideMonth && this.cell.root.opts.disableDaysOutsideMonth.current || this.cell.isDisabled ? void 0 : this.cell.isFocusedDate ? 0 : -1);
  onclick(e) {
    this.cell.isDisabled || this.cell.root.handleCellClick(e, this.cell.opts.date.current);
  }
  #t = R(() => ({
    disabled: this.cell.isDisabled,
    unavailable: this.cell.isUnavailable,
    selected: this.cell.isSelectedDate,
    day: `${this.cell.opts.date.current.day}`
  }));
  get snippetProps() {
    return a(this.#t);
  }
  set snippetProps(e) {
    g(this.#t, e);
  }
  #n = R(() => ({
    id: this.opts.id.current,
    role: "button",
    "aria-label": this.cell.labelText,
    "aria-disabled": Fa(this.cell.ariaDisabled),
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
    g(this.#n, e);
  }
}
class nd {
  static create(e) {
    return new nd(e, Ca.get());
  }
  opts;
  root;
  #e = R(() => this.root.isNextButtonDisabled);
  get isDisabled() {
    return a(this.#e);
  }
  set isDisabled(e) {
    g(this.#e, e);
  }
  attachment;
  constructor(e, n) {
    this.opts = e, this.root = n, this.onclick = this.onclick.bind(this), this.attachment = vr(this.opts.ref);
  }
  onclick(e) {
    this.isDisabled || this.root.nextPage();
  }
  #t = R(() => ({
    id: this.opts.id.current,
    role: "button",
    type: "button",
    "aria-label": "Next",
    "aria-disabled": Fa(this.isDisabled),
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
    g(this.#t, e);
  }
}
class rd {
  static create(e) {
    return new rd(e, Ca.get());
  }
  opts;
  root;
  #e = R(() => this.root.isPrevButtonDisabled);
  get isDisabled() {
    return a(this.#e);
  }
  set isDisabled(e) {
    g(this.#e, e);
  }
  attachment;
  constructor(e, n) {
    this.opts = e, this.root = n, this.onclick = this.onclick.bind(this), this.attachment = vr(this.opts.ref);
  }
  onclick(e) {
    this.isDisabled || this.root.prevPage();
  }
  #t = R(() => ({
    id: this.opts.id.current,
    role: "button",
    type: "button",
    "aria-label": "Previous",
    "aria-disabled": Fa(this.isDisabled),
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
    g(this.#t, e);
  }
}
class ad {
  static create(e) {
    return new ad(e, Ca.get());
  }
  opts;
  root;
  attachment;
  constructor(e, n) {
    this.opts = e, this.root = n, this.attachment = vr(this.opts.ref);
  }
  #e = R(() => ({
    id: this.opts.id.current,
    tabindex: -1,
    role: "grid",
    "aria-readonly": Fa(this.root.opts.readonly.current),
    "aria-disabled": Fa(this.root.opts.disabled.current),
    "data-readonly": en(this.root.opts.readonly.current),
    "data-disabled": en(this.root.opts.disabled.current),
    [this.root.getBitsAttr("grid")]: "",
    ...this.attachment
  }));
  get props() {
    return a(this.#e);
  }
  set props(e) {
    g(this.#e, e);
  }
}
class sd {
  static create(e) {
    return new sd(e, Ca.get());
  }
  opts;
  root;
  attachment;
  constructor(e, n) {
    this.opts = e, this.root = n, this.attachment = vr(this.opts.ref);
  }
  #e = R(() => ({
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
    g(this.#e, e);
  }
}
class od {
  static create(e) {
    return new od(e, Ca.get());
  }
  opts;
  root;
  attachment;
  constructor(e, n) {
    this.opts = e, this.root = n, this.attachment = vr(this.opts.ref);
  }
  #e = R(() => ({
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
    g(this.#e, e);
  }
}
class id {
  static create(e) {
    return new id(e, Ca.get());
  }
  opts;
  root;
  attachment;
  constructor(e, n) {
    this.opts = e, this.root = n, this.attachment = vr(this.opts.ref);
  }
  #e = R(() => ({
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
    g(this.#e, e);
  }
}
class ld {
  static create(e) {
    return new ld(e, Ca.get());
  }
  opts;
  root;
  attachment;
  constructor(e, n) {
    this.opts = e, this.root = n, this.attachment = vr(this.opts.ref);
  }
  #e = R(() => ({
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
    g(this.#e, e);
  }
}
class dd {
  static create(e) {
    return new dd(e, Ca.get());
  }
  opts;
  root;
  attachment;
  constructor(e, n) {
    this.opts = e, this.root = n, this.attachment = vr(this.opts.ref);
  }
  #e = R(() => ({
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
    g(this.#e, e);
  }
}
var Pv = j("<div><!></div>");
function zu(t, e) {
  const n = Yr();
  Ot(e, !0);
  let r = A(e, "children", 7), o = A(e, "child", 7), s = A(e, "ref", 15, null), l = A(e, "id", 23, () => Yt(n)), c = Sr(e, [
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
    id: Me(() => l()),
    ref: Me(() => s(), (w) => s(w))
  }), b = R(() => Rr(c, u.props));
  var p = {
    get children() {
      return r();
    },
    set children(w) {
      r(w), I();
    },
    get child() {
      return o();
    },
    set child(w) {
      o(w), I();
    },
    get ref() {
      return s();
    },
    set ref(w = null) {
      s(w), I();
    },
    get id() {
      return l();
    },
    set id(w = Yt(n)) {
      l(w), I();
    }
  }, y = Oe(), x = ee(y);
  {
    var f = (w) => {
      var m = Oe(), i = ee(m);
      {
        let O = R(() => ({ props: a(b), ...u.snippetProps }));
        Mt(i, o, () => a(O));
      }
      D(w, m);
    }, S = (w) => {
      var m = Pv();
      Kr(m, () => ({ ...a(b) }));
      var i = M(m);
      {
        var O = (N) => {
          var Z = Oe(), ge = ee(Z);
          Mt(ge, () => r() ?? Ir, () => u.snippetProps), D(N, Z);
        }, J = (N) => {
          var Z = ss();
          me(() => G(Z, u.cell.opts.date.current.day)), D(N, Z);
        };
        we(i, (N) => {
          r() ? N(O) : N(J, -1);
        });
      }
      T(m), D(w, m);
    };
    we(x, (w) => {
      o() ? w(f) : w(S, -1);
    });
  }
  return D(t, y), Lt(p);
}
Ft(zu, { children: {}, child: {}, ref: {}, id: {} }, [], [], { mode: "open" });
var xv = j("<table><!></table>");
function Qu(t, e) {
  const n = Yr();
  Ot(e, !0);
  let r = A(e, "children", 7), o = A(e, "child", 7), s = A(e, "ref", 15, null), l = A(e, "id", 23, () => Yt(n)), c = Sr(e, [
    "$$slots",
    "$$events",
    "$$legacy",
    "$$host",
    "children",
    "child",
    "ref",
    "id"
  ]);
  const u = ad.create({
    id: Me(() => l()),
    ref: Me(() => s(), (w) => s(w))
  }), b = R(() => Rr(c, u.props));
  var p = {
    get children() {
      return r();
    },
    set children(w) {
      r(w), I();
    },
    get child() {
      return o();
    },
    set child(w) {
      o(w), I();
    },
    get ref() {
      return s();
    },
    set ref(w = null) {
      s(w), I();
    },
    get id() {
      return l();
    },
    set id(w = Yt(n)) {
      l(w), I();
    }
  }, y = Oe(), x = ee(y);
  {
    var f = (w) => {
      var m = Oe(), i = ee(m);
      Mt(i, o, () => ({ props: a(b) })), D(w, m);
    }, S = (w) => {
      var m = xv();
      Kr(m, () => ({ ...a(b) }));
      var i = M(m);
      Mt(i, () => r() ?? Ir), T(m), D(w, m);
    };
    we(x, (w) => {
      o() ? w(f) : w(S, -1);
    });
  }
  return D(t, y), Lt(p);
}
Ft(Qu, { children: {}, child: {}, ref: {}, id: {} }, [], [], { mode: "open" });
var Rv = j("<tbody><!></tbody>");
function Wu(t, e) {
  const n = Yr();
  Ot(e, !0);
  let r = A(e, "children", 7), o = A(e, "child", 7), s = A(e, "ref", 15, null), l = A(e, "id", 23, () => Yt(n)), c = Sr(e, [
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
    id: Me(() => l()),
    ref: Me(() => s(), (w) => s(w))
  }), b = R(() => Rr(c, u.props));
  var p = {
    get children() {
      return r();
    },
    set children(w) {
      r(w), I();
    },
    get child() {
      return o();
    },
    set child(w) {
      o(w), I();
    },
    get ref() {
      return s();
    },
    set ref(w = null) {
      s(w), I();
    },
    get id() {
      return l();
    },
    set id(w = Yt(n)) {
      l(w), I();
    }
  }, y = Oe(), x = ee(y);
  {
    var f = (w) => {
      var m = Oe(), i = ee(m);
      Mt(i, o, () => ({ props: a(b) })), D(w, m);
    }, S = (w) => {
      var m = Rv();
      Kr(m, () => ({ ...a(b) }));
      var i = M(m);
      Mt(i, () => r() ?? Ir), T(m), D(w, m);
    };
    we(x, (w) => {
      o() ? w(f) : w(S, -1);
    });
  }
  return D(t, y), Lt(p);
}
Ft(Wu, { children: {}, child: {}, ref: {}, id: {} }, [], [], { mode: "open" });
var Sv = j("<td><!></td>");
function Ju(t, e) {
  const n = Yr();
  Ot(e, !0);
  let r = A(e, "children", 7), o = A(e, "child", 7), s = A(e, "ref", 15, null), l = A(e, "id", 23, () => Yt(n)), c = A(e, "date", 7), u = A(e, "month", 7), b = Sr(e, [
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
  const p = ed.create({
    id: Me(() => l()),
    ref: Me(() => s(), (i) => s(i)),
    date: Me(() => c()),
    month: Me(() => u())
  }), y = R(() => Rr(b, p.props));
  var x = {
    get children() {
      return r();
    },
    set children(i) {
      r(i), I();
    },
    get child() {
      return o();
    },
    set child(i) {
      o(i), I();
    },
    get ref() {
      return s();
    },
    set ref(i = null) {
      s(i), I();
    },
    get id() {
      return l();
    },
    set id(i = Yt(n)) {
      l(i), I();
    },
    get date() {
      return c();
    },
    set date(i) {
      c(i), I();
    },
    get month() {
      return u();
    },
    set month(i) {
      u(i), I();
    }
  }, f = Oe(), S = ee(f);
  {
    var w = (i) => {
      var O = Oe(), J = ee(O);
      {
        let N = R(() => ({ props: a(y), ...p.snippetProps }));
        Mt(J, o, () => a(N));
      }
      D(i, O);
    }, m = (i) => {
      var O = Sv();
      Kr(O, () => ({ ...a(y) }));
      var J = M(O);
      Mt(J, () => r() ?? Ir, () => p.snippetProps), T(O), D(i, O);
    };
    we(S, (i) => {
      o() ? i(w) : i(m, -1);
    });
  }
  return D(t, f), Lt(x);
}
Ft(
  Ju,
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
var Iv = j("<thead><!></thead>");
function Gu(t, e) {
  const n = Yr();
  Ot(e, !0);
  let r = A(e, "children", 7), o = A(e, "child", 7), s = A(e, "ref", 15, null), l = A(e, "id", 23, () => Yt(n)), c = Sr(e, [
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
    id: Me(() => l()),
    ref: Me(() => s(), (w) => s(w))
  }), b = R(() => Rr(c, u.props));
  var p = {
    get children() {
      return r();
    },
    set children(w) {
      r(w), I();
    },
    get child() {
      return o();
    },
    set child(w) {
      o(w), I();
    },
    get ref() {
      return s();
    },
    set ref(w = null) {
      s(w), I();
    },
    get id() {
      return l();
    },
    set id(w = Yt(n)) {
      l(w), I();
    }
  }, y = Oe(), x = ee(y);
  {
    var f = (w) => {
      var m = Oe(), i = ee(m);
      Mt(i, o, () => ({ props: a(b) })), D(w, m);
    }, S = (w) => {
      var m = Iv();
      Kr(m, () => ({ ...a(b) }));
      var i = M(m);
      Mt(i, () => r() ?? Ir), T(m), D(w, m);
    };
    we(x, (w) => {
      o() ? w(f) : w(S, -1);
    });
  }
  return D(t, y), Lt(p);
}
Ft(Gu, { children: {}, child: {}, ref: {}, id: {} }, [], [], { mode: "open" });
var _v = j("<th><!></th>");
function Zu(t, e) {
  const n = Yr();
  Ot(e, !0);
  let r = A(e, "children", 7), o = A(e, "child", 7), s = A(e, "ref", 15, null), l = A(e, "id", 23, () => Yt(n)), c = Sr(e, [
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
    id: Me(() => l()),
    ref: Me(() => s(), (w) => s(w))
  }), b = R(() => Rr(c, u.props));
  var p = {
    get children() {
      return r();
    },
    set children(w) {
      r(w), I();
    },
    get child() {
      return o();
    },
    set child(w) {
      o(w), I();
    },
    get ref() {
      return s();
    },
    set ref(w = null) {
      s(w), I();
    },
    get id() {
      return l();
    },
    set id(w = Yt(n)) {
      l(w), I();
    }
  }, y = Oe(), x = ee(y);
  {
    var f = (w) => {
      var m = Oe(), i = ee(m);
      Mt(i, o, () => ({ props: a(b) })), D(w, m);
    }, S = (w) => {
      var m = _v();
      Kr(m, () => ({ ...a(b) }));
      var i = M(m);
      Mt(i, () => r() ?? Ir), T(m), D(w, m);
    };
    we(x, (w) => {
      o() ? w(f) : w(S, -1);
    });
  }
  return D(t, y), Lt(p);
}
Ft(Zu, { children: {}, child: {}, ref: {}, id: {} }, [], [], { mode: "open" });
var Ev = j("<tr><!></tr>");
function bl(t, e) {
  const n = Yr();
  Ot(e, !0);
  let r = A(e, "children", 7), o = A(e, "child", 7), s = A(e, "ref", 15, null), l = A(e, "id", 23, () => Yt(n)), c = Sr(e, [
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
    id: Me(() => l()),
    ref: Me(() => s(), (w) => s(w))
  }), b = R(() => Rr(c, u.props));
  var p = {
    get children() {
      return r();
    },
    set children(w) {
      r(w), I();
    },
    get child() {
      return o();
    },
    set child(w) {
      o(w), I();
    },
    get ref() {
      return s();
    },
    set ref(w = null) {
      s(w), I();
    },
    get id() {
      return l();
    },
    set id(w = Yt(n)) {
      l(w), I();
    }
  }, y = Oe(), x = ee(y);
  {
    var f = (w) => {
      var m = Oe(), i = ee(m);
      Mt(i, o, () => ({ props: a(b) })), D(w, m);
    }, S = (w) => {
      var m = Ev();
      Kr(m, () => ({ ...a(b) }));
      var i = M(m);
      Mt(i, () => r() ?? Ir), T(m), D(w, m);
    };
    we(x, (w) => {
      o() ? w(f) : w(S, -1);
    });
  }
  return D(t, y), Lt(p);
}
Ft(bl, { children: {}, child: {}, ref: {}, id: {} }, [], [], { mode: "open" });
var Av = j("<header><!></header>");
function Xu(t, e) {
  const n = Yr();
  Ot(e, !0);
  let r = A(e, "children", 7), o = A(e, "child", 7), s = A(e, "ref", 15, null), l = A(e, "id", 23, () => Yt(n)), c = Sr(e, [
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
    id: Me(() => l()),
    ref: Me(() => s(), (w) => s(w))
  }), b = R(() => Rr(c, u.props));
  var p = {
    get children() {
      return r();
    },
    set children(w) {
      r(w), I();
    },
    get child() {
      return o();
    },
    set child(w) {
      o(w), I();
    },
    get ref() {
      return s();
    },
    set ref(w = null) {
      s(w), I();
    },
    get id() {
      return l();
    },
    set id(w = Yt(n)) {
      l(w), I();
    }
  }, y = Oe(), x = ee(y);
  {
    var f = (w) => {
      var m = Oe(), i = ee(m);
      Mt(i, o, () => ({ props: a(b) })), D(w, m);
    }, S = (w) => {
      var m = Av();
      Kr(m, () => ({ ...a(b) }));
      var i = M(m);
      Mt(i, () => r() ?? Ir), T(m), D(w, m);
    };
    we(x, (w) => {
      o() ? w(f) : w(S, -1);
    });
  }
  return D(t, y), Lt(p);
}
Ft(Xu, { children: {}, child: {}, ref: {}, id: {} }, [], [], { mode: "open" });
var kv = j("<div><!></div>");
function eh(t, e) {
  const n = Yr();
  Ot(e, !0);
  let r = A(e, "children", 7), o = A(e, "child", 7), s = A(e, "ref", 15, null), l = A(e, "id", 23, () => Yt(n)), c = Sr(e, [
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
    id: Me(() => l()),
    ref: Me(() => s(), (w) => s(w))
  }), b = R(() => Rr(c, u.props));
  var p = {
    get children() {
      return r();
    },
    set children(w) {
      r(w), I();
    },
    get child() {
      return o();
    },
    set child(w) {
      o(w), I();
    },
    get ref() {
      return s();
    },
    set ref(w = null) {
      s(w), I();
    },
    get id() {
      return l();
    },
    set id(w = Yt(n)) {
      l(w), I();
    }
  }, y = Oe(), x = ee(y);
  {
    var f = (w) => {
      var m = Oe(), i = ee(m);
      Mt(i, o, () => ({
        props: a(b),
        headingValue: u.root.headingValue
      })), D(w, m);
    }, S = (w) => {
      var m = kv();
      Kr(m, () => ({ ...a(b) }));
      var i = M(m);
      {
        var O = (N) => {
          var Z = Oe(), ge = ee(Z);
          Mt(ge, () => r() ?? Ir, () => ({ headingValue: u.root.headingValue })), D(N, Z);
        }, J = (N) => {
          var Z = ss();
          me(() => G(Z, u.root.headingValue)), D(N, Z);
        };
        we(i, (N) => {
          r() ? N(O) : N(J, -1);
        });
      }
      T(m), D(w, m);
    };
    we(x, (w) => {
      o() ? w(f) : w(S, -1);
    });
  }
  return D(t, y), Lt(p);
}
Ft(eh, { children: {}, child: {}, ref: {}, id: {} }, [], [], { mode: "open" });
var Dv = j("<button><!></button>");
function th(t, e) {
  const n = Yr();
  Ot(e, !0);
  let r = A(e, "children", 7), o = A(e, "child", 7), s = A(e, "id", 23, () => Yt(n)), l = A(e, "ref", 15, null), c = A(e, "tabindex", 7, 0), u = Sr(e, [
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
  const b = nd.create({
    id: Me(() => s()),
    ref: Me(() => l(), (m) => l(m))
  }), p = R(() => Rr(u, b.props, { tabindex: c() }));
  var y = {
    get children() {
      return r();
    },
    set children(m) {
      r(m), I();
    },
    get child() {
      return o();
    },
    set child(m) {
      o(m), I();
    },
    get id() {
      return s();
    },
    set id(m = Yt(n)) {
      s(m), I();
    },
    get ref() {
      return l();
    },
    set ref(m = null) {
      l(m), I();
    },
    get tabindex() {
      return c();
    },
    set tabindex(m = 0) {
      c(m), I();
    }
  }, x = Oe(), f = ee(x);
  {
    var S = (m) => {
      var i = Oe(), O = ee(i);
      Mt(O, o, () => ({ props: a(p) })), D(m, i);
    }, w = (m) => {
      var i = Dv();
      Kr(i, () => ({ ...a(p) }));
      var O = M(i);
      Mt(O, () => r() ?? Ir), T(i), D(m, i);
    };
    we(f, (m) => {
      o() ? m(S) : m(w, -1);
    });
  }
  return D(t, x), Lt(y);
}
Ft(th, { children: {}, child: {}, id: {}, ref: {}, tabindex: {} }, [], [], { mode: "open" });
var Tv = j("<button><!></button>");
function nh(t, e) {
  const n = Yr();
  Ot(e, !0);
  let r = A(e, "children", 7), o = A(e, "child", 7), s = A(e, "id", 23, () => Yt(n)), l = A(e, "ref", 15, null), c = A(e, "tabindex", 7, 0), u = Sr(e, [
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
    id: Me(() => s()),
    ref: Me(() => l(), (m) => l(m))
  }), p = R(() => Rr(u, b.props, { tabindex: c() }));
  var y = {
    get children() {
      return r();
    },
    set children(m) {
      r(m), I();
    },
    get child() {
      return o();
    },
    set child(m) {
      o(m), I();
    },
    get id() {
      return s();
    },
    set id(m = Yt(n)) {
      s(m), I();
    },
    get ref() {
      return l();
    },
    set ref(m = null) {
      l(m), I();
    },
    get tabindex() {
      return c();
    },
    set tabindex(m = 0) {
      c(m), I();
    }
  }, x = Oe(), f = ee(x);
  {
    var S = (m) => {
      var i = Oe(), O = ee(i);
      Mt(O, o, () => ({ props: a(p) })), D(m, i);
    }, w = (m) => {
      var i = Tv();
      Kr(i, () => ({ ...a(p) }));
      var O = M(i);
      Mt(O, () => r() ?? Ir), T(i), D(m, i);
    };
    we(f, (m) => {
      o() ? m(S) : m(w, -1);
    });
  }
  return D(t, x), Lt(y);
}
Ft(nh, { children: {}, child: {}, id: {}, ref: {}, tabindex: {} }, [], [], { mode: "open" });
const cd = Gc({
  component: "date-field",
  parts: ["input", "label", "segment"]
}), lo = {
  day: {
    min: 1,
    max: (t) => {
      const e = t.segmentValues.month, n = t.value.current ?? t.placeholder.current;
      return Bo(e ? n.set({ month: Number.parseInt(e) }) : n);
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
    max: (t) => t.hourCycle.current === 24 ? 23 : t.hourCycle.current === 12 || qu(t.locale.current) === 12 ? 12 : 23,
    cycle: 1,
    canBeZero: !0,
    padZero: !0
  },
  minute: { min: 0, max: 59, cycle: 1, canBeZero: !0, padZero: !0 },
  second: { min: 0, max: 59, cycle: 1, canBeZero: !0, padZero: !0 }
}, Us = new wi("DateField.Root");
class ud {
  static create(e, n) {
    return Us.set(new ud(e, n));
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
  descriptionId = Zc();
  formatter;
  initialSegments;
  #e = be();
  get segmentValues() {
    return a(this.#e);
  }
  set segmentValues(e) {
    g(this.#e, e, !0);
  }
  announcer;
  #t = R(() => new Set(this.readonlySegments.current));
  get readonlySegmentsSet() {
    return a(this.#t);
  }
  set readonlySegmentsSet(e) {
    g(this.#t, e);
  }
  segmentStates = Xd();
  #n = be(null);
  #r = be(null);
  #a = be(null);
  get descriptionNode() {
    return a(this.#a);
  }
  set descriptionNode(e) {
    g(this.#a, e, !0);
  }
  #s = be(null);
  get validationNode() {
    return a(this.#s);
  }
  set validationNode(e) {
    g(this.#s, e, !0);
  }
  states = Xd();
  #i = be(null);
  get dayPeriodNode() {
    return a(this.#i);
  }
  set dayPeriodNode(e) {
    g(this.#i, e, !0);
  }
  rangeRoot = void 0;
  #l = be("");
  get name() {
    return a(this.#l);
  }
  set name(e) {
    g(this.#l, e, !0);
  }
  domContext = new Il(() => null);
  constructor(e, n) {
    this.rangeRoot = n, this.value = e.value, this.placeholder = n ? n.opts.placeholder : e.placeholder, this.validate = n ? Lh(void 0) : e.validate, this.minValue = n ? n.opts.minValue : e.minValue, this.maxValue = n ? n.opts.maxValue : e.maxValue, this.disabled = n ? n.opts.disabled : e.disabled, this.readonly = n ? n.opts.readonly : e.readonly, this.granularity = n ? n.opts.granularity : e.granularity, this.readonlySegments = n ? n.opts.readonlySegments : e.readonlySegments, this.hourCycle = n ? n.opts.hourCycle : e.hourCycle, this.locale = n ? n.opts.locale : e.locale, this.hideTimeZone = n ? n.opts.hideTimeZone : e.hideTimeZone, this.required = n ? n.opts.required : e.required, this.onInvalid = n ? n.opts.onInvalid : e.onInvalid, this.errorMessageId = n ? n.opts.errorMessageId : e.errorMessageId, this.isInvalidProp = e.isInvalidProp, this.formatter = Ku({
      initialLocale: this.locale.current,
      monthFormat: Me(() => "long"),
      yearFormat: Me(() => "numeric")
    }), this.initialSegments = Qi(this.inferredGranularity), this.segmentValues = this.initialSegments, this.announcer = ci(null), this.getFieldNode = this.getFieldNode.bind(this), this.updateSegment = this.updateSegment.bind(this), this.handleSegmentClick = this.handleSegmentClick.bind(this), this.getBaseSegmentAttrs = this.getBaseSegmentAttrs.bind(this), ze(() => {
      ca(() => {
        this.initialSegments = Qi(this.inferredGranularity);
      });
    }), Xc(() => {
      this.announcer = ci(this.domContext.getDocument());
    }), Fh(() => {
      n || Xp(this.descriptionId, this.domContext.getDocument());
    }), ze(() => {
      n || this.formatter.getLocale() !== this.locale.current && this.formatter.setLocale(this.locale.current);
    }), ze(() => {
      if (n) return;
      if (this.value.current) {
        const o = ca(() => this.descriptionId);
        Zp({
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
    }), this.value.current && this.syncSegmentValues(this.value.current), ze(() => {
      this.locale.current, this.value.current && this.syncSegmentValues(this.value.current), this.#o();
    }), ze(() => {
      this.value.current === void 0 && (this.segmentValues = Qi(this.inferredGranularity));
    }), ro(() => this.validationStatus, () => {
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
    return this.rangeRoot ? this.rangeRoot.fieldNode : a(this.#n);
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
    return this.rangeRoot ? this.rangeRoot.labelNode : a(this.#r);
  }
  #o() {
    this.states.day.updating = null, this.states.month.updating = null, this.states.year.updating = null, this.states.hour.updating = null, this.states.minute.updating = null, this.states.dayPeriod.updating = null;
  }
  setValue(e) {
    this.value.current = e;
  }
  syncSegmentValues(e) {
    const n = Ei.map((r) => {
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
      const r = Ql.map((s) => {
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
  #d = R(() => {
    const e = this.value.current;
    if (!e) return !1;
    const n = this.validate.current?.(e);
    if (n)
      return { reason: "custom", message: n };
    const r = this.minValue.current;
    if (r && $s(e, r))
      return { reason: "min" };
    const o = this.maxValue.current;
    return o && $s(o, e) ? { reason: "max" } : !1;
  });
  get validationStatus() {
    return a(this.#d);
  }
  set validationStatus(e) {
    g(this.#d, e);
  }
  #c = R(() => this.validationStatus === !1 ? !1 : (this.isInvalidProp.current, !0));
  get isInvalid() {
    return a(this.#c);
  }
  set isInvalid(e) {
    g(this.#c, e);
  }
  #u = R(() => {
    const e = this.granularity.current;
    return e || Jp(this.placeholder.current, this.granularity.current);
  });
  get inferredGranularity() {
    return a(this.#u);
  }
  set inferredGranularity(e) {
    g(this.#u, e);
  }
  #h = R(() => this.value.current !== void 0 ? this.value.current : this.placeholder.current);
  get dateRef() {
    return a(this.#h);
  }
  set dateRef(e) {
    g(this.#h, e);
  }
  #f = R(() => jp({
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
    g(this.#f, e);
  }
  #p = R(() => this.allSegmentContent.arr);
  get segmentContents() {
    return a(this.#p);
  }
  set segmentContents(e) {
    g(this.#p, e);
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
  #v(e) {
    return `${e} ${this.getLabelNode()?.id ?? ""}`;
  }
  updateSegment(e, n) {
    const r = this.disabled.current, o = this.readonly.current, s = this.readonlySegmentsSet;
    if (r || o || s.has(e)) return;
    const l = this.segmentValues;
    let c = l;
    const u = this.placeholder.current;
    if (Wp(l)) {
      const b = l[e], p = n;
      if (e === "month") {
        const y = p(b);
        if (this.states.month.updating = y, y !== null && l.day !== null) {
          const x = u.set({ month: Number.parseInt(y) }), f = Bo(jr(x));
          Number.parseInt(l.day) > f && (l.day = `${f}`);
        }
        c = { ...l, [e]: y };
      } else if (e === "dayPeriod") {
        const y = p(b);
        this.states.dayPeriod.updating = y;
        const x = this.value.current;
        if (x && "hour" in x) {
          const f = x.hour;
          y === "AM" ? f >= 12 && (l.hour = `${f - 12}`) : y === "PM" && f < 12 && (l.hour = `${f + 12}`);
        }
        c = { ...l, [e]: y };
      } else if (e === "hour") {
        const y = p(b);
        if (this.states.hour.updating = y, y !== null && l.dayPeriod !== null) {
          const x = this.formatter.dayPeriod(jr(u.set({ hour: Number.parseInt(y) })), this.hourCycle.current);
          (x === "AM" || x === "PM") && (l.dayPeriod = x);
        }
        c = { ...l, [e]: y };
      } else if (e === "minute") {
        const y = p(b);
        this.states.minute.updating = y, c = { ...l, [e]: y };
      } else if (e === "second") {
        const y = p(b);
        this.states.second.updating = y, c = { ...l, [e]: y };
      } else if (e === "year") {
        const y = p(b);
        this.states.year.updating = y, c = { ...l, [e]: y };
      } else if (e === "day") {
        const y = p(b);
        this.states.day.updating = y, c = { ...l, [e]: y };
      } else {
        const y = p(b);
        c = { ...l, [e]: y };
      }
    } else if (Ai(e)) {
      const b = l[e], p = n, y = p(b);
      if (e === "month" && y !== null && l.day !== null) {
        this.states.month.updating = y;
        const x = u.set({ month: Number.parseInt(y) }), f = Bo(jr(x));
        Number.parseInt(l.day) > f && (l.day = `${f}`), c = { ...l, [e]: y };
      } else if (e === "year") {
        const x = p(b);
        this.states.year.updating = x, c = { ...l, [e]: x };
      } else if (e === "day") {
        const x = p(b);
        this.states.day.updating = x, c = { ...l, [e]: x };
      } else
        c = { ...l, [e]: y };
    }
    this.segmentValues = c, Qp(c, a(this.#n)) ? this.setValue(zp({
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
      "aria-invalid": _l(this.isInvalid),
      "aria-disabled": Fa(this.disabled.current),
      "aria-readonly": Fa(this.readonly.current || r),
      "data-invalid": en(this.isInvalid),
      "data-disabled": en(this.disabled.current),
      "data-readonly": en(this.readonly.current || r),
      "data-segment": `${e}`,
      [cd.segment]: ""
    };
    if (e === "literal") return o;
    const s = this.descriptionNode?.id, l = Gp(n, a(this.#n)) && s, c = this.errorMessageId?.current, u = l ? `${s} ${this.isInvalid && c ? c : ""}` : void 0, b = !(this.readonly.current || r || this.disabled.current);
    return {
      ...o,
      "aria-labelledby": this.#v(n),
      contenteditable: b ? "true" : void 0,
      "aria-describedby": u,
      tabindex: this.disabled.current ? void 0 : 0
    };
  }
}
class hd {
  static create(e) {
    return new hd(e, Us.get());
  }
  opts;
  root;
  domContext;
  attachment;
  constructor(e, n) {
    this.opts = e, this.root = n, this.domContext = new Il(e.ref), this.root.domContext = this.domContext, this.attachment = vr(e.ref, (r) => this.root.setFieldNode(r)), ro(() => this.opts.name.current, (r) => {
      this.root.setName(r);
    });
  }
  #e = R(() => {
    if (!(!_s || !this.domContext.getElementById(this.root.descriptionId)))
      return this.root.descriptionId;
  });
  #t = R(() => ({
    id: this.opts.id.current,
    role: "group",
    "aria-labelledby": this.root.getLabelNode()?.id ?? void 0,
    "aria-describedby": a(this.#e),
    "aria-disabled": Fa(this.root.disabled.current),
    "data-invalid": this.root.isInvalid ? "" : void 0,
    "data-disabled": en(this.root.disabled.current),
    [cd.input]: "",
    ...this.attachment
  }));
  get props() {
    return a(this.#t);
  }
  set props(e) {
    g(this.#t, e);
  }
}
class fd {
  static create() {
    return new fd(Us.get());
  }
  root;
  #e = R(() => this.root.name !== "");
  get shouldRender() {
    return a(this.#e);
  }
  set shouldRender(e) {
    g(this.#e, e);
  }
  #t = R(() => this.root.value.current ? this.root.value.current.toString() : "");
  get isoValue() {
    return a(this.#t);
  }
  set isoValue(e) {
    g(this.#t, e);
  }
  constructor(e) {
    this.root = e;
  }
  #n = R(() => ({
    name: this.root.name,
    value: this.isoValue,
    required: this.root.required.current
  }));
  get props() {
    return a(this.#n);
  }
  set props(e) {
    g(this.#n, e);
  }
}
class co {
  opts;
  root;
  announcer;
  part;
  config;
  attachment;
  constructor(e, n, r, o) {
    this.opts = e, this.root = n, this.part = r, this.config = o, this.announcer = n.announcer, this.onkeydown = this.onkeydown.bind(this), this.onfocusout = this.onfocusout.bind(this), this.attachment = vr(e.ref);
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
    if (!(e.ctrlKey || e.metaKey || this.root.disabled.current) && !((this.part === "hour" || this.part === "minute" || this.part === "second") && !(this.part in n)) && (e.key !== Pi && e.preventDefault(), !!Wl(e.key))) {
      if (yd(e.key)) {
        this.#a(n);
        return;
      }
      if (md(e.key)) {
        this.#s(n);
        return;
      }
      if (Ci(e.key)) {
        this.#i(e);
        return;
      }
      if (bd(e.key)) {
        this.#l(e);
        return;
      }
      Ko(e.key) && jo(e, this.root.getFieldNode());
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
    }), r && Vu(e, this.root.getFieldNode());
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
    }), r && ju(e, this.root.getFieldNode());
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
  #o = R(() => ({
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
    g(this.#o, e);
  }
}
class Mv extends co {
  #e = [];
  #t = 0;
  constructor(e, n) {
    super(e, n, "year", lo.year);
  }
  onkeydown(e) {
    if (!(e.ctrlKey || e.metaKey || this.root.disabled.current) && (e.key !== Pi && e.preventDefault(), !!Wl(e.key))) {
      if (yd(e.key)) {
        this.#n(), super.onkeydown(e);
        return;
      }
      if (md(e.key)) {
        this.#n(), super.onkeydown(e);
        return;
      }
      if (Ci(e.key)) {
        this.#a(e);
        return;
      }
      if (bd(e.key)) {
        this.#s(e);
        return;
      }
      Ko(e.key) && jo(e, this.root.getFieldNode());
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
        return this.#t > 0 && this.#e.length <= this.#t && s.length <= 4 ? (this.announcer.announce(l), s) : (this.announcer.announce(l), ac(l));
      this.announcer.announce(l), n = !0;
      const u = `${l}`;
      return u.length > 4 ? u.slice(0, 4) : u;
    }), (this.#e.length === 4 || this.#e.length === this.#t) && (n = !0), n && Vu(e, this.root.getFieldNode());
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
    }), n && ju(e, this.root.getFieldNode());
  }
  onfocusout(e) {
    this.root.states.year.hasLeftFocus = !0, this.#e = [], this.#n(), this.root.updateSegment("year", (n) => n && n.length !== 4 ? ac(Number.parseInt(n)) : n);
  }
}
class Ov extends co {
  constructor(e, n) {
    super(e, n, "day", lo.day);
  }
}
class Lv extends co {
  constructor(e, n) {
    super(e, n, "month", lo.month);
  }
}
class Fv extends co {
  constructor(e, n) {
    super(e, n, "hour", lo.hour);
  }
  // Override to handle special hour logic
  onkeydown(e) {
    if (Ci(e.key)) {
      const n = this.root.updateSegment.bind(this.root);
      this.root.updateSegment = (r, o) => {
        const s = n(r, o);
        return r === "hour" && "hour" in this.root.segmentValues && this.root.segmentValues.hour === "0" && this.root.dayPeriodNode && this.root.hourCycle.current !== 24 && (this.root.segmentValues.hour = "12"), s;
      };
    }
    super.onkeydown(e), this.root.updateSegment = this.root.updateSegment.bind(this.root);
  }
}
class Hv extends co {
  constructor(e, n) {
    super(e, n, "minute", lo.minute);
  }
}
class $v extends co {
  constructor(e, n) {
    super(e, n, "second", lo.second);
  }
}
class pd {
  static create(e) {
    return new pd(e, Us.get());
  }
  opts;
  root;
  attachment;
  #e;
  constructor(e, n) {
    this.opts = e, this.root = n, this.#e = this.root.announcer, this.onkeydown = this.onkeydown.bind(this), this.attachment = vr(e.ref, (r) => this.root.dayPeriodNode = r);
  }
  onkeydown(e) {
    if (!(e.ctrlKey || e.metaKey || this.root.disabled.current) && (e.key !== Pi && e.preventDefault(), !!Bv(e.key))) {
      if (yd(e.key) || md(e.key)) {
        this.root.updateSegment("dayPeriod", (n) => {
          if (n === "AM")
            return this.#e.announce("PM"), "PM";
          const r = "AM";
          return this.#e.announce(r), r;
        });
        return;
      }
      bd(e.key) && (this.root.states.dayPeriod.hasLeftFocus = !1, this.root.updateSegment("dayPeriod", () => (this.#e.announce("AM"), "AM"))), (e.key === cl || e.key === eu || ul) && this.root.updateSegment("dayPeriod", () => {
        const n = e.key === cl || e.key === ul ? "AM" : "PM";
        return this.#e.announce(n), n;
      }), Ko(e.key) && jo(e, this.root.getFieldNode());
    }
  }
  #t = R(() => {
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
    g(this.#t, e);
  }
}
class vd {
  static create(e) {
    return new vd(e, Us.get());
  }
  opts;
  root;
  attachment;
  constructor(e, n) {
    this.opts = e, this.root = n, this.attachment = vr(e.ref);
  }
  #e = R(() => ({
    id: this.opts.id.current,
    "aria-hidden": _l(!0),
    ...this.root.getBaseSegmentAttrs("literal", this.opts.id.current),
    ...this.attachment
  }));
  get props() {
    return a(this.#e);
  }
  set props(e) {
    g(this.#e, e);
  }
}
class gd {
  static create(e) {
    return new gd(e, Us.get());
  }
  opts;
  root;
  attachment;
  constructor(e, n) {
    this.opts = e, this.root = n, this.onkeydown = this.onkeydown.bind(this), this.attachment = vr(e.ref);
  }
  onkeydown(e) {
    e.key !== Pi && e.preventDefault(), !this.root.disabled.current && Ko(e.key) && jo(e, this.root.getFieldNode());
  }
  #e = R(() => ({
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
    g(this.#e, e);
  }
}
class Nv {
  static create(e, n) {
    const r = Us.get();
    switch (e) {
      case "day":
        return new Ov(n, r);
      case "month":
        return new Lv(n, r);
      case "year":
        return new Mv(n, r);
      case "hour":
        return new Fv(n, r);
      case "minute":
        return new Hv(n, r);
      case "second":
        return new $v(n, r);
      case "dayPeriod":
        return new pd(n, r);
      case "literal":
        return new vd(n, r);
      case "timeZoneName":
        return new gd(n, r);
    }
  }
}
function Bv(t) {
  return Wl(t) || t === cl || t === eu || t === ul || t === Hh;
}
function yd(t) {
  return t === mi;
}
function md(t) {
  return t === bi;
}
function bd(t) {
  return t === Qc;
}
function ac(t) {
  const n = 4 - String(t).length;
  return `${"0".repeat(n)}${t}`;
}
function rh(t, e) {
  Ot(e, !0);
  const n = fd.create();
  var r = Oe(), o = ee(r);
  {
    var s = (l) => {
      Nf(l, so(() => n.props));
    };
    we(o, (l) => {
      n.shouldRender && l(s);
    });
  }
  D(t, r), Lt();
}
Ft(rh, {}, [], [], { mode: "open" });
var Uv = j("<div><!></div>"), qv = j("<!> <!>", 1);
function ah(t, e) {
  const n = Yr();
  Ot(e, !0);
  let r = A(e, "id", 23, () => Yt(n)), o = A(e, "ref", 15, null), s = A(e, "name", 7, ""), l = A(e, "children", 7), c = A(e, "child", 7), u = Sr(e, [
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
  const b = hd.create({
    id: Me(() => r()),
    ref: Me(() => o(), (i) => o(i)),
    name: Me(() => s())
  }), p = R(() => Rr(u, b.props));
  var y = {
    get id() {
      return r();
    },
    set id(i = Yt(n)) {
      r(i), I();
    },
    get ref() {
      return o();
    },
    set ref(i = null) {
      o(i), I();
    },
    get name() {
      return s();
    },
    set name(i = "") {
      s(i), I();
    },
    get children() {
      return l();
    },
    set children(i) {
      l(i), I();
    },
    get child() {
      return c();
    },
    set child(i) {
      c(i), I();
    }
  }, x = qv(), f = ee(x);
  {
    var S = (i) => {
      var O = Oe(), J = ee(O);
      Mt(J, c, () => ({
        props: a(p),
        segments: b.root.segmentContents
      })), D(i, O);
    }, w = (i) => {
      var O = Uv();
      Kr(O, () => ({ ...a(p) }));
      var J = M(O);
      Mt(J, () => l() ?? Ir, () => ({ segments: b.root.segmentContents })), T(O), D(i, O);
    };
    we(f, (i) => {
      c() ? i(S) : i(w, -1);
    });
  }
  var m = F(f, 2);
  return rh(m, {}), D(t, x), Lt(y);
}
Ft(ah, { id: {}, ref: {}, name: {}, children: {}, child: {} }, [], [], { mode: "open" });
var Vv = j("<span><!></span>");
function sh(t, e) {
  const n = Yr();
  Ot(e, !0);
  let r = A(e, "id", 23, () => Yt(n)), o = A(e, "ref", 15, null), s = A(e, "children", 7), l = A(e, "child", 7), c = A(e, "part", 7), u = Sr(e, [
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
  const b = Nv.create(c(), {
    id: Me(() => r()),
    ref: Me(() => o(), (m) => o(m))
  }), p = R(() => Rr(u, b.props));
  var y = {
    get id() {
      return r();
    },
    set id(m = Yt(n)) {
      r(m), I();
    },
    get ref() {
      return o();
    },
    set ref(m = null) {
      o(m), I();
    },
    get children() {
      return s();
    },
    set children(m) {
      s(m), I();
    },
    get child() {
      return l();
    },
    set child(m) {
      l(m), I();
    },
    get part() {
      return c();
    },
    set part(m) {
      c(m), I();
    }
  }, x = Oe(), f = ee(x);
  {
    var S = (m) => {
      var i = Oe(), O = ee(i);
      Mt(O, l, () => ({ props: a(p) })), D(m, i);
    }, w = (m) => {
      var i = Vv();
      Kr(i, () => ({ ...a(p) }));
      var O = M(i);
      Mt(O, () => s() ?? Ir), T(i), D(m, i);
    };
    we(f, (m) => {
      l() ? m(S) : m(w, -1);
    });
  }
  return D(t, x), Lt(y);
}
Ft(sh, { id: {}, ref: {}, children: {}, child: {}, part: {} }, [], [], { mode: "open" });
const oh = new wi("DatePicker.Root");
class Cd {
  static create(e) {
    return oh.set(new Cd(e));
  }
  opts;
  constructor(e) {
    this.opts = e;
  }
}
function ih(t, e) {
  Ot(e, !0);
  let n = A(e, "open", 15, !1), r = A(e, "onOpenChange", 7, ia), o = A(e, "onOpenChangeComplete", 7, ia), s = A(e, "value", 15), l = A(e, "onValueChange", 7, ia), c = A(e, "placeholder", 15), u = A(e, "onPlaceholderChange", 7, ia), b = A(e, "isDateUnavailable", 7, () => !1), p = A(e, "validate", 7, ia), y = A(e, "onInvalid", 7, ia), x = A(e, "minValue", 7), f = A(e, "maxValue", 7), S = A(e, "disabled", 7, !1), w = A(e, "readonly", 7, !1), m = A(e, "granularity", 7), i = A(e, "readonlySegments", 23, () => []), O = A(e, "hourCycle", 7), J = A(e, "locale", 7), N = A(e, "hideTimeZone", 7, !1), Z = A(e, "required", 7, !1), ge = A(e, "calendarLabel", 7, "Event"), _ = A(e, "disableDaysOutsideMonth", 7, !0), se = A(e, "preventDeselect", 7, !1), Re = A(e, "pagedNavigation", 7, !1), Ee = A(e, "weekStartsOn", 7), fe = A(e, "weekdayFormat", 7, "narrow"), de = A(e, "isDateDisabled", 7, () => !1), re = A(e, "fixedWeeks", 7, !1), _e = A(e, "numberOfMonths", 7, 1), ie = A(e, "closeOnDateSelect", 7, !0), Ce = A(e, "initialFocus", 7, !1), X = A(e, "errorMessageId", 7), W = A(e, "children", 7), te = A(e, "monthFormat", 7, "long"), xe = A(e, "yearFormat", 7, "numeric");
  const Ne = Ep({
    granularity: m(),
    defaultValue: s(),
    minValue: x(),
    maxValue: f()
  });
  function ne() {
    c() === void 0 && c(Ne);
  }
  ne(), ro.pre(() => c(), () => {
    ne();
  });
  function E() {
    ie() && n(!1);
  }
  const L = Cd.create({
    open: Me(() => n(), (V) => {
      n(V), r()(V);
    }),
    value: Me(() => s(), (V) => {
      s(V), l()(V);
    }),
    placeholder: Me(() => c(), (V) => {
      c(V), u()(V);
    }),
    isDateUnavailable: Me(() => b()),
    minValue: Me(() => x()),
    maxValue: Me(() => f()),
    disabled: Me(() => S()),
    readonly: Me(() => w()),
    granularity: Me(() => m()),
    readonlySegments: Me(() => i()),
    hourCycle: Me(() => O()),
    locale: $h(() => J()),
    hideTimeZone: Me(() => N()),
    required: Me(() => Z()),
    calendarLabel: Me(() => ge()),
    disableDaysOutsideMonth: Me(() => _()),
    preventDeselect: Me(() => se()),
    pagedNavigation: Me(() => Re()),
    weekStartsOn: Me(() => Ee()),
    weekdayFormat: Me(() => fe()),
    isDateDisabled: Me(() => de()),
    fixedWeeks: Me(() => re()),
    numberOfMonths: Me(() => _e()),
    initialFocus: Me(() => Ce()),
    onDateSelect: Me(() => E),
    defaultPlaceholder: Ne,
    monthFormat: Me(() => te()),
    yearFormat: Me(() => xe())
  });
  Bf.create({
    open: L.opts.open,
    onOpenChangeComplete: Me(() => o())
  }), ud.create({
    value: L.opts.value,
    disabled: L.opts.disabled,
    readonly: L.opts.readonly,
    readonlySegments: L.opts.readonlySegments,
    validate: Me(() => p()),
    onInvalid: Me(() => y()),
    minValue: L.opts.minValue,
    maxValue: L.opts.maxValue,
    granularity: L.opts.granularity,
    hideTimeZone: L.opts.hideTimeZone,
    hourCycle: L.opts.hourCycle,
    locale: L.opts.locale,
    required: L.opts.required,
    placeholder: L.opts.placeholder,
    errorMessageId: Me(() => X()),
    isInvalidProp: Me(() => {
    })
  });
  var B = {
    get open() {
      return n();
    },
    set open(V = !1) {
      n(V), I();
    },
    get onOpenChange() {
      return r();
    },
    set onOpenChange(V = ia) {
      r(V), I();
    },
    get onOpenChangeComplete() {
      return o();
    },
    set onOpenChangeComplete(V = ia) {
      o(V), I();
    },
    get value() {
      return s();
    },
    set value(V) {
      s(V), I();
    },
    get onValueChange() {
      return l();
    },
    set onValueChange(V = ia) {
      l(V), I();
    },
    get placeholder() {
      return c();
    },
    set placeholder(V) {
      c(V), I();
    },
    get onPlaceholderChange() {
      return u();
    },
    set onPlaceholderChange(V = ia) {
      u(V), I();
    },
    get isDateUnavailable() {
      return b();
    },
    set isDateUnavailable(V = () => !1) {
      b(V), I();
    },
    get validate() {
      return p();
    },
    set validate(V = ia) {
      p(V), I();
    },
    get onInvalid() {
      return y();
    },
    set onInvalid(V = ia) {
      y(V), I();
    },
    get minValue() {
      return x();
    },
    set minValue(V) {
      x(V), I();
    },
    get maxValue() {
      return f();
    },
    set maxValue(V) {
      f(V), I();
    },
    get disabled() {
      return S();
    },
    set disabled(V = !1) {
      S(V), I();
    },
    get readonly() {
      return w();
    },
    set readonly(V = !1) {
      w(V), I();
    },
    get granularity() {
      return m();
    },
    set granularity(V) {
      m(V), I();
    },
    get readonlySegments() {
      return i();
    },
    set readonlySegments(V = []) {
      i(V), I();
    },
    get hourCycle() {
      return O();
    },
    set hourCycle(V) {
      O(V), I();
    },
    get locale() {
      return J();
    },
    set locale(V) {
      J(V), I();
    },
    get hideTimeZone() {
      return N();
    },
    set hideTimeZone(V = !1) {
      N(V), I();
    },
    get required() {
      return Z();
    },
    set required(V = !1) {
      Z(V), I();
    },
    get calendarLabel() {
      return ge();
    },
    set calendarLabel(V = "Event") {
      ge(V), I();
    },
    get disableDaysOutsideMonth() {
      return _();
    },
    set disableDaysOutsideMonth(V = !0) {
      _(V), I();
    },
    get preventDeselect() {
      return se();
    },
    set preventDeselect(V = !1) {
      se(V), I();
    },
    get pagedNavigation() {
      return Re();
    },
    set pagedNavigation(V = !1) {
      Re(V), I();
    },
    get weekStartsOn() {
      return Ee();
    },
    set weekStartsOn(V) {
      Ee(V), I();
    },
    get weekdayFormat() {
      return fe();
    },
    set weekdayFormat(V = "narrow") {
      fe(V), I();
    },
    get isDateDisabled() {
      return de();
    },
    set isDateDisabled(V = () => !1) {
      de(V), I();
    },
    get fixedWeeks() {
      return re();
    },
    set fixedWeeks(V = !1) {
      re(V), I();
    },
    get numberOfMonths() {
      return _e();
    },
    set numberOfMonths(V = 1) {
      _e(V), I();
    },
    get closeOnDateSelect() {
      return ie();
    },
    set closeOnDateSelect(V = !0) {
      ie(V), I();
    },
    get initialFocus() {
      return Ce();
    },
    set initialFocus(V = !1) {
      Ce(V), I();
    },
    get errorMessageId() {
      return X();
    },
    set errorMessageId(V) {
      X(V), I();
    },
    get children() {
      return W();
    },
    set children(V) {
      W(V), I();
    },
    get monthFormat() {
      return te();
    },
    set monthFormat(V = "long") {
      te(V), I();
    },
    get yearFormat() {
      return xe();
    },
    set yearFormat(V = "numeric") {
      xe(V), I();
    }
  }, oe = Oe(), pe = ee(oe);
  return He(pe, () => Nh, (V, Ae) => {
    Ae(V, {
      children: (ot, ht) => {
        var he = Oe(), Le = ee(he);
        Mt(Le, () => W() ?? Ir), D(ot, he);
      },
      $$slots: { default: !0 }
    });
  }), D(t, oe), Lt(B);
}
Ft(
  ih,
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
var jv = j("<div><!></div>");
function lh(t, e) {
  const n = Yr();
  Ot(e, !0);
  let r = A(e, "children", 7), o = A(e, "child", 7), s = A(e, "id", 23, () => Yt(n)), l = A(e, "ref", 15, null), c = Sr(e, [
    "$$slots",
    "$$events",
    "$$legacy",
    "$$host",
    "children",
    "child",
    "id",
    "ref"
  ]);
  const u = oh.get(), b = Zl.create({
    id: Me(() => s()),
    ref: Me(() => l(), (m) => l(m)),
    calendarLabel: u.opts.calendarLabel,
    fixedWeeks: u.opts.fixedWeeks,
    isDateDisabled: u.opts.isDateDisabled,
    isDateUnavailable: u.opts.isDateUnavailable,
    locale: u.opts.locale,
    numberOfMonths: u.opts.numberOfMonths,
    pagedNavigation: u.opts.pagedNavigation,
    preventDeselect: u.opts.preventDeselect,
    readonly: u.opts.readonly,
    type: Me(() => "single"),
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
    maxDays: Me(() => {
    }),
    monthFormat: u.opts.monthFormat,
    yearFormat: u.opts.yearFormat
  }), p = R(() => Rr(c, b.props));
  var y = {
    get children() {
      return r();
    },
    set children(m) {
      r(m), I();
    },
    get child() {
      return o();
    },
    set child(m) {
      o(m), I();
    },
    get id() {
      return s();
    },
    set id(m = Yt(n)) {
      s(m), I();
    },
    get ref() {
      return l();
    },
    set ref(m = null) {
      l(m), I();
    }
  }, x = Oe(), f = ee(x);
  {
    var S = (m) => {
      var i = Oe(), O = ee(i);
      {
        let J = R(() => ({ props: a(p), ...b.snippetProps }));
        Mt(O, o, () => a(J));
      }
      D(m, i);
    }, w = (m) => {
      var i = jv();
      Kr(i, () => ({ ...a(p) }));
      var O = M(i);
      Mt(O, () => r() ?? Ir, () => b.snippetProps), T(i), D(m, i);
    };
    we(f, (m) => {
      o() ? m(S) : m(w, -1);
    });
  }
  return D(t, x), Lt(y);
}
Ft(lh, { children: {}, child: {}, id: {}, ref: {} }, [], [], { mode: "open" });
function dh(t, e) {
  Ot(e, !0);
  let n = A(e, "ref", 15, null), r = A(e, "onOpenAutoFocus", 7), o = Sr(e, [
    "$$slots",
    "$$events",
    "$$legacy",
    "$$host",
    "ref",
    "onOpenAutoFocus"
  ]);
  const s = R(() => Rr({ onOpenAutoFocus: r() }, { onOpenAutoFocus: gv }));
  var l = {
    get ref() {
      return n();
    },
    set ref(c = null) {
      n(c), I();
    },
    get onOpenAutoFocus() {
      return r();
    },
    set onOpenAutoFocus(c) {
      r(c), I();
    }
  };
  return Uf(t, so(() => a(s), () => o, {
    get ref() {
      return n();
    },
    set ref(c) {
      n(c);
    }
  })), Lt(l);
}
Ft(dh, { ref: {}, onOpenAutoFocus: {} }, [], [], { mode: "open" });
function ch(t, e) {
  Ot(e, !0);
  let n = A(e, "ref", 15, null), r = A(e, "onkeydown", 7), o = Sr(e, [
    "$$slots",
    "$$events",
    "$$legacy",
    "$$host",
    "ref",
    "onkeydown"
  ]);
  function s(u) {
    if (Ko(u.key)) {
      const p = u.currentTarget.closest(cd.selector("input"));
      if (!p) return;
      jo(u, p);
    }
  }
  const l = R(() => Rr({ onkeydown: r() }, { onkeydown: s }));
  var c = {
    get ref() {
      return n();
    },
    set ref(u = null) {
      n(u), I();
    },
    get onkeydown() {
      return r();
    },
    set onkeydown(u) {
      r(u), I();
    }
  };
  return qf(t, so(() => o, { "data-segment": "trigger" }, () => a(l), {
    get ref() {
      return n();
    },
    set ref(u) {
      n(u);
    }
  })), Lt(c);
}
Ft(ch, { ref: {}, onkeydown: {} }, [], [], { mode: "open" });
var Kv = j('<div class="copy-icon svg-icon" aria-hidden="true"></div> <span> </span>', 1), Yv = j('<div class="raw-json-icon svg-icon" aria-hidden="true"></div> <span> </span>', 1), zv = j('<div class="open-in-new-icon svg-icon" aria-hidden="true"></div> <span> </span>', 1), Qv = j("<!> <!>", 1), Wv = j("<!> <!>", 1), Jv = j("<!> <!>", 1), Gv = j('<div class="broadcast-icon svg-icon" aria-hidden="true"></div> <span> </span>', 1), Zv = j('<div class="trash-icon svg-icon" aria-hidden="true"></div> <span> </span>', 1), Xv = j("<!> <!>", 1), eg = j("<!> <!> <!> <!>", 1);
const tg = {
  hash: "svelte-8tu42h",
  code: ".open-in-new-icon {mask-image:var(--ehagaki-icon-6f70656e5f696e5f6e65775f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}"
};
function Ho(t, e) {
  Ot(e, !0), $a(t, tg);
  const n = () => xs(Bs, "$_", r), [r, o] = Ns(), s = (W) => {
    var te = Oe(), xe = ee(te);
    He(xe, () => Xn, (Ne, ne) => {
      ne(Ne, {
        class: "menu-action-button",
        get onpointerdown() {
          return S();
        },
        get onSelect() {
          return w();
        },
        children: (E, L) => {
          var B = Kv(), oe = F(ee(B), 2), pe = M(oe, !0);
          T(oe), me((V) => G(pe, V), [
            () => u() ? n()("postHistory.copyFailed") : n()("postHistory.copyNevent")
          ]), D(E, B);
        },
        $$slots: { default: !0 }
      });
    }), D(W, te);
  }, l = (W) => {
    var te = Oe(), xe = ee(te);
    He(xe, () => Xn, (Ne, ne) => {
      ne(Ne, {
        class: "menu-action-button",
        onSelect: () => O()(),
        children: (E, L) => {
          var B = Yv(), oe = F(ee(B), 2), pe = M(oe, !0);
          T(oe), me((V) => G(pe, V), [() => n()("postHistory.rawJson")]), D(E, B);
        },
        $$slots: { default: !0 }
      });
    }), D(W, te);
  };
  let c = A(e, "order", 7), u = A(e, "copyFailed", 7), b = A(e, "showBroadcast", 7), p = A(e, "broadcastSending", 7), y = A(e, "showDelete", 7), x = A(e, "showDeleteSeparator", 7), f = A(e, "deletionSending", 7), S = A(e, "onCopyPointerDown", 7), w = A(e, "onCopyNevent", 7), m = A(e, "externalClientLabel", 7, void 0), i = A(e, "onOpenExternalClient", 7, void 0), O = A(e, "onShowRawJson", 7), J = A(e, "onBroadcastPointerDown", 7), N = A(e, "onBroadcastPost", 7), Z = A(e, "onOpenDeleteConfirm", 7);
  var ge = {
    get order() {
      return c();
    },
    set order(W) {
      c(W), I();
    },
    get copyFailed() {
      return u();
    },
    set copyFailed(W) {
      u(W), I();
    },
    get showBroadcast() {
      return b();
    },
    set showBroadcast(W) {
      b(W), I();
    },
    get broadcastSending() {
      return p();
    },
    set broadcastSending(W) {
      p(W), I();
    },
    get showDelete() {
      return y();
    },
    set showDelete(W) {
      y(W), I();
    },
    get showDeleteSeparator() {
      return x();
    },
    set showDeleteSeparator(W) {
      x(W), I();
    },
    get deletionSending() {
      return f();
    },
    set deletionSending(W) {
      f(W), I();
    },
    get onCopyPointerDown() {
      return S();
    },
    set onCopyPointerDown(W) {
      S(W), I();
    },
    get onCopyNevent() {
      return w();
    },
    set onCopyNevent(W) {
      w(W), I();
    },
    get externalClientLabel() {
      return m();
    },
    set externalClientLabel(W = void 0) {
      m(W), I();
    },
    get onOpenExternalClient() {
      return i();
    },
    set onOpenExternalClient(W = void 0) {
      i(W), I();
    },
    get onShowRawJson() {
      return O();
    },
    set onShowRawJson(W) {
      O(W), I();
    },
    get onBroadcastPointerDown() {
      return J();
    },
    set onBroadcastPointerDown(W) {
      J(W), I();
    },
    get onBroadcastPost() {
      return N();
    },
    set onBroadcastPost(W) {
      N(W), I();
    },
    get onOpenDeleteConfirm() {
      return Z();
    },
    set onOpenDeleteConfirm(W) {
      Z(W), I();
    }
  }, _ = eg(), se = ee(_);
  {
    var Re = (W) => {
      var te = Qv(), xe = ee(te);
      He(xe, () => Xn, (ne, E) => {
        E(ne, {
          class: "menu-action-button",
          get onSelect() {
            return i();
          },
          children: (L, B) => {
            var oe = zv(), pe = F(ee(oe), 2), V = M(pe, !0);
            T(pe), me(() => G(V, m())), D(L, oe);
          },
          $$slots: { default: !0 }
        });
      });
      var Ne = F(xe, 2);
      He(Ne, () => ts, (ne, E) => {
        E(ne, { class: "post-history-menu-separator" });
      }), D(W, te);
    };
    we(se, (W) => {
      m() && i() && W(Re);
    });
  }
  var Ee = F(se, 2);
  {
    var fe = (W) => {
      var te = Wv(), xe = ee(te);
      l(xe);
      var Ne = F(xe, 2);
      s(Ne), D(W, te);
    }, de = (W) => {
      var te = Jv(), xe = ee(te);
      s(xe);
      var Ne = F(xe, 2);
      l(Ne), D(W, te);
    };
    we(Ee, (W) => {
      c() === "raw-json-first" ? W(fe) : W(de, -1);
    });
  }
  var re = F(Ee, 2);
  {
    var _e = (W) => {
      var te = Oe(), xe = ee(te);
      He(xe, () => Xn, (Ne, ne) => {
        ne(Ne, {
          class: "menu-action-button",
          get disabled() {
            return p();
          },
          get onpointerdown() {
            return J();
          },
          get onSelect() {
            return N();
          },
          children: (E, L) => {
            var B = Gv(), oe = F(ee(B), 2), pe = M(oe, !0);
            T(oe), me((V) => G(pe, V), [() => n()("postHistory.broadcast")]), D(E, B);
          },
          $$slots: { default: !0 }
        });
      }), D(W, te);
    };
    we(re, (W) => {
      b() && W(_e);
    });
  }
  var ie = F(re, 2);
  {
    var Ce = (W) => {
      var te = Xv(), xe = ee(te);
      {
        var Ne = (E) => {
          var L = Oe(), B = ee(L);
          He(B, () => ts, (oe, pe) => {
            pe(oe, { class: "post-history-menu-separator" });
          }), D(E, L);
        };
        we(xe, (E) => {
          x() && E(Ne);
        });
      }
      var ne = F(xe, 2);
      He(ne, () => Xn, (E, L) => {
        L(E, {
          class: "menu-action-button menu-action-button-danger",
          get disabled() {
            return f();
          },
          onSelect: () => Z()(),
          children: (B, oe) => {
            var pe = Zv(), V = F(ee(pe), 2), Ae = M(V, !0);
            T(V), me((ot) => G(Ae, ot), [
              () => f() ? n()("postHistory.deleteSending") : n()("postHistory.delete")
            ]), D(B, pe);
          },
          $$slots: { default: !0 }
        });
      }), D(W, te);
    };
    we(ie, (W) => {
      y() && W(Ce);
    });
  }
  D(t, _);
  var X = Lt(ge);
  return o(), X;
}
Ft(
  Ho,
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
var ng = j('<img class="post-history-related-avatar svelte-1g9bqtt"/>'), rg = j('<span class="post-history-related-avatar-placeholder svelte-1g9bqtt" aria-hidden="true"></span>'), ag = j('<article class="post-history-related-card svelte-1g9bqtt"><!> <div class="post-history-related-card-body svelte-1g9bqtt"><div class="post-history-related-author svelte-1g9bqtt"><!> <span class="post-history-related-author-name svelte-1g9bqtt"> </span></div> <!> <!></div></article>');
const sg = {
  hash: "svelte-1g9bqtt",
  code: `.post-history-related-card.svelte-1g9bqtt {display:grid;--post-history-related-card-bg: color-mix(\r
            in srgb,\r
            var(--dialog-bg),\r
            var(--border-hr) 24%\r
        );border-inline-start:2px solid\r
            color-mix(in srgb, var(--theme), transparent 45%);background:var(--post-history-related-card-bg);color:var(--text);font-size:0.9rem;padding-inline-start:2px;}.post-history-related-card-body.svelte-1g9bqtt {display:grid;gap:2px;padding:2px 10px 0 8px;}.post-history-related-author.svelte-1g9bqtt {display:flex;align-items:center;min-width:0;gap:8px;}.post-history-related-avatar.svelte-1g9bqtt,\r
    .post-history-related-avatar-placeholder.svelte-1g9bqtt {width:24px;height:24px;flex:0 0 auto;border-radius:50%;background:var(--border-hr);object-fit:cover;}.post-history-related-avatar-placeholder.svelte-1g9bqtt {display:inline-block;mask-image:var(--ehagaki-icon-6163636f756e745f636972636c655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);background-color:var(--text-muted);}.post-history-related-author-name.svelte-1g9bqtt {min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:600;}.post-history-related-card .post-history-related-content {margin:0;white-space:pre-wrap;overflow-wrap:anywhere;line-height:1.45;}`
};
function wd(t, e) {
  Ot(e, !0), $a(t, sg);
  let n = A(e, "event", 7), r = A(e, "profile", 7, null), o = A(e, "media", 7, void 0), s = A(e, "model", 7, void 0), l = A(e, "emojiLoadStateByUrl", 23, () => ({})), c = A(e, "emojiImageMetaByUrl", 23, () => ({})), u = A(e, "scrollRoot", 7, null), b = A(e, "onImageOpen", 7, void 0), p = A(e, "topActions", 7, void 0), y = A(e, "footerLeftExtras", 7, void 0), x = A(e, "footerActions", 7, void 0), f = A(e, "footerMenu", 7, void 0), S = R(() => {
    const re = r()?.displayName?.trim() || r()?.name?.trim();
    return re || nu(fu.npubEncode(n().pubkey), 12, 4);
  }), w = R(() => s() ?? hl({
    sourceContent: n().content,
    tags: n().tags,
    media: o()
  })), m = R(() => fl(n().created_at * 1e3));
  var i = {
    get event() {
      return n();
    },
    set event(re) {
      n(re), I();
    },
    get profile() {
      return r();
    },
    set profile(re = null) {
      r(re), I();
    },
    get media() {
      return o();
    },
    set media(re = void 0) {
      o(re), I();
    },
    get model() {
      return s();
    },
    set model(re = void 0) {
      s(re), I();
    },
    get emojiLoadStateByUrl() {
      return l();
    },
    set emojiLoadStateByUrl(re = {}) {
      l(re), I();
    },
    get emojiImageMetaByUrl() {
      return c();
    },
    set emojiImageMetaByUrl(re = {}) {
      c(re), I();
    },
    get scrollRoot() {
      return u();
    },
    set scrollRoot(re = null) {
      u(re), I();
    },
    get onImageOpen() {
      return b();
    },
    set onImageOpen(re = void 0) {
      b(re), I();
    },
    get topActions() {
      return p();
    },
    set topActions(re = void 0) {
      p(re), I();
    },
    get footerLeftExtras() {
      return y();
    },
    set footerLeftExtras(re = void 0) {
      y(re), I();
    },
    get footerActions() {
      return x();
    },
    set footerActions(re = void 0) {
      x(re), I();
    },
    get footerMenu() {
      return f();
    },
    set footerMenu(re = void 0) {
      f(re), I();
    }
  }, O = ag(), J = M(O);
  Mt(J, () => p() ?? Ir);
  var N = F(J, 2), Z = M(N), ge = M(Z);
  {
    var _ = (re) => {
      var _e = ng();
      me(() => {
        Hn(_e, "src", r().picture), Hn(_e, "alt", a(S));
      }), D(re, _e);
    }, se = (re) => {
      var _e = rg();
      D(re, _e);
    };
    we(ge, (re) => {
      r()?.picture ? re(_) : re(se, -1);
    });
  }
  var Re = F(ge, 2), Ee = M(Re, !0);
  T(Re), T(Z);
  var fe = F(Z, 2);
  tu(fe, {
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
  var de = F(fe, 2);
  return Cu(de, {
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
  }), T(N), T(O), me(() => G(Ee, a(S))), D(t, O), Lt(i);
}
Ft(
  wd,
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
var og = j('<article class="post-history-quote-status-card svelte-1rnem6w"><div class="post-history-quote-status-body svelte-1rnem6w"><p> </p> <!></div></article>');
const ig = {
  hash: "svelte-1rnem6w",
  code: `.post-history-quote-status-card.svelte-1rnem6w {display:grid;border-inline-start:2px solid
            color-mix(in srgb, var(--theme), transparent 45%);background:color-mix(in srgb, var(--dialog-bg), var(--border-hr) 24%);color:var(--text);font-size:0.9rem;}.post-history-quote-status-body.svelte-1rnem6w {display:grid;gap:8px;padding:2px 10px 10px;}.post-history-quote-status-message.svelte-1rnem6w {margin:0;color:var(--text-muted);line-height:1.45;}.post-history-quote-status-error.svelte-1rnem6w {color:var(--danger);}.post-history-quote-retry-button {justify-self:start;}`
};
function uh(t, e) {
  Ot(e, !0), $a(t, ig);
  const n = () => xs(Bs, "$_", r), [r, o] = Ns();
  let s = A(e, "preview", 7), l = A(e, "model", 7, void 0), c = A(e, "emojiLoadStateByUrl", 23, () => ({})), u = A(e, "emojiImageMetaByUrl", 23, () => ({})), b = A(e, "scrollRoot", 7, null), p = A(e, "onImageOpen", 7, void 0), y = A(e, "onRetry", 7, void 0), x = A(e, "footerMenu", 7, void 0);
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
  var S = {
    get preview() {
      return s();
    },
    set preview(N) {
      s(N), I();
    },
    get model() {
      return l();
    },
    set model(N = void 0) {
      l(N), I();
    },
    get emojiLoadStateByUrl() {
      return c();
    },
    set emojiLoadStateByUrl(N = {}) {
      c(N), I();
    },
    get emojiImageMetaByUrl() {
      return u();
    },
    set emojiImageMetaByUrl(N = {}) {
      u(N), I();
    },
    get scrollRoot() {
      return b();
    },
    set scrollRoot(N = null) {
      b(N), I();
    },
    get onImageOpen() {
      return p();
    },
    set onImageOpen(N = void 0) {
      p(N), I();
    },
    get onRetry() {
      return y();
    },
    set onRetry(N = void 0) {
      y(N), I();
    },
    get footerMenu() {
      return x();
    },
    set footerMenu(N = void 0) {
      x(N), I();
    }
  }, w = Oe(), m = ee(w);
  {
    var i = (N) => {
      wd(N, {
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
          return p();
        },
        get footerMenu() {
          return x();
        }
      });
    }, O = (N) => {
      var Z = og(), ge = M(Z), _ = M(ge);
      let se;
      var Re = M(_, !0);
      T(_);
      var Ee = F(_, 2);
      {
        var fe = (de) => {
          ir(de, {
            type: "button",
            className: "post-history-quote-retry-button",
            onClick: () => y()?.(s().eventId),
            children: (re, _e) => {
              Fs();
              var ie = ss();
              me((Ce) => G(ie, Ce), [() => n()("postHistory.contextRetry")]), D(re, ie);
            },
            $$slots: { default: !0 }
          });
        };
        we(Ee, (de) => {
          s().status === "error" && de(fe);
        });
      }
      T(ge), T(Z), me(
        (de) => {
          se = Oa(_, 1, "post-history-quote-status-message svelte-1rnem6w", null, se, {
            "post-history-quote-status-error": s().status === "error"
          }), G(Re, de);
        },
        [() => f()]
      ), D(N, Z);
    };
    we(m, (N) => {
      s().status === "resolved" ? N(i) : N(O, -1);
    });
  }
  D(t, w);
  var J = Lt(S);
  return o(), J;
}
Ft(
  uh,
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
const lg = 500, dg = 250, cg = /^[0-9a-f]{64}$/;
function ug() {
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
function hg(t) {
  return { ...t };
}
function fg(t) {
  return t.tags.filter(
    (e) => e[0] === "e" && typeof e[1] == "string" && cg.test(e[1])
  ).length;
}
class pg {
  postHistoryRepository;
  deletionRequestsRepository;
  constructor(e = {}) {
    this.postHistoryRepository = e.postHistoryRepository ?? it, this.deletionRequestsRepository = e.deletionRequestsRepository ?? oo;
  }
  async importFile(e) {
    const n = ug(), r = /* @__PURE__ */ new Set(), o = [];
    let s = !1, l = null;
    const c = Number.isFinite(e.file.size) && e.file.size > 0 ? e.file.size : 0;
    let u = 0;
    const b = () => n.invalidJsonCount > 0 || n.invalidStructureCount > 0 || n.invalidIdOrSignatureCount > 0, p = () => e.signal?.aborted ? "cancelled" : e.getCurrentPubkeyHex() !== e.ownerPubkeyHex ? "account-changed" : null, y = (N = !1) => {
      if (!e.onProgress)
        return;
      const Z = performance.now();
      !N && l !== null && Z - l < dg || (l = Z, e.onProgress({
        result: hg(n),
        processedBytes: u,
        totalBytes: c
      }));
    }, x = (N) => {
      N <= 0 || (u = Math.min(
        c,
        Math.max(u, u + N)
      ));
    }, f = async () => {
      if (o.length === 0)
        return p();
      const N = p();
      if (N)
        return o.length = 0, N;
      const Z = o.filter((se) => se.type === "post").map((se) => ({
        event: se.event,
        attestation: se.attestation
      })), ge = o.filter((se) => se.type === "deletion").map((se) => se.event);
      if (o.length = 0, Z.length > 0)
        try {
          const se = await this.postHistoryRepository.upsertFetchedEvents({
            events: Z
          });
          n.insertedPostCount += se.insertedCount, n.updatedPostCount += se.updatedCount, n.unchangedPostCount += se.unchangedCount, n.appliedDeletionPostCount += se.appliedDeletionCount;
        } catch {
          n.failedPostEventCount += Z.length, s = !0;
        }
      const _ = p();
      if (_)
        return _;
      if (ge.length > 0)
        try {
          const se = await this.deletionRequestsRepository.upsertImportedDeletionEvents({
            ownerPubkeyHex: e.ownerPubkeyHex,
            deletionEvents: ge
          });
          n.insertedDeletionRequestCount += se.insertedCount, n.updatedDeletionRequestCount += se.updatedCount, n.unchangedDeletionRequestCount += se.unchangedCount, n.unsupportedDeletionEventCount += se.ignoredCount, n.appliedDeletionPostCount += se.appliedDeletionCount;
        } catch {
          n.failedDeletionEventCount += ge.length, s = !0;
        }
      return y(), p();
    }, S = async (N) => {
      const Z = p();
      if (Z)
        return Z;
      if (N.trim().length === 0)
        return null;
      n.nonEmptyLineCount += 1;
      let ge;
      try {
        ge = JSON.parse(N);
      } catch {
        return n.invalidJsonCount += 1, null;
      }
      if (!Fl(ge))
        return n.invalidStructureCount += 1, null;
      const _ = ge;
      if (_.pubkey !== e.ownerPubkeyHex)
        return n.otherAccountCount += 1, null;
      if (_.kind !== 1 && _.kind !== 42 && _.kind !== 5)
        return n.unsupportedKindCount += 1, null;
      const se = Bh(_);
      if (!se)
        return n.invalidIdOrSignatureCount += 1, null;
      if (r.has(_.id))
        return n.fileDuplicateCount += 1, null;
      if (r.add(_.id), _.kind === 1 || _.kind === 42)
        n.uniquePostEventCount += 1, o.push({ type: "post", ...se });
      else if (_.kind === 5) {
        n.uniqueDeletionEventCount += 1;
        const Re = fg(_);
        if (n.validDeletionETagCount += Re, Re === 0)
          return n.unsupportedDeletionEventCount += 1, null;
        o.push({ type: "deletion", ...se });
      }
      return o.length >= lg ? f() : null;
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
        const N = p();
        if (N)
          return n.status = N, await w.cancel().catch(() => {
          }), o.length = 0, y(!0), n;
        const Z = await w.read();
        if (Z.done) {
          if (O += i.decode(), O.length > 0) {
            const _ = await S(O.replace(/\r$/, ""));
            if (_)
              return n.status = _, o.length = 0, y(!0), n;
          }
          break;
        }
        O += i.decode(Z.value, { stream: !0 });
        const ge = O.split(`
`);
        O = ge.pop() ?? "";
        for (const _ of ge) {
          const se = await S(_.replace(/\r$/, ""));
          if (se)
            return n.status = se, await w.cancel().catch(() => {
            }), o.length = 0, y(!0), n;
        }
        x(Z.value.byteLength), y();
      }
    } catch {
      const N = p();
      if (N)
        return n.status = N, o.length = 0, y(!0), n;
      const Z = await f();
      return Z ? (n.status = Z, y(!0), n) : (n.status = n.nonEmptyLineCount > 0 ? "partial" : "failed", y(!0), n);
    } finally {
      e.signal?.removeEventListener("abort", m), w.releaseLock();
    }
    const J = await f();
    return J ? (n.status = J, y(!0), n) : (n.status = s || b() ? "partial" : "completed", y(!0), n);
  }
}
const vg = new pg();
var gg = j('<div class="xmark-icon svg-icon svelte-1qfqhib" aria-hidden="true"></div>'), yg = j('<span class="import-icon svg-icon svelte-1qfqhib" aria-hidden="true"></span> <span> </span>', 1), mg = j('<div aria-live="polite"> </div>'), bg = j('<div class="import-progress-indicator"></div>'), Cg = j('<div class="import-progress svelte-1qfqhib"><!> <div class="import-progress-summary svelte-1qfqhib"><span class="import-progress-metric svelte-1qfqhib"><span> </span> <span class="import-progress-number svelte-1qfqhib"> </span></span> <span class="import-progress-metric svelte-1qfqhib"><span> </span> <span class="import-progress-number svelte-1qfqhib"> </span></span> <span class="import-progress-metric svelte-1qfqhib"><span> </span> <span class="import-progress-number svelte-1qfqhib"> </span></span></div> <!></div>'), wg = j('<div class="import-results svelte-1qfqhib"><section aria-labelledby="post-history-import-input-heading" class="svelte-1qfqhib"><h3 id="post-history-import-input-heading" class="svelte-1qfqhib"> </h3> <dl class="svelte-1qfqhib"><div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div> <div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div> <div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div> <div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div> <div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div> <div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div> <div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div></dl></section> <section aria-labelledby="post-history-import-post-heading" class="svelte-1qfqhib"><h3 id="post-history-import-post-heading" class="svelte-1qfqhib"> </h3> <dl class="svelte-1qfqhib"><div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div> <div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div> <div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div> <div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div> <div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div> <div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div></dl></section> <section aria-labelledby="post-history-import-deletion-heading" class="svelte-1qfqhib"><h3 id="post-history-import-deletion-heading" class="svelte-1qfqhib"> </h3> <dl class="svelte-1qfqhib"><div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div> <div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div> <div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div> <div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div> <div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div> <div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div> <div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div></dl></section></div>'), Pg = j('<div class="import-heading svelte-1qfqhib"><h2 class="svelte-1qfqhib"> </h2> <p class="svelte-1qfqhib"> </p></div> <input class="visually-hidden import-file-input" type="file"/> <div role="presentation"><!> <p class="import-drop-hint svelte-1qfqhib"> </p></div> <!> <!>', 1);
const xg = {
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
function hh(t, e) {
  Ot(e, !0), $a(t, xg);
  const n = () => xs(Bs, "$_", r), [r, o] = Ns();
  let s = A(e, "open", 15, !1), l = A(e, "ownerPubkeyHex", 7), c = A(e, "getCurrentPubkeyHex", 7), u = A(e, "onOpenChange", 7, void 0), b = A(e, "onImported", 7, void 0), p = be(null), y = be(!1), x = be(null), f = be(null), S = be(0), w = be(0), m = be(0), i = be(0), O = null, J = null, N = null, Z = 0, ge = !1, _ = R(() => a(f)?.processedBytes ?? a(S)), se = R(() => a(f)?.totalBytes ?? a(w)), Re = R(() => a(se) <= 0 ? 0 : Math.min(100, Math.max(0, Math.round(a(_) / a(se) * 100)))), Ee = R(() => {
    if (a(_) <= 0 || a(se) <= 0 || a(_) >= a(se) || a(m) < 1e3)
      return null;
    const he = a(_) / a(m), Le = (a(se) - a(_)) / he;
    return Number.isFinite(Le) && Le >= 0 ? Le : null;
  }), fe = R(() => a(y) ? a(Ee) === null ? n()("postHistory.importRemainingTimeCalculating") : de(a(Ee)) : a(x)?.status === "completed" || a(x)?.status === "partial" ? de(0) : n()("postHistory.importRemainingTimeUnavailable"));
  function de(he) {
    const Le = Math.max(0, Math.floor(he / 1e3)), We = String(Le % 60).padStart(2, "0"), ae = Math.floor(Le / 60), Ge = ae % 60;
    return ae < 60 ? `${Ge}:${We}` : `${Math.floor(ae / 60)}:${String(Ge).padStart(2, "0")}:${We}`;
  }
  function re() {
    N !== null && g(m, Math.max(0, performance.now() - N), !0);
  }
  function _e() {
    J !== null && (clearInterval(J), J = null), N = null;
  }
  function ie() {
    _e(), g(m, 0), N = performance.now(), J = setInterval(re, 1e3);
  }
  function Ce() {
    _e(), g(f, null), g(S, 0), g(w, 0), g(m, 0);
  }
  function X(he) {
    return `translate: -${100 - he}% 0;`;
  }
  let W = R(() => a(y) ? "postHistory.importReading" : a(x) ? a(x).status === "completed" ? "postHistory.importComplete" : a(x).status === "partial" ? "postHistory.importPartial" : a(x).status === "account-changed" ? "postHistory.importAccountChanged" : a(x).status === "cancelled" ? "postHistory.importCancelled" : "postHistory.importFailed" : null);
  function te() {
    g(x, null), g(y, !1), Ce(), g(i, 0), O = null, a(p) && (a(p).value = "");
  }
  function xe() {
    Z += 1, O?.abort(), O = null, g(y, !1), Ce(), g(i, 0);
  }
  function Ne(he) {
    he || xe(), u()?.(he);
  }
  function ne() {
    !a(y) && l() && a(p)?.click();
  }
  function E(he) {
    return he ? Array.from(he.types).includes("Files") || he.files.length > 0 : !1;
  }
  function L(he) {
    E(he.dataTransfer) && (he.preventDefault(), g(i, a(i) + 1));
  }
  function B(he) {
    he.preventDefault(), E(he.dataTransfer);
  }
  function oe(he) {
    a(i) === 0 && !E(he.dataTransfer) || g(i, Math.max(0, a(i) - 1), !0);
  }
  function pe(he) {
    if (he.preventDefault(), !E(he.dataTransfer))
      return;
    g(i, 0);
    const Le = he.dataTransfer?.files[0];
    Le && V(Le);
  }
  async function V(he) {
    if (a(y) || !l())
      return;
    const Le = ++Z, We = new AbortController();
    O = We, g(y, !0), g(x, null), g(f, null), g(S, 0), g(w, Number.isFinite(he.size) && he.size > 0 ? he.size : 0, !0), ie();
    try {
      const ae = await vg.importFile({
        file: he,
        ownerPubkeyHex: l(),
        getCurrentPubkeyHex: c(),
        signal: We.signal,
        onProgress: (Pt) => {
          Le === Z && s() && (g(
            f,
            {
              result: { ...Pt.result },
              processedBytes: Pt.processedBytes,
              totalBytes: Pt.totalBytes
            },
            !0
          ), g(S, Pt.processedBytes, !0), g(w, Pt.totalBytes, !0), g(x, { ...Pt.result }, !0), re());
        }
      });
      if (Le !== Z || !s())
        return;
      g(x, ae, !0), ae.insertedPostCount + ae.updatedPostCount + ae.appliedDeletionPostCount > 0 && await b()?.();
    } finally {
      Le === Z && (g(y, !1), _e(), O = null);
    }
  }
  async function Ae(he) {
    const Le = he.currentTarget, We = Le.files?.[0];
    Le.value = "", We && await V(We);
  }
  ze(() => {
    s() && !ge ? te() : !s() && ge && xe(), ge = s();
  }), io(_e);
  var ot = {
    get open() {
      return s();
    },
    set open(he = !1) {
      s(he), I();
    },
    get ownerPubkeyHex() {
      return l();
    },
    set ownerPubkeyHex(he) {
      l(he), I();
    },
    get getCurrentPubkeyHex() {
      return c();
    },
    set getCurrentPubkeyHex(he) {
      c(he), I();
    },
    get onOpenChange() {
      return u();
    },
    set onOpenChange(he = void 0) {
      u(he), I();
    },
    get onImported() {
      return b();
    },
    set onImported(he = void 0) {
      b(he), I();
    }
  };
  {
    const he = (ae) => {
      var Ge = Oe(), Pt = ee(Ge);
      {
        const vt = (_t, gt) => {
          let Ut = () => gt?.().props;
          {
            let xt = R(() => n()("global.close"));
            ir(_t, so(Ut, {
              className: "modal-close",
              shape: "square",
              get ariaLabel() {
                return a(xt);
              },
              children: (nt, dt) => {
                var Rt = gg();
                D(nt, Rt);
              },
              $$slots: { default: !0 }
            }));
          }
        };
        He(Pt, () => bu, (_t, gt) => {
          gt(_t, { child: vt, $$slots: { child: !0 } });
        });
      }
      D(ae, Ge);
    };
    let Le = R(() => n()("postHistory.importTitle")), We = R(() => n()("postHistory.importDescription"));
    mu(t, {
      onOpenChange: Ne,
      get title() {
        return a(Le);
      },
      get description() {
        return a(We);
      },
      contentClass: "post-history-import-dialog",
      footerVariant: "close-button",
      initialFocus: "content",
      get open() {
        return s();
      },
      set open(ae) {
        s(ae);
      },
      footer: he,
      children: (ae, Ge) => {
        var Pt = Pg(), vt = ee(Pt), _t = M(vt), gt = M(_t, !0);
        T(_t);
        var Ut = F(_t, 2), xt = M(Ut, !0);
        T(Ut), T(vt);
        var nt = F(vt, 2);
        To(nt, (Tt) => g(p, Tt), () => a(p));
        var dt = F(nt, 2);
        let Rt;
        var $n = M(dt);
        {
          let Tt = R(() => a(y) || !l()), Ht = R(() => n()("postHistory.importChooseFile"));
          ir($n, {
            className: "post-history-import-file-button",
            variant: "default",
            shape: "pill",
            get disabled() {
              return a(Tt);
            },
            get ariaLabel() {
              return a(Ht);
            },
            onClick: ne,
            children: (tn, xn) => {
              var on = yg(), Rn = F(ee(on), 2), fn = M(Rn, !0);
              T(Rn), me((Er) => G(fn, Er), [() => n()("postHistory.importChooseFile")]), D(tn, on);
            },
            $$slots: { default: !0 }
          });
        }
        var qe = F($n, 2), qn = M(qe, !0);
        T(qe), T(dt);
        var wn = F(dt, 2);
        {
          var Pn = (Tt) => {
            var Ht = Cg(), tn = M(Ht);
            {
              var xn = (Sn) => {
                var vn = mg();
                let hr;
                var kr = M(vn, !0);
                T(vn), me(
                  (gr) => {
                    hr = Oa(vn, 1, "import-progress-status svelte-1qfqhib", null, hr, {
                      "import-progress-status-error": a(x)?.status === "failed"
                    }), G(kr, gr);
                  },
                  [() => n()(a(W))]
                ), D(Sn, vn);
              };
              we(tn, (Sn) => {
                a(W) && Sn(xn);
              });
            }
            var on = F(tn, 2), Rn = M(on), fn = M(Rn), Er = M(fn, !0);
            T(fn);
            var pn = F(fn, 2), rt = M(pn);
            T(pn), T(Rn);
            var Mn = F(Rn, 2), St = M(Mn), On = M(St, !0);
            T(St);
            var qt = F(St, 2), Ue = M(qt, !0);
            T(qt), T(Mn);
            var ln = F(Mn, 2), cr = M(ln), ur = M(cr, !0);
            T(cr);
            var Nn = F(cr, 2), Ar = M(Nn, !0);
            T(Nn), T(ln), T(on);
            var Zr = F(on, 2);
            {
              let Sn = R(() => n()("postHistory.importProgressBarLabel")), vn = R(() => `${a(Re)}%`);
              He(Zr, () => Uh, (hr, kr) => {
                kr(hr, {
                  get value() {
                    return a(Re);
                  },
                  max: 100,
                  get "aria-label"() {
                    return a(Sn);
                  },
                  get "aria-valuetext"() {
                    return a(vn);
                  },
                  class: "import-progress-root",
                  children: (gr, ua) => {
                    var Vn = bg();
                    me((ha) => xi(Vn, ha), [() => X(a(Re))]), D(gr, Vn);
                  },
                  $$slots: { default: !0 }
                });
              });
            }
            T(Ht), me(
              (Sn, vn, hr, kr, gr) => {
                Hn(Ht, "aria-label", Sn), G(Er, vn), G(rt, `${a(Re) ?? ""}%`), G(On, hr), G(Ue, kr), G(ur, gr), G(Ar, a(fe));
              },
              [
                () => n()("postHistory.importProgress"),
                () => n()("postHistory.importProgress"),
                () => n()("postHistory.importElapsedTime"),
                () => de(a(m)),
                () => n()("postHistory.importEstimatedRemainingTime")
              ]
            ), D(Tt, Ht);
          };
          we(wn, (Tt) => {
            (a(y) || a(x)) && Tt(Pn);
          });
        }
        var _r = F(wn, 2);
        {
          var dr = (Tt) => {
            var Ht = wg(), tn = M(Ht), xn = M(tn), on = M(xn, !0);
            T(xn);
            var Rn = F(xn, 2), fn = M(Rn), Er = M(fn), pn = M(Er, !0);
            T(Er);
            var rt = F(Er), Mn = M(rt, !0);
            T(rt), T(fn);
            var St = F(fn, 2), On = M(St), qt = M(On, !0);
            T(On);
            var Ue = F(On), ln = M(Ue, !0);
            T(Ue), T(St);
            var cr = F(St, 2), ur = M(cr), Nn = M(ur, !0);
            T(ur);
            var Ar = F(ur), Zr = M(Ar, !0);
            T(Ar), T(cr);
            var Sn = F(cr, 2), vn = M(Sn), hr = M(vn, !0);
            T(vn);
            var kr = F(vn), gr = M(kr, !0);
            T(kr), T(Sn);
            var ua = F(Sn, 2), Vn = M(ua), ha = M(Vn, !0);
            T(Vn);
            var wa = F(Vn), Dr = M(wa, !0);
            T(wa), T(ua);
            var yr = F(ua, 2), Na = M(yr), fa = M(Na, !0);
            T(Na);
            var pa = F(Na), Pa = M(pa, !0);
            T(pa), T(yr);
            var va = F(yr, 2), xa = M(va), Ra = M(xa, !0);
            T(xa);
            var Xr = F(xa), Ba = M(Xr, !0);
            T(Xr), T(va), T(Rn), T(tn);
            var Ua = F(tn, 2), Sa = M(Ua), Ia = M(Sa, !0);
            T(Sa);
            var gn = F(Sa, 2), qa = M(gn), Lr = M(qa), Es = M(Lr, !0);
            T(Lr);
            var Va = F(Lr), is = M(Va, !0);
            T(Va), T(qa);
            var ea = F(qa, 2), _a = M(ea), ga = M(_a, !0);
            T(_a);
            var ls = F(_a), ds = M(ls, !0);
            T(ls), T(ea);
            var mr = F(ea, 2), ta = M(mr), d = M(ta, !0);
            T(ta);
            var C = F(ta), H = M(C, !0);
            T(C), T(mr);
            var $ = F(mr, 2), K = M($), z = M(K, !0);
            T(K);
            var ce = F(K), Fe = M(ce, !0);
            T(ce), T($);
            var le = F($, 2), Se = M(le), ke = M(Se, !0);
            T(Se);
            var De = F(Se), $e = M(De, !0);
            T(De), T(le);
            var at = F(le, 2), ct = M(at), Ct = M(ct, !0);
            T(ct);
            var Ve = F(ct), tt = M(Ve, !0);
            T(Ve), T(at), T(gn), T(Ua);
            var mt = F(Ua, 2), nn = M(mt), br = M(nn, !0);
            T(nn);
            var Tr = F(nn, 2), Ie = M(Tr), Ye = M(Ie), zt = M(Ye, !0);
            T(Ye);
            var In = F(Ye), Et = M(In, !0);
            T(In), T(Ie);
            var na = F(Ie, 2), cs = M(na), qs = M(cs, !0);
            T(cs);
            var ra = F(cs), ja = M(ra, !0);
            T(ra), T(na);
            var Ka = F(na, 2), Ya = M(Ka), Vs = M(Ya, !0);
            T(Ya);
            var As = F(Ya), js = M(As, !0);
            T(As), T(Ka);
            var ks = F(Ka, 2), Ds = M(ks), uo = M(Ds, !0);
            T(Ds);
            var Ks = F(Ds), ho = M(Ks, !0);
            T(Ks), T(ks);
            var us = F(ks, 2), hs = M(us), Ys = M(hs, !0);
            T(hs);
            var zs = F(hs), Ea = M(zs, !0);
            T(zs), T(us);
            var v = F(us, 2), P = M(v), k = M(P, !0);
            T(P);
            var q = F(P), Q = M(q, !0);
            T(q), T(v);
            var ue = F(v, 2), ve = M(ue), je = M(ve, !0);
            T(ve);
            var Be = F(ve), Je = M(Be, !0);
            T(Be), T(ue), T(Tr), T(mt), T(Ht), me(
              (Te, At, _n, Ke, et, Jn, ya, za, Fr, Aa, Qa, Qs, fs, fo, Hr, Ws, h, U, Pe, ye, yt, rn, Vt) => {
                G(on, Te), G(pn, At), G(Mn, a(x).nonEmptyLineCount), G(qt, _n), G(ln, a(x).fileDuplicateCount), G(Nn, Ke), G(Zr, a(x).otherAccountCount), G(hr, et), G(gr, a(x).unsupportedKindCount), G(ha, Jn), G(Dr, a(x).invalidJsonCount), G(fa, ya), G(Pa, a(x).invalidStructureCount), G(Ra, za), G(Ba, a(x).invalidIdOrSignatureCount), G(Ia, Fr), G(Es, Aa), G(is, a(x).uniquePostEventCount), G(ga, Qa), G(ds, a(x).insertedPostCount), G(d, Qs), G(H, a(x).updatedPostCount), G(z, fs), G(Fe, a(x).unchangedPostCount), G(ke, fo), G($e, a(x).failedPostEventCount), G(Ct, Hr), G(tt, a(x).appliedDeletionPostCount), G(br, Ws), G(zt, h), G(Et, a(x).uniqueDeletionEventCount), G(qs, U), G(ja, a(x).validDeletionETagCount), G(Vs, Pe), G(js, a(x).insertedDeletionRequestCount), G(uo, ye), G(ho, a(x).updatedDeletionRequestCount), G(Ys, yt), G(Ea, a(x).unchangedDeletionRequestCount), G(k, rn), G(Q, a(x).unsupportedDeletionEventCount), G(je, Vt), G(Je, a(x).failedDeletionEventCount);
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
            ), D(Tt, Ht);
          };
          we(_r, (Tt) => {
            a(x) && Tt(dr);
          });
        }
        me(
          (Tt, Ht, tn, xn) => {
            G(gt, Tt), G(xt, Ht), Hn(nt, "aria-label", tn), Rt = Oa(dt, 1, "import-drop-zone svelte-1qfqhib", null, Rt, { "import-drop-zone-active": a(i) > 0 }), G(qn, xn);
          },
          [
            () => n()("postHistory.importTitle"),
            () => n()("postHistory.importDescription"),
            () => n()("postHistory.importChooseFile"),
            () => a(i) > 0 ? n()("postHistory.importDropActive") : n()("postHistory.importDropHint")
          ]
        ), si("change", nt, Ae), Mo("dragenter", dt, L), Mo("dragover", dt, B), Mo("dragleave", dt, oe), Mo("drop", dt, pe), D(ae, Pt);
      },
      $$slots: { footer: !0, default: !0 }
    });
  }
  var ht = Lt(ot);
  return o(), ht;
}
pu(["change"]);
Ft(
  hh,
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
var Rg = j('<span class="post-preview-replies-badge svelte-11vk23d" aria-hidden="true"> </span>'), Sg = j("<!> <!>", 1);
const Ig = {
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
function Pd(t, e) {
  Ot(e, !0), $a(t, Ig);
  let n = A(e, "count", 7), r = A(e, "selected", 7), o = A(e, "ariaLabel", 7), s = A(e, "onClick", 7), l = A(e, "tooltipContent", 23, o);
  const c = vu().overlayTarget;
  var u = {
    get count() {
      return n();
    },
    set count(y) {
      n(y), I();
    },
    get selected() {
      return r();
    },
    set selected(y) {
      r(y), I();
    },
    get ariaLabel() {
      return o();
    },
    set ariaLabel(y) {
      o(y), I();
    },
    get onClick() {
      return s();
    },
    set onClick(y) {
      s(y), I();
    },
    get tooltipContent() {
      return l();
    },
    set tooltipContent(y = o) {
      l(y), I();
    }
  }, b = Oe(), p = ee(b);
  return He(p, () => Kh, (y, x) => {
    x(y, {
      children: (f, S) => {
        var w = Oe(), m = ee(w);
        He(m, () => qh, (i, O) => {
          O(i, {
            delayDuration: 500,
            children: (J, N) => {
              var Z = Sg(), ge = ee(Z);
              {
                const se = (Re, Ee) => {
                  let fe = () => Ee?.().props;
                  const de = R(() => {
                    const { onclick: re, ..._e } = fe();
                    return { tooltipOnclick: re, restProps: _e };
                  });
                  ir(Re, so(
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
                      onClick: (re) => {
                        s()(), typeof a(de).tooltipOnclick == "function" && a(de).tooltipOnclick(re);
                      }
                    },
                    () => a(de).restProps,
                    {
                      children: (re, _e) => {
                        var ie = Rg(), Ce = M(ie, !0);
                        T(ie), me(() => G(Ce, n())), D(re, ie);
                      },
                      $$slots: { default: !0 }
                    }
                  ));
                };
                He(ge, () => Vh, (Re, Ee) => {
                  Ee(Re, { child: se, $$slots: { child: !0 } });
                });
              }
              var _ = F(ge, 2);
              He(_, () => ni, (se, Re) => {
                Re(se, {
                  get to() {
                    return c;
                  },
                  children: (Ee, fe) => {
                    var de = Oe(), re = ee(de);
                    He(re, () => jh, (_e, ie) => {
                      ie(_e, {
                        sideOffset: 8,
                        class: "tooltip-content post-preview-tooltip-content",
                        children: (Ce, X) => {
                          Fs();
                          var W = ss();
                          me(() => G(W, l())), D(Ce, W);
                        },
                        $$slots: { default: !0 }
                      });
                    }), D(Ee, de);
                  },
                  $$slots: { default: !0 }
                });
              }), D(J, Z);
            },
            $$slots: { default: !0 }
          });
        }), D(f, w);
      },
      $$slots: { default: !0 }
    });
  }), D(t, b), Lt(u);
}
Ft(
  Pd,
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
var _g = j('<span class="post-history-thread-toggle-spinner post-history-thread-action-spinner svelte-cenxtw" aria-hidden="true"></span>'), Eg = j('<span class="post-history-thread-toggle-icon-wrapper svelte-cenxtw" aria-hidden="true"><span></span></span>');
const Ag = {
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
function xd(t, e) {
  Ot(e, !0), $a(t, Ag);
  let n = A(e, "expanded", 7), r = A(e, "ariaLabel", 7), o = A(e, "title", 23, r), s = A(e, "loading", 7, !1), l = A(e, "onClick", 7), c = R(() => [s() ? "is-loading" : ""].filter(Boolean).join(" "));
  var u = {
    get expanded() {
      return n();
    },
    set expanded(b) {
      n(b), I();
    },
    get ariaLabel() {
      return r();
    },
    set ariaLabel(b) {
      r(b), I();
    },
    get title() {
      return o();
    },
    set title(b = r) {
      o(b), I();
    },
    get loading() {
      return s();
    },
    set loading(b = !1) {
      s(b), I();
    },
    get onClick() {
      return l();
    },
    set onClick(b) {
      l(b), I();
    }
  };
  {
    let b = R(() => `post-history-thread-toggle-button ${a(c)}`.trim());
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
      children: (p, y) => {
        var x = Oe(), f = ee(x);
        {
          var S = (m) => {
            var i = _g();
            D(m, i);
          }, w = (m) => {
            var i = Eg(), O = M(i);
            T(i), me(() => Oa(
              O,
              1,
              `post-history-thread-toggle-icon ${n() ? "post-history-thread-toggle-icon-collapse" : "post-history-thread-toggle-icon-arrow-top-right"} svg-icon`,
              "svelte-cenxtw"
            )), D(m, i);
          };
          we(f, (m) => {
            s() ? m(S) : m(w, -1);
          });
        }
        D(p, x);
      },
      $$slots: { default: !0 }
    });
  }
  return Lt(u);
}
Ft(
  xd,
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
var kg = j("<span> </span>");
const Dg = {
  hash: "svelte-1uufmpv",
  code: ".post-history-status-pill.svelte-1uufmpv {display:inline-flex;align-items:center;justify-content:center;min-height:18px;padding:0 8px;border:1px solid color-mix(in srgb, currentColor 18%, transparent);border-radius:999px;background:color-mix(in srgb, currentColor 8%, transparent);font-size:0.72rem;line-height:1;white-space:nowrap;}.post-history-status-pill-muted.svelte-1uufmpv {color:var(--text-muted, currentColor);}.post-history-status-pill-danger.svelte-1uufmpv {color:var(--destructive-fg, currentColor);}"
};
function fh(t, e) {
  Ot(e, !0), $a(t, Dg);
  let n = A(e, "label", 7), r = A(e, "tone", 7), o = A(e, "className", 7, "");
  var s = {
    get label() {
      return n();
    },
    set label(u) {
      n(u), I();
    },
    get tone() {
      return r();
    },
    set tone(u) {
      r(u), I();
    },
    get className() {
      return o();
    },
    set className(u = "") {
      o(u), I();
    }
  }, l = kg(), c = M(l, !0);
  return T(l), me(
    (u) => {
      Oa(l, 1, u, "svelte-1uufmpv"), Hn(l, "aria-label", n()), Hn(l, "title", n()), G(c, n());
    },
    [
      () => Yh(`post-history-status-pill post-history-status-pill-${r()} ${o()}`.trim())
    ]
  ), D(t, l), Lt(s);
}
Ft(fh, { label: {}, tone: {}, className: {} }, [], [], { mode: "open" });
function ph(t, e) {
  Ot(e, !0);
  const n = () => xs(Bs, "$_", r), [r, o] = Ns();
  let s = A(e, "eventId", 7), l = R(() => {
    if (s())
      return zh[s()];
  });
  function c(S) {
    return S === "pending" || S === "processing" ? n()("postHistory.deleteSending") : S === "failed" ? n()("postHistory.deleteFailed") : null;
  }
  let u = R(() => c(a(l)));
  var b = {
    get eventId() {
      return s();
    },
    set eventId(S) {
      s(S), I();
    }
  }, p = Oe(), y = ee(p);
  {
    var x = (S) => {
      {
        let w = R(() => a(l) === "failed" ? "danger" : "muted"), m = R(() => `post-history-deletion-lifecycle-status ${a(l) ?? ""}`.trim());
        fh(S, {
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
    we(y, (S) => {
      a(u) && S(x);
    });
  }
  D(t, p);
  var f = Lt(b);
  return o(), f;
}
Ft(ph, { eventId: {} }, [], [], { mode: "open" });
function vh(t, e) {
  Ot(e, !0);
  let n = A(e, "node", 7), r = A(e, "model", 7, void 0), o = A(e, "emojiLoadStateByUrl", 23, () => ({})), s = A(e, "emojiImageMetaByUrl", 23, () => ({})), l = A(e, "scrollRoot", 7, null), c = A(e, "onImageOpen", 7, void 0), u = A(e, "topActions", 7, void 0), b = A(e, "footerLeftExtras", 7, void 0), p = A(e, "footerActions", 7, void 0), y = A(e, "footerMenu", 7, void 0);
  var x = {
    get node() {
      return n();
    },
    set node(f) {
      n(f), I();
    },
    get model() {
      return r();
    },
    set model(f = void 0) {
      r(f), I();
    },
    get emojiLoadStateByUrl() {
      return o();
    },
    set emojiLoadStateByUrl(f = {}) {
      o(f), I();
    },
    get emojiImageMetaByUrl() {
      return s();
    },
    set emojiImageMetaByUrl(f = {}) {
      s(f), I();
    },
    get scrollRoot() {
      return l();
    },
    set scrollRoot(f = null) {
      l(f), I();
    },
    get onImageOpen() {
      return c();
    },
    set onImageOpen(f = void 0) {
      c(f), I();
    },
    get topActions() {
      return u();
    },
    set topActions(f = void 0) {
      u(f), I();
    },
    get footerLeftExtras() {
      return b();
    },
    set footerLeftExtras(f = void 0) {
      b(f), I();
    },
    get footerActions() {
      return p();
    },
    set footerActions(f = void 0) {
      p(f), I();
    },
    get footerMenu() {
      return y();
    },
    set footerMenu(f = void 0) {
      y(f), I();
    }
  };
  return wd(t, {
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
      return p();
    },
    get footerMenu() {
      return y();
    }
  }), Lt(x);
}
Ft(
  vh,
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
const Tg = 5, Mg = 0.5, Og = 2.5;
function Tn(t, e) {
  return `${t}:${e}`;
}
function Lg(t) {
  return t < 0 ? Math.max(
    0,
    Tg + t
  ) : t;
}
function gh(t) {
  return Math.min(
    Lg(t) * Mg,
    Og
  );
}
function Gi() {
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
function Cl(t) {
  return gu(t.rawEvent, t) ? Hl(t.rawEvent) : {
    id: t.eventId,
    pubkey: t.pubkeyHex,
    kind: t.kind,
    content: t.content,
    tags: t.tags.map((e) => [...e]),
    created_at: t.createdAt,
    sig: ""
  };
}
function Oo(t) {
  const e = {
    id: t.eventId,
    pubkey: t.authorPubkey,
    kind: t.kind,
    content: t.content,
    tags: t.tags.map((n) => [...n]),
    created_at: t.createdAt,
    sig: ""
  };
  return Ii(t.rawEvent) && t.rawEvent.id === e.id && t.rawEvent.pubkey === e.pubkey && t.rawEvent.kind === e.kind && t.rawEvent.content === e.content && t.rawEvent.created_at === e.created_at && JSON.stringify(t.rawEvent.tags) === JSON.stringify(e.tags) ? Hl(t.rawEvent) : e;
}
function Ro(t) {
  const e = ns(t.event);
  return {
    eventId: t.event.id,
    event: Hl(t.event),
    authorPubkey: t.event.pubkey,
    rootEventId: e.rootId,
    parentEventId: e.parentId,
    profile: t.profile ?? null,
    relayUrls: [...t.relayUrls ?? []],
    sources: [...t.sources]
  };
}
function So(t, e) {
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
function sc(t, e) {
  return [...t].sort((n, r) => {
    const o = e[n]?.event, s = e[r]?.event;
    return !o || !s ? n.localeCompare(r) : o.created_at !== s.created_at ? o.created_at - s.created_at : o.id.localeCompare(s.id);
  });
}
var Fg = j('<span class="post-history-context-deleted-label svelte-1kez5et"> </span>'), Hg = j('<p class="post-history-context-message svelte-1kez5et"> </p>'), $g = j('<p class="post-history-context-message post-history-context-error svelte-1kez5et"> </p> <!>', 1), Ng = j('<div class="post-history-thread-node-parent svelte-1kez5et"><!></div>'), Bg = j('<div class="post-history-thread-node-top-actions"><!></div>'), Ug = j('<div class="post-preview-footer-replies-slot"><!></div>'), qg = j('<div class="open-in-new-icon svg-icon" aria-hidden="true"></div> <span> </span>', 1), Vg = j("<!> <!>", 1), jg = j('<div aria-hidden="true"></div> <span> </span>', 1), Kg = j("<!> <!> <!>", 1), Yg = j('<div class="post-history-thread-node-children svelte-1kez5et"></div>'), zg = j('<div class="post-history-thread-node-view svelte-1kez5et"><!> <div class="post-history-thread-node-anchor svelte-1kez5et"><!></div> <!></div>');
const Qg = {
  hash: "svelte-1kez5et",
  code: `.post-history-thread-node-view.svelte-1kez5et {display:grid;gap:1px;}.post-history-thread-node-parent.svelte-1kez5et,
    .post-history-thread-node-children.svelte-1kez5et {display:grid;gap:2px;}.post-history-thread-node-parent.svelte-1kez5et {padding-inline-start:0;}.post-history-thread-node-anchor.svelte-1kez5et {display:grid;margin-inline-start:var(--thread-context-indent);}.post-history-thread-node-children.svelte-1kez5et {padding-inline-start:0;}.post-history-context-button {min-height:28px;padding:2px 6px;color:var(--text-muted);background:var(--btn-bg);font-size:0.82rem;}.post-history-context-message.svelte-1kez5et {margin:0;color:var(--text-muted);font-size:0.82rem;}.post-history-context-deleted-label.svelte-1kez5et {width:fit-content;min-height:28px;padding:2px 6px;color:var(--text-muted);background-color:transparent;border:1px solid var(--btn-border);font-size:0.82rem;font-weight:normal;cursor:default;user-select:none;display:flex;align-items:center;}.post-history-context-error.svelte-1kez5et {color:var(--danger);}`
};
function no(t, e) {
  Ot(e, !0), $a(t, Qg);
  const n = () => xs(Bs, "$_", r), [r, o] = Ns();
  let s = A(e, "state", 7), l = A(e, "previewModelByEventId", 23, () => ({})), c = A(e, "emojiLoadStateByUrl", 23, () => ({})), u = A(e, "emojiImageMetaByUrl", 23, () => ({})), b = A(e, "scrollRoot", 7, null), p = A(e, "onImageOpen", 7, void 0), y = A(e, "onToggleParent", 7, void 0), x = A(e, "onRetryParent", 7, void 0), f = A(e, "onToggleChildren", 7, void 0), S = A(e, "onRetryChildren", 7, void 0), w = A(e, "onCopyPointerDown", 7, void 0), m = A(e, "onCopyNevent", 7, void 0), i = A(e, "externalClientLabel", 7, void 0), O = A(e, "onOpenExternalClient", 7, void 0), J = A(e, "isCopyFailed", 7, void 0), N = A(e, "onShowRawJson", 7, void 0), Z = A(e, "onBroadcastPointerDown", 7, void 0), ge = A(e, "onBroadcastPost", 7, void 0), _ = A(e, "isBroadcastSending", 7, void 0), se = A(e, "canDeleteNodePost", 7, void 0), Re = A(e, "isDeletionSending", 7, void 0), Ee = A(e, "onOpenDeleteConfirm", 7, void 0), fe = R(() => ri(s().node.event.created_at * 1e3)), de = R(() => `${gh(s().depthFromAnchor)}rem`), re = R(() => s().repliesActionState.status === "loaded" && s().repliesActionState.replyCount > 0), _e = R(() => J()?.(s().node.eventId) ?? !1), ie = R(() => _()?.(s().node.eventId) ?? !1), Ce = R(() => se()?.(s()) ?? !1), X = R(() => Re()?.(s().node.eventId) ?? !1);
  function W() {
    const ae = s().repliesActionState;
    if (ae.status === "loading")
      return n()("postHistory.checkingReplies");
    if (ae.status === "failed")
      return n()("postHistory.recheckReplies");
    if (ae.status === "loaded") {
      const Ge = ae.replyCount;
      return Ge === 0 ? n()("postHistory.recheckReplies") : ae.visible ? n()("postHistory.hideReplies") : n()("postHistory.showRepliesWithCount", { values: { count: Ge } });
    }
    return n()("postHistory.checkReplies");
  }
  function te() {
    const ae = s().repliesActionState;
    if (ae.status === "failed" || ae.status === "loaded" && ae.replyCount === 0) {
      S()?.(s().node.eventId);
      return;
    }
    f()?.(s().node.eventId);
  }
  function xe(ae) {
    w()?.(s(), ae);
  }
  function Ne(ae) {
    m()?.(s(), ae);
  }
  function ne() {
    N()?.(s());
  }
  function E(ae) {
    Z()?.(s(), ae);
  }
  function L(ae) {
    ge()?.(s(), ae);
  }
  function B() {
    Ee()?.(s());
  }
  var oe = {
    get state() {
      return s();
    },
    set state(ae) {
      s(ae), I();
    },
    get previewModelByEventId() {
      return l();
    },
    set previewModelByEventId(ae = {}) {
      l(ae), I();
    },
    get emojiLoadStateByUrl() {
      return c();
    },
    set emojiLoadStateByUrl(ae = {}) {
      c(ae), I();
    },
    get emojiImageMetaByUrl() {
      return u();
    },
    set emojiImageMetaByUrl(ae = {}) {
      u(ae), I();
    },
    get scrollRoot() {
      return b();
    },
    set scrollRoot(ae = null) {
      b(ae), I();
    },
    get onImageOpen() {
      return p();
    },
    set onImageOpen(ae = void 0) {
      p(ae), I();
    },
    get onToggleParent() {
      return y();
    },
    set onToggleParent(ae = void 0) {
      y(ae), I();
    },
    get onRetryParent() {
      return x();
    },
    set onRetryParent(ae = void 0) {
      x(ae), I();
    },
    get onToggleChildren() {
      return f();
    },
    set onToggleChildren(ae = void 0) {
      f(ae), I();
    },
    get onRetryChildren() {
      return S();
    },
    set onRetryChildren(ae = void 0) {
      S(ae), I();
    },
    get onCopyPointerDown() {
      return w();
    },
    set onCopyPointerDown(ae = void 0) {
      w(ae), I();
    },
    get onCopyNevent() {
      return m();
    },
    set onCopyNevent(ae = void 0) {
      m(ae), I();
    },
    get externalClientLabel() {
      return i();
    },
    set externalClientLabel(ae = void 0) {
      i(ae), I();
    },
    get onOpenExternalClient() {
      return O();
    },
    set onOpenExternalClient(ae = void 0) {
      O(ae), I();
    },
    get isCopyFailed() {
      return J();
    },
    set isCopyFailed(ae = void 0) {
      J(ae), I();
    },
    get onShowRawJson() {
      return N();
    },
    set onShowRawJson(ae = void 0) {
      N(ae), I();
    },
    get onBroadcastPointerDown() {
      return Z();
    },
    set onBroadcastPointerDown(ae = void 0) {
      Z(ae), I();
    },
    get onBroadcastPost() {
      return ge();
    },
    set onBroadcastPost(ae = void 0) {
      ge(ae), I();
    },
    get isBroadcastSending() {
      return _();
    },
    set isBroadcastSending(ae = void 0) {
      _(ae), I();
    },
    get canDeleteNodePost() {
      return se();
    },
    set canDeleteNodePost(ae = void 0) {
      se(ae), I();
    },
    get isDeletionSending() {
      return Re();
    },
    set isDeletionSending(ae = void 0) {
      Re(ae), I();
    },
    get onOpenDeleteConfirm() {
      return Ee();
    },
    set onOpenDeleteConfirm(ae = void 0) {
      Ee(ae), I();
    }
  }, pe = zg(), V = M(pe);
  {
    var Ae = (ae) => {
      var Ge = Ng(), Pt = M(Ge);
      {
        var vt = (xt) => {
          no(xt, {
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
              return p();
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
              return S();
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
              return J();
            },
            get onShowRawJson() {
              return N();
            },
            get onBroadcastPointerDown() {
              return Z();
            },
            get onBroadcastPost() {
              return ge();
            },
            get isBroadcastSending() {
              return _();
            },
            get canDeleteNodePost() {
              return se();
            },
            get isDeletionSending() {
              return Re();
            },
            get onOpenDeleteConfirm() {
              return Ee();
            }
          });
        }, _t = (xt) => {
          var nt = Fg(), dt = M(nt, !0);
          T(nt), me((Rt) => G(dt, Rt), [() => n()("postHistory.replyTargetDeleted")]), D(xt, nt);
        }, gt = (xt) => {
          var nt = Hg(), dt = M(nt, !0);
          T(nt), me((Rt) => G(dt, Rt), [() => n()("postHistory.contextNotFound")]), D(xt, nt);
        }, Ut = (xt) => {
          var nt = $g(), dt = ee(nt), Rt = M(dt, !0);
          T(dt);
          var $n = F(dt, 2);
          ir($n, {
            type: "button",
            className: "post-history-context-button post-history-context-retry-button",
            onClick: () => x()?.(s().node.eventId),
            children: (qe, qn) => {
              Fs();
              var wn = ss();
              me((Pn) => G(wn, Pn), [() => n()("postHistory.contextRetry")]), D(qe, wn);
            },
            $$slots: { default: !0 }
          }), me((qe) => G(Rt, qe), [() => n()("postHistory.contextFetchFailed")]), D(xt, nt);
        };
        we(Pt, (xt) => {
          s().parentExpansion.visibleParent && s().parentNodeState ? xt(vt) : s().parentExpansion.visibleParent && s().parentExpansion.parentDeleted ? xt(_t, 1) : s().parentExpansion.visibleParent && s().parentExpansion.parentMissing ? xt(gt, 2) : s().parentExpansion.visibleParent && s().parentExpansion.parentError && xt(Ut, 3);
        });
      }
      T(Ge), D(ae, Ge);
    };
    we(V, (ae) => {
      s().parentTargetId && ae(Ae);
    });
  }
  var ot = F(V, 2), ht = M(ot);
  vh(ht, {
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
      return p();
    },
    topActions: (_t) => {
      var gt = Oe(), Ut = ee(gt);
      {
        var xt = (nt) => {
          var dt = Bg(), Rt = M(dt);
          {
            let $n = R(() => s().parentExpansion.visibleParent ? n()("postHistory.hideReplyTarget") : n()("postHistory.showReplyTarget")), qe = R(() => s().parentExpansion.visibleParent ? n()("postHistory.hideReplyTarget") : n()("postHistory.showReplyTarget")), qn = R(() => s().parentExpansion.visibleParent && s().parentExpansion.showParentLoadingIndicator);
            xd(Rt, {
              get ariaLabel() {
                return a($n);
              },
              get title() {
                return a(qe);
              },
              get expanded() {
                return s().parentExpansion.visibleParent;
              },
              get loading() {
                return a(qn);
              },
              onClick: () => y()?.(s().node.eventId)
            });
          }
          T(dt), D(nt, dt);
        };
        we(Ut, (nt) => {
          s().parentTargetId && !s().parentAlreadyInPath && !(s().parentExpansion.visibleParent && s().parentExpansion.parentDeleted) && nt(xt);
        });
      }
      D(_t, gt);
    },
    footerLeftExtras: (_t) => {
      ph(_t, {
        get eventId() {
          return s().node.eventId;
        }
      });
    },
    footerActions: (_t) => {
      var gt = Ug(), Ut = M(gt);
      {
        var xt = (nt) => {
          {
            let dt = R(W), Rt = R(W);
            Pd(nt, {
              get count() {
                return s().repliesActionState.replyCount;
              },
              get selected() {
                return s().repliesActionState.visible;
              },
              get ariaLabel() {
                return a(dt);
              },
              get tooltipContent() {
                return a(Rt);
              },
              onClick: te
            });
          }
        };
        we(Ut, (nt) => {
          a(re) && nt(xt);
        });
      }
      T(gt), D(_t, gt);
    },
    footerMenu: (_t) => {
      const gt = R(() => n()("common.showActions"));
      vl(_t, {
        get triggerAriaLabel() {
          return a(gt);
        },
        get tooltipContent() {
          return a(gt);
        },
        enableTooltip: !0,
        get timestamp() {
          return a(fe);
        },
        items: (xt) => {
          var nt = Kg(), dt = ee(nt);
          {
            var Rt = (qn) => {
              var wn = Vg(), Pn = ee(wn);
              He(Pn, () => Xn, (dr, Tt) => {
                Tt(dr, {
                  class: "menu-action-button",
                  onSelect: () => O()?.(s()),
                  children: (Ht, tn) => {
                    var xn = qg(), on = F(ee(xn), 2), Rn = M(on, !0);
                    T(on), me(() => G(Rn, i())), D(Ht, xn);
                  },
                  $$slots: { default: !0 }
                });
              });
              var _r = F(Pn, 2);
              He(_r, () => ts, (dr, Tt) => {
                Tt(dr, { class: "post-history-menu-separator" });
              }), D(qn, wn);
            };
            we(dt, (qn) => {
              i() && O() && qn(Rt);
            });
          }
          var $n = F(dt, 2);
          {
            let qn = R(() => s().repliesActionState.status === "loading");
            He($n, () => Xn, (wn, Pn) => {
              Pn(wn, {
                class: "menu-action-button",
                get disabled() {
                  return a(qn);
                },
                onSelect: te,
                children: (_r, dr) => {
                  var Tt = jg(), Ht = ee(Tt), tn = F(Ht, 2), xn = M(tn, !0);
                  T(tn), me(
                    (on) => {
                      Oa(Ht, 1, `${s().repliesActionState.visible ? "collapse-content-icon" : "find_in_page-icon"} svg-icon`, "svelte-1kez5et"), G(xn, on);
                    },
                    [() => W()]
                  ), D(_r, Tt);
                },
                $$slots: { default: !0 }
              });
            });
          }
          var qe = F($n, 2);
          Ho(qe, {
            order: "raw-json-first",
            get copyFailed() {
              return a(_e);
            },
            showBroadcast: !0,
            get broadcastSending() {
              return a(ie);
            },
            get showDelete() {
              return a(Ce);
            },
            showDeleteSeparator: !0,
            get deletionSending() {
              return a(X);
            },
            onCopyPointerDown: xe,
            onCopyNevent: Ne,
            onShowRawJson: ne,
            onBroadcastPointerDown: E,
            onBroadcastPost: L,
            onOpenDeleteConfirm: B
          }), D(xt, nt);
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
  }), T(ot);
  var he = F(ot, 2);
  {
    var Le = (ae) => {
      var Ge = Yg();
      ba(Ge, 21, () => s().replyNodeStates, (Pt) => Pt.node.eventId, (Pt, vt) => {
        no(Pt, {
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
            return p();
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
            return S();
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
            return J();
          },
          get onShowRawJson() {
            return N();
          },
          get onBroadcastPointerDown() {
            return Z();
          },
          get onBroadcastPost() {
            return ge();
          },
          get isBroadcastSending() {
            return _();
          },
          get canDeleteNodePost() {
            return se();
          },
          get isDeletionSending() {
            return Re();
          },
          get onOpenDeleteConfirm() {
            return Ee();
          }
        });
      }), T(Ge), D(ae, Ge);
    };
    we(he, (ae) => {
      s().repliesActionState.visible && s().replyNodeStates.length > 0 && ae(Le);
    });
  }
  T(pe), me(() => {
    xi(pe, `--thread-context-indent: ${a(de)}`), Hn(ot, "data-post-history-thread-anchor-scope-id", s().anchorEventId), Hn(ot, "data-post-history-thread-anchor-event-id", s().node.eventId);
  }), D(t, pe);
  var We = Lt(oe);
  return o(), We;
}
Ft(
  no,
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
var Wg = j('<span class="post-history-context-deleted-label post-history-thread-direct-parent-context svelte-nb00ha"> </span>'), Jg = j('<p class="post-history-context-message post-history-thread-direct-parent-context svelte-nb00ha"> </p>'), Gg = j('<p class="post-history-context-message post-history-context-error post-history-thread-direct-parent-context svelte-nb00ha"> </p> <!>', 1), Zg = j('<div class="post-history-thread-parent-panel svelte-nb00ha"><!> <div class="post-history-context-actions svelte-nb00ha"><!></div></div>'), Xg = j('<div class="post-history-thread-replies-panel svelte-nb00ha"><div class="post-history-thread-replies-list svelte-nb00ha"></div></div>');
const ey = {
  hash: "svelte-nb00ha",
  code: `.post-history-thread-parent-panel.svelte-nb00ha,
    .post-history-thread-replies-panel.svelte-nb00ha {display:grid;gap:6px;}.post-history-thread-parent-panel.svelte-nb00ha {padding-bottom:4px;}.post-history-thread-replies-list.svelte-nb00ha {display:grid;}.post-history-context-actions.svelte-nb00ha {display:flex;flex-wrap:wrap;gap:6px;}.post-history-thread-direct-parent-context {margin-inline-start:var(--thread-direct-parent-indent);}.post-history-context-button {min-height:28px;padding:2px 6px;color:var(--text-muted);background:transparent;font-size:0.82rem;}

    @media (hover: hover) and (pointer: fine) {.post-history-context-button:hover:not(:disabled) {color:var(--theme);background:color-mix(in srgb, var(--theme) 10%, transparent);}
    }.post-history-context-message.svelte-nb00ha {margin:0;color:var(--text-muted);font-size:0.82rem;}.post-history-context-deleted-label.svelte-nb00ha {width:fit-content;min-height:28px;padding:2px 6px;color:var(--text-muted);background-color:transparent;border:1px solid var(--btn-border);font-size:0.82rem;font-weight:normal;cursor:default;user-select:none;display:flex;align-items:center;}.post-history-context-error.svelte-nb00ha {color:var(--danger);}`
};
function wl(t, e) {
  Ot(e, !0), $a(t, ey);
  const n = () => xs(Bs, "$_", r), [r, o] = Ns();
  let s = A(e, "state", 7), l = A(e, "section", 7), c = A(e, "previewModelByEventId", 23, () => ({})), u = A(e, "emojiLoadStateByUrl", 23, () => ({})), b = A(e, "emojiImageMetaByUrl", 23, () => ({})), p = A(e, "scrollRoot", 7, null), y = A(e, "onImageOpen", 7, void 0), x = A(e, "onToggleParent", 7, void 0), f = A(e, "onRetryParent", 7, void 0), S = A(e, "onToggleNodeParent", 7, void 0), w = A(e, "onRetryNodeParent", 7, void 0), m = A(e, "onToggleNodeChildren", 7, void 0), i = A(e, "onRetryNodeChildren", 7, void 0), O = A(e, "onCopyPointerDown", 7, void 0), J = A(e, "onCopyNevent", 7, void 0), N = A(e, "externalClientLabel", 7, void 0), Z = A(e, "onOpenExternalClient", 7, void 0), ge = A(e, "isCopyFailed", 7, void 0), _ = A(e, "onShowRawJson", 7, void 0), se = A(e, "onBroadcastPointerDown", 7, void 0), Re = A(e, "onBroadcastPost", 7, void 0), Ee = A(e, "isBroadcastSending", 7, void 0), fe = A(e, "canDeleteNodePost", 7, void 0), de = A(e, "isDeletionSending", 7, void 0), re = A(e, "onOpenDeleteConfirm", 7, void 0);
  const _e = `${gh(-1)}rem`;
  let ie = R(() => s().parentNode ? {
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
  var Ce = {
    get state() {
      return s();
    },
    set state(ne) {
      s(ne), I();
    },
    get section() {
      return l();
    },
    set section(ne) {
      l(ne), I();
    },
    get previewModelByEventId() {
      return c();
    },
    set previewModelByEventId(ne = {}) {
      c(ne), I();
    },
    get emojiLoadStateByUrl() {
      return u();
    },
    set emojiLoadStateByUrl(ne = {}) {
      u(ne), I();
    },
    get emojiImageMetaByUrl() {
      return b();
    },
    set emojiImageMetaByUrl(ne = {}) {
      b(ne), I();
    },
    get scrollRoot() {
      return p();
    },
    set scrollRoot(ne = null) {
      p(ne), I();
    },
    get onImageOpen() {
      return y();
    },
    set onImageOpen(ne = void 0) {
      y(ne), I();
    },
    get onToggleParent() {
      return x();
    },
    set onToggleParent(ne = void 0) {
      x(ne), I();
    },
    get onRetryParent() {
      return f();
    },
    set onRetryParent(ne = void 0) {
      f(ne), I();
    },
    get onToggleNodeParent() {
      return S();
    },
    set onToggleNodeParent(ne = void 0) {
      S(ne), I();
    },
    get onRetryNodeParent() {
      return w();
    },
    set onRetryNodeParent(ne = void 0) {
      w(ne), I();
    },
    get onToggleNodeChildren() {
      return m();
    },
    set onToggleNodeChildren(ne = void 0) {
      m(ne), I();
    },
    get onRetryNodeChildren() {
      return i();
    },
    set onRetryNodeChildren(ne = void 0) {
      i(ne), I();
    },
    get onCopyPointerDown() {
      return O();
    },
    set onCopyPointerDown(ne = void 0) {
      O(ne), I();
    },
    get onCopyNevent() {
      return J();
    },
    set onCopyNevent(ne = void 0) {
      J(ne), I();
    },
    get externalClientLabel() {
      return N();
    },
    set externalClientLabel(ne = void 0) {
      N(ne), I();
    },
    get onOpenExternalClient() {
      return Z();
    },
    set onOpenExternalClient(ne = void 0) {
      Z(ne), I();
    },
    get isCopyFailed() {
      return ge();
    },
    set isCopyFailed(ne = void 0) {
      ge(ne), I();
    },
    get onShowRawJson() {
      return _();
    },
    set onShowRawJson(ne = void 0) {
      _(ne), I();
    },
    get onBroadcastPointerDown() {
      return se();
    },
    set onBroadcastPointerDown(ne = void 0) {
      se(ne), I();
    },
    get onBroadcastPost() {
      return Re();
    },
    set onBroadcastPost(ne = void 0) {
      Re(ne), I();
    },
    get isBroadcastSending() {
      return Ee();
    },
    set isBroadcastSending(ne = void 0) {
      Ee(ne), I();
    },
    get canDeleteNodePost() {
      return fe();
    },
    set canDeleteNodePost(ne = void 0) {
      fe(ne), I();
    },
    get isDeletionSending() {
      return de();
    },
    set isDeletionSending(ne = void 0) {
      de(ne), I();
    },
    get onOpenDeleteConfirm() {
      return re();
    },
    set onOpenDeleteConfirm(ne = void 0) {
      re(ne), I();
    }
  }, X = Oe(), W = ee(X);
  {
    var te = (ne) => {
      var E = Zg(), L = M(E);
      {
        var B = (Le) => {
          no(Le, {
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
              return p();
            },
            get onImageOpen() {
              return y();
            },
            get onToggleParent() {
              return S();
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
              return J();
            },
            get externalClientLabel() {
              return N();
            },
            get onOpenExternalClient() {
              return Z();
            },
            get isCopyFailed() {
              return ge();
            },
            get onShowRawJson() {
              return _();
            },
            get onBroadcastPointerDown() {
              return se();
            },
            get onBroadcastPost() {
              return Re();
            },
            get isBroadcastSending() {
              return Ee();
            },
            get canDeleteNodePost() {
              return fe();
            },
            get isDeletionSending() {
              return de();
            },
            get onOpenDeleteConfirm() {
              return re();
            }
          });
        }, oe = (Le) => {
          no(Le, {
            get state() {
              return a(ie);
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
              return p();
            },
            get onImageOpen() {
              return y();
            },
            get onToggleParent() {
              return S();
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
              return J();
            },
            get externalClientLabel() {
              return N();
            },
            get onOpenExternalClient() {
              return Z();
            },
            get isCopyFailed() {
              return ge();
            },
            get onShowRawJson() {
              return _();
            },
            get onBroadcastPointerDown() {
              return se();
            },
            get onBroadcastPost() {
              return Re();
            },
            get isBroadcastSending() {
              return Ee();
            },
            get canDeleteNodePost() {
              return fe();
            },
            get isDeletionSending() {
              return de();
            },
            get onOpenDeleteConfirm() {
              return re();
            }
          });
        }, pe = (Le) => {
          var We = Wg(), ae = M(We, !0);
          T(We), me((Ge) => G(ae, Ge), [() => n()("postHistory.replyTargetDeleted")]), D(Le, We);
        }, V = (Le) => {
          var We = Jg(), ae = M(We, !0);
          T(We), me((Ge) => G(ae, Ge), [() => n()("postHistory.contextNotFound")]), D(Le, We);
        }, Ae = (Le) => {
          var We = Gg(), ae = ee(We), Ge = M(ae, !0);
          T(ae);
          var Pt = F(ae, 2);
          ir(Pt, {
            type: "button",
            className: "post-history-context-button post-history-context-retry-button",
            onClick: () => f()?.(),
            children: (vt, _t) => {
              Fs();
              var gt = ss();
              me((Ut) => G(gt, Ut), [() => n()("postHistory.contextRetry")]), D(vt, gt);
            },
            $$slots: { default: !0 }
          }), me((vt) => G(Ge, vt), [() => n()("postHistory.contextFetchFailed")]), D(Le, We);
        };
        we(L, (Le) => {
          s().parentExpansion.visibleParent && s().parentNodeState ? Le(B) : s().parentExpansion.visibleParent && a(ie) ? Le(oe, 1) : s().parentExpansion.visibleParent && s().parentExpansion.parentDeleted ? Le(pe, 2) : s().parentExpansion.visibleParent && s().parentExpansion.parentMissing ? Le(V, 3) : s().parentExpansion.visibleParent && s().parentExpansion.parentError && Le(Ae, 4);
        });
      }
      var ot = F(L, 2), ht = M(ot);
      {
        var he = (Le) => {
          {
            let We = R(() => s().parentExpansion.visibleParent ? n()("postHistory.hideReplyTarget") : n()("postHistory.showReplyTarget")), ae = R(() => s().parentExpansion.visibleParent ? n()("postHistory.hideReplyTarget") : n()("postHistory.showReplyTarget")), Ge = R(() => s().parentExpansion.visibleParent && s().parentExpansion.showParentLoadingIndicator);
            xd(Le, {
              get ariaLabel() {
                return a(We);
              },
              get title() {
                return a(ae);
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
        we(ht, (Le) => {
          s().parentExpansion.visibleParent && s().parentExpansion.parentDeleted || Le(he);
        });
      }
      T(ot), T(E), me(() => xi(E, `--thread-direct-parent-indent: ${_e}`)), D(ne, E);
    }, xe = (ne) => {
      var E = Xg(), L = M(E);
      ba(L, 21, () => s().replyNodeStates, (B) => B.node.eventId, (B, oe) => {
        no(B, {
          get state() {
            return a(oe);
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
            return p();
          },
          get onImageOpen() {
            return y();
          },
          get onToggleParent() {
            return S();
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
            return J();
          },
          get externalClientLabel() {
            return N();
          },
          get onOpenExternalClient() {
            return Z();
          },
          get isCopyFailed() {
            return ge();
          },
          get onShowRawJson() {
            return _();
          },
          get onBroadcastPointerDown() {
            return se();
          },
          get onBroadcastPost() {
            return Re();
          },
          get isBroadcastSending() {
            return Ee();
          },
          get canDeleteNodePost() {
            return fe();
          },
          get isDeletionSending() {
            return de();
          },
          get onOpenDeleteConfirm() {
            return re();
          }
        });
      }), T(L), T(E), D(ne, E);
    };
    we(W, (ne) => {
      l() === "parent" && s().parentTargetId ? ne(te) : l() === "children" && s().repliesActionState.visible && s().replyNodeStates.length > 0 && ne(xe, 1);
    });
  }
  D(t, X);
  var Ne = Lt(Ce);
  return o(), Ne;
}
Ft(
  wl,
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
function ty({
  getShow: t,
  getPosts: e,
  getRxNostr: n,
  getRelayConfig: r,
  getIsSearchMode: o
}) {
  let s = be(lr({})), l = 0, c = [];
  function u() {
    c = [];
  }
  function b() {
    c.forEach((x) => x.release()), u();
  }
  function p() {
    b(), g(s, {}, !0);
  }
  function y(x, f) {
    if (x.kind !== 42)
      return null;
    if (!x.channelEventId)
      return f("postHistory.channelUnknown");
    const S = a(s)[x.channelEventId];
    return !S || S.status === "loading" ? f("postHistory.channelLoading") : S.status === "resolved" && S.name ? S.name : f("postHistory.channelUnknown");
  }
  return ze(() => {
    t() || p();
  }), ze(() => {
    if (t())
      return () => {
        b();
      };
  }), ze(() => {
    if (!t())
      return;
    b();
    const x = e().filter((i) => i.kind === 42);
    if (x.length === 0)
      return;
    const f = Array.from(new Set(x.map((i) => i.channelEventId).filter((i) => typeof i == "string")));
    if (f.length === 0)
      return;
    const S = ++l, w = o() ? void 0 : n(), m = f.map((i) => {
      const O = hn.sanitizeExternalRelayUrls(x.filter((J) => J.channelEventId === i).flatMap((J) => Qh(J)), { limit: Wh });
      return Jh.resolveInternal({ eventId: i, relayHints: O }, w, r());
    });
    c = m, g(
      s,
      {
        ...ca(() => a(s)),
        ...Object.fromEntries(f.map((i) => [i, { status: "loading", name: null }]))
      },
      !0
    ), Promise.all(m.map((i) => i.cacheReady)).then((i) => {
      !t() || S !== l || g(
        s,
        {
          ...a(s),
          ...Object.fromEntries(i.map((O) => [
            O.context.eventId,
            Gh(O.cache, !!w)
          ]))
        },
        !0
      );
    }).catch((i) => {
      console.error("チャンネル表示のキャッシュ解決に失敗しました:", i);
    }), Promise.all(m.map((i) => i.refresh)).then((i) => {
      !t() || S !== l || (u(), g(
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
      S === l && u(), console.error("チャンネル表示のバックグラウンド解決に失敗しました:", i);
    });
  }), io(() => {
    b();
  }), { getChannelText: y, cancelCurrentChannelResolution: b };
}
function ny() {
  let t = be(lr({})), e = be(!1), n = be(0), r = be(0), o, s = be(void 0);
  function l(f) {
    return Xh(f, ru.value);
  }
  function c() {
    o && (clearTimeout(o), o = void 0), g(e, !1), g(s, void 0);
  }
  function u(f, S) {
    g(
      s,
      {
        eventId: f.eventId,
        ...ii(S.clientX, S.clientY)
      },
      !0
    );
  }
  function b(f, S) {
    if (a(s)?.eventId === f.eventId)
      return {
        x: a(s).x,
        y: a(s).y
      };
    const w = S.currentTarget, m = w instanceof HTMLElement ? w.getBoundingClientRect() : null;
    return ii(m ? m.left + m.width / 2 : 0, m ? m.bottom + 8 : 0);
  }
  function p(f, S) {
    o && clearTimeout(o), g(n, f, !0), g(r, S, !0), g(e, !0), o = setTimeout(
      () => {
        g(e, !1), o = void 0;
      },
      1800
    );
  }
  async function y(f, S) {
    const w = b(f, S), m = l(f);
    if (m ? await Zh(m, "nevent", navigator, window) : !1) {
      g(t, { ...a(t), [f.eventId]: void 0 }, !0), p(w.x, w.y);
      return;
    }
    g(t, { ...a(t), [f.eventId]: "failed" }, !0), setTimeout(
      () => {
        g(t, { ...a(t), [f.eventId]: void 0 }, !0);
      },
      1800
    );
  }
  function x() {
    g(t, {}, !0), c();
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
const ry = 5e3, Zi = 8;
class ay {
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
    const r = El(), o = this.resolveRelayUrls(n.relayHints, n.relayConfig);
    let s = !1, l, c, u;
    const b = () => {
      c !== void 0 && (this.clearTimeoutFn(c), c = void 0), l?.unsubscribe?.(), l = void 0;
    }, p = (x) => (f) => {
      s || (s = !0, b(), x(f));
    };
    return {
      promise: new Promise((x) => {
        const f = p(x);
        u = f;
        try {
          l = Al(e, r, {
            on: o.length > 0 ? { relays: o } : { defaultReadRelays: !0 }
          }).subscribe({
            next: (S) => {
              S.event?.id === n.eventId && f({
                event: S.event,
                relayUrl: typeof S.from == "string" ? S.from : null
              });
            },
            complete: () => {
              f({ event: null, relayUrl: null });
            },
            error: (S) => {
              this.console.error("post_history_context_fetch_error", S), f({ event: null, relayUrl: null });
            }
          }), r.emit({ ids: [n.eventId] }), r.over(), c = this.setTimeoutFn(() => {
            this.console.warn("post_history_context_fetch_timeout", n.eventId), f({ event: null, relayUrl: null });
          }, n.timeoutMs ?? ry);
        } catch (S) {
          this.console.error("post_history_context_fetch_request_error", S), f({ event: null, relayUrl: null });
        }
      }),
      cancel: () => {
        u?.({ event: null, relayUrl: null });
      }
    };
  }
  resolveRelayUrls(e, n) {
    const r = kl(
      e,
      Zi
    );
    if (r)
      return r;
    const o = n ? [
      ...hn.extractReadRelays(n),
      ...hn.extractWriteRelays(n)
    ] : [], s = hn.sanitizeExternalRelayUrls([
      ...e ?? [],
      ...o
    ], { limit: Zi });
    return s.length > 0 ? s : hn.sanitizeExternalRelayUrls(
      $l,
      { limit: Zi }
    );
  }
}
const Rd = new ay();
function sy(t, e) {
  return t.length === e.length && t.every((n, r) => n === e[r]);
}
function Sd({
  getShow: t,
  getRxNostr: e,
  profileCache: n = au,
  logger: r = console
}) {
  const o = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Set();
  let l = !1;
  const c = (f, S) => {
    if (!(l || f.disposed || o.get(f.pubkey) !== f || !t() || !S || f.lastProfile === S)) {
      f.lastProfile = S;
      for (const w of s)
        w(f.pubkey, S);
    }
  }, u = (f, S) => {
    if (f.pending || f.disposed || l)
      return;
    const w = f.relayHints;
    f.pending = n.getProfile(f.pubkey, {
      rxNostr: e(),
      additionalRelays: w,
      forceRefresh: S,
      allowBackgroundRefresh: !0
    }).then((m) => {
      c(f, m);
    }).catch((m) => {
      r.error("投稿履歴プロフィールの取得に失敗:", m);
    }).finally(() => {
      o.get(f.pubkey) === f && (f.pending = null, f.refreshQueued && (f.refreshQueued = !1, u(f, !0)));
    });
  }, b = (f, S = []) => {
    if (!f || l)
      return null;
    const w = hn.sanitizeExternalRelayUrls(S), m = o.get(f);
    if (m) {
      const O = hn.mergeRelayConfigs(
        m.relayHints,
        w
      );
      return sy(m.relayHints, O) || (m.relayHints = O, m.pending ? m.refreshQueued = !0 : u(m, !0)), m.lastProfile;
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
  }, p = (f) => {
    if (l)
      return () => {
      };
    s.add(f);
    for (const S of o.values())
      S.lastProfile && f(S.pubkey, S.lastProfile);
    return () => s.delete(f);
  }, y = () => {
    for (const f of o.values())
      f.disposed = !0, f.unsubscribe();
    o.clear();
  };
  return {
    ensureProfile: b,
    subscribe: p,
    reset: y,
    dispose: () => {
      l || (y(), s.clear(), l = !0);
    }
  };
}
const oy = 8;
function Lo(t) {
  return hn.sanitizeExternalRelayUrls(t, { limit: oy });
}
function oc(t, e) {
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
function ic(t) {
  return {
    targetEventId: t.targetEventId,
    status: "loading",
    event: null,
    profile: null,
    authorPubkey: t.authorHint ?? null,
    relayHints: Lo(t.relayHints ?? []),
    errorCode: null,
    updatedAt: null
  };
}
function Id({
  getShow: t,
  getRxNostr: e,
  getRelayConfig: n,
  postHistoryRepositoryImpl: r = it,
  contextFetchService: o = Rd,
  deletionRequestsRepositoryImpl: s = oo,
  deletionFetchService: l = Ri,
  profileSyncCoordinator: c = void 0
}) {
  const u = c ?? Sd({ getShow: t, getRxNostr: e }), b = !c;
  let p = be({}), y = be(lr({})), x = be(lr({}));
  const f = /* @__PURE__ */ new Map(), S = /* @__PURE__ */ new Map(), w = /* @__PURE__ */ new Map(), m = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map(), O = /* @__PURE__ */ new Map(), J = /* @__PURE__ */ new Map();
  let N = 0;
  function Z(E) {
    g(
      y,
      {
        ...a(y),
        [E]: (a(y)[E] ?? 0) + 1
      },
      !0
    );
  }
  function ge(E) {
    const L = S.get(E);
    if (L)
      for (const B of L)
        Z(B);
  }
  function _(E, L) {
    const B = a(p)[E], oe = L(B);
    return B && B.status === oe.status && B.event === oe.event && B.profile === oe.profile && B.authorPubkey === oe.authorPubkey && B.errorCode === oe.errorCode && B.updatedAt === oe.updatedAt && pl(B.relayHints, oe.relayHints) ? B : (g(p, { ...a(p), [E]: oe }), ge(E), oe);
  }
  function se(E, L) {
    return _(E, (B) => {
      const oe = B ?? ic({ targetEventId: E });
      return {
        targetEventId: E,
        status: L.status ?? oe.status,
        event: L.event !== void 0 ? L.event : oe.event,
        profile: L.profile !== void 0 ? L.profile : oe.profile,
        authorPubkey: L.authorPubkey !== void 0 ? L.authorPubkey : oe.authorPubkey,
        relayHints: L.relayHints ? Lo(L.relayHints) : oe.relayHints,
        errorCode: L.errorCode !== void 0 ? L.errorCode : oe.errorCode,
        updatedAt: L.updatedAt !== void 0 ? L.updatedAt : oe.updatedAt
      };
    });
  }
  function Re(E) {
    const L = a(p)[E.targetEventId], B = Lo([...L?.relayHints ?? [], ...E.relayHints ?? []]), oe = L?.authorPubkey ?? E.authorHint ?? null, pe = !L || L.authorPubkey !== oe || !pl(L.relayHints, B);
    return se(E.targetEventId, { authorPubkey: oe, relayHints: B }), pe;
  }
  function Ee(E) {
    const L = f.get(E.scopeKey) ?? /* @__PURE__ */ new Set();
    L.add(E.targetEventId), f.set(E.scopeKey, L);
    const B = S.get(E.targetEventId) ?? /* @__PURE__ */ new Set();
    B.add(E.scopeKey), S.set(E.targetEventId, B), E.scopeKey in a(x) || g(x, { ...a(x), [E.scopeKey]: 0 }, !0), E.scopeKey in a(y) || g(y, { ...a(y), [E.scopeKey]: 0 }, !0);
  }
  async function fe(E, L) {
    return (await s.getDeletedTargets([{ targetAuthorPubkey: E, targetEventId: L }])).get(E)?.has(L) ?? !1;
  }
  function de(E, L) {
    if (!(!E || !L))
      for (const [B, oe] of Object.entries(a(p)))
        oe.authorPubkey === E && se(B, { profile: L });
  }
  function re(E, L) {
    const B = u.ensureProfile(E, L);
    de(E, B);
  }
  u.subscribe((E, L) => {
    t() && de(E, L);
  });
  async function _e(E, L, B = {}) {
    if (!E.pubkey || !E.id)
      return !1;
    if (await fe(E.pubkey, E.id))
      return se(E.id, {
        status: "deleted",
        event: null,
        authorPubkey: E.pubkey,
        relayHints: L,
        errorCode: null,
        updatedAt: Date.now()
      }), !0;
    if (i.has(E.id))
      return i.get(E.id) ?? !1;
    const oe = e();
    if (!oe)
      return !1;
    const pe = (async () => {
      try {
        const V = l.fetchDeletionRequests(oe, {
          targets: [{ event: E, relayUrls: L }],
          relayHints: L,
          relayConfig: n()
        });
        O.set(E.id, V);
        const Ae = await V.promise;
        Ae.events.length > 0 && await s.upsertValidDeletionRequests({
          targetEvents: [E],
          deletionEvents: Ae.events,
          fetchedAt: Ae.fetchedAt
        });
        const ot = await fe(E.pubkey, E.id);
        return ot && se(E.id, {
          status: "deleted",
          event: null,
          authorPubkey: E.pubkey,
          relayHints: L,
          errorCode: null,
          updatedAt: Date.now()
        }), ot;
      } catch {
        return !1;
      } finally {
        O.delete(E.id), i.delete(E.id);
      }
    })();
    return i.set(E.id, pe), B.background ? !1 : pe;
  }
  function ie(E, L) {
    return J.get(E) === L;
  }
  async function Ce(E, L = {}) {
    Ee(E);
    const B = a(p)[E.targetEventId], oe = Re(E), pe = a(p)[E.targetEventId] ?? ic(E), V = !!L.background && B?.status === "resolved";
    if (!L.force && B) {
      if (B.status === "resolved" || B.status === "deleted")
        return B.status === "resolved" && B.authorPubkey && re(B.authorPubkey, a(p)[E.targetEventId]?.relayHints ?? B.relayHints), a(p)[E.targetEventId] ?? B;
      if (B.status === "loading" && w.has(E.targetEventId))
        return await w.get(E.targetEventId) ?? a(p)[E.targetEventId] ?? B;
      if (!oe && (B.status === "not-found" || B.status === "error"))
        return a(p)[E.targetEventId] ?? B;
    }
    if (!L.force && w.has(E.targetEventId))
      return await w.get(E.targetEventId) ?? a(p)[E.targetEventId] ?? pe;
    L.force && (m.get(E.targetEventId)?.cancel(), m.delete(E.targetEventId), w.delete(E.targetEventId));
    const Ae = ++N;
    J.set(E.targetEventId, Ae);
    const ot = (async () => {
      try {
        V || se(E.targetEventId, { status: "loading", errorCode: null });
        const ht = await r.getByEventId(E.targetEventId);
        if (!ie(E.targetEventId, Ae))
          return a(p)[E.targetEventId] ?? null;
        if (ht) {
          const vt = Lo([
            ...pe.relayHints,
            ...ht.relayHints,
            ...ht.acceptedRelays,
            ...ht.fetchedRelays ?? []
          ]);
          if (typeof ht.deletedAt == "number")
            return se(E.targetEventId, {
              status: "deleted",
              event: null,
              authorPubkey: ht.pubkeyHex,
              relayHints: vt,
              errorCode: null,
              updatedAt: Date.now()
            });
          const _t = Cl(ht), gt = se(E.targetEventId, {
            status: "resolved",
            event: _t,
            authorPubkey: _t.pubkey,
            relayHints: vt,
            errorCode: null,
            updatedAt: Date.now()
          });
          return re(_t.pubkey, vt), _e(_t, vt, { background: !0 }), a(p)[E.targetEventId] ?? gt;
        }
        if (E.authorHint) {
          const vt = await _e(oc(E.targetEventId, E.authorHint), pe.relayHints);
          if (!ie(E.targetEventId, Ae))
            return a(p)[E.targetEventId] ?? null;
          if (vt)
            return a(p)[E.targetEventId] ?? null;
        }
        const he = e();
        if (!he || !t())
          return V ? a(p)[E.targetEventId] ?? pe : se(E.targetEventId, {
            status: "error",
            event: null,
            authorPubkey: pe.authorPubkey,
            relayHints: pe.relayHints,
            errorCode: "nostr_not_ready",
            updatedAt: Date.now()
          });
        const Le = o.fetchEventById(he, {
          eventId: E.targetEventId,
          relayHints: pe.relayHints,
          relayConfig: n()
        });
        m.set(E.targetEventId, Le);
        const We = await Le.promise;
        if (m.delete(E.targetEventId), !ie(E.targetEventId, Ae))
          return a(p)[E.targetEventId] ?? null;
        if (!We.event) {
          if (E.authorHint) {
            const vt = await _e(oc(E.targetEventId, E.authorHint), pe.relayHints);
            if (!ie(E.targetEventId, Ae))
              return a(p)[E.targetEventId] ?? null;
            if (vt)
              return a(p)[E.targetEventId] ?? null;
          }
          return V ? a(p)[E.targetEventId] ?? pe : se(E.targetEventId, {
            status: "not-found",
            event: null,
            authorPubkey: pe.authorPubkey,
            relayHints: pe.relayHints,
            errorCode: null,
            updatedAt: Date.now()
          });
        }
        const ae = Lo([
          ...pe.relayHints,
          ...We.relayUrl ? [We.relayUrl] : []
        ]), Ge = await _e(We.event, ae);
        if (!ie(E.targetEventId, Ae))
          return a(p)[E.targetEventId] ?? null;
        if (Ge)
          return a(p)[E.targetEventId] ?? null;
        const Pt = se(E.targetEventId, {
          status: "resolved",
          event: We.event,
          authorPubkey: We.event.pubkey,
          relayHints: ae,
          errorCode: null,
          updatedAt: Date.now()
        });
        return re(We.event.pubkey, ae), a(p)[E.targetEventId] ?? Pt;
      } catch {
        return ie(E.targetEventId, Ae) ? V ? a(p)[E.targetEventId] ?? pe : se(E.targetEventId, {
          status: "error",
          event: null,
          authorPubkey: pe.authorPubkey,
          relayHints: pe.relayHints,
          errorCode: "fetch_failed",
          updatedAt: Date.now()
        }) : a(p)[E.targetEventId] ?? null;
      } finally {
        m.delete(E.targetEventId), w.delete(E.targetEventId);
      }
    })();
    return w.set(E.targetEventId, ot), await ot;
  }
  async function X(E, L = {}) {
    return await Promise.all(E.map((B) => Ce(B, L)));
  }
  async function W(E, L = {}) {
    return await Ce(E, { ...L, force: !0 });
  }
  function te(E) {
    return a(p)[E] ?? null;
  }
  function xe(E) {
    return a(y)[E] ?? 0;
  }
  function Ne(E) {
    const L = f.get(E);
    if (L)
      for (const B of L) {
        const oe = S.get(B);
        oe && (oe.delete(E), !(oe.size > 0) && (S.delete(B), J.delete(B), m.get(B)?.cancel(), m.delete(B), O.get(B)?.cancel(), O.delete(B), w.delete(B), i.delete(B)));
      }
    f.delete(E), g(
      x,
      {
        ...a(x),
        [E]: (a(x)[E] ?? 0) + 1
      },
      !0
    ), Z(E);
  }
  function ne() {
    m.forEach((E) => E.cancel()), O.forEach((E) => E.cancel()), m.clear(), O.clear(), w.clear(), i.clear(), f.clear(), S.clear(), b && u.reset(), J.clear(), g(p, {}), g(y, {}, !0), g(x, {}, !0);
  }
  return {
    ensureTarget: Ce,
    ensureTargets: X,
    retryTarget: W,
    getTargetSnapshot: te,
    getScopeRevision: xe,
    invalidateScope: Ne,
    reset: ne
  };
}
const iy = /nostr:[^\s<>"']+/gi, ly = /[),.!?:;\]\u3001\u3002\uff01\uff08\uff09\uff0c\uff0e\uff1a\uff1b\u300d\u300f\u3011]+$/u, dy = /^[\s),.!?:;\]\u3001\u3002\uff01\uff08\uff09\uff0c\uff0e\uff1a\uff1b\u300d\u300f\u3011]+$/u;
function cy(t) {
  return hn.sanitizeExternalRelayUrls(
    typeof t == "string" && t.length > 0 ? [t] : [],
    { limit: 1 }
  )[0] ?? null;
}
function uy(t) {
  const e = t.match(ly);
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
function hy(t) {
  if (!t.toLowerCase().startsWith("nostr:"))
    return null;
  try {
    const e = fu.decode(t.slice(6));
    return e.type === "note" ? e.data : e.type === "nevent" ? e.data.id : null;
  } catch {
    return null;
  }
}
function fy(t) {
  const e = t.replace(/[ \t]{2,}/g, " ").trim();
  return e.length === 0 || dy.test(e) ? null : e;
}
function yh(t) {
  if (!t)
    return [];
  const e = /* @__PURE__ */ new Map();
  for (const n of t.tags) {
    if (!Array.isArray(n) || n[0] !== "q")
      continue;
    const r = n[1];
    if (!qd(r))
      continue;
    const o = cy(n[2]), s = qd(n[3]) ? n[3] : null, l = e.get(r);
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
function py(t) {
  if (!t || typeof t.content != "string" || t.content.length === 0)
    return t?.content ?? "";
  const e = yh(t);
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
    for (const b of s.matchAll(iy)) {
      const p = b.index ?? -1, y = b[0] ?? "";
      if (p < 0 || !y)
        continue;
      const { uri: x, trailingText: f } = uy(y), S = hy(x);
      !S || !n.has(S) || (u = !0, r = !0, l += s.slice(c, p), l += f, c = p + y.length);
    }
    return u ? (l += s.slice(c), fy(l)) : s;
  });
  return r ? o.filter((s) => s !== null).join(`
`) : t.content;
}
const vy = 8, Xi = {
  byPostId: {},
  contextsByEventId: {}
};
function _d(t) {
  return hn.sanitizeExternalRelayUrls(t, {
    limit: vy
  });
}
function mh(t) {
  return {
    sourceEventId: t.sourceEventId,
    targetEventId: t.targetEventId,
    relationKind: t.relationKind,
    relayHints: _d(t.relayHints),
    authorHint: t.authorHint,
    scopeKey: t.scopeKey
  };
}
const Os = {
  buildIndex(t) {
    const e = {}, n = {};
    for (const r of t) {
      const o = yh(r);
      if (o.length !== 0) {
        e[r.eventId] = o;
        for (const s of o) {
          const l = n[s.eventId];
          n[s.eventId] = {
            eventId: s.eventId,
            sourceEventId: l?.sourceEventId ?? r.eventId,
            authorHint: l?.authorHint ?? s.authorHint,
            relayHints: _d([
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
    return mh({
      sourceEventId: t.sourceEventId,
      targetEventId: t.eventId,
      relationKind: "quote",
      relayHints: t.relayHints,
      authorHint: t.authorHint,
      scopeKey: e
    });
  }
}, el = {
  getRelayHints(t, e) {
    const n = ns(e.event);
    return _d([
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
    return mh({
      sourceEventId: t.sourceEventId,
      targetEventId: t.targetEventId,
      relationKind: "reply-parent",
      relayHints: t.relayHints,
      authorHint: t.authorHint,
      scopeKey: e
    });
  }
};
let gy = 0;
function yy(t) {
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
function my(t, e) {
  const n = yy(e?.status);
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
function by({
  getShow: t,
  getPosts: e,
  getRxNostr: n,
  getRelayConfig: r,
  postHistoryRepositoryImpl: o = it,
  contextFetchService: s = Rd,
  deletionRequestsRepositoryImpl: l = oo,
  deletionFetchService: c = Ri,
  profileSyncCoordinator: u = void 0,
  relatedTargetResolver: b = void 0
}) {
  const p = b ?? Id({
    getShow: t,
    getRxNostr: n,
    getRelayConfig: r,
    postHistoryRepositoryImpl: o,
    contextFetchService: s,
    deletionRequestsRepositoryImpl: l,
    deletionFetchService: c,
    profileSyncCoordinator: u
  }), y = !b, x = `post-history-quote-preview:${++gy}`;
  let f = be(0), S = be(lr(Xi));
  function w() {
    g(S, Xi, !0), y && p.reset();
  }
  function m(J) {
    return a(f), (a(S).byPostId[J.eventId] ?? []).map((N) => my(N.eventId, p.getTargetSnapshot(N.eventId)));
  }
  function i(J) {
    const N = a(S).contextsByEventId[J];
    N && p.retryTarget(Os.toDescriptor(N, x));
  }
  async function O(J) {
    const N = Os.buildIndex(J), Z = Object.values(N.contextsByEventId);
    Z.length !== 0 && await p.ensureTargets(Z.map((ge) => Os.toDescriptor(ge, x)), { force: !0 });
  }
  return ze(() => {
    t() || g(S, Xi, !0);
  }), ze(() => {
    t() && g(f, p.getScopeRevision(x), !0);
  }), ze(() => {
    t() && g(S, Os.buildIndex(e()), !0);
  }), ze(() => {
    if (!t())
      return;
    n(), r();
    const J = Object.values(a(S).contextsByEventId);
    J.length !== 0 && p.ensureTargets(J.map((N) => Os.toDescriptor(N, x)));
  }), io(() => {
    p.invalidateScope(x), w();
  }), { getQuotePreviews: m, retryQuotePreview: i, refreshQuotePreviews: O };
}
const hi = {
  currentPage: 1,
  searchPage: 1,
  searchInput: "",
  searchQuery: ""
}, fi = /* @__PURE__ */ new Map();
function Ed(t) {
  if (typeof t != "string")
    return null;
  const e = t.trim();
  return e.length > 0 ? e : null;
}
function lc(t) {
  return typeof t != "number" || !Number.isFinite(t) ? 1 : Math.max(1, Math.trunc(t));
}
function pi(t) {
  return {
    currentPage: t.currentPage,
    searchPage: t.searchPage,
    searchInput: t.searchInput,
    searchQuery: t.searchQuery
  };
}
function Cy(t) {
  const e = Ed(t);
  return pi(
    e ? fi.get(e) ?? hi : hi
  );
}
function dc(t, e) {
  const n = Ed(t);
  if (!n)
    return pi(
      hi
    );
  const r = fi.get(n) ?? hi, o = {
    currentPage: lc(e.currentPage ?? r.currentPage),
    searchPage: lc(e.searchPage ?? r.searchPage),
    searchInput: e.searchInput ?? r.searchInput,
    searchQuery: e.searchQuery ?? r.searchQuery
  };
  return fi.set(n, o), pi(o);
}
function cc(t) {
  const e = Ed(t);
  e && fi.delete(e);
}
function wy(t) {
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
function Py(t) {
  return Number.isFinite(t) ? Math.max(1, Math.trunc(t)) : 1;
}
function xy(t) {
  return Number.isFinite(t) ? Math.max(1, Math.trunc(t)) : 50;
}
function Ry(t) {
  return t.trim().toLowerCase().split(/\s+/).filter(Boolean);
}
function Sy(t) {
  return t.join(" ");
}
function uc(t) {
  return {
    postHistory: to(t),
    channelMetadata: tf()
  };
}
function tl(t, e) {
  return t.postHistory === e.postHistory && t.channelMetadata === e.channelMetadata;
}
function Iy(t, e) {
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
function _y(t) {
  return Array.from(
    new Set(
      t.map((e) => e.channelEventId).filter(
        (e) => typeof e == "string" && e.length > 0
      )
    )
  );
}
class Ey {
  constructor(e = it, n = ef) {
    this.postHistoryRepositoryImpl = e, this.channelMetadataRepositoryImpl = n;
  }
  resolvedCacheEntry = null;
  inFlightEntry = null;
  runtimeCacheToken = 0;
  clearCache() {
    this.resolvedCacheEntry = null, this.inFlightEntry = null, this.runtimeCacheToken += 1;
  }
  isResolvedCacheEntryCurrent(e, n, r, o) {
    return e.pubkeyHex === n && e.normalizedQueryKey === r && tl(e.revision, o);
  }
  async buildFilteredPosts(e, n) {
    const r = await this.postHistoryRepositoryImpl.getAll({ pubkeyHex: e }), o = _y(r), s = /* @__PURE__ */ new Map();
    return o.length > 0 && (await this.channelMetadataRepositoryImpl.getMany(
      o
    )).forEach((c) => {
      s.set(c.channelEventId, c);
    }), r.filter((l) => {
      const c = Iy(
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
        const p = await this.buildFilteredPosts(e, r), y = uc(e), x = tl(
          u,
          y
        );
        if (x && this.inFlightEntry?.identity === s && this.runtimeCacheToken === l && (this.resolvedCacheEntry = {
          pubkeyHex: e,
          normalizedQueryKey: n,
          revision: u,
          filteredPosts: p
        }), x || b === 1)
          return p;
        u = y, this.inFlightEntry?.identity === s && this.runtimeCacheToken === l && (c.revision = u);
      }
      return [];
    })().finally(() => {
      this.inFlightEntry?.identity === s && (this.inFlightEntry = null);
    }), this.inFlightEntry = c, c;
  }
  async searchLocalPosts(e) {
    const n = Ry(e.query);
    if (!e.pubkeyHex || n.length === 0)
      return {
        items: [],
        total: 0,
        hasNext: !1
      };
    const r = Py(e.page), o = xy(e.pageSize), s = e.pubkeyHex, l = Sy(n), c = uc(s), u = this.resolvedCacheEntry, b = u && this.isResolvedCacheEntryCurrent(
      u,
      s,
      l,
      c
    ) ? u.filteredPosts : await (() => {
      const x = this.inFlightEntry;
      return (x && x.runtimeCacheToken === this.runtimeCacheToken && x.pubkeyHex === s && x.normalizedQueryKey === l && tl(x.revision, c) ? x : this.startFilteredPostsBuild(
        s,
        l,
        n,
        c
      )).promise;
    })(), p = (r - 1) * o, y = p + o;
    return {
      items: b.slice(p, y),
      total: b.length,
      hasNext: y < b.length
    };
  }
}
const Io = new Ey(), Ay = 500, ky = 12, Dy = 3600;
class hc extends Error {
  phase;
  phaseStartedAt;
  errorClass;
  constructor(e, n, r) {
    super(e), this.name = "PostHistoryCurrentViewRefetchFailure", this.phase = e, this.phaseStartedAt = r, this.errorClass = n instanceof Error ? n.name : typeof n, this.cause = n;
  }
}
function Ty(t, e) {
  return t.status === "timeout" || t.status === "error" || t.status === "cancelled" ? t.status : typeof t.coverageComplete == "boolean" ? t.coverageComplete && !t.coverageSaturated ? "complete" : "partial" : t.hasMore || t.perRelayCounts.some((n) => n.rawCount >= e) ? "partial" : "complete";
}
function My(t) {
  return t === "partial" || t === "timeout" || t === "error";
}
function Oy(t, e) {
  return typeof t.coverageSaturated == "boolean" ? t.coverageSaturated : t.hasMore || t.perRelayCounts.some((n) => n.rawCount >= e);
}
function Ly(t) {
  return typeof t.since == "number" && typeof t.until == "number" && t.until - t.since > Dy;
}
function Fy(t) {
  if (!Ly(t))
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
class Hy {
  postHistoryRelayFetchService;
  postHistoryRepository;
  setTimeoutFn;
  clearTimeoutFn;
  console;
  now;
  constructor(e = {}) {
    this.postHistoryRelayFetchService = e.postHistoryRelayFetchService ?? ai, this.postHistoryRepository = e.postHistoryRepository ?? it, this.setTimeoutFn = e.setTimeoutFn ?? setTimeout, this.clearTimeoutFn = e.clearTimeoutFn ?? clearTimeout, this.console = e.console ?? (typeof globalThis.console < "u" ? globalThis.console : { debug: () => {
    } }), this.now = e.now ?? Date.now;
  }
  async waitBetweenFetches(e) {
    await new Promise((n) => {
      const r = this.setTimeoutFn(() => {
        e(null), n();
      }, Ay);
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
        let u = 0, b = 0, p = 0, y = 0, x = !1, f = !1, S = !1, w = !1, m = !1, i = 0, O = 0, J = 0, N = 0, Z = 0, ge = !0;
        const _ = [];
        for (; l.length > 0; ) {
          const de = l.shift();
          if (r || (y > 0 && await this.waitBetweenFetches((oe) => {
            s = oe;
          }), r))
            break;
          const re = this.postHistoryRelayFetchService.fetchLatest(e, {
            pubkeyHex: n.pubkeyHex,
            relayConfig: n.relayConfig,
            reason: "repair-visible-range",
            kinds: de.kinds,
            limit: de.limit || su,
            timeoutMs: nf,
            ...typeof de.since == "number" ? { since: de.since } : {},
            ...typeof de.until == "number" ? { until: de.until } : {}
          });
          o = re;
          const _e = this.now();
          let ie;
          try {
            ie = await re.promise;
          } catch (oe) {
            const pe = this.now();
            throw J += Math.max(0, pe - _e), new hc(
              "primary-fetch",
              oe,
              _e
            );
          }
          J += Math.max(0, this.now() - _e), o = null, y += 1, O += ie.events.length, S = S || ie.status === "error", w = w || ie.status === "timeout";
          const Ce = typeof ie.coverageComplete == "boolean", X = ie.events.length === 0 && (Ce ? ie.allCoverageRelaysFailed === !0 : !ie.hasAnyRelayResponse && (ie.allRelaysFailed || ie.status === "error"));
          ge = ge && X;
          let W = 0, te = 0, xe = 0;
          if (ie.events.length > 0) {
            const oe = this.now();
            Z += 1;
            let pe;
            try {
              pe = await this.postHistoryRepository.upsertFetchedEvents({
                events: ie.events,
                fetchedAt: ie.fetchedAt
              });
            } catch (V) {
              throw N += Math.max(0, this.now() - oe), new hc(
                "primary-persist",
                V,
                oe
              );
            }
            N += Math.max(0, this.now() - oe), W = pe.insertedCount, te = pe.updatedCount, xe = pe.unchangedCount, u += W, b += te, p += xe, await n.onProgress?.({
              insertedCount: W,
              updatedCount: te,
              unchangedCount: xe,
              processedRangeCount: _.length + 1,
              attemptedRangeCount: y,
              addedCount: u,
              totalUpdatedCount: b,
              totalUnchangedCount: p
            });
          }
          const Ne = Oy(ie, de.limit);
          f = f || Ne;
          const ne = Ne ? Fy(de) : [], E = ne.length > 0 && _.length + 1 + l.length + ne.length <= ky, L = Ne ? "limit" : Ty(ie, de.limit);
          if (_.push({
            source: "preferred",
            rangeUnit: de.rangeUnit,
            ...typeof de.since == "number" ? { since: de.since } : {},
            ...typeof de.until == "number" ? { until: de.until } : {},
            requestedRelayUrls: [...ie.requestedRelayUrls],
            observedRelayUrls: [...ie.observedRelayUrls],
            eventRelayUrls: [...ie.eventRelayUrls],
            eoseRelayUrls: [...ie.eoseRelayUrls],
            closedRelayUrls: [...ie.closedRelayUrls],
            errorRelayUrls: [...ie.errorRelayUrls],
            downRelayUrls: [...ie.downRelayUrls],
            completedByRxNostr: ie.completedByRxNostr,
            completedByLocalTimeout: ie.completedByLocalTimeout,
            hasAnyRelayResponse: ie.hasAnyRelayResponse,
            allRelaysFailed: ie.allRelaysFailed,
            ...typeof ie.coverageComplete == "boolean" ? {
              coverageRelayUrls: [...ie.coverageRelayUrls ?? []],
              coverageEoseRelayUrls: [...ie.coverageEoseRelayUrls ?? []],
              bestEffortRelayUrls: [...ie.bestEffortRelayUrls ?? []],
              coverageComplete: ie.coverageComplete,
              coverageSaturated: ie.coverageSaturated ?? !1,
              allCoverageRelaysFailed: ie.allCoverageRelaysFailed ?? !1
            } : {},
            status: L,
            rawCount: ie.rawCount,
            uniqueCount: ie.uniqueCount,
            duplicateCount: ie.duplicateCount,
            insertedCount: W,
            updatedCount: te,
            unchangedCount: xe
          }), Ne && E ? (i += ne.length, l.unshift(...ne)) : Ne && (m = !0), (My(L) || X || Ne && !E) && (x = !0), r || ie.status === "cancelled") {
            r = !0;
            break;
          }
        }
        const se = !r && y > 0 && O === 0 && ge, Re = x || m || se, fe = {
          status: r ? "cancelled" : Re ? "partial" : "success",
          addedCount: u,
          updatedCount: b,
          unchangedCount: p,
          processedRangeCount: _.length,
          attemptedRangeCount: y,
          hadFailures: Re,
          limitReached: f,
          hadFetchError: S,
          fetchFailed: se,
          hadTimeout: w,
          hadUnfinishedRanges: m,
          splitRetryCount: i,
          processedRanges: _,
          timing: {
            primaryFetchDurationMs: J,
            primaryPersistDurationMs: N,
            primaryPersistAttemptCount: Z
          }
        };
        return this.console.debug("post_history_current_view_refetch_summary", {
          pubkeyHex: n.pubkeyHex,
          processedRangeCount: fe.processedRangeCount,
          addedCount: fe.addedCount,
          updatedCount: fe.updatedCount,
          hadFailures: fe.hadFailures,
          limitReached: fe.limitReached,
          hadFetchError: fe.hadFetchError,
          fetchFailed: fe.fetchFailed,
          hadTimeout: fe.hadTimeout,
          hadUnfinishedRanges: fe.hadUnfinishedRanges,
          splitRetryCount: fe.splitRetryCount,
          processedRanges: fe.processedRanges
        }), fe;
      })(),
      cancel: () => {
        r = !0, s?.(), o?.cancel();
      }
    };
  }
}
const $y = new Hy(), Ad = [
  "reply",
  "reaction",
  "quote"
];
function bh(t) {
  const e = t ?? Ad;
  return Array.from(new Set(e.filter(
    (n) => n === "reply" || n === "reaction" || n === "quote"
  )));
}
function Ny(t, e) {
  const n = bh(
    e.relationKinds
  );
  return {
    source: t,
    relationKinds: n,
    parentEventIds: Array.from(new Set(e.savedParentEventIds)),
    shouldRefreshQuotePreviews: n.includes("quote") && e.quoteRepairApplied
  };
}
const _o = {
  status: "saved",
  savedParentEventIds: [],
  savedDirectReplyCount: 0,
  deletedEventIds: [],
  deletionConfirmationIncomplete: !1
};
function By(t) {
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
function Uy(t, e) {
  return t.filter((n) => e.get(n.event.pubkey)?.has(n.event.id)).map((n) => n.event.id);
}
function Eo(t) {
  return {
    ...t,
    status: "cancelled",
    savedParentEventIds: [],
    savedDirectReplyCount: 0
  };
}
class qy {
  deletionFetchService;
  deletionRequestsRepository;
  childInteractionsRepository;
  now;
  constructor(e = {}) {
    this.deletionFetchService = e.deletionFetchService ?? Ri, this.deletionRequestsRepository = e.deletionRequestsRepository ?? oo, this.childInteractionsRepository = e.childInteractionsRepository ?? Dl, this.now = e.now ?? Date.now;
  }
  saveRepairDirectReplies(e, n) {
    let r = !0, o = null;
    const s = () => r && n.isActive?.() !== !1;
    return {
      promise: (async () => {
        const c = By(n.items);
        if (c.length === 0)
          return _o;
        const u = await this.filterKnownDeletedDirectReplies(c);
        let b = u.deletedEventIds;
        if (!s())
          return Eo({
            ..._o,
            deletedEventIds: b
          });
        let p = u.visibleItems, y = !1;
        if (p.length > 0) {
          o = this.deletionFetchService.fetchDeletionRequests(e, {
            targets: p.map((w) => ({
              event: w.event,
              relayUrls: w.relayUrls
            })),
            relayHints: n.relayHints,
            relayConfig: n.relayConfig
          });
          const f = await o.promise;
          if (o = null, !s() || f.status === "cancelled")
            return Eo({
              ..._o,
              deletedEventIds: b,
              deletionConfirmationIncomplete: y || f.status !== "success"
            });
          if (y = f.status !== "success", f.events.length > 0 && await this.deletionRequestsRepository.upsertValidDeletionRequests({
            targetEvents: p.map((w) => w.event),
            deletionEvents: f.events,
            fetchedAt: f.fetchedAt
          }), !s())
            return Eo({
              ..._o,
              deletedEventIds: b,
              deletionConfirmationIncomplete: y
            });
          const S = await this.filterKnownDeletedDirectReplies(p);
          p = S.visibleItems, b = Array.from(/* @__PURE__ */ new Set([
            ...b,
            ...S.deletedEventIds
          ]));
        }
        if (!s())
          return Eo({
            ..._o,
            deletedEventIds: b,
            deletionConfirmationIncomplete: y
          });
        const x = await this.saveVisibleDirectReplies(
          p,
          n.fetchedAt ?? this.now(),
          s
        );
        return s() ? {
          ...x,
          status: "saved",
          deletedEventIds: b,
          deletionConfirmationIncomplete: y
        } : Eo({
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
    ), r = Uy(e, n);
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
      }), p = b.insertedCount + b.updatedCount;
      p > 0 && (s.push(c), l += p);
    }
    return {
      status: "saved",
      savedParentEventIds: s,
      savedDirectReplyCount: l
    };
  }
}
const Vy = new qy(), jy = 150, fc = 30, Ky = 10, Yy = 2, pc = 250, zy = 6e3, vc = 8, Qy = 6e4, Wy = Ad, gc = {
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
function Jy() {
  const t = Math.random().toString(36).slice(2, 10);
  return `post-history-visible-relation-repair-${Date.now().toString(36)}-${t}`;
}
function Gy(t, e) {
  const n = /* @__PURE__ */ new Map();
  for (const r of e)
    if (!(r.kind !== 1 && r.kind !== 42 || r.pubkeyHex !== t || !r.eventId || n.has(r.eventId)) && (n.set(r.eventId, r), n.size >= jy))
      break;
  return Array.from(n.values());
}
function Pl(t, e) {
  const n = [];
  for (let r = 0; r < t.length; r += e)
    n.push(t.slice(r, r + e));
  return n;
}
function Zy(t, e) {
  return e.includeDirectReplies ? [1, 42].flatMap(
    (n) => Pl(
      t.filter((r) => r.kind === n),
      fc
    ).map((r) => ({ posts: r, depth: 0 }))
  ) : Pl(
    t,
    fc
  ).map((n) => ({ posts: n, depth: 0 }));
}
function Xy(t) {
  return Array.from(t.values()).map((e) => ({
    event: e.event,
    relayUrls: Array.from(e.relayUrls).sort((n, r) => n.localeCompare(r))
  })).sort((e, n) => e.event.created_at !== n.event.created_at ? n.event.created_at - e.event.created_at : e.event.id.localeCompare(n.event.id));
}
class em {
  directReplySaveService;
  childInteractionsRepository;
  quoteVisibleRangeRepairExecutor;
  console;
  setTimeoutFn;
  clearTimeoutFn;
  now;
  lastFetchTimeoutWarnAt = 0;
  constructor(e = {}) {
    this.directReplySaveService = e.directReplySaveService ?? Vy, this.childInteractionsRepository = e.childInteractionsRepository ?? Dl, this.quoteVisibleRangeRepairExecutor = e.quoteVisibleRangeRepairExecutor, this.console = e.console ?? (typeof globalThis.console < "u" ? globalThis.console : { warn: () => {
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
    const r = bh(
      n.relationKinds ?? Wy
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
    const s = /* @__PURE__ */ new Set(), l = /* @__PURE__ */ new Set(), c = () => o && n.isActive?.() !== !1, u = Gy(n.ownerPubkeyHex, n.visiblePosts), b = u.map((y) => y.eventId);
    return {
      promise: (async () => {
        if (u.length === 0)
          return {
            ...gc,
            targetParentEventIds: b
          };
        const y = /* @__PURE__ */ new Set(), x = /* @__PURE__ */ new Set();
        let f = 0, S = 0, w = 0, m = !1, i = !1;
        const O = async (Z) => {
          const ge = [];
          let _ = 0;
          const se = Math.min(
            Yy,
            Z.length
          ), Re = async () => {
            for (; c(); ) {
              const Ee = Z[_++];
              if (!Ee)
                return;
              S += 1;
              const fe = this.fetchCandidates(
                e,
                Ee.posts,
                n.relayConfig,
                r
              );
              s.add(fe);
              const de = await fe.promise;
              if (s.delete(fe), !c() || de.status === "cancelled")
                return;
              const re = Ee.depth === 0 && de.requiresFallback;
              de.status !== "success" && !re && (i = !0), de.requiresFallback && (w += 1, Ee.depth === 0 ? ge.push(
                ...Pl(
                  Ee.posts,
                  Ky
                ).map((X) => ({ posts: X, depth: 1 }))
              ) : de.coverageSaturated && (i = !0));
              const _e = r.includeDirectReplies ? this.toDirectReplyItems(
                Ee.posts,
                de.items
              ) : [], ie = r.includeReactions ? this.toReactionItems(
                Ee.posts,
                de.items
              ) : [], Ce = de.status === "success" && !de.coverageSaturated && !(Ee.depth === 0 && de.requiresFallback);
              if (_e.length === 0 && ie.length === 0) {
                Ce && Ee.posts.forEach((X) => x.add(X.eventId));
                continue;
              }
              if (_e.length > 0) {
                const X = this.directReplySaveService.saveRepairDirectReplies(e, {
                  items: _e,
                  relayHints: [
                    ...this.collectParentRelayHints(Ee.posts),
                    ...de.relayUrls
                  ],
                  relayConfig: n.relayConfig,
                  fetchedAt: de.fetchedAt,
                  isActive: c
                });
                l.add(X);
                const W = await X.promise;
                if (l.delete(X), !c() || W.status === "cancelled")
                  return;
                W.savedParentEventIds.forEach(
                  (te) => y.add(te)
                ), f += W.savedDirectReplyCount, m = m || W.deletionConfirmationIncomplete;
              }
              if (ie.length > 0) {
                const X = await this.saveReactionInteractions(
                  ie,
                  de.fetchedAt,
                  c
                );
                if (!c())
                  return;
                X.savedParentEventIds.forEach(
                  (W) => y.add(W)
                );
              }
              Ce && Ee.posts.forEach((X) => x.add(X.eventId));
            }
          };
          return await Promise.all(Array.from({ length: se }, () => Re())), ge;
        }, J = await O(Zy(u, r));
        if (c() && J.length > 0 && await O(J), !c())
          return {
            ...gc,
            status: "cancelled",
            targetParentEventIds: b,
            attemptedChunkCount: S,
            saturatedChunkCount: w,
            deletionConfirmationIncomplete: m
          };
        const N = b.filter(
          (Z) => !x.has(Z)
        );
        return {
          status: i || N.length > 0 ? "partial" : "success",
          targetParentEventIds: b,
          checkedParentEventIds: Array.from(x),
          savedParentEventIds: Array.from(y),
          savedDirectReplyCount: f,
          attemptedChunkCount: S,
          saturatedChunkCount: w,
          incompleteParentEventIds: N,
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
      return !s || !l || !ws({ child: o.event, parent: l }).valid ? [] : [{
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
      const s = Ef(o.event);
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
    const s = this.resolveRelayPlan(n, r), { destinationRelayUrls: l, coverageRelayUrls: c } = s, u = n.map((re) => re.eventId), b = Jy(), p = `${b}:0`, y = El(b), x = /* @__PURE__ */ new Map(), f = /* @__PURE__ */ new Map(), S = /* @__PURE__ */ new Set(), w = /* @__PURE__ */ new Set(), m = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Set();
    let O = 0, J = !1, N, Z, ge, _, se, Re;
    const Ee = () => {
      se !== void 0 && (this.clearTimeoutFn(se), se = void 0), N?.unsubscribe?.(), N = void 0, Z?.unsubscribe?.(), Z = void 0, ge?.unsubscribe?.(), ge = void 0, _?.unsubscribe?.(), _ = void 0;
    }, fe = (re) => {
      const _e = Xy(x), ie = new Set(
        Array.from(f.entries()).filter(([, te]) => te >= pc).map(([te]) => te)
      ), Ce = c.some(
        (te) => ie.has(te)
      ), X = c.length > 0 && c.every((te) => S.has(te));
      return {
        status: re === "cancelled" ? "cancelled" : re === "error" ? "error" : X ? "success" : "partial",
        items: _e,
        rawCount: O,
        requiresFallback: ie.size > 0,
        coverageSaturated: Ce,
        fetchedAt: this.now(),
        relayUrls: l,
        eoseRelayUrls: Array.from(S).sort(),
        closedRelayUrls: Array.from(w).sort(),
        errorRelayUrls: Array.from(m).sort(),
        downRelayUrls: Array.from(i).sort(),
        perRelayRawCounts: Array.from(f.entries()).map(([te, xe]) => ({ relayUrl: te, rawCount: xe })).sort((te, xe) => te.relayUrl.localeCompare(xe.relayUrl))
      };
    };
    return {
      promise: new Promise((re) => {
        const _e = (ie) => {
          J || (J = !0, Ee(), re(fe(ie)));
        };
        Re = _e;
        try {
          if (u.length === 0) {
            _e("complete");
            return;
          }
          Z = e.createAllMessageObservable?.().subscribe({
            next: (Ce) => {
              this.handleCandidateMessagePacket({
                packet: Ce,
                targetSubId: p,
                destinationRelayUrls: l,
                eoseRelayUrls: S,
                closedRelayUrls: w,
                perRelayRawCounts: f
              });
            }
          }), ge = e.createAllErrorObservable?.().subscribe({
            next: (Ce) => {
              const X = this.sanitizeCandidateRelayUrl(Ce.from, l);
              X && m.add(X);
            }
          }), _ = e.createConnectionStateObservable?.().subscribe({
            next: (Ce) => {
              const X = this.sanitizeCandidateRelayUrl(Ce.from, l);
              X && (Ce.state === "error" || Ce.state === "rejected" || Ce.state === "terminated") && i.add(X);
            }
          }), N = Al(e, y, {
            on: l.length > 0 ? { relays: l } : { defaultReadRelays: !0 }
          }).subscribe({
            next: (Ce) => {
              O += 1;
              const X = this.sanitizeCandidateRelayUrl(
                Ce.from,
                l
              );
              this.handleCandidatePacket(x, Ce, X);
            },
            complete: () => _e("complete"),
            error: (Ce) => {
              this.console.error("post_history_visible_child_interaction_repair_fetch_error", Ce), _e("error");
            }
          });
          const ie = Array.from(/* @__PURE__ */ new Set([
            ...o.includeDirectReplies ? n.map((Ce) => Ce.kind) : [],
            ...o.includeReactions ? [7] : []
          ])).filter((Ce) => Ce === 1 || Ce === 7 || Ce === 42);
          y.emit({
            kinds: ie,
            "#e": u,
            limit: pc
          }), y.over(), se = this.setTimeoutFn(() => {
            c.length > 0 && c.every((X) => S.has(X)) || this.warnCandidateFetchTimeout(), _e("timeout");
          }, zy);
        } catch (ie) {
          this.console.error("post_history_visible_child_interaction_repair_request_error", ie), _e("error");
        }
      }),
      cancel: () => Re?.("cancelled")
    };
  }
  warnCandidateFetchTimeout() {
    const e = this.now();
    e - this.lastFetchTimeoutWarnAt < Qy || (this.lastFetchTimeoutWarnAt = e, this.console.warn("post_history_visible_child_interaction_repair_fetch_timeout"));
  }
  handleCandidatePacket(e, n, r) {
    const o = n.event;
    if (!o?.id || o.kind !== 1 && o.kind !== 7 && o.kind !== 42)
      return;
    const s = e.get(o.id);
    if (!s) {
      e.set(o.id, {
        event: o,
        relayUrls: new Set(r ? [r] : [])
      });
      return;
    }
    if (!yu(s.event, o)) {
      this.console.warn("post_history_visible_child_interaction_repair_packet_conflict");
      return;
    }
    r && s.relayUrls.add(r);
  }
  collectParentRelayHints(e) {
    return e.flatMap((n) => [
      ...n.relayHints ?? [],
      ...n.acceptedRelays ?? [],
      ...n.fetchedRelays ?? []
    ]);
  }
  handleCandidateMessagePacket(e) {
    const n = this.sanitizeCandidateRelayUrl(
      e.packet.from,
      e.destinationRelayUrls
    );
    if (n) {
      if (e.packet.type === "EVENT" && e.packet.subId === e.targetSubId) {
        e.perRelayRawCounts.set(
          n,
          (e.perRelayRawCounts.get(n) ?? 0) + 1
        );
        return;
      }
      if (e.packet.type === "EOSE" && e.packet.subId === e.targetSubId) {
        e.eoseRelayUrls.add(n);
        return;
      }
      e.packet.type === "CLOSED" && e.packet.subId === e.targetSubId && e.closedRelayUrls.add(n);
    }
  }
  sanitizeCandidateRelayUrl(e, n) {
    const r = hn.sanitizeExternalRelayUrls(
      typeof e == "string" ? [e] : [],
      { limit: 1 }
    )[0] ?? null;
    return r && n.includes(r) ? r : null;
  }
  resolveRelayPlan(e, n) {
    const r = this.collectParentRelayHints(e), o = kl(
      r,
      vc
    );
    if (o !== null)
      return {
        destinationRelayUrls: o,
        coverageRelayUrls: rf()
      };
    const s = n ? hn.sanitizeExternalRelayUrls(
      hn.extractReadRelays(n)
    ) : [], l = n ? hn.sanitizeExternalRelayUrls(
      hn.extractWriteRelays(n)
    ) : [], c = hn.sanitizeExternalRelayUrls($l), u = s.length > 0 ? s : l.length > 0 ? l : c, b = s.length > 0 ? l.filter((y) => !u.includes(y)) : [], p = hn.sanitizeExternalRelayUrls(
      r,
      { limit: vc }
    );
    return {
      coverageRelayUrls: u,
      destinationRelayUrls: hn.sanitizeExternalRelayUrls([
        ...u,
        ...b,
        ...p
      ])
    };
  }
}
const tm = new em(), nm = 300 * 1e3;
function rm(t, e, n) {
  const r = new Set(
    n.map((s) => s.eventId)
  ), o = /* @__PURE__ */ new Map();
  for (const s of e)
    s.kind !== 1 && s.kind !== 42 || s.pubkeyHex !== t || !r.has(s.eventId) || o.has(s.eventId) || o.set(s.eventId, s);
  return Array.from(o.values());
}
function am(t, e, n, r, o = nm) {
  return t.filter((s) => {
    if (n.has(s))
      return !1;
    const l = e.get(s);
    return typeof l != "number" || r - l >= o;
  });
}
function yc(t, e) {
  return {
    status: e ? t.status : "cancelled",
    savedDirectReplyCount: t.savedDirectReplyCount
  };
}
function sm({
  getShow: t,
  getPubkeyHex: e,
  getRxNostr: n,
  getRelayConfig: r,
  getLoadedPosts: o,
  onChildInteractionBadgeRefreshRequested: s,
  onQuoteVisibleRangeRefreshRequested: l,
  quoteVisibleRangeRepairExecutor: c,
  relationRepairService: u = tm,
  triggerDeletionLifecycle: b = Tl,
  now: p = Date.now
}) {
  let y = null, x = 0, f = 0, S = !1;
  const w = /* @__PURE__ */ new Set(), m = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Set();
  function O(X, W) {
    return !S && X === x && W();
  }
  function J(X, W, te) {
    return !S && X === f && t() && e() === W && n() === te;
  }
  function N(X) {
    const W = o();
    W.length === 0 || X.length === 0 || Promise.resolve(
      s(W, X)
    ).catch(() => {
    });
  }
  async function Z(X) {
    const W = o();
    W.length === 0 || X.length === 0 || await s(W, X);
  }
  function ge(X) {
    X.length !== 0 && Promise.resolve(
      l(X)
    ).catch(() => {
    });
  }
  async function _(X) {
    if (!X.isActive())
      return;
    const W = Ny(X.source, {
      relationKinds: X.result.relationKinds,
      savedParentEventIds: X.result.savedParentEventIds,
      checkedParentEventIds: X.result.checkedParentEventIds,
      quoteRepairApplied: X.result.quoteRepairApplied,
      status: X.result.status
    });
    if (W.shouldRefreshQuotePreviews && X.isActive() && ge(X.quoteRefreshPosts), !(W.parentEventIds.length === 0 || !X.isActive())) {
      if (X.awaitBadgeRefresh) {
        await Z(W.parentEventIds);
        return;
      }
      N(W.parentEventIds);
    }
  }
  function se(X) {
    return u.repairVisibleRangeRelations(X.rxNostr, {
      ownerPubkeyHex: X.ownerPubkeyHex,
      visiblePosts: X.visiblePosts,
      relationKinds: Ad,
      quoteVisibleRangeRepairExecutor: c,
      relayConfig: r(),
      isActive: X.isActive
    });
  }
  function Re(X, W, te, xe) {
    W.length !== 0 && b({
      source: X,
      parentEventIds: W,
      rxNostr: te,
      relayConfig: r(),
      isActive: xe
    }).then((Ne) => {
      Ne.status === "cancelled" || Ne.deletedReactionEventIds.length === 0 && Ne.deletedReplyEventIds.length === 0 || !xe() || N(Ne.checkedParentEventIds);
    }).catch(() => {
    });
  }
  async function Ee(X) {
    if (X.visiblePosts.length === 0)
      return {
        status: "success",
        savedDirectReplyCount: 0
      };
    const W = ++x, te = () => O(W, X.isActive);
    Re(
      "listing-current-view",
      X.visiblePosts.map((ne) => ne.eventId),
      X.rxNostr,
      te
    );
    const xe = se({
      ...X,
      isActive: te
    }), Ne = p();
    y = xe;
    try {
      const ne = await xe.promise, E = Math.max(0, p() - Ne), L = te();
      if (y === xe && (y = null), ne.status === "cancelled" || !L)
        return yc(ne, !1);
      const B = p();
      try {
        await _({
          source: "listing-manual-refetch",
          result: ne,
          quoteRefreshPosts: X.visiblePosts,
          isActive: te,
          awaitBadgeRefresh: !0
        });
      } catch (oe) {
        return {
          status: te() ? "partial" : "cancelled",
          savedDirectReplyCount: ne.savedDirectReplyCount,
          relationRepairDurationMs: E,
          failurePhase: "badge-refresh",
          failureDurationMs: Math.max(0, p() - B),
          failureErrorClass: oe instanceof Error ? oe.name : typeof oe
        };
      }
      return {
        ...yc(ne, te()),
        relationRepairDurationMs: E,
        badgeRefreshDurationMs: Math.max(0, p() - B)
      };
    } catch (ne) {
      return y === xe && (y = null), {
        status: te() ? "partial" : "cancelled",
        savedDirectReplyCount: 0,
        failurePhase: "relation-repair",
        failureDurationMs: Math.max(0, p() - Ne),
        failureErrorClass: ne instanceof Error ? ne.name : typeof ne
      };
    }
  }
  async function fe(X) {
    if (X.visiblePosts.length !== 0)
      try {
        Re(
          "listing-current-view",
          X.visiblePosts.map((xe) => xe.eventId),
          X.rxNostr,
          X.isActive
        );
        const te = await se(X).promise;
        if (te.status === "cancelled" || !X.isActive())
          return;
        await _({
          source: "listing-current-view",
          result: te,
          quoteRefreshPosts: X.visiblePosts,
          isActive: X.isActive,
          awaitBadgeRefresh: !0
        });
      } catch {
      }
  }
  function de(X) {
    const W = e(), te = n(), xe = f;
    if (!W || X.length === 0)
      return;
    const Ne = rm(
      W,
      X,
      o()
    );
    if (Ne.length === 0)
      return;
    const ne = Ne.map((V) => V.eventId);
    if (!te)
      return;
    const E = () => J(
      xe,
      W,
      te
    );
    Re(
      "listing-older-reveal",
      ne,
      te,
      E
    );
    const L = am(
      ne,
      m,
      i,
      p()
    ), B = new Set(L), oe = Ne.filter(
      (V) => B.has(V.eventId)
    );
    if (oe.length === 0)
      return;
    oe.forEach((V) => {
      i.add(V.eventId);
    });
    const pe = se({
      ownerPubkeyHex: W,
      rxNostr: te,
      visiblePosts: oe,
      isActive: E
    });
    w.add(pe), pe.promise.then((V) => {
      !E() || V.status === "cancelled" || (_({
        source: "listing-older-reveal",
        result: V,
        quoteRefreshPosts: oe,
        isActive: E,
        awaitBadgeRefresh: !1
      }), V.checkedParentEventIds.length > 0 && V.checkedParentEventIds.forEach((Ae) => {
        m.set(Ae, p());
      }));
    }).catch(() => {
    }).finally(() => {
      xe === f && (w.delete(pe), oe.forEach((V) => {
        i.delete(V.eventId);
      }));
    });
  }
  function re() {
    x += 1, y?.cancel(), y = null;
  }
  function _e() {
    f += 1, w.forEach((X) => X.cancel()), w.clear(), m.clear(), i.clear();
  }
  function ie() {
    re(), _e();
  }
  function Ce() {
    S = !0, ie();
  }
  return {
    repairCurrentView: Ee,
    repairJump: fe,
    scheduleOlderRevealRepair: de,
    cancelCurrentViewRepair: re,
    resetOlderRevealRepairContext: _e,
    resetAllRepairs: ie,
    dispose: Ce
  };
}
const om = "postHistoryJumpCacheAnchors:", nl = 200, rl = 720 * 60 * 60 * 1e3;
function Xo(t) {
  return `${om}${t}`;
}
function im(t) {
  if (!t || typeof t != "object")
    return !1;
  const e = t;
  return Number.isFinite(e.centerCreatedAt) && Number.isFinite(e.radiusSec) && (e.radiusSec ?? 0) > 0 && Number.isFinite(e.fetchedAt);
}
function lm(t) {
  if (!t || typeof t != "object")
    return !1;
  const e = t;
  return typeof e.pubkeyHex == "string" && Array.isArray(e.anchors) && e.anchors.every((n) => im(n));
}
function mc(t, e, n, r) {
  const o = e - Math.max(0, Math.trunc(n));
  return t.filter(
    (s) => Number.isFinite(s.centerCreatedAt) && Number.isFinite(s.radiusSec) && s.radiusSec > 0 && Number.isFinite(s.fetchedAt) && s.fetchedAt >= o
  ).sort((s, l) => l.fetchedAt - s.fetchedAt).slice(0, Math.max(1, Math.trunc(r)));
}
function dm(t, e, n) {
  return t.findIndex(
    (r) => Math.abs(r.centerCreatedAt - e) <= Math.max(r.radiusSec, n)
  );
}
class cm {
  constructor(e = Ml, n = Date.now) {
    this.db = e, this.now = n;
  }
  async getForPubkey(e, n = {}) {
    const r = n.ttlMs ?? rl, o = n.maxCount ?? nl, s = await this.db.meta.get(Xo(e));
    return !s || !lm(s.value) ? [] : mc(s.value.anchors, this.now(), r, o);
  }
  async addForPubkey(e) {
    const n = e.ttlMs ?? rl, r = e.maxCount ?? nl, o = Number.isFinite(e.fetchedAt) ? Math.trunc(e.fetchedAt ?? 0) : this.now(), s = Number.isFinite(e.centerCreatedAt) ? Math.trunc(e.centerCreatedAt) : 0, l = Number.isFinite(e.radiusSec) ? Math.max(1, Math.trunc(e.radiusSec ?? 1)) : 1, c = await this.getForPubkey(e.pubkeyHex, {
      ttlMs: n,
      maxCount: r
    }), u = dm(
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
    const p = mc(
      b,
      this.now(),
      n,
      r
    );
    return await this.db.meta.put({
      key: Xo(e.pubkeyHex),
      value: {
        pubkeyHex: e.pubkeyHex,
        anchors: p
      },
      updatedAt: this.now()
    }), p;
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
    const n = Number.isFinite(e.frontierVisibleUntil) ? Math.trunc(e.frontierVisibleUntil) : 0, r = Number.isFinite(e.toleranceSec) ? Math.max(0, Math.trunc(e.toleranceSec ?? 0)) : 0, o = e.ttlMs ?? rl, s = e.maxCount ?? nl, l = await this.getForPubkey(e.pubkeyHex, {
      ttlMs: o,
      maxCount: s
    }), c = l.filter((p) => {
      const y = p.centerCreatedAt + p.radiusSec;
      return Math.max(0, n - y) <= r;
    }), u = l.filter((p) => !c.includes(p)), b = c.length > 0 ? Math.min(
      n,
      ...c.map((p) => Math.max(0, p.centerCreatedAt - p.radiusSec))
    ) : n;
    return c.length > 0 && await this.db.meta.put({
      key: Xo(e.pubkeyHex),
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
    e && await this.db.meta.delete(Xo(e));
  }
}
const Ao = new cm(), Ch = "postHistoryVisibleRange:";
function al(t, e) {
  return `${Ch}${t}:${e}`;
}
function um(t) {
  if (!t || typeof t != "object")
    return !1;
  const e = t;
  return typeof e.pubkeyHex == "string" && typeof e.kindsKey == "string" && (typeof e.visibleUntil == "number" || e.visibleUntil === null);
}
function hm(t) {
  const e = /* @__PURE__ */ new Set();
  for (const n of t)
    Number.isFinite(n) && e.add(Math.trunc(n));
  return [...e].sort((n, r) => n - r).join(",");
}
class fm {
  constructor(e = Ml, n = Date.now) {
    this.db = e, this.now = n;
  }
  async get(e, n) {
    const r = await this.db.meta.get(al(e, n));
    return !r || !um(r.value) ? null : {
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
      key: al(e.pubkeyHex, e.kindsKey),
      value: {
        pubkeyHex: e.pubkeyHex,
        kindsKey: e.kindsKey,
        visibleUntil: e.visibleUntil
      },
      updatedAt: n
    }), r;
  }
  async clear(e, n) {
    await this.db.meta.delete(al(e, n));
  }
  async clearForPubkey(e) {
    if (!e) return;
    const n = `${Ch}${e}:`, r = await this.db.meta.filter((o) => o.key.startsWith(n)).primaryKeys();
    await this.db.meta.bulkDelete(r);
  }
}
const eo = new fm();
function pm(t) {
  const e = t.error, n = t.errorClass ?? (e instanceof Error ? e.name : e === void 0 ? void 0 : typeof e);
  return {
    phase: t.phase,
    durationMs: t.durationMs ?? Math.max(0, (t.finishedAt ?? Date.now()) - t.startedAt),
    ...n ? { errorClass: n } : {},
    ...t.counts ?? {}
  };
}
function la(t) {
  const e = pm(t);
  "errorClass" in e ? console.warn("post_history_manual_repair_phase", e) : console.debug("post_history_manual_repair_phase", e);
}
function vm(t) {
  return t.map((e) => e.event?.id).filter((e) => !!e);
}
function gm({
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
    const p = Math.max(0, r - t.length), y = e.slice(0, p);
    return {
      posts: [...t, ...y],
      didTrimForOlderAppend: !1,
      didDeferOlderPosts: y.length < e.length
    };
  }
  const l = typeof n == "string" ? s.findIndex((p) => p.eventId === n) : -1, c = (p) => {
    const y = s.slice(p, p + r), x = Math.max(0, y.length - Math.max(0, t.length - p));
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
function ym(t, e) {
  const n = new Set(t.map((r) => r.eventId));
  return e.filter((r) => !n.has(r.eventId));
}
const vi = {
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
}, ko = hm([...iu]), bc = 1440 * 60, Cc = 4320 * 60, mm = 100, bm = 720 * 60;
function sl(t, e) {
  if (t.length === 0)
    return !0;
  const n = t[t.length - 1]?.createdAt;
  return Number.isFinite(n) ? (n ?? 0) > e : !0;
}
const wc = 720 * 60, Cm = 3600, ol = [
  720 * 60,
  1440 * 60,
  4320 * 60,
  10080 * 60,
  336 * 60 * 60,
  720 * 60 * 60
], wm = 6, Pm = 720 * 60 * 60;
function xm({
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
  maxExploreSeconds: p
}) {
  return t !== "success" ? { shouldContinue: !1, reason: `status-${t}` } : n ? r && !o ? {
    shouldContinue: !1,
    reason: "hit-limit-continuation-unavailable"
  } : c >= u ? {
    shouldContinue: !1,
    reason: "target-visible-added-reached"
  } : b >= p ? { shouldContinue: !1, reason: "max-explore-seconds-reached" } : s >= l ? { shouldContinue: !1, reason: "max-attempts-reached" } : {
    shouldContinue: !0,
    reason: e ? "small-batch-continue" : "empty-window-continue"
  } : { shouldContinue: !1, reason: "cursor-not-advanced" };
}
const kd = /* @__PURE__ */ new Map();
async function Rm({
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
function Jr(t) {
  if (typeof t != "string")
    return null;
  const e = t.trim();
  return e.length > 0 ? e : null;
}
function xl(t) {
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
function Sm(t) {
  const e = Jr(t);
  return xl(e ? kd.get(e) ?? vi : vi);
}
function il(t, e) {
  const n = Jr(t);
  n && kd.set(n, xl(e));
}
function Im(t) {
  const e = Jr(t);
  e && kd.delete(e);
}
function _m({
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
  pageSize: p = ou,
  searchDebounceMs: y = 250
}) {
  const x = Cy(e()), f = Sm(e()), S = f.searchQuery === x.searchQuery && x.searchQuery.length > 0, w = f.totalCountKnown ?? f.totalCount > 0, m = f.totalCountFailed ? "failed" : w ? "ready" : "unknown", i = lr({
    loadedPosts: f.loadedPosts,
    searchPosts: S ? f.searchPosts : [],
    searchInput: x.searchInput,
    searchQuery: x.searchQuery,
    currentPage: 1,
    searchPage: S ? x.searchPage : 1,
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
  let O = 0, J = !1, N = be(!1), Z = be(null), ge = null, _ = 0, se = null, Re = 0, Ee = be(!1), fe = be("idle"), de = !1, re = !1, _e = null, ie = be("idle"), Ce = 0, X = Jr(e()), W = be(lr(X)), te = null, xe = null, Ne = 0, ne = null, E = null, L = null, B = null, oe = n(), pe = S ? x.searchQuery : "", V = !S;
  const Ae = lr({
    windowSeconds: wc,
    nextUntil: null,
    consecutiveEmptyCount: 0,
    lastRange: null,
    continuationSince: null,
    exhausted: !1
  }), ot = Math.max(p * 3, p), ht = sm({
    getShow: t,
    getPubkeyHex: e,
    getRxNostr: n,
    getRelayConfig: r,
    getLoadedPosts: () => i.loadedPosts,
    onChildInteractionBadgeRefreshRequested: c,
    onQuoteVisibleRangeRefreshRequested: u,
    quoteVisibleRangeRepairExecutor: b
  }), he = R(() => i.searchQuery.length > 0), Le = R(() => i.currentViewRefetchStatus === "refetching"), We = R(() => a(he) ? i.searchPosts : i.loadedPosts), ae = R(() => a(he) ? i.searchPage : 1), Ge = R(() => a(he) ? i.searchTotalCount : i.totalCount), Pt = R(() => a(he) ? Math.max(1, Math.ceil(i.searchTotalCount / p)) : 1), vt = R(() => !a(Le) && a(he) && i.searchPage > 1), _t = R(() => a(vt)), gt = R(() => !a(Le) && !a(Ee) && a(he) && i.searchHasNext), Ut = R(() => a(gt)), xt = R(() => !1), nt = R(() => !a(Le) && (a(he) ? !a(Ee) && i.searchHasNext : i.hasOlderLocal)), dt = R(() => !a(Le) && !a(he) && i.hasNewerLocal), Rt = R(() => !a(he) && !a(Le) && (i.listingMode === "sparse" || i.hasNewerLocal)), $n = R(() => a(We)[0]?.createdAt ?? null), qe = R(() => a(We).length > 0 ? a(We)[a(We).length - 1]?.createdAt ?? null : null), qn = R(() => !a(he) && !a(Le) && i.hasOlderLocal && (i.listingMode === "sparse" || !(typeof a(qe) == "number" && (i.visibleUntil === null ? i.hasJumpCacheAnchors : a(qe) < i.visibleUntil)))), wn = R(() => !a(he) && !!e() && !!n() && !a(Le) && !Ae.exhausted && i.syncStatus !== "syncing" && i.syncStatus !== "older-syncing"), Pn = R(() => !a(he) && i.syncStatus === "older-syncing"), _r = R(() => !a(he) && (i.syncStatus === "syncing" || i.syncStatus === "older-syncing")), dr = R(() => !a(he) && i.listingMode === "contiguous" && i.loadedPosts.length > 0 && !i.hasOlderLocal && i.syncStatus !== "syncing"), Tt = R(() => !a(he) && i.listingMode === "contiguous" && typeof i.visibleUntil == "number" && i.loadedPosts.length > 0 && !i.hasOlderLocal && i.hasSavedPostsOutsideVisibleRange), Ht = R(() => a(We).length), tn = R(() => !!e() && !!n() && !a(he) && i.loadedPosts.length > 0 && !a(Le) && i.syncStatus !== "syncing" && i.syncStatus !== "older-syncing"), xn = R(() => a(he) || i.syncStatus === "idle" ? null : i.syncStatus === "syncing" || i.syncStatus === "older-syncing" ? "postHistory.syncing" : i.syncStatus === "synced" ? "postHistory.synced" : i.syncStatus === "no-more" ? null : "postHistory.syncFailed"), on = R(() => !a(he) && (i.syncStatus === "syncing" || i.syncStatus === "older-syncing")), Rn = R(() => a(on) || a(Le)), fn = R(() => i.currentViewRefetchStatus === "refetching" ? "postHistory.repairing" : i.currentViewRefetchMessageKey), Er = R(() => i.currentViewRefetchStatus === "refetching" ? null : i.currentViewRefetchMessageValues);
  function pn() {
    Ne += 1, xe?.cancel(), xe = null;
  }
  function rt() {
    E = null;
  }
  function Mn(v, P) {
    return !!v && !!P && v.postedAt === P.postedAt && v.createdAt === P.createdAt && v.eventId === P.eventId;
  }
  function St(v) {
    return v === Ne;
  }
  function On(v, P) {
    return t() && e() === v && P === O;
  }
  function qt() {
    J = !1, g(N, !1), g(Z, null), ge = null;
  }
  async function Ue(v, P, k) {
    return await da(), P() ? J ? (g(Z, Jr(v), !0), !0) : k() ? (await new Promise((q) => {
      requestAnimationFrame(() => requestAnimationFrame(() => q()));
    }), P() ? (J = !0, g(Z, Jr(v), !0), g(N, !0), !0) : !1) : (J = !0, g(Z, Jr(v), !0), g(N, !0), !0) : !1;
  }
  function ln() {
    ne?.cancel(), ne = null, ht.cancelCurrentViewRepair(), i.currentViewRefetchStatus === "refetching" && (i.currentViewRefetchStatus = "idle"), cr();
  }
  function cr() {
    L !== null && (clearTimeout(L), L = null);
  }
  function ur() {
    B !== null && (clearTimeout(B), B = null);
  }
  function Nn() {
    Ae.windowSeconds = wc, Ae.nextUntil = null, Ae.consecutiveEmptyCount = 0, Ae.lastRange = null, Ae.continuationSince = null, Ae.exhausted = !1;
  }
  function Ar() {
    i.currentViewRefetchMessageKey = null, i.currentViewRefetchMessageValues = null, cr();
  }
  function Zr() {
    cr();
    const v = /* @__PURE__ */ new Set([
      "postHistory.repairNoChanges",
      "postHistory.repairAdded",
      "postHistory.repairChildInteractionsAdded",
      "postHistory.repairFetchFailed"
    ]);
    v.has(i.currentViewRefetchMessageKey ?? "") && (L = setTimeout(
      () => {
        i.currentViewRefetchMessageKey !== null && v.has(i.currentViewRefetchMessageKey) && (i.currentViewRefetchMessageKey = null, i.currentViewRefetchMessageValues = null), L = null;
      },
      3500
    ));
  }
  function Sn() {
    ur(), !(i.syncStatus !== "synced" && i.syncStatus !== "failed") && (B = setTimeout(
      () => {
        (i.syncStatus === "synced" || i.syncStatus === "failed") && (i.syncStatus = "idle"), B = null;
      },
      3500
    ));
  }
  function vn() {
    Re += 1, g(Ee, !1), g(fe, "idle"), Io.clearCache?.(), qt(), i.searchInput = "", i.searchQuery = "", i.searchPage = 1, i.searchPosts = [], i.searchTotalCount = 0, i.searchHasNext = !1, pe = "", gr(), ua();
  }
  function hr() {
    rt(), C(), i.loadedPosts = [], d({ known: !1, status: "unknown" }), i.currentPage = 1, i.syncStatus = "idle", i.hasMoreRemote = !1, i.nextUntil = null, i.lastDialogOpenRefreshAt = null, i.visibleUntil = null, i.hasJumpCacheAnchors = !1, i.hasOlderLocal = !1, i.hasNewerLocal = !1, i.listingMode = "contiguous", i.sparseSource = null, i.hasSavedPostsOutsideVisibleRange = !1, i.latestOlderBackfillUiResult = null, vn();
  }
  function kr() {
    const v = Jr(e());
    return !!v && v === a(W);
  }
  function gr() {
    kr() && dc(e(), {
      searchInput: i.searchInput,
      searchQuery: i.searchQuery,
      currentPage: i.currentPage,
      searchPage: i.searchPage
    });
  }
  function ua() {
    kr() && il(e(), {
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
  function Vn(v) {
    g(W, Jr(v), !0);
  }
  function ha() {
    rt(), C(), ht.resetOlderRevealRepairContext(), i.loadedPosts = [], i.searchPosts = [], d({ count: 0, known: !0, status: "ready" }), i.searchTotalCount = 0, i.searchHasNext = !1, i.currentPage = 1, i.searchPage = 1, i.hasMoreRemote = !1, i.nextUntil = null, i.lastDialogOpenRefreshAt = null, i.visibleUntil = null, i.hasJumpCacheAnchors = !1, i.hasOlderLocal = !1, i.hasNewerLocal = !1, i.listingMode = "contiguous", i.sparseSource = null, i.hasSavedPostsOutsideVisibleRange = !1, i.syncStatus = "idle", Nn(), Ar(), ur(), vn(), de = !0;
  }
  function wa() {
    return i.listingMode === "sparse" && (i.sparseSource === "saved" || i.sparseSource === "jump");
  }
  function Dr() {
    if (!wa())
      return !1;
    const v = e();
    return hr(), Nn(), Ar(), ur(), cc(v), il(v, { ...vi }), !0;
  }
  function yr() {
    rt(), O += 1, Re += 1, g(Ee, !1), g(fe, "idle");
  }
  function Na() {
    const v = Dr();
    return pn(), ln(), yr(), C(), Io.clearCache?.(), ht.resetOlderRevealRepairContext(), v;
  }
  function fa() {
    Dr(), pn(), ln(), yr(), C(), Io.clearCache?.(), ht.resetOlderRevealRepairContext(), i.syncStatus = "idle", Nn(), Ar(), ur(), de = !1, re = !1, _e = null, Ce += 1, g(ie, "idle"), V = !1;
  }
  function pa(v) {
    const P = Hi(v);
    i.hasMoreRemote = P, i.nextUntil = P ? v.nextUntil : null;
  }
  function Pa(v) {
    Hi(v) && i.nextUntil === null && (i.hasMoreRemote = !0, i.nextUntil = v.nextUntil);
  }
  async function va(v) {
    return typeof a(qe) == "number" && (i.visibleUntil === null ? i.hasJumpCacheAnchors : a(qe) < i.visibleUntil) ? a(qe) : typeof Ae.nextUntil == "number" ? Ae.nextUntil : Rm({
      nextUntil: i.nextUntil,
      visibleOldestCreatedAt: a(qe),
      pubkeyHex: v,
      getOldestCreatedAt: (P) => it.getOldestCreatedAt(P)
    });
  }
  function xa(v) {
    if (!Number.isFinite(v))
      return null;
    const P = Math.trunc(v) - 1;
    return P < 0 ? null : {
      since: (typeof Ae.continuationSince == "number" && Ae.continuationSince <= P ? Ae.continuationSince : null) ?? Math.max(0, P - Ae.windowSeconds),
      until: P,
      windowSeconds: Ae.windowSeconds
    };
  }
  function Ra(v, P) {
    const k = [];
    return v.hasMore && k.push("hasMore"), v.rawCount >= P && k.push("rawCount"), v.perRelayCounts.some((q) => q.rawCount >= P) && k.push("perRelayRawCount"), k;
  }
  function Xr(v) {
    return typeof v.oldestCreatedAt == "number" ? v.oldestCreatedAt : v.events.reduce(
      (P, k) => {
        const q = k.event.created_at;
        return Number.isFinite(q) && (P === null || q < P) ? Math.trunc(q) : P;
      },
      null
    );
  }
  function Ba(v, P) {
    Ae.nextUntil = v, Ae.continuationSince = P, Ae.exhausted = v === null, i.nextUntil = v, i.hasMoreRemote = v !== null;
  }
  function Ua(v, P, k) {
    Ra(P, k), Xr(P), P.rawCount ?? P.events.length, P.uniqueCount ?? P.events.length, typeof Ae.nextUntil == "number" && xa(Ae.nextUntil);
  }
  function Sa() {
    if (i.searchQuery)
      return [];
    const v = i.loadedPosts.map((q) => q.createdAt).filter((q) => Number.isFinite(q)).map((q) => Math.trunc(q));
    if (v.length === 0)
      return [];
    const P = Math.min(...v), k = Math.max(...v);
    return [
      {
        kinds: [...iu],
        rangeUnit: "custom",
        since: Math.max(0, P - bc),
        until: k + bc,
        limit: su
      }
    ];
  }
  async function Ia(v) {
    return (await eo.get(v, ko))?.visibleUntil ?? null;
  }
  async function gn(v, P = null) {
    const k = await Ia(v);
    return t() && e() === v && (P === null || P === O) && (i.visibleUntil = k), k;
  }
  async function qa(v, P = null) {
    const q = (await Ao.getForPubkey(v, { maxCount: 1 })).length > 0;
    return t() && e() === v && (P === null || P === O) && (i.hasJumpCacheAnchors = q), q;
  }
  async function Lr(v, P) {
    const k = await Ia(v), q = P.events.length === 0 ? null : Hi(P) ? P.nextUntil : typeof P.oldestCreatedAt == "number" ? P.oldestCreatedAt : null, Q = typeof q == "number" ? typeof k == "number" ? Math.min(k, q) : q : k;
    return Q !== k && await eo.save({
      pubkeyHex: v,
      kindsKey: ko,
      visibleUntil: Q
    }), i.visibleUntil = Q, Q;
  }
  async function Es(v, P) {
    const k = await Ia(v), q = Xr(P), Q = typeof q == "number" ? typeof k == "number" ? Math.min(k, q) : q : k;
    return Q !== k && await eo.save({
      pubkeyHex: v,
      kindsKey: ko,
      visibleUntil: Q
    }), i.visibleUntil = Q, Q;
  }
  async function Va(v, P, k) {
    if (typeof P != "number")
      return P;
    const q = k.filter((ue) => ue.source === "preferred" && ue.status === "complete" && typeof ue.since == "number" && typeof ue.until == "number" && ue.until >= P - 1).map((ue) => ue.since);
    if (q.length === 0)
      return P;
    const Q = Math.min(P, ...q);
    return Q === P ? P : (await eo.save({
      pubkeyHex: v,
      kindsKey: ko,
      visibleUntil: Q
    }), i.visibleUntil = Q, Q);
  }
  async function is(v, P) {
    return typeof P == "number" ? it.countVisibleForPubkey(v, P) : it.countForPubkey(v);
  }
  async function ea(v, P) {
    if (typeof P == "number")
      return it.countVisibleForPubkey(v, P);
    const k = se;
    return k?.pubkeyHex === v && (await k.promise, i.totalCountKnown) || i.totalCountKnown ? i.totalCount : it.countForPubkey(v);
  }
  function _a(v, P) {
    if (a(he) || i.listingMode !== "contiguous" || i.sparseSource !== null || e() !== v || i.visibleUntil !== P.visibleUntil)
      return !1;
    const k = z(i.loadedPosts[i.loadedPosts.length - 1]);
    return Mn(k, P.oldestCursor);
  }
  async function ga(v, P) {
    const k = E;
    if (!k || k.pubkeyHex !== v)
      return null;
    const q = await gn(v, P);
    if (!t() || e() !== v || P !== O || !_a(v, k))
      return null;
    const [Q, ue] = await Promise.all([
      Promise.resolve(to(v)),
      ea(v, q)
    ]);
    return !_a(v, k) || Q !== k.revision || ue !== k.totalVisibleCount ? null : k;
  }
  async function ls(v, P, k, q, Q) {
    if (rt(), k.length === 0 || !t() || e() !== v || P !== O || i.listingMode !== "contiguous" || i.sparseSource !== null)
      return !1;
    const ue = await ea(v, q), ve = await Ia(v), je = to(v);
    if (je !== Q || ve !== q || !t() || e() !== v || P !== O || i.listingMode !== "contiguous" || i.sparseSource !== null || i.loadedPosts[0]?.eventId !== k[0]?.eventId || i.loadedPosts[i.loadedPosts.length - 1]?.eventId !== k[k.length - 1]?.eventId)
      return !1;
    const Be = z(k[k.length - 1]);
    return Be ? (E = {
      pubkeyHex: v,
      visibleUntil: q,
      revision: je,
      totalVisibleCount: ue,
      reachedVisibleCount: k.length,
      oldestCursor: Be,
      latestEventId: k[0]?.eventId ?? null
    }, !0) : !1;
  }
  async function ds(v, P, k) {
    const q = E;
    if (!q || q.pubkeyHex !== v || a(he) || i.listingMode !== "contiguous" || i.sparseSource !== null || e() !== v)
      return !1;
    const Q = z(i.loadedPosts[i.loadedPosts.length - 1]);
    if (!Mn(Q, q.oldestCursor))
      return !1;
    const ue = await ea(v, P);
    return !t() || e() !== v || !Mn(Q, z(i.loadedPosts[i.loadedPosts.length - 1])) ? !1 : (E = {
      ...q,
      visibleUntil: P,
      revision: to(v),
      totalVisibleCount: ue
    }, !0);
  }
  async function mr() {
    rt(), await Se();
  }
  function ta(v, P = i.loadedPosts) {
    if (i.listingMode === "sparse" || i.hasJumpCacheAnchors)
      return !0;
    const k = P.length > 0 ? P[P.length - 1]?.createdAt ?? null : null;
    return typeof k != "number" ? !1 : v === null ? i.hasJumpCacheAnchors : k < v;
  }
  function d({ count: v, known: P, status: k }) {
    typeof v == "number" && (i.totalCount = v), i.totalCountKnown = P, i.totalCountStatus = k;
  }
  function C() {
    _ += 1, se = null, d({
      known: i.totalCountKnown,
      status: i.totalCountKnown ? "ready" : "unknown"
    });
  }
  function H(v, { force: P = !1 } = {}) {
    if (!t() || e() !== v || !P && se?.pubkeyHex === v)
      return;
    const k = ++_;
    d({
      known: i.totalCountKnown,
      status: i.totalCountKnown ? "refreshing" : "loading"
    });
    const q = it.countForPubkey(v).then((Q) => {
      k !== _ || !t() || e() !== v || d({ count: Q, known: !0, status: "ready" });
    }).catch(() => {
      k !== _ || !t() || e() !== v || d({ known: i.totalCountKnown, status: "failed" });
    }).finally(() => {
      se?.requestId === k && (se = null);
    });
    se = { requestId: k, pubkeyHex: v, promise: q };
  }
  function $({ force: v = !1 } = {}) {
    const P = e();
    !P || !t() || H(P, { force: v });
  }
  async function K(v, P, k = null, q = null) {
    const Q = typeof P == "number" ? await it.hasPostsBeforeCreatedAt(v, P) : !1;
    !t() || e() !== v || k !== null && k !== O || q !== null && !St(q) || (i.hasSavedPostsOutsideVisibleRange = Q);
  }
  function z(v) {
    return v ? {
      eventId: v.eventId,
      postedAt: v.postedAt,
      createdAt: v.createdAt
    } : null;
  }
  function ce(v, P) {
    return v.length <= ot ? v : v.slice(0, ot);
  }
  function Fe(v, P, k) {
    return gm({
      currentPosts: v,
      olderPosts: P,
      anchorEventId: k,
      maxVisiblePosts: ot,
      keepAbove: p
    });
  }
  async function le(v, P = i.loadedPosts, k = null, q = {}) {
    if (P.length === 0) {
      t() && e() === v && (k === null || k === O) && (i.hasOlderLocal = !1, i.hasNewerLocal = !1);
      return;
    }
    const Q = z(P[0]), ue = z(P[P.length - 1]), ve = i.visibleUntil, je = i.sparseSource === "saved" && typeof ve == "number" ? Q ? it.getSparseChunk({
      pubkeyHex: v,
      visibleUntil: ve,
      cursor: Q,
      direction: "newer",
      limit: 1
    }) : Promise.resolve([]) : Q ? it.getNewerVisibleChunk({ pubkeyHex: v, visibleUntil: ve, cursor: Q, limit: 1 }) : Promise.resolve([]), Be = q.skipOlderCheck ? Promise.resolve([]) : i.sparseSource === "saved" && typeof ve == "number" ? ue ? it.getSparseChunk({
      pubkeyHex: v,
      visibleUntil: ve,
      cursor: ue,
      direction: "older",
      limit: 1
    }) : Promise.resolve([]) : i.sparseSource === "jump" ? ue ? it.getOlderVisibleChunk({
      pubkeyHex: v,
      visibleUntil: null,
      cursor: ue,
      limit: 1
    }) : Promise.resolve([]) : ue ? it.getOlderVisibleChunk({ pubkeyHex: v, visibleUntil: ve, cursor: ue, limit: 1 }) : Promise.resolve([]), [Je, Te] = await Promise.all([je, Be]);
    !t() || e() !== v || k !== null && k !== O || (i.hasNewerLocal = Je.length > 0, q.skipOlderCheck || (i.hasOlderLocal = Te.length > 0));
  }
  async function Se({
    forceTotalCount: v = !1,
    skipTotalCountRefresh: P = !1,
    skipOlderAvailabilityCheck: k = !1,
    awaitProgress: q = !1
  } = {}) {
    rt();
    const Q = e();
    if (!Q) {
      g(W, null), hr();
      return;
    }
    const ue = ++O, ve = await gn(Q, ue), je = to(Q), Be = await it.getLatestVisibleChunk({ pubkeyHex: Q, limit: p, visibleUntil: ve });
    if (!t() || e() !== Q || ue !== O || (Vn(Q), i.listingMode = "contiguous", i.sparseSource = null, i.loadedPosts = Be, !await Ue(Q, () => On(Q, ue), () => i.loadedPosts.length > 0)))
      return;
    P || $({ force: v }), qa(Q, ue).catch(() => {
    });
    const Je = ls(Q, ue, Be, ve, je);
    let Te = !1;
    q ? Te = await Je.catch(() => (rt(), !1)) : Je.catch(() => {
      rt();
    });
    const At = k && Te;
    k && !At ? i.hasOlderLocal = !1 : At && E && (i.hasOlderLocal = E.totalVisibleCount > E.reachedVisibleCount), K(Q, ve, ue).catch(() => {
    }), le(Q, Be, ue, { skipOlderCheck: At }).then(() => {
      !t() || e() !== Q || ue !== O || ra(Q, Be);
    }).catch(() => {
    });
  }
  async function ke({ skipTotalCountRefresh: v = !1 } = {}) {
    rt();
    const P = e();
    if (!P || i.loadedPosts.length === 0) {
      await Se({ skipTotalCountRefresh: v });
      return;
    }
    const k = i.loadedPosts[0], q = z(k);
    if (!q) {
      await Se({ skipTotalCountRefresh: v });
      return;
    }
    const Q = ++O, ue = await gn(P), je = ta(ue, i.loadedPosts) ? await it.getVisibleChunkFromCreatedAt({
      pubkeyHex: P,
      visibleUntil: ue,
      createdAt: k.createdAt,
      limit: i.loadedPosts.length,
      query: { contiguous: !1 }
    }) : await (i.loadedPosts.length > 1 ? it.getOlderVisibleChunk({
      pubkeyHex: P,
      visibleUntil: ue,
      cursor: q,
      limit: i.loadedPosts.length - 1
    }).then((Be) => [k, ...Be]) : Promise.resolve([k]));
    !t() || Q !== O || (i.loadedPosts = je, await Ue(P, () => On(P, Q), () => i.loadedPosts.length > 0) && (v || $(), await le(P, je, Q)));
  }
  function De(v, P) {
    return !!v && (!P || v.requestedAt > P.savedAt);
  }
  async function $e(v, P) {
    rt();
    const k = e(), q = i.loadedPosts, Q = z(q[0]), ue = z(q[q.length - 1]);
    if (!k || !t() || q.length === 0)
      return;
    const ve = ++O, je = await gn(k), [Be, Je] = await Promise.all([
      Q ? it.getNewerVisibleChunk({ pubkeyHex: k, visibleUntil: je, cursor: Q, limit: 1 }) : Promise.resolve([]),
      ue ? it.getOlderVisibleChunk({ pubkeyHex: k, visibleUntil: je, cursor: ue, limit: 1 }) : Promise.resolve([])
    ]);
    if (!(!t() || ve !== O)) {
      if (De(P, v)) {
        s(), await Se();
        return;
      }
      i.hasNewerLocal = Be.length > 0, i.hasOlderLocal = Je.length > 0, await Ue(k, () => On(k, ve), () => i.loadedPosts.length > 0) && ($(), await le(k, i.loadedPosts, ve), On(k, ve) && ra(k, i.loadedPosts));
    }
  }
  function at() {
    const v = o();
    return !v || v.mode !== "normal" || v.pubkeyHex !== e() ? null : v;
  }
  function ct(v) {
    return a(he) || i.loadedPosts.length === 0 || !v ? !1 : i.loadedPosts.some((P) => P.eventId === v.anchor.eventId);
  }
  async function Ct(v) {
    rt();
    const P = e();
    if (!P || !t())
      return !1;
    const k = ++O, q = await gn(P), Q = await it.getVisibleChunkAroundEventId({
      pubkeyHex: P,
      visibleUntil: q,
      eventId: v.anchor.eventId,
      limit: ot,
      keepAbove: p
    });
    return !t() || k !== O ? !1 : Q.length === 0 ? (s(), await Se(), !1) : (i.loadedPosts = Q, !await Ue(P, () => On(P, k), () => i.loadedPosts.length > 0) || ($(), await le(P, Q, k), !On(P, k)) ? !1 : (ra(P, Q), !0));
  }
  async function Ve(v = {}) {
    const P = i.loadedPosts, k = v.metrics;
    k && (k.loadedPostsBeforeLength = P.length, k.loadedPostsAfterLength = P.length, k.olderPostsLength = 0, k.visibleOldestBefore = P.length > 0 ? P[P.length - 1]?.createdAt ?? null : null, k.visibleOldestAfter = P.length > 0 ? P[P.length - 1]?.createdAt ?? null : null, k.didTrimForOlderAppend = !1, k.didDeferOlderPosts = !1, k.maxVisiblePosts = ot);
    const q = e(), Q = z(i.loadedPosts[i.loadedPosts.length - 1]);
    if (!q || !Q)
      return await Se(), k && (k.loadedPostsAfterLength = i.loadedPosts.length, k.olderPostsLength = i.loadedPosts.length, k.visibleOldestAfter = i.loadedPosts.length > 0 ? i.loadedPosts[i.loadedPosts.length - 1]?.createdAt ?? null : null), i.loadedPosts.length > 0;
    const ue = v.useContiguousProgress !== !1 && E !== null, ve = v.preserveContiguousProgressAfterDatabaseChange ? E : null, je = ++O, Be = ue ? await ga(q, je) : null;
    if (ue && !Be)
      return await mr(), k && (k.loadedPostsAfterLength = i.loadedPosts.length, k.visibleOldestAfter = i.loadedPosts.length > 0 ? i.loadedPosts[i.loadedPosts.length - 1]?.createdAt ?? null : null), !1;
    const Je = Be?.visibleUntil ?? await gn(q, je), Te = Be ? Math.max(0, Be.totalVisibleCount - Be.reachedVisibleCount) : p;
    if (Be && Te === 0)
      return i.hasOlderLocal = !1, k && (k.loadedPostsAfterLength = i.loadedPosts.length, k.visibleOldestAfter = i.loadedPosts.length > 0 ? i.loadedPosts[i.loadedPosts.length - 1]?.createdAt ?? null : null), await le(q, i.loadedPosts, je, { skipOlderCheck: !0 }), !1;
    const At = Math.min(p, Te), _n = await it.getOlderVisibleChunk({
      pubkeyHex: q,
      visibleUntil: Je,
      cursor: Q,
      limit: At
    });
    if (k && (k.olderPostsLength = _n.length), !t() || je !== O)
      return !1;
    const Ke = Be ? await ga(q, je) : null;
    if (Be && !Ke)
      return await mr(), !1;
    if (_n.length === 0)
      return Be ? await mr() : i.hasOlderLocal = !1, k && (k.loadedPostsAfterLength = i.loadedPosts.length, k.visibleOldestAfter = i.loadedPosts.length > 0 ? i.loadedPosts[i.loadedPosts.length - 1]?.createdAt ?? null : null), !1;
    const et = Fe(P, _n, v.anchorEventId), Jn = v.reason === "normal-older-reveal" ? ym(P, et.posts) : [];
    i.loadedPosts = et.posts, Jn.length > 0 && ht.scheduleOlderRevealRepair(Jn), et.didDeferOlderPosts && (i.hasOlderLocal = !0), et.didTrimForOlderAppend && (i.hasNewerLocal = !0);
    const ya = Jn.length;
    Ke ? E = {
      ...Ke,
      reachedVisibleCount: Math.min(Ke.totalVisibleCount, Ke.reachedVisibleCount + ya),
      oldestCursor: z(et.posts[et.posts.length - 1]) ?? Ke.oldestCursor
    } : !ue && ve && to(q) === ve.revision && (Mn(Q, ve.oldestCursor) ? E = {
      ...ve,
      reachedVisibleCount: Math.min(ve.totalVisibleCount, ve.reachedVisibleCount + ya),
      oldestCursor: z(et.posts[et.posts.length - 1]) ?? ve.oldestCursor
    } : rt());
    const za = ue && Ke !== null && E !== null, Fr = !!E && E.reachedVisibleCount >= E.totalVisibleCount;
    return za && E && (i.hasOlderLocal = E.totalVisibleCount > E.reachedVisibleCount), k && (k.loadedPostsAfterLength = et.posts.length, k.visibleOldestAfter = et.posts.length > 0 ? et.posts[et.posts.length - 1]?.createdAt ?? null : null, k.didTrimForOlderAppend = et.didTrimForOlderAppend, k.didDeferOlderPosts = et.didDeferOlderPosts), za ? (le(q, et.posts, je, { skipOlderCheck: !0 }).catch(() => {
    }), !0) : (await le(q, et.posts, je, {
      skipOlderCheck: ue && Fr
    }), !0);
  }
  async function tt(v, P, k = {}) {
    rt();
    const q = i.loadedPosts, Q = q.length > 0 ? q[q.length - 1]?.createdAt ?? null : null;
    if (typeof Q != "number")
      return !1;
    const ue = await it.getVisibleChunkFromCreatedAt({
      pubkeyHex: v,
      visibleUntil: i.visibleUntil,
      createdAt: Math.max(0, Q - 1),
      limit: p,
      query: { contiguous: !1 }
    });
    if (!t() || P !== O)
      return !1;
    if (ue.length === 0)
      return i.hasOlderLocal = !1, !1;
    const ve = Fe(q, ue, k.anchorEventId);
    return i.loadedPosts = ve.posts, await le(v, ve.posts, P), ve.didDeferOlderPosts && (i.hasOlderLocal = !0), !0;
  }
  async function mt(v, P, k = {}) {
    rt();
    const q = i.loadedPosts;
    if (typeof i.visibleUntil != "number")
      return !1;
    const Q = z(q[q.length - 1]);
    if (!Q)
      return !1;
    const ue = await it.getSparseChunk({
      pubkeyHex: v,
      visibleUntil: i.visibleUntil,
      cursor: Q,
      direction: "older",
      limit: p
    });
    if (!t() || P !== O)
      return !1;
    if (ue.length === 0)
      return i.hasOlderLocal = !1, !1;
    const ve = Fe(q, ue, k.anchorEventId);
    return i.loadedPosts = ve.posts, await le(v, ve.posts, P), ve.didDeferOlderPosts && (i.hasOlderLocal = !0), !0;
  }
  async function nn() {
    const v = e(), P = z(i.loadedPosts[0]);
    if (!v || !P)
      return !1;
    const k = ++O, q = E, Q = q ? await ga(v, k) : null;
    if (q && !Q)
      return await mr(), !1;
    const ue = Q?.visibleUntil ?? await gn(v, k), ve = await it.getNewerVisibleChunk({
      pubkeyHex: v,
      visibleUntil: ue,
      cursor: P,
      limit: p
    });
    if (!t() || k !== O)
      return !1;
    if (ve.length === 0)
      return i.hasNewerLocal = !1, !1;
    if (Q && !await ga(v, k))
      return await mr(), !1;
    const je = i.loadedPosts, Be = ce([...ve, ...je]);
    if (i.loadedPosts = Be, Q) {
      const Je = Math.max(0, je.length + ve.length - Be.length);
      E = {
        ...Q,
        reachedVisibleCount: Math.max(0, Q.reachedVisibleCount - Je),
        oldestCursor: z(Be[Be.length - 1]) ?? Q.oldestCursor
      };
    }
    return await le(v, Be, k), !(!t() || k !== O);
  }
  async function br(v) {
    rt();
    const P = e();
    if (!P)
      return !1;
    const k = ++O, q = await gn(P), Q = await it.getVisibleChunkFromCreatedAt({ pubkeyHex: P, visibleUntil: q, createdAt: v, limit: p });
    if (!t() || k !== O)
      return !1;
    if (Q.length === 0)
      return $(), i.loadedPosts = [], i.hasOlderLocal = !1, i.hasNewerLocal = !1, !1;
    if (!sl(Q, v))
      return $(), i.listingMode = "contiguous", i.sparseSource = null, i.loadedPosts = Q, Nn(), await le(P, Q, k), !0;
    if (v <= 0)
      return $(), i.listingMode = "contiguous", i.sparseSource = null, i.loadedPosts = Q, Nn(), await le(P, Q, k), !0;
    const ue = await Ao.hasNearbyAnchorForPubkey({ pubkeyHex: P, targetCreatedAt: v });
    if (!t() || k !== O)
      return !1;
    if (ue) {
      const Ke = await it.getVisibleChunkFromCreatedAt({
        pubkeyHex: P,
        visibleUntil: q,
        createdAt: v,
        limit: p,
        query: { contiguous: !1 }
      });
      if (!t() || k !== O)
        return !1;
      if (!sl(Ke, v))
        return $(), i.listingMode = "sparse", i.sparseSource = "jump", i.loadedPosts = Ke, Nn(), await le(P, Ke, k), !0;
    }
    const ve = n();
    if (!ve)
      return $(), i.listingMode = "contiguous", i.sparseSource = null, i.loadedPosts = Q, Nn(), await le(P, Q, k), !0;
    pn();
    const je = ++Ne;
    i.syncStatus = "syncing";
    const Be = Math.max(0, v - Cc), Je = v, Te = ai.fetchLatest(ve, {
      pubkeyHex: P,
      relayConfig: r(),
      reason: "repair-visible-range",
      limit: mm,
      since: Be,
      until: Je
    });
    xe = Te;
    const At = await Te.promise;
    if (!St(je) || xe !== Te)
      return !1;
    if (xe = null, !t() || At.status === "cancelled" || (At.events.length > 0 && (await it.upsertFetchedEvents({ events: At.events, fetchedAt: At.fetchedAt }), await Ao.addForPubkey({
      pubkeyHex: P,
      centerCreatedAt: v,
      radiusSec: Cc,
      fetchedAt: At.fetchedAt
    }), i.hasJumpCacheAnchors = !0), !t() || k !== O))
      return i.syncStatus = "idle", !1;
    const _n = await it.getVisibleChunkFromCreatedAt({
      pubkeyHex: P,
      visibleUntil: q,
      createdAt: v,
      limit: p,
      query: { contiguous: !1 }
    });
    return !t() || k !== O ? (i.syncStatus = "idle", !1) : (i.syncStatus = "idle", sl(_n, v) ? !1 : ($({ force: At.events.length > 0 }), i.listingMode = "sparse", i.sparseSource = "jump", i.loadedPosts = _n, Nn(), await le(P, _n, k), ht.repairJump({
      ownerPubkeyHex: P,
      rxNostr: ve,
      visiblePosts: _n,
      isActive: () => t() && e() === P && n() === ve && k === O
    }).catch(() => {
    }), !0));
  }
  async function Tr(v) {
    rt();
    const P = e();
    if (!P || !v)
      return !1;
    const k = ++O, q = await gn(P, k), Q = (Be) => it.getVisibleChunkAroundEventId({
      pubkeyHex: P,
      visibleUntil: Be,
      eventId: v,
      limit: ot,
      keepAbove: p
    });
    let ue = await Q(q);
    if (!t() || k !== O)
      return !1;
    const ve = ue.some((Be) => Be.eventId === v);
    let je = !1;
    return !ve && typeof q == "number" && (ue = await Q(null), je = !0, !t() || k !== O) || !ue.some((Be) => Be.eventId === v) ? !1 : ($(), i.listingMode = je ? "sparse" : "contiguous", i.sparseSource = je ? "jump" : null, i.loadedPosts = ue, i.hasOlderLocal = !1, i.hasNewerLocal = !1, Nn(), le(P, ue, k).catch(() => {
    }), !0);
  }
  function Ie(v, P) {
    const k = [...v], q = new Set(v.map((Q) => Q.eventId));
    for (const Q of P)
      q.has(Q.eventId) || (q.add(Q.eventId), k.push(Q));
    return k;
  }
  function Ye(v, P, k) {
    return t() && v === Re && e() === k && P === i.searchQuery;
  }
  async function zt(v, P, k) {
    const q = e();
    if (!q || !P)
      return null;
    const Q = await Io.searchLocalPosts({ pubkeyHex: q, query: P, page: v, pageSize: p });
    return Ye(k, P, q) ? Q : null;
  }
  async function In(v, P) {
    const k = e();
    if (!k || !P)
      return i.searchPosts = [], i.searchTotalCount = 0, i.searchHasNext = !1, !1;
    const q = ++Re, Q = Math.max(1, Math.trunc(v));
    g(Ee, !0), g(fe, "loading");
    try {
      const ue = await zt(Q, P, q);
      if (!ue)
        return !1;
      const ve = Hd(Q, ue.total, p);
      return ve !== Q ? (q === Re && Ye(q, P, k) && g(fe, "ready"), !1) : (i.searchTotalCount = ue.total, i.searchPosts = Q === 1 ? ue.items : Ie(i.searchPosts, ue.items), i.searchPage = ve, i.searchHasNext = ue.hasNext, g(fe, "ready"), !(!J && !await Ue(k, () => Ye(q, P, k), () => i.searchPosts.length > 0)));
    } catch {
      return q === Re && g(fe, "failed"), !1;
    } finally {
      q === Re && g(Ee, !1);
    }
  }
  async function Et(v, P, k = ++Re) {
    const q = e();
    if (!q || !P)
      return !1;
    const Q = Math.max(1, Math.trunc(v));
    g(Ee, !0), g(fe, "loading");
    try {
      const ue = await zt(1, P, k);
      if (!ue)
        return !1;
      const ve = Hd(Q, ue.total, p);
      let je = ue.items, Be = ue;
      for (let Je = 2; Je <= ve; Je += 1) {
        const Te = await zt(Je, P, k);
        if (!Te)
          return !1;
        je = Ie(je, Te.items), Be = Te;
      }
      return i.searchPosts = je, i.searchTotalCount = ue.total, i.searchPage = ve, i.searchHasNext = Be.hasNext, g(fe, "ready"), !(!J && !await Ue(q, () => Ye(k, P, q), () => i.searchPosts.length > 0));
    } catch {
      return k === Re && g(fe, "failed"), !1;
    } finally {
      k === Re && g(Ee, !1);
    }
  }
  async function na() {
    rt();
    const v = e(), P = n();
    if (!v || !P)
      return;
    pn();
    const k = ++Ne;
    i.syncStatus = "syncing";
    const q = await gn(v);
    if (!St(k) || !t() || e() !== v)
      return;
    const Q = ai.fetchLatest(P, {
      pubkeyHex: v,
      relayConfig: r(),
      reason: "bootstrap",
      limit: df,
      timeoutMs: lf
    });
    xe = Q;
    const ue = await Q.promise;
    let ve = {
      insertedCount: 0,
      updatedCount: 0
    };
    if (!St(k) || xe !== Q || (xe = null, !t() || ue.status === "cancelled"))
      return;
    if (ue.events.length > 0) {
      ve = await it.upsertFetchedEvents({ events: ue.events, fetchedAt: ue.fetchedAt });
      const Je = vm(ue.events);
      Je.length > 0 && await l(Je);
    }
    if (!St(k) || !t())
      return;
    const je = await Lr(v, ue);
    if (!St(k) || !t())
      return;
    const Be = je !== q;
    pa(ue), i.searchQuery ? await Et(i.searchPage, i.searchQuery) : i.loadedPosts.length === 0 || !i.hasNewerLocal ? await Se({
      forceTotalCount: ve.insertedCount + ve.updatedCount > 0
    }) : ($({
      force: ve.insertedCount + ve.updatedCount > 0
    }), await le(v)), i.syncStatus = Fi(ue, ve.insertedCount + ve.updatedCount > 0 || Be);
  }
  async function cs() {
    const v = e(), P = n();
    if (!v || !P)
      return;
    pn();
    const k = ++Ne;
    i.syncStatus = "syncing", i.lastDialogOpenRefreshAt = Date.now();
    const q = await gn(v);
    if (!St(k) || !t() || e() !== v)
      return;
    const Q = lu.runAuthored(P, {
      ownerPubkeyHex: v,
      relayConfig: r(),
      reason: "dialog-open-refresh",
      limit: hf,
      timeoutMs: uf,
      onSavedSelfPosts: l
    });
    xe = Q;
    const ue = await Q.promise, ve = ue.fetchResult, je = ue.upsertSummary;
    if (!St(k) || xe !== Q || (xe = null, !t() || ve.status === "cancelled") || !St(k) || !t())
      return;
    const Be = await Lr(v, ve);
    if (!St(k) || !t())
      return;
    const Je = wy({
      insertedCount: je.insertedCount,
      updatedCount: je.updatedCount,
      previousVisibleUntil: q,
      nextVisibleUntil: Be,
      searchQuery: i.searchQuery,
      loadedPostsLength: i.loadedPosts.length,
      hasNewerLocal: i.hasNewerLocal
    });
    if (Pa(ve), i.syncStatus = Fi(ve, Je.didMateriallyChange), Sn(), Je.applyAction === "reload-search-page")
      await Et(i.searchPage, i.searchQuery);
    else if (Je.applyAction === "load-latest-visible-posts") {
      const Te = Je.didMateriallyChange && !Je.didVisibleMateriallyChange;
      await Se({
        forceTotalCount: Je.didMateriallyChange,
        skipOlderAvailabilityCheck: Te,
        awaitProgress: Te
      });
    } else Je.applyAction === "refresh-count-and-availability" && (Je.didMateriallyChange ? await Se({
      forceTotalCount: Je.didMateriallyChange,
      skipOlderAvailabilityCheck: !Je.didVisibleMateriallyChange,
      awaitProgress: !Je.didVisibleMateriallyChange
    }) : (rt(), $({ force: Je.didMateriallyChange }), await le(v)));
  }
  function qs() {
    return typeof i.lastDialogOpenRefreshAt != "number" ? !0 : Date.now() - i.lastDialogOpenRefreshAt >= cf;
  }
  function ra(v, P) {
    if (!(de || !t() || e() !== v || !n())) {
      if (de = !0, P.length === 0) {
        na();
        return;
      }
      qs() && cs();
    }
  }
  function ja() {
    return !a(he) || !a(vt) ? !1 : (i.searchPage -= 1, !0);
  }
  function Ka() {
    return !a(he) || !a(_t) ? !1 : (i.searchPage = 1, !0);
  }
  async function Ya() {
    if (!a(he) || !a(gt))
      return !1;
    const v = i.searchPage + 1;
    return In(v, i.searchQuery);
  }
  async function Vs() {
    return !a(he) || !a(Ut) ? !1 : (i.searchPage = a(Pt), !0);
  }
  async function As() {
    if (a(he))
      return Ya();
    if (i.sparseSource === "saved") {
      const v = e();
      return v ? mt(v, ++O, {}) : !1;
    }
    if (i.sparseSource === "jump") {
      const v = e();
      return v ? tt(v, ++O, {}) : !1;
    }
    return Ve({ reason: "normal-older-reveal" });
  }
  async function js() {
    return a(he) ? Promise.resolve(ja()) : i.sparseSource === "saved" ? hs() : nn();
  }
  async function ks() {
    return a(he) ? Promise.resolve(Ka()) : (await Se(), !0);
  }
  async function Ds() {
    const v = e();
    if (!v)
      return !1;
    const P = await gn(v);
    if (typeof P != "number") return !1;
    const k = ++O, q = await it.getSparseChunk({
      pubkeyHex: v,
      visibleUntil: P,
      direction: "latest",
      limit: p
    });
    return !t() || e() !== v || k !== O ? !1 : q.length === 0 ? (i.hasSavedPostsOutsideVisibleRange = !1, !1) : (i.listingMode = "sparse", i.sparseSource = "saved", i.loadedPosts = q, $(), await le(v, q, k), await K(v, P, k), !0);
  }
  async function uo() {
    if (a(he) || !a(qn))
      return !1;
    if (i.listingMode === "sparse") {
      rt();
      const Q = e();
      if (!Q)
        return !1;
      const ue = ++O, ve = await it.getOldestVisibleChunk({
        pubkeyHex: Q,
        visibleUntil: i.visibleUntil,
        limit: p,
        query: { contiguous: !1 }
      });
      return !t() || ue !== O || ve.length === 0 ? !1 : ($(), i.loadedPosts = ve, Nn(), i.hasOlderLocal = !1, await le(Q, ve, ue, { skipOlderCheck: !0 }), !0);
    }
    rt();
    const v = e();
    if (!v)
      return !1;
    const P = ++O, k = await gn(v, P), q = await it.getOldestVisibleChunk({ pubkeyHex: v, visibleUntil: k, limit: p });
    return !t() || P !== O ? !1 : q.length === 0 ? ($(), i.loadedPosts = [], i.hasOlderLocal = !1, i.hasNewerLocal = !1, !1) : ($(), i.listingMode = "contiguous", i.sparseSource = null, i.loadedPosts = q, Nn(), i.hasOlderLocal = !1, await le(v, q, P, { skipOlderCheck: !0 }), !0);
  }
  async function Ks(v = {}) {
    const P = e(), k = n();
    if (!P || !k || !a(wn))
      return !1;
    pn();
    const q = ++Ne;
    i.syncStatus = "older-syncing";
    const Q = wm, ue = Pm, ve = Math.max(1, Math.min(p, 30));
    let je = null, Be = 0, Je = 0, Te = 0, At = null, _n = null, Ke = !1, et = 0, Jn = null;
    for (; ; ) {
      Be += 1;
      const ya = At ?? await va(P), za = typeof At == "number", Fr = await gn(P);
      if (!St(q) || !t() || e() !== P)
        return Ke;
      const Aa = typeof ya == "number" ? za ? ya : typeof Fr == "number" ? Math.min(ya, Fr) : ya : Fr;
      if (typeof Aa != "number")
        return i.syncStatus = "idle", Ke;
      const Qa = Math.trunc(Aa) - 1;
      if (Qa < 0)
        return Ba(null, null), i.syncStatus = "idle", Ke;
      const Qs = Math.min(Te, ol.length - 1), fs = ol[Qs], Hr = {
        since: (typeof _n == "number" && _n <= Qa ? _n : null) ?? Math.max(0, Qa - fs),
        until: Qa,
        windowSeconds: fs
      }, Ws = await is(P, Fr);
      if (!St(q) || !t() || e() !== P)
        return Ke;
      je === null && (je = Ws);
      let h = !1, U = {
        insertedCount: 0,
        updatedCount: 0
      };
      const Pe = ai.fetchLatest(k, {
        pubkeyHex: P,
        relayConfig: r(),
        reason: "older-backfill",
        limit: Li,
        timeoutMs: of,
        since: Hr.since,
        until: Hr.until
      });
      xe = Pe;
      const ye = await Pe.promise;
      if (!St(q) || xe !== Pe || (xe = null, !t() || ye.status === "cancelled") || (ye.events.length > 0 && (U = await it.upsertFetchedEvents({ events: ye.events, fetchedAt: ye.fetchedAt }), h = U.insertedCount + U.updatedCount > 0), !St(q) || !t()))
        return Ke;
      const yt = typeof a(qe) == "number" && (Fr === null ? i.hasJumpCacheAnchors : a(qe) < Fr), rn = yt ? Fr : await Es(P, ye);
      if (!St(q) || !t())
        return Ke;
      const Vt = !yt && typeof rn == "number" ? await Ao.reconcileWithFrontier({
        pubkeyHex: P,
        frontierVisibleUntil: rn,
        toleranceSec: bm
      }) : null, yn = Vt ? Vt.nextVisibleUntil : rn;
      Vt && (i.hasJumpCacheAnchors = Vt.anchors.length > 0), Vt && Vt.nextVisibleUntil !== rn && (await eo.save({
        pubkeyHex: P,
        kindsKey: ko,
        visibleUntil: Vt.nextVisibleUntil
      }), i.visibleUntil = Vt.nextVisibleUntil);
      const er = await is(P, yn);
      if (!St(q) || !t())
        return Ke;
      let Cr = !1;
      if (yt || (Cr = await ds(P, yn)), await K(P, yn, null, q), !St(q) || !t())
        return Ke;
      const $r = er > Ws, ps = Ra(ye, Li).length > 0, Nr = Xr(ye), Js = typeof Nr == "number" && Nr > Hr.since ? Nr - Hr.since : 0, po = ye.status === "success" && ps && typeof Nr == "number" && Nr > Hr.since && Js >= Cm;
      let Wa = Hr.since > 0 ? Hr.since : null, vo = null;
      po && typeof Nr == "number" && (Wa = Nr, vo = Hr.since), Ae.windowSeconds = fs, Ae.lastRange = { ...Hr, hitLimit: ps }, ye.status === "success" && ye.events.length === 0 ? Ae.consecutiveEmptyCount += 1 : ye.events.length > 0 && (Ae.consecutiveEmptyCount = 0), Ba(Wa, vo), Ua(Hr, ye, Li);
      let go = !1;
      const zr = {
        loadedPostsBeforeLength: i.loadedPosts.length,
        loadedPostsAfterLength: i.loadedPosts.length,
        olderPostsLength: 0,
        visibleOldestBefore: i.loadedPosts.length > 0 ? i.loadedPosts[i.loadedPosts.length - 1]?.createdAt ?? null : null,
        visibleOldestAfter: i.loadedPosts.length > 0 ? i.loadedPosts[i.loadedPosts.length - 1]?.createdAt ?? null : null,
        didTrimForOlderAppend: !1,
        didDeferOlderPosts: !1,
        maxVisiblePosts: ot
      };
      i.searchQuery ? await Et(i.searchPage, i.searchQuery) : ($({ force: h }), $r || h ? go = i.sparseSource === "saved" ? await mt(P, O, { anchorEventId: v.anchorEventId }) : yt ? await tt(P, O, { anchorEventId: v.anchorEventId }) : await Ve({
        anchorEventId: v.anchorEventId,
        metrics: zr,
        reason: "normal-older-reveal",
        useContiguousProgress: !1,
        preserveContiguousProgressAfterDatabaseChange: Cr
      }) : await le(P));
      const yo = go || $r || h, mo = Ke || yo, Ja = typeof Wa == "number" && Wa < Aa, vs = er, bo = Math.max(0, vs - (je ?? vs)), ki = typeof Wa == "number" ? Math.max(0, Aa - Wa) : Math.max(0, Aa), zo = Je + ki, gs = xm({
        status: ye.status,
        changed: yo,
        didCursorAdvanceOlder: Ja,
        hitLimit: ps,
        continuedWithinWindow: po,
        attemptIndex: Be,
        maxAttempts: Q,
        totalVisibleAdded: bo,
        targetVisibleAdded: ve,
        exploredSeconds: zo,
        maxExploreSeconds: ue
      }), Gs = gs.shouldContinue, Co = Gs ? et + 1 : et;
      if (Je = zo, Gs) {
        i.latestOlderBackfillUiResult = {
          changed: mo,
          didTrimForOlderAppend: zr.didTrimForOlderAppend,
          didDeferOlderPosts: zr.didDeferOlderPosts,
          loadedPostsBeforeLength: zr.loadedPostsBeforeLength,
          loadedPostsAfterLength: zr.loadedPostsAfterLength,
          maxVisiblePosts: zr.maxVisiblePosts,
          autoRetryCount: Co,
          autoRetryReason: gs.reason,
          attemptIndex: Be,
          maxAttempts: Q,
          clickStartVisibleCount: je ?? vs,
          currentVisibleCount: vs,
          totalVisibleAdded: bo,
          targetVisibleAdded: ve,
          shouldContinueForSmallBatch: Gs,
          exploredSeconds: Je,
          maxExploreSeconds: ue
        }, et = Co, Jn = gs.reason, Ke = mo, At = Wa, _n = vo, po || (Te = Math.min(Te + 1, ol.length - 1));
        continue;
      }
      return Jn = gs.reason, Ke = mo, gs.reason, i.latestOlderBackfillUiResult = {
        changed: Ke,
        didTrimForOlderAppend: zr.didTrimForOlderAppend,
        didDeferOlderPosts: zr.didDeferOlderPosts,
        loadedPostsBeforeLength: zr.loadedPostsBeforeLength,
        loadedPostsAfterLength: zr.loadedPostsAfterLength,
        maxVisiblePosts: zr.maxVisiblePosts,
        autoRetryCount: et,
        autoRetryReason: Jn,
        attemptIndex: Be,
        maxAttempts: Q,
        clickStartVisibleCount: je ?? vs,
        currentVisibleCount: vs,
        totalVisibleAdded: bo,
        targetVisibleAdded: ve,
        shouldContinueForSmallBatch: Gs,
        exploredSeconds: Je,
        maxExploreSeconds: ue
      }, ye.status !== "success" ? (i.syncStatus = "failed", Sn(), Ke) : (i.syncStatus = Ke ? Fi(ye, !0) : "idle", Sn(), Ke);
    }
  }
  async function ho() {
    rt();
    const v = e(), P = n();
    if (!v || !P || !a(tn))
      return;
    const k = Sa();
    if (k.length === 0)
      return;
    Ar(), i.currentViewRefetchStatus = "refetching";
    let q = null, Q;
    const ue = Date.now();
    try {
      Q = await gn(v), la({
        phase: "visible-range-state",
        startedAt: ue
      });
    } catch (Te) {
      la({
        phase: "visible-range-state",
        startedAt: ue,
        error: Te
      }), i.currentViewRefetchStatus = "idle", i.currentViewRefetchMessageKey = "postHistory.repairFetchFailed", i.currentViewRefetchMessageValues = null, Zr();
      return;
    }
    let ve;
    const je = Date.now();
    try {
      ve = $y.refetchAroundCurrentView(P, {
        pubkeyHex: v,
        relayConfig: r(),
        preferredRanges: k,
        onProgress: async () => {
        }
      });
    } catch (Te) {
      la({
        phase: "primary-fetch",
        startedAt: je,
        error: Te
      }), i.currentViewRefetchStatus = "idle", i.currentViewRefetchMessageKey = "postHistory.repairFetchFailed", i.currentViewRefetchMessageValues = null, Zr();
      return;
    }
    ne = ve;
    let Be = !1, Je = je;
    try {
      const Te = await ve.promise;
      if (ne !== ve)
        return;
      if (la({
        phase: "primary-fetch",
        startedAt: je,
        durationMs: Te.timing?.primaryFetchDurationMs ?? 0,
        counts: {
          processedRangeCount: Te.processedRangeCount,
          rawCount: Te.processedRanges.reduce((et, Jn) => et + (Jn.rawCount ?? 0), 0),
          uniqueCount: Te.processedRanges.reduce((et, Jn) => et + (Jn.uniqueCount ?? 0), 0),
          requestedRelayCount: Te.processedRanges.reduce((et, Jn) => et + (Jn.requestedRelayUrls?.length ?? 0), 0),
          eoseRelayCount: Te.processedRanges.reduce((et, Jn) => et + (Jn.eoseRelayUrls?.length ?? 0), 0)
        }
      }), (Te.timing?.primaryPersistAttemptCount ?? 0) > 0 && la({
        phase: "primary-persist",
        startedAt: je,
        durationMs: Te.timing?.primaryPersistDurationMs ?? 0,
        counts: {
          persistedRangeCount: Te.timing?.primaryPersistAttemptCount ?? 0
        }
      }), !t() || Te.status === "cancelled") {
        ne = null, i.currentViewRefetchStatus = "idle";
        return;
      }
      const At = Date.now();
      Je = At;
      try {
        await Va(v, Q, Te.processedRanges), la({
          phase: "visible-range-state",
          startedAt: At,
          counts: { processedRangeCount: Te.processedRangeCount }
        });
      } catch (et) {
        throw q = "visible-range-state", la({
          phase: "visible-range-state",
          startedAt: At,
          error: et,
          counts: { processedRangeCount: Te.processedRangeCount }
        }), et;
      }
      const _n = Date.now();
      Je = _n;
      try {
        i.searchQuery ? await Et(i.searchPage, i.searchQuery) : i.loadedPosts.length === 0 || !i.hasNewerLocal ? await Se({ skipTotalCountRefresh: !0 }) : await ke({ skipTotalCountRefresh: !0 }), la({
          phase: "visible-window-reload",
          startedAt: _n,
          counts: { processedRangeCount: Te.processedRangeCount }
        });
      } catch (et) {
        throw q = "visible-window-reload", la({
          phase: "visible-window-reload",
          startedAt: _n,
          error: et,
          counts: { processedRangeCount: Te.processedRangeCount }
        }), et;
      }
      Be = !0;
      let Ke = null;
      if (ne === ve && t() && e() === v && n() === P && i.loadedPosts.length > 0) {
        const et = Date.now();
        if (Je = et, Ke = await ht.repairCurrentView({
          ownerPubkeyHex: v,
          rxNostr: P,
          visiblePosts: i.loadedPosts,
          isActive: () => ne === ve && t() && e() === v && n() === P
        }), ne !== ve || Ke.status === "cancelled" || !t())
          return;
        la({
          phase: "relation-repair",
          startedAt: et,
          durationMs: Ke.relationRepairDurationMs ?? (Ke.failurePhase === "relation-repair" ? Ke.failureDurationMs : void 0),
          errorClass: Ke.failurePhase === "relation-repair" ? Ke.failureErrorClass : void 0,
          counts: {
            savedDirectReplyCount: Ke.savedDirectReplyCount
          }
        }), (typeof Ke.badgeRefreshDurationMs == "number" || Ke.failurePhase === "badge-refresh") && la({
          phase: "badge-refresh",
          startedAt: et,
          durationMs: Ke.badgeRefreshDurationMs ?? Ke.failureDurationMs,
          errorClass: Ke.failurePhase === "badge-refresh" ? Ke.failureErrorClass : void 0
        });
      }
      if (ne !== ve || !t() || e() !== v || n() !== P)
        return;
      i.searchQuery || $({ force: !0 }), ne = null, i.currentViewRefetchStatus = "idle", Te.addedCount > 0 ? (i.currentViewRefetchMessageKey = "postHistory.repairAdded", i.currentViewRefetchMessageValues = {
        count: Te.addedCount,
        processedRangeCount: Te.processedRangeCount,
        updatedCount: Te.updatedCount
      }) : (Ke?.savedDirectReplyCount ?? 0) > 0 ? (i.currentViewRefetchMessageKey = "postHistory.repairChildInteractionsAdded", i.currentViewRefetchMessageValues = {
        count: Ke?.savedDirectReplyCount ?? 0
      }) : Te.fetchFailed ? (i.currentViewRefetchMessageKey = "postHistory.repairFetchFailed", i.currentViewRefetchMessageValues = null) : (i.currentViewRefetchMessageKey = "postHistory.repairNoChanges", i.currentViewRefetchMessageValues = {
        processedRangeCount: Te.processedRangeCount,
        updatedCount: Te.updatedCount
      }), Zr();
    } catch (Te) {
      if (ne !== ve)
        return;
      const At = typeof Te == "object" && Te !== null ? Te.phase : void 0, _n = typeof Te == "object" && Te !== null && typeof Te.phaseStartedAt == "number" ? Te.phaseStartedAt : Je, Ke = typeof Te == "object" && Te !== null && typeof Te.errorClass == "string" ? Te.errorClass : void 0;
      q || la({
        phase: q ?? (At === "primary-fetch" || At === "primary-persist" ? At : Be ? "relation-repair" : "primary-fetch"),
        startedAt: _n,
        error: Te,
        errorClass: Ke
      }), Be && !i.searchQuery && t() && e() === v && n() === P && $({ force: !0 }), ne = null, i.currentViewRefetchStatus = "idle", i.currentViewRefetchMessageKey = Be ? "postHistory.repairNoChanges" : "postHistory.repairFetchFailed", i.currentViewRefetchMessageValues = null, Zr();
    }
  }
  async function us() {
    const v = e();
    return v ? (pn(), ln(), (await Promise.allSettled([
      it.deleteLocalHistoryForPubkey(v),
      Ao.clearForPubkey(v),
      eo.clearForPubkey(v)
    ])).some((k) => k.status === "rejected") ? (t() && e() === v && (C(), d({ known: i.totalCountKnown, status: "failed" })), Ar(), i.currentViewRefetchMessageKey = "postHistory.deleteLocalHistoryFailed", i.currentViewRefetchMessageValues = null, !1) : (cc(v), Im(v), ha(), i.currentViewRefetchMessageKey = "postHistory.deleteLocalHistorySuccess", i.currentViewRefetchMessageValues = null, dc(v, {
      currentPage: 1,
      searchPage: 1,
      searchInput: "",
      searchQuery: ""
    }), il(v, {
      ...vi,
      totalCount: 0,
      totalCountKnown: !0,
      totalCountFailed: !1
    }), !0)) : !1;
  }
  async function hs() {
    rt();
    const v = e(), P = z(i.loadedPosts[0]);
    if (!v || !P || typeof i.visibleUntil != "number")
      return !1;
    const k = ++O, q = await it.getSparseChunk({
      pubkeyHex: v,
      visibleUntil: i.visibleUntil,
      cursor: P,
      direction: "newer",
      limit: p
    });
    if (!t() || k !== O)
      return !1;
    if (q.length === 0)
      return i.hasNewerLocal = !1, !1;
    const Q = ce([...q, ...i.loadedPosts]);
    return i.loadedPosts = Q, await le(v, Q, k), !0;
  }
  async function Ys() {
    if (rt(), !!e()) {
      if (i.searchQuery) {
        await Et(i.searchPage, i.searchQuery);
        return;
      }
      if (i.sparseSource === "saved") {
        const v = e();
        if (!v) return;
        const P = await gn(v);
        $({ force: !0 }), await le(v), await K(v, P);
        return;
      }
      await Se({ forceTotalCount: !0 });
    }
  }
  function zs(v, P, k) {
    const q = (Q) => Q.map((ue) => ue.eventId === v ? { ...ue, deletedAt: P, deletionEventId: k } : ue);
    i.loadedPosts = q(i.loadedPosts), i.searchPosts = q(i.searchPosts);
  }
  function Ea(v) {
    const P = e(), k = Jr(P);
    if (!P || !k)
      return;
    const q = ++Ce;
    g(ie, "loading"), v().then(() => {
      t() && e() === P && _e === k && q === Ce && g(ie, "ready");
    }).catch(() => {
      t() && e() === P && _e === k && q === Ce && g(ie, "failed");
    });
  }
  return ze(() => {
    const v = Jr(e());
    v !== X && (X = v, qt(), g(W, null), te = v, pn(), ln(), yr(), hr(), Ar(), ur(), Nn(), ht.resetOlderRevealRepairContext(), de = !1, re = !1, _e = null, Ce += 1, g(ie, "idle"));
  }), ze(() => {
    const v = n();
    v !== oe && (oe = v, ht.resetOlderRevealRepairContext());
  }), ze(() => {
    gr();
  }), ze(() => {
    ua();
  }), ze(() => {
    t() || fa();
  }), ze(() => {
    if (t())
      return () => {
        pn();
      };
  }), ze(() => () => {
    ht.dispose();
  }), ze(() => {
    if (!t()) {
      ur();
      return;
    }
    return Sn(), () => {
      ur();
    };
  }), ze(() => {
    if (!t())
      return;
    const v = i.searchInput.trim();
    v !== i.searchQuery && g(fe, "loading");
    const P = setTimeout(
      () => {
        i.searchQuery = v;
      },
      y
    );
    return () => {
      clearTimeout(P);
    };
  }), ze(() => {
    if (!t() || a(he))
      return;
    const v = Jr(e()) ?? "";
    if (re && _e === v)
      return;
    if (re = !0, _e = v, te === v) {
      te = null, Ea(Se);
      return;
    }
    const P = at(), k = af(e());
    if (De(k, P)) {
      s(), Ea(Se);
      return;
    }
    if (ct(P)) {
      Ea(() => $e(P, k));
      return;
    }
    if (P) {
      Ea(() => Ct(P));
      return;
    }
    Ea(Se);
  }), ze(() => {
    t() || qt();
  }), ze(() => {
    if (!t() || !a(N) || a(Z) !== Jr(e()))
      return;
    const v = a(We);
    if (v.length === 0 || !Fd.canUsePersistentCache())
      return;
    const P = sf(v);
    if (P.length === 0)
      return;
    const k = [...P].sort().join("\0");
    k !== ge && (ge = k, Promise.resolve(Fd.prefetchCachedMediaDescriptors(P)).catch(() => {
    }));
  }), io(() => {
    O += 1, Re += 1, Ce += 1, g(ie, "idle"), g(Z, null), g(N, !1);
  }), ze(() => {
    if (t()) {
      if (!i.searchQuery) {
        const v = pe !== "";
        if (qt(), Re += 1, g(Ee, !1), g(fe, "idle"), Io.clearCache?.(), pe = "", V = !1, i.searchPage !== 1) {
          if (i.searchPage = 1, v) {
            const P = e();
            P && Ue(P, () => On(P, O), () => i.loadedPosts.length > 0);
          }
          return;
        }
        if (i.searchPosts = [], i.searchTotalCount = 0, i.searchHasNext = !1, v) {
          const P = e();
          P && Ue(P, () => On(P, O), () => i.loadedPosts.length > 0);
        }
        return;
      }
      if (i.searchQuery !== pe) {
        qt(), pe === "" && i.searchPosts.length === 0 && (i.searchPosts = i.loadedPosts), pe = i.searchQuery, i.searchPage = 1, V = !0, In(1, i.searchQuery);
        return;
      }
      if (pe = i.searchQuery, !V) {
        V = !0;
        const v = e(), P = i.searchQuery, k = ++Re, q = i.searchPosts.length > 0;
        v && q && Ue(v, () => Ye(k, P, v), () => i.searchPosts.length > 0), Et(i.searchPage, P, k);
      }
    }
  }), {
    state: i,
    get isSearchMode() {
      return a(he);
    },
    get posts() {
      return a(We);
    },
    get displayTotalCount() {
      return a(Ge);
    },
    get displayPage() {
      return a(ae);
    },
    get totalPages() {
      return a(Pt);
    },
    get canGoPrevious() {
      return a(vt);
    },
    get canGoFirst() {
      return a(_t);
    },
    get canGoNext() {
      return a(gt);
    },
    get canGoLast() {
      return a(Ut);
    },
    get showPaging() {
      return a(xt);
    },
    get canLoadOlder() {
      return a(nt);
    },
    get canLoadNewer() {
      return a(dt);
    },
    get canReturnToLatest() {
      return a(Rt);
    },
    get canJumpToOldest() {
      return a(qn);
    },
    get canFetchOlderFromRelays() {
      return a(wn);
    },
    get isFetchingOlderFromRelays() {
      return a(Pn);
    },
    get isFetchingFromRelays() {
      return a(_r);
    },
    get isRefetchingAroundCurrentView() {
      return a(Le);
    },
    get showLocalExhaustedState() {
      return a(dr);
    },
    get showSavedPostsBoundary() {
      return a(Tt);
    },
    get isShowingSavedOlderPosts() {
      return i.listingMode === "sparse" && i.sparseSource === "saved";
    },
    get visibleNewestCreatedAt() {
      return a($n);
    },
    get visibleOldestCreatedAt() {
      return a(qe);
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
      return a(xn);
    },
    get showSyncLoader() {
      return a(on);
    },
    get showStatusLoader() {
      return a(Rn);
    },
    get isSearchPageLoading() {
      return a(Ee);
    },
    get searchResultStatus() {
      return a(fe);
    },
    get initialLocalLoadStatus() {
      return a(ie);
    },
    get canRefetchAroundCurrentView() {
      return a(tn);
    },
    get currentViewRefetchStatusMessageKey() {
      return a(fn);
    },
    get currentViewRefetchStatusMessageValues() {
      return a(Er);
    },
    prepareForClose: Na,
    cancelCurrentSync: pn,
    cancelCurrentViewRefetch: ln,
    loadOlder: As,
    loadNewer: js,
    returnToLatest: ks,
    showSavedOlderPosts: Ds,
    jumpToOldest: uo,
    jumpToCreatedAt: br,
    jumpToEventId: Tr,
    fetchOlderFromRelays: Ks,
    goFirstPage: Ka,
    goPreviousPage: ja,
    goToNextPage: Ya,
    goToLastPage: Vs,
    refetchAroundCurrentView: ho,
    resetSearchState: vn,
    refreshAfterLocalImport: Ys,
    deleteLocalHistory: us,
    patchDeletedPost: zs
  };
}
const $o = /* @__PURE__ */ new Map();
function Dd(t) {
  if (typeof t != "string")
    return null;
  const e = t.trim();
  return e.length > 0 ? e : null;
}
function wh(t) {
  return typeof t == "string" ? t.trim() : "";
}
function Td(t) {
  const e = Dd(t.pubkeyHex);
  if (!e)
    return null;
  const n = t.mode === "search" ? wh(t.searchQuery) : "";
  return `${e}:${t.mode}:${n}`;
}
function Em(t) {
  const e = Td(t);
  if (!e)
    return null;
  const n = $o.get(e);
  return n ? {
    ...n,
    anchor: { ...n.anchor }
  } : null;
}
function Am(t) {
  const e = Td(t), n = Dd(t.pubkeyHex);
  !e || !n || $o.set(e, {
    pubkeyHex: n,
    mode: t.mode,
    searchQuery: t.mode === "search" ? wh(t.searchQuery) : "",
    anchor: { ...t.anchor },
    savedAt: t.savedAt ?? Date.now()
  });
}
function Pc(t) {
  const e = Dd(t.pubkeyHex);
  if (e) {
    if (t.mode) {
      const n = Td({
        pubkeyHex: e,
        mode: t.mode,
        searchQuery: t.searchQuery
      });
      n && $o.delete(n);
      return;
    }
    for (const n of $o.keys())
      n.startsWith(`${e}:`) && $o.delete(n);
  }
}
const Do = 1, km = 2, Dm = 12;
function Tm(t) {
  return `${t.pubkeyHex}:${t.mode}:${t.searchQuery}:${t.anchor.eventId}:${t.savedAt}`;
}
function Mm({
  getShow: t,
  getPubkeyHex: e,
  getPosts: n,
  getLocale: r,
  getContainer: o,
  getIsSearchMode: s,
  getSearchQuery: l
}) {
  let c = be(null), u = be(!0), b = be(!0), p = null, y = be(null), x = !1, f = null;
  function S() {
    return s() ? "search" : "normal";
  }
  function w() {
    return s() ? l() : "";
  }
  function m() {
    return Em({
      pubkeyHex: e(),
      mode: S(),
      searchQuery: w()
    });
  }
  function i(L) {
    return !!L && n().some((B) => B.eventId === L.anchor.eventId);
  }
  function O() {
    const L = W();
    L && Am({
      pubkeyHex: e(),
      mode: S(),
      searchQuery: w(),
      anchor: L
    });
  }
  function J() {
    Pc({
      pubkeyHex: e(),
      mode: S(),
      searchQuery: w()
    }), g(y, null), f = null;
  }
  function N() {
    Pc({ pubkeyHex: e() }), g(y, null), f = null;
  }
  function Z() {
    const L = o();
    L && (L.scrollTop = 0, _(), se(), re());
  }
  function ge() {
    const L = o();
    L && (L.scrollTop = L.scrollHeight, _(), se(), re());
  }
  function _() {
    const L = o();
    if (!L) {
      g(u, !0);
      return;
    }
    g(u, L.scrollTop <= Do);
  }
  function se() {
    const L = o();
    if (!L) {
      g(b, !0);
      return;
    }
    const B = L.scrollHeight - L.clientHeight - L.scrollTop;
    g(b, B <= km);
  }
  function Re() {
    const L = o();
    if (!L)
      return null;
    const B = L.getBoundingClientRect(), oe = B.top + Dm, pe = Array.from(L.querySelectorAll("[data-post-history-event-id]"));
    let V = null;
    for (const Ae of pe) {
      const ot = Number(Ae.dataset.postHistoryPostedAt);
      if (!Number.isFinite(ot))
        continue;
      const ht = Ae.getBoundingClientRect();
      if (ht.bottom > B.top + Do && ht.top < B.bottom - Do) {
        if (ht.top <= oe && ht.bottom > oe)
          return ot;
        V === null && (V = ot);
      }
    }
    return V;
  }
  function Ee() {
    if (!t() || n().length === 0) {
      g(c, null);
      return;
    }
    const L = Re();
    g(
      c,
      L === null ? null : ff(L, r()),
      !0
    );
  }
  function fe() {
    de(), Ee(), I();
  }
  function de() {
    p !== null && (cancelAnimationFrame(p), p = null);
  }
  function re() {
    t() && (de(), p = requestAnimationFrame(() => {
      p = null, Ee();
    }));
  }
  function _e() {
    if (_(), se(), a(b)) {
      fe();
      return;
    }
    re();
  }
  function ie() {
    da().then(() => {
      t() && Z();
    });
  }
  function Ce() {
    da().then(() => {
      t() && ge();
    });
  }
  function X(L) {
    da().then(() => {
      t() && te({ eventId: L, offsetTop: 0 });
    });
  }
  function W() {
    const L = o();
    if (!L)
      return null;
    const B = L.getBoundingClientRect(), oe = Array.from(L.querySelectorAll("[data-post-history-event-id]"));
    for (const pe of oe) {
      const V = pe.dataset.postHistoryEventId;
      if (!V)
        continue;
      const Ae = pe.getBoundingClientRect();
      if (Ae.bottom > B.top + Do && Ae.top < B.bottom - Do)
        return { eventId: V, offsetTop: Ae.top - B.top };
    }
    return null;
  }
  function te(L) {
    const B = o();
    if (!L || !t() || !B)
      return !1;
    I();
    const oe = Array.from(B.querySelectorAll("[data-post-history-event-id]")).find((ot) => ot.dataset.postHistoryEventId === L.eventId);
    if (!oe)
      return !1;
    const pe = B.getBoundingClientRect(), Ae = oe.getBoundingClientRect().top - pe.top;
    return B.scrollTop += Ae - L.offsetTop, re(), !0;
  }
  function xe(L, B) {
    const oe = o();
    return oe ? Array.from(oe.querySelectorAll("[data-post-history-thread-anchor-event-id]")).find((pe) => pe.dataset.postHistoryThreadAnchorScopeId === L && pe.dataset.postHistoryThreadAnchorEventId === B) ?? null : null;
  }
  function Ne(L, B) {
    const oe = xe(L, B);
    return oe ? {
      scopeEventId: L,
      eventId: B,
      top: oe.getBoundingClientRect().top
    } : null;
  }
  function ne(L) {
    const B = o();
    if (!L || !t() || !B)
      return !1;
    I();
    const oe = xe(L.scopeEventId, L.eventId);
    if (!oe)
      return !1;
    const pe = oe.getBoundingClientRect().top - L.top;
    return Math.abs(pe) < 0.5 || (B.scrollTop += pe, re(), _(), se()), !0;
  }
  async function E(L, B, oe) {
    const pe = Ne(L, B), V = oe();
    await da(), ne(pe), await V, await da(), ne(pe);
  }
  return ze(() => {
    if (!t()) {
      x = !1, g(y, null), f = null, g(c, null), de();
      return;
    }
    x || (x = !0, g(y, m(), !0), f = null);
  }), ze(() => {
    if (!t() || !i(a(y)))
      return;
    const L = a(y), B = Tm(L);
    f !== B && da().then(() => {
      !t() || a(y) !== L || (te(L.anchor), f = B, g(y, null));
    });
  }), ze(() => {
    if (!t()) {
      g(c, null), de();
      return;
    }
    return o(), n(), r(), da().then(() => {
      t() && (Ee(), _(), se());
    }), () => {
      de();
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
    clearCurrentSessionScrollAnchor: J,
    clearAllSessionScrollAnchorsForCurrentPubkey: N,
    handleHistoryScroll: _e,
    resetHistoryScrollSoon: ie,
    resetHistoryScrollToBottomSoon: Ce,
    scrollHistoryEventToTopSoon: X,
    captureHistoryScrollAnchor: W,
    restoreHistoryScrollAnchor: te,
    preserveThreadParentToggleScroll: E
  };
}
const xc = 100, Om = 86400, Lm = 6e3, Rc = 8;
function Fm(t) {
  return Number.isFinite(t) ? Math.max(1, Math.trunc(t ?? xc)) : xc;
}
function Hm(t) {
  return Array.from(t.values()).map((e) => ({
    parentEventId: e.parentEventId,
    event: e.event,
    relayUrls: Array.from(e.relayUrls).sort((n, r) => n.localeCompare(r))
  })).sort((e, n) => e.event.created_at !== n.event.created_at ? e.event.created_at - n.event.created_at : e.event.id.localeCompare(n.event.id));
}
function $m(t) {
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
class Nm {
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
    const r = El(), o = $m(n), s = new Map(o.map((J) => [J.eventId, J])), l = o.map((J) => J.eventId), c = this.resolveRelayUrls(
      [
        ...n.relayHints ?? [],
        ...o.flatMap((J) => J.relayHints)
      ],
      n.relayConfig,
      n.relayLimit
    ), u = Fm(n.limit), b = Math.max(
      0,
      Math.trunc(Math.min(...o.map((J) => J.createdAt))) - Om
    ), p = /* @__PURE__ */ new Map();
    let y = !1, x, f, S;
    const w = () => {
      f !== void 0 && (this.clearTimeoutFn(f), f = void 0), x?.unsubscribe?.(), x = void 0;
    }, m = (J) => ({
      status: J === "failed" && p.size > 0 ? "partial" : J,
      events: Hm(p),
      fetchedAt: this.now(),
      relayUrls: c
    }), i = (J) => (N) => {
      y || (y = !0, w(), J(m(N)));
    };
    return {
      promise: new Promise((J) => {
        const N = i(J);
        S = N;
        try {
          if (l.length === 0) {
            N("success");
            return;
          }
          x = Al(e, r, {
            on: c.length > 0 ? { relays: c } : { defaultReadRelays: !0 }
          }).subscribe({
            next: (Z) => {
              this.handlePacket(p, s, Z);
            },
            complete: () => N("success"),
            error: (Z) => {
              this.console.error("post_history_reply_fetch_error", Z), N("failed");
            }
          }), r.emit({
            kinds: Array.from(new Set(o.map((Z) => Z.eventKind))).sort(),
            "#e": l,
            since: b,
            limit: u
          }), r.over(), f = this.setTimeoutFn(() => {
            this.console.warn("post_history_reply_fetch_timeout", l.join(",")), N("failed");
          }, n.timeoutMs ?? Lm);
        } catch (Z) {
          this.console.error("post_history_reply_fetch_request_error", Z), N("failed");
        }
      }),
      cancel: () => {
        S?.("cancelled");
      }
    };
  }
  handlePacket(e, n, r) {
    const o = r.event;
    if (!o?.id || o.kind !== 1 && o.kind !== 42)
      return;
    const s = ns(o).parentId, l = s ? n.get(s) : null;
    if (!l || !ws({ child: o, parent: l }).valid)
      return;
    const c = hn.sanitizeExternalRelayUrls(
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
    if (!yu(u.event, o)) {
      this.console.warn("post_history_reply_fetch_packet_conflict", o.id);
      return;
    }
    c && u.relayUrls.add(c);
  }
  resolveRelayUrls(e, n, r) {
    const o = Number.isFinite(r) ? Math.max(1, Math.trunc(r ?? Rc)) : Rc, s = kl(e, o);
    if (s)
      return s;
    const l = n ? [
      ...hn.extractReadRelays(n),
      ...hn.extractWriteRelays(n)
    ] : [], c = hn.sanitizeExternalRelayUrls([
      ...e ?? [],
      ...l
    ], { limit: o });
    return c.length > 0 ? c : hn.sanitizeExternalRelayUrls(
      $l,
      { limit: o }
    );
  }
}
const Bm = new Nm(), Um = "postHistoryDirectReplyFetchMetadata:", Ph = 1;
function ei(t) {
  return Um + t;
}
function gi(t) {
  return typeof t == "number" && Number.isFinite(t);
}
function Sc(t) {
  if (!t || typeof t != "object")
    return !1;
  const e = t;
  return typeof e.parentEventId == "string" && (e.completeness === "complete" || e.completeness === "partial") && gi(e.fetchedAt) && gi(e.requestStartedAt) && e.schemaVersion === Ph;
}
function qm(t, e) {
  return t ? t.requestStartedAt > e.requestStartedAt ? !0 : t.requestStartedAt === e.requestStartedAt && t.completeness === "complete" && e.completeness === "partial" : !1;
}
class Vm {
  constructor(e = Ml, n = Date.now) {
    this.db = e, this.now = n;
  }
  async get(e) {
    if (!e)
      return null;
    const n = await this.db.meta.get(ei(e));
    return !n || !Sc(n.value) ? null : {
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
        (o) => ei(o)
      )
    )).flatMap((o) => !o || !Sc(o.value) ? [] : [{
      ...o.value,
      updatedAt: o.updatedAt
    }]);
  }
  async save(e) {
    return !e.parentEventId || !gi(e.fetchedAt) || !gi(e.requestStartedAt) ? null : this.db.transaction("rw", this.db.meta, async () => {
      const n = await this.get(e.parentEventId);
      if (qm(n, e))
        return n;
      const r = this.now(), o = {
        parentEventId: e.parentEventId,
        completeness: e.completeness,
        fetchedAt: e.fetchedAt,
        requestStartedAt: e.requestStartedAt,
        schemaVersion: Ph
      };
      return await this.db.meta.put({
        key: ei(e.parentEventId),
        value: o,
        updatedAt: r
      }), {
        ...o,
        updatedAt: r
      };
    });
  }
  async clear(e) {
    e && await this.db.meta.delete(ei(e));
  }
}
const jm = new Vm(), Rl = {
  totalCount: 0,
  groups: []
};
function Km(t) {
  if (!Ol(t.content))
    return;
  const e = du(t.content);
  if (e)
    return cu(t.tags ?? []).get(e)?.url;
}
function Ym(t) {
  if (t.length === 0)
    return Rl;
  const e = [], n = /* @__PURE__ */ new Map();
  let r = 0;
  for (const o of t) {
    if (o.kind !== 7)
      continue;
    r += 1;
    const s = Km(o), l = n.get(o.content);
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
  return r === 0 ? Rl : {
    totalCount: r,
    groups: e
  };
}
const Sl = {
  totalCount: 0,
  groups: []
}, zm = new Intl.Segmenter(void 0, {
  granularity: "grapheme"
});
function Qm(t) {
  if (!Ol(t.content))
    return;
  const e = du(t.content);
  if (e)
    return cu(t.tags ?? []).get(e)?.url;
}
function Wm(t) {
  const e = t.trim();
  if (!e)
    return "";
  if (Ol(e))
    return e;
  const n = zm.segment(e)[Symbol.iterator]().next();
  return n.done ? "" : n.value.segment;
}
function Jm(t, e) {
  return t ? t instanceof Map ? t.get(e) ?? null : t[e] ?? null : null;
}
function Gm(t) {
  try {
    return nu(pf(t), 9, 4);
  } catch {
    return t.slice(0, 12);
  }
}
function Zm(t) {
  return t.profile?.displayName?.trim() || t.profile?.name?.trim() || Gm(t.pubkey);
}
async function Xm(t, e = uu) {
  return t ? e.getReactionRecords(t) : [];
}
function Ic(t, e) {
  if (t.length === 0)
    return Sl;
  const n = [], r = /* @__PURE__ */ new Map();
  let o = 0;
  for (const s of t) {
    if (s.kind !== 7)
      continue;
    o += 1;
    const l = Wm(s.content);
    if (!l)
      continue;
    const c = {
      eventId: s.eventId,
      pubkey: s.authorPubkey,
      profile: Jm(e, s.authorPubkey),
      createdAt: s.createdAt
    }, u = r.get(l), b = Qm(s);
    if (u === void 0) {
      r.set(l, n.length), n.push({
        content: l,
        count: 1,
        ...b ? { emojiUrl: b } : {},
        reactors: [c]
      });
      continue;
    }
    const p = n[u], y = p.emojiUrl ?? b;
    n[u] = {
      ...p,
      count: p.count + 1,
      ...y ? { emojiUrl: y } : {},
      reactors: [...p.reactors, c]
    };
  }
  return o === 0 ? Sl : {
    totalCount: o,
    groups: n
  };
}
function e0() {
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
function t0(t = {}) {
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
function n0(t, e) {
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
function Ls(t, e = {}) {
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
function _c(t, e) {
  return {
    ...t,
    loadingChildren: e.showInitialLoading,
    revalidatingChildren: !e.showInitialLoading,
    visibleChildren: e.prefetchOnly ? t.visibleChildren : t.visibleChildren || e.showInitialLoading,
    childrenError: null
  };
}
function Fo(t, e = {}) {
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
function yi(t, e) {
  return {
    ...t,
    loadingChildren: !1,
    revalidatingChildren: !1,
    visibleChildren: t.visibleChildren,
    childrenError: e.nextError
  };
}
function r0(t) {
  return t.status === "deleted" ? "deleted" : t.status === "not-found" ? "not-found" : t.status === "resolved" && t.event ? "resolved" : "failed";
}
function a0(t) {
  return t.nextRecordsLength > 0 ? "resolved" : t.resultEventsLength > 0 ? "deleted" : "not-found";
}
function s0(t) {
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
        ...Ls(e, {
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
        ...Ls(n, {
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
function o0(t) {
  const e = () => {
    t.updateExpansion((n) => ({
      ...Fo(n, {
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
function i0(t) {
  t.updateExpansion((e) => ({
    ...e,
    loadingParent: !1,
    revalidatingParent: !1,
    visibleParent: e.visibleParent,
    parentError: t.showInitialLoading ? t.errorCode : e.parentError,
    showParentLoadingIndicator: !1
  }));
}
function xh(t) {
  t.updateExpansion((e) => ({
    ...yi(e, {
      nextError: t.showInitialLoading && !t.prefetchOnly ? t.errorCode ?? "fetch_failed" : e.childrenError
    })
  }));
}
function Rh(t) {
  return typeof t.lastFetchedAt != "number" ? !0 : (t.now ?? Date.now()) - t.lastFetchedAt >= t.ttlMs;
}
function l0(t) {
  return !t.displayedCached || t.force ? !1 : !Rh({
    lastFetchedAt: t.lastFetchedAt,
    ttlMs: t.ttlMs,
    now: t.now
  });
}
function d0(t) {
  const e = l0(t);
  return {
    skipRevalidate: e,
    shouldShowInitialLoading: !t.displayedCached,
    shouldPrefetchReplyCountsOnSkip: e && !t.prefetchOnly
  };
}
function c0(t) {
  return !t.loading && !t.revalidating ? !1 : (t.onInFlight(), t.loading && t.onLoadingInFlight?.(), !0);
}
function Ec(t) {
  return t.hasVisibleData ? Rh({
    lastFetchedAt: t.lastFetchedAt,
    ttlMs: t.ttlMs,
    now: t.now
  }) : !1;
}
async function Ac(t) {
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
async function kc(t) {
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
async function Dc(t) {
  const e = t.strategies[t.status] ?? t.fallback;
  e && await e();
}
async function u0(t) {
  if (t.skipRevalidate)
    return;
  const e = t.runRevalidate({
    showInitialLoading: t.shouldShowInitialLoading
  });
  t.awaitWhenInitialLoading && t.shouldShowInitialLoading && await e;
}
async function h0(t) {
  const e = d0(t);
  return e.shouldPrefetchReplyCountsOnSkip && t.onSkipPrefetchReplyCounts?.(), await u0({
    skipRevalidate: e.skipRevalidate,
    shouldShowInitialLoading: e.shouldShowInitialLoading,
    awaitWhenInitialLoading: t.awaitWhenInitialLoading,
    runRevalidate: t.runRevalidate
  }), e;
}
async function Tc(t) {
  if (c0({
    loading: t.loading,
    revalidating: t.revalidating,
    onInFlight: t.onInFlight,
    onLoadingInFlight: t.onLoadingInFlight
  }) || t.shouldHandleLoadedState && await t.handleLoadedState())
    return;
  t.prepareFreshLoadState();
  const e = await t.displayCachedForFreshLoad();
  await h0({
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
function Ta(t) {
  return hn.sanitizeExternalRelayUrls(t, { limit: 8 });
}
function Mc(t) {
  return Array.from(new Set(t));
}
const f0 = 20, p0 = 12, v0 = 2, Oc = 4, g0 = 4, Lc = 300 * 1e3;
class Sh extends Error {
}
function Fc(t) {
  if (t === "failed")
    throw new Error("post_history_reply_fetch_failed");
  if (t === "cancelled")
    throw new Sh();
}
function y0(t) {
  return (e) => {
    if (e instanceof Sh) {
      t.updateExpansion((n) => ({
        ...yi(n, { nextError: n.childrenError })
      }));
      return;
    }
    xh({ ...t, errorCode: "fetch_failed" });
  };
}
function Hc(t) {
  return t === "partial" ? "partial" : "complete";
}
function ll(t) {
  return t?.completeness === "complete" ? t.fetchedAt : null;
}
const ti = 300 * 1e3;
let m0 = 0;
function b0(t, e) {
  const n = new Set(t.map((r) => r.eventId));
  return (e && e.length > 0 ? Array.from(new Set(e)) : Array.from(n)).filter((r) => n.has(r));
}
function $c(t) {
  const e = es({
    event: t.parentNode.event,
    relayHints: t.parentNode.relayUrls
  });
  return !!e && ws({
    child: Oo(t.record),
    parent: e
  }).valid;
}
function Nc(t) {
  if (!t.parentNode)
    return null;
  const e = es({
    event: t.parentNode.event,
    relayHints: t.parentNode.relayUrls
  });
  return e && ws({ child: t.childNode.event, parent: e }).valid ? t.parentNode : null;
}
function C0({
  getShow: t,
  getPubkeyHex: e,
  getRxNostr: n,
  getRelayConfig: r,
  postHistoryRepositoryImpl: o = it,
  directReplyRecordsAdapterImpl: s = vf,
  reactionRecordsAdapterImpl: l = uu,
  childInteractionsRepositoryImpl: c = Dl,
  deletionRequestsRepositoryImpl: u = oo,
  directReplyFetchMetadataRepositoryImpl: b = jm,
  profileSyncCoordinator: p = void 0,
  contextFetchService: y = Rd,
  replyFetchService: x = Bm,
  deletionFetchService: f = Ri,
  relatedTargetResolver: S = void 0
}) {
  const w = p ?? Sd({ getShow: t, getRxNostr: n }), m = !p, i = S ?? Id({
    getShow: t,
    getRxNostr: n,
    getRelayConfig: r,
    postHistoryRepositoryImpl: o,
    contextFetchService: y,
    deletionRequestsRepositoryImpl: u,
    deletionFetchService: f,
    profileSyncCoordinator: w
  }), O = !S, J = `post-history-thread-graph-parent:${++m0}`;
  let N = be({}), Z = be({}), ge = be({}), _ = be({}), se = be({}), Re = be(0);
  const Ee = t0(), fe = /* @__PURE__ */ new Set(), de = /* @__PURE__ */ new Set(), re = /* @__PURE__ */ new Set(), _e = /* @__PURE__ */ new Set();
  let ie = be({}), Ce = be({}), X = be({}), W = be({});
  const te = e0();
  function xe(d) {
    const C = a(Ce)[d] ?? [];
    g(W, {
      ...a(W),
      [d]: Ic(C, a(X))
    });
  }
  function Ne(d, C) {
    g(X, { ...a(X), [d]: C });
    for (const [H, $] of Object.entries(a(Ce)))
      $.some((K) => K.authorPubkey === d) && xe(H);
  }
  function ne(d) {
    return a(ie)[d] ?? Rl;
  }
  function E(d) {
    return a(W)[d] ?? Sl;
  }
  function L(d, C) {
    return a(_)[Tn(d, C)] ?? Gi();
  }
  function B(d, C, H) {
    const $ = Tn(d, C);
    g(_, {
      ...a(_),
      [$]: H(a(_)[$] ?? Gi())
    });
  }
  function oe(d) {
    const C = Ro(d), H = So(a(N)[C.eventId], C);
    return g(N, { ...a(N), [H.eventId]: H }), H;
  }
  function pe(d, C) {
    C && g(Z, { ...a(Z), [d]: C });
  }
  function V(d, C) {
    const H = a(ge)[d] ?? [], $ = sc(Mc([...H, ...C]).filter((K) => K !== d && !qn(K)), a(N));
    g(ge, { ...a(ge), [d]: $ });
  }
  function Ae(d) {
    const C = Cl(d);
    return Ro({
      event: C,
      relayUrls: Ta([
        ...d.relayHints,
        ...d.acceptedRelays,
        ...d.fetchedRelays ?? []
      ]),
      sources: ["anchor", "history-record"]
    });
  }
  function ot(d) {
    const C = Ae(d), H = oe({
      event: C.event,
      relayUrls: C.relayUrls,
      sources: C.sources
    });
    return pe(H.eventId, H.parentEventId), he(H.authorPubkey, H.relayUrls), H;
  }
  function ht(d, C) {
    if (!d || !C)
      return;
    let H = !1;
    const $ = { ...a(N) };
    for (const [K, z] of Object.entries(a(N)))
      z.authorPubkey === d && ($[K] = So(z, { ...z, profile: C }), H = !0);
    H && g(N, $);
  }
  function he(d, C = []) {
    const H = w.ensureProfile(d, C);
    ht(d, H);
  }
  const Le = w.subscribe((d, C) => {
    t() && (ht(d, C), Ne(d, C));
  });
  async function We(d) {
    const C = Ta(d.relayUrls ?? []), H = oe({ ...d, relayUrls: C });
    return he(d.event.pubkey, C), H;
  }
  function ae(d, C, H) {
    const $ = el.buildContext(d, C, H);
    return $ ? el.toDescriptor($, J) : null;
  }
  function Ge(d) {
    if (!d)
      return null;
    const C = i.getTargetSnapshot(d.eventId);
    if (C?.status !== "resolved" || !C.event)
      return d;
    const H = Ta([...d.relayUrls, ...C.relayHints]), $ = C.profile ?? d.profile ?? null;
    return d.event === C.event && d.profile === $ && pl(d.relayUrls, H) ? d : So(d, {
      ...d,
      event: C.event,
      relayUrls: H,
      profile: $
    });
  }
  function Pt(d, C) {
    return el.getRelayHints(d, C);
  }
  function vt(d, C) {
    const H = ns(C.event);
    return Ta([
      ...C.relayUrls,
      ...H.relayHints,
      ...d.relayHints,
      ...d.acceptedRelays,
      ...d.fetchedRelays ?? []
    ]);
  }
  function _t(d, C) {
    return hn.sanitizeExternalRelayUrls(
      [
        ...C.flatMap((H) => {
          const $ = ns(H.event);
          return [...H.relayUrls, ...$.relayHints];
        }),
        ...d.relayHints,
        ...d.acceptedRelays,
        ...d.fetchedRelays ?? []
      ],
      { limit: g0 }
    );
  }
  function gt(d) {
    Ee.clear(d);
  }
  function Ut(d, C) {
    const H = Tn(d, C);
    Ee.schedule(H, () => {
      const $ = L(d, C);
      !$.loadingParent || !$.visibleParent || B(d, C, (K) => ({ ...K, showParentLoadingIndicator: !0 }));
    });
  }
  function xt(d, C) {
    return (a(ge)[d] ?? []).map(($) => Ge(a(N)[$])).filter(($) => !!$).filter(($) => !qe($.authorPubkey, $.eventId)).map(($) => ({
      event: $.event,
      profile: $.profile,
      relayUrls: [...$.relayUrls],
      isOwnReply: $.authorPubkey === C
    }));
  }
  function nt(d) {
    return (a(ge)[d] ?? []).filter((C) => {
      const H = a(N)[C];
      return H && !qe(H.authorPubkey, H.eventId);
    });
  }
  function dt(d, C, H) {
    return nt(d).filter(($) => !C.includes($) && !H.has($));
  }
  function Rt(d, C, H, $ = [], K = 0, z = /* @__PURE__ */ new Set()) {
    const ce = Ge(a(N)[C]);
    if (!ce || qe(ce.authorPubkey, ce.eventId) || $.includes(C) || z.has(C))
      return null;
    z.add(C);
    const Fe = [...$, C], le = L(d, C), Se = ce.parentEventId, ke = Se ? $.includes(Se) : !1, De = Se ? Nc({
      childNode: ce,
      parentNode: Ge(a(N)[Se] ?? null)
    }) : null, $e = le.visibleParent && De && !ke && K > -20 ? Rt(d, De.eventId, H, Fe, K - 1, z) : null, at = K < f0 ? dt(C, Fe, z) : [], ct = at.length, Ct = le.visibleChildren && ct > 0, Ve = Ct ? at.map((tt) => Rt(d, tt, H, Fe, K + 1, z)).filter((tt) => tt !== null) : [];
    return {
      anchorEventId: d,
      node: ce,
      parentTargetId: Se,
      parentNodeState: $e,
      parentExpansion: le,
      parentAlreadyInPath: ke,
      repliesActionState: {
        status: le.loadingChildren ? "loading" : le.childrenError ? "failed" : le.loadedChildren ? "loaded" : "unloaded",
        visible: Ct,
        replies: at,
        replyCount: ct,
        error: le.childrenError
      },
      replyNodeStates: Ve,
      isOwnReply: ce.authorPubkey === H,
      depthFromAnchor: K,
      cycleDetected: !1
    };
  }
  function $n(d) {
    a(Re);
    const C = Ge(a(N)[d.eventId]) ?? Ae(d), H = L(d.eventId, d.eventId), $ = e() ?? d.pubkeyHex, K = /* @__PURE__ */ new Set([d.eventId]), z = C.parentEventId, ce = z ? Ge(a(N)[z] ?? null) : null, Fe = ce && !qe(ce.authorPubkey, ce.eventId) ? Nc({ childNode: C, parentNode: ce }) : null, le = Fe && H.visibleParent ? Rt(d.eventId, Fe.eventId, $, [d.eventId], -1, K) : null, Se = dt(d.eventId, [d.eventId], K), ke = new Set(Se), De = xt(d.eventId, $).filter((Ct) => ke.has(Ct.event.id)), $e = Se.length, at = H.visibleChildren && $e > 0, ct = at ? Se.map((Ct) => Rt(d.eventId, Ct, $, [d.eventId], 1, K)).filter((Ct) => Ct !== null) : [];
    return {
      anchorEventId: d.eventId,
      parentTargetId: z,
      parentNode: Fe,
      parentNodeState: le,
      parentExpansion: H,
      repliesActionState: {
        status: H.loadingChildren ? "loading" : H.childrenError ? "failed" : H.loadedChildren ? "loaded" : "unloaded",
        visible: at,
        replies: De,
        replyCount: $e,
        error: H.childrenError
      },
      reactionSummary: ne(d.eventId),
      reactionReadModel: E(d.eventId),
      replyItems: De,
      replyNodeStates: ct
    };
  }
  function qe(d, C) {
    return !d || !C ? !1 : !!a(se)[d]?.[C];
  }
  function qn(d) {
    const C = a(N)[d];
    return C ? qe(C.authorPubkey, d) : !1;
  }
  function wn(d, C) {
    !d || !C || qe(d, C) || g(se, {
      ...a(se),
      [d]: {
        ...a(se)[d] ?? {},
        [C]: !0
      }
    });
  }
  function Pn(d, C, H = {}) {
    const $ = /* @__PURE__ */ new Set();
    for (const [K, z] of Object.entries(a(Z))) {
      if (z !== d)
        continue;
      const ce = a(N)[d];
      C && ce && ce.authorPubkey !== C || $.add(K);
    }
    if ($.size !== 0)
      for (const [K, z] of Object.entries(a(_))) {
        const ce = K.indexOf(":");
        if (ce < 0)
          continue;
        const Fe = K.slice(0, ce), le = K.slice(ce + 1);
        $.has(le) && (!z?.loadedParent && !z?.visibleParent || B(Fe, le, (Se) => Ls(Se, {
          visibleParent: H.revealKnownParent ? !0 : Se.visibleParent,
          parentDeleted: !0,
          lastFetchedParentAt: Date.now()
        })));
      }
  }
  function _r(d, C = {}) {
    for (const [H, $] of d.entries())
      for (const K of $)
        Pn(K, H, C);
  }
  function dr(d) {
    let C = a(se), H = !1;
    for (const [$, K] of d.entries()) {
      const z = C[$] ?? {};
      let ce = z;
      for (const Fe of K)
        ce[Fe] || (ce = { ...ce, [Fe]: !0 }, H = !0);
      ce !== z && (C = { ...C, [$]: ce });
    }
    H && (g(se, C), _r(d));
  }
  function Tt(d) {
    const C = {};
    let H = !1;
    for (const [$, K] of Object.entries(a(ge))) {
      const z = K.filter((ce) => ce !== d);
      C[$] = z, z.length !== K.length && (H = !0);
    }
    if (H && g(ge, C), a(Z)[d]) {
      const { [d]: $, ...K } = a(Z);
      g(Z, K);
    }
  }
  async function Ht(d, C = {}) {
    if (!d?.id || qe(d.pubkey, d.id))
      return !0;
    if (C.checkPostHistoryRepository === !1)
      return !1;
    try {
      if (typeof (await o.getByEventId(d.id))?.deletedAt == "number")
        return wn(d.pubkey, d.id), Tt(d.id), !0;
    } catch {
    }
    return !1;
  }
  async function tn(d) {
    dr(d);
    for (const C of d.values())
      for (const H of C)
        Tt(H), await c.deleteChildInteractionByEventId(H);
  }
  async function xn(d) {
    const C = await u.getDeletedTargets(d.map((H) => ({ targetAuthorPubkey: H.pubkey, targetEventId: H.id })));
    await tn(C);
  }
  async function on(d, C, H, $ = "default") {
    if (C.length === 0)
      return;
    const K = n();
    if (!K)
      return;
    const z = C.filter((le) => !qe(le.pubkey, le.id));
    if (z.length === 0)
      return;
    const ce = `${d}:deletions:${$}`, Fe = f.fetchDeletionRequests(K, {
      targets: z.map((le) => ({
        event: le,
        relayUrls: a(N)[le.id]?.relayUrls ?? []
      })),
      relayHints: H,
      relayConfig: r()
    });
    te.replaceDeletionFetchTask(ce, Fe);
    try {
      const le = await Fe.promise;
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
      te.deleteDeletionFetchTask(ce);
    }
    t() && await xn(z);
  }
  async function Rn(d) {
    await xn(d);
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
  async function fn(d) {
    const C = d.map((z) => Oo(z)), H = await Rn(C), $ = new Set(H.map((z) => z.id)), K = [];
    for (const z of d)
      $.has(z.eventId) && K.push(z);
    return K;
  }
  async function Er(d) {
    const C = await Rn(d.map((K) => K.event)), H = new Set(C.map((K) => K.id)), $ = [];
    for (const K of d)
      H.has(K.event.id) && $.push(K);
    return $;
  }
  async function pn(d) {
    return await xn([d.event]), await Ht(d.event, { checkPostHistoryRepository: d.checkPostHistoryRepository }) ? !1 : (on(d.anchorEventId, [d.event], d.relayHints), !0);
  }
  function rt(d, C = d) {
    gt(Tn(d, C)), B(d, C, (H) => ({
      ...Ls(H, {
        visibleParent: !0,
        parentDeleted: !0,
        lastFetchedParentAt: Date.now()
      })
    }));
  }
  function Mn(d, C) {
    gt(Tn(d, C)), B(d, C, (H) => ({
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
  async function St(d, C, H) {
    const $ = H.parentEventId;
    if (!$)
      return !1;
    const K = i.getTargetSnapshot($);
    if (K?.status === "deleted")
      return K.authorPubkey && (wn(K.authorPubkey, $), Pn($, K.authorPubkey, { revealKnownParent: !0 })), rt(d.eventId, C), !0;
    const z = Ge(a(N)[$] ?? null);
    if (z) {
      const ce = es({
        event: z.event,
        relayHints: z.relayUrls
      });
      if (!ce || !ws({ child: H.event, parent: ce }).valid)
        return Mn(d.eventId, C), !1;
      const Fe = Ta([
        ...z.relayUrls,
        ...Pt(d, H)
      ]), le = await pn({
        anchorEventId: d.eventId,
        event: z.event,
        relayHints: Fe,
        checkPostHistoryRepository: z.authorPubkey === e()
      });
      return t() ? le ? (B(d.eventId, C, (Se) => ({
        ...Ls(Se, {
          parentDeleted: Se.parentDeleted,
          lastFetchedParentAt: K?.updatedAt ?? Se.lastFetchedParentAt
        })
      })), !0) : (rt(d.eventId, C), !0) : !1;
    }
    if (!K)
      return !1;
    if (K.authorPubkey && qe(K.authorPubkey, $))
      return rt(d.eventId, C), !0;
    if (K.status === "resolved" && K.event) {
      const ce = es({
        event: K.event,
        relayHints: K.relayHints
      });
      if (!ce || !ws({ child: H.event, parent: ce }).valid)
        return Mn(d.eventId, C), !1;
      const Fe = oe({
        event: K.event,
        relayUrls: K.relayHints,
        sources: ["fetched-parent"],
        profile: K.profile
      });
      return pe(Fe.eventId, Fe.parentEventId), B(d.eventId, C, (le) => ({
        ...Ls(le, {
          parentDeleted: !1,
          lastFetchedParentAt: K.updatedAt ?? le.lastFetchedParentAt
        })
      })), !0;
    }
    return K.status === "not-found" ? (B(d.eventId, C, (ce) => ({
      ...Ls(ce, {
        parentMissing: !0,
        parentDeleted: !1,
        lastFetchedParentAt: K.updatedAt ?? ce.lastFetchedParentAt
      })
    })), !0) : !1;
  }
  async function On(d, C, H, $ = {}) {
    const K = H.parentEventId;
    if (!K)
      return;
    const z = te.incrementRequestId(), ce = Tn(d.eventId, C);
    B(d.eventId, C, (Fe) => ({
      ...n0(Fe, { showInitialLoading: !!$.showInitialLoading })
    })), $.showInitialLoading && Ut(d.eventId, C), await Ac({
      isActive: () => z === te.getRequestId() && t(),
      cleanup: () => {
        gt(ce);
      },
      onError: () => {
        i0({
          updateExpansion: (Fe) => B(d.eventId, C, Fe),
          showInitialLoading: !!$.showInitialLoading,
          errorCode: "fetch_failed"
        });
      },
      run: async ({ ensureActive: Fe }) => {
        const le = ae(d, C, H);
        if (!le)
          return;
        const Se = await i.ensureTarget(le, { force: !0, background: !$.showInitialLoading });
        if (!Fe() || (gt(ce), !Se))
          return;
        if (Se.status === "resolved" && Se.event) {
          const De = es({ event: Se.event, relayHints: Se.relayHints });
          if (!De || !ws({ child: H.event, parent: De }).valid) {
            Mn(d.eventId, C);
            return;
          }
        }
        const ke = r0(Se);
        await Dc({
          status: ke,
          strategies: s0({
            snapshot: Se,
            parentEventId: K,
            showInitialLoading: !!$.showInitialLoading,
            updateExpansion: (De) => {
              B(d.eventId, C, De);
            },
            hideEvent: wn,
            markParentDeletedForEvent: Pn,
            setParentDeleted: () => {
              rt(d.eventId, C);
            },
            isDeletedEvent: qe,
            upsertNode: () => oe({
              event: Se.event,
              relayUrls: Se.relayHints,
              sources: ["fetched-parent"],
              profile: Se.profile
            }),
            upsertParentEdge: pe
          })
        });
      }
    });
  }
  async function qt(d, C, H = {}) {
    const $ = C === d.eventId ? ot(d) : a(N)[C];
    if (!$?.parentEventId)
      return;
    const K = L(d.eventId, C);
    await Tc({
      loading: K.loadingParent,
      revalidating: K.revalidatingParent,
      onInFlight: () => {
        B(d.eventId, C, (z) => ({
          ...z,
          visibleParent: !0,
          showParentLoadingIndicator: !1
        }));
      },
      onLoadingInFlight: () => {
        Ut(d.eventId, C);
      },
      shouldHandleLoadedState: !H.force && K.loadedParent,
      handleLoadedState: async () => {
        if (K.parentDeleted)
          return rt(d.eventId, C), !0;
        B(d.eventId, C, (ce) => ({
          ...ce,
          visibleParent: !0,
          showParentLoadingIndicator: !1
        }));
        const z = await St(d, C, $);
        return Ec({
          hasVisibleData: z,
          lastFetchedAt: K.lastFetchedParentAt,
          ttlMs: ti
        }) && On(d, C, $), !0;
      },
      prepareFreshLoadState: () => {
        B(d.eventId, C, (z) => ({
          ...z,
          visibleParent: !0,
          loadingParent: !0,
          parentError: null,
          parentMissing: !1,
          parentDeleted: !1,
          showParentLoadingIndicator: !1
        })), Ut(d.eventId, C);
      },
      displayCachedForFreshLoad: async () => {
        const z = await St(d, C, $), ce = L(d.eventId, C);
        return {
          displayedCached: z,
          lastFetchedAt: ce.lastFetchedParentAt
        };
      },
      force: !!H.force,
      ttlMs: ti,
      awaitWhenInitialLoading: !0,
      runRevalidate: ({ showInitialLoading: z }) => On(d, C, $, { showInitialLoading: z })
    });
  }
  async function Ue(d, C = {}) {
    await qt(d, d.eventId, C);
  }
  function ln(d) {
    cr(d.eventId, d.eventId);
  }
  function cr(d, C) {
    gt(Tn(d, C)), B(d, C, (H) => ({
      ...H,
      visibleParent: !1,
      showParentLoadingIndicator: !1
    }));
  }
  async function ur(d) {
    if (L(d.eventId, d.eventId).visibleParent) {
      ln(d);
      return;
    }
    await Ue(d);
  }
  function Nn(d) {
    Ue(d, { force: !0 });
  }
  async function Ar(d, C) {
    if (L(d.eventId, C).visibleParent) {
      cr(d.eventId, C);
      return;
    }
    await qt(d, C);
  }
  function Zr(d, C) {
    qt(d, C, { force: !0 });
  }
  function Sn(d) {
    const C = d.map((H) => H.fetchedAt).filter((H) => Number.isFinite(H));
    return C.length > 0 ? Math.max(...C) : null;
  }
  async function vn(d) {
    try {
      return {
        metadata: await b.get(d),
        readFailed: !1
      };
    } catch {
      return { metadata: null, readFailed: !0 };
    }
  }
  async function hr(d, C) {
    const { metadata: H, readFailed: $ } = await vn(d);
    return $ ? null : H ? H.completeness === "complete" ? H.fetchedAt : null : Sn(C);
  }
  async function kr(d, C, H, $ = {}) {
    const K = await s.getDirectReplyRecords(C);
    on(d.eventId, K.map((le) => Oo(le)), vt(d, H));
    const z = await fn(K);
    if (!t() || z.length === 0)
      return !1;
    const ce = await Lr(H, z, ["reply-db"], { resolveProfiles: !$.prefetchOnly });
    if (!t() || ce.length === 0)
      return !1;
    if (!t())
      return !0;
    const Fe = await hr(C, ce);
    return t() && B(d.eventId, C, (le) => ({
      ...Fo(le, {
        visibleChildren: $.prefetchOnly ? le.visibleChildren : !0,
        lastFetchedChildrenAt: Fe
      })
    })), !0;
  }
  async function gr(d, C, H, $ = {}) {
    const K = Tn(d.eventId, C), z = te.getRequestId(), ce = te.createChildRequestToken(K), Fe = Date.now();
    B(d.eventId, C, (le) => ({
      ..._c(le, {
        showInitialLoading: !!$.showInitialLoading,
        prefetchOnly: !!$.prefetchOnly
      })
    })), await Ac({
      isActive: () => z === te.getRequestId() && te.getChildRequestToken(K) === ce && t(),
      cleanup: () => {
        te.deleteChildrenFetchTask(K), te.deleteChildRequestToken(K), Dr(d.eventId, C);
      },
      onError: y0({
        updateExpansion: (le) => B(d.eventId, C, le),
        showInitialLoading: !!$.showInitialLoading,
        prefetchOnly: !!$.prefetchOnly
      }),
      run: async ({ ensureActive: le }) => {
        if (!le())
          return;
        const Se = n();
        if (!Se) {
          B(d.eventId, C, (tt) => ({
            ...yi(tt, {
              nextError: $.showInitialLoading && !$.prefetchOnly ? "nostr_not_ready" : null
            })
          }));
          return;
        }
        const ke = x.fetchDirectReplies(Se, {
          eventId: C,
          createdAt: H.event.created_at,
          relayHints: vt(d, H),
          parents: [
            es({
              event: H.event,
              relayHints: vt(d, H)
            })
          ].filter((tt) => tt !== null),
          relayConfig: r()
        });
        te.replaceChildrenFetchTask(K, ke);
        const De = await ke.promise;
        if (te.deleteChildrenFetchTask(K), !le())
          return;
        Fc(De.status), on(d.eventId, De.events.map((tt) => tt.event), [
          ...vt(d, H),
          ...De.relayUrls
        ]);
        const $e = await Er(De.events);
        De.events.length > 0 && await c.upsertChildInteractions({
          parentEventId: C,
          events: $e,
          fetchedAt: De.status === "partial" ? null : De.fetchedAt
        });
        const at = await b.save({
          parentEventId: C,
          completeness: Hc(De.status),
          fetchedAt: De.fetchedAt,
          requestStartedAt: Fe
        }), ct = ll(at), Ct = await fn(await s.getDirectReplyRecords(C));
        if (!le())
          return;
        Ct.length > 0 && await Lr(H, Ct, ["reply-db", "fetched-child"], { resolveProfiles: !$.prefetchOnly });
        const Ve = a0({
          nextRecordsLength: Ct.length,
          resultEventsLength: De.events.length
        });
        await Dc({
          status: Ve,
          strategies: o0({
            fetchedAt: ct,
            prefetchOnly: !!$.prefetchOnly,
            updateExpansion: (tt) => {
              B(d.eventId, C, tt);
            },
            prefetchChildReplyCounts: () => {
              Ra(d, C);
            }
          })
        }), Sa({
          anchorEventId: d.eventId,
          nodeEventId: C,
          effectiveFetchedAt: ct,
          replyCount: Ct.length
        });
      }
    });
  }
  function ua(d, C) {
    re.add(Tn(d, C));
  }
  function Vn(d, C) {
    re.delete(Tn(d, C));
  }
  function ha(d, C) {
    return re.has(Tn(d, C));
  }
  function wa(d, C) {
    _e.add(Tn(d, C));
  }
  function Dr(d, C) {
    _e.delete(Tn(d, C));
  }
  function yr(d, C) {
    return _e.has(Tn(d, C));
  }
  function Na(d) {
    for (const C of _e)
      C.endsWith(`:${d}`) && _e.delete(C);
  }
  function fa(d, C) {
    if (!yr(d.eventId, C))
      return;
    const H = Tn(d.eventId, C);
    if (te.getChildRequestToken(H) !== void 0)
      return;
    const $ = L(d.eventId, C);
    Dr(d.eventId, C), !(!t() || !$.visibleChildren) && va(d, C, { force: !0 });
  }
  function pa(d, C, H) {
    const $ = Tn(d.eventId, C);
    return te.getChildRequestToken($) === void 0 && !ha(d.eventId, C) ? !1 : (H || (wa(d.eventId, C), B(d.eventId, C, (K) => ({ ...K, visibleChildren: !0 }))), !0);
  }
  function Pa(d, C) {
    return C === d.eventId ? ot(d) : a(N)[C];
  }
  async function va(d, C, H = {}) {
    const $ = Pa(d, C);
    if (!$ || pa(d, C, !!H.prefetchOnly))
      return;
    const K = L(d.eventId, C);
    await Tc({
      loading: K.loadingChildren,
      revalidating: K.revalidatingChildren,
      onInFlight: H.prefetchOnly ? () => {
      } : () => {
        B(d.eventId, C, (z) => ({ ...z, visibleChildren: !0 }));
      },
      shouldHandleLoadedState: !H.force && K.loadedChildren,
      handleLoadedState: async () => {
        if (H.prefetchOnly)
          return !0;
        const z = nt(C).length > 0;
        return B(d.eventId, C, (ce) => ({ ...ce, visibleChildren: z })), z && Ra(d, C), Ec({
          hasVisibleData: !0,
          lastFetchedAt: K.lastFetchedChildrenAt,
          ttlMs: ti
        }) && gr(d, C, $), !0;
      },
      prepareFreshLoadState: () => {
      },
      displayCachedForFreshLoad: async () => {
        const z = await kr(d, C, $, H), ce = L(d.eventId, C);
        return {
          displayedCached: z,
          lastFetchedAt: ce.lastFetchedChildrenAt
        };
      },
      force: !!H.force,
      ttlMs: ti,
      prefetchOnly: !!H.prefetchOnly,
      awaitWhenInitialLoading: !1,
      onSkipPrefetchReplyCounts: () => {
        Ra(d, C);
      },
      runRevalidate: ({ showInitialLoading: z }) => gr(d, C, $, { prefetchOnly: H.prefetchOnly, showInitialLoading: z })
    });
  }
  async function xa(d, C = {}) {
    await va(d, d.eventId, C);
  }
  async function Ra(d, C) {
    const H = Tn(d.eventId, C);
    if (!de.has(H)) {
      de.add(H);
      try {
        await Xr(d, C);
      } finally {
        de.delete(H);
      }
    }
  }
  async function Xr(d, C) {
    const H = Date.now(), $ = te.getRequestId(), K = nt(C).filter((ke) => {
      const De = L(d.eventId, ke), $e = typeof De.lastFetchedChildrenAt == "number" && H - De.lastFetchedChildrenAt < Lc;
      return !De.loadedChildren && !De.loadingChildren && !De.revalidatingChildren && !$e;
    });
    if (K.length === 0)
      return;
    for (const ke of K)
      ua(d.eventId, ke);
    const z = [];
    if (await Promise.all(K.map(async (ke) => {
      try {
        if (!t()) {
          Vn(d.eventId, ke);
          return;
        }
        const De = await Ba(d, ke), $e = L(d.eventId, ke), at = typeof $e.lastFetchedChildrenAt == "number" && Date.now() - $e.lastFetchedChildrenAt < Lc, ct = !De || $e.lastFetchedChildrenAt === null;
        ct && $ === te.getRequestId() && t() && ha(d.eventId, ke) && te.getChildRequestToken(Tn(d.eventId, ke)) === void 0 && !$e.loadingChildren && !$e.revalidatingChildren && (!$e.loadedChildren || $e.lastFetchedChildrenAt === null) && !at ? z.push(ke) : (Vn(d.eventId, ke), ct ? fa(d, ke) : Dr(d.eventId, ke));
      } catch {
        Vn(d.eventId, ke), fa(d, ke);
      }
    })), z.sort((ke, De) => Number(yr(d.eventId, De)) - Number(yr(d.eventId, ke))), z.splice(p0).forEach((ke) => {
      Vn(d.eventId, ke), fa(d, ke);
    }), !t() || z.length === 0) {
      z.forEach((ke) => {
        Vn(d.eventId, ke), fa(d, ke);
      });
      return;
    }
    const ce = [];
    for (let ke = 0; ke < z.length; ke += Oc)
      ce.push(z.slice(ke, ke + Oc));
    let Fe = 0;
    const le = Math.min(v0, ce.length), Se = async () => {
      for (; t(); ) {
        const ke = Fe;
        Fe += 1;
        const De = ce[ke];
        if (!De)
          return;
        await qa(d, De);
      }
    };
    try {
      await Promise.all(Array.from({ length: le }, () => Se()));
    } finally {
      K.forEach((ke) => Vn(d.eventId, ke));
    }
  }
  async function Ba(d, C) {
    const H = await s.getDirectReplyRecords(C), { metadata: $, readFailed: K } = await vn(C);
    if (!t())
      return !1;
    const z = await fn(H), ce = a(N)[C];
    if (!t() || !ce || z.length === 0 && !$)
      return !1;
    const Fe = await Lr(ce, z, ["reply-db"], { resolveProfiles: !1 });
    if (!t() || Fe.length === 0 && !$)
      return !1;
    const le = K ? null : $ ? $.completeness === "complete" ? $.fetchedAt : null : Sn(Fe);
    return t() && B(d.eventId, C, (Se) => ({
      ...Fo(Se, { lastFetchedChildrenAt: le })
    })), !0;
  }
  function Ua(d, C) {
    const H = new Set(C), $ = /* @__PURE__ */ new Map();
    for (const K of d) {
      if (!H.has(K.parentEventId))
        continue;
      const z = $.get(K.parentEventId) ?? [];
      z.push(K), $.set(K.parentEventId, z);
    }
    for (const K of $.values())
      K.sort((z, ce) => z.createdAt !== ce.createdAt ? z.createdAt - ce.createdAt : z.eventId.localeCompare(ce.eventId));
    return $;
  }
  function Sa(d) {
    return d.effectiveFetchedAt !== null || d.replyCount > 0 ? !1 : (B(d.anchorEventId, d.nodeEventId, (C) => ({
      ...C,
      loadedChildren: !1,
      loadingChildren: !1,
      revalidatingChildren: !1,
      childrenError: null,
      lastFetchedChildrenAt: null
    })), !0);
  }
  function Ia(d) {
    const C = { ...a(N) }, H = { ...a(Z) }, $ = { ...a(ge) }, K = { ...a(_) }, z = { ...a(ie) }, ce = { ...a(Ce) }, Fe = { ...a(X) }, le = { ...a(W) };
    let Se = !1, ke = !1, De = !1, $e = !1;
    const at = /* @__PURE__ */ new Map(), ct = (Ve) => {
      const tt = So(C[Ve.eventId], Ve);
      return C[tt.eventId] = tt, Se = !0, tt;
    }, Ct = (Ve, tt) => {
      tt && (H[Ve] = tt, ke = !0);
    };
    for (const Ve of d.targetParentIds) {
      const tt = d.anchorNodesByParentId.get(Ve);
      if (!tt)
        continue;
      const mt = ct(tt);
      Ct(mt.eventId, mt.parentEventId);
      const nn = d.reactionRecordsByParentId.get(Ve) ?? [];
      z[Ve] = Ym(nn), ce[Ve] = nn;
    }
    for (const [Ve, tt] of Object.entries(d.cachedReactionProfilesByPubkey))
      Fe[Ve] = tt;
    for (const Ve of d.targetParentIds) {
      if (!d.anchorNodesByParentId.get(Ve))
        continue;
      const mt = [], nn = [];
      for (const In of d.directReplyRecordsByParentId.get(Ve) ?? []) {
        const Et = Oo(In);
        if (qe(Et.pubkey, Et.id))
          continue;
        const na = ct(Ro({
          event: Et,
          relayUrls: Ta(In.relayUrls),
          sources: ["reply-db", "inbound-sync"]
        }));
        na.eventId !== Ve && (Ct(na.eventId, Ve), nn.push(na.eventId), mt.push(In));
      }
      at.set(Ve, nn);
      const br = d.metadataByParentId.get(Ve) ?? null, Tr = d.metadataReadFailedParentIds.has(Ve);
      if (mt.length === 0 && !br)
        continue;
      const Ie = d.postsByParentId.get(Ve);
      if (!Ie)
        continue;
      const Ye = Tn(Ie.eventId, Ve), zt = K[Ye] ?? Gi();
      K[Ye] = br?.completeness === "partial" && mt.length === 0 ? {
        ...zt,
        loadedChildren: !1,
        loadingChildren: !1,
        revalidatingChildren: !1,
        childrenError: null,
        lastFetchedChildrenAt: null
      } : Fo(zt, {
        lastFetchedChildrenAt: Tr ? null : br ? ll(br) : Sn(mt)
      }), $e = !0;
    }
    for (const [Ve, tt] of at) {
      const mt = $[Ve] ?? [];
      $[Ve] = sc(Mc([...mt, ...tt]).filter((nn) => nn !== Ve && !qn(nn)), C), De = !0;
    }
    for (const [Ve, tt] of d.knownNodeProfilesByPubkey)
      if (tt)
        for (const [mt, nn] of Object.entries(C))
          nn.authorPubkey === Ve && (C[mt] = So(nn, { ...nn, profile: tt }), Se = !0);
    for (const Ve of d.targetParentIds)
      le[Ve] = Ic(ce[Ve] ?? [], Fe);
    Se && g(N, C), ke && g(Z, H), De && g(ge, $), $e && g(_, K), g(ie, z), g(Ce, ce), g(X, Fe), g(W, le);
  }
  async function gn(d, C) {
    if (!t() || d.length === 0)
      return;
    const H = b0(d, C);
    if (H.length === 0)
      return;
    const $ = te.getRequestId(), K = !!C?.length, z = new Map(d.map((ce) => [ce.eventId, ce]));
    await kc({
      items: H,
      isActive: () => $ === te.getRequestId() && t(),
      run: async ({ ensureActive: ce }) => {
        const Fe = H.flatMap((Ie) => {
          const Ye = z.get(Ie);
          if (!Ye || !ce())
            return [];
          const zt = Tn(Ye.eventId, Ie), In = L(Ye.eventId, Ie);
          return !K && (fe.has(zt) || In.loadedChildren || In.loadingChildren || In.revalidatingChildren) ? (fe.add(zt), []) : (fe.add(zt), [{ parentEventId: Ie, post: Ye }]);
        });
        if (Fe.length === 0 || !ce())
          return;
        const le = Fe.map(({ parentEventId: Ie }) => Ie), Se = c.getChildInteractionsForParents ? await c.getChildInteractionsForParents(le) : (await Promise.all(le.map(async (Ie) => {
          const [Ye, zt] = await Promise.all([
            Xm(Ie, l),
            s.getDirectReplyRecords(Ie)
          ]);
          return [...Ye, ...zt];
        }))).flat();
        if (!ce())
          return;
        let ke = [];
        const De = /* @__PURE__ */ new Set();
        try {
          b.getForParentEventIds ? ke = await b.getForParentEventIds(le) : ke = (await Promise.all(le.map((Ye) => vn(Ye)))).flatMap(({ metadata: Ye, readFailed: zt }, In) => zt ? (De.add(le[In]), []) : Ye ? [Ye] : []);
        } catch {
          for (const Ie of le)
            De.add(Ie);
        }
        if (!ce())
          return;
        const $e = Ua(await fn(Se), le);
        if (!ce())
          return;
        const at = new Map(Fe.map(({ parentEventId: Ie, post: Ye }) => [Ie, Ae(Ye)])), ct = /* @__PURE__ */ new Map(), Ct = /* @__PURE__ */ new Map(), Ve = [], tt = /* @__PURE__ */ new Set(), mt = /* @__PURE__ */ new Map(), nn = (Ie, Ye) => {
          mt.set(Ie, Ta([...mt.get(Ie) ?? [], ...Ye]));
        };
        for (const Ie of le) {
          const Ye = at.get(Ie);
          if (!Ye)
            continue;
          nn(Ye.authorPubkey, Ye.relayUrls);
          const zt = [], In = [];
          for (const Et of $e.get(Ie) ?? [])
            Et.kind === 7 ? (zt.push(Et), Et.authorPubkey && (tt.add(Et.authorPubkey), nn(Et.authorPubkey, Ye.relayUrls))) : (Et.kind === 1 || Et.kind === 42) && ($c({ parentNode: Ye, record: Et }) ? (In.push(Et), nn(Et.authorPubkey, Et.relayUrls)) : Ve.push(Et.eventId));
          ct.set(Ie, zt), Ct.set(Ie, In);
        }
        if (Ve.length > 0 && (await Promise.all(Ve.map((Ie) => c.deleteChildInteractionByEventId(Ie))), !ce()))
          return;
        const br = tt.size > 0 ? await au.getProfiles(Array.from(tt), { allowBackgroundRefresh: !1 }) : {};
        if (!ce())
          return;
        const Tr = /* @__PURE__ */ new Map();
        for (const [Ie, Ye] of mt)
          Tr.set(Ie, w.ensureProfile(Ie, Ye));
        Ia({
          postsByParentId: z,
          targetParentIds: le,
          anchorNodesByParentId: at,
          reactionRecordsByParentId: ct,
          directReplyRecordsByParentId: Ct,
          metadataByParentId: new Map(ke.map((Ie) => [Ie.parentEventId, Ie])),
          metadataReadFailedParentIds: De,
          cachedReactionProfilesByPubkey: br,
          knownNodeProfilesByPubkey: Tr
        });
      }
    });
  }
  async function qa(d, C) {
    const H = C.map(($e) => a(N)[$e]).filter(($e) => !!$e);
    if (H.length === 0)
      return;
    const $ = te.getRequestId(), K = Date.now(), z = /* @__PURE__ */ new Map(), ce = /* @__PURE__ */ new Map();
    let Fe = !1, le = !1;
    const Se = `${d.eventId}:children-prefetch:${C.join(",")}`, ke = () => Fe || $ !== te.getRequestId() || !t() ? !1 : C.every(($e) => ha(d.eventId, $e) && te.getChildRequestToken(Tn(d.eventId, $e)) === z.get($e)), De = ($e) => {
      for (const at of C)
        xh({
          updateExpansion: (ct) => B(d.eventId, at, ct),
          showInitialLoading: !1,
          prefetchOnly: !0,
          errorCode: $e
        });
    };
    await kc({
      items: C,
      isActive: ke,
      prepareItem: ($e) => {
        const at = Tn(d.eventId, $e), ct = te.createChildRequestToken(at);
        return z.set($e, ct), B(d.eventId, $e, (Ct) => ({
          ..._c(Ct, { showInitialLoading: !1, prefetchOnly: !0 })
        })), ct;
      },
      completeBatch: ($e) => {
        if ($e && ke())
          for (const at of C)
            B(d.eventId, at, (ct) => ({
              ...Fo(ct, {
                loadedChildren: $e && ((ce.get(at) ?? null) !== null || nt(at).length > 0),
                revalidatingChildren: !1,
                lastFetchedChildrenAt: ce.get(at) ?? null
              })
            }));
      },
      cleanupItem: ($e, at) => {
        const ct = Tn(d.eventId, $e);
        te.getChildRequestToken(ct) === at && te.deleteChildRequestToken(ct), Vn(d.eventId, $e), le || Fe ? Dr(d.eventId, $e) : fa(d, $e);
      },
      cleanup: () => {
        te.deleteChildrenFetchTask(Se);
      },
      onError: () => {
        De("fetch_failed");
      },
      run: async ({ ensureActive: $e }) => {
        if (!$e())
          return;
        const at = n();
        if (!at) {
          De("nostr_not_ready");
          return;
        }
        const ct = _t(d, H), Ct = x.fetchDirectReplies(at, {
          eventId: C[0] ?? "",
          eventIds: C,
          createdAt: Math.min(...H.map((Ie) => Ie.event.created_at)),
          relayHints: ct,
          parents: H.map((Ie) => es({
            event: Ie.event,
            relayHints: [
              ...Ie.relayUrls,
              ...ns(Ie.event).relayHints
            ]
          })).filter((Ie) => Ie !== null),
          relayConfig: r()
        });
        te.replaceChildrenFetchTask(Se, Ct);
        const Ve = await Ct.promise;
        if (te.deleteChildrenFetchTask(Se), !$e())
          return;
        if (Ve.status === "cancelled") {
          Fe = !0;
          for (const Ie of C)
            B(d.eventId, Ie, (Ye) => ({
              ...yi(Ye, { nextError: Ye.childrenError })
            }));
          return;
        }
        Fc(Ve.status);
        const tt = new Set(C), mt = Ve.events.filter((Ie) => tt.has(Ie.parentEventId) && Ie.event.id !== Ie.parentEventId);
        mt.length > 0 && await on(d.eventId, mt.map((Ie) => Ie.event), [...ct, ...Ve.relayUrls], `children-prefetch:${C.join(",")}`);
        const nn = await Er(mt);
        if (!$e())
          return;
        const br = /* @__PURE__ */ new Map(), Tr = new Map(mt.map((Ie) => [Ie.event.id, Ie.parentEventId]));
        for (const Ie of nn) {
          const Ye = Tr.get(Ie.event.id);
          if (!Ye || !tt.has(Ye))
            continue;
          const zt = br.get(Ye) ?? [];
          zt.push(Ie), br.set(Ye, zt);
        }
        for (const Ie of C) {
          const Ye = br.get(Ie) ?? [];
          if (Ye.length > 0 && await c.upsertChildInteractions({
            parentEventId: Ie,
            events: Ye,
            fetchedAt: Ve.status === "partial" ? null : Ve.fetchedAt
          }), !$e())
            return;
          const zt = await b.save({
            parentEventId: Ie,
            completeness: Hc(Ve.status),
            fetchedAt: Ve.fetchedAt,
            requestStartedAt: K
          });
          ce.set(Ie, ll(zt));
          const In = await fn(await s.getDirectReplyRecords(Ie)), Et = a(N)[Ie];
          Et && await Lr(Et, In, ["reply-db", "fetched-child"], { resolveProfiles: !1 });
        }
        $e() && (le = !0);
      }
    });
  }
  async function Lr(d, C, H, $ = {}) {
    const K = d.eventId, z = [], ce = [], Fe = $.resolveProfiles !== !1;
    for (const le of C) {
      const Se = Oo(le);
      if (!$c({ parentNode: d, record: le })) {
        await c.deleteChildInteractionByEventId(le.eventId);
        continue;
      }
      if (qe(Se.pubkey, Se.id))
        continue;
      const ke = Fe ? await We({ event: Se, relayUrls: le.relayUrls, sources: H }) : oe({
        event: Se,
        relayUrls: Ta(le.relayUrls),
        sources: H
      });
      Fe || he(Se.pubkey, Ta(le.relayUrls)), ke.eventId !== K && (pe(ke.eventId, K), z.push(ke.eventId), ce.push(le));
    }
    return V(K, z), ce;
  }
  function Es(d) {
    Va(d.eventId, d.eventId);
  }
  function Va(d, C) {
    Dr(d, C), B(d, C, (H) => ({ ...H, visibleChildren: !1 }));
  }
  function is(d) {
    if (L(d.eventId, d.eventId).visibleChildren) {
      Es(d);
      return;
    }
    xa(d);
  }
  function ea(d) {
    xa(d, { force: !0 });
  }
  function _a(d, C) {
    if (L(d.eventId, C).visibleChildren) {
      Va(d.eventId, C);
      return;
    }
    va(d, C);
  }
  function ga(d, C) {
    va(d, C, { force: !0 });
  }
  async function ls(d, C = []) {
    if (!d?.id || d.kind !== 1 && d.kind !== 42)
      return !0;
    const H = ns(d), $ = H.parentId;
    if (!$)
      return !0;
    const K = C.find((De) => De.eventId === $) ?? null, z = Object.keys(a(_)).filter((De) => De.endsWith(`:${$}`));
    if (!K && z.length === 0)
      return !1;
    const ce = i.getTargetSnapshot($), Fe = K ? a(N)[$] ?? Ro({
      event: Cl(K),
      relayUrls: Ta([
        ...K.relayHints,
        ...K.acceptedRelays,
        ...K.fetchedRelays ?? []
      ]),
      sources: ["history-record"]
    }) : a(N)[$] ?? (ce?.status === "resolved" && ce.event ? Ro({
      event: ce.event,
      relayUrls: ce.relayHints,
      sources: ["fetched-parent"]
    }) : null);
    if (!Fe)
      return !1;
    const le = es({ event: Fe.event, relayHints: Fe.relayUrls });
    if (!le || !ws({ child: d, parent: le }).valid || (await Rn([d])).length === 0)
      return !1;
    await c.upsertChildInteractions({
      parentEventId: $,
      events: [{ event: d, relayUrls: H.relayHints }]
    });
    const Se = await fn(await s.getDirectReplyRecords($));
    if (!t())
      return !1;
    await Lr(Fe, Se, ["reply-db", "posted-reply"]);
    const ke = (De, $e) => {
      B(De, $e, (at) => ({
        ...at,
        loadedChildren: !0,
        loadingChildren: !1,
        childrenError: null
      }));
    };
    K && ke(K.eventId, K.eventId);
    for (const De of z) {
      const $e = De.indexOf(":");
      $e < 0 || ke(De.slice(0, $e), De.slice($e + 1));
    }
    return !0;
  }
  async function ds(d) {
    !d.eventId || !d.authorPubkey || (Na(d.eventId), wn(d.authorPubkey, d.eventId), Tt(d.eventId), Pn(d.eventId, d.authorPubkey, { revealKnownParent: !0 }), d.deletionEvent && await u.upsertValidDeletionRequests({
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
  ze(() => {
    t() && g(Re, i.getScopeRevision(J), !0);
  }), ze(() => {
    if (t()) {
      a(Re);
      for (const d of Object.keys(a(_))) {
        const [C, H] = d.split(":"), K = a(N)[H]?.parentEventId;
        if (!K)
          continue;
        const z = i.getTargetSnapshot(K);
        z?.status === "deleted" && (L(C, H).parentDeleted || (z.authorPubkey && (wn(z.authorPubkey, K), Pn(K, z.authorPubkey, { revealKnownParent: !0 })), rt(C, H)));
      }
    }
  });
  function mr() {
    te.cancelAndClearFetchTasks(), te.clearChildRequestTokens(), re.clear(), _e.clear(), m && w.reset(), Ee.clearAll();
  }
  function ta() {
    mr(), O && i.reset(), te.incrementRequestId(), g(N, {}), g(Z, {}), g(ge, {}), g(_, {}), g(se, {}), g(ie, {}), g(Ce, {}), g(X, {}), fe.clear(), de.clear();
  }
  return ze(() => {
    t() || ta();
  }), ze(() => {
    if (t())
      return () => {
        mr();
      };
  }), io(() => {
    i.invalidateScope(J), mr(), Le(), O && i.reset(), m && w.dispose();
  }), {
    getAnchorState: $n,
    toggleParent: ur,
    retryParent: Nn,
    toggleNodeParent: Ar,
    retryNodeParent: Zr,
    toggleChildren: is,
    retryChildren: ea,
    toggleNodeChildren: _a,
    retryNodeChildren: ga,
    recordPostedReply: ls,
    recordDeletedEvent: ds,
    loadCachedChildInteractionStateForPosts: gn,
    cancelCurrentGraphFetches: mr,
    resetState: ta
  };
}
function Bc(t) {
  return !!t && typeof t.use == "function";
}
function w0({
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
  function p() {
    b += 1, u?.cancel(), u = null, c.status = "idle";
  }
  async function y(f) {
    const S = e(), w = n();
    if (!t() || !S || !Bc(w) || o().length === 0)
      return;
    if (f === "dialog-open-refresh") {
      const J = await $d.get(S);
      if (typeof J?.lastDialogRefreshAt == "number" && Date.now() - J.lastDialogRefreshAt < gf)
        return;
    }
    p();
    const m = ++b;
    c.status = "syncing";
    const i = f === "dialog-open-refresh" ? lu.runInbound(w, {
      ownerPubkeyHex: S,
      relayConfig: r(),
      reason: f,
      reconcileDirectReplyCandidates: l
    }) : {
      ...yf.syncRecent(w, {
        ownerPubkeyHex: S,
        relayConfig: r(),
        reason: f,
        reconcileDirectReplyCandidates: l
      }),
      joinedExisting: !1
    };
    u = i;
    const O = await i.promise;
    m !== b || u !== i || !t() || e() !== S || (u = null, c.status = "idle", !(i.joinedExisting || O.status === "cancelled" || O.changedParentEventIds.length === 0) && (await s(O.changedParentEventIds), Tl({
      source: "dialog-inbound-sync",
      parentEventIds: O.changedParentEventIds,
      rxNostr: w,
      relayConfig: r(),
      isActive: () => t() && e() === S && n() === w
    }).then((J) => {
      if (!(J.status === "cancelled" || J.deletedReactionEventIds.length === 0 && J.deletedReplyEventIds.length === 0 || !t() || e() !== S || n() !== w))
        return Promise.resolve(s(O.changedParentEventIds)).catch(() => {
        });
    }).catch(() => {
    })));
  }
  async function x() {
    const f = e();
    if (!f)
      return;
    const S = await $d.get(f);
    await y(S?.lastSyncedAt ? "dialog-open-refresh" : "initial-dialog-bootstrap");
  }
  return ze(() => {
    const f = e() ?? null;
    f !== c.activePubkeyHex && (p(), c.activePubkeyHex = f, c.hasStartedInitialDialogBootstrap = !1);
  }), ze(() => {
    if (!t()) {
      p(), c.hasStartedInitialDialogBootstrap = !1;
      return;
    }
    !e() || !Bc(n()) || o().length === 0 || c.hasStartedInitialDialogBootstrap || (c.hasStartedInitialDialogBootstrap = !0, x());
  }), { state: c, cancelCurrentSync: p, runSync: y };
}
function P0(t) {
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
function Uc(t) {
  return t.direction === "older" ? t.isSearchMode ? "postHistory.loadOlderSearchResults" : "postHistory.loadOlder" : t.isSearchMode ? "postHistory.loadNewerSearchResults" : "postHistory.loadNewer";
}
function x0(t) {
  return t.status === "loading" ? { key: "postHistory.checkingReplies" } : t.status === "failed" ? { key: "postHistory.recheckReplies" } : t.status === "loaded" ? t.replyCount === 0 ? { key: "postHistory.recheckReplies" } : t.visible ? { key: "postHistory.hideReplies" } : {
    key: "postHistory.showRepliesWithCount",
    values: {
      count: t.replyCount
    }
  } : { key: "postHistory.checkReplies" };
}
function R0(t) {
  return t.visible ? { key: "postHistory.hideReactions" } : {
    key: "postHistory.showReactionsWithCount",
    values: {
      count: t.reactionCount
    }
  };
}
function S0(t) {
  return t === "+";
}
const I0 = 1024 * 1024, _0 = 100, E0 = {
  status: "valid",
  ruleVersion: Si
}, dl = {
  status: "invalid",
  ruleVersion: Si
};
function A0(t) {
  return t?.ruleVersion === Si && (t.status === "valid" || t.status === "invalid");
}
function Ih(t) {
  return t?.status === "valid" && t.ruleVersion === Si;
}
function _h(t) {
  if (Ii(t))
    try {
      return `nostr:${Ll(t)}\0${t.id}\0${t.sig}`;
    } catch {
    }
  try {
    return `raw:${JSON.stringify(t)}`;
  } catch {
    return "raw:unserializable";
  }
}
function k0(t) {
  if (!Ii(t))
    return { ...dl };
  try {
    const e = Af(t);
    return Fl(e) && Ll(e) === e.id && kf(e) ? { ...E0 } : { ...dl };
  } catch {
    return { ...dl };
  }
}
async function qc(t, e) {
  for (const { id: n, fingerprint: r, verification: o } of t) {
    const s = await e.get(n);
    !s || _h(s.rawEvent) !== r || await e.update(n, {
      rawEventVerification: o
    });
  }
}
function D0(t, e) {
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
async function T0(t, e, n, r) {
  const o = [
    ...t.map((y) => ({ type: "post", record: y })),
    ...e.map((y) => ({ type: "deletion", record: y }))
  ].filter((y) => !A0(y.record.rawEventVerification)), s = o.length;
  if (s === 0)
    return;
  let l = 0;
  const c = /* @__PURE__ */ new Map(), u = [], b = [];
  async function p() {
    if (u.length > 0) {
      const y = u.splice(0), x = () => qc(y, n.post);
      await (n.transaction?.post ?? (async (f) => f()))(x);
    }
    if (b.length > 0) {
      const y = b.splice(0), x = () => qc(y, n.deletion);
      await (n.transaction?.deletion ?? (async (f) => f()))(x);
    }
  }
  r?.({ phase: "verifying", processed: l, total: s });
  for (const y of o) {
    const x = _h(y.record.rawEvent), f = c.get(x) ?? k0(y.record.rawEvent);
    c.set(x, f), y.record.rawEventVerification = f;
    const S = { id: y.record.id, fingerprint: x, verification: f };
    y.type === "post" ? u.push(S) : b.push(S), l += 1, l % _0 === 0 && (await p(), r?.({ phase: "verifying", processed: l, total: s }));
  }
  await p(), r?.({ phase: "verifying", processed: s, total: s });
}
function Eh(t, e) {
  if (!Ii(t) || t.kind !== e)
    return !1;
  try {
    return Fl(t) && Ll(t) === t.id;
  } catch {
    return !1;
  }
}
function Vc(t) {
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
function jc(t, e) {
  return t.created_at !== e.created_at ? t.created_at - e.created_at : t.id === e.id ? 0 : t.id < e.id ? -1 : 1;
}
function M0(t) {
  return t.rawEvent !== null && t.rawEvent !== void 0;
}
function O0(t, e, n) {
  return !Ih(t.rawEventVerification) || !Eh(e, 5) || e.pubkey !== n || t.targetAuthorPubkey !== n || t.deletionEventPubkey !== n || e.id !== t.deletionEventId ? !1 : hu(e).includes(t.targetEventId);
}
function L0() {
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
function F0(t, e) {
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
    r.length > 0 && r.length + s.length > I0 && (n.push(r), r = ""), r += s;
  }
  return r.length > 0 && n.push(r), {
    blob: new Blob(n, { type: "application/x-ndjson;charset=utf-8" }),
    ...e ? { jsonl: n.join("") } : {}
  };
}
async function H0(t, e, n, r = {}) {
  const o = L0(), s = [], l = [], c = /* @__PURE__ */ new Set(), u = /* @__PURE__ */ new Set(), b = /* @__PURE__ */ new Set(), p = e.filter((m) => m.pubkeyHex === t), y = n.filter(
    (m) => m.targetAuthorPubkey === t
  );
  for (const m of p)
    if (!(m.kind !== 1 && m.kind !== 42)) {
      if (!Ih(m.rawEventVerification) || !gu(m.rawEvent, m) || !Eh(m.rawEvent, m.kind)) {
        o.skippedPostCount += 1;
        continue;
      }
      s.push(Vc(m.rawEvent)), c.add(m.eventId), o.exportedPostEventCount += 1;
    }
  const x = /* @__PURE__ */ new Map();
  for (const m of y) {
    const i = x.get(m.deletionEventId) ?? [];
    i.push(m), x.set(m.deletionEventId, i);
  }
  for (const m of x.values()) {
    const i = m.find((O) => O0(O, O.rawEvent, t));
    if (i) {
      const O = Vc(i.rawEvent);
      l.push(O);
      for (const J of hu(O))
        u.add(J);
      o.exportedDeletionEventCount += 1;
      continue;
    }
    for (const O of m)
      b.add(O.targetEventId);
    m.every((O) => !M0(O)) ? o.missingDeletionRawEventCount += 1 : o.invalidDeletionRawEventCount += 1;
  }
  const f = /* @__PURE__ */ new Set();
  for (const m of p)
    m.kind !== 1 && m.kind !== 42 || m.deletedAt === void 0 || !c.has(m.eventId) || u.has(m.eventId) || b.has(m.eventId) || f.add(m.eventId);
  o.missingDeletionRawEventCount += f.size, s.sort(jc), l.sort(jc);
  const S = [...s, ...l];
  o.exportedEventCount = S.length, o.isPartial = o.skippedPostCount > 0 || o.missingDeletionRawEventCount > 0 || o.invalidDeletionRawEventCount > 0, r.onProgress?.({ phase: "creating" });
  const w = F0(S, r.includeJsonl === !0);
  return { result: o, ...w };
}
async function $0(t) {
  const e = t.postRecords.filter(
    (o) => o.pubkeyHex === t.pubkeyHex
  ), n = t.deletionRecords.filter(
    (o) => o.targetAuthorPubkey === t.pubkeyHex
  ), r = t.verificationStores ?? D0(e, n);
  return await T0(
    e,
    n,
    r,
    t.onProgress
  ), H0(
    t.pubkeyHex,
    e,
    n,
    t
  );
}
function Kc() {
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
class N0 {
  postHistoryRepository;
  deletionRequestsRepository;
  workerFactory;
  constructor(e = {}) {
    this.postHistoryRepository = e.postHistoryRepository ?? it, this.deletionRequestsRepository = e.deletionRequestsRepository ?? oo, this.workerFactory = e.workerFactory ?? (() => new Worker(
      new URL(
        /* @vite-ignore */
        "" + new URL("postHistoryJsonlExportWorker-Dk1faqZu.js", import.meta.url).href,
        import.meta.url
      ),
      { type: "module" }
    ));
  }
  exportForPubkeyInWorker(e, n = {}) {
    if (!e) {
      const { jsonl: r, ...o } = Kc();
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
      }, u = (p) => {
        l || (l = !0, c(), o(p));
      }, b = () => u(new DOMException("Export aborted", "AbortError"));
      if (n.signal?.aborted) {
        b();
        return;
      }
      n.signal?.addEventListener("abort", b, { once: !0 }), s.onmessage = (p) => {
        const y = p.data;
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
      return Kc();
    const [n, r] = await Promise.all([
      this.postHistoryRepository.getAll({ pubkeyHex: e }),
      this.deletionRequestsRepository.getAllForTargetAuthorPubkey(e)
    ]), o = await $0({
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
const B0 = new N0();
var U0 = j('<div class="xmark-icon svg-icon svelte-uxr0i8"></div>'), q0 = j('<h3 class="post-history-current-month-heading svelte-uxr0i8"><button type="button" class="post-history-current-month svelte-uxr0i8"> </button></h3>'), V0 = j('<div class="post-history-heading-summary svelte-uxr0i8"><div class="post-history-summary-row svelte-uxr0i8"><span class="post-history-summary-line post-history-summary-count svelte-uxr0i8"> </span></div></div>'), j0 = j('<div class="more-icon svg-icon"></div>'), K0 = j('<div class="search-icon svg-icon svelte-uxr0i8" aria-hidden="true"></div> <span class="svelte-uxr0i8"> </span>', 1), Y0 = j('<div class="repair-icon svg-icon svelte-uxr0i8" aria-hidden="true"></div> <span class="svelte-uxr0i8"> </span>', 1), z0 = j('<div class="return-to-latest-icon svg-icon" aria-hidden="true"></div> <span class="svelte-uxr0i8"> </span>', 1), Q0 = j('<div class="calendar-icon svg-icon" aria-hidden="true"></div> <span class="svelte-uxr0i8"> </span>', 1), W0 = j('<div class="jump-to-oldest-icon svg-icon" aria-hidden="true"></div> <span class="svelte-uxr0i8"> </span>', 1), J0 = j('<div class="export-icon svg-icon" aria-hidden="true"></div> <span class="svelte-uxr0i8"> </span>', 1), G0 = j('<div class="import-icon svg-icon svelte-uxr0i8" aria-hidden="true"></div> <span class="svelte-uxr0i8"> </span>', 1), Z0 = j('<div class="trash-icon svg-icon" aria-hidden="true"></div> <span class="svelte-uxr0i8"> </span>', 1), X0 = j('<div class="post-history-menu-body svelte-uxr0i8"><!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!></div>'), eb = j("<!> <!>", 1), tb = j('<div class="search-icon svg-icon svelte-uxr0i8"></div>'), nb = j('<div class="xmark-icon svg-icon svelte-uxr0i8" aria-hidden="true"></div>'), rb = j('<div class="post-history-search-row svelte-uxr0i8"><div><div class="post-history-search-leading svelte-uxr0i8" aria-hidden="true"><!></div> <input class="post-history-search-input svelte-uxr0i8" type="search"/></div> <!></div>'), ab = j('<div class="calendar-icon svg-icon" aria-hidden="true"></div>'), sb = j('<span class="post-history-date-picker-nav-icon post-history-date-picker-nav-icon-left svg-icon svelte-uxr0i8" aria-hidden="true"></span>'), ob = j('<span class="post-history-date-picker-nav-icon post-history-date-picker-nav-icon-right svg-icon svelte-uxr0i8" aria-hidden="true"></span>'), ib = j('<button type="button" class="post-history-date-picker-year-nav svelte-uxr0i8" aria-label="Previous year"><span class="post-history-date-picker-year-nav-icon post-history-date-picker-year-nav-icon-left svg-icon svelte-uxr0i8" aria-hidden="true"></span></button> <!> <!> <!> <button type="button" class="post-history-date-picker-year-nav svelte-uxr0i8" aria-label="Next year"><span class="post-history-date-picker-year-nav-icon post-history-date-picker-year-nav-icon-right svg-icon svelte-uxr0i8" aria-hidden="true"></span></button>', 1), lb = j("<!> <!>", 1), db = j("<!> <!>", 1), cb = j("<!> <!> <!>", 1), ub = j('<div class="jump-icon svg-icon svelte-uxr0i8" aria-hidden="true"></div>'), hb = j('<div class="xmark-icon svg-icon svelte-uxr0i8" aria-hidden="true"></div>'), fb = j('<div class="post-history-utility-panel svelte-uxr0i8"><div class="post-history-utility-label svelte-uxr0i8" id="post-history-jump-date-label"> </div> <div class="post-history-utility-controls svelte-uxr0i8"><!> <!> <!></div></div>'), pb = j('<div class="post-history-list-loading svelte-uxr0i8" aria-hidden="true"><!></div>'), vb = j('<div class="empty-state svelte-uxr0i8"><div class="empty-message svelte-uxr0i8"> </div></div>'), gb = j('<div class="keyboard-arrow-up-icon svg-icon" aria-hidden="true"></div> ', 1), yb = j('<div class="post-history-nav-row post-history-nav-row-top svelte-uxr0i8"><!></div>'), mb = j('<div class="post-history-auto-load-sentinel post-history-auto-load-newer-sentinel svelte-uxr0i8" aria-hidden="true"><!></div>'), bb = j('<div class="post-history-channel-row svelte-uxr0i8"><span class="channel-icon svg-icon svelte-uxr0i8" aria-hidden="true"></span> <span class="channel-label svelte-uxr0i8"> </span> <span class="channel-name svelte-uxr0i8"> </span></div>'), Cb = j('<span class="deleted-badge svelte-uxr0i8"> </span>'), wb = j('<span class="delete-failed svelte-uxr0i8"> </span>'), Pb = j('<div class="post-meta-inline svelte-uxr0i8"><!> <!></div>'), xb = j('<div class="more-icon svg-icon"></div>'), Rb = j('<div class="calendar-icon svg-icon" aria-hidden="true"></div> <span class="svelte-uxr0i8"> </span>', 1), Sb = j("<!> <!>", 1), Ib = j('<div class="post-history-menu-body svelte-uxr0i8"><div class="post-history-menu-timestamp"> </div> <!> <!> <!></div>'), _b = j("<!> <!>", 1), Eb = j('<span class="svelte-uxr0i8"> </span> <!>', 1), Ab = j('<div class="post-preview-header svelte-uxr0i8"><!> <div class="post-preview-header-right svelte-uxr0i8"><!> <!></div></div>'), kb = j('<div class="post-preview-quotes svelte-uxr0i8"></div>'), Db = j('<div class="reply-icon svg-icon" aria-hidden="true"></div>'), Tb = j('<div class="quote-icon svg-icon" aria-hidden="true"></div>'), Mb = j('<div class="favorite-icon svg-icon svelte-uxr0i8" aria-hidden="true"></div> <span class="svelte-uxr0i8"> </span>', 1), Ob = j('<div class="post-preview-action-buttons-group svelte-uxr0i8"><!> <div class="post-preview-footer-replies-slot svelte-uxr0i8"><!></div></div> <!> <div class="post-preview-footer-reaction-slot svelte-uxr0i8"><!></div>', 1), Lb = j('<div class="open-in-new-icon svg-icon" aria-hidden="true"></div> <span class="svelte-uxr0i8"> </span>', 1), Fb = j('<div aria-hidden="true"></div> <span class="svelte-uxr0i8"> </span>', 1), Hb = j('<div class="calendar-icon svg-icon" aria-hidden="true"></div> <span class="svelte-uxr0i8"> </span>', 1), $b = j("<!> <!> <!> <!> <!>", 1), Nb = j('<div class="favorite-icon svg-icon post-preview-reaction-symbol svelte-uxr0i8" aria-hidden="true"></div>'), Bb = j('<span class="post-preview-reaction-content svelte-uxr0i8"> </span>'), Ub = j('<img class="post-preview-reaction-emoji" draggable="false" loading="lazy" decoding="async"/>'), qb = j('<span class="post-preview-reaction-emoji-placeholder svelte-uxr0i8" aria-hidden="true"></span>'), Vb = j('<span class="post-preview-reaction-emoji-slot svelte-uxr0i8"><!></span>'), jb = j('<span class="post-preview-reaction-content svelte-uxr0i8"> </span>'), Kb = j('<span class="post-preview-reaction-actor svelte-uxr0i8"><!></span>'), Yb = j('<div class="post-preview-reaction-chip svelte-uxr0i8"><div class="post-preview-reaction-summary svelte-uxr0i8"><!> <span class="post-preview-reaction-count svelte-uxr0i8"> </span></div> <div class="post-preview-reaction-actors svelte-uxr0i8"></div></div>'), zb = j('<div class="post-preview-reactions-panel svelte-uxr0i8"></div>'), Qb = j("<!> <!>", 1), Wb = j('<span class="deleted-badge svelte-uxr0i8"> </span>'), Jb = j('<span class="delete-failed svelte-uxr0i8"> </span>'), Gb = j('<div class="post-meta svelte-uxr0i8"><!> <!></div>'), Zb = j('<li><div class="post-history-main svelte-uxr0i8"><div class="post-preview svelte-uxr0i8"><!> <!> <div class="post-history-thread-anchor-post svelte-uxr0i8"><div class="post-preview-body svelte-uxr0i8"><!> <!></div> <!> <!></div></div> <!></div></li>'), Xb = j('<div class="post-history-auto-load-sentinel svelte-uxr0i8" aria-hidden="true"><!></div>'), eC = j('<div class="post-history-sparse-state svelte-uxr0i8" role="status"><p class="svelte-uxr0i8"> </p> <p class="svelte-uxr0i8"> </p></div>'), tC = j('<div class="cloud-download-icon svg-icon" aria-hidden="true"></div> ', 1), nC = j('<div class="keyboard-arrow-down-icon svg-icon" aria-hidden="true"></div> ', 1), rC = j('<div class="post-history-saved-boundary svelte-uxr0i8" role="status"><div class="post-history-saved-boundary-actions svelte-uxr0i8"><!> <!></div></div>'), aC = j('<div class="keyboard-arrow-down-icon svg-icon" aria-hidden="true"></div> ', 1), sC = j('<div class="post-history-nav-row post-history-nav-row-bottom svelte-uxr0i8"><!></div>'), oC = j('<div class="keyboard-arrow-down-icon svg-icon" aria-hidden="true"></div> ', 1), iC = j('<div class="post-history-nav-row post-history-nav-row-bottom svelte-uxr0i8"><!></div>'), lC = j('<div class="cloud-download-icon svg-icon" aria-hidden="true"></div> ', 1), dC = j('<div class="post-history-exhausted-state svelte-uxr0i8"><!></div>'), cC = j('<!> <!> <ul class="post-history-list svelte-uxr0i8"></ul> <!> <!> <!>', 1), uC = j('<div class="vertical-align-top-icon svg-icon" aria-hidden="true"></div>'), hC = j('<div class="post-history-latest-row svelte-uxr0i8"><!></div>'), fC = j('<div class="post-history-heading svelte-uxr0i8"><div class="post-history-heading-main svelte-uxr0i8"><!></div> <div class="post-history-heading-actions svelte-uxr0i8"><!> <!> <!></div></div> <!> <!> <div><!></div> <!> <!> <!>', 1), pC = j('<div class="delete-confirm-body svelte-uxr0i8"><p class="delete-confirm-description svelte-uxr0i8"> </p> <p class="delete-confirm-warning svelte-uxr0i8"> </p></div>'), vC = j('<div class="delete-confirm-body svelte-uxr0i8"><p class="delete-confirm-description svelte-uxr0i8"> </p></div>'), gC = j("<div> </div>"), yC = j("<div> </div>"), mC = j("<div> </div>"), bC = j("<!> <!> <!> <!> <!> <!> <!>", 1);
const CC = {
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
function wC(t, e) {
  Ot(e, !0), $a(t, CC);
  const n = () => xs(Pf, "$locale", o), r = () => xs(Bs, "$_", o), [o, s] = Ns(), l = vu().overlayTarget, c = 18, u = 200;
  let b = A(e, "show", 15, !1), p = A(e, "onClose", 7), y = A(e, "onReplyPost", 7, void 0), x = A(e, "onQuotePost", 7, void 0), f = A(e, "pubkeyHex", 7, null), S = A(e, "rxNostr", 7, void 0), w = A(e, "relayConfig", 7, null), m = A(e, "latestPostedEvent", 7, null), i = A(e, "inboundInteractionSave", 7, null), O = A(e, "authoredSelfPostSave", 7, null), J = A(e, "reconcileInboundDirectReplyCandidates", 7, void 0), N = A(e, "notifySavedAuthoredPosts", 7, void 0);
  const Z = Sd({ getShow: () => b(), getRxNostr: () => S() }), ge = Id({
    getShow: () => b(),
    getRxNostr: () => S(),
    getRelayConfig: () => w(),
    profileSyncCoordinator: Z
  }), _ = _m({
    getShow: () => b(),
    getPubkeyHex: () => f(),
    getRxNostr: () => S(),
    getRelayConfig: () => w(),
    getSessionScrollState: () => Ue.readCurrentSessionScrollState(),
    onSessionScrollStateInvalidated: () => Ue.clearAllSessionScrollAnchorsForCurrentPubkey(),
    onSavedAuthoredPosts: async (h) => {
      await N()?.(h);
    },
    onChildInteractionBadgeRefreshRequested: (h, U) => fe.loadCachedChildInteractionStateForPosts(h, U),
    onQuoteVisibleRangeRefreshRequested: (h) => Re.refreshQuotePreviews(h),
    quoteVisibleRangeRepairExecutor: async (h, U) => {
      const Pe = Ee(U.visiblePosts);
      Pe.length !== 0 && await ge.ensureTargets(Pe);
    },
    pageSize: ou
  }), se = ty({
    getShow: () => b(),
    getPosts: () => _.posts,
    getRxNostr: () => S(),
    getRelayConfig: () => w(),
    getIsSearchMode: () => _.isSearchMode
  }), Re = by({
    getShow: () => b(),
    getPosts: () => _.posts,
    getRxNostr: () => S(),
    getRelayConfig: () => w(),
    relatedTargetResolver: ge,
    profileSyncCoordinator: Z
  });
  function Ee(h) {
    const U = Os.buildIndex(h);
    return Object.values(U.contextsByEventId).map((Pe) => Os.toDescriptor(Pe, "post-history-listing-quote-visible-range-repair"));
  }
  const fe = C0({
    getShow: () => b(),
    getPubkeyHex: () => f(),
    getRxNostr: () => S(),
    getRelayConfig: () => w(),
    relatedTargetResolver: ge,
    profileSyncCoordinator: Z
  });
  w0({
    getShow: () => b(),
    getPubkeyHex: () => f(),
    getRxNostr: () => S(),
    getRelayConfig: () => w(),
    getPosts: () => _.posts,
    onSavedInboundInteractions: (h) => fe.loadCachedChildInteractionStateForPosts(_.posts, h),
    reconcileDirectReplyCandidates: (h) => J()?.(h) ?? Promise.resolve({
      changedParentEventIds: [],
      savedDirectReplyCount: 0,
      unresolvedParentEventIds: h.map((U) => U.classification.parentEventId).filter((U) => !!U)
    })
  });
  const de = Tf(), re = ny();
  function _e() {
    const h = /* @__PURE__ */ new Date(), U = `${h.getFullYear()}`, Pe = `${h.getMonth() + 1}`.padStart(2, "0"), ye = `${h.getDate()}`.padStart(2, "0");
    return Vl(`${U}-${Pe}-${ye}`);
  }
  let ie = be(!1), Ce = be("none"), X = be(!1), W = 0, te = be(lr(_e())), xe = be(lr(_e())), Ne = be(!1), ne = null, E = be(!1), L = be(!1), B = be(!1), oe = be(lr({ phase: "loading" })), pe, V, Ae = be(!1), ot = be("postHistory.exportComplete"), ht = be(lr({})), he, Le = be(!1), We = be(null), ae = be(lr({})), Ge = be(lr({})), Pt = be(!1), vt = be(0), _t = be(0), gt = be("postHistory.broadcastSent"), Ut, xt = be(void 0), nt = be(lr({})), dt = be(lr([])), Rt = be(-1), $n = be(!1), qe = be(null), qn = be(null), wn = be(null), Pn = be(!1), _r = be(!1), dr = be(null), Tt = be(0), Ht = !1, tn = !1, xn = !1, on = !1, Rn = null, fn = null, Er = 0, pn = null, rt = null;
  const Mn = typeof IntersectionObserver < "u";
  let St = be(null), On = be(!1);
  const qt = Mf({
    getShow: () => b(),
    getPosts: () => _.posts,
    getContainer: () => a(qe)
  }), Ue = Mm({
    getShow: () => b(),
    getPubkeyHex: () => f(),
    getPosts: () => _.posts,
    getLocale: () => n(),
    getContainer: () => a(qe),
    getIsSearchMode: () => _.isSearchMode,
    getSearchQuery: () => _.state.searchQuery
  }), ln = mf({
    getShow: () => b(),
    getEmojiUrls: () => a(Na),
    onStateChanged: () => qt.remeasure()
  });
  function cr(h) {
    const U = py(h);
    return hl({
      sourceContent: U,
      displayContent: U,
      tags: h.tags,
      media: h.media
    });
  }
  function ur(h) {
    return ln.emojiLoadStateByUrl[h] === "ready";
  }
  function Nn(h) {
    return ln.emojiLoadStateByUrl[h] === "failed";
  }
  function Ar(h) {
    return Number.isInteger(h) ? `${h}` : h.toFixed(6).replace(/\.0+$/, "").replace(/(\.\d*?)0+$/, "$1");
  }
  function Zr(h) {
    const U = ln.emojiImageMetaByUrl[h]?.aspectRatio, ye = typeof U == "number" && Number.isFinite(U) && U > 0 ? c * U : c;
    return [
      `width: ${Ar(ye)}px;`,
      `height: ${c}px;`,
      "vertical-align: bottom;"
    ].join(" ");
  }
  let Sn = R(() => {
    const h = {};
    for (const U of _.posts)
      h[U.eventId] = cr(U);
    return h;
  }), vn = R(() => _.currentViewRefetchStatusMessageKey ?? _.syncStatusMessageKey), hr = R(() => _.currentViewRefetchStatusMessageKey ? _.currentViewRefetchStatusMessageValues : null), kr = R(() => _.syncStatus === "failed" || _.currentViewRefetchStatusMessageKey === "postHistory.repairFetchFailed"), gr = R(() => _.canReturnToLatest || !Ue.isHistoryScrolledToTop), ua = R(() => _.canJumpToOldest || !Ue.isHistoryScrolledToBottom), Vn = R(() => _.isSearchMode ? _.searchResultStatus === "loading" : _.initialLocalLoadStatus === "loading"), ha = R(() => _.posts.length === 0 && (_.isSearchMode ? _.searchResultStatus === "ready" : _.initialLocalLoadStatus === "ready"));
  function wa(h, U) {
    U[h.id] || (U[h.id] = hl({ sourceContent: h.content, tags: h.tags }));
  }
  function Dr(h, U, Pe) {
    if (!(!h || Pe.has(h.node.eventId))) {
      Pe.add(h.node.eventId), wa(h.node.event, U), Dr(h.parentNodeState, U, Pe);
      for (const ye of h.replyNodeStates)
        Dr(ye, U, Pe);
    }
  }
  let yr = R(() => {
    const h = {};
    for (const U of _.posts) {
      const Pe = /* @__PURE__ */ new Set();
      for (const yt of ta(U))
        yt.status === "resolved" && wa(yt.event, h);
      const ye = fe.getAnchorState(U);
      ye.parentNode && wa(ye.parentNode.event, h), Dr(ye.parentNodeState, h, Pe);
      for (const yt of ye.replyNodeStates)
        Dr(yt, h, Pe);
    }
    return h;
  }), Na = R(() => {
    const h = /* @__PURE__ */ new Set();
    for (const U of [
      ...Object.values(a(Sn)),
      ...Object.values(a(yr))
    ])
      for (const Pe of U.previewContent.emojiUrls)
        h.add(Pe);
    for (const U of _.posts) {
      const Pe = fe.getAnchorState(U);
      if (a(nt)[U.eventId])
        for (const ye of Pe.reactionReadModel.groups)
          ye.emojiUrl && h.add(ye.emojiUrl);
    }
    return [...h];
  });
  function fa() {
    W += 1, Z.reset(), re.resetState(), ct(), k(), de.resetDeleteConfirmation(), g(L, !1), g(Le, !1), g(We, null), g(ie, !1), g(Ce, "none"), g(X, !1), g(te, _e(), !0), g(xe, _e(), !0), g(Ne, !1), g(E, !1), g(ae, {}, !0), g(Ge, {}, !0), Bd(), g(nt, {}, !0), ln.resetState(), g(dt, [], !0), g(Rt, -1), g($n, !1);
  }
  function pa() {
    pe?.abort();
  }
  function Pa() {
    W += 1;
    const h = _.isSearchMode;
    h && Ue.clearCurrentSessionScrollAnchor(), _.resetSearchState(), _.prepareForClose() ? Ue.clearAllSessionScrollAnchorsForCurrentPubkey() : h || Ue.saveCurrentSessionScrollAnchor(), se.cancelCurrentChannelResolution(), fe.cancelCurrentGraphFetches(), de.resetDeleteConfirmation(), g(L, !1), g(Le, !1), g(We, null), g(ie, !1), g(E, !1), re.hideCopyFloatingMessage(), ct(), k(), pa(), g($n, !1), g(dt, [], !0), g(Rt, -1), b(!1), p()?.();
  }
  function va(h) {
    return h instanceof Element && h.closest(".ehagaki-pswp") !== null;
  }
  function xa(h) {
    va(h.target) && h.preventDefault();
  }
  function Ra(h) {
    a($n) && h.preventDefault();
  }
  bf(() => b(), Pa, !0), ze(() => {
    b() || (pa(), fa());
  }), ze(() => {
    a(B) && V && f() !== V && pa();
  }), ze(() => {
    if (!b() || !a(Vn)) {
      g(On, !1);
      return;
    }
    g(On, !1);
    const h = setTimeout(
      () => {
        b() && a(Vn) && g(On, !0);
      },
      u
    );
    return () => {
      clearTimeout(h);
    };
  }), ze(() => {
    const h = a(qe);
    if (!h) {
      Rn = null, fn = null, g(dr, null);
      return;
    }
    const U = () => {
      const ye = Math.max(0, h.clientHeight);
      if (Rn !== h) {
        Rn = h, fn = ye, g(dr, ye, !0);
        return;
      }
      fn !== ye && (fn = ye, g(dr, ye, !0), Er += 1, g(Tt, Er, !0));
    };
    if (U(), typeof ResizeObserver > "u")
      return;
    const Pe = new ResizeObserver(U);
    return Pe.observe(h), () => {
      Pe.disconnect(), Rn === h && (Rn = null, fn = null, g(dr, null));
    };
  }), ze(() => {
    const h = a(qn), U = a(qe), Pe = a(dr), ye = a(Tt);
    if (!(b() && !!h && !!U && Pe !== null && Pe > 0 && !_.isSearchMode && _.state.listingMode === "contiguous" && _.state.hasOlderLocal && !_.isRefetchingAroundCurrentView) || !Mn) {
      Ht = !1, xn = !1, pn = null;
      return;
    }
    const rn = pn?.root === U && pn.sentinel === h && pn.resizeGeneration !== ye && U.scrollTop <= pn.scrollTop;
    pn = { root: U, sentinel: h, resizeGeneration: ye, scrollTop: U.scrollTop };
    let Vt = !1;
    const yn = new IntersectionObserver(
      (er) => {
        const Cr = er.some((ma) => ma.isIntersecting), $r = !Vt;
        if (Vt = !0, xn = Cr, !Cr) {
          Ht && !a(Pn) && (Ht = !1);
          return;
        }
        $r && rn || Lr();
      },
      {
        root: U,
        rootMargin: `0px 0px ${Pe * 2}px 0px`,
        threshold: 0
      }
    );
    return yn.observe(h), () => {
      yn.disconnect();
    };
  }), ze(() => {
    const h = a(wn), U = a(qe), Pe = a(dr), ye = a(Tt);
    if (!(b() && !!h && !!U && Pe !== null && Pe > 0 && !_.isSearchMode && _.state.listingMode === "contiguous" && _.state.hasNewerLocal && !a(X) && !_.isRefetchingAroundCurrentView) || !Mn) {
      tn = !1, on = !1, rt = null;
      return;
    }
    const rn = rt?.root === U && rt.sentinel === h && rt.resizeGeneration !== ye && U.scrollTop >= rt.scrollTop;
    rt = { root: U, sentinel: h, resizeGeneration: ye, scrollTop: U.scrollTop };
    let Vt = !1;
    const yn = new IntersectionObserver(
      (er) => {
        const Cr = er.some((ma) => ma.isIntersecting), $r = !Vt;
        if (Vt = !0, on = Cr, !Cr) {
          tn && !a(_r) && (tn = !1);
          return;
        }
        $r && rn || Va();
      },
      {
        root: U,
        rootMargin: `${Pe * 2}px 0px 0px 0px`,
        threshold: 0
      }
    );
    return yn.observe(h), () => {
      yn.disconnect();
    };
  }), io(() => {
    W += 1, pa(), Bd(), Z.dispose(), k();
  }), ze(() => {
    if (!b() || !m()?.id)
      return;
    const h = m().id;
    ne !== h && (_.posts, fe.recordPostedReply(m(), _.posts).then((U) => {
      U && (ne = h);
    }).catch(() => {
    }));
  }), ze(() => {
    const h = _.posts;
    !b() || h.length === 0 || (Cf(h.map((U) => U.eventId)).catch(() => {
    }), ca(() => fe.loadCachedChildInteractionStateForPosts(h)));
  }), ze(() => {
    const h = i()?.revision ?? 0, U = i()?.parentEventIds ?? [], Pe = _.posts;
    !b() || h <= 0 || U.length === 0 || (ca(() => fe.loadCachedChildInteractionStateForPosts(Pe, U)), Tl({
      source: "dialog-inbound-save",
      parentEventIds: U,
      rxNostr: S(),
      relayConfig: w(),
      isActive: () => b()
    }).then((ye) => {
      if (!(!b() || ye.deletedReactionEventIds.length === 0 && ye.deletedReplyEventIds.length === 0))
        return fe.loadCachedChildInteractionStateForPosts(_.posts, ye.checkedParentEventIds);
    }).catch(() => {
    }));
  }), ze(() => {
    const h = O()?.revision ?? 0;
    !b() || h <= 0 || _.isSearchMode || _.canReturnToLatest || ca(() => _.returnToLatest());
  }), ze(() => {
    if (b())
      return () => {
        se.cancelCurrentChannelResolution();
      };
  });
  function Xr(h) {
    return h ? h.values ? r()(h.key, { values: h.values }) : r()(h.key) : null;
  }
  function Ba() {
    return Xr(P0({
      totalCount: _.displayTotalCount,
      totalCountKnown: _.state.totalCountKnown,
      totalCountStatus: _.state.totalCountStatus,
      isSearchMode: _.isSearchMode
    }));
  }
  function Ua(h) {
    if (!h)
      return null;
    const U = Number(h.year), Pe = Number(h.month), ye = Number(h.day), rn = new Date(U, Pe - 1, ye, 23, 59, 59, 999).getTime();
    return Number.isFinite(rn) ? Math.floor(rn / 1e3) : null;
  }
  function Sa() {
    return r()(Uc({ direction: "older", isSearchMode: _.isSearchMode }));
  }
  function Ia() {
    return r()(Uc({ direction: "newer", isSearchMode: _.isSearchMode }));
  }
  async function gn() {
    const h = _.isSearchMode, U = h ? Ue.captureHistoryScrollAnchor() : null;
    await _.loadOlder() && h && Ue.restoreHistoryScrollAnchor(U);
  }
  function qa() {
    return b() && !_.isSearchMode && _.state.listingMode === "contiguous" && _.state.hasOlderLocal && !_.isRefetchingAroundCurrentView;
  }
  async function Lr() {
    if (a(Pn) || Ht || !qa())
      return;
    const h = Ue.captureHistoryScrollAnchor();
    g(Pn, !0), Ht = !0;
    try {
      await _.loadOlder() && b() && (await da(), await qt.flushPendingMeasurements(), Ue.restoreHistoryScrollAnchor(h));
    } finally {
      g(Pn, !1), xn || (Ht = !1);
    }
  }
  function Es() {
    return b() && !_.isSearchMode && _.state.listingMode === "contiguous" && _.state.hasNewerLocal && !a(X) && !_.isRefetchingAroundCurrentView;
  }
  async function Va() {
    if (a(_r) || tn || !Es())
      return;
    const h = Ue.captureHistoryScrollAnchor();
    g(_r, !0), tn = !0;
    let U = !1;
    try {
      U = await _.loadNewer(), U && b() && (await da(), await qt.flushPendingMeasurements());
    } finally {
      g(_r, !1), U && b() && (await da(), Ue.restoreHistoryScrollAnchor(h)), on || (tn = !1);
    }
  }
  async function is() {
    await _.showSavedOlderPosts() && Ue.resetHistoryScrollSoon();
  }
  async function ea() {
    const h = Ue.captureHistoryScrollAnchor(), U = a(qe)?.scrollTop ?? null;
    _.state.loadedPosts.length, a(qe)?.scrollHeight, a(qe)?.clientHeight;
    const Pe = await _.fetchOlderFromRelays({ anchorEventId: h?.eventId });
    let ye = !1;
    Pe && U !== null && b() && a(qe) && (ye = Ue.restoreHistoryScrollAnchor(h), ye || (a(qe).scrollTop = U)), _.latestOlderBackfillUiResult, a(qe)?.scrollTop, a(qe)?.scrollHeight;
  }
  async function _a() {
    const h = _.isSearchMode ? null : Ue.captureHistoryScrollAnchor();
    await _.loadNewer() && (_.isSearchMode ? Ue.resetHistoryScrollSoon() : Ue.restoreHistoryScrollAnchor(h));
  }
  async function ga() {
    Ue.clearAllSessionScrollAnchorsForCurrentPubkey();
    const h = _.canReturnToLatest ? await _.returnToLatest() : !1;
    g(X, !1), (h || !Ue.isHistoryScrolledToTop) && Ue.resetHistoryScrollSoon();
  }
  async function ls() {
    const h = Ua(a(te));
    if (h === null)
      return;
    Ue.clearAllSessionScrollAnchorsForCurrentPubkey(), g(X, !0);
    const U = await _.jumpToCreatedAt(h);
    U || g(X, !1), U && (g(Ce, "none"), g(Ne, !1), Ue.resetHistoryScrollSoon());
  }
  function ds(h) {
    return a(Sn)[h.eventId] ?? cr(h);
  }
  function mr(h) {
    return ds(h).hasRenderableText;
  }
  function ta(h) {
    return Re.getQuotePreviews(h);
  }
  function d(h) {
    return a(ae)[h.eventId] === "sending";
  }
  function C(h) {
    return a(ae)[h.eventId] === "failed";
  }
  function H(h) {
    return a(Ge)[h.eventId] === "sending";
  }
  function $(h) {
    return Hf(h) !== null;
  }
  function K(h) {
    const U = fe.getAnchorState(h).repliesActionState;
    return Xr(x0(U)) ?? "";
  }
  function z(h) {
    return !!a(nt)[h.eventId];
  }
  function ce(h) {
    const U = fe.getAnchorState(h).reactionSummary.totalCount;
    return Xr(R0({ visible: z(h), reactionCount: U })) ?? "";
  }
  function Fe(h) {
    return fe.getAnchorState(h).reactionReadModel.groups;
  }
  function le(h) {
    return Zm(h);
  }
  function Se(h) {
    g(
      nt,
      {
        ...a(nt),
        [h.eventId]: !a(nt)[h.eventId]
      },
      !0
    );
  }
  function ke(h) {
    const U = fe.getAnchorState(h).repliesActionState;
    if (U.status === "failed" || U.status === "loaded" && U.replyCount === 0) {
      fe.retryChildren(h);
      return;
    }
    fe.toggleChildren(h);
  }
  function De(h) {
    return Yd(h, f());
  }
  function $e(h) {
    De(h) && de.openDeleteConfirm(h);
  }
  async function at(h, U) {
    if (H(h))
      return;
    const Pe = Ve(h, U);
    g(Ge, { ...a(Ge), [h.eventId]: "sending" }, !0);
    const ye = await $f.broadcast({ post: h, rxNostr: S() });
    g(Ge, { ...a(Ge), [h.eventId]: void 0 }, !0), tt(Pe, ye);
  }
  function ct() {
    Ut && (clearTimeout(Ut), Ut = void 0), g(Pt, !1), g(xt, void 0);
  }
  function Ct(h, U) {
    g(
      xt,
      {
        eventId: h.eventId,
        ...ii(U.clientX, U.clientY)
      },
      !0
    );
  }
  function Ve(h, U) {
    if (a(xt)?.eventId === h.eventId)
      return {
        x: a(xt).x,
        y: a(xt).y
      };
    const Pe = U.currentTarget, ye = Pe instanceof HTMLElement ? Pe.getBoundingClientRect() : null;
    return ii(ye ? ye.left + ye.width / 2 : 0, ye ? ye.bottom + 8 : 0);
  }
  function tt(h, U) {
    Ut && clearTimeout(Ut), g(vt, h.x, !0), g(_t, h.y, !0), g(
      gt,
      U.success ? (U.rejectedRelays?.length ?? 0) > 0 || (U.timedOutRelays?.length ?? 0) > 0 ? "postHistory.broadcastPartial" : "postHistory.broadcastSent" : "postHistory.broadcastFailed",
      !0
    ), g(Pt, !0), Ut = setTimeout(
      () => {
        g(Pt, !1), Ut = void 0;
      },
      1800
    );
  }
  function mt(h) {
    const U = Date.now(), Pe = h.node.event.created_at * 1e3;
    return {
      id: h.node.eventId,
      eventId: h.node.eventId,
      pubkeyHex: h.node.authorPubkey,
      kind: h.node.event.kind,
      content: h.node.event.content,
      tags: h.node.event.tags.map((ye) => [...ye]),
      createdAt: Pe,
      postedAt: Pe,
      relayHints: [...h.node.relayUrls],
      acceptedRelays: [...h.node.relayUrls],
      fetchedRelays: [...h.node.relayUrls],
      media: [],
      rawEvent: h.node.event,
      updatedAt: U,
      schemaVersion: 1
    };
  }
  function nn(h) {
    const U = Date.now(), Pe = h.created_at * 1e3;
    return {
      id: h.id,
      eventId: h.id,
      pubkeyHex: h.pubkey,
      kind: h.kind,
      content: h.content,
      tags: h.tags.map((ye) => [...ye]),
      createdAt: Pe,
      postedAt: Pe,
      relayHints: [],
      acceptedRelays: [],
      fetchedRelays: [],
      media: [],
      rawEvent: h,
      updatedAt: U,
      schemaVersion: 1
    };
  }
  function br(h, U) {
    return `quote-preview:${h}:${U}`;
  }
  function Tr(h, U) {
    U && de.closeAllPostItemMenus(), de.setPostMenuOpen(h, U);
  }
  function Ie(h) {
    g(We, h, !0), g(Le, !0);
  }
  function Ye(h) {
    Ie(h.node.event);
  }
  function zt(h) {
    return re.copyState[h] === "failed";
  }
  function In(h) {
    return a(Ge)[h] === "sending";
  }
  function Et(h, U) {
    re.captureCopyPointerPosition(mt(h), U);
  }
  function na(h, U) {
    re.handleCopyNevent(mt(h), U);
  }
  function cs(h) {
    ja(mt(h));
  }
  function qs() {
    return {
      client: Ud.externalNostrClient,
      customUrlTemplate: Ud.externalNostrClientCustomUrl
    };
  }
  function ra() {
    const h = xf(qs());
    return h ? r()("postHistory.openInExternalClient", { values: { client: h } }) : r()("postHistory.openInExternalClientFallback");
  }
  function ja(h) {
    const U = Rf(h, qs(), ru.value);
    U && window.open(U, "_blank", "noopener,noreferrer");
  }
  function Ka(h, U) {
    Ct(mt(h), U);
  }
  function Ya(h, U) {
    at(mt(h), U);
  }
  function Vs(h) {
    return Yd(mt(h), f());
  }
  function As(h) {
    return a(ae)[h] === "sending";
  }
  function js(h) {
    const U = mt(h);
    De(U) && de.openDeleteConfirm(U);
  }
  async function ks(h) {
    y() && await y()(h) !== !1 && Pa();
  }
  function Ds(h) {
    x() && (x()(h), Pa());
  }
  function uo() {
    de.cancelDeleteConfirm();
  }
  async function Ks() {
    await da(), a(Ce) === "search" && a(St)?.focus({ preventScroll: !0 });
  }
  function ho() {
    if (a(Ce) === "search") {
      us(), g(E, !1);
      return;
    }
    g(Ce, "search"), g(E, !1), Ks();
  }
  function us() {
    Ue.clearCurrentSessionScrollAnchor(), g(Ce, "none"), _.resetSearchState();
  }
  async function hs(h) {
    const U = ++W;
    g(X, !0);
    const Pe = await _.jumpToEventId(h.eventId);
    if (!(U !== W || !b())) {
      if (!Pe) {
        g(X, !1);
        return;
      }
      Ue.clearAllSessionScrollAnchorsForCurrentPubkey(), g(Ce, "none"), _.resetSearchState(), Ue.scrollHistoryEventToTopSoon(h.eventId);
    }
  }
  function Ys() {
    const h = a(Ce) !== "jump-date";
    g(Ce, h ? "jump-date" : "none", !0), h || g(Ne, !1), g(E, !1);
  }
  function zs() {
    g(Ce, "none"), g(Ne, !1);
  }
  function Ea(h) {
    const U = a(xe) ?? a(te);
    !U || h === 0 || g(xe, U.add({ years: h }), !0);
  }
  function v() {
    g(ie, !0), g(E, !1);
  }
  function P() {
    g(L, !0), g(E, !1);
  }
  function k() {
    he && (clearTimeout(he), he = void 0), g(Ae, !1);
  }
  function q() {
    const h = /* @__PURE__ */ new Date();
    return [
      String(h.getFullYear()).padStart(4, "0"),
      String(h.getMonth() + 1).padStart(2, "0"),
      String(h.getDate()).padStart(2, "0")
    ].join("-");
  }
  function Q(h) {
    k(), g(
      ot,
      h.isPartial ? "postHistory.exportPartial" : "postHistory.exportComplete",
      !0
    ), g(
      ht,
      {
        exported: h.exportedEventCount,
        skipped: h.skippedPostCount + h.missingDeletionRawEventCount + h.invalidDeletionRawEventCount
      },
      !0
    ), g(Ae, !0), he = setTimeout(
      () => {
        g(Ae, !1), he = void 0;
      },
      5e3
    );
  }
  async function ue() {
    if (!f() || a(B))
      return;
    g(B, !0), g(oe, { phase: "loading" }, !0);
    const h = new AbortController();
    pe = h, V = f(), g(E, !1), k();
    try {
      const { result: U, blob: Pe } = await B0.exportForPubkeyInWorker(f(), {
        signal: h.signal,
        onProgress: (rn) => {
          g(oe, rn, !0);
        }
      });
      if (h.signal.aborted)
        return;
      const ye = URL.createObjectURL(Pe), yt = document.createElement("a");
      yt.href = ye, yt.download = `ehagaki-post-history-${q()}.jsonl`, yt.style.display = "none", l.appendChild(yt), yt.click(), setTimeout(
        () => {
          yt.remove(), URL.revokeObjectURL?.(ye);
        },
        1e3
      ), Q(U);
    } catch (U) {
      if (h.signal.aborted || U instanceof DOMException && U.name === "AbortError")
        return;
      g(ot, "postHistory.exportFailed"), g(ht, {}, !0), g(Ae, !0), he = setTimeout(
        () => {
          g(Ae, !1), he = void 0;
        },
        5e3
      );
    } finally {
      pe === h && (pe = void 0, V = void 0, g(B, !1));
    }
  }
  async function ve() {
    const h = Ue.captureHistoryScrollAnchor(), U = a(qe)?.scrollTop ?? null;
    await _.refreshAfterLocalImport(), !_.isSearchMode && a(qe) && !Ue.restoreHistoryScrollAnchor(h) && U !== null && (a(qe).scrollTop = U);
  }
  function je() {
    g(E, !1), _.refetchAroundCurrentView();
  }
  function Be() {
    Ue.clearAllSessionScrollAnchorsForCurrentPubkey(), g(E, !1), _.jumpToOldest().then((h) => {
      (h || !Ue.isHistoryScrolledToBottom) && Ue.resetHistoryScrollToBottomSoon();
    });
  }
  function Je() {
    g(E, !1), ga();
  }
  function Te() {
    g(ie, !1);
  }
  function At(h) {
    g(dt, h.mediaList, !0), g(Rt, h.index, !0), g($n, h.mediaList.length > 0 && h.index >= 0, !0);
  }
  function _n(h) {
    g(Rt, h, !0);
  }
  function Ke() {
    g($n, !1), g(dt, [], !0), g(Rt, -1);
  }
  async function et() {
    const h = de.deleteTargetPost;
    if (!h)
      return;
    g(
      ae,
      {
        ...a(ae),
        [h.eventId]: "sending"
      },
      !0
    );
    const U = await Lf.requestDeletion({ post: h, rxNostr: S() });
    U.success && typeof U.deletedAt == "number" && U.deletionEventId ? (_.patchDeletedPost(h.eventId, U.deletedAt, U.deletionEventId), fe.recordDeletedEvent({
      eventId: h.eventId,
      authorPubkey: h.pubkeyHex,
      deletionEvent: U.deletionEvent ?? null,
      deletionEventAttestation: U.deletionEventAttestation
    }).catch(() => {
    }), g(
      ae,
      {
        ...a(ae),
        [h.eventId]: void 0
      },
      !0
    )) : g(ae, { ...a(ae), [h.eventId]: "failed" }, !0), de.clearDeleteTarget();
  }
  async function Jn() {
    await _.deleteLocalHistory() && (Ue.clearAllSessionScrollAnchorsForCurrentPubkey(), g(ie, !1), g(Ce, "none"), Ue.resetHistoryScrollSoon());
  }
  var ya = {
    get show() {
      return b();
    },
    set show(h = !1) {
      b(h), I();
    },
    get onClose() {
      return p();
    },
    set onClose(h) {
      p(h), I();
    },
    get onReplyPost() {
      return y();
    },
    set onReplyPost(h = void 0) {
      y(h), I();
    },
    get onQuotePost() {
      return x();
    },
    set onQuotePost(h = void 0) {
      x(h), I();
    },
    get pubkeyHex() {
      return f();
    },
    set pubkeyHex(h = null) {
      f(h), I();
    },
    get rxNostr() {
      return S();
    },
    set rxNostr(h = void 0) {
      S(h), I();
    },
    get relayConfig() {
      return w();
    },
    set relayConfig(h = null) {
      w(h), I();
    },
    get latestPostedEvent() {
      return m();
    },
    set latestPostedEvent(h = null) {
      m(h), I();
    },
    get inboundInteractionSave() {
      return i();
    },
    set inboundInteractionSave(h = null) {
      i(h), I();
    },
    get authoredSelfPostSave() {
      return O();
    },
    set authoredSelfPostSave(h = null) {
      O(h), I();
    },
    get reconcileInboundDirectReplyCandidates() {
      return J();
    },
    set reconcileInboundDirectReplyCandidates(h = void 0) {
      J(h), I();
    },
    get notifySavedAuthoredPosts() {
      return N();
    },
    set notifySavedAuthoredPosts(h = void 0) {
      N(h), I();
    }
  }, za = bC(), Fr = ee(za);
  {
    const h = (ye) => {
      var yt = Oe(), rn = ee(yt);
      {
        const Vt = (yn, er) => {
          let Cr = () => er?.().props;
          {
            let $r = R(() => r()("global.close"));
            ir(yn, so(Cr, {
              className: "modal-close",
              shape: "square",
              get ariaLabel() {
                return a($r);
              },
              children: (ma, ps) => {
                var Nr = U0();
                me((Js) => Hn(Nr, "aria-label", Js), [() => r()("global.close")]), D(ma, Nr);
              },
              $$slots: { default: !0 }
            }));
          }
        };
        He(rn, () => bu, (yn, er) => {
          er(yn, { child: Vt, $$slots: { child: !0 } });
        });
      }
      D(ye, yt);
    };
    let U = R(() => r()("postHistory.title")), Pe = R(() => r()("postHistory.description"));
    mu(Fr, {
      onOpenChange: (ye) => !ye && Pa(),
      onInteractOutside: xa,
      onEscapeKeydown: Ra,
      trapFocus: !1,
      get title() {
        return a(U);
      },
      get description() {
        return a(Pe);
      },
      contentClass: "post-history-dialog",
      footerVariant: "close-button",
      showPagination: !1,
      initialFocus: "content",
      get open() {
        return b();
      },
      set open(ye) {
        b(ye);
      },
      footer: h,
      children: (ye, yt) => {
        var rn = fC(), Vt = ee(rn), yn = M(Vt), er = M(yn);
        {
          var Cr = (Ze) => {
            var ft = q0(), kt = M(ft), tr = M(kt, !0);
            T(kt), T(ft), me(() => G(tr, Ue.currentMonthLabel)), si("click", kt, Ys), D(Ze, ft);
          };
          we(er, (Ze) => {
            Ue.currentMonthLabel && Ze(Cr);
          });
        }
        T(yn);
        var $r = F(yn, 2), ma = M($r);
        {
          var ps = (Ze) => {
            {
              let ft = R(() => a(oe).phase === "loading" ? r()("postHistory.exportLoading") : a(oe).phase === "verifying" ? r()("postHistory.exportVerifying", {
                values: {
                  processed: a(oe).processed ?? 0,
                  total: a(oe).total ?? 0
                }
              }) : r()("postHistory.exportCreating"));
              Ms(Ze, {
                get text() {
                  return a(ft);
                },
                showLoader: !0,
                loaderSize: 30,
                state: "loading",
                customClass: "status-loading-placeholder"
              });
            }
          }, Nr = (Ze) => {
            {
              let ft = R(() => a(hr) ? r()(a(vn), { values: a(hr) }) : r()(a(vn))), kt = R(() => _.showStatusLoader ? "loading" : "complete"), tr = R(() => `status-loading-placeholder${a(kr) ? " status-error" : ""}`);
              Ms(Ze, {
                get text() {
                  return a(ft);
                },
                get showLoader() {
                  return _.showStatusLoader;
                },
                loaderSize: 30,
                get state() {
                  return a(kt);
                },
                get customClass() {
                  return a(tr);
                }
              });
            }
          };
          we(ma, (Ze) => {
            a(B) ? Ze(ps) : a(vn) && Ze(Nr, 1);
          });
        }
        var Js = F(ma, 2);
        {
          var po = (Ze) => {
            var ft = V0(), kt = M(ft), tr = M(kt), nr = M(tr, !0);
            T(tr), T(kt), T(ft), me((aa) => G(nr, aa), [() => Ba()]), D(Ze, ft);
          }, Wa = R(() => Ba());
          we(Js, (Ze) => {
            a(Wa) && Ze(po);
          });
        }
        var vo = F(Js, 2);
        He(vo, () => Kd, (Ze, ft) => {
          ft(Ze, {
            get open() {
              return a(E);
            },
            set open(kt) {
              g(E, kt, !0);
            },
            children: (kt, tr) => {
              var nr = eb(), aa = ee(nr);
              {
                let ka = R(() => `menu-trigger post-history-menu-trigger post-history-heading-menu-trigger ${a(E) ? "is-open" : ""}`.trim()), jn = R(() => r()("postHistory.openMenu"));
                He(aa, () => Vd, (Br, En) => {
                  En(Br, {
                    get class() {
                      return a(ka);
                    },
                    get "aria-label"() {
                      return a(jn);
                    },
                    children: (rr, Qr) => {
                      var ys = j0();
                      D(rr, ys);
                    },
                    $$slots: { default: !0 }
                  });
                });
              }
              var sa = F(aa, 2);
              He(sa, () => ni, (ka, jn) => {
                jn(ka, {
                  get to() {
                    return l;
                  },
                  children: (Br, En) => {
                    var rr = Oe(), Qr = ee(rr);
                    He(Qr, () => jd, (ys, Zs) => {
                      Zs(ys, {
                        side: "bottom",
                        align: "end",
                        sideOffset: 8,
                        class: "post-history-menu-content",
                        trapFocus: !1,
                        preventScroll: !1,
                        onCloseAutoFocus: (ms) => ms.preventDefault(),
                        children: (ms, pt) => {
                          var Y = X0(), st = M(Y);
                          He(st, () => Xn, (wt, $t) => {
                            $t(wt, {
                              class: "menu-action-button",
                              onSelect: ho,
                              children: (bn, Ln) => {
                                var ar = K0(), Qt = F(ee(ar), 2), dn = M(Qt, !0);
                                T(Qt), me((Kn) => G(dn, Kn), [() => r()("postHistory.showSearch")]), D(bn, ar);
                              },
                              $$slots: { default: !0 }
                            });
                          });
                          var bt = F(st, 2);
                          {
                            let wt = R(() => !_.canRefetchAroundCurrentView);
                            He(bt, () => Xn, ($t, bn) => {
                              bn($t, {
                                class: "menu-action-button",
                                get disabled() {
                                  return a(wt);
                                },
                                onSelect: je,
                                children: (Ln, ar) => {
                                  var Qt = Y0(), dn = F(ee(Qt), 2), Kn = M(dn, !0);
                                  T(dn), me((Wr) => G(Kn, Wr), [() => r()("postHistory.repair")]), D(Ln, Qt);
                                },
                                $$slots: { default: !0 }
                              });
                            });
                          }
                          var lt = F(bt, 2);
                          He(lt, () => ts, (wt, $t) => {
                            $t(wt, { class: "post-history-menu-separator" });
                          });
                          var Gn = F(lt, 2);
                          {
                            let wt = R(() => !a(gr));
                            He(Gn, () => Xn, ($t, bn) => {
                              bn($t, {
                                class: "menu-action-button",
                                get disabled() {
                                  return a(wt);
                                },
                                onSelect: Je,
                                children: (Ln, ar) => {
                                  var Qt = z0(), dn = F(ee(Qt), 2), Kn = M(dn, !0);
                                  T(dn), me((Wr) => G(Kn, Wr), [() => r()("postHistory.returnToLatest")]), D(Ln, Qt);
                                },
                                $$slots: { default: !0 }
                              });
                            });
                          }
                          var It = F(Gn, 2);
                          He(It, () => Xn, (wt, $t) => {
                            $t(wt, {
                              class: "menu-action-button",
                              onSelect: Ys,
                              children: (bn, Ln) => {
                                var ar = Q0(), Qt = F(ee(ar), 2), dn = M(Qt, !0);
                                T(Qt), me((Kn) => G(dn, Kn), [() => r()("postHistory.jumpToDate")]), D(bn, ar);
                              },
                              $$slots: { default: !0 }
                            });
                          });
                          var An = F(It, 2);
                          {
                            let wt = R(() => !a(ua));
                            He(An, () => Xn, ($t, bn) => {
                              bn($t, {
                                class: "menu-action-button",
                                get disabled() {
                                  return a(wt);
                                },
                                onSelect: Be,
                                children: (Ln, ar) => {
                                  var Qt = W0(), dn = F(ee(Qt), 2), Kn = M(dn, !0);
                                  T(dn), me((Wr) => G(Kn, Wr), [() => r()("postHistory.jumpToOldest")]), D(Ln, Qt);
                                },
                                $$slots: { default: !0 }
                              });
                            });
                          }
                          var mn = F(An, 2);
                          He(mn, () => ts, (wt, $t) => {
                            $t(wt, { class: "post-history-menu-separator" });
                          });
                          var wr = F(mn, 2);
                          {
                            let wt = R(() => !f() || a(B));
                            He(wr, () => Xn, ($t, bn) => {
                              bn($t, {
                                class: "menu-action-button",
                                get disabled() {
                                  return a(wt);
                                },
                                onSelect: ue,
                                children: (Ln, ar) => {
                                  var Qt = J0(), dn = F(ee(Qt), 2), Kn = M(dn, !0);
                                  T(dn), me((Wr) => G(Kn, Wr), [() => r()("postHistory.export")]), D(Ln, Qt);
                                },
                                $$slots: { default: !0 }
                              });
                            });
                          }
                          var fr = F(wr, 2);
                          {
                            let wt = R(() => !f());
                            He(fr, () => Xn, ($t, bn) => {
                              bn($t, {
                                class: "menu-action-button",
                                get disabled() {
                                  return a(wt);
                                },
                                onSelect: P,
                                children: (Ln, ar) => {
                                  var Qt = G0(), dn = F(ee(Qt), 2), Kn = M(dn, !0);
                                  T(dn), me((Wr) => G(Kn, Wr), [() => r()("postHistory.import")]), D(Ln, Qt);
                                },
                                $$slots: { default: !0 }
                              });
                            });
                          }
                          var Ur = F(fr, 2);
                          He(Ur, () => ts, (wt, $t) => {
                            $t(wt, { class: "post-history-menu-separator" });
                          });
                          var Zn = F(Ur, 2);
                          He(Zn, () => Xn, (wt, $t) => {
                            $t(wt, {
                              class: "menu-action-button menu-action-button-danger",
                              onSelect: v,
                              children: (bn, Ln) => {
                                var ar = Z0(), Qt = F(ee(ar), 2), dn = M(Qt, !0);
                                T(Qt), me((Kn) => G(dn, Kn), [() => r()("postHistory.deleteLocalHistory")]), D(bn, ar);
                              },
                              $$slots: { default: !0 }
                            });
                          }), T(Y), D(ms, Y);
                        },
                        $$slots: { default: !0 }
                      });
                    }), D(Br, rr);
                  },
                  $$slots: { default: !0 }
                });
              }), D(kt, nr);
            },
            $$slots: { default: !0 }
          });
        }), T($r), T(Vt);
        var go = F(Vt, 2);
        {
          var zr = (Ze) => {
            var ft = rb(), kt = M(ft);
            let tr;
            var nr = M(kt), aa = M(nr);
            {
              var sa = (En) => {
                Ms(En, {
                  variant: "spinner",
                  showLoader: !0,
                  loaderSize: 24,
                  ariaHidden: !0,
                  customClass: "post-history-search-spinner"
                });
              }, ka = (En) => {
                var rr = tb();
                D(En, rr);
              };
              we(aa, (En) => {
                _.isSearchPageLoading ? En(sa) : En(ka, -1);
              });
            }
            T(nr);
            var jn = F(nr, 2);
            Sf(jn), To(jn, (En) => g(St, En), () => a(St)), T(kt);
            var Br = F(kt, 2);
            {
              let En = R(() => r()("postHistory.hideSearch"));
              ir(Br, {
                type: "button",
                class: "post-history-search-close",
                contentLayout: "icon",
                shape: "square",
                get ariaLabel() {
                  return a(En);
                },
                onClick: us,
                children: (rr, Qr) => {
                  var ys = nb();
                  D(rr, ys);
                },
                $$slots: { default: !0 }
              });
            }
            T(ft), me(
              (En, rr) => {
                tr = Oa(kt, 1, "post-history-search-input-wrapper svelte-uxr0i8", null, tr, { "post-history-search-active": _.isSearchMode }), Hn(jn, "placeholder", En), Hn(jn, "aria-label", rr), Hn(jn, "aria-busy", _.isSearchPageLoading ? "true" : "false");
              },
              [
                () => r()("postHistory.searchPlaceholder"),
                () => r()("postHistory.search")
              ]
            ), Df(jn, () => _.state.searchInput, (En) => _.state.searchInput = En), D(Ze, ft);
          };
          we(go, (Ze) => {
            a(Ce) === "search" && Ze(zr);
          });
        }
        var yo = F(go, 2);
        {
          var mo = (Ze) => {
            var ft = fb(), kt = M(ft), tr = M(kt, !0);
            T(kt);
            var nr = F(kt, 2), aa = M(nr);
            {
              let jn = R(() => n() ?? void 0), Br = R(() => r()("postHistory.jumpToDateLabel"));
              He(aa, () => ih, (En, rr) => {
                rr(En, {
                  get locale() {
                    return a(jn);
                  },
                  get calendarLabel() {
                    return a(Br);
                  },
                  get value() {
                    return a(te);
                  },
                  set value(Qr) {
                    g(te, Qr, !0);
                  },
                  get placeholder() {
                    return a(xe);
                  },
                  set placeholder(Qr) {
                    g(xe, Qr, !0);
                  },
                  get open() {
                    return a(Ne);
                  },
                  set open(Qr) {
                    g(Ne, Qr, !0);
                  },
                  children: (Qr, ys) => {
                    var Zs = cb(), ms = ee(Zs);
                    {
                      const st = (bt, lt) => {
                        let Gn = () => lt?.().segments;
                        var It = Oe(), An = ee(It);
                        ba(An, 19, Gn, (mn, wr) => `${mn.part}-${wr}`, (mn, wr) => {
                          var fr = Oe(), Ur = ee(fr);
                          He(Ur, () => sh, (Zn, wt) => {
                            wt(Zn, {
                              class: "post-history-date-picker-segment",
                              get part() {
                                return a(wr).part;
                              },
                              children: ($t, bn) => {
                                Fs();
                                var Ln = ss();
                                me(() => G(Ln, a(wr).value)), D($t, Ln);
                              },
                              $$slots: { default: !0 }
                            });
                          }), D(mn, fr);
                        }), D(bt, It);
                      };
                      He(ms, () => ah, (bt, lt) => {
                        lt(bt, {
                          "aria-labelledby": "post-history-jump-date-label",
                          class: "post-history-date-picker-input",
                          children: st,
                          $$slots: { default: !0 }
                        });
                      });
                    }
                    var pt = F(ms, 2);
                    {
                      let st = R(() => r()("postHistory.jumpToDate"));
                      He(pt, () => ch, (bt, lt) => {
                        lt(bt, {
                          class: "post-history-date-picker-trigger",
                          get "aria-label"() {
                            return a(st);
                          },
                          children: (Gn, It) => {
                            var An = ab();
                            D(Gn, An);
                          },
                          $$slots: { default: !0 }
                        });
                      });
                    }
                    var Y = F(pt, 2);
                    He(Y, () => ni, (st, bt) => {
                      bt(st, {
                        get to() {
                          return l;
                        },
                        children: (lt, Gn) => {
                          var It = Oe(), An = ee(It);
                          He(An, () => dh, (mn, wr) => {
                            wr(mn, {
                              sideOffset: 8,
                              class: "post-history-date-picker-content",
                              children: (fr, Ur) => {
                                var Zn = Oe(), wt = ee(Zn);
                                {
                                  const $t = (bn, Ln) => {
                                    let ar = () => Ln?.().months, Qt = () => Ln?.().weekdays;
                                    var dn = db(), Kn = ee(dn);
                                    He(Kn, () => Xu, (Ts, Ga) => {
                                      Ga(Ts, {
                                        class: "post-history-date-picker-header",
                                        children: (an, ut) => {
                                          var sr = ib(), Yn = ee(sr), Pr = F(Yn, 2);
                                          He(Pr, () => nh, (Wt, Jt) => {
                                            Jt(Wt, {
                                              class: "post-history-date-picker-nav",
                                              "aria-label": "Previous month",
                                              children: (cn, Qe) => {
                                                var Gt = sb();
                                                D(cn, Gt);
                                              },
                                              $$slots: { default: !0 }
                                            });
                                          });
                                          var Mr = F(Pr, 2);
                                          He(Mr, () => eh, (Wt, Jt) => {
                                            Jt(Wt, { class: "post-history-date-picker-heading" });
                                          });
                                          var Or = F(Mr, 2);
                                          He(Or, () => th, (Wt, Jt) => {
                                            Jt(Wt, {
                                              class: "post-history-date-picker-nav",
                                              "aria-label": "Next month",
                                              children: (cn, Qe) => {
                                                var Gt = ob();
                                                D(cn, Gt);
                                              },
                                              $$slots: { default: !0 }
                                            });
                                          });
                                          var Bn = F(Or, 2);
                                          si("click", Yn, () => Ea(-1)), si("click", Bn, () => Ea(1)), D(an, sr);
                                        },
                                        $$slots: { default: !0 }
                                      });
                                    });
                                    var Wr = F(Kn, 2);
                                    ba(Wr, 19, ar, (Ts, Ga) => `${Ts.value.toString()}-${Ga}`, (Ts, Ga) => {
                                      var an = Oe(), ut = ee(an);
                                      He(ut, () => Qu, (sr, Yn) => {
                                        Yn(sr, {
                                          class: "post-history-date-picker-grid",
                                          children: (Pr, Mr) => {
                                            var Or = lb(), Bn = ee(Or);
                                            He(Bn, () => Gu, (Jt, cn) => {
                                              cn(Jt, {
                                                children: (Qe, Gt) => {
                                                  var Nt = Oe(), zn = ee(Nt);
                                                  He(zn, () => bl, (Qn, Un) => {
                                                    Un(Qn, {
                                                      children: (kn, Dn) => {
                                                        var sn = Oe(), or = ee(sn);
                                                        ba(or, 19, Qt, (Fn, Bt) => `${Fn}-${Bt}`, (Fn, Bt) => {
                                                          var un = Oe(), jt = ee(un);
                                                          He(jt, () => Zu, (Xe, Dt) => {
                                                            Dt(Xe, {
                                                              class: "post-history-date-picker-weekday",
                                                              children: (Cn, Zt) => {
                                                                Fs();
                                                                var Xt = ss();
                                                                me(() => G(Xt, a(Bt))), D(Cn, Xt);
                                                              },
                                                              $$slots: { default: !0 }
                                                            });
                                                          }), D(Fn, un);
                                                        }), D(kn, sn);
                                                      },
                                                      $$slots: { default: !0 }
                                                    });
                                                  }), D(Qe, Nt);
                                                },
                                                $$slots: { default: !0 }
                                              });
                                            });
                                            var Wt = F(Bn, 2);
                                            He(Wt, () => Wu, (Jt, cn) => {
                                              cn(Jt, {
                                                children: (Qe, Gt) => {
                                                  var Nt = Oe(), zn = ee(Nt);
                                                  ba(zn, 19, () => a(Ga).weeks, (Qn, Un) => `${a(Ga).value.toString()}-week-${Un}`, (Qn, Un) => {
                                                    var kn = Oe(), Dn = ee(kn);
                                                    He(Dn, () => bl, (sn, or) => {
                                                      or(sn, {
                                                        children: (Fn, Bt) => {
                                                          var un = Oe(), jt = ee(un);
                                                          ba(jt, 19, () => a(Un), (Xe, Dt) => `${Xe.toString()}-${Dt}`, (Xe, Dt) => {
                                                            var Cn = Oe(), Zt = ee(Cn);
                                                            He(Zt, () => Ju, (Xt, Kt) => {
                                                              Kt(Xt, {
                                                                get date() {
                                                                  return a(Dt);
                                                                },
                                                                get month() {
                                                                  return a(Ga).value;
                                                                },
                                                                children: (qr, pr) => {
                                                                  var oa = Oe(), xr = ee(oa);
                                                                  He(xr, () => zu, (Vr, Di) => {
                                                                    Di(Vr, {
                                                                      class: "post-history-date-picker-day",
                                                                      children: (Qo, Ti) => {
                                                                        Fs();
                                                                        var Wo = ss();
                                                                        me(() => G(Wo, a(Dt).day)), D(Qo, Wo);
                                                                      },
                                                                      $$slots: { default: !0 }
                                                                    });
                                                                  }), D(qr, oa);
                                                                },
                                                                $$slots: { default: !0 }
                                                              });
                                                            }), D(Xe, Cn);
                                                          }), D(Fn, un);
                                                        },
                                                        $$slots: { default: !0 }
                                                      });
                                                    }), D(Qn, kn);
                                                  }), D(Qe, Nt);
                                                },
                                                $$slots: { default: !0 }
                                              });
                                            }), D(Pr, Or);
                                          },
                                          $$slots: { default: !0 }
                                        });
                                      }), D(Ts, an);
                                    }), D(bn, dn);
                                  };
                                  He(wt, () => lh, (bn, Ln) => {
                                    Ln(bn, {
                                      class: "post-history-date-picker-calendar",
                                      children: $t,
                                      $$slots: { default: !0 }
                                    });
                                  });
                                }
                                D(fr, Zn);
                              },
                              $$slots: { default: !0 }
                            });
                          }), D(lt, It);
                        },
                        $$slots: { default: !0 }
                      });
                    }), D(Qr, Zs);
                  },
                  $$slots: { default: !0 }
                });
              });
            }
            var sa = F(aa, 2);
            {
              let jn = R(() => r()("postHistory.jumpToDateSubmit"));
              ir(sa, {
                type: "button",
                variant: "primary",
                contentLayout: "icon",
                shape: "square",
                get ariaLabel() {
                  return a(jn);
                },
                className: "post-history-utility-button post-history-utility-submit-button",
                onClick: () => void ls(),
                children: (Br, En) => {
                  var rr = ub();
                  D(Br, rr);
                },
                $$slots: { default: !0 }
              });
            }
            var ka = F(sa, 2);
            {
              let jn = R(() => r()("postHistory.hideJumpToDate"));
              ir(ka, {
                type: "button",
                variant: "default",
                contentLayout: "icon",
                shape: "square",
                get ariaLabel() {
                  return a(jn);
                },
                className: "post-history-utility-button post-history-utility-close-button",
                onClick: zs,
                children: (Br, En) => {
                  var rr = hb();
                  D(Br, rr);
                },
                $$slots: { default: !0 }
              });
            }
            T(nr), T(ft), me((jn) => G(tr, jn), [() => r()("postHistory.jumpToDateLabel")]), D(Ze, ft);
          };
          we(yo, (Ze) => {
            a(Ce) === "jump-date" && Ze(mo);
          });
        }
        var Ja = F(yo, 2), vs = M(Ja);
        {
          var bo = (Ze) => {
            var ft = pb(), kt = M(ft);
            Ms(kt, { variant: "spinner", showLoader: !0, loaderSize: 24 }), T(ft), D(Ze, ft);
          }, ki = (Ze) => {
            var ft = vb(), kt = M(ft), tr = M(kt, !0);
            T(kt), T(ft), me((nr) => G(tr, nr), [
              () => _.isSearchMode ? r()("postHistory.searchNoResults") : r()("postHistory.empty")
            ]), D(Ze, ft);
          }, zo = (Ze) => {
            var ft = cC(), kt = ee(ft);
            {
              var tr = (pt) => {
                var Y = yb(), st = M(Y);
                {
                  let bt = R(() => !_.canLoadNewer);
                  ir(st, {
                    type: "button",
                    variant: "default",
                    className: "post-history-nav-button",
                    contentLayout: "iconText",
                    get disabled() {
                      return a(bt);
                    },
                    onClick: () => void _a(),
                    children: (lt, Gn) => {
                      var It = gb(), An = F(ee(It));
                      me((mn) => G(An, ` ${mn ?? ""}`), [() => Ia()]), D(lt, It);
                    },
                    $$slots: { default: !0 }
                  });
                }
                T(Y), D(pt, Y);
              };
              we(kt, (pt) => {
                (_.isSearchMode ? _.canLoadNewer : _.state.hasNewerLocal && (a(X) || !Mn || _.state.listingMode !== "contiguous")) && pt(tr);
              });
            }
            var nr = F(kt, 2);
            {
              var aa = (pt) => {
                var Y = mb(), st = M(Y);
                {
                  var bt = (lt) => {
                    Ms(lt, {
                      variant: "spinner",
                      showLoader: !0,
                      loaderSize: 24,
                      ariaHidden: !0
                    });
                  };
                  we(st, (lt) => {
                    a(_r) && lt(bt);
                  });
                }
                T(Y), To(Y, (lt) => g(wn, lt), () => a(wn)), D(pt, Y);
              };
              we(nr, (pt) => {
                Mn && !_.isSearchMode && _.state.listingMode === "contiguous" && _.state.hasNewerLocal && !a(X) && pt(aa);
              });
            }
            var sa = F(nr, 2);
            ba(sa, 21, () => _.posts, (pt) => pt.eventId, (pt, Y) => {
              const st = R(() => fe.getAnchorState(a(Y)));
              var bt = Zb();
              let lt;
              var Gn = M(bt), It = M(Gn), An = M(It);
              {
                var mn = (an) => {
                  var ut = Ab(), sr = M(ut);
                  {
                    var Yn = (Qe) => {
                      var Gt = bb(), Nt = F(M(Gt), 2), zn = M(Nt, !0);
                      T(Nt);
                      var Qn = F(Nt, 2), Un = M(Qn, !0);
                      T(Qn), T(Gt), me(
                        (kn, Dn) => {
                          G(zn, kn), G(Un, Dn);
                        },
                        [
                          () => r()("postHistory.channel"),
                          () => se.getChannelText(a(Y), r())
                        ]
                      ), D(Qe, Gt);
                    };
                    we(sr, (Qe) => {
                      a(Y).kind === 42 && Qe(Yn);
                    });
                  }
                  var Pr = F(sr, 2), Mr = M(Pr);
                  {
                    var Or = (Qe) => {
                      var Gt = Pb(), Nt = M(Gt);
                      {
                        var zn = (Dn) => {
                          var sn = Cb(), or = M(sn, !0);
                          T(sn), me((Fn) => G(or, Fn), [() => r()("postHistory.deletedBadge")]), D(Dn, sn);
                        };
                        we(Nt, (Dn) => {
                          a(Y).deletedAt && Dn(zn);
                        });
                      }
                      var Qn = F(Nt, 2);
                      {
                        var Un = (Dn) => {
                          var sn = wb(), or = M(sn, !0);
                          T(sn), me((Fn) => G(or, Fn), [() => r()("postHistory.deleteFailed")]), D(Dn, sn);
                        }, kn = R(() => C(a(Y)));
                        we(Qn, (Dn) => {
                          a(kn) && Dn(Un);
                        });
                      }
                      T(Gt), D(Qe, Gt);
                    }, Bn = R(() => a(Y).deletedAt || C(a(Y)));
                    we(Mr, (Qe) => {
                      a(Bn) && Qe(Or);
                    });
                  }
                  var Wt = F(Mr, 2);
                  {
                    var Jt = (Qe) => {
                      var Gt = Eb(), Nt = ee(Gt), zn = M(Nt, !0);
                      T(Nt);
                      var Qn = F(Nt, 2);
                      {
                        let Un = R(() => de.isPostMenuOpen(a(Y).eventId));
                        He(Qn, () => Kd, (kn, Dn) => {
                          Dn(kn, {
                            get open() {
                              return a(Un);
                            },
                            onOpenChange: (sn) => Tr(a(Y).eventId, sn),
                            children: (sn, or) => {
                              var Fn = _b(), Bt = ee(Fn);
                              He(Bt, () => Vd, (jt, Xe) => {
                                Xe(jt, {
                                  class: "menu-trigger post-history-menu-trigger",
                                  "aria-label": "アクションを表示",
                                  children: (Dt, Cn) => {
                                    var Zt = xb();
                                    D(Dt, Zt);
                                  },
                                  $$slots: { default: !0 }
                                });
                              });
                              var un = F(Bt, 2);
                              He(un, () => ni, (jt, Xe) => {
                                Xe(jt, {
                                  get to() {
                                    return l;
                                  },
                                  children: (Dt, Cn) => {
                                    var Zt = Oe(), Xt = ee(Zt);
                                    He(Xt, () => jd, (Kt, qr) => {
                                      qr(Kt, {
                                        side: "bottom",
                                        align: "start",
                                        sideOffset: 8,
                                        class: "post-history-menu-content",
                                        trapFocus: !1,
                                        preventScroll: !1,
                                        onCloseAutoFocus: (pr) => pr.preventDefault(),
                                        children: (pr, oa) => {
                                          var xr = Ib(), Vr = M(xr), Di = M(Vr, !0);
                                          T(Vr);
                                          var Qo = F(Vr, 2);
                                          He(Qo, () => ts, (Za, Xs) => {
                                            Xs(Za, { class: "post-history-menu-separator" });
                                          });
                                          var Ti = F(Qo, 2);
                                          {
                                            var Wo = (Za) => {
                                              var Xs = Sb(), Jo = ee(Xs);
                                              He(Jo, () => Xn, (wo, Po) => {
                                                Po(wo, {
                                                  class: "menu-action-button",
                                                  onSelect: () => void hs(a(Y)),
                                                  children: (Xa, PC) => {
                                                    var Md = Rb(), Od = F(ee(Md), 2), Dh = M(Od, !0);
                                                    T(Od), me((Th) => G(Dh, Th), [() => r()("postHistory.showSurroundingPosts")]), D(Xa, Md);
                                                  },
                                                  $$slots: { default: !0 }
                                                });
                                              });
                                              var Mi = F(Jo, 2);
                                              He(Mi, () => ts, (wo, Po) => {
                                                Po(wo, { class: "post-history-menu-separator" });
                                              }), D(Za, Xs);
                                            };
                                            we(Ti, (Za) => {
                                              _.isSearchMode && Za(Wo);
                                            });
                                          }
                                          var kh = F(Ti, 2);
                                          {
                                            let Za = R(() => re.copyState[a(Y).eventId] === "failed"), Xs = R(() => $(a(Y))), Jo = R(() => H(a(Y))), Mi = R(() => De(a(Y))), wo = R(() => d(a(Y))), Po = R(ra);
                                            Ho(kh, {
                                              order: "standard",
                                              get copyFailed() {
                                                return a(Za);
                                              },
                                              get showBroadcast() {
                                                return a(Xs);
                                              },
                                              get broadcastSending() {
                                                return a(Jo);
                                              },
                                              get showDelete() {
                                                return a(Mi);
                                              },
                                              showDeleteSeparator: !1,
                                              get deletionSending() {
                                                return a(wo);
                                              },
                                              onCopyPointerDown: (Xa) => re.captureCopyPointerPosition(a(Y), Xa),
                                              onCopyNevent: (Xa) => void re.handleCopyNevent(a(Y), Xa),
                                              get externalClientLabel() {
                                                return a(Po);
                                              },
                                              onOpenExternalClient: () => ja(a(Y)),
                                              onShowRawJson: () => Ie(a(Y).rawEvent),
                                              onBroadcastPointerDown: (Xa) => Ct(a(Y), Xa),
                                              onBroadcastPost: (Xa) => void at(a(Y), Xa),
                                              onOpenDeleteConfirm: () => $e(a(Y))
                                            });
                                          }
                                          T(xr), me((Za) => G(Di, Za), [() => ri(a(Y).postedAt, n())]), D(pr, xr);
                                        },
                                        $$slots: { default: !0 }
                                      });
                                    }), D(Dt, Zt);
                                  },
                                  $$slots: { default: !0 }
                                });
                              }), D(sn, Fn);
                            },
                            $$slots: { default: !0 }
                          });
                        });
                      }
                      me((Un) => G(zn, Un), [() => fl(a(Y).postedAt)]), D(Qe, Gt);
                    }, cn = R(() => !(y() || x() || qt.shouldCollapsePost(a(Y))));
                    we(Wt, (Qe) => {
                      a(cn) && Qe(Jt);
                    });
                  }
                  T(Pr), T(ut), D(an, ut);
                }, wr = R(() => a(Y).kind === 42 || a(Y).deletedAt || C(a(Y)) || !(y() || x() || qt.shouldCollapsePost(a(Y))));
                we(An, (an) => {
                  a(wr) && an(mn);
                });
              }
              var fr = F(An, 2);
              {
                let an = R(ra);
                wl(fr, {
                  get state() {
                    return a(st);
                  },
                  section: "parent",
                  get previewModelByEventId() {
                    return a(yr);
                  },
                  get emojiLoadStateByUrl() {
                    return ln.emojiLoadStateByUrl;
                  },
                  get emojiImageMetaByUrl() {
                    return ln.emojiImageMetaByUrl;
                  },
                  get scrollRoot() {
                    return a(qe);
                  },
                  onImageOpen: At,
                  onToggleParent: () => Ue.preserveThreadParentToggleScroll(a(Y).eventId, a(Y).eventId, () => fe.toggleParent(a(Y))),
                  onRetryParent: () => fe.retryParent(a(Y)),
                  onToggleNodeParent: (ut) => Ue.preserveThreadParentToggleScroll(a(Y).eventId, ut, () => fe.toggleNodeParent(a(Y), ut)),
                  onRetryNodeParent: (ut) => fe.retryNodeParent(a(Y), ut),
                  onToggleNodeChildren: (ut) => fe.toggleNodeChildren(a(Y), ut),
                  onRetryNodeChildren: (ut) => fe.retryNodeChildren(a(Y), ut),
                  onCopyPointerDown: Et,
                  onCopyNevent: na,
                  get externalClientLabel() {
                    return a(an);
                  },
                  onOpenExternalClient: cs,
                  isCopyFailed: zt,
                  onShowRawJson: Ye,
                  onBroadcastPointerDown: Ka,
                  onBroadcastPost: Ya,
                  isBroadcastSending: In,
                  canDeleteNodePost: Vs,
                  isDeletionSending: As,
                  onOpenDeleteConfirm: js
                });
              }
              var Ur = F(fr, 2), Zn = M(Ur), wt = M(Zn);
              {
                const an = (Pr) => {
                  var Mr = Oe(), Or = ee(Mr);
                  {
                    var Bn = (Jt) => {
                      {
                        let cn = R(() => qt.isPostExpanded(a(Y))), Qe = R(() => "post-preview-content-" + a(Y).eventId);
                        Ff(Jt, {
                          get expanded() {
                            return a(cn);
                          },
                          get controls() {
                            return a(Qe);
                          },
                          onToggle: () => qt.togglePostExpanded(a(Y).eventId)
                        });
                      }
                    }, Wt = R(() => mr(a(Y)) && qt.shouldCollapsePost(a(Y)));
                    we(Or, (Jt) => {
                      a(Wt) && Jt(Bn);
                    });
                  }
                  D(Pr, Mr);
                };
                let ut = R(() => ds(a(Y))), sr = R(() => "post-preview-content-" + a(Y).eventId), Yn = R(() => !qt.isPostExpanded(a(Y)) && qt.shouldCollapsePost(a(Y)));
                tu(wt, {
                  get model() {
                    return a(ut);
                  },
                  density: "standard",
                  get emojiLoadStateByUrl() {
                    return ln.emojiLoadStateByUrl;
                  },
                  get emojiImageMetaByUrl() {
                    return ln.emojiImageMetaByUrl;
                  },
                  get scrollRoot() {
                    return a(qe);
                  },
                  get previewCollapseAction() {
                    return qt.previewRef;
                  },
                  get previewCollapseEventId() {
                    return a(Y).eventId;
                  },
                  get previewContentId() {
                    return a(sr);
                  },
                  get isTextCollapsed() {
                    return a(Yn);
                  },
                  onImageOpen: At,
                  betweenContentAndMedia: an,
                  $$slots: { betweenContentAndMedia: !0 }
                });
              }
              var $t = F(wt, 2);
              {
                var bn = (an) => {
                  var ut = kb();
                  ba(ut, 21, () => ta(a(Y)), (sr) => sr.eventId, (sr, Yn) => {
                    {
                      const Pr = (Or) => {
                        var Bn = Oe(), Wt = ee(Bn);
                        {
                          var Jt = (cn) => {
                            const Qe = R(() => nn(a(Yn).event)), Gt = R(() => br(a(Y).eventId, a(Qe).eventId)), Nt = R(() => r()("common.showActions"));
                            {
                              const zn = (kn) => {
                                {
                                  let Dn = R(() => re.copyState[a(Qe).eventId] === "failed"), sn = R(() => $(a(Qe))), or = R(() => H(a(Qe))), Fn = R(() => De(a(Qe))), Bt = R(() => d(a(Qe))), un = R(ra);
                                  Ho(kn, {
                                    order: "standard",
                                    get copyFailed() {
                                      return a(Dn);
                                    },
                                    get showBroadcast() {
                                      return a(sn);
                                    },
                                    get broadcastSending() {
                                      return a(or);
                                    },
                                    get showDelete() {
                                      return a(Fn);
                                    },
                                    showDeleteSeparator: !0,
                                    get deletionSending() {
                                      return a(Bt);
                                    },
                                    onCopyPointerDown: (jt) => re.captureCopyPointerPosition(a(Qe), jt),
                                    onCopyNevent: (jt) => void re.handleCopyNevent(a(Qe), jt),
                                    get externalClientLabel() {
                                      return a(un);
                                    },
                                    onOpenExternalClient: () => ja(a(Qe)),
                                    onShowRawJson: () => Ie(a(Qe).rawEvent),
                                    onBroadcastPointerDown: (jt) => Ct(a(Qe), jt),
                                    onBroadcastPost: (jt) => void at(a(Qe), jt),
                                    onOpenDeleteConfirm: () => $e(a(Qe))
                                  });
                                }
                              };
                              let Qn = R(() => de.isPostMenuOpen(a(Gt))), Un = R(() => ri(a(Qe).postedAt, n()));
                              vl(cn, {
                                get open() {
                                  return a(Qn);
                                },
                                onOpenChange: (kn) => Tr(a(Gt), kn),
                                get triggerAriaLabel() {
                                  return a(Nt);
                                },
                                get tooltipContent() {
                                  return a(Nt);
                                },
                                enableTooltip: !0,
                                get timestamp() {
                                  return a(Un);
                                },
                                items: zn,
                                $$slots: { items: !0 }
                              });
                            }
                          };
                          we(Wt, (cn) => {
                            a(Yn).status === "resolved" && cn(Jt);
                          });
                        }
                        D(Or, Bn);
                      };
                      let Mr = R(() => a(Yn).status === "resolved" ? a(yr)[a(Yn).event.id] : void 0);
                      uh(sr, {
                        get preview() {
                          return a(Yn);
                        },
                        get model() {
                          return a(Mr);
                        },
                        get emojiLoadStateByUrl() {
                          return ln.emojiLoadStateByUrl;
                        },
                        get emojiImageMetaByUrl() {
                          return ln.emojiImageMetaByUrl;
                        },
                        get scrollRoot() {
                          return a(qe);
                        },
                        onImageOpen: At,
                        onRetry: () => Re.retryQuotePreview(a(Yn).eventId),
                        footerMenu: Pr,
                        $$slots: { footerMenu: !0 }
                      });
                    }
                  }), T(ut), D(an, ut);
                }, Ln = R(() => ta(a(Y)).length > 0);
                we($t, (an) => {
                  a(Ln) && an(bn);
                });
              }
              T(Zn);
              var ar = F(Zn, 2);
              {
                var Qt = (an) => {
                  const ut = R(() => K(a(Y))), sr = R(() => a(st).repliesActionState.status === "loaded" && a(st).repliesActionState.replyCount > 0);
                  var Yn = Qb(), Pr = ee(Yn);
                  {
                    const Wt = (Gt) => {
                      var Nt = Ob(), zn = ee(Nt), Qn = M(zn);
                      {
                        var Un = (Xe) => {
                          {
                            let Dt = R(() => r()("replyQuote.reply_label")), Cn = R(() => r()("replyQuote.reply_label"));
                            Ni(Xe, {
                              type: "button",
                              className: "post-preview-action-button post-history-action-button",
                              get ariaLabel() {
                                return a(Dt);
                              },
                              contentLayout: "icon",
                              shape: "circle",
                              onClick: () => ks(a(Y)),
                              get tooltipContent() {
                                return a(Cn);
                              },
                              children: (Zt, Xt) => {
                                var Kt = Db();
                                D(Zt, Kt);
                              },
                              $$slots: { default: !0 }
                            });
                          }
                        };
                        we(Qn, (Xe) => {
                          y() && Xe(Un);
                        });
                      }
                      var kn = F(Qn, 2), Dn = M(kn);
                      {
                        var sn = (Xe) => {
                          Pd(Xe, {
                            get count() {
                              return a(st).repliesActionState.replyCount;
                            },
                            get selected() {
                              return a(st).repliesActionState.visible;
                            },
                            get ariaLabel() {
                              return a(ut);
                            },
                            get tooltipContent() {
                              return a(ut);
                            },
                            onClick: () => ke(a(Y))
                          });
                        };
                        we(Dn, (Xe) => {
                          a(sr) && Xe(sn);
                        });
                      }
                      T(kn), T(zn);
                      var or = F(zn, 2);
                      {
                        var Fn = (Xe) => {
                          {
                            let Dt = R(() => r()("replyQuote.quote_label")), Cn = R(() => r()("replyQuote.quote_label"));
                            Ni(Xe, {
                              type: "button",
                              className: "post-preview-action-button post-history-action-button",
                              get ariaLabel() {
                                return a(Dt);
                              },
                              contentLayout: "icon",
                              shape: "circle",
                              onClick: () => Ds(a(Y)),
                              get tooltipContent() {
                                return a(Cn);
                              },
                              children: (Zt, Xt) => {
                                var Kt = Tb();
                                D(Zt, Kt);
                              },
                              $$slots: { default: !0 }
                            });
                          }
                        };
                        we(or, (Xe) => {
                          x() && Xe(Fn);
                        });
                      }
                      var Bt = F(or, 2), un = M(Bt);
                      {
                        var jt = (Xe) => {
                          {
                            let Dt = R(() => ce(a(Y))), Cn = R(() => z(a(Y))), Zt = R(() => ce(a(Y)));
                            Ni(Xe, {
                              type: "button",
                              className: "post-preview-reactions-button",
                              get ariaLabel() {
                                return a(Dt);
                              },
                              shape: "pill",
                              get selected() {
                                return a(Cn);
                              },
                              onClick: () => Se(a(Y)),
                              get tooltipContent() {
                                return a(Zt);
                              },
                              children: (Xt, Kt) => {
                                var qr = Mb(), pr = F(ee(qr), 2), oa = M(pr, !0);
                                T(pr), me(() => G(oa, a(st).reactionSummary.totalCount)), D(Xt, qr);
                              },
                              $$slots: { default: !0 }
                            });
                          }
                        };
                        we(un, (Xe) => {
                          a(st).reactionSummary.totalCount > 0 && Xe(jt);
                        });
                      }
                      T(Bt), D(Gt, Nt);
                    }, Jt = (Gt) => {
                      const Nt = R(() => r()("common.showActions"));
                      {
                        const zn = (kn) => {
                          var Dn = $b(), sn = ee(Dn);
                          He(sn, () => Xn, (Xe, Dt) => {
                            Dt(Xe, {
                              class: "menu-action-button",
                              onSelect: () => ja(a(Y)),
                              children: (Cn, Zt) => {
                                var Xt = Lb(), Kt = F(ee(Xt), 2), qr = M(Kt, !0);
                                T(Kt), me((pr) => G(qr, pr), [() => ra()]), D(Cn, Xt);
                              },
                              $$slots: { default: !0 }
                            });
                          });
                          var or = F(sn, 2);
                          He(or, () => ts, (Xe, Dt) => {
                            Dt(Xe, { class: "post-history-menu-separator" });
                          });
                          var Fn = F(or, 2);
                          {
                            let Xe = R(() => a(st).repliesActionState.status === "loading");
                            He(Fn, () => Xn, (Dt, Cn) => {
                              Cn(Dt, {
                                class: "menu-action-button",
                                get disabled() {
                                  return a(Xe);
                                },
                                onSelect: () => ke(a(Y)),
                                children: (Zt, Xt) => {
                                  var Kt = Fb(), qr = ee(Kt), pr = F(qr, 2), oa = M(pr, !0);
                                  T(pr), me(() => {
                                    Oa(qr, 1, `${a(st).repliesActionState.visible ? "collapse-content-icon" : "find_in_page-icon"} svg-icon`, "svelte-uxr0i8"), G(oa, a(ut));
                                  }), D(Zt, Kt);
                                },
                                $$slots: { default: !0 }
                              });
                            });
                          }
                          var Bt = F(Fn, 2);
                          {
                            var un = (Xe) => {
                              var Dt = Oe(), Cn = ee(Dt);
                              He(Cn, () => Xn, (Zt, Xt) => {
                                Xt(Zt, {
                                  class: "menu-action-button",
                                  onSelect: () => void hs(a(Y)),
                                  children: (Kt, qr) => {
                                    var pr = Hb(), oa = F(ee(pr), 2), xr = M(oa, !0);
                                    T(oa), me((Vr) => G(xr, Vr), [() => r()("postHistory.showSurroundingPosts")]), D(Kt, pr);
                                  },
                                  $$slots: { default: !0 }
                                });
                              }), D(Xe, Dt);
                            };
                            we(Bt, (Xe) => {
                              _.isSearchMode && Xe(un);
                            });
                          }
                          var jt = F(Bt, 2);
                          {
                            let Xe = R(() => re.copyState[a(Y).eventId] === "failed"), Dt = R(() => $(a(Y))), Cn = R(() => H(a(Y))), Zt = R(() => De(a(Y))), Xt = R(() => d(a(Y)));
                            Ho(jt, {
                              order: "standard",
                              get copyFailed() {
                                return a(Xe);
                              },
                              get showBroadcast() {
                                return a(Dt);
                              },
                              get broadcastSending() {
                                return a(Cn);
                              },
                              get showDelete() {
                                return a(Zt);
                              },
                              showDeleteSeparator: !0,
                              get deletionSending() {
                                return a(Xt);
                              },
                              onCopyPointerDown: (Kt) => re.captureCopyPointerPosition(a(Y), Kt),
                              onCopyNevent: (Kt) => void re.handleCopyNevent(a(Y), Kt),
                              onShowRawJson: () => Ie(a(Y).rawEvent),
                              onBroadcastPointerDown: (Kt) => Ct(a(Y), Kt),
                              onBroadcastPost: (Kt) => void at(a(Y), Kt),
                              onOpenDeleteConfirm: () => $e(a(Y))
                            });
                          }
                          D(kn, Dn);
                        };
                        let Qn = R(() => de.isPostMenuOpen(a(Y).eventId)), Un = R(() => ri(a(Y).postedAt, n()));
                        vl(Gt, {
                          get open() {
                            return a(Qn);
                          },
                          onOpenChange: (kn) => Tr(a(Y).eventId, kn),
                          get triggerAriaLabel() {
                            return a(Nt);
                          },
                          get tooltipContent() {
                            return a(Nt);
                          },
                          enableTooltip: !0,
                          get timestamp() {
                            return a(Un);
                          },
                          items: zn,
                          $$slots: { items: !0 }
                        });
                      }
                    };
                    let cn = R(() => fl(a(Y).postedAt)), Qe = R(() => !!a(Y).deletedAt);
                    Cu(Pr, {
                      get formattedDate() {
                        return a(cn);
                      },
                      get dimmed() {
                        return a(Qe);
                      },
                      actions: Wt,
                      trailing: Jt,
                      $$slots: { actions: !0, trailing: !0 }
                    });
                  }
                  var Mr = F(Pr, 2);
                  {
                    var Or = (Wt) => {
                      var Jt = zb();
                      ba(Jt, 21, () => Fe(a(Y)), (cn) => cn.content, (cn, Qe) => {
                        var Gt = Yb(), Nt = M(Gt), zn = M(Nt);
                        {
                          var Qn = (Bt) => {
                            var un = Nb();
                            D(Bt, un);
                          }, Un = R(() => S0(a(Qe).content)), kn = (Bt) => {
                            var un = Oe(), jt = ee(un);
                            {
                              var Xe = (Zt) => {
                                var Xt = Bb(), Kt = M(Xt, !0);
                                T(Xt), me(() => G(Kt, a(Qe).content)), D(Zt, Xt);
                              }, Dt = R(() => Nn(a(Qe).emojiUrl)), Cn = (Zt) => {
                                var Xt = Vb(), Kt = M(Xt);
                                {
                                  var qr = (xr) => {
                                    var Vr = Ub();
                                    me(() => {
                                      Hn(Vr, "src", a(Qe).emojiUrl), Hn(Vr, "alt", a(Qe).content), Hn(Vr, "title", a(Qe).content);
                                    }), D(xr, Vr);
                                  }, pr = R(() => ur(a(Qe).emojiUrl)), oa = (xr) => {
                                    var Vr = qb();
                                    D(xr, Vr);
                                  };
                                  we(Kt, (xr) => {
                                    a(pr) ? xr(qr) : xr(oa, -1);
                                  });
                                }
                                T(Xt), me((xr) => xi(Xt, xr), [
                                  () => Zr(a(Qe).emojiUrl)
                                ]), D(Zt, Xt);
                              };
                              we(jt, (Zt) => {
                                a(Dt) ? Zt(Xe) : Zt(Cn, -1);
                              });
                            }
                            D(Bt, un);
                          }, Dn = (Bt) => {
                            var un = jb(), jt = M(un, !0);
                            T(un), me(() => G(jt, a(Qe).content)), D(Bt, un);
                          };
                          we(zn, (Bt) => {
                            a(Un) ? Bt(Qn) : a(Qe).emojiUrl ? Bt(kn, 1) : Bt(Dn, -1);
                          });
                        }
                        var sn = F(zn, 2), or = M(sn, !0);
                        T(sn), T(Nt);
                        var Fn = F(Nt, 2);
                        ba(Fn, 21, () => a(Qe).reactors, (Bt) => Bt.eventId, (Bt, un) => {
                          const jt = R(() => le(a(un)));
                          var Xe = Kb(), Dt = M(Xe);
                          {
                            let Cn = R(() => a(un).profile?.picture || "");
                            If(Dt, {
                              get src() {
                                return a(Cn);
                              },
                              get alt() {
                                return a(jt);
                              },
                              rootClassName: "post-preview-reaction-avatar",
                              imageClassName: "post-preview-reaction-avatar-image",
                              fallbackClassName: "post-preview-reaction-avatar-fallback",
                              get fallbackAriaLabel() {
                                return a(jt);
                              },
                              fallbackDelayMs: 0
                            });
                          }
                          T(Xe), me(() => {
                            Hn(Xe, "title", a(jt)), Hn(Xe, "aria-label", a(jt));
                          }), D(Bt, Xe);
                        }), T(Fn), T(Gt), me(() => G(or, a(Qe).count)), D(cn, Gt);
                      }), T(Jt), D(Wt, Jt);
                    }, Bn = R(() => a(st).reactionSummary.totalCount > 0 && z(a(Y)));
                    we(Mr, (Wt) => {
                      a(Bn) && Wt(Or);
                    });
                  }
                  D(an, Yn);
                }, dn = R(() => y() || x() || qt.shouldCollapsePost(a(Y)) || $(a(Y)) || a(st).reactionSummary.totalCount > 0 || a(st).repliesActionState.status === "loaded" && a(st).repliesActionState.replyCount > 0);
                we(ar, (an) => {
                  a(dn) && an(Qt);
                });
              }
              var Kn = F(ar, 2);
              {
                let an = R(ra);
                wl(Kn, {
                  get state() {
                    return a(st);
                  },
                  section: "children",
                  get previewModelByEventId() {
                    return a(yr);
                  },
                  get emojiLoadStateByUrl() {
                    return ln.emojiLoadStateByUrl;
                  },
                  get emojiImageMetaByUrl() {
                    return ln.emojiImageMetaByUrl;
                  },
                  get scrollRoot() {
                    return a(qe);
                  },
                  onImageOpen: At,
                  onToggleNodeParent: (ut) => Ue.preserveThreadParentToggleScroll(a(Y).eventId, ut, () => fe.toggleNodeParent(a(Y), ut)),
                  onRetryNodeParent: (ut) => fe.retryNodeParent(a(Y), ut),
                  onToggleNodeChildren: (ut) => fe.toggleNodeChildren(a(Y), ut),
                  onRetryNodeChildren: (ut) => fe.retryNodeChildren(a(Y), ut),
                  onCopyPointerDown: Et,
                  onCopyNevent: na,
                  get externalClientLabel() {
                    return a(an);
                  },
                  onOpenExternalClient: cs,
                  isCopyFailed: zt,
                  onShowRawJson: Ye,
                  onBroadcastPointerDown: Ka,
                  onBroadcastPost: Ya,
                  isBroadcastSending: In,
                  canDeleteNodePost: Vs,
                  isDeletionSending: As,
                  onOpenDeleteConfirm: js
                });
              }
              T(Ur), T(It);
              var Wr = F(It, 2);
              {
                var Ts = (an) => {
                  var ut = Gb(), sr = M(ut);
                  {
                    var Yn = (Bn) => {
                      var Wt = Wb(), Jt = M(Wt, !0);
                      T(Wt), me((cn) => G(Jt, cn), [() => r()("postHistory.deletedBadge")]), D(Bn, Wt);
                    };
                    we(sr, (Bn) => {
                      a(Y).deletedAt && Bn(Yn);
                    });
                  }
                  var Pr = F(sr, 2);
                  {
                    var Mr = (Bn) => {
                      var Wt = Jb(), Jt = M(Wt, !0);
                      T(Wt), me((cn) => G(Jt, cn), [() => r()("postHistory.deleteFailed")]), D(Bn, Wt);
                    }, Or = R(() => C(a(Y)));
                    we(Pr, (Bn) => {
                      a(Or) && Bn(Mr);
                    });
                  }
                  T(ut), D(an, ut);
                }, Ga = R(() => !(y() || qt.shouldCollapsePost(a(Y))) && (a(Y).deletedAt || C(a(Y))));
                we(Wr, (an) => {
                  a(Ga) && an(Ts);
                });
              }
              T(Gn), T(bt), me(() => {
                lt = Oa(bt, 1, "post-history-item svelte-uxr0i8", null, lt, { "post-history-item-deleted": !!a(Y).deletedAt }), Hn(bt, "data-post-history-event-id", a(Y).eventId), Hn(bt, "data-post-history-posted-at", a(Y).postedAt), Hn(Ur, "data-post-history-thread-anchor-scope-id", a(Y).eventId), Hn(Ur, "data-post-history-thread-anchor-event-id", a(Y).eventId);
              }), D(pt, bt);
            }), T(sa);
            var ka = F(sa, 2);
            {
              var jn = (pt) => {
                var Y = Xb(), st = M(Y);
                {
                  var bt = (lt) => {
                    Ms(lt, {
                      variant: "spinner",
                      showLoader: !0,
                      loaderSize: 24,
                      ariaHidden: !0
                    });
                  };
                  we(st, (lt) => {
                    a(Pn) && lt(bt);
                  });
                }
                T(Y), To(Y, (lt) => g(qn, lt), () => a(qn)), D(pt, Y);
              };
              we(ka, (pt) => {
                Mn && !_.isSearchMode && _.state.listingMode === "contiguous" && _.state.hasOlderLocal && !_.showSavedPostsBoundary && pt(jn);
              });
            }
            var Br = F(ka, 2);
            {
              var En = (pt) => {
                var Y = eC(), st = M(Y), bt = M(st, !0);
                T(st);
                var lt = F(st, 2), Gn = M(lt, !0);
                T(lt), T(Y), me(
                  (It, An) => {
                    G(bt, It), G(Gn, An);
                  },
                  [
                    () => r()("postHistory.savedOlderPostsShowing"),
                    () => r()("postHistory.savedOlderPostsGapNotice")
                  ]
                ), D(pt, Y);
              };
              we(Br, (pt) => {
                _.isShowingSavedOlderPosts && pt(En);
              });
            }
            var rr = F(Br, 2);
            {
              var Qr = (pt) => {
                var Y = rC(), st = M(Y), bt = M(st);
                {
                  var lt = (It) => {
                    {
                      let An = R(() => _.isFetchingFromRelays || _.isRefetchingAroundCurrentView);
                      ir(It, {
                        type: "button",
                        variant: "primary",
                        className: "post-history-nav-button",
                        contentLayout: "iconText",
                        get disabled() {
                          return a(An);
                        },
                        onClick: () => void ea(),
                        children: (mn, wr) => {
                          var fr = tC(), Ur = F(ee(fr));
                          me((Zn) => G(Ur, ` ${Zn ?? ""}`), [() => r()("postHistory.fetchOlderFromRelays")]), D(mn, fr);
                        },
                        $$slots: { default: !0 }
                      });
                    }
                  };
                  we(bt, (It) => {
                    (_.canFetchOlderFromRelays || _.isFetchingFromRelays) && It(lt);
                  });
                }
                var Gn = F(bt, 2);
                ir(Gn, {
                  type: "button",
                  variant: "default",
                  className: "post-history-nav-button",
                  contentLayout: "iconText",
                  onClick: () => void is(),
                  children: (It, An) => {
                    var mn = nC(), wr = F(ee(mn));
                    me((fr) => G(wr, ` ${fr ?? ""}`), [() => r()("postHistory.showSavedOlderPosts")]), D(It, mn);
                  },
                  $$slots: { default: !0 }
                }), T(st), T(Y), D(pt, Y);
              }, ys = (pt) => {
                var Y = sC(), st = M(Y);
                {
                  let bt = R(() => !_.canLoadOlder);
                  ir(st, {
                    type: "button",
                    variant: "default",
                    className: "post-history-nav-button",
                    contentLayout: "iconText",
                    get disabled() {
                      return a(bt);
                    },
                    onClick: () => void gn(),
                    children: (lt, Gn) => {
                      var It = aC(), An = F(ee(It));
                      me((mn) => G(An, ` ${mn ?? ""}`), [() => Sa()]), D(lt, It);
                    },
                    $$slots: { default: !0 }
                  });
                }
                T(Y), D(pt, Y);
              }, Zs = (pt) => {
                var Y = iC(), st = M(Y);
                {
                  let bt = R(() => !_.canLoadOlder);
                  ir(st, {
                    type: "button",
                    variant: "default",
                    className: "post-history-nav-button",
                    contentLayout: "iconText",
                    get disabled() {
                      return a(bt);
                    },
                    onClick: () => void gn(),
                    children: (lt, Gn) => {
                      var It = oC(), An = F(ee(It));
                      me((mn) => G(An, ` ${mn ?? ""}`), [() => Sa()]), D(lt, It);
                    },
                    $$slots: { default: !0 }
                  });
                }
                T(Y), D(pt, Y);
              }, ms = (pt) => {
                var Y = dC(), st = M(Y);
                {
                  var bt = (lt) => {
                    {
                      let Gn = R(() => _.isFetchingFromRelays || _.isRefetchingAroundCurrentView);
                      ir(lt, {
                        type: "button",
                        variant: "primary",
                        className: "post-history-nav-button",
                        contentLayout: "iconText",
                        get disabled() {
                          return a(Gn);
                        },
                        onClick: () => void ea(),
                        children: (It, An) => {
                          var mn = Oe(), wr = ee(mn);
                          {
                            var fr = (Zn) => {
                              {
                                let wt = R(() => r()("postHistory.fetchOlderFromRelaysLoading"));
                                Ms(Zn, {
                                  get text() {
                                    return a(wt);
                                  },
                                  showLoader: !0,
                                  loaderSize: 28,
                                  customClass: "post-history-nav-loading-placeholder"
                                });
                              }
                            }, Ur = (Zn) => {
                              var wt = lC(), $t = F(ee(wt));
                              me((bn) => G($t, ` ${bn ?? ""}`), [() => r()("postHistory.fetchOlderFromRelays")]), D(Zn, wt);
                            };
                            we(wr, (Zn) => {
                              _.isFetchingOlderFromRelays ? Zn(fr) : Zn(Ur, -1);
                            });
                          }
                          D(It, mn);
                        },
                        $$slots: { default: !0 }
                      });
                    }
                  };
                  we(st, (lt) => {
                    (_.canFetchOlderFromRelays || _.isFetchingFromRelays || _.isRefetchingAroundCurrentView) && lt(bt);
                  });
                }
                T(Y), D(pt, Y);
              };
              we(rr, (pt) => {
                _.showSavedPostsBoundary ? pt(Qr) : _.isSearchMode && _.canLoadOlder ? pt(ys, 1) : !_.isSearchMode && _.state.hasOlderLocal && (_.state.listingMode === "sparse" || !Mn) ? pt(Zs, 2) : _.showLocalExhaustedState && pt(ms, 3);
              });
            }
            D(Ze, ft);
          };
          we(vs, (Ze) => {
            _.posts.length === 0 && a(On) ? Ze(bo) : a(ha) ? Ze(ki, 1) : Ze(zo, -1);
          });
        }
        T(Ja), To(Ja, (Ze) => g(qe, Ze), () => a(qe));
        var gs = F(Ja, 2);
        {
          var Gs = (Ze) => {
            var ft = hC(), kt = M(ft);
            {
              let tr = R(() => r()("postHistory.returnToLatest"));
              ir(kt, {
                type: "button",
                variant: "default",
                shape: "circle",
                className: "post-history-latest-button",
                contentLayout: "icon",
                get ariaLabel() {
                  return a(tr);
                },
                onClick: () => void ga(),
                children: (nr, aa) => {
                  var sa = uC();
                  D(nr, sa);
                },
                $$slots: { default: !0 }
              });
            }
            T(ft), D(Ze, ft);
          };
          we(gs, (Ze) => {
            a(gr) && Ze(Gs);
          });
        }
        var Co = F(gs, 2);
        hh(Co, {
          get open() {
            return a(L);
          },
          get ownerPubkeyHex() {
            return f();
          },
          getCurrentPubkeyHex: () => f(),
          onOpenChange: (Ze) => g(L, Ze, !0),
          onImported: ve
        });
        var Ah = F(Co, 2);
        Of(Ah, {
          get open() {
            return a(Le);
          },
          get rawEvent() {
            return a(We);
          },
          onOpenChange: (Ze) => g(Le, Ze, !0)
        }), me(() => {
          Oa(Ja, 1, `post-history-container${Mn && !_.isSearchMode && _.state.listingMode === "contiguous" ? " post-history-auto-load-enabled" : ""}`, "svelte-uxr0i8"), Hn(Ja, "aria-busy", a(Vn) || a(Pn) ? "true" : "false");
        }), Mo("scroll", Ja, function(...Ze) {
          Ue.handleHistoryScroll?.apply(this, Ze);
        }), D(ye, rn);
      },
      $$slots: { footer: !0, default: !0 }
    });
  }
  var Aa = F(Fr, 2);
  {
    const h = (Vt) => {
      var yn = pC(), er = M(yn), Cr = M(er, !0);
      T(er);
      var $r = F(er, 2), ma = M($r, !0);
      T($r), T(yn), me(
        (ps, Nr) => {
          G(Cr, ps), G(ma, Nr);
        },
        [
          () => r()("postHistory.deleteRequestDescription"),
          () => r()("postHistory.deleteRequestWarning")
        ]
      ), D(Vt, yn);
    };
    let U = R(() => r()("postHistory.deleteRequestTitle")), Pe = R(() => r()("postHistory.deleteRequestDescription")), ye = R(() => de.deleteTargetPost && d(de.deleteTargetPost) ? r()("postHistory.deleteSending") : r()("postHistory.deleteConfirm")), yt = R(() => r()("postHistory.deleteCancel")), rn = R(() => de.deleteTargetPost ? d(de.deleteTargetPost) : !1);
    Nd(Aa, {
      get open() {
        return de.deleteConfirmOpen;
      },
      get onOpenChange() {
        return de.setDeleteConfirmOpen;
      },
      get title() {
        return a(U);
      },
      get description() {
        return a(Pe);
      },
      get confirmLabel() {
        return a(ye);
      },
      get cancelLabel() {
        return a(yt);
      },
      confirmVariant: "danger",
      get confirmDisabled() {
        return a(rn);
      },
      onConfirm: et,
      onCancel: uo,
      contentClass: "post-history-delete-confirm",
      children: h,
      $$slots: { default: !0 }
    });
  }
  var Qa = F(Aa, 2);
  {
    const h = (rn) => {
      var Vt = vC(), yn = M(Vt), er = M(yn, !0);
      T(yn), T(Vt), me((Cr) => G(er, Cr), [() => r()("postHistory.deleteLocalHistoryDescription")]), D(rn, Vt);
    };
    let U = R(() => r()("postHistory.deleteLocalHistoryTitle")), Pe = R(() => r()("postHistory.deleteLocalHistoryDescription")), ye = R(() => r()("postHistory.deleteLocalHistoryConfirm")), yt = R(() => r()("postHistory.deleteLocalHistoryCancel"));
    Nd(Qa, {
      get title() {
        return a(U);
      },
      get description() {
        return a(Pe);
      },
      get confirmLabel() {
        return a(ye);
      },
      get cancelLabel() {
        return a(yt);
      },
      confirmVariant: "danger",
      onConfirm: Jn,
      onCancel: Te,
      closeOnConfirm: !1,
      preventCloseWhileConfirming: !0,
      showConfirmSpinner: !0,
      contentClass: "post-history-local-delete-confirm",
      get open() {
        return a(ie);
      },
      set open(rn) {
        g(ie, rn, !0);
      },
      children: h,
      $$slots: { default: !0 }
    });
  }
  var Qs = F(Qa, 2);
  {
    let h = R(() => a(dt)[a(Rt)]?.src ?? ""), U = R(() => a(dt)[a(Rt)]?.alt ?? "");
    wf(Qs, {
      get src() {
        return a(h);
      },
      get alt() {
        return a(U);
      },
      onClose: Ke,
      get mediaList() {
        return a(dt);
      },
      get currentIndex() {
        return a(Rt);
      },
      onNavigate: _n,
      get show() {
        return a($n);
      },
      set show(Pe) {
        g($n, Pe, !0);
      }
    });
  }
  var fs = F(Qs, 2);
  $i(fs, {
    get show() {
      return re.showCopyFloatingMessage;
    },
    get x() {
      return re.copyFloatingMessageX;
    },
    get y() {
      return re.copyFloatingMessageY;
    },
    children: (h, U) => {
      var Pe = gC(), ye = M(Pe, !0);
      T(Pe), me((yt) => G(ye, yt), [() => r()("postHistory.copied")]), D(h, Pe);
    },
    $$slots: { default: !0 }
  });
  var fo = F(fs, 2);
  $i(fo, {
    get show() {
      return a(Pt);
    },
    get x() {
      return a(vt);
    },
    get y() {
      return a(_t);
    },
    children: (h, U) => {
      var Pe = yC(), ye = M(Pe, !0);
      T(Pe), me((yt) => G(ye, yt), [() => r()(a(gt))]), D(h, Pe);
    },
    $$slots: { default: !0 }
  });
  var Hr = F(fo, 2);
  $i(Hr, {
    get show() {
      return a(Ae);
    },
    variant: "top-right",
    children: (h, U) => {
      var Pe = mC(), ye = M(Pe, !0);
      T(Pe), me((yt) => G(ye, yt), [
        () => r()(a(ot), { values: a(ht) })
      ]), D(h, Pe);
    },
    $$slots: { default: !0 }
  }), D(t, za);
  var Ws = Lt(ya);
  return s(), Ws;
}
pu(["click"]);
Ft(
  wC,
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
  wC as default
};
