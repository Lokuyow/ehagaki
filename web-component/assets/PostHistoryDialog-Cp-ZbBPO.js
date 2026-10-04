import { ce as Ra, cf as ea, cg as yh, ch as Tc, ci as ya, aO as Oc, cj as fi, ck as gi, cl as Ts, cm as Os, cn as Lc, aN as Fc, co as vi, cp as Hc, aM as Za, cq as _i, cr as wd, aT as Nc, aL as vn, cs as mh, aJ as pi, ct as $c, aK as fr, cu as ml, ai as Bc, aQ as To, cv as bl, I as S, aW as on, aU as Me, K as be, aX as Yt, aY as $r, aZ as Pr, a_ as wr, cw as bh, cx as Ch, cy as yi, cz as tl, cA as Uc, cB as nl, cC as Ph, bl as wh, b6 as es, aV as oo, cD as xh, cE as Rh, b3 as Oe, cF as Sh, cc as Ih, ca as _h, H as Lo, Q as La, V as Ca, $ as Fa, cG as qc, cH as rl, cI as ol, bi as Eh, N as cr, M as ko, aF as ar, a4 as lt, cJ as Ls, A as Ah, c4 as ts, L as Rs, O as Vc, cK as Dh, cL as kh, cM as Mh, cb as Gs, cN as Th, cO as Oh, cP as Lh, cQ as Fh, cR as Zs, W as Jo, cS as Hh, cT as Nh, cU as $h, cV as Bh, bd as Uh, cW as ni, cX as qh, w as jc, cY as Kc, cZ as Yc, c_ as Qc, c$ as Cl, d0 as al, d1 as Vh, d2 as jh, d3 as Ja, d4 as Xs, d5 as Kh, d6 as zc, d7 as Pl, d8 as wl, d9 as Yh, da as xd, db as Qh, dc as Wc, dd as Rd, de as zh, df as Ei, dg as Ai, dh as Jc, di as Wh, dj as Jh, dk as Gh, dl as Gc, dm as Zh, dn as Xh, dp as Di, dq as ef, dr as ka, ds as tf, dt as nf, du as rf, dv as of, dw as af, dx as sf, dy as va, dz as lf, dA as Sd, dB as df, dC as cf, dD as Zc, dE as mi, dF as xl, dG as uf, b1 as hf, dH as ff, aG as Id, am as gf, aH as ki, dI as _d, dJ as Ed, bM as vf, S as Ea, bc as pf, dK as yf, dL as mf, s as Ad, bg as bf } from "./App-C8cvgCUG.js";
import { aO as Xe, u as so, aS as P, a as r, b as g, aT as me, aK as ur, a$ as Cf, b7 as Br, b0 as Qt, b1 as Pe, b2 as J, b3 as D, b4 as zt, b5 as R, ba as Q, b8 as T, n as hr, bh as ta, Z as Ie, bi as te, b9 as M, b6 as Wt, bf as H, aP as Xc, bj as Ma, bL as Rl, ap as ei, bD as Ss, aq as eu, bl as tu, bS as nu, b_ as Sl, bQ as ma, bO as bi, bk as Er, bI as ru, bY as Dd, ay as Go, b$ as Pf, bP as wf, bN as xf } from "./entry-B5mD5NTa.js";
import { D as ou, a as au } from "./DialogWrapper-BFdSo4_O.js";
import { M as Gn, a as Zo, P as su, b as sl, c as il, d as ll, e as dl, f as Il, p as Rf, g as Sf, r as If, h as kd, E as _f, s as Ef, u as Af, i as Df, j as kf, k as Mf, l as Tf, m as Md, D as Td, n as Od, o as Of, q as Lf, t as Ld, v as Fd, w as Ff, x as Hf, y as Nf, z as Hd } from "./postBroadcastService-CiTjh9oD.js";
function Mi(t, e) {
  return t - e * Math.floor(t / e);
}
const iu = 1721426;
function Ys(t, e, n, o) {
  e = _l(t, e);
  let i = e - 1, s = -2;
  return n <= 2 ? s = 0 : ti(e) && (s = -1), iu - 1 + 365 * i + Math.floor(i / 4) - Math.floor(i / 100) + Math.floor(i / 400) + Math.floor((367 * n - 362) / 12 + s + o);
}
function ti(t) {
  return t % 4 === 0 && (t % 100 !== 0 || t % 400 === 0);
}
function _l(t, e) {
  return t === "BC" ? 1 - e : e;
}
function $f(t) {
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
class Xa {
  fromJulianDay(e) {
    let n = e, o = n - iu, i = Math.floor(o / 146097), s = Mi(o, 146097), d = Math.floor(s / 36524), c = Mi(s, 36524), u = Math.floor(c / 1461), _ = Mi(c, 1461), v = Math.floor(_ / 365), b = i * 400 + d * 100 + u * 4 + v + (d !== 4 && v !== 4 ? 1 : 0), [x, w] = $f(b), E = n - Ys(x, w, 1, 1), C = 2;
    n < Ys(x, w, 3, 1) ? C = 0 : ti(w) && (C = 1);
    let m = Math.floor(((E + C) * 12 + 373) / 367), a = n - Ys(x, w, m, 1) + 1;
    return new xa(x, w, m, a);
  }
  toJulianDay(e) {
    return Ys(e.era, e.year, e.month, e.day);
  }
  getDaysInMonth(e) {
    return Bf[ti(e.year) ? "leapyear" : "standard"][e.month - 1];
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getMonthsInYear(e) {
    return 12;
  }
  getDaysInYear(e) {
    return ti(e.year) ? 366 : 365;
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
function pa(t, e) {
  return e = Wr(e, t.calendar), t.era === e.era && t.year === e.year && t.month === e.month && t.day === e.day;
}
function El(t, e) {
  return e = Wr(e, t.calendar), t = cl(t), e = cl(e), t.era === e.era && t.year === e.year && t.month === e.month;
}
function qf(t, e) {
  var n, o, i, s;
  return (s = (i = (n = t.isEqual) === null || n === void 0 ? void 0 : n.call(t, e)) !== null && i !== void 0 ? i : (o = e.isEqual) === null || o === void 0 ? void 0 : o.call(e, t)) !== null && s !== void 0 ? s : t.identifier === e.identifier;
}
function Vf(t, e) {
  return pa(t, Kf(e));
}
function lu(t, e, n) {
  let o = t.calendar.toJulianDay(t), i = Wf(e), s = Math.ceil(o + 1 - i) % 7;
  return s < 0 && (s += 7), s;
}
function jf(t) {
  return Mo(Date.now(), t);
}
function Kf(t) {
  return Zf(jf(t));
}
function du(t, e) {
  return t.calendar.toJulianDay(t) - e.calendar.toJulianDay(e);
}
function Yf(t, e) {
  return Nd(t) - Nd(e);
}
function Nd(t) {
  return t.hour * 36e5 + t.minute * 6e4 + t.second * 1e3 + t.millisecond;
}
let Ti = null;
function ba() {
  return Ti == null && (Ti = new Intl.DateTimeFormat().resolvedOptions().timeZone), Ti;
}
function cl(t) {
  return t.subtract({
    days: t.day - 1
  });
}
function Qf(t) {
  return t.add({
    days: t.calendar.getDaysInMonth(t) - t.day
  });
}
const $d = /* @__PURE__ */ new Map(), Oi = /* @__PURE__ */ new Map();
function zf(t) {
  if (Intl.Locale) {
    let n = $d.get(t);
    return n || (n = new Intl.Locale(t).maximize().region, n && $d.set(t, n)), n;
  }
  let e = t.split("-")[1];
  return e === "u" ? void 0 : e;
}
function Wf(t) {
  let e = Oi.get(t);
  if (!e) {
    if (Intl.Locale) {
      let o = new Intl.Locale(t);
      if ("getWeekInfo" in o && (e = o.getWeekInfo(), e))
        return Oi.set(t, e), e.firstDay;
    }
    let n = zf(t);
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
      firstDay: n && Uf[n] || 0
    };
    Oi.set(t, e);
  }
  return e.firstDay;
}
function Pa(t) {
  t = Wr(t, new Xa());
  let e = _l(t.era, t.year);
  return cu(e, t.month, t.day, t.hour, t.minute, t.second, t.millisecond);
}
function cu(t, e, n, o, i, s, d) {
  let c = /* @__PURE__ */ new Date();
  return c.setUTCHours(o, i, s, d), c.setUTCFullYear(t, e - 1, n), c.getTime();
}
function ks(t, e) {
  if (e === "UTC") return 0;
  if (t > 0 && e === ba()) return new Date(t).getTimezoneOffset() * -6e4;
  let { year: n, month: o, day: i, hour: s, minute: d, second: c } = uu(t, e);
  return cu(n, o, i, s, d, c, 0) - Math.floor(t / 1e3) * 1e3;
}
const Bd = /* @__PURE__ */ new Map();
function uu(t, e) {
  let n = Bd.get(e);
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
  }), Bd.set(e, n));
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
const ri = 864e5;
function Jf(t, e) {
  let n = Pa(t), o = n - ks(n - ri, e), i = n - ks(n + ri, e);
  return hu(t, e, o, i);
}
function hu(t, e, n, o) {
  return (n === o ? [
    n
  ] : [
    n,
    o
  ]).filter((s) => Gf(t, e, s));
}
function Gf(t, e, n) {
  let o = uu(n, e);
  return t.year === o.year && t.month === o.month && t.day === o.day && t.hour === o.hour && t.minute === o.minute && t.second === o.second;
}
function Do(t, e, n = "compatible") {
  let o = wa(t);
  if (e === "UTC") return Pa(o);
  if (e === ba() && n === "compatible") {
    o = Wr(o, new Xa());
    let u = /* @__PURE__ */ new Date(), _ = _l(o.era, o.year);
    return u.setFullYear(_, o.month - 1, o.day), u.setHours(o.hour, o.minute, o.second, o.millisecond), u.getTime();
  }
  let i = Pa(o), s = ks(i - ri, e), d = ks(i + ri, e), c = hu(o, e, i - s, i - d);
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
      return Math.min(i - s, i - d);
    // 'compatible' means 'later' for "spring forward" transitions
    case "compatible":
    case "later":
      return Math.max(i - s, i - d);
    case "reject":
      throw new RangeError("No such absolute time found");
  }
}
function fu(t, e, n = "compatible") {
  return new Date(Do(t, e, n));
}
function Mo(t, e) {
  let n = ks(t, e), o = new Date(t + n), i = o.getUTCFullYear(), s = o.getUTCMonth() + 1, d = o.getUTCDate(), c = o.getUTCHours(), u = o.getUTCMinutes(), _ = o.getUTCSeconds(), v = o.getUTCMilliseconds();
  return new Oo(i < 1 ? "BC" : "AD", i < 1 ? -i + 1 : i, s, d, e, n, c, u, _, v);
}
function Zf(t) {
  return new xa(t.calendar, t.era, t.year, t.month, t.day);
}
function wa(t, e) {
  let n = 0, o = 0, i = 0, s = 0;
  if ("timeZone" in t) ({ hour: n, minute: o, second: i, millisecond: s } = t);
  else if ("hour" in t && !e) return t;
  return e && ({ hour: n, minute: o, second: i, millisecond: s } = e), new na(t.calendar, t.era, t.year, t.month, t.day, n, o, i, s);
}
function Wr(t, e) {
  if (qf(t.calendar, e)) return t;
  let n = e.fromJulianDay(t.calendar.toJulianDay(t)), o = t.copy();
  return o.calendar = e, o.era = n.era, o.year = n.year, o.month = n.month, o.day = n.day, Ta(o), o;
}
function Xf(t, e, n) {
  if (t instanceof Oo)
    return t.timeZone === e ? t : tg(t, e);
  let o = Do(t, e, n);
  return Mo(o, e);
}
function eg(t) {
  let e = Pa(t) - t.offset;
  return new Date(e);
}
function tg(t, e) {
  let n = Pa(t) - t.offset;
  return Wr(Mo(n, e), t.calendar);
}
const ys = 36e5;
function Ci(t, e) {
  let n = t.copy(), o = "hour" in n ? ag(n, e) : 0;
  ul(n, e.years || 0), n.calendar.balanceYearMonth && n.calendar.balanceYearMonth(n, t), n.month += e.months || 0, hl(n), gu(n), n.day += (e.weeks || 0) * 7, n.day += e.days || 0, n.day += o, ng(n), n.calendar.balanceDate && n.calendar.balanceDate(n), n.year < 1 && (n.year = 1, n.month = 1, n.day = 1);
  let i = n.calendar.getYearsInEra(n);
  if (n.year > i) {
    var s, d;
    let u = (s = (d = n.calendar).isInverseEra) === null || s === void 0 ? void 0 : s.call(d, n);
    n.year = i, n.month = u ? 1 : n.calendar.getMonthsInYear(n), n.day = u ? 1 : n.calendar.getDaysInMonth(n);
  }
  n.month < 1 && (n.month = 1, n.day = 1);
  let c = n.calendar.getMonthsInYear(n);
  return n.month > c && (n.month = c, n.day = n.calendar.getDaysInMonth(n)), n.day = Math.max(1, Math.min(n.calendar.getDaysInMonth(n), n.day)), n;
}
function ul(t, e) {
  var n, o;
  !((n = (o = t.calendar).isInverseEra) === null || n === void 0) && n.call(o, t) && (e = -e), t.year += e;
}
function hl(t) {
  for (; t.month < 1; )
    ul(t, -1), t.month += t.calendar.getMonthsInYear(t);
  let e = 0;
  for (; t.month > (e = t.calendar.getMonthsInYear(t)); )
    t.month -= e, ul(t, 1);
}
function ng(t) {
  for (; t.day < 1; )
    t.month--, hl(t), t.day += t.calendar.getDaysInMonth(t);
  for (; t.day > t.calendar.getDaysInMonth(t); )
    t.day -= t.calendar.getDaysInMonth(t), t.month++, hl(t);
}
function gu(t) {
  t.month = Math.max(1, Math.min(t.calendar.getMonthsInYear(t), t.month)), t.day = Math.max(1, Math.min(t.calendar.getDaysInMonth(t), t.day));
}
function Ta(t) {
  t.calendar.constrainDate && t.calendar.constrainDate(t), t.year = Math.max(1, Math.min(t.calendar.getYearsInEra(t), t.year)), gu(t);
}
function vu(t) {
  let e = {};
  for (let n in t) typeof t[n] == "number" && (e[n] = -t[n]);
  return e;
}
function pu(t, e) {
  return Ci(t, vu(e));
}
function Al(t, e) {
  let n = t.copy();
  return e.era != null && (n.era = e.era), e.year != null && (n.year = e.year), e.month != null && (n.month = e.month), e.day != null && (n.day = e.day), Ta(n), n;
}
function oi(t, e) {
  let n = t.copy();
  return e.hour != null && (n.hour = e.hour), e.minute != null && (n.minute = e.minute), e.second != null && (n.second = e.second), e.millisecond != null && (n.millisecond = e.millisecond), og(n), n;
}
function rg(t) {
  t.second += Math.floor(t.millisecond / 1e3), t.millisecond = Qs(t.millisecond, 1e3), t.minute += Math.floor(t.second / 60), t.second = Qs(t.second, 60), t.hour += Math.floor(t.minute / 60), t.minute = Qs(t.minute, 60);
  let e = Math.floor(t.hour / 24);
  return t.hour = Qs(t.hour, 24), e;
}
function og(t) {
  t.millisecond = Math.max(0, Math.min(t.millisecond, 1e3)), t.second = Math.max(0, Math.min(t.second, 59)), t.minute = Math.max(0, Math.min(t.minute, 59)), t.hour = Math.max(0, Math.min(t.hour, 23));
}
function Qs(t, e) {
  let n = t % e;
  return n < 0 && (n += e), n;
}
function ag(t, e) {
  return t.hour += e.hours || 0, t.minute += e.minutes || 0, t.second += e.seconds || 0, t.millisecond += e.milliseconds || 0, rg(t);
}
function Dl(t, e, n, o) {
  let i = t.copy();
  switch (e) {
    case "era": {
      let c = t.calendar.getEras(), u = c.indexOf(t.era);
      if (u < 0) throw new Error("Invalid era: " + t.era);
      u = Xo(u, n, 0, c.length - 1, o?.round), i.era = c[u], Ta(i);
      break;
    }
    case "year":
      var s, d;
      !((s = (d = i.calendar).isInverseEra) === null || s === void 0) && s.call(d, i) && (n = -n), i.year = Xo(t.year, n, -1 / 0, 9999, o?.round), i.year === -1 / 0 && (i.year = 1), i.calendar.balanceYearMonth && i.calendar.balanceYearMonth(i, t);
      break;
    case "month":
      i.month = Xo(t.month, n, 1, t.calendar.getMonthsInYear(t), o?.round);
      break;
    case "day":
      i.day = Xo(t.day, n, 1, t.calendar.getDaysInMonth(t), o?.round);
      break;
    default:
      throw new Error("Unsupported field " + e);
  }
  return t.calendar.balanceDate && t.calendar.balanceDate(i), Ta(i), i;
}
function yu(t, e, n, o) {
  let i = t.copy();
  switch (e) {
    case "hour": {
      let s = t.hour, d = 0, c = 23;
      if (o?.hourCycle === 12) {
        let u = s >= 12;
        d = u ? 12 : 0, c = u ? 23 : 11;
      }
      i.hour = Xo(s, n, d, c, o?.round);
      break;
    }
    case "minute":
      i.minute = Xo(t.minute, n, 0, 59, o?.round);
      break;
    case "second":
      i.second = Xo(t.second, n, 0, 59, o?.round);
      break;
    case "millisecond":
      i.millisecond = Xo(t.millisecond, n, 0, 999, o?.round);
      break;
    default:
      throw new Error("Unsupported field " + e);
  }
  return i;
}
function Xo(t, e, n, o, i = !1) {
  if (i) {
    t += Math.sign(e), t < n && (t = o);
    let s = Math.abs(e);
    e > 0 ? t = Math.ceil(t / s) * s : t = Math.floor(t / s) * s, t > o && (t = n);
  } else
    t += e, t < n ? t = o - (n - t - 1) : t > o && (t = n + (t - o - 1));
  return t;
}
function mu(t, e) {
  let n;
  if (e.years != null && e.years !== 0 || e.months != null && e.months !== 0 || e.weeks != null && e.weeks !== 0 || e.days != null && e.days !== 0) {
    let i = Ci(wa(t), {
      years: e.years,
      months: e.months,
      weeks: e.weeks,
      days: e.days
    });
    n = Do(i, t.timeZone);
  } else
    n = Pa(t) - t.offset;
  n += e.milliseconds || 0, n += (e.seconds || 0) * 1e3, n += (e.minutes || 0) * 6e4, n += (e.hours || 0) * 36e5;
  let o = Mo(n, t.timeZone);
  return Wr(o, t.calendar);
}
function sg(t, e) {
  return mu(t, vu(e));
}
function ig(t, e, n, o) {
  switch (e) {
    case "hour": {
      let i = 0, s = 23;
      if (o?.hourCycle === 12) {
        let E = t.hour >= 12;
        i = E ? 12 : 0, s = E ? 23 : 11;
      }
      let d = wa(t), c = Wr(oi(d, {
        hour: i
      }), new Xa()), u = [
        Do(c, t.timeZone, "earlier"),
        Do(c, t.timeZone, "later")
      ].filter((E) => Mo(E, t.timeZone).day === c.day)[0], _ = Wr(oi(d, {
        hour: s
      }), new Xa()), v = [
        Do(_, t.timeZone, "earlier"),
        Do(_, t.timeZone, "later")
      ].filter((E) => Mo(E, t.timeZone).day === _.day).pop(), b = Pa(t) - t.offset, x = Math.floor(b / ys), w = b % ys;
      return b = Xo(x, n, Math.floor(u / ys), Math.floor(v / ys), o?.round) * ys + w, Wr(Mo(b, t.timeZone), t.calendar);
    }
    case "minute":
    case "second":
    case "millisecond":
      return yu(t, e, n, o);
    case "era":
    case "year":
    case "month":
    case "day": {
      let i = Dl(wa(t), e, n, o), s = Do(i, t.timeZone);
      return Wr(Mo(s, t.timeZone), t.calendar);
    }
    default:
      throw new Error("Unsupported field " + e);
  }
}
function lg(t, e, n) {
  let o = wa(t), i = oi(Al(o, e), e);
  if (i.compare(o) === 0) return t;
  let s = Do(i, t.timeZone, n);
  return Wr(Mo(s, t.timeZone), t.calendar);
}
const dg = /^([+-]\d{6}|\d{4})-(\d{2})-(\d{2})$/, cg = /^([+-]\d{6}|\d{4})-(\d{2})-(\d{2})(?:T(\d{2}))?(?::(\d{2}))?(?::(\d{2}))?(\.\d+)?$/, ug = /^([+-]\d{6}|\d{4})-(\d{2})-(\d{2})(?:T(\d{2}))?(?::(\d{2}))?(?::(\d{2}))?(\.\d+)?(?:([+-]\d{2})(?::?(\d{2}))?(?::?(\d{2}))?)?\[(.*?)\]$/, bu = /^([+-]\d{6}|\d{4})-(\d{2})-(\d{2})(?:T(\d{2}))?(?::(\d{2}))?(?::(\d{2}))?(\.\d+)?(?:(?:([+-]\d{2})(?::?(\d{2}))?)|Z)$/;
function kl(t) {
  let e = t.match(dg);
  if (!e)
    throw bu.test(t) ? new Error(`Invalid ISO 8601 date string: ${t}. Use parseAbsolute() instead.`) : new Error("Invalid ISO 8601 date string: " + t);
  let n = new xa(Kn(e[1], 0, 9999), Kn(e[2], 1, 12), 1);
  return n.day = Kn(e[3], 1, n.calendar.getDaysInMonth(n)), n;
}
function Cu(t) {
  let e = t.match(cg);
  if (!e)
    throw bu.test(t) ? new Error(`Invalid ISO 8601 date time string: ${t}. Use parseAbsolute() instead.`) : new Error("Invalid ISO 8601 date time string: " + t);
  let n = Kn(e[1], -9999, 9999), o = n < 1 ? "BC" : "AD", i = new na(o, n < 1 ? -n + 1 : n, Kn(e[2], 1, 12), 1, e[4] ? Kn(e[4], 0, 23) : 0, e[5] ? Kn(e[5], 0, 59) : 0, e[6] ? Kn(e[6], 0, 59) : 0, e[7] ? Kn(e[7], 0, 1 / 0) * 1e3 : 0);
  return i.day = Kn(e[3], 0, i.calendar.getDaysInMonth(i)), i;
}
function Pu(t, e) {
  let n = t.match(ug);
  if (!n) throw new Error("Invalid ISO 8601 date time string: " + t);
  let o = Kn(n[1], -9999, 9999), i = o < 1 ? "BC" : "AD", s = new Oo(i, o < 1 ? -o + 1 : o, Kn(n[2], 1, 12), 1, n[11], 0, n[4] ? Kn(n[4], 0, 23) : 0, n[5] ? Kn(n[5], 0, 59) : 0, n[6] ? Kn(n[6], 0, 59) : 0, n[7] ? Kn(n[7], 0, 1 / 0) * 1e3 : 0);
  s.day = Kn(n[3], 0, s.calendar.getDaysInMonth(s));
  let d = wa(s), c;
  if (n[8]) {
    let v = Kn(n[8], -23, 23);
    var u, _;
    if (s.offset = Math.sign(v) * (Math.abs(v) * 36e5 + Kn((u = n[9]) !== null && u !== void 0 ? u : "0", 0, 59) * 6e4 + Kn((_ = n[10]) !== null && _ !== void 0 ? _ : "0", 0, 59) * 1e3), c = Pa(s) - s.offset, !Jf(d, s.timeZone).includes(c)) throw new Error(`Offset ${xu(s.offset)} is invalid for ${Ml(s)} in ${s.timeZone}`);
  } else
    c = Do(wa(d), s.timeZone, e);
  return Mo(c, s.timeZone);
}
function Kn(t, e, n) {
  let o = Number(t);
  if (o < e || o > n) throw new RangeError(`Value out of range: ${e} <= ${o} <= ${n}`);
  return o;
}
function hg(t) {
  return `${String(t.hour).padStart(2, "0")}:${String(t.minute).padStart(2, "0")}:${String(t.second).padStart(2, "0")}${t.millisecond ? String(t.millisecond / 1e3).slice(1) : ""}`;
}
function wu(t) {
  let e = Wr(t, new Xa()), n;
  return e.era === "BC" ? n = e.year === 1 ? "0000" : "-" + String(Math.abs(1 - e.year)).padStart(6, "00") : n = String(e.year).padStart(4, "0"), `${n}-${String(e.month).padStart(2, "0")}-${String(e.day).padStart(2, "0")}`;
}
function Ml(t) {
  return `${wu(t)}T${hg(t)}`;
}
function xu(t) {
  let e = Math.sign(t) < 0 ? "-" : "+";
  t = Math.abs(t);
  let n = Math.floor(t / 36e5), o = Math.floor(t % 36e5 / 6e4), i = Math.floor(t % 36e5 % 6e4 / 1e3), s = `${e}${String(n).padStart(2, "0")}:${String(o).padStart(2, "0")}`;
  return i !== 0 && (s += `:${String(i).padStart(2, "0")}`), s;
}
function fg(t) {
  return `${Ml(t)}${xu(t.offset)}[${t.timeZone}]`;
}
function gg(t, e) {
  if (e.has(t))
    throw new TypeError("Cannot initialize the same private elements twice on an object");
}
function Tl(t, e, n) {
  gg(t, e), e.set(t, n);
}
function Ol(t) {
  let e = typeof t[0] == "object" ? t.shift() : new Xa(), n;
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
var vg = /* @__PURE__ */ new WeakMap();
class xa {
  /** Returns a copy of this date. */
  copy() {
    return this.era ? new xa(this.calendar, this.era, this.year, this.month, this.day) : new xa(this.calendar, this.year, this.month, this.day);
  }
  /** Returns a new `CalendarDate` with the given duration added to it. */
  add(e) {
    return Ci(this, e);
  }
  /** Returns a new `CalendarDate` with the given duration subtracted from it. */
  subtract(e) {
    return pu(this, e);
  }
  /** Returns a new `CalendarDate` with the given fields set to the provided values. Other fields will be constrained accordingly. */
  set(e) {
    return Al(this, e);
  }
  /**
  * Returns a new `CalendarDate` with the given field adjusted by a specified amount.
  * When the resulting value reaches the limits of the field, it wraps around.
  */
  cycle(e, n, o) {
    return Dl(this, e, n, o);
  }
  /** Converts the date to a native JavaScript Date object, with the time set to midnight in the given time zone. */
  toDate(e) {
    return fu(this, e);
  }
  /** Converts the date to an ISO 8601 formatted string. */
  toString() {
    return wu(this);
  }
  /** Compares this date with another. A negative result indicates that this date is before the given one, and a positive date indicates that it is after. */
  compare(e) {
    return du(this, e);
  }
  constructor(...e) {
    Tl(this, vg, {
      writable: !0,
      value: void 0
    });
    let [n, o, i, s, d] = Ol(e);
    this.calendar = n, this.era = o, this.year = i, this.month = s, this.day = d, Ta(this);
  }
}
var pg = /* @__PURE__ */ new WeakMap();
class na {
  /** Returns a copy of this date. */
  copy() {
    return this.era ? new na(this.calendar, this.era, this.year, this.month, this.day, this.hour, this.minute, this.second, this.millisecond) : new na(this.calendar, this.year, this.month, this.day, this.hour, this.minute, this.second, this.millisecond);
  }
  /** Returns a new `CalendarDateTime` with the given duration added to it. */
  add(e) {
    return Ci(this, e);
  }
  /** Returns a new `CalendarDateTime` with the given duration subtracted from it. */
  subtract(e) {
    return pu(this, e);
  }
  /** Returns a new `CalendarDateTime` with the given fields set to the provided values. Other fields will be constrained accordingly. */
  set(e) {
    return Al(oi(this, e), e);
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
        return Dl(this, e, n, o);
      default:
        return yu(this, e, n, o);
    }
  }
  /** Converts the date to a native JavaScript Date object in the given time zone. */
  toDate(e, n) {
    return fu(this, e, n);
  }
  /** Converts the date to an ISO 8601 formatted string. */
  toString() {
    return Ml(this);
  }
  /** Compares this date with another. A negative result indicates that this date is before the given one, and a positive date indicates that it is after. */
  compare(e) {
    let n = du(this, e);
    return n === 0 ? Yf(this, wa(e)) : n;
  }
  constructor(...e) {
    Tl(this, pg, {
      writable: !0,
      value: void 0
    });
    let [n, o, i, s, d] = Ol(e);
    this.calendar = n, this.era = o, this.year = i, this.month = s, this.day = d, this.hour = e.shift() || 0, this.minute = e.shift() || 0, this.second = e.shift() || 0, this.millisecond = e.shift() || 0, Ta(this);
  }
}
var yg = /* @__PURE__ */ new WeakMap();
class Oo {
  /** Returns a copy of this date. */
  copy() {
    return this.era ? new Oo(this.calendar, this.era, this.year, this.month, this.day, this.timeZone, this.offset, this.hour, this.minute, this.second, this.millisecond) : new Oo(this.calendar, this.year, this.month, this.day, this.timeZone, this.offset, this.hour, this.minute, this.second, this.millisecond);
  }
  /** Returns a new `ZonedDateTime` with the given duration added to it. */
  add(e) {
    return mu(this, e);
  }
  /** Returns a new `ZonedDateTime` with the given duration subtracted from it. */
  subtract(e) {
    return sg(this, e);
  }
  /** Returns a new `ZonedDateTime` with the given fields set to the provided values. Other fields will be constrained accordingly. */
  set(e, n) {
    return lg(this, e, n);
  }
  /**
  * Returns a new `ZonedDateTime` with the given field adjusted by a specified amount.
  * When the resulting value reaches the limits of the field, it wraps around.
  */
  cycle(e, n, o) {
    return ig(this, e, n, o);
  }
  /** Converts the date to a native JavaScript Date object. */
  toDate() {
    return eg(this);
  }
  /** Converts the date to an ISO 8601 formatted string, including the UTC offset and time zone identifier. */
  toString() {
    return fg(this);
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
    Tl(this, yg, {
      writable: !0,
      value: void 0
    });
    let [n, o, i, s, d] = Ol(e), c = e.shift(), u = e.shift();
    this.calendar = n, this.era = o, this.year = i, this.month = s, this.day = d, this.timeZone = c, this.offset = u, this.hour = e.shift() || 0, this.minute = e.shift() || 0, this.second = e.shift() || 0, this.millisecond = e.shift() || 0, Ta(this);
  }
}
let Li = /* @__PURE__ */ new Map();
class Eo {
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
    return Cg() && (this.resolvedHourCycle || (this.resolvedHourCycle = Pg(e.locale, this.options)), e.hourCycle = this.resolvedHourCycle, e.hour12 = this.resolvedHourCycle === "h11" || this.resolvedHourCycle === "h12"), e.calendar === "ethiopic-amete-alem" && (e.calendar = "ethioaa"), e;
  }
  constructor(e, n = {}) {
    this.formatter = Ru(e, n), this.options = n;
  }
}
const mg = {
  true: {
    // Only Japanese uses the h11 style for 12 hour time. All others use h12.
    ja: "h11"
  },
  false: {}
};
function Ru(t, e = {}) {
  if (typeof e.hour12 == "boolean" && bg()) {
    e = {
      ...e
    };
    let i = mg[String(e.hour12)][t.split("-")[0]], s = e.hour12 ? "h12" : "h23";
    e.hourCycle = i ?? s, delete e.hour12;
  }
  let n = t + (e ? Object.entries(e).sort((i, s) => i[0] < s[0] ? -1 : 1).join() : "");
  if (Li.has(n)) return Li.get(n);
  let o = new Intl.DateTimeFormat(t, e);
  return Li.set(n, o), o;
}
let Fi = null;
function bg() {
  return Fi == null && (Fi = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    hour12: !1
  }).format(new Date(2020, 2, 3, 0)) === "24"), Fi;
}
let Hi = null;
function Cg() {
  return Hi == null && (Hi = new Intl.DateTimeFormat("fr", {
    hour: "numeric",
    hour12: !1
  }).resolvedOptions().hourCycle === "h12"), Hi;
}
function Pg(t, e) {
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
function wg(t) {
  if (!Ra || !t)
    return null;
  let e = t.querySelector("[data-bits-announcer]");
  const n = (i) => {
    const s = t.createElement("div");
    return s.role = "log", s.ariaLive = i, s.setAttribute("aria-relevant", "additions"), s;
  };
  if (!ea(e)) {
    const i = t.createElement("div");
    i.style.cssText = yh, i.setAttribute("data-bits-announcer", ""), i.appendChild(n("assertive")), i.appendChild(n("polite")), e = i, t.body.insertBefore(e, t.body.firstChild);
  }
  return {
    getLog: (i) => {
      if (!ea(e))
        return null;
      const s = e.querySelector(`[aria-live="${i}"]`);
      return ea(s) ? s : null;
    }
  };
}
function ai(t) {
  const e = wg(t);
  function n(o, i = "assertive", s = 7500) {
    if (!e || !Ra || !t)
      return;
    const d = e.getLog(i), c = t.createElement("div");
    return typeof o == "number" ? o = o.toString() : o === null ? o = "Empty" : o = o.trim(), c.innerText = o, i === "assertive" ? d?.replaceChildren(c) : d?.appendChild(c), setTimeout(() => {
      c.remove();
    }, s);
  }
  return {
    announce: n
  };
}
const xg = {
  defaultValue: void 0,
  granularity: "day"
};
function Rg(t) {
  const e = { ...xg, ...t }, { defaultValue: n, granularity: o, minValue: i, maxValue: s } = e;
  if (Array.isArray(n) && n.length)
    return n[n.length - 1];
  if (n && !Array.isArray(n))
    return n;
  {
    let d = /* @__PURE__ */ new Date();
    i && d < i.toDate(ba()) ? d = i.toDate(ba()) : s && d > s.toDate(ba()) && (d = s.toDate(ba()));
    const c = d.getFullYear(), u = d.getMonth() + 1, _ = d.getDate();
    return ["hour", "minute", "second"].includes(o ?? "day") ? new na(c, u, _, 0, 0, 0) : new xa(c, u, _);
  }
}
function Su(t, e) {
  let n;
  return e instanceof Oo ? n = Pu(t) : e instanceof na ? n = Cu(t) : n = kl(t), n.calendar !== e.calendar ? Wr(n, e.calendar) : n;
}
function Nr(t, e = ba()) {
  return t instanceof Oo ? t.toDate() : t.toDate(e);
}
function Sg(t) {
  if (t instanceof xa)
    return "date";
  if (t instanceof na)
    return "datetime";
  if (t instanceof Oo)
    return "zoneddatetime";
  throw new Error("Unknown date type");
}
function Ig(t, e) {
  switch (e) {
    case "date":
      return kl(t);
    case "datetime":
      return Cu(t);
    case "zoneddatetime":
      return Pu(t);
    default:
      throw new Error(`Unknown date type: ${e}`);
  }
}
function _g(t) {
  return t instanceof na;
}
function Ll(t) {
  return t instanceof Oo;
}
function si(t) {
  return _g(t) || Ll(t);
}
function Ms(t) {
  if (t instanceof Date) {
    const e = t.getFullYear(), n = t.getMonth() + 1;
    return new Date(e, n, 0).getDate();
  } else
    return t.set({ day: 100 }).day;
}
function Oa(t, e) {
  return t.compare(e) < 0;
}
function Eg(t, e) {
  return t.compare(e) > 0;
}
function Ud(t, e, n) {
  const o = lu(t, n);
  return e > o ? t.subtract({ days: o + 7 - e }) : e === o ? t : t.subtract({ days: o - e });
}
function qd(t, e, n) {
  const o = lu(t, n), i = e === 0 ? 6 : e - 1;
  return o === i ? t : o > i ? t.add({ days: 7 - o + i }) : t.add({ days: i - o });
}
const Pi = ["day", "month", "year"], Fl = ["hour", "minute", "second", "dayPeriod"], Ag = ["literal", "timeZoneName"], Fs = [
  ...Pi,
  ...Fl
], Dg = [
  ...Fs,
  ...Ag
], kg = [
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
], Mg = ["year", "month", "day"], Ni = {
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
function Tg(t) {
  if (Vd(t))
    return Ni[t];
  {
    const e = Hg(t);
    return Vd(e) ? Ni[e] : Ni.en;
  }
}
function $i(t, e, n) {
  return Og(t) ? Tg(n)[t] : Fg(t) ? e : Lg(t) ? "––" : "";
}
function Vd(t) {
  return kg.includes(t);
}
function Og(t) {
  return Mg.includes(t);
}
function Lg(t) {
  return t === "hour" || t === "minute" || t === "second";
}
function Fg(t) {
  return t === "era" || t === "dayPeriod";
}
function Hg(t) {
  return Intl.Locale ? new Intl.Locale(t).language : t.split("-")[0];
}
function Bi(t) {
  const e = ["hour", "minute", "second"], n = Fs.map((o) => o === "dayPeriod" ? [o, "AM"] : [o, null]).filter(([o]) => o === "literal" || o === null ? !1 : t === "day" ? !e.includes(o) : !0);
  return Object.fromEntries(n);
}
function Ng(t) {
  const { segmentValues: e, formatter: n, locale: o, dateRef: i } = t, s = Object.keys(e).reduce((c, u) => {
    if (!Iu(u))
      return c;
    if ("hour" in e && u === "dayPeriod") {
      const _ = e[u];
      ya(_) ? c[u] = $i(u, "AM", o) : c[u] = _;
    } else
      c[u] = d(u);
    return c;
  }, {});
  function d(c) {
    if ("hour" in e) {
      const u = e[c], _ = typeof u == "string" && u?.startsWith("0"), v = u !== null ? Number.parseInt(u) : null;
      if (u === "0" && c !== "year")
        return "0";
      if (!ya(u) && !ya(v)) {
        const b = n.part(i.set({ [c]: u }), c, {
          hourCycle: t.hourCycle === 24 ? "h23" : void 0
        }), x = t.hourCycle === 12 || t.hourCycle === void 0 && Eu(o) === 12;
        if (c === "hour" && x) {
          if (v > 12) {
            const w = v - 12;
            return w === 0 ? "12" : w < 10 ? `0${w}` : `${w}`;
          }
          return v === 0 ? "12" : v < 10 ? `0${v}` : `${v}`;
        }
        return c === "year" ? `${u}` : _ && b.length === 1 ? `0${b}` : b;
      } else
        return $i(c, "", o);
    } else {
      if (wi(c)) {
        const u = e[c], _ = typeof u == "string" && u?.startsWith("0");
        if (u === "0")
          return "0";
        if (ya(u))
          return $i(c, "", o);
        {
          const v = n.part(i.set({ [c]: u }), c);
          return c === "year" ? `${u}` : _ && v.length === 1 ? `0${v}` : v;
        }
      }
      return "";
    }
  }
  return s;
}
function $g(t) {
  const { granularity: e, dateRef: n, formatter: o, contentObj: i, hideTimeZone: s, hourCycle: d } = t;
  return o.toParts(n, Ug(e, d)).map((_) => ["literal", "dayPeriod", "timeZoneName", null].includes(_.type) || !Iu(_.type) ? {
    part: _.type,
    value: _.value
  } : {
    part: _.type,
    value: i[_.type]
  }).filter((_) => !(ya(_.part) || ya(_.value) || _.part === "timeZoneName" && (!Ll(n) || s)));
}
function Bg(t) {
  const e = Ng(t), n = $g({
    contentObj: e,
    ...t
  });
  return {
    obj: e,
    arr: n
  };
}
function Ug(t, e) {
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
function jd() {
  return Fs.reduce((t, e) => (t[e] = {
    lastKeyZero: !1,
    hasLeftFocus: !0,
    updating: null
  }, t), {});
}
function wi(t) {
  return Pi.includes(t);
}
function Iu(t) {
  return Fs.includes(t);
}
function qg(t) {
  return Dg.includes(t);
}
function _u(t) {
  return !Ra || !t ? [] : $l(t).map((n) => n.dataset.segment).filter((n) => Fs.includes(n));
}
function Vg(t) {
  const { segmentObj: e, fieldNode: n, dateRef: o } = t, i = _u(n);
  let s = o;
  for (const d of i)
    if ("hour" in e) {
      const c = e[d];
      if (ya(c))
        continue;
      s = s.set({ [d]: e[d] });
    } else if (wi(d)) {
      const c = e[d];
      if (ya(c))
        continue;
      s = s.set({ [d]: e[d] });
    }
  return s;
}
function jg(t, e) {
  const n = _u(e);
  for (const o of n)
    if ("hour" in t) {
      if (t[o] === null)
        return !1;
    } else if (wi(o) && t[o] === null)
      return !1;
  return !0;
}
function Kg(t) {
  return typeof t != "object" || t === null ? !1 : Object.entries(t).every(([e, n]) => (Fl.includes(e) || Pi.includes(e)) && (e === "dayPeriod" ? n === "AM" || n === "PM" || n === null : typeof n == "string" || typeof n == "number" || n === null));
}
function Yg(t, e) {
  return e || (si(t) ? "minute" : "day");
}
function Hl(t) {
  return !!([
    Oc,
    fi,
    gi,
    Ts,
    Os,
    Lc,
    Fc
  ].includes(t) || vi(t));
}
function Qg(t, e) {
  if (!Ra)
    return !1;
  const n = $l(e);
  return n.length ? n[0].id === t : !1;
}
function zg(t) {
  const { id: e, formatter: n, value: o, doc: i } = t;
  if (!Ra)
    return;
  const s = n.selectedDate(o), d = i.getElementById(e);
  if (d)
    d.innerText = `Selected Date: ${s}`;
  else {
    const c = i.createElement("div");
    c.style.cssText = Tc({
      display: "none"
    }), c.id = e, c.innerText = `Selected Date: ${s}`, i.body.appendChild(c);
  }
}
function Wg(t, e) {
  if (!Ra)
    return;
  const n = e.getElementById(t);
  n && e.body.removeChild(n);
}
function Eu(t) {
  return new Intl.DateTimeFormat(t, { hour: "numeric" }).formatToParts(/* @__PURE__ */ new Date("2023-01-01T13:00:00")).find((i) => i.type === "hour")?.value === "1" ? 12 : 24;
}
function Hs(t, e) {
  const n = t.currentTarget;
  if (!ea(n))
    return;
  const { prev: o, next: i } = Nl(n, e);
  if (t.key === Ts) {
    if (!o)
      return;
    o.focus();
  } else if (t.key === Os) {
    if (!i)
      return;
    i.focus();
  }
}
function Jg(t, e) {
  const n = e.indexOf(t);
  if (n === e.length - 1 || n === -1)
    return null;
  const o = n + 1;
  return e[o];
}
function Gg(t, e) {
  const n = e.indexOf(t);
  if (n === 0 || n === -1)
    return null;
  const o = n - 1;
  return e[o];
}
function Nl(t, e) {
  const n = $l(e);
  return n.length ? {
    next: Jg(t, n),
    prev: Gg(t, n)
  } : {
    next: null,
    prev: null
  };
}
function Au(t, e) {
  const n = t.currentTarget;
  if (!ea(n))
    return;
  const { next: o } = Nl(n, e);
  o && o.focus();
}
function Du(t, e) {
  const n = t.currentTarget;
  if (!ea(n))
    return;
  const { prev: o } = Nl(n, e);
  o && o.focus();
}
function Ns(t) {
  return t === Os || t === Ts;
}
function $l(t) {
  return t ? Array.from(t.querySelectorAll("[data-segment]")).filter((n) => {
    if (!ea(n))
      return !1;
    const o = n.dataset.segment;
    return o === "trigger" ? !0 : !(!qg(o) || o === "literal");
  }) : [];
}
const Zg = {
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric"
};
function ku(t) {
  let e = t.initialLocale;
  function n(w) {
    e = w;
  }
  function o() {
    return e;
  }
  function i(w, E) {
    return new Eo(e, E).format(w);
  }
  function s(w, E = !0) {
    return si(w) && E ? i(Nr(w), {
      dateStyle: "long",
      timeStyle: "long"
    }) : i(Nr(w), {
      dateStyle: "long"
    });
  }
  function d(w) {
    if (typeof t.monthFormat.current != "function" && typeof t.yearFormat.current != "function")
      return new Eo(e, {
        month: t.monthFormat.current,
        year: t.yearFormat.current
      }).format(w);
    const E = typeof t.monthFormat.current == "function" ? t.monthFormat.current(w.getMonth() + 1) : new Eo(e, { month: t.monthFormat.current }).format(w), C = typeof t.yearFormat.current == "function" ? t.yearFormat.current(w.getFullYear()) : new Eo(e, { year: t.yearFormat.current }).format(w);
    return `${E} ${C}`;
  }
  function c(w) {
    return new Eo(e, { month: "long" }).format(w);
  }
  function u(w) {
    return new Eo(e, { year: "numeric" }).format(w);
  }
  function _(w, E) {
    return Ll(w) ? new Eo(e, {
      ...E,
      timeZone: w.timeZone
    }).formatToParts(Nr(w)) : new Eo(e, E).formatToParts(Nr(w));
  }
  function v(w, E = "narrow") {
    return new Eo(e, { weekday: E }).format(w);
  }
  function b(w, E = void 0) {
    return new Eo(e, {
      hour: "numeric",
      minute: "numeric",
      hourCycle: E === 24 ? "h23" : void 0
    }).formatToParts(w).find((a) => a.type === "dayPeriod")?.value === "PM" ? "PM" : "AM";
  }
  function x(w, E, C = {}) {
    const m = { ...Zg, ...C }, L = _(w, m).find((oe) => oe.type === E);
    return L ? L.value : "";
  }
  return {
    setLocale: n,
    getLocale: o,
    fullMonth: c,
    fullYear: u,
    fullMonthAndYear: d,
    toParts: _,
    custom: i,
    part: x,
    dayPeriod: b,
    selectedDate: s,
    dayOfWeek: v
  };
}
function Xg(t) {
  return !(!ea(t) || !t.hasAttribute("data-bits-day"));
}
function Kd(t, e) {
  const n = [];
  let o = t.add({ days: 1 });
  const i = e;
  for (; o.compare(i) < 0; )
    n.push(o), o = o.add({ days: 1 });
  return n;
}
function Ui(t) {
  const { dateObj: e, weekStartsOn: n, fixedWeeks: o, locale: i } = t, s = Ms(e), d = Array.from({ length: s }, (m, a) => e.set({ day: a + 1 })), c = cl(e), u = Qf(e), _ = n !== void 0 ? Ud(c, n, "en-US") : Ud(c, 0, i), v = n !== void 0 ? qd(u, n, "en-US") : qd(u, 0, i), b = Kd(_.subtract({ days: 1 }), c), x = Kd(u, v.add({ days: 1 })), w = b.length + d.length + x.length;
  if (o && w < 42) {
    const m = 42 - w;
    let a = x[x.length - 1];
    a || (a = e.add({ months: 1 }).set({ day: 1 }));
    let L = m;
    x.length === 0 && (L = m - 1, x.push(a));
    const oe = Array.from({ length: L }, (z, ee) => {
      const I = ee + 1;
      return a.add({ days: I });
    });
    x.push(...oe);
  }
  const E = b.concat(d, x), C = mh(E, 7);
  return { value: e, dates: E, weeks: C };
}
function $s(t) {
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
function qi(t) {
  return t ? Array.from(t.querySelectorAll("[data-bits-day]:not([data-disabled]):not([data-outside-visible-months])")).filter((n) => ea(n)) : [];
}
function Yd(t, e) {
  const n = t.getAttribute("data-value");
  n && (e.current = Su(n, e.current));
}
function ev({
  node: t,
  add: e,
  placeholder: n,
  calendarNode: o,
  isPrevButtonDisabled: i,
  isNextButtonDisabled: s,
  months: d,
  numberOfMonths: c
}) {
  const u = qi(o);
  if (!u.length) return;
  const v = u.indexOf(t) + e;
  if (_i(v, u)) {
    const b = u[v];
    return Yd(b, n), b.focus();
  }
  if (v < 0) {
    if (i) return;
    const b = d[0]?.value;
    if (!b) return;
    n.current = b.subtract({ months: c }), wd(() => {
      const x = qi(o);
      if (!x.length) return;
      const w = x.length - Math.abs(v);
      if (_i(w, x)) {
        const E = x[w];
        return Yd(E, n), E.focus();
      }
    });
  }
  if (v >= u.length) {
    if (s) return;
    const b = d[0]?.value;
    if (!b) return;
    n.current = b.add({ months: c }), wd(() => {
      const x = qi(o);
      if (!x.length) return;
      const w = v - u.length;
      if (_i(w, x))
        return x[w].focus();
    });
  }
}
const Qd = [
  gi,
  fi,
  Ts,
  Os
], zd = [Oc, Fc];
function tv({ event: t, handleCellClick: e, shiftFocus: n, placeholderValue: o }) {
  const i = t.target;
  if (!Xg(i) || !Qd.includes(t.key) && !zd.includes(t.key)) return;
  t.preventDefault();
  const s = {
    [gi]: 7,
    [fi]: -7,
    [Ts]: -1,
    [Os]: 1
  };
  if (Qd.includes(t.key)) {
    const d = s[t.key];
    d !== void 0 && n(i, d);
  }
  if (zd.includes(t.key)) {
    const d = i.getAttribute("data-value");
    if (!d) return;
    e(t, Su(d, o));
  }
}
function nv({
  months: t,
  setMonths: e,
  numberOfMonths: n,
  pagedNavigation: o,
  weekStartsOn: i,
  locale: s,
  fixedWeeks: d,
  setPlaceholder: c
}) {
  const u = t[0]?.value;
  if (u)
    if (o)
      c(u.add({ months: n }));
    else {
      const _ = u.add({ months: 1 }), v = $s({
        dateObj: _,
        weekStartsOn: i,
        locale: s,
        fixedWeeks: d,
        numberOfMonths: n
      });
      c(_), e(v);
    }
}
function rv({
  months: t,
  setMonths: e,
  numberOfMonths: n,
  pagedNavigation: o,
  weekStartsOn: i,
  locale: s,
  fixedWeeks: d,
  setPlaceholder: c
}) {
  const u = t[0]?.value;
  if (u)
    if (o)
      c(u.subtract({ months: n }));
    else {
      const _ = u.subtract({ months: 1 }), v = $s({
        dateObj: _,
        weekStartsOn: i,
        locale: s,
        fixedWeeks: d,
        numberOfMonths: n
      });
      c(_), e(v);
    }
}
function ov({ months: t, formatter: e, weekdayFormat: n }) {
  if (!t.length) return [];
  const i = t[0].weeks[0];
  return i ? i.map((s) => e.dayOfWeek(Nr(s), n)) : [];
}
function av(t) {
  Xe(() => {
    const e = t.weekStartsOn.current, n = t.locale.current, o = t.fixedWeeks.current, i = t.numberOfMonths.current;
    so(() => {
      const s = t.placeholder.current;
      if (!s) return;
      const d = { weekStartsOn: e, locale: n, fixedWeeks: o, numberOfMonths: i };
      t.setMonths($s({ ...d, dateObj: s }));
    });
  });
}
function sv({ calendarNode: t, label: e, accessibleHeadingId: n }) {
  const o = Hc(t), i = o.createElement("div");
  i.style.cssText = Tc({
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
function iv({
  placeholder: t,
  getVisibleMonths: e,
  weekStartsOn: n,
  locale: o,
  fixedWeeks: i,
  numberOfMonths: s,
  setMonths: d
}) {
  Xe(() => {
    t.current, so(() => {
      if (e().some((u) => El(u, t.current)))
        return;
      const c = {
        weekStartsOn: n.current,
        locale: o.current,
        fixedWeeks: i.current,
        numberOfMonths: s.current
      };
      d($s({ ...c, dateObj: t.current }));
    });
  });
}
function lv({ maxValue: t, months: e, disabled: n }) {
  if (!t || !e.length) return !1;
  if (n) return !0;
  const o = e[e.length - 1]?.value;
  if (!o) return !1;
  const i = o.add({ months: 1 }).set({ day: 1 });
  return Eg(i, t);
}
function dv({ minValue: t, months: e, disabled: n }) {
  if (!t || !e.length) return !1;
  if (n) return !0;
  const o = e[0]?.value;
  if (!o) return !1;
  const i = o.subtract({ months: 1 }).set({ day: 35 });
  return Oa(i, t);
}
function cv({ months: t, locale: e, formatter: n }) {
  if (!t.length) return "";
  if (e !== n.getLocale() && n.setLocale(e), t.length === 1) {
    const v = Nr(t[0].value);
    return `${n.fullMonthAndYear(v)}`;
  }
  const o = Nr(t[0].value), i = Nr(t[t.length - 1].value), s = n.fullMonth(o), d = n.fullMonth(i), c = n.fullYear(o), u = n.fullYear(i);
  return c === u ? `${s} - ${d} ${u}` : `${s} ${c} - ${d} ${u}`;
}
function uv({ fullCalendarLabel: t, id: e, isInvalid: n, disabled: o, readonly: i }) {
  return {
    id: e,
    role: "application",
    "aria-label": t,
    "data-invalid": vn(n),
    "data-disabled": vn(o),
    "data-readonly": vn(i)
  };
}
function hv(t) {
  const n = Hc(t.target).querySelector("[data-bits-day][data-focused]");
  n && (t.preventDefault(), n?.focus());
}
function fv(t) {
  if (!Ra) return;
  const e = Array.from(t.querySelectorAll("[data-bits-day]:not([aria-disabled=true])"));
  if (e.length === 0) return;
  const n = e[0], o = n?.getAttribute("data-value"), i = n?.getAttribute("data-type");
  if (!(!o || !i))
    return Ig(o, i);
}
function gv({
  ref: t,
  placeholder: e,
  defaultPlaceholder: n,
  minValue: o,
  maxValue: i,
  isDateDisabled: s
}) {
  function d(c) {
    return !!(s.current(c) || o.current && Oa(c, o.current) || i.current && Oa(i.current, c));
  }
  Za(() => t.current, () => {
    t.current && e.current && pa(e.current, n) && d(n) && (e.current = fv(t.current) ?? n);
  });
}
function vv(t, e) {
  return !t || !e ? t : si(t) && si(e) ? t.set({
    hour: e.hour,
    minute: e.minute,
    millisecond: e.millisecond,
    second: e.second
  }) : t;
}
const pv = Nc({
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
function yv(t) {
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
  return Array.from({ length: s }, (d, c) => o + c);
}
const yo = new pi("Calendar.Root | RangeCalender.Root");
class Bl {
  static create(e) {
    return yo.set(new Bl(e));
  }
  opts;
  #e = P(() => this.months.map((e) => e.value));
  get visibleMonths() {
    return r(this.#e);
  }
  set visibleMonths(e) {
    g(this.#e, e);
  }
  formatter;
  accessibleHeadingId = $c();
  domContext;
  attachment;
  #t = me(ur([]));
  get months() {
    return r(this.#t);
  }
  set months(e) {
    g(this.#t, e, !0);
  }
  announcer;
  constructor(e) {
    this.opts = e, this.attachment = fr(this.opts.ref), this.domContext = new ml(e.ref), this.announcer = ai(null), this.formatter = ku({
      initialLocale: this.opts.locale.current,
      monthFormat: this.opts.monthFormat,
      yearFormat: this.opts.yearFormat
    }), this.setMonths = this.setMonths.bind(this), this.nextPage = this.nextPage.bind(this), this.prevPage = this.prevPage.bind(this), this.prevYear = this.prevYear.bind(this), this.nextYear = this.nextYear.bind(this), this.setYear = this.setYear.bind(this), this.setMonth = this.setMonth.bind(this), this.isOutsideVisibleMonths = this.isOutsideVisibleMonths.bind(this), this.isDateDisabled = this.isDateDisabled.bind(this), this.isDateSelected = this.isDateSelected.bind(this), this.shiftFocus = this.shiftFocus.bind(this), this.handleCellClick = this.handleCellClick.bind(this), this.handleMultipleUpdate = this.handleMultipleUpdate.bind(this), this.handleSingleUpdate = this.handleSingleUpdate.bind(this), this.onkeydown = this.onkeydown.bind(this), this.getBitsAttr = this.getBitsAttr.bind(this), Bc(() => {
      this.announcer = ai(this.domContext.getDocument());
    }), this.months = $s({
      dateObj: this.opts.placeholder.current,
      weekStartsOn: this.opts.weekStartsOn.current,
      locale: this.opts.locale.current,
      fixedWeeks: this.opts.fixedWeeks.current,
      numberOfMonths: this.opts.numberOfMonths.current
    }), this.#a(), this.#i(), this.#l(), iv({
      placeholder: this.opts.placeholder,
      getVisibleMonths: () => this.visibleMonths,
      weekStartsOn: this.opts.weekStartsOn,
      locale: this.opts.locale,
      fixedWeeks: this.opts.fixedWeeks,
      numberOfMonths: this.opts.numberOfMonths,
      setMonths: (n) => this.months = n
    }), av({
      fixedWeeks: this.opts.fixedWeeks,
      locale: this.opts.locale,
      numberOfMonths: this.opts.numberOfMonths,
      placeholder: this.opts.placeholder,
      setMonths: this.setMonths,
      weekStartsOn: this.opts.weekStartsOn
    }), Za(() => this.fullCalendarLabel, (n) => {
      const o = this.domContext.getElementById(this.accessibleHeadingId);
      o && (o.textContent = n);
    }), Za(() => this.opts.value.current, () => {
      const n = this.opts.value.current;
      if (Array.isArray(n) && n.length) {
        const o = n[n.length - 1];
        o && this.opts.placeholder.current !== o && (this.opts.placeholder.current = o);
      } else !Array.isArray(n) && n && this.opts.placeholder.current !== n && (this.opts.placeholder.current = n);
    }), gv({
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
  #n = P(
    /**
     * This derived state holds an array of localized day names for the current
     * locale and calendar view. It dynamically syncs with the 'weekStartsOn' option,
     * updating its content when the option changes. Using this state to render the
     * calendar's days of the week is strongly recommended, as it guarantees that
     * the days are correctly formatted for the current locale and calendar view.
     */
    () => ov({
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
  #r = P(() => so(() => this.opts.placeholder.current.year));
  get initialPlaceholderYear() {
    return r(this.#r);
  }
  set initialPlaceholderYear(e) {
    g(this.#r, e);
  }
  #o = P(() => yv({
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
    Xe(() => {
      if (so(() => this.opts.initialFocus.current)) {
        const n = this.opts.ref.current?.querySelector("[data-focused]");
        n && n.focus();
      }
    });
  }
  #i() {
    Xe(() => this.opts.ref.current ? sv({
      calendarNode: this.opts.ref.current,
      label: this.fullCalendarLabel,
      accessibleHeadingId: this.accessibleHeadingId
    }) : void 0);
  }
  #l() {
    Cf(() => {
      this.formatter.getLocale() !== this.opts.locale.current && this.formatter.setLocale(this.opts.locale.current);
    });
  }
  /**
   * Navigates to the next page of the calendar.
   */
  nextPage() {
    nv({
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
    rv({
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
  #s = P(() => lv({
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
  #d = P(() => dv({
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
  #c = P(() => {
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
  #u = P(() => (this.opts.monthFormat.current, this.opts.yearFormat.current, cv({
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
  #h = P(() => `${this.opts.calendarLabel.current} ${this.headingValue}`);
  get fullCalendarLabel() {
    return r(this.#h);
  }
  set fullCalendarLabel(e) {
    g(this.#h, e);
  }
  isOutsideVisibleMonths(e) {
    return !this.visibleMonths.some((n) => El(e, n));
  }
  isDateDisabled(e) {
    if (this.opts.isDateDisabled.current(e) || this.opts.disabled.current) return !0;
    const n = this.opts.minValue.current, o = this.opts.maxValue.current;
    return !!(n && Oa(e, n) || o && Oa(o, e));
  }
  isDateSelected(e) {
    const n = this.opts.value.current;
    return Array.isArray(n) ? n.some((o) => pa(o, e)) : n ? pa(n, e) : !1;
  }
  shiftFocus(e, n) {
    return ev({
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
      s ? this.announcer.announce(`Selected Date: ${this.formatter.selectedDate(s, !1)}`, "polite") : this.announcer.announce("Selected date is now empty.", "polite", 5e3), this.opts.value.current = vv(s, o), s !== void 0 && this.opts.onDateSelect?.current?.();
    }
  }
  handleMultipleUpdate(e, n) {
    if (!e) {
      const s = [n];
      return this.#f(s) ? s : [n];
    }
    if (!Array.isArray(e))
      return;
    const o = e.findIndex((s) => pa(s, n)), i = this.opts.preventDeselect.current;
    if (o === -1) {
      const s = [...e, n];
      return this.#f(s) ? s : [n];
    } else {
      if (i)
        return e;
      {
        const s = e.filter((d) => !pa(d, n));
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
    if (!this.opts.preventDeselect.current && pa(e, n)) {
      this.opts.placeholder.current = n;
      return;
    }
    return n;
  }
  onkeydown(e) {
    tv({
      event: e,
      handleCellClick: this.handleCellClick,
      shiftFocus: this.shiftFocus,
      placeholderValue: this.opts.placeholder.current
    });
  }
  #g = P(() => ({ months: this.months, weekdays: this.weekdays }));
  get snippetProps() {
    return r(this.#g);
  }
  set snippetProps(e) {
    g(this.#g, e);
  }
  getBitsAttr = (e) => pv.getAttr(e);
  #v = P(() => ({
    ...uv({
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
    return r(this.#v);
  }
  set props(e) {
    g(this.#v, e);
  }
}
class Ul {
  static create(e) {
    return new Ul(e, yo.get());
  }
  opts;
  root;
  attachment;
  constructor(e, n) {
    this.opts = e, this.root = n, this.attachment = fr(this.opts.ref);
  }
  #e = P(() => ({
    id: this.opts.id.current,
    "aria-hidden": bl(!0),
    "data-disabled": vn(this.root.opts.disabled.current),
    "data-readonly": vn(this.root.opts.readonly.current),
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
const Mu = new pi("Calendar.Cell | RangeCalendar.Cell");
class ql {
  static create(e) {
    return Mu.set(new ql(e, yo.get()));
  }
  opts;
  root;
  #e = P(() => Nr(this.opts.date.current));
  get cellDate() {
    return r(this.#e);
  }
  set cellDate(e) {
    g(this.#e, e);
  }
  #t = P(() => this.root.opts.isDateUnavailable.current(this.opts.date.current));
  get isUnavailable() {
    return r(this.#t);
  }
  set isUnavailable(e) {
    g(this.#t, e);
  }
  #n = P(() => Vf(this.opts.date.current, ba()));
  get isDateToday() {
    return r(this.#n);
  }
  set isDateToday(e) {
    g(this.#n, e);
  }
  #r = P(() => !El(this.opts.date.current, this.opts.month.current));
  get isOutsideMonth() {
    return r(this.#r);
  }
  set isOutsideMonth(e) {
    g(this.#r, e);
  }
  #o = P(() => this.root.isOutsideVisibleMonths(this.opts.date.current));
  get isOutsideVisibleMonths() {
    return r(this.#o);
  }
  set isOutsideVisibleMonths(e) {
    g(this.#o, e);
  }
  #a = P(() => this.root.isDateDisabled(this.opts.date.current) || this.isOutsideMonth && this.root.opts.disableDaysOutsideMonth.current);
  get isDisabled() {
    return r(this.#a);
  }
  set isDisabled(e) {
    g(this.#a, e);
  }
  #i = P(() => pa(this.opts.date.current, this.root.opts.placeholder.current));
  get isFocusedDate() {
    return r(this.#i);
  }
  set isFocusedDate(e) {
    g(this.#i, e);
  }
  #l = P(() => this.root.isDateSelected(this.opts.date.current));
  get isSelectedDate() {
    return r(this.#l);
  }
  set isSelectedDate(e) {
    g(this.#l, e);
  }
  #s = P(() => this.root.formatter.custom(this.cellDate, {
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
    this.opts = e, this.root = n, this.attachment = fr(this.opts.ref);
  }
  #d = P(() => ({
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
  #c = P(() => this.isDisabled || this.isOutsideMonth && this.root.opts.disableDaysOutsideMonth.current || this.isUnavailable);
  get ariaDisabled() {
    return r(this.#c);
  }
  set ariaDisabled(e) {
    g(this.#c, e);
  }
  #u = P(() => ({
    "data-unavailable": vn(this.isUnavailable),
    "data-today": this.isDateToday ? "" : void 0,
    "data-outside-month": this.isOutsideMonth ? "" : void 0,
    "data-outside-visible-months": this.isOutsideVisibleMonths ? "" : void 0,
    "data-focused": this.isFocusedDate ? "" : void 0,
    "data-selected": vn(this.isSelectedDate),
    "data-value": this.opts.date.current.toString(),
    "data-type": Sg(this.opts.date.current),
    "data-disabled": vn(this.isDisabled || this.isOutsideMonth && this.root.opts.disableDaysOutsideMonth.current)
  }));
  get sharedDataAttrs() {
    return r(this.#u);
  }
  set sharedDataAttrs(e) {
    g(this.#u, e);
  }
  #h = P(() => ({
    id: this.opts.id.current,
    role: "gridcell",
    "aria-selected": To(this.isSelectedDate),
    "aria-disabled": To(this.ariaDisabled),
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
class Vl {
  static create(e) {
    return new Vl(e, Mu.get());
  }
  opts;
  cell;
  attachment;
  constructor(e, n) {
    this.opts = e, this.cell = n, this.onclick = this.onclick.bind(this), this.attachment = fr(this.opts.ref);
  }
  #e = P(() => this.cell.isOutsideMonth && this.cell.root.opts.disableDaysOutsideMonth.current || this.cell.isDisabled ? void 0 : this.cell.isFocusedDate ? 0 : -1);
  onclick(e) {
    this.cell.isDisabled || this.cell.root.handleCellClick(e, this.cell.opts.date.current);
  }
  #t = P(() => ({
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
  #n = P(() => ({
    id: this.opts.id.current,
    role: "button",
    "aria-label": this.cell.labelText,
    "aria-disabled": To(this.cell.ariaDisabled),
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
class jl {
  static create(e) {
    return new jl(e, yo.get());
  }
  opts;
  root;
  #e = P(() => this.root.isNextButtonDisabled);
  get isDisabled() {
    return r(this.#e);
  }
  set isDisabled(e) {
    g(this.#e, e);
  }
  attachment;
  constructor(e, n) {
    this.opts = e, this.root = n, this.onclick = this.onclick.bind(this), this.attachment = fr(this.opts.ref);
  }
  onclick(e) {
    this.isDisabled || this.root.nextPage();
  }
  #t = P(() => ({
    id: this.opts.id.current,
    role: "button",
    type: "button",
    "aria-label": "Next",
    "aria-disabled": To(this.isDisabled),
    "data-disabled": vn(this.isDisabled),
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
class Kl {
  static create(e) {
    return new Kl(e, yo.get());
  }
  opts;
  root;
  #e = P(() => this.root.isPrevButtonDisabled);
  get isDisabled() {
    return r(this.#e);
  }
  set isDisabled(e) {
    g(this.#e, e);
  }
  attachment;
  constructor(e, n) {
    this.opts = e, this.root = n, this.onclick = this.onclick.bind(this), this.attachment = fr(this.opts.ref);
  }
  onclick(e) {
    this.isDisabled || this.root.prevPage();
  }
  #t = P(() => ({
    id: this.opts.id.current,
    role: "button",
    type: "button",
    "aria-label": "Previous",
    "aria-disabled": To(this.isDisabled),
    "data-disabled": vn(this.isDisabled),
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
class Yl {
  static create(e) {
    return new Yl(e, yo.get());
  }
  opts;
  root;
  attachment;
  constructor(e, n) {
    this.opts = e, this.root = n, this.attachment = fr(this.opts.ref);
  }
  #e = P(() => ({
    id: this.opts.id.current,
    tabindex: -1,
    role: "grid",
    "aria-readonly": To(this.root.opts.readonly.current),
    "aria-disabled": To(this.root.opts.disabled.current),
    "data-readonly": vn(this.root.opts.readonly.current),
    "data-disabled": vn(this.root.opts.disabled.current),
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
class Ql {
  static create(e) {
    return new Ql(e, yo.get());
  }
  opts;
  root;
  attachment;
  constructor(e, n) {
    this.opts = e, this.root = n, this.attachment = fr(this.opts.ref);
  }
  #e = P(() => ({
    id: this.opts.id.current,
    "data-disabled": vn(this.root.opts.disabled.current),
    "data-readonly": vn(this.root.opts.readonly.current),
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
class zl {
  static create(e) {
    return new zl(e, yo.get());
  }
  opts;
  root;
  attachment;
  constructor(e, n) {
    this.opts = e, this.root = n, this.attachment = fr(this.opts.ref);
  }
  #e = P(() => ({
    id: this.opts.id.current,
    "data-disabled": vn(this.root.opts.disabled.current),
    "data-readonly": vn(this.root.opts.readonly.current),
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
class Wl {
  static create(e) {
    return new Wl(e, yo.get());
  }
  opts;
  root;
  attachment;
  constructor(e, n) {
    this.opts = e, this.root = n, this.attachment = fr(this.opts.ref);
  }
  #e = P(() => ({
    id: this.opts.id.current,
    "data-disabled": vn(this.root.opts.disabled.current),
    "data-readonly": vn(this.root.opts.readonly.current),
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
class Jl {
  static create(e) {
    return new Jl(e, yo.get());
  }
  opts;
  root;
  attachment;
  constructor(e, n) {
    this.opts = e, this.root = n, this.attachment = fr(this.opts.ref);
  }
  #e = P(() => ({
    id: this.opts.id.current,
    "data-disabled": vn(this.root.opts.disabled.current),
    "data-readonly": vn(this.root.opts.readonly.current),
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
class Gl {
  static create(e) {
    return new Gl(e, yo.get());
  }
  opts;
  root;
  attachment;
  constructor(e, n) {
    this.opts = e, this.root = n, this.attachment = fr(this.opts.ref);
  }
  #e = P(() => ({
    id: this.opts.id.current,
    "data-disabled": vn(this.root.opts.disabled.current),
    "data-readonly": vn(this.root.opts.readonly.current),
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
var mv = Q("<div><!></div>");
function Tu(t, e) {
  const n = Br();
  Qt(e, !0);
  let o = S(e, "children", 7), i = S(e, "child", 7), s = S(e, "ref", 15, null), d = S(e, "id", 23, () => on(n)), c = wr(e, [
    "$$slots",
    "$$events",
    "$$legacy",
    "$$host",
    "children",
    "child",
    "ref",
    "id"
  ]);
  const u = Vl.create({
    id: Me(() => d()),
    ref: Me(() => s(), (C) => s(C))
  }), _ = P(() => Pr(c, u.props));
  var v = {
    get children() {
      return o();
    },
    set children(C) {
      o(C), R();
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
      return d();
    },
    set id(C = on(n)) {
      d(C), R();
    }
  }, b = Pe(), x = J(b);
  {
    var w = (C) => {
      var m = Pe(), a = J(m);
      {
        let L = P(() => ({ props: r(_), ...u.snippetProps }));
        Yt(a, i, () => r(L));
      }
      D(C, m);
    }, E = (C) => {
      var m = mv();
      $r(m, () => ({ ...r(_) }));
      var a = T(m);
      {
        var L = (z) => {
          var ee = Pe(), I = J(ee);
          Yt(I, () => o() ?? hr, () => u.snippetProps), D(z, ee);
        }, oe = (z) => {
          var ee = ta();
          Ie(() => te(ee, u.cell.opts.date.current.day)), D(z, ee);
        };
        be(a, (z) => {
          o() ? z(L) : z(oe, -1);
        });
      }
      M(m), D(C, m);
    };
    be(x, (C) => {
      i() ? C(w) : C(E, -1);
    });
  }
  return D(t, b), zt(v);
}
Wt(Tu, { children: {}, child: {}, ref: {}, id: {} }, [], [], { mode: "open" });
var bv = Q("<table><!></table>");
function Ou(t, e) {
  const n = Br();
  Qt(e, !0);
  let o = S(e, "children", 7), i = S(e, "child", 7), s = S(e, "ref", 15, null), d = S(e, "id", 23, () => on(n)), c = wr(e, [
    "$$slots",
    "$$events",
    "$$legacy",
    "$$host",
    "children",
    "child",
    "ref",
    "id"
  ]);
  const u = Yl.create({
    id: Me(() => d()),
    ref: Me(() => s(), (C) => s(C))
  }), _ = P(() => Pr(c, u.props));
  var v = {
    get children() {
      return o();
    },
    set children(C) {
      o(C), R();
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
      return d();
    },
    set id(C = on(n)) {
      d(C), R();
    }
  }, b = Pe(), x = J(b);
  {
    var w = (C) => {
      var m = Pe(), a = J(m);
      Yt(a, i, () => ({ props: r(_) })), D(C, m);
    }, E = (C) => {
      var m = bv();
      $r(m, () => ({ ...r(_) }));
      var a = T(m);
      Yt(a, () => o() ?? hr), M(m), D(C, m);
    };
    be(x, (C) => {
      i() ? C(w) : C(E, -1);
    });
  }
  return D(t, b), zt(v);
}
Wt(Ou, { children: {}, child: {}, ref: {}, id: {} }, [], [], { mode: "open" });
var Cv = Q("<tbody><!></tbody>");
function Lu(t, e) {
  const n = Br();
  Qt(e, !0);
  let o = S(e, "children", 7), i = S(e, "child", 7), s = S(e, "ref", 15, null), d = S(e, "id", 23, () => on(n)), c = wr(e, [
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
    id: Me(() => d()),
    ref: Me(() => s(), (C) => s(C))
  }), _ = P(() => Pr(c, u.props));
  var v = {
    get children() {
      return o();
    },
    set children(C) {
      o(C), R();
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
      return d();
    },
    set id(C = on(n)) {
      d(C), R();
    }
  }, b = Pe(), x = J(b);
  {
    var w = (C) => {
      var m = Pe(), a = J(m);
      Yt(a, i, () => ({ props: r(_) })), D(C, m);
    }, E = (C) => {
      var m = Cv();
      $r(m, () => ({ ...r(_) }));
      var a = T(m);
      Yt(a, () => o() ?? hr), M(m), D(C, m);
    };
    be(x, (C) => {
      i() ? C(w) : C(E, -1);
    });
  }
  return D(t, b), zt(v);
}
Wt(Lu, { children: {}, child: {}, ref: {}, id: {} }, [], [], { mode: "open" });
var Pv = Q("<td><!></td>");
function Fu(t, e) {
  const n = Br();
  Qt(e, !0);
  let o = S(e, "children", 7), i = S(e, "child", 7), s = S(e, "ref", 15, null), d = S(e, "id", 23, () => on(n)), c = S(e, "date", 7), u = S(e, "month", 7), _ = wr(e, [
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
  const v = ql.create({
    id: Me(() => d()),
    ref: Me(() => s(), (a) => s(a)),
    date: Me(() => c()),
    month: Me(() => u())
  }), b = P(() => Pr(_, v.props));
  var x = {
    get children() {
      return o();
    },
    set children(a) {
      o(a), R();
    },
    get child() {
      return i();
    },
    set child(a) {
      i(a), R();
    },
    get ref() {
      return s();
    },
    set ref(a = null) {
      s(a), R();
    },
    get id() {
      return d();
    },
    set id(a = on(n)) {
      d(a), R();
    },
    get date() {
      return c();
    },
    set date(a) {
      c(a), R();
    },
    get month() {
      return u();
    },
    set month(a) {
      u(a), R();
    }
  }, w = Pe(), E = J(w);
  {
    var C = (a) => {
      var L = Pe(), oe = J(L);
      {
        let z = P(() => ({ props: r(b), ...v.snippetProps }));
        Yt(oe, i, () => r(z));
      }
      D(a, L);
    }, m = (a) => {
      var L = Pv();
      $r(L, () => ({ ...r(b) }));
      var oe = T(L);
      Yt(oe, () => o() ?? hr, () => v.snippetProps), M(L), D(a, L);
    };
    be(E, (a) => {
      i() ? a(C) : a(m, -1);
    });
  }
  return D(t, w), zt(x);
}
Wt(
  Fu,
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
var wv = Q("<thead><!></thead>");
function Hu(t, e) {
  const n = Br();
  Qt(e, !0);
  let o = S(e, "children", 7), i = S(e, "child", 7), s = S(e, "ref", 15, null), d = S(e, "id", 23, () => on(n)), c = wr(e, [
    "$$slots",
    "$$events",
    "$$legacy",
    "$$host",
    "children",
    "child",
    "ref",
    "id"
  ]);
  const u = zl.create({
    id: Me(() => d()),
    ref: Me(() => s(), (C) => s(C))
  }), _ = P(() => Pr(c, u.props));
  var v = {
    get children() {
      return o();
    },
    set children(C) {
      o(C), R();
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
      return d();
    },
    set id(C = on(n)) {
      d(C), R();
    }
  }, b = Pe(), x = J(b);
  {
    var w = (C) => {
      var m = Pe(), a = J(m);
      Yt(a, i, () => ({ props: r(_) })), D(C, m);
    }, E = (C) => {
      var m = wv();
      $r(m, () => ({ ...r(_) }));
      var a = T(m);
      Yt(a, () => o() ?? hr), M(m), D(C, m);
    };
    be(x, (C) => {
      i() ? C(w) : C(E, -1);
    });
  }
  return D(t, b), zt(v);
}
Wt(Hu, { children: {}, child: {}, ref: {}, id: {} }, [], [], { mode: "open" });
var xv = Q("<th><!></th>");
function Nu(t, e) {
  const n = Br();
  Qt(e, !0);
  let o = S(e, "children", 7), i = S(e, "child", 7), s = S(e, "ref", 15, null), d = S(e, "id", 23, () => on(n)), c = wr(e, [
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
    id: Me(() => d()),
    ref: Me(() => s(), (C) => s(C))
  }), _ = P(() => Pr(c, u.props));
  var v = {
    get children() {
      return o();
    },
    set children(C) {
      o(C), R();
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
      return d();
    },
    set id(C = on(n)) {
      d(C), R();
    }
  }, b = Pe(), x = J(b);
  {
    var w = (C) => {
      var m = Pe(), a = J(m);
      Yt(a, i, () => ({ props: r(_) })), D(C, m);
    }, E = (C) => {
      var m = xv();
      $r(m, () => ({ ...r(_) }));
      var a = T(m);
      Yt(a, () => o() ?? hr), M(m), D(C, m);
    };
    be(x, (C) => {
      i() ? C(w) : C(E, -1);
    });
  }
  return D(t, b), zt(v);
}
Wt(Nu, { children: {}, child: {}, ref: {}, id: {} }, [], [], { mode: "open" });
var Rv = Q("<tr><!></tr>");
function fl(t, e) {
  const n = Br();
  Qt(e, !0);
  let o = S(e, "children", 7), i = S(e, "child", 7), s = S(e, "ref", 15, null), d = S(e, "id", 23, () => on(n)), c = wr(e, [
    "$$slots",
    "$$events",
    "$$legacy",
    "$$host",
    "children",
    "child",
    "ref",
    "id"
  ]);
  const u = Wl.create({
    id: Me(() => d()),
    ref: Me(() => s(), (C) => s(C))
  }), _ = P(() => Pr(c, u.props));
  var v = {
    get children() {
      return o();
    },
    set children(C) {
      o(C), R();
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
      return d();
    },
    set id(C = on(n)) {
      d(C), R();
    }
  }, b = Pe(), x = J(b);
  {
    var w = (C) => {
      var m = Pe(), a = J(m);
      Yt(a, i, () => ({ props: r(_) })), D(C, m);
    }, E = (C) => {
      var m = Rv();
      $r(m, () => ({ ...r(_) }));
      var a = T(m);
      Yt(a, () => o() ?? hr), M(m), D(C, m);
    };
    be(x, (C) => {
      i() ? C(w) : C(E, -1);
    });
  }
  return D(t, b), zt(v);
}
Wt(fl, { children: {}, child: {}, ref: {}, id: {} }, [], [], { mode: "open" });
var Sv = Q("<header><!></header>");
function $u(t, e) {
  const n = Br();
  Qt(e, !0);
  let o = S(e, "children", 7), i = S(e, "child", 7), s = S(e, "ref", 15, null), d = S(e, "id", 23, () => on(n)), c = wr(e, [
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
    id: Me(() => d()),
    ref: Me(() => s(), (C) => s(C))
  }), _ = P(() => Pr(c, u.props));
  var v = {
    get children() {
      return o();
    },
    set children(C) {
      o(C), R();
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
      return d();
    },
    set id(C = on(n)) {
      d(C), R();
    }
  }, b = Pe(), x = J(b);
  {
    var w = (C) => {
      var m = Pe(), a = J(m);
      Yt(a, i, () => ({ props: r(_) })), D(C, m);
    }, E = (C) => {
      var m = Sv();
      $r(m, () => ({ ...r(_) }));
      var a = T(m);
      Yt(a, () => o() ?? hr), M(m), D(C, m);
    };
    be(x, (C) => {
      i() ? C(w) : C(E, -1);
    });
  }
  return D(t, b), zt(v);
}
Wt($u, { children: {}, child: {}, ref: {}, id: {} }, [], [], { mode: "open" });
var Iv = Q("<div><!></div>");
function Bu(t, e) {
  const n = Br();
  Qt(e, !0);
  let o = S(e, "children", 7), i = S(e, "child", 7), s = S(e, "ref", 15, null), d = S(e, "id", 23, () => on(n)), c = wr(e, [
    "$$slots",
    "$$events",
    "$$legacy",
    "$$host",
    "children",
    "child",
    "ref",
    "id"
  ]);
  const u = Ul.create({
    id: Me(() => d()),
    ref: Me(() => s(), (C) => s(C))
  }), _ = P(() => Pr(c, u.props));
  var v = {
    get children() {
      return o();
    },
    set children(C) {
      o(C), R();
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
      return d();
    },
    set id(C = on(n)) {
      d(C), R();
    }
  }, b = Pe(), x = J(b);
  {
    var w = (C) => {
      var m = Pe(), a = J(m);
      Yt(a, i, () => ({
        props: r(_),
        headingValue: u.root.headingValue
      })), D(C, m);
    }, E = (C) => {
      var m = Iv();
      $r(m, () => ({ ...r(_) }));
      var a = T(m);
      {
        var L = (z) => {
          var ee = Pe(), I = J(ee);
          Yt(I, () => o() ?? hr, () => ({ headingValue: u.root.headingValue })), D(z, ee);
        }, oe = (z) => {
          var ee = ta();
          Ie(() => te(ee, u.root.headingValue)), D(z, ee);
        };
        be(a, (z) => {
          o() ? z(L) : z(oe, -1);
        });
      }
      M(m), D(C, m);
    };
    be(x, (C) => {
      i() ? C(w) : C(E, -1);
    });
  }
  return D(t, b), zt(v);
}
Wt(Bu, { children: {}, child: {}, ref: {}, id: {} }, [], [], { mode: "open" });
var _v = Q("<button><!></button>");
function Uu(t, e) {
  const n = Br();
  Qt(e, !0);
  let o = S(e, "children", 7), i = S(e, "child", 7), s = S(e, "id", 23, () => on(n)), d = S(e, "ref", 15, null), c = S(e, "tabindex", 7, 0), u = wr(e, [
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
  const _ = jl.create({
    id: Me(() => s()),
    ref: Me(() => d(), (m) => d(m))
  }), v = P(() => Pr(u, _.props, { tabindex: c() }));
  var b = {
    get children() {
      return o();
    },
    set children(m) {
      o(m), R();
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
    set id(m = on(n)) {
      s(m), R();
    },
    get ref() {
      return d();
    },
    set ref(m = null) {
      d(m), R();
    },
    get tabindex() {
      return c();
    },
    set tabindex(m = 0) {
      c(m), R();
    }
  }, x = Pe(), w = J(x);
  {
    var E = (m) => {
      var a = Pe(), L = J(a);
      Yt(L, i, () => ({ props: r(v) })), D(m, a);
    }, C = (m) => {
      var a = _v();
      $r(a, () => ({ ...r(v) }));
      var L = T(a);
      Yt(L, () => o() ?? hr), M(a), D(m, a);
    };
    be(w, (m) => {
      i() ? m(E) : m(C, -1);
    });
  }
  return D(t, x), zt(b);
}
Wt(Uu, { children: {}, child: {}, id: {}, ref: {}, tabindex: {} }, [], [], { mode: "open" });
var Ev = Q("<button><!></button>");
function qu(t, e) {
  const n = Br();
  Qt(e, !0);
  let o = S(e, "children", 7), i = S(e, "child", 7), s = S(e, "id", 23, () => on(n)), d = S(e, "ref", 15, null), c = S(e, "tabindex", 7, 0), u = wr(e, [
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
  const _ = Kl.create({
    id: Me(() => s()),
    ref: Me(() => d(), (m) => d(m))
  }), v = P(() => Pr(u, _.props, { tabindex: c() }));
  var b = {
    get children() {
      return o();
    },
    set children(m) {
      o(m), R();
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
    set id(m = on(n)) {
      s(m), R();
    },
    get ref() {
      return d();
    },
    set ref(m = null) {
      d(m), R();
    },
    get tabindex() {
      return c();
    },
    set tabindex(m = 0) {
      c(m), R();
    }
  }, x = Pe(), w = J(x);
  {
    var E = (m) => {
      var a = Pe(), L = J(a);
      Yt(L, i, () => ({ props: r(v) })), D(m, a);
    }, C = (m) => {
      var a = Ev();
      $r(a, () => ({ ...r(v) }));
      var L = T(a);
      Yt(L, () => o() ?? hr), M(a), D(m, a);
    };
    be(w, (m) => {
      i() ? m(E) : m(C, -1);
    });
  }
  return D(t, x), zt(b);
}
Wt(qu, { children: {}, child: {}, id: {}, ref: {}, tabindex: {} }, [], [], { mode: "open" });
const Zl = Nc({
  component: "date-field",
  parts: ["input", "label", "segment"]
}), ns = {
  day: {
    min: 1,
    max: (t) => {
      const e = t.segmentValues.month, n = t.value.current ?? t.placeholder.current;
      return Ms(e ? n.set({ month: Number.parseInt(e) }) : n);
    },
    cycle: 1,
    padZero: !0
  },
  month: {
    min: 1,
    max: 12,
    cycle: 1,
    padZero: !0,
    getAnnouncement: (t, e) => e.placeholder.current ? `${t} - ${e.formatter.fullMonth(Nr(e.placeholder.current.set({ month: t })))}` : ""
  },
  year: { min: 1, max: 9999, cycle: 1, padZero: !1 },
  hour: {
    min: (t) => t.hourCycle.current === 12 ? 1 : 0,
    max: (t) => t.hourCycle.current === 24 ? 23 : t.hourCycle.current === 12 || Eu(t.locale.current) === 12 ? 12 : 23,
    cycle: 1,
    canBeZero: !0,
    padZero: !0
  },
  minute: { min: 0, max: 59, cycle: 1, canBeZero: !0, padZero: !0 },
  second: { min: 0, max: 59, cycle: 1, canBeZero: !0, padZero: !0 }
}, Ha = new pi("DateField.Root");
class Xl {
  static create(e, n) {
    return Ha.set(new Xl(e, n));
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
  descriptionId = $c();
  formatter;
  initialSegments;
  #e = me();
  get segmentValues() {
    return r(this.#e);
  }
  set segmentValues(e) {
    g(this.#e, e, !0);
  }
  announcer;
  #t = P(() => new Set(this.readonlySegments.current));
  get readonlySegmentsSet() {
    return r(this.#t);
  }
  set readonlySegmentsSet(e) {
    g(this.#t, e);
  }
  segmentStates = jd();
  #n = me(null);
  #r = me(null);
  #o = me(null);
  get descriptionNode() {
    return r(this.#o);
  }
  set descriptionNode(e) {
    g(this.#o, e, !0);
  }
  #a = me(null);
  get validationNode() {
    return r(this.#a);
  }
  set validationNode(e) {
    g(this.#a, e, !0);
  }
  states = jd();
  #i = me(null);
  get dayPeriodNode() {
    return r(this.#i);
  }
  set dayPeriodNode(e) {
    g(this.#i, e, !0);
  }
  rangeRoot = void 0;
  #l = me("");
  get name() {
    return r(this.#l);
  }
  set name(e) {
    g(this.#l, e, !0);
  }
  domContext = new ml(() => null);
  constructor(e, n) {
    this.rangeRoot = n, this.value = e.value, this.placeholder = n ? n.opts.placeholder : e.placeholder, this.validate = n ? bh(void 0) : e.validate, this.minValue = n ? n.opts.minValue : e.minValue, this.maxValue = n ? n.opts.maxValue : e.maxValue, this.disabled = n ? n.opts.disabled : e.disabled, this.readonly = n ? n.opts.readonly : e.readonly, this.granularity = n ? n.opts.granularity : e.granularity, this.readonlySegments = n ? n.opts.readonlySegments : e.readonlySegments, this.hourCycle = n ? n.opts.hourCycle : e.hourCycle, this.locale = n ? n.opts.locale : e.locale, this.hideTimeZone = n ? n.opts.hideTimeZone : e.hideTimeZone, this.required = n ? n.opts.required : e.required, this.onInvalid = n ? n.opts.onInvalid : e.onInvalid, this.errorMessageId = n ? n.opts.errorMessageId : e.errorMessageId, this.isInvalidProp = e.isInvalidProp, this.formatter = ku({
      initialLocale: this.locale.current,
      monthFormat: Me(() => "long"),
      yearFormat: Me(() => "numeric")
    }), this.initialSegments = Bi(this.inferredGranularity), this.segmentValues = this.initialSegments, this.announcer = ai(null), this.getFieldNode = this.getFieldNode.bind(this), this.updateSegment = this.updateSegment.bind(this), this.handleSegmentClick = this.handleSegmentClick.bind(this), this.getBaseSegmentAttrs = this.getBaseSegmentAttrs.bind(this), Xe(() => {
      so(() => {
        this.initialSegments = Bi(this.inferredGranularity);
      });
    }), Bc(() => {
      this.announcer = ai(this.domContext.getDocument());
    }), Ch(() => {
      n || Wg(this.descriptionId, this.domContext.getDocument());
    }), Xe(() => {
      n || this.formatter.getLocale() !== this.locale.current && this.formatter.setLocale(this.locale.current);
    }), Xe(() => {
      if (n) return;
      if (this.value.current) {
        const i = so(() => this.descriptionId);
        zg({
          id: i,
          formatter: this.formatter,
          value: this.value.current,
          doc: this.domContext.getDocument()
        });
      }
      const o = so(() => this.placeholder.current);
      this.value.current && o !== this.value.current && so(() => {
        this.value.current && (this.placeholder.current = this.value.current);
      });
    }), this.value.current && this.syncSegmentValues(this.value.current), Xe(() => {
      this.locale.current, this.value.current && this.syncSegmentValues(this.value.current), this.#s();
    }), Xe(() => {
      this.value.current === void 0 && (this.segmentValues = Bi(this.inferredGranularity));
    }), Za(() => this.validationStatus, () => {
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
    const n = Pi.map((o) => {
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
      const o = Fl.map((s) => {
        if (s === "dayPeriod")
          return this.states.dayPeriod.updating ? [s, this.states.dayPeriod.updating] : [s, this.formatter.dayPeriod(Nr(e))];
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
  #d = P(() => {
    const e = this.value.current;
    if (!e) return !1;
    const n = this.validate.current?.(e);
    if (n)
      return { reason: "custom", message: n };
    const o = this.minValue.current;
    if (o && Oa(e, o))
      return { reason: "min" };
    const i = this.maxValue.current;
    return i && Oa(i, e) ? { reason: "max" } : !1;
  });
  get validationStatus() {
    return r(this.#d);
  }
  set validationStatus(e) {
    g(this.#d, e);
  }
  #c = P(() => this.validationStatus === !1 ? !1 : (this.isInvalidProp.current, !0));
  get isInvalid() {
    return r(this.#c);
  }
  set isInvalid(e) {
    g(this.#c, e);
  }
  #u = P(() => {
    const e = this.granularity.current;
    return e || Yg(this.placeholder.current, this.granularity.current);
  });
  get inferredGranularity() {
    return r(this.#u);
  }
  set inferredGranularity(e) {
    g(this.#u, e);
  }
  #h = P(() => this.value.current !== void 0 ? this.value.current : this.placeholder.current);
  get dateRef() {
    return r(this.#h);
  }
  set dateRef(e) {
    g(this.#h, e);
  }
  #f = P(() => Bg({
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
  #g = P(() => this.allSegmentContent.arr);
  get segmentContents() {
    return r(this.#g);
  }
  set segmentContents(e) {
    g(this.#g, e);
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
    const o = this.disabled.current, i = this.readonly.current, s = this.readonlySegmentsSet;
    if (o || i || s.has(e)) return;
    const d = this.segmentValues;
    let c = d;
    const u = this.placeholder.current;
    if (Kg(d)) {
      const _ = d[e], v = n;
      if (e === "month") {
        const b = v(_);
        if (this.states.month.updating = b, b !== null && d.day !== null) {
          const x = u.set({ month: Number.parseInt(b) }), w = Ms(Nr(x));
          Number.parseInt(d.day) > w && (d.day = `${w}`);
        }
        c = { ...d, [e]: b };
      } else if (e === "dayPeriod") {
        const b = v(_);
        this.states.dayPeriod.updating = b;
        const x = this.value.current;
        if (x && "hour" in x) {
          const w = x.hour;
          b === "AM" ? w >= 12 && (d.hour = `${w - 12}`) : b === "PM" && w < 12 && (d.hour = `${w + 12}`);
        }
        c = { ...d, [e]: b };
      } else if (e === "hour") {
        const b = v(_);
        if (this.states.hour.updating = b, b !== null && d.dayPeriod !== null) {
          const x = this.formatter.dayPeriod(Nr(u.set({ hour: Number.parseInt(b) })), this.hourCycle.current);
          (x === "AM" || x === "PM") && (d.dayPeriod = x);
        }
        c = { ...d, [e]: b };
      } else if (e === "minute") {
        const b = v(_);
        this.states.minute.updating = b, c = { ...d, [e]: b };
      } else if (e === "second") {
        const b = v(_);
        this.states.second.updating = b, c = { ...d, [e]: b };
      } else if (e === "year") {
        const b = v(_);
        this.states.year.updating = b, c = { ...d, [e]: b };
      } else if (e === "day") {
        const b = v(_);
        this.states.day.updating = b, c = { ...d, [e]: b };
      } else {
        const b = v(_);
        c = { ...d, [e]: b };
      }
    } else if (wi(e)) {
      const _ = d[e], v = n, b = v(_);
      if (e === "month" && b !== null && d.day !== null) {
        this.states.month.updating = b;
        const x = u.set({ month: Number.parseInt(b) }), w = Ms(Nr(x));
        Number.parseInt(d.day) > w && (d.day = `${w}`), c = { ...d, [e]: b };
      } else if (e === "year") {
        const x = v(_);
        this.states.year.updating = x, c = { ...d, [e]: x };
      } else if (e === "day") {
        const x = v(_);
        this.states.day.updating = x, c = { ...d, [e]: x };
      } else
        c = { ...d, [e]: b };
    }
    this.segmentValues = c, jg(c, r(this.#n)) ? this.setValue(Vg({
      segmentObj: c,
      fieldNode: r(this.#n),
      dateRef: this.placeholder.current
    })) : (this.setValue(void 0), this.segmentValues = c);
  }
  handleSegmentClick(e) {
    this.disabled.current && e.preventDefault();
  }
  getBaseSegmentAttrs(e, n) {
    const o = this.readonlySegmentsSet.has(e), i = {
      "aria-invalid": bl(this.isInvalid),
      "aria-disabled": To(this.disabled.current),
      "aria-readonly": To(this.readonly.current || o),
      "data-invalid": vn(this.isInvalid),
      "data-disabled": vn(this.disabled.current),
      "data-readonly": vn(this.readonly.current || o),
      "data-segment": `${e}`,
      [Zl.segment]: ""
    };
    if (e === "literal") return i;
    const s = this.descriptionNode?.id, d = Qg(n, r(this.#n)) && s, c = this.errorMessageId?.current, u = d ? `${s} ${this.isInvalid && c ? c : ""}` : void 0, _ = !(this.readonly.current || o || this.disabled.current);
    return {
      ...i,
      "aria-labelledby": this.#v(n),
      contenteditable: _ ? "true" : void 0,
      "aria-describedby": u,
      tabindex: this.disabled.current ? void 0 : 0
    };
  }
}
class ed {
  static create(e) {
    return new ed(e, Ha.get());
  }
  opts;
  root;
  domContext;
  attachment;
  constructor(e, n) {
    this.opts = e, this.root = n, this.domContext = new ml(e.ref), this.root.domContext = this.domContext, this.attachment = fr(e.ref, (o) => this.root.setFieldNode(o)), Za(() => this.opts.name.current, (o) => {
      this.root.setName(o);
    });
  }
  #e = P(() => {
    if (!(!Ra || !this.domContext.getElementById(this.root.descriptionId)))
      return this.root.descriptionId;
  });
  #t = P(() => ({
    id: this.opts.id.current,
    role: "group",
    "aria-labelledby": this.root.getLabelNode()?.id ?? void 0,
    "aria-describedby": r(this.#e),
    "aria-disabled": To(this.root.disabled.current),
    "data-invalid": this.root.isInvalid ? "" : void 0,
    "data-disabled": vn(this.root.disabled.current),
    [Zl.input]: "",
    ...this.attachment
  }));
  get props() {
    return r(this.#t);
  }
  set props(e) {
    g(this.#t, e);
  }
}
class td {
  static create() {
    return new td(Ha.get());
  }
  root;
  #e = P(() => this.root.name !== "");
  get shouldRender() {
    return r(this.#e);
  }
  set shouldRender(e) {
    g(this.#e, e);
  }
  #t = P(() => this.root.value.current ? this.root.value.current.toString() : "");
  get isoValue() {
    return r(this.#t);
  }
  set isoValue(e) {
    g(this.#t, e);
  }
  constructor(e) {
    this.root = e;
  }
  #n = P(() => ({
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
class rs {
  opts;
  root;
  announcer;
  part;
  config;
  attachment;
  constructor(e, n, o, i) {
    this.opts = e, this.root = n, this.part = o, this.config = i, this.announcer = n.announcer, this.onkeydown = this.onkeydown.bind(this), this.onfocusout = this.onfocusout.bind(this), this.attachment = fr(e.ref);
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
    if (!(e.ctrlKey || e.metaKey || this.root.disabled.current) && !((this.part === "hour" || this.part === "minute" || this.part === "second") && !(this.part in n)) && (e.key !== yi && e.preventDefault(), !!Hl(e.key))) {
      if (ad(e.key)) {
        this.#o(n);
        return;
      }
      if (sd(e.key)) {
        this.#a(n);
        return;
      }
      if (vi(e.key)) {
        this.#i(e);
        return;
      }
      if (id(e.key)) {
        this.#l(e);
        return;
      }
      Ns(e.key) && Hs(e, this.root.getFieldNode());
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
    const i = this.#e(), s = Math.floor(i / 10), d = n === 0, c = this.part;
    this.root.updateSegment(this.part, (u) => {
      if (c in this.root.states && this.root.states[c].hasLeftFocus && (u = null, this.root.states[c].hasLeftFocus = !1), u === null)
        return d ? (c in this.root.states && (this.root.states[c].lastKeyZero = !0), this.announcer.announce("0"), "0") : (c in this.root.states && (this.root.states[c].lastKeyZero || n > s) && (o = !0), c in this.root.states && (this.root.states[c].lastKeyZero = !1), o && String(n).length === 1 ? (this.announcer.announce(n), `0${n}`) : `${n}`);
      if (c in this.root.states && this.root.states[c].lastKeyZero)
        return n !== 0 ? (o = !0, this.root.states[c].lastKeyZero = !1, `0${n}`) : this.part === "hour" && n === 0 && this.root.hourCycle.current === 24 ? (o = !0, this.root.states[c].lastKeyZero = !1, "00") : (this.part === "minute" || this.part === "second") && n === 0 ? (o = !0, this.root.states[c].lastKeyZero = !1, "00") : u;
      const _ = Number.parseInt(u + n.toString());
      return _ > i ? (o = !0, `0${n}`) : (o = !0, `${_}`);
    }), o && Au(e, this.root.getFieldNode());
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
    }), o && Du(e, this.root.getFieldNode());
  }
  onfocusout(e) {
    const n = this.part;
    n in this.root.states && (this.root.states[n].hasLeftFocus = !0), this.config.padZero && this.root.updateSegment(this.part, (o) => o && o.length === 1 ? `0${o}` : o);
  }
  getSegmentProps() {
    const e = this.root.segmentValues, n = this.root.placeholder.current, o = e[this.part] === null;
    let i = n;
    e[this.part] && (i = n.set({ [this.part]: Number.parseInt(e[this.part]) }));
    const s = i[this.part], d = this.#t(), c = this.#e();
    let u = o ? "Empty" : `${s}`;
    return this.part === "hour" && "dayPeriod" in e && e.dayPeriod && (u = o ? "Empty" : `${s} ${e.dayPeriod}`), {
      "aria-label": `${this.part}, `,
      "aria-valuemin": d,
      "aria-valuemax": c,
      "aria-valuenow": s,
      "aria-valuetext": u
    };
  }
  #s = P(() => ({
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
class Av extends rs {
  #e = [];
  #t = 0;
  constructor(e, n) {
    super(e, n, "year", ns.year);
  }
  onkeydown(e) {
    if (!(e.ctrlKey || e.metaKey || this.root.disabled.current) && (e.key !== yi && e.preventDefault(), !!Hl(e.key))) {
      if (ad(e.key)) {
        this.#n(), super.onkeydown(e);
        return;
      }
      if (sd(e.key)) {
        this.#n(), super.onkeydown(e);
        return;
      }
      if (vi(e.key)) {
        this.#o(e);
        return;
      }
      if (id(e.key)) {
        this.#a(e);
        return;
      }
      Ns(e.key) && Hs(e, this.root.getFieldNode());
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
        return this.#t > 0 && this.#e.length <= this.#t && s.length <= 4 ? (this.announcer.announce(d), s) : (this.announcer.announce(d), Wd(d));
      this.announcer.announce(d), n = !0;
      const u = `${d}`;
      return u.length > 4 ? u.slice(0, 4) : u;
    }), (this.#e.length === 4 || this.#e.length === this.#t) && (n = !0), n && Au(e, this.root.getFieldNode());
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
    }), n && Du(e, this.root.getFieldNode());
  }
  onfocusout(e) {
    this.root.states.year.hasLeftFocus = !0, this.#e = [], this.#n(), this.root.updateSegment("year", (n) => n && n.length !== 4 ? Wd(Number.parseInt(n)) : n);
  }
}
class Dv extends rs {
  constructor(e, n) {
    super(e, n, "day", ns.day);
  }
}
class kv extends rs {
  constructor(e, n) {
    super(e, n, "month", ns.month);
  }
}
class Mv extends rs {
  constructor(e, n) {
    super(e, n, "hour", ns.hour);
  }
  // Override to handle special hour logic
  onkeydown(e) {
    if (vi(e.key)) {
      const n = this.root.updateSegment.bind(this.root);
      this.root.updateSegment = (o, i) => {
        const s = n(o, i);
        return o === "hour" && "hour" in this.root.segmentValues && this.root.segmentValues.hour === "0" && this.root.dayPeriodNode && this.root.hourCycle.current !== 24 && (this.root.segmentValues.hour = "12"), s;
      };
    }
    super.onkeydown(e), this.root.updateSegment = this.root.updateSegment.bind(this.root);
  }
}
class Tv extends rs {
  constructor(e, n) {
    super(e, n, "minute", ns.minute);
  }
}
class Ov extends rs {
  constructor(e, n) {
    super(e, n, "second", ns.second);
  }
}
class nd {
  static create(e) {
    return new nd(e, Ha.get());
  }
  opts;
  root;
  attachment;
  #e;
  constructor(e, n) {
    this.opts = e, this.root = n, this.#e = this.root.announcer, this.onkeydown = this.onkeydown.bind(this), this.attachment = fr(e.ref, (o) => this.root.dayPeriodNode = o);
  }
  onkeydown(e) {
    if (!(e.ctrlKey || e.metaKey || this.root.disabled.current) && (e.key !== yi && e.preventDefault(), !!Fv(e.key))) {
      if (ad(e.key) || sd(e.key)) {
        this.root.updateSegment("dayPeriod", (n) => {
          if (n === "AM")
            return this.#e.announce("PM"), "PM";
          const o = "AM";
          return this.#e.announce(o), o;
        });
        return;
      }
      id(e.key) && (this.root.states.dayPeriod.hasLeftFocus = !1, this.root.updateSegment("dayPeriod", () => (this.#e.announce("AM"), "AM"))), (e.key === tl || e.key === Uc || nl) && this.root.updateSegment("dayPeriod", () => {
        const n = e.key === tl || e.key === nl ? "AM" : "PM";
        return this.#e.announce(n), n;
      }), Ns(e.key) && Hs(e, this.root.getFieldNode());
    }
  }
  #t = P(() => {
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
class rd {
  static create(e) {
    return new rd(e, Ha.get());
  }
  opts;
  root;
  attachment;
  constructor(e, n) {
    this.opts = e, this.root = n, this.attachment = fr(e.ref);
  }
  #e = P(() => ({
    id: this.opts.id.current,
    "aria-hidden": bl(!0),
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
class od {
  static create(e) {
    return new od(e, Ha.get());
  }
  opts;
  root;
  attachment;
  constructor(e, n) {
    this.opts = e, this.root = n, this.onkeydown = this.onkeydown.bind(this), this.attachment = fr(e.ref);
  }
  onkeydown(e) {
    e.key !== yi && e.preventDefault(), !this.root.disabled.current && Ns(e.key) && Hs(e, this.root.getFieldNode());
  }
  #e = P(() => ({
    role: "textbox",
    id: this.opts.id.current,
    "aria-label": "timezone, ",
    style: { caretColor: "transparent" },
    onkeydown: this.onkeydown,
    ...this.root.getBaseSegmentAttrs("timeZoneName", this.opts.id.current),
    "data-readonly": vn(!0),
    ...this.attachment
  }));
  get props() {
    return r(this.#e);
  }
  set props(e) {
    g(this.#e, e);
  }
}
class Lv {
  static create(e, n) {
    const o = Ha.get();
    switch (e) {
      case "day":
        return new Dv(n, o);
      case "month":
        return new kv(n, o);
      case "year":
        return new Av(n, o);
      case "hour":
        return new Mv(n, o);
      case "minute":
        return new Tv(n, o);
      case "second":
        return new Ov(n, o);
      case "dayPeriod":
        return new nd(n, o);
      case "literal":
        return new rd(n, o);
      case "timeZoneName":
        return new od(n, o);
    }
  }
}
function Fv(t) {
  return Hl(t) || t === tl || t === Uc || t === nl || t === Ph;
}
function ad(t) {
  return t === fi;
}
function sd(t) {
  return t === gi;
}
function id(t) {
  return t === Lc;
}
function Wd(t) {
  const n = 4 - String(t).length;
  return `${"0".repeat(n)}${t}`;
}
function Vu(t, e) {
  Qt(e, !0);
  const n = td.create();
  var o = Pe(), i = J(o);
  {
    var s = (d) => {
      wh(d, es(() => n.props));
    };
    be(i, (d) => {
      n.shouldRender && d(s);
    });
  }
  D(t, o), zt();
}
Wt(Vu, {}, [], [], { mode: "open" });
var Hv = Q("<div><!></div>"), Nv = Q("<!> <!>", 1);
function ju(t, e) {
  const n = Br();
  Qt(e, !0);
  let o = S(e, "id", 23, () => on(n)), i = S(e, "ref", 15, null), s = S(e, "name", 7, ""), d = S(e, "children", 7), c = S(e, "child", 7), u = wr(e, [
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
  const _ = ed.create({
    id: Me(() => o()),
    ref: Me(() => i(), (a) => i(a)),
    name: Me(() => s())
  }), v = P(() => Pr(u, _.props));
  var b = {
    get id() {
      return o();
    },
    set id(a = on(n)) {
      o(a), R();
    },
    get ref() {
      return i();
    },
    set ref(a = null) {
      i(a), R();
    },
    get name() {
      return s();
    },
    set name(a = "") {
      s(a), R();
    },
    get children() {
      return d();
    },
    set children(a) {
      d(a), R();
    },
    get child() {
      return c();
    },
    set child(a) {
      c(a), R();
    }
  }, x = Nv(), w = J(x);
  {
    var E = (a) => {
      var L = Pe(), oe = J(L);
      Yt(oe, c, () => ({
        props: r(v),
        segments: _.root.segmentContents
      })), D(a, L);
    }, C = (a) => {
      var L = Hv();
      $r(L, () => ({ ...r(v) }));
      var oe = T(L);
      Yt(oe, () => d() ?? hr, () => ({ segments: _.root.segmentContents })), M(L), D(a, L);
    };
    be(w, (a) => {
      c() ? a(E) : a(C, -1);
    });
  }
  var m = H(w, 2);
  return Vu(m, {}), D(t, x), zt(b);
}
Wt(ju, { id: {}, ref: {}, name: {}, children: {}, child: {} }, [], [], { mode: "open" });
var $v = Q("<span><!></span>");
function Ku(t, e) {
  const n = Br();
  Qt(e, !0);
  let o = S(e, "id", 23, () => on(n)), i = S(e, "ref", 15, null), s = S(e, "children", 7), d = S(e, "child", 7), c = S(e, "part", 7), u = wr(e, [
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
  const _ = Lv.create(c(), {
    id: Me(() => o()),
    ref: Me(() => i(), (m) => i(m))
  }), v = P(() => Pr(u, _.props));
  var b = {
    get id() {
      return o();
    },
    set id(m = on(n)) {
      o(m), R();
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
      return d();
    },
    set child(m) {
      d(m), R();
    },
    get part() {
      return c();
    },
    set part(m) {
      c(m), R();
    }
  }, x = Pe(), w = J(x);
  {
    var E = (m) => {
      var a = Pe(), L = J(a);
      Yt(L, d, () => ({ props: r(v) })), D(m, a);
    }, C = (m) => {
      var a = $v();
      $r(a, () => ({ ...r(v) }));
      var L = T(a);
      Yt(L, () => s() ?? hr), M(a), D(m, a);
    };
    be(w, (m) => {
      d() ? m(E) : m(C, -1);
    });
  }
  return D(t, x), zt(b);
}
Wt(Ku, { id: {}, ref: {}, children: {}, child: {}, part: {} }, [], [], { mode: "open" });
const Yu = new pi("DatePicker.Root");
class ld {
  static create(e) {
    return Yu.set(new ld(e));
  }
  opts;
  constructor(e) {
    this.opts = e;
  }
}
function Qu(t, e) {
  Qt(e, !0);
  let n = S(e, "open", 15, !1), o = S(e, "onOpenChange", 7, oo), i = S(e, "onOpenChangeComplete", 7, oo), s = S(e, "value", 15), d = S(e, "onValueChange", 7, oo), c = S(e, "placeholder", 15), u = S(e, "onPlaceholderChange", 7, oo), _ = S(e, "isDateUnavailable", 7, () => !1), v = S(e, "validate", 7, oo), b = S(e, "onInvalid", 7, oo), x = S(e, "minValue", 7), w = S(e, "maxValue", 7), E = S(e, "disabled", 7, !1), C = S(e, "readonly", 7, !1), m = S(e, "granularity", 7), a = S(e, "readonlySegments", 23, () => []), L = S(e, "hourCycle", 7), oe = S(e, "locale", 7), z = S(e, "hideTimeZone", 7, !1), ee = S(e, "required", 7, !1), I = S(e, "calendarLabel", 7, "Event"), fe = S(e, "disableDaysOutsideMonth", 7, !0), se = S(e, "preventDeselect", 7, !1), _e = S(e, "pagedNavigation", 7, !1), ve = S(e, "weekStartsOn", 7), Ee = S(e, "weekdayFormat", 7, "narrow"), Se = S(e, "isDateDisabled", 7, () => !1), Fe = S(e, "fixedWeeks", 7, !1), ye = S(e, "numberOfMonths", 7, 1), V = S(e, "closeOnDateSelect", 7, !0), Ne = S(e, "initialFocus", 7, !1), ue = S(e, "errorMessageId", 7), K = S(e, "children", 7), re = S(e, "monthFormat", 7, "long"), Ce = S(e, "yearFormat", 7, "numeric");
  const He = Rg({
    granularity: m(),
    defaultValue: s(),
    minValue: x(),
    maxValue: w()
  });
  function Ae() {
    c() === void 0 && c(He);
  }
  Ae(), Za.pre(() => c(), () => {
    Ae();
  });
  function k() {
    V() && n(!1);
  }
  const G = ld.create({
    open: Me(() => n(), ($) => {
      n($), o()($);
    }),
    value: Me(() => s(), ($) => {
      s($), d()($);
    }),
    placeholder: Me(() => c(), ($) => {
      c($), u()($);
    }),
    isDateUnavailable: Me(() => _()),
    minValue: Me(() => x()),
    maxValue: Me(() => w()),
    disabled: Me(() => E()),
    readonly: Me(() => C()),
    granularity: Me(() => m()),
    readonlySegments: Me(() => a()),
    hourCycle: Me(() => L()),
    locale: xh(() => oe()),
    hideTimeZone: Me(() => z()),
    required: Me(() => ee()),
    calendarLabel: Me(() => I()),
    disableDaysOutsideMonth: Me(() => fe()),
    preventDeselect: Me(() => se()),
    pagedNavigation: Me(() => _e()),
    weekStartsOn: Me(() => ve()),
    weekdayFormat: Me(() => Ee()),
    isDateDisabled: Me(() => Se()),
    fixedWeeks: Me(() => Fe()),
    numberOfMonths: Me(() => ye()),
    initialFocus: Me(() => Ne()),
    onDateSelect: Me(() => k),
    defaultPlaceholder: He,
    monthFormat: Me(() => re()),
    yearFormat: Me(() => Ce())
  });
  Rh.create({
    open: G.opts.open,
    onOpenChangeComplete: Me(() => i())
  }), Xl.create({
    value: G.opts.value,
    disabled: G.opts.disabled,
    readonly: G.opts.readonly,
    readonlySegments: G.opts.readonlySegments,
    validate: Me(() => v()),
    onInvalid: Me(() => b()),
    minValue: G.opts.minValue,
    maxValue: G.opts.maxValue,
    granularity: G.opts.granularity,
    hideTimeZone: G.opts.hideTimeZone,
    hourCycle: G.opts.hourCycle,
    locale: G.opts.locale,
    required: G.opts.required,
    placeholder: G.opts.placeholder,
    errorMessageId: Me(() => ue()),
    isInvalidProp: Me(() => {
    })
  });
  var O = {
    get open() {
      return n();
    },
    set open($ = !1) {
      n($), R();
    },
    get onOpenChange() {
      return o();
    },
    set onOpenChange($ = oo) {
      o($), R();
    },
    get onOpenChangeComplete() {
      return i();
    },
    set onOpenChangeComplete($ = oo) {
      i($), R();
    },
    get value() {
      return s();
    },
    set value($) {
      s($), R();
    },
    get onValueChange() {
      return d();
    },
    set onValueChange($ = oo) {
      d($), R();
    },
    get placeholder() {
      return c();
    },
    set placeholder($) {
      c($), R();
    },
    get onPlaceholderChange() {
      return u();
    },
    set onPlaceholderChange($ = oo) {
      u($), R();
    },
    get isDateUnavailable() {
      return _();
    },
    set isDateUnavailable($ = () => !1) {
      _($), R();
    },
    get validate() {
      return v();
    },
    set validate($ = oo) {
      v($), R();
    },
    get onInvalid() {
      return b();
    },
    set onInvalid($ = oo) {
      b($), R();
    },
    get minValue() {
      return x();
    },
    set minValue($) {
      x($), R();
    },
    get maxValue() {
      return w();
    },
    set maxValue($) {
      w($), R();
    },
    get disabled() {
      return E();
    },
    set disabled($ = !1) {
      E($), R();
    },
    get readonly() {
      return C();
    },
    set readonly($ = !1) {
      C($), R();
    },
    get granularity() {
      return m();
    },
    set granularity($) {
      m($), R();
    },
    get readonlySegments() {
      return a();
    },
    set readonlySegments($ = []) {
      a($), R();
    },
    get hourCycle() {
      return L();
    },
    set hourCycle($) {
      L($), R();
    },
    get locale() {
      return oe();
    },
    set locale($) {
      oe($), R();
    },
    get hideTimeZone() {
      return z();
    },
    set hideTimeZone($ = !1) {
      z($), R();
    },
    get required() {
      return ee();
    },
    set required($ = !1) {
      ee($), R();
    },
    get calendarLabel() {
      return I();
    },
    set calendarLabel($ = "Event") {
      I($), R();
    },
    get disableDaysOutsideMonth() {
      return fe();
    },
    set disableDaysOutsideMonth($ = !0) {
      fe($), R();
    },
    get preventDeselect() {
      return se();
    },
    set preventDeselect($ = !1) {
      se($), R();
    },
    get pagedNavigation() {
      return _e();
    },
    set pagedNavigation($ = !1) {
      _e($), R();
    },
    get weekStartsOn() {
      return ve();
    },
    set weekStartsOn($) {
      ve($), R();
    },
    get weekdayFormat() {
      return Ee();
    },
    set weekdayFormat($ = "narrow") {
      Ee($), R();
    },
    get isDateDisabled() {
      return Se();
    },
    set isDateDisabled($ = () => !1) {
      Se($), R();
    },
    get fixedWeeks() {
      return Fe();
    },
    set fixedWeeks($ = !1) {
      Fe($), R();
    },
    get numberOfMonths() {
      return ye();
    },
    set numberOfMonths($ = 1) {
      ye($), R();
    },
    get closeOnDateSelect() {
      return V();
    },
    set closeOnDateSelect($ = !0) {
      V($), R();
    },
    get initialFocus() {
      return Ne();
    },
    set initialFocus($ = !1) {
      Ne($), R();
    },
    get errorMessageId() {
      return ue();
    },
    set errorMessageId($) {
      ue($), R();
    },
    get children() {
      return K();
    },
    set children($) {
      K($), R();
    },
    get monthFormat() {
      return re();
    },
    set monthFormat($ = "long") {
      re($), R();
    },
    get yearFormat() {
      return Ce();
    },
    set yearFormat($ = "numeric") {
      Ce($), R();
    }
  }, X = Pe(), he = J(X);
  return Oe(he, () => Sh, ($, j) => {
    j($, {
      children: (We, je) => {
        var ae = Pe(), $e = J(ae);
        Yt($e, () => K() ?? hr), D(We, ae);
      },
      $$slots: { default: !0 }
    });
  }), D(t, X), zt(O);
}
Wt(
  Qu,
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
var Bv = Q("<div><!></div>");
function zu(t, e) {
  const n = Br();
  Qt(e, !0);
  let o = S(e, "children", 7), i = S(e, "child", 7), s = S(e, "id", 23, () => on(n)), d = S(e, "ref", 15, null), c = wr(e, [
    "$$slots",
    "$$events",
    "$$legacy",
    "$$host",
    "children",
    "child",
    "id",
    "ref"
  ]);
  const u = Yu.get(), _ = Bl.create({
    id: Me(() => s()),
    ref: Me(() => d(), (m) => d(m)),
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
  }), v = P(() => Pr(c, _.props));
  var b = {
    get children() {
      return o();
    },
    set children(m) {
      o(m), R();
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
    set id(m = on(n)) {
      s(m), R();
    },
    get ref() {
      return d();
    },
    set ref(m = null) {
      d(m), R();
    }
  }, x = Pe(), w = J(x);
  {
    var E = (m) => {
      var a = Pe(), L = J(a);
      {
        let oe = P(() => ({ props: r(v), ..._.snippetProps }));
        Yt(L, i, () => r(oe));
      }
      D(m, a);
    }, C = (m) => {
      var a = Bv();
      $r(a, () => ({ ...r(v) }));
      var L = T(a);
      Yt(L, () => o() ?? hr, () => _.snippetProps), M(a), D(m, a);
    };
    be(w, (m) => {
      i() ? m(E) : m(C, -1);
    });
  }
  return D(t, x), zt(b);
}
Wt(zu, { children: {}, child: {}, id: {}, ref: {} }, [], [], { mode: "open" });
function Wu(t, e) {
  Qt(e, !0);
  let n = S(e, "ref", 15, null), o = S(e, "onOpenAutoFocus", 7), i = wr(e, [
    "$$slots",
    "$$events",
    "$$legacy",
    "$$host",
    "ref",
    "onOpenAutoFocus"
  ]);
  const s = P(() => Pr({ onOpenAutoFocus: o() }, { onOpenAutoFocus: hv }));
  var d = {
    get ref() {
      return n();
    },
    set ref(c = null) {
      n(c), R();
    },
    get onOpenAutoFocus() {
      return o();
    },
    set onOpenAutoFocus(c) {
      o(c), R();
    }
  };
  return Ih(t, es(() => r(s), () => i, {
    get ref() {
      return n();
    },
    set ref(c) {
      n(c);
    }
  })), zt(d);
}
Wt(Wu, { ref: {}, onOpenAutoFocus: {} }, [], [], { mode: "open" });
function Ju(t, e) {
  Qt(e, !0);
  let n = S(e, "ref", 15, null), o = S(e, "onkeydown", 7), i = wr(e, [
    "$$slots",
    "$$events",
    "$$legacy",
    "$$host",
    "ref",
    "onkeydown"
  ]);
  function s(u) {
    if (Ns(u.key)) {
      const v = u.currentTarget.closest(Zl.selector("input"));
      if (!v) return;
      Hs(u, v);
    }
  }
  const d = P(() => Pr({ onkeydown: o() }, { onkeydown: s }));
  var c = {
    get ref() {
      return n();
    },
    set ref(u = null) {
      n(u), R();
    },
    get onkeydown() {
      return o();
    },
    set onkeydown(u) {
      o(u), R();
    }
  };
  return _h(t, es(() => i, { "data-segment": "trigger" }, () => r(d), {
    get ref() {
      return n();
    },
    set ref(u) {
      n(u);
    }
  })), zt(c);
}
Wt(Ju, { ref: {}, onkeydown: {} }, [], [], { mode: "open" });
var Uv = Q('<div class="copy-icon svg-icon" aria-hidden="true"></div> <span> </span>', 1), qv = Q('<div class="raw-json-icon svg-icon" aria-hidden="true"></div> <span> </span>', 1), Vv = Q('<div class="open-in-new-icon svg-icon" aria-hidden="true"></div> <span> </span>', 1), jv = Q("<!> <!>", 1), Kv = Q("<!> <!>", 1), Yv = Q("<!> <!>", 1), Qv = Q('<div class="broadcast-icon svg-icon" aria-hidden="true"></div> <span> </span>', 1), zv = Q('<div class="trash-icon svg-icon" aria-hidden="true"></div> <span> </span>', 1), Wv = Q("<!> <!>", 1), Jv = Q("<!> <!> <!> <!>", 1);
const Gv = {
  hash: "svelte-8tu42h",
  code: ".open-in-new-icon {mask-image:var(--ehagaki-icon-6f70656e5f696e5f6e65775f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}"
};
function As(t, e) {
  Qt(e, !0), Lo(t, Gv);
  const n = () => Ca(Fa, "$_", o), [o, i] = La(), s = (K) => {
    var re = Pe(), Ce = J(re);
    Oe(Ce, () => Gn, (He, Ae) => {
      Ae(He, {
        class: "menu-action-button",
        get onpointerdown() {
          return E();
        },
        get onSelect() {
          return C();
        },
        children: (k, G) => {
          var O = Uv(), X = H(J(O), 2), he = T(X, !0);
          M(X), Ie(($) => te(he, $), [
            () => u() ? n()("postHistory.copyFailed") : n()("postHistory.copyNevent")
          ]), D(k, O);
        },
        $$slots: { default: !0 }
      });
    }), D(K, re);
  }, d = (K) => {
    var re = Pe(), Ce = J(re);
    Oe(Ce, () => Gn, (He, Ae) => {
      Ae(He, {
        class: "menu-action-button",
        onSelect: () => L()(),
        children: (k, G) => {
          var O = qv(), X = H(J(O), 2), he = T(X, !0);
          M(X), Ie(($) => te(he, $), [() => n()("postHistory.rawJson")]), D(k, O);
        },
        $$slots: { default: !0 }
      });
    }), D(K, re);
  };
  let c = S(e, "order", 7), u = S(e, "copyFailed", 7), _ = S(e, "showBroadcast", 7), v = S(e, "broadcastSending", 7), b = S(e, "showDelete", 7), x = S(e, "showDeleteSeparator", 7), w = S(e, "deletionSending", 7), E = S(e, "onCopyPointerDown", 7), C = S(e, "onCopyNevent", 7), m = S(e, "externalClientLabel", 7, void 0), a = S(e, "onOpenExternalClient", 7, void 0), L = S(e, "onShowRawJson", 7), oe = S(e, "onBroadcastPointerDown", 7), z = S(e, "onBroadcastPost", 7), ee = S(e, "onOpenDeleteConfirm", 7);
  var I = {
    get order() {
      return c();
    },
    set order(K) {
      c(K), R();
    },
    get copyFailed() {
      return u();
    },
    set copyFailed(K) {
      u(K), R();
    },
    get showBroadcast() {
      return _();
    },
    set showBroadcast(K) {
      _(K), R();
    },
    get broadcastSending() {
      return v();
    },
    set broadcastSending(K) {
      v(K), R();
    },
    get showDelete() {
      return b();
    },
    set showDelete(K) {
      b(K), R();
    },
    get showDeleteSeparator() {
      return x();
    },
    set showDeleteSeparator(K) {
      x(K), R();
    },
    get deletionSending() {
      return w();
    },
    set deletionSending(K) {
      w(K), R();
    },
    get onCopyPointerDown() {
      return E();
    },
    set onCopyPointerDown(K) {
      E(K), R();
    },
    get onCopyNevent() {
      return C();
    },
    set onCopyNevent(K) {
      C(K), R();
    },
    get externalClientLabel() {
      return m();
    },
    set externalClientLabel(K = void 0) {
      m(K), R();
    },
    get onOpenExternalClient() {
      return a();
    },
    set onOpenExternalClient(K = void 0) {
      a(K), R();
    },
    get onShowRawJson() {
      return L();
    },
    set onShowRawJson(K) {
      L(K), R();
    },
    get onBroadcastPointerDown() {
      return oe();
    },
    set onBroadcastPointerDown(K) {
      oe(K), R();
    },
    get onBroadcastPost() {
      return z();
    },
    set onBroadcastPost(K) {
      z(K), R();
    },
    get onOpenDeleteConfirm() {
      return ee();
    },
    set onOpenDeleteConfirm(K) {
      ee(K), R();
    }
  }, fe = Jv(), se = J(fe);
  {
    var _e = (K) => {
      var re = jv(), Ce = J(re);
      Oe(Ce, () => Gn, (Ae, k) => {
        k(Ae, {
          class: "menu-action-button",
          get onSelect() {
            return a();
          },
          children: (G, O) => {
            var X = Vv(), he = H(J(X), 2), $ = T(he, !0);
            M(he), Ie(() => te($, m())), D(G, X);
          },
          $$slots: { default: !0 }
        });
      });
      var He = H(Ce, 2);
      Oe(He, () => Zo, (Ae, k) => {
        k(Ae, { class: "post-history-menu-separator" });
      }), D(K, re);
    };
    be(se, (K) => {
      m() && a() && K(_e);
    });
  }
  var ve = H(se, 2);
  {
    var Ee = (K) => {
      var re = Kv(), Ce = J(re);
      d(Ce);
      var He = H(Ce, 2);
      s(He), D(K, re);
    }, Se = (K) => {
      var re = Yv(), Ce = J(re);
      s(Ce);
      var He = H(Ce, 2);
      d(He), D(K, re);
    };
    be(ve, (K) => {
      c() === "raw-json-first" ? K(Ee) : K(Se, -1);
    });
  }
  var Fe = H(ve, 2);
  {
    var ye = (K) => {
      var re = Pe(), Ce = J(re);
      Oe(Ce, () => Gn, (He, Ae) => {
        Ae(He, {
          class: "menu-action-button",
          get disabled() {
            return v();
          },
          get onpointerdown() {
            return oe();
          },
          get onSelect() {
            return z();
          },
          children: (k, G) => {
            var O = Qv(), X = H(J(O), 2), he = T(X, !0);
            M(X), Ie(($) => te(he, $), [() => n()("postHistory.broadcast")]), D(k, O);
          },
          $$slots: { default: !0 }
        });
      }), D(K, re);
    };
    be(Fe, (K) => {
      _() && K(ye);
    });
  }
  var V = H(Fe, 2);
  {
    var Ne = (K) => {
      var re = Wv(), Ce = J(re);
      {
        var He = (k) => {
          var G = Pe(), O = J(G);
          Oe(O, () => Zo, (X, he) => {
            he(X, { class: "post-history-menu-separator" });
          }), D(k, G);
        };
        be(Ce, (k) => {
          x() && k(He);
        });
      }
      var Ae = H(Ce, 2);
      Oe(Ae, () => Gn, (k, G) => {
        G(k, {
          class: "menu-action-button menu-action-button-danger",
          get disabled() {
            return w();
          },
          onSelect: () => ee()(),
          children: (O, X) => {
            var he = zv(), $ = H(J(he), 2), j = T($, !0);
            M($), Ie((We) => te(j, We), [
              () => w() ? n()("postHistory.deleteSending") : n()("postHistory.delete")
            ]), D(O, he);
          },
          $$slots: { default: !0 }
        });
      }), D(K, re);
    };
    be(V, (K) => {
      b() && K(Ne);
    });
  }
  D(t, fe);
  var ue = zt(I);
  return i(), ue;
}
Wt(
  As,
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
var Zv = Q('<img class="post-history-related-avatar svelte-1g9bqtt"/>'), Xv = Q('<span class="post-history-related-avatar-placeholder svelte-1g9bqtt" aria-hidden="true"></span>'), ep = Q('<article class="post-history-related-card svelte-1g9bqtt"><!> <div class="post-history-related-card-body svelte-1g9bqtt"><div class="post-history-related-author svelte-1g9bqtt"><!> <span class="post-history-related-author-name svelte-1g9bqtt"> </span></div> <!> <!> <!></div></article>');
const tp = {
  hash: "svelte-1g9bqtt",
  code: `.post-history-related-card.svelte-1g9bqtt {display:grid;margin-inline-start:-2px;--post-history-related-card-bg: color-mix(
            in srgb,
            var(--dialog-bg),
            var(--border-hr) 24%
        );border-inline-start:2px solid
            color-mix(in srgb, var(--theme), transparent 45%);background:var(--post-history-related-card-bg);color:var(--text);font-size:0.9rem;}.post-history-related-card-body.svelte-1g9bqtt {display:grid;gap:2px;padding:2px 10px 0 8px;}.post-history-related-card .post-preview-footer {margin-inline:-8px -10px;}.post-history-related-author.svelte-1g9bqtt {display:flex;align-items:center;min-width:0;gap:8px;}.post-history-related-avatar.svelte-1g9bqtt,
    .post-history-related-avatar-placeholder.svelte-1g9bqtt {width:24px;height:24px;flex:0 0 auto;border-radius:50%;background:var(--border-hr);object-fit:cover;}.post-history-related-avatar-placeholder.svelte-1g9bqtt {display:inline-block;mask-image:var(--ehagaki-icon-6163636f756e745f636972636c655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);background-color:var(--text-muted);}.post-history-related-author-name.svelte-1g9bqtt {min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:600;}.post-history-related-card .post-history-related-content {margin:0;white-space:pre-wrap;overflow-wrap:anywhere;line-height:1.45;}`
};
function dd(t, e) {
  Qt(e, !0), Lo(t, tp);
  let n = S(e, "event", 7), o = S(e, "profile", 7, null), i = S(e, "media", 7, void 0), s = S(e, "model", 7, void 0), d = S(e, "emojiLoadStateByUrl", 23, () => ({})), c = S(e, "emojiImageMetaByUrl", 23, () => ({})), u = S(e, "scrollRoot", 7, null), _ = S(e, "onImageOpen", 7, void 0), v = S(e, "topActions", 7, void 0), b = S(e, "footerLeftExtras", 7, void 0), x = S(e, "footerActions", 7, void 0), w = S(e, "footerDetails", 7, void 0), E = S(e, "footerMenu", 7, void 0), C = P(() => {
    const V = o()?.displayName?.trim() || o()?.name?.trim();
    return V || Eh(Xc.npubEncode(n().pubkey), 12, 4);
  }), m = P(() => s() ?? rl({
    sourceContent: n().content,
    tags: n().tags,
    media: i()
  })), a = P(() => ol(n().created_at * 1e3));
  var L = {
    get event() {
      return n();
    },
    set event(V) {
      n(V), R();
    },
    get profile() {
      return o();
    },
    set profile(V = null) {
      o(V), R();
    },
    get media() {
      return i();
    },
    set media(V = void 0) {
      i(V), R();
    },
    get model() {
      return s();
    },
    set model(V = void 0) {
      s(V), R();
    },
    get emojiLoadStateByUrl() {
      return d();
    },
    set emojiLoadStateByUrl(V = {}) {
      d(V), R();
    },
    get emojiImageMetaByUrl() {
      return c();
    },
    set emojiImageMetaByUrl(V = {}) {
      c(V), R();
    },
    get scrollRoot() {
      return u();
    },
    set scrollRoot(V = null) {
      u(V), R();
    },
    get onImageOpen() {
      return _();
    },
    set onImageOpen(V = void 0) {
      _(V), R();
    },
    get topActions() {
      return v();
    },
    set topActions(V = void 0) {
      v(V), R();
    },
    get footerLeftExtras() {
      return b();
    },
    set footerLeftExtras(V = void 0) {
      b(V), R();
    },
    get footerActions() {
      return x();
    },
    set footerActions(V = void 0) {
      x(V), R();
    },
    get footerDetails() {
      return w();
    },
    set footerDetails(V = void 0) {
      w(V), R();
    },
    get footerMenu() {
      return E();
    },
    set footerMenu(V = void 0) {
      E(V), R();
    }
  }, oe = ep(), z = T(oe);
  Yt(z, () => v() ?? hr);
  var ee = H(z, 2), I = T(ee), fe = T(I);
  {
    var se = (V) => {
      var Ne = Zv();
      Ie(() => {
        cr(Ne, "src", o().picture), cr(Ne, "alt", r(C));
      }), D(V, Ne);
    }, _e = (V) => {
      var Ne = Xv();
      D(V, Ne);
    };
    be(fe, (V) => {
      o()?.picture ? V(se) : V(_e, -1);
    });
  }
  var ve = H(fe, 2), Ee = T(ve, !0);
  M(ve), M(I);
  var Se = H(I, 2);
  qc(Se, {
    get model() {
      return r(m);
    },
    get contentWarningEventId() {
      return n().id;
    },
    density: "compact",
    contentClass: "post-history-related-content",
    get emojiLoadStateByUrl() {
      return d();
    },
    get emojiImageMetaByUrl() {
      return c();
    },
    get scrollRoot() {
      return u();
    },
    get onImageOpen() {
      return _();
    }
  });
  var Fe = H(Se, 2);
  su(Fe, {
    get formattedDate() {
      return r(a);
    },
    density: "compact",
    get leftExtras() {
      return b();
    },
    get actions() {
      return x();
    },
    get trailing() {
      return E();
    }
  });
  var ye = H(Fe, 2);
  return Yt(ye, () => w() ?? hr), M(ee), M(oe), Ie(() => te(Ee, r(C))), D(t, oe), zt(L);
}
Wt(
  dd,
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
    footerDetails: {},
    footerMenu: {}
  },
  [],
  [],
  { mode: "open" }
);
var np = Q('<article class="post-history-quote-status-card svelte-1rnem6w"><div class="post-history-quote-status-body svelte-1rnem6w"><p> </p> <!></div></article>');
const rp = {
  hash: "svelte-1rnem6w",
  code: `.post-history-quote-status-card.svelte-1rnem6w {display:grid;border-inline-start:2px solid
            color-mix(in srgb, var(--theme), transparent 45%);background:color-mix(in srgb, var(--dialog-bg), var(--border-hr) 24%);color:var(--text);font-size:0.9rem;}.post-history-quote-status-body.svelte-1rnem6w {display:grid;gap:8px;padding:2px 10px 10px;}.post-history-quote-status-message.svelte-1rnem6w {margin:0;color:var(--text-muted);line-height:1.45;}.post-history-quote-status-error.svelte-1rnem6w {color:var(--danger);}.post-history-quote-retry-button {justify-self:start;}`
};
function Gu(t, e) {
  Qt(e, !0), Lo(t, rp);
  const n = () => Ca(Fa, "$_", o), [o, i] = La();
  let s = S(e, "preview", 7), d = S(e, "model", 7, void 0), c = S(e, "emojiLoadStateByUrl", 23, () => ({})), u = S(e, "emojiImageMetaByUrl", 23, () => ({})), _ = S(e, "scrollRoot", 7, null), v = S(e, "onImageOpen", 7, void 0), b = S(e, "onRetry", 7, void 0), x = S(e, "footerActions", 7, void 0), w = S(e, "footerDetails", 7, void 0), E = S(e, "footerMenu", 7, void 0);
  function C() {
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
  var m = {
    get preview() {
      return s();
    },
    set preview(I) {
      s(I), R();
    },
    get model() {
      return d();
    },
    set model(I = void 0) {
      d(I), R();
    },
    get emojiLoadStateByUrl() {
      return c();
    },
    set emojiLoadStateByUrl(I = {}) {
      c(I), R();
    },
    get emojiImageMetaByUrl() {
      return u();
    },
    set emojiImageMetaByUrl(I = {}) {
      u(I), R();
    },
    get scrollRoot() {
      return _();
    },
    set scrollRoot(I = null) {
      _(I), R();
    },
    get onImageOpen() {
      return v();
    },
    set onImageOpen(I = void 0) {
      v(I), R();
    },
    get onRetry() {
      return b();
    },
    set onRetry(I = void 0) {
      b(I), R();
    },
    get footerActions() {
      return x();
    },
    set footerActions(I = void 0) {
      x(I), R();
    },
    get footerDetails() {
      return w();
    },
    set footerDetails(I = void 0) {
      w(I), R();
    },
    get footerMenu() {
      return E();
    },
    set footerMenu(I = void 0) {
      E(I), R();
    }
  }, a = Pe(), L = J(a);
  {
    var oe = (I) => {
      dd(I, {
        get event() {
          return s().event;
        },
        get profile() {
          return s().profile;
        },
        get model() {
          return d();
        },
        get emojiLoadStateByUrl() {
          return c();
        },
        get emojiImageMetaByUrl() {
          return u();
        },
        get scrollRoot() {
          return _();
        },
        get onImageOpen() {
          return v();
        },
        get footerActions() {
          return x();
        },
        get footerDetails() {
          return w();
        },
        get footerMenu() {
          return E();
        }
      });
    }, z = (I) => {
      var fe = np(), se = T(fe), _e = T(se);
      let ve;
      var Ee = T(_e, !0);
      M(_e);
      var Se = H(_e, 2);
      {
        var Fe = (ye) => {
          ar(ye, {
            type: "button",
            className: "post-history-quote-retry-button",
            onClick: () => b()?.(s().eventId),
            children: (V, Ne) => {
              Ma();
              var ue = ta();
              Ie((K) => te(ue, K), [() => n()("postHistory.contextRetry")]), D(V, ue);
            },
            $$slots: { default: !0 }
          });
        };
        be(Se, (ye) => {
          s().status === "error" && ye(Fe);
        });
      }
      M(se), M(fe), Ie(
        (ye) => {
          ve = ko(_e, 1, "post-history-quote-status-message svelte-1rnem6w", null, ve, {
            "post-history-quote-status-error": s().status === "error"
          }), te(Ee, ye);
        },
        [() => C()]
      ), D(I, fe);
    };
    be(L, (I) => {
      s().status === "resolved" ? I(oe) : I(z, -1);
    });
  }
  D(t, a);
  var ee = zt(m);
  return i(), ee;
}
Wt(
  Gu,
  {
    preview: {},
    model: {},
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
const op = 500, ap = 250, sp = /^[0-9a-f]{64}$/;
function ip() {
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
function lp(t) {
  return { ...t };
}
function dp(t) {
  return t.tags.filter(
    (e) => e[0] === "e" && typeof e[1] == "string" && sp.test(e[1])
  ).length;
}
class cp {
  postHistoryRepository;
  deletionRequestsRepository;
  constructor(e = {}) {
    this.postHistoryRepository = e.postHistoryRepository ?? lt, this.deletionRequestsRepository = e.deletionRequestsRepository ?? Ls;
  }
  async importFile(e) {
    const n = ip(), o = /* @__PURE__ */ new Set(), i = [];
    let s = !1, d = null;
    const c = Number.isFinite(e.file.size) && e.file.size > 0 ? e.file.size : 0;
    let u = 0;
    const _ = () => n.invalidJsonCount > 0 || n.invalidStructureCount > 0 || n.invalidIdOrSignatureCount > 0, v = () => e.signal?.aborted ? "cancelled" : e.getCurrentPubkeyHex() !== e.ownerPubkeyHex ? "account-changed" : null, b = (z = !1) => {
      if (!e.onProgress)
        return;
      const ee = performance.now();
      !z && d !== null && ee - d < ap || (d = ee, e.onProgress({
        result: lp(n),
        processedBytes: u,
        totalBytes: c
      }));
    }, x = (z) => {
      z <= 0 || (u = Math.min(
        c,
        Math.max(u, u + z)
      ));
    }, w = async () => {
      if (i.length === 0)
        return v();
      const z = v();
      if (z)
        return i.length = 0, z;
      const ee = i.filter((se) => se.type === "post").map((se) => ({
        event: se.event,
        attestation: se.attestation
      })), I = i.filter((se) => se.type === "deletion").map((se) => se.event);
      if (i.length = 0, ee.length > 0)
        try {
          const se = await this.postHistoryRepository.upsertFetchedEvents({
            events: ee
          });
          n.insertedPostCount += se.insertedCount, n.updatedPostCount += se.updatedCount, n.unchangedPostCount += se.unchangedCount, n.appliedDeletionPostCount += se.appliedDeletionCount;
        } catch {
          n.failedPostEventCount += ee.length, s = !0;
        }
      const fe = v();
      if (fe)
        return fe;
      if (I.length > 0)
        try {
          const se = await this.deletionRequestsRepository.upsertImportedDeletionEvents({
            ownerPubkeyHex: e.ownerPubkeyHex,
            deletionEvents: I
          });
          n.insertedDeletionRequestCount += se.insertedCount, n.updatedDeletionRequestCount += se.updatedCount, n.unchangedDeletionRequestCount += se.unchangedCount, n.unsupportedDeletionEventCount += se.ignoredCount, n.appliedDeletionPostCount += se.appliedDeletionCount;
        } catch {
          n.failedDeletionEventCount += I.length, s = !0;
        }
      return b(), v();
    }, E = async (z) => {
      const ee = v();
      if (ee)
        return ee;
      if (z.trim().length === 0)
        return null;
      n.nonEmptyLineCount += 1;
      let I;
      try {
        I = JSON.parse(z);
      } catch {
        return n.invalidJsonCount += 1, null;
      }
      if (!Rl(I))
        return n.invalidStructureCount += 1, null;
      const fe = I;
      if (fe.pubkey !== e.ownerPubkeyHex)
        return n.otherAccountCount += 1, null;
      if (fe.kind !== 1 && fe.kind !== 42 && fe.kind !== 5)
        return n.unsupportedKindCount += 1, null;
      const se = Ah(fe);
      if (!se)
        return n.invalidIdOrSignatureCount += 1, null;
      if (o.has(fe.id))
        return n.fileDuplicateCount += 1, null;
      if (o.add(fe.id), fe.kind === 1 || fe.kind === 42)
        n.uniquePostEventCount += 1, i.push({ type: "post", ...se });
      else if (fe.kind === 5) {
        n.uniqueDeletionEventCount += 1;
        const _e = dp(fe);
        if (n.validDeletionETagCount += _e, _e === 0)
          return n.unsupportedDeletionEventCount += 1, null;
        i.push({ type: "deletion", ...se });
      }
      return i.length >= op ? w() : null;
    };
    let C;
    try {
      C = e.file.stream().getReader();
    } catch {
      return n.status = "failed", b(!0), n;
    }
    const m = () => {
      C.cancel().catch(() => {
      });
    };
    e.signal?.addEventListener("abort", m, { once: !0 });
    const a = new TextDecoder("utf-8", { fatal: !0 });
    let L = "";
    try {
      for (; ; ) {
        const z = v();
        if (z)
          return n.status = z, await C.cancel().catch(() => {
          }), i.length = 0, b(!0), n;
        const ee = await C.read();
        if (ee.done) {
          if (L += a.decode(), L.length > 0) {
            const fe = await E(L.replace(/\r$/, ""));
            if (fe)
              return n.status = fe, i.length = 0, b(!0), n;
          }
          break;
        }
        L += a.decode(ee.value, { stream: !0 });
        const I = L.split(`
`);
        L = I.pop() ?? "";
        for (const fe of I) {
          const se = await E(fe.replace(/\r$/, ""));
          if (se)
            return n.status = se, await C.cancel().catch(() => {
            }), i.length = 0, b(!0), n;
        }
        x(ee.value.byteLength), b();
      }
    } catch {
      const z = v();
      if (z)
        return n.status = z, i.length = 0, b(!0), n;
      const ee = await w();
      return ee ? (n.status = ee, b(!0), n) : (n.status = n.nonEmptyLineCount > 0 ? "partial" : "failed", b(!0), n);
    } finally {
      e.signal?.removeEventListener("abort", m), C.releaseLock();
    }
    const oe = await w();
    return oe ? (n.status = oe, b(!0), n) : (n.status = s || _() ? "partial" : "completed", b(!0), n);
  }
}
const up = new cp();
var hp = Q('<div class="xmark-icon svg-icon svelte-1qfqhib" aria-hidden="true"></div>'), fp = Q('<span class="import-icon svg-icon svelte-1qfqhib" aria-hidden="true"></span> <span> </span>', 1), gp = Q('<div aria-live="polite"> </div>'), vp = Q('<div class="import-progress-indicator"></div>'), pp = Q('<div class="import-progress svelte-1qfqhib"><!> <div class="import-progress-summary svelte-1qfqhib"><span class="import-progress-metric svelte-1qfqhib"><span> </span> <span class="import-progress-number svelte-1qfqhib"> </span></span> <span class="import-progress-metric svelte-1qfqhib"><span> </span> <span class="import-progress-number svelte-1qfqhib"> </span></span> <span class="import-progress-metric svelte-1qfqhib"><span> </span> <span class="import-progress-number svelte-1qfqhib"> </span></span></div> <!></div>'), yp = Q('<div class="import-results svelte-1qfqhib"><section aria-labelledby="post-history-import-input-heading" class="svelte-1qfqhib"><h3 id="post-history-import-input-heading" class="svelte-1qfqhib"> </h3> <dl class="svelte-1qfqhib"><div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div> <div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div> <div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div> <div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div> <div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div> <div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div> <div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div></dl></section> <section aria-labelledby="post-history-import-post-heading" class="svelte-1qfqhib"><h3 id="post-history-import-post-heading" class="svelte-1qfqhib"> </h3> <dl class="svelte-1qfqhib"><div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div> <div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div> <div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div> <div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div> <div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div> <div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div></dl></section> <section aria-labelledby="post-history-import-deletion-heading" class="svelte-1qfqhib"><h3 id="post-history-import-deletion-heading" class="svelte-1qfqhib"> </h3> <dl class="svelte-1qfqhib"><div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div> <div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div> <div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div> <div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div> <div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div> <div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div> <div class="svelte-1qfqhib"><dt class="svelte-1qfqhib"> </dt><dd class="svelte-1qfqhib"> </dd></div></dl></section></div>'), mp = Q('<div class="import-heading svelte-1qfqhib"><h2 class="svelte-1qfqhib"> </h2> <p class="svelte-1qfqhib"> </p></div> <input class="visually-hidden import-file-input" type="file"/> <div role="presentation"><!> <p class="import-drop-hint svelte-1qfqhib"> </p></div> <!> <!>', 1);
const bp = {
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
function Zu(t, e) {
  Qt(e, !0), Lo(t, bp);
  const n = () => Ca(Fa, "$_", o), [o, i] = La();
  let s = S(e, "open", 15, !1), d = S(e, "ownerPubkeyHex", 7), c = S(e, "getCurrentPubkeyHex", 7), u = S(e, "onOpenChange", 7, void 0), _ = S(e, "onImported", 7, void 0), v = me(null), b = me(!1), x = me(null), w = me(null), E = me(0), C = me(0), m = me(0), a = me(0), L = null, oe = null, z = null, ee = 0, I = !1, fe = P(() => r(w)?.processedBytes ?? r(E)), se = P(() => r(w)?.totalBytes ?? r(C)), _e = P(() => r(se) <= 0 ? 0 : Math.min(100, Math.max(0, Math.round(r(fe) / r(se) * 100)))), ve = P(() => {
    if (r(fe) <= 0 || r(se) <= 0 || r(fe) >= r(se) || r(m) < 1e3)
      return null;
    const ae = r(fe) / r(m), $e = (r(se) - r(fe)) / ae;
    return Number.isFinite($e) && $e >= 0 ? $e : null;
  }), Ee = P(() => r(b) ? r(ve) === null ? n()("postHistory.importRemainingTimeCalculating") : Se(r(ve)) : r(x)?.status === "completed" || r(x)?.status === "partial" ? Se(0) : n()("postHistory.importRemainingTimeUnavailable"));
  function Se(ae) {
    const $e = Math.max(0, Math.floor(ae / 1e3)), Je = String($e % 60).padStart(2, "0"), ut = Math.floor($e / 60), pt = ut % 60;
    return ut < 60 ? `${pt}:${Je}` : `${Math.floor(ut / 60)}:${String(pt).padStart(2, "0")}:${Je}`;
  }
  function Fe() {
    z !== null && g(m, Math.max(0, performance.now() - z), !0);
  }
  function ye() {
    oe !== null && (clearInterval(oe), oe = null), z = null;
  }
  function V() {
    ye(), g(m, 0), z = performance.now(), oe = setInterval(Fe, 1e3);
  }
  function Ne() {
    ye(), g(w, null), g(E, 0), g(C, 0), g(m, 0);
  }
  function ue(ae) {
    return `translate: -${100 - ae}% 0;`;
  }
  let K = P(() => r(b) ? "postHistory.importReading" : r(x) ? r(x).status === "completed" ? "postHistory.importComplete" : r(x).status === "partial" ? "postHistory.importPartial" : r(x).status === "account-changed" ? "postHistory.importAccountChanged" : r(x).status === "cancelled" ? "postHistory.importCancelled" : "postHistory.importFailed" : null);
  function re() {
    g(x, null), g(b, !1), Ne(), g(a, 0), L = null, r(v) && (r(v).value = "");
  }
  function Ce() {
    ee += 1, L?.abort(), L = null, g(b, !1), Ne(), g(a, 0);
  }
  function He(ae) {
    ae || Ce(), u()?.(ae);
  }
  function Ae() {
    !r(b) && d() && r(v)?.click();
  }
  function k(ae) {
    return ae ? Array.from(ae.types).includes("Files") || ae.files.length > 0 : !1;
  }
  function G(ae) {
    k(ae.dataTransfer) && (ae.preventDefault(), g(a, r(a) + 1));
  }
  function O(ae) {
    ae.preventDefault(), k(ae.dataTransfer);
  }
  function X(ae) {
    r(a) === 0 && !k(ae.dataTransfer) || g(a, Math.max(0, r(a) - 1), !0);
  }
  function he(ae) {
    if (ae.preventDefault(), !k(ae.dataTransfer))
      return;
    g(a, 0);
    const $e = ae.dataTransfer?.files[0];
    $e && $($e);
  }
  async function $(ae) {
    if (r(b) || !d())
      return;
    const $e = ++ee, Je = new AbortController();
    L = Je, g(b, !0), g(x, null), g(w, null), g(E, 0), g(C, Number.isFinite(ae.size) && ae.size > 0 ? ae.size : 0, !0), V();
    try {
      const ut = await up.importFile({
        file: ae,
        ownerPubkeyHex: d(),
        getCurrentPubkeyHex: c(),
        signal: Je.signal,
        onProgress: (yt) => {
          $e === ee && s() && (g(
            w,
            {
              result: { ...yt.result },
              processedBytes: yt.processedBytes,
              totalBytes: yt.totalBytes
            },
            !0
          ), g(E, yt.processedBytes, !0), g(C, yt.totalBytes, !0), g(x, { ...yt.result }, !0), Fe());
        }
      });
      if ($e !== ee || !s())
        return;
      g(x, ut, !0), ut.insertedPostCount + ut.updatedPostCount + ut.appliedDeletionPostCount > 0 && await _()?.();
    } finally {
      $e === ee && (g(b, !1), ye(), L = null);
    }
  }
  async function j(ae) {
    const $e = ae.currentTarget, Je = $e.files?.[0];
    $e.value = "", Je && await $(Je);
  }
  Xe(() => {
    s() && !I ? re() : !s() && I && Ce(), I = s();
  }), ts(ye);
  var We = {
    get open() {
      return s();
    },
    set open(ae = !1) {
      s(ae), R();
    },
    get ownerPubkeyHex() {
      return d();
    },
    set ownerPubkeyHex(ae) {
      d(ae), R();
    },
    get getCurrentPubkeyHex() {
      return c();
    },
    set getCurrentPubkeyHex(ae) {
      c(ae), R();
    },
    get onOpenChange() {
      return u();
    },
    set onOpenChange(ae = void 0) {
      u(ae), R();
    },
    get onImported() {
      return _();
    },
    set onImported(ae = void 0) {
      _(ae), R();
    }
  };
  {
    const ae = (ut) => {
      var pt = Pe(), yt = J(pt);
      {
        const vt = (ot, Ge) => {
          let ne = () => Ge?.().props;
          {
            let It = P(() => n()("global.close"));
            ar(ot, es(ne, {
              className: "modal-close",
              shape: "square",
              get ariaLabel() {
                return r(It);
              },
              children: (ht, an) => {
                var sn = hp();
                D(ht, sn);
              },
              $$slots: { default: !0 }
            }));
          }
        };
        Oe(yt, () => au, (ot, Ge) => {
          Ge(ot, { child: vt, $$slots: { child: !0 } });
        });
      }
      D(ut, pt);
    };
    let $e = P(() => n()("postHistory.importTitle")), Je = P(() => n()("postHistory.importDescription"));
    ou(t, {
      onOpenChange: He,
      get title() {
        return r($e);
      },
      get description() {
        return r(Je);
      },
      contentClass: "post-history-import-dialog",
      footerVariant: "close-button",
      initialFocus: "content",
      get open() {
        return s();
      },
      set open(ut) {
        s(ut);
      },
      footer: ae,
      children: (ut, pt) => {
        var yt = mp(), vt = J(yt), ot = T(vt), Ge = T(ot, !0);
        M(ot);
        var ne = H(ot, 2), It = T(ne, !0);
        M(ne), M(vt);
        var ht = H(vt, 2);
        Rs(ht, (mt) => g(v, mt), () => r(v));
        var an = H(ht, 2);
        let sn;
        var ln = T(an);
        {
          let mt = P(() => r(b) || !d()), Ut = P(() => n()("postHistory.importChooseFile"));
          ar(ln, {
            className: "post-history-import-file-button",
            variant: "default",
            shape: "pill",
            get disabled() {
              return r(mt);
            },
            get ariaLabel() {
              return r(Ut);
            },
            onClick: Ae,
            children: (Ft, Ht) => {
              var Rt = fp(), Xt = H(J(Rt), 2), qt = T(Xt, !0);
              M(Xt), Ie((Vt) => te(qt, Vt), [() => n()("postHistory.importChooseFile")]), D(Ft, Rt);
            },
            $$slots: { default: !0 }
          });
        }
        var Ke = H(ln, 2), ft = T(Ke, !0);
        M(Ke), M(an);
        var Ye = H(an, 2);
        {
          var _t = (mt) => {
            var Ut = pp(), Ft = T(Ut);
            {
              var Ht = (In) => {
                var Hn = gp();
                let sr;
                var xr = T(Hn, !0);
                M(Hn), Ie(
                  (ir) => {
                    sr = ko(Hn, 1, "import-progress-status svelte-1qfqhib", null, sr, {
                      "import-progress-status-error": r(x)?.status === "failed"
                    }), te(xr, ir);
                  },
                  [() => n()(r(K))]
                ), D(In, Hn);
              };
              be(Ft, (In) => {
                r(K) && In(Ht);
              });
            }
            var Rt = H(Ft, 2), Xt = T(Rt), qt = T(Xt), Vt = T(qt, !0);
            M(qt);
            var Et = H(qt, 2), et = T(Et);
            M(Et), M(Xt);
            var en = H(Xt, 2), dt = T(en), dn = T(dt, !0);
            M(dt);
            var Zn = H(dt, 2), Ln = T(Zn, !0);
            M(Zn), M(en);
            var Yn = H(en, 2), qe = T(Yn), Jt = T(qe, !0);
            M(qe);
            var Fn = H(qe, 2), gr = T(Fn, !0);
            M(Fn), M(Yn), M(Rt);
            var Ar = H(Rt, 2);
            {
              let In = P(() => n()("postHistory.importProgressBarLabel")), Hn = P(() => `${r(_e)}%`);
              Oe(Ar, () => Dh, (sr, xr) => {
                xr(sr, {
                  get value() {
                    return r(_e);
                  },
                  max: 100,
                  get "aria-label"() {
                    return r(In);
                  },
                  get "aria-valuetext"() {
                    return r(Hn);
                  },
                  class: "import-progress-root",
                  children: (ir, io) => {
                    var Bn = vp();
                    Ie((Dr) => Vc(Bn, Dr), [() => ue(r(_e))]), D(ir, Bn);
                  },
                  $$slots: { default: !0 }
                });
              });
            }
            M(Ut), Ie(
              (In, Hn, sr, xr, ir) => {
                cr(Ut, "aria-label", In), te(Vt, Hn), te(et, `${r(_e) ?? ""}%`), te(dn, sr), te(Ln, xr), te(Jt, ir), te(gr, r(Ee));
              },
              [
                () => n()("postHistory.importProgress"),
                () => n()("postHistory.importProgress"),
                () => n()("postHistory.importElapsedTime"),
                () => Se(r(m)),
                () => n()("postHistory.importEstimatedRemainingTime")
              ]
            ), D(mt, Ut);
          };
          be(Ye, (mt) => {
            (r(b) || r(x)) && mt(_t);
          });
        }
        var pn = H(Ye, 2);
        {
          var Pn = (mt) => {
            var Ut = yp(), Ft = T(Ut), Ht = T(Ft), Rt = T(Ht, !0);
            M(Ht);
            var Xt = H(Ht, 2), qt = T(Xt), Vt = T(qt), Et = T(Vt, !0);
            M(Vt);
            var et = H(Vt), en = T(et, !0);
            M(et), M(qt);
            var dt = H(qt, 2), dn = T(dt), Zn = T(dn, !0);
            M(dn);
            var Ln = H(dn), Yn = T(Ln, !0);
            M(Ln), M(dt);
            var qe = H(dt, 2), Jt = T(qe), Fn = T(Jt, !0);
            M(Jt);
            var gr = H(Jt), Ar = T(gr, !0);
            M(gr), M(qe);
            var In = H(qe, 2), Hn = T(In), sr = T(Hn, !0);
            M(Hn);
            var xr = H(Hn), ir = T(xr, !0);
            M(xr), M(In);
            var io = H(In, 2), Bn = T(io), Dr = T(Bn, !0);
            M(Bn);
            var lo = H(Bn), Jr = T(lo, !0);
            M(lo), M(io);
            var Ur = H(io, 2), Gr = T(Ur), kr = T(Gr, !0);
            M(Gr);
            var ra = H(Gr), Sa = T(ra, !0);
            M(ra), M(Ur);
            var co = H(Ur, 2), qr = T(co), uo = T(qr, !0);
            M(qr);
            var mo = H(qr), Fo = T(mo, !0);
            M(mo), M(co), M(Xt), M(Ft);
            var Ho = H(Ft, 2), bo = T(Ho), Co = T(bo, !0);
            M(bo);
            var wn = H(bo, 2), No = T(wn), Mr = T(No), Ia = T(Mr, !0);
            M(Mr);
            var $o = H(Mr), Bo = T($o, !0);
            M($o), M(No);
            var ho = H(No, 2), fo = T(ho), Po = T(fo, !0);
            M(fo);
            var oa = H(fo), Uo = T(oa, !0);
            M(oa), M(ho);
            var Un = H(ho, 2), Zr = T(Un), l = T(Zr, !0);
            M(Zr);
            var p = H(Zr), F = T(p, !0);
            M(p), M(Un);
            var N = H(Un, 2), q = T(N), Y = T(q, !0);
            M(q);
            var le = H(q), Te = T(le, !0);
            M(le), M(N);
            var de = H(N, 2), we = T(de), De = T(we, !0);
            M(we);
            var ke = H(we), Le = T(ke, !0);
            M(ke), M(de);
            var st = H(de, 2), gt = T(st), Tt = T(gt, !0);
            M(gt);
            var Ue = H(gt), at = T(Ue, !0);
            M(Ue), M(st), M(wn), M(Ho);
            var bt = H(Ho, 2), cn = T(bt), vr = T(cn, !0);
            M(cn);
            var Rr = H(cn, 2), xe = T(Rr), ze = T(xe), un = T(ze, !0);
            M(ze);
            var _n = H(ze), jt = T(_n, !0);
            M(_n), M(xe);
            var Xr = H(xe, 2), aa = T(Xr), Na = T(aa, !0);
            M(aa);
            var eo = H(aa), qo = T(eo, !0);
            M(eo), M(Xr);
            var Vo = H(Xr, 2), jo = T(Vo), $a = T(jo, !0);
            M(jo);
            var _a = H(jo), Ba = T(_a, !0);
            M(_a), M(Vo);
            var wo = H(Vo, 2), xo = T(wo), os = T(xo, !0);
            M(xo);
            var Ua = H(xo), as = T(Ua, !0);
            M(Ua), M(wo);
            var sa = H(wo, 2), ia = T(sa), qa = T(ia, !0);
            M(ia);
            var Va = H(ia), Ro = T(Va, !0);
            M(Va), M(sa);
            var f = H(sa, 2), y = T(f), A = T(y, !0);
            M(y);
            var U = H(y), W = T(U, !0);
            M(U), M(f);
            var ie = H(f, 2), pe = T(ie), Ve = T(pe, !0);
            M(pe);
            var Be = H(pe), Ze = T(Be, !0);
            M(Be), M(ie), M(Rr), M(bt), M(Ut), Ie(
              (Re, At, yn, Qe, Nt, Dt, Vr, Ko, Sr, to, go, ja, la, ss, Tr, Ka, h, B, ge, ce, it, $t, tn) => {
                te(Rt, Re), te(Et, At), te(en, r(x).nonEmptyLineCount), te(Zn, yn), te(Yn, r(x).fileDuplicateCount), te(Fn, Qe), te(Ar, r(x).otherAccountCount), te(sr, Nt), te(ir, r(x).unsupportedKindCount), te(Dr, Dt), te(Jr, r(x).invalidJsonCount), te(kr, Vr), te(Sa, r(x).invalidStructureCount), te(uo, Ko), te(Fo, r(x).invalidIdOrSignatureCount), te(Co, Sr), te(Ia, to), te(Bo, r(x).uniquePostEventCount), te(Po, go), te(Uo, r(x).insertedPostCount), te(l, ja), te(F, r(x).updatedPostCount), te(Y, la), te(Te, r(x).unchangedPostCount), te(De, ss), te(Le, r(x).failedPostEventCount), te(Tt, Tr), te(at, r(x).appliedDeletionPostCount), te(vr, Ka), te(un, h), te(jt, r(x).uniqueDeletionEventCount), te(Na, B), te(qo, r(x).validDeletionETagCount), te($a, ge), te(Ba, r(x).insertedDeletionRequestCount), te(os, ce), te(as, r(x).updatedDeletionRequestCount), te(qa, it), te(Ro, r(x).unchangedDeletionRequestCount), te(A, $t), te(W, r(x).unsupportedDeletionEventCount), te(Ve, tn), te(Ze, r(x).failedDeletionEventCount);
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
            ), D(mt, Ut);
          };
          be(pn, (mt) => {
            r(x) && mt(Pn);
          });
        }
        Ie(
          (mt, Ut, Ft, Ht) => {
            te(Ge, mt), te(It, Ut), cr(ht, "aria-label", Ft), sn = ko(an, 1, "import-drop-zone svelte-1qfqhib", null, sn, { "import-drop-zone-active": r(a) > 0 }), te(ft, Ht);
          },
          [
            () => n()("postHistory.importTitle"),
            () => n()("postHistory.importDescription"),
            () => n()("postHistory.importChooseFile"),
            () => r(a) > 0 ? n()("postHistory.importDropActive") : n()("postHistory.importDropHint")
          ]
        ), ei("change", ht, j), Ss("dragenter", an, G), Ss("dragover", an, O), Ss("dragleave", an, X), Ss("drop", an, he), D(ut, yt);
      },
      $$slots: { footer: !0, default: !0 }
    });
  }
  var je = zt(We);
  return i(), je;
}
eu(["change"]);
Wt(
  Zu,
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
var Cp = Q('<span class="post-preview-replies-badge svelte-11vk23d" aria-hidden="true"> </span>'), Pp = Q("<!> <!>", 1);
const wp = {
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
function cd(t, e) {
  Qt(e, !0), Lo(t, wp);
  let n = S(e, "count", 7), o = S(e, "selected", 7), i = S(e, "ariaLabel", 7), s = S(e, "onClick", 7), d = S(e, "tooltipContent", 23, i);
  const c = tu().overlayTarget;
  var u = {
    get count() {
      return n();
    },
    set count(b) {
      n(b), R();
    },
    get selected() {
      return o();
    },
    set selected(b) {
      o(b), R();
    },
    get ariaLabel() {
      return i();
    },
    set ariaLabel(b) {
      i(b), R();
    },
    get onClick() {
      return s();
    },
    set onClick(b) {
      s(b), R();
    },
    get tooltipContent() {
      return d();
    },
    set tooltipContent(b = i) {
      d(b), R();
    }
  }, _ = Pe(), v = J(_);
  return Oe(v, () => Oh, (b, x) => {
    x(b, {
      children: (w, E) => {
        var C = Pe(), m = J(C);
        Oe(m, () => kh, (a, L) => {
          L(a, {
            delayDuration: 500,
            children: (oe, z) => {
              var ee = Pp(), I = J(ee);
              {
                const se = (_e, ve) => {
                  let Ee = () => ve?.().props;
                  const Se = P(() => {
                    const { onclick: Fe, ...ye } = Ee();
                    return { tooltipOnclick: Fe, restProps: ye };
                  });
                  ar(_e, es(
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
                      onClick: (Fe) => {
                        s()(), typeof r(Se).tooltipOnclick == "function" && r(Se).tooltipOnclick(Fe);
                      }
                    },
                    () => r(Se).restProps,
                    {
                      children: (Fe, ye) => {
                        var V = Cp(), Ne = T(V, !0);
                        M(V), Ie(() => te(Ne, n())), D(Fe, V);
                      },
                      $$slots: { default: !0 }
                    }
                  ));
                };
                Oe(I, () => Mh, (_e, ve) => {
                  ve(_e, { child: se, $$slots: { child: !0 } });
                });
              }
              var fe = H(I, 2);
              Oe(fe, () => Gs, (se, _e) => {
                _e(se, {
                  get to() {
                    return c;
                  },
                  children: (ve, Ee) => {
                    var Se = Pe(), Fe = J(Se);
                    Oe(Fe, () => Th, (ye, V) => {
                      V(ye, {
                        sideOffset: 8,
                        class: "tooltip-content post-preview-tooltip-content",
                        children: (Ne, ue) => {
                          Ma();
                          var K = ta();
                          Ie(() => te(K, d())), D(Ne, K);
                        },
                        $$slots: { default: !0 }
                      });
                    }), D(ve, Se);
                  },
                  $$slots: { default: !0 }
                });
              }), D(oe, ee);
            },
            $$slots: { default: !0 }
          });
        }), D(w, C);
      },
      $$slots: { default: !0 }
    });
  }), D(t, _), zt(u);
}
Wt(
  cd,
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
var xp = Q('<span class="post-history-thread-toggle-spinner post-history-thread-action-spinner svelte-cenxtw" aria-hidden="true"></span>'), Rp = Q('<span class="post-history-thread-toggle-icon-wrapper svelte-cenxtw" aria-hidden="true"><span></span></span>');
const Sp = {
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
function ud(t, e) {
  Qt(e, !0), Lo(t, Sp);
  let n = S(e, "expanded", 7), o = S(e, "ariaLabel", 7), i = S(e, "title", 23, o), s = S(e, "loading", 7, !1), d = S(e, "onClick", 7), c = P(() => [s() ? "is-loading" : ""].filter(Boolean).join(" "));
  var u = {
    get expanded() {
      return n();
    },
    set expanded(_) {
      n(_), R();
    },
    get ariaLabel() {
      return o();
    },
    set ariaLabel(_) {
      o(_), R();
    },
    get title() {
      return i();
    },
    set title(_ = o) {
      i(_), R();
    },
    get loading() {
      return s();
    },
    set loading(_ = !1) {
      s(_), R();
    },
    get onClick() {
      return d();
    },
    set onClick(_) {
      d(_), R();
    }
  };
  {
    let _ = P(() => `post-history-thread-toggle-button ${r(c)}`.trim());
    ar(t, {
      type: "button",
      get className() {
        return r(_);
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
      children: (v, b) => {
        var x = Pe(), w = J(x);
        {
          var E = (m) => {
            var a = xp();
            D(m, a);
          }, C = (m) => {
            var a = Rp(), L = T(a);
            M(a), Ie(() => ko(
              L,
              1,
              `post-history-thread-toggle-icon ${n() ? "post-history-thread-toggle-icon-collapse" : "post-history-thread-toggle-icon-arrow-top-right"} svg-icon`,
              "svelte-cenxtw"
            )), D(m, a);
          };
          be(w, (m) => {
            s() ? m(E) : m(C, -1);
          });
        }
        D(v, x);
      },
      $$slots: { default: !0 }
    });
  }
  return zt(u);
}
Wt(
  ud,
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
var Ip = Q("<span> </span>");
const _p = {
  hash: "svelte-1uufmpv",
  code: ".post-history-status-pill.svelte-1uufmpv {display:inline-flex;align-items:center;justify-content:center;min-height:18px;padding:0 8px;border:1px solid color-mix(in srgb, currentColor 18%, transparent);border-radius:999px;background:color-mix(in srgb, currentColor 8%, transparent);font-size:0.72rem;line-height:1;white-space:nowrap;}.post-history-status-pill-muted.svelte-1uufmpv {color:var(--text-muted, currentColor);}.post-history-status-pill-danger.svelte-1uufmpv {color:var(--destructive-fg, currentColor);}"
};
function Xu(t, e) {
  Qt(e, !0), Lo(t, _p);
  let n = S(e, "label", 7), o = S(e, "tone", 7), i = S(e, "className", 7, "");
  var s = {
    get label() {
      return n();
    },
    set label(u) {
      n(u), R();
    },
    get tone() {
      return o();
    },
    set tone(u) {
      o(u), R();
    },
    get className() {
      return i();
    },
    set className(u = "") {
      i(u), R();
    }
  }, d = Ip(), c = T(d, !0);
  return M(d), Ie(
    (u) => {
      ko(d, 1, u, "svelte-1uufmpv"), cr(d, "aria-label", n()), cr(d, "title", n()), te(c, n());
    },
    [
      () => Lh(`post-history-status-pill post-history-status-pill-${o()} ${i()}`.trim())
    ]
  ), D(t, d), zt(s);
}
Wt(Xu, { label: {}, tone: {}, className: {} }, [], [], { mode: "open" });
function eh(t, e) {
  Qt(e, !0);
  const n = () => Ca(Fa, "$_", o), [o, i] = La();
  let s = S(e, "eventId", 7), d = P(() => {
    if (s())
      return Fh[s()];
  });
  function c(E) {
    return E === "pending" || E === "processing" ? n()("postHistory.deleteSending") : E === "failed" ? n()("postHistory.deleteFailed") : null;
  }
  let u = P(() => c(r(d)));
  var _ = {
    get eventId() {
      return s();
    },
    set eventId(E) {
      s(E), R();
    }
  }, v = Pe(), b = J(v);
  {
    var x = (E) => {
      {
        let C = P(() => r(d) === "failed" ? "danger" : "muted"), m = P(() => `post-history-deletion-lifecycle-status ${r(d) ?? ""}`.trim());
        Xu(E, {
          get label() {
            return r(u);
          },
          get tone() {
            return r(C);
          },
          get className() {
            return r(m);
          }
        });
      }
    };
    be(b, (E) => {
      r(u) && E(x);
    });
  }
  D(t, v);
  var w = zt(_);
  return i(), w;
}
Wt(eh, { eventId: {} }, [], [], { mode: "open" });
function th(t, e) {
  Qt(e, !0);
  let n = S(e, "node", 7), o = S(e, "model", 7, void 0), i = S(e, "emojiLoadStateByUrl", 23, () => ({})), s = S(e, "emojiImageMetaByUrl", 23, () => ({})), d = S(e, "scrollRoot", 7, null), c = S(e, "onImageOpen", 7, void 0), u = S(e, "topActions", 7, void 0), _ = S(e, "footerLeftExtras", 7, void 0), v = S(e, "footerActions", 7, void 0), b = S(e, "footerDetails", 7, void 0), x = S(e, "footerMenu", 7, void 0);
  var w = {
    get node() {
      return n();
    },
    set node(E) {
      n(E), R();
    },
    get model() {
      return o();
    },
    set model(E = void 0) {
      o(E), R();
    },
    get emojiLoadStateByUrl() {
      return i();
    },
    set emojiLoadStateByUrl(E = {}) {
      i(E), R();
    },
    get emojiImageMetaByUrl() {
      return s();
    },
    set emojiImageMetaByUrl(E = {}) {
      s(E), R();
    },
    get scrollRoot() {
      return d();
    },
    set scrollRoot(E = null) {
      d(E), R();
    },
    get onImageOpen() {
      return c();
    },
    set onImageOpen(E = void 0) {
      c(E), R();
    },
    get topActions() {
      return u();
    },
    set topActions(E = void 0) {
      u(E), R();
    },
    get footerLeftExtras() {
      return _();
    },
    set footerLeftExtras(E = void 0) {
      _(E), R();
    },
    get footerActions() {
      return v();
    },
    set footerActions(E = void 0) {
      v(E), R();
    },
    get footerDetails() {
      return b();
    },
    set footerDetails(E = void 0) {
      b(E), R();
    },
    get footerMenu() {
      return x();
    },
    set footerMenu(E = void 0) {
      x(E), R();
    }
  };
  return dd(t, {
    get event() {
      return n().event;
    },
    get profile() {
      return n().profile;
    },
    get model() {
      return o();
    },
    get emojiLoadStateByUrl() {
      return i();
    },
    get emojiImageMetaByUrl() {
      return s();
    },
    get scrollRoot() {
      return d();
    },
    get onImageOpen() {
      return c();
    },
    get topActions() {
      return u();
    },
    get footerLeftExtras() {
      return _();
    },
    get footerActions() {
      return v();
    },
    get footerDetails() {
      return b();
    },
    get footerMenu() {
      return x();
    }
  }), zt(w);
}
Wt(
  th,
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
    footerDetails: {},
    footerMenu: {}
  },
  [],
  [],
  { mode: "open" }
);
var Ep = Q('<span class="post-history-context-deleted-label svelte-1kez5et"> </span>'), Ap = Q('<p class="post-history-context-message svelte-1kez5et"> </p>'), Dp = Q('<p class="post-history-context-message post-history-context-error svelte-1kez5et"> </p> <!>', 1), kp = Q('<div class="post-history-thread-node-parent svelte-1kez5et"><!></div>'), Mp = Q('<div class="post-history-thread-node-top-actions"><!></div>'), Tp = Q('<div class="open-in-new-icon svg-icon" aria-hidden="true"></div> <span> </span>', 1), Op = Q("<!> <!>", 1), Lp = Q('<div aria-hidden="true"></div> <span> </span>', 1), Fp = Q("<!> <!> <!>", 1), Hp = Q('<div class="post-history-thread-node-children svelte-1kez5et"></div>'), Np = Q('<div class="post-history-thread-node-view svelte-1kez5et"><!> <div class="post-history-thread-node-anchor svelte-1kez5et"><!></div> <!></div>');
const $p = {
  hash: "svelte-1kez5et",
  code: `.post-history-thread-node-view.svelte-1kez5et {display:grid;gap:1px;}.post-history-thread-node-parent.svelte-1kez5et,
    .post-history-thread-node-children.svelte-1kez5et {display:grid;gap:2px;}.post-history-thread-node-parent.svelte-1kez5et {padding-inline-start:0;}.post-history-thread-node-anchor.svelte-1kez5et {display:grid;min-width:0;}.post-history-thread-node-children.svelte-1kez5et {padding-inline-start:0;}.post-history-context-button {min-height:28px;padding:2px 6px;color:var(--text-muted);background:var(--btn-bg);font-size:0.82rem;}.post-history-context-message.svelte-1kez5et {margin:0;color:var(--text-muted);font-size:0.82rem;}.post-history-context-deleted-label.svelte-1kez5et {width:fit-content;min-height:28px;padding:2px 6px;color:var(--text-muted);background-color:transparent;border:1px solid var(--btn-border);font-size:0.82rem;font-weight:normal;cursor:default;user-select:none;display:flex;align-items:center;}.post-history-context-error.svelte-1kez5et {color:var(--danger);}`
};
function Ga(t, e) {
  Qt(e, !0), Lo(t, $p);
  const n = () => Ca(Fa, "$_", o), [o, i] = La();
  let s = S(e, "state", 7), d = S(e, "previewModelByEventId", 23, () => ({})), c = S(e, "emojiLoadStateByUrl", 23, () => ({})), u = S(e, "emojiImageMetaByUrl", 23, () => ({})), _ = S(e, "scrollRoot", 7, null), v = S(e, "onImageOpen", 7, void 0), b = S(e, "buildPostRecordForNode", 7, void 0), x = S(e, "onReplyPost", 7, void 0), w = S(e, "onQuotePost", 7, void 0), E = S(e, "getReactionReadModel", 7, void 0), C = S(e, "isReactionExpanded", 7, void 0), m = S(e, "getReactionLabel", 7, void 0), a = S(e, "onToggleReaction", 7, void 0), L = S(e, "onToggleParent", 7, void 0), oe = S(e, "onRetryParent", 7, void 0), z = S(e, "onToggleChildren", 7, void 0), ee = S(e, "onRetryChildren", 7, void 0), I = S(e, "onCopyPointerDown", 7, void 0), fe = S(e, "onCopyNevent", 7, void 0), se = S(e, "externalClientLabel", 7, void 0), _e = S(e, "onOpenExternalClient", 7, void 0), ve = S(e, "isCopyFailed", 7, void 0), Ee = S(e, "onShowRawJson", 7, void 0), Se = S(e, "onBroadcastPointerDown", 7, void 0), Fe = S(e, "onBroadcastPost", 7, void 0), ye = S(e, "isBroadcastSending", 7, void 0), V = S(e, "canDeleteNodePost", 7, void 0), Ne = S(e, "isDeletionSending", 7, void 0), ue = S(e, "onOpenDeleteConfirm", 7, void 0), K = P(() => Zs(s().node.event.created_at * 1e3)), re = P(() => s().repliesActionState.status === "loaded" && s().repliesActionState.replyCount > 0), Ce = P(() => ve()?.(s().node.eventId) ?? !1), He = P(() => ye()?.(s().node.eventId) ?? !1), Ae = P(() => V()?.(s()) ?? !1), k = P(() => Ne()?.(s().node.eventId) ?? !1);
  function G() {
    const ne = s().repliesActionState;
    if (ne.status === "loading")
      return n()("postHistory.checkingReplies");
    if (ne.status === "failed")
      return n()("postHistory.recheckReplies");
    if (ne.status === "loaded") {
      const It = ne.replyCount;
      return It === 0 ? n()("postHistory.recheckReplies") : ne.visible ? n()("postHistory.hideReplies") : n()("postHistory.showRepliesWithCount", { values: { count: It } });
    }
    return n()("postHistory.checkReplies");
  }
  function O() {
    const ne = s().repliesActionState;
    if (ne.status === "failed" || ne.status === "loaded" && ne.replyCount === 0) {
      ee()?.(s().node.eventId);
      return;
    }
    z()?.(s().node.eventId);
  }
  function X(ne) {
    I()?.(s(), ne);
  }
  function he(ne) {
    fe()?.(s(), ne);
  }
  function $() {
    Ee()?.(s());
  }
  function j(ne) {
    Se()?.(s(), ne);
  }
  function We(ne) {
    Fe()?.(s(), ne);
  }
  function je() {
    ue()?.(s());
  }
  var ae = {
    get state() {
      return s();
    },
    set state(ne) {
      s(ne), R();
    },
    get previewModelByEventId() {
      return d();
    },
    set previewModelByEventId(ne = {}) {
      d(ne), R();
    },
    get emojiLoadStateByUrl() {
      return c();
    },
    set emojiLoadStateByUrl(ne = {}) {
      c(ne), R();
    },
    get emojiImageMetaByUrl() {
      return u();
    },
    set emojiImageMetaByUrl(ne = {}) {
      u(ne), R();
    },
    get scrollRoot() {
      return _();
    },
    set scrollRoot(ne = null) {
      _(ne), R();
    },
    get onImageOpen() {
      return v();
    },
    set onImageOpen(ne = void 0) {
      v(ne), R();
    },
    get buildPostRecordForNode() {
      return b();
    },
    set buildPostRecordForNode(ne = void 0) {
      b(ne), R();
    },
    get onReplyPost() {
      return x();
    },
    set onReplyPost(ne = void 0) {
      x(ne), R();
    },
    get onQuotePost() {
      return w();
    },
    set onQuotePost(ne = void 0) {
      w(ne), R();
    },
    get getReactionReadModel() {
      return E();
    },
    set getReactionReadModel(ne = void 0) {
      E(ne), R();
    },
    get isReactionExpanded() {
      return C();
    },
    set isReactionExpanded(ne = void 0) {
      C(ne), R();
    },
    get getReactionLabel() {
      return m();
    },
    set getReactionLabel(ne = void 0) {
      m(ne), R();
    },
    get onToggleReaction() {
      return a();
    },
    set onToggleReaction(ne = void 0) {
      a(ne), R();
    },
    get onToggleParent() {
      return L();
    },
    set onToggleParent(ne = void 0) {
      L(ne), R();
    },
    get onRetryParent() {
      return oe();
    },
    set onRetryParent(ne = void 0) {
      oe(ne), R();
    },
    get onToggleChildren() {
      return z();
    },
    set onToggleChildren(ne = void 0) {
      z(ne), R();
    },
    get onRetryChildren() {
      return ee();
    },
    set onRetryChildren(ne = void 0) {
      ee(ne), R();
    },
    get onCopyPointerDown() {
      return I();
    },
    set onCopyPointerDown(ne = void 0) {
      I(ne), R();
    },
    get onCopyNevent() {
      return fe();
    },
    set onCopyNevent(ne = void 0) {
      fe(ne), R();
    },
    get externalClientLabel() {
      return se();
    },
    set externalClientLabel(ne = void 0) {
      se(ne), R();
    },
    get onOpenExternalClient() {
      return _e();
    },
    set onOpenExternalClient(ne = void 0) {
      _e(ne), R();
    },
    get isCopyFailed() {
      return ve();
    },
    set isCopyFailed(ne = void 0) {
      ve(ne), R();
    },
    get onShowRawJson() {
      return Ee();
    },
    set onShowRawJson(ne = void 0) {
      Ee(ne), R();
    },
    get onBroadcastPointerDown() {
      return Se();
    },
    set onBroadcastPointerDown(ne = void 0) {
      Se(ne), R();
    },
    get onBroadcastPost() {
      return Fe();
    },
    set onBroadcastPost(ne = void 0) {
      Fe(ne), R();
    },
    get isBroadcastSending() {
      return ye();
    },
    set isBroadcastSending(ne = void 0) {
      ye(ne), R();
    },
    get canDeleteNodePost() {
      return V();
    },
    set canDeleteNodePost(ne = void 0) {
      V(ne), R();
    },
    get isDeletionSending() {
      return Ne();
    },
    set isDeletionSending(ne = void 0) {
      Ne(ne), R();
    },
    get onOpenDeleteConfirm() {
      return ue();
    },
    set onOpenDeleteConfirm(ne = void 0) {
      ue(ne), R();
    }
  }, $e = Np(), Je = T($e);
  {
    var ut = (ne) => {
      var It = kp(), ht = T(It);
      {
        var an = (ft) => {
          Ga(ft, {
            get state() {
              return s().parentNodeState;
            },
            get previewModelByEventId() {
              return d();
            },
            get emojiLoadStateByUrl() {
              return c();
            },
            get emojiImageMetaByUrl() {
              return u();
            },
            get scrollRoot() {
              return _();
            },
            get onImageOpen() {
              return v();
            },
            get buildPostRecordForNode() {
              return b();
            },
            get onReplyPost() {
              return x();
            },
            get onQuotePost() {
              return w();
            },
            get getReactionReadModel() {
              return E();
            },
            get isReactionExpanded() {
              return C();
            },
            get getReactionLabel() {
              return m();
            },
            get onToggleReaction() {
              return a();
            },
            get onToggleParent() {
              return L();
            },
            get onRetryParent() {
              return oe();
            },
            get onToggleChildren() {
              return z();
            },
            get onRetryChildren() {
              return ee();
            },
            get onCopyPointerDown() {
              return I();
            },
            get onCopyNevent() {
              return fe();
            },
            get externalClientLabel() {
              return se();
            },
            get onOpenExternalClient() {
              return _e();
            },
            get isCopyFailed() {
              return ve();
            },
            get onShowRawJson() {
              return Ee();
            },
            get onBroadcastPointerDown() {
              return Se();
            },
            get onBroadcastPost() {
              return Fe();
            },
            get isBroadcastSending() {
              return ye();
            },
            get canDeleteNodePost() {
              return V();
            },
            get isDeletionSending() {
              return Ne();
            },
            get onOpenDeleteConfirm() {
              return ue();
            }
          });
        }, sn = (ft) => {
          var Ye = Ep(), _t = T(Ye, !0);
          M(Ye), Ie((pn) => te(_t, pn), [() => n()("postHistory.replyTargetDeleted")]), D(ft, Ye);
        }, ln = (ft) => {
          var Ye = Ap(), _t = T(Ye, !0);
          M(Ye), Ie((pn) => te(_t, pn), [() => n()("postHistory.contextNotFound")]), D(ft, Ye);
        }, Ke = (ft) => {
          var Ye = Dp(), _t = J(Ye), pn = T(_t, !0);
          M(_t);
          var Pn = H(_t, 2);
          ar(Pn, {
            type: "button",
            className: "post-history-context-button post-history-context-retry-button",
            onClick: () => oe()?.(s().node.eventId),
            children: (mt, Ut) => {
              Ma();
              var Ft = ta();
              Ie((Ht) => te(Ft, Ht), [() => n()("postHistory.contextRetry")]), D(mt, Ft);
            },
            $$slots: { default: !0 }
          }), Ie((mt) => te(pn, mt), [() => n()("postHistory.contextFetchFailed")]), D(ft, Ye);
        };
        be(ht, (ft) => {
          s().parentExpansion.visibleParent && s().parentNodeState ? ft(an) : s().parentExpansion.visibleParent && s().parentExpansion.parentDeleted ? ft(sn, 1) : s().parentExpansion.visibleParent && s().parentExpansion.parentMissing ? ft(ln, 2) : s().parentExpansion.visibleParent && s().parentExpansion.parentError && ft(Ke, 3);
        });
      }
      M(It), D(ne, It);
    };
    be(Je, (ne) => {
      s().parentTargetId && ne(ut);
    });
  }
  var pt = H(Je, 2), yt = T(pt);
  th(yt, {
    get node() {
      return s().node;
    },
    get model() {
      return d()[s().node.eventId];
    },
    get emojiLoadStateByUrl() {
      return c();
    },
    get emojiImageMetaByUrl() {
      return u();
    },
    get scrollRoot() {
      return _();
    },
    get onImageOpen() {
      return v();
    },
    topActions: (ln) => {
      var Ke = Pe(), ft = J(Ke);
      {
        var Ye = (_t) => {
          var pn = Mp(), Pn = T(pn);
          {
            let mt = P(() => s().parentExpansion.visibleParent ? n()("postHistory.hideReplyTarget") : n()("postHistory.showReplyTarget")), Ut = P(() => s().parentExpansion.visibleParent ? n()("postHistory.hideReplyTarget") : n()("postHistory.showReplyTarget")), Ft = P(() => s().parentExpansion.visibleParent && s().parentExpansion.showParentLoadingIndicator);
            ud(Pn, {
              get ariaLabel() {
                return r(mt);
              },
              get title() {
                return r(Ut);
              },
              get expanded() {
                return s().parentExpansion.visibleParent;
              },
              get loading() {
                return r(Ft);
              },
              onClick: () => L()?.(s().node.eventId)
            });
          }
          M(pn), D(_t, pn);
        };
        be(ft, (_t) => {
          s().parentTargetId && !s().parentAlreadyInPath && !(s().parentExpansion.visibleParent && s().parentExpansion.parentDeleted) && _t(Ye);
        });
      }
      D(ln, Ke);
    },
    footerLeftExtras: (ln) => {
      eh(ln, {
        get eventId() {
          return s().node.eventId;
        }
      });
    },
    footerActions: (ln) => {
      var Ke = Pe(), ft = J(Ke);
      {
        var Ye = (_t) => {
          {
            const pn = (Ht) => {
              var Rt = Pe(), Xt = J(Rt);
              {
                var qt = (Vt) => {
                  {
                    let Et = P(G), et = P(G);
                    cd(Vt, {
                      get count() {
                        return s().repliesActionState.replyCount;
                      },
                      get selected() {
                        return s().repliesActionState.visible;
                      },
                      get ariaLabel() {
                        return r(Et);
                      },
                      get tooltipContent() {
                        return r(et);
                      },
                      onClick: O
                    });
                  }
                };
                be(Xt, (Vt) => {
                  r(re) && Vt(qt);
                });
              }
              D(Ht, Rt);
            }, Pn = (Ht) => {
              const Rt = P(() => E()?.(s().node.eventId));
              var Xt = Pe(), qt = J(Xt);
              {
                var Vt = (Et) => {
                  {
                    let et = P(() => C()?.(s().node.eventId) ?? !1), en = P(() => m()?.(s().node.eventId) ?? "");
                    dl(Et, {
                      get count() {
                        return r(Rt).totalCount;
                      },
                      get expanded() {
                        return r(et);
                      },
                      get ariaLabel() {
                        return r(en);
                      },
                      onToggle: () => a()?.(s().node.eventId)
                    });
                  }
                };
                be(qt, (Et) => {
                  r(Rt) && r(Rt).totalCount > 0 && Et(Vt);
                });
              }
              D(Ht, Xt);
            };
            let mt = P(() => b()(s())), Ut = P(() => s().node.event.kind !== 42 ? x() : void 0), Ft = P(() => s().node.event.kind !== 42 ? w() : void 0);
            il(_t, {
              get post() {
                return r(mt);
              },
              get onReplyPost() {
                return r(Ut);
              },
              get onQuotePost() {
                return r(Ft);
              },
              replyExtras: pn,
              reactionExtras: Pn,
              $$slots: { replyExtras: !0, reactionExtras: !0 }
            });
          }
        };
        be(ft, (_t) => {
          b() && _t(Ye);
        });
      }
      D(ln, Ke);
    },
    footerDetails: (ln) => {
      const Ke = P(() => E()?.(s().node.eventId));
      var ft = Pe(), Ye = J(ft);
      {
        var _t = (Pn) => {
          ll(Pn, {
            get readModel() {
              return r(Ke);
            },
            get emojiLoadStateByUrl() {
              return c();
            },
            get emojiImageMetaByUrl() {
              return u();
            }
          });
        }, pn = P(() => r(Ke) && r(Ke).totalCount > 0 && (C()?.(s().node.eventId) ?? !1));
        be(Ye, (Pn) => {
          r(pn) && Pn(_t);
        });
      }
      D(ln, ft);
    },
    footerMenu: (ln) => {
      const Ke = P(() => n()("common.showActions"));
      sl(ln, {
        get triggerAriaLabel() {
          return r(Ke);
        },
        get tooltipContent() {
          return r(Ke);
        },
        enableTooltip: !0,
        get timestamp() {
          return r(K);
        },
        items: (Ye) => {
          var _t = Fp(), pn = J(_t);
          {
            var Pn = (Ft) => {
              var Ht = Op(), Rt = J(Ht);
              Oe(Rt, () => Gn, (qt, Vt) => {
                Vt(qt, {
                  class: "menu-action-button",
                  onSelect: () => _e()?.(s()),
                  children: (Et, et) => {
                    var en = Tp(), dt = H(J(en), 2), dn = T(dt, !0);
                    M(dt), Ie(() => te(dn, se())), D(Et, en);
                  },
                  $$slots: { default: !0 }
                });
              });
              var Xt = H(Rt, 2);
              Oe(Xt, () => Zo, (qt, Vt) => {
                Vt(qt, { class: "post-history-menu-separator" });
              }), D(Ft, Ht);
            };
            be(pn, (Ft) => {
              se() && _e() && Ft(Pn);
            });
          }
          var mt = H(pn, 2);
          {
            let Ft = P(() => s().repliesActionState.status === "loading");
            Oe(mt, () => Gn, (Ht, Rt) => {
              Rt(Ht, {
                class: "menu-action-button",
                get disabled() {
                  return r(Ft);
                },
                onSelect: O,
                children: (Xt, qt) => {
                  var Vt = Lp(), Et = J(Vt), et = H(Et, 2), en = T(et, !0);
                  M(et), Ie(
                    (dt) => {
                      ko(Et, 1, `${s().repliesActionState.visible ? "collapse-content-icon" : "find_in_page-icon"} svg-icon`, "svelte-1kez5et"), te(en, dt);
                    },
                    [() => G()]
                  ), D(Xt, Vt);
                },
                $$slots: { default: !0 }
              });
            });
          }
          var Ut = H(mt, 2);
          As(Ut, {
            order: "raw-json-first",
            get copyFailed() {
              return r(Ce);
            },
            showBroadcast: !0,
            get broadcastSending() {
              return r(He);
            },
            get showDelete() {
              return r(Ae);
            },
            showDeleteSeparator: !0,
            get deletionSending() {
              return r(k);
            },
            onCopyPointerDown: X,
            onCopyNevent: he,
            onShowRawJson: $,
            onBroadcastPointerDown: j,
            onBroadcastPost: We,
            onOpenDeleteConfirm: je
          }), D(Ye, _t);
        },
        $$slots: { items: !0 }
      });
    },
    $$slots: {
      topActions: !0,
      footerLeftExtras: !0,
      footerActions: !0,
      footerDetails: !0,
      footerMenu: !0
    }
  }), M(pt);
  var vt = H(pt, 2);
  {
    var ot = (ne) => {
      var It = Hp();
      Jo(It, 21, () => s().replyNodeStates, (ht) => ht.node.eventId, (ht, an) => {
        Ga(ht, {
          get state() {
            return r(an);
          },
          get previewModelByEventId() {
            return d();
          },
          get emojiLoadStateByUrl() {
            return c();
          },
          get emojiImageMetaByUrl() {
            return u();
          },
          get scrollRoot() {
            return _();
          },
          get onImageOpen() {
            return v();
          },
          get buildPostRecordForNode() {
            return b();
          },
          get onReplyPost() {
            return x();
          },
          get onQuotePost() {
            return w();
          },
          get getReactionReadModel() {
            return E();
          },
          get isReactionExpanded() {
            return C();
          },
          get getReactionLabel() {
            return m();
          },
          get onToggleReaction() {
            return a();
          },
          get onToggleParent() {
            return L();
          },
          get onRetryParent() {
            return oe();
          },
          get onToggleChildren() {
            return z();
          },
          get onRetryChildren() {
            return ee();
          },
          get onCopyPointerDown() {
            return I();
          },
          get onCopyNevent() {
            return fe();
          },
          get externalClientLabel() {
            return se();
          },
          get onOpenExternalClient() {
            return _e();
          },
          get isCopyFailed() {
            return ve();
          },
          get onShowRawJson() {
            return Ee();
          },
          get onBroadcastPointerDown() {
            return Se();
          },
          get onBroadcastPost() {
            return Fe();
          },
          get isBroadcastSending() {
            return ye();
          },
          get canDeleteNodePost() {
            return V();
          },
          get isDeletionSending() {
            return Ne();
          },
          get onOpenDeleteConfirm() {
            return ue();
          }
        });
      }), M(It), D(ne, It);
    };
    be(vt, (ne) => {
      s().repliesActionState.visible && s().replyNodeStates.length > 0 && ne(ot);
    });
  }
  M($e), Ie(() => {
    cr(pt, "data-post-history-thread-anchor-scope-id", s().anchorEventId), cr(pt, "data-post-history-thread-anchor-event-id", s().node.eventId);
  }), D(t, $e);
  var Ge = zt(ae);
  return i(), Ge;
}
Wt(
  Ga,
  {
    state: {},
    previewModelByEventId: {},
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
const Bp = 5, Up = 0.5, qp = 2.5;
function On(t, e) {
  return `${t}:${e}`;
}
function Vp(t) {
  return Math.max(
    0,
    Bp + t
  );
}
function jp(t) {
  return Math.min(
    Vp(t) * Up,
    qp
  );
}
function Vi() {
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
  return nu(t.rawEvent, t) ? Sl(t.rawEvent) : {
    id: t.eventId,
    pubkey: t.pubkeyHex,
    kind: t.kind,
    content: t.content,
    tags: t.tags.map((e) => [...e]),
    created_at: t.createdAt,
    sig: ""
  };
}
function Is(t) {
  const e = {
    id: t.eventId,
    pubkey: t.authorPubkey,
    kind: t.kind,
    content: t.content,
    tags: t.tags.map((n) => [...n]),
    created_at: t.createdAt,
    sig: ""
  };
  return bi(t.rawEvent) && t.rawEvent.id === e.id && t.rawEvent.pubkey === e.pubkey && t.rawEvent.kind === e.kind && t.rawEvent.content === e.content && t.rawEvent.created_at === e.created_at && JSON.stringify(t.rawEvent.tags) === JSON.stringify(e.tags) ? Sl(t.rawEvent) : e;
}
function ms(t) {
  const e = ma(t.event);
  return {
    eventId: t.event.id,
    event: Sl(t.event),
    authorPubkey: t.event.pubkey,
    rootEventId: e.rootId,
    parentEventId: e.parentId,
    profile: t.profile ?? null,
    relayUrls: [...t.relayUrls ?? []],
    sources: [...t.sources]
  };
}
function bs(t, e) {
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
function Jd(t, e) {
  return [...t].sort((n, o) => {
    const i = e[n]?.event, s = e[o]?.event;
    return !i || !s ? n.localeCompare(o) : i.created_at !== s.created_at ? i.created_at - s.created_at : i.id.localeCompare(s.id);
  });
}
var Kp = Q('<span class="post-history-context-deleted-label post-history-thread-direct-parent-context svelte-nb00ha"> </span>'), Yp = Q('<p class="post-history-context-message post-history-thread-direct-parent-context svelte-nb00ha"> </p>'), Qp = Q('<p class="post-history-context-message post-history-context-error post-history-thread-direct-parent-context svelte-nb00ha"> </p> <!>', 1), zp = Q('<div class="post-history-thread-parent-panel svelte-nb00ha"><!> <div class="post-history-context-actions svelte-nb00ha"><!></div></div>'), Wp = Q('<div class="post-history-thread-replies-panel svelte-nb00ha"><div class="post-history-thread-replies-list svelte-nb00ha"></div></div>');
const Jp = {
  hash: "svelte-nb00ha",
  code: `.post-history-thread-parent-panel.svelte-nb00ha,
    .post-history-thread-replies-panel.svelte-nb00ha {display:grid;gap:6px;}.post-history-thread-parent-panel.svelte-nb00ha {padding-bottom:4px;}.post-history-thread-replies-list.svelte-nb00ha {display:grid;}.post-history-context-actions.svelte-nb00ha {display:flex;flex-wrap:wrap;gap:6px;}.post-history-thread-direct-parent-context {margin-inline-start:var(--thread-direct-parent-indent);}.post-history-context-button {min-height:28px;padding:2px 6px;color:var(--text-muted);background:transparent;font-size:0.82rem;}

    @media (hover: hover) and (pointer: fine) {.post-history-context-button:hover:not(:disabled) {color:var(--theme);background:color-mix(in srgb, var(--theme) 10%, transparent);}
    }.post-history-context-message.svelte-nb00ha {margin:0;color:var(--text-muted);font-size:0.82rem;}.post-history-context-deleted-label.svelte-nb00ha {width:fit-content;min-height:28px;padding:2px 6px;color:var(--text-muted);background-color:transparent;border:1px solid var(--btn-border);font-size:0.82rem;font-weight:normal;cursor:default;user-select:none;display:flex;align-items:center;}.post-history-context-error.svelte-nb00ha {color:var(--danger);}`
};
function vl(t, e) {
  Qt(e, !0), Lo(t, Jp);
  const n = () => Ca(Fa, "$_", o), [o, i] = La();
  let s = S(e, "state", 7), d = S(e, "section", 7), c = S(e, "previewModelByEventId", 23, () => ({})), u = S(e, "emojiLoadStateByUrl", 23, () => ({})), _ = S(e, "emojiImageMetaByUrl", 23, () => ({})), v = S(e, "scrollRoot", 7, null), b = S(e, "onImageOpen", 7, void 0), x = S(e, "buildPostRecordForNode", 7, void 0), w = S(e, "onReplyPost", 7, void 0), E = S(e, "onQuotePost", 7, void 0), C = S(e, "getReactionReadModel", 7, void 0), m = S(e, "isReactionExpanded", 7, void 0), a = S(e, "getReactionLabel", 7, void 0), L = S(e, "onToggleReaction", 7, void 0), oe = S(e, "onToggleParent", 7, void 0), z = S(e, "onRetryParent", 7, void 0), ee = S(e, "onToggleNodeParent", 7, void 0), I = S(e, "onRetryNodeParent", 7, void 0), fe = S(e, "onToggleNodeChildren", 7, void 0), se = S(e, "onRetryNodeChildren", 7, void 0), _e = S(e, "onCopyPointerDown", 7, void 0), ve = S(e, "onCopyNevent", 7, void 0), Ee = S(e, "externalClientLabel", 7, void 0), Se = S(e, "onOpenExternalClient", 7, void 0), Fe = S(e, "isCopyFailed", 7, void 0), ye = S(e, "onShowRawJson", 7, void 0), V = S(e, "onBroadcastPointerDown", 7, void 0), Ne = S(e, "onBroadcastPost", 7, void 0), ue = S(e, "isBroadcastSending", 7, void 0), K = S(e, "canDeleteNodePost", 7, void 0), re = S(e, "isDeletionSending", 7, void 0), Ce = S(e, "onOpenDeleteConfirm", 7, void 0);
  const He = `${jp(-1)}rem`;
  let Ae = P(() => s().parentNode ? {
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
  var k = {
    get state() {
      return s();
    },
    set state(j) {
      s(j), R();
    },
    get section() {
      return d();
    },
    set section(j) {
      d(j), R();
    },
    get previewModelByEventId() {
      return c();
    },
    set previewModelByEventId(j = {}) {
      c(j), R();
    },
    get emojiLoadStateByUrl() {
      return u();
    },
    set emojiLoadStateByUrl(j = {}) {
      u(j), R();
    },
    get emojiImageMetaByUrl() {
      return _();
    },
    set emojiImageMetaByUrl(j = {}) {
      _(j), R();
    },
    get scrollRoot() {
      return v();
    },
    set scrollRoot(j = null) {
      v(j), R();
    },
    get onImageOpen() {
      return b();
    },
    set onImageOpen(j = void 0) {
      b(j), R();
    },
    get buildPostRecordForNode() {
      return x();
    },
    set buildPostRecordForNode(j = void 0) {
      x(j), R();
    },
    get onReplyPost() {
      return w();
    },
    set onReplyPost(j = void 0) {
      w(j), R();
    },
    get onQuotePost() {
      return E();
    },
    set onQuotePost(j = void 0) {
      E(j), R();
    },
    get getReactionReadModel() {
      return C();
    },
    set getReactionReadModel(j = void 0) {
      C(j), R();
    },
    get isReactionExpanded() {
      return m();
    },
    set isReactionExpanded(j = void 0) {
      m(j), R();
    },
    get getReactionLabel() {
      return a();
    },
    set getReactionLabel(j = void 0) {
      a(j), R();
    },
    get onToggleReaction() {
      return L();
    },
    set onToggleReaction(j = void 0) {
      L(j), R();
    },
    get onToggleParent() {
      return oe();
    },
    set onToggleParent(j = void 0) {
      oe(j), R();
    },
    get onRetryParent() {
      return z();
    },
    set onRetryParent(j = void 0) {
      z(j), R();
    },
    get onToggleNodeParent() {
      return ee();
    },
    set onToggleNodeParent(j = void 0) {
      ee(j), R();
    },
    get onRetryNodeParent() {
      return I();
    },
    set onRetryNodeParent(j = void 0) {
      I(j), R();
    },
    get onToggleNodeChildren() {
      return fe();
    },
    set onToggleNodeChildren(j = void 0) {
      fe(j), R();
    },
    get onRetryNodeChildren() {
      return se();
    },
    set onRetryNodeChildren(j = void 0) {
      se(j), R();
    },
    get onCopyPointerDown() {
      return _e();
    },
    set onCopyPointerDown(j = void 0) {
      _e(j), R();
    },
    get onCopyNevent() {
      return ve();
    },
    set onCopyNevent(j = void 0) {
      ve(j), R();
    },
    get externalClientLabel() {
      return Ee();
    },
    set externalClientLabel(j = void 0) {
      Ee(j), R();
    },
    get onOpenExternalClient() {
      return Se();
    },
    set onOpenExternalClient(j = void 0) {
      Se(j), R();
    },
    get isCopyFailed() {
      return Fe();
    },
    set isCopyFailed(j = void 0) {
      Fe(j), R();
    },
    get onShowRawJson() {
      return ye();
    },
    set onShowRawJson(j = void 0) {
      ye(j), R();
    },
    get onBroadcastPointerDown() {
      return V();
    },
    set onBroadcastPointerDown(j = void 0) {
      V(j), R();
    },
    get onBroadcastPost() {
      return Ne();
    },
    set onBroadcastPost(j = void 0) {
      Ne(j), R();
    },
    get isBroadcastSending() {
      return ue();
    },
    set isBroadcastSending(j = void 0) {
      ue(j), R();
    },
    get canDeleteNodePost() {
      return K();
    },
    set canDeleteNodePost(j = void 0) {
      K(j), R();
    },
    get isDeletionSending() {
      return re();
    },
    set isDeletionSending(j = void 0) {
      re(j), R();
    },
    get onOpenDeleteConfirm() {
      return Ce();
    },
    set onOpenDeleteConfirm(j = void 0) {
      Ce(j), R();
    }
  }, G = Pe(), O = J(G);
  {
    var X = (j) => {
      var We = zp(), je = T(We);
      {
        var ae = (Ge) => {
          Ga(Ge, {
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
              return _();
            },
            get scrollRoot() {
              return v();
            },
            get onImageOpen() {
              return b();
            },
            get buildPostRecordForNode() {
              return x();
            },
            get onReplyPost() {
              return w();
            },
            get onQuotePost() {
              return E();
            },
            get getReactionReadModel() {
              return C();
            },
            get isReactionExpanded() {
              return m();
            },
            get getReactionLabel() {
              return a();
            },
            get onToggleReaction() {
              return L();
            },
            get onToggleParent() {
              return ee();
            },
            get onRetryParent() {
              return I();
            },
            get onToggleChildren() {
              return fe();
            },
            get onRetryChildren() {
              return se();
            },
            get onCopyPointerDown() {
              return _e();
            },
            get onCopyNevent() {
              return ve();
            },
            get externalClientLabel() {
              return Ee();
            },
            get onOpenExternalClient() {
              return Se();
            },
            get isCopyFailed() {
              return Fe();
            },
            get onShowRawJson() {
              return ye();
            },
            get onBroadcastPointerDown() {
              return V();
            },
            get onBroadcastPost() {
              return Ne();
            },
            get isBroadcastSending() {
              return ue();
            },
            get canDeleteNodePost() {
              return K();
            },
            get isDeletionSending() {
              return re();
            },
            get onOpenDeleteConfirm() {
              return Ce();
            }
          });
        }, $e = (Ge) => {
          Ga(Ge, {
            get state() {
              return r(Ae);
            },
            get previewModelByEventId() {
              return c();
            },
            get emojiLoadStateByUrl() {
              return u();
            },
            get emojiImageMetaByUrl() {
              return _();
            },
            get scrollRoot() {
              return v();
            },
            get onImageOpen() {
              return b();
            },
            get buildPostRecordForNode() {
              return x();
            },
            get onReplyPost() {
              return w();
            },
            get onQuotePost() {
              return E();
            },
            get getReactionReadModel() {
              return C();
            },
            get isReactionExpanded() {
              return m();
            },
            get getReactionLabel() {
              return a();
            },
            get onToggleReaction() {
              return L();
            },
            get onToggleParent() {
              return ee();
            },
            get onRetryParent() {
              return I();
            },
            get onToggleChildren() {
              return fe();
            },
            get onRetryChildren() {
              return se();
            },
            get onCopyPointerDown() {
              return _e();
            },
            get onCopyNevent() {
              return ve();
            },
            get externalClientLabel() {
              return Ee();
            },
            get onOpenExternalClient() {
              return Se();
            },
            get isCopyFailed() {
              return Fe();
            },
            get onShowRawJson() {
              return ye();
            },
            get onBroadcastPointerDown() {
              return V();
            },
            get onBroadcastPost() {
              return Ne();
            },
            get isBroadcastSending() {
              return ue();
            },
            get canDeleteNodePost() {
              return K();
            },
            get isDeletionSending() {
              return re();
            },
            get onOpenDeleteConfirm() {
              return Ce();
            }
          });
        }, Je = (Ge) => {
          var ne = Kp(), It = T(ne, !0);
          M(ne), Ie((ht) => te(It, ht), [() => n()("postHistory.replyTargetDeleted")]), D(Ge, ne);
        }, ut = (Ge) => {
          var ne = Yp(), It = T(ne, !0);
          M(ne), Ie((ht) => te(It, ht), [() => n()("postHistory.contextNotFound")]), D(Ge, ne);
        }, pt = (Ge) => {
          var ne = Qp(), It = J(ne), ht = T(It, !0);
          M(It);
          var an = H(It, 2);
          ar(an, {
            type: "button",
            className: "post-history-context-button post-history-context-retry-button",
            onClick: () => z()?.(),
            children: (sn, ln) => {
              Ma();
              var Ke = ta();
              Ie((ft) => te(Ke, ft), [() => n()("postHistory.contextRetry")]), D(sn, Ke);
            },
            $$slots: { default: !0 }
          }), Ie((sn) => te(ht, sn), [() => n()("postHistory.contextFetchFailed")]), D(Ge, ne);
        };
        be(je, (Ge) => {
          s().parentExpansion.visibleParent && s().parentNodeState ? Ge(ae) : s().parentExpansion.visibleParent && r(Ae) ? Ge($e, 1) : s().parentExpansion.visibleParent && s().parentExpansion.parentDeleted ? Ge(Je, 2) : s().parentExpansion.visibleParent && s().parentExpansion.parentMissing ? Ge(ut, 3) : s().parentExpansion.visibleParent && s().parentExpansion.parentError && Ge(pt, 4);
        });
      }
      var yt = H(je, 2), vt = T(yt);
      {
        var ot = (Ge) => {
          {
            let ne = P(() => s().parentExpansion.visibleParent ? n()("postHistory.hideReplyTarget") : n()("postHistory.showReplyTarget")), It = P(() => s().parentExpansion.visibleParent ? n()("postHistory.hideReplyTarget") : n()("postHistory.showReplyTarget")), ht = P(() => s().parentExpansion.visibleParent && s().parentExpansion.showParentLoadingIndicator);
            ud(Ge, {
              get ariaLabel() {
                return r(ne);
              },
              get title() {
                return r(It);
              },
              get expanded() {
                return s().parentExpansion.visibleParent;
              },
              get loading() {
                return r(ht);
              },
              onClick: () => oe()?.()
            });
          }
        };
        be(vt, (Ge) => {
          s().parentExpansion.visibleParent && s().parentExpansion.parentDeleted || Ge(ot);
        });
      }
      M(yt), M(We), Ie(() => Vc(We, `--thread-direct-parent-indent: ${He}`)), D(j, We);
    }, he = (j) => {
      var We = Wp(), je = T(We);
      Jo(je, 21, () => s().replyNodeStates, (ae) => ae.node.eventId, (ae, $e) => {
        Ga(ae, {
          get state() {
            return r($e);
          },
          get previewModelByEventId() {
            return c();
          },
          get emojiLoadStateByUrl() {
            return u();
          },
          get emojiImageMetaByUrl() {
            return _();
          },
          get scrollRoot() {
            return v();
          },
          get onImageOpen() {
            return b();
          },
          get buildPostRecordForNode() {
            return x();
          },
          get onReplyPost() {
            return w();
          },
          get onQuotePost() {
            return E();
          },
          get getReactionReadModel() {
            return C();
          },
          get isReactionExpanded() {
            return m();
          },
          get getReactionLabel() {
            return a();
          },
          get onToggleReaction() {
            return L();
          },
          get onToggleParent() {
            return ee();
          },
          get onRetryParent() {
            return I();
          },
          get onToggleChildren() {
            return fe();
          },
          get onRetryChildren() {
            return se();
          },
          get onCopyPointerDown() {
            return _e();
          },
          get onCopyNevent() {
            return ve();
          },
          get externalClientLabel() {
            return Ee();
          },
          get onOpenExternalClient() {
            return Se();
          },
          get isCopyFailed() {
            return Fe();
          },
          get onShowRawJson() {
            return ye();
          },
          get onBroadcastPointerDown() {
            return V();
          },
          get onBroadcastPost() {
            return Ne();
          },
          get isBroadcastSending() {
            return ue();
          },
          get canDeleteNodePost() {
            return K();
          },
          get isDeletionSending() {
            return re();
          },
          get onOpenDeleteConfirm() {
            return Ce();
          }
        });
      }), M(je), M(We), D(j, We);
    };
    be(O, (j) => {
      d() === "parent" && s().parentTargetId ? j(X) : d() === "children" && s().repliesActionState.visible && s().replyNodeStates.length > 0 && j(he, 1);
    });
  }
  D(t, G);
  var $ = zt(k);
  return i(), $;
}
Wt(
  vl,
  {
    state: {},
    section: {},
    previewModelByEventId: {},
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
function Gp({
  getShow: t,
  getPosts: e,
  getRxNostr: n,
  getRelayConfig: o,
  getIsSearchMode: i
}) {
  let s = me(ur({})), d = 0, c = [];
  function u() {
    c = [];
  }
  function _() {
    c.forEach((x) => x.release()), u();
  }
  function v() {
    _(), g(s, {}, !0);
  }
  function b(x, w) {
    if (x.kind !== 42)
      return null;
    if (!x.channelEventId)
      return w("postHistory.channelUnknown");
    const E = r(s)[x.channelEventId];
    return !E || E.status === "loading" ? w("postHistory.channelLoading") : E.status === "resolved" && E.name ? E.name : w("postHistory.channelUnknown");
  }
  return Xe(() => {
    t() || v();
  }), Xe(() => {
    if (t())
      return () => {
        _();
      };
  }), Xe(() => {
    if (!t())
      return;
    _();
    const x = e().filter((a) => a.kind === 42);
    if (x.length === 0)
      return;
    const w = Array.from(new Set(x.map((a) => a.channelEventId).filter((a) => typeof a == "string")));
    if (w.length === 0)
      return;
    const E = ++d, C = i() ? void 0 : n(), m = w.map((a) => {
      const L = Er.sanitizeExternalRelayUrls(x.filter((oe) => oe.channelEventId === a).flatMap((oe) => Hh(oe)), { limit: Nh });
      return $h.resolveInternal({ eventId: a, relayHints: L }, C, o());
    });
    c = m, g(
      s,
      {
        ...so(() => r(s)),
        ...Object.fromEntries(w.map((a) => [a, { status: "loading", name: null }]))
      },
      !0
    ), Promise.all(m.map((a) => a.cacheReady)).then((a) => {
      !t() || E !== d || g(
        s,
        {
          ...r(s),
          ...Object.fromEntries(a.map((L) => [
            L.context.eventId,
            Bh(L.cache, !!C)
          ]))
        },
        !0
      );
    }).catch((a) => {
      console.error("チャンネル表示のキャッシュ解決に失敗しました:", a);
    }), Promise.all(m.map((a) => a.refresh)).then((a) => {
      !t() || E !== d || (u(), g(
        s,
        {
          ...r(s),
          ...Object.fromEntries(a.map((L) => [
            L.snapshot.context.eventId,
            {
              status: L.snapshot.context.name ? "resolved" : "failed",
              name: L.snapshot.context.name
            }
          ]))
        },
        !0
      ));
    }).catch((a) => {
      E === d && u(), console.error("チャンネル表示のバックグラウンド解決に失敗しました:", a);
    });
  }), ts(() => {
    _();
  }), { getChannelText: b, cancelCurrentChannelResolution: _ };
}
function Zp() {
  let t = me(ur({})), e = me(!1), n = me(0), o = me(0), i, s = me(void 0);
  function d(w) {
    return qh(w, jc.value);
  }
  function c() {
    i && (clearTimeout(i), i = void 0), g(e, !1), g(s, void 0);
  }
  function u(w, E) {
    g(
      s,
      {
        eventId: w.eventId,
        ...ni(E.clientX, E.clientY)
      },
      !0
    );
  }
  function _(w, E) {
    if (r(s)?.eventId === w.eventId)
      return {
        x: r(s).x,
        y: r(s).y
      };
    const C = E.currentTarget, m = C instanceof HTMLElement ? C.getBoundingClientRect() : null;
    return ni(m ? m.left + m.width / 2 : 0, m ? m.bottom + 8 : 0);
  }
  function v(w, E) {
    i && clearTimeout(i), g(n, w, !0), g(o, E, !0), g(e, !0), i = setTimeout(
      () => {
        g(e, !1), i = void 0;
      },
      1800
    );
  }
  async function b(w, E) {
    const C = _(w, E), m = d(w);
    if (m ? await Uh(m, "nevent", navigator, window) : !1) {
      g(t, { ...r(t), [w.eventId]: void 0 }, !0), v(C.x, C.y);
      return;
    }
    g(t, { ...r(t), [w.eventId]: "failed" }, !0), setTimeout(
      () => {
        g(t, { ...r(t), [w.eventId]: void 0 }, !0);
      },
      1800
    );
  }
  function x() {
    g(t, {}, !0), c();
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
    hideCopyFloatingMessage: c,
    handleCopyNevent: b,
    resetState: x
  };
}
const Xp = 5e3, ji = 8;
class ey {
  console;
  setTimeoutFn;
  clearTimeoutFn;
  constructor(e = {}) {
    this.console = e.console ?? (typeof console < "u" ? console : { log: () => {
    }, warn: () => {
    }, error: () => {
    } }), this.setTimeoutFn = e.setTimeoutFn ?? ((n, o) => setTimeout(n, o)), this.clearTimeoutFn = e.clearTimeoutFn ?? ((n) => clearTimeout(n));
  }
  fetchEventById(e, n) {
    const o = Kc(), i = this.resolveRelayUrls(n.relayHints, n.relayConfig);
    let s = !1, d, c, u;
    const _ = () => {
      c !== void 0 && (this.clearTimeoutFn(c), c = void 0), d?.unsubscribe?.(), d = void 0;
    }, v = (x) => (w) => {
      s || (s = !0, _(), x(w));
    };
    return {
      promise: new Promise((x) => {
        const w = v(x);
        u = w;
        try {
          d = Yc(e, o, {
            on: i.length > 0 ? { relays: i } : { defaultReadRelays: !0 }
          }).subscribe({
            next: (E) => {
              E.event?.id === n.eventId && w({
                event: E.event,
                relayUrl: typeof E.from == "string" ? E.from : null
              });
            },
            complete: () => {
              w({ event: null, relayUrl: null });
            },
            error: (E) => {
              this.console.error("post_history_context_fetch_error", E), w({ event: null, relayUrl: null });
            }
          }), o.emit({ ids: [n.eventId] }), o.over(), c = this.setTimeoutFn(() => {
            this.console.warn("post_history_context_fetch_timeout", n.eventId), w({ event: null, relayUrl: null });
          }, n.timeoutMs ?? Xp);
        } catch (E) {
          this.console.error("post_history_context_fetch_request_error", E), w({ event: null, relayUrl: null });
        }
      }),
      cancel: () => {
        u?.({ event: null, relayUrl: null });
      }
    };
  }
  resolveRelayUrls(e, n) {
    const o = Qc(
      e,
      ji
    );
    if (o)
      return o;
    const i = n ? [
      ...Er.extractReadRelays(n),
      ...Er.extractWriteRelays(n)
    ] : [], s = Er.sanitizeExternalRelayUrls([
      ...e ?? [],
      ...i
    ], { limit: ji });
    return s.length > 0 ? s : Er.sanitizeExternalRelayUrls(
      ru,
      { limit: ji }
    );
  }
}
const hd = new ey(), ty = 8;
function _s(t) {
  return Er.sanitizeExternalRelayUrls(t, { limit: ty });
}
function Gd(t, e) {
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
function Zd(t) {
  return {
    targetEventId: t.targetEventId,
    status: "loading",
    event: null,
    profile: null,
    authorPubkey: t.authorHint ?? null,
    relayHints: _s(t.relayHints ?? []),
    errorCode: null,
    updatedAt: null
  };
}
function fd({
  getShow: t,
  getRxNostr: e,
  getRelayConfig: n,
  postHistoryRepositoryImpl: o = lt,
  contextFetchService: i = hd,
  deletionRequestsRepositoryImpl: s = Ls,
  deletionFetchService: d = Cl,
  profileSyncCoordinator: c = void 0
}) {
  const u = c ?? Il({ getShow: t, getRxNostr: e }), _ = !c;
  let v = me({}), b = me(ur({})), x = me(ur({}));
  const w = /* @__PURE__ */ new Map(), E = /* @__PURE__ */ new Map(), C = /* @__PURE__ */ new Map(), m = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map(), L = /* @__PURE__ */ new Map(), oe = /* @__PURE__ */ new Map();
  let z = 0;
  function ee(k) {
    g(
      b,
      {
        ...r(b),
        [k]: (r(b)[k] ?? 0) + 1
      },
      !0
    );
  }
  function I(k) {
    const G = E.get(k);
    if (G)
      for (const O of G)
        ee(O);
  }
  function fe(k, G) {
    const O = r(v)[k], X = G(O);
    return O && O.status === X.status && O.event === X.event && O.profile === X.profile && O.authorPubkey === X.authorPubkey && O.errorCode === X.errorCode && O.updatedAt === X.updatedAt && al(O.relayHints, X.relayHints) ? O : (g(v, { ...r(v), [k]: X }), I(k), X);
  }
  function se(k, G) {
    return fe(k, (O) => {
      const X = O ?? Zd({ targetEventId: k });
      return {
        targetEventId: k,
        status: G.status ?? X.status,
        event: G.event !== void 0 ? G.event : X.event,
        profile: G.profile !== void 0 ? G.profile : X.profile,
        authorPubkey: G.authorPubkey !== void 0 ? G.authorPubkey : X.authorPubkey,
        relayHints: G.relayHints ? _s(G.relayHints) : X.relayHints,
        errorCode: G.errorCode !== void 0 ? G.errorCode : X.errorCode,
        updatedAt: G.updatedAt !== void 0 ? G.updatedAt : X.updatedAt
      };
    });
  }
  function _e(k) {
    const G = r(v)[k.targetEventId], O = _s([...G?.relayHints ?? [], ...k.relayHints ?? []]), X = G?.authorPubkey ?? k.authorHint ?? null, he = !G || G.authorPubkey !== X || !al(G.relayHints, O);
    return se(k.targetEventId, { authorPubkey: X, relayHints: O }), he;
  }
  function ve(k) {
    const G = w.get(k.scopeKey) ?? /* @__PURE__ */ new Set();
    G.add(k.targetEventId), w.set(k.scopeKey, G);
    const O = E.get(k.targetEventId) ?? /* @__PURE__ */ new Set();
    O.add(k.scopeKey), E.set(k.targetEventId, O), k.scopeKey in r(x) || g(x, { ...r(x), [k.scopeKey]: 0 }, !0), k.scopeKey in r(b) || g(b, { ...r(b), [k.scopeKey]: 0 }, !0);
  }
  async function Ee(k, G) {
    return (await s.getDeletedTargets([{ targetAuthorPubkey: k, targetEventId: G }])).get(k)?.has(G) ?? !1;
  }
  function Se(k, G) {
    if (!(!k || !G))
      for (const [O, X] of Object.entries(r(v)))
        X.authorPubkey === k && se(O, { profile: G });
  }
  function Fe(k, G) {
    const O = u.ensureProfile(k, G);
    Se(k, O);
  }
  u.subscribe((k, G) => {
    t() && Se(k, G);
  });
  async function ye(k, G, O = {}) {
    if (!k.pubkey || !k.id)
      return !1;
    if (await Ee(k.pubkey, k.id))
      return se(k.id, {
        status: "deleted",
        event: null,
        authorPubkey: k.pubkey,
        relayHints: G,
        errorCode: null,
        updatedAt: Date.now()
      }), !0;
    if (a.has(k.id))
      return a.get(k.id) ?? !1;
    const X = e();
    if (!X)
      return !1;
    const he = (async () => {
      try {
        const $ = d.fetchDeletionRequests(X, {
          targets: [{ event: k, relayUrls: G }],
          relayHints: G,
          relayConfig: n()
        });
        L.set(k.id, $);
        const j = await $.promise;
        j.events.length > 0 && await s.upsertValidDeletionRequests({
          targetEvents: [k],
          deletionEvents: j.events,
          fetchedAt: j.fetchedAt
        });
        const We = await Ee(k.pubkey, k.id);
        return We && se(k.id, {
          status: "deleted",
          event: null,
          authorPubkey: k.pubkey,
          relayHints: G,
          errorCode: null,
          updatedAt: Date.now()
        }), We;
      } catch {
        return !1;
      } finally {
        L.delete(k.id), a.delete(k.id);
      }
    })();
    return a.set(k.id, he), O.background ? !1 : he;
  }
  function V(k, G) {
    return oe.get(k) === G;
  }
  async function Ne(k, G = {}) {
    ve(k);
    const O = r(v)[k.targetEventId], X = _e(k), he = r(v)[k.targetEventId] ?? Zd(k), $ = !!G.background && O?.status === "resolved";
    if (!G.force && O) {
      if (O.status === "resolved" || O.status === "deleted")
        return O.status === "resolved" && O.authorPubkey && Fe(O.authorPubkey, r(v)[k.targetEventId]?.relayHints ?? O.relayHints), r(v)[k.targetEventId] ?? O;
      if (O.status === "loading" && C.has(k.targetEventId))
        return await C.get(k.targetEventId) ?? r(v)[k.targetEventId] ?? O;
      if (!X && (O.status === "not-found" || O.status === "error"))
        return r(v)[k.targetEventId] ?? O;
    }
    if (!G.force && C.has(k.targetEventId))
      return await C.get(k.targetEventId) ?? r(v)[k.targetEventId] ?? he;
    G.force && (m.get(k.targetEventId)?.cancel(), m.delete(k.targetEventId), C.delete(k.targetEventId));
    const j = ++z;
    oe.set(k.targetEventId, j);
    const We = (async () => {
      try {
        $ || se(k.targetEventId, { status: "loading", errorCode: null });
        const je = await o.getByEventId(k.targetEventId);
        if (!V(k.targetEventId, j))
          return r(v)[k.targetEventId] ?? null;
        if (je) {
          const vt = _s([
            ...he.relayHints,
            ...je.relayHints,
            ...je.acceptedRelays,
            ...je.fetchedRelays ?? []
          ]);
          if (typeof je.deletedAt == "number")
            return se(k.targetEventId, {
              status: "deleted",
              event: null,
              authorPubkey: je.pubkeyHex,
              relayHints: vt,
              errorCode: null,
              updatedAt: Date.now()
            });
          const ot = gl(je), Ge = se(k.targetEventId, {
            status: "resolved",
            event: ot,
            authorPubkey: ot.pubkey,
            relayHints: vt,
            errorCode: null,
            updatedAt: Date.now()
          });
          return Fe(ot.pubkey, vt), ye(ot, vt, { background: !0 }), r(v)[k.targetEventId] ?? Ge;
        }
        if (k.authorHint) {
          const vt = await ye(Gd(k.targetEventId, k.authorHint), he.relayHints);
          if (!V(k.targetEventId, j))
            return r(v)[k.targetEventId] ?? null;
          if (vt)
            return r(v)[k.targetEventId] ?? null;
        }
        const ae = e();
        if (!ae || !t())
          return $ ? r(v)[k.targetEventId] ?? he : se(k.targetEventId, {
            status: "error",
            event: null,
            authorPubkey: he.authorPubkey,
            relayHints: he.relayHints,
            errorCode: "nostr_not_ready",
            updatedAt: Date.now()
          });
        const $e = i.fetchEventById(ae, {
          eventId: k.targetEventId,
          relayHints: he.relayHints,
          relayConfig: n()
        });
        m.set(k.targetEventId, $e);
        const Je = await $e.promise;
        if (m.delete(k.targetEventId), !V(k.targetEventId, j))
          return r(v)[k.targetEventId] ?? null;
        if (!Je.event) {
          if (k.authorHint) {
            const vt = await ye(Gd(k.targetEventId, k.authorHint), he.relayHints);
            if (!V(k.targetEventId, j))
              return r(v)[k.targetEventId] ?? null;
            if (vt)
              return r(v)[k.targetEventId] ?? null;
          }
          return $ ? r(v)[k.targetEventId] ?? he : se(k.targetEventId, {
            status: "not-found",
            event: null,
            authorPubkey: he.authorPubkey,
            relayHints: he.relayHints,
            errorCode: null,
            updatedAt: Date.now()
          });
        }
        const ut = _s([
          ...he.relayHints,
          ...Je.relayUrl ? [Je.relayUrl] : []
        ]), pt = await ye(Je.event, ut);
        if (!V(k.targetEventId, j))
          return r(v)[k.targetEventId] ?? null;
        if (pt)
          return r(v)[k.targetEventId] ?? null;
        const yt = se(k.targetEventId, {
          status: "resolved",
          event: Je.event,
          authorPubkey: Je.event.pubkey,
          relayHints: ut,
          errorCode: null,
          updatedAt: Date.now()
        });
        return Fe(Je.event.pubkey, ut), r(v)[k.targetEventId] ?? yt;
      } catch {
        return V(k.targetEventId, j) ? $ ? r(v)[k.targetEventId] ?? he : se(k.targetEventId, {
          status: "error",
          event: null,
          authorPubkey: he.authorPubkey,
          relayHints: he.relayHints,
          errorCode: "fetch_failed",
          updatedAt: Date.now()
        }) : r(v)[k.targetEventId] ?? null;
      } finally {
        m.delete(k.targetEventId), C.delete(k.targetEventId);
      }
    })();
    return C.set(k.targetEventId, We), await We;
  }
  async function ue(k, G = {}) {
    return await Promise.all(k.map((O) => Ne(O, G)));
  }
  async function K(k, G = {}) {
    return await Ne(k, { ...G, force: !0 });
  }
  function re(k) {
    return r(v)[k] ?? null;
  }
  function Ce(k) {
    return r(b)[k] ?? 0;
  }
  function He(k) {
    const G = w.get(k);
    if (G)
      for (const O of G) {
        const X = E.get(O);
        X && (X.delete(k), !(X.size > 0) && (E.delete(O), oe.delete(O), m.get(O)?.cancel(), m.delete(O), L.get(O)?.cancel(), L.delete(O), C.delete(O), a.delete(O)));
      }
    w.delete(k), g(
      x,
      {
        ...r(x),
        [k]: (r(x)[k] ?? 0) + 1
      },
      !0
    ), ee(k);
  }
  function Ae() {
    m.forEach((k) => k.cancel()), L.forEach((k) => k.cancel()), m.clear(), L.clear(), C.clear(), a.clear(), w.clear(), E.clear(), _ && u.reset(), oe.clear(), g(v, {}), g(b, {}, !0), g(x, {}, !0);
  }
  return {
    ensureTarget: Ne,
    ensureTargets: ue,
    retryTarget: K,
    getTargetSnapshot: re,
    getScopeRevision: Ce,
    invalidateScope: He,
    reset: Ae
  };
}
const ny = /nostr:[^\s<>"']+/gi, ry = /[),.!?:;\]\u3001\u3002\uff01\uff08\uff09\uff0c\uff0e\uff1a\uff1b\u300d\u300f\u3011]+$/u, oy = /^[\s),.!?:;\]\u3001\u3002\uff01\uff08\uff09\uff0c\uff0e\uff1a\uff1b\u300d\u300f\u3011]+$/u;
function ay(t) {
  return Er.sanitizeExternalRelayUrls(
    typeof t == "string" && t.length > 0 ? [t] : [],
    { limit: 1 }
  )[0] ?? null;
}
function sy(t) {
  const e = t.match(ry);
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
function iy(t) {
  if (!t.toLowerCase().startsWith("nostr:"))
    return null;
  try {
    const e = Xc.decode(t.slice(6));
    return e.type === "note" ? e.data : e.type === "nevent" ? e.data.id : null;
  } catch {
    return null;
  }
}
function ly(t) {
  const e = t.replace(/[ \t]{2,}/g, " ").trim();
  return e.length === 0 || oy.test(e) ? null : e;
}
function nh(t) {
  if (!t)
    return [];
  const e = /* @__PURE__ */ new Map();
  for (const n of t.tags) {
    if (!Array.isArray(n) || n[0] !== "q")
      continue;
    const o = n[1];
    if (!Dd(o))
      continue;
    const i = ay(n[2]), s = Dd(n[3]) ? n[3] : null, d = e.get(o);
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
function dy(t) {
  if (!t || typeof t.content != "string" || t.content.length === 0)
    return t?.content ?? "";
  const e = nh(t);
  if (e.length === 0)
    return t.content;
  const n = new Set(
    e.map((s) => s.eventId)
  );
  let o = !1;
  const i = t.content.split(/\r?\n/).map((s) => {
    if (!s)
      return s;
    let d = "", c = 0, u = !1;
    for (const _ of s.matchAll(ny)) {
      const v = _.index ?? -1, b = _[0] ?? "";
      if (v < 0 || !b)
        continue;
      const { uri: x, trailingText: w } = sy(b), E = iy(x);
      !E || !n.has(E) || (u = !0, o = !0, d += s.slice(c, v), d += w, c = v + b.length);
    }
    return u ? (d += s.slice(c), ly(d)) : s;
  });
  return o ? i.filter((s) => s !== null).join(`
`) : t.content;
}
const cy = 8, Xd = {
  byPostId: {},
  contextsByEventId: {}
};
function gd(t) {
  return Er.sanitizeExternalRelayUrls(t, {
    limit: cy
  });
}
function rh(t) {
  return {
    sourceEventId: t.sourceEventId,
    targetEventId: t.targetEventId,
    relationKind: t.relationKind,
    relayHints: gd(t.relayHints),
    authorHint: t.authorHint,
    scopeKey: t.scopeKey
  };
}
const Aa = {
  buildIndex(t) {
    const e = {}, n = {};
    for (const o of t) {
      const i = nh(o);
      if (i.length !== 0) {
        e[o.eventId] = i;
        for (const s of i) {
          const d = n[s.eventId];
          n[s.eventId] = {
            eventId: s.eventId,
            sourceEventId: d?.sourceEventId ?? o.eventId,
            authorHint: d?.authorHint ?? s.authorHint,
            relayHints: gd([
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
    return rh({
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
    const n = ma(e.event);
    return gd([
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
    const e = ma(t.event);
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
    return rh({
      sourceEventId: t.sourceEventId,
      targetEventId: t.targetEventId,
      relationKind: "reply-parent",
      relayHints: t.relayHints,
      authorHint: t.authorHint,
      scopeKey: e
    });
  }
};
let uy = 0;
function hy(t) {
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
function fy(t, e) {
  const n = hy(e?.status);
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
function gy({
  getShow: t,
  getPosts: e,
  getRxNostr: n,
  getRelayConfig: o,
  postHistoryRepositoryImpl: i = lt,
  contextFetchService: s = hd,
  deletionRequestsRepositoryImpl: d = Ls,
  deletionFetchService: c = Cl,
  profileSyncCoordinator: u = void 0,
  relatedTargetResolver: _ = void 0
}) {
  const v = _ ?? fd({
    getShow: t,
    getRxNostr: n,
    getRelayConfig: o,
    postHistoryRepositoryImpl: i,
    contextFetchService: s,
    deletionRequestsRepositoryImpl: d,
    deletionFetchService: c,
    profileSyncCoordinator: u
  }), b = !_, x = `post-history-quote-preview:${++uy}`;
  let w = me(0), E = null, C = Xd;
  function m() {
    const ee = e();
    return ee !== E && (E = ee, C = Aa.buildIndex(ee)), t() ? C : Xd;
  }
  function a() {
    b && v.reset();
  }
  function L(ee) {
    return r(w), (m().byPostId[ee.eventId] ?? []).map((I) => fy(I.eventId, v.getTargetSnapshot(I.eventId)));
  }
  function oe(ee) {
    const I = m().contextsByEventId[ee];
    I && v.retryTarget(Aa.toDescriptor(I, x));
  }
  async function z(ee) {
    const I = Aa.buildIndex(ee), fe = Object.values(I.contextsByEventId);
    fe.length !== 0 && await v.ensureTargets(fe.map((se) => Aa.toDescriptor(se, x)), { force: !0 });
  }
  return Xe(() => {
    t() && g(w, v.getScopeRevision(x), !0);
  }), Xe(() => {
    if (!t())
      return;
    n(), o();
    const ee = Object.values(m().contextsByEventId);
    ee.length !== 0 && v.ensureTargets(ee.map((I) => Aa.toDescriptor(I, x)));
  }), ts(() => {
    v.invalidateScope(x), a();
  }), { getQuotePreviews: L, retryQuotePreview: oe, refreshQuotePreviews: z };
}
const ii = {
  currentPage: 1,
  searchPage: 1,
  searchInput: "",
  searchQuery: ""
}, li = /* @__PURE__ */ new Map();
function vd(t) {
  if (typeof t != "string")
    return null;
  const e = t.trim();
  return e.length > 0 ? e : null;
}
function ec(t) {
  return typeof t != "number" || !Number.isFinite(t) ? 1 : Math.max(1, Math.trunc(t));
}
function di(t) {
  return {
    currentPage: t.currentPage,
    searchPage: t.searchPage,
    searchInput: t.searchInput,
    searchQuery: t.searchQuery
  };
}
function vy(t) {
  const e = vd(t);
  return di(
    e ? li.get(e) ?? ii : ii
  );
}
function tc(t, e) {
  const n = vd(t);
  if (!n)
    return di(
      ii
    );
  const o = li.get(n) ?? ii, i = {
    currentPage: ec(e.currentPage ?? o.currentPage),
    searchPage: ec(e.searchPage ?? o.searchPage),
    searchInput: e.searchInput ?? o.searchInput,
    searchQuery: e.searchQuery ?? o.searchQuery
  };
  return li.set(n, i), di(i);
}
function nc(t) {
  const e = vd(t);
  e && li.delete(e);
}
function py(t) {
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
function yy(t) {
  return Number.isFinite(t) ? Math.max(1, Math.trunc(t)) : 1;
}
function my(t) {
  return Number.isFinite(t) ? Math.max(1, Math.trunc(t)) : 50;
}
function by(t) {
  return t.trim().toLowerCase().split(/\s+/).filter(Boolean);
}
function Cy(t) {
  return t.join(" ");
}
function rc(t) {
  return {
    postHistory: Ja(t),
    channelMetadata: jh()
  };
}
function Yi(t, e) {
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
function wy(t) {
  return Array.from(
    new Set(
      t.map((e) => e.channelEventId).filter(
        (e) => typeof e == "string" && e.length > 0
      )
    )
  );
}
class xy {
  constructor(e = lt, n = Vh) {
    this.postHistoryRepositoryImpl = e, this.channelMetadataRepositoryImpl = n;
  }
  resolvedCacheEntry = null;
  inFlightEntry = null;
  runtimeCacheToken = 0;
  clearCache() {
    this.resolvedCacheEntry = null, this.inFlightEntry = null, this.runtimeCacheToken += 1;
  }
  isResolvedCacheEntryCurrent(e, n, o, i) {
    return e.pubkeyHex === n && e.normalizedQueryKey === o && Yi(e.revision, i);
  }
  async buildFilteredPosts(e, n) {
    const o = await this.postHistoryRepositoryImpl.getAll({ pubkeyHex: e }), i = wy(o), s = /* @__PURE__ */ new Map();
    return i.length > 0 && (await this.channelMetadataRepositoryImpl.getMany(
      i
    )).forEach((c) => {
      s.set(c.channelEventId, c);
    }), o.filter((d) => {
      const c = Py(
        d,
        d.channelEventId ? s.get(d.channelEventId) ?? null : null
      );
      return n.every((u) => c.includes(u));
    });
  }
  startFilteredPostsBuild(e, n, o, i) {
    const s = Symbol("post-history-local-search"), d = this.runtimeCacheToken, c = {
      identity: s,
      runtimeCacheToken: d,
      pubkeyHex: e,
      normalizedQueryKey: n,
      revision: i,
      promise: Promise.resolve([])
    };
    return c.promise = (async () => {
      let u = i;
      for (let _ = 0; _ < 2; _ += 1) {
        const v = await this.buildFilteredPosts(e, o), b = rc(e), x = Yi(
          u,
          b
        );
        if (x && this.inFlightEntry?.identity === s && this.runtimeCacheToken === d && (this.resolvedCacheEntry = {
          pubkeyHex: e,
          normalizedQueryKey: n,
          revision: u,
          filteredPosts: v
        }), x || _ === 1)
          return v;
        u = b, this.inFlightEntry?.identity === s && this.runtimeCacheToken === d && (c.revision = u);
      }
      return [];
    })().finally(() => {
      this.inFlightEntry?.identity === s && (this.inFlightEntry = null);
    }), this.inFlightEntry = c, c;
  }
  async searchLocalPosts(e) {
    const n = by(e.query);
    if (!e.pubkeyHex || n.length === 0)
      return {
        items: [],
        total: 0,
        hasNext: !1
      };
    const o = yy(e.page), i = my(e.pageSize), s = e.pubkeyHex, d = Cy(n), c = rc(s), u = this.resolvedCacheEntry, _ = u && this.isResolvedCacheEntryCurrent(
      u,
      s,
      d,
      c
    ) ? u.filteredPosts : await (() => {
      const x = this.inFlightEntry;
      return (x && x.runtimeCacheToken === this.runtimeCacheToken && x.pubkeyHex === s && x.normalizedQueryKey === d && Yi(x.revision, c) ? x : this.startFilteredPostsBuild(
        s,
        d,
        n,
        c
      )).promise;
    })(), v = (o - 1) * i, b = v + i;
    return {
      items: _.slice(v, b),
      total: _.length,
      hasNext: b < _.length
    };
  }
}
const Cs = new xy(), Ry = 500, Sy = 12, Iy = 3600;
class oc extends Error {
  phase;
  phaseStartedAt;
  errorClass;
  constructor(e, n, o) {
    super(e), this.name = "PostHistoryCurrentViewRefetchFailure", this.phase = e, this.phaseStartedAt = o, this.errorClass = n instanceof Error ? n.name : typeof n, this.cause = n;
  }
}
function _y(t, e) {
  return t.status === "timeout" || t.status === "error" || t.status === "cancelled" ? t.status : typeof t.coverageComplete == "boolean" ? t.coverageComplete && !t.coverageSaturated ? "complete" : "partial" : t.hasMore || t.perRelayCounts.some((n) => n.rawCount >= e) ? "partial" : "complete";
}
function Ey(t) {
  return t === "partial" || t === "timeout" || t === "error";
}
function Ay(t, e) {
  return typeof t.coverageSaturated == "boolean" ? t.coverageSaturated : t.hasMore || t.perRelayCounts.some((n) => n.rawCount >= e);
}
function Dy(t) {
  return typeof t.since == "number" && typeof t.until == "number" && t.until - t.since > Iy;
}
function ky(t) {
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
  now;
  constructor(e = {}) {
    this.postHistoryRelayFetchService = e.postHistoryRelayFetchService ?? Xs, this.postHistoryRepository = e.postHistoryRepository ?? lt, this.setTimeoutFn = e.setTimeoutFn ?? setTimeout, this.clearTimeoutFn = e.clearTimeoutFn ?? clearTimeout, this.console = e.console ?? (typeof globalThis.console < "u" ? globalThis.console : { debug: () => {
    } }), this.now = e.now ?? Date.now;
  }
  async waitBetweenFetches(e) {
    await new Promise((n) => {
      const o = this.setTimeoutFn(() => {
        e(null), n();
      }, Ry);
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
        let u = 0, _ = 0, v = 0, b = 0, x = !1, w = !1, E = !1, C = !1, m = !1, a = 0, L = 0, oe = 0, z = 0, ee = 0, I = !0;
        const fe = [];
        for (; d.length > 0; ) {
          const Se = d.shift();
          if (o || (b > 0 && await this.waitBetweenFetches((X) => {
            s = X;
          }), o))
            break;
          const Fe = this.postHistoryRelayFetchService.fetchLatest(e, {
            pubkeyHex: n.pubkeyHex,
            relayConfig: n.relayConfig,
            reason: "repair-visible-range",
            kinds: Se.kinds,
            limit: Se.limit || zc,
            timeoutMs: Kh,
            ...typeof Se.since == "number" ? { since: Se.since } : {},
            ...typeof Se.until == "number" ? { until: Se.until } : {}
          });
          i = Fe;
          const ye = this.now();
          let V;
          try {
            V = await Fe.promise;
          } catch (X) {
            const he = this.now();
            throw oe += Math.max(0, he - ye), new oc(
              "primary-fetch",
              X,
              ye
            );
          }
          oe += Math.max(0, this.now() - ye), i = null, b += 1, L += V.events.length, E = E || V.status === "error", C = C || V.status === "timeout";
          const Ne = typeof V.coverageComplete == "boolean", ue = V.events.length === 0 && (Ne ? V.allCoverageRelaysFailed === !0 : !V.hasAnyRelayResponse && (V.allRelaysFailed || V.status === "error"));
          I = I && ue;
          let K = 0, re = 0, Ce = 0;
          if (V.events.length > 0) {
            const X = this.now();
            ee += 1;
            let he;
            try {
              he = await this.postHistoryRepository.upsertFetchedEvents({
                events: V.events,
                fetchedAt: V.fetchedAt
              });
            } catch ($) {
              throw z += Math.max(0, this.now() - X), new oc(
                "primary-persist",
                $,
                X
              );
            }
            z += Math.max(0, this.now() - X), K = he.insertedCount, re = he.updatedCount, Ce = he.unchangedCount, u += K, _ += re, v += Ce, await n.onProgress?.({
              insertedCount: K,
              updatedCount: re,
              unchangedCount: Ce,
              processedRangeCount: fe.length + 1,
              attemptedRangeCount: b,
              addedCount: u,
              totalUpdatedCount: _,
              totalUnchangedCount: v
            });
          }
          const He = Ay(V, Se.limit);
          w = w || He;
          const Ae = He ? ky(Se) : [], k = Ae.length > 0 && fe.length + 1 + d.length + Ae.length <= Sy, G = He ? "limit" : _y(V, Se.limit);
          if (fe.push({
            source: "preferred",
            rangeUnit: Se.rangeUnit,
            ...typeof Se.since == "number" ? { since: Se.since } : {},
            ...typeof Se.until == "number" ? { until: Se.until } : {},
            requestedRelayUrls: [...V.requestedRelayUrls],
            observedRelayUrls: [...V.observedRelayUrls],
            eventRelayUrls: [...V.eventRelayUrls],
            eoseRelayUrls: [...V.eoseRelayUrls],
            closedRelayUrls: [...V.closedRelayUrls],
            errorRelayUrls: [...V.errorRelayUrls],
            downRelayUrls: [...V.downRelayUrls],
            completedByRxNostr: V.completedByRxNostr,
            completedByLocalTimeout: V.completedByLocalTimeout,
            hasAnyRelayResponse: V.hasAnyRelayResponse,
            allRelaysFailed: V.allRelaysFailed,
            ...typeof V.coverageComplete == "boolean" ? {
              coverageRelayUrls: [...V.coverageRelayUrls ?? []],
              coverageEoseRelayUrls: [...V.coverageEoseRelayUrls ?? []],
              bestEffortRelayUrls: [...V.bestEffortRelayUrls ?? []],
              coverageComplete: V.coverageComplete,
              coverageSaturated: V.coverageSaturated ?? !1,
              allCoverageRelaysFailed: V.allCoverageRelaysFailed ?? !1
            } : {},
            status: G,
            rawCount: V.rawCount,
            uniqueCount: V.uniqueCount,
            duplicateCount: V.duplicateCount,
            insertedCount: K,
            updatedCount: re,
            unchangedCount: Ce
          }), He && k ? (a += Ae.length, d.unshift(...Ae)) : He && (m = !0), (Ey(G) || ue || He && !k) && (x = !0), o || V.status === "cancelled") {
            o = !0;
            break;
          }
        }
        const se = !o && b > 0 && L === 0 && I, _e = x || m || se, Ee = {
          status: o ? "cancelled" : _e ? "partial" : "success",
          addedCount: u,
          updatedCount: _,
          unchangedCount: v,
          processedRangeCount: fe.length,
          attemptedRangeCount: b,
          hadFailures: _e,
          limitReached: w,
          hadFetchError: E,
          fetchFailed: se,
          hadTimeout: C,
          hadUnfinishedRanges: m,
          splitRetryCount: a,
          processedRanges: fe,
          timing: {
            primaryFetchDurationMs: oe,
            primaryPersistDurationMs: z,
            primaryPersistAttemptCount: ee
          }
        };
        return this.console.debug("post_history_current_view_refetch_summary", {
          pubkeyHex: n.pubkeyHex,
          processedRangeCount: Ee.processedRangeCount,
          addedCount: Ee.addedCount,
          updatedCount: Ee.updatedCount,
          hadFailures: Ee.hadFailures,
          limitReached: Ee.limitReached,
          hadFetchError: Ee.hadFetchError,
          fetchFailed: Ee.fetchFailed,
          hadTimeout: Ee.hadTimeout,
          hadUnfinishedRanges: Ee.hadUnfinishedRanges,
          splitRetryCount: Ee.splitRetryCount,
          processedRanges: Ee.processedRanges
        }), Ee;
      })(),
      cancel: () => {
        o = !0, s?.(), i?.cancel();
      }
    };
  }
}
const Ty = new My(), Oy = 300 * 1e3;
function Ly(t, e, n) {
  const o = new Set(
    n.map((s) => s.eventId)
  ), i = /* @__PURE__ */ new Map();
  for (const s of e)
    s.kind !== 1 && s.kind !== 42 || s.pubkeyHex !== t || !o.has(s.eventId) || i.has(s.eventId) || i.set(s.eventId, s);
  return Array.from(i.values());
}
function Fy(t, e, n, o, i = Oy) {
  return t.filter((s) => {
    if (n.has(s))
      return !1;
    const d = e.get(s);
    return typeof d != "number" || o - d >= i;
  });
}
function ac(t, e) {
  return {
    status: e ? t.status : "cancelled",
    savedDirectReplyCount: t.savedDirectReplyCount
  };
}
function Hy({
  getShow: t,
  getPubkeyHex: e,
  getRxNostr: n,
  getRelayConfig: o,
  getLoadedPosts: i,
  onChildInteractionBadgeRefreshRequested: s,
  onQuoteVisibleRangeRefreshRequested: d,
  quoteVisibleRangeRepairExecutor: c,
  relationRepairService: u = Rf,
  triggerDeletionLifecycle: _ = Pl,
  now: v = Date.now
}) {
  let b = null, x = 0, w = 0, E = !1;
  const C = /* @__PURE__ */ new Set(), m = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Set();
  function L(ue, K) {
    return !E && ue === x && K();
  }
  function oe(ue, K, re) {
    return !E && ue === w && t() && e() === K && n() === re;
  }
  function z(ue) {
    const K = i();
    K.length === 0 || ue.length === 0 || Promise.resolve(
      s(K, ue)
    ).catch(() => {
    });
  }
  async function ee(ue) {
    const K = i();
    K.length === 0 || ue.length === 0 || await s(K, ue);
  }
  function I(ue) {
    ue.length !== 0 && Promise.resolve(
      d(ue)
    ).catch(() => {
    });
  }
  async function fe(ue) {
    if (!ue.isActive())
      return;
    const K = If(ue.source, {
      relationKinds: ue.result.relationKinds,
      savedParentEventIds: ue.result.savedParentEventIds,
      checkedParentEventIds: ue.result.checkedParentEventIds,
      quoteRepairApplied: ue.result.quoteRepairApplied,
      status: ue.result.status
    });
    if (K.shouldRefreshQuotePreviews && ue.isActive() && I(ue.quoteRefreshPosts), !(K.parentEventIds.length === 0 || !ue.isActive())) {
      if (ue.awaitBadgeRefresh) {
        await ee(K.parentEventIds);
        return;
      }
      z(K.parentEventIds);
    }
  }
  function se(ue) {
    return u.repairVisibleRangeRelations(ue.rxNostr, {
      ownerPubkeyHex: ue.ownerPubkeyHex,
      visiblePosts: ue.visiblePosts,
      relationKinds: Sf,
      quoteVisibleRangeRepairExecutor: c,
      relayConfig: o(),
      isActive: ue.isActive
    });
  }
  function _e(ue, K, re, Ce) {
    K.length !== 0 && _({
      source: ue,
      parentEventIds: K,
      rxNostr: re,
      relayConfig: o(),
      isActive: Ce
    }).then((He) => {
      He.status === "cancelled" || He.deletedReactionEventIds.length === 0 && He.deletedReplyEventIds.length === 0 || !Ce() || z(He.checkedParentEventIds);
    }).catch(() => {
    });
  }
  async function ve(ue) {
    if (ue.visiblePosts.length === 0)
      return {
        status: "success",
        savedDirectReplyCount: 0
      };
    const K = ++x, re = () => L(K, ue.isActive);
    _e(
      "listing-current-view",
      ue.visiblePosts.map((Ae) => Ae.eventId),
      ue.rxNostr,
      re
    );
    const Ce = se({
      ...ue,
      isActive: re
    }), He = v();
    b = Ce;
    try {
      const Ae = await Ce.promise, k = Math.max(0, v() - He), G = re();
      if (b === Ce && (b = null), Ae.status === "cancelled" || !G)
        return ac(Ae, !1);
      const O = v();
      try {
        await fe({
          source: "listing-manual-refetch",
          result: Ae,
          quoteRefreshPosts: ue.visiblePosts,
          isActive: re,
          awaitBadgeRefresh: !0
        });
      } catch (X) {
        return {
          status: re() ? "partial" : "cancelled",
          savedDirectReplyCount: Ae.savedDirectReplyCount,
          relationRepairDurationMs: k,
          failurePhase: "badge-refresh",
          failureDurationMs: Math.max(0, v() - O),
          failureErrorClass: X instanceof Error ? X.name : typeof X
        };
      }
      return {
        ...ac(Ae, re()),
        relationRepairDurationMs: k,
        badgeRefreshDurationMs: Math.max(0, v() - O)
      };
    } catch (Ae) {
      return b === Ce && (b = null), {
        status: re() ? "partial" : "cancelled",
        savedDirectReplyCount: 0,
        failurePhase: "relation-repair",
        failureDurationMs: Math.max(0, v() - He),
        failureErrorClass: Ae instanceof Error ? Ae.name : typeof Ae
      };
    }
  }
  async function Ee(ue) {
    if (ue.visiblePosts.length !== 0)
      try {
        _e(
          "listing-current-view",
          ue.visiblePosts.map((Ce) => Ce.eventId),
          ue.rxNostr,
          ue.isActive
        );
        const re = await se(ue).promise;
        if (re.status === "cancelled" || !ue.isActive())
          return;
        await fe({
          source: "listing-current-view",
          result: re,
          quoteRefreshPosts: ue.visiblePosts,
          isActive: ue.isActive,
          awaitBadgeRefresh: !0
        });
      } catch {
      }
  }
  function Se(ue) {
    const K = e(), re = n(), Ce = w;
    if (!K || ue.length === 0)
      return;
    const He = Ly(
      K,
      ue,
      i()
    );
    if (He.length === 0)
      return;
    const Ae = He.map(($) => $.eventId);
    if (!re)
      return;
    const k = () => oe(
      Ce,
      K,
      re
    );
    _e(
      "listing-older-reveal",
      Ae,
      re,
      k
    );
    const G = Fy(
      Ae,
      m,
      a,
      v()
    ), O = new Set(G), X = He.filter(
      ($) => O.has($.eventId)
    );
    if (X.length === 0)
      return;
    X.forEach(($) => {
      a.add($.eventId);
    });
    const he = se({
      ownerPubkeyHex: K,
      rxNostr: re,
      visiblePosts: X,
      isActive: k
    });
    C.add(he), he.promise.then(($) => {
      !k() || $.status === "cancelled" || (fe({
        source: "listing-older-reveal",
        result: $,
        quoteRefreshPosts: X,
        isActive: k,
        awaitBadgeRefresh: !1
      }), $.checkedParentEventIds.length > 0 && $.checkedParentEventIds.forEach((j) => {
        m.set(j, v());
      }));
    }).catch(() => {
    }).finally(() => {
      Ce === w && (C.delete(he), X.forEach(($) => {
        a.delete($.eventId);
      }));
    });
  }
  function Fe() {
    x += 1, b?.cancel(), b = null;
  }
  function ye() {
    w += 1, C.forEach((ue) => ue.cancel()), C.clear(), m.clear(), a.clear();
  }
  function V() {
    Fe(), ye();
  }
  function Ne() {
    E = !0, V();
  }
  return {
    repairCurrentView: ve,
    repairJump: Ee,
    scheduleOlderRevealRepair: Se,
    cancelCurrentViewRepair: Fe,
    resetOlderRevealRepairContext: ye,
    resetAllRepairs: V,
    dispose: Ne
  };
}
const Ny = "postHistoryJumpCacheAnchors:", Qi = 200, zi = 720 * 60 * 60 * 1e3;
function zs(t) {
  return `${Ny}${t}`;
}
function $y(t) {
  if (!t || typeof t != "object")
    return !1;
  const e = t;
  return Number.isFinite(e.centerCreatedAt) && Number.isFinite(e.radiusSec) && (e.radiusSec ?? 0) > 0 && Number.isFinite(e.fetchedAt);
}
function By(t) {
  if (!t || typeof t != "object")
    return !1;
  const e = t;
  return typeof e.pubkeyHex == "string" && Array.isArray(e.anchors) && e.anchors.every((n) => $y(n));
}
function sc(t, e, n, o) {
  const i = e - Math.max(0, Math.trunc(n));
  return t.filter(
    (s) => Number.isFinite(s.centerCreatedAt) && Number.isFinite(s.radiusSec) && s.radiusSec > 0 && Number.isFinite(s.fetchedAt) && s.fetchedAt >= i
  ).sort((s, d) => d.fetchedAt - s.fetchedAt).slice(0, Math.max(1, Math.trunc(o)));
}
function Uy(t, e, n) {
  return t.findIndex(
    (o) => Math.abs(o.centerCreatedAt - e) <= Math.max(o.radiusSec, n)
  );
}
class qy {
  constructor(e = wl, n = Date.now) {
    this.db = e, this.now = n;
  }
  async getForPubkey(e, n = {}) {
    const o = n.ttlMs ?? zi, i = n.maxCount ?? Qi, s = await this.db.meta.get(zs(e));
    return !s || !By(s.value) ? [] : sc(s.value.anchors, this.now(), o, i);
  }
  async addForPubkey(e) {
    const n = e.ttlMs ?? zi, o = e.maxCount ?? Qi, i = Number.isFinite(e.fetchedAt) ? Math.trunc(e.fetchedAt ?? 0) : this.now(), s = Number.isFinite(e.centerCreatedAt) ? Math.trunc(e.centerCreatedAt) : 0, d = Number.isFinite(e.radiusSec) ? Math.max(1, Math.trunc(e.radiusSec ?? 1)) : 1, c = await this.getForPubkey(e.pubkeyHex, {
      ttlMs: n,
      maxCount: o
    }), u = Uy(
      c,
      s,
      d
    ), _ = [...c];
    if (u >= 0) {
      const b = _[u];
      _[u] = {
        centerCreatedAt: s,
        radiusSec: Math.max(b.radiusSec, d),
        fetchedAt: Math.max(b.fetchedAt, i)
      };
    } else
      _.unshift({
        centerCreatedAt: s,
        radiusSec: d,
        fetchedAt: i
      });
    const v = sc(
      _,
      this.now(),
      n,
      o
    );
    return await this.db.meta.put({
      key: zs(e.pubkeyHex),
      value: {
        pubkeyHex: e.pubkeyHex,
        anchors: v
      },
      updatedAt: this.now()
    }), v;
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
    }), c = d.filter((v) => {
      const b = v.centerCreatedAt + v.radiusSec;
      return Math.max(0, n - b) <= o;
    }), u = d.filter((v) => !c.includes(v)), _ = c.length > 0 ? Math.min(
      n,
      ...c.map((v) => Math.max(0, v.centerCreatedAt - v.radiusSec))
    ) : n;
    return c.length > 0 && await this.db.meta.put({
      key: zs(e.pubkeyHex),
      value: {
        pubkeyHex: e.pubkeyHex,
        anchors: u
      },
      updatedAt: this.now()
    }), {
      nextVisibleUntil: _,
      removedCount: c.length,
      anchors: u
    };
  }
  async clearForPubkey(e) {
    e && await this.db.meta.delete(zs(e));
  }
}
const Ps = new qy(), oh = "postHistoryVisibleRange:";
function Wi(t, e) {
  return `${oh}${t}:${e}`;
}
function Vy(t) {
  if (!t || typeof t != "object")
    return !1;
  const e = t;
  return typeof e.pubkeyHex == "string" && typeof e.kindsKey == "string" && (typeof e.visibleUntil == "number" || e.visibleUntil === null);
}
function jy(t) {
  const e = /* @__PURE__ */ new Set();
  for (const n of t)
    Number.isFinite(n) && e.add(Math.trunc(n));
  return [...e].sort((n, o) => n - o).join(",");
}
class Ky {
  constructor(e = wl, n = Date.now) {
    this.db = e, this.now = n;
  }
  async get(e, n) {
    const o = await this.db.meta.get(Wi(e, n));
    return !o || !Vy(o.value) ? null : {
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
    const n = `${oh}${e}:`, o = await this.db.meta.filter((i) => i.key.startsWith(n)).primaryKeys();
    await this.db.meta.bulkDelete(o);
  }
}
const Wa = new Ky();
function Yy(t) {
  const e = t.error, n = t.errorClass ?? (e instanceof Error ? e.name : e === void 0 ? void 0 : typeof e);
  return {
    phase: t.phase,
    durationMs: t.durationMs ?? Math.max(0, (t.finishedAt ?? Date.now()) - t.startedAt),
    ...n ? { errorClass: n } : {},
    ...t.counts ?? {}
  };
}
function ao(t) {
  const e = Yy(t);
  "errorClass" in e ? console.warn("post_history_manual_repair_phase", e) : console.debug("post_history_manual_repair_phase", e);
}
function Qy(t) {
  return t.map((e) => e.event?.id).filter((e) => !!e);
}
function zy({
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
    const v = Math.max(0, o - t.length), b = e.slice(0, v);
    return {
      posts: [...t, ...b],
      didTrimForOlderAppend: !1,
      didDeferOlderPosts: b.length < e.length
    };
  }
  const d = typeof n == "string" ? s.findIndex((v) => v.eventId === n) : -1, c = (v) => {
    const b = s.slice(v, v + o), x = Math.max(0, b.length - Math.max(0, t.length - v));
    return {
      posts: b,
      didTrimForOlderAppend: !0,
      didDeferOlderPosts: x < e.length
    };
  };
  if (d < 0)
    return c(s.length - o);
  const u = Math.max(0, s.length - o), _ = Math.min(u, Math.max(0, d - i));
  return c(_);
}
function Wy(t, e) {
  const n = new Set(t.map((o) => o.eventId));
  return e.filter((o) => !n.has(o.eventId));
}
const ci = {
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
}, ws = jy([...Jc]), ic = 1440 * 60, lc = 4320 * 60, Jy = 100, Gy = 720 * 60;
function Ji(t, e) {
  if (t.length === 0)
    return !0;
  const n = t[t.length - 1]?.createdAt;
  return Number.isFinite(n) ? (n ?? 0) > e : !0;
}
const dc = 720 * 60, Zy = 3600, Gi = [
  720 * 60,
  1440 * 60,
  4320 * 60,
  10080 * 60,
  336 * 60 * 60,
  720 * 60 * 60
], Xy = 6, em = 720 * 60 * 60;
function tm({
  status: t,
  changed: e,
  didCursorAdvanceOlder: n,
  hitLimit: o,
  continuedWithinWindow: i,
  attemptIndex: s,
  maxAttempts: d,
  totalVisibleAdded: c,
  targetVisibleAdded: u,
  exploredSeconds: _,
  maxExploreSeconds: v
}) {
  return t !== "success" ? { shouldContinue: !1, reason: `status-${t}` } : n ? o && !i ? {
    shouldContinue: !1,
    reason: "hit-limit-continuation-unavailable"
  } : c >= u ? {
    shouldContinue: !1,
    reason: "target-visible-added-reached"
  } : _ >= v ? { shouldContinue: !1, reason: "max-explore-seconds-reached" } : s >= d ? { shouldContinue: !1, reason: "max-attempts-reached" } : {
    shouldContinue: !0,
    reason: e ? "small-batch-continue" : "empty-window-continue"
  } : { shouldContinue: !1, reason: "cursor-not-advanced" };
}
const pd = /* @__PURE__ */ new Map();
async function nm({
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
function zr(t) {
  if (typeof t != "string")
    return null;
  const e = t.trim();
  return e.length > 0 ? e : null;
}
function pl(t) {
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
function rm(t) {
  const e = zr(t);
  return pl(e ? pd.get(e) ?? ci : ci);
}
function Zi(t, e) {
  const n = zr(t);
  n && pd.set(n, pl(e));
}
function om(t) {
  const e = zr(t);
  e && pd.delete(e);
}
function am({
  getShow: t,
  getPubkeyHex: e,
  getRxNostr: n,
  getRelayConfig: o,
  getSessionScrollState: i = () => null,
  onSessionScrollStateInvalidated: s = () => {
  },
  onSavedAuthoredPosts: d = () => {
  },
  onChildInteractionBadgeRefreshRequested: c = () => {
  },
  onQuoteVisibleRangeRefreshRequested: u = () => {
  },
  quoteVisibleRangeRepairExecutor: _ = void 0,
  pageSize: v = Wc,
  searchDebounceMs: b = 250
}) {
  const x = vy(e()), w = rm(e()), E = w.searchQuery === x.searchQuery && x.searchQuery.length > 0, C = w.totalCountKnown ?? w.totalCount > 0, m = w.totalCountFailed ? "failed" : C ? "ready" : "unknown", a = ur({
    loadedPosts: w.loadedPosts,
    searchPosts: E ? w.searchPosts : [],
    searchInput: x.searchInput,
    searchQuery: x.searchQuery,
    currentPage: 1,
    searchPage: E ? x.searchPage : 1,
    totalCount: w.totalCount,
    totalCountKnown: C,
    totalCountStatus: m,
    searchTotalCount: w.searchTotalCount,
    searchHasNext: w.searchHasNext,
    syncStatus: "idle",
    currentViewRefetchStatus: "idle",
    currentViewRefetchMessageKey: null,
    currentViewRefetchMessageValues: null,
    hasMoreRemote: w.hasMoreRemote,
    nextUntil: w.nextUntil,
    lastDialogOpenRefreshAt: w.lastDialogOpenRefreshAt,
    visibleUntil: w.visibleUntil,
    hasJumpCacheAnchors: w.hasJumpCacheAnchors,
    hasOlderLocal: w.hasOlderLocal,
    hasNewerLocal: w.hasNewerLocal,
    listingMode: "contiguous",
    sparseSource: null,
    hasSavedPostsOutsideVisibleRange: !1,
    latestOlderBackfillUiResult: null
  });
  let L = 0, oe = !1, z = me(!1), ee = me(null), I = null, fe = 0, se = null, _e = 0, ve = me(!1), Ee = me("idle"), Se = !1, Fe = !1, ye = null, V = me("idle"), Ne = 0, ue = zr(e()), K = me(ur(ue)), re = null, Ce = null, He = 0, Ae = null, k = null, G = null, O = null, X = n(), he = E ? x.searchQuery : "", $ = !E;
  const j = ur({
    windowSeconds: dc,
    nextUntil: null,
    consecutiveEmptyCount: 0,
    lastRange: null,
    continuationSince: null,
    exhausted: !1
  }), We = Math.max(v * 3, v), je = Hy({
    getShow: t,
    getPubkeyHex: e,
    getRxNostr: n,
    getRelayConfig: o,
    getLoadedPosts: () => a.loadedPosts,
    onChildInteractionBadgeRefreshRequested: c,
    onQuoteVisibleRangeRefreshRequested: u,
    quoteVisibleRangeRepairExecutor: _
  }), ae = P(() => a.searchQuery.length > 0), $e = P(() => a.currentViewRefetchStatus === "refetching"), Je = P(() => r(ae) ? a.searchPosts : a.loadedPosts), ut = P(() => r(ae) ? a.searchPage : 1), pt = P(() => r(ae) ? a.searchTotalCount : a.totalCount), yt = P(() => r(ae) ? Math.max(1, Math.ceil(a.searchTotalCount / v)) : 1), vt = P(() => !r($e) && r(ae) && a.searchPage > 1), ot = P(() => r(vt)), Ge = P(() => !r($e) && !r(ve) && r(ae) && a.searchHasNext), ne = P(() => r(Ge)), It = P(() => !1), ht = P(() => !r($e) && (r(ae) ? !r(ve) && a.searchHasNext : a.hasOlderLocal)), an = P(() => !r($e) && !r(ae) && a.hasNewerLocal), sn = P(() => !r(ae) && !r($e) && (a.listingMode === "sparse" || a.hasNewerLocal)), ln = P(() => r(Je)[0]?.createdAt ?? null), Ke = P(() => r(Je).length > 0 ? r(Je)[r(Je).length - 1]?.createdAt ?? null : null), ft = P(() => !r(ae) && !r($e) && a.hasOlderLocal && (a.listingMode === "sparse" || !(typeof r(Ke) == "number" && (a.visibleUntil === null ? a.hasJumpCacheAnchors : r(Ke) < a.visibleUntil)))), Ye = P(() => !r(ae) && !!e() && !!n() && !r($e) && !j.exhausted && a.syncStatus !== "syncing" && a.syncStatus !== "older-syncing"), _t = P(() => !r(ae) && a.syncStatus === "older-syncing"), pn = P(() => !r(ae) && (a.syncStatus === "syncing" || a.syncStatus === "older-syncing")), Pn = P(() => !r(ae) && a.listingMode === "contiguous" && a.loadedPosts.length > 0 && !a.hasOlderLocal && a.syncStatus !== "syncing"), mt = P(() => !r(ae) && a.listingMode === "contiguous" && typeof a.visibleUntil == "number" && a.loadedPosts.length > 0 && !a.hasOlderLocal && a.hasSavedPostsOutsideVisibleRange), Ut = P(() => r(Je).length), Ft = P(() => !!e() && !!n() && !r(ae) && a.loadedPosts.length > 0 && !r($e) && a.syncStatus !== "syncing" && a.syncStatus !== "older-syncing"), Ht = P(() => r(ae) || a.syncStatus === "idle" ? null : a.syncStatus === "syncing" || a.syncStatus === "older-syncing" ? "postHistory.syncing" : a.syncStatus === "synced" ? "postHistory.synced" : a.syncStatus === "no-more" ? null : "postHistory.syncFailed"), Rt = P(() => !r(ae) && (a.syncStatus === "syncing" || a.syncStatus === "older-syncing")), Xt = P(() => r(Rt) || r($e)), qt = P(() => a.currentViewRefetchStatus === "refetching" ? "postHistory.repairing" : a.currentViewRefetchMessageKey), Vt = P(() => a.currentViewRefetchStatus === "refetching" ? null : a.currentViewRefetchMessageValues);
  function Et() {
    He += 1, Ce?.cancel(), Ce = null;
  }
  function et() {
    k = null;
  }
  function en(f, y) {
    return !!f && !!y && f.postedAt === y.postedAt && f.createdAt === y.createdAt && f.eventId === y.eventId;
  }
  function dt(f) {
    return f === He;
  }
  function dn(f, y) {
    return t() && e() === f && y === L;
  }
  function Zn() {
    oe = !1, g(z, !1), g(ee, null), I = null;
  }
  async function Ln(f, y, A) {
    return await Go(), y() ? oe ? (g(ee, zr(f), !0), !0) : A() ? (await new Promise((U) => {
      requestAnimationFrame(() => requestAnimationFrame(() => U()));
    }), y() ? (oe = !0, g(ee, zr(f), !0), g(z, !0), !0) : !1) : (oe = !0, g(ee, zr(f), !0), g(z, !0), !0) : !1;
  }
  function Yn() {
    Ae?.cancel(), Ae = null, je.cancelCurrentViewRepair(), a.currentViewRefetchStatus === "refetching" && (a.currentViewRefetchStatus = "idle"), qe();
  }
  function qe() {
    G !== null && (clearTimeout(G), G = null);
  }
  function Jt() {
    O !== null && (clearTimeout(O), O = null);
  }
  function Fn() {
    j.windowSeconds = dc, j.nextUntil = null, j.consecutiveEmptyCount = 0, j.lastRange = null, j.continuationSince = null, j.exhausted = !1;
  }
  function gr() {
    a.currentViewRefetchMessageKey = null, a.currentViewRefetchMessageValues = null, qe();
  }
  function Ar() {
    qe();
    const f = /* @__PURE__ */ new Set([
      "postHistory.repairNoChanges",
      "postHistory.repairAdded",
      "postHistory.repairChildInteractionsAdded",
      "postHistory.repairFetchFailed"
    ]);
    f.has(a.currentViewRefetchMessageKey ?? "") && (G = setTimeout(
      () => {
        a.currentViewRefetchMessageKey !== null && f.has(a.currentViewRefetchMessageKey) && (a.currentViewRefetchMessageKey = null, a.currentViewRefetchMessageValues = null), G = null;
      },
      3500
    ));
  }
  function In() {
    Jt(), !(a.syncStatus !== "synced" && a.syncStatus !== "failed") && (O = setTimeout(
      () => {
        (a.syncStatus === "synced" || a.syncStatus === "failed") && (a.syncStatus = "idle"), O = null;
      },
      3500
    ));
  }
  function Hn() {
    _e += 1, g(ve, !1), g(Ee, "idle"), Cs.clearCache?.(), Zn(), a.searchInput = "", a.searchQuery = "", a.searchPage = 1, a.searchPosts = [], a.searchTotalCount = 0, a.searchHasNext = !1, he = "", ir(), io();
  }
  function sr() {
    et(), p(), a.loadedPosts = [], l({ known: !1, status: "unknown" }), a.currentPage = 1, a.syncStatus = "idle", a.hasMoreRemote = !1, a.nextUntil = null, a.lastDialogOpenRefreshAt = null, a.visibleUntil = null, a.hasJumpCacheAnchors = !1, a.hasOlderLocal = !1, a.hasNewerLocal = !1, a.listingMode = "contiguous", a.sparseSource = null, a.hasSavedPostsOutsideVisibleRange = !1, a.latestOlderBackfillUiResult = null, Hn();
  }
  function xr() {
    const f = zr(e());
    return !!f && f === r(K);
  }
  function ir() {
    xr() && tc(e(), {
      searchInput: a.searchInput,
      searchQuery: a.searchQuery,
      currentPage: a.currentPage,
      searchPage: a.searchPage
    });
  }
  function io() {
    xr() && Zi(e(), {
      loadedPosts: a.loadedPosts,
      searchPosts: a.searchPosts,
      searchQuery: a.searchQuery,
      totalCount: a.totalCount,
      totalCountKnown: a.totalCountKnown,
      totalCountFailed: a.totalCountStatus === "failed",
      searchTotalCount: a.searchTotalCount,
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
  function Bn(f) {
    g(K, zr(f), !0);
  }
  function Dr() {
    et(), p(), je.resetOlderRevealRepairContext(), a.loadedPosts = [], a.searchPosts = [], l({ count: 0, known: !0, status: "ready" }), a.searchTotalCount = 0, a.searchHasNext = !1, a.currentPage = 1, a.searchPage = 1, a.hasMoreRemote = !1, a.nextUntil = null, a.lastDialogOpenRefreshAt = null, a.visibleUntil = null, a.hasJumpCacheAnchors = !1, a.hasOlderLocal = !1, a.hasNewerLocal = !1, a.listingMode = "contiguous", a.sparseSource = null, a.hasSavedPostsOutsideVisibleRange = !1, a.syncStatus = "idle", Fn(), gr(), Jt(), Hn(), Se = !0;
  }
  function lo() {
    return a.listingMode === "sparse" && (a.sparseSource === "saved" || a.sparseSource === "jump");
  }
  function Jr() {
    if (!lo())
      return !1;
    const f = e();
    return sr(), Fn(), gr(), Jt(), nc(f), Zi(f, { ...ci }), !0;
  }
  function Ur() {
    et(), L += 1, _e += 1, g(ve, !1), g(Ee, "idle");
  }
  function Gr() {
    const f = Jr();
    return Et(), Yn(), Ur(), p(), Cs.clearCache?.(), je.resetOlderRevealRepairContext(), f;
  }
  function kr() {
    Jr(), Et(), Yn(), Ur(), p(), Cs.clearCache?.(), je.resetOlderRevealRepairContext(), a.syncStatus = "idle", Fn(), gr(), Jt(), Se = !1, Fe = !1, ye = null, Ne += 1, g(V, "idle"), $ = !1;
  }
  function ra(f) {
    const y = Di(f);
    a.hasMoreRemote = y, a.nextUntil = y ? f.nextUntil : null;
  }
  function Sa(f) {
    Di(f) && a.nextUntil === null && (a.hasMoreRemote = !0, a.nextUntil = f.nextUntil);
  }
  async function co(f) {
    return typeof r(Ke) == "number" && (a.visibleUntil === null ? a.hasJumpCacheAnchors : r(Ke) < a.visibleUntil) ? r(Ke) : typeof j.nextUntil == "number" ? j.nextUntil : nm({
      nextUntil: a.nextUntil,
      visibleOldestCreatedAt: r(Ke),
      pubkeyHex: f,
      getOldestCreatedAt: (y) => lt.getOldestCreatedAt(y)
    });
  }
  function qr(f) {
    if (!Number.isFinite(f))
      return null;
    const y = Math.trunc(f) - 1;
    return y < 0 ? null : {
      since: (typeof j.continuationSince == "number" && j.continuationSince <= y ? j.continuationSince : null) ?? Math.max(0, y - j.windowSeconds),
      until: y,
      windowSeconds: j.windowSeconds
    };
  }
  function uo(f, y) {
    const A = [];
    return f.hasMore && A.push("hasMore"), f.rawCount >= y && A.push("rawCount"), f.perRelayCounts.some((U) => U.rawCount >= y) && A.push("perRelayRawCount"), A;
  }
  function mo(f) {
    return typeof f.oldestCreatedAt == "number" ? f.oldestCreatedAt : f.events.reduce(
      (y, A) => {
        const U = A.event.created_at;
        return Number.isFinite(U) && (y === null || U < y) ? Math.trunc(U) : y;
      },
      null
    );
  }
  function Fo(f, y) {
    j.nextUntil = f, j.continuationSince = y, j.exhausted = f === null, a.nextUntil = f, a.hasMoreRemote = f !== null;
  }
  function Ho(f, y, A) {
    uo(y, A), mo(y), y.rawCount ?? y.events.length, y.uniqueCount ?? y.events.length, typeof j.nextUntil == "number" && qr(j.nextUntil);
  }
  function bo() {
    if (a.searchQuery)
      return [];
    const f = a.loadedPosts.map((U) => U.createdAt).filter((U) => Number.isFinite(U)).map((U) => Math.trunc(U));
    if (f.length === 0)
      return [];
    const y = Math.min(...f), A = Math.max(...f);
    return [
      {
        kinds: [...Jc],
        rangeUnit: "custom",
        since: Math.max(0, y - ic),
        until: A + ic,
        limit: zc
      }
    ];
  }
  async function Co(f) {
    return (await Wa.get(f, ws))?.visibleUntil ?? null;
  }
  async function wn(f, y = null) {
    const A = await Co(f);
    return t() && e() === f && (y === null || y === L) && (a.visibleUntil = A), A;
  }
  async function No(f, y = null) {
    const U = (await Ps.getForPubkey(f, { maxCount: 1 })).length > 0;
    return t() && e() === f && (y === null || y === L) && (a.hasJumpCacheAnchors = U), U;
  }
  async function Mr(f, y) {
    const A = await Co(f), U = y.events.length === 0 ? null : Di(y) ? y.nextUntil : typeof y.oldestCreatedAt == "number" ? y.oldestCreatedAt : null, W = typeof U == "number" ? typeof A == "number" ? Math.min(A, U) : U : A;
    return W !== A && await Wa.save({
      pubkeyHex: f,
      kindsKey: ws,
      visibleUntil: W
    }), a.visibleUntil = W, W;
  }
  async function Ia(f, y) {
    const A = await Co(f), U = mo(y), W = typeof U == "number" ? typeof A == "number" ? Math.min(A, U) : U : A;
    return W !== A && await Wa.save({
      pubkeyHex: f,
      kindsKey: ws,
      visibleUntil: W
    }), a.visibleUntil = W, W;
  }
  async function $o(f, y, A) {
    if (typeof y != "number")
      return y;
    const U = A.filter((ie) => ie.source === "preferred" && ie.status === "complete" && typeof ie.since == "number" && typeof ie.until == "number" && ie.until >= y - 1).map((ie) => ie.since);
    if (U.length === 0)
      return y;
    const W = Math.min(y, ...U);
    return W === y ? y : (await Wa.save({
      pubkeyHex: f,
      kindsKey: ws,
      visibleUntil: W
    }), a.visibleUntil = W, W);
  }
  async function Bo(f, y) {
    return typeof y == "number" ? lt.countVisibleForPubkey(f, y) : lt.countForPubkey(f);
  }
  async function ho(f, y) {
    if (typeof y == "number")
      return lt.countVisibleForPubkey(f, y);
    const A = se;
    return A?.pubkeyHex === f && (await A.promise, a.totalCountKnown) || a.totalCountKnown ? a.totalCount : lt.countForPubkey(f);
  }
  function fo(f, y) {
    if (r(ae) || a.listingMode !== "contiguous" || a.sparseSource !== null || e() !== f || a.visibleUntil !== y.visibleUntil)
      return !1;
    const A = Y(a.loadedPosts[a.loadedPosts.length - 1]);
    return en(A, y.oldestCursor);
  }
  async function Po(f, y) {
    const A = k;
    if (!A || A.pubkeyHex !== f)
      return null;
    const U = await wn(f, y);
    if (!t() || e() !== f || y !== L || !fo(f, A))
      return null;
    const [W, ie] = await Promise.all([
      Promise.resolve(Ja(f)),
      ho(f, U)
    ]);
    return !fo(f, A) || W !== A.revision || ie !== A.totalVisibleCount ? null : A;
  }
  async function oa(f, y, A, U, W) {
    if (et(), A.length === 0 || !t() || e() !== f || y !== L || a.listingMode !== "contiguous" || a.sparseSource !== null)
      return !1;
    const ie = await ho(f, U), pe = await Co(f), Ve = Ja(f);
    if (Ve !== W || pe !== U || !t() || e() !== f || y !== L || a.listingMode !== "contiguous" || a.sparseSource !== null || a.loadedPosts[0]?.eventId !== A[0]?.eventId || a.loadedPosts[a.loadedPosts.length - 1]?.eventId !== A[A.length - 1]?.eventId)
      return !1;
    const Be = Y(A[A.length - 1]);
    return Be ? (k = {
      pubkeyHex: f,
      visibleUntil: U,
      revision: Ve,
      totalVisibleCount: ie,
      reachedVisibleCount: A.length,
      oldestCursor: Be,
      latestEventId: A[0]?.eventId ?? null
    }, !0) : !1;
  }
  async function Uo(f, y, A) {
    const U = k;
    if (!U || U.pubkeyHex !== f || r(ae) || a.listingMode !== "contiguous" || a.sparseSource !== null || e() !== f)
      return !1;
    const W = Y(a.loadedPosts[a.loadedPosts.length - 1]);
    if (!en(W, U.oldestCursor))
      return !1;
    const ie = await ho(f, y);
    return !t() || e() !== f || !en(W, Y(a.loadedPosts[a.loadedPosts.length - 1])) ? !1 : (k = {
      ...U,
      visibleUntil: y,
      revision: Ja(f),
      totalVisibleCount: ie
    }, !0);
  }
  async function Un() {
    et(), await we();
  }
  function Zr(f, y = a.loadedPosts) {
    if (a.listingMode === "sparse" || a.hasJumpCacheAnchors)
      return !0;
    const A = y.length > 0 ? y[y.length - 1]?.createdAt ?? null : null;
    return typeof A != "number" ? !1 : f === null ? a.hasJumpCacheAnchors : A < f;
  }
  function l({ count: f, known: y, status: A }) {
    typeof f == "number" && (a.totalCount = f), a.totalCountKnown = y, a.totalCountStatus = A;
  }
  function p() {
    fe += 1, se = null, l({
      known: a.totalCountKnown,
      status: a.totalCountKnown ? "ready" : "unknown"
    });
  }
  function F(f, { force: y = !1 } = {}) {
    if (!t() || e() !== f || !y && se?.pubkeyHex === f)
      return;
    const A = ++fe;
    l({
      known: a.totalCountKnown,
      status: a.totalCountKnown ? "refreshing" : "loading"
    });
    const U = lt.countForPubkey(f).then((W) => {
      A !== fe || !t() || e() !== f || l({ count: W, known: !0, status: "ready" });
    }).catch(() => {
      A !== fe || !t() || e() !== f || l({ known: a.totalCountKnown, status: "failed" });
    }).finally(() => {
      se?.requestId === A && (se = null);
    });
    se = { requestId: A, pubkeyHex: f, promise: U };
  }
  function N({ force: f = !1 } = {}) {
    const y = e();
    !y || !t() || F(y, { force: f });
  }
  async function q(f, y, A = null, U = null) {
    const W = typeof y == "number" ? await lt.hasPostsBeforeCreatedAt(f, y) : !1;
    !t() || e() !== f || A !== null && A !== L || U !== null && !dt(U) || (a.hasSavedPostsOutsideVisibleRange = W);
  }
  function Y(f) {
    return f ? {
      eventId: f.eventId,
      postedAt: f.postedAt,
      createdAt: f.createdAt
    } : null;
  }
  function le(f, y) {
    return f.length <= We ? f : f.slice(0, We);
  }
  function Te(f, y, A) {
    return zy({
      currentPosts: f,
      olderPosts: y,
      anchorEventId: A,
      maxVisiblePosts: We,
      keepAbove: v
    });
  }
  async function de(f, y = a.loadedPosts, A = null, U = {}) {
    if (y.length === 0) {
      t() && e() === f && (A === null || A === L) && (a.hasOlderLocal = !1, a.hasNewerLocal = !1);
      return;
    }
    const W = Y(y[0]), ie = Y(y[y.length - 1]), pe = a.visibleUntil, Ve = a.sparseSource === "saved" && typeof pe == "number" ? W ? lt.getSparseChunk({
      pubkeyHex: f,
      visibleUntil: pe,
      cursor: W,
      direction: "newer",
      limit: 1
    }) : Promise.resolve([]) : W ? lt.getNewerVisibleChunk({ pubkeyHex: f, visibleUntil: pe, cursor: W, limit: 1 }) : Promise.resolve([]), Be = U.skipOlderCheck ? Promise.resolve([]) : a.sparseSource === "saved" && typeof pe == "number" ? ie ? lt.getSparseChunk({
      pubkeyHex: f,
      visibleUntil: pe,
      cursor: ie,
      direction: "older",
      limit: 1
    }) : Promise.resolve([]) : a.sparseSource === "jump" ? ie ? lt.getOlderVisibleChunk({
      pubkeyHex: f,
      visibleUntil: null,
      cursor: ie,
      limit: 1
    }) : Promise.resolve([]) : ie ? lt.getOlderVisibleChunk({ pubkeyHex: f, visibleUntil: pe, cursor: ie, limit: 1 }) : Promise.resolve([]), [Ze, Re] = await Promise.all([Ve, Be]);
    !t() || e() !== f || A !== null && A !== L || (a.hasNewerLocal = Ze.length > 0, U.skipOlderCheck || (a.hasOlderLocal = Re.length > 0));
  }
  async function we({
    forceTotalCount: f = !1,
    skipTotalCountRefresh: y = !1,
    skipOlderAvailabilityCheck: A = !1,
    awaitProgress: U = !1
  } = {}) {
    et();
    const W = e();
    if (!W) {
      g(K, null), sr();
      return;
    }
    const ie = ++L, pe = await wn(W, ie), Ve = Ja(W), Be = await lt.getLatestVisibleChunk({ pubkeyHex: W, limit: v, visibleUntil: pe });
    if (!t() || e() !== W || ie !== L || (Bn(W), a.listingMode = "contiguous", a.sparseSource = null, a.loadedPosts = Be, !await Ln(W, () => dn(W, ie), () => a.loadedPosts.length > 0)))
      return;
    y || N({ force: f }), No(W, ie).catch(() => {
    });
    const Ze = oa(W, ie, Be, pe, Ve);
    let Re = !1;
    U ? Re = await Ze.catch(() => (et(), !1)) : Ze.catch(() => {
      et();
    });
    const At = A && Re;
    A && !At ? a.hasOlderLocal = !1 : At && k && (a.hasOlderLocal = k.totalVisibleCount > k.reachedVisibleCount), q(W, pe, ie).catch(() => {
    }), de(W, Be, ie, { skipOlderCheck: At }).then(() => {
      !t() || e() !== W || ie !== L || eo(W, Be);
    }).catch(() => {
    });
  }
  async function De({ skipTotalCountRefresh: f = !1 } = {}) {
    et();
    const y = e();
    if (!y || a.loadedPosts.length === 0) {
      await we({ skipTotalCountRefresh: f });
      return;
    }
    const A = a.loadedPosts[0], U = Y(A);
    if (!U) {
      await we({ skipTotalCountRefresh: f });
      return;
    }
    const W = ++L, ie = await wn(y), Ve = Zr(ie, a.loadedPosts) ? await lt.getVisibleChunkFromCreatedAt({
      pubkeyHex: y,
      visibleUntil: ie,
      createdAt: A.createdAt,
      limit: a.loadedPosts.length,
      query: { contiguous: !1 }
    }) : await (a.loadedPosts.length > 1 ? lt.getOlderVisibleChunk({
      pubkeyHex: y,
      visibleUntil: ie,
      cursor: U,
      limit: a.loadedPosts.length - 1
    }).then((Be) => [A, ...Be]) : Promise.resolve([A]));
    !t() || W !== L || (a.loadedPosts = Ve, await Ln(y, () => dn(y, W), () => a.loadedPosts.length > 0) && (f || N(), await de(y, Ve, W)));
  }
  function ke(f, y) {
    return !!f && (!y || f.requestedAt > y.savedAt);
  }
  async function Le(f, y) {
    et();
    const A = e(), U = a.loadedPosts, W = Y(U[0]), ie = Y(U[U.length - 1]);
    if (!A || !t() || U.length === 0)
      return;
    const pe = ++L, Ve = await wn(A), [Be, Ze] = await Promise.all([
      W ? lt.getNewerVisibleChunk({ pubkeyHex: A, visibleUntil: Ve, cursor: W, limit: 1 }) : Promise.resolve([]),
      ie ? lt.getOlderVisibleChunk({ pubkeyHex: A, visibleUntil: Ve, cursor: ie, limit: 1 }) : Promise.resolve([])
    ]);
    if (!(!t() || pe !== L)) {
      if (ke(y, f)) {
        s(), await we();
        return;
      }
      a.hasNewerLocal = Be.length > 0, a.hasOlderLocal = Ze.length > 0, await Ln(A, () => dn(A, pe), () => a.loadedPosts.length > 0) && (N(), await de(A, a.loadedPosts, pe), dn(A, pe) && eo(A, a.loadedPosts));
    }
  }
  function st() {
    const f = i();
    return !f || f.mode !== "normal" || f.pubkeyHex !== e() ? null : f;
  }
  function gt(f) {
    return r(ae) || a.loadedPosts.length === 0 || !f ? !1 : a.loadedPosts.some((y) => y.eventId === f.anchor.eventId);
  }
  async function Tt(f) {
    et();
    const y = e();
    if (!y || !t())
      return !1;
    const A = ++L, U = await wn(y), W = await lt.getVisibleChunkAroundEventId({
      pubkeyHex: y,
      visibleUntil: U,
      eventId: f.anchor.eventId,
      limit: We,
      keepAbove: v
    });
    return !t() || A !== L ? !1 : W.length === 0 ? (s(), await we(), !1) : (a.loadedPosts = W, !await Ln(y, () => dn(y, A), () => a.loadedPosts.length > 0) || (N(), await de(y, W, A), !dn(y, A)) ? !1 : (eo(y, W), !0));
  }
  async function Ue(f = {}) {
    const y = a.loadedPosts, A = f.metrics;
    A && (A.loadedPostsBeforeLength = y.length, A.loadedPostsAfterLength = y.length, A.olderPostsLength = 0, A.visibleOldestBefore = y.length > 0 ? y[y.length - 1]?.createdAt ?? null : null, A.visibleOldestAfter = y.length > 0 ? y[y.length - 1]?.createdAt ?? null : null, A.didTrimForOlderAppend = !1, A.didDeferOlderPosts = !1, A.maxVisiblePosts = We);
    const U = e(), W = Y(a.loadedPosts[a.loadedPosts.length - 1]);
    if (!U || !W)
      return await we(), A && (A.loadedPostsAfterLength = a.loadedPosts.length, A.olderPostsLength = a.loadedPosts.length, A.visibleOldestAfter = a.loadedPosts.length > 0 ? a.loadedPosts[a.loadedPosts.length - 1]?.createdAt ?? null : null), a.loadedPosts.length > 0;
    const ie = f.useContiguousProgress !== !1 && k !== null, pe = f.preserveContiguousProgressAfterDatabaseChange ? k : null, Ve = ++L, Be = ie ? await Po(U, Ve) : null;
    if (ie && !Be)
      return await Un(), A && (A.loadedPostsAfterLength = a.loadedPosts.length, A.visibleOldestAfter = a.loadedPosts.length > 0 ? a.loadedPosts[a.loadedPosts.length - 1]?.createdAt ?? null : null), !1;
    const Ze = Be?.visibleUntil ?? await wn(U, Ve), Re = Be ? Math.max(0, Be.totalVisibleCount - Be.reachedVisibleCount) : v;
    if (Be && Re === 0)
      return a.hasOlderLocal = !1, A && (A.loadedPostsAfterLength = a.loadedPosts.length, A.visibleOldestAfter = a.loadedPosts.length > 0 ? a.loadedPosts[a.loadedPosts.length - 1]?.createdAt ?? null : null), await de(U, a.loadedPosts, Ve, { skipOlderCheck: !0 }), !1;
    const At = Math.min(v, Re), yn = await lt.getOlderVisibleChunk({
      pubkeyHex: U,
      visibleUntil: Ze,
      cursor: W,
      limit: At
    });
    if (A && (A.olderPostsLength = yn.length), !t() || Ve !== L)
      return !1;
    const Qe = Be ? await Po(U, Ve) : null;
    if (Be && !Qe)
      return await Un(), !1;
    if (yn.length === 0)
      return Be ? await Un() : a.hasOlderLocal = !1, A && (A.loadedPostsAfterLength = a.loadedPosts.length, A.visibleOldestAfter = a.loadedPosts.length > 0 ? a.loadedPosts[a.loadedPosts.length - 1]?.createdAt ?? null : null), !1;
    const Nt = f.autoLoadViewportCommit ? f.autoLoadViewportCommit.captureAnchorEventId() : null;
    if (f.autoLoadViewportCommit && !Nt)
      return !1;
    const Dt = Te(y, yn, Nt ?? f.anchorEventId), Vr = f.reason === "normal-older-reveal" ? Wy(y, Dt.posts) : [];
    if (f.autoLoadViewportCommit && (!Nt || !Dt.posts.some((go) => go.eventId === Nt) || Vr.length === 0) || f.autoLoadViewportCommit && !f.autoLoadViewportCommit.canCommitWindowChange("older", y, Dt.posts))
      return !1;
    a.loadedPosts = Dt.posts, Vr.length > 0 && je.scheduleOlderRevealRepair(Vr), Dt.didDeferOlderPosts && (a.hasOlderLocal = !0), Dt.didTrimForOlderAppend && (a.hasNewerLocal = !0);
    const Ko = Vr.length;
    Qe ? k = {
      ...Qe,
      reachedVisibleCount: Math.min(Qe.totalVisibleCount, Qe.reachedVisibleCount + Ko),
      oldestCursor: Y(Dt.posts[Dt.posts.length - 1]) ?? Qe.oldestCursor
    } : !ie && pe && Ja(U) === pe.revision && (en(W, pe.oldestCursor) ? k = {
      ...pe,
      reachedVisibleCount: Math.min(pe.totalVisibleCount, pe.reachedVisibleCount + Ko),
      oldestCursor: Y(Dt.posts[Dt.posts.length - 1]) ?? pe.oldestCursor
    } : et());
    const Sr = ie && Qe !== null && k !== null, to = !!k && k.reachedVisibleCount >= k.totalVisibleCount;
    return Sr && k && (a.hasOlderLocal = k.totalVisibleCount > k.reachedVisibleCount), A && (A.loadedPostsAfterLength = Dt.posts.length, A.visibleOldestAfter = Dt.posts.length > 0 ? Dt.posts[Dt.posts.length - 1]?.createdAt ?? null : null, A.didTrimForOlderAppend = Dt.didTrimForOlderAppend, A.didDeferOlderPosts = Dt.didDeferOlderPosts), f.autoLoadViewportCommit?.onCommitted(), Sr ? (de(U, Dt.posts, Ve, { skipOlderCheck: !0 }).catch(() => {
    }), !0) : (await de(U, Dt.posts, Ve, {
      skipOlderCheck: ie && to
    }), !0);
  }
  async function at(f, y, A = {}) {
    et();
    const U = a.loadedPosts, W = U.length > 0 ? U[U.length - 1]?.createdAt ?? null : null;
    if (typeof W != "number")
      return !1;
    const ie = await lt.getVisibleChunkFromCreatedAt({
      pubkeyHex: f,
      visibleUntil: a.visibleUntil,
      createdAt: Math.max(0, W - 1),
      limit: v,
      query: { contiguous: !1 }
    });
    if (!t() || y !== L)
      return !1;
    if (ie.length === 0)
      return a.hasOlderLocal = !1, !1;
    const pe = Te(U, ie, A.anchorEventId);
    return a.loadedPosts = pe.posts, await de(f, pe.posts, y), pe.didDeferOlderPosts && (a.hasOlderLocal = !0), !0;
  }
  async function bt(f, y, A = {}) {
    et();
    const U = a.loadedPosts;
    if (typeof a.visibleUntil != "number")
      return !1;
    const W = Y(U[U.length - 1]);
    if (!W)
      return !1;
    const ie = await lt.getSparseChunk({
      pubkeyHex: f,
      visibleUntil: a.visibleUntil,
      cursor: W,
      direction: "older",
      limit: v
    });
    if (!t() || y !== L)
      return !1;
    if (ie.length === 0)
      return a.hasOlderLocal = !1, !1;
    const pe = Te(U, ie, A.anchorEventId);
    return a.loadedPosts = pe.posts, await de(f, pe.posts, y), pe.didDeferOlderPosts && (a.hasOlderLocal = !0), !0;
  }
  async function cn(f) {
    const y = e(), A = Y(a.loadedPosts[0]);
    if (!y || !A)
      return !1;
    const U = ++L, W = k, ie = W ? await Po(y, U) : null;
    if (W && !ie)
      return await Un(), !1;
    const pe = ie?.visibleUntil ?? await wn(y, U), Ve = await lt.getNewerVisibleChunk({
      pubkeyHex: y,
      visibleUntil: pe,
      cursor: A,
      limit: v
    });
    if (!t() || U !== L)
      return !1;
    if (Ve.length === 0)
      return a.hasNewerLocal = !1, !1;
    if (ie && !await Po(y, U))
      return await Un(), !1;
    const Be = f?.captureAnchorEventId();
    if (f && !Be)
      return !1;
    const Ze = a.loadedPosts, Re = le([...Ve, ...Ze]);
    if (f && !Re.some((yn) => yn.eventId === Be) || f && !f.canCommitWindowChange("newer", Ze, Re))
      return !1;
    a.loadedPosts = Re;
    const At = Math.max(0, Ze.length + Ve.length - Re.length);
    return ie && (k = {
      ...ie,
      reachedVisibleCount: Math.max(0, ie.reachedVisibleCount - At),
      oldestCursor: Y(Re[Re.length - 1]) ?? ie.oldestCursor
    }), f && At > 0 && (a.hasOlderLocal = !0), f?.onCommitted(), await de(y, Re, U), !(!t() || U !== L);
  }
  async function vr(f) {
    et();
    const y = e();
    if (!y)
      return !1;
    const A = ++L, U = await wn(y), W = await lt.getVisibleChunkFromCreatedAt({ pubkeyHex: y, visibleUntil: U, createdAt: f, limit: v });
    if (!t() || A !== L)
      return !1;
    if (W.length === 0)
      return N(), a.loadedPosts = [], a.hasOlderLocal = !1, a.hasNewerLocal = !1, !1;
    if (!Ji(W, f))
      return N(), a.listingMode = "contiguous", a.sparseSource = null, a.loadedPosts = W, Fn(), await de(y, W, A), !0;
    if (f <= 0)
      return N(), a.listingMode = "contiguous", a.sparseSource = null, a.loadedPosts = W, Fn(), await de(y, W, A), !0;
    const ie = await Ps.hasNearbyAnchorForPubkey({ pubkeyHex: y, targetCreatedAt: f });
    if (!t() || A !== L)
      return !1;
    if (ie) {
      const Qe = await lt.getVisibleChunkFromCreatedAt({
        pubkeyHex: y,
        visibleUntil: U,
        createdAt: f,
        limit: v,
        query: { contiguous: !1 }
      });
      if (!t() || A !== L)
        return !1;
      if (!Ji(Qe, f))
        return N(), a.listingMode = "sparse", a.sparseSource = "jump", a.loadedPosts = Qe, Fn(), await de(y, Qe, A), !0;
    }
    const pe = n();
    if (!pe)
      return N(), a.listingMode = "contiguous", a.sparseSource = null, a.loadedPosts = W, Fn(), await de(y, W, A), !0;
    Et();
    const Ve = ++He;
    a.syncStatus = "syncing";
    const Be = Math.max(0, f - lc), Ze = f, Re = Xs.fetchLatest(pe, {
      pubkeyHex: y,
      relayConfig: o(),
      reason: "repair-visible-range",
      limit: Jy,
      since: Be,
      until: Ze
    });
    Ce = Re;
    const At = await Re.promise;
    if (!dt(Ve) || Ce !== Re)
      return !1;
    if (Ce = null, !t() || At.status === "cancelled" || (At.events.length > 0 && (await lt.upsertFetchedEvents({ events: At.events, fetchedAt: At.fetchedAt }), await Ps.addForPubkey({
      pubkeyHex: y,
      centerCreatedAt: f,
      radiusSec: lc,
      fetchedAt: At.fetchedAt
    }), a.hasJumpCacheAnchors = !0), !t() || A !== L))
      return a.syncStatus = "idle", !1;
    const yn = await lt.getVisibleChunkFromCreatedAt({
      pubkeyHex: y,
      visibleUntil: U,
      createdAt: f,
      limit: v,
      query: { contiguous: !1 }
    });
    return !t() || A !== L ? (a.syncStatus = "idle", !1) : (a.syncStatus = "idle", Ji(yn, f) ? !1 : (N({ force: At.events.length > 0 }), a.listingMode = "sparse", a.sparseSource = "jump", a.loadedPosts = yn, Fn(), await de(y, yn, A), je.repairJump({
      ownerPubkeyHex: y,
      rxNostr: pe,
      visiblePosts: yn,
      isActive: () => t() && e() === y && n() === pe && A === L
    }).catch(() => {
    }), !0));
  }
  async function Rr(f) {
    et();
    const y = e();
    if (!y || !f)
      return !1;
    const A = ++L, U = await wn(y, A), W = (Be) => lt.getVisibleChunkAroundEventId({
      pubkeyHex: y,
      visibleUntil: Be,
      eventId: f,
      limit: We,
      keepAbove: v
    });
    let ie = await W(U);
    if (!t() || A !== L)
      return !1;
    const pe = ie.some((Be) => Be.eventId === f);
    let Ve = !1;
    return !pe && typeof U == "number" && (ie = await W(null), Ve = !0, !t() || A !== L) || !ie.some((Be) => Be.eventId === f) ? !1 : (N(), a.listingMode = Ve ? "sparse" : "contiguous", a.sparseSource = Ve ? "jump" : null, a.loadedPosts = ie, a.hasOlderLocal = !1, a.hasNewerLocal = !1, Fn(), de(y, ie, A).catch(() => {
    }), !0);
  }
  function xe(f, y) {
    const A = [...f], U = new Set(f.map((W) => W.eventId));
    for (const W of y)
      U.has(W.eventId) || (U.add(W.eventId), A.push(W));
    return A;
  }
  function ze(f, y, A) {
    return t() && f === _e && e() === A && y === a.searchQuery;
  }
  async function un(f, y, A) {
    const U = e();
    if (!U || !y)
      return null;
    const W = await Cs.searchLocalPosts({ pubkeyHex: U, query: y, page: f, pageSize: v });
    return ze(A, y, U) ? W : null;
  }
  async function _n(f, y) {
    const A = e();
    if (!A || !y)
      return a.searchPosts = [], a.searchTotalCount = 0, a.searchHasNext = !1, !1;
    const U = ++_e, W = Math.max(1, Math.trunc(f));
    g(ve, !0), g(Ee, "loading");
    try {
      const ie = await un(W, y, U);
      if (!ie)
        return !1;
      const pe = Rd(W, ie.total, v);
      return pe !== W ? (U === _e && ze(U, y, A) && g(Ee, "ready"), !1) : (a.searchTotalCount = ie.total, a.searchPosts = W === 1 ? ie.items : xe(a.searchPosts, ie.items), a.searchPage = pe, a.searchHasNext = ie.hasNext, g(Ee, "ready"), !(!oe && !await Ln(A, () => ze(U, y, A), () => a.searchPosts.length > 0)));
    } catch {
      return U === _e && g(Ee, "failed"), !1;
    } finally {
      U === _e && g(ve, !1);
    }
  }
  async function jt(f, y, A = ++_e) {
    const U = e();
    if (!U || !y)
      return !1;
    const W = Math.max(1, Math.trunc(f));
    g(ve, !0), g(Ee, "loading");
    try {
      const ie = await un(1, y, A);
      if (!ie)
        return !1;
      const pe = Rd(W, ie.total, v);
      let Ve = ie.items, Be = ie;
      for (let Ze = 2; Ze <= pe; Ze += 1) {
        const Re = await un(Ze, y, A);
        if (!Re)
          return !1;
        Ve = xe(Ve, Re.items), Be = Re;
      }
      return a.searchPosts = Ve, a.searchTotalCount = ie.total, a.searchPage = pe, a.searchHasNext = Be.hasNext, g(Ee, "ready"), !(!oe && !await Ln(U, () => ze(A, y, U), () => a.searchPosts.length > 0));
    } catch {
      return A === _e && g(Ee, "failed"), !1;
    } finally {
      A === _e && g(ve, !1);
    }
  }
  async function Xr() {
    et();
    const f = e(), y = n();
    if (!f || !y)
      return;
    Et();
    const A = ++He;
    a.syncStatus = "syncing";
    const U = await wn(f);
    if (!dt(A) || !t() || e() !== f)
      return;
    const W = Xs.fetchLatest(y, {
      pubkeyHex: f,
      relayConfig: o(),
      reason: "bootstrap",
      limit: Jh,
      timeoutMs: Wh
    });
    Ce = W;
    const ie = await W.promise;
    let pe = {
      insertedCount: 0,
      updatedCount: 0
    };
    if (!dt(A) || Ce !== W || (Ce = null, !t() || ie.status === "cancelled"))
      return;
    if (ie.events.length > 0) {
      pe = await lt.upsertFetchedEvents({ events: ie.events, fetchedAt: ie.fetchedAt });
      const Ze = Qy(ie.events);
      Ze.length > 0 && await d(Ze);
    }
    if (!dt(A) || !t())
      return;
    const Ve = await Mr(f, ie);
    if (!dt(A) || !t())
      return;
    const Be = Ve !== U;
    ra(ie), a.searchQuery ? await jt(a.searchPage, a.searchQuery) : a.loadedPosts.length === 0 || !a.hasNewerLocal ? await we({
      forceTotalCount: pe.insertedCount + pe.updatedCount > 0
    }) : (N({
      force: pe.insertedCount + pe.updatedCount > 0
    }), await de(f)), a.syncStatus = Ai(ie, pe.insertedCount + pe.updatedCount > 0 || Be);
  }
  async function aa() {
    const f = e(), y = n();
    if (!f || !y)
      return;
    Et();
    const A = ++He;
    a.syncStatus = "syncing", a.lastDialogOpenRefreshAt = Date.now();
    const U = await wn(f);
    if (!dt(A) || !t() || e() !== f)
      return;
    const W = Gc.runAuthored(y, {
      ownerPubkeyHex: f,
      relayConfig: o(),
      reason: "dialog-open-refresh",
      limit: Xh,
      timeoutMs: Zh,
      onSavedSelfPosts: d
    });
    Ce = W;
    const ie = await W.promise, pe = ie.fetchResult, Ve = ie.upsertSummary;
    if (!dt(A) || Ce !== W || (Ce = null, !t() || pe.status === "cancelled") || !dt(A) || !t())
      return;
    const Be = await Mr(f, pe);
    if (!dt(A) || !t())
      return;
    const Ze = py({
      insertedCount: Ve.insertedCount,
      updatedCount: Ve.updatedCount,
      previousVisibleUntil: U,
      nextVisibleUntil: Be,
      searchQuery: a.searchQuery,
      loadedPostsLength: a.loadedPosts.length,
      hasNewerLocal: a.hasNewerLocal
    });
    if (Sa(pe), a.syncStatus = Ai(pe, Ze.didMateriallyChange), In(), Ze.applyAction === "reload-search-page")
      await jt(a.searchPage, a.searchQuery);
    else if (Ze.applyAction === "load-latest-visible-posts") {
      const Re = Ze.didMateriallyChange && !Ze.didVisibleMateriallyChange;
      await we({
        forceTotalCount: Ze.didMateriallyChange,
        skipOlderAvailabilityCheck: Re,
        awaitProgress: Re
      });
    } else Ze.applyAction === "refresh-count-and-availability" && (Ze.didMateriallyChange ? await we({
      forceTotalCount: Ze.didMateriallyChange,
      skipOlderAvailabilityCheck: !Ze.didVisibleMateriallyChange,
      awaitProgress: !Ze.didVisibleMateriallyChange
    }) : (et(), N({ force: Ze.didMateriallyChange }), await de(f)));
  }
  function Na() {
    return typeof a.lastDialogOpenRefreshAt != "number" ? !0 : Date.now() - a.lastDialogOpenRefreshAt >= Gh;
  }
  function eo(f, y) {
    if (!(Se || !t() || e() !== f || !n())) {
      if (Se = !0, y.length === 0) {
        Xr();
        return;
      }
      Na() && aa();
    }
  }
  function qo() {
    return !r(ae) || !r(vt) ? !1 : (a.searchPage -= 1, !0);
  }
  function Vo() {
    return !r(ae) || !r(ot) ? !1 : (a.searchPage = 1, !0);
  }
  async function jo() {
    if (!r(ae) || !r(Ge))
      return !1;
    const f = a.searchPage + 1;
    return _n(f, a.searchQuery);
  }
  async function $a() {
    return !r(ae) || !r(ne) ? !1 : (a.searchPage = r(yt), !0);
  }
  async function _a(f) {
    if (r(ae))
      return jo();
    if (a.sparseSource === "saved") {
      const y = e();
      return y ? bt(y, ++L, {}) : !1;
    }
    if (a.sparseSource === "jump") {
      const y = e();
      return y ? at(y, ++L, {}) : !1;
    }
    return Ue({ reason: "normal-older-reveal", autoLoadViewportCommit: f });
  }
  async function Ba(f) {
    return r(ae) ? Promise.resolve(qo()) : a.sparseSource === "saved" ? ia() : cn(f);
  }
  async function wo() {
    return r(ae) ? Promise.resolve(Vo()) : (await we(), !0);
  }
  async function xo() {
    const f = e();
    if (!f)
      return !1;
    const y = await wn(f);
    if (typeof y != "number") return !1;
    const A = ++L, U = await lt.getSparseChunk({
      pubkeyHex: f,
      visibleUntil: y,
      direction: "latest",
      limit: v
    });
    return !t() || e() !== f || A !== L ? !1 : U.length === 0 ? (a.hasSavedPostsOutsideVisibleRange = !1, !1) : (a.listingMode = "sparse", a.sparseSource = "saved", a.loadedPosts = U, N(), await de(f, U, A), await q(f, y, A), !0);
  }
  async function os() {
    if (r(ae) || !r(ft))
      return !1;
    if (a.listingMode === "sparse") {
      et();
      const W = e();
      if (!W)
        return !1;
      const ie = ++L, pe = await lt.getOldestVisibleChunk({
        pubkeyHex: W,
        visibleUntil: a.visibleUntil,
        limit: v,
        query: { contiguous: !1 }
      });
      return !t() || ie !== L || pe.length === 0 ? !1 : (N(), a.loadedPosts = pe, Fn(), a.hasOlderLocal = !1, await de(W, pe, ie, { skipOlderCheck: !0 }), !0);
    }
    et();
    const f = e();
    if (!f)
      return !1;
    const y = ++L, A = await wn(f, y), U = await lt.getOldestVisibleChunk({ pubkeyHex: f, visibleUntil: A, limit: v });
    return !t() || y !== L ? !1 : U.length === 0 ? (N(), a.loadedPosts = [], a.hasOlderLocal = !1, a.hasNewerLocal = !1, !1) : (N(), a.listingMode = "contiguous", a.sparseSource = null, a.loadedPosts = U, Fn(), a.hasOlderLocal = !1, await de(f, U, y, { skipOlderCheck: !0 }), !0);
  }
  async function Ua(f = {}) {
    const y = e(), A = n();
    if (!y || !A || !r(Ye))
      return !1;
    Et();
    const U = ++He;
    a.syncStatus = "older-syncing";
    const W = Xy, ie = em, pe = Math.max(1, Math.min(v, 30));
    let Ve = null, Be = 0, Ze = 0, Re = 0, At = null, yn = null, Qe = !1, Nt = 0, Dt = null;
    for (; ; ) {
      Be += 1;
      const Vr = At ?? await co(y), Ko = typeof At == "number", Sr = await wn(y);
      if (!dt(U) || !t() || e() !== y)
        return Qe;
      const to = typeof Vr == "number" ? Ko ? Vr : typeof Sr == "number" ? Math.min(Vr, Sr) : Vr : Sr;
      if (typeof to != "number")
        return a.syncStatus = "idle", Qe;
      const go = Math.trunc(to) - 1;
      if (go < 0)
        return Fo(null, null), a.syncStatus = "idle", Qe;
      const ja = Math.min(Re, Gi.length - 1), la = Gi[ja], Tr = {
        since: (typeof yn == "number" && yn <= go ? yn : null) ?? Math.max(0, go - la),
        until: go,
        windowSeconds: la
      }, Ka = await Bo(y, Sr);
      if (!dt(U) || !t() || e() !== y)
        return Qe;
      Ve === null && (Ve = Ka);
      let h = !1, B = {
        insertedCount: 0,
        updatedCount: 0
      };
      const ge = Xs.fetchLatest(A, {
        pubkeyHex: y,
        relayConfig: o(),
        reason: "older-backfill",
        limit: Ei,
        timeoutMs: zh,
        since: Tr.since,
        until: Tr.until
      });
      Ce = ge;
      const ce = await ge.promise;
      if (!dt(U) || Ce !== ge || (Ce = null, !t() || ce.status === "cancelled") || (ce.events.length > 0 && (B = await lt.upsertFetchedEvents({ events: ce.events, fetchedAt: ce.fetchedAt }), h = B.insertedCount + B.updatedCount > 0), !dt(U) || !t()))
        return Qe;
      const it = typeof r(Ke) == "number" && (Sr === null ? a.hasJumpCacheAnchors : r(Ke) < Sr), $t = it ? Sr : await Ia(y, ce);
      if (!dt(U) || !t())
        return Qe;
      const tn = !it && typeof $t == "number" ? await Ps.reconcileWithFrontier({
        pubkeyHex: y,
        frontierVisibleUntil: $t,
        toleranceSec: Gy
      }) : null, xn = tn ? tn.nextVisibleUntil : $t;
      tn && (a.hasJumpCacheAnchors = tn.anchors.length > 0), tn && tn.nextVisibleUntil !== $t && (await Wa.save({
        pubkeyHex: y,
        kindsKey: ws,
        visibleUntil: tn.nextVisibleUntil
      }), a.visibleUntil = tn.nextVisibleUntil);
      const Xn = await Bo(y, xn);
      if (!dt(U) || !t())
        return Qe;
      let pr = !1;
      if (it || (pr = await Uo(y, xn)), await q(y, xn, null, U), !dt(U) || !t())
        return Qe;
      const Or = Xn > Ka, da = uo(ce, Ei).length > 0, Lr = mo(ce), Ya = typeof Lr == "number" && Lr > Tr.since ? Lr - Tr.since : 0, is = ce.status === "success" && da && typeof Lr == "number" && Lr > Tr.since && Ya >= Zy;
      let Yo = Tr.since > 0 ? Tr.since : null, ls = null;
      is && typeof Lr == "number" && (Yo = Lr, ls = Tr.since), j.windowSeconds = la, j.lastRange = { ...Tr, hitLimit: da }, ce.status === "success" && ce.events.length === 0 ? j.consecutiveEmptyCount += 1 : ce.events.length > 0 && (j.consecutiveEmptyCount = 0), Fo(Yo, ls), Ho(Tr, ce, Ei);
      let ds = !1;
      const jr = {
        loadedPostsBeforeLength: a.loadedPosts.length,
        loadedPostsAfterLength: a.loadedPosts.length,
        olderPostsLength: 0,
        visibleOldestBefore: a.loadedPosts.length > 0 ? a.loadedPosts[a.loadedPosts.length - 1]?.createdAt ?? null : null,
        visibleOldestAfter: a.loadedPosts.length > 0 ? a.loadedPosts[a.loadedPosts.length - 1]?.createdAt ?? null : null,
        didTrimForOlderAppend: !1,
        didDeferOlderPosts: !1,
        maxVisiblePosts: We
      };
      a.searchQuery ? await jt(a.searchPage, a.searchQuery) : (N({ force: h }), Or || h ? ds = a.sparseSource === "saved" ? await bt(y, L, { anchorEventId: f.anchorEventId }) : it ? await at(y, L, { anchorEventId: f.anchorEventId }) : await Ue({
        anchorEventId: f.anchorEventId,
        metrics: jr,
        reason: "normal-older-reveal",
        useContiguousProgress: !1,
        preserveContiguousProgressAfterDatabaseChange: pr
      }) : await de(y));
      const cs = ds || Or || h, us = Qe || cs, Qo = typeof Yo == "number" && Yo < to, ca = Xn, hs = Math.max(0, ca - (Ve ?? ca)), xi = typeof Yo == "number" ? Math.max(0, to - Yo) : Math.max(0, to), Bs = Ze + xi, ua = tm({
        status: ce.status,
        changed: cs,
        didCursorAdvanceOlder: Qo,
        hitLimit: da,
        continuedWithinWindow: is,
        attemptIndex: Be,
        maxAttempts: W,
        totalVisibleAdded: hs,
        targetVisibleAdded: pe,
        exploredSeconds: Bs,
        maxExploreSeconds: ie
      }), Qa = ua.shouldContinue, fs = Qa ? Nt + 1 : Nt;
      if (Ze = Bs, Qa) {
        a.latestOlderBackfillUiResult = {
          changed: us,
          didTrimForOlderAppend: jr.didTrimForOlderAppend,
          didDeferOlderPosts: jr.didDeferOlderPosts,
          loadedPostsBeforeLength: jr.loadedPostsBeforeLength,
          loadedPostsAfterLength: jr.loadedPostsAfterLength,
          maxVisiblePosts: jr.maxVisiblePosts,
          autoRetryCount: fs,
          autoRetryReason: ua.reason,
          attemptIndex: Be,
          maxAttempts: W,
          clickStartVisibleCount: Ve ?? ca,
          currentVisibleCount: ca,
          totalVisibleAdded: hs,
          targetVisibleAdded: pe,
          shouldContinueForSmallBatch: Qa,
          exploredSeconds: Ze,
          maxExploreSeconds: ie
        }, Nt = fs, Dt = ua.reason, Qe = us, At = Yo, yn = ls, is || (Re = Math.min(Re + 1, Gi.length - 1));
        continue;
      }
      return Dt = ua.reason, Qe = us, ua.reason, a.latestOlderBackfillUiResult = {
        changed: Qe,
        didTrimForOlderAppend: jr.didTrimForOlderAppend,
        didDeferOlderPosts: jr.didDeferOlderPosts,
        loadedPostsBeforeLength: jr.loadedPostsBeforeLength,
        loadedPostsAfterLength: jr.loadedPostsAfterLength,
        maxVisiblePosts: jr.maxVisiblePosts,
        autoRetryCount: Nt,
        autoRetryReason: Dt,
        attemptIndex: Be,
        maxAttempts: W,
        clickStartVisibleCount: Ve ?? ca,
        currentVisibleCount: ca,
        totalVisibleAdded: hs,
        targetVisibleAdded: pe,
        shouldContinueForSmallBatch: Qa,
        exploredSeconds: Ze,
        maxExploreSeconds: ie
      }, ce.status !== "success" ? (a.syncStatus = "failed", In(), Qe) : (a.syncStatus = Qe ? Ai(ce, !0) : "idle", In(), Qe);
    }
  }
  async function as() {
    et();
    const f = e(), y = n();
    if (!f || !y || !r(Ft))
      return;
    const A = bo();
    if (A.length === 0)
      return;
    gr(), a.currentViewRefetchStatus = "refetching";
    let U = null, W;
    const ie = Date.now();
    try {
      W = await wn(f), ao({
        phase: "visible-range-state",
        startedAt: ie
      });
    } catch (Re) {
      ao({
        phase: "visible-range-state",
        startedAt: ie,
        error: Re
      }), a.currentViewRefetchStatus = "idle", a.currentViewRefetchMessageKey = "postHistory.repairFetchFailed", a.currentViewRefetchMessageValues = null, Ar();
      return;
    }
    let pe;
    const Ve = Date.now();
    try {
      pe = Ty.refetchAroundCurrentView(y, {
        pubkeyHex: f,
        relayConfig: o(),
        preferredRanges: A,
        onProgress: async () => {
        }
      });
    } catch (Re) {
      ao({
        phase: "primary-fetch",
        startedAt: Ve,
        error: Re
      }), a.currentViewRefetchStatus = "idle", a.currentViewRefetchMessageKey = "postHistory.repairFetchFailed", a.currentViewRefetchMessageValues = null, Ar();
      return;
    }
    Ae = pe;
    let Be = !1, Ze = Ve;
    try {
      const Re = await pe.promise;
      if (Ae !== pe)
        return;
      if (ao({
        phase: "primary-fetch",
        startedAt: Ve,
        durationMs: Re.timing?.primaryFetchDurationMs ?? 0,
        counts: {
          processedRangeCount: Re.processedRangeCount,
          rawCount: Re.processedRanges.reduce((Nt, Dt) => Nt + (Dt.rawCount ?? 0), 0),
          uniqueCount: Re.processedRanges.reduce((Nt, Dt) => Nt + (Dt.uniqueCount ?? 0), 0),
          requestedRelayCount: Re.processedRanges.reduce((Nt, Dt) => Nt + (Dt.requestedRelayUrls?.length ?? 0), 0),
          eoseRelayCount: Re.processedRanges.reduce((Nt, Dt) => Nt + (Dt.eoseRelayUrls?.length ?? 0), 0)
        }
      }), (Re.timing?.primaryPersistAttemptCount ?? 0) > 0 && ao({
        phase: "primary-persist",
        startedAt: Ve,
        durationMs: Re.timing?.primaryPersistDurationMs ?? 0,
        counts: {
          persistedRangeCount: Re.timing?.primaryPersistAttemptCount ?? 0
        }
      }), !t() || Re.status === "cancelled") {
        Ae = null, a.currentViewRefetchStatus = "idle";
        return;
      }
      const At = Date.now();
      Ze = At;
      try {
        await $o(f, W, Re.processedRanges), ao({
          phase: "visible-range-state",
          startedAt: At,
          counts: { processedRangeCount: Re.processedRangeCount }
        });
      } catch (Nt) {
        throw U = "visible-range-state", ao({
          phase: "visible-range-state",
          startedAt: At,
          error: Nt,
          counts: { processedRangeCount: Re.processedRangeCount }
        }), Nt;
      }
      const yn = Date.now();
      Ze = yn;
      try {
        a.searchQuery ? await jt(a.searchPage, a.searchQuery) : a.loadedPosts.length === 0 || !a.hasNewerLocal ? await we({ skipTotalCountRefresh: !0 }) : await De({ skipTotalCountRefresh: !0 }), ao({
          phase: "visible-window-reload",
          startedAt: yn,
          counts: { processedRangeCount: Re.processedRangeCount }
        });
      } catch (Nt) {
        throw U = "visible-window-reload", ao({
          phase: "visible-window-reload",
          startedAt: yn,
          error: Nt,
          counts: { processedRangeCount: Re.processedRangeCount }
        }), Nt;
      }
      Be = !0;
      let Qe = null;
      if (Ae === pe && t() && e() === f && n() === y && a.loadedPosts.length > 0) {
        const Nt = Date.now();
        if (Ze = Nt, Qe = await je.repairCurrentView({
          ownerPubkeyHex: f,
          rxNostr: y,
          visiblePosts: a.loadedPosts,
          isActive: () => Ae === pe && t() && e() === f && n() === y
        }), Ae !== pe || Qe.status === "cancelled" || !t())
          return;
        ao({
          phase: "relation-repair",
          startedAt: Nt,
          durationMs: Qe.relationRepairDurationMs ?? (Qe.failurePhase === "relation-repair" ? Qe.failureDurationMs : void 0),
          errorClass: Qe.failurePhase === "relation-repair" ? Qe.failureErrorClass : void 0,
          counts: {
            savedDirectReplyCount: Qe.savedDirectReplyCount
          }
        }), (typeof Qe.badgeRefreshDurationMs == "number" || Qe.failurePhase === "badge-refresh") && ao({
          phase: "badge-refresh",
          startedAt: Nt,
          durationMs: Qe.badgeRefreshDurationMs ?? Qe.failureDurationMs,
          errorClass: Qe.failurePhase === "badge-refresh" ? Qe.failureErrorClass : void 0
        });
      }
      if (Ae !== pe || !t() || e() !== f || n() !== y)
        return;
      a.searchQuery || N({ force: !0 }), Ae = null, a.currentViewRefetchStatus = "idle", Re.addedCount > 0 ? (a.currentViewRefetchMessageKey = "postHistory.repairAdded", a.currentViewRefetchMessageValues = {
        count: Re.addedCount,
        processedRangeCount: Re.processedRangeCount,
        updatedCount: Re.updatedCount
      }) : (Qe?.savedDirectReplyCount ?? 0) > 0 ? (a.currentViewRefetchMessageKey = "postHistory.repairChildInteractionsAdded", a.currentViewRefetchMessageValues = {
        count: Qe?.savedDirectReplyCount ?? 0
      }) : Re.fetchFailed ? (a.currentViewRefetchMessageKey = "postHistory.repairFetchFailed", a.currentViewRefetchMessageValues = null) : (a.currentViewRefetchMessageKey = "postHistory.repairNoChanges", a.currentViewRefetchMessageValues = {
        processedRangeCount: Re.processedRangeCount,
        updatedCount: Re.updatedCount
      }), Ar();
    } catch (Re) {
      if (Ae !== pe)
        return;
      const At = typeof Re == "object" && Re !== null ? Re.phase : void 0, yn = typeof Re == "object" && Re !== null && typeof Re.phaseStartedAt == "number" ? Re.phaseStartedAt : Ze, Qe = typeof Re == "object" && Re !== null && typeof Re.errorClass == "string" ? Re.errorClass : void 0;
      U || ao({
        phase: U ?? (At === "primary-fetch" || At === "primary-persist" ? At : Be ? "relation-repair" : "primary-fetch"),
        startedAt: yn,
        error: Re,
        errorClass: Qe
      }), Be && !a.searchQuery && t() && e() === f && n() === y && N({ force: !0 }), Ae = null, a.currentViewRefetchStatus = "idle", a.currentViewRefetchMessageKey = Be ? "postHistory.repairNoChanges" : "postHistory.repairFetchFailed", a.currentViewRefetchMessageValues = null, Ar();
    }
  }
  async function sa() {
    const f = e();
    return f ? (Et(), Yn(), (await Promise.allSettled([
      lt.deleteLocalHistoryForPubkey(f),
      Ps.clearForPubkey(f),
      Wa.clearForPubkey(f)
    ])).some((A) => A.status === "rejected") ? (t() && e() === f && (p(), l({ known: a.totalCountKnown, status: "failed" })), gr(), a.currentViewRefetchMessageKey = "postHistory.deleteLocalHistoryFailed", a.currentViewRefetchMessageValues = null, !1) : (nc(f), om(f), Dr(), a.currentViewRefetchMessageKey = "postHistory.deleteLocalHistorySuccess", a.currentViewRefetchMessageValues = null, tc(f, {
      currentPage: 1,
      searchPage: 1,
      searchInput: "",
      searchQuery: ""
    }), Zi(f, {
      ...ci,
      totalCount: 0,
      totalCountKnown: !0,
      totalCountFailed: !1
    }), !0)) : !1;
  }
  async function ia() {
    et();
    const f = e(), y = Y(a.loadedPosts[0]);
    if (!f || !y || typeof a.visibleUntil != "number")
      return !1;
    const A = ++L, U = await lt.getSparseChunk({
      pubkeyHex: f,
      visibleUntil: a.visibleUntil,
      cursor: y,
      direction: "newer",
      limit: v
    });
    if (!t() || A !== L)
      return !1;
    if (U.length === 0)
      return a.hasNewerLocal = !1, !1;
    const W = le([...U, ...a.loadedPosts]);
    return a.loadedPosts = W, await de(f, W, A), !0;
  }
  async function qa() {
    if (et(), !!e()) {
      if (a.searchQuery) {
        await jt(a.searchPage, a.searchQuery);
        return;
      }
      if (a.sparseSource === "saved") {
        const f = e();
        if (!f) return;
        const y = await wn(f);
        N({ force: !0 }), await de(f), await q(f, y);
        return;
      }
      await we({ forceTotalCount: !0 });
    }
  }
  function Va(f, y, A) {
    const U = (W) => W.map((ie) => ie.eventId === f ? { ...ie, deletedAt: y, deletionEventId: A } : ie);
    a.loadedPosts = U(a.loadedPosts), a.searchPosts = U(a.searchPosts);
  }
  function Ro(f) {
    const y = e(), A = zr(y);
    if (!y || !A)
      return;
    const U = ++Ne;
    g(V, "loading"), f().then(() => {
      t() && e() === y && ye === A && U === Ne && g(V, "ready");
    }).catch(() => {
      t() && e() === y && ye === A && U === Ne && g(V, "failed");
    });
  }
  return Xe(() => {
    const f = zr(e());
    f !== ue && (ue = f, Zn(), g(K, null), re = f, Et(), Yn(), Ur(), sr(), gr(), Jt(), Fn(), je.resetOlderRevealRepairContext(), Se = !1, Fe = !1, ye = null, Ne += 1, g(V, "idle"));
  }), Xe(() => {
    const f = n();
    f !== X && (X = f, je.resetOlderRevealRepairContext());
  }), Xe(() => {
    ir();
  }), Xe(() => {
    io();
  }), Xe(() => {
    t() || kr();
  }), Xe(() => {
    if (t())
      return () => {
        Et();
      };
  }), Xe(() => () => {
    je.dispose();
  }), Xe(() => {
    if (!t()) {
      Jt();
      return;
    }
    return In(), () => {
      Jt();
    };
  }), Xe(() => {
    if (!t())
      return;
    const f = a.searchInput.trim();
    f !== a.searchQuery && g(Ee, "loading");
    const y = setTimeout(
      () => {
        a.searchQuery = f;
      },
      b
    );
    return () => {
      clearTimeout(y);
    };
  }), Xe(() => {
    if (!t() || r(ae))
      return;
    const f = zr(e()) ?? "";
    if (Fe && ye === f)
      return;
    if (Fe = !0, ye = f, re === f) {
      re = null, Ro(we);
      return;
    }
    const y = st(), A = Yh(e());
    if (ke(A, y)) {
      s(), Ro(we);
      return;
    }
    if (gt(y)) {
      Ro(() => Le(y, A));
      return;
    }
    if (y) {
      Ro(() => Tt(y));
      return;
    }
    Ro(we);
  }), Xe(() => {
    t() || Zn();
  }), Xe(() => {
    if (!t() || !r(z) || r(ee) !== zr(e()))
      return;
    const f = r(Je);
    if (f.length === 0 || !xd.canUsePersistentCache())
      return;
    const y = Qh(f);
    if (y.length === 0)
      return;
    const A = [...y].sort().join("\0");
    A !== I && (I = A, Promise.resolve(xd.prefetchCachedMediaDescriptors(y)).catch(() => {
    }));
  }), ts(() => {
    L += 1, _e += 1, Ne += 1, g(V, "idle"), g(ee, null), g(z, !1);
  }), Xe(() => {
    if (t()) {
      if (!a.searchQuery) {
        const f = he !== "";
        if (Zn(), _e += 1, g(ve, !1), g(Ee, "idle"), Cs.clearCache?.(), he = "", $ = !1, a.searchPage !== 1) {
          if (a.searchPage = 1, f) {
            const y = e();
            y && Ln(y, () => dn(y, L), () => a.loadedPosts.length > 0);
          }
          return;
        }
        if (a.searchPosts = [], a.searchTotalCount = 0, a.searchHasNext = !1, f) {
          const y = e();
          y && Ln(y, () => dn(y, L), () => a.loadedPosts.length > 0);
        }
        return;
      }
      if (a.searchQuery !== he) {
        Zn(), he === "" && a.searchPosts.length === 0 && (a.searchPosts = a.loadedPosts), he = a.searchQuery, a.searchPage = 1, $ = !0, _n(1, a.searchQuery);
        return;
      }
      if (he = a.searchQuery, !$) {
        $ = !0;
        const f = e(), y = a.searchQuery, A = ++_e, U = a.searchPosts.length > 0;
        f && U && Ln(f, () => ze(A, y, f), () => a.searchPosts.length > 0), jt(a.searchPage, y, A);
      }
    }
  }), {
    state: a,
    get isSearchMode() {
      return r(ae);
    },
    get posts() {
      return r(Je);
    },
    get displayTotalCount() {
      return r(pt);
    },
    get displayPage() {
      return r(ut);
    },
    get totalPages() {
      return r(yt);
    },
    get canGoPrevious() {
      return r(vt);
    },
    get canGoFirst() {
      return r(ot);
    },
    get canGoNext() {
      return r(Ge);
    },
    get canGoLast() {
      return r(ne);
    },
    get showPaging() {
      return r(It);
    },
    get canLoadOlder() {
      return r(ht);
    },
    get canLoadNewer() {
      return r(an);
    },
    get canReturnToLatest() {
      return r(sn);
    },
    get canJumpToOldest() {
      return r(ft);
    },
    get canFetchOlderFromRelays() {
      return r(Ye);
    },
    get isFetchingOlderFromRelays() {
      return r(_t);
    },
    get isFetchingFromRelays() {
      return r(pn);
    },
    get isRefetchingAroundCurrentView() {
      return r($e);
    },
    get showLocalExhaustedState() {
      return r(Pn);
    },
    get showSavedPostsBoundary() {
      return r(mt);
    },
    get isShowingSavedOlderPosts() {
      return a.listingMode === "sparse" && a.sparseSource === "saved";
    },
    get visibleNewestCreatedAt() {
      return r(ln);
    },
    get visibleOldestCreatedAt() {
      return r(Ke);
    },
    get visiblePostCount() {
      return r(Ut);
    },
    get latestOlderBackfillUiResult() {
      return a.latestOlderBackfillUiResult;
    },
    get syncStatus() {
      return a.syncStatus;
    },
    get syncStatusMessageKey() {
      return r(Ht);
    },
    get showSyncLoader() {
      return r(Rt);
    },
    get showStatusLoader() {
      return r(Xt);
    },
    get isSearchPageLoading() {
      return r(ve);
    },
    get searchResultStatus() {
      return r(Ee);
    },
    get initialLocalLoadStatus() {
      return r(V);
    },
    get canRefetchAroundCurrentView() {
      return r(Ft);
    },
    get currentViewRefetchStatusMessageKey() {
      return r(qt);
    },
    get currentViewRefetchStatusMessageValues() {
      return r(Vt);
    },
    prepareForClose: Gr,
    cancelCurrentSync: Et,
    cancelCurrentViewRefetch: Yn,
    loadOlder: _a,
    loadNewer: Ba,
    returnToLatest: wo,
    showSavedOlderPosts: xo,
    jumpToOldest: os,
    jumpToCreatedAt: vr,
    jumpToEventId: Rr,
    fetchOlderFromRelays: Ua,
    goFirstPage: Vo,
    goPreviousPage: qo,
    goToNextPage: jo,
    goToLastPage: $a,
    refetchAroundCurrentView: as,
    resetSearchState: Hn,
    refreshAfterLocalImport: qa,
    deleteLocalHistory: sa,
    patchDeletedPost: Va
  };
}
const Ds = /* @__PURE__ */ new Map();
function yd(t) {
  if (typeof t != "string")
    return null;
  const e = t.trim();
  return e.length > 0 ? e : null;
}
function ah(t) {
  return typeof t == "string" ? t.trim() : "";
}
function md(t) {
  const e = yd(t.pubkeyHex);
  if (!e)
    return null;
  const n = t.mode === "search" ? ah(t.searchQuery) : "";
  return `${e}:${t.mode}:${n}`;
}
function sm(t) {
  const e = md(t);
  if (!e)
    return null;
  const n = Ds.get(e);
  return n ? {
    ...n,
    anchor: { ...n.anchor }
  } : null;
}
function im(t) {
  const e = md(t), n = yd(t.pubkeyHex);
  !e || !n || Ds.set(e, {
    pubkeyHex: n,
    mode: t.mode,
    searchQuery: t.mode === "search" ? ah(t.searchQuery) : "",
    anchor: { ...t.anchor },
    savedAt: t.savedAt ?? Date.now()
  });
}
function cc(t) {
  const e = yd(t.pubkeyHex);
  if (e) {
    if (t.mode) {
      const n = md({
        pubkeyHex: e,
        mode: t.mode,
        searchQuery: t.searchQuery
      });
      n && Ds.delete(n);
      return;
    }
    for (const n of Ds.keys())
      n.startsWith(`${e}:`) && Ds.delete(n);
  }
}
const xs = 1, sh = 2, lm = 12;
function uc(t, e, n, o) {
  return (t === "older" ? e : n) + sh >= o;
}
function dm(t) {
  return `${t.pubkeyHex}:${t.mode}:${t.searchQuery}:${t.anchor.eventId}:${t.savedAt}`;
}
function cm({
  getShow: t,
  getPubkeyHex: e,
  getPosts: n,
  getLocale: o,
  getContainer: i,
  getIsSearchMode: s,
  getSearchQuery: d
}) {
  let c = me(null), u = me(!0), _ = me(!0), v = null, b = me(null), x = !1, w = null;
  function E() {
    return s() ? "search" : "normal";
  }
  function C() {
    return s() ? d() : "";
  }
  function m() {
    return sm({
      pubkeyHex: e(),
      mode: E(),
      searchQuery: C()
    });
  }
  function a(O) {
    return !!O && n().some((X) => X.eventId === O.anchor.eventId);
  }
  function L() {
    const O = K();
    O && im({
      pubkeyHex: e(),
      mode: E(),
      searchQuery: C(),
      anchor: O
    });
  }
  function oe() {
    cc({
      pubkeyHex: e(),
      mode: E(),
      searchQuery: C()
    }), g(b, null), w = null;
  }
  function z() {
    cc({ pubkeyHex: e() }), g(b, null), w = null;
  }
  function ee() {
    const O = i();
    O && (O.scrollTop = 0, fe(), se(), Fe());
  }
  function I() {
    const O = i();
    O && (O.scrollTop = O.scrollHeight, fe(), se(), Fe());
  }
  function fe() {
    const O = i();
    if (!O) {
      g(u, !0);
      return;
    }
    g(u, O.scrollTop <= xs);
  }
  function se() {
    const O = i();
    if (!O) {
      g(_, !0);
      return;
    }
    const X = O.scrollHeight - O.clientHeight - O.scrollTop;
    g(_, X <= sh);
  }
  function _e() {
    const O = i();
    if (!O)
      return null;
    const X = O.getBoundingClientRect(), he = X.top + lm, $ = Array.from(O.querySelectorAll("[data-post-history-event-id]"));
    let j = 0, We = $.length;
    const je = X.top + xs;
    for (; j < We; ) {
      const $e = Math.floor((j + We) / 2);
      $[$e].getBoundingClientRect().bottom > je ? We = $e : j = $e + 1;
    }
    let ae = null;
    for (let $e = j; $e < $.length; $e += 1) {
      const Je = $[$e], ut = Je.getBoundingClientRect();
      if (ut.top >= X.bottom - xs)
        break;
      const pt = Number(Je.dataset.postHistoryPostedAt);
      if (Number.isFinite(pt)) {
        if (ut.top <= he && ut.bottom > he)
          return pt;
        ae === null && (ae = pt);
      }
    }
    return ae;
  }
  function ve() {
    if (!t() || n().length === 0) {
      g(c, null);
      return;
    }
    const O = _e();
    g(
      c,
      O === null ? null : ef(O, o()),
      !0
    );
  }
  function Ee() {
    Se(), ve(), R();
  }
  function Se() {
    v !== null && (cancelAnimationFrame(v), v = null);
  }
  function Fe() {
    t() && (Se(), v = requestAnimationFrame(() => {
      v = null, ve();
    }));
  }
  function ye() {
    if (fe(), se(), r(_)) {
      Ee();
      return;
    }
    Fe();
  }
  function V() {
    Go().then(() => {
      t() && ee();
    });
  }
  function Ne() {
    Go().then(() => {
      t() && I();
    });
  }
  function ue(O) {
    Go().then(() => {
      t() && re({ eventId: O, offsetTop: 0 });
    });
  }
  function K() {
    const O = i();
    if (!O)
      return null;
    const X = O.getBoundingClientRect(), he = Array.from(O.querySelectorAll("[data-post-history-event-id]"));
    for (const $ of he) {
      const j = $.dataset.postHistoryEventId;
      if (!j)
        continue;
      const We = $.getBoundingClientRect();
      if (We.bottom > X.top + xs && We.top < X.bottom - xs)
        return { eventId: j, offsetTop: We.top - X.top };
    }
    return null;
  }
  function re(O, X = {}) {
    const he = i();
    if (!O || !t() || !he)
      return !1;
    X.flushUpdates !== !1 && R();
    const $ = Array.from(he.querySelectorAll("[data-post-history-event-id]")).find((ae) => ae.dataset.postHistoryEventId === O.eventId);
    if (!$)
      return !1;
    const j = he.getBoundingClientRect(), je = $.getBoundingClientRect().top - j.top;
    return he.scrollTop += je - O.offsetTop, Fe(), !0;
  }
  function Ce(O, X, he) {
    const $ = i();
    if (!$ || X.length === 0)
      return !1;
    const j = new Set(he.map((ot) => ot.eventId)), We = new Map(Array.from($.querySelectorAll(".post-history-item"), (ot) => [ot.dataset.postHistoryEventId, ot])), je = X.map((ot) => ({ post: ot, element: We.get(ot.eventId) ?? null }));
    if (je.some(({ element: ot }) => !ot))
      return !1;
    if (O === "older") {
      const ot = je.find(({ post: ht }) => j.has(ht.eventId));
      if (!ot?.element)
        return !1;
      if (ot.post.eventId === X[0]?.eventId)
        return !0;
      const Ge = je[0]?.element?.getBoundingClientRect(), ne = ot.element.getBoundingClientRect();
      if (!Ge || !ne)
        return !1;
      const It = ne.top - Ge.top;
      return uc("older", $.scrollTop, 0, It);
    }
    let ae = -1;
    for (let ot = 0; ot < je.length; ot += 1) {
      const Ge = je[ot];
      Ge && j.has(Ge.post.eventId) && (ae = ot);
    }
    if (ae < 0 || ae === je.length - 1)
      return ae >= 0;
    const $e = je[ae]?.element, Je = je.at(-1)?.element;
    if (!$e || !Je)
      return !1;
    const ut = $e.getBoundingClientRect(), yt = Je.getBoundingClientRect().bottom - ut.bottom, vt = $.scrollHeight - $.clientHeight - $.scrollTop;
    return uc("newer", 0, vt, yt);
  }
  function He(O, X) {
    const he = i();
    return he ? Array.from(he.querySelectorAll("[data-post-history-thread-anchor-event-id]")).find(($) => $.dataset.postHistoryThreadAnchorScopeId === O && $.dataset.postHistoryThreadAnchorEventId === X) ?? null : null;
  }
  function Ae(O, X) {
    const he = He(O, X);
    return he ? {
      scopeEventId: O,
      eventId: X,
      top: he.getBoundingClientRect().top
    } : null;
  }
  function k(O) {
    const X = i();
    if (!O || !t() || !X)
      return !1;
    R();
    const he = He(O.scopeEventId, O.eventId);
    if (!he)
      return !1;
    const $ = he.getBoundingClientRect().top - O.top;
    return Math.abs($) < 0.5 || (X.scrollTop += $, Fe(), fe(), se()), !0;
  }
  async function G(O, X, he) {
    const $ = Ae(O, X), j = he();
    await Go(), k($), await j, await Go(), k($);
  }
  return Xe(() => {
    if (!t()) {
      x = !1, g(b, null), w = null, g(c, null), Se();
      return;
    }
    x || (x = !0, g(b, m(), !0), w = null);
  }), Xe(() => {
    if (!t() || !a(r(b)))
      return;
    const O = r(b), X = dm(O);
    w !== X && Go().then(() => {
      !t() || r(b) !== O || (re(O.anchor), w = X, g(b, null));
    });
  }), Xe(() => {
    if (!t()) {
      g(c, null), Se();
      return;
    }
    return i(), n(), o(), Go().then(() => {
      t() && (ve(), fe(), se());
    }), () => {
      Se();
    };
  }), {
    get currentMonthLabel() {
      return r(c);
    },
    get isHistoryScrolledToTop() {
      return r(u);
    },
    get isHistoryScrolledToBottom() {
      return r(_);
    },
    readCurrentSessionScrollState: m,
    saveCurrentSessionScrollAnchor: L,
    clearCurrentSessionScrollAnchor: oe,
    clearAllSessionScrollAnchorsForCurrentPubkey: z,
    handleHistoryScroll: ye,
    resetHistoryScrollSoon: V,
    resetHistoryScrollToBottomSoon: Ne,
    scrollHistoryEventToTopSoon: ue,
    captureHistoryScrollAnchor: K,
    canCommitAutoLoadWindowChange: Ce,
    restoreHistoryScrollAnchor: re,
    preserveThreadParentToggleScroll: G
  };
}
const hc = 100, um = 86400, hm = 6e3, fc = 8;
function fm(t) {
  return Number.isFinite(t) ? Math.max(1, Math.trunc(t ?? hc)) : hc;
}
function gm(t) {
  return Array.from(t.values()).map((e) => ({
    parentEventId: e.parentEventId,
    event: e.event,
    relayUrls: Array.from(e.relayUrls).sort((n, o) => n.localeCompare(o))
  })).sort((e, n) => e.event.created_at !== n.event.created_at ? e.event.created_at - n.event.created_at : e.event.id.localeCompare(n.event.id));
}
function vm(t) {
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
class pm {
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
    const o = Kc(), i = vm(n), s = new Map(i.map((oe) => [oe.eventId, oe])), d = i.map((oe) => oe.eventId), c = this.resolveRelayUrls(
      [
        ...n.relayHints ?? [],
        ...i.flatMap((oe) => oe.relayHints)
      ],
      n.relayConfig,
      n.relayLimit
    ), u = fm(n.limit), _ = Math.max(
      0,
      Math.trunc(Math.min(...i.map((oe) => oe.createdAt))) - um
    ), v = /* @__PURE__ */ new Map();
    let b = !1, x, w, E;
    const C = () => {
      w !== void 0 && (this.clearTimeoutFn(w), w = void 0), x?.unsubscribe?.(), x = void 0;
    }, m = (oe) => ({
      status: oe === "failed" && v.size > 0 ? "partial" : oe,
      events: gm(v),
      fetchedAt: this.now(),
      relayUrls: c
    }), a = (oe) => (z) => {
      b || (b = !0, C(), oe(m(z)));
    };
    return {
      promise: new Promise((oe) => {
        const z = a(oe);
        E = z;
        try {
          if (d.length === 0) {
            z("success");
            return;
          }
          x = Yc(e, o, {
            on: c.length > 0 ? { relays: c } : { defaultReadRelays: !0 }
          }).subscribe({
            next: (ee) => {
              this.handlePacket(v, s, ee);
            },
            complete: () => z("success"),
            error: (ee) => {
              this.console.error("post_history_reply_fetch_error", ee), z("failed");
            }
          }), o.emit({
            kinds: Array.from(new Set(i.map((ee) => ee.eventKind))).sort(),
            "#e": d,
            since: _,
            limit: u
          }), o.over(), w = this.setTimeoutFn(() => {
            this.console.warn("post_history_reply_fetch_timeout", d.join(",")), z("failed");
          }, n.timeoutMs ?? hm);
        } catch (ee) {
          this.console.error("post_history_reply_fetch_request_error", ee), z("failed");
        }
      }),
      cancel: () => {
        E?.("cancelled");
      }
    };
  }
  handlePacket(e, n, o) {
    const i = o.event;
    if (!i?.id || i.kind !== 1 && i.kind !== 42)
      return;
    const s = ma(i).parentId, d = s ? n.get(s) : null;
    if (!d || !ka({ child: i, parent: d }).valid)
      return;
    const c = Er.sanitizeExternalRelayUrls(
      typeof o.from == "string" ? [o.from] : [],
      { limit: 1 }
    )[0], u = e.get(i.id);
    if (!u) {
      e.set(i.id, {
        parentEventId: d.eventId,
        event: i,
        relayUrls: new Set(c ? [c] : [])
      });
      return;
    }
    if (!Pf(u.event, i)) {
      this.console.warn("post_history_reply_fetch_packet_conflict", i.id);
      return;
    }
    c && u.relayUrls.add(c);
  }
  resolveRelayUrls(e, n, o) {
    const i = Number.isFinite(o) ? Math.max(1, Math.trunc(o ?? fc)) : fc, s = Qc(e, i);
    if (s)
      return s;
    const d = n ? [
      ...Er.extractReadRelays(n),
      ...Er.extractWriteRelays(n)
    ] : [], c = Er.sanitizeExternalRelayUrls([
      ...e ?? [],
      ...d
    ], { limit: i });
    return c.length > 0 ? c : Er.sanitizeExternalRelayUrls(
      ru,
      { limit: i }
    );
  }
}
const ym = new pm(), mm = "postHistoryDirectReplyFetchMetadata:", ih = 1;
function Ws(t) {
  return mm + t;
}
function ui(t) {
  return typeof t == "number" && Number.isFinite(t);
}
function gc(t) {
  if (!t || typeof t != "object")
    return !1;
  const e = t;
  return typeof e.parentEventId == "string" && (e.completeness === "complete" || e.completeness === "partial") && ui(e.fetchedAt) && ui(e.requestStartedAt) && e.schemaVersion === ih;
}
function bm(t, e) {
  return t ? t.requestStartedAt > e.requestStartedAt ? !0 : t.requestStartedAt === e.requestStartedAt && t.completeness === "complete" && e.completeness === "partial" : !1;
}
class Cm {
  constructor(e = wl, n = Date.now) {
    this.db = e, this.now = n;
  }
  async get(e) {
    if (!e)
      return null;
    const n = await this.db.meta.get(Ws(e));
    return !n || !gc(n.value) ? null : {
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
        (i) => Ws(i)
      )
    )).flatMap((i) => !i || !gc(i.value) ? [] : [{
      ...i.value,
      updatedAt: i.updatedAt
    }]);
  }
  async save(e) {
    return !e.parentEventId || !ui(e.fetchedAt) || !ui(e.requestStartedAt) ? null : this.db.transaction("rw", this.db.meta, async () => {
      const n = await this.get(e.parentEventId);
      if (bm(n, e))
        return n;
      const o = this.now(), i = {
        parentEventId: e.parentEventId,
        completeness: e.completeness,
        fetchedAt: e.fetchedAt,
        requestStartedAt: e.requestStartedAt,
        schemaVersion: ih
      };
      return await this.db.meta.put({
        key: Ws(e.parentEventId),
        value: i,
        updatedAt: o
      }), {
        ...i,
        updatedAt: o
      };
    });
  }
  async clear(e) {
    e && await this.db.meta.delete(Ws(e));
  }
}
const Pm = new Cm(), yl = {
  totalCount: 0,
  groups: []
};
function wm(t) {
  if (!tf(t.content))
    return;
  const e = nf(t.content);
  if (e)
    return rf(t.tags ?? []).get(e)?.url;
}
function xm(t) {
  if (t.length === 0)
    return yl;
  const e = [], n = /* @__PURE__ */ new Map();
  let o = 0;
  for (const i of t) {
    if (i.kind !== 7)
      continue;
    o += 1;
    const s = wm(i), d = n.get(i.content);
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
    const c = e[d], u = c.emojiUrl ?? s;
    e[d] = {
      ...c,
      count: c.count + 1,
      ...u ? { emojiUrl: u } : {}
    };
  }
  return o === 0 ? yl : {
    totalCount: o,
    groups: e
  };
}
function Rm() {
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
function Sm(t = {}) {
  const e = t.setTimeoutFn ?? ((s, d) => setTimeout(s, d)), n = t.clearTimeoutFn ?? ((s) => clearTimeout(s)), o = /* @__PURE__ */ new Map();
  function i(s) {
    const d = o.get(s);
    d && (n(d), o.delete(s));
  }
  return {
    schedule(s, d, c = 400) {
      i(s);
      const u = e(() => {
        o.delete(s), d();
      }, c);
      o.set(s, u);
    },
    clear: i,
    clearAll() {
      o.forEach((s) => n(s)), o.clear();
    }
  };
}
function Im(t, e) {
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
function Da(t, e = {}) {
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
function vc(t, e) {
  return {
    ...t,
    loadingChildren: e.showInitialLoading,
    revalidatingChildren: !e.showInitialLoading,
    visibleChildren: e.prefetchOnly ? t.visibleChildren : t.visibleChildren || e.showInitialLoading,
    childrenError: null
  };
}
function Es(t, e = {}) {
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
function hi(t, e) {
  return {
    ...t,
    loadingChildren: !1,
    revalidatingChildren: !1,
    visibleChildren: t.visibleChildren,
    childrenError: e.nextError
  };
}
function _m(t) {
  return t.status === "deleted" ? "deleted" : t.status === "not-found" ? "not-found" : t.status === "resolved" && t.event ? "resolved" : "failed";
}
function Em(t) {
  return t.nextRecordsLength > 0 ? "resolved" : t.resultEventsLength > 0 ? "deleted" : "not-found";
}
function Am(t) {
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
        ...Da(e, {
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
        ...Da(n, {
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
function Dm(t) {
  const e = () => {
    t.updateExpansion((n) => ({
      ...Es(n, {
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
function km(t) {
  t.updateExpansion((e) => ({
    ...e,
    loadingParent: !1,
    revalidatingParent: !1,
    visibleParent: e.visibleParent,
    parentError: t.showInitialLoading ? t.errorCode : e.parentError,
    showParentLoadingIndicator: !1
  }));
}
function lh(t) {
  t.updateExpansion((e) => ({
    ...hi(e, {
      nextError: t.showInitialLoading && !t.prefetchOnly ? t.errorCode ?? "fetch_failed" : e.childrenError
    })
  }));
}
function dh(t) {
  return typeof t.lastFetchedAt != "number" ? !0 : (t.now ?? Date.now()) - t.lastFetchedAt >= t.ttlMs;
}
function Mm(t) {
  return !t.displayedCached || t.force ? !1 : !dh({
    lastFetchedAt: t.lastFetchedAt,
    ttlMs: t.ttlMs,
    now: t.now
  });
}
function Tm(t) {
  const e = Mm(t);
  return {
    skipRevalidate: e,
    shouldShowInitialLoading: !t.displayedCached,
    shouldPrefetchReplyCountsOnSkip: e && !t.prefetchOnly
  };
}
function Om(t) {
  return !t.loading && !t.revalidating ? !1 : (t.onInFlight(), t.loading && t.onLoadingInFlight?.(), !0);
}
function pc(t) {
  return t.hasVisibleData ? dh({
    lastFetchedAt: t.lastFetchedAt,
    ttlMs: t.ttlMs,
    now: t.now
  }) : !1;
}
async function yc(t) {
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
async function mc(t) {
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
async function bc(t) {
  const e = t.strategies[t.status] ?? t.fallback;
  e && await e();
}
async function Lm(t) {
  if (t.skipRevalidate)
    return;
  const e = t.runRevalidate({
    showInitialLoading: t.shouldShowInitialLoading
  });
  t.awaitWhenInitialLoading && t.shouldShowInitialLoading && await e;
}
async function Fm(t) {
  const e = Tm(t);
  return e.shouldPrefetchReplyCountsOnSkip && t.onSkipPrefetchReplyCounts?.(), await Lm({
    skipRevalidate: e.skipRevalidate,
    shouldShowInitialLoading: e.shouldShowInitialLoading,
    awaitWhenInitialLoading: t.awaitWhenInitialLoading,
    runRevalidate: t.runRevalidate
  }), e;
}
async function Cc(t) {
  if (Om({
    loading: t.loading,
    revalidating: t.revalidating,
    onInFlight: t.onInFlight,
    onLoadingInFlight: t.onLoadingInFlight
  }) || t.shouldHandleLoadedState && await t.handleLoadedState())
    return;
  t.prepareFreshLoadState();
  const e = await t.displayCachedForFreshLoad();
  await Fm({
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
function Ao(t) {
  return Er.sanitizeExternalRelayUrls(t, { limit: 8 });
}
function Pc(t) {
  return Array.from(new Set(t));
}
const Hm = 20, Nm = 12, $m = 2, wc = 4, Bm = 4, xc = 300 * 1e3;
class ch extends Error {
}
function Rc(t) {
  if (t === "failed")
    throw new Error("post_history_reply_fetch_failed");
  if (t === "cancelled")
    throw new ch();
}
function Um(t) {
  return (e) => {
    if (e instanceof ch) {
      t.updateExpansion((n) => ({
        ...hi(n, { nextError: n.childrenError })
      }));
      return;
    }
    lh({ ...t, errorCode: "fetch_failed" });
  };
}
function Sc(t) {
  return t === "partial" ? "partial" : "complete";
}
function Xi(t) {
  return t?.completeness === "complete" ? t.fetchedAt : null;
}
const Js = 300 * 1e3;
let qm = 0;
function Vm(t, e) {
  const n = new Set(t.map((o) => o.eventId));
  return (e && e.length > 0 ? Array.from(new Set(e)) : Array.from(n)).filter((o) => n.has(o));
}
function Ic(t) {
  const e = va({
    event: t.parentNode.event,
    relayHints: t.parentNode.relayUrls
  });
  return !!e && ka({
    child: Is(t.record),
    parent: e
  }).valid;
}
function _c(t) {
  if (!t.parentNode)
    return null;
  const e = va({
    event: t.parentNode.event,
    relayHints: t.parentNode.relayUrls
  });
  return e && ka({ child: t.childNode.event, parent: e }).valid ? t.parentNode : null;
}
function jm({
  getShow: t,
  getPubkeyHex: e,
  getRxNostr: n,
  getRelayConfig: o,
  postHistoryRepositoryImpl: i = lt,
  directReplyRecordsAdapterImpl: s = of,
  reactionRecordsAdapterImpl: d = af,
  childInteractionsRepositoryImpl: c = sf,
  deletionRequestsRepositoryImpl: u = Ls,
  directReplyFetchMetadataRepositoryImpl: _ = Pm,
  profileSyncCoordinator: v = void 0,
  contextFetchService: b = hd,
  replyFetchService: x = ym,
  deletionFetchService: w = Cl,
  relatedTargetResolver: E = void 0
}) {
  const C = v ?? Il({ getShow: t, getRxNostr: n }), m = !v, a = E ?? fd({
    getShow: t,
    getRxNostr: n,
    getRelayConfig: o,
    postHistoryRepositoryImpl: i,
    contextFetchService: b,
    deletionRequestsRepositoryImpl: u,
    deletionFetchService: w,
    profileSyncCoordinator: C
  }), L = !E, oe = `post-history-thread-graph-parent:${++qm}`;
  let z = me({}), ee = me({}), I = me({}), fe = me({}), se = me({}), _e = me(0);
  const ve = Sm(), Ee = /* @__PURE__ */ new Set(), Se = /* @__PURE__ */ new Set(), Fe = /* @__PURE__ */ new Set(), ye = /* @__PURE__ */ new Set();
  let V = me({}), Ne = me({}), ue = me({}), K = me({});
  const re = Rm();
  function Ce(l) {
    const p = r(Ne)[l] ?? [];
    g(K, {
      ...r(K),
      [l]: kd(p, r(ue))
    });
  }
  function He(l, p) {
    g(ue, { ...r(ue), [l]: p });
    for (const [F, N] of Object.entries(r(Ne)))
      N.some((q) => q.authorPubkey === l) && Ce(F);
  }
  function Ae(l) {
    return r(V)[l] ?? yl;
  }
  function k(l) {
    return r(K)[l] ?? _f;
  }
  function G(l, p) {
    return r(fe)[On(l, p)] ?? Vi();
  }
  function O(l, p, F) {
    const N = On(l, p);
    g(fe, {
      ...r(fe),
      [N]: F(r(fe)[N] ?? Vi())
    });
  }
  function X(l) {
    const p = ms(l), F = bs(r(z)[p.eventId], p);
    return g(z, { ...r(z), [F.eventId]: F }), F;
  }
  function he(l, p) {
    p && g(ee, { ...r(ee), [l]: p });
  }
  function $(l, p) {
    const F = r(I)[l] ?? [], N = Jd(Pc([...F, ...p]).filter((q) => q !== l && !ft(q)), r(z));
    g(I, { ...r(I), [l]: N });
  }
  function j(l) {
    const p = gl(l);
    return ms({
      event: p,
      relayUrls: Ao([
        ...l.relayHints,
        ...l.acceptedRelays,
        ...l.fetchedRelays ?? []
      ]),
      sources: ["anchor", "history-record"]
    });
  }
  function We(l) {
    const p = j(l), F = X({
      event: p.event,
      relayUrls: p.relayUrls,
      sources: p.sources
    });
    return he(F.eventId, F.parentEventId), ae(F.authorPubkey, F.relayUrls), F;
  }
  function je(l, p) {
    if (!l || !p)
      return;
    let F = !1;
    const N = { ...r(z) };
    for (const [q, Y] of Object.entries(r(z)))
      Y.authorPubkey === l && (N[q] = bs(Y, { ...Y, profile: p }), F = !0);
    F && g(z, N);
  }
  function ae(l, p = []) {
    const F = C.ensureProfile(l, p);
    je(l, F);
  }
  const $e = C.subscribe((l, p) => {
    t() && (je(l, p), He(l, p));
  });
  async function Je(l) {
    const p = Ao(l.relayUrls ?? []), F = X({ ...l, relayUrls: p });
    return ae(l.event.pubkey, p), F;
  }
  function ut(l, p, F) {
    const N = Ki.buildContext(l, p, F);
    return N ? Ki.toDescriptor(N, oe) : null;
  }
  function pt(l) {
    if (!l)
      return null;
    const p = a.getTargetSnapshot(l.eventId);
    if (p?.status !== "resolved" || !p.event)
      return l;
    const F = Ao([...l.relayUrls, ...p.relayHints]), N = p.profile ?? l.profile ?? null;
    return l.event === p.event && l.profile === N && al(l.relayUrls, F) ? l : bs(l, {
      ...l,
      event: p.event,
      relayUrls: F,
      profile: N
    });
  }
  function yt(l, p) {
    return Ki.getRelayHints(l, p);
  }
  function vt(l, p) {
    const F = ma(p.event);
    return Ao([
      ...p.relayUrls,
      ...F.relayHints,
      ...l.relayHints,
      ...l.acceptedRelays,
      ...l.fetchedRelays ?? []
    ]);
  }
  function ot(l, p) {
    return Er.sanitizeExternalRelayUrls(
      [
        ...p.flatMap((F) => {
          const N = ma(F.event);
          return [...F.relayUrls, ...N.relayHints];
        }),
        ...l.relayHints,
        ...l.acceptedRelays,
        ...l.fetchedRelays ?? []
      ],
      { limit: Bm }
    );
  }
  function Ge(l) {
    ve.clear(l);
  }
  function ne(l, p) {
    const F = On(l, p);
    ve.schedule(F, () => {
      const N = G(l, p);
      !N.loadingParent || !N.visibleParent || O(l, p, (q) => ({ ...q, showParentLoadingIndicator: !0 }));
    });
  }
  function It(l, p) {
    return (r(I)[l] ?? []).map((N) => pt(r(z)[N])).filter((N) => !!N).filter((N) => !Ke(N.authorPubkey, N.eventId)).map((N) => ({
      event: N.event,
      profile: N.profile,
      relayUrls: [...N.relayUrls],
      isOwnReply: N.authorPubkey === p
    }));
  }
  function ht(l) {
    return (r(I)[l] ?? []).filter((p) => {
      const F = r(z)[p];
      return F && !Ke(F.authorPubkey, F.eventId);
    });
  }
  function an(l, p, F) {
    return ht(l).filter((N) => !p.includes(N) && !F.has(N));
  }
  function sn(l, p, F, N = [], q = 0, Y = /* @__PURE__ */ new Set()) {
    const le = pt(r(z)[p]);
    if (!le || Ke(le.authorPubkey, le.eventId) || N.includes(p) || Y.has(p))
      return null;
    Y.add(p);
    const Te = [...N, p], de = G(l, p), we = le.parentEventId, De = we ? N.includes(we) : !1, ke = we ? _c({
      childNode: le,
      parentNode: pt(r(z)[we] ?? null)
    }) : null, Le = de.visibleParent && ke && !De && q > -20 ? sn(l, ke.eventId, F, Te, q - 1, Y) : null, st = q < Hm ? an(p, Te, Y) : [], gt = st.length, Tt = de.visibleChildren && gt > 0, Ue = Tt ? st.map((at) => sn(l, at, F, Te, q + 1, Y)).filter((at) => at !== null) : [];
    return {
      anchorEventId: l,
      node: le,
      parentTargetId: we,
      parentNodeState: Le,
      parentExpansion: de,
      parentAlreadyInPath: De,
      repliesActionState: {
        status: de.loadingChildren ? "loading" : de.childrenError ? "failed" : de.loadedChildren ? "loaded" : "unloaded",
        visible: Tt,
        replies: st,
        replyCount: gt,
        error: de.childrenError
      },
      replyNodeStates: Ue,
      isOwnReply: le.authorPubkey === F,
      depthFromAnchor: q,
      cycleDetected: !1
    };
  }
  function ln(l) {
    r(_e);
    const p = pt(r(z)[l.eventId]) ?? j(l), F = G(l.eventId, l.eventId), N = e() ?? l.pubkeyHex, q = /* @__PURE__ */ new Set([l.eventId]), Y = p.parentEventId, le = Y ? pt(r(z)[Y] ?? null) : null, Te = le && !Ke(le.authorPubkey, le.eventId) ? _c({ childNode: p, parentNode: le }) : null, de = Te && F.visibleParent ? sn(l.eventId, Te.eventId, N, [l.eventId], -1, q) : null, we = an(l.eventId, [l.eventId], q), De = new Set(we), ke = It(l.eventId, N).filter((Tt) => De.has(Tt.event.id)), Le = we.length, st = F.visibleChildren && Le > 0, gt = st ? we.map((Tt) => sn(l.eventId, Tt, N, [l.eventId], 1, q)).filter((Tt) => Tt !== null) : [];
    return {
      anchorEventId: l.eventId,
      parentTargetId: Y,
      parentNode: Te,
      parentNodeState: de,
      parentExpansion: F,
      repliesActionState: {
        status: F.loadingChildren ? "loading" : F.childrenError ? "failed" : F.loadedChildren ? "loaded" : "unloaded",
        visible: st,
        replies: ke,
        replyCount: Le,
        error: F.childrenError
      },
      reactionSummary: Ae(l.eventId),
      reactionReadModel: k(l.eventId),
      replyItems: ke,
      replyNodeStates: gt
    };
  }
  function Ke(l, p) {
    return !l || !p ? !1 : !!r(se)[l]?.[p];
  }
  function ft(l) {
    const p = r(z)[l];
    return p ? Ke(p.authorPubkey, l) : !1;
  }
  function Ye(l, p) {
    !l || !p || Ke(l, p) || g(se, {
      ...r(se),
      [l]: {
        ...r(se)[l] ?? {},
        [p]: !0
      }
    });
  }
  function _t(l, p, F = {}) {
    const N = /* @__PURE__ */ new Set();
    for (const [q, Y] of Object.entries(r(ee))) {
      if (Y !== l)
        continue;
      const le = r(z)[l];
      p && le && le.authorPubkey !== p || N.add(q);
    }
    if (N.size !== 0)
      for (const [q, Y] of Object.entries(r(fe))) {
        const le = q.indexOf(":");
        if (le < 0)
          continue;
        const Te = q.slice(0, le), de = q.slice(le + 1);
        N.has(de) && (!Y?.loadedParent && !Y?.visibleParent || O(Te, de, (we) => Da(we, {
          visibleParent: F.revealKnownParent ? !0 : we.visibleParent,
          parentDeleted: !0,
          lastFetchedParentAt: Date.now()
        })));
      }
  }
  function pn(l, p = {}) {
    for (const [F, N] of l.entries())
      for (const q of N)
        _t(q, F, p);
  }
  function Pn(l) {
    let p = r(se), F = !1;
    for (const [N, q] of l.entries()) {
      const Y = p[N] ?? {};
      let le = Y;
      for (const Te of q)
        le[Te] || (le = { ...le, [Te]: !0 }, F = !0);
      le !== Y && (p = { ...p, [N]: le });
    }
    F && (g(se, p), pn(l));
  }
  function mt(l) {
    const p = {};
    let F = !1;
    for (const [N, q] of Object.entries(r(I))) {
      const Y = q.filter((le) => le !== l);
      p[N] = Y, Y.length !== q.length && (F = !0);
    }
    if (F && g(I, p), r(ee)[l]) {
      const { [l]: N, ...q } = r(ee);
      g(ee, q);
    }
  }
  async function Ut(l, p = {}) {
    if (!l?.id || Ke(l.pubkey, l.id))
      return !0;
    if (p.checkPostHistoryRepository === !1)
      return !1;
    try {
      if (typeof (await i.getByEventId(l.id))?.deletedAt == "number")
        return Ye(l.pubkey, l.id), mt(l.id), !0;
    } catch {
    }
    return !1;
  }
  async function Ft(l) {
    Pn(l);
    for (const p of l.values())
      for (const F of p)
        mt(F), await c.deleteChildInteractionByEventId(F);
  }
  async function Ht(l) {
    const p = await u.getDeletedTargets(l.map((F) => ({ targetAuthorPubkey: F.pubkey, targetEventId: F.id })));
    await Ft(p);
  }
  async function Rt(l, p, F, N = "default") {
    if (p.length === 0)
      return;
    const q = n();
    if (!q)
      return;
    const Y = p.filter((de) => !Ke(de.pubkey, de.id));
    if (Y.length === 0)
      return;
    const le = `${l}:deletions:${N}`, Te = w.fetchDeletionRequests(q, {
      targets: Y.map((de) => ({
        event: de,
        relayUrls: r(z)[de.id]?.relayUrls ?? []
      })),
      relayHints: F,
      relayConfig: o()
    });
    re.replaceDeletionFetchTask(le, Te);
    try {
      const de = await Te.promise;
      if (!t())
        return;
      await u.upsertValidDeletionRequests({
        targetEvents: Y,
        deletionEvents: de.events,
        fetchedAt: de.fetchedAt
      });
    } catch {
      return;
    } finally {
      re.deleteDeletionFetchTask(le);
    }
    t() && await Ht(Y);
  }
  async function Xt(l) {
    await Ht(l);
    const p = [];
    for (const F of l) {
      if (await Ut(F)) {
        await c.deleteChildInteractionByEventId(F.id);
        continue;
      }
      p.push(F);
    }
    return p;
  }
  async function qt(l) {
    const p = l.map((Y) => Is(Y)), F = await Xt(p), N = new Set(F.map((Y) => Y.id)), q = [];
    for (const Y of l)
      N.has(Y.eventId) && q.push(Y);
    return q;
  }
  async function Vt(l) {
    const p = await Xt(l.map((q) => q.event)), F = new Set(p.map((q) => q.id)), N = [];
    for (const q of l)
      F.has(q.event.id) && N.push(q);
    return N;
  }
  async function Et(l) {
    return await Ht([l.event]), await Ut(l.event, { checkPostHistoryRepository: l.checkPostHistoryRepository }) ? !1 : (Rt(l.anchorEventId, [l.event], l.relayHints), !0);
  }
  function et(l, p = l) {
    Ge(On(l, p)), O(l, p, (F) => ({
      ...Da(F, {
        visibleParent: !0,
        parentDeleted: !0,
        lastFetchedParentAt: Date.now()
      })
    }));
  }
  function en(l, p) {
    Ge(On(l, p)), O(l, p, (F) => ({
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
  async function dt(l, p, F) {
    const N = F.parentEventId;
    if (!N)
      return !1;
    const q = a.getTargetSnapshot(N);
    if (q?.status === "deleted")
      return q.authorPubkey && (Ye(q.authorPubkey, N), _t(N, q.authorPubkey, { revealKnownParent: !0 })), et(l.eventId, p), !0;
    const Y = pt(r(z)[N] ?? null);
    if (Y) {
      const le = va({
        event: Y.event,
        relayHints: Y.relayUrls
      });
      if (!le || !ka({ child: F.event, parent: le }).valid)
        return en(l.eventId, p), !1;
      const Te = Ao([
        ...Y.relayUrls,
        ...yt(l, F)
      ]), de = await Et({
        anchorEventId: l.eventId,
        event: Y.event,
        relayHints: Te,
        checkPostHistoryRepository: Y.authorPubkey === e()
      });
      return t() ? de ? (O(l.eventId, p, (we) => ({
        ...Da(we, {
          parentDeleted: we.parentDeleted,
          lastFetchedParentAt: q?.updatedAt ?? we.lastFetchedParentAt
        })
      })), !0) : (et(l.eventId, p), !0) : !1;
    }
    if (!q)
      return !1;
    if (q.authorPubkey && Ke(q.authorPubkey, N))
      return et(l.eventId, p), !0;
    if (q.status === "resolved" && q.event) {
      const le = va({
        event: q.event,
        relayHints: q.relayHints
      });
      if (!le || !ka({ child: F.event, parent: le }).valid)
        return en(l.eventId, p), !1;
      const Te = X({
        event: q.event,
        relayUrls: q.relayHints,
        sources: ["fetched-parent"],
        profile: q.profile
      });
      return he(Te.eventId, Te.parentEventId), O(l.eventId, p, (de) => ({
        ...Da(de, {
          parentDeleted: !1,
          lastFetchedParentAt: q.updatedAt ?? de.lastFetchedParentAt
        })
      })), !0;
    }
    return q.status === "not-found" ? (O(l.eventId, p, (le) => ({
      ...Da(le, {
        parentMissing: !0,
        parentDeleted: !1,
        lastFetchedParentAt: q.updatedAt ?? le.lastFetchedParentAt
      })
    })), !0) : !1;
  }
  async function dn(l, p, F, N = {}) {
    const q = F.parentEventId;
    if (!q)
      return;
    const Y = re.incrementRequestId(), le = On(l.eventId, p);
    O(l.eventId, p, (Te) => ({
      ...Im(Te, { showInitialLoading: !!N.showInitialLoading })
    })), N.showInitialLoading && ne(l.eventId, p), await yc({
      isActive: () => Y === re.getRequestId() && t(),
      cleanup: () => {
        Ge(le);
      },
      onError: () => {
        km({
          updateExpansion: (Te) => O(l.eventId, p, Te),
          showInitialLoading: !!N.showInitialLoading,
          errorCode: "fetch_failed"
        });
      },
      run: async ({ ensureActive: Te }) => {
        const de = ut(l, p, F);
        if (!de)
          return;
        const we = await a.ensureTarget(de, { force: !0, background: !N.showInitialLoading });
        if (!Te() || (Ge(le), !we))
          return;
        if (we.status === "resolved" && we.event) {
          const ke = va({ event: we.event, relayHints: we.relayHints });
          if (!ke || !ka({ child: F.event, parent: ke }).valid) {
            en(l.eventId, p);
            return;
          }
        }
        const De = _m(we);
        await bc({
          status: De,
          strategies: Am({
            snapshot: we,
            parentEventId: q,
            showInitialLoading: !!N.showInitialLoading,
            updateExpansion: (ke) => {
              O(l.eventId, p, ke);
            },
            hideEvent: Ye,
            markParentDeletedForEvent: _t,
            setParentDeleted: () => {
              et(l.eventId, p);
            },
            isDeletedEvent: Ke,
            upsertNode: () => X({
              event: we.event,
              relayUrls: we.relayHints,
              sources: ["fetched-parent"],
              profile: we.profile
            }),
            upsertParentEdge: he
          })
        });
      }
    });
  }
  async function Zn(l, p, F = {}) {
    const N = p === l.eventId ? We(l) : r(z)[p];
    if (!N?.parentEventId)
      return;
    const q = G(l.eventId, p);
    await Cc({
      loading: q.loadingParent,
      revalidating: q.revalidatingParent,
      onInFlight: () => {
        O(l.eventId, p, (Y) => ({
          ...Y,
          visibleParent: !0,
          showParentLoadingIndicator: !1
        }));
      },
      onLoadingInFlight: () => {
        ne(l.eventId, p);
      },
      shouldHandleLoadedState: !F.force && q.loadedParent,
      handleLoadedState: async () => {
        if (q.parentDeleted)
          return et(l.eventId, p), !0;
        O(l.eventId, p, (le) => ({
          ...le,
          visibleParent: !0,
          showParentLoadingIndicator: !1
        }));
        const Y = await dt(l, p, N);
        return pc({
          hasVisibleData: Y,
          lastFetchedAt: q.lastFetchedParentAt,
          ttlMs: Js
        }) && dn(l, p, N), !0;
      },
      prepareFreshLoadState: () => {
        O(l.eventId, p, (Y) => ({
          ...Y,
          visibleParent: !0,
          loadingParent: !0,
          parentError: null,
          parentMissing: !1,
          parentDeleted: !1,
          showParentLoadingIndicator: !1
        })), ne(l.eventId, p);
      },
      displayCachedForFreshLoad: async () => {
        const Y = await dt(l, p, N), le = G(l.eventId, p);
        return {
          displayedCached: Y,
          lastFetchedAt: le.lastFetchedParentAt
        };
      },
      force: !!F.force,
      ttlMs: Js,
      awaitWhenInitialLoading: !0,
      runRevalidate: ({ showInitialLoading: Y }) => dn(l, p, N, { showInitialLoading: Y })
    });
  }
  async function Ln(l, p = {}) {
    await Zn(l, l.eventId, p);
  }
  function Yn(l) {
    qe(l.eventId, l.eventId);
  }
  function qe(l, p) {
    Ge(On(l, p)), O(l, p, (F) => ({
      ...F,
      visibleParent: !1,
      showParentLoadingIndicator: !1
    }));
  }
  async function Jt(l) {
    if (G(l.eventId, l.eventId).visibleParent) {
      Yn(l);
      return;
    }
    await Ln(l);
  }
  function Fn(l) {
    Ln(l, { force: !0 });
  }
  async function gr(l, p) {
    if (G(l.eventId, p).visibleParent) {
      qe(l.eventId, p);
      return;
    }
    await Zn(l, p);
  }
  function Ar(l, p) {
    Zn(l, p, { force: !0 });
  }
  function In(l) {
    const p = l.map((F) => F.fetchedAt).filter((F) => Number.isFinite(F));
    return p.length > 0 ? Math.max(...p) : null;
  }
  async function Hn(l) {
    try {
      return {
        metadata: await _.get(l),
        readFailed: !1
      };
    } catch {
      return { metadata: null, readFailed: !0 };
    }
  }
  async function sr(l, p) {
    const { metadata: F, readFailed: N } = await Hn(l);
    return N ? null : F ? F.completeness === "complete" ? F.fetchedAt : null : In(p);
  }
  async function xr(l, p, F, N = {}) {
    const q = await s.getDirectReplyRecords(p);
    Rt(l.eventId, q.map((de) => Is(de)), vt(l, F));
    const Y = await qt(q);
    if (!t() || Y.length === 0)
      return !1;
    const le = await Mr(F, Y, ["reply-db"], { resolveProfiles: !N.prefetchOnly });
    if (!t() || le.length === 0)
      return !1;
    if (!t())
      return !0;
    const Te = await sr(p, le);
    return t() && O(l.eventId, p, (de) => ({
      ...Es(de, {
        visibleChildren: N.prefetchOnly ? de.visibleChildren : !0,
        lastFetchedChildrenAt: Te
      })
    })), !0;
  }
  async function ir(l, p, F, N = {}) {
    const q = On(l.eventId, p), Y = re.getRequestId(), le = re.createChildRequestToken(q), Te = Date.now();
    O(l.eventId, p, (de) => ({
      ...vc(de, {
        showInitialLoading: !!N.showInitialLoading,
        prefetchOnly: !!N.prefetchOnly
      })
    })), await yc({
      isActive: () => Y === re.getRequestId() && re.getChildRequestToken(q) === le && t(),
      cleanup: () => {
        re.deleteChildrenFetchTask(q), re.deleteChildRequestToken(q), Jr(l.eventId, p);
      },
      onError: Um({
        updateExpansion: (de) => O(l.eventId, p, de),
        showInitialLoading: !!N.showInitialLoading,
        prefetchOnly: !!N.prefetchOnly
      }),
      run: async ({ ensureActive: de }) => {
        if (!de())
          return;
        const we = n();
        if (!we) {
          O(l.eventId, p, (at) => ({
            ...hi(at, {
              nextError: N.showInitialLoading && !N.prefetchOnly ? "nostr_not_ready" : null
            })
          }));
          return;
        }
        const De = x.fetchDirectReplies(we, {
          eventId: p,
          createdAt: F.event.created_at,
          relayHints: vt(l, F),
          parents: [
            va({
              event: F.event,
              relayHints: vt(l, F)
            })
          ].filter((at) => at !== null),
          relayConfig: o()
        });
        re.replaceChildrenFetchTask(q, De);
        const ke = await De.promise;
        if (re.deleteChildrenFetchTask(q), !de())
          return;
        Rc(ke.status), Rt(l.eventId, ke.events.map((at) => at.event), [
          ...vt(l, F),
          ...ke.relayUrls
        ]);
        const Le = await Vt(ke.events);
        ke.events.length > 0 && await c.upsertChildInteractions({
          parentEventId: p,
          events: Le,
          fetchedAt: ke.status === "partial" ? null : ke.fetchedAt
        });
        const st = await _.save({
          parentEventId: p,
          completeness: Sc(ke.status),
          fetchedAt: ke.fetchedAt,
          requestStartedAt: Te
        }), gt = Xi(st), Tt = await qt(await s.getDirectReplyRecords(p));
        if (!de())
          return;
        Tt.length > 0 && await Mr(F, Tt, ["reply-db", "fetched-child"], { resolveProfiles: !N.prefetchOnly });
        const Ue = Em({
          nextRecordsLength: Tt.length,
          resultEventsLength: ke.events.length
        });
        await bc({
          status: Ue,
          strategies: Dm({
            fetchedAt: gt,
            prefetchOnly: !!N.prefetchOnly,
            updateExpansion: (at) => {
              O(l.eventId, p, at);
            },
            prefetchChildReplyCounts: () => {
              uo(l, p);
            }
          })
        }), bo({
          anchorEventId: l.eventId,
          nodeEventId: p,
          effectiveFetchedAt: gt,
          replyCount: Tt.length
        });
      }
    });
  }
  function io(l, p) {
    Fe.add(On(l, p));
  }
  function Bn(l, p) {
    Fe.delete(On(l, p));
  }
  function Dr(l, p) {
    return Fe.has(On(l, p));
  }
  function lo(l, p) {
    ye.add(On(l, p));
  }
  function Jr(l, p) {
    ye.delete(On(l, p));
  }
  function Ur(l, p) {
    return ye.has(On(l, p));
  }
  function Gr(l) {
    for (const p of ye)
      p.endsWith(`:${l}`) && ye.delete(p);
  }
  function kr(l, p) {
    if (!Ur(l.eventId, p))
      return;
    const F = On(l.eventId, p);
    if (re.getChildRequestToken(F) !== void 0)
      return;
    const N = G(l.eventId, p);
    Jr(l.eventId, p), !(!t() || !N.visibleChildren) && co(l, p, { force: !0 });
  }
  function ra(l, p, F) {
    const N = On(l.eventId, p);
    return re.getChildRequestToken(N) === void 0 && !Dr(l.eventId, p) ? !1 : (F || (lo(l.eventId, p), O(l.eventId, p, (q) => ({ ...q, visibleChildren: !0 }))), !0);
  }
  function Sa(l, p) {
    return p === l.eventId ? We(l) : r(z)[p];
  }
  async function co(l, p, F = {}) {
    const N = Sa(l, p);
    if (!N || ra(l, p, !!F.prefetchOnly))
      return;
    const q = G(l.eventId, p);
    await Cc({
      loading: q.loadingChildren,
      revalidating: q.revalidatingChildren,
      onInFlight: F.prefetchOnly ? () => {
      } : () => {
        O(l.eventId, p, (Y) => ({ ...Y, visibleChildren: !0 }));
      },
      shouldHandleLoadedState: !F.force && q.loadedChildren,
      handleLoadedState: async () => {
        if (F.prefetchOnly)
          return !0;
        const Y = ht(p).length > 0;
        return O(l.eventId, p, (le) => ({ ...le, visibleChildren: Y })), Y && uo(l, p), pc({
          hasVisibleData: !0,
          lastFetchedAt: q.lastFetchedChildrenAt,
          ttlMs: Js
        }) && ir(l, p, N), !0;
      },
      prepareFreshLoadState: () => {
      },
      displayCachedForFreshLoad: async () => {
        const Y = await xr(l, p, N, F), le = G(l.eventId, p);
        return {
          displayedCached: Y,
          lastFetchedAt: le.lastFetchedChildrenAt
        };
      },
      force: !!F.force,
      ttlMs: Js,
      prefetchOnly: !!F.prefetchOnly,
      awaitWhenInitialLoading: !1,
      onSkipPrefetchReplyCounts: () => {
        uo(l, p);
      },
      runRevalidate: ({ showInitialLoading: Y }) => ir(l, p, N, { prefetchOnly: F.prefetchOnly, showInitialLoading: Y })
    });
  }
  async function qr(l, p = {}) {
    await co(l, l.eventId, p);
  }
  async function uo(l, p) {
    const F = On(l.eventId, p);
    if (!Se.has(F)) {
      Se.add(F);
      try {
        await mo(l, p);
      } finally {
        Se.delete(F);
      }
    }
  }
  async function mo(l, p) {
    const F = Date.now(), N = re.getRequestId(), q = ht(p).filter((De) => {
      const ke = G(l.eventId, De), Le = typeof ke.lastFetchedChildrenAt == "number" && F - ke.lastFetchedChildrenAt < xc;
      return !ke.loadedChildren && !ke.loadingChildren && !ke.revalidatingChildren && !Le;
    });
    if (q.length === 0)
      return;
    for (const De of q)
      io(l.eventId, De);
    const Y = [];
    if (await Promise.all(q.map(async (De) => {
      try {
        if (!t()) {
          Bn(l.eventId, De);
          return;
        }
        const ke = await Fo(l, De), Le = G(l.eventId, De), st = typeof Le.lastFetchedChildrenAt == "number" && Date.now() - Le.lastFetchedChildrenAt < xc, gt = !ke || Le.lastFetchedChildrenAt === null;
        gt && N === re.getRequestId() && t() && Dr(l.eventId, De) && re.getChildRequestToken(On(l.eventId, De)) === void 0 && !Le.loadingChildren && !Le.revalidatingChildren && (!Le.loadedChildren || Le.lastFetchedChildrenAt === null) && !st ? Y.push(De) : (Bn(l.eventId, De), gt ? kr(l, De) : Jr(l.eventId, De));
      } catch {
        Bn(l.eventId, De), kr(l, De);
      }
    })), Y.sort((De, ke) => Number(Ur(l.eventId, ke)) - Number(Ur(l.eventId, De))), Y.splice(Nm).forEach((De) => {
      Bn(l.eventId, De), kr(l, De);
    }), !t() || Y.length === 0) {
      Y.forEach((De) => {
        Bn(l.eventId, De), kr(l, De);
      });
      return;
    }
    const le = [];
    for (let De = 0; De < Y.length; De += wc)
      le.push(Y.slice(De, De + wc));
    let Te = 0;
    const de = Math.min($m, le.length), we = async () => {
      for (; t(); ) {
        const De = Te;
        Te += 1;
        const ke = le[De];
        if (!ke)
          return;
        await No(l, ke);
      }
    };
    try {
      await Promise.all(Array.from({ length: de }, () => we()));
    } finally {
      q.forEach((De) => Bn(l.eventId, De));
    }
  }
  async function Fo(l, p) {
    const F = await s.getDirectReplyRecords(p), { metadata: N, readFailed: q } = await Hn(p);
    if (!t())
      return !1;
    const Y = await qt(F), le = r(z)[p];
    if (!t() || !le || Y.length === 0 && !N)
      return !1;
    const Te = await Mr(le, Y, ["reply-db"], { resolveProfiles: !1 });
    if (!t() || Te.length === 0 && !N)
      return !1;
    const de = q ? null : N ? N.completeness === "complete" ? N.fetchedAt : null : In(Te);
    return t() && O(l.eventId, p, (we) => ({
      ...Es(we, { lastFetchedChildrenAt: de })
    })), !0;
  }
  function Ho(l, p) {
    const F = new Set(p), N = /* @__PURE__ */ new Map();
    for (const q of l) {
      if (!F.has(q.parentEventId))
        continue;
      const Y = N.get(q.parentEventId) ?? [];
      Y.push(q), N.set(q.parentEventId, Y);
    }
    for (const q of N.values())
      q.sort((Y, le) => Y.createdAt !== le.createdAt ? Y.createdAt - le.createdAt : Y.eventId.localeCompare(le.eventId));
    return N;
  }
  function bo(l) {
    return l.effectiveFetchedAt !== null || l.replyCount > 0 ? !1 : (O(l.anchorEventId, l.nodeEventId, (p) => ({
      ...p,
      loadedChildren: !1,
      loadingChildren: !1,
      revalidatingChildren: !1,
      childrenError: null,
      lastFetchedChildrenAt: null
    })), !0);
  }
  function Co(l) {
    const p = { ...r(z) }, F = { ...r(ee) }, N = { ...r(I) }, q = { ...r(fe) }, Y = { ...r(V) }, le = { ...r(Ne) }, Te = { ...r(ue) }, de = { ...r(K) };
    let we = !1, De = !1, ke = !1, Le = !1;
    const st = /* @__PURE__ */ new Map(), gt = (Ue) => {
      const at = bs(p[Ue.eventId], Ue);
      return p[at.eventId] = at, we = !0, at;
    }, Tt = (Ue, at) => {
      at && (F[Ue] = at, De = !0);
    };
    for (const Ue of l.targetParentIds) {
      const at = l.anchorNodesByParentId.get(Ue);
      if (!at)
        continue;
      const bt = gt(at);
      Tt(bt.eventId, bt.parentEventId);
      const cn = l.reactionRecordsByParentId.get(Ue) ?? [];
      Y[Ue] = xm(cn), le[Ue] = cn;
    }
    for (const [Ue, at] of Object.entries(l.cachedReactionProfilesByPubkey))
      Te[Ue] = at;
    for (const Ue of l.targetParentIds) {
      if (!l.anchorNodesByParentId.get(Ue))
        continue;
      const bt = [], cn = [];
      for (const _n of l.directReplyRecordsByParentId.get(Ue) ?? []) {
        const jt = Is(_n);
        if (Ke(jt.pubkey, jt.id))
          continue;
        const Xr = gt(ms({
          event: jt,
          relayUrls: Ao(_n.relayUrls),
          sources: ["reply-db", "inbound-sync"]
        }));
        Xr.eventId !== Ue && (Tt(Xr.eventId, Ue), cn.push(Xr.eventId), bt.push(_n));
      }
      st.set(Ue, cn);
      const vr = l.metadataByParentId.get(Ue) ?? null, Rr = l.metadataReadFailedParentIds.has(Ue);
      if (bt.length === 0 && !vr)
        continue;
      const xe = l.postsByParentId.get(Ue);
      if (!xe)
        continue;
      const ze = On(xe.eventId, Ue), un = q[ze] ?? Vi();
      q[ze] = vr?.completeness === "partial" && bt.length === 0 ? {
        ...un,
        loadedChildren: !1,
        loadingChildren: !1,
        revalidatingChildren: !1,
        childrenError: null,
        lastFetchedChildrenAt: null
      } : Es(un, {
        lastFetchedChildrenAt: Rr ? null : vr ? Xi(vr) : In(bt)
      }), Le = !0;
    }
    for (const [Ue, at] of st) {
      const bt = N[Ue] ?? [];
      N[Ue] = Jd(Pc([...bt, ...at]).filter((cn) => cn !== Ue && !ft(cn)), p), ke = !0;
    }
    for (const [Ue, at] of l.knownNodeProfilesByPubkey)
      if (at)
        for (const [bt, cn] of Object.entries(p))
          cn.authorPubkey === Ue && (p[bt] = bs(cn, { ...cn, profile: at }), we = !0);
    for (const Ue of l.targetParentIds)
      de[Ue] = kd(le[Ue] ?? [], Te);
    we && g(z, p), De && g(ee, F), ke && g(I, N), Le && g(fe, q), g(V, Y), g(Ne, le), g(ue, Te), g(K, de);
  }
  async function wn(l, p) {
    if (!t() || l.length === 0)
      return;
    const F = Vm(l, p);
    if (F.length === 0)
      return;
    const N = re.getRequestId(), q = !!p?.length, Y = new Map(l.map((le) => [le.eventId, le]));
    await mc({
      items: F,
      isActive: () => N === re.getRequestId() && t(),
      run: async ({ ensureActive: le }) => {
        const Te = F.flatMap((xe) => {
          const ze = Y.get(xe);
          if (!ze || !le())
            return [];
          const un = On(ze.eventId, xe), _n = G(ze.eventId, xe);
          return !q && (Ee.has(un) || _n.loadedChildren || _n.loadingChildren || _n.revalidatingChildren) ? (Ee.add(un), []) : (Ee.add(un), [{ parentEventId: xe, post: ze }]);
        });
        if (Te.length === 0 || !le())
          return;
        const de = Te.map(({ parentEventId: xe }) => xe), we = c.getChildInteractionsForParents ? await c.getChildInteractionsForParents(de) : (await Promise.all(de.map(async (xe) => {
          const [ze, un] = await Promise.all([
            Ef(xe, d),
            s.getDirectReplyRecords(xe)
          ]);
          return [...ze, ...un];
        }))).flat();
        if (!le())
          return;
        let De = [];
        const ke = /* @__PURE__ */ new Set();
        try {
          _.getForParentEventIds ? De = await _.getForParentEventIds(de) : De = (await Promise.all(de.map((ze) => Hn(ze)))).flatMap(({ metadata: ze, readFailed: un }, _n) => un ? (ke.add(de[_n]), []) : ze ? [ze] : []);
        } catch {
          for (const xe of de)
            ke.add(xe);
        }
        if (!le())
          return;
        const Le = Ho(await qt(we), de);
        if (!le())
          return;
        const st = new Map(Te.map(({ parentEventId: xe, post: ze }) => [xe, j(ze)])), gt = /* @__PURE__ */ new Map(), Tt = /* @__PURE__ */ new Map(), Ue = [], at = /* @__PURE__ */ new Set(), bt = /* @__PURE__ */ new Map(), cn = (xe, ze) => {
          bt.set(xe, Ao([...bt.get(xe) ?? [], ...ze]));
        };
        for (const xe of de) {
          const ze = st.get(xe);
          if (!ze)
            continue;
          cn(ze.authorPubkey, ze.relayUrls);
          const un = [], _n = [];
          for (const jt of Le.get(xe) ?? [])
            jt.kind === 7 ? (un.push(jt), jt.authorPubkey && (at.add(jt.authorPubkey), cn(jt.authorPubkey, ze.relayUrls))) : (jt.kind === 1 || jt.kind === 42) && (Ic({ parentNode: ze, record: jt }) ? (_n.push(jt), cn(jt.authorPubkey, jt.relayUrls)) : Ue.push(jt.eventId));
          gt.set(xe, un), Tt.set(xe, _n);
        }
        if (Ue.length > 0 && (await Promise.all(Ue.map((xe) => c.deleteChildInteractionByEventId(xe))), !le()))
          return;
        const vr = at.size > 0 ? await lf.getProfiles(Array.from(at), { allowBackgroundRefresh: !1 }) : {};
        if (!le())
          return;
        const Rr = /* @__PURE__ */ new Map();
        for (const [xe, ze] of bt)
          Rr.set(xe, C.ensureProfile(xe, ze));
        Co({
          postsByParentId: Y,
          targetParentIds: de,
          anchorNodesByParentId: st,
          reactionRecordsByParentId: gt,
          directReplyRecordsByParentId: Tt,
          metadataByParentId: new Map(De.map((xe) => [xe.parentEventId, xe])),
          metadataReadFailedParentIds: ke,
          cachedReactionProfilesByPubkey: vr,
          knownNodeProfilesByPubkey: Rr
        });
      }
    });
  }
  async function No(l, p) {
    const F = p.map((Le) => r(z)[Le]).filter((Le) => !!Le);
    if (F.length === 0)
      return;
    const N = re.getRequestId(), q = Date.now(), Y = /* @__PURE__ */ new Map(), le = /* @__PURE__ */ new Map();
    let Te = !1, de = !1;
    const we = `${l.eventId}:children-prefetch:${p.join(",")}`, De = () => Te || N !== re.getRequestId() || !t() ? !1 : p.every((Le) => Dr(l.eventId, Le) && re.getChildRequestToken(On(l.eventId, Le)) === Y.get(Le)), ke = (Le) => {
      for (const st of p)
        lh({
          updateExpansion: (gt) => O(l.eventId, st, gt),
          showInitialLoading: !1,
          prefetchOnly: !0,
          errorCode: Le
        });
    };
    await mc({
      items: p,
      isActive: De,
      prepareItem: (Le) => {
        const st = On(l.eventId, Le), gt = re.createChildRequestToken(st);
        return Y.set(Le, gt), O(l.eventId, Le, (Tt) => ({
          ...vc(Tt, { showInitialLoading: !1, prefetchOnly: !0 })
        })), gt;
      },
      completeBatch: (Le) => {
        if (Le && De())
          for (const st of p)
            O(l.eventId, st, (gt) => ({
              ...Es(gt, {
                loadedChildren: Le && ((le.get(st) ?? null) !== null || ht(st).length > 0),
                revalidatingChildren: !1,
                lastFetchedChildrenAt: le.get(st) ?? null
              })
            }));
      },
      cleanupItem: (Le, st) => {
        const gt = On(l.eventId, Le);
        re.getChildRequestToken(gt) === st && re.deleteChildRequestToken(gt), Bn(l.eventId, Le), de || Te ? Jr(l.eventId, Le) : kr(l, Le);
      },
      cleanup: () => {
        re.deleteChildrenFetchTask(we);
      },
      onError: () => {
        ke("fetch_failed");
      },
      run: async ({ ensureActive: Le }) => {
        if (!Le())
          return;
        const st = n();
        if (!st) {
          ke("nostr_not_ready");
          return;
        }
        const gt = ot(l, F), Tt = x.fetchDirectReplies(st, {
          eventId: p[0] ?? "",
          eventIds: p,
          createdAt: Math.min(...F.map((xe) => xe.event.created_at)),
          relayHints: gt,
          parents: F.map((xe) => va({
            event: xe.event,
            relayHints: [
              ...xe.relayUrls,
              ...ma(xe.event).relayHints
            ]
          })).filter((xe) => xe !== null),
          relayConfig: o()
        });
        re.replaceChildrenFetchTask(we, Tt);
        const Ue = await Tt.promise;
        if (re.deleteChildrenFetchTask(we), !Le())
          return;
        if (Ue.status === "cancelled") {
          Te = !0;
          for (const xe of p)
            O(l.eventId, xe, (ze) => ({
              ...hi(ze, { nextError: ze.childrenError })
            }));
          return;
        }
        Rc(Ue.status);
        const at = new Set(p), bt = Ue.events.filter((xe) => at.has(xe.parentEventId) && xe.event.id !== xe.parentEventId);
        bt.length > 0 && await Rt(l.eventId, bt.map((xe) => xe.event), [...gt, ...Ue.relayUrls], `children-prefetch:${p.join(",")}`);
        const cn = await Vt(bt);
        if (!Le())
          return;
        const vr = /* @__PURE__ */ new Map(), Rr = new Map(bt.map((xe) => [xe.event.id, xe.parentEventId]));
        for (const xe of cn) {
          const ze = Rr.get(xe.event.id);
          if (!ze || !at.has(ze))
            continue;
          const un = vr.get(ze) ?? [];
          un.push(xe), vr.set(ze, un);
        }
        for (const xe of p) {
          const ze = vr.get(xe) ?? [];
          if (ze.length > 0 && await c.upsertChildInteractions({
            parentEventId: xe,
            events: ze,
            fetchedAt: Ue.status === "partial" ? null : Ue.fetchedAt
          }), !Le())
            return;
          const un = await _.save({
            parentEventId: xe,
            completeness: Sc(Ue.status),
            fetchedAt: Ue.fetchedAt,
            requestStartedAt: q
          });
          le.set(xe, Xi(un));
          const _n = await qt(await s.getDirectReplyRecords(xe)), jt = r(z)[xe];
          jt && await Mr(jt, _n, ["reply-db", "fetched-child"], { resolveProfiles: !1 });
        }
        Le() && (de = !0);
      }
    });
  }
  async function Mr(l, p, F, N = {}) {
    const q = l.eventId, Y = [], le = [], Te = N.resolveProfiles !== !1;
    for (const de of p) {
      const we = Is(de);
      if (!Ic({ parentNode: l, record: de })) {
        await c.deleteChildInteractionByEventId(de.eventId);
        continue;
      }
      if (Ke(we.pubkey, we.id))
        continue;
      const De = Te ? await Je({ event: we, relayUrls: de.relayUrls, sources: F }) : X({
        event: we,
        relayUrls: Ao(de.relayUrls),
        sources: F
      });
      Te || ae(we.pubkey, Ao(de.relayUrls)), De.eventId !== q && (he(De.eventId, q), Y.push(De.eventId), le.push(de));
    }
    return $(q, Y), le;
  }
  function Ia(l) {
    $o(l.eventId, l.eventId);
  }
  function $o(l, p) {
    Jr(l, p), O(l, p, (F) => ({ ...F, visibleChildren: !1 }));
  }
  function Bo(l) {
    if (G(l.eventId, l.eventId).visibleChildren) {
      Ia(l);
      return;
    }
    qr(l);
  }
  function ho(l) {
    qr(l, { force: !0 });
  }
  function fo(l, p) {
    if (G(l.eventId, p).visibleChildren) {
      $o(l.eventId, p);
      return;
    }
    co(l, p);
  }
  function Po(l, p) {
    co(l, p, { force: !0 });
  }
  async function oa(l, p = []) {
    if (!l?.id || l.kind !== 1 && l.kind !== 42)
      return !0;
    const F = ma(l), N = F.parentId;
    if (!N)
      return !0;
    const q = p.find((ke) => ke.eventId === N) ?? null, Y = Object.keys(r(fe)).filter((ke) => ke.endsWith(`:${N}`));
    if (!q && Y.length === 0)
      return !1;
    const le = a.getTargetSnapshot(N), Te = q ? r(z)[N] ?? ms({
      event: gl(q),
      relayUrls: Ao([
        ...q.relayHints,
        ...q.acceptedRelays,
        ...q.fetchedRelays ?? []
      ]),
      sources: ["history-record"]
    }) : r(z)[N] ?? (le?.status === "resolved" && le.event ? ms({
      event: le.event,
      relayUrls: le.relayHints,
      sources: ["fetched-parent"]
    }) : null);
    if (!Te)
      return !1;
    const de = va({ event: Te.event, relayHints: Te.relayUrls });
    if (!de || !ka({ child: l, parent: de }).valid || (await Xt([l])).length === 0)
      return !1;
    await c.upsertChildInteractions({
      parentEventId: N,
      events: [{ event: l, relayUrls: F.relayHints }]
    });
    const we = await qt(await s.getDirectReplyRecords(N));
    if (!t())
      return !1;
    await Mr(Te, we, ["reply-db", "posted-reply"]);
    const De = (ke, Le) => {
      O(ke, Le, (st) => ({
        ...st,
        loadedChildren: !0,
        loadingChildren: !1,
        childrenError: null
      }));
    };
    q && De(q.eventId, q.eventId);
    for (const ke of Y) {
      const Le = ke.indexOf(":");
      Le < 0 || De(ke.slice(0, Le), ke.slice(Le + 1));
    }
    return !0;
  }
  async function Uo(l) {
    !l.eventId || !l.authorPubkey || (Gr(l.eventId), Ye(l.authorPubkey, l.eventId), mt(l.eventId), _t(l.eventId, l.authorPubkey, { revealKnownParent: !0 }), l.deletionEvent && await u.upsertValidDeletionRequests({
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
    }), await c.deleteChildInteractionByEventId(l.eventId));
  }
  Xe(() => {
    t() && g(_e, a.getScopeRevision(oe), !0);
  }), Xe(() => {
    if (t()) {
      r(_e);
      for (const l of Object.keys(r(fe))) {
        const [p, F] = l.split(":"), q = r(z)[F]?.parentEventId;
        if (!q)
          continue;
        const Y = a.getTargetSnapshot(q);
        Y?.status === "deleted" && (G(p, F).parentDeleted || (Y.authorPubkey && (Ye(Y.authorPubkey, q), _t(q, Y.authorPubkey, { revealKnownParent: !0 })), et(p, F)));
      }
    }
  });
  function Un() {
    re.cancelAndClearFetchTasks(), re.clearChildRequestTokens(), Fe.clear(), ye.clear(), m && C.reset(), ve.clearAll();
  }
  function Zr() {
    Un(), L && a.reset(), re.incrementRequestId(), g(z, {}), g(ee, {}), g(I, {}), g(fe, {}), g(se, {}), g(V, {}), g(Ne, {}), g(ue, {}), Ee.clear(), Se.clear();
  }
  return Xe(() => {
    t() || Zr();
  }), Xe(() => {
    if (t())
      return () => {
        Un();
      };
  }), ts(() => {
    a.invalidateScope(oe), Un(), $e(), L && a.reset(), m && C.dispose();
  }), {
    getAnchorState: ln,
    toggleParent: Jt,
    retryParent: Fn,
    toggleNodeParent: gr,
    retryNodeParent: Ar,
    toggleChildren: Bo,
    retryChildren: ho,
    toggleNodeChildren: fo,
    retryNodeChildren: Po,
    recordPostedReply: oa,
    recordDeletedEvent: Uo,
    loadCachedChildInteractionStateForPosts: wn,
    cancelCurrentGraphFetches: Un,
    resetState: Zr
  };
}
function Ec(t) {
  return !!t && typeof t.use == "function";
}
function Km({
  getShow: t,
  getPubkeyHex: e,
  getRxNostr: n,
  getRelayConfig: o,
  getPosts: i,
  onSavedInboundInteractions: s = () => {
  },
  reconcileDirectReplyCandidates: d
}) {
  const c = ur({
    status: "idle",
    activePubkeyHex: null,
    hasStartedInitialDialogBootstrap: !1
  });
  let u = null, _ = 0;
  function v() {
    _ += 1, u?.cancel(), u = null, c.status = "idle";
  }
  async function b(w) {
    const E = e(), C = n();
    if (!t() || !E || !Ec(C) || i().length === 0)
      return;
    if (w === "dialog-open-refresh") {
      const oe = await Sd.get(E);
      if (typeof oe?.lastDialogRefreshAt == "number" && Date.now() - oe.lastDialogRefreshAt < df)
        return;
    }
    v();
    const m = ++_;
    c.status = "syncing";
    const a = w === "dialog-open-refresh" ? Gc.runInbound(C, {
      ownerPubkeyHex: E,
      relayConfig: o(),
      reason: w,
      reconcileDirectReplyCandidates: d
    }) : {
      ...cf.syncRecent(C, {
        ownerPubkeyHex: E,
        relayConfig: o(),
        reason: w,
        reconcileDirectReplyCandidates: d
      }),
      joinedExisting: !1
    };
    u = a;
    const L = await a.promise;
    m !== _ || u !== a || !t() || e() !== E || (u = null, c.status = "idle", !(a.joinedExisting || L.status === "cancelled" || L.changedParentEventIds.length === 0) && (await s(L.changedParentEventIds), Pl({
      source: "dialog-inbound-sync",
      parentEventIds: L.changedParentEventIds,
      rxNostr: C,
      relayConfig: o(),
      isActive: () => t() && e() === E && n() === C
    }).then((oe) => {
      if (!(oe.status === "cancelled" || oe.deletedReactionEventIds.length === 0 && oe.deletedReplyEventIds.length === 0 || !t() || e() !== E || n() !== C))
        return Promise.resolve(s(L.changedParentEventIds)).catch(() => {
        });
    }).catch(() => {
    })));
  }
  async function x() {
    const w = e();
    if (!w)
      return;
    const E = await Sd.get(w);
    await b(E?.lastSyncedAt ? "dialog-open-refresh" : "initial-dialog-bootstrap");
  }
  return Xe(() => {
    const w = e() ?? null;
    w !== c.activePubkeyHex && (v(), c.activePubkeyHex = w, c.hasStartedInitialDialogBootstrap = !1);
  }), Xe(() => {
    if (!t()) {
      v(), c.hasStartedInitialDialogBootstrap = !1;
      return;
    }
    !e() || !Ec(n()) || i().length === 0 || c.hasStartedInitialDialogBootstrap || (c.hasStartedInitialDialogBootstrap = !0, x());
  }), { state: c, cancelCurrentSync: v, runSync: b };
}
const Ym = 1024 * 1024, Qm = 100, zm = {
  status: "valid",
  ruleVersion: mi
}, el = {
  status: "invalid",
  ruleVersion: mi
};
function Wm(t) {
  return t?.ruleVersion === mi && (t.status === "valid" || t.status === "invalid");
}
function uh(t) {
  return t?.status === "valid" && t.ruleVersion === mi;
}
function hh(t) {
  if (bi(t))
    try {
      return `nostr:${xl(t)}\0${t.id}\0${t.sig}`;
    } catch {
    }
  try {
    return `raw:${JSON.stringify(t)}`;
  } catch {
    return "raw:unserializable";
  }
}
function Jm(t) {
  if (!bi(t))
    return { ...el };
  try {
    const e = wf(t);
    return Rl(e) && xl(e) === e.id && xf(e) ? { ...zm } : { ...el };
  } catch {
    return { ...el };
  }
}
async function Ac(t, e) {
  for (const { id: n, fingerprint: o, verification: i } of t) {
    const s = await e.get(n);
    !s || hh(s.rawEvent) !== o || await e.update(n, {
      rawEventVerification: i
    });
  }
}
function Gm(t, e) {
  const n = (o) => ({
    get: async (i) => o.find((s) => s.id === i),
    update: async (i, s) => {
      const d = o.find((c) => c.id === i);
      d && Object.assign(d, s);
    }
  });
  return {
    post: n(t),
    deletion: n(e)
  };
}
async function Zm(t, e, n, o) {
  const i = [
    ...t.map((b) => ({ type: "post", record: b })),
    ...e.map((b) => ({ type: "deletion", record: b }))
  ].filter((b) => !Wm(b.record.rawEventVerification)), s = i.length;
  if (s === 0)
    return;
  let d = 0;
  const c = /* @__PURE__ */ new Map(), u = [], _ = [];
  async function v() {
    if (u.length > 0) {
      const b = u.splice(0), x = () => Ac(b, n.post);
      await (n.transaction?.post ?? (async (w) => w()))(x);
    }
    if (_.length > 0) {
      const b = _.splice(0), x = () => Ac(b, n.deletion);
      await (n.transaction?.deletion ?? (async (w) => w()))(x);
    }
  }
  o?.({ phase: "verifying", processed: d, total: s });
  for (const b of i) {
    const x = hh(b.record.rawEvent), w = c.get(x) ?? Jm(b.record.rawEvent);
    c.set(x, w), b.record.rawEventVerification = w;
    const E = { id: b.record.id, fingerprint: x, verification: w };
    b.type === "post" ? u.push(E) : _.push(E), d += 1, d % Qm === 0 && (await v(), o?.({ phase: "verifying", processed: d, total: s }));
  }
  await v(), o?.({ phase: "verifying", processed: s, total: s });
}
function fh(t, e) {
  if (!bi(t) || t.kind !== e)
    return !1;
  try {
    return Rl(t) && xl(t) === t.id;
  } catch {
    return !1;
  }
}
function Dc(t) {
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
function kc(t, e) {
  return t.created_at !== e.created_at ? t.created_at - e.created_at : t.id === e.id ? 0 : t.id < e.id ? -1 : 1;
}
function Xm(t) {
  return t.rawEvent !== null && t.rawEvent !== void 0;
}
function e0(t, e, n) {
  return !uh(t.rawEventVerification) || !fh(e, 5) || e.pubkey !== n || t.targetAuthorPubkey !== n || t.deletionEventPubkey !== n || e.id !== t.deletionEventId ? !1 : Zc(e).includes(t.targetEventId);
}
function t0() {
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
function n0(t, e) {
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
    o.length > 0 && o.length + s.length > Ym && (n.push(o), o = ""), o += s;
  }
  return o.length > 0 && n.push(o), {
    blob: new Blob(n, { type: "application/x-ndjson;charset=utf-8" }),
    ...e ? { jsonl: n.join("") } : {}
  };
}
async function r0(t, e, n, o = {}) {
  const i = t0(), s = [], d = [], c = /* @__PURE__ */ new Set(), u = /* @__PURE__ */ new Set(), _ = /* @__PURE__ */ new Set(), v = e.filter((m) => m.pubkeyHex === t), b = n.filter(
    (m) => m.targetAuthorPubkey === t
  );
  for (const m of v)
    if (!(m.kind !== 1 && m.kind !== 42)) {
      if (!uh(m.rawEventVerification) || !nu(m.rawEvent, m) || !fh(m.rawEvent, m.kind)) {
        i.skippedPostCount += 1;
        continue;
      }
      s.push(Dc(m.rawEvent)), c.add(m.eventId), i.exportedPostEventCount += 1;
    }
  const x = /* @__PURE__ */ new Map();
  for (const m of b) {
    const a = x.get(m.deletionEventId) ?? [];
    a.push(m), x.set(m.deletionEventId, a);
  }
  for (const m of x.values()) {
    const a = m.find((L) => e0(L, L.rawEvent, t));
    if (a) {
      const L = Dc(a.rawEvent);
      d.push(L);
      for (const oe of Zc(L))
        u.add(oe);
      i.exportedDeletionEventCount += 1;
      continue;
    }
    for (const L of m)
      _.add(L.targetEventId);
    m.every((L) => !Xm(L)) ? i.missingDeletionRawEventCount += 1 : i.invalidDeletionRawEventCount += 1;
  }
  const w = /* @__PURE__ */ new Set();
  for (const m of v)
    m.kind !== 1 && m.kind !== 42 || m.deletedAt === void 0 || !c.has(m.eventId) || u.has(m.eventId) || _.has(m.eventId) || w.add(m.eventId);
  i.missingDeletionRawEventCount += w.size, s.sort(kc), d.sort(kc);
  const E = [...s, ...d];
  i.exportedEventCount = E.length, i.isPartial = i.skippedPostCount > 0 || i.missingDeletionRawEventCount > 0 || i.invalidDeletionRawEventCount > 0, o.onProgress?.({ phase: "creating" });
  const C = n0(E, o.includeJsonl === !0);
  return { result: i, ...C };
}
async function o0(t) {
  const e = t.postRecords.filter(
    (i) => i.pubkeyHex === t.pubkeyHex
  ), n = t.deletionRecords.filter(
    (i) => i.targetAuthorPubkey === t.pubkeyHex
  ), o = t.verificationStores ?? Gm(e, n);
  return await Zm(
    e,
    n,
    o,
    t.onProgress
  ), r0(
    t.pubkeyHex,
    e,
    n,
    t
  );
}
function Mc() {
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
class a0 {
  postHistoryRepository;
  deletionRequestsRepository;
  workerFactory;
  constructor(e = {}) {
    this.postHistoryRepository = e.postHistoryRepository ?? lt, this.deletionRequestsRepository = e.deletionRequestsRepository ?? Ls, this.workerFactory = e.workerFactory ?? (() => new Worker(
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
      const { jsonl: o, ...i } = Mc();
      return Promise.resolve({
        result: i,
        blob: new Blob([], { type: "application/x-ndjson;charset=utf-8" })
      });
    }
    return new Promise((o, i) => {
      const s = this.workerFactory();
      let d = !1;
      const c = () => {
        s.onmessage = null, s.onerror = null, n.signal?.removeEventListener("abort", _), s.terminate();
      }, u = (v) => {
        d || (d = !0, c(), i(v));
      }, _ = () => u(new DOMException("Export aborted", "AbortError"));
      if (n.signal?.aborted) {
        _();
        return;
      }
      n.signal?.addEventListener("abort", _, { once: !0 }), s.onmessage = (v) => {
        const b = v.data;
        if (b.type === "progress") {
          n.onProgress?.(b.progress);
          return;
        }
        if (b.type === "error") {
          u(new Error(b.message));
          return;
        }
        if (b.type === "complete") {
          if (d) return;
          d = !0, c(), o({ result: b.result, blob: b.blob });
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
      return Mc();
    const [n, o] = await Promise.all([
      this.postHistoryRepository.getAll({ pubkeyHex: e }),
      this.deletionRequestsRepository.getAllForTargetAuthorPubkey(e)
    ]), i = await o0({
      pubkeyHex: e,
      postRecords: n,
      deletionRecords: o,
      includeJsonl: !0
    });
    return {
      ...i.result,
      jsonl: i.jsonl ?? ""
    };
  }
}
const s0 = new a0();
var i0 = Q('<div class="xmark-icon svg-icon svelte-uxr0i8"></div>'), l0 = Q('<h3 class="post-history-current-month-heading svelte-uxr0i8"><button type="button" class="post-history-current-month svelte-uxr0i8"> </button></h3>'), d0 = Q('<div class="post-history-heading-summary svelte-uxr0i8"><div class="post-history-summary-row svelte-uxr0i8"><span class="post-history-summary-line post-history-summary-count svelte-uxr0i8"> </span></div></div>'), c0 = Q('<div class="more-icon svg-icon"></div>'), u0 = Q('<div class="search-icon svg-icon svelte-uxr0i8" aria-hidden="true"></div> <span> </span>', 1), h0 = Q('<div class="repair-icon svg-icon svelte-uxr0i8" aria-hidden="true"></div> <span> </span>', 1), f0 = Q('<div class="return-to-latest-icon svg-icon" aria-hidden="true"></div> <span> </span>', 1), g0 = Q('<div class="calendar-icon svg-icon" aria-hidden="true"></div> <span> </span>', 1), v0 = Q('<div class="jump-to-oldest-icon svg-icon" aria-hidden="true"></div> <span> </span>', 1), p0 = Q('<div class="export-icon svg-icon" aria-hidden="true"></div> <span> </span>', 1), y0 = Q('<div class="import-icon svg-icon svelte-uxr0i8" aria-hidden="true"></div> <span> </span>', 1), m0 = Q('<div class="trash-icon svg-icon" aria-hidden="true"></div> <span> </span>', 1), b0 = Q('<div class="post-history-menu-body"><!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!></div>'), C0 = Q("<!> <!>", 1), P0 = Q('<div class="search-icon svg-icon svelte-uxr0i8"></div>'), w0 = Q('<div class="xmark-icon svg-icon svelte-uxr0i8" aria-hidden="true"></div>'), x0 = Q('<div class="post-history-search-row svelte-uxr0i8"><div><div class="post-history-search-leading svelte-uxr0i8" aria-hidden="true"><!></div> <input class="post-history-search-input svelte-uxr0i8" type="search"/></div> <!></div>'), R0 = Q('<div class="calendar-icon svg-icon" aria-hidden="true"></div>'), S0 = Q('<span class="post-history-date-picker-nav-icon post-history-date-picker-nav-icon-left svg-icon svelte-uxr0i8" aria-hidden="true"></span>'), I0 = Q('<span class="post-history-date-picker-nav-icon post-history-date-picker-nav-icon-right svg-icon svelte-uxr0i8" aria-hidden="true"></span>'), _0 = Q('<button type="button" class="post-history-date-picker-year-nav" aria-label="Previous year"><span class="post-history-date-picker-year-nav-icon post-history-date-picker-year-nav-icon-left svg-icon" aria-hidden="true"></span></button> <!> <!> <!> <button type="button" class="post-history-date-picker-year-nav" aria-label="Next year"><span class="post-history-date-picker-year-nav-icon post-history-date-picker-year-nav-icon-right svg-icon" aria-hidden="true"></span></button>', 1), E0 = Q("<!> <!>", 1), A0 = Q("<!> <!>", 1), D0 = Q("<!> <!> <!>", 1), k0 = Q('<div class="jump-icon svg-icon svelte-uxr0i8" aria-hidden="true"></div>'), M0 = Q('<div class="xmark-icon svg-icon svelte-uxr0i8" aria-hidden="true"></div>'), T0 = Q('<div class="post-history-utility-panel svelte-uxr0i8"><div class="post-history-utility-label svelte-uxr0i8" id="post-history-jump-date-label"> </div> <div class="post-history-utility-controls svelte-uxr0i8"><!> <!> <!></div></div>'), O0 = Q('<div class="post-history-list-loading svelte-uxr0i8" aria-hidden="true"><!></div>'), L0 = Q('<div class="empty-state svelte-uxr0i8"><div class="empty-message svelte-uxr0i8"> </div></div>'), F0 = Q('<div class="keyboard-arrow-up-icon svg-icon" aria-hidden="true"></div> ', 1), H0 = Q('<div class="post-history-nav-row post-history-nav-row-top svelte-uxr0i8"><!></div>'), N0 = Q('<div class="post-history-auto-load-sentinel post-history-auto-load-newer-sentinel svelte-uxr0i8"><!></div>'), $0 = Q('<div class="post-history-auto-load-slot post-history-auto-load-newer-slot svelte-uxr0i8" aria-hidden="true"><!></div>'), B0 = Q('<div class="post-history-channel-row svelte-uxr0i8"><span class="channel-icon svg-icon svelte-uxr0i8" aria-hidden="true"></span> <span class="channel-label svelte-uxr0i8"> </span> <span class="channel-name svelte-uxr0i8"> </span></div>'), U0 = Q('<span class="deleted-badge svelte-uxr0i8"> </span>'), q0 = Q('<span class="delete-failed svelte-uxr0i8"> </span>'), V0 = Q('<div class="post-meta-inline svelte-uxr0i8"><!> <!></div>'), j0 = Q('<div class="more-icon svg-icon"></div>'), K0 = Q('<div class="calendar-icon svg-icon" aria-hidden="true"></div> <span> </span>', 1), Y0 = Q("<!> <!>", 1), Q0 = Q('<div class="post-history-menu-body"><div class="post-history-menu-timestamp"> </div> <!> <!> <!></div>'), z0 = Q("<!> <!>", 1), W0 = Q('<span class="svelte-uxr0i8"> </span> <!>', 1), J0 = Q('<div class="post-preview-header svelte-uxr0i8"><!> <div class="post-preview-header-right svelte-uxr0i8"><!> <!></div></div>'), G0 = Q('<div class="post-preview-quotes svelte-uxr0i8"></div>'), Z0 = Q('<div class="open-in-new-icon svg-icon" aria-hidden="true"></div> <span class="svelte-uxr0i8"> </span>', 1), X0 = Q('<div aria-hidden="true"></div> <span class="svelte-uxr0i8"> </span>', 1), eb = Q('<div class="calendar-icon svg-icon" aria-hidden="true"></div> <span class="svelte-uxr0i8"> </span>', 1), tb = Q("<!> <!> <!> <!> <!>", 1), nb = Q('<li><div class="post-history-main svelte-uxr0i8"><div class="post-preview svelte-uxr0i8"><!> <!> <div class="post-history-thread-anchor-post svelte-uxr0i8"><div class="post-preview-body svelte-uxr0i8"><!> <!></div> <!> <!> <!></div></div></div></li>'), rb = Q('<div class="post-history-auto-load-sentinel svelte-uxr0i8"><!></div>'), ob = Q('<div class="post-history-auto-load-slot svelte-uxr0i8" aria-hidden="true"><!></div>'), ab = Q('<div class="post-history-sparse-state svelte-uxr0i8" role="status"><p class="svelte-uxr0i8"> </p> <p class="svelte-uxr0i8"> </p></div>'), sb = Q('<div class="cloud-download-icon svg-icon" aria-hidden="true"></div> ', 1), ib = Q('<div class="keyboard-arrow-down-icon svg-icon" aria-hidden="true"></div> ', 1), lb = Q('<div class="post-history-saved-boundary svelte-uxr0i8" role="status"><div class="post-history-saved-boundary-actions svelte-uxr0i8"><!> <!></div></div>'), db = Q('<div class="keyboard-arrow-down-icon svg-icon" aria-hidden="true"></div> ', 1), cb = Q('<div class="post-history-nav-row post-history-nav-row-bottom svelte-uxr0i8"><!></div>'), ub = Q('<div class="keyboard-arrow-down-icon svg-icon" aria-hidden="true"></div> ', 1), hb = Q('<div class="post-history-nav-row post-history-nav-row-bottom svelte-uxr0i8"><!></div>'), fb = Q('<div class="cloud-download-icon svg-icon" aria-hidden="true"></div> ', 1), gb = Q('<div class="post-history-exhausted-state svelte-uxr0i8"><!></div>'), vb = Q('<!> <!> <ul class="post-history-list svelte-uxr0i8"></ul> <!> <!> <!>', 1), pb = Q('<div class="vertical-align-top-icon svg-icon" aria-hidden="true"></div>'), yb = Q('<div class="post-history-latest-row svelte-uxr0i8"><!></div>'), mb = Q('<div class="post-history-heading svelte-uxr0i8"><div class="post-history-heading-main svelte-uxr0i8"><!></div> <div class="post-history-heading-actions svelte-uxr0i8"><!> <!> <!></div></div> <!> <!> <div><!></div> <!> <!> <!>', 1), bb = Q('<div class="delete-confirm-body svelte-uxr0i8"><p class="delete-confirm-description svelte-uxr0i8"> </p> <p class="delete-confirm-warning svelte-uxr0i8"> </p></div>'), Cb = Q('<div class="delete-confirm-body svelte-uxr0i8"><p class="delete-confirm-description svelte-uxr0i8"> </p></div>'), Pb = Q("<div> </div>"), wb = Q("<div> </div>"), xb = Q("<div> </div>"), Rb = Q("<!> <!> <!> <!> <!> <!> <!>", 1);
const Sb = {
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
    .post-history-utility-button.post-history-utility-close-button {min-width:70px;min-height:40px;}.post-history-nav-row.svelte-uxr0i8 {display:flex;justify-content:center;width:100%;padding:8px 16px;}.post-history-nav-row-top.svelte-uxr0i8 {padding-bottom:0;}.post-history-nav-row-bottom.svelte-uxr0i8 {padding-top:0;}.post-history-auto-load-sentinel.svelte-uxr0i8 {display:grid;width:100%;min-height:24px;place-items:center;}.post-history-auto-load-slot.svelte-uxr0i8 {display:grid;height:24px;min-height:24px;place-items:center;}.post-history-nav-button.primary {opacity:1;}.post-history-nav-button:not(.primary) {min-height:50px;white-space:nowrap;gap:4px;}.post-history-exhausted-state.svelte-uxr0i8 {display:flex;flex-direction:column;gap:10px;align-items:center;padding:0 16px 8px 16px;}.post-history-latest-row.svelte-uxr0i8 {position:absolute;inset:auto 16px 12px auto;display:flex;justify-content:flex-end;width:auto;margin:0;padding:0;z-index:3;.post-history-latest-button {min-width:50px;min-height:50px;background-color:color-mix(in srgb, var(--theme) 15%, transparent);backdrop-filter:blur(1px);.vertical-align-top-icon {mask-image:var(--ehagaki-icon-766572746963616c5f616c69676e5f746f705f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);width:26px;height:26px;opacity:0.6;}}}.post-history-container.svelte-uxr0i8 {flex:1 1 auto;min-height:0;width:100%;overflow-y:auto;}.post-history-container.post-history-auto-load-enabled.svelte-uxr0i8 {overflow-anchor:none;}.empty-state.svelte-uxr0i8 {display:grid;gap:8px;min-height:100px;align-content:center;}.post-history-list-loading.svelte-uxr0i8 {display:grid;min-height:100px;place-items:center;}.empty-message.svelte-uxr0i8 {display:flex;justify-content:center;align-items:center;height:100px;color:var(--text-muted);font-size:1rem;}.status-loading-placeholder {justify-content:flex-end;width:auto;max-width:min(38vw, 240px);min-width:0;overflow:hidden;flex:0 1 auto;white-space:nowrap;column-gap:0;color:var(--text-muted);font-size:0.8rem;line-height:1.3;height:auto;}.status-loading-placeholder .loader-container {.square {background:currentColor;}}.status-loading-placeholder .placeholder-text {color:inherit;font-size:inherit;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.status-error {color:var(--danger);}.status-loading-placeholder.status-error .square {background-color:var(--danger);}.post-history-list.svelte-uxr0i8 {width:100%;margin:0;padding:0;list-style:none;}.post-history-item.svelte-uxr0i8 {display:flex;align-items:center;border-bottom:1px solid var(--border-hr-light);padding:6px;}.post-history-item.svelte-uxr0i8:last-child {border-bottom:none;}.post-history-item-deleted.svelte-uxr0i8 .post-meta-inline:where(.svelte-uxr0i8) > :where(.svelte-uxr0i8):not(.deleted-badge),
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
function Ib(t, e) {
  Qt(e, !0), Lo(t, Sb);
  const n = () => Ca(vf, "$locale", i), o = () => Ca(Fa, "$_", i), [i, s] = La(), d = tu().overlayTarget, c = 200;
  let u = S(e, "show", 15, !1), _ = S(e, "onClose", 7), v = S(e, "onReplyPost", 7, void 0), b = S(e, "onQuotePost", 7, void 0), x = S(e, "pubkeyHex", 7, null), w = S(e, "rxNostr", 7, void 0), E = S(e, "relayConfig", 7, null), C = S(e, "latestPostedEvent", 7, null), m = S(e, "inboundInteractionSave", 7, null), a = S(e, "authoredSelfPostSave", 7, null), L = S(e, "reconcileInboundDirectReplyCandidates", 7, void 0), oe = S(e, "notifySavedAuthoredPosts", 7, void 0);
  const z = Il({ getShow: () => u(), getRxNostr: () => w() }), ee = fd({
    getShow: () => u(),
    getRxNostr: () => w(),
    getRelayConfig: () => E(),
    profileSyncCoordinator: z
  }), I = am({
    getShow: () => u(),
    getPubkeyHex: () => x(),
    getRxNostr: () => w(),
    getRelayConfig: () => E(),
    getSessionScrollState: () => qe.readCurrentSessionScrollState(),
    onSessionScrollStateInvalidated: () => qe.clearAllSessionScrollAnchorsForCurrentPubkey(),
    onSavedAuthoredPosts: async (h) => {
      await oe()?.(h);
    },
    onChildInteractionBadgeRefreshRequested: (h, B) => ve.loadCachedChildInteractionStateForPosts(h, B),
    onQuoteVisibleRangeRefreshRequested: (h) => se.refreshQuotePreviews(h),
    quoteVisibleRangeRepairExecutor: async (h, B) => {
      const ge = _e(B.visiblePosts);
      ge.length !== 0 && await ee.ensureTargets(ge);
    },
    pageSize: Wc
  }), fe = Gp({
    getShow: () => u(),
    getPosts: () => I.posts,
    getRxNostr: () => w(),
    getRelayConfig: () => E(),
    getIsSearchMode: () => I.isSearchMode
  }), se = gy({
    getShow: () => u(),
    getPosts: () => I.posts,
    getRxNostr: () => w(),
    getRelayConfig: () => E(),
    relatedTargetResolver: ee,
    profileSyncCoordinator: z
  });
  function _e(h) {
    const B = Aa.buildIndex(h);
    return Object.values(B.contextsByEventId).map((ge) => Aa.toDescriptor(ge, "post-history-listing-quote-visible-range-repair"));
  }
  const ve = jm({
    getShow: () => u(),
    getPubkeyHex: () => x(),
    getRxNostr: () => w(),
    getRelayConfig: () => E(),
    relatedTargetResolver: ee,
    profileSyncCoordinator: z
  });
  function Ee() {
    const h = /* @__PURE__ */ new Map(), B = (ce, it) => {
      !ce || I.posts.some(($t) => $t.eventId === ce) || h.set(ce, Array.from(/* @__PURE__ */ new Set([...h.get(ce) ?? [], ...it])));
    }, ge = (ce) => {
      ce && (B(ce.node.eventId, ce.node.relayUrls), ge(ce.parentNodeState), ce.replyNodeStates.forEach(ge));
    };
    for (const ce of I.posts) {
      const it = ve.getAnchorState(ce);
      ge(it.parentNodeState), it.replyNodeStates.forEach(ge);
      for (const $t of se.getQuotePreviews(ce))
        $t.status === "resolved" && B($t.event.id, $t.relayHints);
    }
    return Array.from(h, ([ce, it]) => ({ eventId: ce, relayHints: it }));
  }
  let Se = P(Ee);
  const Fe = Af({
    getShow: () => u(),
    getPubkeyHex: () => x(),
    getRxNostr: () => w(),
    getRelayConfig: () => E(),
    getTargets: () => r(Se),
    profileSync: z
  });
  Km({
    getShow: () => u(),
    getPubkeyHex: () => x(),
    getRxNostr: () => w(),
    getRelayConfig: () => E(),
    getPosts: () => I.posts,
    onSavedInboundInteractions: (h) => ve.loadCachedChildInteractionStateForPosts(I.posts, h),
    reconcileDirectReplyCandidates: (h) => L()?.(h) ?? Promise.resolve({
      changedParentEventIds: [],
      savedDirectReplyCount: 0,
      unresolvedParentEventIds: h.map((B) => B.classification.parentEventId).filter((B) => !!B)
    })
  });
  const ye = Df(), V = Zp();
  function Ne() {
    const h = /* @__PURE__ */ new Date(), B = `${h.getFullYear()}`, ge = `${h.getMonth() + 1}`.padStart(2, "0"), ce = `${h.getDate()}`.padStart(2, "0");
    return kl(`${B}-${ge}-${ce}`);
  }
  let ue = me(!1), K = me("none"), re = me(!1), Ce = 0, He = me(ur(Ne())), Ae = me(ur(Ne())), k = me(!1), G = null, O = me(!1), X = me(!1), he = me(!1), $ = me(ur({ phase: "loading" })), j, We, je = me(!1), ae = me("postHistory.exportComplete"), $e = me(ur({})), Je, ut = me(!1), pt = me(null), yt = me(ur({})), vt = me(ur({})), ot = me(!1), Ge = me(0), ne = me(0), It = me("postHistory.broadcastSent"), ht, an = me(void 0), sn = me(ur({})), ln = me(ur([])), Ke = me(-1), ft = me(!1), Ye = me(null), _t = me(null), pn = me(null), Pn = me(!1), mt = me(!1), Ut = me(null), Ft = me(0), Ht = !1, Rt = !1, Xt = !1, qt = !1, Vt = null, Et = null, et = 0, en = null, dt = null;
  const dn = typeof IntersectionObserver < "u";
  let Zn = me(null), Ln = me(!1);
  const Yn = kf({
    getShow: () => u(),
    getPosts: () => I.posts.map((h) => ({
      ...h,
      content: _d(h.content, h.tags)
    })),
    getContainer: () => r(Ye)
  }), qe = cm({
    getShow: () => u(),
    getPubkeyHex: () => x(),
    getPosts: () => I.posts,
    getLocale: () => n(),
    getContainer: () => r(Ye),
    getIsSearchMode: () => I.isSearchMode,
    getSearchQuery: () => I.state.searchQuery
  }), Jt = uf({
    getShow: () => u(),
    getEmojiUrls: () => r(Jr),
    onStateChanged: () => Yn.remeasure()
  });
  function Fn(h) {
    const B = _d(h.content, h.tags), ge = dy({ ...h, content: B });
    return rl({
      sourceContent: B,
      displayContent: ge,
      tags: h.tags,
      media: h.media
    });
  }
  let gr = P(() => {
    const h = {};
    for (const B of I.posts)
      h[B.eventId] = Fn(B);
    return h;
  }), Ar = P(() => I.currentViewRefetchStatusMessageKey ?? I.syncStatusMessageKey), In = P(() => I.currentViewRefetchStatusMessageKey ? I.currentViewRefetchStatusMessageValues : null), Hn = P(() => I.syncStatus === "failed" || I.currentViewRefetchStatusMessageKey === "postHistory.repairFetchFailed"), sr = P(() => I.canReturnToLatest || !qe.isHistoryScrolledToTop), xr = P(() => I.canJumpToOldest || !qe.isHistoryScrolledToBottom), ir = P(() => I.isSearchMode ? I.searchResultStatus === "loading" : I.initialLocalLoadStatus === "loading"), io = P(() => I.posts.length === 0 && (I.isSearchMode ? I.searchResultStatus === "ready" : I.initialLocalLoadStatus === "ready"));
  function Bn(h, B) {
    B[h.id] || (B[h.id] = rl({ sourceContent: h.content, tags: h.tags }));
  }
  function Dr(h, B, ge) {
    if (!(!h || ge.has(h.node.eventId))) {
      ge.add(h.node.eventId), Bn(h.node.event, B), Dr(h.parentNodeState, B, ge);
      for (const ce of h.replyNodeStates)
        Dr(ce, B, ge);
    }
  }
  let lo = P(() => {
    const h = {};
    for (const B of I.posts) {
      const ge = /* @__PURE__ */ new Set();
      for (const it of Uo(B))
        it.status === "resolved" && Bn(it.event, h);
      const ce = ve.getAnchorState(B);
      ce.parentNode && Bn(ce.parentNode.event, h), Dr(ce.parentNodeState, h, ge);
      for (const it of ce.replyNodeStates)
        Dr(it, h, ge);
    }
    return h;
  }), Jr = P(() => {
    const h = /* @__PURE__ */ new Set();
    for (const B of [
      ...Object.values(r(gr)),
      ...Object.values(r(lo))
    ])
      for (const ge of B.previewContent.emojiUrls)
        h.add(ge);
    for (const B of I.posts) {
      const ge = ve.getAnchorState(B);
      if (r(sn)[B.eventId])
        for (const ce of ge.reactionReadModel.groups)
          ce.emojiUrl && h.add(ce.emojiUrl);
    }
    for (const B of r(Se)) {
      if (!r(sn)[B.eventId]) continue;
      const ge = le(B.eventId);
      for (const ce of ge?.groups ?? [])
        ce.emojiUrl && h.add(ce.emojiUrl);
    }
    return [...h];
  });
  function Ur() {
    Ce += 1, z.reset(), V.resetState(), gt(), A(), ye.resetDeleteConfirmation(), g(X, !1), g(ut, !1), g(pt, null), g(ue, !1), g(K, "none"), g(re, !1), g(He, Ne(), !0), g(Ae, Ne(), !0), g(k, !1), g(O, !1), g(yt, {}, !0), g(vt, {}, !0), Ed(), g(sn, {}, !0), Jt.resetState(), g(ln, [], !0), g(Ke, -1), g(ft, !1);
  }
  function Gr() {
    j?.abort();
  }
  function kr() {
    Ce += 1;
    const h = I.isSearchMode;
    h && qe.clearCurrentSessionScrollAnchor(), I.resetSearchState(), I.prepareForClose() ? qe.clearAllSessionScrollAnchorsForCurrentPubkey() : h || qe.saveCurrentSessionScrollAnchor(), fe.cancelCurrentChannelResolution(), ve.cancelCurrentGraphFetches(), ye.resetDeleteConfirmation(), g(X, !1), g(ut, !1), g(pt, null), g(ue, !1), g(O, !1), V.hideCopyFloatingMessage(), gt(), A(), Gr(), g(ft, !1), g(ln, [], !0), g(Ke, -1), u(!1), _()?.();
  }
  function ra(h) {
    return h instanceof Element && h.closest(".ehagaki-pswp") !== null;
  }
  function Sa(h) {
    ra(h.target) && h.preventDefault();
  }
  function co(h) {
    r(ft) && h.preventDefault();
  }
  hf(() => u(), kr, !0), Xe(() => {
    u() || (Gr(), Ur());
  }), Xe(() => {
    r(he) && We && x() !== We && Gr();
  }), Xe(() => {
    if (!u() || !r(ir)) {
      g(Ln, !1);
      return;
    }
    g(Ln, !1);
    const h = setTimeout(
      () => {
        u() && r(ir) && g(Ln, !0);
      },
      c
    );
    return () => {
      clearTimeout(h);
    };
  }), Xe(() => {
    const h = r(Ye);
    if (!h) {
      Vt = null, Et = null, g(Ut, null);
      return;
    }
    const B = () => {
      const ce = Math.max(0, h.clientHeight);
      if (Vt !== h) {
        Vt = h, Et = ce, g(Ut, ce, !0);
        return;
      }
      Et !== ce && (Et = ce, g(Ut, ce, !0), et += 1, g(Ft, et, !0));
    };
    if (B(), typeof ResizeObserver > "u")
      return;
    const ge = new ResizeObserver(B);
    return ge.observe(h), () => {
      ge.disconnect(), Vt === h && (Vt = null, Et = null, g(Ut, null));
    };
  }), Xe(() => {
    const h = r(_t), B = r(Ye), ge = r(Ut), ce = r(Ft);
    if (!(u() && !!h && !!B && ge !== null && ge > 0 && !I.isSearchMode && I.state.listingMode === "contiguous" && I.state.hasOlderLocal && !I.isRefetchingAroundCurrentView) || !dn) {
      Ht = !1, Xt = !1, en = null;
      return;
    }
    const $t = en?.root === B && en.sentinel === h && en.resizeGeneration !== ce && B.scrollTop <= en.scrollTop;
    en = { root: B, sentinel: h, resizeGeneration: ce, scrollTop: B.scrollTop };
    let tn = !1;
    const xn = new IntersectionObserver(
      (Xn) => {
        const pr = Xn.some((vo) => vo.isIntersecting), Or = !tn;
        if (tn = !0, Xt = pr, !pr) {
          Ht && !r(Pn) && (Ht = !1);
          return;
        }
        Or && $t || No();
      },
      {
        root: B,
        rootMargin: `0px 0px ${ge * 2}px 0px`,
        threshold: 0
      }
    );
    return xn.observe(h), () => {
      xn.disconnect();
    };
  }), Xe(() => {
    const h = r(pn), B = r(Ye), ge = r(Ut), ce = r(Ft);
    if (!(u() && !!h && !!B && ge !== null && ge > 0 && !I.isSearchMode && I.state.listingMode === "contiguous" && I.state.hasNewerLocal && !r(re) && !I.isRefetchingAroundCurrentView) || !dn) {
      Rt = !1, qt = !1, dt = null;
      return;
    }
    const $t = dt?.root === B && dt.sentinel === h && dt.resizeGeneration !== ce && B.scrollTop >= dt.scrollTop;
    dt = { root: B, sentinel: h, resizeGeneration: ce, scrollTop: B.scrollTop };
    let tn = !1;
    const xn = new IntersectionObserver(
      (Xn) => {
        const pr = Xn.some((vo) => vo.isIntersecting), Or = !tn;
        if (tn = !0, qt = pr, !pr) {
          Rt && !r(mt) && (Rt = !1);
          return;
        }
        Or && $t || Ia();
      },
      {
        root: B,
        rootMargin: `${ge * 2}px 0px 0px 0px`,
        threshold: 0
      }
    );
    return xn.observe(h), () => {
      xn.disconnect();
    };
  }), ts(() => {
    Ce += 1, Gr(), Ed(), z.dispose(), A();
  }), Xe(() => {
    if (!u() || !C()?.id)
      return;
    const h = C().id;
    G !== h && (I.posts, ve.recordPostedReply(C(), I.posts).then((B) => {
      B && (G = h);
    }).catch(() => {
    }));
  }), Xe(() => {
    const h = I.posts;
    !u() || h.length === 0 || (ff(h.map((B) => B.eventId)).catch(() => {
    }), so(() => ve.loadCachedChildInteractionStateForPosts(h)));
  }), Xe(() => {
    const h = m()?.revision ?? 0, B = m()?.parentEventIds ?? [], ge = I.posts;
    !u() || h <= 0 || B.length === 0 || (so(() => ve.loadCachedChildInteractionStateForPosts(ge, B)), Pl({
      source: "dialog-inbound-save",
      parentEventIds: B,
      rxNostr: w(),
      relayConfig: E(),
      isActive: () => u()
    }).then((ce) => {
      if (!(!u() || ce.deletedReactionEventIds.length === 0 && ce.deletedReplyEventIds.length === 0))
        return ve.loadCachedChildInteractionStateForPosts(I.posts, ce.checkedParentEventIds);
    }).catch(() => {
    }));
  }), Xe(() => {
    const h = a()?.revision ?? 0;
    !u() || h <= 0 || I.isSearchMode || I.canReturnToLatest || so(() => I.returnToLatest());
  }), Xe(() => {
    if (u())
      return () => {
        fe.cancelCurrentChannelResolution();
      };
  });
  function qr(h) {
    return h ? h.values ? o()(h.key, { values: h.values }) : o()(h.key) : null;
  }
  function uo() {
    return qr(Lf({
      totalCount: I.displayTotalCount,
      totalCountKnown: I.state.totalCountKnown,
      totalCountStatus: I.state.totalCountStatus,
      isSearchMode: I.isSearchMode
    }));
  }
  function mo(h) {
    if (!h)
      return null;
    const B = Number(h.year), ge = Number(h.month), ce = Number(h.day), $t = new Date(B, ge - 1, ce, 23, 59, 59, 999).getTime();
    return Number.isFinite($t) ? Math.floor($t / 1e3) : null;
  }
  function Fo() {
    return o()(Hd({ direction: "older", isSearchMode: I.isSearchMode }));
  }
  function Ho() {
    return o()(Hd({ direction: "newer", isSearchMode: I.isSearchMode }));
  }
  async function bo() {
    const h = I.isSearchMode, B = h ? qe.captureHistoryScrollAnchor() : null;
    await I.loadOlder() && h && qe.restoreHistoryScrollAnchor(B);
  }
  function Co() {
    return u() && !I.isSearchMode && I.state.listingMode === "contiguous" && I.state.hasOlderLocal && !I.isRefetchingAroundCurrentView;
  }
  function wn() {
    let h = null;
    return {
      captureAnchorEventId: () => (h = qe.captureHistoryScrollAnchor(), h?.eventId ?? null),
      canCommitWindowChange: (B, ge, ce) => qe.canCommitAutoLoadWindowChange(B, ge, ce),
      onCommitted: () => {
        R(), qe.restoreHistoryScrollAnchor(h, { flushUpdates: !1 });
      }
    };
  }
  async function No() {
    if (!(r(Pn) || Ht || !Co())) {
      g(Pn, !0), Ht = !0;
      try {
        await I.loadOlder(wn());
      } finally {
        g(Pn, !1), Xt || (Ht = !1);
      }
    }
  }
  function Mr() {
    return u() && !I.isSearchMode && I.state.listingMode === "contiguous" && I.state.hasNewerLocal && !r(re) && !I.isRefetchingAroundCurrentView;
  }
  async function Ia() {
    if (!(r(mt) || Rt || !Mr())) {
      g(mt, !0), Rt = !0;
      try {
        await I.loadNewer(wn());
      } finally {
        g(mt, !1), qt || (Rt = !1);
      }
    }
  }
  async function $o() {
    await I.showSavedOlderPosts() && qe.resetHistoryScrollSoon();
  }
  async function Bo() {
    const h = qe.captureHistoryScrollAnchor(), B = r(Ye)?.scrollTop ?? null;
    I.state.loadedPosts.length, r(Ye)?.scrollHeight, r(Ye)?.clientHeight;
    const ge = await I.fetchOlderFromRelays({ anchorEventId: h?.eventId });
    let ce = !1;
    ge && B !== null && u() && r(Ye) && (ce = qe.restoreHistoryScrollAnchor(h), ce || (r(Ye).scrollTop = B)), I.latestOlderBackfillUiResult, r(Ye)?.scrollTop, r(Ye)?.scrollHeight;
  }
  async function ho() {
    const h = I.isSearchMode ? null : qe.captureHistoryScrollAnchor();
    await I.loadNewer() && (I.isSearchMode ? qe.resetHistoryScrollSoon() : qe.restoreHistoryScrollAnchor(h));
  }
  async function fo() {
    qe.clearAllSessionScrollAnchorsForCurrentPubkey();
    const h = I.canReturnToLatest ? await I.returnToLatest() : !1;
    g(re, !1), (h || !qe.isHistoryScrolledToTop) && qe.resetHistoryScrollSoon();
  }
  async function Po() {
    const h = mo(r(He));
    if (h === null)
      return;
    qe.clearAllSessionScrollAnchorsForCurrentPubkey(), g(re, !0);
    const B = await I.jumpToCreatedAt(h);
    B || g(re, !1), B && (g(K, "none"), g(k, !1), qe.resetHistoryScrollSoon());
  }
  function oa(h) {
    return r(gr)[h.eventId] ?? Fn(h);
  }
  function Uo(h) {
    return se.getQuotePreviews(h);
  }
  function Un(h) {
    return r(yt)[h.eventId] === "sending";
  }
  function Zr(h) {
    return r(yt)[h.eventId] === "failed";
  }
  function l(h) {
    return r(vt)[h.eventId] === "sending";
  }
  function p(h) {
    return Nf(h) !== null;
  }
  function F(h) {
    const B = ve.getAnchorState(h).repliesActionState;
    return qr(Hf(B)) ?? "";
  }
  function N(h) {
    return !!r(sn)[h.eventId];
  }
  function q(h) {
    return !!r(sn)[h];
  }
  function Y(h) {
    g(
      sn,
      {
        ...r(sn),
        [h]: !r(sn)[h]
      },
      !0
    );
  }
  function le(h) {
    const B = I.posts.find((ge) => ge.eventId === h);
    return B ? ve.getAnchorState(B).reactionReadModel : Fe.getReadModel(h);
  }
  function Te(h) {
    const B = le(h);
    return qr(Fd({
      visible: q(h),
      reactionCount: B?.totalCount ?? 0
    })) ?? "";
  }
  function de(h) {
    const B = ve.getAnchorState(h).reactionSummary.totalCount;
    return qr(Fd({ visible: N(h), reactionCount: B })) ?? "";
  }
  function we(h) {
    Y(h.eventId);
  }
  function De(h) {
    const B = ve.getAnchorState(h).repliesActionState;
    if (B.status === "failed" || B.status === "loaded" && B.replyCount === 0) {
      ve.retryChildren(h);
      return;
    }
    ve.toggleChildren(h);
  }
  function ke(h) {
    return Ld(h, x());
  }
  function Le(h) {
    ke(h) && ye.openDeleteConfirm(h);
  }
  async function st(h, B) {
    if (l(h))
      return;
    const ge = Ue(h, B);
    g(vt, { ...r(vt), [h.eventId]: "sending" }, !0);
    const ce = await Ff.broadcast({ post: h, rxNostr: w() });
    g(vt, { ...r(vt), [h.eventId]: void 0 }, !0), at(ge, ce);
  }
  function gt() {
    ht && (clearTimeout(ht), ht = void 0), g(ot, !1), g(an, void 0);
  }
  function Tt(h, B) {
    g(
      an,
      {
        eventId: h.eventId,
        ...ni(B.clientX, B.clientY)
      },
      !0
    );
  }
  function Ue(h, B) {
    if (r(an)?.eventId === h.eventId)
      return {
        x: r(an).x,
        y: r(an).y
      };
    const ge = B.currentTarget, ce = ge instanceof HTMLElement ? ge.getBoundingClientRect() : null;
    return ni(ce ? ce.left + ce.width / 2 : 0, ce ? ce.bottom + 8 : 0);
  }
  function at(h, B) {
    ht && clearTimeout(ht), g(Ge, h.x, !0), g(ne, h.y, !0), g(
      It,
      B.success ? (B.rejectedRelays?.length ?? 0) > 0 || (B.timedOutRelays?.length ?? 0) > 0 ? "postHistory.broadcastPartial" : "postHistory.broadcastSent" : "postHistory.broadcastFailed",
      !0
    ), g(ot, !0), ht = setTimeout(
      () => {
        g(ot, !1), ht = void 0;
      },
      1800
    );
  }
  function bt(h) {
    const B = Date.now(), ge = h.node.event.created_at * 1e3;
    return {
      id: h.node.eventId,
      eventId: h.node.eventId,
      pubkeyHex: h.node.authorPubkey,
      kind: h.node.event.kind,
      content: h.node.event.content,
      tags: h.node.event.tags.map((ce) => [...ce]),
      createdAt: ge,
      postedAt: ge,
      relayHints: [...h.node.relayUrls],
      acceptedRelays: [...h.node.relayUrls],
      fetchedRelays: [...h.node.relayUrls],
      media: [],
      rawEvent: h.node.event,
      updatedAt: B,
      schemaVersion: 1
    };
  }
  function cn(h) {
    const B = Date.now(), ge = h.created_at * 1e3;
    return {
      id: h.id,
      eventId: h.id,
      pubkeyHex: h.pubkey,
      kind: h.kind,
      content: h.content,
      tags: h.tags.map((ce) => [...ce]),
      createdAt: ge,
      postedAt: ge,
      relayHints: [],
      acceptedRelays: [],
      fetchedRelays: [],
      media: [],
      rawEvent: h,
      updatedAt: B,
      schemaVersion: 1
    };
  }
  function vr(h, B) {
    return `quote-preview:${h}:${B}`;
  }
  function Rr(h, B) {
    B && ye.closeAllPostItemMenus(), ye.setPostMenuOpen(h, B);
  }
  function xe(h) {
    g(pt, h, !0), g(ut, !0);
  }
  function ze(h) {
    xe(h.node.event);
  }
  function un(h) {
    return V.copyState[h] === "failed";
  }
  function _n(h) {
    return r(vt)[h] === "sending";
  }
  function jt(h, B) {
    V.captureCopyPointerPosition(bt(h), B);
  }
  function Xr(h, B) {
    V.handleCopyNevent(bt(h), B);
  }
  function aa(h) {
    qo(bt(h));
  }
  function Na() {
    return {
      client: Ad.externalNostrClient,
      customUrlTemplate: Ad.externalNostrClientCustomUrl
    };
  }
  function eo() {
    const h = yf(Na());
    return h ? o()("postHistory.openInExternalClient", { values: { client: h } }) : o()("postHistory.openInExternalClientFallback");
  }
  function qo(h) {
    const B = mf(h, Na(), jc.value);
    B && window.open(B, "_blank", "noopener,noreferrer");
  }
  function Vo(h, B) {
    Tt(bt(h), B);
  }
  function jo(h, B) {
    st(bt(h), B);
  }
  function $a(h) {
    return Ld(bt(h), x());
  }
  function _a(h) {
    return r(yt)[h] === "sending";
  }
  function Ba(h) {
    const B = bt(h);
    ke(B) && ye.openDeleteConfirm(B);
  }
  async function wo(h) {
    v() && await v()(h) !== !1 && kr();
  }
  function xo(h) {
    b() && (b()(h), kr());
  }
  function os() {
    ye.cancelDeleteConfirm();
  }
  async function Ua() {
    await Go(), r(K) === "search" && r(Zn)?.focus({ preventScroll: !0 });
  }
  function as() {
    if (r(K) === "search") {
      sa(), g(O, !1);
      return;
    }
    g(K, "search"), g(O, !1), Ua();
  }
  function sa() {
    qe.clearCurrentSessionScrollAnchor(), g(K, "none"), I.resetSearchState();
  }
  async function ia(h) {
    const B = ++Ce;
    g(re, !0);
    const ge = await I.jumpToEventId(h.eventId);
    if (!(B !== Ce || !u())) {
      if (!ge) {
        g(re, !1);
        return;
      }
      qe.clearAllSessionScrollAnchorsForCurrentPubkey(), g(K, "none"), I.resetSearchState(), qe.scrollHistoryEventToTopSoon(h.eventId);
    }
  }
  function qa() {
    const h = r(K) !== "jump-date";
    g(K, h ? "jump-date" : "none", !0), h || g(k, !1), g(O, !1);
  }
  function Va() {
    g(K, "none"), g(k, !1);
  }
  function Ro(h) {
    const B = r(Ae) ?? r(He);
    !B || h === 0 || g(Ae, B.add({ years: h }), !0);
  }
  function f() {
    g(ue, !0), g(O, !1);
  }
  function y() {
    g(X, !0), g(O, !1);
  }
  function A() {
    Je && (clearTimeout(Je), Je = void 0), g(je, !1);
  }
  function U() {
    const h = /* @__PURE__ */ new Date();
    return [
      String(h.getFullYear()).padStart(4, "0"),
      String(h.getMonth() + 1).padStart(2, "0"),
      String(h.getDate()).padStart(2, "0")
    ].join("-");
  }
  function W(h) {
    A(), g(
      ae,
      h.isPartial ? "postHistory.exportPartial" : "postHistory.exportComplete",
      !0
    ), g(
      $e,
      {
        exported: h.exportedEventCount,
        skipped: h.skippedPostCount + h.missingDeletionRawEventCount + h.invalidDeletionRawEventCount
      },
      !0
    ), g(je, !0), Je = setTimeout(
      () => {
        g(je, !1), Je = void 0;
      },
      5e3
    );
  }
  async function ie() {
    if (!x() || r(he))
      return;
    g(he, !0), g($, { phase: "loading" }, !0);
    const h = new AbortController();
    j = h, We = x(), g(O, !1), A();
    try {
      const { result: B, blob: ge } = await s0.exportForPubkeyInWorker(x(), {
        signal: h.signal,
        onProgress: ($t) => {
          g($, $t, !0);
        }
      });
      if (h.signal.aborted)
        return;
      const ce = URL.createObjectURL(ge), it = document.createElement("a");
      it.href = ce, it.download = `ehagaki-post-history-${U()}.jsonl`, it.style.display = "none", d.appendChild(it), it.click(), setTimeout(
        () => {
          it.remove(), URL.revokeObjectURL?.(ce);
        },
        1e3
      ), W(B);
    } catch (B) {
      if (h.signal.aborted || B instanceof DOMException && B.name === "AbortError")
        return;
      g(ae, "postHistory.exportFailed"), g($e, {}, !0), g(je, !0), Je = setTimeout(
        () => {
          g(je, !1), Je = void 0;
        },
        5e3
      );
    } finally {
      j === h && (j = void 0, We = void 0, g(he, !1));
    }
  }
  async function pe() {
    const h = qe.captureHistoryScrollAnchor(), B = r(Ye)?.scrollTop ?? null;
    await I.refreshAfterLocalImport(), !I.isSearchMode && r(Ye) && !qe.restoreHistoryScrollAnchor(h) && B !== null && (r(Ye).scrollTop = B);
  }
  function Ve() {
    g(O, !1), I.refetchAroundCurrentView();
  }
  function Be() {
    qe.clearAllSessionScrollAnchorsForCurrentPubkey(), g(O, !1), I.jumpToOldest().then((h) => {
      (h || !qe.isHistoryScrolledToBottom) && qe.resetHistoryScrollToBottomSoon();
    });
  }
  function Ze() {
    g(O, !1), fo();
  }
  function Re() {
    g(ue, !1);
  }
  function At(h) {
    g(ln, h.mediaList, !0), g(Ke, h.index, !0), g(ft, h.mediaList.length > 0 && h.index >= 0, !0);
  }
  function yn(h) {
    g(Ke, h, !0);
  }
  function Qe() {
    g(ft, !1), g(ln, [], !0), g(Ke, -1);
  }
  async function Nt() {
    const h = ye.deleteTargetPost;
    if (!h)
      return;
    g(
      yt,
      {
        ...r(yt),
        [h.eventId]: "sending"
      },
      !0
    );
    const B = await Tf.requestDeletion({ post: h, rxNostr: w() });
    B.success && typeof B.deletedAt == "number" && B.deletionEventId ? (I.patchDeletedPost(h.eventId, B.deletedAt, B.deletionEventId), ve.recordDeletedEvent({
      eventId: h.eventId,
      authorPubkey: h.pubkeyHex,
      deletionEvent: B.deletionEvent ?? null,
      deletionEventAttestation: B.deletionEventAttestation
    }).catch(() => {
    }), g(
      yt,
      {
        ...r(yt),
        [h.eventId]: void 0
      },
      !0
    )) : g(yt, { ...r(yt), [h.eventId]: "failed" }, !0), ye.clearDeleteTarget();
  }
  async function Dt() {
    await I.deleteLocalHistory() && (qe.clearAllSessionScrollAnchorsForCurrentPubkey(), g(ue, !1), g(K, "none"), qe.resetHistoryScrollSoon());
  }
  var Vr = {
    get show() {
      return u();
    },
    set show(h = !1) {
      u(h), R();
    },
    get onClose() {
      return _();
    },
    set onClose(h) {
      _(h), R();
    },
    get onReplyPost() {
      return v();
    },
    set onReplyPost(h = void 0) {
      v(h), R();
    },
    get onQuotePost() {
      return b();
    },
    set onQuotePost(h = void 0) {
      b(h), R();
    },
    get pubkeyHex() {
      return x();
    },
    set pubkeyHex(h = null) {
      x(h), R();
    },
    get rxNostr() {
      return w();
    },
    set rxNostr(h = void 0) {
      w(h), R();
    },
    get relayConfig() {
      return E();
    },
    set relayConfig(h = null) {
      E(h), R();
    },
    get latestPostedEvent() {
      return C();
    },
    set latestPostedEvent(h = null) {
      C(h), R();
    },
    get inboundInteractionSave() {
      return m();
    },
    set inboundInteractionSave(h = null) {
      m(h), R();
    },
    get authoredSelfPostSave() {
      return a();
    },
    set authoredSelfPostSave(h = null) {
      a(h), R();
    },
    get reconcileInboundDirectReplyCandidates() {
      return L();
    },
    set reconcileInboundDirectReplyCandidates(h = void 0) {
      L(h), R();
    },
    get notifySavedAuthoredPosts() {
      return oe();
    },
    set notifySavedAuthoredPosts(h = void 0) {
      oe(h), R();
    }
  }, Ko = Rb(), Sr = J(Ko);
  {
    const h = (ce) => {
      var it = Pe(), $t = J(it);
      {
        const tn = (xn, Xn) => {
          let pr = () => Xn?.().props;
          {
            let Or = P(() => o()("global.close"));
            ar(xn, es(pr, {
              className: "modal-close",
              shape: "square",
              get ariaLabel() {
                return r(Or);
              },
              children: (vo, da) => {
                var Lr = i0();
                Ie((Ya) => cr(Lr, "aria-label", Ya), [() => o()("global.close")]), D(vo, Lr);
              },
              $$slots: { default: !0 }
            }));
          }
        };
        Oe($t, () => au, (xn, Xn) => {
          Xn(xn, { child: tn, $$slots: { child: !0 } });
        });
      }
      D(ce, it);
    };
    let B = P(() => o()("postHistory.title")), ge = P(() => o()("postHistory.description"));
    ou(Sr, {
      onOpenChange: (ce) => !ce && kr(),
      onInteractOutside: Sa,
      onEscapeKeydown: co,
      trapFocus: !1,
      get title() {
        return r(B);
      },
      get description() {
        return r(ge);
      },
      contentClass: "post-history-dialog",
      footerVariant: "close-button",
      showPagination: !1,
      initialFocus: "content",
      get open() {
        return u();
      },
      set open(ce) {
        u(ce);
      },
      footer: h,
      children: (ce, it) => {
        var $t = mb(), tn = J($t), xn = T(tn), Xn = T(xn);
        {
          var pr = (tt) => {
            var Ct = l0(), Kt = T(Ct), er = T(Kt, !0);
            M(Kt), M(Ct), Ie(() => te(er, qe.currentMonthLabel)), ei("click", Kt, qa), D(tt, Ct);
          };
          be(Xn, (tt) => {
            qe.currentMonthLabel && tt(pr);
          });
        }
        M(xn);
        var Or = H(xn, 2), vo = T(Or);
        {
          var da = (tt) => {
            {
              let Ct = P(() => r($).phase === "loading" ? o()("postHistory.exportLoading") : r($).phase === "verifying" ? o()("postHistory.exportVerifying", {
                values: {
                  processed: r($).processed ?? 0,
                  total: r($).total ?? 0
                }
              }) : o()("postHistory.exportCreating"));
              Ea(tt, {
                get text() {
                  return r(Ct);
                },
                showLoader: !0,
                loaderSize: 30,
                state: "loading",
                customClass: "status-loading-placeholder"
              });
            }
          }, Lr = (tt) => {
            {
              let Ct = P(() => r(In) ? o()(r(Ar), { values: r(In) }) : o()(r(Ar))), Kt = P(() => I.showStatusLoader ? "loading" : "complete"), er = P(() => `status-loading-placeholder${r(Hn) ? " status-error" : ""}`);
              Ea(tt, {
                get text() {
                  return r(Ct);
                },
                get showLoader() {
                  return I.showStatusLoader;
                },
                loaderSize: 30,
                get state() {
                  return r(Kt);
                },
                get customClass() {
                  return r(er);
                }
              });
            }
          };
          be(vo, (tt) => {
            r(he) ? tt(da) : r(Ar) && tt(Lr, 1);
          });
        }
        var Ya = H(vo, 2);
        {
          var is = (tt) => {
            var Ct = d0(), Kt = T(Ct), er = T(Kt), tr = T(er, !0);
            M(er), M(Kt), M(Ct), Ie((no) => te(tr, no), [() => uo()]), D(tt, Ct);
          }, Yo = P(() => uo());
          be(Ya, (tt) => {
            r(Yo) && tt(is);
          });
        }
        var ls = H(Ya, 2);
        Oe(ls, () => Od, (tt, Ct) => {
          Ct(tt, {
            get open() {
              return r(O);
            },
            set open(Kt) {
              g(O, Kt, !0);
            },
            children: (Kt, er) => {
              var tr = C0(), no = J(tr);
              {
                let So = P(() => `menu-trigger post-history-menu-trigger post-history-heading-menu-trigger ${r(O) ? "is-open" : ""}`.trim()), qn = P(() => o()("postHistory.openMenu"));
                Oe(no, () => Md, (Fr, En) => {
                  En(Fr, {
                    get class() {
                      return r(So);
                    },
                    get "aria-label"() {
                      return r(qn);
                    },
                    children: (nr, Kr) => {
                      var ha = c0();
                      D(nr, ha);
                    },
                    $$slots: { default: !0 }
                  });
                });
              }
              var ro = H(no, 2);
              Oe(ro, () => Gs, (So, qn) => {
                qn(So, {
                  get to() {
                    return d;
                  },
                  children: (Fr, En) => {
                    var nr = Pe(), Kr = J(nr);
                    Oe(Kr, () => Td, (ha, za) => {
                      za(ha, {
                        side: "bottom",
                        align: "end",
                        sideOffset: 8,
                        class: "post-history-menu-content",
                        trapFocus: !1,
                        preventScroll: !1,
                        onCloseAutoFocus: (fa) => fa.preventDefault(),
                        children: (fa, Pt) => {
                          var Z = b0(), ct = T(Z);
                          Oe(ct, () => Gn, (Ot, Zt) => {
                            Zt(Ot, {
                              class: "menu-action-button",
                              onSelect: as,
                              children: (Rn, Nn) => {
                                var rr = u0(), nn = H(J(rr), 2), mn = T(nn, !0);
                                M(nn), Ie((Vn) => te(mn, Vn), [() => o()("postHistory.showSearch")]), D(Rn, rr);
                              },
                              $$slots: { default: !0 }
                            });
                          });
                          var kt = H(ct, 2);
                          {
                            let Ot = P(() => !I.canRefetchAroundCurrentView);
                            Oe(kt, () => Gn, (Zt, Rn) => {
                              Rn(Zt, {
                                class: "menu-action-button",
                                get disabled() {
                                  return r(Ot);
                                },
                                onSelect: Ve,
                                children: (Nn, rr) => {
                                  var nn = h0(), mn = H(J(nn), 2), Vn = T(mn, !0);
                                  M(mn), Ie((Yr) => te(Vn, Yr), [() => o()("postHistory.repair")]), D(Nn, nn);
                                },
                                $$slots: { default: !0 }
                              });
                            });
                          }
                          var wt = H(kt, 2);
                          Oe(wt, () => Zo, (Ot, Zt) => {
                            Zt(Ot, { class: "post-history-menu-separator" });
                          });
                          var Gt = H(wt, 2);
                          {
                            let Ot = P(() => !r(sr));
                            Oe(Gt, () => Gn, (Zt, Rn) => {
                              Rn(Zt, {
                                class: "menu-action-button",
                                get disabled() {
                                  return r(Ot);
                                },
                                onSelect: Ze,
                                children: (Nn, rr) => {
                                  var nn = f0(), mn = H(J(nn), 2), Vn = T(mn, !0);
                                  M(mn), Ie((Yr) => te(Vn, Yr), [() => o()("postHistory.returnToLatest")]), D(Nn, nn);
                                },
                                $$slots: { default: !0 }
                              });
                            });
                          }
                          var St = H(Gt, 2);
                          Oe(St, () => Gn, (Ot, Zt) => {
                            Zt(Ot, {
                              class: "menu-action-button",
                              onSelect: qa,
                              children: (Rn, Nn) => {
                                var rr = g0(), nn = H(J(rr), 2), mn = T(nn, !0);
                                M(nn), Ie((Vn) => te(mn, Vn), [() => o()("postHistory.jumpToDate")]), D(Rn, rr);
                              },
                              $$slots: { default: !0 }
                            });
                          });
                          var hn = H(St, 2);
                          {
                            let Ot = P(() => !r(xr));
                            Oe(hn, () => Gn, (Zt, Rn) => {
                              Rn(Zt, {
                                class: "menu-action-button",
                                get disabled() {
                                  return r(Ot);
                                },
                                onSelect: Be,
                                children: (Nn, rr) => {
                                  var nn = v0(), mn = H(J(nn), 2), Vn = T(mn, !0);
                                  M(mn), Ie((Yr) => te(Vn, Yr), [() => o()("postHistory.jumpToOldest")]), D(Nn, nn);
                                },
                                $$slots: { default: !0 }
                              });
                            });
                          }
                          var xt = H(hn, 2);
                          Oe(xt, () => Zo, (Ot, Zt) => {
                            Zt(Ot, { class: "post-history-menu-separator" });
                          });
                          var yr = H(xt, 2);
                          {
                            let Ot = P(() => !x() || r(he));
                            Oe(yr, () => Gn, (Zt, Rn) => {
                              Rn(Zt, {
                                class: "menu-action-button",
                                get disabled() {
                                  return r(Ot);
                                },
                                onSelect: ie,
                                children: (Nn, rr) => {
                                  var nn = p0(), mn = H(J(nn), 2), Vn = T(mn, !0);
                                  M(mn), Ie((Yr) => te(Vn, Yr), [() => o()("postHistory.export")]), D(Nn, nn);
                                },
                                $$slots: { default: !0 }
                              });
                            });
                          }
                          var lr = H(yr, 2);
                          {
                            let Ot = P(() => !x());
                            Oe(lr, () => Gn, (Zt, Rn) => {
                              Rn(Zt, {
                                class: "menu-action-button",
                                get disabled() {
                                  return r(Ot);
                                },
                                onSelect: y,
                                children: (Nn, rr) => {
                                  var nn = y0(), mn = H(J(nn), 2), Vn = T(mn, !0);
                                  M(mn), Ie((Yr) => te(Vn, Yr), [() => o()("postHistory.import")]), D(Nn, nn);
                                },
                                $$slots: { default: !0 }
                              });
                            });
                          }
                          var Hr = H(lr, 2);
                          Oe(Hr, () => Zo, (Ot, Zt) => {
                            Zt(Ot, { class: "post-history-menu-separator" });
                          });
                          var Qn = H(Hr, 2);
                          Oe(Qn, () => Gn, (Ot, Zt) => {
                            Zt(Ot, {
                              class: "menu-action-button menu-action-button-danger",
                              onSelect: f,
                              children: (Rn, Nn) => {
                                var rr = m0(), nn = H(J(rr), 2), mn = T(nn, !0);
                                M(nn), Ie((Vn) => te(mn, Vn), [() => o()("postHistory.deleteLocalHistory")]), D(Rn, rr);
                              },
                              $$slots: { default: !0 }
                            });
                          }), M(Z), D(fa, Z);
                        },
                        $$slots: { default: !0 }
                      });
                    }), D(Fr, nr);
                  },
                  $$slots: { default: !0 }
                });
              }), D(Kt, tr);
            },
            $$slots: { default: !0 }
          });
        }), M(Or), M(tn);
        var ds = H(tn, 2);
        {
          var jr = (tt) => {
            var Ct = x0(), Kt = T(Ct);
            let er;
            var tr = T(Kt), no = T(tr);
            {
              var ro = (En) => {
                Ea(En, {
                  variant: "spinner",
                  showLoader: !0,
                  loaderSize: 24,
                  ariaHidden: !0,
                  customClass: "post-history-search-spinner"
                });
              }, So = (En) => {
                var nr = P0();
                D(En, nr);
              };
              be(no, (En) => {
                I.isSearchPageLoading ? En(ro) : En(So, -1);
              });
            }
            M(tr);
            var qn = H(tr, 2);
            bf(qn), Rs(qn, (En) => g(Zn, En), () => r(Zn)), M(Kt);
            var Fr = H(Kt, 2);
            {
              let En = P(() => o()("postHistory.hideSearch"));
              ar(Fr, {
                type: "button",
                class: "post-history-search-close",
                contentLayout: "icon",
                shape: "square",
                get ariaLabel() {
                  return r(En);
                },
                onClick: sa,
                children: (nr, Kr) => {
                  var ha = w0();
                  D(nr, ha);
                },
                $$slots: { default: !0 }
              });
            }
            M(Ct), Ie(
              (En, nr) => {
                er = ko(Kt, 1, "post-history-search-input-wrapper svelte-uxr0i8", null, er, { "post-history-search-active": I.isSearchMode }), cr(qn, "placeholder", En), cr(qn, "aria-label", nr), cr(qn, "aria-busy", I.isSearchPageLoading ? "true" : "false");
              },
              [
                () => o()("postHistory.searchPlaceholder"),
                () => o()("postHistory.search")
              ]
            ), pf(qn, () => I.state.searchInput, (En) => I.state.searchInput = En), D(tt, Ct);
          };
          be(ds, (tt) => {
            r(K) === "search" && tt(jr);
          });
        }
        var cs = H(ds, 2);
        {
          var us = (tt) => {
            var Ct = T0(), Kt = T(Ct), er = T(Kt, !0);
            M(Kt);
            var tr = H(Kt, 2), no = T(tr);
            {
              let qn = P(() => n() ?? void 0), Fr = P(() => o()("postHistory.jumpToDateLabel"));
              Oe(no, () => Qu, (En, nr) => {
                nr(En, {
                  get locale() {
                    return r(qn);
                  },
                  get calendarLabel() {
                    return r(Fr);
                  },
                  get value() {
                    return r(He);
                  },
                  set value(Kr) {
                    g(He, Kr, !0);
                  },
                  get placeholder() {
                    return r(Ae);
                  },
                  set placeholder(Kr) {
                    g(Ae, Kr, !0);
                  },
                  get open() {
                    return r(k);
                  },
                  set open(Kr) {
                    g(k, Kr, !0);
                  },
                  children: (Kr, ha) => {
                    var za = D0(), fa = J(za);
                    {
                      const ct = (kt, wt) => {
                        let Gt = () => wt?.().segments;
                        var St = Pe(), hn = J(St);
                        Jo(hn, 19, Gt, (xt, yr) => `${xt.part}-${yr}`, (xt, yr) => {
                          var lr = Pe(), Hr = J(lr);
                          Oe(Hr, () => Ku, (Qn, Ot) => {
                            Ot(Qn, {
                              class: "post-history-date-picker-segment",
                              get part() {
                                return r(yr).part;
                              },
                              children: (Zt, Rn) => {
                                Ma();
                                var Nn = ta();
                                Ie(() => te(Nn, r(yr).value)), D(Zt, Nn);
                              },
                              $$slots: { default: !0 }
                            });
                          }), D(xt, lr);
                        }), D(kt, St);
                      };
                      Oe(fa, () => ju, (kt, wt) => {
                        wt(kt, {
                          "aria-labelledby": "post-history-jump-date-label",
                          class: "post-history-date-picker-input",
                          children: ct,
                          $$slots: { default: !0 }
                        });
                      });
                    }
                    var Pt = H(fa, 2);
                    {
                      let ct = P(() => o()("postHistory.jumpToDate"));
                      Oe(Pt, () => Ju, (kt, wt) => {
                        wt(kt, {
                          class: "post-history-date-picker-trigger",
                          get "aria-label"() {
                            return r(ct);
                          },
                          children: (Gt, St) => {
                            var hn = R0();
                            D(Gt, hn);
                          },
                          $$slots: { default: !0 }
                        });
                      });
                    }
                    var Z = H(Pt, 2);
                    Oe(Z, () => Gs, (ct, kt) => {
                      kt(ct, {
                        get to() {
                          return d;
                        },
                        children: (wt, Gt) => {
                          var St = Pe(), hn = J(St);
                          Oe(hn, () => Wu, (xt, yr) => {
                            yr(xt, {
                              sideOffset: 8,
                              class: "post-history-date-picker-content",
                              children: (lr, Hr) => {
                                var Qn = Pe(), Ot = J(Qn);
                                {
                                  const Zt = (Rn, Nn) => {
                                    let rr = () => Nn?.().months, nn = () => Nn?.().weekdays;
                                    var mn = A0(), Vn = J(mn);
                                    Oe(Vn, () => $u, (bn, An) => {
                                      An(bn, {
                                        class: "post-history-date-picker-header",
                                        children: (zn, nt) => {
                                          var Ir = _0(), mr = J(Ir), _r = H(mr, 2);
                                          Oe(_r, () => qu, (Lt, Bt) => {
                                            Bt(Lt, {
                                              class: "post-history-date-picker-nav",
                                              "aria-label": "Previous month",
                                              children: (Mt, rt) => {
                                                var fn = S0();
                                                D(Mt, fn);
                                              },
                                              $$slots: { default: !0 }
                                            });
                                          });
                                          var Qr = H(_r, 2);
                                          Oe(Qr, () => Bu, (Lt, Bt) => {
                                            Bt(Lt, { class: "post-history-date-picker-heading" });
                                          });
                                          var dr = H(Qr, 2);
                                          Oe(dr, () => Uu, (Lt, Bt) => {
                                            Bt(Lt, {
                                              class: "post-history-date-picker-nav",
                                              "aria-label": "Next month",
                                              children: (Mt, rt) => {
                                                var fn = I0();
                                                D(Mt, fn);
                                              },
                                              $$slots: { default: !0 }
                                            });
                                          });
                                          var Dn = H(dr, 2);
                                          ei("click", mr, () => Ro(-1)), ei("click", Dn, () => Ro(1)), D(zn, Ir);
                                        },
                                        $$slots: { default: !0 }
                                      });
                                    });
                                    var Yr = H(Vn, 2);
                                    Jo(Yr, 19, rr, (bn, An) => `${bn.value.toString()}-${An}`, (bn, An) => {
                                      var zn = Pe(), nt = J(zn);
                                      Oe(nt, () => Ou, (Ir, mr) => {
                                        mr(Ir, {
                                          class: "post-history-date-picker-grid",
                                          children: (_r, Qr) => {
                                            var dr = E0(), Dn = J(dr);
                                            Oe(Dn, () => Hu, (Bt, Mt) => {
                                              Mt(Bt, {
                                                children: (rt, fn) => {
                                                  var gn = Pe(), or = J(gn);
                                                  Oe(or, () => fl, (Cn, rn) => {
                                                    rn(Cn, {
                                                      children: (Wn, br) => {
                                                        var kn = Pe(), jn = J(kn);
                                                        Jo(jn, 19, nn, (Mn, Jn) => `${Mn}-${Jn}`, (Mn, Jn) => {
                                                          var $n = Pe(), Tn = J($n);
                                                          Oe(Tn, () => Nu, (Sn, Cr) => {
                                                            Cr(Sn, {
                                                              class: "post-history-date-picker-weekday",
                                                              children: (po, ga) => {
                                                                Ma();
                                                                var Io = ta();
                                                                Ie(() => te(Io, r(Jn))), D(po, Io);
                                                              },
                                                              $$slots: { default: !0 }
                                                            });
                                                          }), D(Mn, $n);
                                                        }), D(Wn, kn);
                                                      },
                                                      $$slots: { default: !0 }
                                                    });
                                                  }), D(rt, gn);
                                                },
                                                $$slots: { default: !0 }
                                              });
                                            });
                                            var Lt = H(Dn, 2);
                                            Oe(Lt, () => Lu, (Bt, Mt) => {
                                              Mt(Bt, {
                                                children: (rt, fn) => {
                                                  var gn = Pe(), or = J(gn);
                                                  Jo(or, 19, () => r(An).weeks, (Cn, rn) => `${r(An).value.toString()}-week-${rn}`, (Cn, rn) => {
                                                    var Wn = Pe(), br = J(Wn);
                                                    Oe(br, () => fl, (kn, jn) => {
                                                      jn(kn, {
                                                        children: (Mn, Jn) => {
                                                          var $n = Pe(), Tn = J($n);
                                                          Jo(Tn, 19, () => r(rn), (Sn, Cr) => `${Sn.toString()}-${Cr}`, (Sn, Cr) => {
                                                            var po = Pe(), ga = J(po);
                                                            Oe(ga, () => Fu, (Io, bd) => {
                                                              bd(Io, {
                                                                get date() {
                                                                  return r(Cr);
                                                                },
                                                                get month() {
                                                                  return r(An).value;
                                                                },
                                                                children: (gs, Us) => {
                                                                  var qs = Pe(), Vs = J(qs);
                                                                  Oe(Vs, () => Tu, (js, Ri) => {
                                                                    Ri(js, {
                                                                      class: "post-history-date-picker-day",
                                                                      children: (Si, _o) => {
                                                                        Ma();
                                                                        var zo = ta();
                                                                        Ie(() => te(zo, r(Cr).day)), D(Si, zo);
                                                                      },
                                                                      $$slots: { default: !0 }
                                                                    });
                                                                  }), D(gs, qs);
                                                                },
                                                                $$slots: { default: !0 }
                                                              });
                                                            }), D(Sn, po);
                                                          }), D(Mn, $n);
                                                        },
                                                        $$slots: { default: !0 }
                                                      });
                                                    }), D(Cn, Wn);
                                                  }), D(rt, gn);
                                                },
                                                $$slots: { default: !0 }
                                              });
                                            }), D(_r, dr);
                                          },
                                          $$slots: { default: !0 }
                                        });
                                      }), D(bn, zn);
                                    }), D(Rn, mn);
                                  };
                                  Oe(Ot, () => zu, (Rn, Nn) => {
                                    Nn(Rn, {
                                      class: "post-history-date-picker-calendar",
                                      children: Zt,
                                      $$slots: { default: !0 }
                                    });
                                  });
                                }
                                D(lr, Qn);
                              },
                              $$slots: { default: !0 }
                            });
                          }), D(wt, St);
                        },
                        $$slots: { default: !0 }
                      });
                    }), D(Kr, za);
                  },
                  $$slots: { default: !0 }
                });
              });
            }
            var ro = H(no, 2);
            {
              let qn = P(() => o()("postHistory.jumpToDateSubmit"));
              ar(ro, {
                type: "button",
                variant: "primary",
                contentLayout: "icon",
                shape: "square",
                get ariaLabel() {
                  return r(qn);
                },
                className: "post-history-utility-button post-history-utility-submit-button",
                onClick: () => void Po(),
                children: (Fr, En) => {
                  var nr = k0();
                  D(Fr, nr);
                },
                $$slots: { default: !0 }
              });
            }
            var So = H(ro, 2);
            {
              let qn = P(() => o()("postHistory.hideJumpToDate"));
              ar(So, {
                type: "button",
                variant: "default",
                contentLayout: "icon",
                shape: "square",
                get ariaLabel() {
                  return r(qn);
                },
                className: "post-history-utility-button post-history-utility-close-button",
                onClick: Va,
                children: (Fr, En) => {
                  var nr = M0();
                  D(Fr, nr);
                },
                $$slots: { default: !0 }
              });
            }
            M(tr), M(Ct), Ie((qn) => te(er, qn), [() => o()("postHistory.jumpToDateLabel")]), D(tt, Ct);
          };
          be(cs, (tt) => {
            r(K) === "jump-date" && tt(us);
          });
        }
        var Qo = H(cs, 2), ca = T(Qo);
        {
          var hs = (tt) => {
            var Ct = O0(), Kt = T(Ct);
            Ea(Kt, { variant: "spinner", showLoader: !0, loaderSize: 24 }), M(Ct), D(tt, Ct);
          }, xi = (tt) => {
            var Ct = L0(), Kt = T(Ct), er = T(Kt, !0);
            M(Kt), M(Ct), Ie((tr) => te(er, tr), [
              () => I.isSearchMode ? o()("postHistory.searchNoResults") : o()("postHistory.empty")
            ]), D(tt, Ct);
          }, Bs = (tt) => {
            var Ct = vb(), Kt = J(Ct);
            {
              var er = (Pt) => {
                var Z = H0(), ct = T(Z);
                {
                  let kt = P(() => !I.canLoadNewer);
                  ar(ct, {
                    type: "button",
                    variant: "default",
                    className: "post-history-nav-button",
                    contentLayout: "iconText",
                    get disabled() {
                      return r(kt);
                    },
                    onClick: () => void ho(),
                    children: (wt, Gt) => {
                      var St = F0(), hn = H(J(St));
                      Ie((xt) => te(hn, ` ${xt ?? ""}`), [() => Ho()]), D(wt, St);
                    },
                    $$slots: { default: !0 }
                  });
                }
                M(Z), D(Pt, Z);
              };
              be(Kt, (Pt) => {
                (I.isSearchMode ? I.canLoadNewer : I.state.hasNewerLocal && (r(re) || !dn || I.state.listingMode !== "contiguous")) && Pt(er);
              });
            }
            var tr = H(Kt, 2);
            {
              var no = (Pt) => {
                var Z = $0(), ct = T(Z);
                {
                  var kt = (wt) => {
                    var Gt = N0(), St = T(Gt);
                    {
                      var hn = (xt) => {
                        Ea(xt, {
                          variant: "spinner",
                          showLoader: !0,
                          loaderSize: 24,
                          ariaHidden: !0
                        });
                      };
                      be(St, (xt) => {
                        r(mt) && xt(hn);
                      });
                    }
                    M(Gt), Rs(Gt, (xt) => g(pn, xt), () => r(pn)), D(wt, Gt);
                  };
                  be(ct, (wt) => {
                    I.state.hasNewerLocal && wt(kt);
                  });
                }
                M(Z), D(Pt, Z);
              };
              be(tr, (Pt) => {
                dn && !I.isSearchMode && I.state.listingMode === "contiguous" && !r(re) && Pt(no);
              });
            }
            var ro = H(tr, 2);
            Jo(ro, 21, () => I.posts, (Pt) => Pt.eventId, (Pt, Z) => {
              const ct = P(() => ve.getAnchorState(r(Z)));
              var kt = nb();
              let wt;
              var Gt = T(kt), St = T(Gt), hn = T(St);
              {
                var xt = (bn) => {
                  var An = J0(), zn = T(An);
                  {
                    var nt = (Lt) => {
                      var Bt = B0(), Mt = H(T(Bt), 2), rt = T(Mt, !0);
                      M(Mt);
                      var fn = H(Mt, 2), gn = T(fn, !0);
                      M(fn), M(Bt), Ie(
                        (or, Cn) => {
                          te(rt, or), te(gn, Cn);
                        },
                        [
                          () => o()("postHistory.channel"),
                          () => fe.getChannelText(r(Z), o())
                        ]
                      ), D(Lt, Bt);
                    };
                    be(zn, (Lt) => {
                      r(Z).kind === 42 && Lt(nt);
                    });
                  }
                  var Ir = H(zn, 2), mr = T(Ir);
                  {
                    var _r = (Lt) => {
                      var Bt = V0(), Mt = T(Bt);
                      {
                        var rt = (Cn) => {
                          var rn = U0(), Wn = T(rn, !0);
                          M(rn), Ie((br) => te(Wn, br), [() => o()("postHistory.deletedBadge")]), D(Cn, rn);
                        };
                        be(Mt, (Cn) => {
                          r(Z).deletedAt && Cn(rt);
                        });
                      }
                      var fn = H(Mt, 2);
                      {
                        var gn = (Cn) => {
                          var rn = q0(), Wn = T(rn, !0);
                          M(rn), Ie((br) => te(Wn, br), [() => o()("postHistory.deleteFailed")]), D(Cn, rn);
                        }, or = P(() => Zr(r(Z)));
                        be(fn, (Cn) => {
                          r(or) && Cn(gn);
                        });
                      }
                      M(Bt), D(Lt, Bt);
                    }, Qr = P(() => r(Z).deletedAt || Zr(r(Z)));
                    be(mr, (Lt) => {
                      r(Qr) && Lt(_r);
                    });
                  }
                  var dr = H(mr, 2);
                  {
                    var Dn = (Lt) => {
                      var Bt = W0(), Mt = J(Bt), rt = T(Mt, !0);
                      M(Mt);
                      var fn = H(Mt, 2);
                      {
                        let gn = P(() => ye.isPostMenuOpen(r(Z).eventId));
                        Oe(fn, () => Od, (or, Cn) => {
                          Cn(or, {
                            get open() {
                              return r(gn);
                            },
                            onOpenChange: (rn) => Rr(r(Z).eventId, rn),
                            children: (rn, Wn) => {
                              var br = z0(), kn = J(br);
                              Oe(kn, () => Md, (Mn, Jn) => {
                                Jn(Mn, {
                                  class: "menu-trigger post-history-menu-trigger",
                                  "aria-label": "アクションを表示",
                                  children: ($n, Tn) => {
                                    var Sn = j0();
                                    D($n, Sn);
                                  },
                                  $$slots: { default: !0 }
                                });
                              });
                              var jn = H(kn, 2);
                              Oe(jn, () => Gs, (Mn, Jn) => {
                                Jn(Mn, {
                                  get to() {
                                    return d;
                                  },
                                  children: ($n, Tn) => {
                                    var Sn = Pe(), Cr = J(Sn);
                                    Oe(Cr, () => Td, (po, ga) => {
                                      ga(po, {
                                        side: "bottom",
                                        align: "start",
                                        sideOffset: 8,
                                        class: "post-history-menu-content",
                                        trapFocus: !1,
                                        preventScroll: !1,
                                        onCloseAutoFocus: (Io) => Io.preventDefault(),
                                        children: (Io, bd) => {
                                          var gs = Q0(), Us = T(gs), qs = T(Us, !0);
                                          M(Us);
                                          var Vs = H(Us, 2);
                                          Oe(Vs, () => Zo, (_o, zo) => {
                                            zo(_o, { class: "post-history-menu-separator" });
                                          });
                                          var js = H(Vs, 2);
                                          {
                                            var Ri = (_o) => {
                                              var zo = Y0(), Ks = J(zo);
                                              Oe(Ks, () => Gn, (vs, ps) => {
                                                ps(vs, {
                                                  class: "menu-action-button",
                                                  onSelect: () => void ia(r(Z)),
                                                  children: (Wo, _b) => {
                                                    var Cd = K0(), Pd = H(J(Cd), 2), vh = T(Pd, !0);
                                                    M(Pd), Ie((ph) => te(vh, ph), [() => o()("postHistory.showSurroundingPosts")]), D(Wo, Cd);
                                                  },
                                                  $$slots: { default: !0 }
                                                });
                                              });
                                              var Ii = H(Ks, 2);
                                              Oe(Ii, () => Zo, (vs, ps) => {
                                                ps(vs, { class: "post-history-menu-separator" });
                                              }), D(_o, zo);
                                            };
                                            be(js, (_o) => {
                                              I.isSearchMode && _o(Ri);
                                            });
                                          }
                                          var Si = H(js, 2);
                                          {
                                            let _o = P(() => V.copyState[r(Z).eventId] === "failed"), zo = P(() => p(r(Z))), Ks = P(() => l(r(Z))), Ii = P(() => ke(r(Z))), vs = P(() => Un(r(Z))), ps = P(eo);
                                            As(Si, {
                                              order: "standard",
                                              get copyFailed() {
                                                return r(_o);
                                              },
                                              get showBroadcast() {
                                                return r(zo);
                                              },
                                              get broadcastSending() {
                                                return r(Ks);
                                              },
                                              get showDelete() {
                                                return r(Ii);
                                              },
                                              showDeleteSeparator: !1,
                                              get deletionSending() {
                                                return r(vs);
                                              },
                                              onCopyPointerDown: (Wo) => V.captureCopyPointerPosition(r(Z), Wo),
                                              onCopyNevent: (Wo) => void V.handleCopyNevent(r(Z), Wo),
                                              get externalClientLabel() {
                                                return r(ps);
                                              },
                                              onOpenExternalClient: () => qo(r(Z)),
                                              onShowRawJson: () => xe(r(Z).rawEvent),
                                              onBroadcastPointerDown: (Wo) => Tt(r(Z), Wo),
                                              onBroadcastPost: (Wo) => void st(r(Z), Wo),
                                              onOpenDeleteConfirm: () => Le(r(Z))
                                            });
                                          }
                                          M(gs), Ie((_o) => te(qs, _o), [() => Zs(r(Z).postedAt, n())]), D(Io, gs);
                                        },
                                        $$slots: { default: !0 }
                                      });
                                    }), D($n, Sn);
                                  },
                                  $$slots: { default: !0 }
                                });
                              }), D(rn, br);
                            },
                            $$slots: { default: !0 }
                          });
                        });
                      }
                      Ie((gn) => te(rt, gn), [() => ol(r(Z).postedAt)]), D(Lt, Bt);
                    };
                    be(dr, (Lt) => {
                      v() || b() || Lt(Dn);
                    });
                  }
                  M(Ir), M(An), D(bn, An);
                }, yr = P(() => r(Z).kind === 42 || r(Z).deletedAt || Zr(r(Z)) || !(v() || b()));
                be(hn, (bn) => {
                  r(yr) && bn(xt);
                });
              }
              var lr = H(hn, 2);
              {
                let bn = P(() => v() ? wo : void 0), An = P(() => b() ? xo : void 0), zn = P(eo);
                vl(lr, {
                  get state() {
                    return r(ct);
                  },
                  section: "parent",
                  get previewModelByEventId() {
                    return r(lo);
                  },
                  get emojiLoadStateByUrl() {
                    return Jt.emojiLoadStateByUrl;
                  },
                  get emojiImageMetaByUrl() {
                    return Jt.emojiImageMetaByUrl;
                  },
                  get scrollRoot() {
                    return r(Ye);
                  },
                  onImageOpen: At,
                  buildPostRecordForNode: bt,
                  get onReplyPost() {
                    return r(bn);
                  },
                  get onQuotePost() {
                    return r(An);
                  },
                  onToggleParent: () => qe.preserveThreadParentToggleScroll(r(Z).eventId, r(Z).eventId, () => ve.toggleParent(r(Z))),
                  onRetryParent: () => ve.retryParent(r(Z)),
                  onToggleNodeParent: (nt) => qe.preserveThreadParentToggleScroll(r(Z).eventId, nt, () => ve.toggleNodeParent(r(Z), nt)),
                  onRetryNodeParent: (nt) => ve.retryNodeParent(r(Z), nt),
                  onToggleNodeChildren: (nt) => ve.toggleNodeChildren(r(Z), nt),
                  onRetryNodeChildren: (nt) => ve.retryNodeChildren(r(Z), nt),
                  onCopyPointerDown: jt,
                  onCopyNevent: Xr,
                  get externalClientLabel() {
                    return r(zn);
                  },
                  onOpenExternalClient: aa,
                  isCopyFailed: un,
                  onShowRawJson: ze,
                  onBroadcastPointerDown: Vo,
                  onBroadcastPost: jo,
                  isBroadcastSending: _n,
                  canDeleteNodePost: $a,
                  isDeletionSending: _a,
                  onOpenDeleteConfirm: Ba
                });
              }
              var Hr = H(lr, 2), Qn = T(Hr), Ot = T(Qn);
              {
                const bn = (Ir) => {
                  {
                    let mr = P(() => Yn.shouldCollapsePost(r(Z))), _r = P(() => Yn.isPostExpanded(r(Z))), Qr = P(() => "post-preview-content-" + r(Z).eventId);
                    Of(Ir, {
                      placement: "overlay",
                      get visible() {
                        return r(mr);
                      },
                      get expanded() {
                        return r(_r);
                      },
                      get controls() {
                        return r(Qr);
                      },
                      onToggle: () => Yn.togglePostExpanded(r(Z).eventId)
                    });
                  }
                };
                let An = P(() => oa(r(Z))), zn = P(() => "post-preview-content-" + r(Z).eventId), nt = P(() => !Yn.isPostExpanded(r(Z)));
                qc(Ot, {
                  get model() {
                    return r(An);
                  },
                  get contentWarningEventId() {
                    return r(Z).eventId;
                  },
                  density: "standard",
                  get emojiLoadStateByUrl() {
                    return Jt.emojiLoadStateByUrl;
                  },
                  get emojiImageMetaByUrl() {
                    return Jt.emojiImageMetaByUrl;
                  },
                  get scrollRoot() {
                    return r(Ye);
                  },
                  get previewCollapseAction() {
                    return Yn.previewRef;
                  },
                  get previewCollapseEventId() {
                    return r(Z).eventId;
                  },
                  get previewContentId() {
                    return r(zn);
                  },
                  get isTextCollapsed() {
                    return r(nt);
                  },
                  onImageOpen: At,
                  textOverlay: bn,
                  $$slots: { textOverlay: !0 }
                });
              }
              var Zt = H(Ot, 2);
              {
                var Rn = (bn) => {
                  var An = G0();
                  Jo(An, 21, () => Uo(r(Z)), (zn) => zn.eventId, (zn, nt) => {
                    {
                      const Ir = (dr) => {
                        var Dn = Pe(), Lt = J(Dn);
                        {
                          var Bt = (rt) => {
                            const fn = P(() => cn(r(nt).event));
                            {
                              const gn = (rn) => {
                                const Wn = P(() => le(r(nt).event.id));
                                var br = Pe(), kn = J(br);
                                {
                                  var jn = (Mn) => {
                                    {
                                      let Jn = P(() => q(r(nt).event.id)), $n = P(() => Te(r(nt).event.id));
                                      dl(Mn, {
                                        get count() {
                                          return r(Wn).totalCount;
                                        },
                                        get expanded() {
                                          return r(Jn);
                                        },
                                        get ariaLabel() {
                                          return r($n);
                                        },
                                        onToggle: () => Y(r(nt).event.id)
                                      });
                                    }
                                  };
                                  be(kn, (Mn) => {
                                    r(Wn) && r(Wn).totalCount > 0 && Mn(jn);
                                  });
                                }
                                D(rn, br);
                              };
                              let or = P(() => r(nt).event.kind !== 42 && v() ? wo : void 0), Cn = P(() => r(nt).event.kind !== 42 && b() ? xo : void 0);
                              il(rt, {
                                get post() {
                                  return r(fn);
                                },
                                get onReplyPost() {
                                  return r(or);
                                },
                                get onQuotePost() {
                                  return r(Cn);
                                },
                                reactionExtras: gn,
                                $$slots: { reactionExtras: !0 }
                              });
                            }
                          }, Mt = P(() => r(nt).status === "resolved" && (r(nt).event.kind !== 42 || (le(r(nt).event.id)?.totalCount ?? 0) > 0));
                          be(Lt, (rt) => {
                            r(Mt) && rt(Bt);
                          });
                        }
                        D(dr, Dn);
                      }, mr = (dr) => {
                        var Dn = Pe(), Lt = J(Dn);
                        {
                          var Bt = (Mt) => {
                            const rt = P(() => le(r(nt).event.id));
                            var fn = Pe(), gn = J(fn);
                            {
                              var or = (rn) => {
                                ll(rn, {
                                  get readModel() {
                                    return r(rt);
                                  },
                                  get emojiLoadStateByUrl() {
                                    return Jt.emojiLoadStateByUrl;
                                  },
                                  get emojiImageMetaByUrl() {
                                    return Jt.emojiImageMetaByUrl;
                                  }
                                });
                              }, Cn = P(() => r(rt) && r(rt).totalCount > 0 && q(r(nt).event.id));
                              be(gn, (rn) => {
                                r(Cn) && rn(or);
                              });
                            }
                            D(Mt, fn);
                          };
                          be(Lt, (Mt) => {
                            r(nt).status === "resolved" && Mt(Bt);
                          });
                        }
                        D(dr, Dn);
                      }, _r = (dr) => {
                        var Dn = Pe(), Lt = J(Dn);
                        {
                          var Bt = (Mt) => {
                            const rt = P(() => cn(r(nt).event)), fn = P(() => vr(r(Z).eventId, r(rt).eventId)), gn = P(() => o()("common.showActions"));
                            {
                              const or = (Wn) => {
                                {
                                  let br = P(() => V.copyState[r(rt).eventId] === "failed"), kn = P(() => p(r(rt))), jn = P(() => l(r(rt))), Mn = P(() => ke(r(rt))), Jn = P(() => Un(r(rt))), $n = P(eo);
                                  As(Wn, {
                                    order: "standard",
                                    get copyFailed() {
                                      return r(br);
                                    },
                                    get showBroadcast() {
                                      return r(kn);
                                    },
                                    get broadcastSending() {
                                      return r(jn);
                                    },
                                    get showDelete() {
                                      return r(Mn);
                                    },
                                    showDeleteSeparator: !0,
                                    get deletionSending() {
                                      return r(Jn);
                                    },
                                    onCopyPointerDown: (Tn) => V.captureCopyPointerPosition(r(rt), Tn),
                                    onCopyNevent: (Tn) => void V.handleCopyNevent(r(rt), Tn),
                                    get externalClientLabel() {
                                      return r($n);
                                    },
                                    onOpenExternalClient: () => qo(r(rt)),
                                    onShowRawJson: () => xe(r(rt).rawEvent),
                                    onBroadcastPointerDown: (Tn) => Tt(r(rt), Tn),
                                    onBroadcastPost: (Tn) => void st(r(rt), Tn),
                                    onOpenDeleteConfirm: () => Le(r(rt))
                                  });
                                }
                              };
                              let Cn = P(() => ye.isPostMenuOpen(r(fn))), rn = P(() => Zs(r(rt).postedAt, n()));
                              sl(Mt, {
                                get open() {
                                  return r(Cn);
                                },
                                onOpenChange: (Wn) => Rr(r(fn), Wn),
                                get triggerAriaLabel() {
                                  return r(gn);
                                },
                                get tooltipContent() {
                                  return r(gn);
                                },
                                enableTooltip: !0,
                                get timestamp() {
                                  return r(rn);
                                },
                                items: or,
                                $$slots: { items: !0 }
                              });
                            }
                          };
                          be(Lt, (Mt) => {
                            r(nt).status === "resolved" && Mt(Bt);
                          });
                        }
                        D(dr, Dn);
                      };
                      let Qr = P(() => r(nt).status === "resolved" ? r(lo)[r(nt).event.id] : void 0);
                      Gu(zn, {
                        get preview() {
                          return r(nt);
                        },
                        get model() {
                          return r(Qr);
                        },
                        get emojiLoadStateByUrl() {
                          return Jt.emojiLoadStateByUrl;
                        },
                        get emojiImageMetaByUrl() {
                          return Jt.emojiImageMetaByUrl;
                        },
                        get scrollRoot() {
                          return r(Ye);
                        },
                        onImageOpen: At,
                        onRetry: () => se.retryQuotePreview(r(nt).eventId),
                        footerActions: Ir,
                        footerDetails: mr,
                        footerMenu: _r,
                        $$slots: { footerActions: !0, footerDetails: !0, footerMenu: !0 }
                      });
                    }
                  }), M(An), D(bn, An);
                }, Nn = P(() => Uo(r(Z)).length > 0);
                be(Zt, (bn) => {
                  r(Nn) && bn(Rn);
                });
              }
              M(Qn);
              var rr = H(Qn, 2);
              {
                const bn = (Ir) => {
                  {
                    const mr = (Dn) => {
                      var Lt = Pe(), Bt = J(Lt);
                      {
                        var Mt = (rt) => {
                          {
                            let fn = P(() => F(r(Z))), gn = P(() => F(r(Z)));
                            cd(rt, {
                              get count() {
                                return r(ct).repliesActionState.replyCount;
                              },
                              get selected() {
                                return r(ct).repliesActionState.visible;
                              },
                              get ariaLabel() {
                                return r(fn);
                              },
                              get tooltipContent() {
                                return r(gn);
                              },
                              onClick: () => De(r(Z))
                            });
                          }
                        };
                        be(Bt, (rt) => {
                          r(ct).repliesActionState.status === "loaded" && r(ct).repliesActionState.replyCount > 0 && rt(Mt);
                        });
                      }
                      D(Dn, Lt);
                    }, _r = (Dn) => {
                      var Lt = Pe(), Bt = J(Lt);
                      {
                        var Mt = (rt) => {
                          {
                            let fn = P(() => N(r(Z))), gn = P(() => de(r(Z)));
                            dl(rt, {
                              get count() {
                                return r(ct).reactionSummary.totalCount;
                              },
                              get expanded() {
                                return r(fn);
                              },
                              get ariaLabel() {
                                return r(gn);
                              },
                              onToggle: () => we(r(Z))
                            });
                          }
                        };
                        be(Bt, (rt) => {
                          r(ct).reactionSummary.totalCount > 0 && rt(Mt);
                        });
                      }
                      D(Dn, Lt);
                    };
                    let Qr = P(() => v() ? wo : void 0), dr = P(() => b() ? xo : void 0);
                    il(Ir, {
                      get post() {
                        return r(Z);
                      },
                      get onReplyPost() {
                        return r(Qr);
                      },
                      get onQuotePost() {
                        return r(dr);
                      },
                      replyExtras: mr,
                      reactionExtras: _r,
                      $$slots: { replyExtras: !0, reactionExtras: !0 }
                    });
                  }
                }, An = (Ir) => {
                  const mr = P(() => o()("common.showActions"));
                  var _r = Pe(), Qr = J(_r);
                  {
                    var dr = (Dn) => {
                      {
                        const Lt = (rt) => {
                          var fn = tb(), gn = J(fn);
                          Oe(gn, () => Gn, (kn, jn) => {
                            jn(kn, {
                              class: "menu-action-button",
                              onSelect: () => qo(r(Z)),
                              children: (Mn, Jn) => {
                                var $n = Z0(), Tn = H(J($n), 2), Sn = T(Tn, !0);
                                M(Tn), Ie((Cr) => te(Sn, Cr), [() => eo()]), D(Mn, $n);
                              },
                              $$slots: { default: !0 }
                            });
                          });
                          var or = H(gn, 2);
                          Oe(or, () => Zo, (kn, jn) => {
                            jn(kn, { class: "post-history-menu-separator" });
                          });
                          var Cn = H(or, 2);
                          {
                            let kn = P(() => r(ct).repliesActionState.status === "loading");
                            Oe(Cn, () => Gn, (jn, Mn) => {
                              Mn(jn, {
                                class: "menu-action-button",
                                get disabled() {
                                  return r(kn);
                                },
                                onSelect: () => De(r(Z)),
                                children: (Jn, $n) => {
                                  var Tn = X0(), Sn = J(Tn), Cr = H(Sn, 2), po = T(Cr, !0);
                                  M(Cr), Ie(
                                    (ga) => {
                                      ko(Sn, 1, `${r(ct).repliesActionState.visible ? "collapse-content-icon" : "find_in_page-icon"} svg-icon`, "svelte-uxr0i8"), te(po, ga);
                                    },
                                    [() => F(r(Z))]
                                  ), D(Jn, Tn);
                                },
                                $$slots: { default: !0 }
                              });
                            });
                          }
                          var rn = H(Cn, 2);
                          {
                            var Wn = (kn) => {
                              var jn = Pe(), Mn = J(jn);
                              Oe(Mn, () => Gn, (Jn, $n) => {
                                $n(Jn, {
                                  class: "menu-action-button",
                                  onSelect: () => void ia(r(Z)),
                                  children: (Tn, Sn) => {
                                    var Cr = eb(), po = H(J(Cr), 2), ga = T(po, !0);
                                    M(po), Ie((Io) => te(ga, Io), [() => o()("postHistory.showSurroundingPosts")]), D(Tn, Cr);
                                  },
                                  $$slots: { default: !0 }
                                });
                              }), D(kn, jn);
                            };
                            be(rn, (kn) => {
                              I.isSearchMode && kn(Wn);
                            });
                          }
                          var br = H(rn, 2);
                          {
                            let kn = P(() => V.copyState[r(Z).eventId] === "failed"), jn = P(() => p(r(Z))), Mn = P(() => l(r(Z))), Jn = P(() => ke(r(Z))), $n = P(() => !!(v() || b())), Tn = P(() => Un(r(Z)));
                            As(br, {
                              order: "standard",
                              get copyFailed() {
                                return r(kn);
                              },
                              get showBroadcast() {
                                return r(jn);
                              },
                              get broadcastSending() {
                                return r(Mn);
                              },
                              get showDelete() {
                                return r(Jn);
                              },
                              get showDeleteSeparator() {
                                return r($n);
                              },
                              get deletionSending() {
                                return r(Tn);
                              },
                              onCopyPointerDown: (Sn) => V.captureCopyPointerPosition(r(Z), Sn),
                              onCopyNevent: (Sn) => void V.handleCopyNevent(r(Z), Sn),
                              onShowRawJson: () => xe(r(Z).rawEvent),
                              onBroadcastPointerDown: (Sn) => Tt(r(Z), Sn),
                              onBroadcastPost: (Sn) => void st(r(Z), Sn),
                              onOpenDeleteConfirm: () => Le(r(Z))
                            });
                          }
                          D(rt, fn);
                        };
                        let Bt = P(() => ye.isPostMenuOpen(r(Z).eventId)), Mt = P(() => Zs(r(Z).postedAt, n()));
                        sl(Dn, {
                          lazy: !0,
                          get open() {
                            return r(Bt);
                          },
                          onOpenChange: (rt) => Rr(r(Z).eventId, rt),
                          get triggerAriaLabel() {
                            return r(mr);
                          },
                          get tooltipContent() {
                            return r(mr);
                          },
                          enableTooltip: !0,
                          get timestamp() {
                            return r(Mt);
                          },
                          items: Lt,
                          $$slots: { items: !0 }
                        });
                      }
                    };
                    be(Qr, (Dn) => {
                      (v() || b()) && Dn(dr);
                    });
                  }
                  D(Ir, _r);
                };
                let zn = P(() => v() || b() ? ol(r(Z).postedAt) : ""), nt = P(() => !!r(Z).deletedAt);
                su(rr, {
                  get formattedDate() {
                    return r(zn);
                  },
                  get dimmed() {
                    return r(nt);
                  },
                  actions: bn,
                  trailing: An,
                  $$slots: { actions: !0, trailing: !0 }
                });
              }
              var nn = H(rr, 2);
              {
                var mn = (bn) => {
                  ll(bn, {
                    get readModel() {
                      return r(ct).reactionReadModel;
                    },
                    get emojiLoadStateByUrl() {
                      return Jt.emojiLoadStateByUrl;
                    },
                    get emojiImageMetaByUrl() {
                      return Jt.emojiImageMetaByUrl;
                    }
                  });
                }, Vn = P(() => r(ct).reactionSummary.totalCount > 0 && N(r(Z)));
                be(nn, (bn) => {
                  r(Vn) && bn(mn);
                });
              }
              var Yr = H(nn, 2);
              {
                let bn = P(() => v() ? wo : void 0), An = P(() => b() ? xo : void 0), zn = P(eo);
                vl(Yr, {
                  get state() {
                    return r(ct);
                  },
                  section: "children",
                  get previewModelByEventId() {
                    return r(lo);
                  },
                  get emojiLoadStateByUrl() {
                    return Jt.emojiLoadStateByUrl;
                  },
                  get emojiImageMetaByUrl() {
                    return Jt.emojiImageMetaByUrl;
                  },
                  get scrollRoot() {
                    return r(Ye);
                  },
                  onImageOpen: At,
                  buildPostRecordForNode: bt,
                  get onReplyPost() {
                    return r(bn);
                  },
                  get onQuotePost() {
                    return r(An);
                  },
                  getReactionReadModel: le,
                  isReactionExpanded: q,
                  getReactionLabel: Te,
                  onToggleReaction: Y,
                  onToggleNodeParent: (nt) => qe.preserveThreadParentToggleScroll(r(Z).eventId, nt, () => ve.toggleNodeParent(r(Z), nt)),
                  onRetryNodeParent: (nt) => ve.retryNodeParent(r(Z), nt),
                  onToggleNodeChildren: (nt) => ve.toggleNodeChildren(r(Z), nt),
                  onRetryNodeChildren: (nt) => ve.retryNodeChildren(r(Z), nt),
                  onCopyPointerDown: jt,
                  onCopyNevent: Xr,
                  get externalClientLabel() {
                    return r(zn);
                  },
                  onOpenExternalClient: aa,
                  isCopyFailed: un,
                  onShowRawJson: ze,
                  onBroadcastPointerDown: Vo,
                  onBroadcastPost: jo,
                  isBroadcastSending: _n,
                  canDeleteNodePost: $a,
                  isDeletionSending: _a,
                  onOpenDeleteConfirm: Ba
                });
              }
              M(Hr), M(St), M(Gt), M(kt), Ie(() => {
                wt = ko(kt, 1, "post-history-item svelte-uxr0i8", null, wt, { "post-history-item-deleted": !!r(Z).deletedAt }), cr(kt, "data-post-history-event-id", r(Z).eventId), cr(kt, "data-post-history-posted-at", r(Z).postedAt), cr(Hr, "data-post-history-thread-anchor-scope-id", r(Z).eventId), cr(Hr, "data-post-history-thread-anchor-event-id", r(Z).eventId);
              }), D(Pt, kt);
            }), M(ro);
            var So = H(ro, 2);
            {
              var qn = (Pt) => {
                var Z = ob(), ct = T(Z);
                {
                  var kt = (wt) => {
                    var Gt = rb(), St = T(Gt);
                    {
                      var hn = (xt) => {
                        Ea(xt, {
                          variant: "spinner",
                          showLoader: !0,
                          loaderSize: 24,
                          ariaHidden: !0
                        });
                      };
                      be(St, (xt) => {
                        r(Pn) && xt(hn);
                      });
                    }
                    M(Gt), Rs(Gt, (xt) => g(_t, xt), () => r(_t)), D(wt, Gt);
                  };
                  be(ct, (wt) => {
                    I.state.hasOlderLocal && wt(kt);
                  });
                }
                M(Z), D(Pt, Z);
              };
              be(So, (Pt) => {
                dn && !I.isSearchMode && I.state.listingMode === "contiguous" && !I.showSavedPostsBoundary && Pt(qn);
              });
            }
            var Fr = H(So, 2);
            {
              var En = (Pt) => {
                var Z = ab(), ct = T(Z), kt = T(ct, !0);
                M(ct);
                var wt = H(ct, 2), Gt = T(wt, !0);
                M(wt), M(Z), Ie(
                  (St, hn) => {
                    te(kt, St), te(Gt, hn);
                  },
                  [
                    () => o()("postHistory.savedOlderPostsShowing"),
                    () => o()("postHistory.savedOlderPostsGapNotice")
                  ]
                ), D(Pt, Z);
              };
              be(Fr, (Pt) => {
                I.isShowingSavedOlderPosts && Pt(En);
              });
            }
            var nr = H(Fr, 2);
            {
              var Kr = (Pt) => {
                var Z = lb(), ct = T(Z), kt = T(ct);
                {
                  var wt = (St) => {
                    {
                      let hn = P(() => I.isFetchingFromRelays || I.isRefetchingAroundCurrentView);
                      ar(St, {
                        type: "button",
                        variant: "primary",
                        className: "post-history-nav-button",
                        contentLayout: "iconText",
                        get disabled() {
                          return r(hn);
                        },
                        onClick: () => void Bo(),
                        children: (xt, yr) => {
                          var lr = sb(), Hr = H(J(lr));
                          Ie((Qn) => te(Hr, ` ${Qn ?? ""}`), [() => o()("postHistory.fetchOlderFromRelays")]), D(xt, lr);
                        },
                        $$slots: { default: !0 }
                      });
                    }
                  };
                  be(kt, (St) => {
                    (I.canFetchOlderFromRelays || I.isFetchingFromRelays) && St(wt);
                  });
                }
                var Gt = H(kt, 2);
                ar(Gt, {
                  type: "button",
                  variant: "default",
                  className: "post-history-nav-button",
                  contentLayout: "iconText",
                  onClick: () => void $o(),
                  children: (St, hn) => {
                    var xt = ib(), yr = H(J(xt));
                    Ie((lr) => te(yr, ` ${lr ?? ""}`), [() => o()("postHistory.showSavedOlderPosts")]), D(St, xt);
                  },
                  $$slots: { default: !0 }
                }), M(ct), M(Z), D(Pt, Z);
              }, ha = (Pt) => {
                var Z = cb(), ct = T(Z);
                {
                  let kt = P(() => !I.canLoadOlder);
                  ar(ct, {
                    type: "button",
                    variant: "default",
                    className: "post-history-nav-button",
                    contentLayout: "iconText",
                    get disabled() {
                      return r(kt);
                    },
                    onClick: () => void bo(),
                    children: (wt, Gt) => {
                      var St = db(), hn = H(J(St));
                      Ie((xt) => te(hn, ` ${xt ?? ""}`), [() => Fo()]), D(wt, St);
                    },
                    $$slots: { default: !0 }
                  });
                }
                M(Z), D(Pt, Z);
              }, za = (Pt) => {
                var Z = hb(), ct = T(Z);
                {
                  let kt = P(() => !I.canLoadOlder);
                  ar(ct, {
                    type: "button",
                    variant: "default",
                    className: "post-history-nav-button",
                    contentLayout: "iconText",
                    get disabled() {
                      return r(kt);
                    },
                    onClick: () => void bo(),
                    children: (wt, Gt) => {
                      var St = ub(), hn = H(J(St));
                      Ie((xt) => te(hn, ` ${xt ?? ""}`), [() => Fo()]), D(wt, St);
                    },
                    $$slots: { default: !0 }
                  });
                }
                M(Z), D(Pt, Z);
              }, fa = (Pt) => {
                var Z = gb(), ct = T(Z);
                {
                  var kt = (wt) => {
                    {
                      let Gt = P(() => I.isFetchingFromRelays || I.isRefetchingAroundCurrentView);
                      ar(wt, {
                        type: "button",
                        variant: "primary",
                        className: "post-history-nav-button",
                        contentLayout: "iconText",
                        get disabled() {
                          return r(Gt);
                        },
                        onClick: () => void Bo(),
                        children: (St, hn) => {
                          var xt = Pe(), yr = J(xt);
                          {
                            var lr = (Qn) => {
                              {
                                let Ot = P(() => o()("postHistory.fetchOlderFromRelaysLoading"));
                                Ea(Qn, {
                                  get text() {
                                    return r(Ot);
                                  },
                                  showLoader: !0,
                                  loaderSize: 28,
                                  customClass: "post-history-nav-loading-placeholder"
                                });
                              }
                            }, Hr = (Qn) => {
                              var Ot = fb(), Zt = H(J(Ot));
                              Ie((Rn) => te(Zt, ` ${Rn ?? ""}`), [() => o()("postHistory.fetchOlderFromRelays")]), D(Qn, Ot);
                            };
                            be(yr, (Qn) => {
                              I.isFetchingOlderFromRelays ? Qn(lr) : Qn(Hr, -1);
                            });
                          }
                          D(St, xt);
                        },
                        $$slots: { default: !0 }
                      });
                    }
                  };
                  be(ct, (wt) => {
                    (I.canFetchOlderFromRelays || I.isFetchingFromRelays || I.isRefetchingAroundCurrentView) && wt(kt);
                  });
                }
                M(Z), D(Pt, Z);
              };
              be(nr, (Pt) => {
                I.showSavedPostsBoundary ? Pt(Kr) : I.isSearchMode && I.canLoadOlder ? Pt(ha, 1) : !I.isSearchMode && I.state.hasOlderLocal && (I.state.listingMode === "sparse" || !dn) ? Pt(za, 2) : I.showLocalExhaustedState && Pt(fa, 3);
              });
            }
            D(tt, Ct);
          };
          be(ca, (tt) => {
            I.posts.length === 0 && r(Ln) ? tt(hs) : r(io) ? tt(xi, 1) : tt(Bs, -1);
          });
        }
        M(Qo), Rs(Qo, (tt) => g(Ye, tt), () => r(Ye));
        var ua = H(Qo, 2);
        {
          var Qa = (tt) => {
            var Ct = yb(), Kt = T(Ct);
            {
              let er = P(() => o()("postHistory.returnToLatest"));
              ar(Kt, {
                type: "button",
                variant: "default",
                shape: "circle",
                className: "post-history-latest-button",
                contentLayout: "icon",
                get ariaLabel() {
                  return r(er);
                },
                onClick: () => void fo(),
                children: (tr, no) => {
                  var ro = pb();
                  D(tr, ro);
                },
                $$slots: { default: !0 }
              });
            }
            M(Ct), D(tt, Ct);
          };
          be(ua, (tt) => {
            r(sr) && tt(Qa);
          });
        }
        var fs = H(ua, 2);
        Zu(fs, {
          get open() {
            return r(X);
          },
          get ownerPubkeyHex() {
            return x();
          },
          getCurrentPubkeyHex: () => x(),
          onOpenChange: (tt) => g(X, tt, !0),
          onImported: pe
        });
        var gh = H(fs, 2);
        Mf(gh, {
          get open() {
            return r(ut);
          },
          get rawEvent() {
            return r(pt);
          },
          onOpenChange: (tt) => g(ut, tt, !0)
        }), Ie(() => {
          ko(Qo, 1, `post-history-container${dn && !I.isSearchMode && I.state.listingMode === "contiguous" ? " post-history-auto-load-enabled" : ""}`, "svelte-uxr0i8"), cr(Qo, "aria-busy", r(ir) || r(Pn) ? "true" : "false");
        }), Ss("scroll", Qo, function(...tt) {
          qe.handleHistoryScroll?.apply(this, tt);
        }), D(ce, $t);
      },
      $$slots: { footer: !0, default: !0 }
    });
  }
  var to = H(Sr, 2);
  {
    const h = (tn) => {
      var xn = bb(), Xn = T(xn), pr = T(Xn, !0);
      M(Xn);
      var Or = H(Xn, 2), vo = T(Or, !0);
      M(Or), M(xn), Ie(
        (da, Lr) => {
          te(pr, da), te(vo, Lr);
        },
        [
          () => o()("postHistory.deleteRequestDescription"),
          () => o()("postHistory.deleteRequestWarning")
        ]
      ), D(tn, xn);
    };
    let B = P(() => o()("postHistory.deleteRequestTitle")), ge = P(() => o()("postHistory.deleteRequestDescription")), ce = P(() => ye.deleteTargetPost && Un(ye.deleteTargetPost) ? o()("postHistory.deleteSending") : o()("postHistory.deleteConfirm")), it = P(() => o()("postHistory.deleteCancel")), $t = P(() => ye.deleteTargetPost ? Un(ye.deleteTargetPost) : !1);
    Id(to, {
      get open() {
        return ye.deleteConfirmOpen;
      },
      get onOpenChange() {
        return ye.setDeleteConfirmOpen;
      },
      get title() {
        return r(B);
      },
      get description() {
        return r(ge);
      },
      get confirmLabel() {
        return r(ce);
      },
      get cancelLabel() {
        return r(it);
      },
      confirmVariant: "danger",
      get confirmDisabled() {
        return r($t);
      },
      onConfirm: Nt,
      onCancel: os,
      contentClass: "post-history-delete-confirm",
      children: h,
      $$slots: { default: !0 }
    });
  }
  var go = H(to, 2);
  {
    const h = ($t) => {
      var tn = Cb(), xn = T(tn), Xn = T(xn, !0);
      M(xn), M(tn), Ie((pr) => te(Xn, pr), [() => o()("postHistory.deleteLocalHistoryDescription")]), D($t, tn);
    };
    let B = P(() => o()("postHistory.deleteLocalHistoryTitle")), ge = P(() => o()("postHistory.deleteLocalHistoryDescription")), ce = P(() => o()("postHistory.deleteLocalHistoryConfirm")), it = P(() => o()("postHistory.deleteLocalHistoryCancel"));
    Id(go, {
      get title() {
        return r(B);
      },
      get description() {
        return r(ge);
      },
      get confirmLabel() {
        return r(ce);
      },
      get cancelLabel() {
        return r(it);
      },
      confirmVariant: "danger",
      onConfirm: Dt,
      onCancel: Re,
      closeOnConfirm: !1,
      preventCloseWhileConfirming: !0,
      showConfirmSpinner: !0,
      contentClass: "post-history-local-delete-confirm",
      get open() {
        return r(ue);
      },
      set open($t) {
        g(ue, $t, !0);
      },
      children: h,
      $$slots: { default: !0 }
    });
  }
  var ja = H(go, 2);
  {
    let h = P(() => r(ln)[r(Ke)]?.src ?? ""), B = P(() => r(ln)[r(Ke)]?.alt ?? "");
    gf(ja, {
      get src() {
        return r(h);
      },
      get alt() {
        return r(B);
      },
      onClose: Qe,
      get mediaList() {
        return r(ln);
      },
      get currentIndex() {
        return r(Ke);
      },
      onNavigate: yn,
      get show() {
        return r(ft);
      },
      set show(ge) {
        g(ft, ge, !0);
      }
    });
  }
  var la = H(ja, 2);
  ki(la, {
    get show() {
      return V.showCopyFloatingMessage;
    },
    get x() {
      return V.copyFloatingMessageX;
    },
    get y() {
      return V.copyFloatingMessageY;
    },
    children: (h, B) => {
      var ge = Pb(), ce = T(ge, !0);
      M(ge), Ie((it) => te(ce, it), [() => o()("postHistory.copied")]), D(h, ge);
    },
    $$slots: { default: !0 }
  });
  var ss = H(la, 2);
  ki(ss, {
    get show() {
      return r(ot);
    },
    get x() {
      return r(Ge);
    },
    get y() {
      return r(ne);
    },
    children: (h, B) => {
      var ge = wb(), ce = T(ge, !0);
      M(ge), Ie((it) => te(ce, it), [() => o()(r(It))]), D(h, ge);
    },
    $$slots: { default: !0 }
  });
  var Tr = H(ss, 2);
  ki(Tr, {
    get show() {
      return r(je);
    },
    variant: "top-right",
    children: (h, B) => {
      var ge = xb(), ce = T(ge, !0);
      M(ge), Ie((it) => te(ce, it), [
        () => o()(r(ae), { values: r($e) })
      ]), D(h, ge);
    },
    $$slots: { default: !0 }
  }), D(t, Ko);
  var Ka = zt(Vr);
  return s(), Ka;
}
eu(["click"]);
Wt(
  Ib,
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
  Ib as default
};
