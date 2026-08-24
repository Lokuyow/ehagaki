import { c0 as is, c1 as $a, c2 as Zu, c3 as fc, c4 as es, aI as vc, c5 as Vo, c6 as jo, c7 as vo, c8 as po, c9 as pc, aH as gc, ca as Ko, cb as yc, aG as Fs, cc as si, cd as id, aN as mc, aF as Ht, ce as Xu, aD as Yo, cf as bc, aE as sr, cg as Xi, ai as Cc, aK as Ia, ch as el, I as E, aQ as Dt, aO as _e, K as me, aR as Pt, aS as Or, aT as gr, aU as yr, ci as eh, cj as th, ck as zo, cl as Li, cm as wc, cn as Hi, co as nh, b1 as Hs, aP as Zr, cp as rh, a_ as De, b_ as ah, H as _a, Q as Ss, V as rs, $ as Is, cq as Pc, cr as $i, cs as Ni, bc as xc, bT as Sc, N as Cn, M as Na, aZ as ar, a4 as Ge, ct as $s, cu as tl, A as sh, bU as Ns, L as Bi, O as Qo, cv as oh, cw as ih, cx as lh, b$ as Ro, cy as dh, cz as ch, cA as uh, cB as hh, cC as Ic, cD as nl, cE as La, cF as Wo, cG as _o, W as da, R as wn, cH as fh, cI as vh, cJ as ph, cK as gh, b7 as yh, cL as To, cM as mh, w as Rc, cN as rl, cO as al, cP as sl, cQ as _c, cR as Jo, cS as qi, cT as ld, cU as bh, cV as Ch, cW as Ms, cX as Eo, cY as wh, cZ as Ec, c_ as ol, c$ as Oa, d0 as ts, d1 as Ph, d2 as Ac, d3 as il, d4 as ll, d5 as xh, d6 as dd, d7 as Sh, d8 as Dc, d9 as cd, da as Ih, db as oi, dc as ii, dd as kc, de as Rh, df as _h, dg as Eh, dh as Tc, di as Ah, dj as Dh, dk as li, dl as kh, dm as dl, dn as Mc, dp as Oc, dq as Fc, bb as Th, dr as Mh, ds as ud, dt as Oh, du as Fh, dv as Lc, dw as Go, dx as cl, dy as Lh, dz as Hh, dA as $h, aX as Nh, dB as Bh, aA as hd, al as qh, aB as di, dC as fd, bB as Uh, S as Zs, dD as Vh, dE as jh, s as vd, ba as Kh, ay as Yh } from "./App-2yO7FIhW.js";
import { aN as Ue, u as Xr, aP as S, a, b as w, aQ as be, aJ as Jn, aY as zh, b5 as Fr, a_ as xt, a$ as Ee, b0 as Z, b1 as D, b2 as St, b3 as R, b8 as U, b6 as M, n as mr, bf as Ba, Z as ge, bg as J, b7 as A, b4 as It, bd as L, bh as ws, ap as Ao, bj as oo, aq as Hc, bi as $c, aZ as Za } from "./entry-tn6az_XN.js";
import { b as Qh } from "./input-MkVV3LeH.js";
import { D as Nc, a as Bc } from "./DialogWrapper-DqB9O7tX.js";
import { M as Vn, a as Fa, P as qc, b as Ui, u as Wh, c as Jh, d as Gh, p as Zh, e as pd, D as gd, f as yd, g as md, h as Xh, r as ef, i as tf, j as ci } from "./postBroadcastService-BuaHFsry.js";
import { H as nf } from "./hidden-input-ABiYnmDv.js";
import { P as rf, b as af, a as sf } from "./popover-trigger-DjEAHwna.js";
function ui(t, e) {
  return t - e * Math.floor(t / e);
}
const Uc = 1721426;
function wo(t, e, n, r) {
  e = ul(t, e);
  let i = e - 1, s = -2;
  return n <= 2 ? s = 0 : Do(e) && (s = -1), Uc - 1 + 365 * i + Math.floor(i / 4) - Math.floor(i / 100) + Math.floor(i / 400) + Math.floor((367 * n - 362) / 12 + s + r);
}
function Do(t) {
  return t % 4 === 0 && (t % 100 !== 0 || t % 400 === 0);
}
function ul(t, e) {
  return t === "BC" ? 1 - e : e;
}
function of(t) {
  let e = "AD";
  return t <= 0 && (e = "BC", t = 1 - t), [
    e,
    t
  ];
}
const lf = {
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
class Ls {
  fromJulianDay(e) {
    let n = e, r = n - Uc, i = Math.floor(r / 146097), s = ui(r, 146097), l = Math.floor(s / 36524), u = ui(s, 36524), h = Math.floor(u / 1461), b = ui(u, 1461), g = Math.floor(b / 365), y = i * 400 + l * 100 + h * 4 + g + (l !== 4 && g !== 4 ? 1 : 0), [x, f] = of(y), _ = n - wo(x, f, 1, 1), C = 2;
    n < wo(x, f, 3, 1) ? C = 0 : Do(f) && (C = 1);
    let m = Math.floor(((_ + C) * 12 + 373) / 367), o = n - wo(x, f, m, 1) + 1;
    return new os(x, f, m, o);
  }
  toJulianDay(e) {
    return wo(e.era, e.year, e.month, e.day);
  }
  getDaysInMonth(e) {
    return lf[Do(e.year) ? "leapyear" : "standard"][e.month - 1];
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getMonthsInYear(e) {
    return 12;
  }
  getDaysInYear(e) {
    return Do(e.year) ? 366 : 365;
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
const df = {
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
function Xa(t, e) {
  return e = Vr(e, t.calendar), t.era === e.era && t.year === e.year && t.month === e.month && t.day === e.day;
}
function hl(t, e) {
  return e = Vr(e, t.calendar), t = Vi(t), e = Vi(e), t.era === e.era && t.year === e.year && t.month === e.month;
}
function cf(t, e) {
  var n, r, i, s;
  return (s = (i = (n = t.isEqual) === null || n === void 0 ? void 0 : n.call(t, e)) !== null && i !== void 0 ? i : (r = e.isEqual) === null || r === void 0 ? void 0 : r.call(e, t)) !== null && s !== void 0 ? s : t.identifier === e.identifier;
}
function uf(t, e) {
  return Xa(t, ff(e));
}
function Vc(t, e, n) {
  let r = t.calendar.toJulianDay(t), i = yf(e), s = Math.ceil(r + 1 - i) % 7;
  return s < 0 && (s += 7), s;
}
function hf(t) {
  return Sa(Date.now(), t);
}
function ff(t) {
  return Cf(hf(t));
}
function jc(t, e) {
  return t.calendar.toJulianDay(t) - e.calendar.toJulianDay(e);
}
function vf(t, e) {
  return bd(t) - bd(e);
}
function bd(t) {
  return t.hour * 36e5 + t.minute * 6e4 + t.second * 1e3 + t.millisecond;
}
let hi = null;
function ns() {
  return hi == null && (hi = new Intl.DateTimeFormat().resolvedOptions().timeZone), hi;
}
function Vi(t) {
  return t.subtract({
    days: t.day - 1
  });
}
function pf(t) {
  return t.add({
    days: t.calendar.getDaysInMonth(t) - t.day
  });
}
const Cd = /* @__PURE__ */ new Map(), fi = /* @__PURE__ */ new Map();
function gf(t) {
  if (Intl.Locale) {
    let n = Cd.get(t);
    return n || (n = new Intl.Locale(t).maximize().region, n && Cd.set(t, n)), n;
  }
  let e = t.split("-")[1];
  return e === "u" ? void 0 : e;
}
function yf(t) {
  let e = fi.get(t);
  if (!e) {
    if (Intl.Locale) {
      let r = new Intl.Locale(t);
      if ("getWeekInfo" in r && (e = r.getWeekInfo(), e))
        return fi.set(t, e), e.firstDay;
    }
    let n = gf(t);
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
      firstDay: n && df[n] || 0
    };
    fi.set(t, e);
  }
  return e.firstDay;
}
function as(t) {
  t = Vr(t, new Ls());
  let e = ul(t.era, t.year);
  return Kc(e, t.month, t.day, t.hour, t.minute, t.second, t.millisecond);
}
function Kc(t, e, n, r, i, s, l) {
  let u = /* @__PURE__ */ new Date();
  return u.setUTCHours(r, i, s, l), u.setUTCFullYear(t, e - 1, n), u.getTime();
}
function ho(t, e) {
  if (e === "UTC") return 0;
  if (t > 0 && e === ns()) return new Date(t).getTimezoneOffset() * -6e4;
  let { year: n, month: r, day: i, hour: s, minute: l, second: u } = Yc(t, e);
  return Kc(n, r, i, s, l, u, 0) - Math.floor(t / 1e3) * 1e3;
}
const wd = /* @__PURE__ */ new Map();
function Yc(t, e) {
  let n = wd.get(e);
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
  }), wd.set(e, n));
  let r = n.formatToParts(new Date(t)), i = {};
  for (let s of r) s.type !== "literal" && (i[s.type] = s.value);
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
const Mo = 864e5;
function mf(t, e) {
  let n = as(t), r = n - ho(n - Mo, e), i = n - ho(n + Mo, e);
  return zc(t, e, r, i);
}
function zc(t, e, n, r) {
  return (n === r ? [
    n
  ] : [
    n,
    r
  ]).filter((s) => bf(t, e, s));
}
function bf(t, e, n) {
  let r = Yc(n, e);
  return t.year === r.year && t.month === r.month && t.day === r.day && t.hour === r.hour && t.minute === r.minute && t.second === r.second;
}
function xa(t, e, n = "compatible") {
  let r = ss(t);
  if (e === "UTC") return as(r);
  if (e === ns() && n === "compatible") {
    r = Vr(r, new Ls());
    let h = /* @__PURE__ */ new Date(), b = ul(r.era, r.year);
    return h.setFullYear(b, r.month - 1, r.day), h.setHours(r.hour, r.minute, r.second, r.millisecond), h.getTime();
  }
  let i = as(r), s = ho(i - Mo, e), l = ho(i + Mo, e), u = zc(r, e, i - s, i - l);
  if (u.length === 1) return u[0];
  if (u.length > 1) switch (n) {
    // 'compatible' means 'earlier' for "fall back" transitions
    case "compatible":
    case "earlier":
      return u[0];
    case "later":
      return u[u.length - 1];
    case "reject":
      throw new RangeError("Multiple possible absolute times found");
  }
  switch (n) {
    case "earlier":
      return Math.min(i - s, i - l);
    // 'compatible' means 'later' for "spring forward" transitions
    case "compatible":
    case "later":
      return Math.max(i - s, i - l);
    case "reject":
      throw new RangeError("No such absolute time found");
  }
}
function Qc(t, e, n = "compatible") {
  return new Date(xa(t, e, n));
}
function Sa(t, e) {
  let n = ho(t, e), r = new Date(t + n), i = r.getUTCFullYear(), s = r.getUTCMonth() + 1, l = r.getUTCDate(), u = r.getUTCHours(), h = r.getUTCMinutes(), b = r.getUTCSeconds(), g = r.getUTCMilliseconds();
  return new Ra(i < 1 ? "BC" : "AD", i < 1 ? -i + 1 : i, s, l, e, n, u, h, b, g);
}
function Cf(t) {
  return new os(t.calendar, t.era, t.year, t.month, t.day);
}
function ss(t, e) {
  let n = 0, r = 0, i = 0, s = 0;
  if ("timeZone" in t) ({ hour: n, minute: r, second: i, millisecond: s } = t);
  else if ("hour" in t && !e) return t;
  return e && ({ hour: n, minute: r, second: i, millisecond: s } = e), new qa(t.calendar, t.era, t.year, t.month, t.day, n, r, i, s);
}
function Vr(t, e) {
  if (cf(t.calendar, e)) return t;
  let n = e.fromJulianDay(t.calendar.toJulianDay(t)), r = t.copy();
  return r.calendar = e, r.era = n.era, r.year = n.year, r.month = n.month, r.day = n.day, Ps(r), r;
}
function wf(t, e, n) {
  if (t instanceof Ra)
    return t.timeZone === e ? t : xf(t, e);
  let r = xa(t, e, n);
  return Sa(r, e);
}
function Pf(t) {
  let e = as(t) - t.offset;
  return new Date(e);
}
function xf(t, e) {
  let n = as(t) - t.offset;
  return Vr(Sa(n, e), t.calendar);
}
const Xs = 36e5;
function Zo(t, e) {
  let n = t.copy(), r = "hour" in n ? _f(n, e) : 0;
  ji(n, e.years || 0), n.calendar.balanceYearMonth && n.calendar.balanceYearMonth(n, t), n.month += e.months || 0, Ki(n), Wc(n), n.day += (e.weeks || 0) * 7, n.day += e.days || 0, n.day += r, Sf(n), n.calendar.balanceDate && n.calendar.balanceDate(n), n.year < 1 && (n.year = 1, n.month = 1, n.day = 1);
  let i = n.calendar.getYearsInEra(n);
  if (n.year > i) {
    var s, l;
    let h = (s = (l = n.calendar).isInverseEra) === null || s === void 0 ? void 0 : s.call(l, n);
    n.year = i, n.month = h ? 1 : n.calendar.getMonthsInYear(n), n.day = h ? 1 : n.calendar.getDaysInMonth(n);
  }
  n.month < 1 && (n.month = 1, n.day = 1);
  let u = n.calendar.getMonthsInYear(n);
  return n.month > u && (n.month = u, n.day = n.calendar.getDaysInMonth(n)), n.day = Math.max(1, Math.min(n.calendar.getDaysInMonth(n), n.day)), n;
}
function ji(t, e) {
  var n, r;
  !((n = (r = t.calendar).isInverseEra) === null || n === void 0) && n.call(r, t) && (e = -e), t.year += e;
}
function Ki(t) {
  for (; t.month < 1; )
    ji(t, -1), t.month += t.calendar.getMonthsInYear(t);
  let e = 0;
  for (; t.month > (e = t.calendar.getMonthsInYear(t)); )
    t.month -= e, ji(t, 1);
}
function Sf(t) {
  for (; t.day < 1; )
    t.month--, Ki(t), t.day += t.calendar.getDaysInMonth(t);
  for (; t.day > t.calendar.getDaysInMonth(t); )
    t.day -= t.calendar.getDaysInMonth(t), t.month++, Ki(t);
}
function Wc(t) {
  t.month = Math.max(1, Math.min(t.calendar.getMonthsInYear(t), t.month)), t.day = Math.max(1, Math.min(t.calendar.getDaysInMonth(t), t.day));
}
function Ps(t) {
  t.calendar.constrainDate && t.calendar.constrainDate(t), t.year = Math.max(1, Math.min(t.calendar.getYearsInEra(t), t.year)), Wc(t);
}
function Jc(t) {
  let e = {};
  for (let n in t) typeof t[n] == "number" && (e[n] = -t[n]);
  return e;
}
function Gc(t, e) {
  return Zo(t, Jc(e));
}
function fl(t, e) {
  let n = t.copy();
  return e.era != null && (n.era = e.era), e.year != null && (n.year = e.year), e.month != null && (n.month = e.month), e.day != null && (n.day = e.day), Ps(n), n;
}
function Oo(t, e) {
  let n = t.copy();
  return e.hour != null && (n.hour = e.hour), e.minute != null && (n.minute = e.minute), e.second != null && (n.second = e.second), e.millisecond != null && (n.millisecond = e.millisecond), Rf(n), n;
}
function If(t) {
  t.second += Math.floor(t.millisecond / 1e3), t.millisecond = Po(t.millisecond, 1e3), t.minute += Math.floor(t.second / 60), t.second = Po(t.second, 60), t.hour += Math.floor(t.minute / 60), t.minute = Po(t.minute, 60);
  let e = Math.floor(t.hour / 24);
  return t.hour = Po(t.hour, 24), e;
}
function Rf(t) {
  t.millisecond = Math.max(0, Math.min(t.millisecond, 1e3)), t.second = Math.max(0, Math.min(t.second, 59)), t.minute = Math.max(0, Math.min(t.minute, 59)), t.hour = Math.max(0, Math.min(t.hour, 23));
}
function Po(t, e) {
  let n = t % e;
  return n < 0 && (n += e), n;
}
function _f(t, e) {
  return t.hour += e.hours || 0, t.minute += e.minutes || 0, t.second += e.seconds || 0, t.millisecond += e.milliseconds || 0, If(t);
}
function vl(t, e, n, r) {
  let i = t.copy();
  switch (e) {
    case "era": {
      let u = t.calendar.getEras(), h = u.indexOf(t.era);
      if (h < 0) throw new Error("Invalid era: " + t.era);
      h = Ha(h, n, 0, u.length - 1, r?.round), i.era = u[h], Ps(i);
      break;
    }
    case "year":
      var s, l;
      !((s = (l = i.calendar).isInverseEra) === null || s === void 0) && s.call(l, i) && (n = -n), i.year = Ha(t.year, n, -1 / 0, 9999, r?.round), i.year === -1 / 0 && (i.year = 1), i.calendar.balanceYearMonth && i.calendar.balanceYearMonth(i, t);
      break;
    case "month":
      i.month = Ha(t.month, n, 1, t.calendar.getMonthsInYear(t), r?.round);
      break;
    case "day":
      i.day = Ha(t.day, n, 1, t.calendar.getDaysInMonth(t), r?.round);
      break;
    default:
      throw new Error("Unsupported field " + e);
  }
  return t.calendar.balanceDate && t.calendar.balanceDate(i), Ps(i), i;
}
function Zc(t, e, n, r) {
  let i = t.copy();
  switch (e) {
    case "hour": {
      let s = t.hour, l = 0, u = 23;
      if (r?.hourCycle === 12) {
        let h = s >= 12;
        l = h ? 12 : 0, u = h ? 23 : 11;
      }
      i.hour = Ha(s, n, l, u, r?.round);
      break;
    }
    case "minute":
      i.minute = Ha(t.minute, n, 0, 59, r?.round);
      break;
    case "second":
      i.second = Ha(t.second, n, 0, 59, r?.round);
      break;
    case "millisecond":
      i.millisecond = Ha(t.millisecond, n, 0, 999, r?.round);
      break;
    default:
      throw new Error("Unsupported field " + e);
  }
  return i;
}
function Ha(t, e, n, r, i = !1) {
  if (i) {
    t += Math.sign(e), t < n && (t = r);
    let s = Math.abs(e);
    e > 0 ? t = Math.ceil(t / s) * s : t = Math.floor(t / s) * s, t > r && (t = n);
  } else
    t += e, t < n ? t = r - (n - t - 1) : t > r && (t = n + (t - r - 1));
  return t;
}
function Xc(t, e) {
  let n;
  if (e.years != null && e.years !== 0 || e.months != null && e.months !== 0 || e.weeks != null && e.weeks !== 0 || e.days != null && e.days !== 0) {
    let i = Zo(ss(t), {
      years: e.years,
      months: e.months,
      weeks: e.weeks,
      days: e.days
    });
    n = xa(i, t.timeZone);
  } else
    n = as(t) - t.offset;
  n += e.milliseconds || 0, n += (e.seconds || 0) * 1e3, n += (e.minutes || 0) * 6e4, n += (e.hours || 0) * 36e5;
  let r = Sa(n, t.timeZone);
  return Vr(r, t.calendar);
}
function Ef(t, e) {
  return Xc(t, Jc(e));
}
function Af(t, e, n, r) {
  switch (e) {
    case "hour": {
      let i = 0, s = 23;
      if (r?.hourCycle === 12) {
        let _ = t.hour >= 12;
        i = _ ? 12 : 0, s = _ ? 23 : 11;
      }
      let l = ss(t), u = Vr(Oo(l, {
        hour: i
      }), new Ls()), h = [
        xa(u, t.timeZone, "earlier"),
        xa(u, t.timeZone, "later")
      ].filter((_) => Sa(_, t.timeZone).day === u.day)[0], b = Vr(Oo(l, {
        hour: s
      }), new Ls()), g = [
        xa(b, t.timeZone, "earlier"),
        xa(b, t.timeZone, "later")
      ].filter((_) => Sa(_, t.timeZone).day === b.day).pop(), y = as(t) - t.offset, x = Math.floor(y / Xs), f = y % Xs;
      return y = Ha(x, n, Math.floor(h / Xs), Math.floor(g / Xs), r?.round) * Xs + f, Vr(Sa(y, t.timeZone), t.calendar);
    }
    case "minute":
    case "second":
    case "millisecond":
      return Zc(t, e, n, r);
    case "era":
    case "year":
    case "month":
    case "day": {
      let i = vl(ss(t), e, n, r), s = xa(i, t.timeZone);
      return Vr(Sa(s, t.timeZone), t.calendar);
    }
    default:
      throw new Error("Unsupported field " + e);
  }
}
function Df(t, e, n) {
  let r = ss(t), i = Oo(fl(r, e), e);
  if (i.compare(r) === 0) return t;
  let s = xa(i, t.timeZone, n);
  return Vr(Sa(s, t.timeZone), t.calendar);
}
const kf = /^([+-]\d{6}|\d{4})-(\d{2})-(\d{2})$/, Tf = /^([+-]\d{6}|\d{4})-(\d{2})-(\d{2})(?:T(\d{2}))?(?::(\d{2}))?(?::(\d{2}))?(\.\d+)?$/, Mf = /^([+-]\d{6}|\d{4})-(\d{2})-(\d{2})(?:T(\d{2}))?(?::(\d{2}))?(?::(\d{2}))?(\.\d+)?(?:([+-]\d{2})(?::?(\d{2}))?(?::?(\d{2}))?)?\[(.*?)\]$/, eu = /^([+-]\d{6}|\d{4})-(\d{2})-(\d{2})(?:T(\d{2}))?(?::(\d{2}))?(?::(\d{2}))?(\.\d+)?(?:(?:([+-]\d{2})(?::?(\d{2}))?)|Z)$/;
function pl(t) {
  let e = t.match(kf);
  if (!e)
    throw eu.test(t) ? new Error(`Invalid ISO 8601 date string: ${t}. Use parseAbsolute() instead.`) : new Error("Invalid ISO 8601 date string: " + t);
  let n = new os(On(e[1], 0, 9999), On(e[2], 1, 12), 1);
  return n.day = On(e[3], 1, n.calendar.getDaysInMonth(n)), n;
}
function tu(t) {
  let e = t.match(Tf);
  if (!e)
    throw eu.test(t) ? new Error(`Invalid ISO 8601 date time string: ${t}. Use parseAbsolute() instead.`) : new Error("Invalid ISO 8601 date time string: " + t);
  let n = On(e[1], -9999, 9999), r = n < 1 ? "BC" : "AD", i = new qa(r, n < 1 ? -n + 1 : n, On(e[2], 1, 12), 1, e[4] ? On(e[4], 0, 23) : 0, e[5] ? On(e[5], 0, 59) : 0, e[6] ? On(e[6], 0, 59) : 0, e[7] ? On(e[7], 0, 1 / 0) * 1e3 : 0);
  return i.day = On(e[3], 0, i.calendar.getDaysInMonth(i)), i;
}
function nu(t, e) {
  let n = t.match(Mf);
  if (!n) throw new Error("Invalid ISO 8601 date time string: " + t);
  let r = On(n[1], -9999, 9999), i = r < 1 ? "BC" : "AD", s = new Ra(i, r < 1 ? -r + 1 : r, On(n[2], 1, 12), 1, n[11], 0, n[4] ? On(n[4], 0, 23) : 0, n[5] ? On(n[5], 0, 59) : 0, n[6] ? On(n[6], 0, 59) : 0, n[7] ? On(n[7], 0, 1 / 0) * 1e3 : 0);
  s.day = On(n[3], 0, s.calendar.getDaysInMonth(s));
  let l = ss(s), u;
  if (n[8]) {
    let g = On(n[8], -23, 23);
    var h, b;
    if (s.offset = Math.sign(g) * (Math.abs(g) * 36e5 + On((h = n[9]) !== null && h !== void 0 ? h : "0", 0, 59) * 6e4 + On((b = n[10]) !== null && b !== void 0 ? b : "0", 0, 59) * 1e3), u = as(s) - s.offset, !mf(l, s.timeZone).includes(u)) throw new Error(`Offset ${au(s.offset)} is invalid for ${gl(s)} in ${s.timeZone}`);
  } else
    u = xa(ss(l), s.timeZone, e);
  return Sa(u, s.timeZone);
}
function On(t, e, n) {
  let r = Number(t);
  if (r < e || r > n) throw new RangeError(`Value out of range: ${e} <= ${r} <= ${n}`);
  return r;
}
function Of(t) {
  return `${String(t.hour).padStart(2, "0")}:${String(t.minute).padStart(2, "0")}:${String(t.second).padStart(2, "0")}${t.millisecond ? String(t.millisecond / 1e3).slice(1) : ""}`;
}
function ru(t) {
  let e = Vr(t, new Ls()), n;
  return e.era === "BC" ? n = e.year === 1 ? "0000" : "-" + String(Math.abs(1 - e.year)).padStart(6, "00") : n = String(e.year).padStart(4, "0"), `${n}-${String(e.month).padStart(2, "0")}-${String(e.day).padStart(2, "0")}`;
}
function gl(t) {
  return `${ru(t)}T${Of(t)}`;
}
function au(t) {
  let e = Math.sign(t) < 0 ? "-" : "+";
  t = Math.abs(t);
  let n = Math.floor(t / 36e5), r = Math.floor(t % 36e5 / 6e4), i = Math.floor(t % 36e5 % 6e4 / 1e3), s = `${e}${String(n).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
  return i !== 0 && (s += `:${String(i).padStart(2, "0")}`), s;
}
function Ff(t) {
  return `${gl(t)}${au(t.offset)}[${t.timeZone}]`;
}
function Lf(t, e) {
  if (e.has(t))
    throw new TypeError("Cannot initialize the same private elements twice on an object");
}
function yl(t, e, n) {
  Lf(t, e), e.set(t, n);
}
function ml(t) {
  let e = typeof t[0] == "object" ? t.shift() : new Ls(), n;
  if (typeof t[0] == "string") n = t.shift();
  else {
    let l = e.getEras();
    n = l[l.length - 1];
  }
  let r = t.shift(), i = t.shift(), s = t.shift();
  return [
    e,
    n,
    r,
    i,
    s
  ];
}
var Hf = /* @__PURE__ */ new WeakMap();
class os {
  /** Returns a copy of this date. */
  copy() {
    return this.era ? new os(this.calendar, this.era, this.year, this.month, this.day) : new os(this.calendar, this.year, this.month, this.day);
  }
  /** Returns a new `CalendarDate` with the given duration added to it. */
  add(e) {
    return Zo(this, e);
  }
  /** Returns a new `CalendarDate` with the given duration subtracted from it. */
  subtract(e) {
    return Gc(this, e);
  }
  /** Returns a new `CalendarDate` with the given fields set to the provided values. Other fields will be constrained accordingly. */
  set(e) {
    return fl(this, e);
  }
  /**
  * Returns a new `CalendarDate` with the given field adjusted by a specified amount.
  * When the resulting value reaches the limits of the field, it wraps around.
  */
  cycle(e, n, r) {
    return vl(this, e, n, r);
  }
  /** Converts the date to a native JavaScript Date object, with the time set to midnight in the given time zone. */
  toDate(e) {
    return Qc(this, e);
  }
  /** Converts the date to an ISO 8601 formatted string. */
  toString() {
    return ru(this);
  }
  /** Compares this date with another. A negative result indicates that this date is before the given one, and a positive date indicates that it is after. */
  compare(e) {
    return jc(this, e);
  }
  constructor(...e) {
    yl(this, Hf, {
      writable: !0,
      value: void 0
    });
    let [n, r, i, s, l] = ml(e);
    this.calendar = n, this.era = r, this.year = i, this.month = s, this.day = l, Ps(this);
  }
}
var $f = /* @__PURE__ */ new WeakMap();
class qa {
  /** Returns a copy of this date. */
  copy() {
    return this.era ? new qa(this.calendar, this.era, this.year, this.month, this.day, this.hour, this.minute, this.second, this.millisecond) : new qa(this.calendar, this.year, this.month, this.day, this.hour, this.minute, this.second, this.millisecond);
  }
  /** Returns a new `CalendarDateTime` with the given duration added to it. */
  add(e) {
    return Zo(this, e);
  }
  /** Returns a new `CalendarDateTime` with the given duration subtracted from it. */
  subtract(e) {
    return Gc(this, e);
  }
  /** Returns a new `CalendarDateTime` with the given fields set to the provided values. Other fields will be constrained accordingly. */
  set(e) {
    return fl(Oo(this, e), e);
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
        return vl(this, e, n, r);
      default:
        return Zc(this, e, n, r);
    }
  }
  /** Converts the date to a native JavaScript Date object in the given time zone. */
  toDate(e, n) {
    return Qc(this, e, n);
  }
  /** Converts the date to an ISO 8601 formatted string. */
  toString() {
    return gl(this);
  }
  /** Compares this date with another. A negative result indicates that this date is before the given one, and a positive date indicates that it is after. */
  compare(e) {
    let n = jc(this, e);
    return n === 0 ? vf(this, ss(e)) : n;
  }
  constructor(...e) {
    yl(this, $f, {
      writable: !0,
      value: void 0
    });
    let [n, r, i, s, l] = ml(e);
    this.calendar = n, this.era = r, this.year = i, this.month = s, this.day = l, this.hour = e.shift() || 0, this.minute = e.shift() || 0, this.second = e.shift() || 0, this.millisecond = e.shift() || 0, Ps(this);
  }
}
var Nf = /* @__PURE__ */ new WeakMap();
class Ra {
  /** Returns a copy of this date. */
  copy() {
    return this.era ? new Ra(this.calendar, this.era, this.year, this.month, this.day, this.timeZone, this.offset, this.hour, this.minute, this.second, this.millisecond) : new Ra(this.calendar, this.year, this.month, this.day, this.timeZone, this.offset, this.hour, this.minute, this.second, this.millisecond);
  }
  /** Returns a new `ZonedDateTime` with the given duration added to it. */
  add(e) {
    return Xc(this, e);
  }
  /** Returns a new `ZonedDateTime` with the given duration subtracted from it. */
  subtract(e) {
    return Ef(this, e);
  }
  /** Returns a new `ZonedDateTime` with the given fields set to the provided values. Other fields will be constrained accordingly. */
  set(e, n) {
    return Df(this, e, n);
  }
  /**
  * Returns a new `ZonedDateTime` with the given field adjusted by a specified amount.
  * When the resulting value reaches the limits of the field, it wraps around.
  */
  cycle(e, n, r) {
    return Af(this, e, n, r);
  }
  /** Converts the date to a native JavaScript Date object. */
  toDate() {
    return Pf(this);
  }
  /** Converts the date to an ISO 8601 formatted string, including the UTC offset and time zone identifier. */
  toString() {
    return Ff(this);
  }
  /** Converts the date to an ISO 8601 formatted string in UTC. */
  toAbsoluteString() {
    return this.toDate().toISOString();
  }
  /** Compares this date with another. A negative result indicates that this date is before the given one, and a positive date indicates that it is after. */
  compare(e) {
    return this.toDate().getTime() - wf(e, this.timeZone).toDate().getTime();
  }
  constructor(...e) {
    yl(this, Nf, {
      writable: !0,
      value: void 0
    });
    let [n, r, i, s, l] = ml(e), u = e.shift(), h = e.shift();
    this.calendar = n, this.era = r, this.year = i, this.month = s, this.day = l, this.timeZone = u, this.offset = h, this.hour = e.shift() || 0, this.minute = e.shift() || 0, this.second = e.shift() || 0, this.millisecond = e.shift() || 0, Ps(this);
  }
}
let vi = /* @__PURE__ */ new Map();
class Pa {
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
    let r = this.formatter.formatToParts(e), i = this.formatter.formatToParts(n);
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
      ...i.map((s) => ({
        ...s,
        source: "endRange"
      }))
    ];
  }
  /** Returns the resolved formatting options based on the values passed to the constructor. */
  resolvedOptions() {
    let e = this.formatter.resolvedOptions();
    return Uf() && (this.resolvedHourCycle || (this.resolvedHourCycle = Vf(e.locale, this.options)), e.hourCycle = this.resolvedHourCycle, e.hour12 = this.resolvedHourCycle === "h11" || this.resolvedHourCycle === "h12"), e.calendar === "ethiopic-amete-alem" && (e.calendar = "ethioaa"), e;
  }
  constructor(e, n = {}) {
    this.formatter = su(e, n), this.options = n;
  }
}
const Bf = {
  true: {
    // Only Japanese uses the h11 style for 12 hour time. All others use h12.
    ja: "h11"
  },
  false: {}
};
function su(t, e = {}) {
  if (typeof e.hour12 == "boolean" && qf()) {
    e = {
      ...e
    };
    let i = Bf[String(e.hour12)][t.split("-")[0]], s = e.hour12 ? "h12" : "h23";
    e.hourCycle = i ?? s, delete e.hour12;
  }
  let n = t + (e ? Object.entries(e).sort((i, s) => i[0] < s[0] ? -1 : 1).join() : "");
  if (vi.has(n)) return vi.get(n);
  let r = new Intl.DateTimeFormat(t, e);
  return vi.set(n, r), r;
}
let pi = null;
function qf() {
  return pi == null && (pi = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    hour12: !1
  }).format(new Date(2020, 2, 3, 0)) === "24"), pi;
}
let gi = null;
function Uf() {
  return gi == null && (gi = new Intl.DateTimeFormat("fr", {
    hour: "numeric",
    hour12: !1
  }).resolvedOptions().hourCycle === "h12"), gi;
}
function Vf(t, e) {
  if (!e.timeStyle && !e.hour) return;
  t = t.replace(/(-u-)?-nu-[a-zA-Z0-9]+/, ""), t += (t.includes("-u-") ? "" : "-u") + "-nu-latn";
  let n = su(t, {
    ...e,
    timeZone: void 0
    // use local timezone
  }), r = parseInt(n.formatToParts(new Date(2020, 2, 3, 0)).find((s) => s.type === "hour").value, 10), i = parseInt(n.formatToParts(new Date(2020, 2, 3, 23)).find((s) => s.type === "hour").value, 10);
  if (r === 0 && i === 23) return "h23";
  if (r === 24 && i === 23) return "h24";
  if (r === 0 && i === 11) return "h11";
  if (r === 12 && i === 11) return "h12";
  throw new Error("Unexpected hour cycle result");
}
function jf(t) {
  if (!is || !t)
    return null;
  let e = t.querySelector("[data-bits-announcer]");
  const n = (i) => {
    const s = t.createElement("div");
    return s.role = "log", s.ariaLive = i, s.setAttribute("aria-relevant", "additions"), s;
  };
  if (!$a(e)) {
    const i = t.createElement("div");
    i.style.cssText = Zu, i.setAttribute("data-bits-announcer", ""), i.appendChild(n("assertive")), i.appendChild(n("polite")), e = i, t.body.insertBefore(e, t.body.firstChild);
  }
  return {
    getLog: (i) => {
      if (!$a(e))
        return null;
      const s = e.querySelector(`[aria-live="${i}"]`);
      return $a(s) ? s : null;
    }
  };
}
function Fo(t) {
  const e = jf(t);
  function n(r, i = "assertive", s = 7500) {
    if (!e || !is || !t)
      return;
    const l = e.getLog(i), u = t.createElement("div");
    return typeof r == "number" ? r = r.toString() : r === null ? r = "Empty" : r = r.trim(), u.innerText = r, i === "assertive" ? l?.replaceChildren(u) : l?.appendChild(u), setTimeout(() => {
      u.remove();
    }, s);
  }
  return {
    announce: n
  };
}
const Kf = {
  defaultValue: void 0,
  granularity: "day"
};
function Yf(t) {
  const e = { ...Kf, ...t }, { defaultValue: n, granularity: r, minValue: i, maxValue: s } = e;
  if (Array.isArray(n) && n.length)
    return n[n.length - 1];
  if (n && !Array.isArray(n))
    return n;
  {
    let l = /* @__PURE__ */ new Date();
    i && l < i.toDate(ns()) ? l = i.toDate(ns()) : s && l > s.toDate(ns()) && (l = s.toDate(ns()));
    const u = l.getFullYear(), h = l.getMonth() + 1, b = l.getDate();
    return ["hour", "minute", "second"].includes(r ?? "day") ? new qa(u, h, b, 0, 0, 0) : new os(u, h, b);
  }
}
function ou(t, e) {
  let n;
  return e instanceof Ra ? n = nu(t) : e instanceof qa ? n = tu(t) : n = pl(t), n.calendar !== e.calendar ? Vr(n, e.calendar) : n;
}
function Mr(t, e = ns()) {
  return t instanceof Ra ? t.toDate() : t.toDate(e);
}
function zf(t) {
  if (t instanceof os)
    return "date";
  if (t instanceof qa)
    return "datetime";
  if (t instanceof Ra)
    return "zoneddatetime";
  throw new Error("Unknown date type");
}
function Qf(t, e) {
  switch (e) {
    case "date":
      return pl(t);
    case "datetime":
      return tu(t);
    case "zoneddatetime":
      return nu(t);
    default:
      throw new Error(`Unknown date type: ${e}`);
  }
}
function Wf(t) {
  return t instanceof qa;
}
function bl(t) {
  return t instanceof Ra;
}
function Lo(t) {
  return Wf(t) || bl(t);
}
function fo(t) {
  if (t instanceof Date) {
    const e = t.getFullYear(), n = t.getMonth() + 1;
    return new Date(e, n, 0).getDate();
  } else
    return t.set({ day: 100 }).day;
}
function xs(t, e) {
  return t.compare(e) < 0;
}
function Jf(t, e) {
  return t.compare(e) > 0;
}
function Pd(t, e, n) {
  const r = Vc(t, n);
  return e > r ? t.subtract({ days: r + 7 - e }) : e === r ? t : t.subtract({ days: r - e });
}
function xd(t, e, n) {
  const r = Vc(t, n), i = e === 0 ? 6 : e - 1;
  return r === i ? t : r > i ? t.add({ days: 7 - r + i }) : t.add({ days: i - r });
}
const Xo = ["day", "month", "year"], Cl = ["hour", "minute", "second", "dayPeriod"], Gf = ["literal", "timeZoneName"], go = [
  ...Xo,
  ...Cl
], Zf = [
  ...go,
  ...Gf
], Xf = [
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
], ev = ["year", "month", "day"], yi = {
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
function tv(t) {
  if (Sd(t))
    return yi[t];
  {
    const e = sv(t);
    return Sd(e) ? yi[e] : yi.en;
  }
}
function mi(t, e, n) {
  return nv(t) ? tv(n)[t] : av(t) ? e : rv(t) ? "––" : "";
}
function Sd(t) {
  return Xf.includes(t);
}
function nv(t) {
  return ev.includes(t);
}
function rv(t) {
  return t === "hour" || t === "minute" || t === "second";
}
function av(t) {
  return t === "era" || t === "dayPeriod";
}
function sv(t) {
  return Intl.Locale ? new Intl.Locale(t).language : t.split("-")[0];
}
function bi(t) {
  const e = ["hour", "minute", "second"], n = go.map((r) => r === "dayPeriod" ? [r, "AM"] : [r, null]).filter(([r]) => r === "literal" || r === null ? !1 : t === "day" ? !e.includes(r) : !0);
  return Object.fromEntries(n);
}
function ov(t) {
  const { segmentValues: e, formatter: n, locale: r, dateRef: i } = t, s = Object.keys(e).reduce((u, h) => {
    if (!iu(h))
      return u;
    if ("hour" in e && h === "dayPeriod") {
      const b = e[h];
      es(b) ? u[h] = mi(h, "AM", r) : u[h] = b;
    } else
      u[h] = l(h);
    return u;
  }, {});
  function l(u) {
    if ("hour" in e) {
      const h = e[u], b = typeof h == "string" && h?.startsWith("0"), g = h !== null ? Number.parseInt(h) : null;
      if (h === "0" && u !== "year")
        return "0";
      if (!es(h) && !es(g)) {
        const y = n.part(i.set({ [u]: h }), u, {
          hourCycle: t.hourCycle === 24 ? "h23" : void 0
        }), x = t.hourCycle === 12 || t.hourCycle === void 0 && du(r) === 12;
        if (u === "hour" && x) {
          if (g > 12) {
            const f = g - 12;
            return f === 0 ? "12" : f < 10 ? `0${f}` : `${f}`;
          }
          return g === 0 ? "12" : g < 10 ? `0${g}` : `${g}`;
        }
        return u === "year" ? `${h}` : b && y.length === 1 ? `0${y}` : y;
      } else
        return mi(u, "", r);
    } else {
      if (ei(u)) {
        const h = e[u], b = typeof h == "string" && h?.startsWith("0");
        if (h === "0")
          return "0";
        if (es(h))
          return mi(u, "", r);
        {
          const g = n.part(i.set({ [u]: h }), u);
          return u === "year" ? `${h}` : b && g.length === 1 ? `0${g}` : g;
        }
      }
      return "";
    }
  }
  return s;
}
function iv(t) {
  const { granularity: e, dateRef: n, formatter: r, contentObj: i, hideTimeZone: s, hourCycle: l } = t;
  return r.toParts(n, dv(e, l)).map((b) => ["literal", "dayPeriod", "timeZoneName", null].includes(b.type) || !iu(b.type) ? {
    part: b.type,
    value: b.value
  } : {
    part: b.type,
    value: i[b.type]
  }).filter((b) => !(es(b.part) || es(b.value) || b.part === "timeZoneName" && (!bl(n) || s)));
}
function lv(t) {
  const e = ov(t), n = iv({
    contentObj: e,
    ...t
  });
  return {
    obj: e,
    arr: n
  };
}
function dv(t, e) {
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
function Id() {
  return go.reduce((t, e) => (t[e] = {
    lastKeyZero: !1,
    hasLeftFocus: !0,
    updating: null
  }, t), {});
}
function ei(t) {
  return Xo.includes(t);
}
function iu(t) {
  return go.includes(t);
}
function cv(t) {
  return Zf.includes(t);
}
function lu(t) {
  return !is || !t ? [] : xl(t).map((n) => n.dataset.segment).filter((n) => go.includes(n));
}
function uv(t) {
  const { segmentObj: e, fieldNode: n, dateRef: r } = t, i = lu(n);
  let s = r;
  for (const l of i)
    if ("hour" in e) {
      const u = e[l];
      if (es(u))
        continue;
      s = s.set({ [l]: e[l] });
    } else if (ei(l)) {
      const u = e[l];
      if (es(u))
        continue;
      s = s.set({ [l]: e[l] });
    }
  return s;
}
function hv(t, e) {
  const n = lu(e);
  for (const r of n)
    if ("hour" in t) {
      if (t[r] === null)
        return !1;
    } else if (ei(r) && t[r] === null)
      return !1;
  return !0;
}
function fv(t) {
  return typeof t != "object" || t === null ? !1 : Object.entries(t).every(([e, n]) => (Cl.includes(e) || Xo.includes(e)) && (e === "dayPeriod" ? n === "AM" || n === "PM" || n === null : typeof n == "string" || typeof n == "number" || n === null));
}
function vv(t, e) {
  return e || (Lo(t) ? "minute" : "day");
}
function wl(t) {
  return !!([
    vc,
    Vo,
    jo,
    vo,
    po,
    pc,
    gc
  ].includes(t) || Ko(t));
}
function pv(t, e) {
  if (!is)
    return !1;
  const n = xl(e);
  return n.length ? n[0].id === t : !1;
}
function gv(t) {
  const { id: e, formatter: n, value: r, doc: i } = t;
  if (!is)
    return;
  const s = n.selectedDate(r), l = i.getElementById(e);
  if (l)
    l.innerText = `Selected Date: ${s}`;
  else {
    const u = i.createElement("div");
    u.style.cssText = fc({
      display: "none"
    }), u.id = e, u.innerText = `Selected Date: ${s}`, i.body.appendChild(u);
  }
}
function yv(t, e) {
  if (!is)
    return;
  const n = e.getElementById(t);
  n && e.body.removeChild(n);
}
function du(t) {
  return new Intl.DateTimeFormat(t, { hour: "numeric" }).formatToParts(/* @__PURE__ */ new Date("2023-01-01T13:00:00")).find((i) => i.type === "hour")?.value === "1" ? 12 : 24;
}
function yo(t, e) {
  const n = t.currentTarget;
  if (!$a(n))
    return;
  const { prev: r, next: i } = Pl(n, e);
  if (t.key === vo) {
    if (!r)
      return;
    r.focus();
  } else if (t.key === po) {
    if (!i)
      return;
    i.focus();
  }
}
function mv(t, e) {
  const n = e.indexOf(t);
  if (n === e.length - 1 || n === -1)
    return null;
  const r = n + 1;
  return e[r];
}
function bv(t, e) {
  const n = e.indexOf(t);
  if (n === 0 || n === -1)
    return null;
  const r = n - 1;
  return e[r];
}
function Pl(t, e) {
  const n = xl(e);
  return n.length ? {
    next: mv(t, n),
    prev: bv(t, n)
  } : {
    next: null,
    prev: null
  };
}
function cu(t, e) {
  const n = t.currentTarget;
  if (!$a(n))
    return;
  const { next: r } = Pl(n, e);
  r && r.focus();
}
function uu(t, e) {
  const n = t.currentTarget;
  if (!$a(n))
    return;
  const { prev: r } = Pl(n, e);
  r && r.focus();
}
function mo(t) {
  return t === po || t === vo;
}
function xl(t) {
  return t ? Array.from(t.querySelectorAll("[data-segment]")).filter((n) => {
    if (!$a(n))
      return !1;
    const r = n.dataset.segment;
    return r === "trigger" ? !0 : !(!cv(r) || r === "literal");
  }) : [];
}
const Cv = {
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric"
};
function hu(t) {
  let e = t.initialLocale;
  function n(f) {
    e = f;
  }
  function r() {
    return e;
  }
  function i(f, _) {
    return new Pa(e, _).format(f);
  }
  function s(f, _ = !0) {
    return Lo(f) && _ ? i(Mr(f), {
      dateStyle: "long",
      timeStyle: "long"
    }) : i(Mr(f), {
      dateStyle: "long"
    });
  }
  function l(f) {
    if (typeof t.monthFormat.current != "function" && typeof t.yearFormat.current != "function")
      return new Pa(e, {
        month: t.monthFormat.current,
        year: t.yearFormat.current
      }).format(f);
    const _ = typeof t.monthFormat.current == "function" ? t.monthFormat.current(f.getMonth() + 1) : new Pa(e, { month: t.monthFormat.current }).format(f), C = typeof t.yearFormat.current == "function" ? t.yearFormat.current(f.getFullYear()) : new Pa(e, { year: t.yearFormat.current }).format(f);
    return `${_} ${C}`;
  }
  function u(f) {
    return new Pa(e, { month: "long" }).format(f);
  }
  function h(f) {
    return new Pa(e, { year: "numeric" }).format(f);
  }
  function b(f, _) {
    return bl(f) ? new Pa(e, {
      ..._,
      timeZone: f.timeZone
    }).formatToParts(Mr(f)) : new Pa(e, _).formatToParts(Mr(f));
  }
  function g(f, _ = "narrow") {
    return new Pa(e, { weekday: _ }).format(f);
  }
  function y(f, _ = void 0) {
    return new Pa(e, {
      hour: "numeric",
      minute: "numeric",
      hourCycle: _ === 24 ? "h23" : void 0
    }).formatToParts(f).find((o) => o.type === "dayPeriod")?.value === "PM" ? "PM" : "AM";
  }
  function x(f, _, C = {}) {
    const m = { ...Cv, ...C }, O = b(f, m).find((z) => z.type === _);
    return O ? O.value : "";
  }
  return {
    setLocale: n,
    getLocale: r,
    fullMonth: u,
    fullYear: h,
    fullMonthAndYear: l,
    toParts: b,
    custom: i,
    part: x,
    dayPeriod: y,
    selectedDate: s,
    dayOfWeek: g
  };
}
function wv(t) {
  return !(!$a(t) || !t.hasAttribute("data-bits-day"));
}
function Rd(t, e) {
  const n = [];
  let r = t.add({ days: 1 });
  const i = e;
  for (; r.compare(i) < 0; )
    n.push(r), r = r.add({ days: 1 });
  return n;
}
function Ci(t) {
  const { dateObj: e, weekStartsOn: n, fixedWeeks: r, locale: i } = t, s = fo(e), l = Array.from({ length: s }, (m, o) => e.set({ day: o + 1 })), u = Vi(e), h = pf(e), b = n !== void 0 ? Pd(u, n, "en-US") : Pd(u, 0, i), g = n !== void 0 ? xd(h, n, "en-US") : xd(h, 0, i), y = Rd(b.subtract({ days: 1 }), u), x = Rd(h, g.add({ days: 1 })), f = y.length + l.length + x.length;
  if (r && f < 42) {
    const m = 42 - f;
    let o = x[x.length - 1];
    o || (o = e.add({ months: 1 }).set({ day: 1 }));
    let O = m;
    x.length === 0 && (O = m - 1, x.push(o));
    const z = Array.from({ length: O }, ($, ee) => {
      const ye = ee + 1;
      return o.add({ days: ye });
    });
    x.push(...z);
  }
  const _ = y.concat(l, x), C = Xu(_, 7);
  return { value: e, dates: _, weeks: C };
}
function bo(t) {
  const { numberOfMonths: e, dateObj: n, ...r } = t, i = [];
  if (!e || e === 1)
    return i.push(Ci({ ...r, dateObj: n })), i;
  i.push(Ci({ ...r, dateObj: n }));
  for (let s = 1; s < e; s++) {
    const l = n.add({ months: s });
    i.push(Ci({ ...r, dateObj: l }));
  }
  return i;
}
function wi(t) {
  return t ? Array.from(t.querySelectorAll("[data-bits-day]:not([data-disabled]):not([data-outside-visible-months])")).filter((n) => $a(n)) : [];
}
function _d(t, e) {
  const n = t.getAttribute("data-value");
  n && (e.current = ou(n, e.current));
}
function Pv({
  node: t,
  add: e,
  placeholder: n,
  calendarNode: r,
  isPrevButtonDisabled: i,
  isNextButtonDisabled: s,
  months: l,
  numberOfMonths: u
}) {
  const h = wi(r);
  if (!h.length) return;
  const g = h.indexOf(t) + e;
  if (si(g, h)) {
    const y = h[g];
    return _d(y, n), y.focus();
  }
  if (g < 0) {
    if (i) return;
    const y = l[0]?.value;
    if (!y) return;
    n.current = y.subtract({ months: u }), id(() => {
      const x = wi(r);
      if (!x.length) return;
      const f = x.length - Math.abs(g);
      if (si(f, x)) {
        const _ = x[f];
        return _d(_, n), _.focus();
      }
    });
  }
  if (g >= h.length) {
    if (s) return;
    const y = l[0]?.value;
    if (!y) return;
    n.current = y.add({ months: u }), id(() => {
      const x = wi(r);
      if (!x.length) return;
      const f = g - h.length;
      if (si(f, x))
        return x[f].focus();
    });
  }
}
const Ed = [
  jo,
  Vo,
  vo,
  po
], Ad = [vc, gc];
function xv({ event: t, handleCellClick: e, shiftFocus: n, placeholderValue: r }) {
  const i = t.target;
  if (!wv(i) || !Ed.includes(t.key) && !Ad.includes(t.key)) return;
  t.preventDefault();
  const s = {
    [jo]: 7,
    [Vo]: -7,
    [vo]: -1,
    [po]: 1
  };
  if (Ed.includes(t.key)) {
    const l = s[t.key];
    l !== void 0 && n(i, l);
  }
  if (Ad.includes(t.key)) {
    const l = i.getAttribute("data-value");
    if (!l) return;
    e(t, ou(l, r));
  }
}
function Sv({
  months: t,
  setMonths: e,
  numberOfMonths: n,
  pagedNavigation: r,
  weekStartsOn: i,
  locale: s,
  fixedWeeks: l,
  setPlaceholder: u
}) {
  const h = t[0]?.value;
  if (h)
    if (r)
      u(h.add({ months: n }));
    else {
      const b = h.add({ months: 1 }), g = bo({
        dateObj: b,
        weekStartsOn: i,
        locale: s,
        fixedWeeks: l,
        numberOfMonths: n
      });
      u(b), e(g);
    }
}
function Iv({
  months: t,
  setMonths: e,
  numberOfMonths: n,
  pagedNavigation: r,
  weekStartsOn: i,
  locale: s,
  fixedWeeks: l,
  setPlaceholder: u
}) {
  const h = t[0]?.value;
  if (h)
    if (r)
      u(h.subtract({ months: n }));
    else {
      const b = h.subtract({ months: 1 }), g = bo({
        dateObj: b,
        weekStartsOn: i,
        locale: s,
        fixedWeeks: l,
        numberOfMonths: n
      });
      u(b), e(g);
    }
}
function Rv({ months: t, formatter: e, weekdayFormat: n }) {
  if (!t.length) return [];
  const i = t[0].weeks[0];
  return i ? i.map((s) => e.dayOfWeek(Mr(s), n)) : [];
}
function _v(t) {
  Ue(() => {
    const e = t.weekStartsOn.current, n = t.locale.current, r = t.fixedWeeks.current, i = t.numberOfMonths.current;
    Xr(() => {
      const s = t.placeholder.current;
      if (!s) return;
      const l = { weekStartsOn: e, locale: n, fixedWeeks: r, numberOfMonths: i };
      t.setMonths(bo({ ...l, dateObj: s }));
    });
  });
}
function Ev({ calendarNode: t, label: e, accessibleHeadingId: n }) {
  const r = yc(t), i = r.createElement("div");
  i.style.cssText = fc({
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
  return s.textContent = e, s.id = n, s.role = "heading", s.ariaLevel = "2", t.insertBefore(i, t.firstChild), i.appendChild(s), () => {
    const l = r.getElementById(n);
    l && (i.parentElement?.removeChild(i), l.remove());
  };
}
function Av({
  placeholder: t,
  getVisibleMonths: e,
  weekStartsOn: n,
  locale: r,
  fixedWeeks: i,
  numberOfMonths: s,
  setMonths: l
}) {
  Ue(() => {
    t.current, Xr(() => {
      if (e().some((h) => hl(h, t.current)))
        return;
      const u = {
        weekStartsOn: n.current,
        locale: r.current,
        fixedWeeks: i.current,
        numberOfMonths: s.current
      };
      l(bo({ ...u, dateObj: t.current }));
    });
  });
}
function Dv({ maxValue: t, months: e, disabled: n }) {
  if (!t || !e.length) return !1;
  if (n) return !0;
  const r = e[e.length - 1]?.value;
  if (!r) return !1;
  const i = r.add({ months: 1 }).set({ day: 1 });
  return Jf(i, t);
}
function kv({ minValue: t, months: e, disabled: n }) {
  if (!t || !e.length) return !1;
  if (n) return !0;
  const r = e[0]?.value;
  if (!r) return !1;
  const i = r.subtract({ months: 1 }).set({ day: 35 });
  return xs(i, t);
}
function Tv({ months: t, locale: e, formatter: n }) {
  if (!t.length) return "";
  if (e !== n.getLocale() && n.setLocale(e), t.length === 1) {
    const g = Mr(t[0].value);
    return `${n.fullMonthAndYear(g)}`;
  }
  const r = Mr(t[0].value), i = Mr(t[t.length - 1].value), s = n.fullMonth(r), l = n.fullMonth(i), u = n.fullYear(r), h = n.fullYear(i);
  return u === h ? `${s} - ${l} ${h}` : `${s} ${u} - ${l} ${h}`;
}
function Mv({ fullCalendarLabel: t, id: e, isInvalid: n, disabled: r, readonly: i }) {
  return {
    id: e,
    role: "application",
    "aria-label": t,
    "data-invalid": Ht(n),
    "data-disabled": Ht(r),
    "data-readonly": Ht(i)
  };
}
function Ov(t) {
  const n = yc(t.target).querySelector("[data-bits-day][data-focused]");
  n && (t.preventDefault(), n?.focus());
}
function Fv(t) {
  if (!is) return;
  const e = Array.from(t.querySelectorAll("[data-bits-day]:not([aria-disabled=true])"));
  if (e.length === 0) return;
  const n = e[0], r = n?.getAttribute("data-value"), i = n?.getAttribute("data-type");
  if (!(!r || !i))
    return Qf(r, i);
}
function Lv({
  ref: t,
  placeholder: e,
  defaultPlaceholder: n,
  minValue: r,
  maxValue: i,
  isDateDisabled: s
}) {
  function l(u) {
    return !!(s.current(u) || r.current && xs(u, r.current) || i.current && xs(i.current, u));
  }
  Fs(() => t.current, () => {
    t.current && e.current && Xa(e.current, n) && l(n) && (e.current = Fv(t.current) ?? n);
  });
}
function Hv(t, e) {
  return !t || !e ? t : Lo(t) && Lo(e) ? t.set({
    hour: e.hour,
    minute: e.minute,
    millisecond: e.millisecond,
    second: e.second
  }) : t;
}
const $v = mc({
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
function Nv(t) {
  const e = (/* @__PURE__ */ new Date()).getFullYear(), n = Math.max(t.placeholderYear, e);
  let r, i;
  if (t.minValue)
    r = t.minValue.year;
  else {
    const l = n - 100;
    r = t.placeholderYear < l ? t.placeholderYear - 10 : l;
  }
  t.maxValue ? i = t.maxValue.year : i = n + 10, r > i && (r = i);
  const s = i - r + 1;
  return Array.from({ length: s }, (l, u) => r + u);
}
const ca = new Yo("Calendar.Root | RangeCalender.Root");
class Sl {
  static create(e) {
    return ca.set(new Sl(e));
  }
  opts;
  #e = S(() => this.months.map((e) => e.value));
  get visibleMonths() {
    return a(this.#e);
  }
  set visibleMonths(e) {
    w(this.#e, e);
  }
  formatter;
  accessibleHeadingId = bc();
  domContext;
  attachment;
  #t = be(Jn([]));
  get months() {
    return a(this.#t);
  }
  set months(e) {
    w(this.#t, e, !0);
  }
  announcer;
  constructor(e) {
    this.opts = e, this.attachment = sr(this.opts.ref), this.domContext = new Xi(e.ref), this.announcer = Fo(null), this.formatter = hu({
      initialLocale: this.opts.locale.current,
      monthFormat: this.opts.monthFormat,
      yearFormat: this.opts.yearFormat
    }), this.setMonths = this.setMonths.bind(this), this.nextPage = this.nextPage.bind(this), this.prevPage = this.prevPage.bind(this), this.prevYear = this.prevYear.bind(this), this.nextYear = this.nextYear.bind(this), this.setYear = this.setYear.bind(this), this.setMonth = this.setMonth.bind(this), this.isOutsideVisibleMonths = this.isOutsideVisibleMonths.bind(this), this.isDateDisabled = this.isDateDisabled.bind(this), this.isDateSelected = this.isDateSelected.bind(this), this.shiftFocus = this.shiftFocus.bind(this), this.handleCellClick = this.handleCellClick.bind(this), this.handleMultipleUpdate = this.handleMultipleUpdate.bind(this), this.handleSingleUpdate = this.handleSingleUpdate.bind(this), this.onkeydown = this.onkeydown.bind(this), this.getBitsAttr = this.getBitsAttr.bind(this), Cc(() => {
      this.announcer = Fo(this.domContext.getDocument());
    }), this.months = bo({
      dateObj: this.opts.placeholder.current,
      weekStartsOn: this.opts.weekStartsOn.current,
      locale: this.opts.locale.current,
      fixedWeeks: this.opts.fixedWeeks.current,
      numberOfMonths: this.opts.numberOfMonths.current
    }), this.#s(), this.#i(), this.#l(), Av({
      placeholder: this.opts.placeholder,
      getVisibleMonths: () => this.visibleMonths,
      weekStartsOn: this.opts.weekStartsOn,
      locale: this.opts.locale,
      fixedWeeks: this.opts.fixedWeeks,
      numberOfMonths: this.opts.numberOfMonths,
      setMonths: (n) => this.months = n
    }), _v({
      fixedWeeks: this.opts.fixedWeeks,
      locale: this.opts.locale,
      numberOfMonths: this.opts.numberOfMonths,
      placeholder: this.opts.placeholder,
      setMonths: this.setMonths,
      weekStartsOn: this.opts.weekStartsOn
    }), Fs(() => this.fullCalendarLabel, (n) => {
      const r = this.domContext.getElementById(this.accessibleHeadingId);
      r && (r.textContent = n);
    }), Fs(() => this.opts.value.current, () => {
      const n = this.opts.value.current;
      if (Array.isArray(n) && n.length) {
        const r = n[n.length - 1];
        r && this.opts.placeholder.current !== r && (this.opts.placeholder.current = r);
      } else !Array.isArray(n) && n && this.opts.placeholder.current !== n && (this.opts.placeholder.current = n);
    }), Lv({
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
  #n = S(
    /**
     * This derived state holds an array of localized day names for the current
     * locale and calendar view. It dynamically syncs with the 'weekStartsOn' option,
     * updating its content when the option changes. Using this state to render the
     * calendar's days of the week is strongly recommended, as it guarantees that
     * the days are correctly formatted for the current locale and calendar view.
     */
    () => Rv({
      months: this.months,
      formatter: this.formatter,
      weekdayFormat: this.opts.weekdayFormat.current
    })
  );
  get weekdays() {
    return a(this.#n);
  }
  set weekdays(e) {
    w(this.#n, e);
  }
  #r = S(() => Xr(() => this.opts.placeholder.current.year));
  get initialPlaceholderYear() {
    return a(this.#r);
  }
  set initialPlaceholderYear(e) {
    w(this.#r, e);
  }
  #a = S(() => Nv({
    minValue: this.opts.minValue.current,
    maxValue: this.opts.maxValue.current,
    placeholderYear: this.initialPlaceholderYear
  }));
  get defaultYears() {
    return a(this.#a);
  }
  set defaultYears(e) {
    w(this.#a, e);
  }
  #s() {
    Ue(() => {
      if (Xr(() => this.opts.initialFocus.current)) {
        const n = this.opts.ref.current?.querySelector("[data-focused]");
        n && n.focus();
      }
    });
  }
  #i() {
    Ue(() => this.opts.ref.current ? Ev({
      calendarNode: this.opts.ref.current,
      label: this.fullCalendarLabel,
      accessibleHeadingId: this.accessibleHeadingId
    }) : void 0);
  }
  #l() {
    zh(() => {
      this.formatter.getLocale() !== this.opts.locale.current && this.formatter.setLocale(this.opts.locale.current);
    });
  }
  /**
   * Navigates to the next page of the calendar.
   */
  nextPage() {
    Sv({
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
    Iv({
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
  #o = S(() => Dv({
    maxValue: this.opts.maxValue.current,
    months: this.months,
    disabled: this.opts.disabled.current
  }));
  get isNextButtonDisabled() {
    return a(this.#o);
  }
  set isNextButtonDisabled(e) {
    w(this.#o, e);
  }
  #d = S(() => kv({
    minValue: this.opts.minValue.current,
    months: this.months,
    disabled: this.opts.disabled.current
  }));
  get isPrevButtonDisabled() {
    return a(this.#d);
  }
  set isPrevButtonDisabled(e) {
    w(this.#d, e);
  }
  #c = S(() => {
    const e = this.opts.value.current, n = this.opts.isDateDisabled.current, r = this.opts.isDateUnavailable.current;
    if (Array.isArray(e)) {
      if (!e.length) return !1;
      for (const i of e)
        if (n(i) || r(i)) return !0;
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
    w(this.#c, e);
  }
  #u = S(() => (this.opts.monthFormat.current, this.opts.yearFormat.current, Tv({
    months: this.months,
    formatter: this.formatter,
    locale: this.opts.locale.current
  })));
  get headingValue() {
    return a(this.#u);
  }
  set headingValue(e) {
    w(this.#u, e);
  }
  #h = S(() => `${this.opts.calendarLabel.current} ${this.headingValue}`);
  get fullCalendarLabel() {
    return a(this.#h);
  }
  set fullCalendarLabel(e) {
    w(this.#h, e);
  }
  isOutsideVisibleMonths(e) {
    return !this.visibleMonths.some((n) => hl(e, n));
  }
  isDateDisabled(e) {
    if (this.opts.isDateDisabled.current(e) || this.opts.disabled.current) return !0;
    const n = this.opts.minValue.current, r = this.opts.maxValue.current;
    return !!(n && xs(e, n) || r && xs(r, e));
  }
  isDateSelected(e) {
    const n = this.opts.value.current;
    return Array.isArray(n) ? n.some((r) => Xa(r, e)) : n ? Xa(n, e) : !1;
  }
  shiftFocus(e, n) {
    return Pv({
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
      s ? this.announcer.announce(`Selected Date: ${this.formatter.selectedDate(s, !1)}`, "polite") : this.announcer.announce("Selected date is now empty.", "polite", 5e3), this.opts.value.current = Hv(s, r), s !== void 0 && this.opts.onDateSelect?.current?.();
    }
  }
  handleMultipleUpdate(e, n) {
    if (!e) {
      const s = [n];
      return this.#f(s) ? s : [n];
    }
    if (!Array.isArray(e))
      return;
    const r = e.findIndex((s) => Xa(s, n)), i = this.opts.preventDeselect.current;
    if (r === -1) {
      const s = [...e, n];
      return this.#f(s) ? s : [n];
    } else {
      if (i)
        return e;
      {
        const s = e.filter((l) => !Xa(l, n));
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
    if (!this.opts.preventDeselect.current && Xa(e, n)) {
      this.opts.placeholder.current = n;
      return;
    }
    return n;
  }
  onkeydown(e) {
    xv({
      event: e,
      handleCellClick: this.handleCellClick,
      shiftFocus: this.shiftFocus,
      placeholderValue: this.opts.placeholder.current
    });
  }
  #v = S(() => ({ months: this.months, weekdays: this.weekdays }));
  get snippetProps() {
    return a(this.#v);
  }
  set snippetProps(e) {
    w(this.#v, e);
  }
  getBitsAttr = (e) => $v.getAttr(e);
  #p = S(() => ({
    ...Mv({
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
    w(this.#p, e);
  }
}
class Il {
  static create(e) {
    return new Il(e, ca.get());
  }
  opts;
  root;
  attachment;
  constructor(e, n) {
    this.opts = e, this.root = n, this.attachment = sr(this.opts.ref);
  }
  #e = S(() => ({
    id: this.opts.id.current,
    "aria-hidden": el(!0),
    "data-disabled": Ht(this.root.opts.disabled.current),
    "data-readonly": Ht(this.root.opts.readonly.current),
    [this.root.getBitsAttr("heading")]: "",
    ...this.attachment
  }));
  get props() {
    return a(this.#e);
  }
  set props(e) {
    w(this.#e, e);
  }
}
const fu = new Yo("Calendar.Cell | RangeCalendar.Cell");
class Rl {
  static create(e) {
    return fu.set(new Rl(e, ca.get()));
  }
  opts;
  root;
  #e = S(() => Mr(this.opts.date.current));
  get cellDate() {
    return a(this.#e);
  }
  set cellDate(e) {
    w(this.#e, e);
  }
  #t = S(() => this.root.opts.isDateUnavailable.current(this.opts.date.current));
  get isUnavailable() {
    return a(this.#t);
  }
  set isUnavailable(e) {
    w(this.#t, e);
  }
  #n = S(() => uf(this.opts.date.current, ns()));
  get isDateToday() {
    return a(this.#n);
  }
  set isDateToday(e) {
    w(this.#n, e);
  }
  #r = S(() => !hl(this.opts.date.current, this.opts.month.current));
  get isOutsideMonth() {
    return a(this.#r);
  }
  set isOutsideMonth(e) {
    w(this.#r, e);
  }
  #a = S(() => this.root.isOutsideVisibleMonths(this.opts.date.current));
  get isOutsideVisibleMonths() {
    return a(this.#a);
  }
  set isOutsideVisibleMonths(e) {
    w(this.#a, e);
  }
  #s = S(() => this.root.isDateDisabled(this.opts.date.current) || this.isOutsideMonth && this.root.opts.disableDaysOutsideMonth.current);
  get isDisabled() {
    return a(this.#s);
  }
  set isDisabled(e) {
    w(this.#s, e);
  }
  #i = S(() => Xa(this.opts.date.current, this.root.opts.placeholder.current));
  get isFocusedDate() {
    return a(this.#i);
  }
  set isFocusedDate(e) {
    w(this.#i, e);
  }
  #l = S(() => this.root.isDateSelected(this.opts.date.current));
  get isSelectedDate() {
    return a(this.#l);
  }
  set isSelectedDate(e) {
    w(this.#l, e);
  }
  #o = S(() => this.root.formatter.custom(this.cellDate, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  }));
  get labelText() {
    return a(this.#o);
  }
  set labelText(e) {
    w(this.#o, e);
  }
  attachment;
  constructor(e, n) {
    this.opts = e, this.root = n, this.attachment = sr(this.opts.ref);
  }
  #d = S(() => ({
    disabled: this.isDisabled,
    unavailable: this.isUnavailable,
    selected: this.isSelectedDate,
    day: `${this.opts.date.current.day}`
  }));
  get snippetProps() {
    return a(this.#d);
  }
  set snippetProps(e) {
    w(this.#d, e);
  }
  #c = S(() => this.isDisabled || this.isOutsideMonth && this.root.opts.disableDaysOutsideMonth.current || this.isUnavailable);
  get ariaDisabled() {
    return a(this.#c);
  }
  set ariaDisabled(e) {
    w(this.#c, e);
  }
  #u = S(() => ({
    "data-unavailable": Ht(this.isUnavailable),
    "data-today": this.isDateToday ? "" : void 0,
    "data-outside-month": this.isOutsideMonth ? "" : void 0,
    "data-outside-visible-months": this.isOutsideVisibleMonths ? "" : void 0,
    "data-focused": this.isFocusedDate ? "" : void 0,
    "data-selected": Ht(this.isSelectedDate),
    "data-value": this.opts.date.current.toString(),
    "data-type": zf(this.opts.date.current),
    "data-disabled": Ht(this.isDisabled || this.isOutsideMonth && this.root.opts.disableDaysOutsideMonth.current)
  }));
  get sharedDataAttrs() {
    return a(this.#u);
  }
  set sharedDataAttrs(e) {
    w(this.#u, e);
  }
  #h = S(() => ({
    id: this.opts.id.current,
    role: "gridcell",
    "aria-selected": Ia(this.isSelectedDate),
    "aria-disabled": Ia(this.ariaDisabled),
    ...this.sharedDataAttrs,
    [this.root.getBitsAttr("cell")]: "",
    ...this.attachment
  }));
  get props() {
    return a(this.#h);
  }
  set props(e) {
    w(this.#h, e);
  }
}
class _l {
  static create(e) {
    return new _l(e, fu.get());
  }
  opts;
  cell;
  attachment;
  constructor(e, n) {
    this.opts = e, this.cell = n, this.onclick = this.onclick.bind(this), this.attachment = sr(this.opts.ref);
  }
  #e = S(() => this.cell.isOutsideMonth && this.cell.root.opts.disableDaysOutsideMonth.current || this.cell.isDisabled ? void 0 : this.cell.isFocusedDate ? 0 : -1);
  onclick(e) {
    this.cell.isDisabled || this.cell.root.handleCellClick(e, this.cell.opts.date.current);
  }
  #t = S(() => ({
    disabled: this.cell.isDisabled,
    unavailable: this.cell.isUnavailable,
    selected: this.cell.isSelectedDate,
    day: `${this.cell.opts.date.current.day}`
  }));
  get snippetProps() {
    return a(this.#t);
  }
  set snippetProps(e) {
    w(this.#t, e);
  }
  #n = S(() => ({
    id: this.opts.id.current,
    role: "button",
    "aria-label": this.cell.labelText,
    "aria-disabled": Ia(this.cell.ariaDisabled),
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
    w(this.#n, e);
  }
}
class El {
  static create(e) {
    return new El(e, ca.get());
  }
  opts;
  root;
  #e = S(() => this.root.isNextButtonDisabled);
  get isDisabled() {
    return a(this.#e);
  }
  set isDisabled(e) {
    w(this.#e, e);
  }
  attachment;
  constructor(e, n) {
    this.opts = e, this.root = n, this.onclick = this.onclick.bind(this), this.attachment = sr(this.opts.ref);
  }
  onclick(e) {
    this.isDisabled || this.root.nextPage();
  }
  #t = S(() => ({
    id: this.opts.id.current,
    role: "button",
    type: "button",
    "aria-label": "Next",
    "aria-disabled": Ia(this.isDisabled),
    "data-disabled": Ht(this.isDisabled),
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
    w(this.#t, e);
  }
}
class Al {
  static create(e) {
    return new Al(e, ca.get());
  }
  opts;
  root;
  #e = S(() => this.root.isPrevButtonDisabled);
  get isDisabled() {
    return a(this.#e);
  }
  set isDisabled(e) {
    w(this.#e, e);
  }
  attachment;
  constructor(e, n) {
    this.opts = e, this.root = n, this.onclick = this.onclick.bind(this), this.attachment = sr(this.opts.ref);
  }
  onclick(e) {
    this.isDisabled || this.root.prevPage();
  }
  #t = S(() => ({
    id: this.opts.id.current,
    role: "button",
    type: "button",
    "aria-label": "Previous",
    "aria-disabled": Ia(this.isDisabled),
    "data-disabled": Ht(this.isDisabled),
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
    w(this.#t, e);
  }
}
class Dl {
  static create(e) {
    return new Dl(e, ca.get());
  }
  opts;
  root;
  attachment;
  constructor(e, n) {
    this.opts = e, this.root = n, this.attachment = sr(this.opts.ref);
  }
  #e = S(() => ({
    id: this.opts.id.current,
    tabindex: -1,
    role: "grid",
    "aria-readonly": Ia(this.root.opts.readonly.current),
    "aria-disabled": Ia(this.root.opts.disabled.current),
    "data-readonly": Ht(this.root.opts.readonly.current),
    "data-disabled": Ht(this.root.opts.disabled.current),
    [this.root.getBitsAttr("grid")]: "",
    ...this.attachment
  }));
  get props() {
    return a(this.#e);
  }
  set props(e) {
    w(this.#e, e);
  }
}
class kl {
  static create(e) {
    return new kl(e, ca.get());
  }
  opts;
  root;
  attachment;
  constructor(e, n) {
    this.opts = e, this.root = n, this.attachment = sr(this.opts.ref);
  }
  #e = S(() => ({
    id: this.opts.id.current,
    "data-disabled": Ht(this.root.opts.disabled.current),
    "data-readonly": Ht(this.root.opts.readonly.current),
    [this.root.getBitsAttr("grid-body")]: "",
    ...this.attachment
  }));
  get props() {
    return a(this.#e);
  }
  set props(e) {
    w(this.#e, e);
  }
}
class Tl {
  static create(e) {
    return new Tl(e, ca.get());
  }
  opts;
  root;
  attachment;
  constructor(e, n) {
    this.opts = e, this.root = n, this.attachment = sr(this.opts.ref);
  }
  #e = S(() => ({
    id: this.opts.id.current,
    "data-disabled": Ht(this.root.opts.disabled.current),
    "data-readonly": Ht(this.root.opts.readonly.current),
    [this.root.getBitsAttr("grid-head")]: "",
    ...this.attachment
  }));
  get props() {
    return a(this.#e);
  }
  set props(e) {
    w(this.#e, e);
  }
}
class Ml {
  static create(e) {
    return new Ml(e, ca.get());
  }
  opts;
  root;
  attachment;
  constructor(e, n) {
    this.opts = e, this.root = n, this.attachment = sr(this.opts.ref);
  }
  #e = S(() => ({
    id: this.opts.id.current,
    "data-disabled": Ht(this.root.opts.disabled.current),
    "data-readonly": Ht(this.root.opts.readonly.current),
    [this.root.getBitsAttr("grid-row")]: "",
    ...this.attachment
  }));
  get props() {
    return a(this.#e);
  }
  set props(e) {
    w(this.#e, e);
  }
}
class Ol {
  static create(e) {
    return new Ol(e, ca.get());
  }
  opts;
  root;
  attachment;
  constructor(e, n) {
    this.opts = e, this.root = n, this.attachment = sr(this.opts.ref);
  }
  #e = S(() => ({
    id: this.opts.id.current,
    "data-disabled": Ht(this.root.opts.disabled.current),
    "data-readonly": Ht(this.root.opts.readonly.current),
    [this.root.getBitsAttr("head-cell")]: "",
    ...this.attachment
  }));
  get props() {
    return a(this.#e);
  }
  set props(e) {
    w(this.#e, e);
  }
}
class Fl {
  static create(e) {
    return new Fl(e, ca.get());
  }
  opts;
  root;
  attachment;
  constructor(e, n) {
    this.opts = e, this.root = n, this.attachment = sr(this.opts.ref);
  }
  #e = S(() => ({
    id: this.opts.id.current,
    "data-disabled": Ht(this.root.opts.disabled.current),
    "data-readonly": Ht(this.root.opts.readonly.current),
    [this.root.getBitsAttr("header")]: "",
    ...this.attachment
  }));
  get props() {
    return a(this.#e);
  }
  set props(e) {
    w(this.#e, e);
  }
}
var Bv = U("<div><!></div>");
function vu(t, e) {
  const n = Fr();
  xt(e, !0);
  let r = E(e, "children", 7), i = E(e, "child", 7), s = E(e, "ref", 15, null), l = E(e, "id", 23, () => Dt(n)), u = yr(e, [
    "$$slots",
    "$$events",
    "$$legacy",
    "$$host",
    "children",
    "child",
    "ref",
    "id"
  ]);
  const h = _l.create({
    id: _e(() => l()),
    ref: _e(() => s(), (C) => s(C))
  }), b = S(() => gr(u, h.props));
  var g = {
    get children() {
      return r();
    },
    set children(C) {
      r(C), R();
    },
    get child() {
      return i();
    },
    set child(C) {
      i(C), R();
    },
    get ref() {
      return s();
    },
    set ref(C = null) {
      s(C), R();
    },
    get id() {
      return l();
    },
    set id(C = Dt(n)) {
      l(C), R();
    }
  }, y = Ee(), x = Z(y);
  {
    var f = (C) => {
      var m = Ee(), o = Z(m);
      {
        let O = S(() => ({ props: a(b), ...h.snippetProps }));
        Pt(o, i, () => a(O));
      }
      D(C, m);
    }, _ = (C) => {
      var m = Bv();
      Or(m, () => ({ ...a(b) }));
      var o = M(m);
      {
        var O = ($) => {
          var ee = Ee(), ye = Z(ee);
          Pt(ye, () => r() ?? mr, () => h.snippetProps), D($, ee);
        }, z = ($) => {
          var ee = Ba();
          ge(() => J(ee, h.cell.opts.date.current.day)), D($, ee);
        };
        me(o, ($) => {
          r() ? $(O) : $(z, -1);
        });
      }
      A(m), D(C, m);
    };
    me(x, (C) => {
      i() ? C(f) : C(_, -1);
    });
  }
  return D(t, y), St(g);
}
It(vu, { children: {}, child: {}, ref: {}, id: {} }, [], [], { mode: "open" });
var qv = U("<table><!></table>");
function pu(t, e) {
  const n = Fr();
  xt(e, !0);
  let r = E(e, "children", 7), i = E(e, "child", 7), s = E(e, "ref", 15, null), l = E(e, "id", 23, () => Dt(n)), u = yr(e, [
    "$$slots",
    "$$events",
    "$$legacy",
    "$$host",
    "children",
    "child",
    "ref",
    "id"
  ]);
  const h = Dl.create({
    id: _e(() => l()),
    ref: _e(() => s(), (C) => s(C))
  }), b = S(() => gr(u, h.props));
  var g = {
    get children() {
      return r();
    },
    set children(C) {
      r(C), R();
    },
    get child() {
      return i();
    },
    set child(C) {
      i(C), R();
    },
    get ref() {
      return s();
    },
    set ref(C = null) {
      s(C), R();
    },
    get id() {
      return l();
    },
    set id(C = Dt(n)) {
      l(C), R();
    }
  }, y = Ee(), x = Z(y);
  {
    var f = (C) => {
      var m = Ee(), o = Z(m);
      Pt(o, i, () => ({ props: a(b) })), D(C, m);
    }, _ = (C) => {
      var m = qv();
      Or(m, () => ({ ...a(b) }));
      var o = M(m);
      Pt(o, () => r() ?? mr), A(m), D(C, m);
    };
    me(x, (C) => {
      i() ? C(f) : C(_, -1);
    });
  }
  return D(t, y), St(g);
}
It(pu, { children: {}, child: {}, ref: {}, id: {} }, [], [], { mode: "open" });
var Uv = U("<tbody><!></tbody>");
function gu(t, e) {
  const n = Fr();
  xt(e, !0);
  let r = E(e, "children", 7), i = E(e, "child", 7), s = E(e, "ref", 15, null), l = E(e, "id", 23, () => Dt(n)), u = yr(e, [
    "$$slots",
    "$$events",
    "$$legacy",
    "$$host",
    "children",
    "child",
    "ref",
    "id"
  ]);
  const h = kl.create({
    id: _e(() => l()),
    ref: _e(() => s(), (C) => s(C))
  }), b = S(() => gr(u, h.props));
  var g = {
    get children() {
      return r();
    },
    set children(C) {
      r(C), R();
    },
    get child() {
      return i();
    },
    set child(C) {
      i(C), R();
    },
    get ref() {
      return s();
    },
    set ref(C = null) {
      s(C), R();
    },
    get id() {
      return l();
    },
    set id(C = Dt(n)) {
      l(C), R();
    }
  }, y = Ee(), x = Z(y);
  {
    var f = (C) => {
      var m = Ee(), o = Z(m);
      Pt(o, i, () => ({ props: a(b) })), D(C, m);
    }, _ = (C) => {
      var m = Uv();
      Or(m, () => ({ ...a(b) }));
      var o = M(m);
      Pt(o, () => r() ?? mr), A(m), D(C, m);
    };
    me(x, (C) => {
      i() ? C(f) : C(_, -1);
    });
  }
  return D(t, y), St(g);
}
It(gu, { children: {}, child: {}, ref: {}, id: {} }, [], [], { mode: "open" });
var Vv = U("<td><!></td>");
function yu(t, e) {
  const n = Fr();
  xt(e, !0);
  let r = E(e, "children", 7), i = E(e, "child", 7), s = E(e, "ref", 15, null), l = E(e, "id", 23, () => Dt(n)), u = E(e, "date", 7), h = E(e, "month", 7), b = yr(e, [
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
  const g = Rl.create({
    id: _e(() => l()),
    ref: _e(() => s(), (o) => s(o)),
    date: _e(() => u()),
    month: _e(() => h())
  }), y = S(() => gr(b, g.props));
  var x = {
    get children() {
      return r();
    },
    set children(o) {
      r(o), R();
    },
    get child() {
      return i();
    },
    set child(o) {
      i(o), R();
    },
    get ref() {
      return s();
    },
    set ref(o = null) {
      s(o), R();
    },
    get id() {
      return l();
    },
    set id(o = Dt(n)) {
      l(o), R();
    },
    get date() {
      return u();
    },
    set date(o) {
      u(o), R();
    },
    get month() {
      return h();
    },
    set month(o) {
      h(o), R();
    }
  }, f = Ee(), _ = Z(f);
  {
    var C = (o) => {
      var O = Ee(), z = Z(O);
      {
        let $ = S(() => ({ props: a(y), ...g.snippetProps }));
        Pt(z, i, () => a($));
      }
      D(o, O);
    }, m = (o) => {
      var O = Vv();
      Or(O, () => ({ ...a(y) }));
      var z = M(O);
      Pt(z, () => r() ?? mr, () => g.snippetProps), A(O), D(o, O);
    };
    me(_, (o) => {
      i() ? o(C) : o(m, -1);
    });
  }
  return D(t, f), St(x);
}
It(
  yu,
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
var jv = U("<thead><!></thead>");
function mu(t, e) {
  const n = Fr();
  xt(e, !0);
  let r = E(e, "children", 7), i = E(e, "child", 7), s = E(e, "ref", 15, null), l = E(e, "id", 23, () => Dt(n)), u = yr(e, [
    "$$slots",
    "$$events",
    "$$legacy",
    "$$host",
    "children",
    "child",
    "ref",
    "id"
  ]);
  const h = Tl.create({
    id: _e(() => l()),
    ref: _e(() => s(), (C) => s(C))
  }), b = S(() => gr(u, h.props));
  var g = {
    get children() {
      return r();
    },
    set children(C) {
      r(C), R();
    },
    get child() {
      return i();
    },
    set child(C) {
      i(C), R();
    },
    get ref() {
      return s();
    },
    set ref(C = null) {
      s(C), R();
    },
    get id() {
      return l();
    },
    set id(C = Dt(n)) {
      l(C), R();
    }
  }, y = Ee(), x = Z(y);
  {
    var f = (C) => {
      var m = Ee(), o = Z(m);
      Pt(o, i, () => ({ props: a(b) })), D(C, m);
    }, _ = (C) => {
      var m = jv();
      Or(m, () => ({ ...a(b) }));
      var o = M(m);
      Pt(o, () => r() ?? mr), A(m), D(C, m);
    };
    me(x, (C) => {
      i() ? C(f) : C(_, -1);
    });
  }
  return D(t, y), St(g);
}
It(mu, { children: {}, child: {}, ref: {}, id: {} }, [], [], { mode: "open" });
var Kv = U("<th><!></th>");
function bu(t, e) {
  const n = Fr();
  xt(e, !0);
  let r = E(e, "children", 7), i = E(e, "child", 7), s = E(e, "ref", 15, null), l = E(e, "id", 23, () => Dt(n)), u = yr(e, [
    "$$slots",
    "$$events",
    "$$legacy",
    "$$host",
    "children",
    "child",
    "ref",
    "id"
  ]);
  const h = Ol.create({
    id: _e(() => l()),
    ref: _e(() => s(), (C) => s(C))
  }), b = S(() => gr(u, h.props));
  var g = {
    get children() {
      return r();
    },
    set children(C) {
      r(C), R();
    },
    get child() {
      return i();
    },
    set child(C) {
      i(C), R();
    },
    get ref() {
      return s();
    },
    set ref(C = null) {
      s(C), R();
    },
    get id() {
      return l();
    },
    set id(C = Dt(n)) {
      l(C), R();
    }
  }, y = Ee(), x = Z(y);
  {
    var f = (C) => {
      var m = Ee(), o = Z(m);
      Pt(o, i, () => ({ props: a(b) })), D(C, m);
    }, _ = (C) => {
      var m = Kv();
      Or(m, () => ({ ...a(b) }));
      var o = M(m);
      Pt(o, () => r() ?? mr), A(m), D(C, m);
    };
    me(x, (C) => {
      i() ? C(f) : C(_, -1);
    });
  }
  return D(t, y), St(g);
}
It(bu, { children: {}, child: {}, ref: {}, id: {} }, [], [], { mode: "open" });
var Yv = U("<tr><!></tr>");
function Yi(t, e) {
  const n = Fr();
  xt(e, !0);
  let r = E(e, "children", 7), i = E(e, "child", 7), s = E(e, "ref", 15, null), l = E(e, "id", 23, () => Dt(n)), u = yr(e, [
    "$$slots",
    "$$events",
    "$$legacy",
    "$$host",
    "children",
    "child",
    "ref",
    "id"
  ]);
  const h = Ml.create({
    id: _e(() => l()),
    ref: _e(() => s(), (C) => s(C))
  }), b = S(() => gr(u, h.props));
  var g = {
    get children() {
      return r();
    },
    set children(C) {
      r(C), R();
    },
    get child() {
      return i();
    },
    set child(C) {
      i(C), R();
    },
    get ref() {
      return s();
    },
    set ref(C = null) {
      s(C), R();
    },
    get id() {
      return l();
    },
    set id(C = Dt(n)) {
      l(C), R();
    }
  }, y = Ee(), x = Z(y);
  {
    var f = (C) => {
      var m = Ee(), o = Z(m);
      Pt(o, i, () => ({ props: a(b) })), D(C, m);
    }, _ = (C) => {
      var m = Yv();
      Or(m, () => ({ ...a(b) }));
      var o = M(m);
      Pt(o, () => r() ?? mr), A(m), D(C, m);
    };
    me(x, (C) => {
      i() ? C(f) : C(_, -1);
    });
  }
  return D(t, y), St(g);
}
It(Yi, { children: {}, child: {}, ref: {}, id: {} }, [], [], { mode: "open" });
var zv = U("<header><!></header>");
function Cu(t, e) {
  const n = Fr();
  xt(e, !0);
  let r = E(e, "children", 7), i = E(e, "child", 7), s = E(e, "ref", 15, null), l = E(e, "id", 23, () => Dt(n)), u = yr(e, [
    "$$slots",
    "$$events",
    "$$legacy",
    "$$host",
    "children",
    "child",
    "ref",
    "id"
  ]);
  const h = Fl.create({
    id: _e(() => l()),
    ref: _e(() => s(), (C) => s(C))
  }), b = S(() => gr(u, h.props));
  var g = {
    get children() {
      return r();
    },
    set children(C) {
      r(C), R();
    },
    get child() {
      return i();
    },
    set child(C) {
      i(C), R();
    },
    get ref() {
      return s();
    },
    set ref(C = null) {
      s(C), R();
    },
    get id() {
      return l();
    },
    set id(C = Dt(n)) {
      l(C), R();
    }
  }, y = Ee(), x = Z(y);
  {
    var f = (C) => {
      var m = Ee(), o = Z(m);
      Pt(o, i, () => ({ props: a(b) })), D(C, m);
    }, _ = (C) => {
      var m = zv();
      Or(m, () => ({ ...a(b) }));
      var o = M(m);
      Pt(o, () => r() ?? mr), A(m), D(C, m);
    };
    me(x, (C) => {
      i() ? C(f) : C(_, -1);
    });
  }
  return D(t, y), St(g);
}
It(Cu, { children: {}, child: {}, ref: {}, id: {} }, [], [], { mode: "open" });
var Qv = U("<div><!></div>");
function wu(t, e) {
  const n = Fr();
  xt(e, !0);
  let r = E(e, "children", 7), i = E(e, "child", 7), s = E(e, "ref", 15, null), l = E(e, "id", 23, () => Dt(n)), u = yr(e, [
    "$$slots",
    "$$events",
    "$$legacy",
    "$$host",
    "children",
    "child",
    "ref",
    "id"
  ]);
  const h = Il.create({
    id: _e(() => l()),
    ref: _e(() => s(), (C) => s(C))
  }), b = S(() => gr(u, h.props));
  var g = {
    get children() {
      return r();
    },
    set children(C) {
      r(C), R();
    },
    get child() {
      return i();
    },
    set child(C) {
      i(C), R();
    },
    get ref() {
      return s();
    },
    set ref(C = null) {
      s(C), R();
    },
    get id() {
      return l();
    },
    set id(C = Dt(n)) {
      l(C), R();
    }
  }, y = Ee(), x = Z(y);
  {
    var f = (C) => {
      var m = Ee(), o = Z(m);
      Pt(o, i, () => ({
        props: a(b),
        headingValue: h.root.headingValue
      })), D(C, m);
    }, _ = (C) => {
      var m = Qv();
      Or(m, () => ({ ...a(b) }));
      var o = M(m);
      {
        var O = ($) => {
          var ee = Ee(), ye = Z(ee);
          Pt(ye, () => r() ?? mr, () => ({ headingValue: h.root.headingValue })), D($, ee);
        }, z = ($) => {
          var ee = Ba();
          ge(() => J(ee, h.root.headingValue)), D($, ee);
        };
        me(o, ($) => {
          r() ? $(O) : $(z, -1);
        });
      }
      A(m), D(C, m);
    };
    me(x, (C) => {
      i() ? C(f) : C(_, -1);
    });
  }
  return D(t, y), St(g);
}
It(wu, { children: {}, child: {}, ref: {}, id: {} }, [], [], { mode: "open" });
var Wv = U("<button><!></button>");
function Pu(t, e) {
  const n = Fr();
  xt(e, !0);
  let r = E(e, "children", 7), i = E(e, "child", 7), s = E(e, "id", 23, () => Dt(n)), l = E(e, "ref", 15, null), u = E(e, "tabindex", 7, 0), h = yr(e, [
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
  const b = El.create({
    id: _e(() => s()),
    ref: _e(() => l(), (m) => l(m))
  }), g = S(() => gr(h, b.props, { tabindex: u() }));
  var y = {
    get children() {
      return r();
    },
    set children(m) {
      r(m), R();
    },
    get child() {
      return i();
    },
    set child(m) {
      i(m), R();
    },
    get id() {
      return s();
    },
    set id(m = Dt(n)) {
      s(m), R();
    },
    get ref() {
      return l();
    },
    set ref(m = null) {
      l(m), R();
    },
    get tabindex() {
      return u();
    },
    set tabindex(m = 0) {
      u(m), R();
    }
  }, x = Ee(), f = Z(x);
  {
    var _ = (m) => {
      var o = Ee(), O = Z(o);
      Pt(O, i, () => ({ props: a(g) })), D(m, o);
    }, C = (m) => {
      var o = Wv();
      Or(o, () => ({ ...a(g) }));
      var O = M(o);
      Pt(O, () => r() ?? mr), A(o), D(m, o);
    };
    me(f, (m) => {
      i() ? m(_) : m(C, -1);
    });
  }
  return D(t, x), St(y);
}
It(Pu, { children: {}, child: {}, id: {}, ref: {}, tabindex: {} }, [], [], { mode: "open" });
var Jv = U("<button><!></button>");
function xu(t, e) {
  const n = Fr();
  xt(e, !0);
  let r = E(e, "children", 7), i = E(e, "child", 7), s = E(e, "id", 23, () => Dt(n)), l = E(e, "ref", 15, null), u = E(e, "tabindex", 7, 0), h = yr(e, [
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
  const b = Al.create({
    id: _e(() => s()),
    ref: _e(() => l(), (m) => l(m))
  }), g = S(() => gr(h, b.props, { tabindex: u() }));
  var y = {
    get children() {
      return r();
    },
    set children(m) {
      r(m), R();
    },
    get child() {
      return i();
    },
    set child(m) {
      i(m), R();
    },
    get id() {
      return s();
    },
    set id(m = Dt(n)) {
      s(m), R();
    },
    get ref() {
      return l();
    },
    set ref(m = null) {
      l(m), R();
    },
    get tabindex() {
      return u();
    },
    set tabindex(m = 0) {
      u(m), R();
    }
  }, x = Ee(), f = Z(x);
  {
    var _ = (m) => {
      var o = Ee(), O = Z(o);
      Pt(O, i, () => ({ props: a(g) })), D(m, o);
    }, C = (m) => {
      var o = Jv();
      Or(o, () => ({ ...a(g) }));
      var O = M(o);
      Pt(O, () => r() ?? mr), A(o), D(m, o);
    };
    me(f, (m) => {
      i() ? m(_) : m(C, -1);
    });
  }
  return D(t, x), St(y);
}
It(xu, { children: {}, child: {}, id: {}, ref: {}, tabindex: {} }, [], [], { mode: "open" });
const Ll = mc({
  component: "date-field",
  parts: ["input", "label", "segment"]
}), Bs = {
  day: {
    min: 1,
    max: (t) => {
      const e = t.segmentValues.month, n = t.value.current ?? t.placeholder.current;
      return fo(e ? n.set({ month: Number.parseInt(e) }) : n);
    },
    cycle: 1,
    padZero: !0
  },
  month: {
    min: 1,
    max: 12,
    cycle: 1,
    padZero: !0,
    getAnnouncement: (t, e) => e.placeholder.current ? `${t} - ${e.formatter.fullMonth(Mr(e.placeholder.current.set({ month: t })))}` : ""
  },
  year: { min: 1, max: 9999, cycle: 1, padZero: !1 },
  hour: {
    min: (t) => t.hourCycle.current === 12 ? 1 : 0,
    max: (t) => t.hourCycle.current === 24 ? 23 : t.hourCycle.current === 12 || du(t.locale.current) === 12 ? 12 : 23,
    cycle: 1,
    canBeZero: !0,
    padZero: !0
  },
  minute: { min: 0, max: 59, cycle: 1, canBeZero: !0, padZero: !0 },
  second: { min: 0, max: 59, cycle: 1, canBeZero: !0, padZero: !0 }
}, Rs = new Yo("DateField.Root");
class Hl {
  static create(e, n) {
    return Rs.set(new Hl(e, n));
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
  descriptionId = bc();
  formatter;
  initialSegments;
  #e = be();
  get segmentValues() {
    return a(this.#e);
  }
  set segmentValues(e) {
    w(this.#e, e, !0);
  }
  announcer;
  #t = S(() => new Set(this.readonlySegments.current));
  get readonlySegmentsSet() {
    return a(this.#t);
  }
  set readonlySegmentsSet(e) {
    w(this.#t, e);
  }
  segmentStates = Id();
  #n = be(null);
  #r = be(null);
  #a = be(null);
  get descriptionNode() {
    return a(this.#a);
  }
  set descriptionNode(e) {
    w(this.#a, e, !0);
  }
  #s = be(null);
  get validationNode() {
    return a(this.#s);
  }
  set validationNode(e) {
    w(this.#s, e, !0);
  }
  states = Id();
  #i = be(null);
  get dayPeriodNode() {
    return a(this.#i);
  }
  set dayPeriodNode(e) {
    w(this.#i, e, !0);
  }
  rangeRoot = void 0;
  #l = be("");
  get name() {
    return a(this.#l);
  }
  set name(e) {
    w(this.#l, e, !0);
  }
  domContext = new Xi(() => null);
  constructor(e, n) {
    this.rangeRoot = n, this.value = e.value, this.placeholder = n ? n.opts.placeholder : e.placeholder, this.validate = n ? eh(void 0) : e.validate, this.minValue = n ? n.opts.minValue : e.minValue, this.maxValue = n ? n.opts.maxValue : e.maxValue, this.disabled = n ? n.opts.disabled : e.disabled, this.readonly = n ? n.opts.readonly : e.readonly, this.granularity = n ? n.opts.granularity : e.granularity, this.readonlySegments = n ? n.opts.readonlySegments : e.readonlySegments, this.hourCycle = n ? n.opts.hourCycle : e.hourCycle, this.locale = n ? n.opts.locale : e.locale, this.hideTimeZone = n ? n.opts.hideTimeZone : e.hideTimeZone, this.required = n ? n.opts.required : e.required, this.onInvalid = n ? n.opts.onInvalid : e.onInvalid, this.errorMessageId = n ? n.opts.errorMessageId : e.errorMessageId, this.isInvalidProp = e.isInvalidProp, this.formatter = hu({
      initialLocale: this.locale.current,
      monthFormat: _e(() => "long"),
      yearFormat: _e(() => "numeric")
    }), this.initialSegments = bi(this.inferredGranularity), this.segmentValues = this.initialSegments, this.announcer = Fo(null), this.getFieldNode = this.getFieldNode.bind(this), this.updateSegment = this.updateSegment.bind(this), this.handleSegmentClick = this.handleSegmentClick.bind(this), this.getBaseSegmentAttrs = this.getBaseSegmentAttrs.bind(this), Ue(() => {
      Xr(() => {
        this.initialSegments = bi(this.inferredGranularity);
      });
    }), Cc(() => {
      this.announcer = Fo(this.domContext.getDocument());
    }), th(() => {
      n || yv(this.descriptionId, this.domContext.getDocument());
    }), Ue(() => {
      n || this.formatter.getLocale() !== this.locale.current && this.formatter.setLocale(this.locale.current);
    }), Ue(() => {
      if (n) return;
      if (this.value.current) {
        const i = Xr(() => this.descriptionId);
        gv({
          id: i,
          formatter: this.formatter,
          value: this.value.current,
          doc: this.domContext.getDocument()
        });
      }
      const r = Xr(() => this.placeholder.current);
      this.value.current && r !== this.value.current && Xr(() => {
        this.value.current && (this.placeholder.current = this.value.current);
      });
    }), this.value.current && this.syncSegmentValues(this.value.current), Ue(() => {
      this.locale.current, this.value.current && this.syncSegmentValues(this.value.current), this.#o();
    }), Ue(() => {
      this.value.current === void 0 && (this.segmentValues = bi(this.inferredGranularity));
    }), Fs(() => this.validationStatus, () => {
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
    w(this.#n, e, !0);
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
    w(this.#r, e, !0);
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
    const n = Xo.map((r) => {
      const i = e[r];
      if (r === "month") {
        if (this.states.month.updating)
          return [r, this.states.month.updating];
        if (i < 10)
          return [r, `0${i}`];
      }
      if (r === "day") {
        if (this.states.day.updating)
          return [r, this.states.day.updating];
        if (i < 10)
          return [r, `0${i}`];
      }
      if (r === "year") {
        if (this.states.year.updating)
          return [r, this.states.year.updating];
        const l = 4 - `${i}`.length;
        if (l > 0)
          return [r, `${"0".repeat(l)}${i}`];
      }
      return [r, `${i}`];
    });
    if ("hour" in e) {
      const r = Cl.map((s) => {
        if (s === "dayPeriod")
          return this.states.dayPeriod.updating ? [s, this.states.dayPeriod.updating] : [s, this.formatter.dayPeriod(Mr(e))];
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
      }), i = [...n, ...r];
      this.segmentValues = Object.fromEntries(i), this.#o();
      return;
    }
    this.segmentValues = Object.fromEntries(n);
  }
  #d = S(() => {
    const e = this.value.current;
    if (!e) return !1;
    const n = this.validate.current?.(e);
    if (n)
      return { reason: "custom", message: n };
    const r = this.minValue.current;
    if (r && xs(e, r))
      return { reason: "min" };
    const i = this.maxValue.current;
    return i && xs(i, e) ? { reason: "max" } : !1;
  });
  get validationStatus() {
    return a(this.#d);
  }
  set validationStatus(e) {
    w(this.#d, e);
  }
  #c = S(() => this.validationStatus === !1 ? !1 : (this.isInvalidProp.current, !0));
  get isInvalid() {
    return a(this.#c);
  }
  set isInvalid(e) {
    w(this.#c, e);
  }
  #u = S(() => {
    const e = this.granularity.current;
    return e || vv(this.placeholder.current, this.granularity.current);
  });
  get inferredGranularity() {
    return a(this.#u);
  }
  set inferredGranularity(e) {
    w(this.#u, e);
  }
  #h = S(() => this.value.current !== void 0 ? this.value.current : this.placeholder.current);
  get dateRef() {
    return a(this.#h);
  }
  set dateRef(e) {
    w(this.#h, e);
  }
  #f = S(() => lv({
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
    w(this.#f, e);
  }
  #v = S(() => this.allSegmentContent.arr);
  get segmentContents() {
    return a(this.#v);
  }
  set segmentContents(e) {
    w(this.#v, e);
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
    const r = this.disabled.current, i = this.readonly.current, s = this.readonlySegmentsSet;
    if (r || i || s.has(e)) return;
    const l = this.segmentValues;
    let u = l;
    const h = this.placeholder.current;
    if (fv(l)) {
      const b = l[e], g = n;
      if (e === "month") {
        const y = g(b);
        if (this.states.month.updating = y, y !== null && l.day !== null) {
          const x = h.set({ month: Number.parseInt(y) }), f = fo(Mr(x));
          Number.parseInt(l.day) > f && (l.day = `${f}`);
        }
        u = { ...l, [e]: y };
      } else if (e === "dayPeriod") {
        const y = g(b);
        this.states.dayPeriod.updating = y;
        const x = this.value.current;
        if (x && "hour" in x) {
          const f = x.hour;
          y === "AM" ? f >= 12 && (l.hour = `${f - 12}`) : y === "PM" && f < 12 && (l.hour = `${f + 12}`);
        }
        u = { ...l, [e]: y };
      } else if (e === "hour") {
        const y = g(b);
        if (this.states.hour.updating = y, y !== null && l.dayPeriod !== null) {
          const x = this.formatter.dayPeriod(Mr(h.set({ hour: Number.parseInt(y) })), this.hourCycle.current);
          (x === "AM" || x === "PM") && (l.dayPeriod = x);
        }
        u = { ...l, [e]: y };
      } else if (e === "minute") {
        const y = g(b);
        this.states.minute.updating = y, u = { ...l, [e]: y };
      } else if (e === "second") {
        const y = g(b);
        this.states.second.updating = y, u = { ...l, [e]: y };
      } else if (e === "year") {
        const y = g(b);
        this.states.year.updating = y, u = { ...l, [e]: y };
      } else if (e === "day") {
        const y = g(b);
        this.states.day.updating = y, u = { ...l, [e]: y };
      } else {
        const y = g(b);
        u = { ...l, [e]: y };
      }
    } else if (ei(e)) {
      const b = l[e], g = n, y = g(b);
      if (e === "month" && y !== null && l.day !== null) {
        this.states.month.updating = y;
        const x = h.set({ month: Number.parseInt(y) }), f = fo(Mr(x));
        Number.parseInt(l.day) > f && (l.day = `${f}`), u = { ...l, [e]: y };
      } else if (e === "year") {
        const x = g(b);
        this.states.year.updating = x, u = { ...l, [e]: x };
      } else if (e === "day") {
        const x = g(b);
        this.states.day.updating = x, u = { ...l, [e]: x };
      } else
        u = { ...l, [e]: y };
    }
    this.segmentValues = u, hv(u, a(this.#n)) ? this.setValue(uv({
      segmentObj: u,
      fieldNode: a(this.#n),
      dateRef: this.placeholder.current
    })) : (this.setValue(void 0), this.segmentValues = u);
  }
  handleSegmentClick(e) {
    this.disabled.current && e.preventDefault();
  }
  getBaseSegmentAttrs(e, n) {
    const r = this.readonlySegmentsSet.has(e), i = {
      "aria-invalid": el(this.isInvalid),
      "aria-disabled": Ia(this.disabled.current),
      "aria-readonly": Ia(this.readonly.current || r),
      "data-invalid": Ht(this.isInvalid),
      "data-disabled": Ht(this.disabled.current),
      "data-readonly": Ht(this.readonly.current || r),
      "data-segment": `${e}`,
      [Ll.segment]: ""
    };
    if (e === "literal") return i;
    const s = this.descriptionNode?.id, l = pv(n, a(this.#n)) && s, u = this.errorMessageId?.current, h = l ? `${s} ${this.isInvalid && u ? u : ""}` : void 0, b = !(this.readonly.current || r || this.disabled.current);
    return {
      ...i,
      "aria-labelledby": this.#p(n),
      contenteditable: b ? "true" : void 0,
      "aria-describedby": h,
      tabindex: this.disabled.current ? void 0 : 0
    };
  }
}
class $l {
  static create(e) {
    return new $l(e, Rs.get());
  }
  opts;
  root;
  domContext;
  attachment;
  constructor(e, n) {
    this.opts = e, this.root = n, this.domContext = new Xi(e.ref), this.root.domContext = this.domContext, this.attachment = sr(e.ref, (r) => this.root.setFieldNode(r)), Fs(() => this.opts.name.current, (r) => {
      this.root.setName(r);
    });
  }
  #e = S(() => {
    if (!(!is || !this.domContext.getElementById(this.root.descriptionId)))
      return this.root.descriptionId;
  });
  #t = S(() => ({
    id: this.opts.id.current,
    role: "group",
    "aria-labelledby": this.root.getLabelNode()?.id ?? void 0,
    "aria-describedby": a(this.#e),
    "aria-disabled": Ia(this.root.disabled.current),
    "data-invalid": this.root.isInvalid ? "" : void 0,
    "data-disabled": Ht(this.root.disabled.current),
    [Ll.input]: "",
    ...this.attachment
  }));
  get props() {
    return a(this.#t);
  }
  set props(e) {
    w(this.#t, e);
  }
}
class Nl {
  static create() {
    return new Nl(Rs.get());
  }
  root;
  #e = S(() => this.root.name !== "");
  get shouldRender() {
    return a(this.#e);
  }
  set shouldRender(e) {
    w(this.#e, e);
  }
  #t = S(() => this.root.value.current ? this.root.value.current.toString() : "");
  get isoValue() {
    return a(this.#t);
  }
  set isoValue(e) {
    w(this.#t, e);
  }
  constructor(e) {
    this.root = e;
  }
  #n = S(() => ({
    name: this.root.name,
    value: this.isoValue,
    required: this.root.required.current
  }));
  get props() {
    return a(this.#n);
  }
  set props(e) {
    w(this.#n, e);
  }
}
class qs {
  opts;
  root;
  announcer;
  part;
  config;
  attachment;
  constructor(e, n, r, i) {
    this.opts = e, this.root = n, this.part = r, this.config = i, this.announcer = n.announcer, this.onkeydown = this.onkeydown.bind(this), this.onfocusout = this.onfocusout.bind(this), this.attachment = sr(e.ref);
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
    if (!(e.ctrlKey || e.metaKey || this.root.disabled.current) && !((this.part === "hour" || this.part === "minute" || this.part === "second") && !(this.part in n)) && (e.key !== zo && e.preventDefault(), !!wl(e.key))) {
      if (Vl(e.key)) {
        this.#a(n);
        return;
      }
      if (jl(e.key)) {
        this.#s(n);
        return;
      }
      if (Ko(e.key)) {
        this.#i(e);
        return;
      }
      if (Kl(e.key)) {
        this.#l(e);
        return;
      }
      mo(e.key) && yo(e, this.root.getFieldNode());
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
    const i = this.#e(), s = Math.floor(i / 10), l = n === 0, u = this.part;
    this.root.updateSegment(this.part, (h) => {
      if (u in this.root.states && this.root.states[u].hasLeftFocus && (h = null, this.root.states[u].hasLeftFocus = !1), h === null)
        return l ? (u in this.root.states && (this.root.states[u].lastKeyZero = !0), this.announcer.announce("0"), "0") : (u in this.root.states && (this.root.states[u].lastKeyZero || n > s) && (r = !0), u in this.root.states && (this.root.states[u].lastKeyZero = !1), r && String(n).length === 1 ? (this.announcer.announce(n), `0${n}`) : `${n}`);
      if (u in this.root.states && this.root.states[u].lastKeyZero)
        return n !== 0 ? (r = !0, this.root.states[u].lastKeyZero = !1, `0${n}`) : this.part === "hour" && n === 0 && this.root.hourCycle.current === 24 ? (r = !0, this.root.states[u].lastKeyZero = !1, "00") : (this.part === "minute" || this.part === "second") && n === 0 ? (r = !0, this.root.states[u].lastKeyZero = !1, "00") : h;
      const b = Number.parseInt(h + n.toString());
      return b > i ? (r = !0, `0${n}`) : (r = !0, `${b}`);
    }), r && cu(e, this.root.getFieldNode());
  }
  #l(e) {
    const n = this.part;
    n in this.root.states && (this.root.states[n].hasLeftFocus = !1);
    let r = !1;
    this.root.updateSegment(this.part, (i) => {
      if (i === null)
        return r = !0, this.announcer.announce(null), null;
      if (i.length === 2 && i.startsWith("0"))
        return this.announcer.announce(null), null;
      const s = i.toString();
      if (s.length === 1)
        return this.announcer.announce(null), null;
      const l = Number.parseInt(s.slice(0, -1));
      return this.announcer.announce(this.#n(l)), `${l}`;
    }), r && uu(e, this.root.getFieldNode());
  }
  onfocusout(e) {
    const n = this.part;
    n in this.root.states && (this.root.states[n].hasLeftFocus = !0), this.config.padZero && this.root.updateSegment(this.part, (r) => r && r.length === 1 ? `0${r}` : r);
  }
  getSegmentProps() {
    const e = this.root.segmentValues, n = this.root.placeholder.current, r = e[this.part] === null;
    let i = n;
    e[this.part] && (i = n.set({ [this.part]: Number.parseInt(e[this.part]) }));
    const s = i[this.part], l = this.#t(), u = this.#e();
    let h = r ? "Empty" : `${s}`;
    return this.part === "hour" && "dayPeriod" in e && e.dayPeriod && (h = r ? "Empty" : `${s} ${e.dayPeriod}`), {
      "aria-label": `${this.part}, `,
      "aria-valuemin": l,
      "aria-valuemax": u,
      "aria-valuenow": s,
      "aria-valuetext": h
    };
  }
  #o = S(() => ({
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
    w(this.#o, e);
  }
}
class Gv extends qs {
  #e = [];
  #t = 0;
  constructor(e, n) {
    super(e, n, "year", Bs.year);
  }
  onkeydown(e) {
    if (!(e.ctrlKey || e.metaKey || this.root.disabled.current) && (e.key !== zo && e.preventDefault(), !!wl(e.key))) {
      if (Vl(e.key)) {
        this.#n(), super.onkeydown(e);
        return;
      }
      if (jl(e.key)) {
        this.#n(), super.onkeydown(e);
        return;
      }
      if (Ko(e.key)) {
        this.#a(e);
        return;
      }
      if (Kl(e.key)) {
        this.#s(e);
        return;
      }
      mo(e.key) && yo(e, this.root.getFieldNode());
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
    this.root.updateSegment("year", (i) => {
      if (this.root.states.year.hasLeftFocus && (i = null, this.root.states.year.hasLeftFocus = !1), i === null)
        return this.announcer.announce(r), `000${r}`;
      const s = i.toString() + r.toString(), l = Number.parseInt(s);
      if (String(l).length < 4)
        return this.#t > 0 && this.#e.length <= this.#t && s.length <= 4 ? (this.announcer.announce(l), s) : (this.announcer.announce(l), Dd(l));
      this.announcer.announce(l), n = !0;
      const h = `${l}`;
      return h.length > 4 ? h.slice(0, 4) : h;
    }), (this.#e.length === 4 || this.#e.length === this.#t) && (n = !0), n && cu(e, this.root.getFieldNode());
  }
  #s(e) {
    this.#e = [], this.#r();
    let n = !1;
    this.root.updateSegment("year", (r) => {
      if (this.root.states.year.hasLeftFocus = !1, r === null)
        return n = !0, this.announcer.announce(null), null;
      const i = r.toString();
      if (i.length === 1)
        return this.announcer.announce(null), null;
      const s = i.slice(0, -1);
      return this.announcer.announce(s), `${s}`;
    }), n && uu(e, this.root.getFieldNode());
  }
  onfocusout(e) {
    this.root.states.year.hasLeftFocus = !0, this.#e = [], this.#n(), this.root.updateSegment("year", (n) => n && n.length !== 4 ? Dd(Number.parseInt(n)) : n);
  }
}
class Zv extends qs {
  constructor(e, n) {
    super(e, n, "day", Bs.day);
  }
}
class Xv extends qs {
  constructor(e, n) {
    super(e, n, "month", Bs.month);
  }
}
class ep extends qs {
  constructor(e, n) {
    super(e, n, "hour", Bs.hour);
  }
  // Override to handle special hour logic
  onkeydown(e) {
    if (Ko(e.key)) {
      const n = this.root.updateSegment.bind(this.root);
      this.root.updateSegment = (r, i) => {
        const s = n(r, i);
        return r === "hour" && "hour" in this.root.segmentValues && this.root.segmentValues.hour === "0" && this.root.dayPeriodNode && this.root.hourCycle.current !== 24 && (this.root.segmentValues.hour = "12"), s;
      };
    }
    super.onkeydown(e), this.root.updateSegment = this.root.updateSegment.bind(this.root);
  }
}
class tp extends qs {
  constructor(e, n) {
    super(e, n, "minute", Bs.minute);
  }
}
class np extends qs {
  constructor(e, n) {
    super(e, n, "second", Bs.second);
  }
}
class Bl {
  static create(e) {
    return new Bl(e, Rs.get());
  }
  opts;
  root;
  attachment;
  #e;
  constructor(e, n) {
    this.opts = e, this.root = n, this.#e = this.root.announcer, this.onkeydown = this.onkeydown.bind(this), this.attachment = sr(e.ref, (r) => this.root.dayPeriodNode = r);
  }
  onkeydown(e) {
    if (!(e.ctrlKey || e.metaKey || this.root.disabled.current) && (e.key !== zo && e.preventDefault(), !!ap(e.key))) {
      if (Vl(e.key) || jl(e.key)) {
        this.root.updateSegment("dayPeriod", (n) => {
          if (n === "AM")
            return this.#e.announce("PM"), "PM";
          const r = "AM";
          return this.#e.announce(r), r;
        });
        return;
      }
      Kl(e.key) && (this.root.states.dayPeriod.hasLeftFocus = !1, this.root.updateSegment("dayPeriod", () => (this.#e.announce("AM"), "AM"))), (e.key === Li || e.key === wc || Hi) && this.root.updateSegment("dayPeriod", () => {
        const n = e.key === Li || e.key === Hi ? "AM" : "PM";
        return this.#e.announce(n), n;
      }), mo(e.key) && yo(e, this.root.getFieldNode());
    }
  }
  #t = S(() => {
    const e = this.root.segmentValues;
    if (!("dayPeriod" in e)) return;
    const n = 0, r = 12, i = e.dayPeriod === "AM" ? 0 : 12, s = e.dayPeriod ?? "AM";
    return {
      ...this.root.sharedSegmentAttrs,
      id: this.opts.id.current,
      inputmode: "text",
      "aria-label": "AM/PM",
      "aria-valuemin": n,
      "aria-valuemax": r,
      "aria-valuenow": i,
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
    w(this.#t, e);
  }
}
class ql {
  static create(e) {
    return new ql(e, Rs.get());
  }
  opts;
  root;
  attachment;
  constructor(e, n) {
    this.opts = e, this.root = n, this.attachment = sr(e.ref);
  }
  #e = S(() => ({
    id: this.opts.id.current,
    "aria-hidden": el(!0),
    ...this.root.getBaseSegmentAttrs("literal", this.opts.id.current),
    ...this.attachment
  }));
  get props() {
    return a(this.#e);
  }
  set props(e) {
    w(this.#e, e);
  }
}
class Ul {
  static create(e) {
    return new Ul(e, Rs.get());
  }
  opts;
  root;
  attachment;
  constructor(e, n) {
    this.opts = e, this.root = n, this.onkeydown = this.onkeydown.bind(this), this.attachment = sr(e.ref);
  }
  onkeydown(e) {
    e.key !== zo && e.preventDefault(), !this.root.disabled.current && mo(e.key) && yo(e, this.root.getFieldNode());
  }
  #e = S(() => ({
    role: "textbox",
    id: this.opts.id.current,
    "aria-label": "timezone, ",
    style: { caretColor: "transparent" },
    onkeydown: this.onkeydown,
    ...this.root.getBaseSegmentAttrs("timeZoneName", this.opts.id.current),
    "data-readonly": Ht(!0),
    ...this.attachment
  }));
  get props() {
    return a(this.#e);
  }
  set props(e) {
    w(this.#e, e);
  }
}
class rp {
  static create(e, n) {
    const r = Rs.get();
    switch (e) {
      case "day":
        return new Zv(n, r);
      case "month":
        return new Xv(n, r);
      case "year":
        return new Gv(n, r);
      case "hour":
        return new ep(n, r);
      case "minute":
        return new tp(n, r);
      case "second":
        return new np(n, r);
      case "dayPeriod":
        return new Bl(n, r);
      case "literal":
        return new ql(n, r);
      case "timeZoneName":
        return new Ul(n, r);
    }
  }
}
function ap(t) {
  return wl(t) || t === Li || t === wc || t === Hi || t === nh;
}
function Vl(t) {
  return t === Vo;
}
function jl(t) {
  return t === jo;
}
function Kl(t) {
  return t === pc;
}
function Dd(t) {
  const n = 4 - String(t).length;
  return `${"0".repeat(n)}${t}`;
}
function Su(t, e) {
  xt(e, !0);
  const n = Nl.create();
  var r = Ee(), i = Z(r);
  {
    var s = (l) => {
      nf(l, Hs(() => n.props));
    };
    me(i, (l) => {
      n.shouldRender && l(s);
    });
  }
  D(t, r), St();
}
It(Su, {}, [], [], { mode: "open" });
var sp = U("<div><!></div>"), op = U("<!> <!>", 1);
function Iu(t, e) {
  const n = Fr();
  xt(e, !0);
  let r = E(e, "id", 23, () => Dt(n)), i = E(e, "ref", 15, null), s = E(e, "name", 7, ""), l = E(e, "children", 7), u = E(e, "child", 7), h = yr(e, [
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
  const b = $l.create({
    id: _e(() => r()),
    ref: _e(() => i(), (o) => i(o)),
    name: _e(() => s())
  }), g = S(() => gr(h, b.props));
  var y = {
    get id() {
      return r();
    },
    set id(o = Dt(n)) {
      r(o), R();
    },
    get ref() {
      return i();
    },
    set ref(o = null) {
      i(o), R();
    },
    get name() {
      return s();
    },
    set name(o = "") {
      s(o), R();
    },
    get children() {
      return l();
    },
    set children(o) {
      l(o), R();
    },
    get child() {
      return u();
    },
    set child(o) {
      u(o), R();
    }
  }, x = op(), f = Z(x);
  {
    var _ = (o) => {
      var O = Ee(), z = Z(O);
      Pt(z, u, () => ({
        props: a(g),
        segments: b.root.segmentContents
      })), D(o, O);
    }, C = (o) => {
      var O = sp();
      Or(O, () => ({ ...a(g) }));
      var z = M(O);
      Pt(z, () => l() ?? mr, () => ({ segments: b.root.segmentContents })), A(O), D(o, O);
    };
    me(f, (o) => {
      u() ? o(_) : o(C, -1);
    });
  }
  var m = L(f, 2);
  return Su(m, {}), D(t, x), St(y);
}
It(Iu, { id: {}, ref: {}, name: {}, children: {}, child: {} }, [], [], { mode: "open" });
var ip = U("<span><!></span>");
function Ru(t, e) {
  const n = Fr();
  xt(e, !0);
  let r = E(e, "id", 23, () => Dt(n)), i = E(e, "ref", 15, null), s = E(e, "children", 7), l = E(e, "child", 7), u = E(e, "part", 7), h = yr(e, [
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
  const b = rp.create(u(), {
    id: _e(() => r()),
    ref: _e(() => i(), (m) => i(m))
  }), g = S(() => gr(h, b.props));
  var y = {
    get id() {
      return r();
    },
    set id(m = Dt(n)) {
      r(m), R();
    },
    get ref() {
      return i();
    },
    set ref(m = null) {
      i(m), R();
    },
    get children() {
      return s();
    },
    set children(m) {
      s(m), R();
    },
    get child() {
      return l();
    },
    set child(m) {
      l(m), R();
    },
    get part() {
      return u();
    },
    set part(m) {
      u(m), R();
    }
  }, x = Ee(), f = Z(x);
  {
    var _ = (m) => {
      var o = Ee(), O = Z(o);
      Pt(O, l, () => ({ props: a(g) })), D(m, o);
    }, C = (m) => {
      var o = ip();
      Or(o, () => ({ ...a(g) }));
      var O = M(o);
      Pt(O, () => s() ?? mr), A(o), D(m, o);
    };
    me(f, (m) => {
      l() ? m(_) : m(C, -1);
    });
  }
  return D(t, x), St(y);
}
It(Ru, { id: {}, ref: {}, children: {}, child: {}, part: {} }, [], [], { mode: "open" });
const _u = new Yo("DatePicker.Root");
class Yl {
  static create(e) {
    return _u.set(new Yl(e));
  }
  opts;
  constructor(e) {
    this.opts = e;
  }
}
function Eu(t, e) {
  xt(e, !0);
  let n = E(e, "open", 15, !1), r = E(e, "onOpenChange", 7, Zr), i = E(e, "onOpenChangeComplete", 7, Zr), s = E(e, "value", 15), l = E(e, "onValueChange", 7, Zr), u = E(e, "placeholder", 15), h = E(e, "onPlaceholderChange", 7, Zr), b = E(e, "isDateUnavailable", 7, () => !1), g = E(e, "validate", 7, Zr), y = E(e, "onInvalid", 7, Zr), x = E(e, "minValue", 7), f = E(e, "maxValue", 7), _ = E(e, "disabled", 7, !1), C = E(e, "readonly", 7, !1), m = E(e, "granularity", 7), o = E(e, "readonlySegments", 23, () => []), O = E(e, "hourCycle", 7), z = E(e, "locale", 7), $ = E(e, "hideTimeZone", 7, !1), ee = E(e, "required", 7, !1), ye = E(e, "calendarLabel", 7, "Event"), F = E(e, "disableDaysOutsideMonth", 7, !0), X = E(e, "preventDeselect", 7, !1), ve = E(e, "pagedNavigation", 7, !1), Se = E(e, "weekStartsOn", 7), te = E(e, "weekdayFormat", 7, "narrow"), fe = E(e, "isDateDisabled", 7, () => !1), se = E(e, "fixedWeeks", 7, !1), Ae = E(e, "numberOfMonths", 7, 1), Te = E(e, "closeOnDateSelect", 7, !0), we = E(e, "initialFocus", 7, !1), ce = E(e, "errorMessageId", 7), G = E(e, "children", 7), de = E(e, "monthFormat", 7, "long"), Ie = E(e, "yearFormat", 7, "numeric");
  const Ce = Yf({
    granularity: m(),
    defaultValue: s(),
    minValue: x(),
    maxValue: f()
  });
  function N() {
    u() === void 0 && u(Ce);
  }
  N(), Fs.pre(() => u(), () => {
    N();
  });
  function I() {
    Te() && n(!1);
  }
  const Q = Yl.create({
    open: _e(() => n(), (q) => {
      n(q), r()(q);
    }),
    value: _e(() => s(), (q) => {
      s(q), l()(q);
    }),
    placeholder: _e(() => u(), (q) => {
      u(q), h()(q);
    }),
    isDateUnavailable: _e(() => b()),
    minValue: _e(() => x()),
    maxValue: _e(() => f()),
    disabled: _e(() => _()),
    readonly: _e(() => C()),
    granularity: _e(() => m()),
    readonlySegments: _e(() => o()),
    hourCycle: _e(() => O()),
    locale: rh(() => z()),
    hideTimeZone: _e(() => $()),
    required: _e(() => ee()),
    calendarLabel: _e(() => ye()),
    disableDaysOutsideMonth: _e(() => F()),
    preventDeselect: _e(() => X()),
    pagedNavigation: _e(() => ve()),
    weekStartsOn: _e(() => Se()),
    weekdayFormat: _e(() => te()),
    isDateDisabled: _e(() => fe()),
    fixedWeeks: _e(() => se()),
    numberOfMonths: _e(() => Ae()),
    initialFocus: _e(() => we()),
    onDateSelect: _e(() => I),
    defaultPlaceholder: Ce,
    monthFormat: _e(() => de()),
    yearFormat: _e(() => Ie())
  });
  rf.create({
    open: Q.opts.open,
    onOpenChangeComplete: _e(() => i())
  }), Hl.create({
    value: Q.opts.value,
    disabled: Q.opts.disabled,
    readonly: Q.opts.readonly,
    readonlySegments: Q.opts.readonlySegments,
    validate: _e(() => g()),
    onInvalid: _e(() => y()),
    minValue: Q.opts.minValue,
    maxValue: Q.opts.maxValue,
    granularity: Q.opts.granularity,
    hideTimeZone: Q.opts.hideTimeZone,
    hourCycle: Q.opts.hourCycle,
    locale: Q.opts.locale,
    required: Q.opts.required,
    placeholder: Q.opts.placeholder,
    errorMessageId: _e(() => ce()),
    isInvalidProp: _e(() => {
    })
  });
  var ne = {
    get open() {
      return n();
    },
    set open(q = !1) {
      n(q), R();
    },
    get onOpenChange() {
      return r();
    },
    set onOpenChange(q = Zr) {
      r(q), R();
    },
    get onOpenChangeComplete() {
      return i();
    },
    set onOpenChangeComplete(q = Zr) {
      i(q), R();
    },
    get value() {
      return s();
    },
    set value(q) {
      s(q), R();
    },
    get onValueChange() {
      return l();
    },
    set onValueChange(q = Zr) {
      l(q), R();
    },
    get placeholder() {
      return u();
    },
    set placeholder(q) {
      u(q), R();
    },
    get onPlaceholderChange() {
      return h();
    },
    set onPlaceholderChange(q = Zr) {
      h(q), R();
    },
    get isDateUnavailable() {
      return b();
    },
    set isDateUnavailable(q = () => !1) {
      b(q), R();
    },
    get validate() {
      return g();
    },
    set validate(q = Zr) {
      g(q), R();
    },
    get onInvalid() {
      return y();
    },
    set onInvalid(q = Zr) {
      y(q), R();
    },
    get minValue() {
      return x();
    },
    set minValue(q) {
      x(q), R();
    },
    get maxValue() {
      return f();
    },
    set maxValue(q) {
      f(q), R();
    },
    get disabled() {
      return _();
    },
    set disabled(q = !1) {
      _(q), R();
    },
    get readonly() {
      return C();
    },
    set readonly(q = !1) {
      C(q), R();
    },
    get granularity() {
      return m();
    },
    set granularity(q) {
      m(q), R();
    },
    get readonlySegments() {
      return o();
    },
    set readonlySegments(q = []) {
      o(q), R();
    },
    get hourCycle() {
      return O();
    },
    set hourCycle(q) {
      O(q), R();
    },
    get locale() {
      return z();
    },
    set locale(q) {
      z(q), R();
    },
    get hideTimeZone() {
      return $();
    },
    set hideTimeZone(q = !1) {
      $(q), R();
    },
    get required() {
      return ee();
    },
    set required(q = !1) {
      ee(q), R();
    },
    get calendarLabel() {
      return ye();
    },
    set calendarLabel(q = "Event") {
      ye(q), R();
    },
    get disableDaysOutsideMonth() {
      return F();
    },
    set disableDaysOutsideMonth(q = !0) {
      F(q), R();
    },
    get preventDeselect() {
      return X();
    },
    set preventDeselect(q = !1) {
      X(q), R();
    },
    get pagedNavigation() {
      return ve();
    },
    set pagedNavigation(q = !1) {
      ve(q), R();
    },
    get weekStartsOn() {
      return Se();
    },
    set weekStartsOn(q) {
      Se(q), R();
    },
    get weekdayFormat() {
      return te();
    },
    set weekdayFormat(q = "narrow") {
      te(q), R();
    },
    get isDateDisabled() {
      return fe();
    },
    set isDateDisabled(q = () => !1) {
      fe(q), R();
    },
    get fixedWeeks() {
      return se();
    },
    set fixedWeeks(q = !1) {
      se(q), R();
    },
    get numberOfMonths() {
      return Ae();
    },
    set numberOfMonths(q = 1) {
      Ae(q), R();
    },
    get closeOnDateSelect() {
      return Te();
    },
    set closeOnDateSelect(q = !0) {
      Te(q), R();
    },
    get initialFocus() {
      return we();
    },
    set initialFocus(q = !1) {
      we(q), R();
    },
    get errorMessageId() {
      return ce();
    },
    set errorMessageId(q) {
      ce(q), R();
    },
    get children() {
      return G();
    },
    set children(q) {
      G(q), R();
    },
    get monthFormat() {
      return de();
    },
    set monthFormat(q = "long") {
      de(q), R();
    },
    get yearFormat() {
      return Ie();
    },
    set yearFormat(q = "numeric") {
      Ie(q), R();
    }
  }, ue = Ee(), ie = Z(ue);
  return De(ie, () => ah, (q, Oe) => {
    Oe(q, {
      children: (Ze, dt) => {
        var he = Ee(), xe = Z(he);
        Pt(xe, () => G() ?? mr), D(Ze, he);
      },
      $$slots: { default: !0 }
    });
  }), D(t, ue), St(ne);
}
It(
  Eu,
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
var lp = U("<div><!></div>");
function Au(t, e) {
  const n = Fr();
  xt(e, !0);
  let r = E(e, "children", 7), i = E(e, "child", 7), s = E(e, "id", 23, () => Dt(n)), l = E(e, "ref", 15, null), u = yr(e, [
    "$$slots",
    "$$events",
    "$$legacy",
    "$$host",
    "children",
    "child",
    "id",
    "ref"
  ]);
  const h = _u.get(), b = Sl.create({
    id: _e(() => s()),
    ref: _e(() => l(), (m) => l(m)),
    calendarLabel: h.opts.calendarLabel,
    fixedWeeks: h.opts.fixedWeeks,
    isDateDisabled: h.opts.isDateDisabled,
    isDateUnavailable: h.opts.isDateUnavailable,
    locale: h.opts.locale,
    numberOfMonths: h.opts.numberOfMonths,
    pagedNavigation: h.opts.pagedNavigation,
    preventDeselect: h.opts.preventDeselect,
    readonly: h.opts.readonly,
    type: _e(() => "single"),
    weekStartsOn: h.opts.weekStartsOn,
    weekdayFormat: h.opts.weekdayFormat,
    disabled: h.opts.disabled,
    disableDaysOutsideMonth: h.opts.disableDaysOutsideMonth,
    maxValue: h.opts.maxValue,
    minValue: h.opts.minValue,
    placeholder: h.opts.placeholder,
    value: h.opts.value,
    onDateSelect: h.opts.onDateSelect,
    initialFocus: h.opts.initialFocus,
    defaultPlaceholder: h.opts.defaultPlaceholder,
    maxDays: _e(() => {
    }),
    monthFormat: h.opts.monthFormat,
    yearFormat: h.opts.yearFormat
  }), g = S(() => gr(u, b.props));
  var y = {
    get children() {
      return r();
    },
    set children(m) {
      r(m), R();
    },
    get child() {
      return i();
    },
    set child(m) {
      i(m), R();
    },
    get id() {
      return s();
    },
    set id(m = Dt(n)) {
      s(m), R();
    },
    get ref() {
      return l();
    },
    set ref(m = null) {
      l(m), R();
    }
  }, x = Ee(), f = Z(x);
  {
    var _ = (m) => {
      var o = Ee(), O = Z(o);
      {
        let z = S(() => ({ props: a(g), ...b.snippetProps }));
        Pt(O, i, () => a(z));
      }
      D(m, o);
    }, C = (m) => {
      var o = lp();
      Or(o, () => ({ ...a(g) }));
      var O = M(o);
      Pt(O, () => r() ?? mr, () => b.snippetProps), A(o), D(m, o);
    };
    me(f, (m) => {
      i() ? m(_) : m(C, -1);
    });
  }
  return D(t, x), St(y);
}
It(Au, { children: {}, child: {}, id: {}, ref: {} }, [], [], { mode: "open" });
function Du(t, e) {
  xt(e, !0);
  let n = E(e, "ref", 15, null), r = E(e, "onOpenAutoFocus", 7), i = yr(e, [
    "$$slots",
    "$$events",
    "$$legacy",
    "$$host",
    "ref",
    "onOpenAutoFocus"
  ]);
  const s = S(() => gr({ onOpenAutoFocus: r() }, { onOpenAutoFocus: Ov }));
  var l = {
    get ref() {
      return n();
    },
    set ref(u = null) {
      n(u), R();
    },
    get onOpenAutoFocus() {
      return r();
    },
    set onOpenAutoFocus(u) {
      r(u), R();
    }
  };
  return af(t, Hs(() => a(s), () => i, {
    get ref() {
      return n();
    },
    set ref(u) {
      n(u);
    }
  })), St(l);
}
It(Du, { ref: {}, onOpenAutoFocus: {} }, [], [], { mode: "open" });
function ku(t, e) {
  xt(e, !0);
  let n = E(e, "ref", 15, null), r = E(e, "onkeydown", 7), i = yr(e, [
    "$$slots",
    "$$events",
    "$$legacy",
    "$$host",
    "ref",
    "onkeydown"
  ]);
  function s(h) {
    if (mo(h.key)) {
      const g = h.currentTarget.closest(Ll.selector("input"));
      if (!g) return;
      yo(h, g);
    }
  }
  const l = S(() => gr({ onkeydown: r() }, { onkeydown: s }));
  var u = {
    get ref() {
      return n();
    },
    set ref(h = null) {
      n(h), R();
    },
    get onkeydown() {
      return r();
    },
    set onkeydown(h) {
      r(h), R();
    }
  };
  return sf(t, Hs(() => i, { "data-segment": "trigger" }, () => a(l), {
    get ref() {
      return n();
    },
    set ref(h) {
      n(h);
    }
  })), St(u);
}
It(ku, { ref: {}, onkeydown: {} }, [], [], { mode: "open" });
var dp = U('<div class="copy-icon svg-icon" aria-hidden="true"></div> <span> </span>', 1), cp = U('<div class="raw-json-icon svg-icon" aria-hidden="true"></div> <span> </span>', 1), up = U('<div class="open-in-new-icon svg-icon" aria-hidden="true"></div> <span> </span>', 1), hp = U("<!> <!>", 1), fp = U("<!> <!>", 1), vp = U("<!> <!>", 1), pp = U('<div class="broadcast-icon svg-icon" aria-hidden="true"></div> <span> </span>', 1), gp = U('<div class="trash-icon svg-icon" aria-hidden="true"></div> <span> </span>', 1), yp = U("<!> <!>", 1), mp = U("<!> <!> <!> <!>", 1);
const bp = {
  hash: "svelte-8tu42h",
  code: ".open-in-new-icon {mask-image:var(--ehagaki-icon-6f70656e5f696e5f6e65775f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}"
};
function co(t, e) {
  xt(e, !0), _a(t, bp);
  const n = () => rs(Is, "$_", r), [r, i] = Ss(), s = (G) => {
    var de = Ee(), Ie = Z(de);
    De(Ie, () => Vn, (Ce, N) => {
      N(Ce, {
        class: "menu-action-button",
        get onpointerdown() {
          return _();
        },
        get onSelect() {
          return C();
        },
        children: (I, Q) => {
          var ne = dp(), ue = L(Z(ne), 2), ie = M(ue, !0);
          A(ue), ge((q) => J(ie, q), [
            () => h() ? n()("postHistory.copyFailed") : n()("postHistory.copyNevent")
          ]), D(I, ne);
        },
        $$slots: { default: !0 }
      });
    }), D(G, de);
  }, l = (G) => {
    var de = Ee(), Ie = Z(de);
    De(Ie, () => Vn, (Ce, N) => {
      N(Ce, {
        class: "menu-action-button",
        onSelect: () => O()(),
        children: (I, Q) => {
          var ne = cp(), ue = L(Z(ne), 2), ie = M(ue, !0);
          A(ue), ge((q) => J(ie, q), [() => n()("postHistory.rawJson")]), D(I, ne);
        },
        $$slots: { default: !0 }
      });
    }), D(G, de);
  };
  let u = E(e, "order", 7), h = E(e, "copyFailed", 7), b = E(e, "showBroadcast", 7), g = E(e, "broadcastSending", 7), y = E(e, "showDelete", 7), x = E(e, "showDeleteSeparator", 7), f = E(e, "deletionSending", 7), _ = E(e, "onCopyPointerDown", 7), C = E(e, "onCopyNevent", 7), m = E(e, "externalClientLabel", 7, void 0), o = E(e, "onOpenExternalClient", 7, void 0), O = E(e, "onShowRawJson", 7), z = E(e, "onBroadcastPointerDown", 7), $ = E(e, "onBroadcastPost", 7), ee = E(e, "onOpenDeleteConfirm", 7);
  var ye = {
    get order() {
      return u();
    },
    set order(G) {
      u(G), R();
    },
    get copyFailed() {
      return h();
    },
    set copyFailed(G) {
      h(G), R();
    },
    get showBroadcast() {
      return b();
    },
    set showBroadcast(G) {
      b(G), R();
    },
    get broadcastSending() {
      return g();
    },
    set broadcastSending(G) {
      g(G), R();
    },
    get showDelete() {
      return y();
    },
    set showDelete(G) {
      y(G), R();
    },
    get showDeleteSeparator() {
      return x();
    },
    set showDeleteSeparator(G) {
      x(G), R();
    },
    get deletionSending() {
      return f();
    },
    set deletionSending(G) {
      f(G), R();
    },
    get onCopyPointerDown() {
      return _();
    },
    set onCopyPointerDown(G) {
      _(G), R();
    },
    get onCopyNevent() {
      return C();
    },
    set onCopyNevent(G) {
      C(G), R();
    },
    get externalClientLabel() {
      return m();
    },
    set externalClientLabel(G = void 0) {
      m(G), R();
    },
    get onOpenExternalClient() {
      return o();
    },
    set onOpenExternalClient(G = void 0) {
      o(G), R();
    },
    get onShowRawJson() {
      return O();
    },
    set onShowRawJson(G) {
      O(G), R();
    },
    get onBroadcastPointerDown() {
      return z();
    },
    set onBroadcastPointerDown(G) {
      z(G), R();
    },
    get onBroadcastPost() {
      return $();
    },
    set onBroadcastPost(G) {
      $(G), R();
    },
    get onOpenDeleteConfirm() {
      return ee();
    },
    set onOpenDeleteConfirm(G) {
      ee(G), R();
    }
  }, F = mp(), X = Z(F);
  {
    var ve = (G) => {
      var de = hp(), Ie = Z(de);
      De(Ie, () => Vn, (N, I) => {
        I(N, {
          class: "menu-action-button",
          get onSelect() {
            return o();
          },
          children: (Q, ne) => {
            var ue = up(), ie = L(Z(ue), 2), q = M(ie, !0);
            A(ie), ge(() => J(q, m())), D(Q, ue);
          },
          $$slots: { default: !0 }
        });
      });
      var Ce = L(Ie, 2);
      De(Ce, () => Fa, (N, I) => {
        I(N, { class: "post-history-menu-separator" });
      }), D(G, de);
    };
    me(X, (G) => {
      m() && o() && G(ve);
    });
  }
  var Se = L(X, 2);
  {
    var te = (G) => {
      var de = fp(), Ie = Z(de);
      l(Ie);
      var Ce = L(Ie, 2);
      s(Ce), D(G, de);
    }, fe = (G) => {
      var de = vp(), Ie = Z(de);
      s(Ie);
      var Ce = L(Ie, 2);
      l(Ce), D(G, de);
    };
    me(Se, (G) => {
      u() === "raw-json-first" ? G(te) : G(fe, -1);
    });
  }
  var se = L(Se, 2);
  {
    var Ae = (G) => {
      var de = Ee(), Ie = Z(de);
      De(Ie, () => Vn, (Ce, N) => {
        N(Ce, {
          class: "menu-action-button",
          get disabled() {
            return g();
          },
          get onpointerdown() {
            return z();
          },
          get onSelect() {
            return $();
          },
          children: (I, Q) => {
            var ne = pp(), ue = L(Z(ne), 2), ie = M(ue, !0);
            A(ue), ge((q) => J(ie, q), [() => n()("postHistory.broadcast")]), D(I, ne);
          },
          $$slots: { default: !0 }
        });
      }), D(G, de);
    };
    me(se, (G) => {
      b() && G(Ae);
    });
  }
  var Te = L(se, 2);
  {
    var we = (G) => {
      var de = yp(), Ie = Z(de);
      {
        var Ce = (I) => {
          var Q = Ee(), ne = Z(Q);
          De(ne, () => Fa, (ue, ie) => {
            ie(ue, { class: "post-history-menu-separator" });
          }), D(I, Q);
        };
        me(Ie, (I) => {
          x() && I(Ce);
        });
      }
      var N = L(Ie, 2);
      De(N, () => Vn, (I, Q) => {
        Q(I, {
          class: "menu-action-button menu-action-button-danger",
          get disabled() {
            return f();
          },
          onSelect: () => ee()(),
          children: (ne, ue) => {
            var ie = gp(), q = L(Z(ie), 2), Oe = M(q, !0);
            A(q), ge((Ze) => J(Oe, Ze), [
              () => f() ? n()("postHistory.deleteSending") : n()("postHistory.delete")
            ]), D(ne, ie);
          },
          $$slots: { default: !0 }
        });
      }), D(G, de);
    };
    me(Te, (G) => {
      y() && G(we);
    });
  }
  D(t, F);
  var ce = St(ye);
  return i(), ce;
}
It(
  co,
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
var Cp = U('<img class="post-history-related-avatar svelte-1g9bqtt"/>'), wp = U('<span class="post-history-related-avatar-placeholder svelte-1g9bqtt" aria-hidden="true"></span>'), Pp = U('<article class="post-history-related-card svelte-1g9bqtt"><!> <div class="post-history-related-card-body svelte-1g9bqtt"><div class="post-history-related-author svelte-1g9bqtt"><!> <span class="post-history-related-author-name svelte-1g9bqtt"> </span></div> <!> <!></div></article>');
const xp = {
  hash: "svelte-1g9bqtt",
  code: `.post-history-related-card.svelte-1g9bqtt {display:grid;--post-history-related-card-bg: color-mix(\r
            in srgb,\r
            var(--dialog-bg),\r
            var(--border-hr) 24%\r
        );border-inline-start:2px solid\r
            color-mix(in srgb, var(--theme), transparent 45%);background:var(--post-history-related-card-bg);color:var(--text);font-size:0.9rem;padding-inline-start:2px;}.post-history-related-card-body.svelte-1g9bqtt {display:grid;gap:2px;padding:2px 10px 0 8px;}.post-history-related-author.svelte-1g9bqtt {display:flex;align-items:center;min-width:0;gap:8px;}.post-history-related-avatar.svelte-1g9bqtt,\r
    .post-history-related-avatar-placeholder.svelte-1g9bqtt {width:24px;height:24px;flex:0 0 auto;border-radius:50%;background:var(--border-hr);object-fit:cover;}.post-history-related-avatar-placeholder.svelte-1g9bqtt {display:inline-block;mask-image:var(--ehagaki-icon-6163636f756e745f636972636c655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);background-color:var(--text-muted);}.post-history-related-author-name.svelte-1g9bqtt {min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:600;}.post-history-related-card .post-history-related-content {margin:0;white-space:pre-wrap;overflow-wrap:anywhere;line-height:1.45;}`
};
function zl(t, e) {
  xt(e, !0), _a(t, xp);
  let n = E(e, "event", 7), r = E(e, "profile", 7, null), i = E(e, "media", 7, void 0), s = E(e, "model", 7, void 0), l = E(e, "emojiLoadStateByUrl", 23, () => ({})), u = E(e, "emojiImageMetaByUrl", 23, () => ({})), h = E(e, "scrollRoot", 7, null), b = E(e, "onImageOpen", 7, void 0), g = E(e, "topActions", 7, void 0), y = E(e, "footerLeftExtras", 7, void 0), x = E(e, "footerActions", 7, void 0), f = E(e, "footerMenu", 7, void 0), _ = S(() => {
    const se = r()?.displayName?.trim() || r()?.name?.trim();
    return se || xc(Sc.npubEncode(n().pubkey), 12, 4);
  }), C = S(() => s() ?? $i({
    sourceContent: n().content,
    tags: n().tags,
    media: i()
  })), m = S(() => Ni(n().created_at * 1e3));
  var o = {
    get event() {
      return n();
    },
    set event(se) {
      n(se), R();
    },
    get profile() {
      return r();
    },
    set profile(se = null) {
      r(se), R();
    },
    get media() {
      return i();
    },
    set media(se = void 0) {
      i(se), R();
    },
    get model() {
      return s();
    },
    set model(se = void 0) {
      s(se), R();
    },
    get emojiLoadStateByUrl() {
      return l();
    },
    set emojiLoadStateByUrl(se = {}) {
      l(se), R();
    },
    get emojiImageMetaByUrl() {
      return u();
    },
    set emojiImageMetaByUrl(se = {}) {
      u(se), R();
    },
    get scrollRoot() {
      return h();
    },
    set scrollRoot(se = null) {
      h(se), R();
    },
    get onImageOpen() {
      return b();
    },
    set onImageOpen(se = void 0) {
      b(se), R();
    },
    get topActions() {
      return g();
    },
    set topActions(se = void 0) {
      g(se), R();
    },
    get footerLeftExtras() {
      return y();
    },
    set footerLeftExtras(se = void 0) {
      y(se), R();
    },
    get footerActions() {
      return x();
    },
    set footerActions(se = void 0) {
      x(se), R();
    },
    get footerMenu() {
      return f();
    },
    set footerMenu(se = void 0) {
      f(se), R();
    }
  }, O = Pp(), z = M(O);
  Pt(z, () => g() ?? mr);
  var $ = L(z, 2), ee = M($), ye = M(ee);
  {
    var F = (se) => {
      var Ae = Cp();
      ge(() => {
        Cn(Ae, "src", r().picture), Cn(Ae, "alt", a(_));
      }), D(se, Ae);
    }, X = (se) => {
      var Ae = wp();
      D(se, Ae);
    };
    me(ye, (se) => {
      r()?.picture ? se(F) : se(X, -1);
    });
  }
  var ve = L(ye, 2), Se = M(ve, !0);
  A(ve), A(ee);
  var te = L(ee, 2);
  Pc(te, {
    get model() {
      return a(C);
    },
    density: "compact",
    contentClass: "post-history-related-content",
    get emojiLoadStateByUrl() {
      return l();
    },
    get emojiImageMetaByUrl() {
      return u();
    },
    get scrollRoot() {
      return h();
    },
    get onImageOpen() {
      return b();
    }
  });
  var fe = L(te, 2);
  return qc(fe, {
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
  }), A($), A(O), ge(() => J(Se, a(_))), D(t, O), St(o);
}
It(
  zl,
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
var Sp = U('<article class="post-history-quote-status-card svelte-1rnem6w"><div class="post-history-quote-status-body svelte-1rnem6w"><p> </p> <!></div></article>');
const Ip = {
  hash: "svelte-1rnem6w",
  code: `.post-history-quote-status-card.svelte-1rnem6w {display:grid;border-inline-start:2px solid
            color-mix(in srgb, var(--theme), transparent 45%);background:color-mix(in srgb, var(--dialog-bg), var(--border-hr) 24%);color:var(--text);font-size:0.9rem;}.post-history-quote-status-body.svelte-1rnem6w {display:grid;gap:8px;padding:2px 10px 10px;}.post-history-quote-status-message.svelte-1rnem6w {margin:0;color:var(--text-muted);line-height:1.45;}.post-history-quote-status-error.svelte-1rnem6w {color:var(--danger);}.post-history-quote-retry-button {justify-self:start;}`
};
function Tu(t, e) {
  xt(e, !0), _a(t, Ip);
  const n = () => rs(Is, "$_", r), [r, i] = Ss();
  let s = E(e, "preview", 7), l = E(e, "model", 7, void 0), u = E(e, "emojiLoadStateByUrl", 23, () => ({})), h = E(e, "emojiImageMetaByUrl", 23, () => ({})), b = E(e, "scrollRoot", 7, null), g = E(e, "onImageOpen", 7, void 0), y = E(e, "onRetry", 7, void 0), x = E(e, "footerMenu", 7, void 0);
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
  var _ = {
    get preview() {
      return s();
    },
    set preview($) {
      s($), R();
    },
    get model() {
      return l();
    },
    set model($ = void 0) {
      l($), R();
    },
    get emojiLoadStateByUrl() {
      return u();
    },
    set emojiLoadStateByUrl($ = {}) {
      u($), R();
    },
    get emojiImageMetaByUrl() {
      return h();
    },
    set emojiImageMetaByUrl($ = {}) {
      h($), R();
    },
    get scrollRoot() {
      return b();
    },
    set scrollRoot($ = null) {
      b($), R();
    },
    get onImageOpen() {
      return g();
    },
    set onImageOpen($ = void 0) {
      g($), R();
    },
    get onRetry() {
      return y();
    },
    set onRetry($ = void 0) {
      y($), R();
    },
    get footerMenu() {
      return x();
    },
    set footerMenu($ = void 0) {
      x($), R();
    }
  }, C = Ee(), m = Z(C);
  {
    var o = ($) => {
      zl($, {
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
          return u();
        },
        get emojiImageMetaByUrl() {
          return h();
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
      var ee = Sp(), ye = M(ee), F = M(ye);
      let X;
      var ve = M(F, !0);
      A(F);
      var Se = L(F, 2);
      {
        var te = (fe) => {
          ar(fe, {
            type: "button",
            className: "post-history-quote-retry-button",
            onClick: () => y()?.(s().eventId),
            children: (se, Ae) => {
              ws();
              var Te = Ba();
              ge((we) => J(Te, we), [() => n()("postHistory.contextRetry")]), D(se, Te);
            },
            $$slots: { default: !0 }
          });
        };
        me(Se, (fe) => {
          s().status === "error" && fe(te);
        });
      }
      A(ye), A(ee), ge(
        (fe) => {
          X = Na(F, 1, "post-history-quote-status-message svelte-1rnem6w", null, X, {
            "post-history-quote-status-error": s().status === "error"
          }), J(ve, fe);
        },
        [() => f()]
      ), D($, ee);
    };
    me(m, ($) => {
      s().status === "resolved" ? $(o) : $(O, -1);
    });
  }
  D(t, C);
  var z = St(_);
  return i(), z;
}
It(
  Tu,
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
const Rp = 500, _p = 250, Ep = /^[0-9a-f]{64}$/;
function Ap() {
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
function Dp(t) {
  return { ...t };
}
function kp(t) {
  return t.tags.filter(
    (e) => e[0] === "e" && typeof e[1] == "string" && Ep.test(e[1])
  ).length;
}
class Tp {
  postHistoryRepository;
  deletionRequestsRepository;
  constructor(e = {}) {
    this.postHistoryRepository = e.postHistoryRepository ?? Ge, this.deletionRequestsRepository = e.deletionRequestsRepository ?? $s;
  }
  async importFile(e) {
    const n = Ap(), r = /* @__PURE__ */ new Set(), i = [];
    let s = !1, l = null;
    const u = Number.isFinite(e.file.size) && e.file.size > 0 ? e.file.size : 0;
    let h = 0;
    const b = () => n.invalidJsonCount > 0 || n.invalidStructureCount > 0 || n.invalidIdOrSignatureCount > 0, g = () => e.signal?.aborted ? "cancelled" : e.getCurrentPubkeyHex() !== e.ownerPubkeyHex ? "account-changed" : null, y = ($ = !1) => {
      if (!e.onProgress)
        return;
      const ee = performance.now();
      !$ && l !== null && ee - l < _p || (l = ee, e.onProgress({
        result: Dp(n),
        processedBytes: h,
        totalBytes: u
      }));
    }, x = ($) => {
      $ <= 0 || (h = Math.min(
        u,
        Math.max(h, h + $)
      ));
    }, f = async () => {
      if (i.length === 0)
        return g();
      const $ = g();
      if ($)
        return i.length = 0, $;
      const ee = i.filter((X) => X.type === "post").map((X) => ({
        event: X.event,
        attestation: X.attestation
      })), ye = i.filter((X) => X.type === "deletion").map((X) => X.event);
      if (i.length = 0, ee.length > 0)
        try {
          const X = await this.postHistoryRepository.upsertFetchedEvents({
            events: ee
          });
          n.insertedPostCount += X.insertedCount, n.updatedPostCount += X.updatedCount, n.unchangedPostCount += X.unchangedCount, n.appliedDeletionPostCount += X.appliedDeletionCount;
        } catch {
          n.failedPostEventCount += ee.length, s = !0;
        }
      const F = g();
      if (F)
        return F;
      if (ye.length > 0)
        try {
          const X = await this.deletionRequestsRepository.upsertImportedDeletionEvents({
            ownerPubkeyHex: e.ownerPubkeyHex,
            deletionEvents: ye
          });
          n.insertedDeletionRequestCount += X.insertedCount, n.updatedDeletionRequestCount += X.updatedCount, n.unchangedDeletionRequestCount += X.unchangedCount, n.unsupportedDeletionEventCount += X.ignoredCount, n.appliedDeletionPostCount += X.appliedDeletionCount;
        } catch {
          n.failedDeletionEventCount += ye.length, s = !0;
        }
      return y(), g();
    }, _ = async ($) => {
      const ee = g();
      if (ee)
        return ee;
      if ($.trim().length === 0)
        return null;
      n.nonEmptyLineCount += 1;
      let ye;
      try {
        ye = JSON.parse($);
      } catch {
        return n.invalidJsonCount += 1, null;
      }
      if (!tl(ye))
        return n.invalidStructureCount += 1, null;
      const F = ye;
      if (F.pubkey !== e.ownerPubkeyHex)
        return n.otherAccountCount += 1, null;
      if (F.kind !== 1 && F.kind !== 42 && F.kind !== 5)
        return n.unsupportedKindCount += 1, null;
      const X = sh(F);
      if (!X)
        return n.invalidIdOrSignatureCount += 1, null;
      if (r.has(F.id))
        return n.fileDuplicateCount += 1, null;
      if (r.add(F.id), F.kind === 1 || F.kind === 42)
        n.uniquePostEventCount += 1, i.push({ type: "post", ...X });
      else if (F.kind === 5) {
        n.uniqueDeletionEventCount += 1;
        const ve = kp(F);
        if (n.validDeletionETagCount += ve, ve === 0)
          return n.unsupportedDeletionEventCount += 1, null;
        i.push({ type: "deletion", ...X });
      }
      return i.length >= Rp ? f() : null;
    };
    let C;
    try {
      C = e.file.stream().getReader();
    } catch {
      return n.status = "failed", y(!0), n;
    }
    const m = () => {
      C.cancel().catch(() => {
      });
    };
    e.signal?.addEventListener("abort", m, { once: !0 });
    const o = new TextDecoder("utf-8", { fatal: !0 });
    let O = "";
    try {
      for (; ; ) {
        const $ = g();
        if ($)
          return n.status = $, await C.cancel().catch(() => {
          }), i.length = 0, y(!0), n;
        const ee = await C.read();
        if (ee.done) {
          if (O += o.decode(), O.length > 0) {
            const F = await _(O.replace(/\r$/, ""));
            if (F)
              return n.status = F, i.length = 0, y(!0), n;
          }
          break;
        }
        O += o.decode(ee.value, { stream: !0 });
        const ye = O.split(`
`);
        O = ye.pop() ?? "";
        for (const F of ye) {
          const X = await _(F.replace(/\r$/, ""));
          if (X)
            return n.status = X, await C.cancel().catch(() => {
            }), i.length = 0, y(!0), n;
        }
        x(ee.value.byteLength), y();
      }
    } catch {
      const $ = g();
      if ($)
        return n.status = $, i.length = 0, y(!0), n;
      const ee = await f();
      return ee ? (n.status = ee, y(!0), n) : (n.status = n.nonEmptyLineCount > 0 ? "partial" : "failed", y(!0), n);
    } finally {
      e.signal?.removeEventListener("abort", m), C.releaseLock();
    }
    const z = await f();
    return z ? (n.status = z, y(!0), n) : (n.status = s || b() ? "partial" : "completed", y(!0), n);
  }
}
const Mp = new Tp();
var Op = U('<div class="xmark-icon svg-icon svelte-1qfqhib" aria-hidden="true"></div>'), Fp = U('<span class="import-icon svg-icon svelte-1qfqhib" aria-hidden="true"></span> <span> </span>', 1), Lp = U('<div aria-live="polite"> </div>'), Hp = U('<div class="import-progress-indicator"></div>'), $p = U('<div class="import-progress svelte-1qfqhib"><!> <div class="import-progress-summary svelte-1qfqhib"><span class="import-progress-metric svelte-1qfqhib"><span> </span> <span class="import-progress-number svelte-1qfqhib"> </span></span> <span class="import-progress-metric svelte-1qfqhib"><span> </span> <span class="import-progress-number svelte-1qfqhib"> </span></span> <span class="import-progress-metric svelte-1qfqhib"><span> </span> <span class="import-progress-number svelte-1qfqhib"> </span></span></div> <!></div>'), Np = U('<div class="import-results svelte-1qfqhib"><section aria-labelledby="post-history-import-input-heading" class="svelte-1qfqhib"><h3 id="post-history-import-input-heading" class="svelte-1qfqhib"> </h3> <dl class="svelte-1qfqhib"><div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div> <div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div> <div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div> <div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div> <div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div> <div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div> <div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div></dl></section> <section aria-labelledby="post-history-import-post-heading" class="svelte-1qfqhib"><h3 id="post-history-import-post-heading" class="svelte-1qfqhib"> </h3> <dl class="svelte-1qfqhib"><div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div> <div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div> <div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div> <div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div> <div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div> <div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div></dl></section> <section aria-labelledby="post-history-import-deletion-heading" class="svelte-1qfqhib"><h3 id="post-history-import-deletion-heading" class="svelte-1qfqhib"> </h3> <dl class="svelte-1qfqhib"><div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div> <div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div> <div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div> <div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div> <div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div> <div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div> <div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div></dl></section></div>'), Bp = U('<div class="import-heading svelte-1qfqhib"><h2 class="svelte-1qfqhib"> </h2> <p class="svelte-1qfqhib"> </p></div> <input class="visually-hidden import-file-input" type="file"/> <div role="presentation"><!> <p class="import-drop-hint svelte-1qfqhib"> </p></div> <!> <!>', 1);
const qp = {
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
function Mu(t, e) {
  xt(e, !0), _a(t, qp);
  const n = () => rs(Is, "$_", r), [r, i] = Ss();
  let s = E(e, "open", 15, !1), l = E(e, "ownerPubkeyHex", 7), u = E(e, "getCurrentPubkeyHex", 7), h = E(e, "onOpenChange", 7, void 0), b = E(e, "onImported", 7, void 0), g = be(null), y = be(!1), x = be(null), f = be(null), _ = be(0), C = be(0), m = be(0), o = be(0), O = null, z = null, $ = null, ee = 0, ye = !1, F = S(() => a(f)?.processedBytes ?? a(_)), X = S(() => a(f)?.totalBytes ?? a(C)), ve = S(() => a(X) <= 0 ? 0 : Math.min(100, Math.max(0, Math.round(a(F) / a(X) * 100)))), Se = S(() => {
    if (a(F) <= 0 || a(X) <= 0 || a(F) >= a(X) || a(m) < 1e3)
      return null;
    const he = a(F) / a(m), xe = (a(X) - a(F)) / he;
    return Number.isFinite(xe) && xe >= 0 ? xe : null;
  }), te = S(() => a(y) ? a(Se) === null ? n()("postHistory.importRemainingTimeCalculating") : fe(a(Se)) : a(x)?.status === "completed" || a(x)?.status === "partial" ? fe(0) : n()("postHistory.importRemainingTimeUnavailable"));
  function fe(he) {
    const xe = Math.max(0, Math.floor(he / 1e3)), $e = String(xe % 60).padStart(2, "0"), ae = Math.floor(xe / 60), at = ae % 60;
    return ae < 60 ? `${at}:${$e}` : `${Math.floor(ae / 60)}:${String(at).padStart(2, "0")}:${$e}`;
  }
  function se() {
    $ !== null && w(m, Math.max(0, performance.now() - $), !0);
  }
  function Ae() {
    z !== null && (clearInterval(z), z = null), $ = null;
  }
  function Te() {
    Ae(), w(m, 0), $ = performance.now(), z = setInterval(se, 1e3);
  }
  function we() {
    Ae(), w(f, null), w(_, 0), w(C, 0), w(m, 0);
  }
  function ce(he) {
    return `translate: -${100 - he}% 0;`;
  }
  let G = S(() => a(y) ? "postHistory.importReading" : a(x) ? a(x).status === "completed" ? "postHistory.importComplete" : a(x).status === "partial" ? "postHistory.importPartial" : a(x).status === "account-changed" ? "postHistory.importAccountChanged" : a(x).status === "cancelled" ? "postHistory.importCancelled" : "postHistory.importFailed" : null);
  function de() {
    w(x, null), w(y, !1), we(), w(o, 0), O = null, a(g) && (a(g).value = "");
  }
  function Ie() {
    ee += 1, O?.abort(), O = null, w(y, !1), we(), w(o, 0);
  }
  function Ce(he) {
    he || Ie(), h()?.(he);
  }
  function N() {
    !a(y) && l() && a(g)?.click();
  }
  function I(he) {
    return he ? Array.from(he.types).includes("Files") || he.files.length > 0 : !1;
  }
  function Q(he) {
    I(he.dataTransfer) && (he.preventDefault(), w(o, a(o) + 1));
  }
  function ne(he) {
    he.preventDefault(), I(he.dataTransfer);
  }
  function ue(he) {
    a(o) === 0 && !I(he.dataTransfer) || w(o, Math.max(0, a(o) - 1), !0);
  }
  function ie(he) {
    if (he.preventDefault(), !I(he.dataTransfer))
      return;
    w(o, 0);
    const xe = he.dataTransfer?.files[0];
    xe && q(xe);
  }
  async function q(he) {
    if (a(y) || !l())
      return;
    const xe = ++ee, $e = new AbortController();
    O = $e, w(y, !0), w(x, null), w(f, null), w(_, 0), w(C, Number.isFinite(he.size) && he.size > 0 ? he.size : 0, !0), Te();
    try {
      const ae = await Mp.importFile({
        file: he,
        ownerPubkeyHex: l(),
        getCurrentPubkeyHex: u(),
        signal: $e.signal,
        onProgress: (gt) => {
          xe === ee && s() && (w(
            f,
            {
              result: { ...gt.result },
              processedBytes: gt.processedBytes,
              totalBytes: gt.totalBytes
            },
            !0
          ), w(_, gt.processedBytes, !0), w(C, gt.totalBytes, !0), w(x, { ...gt.result }, !0), se());
        }
      });
      if (xe !== ee || !s())
        return;
      w(x, ae, !0), ae.insertedPostCount + ae.updatedPostCount + ae.appliedDeletionPostCount > 0 && await b()?.();
    } finally {
      xe === ee && (w(y, !1), Ae(), O = null);
    }
  }
  async function Oe(he) {
    const xe = he.currentTarget, $e = xe.files?.[0];
    xe.value = "", $e && await q($e);
  }
  Ue(() => {
    s() && !ye ? de() : !s() && ye && Ie(), ye = s();
  }), Ns(Ae);
  var Ze = {
    get open() {
      return s();
    },
    set open(he = !1) {
      s(he), R();
    },
    get ownerPubkeyHex() {
      return l();
    },
    set ownerPubkeyHex(he) {
      l(he), R();
    },
    get getCurrentPubkeyHex() {
      return u();
    },
    set getCurrentPubkeyHex(he) {
      u(he), R();
    },
    get onOpenChange() {
      return h();
    },
    set onOpenChange(he = void 0) {
      h(he), R();
    },
    get onImported() {
      return b();
    },
    set onImported(he = void 0) {
      b(he), R();
    }
  };
  {
    const he = (ae) => {
      var at = Ee(), gt = Z(at);
      {
        const tt = (st, nt) => {
          let zt = () => nt?.().props;
          {
            let Xe = S(() => n()("global.close"));
            ar(st, Hs(zt, {
              className: "modal-close",
              shape: "square",
              get ariaLabel() {
                return a(Xe);
              },
              children: (je, et) => {
                var Ye = Op();
                D(je, Ye);
              },
              $$slots: { default: !0 }
            }));
          }
        };
        De(gt, () => Bc, (st, nt) => {
          nt(st, { child: tt, $$slots: { child: !0 } });
        });
      }
      D(ae, at);
    };
    let xe = S(() => n()("postHistory.importTitle")), $e = S(() => n()("postHistory.importDescription"));
    Nc(t, {
      onOpenChange: Ce,
      get title() {
        return a(xe);
      },
      get description() {
        return a($e);
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
      children: (ae, at) => {
        var gt = Bp(), tt = Z(gt), st = M(tt), nt = M(st, !0);
        A(st);
        var zt = L(st, 2), Xe = M(zt, !0);
        A(zt), A(tt);
        var je = L(tt, 2);
        Bi(je, ($t) => w(g, $t), () => a(g));
        var et = L(je, 2);
        let Ye;
        var jn = M(et);
        {
          let $t = S(() => a(y) || !l()), an = S(() => n()("postHistory.importChooseFile"));
          ar(jn, {
            className: "post-history-import-file-button",
            variant: "default",
            shape: "pill",
            get disabled() {
              return a($t);
            },
            get ariaLabel() {
              return a(an);
            },
            onClick: N,
            children: (sn, Pn) => {
              var un = Fp(), Tn = L(Z(un), 2), Kn = M(Tn, !0);
              A(Tn), ge((lr) => J(Kn, lr), [() => n()("postHistory.importChooseFile")]), D(sn, un);
            },
            $$slots: { default: !0 }
          });
        }
        var yt = L(jn, 2), kt = M(yt, !0);
        A(yt), A(et);
        var Me = L(et, 2);
        {
          var Qt = ($t) => {
            var an = $p(), sn = M(an);
            {
              var Pn = (hn) => {
                var Sn = Lp();
                let zn;
                var Gn = M(Sn, !0);
                A(Sn), ge(
                  (Sr) => {
                    zn = Na(Sn, 1, "import-progress-status svelte-1qfqhib", null, zn, {
                      "import-progress-status-error": a(x)?.status === "failed"
                    }), J(Gn, Sr);
                  },
                  [() => n()(a(G))]
                ), D(hn, Sn);
              };
              me(sn, (hn) => {
                a(G) && hn(Pn);
              });
            }
            var un = L(sn, 2), Tn = M(un), Kn = M(Tn), lr = M(Kn, !0);
            A(Kn);
            var Wt = L(Kn, 2), ct = M(Wt);
            A(Wt), A(Tn);
            var xr = L(Tn, 2), ot = M(xr), on = M(ot, !0);
            A(ot);
            var Yn = L(ot, 2), Fn = M(Yn, !0);
            A(Yn), A(xr);
            var dr = L(xr, 2), Ln = M(dr), Mn = M(Ln, !0);
            A(Ln);
            var xn = L(Ln, 2), br = M(xn, !0);
            A(xn), A(dr), A(un);
            var ua = L(un, 2);
            {
              let hn = S(() => n()("postHistory.importProgressBarLabel")), Sn = S(() => `${a(ve)}%`);
              De(ua, () => oh, (zn, Gn) => {
                Gn(zn, {
                  get value() {
                    return a(ve);
                  },
                  max: 100,
                  get "aria-label"() {
                    return a(hn);
                  },
                  get "aria-valuetext"() {
                    return a(Sn);
                  },
                  class: "import-progress-root",
                  children: (Sr, ea) => {
                    var Lr = Hp();
                    ge((ha) => Qo(Lr, ha), [() => ce(a(ve))]), D(Sr, Lr);
                  },
                  $$slots: { default: !0 }
                });
              });
            }
            A(an), ge(
              (hn, Sn, zn, Gn, Sr) => {
                Cn(an, "aria-label", hn), J(lr, Sn), J(ct, `${a(ve) ?? ""}%`), J(on, zn), J(Fn, Gn), J(Mn, Sr), J(br, a(te));
              },
              [
                () => n()("postHistory.importProgress"),
                () => n()("postHistory.importProgress"),
                () => n()("postHistory.importElapsedTime"),
                () => fe(a(m)),
                () => n()("postHistory.importEstimatedRemainingTime")
              ]
            ), D($t, an);
          };
          me(Me, ($t) => {
            (a(y) || a(x)) && $t(Qt);
          });
        }
        var or = L(Me, 2);
        {
          var ir = ($t) => {
            var an = Np(), sn = M(an), Pn = M(sn), un = M(Pn, !0);
            A(Pn);
            var Tn = L(Pn, 2), Kn = M(Tn), lr = M(Kn), Wt = M(lr, !0);
            A(lr);
            var ct = L(lr), xr = M(ct, !0);
            A(ct), A(Kn);
            var ot = L(Kn, 2), on = M(ot), Yn = M(on, !0);
            A(on);
            var Fn = L(on), dr = M(Fn, !0);
            A(Fn), A(ot);
            var Ln = L(ot, 2), Mn = M(Ln), xn = M(Mn, !0);
            A(Mn);
            var br = L(Mn), ua = M(br, !0);
            A(br), A(Ln);
            var hn = L(Ln, 2), Sn = M(hn), zn = M(Sn, !0);
            A(Sn);
            var Gn = L(Sn), Sr = M(Gn, !0);
            A(Gn), A(hn);
            var ea = L(hn, 2), Lr = M(ea), ha = M(Lr, !0);
            A(Lr);
            var Ir = L(Lr), ta = M(Ir, !0);
            A(Ir), A(ea);
            var na = L(ea, 2), Rr = M(na), Ea = M(Rr, !0);
            A(Rr);
            var fa = L(Rr), Cr = M(fa, !0);
            A(fa), A(na);
            var jr = L(na, 2), Kr = M(jr), _r = M(Kr, !0);
            A(Kr);
            var ra = L(Kr), Yr = M(ra, !0);
            A(ra), A(jr), A(Tn), A(sn);
            var va = L(sn, 2), Aa = M(va), pa = M(Aa, !0);
            A(Aa);
            var ln = L(Aa, 2), ga = M(ln), Er = M(ga), Da = M(Er, !0);
            A(Er);
            var cr = L(Er), ka = M(cr, !0);
            A(cr), A(ga);
            var wr = L(ga, 2), ya = M(wr), ma = M(ya, !0);
            A(ya);
            var Ar = L(ya), ls = M(Ar, !0);
            A(Ar), A(wr);
            var Hr = L(wr, 2), aa = M(Hr), Hn = M(aa, !0);
            A(aa);
            var Dr = L(aa), d = M(Dr, !0);
            A(Dr), A(Hr);
            var v = L(Hr, 2), H = M(v), B = M(H, !0);
            A(H);
            var j = L(H), oe = M(j, !0);
            A(j), A(v);
            var W = L(v, 2), pe = M(W), Pe = M(pe, !0);
            A(pe);
            var Le = L(pe), ke = M(Le, !0);
            A(Le), A(W);
            var He = L(W, 2), Fe = M(He), ut = M(Fe, !0);
            A(Fe);
            var ht = L(Fe), Tt = M(ht, !0);
            A(ht), A(He), A(ln), A(va);
            var Xt = L(va, 2), At = M(Xt), Pr = M(At, !0);
            A(At);
            var zr = L(At, 2), ur = M(zr), sa = M(ur), it = M(sa, !0);
            A(sa);
            var fn = L(sa), ba = M(fn, !0);
            A(fn), A(ur);
            var $r = L(ur, 2), Ca = M($r), ds = M(Ca, !0);
            A(Ca);
            var cs = L(Ca), _s = M(cs, !0);
            A(cs), A($r);
            var Ua = L($r, 2), us = M(Ua), Us = M(us, !0);
            A(us);
            var Es = L(us), Va = M(Es, !0);
            A(Es), A(Ua);
            var hs = L(Ua, 2), fs = M(hs), Vs = M(fs, !0);
            A(fs);
            var As = L(fs), js = M(As, !0);
            A(As), A(hs);
            var ja = L(hs, 2), Ka = M(ja), Ds = M(Ka, !0);
            A(Ka);
            var oa = L(Ka), p = M(oa, !0);
            A(oa), A(ja);
            var P = L(ja, 2), k = M(P), V = M(k, !0);
            A(k);
            var K = L(k), c = M(K, !0);
            A(K), A(P);
            var T = L(P, 2), re = M(T), le = M(re, !0);
            A(re);
            var Re = L(re), Je = M(Re, !0);
            A(Re), A(T), A(zr), A(Xt), A(an), ge(
              (mt, bt, ze, Rt, Zn, hr, wa, fr, Qr, Ya, Ks, vs, Ys, kr, ps, za, Wr, gs, $n, Qa, Wa, Nr, ys) => {
                J(un, mt), J(Wt, bt), J(xr, a(x).nonEmptyLineCount), J(Yn, ze), J(dr, a(x).fileDuplicateCount), J(xn, Rt), J(ua, a(x).otherAccountCount), J(zn, Zn), J(Sr, a(x).unsupportedKindCount), J(ha, hr), J(ta, a(x).invalidJsonCount), J(Ea, wa), J(Cr, a(x).invalidStructureCount), J(_r, fr), J(Yr, a(x).invalidIdOrSignatureCount), J(pa, Qr), J(Da, Ya), J(ka, a(x).uniquePostEventCount), J(ma, Ks), J(ls, a(x).insertedPostCount), J(Hn, vs), J(d, a(x).updatedPostCount), J(B, Ys), J(oe, a(x).unchangedPostCount), J(Pe, kr), J(ke, a(x).failedPostEventCount), J(ut, ps), J(Tt, a(x).appliedDeletionPostCount), J(Pr, za), J(it, Wr), J(ba, a(x).uniqueDeletionEventCount), J(ds, gs), J(_s, a(x).validDeletionETagCount), J(Us, $n), J(Va, a(x).insertedDeletionRequestCount), J(Vs, Qa), J(js, a(x).updatedDeletionRequestCount), J(Ds, Wa), J(p, a(x).unchangedDeletionRequestCount), J(V, Nr), J(c, a(x).unsupportedDeletionEventCount), J(le, ys), J(Je, a(x).failedDeletionEventCount);
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
            ), D($t, an);
          };
          me(or, ($t) => {
            a(x) && $t(ir);
          });
        }
        ge(
          ($t, an, sn, Pn) => {
            J(nt, $t), J(Xe, an), Cn(je, "aria-label", sn), Ye = Na(et, 1, "import-drop-zone svelte-1qfqhib", null, Ye, { "import-drop-zone-active": a(o) > 0 }), J(kt, Pn);
          },
          [
            () => n()("postHistory.importTitle"),
            () => n()("postHistory.importDescription"),
            () => n()("postHistory.importChooseFile"),
            () => a(o) > 0 ? n()("postHistory.importDropActive") : n()("postHistory.importDropHint")
          ]
        ), Ao("change", je, Oe), oo("dragenter", et, Q), oo("dragover", et, ne), oo("dragleave", et, ue), oo("drop", et, ie), D(ae, gt);
      },
      $$slots: { footer: !0, default: !0 }
    });
  }
  var dt = St(Ze);
  return i(), dt;
}
Hc(["change"]);
It(
  Mu,
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
var Up = U('<span class="post-preview-replies-badge svelte-11vk23d" aria-hidden="true"> </span>'), Vp = U("<!> <!>", 1);
const jp = {
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
function Ql(t, e) {
  xt(e, !0), _a(t, jp);
  let n = E(e, "count", 7), r = E(e, "selected", 7), i = E(e, "ariaLabel", 7), s = E(e, "onClick", 7), l = E(e, "tooltipContent", 23, i);
  const u = $c().overlayTarget;
  var h = {
    get count() {
      return n();
    },
    set count(y) {
      n(y), R();
    },
    get selected() {
      return r();
    },
    set selected(y) {
      r(y), R();
    },
    get ariaLabel() {
      return i();
    },
    set ariaLabel(y) {
      i(y), R();
    },
    get onClick() {
      return s();
    },
    set onClick(y) {
      s(y), R();
    },
    get tooltipContent() {
      return l();
    },
    set tooltipContent(y = i) {
      l(y), R();
    }
  }, b = Ee(), g = Z(b);
  return De(g, () => ch, (y, x) => {
    x(y, {
      children: (f, _) => {
        var C = Ee(), m = Z(C);
        De(m, () => ih, (o, O) => {
          O(o, {
            delayDuration: 500,
            children: (z, $) => {
              var ee = Vp(), ye = Z(ee);
              {
                const X = (ve, Se) => {
                  let te = () => Se?.().props;
                  const fe = S(() => {
                    const { onclick: se, ...Ae } = te();
                    return { tooltipOnclick: se, restProps: Ae };
                  });
                  ar(ve, Hs(
                    {
                      type: "button",
                      class: "post-preview-replies-badge-button",
                      get ariaLabel() {
                        return i();
                      },
                      contentLayout: "icon",
                      shape: "circle",
                      get selected() {
                        return r();
                      },
                      onClick: (se) => {
                        s()(), typeof a(fe).tooltipOnclick == "function" && a(fe).tooltipOnclick(se);
                      }
                    },
                    () => a(fe).restProps,
                    {
                      children: (se, Ae) => {
                        var Te = Up(), we = M(Te, !0);
                        A(Te), ge(() => J(we, n())), D(se, Te);
                      },
                      $$slots: { default: !0 }
                    }
                  ));
                };
                De(ye, () => lh, (ve, Se) => {
                  Se(ve, { child: X, $$slots: { child: !0 } });
                });
              }
              var F = L(ye, 2);
              De(F, () => Ro, (X, ve) => {
                ve(X, {
                  get to() {
                    return u;
                  },
                  children: (Se, te) => {
                    var fe = Ee(), se = Z(fe);
                    De(se, () => dh, (Ae, Te) => {
                      Te(Ae, {
                        sideOffset: 8,
                        class: "tooltip-content post-preview-tooltip-content",
                        children: (we, ce) => {
                          ws();
                          var G = Ba();
                          ge(() => J(G, l())), D(we, G);
                        },
                        $$slots: { default: !0 }
                      });
                    }), D(Se, fe);
                  },
                  $$slots: { default: !0 }
                });
              }), D(z, ee);
            },
            $$slots: { default: !0 }
          });
        }), D(f, C);
      },
      $$slots: { default: !0 }
    });
  }), D(t, b), St(h);
}
It(
  Ql,
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
var Kp = U('<span class="post-history-thread-toggle-spinner post-history-thread-action-spinner svelte-cenxtw" aria-hidden="true"></span>'), Yp = U('<span class="post-history-thread-toggle-icon-wrapper svelte-cenxtw" aria-hidden="true"><span></span></span>');
const zp = {
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
function Wl(t, e) {
  xt(e, !0), _a(t, zp);
  let n = E(e, "expanded", 7), r = E(e, "ariaLabel", 7), i = E(e, "title", 23, r), s = E(e, "loading", 7, !1), l = E(e, "onClick", 7), u = S(() => [s() ? "is-loading" : ""].filter(Boolean).join(" "));
  var h = {
    get expanded() {
      return n();
    },
    set expanded(b) {
      n(b), R();
    },
    get ariaLabel() {
      return r();
    },
    set ariaLabel(b) {
      r(b), R();
    },
    get title() {
      return i();
    },
    set title(b = r) {
      i(b), R();
    },
    get loading() {
      return s();
    },
    set loading(b = !1) {
      s(b), R();
    },
    get onClick() {
      return l();
    },
    set onClick(b) {
      l(b), R();
    }
  };
  {
    let b = S(() => `post-history-thread-toggle-button ${a(u)}`.trim());
    ar(t, {
      type: "button",
      get className() {
        return a(b);
      },
      get ariaLabel() {
        return r();
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
        return l();
      },
      children: (g, y) => {
        var x = Ee(), f = Z(x);
        {
          var _ = (m) => {
            var o = Kp();
            D(m, o);
          }, C = (m) => {
            var o = Yp(), O = M(o);
            A(o), ge(() => Na(
              O,
              1,
              `post-history-thread-toggle-icon ${n() ? "post-history-thread-toggle-icon-collapse" : "post-history-thread-toggle-icon-arrow-top-right"} svg-icon`,
              "svelte-cenxtw"
            )), D(m, o);
          };
          me(f, (m) => {
            s() ? m(_) : m(C, -1);
          });
        }
        D(g, x);
      },
      $$slots: { default: !0 }
    });
  }
  return St(h);
}
It(
  Wl,
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
var Qp = U("<span> </span>");
const Wp = {
  hash: "svelte-1uufmpv",
  code: ".post-history-status-pill.svelte-1uufmpv {display:inline-flex;align-items:center;justify-content:center;min-height:18px;padding:0 8px;border:1px solid color-mix(in srgb, currentColor 18%, transparent);border-radius:999px;background:color-mix(in srgb, currentColor 8%, transparent);font-size:0.72rem;line-height:1;white-space:nowrap;}.post-history-status-pill-muted.svelte-1uufmpv {color:var(--text-muted, currentColor);}.post-history-status-pill-danger.svelte-1uufmpv {color:var(--destructive-fg, currentColor);}"
};
function Ou(t, e) {
  xt(e, !0), _a(t, Wp);
  let n = E(e, "label", 7), r = E(e, "tone", 7), i = E(e, "className", 7, "");
  var s = {
    get label() {
      return n();
    },
    set label(h) {
      n(h), R();
    },
    get tone() {
      return r();
    },
    set tone(h) {
      r(h), R();
    },
    get className() {
      return i();
    },
    set className(h = "") {
      i(h), R();
    }
  }, l = Qp(), u = M(l, !0);
  return A(l), ge(
    (h) => {
      Na(l, 1, h, "svelte-1uufmpv"), Cn(l, "aria-label", n()), Cn(l, "title", n()), J(u, n());
    },
    [
      () => uh(`post-history-status-pill post-history-status-pill-${r()} ${i()}`.trim())
    ]
  ), D(t, l), St(s);
}
It(Ou, { label: {}, tone: {}, className: {} }, [], [], { mode: "open" });
function Fu(t, e) {
  xt(e, !0);
  const n = () => rs(Is, "$_", r), [r, i] = Ss();
  let s = E(e, "eventId", 7), l = S(() => {
    if (s())
      return hh[s()];
  });
  function u(_) {
    return _ === "pending" || _ === "processing" ? n()("postHistory.deleteSending") : _ === "failed" ? n()("postHistory.deleteFailed") : null;
  }
  let h = S(() => u(a(l)));
  var b = {
    get eventId() {
      return s();
    },
    set eventId(_) {
      s(_), R();
    }
  }, g = Ee(), y = Z(g);
  {
    var x = (_) => {
      {
        let C = S(() => a(l) === "failed" ? "danger" : "muted"), m = S(() => `post-history-deletion-lifecycle-status ${a(l) ?? ""}`.trim());
        Ou(_, {
          get label() {
            return a(h);
          },
          get tone() {
            return a(C);
          },
          get className() {
            return a(m);
          }
        });
      }
    };
    me(y, (_) => {
      a(h) && _(x);
    });
  }
  D(t, g);
  var f = St(b);
  return i(), f;
}
It(Fu, { eventId: {} }, [], [], { mode: "open" });
function Lu(t, e) {
  xt(e, !0);
  let n = E(e, "node", 7), r = E(e, "model", 7, void 0), i = E(e, "emojiLoadStateByUrl", 23, () => ({})), s = E(e, "emojiImageMetaByUrl", 23, () => ({})), l = E(e, "scrollRoot", 7, null), u = E(e, "onImageOpen", 7, void 0), h = E(e, "topActions", 7, void 0), b = E(e, "footerLeftExtras", 7, void 0), g = E(e, "footerActions", 7, void 0), y = E(e, "footerMenu", 7, void 0);
  var x = {
    get node() {
      return n();
    },
    set node(f) {
      n(f), R();
    },
    get model() {
      return r();
    },
    set model(f = void 0) {
      r(f), R();
    },
    get emojiLoadStateByUrl() {
      return i();
    },
    set emojiLoadStateByUrl(f = {}) {
      i(f), R();
    },
    get emojiImageMetaByUrl() {
      return s();
    },
    set emojiImageMetaByUrl(f = {}) {
      s(f), R();
    },
    get scrollRoot() {
      return l();
    },
    set scrollRoot(f = null) {
      l(f), R();
    },
    get onImageOpen() {
      return u();
    },
    set onImageOpen(f = void 0) {
      u(f), R();
    },
    get topActions() {
      return h();
    },
    set topActions(f = void 0) {
      h(f), R();
    },
    get footerLeftExtras() {
      return b();
    },
    set footerLeftExtras(f = void 0) {
      b(f), R();
    },
    get footerActions() {
      return g();
    },
    set footerActions(f = void 0) {
      g(f), R();
    },
    get footerMenu() {
      return y();
    },
    set footerMenu(f = void 0) {
      y(f), R();
    }
  };
  return zl(t, {
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
      return i();
    },
    get emojiImageMetaByUrl() {
      return s();
    },
    get scrollRoot() {
      return l();
    },
    get onImageOpen() {
      return u();
    },
    get topActions() {
      return h();
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
  }), St(x);
}
It(
  Lu,
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
const Jp = 5, Gp = 0.5, Zp = 2.5;
function bn(t, e) {
  return `${t}:${e}`;
}
function Xp(t) {
  return t < 0 ? Math.max(
    0,
    Jp + t
  ) : t;
}
function Hu(t) {
  return Math.min(
    Xp(t) * Gp,
    Zp
  );
}
function kd() {
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
function zi(t) {
  return Ic(t.rawEvent, t) ? nl(t.rawEvent) : {
    id: t.eventId,
    pubkey: t.pubkeyHex,
    kind: t.kind,
    content: t.content,
    tags: t.tags.map((e) => [...e]),
    created_at: t.createdAt,
    sig: ""
  };
}
function ko(t) {
  const e = {
    id: t.eventId,
    pubkey: t.authorPubkey,
    kind: t.kind,
    content: t.content,
    tags: t.tags.map((n) => [...n]),
    created_at: t.createdAt,
    sig: ""
  };
  return Wo(t.rawEvent) && t.rawEvent.id === e.id && t.rawEvent.pubkey === e.pubkey && t.rawEvent.kind === e.kind && t.rawEvent.content === e.content && t.rawEvent.created_at === e.created_at && JSON.stringify(t.rawEvent.tags) === JSON.stringify(e.tags) ? nl(t.rawEvent) : e;
}
function xo(t) {
  const e = La(t.event);
  return {
    eventId: t.event.id,
    event: nl(t.event),
    authorPubkey: t.event.pubkey,
    rootEventId: e.rootId,
    parentEventId: e.parentId,
    profile: t.profile ?? null,
    relayUrls: [...t.relayUrls ?? []],
    sources: [...t.sources]
  };
}
function Pi(t, e) {
  if (!t)
    return e;
  const n = Array.from(/* @__PURE__ */ new Set([
    ...t.relayUrls,
    ...e.relayUrls
  ])).sort((i, s) => i.localeCompare(s)), r = Array.from(/* @__PURE__ */ new Set([
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
function eg(t, e) {
  return [...t].sort((n, r) => {
    const i = e[n]?.event, s = e[r]?.event;
    return !i || !s ? n.localeCompare(r) : i.created_at !== s.created_at ? i.created_at - s.created_at : i.id.localeCompare(s.id);
  });
}
var tg = U('<span class="post-history-context-deleted-label svelte-1kez5et"> </span>'), ng = U('<p class="post-history-context-message svelte-1kez5et"> </p>'), rg = U('<p class="post-history-context-message post-history-context-error svelte-1kez5et"> </p> <!>', 1), ag = U('<div class="post-history-thread-node-parent svelte-1kez5et"><!></div>'), sg = U('<div class="post-history-thread-node-top-actions"><!></div>'), og = U('<div class="post-preview-footer-replies-slot"><!></div>'), ig = U('<div class="open-in-new-icon svg-icon" aria-hidden="true"></div> <span> </span>', 1), lg = U("<!> <!>", 1), dg = U('<div aria-hidden="true"></div> <span> </span>', 1), cg = U("<!> <!> <!>", 1), ug = U('<div class="post-history-thread-node-children svelte-1kez5et"></div>'), hg = U('<div class="post-history-thread-node-view svelte-1kez5et"><!> <div class="post-history-thread-node-anchor svelte-1kez5et"><!></div> <!></div>');
const fg = {
  hash: "svelte-1kez5et",
  code: `.post-history-thread-node-view.svelte-1kez5et {display:grid;gap:1px;}.post-history-thread-node-parent.svelte-1kez5et,
    .post-history-thread-node-children.svelte-1kez5et {display:grid;gap:2px;}.post-history-thread-node-parent.svelte-1kez5et {padding-inline-start:0;}.post-history-thread-node-anchor.svelte-1kez5et {display:grid;margin-inline-start:var(--thread-context-indent);}.post-history-thread-node-children.svelte-1kez5et {padding-inline-start:0;}.post-history-context-button {min-height:28px;padding:2px 6px;color:var(--text-muted);background:var(--btn-bg);font-size:0.82rem;}.post-history-context-message.svelte-1kez5et {margin:0;color:var(--text-muted);font-size:0.82rem;}.post-history-context-deleted-label.svelte-1kez5et {width:fit-content;min-height:28px;padding:2px 6px;color:var(--text-muted);background-color:transparent;border:1px solid var(--btn-border);font-size:0.82rem;font-weight:normal;cursor:default;user-select:none;display:flex;align-items:center;}.post-history-context-error.svelte-1kez5et {color:var(--danger);}`
};
function Os(t, e) {
  xt(e, !0), _a(t, fg);
  const n = () => rs(Is, "$_", r), [r, i] = Ss();
  let s = E(e, "state", 7), l = E(e, "previewModelByEventId", 23, () => ({})), u = E(e, "emojiLoadStateByUrl", 23, () => ({})), h = E(e, "emojiImageMetaByUrl", 23, () => ({})), b = E(e, "scrollRoot", 7, null), g = E(e, "onImageOpen", 7, void 0), y = E(e, "onToggleParent", 7, void 0), x = E(e, "onRetryParent", 7, void 0), f = E(e, "onToggleChildren", 7, void 0), _ = E(e, "onRetryChildren", 7, void 0), C = E(e, "onCopyPointerDown", 7, void 0), m = E(e, "onCopyNevent", 7, void 0), o = E(e, "externalClientLabel", 7, void 0), O = E(e, "onOpenExternalClient", 7, void 0), z = E(e, "isCopyFailed", 7, void 0), $ = E(e, "onShowRawJson", 7, void 0), ee = E(e, "onBroadcastPointerDown", 7, void 0), ye = E(e, "onBroadcastPost", 7, void 0), F = E(e, "isBroadcastSending", 7, void 0), X = E(e, "canDeleteNodePost", 7, void 0), ve = E(e, "isDeletionSending", 7, void 0), Se = E(e, "onOpenDeleteConfirm", 7, void 0), te = S(() => _o(s().node.event.created_at * 1e3)), fe = S(() => `${Hu(s().depthFromAnchor)}rem`), se = S(() => s().repliesActionState.status === "loaded" && s().repliesActionState.replyCount > 0), Ae = S(() => z()?.(s().node.eventId) ?? !1), Te = S(() => F()?.(s().node.eventId) ?? !1), we = S(() => X()?.(s()) ?? !1), ce = S(() => ve()?.(s().node.eventId) ?? !1);
  function G() {
    const ae = s().repliesActionState;
    if (ae.status === "loading")
      return n()("postHistory.checkingReplies");
    if (ae.status === "failed")
      return n()("postHistory.recheckReplies");
    if (ae.status === "loaded") {
      const at = ae.replyCount;
      return at === 0 ? n()("postHistory.recheckReplies") : ae.visible ? n()("postHistory.hideReplies") : n()("postHistory.showRepliesWithCount", { values: { count: at } });
    }
    return n()("postHistory.checkReplies");
  }
  function de() {
    const ae = s().repliesActionState;
    if (ae.status === "failed" || ae.status === "loaded" && ae.replyCount === 0) {
      _()?.(s().node.eventId);
      return;
    }
    f()?.(s().node.eventId);
  }
  function Ie(ae) {
    C()?.(s(), ae);
  }
  function Ce(ae) {
    m()?.(s(), ae);
  }
  function N() {
    $()?.(s());
  }
  function I(ae) {
    ee()?.(s(), ae);
  }
  function Q(ae) {
    ye()?.(s(), ae);
  }
  function ne() {
    Se()?.(s());
  }
  var ue = {
    get state() {
      return s();
    },
    set state(ae) {
      s(ae), R();
    },
    get previewModelByEventId() {
      return l();
    },
    set previewModelByEventId(ae = {}) {
      l(ae), R();
    },
    get emojiLoadStateByUrl() {
      return u();
    },
    set emojiLoadStateByUrl(ae = {}) {
      u(ae), R();
    },
    get emojiImageMetaByUrl() {
      return h();
    },
    set emojiImageMetaByUrl(ae = {}) {
      h(ae), R();
    },
    get scrollRoot() {
      return b();
    },
    set scrollRoot(ae = null) {
      b(ae), R();
    },
    get onImageOpen() {
      return g();
    },
    set onImageOpen(ae = void 0) {
      g(ae), R();
    },
    get onToggleParent() {
      return y();
    },
    set onToggleParent(ae = void 0) {
      y(ae), R();
    },
    get onRetryParent() {
      return x();
    },
    set onRetryParent(ae = void 0) {
      x(ae), R();
    },
    get onToggleChildren() {
      return f();
    },
    set onToggleChildren(ae = void 0) {
      f(ae), R();
    },
    get onRetryChildren() {
      return _();
    },
    set onRetryChildren(ae = void 0) {
      _(ae), R();
    },
    get onCopyPointerDown() {
      return C();
    },
    set onCopyPointerDown(ae = void 0) {
      C(ae), R();
    },
    get onCopyNevent() {
      return m();
    },
    set onCopyNevent(ae = void 0) {
      m(ae), R();
    },
    get externalClientLabel() {
      return o();
    },
    set externalClientLabel(ae = void 0) {
      o(ae), R();
    },
    get onOpenExternalClient() {
      return O();
    },
    set onOpenExternalClient(ae = void 0) {
      O(ae), R();
    },
    get isCopyFailed() {
      return z();
    },
    set isCopyFailed(ae = void 0) {
      z(ae), R();
    },
    get onShowRawJson() {
      return $();
    },
    set onShowRawJson(ae = void 0) {
      $(ae), R();
    },
    get onBroadcastPointerDown() {
      return ee();
    },
    set onBroadcastPointerDown(ae = void 0) {
      ee(ae), R();
    },
    get onBroadcastPost() {
      return ye();
    },
    set onBroadcastPost(ae = void 0) {
      ye(ae), R();
    },
    get isBroadcastSending() {
      return F();
    },
    set isBroadcastSending(ae = void 0) {
      F(ae), R();
    },
    get canDeleteNodePost() {
      return X();
    },
    set canDeleteNodePost(ae = void 0) {
      X(ae), R();
    },
    get isDeletionSending() {
      return ve();
    },
    set isDeletionSending(ae = void 0) {
      ve(ae), R();
    },
    get onOpenDeleteConfirm() {
      return Se();
    },
    set onOpenDeleteConfirm(ae = void 0) {
      Se(ae), R();
    }
  }, ie = hg(), q = M(ie);
  {
    var Oe = (ae) => {
      var at = ag(), gt = M(at);
      {
        var tt = (Xe) => {
          Os(Xe, {
            get state() {
              return s().parentNodeState;
            },
            get previewModelByEventId() {
              return l();
            },
            get emojiLoadStateByUrl() {
              return u();
            },
            get emojiImageMetaByUrl() {
              return h();
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
              return _();
            },
            get onCopyPointerDown() {
              return C();
            },
            get onCopyNevent() {
              return m();
            },
            get externalClientLabel() {
              return o();
            },
            get onOpenExternalClient() {
              return O();
            },
            get isCopyFailed() {
              return z();
            },
            get onShowRawJson() {
              return $();
            },
            get onBroadcastPointerDown() {
              return ee();
            },
            get onBroadcastPost() {
              return ye();
            },
            get isBroadcastSending() {
              return F();
            },
            get canDeleteNodePost() {
              return X();
            },
            get isDeletionSending() {
              return ve();
            },
            get onOpenDeleteConfirm() {
              return Se();
            }
          });
        }, st = (Xe) => {
          var je = tg(), et = M(je, !0);
          A(je), ge((Ye) => J(et, Ye), [() => n()("postHistory.replyTargetDeleted")]), D(Xe, je);
        }, nt = (Xe) => {
          var je = ng(), et = M(je, !0);
          A(je), ge((Ye) => J(et, Ye), [() => n()("postHistory.contextNotFound")]), D(Xe, je);
        }, zt = (Xe) => {
          var je = rg(), et = Z(je), Ye = M(et, !0);
          A(et);
          var jn = L(et, 2);
          ar(jn, {
            type: "button",
            className: "post-history-context-button post-history-context-retry-button",
            onClick: () => x()?.(s().node.eventId),
            children: (yt, kt) => {
              ws();
              var Me = Ba();
              ge((Qt) => J(Me, Qt), [() => n()("postHistory.contextRetry")]), D(yt, Me);
            },
            $$slots: { default: !0 }
          }), ge((yt) => J(Ye, yt), [() => n()("postHistory.contextFetchFailed")]), D(Xe, je);
        };
        me(gt, (Xe) => {
          s().parentExpansion.visibleParent && s().parentNodeState ? Xe(tt) : s().parentExpansion.visibleParent && s().parentExpansion.parentDeleted ? Xe(st, 1) : s().parentExpansion.visibleParent && s().parentExpansion.parentMissing ? Xe(nt, 2) : s().parentExpansion.visibleParent && s().parentExpansion.parentError && Xe(zt, 3);
        });
      }
      A(at), D(ae, at);
    };
    me(q, (ae) => {
      s().parentTargetId && ae(Oe);
    });
  }
  var Ze = L(q, 2), dt = M(Ze);
  Lu(dt, {
    get node() {
      return s().node;
    },
    get model() {
      return l()[s().node.eventId];
    },
    get emojiLoadStateByUrl() {
      return u();
    },
    get emojiImageMetaByUrl() {
      return h();
    },
    get scrollRoot() {
      return b();
    },
    get onImageOpen() {
      return g();
    },
    topActions: (st) => {
      var nt = Ee(), zt = Z(nt);
      {
        var Xe = (je) => {
          var et = sg(), Ye = M(et);
          {
            let jn = S(() => s().parentExpansion.visibleParent ? n()("postHistory.hideReplyTarget") : n()("postHistory.showReplyTarget")), yt = S(() => s().parentExpansion.visibleParent ? n()("postHistory.hideReplyTarget") : n()("postHistory.showReplyTarget")), kt = S(() => s().parentExpansion.visibleParent && s().parentExpansion.showParentLoadingIndicator);
            Wl(Ye, {
              get ariaLabel() {
                return a(jn);
              },
              get title() {
                return a(yt);
              },
              get expanded() {
                return s().parentExpansion.visibleParent;
              },
              get loading() {
                return a(kt);
              },
              onClick: () => y()?.(s().node.eventId)
            });
          }
          A(et), D(je, et);
        };
        me(zt, (je) => {
          s().parentTargetId && !s().parentAlreadyInPath && !(s().parentExpansion.visibleParent && s().parentExpansion.parentDeleted) && je(Xe);
        });
      }
      D(st, nt);
    },
    footerLeftExtras: (st) => {
      Fu(st, {
        get eventId() {
          return s().node.eventId;
        }
      });
    },
    footerActions: (st) => {
      var nt = og(), zt = M(nt);
      {
        var Xe = (je) => {
          {
            let et = S(G), Ye = S(G);
            Ql(je, {
              get count() {
                return s().repliesActionState.replyCount;
              },
              get selected() {
                return s().repliesActionState.visible;
              },
              get ariaLabel() {
                return a(et);
              },
              get tooltipContent() {
                return a(Ye);
              },
              onClick: de
            });
          }
        };
        me(zt, (je) => {
          a(se) && je(Xe);
        });
      }
      A(nt), D(st, nt);
    },
    footerMenu: (st) => {
      const nt = S(() => n()("common.showActions"));
      Ui(st, {
        get triggerAriaLabel() {
          return a(nt);
        },
        get tooltipContent() {
          return a(nt);
        },
        enableTooltip: !0,
        get timestamp() {
          return a(te);
        },
        items: (Xe) => {
          var je = cg(), et = Z(je);
          {
            var Ye = (kt) => {
              var Me = lg(), Qt = Z(Me);
              De(Qt, () => Vn, (ir, $t) => {
                $t(ir, {
                  class: "menu-action-button",
                  onSelect: () => O()?.(s()),
                  children: (an, sn) => {
                    var Pn = ig(), un = L(Z(Pn), 2), Tn = M(un, !0);
                    A(un), ge(() => J(Tn, o())), D(an, Pn);
                  },
                  $$slots: { default: !0 }
                });
              });
              var or = L(Qt, 2);
              De(or, () => Fa, (ir, $t) => {
                $t(ir, { class: "post-history-menu-separator" });
              }), D(kt, Me);
            };
            me(et, (kt) => {
              o() && O() && kt(Ye);
            });
          }
          var jn = L(et, 2);
          {
            let kt = S(() => s().repliesActionState.status === "loading");
            De(jn, () => Vn, (Me, Qt) => {
              Qt(Me, {
                class: "menu-action-button",
                get disabled() {
                  return a(kt);
                },
                onSelect: de,
                children: (or, ir) => {
                  var $t = dg(), an = Z($t), sn = L(an, 2), Pn = M(sn, !0);
                  A(sn), ge(
                    (un) => {
                      Na(an, 1, `${s().repliesActionState.visible ? "collapse-content-icon" : "find_in_page-icon"} svg-icon`, "svelte-1kez5et"), J(Pn, un);
                    },
                    [() => G()]
                  ), D(or, $t);
                },
                $$slots: { default: !0 }
              });
            });
          }
          var yt = L(jn, 2);
          co(yt, {
            order: "raw-json-first",
            get copyFailed() {
              return a(Ae);
            },
            showBroadcast: !0,
            get broadcastSending() {
              return a(Te);
            },
            get showDelete() {
              return a(we);
            },
            showDeleteSeparator: !0,
            get deletionSending() {
              return a(ce);
            },
            onCopyPointerDown: Ie,
            onCopyNevent: Ce,
            onShowRawJson: N,
            onBroadcastPointerDown: I,
            onBroadcastPost: Q,
            onOpenDeleteConfirm: ne
          }), D(Xe, je);
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
  }), A(Ze);
  var he = L(Ze, 2);
  {
    var xe = (ae) => {
      var at = ug();
      da(at, 21, () => s().replyNodeStates, (gt) => gt.node.eventId, (gt, tt) => {
        Os(gt, {
          get state() {
            return a(tt);
          },
          get previewModelByEventId() {
            return l();
          },
          get emojiLoadStateByUrl() {
            return u();
          },
          get emojiImageMetaByUrl() {
            return h();
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
            return _();
          },
          get onCopyPointerDown() {
            return C();
          },
          get onCopyNevent() {
            return m();
          },
          get externalClientLabel() {
            return o();
          },
          get onOpenExternalClient() {
            return O();
          },
          get isCopyFailed() {
            return z();
          },
          get onShowRawJson() {
            return $();
          },
          get onBroadcastPointerDown() {
            return ee();
          },
          get onBroadcastPost() {
            return ye();
          },
          get isBroadcastSending() {
            return F();
          },
          get canDeleteNodePost() {
            return X();
          },
          get isDeletionSending() {
            return ve();
          },
          get onOpenDeleteConfirm() {
            return Se();
          }
        });
      }), A(at), D(ae, at);
    };
    me(he, (ae) => {
      s().repliesActionState.visible && s().replyNodeStates.length > 0 && ae(xe);
    });
  }
  A(ie), ge(() => {
    Qo(ie, `--thread-context-indent: ${a(fe)}`), Cn(Ze, "data-post-history-thread-anchor-scope-id", s().anchorEventId), Cn(Ze, "data-post-history-thread-anchor-event-id", s().node.eventId);
  }), D(t, ie);
  var $e = St(ue);
  return i(), $e;
}
It(
  Os,
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
var vg = U('<span class="post-history-context-deleted-label post-history-thread-direct-parent-context svelte-nb00ha"> </span>'), pg = U('<p class="post-history-context-message post-history-thread-direct-parent-context svelte-nb00ha"> </p>'), gg = U('<p class="post-history-context-message post-history-context-error post-history-thread-direct-parent-context svelte-nb00ha"> </p> <!>', 1), yg = U('<div class="post-history-thread-parent-panel svelte-nb00ha"><!> <div class="post-history-context-actions svelte-nb00ha"><!></div></div>'), mg = U('<div class="post-history-thread-replies-panel svelte-nb00ha"><div class="post-history-thread-replies-list svelte-nb00ha"></div></div>');
const bg = {
  hash: "svelte-nb00ha",
  code: `.post-history-thread-parent-panel.svelte-nb00ha,
    .post-history-thread-replies-panel.svelte-nb00ha {display:grid;gap:6px;}.post-history-thread-parent-panel.svelte-nb00ha {padding-bottom:4px;}.post-history-thread-replies-list.svelte-nb00ha {display:grid;}.post-history-context-actions.svelte-nb00ha {display:flex;flex-wrap:wrap;gap:6px;}.post-history-thread-direct-parent-context {margin-inline-start:var(--thread-direct-parent-indent);}.post-history-context-button {min-height:28px;padding:2px 6px;color:var(--text-muted);background:transparent;font-size:0.82rem;}

    @media (hover: hover) and (pointer: fine) {.post-history-context-button:hover:not(:disabled) {color:var(--theme);background:color-mix(in srgb, var(--theme) 10%, transparent);}
    }.post-history-context-message.svelte-nb00ha {margin:0;color:var(--text-muted);font-size:0.82rem;}.post-history-context-deleted-label.svelte-nb00ha {width:fit-content;min-height:28px;padding:2px 6px;color:var(--text-muted);background-color:transparent;border:1px solid var(--btn-border);font-size:0.82rem;font-weight:normal;cursor:default;user-select:none;display:flex;align-items:center;}.post-history-context-error.svelte-nb00ha {color:var(--danger);}`
};
function Qi(t, e) {
  xt(e, !0), _a(t, bg);
  const n = () => rs(Is, "$_", r), [r, i] = Ss();
  let s = E(e, "state", 7), l = E(e, "section", 7), u = E(e, "previewModelByEventId", 23, () => ({})), h = E(e, "emojiLoadStateByUrl", 23, () => ({})), b = E(e, "emojiImageMetaByUrl", 23, () => ({})), g = E(e, "scrollRoot", 7, null), y = E(e, "onImageOpen", 7, void 0), x = E(e, "onToggleParent", 7, void 0), f = E(e, "onRetryParent", 7, void 0), _ = E(e, "onToggleNodeParent", 7, void 0), C = E(e, "onRetryNodeParent", 7, void 0), m = E(e, "onToggleNodeChildren", 7, void 0), o = E(e, "onRetryNodeChildren", 7, void 0), O = E(e, "onCopyPointerDown", 7, void 0), z = E(e, "onCopyNevent", 7, void 0), $ = E(e, "externalClientLabel", 7, void 0), ee = E(e, "onOpenExternalClient", 7, void 0), ye = E(e, "isCopyFailed", 7, void 0), F = E(e, "onShowRawJson", 7, void 0), X = E(e, "onBroadcastPointerDown", 7, void 0), ve = E(e, "onBroadcastPost", 7, void 0), Se = E(e, "isBroadcastSending", 7, void 0), te = E(e, "canDeleteNodePost", 7, void 0), fe = E(e, "isDeletionSending", 7, void 0), se = E(e, "onOpenDeleteConfirm", 7, void 0);
  const Ae = `${Hu(-1)}rem`;
  let Te = S(() => s().parentNode ? {
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
  var we = {
    get state() {
      return s();
    },
    set state(N) {
      s(N), R();
    },
    get section() {
      return l();
    },
    set section(N) {
      l(N), R();
    },
    get previewModelByEventId() {
      return u();
    },
    set previewModelByEventId(N = {}) {
      u(N), R();
    },
    get emojiLoadStateByUrl() {
      return h();
    },
    set emojiLoadStateByUrl(N = {}) {
      h(N), R();
    },
    get emojiImageMetaByUrl() {
      return b();
    },
    set emojiImageMetaByUrl(N = {}) {
      b(N), R();
    },
    get scrollRoot() {
      return g();
    },
    set scrollRoot(N = null) {
      g(N), R();
    },
    get onImageOpen() {
      return y();
    },
    set onImageOpen(N = void 0) {
      y(N), R();
    },
    get onToggleParent() {
      return x();
    },
    set onToggleParent(N = void 0) {
      x(N), R();
    },
    get onRetryParent() {
      return f();
    },
    set onRetryParent(N = void 0) {
      f(N), R();
    },
    get onToggleNodeParent() {
      return _();
    },
    set onToggleNodeParent(N = void 0) {
      _(N), R();
    },
    get onRetryNodeParent() {
      return C();
    },
    set onRetryNodeParent(N = void 0) {
      C(N), R();
    },
    get onToggleNodeChildren() {
      return m();
    },
    set onToggleNodeChildren(N = void 0) {
      m(N), R();
    },
    get onRetryNodeChildren() {
      return o();
    },
    set onRetryNodeChildren(N = void 0) {
      o(N), R();
    },
    get onCopyPointerDown() {
      return O();
    },
    set onCopyPointerDown(N = void 0) {
      O(N), R();
    },
    get onCopyNevent() {
      return z();
    },
    set onCopyNevent(N = void 0) {
      z(N), R();
    },
    get externalClientLabel() {
      return $();
    },
    set externalClientLabel(N = void 0) {
      $(N), R();
    },
    get onOpenExternalClient() {
      return ee();
    },
    set onOpenExternalClient(N = void 0) {
      ee(N), R();
    },
    get isCopyFailed() {
      return ye();
    },
    set isCopyFailed(N = void 0) {
      ye(N), R();
    },
    get onShowRawJson() {
      return F();
    },
    set onShowRawJson(N = void 0) {
      F(N), R();
    },
    get onBroadcastPointerDown() {
      return X();
    },
    set onBroadcastPointerDown(N = void 0) {
      X(N), R();
    },
    get onBroadcastPost() {
      return ve();
    },
    set onBroadcastPost(N = void 0) {
      ve(N), R();
    },
    get isBroadcastSending() {
      return Se();
    },
    set isBroadcastSending(N = void 0) {
      Se(N), R();
    },
    get canDeleteNodePost() {
      return te();
    },
    set canDeleteNodePost(N = void 0) {
      te(N), R();
    },
    get isDeletionSending() {
      return fe();
    },
    set isDeletionSending(N = void 0) {
      fe(N), R();
    },
    get onOpenDeleteConfirm() {
      return se();
    },
    set onOpenDeleteConfirm(N = void 0) {
      se(N), R();
    }
  }, ce = Ee(), G = Z(ce);
  {
    var de = (N) => {
      var I = yg(), Q = M(I);
      {
        var ne = (xe) => {
          Os(xe, {
            get state() {
              return s().parentNodeState;
            },
            get previewModelByEventId() {
              return u();
            },
            get emojiLoadStateByUrl() {
              return h();
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
              return _();
            },
            get onRetryParent() {
              return C();
            },
            get onToggleChildren() {
              return m();
            },
            get onRetryChildren() {
              return o();
            },
            get onCopyPointerDown() {
              return O();
            },
            get onCopyNevent() {
              return z();
            },
            get externalClientLabel() {
              return $();
            },
            get onOpenExternalClient() {
              return ee();
            },
            get isCopyFailed() {
              return ye();
            },
            get onShowRawJson() {
              return F();
            },
            get onBroadcastPointerDown() {
              return X();
            },
            get onBroadcastPost() {
              return ve();
            },
            get isBroadcastSending() {
              return Se();
            },
            get canDeleteNodePost() {
              return te();
            },
            get isDeletionSending() {
              return fe();
            },
            get onOpenDeleteConfirm() {
              return se();
            }
          });
        }, ue = (xe) => {
          Os(xe, {
            get state() {
              return a(Te);
            },
            get previewModelByEventId() {
              return u();
            },
            get emojiLoadStateByUrl() {
              return h();
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
              return _();
            },
            get onRetryParent() {
              return C();
            },
            get onToggleChildren() {
              return m();
            },
            get onRetryChildren() {
              return o();
            },
            get onCopyPointerDown() {
              return O();
            },
            get onCopyNevent() {
              return z();
            },
            get externalClientLabel() {
              return $();
            },
            get onOpenExternalClient() {
              return ee();
            },
            get isCopyFailed() {
              return ye();
            },
            get onShowRawJson() {
              return F();
            },
            get onBroadcastPointerDown() {
              return X();
            },
            get onBroadcastPost() {
              return ve();
            },
            get isBroadcastSending() {
              return Se();
            },
            get canDeleteNodePost() {
              return te();
            },
            get isDeletionSending() {
              return fe();
            },
            get onOpenDeleteConfirm() {
              return se();
            }
          });
        }, ie = (xe) => {
          var $e = vg(), ae = M($e, !0);
          A($e), ge((at) => J(ae, at), [() => n()("postHistory.replyTargetDeleted")]), D(xe, $e);
        }, q = (xe) => {
          var $e = pg(), ae = M($e, !0);
          A($e), ge((at) => J(ae, at), [() => n()("postHistory.contextNotFound")]), D(xe, $e);
        }, Oe = (xe) => {
          var $e = gg(), ae = Z($e), at = M(ae, !0);
          A(ae);
          var gt = L(ae, 2);
          ar(gt, {
            type: "button",
            className: "post-history-context-button post-history-context-retry-button",
            onClick: () => f()?.(),
            children: (tt, st) => {
              ws();
              var nt = Ba();
              ge((zt) => J(nt, zt), [() => n()("postHistory.contextRetry")]), D(tt, nt);
            },
            $$slots: { default: !0 }
          }), ge((tt) => J(at, tt), [() => n()("postHistory.contextFetchFailed")]), D(xe, $e);
        };
        me(Q, (xe) => {
          s().parentExpansion.visibleParent && s().parentNodeState ? xe(ne) : s().parentExpansion.visibleParent && a(Te) ? xe(ue, 1) : s().parentExpansion.visibleParent && s().parentExpansion.parentDeleted ? xe(ie, 2) : s().parentExpansion.visibleParent && s().parentExpansion.parentMissing ? xe(q, 3) : s().parentExpansion.visibleParent && s().parentExpansion.parentError && xe(Oe, 4);
        });
      }
      var Ze = L(Q, 2), dt = M(Ze);
      {
        var he = (xe) => {
          {
            let $e = S(() => s().parentExpansion.visibleParent ? n()("postHistory.hideReplyTarget") : n()("postHistory.showReplyTarget")), ae = S(() => s().parentExpansion.visibleParent ? n()("postHistory.hideReplyTarget") : n()("postHistory.showReplyTarget")), at = S(() => s().parentExpansion.visibleParent && s().parentExpansion.showParentLoadingIndicator);
            Wl(xe, {
              get ariaLabel() {
                return a($e);
              },
              get title() {
                return a(ae);
              },
              get expanded() {
                return s().parentExpansion.visibleParent;
              },
              get loading() {
                return a(at);
              },
              onClick: () => x()?.()
            });
          }
        };
        me(dt, (xe) => {
          s().parentExpansion.visibleParent && s().parentExpansion.parentDeleted || xe(he);
        });
      }
      A(Ze), A(I), ge(() => Qo(I, `--thread-direct-parent-indent: ${Ae}`)), D(N, I);
    }, Ie = (N) => {
      var I = mg(), Q = M(I);
      da(Q, 21, () => s().replyNodeStates, (ne) => ne.node.eventId, (ne, ue) => {
        Os(ne, {
          get state() {
            return a(ue);
          },
          get previewModelByEventId() {
            return u();
          },
          get emojiLoadStateByUrl() {
            return h();
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
            return _();
          },
          get onRetryParent() {
            return C();
          },
          get onToggleChildren() {
            return m();
          },
          get onRetryChildren() {
            return o();
          },
          get onCopyPointerDown() {
            return O();
          },
          get onCopyNevent() {
            return z();
          },
          get externalClientLabel() {
            return $();
          },
          get onOpenExternalClient() {
            return ee();
          },
          get isCopyFailed() {
            return ye();
          },
          get onShowRawJson() {
            return F();
          },
          get onBroadcastPointerDown() {
            return X();
          },
          get onBroadcastPost() {
            return ve();
          },
          get isBroadcastSending() {
            return Se();
          },
          get canDeleteNodePost() {
            return te();
          },
          get isDeletionSending() {
            return fe();
          },
          get onOpenDeleteConfirm() {
            return se();
          }
        });
      }), A(Q), A(I), D(N, I);
    };
    me(G, (N) => {
      l() === "parent" && s().parentTargetId ? N(de) : l() === "children" && s().repliesActionState.visible && s().replyNodeStates.length > 0 && N(Ie, 1);
    });
  }
  D(t, ce);
  var Ce = St(we);
  return i(), Ce;
}
It(
  Qi,
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
function Cg({
  getShow: t,
  getPosts: e,
  getRxNostr: n,
  getRelayConfig: r,
  getIsSearchMode: i
}) {
  let s = be(Jn({})), l = 0, u = [];
  function h() {
    u = [];
  }
  function b() {
    u.forEach((x) => x.release()), h();
  }
  function g() {
    b(), w(s, {}, !0);
  }
  function y(x, f) {
    if (x.kind !== 42)
      return null;
    if (!x.channelEventId)
      return f("postHistory.channelUnknown");
    const _ = a(s)[x.channelEventId];
    return !_ || _.status === "loading" ? f("postHistory.channelLoading") : _.status === "resolved" && _.name ? _.name : f("postHistory.channelUnknown");
  }
  return Ue(() => {
    t() || g();
  }), Ue(() => {
    if (t())
      return () => {
        b();
      };
  }), Ue(() => {
    if (!t())
      return;
    b();
    const x = e().filter((o) => o.kind === 42);
    if (x.length === 0)
      return;
    const f = Array.from(new Set(x.map((o) => o.channelEventId).filter((o) => typeof o == "string")));
    if (f.length === 0)
      return;
    const _ = ++l, C = i() ? void 0 : n(), m = f.map((o) => {
      const O = wn.sanitizeExternalRelayUrls(x.filter((z) => z.channelEventId === o).flatMap((z) => fh(z)), { limit: vh });
      return ph.resolveInternal({ eventId: o, relayHints: O }, C, r());
    });
    u = m, w(
      s,
      {
        ...Xr(() => a(s)),
        ...Object.fromEntries(f.map((o) => [o, { status: "loading", name: null }]))
      },
      !0
    ), Promise.all(m.map((o) => o.cacheReady)).then((o) => {
      !t() || _ !== l || w(
        s,
        {
          ...a(s),
          ...Object.fromEntries(o.map((O) => [
            O.context.eventId,
            gh(O.cache, !!C)
          ]))
        },
        !0
      );
    }).catch((o) => {
      console.error("チャンネル表示のキャッシュ解決に失敗しました:", o);
    }), Promise.all(m.map((o) => o.refresh)).then((o) => {
      !t() || _ !== l || (h(), w(
        s,
        {
          ...a(s),
          ...Object.fromEntries(o.map((O) => [
            O.snapshot.context.eventId,
            {
              status: O.snapshot.context.name ? "resolved" : "failed",
              name: O.snapshot.context.name
            }
          ]))
        },
        !0
      ));
    }).catch((o) => {
      _ === l && h(), console.error("チャンネル表示のバックグラウンド解決に失敗しました:", o);
    });
  }), Ns(() => {
    b();
  }), { getChannelText: y, cancelCurrentChannelResolution: b };
}
function wg() {
  let t = be(Jn({})), e = be(!1), n = be(0), r = be(0), i, s = be(void 0);
  function l(f) {
    return mh(f, Rc.value);
  }
  function u() {
    i && (clearTimeout(i), i = void 0), w(e, !1), w(s, void 0);
  }
  function h(f, _) {
    w(
      s,
      {
        eventId: f.eventId,
        ...To(_.clientX, _.clientY)
      },
      !0
    );
  }
  function b(f, _) {
    if (a(s)?.eventId === f.eventId)
      return {
        x: a(s).x,
        y: a(s).y
      };
    const C = _.currentTarget, m = C instanceof HTMLElement ? C.getBoundingClientRect() : null;
    return To(m ? m.left + m.width / 2 : 0, m ? m.bottom + 8 : 0);
  }
  function g(f, _) {
    i && clearTimeout(i), w(n, f, !0), w(r, _, !0), w(e, !0), i = setTimeout(
      () => {
        w(e, !1), i = void 0;
      },
      1800
    );
  }
  async function y(f, _) {
    const C = b(f, _), m = l(f);
    if (m ? await yh(m, "nevent", navigator, window) : !1) {
      w(t, { ...a(t), [f.eventId]: void 0 }, !0), g(C.x, C.y);
      return;
    }
    w(t, { ...a(t), [f.eventId]: "failed" }, !0), setTimeout(
      () => {
        w(t, { ...a(t), [f.eventId]: void 0 }, !0);
      },
      1800
    );
  }
  function x() {
    w(t, {}, !0), u();
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
    captureCopyPointerPosition: h,
    hideCopyFloatingMessage: u,
    handleCopyNevent: y,
    resetState: x
  };
}
const Pg = 5e3, Td = 8;
class xg {
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
    const r = rl(), i = this.resolveRelayUrls(n.relayHints, n.relayConfig);
    let s = !1, l, u, h;
    const b = () => {
      u !== void 0 && (this.clearTimeoutFn(u), u = void 0), l?.unsubscribe?.(), l = void 0;
    }, g = (x) => (f) => {
      s || (s = !0, b(), x(f));
    };
    return {
      promise: new Promise((x) => {
        const f = g(x);
        h = f;
        try {
          l = al(e, r, {
            on: i.length > 0 ? { relays: i } : { defaultReadRelays: !0 }
          }).subscribe({
            next: (_) => {
              _.event?.id === n.eventId && f({
                event: _.event,
                relayUrl: typeof _.from == "string" ? _.from : null
              });
            },
            complete: () => {
              f({ event: null, relayUrl: null });
            },
            error: (_) => {
              this.console.error("post_history_context_fetch_error", _), f({ event: null, relayUrl: null });
            }
          }), r.emit({ ids: [n.eventId] }), r.over(), u = this.setTimeoutFn(() => {
            this.console.warn("post_history_context_fetch_timeout", n.eventId), f({ event: null, relayUrl: null });
          }, n.timeoutMs ?? Pg);
        } catch (_) {
          this.console.error("post_history_context_fetch_request_error", _), f({ event: null, relayUrl: null });
        }
      }),
      cancel: () => {
        h?.({ event: null, relayUrl: null });
      }
    };
  }
  resolveRelayUrls(e, n) {
    const r = n ? [
      ...wn.extractReadRelays(n),
      ...wn.extractWriteRelays(n)
    ] : [], i = wn.sanitizeExternalRelayUrls([
      ...e ?? [],
      ...r
    ], { limit: Td });
    return i.length > 0 ? i : wn.sanitizeExternalRelayUrls(
      sl,
      { limit: Td }
    );
  }
}
const Jl = new xg();
function Sg(t, e) {
  return t.length === e.length && t.every((n, r) => n === e[r]);
}
function Gl({
  getShow: t,
  getRxNostr: e,
  profileCache: n = _c,
  logger: r = console
}) {
  const i = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Set();
  let l = !1;
  const u = (f, _) => {
    if (!(l || f.disposed || i.get(f.pubkey) !== f || !t() || !_ || f.lastProfile === _)) {
      f.lastProfile = _;
      for (const C of s)
        C(f.pubkey, _);
    }
  }, h = (f, _) => {
    if (f.pending || f.disposed || l)
      return;
    const C = f.relayHints;
    f.pending = n.getProfile(f.pubkey, {
      rxNostr: e(),
      additionalRelays: C,
      forceRefresh: _,
      allowBackgroundRefresh: !0
    }).then((m) => {
      u(f, m);
    }).catch((m) => {
      r.error("投稿履歴プロフィールの取得に失敗:", m);
    }).finally(() => {
      i.get(f.pubkey) === f && (f.pending = null, f.refreshQueued && (f.refreshQueued = !1, h(f, !0)));
    });
  }, b = (f, _ = []) => {
    if (!f || l)
      return null;
    const C = wn.sanitizeExternalRelayUrls(_), m = i.get(f);
    if (m) {
      const O = wn.mergeRelayConfigs(
        m.relayHints,
        C
      );
      return Sg(m.relayHints, O) || (m.relayHints = O, m.pending ? m.refreshQueued = !0 : h(m, !0)), m.lastProfile;
    }
    const o = {
      pubkey: f,
      relayHints: C,
      lastProfile: null,
      unsubscribe: () => {
      },
      pending: null,
      refreshQueued: !1,
      disposed: !1
    };
    return i.set(f, o), o.unsubscribe = n.subscribe(f, (O) => {
      u(o, O);
    }), h(o, !1), null;
  }, g = (f) => {
    if (l)
      return () => {
      };
    s.add(f);
    for (const _ of i.values())
      _.lastProfile && f(_.pubkey, _.lastProfile);
    return () => s.delete(f);
  }, y = () => {
    for (const f of i.values())
      f.disposed = !0, f.unsubscribe();
    i.clear();
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
const Ig = 8;
function io(t) {
  return wn.sanitizeExternalRelayUrls(t, { limit: Ig });
}
function Md(t, e) {
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
function Od(t) {
  return {
    targetEventId: t.targetEventId,
    status: "loading",
    event: null,
    profile: null,
    authorPubkey: t.authorHint ?? null,
    relayHints: io(t.relayHints ?? []),
    errorCode: null,
    updatedAt: null
  };
}
function Zl({
  getShow: t,
  getRxNostr: e,
  getRelayConfig: n,
  postHistoryRepositoryImpl: r = Ge,
  contextFetchService: i = Jl,
  deletionRequestsRepositoryImpl: s = $s,
  deletionFetchService: l = Jo,
  profileSyncCoordinator: u = void 0
}) {
  const h = u ?? Gl({ getShow: t, getRxNostr: e }), b = !u;
  let g = be({}), y = be(Jn({})), x = be(Jn({}));
  const f = /* @__PURE__ */ new Map(), _ = /* @__PURE__ */ new Map(), C = /* @__PURE__ */ new Map(), m = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map(), O = /* @__PURE__ */ new Map(), z = /* @__PURE__ */ new Map();
  let $ = 0;
  function ee(I) {
    w(
      y,
      {
        ...a(y),
        [I]: (a(y)[I] ?? 0) + 1
      },
      !0
    );
  }
  function ye(I) {
    const Q = _.get(I);
    if (Q)
      for (const ne of Q)
        ee(ne);
  }
  function F(I, Q) {
    const ne = a(g)[I], ue = Q(ne);
    return ne && ne.status === ue.status && ne.event === ue.event && ne.profile === ue.profile && ne.authorPubkey === ue.authorPubkey && ne.errorCode === ue.errorCode && ne.updatedAt === ue.updatedAt && qi(ne.relayHints, ue.relayHints) ? ne : (w(g, { ...a(g), [I]: ue }), ye(I), ue);
  }
  function X(I, Q) {
    return F(I, (ne) => {
      const ue = ne ?? Od({ targetEventId: I });
      return {
        targetEventId: I,
        status: Q.status ?? ue.status,
        event: Q.event !== void 0 ? Q.event : ue.event,
        profile: Q.profile !== void 0 ? Q.profile : ue.profile,
        authorPubkey: Q.authorPubkey !== void 0 ? Q.authorPubkey : ue.authorPubkey,
        relayHints: Q.relayHints ? io(Q.relayHints) : ue.relayHints,
        errorCode: Q.errorCode !== void 0 ? Q.errorCode : ue.errorCode,
        updatedAt: Q.updatedAt !== void 0 ? Q.updatedAt : ue.updatedAt
      };
    });
  }
  function ve(I) {
    const Q = a(g)[I.targetEventId], ne = io([...Q?.relayHints ?? [], ...I.relayHints ?? []]), ue = Q?.authorPubkey ?? I.authorHint ?? null, ie = !Q || Q.authorPubkey !== ue || !qi(Q.relayHints, ne);
    return X(I.targetEventId, { authorPubkey: ue, relayHints: ne }), ie;
  }
  function Se(I) {
    const Q = f.get(I.scopeKey) ?? /* @__PURE__ */ new Set();
    Q.add(I.targetEventId), f.set(I.scopeKey, Q);
    const ne = _.get(I.targetEventId) ?? /* @__PURE__ */ new Set();
    ne.add(I.scopeKey), _.set(I.targetEventId, ne), I.scopeKey in a(x) || w(x, { ...a(x), [I.scopeKey]: 0 }, !0), I.scopeKey in a(y) || w(y, { ...a(y), [I.scopeKey]: 0 }, !0);
  }
  async function te(I, Q) {
    return (await s.getDeletedTargets([{ targetAuthorPubkey: I, targetEventId: Q }])).get(I)?.has(Q) ?? !1;
  }
  function fe(I, Q) {
    if (!(!I || !Q))
      for (const [ne, ue] of Object.entries(a(g)))
        ue.authorPubkey === I && X(ne, { profile: Q });
  }
  function se(I, Q) {
    const ne = h.ensureProfile(I, Q);
    fe(I, ne);
  }
  h.subscribe((I, Q) => {
    t() && fe(I, Q);
  });
  async function Ae(I, Q, ne = {}) {
    if (!I.pubkey || !I.id)
      return !1;
    if (await te(I.pubkey, I.id))
      return X(I.id, {
        status: "deleted",
        event: null,
        authorPubkey: I.pubkey,
        relayHints: Q,
        errorCode: null,
        updatedAt: Date.now()
      }), !0;
    if (o.has(I.id))
      return o.get(I.id) ?? !1;
    const ue = e();
    if (!ue)
      return !1;
    const ie = (async () => {
      try {
        const q = l.fetchDeletionRequests(ue, {
          targets: [{ event: I, relayUrls: Q }],
          relayHints: Q,
          relayConfig: n()
        });
        O.set(I.id, q);
        const Oe = await q.promise;
        Oe.events.length > 0 && await s.upsertValidDeletionRequests({
          targetEvents: [I],
          deletionEvents: Oe.events,
          fetchedAt: Oe.fetchedAt
        });
        const Ze = await te(I.pubkey, I.id);
        return Ze && X(I.id, {
          status: "deleted",
          event: null,
          authorPubkey: I.pubkey,
          relayHints: Q,
          errorCode: null,
          updatedAt: Date.now()
        }), Ze;
      } catch {
        return !1;
      } finally {
        O.delete(I.id), o.delete(I.id);
      }
    })();
    return o.set(I.id, ie), ne.background ? !1 : ie;
  }
  function Te(I, Q) {
    return z.get(I) === Q;
  }
  async function we(I, Q = {}) {
    Se(I);
    const ne = a(g)[I.targetEventId], ue = ve(I), ie = a(g)[I.targetEventId] ?? Od(I), q = !!Q.background && ne?.status === "resolved";
    if (!Q.force && ne) {
      if (ne.status === "resolved" || ne.status === "deleted")
        return ne.status === "resolved" && ne.authorPubkey && se(ne.authorPubkey, a(g)[I.targetEventId]?.relayHints ?? ne.relayHints), a(g)[I.targetEventId] ?? ne;
      if (ne.status === "loading" && C.has(I.targetEventId))
        return await C.get(I.targetEventId) ?? a(g)[I.targetEventId] ?? ne;
      if (!ue && (ne.status === "not-found" || ne.status === "error"))
        return a(g)[I.targetEventId] ?? ne;
    }
    if (!Q.force && C.has(I.targetEventId))
      return await C.get(I.targetEventId) ?? a(g)[I.targetEventId] ?? ie;
    Q.force && (m.get(I.targetEventId)?.cancel(), m.delete(I.targetEventId), C.delete(I.targetEventId));
    const Oe = ++$;
    z.set(I.targetEventId, Oe);
    const Ze = (async () => {
      try {
        q || X(I.targetEventId, { status: "loading", errorCode: null });
        const dt = await r.getByEventId(I.targetEventId);
        if (!Te(I.targetEventId, Oe))
          return a(g)[I.targetEventId] ?? null;
        if (dt) {
          const tt = io([
            ...ie.relayHints,
            ...dt.relayHints,
            ...dt.acceptedRelays,
            ...dt.fetchedRelays ?? []
          ]);
          if (typeof dt.deletedAt == "number")
            return X(I.targetEventId, {
              status: "deleted",
              event: null,
              authorPubkey: dt.pubkeyHex,
              relayHints: tt,
              errorCode: null,
              updatedAt: Date.now()
            });
          const st = zi(dt), nt = X(I.targetEventId, {
            status: "resolved",
            event: st,
            authorPubkey: st.pubkey,
            relayHints: tt,
            errorCode: null,
            updatedAt: Date.now()
          });
          return se(st.pubkey, tt), Ae(st, tt, { background: !0 }), a(g)[I.targetEventId] ?? nt;
        }
        if (I.authorHint) {
          const tt = await Ae(Md(I.targetEventId, I.authorHint), ie.relayHints);
          if (!Te(I.targetEventId, Oe))
            return a(g)[I.targetEventId] ?? null;
          if (tt)
            return a(g)[I.targetEventId] ?? null;
        }
        const he = e();
        if (!he || !t())
          return q ? a(g)[I.targetEventId] ?? ie : X(I.targetEventId, {
            status: "error",
            event: null,
            authorPubkey: ie.authorPubkey,
            relayHints: ie.relayHints,
            errorCode: "nostr_not_ready",
            updatedAt: Date.now()
          });
        const xe = i.fetchEventById(he, {
          eventId: I.targetEventId,
          relayHints: ie.relayHints,
          relayConfig: n()
        });
        m.set(I.targetEventId, xe);
        const $e = await xe.promise;
        if (m.delete(I.targetEventId), !Te(I.targetEventId, Oe))
          return a(g)[I.targetEventId] ?? null;
        if (!$e.event) {
          if (I.authorHint) {
            const tt = await Ae(Md(I.targetEventId, I.authorHint), ie.relayHints);
            if (!Te(I.targetEventId, Oe))
              return a(g)[I.targetEventId] ?? null;
            if (tt)
              return a(g)[I.targetEventId] ?? null;
          }
          return q ? a(g)[I.targetEventId] ?? ie : X(I.targetEventId, {
            status: "not-found",
            event: null,
            authorPubkey: ie.authorPubkey,
            relayHints: ie.relayHints,
            errorCode: null,
            updatedAt: Date.now()
          });
        }
        const ae = io([
          ...ie.relayHints,
          ...$e.relayUrl ? [$e.relayUrl] : []
        ]), at = await Ae($e.event, ae);
        if (!Te(I.targetEventId, Oe))
          return a(g)[I.targetEventId] ?? null;
        if (at)
          return a(g)[I.targetEventId] ?? null;
        const gt = X(I.targetEventId, {
          status: "resolved",
          event: $e.event,
          authorPubkey: $e.event.pubkey,
          relayHints: ae,
          errorCode: null,
          updatedAt: Date.now()
        });
        return se($e.event.pubkey, ae), a(g)[I.targetEventId] ?? gt;
      } catch {
        return Te(I.targetEventId, Oe) ? q ? a(g)[I.targetEventId] ?? ie : X(I.targetEventId, {
          status: "error",
          event: null,
          authorPubkey: ie.authorPubkey,
          relayHints: ie.relayHints,
          errorCode: "fetch_failed",
          updatedAt: Date.now()
        }) : a(g)[I.targetEventId] ?? null;
      } finally {
        m.delete(I.targetEventId), C.delete(I.targetEventId);
      }
    })();
    return C.set(I.targetEventId, Ze), await Ze;
  }
  async function ce(I, Q = {}) {
    return await Promise.all(I.map((ne) => we(ne, Q)));
  }
  async function G(I, Q = {}) {
    return await we(I, { ...Q, force: !0 });
  }
  function de(I) {
    return a(g)[I] ?? null;
  }
  function Ie(I) {
    return a(y)[I] ?? 0;
  }
  function Ce(I) {
    const Q = f.get(I);
    if (Q)
      for (const ne of Q) {
        const ue = _.get(ne);
        ue && (ue.delete(I), !(ue.size > 0) && (_.delete(ne), z.delete(ne), m.get(ne)?.cancel(), m.delete(ne), O.get(ne)?.cancel(), O.delete(ne), C.delete(ne), o.delete(ne)));
      }
    f.delete(I), w(
      x,
      {
        ...a(x),
        [I]: (a(x)[I] ?? 0) + 1
      },
      !0
    ), ee(I);
  }
  function N() {
    m.forEach((I) => I.cancel()), O.forEach((I) => I.cancel()), m.clear(), O.clear(), C.clear(), o.clear(), f.clear(), _.clear(), b && h.reset(), z.clear(), w(g, {}), w(y, {}, !0), w(x, {}, !0);
  }
  return {
    ensureTarget: we,
    ensureTargets: ce,
    retryTarget: G,
    getTargetSnapshot: de,
    getScopeRevision: Ie,
    invalidateScope: Ce,
    reset: N
  };
}
const Rg = /nostr:[^\s<>"']+/gi, _g = /[),.!?:;\]\u3001\u3002\uff01\uff08\uff09\uff0c\uff0e\uff1a\uff1b\u300d\u300f\u3011]+$/u, Eg = /^[\s),.!?:;\]\u3001\u3002\uff01\uff08\uff09\uff0c\uff0e\uff1a\uff1b\u300d\u300f\u3011]+$/u;
function Ag(t) {
  return wn.sanitizeExternalRelayUrls(
    typeof t == "string" && t.length > 0 ? [t] : [],
    { limit: 1 }
  )[0] ?? null;
}
function Dg(t) {
  const e = t.match(_g);
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
function kg(t) {
  if (!t.toLowerCase().startsWith("nostr:"))
    return null;
  try {
    const e = Sc.decode(t.slice(6));
    return e.type === "note" ? e.data : e.type === "nevent" ? e.data.id : null;
  } catch {
    return null;
  }
}
function Tg(t) {
  const e = t.replace(/[ \t]{2,}/g, " ").trim();
  return e.length === 0 || Eg.test(e) ? null : e;
}
function $u(t) {
  if (!t)
    return [];
  const e = /* @__PURE__ */ new Map();
  for (const n of t.tags) {
    if (!Array.isArray(n) || n[0] !== "q")
      continue;
    const r = n[1];
    if (!ld(r))
      continue;
    const i = Ag(n[2]), s = ld(n[3]) ? n[3] : null, l = e.get(r);
    if (!l) {
      e.set(r, {
        eventId: r,
        relayHint: i,
        authorHint: s
      });
      continue;
    }
    !l.relayHint && i && (l.relayHint = i), !l.authorHint && s && (l.authorHint = s);
  }
  return Array.from(e.values());
}
function Mg(t) {
  if (!t || typeof t.content != "string" || t.content.length === 0)
    return t?.content ?? "";
  const e = $u(t);
  if (e.length === 0)
    return t.content;
  const n = new Set(
    e.map((s) => s.eventId)
  );
  let r = !1;
  const i = t.content.split(/\r?\n/).map((s) => {
    if (!s)
      return s;
    let l = "", u = 0, h = !1;
    for (const b of s.matchAll(Rg)) {
      const g = b.index ?? -1, y = b[0] ?? "";
      if (g < 0 || !y)
        continue;
      const { uri: x, trailingText: f } = Dg(y), _ = kg(x);
      !_ || !n.has(_) || (h = !0, r = !0, l += s.slice(u, g), l += f, u = g + y.length);
    }
    return h ? (l += s.slice(u), Tg(l)) : s;
  });
  return r ? i.filter((s) => s !== null).join(`
`) : t.content;
}
const Og = 8, xi = {
  byPostId: {},
  contextsByEventId: {}
};
function Xl(t) {
  return wn.sanitizeExternalRelayUrls(t, {
    limit: Og
  });
}
function Nu(t) {
  return {
    sourceEventId: t.sourceEventId,
    targetEventId: t.targetEventId,
    relationKind: t.relationKind,
    relayHints: Xl(t.relayHints),
    authorHint: t.authorHint,
    scopeKey: t.scopeKey
  };
}
const bs = {
  buildIndex(t) {
    const e = {}, n = {};
    for (const r of t) {
      const i = $u(r);
      if (i.length !== 0) {
        e[r.eventId] = i;
        for (const s of i) {
          const l = n[s.eventId];
          n[s.eventId] = {
            eventId: s.eventId,
            sourceEventId: l?.sourceEventId ?? r.eventId,
            authorHint: l?.authorHint ?? s.authorHint,
            relayHints: Xl([
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
    return Nu({
      sourceEventId: t.sourceEventId,
      targetEventId: t.eventId,
      relationKind: "quote",
      relayHints: t.relayHints,
      authorHint: t.authorHint,
      scopeKey: e
    });
  }
}, Si = {
  getRelayHints(t, e) {
    const n = La(e.event);
    return Xl([
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
    const e = La(t.event);
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
    return Nu({
      sourceEventId: t.sourceEventId,
      targetEventId: t.targetEventId,
      relationKind: "reply-parent",
      relayHints: t.relayHints,
      authorHint: t.authorHint,
      scopeKey: e
    });
  }
};
let Fg = 0;
function Lg(t) {
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
function Hg(t, e) {
  const n = Lg(e?.status);
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
function $g({
  getShow: t,
  getPosts: e,
  getRxNostr: n,
  getRelayConfig: r,
  postHistoryRepositoryImpl: i = Ge,
  contextFetchService: s = Jl,
  deletionRequestsRepositoryImpl: l = $s,
  deletionFetchService: u = Jo,
  profileSyncCoordinator: h = void 0,
  relatedTargetResolver: b = void 0
}) {
  const g = b ?? Zl({
    getShow: t,
    getRxNostr: n,
    getRelayConfig: r,
    postHistoryRepositoryImpl: i,
    contextFetchService: s,
    deletionRequestsRepositoryImpl: l,
    deletionFetchService: u,
    profileSyncCoordinator: h
  }), y = !b, x = `post-history-quote-preview:${++Fg}`;
  let f = be(0), _ = be(Jn(xi));
  function C() {
    w(_, xi, !0), y && g.reset();
  }
  function m(z) {
    return a(f), (a(_).byPostId[z.eventId] ?? []).map(($) => Hg($.eventId, g.getTargetSnapshot($.eventId)));
  }
  function o(z) {
    const $ = a(_).contextsByEventId[z];
    $ && g.retryTarget(bs.toDescriptor($, x));
  }
  async function O(z) {
    const $ = bs.buildIndex(z), ee = Object.values($.contextsByEventId);
    ee.length !== 0 && await g.ensureTargets(ee.map((ye) => bs.toDescriptor(ye, x)), { force: !0 });
  }
  return Ue(() => {
    t() || w(_, xi, !0);
  }), Ue(() => {
    t() && w(f, g.getScopeRevision(x), !0);
  }), Ue(() => {
    t() && w(_, bs.buildIndex(e()), !0);
  }), Ue(() => {
    if (!t())
      return;
    n(), r();
    const z = Object.values(a(_).contextsByEventId);
    z.length !== 0 && g.ensureTargets(z.map(($) => bs.toDescriptor($, x)));
  }), Ns(() => {
    g.invalidateScope(x), C();
  }), { getQuotePreviews: m, retryQuotePreview: o, refreshQuotePreviews: O };
}
const Ho = {
  currentPage: 1,
  searchPage: 1,
  searchInput: "",
  searchQuery: ""
}, $o = /* @__PURE__ */ new Map();
function ed(t) {
  if (typeof t != "string")
    return null;
  const e = t.trim();
  return e.length > 0 ? e : null;
}
function Fd(t) {
  return typeof t != "number" || !Number.isFinite(t) ? 1 : Math.max(1, Math.trunc(t));
}
function No(t) {
  return {
    currentPage: t.currentPage,
    searchPage: t.searchPage,
    searchInput: t.searchInput,
    searchQuery: t.searchQuery
  };
}
function Ng(t) {
  const e = ed(t);
  return No(
    e ? $o.get(e) ?? Ho : Ho
  );
}
function Ld(t, e) {
  const n = ed(t);
  if (!n)
    return No(
      Ho
    );
  const r = $o.get(n) ?? Ho, i = {
    currentPage: Fd(e.currentPage ?? r.currentPage),
    searchPage: Fd(e.searchPage ?? r.searchPage),
    searchInput: e.searchInput ?? r.searchInput,
    searchQuery: e.searchQuery ?? r.searchQuery
  };
  return $o.set(n, i), No(i);
}
function Hd(t) {
  const e = ed(t);
  e && $o.delete(e);
}
function Bg(t) {
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
function qg(t) {
  return Number.isFinite(t) ? Math.max(1, Math.trunc(t)) : 1;
}
function Ug(t) {
  return Number.isFinite(t) ? Math.max(1, Math.trunc(t)) : 50;
}
function Vg(t) {
  return t.trim().toLowerCase().split(/\s+/).filter(Boolean);
}
function jg(t) {
  return t.join(" ");
}
function $d(t) {
  return {
    postHistory: Ms(t),
    channelMetadata: Ch()
  };
}
function Ii(t, e) {
  return t.postHistory === e.postHistory && t.channelMetadata === e.channelMetadata;
}
function Kg(t, e) {
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
function Yg(t) {
  return Array.from(
    new Set(
      t.map((e) => e.channelEventId).filter(
        (e) => typeof e == "string" && e.length > 0
      )
    )
  );
}
class zg {
  constructor(e = Ge, n = bh) {
    this.postHistoryRepositoryImpl = e, this.channelMetadataRepositoryImpl = n;
  }
  resolvedCacheEntry = null;
  inFlightEntry = null;
  runtimeCacheToken = 0;
  clearCache() {
    this.resolvedCacheEntry = null, this.inFlightEntry = null, this.runtimeCacheToken += 1;
  }
  isResolvedCacheEntryCurrent(e, n, r, i) {
    return e.pubkeyHex === n && e.normalizedQueryKey === r && Ii(e.revision, i);
  }
  async buildFilteredPosts(e, n) {
    const r = await this.postHistoryRepositoryImpl.getAll({ pubkeyHex: e }), i = Yg(r), s = /* @__PURE__ */ new Map();
    return i.length > 0 && (await this.channelMetadataRepositoryImpl.getMany(
      i
    )).forEach((u) => {
      s.set(u.channelEventId, u);
    }), r.filter((l) => {
      const u = Kg(
        l,
        l.channelEventId ? s.get(l.channelEventId) ?? null : null
      );
      return n.every((h) => u.includes(h));
    });
  }
  startFilteredPostsBuild(e, n, r, i) {
    const s = Symbol("post-history-local-search"), l = this.runtimeCacheToken, u = {
      identity: s,
      runtimeCacheToken: l,
      pubkeyHex: e,
      normalizedQueryKey: n,
      revision: i,
      promise: Promise.resolve([])
    };
    return u.promise = (async () => {
      let h = i;
      for (let b = 0; b < 2; b += 1) {
        const g = await this.buildFilteredPosts(e, r), y = $d(e), x = Ii(
          h,
          y
        );
        if (x && this.inFlightEntry?.identity === s && this.runtimeCacheToken === l && (this.resolvedCacheEntry = {
          pubkeyHex: e,
          normalizedQueryKey: n,
          revision: h,
          filteredPosts: g
        }), x || b === 1)
          return g;
        h = y, this.inFlightEntry?.identity === s && this.runtimeCacheToken === l && (u.revision = h);
      }
      return [];
    })().finally(() => {
      this.inFlightEntry?.identity === s && (this.inFlightEntry = null);
    }), this.inFlightEntry = u, u;
  }
  async searchLocalPosts(e) {
    const n = Vg(e.query);
    if (!e.pubkeyHex || n.length === 0)
      return {
        items: [],
        total: 0,
        hasNext: !1
      };
    const r = qg(e.page), i = Ug(e.pageSize), s = e.pubkeyHex, l = jg(n), u = $d(s), h = this.resolvedCacheEntry, b = h && this.isResolvedCacheEntryCurrent(
      h,
      s,
      l,
      u
    ) ? h.filteredPosts : await (() => {
      const x = this.inFlightEntry;
      return (x && x.runtimeCacheToken === this.runtimeCacheToken && x.pubkeyHex === s && x.normalizedQueryKey === l && Ii(x.revision, u) ? x : this.startFilteredPostsBuild(
        s,
        l,
        n,
        u
      )).promise;
    })(), g = (r - 1) * i, y = g + i;
    return {
      items: b.slice(g, y),
      total: b.length,
      hasNext: y < b.length
    };
  }
}
const eo = new zg(), Qg = 500, Wg = 12, Jg = 3600;
function Gg(t, e) {
  return t.status === "timeout" || t.status === "error" || t.status === "cancelled" ? t.status : t.hasMore || t.perRelayCounts.some((n) => n.rawCount >= e) ? "partial" : "complete";
}
function Zg(t) {
  return t === "partial";
}
function Xg(t, e) {
  return t.hasMore || t.perRelayCounts.some((n) => n.rawCount >= e);
}
function ey(t) {
  return typeof t.since == "number" && typeof t.until == "number" && t.until - t.since > Jg;
}
function ty(t) {
  if (!ey(t))
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
class ny {
  postHistoryRelayFetchService;
  postHistoryRepository;
  setTimeoutFn;
  clearTimeoutFn;
  console;
  constructor(e = {}) {
    this.postHistoryRelayFetchService = e.postHistoryRelayFetchService ?? Eo, this.postHistoryRepository = e.postHistoryRepository ?? Ge, this.setTimeoutFn = e.setTimeoutFn ?? setTimeout, this.clearTimeoutFn = e.clearTimeoutFn ?? clearTimeout, this.console = e.console ?? (typeof globalThis.console < "u" ? globalThis.console : { debug: () => {
    } });
  }
  async waitBetweenFetches(e) {
    await new Promise((n) => {
      const r = this.setTimeoutFn(() => {
        e(null), n();
      }, Qg);
      e(() => {
        this.clearTimeoutFn(r), e(null), n();
      });
    });
  }
  refetchAroundCurrentView(e, n) {
    let r = !1, i = null, s = null;
    const l = n.preferredRanges.map((h) => ({
      kinds: [...h.kinds],
      rangeUnit: h.rangeUnit,
      ...typeof h.since == "number" ? { since: h.since } : {},
      ...typeof h.until == "number" ? { until: h.until } : {},
      limit: h.limit,
      splitDepth: 0
    }));
    return {
      promise: (async () => {
        let h = 0, b = 0, g = 0, y = 0, x = !1, f = !1, _ = !1, C = !1, m = !1, o = 0, O = 0, z = !0;
        const $ = [];
        for (; l.length > 0; ) {
          const ve = l.shift();
          if (r || (y > 0 && await this.waitBetweenFetches((Ce) => {
            s = Ce;
          }), r))
            break;
          const Se = this.postHistoryRelayFetchService.fetchLatest(e, {
            pubkeyHex: n.pubkeyHex,
            relayConfig: n.relayConfig,
            reason: "repair-visible-range",
            kinds: ve.kinds,
            limit: ve.limit || Ec,
            timeoutMs: wh,
            ...typeof ve.since == "number" ? { since: ve.since } : {},
            ...typeof ve.until == "number" ? { until: ve.until } : {}
          });
          i = Se;
          const te = await Se.promise;
          i = null, y += 1, O += te.events.length, _ = _ || te.status === "error", C = C || te.status === "timeout";
          const fe = te.events.length === 0 && !te.hasAnyRelayResponse && (te.allRelaysFailed || te.status === "error");
          z = z && fe;
          let se = 0, Ae = 0, Te = 0;
          if (te.events.length > 0) {
            const Ce = await this.postHistoryRepository.upsertFetchedEvents({
              events: te.events,
              fetchedAt: te.fetchedAt
            });
            se = Ce.insertedCount, Ae = Ce.updatedCount, Te = Ce.unchangedCount, h += se, b += Ae, g += Te, await n.onProgress?.({
              insertedCount: se,
              updatedCount: Ae,
              unchangedCount: Te,
              processedRangeCount: $.length + 1,
              attemptedRangeCount: y,
              addedCount: h,
              totalUpdatedCount: b,
              totalUnchangedCount: g
            });
          }
          const we = Xg(te, ve.limit);
          f = f || we;
          const ce = we ? ty(ve) : [], G = ce.length > 0 && $.length + 1 + l.length + ce.length <= Wg, de = we ? "limit" : Gg(te, ve.limit);
          if ($.push({
            source: "preferred",
            rangeUnit: ve.rangeUnit,
            ...typeof ve.since == "number" ? { since: ve.since } : {},
            ...typeof ve.until == "number" ? { until: ve.until } : {},
            requestedRelayUrls: [...te.requestedRelayUrls],
            observedRelayUrls: [...te.observedRelayUrls],
            eventRelayUrls: [...te.eventRelayUrls],
            eoseRelayUrls: [...te.eoseRelayUrls],
            closedRelayUrls: [...te.closedRelayUrls],
            errorRelayUrls: [...te.errorRelayUrls],
            downRelayUrls: [...te.downRelayUrls],
            completedByRxNostr: te.completedByRxNostr,
            completedByLocalTimeout: te.completedByLocalTimeout,
            hasAnyRelayResponse: te.hasAnyRelayResponse,
            allRelaysFailed: te.allRelaysFailed,
            status: de,
            rawCount: te.rawCount,
            uniqueCount: te.uniqueCount,
            duplicateCount: te.duplicateCount,
            insertedCount: se,
            updatedCount: Ae,
            unchangedCount: Te
          }), we && G ? (o += ce.length, l.unshift(...ce)) : we && (m = !0), (Zg(de) || fe || we && !G) && (x = !0), r || te.status === "cancelled") {
            r = !0;
            break;
          }
        }
        const ee = !r && y > 0 && O === 0 && z, ye = x || m || ee, X = {
          status: r ? "cancelled" : ye ? "partial" : "success",
          addedCount: h,
          updatedCount: b,
          unchangedCount: g,
          processedRangeCount: $.length,
          attemptedRangeCount: y,
          hadFailures: ye,
          limitReached: f,
          hadFetchError: _,
          fetchFailed: ee,
          hadTimeout: C,
          hadUnfinishedRanges: m,
          splitRetryCount: o,
          processedRanges: $
        };
        return this.console.debug("post_history_current_view_refetch_summary", {
          pubkeyHex: n.pubkeyHex,
          processedRangeCount: X.processedRangeCount,
          addedCount: X.addedCount,
          updatedCount: X.updatedCount,
          hadFailures: X.hadFailures,
          limitReached: X.limitReached,
          hadFetchError: X.hadFetchError,
          fetchFailed: X.fetchFailed,
          hadTimeout: X.hadTimeout,
          hadUnfinishedRanges: X.hadUnfinishedRanges,
          splitRetryCount: X.splitRetryCount,
          processedRanges: X.processedRanges
        }), X;
      })(),
      cancel: () => {
        r = !0, s?.(), i?.cancel();
      }
    };
  }
}
const ry = new ny(), td = [
  "reply",
  "reaction",
  "quote"
];
function Bu(t) {
  const e = t ?? td;
  return Array.from(new Set(e.filter(
    (n) => n === "reply" || n === "reaction" || n === "quote"
  )));
}
function ay(t, e) {
  const n = Bu(
    e.relationKinds
  );
  return {
    source: t,
    relationKinds: n,
    parentEventIds: Array.from(new Set(e.savedParentEventIds)),
    shouldRefreshQuotePreviews: n.includes("quote") && e.quoteRepairApplied
  };
}
const to = {
  status: "saved",
  savedParentEventIds: [],
  savedDirectReplyCount: 0,
  deletedEventIds: [],
  deletionConfirmationIncomplete: !1
};
function sy(t) {
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
function oy(t, e) {
  return t.filter((n) => e.get(n.event.pubkey)?.has(n.event.id)).map((n) => n.event.id);
}
function no(t) {
  return {
    ...t,
    status: "cancelled",
    savedParentEventIds: [],
    savedDirectReplyCount: 0
  };
}
class iy {
  deletionFetchService;
  deletionRequestsRepository;
  childInteractionsRepository;
  now;
  constructor(e = {}) {
    this.deletionFetchService = e.deletionFetchService ?? Jo, this.deletionRequestsRepository = e.deletionRequestsRepository ?? $s, this.childInteractionsRepository = e.childInteractionsRepository ?? ol, this.now = e.now ?? Date.now;
  }
  saveRepairDirectReplies(e, n) {
    let r = !0, i = null;
    const s = () => r && n.isActive?.() !== !1;
    return {
      promise: (async () => {
        const u = sy(n.items);
        if (u.length === 0)
          return to;
        const h = await this.filterKnownDeletedDirectReplies(u);
        let b = h.deletedEventIds;
        if (!s())
          return no({
            ...to,
            deletedEventIds: b
          });
        let g = h.visibleItems, y = !1;
        if (g.length > 0) {
          i = this.deletionFetchService.fetchDeletionRequests(e, {
            targets: g.map((C) => ({
              event: C.event,
              relayUrls: C.relayUrls
            })),
            relayHints: n.relayHints,
            relayConfig: n.relayConfig
          });
          const f = await i.promise;
          if (i = null, !s() || f.status === "cancelled")
            return no({
              ...to,
              deletedEventIds: b,
              deletionConfirmationIncomplete: y || f.status !== "success"
            });
          if (y = f.status !== "success", f.events.length > 0 && await this.deletionRequestsRepository.upsertValidDeletionRequests({
            targetEvents: g.map((C) => C.event),
            deletionEvents: f.events,
            fetchedAt: f.fetchedAt
          }), !s())
            return no({
              ...to,
              deletedEventIds: b,
              deletionConfirmationIncomplete: y
            });
          const _ = await this.filterKnownDeletedDirectReplies(g);
          g = _.visibleItems, b = Array.from(/* @__PURE__ */ new Set([
            ...b,
            ..._.deletedEventIds
          ]));
        }
        if (!s())
          return no({
            ...to,
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
        } : no({
          ...x,
          deletedEventIds: b,
          deletionConfirmationIncomplete: y
        });
      })(),
      cancel: () => {
        r = !1, i?.cancel();
      }
    };
  }
  async filterKnownDeletedDirectReplies(e) {
    const n = await this.deletionRequestsRepository.getDeletedTargets(
      e.map((s) => ({
        targetAuthorPubkey: s.event.pubkey,
        targetEventId: s.event.id
      }))
    ), r = oy(e, n);
    await this.purgeDeletedReplyCache(r);
    const i = new Set(r);
    return {
      visibleItems: e.filter((s) => !i.has(s.event.id)),
      deletedEventIds: r
    };
  }
  async purgeDeletedReplyCache(e) {
    for (const n of new Set(e))
      await this.childInteractionsRepository.deleteChildInteractionByEventId(n);
  }
  async saveVisibleDirectReplies(e, n, r) {
    const i = /* @__PURE__ */ new Map();
    for (const u of e) {
      const h = i.get(u.parentEventId) ?? [];
      h.push({
        event: u.event,
        ...u.relayUrls ? { relayUrls: u.relayUrls } : {}
      }), i.set(u.parentEventId, h);
    }
    const s = [];
    let l = 0;
    for (const [u, h] of i.entries()) {
      if (!r())
        break;
      const b = await this.childInteractionsRepository.upsertChildInteractions({
        parentEventId: u,
        events: h,
        fetchedAt: n
      }), g = b.insertedCount + b.updatedCount;
      g > 0 && (s.push(u), l += g);
    }
    return {
      status: "saved",
      savedParentEventIds: s,
      savedDirectReplyCount: l
    };
  }
}
const ly = new iy(), dy = 150, Nd = 30, cy = 10, uy = 2, Ri = 250, hy = 6e3, Bd = 8, fy = 6e4, vy = td, qd = {
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
function py(t, e) {
  const n = /* @__PURE__ */ new Map();
  for (const r of e)
    if (!(r.kind !== 1 && r.kind !== 42 || r.pubkeyHex !== t || !r.eventId || n.has(r.eventId)) && (n.set(r.eventId, r), n.size >= dy))
      break;
  return Array.from(n.values());
}
function Wi(t, e) {
  const n = [];
  for (let r = 0; r < t.length; r += e)
    n.push(t.slice(r, r + e));
  return n;
}
function gy(t, e) {
  return e.includeDirectReplies ? [1, 42].flatMap(
    (n) => Wi(
      t.filter((r) => r.kind === n),
      Nd
    ).map((r) => ({ posts: r, depth: 0 }))
  ) : Wi(
    t,
    Nd
  ).map((n) => ({ posts: n, depth: 0 }));
}
function yy(t) {
  return Array.from(t.values()).map((e) => ({
    event: e.event,
    relayUrls: Array.from(e.relayUrls).sort((n, r) => n.localeCompare(r))
  })).sort((e, n) => e.event.created_at !== n.event.created_at ? n.event.created_at - e.event.created_at : e.event.id.localeCompare(n.event.id));
}
class my {
  directReplySaveService;
  childInteractionsRepository;
  quoteVisibleRangeRepairExecutor;
  console;
  setTimeoutFn;
  clearTimeoutFn;
  now;
  lastFetchTimeoutWarnAt = 0;
  constructor(e = {}) {
    this.directReplySaveService = e.directReplySaveService ?? ly, this.childInteractionsRepository = e.childInteractionsRepository ?? ol, this.quoteVisibleRangeRepairExecutor = e.quoteVisibleRangeRepairExecutor, this.console = e.console ?? (typeof globalThis.console < "u" ? globalThis.console : { warn: () => {
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
    const r = Bu(
      n.relationKinds ?? vy
    ), i = this.repairVisibleRangeChildInteractionsInternal(
      e,
      n,
      {
        includeDirectReplies: r.includes("reply"),
        includeReactions: r.includes("reaction")
      }
    );
    return {
      promise: (async () => {
        const l = await i.promise;
        let u = !1;
        const h = n.quoteVisibleRangeRepairExecutor ?? this.quoteVisibleRangeRepairExecutor;
        return r.includes("quote") && l.status !== "cancelled" && n.isActive?.() !== !1 && h && (await h(e, n), u = !0), {
          ...l,
          relationKinds: r,
          quoteRepairApplied: u
        };
      })(),
      cancel: () => i.cancel()
    };
  }
  repairVisibleRangeChildInteractionsInternal(e, n, r) {
    let i = !0;
    const s = /* @__PURE__ */ new Set(), l = /* @__PURE__ */ new Set(), u = () => i && n.isActive?.() !== !1, h = py(n.ownerPubkeyHex, n.visiblePosts), b = h.map((y) => y.eventId);
    return {
      promise: (async () => {
        if (h.length === 0)
          return {
            ...qd,
            targetParentEventIds: b
          };
        const y = /* @__PURE__ */ new Set(), x = /* @__PURE__ */ new Set();
        let f = 0, _ = 0, C = 0, m = !1, o = !1;
        const O = async (ee) => {
          const ye = [];
          let F = 0;
          const X = Math.min(
            uy,
            ee.length
          ), ve = async () => {
            for (; u(); ) {
              const Se = ee[F++];
              if (!Se)
                return;
              _ += 1;
              const te = this.fetchCandidates(
                e,
                Se.posts,
                n.relayConfig,
                r
              );
              s.add(te);
              const fe = await te.promise;
              if (s.delete(te), !u() || fe.status === "cancelled")
                return;
              fe.status !== "success" && (o = !0), fe.saturated && (C += 1, Se.depth === 0 ? ye.push(
                ...Wi(
                  Se.posts,
                  cy
                ).map((we) => ({ posts: we, depth: 1 }))
              ) : o = !0);
              const se = r.includeDirectReplies ? this.toDirectReplyItems(
                Se.posts,
                fe.items
              ) : [], Ae = r.includeReactions ? this.toReactionItems(
                Se.posts,
                fe.items
              ) : [], Te = fe.status === "success" && !fe.saturated;
              if (se.length === 0 && Ae.length === 0) {
                Te && Se.posts.forEach((we) => x.add(we.eventId));
                continue;
              }
              if (se.length > 0) {
                const we = this.directReplySaveService.saveRepairDirectReplies(e, {
                  items: se,
                  relayHints: [
                    ...this.collectParentRelayHints(Se.posts),
                    ...fe.relayUrls
                  ],
                  relayConfig: n.relayConfig,
                  fetchedAt: fe.fetchedAt,
                  isActive: u
                });
                l.add(we);
                const ce = await we.promise;
                if (l.delete(we), !u() || ce.status === "cancelled")
                  return;
                ce.savedParentEventIds.forEach(
                  (G) => y.add(G)
                ), f += ce.savedDirectReplyCount, m = m || ce.deletionConfirmationIncomplete;
              }
              if (Ae.length > 0) {
                const we = await this.saveReactionInteractions(
                  Ae,
                  fe.fetchedAt,
                  u
                );
                if (!u())
                  return;
                we.savedParentEventIds.forEach(
                  (ce) => y.add(ce)
                );
              }
              Te && Se.posts.forEach((we) => x.add(we.eventId));
            }
          };
          return await Promise.all(Array.from({ length: X }, () => ve())), ye;
        }, z = await O(gy(h, r));
        if (u() && z.length > 0 && await O(z), !u())
          return {
            ...qd,
            status: "cancelled",
            targetParentEventIds: b,
            attemptedChunkCount: _,
            saturatedChunkCount: C,
            deletionConfirmationIncomplete: m
          };
        const $ = b.filter(
          (ee) => !x.has(ee)
        );
        return {
          status: o || $.length > 0 ? "partial" : "success",
          targetParentEventIds: b,
          checkedParentEventIds: Array.from(x),
          savedParentEventIds: Array.from(y),
          savedDirectReplyCount: f,
          attemptedChunkCount: _,
          saturatedChunkCount: C,
          incompleteParentEventIds: $,
          deletionConfirmationIncomplete: m
        };
      })(),
      cancel: () => {
        i = !1, s.forEach((y) => y.cancel()), l.forEach((y) => y.cancel());
      }
    };
  }
  toDirectReplyItems(e, n) {
    const r = new Map(e.flatMap((i) => {
      const s = Oa({
        event: {
          id: i.eventId,
          kind: i.kind,
          tags: i.tags,
          created_at: i.createdAt
        },
        relayHints: [
          ...i.relayHints,
          ...i.acceptedRelays,
          ...i.fetchedRelays ?? []
        ]
      });
      return s ? [[i.eventId, s]] : [];
    }));
    return n.flatMap((i) => {
      const s = La(i.event).parentId, l = s ? r.get(s) : null;
      return !s || !l || !ts({ child: i.event, parent: l }).valid ? [] : [{
        parentEventId: s,
        event: i.event,
        relayUrls: i.relayUrls
      }];
    });
  }
  toReactionItems(e, n) {
    const r = new Set(e.map((i) => i.eventId));
    return n.flatMap((i) => {
      if (i.event.kind !== 7)
        return [];
      const s = Ph(i.event);
      return !s || !r.has(s) || i.event.id === s ? [] : [{
        parentEventId: s,
        event: i.event,
        relayUrls: i.relayUrls
      }];
    });
  }
  async saveReactionInteractions(e, n, r) {
    const i = /* @__PURE__ */ new Map();
    for (const l of e) {
      const u = i.get(l.parentEventId) ?? [];
      u.push({
        event: l.event,
        relayUrls: l.relayUrls
      }), i.set(l.parentEventId, u);
    }
    const s = [];
    for (const [l, u] of i.entries()) {
      if (!r())
        break;
      const h = await this.childInteractionsRepository.upsertChildInteractions({
        parentEventId: l,
        events: u,
        fetchedAt: n
      });
      h.insertedCount + h.updatedCount > 0 && s.push(l);
    }
    return {
      savedParentEventIds: s
    };
  }
  fetchCandidates(e, n, r, i) {
    const s = this.resolveRelayUrls(n, r), l = n.map((o) => o.eventId), u = rl(), h = /* @__PURE__ */ new Map();
    let b = 0, g = !1, y, x, f;
    const _ = () => {
      x !== void 0 && (this.clearTimeoutFn(x), x = void 0), y?.unsubscribe?.(), y = void 0;
    }, C = (o) => {
      const O = yy(h);
      return {
        status: o,
        items: O,
        rawCount: b,
        saturated: b >= Ri || O.length >= Ri,
        fetchedAt: this.now(),
        relayUrls: s
      };
    };
    return {
      promise: new Promise((o) => {
        const O = (z) => {
          g || (g = !0, _(), o(C(z)));
        };
        f = O;
        try {
          if (l.length === 0) {
            O("success");
            return;
          }
          y = al(e, u, {
            on: s.length > 0 ? { relays: s } : { defaultReadRelays: !0 }
          }).subscribe({
            next: ($) => {
              b += 1, this.handleCandidatePacket(h, $);
            },
            complete: () => O("success"),
            error: ($) => {
              this.console.error("post_history_visible_child_interaction_repair_fetch_error", $), O("error");
            }
          });
          const z = Array.from(/* @__PURE__ */ new Set([
            ...i.includeDirectReplies ? n.map(($) => $.kind) : [],
            ...i.includeReactions ? [7] : []
          ])).filter(($) => $ === 1 || $ === 7 || $ === 42);
          u.emit({
            kinds: z,
            "#e": l,
            limit: Ri
          }), u.over(), x = this.setTimeoutFn(() => {
            this.warnCandidateFetchTimeout(), O("timeout");
          }, hy);
        } catch (z) {
          this.console.error("post_history_visible_child_interaction_repair_request_error", z), O("error");
        }
      }),
      cancel: () => f?.("cancelled")
    };
  }
  warnCandidateFetchTimeout() {
    const e = this.now();
    e - this.lastFetchTimeoutWarnAt < fy || (this.lastFetchTimeoutWarnAt = e, this.console.warn("post_history_visible_child_interaction_repair_fetch_timeout"));
  }
  handleCandidatePacket(e, n) {
    const r = n.event;
    if (!r?.id || r.kind !== 1 && r.kind !== 7 && r.kind !== 42)
      return;
    const i = wn.sanitizeExternalRelayUrls(
      typeof n.from == "string" ? [n.from] : [],
      { limit: 1 }
    )[0], s = e.get(r.id);
    if (!s) {
      e.set(r.id, {
        event: r,
        relayUrls: new Set(i ? [i] : [])
      });
      return;
    }
    if (!Ac(s.event, r)) {
      this.console.warn("post_history_visible_child_interaction_repair_packet_conflict");
      return;
    }
    i && s.relayUrls.add(i);
  }
  collectParentRelayHints(e) {
    return e.flatMap((n) => [
      ...n.relayHints ?? [],
      ...n.acceptedRelays ?? [],
      ...n.fetchedRelays ?? []
    ]);
  }
  resolveRelayUrls(e, n) {
    const r = n ? [
      ...wn.extractReadRelays(n),
      ...wn.extractWriteRelays(n)
    ] : [], i = wn.sanitizeExternalRelayUrls([
      ...this.collectParentRelayHints(e),
      ...r
    ], { limit: Bd });
    return i.length > 0 ? i : wn.sanitizeExternalRelayUrls(
      sl,
      { limit: Bd }
    );
  }
}
const by = new my(), Cy = 300 * 1e3;
function wy(t, e, n) {
  const r = new Set(
    n.map((s) => s.eventId)
  ), i = /* @__PURE__ */ new Map();
  for (const s of e)
    s.kind !== 1 && s.kind !== 42 || s.pubkeyHex !== t || !r.has(s.eventId) || i.has(s.eventId) || i.set(s.eventId, s);
  return Array.from(i.values());
}
function Py(t, e, n, r, i = Cy) {
  return t.filter((s) => {
    if (n.has(s))
      return !1;
    const l = e.get(s);
    return typeof l != "number" || r - l >= i;
  });
}
function Ud(t, e) {
  return {
    status: e ? t.status : "cancelled",
    savedDirectReplyCount: t.savedDirectReplyCount
  };
}
function xy({
  getShow: t,
  getPubkeyHex: e,
  getRxNostr: n,
  getRelayConfig: r,
  getLoadedPosts: i,
  onChildInteractionBadgeRefreshRequested: s,
  onQuoteVisibleRangeRefreshRequested: l,
  quoteVisibleRangeRepairExecutor: u,
  relationRepairService: h = by,
  triggerDeletionLifecycle: b = il,
  now: g = Date.now
}) {
  let y = null, x = 0, f = 0, _ = !1;
  const C = /* @__PURE__ */ new Set(), m = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Set();
  function O(ce, G) {
    return !_ && ce === x && G();
  }
  function z(ce, G, de) {
    return !_ && ce === f && t() && e() === G && n() === de;
  }
  function $(ce) {
    const G = i();
    G.length === 0 || ce.length === 0 || Promise.resolve(
      s(G, ce)
    ).catch(() => {
    });
  }
  async function ee(ce) {
    const G = i();
    G.length === 0 || ce.length === 0 || await s(G, ce);
  }
  function ye(ce) {
    ce.length !== 0 && Promise.resolve(
      l(ce)
    ).catch(() => {
    });
  }
  async function F(ce) {
    if (!ce.isActive())
      return;
    const G = ay(ce.source, {
      relationKinds: ce.result.relationKinds,
      savedParentEventIds: ce.result.savedParentEventIds,
      checkedParentEventIds: ce.result.checkedParentEventIds,
      quoteRepairApplied: ce.result.quoteRepairApplied,
      status: ce.result.status
    });
    if (G.shouldRefreshQuotePreviews && ce.isActive() && ye(ce.quoteRefreshPosts), !(G.parentEventIds.length === 0 || !ce.isActive())) {
      if (ce.awaitBadgeRefresh) {
        await ee(G.parentEventIds);
        return;
      }
      $(G.parentEventIds);
    }
  }
  function X(ce) {
    return h.repairVisibleRangeRelations(ce.rxNostr, {
      ownerPubkeyHex: ce.ownerPubkeyHex,
      visiblePosts: ce.visiblePosts,
      relationKinds: td,
      quoteVisibleRangeRepairExecutor: u,
      relayConfig: r(),
      isActive: ce.isActive
    });
  }
  function ve(ce, G, de, Ie) {
    G.length !== 0 && b({
      source: ce,
      parentEventIds: G,
      rxNostr: de,
      relayConfig: r(),
      isActive: Ie
    }).then((Ce) => {
      Ce.status === "cancelled" || Ce.deletedReactionEventIds.length === 0 && Ce.deletedReplyEventIds.length === 0 || !Ie() || $(Ce.checkedParentEventIds);
    }).catch(() => {
    });
  }
  async function Se(ce) {
    if (ce.visiblePosts.length === 0)
      return {
        status: "success",
        savedDirectReplyCount: 0
      };
    const G = ++x, de = () => O(G, ce.isActive);
    ve(
      "listing-current-view",
      ce.visiblePosts.map((Ce) => Ce.eventId),
      ce.rxNostr,
      de
    );
    const Ie = X({
      ...ce,
      isActive: de
    });
    y = Ie;
    try {
      const Ce = await Ie.promise, N = de();
      return y === Ie && (y = null), Ce.status === "cancelled" || !N ? Ud(Ce, !1) : (await F({
        source: "listing-manual-refetch",
        result: Ce,
        quoteRefreshPosts: ce.visiblePosts,
        isActive: de,
        awaitBadgeRefresh: !0
      }), Ud(Ce, de()));
    } catch (Ce) {
      throw y === Ie && (y = null), Ce;
    }
  }
  async function te(ce) {
    if (ce.visiblePosts.length !== 0)
      try {
        ve(
          "listing-current-view",
          ce.visiblePosts.map((Ie) => Ie.eventId),
          ce.rxNostr,
          ce.isActive
        );
        const de = await X(ce).promise;
        if (de.status === "cancelled" || !ce.isActive())
          return;
        await F({
          source: "listing-current-view",
          result: de,
          quoteRefreshPosts: ce.visiblePosts,
          isActive: ce.isActive,
          awaitBadgeRefresh: !0
        });
      } catch {
      }
  }
  function fe(ce) {
    const G = e(), de = n(), Ie = f;
    if (!G || ce.length === 0)
      return;
    const Ce = wy(
      G,
      ce,
      i()
    );
    if (Ce.length === 0)
      return;
    const N = Ce.map((q) => q.eventId);
    if ($(N), !de)
      return;
    const I = () => z(
      Ie,
      G,
      de
    );
    ve(
      "listing-older-reveal",
      N,
      de,
      I
    );
    const Q = Py(
      N,
      m,
      o,
      g()
    ), ne = new Set(Q), ue = Ce.filter(
      (q) => ne.has(q.eventId)
    );
    if (ue.length === 0)
      return;
    ue.forEach((q) => {
      o.add(q.eventId);
    });
    const ie = X({
      ownerPubkeyHex: G,
      rxNostr: de,
      visiblePosts: ue,
      isActive: I
    });
    C.add(ie), ie.promise.then((q) => {
      !I() || q.status === "cancelled" || (F({
        source: "listing-older-reveal",
        result: q,
        quoteRefreshPosts: ue,
        isActive: I,
        awaitBadgeRefresh: !1
      }), q.checkedParentEventIds.length > 0 && q.checkedParentEventIds.forEach((Oe) => {
        m.set(Oe, g());
      }));
    }).catch(() => {
    }).finally(() => {
      Ie === f && (C.delete(ie), ue.forEach((q) => {
        o.delete(q.eventId);
      }));
    });
  }
  function se() {
    x += 1, y?.cancel(), y = null;
  }
  function Ae() {
    f += 1, C.forEach((ce) => ce.cancel()), C.clear(), m.clear(), o.clear();
  }
  function Te() {
    se(), Ae();
  }
  function we() {
    _ = !0, Te();
  }
  return {
    repairCurrentView: Se,
    repairJump: te,
    scheduleOlderRevealRepair: fe,
    cancelCurrentViewRepair: se,
    resetOlderRevealRepairContext: Ae,
    resetAllRepairs: Te,
    dispose: we
  };
}
const Sy = "postHistoryJumpCacheAnchors:", _i = 200, Ei = 720 * 60 * 60 * 1e3;
function So(t) {
  return `${Sy}${t}`;
}
function Iy(t) {
  if (!t || typeof t != "object")
    return !1;
  const e = t;
  return Number.isFinite(e.centerCreatedAt) && Number.isFinite(e.radiusSec) && (e.radiusSec ?? 0) > 0 && Number.isFinite(e.fetchedAt);
}
function Ry(t) {
  if (!t || typeof t != "object")
    return !1;
  const e = t;
  return typeof e.pubkeyHex == "string" && Array.isArray(e.anchors) && e.anchors.every((n) => Iy(n));
}
function Vd(t, e, n, r) {
  const i = e - Math.max(0, Math.trunc(n));
  return t.filter(
    (s) => Number.isFinite(s.centerCreatedAt) && Number.isFinite(s.radiusSec) && s.radiusSec > 0 && Number.isFinite(s.fetchedAt) && s.fetchedAt >= i
  ).sort((s, l) => l.fetchedAt - s.fetchedAt).slice(0, Math.max(1, Math.trunc(r)));
}
function _y(t, e, n) {
  return t.findIndex(
    (r) => Math.abs(r.centerCreatedAt - e) <= Math.max(r.radiusSec, n)
  );
}
class Ey {
  constructor(e = ll, n = Date.now) {
    this.db = e, this.now = n;
  }
  async getForPubkey(e, n = {}) {
    const r = n.ttlMs ?? Ei, i = n.maxCount ?? _i, s = await this.db.meta.get(So(e));
    return !s || !Ry(s.value) ? [] : Vd(s.value.anchors, this.now(), r, i);
  }
  async addForPubkey(e) {
    const n = e.ttlMs ?? Ei, r = e.maxCount ?? _i, i = Number.isFinite(e.fetchedAt) ? Math.trunc(e.fetchedAt ?? 0) : this.now(), s = Number.isFinite(e.centerCreatedAt) ? Math.trunc(e.centerCreatedAt) : 0, l = Number.isFinite(e.radiusSec) ? Math.max(1, Math.trunc(e.radiusSec ?? 1)) : 1, u = await this.getForPubkey(e.pubkeyHex, {
      ttlMs: n,
      maxCount: r
    }), h = _y(
      u,
      s,
      l
    ), b = [...u];
    if (h >= 0) {
      const y = b[h];
      b[h] = {
        centerCreatedAt: s,
        radiusSec: Math.max(y.radiusSec, l),
        fetchedAt: Math.max(y.fetchedAt, i)
      };
    } else
      b.unshift({
        centerCreatedAt: s,
        radiusSec: l,
        fetchedAt: i
      });
    const g = Vd(
      b,
      this.now(),
      n,
      r
    );
    return await this.db.meta.put({
      key: So(e.pubkeyHex),
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
      (i) => Math.abs(n - i.centerCreatedAt) <= i.radiusSec
    );
  }
  async reconcileWithFrontier(e) {
    const n = Number.isFinite(e.frontierVisibleUntil) ? Math.trunc(e.frontierVisibleUntil) : 0, r = Number.isFinite(e.toleranceSec) ? Math.max(0, Math.trunc(e.toleranceSec ?? 0)) : 0, i = e.ttlMs ?? Ei, s = e.maxCount ?? _i, l = await this.getForPubkey(e.pubkeyHex, {
      ttlMs: i,
      maxCount: s
    }), u = l.filter((g) => {
      const y = g.centerCreatedAt + g.radiusSec;
      return Math.max(0, n - y) <= r;
    }), h = l.filter((g) => !u.includes(g)), b = u.length > 0 ? Math.min(
      n,
      ...u.map((g) => Math.max(0, g.centerCreatedAt - g.radiusSec))
    ) : n;
    return u.length > 0 && await this.db.meta.put({
      key: So(e.pubkeyHex),
      value: {
        pubkeyHex: e.pubkeyHex,
        anchors: h
      },
      updatedAt: this.now()
    }), {
      nextVisibleUntil: b,
      removedCount: u.length,
      anchors: h
    };
  }
  async clearForPubkey(e) {
    e && await this.db.meta.delete(So(e));
  }
}
const ro = new Ey(), qu = "postHistoryVisibleRange:";
function Ai(t, e) {
  return `${qu}${t}:${e}`;
}
function Ay(t) {
  if (!t || typeof t != "object")
    return !1;
  const e = t;
  return typeof e.pubkeyHex == "string" && typeof e.kindsKey == "string" && (typeof e.visibleUntil == "number" || e.visibleUntil === null);
}
function Dy(t) {
  const e = /* @__PURE__ */ new Set();
  for (const n of t)
    Number.isFinite(n) && e.add(Math.trunc(n));
  return [...e].sort((n, r) => n - r).join(",");
}
class ky {
  constructor(e = ll, n = Date.now) {
    this.db = e, this.now = n;
  }
  async get(e, n) {
    const r = await this.db.meta.get(Ai(e, n));
    return !r || !Ay(r.value) ? null : {
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
      key: Ai(e.pubkeyHex, e.kindsKey),
      value: {
        pubkeyHex: e.pubkeyHex,
        kindsKey: e.kindsKey,
        visibleUntil: e.visibleUntil
      },
      updatedAt: n
    }), r;
  }
  async clear(e, n) {
    await this.db.meta.delete(Ai(e, n));
  }
  async clearForPubkey(e) {
    if (!e) return;
    const n = `${qu}${e}:`, r = await this.db.meta.filter((i) => i.key.startsWith(n)).primaryKeys();
    await this.db.meta.bulkDelete(r);
  }
}
const Ts = new ky();
function Ty(t) {
  return t.map((e) => e.event?.id).filter((e) => !!e);
}
function My({
  currentPosts: t,
  olderPosts: e,
  anchorEventId: n = null,
  maxVisiblePosts: r,
  keepAbove: i
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
  const l = typeof n == "string" ? s.findIndex((g) => g.eventId === n) : -1, u = (g) => {
    const y = s.slice(g, g + r), x = Math.max(0, y.length - Math.max(0, t.length - g));
    return {
      posts: y,
      didTrimForOlderAppend: !0,
      didDeferOlderPosts: x < e.length
    };
  };
  if (l < 0)
    return u(s.length - r);
  const h = Math.max(0, s.length - r), b = Math.min(h, Math.max(0, l - i));
  return u(b);
}
function Oy(t, e) {
  const n = new Set(t.map((r) => r.eventId));
  return e.filter((r) => !n.has(r.eventId));
}
const Bo = {
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
}, ao = Dy([...kc]), jd = 1440 * 60, Kd = 4320 * 60, Fy = 100, Ly = 720 * 60;
function Di(t, e) {
  if (t.length === 0)
    return !0;
  const n = t[t.length - 1]?.createdAt;
  return Number.isFinite(n) ? (n ?? 0) > e : !0;
}
const Yd = 720 * 60, Hy = 3600, ki = [
  720 * 60,
  1440 * 60,
  4320 * 60,
  10080 * 60,
  336 * 60 * 60,
  720 * 60 * 60
], $y = 6, Ny = 720 * 60 * 60;
function By({
  status: t,
  changed: e,
  didCursorAdvanceOlder: n,
  hitLimit: r,
  continuedWithinWindow: i,
  attemptIndex: s,
  maxAttempts: l,
  totalVisibleAdded: u,
  targetVisibleAdded: h,
  exploredSeconds: b,
  maxExploreSeconds: g
}) {
  return t !== "success" ? { shouldContinue: !1, reason: `status-${t}` } : n ? r && !i ? {
    shouldContinue: !1,
    reason: "hit-limit-continuation-unavailable"
  } : u >= h ? {
    shouldContinue: !1,
    reason: "target-visible-added-reached"
  } : b >= g ? { shouldContinue: !1, reason: "max-explore-seconds-reached" } : s >= l ? { shouldContinue: !1, reason: "max-attempts-reached" } : {
    shouldContinue: !0,
    reason: e ? "small-batch-continue" : "empty-window-continue"
  } : { shouldContinue: !1, reason: "cursor-not-advanced" };
}
const nd = /* @__PURE__ */ new Map();
async function qy({
  nextUntil: t,
  visibleOldestCreatedAt: e,
  pubkeyHex: n,
  getOldestCreatedAt: r,
  getNowSeconds: i = () => Math.floor(Date.now() / 1e3)
}) {
  if (typeof t == "number")
    return t;
  if (typeof e == "number")
    return e;
  const s = await r(n);
  if (typeof s == "number")
    return s;
  const l = i();
  return Number.isFinite(l) ? l : null;
}
function Ur(t) {
  if (typeof t != "string")
    return null;
  const e = t.trim();
  return e.length > 0 ? e : null;
}
function Ji(t) {
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
function Uy(t) {
  const e = Ur(t);
  return Ji(e ? nd.get(e) ?? Bo : Bo);
}
function Ti(t, e) {
  const n = Ur(t);
  n && nd.set(n, Ji(e));
}
function Vy(t) {
  const e = Ur(t);
  e && nd.delete(e);
}
function jy({
  getShow: t,
  getPubkeyHex: e,
  getRxNostr: n,
  getRelayConfig: r,
  getSessionScrollState: i = () => null,
  onSessionScrollStateInvalidated: s = () => {
  },
  onSavedAuthoredPosts: l = () => {
  },
  onChildInteractionBadgeRefreshRequested: u = () => {
  },
  onQuoteVisibleRangeRefreshRequested: h = () => {
  },
  quoteVisibleRangeRepairExecutor: b = void 0,
  pageSize: g = Dc,
  searchDebounceMs: y = 250
}) {
  const x = Ng(e()), f = Uy(e()), _ = f.searchQuery === x.searchQuery && x.searchQuery.length > 0, C = f.totalCountKnown ?? f.totalCount > 0, m = f.totalCountFailed ? "failed" : C ? "ready" : "unknown", o = Jn({
    loadedPosts: f.loadedPosts,
    searchPosts: _ ? f.searchPosts : [],
    searchInput: x.searchInput,
    searchQuery: x.searchQuery,
    currentPage: 1,
    searchPage: _ ? x.searchPage : 1,
    totalCount: f.totalCount,
    totalCountKnown: C,
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
  let O = 0, z = !1, $ = be(!1), ee = be(null), ye = null, F = 0, X = null, ve = 0, Se = be(!1), te = be("idle"), fe = !1, se = !1, Ae = null, Te = be("idle"), we = 0, ce = Ur(e()), G = be(Jn(ce)), de = null, Ie = null, Ce = 0, N = null, I = null, Q = null, ne = null, ue = n(), ie = _ ? x.searchQuery : "", q = !_;
  const Oe = Jn({
    windowSeconds: Yd,
    nextUntil: null,
    consecutiveEmptyCount: 0,
    lastRange: null,
    continuationSince: null,
    exhausted: !1
  }), Ze = Math.max(g * 3, g), dt = xy({
    getShow: t,
    getPubkeyHex: e,
    getRxNostr: n,
    getRelayConfig: r,
    getLoadedPosts: () => o.loadedPosts,
    onChildInteractionBadgeRefreshRequested: u,
    onQuoteVisibleRangeRefreshRequested: h,
    quoteVisibleRangeRepairExecutor: b
  }), he = S(() => o.searchQuery.length > 0), xe = S(() => o.currentViewRefetchStatus === "refetching"), $e = S(() => a(he) ? o.searchPosts : o.loadedPosts), ae = S(() => a(he) ? o.searchPage : 1), at = S(() => a(he) ? o.searchTotalCount : o.totalCount), gt = S(() => a(he) ? Math.max(1, Math.ceil(o.searchTotalCount / g)) : 1), tt = S(() => !a(xe) && a(he) && o.searchPage > 1), st = S(() => a(tt)), nt = S(() => !a(xe) && !a(Se) && a(he) && o.searchHasNext), zt = S(() => a(nt)), Xe = S(() => !1), je = S(() => !a(xe) && (a(he) ? !a(Se) && o.searchHasNext : o.hasOlderLocal)), et = S(() => !a(xe) && !a(he) && o.hasNewerLocal), Ye = S(() => !a(he) && !a(xe) && (o.listingMode === "sparse" || o.hasNewerLocal)), jn = S(() => a($e)[0]?.createdAt ?? null), yt = S(() => a($e).length > 0 ? a($e)[a($e).length - 1]?.createdAt ?? null : null), kt = S(() => !a(he) && !a(xe) && o.hasOlderLocal && (o.listingMode === "sparse" || !(typeof a(yt) == "number" && (o.visibleUntil === null ? o.hasJumpCacheAnchors : a(yt) < o.visibleUntil)))), Me = S(() => !a(he) && !!e() && !!n() && !a(xe) && !Oe.exhausted && o.syncStatus !== "syncing" && o.syncStatus !== "older-syncing"), Qt = S(() => !a(he) && o.syncStatus === "older-syncing"), or = S(() => !a(he) && (o.syncStatus === "syncing" || o.syncStatus === "older-syncing")), ir = S(() => !a(he) && o.listingMode === "contiguous" && o.loadedPosts.length > 0 && !o.hasOlderLocal && o.syncStatus !== "syncing"), $t = S(() => !a(he) && o.listingMode === "contiguous" && typeof o.visibleUntil == "number" && o.loadedPosts.length > 0 && !o.hasOlderLocal && o.hasSavedPostsOutsideVisibleRange), an = S(() => a($e).length), sn = S(() => !!e() && !!n() && !a(he) && o.loadedPosts.length > 0 && !a(xe) && o.syncStatus !== "syncing" && o.syncStatus !== "older-syncing"), Pn = S(() => a(he) || o.syncStatus === "idle" ? null : o.syncStatus === "syncing" || o.syncStatus === "older-syncing" ? "postHistory.syncing" : o.syncStatus === "synced" ? "postHistory.synced" : o.syncStatus === "no-more" ? null : "postHistory.syncFailed"), un = S(() => !a(he) && (o.syncStatus === "syncing" || o.syncStatus === "older-syncing")), Tn = S(() => a(un) || a(xe)), Kn = S(() => o.currentViewRefetchStatus === "refetching" ? "postHistory.repairing" : o.currentViewRefetchMessageKey), lr = S(() => o.currentViewRefetchStatus === "refetching" ? null : o.currentViewRefetchMessageValues);
  function Wt() {
    Ce += 1, Ie?.cancel(), Ie = null;
  }
  function ct() {
    I = null;
  }
  function xr(p, P) {
    return !!p && !!P && p.postedAt === P.postedAt && p.createdAt === P.createdAt && p.eventId === P.eventId;
  }
  function ot(p) {
    return p === Ce;
  }
  function on(p, P) {
    return t() && e() === p && P === O;
  }
  function Yn() {
    z = !1, w($, !1), w(ee, null), ye = null;
  }
  async function Fn(p, P, k) {
    return await Za(), P() ? z ? (w(ee, Ur(p), !0), !0) : k() ? (await new Promise((V) => {
      requestAnimationFrame(() => requestAnimationFrame(() => V()));
    }), P() ? (z = !0, w(ee, Ur(p), !0), w($, !0), !0) : !1) : (z = !0, w(ee, Ur(p), !0), w($, !0), !0) : !1;
  }
  function dr() {
    N?.cancel(), N = null, dt.cancelCurrentViewRepair(), o.currentViewRefetchStatus === "refetching" && (o.currentViewRefetchStatus = "idle"), Ln();
  }
  function Ln() {
    Q !== null && (clearTimeout(Q), Q = null);
  }
  function Mn() {
    ne !== null && (clearTimeout(ne), ne = null);
  }
  function xn() {
    Oe.windowSeconds = Yd, Oe.nextUntil = null, Oe.consecutiveEmptyCount = 0, Oe.lastRange = null, Oe.continuationSince = null, Oe.exhausted = !1;
  }
  function br() {
    o.currentViewRefetchMessageKey = null, o.currentViewRefetchMessageValues = null, Ln();
  }
  function ua() {
    Ln();
    const p = /* @__PURE__ */ new Set([
      "postHistory.repairNoChanges",
      "postHistory.repairAdded",
      "postHistory.repairChildInteractionsAdded",
      "postHistory.repairPartialFailure",
      "postHistory.repairFetchFailed"
    ]);
    p.has(o.currentViewRefetchMessageKey ?? "") && (Q = setTimeout(
      () => {
        o.currentViewRefetchMessageKey !== null && p.has(o.currentViewRefetchMessageKey) && (o.currentViewRefetchMessageKey = null, o.currentViewRefetchMessageValues = null), Q = null;
      },
      3500
    ));
  }
  function hn() {
    Mn(), !(o.syncStatus !== "synced" && o.syncStatus !== "failed") && (ne = setTimeout(
      () => {
        (o.syncStatus === "synced" || o.syncStatus === "failed") && (o.syncStatus = "idle"), ne = null;
      },
      3500
    ));
  }
  function Sn() {
    ve += 1, w(Se, !1), w(te, "idle"), eo.clearCache?.(), Yn(), o.searchInput = "", o.searchQuery = "", o.searchPage = 1, o.searchPosts = [], o.searchTotalCount = 0, o.searchHasNext = !1, ie = "", Sr(), ea();
  }
  function zn() {
    ct(), Dr(), o.loadedPosts = [], Hn({ known: !1, status: "unknown" }), o.currentPage = 1, o.syncStatus = "idle", o.hasMoreRemote = !1, o.nextUntil = null, o.lastDialogOpenRefreshAt = null, o.visibleUntil = null, o.hasJumpCacheAnchors = !1, o.hasOlderLocal = !1, o.hasNewerLocal = !1, o.listingMode = "contiguous", o.sparseSource = null, o.hasSavedPostsOutsideVisibleRange = !1, o.latestOlderBackfillUiResult = null, Sn();
  }
  function Gn() {
    const p = Ur(e());
    return !!p && p === a(G);
  }
  function Sr() {
    Gn() && Ld(e(), {
      searchInput: o.searchInput,
      searchQuery: o.searchQuery,
      currentPage: o.currentPage,
      searchPage: o.searchPage
    });
  }
  function ea() {
    Gn() && Ti(e(), {
      loadedPosts: o.loadedPosts,
      searchPosts: o.searchPosts,
      searchQuery: o.searchQuery,
      totalCount: o.totalCount,
      totalCountKnown: o.totalCountKnown,
      totalCountFailed: o.totalCountStatus === "failed",
      searchTotalCount: o.searchTotalCount,
      searchHasNext: o.searchHasNext,
      hasMoreRemote: o.hasMoreRemote,
      nextUntil: o.nextUntil,
      lastDialogOpenRefreshAt: o.lastDialogOpenRefreshAt,
      visibleUntil: o.visibleUntil,
      hasJumpCacheAnchors: o.hasJumpCacheAnchors,
      hasOlderLocal: o.hasOlderLocal,
      hasNewerLocal: o.hasNewerLocal
    });
  }
  function Lr(p) {
    w(G, Ur(p), !0);
  }
  function ha() {
    ct(), Dr(), dt.resetOlderRevealRepairContext(), o.loadedPosts = [], o.searchPosts = [], Hn({ count: 0, known: !0, status: "ready" }), o.searchTotalCount = 0, o.searchHasNext = !1, o.currentPage = 1, o.searchPage = 1, o.hasMoreRemote = !1, o.nextUntil = null, o.lastDialogOpenRefreshAt = null, o.visibleUntil = null, o.hasJumpCacheAnchors = !1, o.hasOlderLocal = !1, o.hasNewerLocal = !1, o.listingMode = "contiguous", o.sparseSource = null, o.hasSavedPostsOutsideVisibleRange = !1, o.syncStatus = "idle", xn(), br(), Mn(), Sn(), fe = !0;
  }
  function Ir() {
    return o.listingMode === "sparse" && (o.sparseSource === "saved" || o.sparseSource === "jump");
  }
  function ta() {
    if (!Ir())
      return !1;
    const p = e();
    return zn(), xn(), br(), Mn(), Hd(p), Ti(p, { ...Bo }), !0;
  }
  function na() {
    ct(), O += 1, ve += 1, w(Se, !1), w(te, "idle");
  }
  function Rr() {
    const p = ta();
    return Wt(), dr(), na(), Dr(), eo.clearCache?.(), dt.resetOlderRevealRepairContext(), p;
  }
  function Ea() {
    ta(), Wt(), dr(), na(), Dr(), eo.clearCache?.(), dt.resetOlderRevealRepairContext(), o.syncStatus = "idle", xn(), br(), Mn(), fe = !1, se = !1, Ae = null, we += 1, w(Te, "idle"), q = !1;
  }
  function fa(p) {
    const P = li(p);
    o.hasMoreRemote = P, o.nextUntil = P ? p.nextUntil : null;
  }
  function Cr(p) {
    li(p) && o.nextUntil === null && (o.hasMoreRemote = !0, o.nextUntil = p.nextUntil);
  }
  async function jr(p) {
    return typeof a(yt) == "number" && (o.visibleUntil === null ? o.hasJumpCacheAnchors : a(yt) < o.visibleUntil) ? a(yt) : typeof Oe.nextUntil == "number" ? Oe.nextUntil : qy({
      nextUntil: o.nextUntil,
      visibleOldestCreatedAt: a(yt),
      pubkeyHex: p,
      getOldestCreatedAt: (P) => Ge.getOldestCreatedAt(P)
    });
  }
  function Kr(p) {
    if (!Number.isFinite(p))
      return null;
    const P = Math.trunc(p) - 1;
    return P < 0 ? null : {
      since: (typeof Oe.continuationSince == "number" && Oe.continuationSince <= P ? Oe.continuationSince : null) ?? Math.max(0, P - Oe.windowSeconds),
      until: P,
      windowSeconds: Oe.windowSeconds
    };
  }
  function _r(p, P) {
    const k = [];
    return p.hasMore && k.push("hasMore"), p.rawCount >= P && k.push("rawCount"), p.perRelayCounts.some((V) => V.rawCount >= P) && k.push("perRelayRawCount"), k;
  }
  function ra(p) {
    return typeof p.oldestCreatedAt == "number" ? p.oldestCreatedAt : p.events.reduce(
      (P, k) => {
        const V = k.event.created_at;
        return Number.isFinite(V) && (P === null || V < P) ? Math.trunc(V) : P;
      },
      null
    );
  }
  function Yr(p, P) {
    Oe.nextUntil = p, Oe.continuationSince = P, Oe.exhausted = p === null, o.nextUntil = p, o.hasMoreRemote = p !== null;
  }
  function va(p, P, k) {
    _r(P, k), ra(P), P.rawCount ?? P.events.length, P.uniqueCount ?? P.events.length, typeof Oe.nextUntil == "number" && Kr(Oe.nextUntil);
  }
  function Aa() {
    if (o.searchQuery)
      return [];
    const p = o.loadedPosts.map((V) => V.createdAt).filter((V) => Number.isFinite(V)).map((V) => Math.trunc(V));
    if (p.length === 0)
      return [];
    const P = Math.min(...p), k = Math.max(...p);
    return [
      {
        kinds: [...kc],
        rangeUnit: "custom",
        since: Math.max(0, P - jd),
        until: k + jd,
        limit: Ec
      }
    ];
  }
  async function pa(p) {
    return (await Ts.get(p, ao))?.visibleUntil ?? null;
  }
  async function ln(p, P = null) {
    const k = await pa(p);
    return t() && e() === p && (P === null || P === O) && (o.visibleUntil = k), k;
  }
  async function ga(p, P = null) {
    const V = (await ro.getForPubkey(p, { maxCount: 1 })).length > 0;
    return t() && e() === p && (P === null || P === O) && (o.hasJumpCacheAnchors = V), V;
  }
  async function Er(p, P) {
    const k = await pa(p), V = P.events.length === 0 ? null : li(P) ? P.nextUntil : typeof P.oldestCreatedAt == "number" ? P.oldestCreatedAt : null, K = typeof V == "number" ? typeof k == "number" ? Math.min(k, V) : V : k;
    return K !== k && await Ts.save({
      pubkeyHex: p,
      kindsKey: ao,
      visibleUntil: K
    }), o.visibleUntil = K, K;
  }
  async function Da(p, P) {
    const k = await pa(p), V = ra(P), K = typeof V == "number" ? typeof k == "number" ? Math.min(k, V) : V : k;
    return K !== k && await Ts.save({
      pubkeyHex: p,
      kindsKey: ao,
      visibleUntil: K
    }), o.visibleUntil = K, K;
  }
  async function cr(p, P, k) {
    if (typeof P != "number")
      return P;
    const V = k.filter((c) => c.source === "preferred" && c.status === "complete" && typeof c.since == "number" && typeof c.until == "number" && c.until >= P - 1).map((c) => c.since);
    if (V.length === 0)
      return P;
    const K = Math.min(P, ...V);
    return K === P ? P : (await Ts.save({
      pubkeyHex: p,
      kindsKey: ao,
      visibleUntil: K
    }), o.visibleUntil = K, K);
  }
  async function ka(p, P) {
    return typeof P == "number" ? Ge.countVisibleForPubkey(p, P) : Ge.countForPubkey(p);
  }
  async function wr(p, P) {
    if (typeof P == "number")
      return Ge.countVisibleForPubkey(p, P);
    const k = X;
    return k?.pubkeyHex === p && (await k.promise, o.totalCountKnown) || o.totalCountKnown ? o.totalCount : Ge.countForPubkey(p);
  }
  function ya(p, P) {
    if (a(he) || o.listingMode !== "contiguous" || o.sparseSource !== null || e() !== p || o.visibleUntil !== P.visibleUntil)
      return !1;
    const k = B(o.loadedPosts[o.loadedPosts.length - 1]);
    return xr(k, P.oldestCursor);
  }
  async function ma(p, P) {
    const k = I;
    if (!k || k.pubkeyHex !== p)
      return null;
    const V = await ln(p, P);
    if (!t() || e() !== p || P !== O || !ya(p, k))
      return null;
    const [K, c] = await Promise.all([
      Promise.resolve(Ms(p)),
      wr(p, V)
    ]);
    return !ya(p, k) || K !== k.revision || c !== k.totalVisibleCount ? null : k;
  }
  async function Ar(p, P, k, V, K) {
    if (ct(), k.length === 0 || !t() || e() !== p || P !== O || o.listingMode !== "contiguous" || o.sparseSource !== null)
      return !1;
    const c = await wr(p, V), T = await pa(p), re = Ms(p);
    if (re !== K || T !== V || !t() || e() !== p || P !== O || o.listingMode !== "contiguous" || o.sparseSource !== null || o.loadedPosts[0]?.eventId !== k[0]?.eventId || o.loadedPosts[o.loadedPosts.length - 1]?.eventId !== k[k.length - 1]?.eventId)
      return !1;
    const le = B(k[k.length - 1]);
    return le ? (I = {
      pubkeyHex: p,
      visibleUntil: V,
      revision: re,
      totalVisibleCount: c,
      reachedVisibleCount: k.length,
      oldestCursor: le,
      latestEventId: k[0]?.eventId ?? null
    }, !0) : !1;
  }
  async function ls(p, P, k) {
    const V = I;
    if (!V || V.pubkeyHex !== p || a(he) || o.listingMode !== "contiguous" || o.sparseSource !== null || e() !== p)
      return !1;
    const K = B(o.loadedPosts[o.loadedPosts.length - 1]);
    if (!xr(K, V.oldestCursor))
      return !1;
    const c = await wr(p, P);
    return !t() || e() !== p || !xr(K, B(o.loadedPosts[o.loadedPosts.length - 1])) ? !1 : (I = {
      ...V,
      visibleUntil: P,
      revision: Ms(p),
      totalVisibleCount: c
    }, !0);
  }
  async function Hr() {
    ct(), await pe();
  }
  function aa(p, P = o.loadedPosts) {
    if (o.listingMode === "sparse" || o.hasJumpCacheAnchors)
      return !0;
    const k = P.length > 0 ? P[P.length - 1]?.createdAt ?? null : null;
    return typeof k != "number" ? !1 : p === null ? o.hasJumpCacheAnchors : k < p;
  }
  function Hn({ count: p, known: P, status: k }) {
    typeof p == "number" && (o.totalCount = p), o.totalCountKnown = P, o.totalCountStatus = k;
  }
  function Dr() {
    F += 1, X = null, Hn({
      known: o.totalCountKnown,
      status: o.totalCountKnown ? "ready" : "unknown"
    });
  }
  function d(p, { force: P = !1 } = {}) {
    if (!t() || e() !== p || !P && X?.pubkeyHex === p)
      return;
    const k = ++F;
    Hn({
      known: o.totalCountKnown,
      status: o.totalCountKnown ? "refreshing" : "loading"
    });
    const V = Ge.countForPubkey(p).then((K) => {
      k !== F || !t() || e() !== p || Hn({ count: K, known: !0, status: "ready" });
    }).catch(() => {
      k !== F || !t() || e() !== p || Hn({ known: o.totalCountKnown, status: "failed" });
    }).finally(() => {
      X?.requestId === k && (X = null);
    });
    X = { requestId: k, pubkeyHex: p, promise: V };
  }
  function v({ force: p = !1 } = {}) {
    const P = e();
    !P || !t() || d(P, { force: p });
  }
  async function H(p, P, k = null, V = null) {
    const K = typeof P == "number" ? await Ge.hasPostsBeforeCreatedAt(p, P) : !1;
    !t() || e() !== p || k !== null && k !== O || V !== null && !ot(V) || (o.hasSavedPostsOutsideVisibleRange = K);
  }
  function B(p) {
    return p ? {
      eventId: p.eventId,
      postedAt: p.postedAt,
      createdAt: p.createdAt
    } : null;
  }
  function j(p, P) {
    return p.length <= Ze ? p : p.slice(0, Ze);
  }
  function oe(p, P, k) {
    return My({
      currentPosts: p,
      olderPosts: P,
      anchorEventId: k,
      maxVisiblePosts: Ze,
      keepAbove: g
    });
  }
  async function W(p, P = o.loadedPosts, k = null, V = {}) {
    if (P.length === 0) {
      t() && e() === p && (k === null || k === O) && (o.hasOlderLocal = !1, o.hasNewerLocal = !1);
      return;
    }
    const K = B(P[0]), c = B(P[P.length - 1]), T = o.visibleUntil, re = o.sparseSource === "saved" && typeof T == "number" ? K ? Ge.getSparseChunk({
      pubkeyHex: p,
      visibleUntil: T,
      cursor: K,
      direction: "newer",
      limit: 1
    }) : Promise.resolve([]) : K ? Ge.getNewerVisibleChunk({ pubkeyHex: p, visibleUntil: T, cursor: K, limit: 1 }) : Promise.resolve([]), le = V.skipOlderCheck ? Promise.resolve([]) : o.sparseSource === "saved" && typeof T == "number" ? c ? Ge.getSparseChunk({
      pubkeyHex: p,
      visibleUntil: T,
      cursor: c,
      direction: "older",
      limit: 1
    }) : Promise.resolve([]) : o.sparseSource === "jump" ? c ? Ge.getOlderVisibleChunk({
      pubkeyHex: p,
      visibleUntil: null,
      cursor: c,
      limit: 1
    }) : Promise.resolve([]) : c ? Ge.getOlderVisibleChunk({ pubkeyHex: p, visibleUntil: T, cursor: c, limit: 1 }) : Promise.resolve([]), [Re, Je] = await Promise.all([re, le]);
    !t() || e() !== p || k !== null && k !== O || (o.hasNewerLocal = Re.length > 0, V.skipOlderCheck || (o.hasOlderLocal = Je.length > 0));
  }
  async function pe({
    forceTotalCount: p = !1,
    skipTotalCountRefresh: P = !1,
    skipOlderAvailabilityCheck: k = !1,
    awaitProgress: V = !1
  } = {}) {
    ct();
    const K = e();
    if (!K) {
      w(G, null), zn();
      return;
    }
    const c = ++O, T = await ln(K, c), re = Ms(K), le = await Ge.getLatestVisibleChunk({ pubkeyHex: K, limit: g, visibleUntil: T });
    if (!t() || e() !== K || c !== O || (Lr(K), o.listingMode = "contiguous", o.sparseSource = null, o.loadedPosts = le, !await Fn(K, () => on(K, c), () => o.loadedPosts.length > 0)))
      return;
    P || v({ force: p }), ga(K, c).catch(() => {
    });
    const Re = Ar(K, c, le, T, re);
    let Je = !1;
    V ? Je = await Re.catch(() => (ct(), !1)) : Re.catch(() => {
      ct();
    });
    const mt = k && Je;
    k && !mt ? o.hasOlderLocal = !1 : mt && I && (o.hasOlderLocal = I.totalVisibleCount > I.reachedVisibleCount), H(K, T, c).catch(() => {
    }), W(K, le, c, { skipOlderCheck: mt }).then(() => {
      !t() || e() !== K || c !== O || ds(K, le);
    }).catch(() => {
    });
  }
  async function Pe({ skipTotalCountRefresh: p = !1 } = {}) {
    ct();
    const P = e();
    if (!P || o.loadedPosts.length === 0) {
      await pe({ skipTotalCountRefresh: p });
      return;
    }
    const k = o.loadedPosts[0], V = B(k);
    if (!V) {
      await pe({ skipTotalCountRefresh: p });
      return;
    }
    const K = ++O, c = await ln(P), re = aa(c, o.loadedPosts) ? await Ge.getVisibleChunkFromCreatedAt({
      pubkeyHex: P,
      visibleUntil: c,
      createdAt: k.createdAt,
      limit: o.loadedPosts.length,
      query: { contiguous: !1 }
    }) : await (o.loadedPosts.length > 1 ? Ge.getOlderVisibleChunk({
      pubkeyHex: P,
      visibleUntil: c,
      cursor: V,
      limit: o.loadedPosts.length - 1
    }).then((le) => [k, ...le]) : Promise.resolve([k]));
    !t() || K !== O || (o.loadedPosts = re, await Fn(P, () => on(P, K), () => o.loadedPosts.length > 0) && (p || v(), await W(P, re, K)));
  }
  function Le(p, P) {
    return !!p && (!P || p.requestedAt > P.savedAt);
  }
  async function ke(p, P) {
    ct();
    const k = e(), V = o.loadedPosts, K = B(V[0]), c = B(V[V.length - 1]);
    if (!k || !t() || V.length === 0)
      return;
    const T = ++O, re = await ln(k), [le, Re] = await Promise.all([
      K ? Ge.getNewerVisibleChunk({ pubkeyHex: k, visibleUntil: re, cursor: K, limit: 1 }) : Promise.resolve([]),
      c ? Ge.getOlderVisibleChunk({ pubkeyHex: k, visibleUntil: re, cursor: c, limit: 1 }) : Promise.resolve([])
    ]);
    if (!(!t() || T !== O)) {
      if (Le(P, p)) {
        s(), await pe();
        return;
      }
      o.hasNewerLocal = le.length > 0, o.hasOlderLocal = Re.length > 0, await Fn(k, () => on(k, T), () => o.loadedPosts.length > 0) && (v(), await W(k, o.loadedPosts, T), on(k, T) && ds(k, o.loadedPosts));
    }
  }
  function He() {
    const p = i();
    return !p || p.mode !== "normal" || p.pubkeyHex !== e() ? null : p;
  }
  function Fe(p) {
    return a(he) || o.loadedPosts.length === 0 || !p ? !1 : o.loadedPosts.some((P) => P.eventId === p.anchor.eventId);
  }
  async function ut(p) {
    ct();
    const P = e();
    if (!P || !t())
      return !1;
    const k = ++O, V = await ln(P), K = await Ge.getVisibleChunkAroundEventId({
      pubkeyHex: P,
      visibleUntil: V,
      eventId: p.anchor.eventId,
      limit: Ze,
      keepAbove: g
    });
    return !t() || k !== O ? !1 : K.length === 0 ? (s(), await pe(), !1) : (o.loadedPosts = K, !await Fn(P, () => on(P, k), () => o.loadedPosts.length > 0) || (v(), await W(P, K, k), !on(P, k)) ? !1 : (ds(P, K), !0));
  }
  async function ht(p = {}) {
    const P = o.loadedPosts, k = p.metrics;
    k && (k.loadedPostsBeforeLength = P.length, k.loadedPostsAfterLength = P.length, k.olderPostsLength = 0, k.visibleOldestBefore = P.length > 0 ? P[P.length - 1]?.createdAt ?? null : null, k.visibleOldestAfter = P.length > 0 ? P[P.length - 1]?.createdAt ?? null : null, k.didTrimForOlderAppend = !1, k.didDeferOlderPosts = !1, k.maxVisiblePosts = Ze);
    const V = e(), K = B(o.loadedPosts[o.loadedPosts.length - 1]);
    if (!V || !K)
      return await pe(), k && (k.loadedPostsAfterLength = o.loadedPosts.length, k.olderPostsLength = o.loadedPosts.length, k.visibleOldestAfter = o.loadedPosts.length > 0 ? o.loadedPosts[o.loadedPosts.length - 1]?.createdAt ?? null : null), o.loadedPosts.length > 0;
    const c = p.useContiguousProgress !== !1 && I !== null, T = p.preserveContiguousProgressAfterDatabaseChange ? I : null, re = ++O, le = c ? await ma(V, re) : null;
    if (c && !le)
      return await Hr(), k && (k.loadedPostsAfterLength = o.loadedPosts.length, k.visibleOldestAfter = o.loadedPosts.length > 0 ? o.loadedPosts[o.loadedPosts.length - 1]?.createdAt ?? null : null), !1;
    const Re = le?.visibleUntil ?? await ln(V, re), Je = le ? Math.max(0, le.totalVisibleCount - le.reachedVisibleCount) : g;
    if (le && Je === 0)
      return o.hasOlderLocal = !1, k && (k.loadedPostsAfterLength = o.loadedPosts.length, k.visibleOldestAfter = o.loadedPosts.length > 0 ? o.loadedPosts[o.loadedPosts.length - 1]?.createdAt ?? null : null), await W(V, o.loadedPosts, re, { skipOlderCheck: !0 }), !1;
    const mt = Math.min(g, Je), bt = await Ge.getOlderVisibleChunk({
      pubkeyHex: V,
      visibleUntil: Re,
      cursor: K,
      limit: mt
    });
    if (k && (k.olderPostsLength = bt.length), !t() || re !== O)
      return !1;
    const ze = le ? await ma(V, re) : null;
    if (le && !ze)
      return await Hr(), !1;
    if (bt.length === 0)
      return le ? await Hr() : o.hasOlderLocal = !1, k && (k.loadedPostsAfterLength = o.loadedPosts.length, k.visibleOldestAfter = o.loadedPosts.length > 0 ? o.loadedPosts[o.loadedPosts.length - 1]?.createdAt ?? null : null), !1;
    const Rt = oe(P, bt, p.anchorEventId), Zn = p.reason === "normal-older-reveal" ? Oy(P, Rt.posts) : [];
    o.loadedPosts = Rt.posts, Zn.length > 0 && dt.scheduleOlderRevealRepair(Zn), Rt.didDeferOlderPosts && (o.hasOlderLocal = !0);
    const hr = Zn.length;
    ze ? I = {
      ...ze,
      reachedVisibleCount: Math.min(ze.totalVisibleCount, ze.reachedVisibleCount + hr),
      oldestCursor: B(Rt.posts[Rt.posts.length - 1]) ?? ze.oldestCursor
    } : !c && T && Ms(V) === T.revision && (xr(K, T.oldestCursor) ? I = {
      ...T,
      reachedVisibleCount: Math.min(T.totalVisibleCount, T.reachedVisibleCount + hr),
      oldestCursor: B(Rt.posts[Rt.posts.length - 1]) ?? T.oldestCursor
    } : ct());
    const wa = !!I && I.reachedVisibleCount >= I.totalVisibleCount;
    return k && (k.loadedPostsAfterLength = Rt.posts.length, k.visibleOldestAfter = Rt.posts.length > 0 ? Rt.posts[Rt.posts.length - 1]?.createdAt ?? null : null, k.didTrimForOlderAppend = Rt.didTrimForOlderAppend, k.didDeferOlderPosts = Rt.didDeferOlderPosts), await W(V, Rt.posts, re, {
      skipOlderCheck: c && wa
    }), !0;
  }
  async function Tt(p, P, k = {}) {
    ct();
    const V = o.loadedPosts, K = V.length > 0 ? V[V.length - 1]?.createdAt ?? null : null;
    if (typeof K != "number")
      return !1;
    const c = await Ge.getVisibleChunkFromCreatedAt({
      pubkeyHex: p,
      visibleUntil: o.visibleUntil,
      createdAt: Math.max(0, K - 1),
      limit: g,
      query: { contiguous: !1 }
    });
    if (!t() || P !== O)
      return !1;
    if (c.length === 0)
      return o.hasOlderLocal = !1, !1;
    const T = oe(V, c, k.anchorEventId);
    return o.loadedPosts = T.posts, await W(p, T.posts, P), T.didDeferOlderPosts && (o.hasOlderLocal = !0), !0;
  }
  async function Xt(p, P, k = {}) {
    ct();
    const V = o.loadedPosts;
    if (typeof o.visibleUntil != "number")
      return !1;
    const K = B(V[V.length - 1]);
    if (!K)
      return !1;
    const c = await Ge.getSparseChunk({
      pubkeyHex: p,
      visibleUntil: o.visibleUntil,
      cursor: K,
      direction: "older",
      limit: g
    });
    if (!t() || P !== O)
      return !1;
    if (c.length === 0)
      return o.hasOlderLocal = !1, !1;
    const T = oe(V, c, k.anchorEventId);
    return o.loadedPosts = T.posts, await W(p, T.posts, P), T.didDeferOlderPosts && (o.hasOlderLocal = !0), !0;
  }
  async function At() {
    const p = e(), P = B(o.loadedPosts[0]);
    if (!p || !P)
      return !1;
    const k = ++O, V = I, K = V ? await ma(p, k) : null;
    if (V && !K)
      return await Hr(), !1;
    const c = K?.visibleUntil ?? await ln(p, k), T = await Ge.getNewerVisibleChunk({
      pubkeyHex: p,
      visibleUntil: c,
      cursor: P,
      limit: g
    });
    if (!t() || k !== O)
      return !1;
    if (T.length === 0)
      return o.hasNewerLocal = !1, !1;
    if (K && !await ma(p, k))
      return await Hr(), !1;
    const re = o.loadedPosts, le = j([...T, ...re]);
    if (o.loadedPosts = le, K) {
      const Re = Math.max(0, re.length + T.length - le.length);
      I = {
        ...K,
        reachedVisibleCount: Math.max(0, K.reachedVisibleCount - Re),
        oldestCursor: B(le[le.length - 1]) ?? K.oldestCursor
      };
    }
    return await W(p, le, k), !(!t() || k !== O);
  }
  async function Pr(p) {
    ct();
    const P = e();
    if (!P)
      return !1;
    const k = ++O, V = await ln(P), K = await Ge.getVisibleChunkFromCreatedAt({ pubkeyHex: P, visibleUntil: V, createdAt: p, limit: g });
    if (!t() || k !== O)
      return !1;
    if (K.length === 0)
      return v(), o.loadedPosts = [], o.hasOlderLocal = !1, o.hasNewerLocal = !1, !1;
    if (!Di(K, p))
      return v(), o.listingMode = "contiguous", o.sparseSource = null, o.loadedPosts = K, xn(), await W(P, K, k), !0;
    if (p <= 0)
      return v(), o.listingMode = "contiguous", o.sparseSource = null, o.loadedPosts = K, xn(), await W(P, K, k), !0;
    const c = await ro.hasNearbyAnchorForPubkey({ pubkeyHex: P, targetCreatedAt: p });
    if (!t() || k !== O)
      return !1;
    if (c) {
      const ze = await Ge.getVisibleChunkFromCreatedAt({
        pubkeyHex: P,
        visibleUntil: V,
        createdAt: p,
        limit: g,
        query: { contiguous: !1 }
      });
      if (!t() || k !== O)
        return !1;
      if (!Di(ze, p))
        return v(), o.listingMode = "sparse", o.sparseSource = "jump", o.loadedPosts = ze, xn(), await W(P, ze, k), !0;
    }
    const T = n();
    if (!T)
      return v(), o.listingMode = "contiguous", o.sparseSource = null, o.loadedPosts = K, xn(), await W(P, K, k), !0;
    Wt();
    const re = ++Ce;
    o.syncStatus = "syncing";
    const le = Math.max(0, p - Kd), Re = p, Je = Eo.fetchLatest(T, {
      pubkeyHex: P,
      relayConfig: r(),
      reason: "repair-visible-range",
      limit: Fy,
      since: le,
      until: Re
    });
    Ie = Je;
    const mt = await Je.promise;
    if (!ot(re) || Ie !== Je)
      return !1;
    if (Ie = null, !t() || mt.status === "cancelled" || (mt.events.length > 0 && (await Ge.upsertFetchedEvents({ events: mt.events, fetchedAt: mt.fetchedAt }), await ro.addForPubkey({
      pubkeyHex: P,
      centerCreatedAt: p,
      radiusSec: Kd,
      fetchedAt: mt.fetchedAt
    }), o.hasJumpCacheAnchors = !0), !t() || k !== O))
      return o.syncStatus = "idle", !1;
    const bt = await Ge.getVisibleChunkFromCreatedAt({
      pubkeyHex: P,
      visibleUntil: V,
      createdAt: p,
      limit: g,
      query: { contiguous: !1 }
    });
    return !t() || k !== O ? (o.syncStatus = "idle", !1) : (o.syncStatus = "idle", Di(bt, p) ? !1 : (v({ force: mt.events.length > 0 }), o.listingMode = "sparse", o.sparseSource = "jump", o.loadedPosts = bt, xn(), await W(P, bt, k), dt.repairJump({
      ownerPubkeyHex: P,
      rxNostr: T,
      visiblePosts: bt,
      isActive: () => t() && e() === P && n() === T && k === O
    }).catch(() => {
    }), !0));
  }
  function zr(p, P) {
    const k = [...p], V = new Set(p.map((K) => K.eventId));
    for (const K of P)
      V.has(K.eventId) || (V.add(K.eventId), k.push(K));
    return k;
  }
  function ur(p, P, k) {
    return t() && p === ve && e() === k && P === o.searchQuery;
  }
  async function sa(p, P, k) {
    const V = e();
    if (!V || !P)
      return null;
    const K = await eo.searchLocalPosts({ pubkeyHex: V, query: P, page: p, pageSize: g });
    return ur(k, P, V) ? K : null;
  }
  async function it(p, P) {
    const k = e();
    if (!k || !P)
      return o.searchPosts = [], o.searchTotalCount = 0, o.searchHasNext = !1, !1;
    const V = ++ve, K = Math.max(1, Math.trunc(p));
    w(Se, !0), w(te, "loading");
    try {
      const c = await sa(K, P, V);
      if (!c)
        return !1;
      const T = cd(K, c.total, g);
      return T !== K ? (V === ve && ur(V, P, k) && w(te, "ready"), !1) : (o.searchTotalCount = c.total, o.searchPosts = K === 1 ? c.items : zr(o.searchPosts, c.items), o.searchPage = T, o.searchHasNext = c.hasNext, w(te, "ready"), !(!z && !await Fn(k, () => ur(V, P, k), () => o.searchPosts.length > 0)));
    } catch {
      return V === ve && w(te, "failed"), !1;
    } finally {
      V === ve && w(Se, !1);
    }
  }
  async function fn(p, P, k = ++ve) {
    const V = e();
    if (!V || !P)
      return !1;
    const K = Math.max(1, Math.trunc(p));
    w(Se, !0), w(te, "loading");
    try {
      const c = await sa(1, P, k);
      if (!c)
        return !1;
      const T = cd(K, c.total, g);
      let re = c.items, le = c;
      for (let Re = 2; Re <= T; Re += 1) {
        const Je = await sa(Re, P, k);
        if (!Je)
          return !1;
        re = zr(re, Je.items), le = Je;
      }
      return o.searchPosts = re, o.searchTotalCount = c.total, o.searchPage = T, o.searchHasNext = le.hasNext, w(te, "ready"), !(!z && !await Fn(V, () => ur(k, P, V), () => o.searchPosts.length > 0));
    } catch {
      return k === ve && w(te, "failed"), !1;
    } finally {
      k === ve && w(Se, !1);
    }
  }
  async function ba() {
    ct();
    const p = e(), P = n();
    if (!p || !P)
      return;
    Wt();
    const k = ++Ce;
    o.syncStatus = "syncing";
    const V = await ln(p);
    if (!ot(k) || !t() || e() !== p)
      return;
    const K = Eo.fetchLatest(P, {
      pubkeyHex: p,
      relayConfig: r(),
      reason: "bootstrap",
      limit: _h,
      timeoutMs: Rh
    });
    Ie = K;
    const c = await K.promise;
    let T = {
      insertedCount: 0,
      updatedCount: 0
    };
    if (!ot(k) || Ie !== K || (Ie = null, !t() || c.status === "cancelled"))
      return;
    if (c.events.length > 0) {
      T = await Ge.upsertFetchedEvents({ events: c.events, fetchedAt: c.fetchedAt });
      const Re = Ty(c.events);
      Re.length > 0 && await l(Re);
    }
    if (!ot(k) || !t())
      return;
    const re = await Er(p, c);
    if (!ot(k) || !t())
      return;
    const le = re !== V;
    fa(c), o.searchQuery ? await fn(o.searchPage, o.searchQuery) : o.loadedPosts.length === 0 || !o.hasNewerLocal ? await pe({
      forceTotalCount: T.insertedCount + T.updatedCount > 0
    }) : (v({
      force: T.insertedCount + T.updatedCount > 0
    }), await W(p)), o.syncStatus = ii(c, T.insertedCount + T.updatedCount > 0 || le);
  }
  async function $r() {
    const p = e(), P = n();
    if (!p || !P)
      return;
    Wt();
    const k = ++Ce;
    o.syncStatus = "syncing", o.lastDialogOpenRefreshAt = Date.now();
    const V = await ln(p);
    if (!ot(k) || !t() || e() !== p)
      return;
    const K = Tc.runAuthored(P, {
      ownerPubkeyHex: p,
      relayConfig: r(),
      reason: "dialog-open-refresh",
      limit: Dh,
      timeoutMs: Ah,
      onSavedSelfPosts: l
    });
    Ie = K;
    const c = await K.promise, T = c.fetchResult, re = c.upsertSummary;
    if (!ot(k) || Ie !== K || (Ie = null, !t() || T.status === "cancelled") || !ot(k) || !t())
      return;
    const le = await Er(p, T);
    if (!ot(k) || !t())
      return;
    const Re = Bg({
      insertedCount: re.insertedCount,
      updatedCount: re.updatedCount,
      previousVisibleUntil: V,
      nextVisibleUntil: le,
      searchQuery: o.searchQuery,
      loadedPostsLength: o.loadedPosts.length,
      hasNewerLocal: o.hasNewerLocal
    });
    if (Cr(T), o.syncStatus = ii(T, Re.didMateriallyChange), hn(), Re.applyAction === "reload-search-page")
      await fn(o.searchPage, o.searchQuery);
    else if (Re.applyAction === "load-latest-visible-posts") {
      const Je = Re.didMateriallyChange && !Re.didVisibleMateriallyChange;
      await pe({
        forceTotalCount: Re.didMateriallyChange,
        skipOlderAvailabilityCheck: Je,
        awaitProgress: Je
      });
    } else Re.applyAction === "refresh-count-and-availability" && (Re.didMateriallyChange ? await pe({
      forceTotalCount: Re.didMateriallyChange,
      skipOlderAvailabilityCheck: !Re.didVisibleMateriallyChange,
      awaitProgress: !Re.didVisibleMateriallyChange
    }) : (ct(), v({ force: Re.didMateriallyChange }), await W(p)));
  }
  function Ca() {
    return typeof o.lastDialogOpenRefreshAt != "number" ? !0 : Date.now() - o.lastDialogOpenRefreshAt >= Eh;
  }
  function ds(p, P) {
    if (!(fe || !t() || e() !== p || !n())) {
      if (fe = !0, P.length === 0) {
        ba();
        return;
      }
      Ca() && $r();
    }
  }
  function cs() {
    return !a(he) || !a(tt) ? !1 : (o.searchPage -= 1, !0);
  }
  function _s() {
    return !a(he) || !a(st) ? !1 : (o.searchPage = 1, !0);
  }
  async function Ua() {
    if (!a(he) || !a(nt))
      return !1;
    const p = o.searchPage + 1;
    return it(p, o.searchQuery);
  }
  async function us() {
    return !a(he) || !a(zt) ? !1 : (o.searchPage = a(gt), !0);
  }
  async function Us() {
    if (a(he))
      return Ua();
    if (o.sparseSource === "saved") {
      const p = e();
      return p ? Xt(p, ++O, {}) : !1;
    }
    if (o.sparseSource === "jump") {
      const p = e();
      return p ? Tt(p, ++O, {}) : !1;
    }
    return ht({ reason: "normal-older-reveal" });
  }
  async function Es() {
    return a(he) ? Promise.resolve(cs()) : o.sparseSource === "saved" ? ja() : At();
  }
  async function Va() {
    return a(he) ? Promise.resolve(_s()) : (await pe(), !0);
  }
  async function hs() {
    const p = e();
    if (!p)
      return !1;
    const P = await ln(p);
    if (typeof P != "number") return !1;
    const k = ++O, V = await Ge.getSparseChunk({
      pubkeyHex: p,
      visibleUntil: P,
      direction: "latest",
      limit: g
    });
    return !t() || e() !== p || k !== O ? !1 : V.length === 0 ? (o.hasSavedPostsOutsideVisibleRange = !1, !1) : (o.listingMode = "sparse", o.sparseSource = "saved", o.loadedPosts = V, v(), await W(p, V, k), await H(p, P, k), !0);
  }
  async function fs() {
    if (a(he) || !a(kt))
      return !1;
    if (o.listingMode === "sparse") {
      ct();
      const K = e();
      if (!K)
        return !1;
      const c = ++O, T = await Ge.getOldestVisibleChunk({
        pubkeyHex: K,
        visibleUntil: o.visibleUntil,
        limit: g,
        query: { contiguous: !1 }
      });
      return !t() || c !== O || T.length === 0 ? !1 : (v(), o.loadedPosts = T, xn(), o.hasOlderLocal = !1, await W(K, T, c, { skipOlderCheck: !0 }), !0);
    }
    ct();
    const p = e();
    if (!p)
      return !1;
    const P = ++O, k = await ln(p, P), V = await Ge.getOldestVisibleChunk({ pubkeyHex: p, visibleUntil: k, limit: g });
    return !t() || P !== O ? !1 : V.length === 0 ? (v(), o.loadedPosts = [], o.hasOlderLocal = !1, o.hasNewerLocal = !1, !1) : (v(), o.listingMode = "contiguous", o.sparseSource = null, o.loadedPosts = V, xn(), o.hasOlderLocal = !1, await W(p, V, P, { skipOlderCheck: !0 }), !0);
  }
  async function Vs(p = {}) {
    const P = e(), k = n();
    if (!P || !k || !a(Me))
      return !1;
    Wt();
    const V = ++Ce;
    o.syncStatus = "older-syncing";
    const K = $y, c = Ny, T = Math.max(1, Math.min(g, 30));
    let re = null, le = 0, Re = 0, Je = 0, mt = null, bt = null, ze = !1, Rt = 0, Zn = null;
    for (; ; ) {
      le += 1;
      const hr = mt ?? await jr(P), wa = typeof mt == "number", fr = await ln(P);
      if (!ot(V) || !t() || e() !== P)
        return ze;
      const Qr = typeof hr == "number" ? wa ? hr : typeof fr == "number" ? Math.min(hr, fr) : hr : fr;
      if (typeof Qr != "number")
        return o.syncStatus = "idle", ze;
      const Ya = Math.trunc(Qr) - 1;
      if (Ya < 0)
        return Yr(null, null), o.syncStatus = "idle", ze;
      const Ks = Math.min(Je, ki.length - 1), vs = ki[Ks], kr = {
        since: (typeof bt == "number" && bt <= Ya ? bt : null) ?? Math.max(0, Ya - vs),
        until: Ya,
        windowSeconds: vs
      }, ps = await ka(P, fr);
      if (!ot(V) || !t() || e() !== P)
        return ze;
      re === null && (re = ps);
      let za = !1, Wr = {
        insertedCount: 0,
        updatedCount: 0
      };
      const gs = Eo.fetchLatest(k, {
        pubkeyHex: P,
        relayConfig: r(),
        reason: "older-backfill",
        limit: oi,
        timeoutMs: Ih,
        since: kr.since,
        until: kr.until
      });
      Ie = gs;
      const $n = await gs.promise;
      if (!ot(V) || Ie !== gs || (Ie = null, !t() || $n.status === "cancelled") || ($n.events.length > 0 && (Wr = await Ge.upsertFetchedEvents({ events: $n.events, fetchedAt: $n.fetchedAt }), za = Wr.insertedCount + Wr.updatedCount > 0), !ot(V) || !t()))
        return ze;
      const Qa = typeof a(yt) == "number" && (fr === null ? o.hasJumpCacheAnchors : a(yt) < fr), Wa = Qa ? fr : await Da(P, $n);
      if (!ot(V) || !t())
        return ze;
      const Nr = !Qa && typeof Wa == "number" ? await ro.reconcileWithFrontier({
        pubkeyHex: P,
        frontierVisibleUntil: Wa,
        toleranceSec: Ly
      }) : null, ys = Nr ? Nr.nextVisibleUntil : Wa;
      Nr && (o.hasJumpCacheAnchors = Nr.anchors.length > 0), Nr && Nr.nextVisibleUntil !== Wa && (await Ts.save({
        pubkeyHex: P,
        kindsKey: ao,
        visibleUntil: Nr.nextVisibleUntil
      }), o.visibleUntil = Nr.nextVisibleUntil);
      const zs = await ka(P, ys);
      if (!ot(V) || !t())
        return ze;
      let Co = !1;
      if (Qa || (Co = await ls(P, ys)), await H(P, ys, null, V), !ot(V) || !t())
        return ze;
      const Be = zs > ps, lt = _r($n, oi).length > 0, Nt = ra($n), In = typeof Nt == "number" && Nt > kr.since ? Nt - kr.since : 0, Xn = $n.status === "success" && lt && typeof Nt == "number" && Nt > kr.since && In >= Hy;
      let Qn = kr.since > 0 ? kr.since : null, Br = null;
      Xn && typeof Nt == "number" && (Qn = Nt, Br = kr.since), Oe.windowSeconds = vs, Oe.lastRange = { ...kr, hitLimit: lt }, $n.status === "success" && $n.events.length === 0 ? Oe.consecutiveEmptyCount += 1 : $n.events.length > 0 && (Oe.consecutiveEmptyCount = 0), Yr(Qn, Br), va(kr, $n, oi);
      let dn = !1;
      const Jt = {
        loadedPostsBeforeLength: o.loadedPosts.length,
        loadedPostsAfterLength: o.loadedPosts.length,
        olderPostsLength: 0,
        visibleOldestBefore: o.loadedPosts.length > 0 ? o.loadedPosts[o.loadedPosts.length - 1]?.createdAt ?? null : null,
        visibleOldestAfter: o.loadedPosts.length > 0 ? o.loadedPosts[o.loadedPosts.length - 1]?.createdAt ?? null : null,
        didTrimForOlderAppend: !1,
        didDeferOlderPosts: !1,
        maxVisiblePosts: Ze
      };
      o.searchQuery ? await fn(o.searchPage, o.searchQuery) : (v({ force: za }), Be || za ? dn = o.sparseSource === "saved" ? await Xt(P, O, { anchorEventId: p.anchorEventId }) : Qa ? await Tt(P, O, { anchorEventId: p.anchorEventId }) : await ht({
        anchorEventId: p.anchorEventId,
        metrics: Jt,
        reason: "normal-older-reveal",
        useContiguousProgress: !1,
        preserveContiguousProgressAfterDatabaseChange: Co
      }) : await W(P));
      const Bt = dn || Be || za, Qe = ze || Bt, Y = typeof Qn == "number" && Qn < Qr, We = zs, qt = Math.max(0, We - (re ?? We)), en = typeof Qn == "number" ? Math.max(0, Qr - Qn) : Math.max(0, Qr), er = Re + en, vt = By({
        status: $n.status,
        changed: Bt,
        didCursorAdvanceOlder: Y,
        hitLimit: lt,
        continuedWithinWindow: Xn,
        attemptIndex: le,
        maxAttempts: K,
        totalVisibleAdded: qt,
        targetVisibleAdded: T,
        exploredSeconds: er,
        maxExploreSeconds: c
      }), Ut = vt.shouldContinue, Mt = Ut ? Rt + 1 : Rt;
      if (Re = er, Ut) {
        o.latestOlderBackfillUiResult = {
          changed: Qe,
          didTrimForOlderAppend: Jt.didTrimForOlderAppend,
          didDeferOlderPosts: Jt.didDeferOlderPosts,
          loadedPostsBeforeLength: Jt.loadedPostsBeforeLength,
          loadedPostsAfterLength: Jt.loadedPostsAfterLength,
          maxVisiblePosts: Jt.maxVisiblePosts,
          autoRetryCount: Mt,
          autoRetryReason: vt.reason,
          attemptIndex: le,
          maxAttempts: K,
          clickStartVisibleCount: re ?? We,
          currentVisibleCount: We,
          totalVisibleAdded: qt,
          targetVisibleAdded: T,
          shouldContinueForSmallBatch: Ut,
          exploredSeconds: Re,
          maxExploreSeconds: c
        }, Rt = Mt, Zn = vt.reason, ze = Qe, mt = Qn, bt = Br, Xn || (Je = Math.min(Je + 1, ki.length - 1));
        continue;
      }
      return Zn = vt.reason, ze = Qe, vt.reason, o.latestOlderBackfillUiResult = {
        changed: ze,
        didTrimForOlderAppend: Jt.didTrimForOlderAppend,
        didDeferOlderPosts: Jt.didDeferOlderPosts,
        loadedPostsBeforeLength: Jt.loadedPostsBeforeLength,
        loadedPostsAfterLength: Jt.loadedPostsAfterLength,
        maxVisiblePosts: Jt.maxVisiblePosts,
        autoRetryCount: Rt,
        autoRetryReason: Zn,
        attemptIndex: le,
        maxAttempts: K,
        clickStartVisibleCount: re ?? We,
        currentVisibleCount: We,
        totalVisibleAdded: qt,
        targetVisibleAdded: T,
        shouldContinueForSmallBatch: Ut,
        exploredSeconds: Re,
        maxExploreSeconds: c
      }, $n.status !== "success" ? (o.syncStatus = "failed", hn(), ze) : (o.syncStatus = ze ? ii($n, !0) : "idle", hn(), ze);
    }
  }
  async function As() {
    ct();
    const p = e(), P = n();
    if (!p || !P || !a(sn))
      return;
    const k = Aa();
    if (k.length === 0)
      return;
    br(), o.currentViewRefetchStatus = "refetching";
    const V = await ln(p), K = ry.refetchAroundCurrentView(P, {
      pubkeyHex: p,
      relayConfig: r(),
      preferredRanges: k,
      onProgress: async () => {
      }
    });
    N = K;
    let c = !1;
    try {
      const T = await K.promise;
      if (N !== K)
        return;
      if (!t() || T.status === "cancelled") {
        N = null, o.currentViewRefetchStatus = "idle";
        return;
      }
      await cr(p, V, T.processedRanges), o.searchQuery ? await fn(o.searchPage, o.searchQuery) : o.loadedPosts.length === 0 || !o.hasNewerLocal ? await pe({ skipTotalCountRefresh: !0 }) : await Pe({ skipTotalCountRefresh: !0 }), c = !0;
      let re = null;
      if (N === K && t() && e() === p && n() === P && o.loadedPosts.length > 0 && (re = await dt.repairCurrentView({
        ownerPubkeyHex: p,
        rxNostr: P,
        visiblePosts: o.loadedPosts,
        isActive: () => N === K && t() && e() === p && n() === P
      }), N !== K || re.status === "cancelled" || !t()) || N !== K || !t() || e() !== p || n() !== P)
        return;
      o.searchQuery || v({ force: !0 }), N = null, o.currentViewRefetchStatus = "idle", T.addedCount > 0 ? (o.currentViewRefetchMessageKey = "postHistory.repairAdded", o.currentViewRefetchMessageValues = {
        count: T.addedCount,
        processedRangeCount: T.processedRangeCount,
        updatedCount: T.updatedCount
      }) : (re?.savedDirectReplyCount ?? 0) > 0 ? (o.currentViewRefetchMessageKey = "postHistory.repairChildInteractionsAdded", o.currentViewRefetchMessageValues = {
        count: re?.savedDirectReplyCount ?? 0
      }) : T.fetchFailed ? (o.currentViewRefetchMessageKey = "postHistory.repairFetchFailed", o.currentViewRefetchMessageValues = null) : T.hadUnfinishedRanges || re?.status === "partial" ? (o.currentViewRefetchMessageKey = "postHistory.repairPartialFailure", o.currentViewRefetchMessageValues = null) : (o.currentViewRefetchMessageKey = "postHistory.repairNoChanges", o.currentViewRefetchMessageValues = {
        processedRangeCount: T.processedRangeCount,
        updatedCount: T.updatedCount
      }), ua();
    } catch {
      if (N !== K)
        return;
      c && !o.searchQuery && t() && e() === p && n() === P && v({ force: !0 }), N = null, o.currentViewRefetchStatus = "idle", o.currentViewRefetchMessageKey = "postHistory.repairFetchFailed", o.currentViewRefetchMessageValues = null, ua();
    }
  }
  async function js() {
    const p = e();
    return p ? (Wt(), dr(), (await Promise.allSettled([
      Ge.deleteLocalHistoryForPubkey(p),
      ro.clearForPubkey(p),
      Ts.clearForPubkey(p)
    ])).some((k) => k.status === "rejected") ? (t() && e() === p && (Dr(), Hn({ known: o.totalCountKnown, status: "failed" })), br(), o.currentViewRefetchMessageKey = "postHistory.deleteLocalHistoryFailed", o.currentViewRefetchMessageValues = null, !1) : (Hd(p), Vy(p), ha(), o.currentViewRefetchMessageKey = "postHistory.deleteLocalHistorySuccess", o.currentViewRefetchMessageValues = null, Ld(p, {
      currentPage: 1,
      searchPage: 1,
      searchInput: "",
      searchQuery: ""
    }), Ti(p, {
      ...Bo,
      totalCount: 0,
      totalCountKnown: !0,
      totalCountFailed: !1
    }), !0)) : !1;
  }
  async function ja() {
    ct();
    const p = e(), P = B(o.loadedPosts[0]);
    if (!p || !P || typeof o.visibleUntil != "number")
      return !1;
    const k = ++O, V = await Ge.getSparseChunk({
      pubkeyHex: p,
      visibleUntil: o.visibleUntil,
      cursor: P,
      direction: "newer",
      limit: g
    });
    if (!t() || k !== O)
      return !1;
    if (V.length === 0)
      return o.hasNewerLocal = !1, !1;
    const K = j([...V, ...o.loadedPosts]);
    return o.loadedPosts = K, await W(p, K, k), !0;
  }
  async function Ka() {
    if (ct(), !!e()) {
      if (o.searchQuery) {
        await fn(o.searchPage, o.searchQuery);
        return;
      }
      if (o.sparseSource === "saved") {
        const p = e();
        if (!p) return;
        const P = await ln(p);
        v({ force: !0 }), await W(p), await H(p, P);
        return;
      }
      await pe({ forceTotalCount: !0 });
    }
  }
  function Ds(p, P, k) {
    const V = (K) => K.map((c) => c.eventId === p ? { ...c, deletedAt: P, deletionEventId: k } : c);
    o.loadedPosts = V(o.loadedPosts), o.searchPosts = V(o.searchPosts);
  }
  function oa(p) {
    const P = e(), k = Ur(P);
    if (!P || !k)
      return;
    const V = ++we;
    w(Te, "loading"), p().then(() => {
      t() && e() === P && Ae === k && V === we && w(Te, "ready");
    }).catch(() => {
      t() && e() === P && Ae === k && V === we && w(Te, "failed");
    });
  }
  return Ue(() => {
    const p = Ur(e());
    p !== ce && (ce = p, Yn(), w(G, null), de = p, Wt(), dr(), na(), zn(), br(), Mn(), xn(), dt.resetOlderRevealRepairContext(), fe = !1, se = !1, Ae = null, we += 1, w(Te, "idle"));
  }), Ue(() => {
    const p = n();
    p !== ue && (ue = p, dt.resetOlderRevealRepairContext());
  }), Ue(() => {
    Sr();
  }), Ue(() => {
    ea();
  }), Ue(() => {
    t() || Ea();
  }), Ue(() => {
    if (t())
      return () => {
        Wt();
      };
  }), Ue(() => () => {
    dt.dispose();
  }), Ue(() => {
    if (!t()) {
      Mn();
      return;
    }
    return hn(), () => {
      Mn();
    };
  }), Ue(() => {
    if (!t())
      return;
    const p = o.searchInput.trim();
    p !== o.searchQuery && w(te, "loading");
    const P = setTimeout(
      () => {
        o.searchQuery = p;
      },
      y
    );
    return () => {
      clearTimeout(P);
    };
  }), Ue(() => {
    if (!t() || a(he))
      return;
    const p = Ur(e()) ?? "";
    if (se && Ae === p)
      return;
    if (se = !0, Ae = p, de === p) {
      de = null, oa(pe);
      return;
    }
    const P = He(), k = xh(e());
    if (Le(k, P)) {
      s(), oa(pe);
      return;
    }
    if (Fe(P)) {
      oa(() => ke(P, k));
      return;
    }
    if (P) {
      oa(() => ut(P));
      return;
    }
    oa(pe);
  }), Ue(() => {
    t() || Yn();
  }), Ue(() => {
    if (!t() || !a($) || a(ee) !== Ur(e()))
      return;
    const p = a($e);
    if (p.length === 0 || !dd.canUsePersistentCache())
      return;
    const P = Sh(p);
    if (P.length === 0)
      return;
    const k = [...P].sort().join("\0");
    k !== ye && (ye = k, Promise.resolve(dd.prefetchCachedMediaDescriptors(P)).catch(() => {
    }));
  }), Ns(() => {
    O += 1, ve += 1, we += 1, w(Te, "idle"), w(ee, null), w($, !1);
  }), Ue(() => {
    if (t()) {
      if (!o.searchQuery) {
        const p = ie !== "";
        if (Yn(), ve += 1, w(Se, !1), w(te, "idle"), eo.clearCache?.(), ie = "", q = !1, o.searchPage !== 1) {
          if (o.searchPage = 1, p) {
            const P = e();
            P && Fn(P, () => on(P, O), () => o.loadedPosts.length > 0);
          }
          return;
        }
        if (o.searchPosts = [], o.searchTotalCount = 0, o.searchHasNext = !1, p) {
          const P = e();
          P && Fn(P, () => on(P, O), () => o.loadedPosts.length > 0);
        }
        return;
      }
      if (o.searchQuery !== ie) {
        Yn(), ie === "" && o.searchPosts.length === 0 && (o.searchPosts = o.loadedPosts), ie = o.searchQuery, o.searchPage = 1, q = !0, it(1, o.searchQuery);
        return;
      }
      if (ie = o.searchQuery, !q) {
        q = !0;
        const p = e(), P = o.searchQuery, k = ++ve, V = o.searchPosts.length > 0;
        p && V && Fn(p, () => ur(k, P, p), () => o.searchPosts.length > 0), fn(o.searchPage, P, k);
      }
    }
  }), {
    state: o,
    get isSearchMode() {
      return a(he);
    },
    get posts() {
      return a($e);
    },
    get displayTotalCount() {
      return a(at);
    },
    get displayPage() {
      return a(ae);
    },
    get totalPages() {
      return a(gt);
    },
    get canGoPrevious() {
      return a(tt);
    },
    get canGoFirst() {
      return a(st);
    },
    get canGoNext() {
      return a(nt);
    },
    get canGoLast() {
      return a(zt);
    },
    get showPaging() {
      return a(Xe);
    },
    get canLoadOlder() {
      return a(je);
    },
    get canLoadNewer() {
      return a(et);
    },
    get canReturnToLatest() {
      return a(Ye);
    },
    get canJumpToOldest() {
      return a(kt);
    },
    get canFetchOlderFromRelays() {
      return a(Me);
    },
    get isFetchingOlderFromRelays() {
      return a(Qt);
    },
    get isFetchingFromRelays() {
      return a(or);
    },
    get isRefetchingAroundCurrentView() {
      return a(xe);
    },
    get showLocalExhaustedState() {
      return a(ir);
    },
    get showSavedPostsBoundary() {
      return a($t);
    },
    get isShowingSavedOlderPosts() {
      return o.listingMode === "sparse" && o.sparseSource === "saved";
    },
    get visibleNewestCreatedAt() {
      return a(jn);
    },
    get visibleOldestCreatedAt() {
      return a(yt);
    },
    get visiblePostCount() {
      return a(an);
    },
    get latestOlderBackfillUiResult() {
      return o.latestOlderBackfillUiResult;
    },
    get syncStatus() {
      return o.syncStatus;
    },
    get syncStatusMessageKey() {
      return a(Pn);
    },
    get showSyncLoader() {
      return a(un);
    },
    get showStatusLoader() {
      return a(Tn);
    },
    get isSearchPageLoading() {
      return a(Se);
    },
    get searchResultStatus() {
      return a(te);
    },
    get initialLocalLoadStatus() {
      return a(Te);
    },
    get canRefetchAroundCurrentView() {
      return a(sn);
    },
    get currentViewRefetchStatusMessageKey() {
      return a(Kn);
    },
    get currentViewRefetchStatusMessageValues() {
      return a(lr);
    },
    prepareForClose: Rr,
    cancelCurrentSync: Wt,
    cancelCurrentViewRefetch: dr,
    loadOlder: Us,
    loadNewer: Es,
    returnToLatest: Va,
    showSavedOlderPosts: hs,
    jumpToOldest: fs,
    jumpToCreatedAt: Pr,
    fetchOlderFromRelays: Vs,
    goFirstPage: _s,
    goPreviousPage: cs,
    goToNextPage: Ua,
    goToLastPage: us,
    refetchAroundCurrentView: As,
    resetSearchState: Sn,
    refreshAfterLocalImport: Ka,
    deleteLocalHistory: js,
    patchDeletedPost: Ds
  };
}
const uo = /* @__PURE__ */ new Map();
function rd(t) {
  if (typeof t != "string")
    return null;
  const e = t.trim();
  return e.length > 0 ? e : null;
}
function Uu(t) {
  return typeof t == "string" ? t.trim() : "";
}
function ad(t) {
  const e = rd(t.pubkeyHex);
  if (!e)
    return null;
  const n = t.mode === "search" ? Uu(t.searchQuery) : "";
  return `${e}:${t.mode}:${n}`;
}
function Ky(t) {
  const e = ad(t);
  if (!e)
    return null;
  const n = uo.get(e);
  return n ? {
    ...n,
    anchor: { ...n.anchor }
  } : null;
}
function Yy(t) {
  const e = ad(t), n = rd(t.pubkeyHex);
  !e || !n || uo.set(e, {
    pubkeyHex: n,
    mode: t.mode,
    searchQuery: t.mode === "search" ? Uu(t.searchQuery) : "",
    anchor: { ...t.anchor },
    savedAt: t.savedAt ?? Date.now()
  });
}
function zd(t) {
  const e = rd(t.pubkeyHex);
  if (e) {
    if (t.mode) {
      const n = ad({
        pubkeyHex: e,
        mode: t.mode,
        searchQuery: t.searchQuery
      });
      n && uo.delete(n);
      return;
    }
    for (const n of uo.keys())
      n.startsWith(`${e}:`) && uo.delete(n);
  }
}
const so = 1, zy = 2, Qy = 12;
function Wy(t) {
  return `${t.pubkeyHex}:${t.mode}:${t.searchQuery}:${t.anchor.eventId}:${t.savedAt}`;
}
function Jy({
  getShow: t,
  getPubkeyHex: e,
  getPosts: n,
  getLocale: r,
  getContainer: i,
  getIsSearchMode: s,
  getSearchQuery: l
}) {
  let u = be(null), h = be(!0), b = be(!0), g = null, y = be(null), x = !1, f = null;
  function _() {
    return s() ? "search" : "normal";
  }
  function C() {
    return s() ? l() : "";
  }
  function m() {
    return Ky({
      pubkeyHex: e(),
      mode: _(),
      searchQuery: C()
    });
  }
  function o(N) {
    return !!N && n().some((I) => I.eventId === N.anchor.eventId);
  }
  function O() {
    const N = we();
    N && Yy({
      pubkeyHex: e(),
      mode: _(),
      searchQuery: C(),
      anchor: N
    });
  }
  function z() {
    zd({
      pubkeyHex: e(),
      mode: _(),
      searchQuery: C()
    }), w(y, null), f = null;
  }
  function $() {
    zd({ pubkeyHex: e() }), w(y, null), f = null;
  }
  function ee() {
    const N = i();
    N && (N.scrollTop = 0, F(), X(), fe());
  }
  function ye() {
    const N = i();
    N && (N.scrollTop = N.scrollHeight, F(), X(), fe());
  }
  function F() {
    const N = i();
    if (!N) {
      w(h, !0);
      return;
    }
    w(h, N.scrollTop <= so);
  }
  function X() {
    const N = i();
    if (!N) {
      w(b, !0);
      return;
    }
    const I = N.scrollHeight - N.clientHeight - N.scrollTop;
    w(b, I <= zy);
  }
  function ve() {
    const N = i();
    if (!N)
      return null;
    const I = N.getBoundingClientRect(), Q = I.top + Qy, ne = Array.from(N.querySelectorAll("[data-post-history-event-id]"));
    let ue = null;
    for (const ie of ne) {
      const q = Number(ie.dataset.postHistoryPostedAt);
      if (!Number.isFinite(q))
        continue;
      const Oe = ie.getBoundingClientRect();
      if (Oe.bottom > I.top + so && Oe.top < I.bottom - so) {
        if (Oe.top <= Q && Oe.bottom > Q)
          return q;
        ue === null && (ue = q);
      }
    }
    return ue;
  }
  function Se() {
    if (!t() || n().length === 0) {
      w(u, null);
      return;
    }
    const N = ve();
    w(
      u,
      N === null ? null : kh(N, r()),
      !0
    );
  }
  function te() {
    g !== null && (cancelAnimationFrame(g), g = null);
  }
  function fe() {
    t() && (te(), g = requestAnimationFrame(() => {
      g = null, Se();
    }));
  }
  function se() {
    F(), X(), fe();
  }
  function Ae() {
    Za().then(() => {
      t() && ee();
    });
  }
  function Te() {
    Za().then(() => {
      t() && ye();
    });
  }
  function we() {
    const N = i();
    if (!N)
      return null;
    const I = N.getBoundingClientRect(), Q = Array.from(N.querySelectorAll("[data-post-history-event-id]"));
    for (const ne of Q) {
      const ue = ne.dataset.postHistoryEventId;
      if (!ue)
        continue;
      const ie = ne.getBoundingClientRect();
      if (ie.bottom > I.top + so && ie.top < I.bottom - so)
        return { eventId: ue, offsetTop: ie.top - I.top };
    }
    return null;
  }
  function ce(N) {
    const I = i();
    if (!N || !t() || !I)
      return !1;
    R();
    const Q = Array.from(I.querySelectorAll("[data-post-history-event-id]")).find((q) => q.dataset.postHistoryEventId === N.eventId);
    if (!Q)
      return !1;
    const ne = I.getBoundingClientRect(), ie = Q.getBoundingClientRect().top - ne.top;
    return I.scrollTop += ie - N.offsetTop, fe(), !0;
  }
  function G(N, I) {
    const Q = i();
    return Q ? Array.from(Q.querySelectorAll("[data-post-history-thread-anchor-event-id]")).find((ne) => ne.dataset.postHistoryThreadAnchorScopeId === N && ne.dataset.postHistoryThreadAnchorEventId === I) ?? null : null;
  }
  function de(N, I) {
    const Q = G(N, I);
    return Q ? {
      scopeEventId: N,
      eventId: I,
      top: Q.getBoundingClientRect().top
    } : null;
  }
  function Ie(N) {
    const I = i();
    if (!N || !t() || !I)
      return !1;
    R();
    const Q = G(N.scopeEventId, N.eventId);
    if (!Q)
      return !1;
    const ne = Q.getBoundingClientRect().top - N.top;
    return Math.abs(ne) < 0.5 || (I.scrollTop += ne, fe(), F(), X()), !0;
  }
  async function Ce(N, I, Q) {
    const ne = de(N, I), ue = Q();
    await Za(), Ie(ne), await ue, await Za(), Ie(ne);
  }
  return Ue(() => {
    if (!t()) {
      x = !1, w(y, null), f = null, w(u, null), te();
      return;
    }
    x || (x = !0, w(y, m(), !0), f = null);
  }), Ue(() => {
    if (!t() || !o(a(y)))
      return;
    const N = a(y), I = Wy(N);
    f !== I && Za().then(() => {
      !t() || a(y) !== N || (ce(N.anchor), f = I, w(y, null));
    });
  }), Ue(() => {
    if (!t()) {
      w(u, null), te();
      return;
    }
    return i(), n(), r(), Za().then(() => {
      t() && (Se(), F(), X());
    }), () => {
      te();
    };
  }), {
    get currentMonthLabel() {
      return a(u);
    },
    get isHistoryScrolledToTop() {
      return a(h);
    },
    get isHistoryScrolledToBottom() {
      return a(b);
    },
    readCurrentSessionScrollState: m,
    saveCurrentSessionScrollAnchor: O,
    clearCurrentSessionScrollAnchor: z,
    clearAllSessionScrollAnchorsForCurrentPubkey: $,
    handleHistoryScroll: se,
    resetHistoryScrollSoon: Ae,
    resetHistoryScrollToBottomSoon: Te,
    captureHistoryScrollAnchor: we,
    restoreHistoryScrollAnchor: ce,
    preserveThreadParentToggleScroll: Ce
  };
}
const Qd = 100, Gy = 86400, Zy = 6e3, Wd = 8;
function Xy(t) {
  return Number.isFinite(t) ? Math.max(1, Math.trunc(t ?? Qd)) : Qd;
}
function em(t) {
  return Array.from(t.values()).map((e) => ({
    parentEventId: e.parentEventId,
    event: e.event,
    relayUrls: Array.from(e.relayUrls).sort((n, r) => n.localeCompare(r))
  })).sort((e, n) => e.event.created_at !== n.event.created_at ? e.event.created_at - n.event.created_at : e.event.id.localeCompare(n.event.id));
}
function tm(t) {
  if (t.parents) {
    const n = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Set();
    for (const i of t.parents) {
      if (!i.eventId || r.has(i.eventId))
        continue;
      const s = n.get(i.eventId);
      if (s && (s.eventKind !== i.eventKind || s.createdAt !== i.createdAt || s.channelEventId && i.channelEventId && s.channelEventId !== i.channelEventId)) {
        n.delete(i.eventId), r.add(i.eventId);
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
class nm {
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
    const r = rl(), i = tm(n), s = new Map(i.map((z) => [z.eventId, z])), l = i.map((z) => z.eventId), u = this.resolveRelayUrls(
      [
        ...n.relayHints ?? [],
        ...i.flatMap((z) => z.relayHints)
      ],
      n.relayConfig,
      n.relayLimit
    ), h = Xy(n.limit), b = Math.max(
      0,
      Math.trunc(Math.min(...i.map((z) => z.createdAt))) - Gy
    ), g = /* @__PURE__ */ new Map();
    let y = !1, x, f, _;
    const C = () => {
      f !== void 0 && (this.clearTimeoutFn(f), f = void 0), x?.unsubscribe?.(), x = void 0;
    }, m = (z) => ({
      status: z === "failed" && g.size > 0 ? "partial" : z,
      events: em(g),
      fetchedAt: this.now(),
      relayUrls: u
    }), o = (z) => ($) => {
      y || (y = !0, C(), z(m($)));
    };
    return {
      promise: new Promise((z) => {
        const $ = o(z);
        _ = $;
        try {
          if (l.length === 0) {
            $("success");
            return;
          }
          x = al(e, r, {
            on: u.length > 0 ? { relays: u } : { defaultReadRelays: !0 }
          }).subscribe({
            next: (ee) => {
              this.handlePacket(g, s, ee);
            },
            complete: () => $("success"),
            error: (ee) => {
              this.console.error("post_history_reply_fetch_error", ee), $("failed");
            }
          }), r.emit({
            kinds: Array.from(new Set(i.map((ee) => ee.eventKind))).sort(),
            "#e": l,
            since: b,
            limit: h
          }), r.over(), f = this.setTimeoutFn(() => {
            this.console.warn("post_history_reply_fetch_timeout", l.join(",")), $("failed");
          }, n.timeoutMs ?? Zy);
        } catch (ee) {
          this.console.error("post_history_reply_fetch_request_error", ee), $("failed");
        }
      }),
      cancel: () => {
        _?.("cancelled");
      }
    };
  }
  handlePacket(e, n, r) {
    const i = r.event;
    if (!i?.id || i.kind !== 1 && i.kind !== 42)
      return;
    const s = La(i).parentId, l = s ? n.get(s) : null;
    if (!l || !ts({ child: i, parent: l }).valid)
      return;
    const u = wn.sanitizeExternalRelayUrls(
      typeof r.from == "string" ? [r.from] : [],
      { limit: 1 }
    )[0], h = e.get(i.id);
    if (!h) {
      e.set(i.id, {
        parentEventId: l.eventId,
        event: i,
        relayUrls: new Set(u ? [u] : [])
      });
      return;
    }
    if (!Ac(h.event, i)) {
      this.console.warn("post_history_reply_fetch_packet_conflict", i.id);
      return;
    }
    u && h.relayUrls.add(u);
  }
  resolveRelayUrls(e, n, r) {
    const i = Number.isFinite(r) ? Math.max(1, Math.trunc(r ?? Wd)) : Wd, s = n ? [
      ...wn.extractReadRelays(n),
      ...wn.extractWriteRelays(n)
    ] : [], l = wn.sanitizeExternalRelayUrls([
      ...e ?? [],
      ...s
    ], { limit: i });
    return l.length > 0 ? l : wn.sanitizeExternalRelayUrls(
      sl,
      { limit: i }
    );
  }
}
const rm = new nm(), am = "postHistoryDirectReplyFetchMetadata:", Vu = 1;
function Mi(t) {
  return am + t;
}
function qo(t) {
  return typeof t == "number" && Number.isFinite(t);
}
function sm(t) {
  if (!t || typeof t != "object")
    return !1;
  const e = t;
  return typeof e.parentEventId == "string" && (e.completeness === "complete" || e.completeness === "partial") && qo(e.fetchedAt) && qo(e.requestStartedAt) && e.schemaVersion === Vu;
}
function om(t, e) {
  return t ? t.requestStartedAt > e.requestStartedAt ? !0 : t.requestStartedAt === e.requestStartedAt && t.completeness === "complete" && e.completeness === "partial" : !1;
}
class im {
  constructor(e = ll, n = Date.now) {
    this.db = e, this.now = n;
  }
  async get(e) {
    if (!e)
      return null;
    const n = await this.db.meta.get(Mi(e));
    return !n || !sm(n.value) ? null : {
      ...n.value,
      updatedAt: n.updatedAt
    };
  }
  async save(e) {
    return !e.parentEventId || !qo(e.fetchedAt) || !qo(e.requestStartedAt) ? null : this.db.transaction("rw", this.db.meta, async () => {
      const n = await this.get(e.parentEventId);
      if (om(n, e))
        return n;
      const r = this.now(), i = {
        parentEventId: e.parentEventId,
        completeness: e.completeness,
        fetchedAt: e.fetchedAt,
        requestStartedAt: e.requestStartedAt,
        schemaVersion: Vu
      };
      return await this.db.meta.put({
        key: Mi(e.parentEventId),
        value: i,
        updatedAt: r
      }), {
        ...i,
        updatedAt: r
      };
    });
  }
  async clear(e) {
    e && await this.db.meta.delete(Mi(e));
  }
}
const lm = new im(), Gi = {
  totalCount: 0,
  groups: []
};
function dm(t) {
  if (!dl(t.content))
    return;
  const e = Mc(t.content);
  if (e)
    return Oc(t.tags ?? []).get(e)?.url;
}
function cm(t) {
  if (t.length === 0)
    return Gi;
  const e = [], n = /* @__PURE__ */ new Map();
  let r = 0;
  for (const i of t) {
    if (i.kind !== 7)
      continue;
    r += 1;
    const s = dm(i), l = n.get(i.content);
    if (l === void 0) {
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
    const u = e[l], h = u.emojiUrl ?? s;
    e[l] = {
      ...u,
      count: u.count + 1,
      ...h ? { emojiUrl: h } : {}
    };
  }
  return r === 0 ? Gi : {
    totalCount: r,
    groups: e
  };
}
const Zi = {
  totalCount: 0,
  groups: []
}, um = new Intl.Segmenter(void 0, {
  granularity: "grapheme"
});
function hm(t) {
  if (!dl(t.content))
    return;
  const e = Mc(t.content);
  if (e)
    return Oc(t.tags ?? []).get(e)?.url;
}
function fm(t) {
  const e = t.trim();
  if (!e)
    return "";
  if (dl(e))
    return e;
  const n = um.segment(e)[Symbol.iterator]().next();
  return n.done ? "" : n.value.segment;
}
function vm(t, e) {
  return t ? t instanceof Map ? t.get(e) ?? null : t[e] ?? null : null;
}
function pm(t) {
  try {
    return xc(Th(t), 9, 4);
  } catch {
    return t.slice(0, 12);
  }
}
function gm(t) {
  return t.profile?.displayName?.trim() || t.profile?.name?.trim() || pm(t.pubkey);
}
async function ym(t, e = Fc) {
  return t ? e.getReactionRecords(t) : [];
}
function mm(t, e) {
  if (t.length === 0)
    return Zi;
  const n = [], r = /* @__PURE__ */ new Map();
  let i = 0;
  for (const s of t) {
    if (s.kind !== 7)
      continue;
    i += 1;
    const l = fm(s.content);
    if (!l)
      continue;
    const u = {
      eventId: s.eventId,
      pubkey: s.authorPubkey,
      profile: vm(e, s.authorPubkey),
      createdAt: s.createdAt
    }, h = r.get(l), b = hm(s);
    if (h === void 0) {
      r.set(l, n.length), n.push({
        content: l,
        count: 1,
        ...b ? { emojiUrl: b } : {},
        reactors: [u]
      });
      continue;
    }
    const g = n[h], y = g.emojiUrl ?? b;
    n[h] = {
      ...g,
      count: g.count + 1,
      ...y ? { emojiUrl: y } : {},
      reactors: [...g.reactors, u]
    };
  }
  return i === 0 ? Zi : {
    totalCount: i,
    groups: n
  };
}
function bm() {
  let t = 0, e = 0;
  const n = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
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
      i.get(s)?.cancel(), i.set(s, l);
    },
    deleteDeletionFetchTask(s) {
      i.delete(s);
    },
    cancelAndClearFetchTasks() {
      r.forEach((s) => s.cancel()), i.forEach((s) => s.cancel()), r.clear(), i.clear();
    }
  };
}
function Cm(t = {}) {
  const e = t.setTimeoutFn ?? ((s, l) => setTimeout(s, l)), n = t.clearTimeoutFn ?? ((s) => clearTimeout(s)), r = /* @__PURE__ */ new Map();
  function i(s) {
    const l = r.get(s);
    l && (n(l), r.delete(s));
  }
  return {
    schedule(s, l, u = 400) {
      i(s);
      const h = e(() => {
        r.delete(s), l();
      }, u);
      r.set(s, h);
    },
    clear: i,
    clearAll() {
      r.forEach((s) => n(s)), r.clear();
    }
  };
}
function wm(t, e) {
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
function Cs(t, e = {}) {
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
function Jd(t, e) {
  return {
    ...t,
    loadingChildren: e.showInitialLoading,
    revalidatingChildren: !e.showInitialLoading,
    visibleChildren: e.prefetchOnly ? t.visibleChildren : t.visibleChildren || e.showInitialLoading,
    childrenError: null
  };
}
function lo(t, e = {}) {
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
function Uo(t, e) {
  return {
    ...t,
    loadingChildren: !1,
    revalidatingChildren: !1,
    visibleChildren: t.visibleChildren,
    childrenError: e.nextError
  };
}
function Pm(t) {
  return t.status === "deleted" ? "deleted" : t.status === "not-found" ? "not-found" : t.status === "resolved" && t.event ? "resolved" : "failed";
}
function xm(t) {
  return t.nextRecordsLength > 0 ? "resolved" : t.resultEventsLength > 0 ? "deleted" : "not-found";
}
function Sm(t) {
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
        ...Cs(e, {
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
        ...Cs(n, {
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
function Im(t) {
  const e = () => {
    t.updateExpansion((n) => ({
      ...lo(n, {
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
function Rm(t) {
  t.updateExpansion((e) => ({
    ...e,
    loadingParent: !1,
    revalidatingParent: !1,
    visibleParent: e.visibleParent,
    parentError: t.showInitialLoading ? t.errorCode : e.parentError,
    showParentLoadingIndicator: !1
  }));
}
function ju(t) {
  t.updateExpansion((e) => ({
    ...Uo(e, {
      nextError: t.showInitialLoading && !t.prefetchOnly ? t.errorCode ?? "fetch_failed" : e.childrenError
    })
  }));
}
function Ku(t) {
  return typeof t.lastFetchedAt != "number" ? !0 : (t.now ?? Date.now()) - t.lastFetchedAt >= t.ttlMs;
}
function _m(t) {
  return !t.displayedCached || t.force ? !1 : !Ku({
    lastFetchedAt: t.lastFetchedAt,
    ttlMs: t.ttlMs,
    now: t.now
  });
}
function Em(t) {
  const e = _m(t);
  return {
    skipRevalidate: e,
    shouldShowInitialLoading: !t.displayedCached,
    shouldPrefetchReplyCountsOnSkip: e && !t.prefetchOnly
  };
}
function Am(t) {
  return !t.loading && !t.revalidating ? !1 : (t.onInFlight(), t.loading && t.onLoadingInFlight?.(), !0);
}
function Gd(t) {
  return t.hasVisibleData ? Ku({
    lastFetchedAt: t.lastFetchedAt,
    ttlMs: t.ttlMs,
    now: t.now
  }) : !1;
}
async function Zd(t) {
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
async function Xd(t) {
  let e = !1;
  const n = () => {
    const i = t.isActive();
    return !i && !e && (e = !0, t.onInactive?.()), i;
  }, r = /* @__PURE__ */ new Map();
  if (t.prepareItem)
    for (const i of t.items)
      r.set(i, t.prepareItem(i));
  try {
    await t.run({ ensureActive: n }), n() && t.completeBatch?.(!0);
  } catch (i) {
    n() && (t.completeBatch?.(!1), await t.onError?.(i));
  } finally {
    if (t.cleanupItem)
      for (const i of t.items)
        r.has(i) && t.cleanupItem(i, r.get(i));
    t.cleanup?.();
  }
}
async function ec(t) {
  const e = t.strategies[t.status] ?? t.fallback;
  e && await e();
}
async function Dm(t) {
  if (t.skipRevalidate)
    return;
  const e = t.runRevalidate({
    showInitialLoading: t.shouldShowInitialLoading
  });
  t.awaitWhenInitialLoading && t.shouldShowInitialLoading && await e;
}
async function km(t) {
  const e = Em(t);
  return e.shouldPrefetchReplyCountsOnSkip && t.onSkipPrefetchReplyCounts?.(), await Dm({
    skipRevalidate: e.skipRevalidate,
    shouldShowInitialLoading: e.shouldShowInitialLoading,
    awaitWhenInitialLoading: t.awaitWhenInitialLoading,
    runRevalidate: t.runRevalidate
  }), e;
}
async function tc(t) {
  if (Am({
    loading: t.loading,
    revalidating: t.revalidating,
    onInFlight: t.onInFlight,
    onLoadingInFlight: t.onLoadingInFlight
  }) || t.shouldHandleLoadedState && await t.handleLoadedState())
    return;
  t.prepareFreshLoadState();
  const e = await t.displayCachedForFreshLoad();
  await km({
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
function Ga(t) {
  return wn.sanitizeExternalRelayUrls(t, { limit: 8 });
}
function Tm(t) {
  return Array.from(new Set(t));
}
const Mm = 20, Om = 12, Fm = 2, nc = 4, Lm = 4, rc = 300 * 1e3;
class Yu extends Error {
}
function ac(t) {
  if (t === "failed")
    throw new Error("post_history_reply_fetch_failed");
  if (t === "cancelled")
    throw new Yu();
}
function Hm(t) {
  return (e) => {
    if (e instanceof Yu) {
      t.updateExpansion((n) => ({
        ...Uo(n, { nextError: n.childrenError })
      }));
      return;
    }
    ju({ ...t, errorCode: "fetch_failed" });
  };
}
function sc(t) {
  return t === "partial" ? "partial" : "complete";
}
function Oi(t) {
  return t?.completeness === "complete" ? t.fetchedAt : null;
}
const Io = 300 * 1e3;
let $m = 0;
function Nm(t, e) {
  const n = new Set(t.map((r) => r.eventId));
  return (e && e.length > 0 ? Array.from(new Set(e)) : Array.from(n)).filter((r) => n.has(r));
}
function Bm(t) {
  const e = Oa({
    event: t.parentNode.event,
    relayHints: t.parentNode.relayUrls
  });
  return !!e && ts({
    child: ko(t.record),
    parent: e
  }).valid;
}
function oc(t) {
  if (!t.parentNode)
    return null;
  const e = Oa({
    event: t.parentNode.event,
    relayHints: t.parentNode.relayUrls
  });
  return e && ts({ child: t.childNode.event, parent: e }).valid ? t.parentNode : null;
}
function qm({
  getShow: t,
  getPubkeyHex: e,
  getRxNostr: n,
  getRelayConfig: r,
  postHistoryRepositoryImpl: i = Ge,
  directReplyRecordsAdapterImpl: s = Mh,
  reactionRecordsAdapterImpl: l = Fc,
  childInteractionsRepositoryImpl: u = ol,
  deletionRequestsRepositoryImpl: h = $s,
  directReplyFetchMetadataRepositoryImpl: b = lm,
  profileSyncCoordinator: g = void 0,
  contextFetchService: y = Jl,
  replyFetchService: x = rm,
  deletionFetchService: f = Jo,
  relatedTargetResolver: _ = void 0
}) {
  const C = g ?? Gl({ getShow: t, getRxNostr: n }), m = !g, o = _ ?? Zl({
    getShow: t,
    getRxNostr: n,
    getRelayConfig: r,
    postHistoryRepositoryImpl: i,
    contextFetchService: y,
    deletionRequestsRepositoryImpl: h,
    deletionFetchService: f,
    profileSyncCoordinator: C
  }), O = !_, z = `post-history-thread-graph-parent:${++$m}`;
  let $ = be({}), ee = be({}), ye = be({}), F = be({}), X = be({}), ve = be(0);
  const Se = Cm(), te = /* @__PURE__ */ new Set(), fe = /* @__PURE__ */ new Set(), se = /* @__PURE__ */ new Set(), Ae = /* @__PURE__ */ new Set();
  let Te = be({}), we = be({}), ce = be({}), G = be({});
  const de = bm();
  function Ie(d) {
    const v = a(we)[d] ?? [];
    w(G, {
      ...a(G),
      [d]: mm(v, a(ce))
    });
  }
  function Ce(d, v) {
    w(Te, {
      ...a(Te),
      [d]: cm(v)
    });
  }
  function N(d, v) {
    w(we, {
      ...a(we),
      [d]: v
    }), Ie(d);
  }
  function I(d, v) {
    w(ce, { ...a(ce), [d]: v });
    for (const [H, B] of Object.entries(a(we)))
      B.some((j) => j.authorPubkey === d) && Ie(H);
  }
  function Q(d) {
    return a(Te)[d] ?? Gi;
  }
  function ne(d) {
    return a(G)[d] ?? Zi;
  }
  function ue(d, v) {
    return a(F)[bn(d, v)] ?? kd();
  }
  function ie(d, v, H) {
    const B = bn(d, v);
    w(F, {
      ...a(F),
      [B]: H(a(F)[B] ?? kd())
    });
  }
  function q(d) {
    const v = xo(d), H = Pi(a($)[v.eventId], v);
    return w($, { ...a($), [H.eventId]: H }), H;
  }
  function Oe(d, v) {
    v && w(ee, { ...a(ee), [d]: v });
  }
  function Ze(d, v) {
    const H = a(ye)[d] ?? [], B = eg(Tm([...H, ...v]).filter((j) => j !== d && !Qt(j)), a($));
    w(ye, { ...a(ye), [d]: B });
  }
  function dt(d) {
    const v = zi(d);
    return xo({
      event: v,
      relayUrls: Ga([
        ...d.relayHints,
        ...d.acceptedRelays,
        ...d.fetchedRelays ?? []
      ]),
      sources: ["anchor", "history-record"]
    });
  }
  function he(d) {
    const v = dt(d), H = q({
      event: v.event,
      relayUrls: v.relayUrls,
      sources: v.sources
    });
    return Oe(H.eventId, H.parentEventId), $e(H.authorPubkey, H.relayUrls), H;
  }
  function xe(d, v) {
    if (!d || !v)
      return;
    let H = !1;
    const B = { ...a($) };
    for (const [j, oe] of Object.entries(a($)))
      oe.authorPubkey === d && (B[j] = Pi(oe, { ...oe, profile: v }), H = !0);
    H && w($, B);
  }
  function $e(d, v = []) {
    const H = C.ensureProfile(d, v);
    xe(d, H);
  }
  const ae = C.subscribe((d, v) => {
    t() && (xe(d, v), I(d, v));
  });
  async function at(d) {
    const v = Ga(d.relayUrls ?? []), H = q({ ...d, relayUrls: v });
    return $e(d.event.pubkey, v), H;
  }
  function gt(d, v, H) {
    const B = Si.buildContext(d, v, H);
    return B ? Si.toDescriptor(B, z) : null;
  }
  function tt(d) {
    if (!d)
      return null;
    const v = o.getTargetSnapshot(d.eventId);
    if (v?.status !== "resolved" || !v.event)
      return d;
    const H = Ga([...d.relayUrls, ...v.relayHints]), B = v.profile ?? d.profile ?? null;
    return d.event === v.event && d.profile === B && qi(d.relayUrls, H) ? d : Pi(d, {
      ...d,
      event: v.event,
      relayUrls: H,
      profile: B
    });
  }
  function st(d, v) {
    return Si.getRelayHints(d, v);
  }
  function nt(d, v) {
    const H = La(v.event);
    return Ga([
      ...v.relayUrls,
      ...H.relayHints,
      ...d.relayHints,
      ...d.acceptedRelays,
      ...d.fetchedRelays ?? []
    ]);
  }
  function zt(d, v) {
    return wn.sanitizeExternalRelayUrls(
      [
        ...v.flatMap((H) => {
          const B = La(H.event);
          return [...H.relayUrls, ...B.relayHints];
        }),
        ...d.relayHints,
        ...d.acceptedRelays,
        ...d.fetchedRelays ?? []
      ],
      { limit: Lm }
    );
  }
  function Xe(d) {
    Se.clear(d);
  }
  function je(d, v) {
    const H = bn(d, v);
    Se.schedule(H, () => {
      const B = ue(d, v);
      !B.loadingParent || !B.visibleParent || ie(d, v, (j) => ({ ...j, showParentLoadingIndicator: !0 }));
    });
  }
  function et(d, v) {
    return (a(ye)[d] ?? []).map((B) => tt(a($)[B])).filter((B) => !!B).filter((B) => !Me(B.authorPubkey, B.eventId)).map((B) => ({
      event: B.event,
      profile: B.profile,
      relayUrls: [...B.relayUrls],
      isOwnReply: B.authorPubkey === v
    }));
  }
  function Ye(d) {
    return (a(ye)[d] ?? []).filter((v) => {
      const H = a($)[v];
      return H && !Me(H.authorPubkey, H.eventId);
    });
  }
  function jn(d, v, H) {
    return Ye(d).filter((B) => !v.includes(B) && !H.has(B));
  }
  function yt(d, v, H, B = [], j = 0, oe = /* @__PURE__ */ new Set()) {
    const W = tt(a($)[v]);
    if (!W || Me(W.authorPubkey, W.eventId) || B.includes(v) || oe.has(v))
      return null;
    oe.add(v);
    const pe = [...B, v], Pe = ue(d, v), Le = W.parentEventId, ke = Le ? B.includes(Le) : !1, He = Le ? oc({
      childNode: W,
      parentNode: tt(a($)[Le] ?? null)
    }) : null, Fe = Pe.visibleParent && He && !ke && j > -20 ? yt(d, He.eventId, H, pe, j - 1, oe) : null, ut = j < Mm ? jn(v, pe, oe) : [], ht = ut.length, Tt = Pe.visibleChildren && ht > 0, Xt = Tt ? ut.map((At) => yt(d, At, H, pe, j + 1, oe)).filter((At) => At !== null) : [];
    return {
      anchorEventId: d,
      node: W,
      parentTargetId: Le,
      parentNodeState: Fe,
      parentExpansion: Pe,
      parentAlreadyInPath: ke,
      repliesActionState: {
        status: Pe.loadingChildren ? "loading" : Pe.childrenError ? "failed" : Pe.loadedChildren ? "loaded" : "unloaded",
        visible: Tt,
        replies: ut,
        replyCount: ht,
        error: Pe.childrenError
      },
      replyNodeStates: Xt,
      isOwnReply: W.authorPubkey === H,
      depthFromAnchor: j,
      cycleDetected: !1
    };
  }
  function kt(d) {
    a(ve);
    const v = tt(a($)[d.eventId]) ?? dt(d), H = ue(d.eventId, d.eventId), B = e() ?? d.pubkeyHex, j = /* @__PURE__ */ new Set([d.eventId]), oe = v.parentEventId, W = oe ? tt(a($)[oe] ?? null) : null, pe = W && !Me(W.authorPubkey, W.eventId) ? oc({ childNode: v, parentNode: W }) : null, Pe = pe && H.visibleParent ? yt(d.eventId, pe.eventId, B, [d.eventId], -1, j) : null, Le = jn(d.eventId, [d.eventId], j), ke = new Set(Le), He = et(d.eventId, B).filter((Tt) => ke.has(Tt.event.id)), Fe = Le.length, ut = H.visibleChildren && Fe > 0, ht = ut ? Le.map((Tt) => yt(d.eventId, Tt, B, [d.eventId], 1, j)).filter((Tt) => Tt !== null) : [];
    return {
      anchorEventId: d.eventId,
      parentTargetId: oe,
      parentNode: pe,
      parentNodeState: Pe,
      parentExpansion: H,
      repliesActionState: {
        status: H.loadingChildren ? "loading" : H.childrenError ? "failed" : H.loadedChildren ? "loaded" : "unloaded",
        visible: ut,
        replies: He,
        replyCount: Fe,
        error: H.childrenError
      },
      reactionSummary: Q(d.eventId),
      reactionReadModel: ne(d.eventId),
      replyItems: He,
      replyNodeStates: ht
    };
  }
  function Me(d, v) {
    return !d || !v ? !1 : !!a(X)[d]?.[v];
  }
  function Qt(d) {
    const v = a($)[d];
    return v ? Me(v.authorPubkey, d) : !1;
  }
  function or(d, v) {
    !d || !v || Me(d, v) || w(X, {
      ...a(X),
      [d]: {
        ...a(X)[d] ?? {},
        [v]: !0
      }
    });
  }
  function ir(d, v, H = {}) {
    const B = /* @__PURE__ */ new Set();
    for (const [j, oe] of Object.entries(a(ee))) {
      if (oe !== d)
        continue;
      const W = a($)[d];
      v && W && W.authorPubkey !== v || B.add(j);
    }
    if (B.size !== 0)
      for (const [j, oe] of Object.entries(a(F))) {
        const W = j.indexOf(":");
        if (W < 0)
          continue;
        const pe = j.slice(0, W), Pe = j.slice(W + 1);
        B.has(Pe) && (!oe?.loadedParent && !oe?.visibleParent || ie(pe, Pe, (Le) => Cs(Le, {
          visibleParent: H.revealKnownParent ? !0 : Le.visibleParent,
          parentDeleted: !0,
          lastFetchedParentAt: Date.now()
        })));
      }
  }
  function $t(d, v = {}) {
    for (const [H, B] of d.entries())
      for (const j of B)
        ir(j, H, v);
  }
  function an(d) {
    let v = a(X), H = !1;
    for (const [B, j] of d.entries()) {
      const oe = v[B] ?? {};
      let W = oe;
      for (const pe of j)
        W[pe] || (W = { ...W, [pe]: !0 }, H = !0);
      W !== oe && (v = { ...v, [B]: W });
    }
    H && (w(X, v), $t(d));
  }
  function sn(d) {
    const v = {};
    let H = !1;
    for (const [B, j] of Object.entries(a(ye))) {
      const oe = j.filter((W) => W !== d);
      v[B] = oe, oe.length !== j.length && (H = !0);
    }
    if (H && w(ye, v), a(ee)[d]) {
      const { [d]: B, ...j } = a(ee);
      w(ee, j);
    }
  }
  async function Pn(d, v = {}) {
    if (!d?.id || Me(d.pubkey, d.id))
      return !0;
    if (v.checkPostHistoryRepository === !1)
      return !1;
    try {
      if (typeof (await i.getByEventId(d.id))?.deletedAt == "number")
        return or(d.pubkey, d.id), sn(d.id), !0;
    } catch {
    }
    return !1;
  }
  async function un(d) {
    an(d);
    for (const v of d.values())
      for (const H of v)
        sn(H), await u.deleteChildInteractionByEventId(H);
  }
  async function Tn(d) {
    const v = await h.getDeletedTargets(d.map((H) => ({ targetAuthorPubkey: H.pubkey, targetEventId: H.id })));
    await un(v);
  }
  async function Kn(d, v, H, B = "default") {
    if (v.length === 0)
      return;
    const j = n();
    if (!j)
      return;
    const oe = v.filter((Pe) => !Me(Pe.pubkey, Pe.id));
    if (oe.length === 0)
      return;
    const W = `${d}:deletions:${B}`, pe = f.fetchDeletionRequests(j, {
      targets: oe.map((Pe) => ({
        event: Pe,
        relayUrls: a($)[Pe.id]?.relayUrls ?? []
      })),
      relayHints: H,
      relayConfig: r()
    });
    de.replaceDeletionFetchTask(W, pe);
    try {
      const Pe = await pe.promise;
      if (!t())
        return;
      await h.upsertValidDeletionRequests({
        targetEvents: oe,
        deletionEvents: Pe.events,
        fetchedAt: Pe.fetchedAt
      });
    } catch {
      return;
    } finally {
      de.deleteDeletionFetchTask(W);
    }
    t() && await Tn(oe);
  }
  async function lr(d) {
    await Tn(d);
    const v = [];
    for (const H of d) {
      if (await Pn(H)) {
        await u.deleteChildInteractionByEventId(H.id);
        continue;
      }
      v.push(H);
    }
    return v;
  }
  async function Wt(d) {
    const v = d.map((oe) => ko(oe)), H = await lr(v), B = new Set(H.map((oe) => oe.id)), j = [];
    for (const oe of d)
      B.has(oe.eventId) && j.push(oe);
    return j;
  }
  async function ct(d) {
    const v = await lr(d.map((j) => j.event)), H = new Set(v.map((j) => j.id)), B = [];
    for (const j of d)
      H.has(j.event.id) && B.push(j);
    return B;
  }
  async function xr(d) {
    return await Tn([d.event]), await Pn(d.event, { checkPostHistoryRepository: d.checkPostHistoryRepository }) ? !1 : (Kn(d.anchorEventId, [d.event], d.relayHints), !0);
  }
  function ot(d, v = d) {
    Xe(bn(d, v)), ie(d, v, (H) => ({
      ...Cs(H, {
        visibleParent: !0,
        parentDeleted: !0,
        lastFetchedParentAt: Date.now()
      })
    }));
  }
  function on(d, v) {
    Xe(bn(d, v)), ie(d, v, (H) => ({
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
  async function Yn(d, v, H) {
    const B = H.parentEventId;
    if (!B)
      return !1;
    const j = o.getTargetSnapshot(B);
    if (j?.status === "deleted")
      return j.authorPubkey && (or(j.authorPubkey, B), ir(B, j.authorPubkey, { revealKnownParent: !0 })), ot(d.eventId, v), !0;
    const oe = tt(a($)[B] ?? null);
    if (oe) {
      const W = Oa({
        event: oe.event,
        relayHints: oe.relayUrls
      });
      if (!W || !ts({ child: H.event, parent: W }).valid)
        return on(d.eventId, v), !1;
      const pe = Ga([
        ...oe.relayUrls,
        ...st(d, H)
      ]), Pe = await xr({
        anchorEventId: d.eventId,
        event: oe.event,
        relayHints: pe,
        checkPostHistoryRepository: oe.authorPubkey === e()
      });
      return t() ? Pe ? (ie(d.eventId, v, (Le) => ({
        ...Cs(Le, {
          parentDeleted: Le.parentDeleted,
          lastFetchedParentAt: j?.updatedAt ?? Le.lastFetchedParentAt
        })
      })), !0) : (ot(d.eventId, v), !0) : !1;
    }
    if (!j)
      return !1;
    if (j.authorPubkey && Me(j.authorPubkey, B))
      return ot(d.eventId, v), !0;
    if (j.status === "resolved" && j.event) {
      const W = Oa({
        event: j.event,
        relayHints: j.relayHints
      });
      if (!W || !ts({ child: H.event, parent: W }).valid)
        return on(d.eventId, v), !1;
      const pe = q({
        event: j.event,
        relayUrls: j.relayHints,
        sources: ["fetched-parent"],
        profile: j.profile
      });
      return Oe(pe.eventId, pe.parentEventId), ie(d.eventId, v, (Pe) => ({
        ...Cs(Pe, {
          parentDeleted: !1,
          lastFetchedParentAt: j.updatedAt ?? Pe.lastFetchedParentAt
        })
      })), !0;
    }
    return j.status === "not-found" ? (ie(d.eventId, v, (W) => ({
      ...Cs(W, {
        parentMissing: !0,
        parentDeleted: !1,
        lastFetchedParentAt: j.updatedAt ?? W.lastFetchedParentAt
      })
    })), !0) : !1;
  }
  async function Fn(d, v, H, B = {}) {
    const j = H.parentEventId;
    if (!j)
      return;
    const oe = de.incrementRequestId(), W = bn(d.eventId, v);
    ie(d.eventId, v, (pe) => ({
      ...wm(pe, { showInitialLoading: !!B.showInitialLoading })
    })), B.showInitialLoading && je(d.eventId, v), await Zd({
      isActive: () => oe === de.getRequestId() && t(),
      cleanup: () => {
        Xe(W);
      },
      onError: () => {
        Rm({
          updateExpansion: (pe) => ie(d.eventId, v, pe),
          showInitialLoading: !!B.showInitialLoading,
          errorCode: "fetch_failed"
        });
      },
      run: async ({ ensureActive: pe }) => {
        const Pe = gt(d, v, H);
        if (!Pe)
          return;
        const Le = await o.ensureTarget(Pe, { force: !0, background: !B.showInitialLoading });
        if (!pe() || (Xe(W), !Le))
          return;
        if (Le.status === "resolved" && Le.event) {
          const He = Oa({ event: Le.event, relayHints: Le.relayHints });
          if (!He || !ts({ child: H.event, parent: He }).valid) {
            on(d.eventId, v);
            return;
          }
        }
        const ke = Pm(Le);
        await ec({
          status: ke,
          strategies: Sm({
            snapshot: Le,
            parentEventId: j,
            showInitialLoading: !!B.showInitialLoading,
            updateExpansion: (He) => {
              ie(d.eventId, v, He);
            },
            hideEvent: or,
            markParentDeletedForEvent: ir,
            setParentDeleted: () => {
              ot(d.eventId, v);
            },
            isDeletedEvent: Me,
            upsertNode: () => q({
              event: Le.event,
              relayUrls: Le.relayHints,
              sources: ["fetched-parent"],
              profile: Le.profile
            }),
            upsertParentEdge: Oe
          })
        });
      }
    });
  }
  async function dr(d, v, H = {}) {
    const B = v === d.eventId ? he(d) : a($)[v];
    if (!B?.parentEventId)
      return;
    const j = ue(d.eventId, v);
    await tc({
      loading: j.loadingParent,
      revalidating: j.revalidatingParent,
      onInFlight: () => {
        ie(d.eventId, v, (oe) => ({
          ...oe,
          visibleParent: !0,
          showParentLoadingIndicator: !1
        }));
      },
      onLoadingInFlight: () => {
        je(d.eventId, v);
      },
      shouldHandleLoadedState: !H.force && j.loadedParent,
      handleLoadedState: async () => {
        if (j.parentDeleted)
          return ot(d.eventId, v), !0;
        ie(d.eventId, v, (W) => ({
          ...W,
          visibleParent: !0,
          showParentLoadingIndicator: !1
        }));
        const oe = await Yn(d, v, B);
        return Gd({
          hasVisibleData: oe,
          lastFetchedAt: j.lastFetchedParentAt,
          ttlMs: Io
        }) && Fn(d, v, B), !0;
      },
      prepareFreshLoadState: () => {
        ie(d.eventId, v, (oe) => ({
          ...oe,
          visibleParent: !0,
          loadingParent: !0,
          parentError: null,
          parentMissing: !1,
          parentDeleted: !1,
          showParentLoadingIndicator: !1
        })), je(d.eventId, v);
      },
      displayCachedForFreshLoad: async () => {
        const oe = await Yn(d, v, B), W = ue(d.eventId, v);
        return {
          displayedCached: oe,
          lastFetchedAt: W.lastFetchedParentAt
        };
      },
      force: !!H.force,
      ttlMs: Io,
      awaitWhenInitialLoading: !0,
      runRevalidate: ({ showInitialLoading: oe }) => Fn(d, v, B, { showInitialLoading: oe })
    });
  }
  async function Ln(d, v = {}) {
    await dr(d, d.eventId, v);
  }
  function Mn(d) {
    xn(d.eventId, d.eventId);
  }
  function xn(d, v) {
    Xe(bn(d, v)), ie(d, v, (H) => ({
      ...H,
      visibleParent: !1,
      showParentLoadingIndicator: !1
    }));
  }
  async function br(d) {
    if (ue(d.eventId, d.eventId).visibleParent) {
      Mn(d);
      return;
    }
    await Ln(d);
  }
  function ua(d) {
    Ln(d, { force: !0 });
  }
  async function hn(d, v) {
    if (ue(d.eventId, v).visibleParent) {
      xn(d.eventId, v);
      return;
    }
    await dr(d, v);
  }
  function Sn(d, v) {
    dr(d, v, { force: !0 });
  }
  function zn(d) {
    const v = d.map((H) => H.fetchedAt).filter((H) => Number.isFinite(H));
    return v.length > 0 ? Math.max(...v) : null;
  }
  async function Gn(d) {
    try {
      return {
        metadata: await b.get(d),
        readFailed: !1
      };
    } catch {
      return { metadata: null, readFailed: !0 };
    }
  }
  async function Sr(d, v) {
    const { metadata: H, readFailed: B } = await Gn(d);
    return B ? null : H ? H.completeness === "complete" ? H.fetchedAt : null : zn(v);
  }
  async function ea(d, v, H, B = {}) {
    const j = await s.getDirectReplyRecords(v);
    Kn(d.eventId, j.map((Pe) => ko(Pe)), nt(d, H));
    const oe = await Wt(j);
    if (!t() || oe.length === 0)
      return !1;
    const W = await cr(H, oe, ["reply-db"], { resolveProfiles: !B.prefetchOnly });
    if (!t() || W.length === 0)
      return !1;
    if (!t())
      return !0;
    const pe = await Sr(v, W);
    return t() && ie(d.eventId, v, (Pe) => ({
      ...lo(Pe, {
        visibleChildren: B.prefetchOnly ? Pe.visibleChildren : !0,
        lastFetchedChildrenAt: pe
      })
    })), !0;
  }
  async function Lr(d, v, H, B = {}) {
    const j = bn(d.eventId, v), oe = de.getRequestId(), W = de.createChildRequestToken(j), pe = Date.now();
    ie(d.eventId, v, (Pe) => ({
      ...Jd(Pe, {
        showInitialLoading: !!B.showInitialLoading,
        prefetchOnly: !!B.prefetchOnly
      })
    })), await Zd({
      isActive: () => oe === de.getRequestId() && de.getChildRequestToken(j) === W && t(),
      cleanup: () => {
        de.deleteChildrenFetchTask(j), de.deleteChildRequestToken(j), Rr(d.eventId, v);
      },
      onError: Hm({
        updateExpansion: (Pe) => ie(d.eventId, v, Pe),
        showInitialLoading: !!B.showInitialLoading,
        prefetchOnly: !!B.prefetchOnly
      }),
      run: async ({ ensureActive: Pe }) => {
        if (!Pe())
          return;
        const Le = n();
        if (!Le) {
          ie(d.eventId, v, (At) => ({
            ...Uo(At, {
              nextError: B.showInitialLoading && !B.prefetchOnly ? "nostr_not_ready" : null
            })
          }));
          return;
        }
        const ke = x.fetchDirectReplies(Le, {
          eventId: v,
          createdAt: H.event.created_at,
          relayHints: nt(d, H),
          parents: [
            Oa({
              event: H.event,
              relayHints: nt(d, H)
            })
          ].filter((At) => At !== null),
          relayConfig: r()
        });
        de.replaceChildrenFetchTask(j, ke);
        const He = await ke.promise;
        if (de.deleteChildrenFetchTask(j), !Pe())
          return;
        ac(He.status), Kn(d.eventId, He.events.map((At) => At.event), [
          ...nt(d, H),
          ...He.relayUrls
        ]);
        const Fe = await ct(He.events);
        He.events.length > 0 && await u.upsertChildInteractions({
          parentEventId: v,
          events: Fe,
          fetchedAt: He.status === "partial" ? null : He.fetchedAt
        });
        const ut = await b.save({
          parentEventId: v,
          completeness: sc(He.status),
          fetchedAt: He.fetchedAt,
          requestStartedAt: pe
        }), ht = Oi(ut), Tt = await Wt(await s.getDirectReplyRecords(v));
        if (!Pe())
          return;
        Tt.length > 0 && await cr(H, Tt, ["reply-db", "fetched-child"], { resolveProfiles: !B.prefetchOnly });
        const Xt = xm({
          nextRecordsLength: Tt.length,
          resultEventsLength: He.events.length
        });
        await ec({
          status: Xt,
          strategies: Im({
            fetchedAt: ht,
            prefetchOnly: !!B.prefetchOnly,
            updateExpansion: (At) => {
              ie(d.eventId, v, At);
            },
            prefetchChildReplyCounts: () => {
              Yr(d, v);
            }
          })
        }), ln({
          anchorEventId: d.eventId,
          nodeEventId: v,
          effectiveFetchedAt: ht,
          replyCount: Tt.length
        });
      }
    });
  }
  function ha(d, v) {
    se.add(bn(d, v));
  }
  function Ir(d, v) {
    se.delete(bn(d, v));
  }
  function ta(d, v) {
    return se.has(bn(d, v));
  }
  function na(d, v) {
    Ae.add(bn(d, v));
  }
  function Rr(d, v) {
    Ae.delete(bn(d, v));
  }
  function Ea(d, v) {
    return Ae.has(bn(d, v));
  }
  function fa(d) {
    for (const v of Ae)
      v.endsWith(`:${d}`) && Ae.delete(v);
  }
  function Cr(d, v) {
    if (!Ea(d.eventId, v))
      return;
    const H = bn(d.eventId, v);
    if (de.getChildRequestToken(H) !== void 0)
      return;
    const B = ue(d.eventId, v);
    Rr(d.eventId, v), !(!t() || !B.visibleChildren) && _r(d, v, { force: !0 });
  }
  function jr(d, v, H) {
    const B = bn(d.eventId, v);
    return de.getChildRequestToken(B) === void 0 && !ta(d.eventId, v) ? !1 : (H || (na(d.eventId, v), ie(d.eventId, v, (j) => ({ ...j, visibleChildren: !0 }))), !0);
  }
  function Kr(d, v) {
    return v === d.eventId ? he(d) : a($)[v];
  }
  async function _r(d, v, H = {}) {
    const B = Kr(d, v);
    if (!B || jr(d, v, !!H.prefetchOnly))
      return;
    const j = ue(d.eventId, v);
    await tc({
      loading: j.loadingChildren,
      revalidating: j.revalidatingChildren,
      onInFlight: H.prefetchOnly ? () => {
      } : () => {
        ie(d.eventId, v, (oe) => ({ ...oe, visibleChildren: !0 }));
      },
      shouldHandleLoadedState: !H.force && j.loadedChildren,
      handleLoadedState: async () => {
        if (H.prefetchOnly)
          return !0;
        const oe = Ye(v).length > 0;
        return ie(d.eventId, v, (W) => ({ ...W, visibleChildren: oe })), oe && Yr(d, v), Gd({
          hasVisibleData: !0,
          lastFetchedAt: j.lastFetchedChildrenAt,
          ttlMs: Io
        }) && Lr(d, v, B), !0;
      },
      prepareFreshLoadState: () => {
      },
      displayCachedForFreshLoad: async () => {
        const oe = await ea(d, v, B, H), W = ue(d.eventId, v);
        return {
          displayedCached: oe,
          lastFetchedAt: W.lastFetchedChildrenAt
        };
      },
      force: !!H.force,
      ttlMs: Io,
      prefetchOnly: !!H.prefetchOnly,
      awaitWhenInitialLoading: !1,
      onSkipPrefetchReplyCounts: () => {
        Yr(d, v);
      },
      runRevalidate: ({ showInitialLoading: oe }) => Lr(d, v, B, { prefetchOnly: H.prefetchOnly, showInitialLoading: oe })
    });
  }
  async function ra(d, v = {}) {
    await _r(d, d.eventId, v);
  }
  async function Yr(d, v) {
    const H = bn(d.eventId, v);
    if (!fe.has(H)) {
      fe.add(H);
      try {
        await va(d, v);
      } finally {
        fe.delete(H);
      }
    }
  }
  async function va(d, v) {
    const H = Date.now(), B = de.getRequestId(), j = Ye(v).filter((ke) => {
      const He = ue(d.eventId, ke), Fe = typeof He.lastFetchedChildrenAt == "number" && H - He.lastFetchedChildrenAt < rc;
      return !He.loadedChildren && !He.loadingChildren && !He.revalidatingChildren && !Fe;
    });
    if (j.length === 0)
      return;
    for (const ke of j)
      ha(d.eventId, ke);
    const oe = [];
    if (await Promise.all(j.map(async (ke) => {
      try {
        if (!t()) {
          Ir(d.eventId, ke);
          return;
        }
        const He = await Aa(d, ke), Fe = ue(d.eventId, ke), ut = typeof Fe.lastFetchedChildrenAt == "number" && Date.now() - Fe.lastFetchedChildrenAt < rc, ht = !He || Fe.lastFetchedChildrenAt === null;
        ht && B === de.getRequestId() && t() && ta(d.eventId, ke) && de.getChildRequestToken(bn(d.eventId, ke)) === void 0 && !Fe.loadingChildren && !Fe.revalidatingChildren && (!Fe.loadedChildren || Fe.lastFetchedChildrenAt === null) && !ut ? oe.push(ke) : (Ir(d.eventId, ke), ht ? Cr(d, ke) : Rr(d.eventId, ke));
      } catch {
        Ir(d.eventId, ke), Cr(d, ke);
      }
    })), oe.sort((ke, He) => Number(Ea(d.eventId, He)) - Number(Ea(d.eventId, ke))), oe.splice(Om).forEach((ke) => {
      Ir(d.eventId, ke), Cr(d, ke);
    }), !t() || oe.length === 0) {
      oe.forEach((ke) => {
        Ir(d.eventId, ke), Cr(d, ke);
      });
      return;
    }
    const W = [];
    for (let ke = 0; ke < oe.length; ke += nc)
      W.push(oe.slice(ke, ke + nc));
    let pe = 0;
    const Pe = Math.min(Fm, W.length), Le = async () => {
      for (; t(); ) {
        const ke = pe;
        pe += 1;
        const He = W[ke];
        if (!He)
          return;
        await Da(d, He);
      }
    };
    try {
      await Promise.all(Array.from({ length: Pe }, () => Le()));
    } finally {
      j.forEach((ke) => Ir(d.eventId, ke));
    }
  }
  async function Aa(d, v) {
    const H = await s.getDirectReplyRecords(v), { metadata: B, readFailed: j } = await Gn(v);
    if (!t())
      return !1;
    const oe = await Wt(H), W = a($)[v];
    if (!t() || !W || oe.length === 0 && !B)
      return !1;
    const pe = await cr(W, oe, ["reply-db"], { resolveProfiles: !1 });
    if (!t() || pe.length === 0 && !B)
      return !1;
    const Pe = j ? null : B ? B.completeness === "complete" ? B.fetchedAt : null : zn(pe);
    return t() && ie(d.eventId, v, (Le) => ({
      ...lo(Le, { lastFetchedChildrenAt: Pe })
    })), !0;
  }
  function pa(d, v) {
    Ce(d, v), N(d, v);
  }
  function ln(d) {
    return d.effectiveFetchedAt !== null || d.replyCount > 0 ? !1 : (ie(d.anchorEventId, d.nodeEventId, (v) => ({
      ...v,
      loadedChildren: !1,
      loadingChildren: !1,
      revalidatingChildren: !1,
      childrenError: null,
      lastFetchedChildrenAt: null
    })), !0);
  }
  async function ga(d) {
    const { metadata: v, readFailed: H } = await Gn(d.parentEventId), B = d.cachedRecords.filter((W) => W.kind === 1 || W.kind === 42);
    if (B.length === 0 && !v)
      return;
    const j = await cr(d.anchorNode, B, ["reply-db", "inbound-sync"], { resolveProfiles: !1 });
    if (!d.ensureActive() || j.length === 0 && !v || v?.completeness === "partial" && ln({
      anchorEventId: d.post.eventId,
      nodeEventId: d.parentEventId,
      effectiveFetchedAt: null,
      replyCount: j.length
    }))
      return;
    const oe = H ? null : v ? Oi(v) : zn(j);
    ie(d.post.eventId, d.parentEventId, (W) => ({
      ...lo(W, { lastFetchedChildrenAt: oe })
    })), $e(d.anchorNode.authorPubkey, d.anchorNode.relayUrls);
  }
  async function Er(d, v) {
    if (!t() || d.length === 0)
      return;
    const H = Nm(d, v);
    if (H.length === 0)
      return;
    const B = de.getRequestId(), j = !!v?.length, oe = new Map(d.map((W) => [W.eventId, W]));
    await Xd({
      items: H,
      isActive: () => B === de.getRequestId() && t(),
      run: async ({ ensureActive: W }) => {
        for (const pe of H) {
          const Pe = oe.get(pe);
          if (!Pe || !W())
            continue;
          const Le = bn(Pe.eventId, pe), ke = ue(Pe.eventId, pe);
          if (!j && (te.has(Le) || ke.loadedChildren || ke.loadingChildren || ke.revalidatingChildren)) {
            te.add(Le);
            continue;
          }
          te.add(Le);
          const He = he(Pe), [Fe, ut] = await Promise.all([
            ym(pe, l),
            s.getDirectReplyRecords(pe)
          ]);
          if (!W())
            continue;
          const [ht, Tt] = await Promise.all([
            Wt(Fe),
            Wt(ut)
          ]);
          if (!W())
            continue;
          pa(pe, ht);
          const Xt = Array.from(new Set(ht.map((At) => At.authorPubkey).filter((At) => !!At)));
          if (Xt.length > 0) {
            const At = await _c.getProfiles(Xt, { allowBackgroundRefresh: !1 });
            if (!W())
              continue;
            for (const Pr of Xt) {
              const zr = At[Pr] ?? null;
              I(Pr, zr), $e(Pr, He.relayUrls);
            }
          }
          await ga({
            post: Pe,
            parentEventId: pe,
            cachedRecords: Tt,
            anchorNode: He,
            ensureActive: W
          });
        }
      }
    });
  }
  async function Da(d, v) {
    const H = v.map((Fe) => a($)[Fe]).filter((Fe) => !!Fe);
    if (H.length === 0)
      return;
    const B = de.getRequestId(), j = Date.now(), oe = /* @__PURE__ */ new Map(), W = /* @__PURE__ */ new Map();
    let pe = !1, Pe = !1;
    const Le = `${d.eventId}:children-prefetch:${v.join(",")}`, ke = () => pe || B !== de.getRequestId() || !t() ? !1 : v.every((Fe) => ta(d.eventId, Fe) && de.getChildRequestToken(bn(d.eventId, Fe)) === oe.get(Fe)), He = (Fe) => {
      for (const ut of v)
        ju({
          updateExpansion: (ht) => ie(d.eventId, ut, ht),
          showInitialLoading: !1,
          prefetchOnly: !0,
          errorCode: Fe
        });
    };
    await Xd({
      items: v,
      isActive: ke,
      prepareItem: (Fe) => {
        const ut = bn(d.eventId, Fe), ht = de.createChildRequestToken(ut);
        return oe.set(Fe, ht), ie(d.eventId, Fe, (Tt) => ({
          ...Jd(Tt, { showInitialLoading: !1, prefetchOnly: !0 })
        })), ht;
      },
      completeBatch: (Fe) => {
        if (Fe && ke())
          for (const ut of v)
            ie(d.eventId, ut, (ht) => ({
              ...lo(ht, {
                loadedChildren: Fe && ((W.get(ut) ?? null) !== null || Ye(ut).length > 0),
                revalidatingChildren: !1,
                lastFetchedChildrenAt: W.get(ut) ?? null
              })
            }));
      },
      cleanupItem: (Fe, ut) => {
        const ht = bn(d.eventId, Fe);
        de.getChildRequestToken(ht) === ut && de.deleteChildRequestToken(ht), Ir(d.eventId, Fe), Pe || pe ? Rr(d.eventId, Fe) : Cr(d, Fe);
      },
      cleanup: () => {
        de.deleteChildrenFetchTask(Le);
      },
      onError: () => {
        He("fetch_failed");
      },
      run: async ({ ensureActive: Fe }) => {
        if (!Fe())
          return;
        const ut = n();
        if (!ut) {
          He("nostr_not_ready");
          return;
        }
        const ht = zt(d, H), Tt = x.fetchDirectReplies(ut, {
          eventId: v[0] ?? "",
          eventIds: v,
          createdAt: Math.min(...H.map((it) => it.event.created_at)),
          relayHints: ht,
          parents: H.map((it) => Oa({
            event: it.event,
            relayHints: [
              ...it.relayUrls,
              ...La(it.event).relayHints
            ]
          })).filter((it) => it !== null),
          relayConfig: r()
        });
        de.replaceChildrenFetchTask(Le, Tt);
        const Xt = await Tt.promise;
        if (de.deleteChildrenFetchTask(Le), !Fe())
          return;
        if (Xt.status === "cancelled") {
          pe = !0;
          for (const it of v)
            ie(d.eventId, it, (fn) => ({
              ...Uo(fn, { nextError: fn.childrenError })
            }));
          return;
        }
        ac(Xt.status);
        const At = new Set(v), Pr = Xt.events.filter((it) => At.has(it.parentEventId) && it.event.id !== it.parentEventId);
        Pr.length > 0 && await Kn(d.eventId, Pr.map((it) => it.event), [...ht, ...Xt.relayUrls], `children-prefetch:${v.join(",")}`);
        const zr = await ct(Pr);
        if (!Fe())
          return;
        const ur = /* @__PURE__ */ new Map(), sa = new Map(Pr.map((it) => [it.event.id, it.parentEventId]));
        for (const it of zr) {
          const fn = sa.get(it.event.id);
          if (!fn || !At.has(fn))
            continue;
          const ba = ur.get(fn) ?? [];
          ba.push(it), ur.set(fn, ba);
        }
        for (const it of v) {
          const fn = ur.get(it) ?? [];
          if (fn.length > 0 && await u.upsertChildInteractions({
            parentEventId: it,
            events: fn,
            fetchedAt: Xt.status === "partial" ? null : Xt.fetchedAt
          }), !Fe())
            return;
          const ba = await b.save({
            parentEventId: it,
            completeness: sc(Xt.status),
            fetchedAt: Xt.fetchedAt,
            requestStartedAt: j
          });
          W.set(it, Oi(ba));
          const $r = await Wt(await s.getDirectReplyRecords(it)), Ca = a($)[it];
          Ca && await cr(Ca, $r, ["reply-db", "fetched-child"], { resolveProfiles: !1 });
        }
        Fe() && (Pe = !0);
      }
    });
  }
  async function cr(d, v, H, B = {}) {
    const j = d.eventId, oe = [], W = [], pe = B.resolveProfiles !== !1;
    for (const Pe of v) {
      const Le = ko(Pe);
      if (!Bm({ parentNode: d, record: Pe })) {
        await u.deleteChildInteractionByEventId(Pe.eventId);
        continue;
      }
      if (Me(Le.pubkey, Le.id))
        continue;
      const ke = pe ? await at({ event: Le, relayUrls: Pe.relayUrls, sources: H }) : q({
        event: Le,
        relayUrls: Ga(Pe.relayUrls),
        sources: H
      });
      pe || $e(Le.pubkey, Ga(Pe.relayUrls)), ke.eventId !== j && (Oe(ke.eventId, j), oe.push(ke.eventId), W.push(Pe));
    }
    return Ze(j, oe), W;
  }
  function ka(d) {
    wr(d.eventId, d.eventId);
  }
  function wr(d, v) {
    Rr(d, v), ie(d, v, (H) => ({ ...H, visibleChildren: !1 }));
  }
  function ya(d) {
    if (ue(d.eventId, d.eventId).visibleChildren) {
      ka(d);
      return;
    }
    ra(d);
  }
  function ma(d) {
    ra(d, { force: !0 });
  }
  function Ar(d, v) {
    if (ue(d.eventId, v).visibleChildren) {
      wr(d.eventId, v);
      return;
    }
    _r(d, v);
  }
  function ls(d, v) {
    _r(d, v, { force: !0 });
  }
  async function Hr(d, v = []) {
    if (!d?.id || d.kind !== 1 && d.kind !== 42)
      return !0;
    const H = La(d), B = H.parentId;
    if (!B)
      return !0;
    const j = v.find((He) => He.eventId === B) ?? null, oe = Object.keys(a(F)).filter((He) => He.endsWith(`:${B}`));
    if (!j && oe.length === 0)
      return !1;
    const W = o.getTargetSnapshot(B), pe = j ? a($)[B] ?? xo({
      event: zi(j),
      relayUrls: Ga([
        ...j.relayHints,
        ...j.acceptedRelays,
        ...j.fetchedRelays ?? []
      ]),
      sources: ["history-record"]
    }) : a($)[B] ?? (W?.status === "resolved" && W.event ? xo({
      event: W.event,
      relayUrls: W.relayHints,
      sources: ["fetched-parent"]
    }) : null);
    if (!pe)
      return !1;
    const Pe = Oa({ event: pe.event, relayHints: pe.relayUrls });
    if (!Pe || !ts({ child: d, parent: Pe }).valid || (await lr([d])).length === 0)
      return !1;
    await u.upsertChildInteractions({
      parentEventId: B,
      events: [{ event: d, relayUrls: H.relayHints }]
    });
    const Le = await Wt(await s.getDirectReplyRecords(B));
    if (!t())
      return !1;
    await cr(pe, Le, ["reply-db", "posted-reply"]);
    const ke = (He, Fe) => {
      ie(He, Fe, (ut) => ({
        ...ut,
        loadedChildren: !0,
        loadingChildren: !1,
        childrenError: null
      }));
    };
    j && ke(j.eventId, j.eventId);
    for (const He of oe) {
      const Fe = He.indexOf(":");
      Fe < 0 || ke(He.slice(0, Fe), He.slice(Fe + 1));
    }
    return !0;
  }
  async function aa(d) {
    !d.eventId || !d.authorPubkey || (fa(d.eventId), or(d.authorPubkey, d.eventId), sn(d.eventId), ir(d.eventId, d.authorPubkey, { revealKnownParent: !0 }), d.deletionEvent && await h.upsertValidDeletionRequests({
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
    }), await u.deleteChildInteractionByEventId(d.eventId));
  }
  Ue(() => {
    t() && w(ve, o.getScopeRevision(z), !0);
  }), Ue(() => {
    if (t()) {
      a(ve);
      for (const d of Object.keys(a(F))) {
        const [v, H] = d.split(":"), j = a($)[H]?.parentEventId;
        if (!j)
          continue;
        const oe = o.getTargetSnapshot(j);
        oe?.status === "deleted" && (ue(v, H).parentDeleted || (oe.authorPubkey && (or(oe.authorPubkey, j), ir(j, oe.authorPubkey, { revealKnownParent: !0 })), ot(v, H)));
      }
    }
  });
  function Hn() {
    de.cancelAndClearFetchTasks(), de.clearChildRequestTokens(), se.clear(), Ae.clear(), m && C.reset(), Se.clearAll();
  }
  function Dr() {
    Hn(), O && o.reset(), de.incrementRequestId(), w($, {}), w(ee, {}), w(ye, {}), w(F, {}), w(X, {}), w(Te, {}), w(we, {}), w(ce, {}), te.clear(), fe.clear();
  }
  return Ue(() => {
    t() || Dr();
  }), Ue(() => {
    if (t())
      return () => {
        Hn();
      };
  }), Ns(() => {
    o.invalidateScope(z), Hn(), ae(), O && o.reset(), m && C.dispose();
  }), {
    getAnchorState: kt,
    toggleParent: br,
    retryParent: ua,
    toggleNodeParent: hn,
    retryNodeParent: Sn,
    toggleChildren: ya,
    retryChildren: ma,
    toggleNodeChildren: Ar,
    retryNodeChildren: ls,
    recordPostedReply: Hr,
    recordDeletedEvent: aa,
    loadCachedChildInteractionStateForPosts: Er,
    cancelCurrentGraphFetches: Hn,
    resetState: Dr
  };
}
function ic(t) {
  return !!t && typeof t.use == "function";
}
function Um({
  getShow: t,
  getPubkeyHex: e,
  getRxNostr: n,
  getRelayConfig: r,
  getPosts: i,
  onSavedInboundInteractions: s = () => {
  },
  reconcileDirectReplyCandidates: l
}) {
  const u = Jn({
    status: "idle",
    activePubkeyHex: null,
    hasStartedInitialDialogBootstrap: !1
  });
  let h = null, b = 0;
  function g() {
    b += 1, h?.cancel(), h = null, u.status = "idle";
  }
  async function y(f) {
    const _ = e(), C = n();
    if (!t() || !_ || !ic(C) || i().length === 0)
      return;
    if (f === "dialog-open-refresh") {
      const z = await ud.get(_);
      if (typeof z?.lastDialogRefreshAt == "number" && Date.now() - z.lastDialogRefreshAt < Oh)
        return;
    }
    g();
    const m = ++b;
    u.status = "syncing";
    const o = f === "dialog-open-refresh" ? Tc.runInbound(C, {
      ownerPubkeyHex: _,
      relayConfig: r(),
      reason: f,
      reconcileDirectReplyCandidates: l
    }) : {
      ...Fh.syncRecent(C, {
        ownerPubkeyHex: _,
        relayConfig: r(),
        reason: f,
        reconcileDirectReplyCandidates: l
      }),
      joinedExisting: !1
    };
    h = o;
    const O = await o.promise;
    m !== b || h !== o || !t() || e() !== _ || (h = null, u.status = "idle", !(o.joinedExisting || O.status === "cancelled" || O.changedParentEventIds.length === 0) && (await s(O.changedParentEventIds), il({
      source: "dialog-inbound-sync",
      parentEventIds: O.changedParentEventIds,
      rxNostr: C,
      relayConfig: r(),
      isActive: () => t() && e() === _ && n() === C
    }).then((z) => {
      if (!(z.status === "cancelled" || z.deletedReactionEventIds.length === 0 && z.deletedReplyEventIds.length === 0 || !t() || e() !== _ || n() !== C))
        return Promise.resolve(s(O.changedParentEventIds)).catch(() => {
        });
    }).catch(() => {
    })));
  }
  async function x() {
    const f = e();
    if (!f)
      return;
    const _ = await ud.get(f);
    await y(_?.lastSyncedAt ? "dialog-open-refresh" : "initial-dialog-bootstrap");
  }
  return Ue(() => {
    const f = e() ?? null;
    f !== u.activePubkeyHex && (g(), u.activePubkeyHex = f, u.hasStartedInitialDialogBootstrap = !1);
  }), Ue(() => {
    if (!t()) {
      g(), u.hasStartedInitialDialogBootstrap = !1;
      return;
    }
    !e() || !ic(n()) || i().length === 0 || u.hasStartedInitialDialogBootstrap || (u.hasStartedInitialDialogBootstrap = !0, x());
  }), { state: u, cancelCurrentSync: g, runSync: y };
}
function Vm(t) {
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
function lc(t) {
  return t.direction === "older" ? t.isSearchMode ? "postHistory.loadOlderSearchResults" : "postHistory.loadOlder" : t.isSearchMode ? "postHistory.loadNewerSearchResults" : "postHistory.loadNewer";
}
function jm(t) {
  return t.status === "loading" ? { key: "postHistory.checkingReplies" } : t.status === "failed" ? { key: "postHistory.recheckReplies" } : t.status === "loaded" ? t.replyCount === 0 ? { key: "postHistory.recheckReplies" } : t.visible ? { key: "postHistory.hideReplies" } : {
    key: "postHistory.showRepliesWithCount",
    values: {
      count: t.replyCount
    }
  } : { key: "postHistory.checkReplies" };
}
function Km(t) {
  return t.visible ? { key: "postHistory.hideReactions" } : {
    key: "postHistory.showReactionsWithCount",
    values: {
      count: t.reactionCount
    }
  };
}
function Ym(t) {
  return t === "+";
}
const zm = 1024 * 1024, Qm = 100, Wm = {
  status: "valid",
  ruleVersion: Go
}, Fi = {
  status: "invalid",
  ruleVersion: Go
};
function Jm(t) {
  return t?.ruleVersion === Go && (t.status === "valid" || t.status === "invalid");
}
function zu(t) {
  return t?.status === "valid" && t.ruleVersion === Go;
}
function Qu(t) {
  if (Wo(t))
    try {
      return `nostr:${cl(t)}\0${t.id}\0${t.sig}`;
    } catch {
    }
  try {
    return `raw:${JSON.stringify(t)}`;
  } catch {
    return "raw:unserializable";
  }
}
function Gm(t) {
  if (!Wo(t))
    return { ...Fi };
  try {
    const e = Lh(t);
    return tl(e) && cl(e) === e.id && Hh(e) ? { ...Wm } : { ...Fi };
  } catch {
    return { ...Fi };
  }
}
async function dc(t, e) {
  for (const { id: n, fingerprint: r, verification: i } of t) {
    const s = await e.get(n);
    !s || Qu(s.rawEvent) !== r || await e.update(n, {
      rawEventVerification: i
    });
  }
}
function Zm(t, e) {
  const n = (r) => ({
    get: async (i) => r.find((s) => s.id === i),
    update: async (i, s) => {
      const l = r.find((u) => u.id === i);
      l && Object.assign(l, s);
    }
  });
  return {
    post: n(t),
    deletion: n(e)
  };
}
async function Xm(t, e, n, r) {
  const i = [
    ...t.map((y) => ({ type: "post", record: y })),
    ...e.map((y) => ({ type: "deletion", record: y }))
  ].filter((y) => !Jm(y.record.rawEventVerification)), s = i.length;
  if (s === 0)
    return;
  let l = 0;
  const u = /* @__PURE__ */ new Map(), h = [], b = [];
  async function g() {
    if (h.length > 0) {
      const y = h.splice(0), x = () => dc(y, n.post);
      await (n.transaction?.post ?? (async (f) => f()))(x);
    }
    if (b.length > 0) {
      const y = b.splice(0), x = () => dc(y, n.deletion);
      await (n.transaction?.deletion ?? (async (f) => f()))(x);
    }
  }
  r?.({ phase: "verifying", processed: l, total: s });
  for (const y of i) {
    const x = Qu(y.record.rawEvent), f = u.get(x) ?? Gm(y.record.rawEvent);
    u.set(x, f), y.record.rawEventVerification = f;
    const _ = { id: y.record.id, fingerprint: x, verification: f };
    y.type === "post" ? h.push(_) : b.push(_), l += 1, l % Qm === 0 && (await g(), r?.({ phase: "verifying", processed: l, total: s }));
  }
  await g(), r?.({ phase: "verifying", processed: s, total: s });
}
function Wu(t, e) {
  if (!Wo(t) || t.kind !== e)
    return !1;
  try {
    return tl(t) && cl(t) === t.id;
  } catch {
    return !1;
  }
}
function cc(t) {
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
function uc(t, e) {
  return t.created_at !== e.created_at ? t.created_at - e.created_at : t.id === e.id ? 0 : t.id < e.id ? -1 : 1;
}
function e0(t) {
  return t.rawEvent !== null && t.rawEvent !== void 0;
}
function t0(t, e, n) {
  return !zu(t.rawEventVerification) || !Wu(e, 5) || e.pubkey !== n || t.targetAuthorPubkey !== n || t.deletionEventPubkey !== n || e.id !== t.deletionEventId ? !1 : Lc(e).includes(t.targetEventId);
}
function n0() {
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
function r0(t, e) {
  if (t.length === 0)
    return {
      blob: new Blob([], { type: "application/x-ndjson;charset=utf-8" }),
      ...e ? { jsonl: "" } : {}
    };
  const n = [];
  let r = "";
  for (const i of t) {
    const s = `${JSON.stringify(i)}
`;
    r.length > 0 && r.length + s.length > zm && (n.push(r), r = ""), r += s;
  }
  return r.length > 0 && n.push(r), {
    blob: new Blob(n, { type: "application/x-ndjson;charset=utf-8" }),
    ...e ? { jsonl: n.join("") } : {}
  };
}
async function a0(t, e, n, r = {}) {
  const i = n0(), s = [], l = [], u = /* @__PURE__ */ new Set(), h = /* @__PURE__ */ new Set(), b = /* @__PURE__ */ new Set(), g = e.filter((m) => m.pubkeyHex === t), y = n.filter(
    (m) => m.targetAuthorPubkey === t
  );
  for (const m of g)
    if (!(m.kind !== 1 && m.kind !== 42)) {
      if (!zu(m.rawEventVerification) || !Ic(m.rawEvent, m) || !Wu(m.rawEvent, m.kind)) {
        i.skippedPostCount += 1;
        continue;
      }
      s.push(cc(m.rawEvent)), u.add(m.eventId), i.exportedPostEventCount += 1;
    }
  const x = /* @__PURE__ */ new Map();
  for (const m of y) {
    const o = x.get(m.deletionEventId) ?? [];
    o.push(m), x.set(m.deletionEventId, o);
  }
  for (const m of x.values()) {
    const o = m.find((O) => t0(O, O.rawEvent, t));
    if (o) {
      const O = cc(o.rawEvent);
      l.push(O);
      for (const z of Lc(O))
        h.add(z);
      i.exportedDeletionEventCount += 1;
      continue;
    }
    for (const O of m)
      b.add(O.targetEventId);
    m.every((O) => !e0(O)) ? i.missingDeletionRawEventCount += 1 : i.invalidDeletionRawEventCount += 1;
  }
  const f = /* @__PURE__ */ new Set();
  for (const m of g)
    m.kind !== 1 && m.kind !== 42 || m.deletedAt === void 0 || !u.has(m.eventId) || h.has(m.eventId) || b.has(m.eventId) || f.add(m.eventId);
  i.missingDeletionRawEventCount += f.size, s.sort(uc), l.sort(uc);
  const _ = [...s, ...l];
  i.exportedEventCount = _.length, i.isPartial = i.skippedPostCount > 0 || i.missingDeletionRawEventCount > 0 || i.invalidDeletionRawEventCount > 0, r.onProgress?.({ phase: "creating" });
  const C = r0(_, r.includeJsonl === !0);
  return { result: i, ...C };
}
async function s0(t) {
  const e = t.postRecords.filter(
    (i) => i.pubkeyHex === t.pubkeyHex
  ), n = t.deletionRecords.filter(
    (i) => i.targetAuthorPubkey === t.pubkeyHex
  ), r = t.verificationStores ?? Zm(e, n);
  return await Xm(
    e,
    n,
    r,
    t.onProgress
  ), a0(
    t.pubkeyHex,
    e,
    n,
    t
  );
}
function hc() {
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
class o0 {
  postHistoryRepository;
  deletionRequestsRepository;
  workerFactory;
  constructor(e = {}) {
    this.postHistoryRepository = e.postHistoryRepository ?? Ge, this.deletionRequestsRepository = e.deletionRequestsRepository ?? $s, this.workerFactory = e.workerFactory ?? (() => new Worker(
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
      const { jsonl: r, ...i } = hc();
      return Promise.resolve({
        result: i,
        blob: new Blob([], { type: "application/x-ndjson;charset=utf-8" })
      });
    }
    return new Promise((r, i) => {
      const s = this.workerFactory();
      let l = !1;
      const u = () => {
        s.onmessage = null, s.onerror = null, n.signal?.removeEventListener("abort", b), s.terminate();
      }, h = (g) => {
        l || (l = !0, u(), i(g));
      }, b = () => h(new DOMException("Export aborted", "AbortError"));
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
          h(new Error(y.message));
          return;
        }
        if (y.type === "complete") {
          if (l) return;
          l = !0, u(), r({ result: y.result, blob: y.blob });
        }
      }, s.onerror = () => h(new Error("post_history_export_worker_failed")), s.postMessage({ type: "export", pubkeyHex: e });
    });
  }
  /**
   * Compatibility API for non-UI callers and detailed tests. It delegates
   * to the same engine used by the production Worker; the Worker path asks
   * the engine for a Blob without joining the complete JSONL string.
   */
  async exportForPubkey(e) {
    if (!e)
      return hc();
    const [n, r] = await Promise.all([
      this.postHistoryRepository.getAll({ pubkeyHex: e }),
      this.deletionRequestsRepository.getAllForTargetAuthorPubkey(e)
    ]), i = await s0({
      pubkeyHex: e,
      postRecords: n,
      deletionRecords: r,
      includeJsonl: !0
    });
    return {
      ...i.result,
      jsonl: i.jsonl ?? ""
    };
  }
}
const i0 = new o0();
var l0 = U('<div class="xmark-icon svg-icon svelte-uxr0i8"></div>'), d0 = U('<h3 class="post-history-current-month-heading svelte-uxr0i8"><button type="button" class="post-history-current-month svelte-uxr0i8"> </button></h3>'), c0 = U('<div class="post-history-heading-summary svelte-uxr0i8"><div class="post-history-summary-row svelte-uxr0i8"><span class="post-history-summary-line post-history-summary-count svelte-uxr0i8"> </span></div></div>'), u0 = U('<div class="more-icon svg-icon"></div>'), h0 = U('<div class="search-icon svg-icon svelte-uxr0i8" aria-hidden="true"></div> <span class="svelte-uxr0i8"> </span>', 1), f0 = U('<div class="repair-icon svg-icon svelte-uxr0i8" aria-hidden="true"></div> <span class="svelte-uxr0i8"> </span>', 1), v0 = U('<div class="return-to-latest-icon svg-icon" aria-hidden="true"></div> <span class="svelte-uxr0i8"> </span>', 1), p0 = U('<div class="calendar-icon svg-icon" aria-hidden="true"></div> <span class="svelte-uxr0i8"> </span>', 1), g0 = U('<div class="jump-to-oldest-icon svg-icon" aria-hidden="true"></div> <span class="svelte-uxr0i8"> </span>', 1), y0 = U('<div class="export-icon svg-icon" aria-hidden="true"></div> <span class="svelte-uxr0i8"> </span>', 1), m0 = U('<div class="import-icon svg-icon svelte-uxr0i8" aria-hidden="true"></div> <span class="svelte-uxr0i8"> </span>', 1), b0 = U('<div class="trash-icon svg-icon" aria-hidden="true"></div> <span class="svelte-uxr0i8"> </span>', 1), C0 = U('<div class="post-history-menu-body svelte-uxr0i8"><!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!></div>'), w0 = U("<!> <!>", 1), P0 = U('<div class="search-icon svg-icon svelte-uxr0i8"></div>'), x0 = U('<div class="xmark-icon svg-icon svelte-uxr0i8" aria-hidden="true"></div>'), S0 = U('<div class="post-history-search-row svelte-uxr0i8"><div><div class="post-history-search-leading svelte-uxr0i8" aria-hidden="true"><!></div> <input class="post-history-search-input svelte-uxr0i8" type="search"/></div> <!></div>'), I0 = U('<div class="calendar-icon svg-icon" aria-hidden="true"></div>'), R0 = U('<span class="post-history-date-picker-nav-icon post-history-date-picker-nav-icon-left svg-icon svelte-uxr0i8" aria-hidden="true"></span>'), _0 = U('<span class="post-history-date-picker-nav-icon post-history-date-picker-nav-icon-right svg-icon svelte-uxr0i8" aria-hidden="true"></span>'), E0 = U('<button type="button" class="post-history-date-picker-year-nav svelte-uxr0i8" aria-label="Previous year"><span class="post-history-date-picker-year-nav-icon post-history-date-picker-year-nav-icon-left svg-icon svelte-uxr0i8" aria-hidden="true"></span></button> <!> <!> <!> <button type="button" class="post-history-date-picker-year-nav svelte-uxr0i8" aria-label="Next year"><span class="post-history-date-picker-year-nav-icon post-history-date-picker-year-nav-icon-right svg-icon svelte-uxr0i8" aria-hidden="true"></span></button>', 1), A0 = U("<!> <!>", 1), D0 = U("<!> <!>", 1), k0 = U("<!> <!> <!>", 1), T0 = U('<div class="jump-icon svg-icon svelte-uxr0i8" aria-hidden="true"></div>'), M0 = U('<div class="xmark-icon svg-icon svelte-uxr0i8" aria-hidden="true"></div>'), O0 = U('<div class="post-history-utility-panel svelte-uxr0i8"><div class="post-history-utility-label svelte-uxr0i8" id="post-history-jump-date-label"> </div> <div class="post-history-utility-controls svelte-uxr0i8"><!> <!> <!></div></div>'), F0 = U('<div class="post-history-list-loading svelte-uxr0i8" aria-hidden="true"><!></div>'), L0 = U('<div class="empty-state svelte-uxr0i8"><div class="empty-message svelte-uxr0i8"> </div></div>'), H0 = U('<div class="keyboard-arrow-up-icon svg-icon" aria-hidden="true"></div> ', 1), $0 = U('<div class="post-history-nav-row post-history-nav-row-top svelte-uxr0i8"><!></div>'), N0 = U('<div class="post-history-channel-row svelte-uxr0i8"><span class="channel-icon svg-icon svelte-uxr0i8" aria-hidden="true"></span> <span class="channel-label svelte-uxr0i8"> </span> <span class="channel-name svelte-uxr0i8"> </span></div>'), B0 = U('<span class="deleted-badge svelte-uxr0i8"> </span>'), q0 = U('<span class="delete-failed svelte-uxr0i8"> </span>'), U0 = U('<div class="post-meta-inline svelte-uxr0i8"><!> <!></div>'), V0 = U('<div class="more-icon svg-icon"></div>'), j0 = U('<div class="calendar-icon svg-icon" aria-hidden="true"></div> <span class="svelte-uxr0i8"> </span>', 1), K0 = U("<!> <!>", 1), Y0 = U('<div class="post-history-menu-body svelte-uxr0i8"><div class="post-history-menu-timestamp"> </div> <!> <!> <!></div>'), z0 = U("<!> <!>", 1), Q0 = U('<span class="svelte-uxr0i8"> </span> <!>', 1), W0 = U('<div class="post-preview-header svelte-uxr0i8"><!> <div class="post-preview-header-right svelte-uxr0i8"><!> <!></div></div>'), J0 = U('<div class="post-preview-quotes svelte-uxr0i8"></div>'), G0 = U('<div class="reply-icon svg-icon" aria-hidden="true"></div>'), Z0 = U('<div class="quote-icon svg-icon" aria-hidden="true"></div>'), X0 = U('<div class="favorite-icon svg-icon svelte-uxr0i8" aria-hidden="true"></div> <span class="svelte-uxr0i8"> </span>', 1), eb = U('<div class="post-preview-action-buttons-group svelte-uxr0i8"><!> <div class="post-preview-footer-replies-slot svelte-uxr0i8"><!></div></div> <!> <div class="post-preview-footer-reaction-slot svelte-uxr0i8"><!></div>', 1), tb = U('<div class="open-in-new-icon svg-icon" aria-hidden="true"></div> <span class="svelte-uxr0i8"> </span>', 1), nb = U('<div aria-hidden="true"></div> <span class="svelte-uxr0i8"> </span>', 1), rb = U('<div class="calendar-icon svg-icon" aria-hidden="true"></div> <span class="svelte-uxr0i8"> </span>', 1), ab = U("<!> <!> <!> <!> <!>", 1), sb = U('<div class="favorite-icon svg-icon post-preview-reaction-symbol svelte-uxr0i8" aria-hidden="true"></div>'), ob = U('<span class="post-preview-reaction-content svelte-uxr0i8"> </span>'), ib = U('<img class="post-preview-reaction-emoji" draggable="false" loading="lazy" decoding="async"/>'), lb = U('<span class="post-preview-reaction-emoji-placeholder svelte-uxr0i8" aria-hidden="true"></span>'), db = U('<span class="post-preview-reaction-emoji-slot svelte-uxr0i8"><!></span>'), cb = U('<span class="post-preview-reaction-content svelte-uxr0i8"> </span>'), ub = U('<span class="post-preview-reaction-actor svelte-uxr0i8"><!></span>'), hb = U('<div class="post-preview-reaction-chip svelte-uxr0i8"><div class="post-preview-reaction-summary svelte-uxr0i8"><!> <span class="post-preview-reaction-count svelte-uxr0i8"> </span></div> <div class="post-preview-reaction-actors svelte-uxr0i8"></div></div>'), fb = U('<div class="post-preview-reactions-panel svelte-uxr0i8"></div>'), vb = U("<!> <!>", 1), pb = U('<span class="deleted-badge svelte-uxr0i8"> </span>'), gb = U('<span class="delete-failed svelte-uxr0i8"> </span>'), yb = U('<div class="post-meta svelte-uxr0i8"><!> <!></div>'), mb = U('<li><div class="post-history-main svelte-uxr0i8"><div class="post-preview svelte-uxr0i8"><!> <!> <div class="post-history-thread-anchor-post svelte-uxr0i8"><div class="post-preview-body svelte-uxr0i8"><!> <!></div> <!> <!></div></div> <!></div></li>'), bb = U('<div class="post-history-sparse-state svelte-uxr0i8" role="status"><p class="svelte-uxr0i8"> </p> <p class="svelte-uxr0i8"> </p></div>'), Cb = U('<div class="cloud-download-icon svg-icon" aria-hidden="true"></div> ', 1), wb = U('<div class="keyboard-arrow-down-icon svg-icon" aria-hidden="true"></div> ', 1), Pb = U('<div class="post-history-saved-boundary svelte-uxr0i8" role="status"><div class="post-history-saved-boundary-actions svelte-uxr0i8"><!> <!></div></div>'), xb = U('<div class="keyboard-arrow-down-icon svg-icon" aria-hidden="true"></div> ', 1), Sb = U('<div class="post-history-nav-row post-history-nav-row-bottom svelte-uxr0i8"><!></div>'), Ib = U('<div class="cloud-download-icon svg-icon" aria-hidden="true"></div> ', 1), Rb = U('<div class="post-history-exhausted-state svelte-uxr0i8"><!></div>'), _b = U('<!> <ul class="post-history-list svelte-uxr0i8"></ul> <!> <!>', 1), Eb = U('<div class="vertical-align-top-icon svg-icon" aria-hidden="true"></div>'), Ab = U('<div class="post-history-latest-row svelte-uxr0i8"><!></div>'), Db = U('<div class="post-history-heading svelte-uxr0i8"><div class="post-history-heading-main svelte-uxr0i8"><!></div> <div class="post-history-heading-actions svelte-uxr0i8"><!> <!> <!></div></div> <!> <!> <div class="post-history-container svelte-uxr0i8"><!></div> <!> <!> <!>', 1), kb = U('<div class="delete-confirm-body svelte-uxr0i8"><p class="delete-confirm-description svelte-uxr0i8"> </p> <p class="delete-confirm-warning svelte-uxr0i8"> </p></div>'), Tb = U('<div class="delete-confirm-body svelte-uxr0i8"><p class="delete-confirm-description svelte-uxr0i8"> </p></div>'), Mb = U("<div> </div>"), Ob = U("<div> </div>"), Fb = U("<div> </div>"), Lb = U("<!> <!> <!> <!> <!> <!> <!>", 1);
const Hb = {
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
    .post-history-utility-button.post-history-utility-close-button {min-width:70px;min-height:40px;}.post-history-nav-row.svelte-uxr0i8 {display:flex;justify-content:center;width:100%;padding:8px 16px;}.post-history-nav-row-top.svelte-uxr0i8 {padding-bottom:0;}.post-history-nav-row-bottom.svelte-uxr0i8 {padding-top:0;}.post-history-nav-button.primary {opacity:1;}.post-history-nav-button:not(.primary) {min-height:50px;white-space:nowrap;gap:4px;}.post-history-exhausted-state.svelte-uxr0i8 {display:flex;flex-direction:column;gap:10px;align-items:center;padding:0 16px 8px 16px;}.post-history-latest-row.svelte-uxr0i8 {position:absolute;inset:auto 16px 12px auto;display:flex;justify-content:flex-end;width:auto;margin:0;padding:0;z-index:3;.post-history-latest-button {min-width:50px;min-height:50px;background-color:color-mix(in srgb, var(--theme) 15%, transparent);backdrop-filter:blur(1px);.vertical-align-top-icon {mask-image:var(--ehagaki-icon-766572746963616c5f616c69676e5f746f705f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);width:26px;height:26px;opacity:0.6;}}}.post-history-container.svelte-uxr0i8 {flex:1 1 auto;min-height:0;width:100%;overflow-y:auto;}.empty-state.svelte-uxr0i8 {display:grid;gap:8px;min-height:100px;align-content:center;}.post-history-list-loading.svelte-uxr0i8 {display:grid;min-height:100px;place-items:center;}.empty-message.svelte-uxr0i8 {display:flex;justify-content:center;align-items:center;height:100px;color:var(--text-muted);font-size:1rem;}.status-loading-placeholder {justify-content:flex-end;width:auto;column-gap:0;color:var(--text-muted);font-size:0.8rem;line-height:1.3;height:auto;}.status-loading-placeholder .loader-container {.square {background:currentColor;}}.status-loading-placeholder .placeholder-text {color:inherit;font-size:inherit;}.status-error {color:var(--danger);}.status-loading-placeholder.status-error .square {background-color:var(--danger);}.post-history-list.svelte-uxr0i8 {width:100%;margin:0;padding:0;list-style:none;}.post-history-item.svelte-uxr0i8 {display:flex;align-items:center;border-bottom:1px solid var(--border-hr-light);padding:6px;}.post-history-item.svelte-uxr0i8:last-child {border-bottom:none;}.post-history-item-deleted.svelte-uxr0i8 .post-meta-inline:where(.svelte-uxr0i8) > :where(.svelte-uxr0i8):not(.deleted-badge),
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
function $b(t, e) {
  xt(e, !0), _a(t, Hb);
  const n = () => rs(Uh, "$locale", i), r = () => rs(Is, "$_", i), [i, s] = Ss(), l = $c().overlayTarget, u = 18, h = 200;
  let b = E(e, "show", 15, !1), g = E(e, "onClose", 7), y = E(e, "onReplyPost", 7, void 0), x = E(e, "onQuotePost", 7, void 0), f = E(e, "pubkeyHex", 7, null), _ = E(e, "rxNostr", 7, void 0), C = E(e, "relayConfig", 7, null), m = E(e, "latestPostedEvent", 7, null), o = E(e, "inboundInteractionSave", 7, null), O = E(e, "authoredSelfPostSave", 7, null), z = E(e, "reconcileInboundDirectReplyCandidates", 7, void 0), $ = E(e, "notifySavedAuthoredPosts", 7, void 0);
  const ee = Gl({ getShow: () => b(), getRxNostr: () => _() }), ye = Zl({
    getShow: () => b(),
    getRxNostr: () => _(),
    getRelayConfig: () => C(),
    profileSyncCoordinator: ee
  }), F = jy({
    getShow: () => b(),
    getPubkeyHex: () => f(),
    getRxNostr: () => _(),
    getRelayConfig: () => C(),
    getSessionScrollState: () => Me.readCurrentSessionScrollState(),
    onSessionScrollStateInvalidated: () => Me.clearAllSessionScrollAnchorsForCurrentPubkey(),
    onSavedAuthoredPosts: async (c) => {
      await $()?.(c);
    },
    onChildInteractionBadgeRefreshRequested: (c, T) => te.loadCachedChildInteractionStateForPosts(c, T),
    onQuoteVisibleRangeRefreshRequested: (c) => ve.refreshQuotePreviews(c),
    quoteVisibleRangeRepairExecutor: async (c, T) => {
      const re = Se(T.visiblePosts);
      re.length !== 0 && await ye.ensureTargets(re);
    },
    pageSize: Dc
  }), X = Cg({
    getShow: () => b(),
    getPosts: () => F.posts,
    getRxNostr: () => _(),
    getRelayConfig: () => C(),
    getIsSearchMode: () => F.isSearchMode
  }), ve = $g({
    getShow: () => b(),
    getPosts: () => F.posts,
    getRxNostr: () => _(),
    getRelayConfig: () => C(),
    relatedTargetResolver: ye,
    profileSyncCoordinator: ee
  });
  function Se(c) {
    const T = bs.buildIndex(c);
    return Object.values(T.contextsByEventId).map((re) => bs.toDescriptor(re, "post-history-listing-quote-visible-range-repair"));
  }
  const te = qm({
    getShow: () => b(),
    getPubkeyHex: () => f(),
    getRxNostr: () => _(),
    getRelayConfig: () => C(),
    relatedTargetResolver: ye,
    profileSyncCoordinator: ee
  });
  Um({
    getShow: () => b(),
    getPubkeyHex: () => f(),
    getRxNostr: () => _(),
    getRelayConfig: () => C(),
    getPosts: () => F.posts,
    onSavedInboundInteractions: (c) => te.loadCachedChildInteractionStateForPosts(F.posts, c),
    reconcileDirectReplyCandidates: (c) => z()?.(c) ?? Promise.resolve({
      changedParentEventIds: [],
      savedDirectReplyCount: 0,
      unresolvedParentEventIds: c.map((T) => T.classification.parentEventId).filter((T) => !!T)
    })
  });
  const fe = Wh(), se = wg();
  function Ae() {
    const c = /* @__PURE__ */ new Date(), T = `${c.getFullYear()}`, re = `${c.getMonth() + 1}`.padStart(2, "0"), le = `${c.getDate()}`.padStart(2, "0");
    return pl(`${T}-${re}-${le}`);
  }
  let Te = be(!1), we = be("none"), ce = be(Jn(Ae())), G = be(Jn(Ae())), de = be(!1), Ie = null, Ce = be(!1), N = be(!1), I = be(!1), Q = be(Jn({ phase: "loading" })), ne, ue, ie = be(!1), q = be("postHistory.exportComplete"), Oe = be(Jn({})), Ze, dt = be(!1), he = be(null), xe = be(Jn({})), $e = be(Jn({})), ae = be(!1), at = be(0), gt = be(0), tt = be("postHistory.broadcastSent"), st, nt = be(void 0), zt = be(Jn({})), Xe = be(Jn([])), je = be(-1), et = be(!1), Ye = be(null), jn = be(null), yt = be(!1);
  const kt = Jh({
    getShow: () => b(),
    getPosts: () => F.posts,
    getContainer: () => a(Ye)
  }), Me = Jy({
    getShow: () => b(),
    getPubkeyHex: () => f(),
    getPosts: () => F.posts,
    getLocale: () => n(),
    getContainer: () => a(Ye),
    getIsSearchMode: () => F.isSearchMode,
    getSearchQuery: () => F.state.searchQuery
  }), Qt = $h({
    getShow: () => b(),
    getEmojiUrls: () => a(Fn),
    onStateChanged: () => kt.remeasure()
  });
  function or(c) {
    const T = Mg(c);
    return $i({
      sourceContent: T,
      displayContent: T,
      tags: c.tags,
      media: c.media
    });
  }
  function ir(c) {
    return Qt.emojiLoadStateByUrl[c] === "ready";
  }
  function $t(c) {
    return Qt.emojiLoadStateByUrl[c] === "failed";
  }
  function an(c) {
    return Number.isInteger(c) ? `${c}` : c.toFixed(6).replace(/\.0+$/, "").replace(/(\.\d*?)0+$/, "$1");
  }
  function sn(c) {
    const T = Qt.emojiImageMetaByUrl[c]?.aspectRatio, le = typeof T == "number" && Number.isFinite(T) && T > 0 ? u * T : u;
    return [
      `width: ${an(le)}px;`,
      `height: ${u}px;`,
      "vertical-align: bottom;"
    ].join(" ");
  }
  let Pn = S(() => {
    const c = {};
    for (const T of F.posts)
      c[T.eventId] = or(T);
    return c;
  }), un = S(() => F.currentViewRefetchStatusMessageKey ?? F.syncStatusMessageKey), Tn = S(() => F.currentViewRefetchStatusMessageKey ? F.currentViewRefetchStatusMessageValues : null), Kn = S(() => F.syncStatus === "failed" || F.currentViewRefetchStatusMessageKey === "postHistory.repairPartialFailure" || F.currentViewRefetchStatusMessageKey === "postHistory.repairFetchFailed"), lr = S(() => F.canReturnToLatest || !Me.isHistoryScrolledToTop), Wt = S(() => F.canJumpToOldest || !Me.isHistoryScrolledToBottom), ct = S(() => F.isSearchMode ? F.searchResultStatus === "loading" : F.initialLocalLoadStatus === "loading"), xr = S(() => F.posts.length === 0 && (F.isSearchMode ? F.searchResultStatus === "ready" : F.initialLocalLoadStatus === "ready"));
  function ot(c, T) {
    T[c.id] || (T[c.id] = $i({ sourceContent: c.content, tags: c.tags }));
  }
  function on(c, T, re) {
    if (!(!c || re.has(c.node.eventId))) {
      re.add(c.node.eventId), ot(c.node.event, T), on(c.parentNodeState, T, re);
      for (const le of c.replyNodeStates)
        on(le, T, re);
    }
  }
  let Yn = S(() => {
    const c = {};
    for (const T of F.posts) {
      const re = /* @__PURE__ */ new Set();
      for (const Re of fa(T))
        Re.status === "resolved" && ot(Re.event, c);
      const le = te.getAnchorState(T);
      le.parentNode && ot(le.parentNode.event, c), on(le.parentNodeState, c, re);
      for (const Re of le.replyNodeStates)
        on(Re, c, re);
    }
    return c;
  }), Fn = S(() => {
    const c = /* @__PURE__ */ new Set();
    for (const T of [
      ...Object.values(a(Pn)),
      ...Object.values(a(Yn))
    ])
      for (const re of T.previewContent.emojiUrls)
        c.add(re);
    for (const T of F.posts) {
      const re = te.getAnchorState(T);
      if (a(zt)[T.eventId])
        for (const le of re.reactionReadModel.groups)
          le.emojiUrl && c.add(le.emojiUrl);
    }
    return [...c];
  });
  function dr() {
    ee.reset(), se.resetState(), ka(), $r(), fe.resetDeleteConfirmation(), w(N, !1), w(dt, !1), w(he, null), w(Te, !1), w(we, "none"), w(ce, Ae(), !0), w(G, Ae(), !0), w(de, !1), w(Ce, !1), w(xe, {}, !0), w($e, {}, !0), fd(), w(zt, {}, !0), Qt.resetState(), w(Xe, [], !0), w(je, -1), w(et, !1);
  }
  function Ln() {
    ne?.abort();
  }
  function Mn() {
    const c = F.isSearchMode;
    c && Me.clearCurrentSessionScrollAnchor(), F.resetSearchState(), F.prepareForClose() ? Me.clearAllSessionScrollAnchorsForCurrentPubkey() : c || Me.saveCurrentSessionScrollAnchor(), X.cancelCurrentChannelResolution(), te.cancelCurrentGraphFetches(), fe.resetDeleteConfirmation(), w(N, !1), w(dt, !1), w(he, null), w(Te, !1), w(Ce, !1), se.hideCopyFloatingMessage(), ka(), $r(), Ln(), w(et, !1), w(Xe, [], !0), w(je, -1), b(!1), g()?.();
  }
  function xn(c) {
    return c instanceof Element && c.closest(".ehagaki-pswp") !== null;
  }
  function br(c) {
    xn(c.target) && c.preventDefault();
  }
  function ua(c) {
    a(et) && c.preventDefault();
  }
  Nh(() => b(), Mn, !0), Ue(() => {
    b() || (Ln(), dr());
  }), Ue(() => {
    a(I) && ue && f() !== ue && Ln();
  }), Ue(() => {
    if (!b() || !a(ct)) {
      w(yt, !1);
      return;
    }
    w(yt, !1);
    const c = setTimeout(
      () => {
        b() && a(ct) && w(yt, !0);
      },
      h
    );
    return () => {
      clearTimeout(c);
    };
  }), Ns(() => {
    Ln(), fd(), ee.dispose(), $r();
  }), Ue(() => {
    if (!b() || !m()?.id)
      return;
    const c = m().id;
    Ie !== c && (F.posts, te.recordPostedReply(m(), F.posts).then((T) => {
      T && (Ie = c);
    }).catch(() => {
    }));
  }), Ue(() => {
    const c = F.posts;
    !b() || c.length === 0 || (Bh(c.map((T) => T.eventId)).catch(() => {
    }), Xr(() => te.loadCachedChildInteractionStateForPosts(c)));
  }), Ue(() => {
    const c = o()?.revision ?? 0, T = o()?.parentEventIds ?? [], re = F.posts;
    !b() || c <= 0 || T.length === 0 || (Xr(() => te.loadCachedChildInteractionStateForPosts(re, T)), il({
      source: "dialog-inbound-save",
      parentEventIds: T,
      rxNostr: _(),
      relayConfig: C(),
      isActive: () => b()
    }).then((le) => {
      if (!(!b() || le.deletedReactionEventIds.length === 0 && le.deletedReplyEventIds.length === 0))
        return te.loadCachedChildInteractionStateForPosts(F.posts, le.checkedParentEventIds);
    }).catch(() => {
    }));
  }), Ue(() => {
    const c = O()?.revision ?? 0;
    !b() || c <= 0 || F.isSearchMode || F.canReturnToLatest || Xr(() => F.returnToLatest());
  }), Ue(() => {
    if (b())
      return () => {
        X.cancelCurrentChannelResolution();
      };
  });
  function hn(c) {
    return c ? c.values ? r()(c.key, { values: c.values }) : r()(c.key) : null;
  }
  function Sn() {
    return hn(Vm({
      totalCount: F.displayTotalCount,
      totalCountKnown: F.state.totalCountKnown,
      totalCountStatus: F.state.totalCountStatus,
      isSearchMode: F.isSearchMode
    }));
  }
  function zn(c) {
    if (!c)
      return null;
    const T = Number(c.year), re = Number(c.month), le = Number(c.day), Je = new Date(T, re - 1, le, 23, 59, 59, 999).getTime();
    return Number.isFinite(Je) ? Math.floor(Je / 1e3) : null;
  }
  function Gn() {
    return r()(lc({ direction: "older", isSearchMode: F.isSearchMode }));
  }
  function Sr() {
    return r()(lc({ direction: "newer", isSearchMode: F.isSearchMode }));
  }
  async function ea() {
    const c = F.isSearchMode, T = c ? Me.captureHistoryScrollAnchor() : null;
    await F.loadOlder() && c && Me.restoreHistoryScrollAnchor(T);
  }
  async function Lr() {
    await F.showSavedOlderPosts() && Me.resetHistoryScrollSoon();
  }
  async function ha() {
    const c = Me.captureHistoryScrollAnchor(), T = a(Ye)?.scrollTop ?? null;
    F.state.loadedPosts.length, a(Ye)?.scrollHeight, a(Ye)?.clientHeight;
    const re = await F.fetchOlderFromRelays({ anchorEventId: c?.eventId });
    let le = !1;
    re && T !== null && b() && a(Ye) && (le = Me.restoreHistoryScrollAnchor(c), le || (a(Ye).scrollTop = T)), F.latestOlderBackfillUiResult, a(Ye)?.scrollTop, a(Ye)?.scrollHeight;
  }
  async function Ir() {
    const c = F.isSearchMode ? null : Me.captureHistoryScrollAnchor();
    await F.loadNewer() && (F.isSearchMode ? Me.resetHistoryScrollSoon() : Me.restoreHistoryScrollAnchor(c));
  }
  async function ta() {
    Me.clearAllSessionScrollAnchorsForCurrentPubkey(), ((F.canReturnToLatest ? await F.returnToLatest() : !1) || !Me.isHistoryScrolledToTop) && Me.resetHistoryScrollSoon();
  }
  async function na() {
    const c = zn(a(ce));
    if (c === null)
      return;
    Me.clearAllSessionScrollAnchorsForCurrentPubkey(), await F.jumpToCreatedAt(c) && (w(we, "none"), w(de, !1), Me.resetHistoryScrollSoon());
  }
  function Rr(c) {
    return a(Pn)[c.eventId] ?? or(c);
  }
  function Ea(c) {
    return Rr(c).hasRenderableText;
  }
  function fa(c) {
    return ve.getQuotePreviews(c);
  }
  function Cr(c) {
    return a(xe)[c.eventId] === "sending";
  }
  function jr(c) {
    return a(xe)[c.eventId] === "failed";
  }
  function Kr(c) {
    return a($e)[c.eventId] === "sending";
  }
  function _r(c) {
    return ef(c) !== null;
  }
  function ra(c) {
    const T = te.getAnchorState(c).repliesActionState;
    return hn(jm(T)) ?? "";
  }
  function Yr(c) {
    return !!a(zt)[c.eventId];
  }
  function va(c) {
    const T = te.getAnchorState(c).reactionSummary.totalCount;
    return hn(Km({ visible: Yr(c), reactionCount: T })) ?? "";
  }
  function Aa(c) {
    return te.getAnchorState(c).reactionReadModel.groups;
  }
  function pa(c) {
    return gm(c);
  }
  function ln(c) {
    w(
      zt,
      {
        ...a(zt),
        [c.eventId]: !a(zt)[c.eventId]
      },
      !0
    );
  }
  function ga(c) {
    const T = te.getAnchorState(c).repliesActionState;
    if (T.status === "failed" || T.status === "loaded" && T.replyCount === 0) {
      te.retryChildren(c);
      return;
    }
    te.toggleChildren(c);
  }
  function Er(c) {
    return md(c, f());
  }
  function Da(c) {
    Er(c) && fe.openDeleteConfirm(c);
  }
  async function cr(c, T) {
    if (Kr(c))
      return;
    const re = ya(c, T);
    w($e, { ...a($e), [c.eventId]: "sending" }, !0);
    const le = await tf.broadcast({ post: c, rxNostr: _() });
    w($e, { ...a($e), [c.eventId]: void 0 }, !0), ma(re, le);
  }
  function ka() {
    st && (clearTimeout(st), st = void 0), w(ae, !1), w(nt, void 0);
  }
  function wr(c, T) {
    w(
      nt,
      {
        eventId: c.eventId,
        ...To(T.clientX, T.clientY)
      },
      !0
    );
  }
  function ya(c, T) {
    if (a(nt)?.eventId === c.eventId)
      return {
        x: a(nt).x,
        y: a(nt).y
      };
    const re = T.currentTarget, le = re instanceof HTMLElement ? re.getBoundingClientRect() : null;
    return To(le ? le.left + le.width / 2 : 0, le ? le.bottom + 8 : 0);
  }
  function ma(c, T) {
    st && clearTimeout(st), w(at, c.x, !0), w(gt, c.y, !0), w(
      tt,
      T.success ? (T.rejectedRelays?.length ?? 0) > 0 || (T.timedOutRelays?.length ?? 0) > 0 ? "postHistory.broadcastPartial" : "postHistory.broadcastSent" : "postHistory.broadcastFailed",
      !0
    ), w(ae, !0), st = setTimeout(
      () => {
        w(ae, !1), st = void 0;
      },
      1800
    );
  }
  function Ar(c) {
    const T = Date.now(), re = c.node.event.created_at * 1e3;
    return {
      id: c.node.eventId,
      eventId: c.node.eventId,
      pubkeyHex: c.node.authorPubkey,
      kind: c.node.event.kind,
      content: c.node.event.content,
      tags: c.node.event.tags.map((le) => [...le]),
      createdAt: re,
      postedAt: re,
      relayHints: [...c.node.relayUrls],
      acceptedRelays: [...c.node.relayUrls],
      fetchedRelays: [...c.node.relayUrls],
      media: [],
      rawEvent: c.node.event,
      updatedAt: T,
      schemaVersion: 1
    };
  }
  function ls(c) {
    const T = Date.now(), re = c.created_at * 1e3;
    return {
      id: c.id,
      eventId: c.id,
      pubkeyHex: c.pubkey,
      kind: c.kind,
      content: c.content,
      tags: c.tags.map((le) => [...le]),
      createdAt: re,
      postedAt: re,
      relayHints: [],
      acceptedRelays: [],
      fetchedRelays: [],
      media: [],
      rawEvent: c,
      updatedAt: T,
      schemaVersion: 1
    };
  }
  function Hr(c, T) {
    return `quote-preview:${c}:${T}`;
  }
  function aa(c, T) {
    T && fe.closeAllPostItemMenus(), fe.setPostMenuOpen(c, T);
  }
  function Hn(c) {
    w(he, c, !0), w(dt, !0);
  }
  function Dr(c) {
    Hn(c.node.event);
  }
  function d(c) {
    return se.copyState[c] === "failed";
  }
  function v(c) {
    return a($e)[c] === "sending";
  }
  function H(c, T) {
    se.captureCopyPointerPosition(Ar(c), T);
  }
  function B(c, T) {
    se.handleCopyNevent(Ar(c), T);
  }
  function j(c) {
    pe(Ar(c));
  }
  function oe() {
    return {
      client: vd.externalNostrClient,
      customUrlTemplate: vd.externalNostrClientCustomUrl
    };
  }
  function W() {
    const c = Vh(oe());
    return c ? r()("postHistory.openInExternalClient", { values: { client: c } }) : r()("postHistory.openInExternalClientFallback");
  }
  function pe(c) {
    const T = jh(c, oe(), Rc.value);
    T && window.open(T, "_blank", "noopener,noreferrer");
  }
  function Pe(c, T) {
    wr(Ar(c), T);
  }
  function Le(c, T) {
    cr(Ar(c), T);
  }
  function ke(c) {
    return md(Ar(c), f());
  }
  function He(c) {
    return a(xe)[c] === "sending";
  }
  function Fe(c) {
    const T = Ar(c);
    Er(T) && fe.openDeleteConfirm(T);
  }
  async function ut(c) {
    y() && await y()(c) !== !1 && Mn();
  }
  function ht(c) {
    x() && (x()(c), Mn());
  }
  function Tt() {
    fe.cancelDeleteConfirm();
  }
  async function Xt() {
    await Za(), a(we) === "search" && a(jn)?.focus({ preventScroll: !0 });
  }
  function At() {
    if (a(we) === "search") {
      Pr(), w(Ce, !1);
      return;
    }
    w(we, "search"), w(Ce, !1), Xt();
  }
  function Pr() {
    Me.clearCurrentSessionScrollAnchor(), w(we, "none"), F.resetSearchState();
  }
  async function zr(c) {
    Me.clearAllSessionScrollAnchorsForCurrentPubkey(), w(we, "none"), F.resetSearchState(), await F.jumpToCreatedAt(c.createdAt) && Me.resetHistoryScrollSoon();
  }
  function ur() {
    const c = a(we) !== "jump-date";
    w(we, c ? "jump-date" : "none", !0), c || w(de, !1), w(Ce, !1);
  }
  function sa() {
    w(we, "none"), w(de, !1);
  }
  function it(c) {
    const T = a(G) ?? a(ce);
    !T || c === 0 || w(G, T.add({ years: c }), !0);
  }
  function fn() {
    w(Te, !0), w(Ce, !1);
  }
  function ba() {
    w(N, !0), w(Ce, !1);
  }
  function $r() {
    Ze && (clearTimeout(Ze), Ze = void 0), w(ie, !1);
  }
  function Ca() {
    const c = /* @__PURE__ */ new Date();
    return [
      String(c.getFullYear()).padStart(4, "0"),
      String(c.getMonth() + 1).padStart(2, "0"),
      String(c.getDate()).padStart(2, "0")
    ].join("-");
  }
  function ds(c) {
    $r(), w(
      q,
      c.isPartial ? "postHistory.exportPartial" : "postHistory.exportComplete",
      !0
    ), w(
      Oe,
      {
        exported: c.exportedEventCount,
        skipped: c.skippedPostCount + c.missingDeletionRawEventCount + c.invalidDeletionRawEventCount
      },
      !0
    ), w(ie, !0), Ze = setTimeout(
      () => {
        w(ie, !1), Ze = void 0;
      },
      5e3
    );
  }
  async function cs() {
    if (!f() || a(I))
      return;
    w(I, !0), w(Q, { phase: "loading" }, !0);
    const c = new AbortController();
    ne = c, ue = f(), w(Ce, !1), $r();
    try {
      const { result: T, blob: re } = await i0.exportForPubkeyInWorker(f(), {
        signal: c.signal,
        onProgress: (Je) => {
          w(Q, Je, !0);
        }
      });
      if (c.signal.aborted)
        return;
      const le = URL.createObjectURL(re), Re = document.createElement("a");
      Re.href = le, Re.download = `ehagaki-post-history-${Ca()}.jsonl`, Re.style.display = "none", l.appendChild(Re), Re.click(), setTimeout(
        () => {
          Re.remove(), URL.revokeObjectURL?.(le);
        },
        1e3
      ), ds(T);
    } catch (T) {
      if (c.signal.aborted || T instanceof DOMException && T.name === "AbortError")
        return;
      w(q, "postHistory.exportFailed"), w(Oe, {}, !0), w(ie, !0), Ze = setTimeout(
        () => {
          w(ie, !1), Ze = void 0;
        },
        5e3
      );
    } finally {
      ne === c && (ne = void 0, ue = void 0, w(I, !1));
    }
  }
  async function _s() {
    const c = Me.captureHistoryScrollAnchor(), T = a(Ye)?.scrollTop ?? null;
    await F.refreshAfterLocalImport(), !F.isSearchMode && a(Ye) && !Me.restoreHistoryScrollAnchor(c) && T !== null && (a(Ye).scrollTop = T);
  }
  function Ua() {
    w(Ce, !1), F.refetchAroundCurrentView();
  }
  function us() {
    Me.clearAllSessionScrollAnchorsForCurrentPubkey(), w(Ce, !1), F.jumpToOldest().then((c) => {
      (c || !Me.isHistoryScrolledToBottom) && Me.resetHistoryScrollToBottomSoon();
    });
  }
  function Us() {
    w(Ce, !1), ta();
  }
  function Es() {
    w(Te, !1);
  }
  function Va(c) {
    w(Xe, c.mediaList, !0), w(je, c.index, !0), w(et, c.mediaList.length > 0 && c.index >= 0, !0);
  }
  function hs(c) {
    w(je, c, !0);
  }
  function fs() {
    w(et, !1), w(Xe, [], !0), w(je, -1);
  }
  async function Vs() {
    const c = fe.deleteTargetPost;
    if (!c)
      return;
    w(
      xe,
      {
        ...a(xe),
        [c.eventId]: "sending"
      },
      !0
    );
    const T = await Zh.requestDeletion({ post: c, rxNostr: _() });
    T.success && typeof T.deletedAt == "number" && T.deletionEventId ? (F.patchDeletedPost(c.eventId, T.deletedAt, T.deletionEventId), te.recordDeletedEvent({
      eventId: c.eventId,
      authorPubkey: c.pubkeyHex,
      deletionEvent: T.deletionEvent ?? null,
      deletionEventAttestation: T.deletionEventAttestation
    }).catch(() => {
    }), w(
      xe,
      {
        ...a(xe),
        [c.eventId]: void 0
      },
      !0
    )) : w(xe, { ...a(xe), [c.eventId]: "failed" }, !0), fe.clearDeleteTarget();
  }
  async function As() {
    await F.deleteLocalHistory() && (Me.clearAllSessionScrollAnchorsForCurrentPubkey(), w(Te, !1), w(we, "none"), Me.resetHistoryScrollSoon());
  }
  var js = {
    get show() {
      return b();
    },
    set show(c = !1) {
      b(c), R();
    },
    get onClose() {
      return g();
    },
    set onClose(c) {
      g(c), R();
    },
    get onReplyPost() {
      return y();
    },
    set onReplyPost(c = void 0) {
      y(c), R();
    },
    get onQuotePost() {
      return x();
    },
    set onQuotePost(c = void 0) {
      x(c), R();
    },
    get pubkeyHex() {
      return f();
    },
    set pubkeyHex(c = null) {
      f(c), R();
    },
    get rxNostr() {
      return _();
    },
    set rxNostr(c = void 0) {
      _(c), R();
    },
    get relayConfig() {
      return C();
    },
    set relayConfig(c = null) {
      C(c), R();
    },
    get latestPostedEvent() {
      return m();
    },
    set latestPostedEvent(c = null) {
      m(c), R();
    },
    get inboundInteractionSave() {
      return o();
    },
    set inboundInteractionSave(c = null) {
      o(c), R();
    },
    get authoredSelfPostSave() {
      return O();
    },
    set authoredSelfPostSave(c = null) {
      O(c), R();
    },
    get reconcileInboundDirectReplyCandidates() {
      return z();
    },
    set reconcileInboundDirectReplyCandidates(c = void 0) {
      z(c), R();
    },
    get notifySavedAuthoredPosts() {
      return $();
    },
    set notifySavedAuthoredPosts(c = void 0) {
      $(c), R();
    }
  }, ja = Lb(), Ka = Z(ja);
  {
    const c = (le) => {
      var Re = Ee(), Je = Z(Re);
      {
        const mt = (bt, ze) => {
          let Rt = () => ze?.().props;
          {
            let Zn = S(() => r()("global.close"));
            ar(bt, Hs(Rt, {
              className: "modal-close",
              shape: "square",
              get ariaLabel() {
                return a(Zn);
              },
              children: (hr, wa) => {
                var fr = l0();
                ge((Qr) => Cn(fr, "aria-label", Qr), [() => r()("global.close")]), D(hr, fr);
              },
              $$slots: { default: !0 }
            }));
          }
        };
        De(Je, () => Bc, (bt, ze) => {
          ze(bt, { child: mt, $$slots: { child: !0 } });
        });
      }
      D(le, Re);
    };
    let T = S(() => r()("postHistory.title")), re = S(() => r()("postHistory.description"));
    Nc(Ka, {
      onOpenChange: (le) => !le && Mn(),
      onInteractOutside: br,
      onEscapeKeydown: ua,
      trapFocus: !1,
      get title() {
        return a(T);
      },
      get description() {
        return a(re);
      },
      contentClass: "post-history-dialog",
      footerVariant: "close-button",
      showPagination: !1,
      initialFocus: "content",
      get open() {
        return b();
      },
      set open(le) {
        b(le);
      },
      footer: c,
      children: (le, Re) => {
        var Je = Db(), mt = Z(Je), bt = M(mt), ze = M(bt);
        {
          var Rt = (Be) => {
            var rt = d0(), lt = M(rt), Nt = M(lt, !0);
            A(lt), A(rt), ge(() => J(Nt, Me.currentMonthLabel)), Ao("click", lt, ur), D(Be, rt);
          };
          me(ze, (Be) => {
            Me.currentMonthLabel && Be(Rt);
          });
        }
        A(bt);
        var Zn = L(bt, 2), hr = M(Zn);
        {
          var wa = (Be) => {
            {
              let rt = S(() => a(Q).phase === "loading" ? r()("postHistory.exportLoading") : a(Q).phase === "verifying" ? r()("postHistory.exportVerifying", {
                values: {
                  processed: a(Q).processed ?? 0,
                  total: a(Q).total ?? 0
                }
              }) : r()("postHistory.exportCreating"));
              Zs(Be, {
                get text() {
                  return a(rt);
                },
                showLoader: !0,
                loaderSize: 30,
                state: "loading",
                customClass: "status-loading-placeholder"
              });
            }
          }, fr = (Be) => {
            {
              let rt = S(() => a(Tn) ? r()(a(un), { values: a(Tn) }) : r()(a(un))), lt = S(() => F.showStatusLoader ? "loading" : "complete"), Nt = S(() => `status-loading-placeholder${a(Kn) ? " status-error" : ""}`);
              Zs(Be, {
                get text() {
                  return a(rt);
                },
                get showLoader() {
                  return F.showStatusLoader;
                },
                loaderSize: 30,
                get state() {
                  return a(lt);
                },
                get customClass() {
                  return a(Nt);
                }
              });
            }
          };
          me(hr, (Be) => {
            a(I) ? Be(wa) : a(un) && Be(fr, 1);
          });
        }
        var Qr = L(hr, 2);
        {
          var Ya = (Be) => {
            var rt = c0(), lt = M(rt), Nt = M(lt), In = M(Nt, !0);
            A(Nt), A(lt), A(rt), ge((Xn) => J(In, Xn), [() => Sn()]), D(Be, rt);
          }, Ks = S(() => Sn());
          me(Qr, (Be) => {
            a(Ks) && Be(Ya);
          });
        }
        var vs = L(Qr, 2);
        De(vs, () => yd, (Be, rt) => {
          rt(Be, {
            get open() {
              return a(Ce);
            },
            set open(lt) {
              w(Ce, lt, !0);
            },
            children: (lt, Nt) => {
              var In = w0(), Xn = Z(In);
              {
                let Br = S(() => `menu-trigger post-history-menu-trigger post-history-heading-menu-trigger ${a(Ce) ? "is-open" : ""}`.trim()), dn = S(() => r()("postHistory.openMenu"));
                De(Xn, () => pd, (Jt, Bt) => {
                  Bt(Jt, {
                    get class() {
                      return a(Br);
                    },
                    get "aria-label"() {
                      return a(dn);
                    },
                    children: (Qe, Y) => {
                      var We = u0();
                      D(Qe, We);
                    },
                    $$slots: { default: !0 }
                  });
                });
              }
              var Qn = L(Xn, 2);
              De(Qn, () => Ro, (Br, dn) => {
                dn(Br, {
                  get to() {
                    return l;
                  },
                  children: (Jt, Bt) => {
                    var Qe = Ee(), Y = Z(Qe);
                    De(Y, () => gd, (We, qt) => {
                      qt(We, {
                        side: "bottom",
                        align: "end",
                        sideOffset: 8,
                        class: "post-history-menu-content",
                        trapFocus: !1,
                        preventScroll: !1,
                        onCloseAutoFocus: (en) => en.preventDefault(),
                        children: (en, er) => {
                          var vt = C0(), Ut = M(vt);
                          De(Ut, () => Vn, (Ot, Ft) => {
                            Ft(Ot, {
                              class: "menu-action-button",
                              onSelect: At,
                              children: (vn, pn) => {
                                var rr = h0(), Lt = L(Z(rr), 2), Ve = M(Lt, !0);
                                A(Lt), ge((Ne) => J(Ve, Ne), [() => r()("postHistory.showSearch")]), D(vn, rr);
                              },
                              $$slots: { default: !0 }
                            });
                          });
                          var Mt = L(Ut, 2);
                          {
                            let Ot = S(() => !F.canRefetchAroundCurrentView);
                            De(Mt, () => Vn, (Ft, vn) => {
                              vn(Ft, {
                                class: "menu-action-button",
                                get disabled() {
                                  return a(Ot);
                                },
                                onSelect: Ua,
                                children: (pn, rr) => {
                                  var Lt = f0(), Ve = L(Z(Lt), 2), Ne = M(Ve, !0);
                                  A(Ve), ge((Gt) => J(Ne, Gt), [() => r()("postHistory.repair")]), D(pn, Lt);
                                },
                                $$slots: { default: !0 }
                              });
                            });
                          }
                          var tr = L(Mt, 2);
                          De(tr, () => Fa, (Ot, Ft) => {
                            Ft(Ot, { class: "post-history-menu-separator" });
                          });
                          var nr = L(tr, 2);
                          {
                            let Ot = S(() => !a(lr));
                            De(nr, () => Vn, (Ft, vn) => {
                              vn(Ft, {
                                class: "menu-action-button",
                                get disabled() {
                                  return a(Ot);
                                },
                                onSelect: Us,
                                children: (pn, rr) => {
                                  var Lt = v0(), Ve = L(Z(Lt), 2), Ne = M(Ve, !0);
                                  A(Ve), ge((Gt) => J(Ne, Gt), [() => r()("postHistory.returnToLatest")]), D(pn, Lt);
                                },
                                $$slots: { default: !0 }
                              });
                            });
                          }
                          var Wn = L(nr, 2);
                          De(Wn, () => Vn, (Ot, Ft) => {
                            Ft(Ot, {
                              class: "menu-action-button",
                              onSelect: ur,
                              children: (vn, pn) => {
                                var rr = p0(), Lt = L(Z(rr), 2), Ve = M(Lt, !0);
                                A(Lt), ge((Ne) => J(Ve, Ne), [() => r()("postHistory.jumpToDate")]), D(vn, rr);
                              },
                              $$slots: { default: !0 }
                            });
                          });
                          var Rn = L(Wn, 2);
                          {
                            let Ot = S(() => !a(Wt));
                            De(Rn, () => Vn, (Ft, vn) => {
                              vn(Ft, {
                                class: "menu-action-button",
                                get disabled() {
                                  return a(Ot);
                                },
                                onSelect: us,
                                children: (pn, rr) => {
                                  var Lt = g0(), Ve = L(Z(Lt), 2), Ne = M(Ve, !0);
                                  A(Ve), ge((Gt) => J(Ne, Gt), [() => r()("postHistory.jumpToOldest")]), D(pn, Lt);
                                },
                                $$slots: { default: !0 }
                              });
                            });
                          }
                          var vr = L(Rn, 2);
                          De(vr, () => Fa, (Ot, Ft) => {
                            Ft(Ot, { class: "post-history-menu-separator" });
                          });
                          var qr = L(vr, 2);
                          {
                            let Ot = S(() => !f() || a(I));
                            De(qr, () => Vn, (Ft, vn) => {
                              vn(Ft, {
                                class: "menu-action-button",
                                get disabled() {
                                  return a(Ot);
                                },
                                onSelect: cs,
                                children: (pn, rr) => {
                                  var Lt = y0(), Ve = L(Z(Lt), 2), Ne = M(Ve, !0);
                                  A(Ve), ge((Gt) => J(Ne, Gt), [() => r()("postHistory.export")]), D(pn, Lt);
                                },
                                $$slots: { default: !0 }
                              });
                            });
                          }
                          var ia = L(qr, 2);
                          {
                            let Ot = S(() => !f());
                            De(ia, () => Vn, (Ft, vn) => {
                              vn(Ft, {
                                class: "menu-action-button",
                                get disabled() {
                                  return a(Ot);
                                },
                                onSelect: ba,
                                children: (pn, rr) => {
                                  var Lt = m0(), Ve = L(Z(Lt), 2), Ne = M(Ve, !0);
                                  A(Ve), ge((Gt) => J(Ne, Gt), [() => r()("postHistory.import")]), D(pn, Lt);
                                },
                                $$slots: { default: !0 }
                              });
                            });
                          }
                          var ms = L(ia, 2);
                          De(ms, () => Fa, (Ot, Ft) => {
                            Ft(Ot, { class: "post-history-menu-separator" });
                          });
                          var Ta = L(ms, 2);
                          De(Ta, () => Vn, (Ot, Ft) => {
                            Ft(Ot, {
                              class: "menu-action-button menu-action-button-danger",
                              onSelect: fn,
                              children: (vn, pn) => {
                                var rr = b0(), Lt = L(Z(rr), 2), Ve = M(Lt, !0);
                                A(Lt), ge((Ne) => J(Ve, Ne), [() => r()("postHistory.deleteLocalHistory")]), D(vn, rr);
                              },
                              $$slots: { default: !0 }
                            });
                          }), A(vt), D(en, vt);
                        },
                        $$slots: { default: !0 }
                      });
                    }), D(Jt, Qe);
                  },
                  $$slots: { default: !0 }
                });
              }), D(lt, In);
            },
            $$slots: { default: !0 }
          });
        }), A(Zn), A(mt);
        var Ys = L(mt, 2);
        {
          var kr = (Be) => {
            var rt = S0(), lt = M(rt);
            let Nt;
            var In = M(lt), Xn = M(In);
            {
              var Qn = (Bt) => {
                Zs(Bt, {
                  variant: "spinner",
                  showLoader: !0,
                  loaderSize: 24,
                  ariaHidden: !0,
                  customClass: "post-history-search-spinner"
                });
              }, Br = (Bt) => {
                var Qe = P0();
                D(Bt, Qe);
              };
              me(Xn, (Bt) => {
                F.isSearchPageLoading ? Bt(Qn) : Bt(Br, -1);
              });
            }
            A(In);
            var dn = L(In, 2);
            Kh(dn), Bi(dn, (Bt) => w(jn, Bt), () => a(jn)), A(lt);
            var Jt = L(lt, 2);
            {
              let Bt = S(() => r()("postHistory.hideSearch"));
              ar(Jt, {
                type: "button",
                class: "post-history-search-close",
                contentLayout: "icon",
                shape: "square",
                get ariaLabel() {
                  return a(Bt);
                },
                onClick: Pr,
                children: (Qe, Y) => {
                  var We = x0();
                  D(Qe, We);
                },
                $$slots: { default: !0 }
              });
            }
            A(rt), ge(
              (Bt, Qe) => {
                Nt = Na(lt, 1, "post-history-search-input-wrapper svelte-uxr0i8", null, Nt, { "post-history-search-active": F.isSearchMode }), Cn(dn, "placeholder", Bt), Cn(dn, "aria-label", Qe), Cn(dn, "aria-busy", F.isSearchPageLoading ? "true" : "false");
              },
              [
                () => r()("postHistory.searchPlaceholder"),
                () => r()("postHistory.search")
              ]
            ), Qh(dn, () => F.state.searchInput, (Bt) => F.state.searchInput = Bt), D(Be, rt);
          };
          me(Ys, (Be) => {
            a(we) === "search" && Be(kr);
          });
        }
        var ps = L(Ys, 2);
        {
          var za = (Be) => {
            var rt = O0(), lt = M(rt), Nt = M(lt, !0);
            A(lt);
            var In = L(lt, 2), Xn = M(In);
            {
              let dn = S(() => n() ?? void 0), Jt = S(() => r()("postHistory.jumpToDateLabel"));
              De(Xn, () => Eu, (Bt, Qe) => {
                Qe(Bt, {
                  get locale() {
                    return a(dn);
                  },
                  get calendarLabel() {
                    return a(Jt);
                  },
                  get value() {
                    return a(ce);
                  },
                  set value(Y) {
                    w(ce, Y, !0);
                  },
                  get placeholder() {
                    return a(G);
                  },
                  set placeholder(Y) {
                    w(G, Y, !0);
                  },
                  get open() {
                    return a(de);
                  },
                  set open(Y) {
                    w(de, Y, !0);
                  },
                  children: (Y, We) => {
                    var qt = k0(), en = Z(qt);
                    {
                      const Ut = (Mt, tr) => {
                        let nr = () => tr?.().segments;
                        var Wn = Ee(), Rn = Z(Wn);
                        da(Rn, 19, nr, (vr, qr) => `${vr.part}-${qr}`, (vr, qr) => {
                          var ia = Ee(), ms = Z(ia);
                          De(ms, () => Ru, (Ta, Ot) => {
                            Ot(Ta, {
                              class: "post-history-date-picker-segment",
                              get part() {
                                return a(qr).part;
                              },
                              children: (Ft, vn) => {
                                ws();
                                var pn = Ba();
                                ge(() => J(pn, a(qr).value)), D(Ft, pn);
                              },
                              $$slots: { default: !0 }
                            });
                          }), D(vr, ia);
                        }), D(Mt, Wn);
                      };
                      De(en, () => Iu, (Mt, tr) => {
                        tr(Mt, {
                          "aria-labelledby": "post-history-jump-date-label",
                          class: "post-history-date-picker-input",
                          children: Ut,
                          $$slots: { default: !0 }
                        });
                      });
                    }
                    var er = L(en, 2);
                    {
                      let Ut = S(() => r()("postHistory.jumpToDate"));
                      De(er, () => ku, (Mt, tr) => {
                        tr(Mt, {
                          class: "post-history-date-picker-trigger",
                          get "aria-label"() {
                            return a(Ut);
                          },
                          children: (nr, Wn) => {
                            var Rn = I0();
                            D(nr, Rn);
                          },
                          $$slots: { default: !0 }
                        });
                      });
                    }
                    var vt = L(er, 2);
                    De(vt, () => Ro, (Ut, Mt) => {
                      Mt(Ut, {
                        get to() {
                          return l;
                        },
                        children: (tr, nr) => {
                          var Wn = Ee(), Rn = Z(Wn);
                          De(Rn, () => Du, (vr, qr) => {
                            qr(vr, {
                              sideOffset: 8,
                              class: "post-history-date-picker-content",
                              children: (ia, ms) => {
                                var Ta = Ee(), Ot = Z(Ta);
                                {
                                  const Ft = (vn, pn) => {
                                    let rr = () => pn?.().months, Lt = () => pn?.().weekdays;
                                    var Ve = D0(), Ne = Z(Ve);
                                    De(Ne, () => Cu, (_n, Nn) => {
                                      Nn(_n, {
                                        class: "post-history-date-picker-header",
                                        children: (pr, Jr) => {
                                          var En = E0(), tn = Z(En), gn = L(tn, 2);
                                          De(gn, () => xu, (pt, jt) => {
                                            jt(pt, {
                                              class: "post-history-date-picker-nav",
                                              "aria-label": "Previous month",
                                              children: (cn, Dn) => {
                                                var nn = R0();
                                                D(cn, nn);
                                              },
                                              $$slots: { default: !0 }
                                            });
                                          });
                                          var An = L(gn, 2);
                                          De(An, () => wu, (pt, jt) => {
                                            jt(pt, { class: "post-history-date-picker-heading" });
                                          });
                                          var qe = L(An, 2);
                                          De(qe, () => Pu, (pt, jt) => {
                                            jt(pt, {
                                              class: "post-history-date-picker-nav",
                                              "aria-label": "Next month",
                                              children: (cn, Dn) => {
                                                var nn = _0();
                                                D(cn, nn);
                                              },
                                              $$slots: { default: !0 }
                                            });
                                          });
                                          var Vt = L(qe, 2);
                                          Ao("click", tn, () => it(-1)), Ao("click", Vt, () => it(1)), D(pr, En);
                                        },
                                        $$slots: { default: !0 }
                                      });
                                    });
                                    var Gt = L(Ne, 2);
                                    da(Gt, 19, rr, (_n, Nn) => `${_n.value.toString()}-${Nn}`, (_n, Nn) => {
                                      var pr = Ee(), Jr = Z(pr);
                                      De(Jr, () => pu, (En, tn) => {
                                        tn(En, {
                                          class: "post-history-date-picker-grid",
                                          children: (gn, An) => {
                                            var qe = A0(), Vt = Z(qe);
                                            De(Vt, () => mu, (jt, cn) => {
                                              cn(jt, {
                                                children: (Dn, nn) => {
                                                  var Kt = Ee(), Zt = Z(Kt);
                                                  De(Zt, () => Yi, (Bn, yn) => {
                                                    yn(Bn, {
                                                      children: (_t, mn) => {
                                                        var Et = Ee(), Ke = Z(Et);
                                                        da(Ke, 19, Lt, (Ct, rn) => `${Ct}-${rn}`, (Ct, rn) => {
                                                          var wt = Ee(), Yt = Z(wt);
                                                          De(Yt, () => bu, (ft, qn) => {
                                                            qn(ft, {
                                                              class: "post-history-date-picker-weekday",
                                                              children: (kn, Gr) => {
                                                                ws();
                                                                var Un = Ba();
                                                                ge(() => J(Un, a(rn))), D(kn, Un);
                                                              },
                                                              $$slots: { default: !0 }
                                                            });
                                                          }), D(Ct, wt);
                                                        }), D(_t, Et);
                                                      },
                                                      $$slots: { default: !0 }
                                                    });
                                                  }), D(Dn, Kt);
                                                },
                                                $$slots: { default: !0 }
                                              });
                                            });
                                            var pt = L(Vt, 2);
                                            De(pt, () => gu, (jt, cn) => {
                                              cn(jt, {
                                                children: (Dn, nn) => {
                                                  var Kt = Ee(), Zt = Z(Kt);
                                                  da(Zt, 19, () => a(Nn).weeks, (Bn, yn) => `${a(Nn).value.toString()}-week-${yn}`, (Bn, yn) => {
                                                    var _t = Ee(), mn = Z(_t);
                                                    De(mn, () => Yi, (Et, Ke) => {
                                                      Ke(Et, {
                                                        children: (Ct, rn) => {
                                                          var wt = Ee(), Yt = Z(wt);
                                                          da(Yt, 19, () => a(yn), (ft, qn) => `${ft.toString()}-${qn}`, (ft, qn) => {
                                                            var kn = Ee(), Gr = Z(kn);
                                                            De(Gr, () => yu, (Un, Tr) => {
                                                              Tr(Un, {
                                                                get date() {
                                                                  return a(qn);
                                                                },
                                                                get month() {
                                                                  return a(Nn).value;
                                                                },
                                                                children: (ti, ni) => {
                                                                  var Qs = Ee(), ri = Z(Qs);
                                                                  De(ri, () => vu, (ai, la) => {
                                                                    la(ai, {
                                                                      class: "post-history-date-picker-day",
                                                                      children: (Ja, Ws) => {
                                                                        ws();
                                                                        var ks = Ba();
                                                                        ge(() => J(ks, a(qn).day)), D(Ja, ks);
                                                                      },
                                                                      $$slots: { default: !0 }
                                                                    });
                                                                  }), D(ti, Qs);
                                                                },
                                                                $$slots: { default: !0 }
                                                              });
                                                            }), D(ft, kn);
                                                          }), D(Ct, wt);
                                                        },
                                                        $$slots: { default: !0 }
                                                      });
                                                    }), D(Bn, _t);
                                                  }), D(Dn, Kt);
                                                },
                                                $$slots: { default: !0 }
                                              });
                                            }), D(gn, qe);
                                          },
                                          $$slots: { default: !0 }
                                        });
                                      }), D(_n, pr);
                                    }), D(vn, Ve);
                                  };
                                  De(Ot, () => Au, (vn, pn) => {
                                    pn(vn, {
                                      class: "post-history-date-picker-calendar",
                                      children: Ft,
                                      $$slots: { default: !0 }
                                    });
                                  });
                                }
                                D(ia, Ta);
                              },
                              $$slots: { default: !0 }
                            });
                          }), D(tr, Wn);
                        },
                        $$slots: { default: !0 }
                      });
                    }), D(Y, qt);
                  },
                  $$slots: { default: !0 }
                });
              });
            }
            var Qn = L(Xn, 2);
            {
              let dn = S(() => r()("postHistory.jumpToDateSubmit"));
              ar(Qn, {
                type: "button",
                variant: "primary",
                contentLayout: "icon",
                shape: "square",
                get ariaLabel() {
                  return a(dn);
                },
                className: "post-history-utility-button post-history-utility-submit-button",
                onClick: () => void na(),
                children: (Jt, Bt) => {
                  var Qe = T0();
                  D(Jt, Qe);
                },
                $$slots: { default: !0 }
              });
            }
            var Br = L(Qn, 2);
            {
              let dn = S(() => r()("postHistory.hideJumpToDate"));
              ar(Br, {
                type: "button",
                variant: "default",
                contentLayout: "icon",
                shape: "square",
                get ariaLabel() {
                  return a(dn);
                },
                className: "post-history-utility-button post-history-utility-close-button",
                onClick: sa,
                children: (Jt, Bt) => {
                  var Qe = M0();
                  D(Jt, Qe);
                },
                $$slots: { default: !0 }
              });
            }
            A(In), A(rt), ge((dn) => J(Nt, dn), [() => r()("postHistory.jumpToDateLabel")]), D(Be, rt);
          };
          me(ps, (Be) => {
            a(we) === "jump-date" && Be(za);
          });
        }
        var Wr = L(ps, 2), gs = M(Wr);
        {
          var $n = (Be) => {
            var rt = F0(), lt = M(rt);
            Zs(lt, { variant: "spinner", showLoader: !0, loaderSize: 24 }), A(rt), D(Be, rt);
          }, Qa = (Be) => {
            var rt = L0(), lt = M(rt), Nt = M(lt, !0);
            A(lt), A(rt), ge((In) => J(Nt, In), [
              () => F.isSearchMode ? r()("postHistory.searchNoResults") : r()("postHistory.empty")
            ]), D(Be, rt);
          }, Wa = (Be) => {
            var rt = _b(), lt = Z(rt);
            {
              var Nt = (Qe) => {
                var Y = $0(), We = M(Y);
                {
                  let qt = S(() => !F.canLoadNewer);
                  ar(We, {
                    type: "button",
                    variant: "default",
                    className: "post-history-nav-button",
                    contentLayout: "iconText",
                    get disabled() {
                      return a(qt);
                    },
                    onClick: () => void Ir(),
                    children: (en, er) => {
                      var vt = H0(), Ut = L(Z(vt));
                      ge((Mt) => J(Ut, ` ${Mt ?? ""}`), [() => Sr()]), D(en, vt);
                    },
                    $$slots: { default: !0 }
                  });
                }
                A(Y), D(Qe, Y);
              };
              me(lt, (Qe) => {
                (F.isSearchMode ? F.canLoadNewer : F.state.hasNewerLocal) && Qe(Nt);
              });
            }
            var In = L(lt, 2);
            da(In, 21, () => F.posts, (Qe) => Qe.eventId, (Qe, Y) => {
              const We = S(() => te.getAnchorState(a(Y)));
              var qt = mb();
              let en;
              var er = M(qt), vt = M(er), Ut = M(vt);
              {
                var Mt = (Ve) => {
                  var Ne = W0(), Gt = M(Ne);
                  {
                    var _n = (qe) => {
                      var Vt = N0(), pt = L(M(Vt), 2), jt = M(pt, !0);
                      A(pt);
                      var cn = L(pt, 2), Dn = M(cn, !0);
                      A(cn), A(Vt), ge(
                        (nn, Kt) => {
                          J(jt, nn), J(Dn, Kt);
                        },
                        [
                          () => r()("postHistory.channel"),
                          () => X.getChannelText(a(Y), r())
                        ]
                      ), D(qe, Vt);
                    };
                    me(Gt, (qe) => {
                      a(Y).kind === 42 && qe(_n);
                    });
                  }
                  var Nn = L(Gt, 2), pr = M(Nn);
                  {
                    var Jr = (qe) => {
                      var Vt = U0(), pt = M(Vt);
                      {
                        var jt = (Kt) => {
                          var Zt = B0(), Bn = M(Zt, !0);
                          A(Zt), ge((yn) => J(Bn, yn), [() => r()("postHistory.deletedBadge")]), D(Kt, Zt);
                        };
                        me(pt, (Kt) => {
                          a(Y).deletedAt && Kt(jt);
                        });
                      }
                      var cn = L(pt, 2);
                      {
                        var Dn = (Kt) => {
                          var Zt = q0(), Bn = M(Zt, !0);
                          A(Zt), ge((yn) => J(Bn, yn), [() => r()("postHistory.deleteFailed")]), D(Kt, Zt);
                        }, nn = S(() => jr(a(Y)));
                        me(cn, (Kt) => {
                          a(nn) && Kt(Dn);
                        });
                      }
                      A(Vt), D(qe, Vt);
                    }, En = S(() => a(Y).deletedAt || jr(a(Y)));
                    me(pr, (qe) => {
                      a(En) && qe(Jr);
                    });
                  }
                  var tn = L(pr, 2);
                  {
                    var gn = (qe) => {
                      var Vt = Q0(), pt = Z(Vt), jt = M(pt, !0);
                      A(pt);
                      var cn = L(pt, 2);
                      {
                        let Dn = S(() => fe.isPostMenuOpen(a(Y).eventId));
                        De(cn, () => yd, (nn, Kt) => {
                          Kt(nn, {
                            get open() {
                              return a(Dn);
                            },
                            onOpenChange: (Zt) => aa(a(Y).eventId, Zt),
                            children: (Zt, Bn) => {
                              var yn = z0(), _t = Z(yn);
                              De(_t, () => pd, (Et, Ke) => {
                                Ke(Et, {
                                  class: "menu-trigger post-history-menu-trigger",
                                  "aria-label": "アクションを表示",
                                  children: (Ct, rn) => {
                                    var wt = V0();
                                    D(Ct, wt);
                                  },
                                  $$slots: { default: !0 }
                                });
                              });
                              var mn = L(_t, 2);
                              De(mn, () => Ro, (Et, Ke) => {
                                Ke(Et, {
                                  get to() {
                                    return l;
                                  },
                                  children: (Ct, rn) => {
                                    var wt = Ee(), Yt = Z(wt);
                                    De(Yt, () => gd, (ft, qn) => {
                                      qn(ft, {
                                        side: "bottom",
                                        align: "start",
                                        sideOffset: 8,
                                        class: "post-history-menu-content",
                                        trapFocus: !1,
                                        preventScroll: !1,
                                        onCloseAutoFocus: (kn) => kn.preventDefault(),
                                        children: (kn, Gr) => {
                                          var Un = Y0(), Tr = M(Un), ti = M(Tr, !0);
                                          A(Tr);
                                          var ni = L(Tr, 2);
                                          De(ni, () => Fa, (la, Ja) => {
                                            Ja(la, { class: "post-history-menu-separator" });
                                          });
                                          var Qs = L(ni, 2);
                                          {
                                            var ri = (la) => {
                                              var Ja = K0(), Ws = Z(Ja);
                                              De(Ws, () => Vn, (Js, Gs) => {
                                                Gs(Js, {
                                                  class: "menu-action-button",
                                                  onSelect: () => void zr(a(Y)),
                                                  children: (Ma, Nb) => {
                                                    var sd = j0(), od = L(Z(sd), 2), Ju = M(od, !0);
                                                    A(od), ge((Gu) => J(Ju, Gu), [() => r()("postHistory.jumpToPostDate")]), D(Ma, sd);
                                                  },
                                                  $$slots: { default: !0 }
                                                });
                                              });
                                              var ks = L(Ws, 2);
                                              De(ks, () => Fa, (Js, Gs) => {
                                                Gs(Js, { class: "post-history-menu-separator" });
                                              }), D(la, Ja);
                                            };
                                            me(Qs, (la) => {
                                              F.isSearchMode && la(ri);
                                            });
                                          }
                                          var ai = L(Qs, 2);
                                          {
                                            let la = S(() => se.copyState[a(Y).eventId] === "failed"), Ja = S(() => _r(a(Y))), Ws = S(() => Kr(a(Y))), ks = S(() => Er(a(Y))), Js = S(() => Cr(a(Y))), Gs = S(W);
                                            co(ai, {
                                              order: "standard",
                                              get copyFailed() {
                                                return a(la);
                                              },
                                              get showBroadcast() {
                                                return a(Ja);
                                              },
                                              get broadcastSending() {
                                                return a(Ws);
                                              },
                                              get showDelete() {
                                                return a(ks);
                                              },
                                              showDeleteSeparator: !1,
                                              get deletionSending() {
                                                return a(Js);
                                              },
                                              onCopyPointerDown: (Ma) => se.captureCopyPointerPosition(a(Y), Ma),
                                              onCopyNevent: (Ma) => void se.handleCopyNevent(a(Y), Ma),
                                              get externalClientLabel() {
                                                return a(Gs);
                                              },
                                              onOpenExternalClient: () => pe(a(Y)),
                                              onShowRawJson: () => Hn(a(Y).rawEvent),
                                              onBroadcastPointerDown: (Ma) => wr(a(Y), Ma),
                                              onBroadcastPost: (Ma) => void cr(a(Y), Ma),
                                              onOpenDeleteConfirm: () => Da(a(Y))
                                            });
                                          }
                                          A(Un), ge((la) => J(ti, la), [() => _o(a(Y).postedAt, n())]), D(kn, Un);
                                        },
                                        $$slots: { default: !0 }
                                      });
                                    }), D(Ct, wt);
                                  },
                                  $$slots: { default: !0 }
                                });
                              }), D(Zt, yn);
                            },
                            $$slots: { default: !0 }
                          });
                        });
                      }
                      ge((Dn) => J(jt, Dn), [() => Ni(a(Y).postedAt)]), D(qe, Vt);
                    }, An = S(() => !(y() || x() || kt.shouldCollapsePost(a(Y))));
                    me(tn, (qe) => {
                      a(An) && qe(gn);
                    });
                  }
                  A(Nn), A(Ne), D(Ve, Ne);
                }, tr = S(() => a(Y).kind === 42 || a(Y).deletedAt || jr(a(Y)) || !(y() || x() || kt.shouldCollapsePost(a(Y))));
                me(Ut, (Ve) => {
                  a(tr) && Ve(Mt);
                });
              }
              var nr = L(Ut, 2);
              {
                let Ve = S(W);
                Qi(nr, {
                  get state() {
                    return a(We);
                  },
                  section: "parent",
                  get previewModelByEventId() {
                    return a(Yn);
                  },
                  get emojiLoadStateByUrl() {
                    return Qt.emojiLoadStateByUrl;
                  },
                  get emojiImageMetaByUrl() {
                    return Qt.emojiImageMetaByUrl;
                  },
                  get scrollRoot() {
                    return a(Ye);
                  },
                  onImageOpen: Va,
                  onToggleParent: () => Me.preserveThreadParentToggleScroll(a(Y).eventId, a(Y).eventId, () => te.toggleParent(a(Y))),
                  onRetryParent: () => te.retryParent(a(Y)),
                  onToggleNodeParent: (Ne) => Me.preserveThreadParentToggleScroll(a(Y).eventId, Ne, () => te.toggleNodeParent(a(Y), Ne)),
                  onRetryNodeParent: (Ne) => te.retryNodeParent(a(Y), Ne),
                  onToggleNodeChildren: (Ne) => te.toggleNodeChildren(a(Y), Ne),
                  onRetryNodeChildren: (Ne) => te.retryNodeChildren(a(Y), Ne),
                  onCopyPointerDown: H,
                  onCopyNevent: B,
                  get externalClientLabel() {
                    return a(Ve);
                  },
                  onOpenExternalClient: j,
                  isCopyFailed: d,
                  onShowRawJson: Dr,
                  onBroadcastPointerDown: Pe,
                  onBroadcastPost: Le,
                  isBroadcastSending: v,
                  canDeleteNodePost: ke,
                  isDeletionSending: He,
                  onOpenDeleteConfirm: Fe
                });
              }
              var Wn = L(nr, 2), Rn = M(Wn), vr = M(Rn);
              {
                const Ve = (Nn) => {
                  var pr = Ee(), Jr = Z(pr);
                  {
                    var En = (gn) => {
                      {
                        let An = S(() => kt.isPostExpanded(a(Y))), qe = S(() => "post-preview-content-" + a(Y).eventId);
                        Xh(gn, {
                          get expanded() {
                            return a(An);
                          },
                          get controls() {
                            return a(qe);
                          },
                          onToggle: () => kt.togglePostExpanded(a(Y).eventId)
                        });
                      }
                    }, tn = S(() => Ea(a(Y)) && kt.shouldCollapsePost(a(Y)));
                    me(Jr, (gn) => {
                      a(tn) && gn(En);
                    });
                  }
                  D(Nn, pr);
                };
                let Ne = S(() => Rr(a(Y))), Gt = S(() => "post-preview-content-" + a(Y).eventId), _n = S(() => !kt.isPostExpanded(a(Y)) && kt.shouldCollapsePost(a(Y)));
                Pc(vr, {
                  get model() {
                    return a(Ne);
                  },
                  density: "standard",
                  get emojiLoadStateByUrl() {
                    return Qt.emojiLoadStateByUrl;
                  },
                  get emojiImageMetaByUrl() {
                    return Qt.emojiImageMetaByUrl;
                  },
                  get scrollRoot() {
                    return a(Ye);
                  },
                  get previewCollapseAction() {
                    return kt.previewRef;
                  },
                  get previewCollapseEventId() {
                    return a(Y).eventId;
                  },
                  get previewContentId() {
                    return a(Gt);
                  },
                  get isTextCollapsed() {
                    return a(_n);
                  },
                  onImageOpen: Va,
                  betweenContentAndMedia: Ve,
                  $$slots: { betweenContentAndMedia: !0 }
                });
              }
              var qr = L(vr, 2);
              {
                var ia = (Ve) => {
                  var Ne = J0();
                  da(Ne, 21, () => fa(a(Y)), (Gt) => Gt.eventId, (Gt, _n) => {
                    {
                      const Nn = (Jr) => {
                        var En = Ee(), tn = Z(En);
                        {
                          var gn = (An) => {
                            const qe = S(() => ls(a(_n).event)), Vt = S(() => Hr(a(Y).eventId, a(qe).eventId)), pt = S(() => r()("common.showActions"));
                            {
                              const jt = (nn) => {
                                {
                                  let Kt = S(() => se.copyState[a(qe).eventId] === "failed"), Zt = S(() => _r(a(qe))), Bn = S(() => Kr(a(qe))), yn = S(() => Er(a(qe))), _t = S(() => Cr(a(qe))), mn = S(W);
                                  co(nn, {
                                    order: "standard",
                                    get copyFailed() {
                                      return a(Kt);
                                    },
                                    get showBroadcast() {
                                      return a(Zt);
                                    },
                                    get broadcastSending() {
                                      return a(Bn);
                                    },
                                    get showDelete() {
                                      return a(yn);
                                    },
                                    showDeleteSeparator: !0,
                                    get deletionSending() {
                                      return a(_t);
                                    },
                                    onCopyPointerDown: (Et) => se.captureCopyPointerPosition(a(qe), Et),
                                    onCopyNevent: (Et) => void se.handleCopyNevent(a(qe), Et),
                                    get externalClientLabel() {
                                      return a(mn);
                                    },
                                    onOpenExternalClient: () => pe(a(qe)),
                                    onShowRawJson: () => Hn(a(qe).rawEvent),
                                    onBroadcastPointerDown: (Et) => wr(a(qe), Et),
                                    onBroadcastPost: (Et) => void cr(a(qe), Et),
                                    onOpenDeleteConfirm: () => Da(a(qe))
                                  });
                                }
                              };
                              let cn = S(() => fe.isPostMenuOpen(a(Vt))), Dn = S(() => _o(a(qe).postedAt, n()));
                              Ui(An, {
                                get open() {
                                  return a(cn);
                                },
                                onOpenChange: (nn) => aa(a(Vt), nn),
                                get triggerAriaLabel() {
                                  return a(pt);
                                },
                                get tooltipContent() {
                                  return a(pt);
                                },
                                enableTooltip: !0,
                                get timestamp() {
                                  return a(Dn);
                                },
                                items: jt,
                                $$slots: { items: !0 }
                              });
                            }
                          };
                          me(tn, (An) => {
                            a(_n).status === "resolved" && An(gn);
                          });
                        }
                        D(Jr, En);
                      };
                      let pr = S(() => a(_n).status === "resolved" ? a(Yn)[a(_n).event.id] : void 0);
                      Tu(Gt, {
                        get preview() {
                          return a(_n);
                        },
                        get model() {
                          return a(pr);
                        },
                        get emojiLoadStateByUrl() {
                          return Qt.emojiLoadStateByUrl;
                        },
                        get emojiImageMetaByUrl() {
                          return Qt.emojiImageMetaByUrl;
                        },
                        get scrollRoot() {
                          return a(Ye);
                        },
                        onImageOpen: Va,
                        onRetry: () => ve.retryQuotePreview(a(_n).eventId),
                        footerMenu: Nn,
                        $$slots: { footerMenu: !0 }
                      });
                    }
                  }), A(Ne), D(Ve, Ne);
                }, ms = S(() => fa(a(Y)).length > 0);
                me(qr, (Ve) => {
                  a(ms) && Ve(ia);
                });
              }
              A(Rn);
              var Ta = L(Rn, 2);
              {
                var Ot = (Ve) => {
                  const Ne = S(() => ra(a(Y))), Gt = S(() => a(We).repliesActionState.status === "loaded" && a(We).repliesActionState.replyCount > 0);
                  var _n = vb(), Nn = Z(_n);
                  {
                    const tn = (Vt) => {
                      var pt = eb(), jt = Z(pt), cn = M(jt);
                      {
                        var Dn = (Ke) => {
                          {
                            let Ct = S(() => r()("replyQuote.reply_label")), rn = S(() => r()("replyQuote.reply_label"));
                            ci(Ke, {
                              type: "button",
                              className: "post-preview-action-button post-history-action-button",
                              get ariaLabel() {
                                return a(Ct);
                              },
                              contentLayout: "icon",
                              shape: "circle",
                              onClick: () => ut(a(Y)),
                              get tooltipContent() {
                                return a(rn);
                              },
                              children: (wt, Yt) => {
                                var ft = G0();
                                D(wt, ft);
                              },
                              $$slots: { default: !0 }
                            });
                          }
                        };
                        me(cn, (Ke) => {
                          y() && Ke(Dn);
                        });
                      }
                      var nn = L(cn, 2), Kt = M(nn);
                      {
                        var Zt = (Ke) => {
                          Ql(Ke, {
                            get count() {
                              return a(We).repliesActionState.replyCount;
                            },
                            get selected() {
                              return a(We).repliesActionState.visible;
                            },
                            get ariaLabel() {
                              return a(Ne);
                            },
                            get tooltipContent() {
                              return a(Ne);
                            },
                            onClick: () => ga(a(Y))
                          });
                        };
                        me(Kt, (Ke) => {
                          a(Gt) && Ke(Zt);
                        });
                      }
                      A(nn), A(jt);
                      var Bn = L(jt, 2);
                      {
                        var yn = (Ke) => {
                          {
                            let Ct = S(() => r()("replyQuote.quote_label")), rn = S(() => r()("replyQuote.quote_label"));
                            ci(Ke, {
                              type: "button",
                              className: "post-preview-action-button post-history-action-button",
                              get ariaLabel() {
                                return a(Ct);
                              },
                              contentLayout: "icon",
                              shape: "circle",
                              onClick: () => ht(a(Y)),
                              get tooltipContent() {
                                return a(rn);
                              },
                              children: (wt, Yt) => {
                                var ft = Z0();
                                D(wt, ft);
                              },
                              $$slots: { default: !0 }
                            });
                          }
                        };
                        me(Bn, (Ke) => {
                          x() && Ke(yn);
                        });
                      }
                      var _t = L(Bn, 2), mn = M(_t);
                      {
                        var Et = (Ke) => {
                          {
                            let Ct = S(() => va(a(Y))), rn = S(() => Yr(a(Y))), wt = S(() => va(a(Y)));
                            ci(Ke, {
                              type: "button",
                              className: "post-preview-reactions-button",
                              get ariaLabel() {
                                return a(Ct);
                              },
                              shape: "pill",
                              get selected() {
                                return a(rn);
                              },
                              onClick: () => ln(a(Y)),
                              get tooltipContent() {
                                return a(wt);
                              },
                              children: (Yt, ft) => {
                                var qn = X0(), kn = L(Z(qn), 2), Gr = M(kn, !0);
                                A(kn), ge(() => J(Gr, a(We).reactionSummary.totalCount)), D(Yt, qn);
                              },
                              $$slots: { default: !0 }
                            });
                          }
                        };
                        me(mn, (Ke) => {
                          a(We).reactionSummary.totalCount > 0 && Ke(Et);
                        });
                      }
                      A(_t), D(Vt, pt);
                    }, gn = (Vt) => {
                      const pt = S(() => r()("common.showActions"));
                      {
                        const jt = (nn) => {
                          var Kt = ab(), Zt = Z(Kt);
                          De(Zt, () => Vn, (Ke, Ct) => {
                            Ct(Ke, {
                              class: "menu-action-button",
                              onSelect: () => pe(a(Y)),
                              children: (rn, wt) => {
                                var Yt = tb(), ft = L(Z(Yt), 2), qn = M(ft, !0);
                                A(ft), ge((kn) => J(qn, kn), [() => W()]), D(rn, Yt);
                              },
                              $$slots: { default: !0 }
                            });
                          });
                          var Bn = L(Zt, 2);
                          De(Bn, () => Fa, (Ke, Ct) => {
                            Ct(Ke, { class: "post-history-menu-separator" });
                          });
                          var yn = L(Bn, 2);
                          {
                            let Ke = S(() => a(We).repliesActionState.status === "loading");
                            De(yn, () => Vn, (Ct, rn) => {
                              rn(Ct, {
                                class: "menu-action-button",
                                get disabled() {
                                  return a(Ke);
                                },
                                onSelect: () => ga(a(Y)),
                                children: (wt, Yt) => {
                                  var ft = nb(), qn = Z(ft), kn = L(qn, 2), Gr = M(kn, !0);
                                  A(kn), ge(() => {
                                    Na(qn, 1, `${a(We).repliesActionState.visible ? "collapse-content-icon" : "find_in_page-icon"} svg-icon`, "svelte-uxr0i8"), J(Gr, a(Ne));
                                  }), D(wt, ft);
                                },
                                $$slots: { default: !0 }
                              });
                            });
                          }
                          var _t = L(yn, 2);
                          {
                            var mn = (Ke) => {
                              var Ct = Ee(), rn = Z(Ct);
                              De(rn, () => Vn, (wt, Yt) => {
                                Yt(wt, {
                                  class: "menu-action-button",
                                  onSelect: () => void zr(a(Y)),
                                  children: (ft, qn) => {
                                    var kn = rb(), Gr = L(Z(kn), 2), Un = M(Gr, !0);
                                    A(Gr), ge((Tr) => J(Un, Tr), [() => r()("postHistory.jumpToPostDate")]), D(ft, kn);
                                  },
                                  $$slots: { default: !0 }
                                });
                              }), D(Ke, Ct);
                            };
                            me(_t, (Ke) => {
                              F.isSearchMode && Ke(mn);
                            });
                          }
                          var Et = L(_t, 2);
                          {
                            let Ke = S(() => se.copyState[a(Y).eventId] === "failed"), Ct = S(() => _r(a(Y))), rn = S(() => Kr(a(Y))), wt = S(() => Er(a(Y))), Yt = S(() => Cr(a(Y)));
                            co(Et, {
                              order: "standard",
                              get copyFailed() {
                                return a(Ke);
                              },
                              get showBroadcast() {
                                return a(Ct);
                              },
                              get broadcastSending() {
                                return a(rn);
                              },
                              get showDelete() {
                                return a(wt);
                              },
                              showDeleteSeparator: !0,
                              get deletionSending() {
                                return a(Yt);
                              },
                              onCopyPointerDown: (ft) => se.captureCopyPointerPosition(a(Y), ft),
                              onCopyNevent: (ft) => void se.handleCopyNevent(a(Y), ft),
                              onShowRawJson: () => Hn(a(Y).rawEvent),
                              onBroadcastPointerDown: (ft) => wr(a(Y), ft),
                              onBroadcastPost: (ft) => void cr(a(Y), ft),
                              onOpenDeleteConfirm: () => Da(a(Y))
                            });
                          }
                          D(nn, Kt);
                        };
                        let cn = S(() => fe.isPostMenuOpen(a(Y).eventId)), Dn = S(() => _o(a(Y).postedAt, n()));
                        Ui(Vt, {
                          get open() {
                            return a(cn);
                          },
                          onOpenChange: (nn) => aa(a(Y).eventId, nn),
                          get triggerAriaLabel() {
                            return a(pt);
                          },
                          get tooltipContent() {
                            return a(pt);
                          },
                          enableTooltip: !0,
                          get timestamp() {
                            return a(Dn);
                          },
                          items: jt,
                          $$slots: { items: !0 }
                        });
                      }
                    };
                    let An = S(() => Ni(a(Y).postedAt)), qe = S(() => !!a(Y).deletedAt);
                    qc(Nn, {
                      get formattedDate() {
                        return a(An);
                      },
                      get dimmed() {
                        return a(qe);
                      },
                      actions: tn,
                      trailing: gn,
                      $$slots: { actions: !0, trailing: !0 }
                    });
                  }
                  var pr = L(Nn, 2);
                  {
                    var Jr = (tn) => {
                      var gn = fb();
                      da(gn, 21, () => Aa(a(Y)), (An) => An.content, (An, qe) => {
                        var Vt = hb(), pt = M(Vt), jt = M(pt);
                        {
                          var cn = (_t) => {
                            var mn = sb();
                            D(_t, mn);
                          }, Dn = S(() => Ym(a(qe).content)), nn = (_t) => {
                            var mn = Ee(), Et = Z(mn);
                            {
                              var Ke = (wt) => {
                                var Yt = ob(), ft = M(Yt, !0);
                                A(Yt), ge(() => J(ft, a(qe).content)), D(wt, Yt);
                              }, Ct = S(() => $t(a(qe).emojiUrl)), rn = (wt) => {
                                var Yt = db(), ft = M(Yt);
                                {
                                  var qn = (Un) => {
                                    var Tr = ib();
                                    ge(() => {
                                      Cn(Tr, "src", a(qe).emojiUrl), Cn(Tr, "alt", a(qe).content), Cn(Tr, "title", a(qe).content);
                                    }), D(Un, Tr);
                                  }, kn = S(() => ir(a(qe).emojiUrl)), Gr = (Un) => {
                                    var Tr = lb();
                                    D(Un, Tr);
                                  };
                                  me(ft, (Un) => {
                                    a(kn) ? Un(qn) : Un(Gr, -1);
                                  });
                                }
                                A(Yt), ge((Un) => Qo(Yt, Un), [
                                  () => sn(a(qe).emojiUrl)
                                ]), D(wt, Yt);
                              };
                              me(Et, (wt) => {
                                a(Ct) ? wt(Ke) : wt(rn, -1);
                              });
                            }
                            D(_t, mn);
                          }, Kt = (_t) => {
                            var mn = cb(), Et = M(mn, !0);
                            A(mn), ge(() => J(Et, a(qe).content)), D(_t, mn);
                          };
                          me(jt, (_t) => {
                            a(Dn) ? _t(cn) : a(qe).emojiUrl ? _t(nn, 1) : _t(Kt, -1);
                          });
                        }
                        var Zt = L(jt, 2), Bn = M(Zt, !0);
                        A(Zt), A(pt);
                        var yn = L(pt, 2);
                        da(yn, 21, () => a(qe).reactors, (_t) => _t.eventId, (_t, mn) => {
                          const Et = S(() => pa(a(mn)));
                          var Ke = ub(), Ct = M(Ke);
                          {
                            let rn = S(() => a(mn).profile?.picture || "");
                            Yh(Ct, {
                              get src() {
                                return a(rn);
                              },
                              get alt() {
                                return a(Et);
                              },
                              rootClassName: "post-preview-reaction-avatar",
                              imageClassName: "post-preview-reaction-avatar-image",
                              fallbackClassName: "post-preview-reaction-avatar-fallback",
                              get fallbackAriaLabel() {
                                return a(Et);
                              },
                              fallbackDelayMs: 0
                            });
                          }
                          A(Ke), ge(() => {
                            Cn(Ke, "title", a(Et)), Cn(Ke, "aria-label", a(Et));
                          }), D(_t, Ke);
                        }), A(yn), A(Vt), ge(() => J(Bn, a(qe).count)), D(An, Vt);
                      }), A(gn), D(tn, gn);
                    }, En = S(() => a(We).reactionSummary.totalCount > 0 && Yr(a(Y)));
                    me(pr, (tn) => {
                      a(En) && tn(Jr);
                    });
                  }
                  D(Ve, _n);
                }, Ft = S(() => y() || x() || kt.shouldCollapsePost(a(Y)) || _r(a(Y)) || a(We).reactionSummary.totalCount > 0 || a(We).repliesActionState.status === "loaded" && a(We).repliesActionState.replyCount > 0);
                me(Ta, (Ve) => {
                  a(Ft) && Ve(Ot);
                });
              }
              var vn = L(Ta, 2);
              {
                let Ve = S(W);
                Qi(vn, {
                  get state() {
                    return a(We);
                  },
                  section: "children",
                  get previewModelByEventId() {
                    return a(Yn);
                  },
                  get emojiLoadStateByUrl() {
                    return Qt.emojiLoadStateByUrl;
                  },
                  get emojiImageMetaByUrl() {
                    return Qt.emojiImageMetaByUrl;
                  },
                  get scrollRoot() {
                    return a(Ye);
                  },
                  onImageOpen: Va,
                  onToggleNodeParent: (Ne) => Me.preserveThreadParentToggleScroll(a(Y).eventId, Ne, () => te.toggleNodeParent(a(Y), Ne)),
                  onRetryNodeParent: (Ne) => te.retryNodeParent(a(Y), Ne),
                  onToggleNodeChildren: (Ne) => te.toggleNodeChildren(a(Y), Ne),
                  onRetryNodeChildren: (Ne) => te.retryNodeChildren(a(Y), Ne),
                  onCopyPointerDown: H,
                  onCopyNevent: B,
                  get externalClientLabel() {
                    return a(Ve);
                  },
                  onOpenExternalClient: j,
                  isCopyFailed: d,
                  onShowRawJson: Dr,
                  onBroadcastPointerDown: Pe,
                  onBroadcastPost: Le,
                  isBroadcastSending: v,
                  canDeleteNodePost: ke,
                  isDeletionSending: He,
                  onOpenDeleteConfirm: Fe
                });
              }
              A(Wn), A(vt);
              var pn = L(vt, 2);
              {
                var rr = (Ve) => {
                  var Ne = yb(), Gt = M(Ne);
                  {
                    var _n = (En) => {
                      var tn = pb(), gn = M(tn, !0);
                      A(tn), ge((An) => J(gn, An), [() => r()("postHistory.deletedBadge")]), D(En, tn);
                    };
                    me(Gt, (En) => {
                      a(Y).deletedAt && En(_n);
                    });
                  }
                  var Nn = L(Gt, 2);
                  {
                    var pr = (En) => {
                      var tn = gb(), gn = M(tn, !0);
                      A(tn), ge((An) => J(gn, An), [() => r()("postHistory.deleteFailed")]), D(En, tn);
                    }, Jr = S(() => jr(a(Y)));
                    me(Nn, (En) => {
                      a(Jr) && En(pr);
                    });
                  }
                  A(Ne), D(Ve, Ne);
                }, Lt = S(() => !(y() || kt.shouldCollapsePost(a(Y))) && (a(Y).deletedAt || jr(a(Y))));
                me(pn, (Ve) => {
                  a(Lt) && Ve(rr);
                });
              }
              A(er), A(qt), ge(() => {
                en = Na(qt, 1, "post-history-item svelte-uxr0i8", null, en, { "post-history-item-deleted": !!a(Y).deletedAt }), Cn(qt, "data-post-history-event-id", a(Y).eventId), Cn(qt, "data-post-history-posted-at", a(Y).postedAt), Cn(Wn, "data-post-history-thread-anchor-scope-id", a(Y).eventId), Cn(Wn, "data-post-history-thread-anchor-event-id", a(Y).eventId);
              }), D(Qe, qt);
            }), A(In);
            var Xn = L(In, 2);
            {
              var Qn = (Qe) => {
                var Y = bb(), We = M(Y), qt = M(We, !0);
                A(We);
                var en = L(We, 2), er = M(en, !0);
                A(en), A(Y), ge(
                  (vt, Ut) => {
                    J(qt, vt), J(er, Ut);
                  },
                  [
                    () => r()("postHistory.savedOlderPostsShowing"),
                    () => r()("postHistory.savedOlderPostsGapNotice")
                  ]
                ), D(Qe, Y);
              };
              me(Xn, (Qe) => {
                F.isShowingSavedOlderPosts && Qe(Qn);
              });
            }
            var Br = L(Xn, 2);
            {
              var dn = (Qe) => {
                var Y = Pb(), We = M(Y), qt = M(We);
                {
                  var en = (vt) => {
                    {
                      let Ut = S(() => F.isFetchingFromRelays || F.isRefetchingAroundCurrentView);
                      ar(vt, {
                        type: "button",
                        variant: "primary",
                        className: "post-history-nav-button",
                        contentLayout: "iconText",
                        get disabled() {
                          return a(Ut);
                        },
                        onClick: () => void ha(),
                        children: (Mt, tr) => {
                          var nr = Cb(), Wn = L(Z(nr));
                          ge((Rn) => J(Wn, ` ${Rn ?? ""}`), [() => r()("postHistory.fetchOlderFromRelays")]), D(Mt, nr);
                        },
                        $$slots: { default: !0 }
                      });
                    }
                  };
                  me(qt, (vt) => {
                    (F.canFetchOlderFromRelays || F.isFetchingFromRelays) && vt(en);
                  });
                }
                var er = L(qt, 2);
                ar(er, {
                  type: "button",
                  variant: "default",
                  className: "post-history-nav-button",
                  contentLayout: "iconText",
                  onClick: () => void Lr(),
                  children: (vt, Ut) => {
                    var Mt = wb(), tr = L(Z(Mt));
                    ge((nr) => J(tr, ` ${nr ?? ""}`), [() => r()("postHistory.showSavedOlderPosts")]), D(vt, Mt);
                  },
                  $$slots: { default: !0 }
                }), A(We), A(Y), D(Qe, Y);
              }, Jt = (Qe) => {
                var Y = Sb(), We = M(Y);
                {
                  let qt = S(() => !F.canLoadOlder);
                  ar(We, {
                    type: "button",
                    variant: "default",
                    className: "post-history-nav-button",
                    contentLayout: "iconText",
                    get disabled() {
                      return a(qt);
                    },
                    onClick: () => void ea(),
                    children: (en, er) => {
                      var vt = xb(), Ut = L(Z(vt));
                      ge((Mt) => J(Ut, ` ${Mt ?? ""}`), [() => Gn()]), D(en, vt);
                    },
                    $$slots: { default: !0 }
                  });
                }
                A(Y), D(Qe, Y);
              }, Bt = (Qe) => {
                var Y = Rb(), We = M(Y);
                {
                  var qt = (en) => {
                    {
                      let er = S(() => F.isFetchingFromRelays || F.isRefetchingAroundCurrentView);
                      ar(en, {
                        type: "button",
                        variant: "primary",
                        className: "post-history-nav-button",
                        contentLayout: "iconText",
                        get disabled() {
                          return a(er);
                        },
                        onClick: () => void ha(),
                        children: (vt, Ut) => {
                          var Mt = Ee(), tr = Z(Mt);
                          {
                            var nr = (Rn) => {
                              {
                                let vr = S(() => r()("postHistory.fetchOlderFromRelaysLoading"));
                                Zs(Rn, {
                                  get text() {
                                    return a(vr);
                                  },
                                  showLoader: !0,
                                  loaderSize: 28,
                                  customClass: "post-history-nav-loading-placeholder"
                                });
                              }
                            }, Wn = (Rn) => {
                              var vr = Ib(), qr = L(Z(vr));
                              ge((ia) => J(qr, ` ${ia ?? ""}`), [() => r()("postHistory.fetchOlderFromRelays")]), D(Rn, vr);
                            };
                            me(tr, (Rn) => {
                              F.isFetchingOlderFromRelays ? Rn(nr) : Rn(Wn, -1);
                            });
                          }
                          D(vt, Mt);
                        },
                        $$slots: { default: !0 }
                      });
                    }
                  };
                  me(We, (en) => {
                    (F.canFetchOlderFromRelays || F.isFetchingFromRelays || F.isRefetchingAroundCurrentView) && en(qt);
                  });
                }
                A(Y), D(Qe, Y);
              };
              me(Br, (Qe) => {
                F.showSavedPostsBoundary ? Qe(dn) : (F.isSearchMode ? F.canLoadOlder : F.state.hasOlderLocal) ? Qe(Jt, 1) : F.showLocalExhaustedState && Qe(Bt, 2);
              });
            }
            D(Be, rt);
          };
          me(gs, (Be) => {
            F.posts.length === 0 && a(yt) ? Be($n) : a(xr) ? Be(Qa, 1) : Be(Wa, -1);
          });
        }
        A(Wr), Bi(Wr, (Be) => w(Ye, Be), () => a(Ye));
        var Nr = L(Wr, 2);
        {
          var ys = (Be) => {
            var rt = Ab(), lt = M(rt);
            {
              let Nt = S(() => r()("postHistory.returnToLatest"));
              ar(lt, {
                type: "button",
                variant: "default",
                shape: "circle",
                className: "post-history-latest-button",
                contentLayout: "icon",
                get ariaLabel() {
                  return a(Nt);
                },
                onClick: () => void ta(),
                children: (In, Xn) => {
                  var Qn = Eb();
                  D(In, Qn);
                },
                $$slots: { default: !0 }
              });
            }
            A(rt), D(Be, rt);
          };
          me(Nr, (Be) => {
            a(lr) && Be(ys);
          });
        }
        var zs = L(Nr, 2);
        Mu(zs, {
          get open() {
            return a(N);
          },
          get ownerPubkeyHex() {
            return f();
          },
          getCurrentPubkeyHex: () => f(),
          onOpenChange: (Be) => w(N, Be, !0),
          onImported: _s
        });
        var Co = L(zs, 2);
        Gh(Co, {
          get open() {
            return a(dt);
          },
          get rawEvent() {
            return a(he);
          },
          onOpenChange: (Be) => w(dt, Be, !0)
        }), ge(() => Cn(Wr, "aria-busy", a(ct) ? "true" : "false")), oo("scroll", Wr, function(...Be) {
          Me.handleHistoryScroll?.apply(this, Be);
        }), D(le, Je);
      },
      $$slots: { footer: !0, default: !0 }
    });
  }
  var Ds = L(Ka, 2);
  {
    const c = (mt) => {
      var bt = kb(), ze = M(bt), Rt = M(ze, !0);
      A(ze);
      var Zn = L(ze, 2), hr = M(Zn, !0);
      A(Zn), A(bt), ge(
        (wa, fr) => {
          J(Rt, wa), J(hr, fr);
        },
        [
          () => r()("postHistory.deleteRequestDescription"),
          () => r()("postHistory.deleteRequestWarning")
        ]
      ), D(mt, bt);
    };
    let T = S(() => r()("postHistory.deleteRequestTitle")), re = S(() => r()("postHistory.deleteRequestDescription")), le = S(() => fe.deleteTargetPost && Cr(fe.deleteTargetPost) ? r()("postHistory.deleteSending") : r()("postHistory.deleteConfirm")), Re = S(() => r()("postHistory.deleteCancel")), Je = S(() => fe.deleteTargetPost ? Cr(fe.deleteTargetPost) : !1);
    hd(Ds, {
      get open() {
        return fe.deleteConfirmOpen;
      },
      get onOpenChange() {
        return fe.setDeleteConfirmOpen;
      },
      get title() {
        return a(T);
      },
      get description() {
        return a(re);
      },
      get confirmLabel() {
        return a(le);
      },
      get cancelLabel() {
        return a(Re);
      },
      confirmVariant: "danger",
      get confirmDisabled() {
        return a(Je);
      },
      onConfirm: Vs,
      onCancel: Tt,
      contentClass: "post-history-delete-confirm",
      children: c,
      $$slots: { default: !0 }
    });
  }
  var oa = L(Ds, 2);
  {
    const c = (Je) => {
      var mt = Tb(), bt = M(mt), ze = M(bt, !0);
      A(bt), A(mt), ge((Rt) => J(ze, Rt), [() => r()("postHistory.deleteLocalHistoryDescription")]), D(Je, mt);
    };
    let T = S(() => r()("postHistory.deleteLocalHistoryTitle")), re = S(() => r()("postHistory.deleteLocalHistoryDescription")), le = S(() => r()("postHistory.deleteLocalHistoryConfirm")), Re = S(() => r()("postHistory.deleteLocalHistoryCancel"));
    hd(oa, {
      get title() {
        return a(T);
      },
      get description() {
        return a(re);
      },
      get confirmLabel() {
        return a(le);
      },
      get cancelLabel() {
        return a(Re);
      },
      confirmVariant: "danger",
      onConfirm: As,
      onCancel: Es,
      closeOnConfirm: !1,
      preventCloseWhileConfirming: !0,
      showConfirmSpinner: !0,
      contentClass: "post-history-local-delete-confirm",
      get open() {
        return a(Te);
      },
      set open(Je) {
        w(Te, Je, !0);
      },
      children: c,
      $$slots: { default: !0 }
    });
  }
  var p = L(oa, 2);
  {
    let c = S(() => a(Xe)[a(je)]?.src ?? ""), T = S(() => a(Xe)[a(je)]?.alt ?? "");
    qh(p, {
      get src() {
        return a(c);
      },
      get alt() {
        return a(T);
      },
      onClose: fs,
      get mediaList() {
        return a(Xe);
      },
      get currentIndex() {
        return a(je);
      },
      onNavigate: hs,
      get show() {
        return a(et);
      },
      set show(re) {
        w(et, re, !0);
      }
    });
  }
  var P = L(p, 2);
  di(P, {
    get show() {
      return se.showCopyFloatingMessage;
    },
    get x() {
      return se.copyFloatingMessageX;
    },
    get y() {
      return se.copyFloatingMessageY;
    },
    children: (c, T) => {
      var re = Mb(), le = M(re, !0);
      A(re), ge((Re) => J(le, Re), [() => r()("postHistory.copied")]), D(c, re);
    },
    $$slots: { default: !0 }
  });
  var k = L(P, 2);
  di(k, {
    get show() {
      return a(ae);
    },
    get x() {
      return a(at);
    },
    get y() {
      return a(gt);
    },
    children: (c, T) => {
      var re = Ob(), le = M(re, !0);
      A(re), ge((Re) => J(le, Re), [() => r()(a(tt))]), D(c, re);
    },
    $$slots: { default: !0 }
  });
  var V = L(k, 2);
  di(V, {
    get show() {
      return a(ie);
    },
    variant: "top-right",
    children: (c, T) => {
      var re = Fb(), le = M(re, !0);
      A(re), ge((Re) => J(le, Re), [
        () => r()(a(q), { values: a(Oe) })
      ]), D(c, re);
    },
    $$slots: { default: !0 }
  }), D(t, ja);
  var K = St(js);
  return s(), K;
}
Hc(["click"]);
It(
  $b,
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
  $b as default
};
