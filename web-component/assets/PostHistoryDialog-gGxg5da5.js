import { cq as as, cr as La, cs as Zu, ct as fc, cu as Ga, b0 as vc, cv as Uo, cw as Vo, cx as fo, cy as vo, cz as pc, a$ as gc, cA as jo, cB as yc, a_ as Fs, cC as ai, cD as id, b5 as mc, aZ as $t, cE as Xu, aX as Ko, cF as bc, aY as dr, cG as Zi, aG as Cc, b2 as Pa, cH as Xi, a8 as E, b8 as Tt, b6 as Ee, aa as be, b9 as Pt, ba as Fr, bb as br, bc as Cr, cI as eh, cJ as th, cK as Yo, cL as Fi, cM as wc, cN as Li, cO as nh, bl as Hs, b7 as na, cP as rh, bi as Ae, co as ah, a7 as Sa, ac as Ss, aj as es, ak as Is, cQ as Pc, cR as Hi, cS as $i, by as xc, ch as Sc, ae as Cn, ad as Ha, bh as lr, as as Ze, cT as $s, cU as el, G as sh, ci as Ns, ab as Ni, af as zo, cV as oh, cW as ih, cX as lh, cp as Io, cY as dh, cZ as ch, c_ as uh, c$ as hh, d0 as Ic, d1 as tl, d2 as Oa, d3 as Qo, d4 as Ro, al as da, R as wn, d5 as fh, d6 as vh, d7 as ph, d8 as gh, bs as yh, d9 as Ao, da as mh, w as Rc, db as nl, dc as rl, dd as al, de as _c, df as Wo, dg as Bi, dh as ld, di as bh, dj as Ch, dk as Ms, dl as _o, dm as wh, dn as Ec, dp as sl, dq as Ta, dr as Za, ds as Ph, dt as kc, du as ol, dv as il, dw as xh, dx as dd, dy as Sh, dz as Dc, dA as cd, dB as Ih, dC as si, dD as oi, dE as Ac, dF as Rh, dG as _h, dH as Eh, dI as Tc, dJ as kh, dK as Dh, dL as ii, dM as Ah, dN as ll, dO as Mc, dP as Oc, dQ as Fc, bx as Th, dR as Mh, dS as ud, dT as Oh, dU as Fh, dV as Lc, dW as Jo, dX as dl, dY as Lh, dZ as Hh, d_ as $h, bf as Nh, d$ as Bh, aJ as hd, aK as qh, aW as li, e0 as fd, b_ as Uh, ag as Gs, bo as Vh, e1 as jh, e2 as Kh, s as vd, bw as Yh } from "./App-B-vAJu8d.js";
import { aN as Ve, u as ra, aP as S, a, b as w, aQ as Ce, aJ as Xn, aY as zh, b5 as Lr, a_ as xt, a$ as ke, b0 as Z, b1 as D, b2 as St, b3 as R, b6 as T, b7 as k, b8 as V, n as wr, bg as $a, Z as ge, bh as W, b4 as It, bd as F, bf as ws, ap as Eo, bj as so, aq as Hc, bi as $c, aZ as Wa } from "./entry-y-09yyZ0.js";
import { b as Qh } from "./input-BsTyw8KX.js";
import { D as Nc, a as Bc } from "./DialogWrapper-Cz7-m3ip.js";
import { M as Kn, a as Ma, P as qc, b as qi, u as Wh, c as Jh, d as Gh, p as Zh, e as pd, D as gd, f as yd, g as md, h as Xh, r as ef, i as tf, j as di } from "./postBroadcastService-CqibkaTv.js";
import { H as nf } from "./hidden-input-D_Oiyeuw.js";
import { P as rf, b as af, a as sf } from "./popover-trigger-C5B-HyKl.js";
function ci(t, e) {
  return t - e * Math.floor(t / e);
}
const Uc = 1721426;
function Co(t, e, n, r) {
  e = cl(t, e);
  let i = e - 1, s = -2;
  return n <= 2 ? s = 0 : ko(e) && (s = -1), Uc - 1 + 365 * i + Math.floor(i / 4) - Math.floor(i / 100) + Math.floor(i / 400) + Math.floor((367 * n - 362) / 12 + s + r);
}
function ko(t) {
  return t % 4 === 0 && (t % 100 !== 0 || t % 400 === 0);
}
function cl(t, e) {
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
    let n = e, r = n - Uc, i = Math.floor(r / 146097), s = ci(r, 146097), l = Math.floor(s / 36524), c = ci(s, 36524), u = Math.floor(c / 1461), b = ci(c, 1461), g = Math.floor(b / 365), y = i * 400 + l * 100 + u * 4 + g + (l !== 4 && g !== 4 ? 1 : 0), [x, f] = of(y), _ = n - Co(x, f, 1, 1), C = 2;
    n < Co(x, f, 3, 1) ? C = 0 : ko(f) && (C = 1);
    let m = Math.floor(((_ + C) * 12 + 373) / 367), o = n - Co(x, f, m, 1) + 1;
    return new rs(x, f, m, o);
  }
  toJulianDay(e) {
    return Co(e.era, e.year, e.month, e.day);
  }
  getDaysInMonth(e) {
    return lf[ko(e.year) ? "leapyear" : "standard"][e.month - 1];
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getMonthsInYear(e) {
    return 12;
  }
  getDaysInYear(e) {
    return ko(e.year) ? 366 : 365;
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
function Ja(t, e) {
  return e = Jr(e, t.calendar), t.era === e.era && t.year === e.year && t.month === e.month && t.day === e.day;
}
function ul(t, e) {
  return e = Jr(e, t.calendar), t = Ui(t), e = Ui(e), t.era === e.era && t.year === e.year && t.month === e.month;
}
function cf(t, e) {
  var n, r, i, s;
  return (s = (i = (n = t.isEqual) === null || n === void 0 ? void 0 : n.call(t, e)) !== null && i !== void 0 ? i : (r = e.isEqual) === null || r === void 0 ? void 0 : r.call(e, t)) !== null && s !== void 0 ? s : t.identifier === e.identifier;
}
function uf(t, e) {
  return Ja(t, ff(e));
}
function Vc(t, e, n) {
  let r = t.calendar.toJulianDay(t), i = yf(e), s = Math.ceil(r + 1 - i) % 7;
  return s < 0 && (s += 7), s;
}
function hf(t) {
  return wa(Date.now(), t);
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
let ui = null;
function Xa() {
  return ui == null && (ui = new Intl.DateTimeFormat().resolvedOptions().timeZone), ui;
}
function Ui(t) {
  return t.subtract({
    days: t.day - 1
  });
}
function pf(t) {
  return t.add({
    days: t.calendar.getDaysInMonth(t) - t.day
  });
}
const Cd = /* @__PURE__ */ new Map(), hi = /* @__PURE__ */ new Map();
function gf(t) {
  if (Intl.Locale) {
    let n = Cd.get(t);
    return n || (n = new Intl.Locale(t).maximize().region, n && Cd.set(t, n)), n;
  }
  let e = t.split("-")[1];
  return e === "u" ? void 0 : e;
}
function yf(t) {
  let e = hi.get(t);
  if (!e) {
    if (Intl.Locale) {
      let r = new Intl.Locale(t);
      if ("getWeekInfo" in r && (e = r.getWeekInfo(), e))
        return hi.set(t, e), e.firstDay;
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
    hi.set(t, e);
  }
  return e.firstDay;
}
function ts(t) {
  t = Jr(t, new Ls());
  let e = cl(t.era, t.year);
  return Kc(e, t.month, t.day, t.hour, t.minute, t.second, t.millisecond);
}
function Kc(t, e, n, r, i, s, l) {
  let c = /* @__PURE__ */ new Date();
  return c.setUTCHours(r, i, s, l), c.setUTCFullYear(t, e - 1, n), c.getTime();
}
function uo(t, e) {
  if (e === "UTC") return 0;
  if (t > 0 && e === Xa()) return new Date(t).getTimezoneOffset() * -6e4;
  let { year: n, month: r, day: i, hour: s, minute: l, second: c } = Yc(t, e);
  return Kc(n, r, i, s, l, c, 0) - Math.floor(t / 1e3) * 1e3;
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
const To = 864e5;
function mf(t, e) {
  let n = ts(t), r = n - uo(n - To, e), i = n - uo(n + To, e);
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
function Ca(t, e, n = "compatible") {
  let r = ns(t);
  if (e === "UTC") return ts(r);
  if (e === Xa() && n === "compatible") {
    r = Jr(r, new Ls());
    let u = /* @__PURE__ */ new Date(), b = cl(r.era, r.year);
    return u.setFullYear(b, r.month - 1, r.day), u.setHours(r.hour, r.minute, r.second, r.millisecond), u.getTime();
  }
  let i = ts(r), s = uo(i - To, e), l = uo(i + To, e), c = zc(r, e, i - s, i - l);
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
  return new Date(Ca(t, e, n));
}
function wa(t, e) {
  let n = uo(t, e), r = new Date(t + n), i = r.getUTCFullYear(), s = r.getUTCMonth() + 1, l = r.getUTCDate(), c = r.getUTCHours(), u = r.getUTCMinutes(), b = r.getUTCSeconds(), g = r.getUTCMilliseconds();
  return new xa(i < 1 ? "BC" : "AD", i < 1 ? -i + 1 : i, s, l, e, n, c, u, b, g);
}
function Cf(t) {
  return new rs(t.calendar, t.era, t.year, t.month, t.day);
}
function ns(t, e) {
  let n = 0, r = 0, i = 0, s = 0;
  if ("timeZone" in t) ({ hour: n, minute: r, second: i, millisecond: s } = t);
  else if ("hour" in t && !e) return t;
  return e && ({ hour: n, minute: r, second: i, millisecond: s } = e), new Na(t.calendar, t.era, t.year, t.month, t.day, n, r, i, s);
}
function Jr(t, e) {
  if (cf(t.calendar, e)) return t;
  let n = e.fromJulianDay(t.calendar.toJulianDay(t)), r = t.copy();
  return r.calendar = e, r.era = n.era, r.year = n.year, r.month = n.month, r.day = n.day, Ps(r), r;
}
function wf(t, e, n) {
  if (t instanceof xa)
    return t.timeZone === e ? t : xf(t, e);
  let r = Ca(t, e, n);
  return wa(r, e);
}
function Pf(t) {
  let e = ts(t) - t.offset;
  return new Date(e);
}
function xf(t, e) {
  let n = ts(t) - t.offset;
  return Jr(wa(n, e), t.calendar);
}
const Zs = 36e5;
function Go(t, e) {
  let n = t.copy(), r = "hour" in n ? _f(n, e) : 0;
  Vi(n, e.years || 0), n.calendar.balanceYearMonth && n.calendar.balanceYearMonth(n, t), n.month += e.months || 0, ji(n), Wc(n), n.day += (e.weeks || 0) * 7, n.day += e.days || 0, n.day += r, Sf(n), n.calendar.balanceDate && n.calendar.balanceDate(n), n.year < 1 && (n.year = 1, n.month = 1, n.day = 1);
  let i = n.calendar.getYearsInEra(n);
  if (n.year > i) {
    var s, l;
    let u = (s = (l = n.calendar).isInverseEra) === null || s === void 0 ? void 0 : s.call(l, n);
    n.year = i, n.month = u ? 1 : n.calendar.getMonthsInYear(n), n.day = u ? 1 : n.calendar.getDaysInMonth(n);
  }
  n.month < 1 && (n.month = 1, n.day = 1);
  let c = n.calendar.getMonthsInYear(n);
  return n.month > c && (n.month = c, n.day = n.calendar.getDaysInMonth(n)), n.day = Math.max(1, Math.min(n.calendar.getDaysInMonth(n), n.day)), n;
}
function Vi(t, e) {
  var n, r;
  !((n = (r = t.calendar).isInverseEra) === null || n === void 0) && n.call(r, t) && (e = -e), t.year += e;
}
function ji(t) {
  for (; t.month < 1; )
    Vi(t, -1), t.month += t.calendar.getMonthsInYear(t);
  let e = 0;
  for (; t.month > (e = t.calendar.getMonthsInYear(t)); )
    t.month -= e, Vi(t, 1);
}
function Sf(t) {
  for (; t.day < 1; )
    t.month--, ji(t), t.day += t.calendar.getDaysInMonth(t);
  for (; t.day > t.calendar.getDaysInMonth(t); )
    t.day -= t.calendar.getDaysInMonth(t), t.month++, ji(t);
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
  return Go(t, Jc(e));
}
function hl(t, e) {
  let n = t.copy();
  return e.era != null && (n.era = e.era), e.year != null && (n.year = e.year), e.month != null && (n.month = e.month), e.day != null && (n.day = e.day), Ps(n), n;
}
function Mo(t, e) {
  let n = t.copy();
  return e.hour != null && (n.hour = e.hour), e.minute != null && (n.minute = e.minute), e.second != null && (n.second = e.second), e.millisecond != null && (n.millisecond = e.millisecond), Rf(n), n;
}
function If(t) {
  t.second += Math.floor(t.millisecond / 1e3), t.millisecond = wo(t.millisecond, 1e3), t.minute += Math.floor(t.second / 60), t.second = wo(t.second, 60), t.hour += Math.floor(t.minute / 60), t.minute = wo(t.minute, 60);
  let e = Math.floor(t.hour / 24);
  return t.hour = wo(t.hour, 24), e;
}
function Rf(t) {
  t.millisecond = Math.max(0, Math.min(t.millisecond, 1e3)), t.second = Math.max(0, Math.min(t.second, 59)), t.minute = Math.max(0, Math.min(t.minute, 59)), t.hour = Math.max(0, Math.min(t.hour, 23));
}
function wo(t, e) {
  let n = t % e;
  return n < 0 && (n += e), n;
}
function _f(t, e) {
  return t.hour += e.hours || 0, t.minute += e.minutes || 0, t.second += e.seconds || 0, t.millisecond += e.milliseconds || 0, If(t);
}
function fl(t, e, n, r) {
  let i = t.copy();
  switch (e) {
    case "era": {
      let c = t.calendar.getEras(), u = c.indexOf(t.era);
      if (u < 0) throw new Error("Invalid era: " + t.era);
      u = Fa(u, n, 0, c.length - 1, r?.round), i.era = c[u], Ps(i);
      break;
    }
    case "year":
      var s, l;
      !((s = (l = i.calendar).isInverseEra) === null || s === void 0) && s.call(l, i) && (n = -n), i.year = Fa(t.year, n, -1 / 0, 9999, r?.round), i.year === -1 / 0 && (i.year = 1), i.calendar.balanceYearMonth && i.calendar.balanceYearMonth(i, t);
      break;
    case "month":
      i.month = Fa(t.month, n, 1, t.calendar.getMonthsInYear(t), r?.round);
      break;
    case "day":
      i.day = Fa(t.day, n, 1, t.calendar.getDaysInMonth(t), r?.round);
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
      let s = t.hour, l = 0, c = 23;
      if (r?.hourCycle === 12) {
        let u = s >= 12;
        l = u ? 12 : 0, c = u ? 23 : 11;
      }
      i.hour = Fa(s, n, l, c, r?.round);
      break;
    }
    case "minute":
      i.minute = Fa(t.minute, n, 0, 59, r?.round);
      break;
    case "second":
      i.second = Fa(t.second, n, 0, 59, r?.round);
      break;
    case "millisecond":
      i.millisecond = Fa(t.millisecond, n, 0, 999, r?.round);
      break;
    default:
      throw new Error("Unsupported field " + e);
  }
  return i;
}
function Fa(t, e, n, r, i = !1) {
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
    let i = Go(ns(t), {
      years: e.years,
      months: e.months,
      weeks: e.weeks,
      days: e.days
    });
    n = Ca(i, t.timeZone);
  } else
    n = ts(t) - t.offset;
  n += e.milliseconds || 0, n += (e.seconds || 0) * 1e3, n += (e.minutes || 0) * 6e4, n += (e.hours || 0) * 36e5;
  let r = wa(n, t.timeZone);
  return Jr(r, t.calendar);
}
function Ef(t, e) {
  return Xc(t, Jc(e));
}
function kf(t, e, n, r) {
  switch (e) {
    case "hour": {
      let i = 0, s = 23;
      if (r?.hourCycle === 12) {
        let _ = t.hour >= 12;
        i = _ ? 12 : 0, s = _ ? 23 : 11;
      }
      let l = ns(t), c = Jr(Mo(l, {
        hour: i
      }), new Ls()), u = [
        Ca(c, t.timeZone, "earlier"),
        Ca(c, t.timeZone, "later")
      ].filter((_) => wa(_, t.timeZone).day === c.day)[0], b = Jr(Mo(l, {
        hour: s
      }), new Ls()), g = [
        Ca(b, t.timeZone, "earlier"),
        Ca(b, t.timeZone, "later")
      ].filter((_) => wa(_, t.timeZone).day === b.day).pop(), y = ts(t) - t.offset, x = Math.floor(y / Zs), f = y % Zs;
      return y = Fa(x, n, Math.floor(u / Zs), Math.floor(g / Zs), r?.round) * Zs + f, Jr(wa(y, t.timeZone), t.calendar);
    }
    case "minute":
    case "second":
    case "millisecond":
      return Zc(t, e, n, r);
    case "era":
    case "year":
    case "month":
    case "day": {
      let i = fl(ns(t), e, n, r), s = Ca(i, t.timeZone);
      return Jr(wa(s, t.timeZone), t.calendar);
    }
    default:
      throw new Error("Unsupported field " + e);
  }
}
function Df(t, e, n) {
  let r = ns(t), i = Mo(hl(r, e), e);
  if (i.compare(r) === 0) return t;
  let s = Ca(i, t.timeZone, n);
  return Jr(wa(s, t.timeZone), t.calendar);
}
const Af = /^([+-]\d{6}|\d{4})-(\d{2})-(\d{2})$/, Tf = /^([+-]\d{6}|\d{4})-(\d{2})-(\d{2})(?:T(\d{2}))?(?::(\d{2}))?(?::(\d{2}))?(\.\d+)?$/, Mf = /^([+-]\d{6}|\d{4})-(\d{2})-(\d{2})(?:T(\d{2}))?(?::(\d{2}))?(?::(\d{2}))?(\.\d+)?(?:([+-]\d{2})(?::?(\d{2}))?(?::?(\d{2}))?)?\[(.*?)\]$/, eu = /^([+-]\d{6}|\d{4})-(\d{2})-(\d{2})(?:T(\d{2}))?(?::(\d{2}))?(?::(\d{2}))?(\.\d+)?(?:(?:([+-]\d{2})(?::?(\d{2}))?)|Z)$/;
function vl(t) {
  let e = t.match(Af);
  if (!e)
    throw eu.test(t) ? new Error(`Invalid ISO 8601 date string: ${t}. Use parseAbsolute() instead.`) : new Error("Invalid ISO 8601 date string: " + t);
  let n = new rs(Ln(e[1], 0, 9999), Ln(e[2], 1, 12), 1);
  return n.day = Ln(e[3], 1, n.calendar.getDaysInMonth(n)), n;
}
function tu(t) {
  let e = t.match(Tf);
  if (!e)
    throw eu.test(t) ? new Error(`Invalid ISO 8601 date time string: ${t}. Use parseAbsolute() instead.`) : new Error("Invalid ISO 8601 date time string: " + t);
  let n = Ln(e[1], -9999, 9999), r = n < 1 ? "BC" : "AD", i = new Na(r, n < 1 ? -n + 1 : n, Ln(e[2], 1, 12), 1, e[4] ? Ln(e[4], 0, 23) : 0, e[5] ? Ln(e[5], 0, 59) : 0, e[6] ? Ln(e[6], 0, 59) : 0, e[7] ? Ln(e[7], 0, 1 / 0) * 1e3 : 0);
  return i.day = Ln(e[3], 0, i.calendar.getDaysInMonth(i)), i;
}
function nu(t, e) {
  let n = t.match(Mf);
  if (!n) throw new Error("Invalid ISO 8601 date time string: " + t);
  let r = Ln(n[1], -9999, 9999), i = r < 1 ? "BC" : "AD", s = new xa(i, r < 1 ? -r + 1 : r, Ln(n[2], 1, 12), 1, n[11], 0, n[4] ? Ln(n[4], 0, 23) : 0, n[5] ? Ln(n[5], 0, 59) : 0, n[6] ? Ln(n[6], 0, 59) : 0, n[7] ? Ln(n[7], 0, 1 / 0) * 1e3 : 0);
  s.day = Ln(n[3], 0, s.calendar.getDaysInMonth(s));
  let l = ns(s), c;
  if (n[8]) {
    let g = Ln(n[8], -23, 23);
    var u, b;
    if (s.offset = Math.sign(g) * (Math.abs(g) * 36e5 + Ln((u = n[9]) !== null && u !== void 0 ? u : "0", 0, 59) * 6e4 + Ln((b = n[10]) !== null && b !== void 0 ? b : "0", 0, 59) * 1e3), c = ts(s) - s.offset, !mf(l, s.timeZone).includes(c)) throw new Error(`Offset ${au(s.offset)} is invalid for ${pl(s)} in ${s.timeZone}`);
  } else
    c = Ca(ns(l), s.timeZone, e);
  return wa(c, s.timeZone);
}
function Ln(t, e, n) {
  let r = Number(t);
  if (r < e || r > n) throw new RangeError(`Value out of range: ${e} <= ${r} <= ${n}`);
  return r;
}
function Of(t) {
  return `${String(t.hour).padStart(2, "0")}:${String(t.minute).padStart(2, "0")}:${String(t.second).padStart(2, "0")}${t.millisecond ? String(t.millisecond / 1e3).slice(1) : ""}`;
}
function ru(t) {
  let e = Jr(t, new Ls()), n;
  return e.era === "BC" ? n = e.year === 1 ? "0000" : "-" + String(Math.abs(1 - e.year)).padStart(6, "00") : n = String(e.year).padStart(4, "0"), `${n}-${String(e.month).padStart(2, "0")}-${String(e.day).padStart(2, "0")}`;
}
function pl(t) {
  return `${ru(t)}T${Of(t)}`;
}
function au(t) {
  let e = Math.sign(t) < 0 ? "-" : "+";
  t = Math.abs(t);
  let n = Math.floor(t / 36e5), r = Math.floor(t % 36e5 / 6e4), i = Math.floor(t % 36e5 % 6e4 / 1e3), s = `${e}${String(n).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
  return i !== 0 && (s += `:${String(i).padStart(2, "0")}`), s;
}
function Ff(t) {
  return `${pl(t)}${au(t.offset)}[${t.timeZone}]`;
}
function Lf(t, e) {
  if (e.has(t))
    throw new TypeError("Cannot initialize the same private elements twice on an object");
}
function gl(t, e, n) {
  Lf(t, e), e.set(t, n);
}
function yl(t) {
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
class rs {
  /** Returns a copy of this date. */
  copy() {
    return this.era ? new rs(this.calendar, this.era, this.year, this.month, this.day) : new rs(this.calendar, this.year, this.month, this.day);
  }
  /** Returns a new `CalendarDate` with the given duration added to it. */
  add(e) {
    return Go(this, e);
  }
  /** Returns a new `CalendarDate` with the given duration subtracted from it. */
  subtract(e) {
    return Gc(this, e);
  }
  /** Returns a new `CalendarDate` with the given fields set to the provided values. Other fields will be constrained accordingly. */
  set(e) {
    return hl(this, e);
  }
  /**
  * Returns a new `CalendarDate` with the given field adjusted by a specified amount.
  * When the resulting value reaches the limits of the field, it wraps around.
  */
  cycle(e, n, r) {
    return fl(this, e, n, r);
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
    gl(this, Hf, {
      writable: !0,
      value: void 0
    });
    let [n, r, i, s, l] = yl(e);
    this.calendar = n, this.era = r, this.year = i, this.month = s, this.day = l, Ps(this);
  }
}
var $f = /* @__PURE__ */ new WeakMap();
class Na {
  /** Returns a copy of this date. */
  copy() {
    return this.era ? new Na(this.calendar, this.era, this.year, this.month, this.day, this.hour, this.minute, this.second, this.millisecond) : new Na(this.calendar, this.year, this.month, this.day, this.hour, this.minute, this.second, this.millisecond);
  }
  /** Returns a new `CalendarDateTime` with the given duration added to it. */
  add(e) {
    return Go(this, e);
  }
  /** Returns a new `CalendarDateTime` with the given duration subtracted from it. */
  subtract(e) {
    return Gc(this, e);
  }
  /** Returns a new `CalendarDateTime` with the given fields set to the provided values. Other fields will be constrained accordingly. */
  set(e) {
    return hl(Mo(this, e), e);
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
        return fl(this, e, n, r);
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
    return pl(this);
  }
  /** Compares this date with another. A negative result indicates that this date is before the given one, and a positive date indicates that it is after. */
  compare(e) {
    let n = jc(this, e);
    return n === 0 ? vf(this, ns(e)) : n;
  }
  constructor(...e) {
    gl(this, $f, {
      writable: !0,
      value: void 0
    });
    let [n, r, i, s, l] = yl(e);
    this.calendar = n, this.era = r, this.year = i, this.month = s, this.day = l, this.hour = e.shift() || 0, this.minute = e.shift() || 0, this.second = e.shift() || 0, this.millisecond = e.shift() || 0, Ps(this);
  }
}
var Nf = /* @__PURE__ */ new WeakMap();
class xa {
  /** Returns a copy of this date. */
  copy() {
    return this.era ? new xa(this.calendar, this.era, this.year, this.month, this.day, this.timeZone, this.offset, this.hour, this.minute, this.second, this.millisecond) : new xa(this.calendar, this.year, this.month, this.day, this.timeZone, this.offset, this.hour, this.minute, this.second, this.millisecond);
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
    return kf(this, e, n, r);
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
    gl(this, Nf, {
      writable: !0,
      value: void 0
    });
    let [n, r, i, s, l] = yl(e), c = e.shift(), u = e.shift();
    this.calendar = n, this.era = r, this.year = i, this.month = s, this.day = l, this.timeZone = c, this.offset = u, this.hour = e.shift() || 0, this.minute = e.shift() || 0, this.second = e.shift() || 0, this.millisecond = e.shift() || 0, Ps(this);
  }
}
let fi = /* @__PURE__ */ new Map();
class ba {
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
  if (fi.has(n)) return fi.get(n);
  let r = new Intl.DateTimeFormat(t, e);
  return fi.set(n, r), r;
}
let vi = null;
function qf() {
  return vi == null && (vi = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    hour12: !1
  }).format(new Date(2020, 2, 3, 0)) === "24"), vi;
}
let pi = null;
function Uf() {
  return pi == null && (pi = new Intl.DateTimeFormat("fr", {
    hour: "numeric",
    hour12: !1
  }).resolvedOptions().hourCycle === "h12"), pi;
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
  if (!as || !t)
    return null;
  let e = t.querySelector("[data-bits-announcer]");
  const n = (i) => {
    const s = t.createElement("div");
    return s.role = "log", s.ariaLive = i, s.setAttribute("aria-relevant", "additions"), s;
  };
  if (!La(e)) {
    const i = t.createElement("div");
    i.style.cssText = Zu, i.setAttribute("data-bits-announcer", ""), i.appendChild(n("assertive")), i.appendChild(n("polite")), e = i, t.body.insertBefore(e, t.body.firstChild);
  }
  return {
    getLog: (i) => {
      if (!La(e))
        return null;
      const s = e.querySelector(`[aria-live="${i}"]`);
      return La(s) ? s : null;
    }
  };
}
function Oo(t) {
  const e = jf(t);
  function n(r, i = "assertive", s = 7500) {
    if (!e || !as || !t)
      return;
    const l = e.getLog(i), c = t.createElement("div");
    return typeof r == "number" ? r = r.toString() : r === null ? r = "Empty" : r = r.trim(), c.innerText = r, i === "assertive" ? l?.replaceChildren(c) : l?.appendChild(c), setTimeout(() => {
      c.remove();
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
    i && l < i.toDate(Xa()) ? l = i.toDate(Xa()) : s && l > s.toDate(Xa()) && (l = s.toDate(Xa()));
    const c = l.getFullYear(), u = l.getMonth() + 1, b = l.getDate();
    return ["hour", "minute", "second"].includes(r ?? "day") ? new Na(c, u, b, 0, 0, 0) : new rs(c, u, b);
  }
}
function ou(t, e) {
  let n;
  return e instanceof xa ? n = nu(t) : e instanceof Na ? n = tu(t) : n = vl(t), n.calendar !== e.calendar ? Jr(n, e.calendar) : n;
}
function Or(t, e = Xa()) {
  return t instanceof xa ? t.toDate() : t.toDate(e);
}
function zf(t) {
  if (t instanceof rs)
    return "date";
  if (t instanceof Na)
    return "datetime";
  if (t instanceof xa)
    return "zoneddatetime";
  throw new Error("Unknown date type");
}
function Qf(t, e) {
  switch (e) {
    case "date":
      return vl(t);
    case "datetime":
      return tu(t);
    case "zoneddatetime":
      return nu(t);
    default:
      throw new Error(`Unknown date type: ${e}`);
  }
}
function Wf(t) {
  return t instanceof Na;
}
function ml(t) {
  return t instanceof xa;
}
function Fo(t) {
  return Wf(t) || ml(t);
}
function ho(t) {
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
const Zo = ["day", "month", "year"], bl = ["hour", "minute", "second", "dayPeriod"], Gf = ["literal", "timeZoneName"], po = [
  ...Zo,
  ...bl
], Zf = [
  ...po,
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
], ev = ["year", "month", "day"], gi = {
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
    return gi[t];
  {
    const e = sv(t);
    return Sd(e) ? gi[e] : gi.en;
  }
}
function yi(t, e, n) {
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
function mi(t) {
  const e = ["hour", "minute", "second"], n = po.map((r) => r === "dayPeriod" ? [r, "AM"] : [r, null]).filter(([r]) => r === "literal" || r === null ? !1 : t === "day" ? !e.includes(r) : !0);
  return Object.fromEntries(n);
}
function ov(t) {
  const { segmentValues: e, formatter: n, locale: r, dateRef: i } = t, s = Object.keys(e).reduce((c, u) => {
    if (!iu(u))
      return c;
    if ("hour" in e && u === "dayPeriod") {
      const b = e[u];
      Ga(b) ? c[u] = yi(u, "AM", r) : c[u] = b;
    } else
      c[u] = l(u);
    return c;
  }, {});
  function l(c) {
    if ("hour" in e) {
      const u = e[c], b = typeof u == "string" && u?.startsWith("0"), g = u !== null ? Number.parseInt(u) : null;
      if (u === "0" && c !== "year")
        return "0";
      if (!Ga(u) && !Ga(g)) {
        const y = n.part(i.set({ [c]: u }), c, {
          hourCycle: t.hourCycle === 24 ? "h23" : void 0
        }), x = t.hourCycle === 12 || t.hourCycle === void 0 && du(r) === 12;
        if (c === "hour" && x) {
          if (g > 12) {
            const f = g - 12;
            return f === 0 ? "12" : f < 10 ? `0${f}` : `${f}`;
          }
          return g === 0 ? "12" : g < 10 ? `0${g}` : `${g}`;
        }
        return c === "year" ? `${u}` : b && y.length === 1 ? `0${y}` : y;
      } else
        return yi(c, "", r);
    } else {
      if (Xo(c)) {
        const u = e[c], b = typeof u == "string" && u?.startsWith("0");
        if (u === "0")
          return "0";
        if (Ga(u))
          return yi(c, "", r);
        {
          const g = n.part(i.set({ [c]: u }), c);
          return c === "year" ? `${u}` : b && g.length === 1 ? `0${g}` : g;
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
  }).filter((b) => !(Ga(b.part) || Ga(b.value) || b.part === "timeZoneName" && (!ml(n) || s)));
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
  return po.reduce((t, e) => (t[e] = {
    lastKeyZero: !1,
    hasLeftFocus: !0,
    updating: null
  }, t), {});
}
function Xo(t) {
  return Zo.includes(t);
}
function iu(t) {
  return po.includes(t);
}
function cv(t) {
  return Zf.includes(t);
}
function lu(t) {
  return !as || !t ? [] : Pl(t).map((n) => n.dataset.segment).filter((n) => po.includes(n));
}
function uv(t) {
  const { segmentObj: e, fieldNode: n, dateRef: r } = t, i = lu(n);
  let s = r;
  for (const l of i)
    if ("hour" in e) {
      const c = e[l];
      if (Ga(c))
        continue;
      s = s.set({ [l]: e[l] });
    } else if (Xo(l)) {
      const c = e[l];
      if (Ga(c))
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
    } else if (Xo(r) && t[r] === null)
      return !1;
  return !0;
}
function fv(t) {
  return typeof t != "object" || t === null ? !1 : Object.entries(t).every(([e, n]) => (bl.includes(e) || Zo.includes(e)) && (e === "dayPeriod" ? n === "AM" || n === "PM" || n === null : typeof n == "string" || typeof n == "number" || n === null));
}
function vv(t, e) {
  return e || (Fo(t) ? "minute" : "day");
}
function Cl(t) {
  return !!([
    vc,
    Uo,
    Vo,
    fo,
    vo,
    pc,
    gc
  ].includes(t) || jo(t));
}
function pv(t, e) {
  if (!as)
    return !1;
  const n = Pl(e);
  return n.length ? n[0].id === t : !1;
}
function gv(t) {
  const { id: e, formatter: n, value: r, doc: i } = t;
  if (!as)
    return;
  const s = n.selectedDate(r), l = i.getElementById(e);
  if (l)
    l.innerText = `Selected Date: ${s}`;
  else {
    const c = i.createElement("div");
    c.style.cssText = fc({
      display: "none"
    }), c.id = e, c.innerText = `Selected Date: ${s}`, i.body.appendChild(c);
  }
}
function yv(t, e) {
  if (!as)
    return;
  const n = e.getElementById(t);
  n && e.body.removeChild(n);
}
function du(t) {
  return new Intl.DateTimeFormat(t, { hour: "numeric" }).formatToParts(/* @__PURE__ */ new Date("2023-01-01T13:00:00")).find((i) => i.type === "hour")?.value === "1" ? 12 : 24;
}
function go(t, e) {
  const n = t.currentTarget;
  if (!La(n))
    return;
  const { prev: r, next: i } = wl(n, e);
  if (t.key === fo) {
    if (!r)
      return;
    r.focus();
  } else if (t.key === vo) {
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
function wl(t, e) {
  const n = Pl(e);
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
  if (!La(n))
    return;
  const { next: r } = wl(n, e);
  r && r.focus();
}
function uu(t, e) {
  const n = t.currentTarget;
  if (!La(n))
    return;
  const { prev: r } = wl(n, e);
  r && r.focus();
}
function yo(t) {
  return t === vo || t === fo;
}
function Pl(t) {
  return t ? Array.from(t.querySelectorAll("[data-segment]")).filter((n) => {
    if (!La(n))
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
    return new ba(e, _).format(f);
  }
  function s(f, _ = !0) {
    return Fo(f) && _ ? i(Or(f), {
      dateStyle: "long",
      timeStyle: "long"
    }) : i(Or(f), {
      dateStyle: "long"
    });
  }
  function l(f) {
    if (typeof t.monthFormat.current != "function" && typeof t.yearFormat.current != "function")
      return new ba(e, {
        month: t.monthFormat.current,
        year: t.yearFormat.current
      }).format(f);
    const _ = typeof t.monthFormat.current == "function" ? t.monthFormat.current(f.getMonth() + 1) : new ba(e, { month: t.monthFormat.current }).format(f), C = typeof t.yearFormat.current == "function" ? t.yearFormat.current(f.getFullYear()) : new ba(e, { year: t.yearFormat.current }).format(f);
    return `${_} ${C}`;
  }
  function c(f) {
    return new ba(e, { month: "long" }).format(f);
  }
  function u(f) {
    return new ba(e, { year: "numeric" }).format(f);
  }
  function b(f, _) {
    return ml(f) ? new ba(e, {
      ..._,
      timeZone: f.timeZone
    }).formatToParts(Or(f)) : new ba(e, _).formatToParts(Or(f));
  }
  function g(f, _ = "narrow") {
    return new ba(e, { weekday: _ }).format(f);
  }
  function y(f, _ = void 0) {
    return new ba(e, {
      hour: "numeric",
      minute: "numeric",
      hourCycle: _ === 24 ? "h23" : void 0
    }).formatToParts(f).find((o) => o.type === "dayPeriod")?.value === "PM" ? "PM" : "AM";
  }
  function x(f, _, C = {}) {
    const m = { ...Cv, ...C }, M = b(f, m).find((z) => z.type === _);
    return M ? M.value : "";
  }
  return {
    setLocale: n,
    getLocale: r,
    fullMonth: c,
    fullYear: u,
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
  return !(!La(t) || !t.hasAttribute("data-bits-day"));
}
function Rd(t, e) {
  const n = [];
  let r = t.add({ days: 1 });
  const i = e;
  for (; r.compare(i) < 0; )
    n.push(r), r = r.add({ days: 1 });
  return n;
}
function bi(t) {
  const { dateObj: e, weekStartsOn: n, fixedWeeks: r, locale: i } = t, s = ho(e), l = Array.from({ length: s }, (m, o) => e.set({ day: o + 1 })), c = Ui(e), u = pf(e), b = n !== void 0 ? Pd(c, n, "en-US") : Pd(c, 0, i), g = n !== void 0 ? xd(u, n, "en-US") : xd(u, 0, i), y = Rd(b.subtract({ days: 1 }), c), x = Rd(u, g.add({ days: 1 })), f = y.length + l.length + x.length;
  if (r && f < 42) {
    const m = 42 - f;
    let o = x[x.length - 1];
    o || (o = e.add({ months: 1 }).set({ day: 1 }));
    let M = m;
    x.length === 0 && (M = m - 1, x.push(o));
    const z = Array.from({ length: M }, ($, ee) => {
      const me = ee + 1;
      return o.add({ days: me });
    });
    x.push(...z);
  }
  const _ = y.concat(l, x), C = Xu(_, 7);
  return { value: e, dates: _, weeks: C };
}
function mo(t) {
  const { numberOfMonths: e, dateObj: n, ...r } = t, i = [];
  if (!e || e === 1)
    return i.push(bi({ ...r, dateObj: n })), i;
  i.push(bi({ ...r, dateObj: n }));
  for (let s = 1; s < e; s++) {
    const l = n.add({ months: s });
    i.push(bi({ ...r, dateObj: l }));
  }
  return i;
}
function Ci(t) {
  return t ? Array.from(t.querySelectorAll("[data-bits-day]:not([data-disabled]):not([data-outside-visible-months])")).filter((n) => La(n)) : [];
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
  numberOfMonths: c
}) {
  const u = Ci(r);
  if (!u.length) return;
  const g = u.indexOf(t) + e;
  if (ai(g, u)) {
    const y = u[g];
    return _d(y, n), y.focus();
  }
  if (g < 0) {
    if (i) return;
    const y = l[0]?.value;
    if (!y) return;
    n.current = y.subtract({ months: c }), id(() => {
      const x = Ci(r);
      if (!x.length) return;
      const f = x.length - Math.abs(g);
      if (ai(f, x)) {
        const _ = x[f];
        return _d(_, n), _.focus();
      }
    });
  }
  if (g >= u.length) {
    if (s) return;
    const y = l[0]?.value;
    if (!y) return;
    n.current = y.add({ months: c }), id(() => {
      const x = Ci(r);
      if (!x.length) return;
      const f = g - u.length;
      if (ai(f, x))
        return x[f].focus();
    });
  }
}
const Ed = [
  Vo,
  Uo,
  fo,
  vo
], kd = [vc, gc];
function xv({ event: t, handleCellClick: e, shiftFocus: n, placeholderValue: r }) {
  const i = t.target;
  if (!wv(i) || !Ed.includes(t.key) && !kd.includes(t.key)) return;
  t.preventDefault();
  const s = {
    [Vo]: 7,
    [Uo]: -7,
    [fo]: -1,
    [vo]: 1
  };
  if (Ed.includes(t.key)) {
    const l = s[t.key];
    l !== void 0 && n(i, l);
  }
  if (kd.includes(t.key)) {
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
  setPlaceholder: c
}) {
  const u = t[0]?.value;
  if (u)
    if (r)
      c(u.add({ months: n }));
    else {
      const b = u.add({ months: 1 }), g = mo({
        dateObj: b,
        weekStartsOn: i,
        locale: s,
        fixedWeeks: l,
        numberOfMonths: n
      });
      c(b), e(g);
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
  setPlaceholder: c
}) {
  const u = t[0]?.value;
  if (u)
    if (r)
      c(u.subtract({ months: n }));
    else {
      const b = u.subtract({ months: 1 }), g = mo({
        dateObj: b,
        weekStartsOn: i,
        locale: s,
        fixedWeeks: l,
        numberOfMonths: n
      });
      c(b), e(g);
    }
}
function Rv({ months: t, formatter: e, weekdayFormat: n }) {
  if (!t.length) return [];
  const i = t[0].weeks[0];
  return i ? i.map((s) => e.dayOfWeek(Or(s), n)) : [];
}
function _v(t) {
  Ve(() => {
    const e = t.weekStartsOn.current, n = t.locale.current, r = t.fixedWeeks.current, i = t.numberOfMonths.current;
    ra(() => {
      const s = t.placeholder.current;
      if (!s) return;
      const l = { weekStartsOn: e, locale: n, fixedWeeks: r, numberOfMonths: i };
      t.setMonths(mo({ ...l, dateObj: s }));
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
function kv({
  placeholder: t,
  getVisibleMonths: e,
  weekStartsOn: n,
  locale: r,
  fixedWeeks: i,
  numberOfMonths: s,
  setMonths: l
}) {
  Ve(() => {
    t.current, ra(() => {
      if (e().some((u) => ul(u, t.current)))
        return;
      const c = {
        weekStartsOn: n.current,
        locale: r.current,
        fixedWeeks: i.current,
        numberOfMonths: s.current
      };
      l(mo({ ...c, dateObj: t.current }));
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
function Av({ minValue: t, months: e, disabled: n }) {
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
    const g = Or(t[0].value);
    return `${n.fullMonthAndYear(g)}`;
  }
  const r = Or(t[0].value), i = Or(t[t.length - 1].value), s = n.fullMonth(r), l = n.fullMonth(i), c = n.fullYear(r), u = n.fullYear(i);
  return c === u ? `${s} - ${l} ${u}` : `${s} ${c} - ${l} ${u}`;
}
function Mv({ fullCalendarLabel: t, id: e, isInvalid: n, disabled: r, readonly: i }) {
  return {
    id: e,
    role: "application",
    "aria-label": t,
    "data-invalid": $t(n),
    "data-disabled": $t(r),
    "data-readonly": $t(i)
  };
}
function Ov(t) {
  const n = yc(t.target).querySelector("[data-bits-day][data-focused]");
  n && (t.preventDefault(), n?.focus());
}
function Fv(t) {
  if (!as) return;
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
  function l(c) {
    return !!(s.current(c) || r.current && xs(c, r.current) || i.current && xs(i.current, c));
  }
  Fs(() => t.current, () => {
    t.current && e.current && Ja(e.current, n) && l(n) && (e.current = Fv(t.current) ?? n);
  });
}
function Hv(t, e) {
  return !t || !e ? t : Fo(t) && Fo(e) ? t.set({
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
  return Array.from({ length: s }, (l, c) => r + c);
}
const ca = new Ko("Calendar.Root | RangeCalender.Root");
class xl {
  static create(e) {
    return ca.set(new xl(e));
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
  #t = Ce(Xn([]));
  get months() {
    return a(this.#t);
  }
  set months(e) {
    w(this.#t, e, !0);
  }
  announcer;
  constructor(e) {
    this.opts = e, this.attachment = dr(this.opts.ref), this.domContext = new Zi(e.ref), this.announcer = Oo(null), this.formatter = hu({
      initialLocale: this.opts.locale.current,
      monthFormat: this.opts.monthFormat,
      yearFormat: this.opts.yearFormat
    }), this.setMonths = this.setMonths.bind(this), this.nextPage = this.nextPage.bind(this), this.prevPage = this.prevPage.bind(this), this.prevYear = this.prevYear.bind(this), this.nextYear = this.nextYear.bind(this), this.setYear = this.setYear.bind(this), this.setMonth = this.setMonth.bind(this), this.isOutsideVisibleMonths = this.isOutsideVisibleMonths.bind(this), this.isDateDisabled = this.isDateDisabled.bind(this), this.isDateSelected = this.isDateSelected.bind(this), this.shiftFocus = this.shiftFocus.bind(this), this.handleCellClick = this.handleCellClick.bind(this), this.handleMultipleUpdate = this.handleMultipleUpdate.bind(this), this.handleSingleUpdate = this.handleSingleUpdate.bind(this), this.onkeydown = this.onkeydown.bind(this), this.getBitsAttr = this.getBitsAttr.bind(this), Cc(() => {
      this.announcer = Oo(this.domContext.getDocument());
    }), this.months = mo({
      dateObj: this.opts.placeholder.current,
      weekStartsOn: this.opts.weekStartsOn.current,
      locale: this.opts.locale.current,
      fixedWeeks: this.opts.fixedWeeks.current,
      numberOfMonths: this.opts.numberOfMonths.current
    }), this.#s(), this.#i(), this.#l(), kv({
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
  #r = S(() => ra(() => this.opts.placeholder.current.year));
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
    Ve(() => {
      if (ra(() => this.opts.initialFocus.current)) {
        const n = this.opts.ref.current?.querySelector("[data-focused]");
        n && n.focus();
      }
    });
  }
  #i() {
    Ve(() => this.opts.ref.current ? Ev({
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
  #d = S(() => Av({
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
    return !this.visibleMonths.some((n) => ul(e, n));
  }
  isDateDisabled(e) {
    if (this.opts.isDateDisabled.current(e) || this.opts.disabled.current) return !0;
    const n = this.opts.minValue.current, r = this.opts.maxValue.current;
    return !!(n && xs(e, n) || r && xs(r, e));
  }
  isDateSelected(e) {
    const n = this.opts.value.current;
    return Array.isArray(n) ? n.some((r) => Ja(r, e)) : n ? Ja(n, e) : !1;
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
    const r = e.findIndex((s) => Ja(s, n)), i = this.opts.preventDeselect.current;
    if (r === -1) {
      const s = [...e, n];
      return this.#f(s) ? s : [n];
    } else {
      if (i)
        return e;
      {
        const s = e.filter((l) => !Ja(l, n));
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
    if (!this.opts.preventDeselect.current && Ja(e, n)) {
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
class Sl {
  static create(e) {
    return new Sl(e, ca.get());
  }
  opts;
  root;
  attachment;
  constructor(e, n) {
    this.opts = e, this.root = n, this.attachment = dr(this.opts.ref);
  }
  #e = S(() => ({
    id: this.opts.id.current,
    "aria-hidden": Xi(!0),
    "data-disabled": $t(this.root.opts.disabled.current),
    "data-readonly": $t(this.root.opts.readonly.current),
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
const fu = new Ko("Calendar.Cell | RangeCalendar.Cell");
class Il {
  static create(e) {
    return fu.set(new Il(e, ca.get()));
  }
  opts;
  root;
  #e = S(() => Or(this.opts.date.current));
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
  #n = S(() => uf(this.opts.date.current, Xa()));
  get isDateToday() {
    return a(this.#n);
  }
  set isDateToday(e) {
    w(this.#n, e);
  }
  #r = S(() => !ul(this.opts.date.current, this.opts.month.current));
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
  #i = S(() => Ja(this.opts.date.current, this.root.opts.placeholder.current));
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
    this.opts = e, this.root = n, this.attachment = dr(this.opts.ref);
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
    "data-unavailable": $t(this.isUnavailable),
    "data-today": this.isDateToday ? "" : void 0,
    "data-outside-month": this.isOutsideMonth ? "" : void 0,
    "data-outside-visible-months": this.isOutsideVisibleMonths ? "" : void 0,
    "data-focused": this.isFocusedDate ? "" : void 0,
    "data-selected": $t(this.isSelectedDate),
    "data-value": this.opts.date.current.toString(),
    "data-type": zf(this.opts.date.current),
    "data-disabled": $t(this.isDisabled || this.isOutsideMonth && this.root.opts.disableDaysOutsideMonth.current)
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
    "aria-selected": Pa(this.isSelectedDate),
    "aria-disabled": Pa(this.ariaDisabled),
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
class Rl {
  static create(e) {
    return new Rl(e, fu.get());
  }
  opts;
  cell;
  attachment;
  constructor(e, n) {
    this.opts = e, this.cell = n, this.onclick = this.onclick.bind(this), this.attachment = dr(this.opts.ref);
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
    "aria-disabled": Pa(this.cell.ariaDisabled),
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
class _l {
  static create(e) {
    return new _l(e, ca.get());
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
    this.opts = e, this.root = n, this.onclick = this.onclick.bind(this), this.attachment = dr(this.opts.ref);
  }
  onclick(e) {
    this.isDisabled || this.root.nextPage();
  }
  #t = S(() => ({
    id: this.opts.id.current,
    role: "button",
    type: "button",
    "aria-label": "Next",
    "aria-disabled": Pa(this.isDisabled),
    "data-disabled": $t(this.isDisabled),
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
class El {
  static create(e) {
    return new El(e, ca.get());
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
    this.opts = e, this.root = n, this.onclick = this.onclick.bind(this), this.attachment = dr(this.opts.ref);
  }
  onclick(e) {
    this.isDisabled || this.root.prevPage();
  }
  #t = S(() => ({
    id: this.opts.id.current,
    role: "button",
    type: "button",
    "aria-label": "Previous",
    "aria-disabled": Pa(this.isDisabled),
    "data-disabled": $t(this.isDisabled),
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
class kl {
  static create(e) {
    return new kl(e, ca.get());
  }
  opts;
  root;
  attachment;
  constructor(e, n) {
    this.opts = e, this.root = n, this.attachment = dr(this.opts.ref);
  }
  #e = S(() => ({
    id: this.opts.id.current,
    tabindex: -1,
    role: "grid",
    "aria-readonly": Pa(this.root.opts.readonly.current),
    "aria-disabled": Pa(this.root.opts.disabled.current),
    "data-readonly": $t(this.root.opts.readonly.current),
    "data-disabled": $t(this.root.opts.disabled.current),
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
class Dl {
  static create(e) {
    return new Dl(e, ca.get());
  }
  opts;
  root;
  attachment;
  constructor(e, n) {
    this.opts = e, this.root = n, this.attachment = dr(this.opts.ref);
  }
  #e = S(() => ({
    id: this.opts.id.current,
    "data-disabled": $t(this.root.opts.disabled.current),
    "data-readonly": $t(this.root.opts.readonly.current),
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
class Al {
  static create(e) {
    return new Al(e, ca.get());
  }
  opts;
  root;
  attachment;
  constructor(e, n) {
    this.opts = e, this.root = n, this.attachment = dr(this.opts.ref);
  }
  #e = S(() => ({
    id: this.opts.id.current,
    "data-disabled": $t(this.root.opts.disabled.current),
    "data-readonly": $t(this.root.opts.readonly.current),
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
class Tl {
  static create(e) {
    return new Tl(e, ca.get());
  }
  opts;
  root;
  attachment;
  constructor(e, n) {
    this.opts = e, this.root = n, this.attachment = dr(this.opts.ref);
  }
  #e = S(() => ({
    id: this.opts.id.current,
    "data-disabled": $t(this.root.opts.disabled.current),
    "data-readonly": $t(this.root.opts.readonly.current),
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
class Ml {
  static create(e) {
    return new Ml(e, ca.get());
  }
  opts;
  root;
  attachment;
  constructor(e, n) {
    this.opts = e, this.root = n, this.attachment = dr(this.opts.ref);
  }
  #e = S(() => ({
    id: this.opts.id.current,
    "data-disabled": $t(this.root.opts.disabled.current),
    "data-readonly": $t(this.root.opts.readonly.current),
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
class Ol {
  static create(e) {
    return new Ol(e, ca.get());
  }
  opts;
  root;
  attachment;
  constructor(e, n) {
    this.opts = e, this.root = n, this.attachment = dr(this.opts.ref);
  }
  #e = S(() => ({
    id: this.opts.id.current,
    "data-disabled": $t(this.root.opts.disabled.current),
    "data-readonly": $t(this.root.opts.readonly.current),
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
var Bv = V("<div><!></div>");
function vu(t, e) {
  const n = Lr();
  xt(e, !0);
  let r = E(e, "children", 7), i = E(e, "child", 7), s = E(e, "ref", 15, null), l = E(e, "id", 23, () => Tt(n)), c = Cr(e, [
    "$$slots",
    "$$events",
    "$$legacy",
    "$$host",
    "children",
    "child",
    "ref",
    "id"
  ]);
  const u = Rl.create({
    id: Ee(() => l()),
    ref: Ee(() => s(), (C) => s(C))
  }), b = S(() => br(c, u.props));
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
    set id(C = Tt(n)) {
      l(C), R();
    }
  }, y = ke(), x = Z(y);
  {
    var f = (C) => {
      var m = ke(), o = Z(m);
      {
        let M = S(() => ({ props: a(b), ...u.snippetProps }));
        Pt(o, i, () => a(M));
      }
      D(C, m);
    }, _ = (C) => {
      var m = Bv();
      Fr(m, () => ({ ...a(b) }));
      var o = T(m);
      {
        var M = ($) => {
          var ee = ke(), me = Z(ee);
          Pt(me, () => r() ?? wr, () => u.snippetProps), D($, ee);
        }, z = ($) => {
          var ee = $a();
          ge(() => W(ee, u.cell.opts.date.current.day)), D($, ee);
        };
        be(o, ($) => {
          r() ? $(M) : $(z, -1);
        });
      }
      k(m), D(C, m);
    };
    be(x, (C) => {
      i() ? C(f) : C(_, -1);
    });
  }
  return D(t, y), St(g);
}
It(vu, { children: {}, child: {}, ref: {}, id: {} }, [], [], { mode: "open" });
var qv = V("<table><!></table>");
function pu(t, e) {
  const n = Lr();
  xt(e, !0);
  let r = E(e, "children", 7), i = E(e, "child", 7), s = E(e, "ref", 15, null), l = E(e, "id", 23, () => Tt(n)), c = Cr(e, [
    "$$slots",
    "$$events",
    "$$legacy",
    "$$host",
    "children",
    "child",
    "ref",
    "id"
  ]);
  const u = kl.create({
    id: Ee(() => l()),
    ref: Ee(() => s(), (C) => s(C))
  }), b = S(() => br(c, u.props));
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
    set id(C = Tt(n)) {
      l(C), R();
    }
  }, y = ke(), x = Z(y);
  {
    var f = (C) => {
      var m = ke(), o = Z(m);
      Pt(o, i, () => ({ props: a(b) })), D(C, m);
    }, _ = (C) => {
      var m = qv();
      Fr(m, () => ({ ...a(b) }));
      var o = T(m);
      Pt(o, () => r() ?? wr), k(m), D(C, m);
    };
    be(x, (C) => {
      i() ? C(f) : C(_, -1);
    });
  }
  return D(t, y), St(g);
}
It(pu, { children: {}, child: {}, ref: {}, id: {} }, [], [], { mode: "open" });
var Uv = V("<tbody><!></tbody>");
function gu(t, e) {
  const n = Lr();
  xt(e, !0);
  let r = E(e, "children", 7), i = E(e, "child", 7), s = E(e, "ref", 15, null), l = E(e, "id", 23, () => Tt(n)), c = Cr(e, [
    "$$slots",
    "$$events",
    "$$legacy",
    "$$host",
    "children",
    "child",
    "ref",
    "id"
  ]);
  const u = Dl.create({
    id: Ee(() => l()),
    ref: Ee(() => s(), (C) => s(C))
  }), b = S(() => br(c, u.props));
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
    set id(C = Tt(n)) {
      l(C), R();
    }
  }, y = ke(), x = Z(y);
  {
    var f = (C) => {
      var m = ke(), o = Z(m);
      Pt(o, i, () => ({ props: a(b) })), D(C, m);
    }, _ = (C) => {
      var m = Uv();
      Fr(m, () => ({ ...a(b) }));
      var o = T(m);
      Pt(o, () => r() ?? wr), k(m), D(C, m);
    };
    be(x, (C) => {
      i() ? C(f) : C(_, -1);
    });
  }
  return D(t, y), St(g);
}
It(gu, { children: {}, child: {}, ref: {}, id: {} }, [], [], { mode: "open" });
var Vv = V("<td><!></td>");
function yu(t, e) {
  const n = Lr();
  xt(e, !0);
  let r = E(e, "children", 7), i = E(e, "child", 7), s = E(e, "ref", 15, null), l = E(e, "id", 23, () => Tt(n)), c = E(e, "date", 7), u = E(e, "month", 7), b = Cr(e, [
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
  const g = Il.create({
    id: Ee(() => l()),
    ref: Ee(() => s(), (o) => s(o)),
    date: Ee(() => c()),
    month: Ee(() => u())
  }), y = S(() => br(b, g.props));
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
    set id(o = Tt(n)) {
      l(o), R();
    },
    get date() {
      return c();
    },
    set date(o) {
      c(o), R();
    },
    get month() {
      return u();
    },
    set month(o) {
      u(o), R();
    }
  }, f = ke(), _ = Z(f);
  {
    var C = (o) => {
      var M = ke(), z = Z(M);
      {
        let $ = S(() => ({ props: a(y), ...g.snippetProps }));
        Pt(z, i, () => a($));
      }
      D(o, M);
    }, m = (o) => {
      var M = Vv();
      Fr(M, () => ({ ...a(y) }));
      var z = T(M);
      Pt(z, () => r() ?? wr, () => g.snippetProps), k(M), D(o, M);
    };
    be(_, (o) => {
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
var jv = V("<thead><!></thead>");
function mu(t, e) {
  const n = Lr();
  xt(e, !0);
  let r = E(e, "children", 7), i = E(e, "child", 7), s = E(e, "ref", 15, null), l = E(e, "id", 23, () => Tt(n)), c = Cr(e, [
    "$$slots",
    "$$events",
    "$$legacy",
    "$$host",
    "children",
    "child",
    "ref",
    "id"
  ]);
  const u = Al.create({
    id: Ee(() => l()),
    ref: Ee(() => s(), (C) => s(C))
  }), b = S(() => br(c, u.props));
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
    set id(C = Tt(n)) {
      l(C), R();
    }
  }, y = ke(), x = Z(y);
  {
    var f = (C) => {
      var m = ke(), o = Z(m);
      Pt(o, i, () => ({ props: a(b) })), D(C, m);
    }, _ = (C) => {
      var m = jv();
      Fr(m, () => ({ ...a(b) }));
      var o = T(m);
      Pt(o, () => r() ?? wr), k(m), D(C, m);
    };
    be(x, (C) => {
      i() ? C(f) : C(_, -1);
    });
  }
  return D(t, y), St(g);
}
It(mu, { children: {}, child: {}, ref: {}, id: {} }, [], [], { mode: "open" });
var Kv = V("<th><!></th>");
function bu(t, e) {
  const n = Lr();
  xt(e, !0);
  let r = E(e, "children", 7), i = E(e, "child", 7), s = E(e, "ref", 15, null), l = E(e, "id", 23, () => Tt(n)), c = Cr(e, [
    "$$slots",
    "$$events",
    "$$legacy",
    "$$host",
    "children",
    "child",
    "ref",
    "id"
  ]);
  const u = Ml.create({
    id: Ee(() => l()),
    ref: Ee(() => s(), (C) => s(C))
  }), b = S(() => br(c, u.props));
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
    set id(C = Tt(n)) {
      l(C), R();
    }
  }, y = ke(), x = Z(y);
  {
    var f = (C) => {
      var m = ke(), o = Z(m);
      Pt(o, i, () => ({ props: a(b) })), D(C, m);
    }, _ = (C) => {
      var m = Kv();
      Fr(m, () => ({ ...a(b) }));
      var o = T(m);
      Pt(o, () => r() ?? wr), k(m), D(C, m);
    };
    be(x, (C) => {
      i() ? C(f) : C(_, -1);
    });
  }
  return D(t, y), St(g);
}
It(bu, { children: {}, child: {}, ref: {}, id: {} }, [], [], { mode: "open" });
var Yv = V("<tr><!></tr>");
function Ki(t, e) {
  const n = Lr();
  xt(e, !0);
  let r = E(e, "children", 7), i = E(e, "child", 7), s = E(e, "ref", 15, null), l = E(e, "id", 23, () => Tt(n)), c = Cr(e, [
    "$$slots",
    "$$events",
    "$$legacy",
    "$$host",
    "children",
    "child",
    "ref",
    "id"
  ]);
  const u = Tl.create({
    id: Ee(() => l()),
    ref: Ee(() => s(), (C) => s(C))
  }), b = S(() => br(c, u.props));
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
    set id(C = Tt(n)) {
      l(C), R();
    }
  }, y = ke(), x = Z(y);
  {
    var f = (C) => {
      var m = ke(), o = Z(m);
      Pt(o, i, () => ({ props: a(b) })), D(C, m);
    }, _ = (C) => {
      var m = Yv();
      Fr(m, () => ({ ...a(b) }));
      var o = T(m);
      Pt(o, () => r() ?? wr), k(m), D(C, m);
    };
    be(x, (C) => {
      i() ? C(f) : C(_, -1);
    });
  }
  return D(t, y), St(g);
}
It(Ki, { children: {}, child: {}, ref: {}, id: {} }, [], [], { mode: "open" });
var zv = V("<header><!></header>");
function Cu(t, e) {
  const n = Lr();
  xt(e, !0);
  let r = E(e, "children", 7), i = E(e, "child", 7), s = E(e, "ref", 15, null), l = E(e, "id", 23, () => Tt(n)), c = Cr(e, [
    "$$slots",
    "$$events",
    "$$legacy",
    "$$host",
    "children",
    "child",
    "ref",
    "id"
  ]);
  const u = Ol.create({
    id: Ee(() => l()),
    ref: Ee(() => s(), (C) => s(C))
  }), b = S(() => br(c, u.props));
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
    set id(C = Tt(n)) {
      l(C), R();
    }
  }, y = ke(), x = Z(y);
  {
    var f = (C) => {
      var m = ke(), o = Z(m);
      Pt(o, i, () => ({ props: a(b) })), D(C, m);
    }, _ = (C) => {
      var m = zv();
      Fr(m, () => ({ ...a(b) }));
      var o = T(m);
      Pt(o, () => r() ?? wr), k(m), D(C, m);
    };
    be(x, (C) => {
      i() ? C(f) : C(_, -1);
    });
  }
  return D(t, y), St(g);
}
It(Cu, { children: {}, child: {}, ref: {}, id: {} }, [], [], { mode: "open" });
var Qv = V("<div><!></div>");
function wu(t, e) {
  const n = Lr();
  xt(e, !0);
  let r = E(e, "children", 7), i = E(e, "child", 7), s = E(e, "ref", 15, null), l = E(e, "id", 23, () => Tt(n)), c = Cr(e, [
    "$$slots",
    "$$events",
    "$$legacy",
    "$$host",
    "children",
    "child",
    "ref",
    "id"
  ]);
  const u = Sl.create({
    id: Ee(() => l()),
    ref: Ee(() => s(), (C) => s(C))
  }), b = S(() => br(c, u.props));
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
    set id(C = Tt(n)) {
      l(C), R();
    }
  }, y = ke(), x = Z(y);
  {
    var f = (C) => {
      var m = ke(), o = Z(m);
      Pt(o, i, () => ({
        props: a(b),
        headingValue: u.root.headingValue
      })), D(C, m);
    }, _ = (C) => {
      var m = Qv();
      Fr(m, () => ({ ...a(b) }));
      var o = T(m);
      {
        var M = ($) => {
          var ee = ke(), me = Z(ee);
          Pt(me, () => r() ?? wr, () => ({ headingValue: u.root.headingValue })), D($, ee);
        }, z = ($) => {
          var ee = $a();
          ge(() => W(ee, u.root.headingValue)), D($, ee);
        };
        be(o, ($) => {
          r() ? $(M) : $(z, -1);
        });
      }
      k(m), D(C, m);
    };
    be(x, (C) => {
      i() ? C(f) : C(_, -1);
    });
  }
  return D(t, y), St(g);
}
It(wu, { children: {}, child: {}, ref: {}, id: {} }, [], [], { mode: "open" });
var Wv = V("<button><!></button>");
function Pu(t, e) {
  const n = Lr();
  xt(e, !0);
  let r = E(e, "children", 7), i = E(e, "child", 7), s = E(e, "id", 23, () => Tt(n)), l = E(e, "ref", 15, null), c = E(e, "tabindex", 7, 0), u = Cr(e, [
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
  const b = _l.create({
    id: Ee(() => s()),
    ref: Ee(() => l(), (m) => l(m))
  }), g = S(() => br(u, b.props, { tabindex: c() }));
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
    set id(m = Tt(n)) {
      s(m), R();
    },
    get ref() {
      return l();
    },
    set ref(m = null) {
      l(m), R();
    },
    get tabindex() {
      return c();
    },
    set tabindex(m = 0) {
      c(m), R();
    }
  }, x = ke(), f = Z(x);
  {
    var _ = (m) => {
      var o = ke(), M = Z(o);
      Pt(M, i, () => ({ props: a(g) })), D(m, o);
    }, C = (m) => {
      var o = Wv();
      Fr(o, () => ({ ...a(g) }));
      var M = T(o);
      Pt(M, () => r() ?? wr), k(o), D(m, o);
    };
    be(f, (m) => {
      i() ? m(_) : m(C, -1);
    });
  }
  return D(t, x), St(y);
}
It(Pu, { children: {}, child: {}, id: {}, ref: {}, tabindex: {} }, [], [], { mode: "open" });
var Jv = V("<button><!></button>");
function xu(t, e) {
  const n = Lr();
  xt(e, !0);
  let r = E(e, "children", 7), i = E(e, "child", 7), s = E(e, "id", 23, () => Tt(n)), l = E(e, "ref", 15, null), c = E(e, "tabindex", 7, 0), u = Cr(e, [
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
    id: Ee(() => s()),
    ref: Ee(() => l(), (m) => l(m))
  }), g = S(() => br(u, b.props, { tabindex: c() }));
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
    set id(m = Tt(n)) {
      s(m), R();
    },
    get ref() {
      return l();
    },
    set ref(m = null) {
      l(m), R();
    },
    get tabindex() {
      return c();
    },
    set tabindex(m = 0) {
      c(m), R();
    }
  }, x = ke(), f = Z(x);
  {
    var _ = (m) => {
      var o = ke(), M = Z(o);
      Pt(M, i, () => ({ props: a(g) })), D(m, o);
    }, C = (m) => {
      var o = Jv();
      Fr(o, () => ({ ...a(g) }));
      var M = T(o);
      Pt(M, () => r() ?? wr), k(o), D(m, o);
    };
    be(f, (m) => {
      i() ? m(_) : m(C, -1);
    });
  }
  return D(t, x), St(y);
}
It(xu, { children: {}, child: {}, id: {}, ref: {}, tabindex: {} }, [], [], { mode: "open" });
const Fl = mc({
  component: "date-field",
  parts: ["input", "label", "segment"]
}), Bs = {
  day: {
    min: 1,
    max: (t) => {
      const e = t.segmentValues.month, n = t.value.current ?? t.placeholder.current;
      return ho(e ? n.set({ month: Number.parseInt(e) }) : n);
    },
    cycle: 1,
    padZero: !0
  },
  month: {
    min: 1,
    max: 12,
    cycle: 1,
    padZero: !0,
    getAnnouncement: (t, e) => e.placeholder.current ? `${t} - ${e.formatter.fullMonth(Or(e.placeholder.current.set({ month: t })))}` : ""
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
}, Rs = new Ko("DateField.Root");
class Ll {
  static create(e, n) {
    return Rs.set(new Ll(e, n));
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
  #e = Ce();
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
  #n = Ce(null);
  #r = Ce(null);
  #a = Ce(null);
  get descriptionNode() {
    return a(this.#a);
  }
  set descriptionNode(e) {
    w(this.#a, e, !0);
  }
  #s = Ce(null);
  get validationNode() {
    return a(this.#s);
  }
  set validationNode(e) {
    w(this.#s, e, !0);
  }
  states = Id();
  #i = Ce(null);
  get dayPeriodNode() {
    return a(this.#i);
  }
  set dayPeriodNode(e) {
    w(this.#i, e, !0);
  }
  rangeRoot = void 0;
  #l = Ce("");
  get name() {
    return a(this.#l);
  }
  set name(e) {
    w(this.#l, e, !0);
  }
  domContext = new Zi(() => null);
  constructor(e, n) {
    this.rangeRoot = n, this.value = e.value, this.placeholder = n ? n.opts.placeholder : e.placeholder, this.validate = n ? eh(void 0) : e.validate, this.minValue = n ? n.opts.minValue : e.minValue, this.maxValue = n ? n.opts.maxValue : e.maxValue, this.disabled = n ? n.opts.disabled : e.disabled, this.readonly = n ? n.opts.readonly : e.readonly, this.granularity = n ? n.opts.granularity : e.granularity, this.readonlySegments = n ? n.opts.readonlySegments : e.readonlySegments, this.hourCycle = n ? n.opts.hourCycle : e.hourCycle, this.locale = n ? n.opts.locale : e.locale, this.hideTimeZone = n ? n.opts.hideTimeZone : e.hideTimeZone, this.required = n ? n.opts.required : e.required, this.onInvalid = n ? n.opts.onInvalid : e.onInvalid, this.errorMessageId = n ? n.opts.errorMessageId : e.errorMessageId, this.isInvalidProp = e.isInvalidProp, this.formatter = hu({
      initialLocale: this.locale.current,
      monthFormat: Ee(() => "long"),
      yearFormat: Ee(() => "numeric")
    }), this.initialSegments = mi(this.inferredGranularity), this.segmentValues = this.initialSegments, this.announcer = Oo(null), this.getFieldNode = this.getFieldNode.bind(this), this.updateSegment = this.updateSegment.bind(this), this.handleSegmentClick = this.handleSegmentClick.bind(this), this.getBaseSegmentAttrs = this.getBaseSegmentAttrs.bind(this), Ve(() => {
      ra(() => {
        this.initialSegments = mi(this.inferredGranularity);
      });
    }), Cc(() => {
      this.announcer = Oo(this.domContext.getDocument());
    }), th(() => {
      n || yv(this.descriptionId, this.domContext.getDocument());
    }), Ve(() => {
      n || this.formatter.getLocale() !== this.locale.current && this.formatter.setLocale(this.locale.current);
    }), Ve(() => {
      if (n) return;
      if (this.value.current) {
        const i = ra(() => this.descriptionId);
        gv({
          id: i,
          formatter: this.formatter,
          value: this.value.current,
          doc: this.domContext.getDocument()
        });
      }
      const r = ra(() => this.placeholder.current);
      this.value.current && r !== this.value.current && ra(() => {
        this.value.current && (this.placeholder.current = this.value.current);
      });
    }), this.value.current && this.syncSegmentValues(this.value.current), Ve(() => {
      this.locale.current, this.value.current && this.syncSegmentValues(this.value.current), this.#o();
    }), Ve(() => {
      this.value.current === void 0 && (this.segmentValues = mi(this.inferredGranularity));
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
    const n = Zo.map((r) => {
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
      const r = bl.map((s) => {
        if (s === "dayPeriod")
          return this.states.dayPeriod.updating ? [s, this.states.dayPeriod.updating] : [s, this.formatter.dayPeriod(Or(e))];
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
    let c = l;
    const u = this.placeholder.current;
    if (fv(l)) {
      const b = l[e], g = n;
      if (e === "month") {
        const y = g(b);
        if (this.states.month.updating = y, y !== null && l.day !== null) {
          const x = u.set({ month: Number.parseInt(y) }), f = ho(Or(x));
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
          const x = this.formatter.dayPeriod(Or(u.set({ hour: Number.parseInt(y) })), this.hourCycle.current);
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
    } else if (Xo(e)) {
      const b = l[e], g = n, y = g(b);
      if (e === "month" && y !== null && l.day !== null) {
        this.states.month.updating = y;
        const x = u.set({ month: Number.parseInt(y) }), f = ho(Or(x));
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
    this.segmentValues = c, hv(c, a(this.#n)) ? this.setValue(uv({
      segmentObj: c,
      fieldNode: a(this.#n),
      dateRef: this.placeholder.current
    })) : (this.setValue(void 0), this.segmentValues = c);
  }
  handleSegmentClick(e) {
    this.disabled.current && e.preventDefault();
  }
  getBaseSegmentAttrs(e, n) {
    const r = this.readonlySegmentsSet.has(e), i = {
      "aria-invalid": Xi(this.isInvalid),
      "aria-disabled": Pa(this.disabled.current),
      "aria-readonly": Pa(this.readonly.current || r),
      "data-invalid": $t(this.isInvalid),
      "data-disabled": $t(this.disabled.current),
      "data-readonly": $t(this.readonly.current || r),
      "data-segment": `${e}`,
      [Fl.segment]: ""
    };
    if (e === "literal") return i;
    const s = this.descriptionNode?.id, l = pv(n, a(this.#n)) && s, c = this.errorMessageId?.current, u = l ? `${s} ${this.isInvalid && c ? c : ""}` : void 0, b = !(this.readonly.current || r || this.disabled.current);
    return {
      ...i,
      "aria-labelledby": this.#p(n),
      contenteditable: b ? "true" : void 0,
      "aria-describedby": u,
      tabindex: this.disabled.current ? void 0 : 0
    };
  }
}
class Hl {
  static create(e) {
    return new Hl(e, Rs.get());
  }
  opts;
  root;
  domContext;
  attachment;
  constructor(e, n) {
    this.opts = e, this.root = n, this.domContext = new Zi(e.ref), this.root.domContext = this.domContext, this.attachment = dr(e.ref, (r) => this.root.setFieldNode(r)), Fs(() => this.opts.name.current, (r) => {
      this.root.setName(r);
    });
  }
  #e = S(() => {
    if (!(!as || !this.domContext.getElementById(this.root.descriptionId)))
      return this.root.descriptionId;
  });
  #t = S(() => ({
    id: this.opts.id.current,
    role: "group",
    "aria-labelledby": this.root.getLabelNode()?.id ?? void 0,
    "aria-describedby": a(this.#e),
    "aria-disabled": Pa(this.root.disabled.current),
    "data-invalid": this.root.isInvalid ? "" : void 0,
    "data-disabled": $t(this.root.disabled.current),
    [Fl.input]: "",
    ...this.attachment
  }));
  get props() {
    return a(this.#t);
  }
  set props(e) {
    w(this.#t, e);
  }
}
class $l {
  static create() {
    return new $l(Rs.get());
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
    this.opts = e, this.root = n, this.part = r, this.config = i, this.announcer = n.announcer, this.onkeydown = this.onkeydown.bind(this), this.onfocusout = this.onfocusout.bind(this), this.attachment = dr(e.ref);
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
    if (!(e.ctrlKey || e.metaKey || this.root.disabled.current) && !((this.part === "hour" || this.part === "minute" || this.part === "second") && !(this.part in n)) && (e.key !== Yo && e.preventDefault(), !!Cl(e.key))) {
      if (Ul(e.key)) {
        this.#a(n);
        return;
      }
      if (Vl(e.key)) {
        this.#s(n);
        return;
      }
      if (jo(e.key)) {
        this.#i(e);
        return;
      }
      if (jl(e.key)) {
        this.#l(e);
        return;
      }
      yo(e.key) && go(e, this.root.getFieldNode());
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
    const i = this.#e(), s = Math.floor(i / 10), l = n === 0, c = this.part;
    this.root.updateSegment(this.part, (u) => {
      if (c in this.root.states && this.root.states[c].hasLeftFocus && (u = null, this.root.states[c].hasLeftFocus = !1), u === null)
        return l ? (c in this.root.states && (this.root.states[c].lastKeyZero = !0), this.announcer.announce("0"), "0") : (c in this.root.states && (this.root.states[c].lastKeyZero || n > s) && (r = !0), c in this.root.states && (this.root.states[c].lastKeyZero = !1), r && String(n).length === 1 ? (this.announcer.announce(n), `0${n}`) : `${n}`);
      if (c in this.root.states && this.root.states[c].lastKeyZero)
        return n !== 0 ? (r = !0, this.root.states[c].lastKeyZero = !1, `0${n}`) : this.part === "hour" && n === 0 && this.root.hourCycle.current === 24 ? (r = !0, this.root.states[c].lastKeyZero = !1, "00") : (this.part === "minute" || this.part === "second") && n === 0 ? (r = !0, this.root.states[c].lastKeyZero = !1, "00") : u;
      const b = Number.parseInt(u + n.toString());
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
    const s = i[this.part], l = this.#t(), c = this.#e();
    let u = r ? "Empty" : `${s}`;
    return this.part === "hour" && "dayPeriod" in e && e.dayPeriod && (u = r ? "Empty" : `${s} ${e.dayPeriod}`), {
      "aria-label": `${this.part}, `,
      "aria-valuemin": l,
      "aria-valuemax": c,
      "aria-valuenow": s,
      "aria-valuetext": u
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
    if (!(e.ctrlKey || e.metaKey || this.root.disabled.current) && (e.key !== Yo && e.preventDefault(), !!Cl(e.key))) {
      if (Ul(e.key)) {
        this.#n(), super.onkeydown(e);
        return;
      }
      if (Vl(e.key)) {
        this.#n(), super.onkeydown(e);
        return;
      }
      if (jo(e.key)) {
        this.#a(e);
        return;
      }
      if (jl(e.key)) {
        this.#s(e);
        return;
      }
      yo(e.key) && go(e, this.root.getFieldNode());
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
      const u = `${l}`;
      return u.length > 4 ? u.slice(0, 4) : u;
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
    if (jo(e.key)) {
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
class Nl {
  static create(e) {
    return new Nl(e, Rs.get());
  }
  opts;
  root;
  attachment;
  #e;
  constructor(e, n) {
    this.opts = e, this.root = n, this.#e = this.root.announcer, this.onkeydown = this.onkeydown.bind(this), this.attachment = dr(e.ref, (r) => this.root.dayPeriodNode = r);
  }
  onkeydown(e) {
    if (!(e.ctrlKey || e.metaKey || this.root.disabled.current) && (e.key !== Yo && e.preventDefault(), !!ap(e.key))) {
      if (Ul(e.key) || Vl(e.key)) {
        this.root.updateSegment("dayPeriod", (n) => {
          if (n === "AM")
            return this.#e.announce("PM"), "PM";
          const r = "AM";
          return this.#e.announce(r), r;
        });
        return;
      }
      jl(e.key) && (this.root.states.dayPeriod.hasLeftFocus = !1, this.root.updateSegment("dayPeriod", () => (this.#e.announce("AM"), "AM"))), (e.key === Fi || e.key === wc || Li) && this.root.updateSegment("dayPeriod", () => {
        const n = e.key === Fi || e.key === Li ? "AM" : "PM";
        return this.#e.announce(n), n;
      }), yo(e.key) && go(e, this.root.getFieldNode());
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
class Bl {
  static create(e) {
    return new Bl(e, Rs.get());
  }
  opts;
  root;
  attachment;
  constructor(e, n) {
    this.opts = e, this.root = n, this.attachment = dr(e.ref);
  }
  #e = S(() => ({
    id: this.opts.id.current,
    "aria-hidden": Xi(!0),
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
class ql {
  static create(e) {
    return new ql(e, Rs.get());
  }
  opts;
  root;
  attachment;
  constructor(e, n) {
    this.opts = e, this.root = n, this.onkeydown = this.onkeydown.bind(this), this.attachment = dr(e.ref);
  }
  onkeydown(e) {
    e.key !== Yo && e.preventDefault(), !this.root.disabled.current && yo(e.key) && go(e, this.root.getFieldNode());
  }
  #e = S(() => ({
    role: "textbox",
    id: this.opts.id.current,
    "aria-label": "timezone, ",
    style: { caretColor: "transparent" },
    onkeydown: this.onkeydown,
    ...this.root.getBaseSegmentAttrs("timeZoneName", this.opts.id.current),
    "data-readonly": $t(!0),
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
        return new Nl(n, r);
      case "literal":
        return new Bl(n, r);
      case "timeZoneName":
        return new ql(n, r);
    }
  }
}
function ap(t) {
  return Cl(t) || t === Fi || t === wc || t === Li || t === nh;
}
function Ul(t) {
  return t === Uo;
}
function Vl(t) {
  return t === Vo;
}
function jl(t) {
  return t === pc;
}
function Dd(t) {
  const n = 4 - String(t).length;
  return `${"0".repeat(n)}${t}`;
}
function Su(t, e) {
  xt(e, !0);
  const n = $l.create();
  var r = ke(), i = Z(r);
  {
    var s = (l) => {
      nf(l, Hs(() => n.props));
    };
    be(i, (l) => {
      n.shouldRender && l(s);
    });
  }
  D(t, r), St();
}
It(Su, {}, [], [], { mode: "open" });
var sp = V("<div><!></div>"), op = V("<!> <!>", 1);
function Iu(t, e) {
  const n = Lr();
  xt(e, !0);
  let r = E(e, "id", 23, () => Tt(n)), i = E(e, "ref", 15, null), s = E(e, "name", 7, ""), l = E(e, "children", 7), c = E(e, "child", 7), u = Cr(e, [
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
  const b = Hl.create({
    id: Ee(() => r()),
    ref: Ee(() => i(), (o) => i(o)),
    name: Ee(() => s())
  }), g = S(() => br(u, b.props));
  var y = {
    get id() {
      return r();
    },
    set id(o = Tt(n)) {
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
      return c();
    },
    set child(o) {
      c(o), R();
    }
  }, x = op(), f = Z(x);
  {
    var _ = (o) => {
      var M = ke(), z = Z(M);
      Pt(z, c, () => ({
        props: a(g),
        segments: b.root.segmentContents
      })), D(o, M);
    }, C = (o) => {
      var M = sp();
      Fr(M, () => ({ ...a(g) }));
      var z = T(M);
      Pt(z, () => l() ?? wr, () => ({ segments: b.root.segmentContents })), k(M), D(o, M);
    };
    be(f, (o) => {
      c() ? o(_) : o(C, -1);
    });
  }
  var m = F(f, 2);
  return Su(m, {}), D(t, x), St(y);
}
It(Iu, { id: {}, ref: {}, name: {}, children: {}, child: {} }, [], [], { mode: "open" });
var ip = V("<span><!></span>");
function Ru(t, e) {
  const n = Lr();
  xt(e, !0);
  let r = E(e, "id", 23, () => Tt(n)), i = E(e, "ref", 15, null), s = E(e, "children", 7), l = E(e, "child", 7), c = E(e, "part", 7), u = Cr(e, [
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
  const b = rp.create(c(), {
    id: Ee(() => r()),
    ref: Ee(() => i(), (m) => i(m))
  }), g = S(() => br(u, b.props));
  var y = {
    get id() {
      return r();
    },
    set id(m = Tt(n)) {
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
      return c();
    },
    set part(m) {
      c(m), R();
    }
  }, x = ke(), f = Z(x);
  {
    var _ = (m) => {
      var o = ke(), M = Z(o);
      Pt(M, l, () => ({ props: a(g) })), D(m, o);
    }, C = (m) => {
      var o = ip();
      Fr(o, () => ({ ...a(g) }));
      var M = T(o);
      Pt(M, () => s() ?? wr), k(o), D(m, o);
    };
    be(f, (m) => {
      l() ? m(_) : m(C, -1);
    });
  }
  return D(t, x), St(y);
}
It(Ru, { id: {}, ref: {}, children: {}, child: {}, part: {} }, [], [], { mode: "open" });
const _u = new Ko("DatePicker.Root");
class Kl {
  static create(e) {
    return _u.set(new Kl(e));
  }
  opts;
  constructor(e) {
    this.opts = e;
  }
}
function Eu(t, e) {
  xt(e, !0);
  let n = E(e, "open", 15, !1), r = E(e, "onOpenChange", 7, na), i = E(e, "onOpenChangeComplete", 7, na), s = E(e, "value", 15), l = E(e, "onValueChange", 7, na), c = E(e, "placeholder", 15), u = E(e, "onPlaceholderChange", 7, na), b = E(e, "isDateUnavailable", 7, () => !1), g = E(e, "validate", 7, na), y = E(e, "onInvalid", 7, na), x = E(e, "minValue", 7), f = E(e, "maxValue", 7), _ = E(e, "disabled", 7, !1), C = E(e, "readonly", 7, !1), m = E(e, "granularity", 7), o = E(e, "readonlySegments", 23, () => []), M = E(e, "hourCycle", 7), z = E(e, "locale", 7), $ = E(e, "hideTimeZone", 7, !1), ee = E(e, "required", 7, !1), me = E(e, "calendarLabel", 7, "Event"), O = E(e, "disableDaysOutsideMonth", 7, !0), X = E(e, "preventDeselect", 7, !1), pe = E(e, "pagedNavigation", 7, !1), Ie = E(e, "weekStartsOn", 7), te = E(e, "weekdayFormat", 7, "narrow"), fe = E(e, "isDateDisabled", 7, () => !1), ae = E(e, "fixedWeeks", 7, !1), De = E(e, "numberOfMonths", 7, 1), Me = E(e, "closeOnDateSelect", 7, !0), Pe = E(e, "initialFocus", 7, !1), de = E(e, "errorMessageId", 7), J = E(e, "children", 7), le = E(e, "monthFormat", 7, "long"), Re = E(e, "yearFormat", 7, "numeric");
  const we = Yf({
    granularity: m(),
    defaultValue: s(),
    minValue: x(),
    maxValue: f()
  });
  function N() {
    c() === void 0 && c(we);
  }
  N(), Fs.pre(() => c(), () => {
    N();
  });
  function I() {
    Me() && n(!1);
  }
  const Q = Kl.create({
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
    disabled: Ee(() => _()),
    readonly: Ee(() => C()),
    granularity: Ee(() => m()),
    readonlySegments: Ee(() => o()),
    hourCycle: Ee(() => M()),
    locale: rh(() => z()),
    hideTimeZone: Ee(() => $()),
    required: Ee(() => ee()),
    calendarLabel: Ee(() => me()),
    disableDaysOutsideMonth: Ee(() => O()),
    preventDeselect: Ee(() => X()),
    pagedNavigation: Ee(() => pe()),
    weekStartsOn: Ee(() => Ie()),
    weekdayFormat: Ee(() => te()),
    isDateDisabled: Ee(() => fe()),
    fixedWeeks: Ee(() => ae()),
    numberOfMonths: Ee(() => De()),
    initialFocus: Ee(() => Pe()),
    onDateSelect: Ee(() => I),
    defaultPlaceholder: we,
    monthFormat: Ee(() => le()),
    yearFormat: Ee(() => Re())
  });
  rf.create({
    open: Q.opts.open,
    onOpenChangeComplete: Ee(() => i())
  }), Ll.create({
    value: Q.opts.value,
    disabled: Q.opts.disabled,
    readonly: Q.opts.readonly,
    readonlySegments: Q.opts.readonlySegments,
    validate: Ee(() => g()),
    onInvalid: Ee(() => y()),
    minValue: Q.opts.minValue,
    maxValue: Q.opts.maxValue,
    granularity: Q.opts.granularity,
    hideTimeZone: Q.opts.hideTimeZone,
    hourCycle: Q.opts.hourCycle,
    locale: Q.opts.locale,
    required: Q.opts.required,
    placeholder: Q.opts.placeholder,
    errorMessageId: Ee(() => de()),
    isInvalidProp: Ee(() => {
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
    set onOpenChange(q = na) {
      r(q), R();
    },
    get onOpenChangeComplete() {
      return i();
    },
    set onOpenChangeComplete(q = na) {
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
    set onValueChange(q = na) {
      l(q), R();
    },
    get placeholder() {
      return c();
    },
    set placeholder(q) {
      c(q), R();
    },
    get onPlaceholderChange() {
      return u();
    },
    set onPlaceholderChange(q = na) {
      u(q), R();
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
    set validate(q = na) {
      g(q), R();
    },
    get onInvalid() {
      return y();
    },
    set onInvalid(q = na) {
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
      return M();
    },
    set hourCycle(q) {
      M(q), R();
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
      return me();
    },
    set calendarLabel(q = "Event") {
      me(q), R();
    },
    get disableDaysOutsideMonth() {
      return O();
    },
    set disableDaysOutsideMonth(q = !0) {
      O(q), R();
    },
    get preventDeselect() {
      return X();
    },
    set preventDeselect(q = !1) {
      X(q), R();
    },
    get pagedNavigation() {
      return pe();
    },
    set pagedNavigation(q = !1) {
      pe(q), R();
    },
    get weekStartsOn() {
      return Ie();
    },
    set weekStartsOn(q) {
      Ie(q), R();
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
      return ae();
    },
    set fixedWeeks(q = !1) {
      ae(q), R();
    },
    get numberOfMonths() {
      return De();
    },
    set numberOfMonths(q = 1) {
      De(q), R();
    },
    get closeOnDateSelect() {
      return Me();
    },
    set closeOnDateSelect(q = !0) {
      Me(q), R();
    },
    get initialFocus() {
      return Pe();
    },
    set initialFocus(q = !1) {
      Pe(q), R();
    },
    get errorMessageId() {
      return de();
    },
    set errorMessageId(q) {
      de(q), R();
    },
    get children() {
      return J();
    },
    set children(q) {
      J(q), R();
    },
    get monthFormat() {
      return le();
    },
    set monthFormat(q = "long") {
      le(q), R();
    },
    get yearFormat() {
      return Re();
    },
    set yearFormat(q = "numeric") {
      Re(q), R();
    }
  }, ce = ke(), se = Z(ce);
  return Ae(se, () => ah, (q, Fe) => {
    Fe(q, {
      children: (Xe, ut) => {
        var ue = ke(), Se = Z(ue);
        Pt(Se, () => J() ?? wr), D(Xe, ue);
      },
      $$slots: { default: !0 }
    });
  }), D(t, ce), St(ne);
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
var lp = V("<div><!></div>");
function ku(t, e) {
  const n = Lr();
  xt(e, !0);
  let r = E(e, "children", 7), i = E(e, "child", 7), s = E(e, "id", 23, () => Tt(n)), l = E(e, "ref", 15, null), c = Cr(e, [
    "$$slots",
    "$$events",
    "$$legacy",
    "$$host",
    "children",
    "child",
    "id",
    "ref"
  ]);
  const u = _u.get(), b = xl.create({
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
  }), g = S(() => br(c, b.props));
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
    set id(m = Tt(n)) {
      s(m), R();
    },
    get ref() {
      return l();
    },
    set ref(m = null) {
      l(m), R();
    }
  }, x = ke(), f = Z(x);
  {
    var _ = (m) => {
      var o = ke(), M = Z(o);
      {
        let z = S(() => ({ props: a(g), ...b.snippetProps }));
        Pt(M, i, () => a(z));
      }
      D(m, o);
    }, C = (m) => {
      var o = lp();
      Fr(o, () => ({ ...a(g) }));
      var M = T(o);
      Pt(M, () => r() ?? wr, () => b.snippetProps), k(o), D(m, o);
    };
    be(f, (m) => {
      i() ? m(_) : m(C, -1);
    });
  }
  return D(t, x), St(y);
}
It(ku, { children: {}, child: {}, id: {}, ref: {} }, [], [], { mode: "open" });
function Du(t, e) {
  xt(e, !0);
  let n = E(e, "ref", 15, null), r = E(e, "onOpenAutoFocus", 7), i = Cr(e, [
    "$$slots",
    "$$events",
    "$$legacy",
    "$$host",
    "ref",
    "onOpenAutoFocus"
  ]);
  const s = S(() => br({ onOpenAutoFocus: r() }, { onOpenAutoFocus: Ov }));
  var l = {
    get ref() {
      return n();
    },
    set ref(c = null) {
      n(c), R();
    },
    get onOpenAutoFocus() {
      return r();
    },
    set onOpenAutoFocus(c) {
      r(c), R();
    }
  };
  return af(t, Hs(() => a(s), () => i, {
    get ref() {
      return n();
    },
    set ref(c) {
      n(c);
    }
  })), St(l);
}
It(Du, { ref: {}, onOpenAutoFocus: {} }, [], [], { mode: "open" });
function Au(t, e) {
  xt(e, !0);
  let n = E(e, "ref", 15, null), r = E(e, "onkeydown", 7), i = Cr(e, [
    "$$slots",
    "$$events",
    "$$legacy",
    "$$host",
    "ref",
    "onkeydown"
  ]);
  function s(u) {
    if (yo(u.key)) {
      const g = u.currentTarget.closest(Fl.selector("input"));
      if (!g) return;
      go(u, g);
    }
  }
  const l = S(() => br({ onkeydown: r() }, { onkeydown: s }));
  var c = {
    get ref() {
      return n();
    },
    set ref(u = null) {
      n(u), R();
    },
    get onkeydown() {
      return r();
    },
    set onkeydown(u) {
      r(u), R();
    }
  };
  return sf(t, Hs(() => i, { "data-segment": "trigger" }, () => a(l), {
    get ref() {
      return n();
    },
    set ref(u) {
      n(u);
    }
  })), St(c);
}
It(Au, { ref: {}, onkeydown: {} }, [], [], { mode: "open" });
var dp = V('<div class="copy-icon svg-icon" aria-hidden="true"></div> <span> </span>', 1), cp = V('<div class="raw-json-icon svg-icon" aria-hidden="true"></div> <span> </span>', 1), up = V('<div class="open-in-new-icon svg-icon" aria-hidden="true"></div> <span> </span>', 1), hp = V("<!> <!>", 1), fp = V("<!> <!>", 1), vp = V("<!> <!>", 1), pp = V('<div class="broadcast-icon svg-icon" aria-hidden="true"></div> <span> </span>', 1), gp = V('<div class="trash-icon svg-icon" aria-hidden="true"></div> <span> </span>', 1), yp = V("<!> <!>", 1), mp = V("<!> <!> <!> <!>", 1);
const bp = {
  hash: "svelte-8tu42h",
  code: ".open-in-new-icon {mask-image:var(--ehagaki-icon-6f70656e5f696e5f6e65775f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}"
};
function lo(t, e) {
  xt(e, !0), Sa(t, bp);
  const n = () => es(Is, "$_", r), [r, i] = Ss(), s = (J) => {
    var le = ke(), Re = Z(le);
    Ae(Re, () => Kn, (we, N) => {
      N(we, {
        class: "menu-action-button",
        get onpointerdown() {
          return _();
        },
        get onSelect() {
          return C();
        },
        children: (I, Q) => {
          var ne = dp(), ce = F(Z(ne), 2), se = T(ce, !0);
          k(ce), ge((q) => W(se, q), [
            () => u() ? n()("postHistory.copyFailed") : n()("postHistory.copyNevent")
          ]), D(I, ne);
        },
        $$slots: { default: !0 }
      });
    }), D(J, le);
  }, l = (J) => {
    var le = ke(), Re = Z(le);
    Ae(Re, () => Kn, (we, N) => {
      N(we, {
        class: "menu-action-button",
        onSelect: () => M()(),
        children: (I, Q) => {
          var ne = cp(), ce = F(Z(ne), 2), se = T(ce, !0);
          k(ce), ge((q) => W(se, q), [() => n()("postHistory.rawJson")]), D(I, ne);
        },
        $$slots: { default: !0 }
      });
    }), D(J, le);
  };
  let c = E(e, "order", 7), u = E(e, "copyFailed", 7), b = E(e, "showBroadcast", 7), g = E(e, "broadcastSending", 7), y = E(e, "showDelete", 7), x = E(e, "showDeleteSeparator", 7), f = E(e, "deletionSending", 7), _ = E(e, "onCopyPointerDown", 7), C = E(e, "onCopyNevent", 7), m = E(e, "externalClientLabel", 7, void 0), o = E(e, "onOpenExternalClient", 7, void 0), M = E(e, "onShowRawJson", 7), z = E(e, "onBroadcastPointerDown", 7), $ = E(e, "onBroadcastPost", 7), ee = E(e, "onOpenDeleteConfirm", 7);
  var me = {
    get order() {
      return c();
    },
    set order(J) {
      c(J), R();
    },
    get copyFailed() {
      return u();
    },
    set copyFailed(J) {
      u(J), R();
    },
    get showBroadcast() {
      return b();
    },
    set showBroadcast(J) {
      b(J), R();
    },
    get broadcastSending() {
      return g();
    },
    set broadcastSending(J) {
      g(J), R();
    },
    get showDelete() {
      return y();
    },
    set showDelete(J) {
      y(J), R();
    },
    get showDeleteSeparator() {
      return x();
    },
    set showDeleteSeparator(J) {
      x(J), R();
    },
    get deletionSending() {
      return f();
    },
    set deletionSending(J) {
      f(J), R();
    },
    get onCopyPointerDown() {
      return _();
    },
    set onCopyPointerDown(J) {
      _(J), R();
    },
    get onCopyNevent() {
      return C();
    },
    set onCopyNevent(J) {
      C(J), R();
    },
    get externalClientLabel() {
      return m();
    },
    set externalClientLabel(J = void 0) {
      m(J), R();
    },
    get onOpenExternalClient() {
      return o();
    },
    set onOpenExternalClient(J = void 0) {
      o(J), R();
    },
    get onShowRawJson() {
      return M();
    },
    set onShowRawJson(J) {
      M(J), R();
    },
    get onBroadcastPointerDown() {
      return z();
    },
    set onBroadcastPointerDown(J) {
      z(J), R();
    },
    get onBroadcastPost() {
      return $();
    },
    set onBroadcastPost(J) {
      $(J), R();
    },
    get onOpenDeleteConfirm() {
      return ee();
    },
    set onOpenDeleteConfirm(J) {
      ee(J), R();
    }
  }, O = mp(), X = Z(O);
  {
    var pe = (J) => {
      var le = hp(), Re = Z(le);
      Ae(Re, () => Kn, (N, I) => {
        I(N, {
          class: "menu-action-button",
          get onSelect() {
            return o();
          },
          children: (Q, ne) => {
            var ce = up(), se = F(Z(ce), 2), q = T(se, !0);
            k(se), ge(() => W(q, m())), D(Q, ce);
          },
          $$slots: { default: !0 }
        });
      });
      var we = F(Re, 2);
      Ae(we, () => Ma, (N, I) => {
        I(N, { class: "post-history-menu-separator" });
      }), D(J, le);
    };
    be(X, (J) => {
      m() && o() && J(pe);
    });
  }
  var Ie = F(X, 2);
  {
    var te = (J) => {
      var le = fp(), Re = Z(le);
      l(Re);
      var we = F(Re, 2);
      s(we), D(J, le);
    }, fe = (J) => {
      var le = vp(), Re = Z(le);
      s(Re);
      var we = F(Re, 2);
      l(we), D(J, le);
    };
    be(Ie, (J) => {
      c() === "raw-json-first" ? J(te) : J(fe, -1);
    });
  }
  var ae = F(Ie, 2);
  {
    var De = (J) => {
      var le = ke(), Re = Z(le);
      Ae(Re, () => Kn, (we, N) => {
        N(we, {
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
            var ne = pp(), ce = F(Z(ne), 2), se = T(ce, !0);
            k(ce), ge((q) => W(se, q), [() => n()("postHistory.broadcast")]), D(I, ne);
          },
          $$slots: { default: !0 }
        });
      }), D(J, le);
    };
    be(ae, (J) => {
      b() && J(De);
    });
  }
  var Me = F(ae, 2);
  {
    var Pe = (J) => {
      var le = yp(), Re = Z(le);
      {
        var we = (I) => {
          var Q = ke(), ne = Z(Q);
          Ae(ne, () => Ma, (ce, se) => {
            se(ce, { class: "post-history-menu-separator" });
          }), D(I, Q);
        };
        be(Re, (I) => {
          x() && I(we);
        });
      }
      var N = F(Re, 2);
      Ae(N, () => Kn, (I, Q) => {
        Q(I, {
          class: "menu-action-button menu-action-button-danger",
          get disabled() {
            return f();
          },
          onSelect: () => ee()(),
          children: (ne, ce) => {
            var se = gp(), q = F(Z(se), 2), Fe = T(q, !0);
            k(q), ge((Xe) => W(Fe, Xe), [
              () => f() ? n()("postHistory.deleteSending") : n()("postHistory.delete")
            ]), D(ne, se);
          },
          $$slots: { default: !0 }
        });
      }), D(J, le);
    };
    be(Me, (J) => {
      y() && J(Pe);
    });
  }
  D(t, O);
  var de = St(me);
  return i(), de;
}
It(
  lo,
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
var Cp = V('<img class="post-history-related-avatar svelte-1g9bqtt"/>'), wp = V('<span class="post-history-related-avatar-placeholder svelte-1g9bqtt" aria-hidden="true"></span>'), Pp = V('<article class="post-history-related-card svelte-1g9bqtt"><!> <div class="post-history-related-card-body svelte-1g9bqtt"><div class="post-history-related-author svelte-1g9bqtt"><!> <span class="post-history-related-author-name svelte-1g9bqtt"> </span></div> <!> <!></div></article>');
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
function Yl(t, e) {
  xt(e, !0), Sa(t, xp);
  let n = E(e, "event", 7), r = E(e, "profile", 7, null), i = E(e, "media", 7, void 0), s = E(e, "model", 7, void 0), l = E(e, "emojiLoadStateByUrl", 23, () => ({})), c = E(e, "emojiImageMetaByUrl", 23, () => ({})), u = E(e, "scrollRoot", 7, null), b = E(e, "onImageOpen", 7, void 0), g = E(e, "topActions", 7, void 0), y = E(e, "footerLeftExtras", 7, void 0), x = E(e, "footerActions", 7, void 0), f = E(e, "footerMenu", 7, void 0), _ = S(() => {
    const ae = r()?.displayName?.trim() || r()?.name?.trim();
    return ae || xc(Sc.npubEncode(n().pubkey), 12, 4);
  }), C = S(() => s() ?? Hi({
    sourceContent: n().content,
    tags: n().tags,
    media: i()
  })), m = S(() => $i(n().created_at * 1e3));
  var o = {
    get event() {
      return n();
    },
    set event(ae) {
      n(ae), R();
    },
    get profile() {
      return r();
    },
    set profile(ae = null) {
      r(ae), R();
    },
    get media() {
      return i();
    },
    set media(ae = void 0) {
      i(ae), R();
    },
    get model() {
      return s();
    },
    set model(ae = void 0) {
      s(ae), R();
    },
    get emojiLoadStateByUrl() {
      return l();
    },
    set emojiLoadStateByUrl(ae = {}) {
      l(ae), R();
    },
    get emojiImageMetaByUrl() {
      return c();
    },
    set emojiImageMetaByUrl(ae = {}) {
      c(ae), R();
    },
    get scrollRoot() {
      return u();
    },
    set scrollRoot(ae = null) {
      u(ae), R();
    },
    get onImageOpen() {
      return b();
    },
    set onImageOpen(ae = void 0) {
      b(ae), R();
    },
    get topActions() {
      return g();
    },
    set topActions(ae = void 0) {
      g(ae), R();
    },
    get footerLeftExtras() {
      return y();
    },
    set footerLeftExtras(ae = void 0) {
      y(ae), R();
    },
    get footerActions() {
      return x();
    },
    set footerActions(ae = void 0) {
      x(ae), R();
    },
    get footerMenu() {
      return f();
    },
    set footerMenu(ae = void 0) {
      f(ae), R();
    }
  }, M = Pp(), z = T(M);
  Pt(z, () => g() ?? wr);
  var $ = F(z, 2), ee = T($), me = T(ee);
  {
    var O = (ae) => {
      var De = Cp();
      ge(() => {
        Cn(De, "src", r().picture), Cn(De, "alt", a(_));
      }), D(ae, De);
    }, X = (ae) => {
      var De = wp();
      D(ae, De);
    };
    be(me, (ae) => {
      r()?.picture ? ae(O) : ae(X, -1);
    });
  }
  var pe = F(me, 2), Ie = T(pe, !0);
  k(pe), k(ee);
  var te = F(ee, 2);
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
      return c();
    },
    get scrollRoot() {
      return u();
    },
    get onImageOpen() {
      return b();
    }
  });
  var fe = F(te, 2);
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
  }), k($), k(M), ge(() => W(Ie, a(_))), D(t, M), St(o);
}
It(
  Yl,
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
var Sp = V('<article class="post-history-quote-status-card svelte-1rnem6w"><div class="post-history-quote-status-body svelte-1rnem6w"><p> </p> <!></div></article>');
const Ip = {
  hash: "svelte-1rnem6w",
  code: `.post-history-quote-status-card.svelte-1rnem6w {display:grid;border-inline-start:2px solid
            color-mix(in srgb, var(--theme), transparent 45%);background:color-mix(in srgb, var(--dialog-bg), var(--border-hr) 24%);color:var(--text);font-size:0.9rem;}.post-history-quote-status-body.svelte-1rnem6w {display:grid;gap:8px;padding:2px 10px 10px;}.post-history-quote-status-message.svelte-1rnem6w {margin:0;color:var(--text-muted);line-height:1.45;}.post-history-quote-status-error.svelte-1rnem6w {color:var(--danger);}.post-history-quote-retry-button {justify-self:start;}`
};
function Tu(t, e) {
  xt(e, !0), Sa(t, Ip);
  const n = () => es(Is, "$_", r), [r, i] = Ss();
  let s = E(e, "preview", 7), l = E(e, "model", 7, void 0), c = E(e, "emojiLoadStateByUrl", 23, () => ({})), u = E(e, "emojiImageMetaByUrl", 23, () => ({})), b = E(e, "scrollRoot", 7, null), g = E(e, "onImageOpen", 7, void 0), y = E(e, "onRetry", 7, void 0), x = E(e, "footerMenu", 7, void 0);
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
      return c();
    },
    set emojiLoadStateByUrl($ = {}) {
      c($), R();
    },
    get emojiImageMetaByUrl() {
      return u();
    },
    set emojiImageMetaByUrl($ = {}) {
      u($), R();
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
  }, C = ke(), m = Z(C);
  {
    var o = ($) => {
      Yl($, {
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
    }, M = ($) => {
      var ee = Sp(), me = T(ee), O = T(me);
      let X;
      var pe = T(O, !0);
      k(O);
      var Ie = F(O, 2);
      {
        var te = (fe) => {
          lr(fe, {
            type: "button",
            className: "post-history-quote-retry-button",
            onClick: () => y()?.(s().eventId),
            children: (ae, De) => {
              ws();
              var Me = $a();
              ge((Pe) => W(Me, Pe), [() => n()("postHistory.contextRetry")]), D(ae, Me);
            },
            $$slots: { default: !0 }
          });
        };
        be(Ie, (fe) => {
          s().status === "error" && fe(te);
        });
      }
      k(me), k(ee), ge(
        (fe) => {
          X = Ha(O, 1, "post-history-quote-status-message svelte-1rnem6w", null, X, {
            "post-history-quote-status-error": s().status === "error"
          }), W(pe, fe);
        },
        [() => f()]
      ), D($, ee);
    };
    be(m, ($) => {
      s().status === "resolved" ? $(o) : $(M, -1);
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
function kp() {
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
function Ap(t) {
  return t.tags.filter(
    (e) => e[0] === "e" && typeof e[1] == "string" && Ep.test(e[1])
  ).length;
}
class Tp {
  postHistoryRepository;
  deletionRequestsRepository;
  constructor(e = {}) {
    this.postHistoryRepository = e.postHistoryRepository ?? Ze, this.deletionRequestsRepository = e.deletionRequestsRepository ?? $s;
  }
  async importFile(e) {
    const n = kp(), r = /* @__PURE__ */ new Set(), i = [];
    let s = !1, l = null;
    const c = Number.isFinite(e.file.size) && e.file.size > 0 ? e.file.size : 0;
    let u = 0;
    const b = () => n.invalidJsonCount > 0 || n.invalidStructureCount > 0 || n.invalidIdOrSignatureCount > 0, g = () => e.signal?.aborted ? "cancelled" : e.getCurrentPubkeyHex() !== e.ownerPubkeyHex ? "account-changed" : null, y = ($ = !1) => {
      if (!e.onProgress)
        return;
      const ee = performance.now();
      !$ && l !== null && ee - l < _p || (l = ee, e.onProgress({
        result: Dp(n),
        processedBytes: u,
        totalBytes: c
      }));
    }, x = ($) => {
      $ <= 0 || (u = Math.min(
        c,
        Math.max(u, u + $)
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
      })), me = i.filter((X) => X.type === "deletion").map((X) => X.event);
      if (i.length = 0, ee.length > 0)
        try {
          const X = await this.postHistoryRepository.upsertFetchedEvents({
            events: ee
          });
          n.insertedPostCount += X.insertedCount, n.updatedPostCount += X.updatedCount, n.unchangedPostCount += X.unchangedCount, n.appliedDeletionPostCount += X.appliedDeletionCount;
        } catch {
          n.failedPostEventCount += ee.length, s = !0;
        }
      const O = g();
      if (O)
        return O;
      if (me.length > 0)
        try {
          const X = await this.deletionRequestsRepository.upsertImportedDeletionEvents({
            ownerPubkeyHex: e.ownerPubkeyHex,
            deletionEvents: me
          });
          n.insertedDeletionRequestCount += X.insertedCount, n.updatedDeletionRequestCount += X.updatedCount, n.unchangedDeletionRequestCount += X.unchangedCount, n.unsupportedDeletionEventCount += X.ignoredCount, n.appliedDeletionPostCount += X.appliedDeletionCount;
        } catch {
          n.failedDeletionEventCount += me.length, s = !0;
        }
      return y(), g();
    }, _ = async ($) => {
      const ee = g();
      if (ee)
        return ee;
      if ($.trim().length === 0)
        return null;
      n.nonEmptyLineCount += 1;
      let me;
      try {
        me = JSON.parse($);
      } catch {
        return n.invalidJsonCount += 1, null;
      }
      if (!el(me))
        return n.invalidStructureCount += 1, null;
      const O = me;
      if (O.pubkey !== e.ownerPubkeyHex)
        return n.otherAccountCount += 1, null;
      if (O.kind !== 1 && O.kind !== 42 && O.kind !== 5)
        return n.unsupportedKindCount += 1, null;
      const X = sh(O);
      if (!X)
        return n.invalidIdOrSignatureCount += 1, null;
      if (r.has(O.id))
        return n.fileDuplicateCount += 1, null;
      if (r.add(O.id), O.kind === 1 || O.kind === 42)
        n.uniquePostEventCount += 1, i.push({ type: "post", ...X });
      else if (O.kind === 5) {
        n.uniqueDeletionEventCount += 1;
        const pe = Ap(O);
        if (n.validDeletionETagCount += pe, pe === 0)
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
    let M = "";
    try {
      for (; ; ) {
        const $ = g();
        if ($)
          return n.status = $, await C.cancel().catch(() => {
          }), i.length = 0, y(!0), n;
        const ee = await C.read();
        if (ee.done) {
          if (M += o.decode(), M.length > 0) {
            const O = await _(M.replace(/\r$/, ""));
            if (O)
              return n.status = O, i.length = 0, y(!0), n;
          }
          break;
        }
        M += o.decode(ee.value, { stream: !0 });
        const me = M.split(`
`);
        M = me.pop() ?? "";
        for (const O of me) {
          const X = await _(O.replace(/\r$/, ""));
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
var Op = V('<div class="xmark-icon svg-icon svelte-1qfqhib" aria-hidden="true"></div>'), Fp = V('<span class="import-icon svg-icon svelte-1qfqhib" aria-hidden="true"></span> <span> </span>', 1), Lp = V('<div aria-live="polite"> </div>'), Hp = V('<div class="import-progress-indicator"></div>'), $p = V('<div class="import-progress svelte-1qfqhib"><!> <div class="import-progress-summary svelte-1qfqhib"><span class="import-progress-metric svelte-1qfqhib"><span> </span> <span class="import-progress-number svelte-1qfqhib"> </span></span> <span class="import-progress-metric svelte-1qfqhib"><span> </span> <span class="import-progress-number svelte-1qfqhib"> </span></span> <span class="import-progress-metric svelte-1qfqhib"><span> </span> <span class="import-progress-number svelte-1qfqhib"> </span></span></div> <!></div>'), Np = V('<div class="import-results svelte-1qfqhib"><section aria-labelledby="post-history-import-input-heading" class="svelte-1qfqhib"><h3 id="post-history-import-input-heading" class="svelte-1qfqhib"> </h3> <dl class="svelte-1qfqhib"><div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div> <div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div> <div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div> <div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div> <div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div> <div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div> <div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div></dl></section> <section aria-labelledby="post-history-import-post-heading" class="svelte-1qfqhib"><h3 id="post-history-import-post-heading" class="svelte-1qfqhib"> </h3> <dl class="svelte-1qfqhib"><div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div> <div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div> <div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div> <div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div> <div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div> <div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div></dl></section> <section aria-labelledby="post-history-import-deletion-heading" class="svelte-1qfqhib"><h3 id="post-history-import-deletion-heading" class="svelte-1qfqhib"> </h3> <dl class="svelte-1qfqhib"><div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div> <div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div> <div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div> <div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div> <div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div> <div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div> <div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div></dl></section></div>'), Bp = V('<div class="import-heading svelte-1qfqhib"><h2 class="svelte-1qfqhib"> </h2> <p class="svelte-1qfqhib"> </p></div> <input class="visually-hidden import-file-input" type="file"/> <div role="presentation"><!> <p class="import-drop-hint svelte-1qfqhib"> </p></div> <!> <!>', 1);
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
  xt(e, !0), Sa(t, qp);
  const n = () => es(Is, "$_", r), [r, i] = Ss();
  let s = E(e, "open", 15, !1), l = E(e, "ownerPubkeyHex", 7), c = E(e, "getCurrentPubkeyHex", 7), u = E(e, "onOpenChange", 7, void 0), b = E(e, "onImported", 7, void 0), g = Ce(null), y = Ce(!1), x = Ce(null), f = Ce(null), _ = Ce(0), C = Ce(0), m = Ce(0), o = Ce(0), M = null, z = null, $ = null, ee = 0, me = !1, O = S(() => a(f)?.processedBytes ?? a(_)), X = S(() => a(f)?.totalBytes ?? a(C)), pe = S(() => a(X) <= 0 ? 0 : Math.min(100, Math.max(0, Math.round(a(O) / a(X) * 100)))), Ie = S(() => {
    if (a(O) <= 0 || a(X) <= 0 || a(O) >= a(X) || a(m) < 1e3)
      return null;
    const ue = a(O) / a(m), Se = (a(X) - a(O)) / ue;
    return Number.isFinite(Se) && Se >= 0 ? Se : null;
  }), te = S(() => a(y) ? a(Ie) === null ? n()("postHistory.importRemainingTimeCalculating") : fe(a(Ie)) : a(x)?.status === "completed" || a(x)?.status === "partial" ? fe(0) : n()("postHistory.importRemainingTimeUnavailable"));
  function fe(ue) {
    const Se = Math.max(0, Math.floor(ue / 1e3)), Ne = String(Se % 60).padStart(2, "0"), re = Math.floor(Se / 60), at = re % 60;
    return re < 60 ? `${at}:${Ne}` : `${Math.floor(re / 60)}:${String(at).padStart(2, "0")}:${Ne}`;
  }
  function ae() {
    $ !== null && w(m, Math.max(0, performance.now() - $), !0);
  }
  function De() {
    z !== null && (clearInterval(z), z = null), $ = null;
  }
  function Me() {
    De(), w(m, 0), $ = performance.now(), z = setInterval(ae, 1e3);
  }
  function Pe() {
    De(), w(f, null), w(_, 0), w(C, 0), w(m, 0);
  }
  function de(ue) {
    return `translate: -${100 - ue}% 0;`;
  }
  let J = S(() => a(y) ? "postHistory.importReading" : a(x) ? a(x).status === "completed" ? "postHistory.importComplete" : a(x).status === "partial" ? "postHistory.importPartial" : a(x).status === "account-changed" ? "postHistory.importAccountChanged" : a(x).status === "cancelled" ? "postHistory.importCancelled" : "postHistory.importFailed" : null);
  function le() {
    w(x, null), w(y, !1), Pe(), w(o, 0), M = null, a(g) && (a(g).value = "");
  }
  function Re() {
    ee += 1, M?.abort(), M = null, w(y, !1), Pe(), w(o, 0);
  }
  function we(ue) {
    ue || Re(), u()?.(ue);
  }
  function N() {
    !a(y) && l() && a(g)?.click();
  }
  function I(ue) {
    return ue ? Array.from(ue.types).includes("Files") || ue.files.length > 0 : !1;
  }
  function Q(ue) {
    I(ue.dataTransfer) && (ue.preventDefault(), w(o, a(o) + 1));
  }
  function ne(ue) {
    ue.preventDefault(), I(ue.dataTransfer);
  }
  function ce(ue) {
    a(o) === 0 && !I(ue.dataTransfer) || w(o, Math.max(0, a(o) - 1), !0);
  }
  function se(ue) {
    if (ue.preventDefault(), !I(ue.dataTransfer))
      return;
    w(o, 0);
    const Se = ue.dataTransfer?.files[0];
    Se && q(Se);
  }
  async function q(ue) {
    if (a(y) || !l())
      return;
    const Se = ++ee, Ne = new AbortController();
    M = Ne, w(y, !0), w(x, null), w(f, null), w(_, 0), w(C, Number.isFinite(ue.size) && ue.size > 0 ? ue.size : 0, !0), Me();
    try {
      const re = await Mp.importFile({
        file: ue,
        ownerPubkeyHex: l(),
        getCurrentPubkeyHex: c(),
        signal: Ne.signal,
        onProgress: (mt) => {
          Se === ee && s() && (w(
            f,
            {
              result: { ...mt.result },
              processedBytes: mt.processedBytes,
              totalBytes: mt.totalBytes
            },
            !0
          ), w(_, mt.processedBytes, !0), w(C, mt.totalBytes, !0), w(x, { ...mt.result }, !0), ae());
        }
      });
      if (Se !== ee || !s())
        return;
      w(x, re, !0), re.insertedPostCount + re.updatedPostCount + re.appliedDeletionPostCount > 0 && await b()?.();
    } finally {
      Se === ee && (w(y, !1), De(), M = null);
    }
  }
  async function Fe(ue) {
    const Se = ue.currentTarget, Ne = Se.files?.[0];
    Se.value = "", Ne && await q(Ne);
  }
  Ve(() => {
    s() && !me ? le() : !s() && me && Re(), me = s();
  }), Ns(De);
  var Xe = {
    get open() {
      return s();
    },
    set open(ue = !1) {
      s(ue), R();
    },
    get ownerPubkeyHex() {
      return l();
    },
    set ownerPubkeyHex(ue) {
      l(ue), R();
    },
    get getCurrentPubkeyHex() {
      return c();
    },
    set getCurrentPubkeyHex(ue) {
      c(ue), R();
    },
    get onOpenChange() {
      return u();
    },
    set onOpenChange(ue = void 0) {
      u(ue), R();
    },
    get onImported() {
      return b();
    },
    set onImported(ue = void 0) {
      b(ue), R();
    }
  };
  {
    const ue = (re) => {
      var at = ke(), mt = Z(at);
      {
        const nt = (st, rt) => {
          let Kt = () => rt?.().props;
          {
            let et = S(() => n()("global.close"));
            lr(st, Hs(Kt, {
              className: "modal-close",
              shape: "square",
              get ariaLabel() {
                return a(et);
              },
              children: (Qe, tt) => {
                var Je = Op();
                D(Qe, Je);
              },
              $$slots: { default: !0 }
            }));
          }
        };
        Ae(mt, () => Bc, (st, rt) => {
          rt(st, { child: nt, $$slots: { child: !0 } });
        });
      }
      D(re, at);
    };
    let Se = S(() => n()("postHistory.importTitle")), Ne = S(() => n()("postHistory.importDescription"));
    Nc(t, {
      onOpenChange: we,
      get title() {
        return a(Se);
      },
      get description() {
        return a(Ne);
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
      children: (re, at) => {
        var mt = Bp(), nt = Z(mt), st = T(nt), rt = T(st, !0);
        k(st);
        var Kt = F(st, 2), et = T(Kt, !0);
        k(Kt), k(nt);
        var Qe = F(nt, 2);
        Ni(Qe, (Nt) => w(g, Nt), () => a(g));
        var tt = F(Qe, 2);
        let Je;
        var Yn = T(tt);
        {
          let Nt = S(() => a(y) || !l()), rn = S(() => n()("postHistory.importChooseFile"));
          lr(Yn, {
            className: "post-history-import-file-button",
            variant: "default",
            shape: "pill",
            get disabled() {
              return a(Nt);
            },
            get ariaLabel() {
              return a(rn);
            },
            onClick: N,
            children: (an, Pn) => {
              var un = Fp(), On = F(Z(un), 2), zn = T(On, !0);
              k(On), ge((hr) => W(zn, hr), [() => n()("postHistory.importChooseFile")]), D(an, un);
            },
            $$slots: { default: !0 }
          });
        }
        var bt = F(Yn, 2), Mt = T(bt, !0);
        k(bt), k(tt);
        var Le = F(tt, 2);
        {
          var Yt = (Nt) => {
            var rn = $p(), an = T(rn);
            {
              var Pn = (hn) => {
                var Sn = Lp();
                let Wn;
                var er = T(Sn, !0);
                k(Sn), ge(
                  (Hr) => {
                    Wn = Ha(Sn, 1, "import-progress-status svelte-1qfqhib", null, Wn, {
                      "import-progress-status-error": a(x)?.status === "failed"
                    }), W(er, Hr);
                  },
                  [() => n()(a(J))]
                ), D(hn, Sn);
              };
              be(an, (hn) => {
                a(J) && hn(Pn);
              });
            }
            var un = F(an, 2), On = T(un), zn = T(On), hr = T(zn, !0);
            k(zn);
            var zt = F(zn, 2), ht = T(zt);
            k(zt), k(On);
            var _r = F(On, 2), ot = T(_r), sn = T(ot, !0);
            k(ot);
            var Qn = F(ot, 2), Hn = T(Qn, !0);
            k(Qn), k(_r);
            var fr = F(_r, 2), $n = T(fr), Fn = T($n, !0);
            k($n);
            var xn = F($n, 2), Pr = T(xn, !0);
            k(xn), k(fr), k(un);
            var ua = F(un, 2);
            {
              let hn = S(() => n()("postHistory.importProgressBarLabel")), Sn = S(() => `${a(pe)}%`);
              Ae(ua, () => oh, (Wn, er) => {
                er(Wn, {
                  get value() {
                    return a(pe);
                  },
                  max: 100,
                  get "aria-label"() {
                    return a(hn);
                  },
                  get "aria-valuetext"() {
                    return a(Sn);
                  },
                  class: "import-progress-root",
                  children: (Hr, ha) => {
                    var $r = Hp();
                    ge((aa) => zo($r, aa), [() => de(a(pe))]), D(Hr, $r);
                  },
                  $$slots: { default: !0 }
                });
              });
            }
            k(rn), ge(
              (hn, Sn, Wn, er, Hr) => {
                Cn(rn, "aria-label", hn), W(hr, Sn), W(ht, `${a(pe) ?? ""}%`), W(sn, Wn), W(Hn, er), W(Fn, Hr), W(Pr, a(te));
              },
              [
                () => n()("postHistory.importProgress"),
                () => n()("postHistory.importProgress"),
                () => n()("postHistory.importElapsedTime"),
                () => fe(a(m)),
                () => n()("postHistory.importEstimatedRemainingTime")
              ]
            ), D(Nt, rn);
          };
          be(Le, (Nt) => {
            (a(y) || a(x)) && Nt(Yt);
          });
        }
        var cr = F(Le, 2);
        {
          var ur = (Nt) => {
            var rn = Np(), an = T(rn), Pn = T(an), un = T(Pn, !0);
            k(Pn);
            var On = F(Pn, 2), zn = T(On), hr = T(zn), zt = T(hr, !0);
            k(hr);
            var ht = F(hr), _r = T(ht, !0);
            k(ht), k(zn);
            var ot = F(zn, 2), sn = T(ot), Qn = T(sn, !0);
            k(sn);
            var Hn = F(sn), fr = T(Hn, !0);
            k(Hn), k(ot);
            var $n = F(ot, 2), Fn = T($n), xn = T(Fn, !0);
            k(Fn);
            var Pr = F(Fn), ua = T(Pr, !0);
            k(Pr), k($n);
            var hn = F($n, 2), Sn = T(hn), Wn = T(Sn, !0);
            k(Sn);
            var er = F(Sn), Hr = T(er, !0);
            k(er), k(hn);
            var ha = F(hn, 2), $r = T(ha), aa = T($r, !0);
            k($r);
            var vr = F($r), fa = T(vr, !0);
            k(vr), k(ha);
            var Ia = F(ha, 2), Er = T(Ia), Ra = T(Er, !0);
            k(Er);
            var va = F(Er), xr = T(va, !0);
            k(va), k(Ia);
            var Nr = F(Ia, 2), kr = T(Nr), Dr = T(kr, !0);
            k(kr);
            var _a = F(kr), sa = T(_a, !0);
            k(_a), k(Nr), k(On), k(an);
            var Br = F(an, 2), on = T(Br), ss = T(on, !0);
            k(on);
            var pa = F(on, 2), ga = T(pa), qr = T(ga), ya = T(qr, !0);
            k(qr);
            var Jn = F(qr), Ea = T(Jn, !0);
            k(Jn), k(ga);
            var pr = F(ga, 2), ka = T(pr), os = T(ka, !0);
            k(ka);
            var Gn = F(ka), is = T(Gn, !0);
            k(Gn), k(pr);
            var Sr = F(pr, 2), Ir = T(Sr), Ur = T(Ir, !0);
            k(Ir);
            var Rt = F(Ir), d = T(Rt, !0);
            k(Rt), k(Sr);
            var v = F(Sr, 2), H = T(v), j = T(H, !0);
            k(H);
            var B = F(H), G = T(B, !0);
            k(B), k(v);
            var ie = F(v, 2), _e = T(ie), xe = T(_e, !0);
            k(_e);
            var He = F(_e), Te = T(He, !0);
            k(He), k(ie);
            var $e = F(ie, 2), Oe = T($e), dt = T(Oe, !0);
            k(Oe);
            var ft = F(Oe), Bt = T(ft, !0);
            k(ft), k($e), k(pa), k(Br);
            var ln = F(Br, 2), _t = T(ln), Nn = T(_t, !0);
            k(_t);
            var Vr = F(_t, 2), jr = T(Vr), Ar = T(jr), ct = T(Ar, !0);
            k(Ar);
            var tr = F(Ar), ma = T(tr, !0);
            k(tr), k(jr);
            var Rr = F(jr, 2), oa = T(Rr), _s = T(oa, !0);
            k(oa);
            var ls = F(oa), Us = T(ls, !0);
            k(ls), k(Rr);
            var ds = F(Rr, 2), cs = T(ds), Vs = T(cs, !0);
            k(cs);
            var Es = F(cs), Ba = T(Es, !0);
            k(Es), k(ds);
            var us = F(ds, 2), hs = T(us), js = T(hs, !0);
            k(hs);
            var ks = F(hs), Ks = T(ks, !0);
            k(ks), k(us);
            var qa = F(us, 2), Gr = T(qa), p = T(Gr, !0);
            k(Gr);
            var P = F(Gr), A = T(P, !0);
            k(P), k(qa);
            var U = F(qa, 2), K = T(U), he = T(K, !0);
            k(K);
            var ve = F(K), h = T(ve, !0);
            k(ve), k(U);
            var L = F(U, 2), oe = T(L), ye = T(oe, !0);
            k(oe);
            var je = F(oe), gt = T(je, !0);
            k(je), k(L), k(Vr), k(ln), k(rn), ge(
              (Ge, it, In, nr, Kr, gr, Zr, Yr, Ua, fs, bo, Tr, vs, Va, ja, ps, Zt, Ka, Ya, Xr, gs, ys, Ds) => {
                W(un, Ge), W(zt, it), W(_r, a(x).nonEmptyLineCount), W(Qn, In), W(fr, a(x).fileDuplicateCount), W(xn, nr), W(ua, a(x).otherAccountCount), W(Wn, Kr), W(Hr, a(x).unsupportedKindCount), W(aa, gr), W(fa, a(x).invalidJsonCount), W(Ra, Zr), W(xr, a(x).invalidStructureCount), W(Dr, Yr), W(sa, a(x).invalidIdOrSignatureCount), W(ss, Ua), W(ya, fs), W(Ea, a(x).uniquePostEventCount), W(os, bo), W(is, a(x).insertedPostCount), W(Ur, Tr), W(d, a(x).updatedPostCount), W(j, vs), W(G, a(x).unchangedPostCount), W(xe, Va), W(Te, a(x).failedPostEventCount), W(dt, ja), W(Bt, a(x).appliedDeletionPostCount), W(Nn, ps), W(ct, Zt), W(ma, a(x).uniqueDeletionEventCount), W(_s, Ka), W(Us, a(x).validDeletionETagCount), W(Vs, Ya), W(Ba, a(x).insertedDeletionRequestCount), W(js, Xr), W(Ks, a(x).updatedDeletionRequestCount), W(p, gs), W(A, a(x).unchangedDeletionRequestCount), W(he, ys), W(h, a(x).unsupportedDeletionEventCount), W(ye, Ds), W(gt, a(x).failedDeletionEventCount);
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
            ), D(Nt, rn);
          };
          be(cr, (Nt) => {
            a(x) && Nt(ur);
          });
        }
        ge(
          (Nt, rn, an, Pn) => {
            W(rt, Nt), W(et, rn), Cn(Qe, "aria-label", an), Je = Ha(tt, 1, "import-drop-zone svelte-1qfqhib", null, Je, { "import-drop-zone-active": a(o) > 0 }), W(Mt, Pn);
          },
          [
            () => n()("postHistory.importTitle"),
            () => n()("postHistory.importDescription"),
            () => n()("postHistory.importChooseFile"),
            () => a(o) > 0 ? n()("postHistory.importDropActive") : n()("postHistory.importDropHint")
          ]
        ), Eo("change", Qe, Fe), so("dragenter", tt, Q), so("dragover", tt, ne), so("dragleave", tt, ce), so("drop", tt, se), D(re, mt);
      },
      $$slots: { footer: !0, default: !0 }
    });
  }
  var ut = St(Xe);
  return i(), ut;
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
var Up = V('<span class="post-preview-replies-badge svelte-11vk23d" aria-hidden="true"> </span>'), Vp = V("<!> <!>", 1);
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
function zl(t, e) {
  xt(e, !0), Sa(t, jp);
  let n = E(e, "count", 7), r = E(e, "selected", 7), i = E(e, "ariaLabel", 7), s = E(e, "onClick", 7), l = E(e, "tooltipContent", 23, i);
  const c = $c().overlayTarget;
  var u = {
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
  }, b = ke(), g = Z(b);
  return Ae(g, () => ch, (y, x) => {
    x(y, {
      children: (f, _) => {
        var C = ke(), m = Z(C);
        Ae(m, () => ih, (o, M) => {
          M(o, {
            delayDuration: 500,
            children: (z, $) => {
              var ee = Vp(), me = Z(ee);
              {
                const X = (pe, Ie) => {
                  let te = () => Ie?.().props;
                  const fe = S(() => {
                    const { onclick: ae, ...De } = te();
                    return { tooltipOnclick: ae, restProps: De };
                  });
                  lr(pe, Hs(
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
                      onClick: (ae) => {
                        s()(), typeof a(fe).tooltipOnclick == "function" && a(fe).tooltipOnclick(ae);
                      }
                    },
                    () => a(fe).restProps,
                    {
                      children: (ae, De) => {
                        var Me = Up(), Pe = T(Me, !0);
                        k(Me), ge(() => W(Pe, n())), D(ae, Me);
                      },
                      $$slots: { default: !0 }
                    }
                  ));
                };
                Ae(me, () => lh, (pe, Ie) => {
                  Ie(pe, { child: X, $$slots: { child: !0 } });
                });
              }
              var O = F(me, 2);
              Ae(O, () => Io, (X, pe) => {
                pe(X, {
                  get to() {
                    return c;
                  },
                  children: (Ie, te) => {
                    var fe = ke(), ae = Z(fe);
                    Ae(ae, () => dh, (De, Me) => {
                      Me(De, {
                        sideOffset: 8,
                        class: "tooltip-content post-preview-tooltip-content",
                        children: (Pe, de) => {
                          ws();
                          var J = $a();
                          ge(() => W(J, l())), D(Pe, J);
                        },
                        $$slots: { default: !0 }
                      });
                    }), D(Ie, fe);
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
  }), D(t, b), St(u);
}
It(
  zl,
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
var Kp = V('<span class="post-history-thread-toggle-spinner post-history-thread-action-spinner svelte-cenxtw" aria-hidden="true"></span>'), Yp = V('<span class="post-history-thread-toggle-icon-wrapper svelte-cenxtw" aria-hidden="true"><span></span></span>');
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
function Ql(t, e) {
  xt(e, !0), Sa(t, zp);
  let n = E(e, "expanded", 7), r = E(e, "ariaLabel", 7), i = E(e, "title", 23, r), s = E(e, "loading", 7, !1), l = E(e, "onClick", 7), c = S(() => [s() ? "is-loading" : ""].filter(Boolean).join(" "));
  var u = {
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
    let b = S(() => `post-history-thread-toggle-button ${a(c)}`.trim());
    lr(t, {
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
        var x = ke(), f = Z(x);
        {
          var _ = (m) => {
            var o = Kp();
            D(m, o);
          }, C = (m) => {
            var o = Yp(), M = T(o);
            k(o), ge(() => Ha(
              M,
              1,
              `post-history-thread-toggle-icon ${n() ? "post-history-thread-toggle-icon-collapse" : "post-history-thread-toggle-icon-arrow-top-right"} svg-icon`,
              "svelte-cenxtw"
            )), D(m, o);
          };
          be(f, (m) => {
            s() ? m(_) : m(C, -1);
          });
        }
        D(g, x);
      },
      $$slots: { default: !0 }
    });
  }
  return St(u);
}
It(
  Ql,
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
var Qp = V("<span> </span>");
const Wp = {
  hash: "svelte-1uufmpv",
  code: ".post-history-status-pill.svelte-1uufmpv {display:inline-flex;align-items:center;justify-content:center;min-height:18px;padding:0 8px;border:1px solid color-mix(in srgb, currentColor 18%, transparent);border-radius:999px;background:color-mix(in srgb, currentColor 8%, transparent);font-size:0.72rem;line-height:1;white-space:nowrap;}.post-history-status-pill-muted.svelte-1uufmpv {color:var(--text-muted, currentColor);}.post-history-status-pill-danger.svelte-1uufmpv {color:var(--destructive-fg, currentColor);}"
};
function Ou(t, e) {
  xt(e, !0), Sa(t, Wp);
  let n = E(e, "label", 7), r = E(e, "tone", 7), i = E(e, "className", 7, "");
  var s = {
    get label() {
      return n();
    },
    set label(u) {
      n(u), R();
    },
    get tone() {
      return r();
    },
    set tone(u) {
      r(u), R();
    },
    get className() {
      return i();
    },
    set className(u = "") {
      i(u), R();
    }
  }, l = Qp(), c = T(l, !0);
  return k(l), ge(
    (u) => {
      Ha(l, 1, u, "svelte-1uufmpv"), Cn(l, "aria-label", n()), Cn(l, "title", n()), W(c, n());
    },
    [
      () => uh(`post-history-status-pill post-history-status-pill-${r()} ${i()}`.trim())
    ]
  ), D(t, l), St(s);
}
It(Ou, { label: {}, tone: {}, className: {} }, [], [], { mode: "open" });
function Fu(t, e) {
  xt(e, !0);
  const n = () => es(Is, "$_", r), [r, i] = Ss();
  let s = E(e, "eventId", 7), l = S(() => {
    if (s())
      return hh[s()];
  });
  function c(_) {
    return _ === "pending" || _ === "processing" ? n()("postHistory.deleteSending") : _ === "failed" ? n()("postHistory.deleteFailed") : null;
  }
  let u = S(() => c(a(l)));
  var b = {
    get eventId() {
      return s();
    },
    set eventId(_) {
      s(_), R();
    }
  }, g = ke(), y = Z(g);
  {
    var x = (_) => {
      {
        let C = S(() => a(l) === "failed" ? "danger" : "muted"), m = S(() => `post-history-deletion-lifecycle-status ${a(l) ?? ""}`.trim());
        Ou(_, {
          get label() {
            return a(u);
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
    be(y, (_) => {
      a(u) && _(x);
    });
  }
  D(t, g);
  var f = St(b);
  return i(), f;
}
It(Fu, { eventId: {} }, [], [], { mode: "open" });
function Lu(t, e) {
  xt(e, !0);
  let n = E(e, "node", 7), r = E(e, "model", 7, void 0), i = E(e, "emojiLoadStateByUrl", 23, () => ({})), s = E(e, "emojiImageMetaByUrl", 23, () => ({})), l = E(e, "scrollRoot", 7, null), c = E(e, "onImageOpen", 7, void 0), u = E(e, "topActions", 7, void 0), b = E(e, "footerLeftExtras", 7, void 0), g = E(e, "footerActions", 7, void 0), y = E(e, "footerMenu", 7, void 0);
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
      return c();
    },
    set onImageOpen(f = void 0) {
      c(f), R();
    },
    get topActions() {
      return u();
    },
    set topActions(f = void 0) {
      u(f), R();
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
  return Yl(t, {
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
function Ad() {
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
function Yi(t) {
  return Ic(t.rawEvent, t) ? tl(t.rawEvent) : {
    id: t.eventId,
    pubkey: t.pubkeyHex,
    kind: t.kind,
    content: t.content,
    tags: t.tags.map((e) => [...e]),
    created_at: t.createdAt,
    sig: ""
  };
}
function Do(t) {
  const e = {
    id: t.eventId,
    pubkey: t.authorPubkey,
    kind: t.kind,
    content: t.content,
    tags: t.tags.map((n) => [...n]),
    created_at: t.createdAt,
    sig: ""
  };
  return Qo(t.rawEvent) && t.rawEvent.id === e.id && t.rawEvent.pubkey === e.pubkey && t.rawEvent.kind === e.kind && t.rawEvent.content === e.content && t.rawEvent.created_at === e.created_at && JSON.stringify(t.rawEvent.tags) === JSON.stringify(e.tags) ? tl(t.rawEvent) : e;
}
function Po(t) {
  const e = Oa(t.event);
  return {
    eventId: t.event.id,
    event: tl(t.event),
    authorPubkey: t.event.pubkey,
    rootEventId: e.rootId,
    parentEventId: e.parentId,
    profile: t.profile ?? null,
    relayUrls: [...t.relayUrls ?? []],
    sources: [...t.sources]
  };
}
function wi(t, e) {
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
var tg = V('<span class="post-history-context-deleted-label svelte-1kez5et"> </span>'), ng = V('<p class="post-history-context-message svelte-1kez5et"> </p>'), rg = V('<p class="post-history-context-message post-history-context-error svelte-1kez5et"> </p> <!>', 1), ag = V('<div class="post-history-thread-node-parent svelte-1kez5et"><!></div>'), sg = V('<div class="post-history-thread-node-top-actions"><!></div>'), og = V('<div class="post-preview-footer-replies-slot"><!></div>'), ig = V('<div class="open-in-new-icon svg-icon" aria-hidden="true"></div> <span> </span>', 1), lg = V("<!> <!>", 1), dg = V('<div aria-hidden="true"></div> <span> </span>', 1), cg = V("<!> <!> <!>", 1), ug = V('<div class="post-history-thread-node-children svelte-1kez5et"></div>'), hg = V('<div class="post-history-thread-node-view svelte-1kez5et"><!> <div class="post-history-thread-node-anchor svelte-1kez5et"><!></div> <!></div>');
const fg = {
  hash: "svelte-1kez5et",
  code: `.post-history-thread-node-view.svelte-1kez5et {display:grid;gap:1px;}.post-history-thread-node-parent.svelte-1kez5et,
    .post-history-thread-node-children.svelte-1kez5et {display:grid;gap:2px;}.post-history-thread-node-parent.svelte-1kez5et {padding-inline-start:0;}.post-history-thread-node-anchor.svelte-1kez5et {display:grid;margin-inline-start:var(--thread-context-indent);}.post-history-thread-node-children.svelte-1kez5et {padding-inline-start:0;}.post-history-context-button {min-height:28px;padding:2px 6px;color:var(--text-muted);background:var(--btn-bg);font-size:0.82rem;}.post-history-context-message.svelte-1kez5et {margin:0;color:var(--text-muted);font-size:0.82rem;}.post-history-context-deleted-label.svelte-1kez5et {width:fit-content;min-height:28px;padding:2px 6px;color:var(--text-muted);background-color:transparent;border:1px solid var(--btn-border);font-size:0.82rem;font-weight:normal;cursor:default;user-select:none;display:flex;align-items:center;}.post-history-context-error.svelte-1kez5et {color:var(--danger);}`
};
function Os(t, e) {
  xt(e, !0), Sa(t, fg);
  const n = () => es(Is, "$_", r), [r, i] = Ss();
  let s = E(e, "state", 7), l = E(e, "previewModelByEventId", 23, () => ({})), c = E(e, "emojiLoadStateByUrl", 23, () => ({})), u = E(e, "emojiImageMetaByUrl", 23, () => ({})), b = E(e, "scrollRoot", 7, null), g = E(e, "onImageOpen", 7, void 0), y = E(e, "onToggleParent", 7, void 0), x = E(e, "onRetryParent", 7, void 0), f = E(e, "onToggleChildren", 7, void 0), _ = E(e, "onRetryChildren", 7, void 0), C = E(e, "onCopyPointerDown", 7, void 0), m = E(e, "onCopyNevent", 7, void 0), o = E(e, "externalClientLabel", 7, void 0), M = E(e, "onOpenExternalClient", 7, void 0), z = E(e, "isCopyFailed", 7, void 0), $ = E(e, "onShowRawJson", 7, void 0), ee = E(e, "onBroadcastPointerDown", 7, void 0), me = E(e, "onBroadcastPost", 7, void 0), O = E(e, "isBroadcastSending", 7, void 0), X = E(e, "canDeleteNodePost", 7, void 0), pe = E(e, "isDeletionSending", 7, void 0), Ie = E(e, "onOpenDeleteConfirm", 7, void 0), te = S(() => Ro(s().node.event.created_at * 1e3)), fe = S(() => `${Hu(s().depthFromAnchor)}rem`), ae = S(() => s().repliesActionState.status === "loaded" && s().repliesActionState.replyCount > 0), De = S(() => z()?.(s().node.eventId) ?? !1), Me = S(() => O()?.(s().node.eventId) ?? !1), Pe = S(() => X()?.(s()) ?? !1), de = S(() => pe()?.(s().node.eventId) ?? !1);
  function J() {
    const re = s().repliesActionState;
    if (re.status === "loading")
      return n()("postHistory.checkingReplies");
    if (re.status === "failed")
      return n()("postHistory.recheckReplies");
    if (re.status === "loaded") {
      const at = re.replyCount;
      return at === 0 ? n()("postHistory.recheckReplies") : re.visible ? n()("postHistory.hideReplies") : n()("postHistory.showRepliesWithCount", { values: { count: at } });
    }
    return n()("postHistory.checkReplies");
  }
  function le() {
    const re = s().repliesActionState;
    if (re.status === "failed" || re.status === "loaded" && re.replyCount === 0) {
      _()?.(s().node.eventId);
      return;
    }
    f()?.(s().node.eventId);
  }
  function Re(re) {
    C()?.(s(), re);
  }
  function we(re) {
    m()?.(s(), re);
  }
  function N() {
    $()?.(s());
  }
  function I(re) {
    ee()?.(s(), re);
  }
  function Q(re) {
    me()?.(s(), re);
  }
  function ne() {
    Ie()?.(s());
  }
  var ce = {
    get state() {
      return s();
    },
    set state(re) {
      s(re), R();
    },
    get previewModelByEventId() {
      return l();
    },
    set previewModelByEventId(re = {}) {
      l(re), R();
    },
    get emojiLoadStateByUrl() {
      return c();
    },
    set emojiLoadStateByUrl(re = {}) {
      c(re), R();
    },
    get emojiImageMetaByUrl() {
      return u();
    },
    set emojiImageMetaByUrl(re = {}) {
      u(re), R();
    },
    get scrollRoot() {
      return b();
    },
    set scrollRoot(re = null) {
      b(re), R();
    },
    get onImageOpen() {
      return g();
    },
    set onImageOpen(re = void 0) {
      g(re), R();
    },
    get onToggleParent() {
      return y();
    },
    set onToggleParent(re = void 0) {
      y(re), R();
    },
    get onRetryParent() {
      return x();
    },
    set onRetryParent(re = void 0) {
      x(re), R();
    },
    get onToggleChildren() {
      return f();
    },
    set onToggleChildren(re = void 0) {
      f(re), R();
    },
    get onRetryChildren() {
      return _();
    },
    set onRetryChildren(re = void 0) {
      _(re), R();
    },
    get onCopyPointerDown() {
      return C();
    },
    set onCopyPointerDown(re = void 0) {
      C(re), R();
    },
    get onCopyNevent() {
      return m();
    },
    set onCopyNevent(re = void 0) {
      m(re), R();
    },
    get externalClientLabel() {
      return o();
    },
    set externalClientLabel(re = void 0) {
      o(re), R();
    },
    get onOpenExternalClient() {
      return M();
    },
    set onOpenExternalClient(re = void 0) {
      M(re), R();
    },
    get isCopyFailed() {
      return z();
    },
    set isCopyFailed(re = void 0) {
      z(re), R();
    },
    get onShowRawJson() {
      return $();
    },
    set onShowRawJson(re = void 0) {
      $(re), R();
    },
    get onBroadcastPointerDown() {
      return ee();
    },
    set onBroadcastPointerDown(re = void 0) {
      ee(re), R();
    },
    get onBroadcastPost() {
      return me();
    },
    set onBroadcastPost(re = void 0) {
      me(re), R();
    },
    get isBroadcastSending() {
      return O();
    },
    set isBroadcastSending(re = void 0) {
      O(re), R();
    },
    get canDeleteNodePost() {
      return X();
    },
    set canDeleteNodePost(re = void 0) {
      X(re), R();
    },
    get isDeletionSending() {
      return pe();
    },
    set isDeletionSending(re = void 0) {
      pe(re), R();
    },
    get onOpenDeleteConfirm() {
      return Ie();
    },
    set onOpenDeleteConfirm(re = void 0) {
      Ie(re), R();
    }
  }, se = hg(), q = T(se);
  {
    var Fe = (re) => {
      var at = ag(), mt = T(at);
      {
        var nt = (et) => {
          Os(et, {
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
              return M();
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
              return me();
            },
            get isBroadcastSending() {
              return O();
            },
            get canDeleteNodePost() {
              return X();
            },
            get isDeletionSending() {
              return pe();
            },
            get onOpenDeleteConfirm() {
              return Ie();
            }
          });
        }, st = (et) => {
          var Qe = tg(), tt = T(Qe, !0);
          k(Qe), ge((Je) => W(tt, Je), [() => n()("postHistory.replyTargetDeleted")]), D(et, Qe);
        }, rt = (et) => {
          var Qe = ng(), tt = T(Qe, !0);
          k(Qe), ge((Je) => W(tt, Je), [() => n()("postHistory.contextNotFound")]), D(et, Qe);
        }, Kt = (et) => {
          var Qe = rg(), tt = Z(Qe), Je = T(tt, !0);
          k(tt);
          var Yn = F(tt, 2);
          lr(Yn, {
            type: "button",
            className: "post-history-context-button post-history-context-retry-button",
            onClick: () => x()?.(s().node.eventId),
            children: (bt, Mt) => {
              ws();
              var Le = $a();
              ge((Yt) => W(Le, Yt), [() => n()("postHistory.contextRetry")]), D(bt, Le);
            },
            $$slots: { default: !0 }
          }), ge((bt) => W(Je, bt), [() => n()("postHistory.contextFetchFailed")]), D(et, Qe);
        };
        be(mt, (et) => {
          s().parentExpansion.visibleParent && s().parentNodeState ? et(nt) : s().parentExpansion.visibleParent && s().parentExpansion.parentDeleted ? et(st, 1) : s().parentExpansion.visibleParent && s().parentExpansion.parentMissing ? et(rt, 2) : s().parentExpansion.visibleParent && s().parentExpansion.parentError && et(Kt, 3);
        });
      }
      k(at), D(re, at);
    };
    be(q, (re) => {
      s().parentTargetId && re(Fe);
    });
  }
  var Xe = F(q, 2), ut = T(Xe);
  Lu(ut, {
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
    topActions: (st) => {
      var rt = ke(), Kt = Z(rt);
      {
        var et = (Qe) => {
          var tt = sg(), Je = T(tt);
          {
            let Yn = S(() => s().parentExpansion.visibleParent ? n()("postHistory.hideReplyTarget") : n()("postHistory.showReplyTarget")), bt = S(() => s().parentExpansion.visibleParent ? n()("postHistory.hideReplyTarget") : n()("postHistory.showReplyTarget")), Mt = S(() => s().parentExpansion.visibleParent && s().parentExpansion.showParentLoadingIndicator);
            Ql(Je, {
              get ariaLabel() {
                return a(Yn);
              },
              get title() {
                return a(bt);
              },
              get expanded() {
                return s().parentExpansion.visibleParent;
              },
              get loading() {
                return a(Mt);
              },
              onClick: () => y()?.(s().node.eventId)
            });
          }
          k(tt), D(Qe, tt);
        };
        be(Kt, (Qe) => {
          s().parentTargetId && !s().parentAlreadyInPath && !(s().parentExpansion.visibleParent && s().parentExpansion.parentDeleted) && Qe(et);
        });
      }
      D(st, rt);
    },
    footerLeftExtras: (st) => {
      Fu(st, {
        get eventId() {
          return s().node.eventId;
        }
      });
    },
    footerActions: (st) => {
      var rt = og(), Kt = T(rt);
      {
        var et = (Qe) => {
          {
            let tt = S(J), Je = S(J);
            zl(Qe, {
              get count() {
                return s().repliesActionState.replyCount;
              },
              get selected() {
                return s().repliesActionState.visible;
              },
              get ariaLabel() {
                return a(tt);
              },
              get tooltipContent() {
                return a(Je);
              },
              onClick: le
            });
          }
        };
        be(Kt, (Qe) => {
          a(ae) && Qe(et);
        });
      }
      k(rt), D(st, rt);
    },
    footerMenu: (st) => {
      const rt = S(() => n()("common.showActions"));
      qi(st, {
        get triggerAriaLabel() {
          return a(rt);
        },
        get tooltipContent() {
          return a(rt);
        },
        enableTooltip: !0,
        get timestamp() {
          return a(te);
        },
        items: (et) => {
          var Qe = cg(), tt = Z(Qe);
          {
            var Je = (Mt) => {
              var Le = lg(), Yt = Z(Le);
              Ae(Yt, () => Kn, (ur, Nt) => {
                Nt(ur, {
                  class: "menu-action-button",
                  onSelect: () => M()?.(s()),
                  children: (rn, an) => {
                    var Pn = ig(), un = F(Z(Pn), 2), On = T(un, !0);
                    k(un), ge(() => W(On, o())), D(rn, Pn);
                  },
                  $$slots: { default: !0 }
                });
              });
              var cr = F(Yt, 2);
              Ae(cr, () => Ma, (ur, Nt) => {
                Nt(ur, { class: "post-history-menu-separator" });
              }), D(Mt, Le);
            };
            be(tt, (Mt) => {
              o() && M() && Mt(Je);
            });
          }
          var Yn = F(tt, 2);
          {
            let Mt = S(() => s().repliesActionState.status === "loading");
            Ae(Yn, () => Kn, (Le, Yt) => {
              Yt(Le, {
                class: "menu-action-button",
                get disabled() {
                  return a(Mt);
                },
                onSelect: le,
                children: (cr, ur) => {
                  var Nt = dg(), rn = Z(Nt), an = F(rn, 2), Pn = T(an, !0);
                  k(an), ge(
                    (un) => {
                      Ha(rn, 1, `${s().repliesActionState.visible ? "collapse-content-icon" : "find_in_page-icon"} svg-icon`, "svelte-1kez5et"), W(Pn, un);
                    },
                    [() => J()]
                  ), D(cr, Nt);
                },
                $$slots: { default: !0 }
              });
            });
          }
          var bt = F(Yn, 2);
          lo(bt, {
            order: "raw-json-first",
            get copyFailed() {
              return a(De);
            },
            showBroadcast: !0,
            get broadcastSending() {
              return a(Me);
            },
            get showDelete() {
              return a(Pe);
            },
            showDeleteSeparator: !0,
            get deletionSending() {
              return a(de);
            },
            onCopyPointerDown: Re,
            onCopyNevent: we,
            onShowRawJson: N,
            onBroadcastPointerDown: I,
            onBroadcastPost: Q,
            onOpenDeleteConfirm: ne
          }), D(et, Qe);
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
  }), k(Xe);
  var ue = F(Xe, 2);
  {
    var Se = (re) => {
      var at = ug();
      da(at, 21, () => s().replyNodeStates, (mt) => mt.node.eventId, (mt, nt) => {
        Os(mt, {
          get state() {
            return a(nt);
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
            return M();
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
            return me();
          },
          get isBroadcastSending() {
            return O();
          },
          get canDeleteNodePost() {
            return X();
          },
          get isDeletionSending() {
            return pe();
          },
          get onOpenDeleteConfirm() {
            return Ie();
          }
        });
      }), k(at), D(re, at);
    };
    be(ue, (re) => {
      s().repliesActionState.visible && s().replyNodeStates.length > 0 && re(Se);
    });
  }
  k(se), ge(() => {
    zo(se, `--thread-context-indent: ${a(fe)}`), Cn(Xe, "data-post-history-thread-anchor-scope-id", s().anchorEventId), Cn(Xe, "data-post-history-thread-anchor-event-id", s().node.eventId);
  }), D(t, se);
  var Ne = St(ce);
  return i(), Ne;
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
var vg = V('<span class="post-history-context-deleted-label post-history-thread-direct-parent-context svelte-nb00ha"> </span>'), pg = V('<p class="post-history-context-message post-history-thread-direct-parent-context svelte-nb00ha"> </p>'), gg = V('<p class="post-history-context-message post-history-context-error post-history-thread-direct-parent-context svelte-nb00ha"> </p> <!>', 1), yg = V('<div class="post-history-thread-parent-panel svelte-nb00ha"><!> <div class="post-history-context-actions svelte-nb00ha"><!></div></div>'), mg = V('<div class="post-history-thread-replies-panel svelte-nb00ha"><div class="post-history-thread-replies-list svelte-nb00ha"></div></div>');
const bg = {
  hash: "svelte-nb00ha",
  code: `.post-history-thread-parent-panel.svelte-nb00ha,
    .post-history-thread-replies-panel.svelte-nb00ha {display:grid;gap:6px;}.post-history-thread-parent-panel.svelte-nb00ha {padding-bottom:4px;}.post-history-thread-replies-list.svelte-nb00ha {display:grid;}.post-history-context-actions.svelte-nb00ha {display:flex;flex-wrap:wrap;gap:6px;}.post-history-thread-direct-parent-context {margin-inline-start:var(--thread-direct-parent-indent);}.post-history-context-button {min-height:28px;padding:2px 6px;color:var(--text-muted);background:transparent;font-size:0.82rem;}

    @media (hover: hover) and (pointer: fine) {.post-history-context-button:hover:not(:disabled) {color:var(--theme);background:color-mix(in srgb, var(--theme) 10%, transparent);}
    }.post-history-context-message.svelte-nb00ha {margin:0;color:var(--text-muted);font-size:0.82rem;}.post-history-context-deleted-label.svelte-nb00ha {width:fit-content;min-height:28px;padding:2px 6px;color:var(--text-muted);background-color:transparent;border:1px solid var(--btn-border);font-size:0.82rem;font-weight:normal;cursor:default;user-select:none;display:flex;align-items:center;}.post-history-context-error.svelte-nb00ha {color:var(--danger);}`
};
function zi(t, e) {
  xt(e, !0), Sa(t, bg);
  const n = () => es(Is, "$_", r), [r, i] = Ss();
  let s = E(e, "state", 7), l = E(e, "section", 7), c = E(e, "previewModelByEventId", 23, () => ({})), u = E(e, "emojiLoadStateByUrl", 23, () => ({})), b = E(e, "emojiImageMetaByUrl", 23, () => ({})), g = E(e, "scrollRoot", 7, null), y = E(e, "onImageOpen", 7, void 0), x = E(e, "onToggleParent", 7, void 0), f = E(e, "onRetryParent", 7, void 0), _ = E(e, "onToggleNodeParent", 7, void 0), C = E(e, "onRetryNodeParent", 7, void 0), m = E(e, "onToggleNodeChildren", 7, void 0), o = E(e, "onRetryNodeChildren", 7, void 0), M = E(e, "onCopyPointerDown", 7, void 0), z = E(e, "onCopyNevent", 7, void 0), $ = E(e, "externalClientLabel", 7, void 0), ee = E(e, "onOpenExternalClient", 7, void 0), me = E(e, "isCopyFailed", 7, void 0), O = E(e, "onShowRawJson", 7, void 0), X = E(e, "onBroadcastPointerDown", 7, void 0), pe = E(e, "onBroadcastPost", 7, void 0), Ie = E(e, "isBroadcastSending", 7, void 0), te = E(e, "canDeleteNodePost", 7, void 0), fe = E(e, "isDeletionSending", 7, void 0), ae = E(e, "onOpenDeleteConfirm", 7, void 0);
  const De = `${Hu(-1)}rem`;
  let Me = S(() => s().parentNode ? {
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
  var Pe = {
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
      return c();
    },
    set previewModelByEventId(N = {}) {
      c(N), R();
    },
    get emojiLoadStateByUrl() {
      return u();
    },
    set emojiLoadStateByUrl(N = {}) {
      u(N), R();
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
      return M();
    },
    set onCopyPointerDown(N = void 0) {
      M(N), R();
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
      return me();
    },
    set isCopyFailed(N = void 0) {
      me(N), R();
    },
    get onShowRawJson() {
      return O();
    },
    set onShowRawJson(N = void 0) {
      O(N), R();
    },
    get onBroadcastPointerDown() {
      return X();
    },
    set onBroadcastPointerDown(N = void 0) {
      X(N), R();
    },
    get onBroadcastPost() {
      return pe();
    },
    set onBroadcastPost(N = void 0) {
      pe(N), R();
    },
    get isBroadcastSending() {
      return Ie();
    },
    set isBroadcastSending(N = void 0) {
      Ie(N), R();
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
      return ae();
    },
    set onOpenDeleteConfirm(N = void 0) {
      ae(N), R();
    }
  }, de = ke(), J = Z(de);
  {
    var le = (N) => {
      var I = yg(), Q = T(I);
      {
        var ne = (Se) => {
          Os(Se, {
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
              return M();
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
              return me();
            },
            get onShowRawJson() {
              return O();
            },
            get onBroadcastPointerDown() {
              return X();
            },
            get onBroadcastPost() {
              return pe();
            },
            get isBroadcastSending() {
              return Ie();
            },
            get canDeleteNodePost() {
              return te();
            },
            get isDeletionSending() {
              return fe();
            },
            get onOpenDeleteConfirm() {
              return ae();
            }
          });
        }, ce = (Se) => {
          Os(Se, {
            get state() {
              return a(Me);
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
              return M();
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
              return me();
            },
            get onShowRawJson() {
              return O();
            },
            get onBroadcastPointerDown() {
              return X();
            },
            get onBroadcastPost() {
              return pe();
            },
            get isBroadcastSending() {
              return Ie();
            },
            get canDeleteNodePost() {
              return te();
            },
            get isDeletionSending() {
              return fe();
            },
            get onOpenDeleteConfirm() {
              return ae();
            }
          });
        }, se = (Se) => {
          var Ne = vg(), re = T(Ne, !0);
          k(Ne), ge((at) => W(re, at), [() => n()("postHistory.replyTargetDeleted")]), D(Se, Ne);
        }, q = (Se) => {
          var Ne = pg(), re = T(Ne, !0);
          k(Ne), ge((at) => W(re, at), [() => n()("postHistory.contextNotFound")]), D(Se, Ne);
        }, Fe = (Se) => {
          var Ne = gg(), re = Z(Ne), at = T(re, !0);
          k(re);
          var mt = F(re, 2);
          lr(mt, {
            type: "button",
            className: "post-history-context-button post-history-context-retry-button",
            onClick: () => f()?.(),
            children: (nt, st) => {
              ws();
              var rt = $a();
              ge((Kt) => W(rt, Kt), [() => n()("postHistory.contextRetry")]), D(nt, rt);
            },
            $$slots: { default: !0 }
          }), ge((nt) => W(at, nt), [() => n()("postHistory.contextFetchFailed")]), D(Se, Ne);
        };
        be(Q, (Se) => {
          s().parentExpansion.visibleParent && s().parentNodeState ? Se(ne) : s().parentExpansion.visibleParent && a(Me) ? Se(ce, 1) : s().parentExpansion.visibleParent && s().parentExpansion.parentDeleted ? Se(se, 2) : s().parentExpansion.visibleParent && s().parentExpansion.parentMissing ? Se(q, 3) : s().parentExpansion.visibleParent && s().parentExpansion.parentError && Se(Fe, 4);
        });
      }
      var Xe = F(Q, 2), ut = T(Xe);
      {
        var ue = (Se) => {
          {
            let Ne = S(() => s().parentExpansion.visibleParent ? n()("postHistory.hideReplyTarget") : n()("postHistory.showReplyTarget")), re = S(() => s().parentExpansion.visibleParent ? n()("postHistory.hideReplyTarget") : n()("postHistory.showReplyTarget")), at = S(() => s().parentExpansion.visibleParent && s().parentExpansion.showParentLoadingIndicator);
            Ql(Se, {
              get ariaLabel() {
                return a(Ne);
              },
              get title() {
                return a(re);
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
        be(ut, (Se) => {
          s().parentExpansion.visibleParent && s().parentExpansion.parentDeleted || Se(ue);
        });
      }
      k(Xe), k(I), ge(() => zo(I, `--thread-direct-parent-indent: ${De}`)), D(N, I);
    }, Re = (N) => {
      var I = mg(), Q = T(I);
      da(Q, 21, () => s().replyNodeStates, (ne) => ne.node.eventId, (ne, ce) => {
        Os(ne, {
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
            return M();
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
            return me();
          },
          get onShowRawJson() {
            return O();
          },
          get onBroadcastPointerDown() {
            return X();
          },
          get onBroadcastPost() {
            return pe();
          },
          get isBroadcastSending() {
            return Ie();
          },
          get canDeleteNodePost() {
            return te();
          },
          get isDeletionSending() {
            return fe();
          },
          get onOpenDeleteConfirm() {
            return ae();
          }
        });
      }), k(Q), k(I), D(N, I);
    };
    be(J, (N) => {
      l() === "parent" && s().parentTargetId ? N(le) : l() === "children" && s().repliesActionState.visible && s().replyNodeStates.length > 0 && N(Re, 1);
    });
  }
  D(t, de);
  var we = St(Pe);
  return i(), we;
}
It(
  zi,
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
  let s = Ce(Xn({})), l = 0, c = [];
  function u() {
    c = [];
  }
  function b() {
    c.forEach((x) => x.release()), u();
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
  return Ve(() => {
    t() || g();
  }), Ve(() => {
    if (t())
      return () => {
        b();
      };
  }), Ve(() => {
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
      const M = wn.sanitizeExternalRelayUrls(x.filter((z) => z.channelEventId === o).flatMap((z) => fh(z)), { limit: vh });
      return ph.resolveInternal({ eventId: o, relayHints: M }, C, r());
    });
    c = m, w(
      s,
      {
        ...ra(() => a(s)),
        ...Object.fromEntries(f.map((o) => [o, { status: "loading", name: null }]))
      },
      !0
    ), Promise.all(m.map((o) => o.cacheReady)).then((o) => {
      !t() || _ !== l || w(
        s,
        {
          ...a(s),
          ...Object.fromEntries(o.map((M) => [
            M.context.eventId,
            gh(M.cache, !!C)
          ]))
        },
        !0
      );
    }).catch((o) => {
      console.error("チャンネル表示のキャッシュ解決に失敗しました:", o);
    }), Promise.all(m.map((o) => o.refresh)).then((o) => {
      !t() || _ !== l || (u(), w(
        s,
        {
          ...a(s),
          ...Object.fromEntries(o.map((M) => [
            M.snapshot.context.eventId,
            {
              status: M.snapshot.context.name ? "resolved" : "failed",
              name: M.snapshot.context.name
            }
          ]))
        },
        !0
      ));
    }).catch((o) => {
      _ === l && u(), console.error("チャンネル表示のバックグラウンド解決に失敗しました:", o);
    });
  }), Ns(() => {
    b();
  }), { getChannelText: y, cancelCurrentChannelResolution: b };
}
function wg() {
  let t = Ce(Xn({})), e = Ce(!1), n = Ce(0), r = Ce(0), i, s = Ce(void 0);
  function l(f) {
    return mh(f, Rc.value);
  }
  function c() {
    i && (clearTimeout(i), i = void 0), w(e, !1), w(s, void 0);
  }
  function u(f, _) {
    w(
      s,
      {
        eventId: f.eventId,
        ...Ao(_.clientX, _.clientY)
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
    return Ao(m ? m.left + m.width / 2 : 0, m ? m.bottom + 8 : 0);
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
    w(t, {}, !0), c();
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
    const r = nl(), i = this.resolveRelayUrls(n.relayHints, n.relayConfig);
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
          l = rl(e, r, {
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
          }), r.emit({ ids: [n.eventId] }), r.over(), c = this.setTimeoutFn(() => {
            this.console.warn("post_history_context_fetch_timeout", n.eventId), f({ event: null, relayUrl: null });
          }, n.timeoutMs ?? Pg);
        } catch (_) {
          this.console.error("post_history_context_fetch_request_error", _), f({ event: null, relayUrl: null });
        }
      }),
      cancel: () => {
        u?.({ event: null, relayUrl: null });
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
      al,
      { limit: Td }
    );
  }
}
const Wl = new xg();
function Sg(t, e) {
  return t.length === e.length && t.every((n, r) => n === e[r]);
}
function Jl({
  getShow: t,
  getRxNostr: e,
  profileCache: n = _c,
  logger: r = console
}) {
  const i = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Set();
  let l = !1;
  const c = (f, _) => {
    if (!(l || f.disposed || i.get(f.pubkey) !== f || !t() || !_ || f.lastProfile === _)) {
      f.lastProfile = _;
      for (const C of s)
        C(f.pubkey, _);
    }
  }, u = (f, _) => {
    if (f.pending || f.disposed || l)
      return;
    const C = f.relayHints;
    f.pending = n.getProfile(f.pubkey, {
      rxNostr: e(),
      additionalRelays: C,
      forceRefresh: _,
      allowBackgroundRefresh: !0
    }).then((m) => {
      c(f, m);
    }).catch((m) => {
      r.error("投稿履歴プロフィールの取得に失敗:", m);
    }).finally(() => {
      i.get(f.pubkey) === f && (f.pending = null, f.refreshQueued && (f.refreshQueued = !1, u(f, !0)));
    });
  }, b = (f, _ = []) => {
    if (!f || l)
      return null;
    const C = wn.sanitizeExternalRelayUrls(_), m = i.get(f);
    if (m) {
      const M = wn.mergeRelayConfigs(
        m.relayHints,
        C
      );
      return Sg(m.relayHints, M) || (m.relayHints = M, m.pending ? m.refreshQueued = !0 : u(m, !0)), m.lastProfile;
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
    return i.set(f, o), o.unsubscribe = n.subscribe(f, (M) => {
      c(o, M);
    }), u(o, !1), null;
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
function oo(t) {
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
    relayHints: oo(t.relayHints ?? []),
    errorCode: null,
    updatedAt: null
  };
}
function Gl({
  getShow: t,
  getRxNostr: e,
  getRelayConfig: n,
  postHistoryRepositoryImpl: r = Ze,
  contextFetchService: i = Wl,
  deletionRequestsRepositoryImpl: s = $s,
  deletionFetchService: l = Wo,
  profileSyncCoordinator: c = void 0
}) {
  const u = c ?? Jl({ getShow: t, getRxNostr: e }), b = !c;
  let g = Ce({}), y = Ce(Xn({})), x = Ce(Xn({}));
  const f = /* @__PURE__ */ new Map(), _ = /* @__PURE__ */ new Map(), C = /* @__PURE__ */ new Map(), m = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map(), M = /* @__PURE__ */ new Map(), z = /* @__PURE__ */ new Map();
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
  function me(I) {
    const Q = _.get(I);
    if (Q)
      for (const ne of Q)
        ee(ne);
  }
  function O(I, Q) {
    const ne = a(g)[I], ce = Q(ne);
    return ne && ne.status === ce.status && ne.event === ce.event && ne.profile === ce.profile && ne.authorPubkey === ce.authorPubkey && ne.errorCode === ce.errorCode && ne.updatedAt === ce.updatedAt && Bi(ne.relayHints, ce.relayHints) ? ne : (w(g, { ...a(g), [I]: ce }), me(I), ce);
  }
  function X(I, Q) {
    return O(I, (ne) => {
      const ce = ne ?? Od({ targetEventId: I });
      return {
        targetEventId: I,
        status: Q.status ?? ce.status,
        event: Q.event !== void 0 ? Q.event : ce.event,
        profile: Q.profile !== void 0 ? Q.profile : ce.profile,
        authorPubkey: Q.authorPubkey !== void 0 ? Q.authorPubkey : ce.authorPubkey,
        relayHints: Q.relayHints ? oo(Q.relayHints) : ce.relayHints,
        errorCode: Q.errorCode !== void 0 ? Q.errorCode : ce.errorCode,
        updatedAt: Q.updatedAt !== void 0 ? Q.updatedAt : ce.updatedAt
      };
    });
  }
  function pe(I) {
    const Q = a(g)[I.targetEventId], ne = oo([...Q?.relayHints ?? [], ...I.relayHints ?? []]), ce = Q?.authorPubkey ?? I.authorHint ?? null, se = !Q || Q.authorPubkey !== ce || !Bi(Q.relayHints, ne);
    return X(I.targetEventId, { authorPubkey: ce, relayHints: ne }), se;
  }
  function Ie(I) {
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
      for (const [ne, ce] of Object.entries(a(g)))
        ce.authorPubkey === I && X(ne, { profile: Q });
  }
  function ae(I, Q) {
    const ne = u.ensureProfile(I, Q);
    fe(I, ne);
  }
  u.subscribe((I, Q) => {
    t() && fe(I, Q);
  });
  async function De(I, Q, ne = {}) {
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
    const ce = e();
    if (!ce)
      return !1;
    const se = (async () => {
      try {
        const q = l.fetchDeletionRequests(ce, {
          targets: [{ event: I, relayUrls: Q }],
          relayHints: Q,
          relayConfig: n()
        });
        M.set(I.id, q);
        const Fe = await q.promise;
        Fe.events.length > 0 && await s.upsertValidDeletionRequests({
          targetEvents: [I],
          deletionEvents: Fe.events,
          fetchedAt: Fe.fetchedAt
        });
        const Xe = await te(I.pubkey, I.id);
        return Xe && X(I.id, {
          status: "deleted",
          event: null,
          authorPubkey: I.pubkey,
          relayHints: Q,
          errorCode: null,
          updatedAt: Date.now()
        }), Xe;
      } catch {
        return !1;
      } finally {
        M.delete(I.id), o.delete(I.id);
      }
    })();
    return o.set(I.id, se), ne.background ? !1 : se;
  }
  function Me(I, Q) {
    return z.get(I) === Q;
  }
  async function Pe(I, Q = {}) {
    Ie(I);
    const ne = a(g)[I.targetEventId], ce = pe(I), se = a(g)[I.targetEventId] ?? Od(I), q = !!Q.background && ne?.status === "resolved";
    if (!Q.force && ne) {
      if (ne.status === "resolved" || ne.status === "deleted")
        return ne.status === "resolved" && ne.authorPubkey && ae(ne.authorPubkey, a(g)[I.targetEventId]?.relayHints ?? ne.relayHints), a(g)[I.targetEventId] ?? ne;
      if (ne.status === "loading" && C.has(I.targetEventId))
        return await C.get(I.targetEventId) ?? a(g)[I.targetEventId] ?? ne;
      if (!ce && (ne.status === "not-found" || ne.status === "error"))
        return a(g)[I.targetEventId] ?? ne;
    }
    if (!Q.force && C.has(I.targetEventId))
      return await C.get(I.targetEventId) ?? a(g)[I.targetEventId] ?? se;
    Q.force && (m.get(I.targetEventId)?.cancel(), m.delete(I.targetEventId), C.delete(I.targetEventId));
    const Fe = ++$;
    z.set(I.targetEventId, Fe);
    const Xe = (async () => {
      try {
        q || X(I.targetEventId, { status: "loading", errorCode: null });
        const ut = await r.getByEventId(I.targetEventId);
        if (!Me(I.targetEventId, Fe))
          return a(g)[I.targetEventId] ?? null;
        if (ut) {
          const nt = oo([
            ...se.relayHints,
            ...ut.relayHints,
            ...ut.acceptedRelays,
            ...ut.fetchedRelays ?? []
          ]);
          if (typeof ut.deletedAt == "number")
            return X(I.targetEventId, {
              status: "deleted",
              event: null,
              authorPubkey: ut.pubkeyHex,
              relayHints: nt,
              errorCode: null,
              updatedAt: Date.now()
            });
          const st = Yi(ut), rt = X(I.targetEventId, {
            status: "resolved",
            event: st,
            authorPubkey: st.pubkey,
            relayHints: nt,
            errorCode: null,
            updatedAt: Date.now()
          });
          return ae(st.pubkey, nt), De(st, nt, { background: !0 }), a(g)[I.targetEventId] ?? rt;
        }
        if (I.authorHint) {
          const nt = await De(Md(I.targetEventId, I.authorHint), se.relayHints);
          if (!Me(I.targetEventId, Fe))
            return a(g)[I.targetEventId] ?? null;
          if (nt)
            return a(g)[I.targetEventId] ?? null;
        }
        const ue = e();
        if (!ue || !t())
          return q ? a(g)[I.targetEventId] ?? se : X(I.targetEventId, {
            status: "error",
            event: null,
            authorPubkey: se.authorPubkey,
            relayHints: se.relayHints,
            errorCode: "nostr_not_ready",
            updatedAt: Date.now()
          });
        const Se = i.fetchEventById(ue, {
          eventId: I.targetEventId,
          relayHints: se.relayHints,
          relayConfig: n()
        });
        m.set(I.targetEventId, Se);
        const Ne = await Se.promise;
        if (m.delete(I.targetEventId), !Me(I.targetEventId, Fe))
          return a(g)[I.targetEventId] ?? null;
        if (!Ne.event) {
          if (I.authorHint) {
            const nt = await De(Md(I.targetEventId, I.authorHint), se.relayHints);
            if (!Me(I.targetEventId, Fe))
              return a(g)[I.targetEventId] ?? null;
            if (nt)
              return a(g)[I.targetEventId] ?? null;
          }
          return q ? a(g)[I.targetEventId] ?? se : X(I.targetEventId, {
            status: "not-found",
            event: null,
            authorPubkey: se.authorPubkey,
            relayHints: se.relayHints,
            errorCode: null,
            updatedAt: Date.now()
          });
        }
        const re = oo([
          ...se.relayHints,
          ...Ne.relayUrl ? [Ne.relayUrl] : []
        ]), at = await De(Ne.event, re);
        if (!Me(I.targetEventId, Fe))
          return a(g)[I.targetEventId] ?? null;
        if (at)
          return a(g)[I.targetEventId] ?? null;
        const mt = X(I.targetEventId, {
          status: "resolved",
          event: Ne.event,
          authorPubkey: Ne.event.pubkey,
          relayHints: re,
          errorCode: null,
          updatedAt: Date.now()
        });
        return ae(Ne.event.pubkey, re), a(g)[I.targetEventId] ?? mt;
      } catch {
        return Me(I.targetEventId, Fe) ? q ? a(g)[I.targetEventId] ?? se : X(I.targetEventId, {
          status: "error",
          event: null,
          authorPubkey: se.authorPubkey,
          relayHints: se.relayHints,
          errorCode: "fetch_failed",
          updatedAt: Date.now()
        }) : a(g)[I.targetEventId] ?? null;
      } finally {
        m.delete(I.targetEventId), C.delete(I.targetEventId);
      }
    })();
    return C.set(I.targetEventId, Xe), await Xe;
  }
  async function de(I, Q = {}) {
    return await Promise.all(I.map((ne) => Pe(ne, Q)));
  }
  async function J(I, Q = {}) {
    return await Pe(I, { ...Q, force: !0 });
  }
  function le(I) {
    return a(g)[I] ?? null;
  }
  function Re(I) {
    return a(y)[I] ?? 0;
  }
  function we(I) {
    const Q = f.get(I);
    if (Q)
      for (const ne of Q) {
        const ce = _.get(ne);
        ce && (ce.delete(I), !(ce.size > 0) && (_.delete(ne), z.delete(ne), m.get(ne)?.cancel(), m.delete(ne), M.get(ne)?.cancel(), M.delete(ne), C.delete(ne), o.delete(ne)));
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
    m.forEach((I) => I.cancel()), M.forEach((I) => I.cancel()), m.clear(), M.clear(), C.clear(), o.clear(), f.clear(), _.clear(), b && u.reset(), z.clear(), w(g, {}), w(y, {}, !0), w(x, {}, !0);
  }
  return {
    ensureTarget: Pe,
    ensureTargets: de,
    retryTarget: J,
    getTargetSnapshot: le,
    getScopeRevision: Re,
    invalidateScope: we,
    reset: N
  };
}
const Rg = /nostr:[^\s<>"']+/gi, _g = /[),.!?:;\]\u3001\u3002\uff01\uff08\uff09\uff0c\uff0e\uff1a\uff1b\u300d\u300f\u3011]+$/u, Eg = /^[\s),.!?:;\]\u3001\u3002\uff01\uff08\uff09\uff0c\uff0e\uff1a\uff1b\u300d\u300f\u3011]+$/u;
function kg(t) {
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
function Ag(t) {
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
    const i = kg(n[2]), s = ld(n[3]) ? n[3] : null, l = e.get(r);
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
    let l = "", c = 0, u = !1;
    for (const b of s.matchAll(Rg)) {
      const g = b.index ?? -1, y = b[0] ?? "";
      if (g < 0 || !y)
        continue;
      const { uri: x, trailingText: f } = Dg(y), _ = Ag(x);
      !_ || !n.has(_) || (u = !0, r = !0, l += s.slice(c, g), l += f, c = g + y.length);
    }
    return u ? (l += s.slice(c), Tg(l)) : s;
  });
  return r ? i.filter((s) => s !== null).join(`
`) : t.content;
}
const Og = 8, Pi = {
  byPostId: {},
  contextsByEventId: {}
};
function Zl(t) {
  return wn.sanitizeExternalRelayUrls(t, {
    limit: Og
  });
}
function Nu(t) {
  return {
    sourceEventId: t.sourceEventId,
    targetEventId: t.targetEventId,
    relationKind: t.relationKind,
    relayHints: Zl(t.relayHints),
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
            relayHints: Zl([
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
}, xi = {
  getRelayHints(t, e) {
    const n = Oa(e.event);
    return Zl([
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
    const e = Oa(t.event);
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
  postHistoryRepositoryImpl: i = Ze,
  contextFetchService: s = Wl,
  deletionRequestsRepositoryImpl: l = $s,
  deletionFetchService: c = Wo,
  profileSyncCoordinator: u = void 0,
  relatedTargetResolver: b = void 0
}) {
  const g = b ?? Gl({
    getShow: t,
    getRxNostr: n,
    getRelayConfig: r,
    postHistoryRepositoryImpl: i,
    contextFetchService: s,
    deletionRequestsRepositoryImpl: l,
    deletionFetchService: c,
    profileSyncCoordinator: u
  }), y = !b, x = `post-history-quote-preview:${++Fg}`;
  let f = Ce(0), _ = Ce(Xn(Pi));
  function C() {
    w(_, Pi, !0), y && g.reset();
  }
  function m(z) {
    return a(f), (a(_).byPostId[z.eventId] ?? []).map(($) => Hg($.eventId, g.getTargetSnapshot($.eventId)));
  }
  function o(z) {
    const $ = a(_).contextsByEventId[z];
    $ && g.retryTarget(bs.toDescriptor($, x));
  }
  async function M(z) {
    const $ = bs.buildIndex(z), ee = Object.values($.contextsByEventId);
    ee.length !== 0 && await g.ensureTargets(ee.map((me) => bs.toDescriptor(me, x)), { force: !0 });
  }
  return Ve(() => {
    t() || w(_, Pi, !0);
  }), Ve(() => {
    t() && w(f, g.getScopeRevision(x), !0);
  }), Ve(() => {
    t() && w(_, bs.buildIndex(e()), !0);
  }), Ve(() => {
    if (!t())
      return;
    n(), r();
    const z = Object.values(a(_).contextsByEventId);
    z.length !== 0 && g.ensureTargets(z.map(($) => bs.toDescriptor($, x)));
  }), Ns(() => {
    g.invalidateScope(x), C();
  }), { getQuotePreviews: m, retryQuotePreview: o, refreshQuotePreviews: M };
}
const Lo = {
  currentPage: 1,
  searchPage: 1,
  searchInput: "",
  searchQuery: ""
}, Ho = /* @__PURE__ */ new Map();
function Xl(t) {
  if (typeof t != "string")
    return null;
  const e = t.trim();
  return e.length > 0 ? e : null;
}
function Fd(t) {
  return typeof t != "number" || !Number.isFinite(t) ? 1 : Math.max(1, Math.trunc(t));
}
function $o(t) {
  return {
    currentPage: t.currentPage,
    searchPage: t.searchPage,
    searchInput: t.searchInput,
    searchQuery: t.searchQuery
  };
}
function Ng(t) {
  const e = Xl(t);
  return $o(
    e ? Ho.get(e) ?? Lo : Lo
  );
}
function Ld(t, e) {
  const n = Xl(t);
  if (!n)
    return $o(
      Lo
    );
  const r = Ho.get(n) ?? Lo, i = {
    currentPage: Fd(e.currentPage ?? r.currentPage),
    searchPage: Fd(e.searchPage ?? r.searchPage),
    searchInput: e.searchInput ?? r.searchInput,
    searchQuery: e.searchQuery ?? r.searchQuery
  };
  return Ho.set(n, i), $o(i);
}
function Hd(t) {
  const e = Xl(t);
  e && Ho.delete(e);
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
function Si(t, e) {
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
  constructor(e = Ze, n = bh) {
    this.postHistoryRepositoryImpl = e, this.channelMetadataRepositoryImpl = n;
  }
  resolvedCacheEntry = null;
  inFlightEntry = null;
  runtimeCacheToken = 0;
  clearCache() {
    this.resolvedCacheEntry = null, this.inFlightEntry = null, this.runtimeCacheToken += 1;
  }
  isResolvedCacheEntryCurrent(e, n, r, i) {
    return e.pubkeyHex === n && e.normalizedQueryKey === r && Si(e.revision, i);
  }
  async buildFilteredPosts(e, n) {
    const r = await this.postHistoryRepositoryImpl.getAll({ pubkeyHex: e }), i = Yg(r), s = /* @__PURE__ */ new Map();
    return i.length > 0 && (await this.channelMetadataRepositoryImpl.getMany(
      i
    )).forEach((c) => {
      s.set(c.channelEventId, c);
    }), r.filter((l) => {
      const c = Kg(
        l,
        l.channelEventId ? s.get(l.channelEventId) ?? null : null
      );
      return n.every((u) => c.includes(u));
    });
  }
  startFilteredPostsBuild(e, n, r, i) {
    const s = Symbol("post-history-local-search"), l = this.runtimeCacheToken, c = {
      identity: s,
      runtimeCacheToken: l,
      pubkeyHex: e,
      normalizedQueryKey: n,
      revision: i,
      promise: Promise.resolve([])
    };
    return c.promise = (async () => {
      let u = i;
      for (let b = 0; b < 2; b += 1) {
        const g = await this.buildFilteredPosts(e, r), y = $d(e), x = Si(
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
    const n = Vg(e.query);
    if (!e.pubkeyHex || n.length === 0)
      return {
        items: [],
        total: 0,
        hasNext: !1
      };
    const r = qg(e.page), i = Ug(e.pageSize), s = e.pubkeyHex, l = jg(n), c = $d(s), u = this.resolvedCacheEntry, b = u && this.isResolvedCacheEntryCurrent(
      u,
      s,
      l,
      c
    ) ? u.filteredPosts : await (() => {
      const x = this.inFlightEntry;
      return (x && x.runtimeCacheToken === this.runtimeCacheToken && x.pubkeyHex === s && x.normalizedQueryKey === l && Si(x.revision, c) ? x : this.startFilteredPostsBuild(
        s,
        l,
        n,
        c
      )).promise;
    })(), g = (r - 1) * i, y = g + i;
    return {
      items: b.slice(g, y),
      total: b.length,
      hasNext: y < b.length
    };
  }
}
const Xs = new zg(), Qg = 500, Wg = 12, Jg = 3600;
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
    this.postHistoryRelayFetchService = e.postHistoryRelayFetchService ?? _o, this.postHistoryRepository = e.postHistoryRepository ?? Ze, this.setTimeoutFn = e.setTimeoutFn ?? setTimeout, this.clearTimeoutFn = e.clearTimeoutFn ?? clearTimeout, this.console = e.console ?? (typeof globalThis.console < "u" ? globalThis.console : { debug: () => {
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
        let u = 0, b = 0, g = 0, y = 0, x = !1, f = !1, _ = !1, C = !1, m = !1, o = 0, M = 0, z = !0;
        const $ = [];
        for (; l.length > 0; ) {
          const pe = l.shift();
          if (r || (y > 0 && await this.waitBetweenFetches((we) => {
            s = we;
          }), r))
            break;
          const Ie = this.postHistoryRelayFetchService.fetchLatest(e, {
            pubkeyHex: n.pubkeyHex,
            relayConfig: n.relayConfig,
            reason: "repair-visible-range",
            kinds: pe.kinds,
            limit: pe.limit || Ec,
            timeoutMs: wh,
            ...typeof pe.since == "number" ? { since: pe.since } : {},
            ...typeof pe.until == "number" ? { until: pe.until } : {}
          });
          i = Ie;
          const te = await Ie.promise;
          i = null, y += 1, M += te.events.length, _ = _ || te.status === "error", C = C || te.status === "timeout";
          const fe = te.events.length === 0 && !te.hasAnyRelayResponse && (te.allRelaysFailed || te.status === "error");
          z = z && fe;
          let ae = 0, De = 0, Me = 0;
          if (te.events.length > 0) {
            const we = await this.postHistoryRepository.upsertFetchedEvents({
              events: te.events,
              fetchedAt: te.fetchedAt
            });
            ae = we.insertedCount, De = we.updatedCount, Me = we.unchangedCount, u += ae, b += De, g += Me, await n.onProgress?.({
              insertedCount: ae,
              updatedCount: De,
              unchangedCount: Me,
              processedRangeCount: $.length + 1,
              attemptedRangeCount: y,
              addedCount: u,
              totalUpdatedCount: b,
              totalUnchangedCount: g
            });
          }
          const Pe = Xg(te, pe.limit);
          f = f || Pe;
          const de = Pe ? ty(pe) : [], J = de.length > 0 && $.length + 1 + l.length + de.length <= Wg, le = Pe ? "limit" : Gg(te, pe.limit);
          if ($.push({
            source: "preferred",
            rangeUnit: pe.rangeUnit,
            ...typeof pe.since == "number" ? { since: pe.since } : {},
            ...typeof pe.until == "number" ? { until: pe.until } : {},
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
            status: le,
            rawCount: te.rawCount,
            uniqueCount: te.uniqueCount,
            duplicateCount: te.duplicateCount,
            insertedCount: ae,
            updatedCount: De,
            unchangedCount: Me
          }), Pe && J ? (o += de.length, l.unshift(...de)) : Pe && (m = !0), (Zg(le) || fe || Pe && !J) && (x = !0), r || te.status === "cancelled") {
            r = !0;
            break;
          }
        }
        const ee = !r && y > 0 && M === 0 && z, me = x || m || ee, X = {
          status: r ? "cancelled" : me ? "partial" : "success",
          addedCount: u,
          updatedCount: b,
          unchangedCount: g,
          processedRangeCount: $.length,
          attemptedRangeCount: y,
          hadFailures: me,
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
const ry = new ny(), ed = [
  "reply",
  "reaction",
  "quote"
];
function Bu(t) {
  const e = t ?? ed;
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
const eo = {
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
function to(t) {
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
    this.deletionFetchService = e.deletionFetchService ?? Wo, this.deletionRequestsRepository = e.deletionRequestsRepository ?? $s, this.childInteractionsRepository = e.childInteractionsRepository ?? sl, this.now = e.now ?? Date.now;
  }
  saveRepairDirectReplies(e, n) {
    let r = !0, i = null;
    const s = () => r && n.isActive?.() !== !1;
    return {
      promise: (async () => {
        const c = sy(n.items);
        if (c.length === 0)
          return eo;
        const u = await this.filterKnownDeletedDirectReplies(c);
        let b = u.deletedEventIds;
        if (!s())
          return to({
            ...eo,
            deletedEventIds: b
          });
        let g = u.visibleItems, y = !1;
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
            return to({
              ...eo,
              deletedEventIds: b,
              deletionConfirmationIncomplete: y || f.status !== "success"
            });
          if (y = f.status !== "success", f.events.length > 0 && await this.deletionRequestsRepository.upsertValidDeletionRequests({
            targetEvents: g.map((C) => C.event),
            deletionEvents: f.events,
            fetchedAt: f.fetchedAt
          }), !s())
            return to({
              ...eo,
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
          return to({
            ...eo,
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
        } : to({
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
    for (const c of e) {
      const u = i.get(c.parentEventId) ?? [];
      u.push({
        event: c.event,
        ...c.relayUrls ? { relayUrls: c.relayUrls } : {}
      }), i.set(c.parentEventId, u);
    }
    const s = [];
    let l = 0;
    for (const [c, u] of i.entries()) {
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
const ly = new iy(), dy = 150, Nd = 30, cy = 10, uy = 2, Ii = 250, hy = 6e3, Bd = 8, fy = 6e4, vy = ed, qd = {
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
function Qi(t, e) {
  const n = [];
  for (let r = 0; r < t.length; r += e)
    n.push(t.slice(r, r + e));
  return n;
}
function gy(t, e) {
  return e.includeDirectReplies ? [1, 42].flatMap(
    (n) => Qi(
      t.filter((r) => r.kind === n),
      Nd
    ).map((r) => ({ posts: r, depth: 0 }))
  ) : Qi(
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
    this.directReplySaveService = e.directReplySaveService ?? ly, this.childInteractionsRepository = e.childInteractionsRepository ?? sl, this.quoteVisibleRangeRepairExecutor = e.quoteVisibleRangeRepairExecutor, this.console = e.console ?? (typeof globalThis.console < "u" ? globalThis.console : { warn: () => {
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
        let c = !1;
        const u = n.quoteVisibleRangeRepairExecutor ?? this.quoteVisibleRangeRepairExecutor;
        return r.includes("quote") && l.status !== "cancelled" && n.isActive?.() !== !1 && u && (await u(e, n), c = !0), {
          ...l,
          relationKinds: r,
          quoteRepairApplied: c
        };
      })(),
      cancel: () => i.cancel()
    };
  }
  repairVisibleRangeChildInteractionsInternal(e, n, r) {
    let i = !0;
    const s = /* @__PURE__ */ new Set(), l = /* @__PURE__ */ new Set(), c = () => i && n.isActive?.() !== !1, u = py(n.ownerPubkeyHex, n.visiblePosts), b = u.map((y) => y.eventId);
    return {
      promise: (async () => {
        if (u.length === 0)
          return {
            ...qd,
            targetParentEventIds: b
          };
        const y = /* @__PURE__ */ new Set(), x = /* @__PURE__ */ new Set();
        let f = 0, _ = 0, C = 0, m = !1, o = !1;
        const M = async (ee) => {
          const me = [];
          let O = 0;
          const X = Math.min(
            uy,
            ee.length
          ), pe = async () => {
            for (; c(); ) {
              const Ie = ee[O++];
              if (!Ie)
                return;
              _ += 1;
              const te = this.fetchCandidates(
                e,
                Ie.posts,
                n.relayConfig,
                r
              );
              s.add(te);
              const fe = await te.promise;
              if (s.delete(te), !c() || fe.status === "cancelled")
                return;
              fe.status !== "success" && (o = !0), fe.saturated && (C += 1, Ie.depth === 0 ? me.push(
                ...Qi(
                  Ie.posts,
                  cy
                ).map((Pe) => ({ posts: Pe, depth: 1 }))
              ) : o = !0);
              const ae = r.includeDirectReplies ? this.toDirectReplyItems(
                Ie.posts,
                fe.items
              ) : [], De = r.includeReactions ? this.toReactionItems(
                Ie.posts,
                fe.items
              ) : [], Me = fe.status === "success" && !fe.saturated;
              if (ae.length === 0 && De.length === 0) {
                Me && Ie.posts.forEach((Pe) => x.add(Pe.eventId));
                continue;
              }
              if (ae.length > 0) {
                const Pe = this.directReplySaveService.saveRepairDirectReplies(e, {
                  items: ae,
                  relayHints: [
                    ...this.collectParentRelayHints(Ie.posts),
                    ...fe.relayUrls
                  ],
                  relayConfig: n.relayConfig,
                  fetchedAt: fe.fetchedAt,
                  isActive: c
                });
                l.add(Pe);
                const de = await Pe.promise;
                if (l.delete(Pe), !c() || de.status === "cancelled")
                  return;
                de.savedParentEventIds.forEach(
                  (J) => y.add(J)
                ), f += de.savedDirectReplyCount, m = m || de.deletionConfirmationIncomplete;
              }
              if (De.length > 0) {
                const Pe = await this.saveReactionInteractions(
                  De,
                  fe.fetchedAt,
                  c
                );
                if (!c())
                  return;
                Pe.savedParentEventIds.forEach(
                  (de) => y.add(de)
                );
              }
              Me && Ie.posts.forEach((Pe) => x.add(Pe.eventId));
            }
          };
          return await Promise.all(Array.from({ length: X }, () => pe())), me;
        }, z = await M(gy(u, r));
        if (c() && z.length > 0 && await M(z), !c())
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
      const s = Ta({
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
      const s = Oa(i.event).parentId, l = s ? r.get(s) : null;
      return !s || !l || !Za({ child: i.event, parent: l }).valid ? [] : [{
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
      const c = i.get(l.parentEventId) ?? [];
      c.push({
        event: l.event,
        relayUrls: l.relayUrls
      }), i.set(l.parentEventId, c);
    }
    const s = [];
    for (const [l, c] of i.entries()) {
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
  fetchCandidates(e, n, r, i) {
    const s = this.resolveRelayUrls(n, r), l = n.map((o) => o.eventId), c = nl(), u = /* @__PURE__ */ new Map();
    let b = 0, g = !1, y, x, f;
    const _ = () => {
      x !== void 0 && (this.clearTimeoutFn(x), x = void 0), y?.unsubscribe?.(), y = void 0;
    }, C = (o) => {
      const M = yy(u);
      return {
        status: o,
        items: M,
        rawCount: b,
        saturated: b >= Ii || M.length >= Ii,
        fetchedAt: this.now(),
        relayUrls: s
      };
    };
    return {
      promise: new Promise((o) => {
        const M = (z) => {
          g || (g = !0, _(), o(C(z)));
        };
        f = M;
        try {
          if (l.length === 0) {
            M("success");
            return;
          }
          y = rl(e, c, {
            on: s.length > 0 ? { relays: s } : { defaultReadRelays: !0 }
          }).subscribe({
            next: ($) => {
              b += 1, this.handleCandidatePacket(u, $);
            },
            complete: () => M("success"),
            error: ($) => {
              this.console.error("post_history_visible_child_interaction_repair_fetch_error", $), M("error");
            }
          });
          const z = Array.from(/* @__PURE__ */ new Set([
            ...i.includeDirectReplies ? n.map(($) => $.kind) : [],
            ...i.includeReactions ? [7] : []
          ])).filter(($) => $ === 1 || $ === 7 || $ === 42);
          c.emit({
            kinds: z,
            "#e": l,
            limit: Ii
          }), c.over(), x = this.setTimeoutFn(() => {
            this.warnCandidateFetchTimeout(), M("timeout");
          }, hy);
        } catch (z) {
          this.console.error("post_history_visible_child_interaction_repair_request_error", z), M("error");
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
    if (!kc(s.event, r)) {
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
      al,
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
  quoteVisibleRangeRepairExecutor: c,
  relationRepairService: u = by,
  triggerDeletionLifecycle: b = ol,
  now: g = Date.now
}) {
  let y = null, x = 0, f = 0, _ = !1;
  const C = /* @__PURE__ */ new Set(), m = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Set();
  function M(de, J) {
    return !_ && de === x && J();
  }
  function z(de, J, le) {
    return !_ && de === f && t() && e() === J && n() === le;
  }
  function $(de) {
    const J = i();
    J.length === 0 || de.length === 0 || Promise.resolve(
      s(J, de)
    ).catch(() => {
    });
  }
  async function ee(de) {
    const J = i();
    J.length === 0 || de.length === 0 || await s(J, de);
  }
  function me(de) {
    de.length !== 0 && Promise.resolve(
      l(de)
    ).catch(() => {
    });
  }
  async function O(de) {
    if (!de.isActive())
      return;
    const J = ay(de.source, {
      relationKinds: de.result.relationKinds,
      savedParentEventIds: de.result.savedParentEventIds,
      checkedParentEventIds: de.result.checkedParentEventIds,
      quoteRepairApplied: de.result.quoteRepairApplied,
      status: de.result.status
    });
    if (J.shouldRefreshQuotePreviews && de.isActive() && me(de.quoteRefreshPosts), !(J.parentEventIds.length === 0 || !de.isActive())) {
      if (de.awaitBadgeRefresh) {
        await ee(J.parentEventIds);
        return;
      }
      $(J.parentEventIds);
    }
  }
  function X(de) {
    return u.repairVisibleRangeRelations(de.rxNostr, {
      ownerPubkeyHex: de.ownerPubkeyHex,
      visiblePosts: de.visiblePosts,
      relationKinds: ed,
      quoteVisibleRangeRepairExecutor: c,
      relayConfig: r(),
      isActive: de.isActive
    });
  }
  function pe(de, J, le, Re) {
    J.length !== 0 && b({
      source: de,
      parentEventIds: J,
      rxNostr: le,
      relayConfig: r(),
      isActive: Re
    }).then((we) => {
      we.status === "cancelled" || we.deletedReactionEventIds.length === 0 && we.deletedReplyEventIds.length === 0 || !Re() || $(we.checkedParentEventIds);
    }).catch(() => {
    });
  }
  async function Ie(de) {
    if (de.visiblePosts.length === 0)
      return {
        status: "success",
        savedDirectReplyCount: 0
      };
    const J = ++x, le = () => M(J, de.isActive);
    pe(
      "listing-current-view",
      de.visiblePosts.map((we) => we.eventId),
      de.rxNostr,
      le
    );
    const Re = X({
      ...de,
      isActive: le
    });
    y = Re;
    try {
      const we = await Re.promise, N = le();
      return y === Re && (y = null), we.status === "cancelled" || !N ? Ud(we, !1) : (await O({
        source: "listing-manual-refetch",
        result: we,
        quoteRefreshPosts: de.visiblePosts,
        isActive: le,
        awaitBadgeRefresh: !0
      }), Ud(we, le()));
    } catch (we) {
      throw y === Re && (y = null), we;
    }
  }
  async function te(de) {
    if (de.visiblePosts.length !== 0)
      try {
        pe(
          "listing-current-view",
          de.visiblePosts.map((Re) => Re.eventId),
          de.rxNostr,
          de.isActive
        );
        const le = await X(de).promise;
        if (le.status === "cancelled" || !de.isActive())
          return;
        await O({
          source: "listing-current-view",
          result: le,
          quoteRefreshPosts: de.visiblePosts,
          isActive: de.isActive,
          awaitBadgeRefresh: !0
        });
      } catch {
      }
  }
  function fe(de) {
    const J = e(), le = n(), Re = f;
    if (!J || de.length === 0)
      return;
    const we = wy(
      J,
      de,
      i()
    );
    if (we.length === 0)
      return;
    const N = we.map((q) => q.eventId);
    if ($(N), !le)
      return;
    const I = () => z(
      Re,
      J,
      le
    );
    pe(
      "listing-older-reveal",
      N,
      le,
      I
    );
    const Q = Py(
      N,
      m,
      o,
      g()
    ), ne = new Set(Q), ce = we.filter(
      (q) => ne.has(q.eventId)
    );
    if (ce.length === 0)
      return;
    ce.forEach((q) => {
      o.add(q.eventId);
    });
    const se = X({
      ownerPubkeyHex: J,
      rxNostr: le,
      visiblePosts: ce,
      isActive: I
    });
    C.add(se), se.promise.then((q) => {
      !I() || q.status === "cancelled" || (O({
        source: "listing-older-reveal",
        result: q,
        quoteRefreshPosts: ce,
        isActive: I,
        awaitBadgeRefresh: !1
      }), q.checkedParentEventIds.length > 0 && q.checkedParentEventIds.forEach((Fe) => {
        m.set(Fe, g());
      }));
    }).catch(() => {
    }).finally(() => {
      Re === f && (C.delete(se), ce.forEach((q) => {
        o.delete(q.eventId);
      }));
    });
  }
  function ae() {
    x += 1, y?.cancel(), y = null;
  }
  function De() {
    f += 1, C.forEach((de) => de.cancel()), C.clear(), m.clear(), o.clear();
  }
  function Me() {
    ae(), De();
  }
  function Pe() {
    _ = !0, Me();
  }
  return {
    repairCurrentView: Ie,
    repairJump: te,
    scheduleOlderRevealRepair: fe,
    cancelCurrentViewRepair: ae,
    resetOlderRevealRepairContext: De,
    resetAllRepairs: Me,
    dispose: Pe
  };
}
const Sy = "postHistoryJumpCacheAnchors:", Ri = 200, _i = 720 * 60 * 60 * 1e3;
function xo(t) {
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
  constructor(e = il, n = Date.now) {
    this.db = e, this.now = n;
  }
  async getForPubkey(e, n = {}) {
    const r = n.ttlMs ?? _i, i = n.maxCount ?? Ri, s = await this.db.meta.get(xo(e));
    return !s || !Ry(s.value) ? [] : Vd(s.value.anchors, this.now(), r, i);
  }
  async addForPubkey(e) {
    const n = e.ttlMs ?? _i, r = e.maxCount ?? Ri, i = Number.isFinite(e.fetchedAt) ? Math.trunc(e.fetchedAt ?? 0) : this.now(), s = Number.isFinite(e.centerCreatedAt) ? Math.trunc(e.centerCreatedAt) : 0, l = Number.isFinite(e.radiusSec) ? Math.max(1, Math.trunc(e.radiusSec ?? 1)) : 1, c = await this.getForPubkey(e.pubkeyHex, {
      ttlMs: n,
      maxCount: r
    }), u = _y(
      c,
      s,
      l
    ), b = [...c];
    if (u >= 0) {
      const y = b[u];
      b[u] = {
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
      key: xo(e.pubkeyHex),
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
    const n = Number.isFinite(e.frontierVisibleUntil) ? Math.trunc(e.frontierVisibleUntil) : 0, r = Number.isFinite(e.toleranceSec) ? Math.max(0, Math.trunc(e.toleranceSec ?? 0)) : 0, i = e.ttlMs ?? _i, s = e.maxCount ?? Ri, l = await this.getForPubkey(e.pubkeyHex, {
      ttlMs: i,
      maxCount: s
    }), c = l.filter((g) => {
      const y = g.centerCreatedAt + g.radiusSec;
      return Math.max(0, n - y) <= r;
    }), u = l.filter((g) => !c.includes(g)), b = c.length > 0 ? Math.min(
      n,
      ...c.map((g) => Math.max(0, g.centerCreatedAt - g.radiusSec))
    ) : n;
    return c.length > 0 && await this.db.meta.put({
      key: xo(e.pubkeyHex),
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
    e && await this.db.meta.delete(xo(e));
  }
}
const no = new Ey(), qu = "postHistoryVisibleRange:";
function Ei(t, e) {
  return `${qu}${t}:${e}`;
}
function ky(t) {
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
class Ay {
  constructor(e = il, n = Date.now) {
    this.db = e, this.now = n;
  }
  async get(e, n) {
    const r = await this.db.meta.get(Ei(e, n));
    return !r || !ky(r.value) ? null : {
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
      key: Ei(e.pubkeyHex, e.kindsKey),
      value: {
        pubkeyHex: e.pubkeyHex,
        kindsKey: e.kindsKey,
        visibleUntil: e.visibleUntil
      },
      updatedAt: n
    }), r;
  }
  async clear(e, n) {
    await this.db.meta.delete(Ei(e, n));
  }
  async clearForPubkey(e) {
    if (!e) return;
    const n = `${qu}${e}:`, r = await this.db.meta.filter((i) => i.key.startsWith(n)).primaryKeys();
    await this.db.meta.bulkDelete(r);
  }
}
const Ts = new Ay();
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
  const u = Math.max(0, s.length - r), b = Math.min(u, Math.max(0, l - i));
  return c(b);
}
function Oy(t, e) {
  const n = new Set(t.map((r) => r.eventId));
  return e.filter((r) => !n.has(r.eventId));
}
const No = {
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
}, ro = Dy([...Ac]), jd = 1440 * 60, Kd = 4320 * 60, Fy = 100, Ly = 720 * 60;
function ki(t, e) {
  if (t.length === 0)
    return !0;
  const n = t[t.length - 1]?.createdAt;
  return Number.isFinite(n) ? (n ?? 0) > e : !0;
}
const Yd = 720 * 60, Hy = 3600, Di = [
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
  totalVisibleAdded: c,
  targetVisibleAdded: u,
  exploredSeconds: b,
  maxExploreSeconds: g
}) {
  return t !== "success" ? { shouldContinue: !1, reason: `status-${t}` } : n ? r && !i ? {
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
const td = /* @__PURE__ */ new Map();
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
function Wr(t) {
  if (typeof t != "string")
    return null;
  const e = t.trim();
  return e.length > 0 ? e : null;
}
function Wi(t) {
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
  const e = Wr(t);
  return Wi(e ? td.get(e) ?? No : No);
}
function Ai(t, e) {
  const n = Wr(t);
  n && td.set(n, Wi(e));
}
function Vy(t) {
  const e = Wr(t);
  e && td.delete(e);
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
  onChildInteractionBadgeRefreshRequested: c = () => {
  },
  onQuoteVisibleRangeRefreshRequested: u = () => {
  },
  quoteVisibleRangeRepairExecutor: b = void 0,
  pageSize: g = Dc,
  searchDebounceMs: y = 250
}) {
  const x = Ng(e()), f = Uy(e()), _ = f.searchQuery === x.searchQuery && x.searchQuery.length > 0, C = f.totalCountKnown ?? f.totalCount > 0, m = f.totalCountFailed ? "failed" : C ? "ready" : "unknown", o = Xn({
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
  let M = 0, z = !1, $ = Ce(!1), ee = Ce(null), me = null, O = 0, X = null, pe = 0, Ie = Ce(!1), te = Ce("idle"), fe = !1, ae = !1, De = null, Me = Ce("idle"), Pe = 0, de = Wr(e()), J = Ce(Xn(de)), le = null, Re = null, we = 0, N = null, I = null, Q = null, ne = null, ce = n(), se = _ ? x.searchQuery : "", q = !_;
  const Fe = Xn({
    windowSeconds: Yd,
    nextUntil: null,
    consecutiveEmptyCount: 0,
    lastRange: null,
    continuationSince: null,
    exhausted: !1
  }), Xe = Math.max(g * 3, g), ut = xy({
    getShow: t,
    getPubkeyHex: e,
    getRxNostr: n,
    getRelayConfig: r,
    getLoadedPosts: () => o.loadedPosts,
    onChildInteractionBadgeRefreshRequested: c,
    onQuoteVisibleRangeRefreshRequested: u,
    quoteVisibleRangeRepairExecutor: b
  }), ue = S(() => o.searchQuery.length > 0), Se = S(() => o.currentViewRefetchStatus === "refetching"), Ne = S(() => a(ue) ? o.searchPosts : o.loadedPosts), re = S(() => a(ue) ? o.searchPage : 1), at = S(() => a(ue) ? o.searchTotalCount : o.totalCount), mt = S(() => a(ue) ? Math.max(1, Math.ceil(o.searchTotalCount / g)) : 1), nt = S(() => !a(Se) && a(ue) && o.searchPage > 1), st = S(() => a(nt)), rt = S(() => !a(Se) && !a(Ie) && a(ue) && o.searchHasNext), Kt = S(() => a(rt)), et = S(() => !1), Qe = S(() => !a(Se) && (a(ue) ? !a(Ie) && o.searchHasNext : o.hasOlderLocal)), tt = S(() => !a(Se) && !a(ue) && o.hasNewerLocal), Je = S(() => !a(ue) && !a(Se) && (o.listingMode === "sparse" || o.hasNewerLocal)), Yn = S(() => a(Ne)[0]?.createdAt ?? null), bt = S(() => a(Ne).length > 0 ? a(Ne)[a(Ne).length - 1]?.createdAt ?? null : null), Mt = S(() => !a(ue) && !a(Se) && o.hasOlderLocal && (o.listingMode === "sparse" || !(typeof a(bt) == "number" && (o.visibleUntil === null ? o.hasJumpCacheAnchors : a(bt) < o.visibleUntil)))), Le = S(() => !a(ue) && !!e() && !!n() && !a(Se) && !Fe.exhausted && o.syncStatus !== "syncing" && o.syncStatus !== "older-syncing"), Yt = S(() => !a(ue) && o.syncStatus === "older-syncing"), cr = S(() => !a(ue) && (o.syncStatus === "syncing" || o.syncStatus === "older-syncing")), ur = S(() => !a(ue) && o.listingMode === "contiguous" && o.loadedPosts.length > 0 && !o.hasOlderLocal && o.syncStatus !== "syncing"), Nt = S(() => !a(ue) && o.listingMode === "contiguous" && typeof o.visibleUntil == "number" && o.loadedPosts.length > 0 && !o.hasOlderLocal && o.hasSavedPostsOutsideVisibleRange), rn = S(() => a(Ne).length), an = S(() => !!e() && !!n() && !a(ue) && o.loadedPosts.length > 0 && !a(Se) && o.syncStatus !== "syncing" && o.syncStatus !== "older-syncing"), Pn = S(() => a(ue) || o.syncStatus === "idle" ? null : o.syncStatus === "syncing" || o.syncStatus === "older-syncing" ? "postHistory.syncing" : o.syncStatus === "synced" ? "postHistory.synced" : o.syncStatus === "no-more" ? null : "postHistory.syncFailed"), un = S(() => !a(ue) && (o.syncStatus === "syncing" || o.syncStatus === "older-syncing")), On = S(() => a(un) || a(Se)), zn = S(() => o.currentViewRefetchStatus === "refetching" ? "postHistory.repairing" : o.currentViewRefetchMessageKey), hr = S(() => o.currentViewRefetchStatus === "refetching" ? null : o.currentViewRefetchMessageValues);
  function zt() {
    we += 1, Re?.cancel(), Re = null;
  }
  function ht() {
    I = null;
  }
  function _r(p, P) {
    return !!p && !!P && p.postedAt === P.postedAt && p.createdAt === P.createdAt && p.eventId === P.eventId;
  }
  function ot(p) {
    return p === we;
  }
  function sn(p, P) {
    return t() && e() === p && P === M;
  }
  function Qn() {
    z = !1, w($, !1), w(ee, null), me = null;
  }
  async function Hn(p, P, A) {
    return await Wa(), P() ? z ? (w(ee, Wr(p), !0), !0) : A() ? (await new Promise((U) => {
      requestAnimationFrame(() => requestAnimationFrame(() => U()));
    }), P() ? (z = !0, w(ee, Wr(p), !0), w($, !0), !0) : !1) : (z = !0, w(ee, Wr(p), !0), w($, !0), !0) : !1;
  }
  function fr() {
    N?.cancel(), N = null, ut.cancelCurrentViewRepair(), o.currentViewRefetchStatus === "refetching" && (o.currentViewRefetchStatus = "idle"), $n();
  }
  function $n() {
    Q !== null && (clearTimeout(Q), Q = null);
  }
  function Fn() {
    ne !== null && (clearTimeout(ne), ne = null);
  }
  function xn() {
    Fe.windowSeconds = Yd, Fe.nextUntil = null, Fe.consecutiveEmptyCount = 0, Fe.lastRange = null, Fe.continuationSince = null, Fe.exhausted = !1;
  }
  function Pr() {
    o.currentViewRefetchMessageKey = null, o.currentViewRefetchMessageValues = null, $n();
  }
  function ua() {
    $n();
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
    Fn(), !(o.syncStatus !== "synced" && o.syncStatus !== "failed") && (ne = setTimeout(
      () => {
        (o.syncStatus === "synced" || o.syncStatus === "failed") && (o.syncStatus = "idle"), ne = null;
      },
      3500
    ));
  }
  function Sn() {
    pe += 1, w(Ie, !1), w(te, "idle"), Xs.clearCache?.(), Qn(), o.searchInput = "", o.searchQuery = "", o.searchPage = 1, o.searchPosts = [], o.searchTotalCount = 0, o.searchHasNext = !1, se = "";
  }
  function Wn() {
    ht(), Ir(), o.loadedPosts = [], Sr({ known: !1, status: "unknown" }), o.currentPage = 1, o.syncStatus = "idle", o.hasMoreRemote = !1, o.nextUntil = null, o.lastDialogOpenRefreshAt = null, o.visibleUntil = null, o.hasJumpCacheAnchors = !1, o.hasOlderLocal = !1, o.hasNewerLocal = !1, o.listingMode = "contiguous", o.sparseSource = null, o.hasSavedPostsOutsideVisibleRange = !1, o.latestOlderBackfillUiResult = null, Sn();
  }
  function er() {
    const p = Wr(e());
    return !!p && p === a(J);
  }
  function Hr(p) {
    w(J, Wr(p), !0);
  }
  function ha() {
    ht(), Ir(), ut.resetOlderRevealRepairContext(), o.loadedPosts = [], o.searchPosts = [], Sr({ count: 0, known: !0, status: "ready" }), o.searchTotalCount = 0, o.searchHasNext = !1, o.currentPage = 1, o.searchPage = 1, o.hasMoreRemote = !1, o.nextUntil = null, o.lastDialogOpenRefreshAt = null, o.visibleUntil = null, o.hasJumpCacheAnchors = !1, o.hasOlderLocal = !1, o.hasNewerLocal = !1, o.listingMode = "contiguous", o.sparseSource = null, o.hasSavedPostsOutsideVisibleRange = !1, o.syncStatus = "idle", xn(), Pr(), Fn(), Sn(), fe = !0;
  }
  function $r() {
    return o.listingMode === "sparse" && (o.sparseSource === "saved" || o.sparseSource === "jump");
  }
  function aa() {
    if (!$r())
      return !1;
    const p = e();
    return Wn(), xn(), Pr(), Fn(), Hd(p), Ai(p, { ...No }), !0;
  }
  function vr() {
    ht(), M += 1, pe += 1, w(Ie, !1), w(te, "idle");
  }
  function fa() {
    const p = aa();
    return zt(), fr(), vr(), Ir(), Xs.clearCache?.(), ut.resetOlderRevealRepairContext(), p;
  }
  function Ia() {
    aa(), zt(), fr(), vr(), Ir(), Xs.clearCache?.(), ut.resetOlderRevealRepairContext(), o.syncStatus = "idle", xn(), Pr(), Fn(), fe = !1, ae = !1, De = null, Pe += 1, w(Me, "idle"), q = !1;
  }
  function Er(p) {
    const P = ii(p);
    o.hasMoreRemote = P, o.nextUntil = P ? p.nextUntil : null;
  }
  function Ra(p) {
    ii(p) && o.nextUntil === null && (o.hasMoreRemote = !0, o.nextUntil = p.nextUntil);
  }
  async function va(p) {
    return typeof a(bt) == "number" && (o.visibleUntil === null ? o.hasJumpCacheAnchors : a(bt) < o.visibleUntil) ? a(bt) : typeof Fe.nextUntil == "number" ? Fe.nextUntil : qy({
      nextUntil: o.nextUntil,
      visibleOldestCreatedAt: a(bt),
      pubkeyHex: p,
      getOldestCreatedAt: (P) => Ze.getOldestCreatedAt(P)
    });
  }
  function xr(p) {
    if (!Number.isFinite(p))
      return null;
    const P = Math.trunc(p) - 1;
    return P < 0 ? null : {
      since: (typeof Fe.continuationSince == "number" && Fe.continuationSince <= P ? Fe.continuationSince : null) ?? Math.max(0, P - Fe.windowSeconds),
      until: P,
      windowSeconds: Fe.windowSeconds
    };
  }
  function Nr(p, P) {
    const A = [];
    return p.hasMore && A.push("hasMore"), p.rawCount >= P && A.push("rawCount"), p.perRelayCounts.some((U) => U.rawCount >= P) && A.push("perRelayRawCount"), A;
  }
  function kr(p) {
    return typeof p.oldestCreatedAt == "number" ? p.oldestCreatedAt : p.events.reduce(
      (P, A) => {
        const U = A.event.created_at;
        return Number.isFinite(U) && (P === null || U < P) ? Math.trunc(U) : P;
      },
      null
    );
  }
  function Dr(p, P) {
    Fe.nextUntil = p, Fe.continuationSince = P, Fe.exhausted = p === null, o.nextUntil = p, o.hasMoreRemote = p !== null;
  }
  function _a(p, P, A) {
    Nr(P, A), kr(P), P.rawCount ?? P.events.length, P.uniqueCount ?? P.events.length, typeof Fe.nextUntil == "number" && xr(Fe.nextUntil);
  }
  function sa() {
    if (o.searchQuery)
      return [];
    const p = o.loadedPosts.map((U) => U.createdAt).filter((U) => Number.isFinite(U)).map((U) => Math.trunc(U));
    if (p.length === 0)
      return [];
    const P = Math.min(...p), A = Math.max(...p);
    return [
      {
        kinds: [...Ac],
        rangeUnit: "custom",
        since: Math.max(0, P - jd),
        until: A + jd,
        limit: Ec
      }
    ];
  }
  async function Br(p) {
    return (await Ts.get(p, ro))?.visibleUntil ?? null;
  }
  async function on(p, P = null) {
    const A = await Br(p);
    return t() && e() === p && (P === null || P === M) && (o.visibleUntil = A), A;
  }
  async function ss(p, P = null) {
    const U = (await no.getForPubkey(p, { maxCount: 1 })).length > 0;
    return t() && e() === p && (P === null || P === M) && (o.hasJumpCacheAnchors = U), U;
  }
  async function pa(p, P) {
    const A = await Br(p), U = P.events.length === 0 ? null : ii(P) ? P.nextUntil : typeof P.oldestCreatedAt == "number" ? P.oldestCreatedAt : null, K = typeof U == "number" ? typeof A == "number" ? Math.min(A, U) : U : A;
    return K !== A && await Ts.save({
      pubkeyHex: p,
      kindsKey: ro,
      visibleUntil: K
    }), o.visibleUntil = K, K;
  }
  async function ga(p, P) {
    const A = await Br(p), U = kr(P), K = typeof U == "number" ? typeof A == "number" ? Math.min(A, U) : U : A;
    return K !== A && await Ts.save({
      pubkeyHex: p,
      kindsKey: ro,
      visibleUntil: K
    }), o.visibleUntil = K, K;
  }
  async function qr(p, P, A) {
    if (typeof P != "number")
      return P;
    const U = A.filter((he) => he.source === "preferred" && he.status === "complete" && typeof he.since == "number" && typeof he.until == "number" && he.until >= P - 1).map((he) => he.since);
    if (U.length === 0)
      return P;
    const K = Math.min(P, ...U);
    return K === P ? P : (await Ts.save({
      pubkeyHex: p,
      kindsKey: ro,
      visibleUntil: K
    }), o.visibleUntil = K, K);
  }
  async function ya(p, P) {
    return typeof P == "number" ? Ze.countVisibleForPubkey(p, P) : Ze.countForPubkey(p);
  }
  async function Jn(p, P) {
    if (typeof P == "number")
      return Ze.countVisibleForPubkey(p, P);
    const A = X;
    return A?.pubkeyHex === p && (await A.promise, o.totalCountKnown) || o.totalCountKnown ? o.totalCount : Ze.countForPubkey(p);
  }
  function Ea(p, P) {
    if (a(ue) || o.listingMode !== "contiguous" || o.sparseSource !== null || e() !== p || o.visibleUntil !== P.visibleUntil)
      return !1;
    const A = v(o.loadedPosts[o.loadedPosts.length - 1]);
    return _r(A, P.oldestCursor);
  }
  async function pr(p, P) {
    const A = I;
    if (!A || A.pubkeyHex !== p)
      return null;
    const U = await on(p, P);
    if (!t() || e() !== p || P !== M || !Ea(p, A))
      return null;
    const [K, he] = await Promise.all([
      Promise.resolve(Ms(p)),
      Jn(p, U)
    ]);
    return !Ea(p, A) || K !== A.revision || he !== A.totalVisibleCount ? null : A;
  }
  async function ka(p, P, A, U, K) {
    if (ht(), A.length === 0 || !t() || e() !== p || P !== M || o.listingMode !== "contiguous" || o.sparseSource !== null)
      return !1;
    const he = await Jn(p, U), ve = await Br(p), h = Ms(p);
    if (h !== K || ve !== U || !t() || e() !== p || P !== M || o.listingMode !== "contiguous" || o.sparseSource !== null || o.loadedPosts[0]?.eventId !== A[0]?.eventId || o.loadedPosts[o.loadedPosts.length - 1]?.eventId !== A[A.length - 1]?.eventId)
      return !1;
    const L = v(A[A.length - 1]);
    return L ? (I = {
      pubkeyHex: p,
      visibleUntil: U,
      revision: h,
      totalVisibleCount: he,
      reachedVisibleCount: A.length,
      oldestCursor: L,
      latestEventId: A[0]?.eventId ?? null
    }, !0) : !1;
  }
  async function os(p, P, A) {
    const U = I;
    if (!U || U.pubkeyHex !== p || a(ue) || o.listingMode !== "contiguous" || o.sparseSource !== null || e() !== p)
      return !1;
    const K = v(o.loadedPosts[o.loadedPosts.length - 1]);
    if (!_r(K, U.oldestCursor))
      return !1;
    const he = await Jn(p, P);
    return !t() || e() !== p || !_r(K, v(o.loadedPosts[o.loadedPosts.length - 1])) ? !1 : (I = {
      ...U,
      visibleUntil: P,
      revision: Ms(p),
      totalVisibleCount: he
    }, !0);
  }
  async function Gn() {
    ht(), await G();
  }
  function is(p, P = o.loadedPosts) {
    if (o.listingMode === "sparse" || o.hasJumpCacheAnchors)
      return !0;
    const A = P.length > 0 ? P[P.length - 1]?.createdAt ?? null : null;
    return typeof A != "number" ? !1 : p === null ? o.hasJumpCacheAnchors : A < p;
  }
  function Sr({ count: p, known: P, status: A }) {
    typeof p == "number" && (o.totalCount = p), o.totalCountKnown = P, o.totalCountStatus = A;
  }
  function Ir() {
    O += 1, X = null, Sr({
      known: o.totalCountKnown,
      status: o.totalCountKnown ? "ready" : "unknown"
    });
  }
  function Ur(p, { force: P = !1 } = {}) {
    if (!t() || e() !== p || !P && X?.pubkeyHex === p)
      return;
    const A = ++O;
    Sr({
      known: o.totalCountKnown,
      status: o.totalCountKnown ? "refreshing" : "loading"
    });
    const U = Ze.countForPubkey(p).then((K) => {
      A !== O || !t() || e() !== p || Sr({ count: K, known: !0, status: "ready" });
    }).catch(() => {
      A !== O || !t() || e() !== p || Sr({ known: o.totalCountKnown, status: "failed" });
    }).finally(() => {
      X?.requestId === A && (X = null);
    });
    X = { requestId: A, pubkeyHex: p, promise: U };
  }
  function Rt({ force: p = !1 } = {}) {
    const P = e();
    !P || !t() || Ur(P, { force: p });
  }
  async function d(p, P, A = null, U = null) {
    const K = typeof P == "number" ? await Ze.hasPostsBeforeCreatedAt(p, P) : !1;
    !t() || e() !== p || A !== null && A !== M || U !== null && !ot(U) || (o.hasSavedPostsOutsideVisibleRange = K);
  }
  function v(p) {
    return p ? {
      eventId: p.eventId,
      postedAt: p.postedAt,
      createdAt: p.createdAt
    } : null;
  }
  function H(p, P) {
    return p.length <= Xe ? p : p.slice(0, Xe);
  }
  function j(p, P, A) {
    return My({
      currentPosts: p,
      olderPosts: P,
      anchorEventId: A,
      maxVisiblePosts: Xe,
      keepAbove: g
    });
  }
  async function B(p, P = o.loadedPosts, A = null, U = {}) {
    if (P.length === 0) {
      t() && e() === p && (A === null || A === M) && (o.hasOlderLocal = !1, o.hasNewerLocal = !1);
      return;
    }
    const K = v(P[0]), he = v(P[P.length - 1]), ve = o.visibleUntil, h = o.sparseSource === "saved" && typeof ve == "number" ? K ? Ze.getSparseChunk({
      pubkeyHex: p,
      visibleUntil: ve,
      cursor: K,
      direction: "newer",
      limit: 1
    }) : Promise.resolve([]) : K ? Ze.getNewerVisibleChunk({ pubkeyHex: p, visibleUntil: ve, cursor: K, limit: 1 }) : Promise.resolve([]), L = U.skipOlderCheck ? Promise.resolve([]) : o.sparseSource === "saved" && typeof ve == "number" ? he ? Ze.getSparseChunk({
      pubkeyHex: p,
      visibleUntil: ve,
      cursor: he,
      direction: "older",
      limit: 1
    }) : Promise.resolve([]) : o.sparseSource === "jump" ? he ? Ze.getOlderVisibleChunk({
      pubkeyHex: p,
      visibleUntil: null,
      cursor: he,
      limit: 1
    }) : Promise.resolve([]) : he ? Ze.getOlderVisibleChunk({ pubkeyHex: p, visibleUntil: ve, cursor: he, limit: 1 }) : Promise.resolve([]), [oe, ye] = await Promise.all([h, L]);
    !t() || e() !== p || A !== null && A !== M || (o.hasNewerLocal = oe.length > 0, U.skipOlderCheck || (o.hasOlderLocal = ye.length > 0));
  }
  async function G({
    forceTotalCount: p = !1,
    skipTotalCountRefresh: P = !1,
    skipOlderAvailabilityCheck: A = !1,
    awaitProgress: U = !1
  } = {}) {
    ht();
    const K = e();
    if (!K) {
      w(J, null), Wn();
      return;
    }
    const he = ++M, ve = await on(K, he), h = Ms(K), L = await Ze.getLatestVisibleChunk({ pubkeyHex: K, limit: g, visibleUntil: ve });
    if (!t() || e() !== K || he !== M || (Hr(K), o.listingMode = "contiguous", o.sparseSource = null, o.loadedPosts = L, !await Hn(K, () => sn(K, he), () => o.loadedPosts.length > 0)))
      return;
    P || Rt({ force: p }), ss(K, he).catch(() => {
    });
    const oe = ka(K, he, L, ve, h);
    let ye = !1;
    U ? ye = await oe.catch(() => (ht(), !1)) : oe.catch(() => {
      ht();
    });
    const je = A && ye;
    A && !je ? o.hasOlderLocal = !1 : je && I && (o.hasOlderLocal = I.totalVisibleCount > I.reachedVisibleCount), d(K, ve, he).catch(() => {
    }), B(K, L, he, { skipOlderCheck: je }).then(() => {
      !t() || e() !== K || he !== M || Rr(K, L);
    }).catch(() => {
    });
  }
  async function ie({ skipTotalCountRefresh: p = !1 } = {}) {
    ht();
    const P = e();
    if (!P || o.loadedPosts.length === 0) {
      await G({ skipTotalCountRefresh: p });
      return;
    }
    const A = o.loadedPosts[0], U = v(A);
    if (!U) {
      await G({ skipTotalCountRefresh: p });
      return;
    }
    const K = ++M, he = await on(P), h = is(he, o.loadedPosts) ? await Ze.getVisibleChunkFromCreatedAt({
      pubkeyHex: P,
      visibleUntil: he,
      createdAt: A.createdAt,
      limit: o.loadedPosts.length,
      query: { contiguous: !1 }
    }) : await (o.loadedPosts.length > 1 ? Ze.getOlderVisibleChunk({
      pubkeyHex: P,
      visibleUntil: he,
      cursor: U,
      limit: o.loadedPosts.length - 1
    }).then((L) => [A, ...L]) : Promise.resolve([A]));
    !t() || K !== M || (o.loadedPosts = h, await Hn(P, () => sn(P, K), () => o.loadedPosts.length > 0) && (p || Rt(), await B(P, h, K)));
  }
  function _e(p, P) {
    return !!p && (!P || p.requestedAt > P.savedAt);
  }
  async function xe(p, P) {
    ht();
    const A = e(), U = o.loadedPosts, K = v(U[0]), he = v(U[U.length - 1]);
    if (!A || !t() || U.length === 0)
      return;
    const ve = ++M, h = await on(A), [L, oe] = await Promise.all([
      K ? Ze.getNewerVisibleChunk({ pubkeyHex: A, visibleUntil: h, cursor: K, limit: 1 }) : Promise.resolve([]),
      he ? Ze.getOlderVisibleChunk({ pubkeyHex: A, visibleUntil: h, cursor: he, limit: 1 }) : Promise.resolve([])
    ]);
    if (!(!t() || ve !== M)) {
      if (_e(P, p)) {
        s(), await G();
        return;
      }
      o.hasNewerLocal = L.length > 0, o.hasOlderLocal = oe.length > 0, await Hn(A, () => sn(A, ve), () => o.loadedPosts.length > 0) && (Rt(), await B(A, o.loadedPosts, ve), sn(A, ve) && Rr(A, o.loadedPosts));
    }
  }
  function He() {
    const p = i();
    return !p || p.mode !== "normal" || p.pubkeyHex !== e() ? null : p;
  }
  function Te(p) {
    return a(ue) || o.loadedPosts.length === 0 || !p ? !1 : o.loadedPosts.some((P) => P.eventId === p.anchor.eventId);
  }
  async function $e(p) {
    ht();
    const P = e();
    if (!P || !t())
      return !1;
    const A = ++M, U = await on(P), K = await Ze.getVisibleChunkAroundEventId({
      pubkeyHex: P,
      visibleUntil: U,
      eventId: p.anchor.eventId,
      limit: Xe,
      keepAbove: g
    });
    return !t() || A !== M ? !1 : K.length === 0 ? (s(), await G(), !1) : (o.loadedPosts = K, !await Hn(P, () => sn(P, A), () => o.loadedPosts.length > 0) || (Rt(), await B(P, K, A), !sn(P, A)) ? !1 : (Rr(P, K), !0));
  }
  async function Oe(p = {}) {
    const P = o.loadedPosts, A = p.metrics;
    A && (A.loadedPostsBeforeLength = P.length, A.loadedPostsAfterLength = P.length, A.olderPostsLength = 0, A.visibleOldestBefore = P.length > 0 ? P[P.length - 1]?.createdAt ?? null : null, A.visibleOldestAfter = P.length > 0 ? P[P.length - 1]?.createdAt ?? null : null, A.didTrimForOlderAppend = !1, A.didDeferOlderPosts = !1, A.maxVisiblePosts = Xe);
    const U = e(), K = v(o.loadedPosts[o.loadedPosts.length - 1]);
    if (!U || !K)
      return await G(), A && (A.loadedPostsAfterLength = o.loadedPosts.length, A.olderPostsLength = o.loadedPosts.length, A.visibleOldestAfter = o.loadedPosts.length > 0 ? o.loadedPosts[o.loadedPosts.length - 1]?.createdAt ?? null : null), o.loadedPosts.length > 0;
    const he = p.useContiguousProgress !== !1 && I !== null, ve = p.preserveContiguousProgressAfterDatabaseChange ? I : null, h = ++M, L = he ? await pr(U, h) : null;
    if (he && !L)
      return await Gn(), A && (A.loadedPostsAfterLength = o.loadedPosts.length, A.visibleOldestAfter = o.loadedPosts.length > 0 ? o.loadedPosts[o.loadedPosts.length - 1]?.createdAt ?? null : null), !1;
    const oe = L?.visibleUntil ?? await on(U, h), ye = L ? Math.max(0, L.totalVisibleCount - L.reachedVisibleCount) : g;
    if (L && ye === 0)
      return o.hasOlderLocal = !1, A && (A.loadedPostsAfterLength = o.loadedPosts.length, A.visibleOldestAfter = o.loadedPosts.length > 0 ? o.loadedPosts[o.loadedPosts.length - 1]?.createdAt ?? null : null), await B(U, o.loadedPosts, h, { skipOlderCheck: !0 }), !1;
    const je = Math.min(g, ye), gt = await Ze.getOlderVisibleChunk({
      pubkeyHex: U,
      visibleUntil: oe,
      cursor: K,
      limit: je
    });
    if (A && (A.olderPostsLength = gt.length), !t() || h !== M)
      return !1;
    const Ge = L ? await pr(U, h) : null;
    if (L && !Ge)
      return await Gn(), !1;
    if (gt.length === 0)
      return L ? await Gn() : o.hasOlderLocal = !1, A && (A.loadedPostsAfterLength = o.loadedPosts.length, A.visibleOldestAfter = o.loadedPosts.length > 0 ? o.loadedPosts[o.loadedPosts.length - 1]?.createdAt ?? null : null), !1;
    const it = j(P, gt, p.anchorEventId), In = p.reason === "normal-older-reveal" ? Oy(P, it.posts) : [];
    o.loadedPosts = it.posts, In.length > 0 && ut.scheduleOlderRevealRepair(In), it.didDeferOlderPosts && (o.hasOlderLocal = !0);
    const nr = In.length;
    Ge ? I = {
      ...Ge,
      reachedVisibleCount: Math.min(Ge.totalVisibleCount, Ge.reachedVisibleCount + nr),
      oldestCursor: v(it.posts[it.posts.length - 1]) ?? Ge.oldestCursor
    } : !he && ve && Ms(U) === ve.revision && (_r(K, ve.oldestCursor) ? I = {
      ...ve,
      reachedVisibleCount: Math.min(ve.totalVisibleCount, ve.reachedVisibleCount + nr),
      oldestCursor: v(it.posts[it.posts.length - 1]) ?? ve.oldestCursor
    } : ht());
    const Kr = !!I && I.reachedVisibleCount >= I.totalVisibleCount;
    return A && (A.loadedPostsAfterLength = it.posts.length, A.visibleOldestAfter = it.posts.length > 0 ? it.posts[it.posts.length - 1]?.createdAt ?? null : null, A.didTrimForOlderAppend = it.didTrimForOlderAppend, A.didDeferOlderPosts = it.didDeferOlderPosts), await B(U, it.posts, h, {
      skipOlderCheck: he && Kr
    }), !0;
  }
  async function dt(p, P, A = {}) {
    ht();
    const U = o.loadedPosts, K = U.length > 0 ? U[U.length - 1]?.createdAt ?? null : null;
    if (typeof K != "number")
      return !1;
    const he = await Ze.getVisibleChunkFromCreatedAt({
      pubkeyHex: p,
      visibleUntil: o.visibleUntil,
      createdAt: Math.max(0, K - 1),
      limit: g,
      query: { contiguous: !1 }
    });
    if (!t() || P !== M)
      return !1;
    if (he.length === 0)
      return o.hasOlderLocal = !1, !1;
    const ve = j(U, he, A.anchorEventId);
    return o.loadedPosts = ve.posts, await B(p, ve.posts, P), ve.didDeferOlderPosts && (o.hasOlderLocal = !0), !0;
  }
  async function ft(p, P, A = {}) {
    ht();
    const U = o.loadedPosts;
    if (typeof o.visibleUntil != "number")
      return !1;
    const K = v(U[U.length - 1]);
    if (!K)
      return !1;
    const he = await Ze.getSparseChunk({
      pubkeyHex: p,
      visibleUntil: o.visibleUntil,
      cursor: K,
      direction: "older",
      limit: g
    });
    if (!t() || P !== M)
      return !1;
    if (he.length === 0)
      return o.hasOlderLocal = !1, !1;
    const ve = j(U, he, A.anchorEventId);
    return o.loadedPosts = ve.posts, await B(p, ve.posts, P), ve.didDeferOlderPosts && (o.hasOlderLocal = !0), !0;
  }
  async function Bt() {
    const p = e(), P = v(o.loadedPosts[0]);
    if (!p || !P)
      return !1;
    const A = ++M, U = I, K = U ? await pr(p, A) : null;
    if (U && !K)
      return await Gn(), !1;
    const he = K?.visibleUntil ?? await on(p, A), ve = await Ze.getNewerVisibleChunk({
      pubkeyHex: p,
      visibleUntil: he,
      cursor: P,
      limit: g
    });
    if (!t() || A !== M)
      return !1;
    if (ve.length === 0)
      return o.hasNewerLocal = !1, !1;
    if (K && !await pr(p, A))
      return await Gn(), !1;
    const h = o.loadedPosts, L = H([...ve, ...h]);
    if (o.loadedPosts = L, K) {
      const oe = Math.max(0, h.length + ve.length - L.length);
      I = {
        ...K,
        reachedVisibleCount: Math.max(0, K.reachedVisibleCount - oe),
        oldestCursor: v(L[L.length - 1]) ?? K.oldestCursor
      };
    }
    return await B(p, L, A), !(!t() || A !== M);
  }
  async function ln(p) {
    ht();
    const P = e();
    if (!P)
      return !1;
    const A = ++M, U = await on(P), K = await Ze.getVisibleChunkFromCreatedAt({ pubkeyHex: P, visibleUntil: U, createdAt: p, limit: g });
    if (!t() || A !== M)
      return !1;
    if (K.length === 0)
      return Rt(), o.loadedPosts = [], o.hasOlderLocal = !1, o.hasNewerLocal = !1, !1;
    if (!ki(K, p))
      return Rt(), o.listingMode = "contiguous", o.sparseSource = null, o.loadedPosts = K, xn(), await B(P, K, A), !0;
    if (p <= 0)
      return Rt(), o.listingMode = "contiguous", o.sparseSource = null, o.loadedPosts = K, xn(), await B(P, K, A), !0;
    const he = await no.hasNearbyAnchorForPubkey({ pubkeyHex: P, targetCreatedAt: p });
    if (!t() || A !== M)
      return !1;
    if (he) {
      const Ge = await Ze.getVisibleChunkFromCreatedAt({
        pubkeyHex: P,
        visibleUntil: U,
        createdAt: p,
        limit: g,
        query: { contiguous: !1 }
      });
      if (!t() || A !== M)
        return !1;
      if (!ki(Ge, p))
        return Rt(), o.listingMode = "sparse", o.sparseSource = "jump", o.loadedPosts = Ge, xn(), await B(P, Ge, A), !0;
    }
    const ve = n();
    if (!ve)
      return Rt(), o.listingMode = "contiguous", o.sparseSource = null, o.loadedPosts = K, xn(), await B(P, K, A), !0;
    zt();
    const h = ++we;
    o.syncStatus = "syncing";
    const L = Math.max(0, p - Kd), oe = p, ye = _o.fetchLatest(ve, {
      pubkeyHex: P,
      relayConfig: r(),
      reason: "repair-visible-range",
      limit: Fy,
      since: L,
      until: oe
    });
    Re = ye;
    const je = await ye.promise;
    if (!ot(h) || Re !== ye)
      return !1;
    if (Re = null, !t() || je.status === "cancelled" || (je.events.length > 0 && (await Ze.upsertFetchedEvents({ events: je.events, fetchedAt: je.fetchedAt }), await no.addForPubkey({
      pubkeyHex: P,
      centerCreatedAt: p,
      radiusSec: Kd,
      fetchedAt: je.fetchedAt
    }), o.hasJumpCacheAnchors = !0), !t() || A !== M))
      return o.syncStatus = "idle", !1;
    const gt = await Ze.getVisibleChunkFromCreatedAt({
      pubkeyHex: P,
      visibleUntil: U,
      createdAt: p,
      limit: g,
      query: { contiguous: !1 }
    });
    return !t() || A !== M ? (o.syncStatus = "idle", !1) : (o.syncStatus = "idle", ki(gt, p) ? !1 : (Rt({ force: je.events.length > 0 }), o.listingMode = "sparse", o.sparseSource = "jump", o.loadedPosts = gt, xn(), await B(P, gt, A), ut.repairJump({
      ownerPubkeyHex: P,
      rxNostr: ve,
      visiblePosts: gt,
      isActive: () => t() && e() === P && n() === ve && A === M
    }).catch(() => {
    }), !0));
  }
  function _t(p, P) {
    const A = [...p], U = new Set(p.map((K) => K.eventId));
    for (const K of P)
      U.has(K.eventId) || (U.add(K.eventId), A.push(K));
    return A;
  }
  function Nn(p, P, A) {
    return t() && p === pe && e() === A && P === o.searchQuery;
  }
  async function Vr(p, P, A) {
    const U = e();
    if (!U || !P)
      return null;
    const K = await Xs.searchLocalPosts({ pubkeyHex: U, query: P, page: p, pageSize: g });
    return Nn(A, P, U) ? K : null;
  }
  async function jr(p, P) {
    const A = e();
    if (!A || !P)
      return o.searchPosts = [], o.searchTotalCount = 0, o.searchHasNext = !1, !1;
    const U = ++pe, K = Math.max(1, Math.trunc(p));
    w(Ie, !0), w(te, "loading");
    try {
      const he = await Vr(K, P, U);
      if (!he)
        return !1;
      const ve = cd(K, he.total, g);
      return ve !== K ? (U === pe && Nn(U, P, A) && w(te, "ready"), !1) : (o.searchTotalCount = he.total, o.searchPosts = K === 1 ? he.items : _t(o.searchPosts, he.items), o.searchPage = ve, o.searchHasNext = he.hasNext, w(te, "ready"), !(!z && !await Hn(A, () => Nn(U, P, A), () => o.searchPosts.length > 0)));
    } catch {
      return U === pe && w(te, "failed"), !1;
    } finally {
      U === pe && w(Ie, !1);
    }
  }
  async function Ar(p, P, A = ++pe) {
    const U = e();
    if (!U || !P)
      return !1;
    const K = Math.max(1, Math.trunc(p));
    w(Ie, !0), w(te, "loading");
    try {
      const he = await Vr(1, P, A);
      if (!he)
        return !1;
      const ve = cd(K, he.total, g);
      let h = he.items, L = he;
      for (let oe = 2; oe <= ve; oe += 1) {
        const ye = await Vr(oe, P, A);
        if (!ye)
          return !1;
        h = _t(h, ye.items), L = ye;
      }
      return o.searchPosts = h, o.searchTotalCount = he.total, o.searchPage = ve, o.searchHasNext = L.hasNext, w(te, "ready"), !(!z && !await Hn(U, () => Nn(A, P, U), () => o.searchPosts.length > 0));
    } catch {
      return A === pe && w(te, "failed"), !1;
    } finally {
      A === pe && w(Ie, !1);
    }
  }
  async function ct() {
    ht();
    const p = e(), P = n();
    if (!p || !P)
      return;
    zt();
    const A = ++we;
    o.syncStatus = "syncing";
    const U = await on(p);
    if (!ot(A) || !t() || e() !== p)
      return;
    const K = _o.fetchLatest(P, {
      pubkeyHex: p,
      relayConfig: r(),
      reason: "bootstrap",
      limit: _h,
      timeoutMs: Rh
    });
    Re = K;
    const he = await K.promise;
    let ve = {
      insertedCount: 0,
      updatedCount: 0
    };
    if (!ot(A) || Re !== K || (Re = null, !t() || he.status === "cancelled"))
      return;
    if (he.events.length > 0) {
      ve = await Ze.upsertFetchedEvents({ events: he.events, fetchedAt: he.fetchedAt });
      const oe = Ty(he.events);
      oe.length > 0 && await l(oe);
    }
    if (!ot(A) || !t())
      return;
    const h = await pa(p, he);
    if (!ot(A) || !t())
      return;
    const L = h !== U;
    Er(he), o.searchQuery ? await Ar(o.searchPage, o.searchQuery) : o.loadedPosts.length === 0 || !o.hasNewerLocal ? await G({
      forceTotalCount: ve.insertedCount + ve.updatedCount > 0
    }) : (Rt({
      force: ve.insertedCount + ve.updatedCount > 0
    }), await B(p)), o.syncStatus = oi(he, ve.insertedCount + ve.updatedCount > 0 || L);
  }
  async function tr() {
    const p = e(), P = n();
    if (!p || !P)
      return;
    zt();
    const A = ++we;
    o.syncStatus = "syncing", o.lastDialogOpenRefreshAt = Date.now();
    const U = await on(p);
    if (!ot(A) || !t() || e() !== p)
      return;
    const K = Tc.runAuthored(P, {
      ownerPubkeyHex: p,
      relayConfig: r(),
      reason: "dialog-open-refresh",
      limit: Dh,
      timeoutMs: kh,
      onSavedSelfPosts: l
    });
    Re = K;
    const he = await K.promise, ve = he.fetchResult, h = he.upsertSummary;
    if (!ot(A) || Re !== K || (Re = null, !t() || ve.status === "cancelled") || !ot(A) || !t())
      return;
    const L = await pa(p, ve);
    if (!ot(A) || !t())
      return;
    const oe = Bg({
      insertedCount: h.insertedCount,
      updatedCount: h.updatedCount,
      previousVisibleUntil: U,
      nextVisibleUntil: L,
      searchQuery: o.searchQuery,
      loadedPostsLength: o.loadedPosts.length,
      hasNewerLocal: o.hasNewerLocal
    });
    if (Ra(ve), o.syncStatus = oi(ve, oe.didMateriallyChange), hn(), oe.applyAction === "reload-search-page")
      await Ar(o.searchPage, o.searchQuery);
    else if (oe.applyAction === "load-latest-visible-posts") {
      const ye = oe.didMateriallyChange && !oe.didVisibleMateriallyChange;
      await G({
        forceTotalCount: oe.didMateriallyChange,
        skipOlderAvailabilityCheck: ye,
        awaitProgress: ye
      });
    } else oe.applyAction === "refresh-count-and-availability" && (oe.didMateriallyChange ? await G({
      forceTotalCount: oe.didMateriallyChange,
      skipOlderAvailabilityCheck: !oe.didVisibleMateriallyChange,
      awaitProgress: !oe.didVisibleMateriallyChange
    }) : (ht(), Rt({ force: oe.didMateriallyChange }), await B(p)));
  }
  function ma() {
    return typeof o.lastDialogOpenRefreshAt != "number" ? !0 : Date.now() - o.lastDialogOpenRefreshAt >= Eh;
  }
  function Rr(p, P) {
    if (!(fe || !t() || e() !== p || !n())) {
      if (fe = !0, P.length === 0) {
        ct();
        return;
      }
      ma() && tr();
    }
  }
  function oa() {
    return !a(ue) || !a(nt) ? !1 : (o.searchPage -= 1, !0);
  }
  function _s() {
    return !a(ue) || !a(st) ? !1 : (o.searchPage = 1, !0);
  }
  async function ls() {
    if (!a(ue) || !a(rt))
      return !1;
    const p = o.searchPage + 1;
    return jr(p, o.searchQuery);
  }
  async function Us() {
    return !a(ue) || !a(Kt) ? !1 : (o.searchPage = a(mt), !0);
  }
  async function ds() {
    if (a(ue))
      return ls();
    if (o.sparseSource === "saved") {
      const p = e();
      return p ? ft(p, ++M, {}) : !1;
    }
    if (o.sparseSource === "jump") {
      const p = e();
      return p ? dt(p, ++M, {}) : !1;
    }
    return Oe({ reason: "normal-older-reveal" });
  }
  async function cs() {
    return a(ue) ? Promise.resolve(oa()) : o.sparseSource === "saved" ? ks() : Bt();
  }
  async function Vs() {
    return a(ue) ? Promise.resolve(_s()) : (await G(), !0);
  }
  async function Es() {
    const p = e();
    if (!p)
      return !1;
    const P = await on(p);
    if (typeof P != "number") return !1;
    const A = ++M, U = await Ze.getSparseChunk({
      pubkeyHex: p,
      visibleUntil: P,
      direction: "latest",
      limit: g
    });
    return !t() || e() !== p || A !== M ? !1 : U.length === 0 ? (o.hasSavedPostsOutsideVisibleRange = !1, !1) : (o.listingMode = "sparse", o.sparseSource = "saved", o.loadedPosts = U, Rt(), await B(p, U, A), await d(p, P, A), !0);
  }
  async function Ba() {
    if (a(ue) || !a(Mt))
      return !1;
    if (o.listingMode === "sparse") {
      ht();
      const K = e();
      if (!K)
        return !1;
      const he = ++M, ve = await Ze.getOldestVisibleChunk({
        pubkeyHex: K,
        visibleUntil: o.visibleUntil,
        limit: g,
        query: { contiguous: !1 }
      });
      return !t() || he !== M || ve.length === 0 ? !1 : (Rt(), o.loadedPosts = ve, xn(), o.hasOlderLocal = !1, await B(K, ve, he, { skipOlderCheck: !0 }), !0);
    }
    ht();
    const p = e();
    if (!p)
      return !1;
    const P = ++M, A = await on(p, P), U = await Ze.getOldestVisibleChunk({ pubkeyHex: p, visibleUntil: A, limit: g });
    return !t() || P !== M ? !1 : U.length === 0 ? (Rt(), o.loadedPosts = [], o.hasOlderLocal = !1, o.hasNewerLocal = !1, !1) : (Rt(), o.listingMode = "contiguous", o.sparseSource = null, o.loadedPosts = U, xn(), o.hasOlderLocal = !1, await B(p, U, P, { skipOlderCheck: !0 }), !0);
  }
  async function us(p = {}) {
    const P = e(), A = n();
    if (!P || !A || !a(Le))
      return !1;
    zt();
    const U = ++we;
    o.syncStatus = "older-syncing";
    const K = $y, he = Ny, ve = Math.max(1, Math.min(g, 30));
    let h = null, L = 0, oe = 0, ye = 0, je = null, gt = null, Ge = !1, it = 0, In = null;
    for (; ; ) {
      L += 1;
      const nr = je ?? await va(P), Kr = typeof je == "number", gr = await on(P);
      if (!ot(U) || !t() || e() !== P)
        return Ge;
      const Zr = typeof nr == "number" ? Kr ? nr : typeof gr == "number" ? Math.min(nr, gr) : nr : gr;
      if (typeof Zr != "number")
        return o.syncStatus = "idle", Ge;
      const Yr = Math.trunc(Zr) - 1;
      if (Yr < 0)
        return Dr(null, null), o.syncStatus = "idle", Ge;
      const Ua = Math.min(ye, Di.length - 1), fs = Di[Ua], Tr = {
        since: (typeof gt == "number" && gt <= Yr ? gt : null) ?? Math.max(0, Yr - fs),
        until: Yr,
        windowSeconds: fs
      }, vs = await ya(P, gr);
      if (!ot(U) || !t() || e() !== P)
        return Ge;
      h === null && (h = vs);
      let Va = !1, ja = {
        insertedCount: 0,
        updatedCount: 0
      };
      const ps = _o.fetchLatest(A, {
        pubkeyHex: P,
        relayConfig: r(),
        reason: "older-backfill",
        limit: si,
        timeoutMs: Ih,
        since: Tr.since,
        until: Tr.until
      });
      Re = ps;
      const Zt = await ps.promise;
      if (!ot(U) || Re !== ps || (Re = null, !t() || Zt.status === "cancelled") || (Zt.events.length > 0 && (ja = await Ze.upsertFetchedEvents({ events: Zt.events, fetchedAt: Zt.fetchedAt }), Va = ja.insertedCount + ja.updatedCount > 0), !ot(U) || !t()))
        return Ge;
      const Ka = typeof a(bt) == "number" && (gr === null ? o.hasJumpCacheAnchors : a(bt) < gr), Ya = Ka ? gr : await ga(P, Zt);
      if (!ot(U) || !t())
        return Ge;
      const Xr = !Ka && typeof Ya == "number" ? await no.reconcileWithFrontier({
        pubkeyHex: P,
        frontierVisibleUntil: Ya,
        toleranceSec: Ly
      }) : null, gs = Xr ? Xr.nextVisibleUntil : Ya;
      Xr && (o.hasJumpCacheAnchors = Xr.anchors.length > 0), Xr && Xr.nextVisibleUntil !== Ya && (await Ts.save({
        pubkeyHex: P,
        kindsKey: ro,
        visibleUntil: Xr.nextVisibleUntil
      }), o.visibleUntil = Xr.nextVisibleUntil);
      const ys = await ya(P, gs);
      if (!ot(U) || !t())
        return Ge;
      let Ds = !1;
      if (Ka || (Ds = await os(P, gs)), await d(P, gs, null, U), !ot(U) || !t())
        return Ge;
      const Ys = ys > vs, qe = Nr(Zt, si).length > 0, ze = kr(Zt), vt = typeof ze == "number" && ze > Tr.since ? ze - Tr.since : 0, fn = Zt.status === "success" && qe && typeof ze == "number" && ze > Tr.since && vt >= Hy;
      let Ot = Tr.since > 0 ? Tr.since : null, rr = null;
      fn && typeof ze == "number" && (Ot = ze, rr = Tr.since), Fe.windowSeconds = fs, Fe.lastRange = { ...Tr, hitLimit: qe }, Zt.status === "success" && Zt.events.length === 0 ? Fe.consecutiveEmptyCount += 1 : Zt.events.length > 0 && (Fe.consecutiveEmptyCount = 0), Dr(Ot, rr), _a(Tr, Zt, si);
      let zr = !1;
      const Rn = {
        loadedPostsBeforeLength: o.loadedPosts.length,
        loadedPostsAfterLength: o.loadedPosts.length,
        olderPostsLength: 0,
        visibleOldestBefore: o.loadedPosts.length > 0 ? o.loadedPosts[o.loadedPosts.length - 1]?.createdAt ?? null : null,
        visibleOldestAfter: o.loadedPosts.length > 0 ? o.loadedPosts[o.loadedPosts.length - 1]?.createdAt ?? null : null,
        didTrimForOlderAppend: !1,
        didDeferOlderPosts: !1,
        maxVisiblePosts: Xe
      };
      o.searchQuery ? await Ar(o.searchPage, o.searchQuery) : (Rt({ force: Va }), Ys || Va ? zr = o.sparseSource === "saved" ? await ft(P, M, { anchorEventId: p.anchorEventId }) : Ka ? await dt(P, M, { anchorEventId: p.anchorEventId }) : await Oe({
        anchorEventId: p.anchorEventId,
        metrics: Rn,
        reason: "normal-older-reveal",
        useContiguousProgress: !1,
        preserveContiguousProgressAfterDatabaseChange: Ds
      }) : await B(P));
      const dn = zr || Ys || Va, ar = Ge || dn, Qt = typeof Ot == "number" && Ot < Zr, Ke = ys, Y = Math.max(0, Ke - (h ?? Ke)), lt = typeof Ot == "number" ? Math.max(0, Zr - Ot) : Math.max(0, Zr), Wt = oe + lt, Dt = By({
        status: Zt.status,
        changed: dn,
        didCursorAdvanceOlder: Qt,
        hitLimit: qe,
        continuedWithinWindow: fn,
        attemptIndex: L,
        maxAttempts: K,
        totalVisibleAdded: Y,
        targetVisibleAdded: ve,
        exploredSeconds: Wt,
        maxExploreSeconds: he
      }), Bn = Dt.shouldContinue, At = Bn ? it + 1 : it;
      if (oe = Wt, Bn) {
        o.latestOlderBackfillUiResult = {
          changed: ar,
          didTrimForOlderAppend: Rn.didTrimForOlderAppend,
          didDeferOlderPosts: Rn.didDeferOlderPosts,
          loadedPostsBeforeLength: Rn.loadedPostsBeforeLength,
          loadedPostsAfterLength: Rn.loadedPostsAfterLength,
          maxVisiblePosts: Rn.maxVisiblePosts,
          autoRetryCount: At,
          autoRetryReason: Dt.reason,
          attemptIndex: L,
          maxAttempts: K,
          clickStartVisibleCount: h ?? Ke,
          currentVisibleCount: Ke,
          totalVisibleAdded: Y,
          targetVisibleAdded: ve,
          shouldContinueForSmallBatch: Bn,
          exploredSeconds: oe,
          maxExploreSeconds: he
        }, it = At, In = Dt.reason, Ge = ar, je = Ot, gt = rr, fn || (ye = Math.min(ye + 1, Di.length - 1));
        continue;
      }
      return In = Dt.reason, Ge = ar, Dt.reason, o.latestOlderBackfillUiResult = {
        changed: Ge,
        didTrimForOlderAppend: Rn.didTrimForOlderAppend,
        didDeferOlderPosts: Rn.didDeferOlderPosts,
        loadedPostsBeforeLength: Rn.loadedPostsBeforeLength,
        loadedPostsAfterLength: Rn.loadedPostsAfterLength,
        maxVisiblePosts: Rn.maxVisiblePosts,
        autoRetryCount: it,
        autoRetryReason: In,
        attemptIndex: L,
        maxAttempts: K,
        clickStartVisibleCount: h ?? Ke,
        currentVisibleCount: Ke,
        totalVisibleAdded: Y,
        targetVisibleAdded: ve,
        shouldContinueForSmallBatch: Bn,
        exploredSeconds: oe,
        maxExploreSeconds: he
      }, Zt.status !== "success" ? (o.syncStatus = "failed", hn(), Ge) : (o.syncStatus = Ge ? oi(Zt, !0) : "idle", hn(), Ge);
    }
  }
  async function hs() {
    ht();
    const p = e(), P = n();
    if (!p || !P || !a(an))
      return;
    const A = sa();
    if (A.length === 0)
      return;
    Pr(), o.currentViewRefetchStatus = "refetching";
    const U = await on(p), K = ry.refetchAroundCurrentView(P, {
      pubkeyHex: p,
      relayConfig: r(),
      preferredRanges: A,
      onProgress: async () => {
      }
    });
    N = K;
    let he = !1;
    try {
      const ve = await K.promise;
      if (N !== K)
        return;
      if (!t() || ve.status === "cancelled") {
        N = null, o.currentViewRefetchStatus = "idle";
        return;
      }
      await qr(p, U, ve.processedRanges), o.searchQuery ? await Ar(o.searchPage, o.searchQuery) : o.loadedPosts.length === 0 || !o.hasNewerLocal ? await G({ skipTotalCountRefresh: !0 }) : await ie({ skipTotalCountRefresh: !0 }), he = !0;
      let h = null;
      if (N === K && t() && e() === p && n() === P && o.loadedPosts.length > 0 && (h = await ut.repairCurrentView({
        ownerPubkeyHex: p,
        rxNostr: P,
        visiblePosts: o.loadedPosts,
        isActive: () => N === K && t() && e() === p && n() === P
      }), N !== K || h.status === "cancelled" || !t()) || N !== K || !t() || e() !== p || n() !== P)
        return;
      o.searchQuery || Rt({ force: !0 }), N = null, o.currentViewRefetchStatus = "idle", ve.addedCount > 0 ? (o.currentViewRefetchMessageKey = "postHistory.repairAdded", o.currentViewRefetchMessageValues = {
        count: ve.addedCount,
        processedRangeCount: ve.processedRangeCount,
        updatedCount: ve.updatedCount
      }) : (h?.savedDirectReplyCount ?? 0) > 0 ? (o.currentViewRefetchMessageKey = "postHistory.repairChildInteractionsAdded", o.currentViewRefetchMessageValues = {
        count: h?.savedDirectReplyCount ?? 0
      }) : ve.fetchFailed ? (o.currentViewRefetchMessageKey = "postHistory.repairFetchFailed", o.currentViewRefetchMessageValues = null) : ve.hadUnfinishedRanges || h?.status === "partial" ? (o.currentViewRefetchMessageKey = "postHistory.repairPartialFailure", o.currentViewRefetchMessageValues = null) : (o.currentViewRefetchMessageKey = "postHistory.repairNoChanges", o.currentViewRefetchMessageValues = {
        processedRangeCount: ve.processedRangeCount,
        updatedCount: ve.updatedCount
      }), ua();
    } catch {
      if (N !== K)
        return;
      he && !o.searchQuery && t() && e() === p && n() === P && Rt({ force: !0 }), N = null, o.currentViewRefetchStatus = "idle", o.currentViewRefetchMessageKey = "postHistory.repairFetchFailed", o.currentViewRefetchMessageValues = null, ua();
    }
  }
  async function js() {
    const p = e();
    return p ? (zt(), fr(), (await Promise.allSettled([
      Ze.deleteLocalHistoryForPubkey(p),
      no.clearForPubkey(p),
      Ts.clearForPubkey(p)
    ])).some((A) => A.status === "rejected") ? (t() && e() === p && (Ir(), Sr({ known: o.totalCountKnown, status: "failed" })), Pr(), o.currentViewRefetchMessageKey = "postHistory.deleteLocalHistoryFailed", o.currentViewRefetchMessageValues = null, !1) : (Hd(p), Vy(p), ha(), o.currentViewRefetchMessageKey = "postHistory.deleteLocalHistorySuccess", o.currentViewRefetchMessageValues = null, Ld(p, {
      currentPage: 1,
      searchPage: 1,
      searchInput: "",
      searchQuery: ""
    }), Ai(p, {
      ...No,
      totalCount: 0,
      totalCountKnown: !0,
      totalCountFailed: !1
    }), !0)) : !1;
  }
  async function ks() {
    ht();
    const p = e(), P = v(o.loadedPosts[0]);
    if (!p || !P || typeof o.visibleUntil != "number")
      return !1;
    const A = ++M, U = await Ze.getSparseChunk({
      pubkeyHex: p,
      visibleUntil: o.visibleUntil,
      cursor: P,
      direction: "newer",
      limit: g
    });
    if (!t() || A !== M)
      return !1;
    if (U.length === 0)
      return o.hasNewerLocal = !1, !1;
    const K = H([...U, ...o.loadedPosts]);
    return o.loadedPosts = K, await B(p, K, A), !0;
  }
  async function Ks() {
    if (ht(), !!e()) {
      if (o.searchQuery) {
        await Ar(o.searchPage, o.searchQuery);
        return;
      }
      if (o.sparseSource === "saved") {
        const p = e();
        if (!p) return;
        const P = await on(p);
        Rt({ force: !0 }), await B(p), await d(p, P);
        return;
      }
      await G({ forceTotalCount: !0 });
    }
  }
  function qa(p, P, A) {
    const U = (K) => K.map((he) => he.eventId === p ? { ...he, deletedAt: P, deletionEventId: A } : he);
    o.loadedPosts = U(o.loadedPosts), o.searchPosts = U(o.searchPosts);
  }
  function Gr(p) {
    const P = e(), A = Wr(P);
    if (!P || !A)
      return;
    const U = ++Pe;
    w(Me, "loading"), p().then(() => {
      t() && e() === P && De === A && U === Pe && w(Me, "ready");
    }).catch(() => {
      t() && e() === P && De === A && U === Pe && w(Me, "failed");
    });
  }
  return Ve(() => {
    const p = Wr(e());
    p !== de && (de = p, Qn(), w(J, null), le = p, zt(), fr(), vr(), Wn(), Pr(), Fn(), xn(), ut.resetOlderRevealRepairContext(), fe = !1, ae = !1, De = null, Pe += 1, w(Me, "idle"));
  }), Ve(() => {
    const p = n();
    p !== ce && (ce = p, ut.resetOlderRevealRepairContext());
  }), Ve(() => {
    er() && Ld(e(), {
      searchInput: o.searchInput,
      searchQuery: o.searchQuery,
      currentPage: o.currentPage,
      searchPage: o.searchPage
    });
  }), Ve(() => {
    er() && Ai(e(), {
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
  }), Ve(() => {
    t() || Ia();
  }), Ve(() => {
    if (t())
      return () => {
        zt();
      };
  }), Ve(() => () => {
    ut.dispose();
  }), Ve(() => {
    if (!t()) {
      Fn();
      return;
    }
    return hn(), () => {
      Fn();
    };
  }), Ve(() => {
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
  }), Ve(() => {
    if (!t() || a(ue))
      return;
    const p = Wr(e()) ?? "";
    if (ae && De === p)
      return;
    if (ae = !0, De = p, le === p) {
      le = null, Gr(G);
      return;
    }
    const P = He(), A = xh(e());
    if (_e(A, P)) {
      s(), Gr(G);
      return;
    }
    if (Te(P)) {
      Gr(() => xe(P, A));
      return;
    }
    if (P) {
      Gr(() => $e(P));
      return;
    }
    Gr(G);
  }), Ve(() => {
    t() || Qn();
  }), Ve(() => {
    if (!t() || !a($) || a(ee) !== Wr(e()))
      return;
    const p = a(Ne);
    if (p.length === 0 || !dd.canUsePersistentCache())
      return;
    const P = Sh(p);
    if (P.length === 0)
      return;
    const A = [...P].sort().join("\0");
    A !== me && (me = A, Promise.resolve(dd.prefetchCachedMediaDescriptors(P)).catch(() => {
    }));
  }), Ns(() => {
    M += 1, pe += 1, Pe += 1, w(Me, "idle"), w(ee, null), w($, !1);
  }), Ve(() => {
    if (t()) {
      if (!o.searchQuery) {
        const p = se !== "";
        if (Qn(), pe += 1, w(Ie, !1), w(te, "idle"), Xs.clearCache?.(), se = "", q = !1, o.searchPage !== 1) {
          if (o.searchPage = 1, p) {
            const P = e();
            P && Hn(P, () => sn(P, M), () => o.loadedPosts.length > 0);
          }
          return;
        }
        if (o.searchPosts = [], o.searchTotalCount = 0, o.searchHasNext = !1, p) {
          const P = e();
          P && Hn(P, () => sn(P, M), () => o.loadedPosts.length > 0);
        }
        return;
      }
      if (o.searchQuery !== se) {
        Qn(), se === "" && o.searchPosts.length === 0 && (o.searchPosts = o.loadedPosts), se = o.searchQuery, o.searchPage = 1, q = !0, jr(1, o.searchQuery);
        return;
      }
      if (se = o.searchQuery, !q) {
        q = !0;
        const p = e(), P = o.searchQuery, A = ++pe, U = o.searchPosts.length > 0;
        p && U && Hn(p, () => Nn(A, P, p), () => o.searchPosts.length > 0), Ar(o.searchPage, P, A);
      }
    }
  }), {
    state: o,
    get isSearchMode() {
      return a(ue);
    },
    get posts() {
      return a(Ne);
    },
    get displayTotalCount() {
      return a(at);
    },
    get displayPage() {
      return a(re);
    },
    get totalPages() {
      return a(mt);
    },
    get canGoPrevious() {
      return a(nt);
    },
    get canGoFirst() {
      return a(st);
    },
    get canGoNext() {
      return a(rt);
    },
    get canGoLast() {
      return a(Kt);
    },
    get showPaging() {
      return a(et);
    },
    get canLoadOlder() {
      return a(Qe);
    },
    get canLoadNewer() {
      return a(tt);
    },
    get canReturnToLatest() {
      return a(Je);
    },
    get canJumpToOldest() {
      return a(Mt);
    },
    get canFetchOlderFromRelays() {
      return a(Le);
    },
    get isFetchingOlderFromRelays() {
      return a(Yt);
    },
    get isFetchingFromRelays() {
      return a(cr);
    },
    get isRefetchingAroundCurrentView() {
      return a(Se);
    },
    get showLocalExhaustedState() {
      return a(ur);
    },
    get showSavedPostsBoundary() {
      return a(Nt);
    },
    get isShowingSavedOlderPosts() {
      return o.listingMode === "sparse" && o.sparseSource === "saved";
    },
    get visibleNewestCreatedAt() {
      return a(Yn);
    },
    get visibleOldestCreatedAt() {
      return a(bt);
    },
    get visiblePostCount() {
      return a(rn);
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
      return a(On);
    },
    get isSearchPageLoading() {
      return a(Ie);
    },
    get searchResultStatus() {
      return a(te);
    },
    get initialLocalLoadStatus() {
      return a(Me);
    },
    get canRefetchAroundCurrentView() {
      return a(an);
    },
    get currentViewRefetchStatusMessageKey() {
      return a(zn);
    },
    get currentViewRefetchStatusMessageValues() {
      return a(hr);
    },
    prepareForClose: fa,
    cancelCurrentSync: zt,
    cancelCurrentViewRefetch: fr,
    loadOlder: ds,
    loadNewer: cs,
    returnToLatest: Vs,
    showSavedOlderPosts: Es,
    jumpToOldest: Ba,
    jumpToCreatedAt: ln,
    fetchOlderFromRelays: us,
    goFirstPage: _s,
    goPreviousPage: oa,
    goToNextPage: ls,
    goToLastPage: Us,
    refetchAroundCurrentView: hs,
    resetSearchState: Sn,
    refreshAfterLocalImport: Ks,
    deleteLocalHistory: js,
    patchDeletedPost: qa
  };
}
const co = /* @__PURE__ */ new Map();
function nd(t) {
  if (typeof t != "string")
    return null;
  const e = t.trim();
  return e.length > 0 ? e : null;
}
function Uu(t) {
  return typeof t == "string" ? t.trim() : "";
}
function rd(t) {
  const e = nd(t.pubkeyHex);
  if (!e)
    return null;
  const n = t.mode === "search" ? Uu(t.searchQuery) : "";
  return `${e}:${t.mode}:${n}`;
}
function Ky(t) {
  const e = rd(t);
  if (!e)
    return null;
  const n = co.get(e);
  return n ? {
    ...n,
    anchor: { ...n.anchor }
  } : null;
}
function Yy(t) {
  const e = rd(t), n = nd(t.pubkeyHex);
  !e || !n || co.set(e, {
    pubkeyHex: n,
    mode: t.mode,
    searchQuery: t.mode === "search" ? Uu(t.searchQuery) : "",
    anchor: { ...t.anchor },
    savedAt: t.savedAt ?? Date.now()
  });
}
function zd(t) {
  const e = nd(t.pubkeyHex);
  if (e) {
    if (t.mode) {
      const n = rd({
        pubkeyHex: e,
        mode: t.mode,
        searchQuery: t.searchQuery
      });
      n && co.delete(n);
      return;
    }
    for (const n of co.keys())
      n.startsWith(`${e}:`) && co.delete(n);
  }
}
const ao = 1, zy = 2, Qy = 12;
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
  let c = Ce(null), u = Ce(!0), b = Ce(!0), g = null, y = Ce(null), x = !1, f = null;
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
  function M() {
    const N = Pe();
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
    N && (N.scrollTop = 0, O(), X(), fe());
  }
  function me() {
    const N = i();
    N && (N.scrollTop = N.scrollHeight, O(), X(), fe());
  }
  function O() {
    const N = i();
    if (!N) {
      w(u, !0);
      return;
    }
    w(u, N.scrollTop <= ao);
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
  function pe() {
    const N = i();
    if (!N)
      return null;
    const I = N.getBoundingClientRect(), Q = I.top + Qy, ne = Array.from(N.querySelectorAll("[data-post-history-event-id]"));
    let ce = null;
    for (const se of ne) {
      const q = Number(se.dataset.postHistoryPostedAt);
      if (!Number.isFinite(q))
        continue;
      const Fe = se.getBoundingClientRect();
      if (Fe.bottom > I.top + ao && Fe.top < I.bottom - ao) {
        if (Fe.top <= Q && Fe.bottom > Q)
          return q;
        ce === null && (ce = q);
      }
    }
    return ce;
  }
  function Ie() {
    if (!t() || n().length === 0) {
      w(c, null);
      return;
    }
    const N = pe();
    w(
      c,
      N === null ? null : Ah(N, r()),
      !0
    );
  }
  function te() {
    g !== null && (cancelAnimationFrame(g), g = null);
  }
  function fe() {
    t() && (te(), g = requestAnimationFrame(() => {
      g = null, Ie();
    }));
  }
  function ae() {
    O(), X(), fe();
  }
  function De() {
    Wa().then(() => {
      t() && ee();
    });
  }
  function Me() {
    Wa().then(() => {
      t() && me();
    });
  }
  function Pe() {
    const N = i();
    if (!N)
      return null;
    const I = N.getBoundingClientRect(), Q = Array.from(N.querySelectorAll("[data-post-history-event-id]"));
    for (const ne of Q) {
      const ce = ne.dataset.postHistoryEventId;
      if (!ce)
        continue;
      const se = ne.getBoundingClientRect();
      if (se.bottom > I.top + ao && se.top < I.bottom - ao)
        return { eventId: ce, offsetTop: se.top - I.top };
    }
    return null;
  }
  function de(N) {
    const I = i();
    if (!N || !t() || !I)
      return !1;
    R();
    const Q = Array.from(I.querySelectorAll("[data-post-history-event-id]")).find((q) => q.dataset.postHistoryEventId === N.eventId);
    if (!Q)
      return !1;
    const ne = I.getBoundingClientRect(), se = Q.getBoundingClientRect().top - ne.top;
    return I.scrollTop += se - N.offsetTop, fe(), !0;
  }
  function J(N, I) {
    const Q = i();
    return Q ? Array.from(Q.querySelectorAll("[data-post-history-thread-anchor-event-id]")).find((ne) => ne.dataset.postHistoryThreadAnchorScopeId === N && ne.dataset.postHistoryThreadAnchorEventId === I) ?? null : null;
  }
  function le(N, I) {
    const Q = J(N, I);
    return Q ? {
      scopeEventId: N,
      eventId: I,
      top: Q.getBoundingClientRect().top
    } : null;
  }
  function Re(N) {
    const I = i();
    if (!N || !t() || !I)
      return !1;
    R();
    const Q = J(N.scopeEventId, N.eventId);
    if (!Q)
      return !1;
    const ne = Q.getBoundingClientRect().top - N.top;
    return Math.abs(ne) < 0.5 || (I.scrollTop += ne, fe(), O(), X()), !0;
  }
  async function we(N, I, Q) {
    const ne = le(N, I), ce = Q();
    await Wa(), Re(ne), await ce, await Wa(), Re(ne);
  }
  return Ve(() => {
    if (!t()) {
      x = !1, w(y, null), f = null, w(c, null), te();
      return;
    }
    x || (x = !0, w(y, m(), !0), f = null);
  }), Ve(() => {
    if (!t() || !o(a(y)))
      return;
    const N = a(y), I = Wy(N);
    f !== I && Wa().then(() => {
      !t() || a(y) !== N || (de(N.anchor), f = I, w(y, null));
    });
  }), Ve(() => {
    if (!t()) {
      w(c, null), te();
      return;
    }
    return i(), n(), r(), Wa().then(() => {
      t() && (Ie(), O(), X());
    }), () => {
      te();
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
    saveCurrentSessionScrollAnchor: M,
    clearCurrentSessionScrollAnchor: z,
    clearAllSessionScrollAnchorsForCurrentPubkey: $,
    handleHistoryScroll: ae,
    resetHistoryScrollSoon: De,
    resetHistoryScrollToBottomSoon: Me,
    captureHistoryScrollAnchor: Pe,
    restoreHistoryScrollAnchor: de,
    preserveThreadParentToggleScroll: we
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
    const r = nl(), i = tm(n), s = new Map(i.map((z) => [z.eventId, z])), l = i.map((z) => z.eventId), c = this.resolveRelayUrls(
      [
        ...n.relayHints ?? [],
        ...i.flatMap((z) => z.relayHints)
      ],
      n.relayConfig,
      n.relayLimit
    ), u = Xy(n.limit), b = Math.max(
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
      relayUrls: c
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
          x = rl(e, r, {
            on: c.length > 0 ? { relays: c } : { defaultReadRelays: !0 }
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
            limit: u
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
    const s = Oa(i).parentId, l = s ? n.get(s) : null;
    if (!l || !Za({ child: i, parent: l }).valid)
      return;
    const c = wn.sanitizeExternalRelayUrls(
      typeof r.from == "string" ? [r.from] : [],
      { limit: 1 }
    )[0], u = e.get(i.id);
    if (!u) {
      e.set(i.id, {
        parentEventId: l.eventId,
        event: i,
        relayUrls: new Set(c ? [c] : [])
      });
      return;
    }
    if (!kc(u.event, i)) {
      this.console.warn("post_history_reply_fetch_packet_conflict", i.id);
      return;
    }
    c && u.relayUrls.add(c);
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
      al,
      { limit: i }
    );
  }
}
const rm = new nm(), am = "postHistoryDirectReplyFetchMetadata:", Vu = 1;
function Ti(t) {
  return am + t;
}
function Bo(t) {
  return typeof t == "number" && Number.isFinite(t);
}
function sm(t) {
  if (!t || typeof t != "object")
    return !1;
  const e = t;
  return typeof e.parentEventId == "string" && (e.completeness === "complete" || e.completeness === "partial") && Bo(e.fetchedAt) && Bo(e.requestStartedAt) && e.schemaVersion === Vu;
}
function om(t, e) {
  return t ? t.requestStartedAt > e.requestStartedAt ? !0 : t.requestStartedAt === e.requestStartedAt && t.completeness === "complete" && e.completeness === "partial" : !1;
}
class im {
  constructor(e = il, n = Date.now) {
    this.db = e, this.now = n;
  }
  async get(e) {
    if (!e)
      return null;
    const n = await this.db.meta.get(Ti(e));
    return !n || !sm(n.value) ? null : {
      ...n.value,
      updatedAt: n.updatedAt
    };
  }
  async save(e) {
    return !e.parentEventId || !Bo(e.fetchedAt) || !Bo(e.requestStartedAt) ? null : this.db.transaction("rw", this.db.meta, async () => {
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
        key: Ti(e.parentEventId),
        value: i,
        updatedAt: r
      }), {
        ...i,
        updatedAt: r
      };
    });
  }
  async clear(e) {
    e && await this.db.meta.delete(Ti(e));
  }
}
const lm = new im(), Ji = {
  totalCount: 0,
  groups: []
};
function dm(t) {
  if (!ll(t.content))
    return;
  const e = Mc(t.content);
  if (e)
    return Oc(t.tags ?? []).get(e)?.url;
}
function cm(t) {
  if (t.length === 0)
    return Ji;
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
    const c = e[l], u = c.emojiUrl ?? s;
    e[l] = {
      ...c,
      count: c.count + 1,
      ...u ? { emojiUrl: u } : {}
    };
  }
  return r === 0 ? Ji : {
    totalCount: r,
    groups: e
  };
}
const Gi = {
  totalCount: 0,
  groups: []
}, um = new Intl.Segmenter(void 0, {
  granularity: "grapheme"
});
function hm(t) {
  if (!ll(t.content))
    return;
  const e = Mc(t.content);
  if (e)
    return Oc(t.tags ?? []).get(e)?.url;
}
function fm(t) {
  const e = t.trim();
  if (!e)
    return "";
  if (ll(e))
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
    return Gi;
  const n = [], r = /* @__PURE__ */ new Map();
  let i = 0;
  for (const s of t) {
    if (s.kind !== 7)
      continue;
    i += 1;
    const l = fm(s.content);
    if (!l)
      continue;
    const c = {
      eventId: s.eventId,
      pubkey: s.authorPubkey,
      profile: vm(e, s.authorPubkey),
      createdAt: s.createdAt
    }, u = r.get(l), b = hm(s);
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
  return i === 0 ? Gi : {
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
    schedule(s, l, c = 400) {
      i(s);
      const u = e(() => {
        r.delete(s), l();
      }, c);
      r.set(s, u);
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
function io(t, e = {}) {
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
function qo(t, e) {
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
      ...io(n, {
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
    ...qo(e, {
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
function km(t) {
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
async function Am(t) {
  const e = Em(t);
  return e.shouldPrefetchReplyCountsOnSkip && t.onSkipPrefetchReplyCounts?.(), await Dm({
    skipRevalidate: e.skipRevalidate,
    shouldShowInitialLoading: e.shouldShowInitialLoading,
    awaitWhenInitialLoading: t.awaitWhenInitialLoading,
    runRevalidate: t.runRevalidate
  }), e;
}
async function tc(t) {
  if (km({
    loading: t.loading,
    revalidating: t.revalidating,
    onInFlight: t.onInFlight,
    onLoadingInFlight: t.onLoadingInFlight
  }) || t.shouldHandleLoadedState && await t.handleLoadedState())
    return;
  t.prepareFreshLoadState();
  const e = await t.displayCachedForFreshLoad();
  await Am({
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
function Qa(t) {
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
        ...qo(n, { nextError: n.childrenError })
      }));
      return;
    }
    ju({ ...t, errorCode: "fetch_failed" });
  };
}
function sc(t) {
  return t === "partial" ? "partial" : "complete";
}
function Mi(t) {
  return t?.completeness === "complete" ? t.fetchedAt : null;
}
const So = 300 * 1e3;
let $m = 0;
function Nm(t, e) {
  const n = new Set(t.map((r) => r.eventId));
  return (e && e.length > 0 ? Array.from(new Set(e)) : Array.from(n)).filter((r) => n.has(r));
}
function Bm(t) {
  const e = Ta({
    event: t.parentNode.event,
    relayHints: t.parentNode.relayUrls
  });
  return !!e && Za({
    child: Do(t.record),
    parent: e
  }).valid;
}
function oc(t) {
  if (!t.parentNode)
    return null;
  const e = Ta({
    event: t.parentNode.event,
    relayHints: t.parentNode.relayUrls
  });
  return e && Za({ child: t.childNode.event, parent: e }).valid ? t.parentNode : null;
}
function qm({
  getShow: t,
  getPubkeyHex: e,
  getRxNostr: n,
  getRelayConfig: r,
  postHistoryRepositoryImpl: i = Ze,
  directReplyRecordsAdapterImpl: s = Mh,
  reactionRecordsAdapterImpl: l = Fc,
  childInteractionsRepositoryImpl: c = sl,
  deletionRequestsRepositoryImpl: u = $s,
  directReplyFetchMetadataRepositoryImpl: b = lm,
  profileSyncCoordinator: g = void 0,
  contextFetchService: y = Wl,
  replyFetchService: x = rm,
  deletionFetchService: f = Wo,
  relatedTargetResolver: _ = void 0
}) {
  const C = g ?? Jl({ getShow: t, getRxNostr: n }), m = !g, o = _ ?? Gl({
    getShow: t,
    getRxNostr: n,
    getRelayConfig: r,
    postHistoryRepositoryImpl: i,
    contextFetchService: y,
    deletionRequestsRepositoryImpl: u,
    deletionFetchService: f,
    profileSyncCoordinator: C
  }), M = !_, z = `post-history-thread-graph-parent:${++$m}`;
  let $ = Ce({}), ee = Ce({}), me = Ce({}), O = Ce({}), X = Ce({}), pe = Ce(0);
  const Ie = Cm(), te = /* @__PURE__ */ new Set(), fe = /* @__PURE__ */ new Set(), ae = /* @__PURE__ */ new Set(), De = /* @__PURE__ */ new Set();
  let Me = Ce({}), Pe = Ce({}), de = Ce({}), J = Ce({});
  const le = bm();
  function Re(d) {
    const v = a(Pe)[d] ?? [];
    w(J, {
      ...a(J),
      [d]: mm(v, a(de))
    });
  }
  function we(d, v) {
    w(Me, {
      ...a(Me),
      [d]: cm(v)
    });
  }
  function N(d, v) {
    w(Pe, {
      ...a(Pe),
      [d]: v
    }), Re(d);
  }
  function I(d, v) {
    w(de, { ...a(de), [d]: v });
    for (const [H, j] of Object.entries(a(Pe)))
      j.some((B) => B.authorPubkey === d) && Re(H);
  }
  function Q(d) {
    return a(Me)[d] ?? Ji;
  }
  function ne(d) {
    return a(J)[d] ?? Gi;
  }
  function ce(d, v) {
    return a(O)[bn(d, v)] ?? Ad();
  }
  function se(d, v, H) {
    const j = bn(d, v);
    w(O, {
      ...a(O),
      [j]: H(a(O)[j] ?? Ad())
    });
  }
  function q(d) {
    const v = Po(d), H = wi(a($)[v.eventId], v);
    return w($, { ...a($), [H.eventId]: H }), H;
  }
  function Fe(d, v) {
    v && w(ee, { ...a(ee), [d]: v });
  }
  function Xe(d, v) {
    const H = a(me)[d] ?? [], j = eg(Tm([...H, ...v]).filter((B) => B !== d && !Yt(B)), a($));
    w(me, { ...a(me), [d]: j });
  }
  function ut(d) {
    const v = Yi(d);
    return Po({
      event: v,
      relayUrls: Qa([
        ...d.relayHints,
        ...d.acceptedRelays,
        ...d.fetchedRelays ?? []
      ]),
      sources: ["anchor", "history-record"]
    });
  }
  function ue(d) {
    const v = ut(d), H = q({
      event: v.event,
      relayUrls: v.relayUrls,
      sources: v.sources
    });
    return Fe(H.eventId, H.parentEventId), Ne(H.authorPubkey, H.relayUrls), H;
  }
  function Se(d, v) {
    if (!d || !v)
      return;
    let H = !1;
    const j = { ...a($) };
    for (const [B, G] of Object.entries(a($)))
      G.authorPubkey === d && (j[B] = wi(G, { ...G, profile: v }), H = !0);
    H && w($, j);
  }
  function Ne(d, v = []) {
    const H = C.ensureProfile(d, v);
    Se(d, H);
  }
  const re = C.subscribe((d, v) => {
    t() && (Se(d, v), I(d, v));
  });
  async function at(d) {
    const v = Qa(d.relayUrls ?? []), H = q({ ...d, relayUrls: v });
    return Ne(d.event.pubkey, v), H;
  }
  function mt(d, v, H) {
    const j = xi.buildContext(d, v, H);
    return j ? xi.toDescriptor(j, z) : null;
  }
  function nt(d) {
    if (!d)
      return null;
    const v = o.getTargetSnapshot(d.eventId);
    if (v?.status !== "resolved" || !v.event)
      return d;
    const H = Qa([...d.relayUrls, ...v.relayHints]), j = v.profile ?? d.profile ?? null;
    return d.event === v.event && d.profile === j && Bi(d.relayUrls, H) ? d : wi(d, {
      ...d,
      event: v.event,
      relayUrls: H,
      profile: j
    });
  }
  function st(d, v) {
    return xi.getRelayHints(d, v);
  }
  function rt(d, v) {
    const H = Oa(v.event);
    return Qa([
      ...v.relayUrls,
      ...H.relayHints,
      ...d.relayHints,
      ...d.acceptedRelays,
      ...d.fetchedRelays ?? []
    ]);
  }
  function Kt(d, v) {
    return wn.sanitizeExternalRelayUrls(
      [
        ...v.flatMap((H) => {
          const j = Oa(H.event);
          return [...H.relayUrls, ...j.relayHints];
        }),
        ...d.relayHints,
        ...d.acceptedRelays,
        ...d.fetchedRelays ?? []
      ],
      { limit: Lm }
    );
  }
  function et(d) {
    Ie.clear(d);
  }
  function Qe(d, v) {
    const H = bn(d, v);
    Ie.schedule(H, () => {
      const j = ce(d, v);
      !j.loadingParent || !j.visibleParent || se(d, v, (B) => ({ ...B, showParentLoadingIndicator: !0 }));
    });
  }
  function tt(d, v) {
    return (a(me)[d] ?? []).map((j) => nt(a($)[j])).filter((j) => !!j).filter((j) => !Le(j.authorPubkey, j.eventId)).map((j) => ({
      event: j.event,
      profile: j.profile,
      relayUrls: [...j.relayUrls],
      isOwnReply: j.authorPubkey === v
    }));
  }
  function Je(d) {
    return (a(me)[d] ?? []).filter((v) => {
      const H = a($)[v];
      return H && !Le(H.authorPubkey, H.eventId);
    });
  }
  function Yn(d, v, H) {
    return Je(d).filter((j) => !v.includes(j) && !H.has(j));
  }
  function bt(d, v, H, j = [], B = 0, G = /* @__PURE__ */ new Set()) {
    const ie = nt(a($)[v]);
    if (!ie || Le(ie.authorPubkey, ie.eventId) || j.includes(v) || G.has(v))
      return null;
    G.add(v);
    const _e = [...j, v], xe = ce(d, v), He = ie.parentEventId, Te = He ? j.includes(He) : !1, $e = He ? oc({
      childNode: ie,
      parentNode: nt(a($)[He] ?? null)
    }) : null, Oe = xe.visibleParent && $e && !Te && B > -20 ? bt(d, $e.eventId, H, _e, B - 1, G) : null, dt = B < Mm ? Yn(v, _e, G) : [], ft = dt.length, Bt = xe.visibleChildren && ft > 0, ln = Bt ? dt.map((_t) => bt(d, _t, H, _e, B + 1, G)).filter((_t) => _t !== null) : [];
    return {
      anchorEventId: d,
      node: ie,
      parentTargetId: He,
      parentNodeState: Oe,
      parentExpansion: xe,
      parentAlreadyInPath: Te,
      repliesActionState: {
        status: xe.loadingChildren ? "loading" : xe.childrenError ? "failed" : xe.loadedChildren ? "loaded" : "unloaded",
        visible: Bt,
        replies: dt,
        replyCount: ft,
        error: xe.childrenError
      },
      replyNodeStates: ln,
      isOwnReply: ie.authorPubkey === H,
      depthFromAnchor: B,
      cycleDetected: !1
    };
  }
  function Mt(d) {
    a(pe);
    const v = nt(a($)[d.eventId]) ?? ut(d), H = ce(d.eventId, d.eventId), j = e() ?? d.pubkeyHex, B = /* @__PURE__ */ new Set([d.eventId]), G = v.parentEventId, ie = G ? nt(a($)[G] ?? null) : null, _e = ie && !Le(ie.authorPubkey, ie.eventId) ? oc({ childNode: v, parentNode: ie }) : null, xe = _e && H.visibleParent ? bt(d.eventId, _e.eventId, j, [d.eventId], -1, B) : null, He = Yn(d.eventId, [d.eventId], B), Te = new Set(He), $e = tt(d.eventId, j).filter((Bt) => Te.has(Bt.event.id)), Oe = He.length, dt = H.visibleChildren && Oe > 0, ft = dt ? He.map((Bt) => bt(d.eventId, Bt, j, [d.eventId], 1, B)).filter((Bt) => Bt !== null) : [];
    return {
      anchorEventId: d.eventId,
      parentTargetId: G,
      parentNode: _e,
      parentNodeState: xe,
      parentExpansion: H,
      repliesActionState: {
        status: H.loadingChildren ? "loading" : H.childrenError ? "failed" : H.loadedChildren ? "loaded" : "unloaded",
        visible: dt,
        replies: $e,
        replyCount: Oe,
        error: H.childrenError
      },
      reactionSummary: Q(d.eventId),
      reactionReadModel: ne(d.eventId),
      replyItems: $e,
      replyNodeStates: ft
    };
  }
  function Le(d, v) {
    return !d || !v ? !1 : !!a(X)[d]?.[v];
  }
  function Yt(d) {
    const v = a($)[d];
    return v ? Le(v.authorPubkey, d) : !1;
  }
  function cr(d, v) {
    !d || !v || Le(d, v) || w(X, {
      ...a(X),
      [d]: {
        ...a(X)[d] ?? {},
        [v]: !0
      }
    });
  }
  function ur(d, v, H = {}) {
    const j = /* @__PURE__ */ new Set();
    for (const [B, G] of Object.entries(a(ee))) {
      if (G !== d)
        continue;
      const ie = a($)[d];
      v && ie && ie.authorPubkey !== v || j.add(B);
    }
    if (j.size !== 0)
      for (const [B, G] of Object.entries(a(O))) {
        const ie = B.indexOf(":");
        if (ie < 0)
          continue;
        const _e = B.slice(0, ie), xe = B.slice(ie + 1);
        j.has(xe) && (!G?.loadedParent && !G?.visibleParent || se(_e, xe, (He) => Cs(He, {
          visibleParent: H.revealKnownParent ? !0 : He.visibleParent,
          parentDeleted: !0,
          lastFetchedParentAt: Date.now()
        })));
      }
  }
  function Nt(d, v = {}) {
    for (const [H, j] of d.entries())
      for (const B of j)
        ur(B, H, v);
  }
  function rn(d) {
    let v = a(X), H = !1;
    for (const [j, B] of d.entries()) {
      const G = v[j] ?? {};
      let ie = G;
      for (const _e of B)
        ie[_e] || (ie = { ...ie, [_e]: !0 }, H = !0);
      ie !== G && (v = { ...v, [j]: ie });
    }
    H && (w(X, v), Nt(d));
  }
  function an(d) {
    const v = {};
    let H = !1;
    for (const [j, B] of Object.entries(a(me))) {
      const G = B.filter((ie) => ie !== d);
      v[j] = G, G.length !== B.length && (H = !0);
    }
    if (H && w(me, v), a(ee)[d]) {
      const { [d]: j, ...B } = a(ee);
      w(ee, B);
    }
  }
  async function Pn(d, v = {}) {
    if (!d?.id || Le(d.pubkey, d.id))
      return !0;
    if (v.checkPostHistoryRepository === !1)
      return !1;
    try {
      if (typeof (await i.getByEventId(d.id))?.deletedAt == "number")
        return cr(d.pubkey, d.id), an(d.id), !0;
    } catch {
    }
    return !1;
  }
  async function un(d) {
    rn(d);
    for (const v of d.values())
      for (const H of v)
        an(H), await c.deleteChildInteractionByEventId(H);
  }
  async function On(d) {
    const v = await u.getDeletedTargets(d.map((H) => ({ targetAuthorPubkey: H.pubkey, targetEventId: H.id })));
    await un(v);
  }
  async function zn(d, v, H, j = "default") {
    if (v.length === 0)
      return;
    const B = n();
    if (!B)
      return;
    const G = v.filter((xe) => !Le(xe.pubkey, xe.id));
    if (G.length === 0)
      return;
    const ie = `${d}:deletions:${j}`, _e = f.fetchDeletionRequests(B, {
      targets: G.map((xe) => ({
        event: xe,
        relayUrls: a($)[xe.id]?.relayUrls ?? []
      })),
      relayHints: H,
      relayConfig: r()
    });
    le.replaceDeletionFetchTask(ie, _e);
    try {
      const xe = await _e.promise;
      if (!t())
        return;
      await u.upsertValidDeletionRequests({
        targetEvents: G,
        deletionEvents: xe.events,
        fetchedAt: xe.fetchedAt
      });
    } catch {
      return;
    } finally {
      le.deleteDeletionFetchTask(ie);
    }
    t() && await On(G);
  }
  async function hr(d) {
    await On(d);
    const v = [];
    for (const H of d) {
      if (await Pn(H)) {
        await c.deleteChildInteractionByEventId(H.id);
        continue;
      }
      v.push(H);
    }
    return v;
  }
  async function zt(d) {
    const v = d.map((G) => Do(G)), H = await hr(v), j = new Set(H.map((G) => G.id)), B = [];
    for (const G of d)
      j.has(G.eventId) && B.push(G);
    return B;
  }
  async function ht(d) {
    const v = await hr(d.map((B) => B.event)), H = new Set(v.map((B) => B.id)), j = [];
    for (const B of d)
      H.has(B.event.id) && j.push(B);
    return j;
  }
  async function _r(d) {
    return await On([d.event]), await Pn(d.event, { checkPostHistoryRepository: d.checkPostHistoryRepository }) ? !1 : (zn(d.anchorEventId, [d.event], d.relayHints), !0);
  }
  function ot(d, v = d) {
    et(bn(d, v)), se(d, v, (H) => ({
      ...Cs(H, {
        visibleParent: !0,
        parentDeleted: !0,
        lastFetchedParentAt: Date.now()
      })
    }));
  }
  function sn(d, v) {
    et(bn(d, v)), se(d, v, (H) => ({
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
  async function Qn(d, v, H) {
    const j = H.parentEventId;
    if (!j)
      return !1;
    const B = o.getTargetSnapshot(j);
    if (B?.status === "deleted")
      return B.authorPubkey && (cr(B.authorPubkey, j), ur(j, B.authorPubkey, { revealKnownParent: !0 })), ot(d.eventId, v), !0;
    const G = nt(a($)[j] ?? null);
    if (G) {
      const ie = Ta({
        event: G.event,
        relayHints: G.relayUrls
      });
      if (!ie || !Za({ child: H.event, parent: ie }).valid)
        return sn(d.eventId, v), !1;
      const _e = Qa([
        ...G.relayUrls,
        ...st(d, H)
      ]), xe = await _r({
        anchorEventId: d.eventId,
        event: G.event,
        relayHints: _e,
        checkPostHistoryRepository: G.authorPubkey === e()
      });
      return t() ? xe ? (se(d.eventId, v, (He) => ({
        ...Cs(He, {
          parentDeleted: He.parentDeleted,
          lastFetchedParentAt: B?.updatedAt ?? He.lastFetchedParentAt
        })
      })), !0) : (ot(d.eventId, v), !0) : !1;
    }
    if (!B)
      return !1;
    if (B.authorPubkey && Le(B.authorPubkey, j))
      return ot(d.eventId, v), !0;
    if (B.status === "resolved" && B.event) {
      const ie = Ta({
        event: B.event,
        relayHints: B.relayHints
      });
      if (!ie || !Za({ child: H.event, parent: ie }).valid)
        return sn(d.eventId, v), !1;
      const _e = q({
        event: B.event,
        relayUrls: B.relayHints,
        sources: ["fetched-parent"],
        profile: B.profile
      });
      return Fe(_e.eventId, _e.parentEventId), se(d.eventId, v, (xe) => ({
        ...Cs(xe, {
          parentDeleted: !1,
          lastFetchedParentAt: B.updatedAt ?? xe.lastFetchedParentAt
        })
      })), !0;
    }
    return B.status === "not-found" ? (se(d.eventId, v, (ie) => ({
      ...Cs(ie, {
        parentMissing: !0,
        parentDeleted: !1,
        lastFetchedParentAt: B.updatedAt ?? ie.lastFetchedParentAt
      })
    })), !0) : !1;
  }
  async function Hn(d, v, H, j = {}) {
    const B = H.parentEventId;
    if (!B)
      return;
    const G = le.incrementRequestId(), ie = bn(d.eventId, v);
    se(d.eventId, v, (_e) => ({
      ...wm(_e, { showInitialLoading: !!j.showInitialLoading })
    })), j.showInitialLoading && Qe(d.eventId, v), await Zd({
      isActive: () => G === le.getRequestId() && t(),
      cleanup: () => {
        et(ie);
      },
      onError: () => {
        Rm({
          updateExpansion: (_e) => se(d.eventId, v, _e),
          showInitialLoading: !!j.showInitialLoading,
          errorCode: "fetch_failed"
        });
      },
      run: async ({ ensureActive: _e }) => {
        const xe = mt(d, v, H);
        if (!xe)
          return;
        const He = await o.ensureTarget(xe, { force: !0, background: !j.showInitialLoading });
        if (!_e() || (et(ie), !He))
          return;
        if (He.status === "resolved" && He.event) {
          const $e = Ta({ event: He.event, relayHints: He.relayHints });
          if (!$e || !Za({ child: H.event, parent: $e }).valid) {
            sn(d.eventId, v);
            return;
          }
        }
        const Te = Pm(He);
        await ec({
          status: Te,
          strategies: Sm({
            snapshot: He,
            parentEventId: B,
            showInitialLoading: !!j.showInitialLoading,
            updateExpansion: ($e) => {
              se(d.eventId, v, $e);
            },
            hideEvent: cr,
            markParentDeletedForEvent: ur,
            setParentDeleted: () => {
              ot(d.eventId, v);
            },
            isDeletedEvent: Le,
            upsertNode: () => q({
              event: He.event,
              relayUrls: He.relayHints,
              sources: ["fetched-parent"],
              profile: He.profile
            }),
            upsertParentEdge: Fe
          })
        });
      }
    });
  }
  async function fr(d, v, H = {}) {
    const j = v === d.eventId ? ue(d) : a($)[v];
    if (!j?.parentEventId)
      return;
    const B = ce(d.eventId, v);
    await tc({
      loading: B.loadingParent,
      revalidating: B.revalidatingParent,
      onInFlight: () => {
        se(d.eventId, v, (G) => ({
          ...G,
          visibleParent: !0,
          showParentLoadingIndicator: !1
        }));
      },
      onLoadingInFlight: () => {
        Qe(d.eventId, v);
      },
      shouldHandleLoadedState: !H.force && B.loadedParent,
      handleLoadedState: async () => {
        if (B.parentDeleted)
          return ot(d.eventId, v), !0;
        se(d.eventId, v, (ie) => ({
          ...ie,
          visibleParent: !0,
          showParentLoadingIndicator: !1
        }));
        const G = await Qn(d, v, j);
        return Gd({
          hasVisibleData: G,
          lastFetchedAt: B.lastFetchedParentAt,
          ttlMs: So
        }) && Hn(d, v, j), !0;
      },
      prepareFreshLoadState: () => {
        se(d.eventId, v, (G) => ({
          ...G,
          visibleParent: !0,
          loadingParent: !0,
          parentError: null,
          parentMissing: !1,
          parentDeleted: !1,
          showParentLoadingIndicator: !1
        })), Qe(d.eventId, v);
      },
      displayCachedForFreshLoad: async () => {
        const G = await Qn(d, v, j), ie = ce(d.eventId, v);
        return {
          displayedCached: G,
          lastFetchedAt: ie.lastFetchedParentAt
        };
      },
      force: !!H.force,
      ttlMs: So,
      awaitWhenInitialLoading: !0,
      runRevalidate: ({ showInitialLoading: G }) => Hn(d, v, j, { showInitialLoading: G })
    });
  }
  async function $n(d, v = {}) {
    await fr(d, d.eventId, v);
  }
  function Fn(d) {
    xn(d.eventId, d.eventId);
  }
  function xn(d, v) {
    et(bn(d, v)), se(d, v, (H) => ({
      ...H,
      visibleParent: !1,
      showParentLoadingIndicator: !1
    }));
  }
  async function Pr(d) {
    if (ce(d.eventId, d.eventId).visibleParent) {
      Fn(d);
      return;
    }
    await $n(d);
  }
  function ua(d) {
    $n(d, { force: !0 });
  }
  async function hn(d, v) {
    if (ce(d.eventId, v).visibleParent) {
      xn(d.eventId, v);
      return;
    }
    await fr(d, v);
  }
  function Sn(d, v) {
    fr(d, v, { force: !0 });
  }
  function Wn(d) {
    const v = d.map((H) => H.fetchedAt).filter((H) => Number.isFinite(H));
    return v.length > 0 ? Math.max(...v) : null;
  }
  async function er(d) {
    try {
      return {
        metadata: await b.get(d),
        readFailed: !1
      };
    } catch {
      return { metadata: null, readFailed: !0 };
    }
  }
  async function Hr(d, v) {
    const { metadata: H, readFailed: j } = await er(d);
    return j ? null : H ? H.completeness === "complete" ? H.fetchedAt : null : Wn(v);
  }
  async function ha(d, v, H, j = {}) {
    const B = await s.getDirectReplyRecords(v);
    zn(d.eventId, B.map((xe) => Do(xe)), rt(d, H));
    const G = await zt(B);
    if (!t() || G.length === 0)
      return !1;
    const ie = await Jn(H, G, ["reply-db"], { resolveProfiles: !j.prefetchOnly });
    if (!t() || ie.length === 0)
      return !1;
    if (!t())
      return !0;
    const _e = await Hr(v, ie);
    return t() && se(d.eventId, v, (xe) => ({
      ...io(xe, {
        visibleChildren: j.prefetchOnly ? xe.visibleChildren : !0,
        lastFetchedChildrenAt: _e
      })
    })), !0;
  }
  async function $r(d, v, H, j = {}) {
    const B = bn(d.eventId, v), G = le.getRequestId(), ie = le.createChildRequestToken(B), _e = Date.now();
    se(d.eventId, v, (xe) => ({
      ...Jd(xe, {
        showInitialLoading: !!j.showInitialLoading,
        prefetchOnly: !!j.prefetchOnly
      })
    })), await Zd({
      isActive: () => G === le.getRequestId() && le.getChildRequestToken(B) === ie && t(),
      cleanup: () => {
        le.deleteChildrenFetchTask(B), le.deleteChildRequestToken(B), Er(d.eventId, v);
      },
      onError: Hm({
        updateExpansion: (xe) => se(d.eventId, v, xe),
        showInitialLoading: !!j.showInitialLoading,
        prefetchOnly: !!j.prefetchOnly
      }),
      run: async ({ ensureActive: xe }) => {
        if (!xe())
          return;
        const He = n();
        if (!He) {
          se(d.eventId, v, (_t) => ({
            ...qo(_t, {
              nextError: j.showInitialLoading && !j.prefetchOnly ? "nostr_not_ready" : null
            })
          }));
          return;
        }
        const Te = x.fetchDirectReplies(He, {
          eventId: v,
          createdAt: H.event.created_at,
          relayHints: rt(d, H),
          parents: [
            Ta({
              event: H.event,
              relayHints: rt(d, H)
            })
          ].filter((_t) => _t !== null),
          relayConfig: r()
        });
        le.replaceChildrenFetchTask(B, Te);
        const $e = await Te.promise;
        if (le.deleteChildrenFetchTask(B), !xe())
          return;
        ac($e.status), zn(d.eventId, $e.events.map((_t) => _t.event), [
          ...rt(d, H),
          ...$e.relayUrls
        ]);
        const Oe = await ht($e.events);
        $e.events.length > 0 && await c.upsertChildInteractions({
          parentEventId: v,
          events: Oe,
          fetchedAt: $e.status === "partial" ? null : $e.fetchedAt
        });
        const dt = await b.save({
          parentEventId: v,
          completeness: sc($e.status),
          fetchedAt: $e.fetchedAt,
          requestStartedAt: _e
        }), ft = Mi(dt), Bt = await zt(await s.getDirectReplyRecords(v));
        if (!xe())
          return;
        Bt.length > 0 && await Jn(H, Bt, ["reply-db", "fetched-child"], { resolveProfiles: !j.prefetchOnly });
        const ln = xm({
          nextRecordsLength: Bt.length,
          resultEventsLength: $e.events.length
        });
        await ec({
          status: ln,
          strategies: Im({
            fetchedAt: ft,
            prefetchOnly: !!j.prefetchOnly,
            updateExpansion: (_t) => {
              se(d.eventId, v, _t);
            },
            prefetchChildReplyCounts: () => {
              sa(d, v);
            }
          })
        }), pa({
          anchorEventId: d.eventId,
          nodeEventId: v,
          effectiveFetchedAt: ft,
          replyCount: Bt.length
        });
      }
    });
  }
  function aa(d, v) {
    ae.add(bn(d, v));
  }
  function vr(d, v) {
    ae.delete(bn(d, v));
  }
  function fa(d, v) {
    return ae.has(bn(d, v));
  }
  function Ia(d, v) {
    De.add(bn(d, v));
  }
  function Er(d, v) {
    De.delete(bn(d, v));
  }
  function Ra(d, v) {
    return De.has(bn(d, v));
  }
  function va(d) {
    for (const v of De)
      v.endsWith(`:${d}`) && De.delete(v);
  }
  function xr(d, v) {
    if (!Ra(d.eventId, v))
      return;
    const H = bn(d.eventId, v);
    if (le.getChildRequestToken(H) !== void 0)
      return;
    const j = ce(d.eventId, v);
    Er(d.eventId, v), !(!t() || !j.visibleChildren) && Dr(d, v, { force: !0 });
  }
  function Nr(d, v, H) {
    const j = bn(d.eventId, v);
    return le.getChildRequestToken(j) === void 0 && !fa(d.eventId, v) ? !1 : (H || (Ia(d.eventId, v), se(d.eventId, v, (B) => ({ ...B, visibleChildren: !0 }))), !0);
  }
  function kr(d, v) {
    return v === d.eventId ? ue(d) : a($)[v];
  }
  async function Dr(d, v, H = {}) {
    const j = kr(d, v);
    if (!j || Nr(d, v, !!H.prefetchOnly))
      return;
    const B = ce(d.eventId, v);
    await tc({
      loading: B.loadingChildren,
      revalidating: B.revalidatingChildren,
      onInFlight: H.prefetchOnly ? () => {
      } : () => {
        se(d.eventId, v, (G) => ({ ...G, visibleChildren: !0 }));
      },
      shouldHandleLoadedState: !H.force && B.loadedChildren,
      handleLoadedState: async () => {
        if (H.prefetchOnly)
          return !0;
        const G = Je(v).length > 0;
        return se(d.eventId, v, (ie) => ({ ...ie, visibleChildren: G })), G && sa(d, v), Gd({
          hasVisibleData: !0,
          lastFetchedAt: B.lastFetchedChildrenAt,
          ttlMs: So
        }) && $r(d, v, j), !0;
      },
      prepareFreshLoadState: () => {
      },
      displayCachedForFreshLoad: async () => {
        const G = await ha(d, v, j, H), ie = ce(d.eventId, v);
        return {
          displayedCached: G,
          lastFetchedAt: ie.lastFetchedChildrenAt
        };
      },
      force: !!H.force,
      ttlMs: So,
      prefetchOnly: !!H.prefetchOnly,
      awaitWhenInitialLoading: !1,
      onSkipPrefetchReplyCounts: () => {
        sa(d, v);
      },
      runRevalidate: ({ showInitialLoading: G }) => $r(d, v, j, { prefetchOnly: H.prefetchOnly, showInitialLoading: G })
    });
  }
  async function _a(d, v = {}) {
    await Dr(d, d.eventId, v);
  }
  async function sa(d, v) {
    const H = bn(d.eventId, v);
    if (!fe.has(H)) {
      fe.add(H);
      try {
        await Br(d, v);
      } finally {
        fe.delete(H);
      }
    }
  }
  async function Br(d, v) {
    const H = Date.now(), j = le.getRequestId(), B = Je(v).filter((Te) => {
      const $e = ce(d.eventId, Te), Oe = typeof $e.lastFetchedChildrenAt == "number" && H - $e.lastFetchedChildrenAt < rc;
      return !$e.loadedChildren && !$e.loadingChildren && !$e.revalidatingChildren && !Oe;
    });
    if (B.length === 0)
      return;
    for (const Te of B)
      aa(d.eventId, Te);
    const G = [];
    if (await Promise.all(B.map(async (Te) => {
      try {
        if (!t()) {
          vr(d.eventId, Te);
          return;
        }
        const $e = await on(d, Te), Oe = ce(d.eventId, Te), dt = typeof Oe.lastFetchedChildrenAt == "number" && Date.now() - Oe.lastFetchedChildrenAt < rc, ft = !$e || Oe.lastFetchedChildrenAt === null;
        ft && j === le.getRequestId() && t() && fa(d.eventId, Te) && le.getChildRequestToken(bn(d.eventId, Te)) === void 0 && !Oe.loadingChildren && !Oe.revalidatingChildren && (!Oe.loadedChildren || Oe.lastFetchedChildrenAt === null) && !dt ? G.push(Te) : (vr(d.eventId, Te), ft ? xr(d, Te) : Er(d.eventId, Te));
      } catch {
        vr(d.eventId, Te), xr(d, Te);
      }
    })), G.sort((Te, $e) => Number(Ra(d.eventId, $e)) - Number(Ra(d.eventId, Te))), G.splice(Om).forEach((Te) => {
      vr(d.eventId, Te), xr(d, Te);
    }), !t() || G.length === 0) {
      G.forEach((Te) => {
        vr(d.eventId, Te), xr(d, Te);
      });
      return;
    }
    const ie = [];
    for (let Te = 0; Te < G.length; Te += nc)
      ie.push(G.slice(Te, Te + nc));
    let _e = 0;
    const xe = Math.min(Fm, ie.length), He = async () => {
      for (; t(); ) {
        const Te = _e;
        _e += 1;
        const $e = ie[Te];
        if (!$e)
          return;
        await ya(d, $e);
      }
    };
    try {
      await Promise.all(Array.from({ length: xe }, () => He()));
    } finally {
      B.forEach((Te) => vr(d.eventId, Te));
    }
  }
  async function on(d, v) {
    const H = await s.getDirectReplyRecords(v), { metadata: j, readFailed: B } = await er(v);
    if (!t())
      return !1;
    const G = await zt(H), ie = a($)[v];
    if (!t() || !ie || G.length === 0 && !j)
      return !1;
    const _e = await Jn(ie, G, ["reply-db"], { resolveProfiles: !1 });
    if (!t() || _e.length === 0 && !j)
      return !1;
    const xe = B ? null : j ? j.completeness === "complete" ? j.fetchedAt : null : Wn(_e);
    return t() && se(d.eventId, v, (He) => ({
      ...io(He, { lastFetchedChildrenAt: xe })
    })), !0;
  }
  function ss(d, v) {
    we(d, v), N(d, v);
  }
  function pa(d) {
    return d.effectiveFetchedAt !== null || d.replyCount > 0 ? !1 : (se(d.anchorEventId, d.nodeEventId, (v) => ({
      ...v,
      loadedChildren: !1,
      loadingChildren: !1,
      revalidatingChildren: !1,
      childrenError: null,
      lastFetchedChildrenAt: null
    })), !0);
  }
  async function ga(d) {
    const { metadata: v, readFailed: H } = await er(d.parentEventId), j = d.cachedRecords.filter((ie) => ie.kind === 1 || ie.kind === 42);
    if (j.length === 0 && !v)
      return;
    const B = await Jn(d.anchorNode, j, ["reply-db", "inbound-sync"], { resolveProfiles: !1 });
    if (!d.ensureActive() || B.length === 0 && !v || v?.completeness === "partial" && pa({
      anchorEventId: d.post.eventId,
      nodeEventId: d.parentEventId,
      effectiveFetchedAt: null,
      replyCount: B.length
    }))
      return;
    const G = H ? null : v ? Mi(v) : Wn(B);
    se(d.post.eventId, d.parentEventId, (ie) => ({
      ...io(ie, { lastFetchedChildrenAt: G })
    })), Ne(d.anchorNode.authorPubkey, d.anchorNode.relayUrls);
  }
  async function qr(d, v) {
    if (!t() || d.length === 0)
      return;
    const H = Nm(d, v);
    if (H.length === 0)
      return;
    const j = le.getRequestId(), B = !!v?.length, G = new Map(d.map((ie) => [ie.eventId, ie]));
    await Xd({
      items: H,
      isActive: () => j === le.getRequestId() && t(),
      run: async ({ ensureActive: ie }) => {
        for (const _e of H) {
          const xe = G.get(_e);
          if (!xe || !ie())
            continue;
          const He = bn(xe.eventId, _e), Te = ce(xe.eventId, _e);
          if (!B && (te.has(He) || Te.loadedChildren || Te.loadingChildren || Te.revalidatingChildren)) {
            te.add(He);
            continue;
          }
          te.add(He);
          const $e = ue(xe), [Oe, dt] = await Promise.all([
            ym(_e, l),
            s.getDirectReplyRecords(_e)
          ]);
          if (!ie())
            continue;
          const [ft, Bt] = await Promise.all([
            zt(Oe),
            zt(dt)
          ]);
          if (!ie())
            continue;
          ss(_e, ft);
          const ln = Array.from(new Set(ft.map((_t) => _t.authorPubkey).filter((_t) => !!_t)));
          if (ln.length > 0) {
            const _t = await _c.getProfiles(ln, { allowBackgroundRefresh: !1 });
            if (!ie())
              continue;
            for (const Nn of ln) {
              const Vr = _t[Nn] ?? null;
              I(Nn, Vr), Ne(Nn, $e.relayUrls);
            }
          }
          await ga({
            post: xe,
            parentEventId: _e,
            cachedRecords: Bt,
            anchorNode: $e,
            ensureActive: ie
          });
        }
      }
    });
  }
  async function ya(d, v) {
    const H = v.map((Oe) => a($)[Oe]).filter((Oe) => !!Oe);
    if (H.length === 0)
      return;
    const j = le.getRequestId(), B = Date.now(), G = /* @__PURE__ */ new Map(), ie = /* @__PURE__ */ new Map();
    let _e = !1, xe = !1;
    const He = `${d.eventId}:children-prefetch:${v.join(",")}`, Te = () => _e || j !== le.getRequestId() || !t() ? !1 : v.every((Oe) => fa(d.eventId, Oe) && le.getChildRequestToken(bn(d.eventId, Oe)) === G.get(Oe)), $e = (Oe) => {
      for (const dt of v)
        ju({
          updateExpansion: (ft) => se(d.eventId, dt, ft),
          showInitialLoading: !1,
          prefetchOnly: !0,
          errorCode: Oe
        });
    };
    await Xd({
      items: v,
      isActive: Te,
      prepareItem: (Oe) => {
        const dt = bn(d.eventId, Oe), ft = le.createChildRequestToken(dt);
        return G.set(Oe, ft), se(d.eventId, Oe, (Bt) => ({
          ...Jd(Bt, { showInitialLoading: !1, prefetchOnly: !0 })
        })), ft;
      },
      completeBatch: (Oe) => {
        if (Oe && Te())
          for (const dt of v)
            se(d.eventId, dt, (ft) => ({
              ...io(ft, {
                loadedChildren: Oe && ((ie.get(dt) ?? null) !== null || Je(dt).length > 0),
                revalidatingChildren: !1,
                lastFetchedChildrenAt: ie.get(dt) ?? null
              })
            }));
      },
      cleanupItem: (Oe, dt) => {
        const ft = bn(d.eventId, Oe);
        le.getChildRequestToken(ft) === dt && le.deleteChildRequestToken(ft), vr(d.eventId, Oe), xe || _e ? Er(d.eventId, Oe) : xr(d, Oe);
      },
      cleanup: () => {
        le.deleteChildrenFetchTask(He);
      },
      onError: () => {
        $e("fetch_failed");
      },
      run: async ({ ensureActive: Oe }) => {
        if (!Oe())
          return;
        const dt = n();
        if (!dt) {
          $e("nostr_not_ready");
          return;
        }
        const ft = Kt(d, H), Bt = x.fetchDirectReplies(dt, {
          eventId: v[0] ?? "",
          eventIds: v,
          createdAt: Math.min(...H.map((ct) => ct.event.created_at)),
          relayHints: ft,
          parents: H.map((ct) => Ta({
            event: ct.event,
            relayHints: [
              ...ct.relayUrls,
              ...Oa(ct.event).relayHints
            ]
          })).filter((ct) => ct !== null),
          relayConfig: r()
        });
        le.replaceChildrenFetchTask(He, Bt);
        const ln = await Bt.promise;
        if (le.deleteChildrenFetchTask(He), !Oe())
          return;
        if (ln.status === "cancelled") {
          _e = !0;
          for (const ct of v)
            se(d.eventId, ct, (tr) => ({
              ...qo(tr, { nextError: tr.childrenError })
            }));
          return;
        }
        ac(ln.status);
        const _t = new Set(v), Nn = ln.events.filter((ct) => _t.has(ct.parentEventId) && ct.event.id !== ct.parentEventId);
        Nn.length > 0 && await zn(d.eventId, Nn.map((ct) => ct.event), [...ft, ...ln.relayUrls], `children-prefetch:${v.join(",")}`);
        const Vr = await ht(Nn);
        if (!Oe())
          return;
        const jr = /* @__PURE__ */ new Map(), Ar = new Map(Nn.map((ct) => [ct.event.id, ct.parentEventId]));
        for (const ct of Vr) {
          const tr = Ar.get(ct.event.id);
          if (!tr || !_t.has(tr))
            continue;
          const ma = jr.get(tr) ?? [];
          ma.push(ct), jr.set(tr, ma);
        }
        for (const ct of v) {
          const tr = jr.get(ct) ?? [];
          if (tr.length > 0 && await c.upsertChildInteractions({
            parentEventId: ct,
            events: tr,
            fetchedAt: ln.status === "partial" ? null : ln.fetchedAt
          }), !Oe())
            return;
          const ma = await b.save({
            parentEventId: ct,
            completeness: sc(ln.status),
            fetchedAt: ln.fetchedAt,
            requestStartedAt: B
          });
          ie.set(ct, Mi(ma));
          const Rr = await zt(await s.getDirectReplyRecords(ct)), oa = a($)[ct];
          oa && await Jn(oa, Rr, ["reply-db", "fetched-child"], { resolveProfiles: !1 });
        }
        Oe() && (xe = !0);
      }
    });
  }
  async function Jn(d, v, H, j = {}) {
    const B = d.eventId, G = [], ie = [], _e = j.resolveProfiles !== !1;
    for (const xe of v) {
      const He = Do(xe);
      if (!Bm({ parentNode: d, record: xe })) {
        await c.deleteChildInteractionByEventId(xe.eventId);
        continue;
      }
      if (Le(He.pubkey, He.id))
        continue;
      const Te = _e ? await at({ event: He, relayUrls: xe.relayUrls, sources: H }) : q({
        event: He,
        relayUrls: Qa(xe.relayUrls),
        sources: H
      });
      _e || Ne(He.pubkey, Qa(xe.relayUrls)), Te.eventId !== B && (Fe(Te.eventId, B), G.push(Te.eventId), ie.push(xe));
    }
    return Xe(B, G), ie;
  }
  function Ea(d) {
    pr(d.eventId, d.eventId);
  }
  function pr(d, v) {
    Er(d, v), se(d, v, (H) => ({ ...H, visibleChildren: !1 }));
  }
  function ka(d) {
    if (ce(d.eventId, d.eventId).visibleChildren) {
      Ea(d);
      return;
    }
    _a(d);
  }
  function os(d) {
    _a(d, { force: !0 });
  }
  function Gn(d, v) {
    if (ce(d.eventId, v).visibleChildren) {
      pr(d.eventId, v);
      return;
    }
    Dr(d, v);
  }
  function is(d, v) {
    Dr(d, v, { force: !0 });
  }
  async function Sr(d, v = []) {
    if (!d?.id || d.kind !== 1 && d.kind !== 42)
      return !0;
    const H = Oa(d), j = H.parentId;
    if (!j)
      return !0;
    const B = v.find(($e) => $e.eventId === j) ?? null, G = Object.keys(a(O)).filter(($e) => $e.endsWith(`:${j}`));
    if (!B && G.length === 0)
      return !1;
    const ie = o.getTargetSnapshot(j), _e = B ? a($)[j] ?? Po({
      event: Yi(B),
      relayUrls: Qa([
        ...B.relayHints,
        ...B.acceptedRelays,
        ...B.fetchedRelays ?? []
      ]),
      sources: ["history-record"]
    }) : a($)[j] ?? (ie?.status === "resolved" && ie.event ? Po({
      event: ie.event,
      relayUrls: ie.relayHints,
      sources: ["fetched-parent"]
    }) : null);
    if (!_e)
      return !1;
    const xe = Ta({ event: _e.event, relayHints: _e.relayUrls });
    if (!xe || !Za({ child: d, parent: xe }).valid || (await hr([d])).length === 0)
      return !1;
    await c.upsertChildInteractions({
      parentEventId: j,
      events: [{ event: d, relayUrls: H.relayHints }]
    });
    const He = await zt(await s.getDirectReplyRecords(j));
    if (!t())
      return !1;
    await Jn(_e, He, ["reply-db", "posted-reply"]);
    const Te = ($e, Oe) => {
      se($e, Oe, (dt) => ({
        ...dt,
        loadedChildren: !0,
        loadingChildren: !1,
        childrenError: null
      }));
    };
    B && Te(B.eventId, B.eventId);
    for (const $e of G) {
      const Oe = $e.indexOf(":");
      Oe < 0 || Te($e.slice(0, Oe), $e.slice(Oe + 1));
    }
    return !0;
  }
  async function Ir(d) {
    !d.eventId || !d.authorPubkey || (va(d.eventId), cr(d.authorPubkey, d.eventId), an(d.eventId), ur(d.eventId, d.authorPubkey, { revealKnownParent: !0 }), d.deletionEvent && await u.upsertValidDeletionRequests({
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
  Ve(() => {
    t() && w(pe, o.getScopeRevision(z), !0);
  }), Ve(() => {
    if (t()) {
      a(pe);
      for (const d of Object.keys(a(O))) {
        const [v, H] = d.split(":"), B = a($)[H]?.parentEventId;
        if (!B)
          continue;
        const G = o.getTargetSnapshot(B);
        G?.status === "deleted" && (ce(v, H).parentDeleted || (G.authorPubkey && (cr(G.authorPubkey, B), ur(B, G.authorPubkey, { revealKnownParent: !0 })), ot(v, H)));
      }
    }
  });
  function Ur() {
    le.cancelAndClearFetchTasks(), le.clearChildRequestTokens(), ae.clear(), De.clear(), m && C.reset(), Ie.clearAll();
  }
  function Rt() {
    Ur(), M && o.reset(), le.incrementRequestId(), w($, {}), w(ee, {}), w(me, {}), w(O, {}), w(X, {}), w(Me, {}), w(Pe, {}), w(de, {}), te.clear(), fe.clear();
  }
  return Ve(() => {
    t() || Rt();
  }), Ve(() => {
    if (t())
      return () => {
        Ur();
      };
  }), Ns(() => {
    o.invalidateScope(z), Ur(), re(), M && o.reset(), m && C.dispose();
  }), {
    getAnchorState: Mt,
    toggleParent: Pr,
    retryParent: ua,
    toggleNodeParent: hn,
    retryNodeParent: Sn,
    toggleChildren: ka,
    retryChildren: os,
    toggleNodeChildren: Gn,
    retryNodeChildren: is,
    recordPostedReply: Sr,
    recordDeletedEvent: Ir,
    loadCachedChildInteractionStateForPosts: qr,
    cancelCurrentGraphFetches: Ur,
    resetState: Rt
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
  const c = Xn({
    status: "idle",
    activePubkeyHex: null,
    hasStartedInitialDialogBootstrap: !1
  });
  let u = null, b = 0;
  function g() {
    b += 1, u?.cancel(), u = null, c.status = "idle";
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
    c.status = "syncing";
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
    u = o;
    const M = await o.promise;
    m !== b || u !== o || !t() || e() !== _ || (u = null, c.status = "idle", !(o.joinedExisting || M.status === "cancelled" || M.changedParentEventIds.length === 0) && (await s(M.changedParentEventIds), ol({
      source: "dialog-inbound-sync",
      parentEventIds: M.changedParentEventIds,
      rxNostr: C,
      relayConfig: r(),
      isActive: () => t() && e() === _ && n() === C
    }).then((z) => {
      if (!(z.status === "cancelled" || z.deletedReactionEventIds.length === 0 && z.deletedReplyEventIds.length === 0 || !t() || e() !== _ || n() !== C))
        return Promise.resolve(s(M.changedParentEventIds)).catch(() => {
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
  return Ve(() => {
    const f = e() ?? null;
    f !== c.activePubkeyHex && (g(), c.activePubkeyHex = f, c.hasStartedInitialDialogBootstrap = !1);
  }), Ve(() => {
    if (!t()) {
      g(), c.hasStartedInitialDialogBootstrap = !1;
      return;
    }
    !e() || !ic(n()) || i().length === 0 || c.hasStartedInitialDialogBootstrap || (c.hasStartedInitialDialogBootstrap = !0, x());
  }), { state: c, cancelCurrentSync: g, runSync: y };
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
  ruleVersion: Jo
}, Oi = {
  status: "invalid",
  ruleVersion: Jo
};
function Jm(t) {
  return t?.ruleVersion === Jo && (t.status === "valid" || t.status === "invalid");
}
function zu(t) {
  return t?.status === "valid" && t.ruleVersion === Jo;
}
function Qu(t) {
  if (Qo(t))
    try {
      return `nostr:${dl(t)}\0${t.id}\0${t.sig}`;
    } catch {
    }
  try {
    return `raw:${JSON.stringify(t)}`;
  } catch {
    return "raw:unserializable";
  }
}
function Gm(t) {
  if (!Qo(t))
    return { ...Oi };
  try {
    const e = Lh(t);
    return el(e) && dl(e) === e.id && Hh(e) ? { ...Wm } : { ...Oi };
  } catch {
    return { ...Oi };
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
      const l = r.find((c) => c.id === i);
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
  const c = /* @__PURE__ */ new Map(), u = [], b = [];
  async function g() {
    if (u.length > 0) {
      const y = u.splice(0), x = () => dc(y, n.post);
      await (n.transaction?.post ?? (async (f) => f()))(x);
    }
    if (b.length > 0) {
      const y = b.splice(0), x = () => dc(y, n.deletion);
      await (n.transaction?.deletion ?? (async (f) => f()))(x);
    }
  }
  r?.({ phase: "verifying", processed: l, total: s });
  for (const y of i) {
    const x = Qu(y.record.rawEvent), f = c.get(x) ?? Gm(y.record.rawEvent);
    c.set(x, f), y.record.rawEventVerification = f;
    const _ = { id: y.record.id, fingerprint: x, verification: f };
    y.type === "post" ? u.push(_) : b.push(_), l += 1, l % Qm === 0 && (await g(), r?.({ phase: "verifying", processed: l, total: s }));
  }
  await g(), r?.({ phase: "verifying", processed: s, total: s });
}
function Wu(t, e) {
  if (!Qo(t) || t.kind !== e)
    return !1;
  try {
    return el(t) && dl(t) === t.id;
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
  const i = n0(), s = [], l = [], c = /* @__PURE__ */ new Set(), u = /* @__PURE__ */ new Set(), b = /* @__PURE__ */ new Set(), g = e.filter((m) => m.pubkeyHex === t), y = n.filter(
    (m) => m.targetAuthorPubkey === t
  );
  for (const m of g)
    if (!(m.kind !== 1 && m.kind !== 42)) {
      if (!zu(m.rawEventVerification) || !Ic(m.rawEvent, m) || !Wu(m.rawEvent, m.kind)) {
        i.skippedPostCount += 1;
        continue;
      }
      s.push(cc(m.rawEvent)), c.add(m.eventId), i.exportedPostEventCount += 1;
    }
  const x = /* @__PURE__ */ new Map();
  for (const m of y) {
    const o = x.get(m.deletionEventId) ?? [];
    o.push(m), x.set(m.deletionEventId, o);
  }
  for (const m of x.values()) {
    const o = m.find((M) => t0(M, M.rawEvent, t));
    if (o) {
      const M = cc(o.rawEvent);
      l.push(M);
      for (const z of Lc(M))
        u.add(z);
      i.exportedDeletionEventCount += 1;
      continue;
    }
    for (const M of m)
      b.add(M.targetEventId);
    m.every((M) => !e0(M)) ? i.missingDeletionRawEventCount += 1 : i.invalidDeletionRawEventCount += 1;
  }
  const f = /* @__PURE__ */ new Set();
  for (const m of g)
    m.kind !== 1 && m.kind !== 42 || m.deletedAt === void 0 || !c.has(m.eventId) || u.has(m.eventId) || b.has(m.eventId) || f.add(m.eventId);
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
    this.postHistoryRepository = e.postHistoryRepository ?? Ze, this.deletionRequestsRepository = e.deletionRequestsRepository ?? $s, this.workerFactory = e.workerFactory ?? (() => new Worker(
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
      const c = () => {
        s.onmessage = null, s.onerror = null, n.signal?.removeEventListener("abort", b), s.terminate();
      }, u = (g) => {
        l || (l = !0, c(), i(g));
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
var l0 = V('<div class="xmark-icon svg-icon svelte-uxr0i8"></div>'), d0 = V('<h3 class="post-history-current-month-heading svelte-uxr0i8"><button type="button" class="post-history-current-month svelte-uxr0i8"> </button></h3>'), c0 = V('<div class="post-history-heading-summary svelte-uxr0i8"><div class="post-history-summary-row svelte-uxr0i8"><span class="post-history-summary-line post-history-summary-count svelte-uxr0i8"> </span></div></div>'), u0 = V('<div class="more-icon svg-icon"></div>'), h0 = V('<div class="search-icon svg-icon svelte-uxr0i8" aria-hidden="true"></div> <span class="svelte-uxr0i8"> </span>', 1), f0 = V('<div class="repair-icon svg-icon svelte-uxr0i8" aria-hidden="true"></div> <span class="svelte-uxr0i8"> </span>', 1), v0 = V('<div class="return-to-latest-icon svg-icon" aria-hidden="true"></div> <span class="svelte-uxr0i8"> </span>', 1), p0 = V('<div class="calendar-icon svg-icon" aria-hidden="true"></div> <span class="svelte-uxr0i8"> </span>', 1), g0 = V('<div class="jump-to-oldest-icon svg-icon" aria-hidden="true"></div> <span class="svelte-uxr0i8"> </span>', 1), y0 = V('<div class="export-icon svg-icon" aria-hidden="true"></div> <span class="svelte-uxr0i8"> </span>', 1), m0 = V('<div class="import-icon svg-icon svelte-uxr0i8" aria-hidden="true"></div> <span class="svelte-uxr0i8"> </span>', 1), b0 = V('<div class="trash-icon svg-icon" aria-hidden="true"></div> <span class="svelte-uxr0i8"> </span>', 1), C0 = V('<div class="post-history-menu-body svelte-uxr0i8"><!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!></div>'), w0 = V("<!> <!>", 1), P0 = V('<div class="search-icon svg-icon svelte-uxr0i8"></div>'), x0 = V('<div class="xmark-icon svg-icon svelte-uxr0i8" aria-hidden="true"></div>'), S0 = V('<div class="post-history-search-row svelte-uxr0i8"><div><div class="post-history-search-leading svelte-uxr0i8" aria-hidden="true"><!></div> <input class="post-history-search-input svelte-uxr0i8" type="search"/></div> <!></div>'), I0 = V('<div class="calendar-icon svg-icon" aria-hidden="true"></div>'), R0 = V('<span class="post-history-date-picker-nav-icon post-history-date-picker-nav-icon-left svg-icon svelte-uxr0i8" aria-hidden="true"></span>'), _0 = V('<span class="post-history-date-picker-nav-icon post-history-date-picker-nav-icon-right svg-icon svelte-uxr0i8" aria-hidden="true"></span>'), E0 = V('<button type="button" class="post-history-date-picker-year-nav svelte-uxr0i8" aria-label="Previous year"><span class="post-history-date-picker-year-nav-icon post-history-date-picker-year-nav-icon-left svg-icon svelte-uxr0i8" aria-hidden="true"></span></button> <!> <!> <!> <button type="button" class="post-history-date-picker-year-nav svelte-uxr0i8" aria-label="Next year"><span class="post-history-date-picker-year-nav-icon post-history-date-picker-year-nav-icon-right svg-icon svelte-uxr0i8" aria-hidden="true"></span></button>', 1), k0 = V("<!> <!>", 1), D0 = V("<!> <!>", 1), A0 = V("<!> <!> <!>", 1), T0 = V('<div class="jump-icon svg-icon svelte-uxr0i8" aria-hidden="true"></div>'), M0 = V('<div class="xmark-icon svg-icon svelte-uxr0i8" aria-hidden="true"></div>'), O0 = V('<div class="post-history-utility-panel svelte-uxr0i8"><div class="post-history-utility-label svelte-uxr0i8" id="post-history-jump-date-label"> </div> <div class="post-history-utility-controls svelte-uxr0i8"><!> <!> <!></div></div>'), F0 = V('<div class="post-history-list-loading svelte-uxr0i8" aria-hidden="true"><!></div>'), L0 = V('<div class="empty-state svelte-uxr0i8"><div class="empty-message svelte-uxr0i8"> </div></div>'), H0 = V('<div class="keyboard-arrow-up-icon svg-icon" aria-hidden="true"></div> ', 1), $0 = V('<div class="post-history-nav-row post-history-nav-row-top svelte-uxr0i8"><!></div>'), N0 = V('<div class="post-history-channel-row svelte-uxr0i8"><span class="channel-icon svg-icon svelte-uxr0i8" aria-hidden="true"></span> <span class="channel-label svelte-uxr0i8"> </span> <span class="channel-name svelte-uxr0i8"> </span></div>'), B0 = V('<span class="deleted-badge svelte-uxr0i8"> </span>'), q0 = V('<span class="delete-failed svelte-uxr0i8"> </span>'), U0 = V('<div class="post-meta-inline svelte-uxr0i8"><!> <!></div>'), V0 = V('<div class="more-icon svg-icon"></div>'), j0 = V('<div class="calendar-icon svg-icon" aria-hidden="true"></div> <span class="svelte-uxr0i8"> </span>', 1), K0 = V("<!> <!>", 1), Y0 = V('<div class="post-history-menu-body svelte-uxr0i8"><div class="post-history-menu-timestamp"> </div> <!> <!> <!></div>'), z0 = V("<!> <!>", 1), Q0 = V('<span class="svelte-uxr0i8"> </span> <!>', 1), W0 = V('<div class="post-preview-header svelte-uxr0i8"><!> <div class="post-preview-header-right svelte-uxr0i8"><!> <!></div></div>'), J0 = V('<div class="post-preview-quotes svelte-uxr0i8"></div>'), G0 = V('<div class="reply-icon svg-icon" aria-hidden="true"></div>'), Z0 = V('<div class="quote-icon svg-icon" aria-hidden="true"></div>'), X0 = V('<div class="favorite-icon svg-icon svelte-uxr0i8" aria-hidden="true"></div> <span class="svelte-uxr0i8"> </span>', 1), eb = V('<div class="post-preview-action-buttons-group svelte-uxr0i8"><!> <div class="post-preview-footer-replies-slot svelte-uxr0i8"><!></div></div> <!> <div class="post-preview-footer-reaction-slot svelte-uxr0i8"><!></div>', 1), tb = V('<div class="open-in-new-icon svg-icon" aria-hidden="true"></div> <span class="svelte-uxr0i8"> </span>', 1), nb = V('<div aria-hidden="true"></div> <span class="svelte-uxr0i8"> </span>', 1), rb = V('<div class="calendar-icon svg-icon" aria-hidden="true"></div> <span class="svelte-uxr0i8"> </span>', 1), ab = V("<!> <!> <!> <!> <!>", 1), sb = V('<div class="favorite-icon svg-icon post-preview-reaction-symbol svelte-uxr0i8" aria-hidden="true"></div>'), ob = V('<span class="post-preview-reaction-content svelte-uxr0i8"> </span>'), ib = V('<img class="post-preview-reaction-emoji" draggable="false" loading="lazy" decoding="async"/>'), lb = V('<span class="post-preview-reaction-emoji-placeholder svelte-uxr0i8" aria-hidden="true"></span>'), db = V('<span class="post-preview-reaction-emoji-slot svelte-uxr0i8"><!></span>'), cb = V('<span class="post-preview-reaction-content svelte-uxr0i8"> </span>'), ub = V('<span class="post-preview-reaction-actor svelte-uxr0i8"><!></span>'), hb = V('<div class="post-preview-reaction-chip svelte-uxr0i8"><div class="post-preview-reaction-summary svelte-uxr0i8"><!> <span class="post-preview-reaction-count svelte-uxr0i8"> </span></div> <div class="post-preview-reaction-actors svelte-uxr0i8"></div></div>'), fb = V('<div class="post-preview-reactions-panel svelte-uxr0i8"></div>'), vb = V("<!> <!>", 1), pb = V('<span class="deleted-badge svelte-uxr0i8"> </span>'), gb = V('<span class="delete-failed svelte-uxr0i8"> </span>'), yb = V('<div class="post-meta svelte-uxr0i8"><!> <!></div>'), mb = V('<li><div class="post-history-main svelte-uxr0i8"><div class="post-preview svelte-uxr0i8"><!> <!> <div class="post-history-thread-anchor-post svelte-uxr0i8"><div class="post-preview-body svelte-uxr0i8"><!> <!></div> <!> <!></div></div> <!></div></li>'), bb = V('<div class="post-history-sparse-state svelte-uxr0i8" role="status"><p class="svelte-uxr0i8"> </p> <p class="svelte-uxr0i8"> </p></div>'), Cb = V('<div class="cloud-download-icon svg-icon" aria-hidden="true"></div> ', 1), wb = V('<div class="keyboard-arrow-down-icon svg-icon" aria-hidden="true"></div> ', 1), Pb = V('<div class="post-history-saved-boundary svelte-uxr0i8" role="status"><div class="post-history-saved-boundary-actions svelte-uxr0i8"><!> <!></div></div>'), xb = V('<div class="keyboard-arrow-down-icon svg-icon" aria-hidden="true"></div> ', 1), Sb = V('<div class="post-history-nav-row post-history-nav-row-bottom svelte-uxr0i8"><!></div>'), Ib = V('<div class="cloud-download-icon svg-icon" aria-hidden="true"></div> ', 1), Rb = V('<div class="post-history-exhausted-state svelte-uxr0i8"><!></div>'), _b = V('<!> <ul class="post-history-list svelte-uxr0i8"></ul> <!> <!>', 1), Eb = V('<div class="vertical-align-top-icon svg-icon" aria-hidden="true"></div>'), kb = V('<div class="post-history-latest-row svelte-uxr0i8"><!></div>'), Db = V('<div class="post-history-heading svelte-uxr0i8"><div class="post-history-heading-main svelte-uxr0i8"><!></div> <div class="post-history-heading-actions svelte-uxr0i8"><!> <!> <!></div></div> <!> <!> <div class="post-history-container svelte-uxr0i8"><!></div> <!> <!> <!>', 1), Ab = V('<div class="delete-confirm-body svelte-uxr0i8"><p class="delete-confirm-description svelte-uxr0i8"> </p> <p class="delete-confirm-warning svelte-uxr0i8"> </p></div>'), Tb = V('<div class="delete-confirm-body svelte-uxr0i8"><p class="delete-confirm-description svelte-uxr0i8"> </p></div>'), Mb = V("<div> </div>"), Ob = V("<div> </div>"), Fb = V("<div> </div>"), Lb = V("<!> <!> <!> <!> <!> <!> <!>", 1);
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
  xt(e, !0), Sa(t, Hb);
  const n = () => es(Uh, "$locale", i), r = () => es(Is, "$_", i), [i, s] = Ss(), l = $c().overlayTarget, c = 18, u = 200;
  let b = E(e, "show", 15, !1), g = E(e, "onClose", 7), y = E(e, "onReplyPost", 7, void 0), x = E(e, "onQuotePost", 7, void 0), f = E(e, "pubkeyHex", 7, null), _ = E(e, "rxNostr", 7, void 0), C = E(e, "relayConfig", 7, null), m = E(e, "latestPostedEvent", 7, null), o = E(e, "inboundInteractionSave", 7, null), M = E(e, "authoredSelfPostSave", 7, null), z = E(e, "reconcileInboundDirectReplyCandidates", 7, void 0), $ = E(e, "notifySavedAuthoredPosts", 7, void 0);
  const ee = Jl({ getShow: () => b(), getRxNostr: () => _() }), me = Gl({
    getShow: () => b(),
    getRxNostr: () => _(),
    getRelayConfig: () => C(),
    profileSyncCoordinator: ee
  }), O = jy({
    getShow: () => b(),
    getPubkeyHex: () => f(),
    getRxNostr: () => _(),
    getRelayConfig: () => C(),
    getSessionScrollState: () => Le.readCurrentSessionScrollState(),
    onSessionScrollStateInvalidated: () => Le.clearAllSessionScrollAnchorsForCurrentPubkey(),
    onSavedAuthoredPosts: async (h) => {
      await $()?.(h);
    },
    onChildInteractionBadgeRefreshRequested: (h, L) => te.loadCachedChildInteractionStateForPosts(h, L),
    onQuoteVisibleRangeRefreshRequested: (h) => pe.refreshQuotePreviews(h),
    quoteVisibleRangeRepairExecutor: async (h, L) => {
      const oe = Ie(L.visiblePosts);
      oe.length !== 0 && await me.ensureTargets(oe);
    },
    pageSize: Dc
  }), X = Cg({
    getShow: () => b(),
    getPosts: () => O.posts,
    getRxNostr: () => _(),
    getRelayConfig: () => C(),
    getIsSearchMode: () => O.isSearchMode
  }), pe = $g({
    getShow: () => b(),
    getPosts: () => O.posts,
    getRxNostr: () => _(),
    getRelayConfig: () => C(),
    relatedTargetResolver: me,
    profileSyncCoordinator: ee
  });
  function Ie(h) {
    const L = bs.buildIndex(h);
    return Object.values(L.contextsByEventId).map((oe) => bs.toDescriptor(oe, "post-history-listing-quote-visible-range-repair"));
  }
  const te = qm({
    getShow: () => b(),
    getPubkeyHex: () => f(),
    getRxNostr: () => _(),
    getRelayConfig: () => C(),
    relatedTargetResolver: me,
    profileSyncCoordinator: ee
  });
  Um({
    getShow: () => b(),
    getPubkeyHex: () => f(),
    getRxNostr: () => _(),
    getRelayConfig: () => C(),
    getPosts: () => O.posts,
    onSavedInboundInteractions: (h) => te.loadCachedChildInteractionStateForPosts(O.posts, h),
    reconcileDirectReplyCandidates: (h) => z()?.(h) ?? Promise.resolve({
      changedParentEventIds: [],
      savedDirectReplyCount: 0,
      unresolvedParentEventIds: h.map((L) => L.classification.parentEventId).filter((L) => !!L)
    })
  });
  const fe = Wh(), ae = wg();
  function De() {
    const h = /* @__PURE__ */ new Date(), L = `${h.getFullYear()}`, oe = `${h.getMonth() + 1}`.padStart(2, "0"), ye = `${h.getDate()}`.padStart(2, "0");
    return vl(`${L}-${oe}-${ye}`);
  }
  let Me = Ce(!1), Pe = Ce("none"), de = Ce(Xn(De())), J = Ce(Xn(De())), le = Ce(!1), Re = null, we = Ce(!1), N = Ce(!1), I = Ce(!1), Q = Ce(Xn({ phase: "loading" })), ne, ce, se = Ce(!1), q = Ce("postHistory.exportComplete"), Fe = Ce(Xn({})), Xe, ut = Ce(!1), ue = Ce(null), Se = Ce(Xn({})), Ne = Ce(Xn({})), re = Ce(!1), at = Ce(0), mt = Ce(0), nt = Ce("postHistory.broadcastSent"), st, rt = Ce(void 0), Kt = Ce(Xn({})), et = Ce(Xn([])), Qe = Ce(-1), tt = Ce(!1), Je = Ce(null), Yn = Ce(null), bt = Ce(!1);
  const Mt = Jh({
    getShow: () => b(),
    getPosts: () => O.posts,
    getContainer: () => a(Je)
  }), Le = Jy({
    getShow: () => b(),
    getPubkeyHex: () => f(),
    getPosts: () => O.posts,
    getLocale: () => n(),
    getContainer: () => a(Je),
    getIsSearchMode: () => O.isSearchMode,
    getSearchQuery: () => O.state.searchQuery
  }), Yt = $h({
    getShow: () => b(),
    getEmojiUrls: () => a(Hn),
    onStateChanged: () => Mt.remeasure()
  });
  function cr(h) {
    const L = Mg(h);
    return Hi({
      sourceContent: L,
      displayContent: L,
      tags: h.tags,
      media: h.media
    });
  }
  function ur(h) {
    return Yt.emojiLoadStateByUrl[h] === "ready";
  }
  function Nt(h) {
    return Yt.emojiLoadStateByUrl[h] === "failed";
  }
  function rn(h) {
    return Number.isInteger(h) ? `${h}` : h.toFixed(6).replace(/\.0+$/, "").replace(/(\.\d*?)0+$/, "$1");
  }
  function an(h) {
    const L = Yt.emojiImageMetaByUrl[h]?.aspectRatio, ye = typeof L == "number" && Number.isFinite(L) && L > 0 ? c * L : c;
    return [
      `width: ${rn(ye)}px;`,
      `height: ${c}px;`,
      "vertical-align: bottom;"
    ].join(" ");
  }
  let Pn = S(() => {
    const h = {};
    for (const L of O.posts)
      h[L.eventId] = cr(L);
    return h;
  }), un = S(() => O.currentViewRefetchStatusMessageKey ?? O.syncStatusMessageKey), On = S(() => O.currentViewRefetchStatusMessageKey ? O.currentViewRefetchStatusMessageValues : null), zn = S(() => O.syncStatus === "failed" || O.currentViewRefetchStatusMessageKey === "postHistory.repairPartialFailure" || O.currentViewRefetchStatusMessageKey === "postHistory.repairFetchFailed"), hr = S(() => O.canReturnToLatest || !Le.isHistoryScrolledToTop), zt = S(() => O.canJumpToOldest || !Le.isHistoryScrolledToBottom), ht = S(() => O.isSearchMode ? O.searchResultStatus === "loading" : O.initialLocalLoadStatus === "loading"), _r = S(() => O.posts.length === 0 && (O.isSearchMode ? O.searchResultStatus === "ready" : O.initialLocalLoadStatus === "ready"));
  function ot(h, L) {
    L[h.id] || (L[h.id] = Hi({ sourceContent: h.content, tags: h.tags }));
  }
  function sn(h, L, oe) {
    if (!(!h || oe.has(h.node.eventId))) {
      oe.add(h.node.eventId), ot(h.node.event, L), sn(h.parentNodeState, L, oe);
      for (const ye of h.replyNodeStates)
        sn(ye, L, oe);
    }
  }
  let Qn = S(() => {
    const h = {};
    for (const L of O.posts) {
      const oe = /* @__PURE__ */ new Set();
      for (const je of va(L))
        je.status === "resolved" && ot(je.event, h);
      const ye = te.getAnchorState(L);
      ye.parentNode && ot(ye.parentNode.event, h), sn(ye.parentNodeState, h, oe);
      for (const je of ye.replyNodeStates)
        sn(je, h, oe);
    }
    return h;
  }), Hn = S(() => {
    const h = /* @__PURE__ */ new Set();
    for (const L of [
      ...Object.values(a(Pn)),
      ...Object.values(a(Qn))
    ])
      for (const oe of L.previewContent.emojiUrls)
        h.add(oe);
    for (const L of O.posts) {
      const oe = te.getAnchorState(L);
      if (a(Kt)[L.eventId])
        for (const ye of oe.reactionReadModel.groups)
          ye.emojiUrl && h.add(ye.emojiUrl);
    }
    return [...h];
  });
  function fr() {
    ee.reset(), ae.resetState(), Ea(), Rr(), fe.resetDeleteConfirmation(), w(N, !1), w(ut, !1), w(ue, null), w(Me, !1), w(Pe, "none"), w(de, De(), !0), w(J, De(), !0), w(le, !1), w(we, !1), w(Se, {}, !0), w(Ne, {}, !0), fd(), w(Kt, {}, !0), Yt.resetState(), w(et, [], !0), w(Qe, -1), w(tt, !1);
  }
  function $n() {
    ne?.abort();
  }
  function Fn() {
    O.prepareForClose() ? Le.clearAllSessionScrollAnchorsForCurrentPubkey() : Le.saveCurrentSessionScrollAnchor(), X.cancelCurrentChannelResolution(), te.cancelCurrentGraphFetches(), fe.resetDeleteConfirmation(), w(N, !1), w(ut, !1), w(ue, null), w(Me, !1), w(we, !1), ae.hideCopyFloatingMessage(), Ea(), Rr(), $n(), w(tt, !1), w(et, [], !0), w(Qe, -1), b(!1), g()?.();
  }
  function xn(h) {
    return h instanceof Element && h.closest(".ehagaki-pswp") !== null;
  }
  function Pr(h) {
    xn(h.target) && h.preventDefault();
  }
  function ua(h) {
    a(tt) && h.preventDefault();
  }
  Nh(() => b(), Fn, !0), Ve(() => {
    b() || ($n(), fr());
  }), Ve(() => {
    a(I) && ce && f() !== ce && $n();
  }), Ve(() => {
    if (!b() || !a(ht)) {
      w(bt, !1);
      return;
    }
    w(bt, !1);
    const h = setTimeout(
      () => {
        b() && a(ht) && w(bt, !0);
      },
      u
    );
    return () => {
      clearTimeout(h);
    };
  }), Ns(() => {
    $n(), fd(), ee.dispose(), Rr();
  }), Ve(() => {
    if (!b() || !m()?.id)
      return;
    const h = m().id;
    Re !== h && (O.posts, te.recordPostedReply(m(), O.posts).then((L) => {
      L && (Re = h);
    }).catch(() => {
    }));
  }), Ve(() => {
    const h = O.posts;
    !b() || h.length === 0 || (Bh(h.map((L) => L.eventId)).catch(() => {
    }), ra(() => te.loadCachedChildInteractionStateForPosts(h)));
  }), Ve(() => {
    const h = o()?.revision ?? 0, L = o()?.parentEventIds ?? [], oe = O.posts;
    !b() || h <= 0 || L.length === 0 || (ra(() => te.loadCachedChildInteractionStateForPosts(oe, L)), ol({
      source: "dialog-inbound-save",
      parentEventIds: L,
      rxNostr: _(),
      relayConfig: C(),
      isActive: () => b()
    }).then((ye) => {
      if (!(!b() || ye.deletedReactionEventIds.length === 0 && ye.deletedReplyEventIds.length === 0))
        return te.loadCachedChildInteractionStateForPosts(O.posts, ye.checkedParentEventIds);
    }).catch(() => {
    }));
  }), Ve(() => {
    const h = M()?.revision ?? 0;
    !b() || h <= 0 || O.isSearchMode || O.canReturnToLatest || ra(() => O.returnToLatest());
  }), Ve(() => {
    if (b())
      return () => {
        X.cancelCurrentChannelResolution();
      };
  });
  function hn(h) {
    return h ? h.values ? r()(h.key, { values: h.values }) : r()(h.key) : null;
  }
  function Sn() {
    return hn(Vm({
      totalCount: O.displayTotalCount,
      totalCountKnown: O.state.totalCountKnown,
      totalCountStatus: O.state.totalCountStatus,
      isSearchMode: O.isSearchMode
    }));
  }
  function Wn(h) {
    if (!h)
      return null;
    const L = Number(h.year), oe = Number(h.month), ye = Number(h.day), gt = new Date(L, oe - 1, ye, 23, 59, 59, 999).getTime();
    return Number.isFinite(gt) ? Math.floor(gt / 1e3) : null;
  }
  function er() {
    return r()(lc({ direction: "older", isSearchMode: O.isSearchMode }));
  }
  function Hr() {
    return r()(lc({ direction: "newer", isSearchMode: O.isSearchMode }));
  }
  async function ha() {
    const h = O.isSearchMode, L = h ? Le.captureHistoryScrollAnchor() : null;
    await O.loadOlder() && h && Le.restoreHistoryScrollAnchor(L);
  }
  async function $r() {
    await O.showSavedOlderPosts() && Le.resetHistoryScrollSoon();
  }
  async function aa() {
    const h = Le.captureHistoryScrollAnchor(), L = a(Je)?.scrollTop ?? null;
    O.state.loadedPosts.length, a(Je)?.scrollHeight, a(Je)?.clientHeight;
    const oe = await O.fetchOlderFromRelays({ anchorEventId: h?.eventId });
    let ye = !1;
    oe && L !== null && b() && a(Je) && (ye = Le.restoreHistoryScrollAnchor(h), ye || (a(Je).scrollTop = L)), O.latestOlderBackfillUiResult, a(Je)?.scrollTop, a(Je)?.scrollHeight;
  }
  async function vr() {
    const h = O.isSearchMode ? null : Le.captureHistoryScrollAnchor();
    await O.loadNewer() && (O.isSearchMode ? Le.resetHistoryScrollSoon() : Le.restoreHistoryScrollAnchor(h));
  }
  async function fa() {
    Le.clearAllSessionScrollAnchorsForCurrentPubkey(), ((O.canReturnToLatest ? await O.returnToLatest() : !1) || !Le.isHistoryScrolledToTop) && Le.resetHistoryScrollSoon();
  }
  async function Ia() {
    const h = Wn(a(de));
    if (h === null)
      return;
    Le.clearAllSessionScrollAnchorsForCurrentPubkey(), await O.jumpToCreatedAt(h) && (w(Pe, "none"), w(le, !1), Le.resetHistoryScrollSoon());
  }
  function Er(h) {
    return a(Pn)[h.eventId] ?? cr(h);
  }
  function Ra(h) {
    return Er(h).hasRenderableText;
  }
  function va(h) {
    return pe.getQuotePreviews(h);
  }
  function xr(h) {
    return a(Se)[h.eventId] === "sending";
  }
  function Nr(h) {
    return a(Se)[h.eventId] === "failed";
  }
  function kr(h) {
    return a(Ne)[h.eventId] === "sending";
  }
  function Dr(h) {
    return ef(h) !== null;
  }
  function _a(h) {
    const L = te.getAnchorState(h).repliesActionState;
    return hn(jm(L)) ?? "";
  }
  function sa(h) {
    return !!a(Kt)[h.eventId];
  }
  function Br(h) {
    const L = te.getAnchorState(h).reactionSummary.totalCount;
    return hn(Km({ visible: sa(h), reactionCount: L })) ?? "";
  }
  function on(h) {
    return te.getAnchorState(h).reactionReadModel.groups;
  }
  function ss(h) {
    return gm(h);
  }
  function pa(h) {
    w(
      Kt,
      {
        ...a(Kt),
        [h.eventId]: !a(Kt)[h.eventId]
      },
      !0
    );
  }
  function ga(h) {
    const L = te.getAnchorState(h).repliesActionState;
    if (L.status === "failed" || L.status === "loaded" && L.replyCount === 0) {
      te.retryChildren(h);
      return;
    }
    te.toggleChildren(h);
  }
  function qr(h) {
    return md(h, f());
  }
  function ya(h) {
    qr(h) && fe.openDeleteConfirm(h);
  }
  async function Jn(h, L) {
    if (kr(h))
      return;
    const oe = ka(h, L);
    w(Ne, { ...a(Ne), [h.eventId]: "sending" }, !0);
    const ye = await tf.broadcast({ post: h, rxNostr: _() });
    w(Ne, { ...a(Ne), [h.eventId]: void 0 }, !0), os(oe, ye);
  }
  function Ea() {
    st && (clearTimeout(st), st = void 0), w(re, !1), w(rt, void 0);
  }
  function pr(h, L) {
    w(
      rt,
      {
        eventId: h.eventId,
        ...Ao(L.clientX, L.clientY)
      },
      !0
    );
  }
  function ka(h, L) {
    if (a(rt)?.eventId === h.eventId)
      return {
        x: a(rt).x,
        y: a(rt).y
      };
    const oe = L.currentTarget, ye = oe instanceof HTMLElement ? oe.getBoundingClientRect() : null;
    return Ao(ye ? ye.left + ye.width / 2 : 0, ye ? ye.bottom + 8 : 0);
  }
  function os(h, L) {
    st && clearTimeout(st), w(at, h.x, !0), w(mt, h.y, !0), w(
      nt,
      L.success ? (L.rejectedRelays?.length ?? 0) > 0 || (L.timedOutRelays?.length ?? 0) > 0 ? "postHistory.broadcastPartial" : "postHistory.broadcastSent" : "postHistory.broadcastFailed",
      !0
    ), w(re, !0), st = setTimeout(
      () => {
        w(re, !1), st = void 0;
      },
      1800
    );
  }
  function Gn(h) {
    const L = Date.now(), oe = h.node.event.created_at * 1e3;
    return {
      id: h.node.eventId,
      eventId: h.node.eventId,
      pubkeyHex: h.node.authorPubkey,
      kind: h.node.event.kind,
      content: h.node.event.content,
      tags: h.node.event.tags.map((ye) => [...ye]),
      createdAt: oe,
      postedAt: oe,
      relayHints: [...h.node.relayUrls],
      acceptedRelays: [...h.node.relayUrls],
      fetchedRelays: [...h.node.relayUrls],
      media: [],
      rawEvent: h.node.event,
      updatedAt: L,
      schemaVersion: 1
    };
  }
  function is(h) {
    const L = Date.now(), oe = h.created_at * 1e3;
    return {
      id: h.id,
      eventId: h.id,
      pubkeyHex: h.pubkey,
      kind: h.kind,
      content: h.content,
      tags: h.tags.map((ye) => [...ye]),
      createdAt: oe,
      postedAt: oe,
      relayHints: [],
      acceptedRelays: [],
      fetchedRelays: [],
      media: [],
      rawEvent: h,
      updatedAt: L,
      schemaVersion: 1
    };
  }
  function Sr(h, L) {
    return `quote-preview:${h}:${L}`;
  }
  function Ir(h, L) {
    L && fe.closeAllPostItemMenus(), fe.setPostMenuOpen(h, L);
  }
  function Ur(h) {
    w(ue, h, !0), w(ut, !0);
  }
  function Rt(h) {
    Ur(h.node.event);
  }
  function d(h) {
    return ae.copyState[h] === "failed";
  }
  function v(h) {
    return a(Ne)[h] === "sending";
  }
  function H(h, L) {
    ae.captureCopyPointerPosition(Gn(h), L);
  }
  function j(h, L) {
    ae.handleCopyNevent(Gn(h), L);
  }
  function B(h) {
    _e(Gn(h));
  }
  function G() {
    return {
      client: vd.externalNostrClient,
      customUrlTemplate: vd.externalNostrClientCustomUrl
    };
  }
  function ie() {
    const h = jh(G());
    return h ? r()("postHistory.openInExternalClient", { values: { client: h } }) : r()("postHistory.openInExternalClientFallback");
  }
  function _e(h) {
    const L = Kh(h, G(), Rc.value);
    L && window.open(L, "_blank", "noopener,noreferrer");
  }
  function xe(h, L) {
    pr(Gn(h), L);
  }
  function He(h, L) {
    Jn(Gn(h), L);
  }
  function Te(h) {
    return md(Gn(h), f());
  }
  function $e(h) {
    return a(Se)[h] === "sending";
  }
  function Oe(h) {
    const L = Gn(h);
    qr(L) && fe.openDeleteConfirm(L);
  }
  async function dt(h) {
    y() && await y()(h) !== !1 && Fn();
  }
  function ft(h) {
    x() && (x()(h), Fn());
  }
  function Bt() {
    fe.cancelDeleteConfirm();
  }
  async function ln() {
    await Wa(), a(Pe) === "search" && a(Yn)?.focus({ preventScroll: !0 });
  }
  function _t() {
    if (a(Pe) === "search") {
      Nn(), w(we, !1);
      return;
    }
    w(Pe, "search"), w(we, !1), ln();
  }
  function Nn() {
    Le.clearCurrentSessionScrollAnchor(), w(Pe, "none"), O.resetSearchState();
  }
  async function Vr(h) {
    Le.clearAllSessionScrollAnchorsForCurrentPubkey(), w(Pe, "none"), O.resetSearchState(), await O.jumpToCreatedAt(h.createdAt) && Le.resetHistoryScrollSoon();
  }
  function jr() {
    const h = a(Pe) !== "jump-date";
    w(Pe, h ? "jump-date" : "none", !0), h || w(le, !1), w(we, !1);
  }
  function Ar() {
    w(Pe, "none"), w(le, !1);
  }
  function ct(h) {
    const L = a(J) ?? a(de);
    !L || h === 0 || w(J, L.add({ years: h }), !0);
  }
  function tr() {
    w(Me, !0), w(we, !1);
  }
  function ma() {
    w(N, !0), w(we, !1);
  }
  function Rr() {
    Xe && (clearTimeout(Xe), Xe = void 0), w(se, !1);
  }
  function oa() {
    const h = /* @__PURE__ */ new Date();
    return [
      String(h.getFullYear()).padStart(4, "0"),
      String(h.getMonth() + 1).padStart(2, "0"),
      String(h.getDate()).padStart(2, "0")
    ].join("-");
  }
  function _s(h) {
    Rr(), w(
      q,
      h.isPartial ? "postHistory.exportPartial" : "postHistory.exportComplete",
      !0
    ), w(
      Fe,
      {
        exported: h.exportedEventCount,
        skipped: h.skippedPostCount + h.missingDeletionRawEventCount + h.invalidDeletionRawEventCount
      },
      !0
    ), w(se, !0), Xe = setTimeout(
      () => {
        w(se, !1), Xe = void 0;
      },
      5e3
    );
  }
  async function ls() {
    if (!f() || a(I))
      return;
    w(I, !0), w(Q, { phase: "loading" }, !0);
    const h = new AbortController();
    ne = h, ce = f(), w(we, !1), Rr();
    try {
      const { result: L, blob: oe } = await i0.exportForPubkeyInWorker(f(), {
        signal: h.signal,
        onProgress: (gt) => {
          w(Q, gt, !0);
        }
      });
      if (h.signal.aborted)
        return;
      const ye = URL.createObjectURL(oe), je = document.createElement("a");
      je.href = ye, je.download = `ehagaki-post-history-${oa()}.jsonl`, je.style.display = "none", l.appendChild(je), je.click(), setTimeout(
        () => {
          je.remove(), URL.revokeObjectURL?.(ye);
        },
        1e3
      ), _s(L);
    } catch (L) {
      if (h.signal.aborted || L instanceof DOMException && L.name === "AbortError")
        return;
      w(q, "postHistory.exportFailed"), w(Fe, {}, !0), w(se, !0), Xe = setTimeout(
        () => {
          w(se, !1), Xe = void 0;
        },
        5e3
      );
    } finally {
      ne === h && (ne = void 0, ce = void 0, w(I, !1));
    }
  }
  async function Us() {
    const h = Le.captureHistoryScrollAnchor(), L = a(Je)?.scrollTop ?? null;
    await O.refreshAfterLocalImport(), !O.isSearchMode && a(Je) && !Le.restoreHistoryScrollAnchor(h) && L !== null && (a(Je).scrollTop = L);
  }
  function ds() {
    w(we, !1), O.refetchAroundCurrentView();
  }
  function cs() {
    Le.clearAllSessionScrollAnchorsForCurrentPubkey(), w(we, !1), O.jumpToOldest().then((h) => {
      (h || !Le.isHistoryScrolledToBottom) && Le.resetHistoryScrollToBottomSoon();
    });
  }
  function Vs() {
    w(we, !1), fa();
  }
  function Es() {
    w(Me, !1);
  }
  function Ba(h) {
    w(et, h.mediaList, !0), w(Qe, h.index, !0), w(tt, h.mediaList.length > 0 && h.index >= 0, !0);
  }
  function us(h) {
    w(Qe, h, !0);
  }
  function hs() {
    w(tt, !1), w(et, [], !0), w(Qe, -1);
  }
  async function js() {
    const h = fe.deleteTargetPost;
    if (!h)
      return;
    w(
      Se,
      {
        ...a(Se),
        [h.eventId]: "sending"
      },
      !0
    );
    const L = await Zh.requestDeletion({ post: h, rxNostr: _() });
    L.success && typeof L.deletedAt == "number" && L.deletionEventId ? (O.patchDeletedPost(h.eventId, L.deletedAt, L.deletionEventId), te.recordDeletedEvent({
      eventId: h.eventId,
      authorPubkey: h.pubkeyHex,
      deletionEvent: L.deletionEvent ?? null,
      deletionEventAttestation: L.deletionEventAttestation
    }).catch(() => {
    }), w(
      Se,
      {
        ...a(Se),
        [h.eventId]: void 0
      },
      !0
    )) : w(Se, { ...a(Se), [h.eventId]: "failed" }, !0), fe.clearDeleteTarget();
  }
  async function ks() {
    await O.deleteLocalHistory() && (Le.clearAllSessionScrollAnchorsForCurrentPubkey(), w(Me, !1), w(Pe, "none"), Le.resetHistoryScrollSoon());
  }
  var Ks = {
    get show() {
      return b();
    },
    set show(h = !1) {
      b(h), R();
    },
    get onClose() {
      return g();
    },
    set onClose(h) {
      g(h), R();
    },
    get onReplyPost() {
      return y();
    },
    set onReplyPost(h = void 0) {
      y(h), R();
    },
    get onQuotePost() {
      return x();
    },
    set onQuotePost(h = void 0) {
      x(h), R();
    },
    get pubkeyHex() {
      return f();
    },
    set pubkeyHex(h = null) {
      f(h), R();
    },
    get rxNostr() {
      return _();
    },
    set rxNostr(h = void 0) {
      _(h), R();
    },
    get relayConfig() {
      return C();
    },
    set relayConfig(h = null) {
      C(h), R();
    },
    get latestPostedEvent() {
      return m();
    },
    set latestPostedEvent(h = null) {
      m(h), R();
    },
    get inboundInteractionSave() {
      return o();
    },
    set inboundInteractionSave(h = null) {
      o(h), R();
    },
    get authoredSelfPostSave() {
      return M();
    },
    set authoredSelfPostSave(h = null) {
      M(h), R();
    },
    get reconcileInboundDirectReplyCandidates() {
      return z();
    },
    set reconcileInboundDirectReplyCandidates(h = void 0) {
      z(h), R();
    },
    get notifySavedAuthoredPosts() {
      return $();
    },
    set notifySavedAuthoredPosts(h = void 0) {
      $(h), R();
    }
  }, qa = Lb(), Gr = Z(qa);
  {
    const h = (ye) => {
      var je = ke(), gt = Z(je);
      {
        const Ge = (it, In) => {
          let nr = () => In?.().props;
          {
            let Kr = S(() => r()("global.close"));
            lr(it, Hs(nr, {
              className: "modal-close",
              shape: "square",
              get ariaLabel() {
                return a(Kr);
              },
              children: (gr, Zr) => {
                var Yr = l0();
                ge((Ua) => Cn(Yr, "aria-label", Ua), [() => r()("global.close")]), D(gr, Yr);
              },
              $$slots: { default: !0 }
            }));
          }
        };
        Ae(gt, () => Bc, (it, In) => {
          In(it, { child: Ge, $$slots: { child: !0 } });
        });
      }
      D(ye, je);
    };
    let L = S(() => r()("postHistory.title")), oe = S(() => r()("postHistory.description"));
    Nc(Gr, {
      onOpenChange: (ye) => !ye && Fn(),
      onInteractOutside: Pr,
      onEscapeKeydown: ua,
      trapFocus: !1,
      get title() {
        return a(L);
      },
      get description() {
        return a(oe);
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
      children: (ye, je) => {
        var gt = Db(), Ge = Z(gt), it = T(Ge), In = T(it);
        {
          var nr = (qe) => {
            var ze = d0(), vt = T(ze), fn = T(vt, !0);
            k(vt), k(ze), ge(() => W(fn, Le.currentMonthLabel)), Eo("click", vt, jr), D(qe, ze);
          };
          be(In, (qe) => {
            Le.currentMonthLabel && qe(nr);
          });
        }
        k(it);
        var Kr = F(it, 2), gr = T(Kr);
        {
          var Zr = (qe) => {
            {
              let ze = S(() => a(Q).phase === "loading" ? r()("postHistory.exportLoading") : a(Q).phase === "verifying" ? r()("postHistory.exportVerifying", {
                values: {
                  processed: a(Q).processed ?? 0,
                  total: a(Q).total ?? 0
                }
              }) : r()("postHistory.exportCreating"));
              Gs(qe, {
                get text() {
                  return a(ze);
                },
                showLoader: !0,
                loaderSize: 30,
                state: "loading",
                customClass: "status-loading-placeholder"
              });
            }
          }, Yr = (qe) => {
            {
              let ze = S(() => a(On) ? r()(a(un), { values: a(On) }) : r()(a(un))), vt = S(() => O.showStatusLoader ? "loading" : "complete"), fn = S(() => `status-loading-placeholder${a(zn) ? " status-error" : ""}`);
              Gs(qe, {
                get text() {
                  return a(ze);
                },
                get showLoader() {
                  return O.showStatusLoader;
                },
                loaderSize: 30,
                get state() {
                  return a(vt);
                },
                get customClass() {
                  return a(fn);
                }
              });
            }
          };
          be(gr, (qe) => {
            a(I) ? qe(Zr) : a(un) && qe(Yr, 1);
          });
        }
        var Ua = F(gr, 2);
        {
          var fs = (qe) => {
            var ze = c0(), vt = T(ze), fn = T(vt), Ot = T(fn, !0);
            k(fn), k(vt), k(ze), ge((rr) => W(Ot, rr), [() => Sn()]), D(qe, ze);
          }, bo = S(() => Sn());
          be(Ua, (qe) => {
            a(bo) && qe(fs);
          });
        }
        var Tr = F(Ua, 2);
        Ae(Tr, () => yd, (qe, ze) => {
          ze(qe, {
            get open() {
              return a(we);
            },
            set open(vt) {
              w(we, vt, !0);
            },
            children: (vt, fn) => {
              var Ot = w0(), rr = Z(Ot);
              {
                let Rn = S(() => `menu-trigger post-history-menu-trigger post-history-heading-menu-trigger ${a(we) ? "is-open" : ""}`.trim()), dn = S(() => r()("postHistory.openMenu"));
                Ae(rr, () => pd, (ar, Qt) => {
                  Qt(ar, {
                    get class() {
                      return a(Rn);
                    },
                    get "aria-label"() {
                      return a(dn);
                    },
                    children: (Ke, Y) => {
                      var lt = u0();
                      D(Ke, lt);
                    },
                    $$slots: { default: !0 }
                  });
                });
              }
              var zr = F(rr, 2);
              Ae(zr, () => Io, (Rn, dn) => {
                dn(Rn, {
                  get to() {
                    return l;
                  },
                  children: (ar, Qt) => {
                    var Ke = ke(), Y = Z(Ke);
                    Ae(Y, () => gd, (lt, Wt) => {
                      Wt(lt, {
                        side: "bottom",
                        align: "end",
                        sideOffset: 8,
                        class: "post-history-menu-content",
                        trapFocus: !1,
                        preventScroll: !1,
                        onCloseAutoFocus: (Dt) => Dt.preventDefault(),
                        children: (Dt, Bn) => {
                          var At = C0(), _n = T(At);
                          Ae(_n, () => Kn, (Ft, Lt) => {
                            Lt(Ft, {
                              class: "menu-action-button",
                              onSelect: _t,
                              children: (vn, pn) => {
                                var ir = h0(), Ht = F(Z(ir), 2), Ye = T(Ht, !0);
                                k(Ht), ge((Be) => W(Ye, Be), [() => r()("postHistory.showSearch")]), D(vn, ir);
                              },
                              $$slots: { default: !0 }
                            });
                          });
                          var Xt = F(_n, 2);
                          {
                            let Ft = S(() => !O.canRefetchAroundCurrentView);
                            Ae(Xt, () => Kn, (Lt, vn) => {
                              vn(Lt, {
                                class: "menu-action-button",
                                get disabled() {
                                  return a(Ft);
                                },
                                onSelect: ds,
                                children: (pn, ir) => {
                                  var Ht = f0(), Ye = F(Z(Ht), 2), Be = T(Ye, !0);
                                  k(Ye), ge((Jt) => W(Be, Jt), [() => r()("postHistory.repair")]), D(pn, Ht);
                                },
                                $$slots: { default: !0 }
                              });
                            });
                          }
                          var sr = F(Xt, 2);
                          Ae(sr, () => Ma, (Ft, Lt) => {
                            Lt(Ft, { class: "post-history-menu-separator" });
                          });
                          var or = F(sr, 2);
                          {
                            let Ft = S(() => !a(hr));
                            Ae(or, () => Kn, (Lt, vn) => {
                              vn(Lt, {
                                class: "menu-action-button",
                                get disabled() {
                                  return a(Ft);
                                },
                                onSelect: Vs,
                                children: (pn, ir) => {
                                  var Ht = v0(), Ye = F(Z(Ht), 2), Be = T(Ye, !0);
                                  k(Ye), ge((Jt) => W(Be, Jt), [() => r()("postHistory.returnToLatest")]), D(pn, Ht);
                                },
                                $$slots: { default: !0 }
                              });
                            });
                          }
                          var Zn = F(or, 2);
                          Ae(Zn, () => Kn, (Ft, Lt) => {
                            Lt(Ft, {
                              class: "menu-action-button",
                              onSelect: jr,
                              children: (vn, pn) => {
                                var ir = p0(), Ht = F(Z(ir), 2), Ye = T(Ht, !0);
                                k(Ht), ge((Be) => W(Ye, Be), [() => r()("postHistory.jumpToDate")]), D(vn, ir);
                              },
                              $$slots: { default: !0 }
                            });
                          });
                          var En = F(Zn, 2);
                          {
                            let Ft = S(() => !a(zt));
                            Ae(En, () => Kn, (Lt, vn) => {
                              vn(Lt, {
                                class: "menu-action-button",
                                get disabled() {
                                  return a(Ft);
                                },
                                onSelect: cs,
                                children: (pn, ir) => {
                                  var Ht = g0(), Ye = F(Z(Ht), 2), Be = T(Ye, !0);
                                  k(Ye), ge((Jt) => W(Be, Jt), [() => r()("postHistory.jumpToOldest")]), D(pn, Ht);
                                },
                                $$slots: { default: !0 }
                              });
                            });
                          }
                          var yr = F(En, 2);
                          Ae(yr, () => Ma, (Ft, Lt) => {
                            Lt(Ft, { class: "post-history-menu-separator" });
                          });
                          var Qr = F(yr, 2);
                          {
                            let Ft = S(() => !f() || a(I));
                            Ae(Qr, () => Kn, (Lt, vn) => {
                              vn(Lt, {
                                class: "menu-action-button",
                                get disabled() {
                                  return a(Ft);
                                },
                                onSelect: ls,
                                children: (pn, ir) => {
                                  var Ht = y0(), Ye = F(Z(Ht), 2), Be = T(Ye, !0);
                                  k(Ye), ge((Jt) => W(Be, Jt), [() => r()("postHistory.export")]), D(pn, Ht);
                                },
                                $$slots: { default: !0 }
                              });
                            });
                          }
                          var ia = F(Qr, 2);
                          {
                            let Ft = S(() => !f());
                            Ae(ia, () => Kn, (Lt, vn) => {
                              vn(Lt, {
                                class: "menu-action-button",
                                get disabled() {
                                  return a(Ft);
                                },
                                onSelect: ma,
                                children: (pn, ir) => {
                                  var Ht = m0(), Ye = F(Z(Ht), 2), Be = T(Ye, !0);
                                  k(Ye), ge((Jt) => W(Be, Jt), [() => r()("postHistory.import")]), D(pn, Ht);
                                },
                                $$slots: { default: !0 }
                              });
                            });
                          }
                          var ms = F(ia, 2);
                          Ae(ms, () => Ma, (Ft, Lt) => {
                            Lt(Ft, { class: "post-history-menu-separator" });
                          });
                          var Da = F(ms, 2);
                          Ae(Da, () => Kn, (Ft, Lt) => {
                            Lt(Ft, {
                              class: "menu-action-button menu-action-button-danger",
                              onSelect: tr,
                              children: (vn, pn) => {
                                var ir = b0(), Ht = F(Z(ir), 2), Ye = T(Ht, !0);
                                k(Ht), ge((Be) => W(Ye, Be), [() => r()("postHistory.deleteLocalHistory")]), D(vn, ir);
                              },
                              $$slots: { default: !0 }
                            });
                          }), k(At), D(Dt, At);
                        },
                        $$slots: { default: !0 }
                      });
                    }), D(ar, Ke);
                  },
                  $$slots: { default: !0 }
                });
              }), D(vt, Ot);
            },
            $$slots: { default: !0 }
          });
        }), k(Kr), k(Ge);
        var vs = F(Ge, 2);
        {
          var Va = (qe) => {
            var ze = S0(), vt = T(ze);
            let fn;
            var Ot = T(vt), rr = T(Ot);
            {
              var zr = (Qt) => {
                Gs(Qt, {
                  variant: "spinner",
                  showLoader: !0,
                  loaderSize: 24,
                  ariaHidden: !0,
                  customClass: "post-history-search-spinner"
                });
              }, Rn = (Qt) => {
                var Ke = P0();
                D(Qt, Ke);
              };
              be(rr, (Qt) => {
                O.isSearchPageLoading ? Qt(zr) : Qt(Rn, -1);
              });
            }
            k(Ot);
            var dn = F(Ot, 2);
            Vh(dn), Ni(dn, (Qt) => w(Yn, Qt), () => a(Yn)), k(vt);
            var ar = F(vt, 2);
            {
              let Qt = S(() => r()("postHistory.hideSearch"));
              lr(ar, {
                type: "button",
                class: "post-history-search-close",
                contentLayout: "icon",
                shape: "square",
                get ariaLabel() {
                  return a(Qt);
                },
                onClick: Nn,
                children: (Ke, Y) => {
                  var lt = x0();
                  D(Ke, lt);
                },
                $$slots: { default: !0 }
              });
            }
            k(ze), ge(
              (Qt, Ke) => {
                fn = Ha(vt, 1, "post-history-search-input-wrapper svelte-uxr0i8", null, fn, { "post-history-search-active": O.isSearchMode }), Cn(dn, "placeholder", Qt), Cn(dn, "aria-label", Ke), Cn(dn, "aria-busy", O.isSearchPageLoading ? "true" : "false");
              },
              [
                () => r()("postHistory.searchPlaceholder"),
                () => r()("postHistory.search")
              ]
            ), Qh(dn, () => O.state.searchInput, (Qt) => O.state.searchInput = Qt), D(qe, ze);
          };
          be(vs, (qe) => {
            a(Pe) === "search" && qe(Va);
          });
        }
        var ja = F(vs, 2);
        {
          var ps = (qe) => {
            var ze = O0(), vt = T(ze), fn = T(vt, !0);
            k(vt);
            var Ot = F(vt, 2), rr = T(Ot);
            {
              let dn = S(() => n() ?? void 0), ar = S(() => r()("postHistory.jumpToDateLabel"));
              Ae(rr, () => Eu, (Qt, Ke) => {
                Ke(Qt, {
                  get locale() {
                    return a(dn);
                  },
                  get calendarLabel() {
                    return a(ar);
                  },
                  get value() {
                    return a(de);
                  },
                  set value(Y) {
                    w(de, Y, !0);
                  },
                  get placeholder() {
                    return a(J);
                  },
                  set placeholder(Y) {
                    w(J, Y, !0);
                  },
                  get open() {
                    return a(le);
                  },
                  set open(Y) {
                    w(le, Y, !0);
                  },
                  children: (Y, lt) => {
                    var Wt = A0(), Dt = Z(Wt);
                    {
                      const _n = (Xt, sr) => {
                        let or = () => sr?.().segments;
                        var Zn = ke(), En = Z(Zn);
                        da(En, 19, or, (yr, Qr) => `${yr.part}-${Qr}`, (yr, Qr) => {
                          var ia = ke(), ms = Z(ia);
                          Ae(ms, () => Ru, (Da, Ft) => {
                            Ft(Da, {
                              class: "post-history-date-picker-segment",
                              get part() {
                                return a(Qr).part;
                              },
                              children: (Lt, vn) => {
                                ws();
                                var pn = $a();
                                ge(() => W(pn, a(Qr).value)), D(Lt, pn);
                              },
                              $$slots: { default: !0 }
                            });
                          }), D(yr, ia);
                        }), D(Xt, Zn);
                      };
                      Ae(Dt, () => Iu, (Xt, sr) => {
                        sr(Xt, {
                          "aria-labelledby": "post-history-jump-date-label",
                          class: "post-history-date-picker-input",
                          children: _n,
                          $$slots: { default: !0 }
                        });
                      });
                    }
                    var Bn = F(Dt, 2);
                    {
                      let _n = S(() => r()("postHistory.jumpToDate"));
                      Ae(Bn, () => Au, (Xt, sr) => {
                        sr(Xt, {
                          class: "post-history-date-picker-trigger",
                          get "aria-label"() {
                            return a(_n);
                          },
                          children: (or, Zn) => {
                            var En = I0();
                            D(or, En);
                          },
                          $$slots: { default: !0 }
                        });
                      });
                    }
                    var At = F(Bn, 2);
                    Ae(At, () => Io, (_n, Xt) => {
                      Xt(_n, {
                        get to() {
                          return l;
                        },
                        children: (sr, or) => {
                          var Zn = ke(), En = Z(Zn);
                          Ae(En, () => Du, (yr, Qr) => {
                            Qr(yr, {
                              sideOffset: 8,
                              class: "post-history-date-picker-content",
                              children: (ia, ms) => {
                                var Da = ke(), Ft = Z(Da);
                                {
                                  const Lt = (vn, pn) => {
                                    let ir = () => pn?.().months, Ht = () => pn?.().weekdays;
                                    var Ye = D0(), Be = Z(Ye);
                                    Ae(Be, () => Cu, (kn, qn) => {
                                      qn(kn, {
                                        class: "post-history-date-picker-header",
                                        children: (mr, ea) => {
                                          var Dn = E0(), en = Z(Dn), gn = F(en, 2);
                                          Ae(gn, () => xu, (yt, Ut) => {
                                            Ut(yt, {
                                              class: "post-history-date-picker-nav",
                                              "aria-label": "Previous month",
                                              children: (cn, Tn) => {
                                                var tn = R0();
                                                D(cn, tn);
                                              },
                                              $$slots: { default: !0 }
                                            });
                                          });
                                          var An = F(gn, 2);
                                          Ae(An, () => wu, (yt, Ut) => {
                                            Ut(yt, { class: "post-history-date-picker-heading" });
                                          });
                                          var Ue = F(An, 2);
                                          Ae(Ue, () => Pu, (yt, Ut) => {
                                            Ut(yt, {
                                              class: "post-history-date-picker-nav",
                                              "aria-label": "Next month",
                                              children: (cn, Tn) => {
                                                var tn = _0();
                                                D(cn, tn);
                                              },
                                              $$slots: { default: !0 }
                                            });
                                          });
                                          var qt = F(Ue, 2);
                                          Eo("click", en, () => ct(-1)), Eo("click", qt, () => ct(1)), D(mr, Dn);
                                        },
                                        $$slots: { default: !0 }
                                      });
                                    });
                                    var Jt = F(Be, 2);
                                    da(Jt, 19, ir, (kn, qn) => `${kn.value.toString()}-${qn}`, (kn, qn) => {
                                      var mr = ke(), ea = Z(mr);
                                      Ae(ea, () => pu, (Dn, en) => {
                                        en(Dn, {
                                          class: "post-history-date-picker-grid",
                                          children: (gn, An) => {
                                            var Ue = k0(), qt = Z(Ue);
                                            Ae(qt, () => mu, (Ut, cn) => {
                                              cn(Ut, {
                                                children: (Tn, tn) => {
                                                  var Vt = ke(), Gt = Z(Vt);
                                                  Ae(Gt, () => Ki, (Un, yn) => {
                                                    yn(Un, {
                                                      children: (Et, mn) => {
                                                        var kt = ke(), We = Z(kt);
                                                        da(We, 19, Ht, (Ct, nn) => `${Ct}-${nn}`, (Ct, nn) => {
                                                          var wt = ke(), jt = Z(wt);
                                                          Ae(jt, () => bu, (pt, Vn) => {
                                                            Vn(pt, {
                                                              class: "post-history-date-picker-weekday",
                                                              children: (Mn, ta) => {
                                                                ws();
                                                                var jn = $a();
                                                                ge(() => W(jn, a(nn))), D(Mn, jn);
                                                              },
                                                              $$slots: { default: !0 }
                                                            });
                                                          }), D(Ct, wt);
                                                        }), D(Et, kt);
                                                      },
                                                      $$slots: { default: !0 }
                                                    });
                                                  }), D(Tn, Vt);
                                                },
                                                $$slots: { default: !0 }
                                              });
                                            });
                                            var yt = F(qt, 2);
                                            Ae(yt, () => gu, (Ut, cn) => {
                                              cn(Ut, {
                                                children: (Tn, tn) => {
                                                  var Vt = ke(), Gt = Z(Vt);
                                                  da(Gt, 19, () => a(qn).weeks, (Un, yn) => `${a(qn).value.toString()}-week-${yn}`, (Un, yn) => {
                                                    var Et = ke(), mn = Z(Et);
                                                    Ae(mn, () => Ki, (kt, We) => {
                                                      We(kt, {
                                                        children: (Ct, nn) => {
                                                          var wt = ke(), jt = Z(wt);
                                                          da(jt, 19, () => a(yn), (pt, Vn) => `${pt.toString()}-${Vn}`, (pt, Vn) => {
                                                            var Mn = ke(), ta = Z(Mn);
                                                            Ae(ta, () => yu, (jn, Mr) => {
                                                              Mr(jn, {
                                                                get date() {
                                                                  return a(Vn);
                                                                },
                                                                get month() {
                                                                  return a(qn).value;
                                                                },
                                                                children: (ei, ti) => {
                                                                  var zs = ke(), ni = Z(zs);
                                                                  Ae(ni, () => vu, (ri, la) => {
                                                                    la(ri, {
                                                                      class: "post-history-date-picker-day",
                                                                      children: (za, Qs) => {
                                                                        ws();
                                                                        var As = $a();
                                                                        ge(() => W(As, a(Vn).day)), D(za, As);
                                                                      },
                                                                      $$slots: { default: !0 }
                                                                    });
                                                                  }), D(ei, zs);
                                                                },
                                                                $$slots: { default: !0 }
                                                              });
                                                            }), D(pt, Mn);
                                                          }), D(Ct, wt);
                                                        },
                                                        $$slots: { default: !0 }
                                                      });
                                                    }), D(Un, Et);
                                                  }), D(Tn, Vt);
                                                },
                                                $$slots: { default: !0 }
                                              });
                                            }), D(gn, Ue);
                                          },
                                          $$slots: { default: !0 }
                                        });
                                      }), D(kn, mr);
                                    }), D(vn, Ye);
                                  };
                                  Ae(Ft, () => ku, (vn, pn) => {
                                    pn(vn, {
                                      class: "post-history-date-picker-calendar",
                                      children: Lt,
                                      $$slots: { default: !0 }
                                    });
                                  });
                                }
                                D(ia, Da);
                              },
                              $$slots: { default: !0 }
                            });
                          }), D(sr, Zn);
                        },
                        $$slots: { default: !0 }
                      });
                    }), D(Y, Wt);
                  },
                  $$slots: { default: !0 }
                });
              });
            }
            var zr = F(rr, 2);
            {
              let dn = S(() => r()("postHistory.jumpToDateSubmit"));
              lr(zr, {
                type: "button",
                variant: "primary",
                contentLayout: "icon",
                shape: "square",
                get ariaLabel() {
                  return a(dn);
                },
                className: "post-history-utility-button post-history-utility-submit-button",
                onClick: () => void Ia(),
                children: (ar, Qt) => {
                  var Ke = T0();
                  D(ar, Ke);
                },
                $$slots: { default: !0 }
              });
            }
            var Rn = F(zr, 2);
            {
              let dn = S(() => r()("postHistory.hideJumpToDate"));
              lr(Rn, {
                type: "button",
                variant: "default",
                contentLayout: "icon",
                shape: "square",
                get ariaLabel() {
                  return a(dn);
                },
                className: "post-history-utility-button post-history-utility-close-button",
                onClick: Ar,
                children: (ar, Qt) => {
                  var Ke = M0();
                  D(ar, Ke);
                },
                $$slots: { default: !0 }
              });
            }
            k(Ot), k(ze), ge((dn) => W(fn, dn), [() => r()("postHistory.jumpToDateLabel")]), D(qe, ze);
          };
          be(ja, (qe) => {
            a(Pe) === "jump-date" && qe(ps);
          });
        }
        var Zt = F(ja, 2), Ka = T(Zt);
        {
          var Ya = (qe) => {
            var ze = F0(), vt = T(ze);
            Gs(vt, { variant: "spinner", showLoader: !0, loaderSize: 24 }), k(ze), D(qe, ze);
          }, Xr = (qe) => {
            var ze = L0(), vt = T(ze), fn = T(vt, !0);
            k(vt), k(ze), ge((Ot) => W(fn, Ot), [
              () => O.isSearchMode ? r()("postHistory.searchNoResults") : r()("postHistory.empty")
            ]), D(qe, ze);
          }, gs = (qe) => {
            var ze = _b(), vt = Z(ze);
            {
              var fn = (Ke) => {
                var Y = $0(), lt = T(Y);
                {
                  let Wt = S(() => !O.canLoadNewer);
                  lr(lt, {
                    type: "button",
                    variant: "default",
                    className: "post-history-nav-button",
                    contentLayout: "iconText",
                    get disabled() {
                      return a(Wt);
                    },
                    onClick: () => void vr(),
                    children: (Dt, Bn) => {
                      var At = H0(), _n = F(Z(At));
                      ge((Xt) => W(_n, ` ${Xt ?? ""}`), [() => Hr()]), D(Dt, At);
                    },
                    $$slots: { default: !0 }
                  });
                }
                k(Y), D(Ke, Y);
              };
              be(vt, (Ke) => {
                (O.isSearchMode ? O.canLoadNewer : O.state.hasNewerLocal) && Ke(fn);
              });
            }
            var Ot = F(vt, 2);
            da(Ot, 21, () => O.posts, (Ke) => Ke.eventId, (Ke, Y) => {
              const lt = S(() => te.getAnchorState(a(Y)));
              var Wt = mb();
              let Dt;
              var Bn = T(Wt), At = T(Bn), _n = T(At);
              {
                var Xt = (Ye) => {
                  var Be = W0(), Jt = T(Be);
                  {
                    var kn = (Ue) => {
                      var qt = N0(), yt = F(T(qt), 2), Ut = T(yt, !0);
                      k(yt);
                      var cn = F(yt, 2), Tn = T(cn, !0);
                      k(cn), k(qt), ge(
                        (tn, Vt) => {
                          W(Ut, tn), W(Tn, Vt);
                        },
                        [
                          () => r()("postHistory.channel"),
                          () => X.getChannelText(a(Y), r())
                        ]
                      ), D(Ue, qt);
                    };
                    be(Jt, (Ue) => {
                      a(Y).kind === 42 && Ue(kn);
                    });
                  }
                  var qn = F(Jt, 2), mr = T(qn);
                  {
                    var ea = (Ue) => {
                      var qt = U0(), yt = T(qt);
                      {
                        var Ut = (Vt) => {
                          var Gt = B0(), Un = T(Gt, !0);
                          k(Gt), ge((yn) => W(Un, yn), [() => r()("postHistory.deletedBadge")]), D(Vt, Gt);
                        };
                        be(yt, (Vt) => {
                          a(Y).deletedAt && Vt(Ut);
                        });
                      }
                      var cn = F(yt, 2);
                      {
                        var Tn = (Vt) => {
                          var Gt = q0(), Un = T(Gt, !0);
                          k(Gt), ge((yn) => W(Un, yn), [() => r()("postHistory.deleteFailed")]), D(Vt, Gt);
                        }, tn = S(() => Nr(a(Y)));
                        be(cn, (Vt) => {
                          a(tn) && Vt(Tn);
                        });
                      }
                      k(qt), D(Ue, qt);
                    }, Dn = S(() => a(Y).deletedAt || Nr(a(Y)));
                    be(mr, (Ue) => {
                      a(Dn) && Ue(ea);
                    });
                  }
                  var en = F(mr, 2);
                  {
                    var gn = (Ue) => {
                      var qt = Q0(), yt = Z(qt), Ut = T(yt, !0);
                      k(yt);
                      var cn = F(yt, 2);
                      {
                        let Tn = S(() => fe.isPostMenuOpen(a(Y).eventId));
                        Ae(cn, () => yd, (tn, Vt) => {
                          Vt(tn, {
                            get open() {
                              return a(Tn);
                            },
                            onOpenChange: (Gt) => Ir(a(Y).eventId, Gt),
                            children: (Gt, Un) => {
                              var yn = z0(), Et = Z(yn);
                              Ae(Et, () => pd, (kt, We) => {
                                We(kt, {
                                  class: "menu-trigger post-history-menu-trigger",
                                  "aria-label": "アクションを表示",
                                  children: (Ct, nn) => {
                                    var wt = V0();
                                    D(Ct, wt);
                                  },
                                  $$slots: { default: !0 }
                                });
                              });
                              var mn = F(Et, 2);
                              Ae(mn, () => Io, (kt, We) => {
                                We(kt, {
                                  get to() {
                                    return l;
                                  },
                                  children: (Ct, nn) => {
                                    var wt = ke(), jt = Z(wt);
                                    Ae(jt, () => gd, (pt, Vn) => {
                                      Vn(pt, {
                                        side: "bottom",
                                        align: "start",
                                        sideOffset: 8,
                                        class: "post-history-menu-content",
                                        trapFocus: !1,
                                        preventScroll: !1,
                                        onCloseAutoFocus: (Mn) => Mn.preventDefault(),
                                        children: (Mn, ta) => {
                                          var jn = Y0(), Mr = T(jn), ei = T(Mr, !0);
                                          k(Mr);
                                          var ti = F(Mr, 2);
                                          Ae(ti, () => Ma, (la, za) => {
                                            za(la, { class: "post-history-menu-separator" });
                                          });
                                          var zs = F(ti, 2);
                                          {
                                            var ni = (la) => {
                                              var za = K0(), Qs = Z(za);
                                              Ae(Qs, () => Kn, (Ws, Js) => {
                                                Js(Ws, {
                                                  class: "menu-action-button",
                                                  onSelect: () => void Vr(a(Y)),
                                                  children: (Aa, Nb) => {
                                                    var sd = j0(), od = F(Z(sd), 2), Ju = T(od, !0);
                                                    k(od), ge((Gu) => W(Ju, Gu), [() => r()("postHistory.jumpToPostDate")]), D(Aa, sd);
                                                  },
                                                  $$slots: { default: !0 }
                                                });
                                              });
                                              var As = F(Qs, 2);
                                              Ae(As, () => Ma, (Ws, Js) => {
                                                Js(Ws, { class: "post-history-menu-separator" });
                                              }), D(la, za);
                                            };
                                            be(zs, (la) => {
                                              O.isSearchMode && la(ni);
                                            });
                                          }
                                          var ri = F(zs, 2);
                                          {
                                            let la = S(() => ae.copyState[a(Y).eventId] === "failed"), za = S(() => Dr(a(Y))), Qs = S(() => kr(a(Y))), As = S(() => qr(a(Y))), Ws = S(() => xr(a(Y))), Js = S(ie);
                                            lo(ri, {
                                              order: "standard",
                                              get copyFailed() {
                                                return a(la);
                                              },
                                              get showBroadcast() {
                                                return a(za);
                                              },
                                              get broadcastSending() {
                                                return a(Qs);
                                              },
                                              get showDelete() {
                                                return a(As);
                                              },
                                              showDeleteSeparator: !1,
                                              get deletionSending() {
                                                return a(Ws);
                                              },
                                              onCopyPointerDown: (Aa) => ae.captureCopyPointerPosition(a(Y), Aa),
                                              onCopyNevent: (Aa) => void ae.handleCopyNevent(a(Y), Aa),
                                              get externalClientLabel() {
                                                return a(Js);
                                              },
                                              onOpenExternalClient: () => _e(a(Y)),
                                              onShowRawJson: () => Ur(a(Y).rawEvent),
                                              onBroadcastPointerDown: (Aa) => pr(a(Y), Aa),
                                              onBroadcastPost: (Aa) => void Jn(a(Y), Aa),
                                              onOpenDeleteConfirm: () => ya(a(Y))
                                            });
                                          }
                                          k(jn), ge((la) => W(ei, la), [() => Ro(a(Y).postedAt, n())]), D(Mn, jn);
                                        },
                                        $$slots: { default: !0 }
                                      });
                                    }), D(Ct, wt);
                                  },
                                  $$slots: { default: !0 }
                                });
                              }), D(Gt, yn);
                            },
                            $$slots: { default: !0 }
                          });
                        });
                      }
                      ge((Tn) => W(Ut, Tn), [() => $i(a(Y).postedAt)]), D(Ue, qt);
                    }, An = S(() => !(y() || x() || Mt.shouldCollapsePost(a(Y))));
                    be(en, (Ue) => {
                      a(An) && Ue(gn);
                    });
                  }
                  k(qn), k(Be), D(Ye, Be);
                }, sr = S(() => a(Y).kind === 42 || a(Y).deletedAt || Nr(a(Y)) || !(y() || x() || Mt.shouldCollapsePost(a(Y))));
                be(_n, (Ye) => {
                  a(sr) && Ye(Xt);
                });
              }
              var or = F(_n, 2);
              {
                let Ye = S(ie);
                zi(or, {
                  get state() {
                    return a(lt);
                  },
                  section: "parent",
                  get previewModelByEventId() {
                    return a(Qn);
                  },
                  get emojiLoadStateByUrl() {
                    return Yt.emojiLoadStateByUrl;
                  },
                  get emojiImageMetaByUrl() {
                    return Yt.emojiImageMetaByUrl;
                  },
                  get scrollRoot() {
                    return a(Je);
                  },
                  onImageOpen: Ba,
                  onToggleParent: () => Le.preserveThreadParentToggleScroll(a(Y).eventId, a(Y).eventId, () => te.toggleParent(a(Y))),
                  onRetryParent: () => te.retryParent(a(Y)),
                  onToggleNodeParent: (Be) => Le.preserveThreadParentToggleScroll(a(Y).eventId, Be, () => te.toggleNodeParent(a(Y), Be)),
                  onRetryNodeParent: (Be) => te.retryNodeParent(a(Y), Be),
                  onToggleNodeChildren: (Be) => te.toggleNodeChildren(a(Y), Be),
                  onRetryNodeChildren: (Be) => te.retryNodeChildren(a(Y), Be),
                  onCopyPointerDown: H,
                  onCopyNevent: j,
                  get externalClientLabel() {
                    return a(Ye);
                  },
                  onOpenExternalClient: B,
                  isCopyFailed: d,
                  onShowRawJson: Rt,
                  onBroadcastPointerDown: xe,
                  onBroadcastPost: He,
                  isBroadcastSending: v,
                  canDeleteNodePost: Te,
                  isDeletionSending: $e,
                  onOpenDeleteConfirm: Oe
                });
              }
              var Zn = F(or, 2), En = T(Zn), yr = T(En);
              {
                const Ye = (qn) => {
                  var mr = ke(), ea = Z(mr);
                  {
                    var Dn = (gn) => {
                      {
                        let An = S(() => Mt.isPostExpanded(a(Y))), Ue = S(() => "post-preview-content-" + a(Y).eventId);
                        Xh(gn, {
                          get expanded() {
                            return a(An);
                          },
                          get controls() {
                            return a(Ue);
                          },
                          onToggle: () => Mt.togglePostExpanded(a(Y).eventId)
                        });
                      }
                    }, en = S(() => Ra(a(Y)) && Mt.shouldCollapsePost(a(Y)));
                    be(ea, (gn) => {
                      a(en) && gn(Dn);
                    });
                  }
                  D(qn, mr);
                };
                let Be = S(() => Er(a(Y))), Jt = S(() => "post-preview-content-" + a(Y).eventId), kn = S(() => !Mt.isPostExpanded(a(Y)) && Mt.shouldCollapsePost(a(Y)));
                Pc(yr, {
                  get model() {
                    return a(Be);
                  },
                  density: "standard",
                  get emojiLoadStateByUrl() {
                    return Yt.emojiLoadStateByUrl;
                  },
                  get emojiImageMetaByUrl() {
                    return Yt.emojiImageMetaByUrl;
                  },
                  get scrollRoot() {
                    return a(Je);
                  },
                  get previewCollapseAction() {
                    return Mt.previewRef;
                  },
                  get previewCollapseEventId() {
                    return a(Y).eventId;
                  },
                  get previewContentId() {
                    return a(Jt);
                  },
                  get isTextCollapsed() {
                    return a(kn);
                  },
                  onImageOpen: Ba,
                  betweenContentAndMedia: Ye,
                  $$slots: { betweenContentAndMedia: !0 }
                });
              }
              var Qr = F(yr, 2);
              {
                var ia = (Ye) => {
                  var Be = J0();
                  da(Be, 21, () => va(a(Y)), (Jt) => Jt.eventId, (Jt, kn) => {
                    {
                      const qn = (ea) => {
                        var Dn = ke(), en = Z(Dn);
                        {
                          var gn = (An) => {
                            const Ue = S(() => is(a(kn).event)), qt = S(() => Sr(a(Y).eventId, a(Ue).eventId)), yt = S(() => r()("common.showActions"));
                            {
                              const Ut = (tn) => {
                                {
                                  let Vt = S(() => ae.copyState[a(Ue).eventId] === "failed"), Gt = S(() => Dr(a(Ue))), Un = S(() => kr(a(Ue))), yn = S(() => qr(a(Ue))), Et = S(() => xr(a(Ue))), mn = S(ie);
                                  lo(tn, {
                                    order: "standard",
                                    get copyFailed() {
                                      return a(Vt);
                                    },
                                    get showBroadcast() {
                                      return a(Gt);
                                    },
                                    get broadcastSending() {
                                      return a(Un);
                                    },
                                    get showDelete() {
                                      return a(yn);
                                    },
                                    showDeleteSeparator: !0,
                                    get deletionSending() {
                                      return a(Et);
                                    },
                                    onCopyPointerDown: (kt) => ae.captureCopyPointerPosition(a(Ue), kt),
                                    onCopyNevent: (kt) => void ae.handleCopyNevent(a(Ue), kt),
                                    get externalClientLabel() {
                                      return a(mn);
                                    },
                                    onOpenExternalClient: () => _e(a(Ue)),
                                    onShowRawJson: () => Ur(a(Ue).rawEvent),
                                    onBroadcastPointerDown: (kt) => pr(a(Ue), kt),
                                    onBroadcastPost: (kt) => void Jn(a(Ue), kt),
                                    onOpenDeleteConfirm: () => ya(a(Ue))
                                  });
                                }
                              };
                              let cn = S(() => fe.isPostMenuOpen(a(qt))), Tn = S(() => Ro(a(Ue).postedAt, n()));
                              qi(An, {
                                get open() {
                                  return a(cn);
                                },
                                onOpenChange: (tn) => Ir(a(qt), tn),
                                get triggerAriaLabel() {
                                  return a(yt);
                                },
                                get tooltipContent() {
                                  return a(yt);
                                },
                                enableTooltip: !0,
                                get timestamp() {
                                  return a(Tn);
                                },
                                items: Ut,
                                $$slots: { items: !0 }
                              });
                            }
                          };
                          be(en, (An) => {
                            a(kn).status === "resolved" && An(gn);
                          });
                        }
                        D(ea, Dn);
                      };
                      let mr = S(() => a(kn).status === "resolved" ? a(Qn)[a(kn).event.id] : void 0);
                      Tu(Jt, {
                        get preview() {
                          return a(kn);
                        },
                        get model() {
                          return a(mr);
                        },
                        get emojiLoadStateByUrl() {
                          return Yt.emojiLoadStateByUrl;
                        },
                        get emojiImageMetaByUrl() {
                          return Yt.emojiImageMetaByUrl;
                        },
                        get scrollRoot() {
                          return a(Je);
                        },
                        onImageOpen: Ba,
                        onRetry: () => pe.retryQuotePreview(a(kn).eventId),
                        footerMenu: qn,
                        $$slots: { footerMenu: !0 }
                      });
                    }
                  }), k(Be), D(Ye, Be);
                }, ms = S(() => va(a(Y)).length > 0);
                be(Qr, (Ye) => {
                  a(ms) && Ye(ia);
                });
              }
              k(En);
              var Da = F(En, 2);
              {
                var Ft = (Ye) => {
                  const Be = S(() => _a(a(Y))), Jt = S(() => a(lt).repliesActionState.status === "loaded" && a(lt).repliesActionState.replyCount > 0);
                  var kn = vb(), qn = Z(kn);
                  {
                    const en = (qt) => {
                      var yt = eb(), Ut = Z(yt), cn = T(Ut);
                      {
                        var Tn = (We) => {
                          {
                            let Ct = S(() => r()("replyQuote.reply_label")), nn = S(() => r()("replyQuote.reply_label"));
                            di(We, {
                              type: "button",
                              className: "post-preview-action-button post-history-action-button",
                              get ariaLabel() {
                                return a(Ct);
                              },
                              contentLayout: "icon",
                              shape: "circle",
                              onClick: () => dt(a(Y)),
                              get tooltipContent() {
                                return a(nn);
                              },
                              children: (wt, jt) => {
                                var pt = G0();
                                D(wt, pt);
                              },
                              $$slots: { default: !0 }
                            });
                          }
                        };
                        be(cn, (We) => {
                          y() && We(Tn);
                        });
                      }
                      var tn = F(cn, 2), Vt = T(tn);
                      {
                        var Gt = (We) => {
                          zl(We, {
                            get count() {
                              return a(lt).repliesActionState.replyCount;
                            },
                            get selected() {
                              return a(lt).repliesActionState.visible;
                            },
                            get ariaLabel() {
                              return a(Be);
                            },
                            get tooltipContent() {
                              return a(Be);
                            },
                            onClick: () => ga(a(Y))
                          });
                        };
                        be(Vt, (We) => {
                          a(Jt) && We(Gt);
                        });
                      }
                      k(tn), k(Ut);
                      var Un = F(Ut, 2);
                      {
                        var yn = (We) => {
                          {
                            let Ct = S(() => r()("replyQuote.quote_label")), nn = S(() => r()("replyQuote.quote_label"));
                            di(We, {
                              type: "button",
                              className: "post-preview-action-button post-history-action-button",
                              get ariaLabel() {
                                return a(Ct);
                              },
                              contentLayout: "icon",
                              shape: "circle",
                              onClick: () => ft(a(Y)),
                              get tooltipContent() {
                                return a(nn);
                              },
                              children: (wt, jt) => {
                                var pt = Z0();
                                D(wt, pt);
                              },
                              $$slots: { default: !0 }
                            });
                          }
                        };
                        be(Un, (We) => {
                          x() && We(yn);
                        });
                      }
                      var Et = F(Un, 2), mn = T(Et);
                      {
                        var kt = (We) => {
                          {
                            let Ct = S(() => Br(a(Y))), nn = S(() => sa(a(Y))), wt = S(() => Br(a(Y)));
                            di(We, {
                              type: "button",
                              className: "post-preview-reactions-button",
                              get ariaLabel() {
                                return a(Ct);
                              },
                              shape: "pill",
                              get selected() {
                                return a(nn);
                              },
                              onClick: () => pa(a(Y)),
                              get tooltipContent() {
                                return a(wt);
                              },
                              children: (jt, pt) => {
                                var Vn = X0(), Mn = F(Z(Vn), 2), ta = T(Mn, !0);
                                k(Mn), ge(() => W(ta, a(lt).reactionSummary.totalCount)), D(jt, Vn);
                              },
                              $$slots: { default: !0 }
                            });
                          }
                        };
                        be(mn, (We) => {
                          a(lt).reactionSummary.totalCount > 0 && We(kt);
                        });
                      }
                      k(Et), D(qt, yt);
                    }, gn = (qt) => {
                      const yt = S(() => r()("common.showActions"));
                      {
                        const Ut = (tn) => {
                          var Vt = ab(), Gt = Z(Vt);
                          Ae(Gt, () => Kn, (We, Ct) => {
                            Ct(We, {
                              class: "menu-action-button",
                              onSelect: () => _e(a(Y)),
                              children: (nn, wt) => {
                                var jt = tb(), pt = F(Z(jt), 2), Vn = T(pt, !0);
                                k(pt), ge((Mn) => W(Vn, Mn), [() => ie()]), D(nn, jt);
                              },
                              $$slots: { default: !0 }
                            });
                          });
                          var Un = F(Gt, 2);
                          Ae(Un, () => Ma, (We, Ct) => {
                            Ct(We, { class: "post-history-menu-separator" });
                          });
                          var yn = F(Un, 2);
                          {
                            let We = S(() => a(lt).repliesActionState.status === "loading");
                            Ae(yn, () => Kn, (Ct, nn) => {
                              nn(Ct, {
                                class: "menu-action-button",
                                get disabled() {
                                  return a(We);
                                },
                                onSelect: () => ga(a(Y)),
                                children: (wt, jt) => {
                                  var pt = nb(), Vn = Z(pt), Mn = F(Vn, 2), ta = T(Mn, !0);
                                  k(Mn), ge(() => {
                                    Ha(Vn, 1, `${a(lt).repliesActionState.visible ? "collapse-content-icon" : "find_in_page-icon"} svg-icon`, "svelte-uxr0i8"), W(ta, a(Be));
                                  }), D(wt, pt);
                                },
                                $$slots: { default: !0 }
                              });
                            });
                          }
                          var Et = F(yn, 2);
                          {
                            var mn = (We) => {
                              var Ct = ke(), nn = Z(Ct);
                              Ae(nn, () => Kn, (wt, jt) => {
                                jt(wt, {
                                  class: "menu-action-button",
                                  onSelect: () => void Vr(a(Y)),
                                  children: (pt, Vn) => {
                                    var Mn = rb(), ta = F(Z(Mn), 2), jn = T(ta, !0);
                                    k(ta), ge((Mr) => W(jn, Mr), [() => r()("postHistory.jumpToPostDate")]), D(pt, Mn);
                                  },
                                  $$slots: { default: !0 }
                                });
                              }), D(We, Ct);
                            };
                            be(Et, (We) => {
                              O.isSearchMode && We(mn);
                            });
                          }
                          var kt = F(Et, 2);
                          {
                            let We = S(() => ae.copyState[a(Y).eventId] === "failed"), Ct = S(() => Dr(a(Y))), nn = S(() => kr(a(Y))), wt = S(() => qr(a(Y))), jt = S(() => xr(a(Y)));
                            lo(kt, {
                              order: "standard",
                              get copyFailed() {
                                return a(We);
                              },
                              get showBroadcast() {
                                return a(Ct);
                              },
                              get broadcastSending() {
                                return a(nn);
                              },
                              get showDelete() {
                                return a(wt);
                              },
                              showDeleteSeparator: !0,
                              get deletionSending() {
                                return a(jt);
                              },
                              onCopyPointerDown: (pt) => ae.captureCopyPointerPosition(a(Y), pt),
                              onCopyNevent: (pt) => void ae.handleCopyNevent(a(Y), pt),
                              onShowRawJson: () => Ur(a(Y).rawEvent),
                              onBroadcastPointerDown: (pt) => pr(a(Y), pt),
                              onBroadcastPost: (pt) => void Jn(a(Y), pt),
                              onOpenDeleteConfirm: () => ya(a(Y))
                            });
                          }
                          D(tn, Vt);
                        };
                        let cn = S(() => fe.isPostMenuOpen(a(Y).eventId)), Tn = S(() => Ro(a(Y).postedAt, n()));
                        qi(qt, {
                          get open() {
                            return a(cn);
                          },
                          onOpenChange: (tn) => Ir(a(Y).eventId, tn),
                          get triggerAriaLabel() {
                            return a(yt);
                          },
                          get tooltipContent() {
                            return a(yt);
                          },
                          enableTooltip: !0,
                          get timestamp() {
                            return a(Tn);
                          },
                          items: Ut,
                          $$slots: { items: !0 }
                        });
                      }
                    };
                    let An = S(() => $i(a(Y).postedAt)), Ue = S(() => !!a(Y).deletedAt);
                    qc(qn, {
                      get formattedDate() {
                        return a(An);
                      },
                      get dimmed() {
                        return a(Ue);
                      },
                      actions: en,
                      trailing: gn,
                      $$slots: { actions: !0, trailing: !0 }
                    });
                  }
                  var mr = F(qn, 2);
                  {
                    var ea = (en) => {
                      var gn = fb();
                      da(gn, 21, () => on(a(Y)), (An) => An.content, (An, Ue) => {
                        var qt = hb(), yt = T(qt), Ut = T(yt);
                        {
                          var cn = (Et) => {
                            var mn = sb();
                            D(Et, mn);
                          }, Tn = S(() => Ym(a(Ue).content)), tn = (Et) => {
                            var mn = ke(), kt = Z(mn);
                            {
                              var We = (wt) => {
                                var jt = ob(), pt = T(jt, !0);
                                k(jt), ge(() => W(pt, a(Ue).content)), D(wt, jt);
                              }, Ct = S(() => Nt(a(Ue).emojiUrl)), nn = (wt) => {
                                var jt = db(), pt = T(jt);
                                {
                                  var Vn = (jn) => {
                                    var Mr = ib();
                                    ge(() => {
                                      Cn(Mr, "src", a(Ue).emojiUrl), Cn(Mr, "alt", a(Ue).content), Cn(Mr, "title", a(Ue).content);
                                    }), D(jn, Mr);
                                  }, Mn = S(() => ur(a(Ue).emojiUrl)), ta = (jn) => {
                                    var Mr = lb();
                                    D(jn, Mr);
                                  };
                                  be(pt, (jn) => {
                                    a(Mn) ? jn(Vn) : jn(ta, -1);
                                  });
                                }
                                k(jt), ge((jn) => zo(jt, jn), [
                                  () => an(a(Ue).emojiUrl)
                                ]), D(wt, jt);
                              };
                              be(kt, (wt) => {
                                a(Ct) ? wt(We) : wt(nn, -1);
                              });
                            }
                            D(Et, mn);
                          }, Vt = (Et) => {
                            var mn = cb(), kt = T(mn, !0);
                            k(mn), ge(() => W(kt, a(Ue).content)), D(Et, mn);
                          };
                          be(Ut, (Et) => {
                            a(Tn) ? Et(cn) : a(Ue).emojiUrl ? Et(tn, 1) : Et(Vt, -1);
                          });
                        }
                        var Gt = F(Ut, 2), Un = T(Gt, !0);
                        k(Gt), k(yt);
                        var yn = F(yt, 2);
                        da(yn, 21, () => a(Ue).reactors, (Et) => Et.eventId, (Et, mn) => {
                          const kt = S(() => ss(a(mn)));
                          var We = ub(), Ct = T(We);
                          {
                            let nn = S(() => a(mn).profile?.picture || "");
                            Yh(Ct, {
                              get src() {
                                return a(nn);
                              },
                              get alt() {
                                return a(kt);
                              },
                              rootClassName: "post-preview-reaction-avatar",
                              imageClassName: "post-preview-reaction-avatar-image",
                              fallbackClassName: "post-preview-reaction-avatar-fallback",
                              get fallbackAriaLabel() {
                                return a(kt);
                              },
                              fallbackDelayMs: 0
                            });
                          }
                          k(We), ge(() => {
                            Cn(We, "title", a(kt)), Cn(We, "aria-label", a(kt));
                          }), D(Et, We);
                        }), k(yn), k(qt), ge(() => W(Un, a(Ue).count)), D(An, qt);
                      }), k(gn), D(en, gn);
                    }, Dn = S(() => a(lt).reactionSummary.totalCount > 0 && sa(a(Y)));
                    be(mr, (en) => {
                      a(Dn) && en(ea);
                    });
                  }
                  D(Ye, kn);
                }, Lt = S(() => y() || x() || Mt.shouldCollapsePost(a(Y)) || Dr(a(Y)) || a(lt).reactionSummary.totalCount > 0 || a(lt).repliesActionState.status === "loaded" && a(lt).repliesActionState.replyCount > 0);
                be(Da, (Ye) => {
                  a(Lt) && Ye(Ft);
                });
              }
              var vn = F(Da, 2);
              {
                let Ye = S(ie);
                zi(vn, {
                  get state() {
                    return a(lt);
                  },
                  section: "children",
                  get previewModelByEventId() {
                    return a(Qn);
                  },
                  get emojiLoadStateByUrl() {
                    return Yt.emojiLoadStateByUrl;
                  },
                  get emojiImageMetaByUrl() {
                    return Yt.emojiImageMetaByUrl;
                  },
                  get scrollRoot() {
                    return a(Je);
                  },
                  onImageOpen: Ba,
                  onToggleNodeParent: (Be) => Le.preserveThreadParentToggleScroll(a(Y).eventId, Be, () => te.toggleNodeParent(a(Y), Be)),
                  onRetryNodeParent: (Be) => te.retryNodeParent(a(Y), Be),
                  onToggleNodeChildren: (Be) => te.toggleNodeChildren(a(Y), Be),
                  onRetryNodeChildren: (Be) => te.retryNodeChildren(a(Y), Be),
                  onCopyPointerDown: H,
                  onCopyNevent: j,
                  get externalClientLabel() {
                    return a(Ye);
                  },
                  onOpenExternalClient: B,
                  isCopyFailed: d,
                  onShowRawJson: Rt,
                  onBroadcastPointerDown: xe,
                  onBroadcastPost: He,
                  isBroadcastSending: v,
                  canDeleteNodePost: Te,
                  isDeletionSending: $e,
                  onOpenDeleteConfirm: Oe
                });
              }
              k(Zn), k(At);
              var pn = F(At, 2);
              {
                var ir = (Ye) => {
                  var Be = yb(), Jt = T(Be);
                  {
                    var kn = (Dn) => {
                      var en = pb(), gn = T(en, !0);
                      k(en), ge((An) => W(gn, An), [() => r()("postHistory.deletedBadge")]), D(Dn, en);
                    };
                    be(Jt, (Dn) => {
                      a(Y).deletedAt && Dn(kn);
                    });
                  }
                  var qn = F(Jt, 2);
                  {
                    var mr = (Dn) => {
                      var en = gb(), gn = T(en, !0);
                      k(en), ge((An) => W(gn, An), [() => r()("postHistory.deleteFailed")]), D(Dn, en);
                    }, ea = S(() => Nr(a(Y)));
                    be(qn, (Dn) => {
                      a(ea) && Dn(mr);
                    });
                  }
                  k(Be), D(Ye, Be);
                }, Ht = S(() => !(y() || Mt.shouldCollapsePost(a(Y))) && (a(Y).deletedAt || Nr(a(Y))));
                be(pn, (Ye) => {
                  a(Ht) && Ye(ir);
                });
              }
              k(Bn), k(Wt), ge(() => {
                Dt = Ha(Wt, 1, "post-history-item svelte-uxr0i8", null, Dt, { "post-history-item-deleted": !!a(Y).deletedAt }), Cn(Wt, "data-post-history-event-id", a(Y).eventId), Cn(Wt, "data-post-history-posted-at", a(Y).postedAt), Cn(Zn, "data-post-history-thread-anchor-scope-id", a(Y).eventId), Cn(Zn, "data-post-history-thread-anchor-event-id", a(Y).eventId);
              }), D(Ke, Wt);
            }), k(Ot);
            var rr = F(Ot, 2);
            {
              var zr = (Ke) => {
                var Y = bb(), lt = T(Y), Wt = T(lt, !0);
                k(lt);
                var Dt = F(lt, 2), Bn = T(Dt, !0);
                k(Dt), k(Y), ge(
                  (At, _n) => {
                    W(Wt, At), W(Bn, _n);
                  },
                  [
                    () => r()("postHistory.savedOlderPostsShowing"),
                    () => r()("postHistory.savedOlderPostsGapNotice")
                  ]
                ), D(Ke, Y);
              };
              be(rr, (Ke) => {
                O.isShowingSavedOlderPosts && Ke(zr);
              });
            }
            var Rn = F(rr, 2);
            {
              var dn = (Ke) => {
                var Y = Pb(), lt = T(Y), Wt = T(lt);
                {
                  var Dt = (At) => {
                    {
                      let _n = S(() => O.isFetchingFromRelays || O.isRefetchingAroundCurrentView);
                      lr(At, {
                        type: "button",
                        variant: "primary",
                        className: "post-history-nav-button",
                        contentLayout: "iconText",
                        get disabled() {
                          return a(_n);
                        },
                        onClick: () => void aa(),
                        children: (Xt, sr) => {
                          var or = Cb(), Zn = F(Z(or));
                          ge((En) => W(Zn, ` ${En ?? ""}`), [() => r()("postHistory.fetchOlderFromRelays")]), D(Xt, or);
                        },
                        $$slots: { default: !0 }
                      });
                    }
                  };
                  be(Wt, (At) => {
                    (O.canFetchOlderFromRelays || O.isFetchingFromRelays) && At(Dt);
                  });
                }
                var Bn = F(Wt, 2);
                lr(Bn, {
                  type: "button",
                  variant: "default",
                  className: "post-history-nav-button",
                  contentLayout: "iconText",
                  onClick: () => void $r(),
                  children: (At, _n) => {
                    var Xt = wb(), sr = F(Z(Xt));
                    ge((or) => W(sr, ` ${or ?? ""}`), [() => r()("postHistory.showSavedOlderPosts")]), D(At, Xt);
                  },
                  $$slots: { default: !0 }
                }), k(lt), k(Y), D(Ke, Y);
              }, ar = (Ke) => {
                var Y = Sb(), lt = T(Y);
                {
                  let Wt = S(() => !O.canLoadOlder);
                  lr(lt, {
                    type: "button",
                    variant: "default",
                    className: "post-history-nav-button",
                    contentLayout: "iconText",
                    get disabled() {
                      return a(Wt);
                    },
                    onClick: () => void ha(),
                    children: (Dt, Bn) => {
                      var At = xb(), _n = F(Z(At));
                      ge((Xt) => W(_n, ` ${Xt ?? ""}`), [() => er()]), D(Dt, At);
                    },
                    $$slots: { default: !0 }
                  });
                }
                k(Y), D(Ke, Y);
              }, Qt = (Ke) => {
                var Y = Rb(), lt = T(Y);
                {
                  var Wt = (Dt) => {
                    {
                      let Bn = S(() => O.isFetchingFromRelays || O.isRefetchingAroundCurrentView);
                      lr(Dt, {
                        type: "button",
                        variant: "primary",
                        className: "post-history-nav-button",
                        contentLayout: "iconText",
                        get disabled() {
                          return a(Bn);
                        },
                        onClick: () => void aa(),
                        children: (At, _n) => {
                          var Xt = ke(), sr = Z(Xt);
                          {
                            var or = (En) => {
                              {
                                let yr = S(() => r()("postHistory.fetchOlderFromRelaysLoading"));
                                Gs(En, {
                                  get text() {
                                    return a(yr);
                                  },
                                  showLoader: !0,
                                  loaderSize: 28,
                                  customClass: "post-history-nav-loading-placeholder"
                                });
                              }
                            }, Zn = (En) => {
                              var yr = Ib(), Qr = F(Z(yr));
                              ge((ia) => W(Qr, ` ${ia ?? ""}`), [() => r()("postHistory.fetchOlderFromRelays")]), D(En, yr);
                            };
                            be(sr, (En) => {
                              O.isFetchingOlderFromRelays ? En(or) : En(Zn, -1);
                            });
                          }
                          D(At, Xt);
                        },
                        $$slots: { default: !0 }
                      });
                    }
                  };
                  be(lt, (Dt) => {
                    (O.canFetchOlderFromRelays || O.isFetchingFromRelays || O.isRefetchingAroundCurrentView) && Dt(Wt);
                  });
                }
                k(Y), D(Ke, Y);
              };
              be(Rn, (Ke) => {
                O.showSavedPostsBoundary ? Ke(dn) : (O.isSearchMode ? O.canLoadOlder : O.state.hasOlderLocal) ? Ke(ar, 1) : O.showLocalExhaustedState && Ke(Qt, 2);
              });
            }
            D(qe, ze);
          };
          be(Ka, (qe) => {
            O.posts.length === 0 && a(bt) ? qe(Ya) : a(_r) ? qe(Xr, 1) : qe(gs, -1);
          });
        }
        k(Zt), Ni(Zt, (qe) => w(Je, qe), () => a(Je));
        var ys = F(Zt, 2);
        {
          var Ds = (qe) => {
            var ze = kb(), vt = T(ze);
            {
              let fn = S(() => r()("postHistory.returnToLatest"));
              lr(vt, {
                type: "button",
                variant: "default",
                shape: "circle",
                className: "post-history-latest-button",
                contentLayout: "icon",
                get ariaLabel() {
                  return a(fn);
                },
                onClick: () => void fa(),
                children: (Ot, rr) => {
                  var zr = Eb();
                  D(Ot, zr);
                },
                $$slots: { default: !0 }
              });
            }
            k(ze), D(qe, ze);
          };
          be(ys, (qe) => {
            a(hr) && qe(Ds);
          });
        }
        var Ys = F(ys, 2);
        Mu(Ys, {
          get open() {
            return a(N);
          },
          get ownerPubkeyHex() {
            return f();
          },
          getCurrentPubkeyHex: () => f(),
          onOpenChange: (qe) => w(N, qe, !0),
          onImported: Us
        });
        var ad = F(Ys, 2);
        Gh(ad, {
          get open() {
            return a(ut);
          },
          get rawEvent() {
            return a(ue);
          },
          onOpenChange: (qe) => w(ut, qe, !0)
        }), ge(() => Cn(Zt, "aria-busy", a(ht) ? "true" : "false")), so("scroll", Zt, function(...qe) {
          Le.handleHistoryScroll?.apply(this, qe);
        }), D(ye, gt);
      },
      $$slots: { footer: !0, default: !0 }
    });
  }
  var p = F(Gr, 2);
  {
    const h = (Ge) => {
      var it = Ab(), In = T(it), nr = T(In, !0);
      k(In);
      var Kr = F(In, 2), gr = T(Kr, !0);
      k(Kr), k(it), ge(
        (Zr, Yr) => {
          W(nr, Zr), W(gr, Yr);
        },
        [
          () => r()("postHistory.deleteRequestDescription"),
          () => r()("postHistory.deleteRequestWarning")
        ]
      ), D(Ge, it);
    };
    let L = S(() => r()("postHistory.deleteRequestTitle")), oe = S(() => r()("postHistory.deleteRequestDescription")), ye = S(() => fe.deleteTargetPost && xr(fe.deleteTargetPost) ? r()("postHistory.deleteSending") : r()("postHistory.deleteConfirm")), je = S(() => r()("postHistory.deleteCancel")), gt = S(() => fe.deleteTargetPost ? xr(fe.deleteTargetPost) : !1);
    hd(p, {
      get open() {
        return fe.deleteConfirmOpen;
      },
      get onOpenChange() {
        return fe.setDeleteConfirmOpen;
      },
      get title() {
        return a(L);
      },
      get description() {
        return a(oe);
      },
      get confirmLabel() {
        return a(ye);
      },
      get cancelLabel() {
        return a(je);
      },
      confirmVariant: "danger",
      get confirmDisabled() {
        return a(gt);
      },
      onConfirm: js,
      onCancel: Bt,
      contentClass: "post-history-delete-confirm",
      children: h,
      $$slots: { default: !0 }
    });
  }
  var P = F(p, 2);
  {
    const h = (gt) => {
      var Ge = Tb(), it = T(Ge), In = T(it, !0);
      k(it), k(Ge), ge((nr) => W(In, nr), [() => r()("postHistory.deleteLocalHistoryDescription")]), D(gt, Ge);
    };
    let L = S(() => r()("postHistory.deleteLocalHistoryTitle")), oe = S(() => r()("postHistory.deleteLocalHistoryDescription")), ye = S(() => r()("postHistory.deleteLocalHistoryConfirm")), je = S(() => r()("postHistory.deleteLocalHistoryCancel"));
    hd(P, {
      get title() {
        return a(L);
      },
      get description() {
        return a(oe);
      },
      get confirmLabel() {
        return a(ye);
      },
      get cancelLabel() {
        return a(je);
      },
      confirmVariant: "danger",
      onConfirm: ks,
      onCancel: Es,
      closeOnConfirm: !1,
      preventCloseWhileConfirming: !0,
      showConfirmSpinner: !0,
      contentClass: "post-history-local-delete-confirm",
      get open() {
        return a(Me);
      },
      set open(gt) {
        w(Me, gt, !0);
      },
      children: h,
      $$slots: { default: !0 }
    });
  }
  var A = F(P, 2);
  {
    let h = S(() => a(et)[a(Qe)]?.src ?? ""), L = S(() => a(et)[a(Qe)]?.alt ?? "");
    qh(A, {
      get src() {
        return a(h);
      },
      get alt() {
        return a(L);
      },
      onClose: hs,
      get mediaList() {
        return a(et);
      },
      get currentIndex() {
        return a(Qe);
      },
      onNavigate: us,
      get show() {
        return a(tt);
      },
      set show(oe) {
        w(tt, oe, !0);
      }
    });
  }
  var U = F(A, 2);
  li(U, {
    get show() {
      return ae.showCopyFloatingMessage;
    },
    get x() {
      return ae.copyFloatingMessageX;
    },
    get y() {
      return ae.copyFloatingMessageY;
    },
    children: (h, L) => {
      var oe = Mb(), ye = T(oe, !0);
      k(oe), ge((je) => W(ye, je), [() => r()("postHistory.copied")]), D(h, oe);
    },
    $$slots: { default: !0 }
  });
  var K = F(U, 2);
  li(K, {
    get show() {
      return a(re);
    },
    get x() {
      return a(at);
    },
    get y() {
      return a(mt);
    },
    children: (h, L) => {
      var oe = Ob(), ye = T(oe, !0);
      k(oe), ge((je) => W(ye, je), [() => r()(a(nt))]), D(h, oe);
    },
    $$slots: { default: !0 }
  });
  var he = F(K, 2);
  li(he, {
    get show() {
      return a(se);
    },
    variant: "top-right",
    children: (h, L) => {
      var oe = Fb(), ye = T(oe, !0);
      k(oe), ge((je) => W(ye, je), [
        () => r()(a(q), { values: a(Fe) })
      ]), D(h, oe);
    },
    $$slots: { default: !0 }
  }), D(t, qa);
  var ve = St(Ks);
  return s(), ve;
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
