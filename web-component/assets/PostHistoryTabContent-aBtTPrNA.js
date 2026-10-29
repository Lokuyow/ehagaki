import { At as e, B as t, C as n, F as r, G as i, I as a, J as o, M as s, Mt as c, N as l, Nt as u, R as d, T as f, Tt as p, U as m, W as h, X as g, Y as _, Z as v, _ as y, _t as b, a as x, bt as S, ct as C, dt as w, f as T, ft as E, g as D, h as O, ht as k, i as A, jt as j, k as ee, lt as M, n as N, nt as te, o as ne, ot as P, pt as F, q as I, r as L, rt as re, s as R, st as z, t as ie, tt as B, ut as V, v as ae, w as oe, wt as se, yt as ce } from "./index-client-57Odq85c.js";
import { n as le } from "./appRuntimeEnvironment-BvtUCHcA.js";
import { d as ue, f as de, i as H, l as U, n as fe } from "./relayConfigUtils-DD5f1UAM.js";
import { a as pe, d as me, i as he, l as ge, n as W, o as _e, r as ve } from "./postHistoryEventUtils-CUIBkIiy.js";
import { B as ye, C as be, E as xe, F as Se, K as Ce, M as we, N as G, Q as Te, S as K, T as Ee, V as De, W as Oe, X as ke, _ as Ae, dt as je, et as Me, ht as Ne, j as q, l as J, m as Pe, o as Fe, pt as Ie, q as Le, r as Re, s as ze, st as Y, t as Be, tt as X, v as Ve, w as He, x as Ue } from "./LoadingPlaceholder-DK5Hrsgb.js";
import { c as We, g as Ge } from "./legacyImportMarkers-CZ4J2IrE.js";
import { $ as Ke, A as qe, C as Je, H as Ye, I as Xe, J as Ze, N as Qe, O as $e, S as et, T as tt, W as nt, X as rt, Z as it, _ as at, a as ot, at as st, c as Z, ct, dt as lt, ft as ut, it as dt, k as ft, l as pt, m as mt, n as ht, o as gt, ot as _t, p as vt, pt as yt, s as bt, st as xt, u as St, ut as Ct, v as wt, x as Tt, y as Et } from "./nip65RelayDirectory-TQ_KxYYY.js";
import { _ as Dt } from "./signedEventResultValidator-DEUEqBPK.js";
import { f as Ot, h as kt } from "./relayStore.svelte-B2f9GSlJ.js";
import { J as At, Tt as jt, Y as Mt, Z as Nt, c as Q, d as Pt, l as Ft, t as It, u as Lt } from "./appUtils-CwuZyofa.js";
import { n as Rt } from "./settingsStore.svelte-B2FAMvyx.js";
import { n as zt, p as Bt, r as Vt } from "./query-BRdCuyDl.js";
import { $ as Ht, A as Ut, B as Wt, C as Gt, D as Kt, E as qt, F as Jt, H as Yt, I as Xt, L as Zt, N as Qt, O as $t, P as en, Q as tn, S as nn, U as rn, V as an, W as on, Z as sn, a as cn, at as ln, b as un, et as dn, h as fn, it as pn, j as mn, m as hn, n as gn, nt as _n, ot as vn, r as yn, rt as bn, t as xn, tt as Sn, w as Cn, x as wn, z as Tn } from "./sensitiveContentPayloadReader-dMbMHU25.js";
import { i as En } from "./clipboardUtils-LENkGqCk.js";
import { n as Dn } from "./sr-only-styles-6jsaWJLL.js";
import { a as On, i as kn, n as An, o as jn, r as Mn, s as Nn, t as Pn } from "./menu-trigger-gY51qJX1.js";
import { t as Fn } from "./hidden-input-phgH8dJ0.js";
import { o as In } from "./safe-polygon.svelte-BCj9ZrLf.js";
import { t as $ } from "./DialogWrapper-CvCDxqOJ.js";
import { t as Ln } from "./dialog-close-BfZcAfRJ.js";
import { c as Rn, d as zn, t as Bn } from "./customEmoji-BFRq6RB7.js";
import { t as Vn } from "./postMediaCacheService-TNvVICyg.js";
import { Y as Hn, _ as Un, c as Wn, d as Gn, f as Kn, ft as qn, g as Jn, gt as Yn, h as Xn, ht as Zn, m as Qn, mt as $n, p as er, u as tr, ut as nr } from "./App-BWEIk7fu.js";
import { A as rr, C as ir, D as ar, E as or, F as sr, I as cr, M as lr, N as ur, O as dr, P as fr, R as pr, S as mr, T as hr, _ as gr, a as _r, b as vr, c as yr, d as br, f as xr, g as Sr, h as Cr, i as wr, j as Tr, k as Er, l as Dr, m as Or, n as kr, o as Ar, p as jr, r as Mr, s as Nr, t as Pr, u as Fr, v as Ir, w as Lr, x as Rr, y as zr, z as Br } from "./postBroadcastService-t1CJD5y7.js";
import { t as Vr } from "./InfoPopoverButton-dKimDdMq.js";
// D:/ドキュメント/GitHub/ehagaki/node_modules/@internationalized/date/dist/utils.mjs
function Hr(e, t) {
	return e - t * Math.floor(e / t);
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/@internationalized/date/dist/GregorianCalendar.mjs
var Ur = 1721426;
function Wr(e, t, n, r) {
	t = Kr(e, t);
	let i = t - 1, a = -2;
	return n <= 2 ? a = 0 : Gr(t) && (a = -1), 1721425 + 365 * i + Math.floor(i / 4) - Math.floor(i / 100) + Math.floor(i / 400) + Math.floor((367 * n - 362) / 12 + a + r);
}
function Gr(e) {
	return e % 4 == 0 && (e % 100 != 0 || e % 400 == 0);
}
function Kr(e, t) {
	return e === "BC" ? 1 - t : t;
}
function qr(e) {
	let t = "AD";
	return e <= 0 && (t = "BC", e = 1 - e), [t, e];
}
var Jr = {
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
}, Yr = class {
	fromJulianDay(e) {
		let t = e, n = t - Ur, r = Math.floor(n / 146097), i = Hr(n, 146097), a = Math.floor(i / 36524), o = Hr(i, 36524), s = Math.floor(o / 1461), c = Hr(o, 1461), l = Math.floor(c / 365), [u, d] = qr(r * 400 + a * 100 + s * 4 + l + +(a !== 4 && l !== 4)), f = t - Wr(u, d, 1, 1), p = 2;
		t < Wr(u, d, 3, 1) ? p = 0 : Gr(d) && (p = 1);
		let m = Math.floor(((f + p) * 12 + 373) / 367);
		return new va(u, d, m, t - Wr(u, d, m, 1) + 1);
	}
	toJulianDay(e) {
		return Wr(e.era, e.year, e.month, e.day);
	}
	getDaysInMonth(e) {
		return Jr[Gr(e.year) ? "leapyear" : "standard"][e.month - 1];
	}
	getMonthsInYear(e) {
		return 12;
	}
	getDaysInYear(e) {
		return Gr(e.year) ? 366 : 365;
	}
	getYearsInEra(e) {
		return 9999;
	}
	getEras() {
		return ["BC", "AD"];
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
}, Xr = {
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
// D:/ドキュメント/GitHub/ehagaki/node_modules/@internationalized/date/dist/queries.mjs
function Zr(e, t) {
	return t = ki(t, e.calendar), e.era === t.era && e.year === t.year && e.month === t.month && e.day === t.day;
}
function Qr(e, t) {
	return t = ki(t, e.calendar), e = li(e), t = li(t), e.era === t.era && e.year === t.year && e.month === t.month;
}
function $r(e, t) {
	return e.isEqual?.call(e, t) ?? t.isEqual?.call(t, e) ?? e.identifier === t.identifier;
}
var ei = {
	sun: 0,
	mon: 1,
	tue: 2,
	wed: 3,
	thu: 4,
	fri: 5,
	sat: 6
};
function ti(e, t, n) {
	let r = e.calendar.toJulianDay(e), i = n ? ei[n] : mi(t), a = Math.ceil(r + 1 - i) % 7;
	return a < 0 && (a += 7), a;
}
function ni(e) {
	return Ei(Date.now(), e);
}
function ri(e) {
	return Di(ni(e));
}
function ii(e, t) {
	return e.calendar.toJulianDay(e) - t.calendar.toJulianDay(t);
}
function ai(e, t) {
	return oi(e) - oi(t);
}
function oi(e) {
	return e.hour * 36e5 + e.minute * 6e4 + e.second * 1e3 + e.millisecond;
}
var si = null;
function ci() {
	return si ??= new Intl.DateTimeFormat().resolvedOptions().timeZone, si;
}
function li(e) {
	return e.subtract({ days: e.day - 1 });
}
function ui(e) {
	return e.add({ days: e.calendar.getDaysInMonth(e) - e.day });
}
var di = /* @__PURE__ */ new Map(), fi = /* @__PURE__ */ new Map();
function pi(e) {
	if (Intl.Locale) {
		let t = di.get(e);
		return t || (t = new Intl.Locale(e).maximize().region, t && di.set(e, t)), t;
	}
	let t = e.split("-")[1];
	return t === "u" ? void 0 : t;
}
function mi(e) {
	let t = fi.get(e);
	if (!t) {
		if (Intl.Locale) {
			let n = new Intl.Locale(e);
			if ("getWeekInfo" in n && (t = n.getWeekInfo(), t)) return fi.set(e, t), t.firstDay;
		}
		let n = pi(e);
		if (e.includes("-fw-")) {
			let n = e.split("-fw-")[1].split("-")[0];
			t = n === "mon" ? { firstDay: 1 } : n === "tue" ? { firstDay: 2 } : n === "wed" ? { firstDay: 3 } : n === "thu" ? { firstDay: 4 } : n === "fri" ? { firstDay: 5 } : n === "sat" ? { firstDay: 6 } : { firstDay: 0 };
		} else t = e.includes("-ca-iso8601") ? { firstDay: 1 } : { firstDay: n && Xr[n] || 0 };
		fi.set(e, t);
	}
	return t.firstDay;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/@internationalized/date/dist/conversion.mjs
function hi(e) {
	return e = ki(e, new Yr()), gi(Kr(e.era, e.year), e.month, e.day, e.hour, e.minute, e.second, e.millisecond);
}
function gi(e, t, n, r, i, a, o) {
	let s = /* @__PURE__ */ new Date();
	return s.setUTCHours(r, i, a, o), s.setUTCFullYear(e, t - 1, n), s.getTime();
}
function _i(e, t) {
	if (t === "UTC") return 0;
	if (e > 0 && t === ci()) return new Date(e).getTimezoneOffset() * -6e4;
	let { year: n, month: r, day: i, hour: a, minute: o, second: s } = yi(e, t);
	return gi(n, r, i, a, o, s, 0) - Math.floor(e / 1e3) * 1e3;
}
var vi = /* @__PURE__ */ new Map();
function yi(e, t) {
	let n = vi.get(t);
	n || (n = new Intl.DateTimeFormat("en-US", {
		timeZone: t,
		hour12: !1,
		era: "short",
		year: "numeric",
		month: "numeric",
		day: "numeric",
		hour: "numeric",
		minute: "numeric",
		second: "numeric"
	}), vi.set(t, n));
	let r = n.formatToParts(new Date(e)), i = {};
	for (let e of r) e.type !== "literal" && (i[e.type] = e.value);
	return {
		year: i.era === "BC" || i.era === "B" ? -i.year + 1 : +i.year,
		month: +i.month,
		day: +i.day,
		hour: i.hour === "24" ? 0 : +i.hour,
		minute: +i.minute,
		second: +i.second
	};
}
var bi = 864e5;
function xi(e, t) {
	let n = hi(e);
	return Si(e, t, n - _i(n - bi, t), n - _i(n + bi, t));
}
function Si(e, t, n, r) {
	return (n === r ? [n] : [n, r]).filter((n) => Ci(e, t, n));
}
function Ci(e, t, n) {
	let r = yi(n, t);
	return e.year === r.year && e.month === r.month && e.day === r.day && e.hour === r.hour && e.minute === r.minute && e.second === r.second;
}
function wi(e, t, n = "compatible") {
	let r = Oi(e);
	if (t === "UTC") return hi(r);
	if (t === ci() && n === "compatible") {
		r = ki(r, new Yr());
		let e = /* @__PURE__ */ new Date(), t = Kr(r.era, r.year);
		return e.setFullYear(t, r.month - 1, r.day), e.setHours(r.hour, r.minute, r.second, r.millisecond), e.getTime();
	}
	let i = hi(r), a = _i(i - bi, t), o = _i(i + bi, t), s = Si(r, t, i - a, i - o);
	if (s.length === 1) return s[0];
	if (s.length > 1) switch (n) {
		case "compatible":
		case "earlier": return s[0];
		case "later": return s[s.length - 1];
		case "reject": throw RangeError("Multiple possible absolute times found");
	}
	switch (n) {
		case "earlier": return Math.min(i - a, i - o);
		case "compatible":
		case "later": return Math.max(i - a, i - o);
		case "reject": throw RangeError("No such absolute time found");
	}
}
function Ti(e, t, n = "compatible") {
	return new Date(wi(e, t, n));
}
function Ei(e, t) {
	let n = _i(e, t), r = new Date(e + n), i = r.getUTCFullYear(), a = r.getUTCMonth() + 1, o = r.getUTCDate(), s = r.getUTCHours(), c = r.getUTCMinutes(), l = r.getUTCSeconds(), u = r.getUTCMilliseconds();
	return new Sa(i < 1 ? "BC" : "AD", i < 1 ? -i + 1 : i, a, o, t, n, s, c, l, u);
}
function Di(e) {
	return new va(e.calendar, e.era, e.year, e.month, e.day);
}
function Oi(e, t) {
	let n = 0, r = 0, i = 0, a = 0;
	if ("timeZone" in e) ({hour: n, minute: r, second: i, millisecond: a} = e);
	else if ("hour" in e && !t) return e;
	return t && ({hour: n, minute: r, second: i, millisecond: a} = t), new ba(e.calendar, e.era, e.year, e.month, e.day, n, r, i, a);
}
function ki(e, t) {
	if ($r(e.calendar, t)) return e;
	let n = t.fromJulianDay(e.calendar.toJulianDay(e)), r = e.copy();
	return r.calendar = t, r.era = n.era, r.year = n.year, r.month = n.month, r.day = n.day, zi(r), r;
}
function Ai(e, t, n) {
	return e instanceof Sa ? e.timeZone === t ? e : Mi(e, t) : Ei(wi(e, t, n), t);
}
function ji(e) {
	let t = hi(e) - e.offset;
	return new Date(t);
}
function Mi(e, t) {
	return ki(Ei(hi(e) - e.offset, t), e.calendar);
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/@internationalized/date/dist/manipulation.mjs
var Ni = 36e5;
function Pi(e, t) {
	let n = e.copy(), r = "hour" in n ? qi(n, t) : 0;
	Fi(n, t.years || 0), n.calendar.balanceYearMonth && n.calendar.balanceYearMonth(n, e), n.month += t.months || 0, Ii(n), Ri(n), n.day += (t.weeks || 0) * 7, n.day += t.days || 0, n.day += r, Li(n), n.calendar.balanceDate && n.calendar.balanceDate(n), n.year < 1 && (n.year = 1, n.month = 1, n.day = 1);
	let i = n.calendar.getYearsInEra(n);
	if (n.year > i) {
		var a;
		let e = (a = n.calendar).isInverseEra?.call(a, n);
		n.year = i, n.month = e ? 1 : n.calendar.getMonthsInYear(n), n.day = e ? 1 : n.calendar.getDaysInMonth(n);
	}
	n.month < 1 && (n.month = 1, n.day = 1);
	let o = n.calendar.getMonthsInYear(n);
	return n.month > o && (n.month = o, n.day = n.calendar.getDaysInMonth(n)), n.day = Math.max(1, Math.min(n.calendar.getDaysInMonth(n), n.day)), n;
}
function Fi(e, t) {
	var n;
	(n = e.calendar).isInverseEra?.call(n, e) && (t = -t), e.year += t;
}
function Ii(e) {
	for (; e.month < 1;) Fi(e, -1), e.month += e.calendar.getMonthsInYear(e);
	let t = 0;
	for (; e.month > (t = e.calendar.getMonthsInYear(e));) e.month -= t, Fi(e, 1);
}
function Li(e) {
	for (; e.day < 1;) e.month--, Ii(e), e.day += e.calendar.getDaysInMonth(e);
	for (; e.day > e.calendar.getDaysInMonth(e);) e.day -= e.calendar.getDaysInMonth(e), e.month++, Ii(e);
}
function Ri(e) {
	e.month = Math.max(1, Math.min(e.calendar.getMonthsInYear(e), e.month)), e.day = Math.max(1, Math.min(e.calendar.getDaysInMonth(e), e.day));
}
function zi(e) {
	e.calendar.constrainDate && e.calendar.constrainDate(e), e.year = Math.max(1, Math.min(e.calendar.getYearsInEra(e), e.year)), Ri(e);
}
function Bi(e) {
	let t = {};
	for (let n in e) typeof e[n] == "number" && (t[n] = -e[n]);
	return t;
}
function Vi(e, t) {
	return Pi(e, Bi(t));
}
function Hi(e, t) {
	let n = e.copy();
	return t.era != null && (n.era = t.era), t.year != null && (n.year = t.year), t.month != null && (n.month = t.month), t.day != null && (n.day = t.day), zi(n), n;
}
function Ui(e, t) {
	let n = e.copy();
	return t.hour != null && (n.hour = t.hour), t.minute != null && (n.minute = t.minute), t.second != null && (n.second = t.second), t.millisecond != null && (n.millisecond = t.millisecond), Gi(n), n;
}
function Wi(e) {
	e.second += Math.floor(e.millisecond / 1e3), e.millisecond = Ki(e.millisecond, 1e3), e.minute += Math.floor(e.second / 60), e.second = Ki(e.second, 60), e.hour += Math.floor(e.minute / 60), e.minute = Ki(e.minute, 60);
	let t = Math.floor(e.hour / 24);
	return e.hour = Ki(e.hour, 24), t;
}
function Gi(e) {
	e.millisecond = Math.max(0, Math.min(e.millisecond, 1e3)), e.second = Math.max(0, Math.min(e.second, 59)), e.minute = Math.max(0, Math.min(e.minute, 59)), e.hour = Math.max(0, Math.min(e.hour, 23));
}
function Ki(e, t) {
	let n = e % t;
	return n < 0 && (n += t), n;
}
function qi(e, t) {
	return e.hour += t.hours || 0, e.minute += t.minutes || 0, e.second += t.seconds || 0, e.millisecond += t.milliseconds || 0, Wi(e);
}
function Ji(e, t, n, r) {
	let i = e.copy();
	switch (t) {
		case "era": {
			let t = e.calendar.getEras(), a = t.indexOf(e.era);
			if (a < 0) throw Error("Invalid era: " + e.era);
			a = Xi(a, n, 0, t.length - 1, r?.round), i.era = t[a], zi(i);
			break;
		}
		case "year":
			var a;
			(a = i.calendar).isInverseEra?.call(a, i) && (n = -n), i.year = Xi(e.year, n, -Infinity, 9999, r?.round), i.year === -Infinity && (i.year = 1), i.calendar.balanceYearMonth && i.calendar.balanceYearMonth(i, e);
			break;
		case "month":
			i.month = Xi(e.month, n, 1, e.calendar.getMonthsInYear(e), r?.round);
			break;
		case "day":
			i.day = Xi(e.day, n, 1, e.calendar.getDaysInMonth(e), r?.round);
			break;
		default: throw Error("Unsupported field " + t);
	}
	return e.calendar.balanceDate && e.calendar.balanceDate(i), zi(i), i;
}
function Yi(e, t, n, r) {
	let i = e.copy();
	switch (t) {
		case "hour": {
			let t = e.hour, a = 0, o = 23;
			if (r?.hourCycle === 12) {
				let e = t >= 12;
				a = e ? 12 : 0, o = e ? 23 : 11;
			}
			i.hour = Xi(t, n, a, o, r?.round);
			break;
		}
		case "minute":
			i.minute = Xi(e.minute, n, 0, 59, r?.round);
			break;
		case "second":
			i.second = Xi(e.second, n, 0, 59, r?.round);
			break;
		case "millisecond":
			i.millisecond = Xi(e.millisecond, n, 0, 999, r?.round);
			break;
		default: throw Error("Unsupported field " + t);
	}
	return i;
}
function Xi(e, t, n, r, i = !1) {
	if (i) {
		e += Math.sign(t), e < n && (e = r);
		let i = Math.abs(t);
		e = t > 0 ? Math.ceil(e / i) * i : Math.floor(e / i) * i, e > r && (e = n);
	} else e += t, e < n ? e = r - (n - e - 1) : e > r && (e = n + (e - r - 1));
	return e;
}
function Zi(e, t) {
	let n;
	return n = t.years != null && t.years !== 0 || t.months != null && t.months !== 0 || t.weeks != null && t.weeks !== 0 || t.days != null && t.days !== 0 ? wi(Pi(Oi(e), {
		years: t.years,
		months: t.months,
		weeks: t.weeks,
		days: t.days
	}), e.timeZone) : hi(e) - e.offset, n += t.milliseconds || 0, n += (t.seconds || 0) * 1e3, n += (t.minutes || 0) * 6e4, n += (t.hours || 0) * 36e5, ki(Ei(n, e.timeZone), e.calendar);
}
function Qi(e, t) {
	return Zi(e, Bi(t));
}
function $i(e, t, n, r) {
	switch (t) {
		case "hour": {
			let t = 0, i = 23;
			if (r?.hourCycle === 12) {
				let n = e.hour >= 12;
				t = n ? 12 : 0, i = n ? 23 : 11;
			}
			let a = Oi(e), o = ki(Ui(a, { hour: t }), new Yr()), s = [wi(o, e.timeZone, "earlier"), wi(o, e.timeZone, "later")].filter((t) => Ei(t, e.timeZone).day === o.day)[0], c = ki(Ui(a, { hour: i }), new Yr()), l = [wi(c, e.timeZone, "earlier"), wi(c, e.timeZone, "later")].filter((t) => Ei(t, e.timeZone).day === c.day).pop(), u = hi(e) - e.offset, d = Math.floor(u / Ni), f = u % Ni;
			return u = Xi(d, n, Math.floor(s / Ni), Math.floor(l / Ni), r?.round) * Ni + f, ki(Ei(u, e.timeZone), e.calendar);
		}
		case "minute":
		case "second":
		case "millisecond": return Yi(e, t, n, r);
		case "era":
		case "year":
		case "month":
		case "day": return ki(Ei(wi(Ji(Oi(e), t, n, r), e.timeZone), e.timeZone), e.calendar);
		default: throw Error("Unsupported field " + t);
	}
}
function ea(e, t, n) {
	let r = Oi(e), i = Ui(Hi(r, t), t);
	return i.compare(r) === 0 ? e : ki(Ei(wi(i, e.timeZone, n), e.timeZone), e.calendar);
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/@internationalized/date/dist/string.mjs
var ta = /^([+-]\d{6}|\d{4})-(\d{2})-(\d{2})$/, na = /^([+-]\d{6}|\d{4})-(\d{2})-(\d{2})(?:T(\d{2}))?(?::(\d{2}))?(?::(\d{2}))?(\.\d+)?$/, ra = /^([+-]\d{6}|\d{4})-(\d{2})-(\d{2})(?:T(\d{2}))?(?::(\d{2}))?(?::(\d{2}))?(\.\d+)?(?:([+-]\d{2})(?::?(\d{2}))?(?::?(\d{2}))?)?\[(.*?)\]$/, ia = /^([+-]\d{6}|\d{4})-(\d{2})-(\d{2})(?:T(\d{2}))?(?::(\d{2}))?(?::(\d{2}))?(\.\d+)?(?:(?:([+-]\d{2})(?::?(\d{2}))?)|Z)$/;
function aa(e) {
	let t = e.match(ta);
	if (!t) throw ia.test(e) ? Error(`Invalid ISO 8601 date string: ${e}. Use parseAbsolute() instead.`) : Error("Invalid ISO 8601 date string: " + e);
	let n = new va(ca(t[1], 0, 9999), ca(t[2], 1, 12), 1);
	return n.day = ca(t[3], 1, n.calendar.getDaysInMonth(n)), n;
}
function oa(e) {
	let t = e.match(na);
	if (!t) throw ia.test(e) ? Error(`Invalid ISO 8601 date time string: ${e}. Use parseAbsolute() instead.`) : Error("Invalid ISO 8601 date time string: " + e);
	let n = ca(t[1], -9999, 9999), r = new ba(n < 1 ? "BC" : "AD", n < 1 ? -n + 1 : n, ca(t[2], 1, 12), 1, t[4] ? ca(t[4], 0, 23) : 0, t[5] ? ca(t[5], 0, 59) : 0, t[6] ? ca(t[6], 0, 59) : 0, t[7] ? ca(t[7], 0, Infinity) * 1e3 : 0);
	return r.day = ca(t[3], 0, r.calendar.getDaysInMonth(r)), r;
}
function sa(e, t) {
	let n = e.match(ra);
	if (!n) throw Error("Invalid ISO 8601 date time string: " + e);
	let r = ca(n[1], -9999, 9999), i = new Sa(r < 1 ? "BC" : "AD", r < 1 ? -r + 1 : r, ca(n[2], 1, 12), 1, n[11], 0, n[4] ? ca(n[4], 0, 23) : 0, n[5] ? ca(n[5], 0, 59) : 0, n[6] ? ca(n[6], 0, 59) : 0, n[7] ? ca(n[7], 0, Infinity) * 1e3 : 0);
	i.day = ca(n[3], 0, i.calendar.getDaysInMonth(i));
	let a = Oi(i), o;
	if (n[8]) {
		let e = ca(n[8], -23, 23);
		if (i.offset = Math.sign(e) * (Math.abs(e) * 36e5 + ca(n[9] ?? "0", 0, 59) * 6e4 + ca(n[10] ?? "0", 0, 59) * 1e3), o = hi(i) - i.offset, !xi(a, i.timeZone).includes(o)) throw Error(`Offset ${fa(i.offset)} is invalid for ${da(i)} in ${i.timeZone}`);
	} else o = wi(Oi(a), i.timeZone, t);
	return Ei(o, i.timeZone);
}
function ca(e, t, n) {
	let r = Number(e);
	if (r < t || r > n) throw RangeError(`Value out of range: ${t} <= ${r} <= ${n}`);
	return r;
}
function la(e) {
	return `${String(e.hour).padStart(2, "0")}:${String(e.minute).padStart(2, "0")}:${String(e.second).padStart(2, "0")}${e.millisecond ? String(e.millisecond / 1e3).slice(1) : ""}`;
}
function ua(e) {
	let t = ki(e, new Yr()), n;
	return n = t.era === "BC" ? t.year === 1 ? "0000" : "-" + String(Math.abs(1 - t.year)).padStart(6, "00") : String(t.year).padStart(4, "0"), `${n}-${String(t.month).padStart(2, "0")}-${String(t.day).padStart(2, "0")}`;
}
function da(e) {
	return `${ua(e)}T${la(e)}`;
}
function fa(e) {
	let t = Math.sign(e) < 0 ? "-" : "+";
	e = Math.abs(e);
	let n = Math.floor(e / 36e5), r = Math.floor(e % 36e5 / 6e4), i = Math.floor(e % 36e5 % 6e4 / 1e3), a = `${t}${String(n).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
	return i !== 0 && (a += `:${String(i).padStart(2, "0")}`), a;
}
function pa(e) {
	return `${da(e)}${fa(e.offset)}[${e.timeZone}]`;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/@swc/helpers/esm/_check_private_redeclaration.js
function ma(e, t) {
	if (t.has(e)) throw TypeError("Cannot initialize the same private elements twice on an object");
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/@swc/helpers/esm/_class_private_field_init.js
function ha(e, t, n) {
	ma(e, t), t.set(e, n);
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/@internationalized/date/dist/CalendarDate.mjs
function ga(e) {
	let t = typeof e[0] == "object" ? e.shift() : new Yr(), n;
	if (typeof e[0] == "string") n = e.shift();
	else {
		let e = t.getEras();
		n = e[e.length - 1];
	}
	let r = e.shift(), i = e.shift(), a = e.shift();
	return [
		t,
		n,
		r,
		i,
		a
	];
}
var _a = /*#__PURE__*/ new WeakMap(), va = class e {
	copy() {
		return this.era ? new e(this.calendar, this.era, this.year, this.month, this.day) : new e(this.calendar, this.year, this.month, this.day);
	}
	add(e) {
		return Pi(this, e);
	}
	subtract(e) {
		return Vi(this, e);
	}
	set(e) {
		return Hi(this, e);
	}
	cycle(e, t, n) {
		return Ji(this, e, t, n);
	}
	toDate(e) {
		return Ti(this, e);
	}
	toString() {
		return ua(this);
	}
	compare(e) {
		return ii(this, e);
	}
	constructor(...e) {
		ha(this, _a, {
			writable: !0,
			value: void 0
		});
		let [t, n, r, i, a] = ga(e);
		this.calendar = t, this.era = n, this.year = r, this.month = i, this.day = a, zi(this);
	}
}, ya = /*#__PURE__*/ new WeakMap(), ba = class e {
	copy() {
		return this.era ? new e(this.calendar, this.era, this.year, this.month, this.day, this.hour, this.minute, this.second, this.millisecond) : new e(this.calendar, this.year, this.month, this.day, this.hour, this.minute, this.second, this.millisecond);
	}
	add(e) {
		return Pi(this, e);
	}
	subtract(e) {
		return Vi(this, e);
	}
	set(e) {
		return Hi(Ui(this, e), e);
	}
	cycle(e, t, n) {
		switch (e) {
			case "era":
			case "year":
			case "month":
			case "day": return Ji(this, e, t, n);
			default: return Yi(this, e, t, n);
		}
	}
	toDate(e, t) {
		return Ti(this, e, t);
	}
	toString() {
		return da(this);
	}
	compare(e) {
		let t = ii(this, e);
		return t === 0 ? ai(this, Oi(e)) : t;
	}
	constructor(...e) {
		ha(this, ya, {
			writable: !0,
			value: void 0
		});
		let [t, n, r, i, a] = ga(e);
		this.calendar = t, this.era = n, this.year = r, this.month = i, this.day = a, this.hour = e.shift() || 0, this.minute = e.shift() || 0, this.second = e.shift() || 0, this.millisecond = e.shift() || 0, zi(this);
	}
}, xa = /*#__PURE__*/ new WeakMap(), Sa = class e {
	copy() {
		return this.era ? new e(this.calendar, this.era, this.year, this.month, this.day, this.timeZone, this.offset, this.hour, this.minute, this.second, this.millisecond) : new e(this.calendar, this.year, this.month, this.day, this.timeZone, this.offset, this.hour, this.minute, this.second, this.millisecond);
	}
	add(e) {
		return Zi(this, e);
	}
	subtract(e) {
		return Qi(this, e);
	}
	set(e, t) {
		return ea(this, e, t);
	}
	cycle(e, t, n) {
		return $i(this, e, t, n);
	}
	toDate() {
		return ji(this);
	}
	toString() {
		return pa(this);
	}
	toAbsoluteString() {
		return this.toDate().toISOString();
	}
	compare(e) {
		return this.toDate().getTime() - Ai(e, this.timeZone).toDate().getTime();
	}
	constructor(...e) {
		ha(this, xa, {
			writable: !0,
			value: void 0
		});
		let [t, n, r, i, a] = ga(e), o = e.shift(), s = e.shift();
		this.calendar = t, this.era = n, this.year = r, this.month = i, this.day = a, this.timeZone = o, this.offset = s, this.hour = e.shift() || 0, this.minute = e.shift() || 0, this.second = e.shift() || 0, this.millisecond = e.shift() || 0, zi(this);
	}
}, Ca = /* @__PURE__ */ new Map(), wa = class {
	format(e) {
		return this.formatter.format(e);
	}
	formatToParts(e) {
		return this.formatter.formatToParts(e);
	}
	formatRange(e, t) {
		if (typeof this.formatter.formatRange == "function") return this.formatter.formatRange(e, t);
		if (t < e) throw RangeError("End date must be >= start date");
		return `${this.formatter.format(e)} \u{2013} ${this.formatter.format(t)}`;
	}
	formatRangeToParts(e, t) {
		if (typeof this.formatter.formatRangeToParts == "function") return this.formatter.formatRangeToParts(e, t);
		if (t < e) throw RangeError("End date must be >= start date");
		let n = this.formatter.formatToParts(e), r = this.formatter.formatToParts(t);
		return [
			...n.map((e) => ({
				...e,
				source: "startRange"
			})),
			{
				type: "literal",
				value: " – ",
				source: "shared"
			},
			...r.map((e) => ({
				...e,
				source: "endRange"
			}))
		];
	}
	resolvedOptions() {
		let e = this.formatter.resolvedOptions();
		return Aa() && (this.resolvedHourCycle ||= ja(e.locale, this.options), e.hourCycle = this.resolvedHourCycle, e.hour12 = this.resolvedHourCycle === "h11" || this.resolvedHourCycle === "h12"), e.calendar === "ethiopic-amete-alem" && (e.calendar = "ethioaa"), e;
	}
	constructor(e, t = {}) {
		this.formatter = Ea(e, t), this.options = t;
	}
}, Ta = {
	true: { ja: "h11" },
	false: {}
};
function Ea(e, t = {}) {
	if (typeof t.hour12 == "boolean" && Oa()) {
		t = { ...t };
		let n = Ta[String(t.hour12)][e.split("-")[0]], r = t.hour12 ? "h12" : "h23";
		t.hourCycle = n ?? r, delete t.hour12;
	}
	let n = e + (t ? Object.entries(t).sort((e, t) => e[0] < t[0] ? -1 : 1).join() : "");
	if (Ca.has(n)) return Ca.get(n);
	let r = new Intl.DateTimeFormat(e, t);
	return Ca.set(n, r), r;
}
var Da = null;
function Oa() {
	return Da ??= new Intl.DateTimeFormat("en-US", {
		hour: "numeric",
		hour12: !1
	}).format(new Date(2020, 2, 3, 0)) === "24", Da;
}
var ka = null;
function Aa() {
	return ka ??= new Intl.DateTimeFormat("fr", {
		hour: "numeric",
		hour12: !1
	}).resolvedOptions().hourCycle === "h12", ka;
}
function ja(e, t) {
	if (!t.timeStyle && !t.hour) return;
	e = e.replace(/(-u-)?-nu-[a-zA-Z0-9]+/, ""), e += (e.includes("-u-") ? "" : "-u") + "-nu-latn";
	let n = Ea(e, {
		...t,
		timeZone: void 0
	}), r = parseInt(n.formatToParts(new Date(2020, 2, 3, 0)).find((e) => e.type === "hour").value, 10), i = parseInt(n.formatToParts(new Date(2020, 2, 3, 23)).find((e) => e.type === "hour").value, 10);
	if (r === 0 && i === 23) return "h23";
	if (r === 24 && i === 23) return "h24";
	if (r === 0 && i === 11) return "h11";
	if (r === 12 && i === 11) return "h12";
	throw Error("Unexpected hour cycle result");
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/internal/date-time/announcer.js
function Ma(e) {
	if (!J || !e) return null;
	let t = e.querySelector("[data-bits-announcer]"), n = (t) => {
		let n = e.createElement("div");
		return n.role = "log", n.ariaLive = t, n.setAttribute("aria-relevant", "additions"), n;
	};
	if (!Pe(t)) {
		let r = e.createElement("div");
		r.style.cssText = Dn, r.setAttribute("data-bits-announcer", ""), r.appendChild(n("assertive")), r.appendChild(n("polite")), t = r, e.body.insertBefore(t, e.body.firstChild);
	}
	return { getLog: (e) => {
		if (!Pe(t)) return null;
		let n = t.querySelector(`[aria-live="${e}"]`);
		return Pe(n) ? n : null;
	} };
}
function Na(e) {
	let t = Ma(e);
	function n(n, r = "assertive", i = 7500) {
		if (!t || !J || !e) return;
		let a = t.getLog(r), o = e.createElement("div");
		return n = typeof n == "number" ? n.toString() : n === null ? "Empty" : n.trim(), o.innerText = n, r === "assertive" ? a?.replaceChildren(o) : a?.appendChild(o), setTimeout(() => {
			o.remove();
		}, i);
	}
	return { announce: n };
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/internal/date-time/utils.js
var Pa = {
	defaultValue: void 0,
	granularity: "day"
};
function Fa(e) {
	let { defaultValue: t, granularity: n, minValue: r, maxValue: i } = {
		...Pa,
		...e
	};
	if (Array.isArray(t) && t.length) return t[t.length - 1];
	if (t && !Array.isArray(t)) return t;
	{
		let e = /* @__PURE__ */ new Date();
		r && e < r.toDate(ci()) ? e = r.toDate(ci()) : i && e > i.toDate(ci()) && (e = i.toDate(ci()));
		let t = e.getFullYear(), a = e.getMonth() + 1, o = e.getDate();
		return [
			"hour",
			"minute",
			"second"
		].includes(n ?? "day") ? new ba(t, a, o, 0, 0, 0) : new va(t, a, o);
	}
}
function Ia(e, t) {
	let n;
	return n = t instanceof Sa ? sa(e) : t instanceof ba ? oa(e) : aa(e), n.calendar === t.calendar ? n : ki(n, t.calendar);
}
function La(e, t = ci()) {
	return e instanceof Sa ? e.toDate() : e.toDate(t);
}
function Ra(e) {
	if (e instanceof va) return "date";
	if (e instanceof ba) return "datetime";
	if (e instanceof Sa) return "zoneddatetime";
	throw Error("Unknown date type");
}
function za(e, t) {
	switch (t) {
		case "date": return aa(e);
		case "datetime": return oa(e);
		case "zoneddatetime": return sa(e);
		default: throw Error(`Unknown date type: ${t}`);
	}
}
function Ba(e) {
	return e instanceof ba;
}
function Va(e) {
	return e instanceof Sa;
}
function Ha(e) {
	return Ba(e) || Va(e);
}
function Ua(e) {
	if (e instanceof Date) {
		let t = e.getFullYear(), n = e.getMonth() + 1;
		return new Date(t, n, 0).getDate();
	}
	return e.set({ day: 100 }).day;
}
function Wa(e, t) {
	return e.compare(t) < 0;
}
function Ga(e, t) {
	return e.compare(t) > 0;
}
function Ka(e, t, n) {
	let r = ti(e, n);
	return t > r ? e.subtract({ days: r + 7 - t }) : t === r ? e : e.subtract({ days: r - t });
}
function qa(e, t, n) {
	let r = ti(e, n), i = t === 0 ? 6 : t - 1;
	return r === i ? e : r > i ? e.add({ days: 7 - r + i }) : e.add({ days: i - r });
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/internal/date-time/field/parts.js
var Ja = [
	"day",
	"month",
	"year"
], Ya = [
	"hour",
	"minute",
	"second",
	"dayPeriod"
], Xa = ["literal", "timeZoneName"], Za = [...Ja, ...Ya], Qa = [...Za, ...Xa], $a = [...Ya, ...Xa];
Qa.filter((e) => e !== "literal"), $a.filter((e) => e !== "literal");
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/internal/date-time/placeholders.js
var eo = /* @__PURE__ */ "ach.af.am.an.ar.ast.az.be.bg.bn.br.bs.ca.cak.ckb.cs.cy.da.de.dsb.el.en.eo.es.et.eu.fa.ff.fi.fr.fy.ga.gd.gl.he.hr.hsb.hu.ia.id.it.ja.ka.kk.kn.ko.lb.lo.lt.lv.meh.ml.ms.nl.nn.no.oc.pl.pt.rm.ro.ru.sc.scn.sk.sl.sr.sv.szl.tg.th.tr.uk.zh-CN.zh-TW".split("."), to = [
	"year",
	"month",
	"day"
], no = {
	ach: {
		year: "mwaka",
		month: "dwe",
		day: "nino"
	},
	af: {
		year: "jjjj",
		month: "mm",
		day: "dd"
	},
	am: {
		year: "ዓዓዓዓ",
		month: "ሚሜ",
		day: "ቀቀ"
	},
	an: {
		year: "aaaa",
		month: "mm",
		day: "dd"
	},
	ar: {
		year: "سنة",
		month: "شهر",
		day: "يوم"
	},
	ast: {
		year: "aaaa",
		month: "mm",
		day: "dd"
	},
	az: {
		year: "iiii",
		month: "aa",
		day: "gg"
	},
	be: {
		year: "гггг",
		month: "мм",
		day: "дд"
	},
	bg: {
		year: "гггг",
		month: "мм",
		day: "дд"
	},
	bn: {
		year: "yyyy",
		month: "মিমি",
		day: "dd"
	},
	br: {
		year: "bbbb",
		month: "mm",
		day: "dd"
	},
	bs: {
		year: "gggg",
		month: "mm",
		day: "dd"
	},
	ca: {
		year: "aaaa",
		month: "mm",
		day: "dd"
	},
	cak: {
		year: "jjjj",
		month: "ii",
		day: "q'q'"
	},
	ckb: {
		year: "ساڵ",
		month: "مانگ",
		day: "ڕۆژ"
	},
	cs: {
		year: "rrrr",
		month: "mm",
		day: "dd"
	},
	cy: {
		year: "bbbb",
		month: "mm",
		day: "dd"
	},
	da: {
		year: "åååå",
		month: "mm",
		day: "dd"
	},
	de: {
		year: "jjjj",
		month: "mm",
		day: "tt"
	},
	dsb: {
		year: "llll",
		month: "mm",
		day: "źź"
	},
	el: {
		year: "εεεε",
		month: "μμ",
		day: "ηη"
	},
	en: {
		year: "yyyy",
		month: "mm",
		day: "dd"
	},
	eo: {
		year: "jjjj",
		month: "mm",
		day: "tt"
	},
	es: {
		year: "aaaa",
		month: "mm",
		day: "dd"
	},
	et: {
		year: "aaaa",
		month: "kk",
		day: "pp"
	},
	eu: {
		year: "uuuu",
		month: "hh",
		day: "ee"
	},
	fa: {
		year: "سال",
		month: "ماه",
		day: "روز"
	},
	ff: {
		year: "hhhh",
		month: "ll",
		day: "ññ"
	},
	fi: {
		year: "vvvv",
		month: "kk",
		day: "pp"
	},
	fr: {
		year: "aaaa",
		month: "mm",
		day: "jj"
	},
	fy: {
		year: "jjjj",
		month: "mm",
		day: "dd"
	},
	ga: {
		year: "bbbb",
		month: "mm",
		day: "ll"
	},
	gd: {
		year: "bbbb",
		month: "mm",
		day: "ll"
	},
	gl: {
		year: "aaaa",
		month: "mm",
		day: "dd"
	},
	he: {
		year: "שנה",
		month: "חודש",
		day: "יום"
	},
	hr: {
		year: "gggg",
		month: "mm",
		day: "dd"
	},
	hsb: {
		year: "llll",
		month: "mm",
		day: "dd"
	},
	hu: {
		year: "éééé",
		month: "hh",
		day: "nn"
	},
	ia: {
		year: "aaaa",
		month: "mm",
		day: "dd"
	},
	id: {
		year: "tttt",
		month: "bb",
		day: "hh"
	},
	it: {
		year: "aaaa",
		month: "mm",
		day: "gg"
	},
	ja: {
		year: " 年 ",
		month: "月",
		day: "日"
	},
	ka: {
		year: "წწწწ",
		month: "თთ",
		day: "რრ"
	},
	kk: {
		year: "жжжж",
		month: "аа",
		day: "кк"
	},
	kn: {
		year: "ವವವವ",
		month: "ಮಿಮೀ",
		day: "ದಿದಿ"
	},
	ko: {
		year: "연도",
		month: "월",
		day: "일"
	},
	lb: {
		year: "jjjj",
		month: "mm",
		day: "dd"
	},
	lo: {
		year: "ປປປປ",
		month: "ດດ",
		day: "ວວ"
	},
	lt: {
		year: "mmmm",
		month: "mm",
		day: "dd"
	},
	lv: {
		year: "gggg",
		month: "mm",
		day: "dd"
	},
	meh: {
		year: "aaaa",
		month: "mm",
		day: "dd"
	},
	ml: {
		year: "വർഷം",
		month: "മാസം",
		day: "തീയതി"
	},
	ms: {
		year: "tttt",
		month: "mm",
		day: "hh"
	},
	nl: {
		year: "jjjj",
		month: "mm",
		day: "dd"
	},
	nn: {
		year: "åååå",
		month: "mm",
		day: "dd"
	},
	no: {
		year: "åååå",
		month: "mm",
		day: "dd"
	},
	oc: {
		year: "aaaa",
		month: "mm",
		day: "jj"
	},
	pl: {
		year: "rrrr",
		month: "mm",
		day: "dd"
	},
	pt: {
		year: "aaaa",
		month: "mm",
		day: "dd"
	},
	rm: {
		year: "oooo",
		month: "mm",
		day: "dd"
	},
	ro: {
		year: "aaaa",
		month: "ll",
		day: "zz"
	},
	ru: {
		year: "гггг",
		month: "мм",
		day: "дд"
	},
	sc: {
		year: "aaaa",
		month: "mm",
		day: "dd"
	},
	scn: {
		year: "aaaa",
		month: "mm",
		day: "jj"
	},
	sk: {
		year: "rrrr",
		month: "mm",
		day: "dd"
	},
	sl: {
		year: "llll",
		month: "mm",
		day: "dd"
	},
	sr: {
		year: "гггг",
		month: "мм",
		day: "дд"
	},
	sv: {
		year: "åååå",
		month: "mm",
		day: "dd"
	},
	szl: {
		year: "rrrr",
		month: "mm",
		day: "dd"
	},
	tg: {
		year: "сссс",
		month: "мм",
		day: "рр"
	},
	th: {
		year: "ปปปป",
		month: "ดด",
		day: "วว"
	},
	tr: {
		year: "yyyy",
		month: "aa",
		day: "gg"
	},
	uk: {
		year: "рррр",
		month: "мм",
		day: "дд"
	},
	"zh-CN": {
		year: "年",
		month: "月",
		day: "日"
	},
	"zh-TW": {
		year: "年",
		month: "月",
		day: "日"
	}
};
function ro(e) {
	if (ao(e)) return no[e];
	{
		let t = lo(e);
		return ao(t) ? no[t] : no.en;
	}
}
function io(e, t, n) {
	return oo(e) ? ro(n)[e] : co(e) ? t : so(e) ? "––" : "";
}
function ao(e) {
	return eo.includes(e);
}
function oo(e) {
	return to.includes(e);
}
function so(e) {
	return e === "hour" || e === "minute" || e === "second";
}
function co(e) {
	return e === "era" || e === "dayPeriod";
}
function lo(e) {
	return Intl.Locale ? new Intl.Locale(e).language : e.split("-")[0];
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/internal/date-time/field/helpers.js
function uo(e) {
	let t = [
		"hour",
		"minute",
		"second"
	], n = Za.map((e) => e === "dayPeriod" ? [e, "AM"] : [e, null]).filter(([n]) => n === "literal" || n === null ? !1 : e !== "day" || !t.includes(n));
	return Object.fromEntries(n);
}
function fo(e) {
	let { segmentValues: t, formatter: n, locale: r, dateRef: i } = e, a = Object.keys(t).reduce((e, n) => {
		if (!vo(n)) return e;
		if ("hour" in t && n === "dayPeriod") {
			let i = t[n];
			e[n] = Ae(i) ? io(n, "AM", r) : i;
		} else e[n] = o(n);
		return e;
	}, {});
	function o(a) {
		if (a === "day" && Ae(t.month) && !Ae(t.day)) {
			let e = Number.parseInt(t.day);
			if (e >= 1 && e <= 31) return t.day.startsWith("0") && `${e}`.length === 1 ? `0${e}` : `${e}`;
		}
		if ("hour" in t) {
			let o = t[a], s = typeof o == "string" && o?.startsWith("0"), c = o === null ? null : Number.parseInt(o);
			if (o === "0" && a !== "year") return "0";
			if (!Ae(o) && !Ae(c)) {
				let l = n.part(Mo(a, i, t).set({ [a]: o }), a, { hourCycle: e.hourCycle === 24 ? "h23" : void 0 }), u = e.hourCycle === 12 || e.hourCycle === void 0 && No(r) === 12;
				if (a === "hour" && u) {
					if (c > 12) {
						let e = c - 12;
						return e === 0 ? "12" : e < 10 ? `0${e}` : `${e}`;
					}
					return c === 0 ? "12" : c < 10 ? `0${c}` : `${c}`;
				}
				return a === "year" ? `${o}` : s && l.length === 1 ? `0${l}` : l;
			}
			return io(a, "", r);
		}
		if (_o(a)) {
			let e = t[a], o = typeof e == "string" && e?.startsWith("0");
			if (e === "0") return "0";
			if (Ae(e)) return io(a, "", r);
			{
				let r = n.part(Mo(a, i, t).set({ [a]: e }), a);
				return a === "year" ? `${e}` : o && r.length === 1 ? `0${r}` : r;
			}
		}
		return "";
	}
	return a;
}
function po(e) {
	let { granularity: t, dateRef: n, formatter: r, contentObj: i, hideTimeZone: a, hourCycle: o } = e;
	return r.toParts(n, ho(t, o)).map((e) => [
		"literal",
		"dayPeriod",
		"timeZoneName",
		null
	].includes(e.type) || !vo(e.type) ? {
		part: e.type,
		value: e.value
	} : {
		part: e.type,
		value: i[e.type]
	}).filter((e) => !(Ae(e.part) || Ae(e.value) || e.part === "timeZoneName" && (!Va(n) || a)));
}
function mo(e) {
	let t = fo(e);
	return {
		obj: t,
		arr: po({
			contentObj: t,
			...e
		})
	};
}
function ho(e, t) {
	let n = {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		timeZoneName: "short",
		hourCycle: t === 24 ? "h23" : void 0,
		hour12: t !== 24 && void 0
	};
	return e === "day" && (delete n.second, delete n.hour, delete n.minute, delete n.timeZoneName), e === "hour" && delete n.minute, e === "minute" && delete n.second, n;
}
function go() {
	return Za.reduce((e, t) => (e[t] = {
		lastKeyZero: !1,
		hasLeftFocus: !0,
		updating: null
	}, e), {});
}
function _o(e) {
	return Ja.includes(e);
}
function vo(e) {
	return Za.includes(e);
}
function yo(e) {
	return Qa.includes(e);
}
function bo(e) {
	return !J || !e ? [] : Uo(e).map((e) => e.dataset.segment).filter((e) => Za.includes(e));
}
var xo = [
	"year",
	"month",
	"day",
	"hour",
	"minute",
	"second",
	"dayPeriod"
];
function So(e) {
	let t = xo.indexOf(e);
	return t === -1 ? xo.length : t;
}
function Co(e) {
	let { segmentObj: t, fieldNode: n, dateRef: r } = e, i = bo(n).sort((e, t) => So(e) - So(t)), a = r;
	for (let e of i) if ("hour" in t) {
		let n = t[e];
		if (Ae(n)) continue;
		a = a.set({ [e]: t[e] });
	} else if (_o(e)) {
		let n = t[e];
		if (Ae(n)) continue;
		a = a.set({ [e]: t[e] });
	}
	return a;
}
function wo(e, t) {
	let n = bo(t);
	for (let t of n) if ("hour" in e) {
		if (e[t] === null) return !1;
	} else if (_o(t) && e[t] === null) return !1;
	return !0;
}
function To(e) {
	return typeof e != "object" || !e ? !1 : Object.entries(e).every(([e, t]) => (Ya.includes(e) || Ja.includes(e)) && (e === "dayPeriod" ? t === "AM" || t === "PM" || t === null : typeof t == "string" || typeof t == "number" || t === null));
}
function Eo(e, t) {
	return t || (Ha(e) ? "minute" : "day");
}
function Do(e) {
	return !!([
		"Enter",
		"ArrowUp",
		"ArrowDown",
		"ArrowLeft",
		"ArrowRight",
		"Backspace",
		" "
	].includes(e) || Ve(e));
}
function Oo(e, t) {
	if (!J) return !1;
	let n = Uo(t);
	return n.length ? n[0].id === e : !1;
}
function ko(e) {
	let { id: t, formatter: n, value: r, doc: i } = e;
	if (!J) return;
	let a = n.selectedDate(r), o = i.getElementById(t);
	if (o) o.innerText = `Selected Date: ${a}`;
	else {
		let e = i.createElement("div");
		e.style.cssText = X({ display: "none" }), e.id = t, e.innerText = `Selected Date: ${a}`, i.body.appendChild(e);
	}
}
function Ao(e, t) {
	if (!J) return;
	let n = t.getElementById(e);
	n && t.body.removeChild(n);
}
function jo(e, t) {
	return e ? Ua(t.set({ month: Number.parseInt(e) })) : 31;
}
function Mo(e, t, n) {
	if (e !== "day") return t;
	let r = t;
	return Ae(n.year) || (r = r.set({ year: Number.parseInt(n.year) })), Ae(n.month) || (r = r.set({ month: Number.parseInt(n.month) })), r;
}
function No(e) {
	return new Intl.DateTimeFormat(e, { hour: "numeric" }).formatToParts(/* @__PURE__ */ new Date("2023-01-01T13:00:00")).find((e) => e.type === "hour")?.value === "1" ? 12 : 24;
}
function Po(e, t) {
	let n = Number.parseInt(e);
	return Number.isNaN(n) ? e : t === "AM" ? n === 12 ? "0" : `${n}` : n < 12 ? `${n + 12}` : `${n}`;
}
function Fo(e) {
	if (e === null) return e;
	let t = Number.parseInt(e);
	return Number.isNaN(t) ? e : t === 0 ? "12" : t > 12 ? `${t - 12}` : e;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/internal/date-time/field/segments.js
function Io(e, t) {
	let n = e.currentTarget;
	if (!Pe(n)) return;
	let { prev: r, next: i } = zo(n, t);
	if (e.key === "ArrowLeft") {
		if (!r) return;
		r.focus();
	} else if (e.key === "ArrowRight") {
		if (!i) return;
		i.focus();
	}
}
function Lo(e, t) {
	let n = t.indexOf(e);
	return n === t.length - 1 || n === -1 ? null : t[n + 1];
}
function Ro(e, t) {
	let n = t.indexOf(e);
	return n === 0 || n === -1 ? null : t[n - 1];
}
function zo(e, t) {
	let n = Uo(t);
	return n.length ? {
		next: Lo(e, n),
		prev: Ro(e, n)
	} : {
		next: null,
		prev: null
	};
}
function Bo(e, t) {
	let n = e.currentTarget;
	if (!Pe(n)) return;
	let { next: r } = zo(n, t);
	r && r.focus();
}
function Vo(e, t) {
	let n = e.currentTarget;
	if (!Pe(n)) return;
	let { prev: r } = zo(n, t);
	r && r.focus();
}
function Ho(e) {
	return e === "ArrowRight" || e === "ArrowLeft";
}
function Uo(e) {
	return e ? Array.from(e.querySelectorAll("[data-segment]")).filter((e) => {
		if (!Pe(e)) return !1;
		let t = e.dataset.segment;
		return t === "trigger" || !(!yo(t) || t === "literal");
	}) : [];
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/internal/date-time/formatter.js
var Wo = {
	year: "numeric",
	month: "numeric",
	day: "numeric",
	hour: "numeric",
	minute: "numeric",
	second: "numeric"
};
function Go(e) {
	let t = e.initialLocale;
	function n(e) {
		t = e;
	}
	function r() {
		return t;
	}
	function i(e, n) {
		return new wa(t, n).format(e);
	}
	function a(e, t = !0) {
		return Ha(e) && t ? i(La(e), {
			dateStyle: "long",
			timeStyle: "long"
		}) : i(La(e), { dateStyle: "long" });
	}
	function o(n) {
		return typeof e.monthFormat.current != "function" && typeof e.yearFormat.current != "function" ? new wa(t, {
			month: e.monthFormat.current,
			year: e.yearFormat.current
		}).format(n) : `${typeof e.monthFormat.current == "function" ? e.monthFormat.current(n.getMonth() + 1) : new wa(t, { month: e.monthFormat.current }).format(n)} ${typeof e.yearFormat.current == "function" ? e.yearFormat.current(n.getFullYear()) : new wa(t, { year: e.yearFormat.current }).format(n)}`;
	}
	function s(e) {
		return new wa(t, { month: "long" }).format(e);
	}
	function c(e) {
		return new wa(t, { year: "numeric" }).format(e);
	}
	function l(e, n) {
		return Va(e) ? new wa(t, {
			...n,
			timeZone: e.timeZone
		}).formatToParts(La(e)) : new wa(t, n).formatToParts(La(e));
	}
	function u(e, n = "narrow") {
		return new wa(t, { weekday: n }).format(e);
	}
	function d(e, n = void 0) {
		return new wa(t, {
			hour: "numeric",
			minute: "numeric",
			hourCycle: n === 24 ? "h23" : void 0
		}).formatToParts(e).find((e) => e.type === "dayPeriod")?.value === "PM" ? "PM" : "AM";
	}
	function f(e, t, n = {}) {
		let r = l(e, {
			...Wo,
			...n
		}).find((e) => e.type === t);
		return r ? r.value : "";
	}
	return {
		setLocale: n,
		getLocale: r,
		fullMonth: s,
		fullYear: c,
		fullMonthAndYear: o,
		toParts: l,
		custom: i,
		part: f,
		dayPeriod: d,
		selectedDate: a,
		dayOfWeek: u
	};
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/internal/date-time/calendar-helpers.svelte.js
function Ko(e) {
	return !(!Pe(e) || !e.hasAttribute("data-bits-day"));
}
function qo(e, t) {
	let n = [], r = e.add({ days: 1 }), i = t;
	for (; r.compare(i) < 0;) n.push(r), r = r.add({ days: 1 });
	return n;
}
function Jo(e) {
	let { dateObj: t, weekStartsOn: n, fixedWeeks: r, locale: i } = e, a = Ua(t), o = Array.from({ length: a }, (e, n) => t.set({ day: n + 1 })), s = li(t), c = ui(t), l = n === void 0 ? Ka(s, 0, i) : Ka(s, n, "en-US"), u = n === void 0 ? qa(c, 0, i) : qa(c, n, "en-US"), d = qo(l.subtract({ days: 1 }), s), f = qo(c, u.add({ days: 1 })), p = d.length + o.length + f.length;
	if (r && p < 42) {
		let e = 42 - p, n = f[f.length - 1];
		n ||= t.add({ months: 1 }).set({ day: 1 });
		let r = e;
		f.length === 0 && (r = e - 1, f.push(n));
		let i = Array.from({ length: r }, (e, t) => {
			let r = t + 1;
			return n.add({ days: r });
		});
		f.push(...i);
	}
	let m = d.concat(o, f);
	return {
		value: t,
		dates: m,
		weeks: jn(m, 7)
	};
}
function Yo(e) {
	let { numberOfMonths: t, dateObj: n, ...r } = e, i = [];
	if (!t || t === 1) return i.push(Jo({
		...r,
		dateObj: n
	})), i;
	i.push(Jo({
		...r,
		dateObj: n
	}));
	for (let e = 1; e < t; e++) {
		let t = n.add({ months: e });
		i.push(Jo({
			...r,
			dateObj: t
		}));
	}
	return i;
}
function Xo(e) {
	return e ? Array.from(e.querySelectorAll("[data-bits-day]:not([data-disabled]):not([data-outside-visible-months])")).filter((e) => Pe(e)) : [];
}
function Zo(e, t) {
	let n = e.getAttribute("data-value");
	n && (t.current = Ia(n, t.current));
}
function Qo({ node: e, add: t, useCalendarDayOffset: n = !1, placeholder: r, calendarNode: i, isPrevButtonDisabled: a, isNextButtonDisabled: o, months: s, numberOfMonths: c }) {
	let l = Xo(i);
	if (!l.length) return;
	if (n) {
		let n = e.getAttribute("data-value");
		if (!n) return;
		let a = Ia(n, r.current).add({ days: t }), o = Array.from(i?.querySelectorAll("[data-bits-day]:not([data-outside-visible-months])") ?? []).map((e) => e.getAttribute("data-value")).filter((e) => e !== null);
		for (; o.includes(a.toString());) {
			let e = l.find((e) => e.getAttribute("data-value") === a.toString());
			if (e) return Zo(e, r), e.focus();
			a = a.add({ days: t });
		}
	}
	let u = l.indexOf(e) + t;
	if (Nn(u, l)) {
		let e = l[u];
		return Zo(e, r), e.focus();
	}
	if (u < 0) {
		if (a) return;
		let e = s[0]?.value;
		if (!e) return;
		r.current = e.subtract({ months: c }), Ce(() => {
			let e = Xo(i);
			if (!e.length) return;
			let t = e.length - Math.abs(u);
			if (Nn(t, e)) {
				let n = e[t];
				return Zo(n, r), n.focus();
			}
		});
	}
	if (u >= l.length) {
		if (o) return;
		let e = s[0]?.value;
		if (!e) return;
		r.current = e.add({ months: c }), Ce(() => {
			let e = Xo(i);
			if (!e.length) return;
			let t = u - l.length;
			if (Nn(t, e)) return e[t].focus();
		});
	}
}
var $o = [
	Ue,
	He,
	K,
	be
], es = [xe, " "];
function ts({ event: e, handleCellClick: t, shiftFocus: n, placeholderValue: r }) {
	let i = e.target;
	if (!Ko(i) || !$o.includes(e.key) && !es.includes(e.key)) return;
	e.preventDefault();
	let a = {
		[Ue]: 7,
		[He]: -7,
		[K]: -1,
		[be]: 1
	};
	if ($o.includes(e.key)) {
		let t = a[e.key];
		t !== void 0 && n(i, t);
	}
	if (es.includes(e.key)) {
		let n = i.getAttribute("data-value");
		if (!n) return;
		t(e, Ia(n, r));
	}
}
function ns({ months: e, setMonths: t, numberOfMonths: n, pagedNavigation: r, weekStartsOn: i, locale: a, fixedWeeks: o, setPlaceholder: s }) {
	let c = e[0]?.value;
	if (c) {
		if (r) s(c.add({ months: n }));
		else {
			let e = c.add({ months: 1 }), r = Yo({
				dateObj: e,
				weekStartsOn: i,
				locale: a,
				fixedWeeks: o,
				numberOfMonths: n
			});
			s(e), t(r);
		}
	}
}
function rs({ months: e, setMonths: t, numberOfMonths: n, pagedNavigation: r, weekStartsOn: i, locale: a, fixedWeeks: o, setPlaceholder: s }) {
	let c = e[0]?.value;
	if (c) {
		if (r) s(c.subtract({ months: n }));
		else {
			let e = c.subtract({ months: 1 }), r = Yo({
				dateObj: e,
				weekStartsOn: i,
				locale: a,
				fixedWeeks: o,
				numberOfMonths: n
			});
			s(e), t(r);
		}
	}
}
function is({ months: e, formatter: t, weekdayFormat: n }) {
	if (!e.length) return [];
	let r = e[0].weeks[0];
	return r ? r.map((e) => t.dayOfWeek(La(Di(e)), n)) : [];
}
function as(e) {
	z(() => {
		let t = e.weekStartsOn.current, n = e.locale.current, r = e.fixedWeeks.current, i = e.numberOfMonths.current;
		re(() => {
			let a = e.placeholder.current;
			if (!a) return;
			let o = {
				weekStartsOn: t,
				locale: n,
				fixedWeeks: r,
				numberOfMonths: i
			};
			e.setMonths(Yo({
				...o,
				dateObj: a
			}));
		});
	});
}
function os({ calendarNode: e, label: t, accessibleHeadingId: n }) {
	let r = Oe(e), i = r.createElement("div");
	i.style.cssText = X({
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
	let a = r.createElement("div");
	return a.textContent = t, a.id = n, a.role = "heading", a.ariaLevel = "2", e.insertBefore(i, e.firstChild), i.appendChild(a), () => {
		let e = r.getElementById(n);
		e && (i.parentElement?.removeChild(i), e.remove());
	};
}
function ss({ placeholder: e, getVisibleMonths: t, weekStartsOn: n, locale: r, fixedWeeks: i, numberOfMonths: a, setMonths: o }) {
	z(() => {
		e.current, re(() => {
			t().some((t) => Qr(t, e.current)) || o(Yo({
				weekStartsOn: n.current,
				locale: r.current,
				fixedWeeks: i.current,
				numberOfMonths: a.current,
				dateObj: e.current
			}));
		});
	});
}
function cs({ maxValue: e, months: t, disabled: n }) {
	if (!e || !t.length) return !1;
	if (n) return !0;
	let r = t[t.length - 1]?.value;
	return r ? Ga(r.add({ months: 1 }).set({ day: 1 }), e) : !1;
}
function ls({ minValue: e, months: t, disabled: n }) {
	if (!e || !t.length) return !1;
	if (n) return !0;
	let r = t[0]?.value;
	return r ? Wa(r.subtract({ months: 1 }).set({ day: 35 }), e) : !1;
}
function us({ months: e, locale: t, formatter: n }) {
	if (!e.length) return "";
	if (t !== n.getLocale() && n.setLocale(t), e.length === 1) {
		let t = La(Di(e[0].value));
		return `${n.fullMonthAndYear(t)}`;
	}
	let r = La(Di(e[0].value)), i = La(Di(e[e.length - 1].value)), a = n.fullMonth(r), o = n.fullMonth(i), s = n.fullYear(r), c = n.fullYear(i);
	return s === c ? `${a} - ${o} ${c}` : `${a} ${s} - ${o} ${c}`;
}
function ds({ fullCalendarLabel: e, id: t, isInvalid: n, disabled: r, readonly: i }) {
	return {
		id: t,
		role: "application",
		"aria-label": e,
		"data-invalid": q(n),
		"data-disabled": q(r),
		"data-readonly": q(i)
	};
}
function fs(e) {
	if (e.defaultPrevented) return;
	let t = Oe(e.target).querySelector("[data-bits-day][data-focused]");
	t && (e.preventDefault(), t?.focus());
}
function ps(e) {
	if (!J) return;
	let t = Array.from(e.querySelectorAll("[data-bits-day]:not([aria-disabled=true])"));
	if (t.length === 0) return;
	let n = t[0], r = n?.getAttribute("data-value"), i = n?.getAttribute("data-type");
	if (r && i) return za(r, i);
}
function ms(e, t, n) {
	if (!e || !n(e)) return e;
	for (let e of t) {
		let t = e.dates.find((t) => Qr(t, e.value) && !n(t));
		if (t) return t;
	}
	return e;
}
function hs({ ref: e, placeholder: t, defaultPlaceholder: n, minValue: r, maxValue: i, isDateDisabled: a }) {
	function o(e) {
		return !!(a.current(e) || r.current && Wa(e, r.current) || i.current && Wa(i.current, e));
	}
	ke(() => e.current, () => {
		e.current && t.current && Zr(t.current, n) && o(n) && (t.current = ps(e.current) ?? n);
	});
}
function gs(e, t) {
	return !e || !t ? e : Ha(e) && Ha(t) ? e.set({
		hour: t.hour,
		minute: t.minute,
		millisecond: t.millisecond,
		second: t.second
	}) : e;
}
var _s = Se({
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
function vs(e) {
	let t = (/* @__PURE__ */ new Date()).getFullYear(), n = Math.max(e.placeholderYear, t), r, i;
	if (e.minValue) r = e.minValue.year;
	else {
		let t = n - 100;
		r = e.placeholderYear < t ? e.placeholderYear - 10 : t;
	}
	i = e.maxValue ? e.maxValue.year : n + 10, r > i && (r = i);
	let a = i - r + 1;
	return Array.from({ length: a }, (e, t) => r + t);
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/calendar/calendar.svelte.js
var ys = new Te("Calendar.Root | RangeCalender.Root"), bs = class e {
	static create(t) {
		return ys.set(new e(t));
	}
	opts;
	#e = S(() => this.months.map((e) => e.value));
	get visibleMonths() {
		return B(this.#e);
	}
	set visibleMonths(e) {
		k(this.#e, e);
	}
	#t = S(() => (this.months, ri(ci())));
	get todayDate() {
		return B(this.#t);
	}
	set todayDate(e) {
		k(this.#t, e);
	}
	formatter;
	accessibleHeadingId = Re();
	domContext;
	attachment;
	#n = b(F([]));
	get months() {
		return B(this.#n);
	}
	set months(e) {
		k(this.#n, e, !0);
	}
	#r = S(() => ms(this.opts.placeholder.current, this.months, (e) => this.isDateDisabled(e)));
	get tabbableDate() {
		return B(this.#r);
	}
	set tabbableDate(e) {
		k(this.#r, e);
	}
	announcer;
	constructor(e) {
		this.opts = e, this.attachment = ye(this.opts.ref), this.domContext = new De(e.ref), this.announcer = Na(null), this.formatter = Go({
			initialLocale: this.opts.locale.current,
			monthFormat: this.opts.monthFormat,
			yearFormat: this.opts.yearFormat
		}), this.setMonths = this.setMonths.bind(this), this.nextPage = this.nextPage.bind(this), this.prevPage = this.prevPage.bind(this), this.prevYear = this.prevYear.bind(this), this.nextYear = this.nextYear.bind(this), this.setYear = this.setYear.bind(this), this.setMonth = this.setMonth.bind(this), this.isOutsideVisibleMonths = this.isOutsideVisibleMonths.bind(this), this.isDateDisabled = this.isDateDisabled.bind(this), this.isDateSelected = this.isDateSelected.bind(this), this.shiftFocus = this.shiftFocus.bind(this), this.handleCellClick = this.handleCellClick.bind(this), this.handleMultipleUpdate = this.handleMultipleUpdate.bind(this), this.handleSingleUpdate = this.handleSingleUpdate.bind(this), this.onkeydown = this.onkeydown.bind(this), this.getBitsAttr = this.getBitsAttr.bind(this), N(() => {
			this.announcer = Na(this.domContext.getDocument());
		}), this.months = Yo({
			dateObj: this.opts.placeholder.current,
			weekStartsOn: this.opts.weekStartsOn.current,
			locale: this.opts.locale.current,
			fixedWeeks: this.opts.fixedWeeks.current,
			numberOfMonths: this.opts.numberOfMonths.current
		}), this.#s(), this.#c(), this.#l(), ss({
			placeholder: this.opts.placeholder,
			getVisibleMonths: () => this.visibleMonths,
			weekStartsOn: this.opts.weekStartsOn,
			locale: this.opts.locale,
			fixedWeeks: this.opts.fixedWeeks,
			numberOfMonths: this.opts.numberOfMonths,
			setMonths: (e) => this.months = e
		}), as({
			fixedWeeks: this.opts.fixedWeeks,
			locale: this.opts.locale,
			numberOfMonths: this.opts.numberOfMonths,
			placeholder: this.opts.placeholder,
			setMonths: this.setMonths,
			weekStartsOn: this.opts.weekStartsOn
		}), ke(() => this.fullCalendarLabel, (e) => {
			let t = this.domContext.getElementById(this.accessibleHeadingId);
			t && (t.textContent = e);
		}), ke(() => this.opts.value.current, () => {
			let e = this.opts.value.current;
			if (Array.isArray(e) && e.length) {
				let t = e[e.length - 1];
				t && this.opts.placeholder.current !== t && (this.opts.placeholder.current = t);
			} else !Array.isArray(e) && e && this.opts.placeholder.current !== e && (this.opts.placeholder.current = e);
		}), hs({
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
	#i = S(() => is({
		months: this.months,
		formatter: this.formatter,
		weekdayFormat: this.opts.weekdayFormat.current
	}));
	get weekdays() {
		return B(this.#i);
	}
	set weekdays(e) {
		k(this.#i, e);
	}
	#a = S(() => re(() => this.opts.placeholder.current.year));
	get initialPlaceholderYear() {
		return B(this.#a);
	}
	set initialPlaceholderYear(e) {
		k(this.#a, e);
	}
	#o = S(() => vs({
		minValue: this.opts.minValue.current,
		maxValue: this.opts.maxValue.current,
		placeholderYear: this.initialPlaceholderYear
	}));
	get defaultYears() {
		return B(this.#o);
	}
	set defaultYears(e) {
		k(this.#o, e);
	}
	#s() {
		z(() => {
			if (re(() => this.opts.initialFocus.current)) {
				let e = this.opts.ref.current?.querySelector("[data-focused]");
				e && e.focus();
			}
		});
	}
	#c() {
		z(() => {
			if (this.opts.ref.current) return os({
				calendarNode: this.opts.ref.current,
				label: this.fullCalendarLabel,
				accessibleHeadingId: this.accessibleHeadingId
			});
		});
	}
	#l() {
		C(() => {
			this.formatter.getLocale() !== this.opts.locale.current && this.formatter.setLocale(this.opts.locale.current);
		});
	}
	nextPage() {
		ns({
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
	prevPage() {
		rs({
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
	#u = S(() => cs({
		maxValue: this.opts.maxValue.current,
		months: this.months,
		disabled: this.opts.disabled.current
	}));
	get isNextButtonDisabled() {
		return B(this.#u);
	}
	set isNextButtonDisabled(e) {
		k(this.#u, e);
	}
	#d = S(() => ls({
		minValue: this.opts.minValue.current,
		months: this.months,
		disabled: this.opts.disabled.current
	}));
	get isPrevButtonDisabled() {
		return B(this.#d);
	}
	set isPrevButtonDisabled(e) {
		k(this.#d, e);
	}
	#f = S(() => {
		let e = this.opts.value.current, t = this.opts.isDateDisabled.current, n = this.opts.isDateUnavailable.current;
		if (Array.isArray(e)) {
			if (!e.length) return !1;
			for (let r of e) if (t(r) || n(r)) return !0;
		} else {
			if (!e) return !1;
			if (t(e) || n(e)) return !0;
		}
		return !1;
	});
	get isInvalid() {
		return B(this.#f);
	}
	set isInvalid(e) {
		k(this.#f, e);
	}
	#p = S(() => (this.opts.monthFormat.current, this.opts.yearFormat.current, us({
		months: this.months,
		formatter: this.formatter,
		locale: this.opts.locale.current
	})));
	get headingValue() {
		return B(this.#p);
	}
	set headingValue(e) {
		k(this.#p, e);
	}
	#m = S(() => `${this.opts.calendarLabel.current} ${this.headingValue}`);
	get fullCalendarLabel() {
		return B(this.#m);
	}
	set fullCalendarLabel(e) {
		k(this.#m, e);
	}
	isOutsideVisibleMonths(e) {
		return !this.visibleMonths.some((t) => Qr(e, t));
	}
	isDateDisabled(e) {
		if (this.opts.isDateDisabled.current(e) || this.opts.disabled.current) return !0;
		let t = this.opts.minValue.current, n = this.opts.maxValue.current;
		return !!(t && Wa(e, t) || n && Wa(n, e));
	}
	isDateSelected(e) {
		let t = this.opts.value.current;
		return Array.isArray(t) ? t.some((t) => Zr(t, e)) : t ? Zr(t, e) : !1;
	}
	shiftFocus(e, t) {
		return Qo({
			node: e,
			add: t,
			useCalendarDayOffset: Math.abs(t) === 7,
			placeholder: this.opts.placeholder,
			calendarNode: this.opts.ref.current,
			isPrevButtonDisabled: this.isPrevButtonDisabled,
			isNextButtonDisabled: this.isNextButtonDisabled,
			months: this.months,
			numberOfMonths: this.opts.numberOfMonths.current
		});
	}
	#h(e) {
		if (this.opts.type.current !== "multiple" || !this.opts.maxDays.current) return !0;
		let t = e.length;
		return !(this.opts.maxDays.current && t > this.opts.maxDays.current);
	}
	handleCellClick(e, t) {
		if (this.opts.readonly.current || this.opts.isDateDisabled.current?.(t) || this.opts.isDateUnavailable.current?.(t)) return;
		let n = this.opts.value.current;
		if (this.opts.type.current === "multiple") (Array.isArray(n) || n === void 0) && (this.opts.value.current = this.handleMultipleUpdate(n, t));
		else if (!Array.isArray(n)) {
			let e = this.handleSingleUpdate(n, t);
			e ? this.announcer.announce(`Selected Date: ${this.formatter.selectedDate(e, !1)}`, "polite") : this.announcer.announce("Selected date is now empty.", "polite", 5e3), this.opts.value.current = gs(e, n), e !== void 0 && this.opts.onDateSelect?.current?.();
		}
	}
	handleMultipleUpdate(e, t) {
		if (!e) {
			let e = [t];
			return this.#h(e) ? e : [t];
		}
		if (!Array.isArray(e)) return;
		let n = e.findIndex((e) => Zr(e, t)), r = this.opts.preventDeselect.current;
		if (n === -1) {
			let n = [...e, t];
			return this.#h(n) ? n : [t];
		}
		if (r) return e;
		{
			let n = e.filter((e) => !Zr(e, t));
			if (!n.length) {
				this.opts.placeholder.current = t;
				return;
			}
			return n;
		}
	}
	handleSingleUpdate(e, t) {
		if (!e) return t;
		if (!this.opts.preventDeselect.current && Zr(e, t)) this.opts.placeholder.current = t;
		else return t;
	}
	onkeydown(e) {
		ts({
			event: e,
			handleCellClick: this.handleCellClick,
			shiftFocus: this.shiftFocus,
			placeholderValue: this.opts.placeholder.current
		});
	}
	#g = S(() => ({
		months: this.months,
		weekdays: this.weekdays
	}));
	get snippetProps() {
		return B(this.#g);
	}
	set snippetProps(e) {
		k(this.#g, e);
	}
	getBitsAttr = (e) => _s.getAttr(e);
	#_ = S(() => ({
		...ds({
			fullCalendarLabel: this.fullCalendarLabel,
			id: this.opts.id.current,
			isInvalid: this.isInvalid,
			disabled: this.opts.disabled.current,
			readonly: this.opts.readonly.current
		}),
		[this.getBitsAttr("root")]: "",
		onkeydown: this.onkeydown,
		...this.attachment
	}));
	get props() {
		return B(this.#_);
	}
	set props(e) {
		k(this.#_, e);
	}
}, xs = class e {
	static create(t) {
		return new e(t, ys.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = ye(this.opts.ref);
	}
	#e = S(() => ({
		id: this.opts.id.current,
		"aria-hidden": G(!0),
		"data-disabled": q(this.root.opts.disabled.current),
		"data-readonly": q(this.root.opts.readonly.current),
		[this.root.getBitsAttr("heading")]: "",
		...this.attachment
	}));
	get props() {
		return B(this.#e);
	}
	set props(e) {
		k(this.#e, e);
	}
}, Ss = new Te("Calendar.Cell | RangeCalendar.Cell"), Cs = class e {
	static create(t) {
		return Ss.set(new e(t, ys.get()));
	}
	opts;
	root;
	#e = S(() => La(Di(this.opts.date.current)));
	get cellDate() {
		return B(this.#e);
	}
	set cellDate(e) {
		k(this.#e, e);
	}
	#t = S(() => this.root.opts.isDateUnavailable.current(this.opts.date.current));
	get isUnavailable() {
		return B(this.#t);
	}
	set isUnavailable(e) {
		k(this.#t, e);
	}
	#n = S(() => Zr(this.opts.date.current, this.root.todayDate));
	get isDateToday() {
		return B(this.#n);
	}
	set isDateToday(e) {
		k(this.#n, e);
	}
	#r = S(() => !Qr(this.opts.date.current, this.opts.month.current));
	get isOutsideMonth() {
		return B(this.#r);
	}
	set isOutsideMonth(e) {
		k(this.#r, e);
	}
	#i = S(() => this.root.isOutsideVisibleMonths(this.opts.date.current));
	get isOutsideVisibleMonths() {
		return B(this.#i);
	}
	set isOutsideVisibleMonths(e) {
		k(this.#i, e);
	}
	#a = S(() => this.root.isDateDisabled(this.opts.date.current) || this.isOutsideMonth && this.root.opts.disableDaysOutsideMonth.current);
	get isDisabled() {
		return B(this.#a);
	}
	set isDisabled(e) {
		k(this.#a, e);
	}
	#o = S(() => Zr(this.opts.date.current, this.root.opts.placeholder.current));
	get isFocusedDate() {
		return B(this.#o);
	}
	set isFocusedDate(e) {
		k(this.#o, e);
	}
	#s = S(() => this.root.isDateSelected(this.opts.date.current));
	get isSelectedDate() {
		return B(this.#s);
	}
	set isSelectedDate(e) {
		k(this.#s, e);
	}
	#c = S(() => this.root.formatter.custom(this.cellDate, {
		weekday: "long",
		month: "long",
		day: "numeric",
		year: "numeric"
	}));
	get labelText() {
		return B(this.#c);
	}
	set labelText(e) {
		k(this.#c, e);
	}
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = ye(this.opts.ref);
	}
	#l = S(() => ({
		disabled: this.isDisabled,
		unavailable: this.isUnavailable,
		selected: this.isSelectedDate,
		day: `${this.opts.date.current.day}`
	}));
	get snippetProps() {
		return B(this.#l);
	}
	set snippetProps(e) {
		k(this.#l, e);
	}
	#u = S(() => this.isDisabled || this.isOutsideMonth && this.root.opts.disableDaysOutsideMonth.current || this.isUnavailable);
	get ariaDisabled() {
		return B(this.#u);
	}
	set ariaDisabled(e) {
		k(this.#u, e);
	}
	#d = S(() => ({
		"data-unavailable": q(this.isUnavailable),
		"data-today": this.isDateToday ? "" : void 0,
		"data-outside-month": this.isOutsideMonth ? "" : void 0,
		"data-outside-visible-months": this.isOutsideVisibleMonths ? "" : void 0,
		"data-focused": this.isFocusedDate ? "" : void 0,
		"data-selected": q(this.isSelectedDate),
		"data-value": this.opts.date.current.toString(),
		"data-type": Ra(this.opts.date.current),
		"data-disabled": q(this.isDisabled || this.isOutsideMonth && this.root.opts.disableDaysOutsideMonth.current)
	}));
	get sharedDataAttrs() {
		return B(this.#d);
	}
	set sharedDataAttrs(e) {
		k(this.#d, e);
	}
	#f = S(() => ({
		id: this.opts.id.current,
		role: "gridcell",
		"aria-selected": we(this.isSelectedDate),
		"aria-disabled": we(this.ariaDisabled),
		...this.sharedDataAttrs,
		[this.root.getBitsAttr("cell")]: "",
		...this.attachment
	}));
	get props() {
		return B(this.#f);
	}
	set props(e) {
		k(this.#f, e);
	}
}, ws = class e {
	static create(t) {
		return new e(t, Ss.get());
	}
	opts;
	cell;
	attachment;
	constructor(e, t) {
		this.opts = e, this.cell = t, this.onclick = this.onclick.bind(this), this.attachment = ye(this.opts.ref);
	}
	#e = S(() => this.cell.isOutsideMonth && this.cell.root.opts.disableDaysOutsideMonth.current || this.cell.isDisabled ? void 0 : this.cell.root.tabbableDate && Zr(this.cell.opts.date.current, this.cell.root.tabbableDate) ? 0 : -1);
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
		return B(this.#t);
	}
	set snippetProps(e) {
		k(this.#t, e);
	}
	#n = S(() => ({
		id: this.opts.id.current,
		role: "button",
		"aria-label": this.cell.labelText,
		"aria-disabled": we(this.cell.ariaDisabled),
		...this.cell.sharedDataAttrs,
		tabindex: B(this.#e),
		[this.cell.root.getBitsAttr("day")]: "",
		"data-bits-day": "",
		onclick: this.onclick,
		...this.attachment
	}));
	get props() {
		return B(this.#n);
	}
	set props(e) {
		k(this.#n, e);
	}
}, Ts = class e {
	static create(t) {
		return new e(t, ys.get());
	}
	opts;
	root;
	#e = S(() => this.root.isNextButtonDisabled);
	get isDisabled() {
		return B(this.#e);
	}
	set isDisabled(e) {
		k(this.#e, e);
	}
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.onclick = this.onclick.bind(this), this.attachment = ye(this.opts.ref);
	}
	onclick(e) {
		this.isDisabled || this.root.nextPage();
	}
	#t = S(() => ({
		id: this.opts.id.current,
		role: "button",
		type: "button",
		"aria-label": "Next",
		"aria-disabled": we(this.isDisabled),
		"data-disabled": q(this.isDisabled),
		disabled: this.isDisabled,
		[this.root.getBitsAttr("next-button")]: "",
		onclick: this.onclick,
		...this.attachment
	}));
	get props() {
		return B(this.#t);
	}
	set props(e) {
		k(this.#t, e);
	}
}, Es = class e {
	static create(t) {
		return new e(t, ys.get());
	}
	opts;
	root;
	#e = S(() => this.root.isPrevButtonDisabled);
	get isDisabled() {
		return B(this.#e);
	}
	set isDisabled(e) {
		k(this.#e, e);
	}
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.onclick = this.onclick.bind(this), this.attachment = ye(this.opts.ref);
	}
	onclick(e) {
		this.isDisabled || this.root.prevPage();
	}
	#t = S(() => ({
		id: this.opts.id.current,
		role: "button",
		type: "button",
		"aria-label": "Previous",
		"aria-disabled": we(this.isDisabled),
		"data-disabled": q(this.isDisabled),
		disabled: this.isDisabled,
		[this.root.getBitsAttr("prev-button")]: "",
		onclick: this.onclick,
		...this.attachment
	}));
	get props() {
		return B(this.#t);
	}
	set props(e) {
		k(this.#t, e);
	}
}, Ds = class e {
	static create(t) {
		return new e(t, ys.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = ye(this.opts.ref);
	}
	#e = S(() => ({
		id: this.opts.id.current,
		tabindex: -1,
		role: "grid",
		"aria-readonly": we(this.root.opts.readonly.current),
		"aria-disabled": we(this.root.opts.disabled.current),
		"data-readonly": q(this.root.opts.readonly.current),
		"data-disabled": q(this.root.opts.disabled.current),
		[this.root.getBitsAttr("grid")]: "",
		...this.attachment
	}));
	get props() {
		return B(this.#e);
	}
	set props(e) {
		k(this.#e, e);
	}
}, Os = class e {
	static create(t) {
		return new e(t, ys.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = ye(this.opts.ref);
	}
	#e = S(() => ({
		id: this.opts.id.current,
		"data-disabled": q(this.root.opts.disabled.current),
		"data-readonly": q(this.root.opts.readonly.current),
		[this.root.getBitsAttr("grid-body")]: "",
		...this.attachment
	}));
	get props() {
		return B(this.#e);
	}
	set props(e) {
		k(this.#e, e);
	}
}, ks = class e {
	static create(t) {
		return new e(t, ys.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = ye(this.opts.ref);
	}
	#e = S(() => ({
		id: this.opts.id.current,
		"data-disabled": q(this.root.opts.disabled.current),
		"data-readonly": q(this.root.opts.readonly.current),
		[this.root.getBitsAttr("grid-head")]: "",
		...this.attachment
	}));
	get props() {
		return B(this.#e);
	}
	set props(e) {
		k(this.#e, e);
	}
}, As = class e {
	static create(t) {
		return new e(t, ys.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = ye(this.opts.ref);
	}
	#e = S(() => ({
		id: this.opts.id.current,
		"data-disabled": q(this.root.opts.disabled.current),
		"data-readonly": q(this.root.opts.readonly.current),
		[this.root.getBitsAttr("grid-row")]: "",
		...this.attachment
	}));
	get props() {
		return B(this.#e);
	}
	set props(e) {
		k(this.#e, e);
	}
}, js = class e {
	static create(t) {
		return new e(t, ys.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = ye(this.opts.ref);
	}
	#e = S(() => ({
		id: this.opts.id.current,
		"data-disabled": q(this.root.opts.disabled.current),
		"data-readonly": q(this.root.opts.readonly.current),
		[this.root.getBitsAttr("head-cell")]: "",
		...this.attachment
	}));
	get props() {
		return B(this.#e);
	}
	set props(e) {
		k(this.#e, e);
	}
}, Ms = class e {
	static create(t) {
		return new e(t, ys.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = ye(this.opts.ref);
	}
	#e = S(() => ({
		id: this.opts.id.current,
		"data-disabled": q(this.root.opts.disabled.current),
		"data-readonly": q(this.root.opts.readonly.current),
		[this.root.getBitsAttr("header")]: "",
		...this.attachment
	}));
	get props() {
		return B(this.#e);
	}
	set props(e) {
		k(this.#e, e);
	}
}, Ns = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"children",
	"child",
	"ref",
	"id"
]), Ps = i("<div><!></div>");
function Fs(e, n) {
	let r = I();
	p(n, !0);
	let i = L(n, "ref", 15, null), a = L(n, "id", 19, () => Fe(r)), s = A(n, Ns), u = ws.create({
		id: Y(() => a()),
		ref: Y(() => i(), (e) => i(e))
	}), f = S(() => Me(s, u.props));
	var g = h(), _ = V(g), v = (e) => {
		var t = h(), r = V(t);
		{
			let e = S(() => ({
				props: B(f),
				...u.snippetProps
			}));
			l(r, () => n.child, () => B(e));
		}
		m(e, t);
	}, y = (e) => {
		var r = Ps();
		D(r, () => ({ ...B(f) }));
		var i = M(r), a = (e) => {
			var t = h(), r = V(t);
			l(r, () => n.children ?? c, () => u.snippetProps), m(e, t);
		}, s = (e) => {
			var n = o();
			P(() => t(n, u.cell.opts.date.current.day)), m(e, n);
		};
		d(i, (e) => {
			n.children ? e(a) : e(s, -1);
		}), j(r), m(e, r);
	};
	d(_, (e) => {
		n.child ? e(v) : e(y, -1);
	}), m(e, g), se();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/calendar/components/calendar-grid.svelte
var Is = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"children",
	"child",
	"ref",
	"id"
]), Ls = i("<table><!></table>");
function Rs(e, t) {
	let n = I();
	p(t, !0);
	let r = L(t, "ref", 15, null), i = L(t, "id", 19, () => Fe(n)), a = A(t, Is), o = Ds.create({
		id: Y(() => i()),
		ref: Y(() => r(), (e) => r(e))
	}), s = S(() => Me(a, o.props));
	var u = h(), f = V(u), g = (e) => {
		var n = h(), r = V(n);
		l(r, () => t.child, () => ({ props: B(s) })), m(e, n);
	}, _ = (e) => {
		var n = Ls();
		D(n, () => ({ ...B(s) }));
		var r = M(n);
		l(r, () => t.children ?? c), j(n), m(e, n);
	};
	d(f, (e) => {
		t.child ? e(g) : e(_, -1);
	}), m(e, u), se();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/calendar/components/calendar-grid-body.svelte
var zs = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"children",
	"child",
	"ref",
	"id"
]), Bs = i("<tbody><!></tbody>");
function Vs(e, t) {
	let n = I();
	p(t, !0);
	let r = L(t, "ref", 15, null), i = L(t, "id", 19, () => Fe(n)), a = A(t, zs), o = Os.create({
		id: Y(() => i()),
		ref: Y(() => r(), (e) => r(e))
	}), s = S(() => Me(a, o.props));
	var u = h(), f = V(u), g = (e) => {
		var n = h(), r = V(n);
		l(r, () => t.child, () => ({ props: B(s) })), m(e, n);
	}, _ = (e) => {
		var n = Bs();
		D(n, () => ({ ...B(s) }));
		var r = M(n);
		l(r, () => t.children ?? c), j(n), m(e, n);
	};
	d(f, (e) => {
		t.child ? e(g) : e(_, -1);
	}), m(e, u), se();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/calendar/components/calendar-cell.svelte
var Hs = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"children",
	"child",
	"ref",
	"id",
	"date",
	"month"
]), Us = i("<td><!></td>");
function Ws(e, t) {
	let n = I();
	p(t, !0);
	let r = L(t, "ref", 15, null), i = L(t, "id", 19, () => Fe(n)), a = A(t, Hs), o = Cs.create({
		id: Y(() => i()),
		ref: Y(() => r(), (e) => r(e)),
		date: Y(() => t.date),
		month: Y(() => t.month)
	}), s = S(() => Me(a, o.props));
	var u = h(), f = V(u), g = (e) => {
		var n = h(), r = V(n);
		{
			let e = S(() => ({
				props: B(s),
				...o.snippetProps
			}));
			l(r, () => t.child, () => B(e));
		}
		m(e, n);
	}, _ = (e) => {
		var n = Us();
		D(n, () => ({ ...B(s) }));
		var r = M(n);
		l(r, () => t.children ?? c, () => o.snippetProps), j(n), m(e, n);
	};
	d(f, (e) => {
		t.child ? e(g) : e(_, -1);
	}), m(e, u), se();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/calendar/components/calendar-grid-head.svelte
var Gs = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"children",
	"child",
	"ref",
	"id"
]), Ks = i("<thead><!></thead>");
function qs(e, t) {
	let n = I();
	p(t, !0);
	let r = L(t, "ref", 15, null), i = L(t, "id", 19, () => Fe(n)), a = A(t, Gs), o = ks.create({
		id: Y(() => i()),
		ref: Y(() => r(), (e) => r(e))
	}), s = S(() => Me(a, o.props));
	var u = h(), f = V(u), g = (e) => {
		var n = h(), r = V(n);
		l(r, () => t.child, () => ({ props: B(s) })), m(e, n);
	}, _ = (e) => {
		var n = Ks();
		D(n, () => ({ ...B(s) }));
		var r = M(n);
		l(r, () => t.children ?? c), j(n), m(e, n);
	};
	d(f, (e) => {
		t.child ? e(g) : e(_, -1);
	}), m(e, u), se();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/calendar/components/calendar-head-cell.svelte
var Js = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"children",
	"child",
	"ref",
	"id"
]), Ys = i("<th><!></th>");
function Xs(e, t) {
	let n = I();
	p(t, !0);
	let r = L(t, "ref", 15, null), i = L(t, "id", 19, () => Fe(n)), a = A(t, Js), o = js.create({
		id: Y(() => i()),
		ref: Y(() => r(), (e) => r(e))
	}), s = S(() => Me(a, o.props));
	var u = h(), f = V(u), g = (e) => {
		var n = h(), r = V(n);
		l(r, () => t.child, () => ({ props: B(s) })), m(e, n);
	}, _ = (e) => {
		var n = Ys();
		D(n, () => ({ ...B(s) }));
		var r = M(n);
		l(r, () => t.children ?? c), j(n), m(e, n);
	};
	d(f, (e) => {
		t.child ? e(g) : e(_, -1);
	}), m(e, u), se();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/calendar/components/calendar-grid-row.svelte
var Zs = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"children",
	"child",
	"ref",
	"id"
]), Qs = i("<tr><!></tr>");
function $s(e, t) {
	let n = I();
	p(t, !0);
	let r = L(t, "ref", 15, null), i = L(t, "id", 19, () => Fe(n)), a = A(t, Zs), o = As.create({
		id: Y(() => i()),
		ref: Y(() => r(), (e) => r(e))
	}), s = S(() => Me(a, o.props));
	var u = h(), f = V(u), g = (e) => {
		var n = h(), r = V(n);
		l(r, () => t.child, () => ({ props: B(s) })), m(e, n);
	}, _ = (e) => {
		var n = Qs();
		D(n, () => ({ ...B(s) }));
		var r = M(n);
		l(r, () => t.children ?? c), j(n), m(e, n);
	};
	d(f, (e) => {
		t.child ? e(g) : e(_, -1);
	}), m(e, u), se();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/calendar/components/calendar-header.svelte
var ec = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"children",
	"child",
	"ref",
	"id"
]), tc = i("<header><!></header>");
function nc(e, t) {
	let n = I();
	p(t, !0);
	let r = L(t, "ref", 15, null), i = L(t, "id", 19, () => Fe(n)), a = A(t, ec), o = Ms.create({
		id: Y(() => i()),
		ref: Y(() => r(), (e) => r(e))
	}), s = S(() => Me(a, o.props));
	var u = h(), f = V(u), g = (e) => {
		var n = h(), r = V(n);
		l(r, () => t.child, () => ({ props: B(s) })), m(e, n);
	}, _ = (e) => {
		var n = tc();
		D(n, () => ({ ...B(s) }));
		var r = M(n);
		l(r, () => t.children ?? c), j(n), m(e, n);
	};
	d(f, (e) => {
		t.child ? e(g) : e(_, -1);
	}), m(e, u), se();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/calendar/components/calendar-heading.svelte
var rc = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"children",
	"child",
	"ref",
	"id"
]), ic = i("<div><!></div>");
function ac(e, n) {
	let r = I();
	p(n, !0);
	let i = L(n, "ref", 15, null), a = L(n, "id", 19, () => Fe(r)), s = A(n, rc), u = xs.create({
		id: Y(() => a()),
		ref: Y(() => i(), (e) => i(e))
	}), f = S(() => Me(s, u.props));
	var g = h(), _ = V(g), v = (e) => {
		var t = h(), r = V(t);
		l(r, () => n.child, () => ({
			props: B(f),
			headingValue: u.root.headingValue
		})), m(e, t);
	}, y = (e) => {
		var r = ic();
		D(r, () => ({ ...B(f) }));
		var i = M(r), a = (e) => {
			var t = h(), r = V(t);
			l(r, () => n.children ?? c, () => ({ headingValue: u.root.headingValue })), m(e, t);
		}, s = (e) => {
			var n = o();
			P(() => t(n, u.root.headingValue)), m(e, n);
		};
		d(i, (e) => {
			n.children ? e(a) : e(s, -1);
		}), j(r), m(e, r);
	};
	d(_, (e) => {
		n.child ? e(v) : e(y, -1);
	}), m(e, g), se();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/calendar/components/calendar-next-button.svelte
var oc = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"children",
	"child",
	"id",
	"ref",
	"tabindex"
]), sc = i("<button><!></button>");
function cc(e, t) {
	let n = I();
	p(t, !0);
	let r = L(t, "id", 19, () => Fe(n)), i = L(t, "ref", 15, null), a = L(t, "tabindex", 3, 0), o = A(t, oc), s = Ts.create({
		id: Y(() => r()),
		ref: Y(() => i(), (e) => i(e))
	}), u = S(() => Me(o, s.props, { tabindex: a() }));
	var f = h(), g = V(f), _ = (e) => {
		var n = h(), r = V(n);
		l(r, () => t.child, () => ({ props: B(u) })), m(e, n);
	}, v = (e) => {
		var n = sc();
		D(n, () => ({ ...B(u) }));
		var r = M(n);
		l(r, () => t.children ?? c), j(n), m(e, n);
	};
	d(g, (e) => {
		t.child ? e(_) : e(v, -1);
	}), m(e, f), se();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/calendar/components/calendar-prev-button.svelte
var lc = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"children",
	"child",
	"id",
	"ref",
	"tabindex"
]), uc = i("<button><!></button>");
function dc(e, t) {
	let n = I();
	p(t, !0);
	let r = L(t, "id", 19, () => Fe(n)), i = L(t, "ref", 15, null), a = L(t, "tabindex", 3, 0), o = A(t, lc), s = Es.create({
		id: Y(() => r()),
		ref: Y(() => i(), (e) => i(e))
	}), u = S(() => Me(o, s.props, { tabindex: a() }));
	var f = h(), g = V(f), _ = (e) => {
		var n = h(), r = V(n);
		l(r, () => t.child, () => ({ props: B(u) })), m(e, n);
	}, v = (e) => {
		var n = uc();
		D(n, () => ({ ...B(u) }));
		var r = M(n);
		l(r, () => t.children ?? c), j(n), m(e, n);
	};
	d(g, (e) => {
		t.child ? e(_) : e(v, -1);
	}), m(e, f), se();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/date-field/date-field.svelte.js
var fc = Se({
	component: "date-field",
	parts: [
		"input",
		"label",
		"segment"
	]
}), pc = {
	day: {
		min: 1,
		max: (e) => {
			let t = e.value.current ?? e.placeholder.current;
			return jo(e.segmentValues.month, t);
		},
		cycle: 1,
		padZero: !0
	},
	month: {
		min: 1,
		max: 12,
		cycle: 1,
		padZero: !0,
		getAnnouncement: (e, t) => t.placeholder.current ? `${e} - ${t.formatter.fullMonth(La(t.placeholder.current.set({ month: e })))}` : ""
	},
	year: {
		min: 1,
		max: 9999,
		cycle: 1,
		padZero: !1
	},
	hour: {
		min: (e) => +(e.hourCycle.current === 12),
		max: (e) => e.hourCycle.current === 24 ? 23 : e.hourCycle.current === 12 || No(e.locale.current) === 12 ? 12 : 23,
		cycle: 1,
		canBeZero: !0,
		padZero: !0
	},
	minute: {
		min: 0,
		max: 59,
		cycle: 1,
		canBeZero: !0,
		padZero: !0
	},
	second: {
		min: 0,
		max: 59,
		cycle: 1,
		canBeZero: !0,
		padZero: !0
	}
}, mc = new Te("DateField.Root"), hc = class e {
	static create(t, n) {
		return mc.set(new e(t, n));
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
	descriptionId = Re();
	formatter;
	initialSegments;
	#e = b();
	get segmentValues() {
		return B(this.#e);
	}
	set segmentValues(e) {
		k(this.#e, e, !0);
	}
	announcer;
	#t = S(() => new Set(this.readonlySegments.current));
	get readonlySegmentsSet() {
		return B(this.#t);
	}
	set readonlySegmentsSet(e) {
		k(this.#t, e);
	}
	segmentStates = go();
	#n = b(null);
	#r = b(null);
	#i = b(null);
	get descriptionNode() {
		return B(this.#i);
	}
	set descriptionNode(e) {
		k(this.#i, e, !0);
	}
	#a = b(null);
	get validationNode() {
		return B(this.#a);
	}
	set validationNode(e) {
		k(this.#a, e, !0);
	}
	states = go();
	#o = !1;
	#s = b(null);
	get dayPeriodNode() {
		return B(this.#s);
	}
	set dayPeriodNode(e) {
		k(this.#s, e, !0);
	}
	hourInputDayPeriodHint = null;
	rangeRoot = void 0;
	#c = b("");
	get name() {
		return B(this.#c);
	}
	set name(e) {
		k(this.#c, e, !0);
	}
	domContext = new De(() => null);
	constructor(e, t) {
		this.rangeRoot = t, this.value = e.value, this.placeholder = t ? t.opts.placeholder : e.placeholder, this.validate = t ? je(void 0) : e.validate, this.minValue = t ? t.opts.minValue : e.minValue, this.maxValue = t ? t.opts.maxValue : e.maxValue, this.disabled = t ? t.opts.disabled : e.disabled, this.readonly = t ? t.opts.readonly : e.readonly, this.granularity = t ? t.opts.granularity : e.granularity, this.readonlySegments = t ? t.opts.readonlySegments : e.readonlySegments, this.hourCycle = t ? t.opts.hourCycle : e.hourCycle, this.locale = t ? t.opts.locale : e.locale, this.hideTimeZone = t ? t.opts.hideTimeZone : e.hideTimeZone, this.required = t ? t.opts.required : e.required, this.onInvalid = t ? t.opts.onInvalid : e.onInvalid, this.errorMessageId = t ? t.opts.errorMessageId : e.errorMessageId, this.isInvalidProp = e.isInvalidProp, this.formatter = Go({
			initialLocale: this.locale.current,
			monthFormat: Y(() => "long"),
			yearFormat: Y(() => "numeric")
		}), this.initialSegments = uo(this.inferredGranularity), this.segmentValues = this.initialSegments, this.announcer = Na(null), this.getFieldNode = this.getFieldNode.bind(this), this.updateSegment = this.updateSegment.bind(this), this.handleSegmentClick = this.handleSegmentClick.bind(this), this.getBaseSegmentAttrs = this.getBaseSegmentAttrs.bind(this), z(() => {
			re(() => {
				this.initialSegments = uo(this.inferredGranularity);
			});
		}), N(() => {
			this.announcer = Na(this.domContext.getDocument());
		}), Le(() => {
			t || Ao(this.descriptionId, this.domContext.getDocument());
		}), z(() => {
			this.formatter.getLocale() !== this.locale.current && this.formatter.setLocale(this.locale.current);
		}), z(() => {
			if (t) return;
			this.value.current && ko({
				id: re(() => this.descriptionId),
				formatter: this.formatter,
				value: this.value.current,
				doc: this.domContext.getDocument()
			});
			let e = re(() => this.placeholder.current);
			this.value.current && e !== this.value.current && re(() => {
				this.value.current && (this.placeholder.current = this.value.current);
			});
		}), this.value.current && this.syncSegmentValues(this.value.current), z(() => {
			this.locale.current, this.value.current && this.syncSegmentValues(this.value.current), this.#l();
		}), z(() => {
			if (this.value.current === void 0) {
				if (this.#o) {
					this.#o = !1;
					return;
				}
				this.segmentValues = uo(this.inferredGranularity);
			}
		}), ke(() => this.validationStatus, () => {
			this.validationStatus !== !1 && this.onInvalid.current?.(this.validationStatus.reason, this.validationStatus.message);
		});
	}
	setName(e) {
		this.name = e;
	}
	setFieldNode(e) {
		k(this.#n, e, !0);
	}
	getFieldNode() {
		return this.rangeRoot ? this.rangeRoot.fieldNode : B(this.#n);
	}
	setLabelNode(e) {
		k(this.#r, e, !0);
	}
	getLabelNode() {
		return this.rangeRoot ? this.rangeRoot.labelNode : B(this.#r);
	}
	#l() {
		this.states.day.updating = null, this.states.month.updating = null, this.states.year.updating = null, this.states.hour.updating = null, this.states.minute.updating = null, this.states.dayPeriod.updating = null;
	}
	setValue(e) {
		this.value.current = e;
	}
	syncSegmentValues(e) {
		let t = Ja.map((t) => {
			let n = e[t];
			if (t === "month") {
				if (this.states.month.updating) return [t, this.states.month.updating];
				if (n < 10) return [t, `0${n}`];
			}
			if (t === "day") {
				if (this.states.day.updating) return [t, this.states.day.updating];
				if (n < 10) return [t, `0${n}`];
			}
			if (t === "year") {
				if (this.states.year.updating) return [t, this.states.year.updating];
				let e = 4 - `${n}`.length;
				if (e > 0) return [t, `${"0".repeat(e)}${n}`];
			}
			return [t, `${n}`];
		});
		if ("hour" in e) {
			let n = Ya.map((t) => {
				if (t === "dayPeriod") return this.states.dayPeriod.updating ? [t, this.states.dayPeriod.updating] : [t, this.formatter.dayPeriod(La(e))];
				if (t === "hour") {
					if (this.states.hour.updating) return [t, this.states.hour.updating];
					if (e[t] !== void 0 && e[t] < 10) return [t, `0${e[t]}`];
					if (e[t] === 0 && this.dayPeriodNode) return [t, "12"];
				} else if (t === "minute") {
					if (this.states.minute.updating) return [t, this.states.minute.updating];
					if (e[t] !== void 0 && e[t] < 10) return [t, `0${e[t]}`];
				} else if (t === "second") {
					if (this.states.second.updating) return [t, this.states.second.updating];
					if (e[t] !== void 0 && e[t] < 10) return [t, `0${e[t]}`];
				}
				return [t, `${e[t]}`];
			}), r = [...t, ...n];
			this.segmentValues = Object.fromEntries(r), this.#l();
		} else this.segmentValues = Object.fromEntries(t);
	}
	#u = S(() => {
		let e = this.value.current;
		if (!e) return !1;
		let t = this.validate.current?.(e);
		if (t) return {
			reason: "custom",
			message: t
		};
		let n = this.minValue.current;
		if (n && Wa(e, n)) return { reason: "min" };
		let r = this.maxValue.current;
		return r && Wa(r, e) ? { reason: "max" } : !1;
	});
	get validationStatus() {
		return B(this.#u);
	}
	set validationStatus(e) {
		k(this.#u, e);
	}
	#d = S(() => this.validationStatus !== !1 && (this.isInvalidProp.current, !0));
	get isInvalid() {
		return B(this.#d);
	}
	set isInvalid(e) {
		k(this.#d, e);
	}
	#f = S(() => this.granularity.current || Eo(this.placeholder.current, this.granularity.current));
	get inferredGranularity() {
		return B(this.#f);
	}
	set inferredGranularity(e) {
		k(this.#f, e);
	}
	#p = S(() => this.value.current === void 0 ? this.placeholder.current : this.value.current);
	get dateRef() {
		return B(this.#p);
	}
	set dateRef(e) {
		k(this.#p, e);
	}
	#m = S(() => mo({
		segmentValues: this.segmentValues,
		formatter: this.formatter,
		locale: this.locale.current,
		granularity: this.inferredGranularity,
		dateRef: this.dateRef,
		hideTimeZone: this.hideTimeZone.current,
		hourCycle: this.hourCycle.current
	}));
	get allSegmentContent() {
		return B(this.#m);
	}
	set allSegmentContent(e) {
		k(this.#m, e);
	}
	#h = S(() => this.allSegmentContent.arr);
	get segmentContents() {
		return B(this.#h);
	}
	set segmentContents(e) {
		k(this.#h, e);
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
	updateSegment(e, t) {
		let n = this.disabled.current, r = this.readonly.current, i = this.readonlySegmentsSet;
		if (n || r || i.has(e)) return;
		let a = this.segmentValues, o = a, s = this.placeholder.current;
		if (To(a)) {
			let n = a[e], r = t;
			if (e === "month") {
				let t = r(n);
				if (this.states.month.updating = t, t !== null && a.day !== null) {
					let e = Ua(La(s.set({ month: Number.parseInt(t) })));
					Number.parseInt(a.day) > e && (a.day = `${e}`);
				}
				o = {
					...a,
					[e]: t
				};
			} else if (e === "dayPeriod") {
				let t = r(n);
				this.states.dayPeriod.updating = t;
				let i = this.value.current;
				if (i && "hour" in i) {
					let e = i.hour;
					t === "AM" ? e >= 12 && (a.hour = `${e - 12}`) : t === "PM" && e < 12 && (a.hour = `${e + 12}`);
				}
				o = {
					...a,
					[e]: t
				};
			} else if (e === "hour") {
				let t = this.hourInputDayPeriodHint, i = r(t === null ? n : Fo(a.hour)), c = i !== null && t !== null ? Po(i, t) : i;
				if (this.states.hour.updating = c, c !== null && a.dayPeriod !== null) {
					if (t !== null) a.dayPeriod = t;
					else {
						let e = this.formatter.dayPeriod(La(s.set({ hour: Number.parseInt(c) })), this.hourCycle.current);
						(e === "AM" || e === "PM") && (a.dayPeriod = e);
					}
				}
				o = {
					...a,
					[e]: c
				};
			} else if (e === "minute") {
				let t = r(n);
				this.states.minute.updating = t, o = {
					...a,
					[e]: t
				};
			} else if (e === "second") {
				let t = r(n);
				this.states.second.updating = t, o = {
					...a,
					[e]: t
				};
			} else if (e === "year") {
				let t = r(n);
				this.states.year.updating = t, o = {
					...a,
					[e]: t
				};
			} else if (e === "day") {
				let t = r(n);
				this.states.day.updating = t, o = {
					...a,
					[e]: t
				};
			} else {
				let t = r(n);
				o = {
					...a,
					[e]: t
				};
			}
		} else if (_o(e)) {
			let n = a[e], r = t, i = r(n);
			if (e === "month" && i !== null && a.day !== null) {
				this.states.month.updating = i;
				let t = Ua(La(s.set({ month: Number.parseInt(i) })));
				Number.parseInt(a.day) > t && (a.day = `${t}`), o = {
					...a,
					[e]: i
				};
			} else if (e === "year") {
				let t = r(n);
				this.states.year.updating = t, o = {
					...a,
					[e]: t
				};
			} else if (e === "day") {
				let t = r(n);
				this.states.day.updating = t, o = {
					...a,
					[e]: t
				};
			} else o = {
				...a,
				[e]: i
			};
		}
		this.segmentValues = o, wo(o, B(this.#n)) ? this.setValue(Co({
			segmentObj: o,
			fieldNode: B(this.#n),
			dateRef: this.placeholder.current
		})) : (this.value.current !== void 0 && (this.#o = !0), this.setValue(void 0), this.segmentValues = o);
	}
	handleSegmentClick(e) {
		this.disabled.current && e.preventDefault();
	}
	getBaseSegmentAttrs(e, t) {
		let n = this.readonlySegmentsSet.has(e), r = {
			"aria-invalid": G(this.isInvalid),
			"aria-disabled": we(this.disabled.current),
			"aria-readonly": we(this.readonly.current || n),
			"data-invalid": q(this.isInvalid),
			"data-disabled": q(this.disabled.current),
			"data-readonly": q(this.readonly.current || n),
			"data-segment": `${e}`,
			[fc.segment]: ""
		};
		if (e === "literal") return r;
		let i = this.descriptionNode?.id, a = Oo(t, B(this.#n)) && i, o = this.errorMessageId?.current, s = a ? `${i} ${this.isInvalid && o ? o : ""}` : void 0, c = !(this.readonly.current || n || this.disabled.current);
		return {
			...r,
			"aria-labelledby": this.#g(t),
			contenteditable: c ? "true" : void 0,
			"aria-describedby": s,
			tabindex: this.disabled.current ? void 0 : 0
		};
	}
}, gc = class e {
	static create(t) {
		return new e(t, mc.get());
	}
	opts;
	root;
	domContext;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.domContext = new De(e.ref), this.root.domContext = this.domContext, this.attachment = ye(e.ref, (e) => this.root.setFieldNode(e)), ke(() => this.opts.name.current, (e) => {
			this.root.setName(e);
		});
	}
	#e = S(() => {
		if (J && this.domContext.getElementById(this.root.descriptionId)) return this.root.descriptionId;
	});
	#t = S(() => ({
		id: this.opts.id.current,
		role: "group",
		"aria-labelledby": this.root.getLabelNode()?.id ?? void 0,
		"aria-describedby": B(this.#e),
		"aria-disabled": we(this.root.disabled.current),
		"data-invalid": this.root.isInvalid ? "" : void 0,
		"data-disabled": q(this.root.disabled.current),
		[fc.input]: "",
		...this.attachment
	}));
	get props() {
		return B(this.#t);
	}
	set props(e) {
		k(this.#t, e);
	}
}, _c = class e {
	static create() {
		return new e(mc.get());
	}
	root;
	#e = S(() => this.root.name !== "");
	get shouldRender() {
		return B(this.#e);
	}
	set shouldRender(e) {
		k(this.#e, e);
	}
	#t = S(() => this.root.value.current ? this.root.value.current.toString() : "");
	get isoValue() {
		return B(this.#t);
	}
	set isoValue(e) {
		k(this.#t, e);
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
		return B(this.#n);
	}
	set props(e) {
		k(this.#n, e);
	}
}, vc = class {
	opts;
	root;
	announcer;
	part;
	config;
	attachment;
	constructor(e, t, n, r) {
		this.opts = e, this.root = t, this.part = n, this.config = r, this.announcer = t.announcer, this.onkeydown = this.onkeydown.bind(this), this.onfocusout = this.onfocusout.bind(this), this.attachment = ye(e.ref);
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
	#r(e, t = !0) {
		let n = String(e);
		return t && this.config.padZero && n.length === 1 ? `0${e}` : n;
	}
	onkeydown(e) {
		let t = this.root.value.current ?? this.root.placeholder.current;
		e.ctrlKey || e.metaKey || this.root.disabled.current || (this.part !== "hour" && this.part !== "minute" && this.part !== "second" || this.part in t) && (e.key !== "Tab" && e.preventDefault(), Do(e.key) && (Ac(e.key) ? this.#i(t) : jc(e.key) ? this.#a(t) : Ve(e.key) ? this.#o(e) : Mc(e.key) ? this.#s(e) : Ho(e.key) && Io(e, this.root.getFieldNode())));
	}
	#i(e) {
		let t = this.part;
		t in this.root.states && (this.root.states[t].hasLeftFocus = !1), this.root.updateSegment(this.part, (t) => {
			if (t === null) {
				let t = e[this.part];
				return this.announcer.announce(this.#n(t)), this.#r(t);
			}
			let n = e.set({ [this.part]: Number.parseInt(t) }).cycle(this.part, this.config.cycle)[this.part];
			return this.announcer.announce(this.#n(n)), this.#r(n);
		});
	}
	#a(e) {
		let t = this.part;
		t in this.root.states && (this.root.states[t].hasLeftFocus = !1), this.root.updateSegment(this.part, (t) => {
			if (t === null) {
				let t = e[this.part];
				return this.announcer.announce(this.#n(t)), this.#r(t);
			}
			let n = e.set({ [this.part]: Number.parseInt(t) }).cycle(this.part, -this.config.cycle)[this.part];
			return this.announcer.announce(this.#n(n)), this.#r(n);
		});
	}
	#o(e) {
		let t = Number.parseInt(e.key), n = !1, r = this.#e(), i = Math.floor(r / 10), a = t === 0, o = this.part;
		this.root.updateSegment(this.part, (e) => {
			if (o in this.root.states && this.root.states[o].hasLeftFocus && (e = null, this.root.states[o].hasLeftFocus = !1), e === null) return a ? (o in this.root.states && (this.root.states[o].lastKeyZero = !0), this.announcer.announce("0"), "0") : (o in this.root.states && (this.root.states[o].lastKeyZero || t > i) && (n = !0), o in this.root.states && (this.root.states[o].lastKeyZero = !1), n && String(t).length === 1 ? (this.announcer.announce(t), `0${t}`) : `${t}`);
			if (o in this.root.states && this.root.states[o].lastKeyZero) return t === 0 ? this.part === "hour" && t === 0 && this.root.hourCycle.current === 24 || (this.part === "minute" || this.part === "second") && t === 0 ? (n = !0, this.root.states[o].lastKeyZero = !1, "00") : e : (n = !0, this.root.states[o].lastKeyZero = !1, `0${t}`);
			let s = Number.parseInt(e + t.toString());
			return s > r ? (n = !0, `0${t}`) : (n = !0, `${s}`);
		}), n && Bo(e, this.root.getFieldNode());
	}
	#s(e) {
		let t = this.part;
		t in this.root.states && (this.root.states[t].hasLeftFocus = !1);
		let n = !1;
		this.root.updateSegment(this.part, (e) => {
			if (e === null) return n = !0, this.announcer.announce(null), null;
			if (e.length === 2 && e.startsWith("0")) return this.announcer.announce(null), null;
			let t = e.toString();
			if (t.length === 1) return this.announcer.announce(null), null;
			let r = Number.parseInt(t.slice(0, -1));
			return this.announcer.announce(this.#n(r)), `${r}`;
		}), n && Vo(e, this.root.getFieldNode());
	}
	onfocusout(e) {
		let t = this.part;
		t in this.root.states && (this.root.states[t].hasLeftFocus = !0), this.config.padZero && this.root.updateSegment(this.part, (e) => e && e.length === 1 ? `0${e}` : e);
	}
	getSegmentProps() {
		let e = this.root.segmentValues, t = this.root.placeholder.current, n = e[this.part] === null, r = _o(this.part) ? Mo(this.part, t, e) : t;
		e[this.part] && (r = r.set({ [this.part]: Number.parseInt(e[this.part]) }));
		let i = r[this.part];
		if (this.part === "day" && !Ae(e.day) && Ae(e.month)) {
			let t = Number.parseInt(e.day);
			t >= 1 && t <= 31 && (i = t);
		}
		let a = this.#t(), o = this.#e(), s = n ? "Empty" : `${i}`;
		return this.part === "hour" && "dayPeriod" in e && e.dayPeriod && (s = n ? "Empty" : `${i} ${e.dayPeriod}`), {
			"aria-label": `${this.part}, `,
			"aria-valuemin": a,
			"aria-valuemax": o,
			"aria-valuenow": i,
			"aria-valuetext": s
		};
	}
	#c = S(() => ({
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
		return B(this.#c);
	}
	set props(e) {
		k(this.#c, e);
	}
}, yc = class extends vc {
	#e = [];
	#t = 0;
	constructor(e, t) {
		super(e, t, "year", pc.year);
	}
	onkeydown(e) {
		e.ctrlKey || e.metaKey || this.root.disabled.current || (e.key !== "Tab" && e.preventDefault(), Do(e.key) && (Ac(e.key) || jc(e.key) ? (this.#n(), super.onkeydown(e)) : Ve(e.key) ? this.#i(e) : Mc(e.key) ? this.#a(e) : Ho(e.key) && Io(e, this.root.getFieldNode())));
	}
	#n() {
		this.#t = 0;
	}
	#r() {
		this.#t++;
	}
	#i(e) {
		this.#e.push(e.key);
		let t = !1, n = Number.parseInt(e.key);
		this.root.updateSegment("year", (e) => {
			if (this.root.states.year.hasLeftFocus && (e = null, this.root.states.year.hasLeftFocus = !1), e === null) return this.announcer.announce(n), `${n}`;
			let r = e.toString() + n.toString(), i = Number.parseInt(r);
			if (String(i).length < 4) return this.#t > 0 && this.#e.length <= this.#t && r.length <= 4 ? (this.announcer.announce(i), r.length === 4 && (t = !0), r) : (this.announcer.announce(i), Nc(i));
			this.announcer.announce(i), t = !0;
			let a = `${i}`;
			return a.length > 4 ? a.slice(0, 4) : a;
		}), this.#e.length === 4 && (t = !0), t && Bo(e, this.root.getFieldNode());
	}
	#a(e) {
		this.#e = [], this.#r();
		let t = !1;
		this.root.updateSegment("year", (e) => {
			if (this.root.states.year.hasLeftFocus = !1, e === null) return t = !0, this.announcer.announce(null), null;
			let n = e.toString();
			if (n.length === 1) return this.announcer.announce(null), null;
			let r = n.slice(0, -1);
			return this.announcer.announce(Number.parseInt(r)), r;
		}), t && Vo(e, this.root.getFieldNode());
	}
	onfocusout(e) {
		this.root.states.year.hasLeftFocus = !0, this.#e = [], this.#n(), this.root.updateSegment("year", (e) => e && e.length !== 4 ? Nc(Number.parseInt(e)) : e);
	}
}, bc = class extends vc {
	constructor(e, t) {
		super(e, t, "day", pc.day);
	}
}, xc = class extends vc {
	constructor(e, t) {
		super(e, t, "month", pc.month);
	}
}, Sc = class extends vc {
	constructor(e, t) {
		super(e, t, "hour", pc.hour);
	}
	onkeydown(e) {
		let t = this.root.segmentValues;
		(Ve(e.key) || Mc(e.key)) && this.root.dayPeriodNode && To(t) && (this.root.hourInputDayPeriodHint = t.dayPeriod), super.onkeydown(e), this.root.hourInputDayPeriodHint = null;
	}
}, Cc = class extends vc {
	constructor(e, t) {
		super(e, t, "minute", pc.minute);
	}
}, wc = class extends vc {
	constructor(e, t) {
		super(e, t, "second", pc.second);
	}
}, Tc = class e {
	static create(t) {
		return new e(t, mc.get());
	}
	opts;
	root;
	attachment;
	#e;
	constructor(e, t) {
		this.opts = e, this.root = t, this.#e = this.root.announcer, this.onkeydown = this.onkeydown.bind(this), this.attachment = ye(e.ref, (e) => this.root.dayPeriodNode = e);
	}
	onkeydown(e) {
		e.ctrlKey || e.metaKey || this.root.disabled.current || (e.key !== "Tab" && e.preventDefault(), kc(e.key) && (Ac(e.key) || jc(e.key) ? this.root.updateSegment("dayPeriod", (e) => e === "AM" ? (this.#e.announce("PM"), "PM") : (this.#e.announce("AM"), "AM")) : (Mc(e.key) && (this.root.states.dayPeriod.hasLeftFocus = !1, this.root.updateSegment("dayPeriod", () => (this.#e.announce("AM"), "AM"))), e.key === "A" || e.key, this.root.updateSegment("dayPeriod", () => {
			let t = e.key === "A" || e.key === "a" ? "AM" : "PM";
			return this.#e.announce(t), t;
		}), Ho(e.key) && Io(e, this.root.getFieldNode()))));
	}
	#t = S(() => {
		let e = this.root.segmentValues;
		if (!("dayPeriod" in e)) return;
		let t = e.dayPeriod === "AM" ? 0 : 12, n = e.dayPeriod ?? "AM";
		return {
			...this.root.sharedSegmentAttrs,
			id: this.opts.id.current,
			inputmode: "text",
			"aria-label": "AM/PM",
			"aria-valuemin": 0,
			"aria-valuemax": 12,
			"aria-valuenow": t,
			"aria-valuetext": n,
			onkeydown: this.onkeydown,
			onclick: this.root.handleSegmentClick,
			...this.root.getBaseSegmentAttrs("dayPeriod", this.opts.id.current),
			...this.attachment
		};
	});
	get props() {
		return B(this.#t);
	}
	set props(e) {
		k(this.#t, e);
	}
}, Ec = class e {
	static create(t) {
		return new e(t, mc.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = ye(e.ref);
	}
	#e = S(() => ({
		id: this.opts.id.current,
		"aria-hidden": G(!0),
		...this.root.getBaseSegmentAttrs("literal", this.opts.id.current),
		...this.attachment
	}));
	get props() {
		return B(this.#e);
	}
	set props(e) {
		k(this.#e, e);
	}
}, Dc = class e {
	static create(t) {
		return new e(t, mc.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.onkeydown = this.onkeydown.bind(this), this.attachment = ye(e.ref);
	}
	onkeydown(e) {
		e.key !== "Tab" && e.preventDefault(), !this.root.disabled.current && Ho(e.key) && Io(e, this.root.getFieldNode());
	}
	#e = S(() => ({
		role: "textbox",
		id: this.opts.id.current,
		"aria-label": "timezone, ",
		style: { caretColor: "transparent" },
		onkeydown: this.onkeydown,
		...this.root.getBaseSegmentAttrs("timeZoneName", this.opts.id.current),
		"data-readonly": q(!0),
		...this.attachment
	}));
	get props() {
		return B(this.#e);
	}
	set props(e) {
		k(this.#e, e);
	}
}, Oc = class {
	static create(e, t) {
		let n = mc.get();
		switch (e) {
			case "day": return new bc(t, n);
			case "month": return new xc(t, n);
			case "year": return new yc(t, n);
			case "hour": return new Sc(t, n);
			case "minute": return new Cc(t, n);
			case "second": return new wc(t, n);
			case "dayPeriod": return new Tc(t, n);
			case "literal": return new Ec(t, n);
			case "timeZoneName": return new Dc(t, n);
		}
	}
};
function kc(e) {
	return Do(e) || e === "A" || e === "P" || e === "a" || e === "p";
}
function Ac(e) {
	return e === He;
}
function jc(e) {
	return e === Ue;
}
function Mc(e) {
	return e === Ee;
}
function Nc(e) {
	let t = 4 - String(e).length;
	return `${"0".repeat(t)}${e}`;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/date-field/components/date-field-hidden-input.svelte
function Pc(e, t) {
	p(t, !0);
	let n = _c.create();
	var r = h(), i = V(r), a = (e) => {
		Fn(e, x(() => n.props));
	};
	d(i, (e) => {
		n.shouldRender && e(a);
	}), m(e, r), se();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/date-field/components/date-field-input.svelte
var Fc = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"id",
	"ref",
	"name",
	"children",
	"child"
]), Ic = i("<div><!></div>"), Lc = i("<!> <!>", 1);
function Rc(e, t) {
	let n = I();
	p(t, !0);
	let r = L(t, "id", 19, () => Fe(n)), i = L(t, "ref", 15, null), a = L(t, "name", 3, ""), o = A(t, Fc), s = gc.create({
		id: Y(() => r()),
		ref: Y(() => i(), (e) => i(e)),
		name: Y(() => a())
	}), u = S(() => Me(o, s.props));
	var f = Lc(), g = V(f), _ = (e) => {
		var n = h(), r = V(n);
		l(r, () => t.child, () => ({
			props: B(u),
			segments: s.root.segmentContents
		})), m(e, n);
	}, v = (e) => {
		var n = Ic();
		D(n, () => ({ ...B(u) }));
		var r = M(n);
		l(r, () => t.children ?? c, () => ({ segments: s.root.segmentContents })), j(n), m(e, n);
	};
	d(g, (e) => {
		t.child ? e(_) : e(v, -1);
	}), Pc(E(g, 2), {}), m(e, f), se();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/date-field/components/date-field-segment.svelte
var zc = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"id",
	"ref",
	"children",
	"child",
	"part"
]), Bc = i("<span><!></span>");
function Vc(e, t) {
	let n = I();
	p(t, !0);
	let r = L(t, "id", 19, () => Fe(n)), i = L(t, "ref", 15, null), a = A(t, zc), o = Oc.create(re(() => t.part), {
		id: Y(() => r()),
		ref: Y(() => i(), (e) => i(e))
	}), s = S(() => Me(a, o.props));
	var u = h(), f = V(u), g = (e) => {
		var n = h(), r = V(n);
		l(r, () => t.child, () => ({ props: B(s) })), m(e, n);
	}, _ = (e) => {
		var n = Bc();
		D(n, () => ({ ...B(s) }));
		var r = M(n);
		l(r, () => t.children ?? c), j(n), m(e, n);
	};
	d(f, (e) => {
		t.child ? e(g) : e(_, -1);
	}), m(e, u), se();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/date-picker/date-picker.svelte.js
var Hc = new Te("DatePicker.Root"), Uc = class e {
	static create(t) {
		return Hc.set(new e(t));
	}
	opts;
	constructor(e) {
		this.opts = e;
	}
};
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/date-picker/components/date-picker.svelte
function Wc(e, t) {
	p(t, !0);
	let n = L(t, "open", 15, !1), r = L(t, "onOpenChange", 3, ze), i = L(t, "onOpenChangeComplete", 3, ze), a = L(t, "value", 15), o = L(t, "onValueChange", 3, ze), u = L(t, "placeholder", 15), d = L(t, "onPlaceholderChange", 3, ze), f = L(t, "isDateUnavailable", 3, () => !1), g = L(t, "validate", 3, ze), _ = L(t, "onInvalid", 3, ze), v = L(t, "disabled", 3, !1), y = L(t, "readonly", 3, !1), b = L(t, "readonlySegments", 19, () => []), x = L(t, "hideTimeZone", 3, !1), S = L(t, "required", 3, !1), C = L(t, "calendarLabel", 3, "Event"), w = L(t, "disableDaysOutsideMonth", 3, !0), T = L(t, "preventDeselect", 3, !1), E = L(t, "pagedNavigation", 3, !1), D = L(t, "weekdayFormat", 3, "narrow"), O = L(t, "isDateDisabled", 3, () => !1), k = L(t, "fixedWeeks", 3, !1), A = L(t, "numberOfMonths", 3, 1), j = L(t, "closeOnDateSelect", 3, !0), ee = L(t, "initialFocus", 3, !1), M = L(t, "monthFormat", 3, "long"), N = L(t, "yearFormat", 3, "numeric"), te = re(() => Fa({
		granularity: t.granularity,
		defaultValue: a(),
		minValue: t.minValue,
		maxValue: t.maxValue
	}));
	function ne() {
		u() === void 0 && u(te);
	}
	ne(), ke.pre(() => u(), () => {
		ne();
	});
	function P() {
		j() && n(!1);
	}
	let F = Uc.create({
		open: Y(() => n(), (e) => {
			n(e), r()(e);
		}),
		value: Y(() => a(), (e) => {
			a(e), o()(e);
		}),
		placeholder: Y(() => u() ?? te, (e) => {
			u(e), d()(e);
		}),
		isDateUnavailable: Y(() => f()),
		minValue: Y(() => t.minValue),
		maxValue: Y(() => t.maxValue),
		disabled: Y(() => v()),
		readonly: Y(() => y()),
		granularity: Y(() => t.granularity),
		readonlySegments: Y(() => b()),
		hourCycle: Y(() => t.hourCycle),
		locale: Pt(() => t.locale),
		hideTimeZone: Y(() => x()),
		required: Y(() => S()),
		calendarLabel: Y(() => C()),
		disableDaysOutsideMonth: Y(() => w()),
		preventDeselect: Y(() => T()),
		pagedNavigation: Y(() => E()),
		weekStartsOn: Y(() => t.weekStartsOn),
		weekdayFormat: Y(() => D()),
		isDateDisabled: Y(() => O()),
		fixedWeeks: Y(() => k()),
		numberOfMonths: Y(() => A()),
		initialFocus: Y(() => ee()),
		onDateSelect: Y(() => P),
		defaultPlaceholder: te,
		monthFormat: Y(() => M()),
		yearFormat: Y(() => N())
	});
	Yn.create({
		open: F.opts.open,
		onOpenChangeComplete: Y(() => i())
	}), hc.create({
		value: F.opts.value,
		disabled: F.opts.disabled,
		readonly: F.opts.readonly,
		readonlySegments: F.opts.readonlySegments,
		validate: Y(() => g()),
		onInvalid: Y(() => _()),
		minValue: F.opts.minValue,
		maxValue: F.opts.maxValue,
		granularity: F.opts.granularity,
		hideTimeZone: F.opts.hideTimeZone,
		hourCycle: F.opts.hourCycle,
		locale: F.opts.locale,
		required: F.opts.required,
		placeholder: F.opts.placeholder,
		errorMessageId: Y(() => t.errorMessageId),
		isInvalidProp: Y(() => void 0)
	});
	var I = h(), R = V(I);
	s(R, () => In, (e, n) => {
		n(e, {
			children: (e, n) => {
				var r = h(), i = V(r);
				l(i, () => t.children ?? c), m(e, r);
			},
			$$slots: { default: !0 }
		});
	}), m(e, I), se();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/date-picker/components/date-picker-calendar.svelte
var Gc = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"children",
	"child",
	"id",
	"ref"
]), Kc = i("<div><!></div>");
function qc(e, t) {
	let n = I();
	p(t, !0);
	let r = L(t, "id", 19, () => Fe(n)), i = L(t, "ref", 15, null), a = A(t, Gc), o = Hc.get(), s = bs.create({
		id: Y(() => r()),
		ref: Y(() => i(), (e) => i(e)),
		calendarLabel: o.opts.calendarLabel,
		fixedWeeks: o.opts.fixedWeeks,
		isDateDisabled: o.opts.isDateDisabled,
		isDateUnavailable: o.opts.isDateUnavailable,
		locale: o.opts.locale,
		numberOfMonths: o.opts.numberOfMonths,
		pagedNavigation: o.opts.pagedNavigation,
		preventDeselect: o.opts.preventDeselect,
		readonly: o.opts.readonly,
		type: Y(() => "single"),
		weekStartsOn: o.opts.weekStartsOn,
		weekdayFormat: o.opts.weekdayFormat,
		disabled: o.opts.disabled,
		disableDaysOutsideMonth: o.opts.disableDaysOutsideMonth,
		maxValue: o.opts.maxValue,
		minValue: o.opts.minValue,
		placeholder: o.opts.placeholder,
		value: o.opts.value,
		onDateSelect: o.opts.onDateSelect,
		initialFocus: o.opts.initialFocus,
		defaultPlaceholder: o.opts.defaultPlaceholder,
		maxDays: Y(() => void 0),
		monthFormat: o.opts.monthFormat,
		yearFormat: o.opts.yearFormat
	}), u = S(() => Me(a, s.props));
	var f = h(), g = V(f), _ = (e) => {
		var n = h(), r = V(n);
		{
			let e = S(() => ({
				props: B(u),
				...s.snippetProps
			}));
			l(r, () => t.child, () => B(e));
		}
		m(e, n);
	}, v = (e) => {
		var n = Kc();
		D(n, () => ({ ...B(u) }));
		var r = M(n);
		l(r, () => t.children ?? c, () => s.snippetProps), j(n), m(e, n);
	};
	d(g, (e) => {
		t.child ? e(_) : e(v, -1);
	}), m(e, f), se();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/date-picker/components/date-picker-content.svelte
var Jc = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"ref",
	"onOpenAutoFocus"
]);
function Yc(e, t) {
	p(t, !0);
	let n = L(t, "ref", 15, null), r = A(t, Jc), i = S(() => Me({ onOpenAutoFocus: t.onOpenAutoFocus }, { onOpenAutoFocus: fs }));
	Zn(e, x(() => B(i), () => r, {
		get ref() {
			return n();
		},
		set ref(e) {
			n(e);
		}
	})), se();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/date-picker/components/date-picker-trigger.svelte
var Xc = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"ref",
	"onkeydown"
]);
function Zc(e, t) {
	p(t, !0);
	let n = L(t, "ref", 15, null), r = A(t, Xc);
	function i(e) {
		if (Ho(e.key)) {
			let t = e.currentTarget.closest(fc.selector("input"));
			if (!t) return;
			Io(e, t);
		}
	}
	let a = S(() => Me({ onkeydown: t.onkeydown }, { onkeydown: i }));
	$n(e, x(() => r, { "data-segment": "trigger" }, () => B(a), {
		get ref() {
			return n();
		},
		set ref(e) {
			n(e);
		}
	})), se();
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostHistoryRecordActionItems.svelte
var Qc = i("<div class=\"copy-icon svg-icon\" aria-hidden=\"true\"></div> <span> </span>", 1), $c = i("<div class=\"raw-json-icon svg-icon\" aria-hidden=\"true\"></div> <span> </span>", 1), el = i("<!> <!>", 1), tl = i("<div class=\"open-in-new-icon svg-icon\" aria-hidden=\"true\"></div> <span> </span>", 1), nl = i("<div class=\"broadcast-icon svg-icon\" aria-hidden=\"true\"></div> <span> </span>", 1), rl = i("<div class=\"trash-icon svg-icon\" aria-hidden=\"true\"></div> <span> </span>", 1), il = i("<!> <!> <!> <!>", 1), al = {
	hash: "svelte-8tu42h",
	code: ".open-in-new-icon {mask-image:var(--ehagaki-icon-6f70656e5f696e5f6e65775f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}"
};
function ol(e, n) {
	p(n, !0), ee(e, al);
	let r = () => R(Ie, "$_", i), [i, a] = ne(), o = (e) => {
		var i = h(), a = V(i);
		s(a, () => On, (e, i) => {
			i(e, {
				class: "menu-action-button",
				get onpointerdown() {
					return n.onCopyPointerDown;
				},
				get onSelect() {
					return n.onCopyNevent;
				},
				children: (e, i) => {
					var a = Qc(), o = E(V(a), 2), s = w(o, !0);
					P((e) => t(s, e), [() => n.copyFailed ? r()("postHistory.copyFailed") : r()("postHistory.copyNevent")]), m(e, a);
				},
				$$slots: { default: !0 }
			});
		}), m(e, i);
	}, c = (e) => {
		var i = el(), a = V(i), o = (e) => {
			Rr(e, {
				get pending() {
					return g();
				},
				get onSelect() {
					return f();
				}
			});
		};
		d(a, (e) => {
			f() && e(o);
		});
		var c = E(a, 2);
		s(c, () => On, (e, i) => {
			i(e, {
				class: "menu-action-button",
				onSelect: () => n.onShowRawJson(),
				children: (e, n) => {
					var i = $c(), a = E(V(i), 2), o = w(a, !0);
					P((e) => t(o, e), [() => r()("postHistory.rawJson")]), m(e, i);
				},
				$$slots: { default: !0 }
			});
		}), m(e, i);
	}, l = L(n, "externalClientLabel", 3, void 0), u = L(n, "onOpenExternalClient", 3, void 0), f = L(n, "onRepost", 3, void 0), g = L(n, "repostPending", 3, !1);
	var _ = il(), v = V(_), y = (e) => {
		var n = el(), r = V(n);
		s(r, () => On, (e, n) => {
			n(e, {
				class: "menu-action-button",
				get onSelect() {
					return u();
				},
				children: (e, n) => {
					var r = tl(), i = E(V(r), 2), a = w(i, !0);
					P(() => t(a, l())), m(e, r);
				},
				$$slots: { default: !0 }
			});
		});
		var i = E(r, 2);
		s(i, () => kn, (e, t) => {
			t(e, { class: "post-history-menu-separator" });
		}), m(e, n);
	};
	d(v, (e) => {
		l() && u() && e(y);
	});
	var b = E(v, 2), x = (e) => {
		var t = el(), n = V(t);
		c(n);
		var r = E(n, 2);
		o(r), m(e, t);
	}, S = (e) => {
		var t = el(), n = V(t);
		o(n);
		var r = E(n, 2);
		c(r), m(e, t);
	};
	d(b, (e) => {
		n.order === "raw-json-first" ? e(x) : e(S, -1);
	});
	var C = E(b, 2), T = (e) => {
		var i = h(), a = V(i);
		s(a, () => On, (e, i) => {
			i(e, {
				class: "menu-action-button",
				get disabled() {
					return n.broadcastSending;
				},
				get onpointerdown() {
					return n.onBroadcastPointerDown;
				},
				get onSelect() {
					return n.onBroadcastPost;
				},
				children: (e, n) => {
					var i = nl(), a = E(V(i), 2), o = w(a, !0);
					P((e) => t(o, e), [() => r()("postHistory.broadcast")]), m(e, i);
				},
				$$slots: { default: !0 }
			});
		}), m(e, i);
	};
	d(C, (e) => {
		n.showBroadcast && e(T);
	});
	var D = E(C, 2), O = (e) => {
		var i = el(), a = V(i), o = (e) => {
			var t = h(), n = V(t);
			s(n, () => kn, (e, t) => {
				t(e, { class: "post-history-menu-separator" });
			}), m(e, t);
		};
		d(a, (e) => {
			n.showDeleteSeparator && e(o);
		});
		var c = E(a, 2);
		s(c, () => On, (e, i) => {
			i(e, {
				class: "menu-action-button menu-action-button-danger",
				get disabled() {
					return n.deletionSending;
				},
				onSelect: () => n.onOpenDeleteConfirm(),
				children: (e, i) => {
					var a = rl(), o = E(V(a), 2), s = w(o, !0);
					P((e) => t(s, e), [() => n.deletionSending ? r()("postHistory.deleteSending") : r()("postHistory.delete")]), m(e, a);
				},
				$$slots: { default: !0 }
			});
		}), m(e, i);
	};
	d(D, (e) => {
		n.showDelete && e(O);
	}), m(e, _), se(), a();
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostHistoryQuotePreview.svelte
var sl = i("<article class=\"post-history-quote-status-card svelte-1rnem6w\"><div class=\"post-history-quote-status-body svelte-1rnem6w\"><p> </p> <!></div></article>"), cl = {
	hash: "svelte-1rnem6w",
	code: ".post-history-quote-status-card.svelte-1rnem6w {display:grid;border-inline-start:2px solid\n            color-mix(in srgb, var(--theme), transparent 45%);background:color-mix(in srgb, var(--dialog-bg), var(--border-hr) 24%);color:var(--text);font-size:0.9rem;}.post-history-quote-status-body.svelte-1rnem6w {display:grid;gap:8px;padding:2px 10px 10px;}.post-history-quote-status-message.svelte-1rnem6w {margin:0;color:var(--text-muted);line-height:1.45;}.post-history-quote-status-error.svelte-1rnem6w {color:var(--danger);}.post-history-quote-retry-button {justify-self:start;}"
};
function ll(n, r) {
	p(r, !0), ee(n, cl);
	let i = () => R(Ie, "$_", a), [a, s] = ne(), c = L(r, "model", 3, void 0), l = L(r, "loadSensitiveBody", 3, void 0), u = L(r, "emojiLoadStateByUrl", 19, () => ({})), f = L(r, "emojiImageMetaByUrl", 19, () => ({})), g = L(r, "scrollRoot", 3, null), _ = L(r, "onImageOpen", 3, void 0), v = L(r, "onRetry", 3, void 0), y = L(r, "footerActions", 3, void 0), b = L(r, "footerDetails", 3, void 0), x = L(r, "footerMenu", 3, void 0);
	function S() {
		switch (r.preview.status) {
			case "deleted": return i()("postHistory.quoteDeleted");
			case "not-found": return i()("postHistory.quoteNotFound");
			case "error": return i()("postHistory.quoteFetchFailed");
			default: return i()("postHistory.quoteLoading");
		}
	}
	var C = h(), T = V(C), D = (e) => {
		pr(e, {
			get event() {
				return r.preview.event;
			},
			get profile() {
				return r.preview.profile;
			},
			get model() {
				return c();
			},
			get loadSensitiveBody() {
				return l();
			},
			get emojiLoadStateByUrl() {
				return u();
			},
			get emojiImageMetaByUrl() {
				return f();
			},
			get scrollRoot() {
				return g();
			},
			get onImageOpen() {
				return _();
			},
			get footerActions() {
				return y();
			},
			get footerDetails() {
				return b();
			},
			get footerMenu() {
				return x();
			}
		});
	}, O = (n) => {
		var a = sl(), s = M(a), c = M(s);
		let l;
		var u = w(c, !0), f = E(c, 2), p = (n) => {
			Q(n, {
				type: "button",
				className: "post-history-quote-retry-button",
				onClick: () => v()?.(r.preview.eventId),
				children: (n, r) => {
					e();
					var a = o();
					P((e) => t(a, e), [() => i()("postHistory.contextRetry")]), m(n, a);
				},
				$$slots: { default: !0 }
			});
		};
		d(f, (e) => {
			r.preview.status === "error" && e(p);
		}), j(s), j(a), P((e) => {
			l = oe(c, 1, "post-history-quote-status-message svelte-1rnem6w", null, l, { "post-history-quote-status-error": r.preview.status === "error" }), t(u, e);
		}, [() => S()]), m(n, a);
	};
	d(T, (e) => {
		r.preview.status === "resolved" ? e(D) : e(O, -1);
	}), m(n, C), se(), s();
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryOperationWakeLock.ts
function ul() {
	let e = 0, t = 0, n = !1, r = null, i = null, a = null;
	async function o(e) {
		if (!e.released) try {
			await e.release();
		} catch {}
	}
	function s() {
		let e = i;
		return i = null, a?.(), a = null, e;
	}
	function c() {
		let e = s();
		e && o(e);
	}
	async function l() {
		if (e === 0 || r?.visibilityState !== "visible" || n || i && !i.released) return;
		s(), n = !0;
		let c = t;
		try {
			if (typeof navigator > "u" || typeof navigator.wakeLock?.request != "function") return;
			let n = await navigator.wakeLock.request("screen");
			if (c !== t || e === 0 || r?.visibilityState !== "visible" || n.released) {
				await o(n);
				return;
			}
			i = n;
			let l = () => {
				i === n && s();
			};
			n.addEventListener("release", l), a = () => n.removeEventListener("release", l);
		} catch {} finally {
			n = !1, c !== t && l();
		}
	}
	function u() {
		r?.visibilityState === "visible" ? l() : (t += 1, c());
	}
	return { acquire() {
		e++ === 0 && (r = typeof document > "u" ? null : document, r?.addEventListener("visibilitychange", u)), l();
		let n = !1;
		return () => {
			n || (n = !0, !(--e > 0) && (t += 1, r?.removeEventListener("visibilitychange", u), r = null, c()));
		};
	} };
}
var dl = ul();
// D:/ドキュメント/GitHub/ehagaki/src/lib/storage/postHistoryImportedRangesRepository.ts
function fl(e, t, n) {
	return e?.schemaVersion === 1 && e.source === "citrine-backup" && e.ownerPubkeyHex === t && e.kindsKey === n && Array.isArray(e.ranges) ? ct(e.ranges) : [];
}
var pl = "postHistoryImportedRanges:", ml = new class {
	db;
	now;
	constructor(e = We, t = Date.now) {
		this.db = e, this.now = t;
	}
	async get(e, t) {
		return this.db.transaction("r", this.db.postHistoryCitrineRanges, this.db.postHistoryWriteGeneration, async () => {
			let n = await yt(this.db, e), r = (await this.db.postHistoryCitrineRanges.get(`${pl}${e}:${t}`))?.value, i = fl(r, e, t);
			return {
				schemaVersion: 1,
				source: "citrine-backup",
				ownerPubkeyHex: e,
				kindsKey: t,
				localRevision: n,
				ranges: r?.localRevision === n ? i : []
			};
		});
	}
	async record(e) {
		return this.db.transaction("rw", this.db.postHistoryCitrineRanges, this.db.postHistoryWriteGeneration, async () => {
			await lt(this.db, e);
			let t = await this.get(e.ownerPubkeyHex, e.kindsKey), n = ct([...t.ranges, e.range]);
			if (JSON.stringify(n) === JSON.stringify(t.ranges)) return !1;
			let r = await yt(this.db, e.ownerPubkeyHex);
			return await this.db.postHistoryCitrineRanges.put({
				id: `${pl}${e.ownerPubkeyHex}:${e.kindsKey}`,
				ownerPubkeyHex: e.ownerPubkeyHex,
				value: {
					schemaVersion: 1,
					source: "citrine-backup",
					ownerPubkeyHex: e.ownerPubkeyHex,
					kindsKey: e.kindsKey,
					localRevision: r,
					ranges: n
				},
				updatedAt: this.now()
			}), await lt(this.db, e), !0;
		});
	}
}(), hl = 250, gl = /^[0-9a-f]{64}$/;
function _l() {
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
function vl(e) {
	return { ...e };
}
function yl(e) {
	return e.tags.filter((e) => e[0] === "e" && typeof e[1] == "string" && gl.test(e[1])).length;
}
var bl = new class {
	verificationSessionFactory;
	getLocalRevision;
	importedRangesRepository;
	postHistoryRepository;
	deletionRequestsRepository;
	sensitivePayloadRepository;
	constructor(e = {}) {
		this.verificationSessionFactory = e.verificationSessionFactory ?? Ke, this.getLocalRevision = e.getLocalRevision ?? ((e) => yt(We, e)), this.importedRangesRepository = e.importedRangesRepository ?? ml, this.postHistoryRepository = e.postHistoryRepository ?? Z, this.deletionRequestsRepository = e.deletionRequestsRepository ?? tn, this.sensitivePayloadRepository = e.sensitivePayloadRepository ?? bt;
	}
	async importFile(e) {
		let t = _l(), n = /* @__PURE__ */ new Set(), r = [], i = !1, a = !1, o = !1, s = null, c = null, l = !0, u = 0, d = /^citrine-([1-9]\d*)\.jsonl$/.exec(e.file.name ?? "")?.[1], f = d !== void 0 && Number.isSafeInteger(Number(d)) && Number(d) <= 864e13, p = Math.floor(Math.min(Number(d), Date.now()) / 1e3), m = null, h = Number.isFinite(e.file.size) && e.file.size > 0 ? e.file.size : 0, g = 0, _ = () => t.invalidJsonCount > 0 || t.invalidStructureCount > 0 || t.invalidIdOrSignatureCount > 0, v = () => e.signal?.aborted ? "cancelled" : e.getCurrentPubkeyHex() === e.ownerPubkeyHex ? o ? t.nonEmptyLineCount > 0 ? "partial" : "failed" : a ? "cancelled" : null : "account-changed", y = (n = !1) => {
			if (!e.onProgress) return;
			let r = performance.now();
			!n && m !== null && r - m < hl || (m = r, e.onProgress({
				result: vl(t),
				processedBytes: g,
				totalBytes: h
			}));
		}, b = (e) => {
			e <= 0 || (g = Math.min(h, Math.max(g, g + e)));
		};
		try {
			t.localRevision = await this.getLocalRevision(e.ownerPubkeyHex);
		} catch {
			return t.status = "failed", y(!0), t;
		}
		let x, S = null, C, w = () => {
			x?.cancel().catch(() => void 0);
		};
		try {
			try {
				C = this.verificationSessionFactory({
					signal: e.signal,
					onFatal: (e) => {
						S = e, w();
					}
				}), await C.ready;
			} catch {
				return t.status = v() ?? "failed", y(!0), t;
			}
			let d = C, m = {
				ownerPubkeyHex: e.ownerPubkeyHex,
				expectedRevision: t.localRevision,
				isActive: () => v() === null
			}, g = async () => {
				try {
					await this.getLocalRevision(e.ownerPubkeyHex) !== m.expectedRevision && (a = !0);
				} catch {
					o = !0;
				}
				return v();
			}, T = async () => {
				let n = await g();
				if (n) return r.length = 0, n;
				if (r.length === 0) return v();
				let o = v();
				if (o) return r.length = 0, o;
				let s = r.filter((e) => e.type === "post").map((e) => ({
					event: e.event,
					attestation: e.attestation
				})), c = r.filter((e) => e.type === "deletion").map((e) => ({
					event: e.event,
					attestation: e.attestation
				})), l = r.filter((e) => e.type === "payload").map((e) => ({
					event: e.event,
					attestation: e.attestation
				}));
				if (r.length = 0, s.length > 0) try {
					let e = await this.postHistoryRepository.upsertFetchedEvents({
						events: s,
						localWriteScope: m
					});
					if (e.applied === !1) return a = !0, v();
					t.insertedPostCount += e.insertedCount, t.updatedPostCount += e.updatedCount, t.unchangedPostCount += e.unchangedCount, t.appliedDeletionPostCount += e.appliedDeletionCount;
				} catch (e) {
					if (e instanceof Ct) return a = !0, v();
					t.failedPostEventCount += s.length, i = !0;
				}
				let u = v();
				if (u) return u;
				if (c.length > 0) try {
					let n = await this.deletionRequestsRepository.upsertImportedDeletionEvents({
						ownerPubkeyHex: e.ownerPubkeyHex,
						deletionEvents: c,
						localWriteScope: m
					});
					t.insertedDeletionRequestCount += n.insertedCount, t.updatedDeletionRequestCount += n.updatedCount, t.unchangedDeletionRequestCount += n.unchangedCount, t.unsupportedDeletionEventCount += n.ignoredCount, t.appliedDeletionPostCount += n.appliedDeletionCount;
				} catch (e) {
					if (e instanceof Ct) return a = !0, v();
					t.failedDeletionEventCount += c.length, i = !0;
				}
				for (let e of l) {
					let n = v();
					if (n) return n;
					try {
						await this.sensitivePayloadRepository.putCandidate({
							...e,
							localWriteScope: m
						}), t.savedPayloadCandidateCount += 1;
					} catch (e) {
						if (e instanceof Ct) return a = !0, v();
						t.failedPayloadEventCount += 1, i = !0;
					}
				}
				return y(), g();
			}, E = (t) => {
				if (t.trim().length === 0) return Promise.resolve({ type: "empty" });
				let n;
				try {
					n = JSON.parse(t);
				} catch {
					return Promise.resolve({
						type: "rejected",
						counter: "invalidJsonCount"
					});
				}
				if (!ue(n)) return Promise.resolve({
					type: "rejected",
					counter: "invalidStructureCount"
				});
				let r = n;
				return r.pubkey === e.ownerPubkeyHex ? !rt(r.kind) && ![36, 5].includes(r.kind) ? Promise.resolve({
					type: "rejected",
					counter: "unsupportedKindCount"
				}) : d.verify(r).then((e) => ({
					type: "verified",
					verified: e
				}), () => ({ type: "fatal" })) : Promise.resolve({
					type: "rejected",
					counter: "otherAccountCount"
				});
			}, D = [], O = () => {
				let e = v();
				if (e) throw Error(e);
				if (S) throw S;
			}, k = async (e = !1) => {
				O();
				let i = await D.shift();
				if (e && await g(), O(), i.type === "fatal") throw Error("post_history_import_worker_failed");
				if (i.type === "empty") return;
				if (i.type === "bytes") {
					b(i.count), y();
					return;
				}
				if (t.nonEmptyLineCount += 1, i.type === "rejected") {
					t[i.counter] += 1;
					return;
				}
				let a = i.verified;
				if (!a) {
					t.invalidIdOrSignatureCount += 1;
					return;
				}
				let o = a.event;
				if (n.has(o.id)) t.fileDuplicateCount += 1;
				else {
					if (n.add(o.id), o.kind === 36) t.uniquePayloadEventCount += 1, r.push({
						type: "payload",
						...a
					});
					else if (rt(o.kind)) t.uniquePostEventCount += 1, !Number.isSafeInteger(o.created_at) || o.created_at < 0 || o.created_at >= 2 ** 53 - 1 ? l = !1 : o.created_at <= p && (s = Math.min(s ?? o.created_at, o.created_at), c = Math.max(c ?? o.created_at, o.created_at)), r.push({
						type: "post",
						...a
					});
					else if (o.kind === 5) {
						t.uniqueDeletionEventCount += 1;
						let e = yl(o);
						if (t.validDeletionETagCount += e, e === 0) {
							t.unsupportedDeletionEventCount += 1;
							return;
						}
						r.push({
							type: "deletion",
							...a
						});
					}
					if (r.length >= 500) {
						let e = await T();
						if (e) throw Error(e);
					}
				}
			}, A = performance.now(), j = async (e) => {
				D.length >= 32 && await k(), O(), D.push(e()), performance.now() - A >= 8 && (await new Promise((e) => setTimeout(e, 0)), A = performance.now(), O());
			}, ee = async (e = !1) => {
				for (; D.length;) await k(e);
			};
			try {
				x = e.file.stream().getReader();
			} catch {
				return t.status = "failed", y(!0), t;
			}
			e.signal?.addEventListener("abort", w, { once: !0 });
			let M = new TextDecoder("utf-8", { fatal: !0 }), N = "", te = !1, ne = (e, t = !1) => {
				try {
					return M.decode(e, { stream: t });
				} catch (e) {
					throw te = !0, e;
				}
			};
			try {
				for (;;) {
					O();
					let e;
					try {
						e = await x.read();
					} catch (e) {
						throw te = !0, e;
					}
					if (O(), e.done) {
						N += ne(), N.length > 0 && await j(() => E(N.replace(/\r$/, "")));
						break;
					}
					u += e.value.byteLength, N += ne(e.value, !0);
					let t = N.split("\n");
					N = t.pop() ?? "";
					for (let e of t) await j(() => E(e.replace(/\r$/, "")));
					let n = e.value.byteLength;
					await j(() => Promise.resolve({
						type: "bytes",
						count: n
					}));
				}
				await ee();
			} catch {
				if (w(), await g(), te && !S && !v()) try {
					await ee(!0);
				} catch {}
				D.length = 0;
				let e = v();
				if (e) return t.status = e, r.length = 0, y(!0), t;
				let n = await T();
				return n ? (t.status = n, y(!0), t) : (t.status = "partial", y(!0), t);
			} finally {
				e.signal?.removeEventListener("abort", w), x.releaseLock();
			}
			let P = await T();
			if (P) return t.status = P, y(!0), t;
			if (S) return t.status = "partial", y(!0), t;
			if (t.status = i || _() ? "partial" : "completed", f && t.status === "completed" && u === h && l && s !== null && c !== null && t.insertedPostCount + t.updatedPostCount + t.unchangedPostCount === t.uniquePostEventCount) try {
				t.restoredRangeChanged = await this.importedRangesRepository.record({
					...m,
					kindsKey: Xn([...Ze]),
					isActive: () => m.isActive() && !S,
					range: {
						since: s,
						until: c
					}
				});
			} catch (e) {
				S && !v() ? t.status = "partial" : e instanceof Ct ? (a = !0, t.status = v()) : (t.status = "partial", t.restoredRangeSaveFailed = !0);
			}
			return y(!0), t;
		} finally {
			w(), C?.dispose();
		}
	}
}(), xl = i("<div class=\"xmark-icon svg-icon svelte-1qfqhib\" aria-hidden=\"true\"></div>"), Sl = i("<span class=\"import-icon svg-icon svelte-1qfqhib\" aria-hidden=\"true\"></span> <span> </span>", 1), Cl = i("<div aria-live=\"polite\"> </div>"), wl = i("<div class=\"import-progress-indicator\"></div>"), Tl = i("<div class=\"import-progress svelte-1qfqhib\"><!> <div class=\"import-progress-summary svelte-1qfqhib\"><span class=\"import-progress-metric svelte-1qfqhib\"><span> </span> <span class=\"import-progress-number svelte-1qfqhib\"> </span></span> <span class=\"import-progress-metric svelte-1qfqhib\"><span> </span> <span class=\"import-progress-number svelte-1qfqhib\"> </span></span> <span class=\"import-progress-metric svelte-1qfqhib\"><span> </span> <span class=\"import-progress-number svelte-1qfqhib\"> </span></span></div> <!></div>"), El = i("<div class=\"import-results svelte-1qfqhib\"><section aria-labelledby=\"post-history-import-input-heading\" class=\"svelte-1qfqhib\"><h3 id=\"post-history-import-input-heading\" class=\"svelte-1qfqhib\"> </h3> <dl class=\"svelte-1qfqhib\"><div class=\"svelte-1qfqhib\"><dt class=\"svelte-1qfqhib\"> </dt><dd class=\"svelte-1qfqhib\"> </dd></div> <div class=\"svelte-1qfqhib\"><dt class=\"svelte-1qfqhib\"> </dt><dd class=\"svelte-1qfqhib\"> </dd></div> <div class=\"svelte-1qfqhib\"><dt class=\"svelte-1qfqhib\"> </dt><dd class=\"svelte-1qfqhib\"> </dd></div> <div class=\"svelte-1qfqhib\"><dt class=\"svelte-1qfqhib\"> </dt><dd class=\"svelte-1qfqhib\"> </dd></div> <div class=\"svelte-1qfqhib\"><dt class=\"svelte-1qfqhib\"> </dt><dd class=\"svelte-1qfqhib\"> </dd></div> <div class=\"svelte-1qfqhib\"><dt class=\"svelte-1qfqhib\"> </dt><dd class=\"svelte-1qfqhib\"> </dd></div> <div class=\"svelte-1qfqhib\"><dt class=\"svelte-1qfqhib\"> </dt><dd class=\"svelte-1qfqhib\"> </dd></div></dl></section> <section aria-labelledby=\"post-history-import-post-heading\" class=\"svelte-1qfqhib\"><h3 id=\"post-history-import-post-heading\" class=\"svelte-1qfqhib\"> </h3> <dl class=\"svelte-1qfqhib\"><div class=\"svelte-1qfqhib\"><dt class=\"svelte-1qfqhib\"> </dt><dd class=\"svelte-1qfqhib\"> </dd></div> <div class=\"svelte-1qfqhib\"><dt class=\"svelte-1qfqhib\"> </dt><dd class=\"svelte-1qfqhib\"> </dd></div> <div class=\"svelte-1qfqhib\"><dt class=\"svelte-1qfqhib\"> </dt><dd class=\"svelte-1qfqhib\"> </dd></div> <div class=\"svelte-1qfqhib\"><dt class=\"svelte-1qfqhib\"> </dt><dd class=\"svelte-1qfqhib\"> </dd></div> <div class=\"svelte-1qfqhib\"><dt class=\"svelte-1qfqhib\"> </dt><dd class=\"svelte-1qfqhib\"> </dd></div> <div class=\"svelte-1qfqhib\"><dt class=\"svelte-1qfqhib\"> </dt><dd class=\"svelte-1qfqhib\"> </dd></div></dl></section> <section aria-labelledby=\"post-history-import-deletion-heading\" class=\"svelte-1qfqhib\"><h3 id=\"post-history-import-deletion-heading\" class=\"svelte-1qfqhib\"> </h3> <dl class=\"svelte-1qfqhib\"><div class=\"svelte-1qfqhib\"><dt class=\"svelte-1qfqhib\"> </dt><dd class=\"svelte-1qfqhib\"> </dd></div> <div class=\"svelte-1qfqhib\"><dt class=\"svelte-1qfqhib\"> </dt><dd class=\"svelte-1qfqhib\"> </dd></div> <div class=\"svelte-1qfqhib\"><dt class=\"svelte-1qfqhib\"> </dt><dd class=\"svelte-1qfqhib\"> </dd></div> <div class=\"svelte-1qfqhib\"><dt class=\"svelte-1qfqhib\"> </dt><dd class=\"svelte-1qfqhib\"> </dd></div> <div class=\"svelte-1qfqhib\"><dt class=\"svelte-1qfqhib\"> </dt><dd class=\"svelte-1qfqhib\"> </dd></div> <div class=\"svelte-1qfqhib\"><dt class=\"svelte-1qfqhib\"> </dt><dd class=\"svelte-1qfqhib\"> </dd></div> <div class=\"svelte-1qfqhib\"><dt class=\"svelte-1qfqhib\"> </dt><dd class=\"svelte-1qfqhib\"> </dd></div></dl></section></div>"), Dl = i("<div class=\"import-heading svelte-1qfqhib\"><h2 class=\"svelte-1qfqhib\"> </h2> <p class=\"svelte-1qfqhib\"> </p></div> <input class=\"visually-hidden import-file-input\" type=\"file\"/> <div role=\"presentation\"><!> <p class=\"import-drop-hint svelte-1qfqhib\"> </p></div> <!> <!>", 1), Ol = {
	hash: "svelte-1qfqhib",
	code: ".import-heading.svelte-1qfqhib {width:100%;text-align:left;}.import-heading.svelte-1qfqhib h2:where(.svelte-1qfqhib),\n    .import-heading.svelte-1qfqhib p:where(.svelte-1qfqhib) {margin:0;}.import-heading.svelte-1qfqhib h2:where(.svelte-1qfqhib) {font-size:1.1rem;}.import-heading.svelte-1qfqhib p:where(.svelte-1qfqhib) {margin-top:6px;color:var(--text-muted);font-size:0.88rem;line-height:1.5;}.post-history-import-file-button {margin-top:0;}.import-drop-zone.svelte-1qfqhib {width:100%;margin-top:16px;padding:0;border:1px dashed transparent;border-radius:10px;text-align:center;transition:background-color 120ms ease, border-color 120ms ease;}.import-drop-zone-active.svelte-1qfqhib {border-color:var(--accent-color);background:color-mix(in srgb, var(--accent-color), transparent 90%);}.import-drop-hint.svelte-1qfqhib {display:none;margin:8px 0 0;color:var(--text-muted);font-size:0.8rem;}\n\n    @media (hover: hover) and (pointer: fine) {.import-drop-zone.svelte-1qfqhib {min-height:136px;box-sizing:border-box;padding:20px 16px 28px;}.import-drop-hint.svelte-1qfqhib {display:block;}\n    }.import-icon.svelte-1qfqhib {mask-image:var(--ehagaki-icon-636c6f75645f646f776e6c6f61645f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.xmark-icon.svelte-1qfqhib {mask-image:var(--ehagaki-icon-636c6f73655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.import-progress.svelte-1qfqhib {width:100%;margin-top:12px;}.import-progress-status.svelte-1qfqhib {margin-bottom:8px;color:var(--text);font-size:0.9rem;}.import-progress-status-error.svelte-1qfqhib {color:var(--error-color, #d32f2f);}.import-progress-summary.svelte-1qfqhib {display:grid;grid-template-columns:repeat(3, minmax(0, 1fr));gap:8px;margin-bottom:8px;color:var(--text-muted);font-size:0.82rem;font-variant-numeric:tabular-nums;}.import-progress-metric.svelte-1qfqhib {display:flex;flex-direction:column;align-items:center;gap:3px;min-width:0;}.import-progress-number.svelte-1qfqhib {color:var(--text);text-align:center;}.import-progress-root {width:100%;height:12px;border-radius:999px;background-color:color-mix(in srgb, var(--text) 12%, transparent);overflow:hidden;}.import-progress-indicator {width:100%;height:100%;border-radius:inherit;background-color:var(--theme);transition:translate 0.3s ease;}\n\n    @media (prefers-reduced-motion: reduce) {.import-progress-indicator {transition:none;}\n    }.import-results.svelte-1qfqhib {display:grid;grid-template-columns:repeat(3, minmax(0, 1fr));gap:8px;width:100%;margin-top:12px;}.import-results.svelte-1qfqhib section:where(.svelte-1qfqhib) {min-width:0;padding:10px;border:1px solid var(--border-hr);border-radius:8px;}.import-results.svelte-1qfqhib h3:where(.svelte-1qfqhib) {margin:0 0 8px;font-size:0.9rem;}.import-results.svelte-1qfqhib dl:where(.svelte-1qfqhib),\n    .import-results.svelte-1qfqhib dl:where(.svelte-1qfqhib) div:where(.svelte-1qfqhib) {margin:0;}.import-results.svelte-1qfqhib dl:where(.svelte-1qfqhib) div:where(.svelte-1qfqhib) {display:flex;justify-content:space-between;gap:8px;padding-block:3px;font-size:0.8rem;}.import-results.svelte-1qfqhib dt:where(.svelte-1qfqhib) {min-width:0;color:var(--text-muted);}.import-results.svelte-1qfqhib dd:where(.svelte-1qfqhib) {flex:0 0 auto;font-variant-numeric:tabular-nums;}.post-history-import-dialog {max-width:min(760px, calc(100% - 10px));}\n\n    @media (max-width: 680px) {.import-progress-summary.svelte-1qfqhib {grid-template-columns:1fr;}.import-progress-metric.svelte-1qfqhib {flex-direction:row;justify-content:space-between;gap:6px;}.import-progress-number.svelte-1qfqhib {text-align:right;}.import-results.svelte-1qfqhib {grid-template-columns:1fr;}\n    }"
};
function kl(e, r) {
	p(r, !0), ee(e, Ol);
	let i = () => R(Ie, "$_", a), [a, o] = ne(), c = L(r, "open", 15, !1), l = L(r, "onOpenChange", 3, void 0), u = L(r, "onImported", 3, void 0), f = b(null), _ = b(!1), y = b(null), C = b(null), D = b(0), O = b(0), A = b(0), N = b(F([])), te = b(0), I = null, re = null, ce = null, le = 0, ue = null, de = !1, H = null, U = S(() => B(C)?.processedBytes ?? B(D)), fe = S(() => B(C)?.totalBytes ?? B(O)), pe = S(() => B(fe) <= 0 ? 0 : Math.min(100, Math.max(0, Math.round(B(U) / B(fe) * 100)))), me = S(() => {
		let e = B(N)[0], t = B(N).at(-1);
		if (!e || !t || B(N).length < 3 || t.elapsedMs - e.elapsedMs < 2e3 || B(A) - t.elapsedMs > 1e4 || B(U) <= 0 || B(fe) <= 0 || B(U) >= B(fe) || B(A) <= e.elapsedMs) return null;
		let n = (t.bytes - e.bytes) / (B(A) - e.elapsedMs), r = (B(fe) - B(U)) / n;
		return Number.isFinite(r) && r >= 0 ? r : null;
	}), he = S(() => B(_) ? B(me) === null ? i()("postHistory.importRemainingTimeCalculating") : ge(B(me)) : B(y)?.status === "completed" || B(y)?.status === "partial" ? ge(0) : i()("postHistory.importRemainingTimeUnavailable"));
	function ge(e) {
		let t = Math.max(0, Math.floor(e / 1e3)), n = String(t % 60).padStart(2, "0"), r = Math.floor(t / 60), i = r % 60;
		return r < 60 ? `${i}:${n}` : `${Math.floor(r / 60)}:${String(i).padStart(2, "0")}:${n}`;
	}
	function W() {
		ce !== null && k(A, Math.max(0, performance.now() - ce), !0);
	}
	function _e() {
		re !== null && (clearInterval(re), re = null), ce = null;
	}
	function ve() {
		_e(), k(A, 0), ce = performance.now(), re = setInterval(W, 1e3);
	}
	function ye() {
		_e(), k(C, null), k(D, 0), k(O, 0), k(A, 0), k(N, [], !0);
	}
	function be(e) {
		if (e.result.insertedPostCount + e.result.updatedPostCount + e.result.unchangedPostCount + e.result.insertedDeletionRequestCount + e.result.updatedDeletionRequestCount + e.result.unchangedDeletionRequestCount + e.result.savedPayloadCandidateCount === 0 || (B(N).at(-1)?.elapsedMs ?? -1) >= B(A)) return;
		let t = [...B(N), {
			elapsedMs: B(A),
			bytes: e.processedBytes
		}];
		for (; t.length > 1 && t[1].elapsedMs <= B(A) - 1e4;) t.shift();
		k(N, t, !0);
	}
	function xe(e) {
		return `translate: -${100 - e}% 0;`;
	}
	let Se = S(() => B(_) ? "postHistory.importReading" : B(y) ? B(y).status === "completed" ? "postHistory.importComplete" : B(y).status === "partial" ? B(y).restoredRangeSaveFailed ? "postHistory.importBackupRangeFailed" : "postHistory.importPartial" : B(y).status === "account-changed" ? "postHistory.importAccountChanged" : B(y).status === "cancelled" ? "postHistory.importCancelled" : "postHistory.importFailed" : null);
	function Ce() {
		k(y, null), k(_, !1), ye(), k(te, 0), I = null, B(f) && (B(f).value = "");
	}
	function we() {
		H?.(), H = null, le += 1, I?.abort(), I = null, k(_, !1), ye(), k(te, 0);
	}
	function G(e) {
		e || we(), l()?.(e);
	}
	function Te() {
		!B(_) && r.ownerPubkeyHex && B(f)?.click();
	}
	function K(e) {
		return e ? Array.from(e.types).includes("Files") || e.files.length > 0 : !1;
	}
	function Ee(e) {
		K(e.dataTransfer) && (e.preventDefault(), k(te, B(te) + 1));
	}
	function De(e) {
		e.preventDefault(), K(e.dataTransfer);
	}
	function Oe(e) {
		(B(te) !== 0 || K(e.dataTransfer)) && k(te, Math.max(0, B(te) - 1), !0);
	}
	function ke(e) {
		if (e.preventDefault(), !K(e.dataTransfer)) return;
		k(te, 0);
		let t = e.dataTransfer?.files[0];
		t && Ae(t);
	}
	async function Ae(e) {
		if (B(_) || !r.ownerPubkeyHex) return;
		let t = ++le, n = r.ownerPubkeyHex;
		ue = n;
		let i = new AbortController();
		I = i, k(_, !0), k(y, null), k(C, null), k(D, 0), k(O, Number.isFinite(e.size) && e.size > 0 ? e.size : 0, !0), k(N, [], !0), ve();
		let a = dl.acquire();
		H = a;
		try {
			let a = await bl.importFile({
				file: e,
				ownerPubkeyHex: n,
				getCurrentPubkeyHex: r.getCurrentPubkeyHex,
				signal: i.signal,
				onProgress: (e) => {
					t === le && c() && (k(C, {
						result: { ...e.result },
						processedBytes: e.processedBytes,
						totalBytes: e.totalBytes
					}, !0), k(D, e.processedBytes, !0), k(O, e.totalBytes, !0), k(y, { ...e.result }, !0), W(), be(e));
				}
			});
			if (t !== le || !c() || (k(y, a, !0), r.getCurrentPubkeyHex() !== n || r.ownerPubkeyHex !== n)) return;
			if (a.localRevision !== void 0) try {
				if (await yt(We, n) !== a.localRevision) return;
			} catch {
				return;
			}
			if (t !== le || !c() || r.getCurrentPubkeyHex() !== n) return;
			(a.insertedPostCount + a.updatedPostCount + a.appliedDeletionPostCount > 0 || a.restoredRangeChanged) && await u()?.(a);
		} finally {
			a(), H === a && (H = null), t === le && (k(_, !1), _e(), I = null);
		}
	}
	async function je(e) {
		let t = e.currentTarget, n = t.files?.[0];
		t.value = "", n && await Ae(n);
	}
	z(() => {
		B(_) && r.ownerPubkeyHex !== ue && we();
	}), z(() => {
		c() && !de ? Ce() : !c() && de && we(), de = c();
	}), ie(() => {
		H?.(), H = null, le += 1, I?.abort(), _e();
	});
	{
		let a = (e) => {
			var t = h(), n = V(t);
			{
				let e = (e, t) => {
					let n = () => (t?.()).props;
					{
						let t = S(() => i()("global.close"));
						Q(e, x(n, {
							className: "modal-close",
							shape: "square",
							get ariaLabel() {
								return B(t);
							},
							children: (e, t) => {
								var n = xl();
								m(e, n);
							},
							$$slots: { default: !0 }
						}));
					}
				};
				s(n, () => Ln, (t, n) => {
					n(t, {
						child: e,
						$$slots: { child: !0 }
					});
				});
			}
			m(e, t);
		}, o = S(() => i()("postHistory.importTitle")), l = S(() => i()("postHistory.importDescription"));
		$(e, {
			onOpenChange: G,
			get title() {
				return B(o);
			},
			get description() {
				return B(l);
			},
			contentClass: "post-history-import-dialog",
			footerVariant: "close-button",
			initialFocus: "content",
			get open() {
				return c();
			},
			set open(e) {
				c(e);
			},
			footer: a,
			children: (e, a) => {
				var o = Dl(), c = V(o), l = M(c), u = w(l, !0), p = E(l, 2), h = w(p, !0);
				j(c);
				var b = E(c, 2);
				T(b, (e) => k(f, e), () => B(f));
				var x = E(b, 2);
				let C;
				var D = M(x);
				{
					let e = S(() => B(_) || !r.ownerPubkeyHex), n = S(() => i()("postHistory.importChooseFile"));
					Q(D, {
						className: "post-history-import-file-button",
						variant: "default",
						shape: "pill",
						get disabled() {
							return B(e);
						},
						get ariaLabel() {
							return B(n);
						},
						onClick: Te,
						children: (e, n) => {
							var r = Sl(), a = E(V(r), 2), o = w(a, !0);
							P((e) => t(o, e), [() => i()("postHistory.importChooseFile")]), m(e, r);
						},
						$$slots: { default: !0 }
					});
				}
				var O = E(D, 2), ee = w(O, !0);
				j(x);
				var N = E(x, 2), ne = (e) => {
					var r = Tl(), a = M(r), o = (e) => {
						var n = Cl();
						let r;
						var a = w(n, !0);
						P((e) => {
							r = oe(n, 1, "import-progress-status svelte-1qfqhib", null, r, { "import-progress-status-error": B(y)?.status === "failed" }), t(a, e);
						}, [() => i()(B(Se))]), m(e, n);
					};
					d(a, (e) => {
						B(Se) && e(o);
					});
					var c = E(a, 2), l = M(c), u = M(l), f = w(u, !0), p = E(u, 2), h = w(p);
					j(l);
					var g = E(l, 2), _ = M(g), v = w(_, !0), b = E(_, 2), x = w(b, !0);
					j(g);
					var C = E(g, 2), T = M(C), D = w(T, !0), O = E(T, 2), k = w(O, !0);
					j(C), j(c);
					var ee = E(c, 2);
					{
						let e = S(() => i()("postHistory.importProgressBarLabel")), t = S(() => `${B(pe)}%`);
						s(ee, () => qn, (r, i) => {
							i(r, {
								get value() {
									return B(pe);
								},
								max: 100,
								get "aria-label"() {
									return B(e);
								},
								get "aria-valuetext"() {
									return B(t);
								},
								class: "import-progress-root",
								children: (e, t) => {
									var r = wl();
									P((e) => n(r, e), [() => xe(B(pe))]), m(e, r);
								},
								$$slots: { default: !0 }
							});
						});
					}
					j(r), P((e, n, i, a, o) => {
						ae(r, "aria-label", e), t(f, n), t(h, `${B(pe) ?? ""}%`), t(v, i), t(x, a), t(D, o), t(k, B(he));
					}, [
						() => i()("postHistory.importProgress"),
						() => i()("postHistory.importProgress"),
						() => i()("postHistory.importElapsedTime"),
						() => ge(B(A)),
						() => i()("postHistory.importEstimatedRemainingTime")
					]), m(e, r);
				};
				d(N, (e) => {
					(B(_) || B(y)) && e(ne);
				});
				var F = E(N, 2), I = (e) => {
					var n = El(), r = M(n), a = M(r), o = w(a, !0), s = E(a, 2), c = M(s), l = M(c), u = w(l, !0), d = E(l), f = w(d, !0);
					j(c);
					var p = E(c, 2), h = M(p), g = w(h, !0), _ = E(h), v = w(_, !0);
					j(p);
					var b = E(p, 2), x = M(b), S = w(x, !0), C = E(x), T = w(C, !0);
					j(b);
					var D = E(b, 2), O = M(D), k = w(O, !0), A = E(O), ee = w(A, !0);
					j(D);
					var N = E(D, 2), te = M(N), ne = w(te, !0), F = E(te), I = w(F, !0);
					j(N);
					var L = E(N, 2), re = M(L), R = w(re, !0), z = E(re), ie = w(z, !0);
					j(L);
					var V = E(L, 2), ae = M(V), oe = w(ae, !0), se = E(ae), ce = w(se, !0);
					j(V), j(s), j(r);
					var le = E(r, 2), ue = M(le), de = w(ue, !0), H = E(ue, 2), U = M(H), fe = M(U), pe = w(fe, !0), me = E(fe), he = w(me, !0);
					j(U);
					var ge = E(U, 2), W = M(ge), _e = w(W, !0), ve = E(W), ye = w(ve, !0);
					j(ge);
					var be = E(ge, 2), xe = M(be), Se = w(xe, !0), Ce = E(xe), we = w(Ce, !0);
					j(be);
					var G = E(be, 2), Te = M(G), K = w(Te, !0), Ee = E(Te), De = w(Ee, !0);
					j(G);
					var Oe = E(G, 2), ke = M(Oe), Ae = w(ke, !0), je = E(ke), Me = w(je, !0);
					j(Oe);
					var Ne = E(Oe, 2), q = M(Ne), J = w(q, !0), Pe = E(q), Fe = w(Pe, !0);
					j(Ne), j(H), j(le);
					var Ie = E(le, 2), Le = M(Ie), Re = w(Le, !0), ze = E(Le, 2), Y = M(ze), Be = M(Y), X = w(Be, !0), Ve = E(Be), He = w(Ve, !0);
					j(Y);
					var Ue = E(Y, 2), We = M(Ue), Ge = w(We, !0), Ke = E(We), qe = w(Ke, !0);
					j(Ue);
					var Je = E(Ue, 2), Ye = M(Je), Xe = w(Ye, !0), Ze = E(Ye), Qe = w(Ze, !0);
					j(Je);
					var $e = E(Je, 2), et = M($e), tt = w(et, !0), nt = E(et), rt = w(nt, !0);
					j($e);
					var it = E($e, 2), at = M(it), ot = w(at, !0), st = E(at), Z = w(st, !0);
					j(it);
					var ct = E(it, 2), lt = M(ct), ut = w(lt, !0), dt = E(lt), ft = w(dt, !0);
					j(ct);
					var pt = E(ct, 2), mt = M(pt), ht = w(mt, !0), gt = E(mt), _t = w(gt, !0);
					j(pt), j(ze), j(Ie), j(n), P((e, n, r, i, a, s, c, l, d, p, m, h, _, b, x, C, w, E, D, O, A, j, M) => {
						t(o, e), t(u, n), t(f, B(y).nonEmptyLineCount), t(g, r), t(v, B(y).fileDuplicateCount), t(S, i), t(T, B(y).otherAccountCount), t(k, a), t(ee, B(y).unsupportedKindCount), t(ne, s), t(I, B(y).invalidJsonCount), t(R, c), t(ie, B(y).invalidStructureCount), t(oe, l), t(ce, B(y).invalidIdOrSignatureCount), t(de, d), t(pe, p), t(he, B(y).uniquePostEventCount), t(_e, m), t(ye, B(y).insertedPostCount), t(Se, h), t(we, B(y).updatedPostCount), t(K, _), t(De, B(y).unchangedPostCount), t(Ae, b), t(Me, B(y).failedPostEventCount), t(J, x), t(Fe, B(y).appliedDeletionPostCount), t(Re, C), t(X, w), t(He, B(y).uniqueDeletionEventCount), t(Ge, E), t(qe, B(y).validDeletionETagCount), t(Xe, D), t(Qe, B(y).insertedDeletionRequestCount), t(tt, O), t(rt, B(y).updatedDeletionRequestCount), t(ot, A), t(Z, B(y).unchangedDeletionRequestCount), t(ut, j), t(ft, B(y).unsupportedDeletionEventCount), t(ht, M), t(_t, B(y).failedDeletionEventCount);
					}, [
						() => i()("postHistory.importInputResults"),
						() => i()("postHistory.importNonEmptyLines"),
						() => i()("postHistory.importFileDuplicates"),
						() => i()("postHistory.importOtherAccount"),
						() => i()("postHistory.importUnsupportedKind"),
						() => i()("postHistory.importInvalidJson"),
						() => i()("postHistory.importInvalidStructure"),
						() => i()("postHistory.importInvalidCrypto"),
						() => i()("postHistory.importPostResults"),
						() => i()("postHistory.importPostEvents"),
						() => i()("postHistory.importInserted"),
						() => i()("postHistory.importUpdated"),
						() => i()("postHistory.importUnchanged"),
						() => i()("postHistory.importPostFailures"),
						() => i()("postHistory.importDeletionApplied"),
						() => i()("postHistory.importDeletionResults"),
						() => i()("postHistory.importDeletionEvents"),
						() => i()("postHistory.importDeletionTags"),
						() => i()("postHistory.importDeletionRequestsInserted"),
						() => i()("postHistory.importDeletionRequestsUpdated"),
						() => i()("postHistory.importDeletionRequestsUnchanged"),
						() => i()("postHistory.importUnsupportedDeletion"),
						() => i()("postHistory.importDeletionFailures")
					]), m(e, n);
				};
				d(F, (e) => {
					B(y) && e(I);
				}), P((e, n, r, i) => {
					t(u, e), t(h, n), ae(b, "aria-label", r), C = oe(x, 1, "import-drop-zone svelte-1qfqhib", null, C, { "import-drop-zone-active": B(te) > 0 }), t(ee, i);
				}, [
					() => i()("postHistory.importTitle"),
					() => i()("postHistory.importDescription"),
					() => i()("postHistory.importChooseFile"),
					() => B(te) > 0 ? i()("postHistory.importDropActive") : i()("postHistory.importDropHint")
				]), g("change", b, je), v("dragenter", x, Ee), v("dragover", x, De), v("dragleave", x, Oe), v("drop", x, ke), m(e, o);
			},
			$$slots: {
				footer: !0,
				default: !0
			}
		});
	}
	se(), o();
}
_(["change"]);
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryScanAuthObserver.ts
function Al(e, t, n = Date.now) {
	let r = !1, i = new Map(t.map((e) => [e, {
		ids: /* @__PURE__ */ new Set(),
		successAt: null,
		rejected: !1,
		listeners: /* @__PURE__ */ new Set()
	}])), a = (e) => i.get(fe.normalizeExternalRelayUrl(e) ?? ""), o = (e) => {
		e.ids.clear(), e.successAt = null, e.rejected = !1;
	}, s = [
		e.createOutgoingMessageObservable?.().subscribe((e) => {
			let t = a(e.to), n = e.message;
			if (!t || !Array.isArray(n) || n[0] !== "AUTH") return;
			let r = n[1];
			if (r && typeof r == "object" && "id" in r && typeof r.id == "string") for (t.ids.add(r.id), t.rejected = !1; t.ids.size > 4;) t.ids.delete(t.ids.keys().next().value);
		}),
		e.createAllMessageObservable?.().subscribe((e) => {
			let t = a(e.from);
			t && (e.type === "AUTH" && o(t), e.type === "OK" && t.ids.delete(e.eventId) && (e.ok ? t.successAt = n() : t.rejected = !0), t.listeners.forEach((e) => e()));
		}),
		e.createConnectionStateObservable?.().subscribe((e) => {
			if (e.state !== "connected") {
				let t = a(e.from);
				t && o(t), t?.listeners.forEach((e) => e());
			}
		})
	];
	return {
		wait(e, t, i, o = n() + t) {
			return new Promise((s) => {
				let c = a(e), l, u = !1, d = (e) => {
					u || (u = !0, l !== void 0 && clearTimeout(l), c?.listeners.delete(p), i.removeEventListener("abort", f), s(e));
				}, f = () => d("cancelled"), p = () => {
					r || i.aborted ? f() : c?.successAt !== null && c?.successAt !== void 0 ? d(c.successAt <= o ? "success" : "timeout") : c?.rejected && !c.ids.size && d("rejected");
				};
				c?.listeners.add(p), i.addEventListener("abort", f, { once: !0 }), l = setTimeout(() => d("timeout"), Math.max(1, Math.min(t, o - n()))), p();
			});
		},
		dispose() {
			r = !0, s.forEach((e) => e?.unsubscribe()), i.forEach((e) => e.listeners.forEach((e) => e())), i.clear();
		}
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryRelayFullScanService.ts
function jl(e) {
	let t = Object.entries(e.issueCounts).filter(([, e]) => (e ?? 0) > 0);
	return t.length === 1 && t[0][0] === "ambiguous";
}
var Ml = {
	windowSeconds: 2592e3,
	limit: 250,
	concurrency: 4,
	pageTimeoutMs: bn,
	authTimeoutMs: 3e4,
	relayTimeoutMs: 18e5,
	operationTimeoutMs: 72e5,
	maxRequests: 1e4,
	maxBoundaryIds: 1e3
}, Nl = new class {
	deps;
	activeRuntimes = /* @__PURE__ */ new WeakSet();
	constructor(e = {}) {
		this.deps = e;
	}
	start(e) {
		if (this.activeRuntimes.has(e.rxNostr)) throw Error("A post-history full scan is already running");
		this.activeRuntimes.add(e.rxNostr);
		let t = this.deps.now ?? Date.now, n = {
			...Ml,
			...this.deps.options
		}, r = t(), i = Math.max(0, Math.floor(r / 1e3)), a = vn(e.relayConfig), o = ln(e.relayConfig), s = [...Ze], c = new AbortController(), l = /* @__PURE__ */ new Set(), u = null, d = !1, f = !1, p = !1, m = 0, h = a.map((e) => ({
			relayUrl: e,
			status: "running",
			phase: "pending",
			receivedCount: 0,
			requestCount: 0,
			issueCounts: {},
			rangeSamples: []
		})), g = {
			phase: "fetching",
			elapsedMs: 0,
			receivedCount: 0,
			insertedCount: 0,
			updatedCount: 0,
			finishedRelayCount: 0,
			targetRelayCount: a.length,
			relays: []
		}, _ = () => {
			g.phase = h.some((e) => e.status === "running" && e.phase === "auth") ? "auth" : "fetching", g.elapsedMs = Math.max(0, t() - r), g.finishedRelayCount = h.filter((e) => e.status !== "running").length, g.relays = h.map(({ relayUrl: e, status: t, phase: n, receivedCount: r, issueCounts: i }) => ({
				relayUrl: e,
				status: t,
				phase: n,
				receivedCount: r,
				issueCounts: { ...i }
			})), e.onProgress?.({ ...g });
		}, v = (e = !1) => {
			u = e ? "stale-cancelled" : u ?? "cancelled", c.abort(), l.forEach((e) => e.cancel());
		}, y = () => {
			let t = e.getCurrentScope(), n = t.ownerPubkeyHex === e.ownerPubkeyHex && t.rxNostr === e.rxNostr && ln(t.relayConfig) === o;
			return n || v(!0), n && !c.signal.aborted;
		}, b = () => v();
		e.signal?.addEventListener("abort", b, { once: !0 }), e.signal?.aborted && v();
		let x = Al(e.rxNostr, a, t), S = () => void 0, C = (e, t, n) => {
			e.issueCounts[t] = (e.issueCounts[t] ?? 0) + 1, e.rangeSamples.length < 16 && e.rangeSamples.push({
				since: n.since,
				until: n.until
			});
		};
		return _(), {
			promise: (async () => {
				try {
					S = it(e.rxNostr, e.ownerPubkeyHex, s);
					let a = await (this.deps.createScope ?? Kn)({
						ownerPubkeyHex: e.ownerPubkeyHex,
						rxNostr: e.rxNostr,
						relayConfig: e.relayConfig,
						kinds: s,
						getRelayConfig: () => e.getCurrentScope().relayConfig,
						isActive: y
					});
					m = a.expectedRevision;
					let o = async (e, t) => {
						if (!y() || d) return;
						let n = await (this.deps.persistBatch ?? er)(e.events, e.fetchedAt, t, a);
						n.applied === !1 ? !u && !d && v(!0) : (f = !0, g.insertedCount += n.insertedCount, g.updatedCount += n.updatedCount, _());
					}, b = async (a) => {
						let f = t() + n.relayTimeoutMs, m = () => Math.min(f, r + n.operationTimeoutMs) - t(), h = async (t) => {
							for (let r = 0; r < 2 && y() && !d; r++) {
								if (m() <= 0 || a.requestCount >= n.maxRequests) return C(a, "safety-limit", t), null;
								a.requestCount += 1, a.phase = "fetching", _();
								let i;
								try {
									let r = (this.deps.fetchRelayPage ?? pn.fetchRelayPage.bind(pn))(e.rxNostr, {
										relayUrl: a.relayUrl,
										pubkeyHex: e.ownerPubkeyHex,
										kinds: s,
										limit: n.limit,
										since: t.since,
										until: t.until,
										timeoutMs: Math.max(1, Math.min(n.pageTimeoutMs, m()))
									});
									l.add(r);
									try {
										i = await r.promise;
									} finally {
										l.delete(r);
									}
								} catch {
									if (r === 1) return C(a, "error", t), null;
									continue;
								}
								if (!y() || d) return null;
								if (a.requestCount += Math.max(0, (i.page?.requestCount ?? 1) - 1), g.receivedCount += i.rawCount, a.receivedCount += i.rawCount, _(), p ||= i.events.length > 0 || i.eoseRelayUrls.length > 0, a.requestCount > n.maxRequests) return await o(i, []), C(a, "safety-limit", t), null;
								if (i.status === "success" && i.relayOutcomes?.[0]?.termination === "eose" && i.relayOutcomes[0].eoseReceived && i.relayOutcomes[0].verificationDrained && !i.errorRelayUrls.length && !i.downRelayUrls.length && !i.page?.bufferLimited) return i;
								if (await o(i, []), i.page?.bufferLimited) return C(a, "safety-limit", t), null;
								if (i.page?.authRequired) return C(a, "auth-unresolved", t), null;
								if (r === 1) return C(a, i.status === "timeout" || !i.eoseRelayUrls.length && !i.allRelaysFailed ? "timeout" : "error", t), null;
							}
							return null;
						};
						try {
							for (let e = i; e >= 0 && y() && !d;) {
								let r = Math.max(0, e - n.windowSeconds + 1), i = [{
									since: r,
									until: e,
									authRetried: !1
								}];
								for (; i.length && y() && !d;) {
									let e = i.pop(), r = -1, s = /* @__PURE__ */ new Set();
									for (; y() && !d;) {
										let l = await h(e);
										if (!l) {
											a.status = u ? "cancelled" : "partial";
											return;
										}
										if (l.page?.authAutoResent && (e.authRetried = !0), l.page?.hints.includes("auth")) {
											let r = Math.min(Math.min(t(), l.page.eoseReceivedAt ?? t()) + n.authTimeoutMs, t() + m());
											if (await o(l, []), !y()) return;
											if (e.authRetried) {
												C(a, "auth-unresolved", e), a.status = "partial";
												return;
											}
											l = null, a.phase = "auth", _();
											let i = await x.wait(a.relayUrl, n.authTimeoutMs, c.signal, r);
											if (!y()) return;
											if (i !== "success") {
												C(a, i === "rejected" ? "auth-rejected" : "auth-timeout", e), a.status = "partial";
												return;
											}
											if (e.authRetried = !0, l = await h(e), !l) {
												a.status = u ? "cancelled" : "partial";
												return;
											}
											if (l.page?.hints.includes("auth")) {
												await o(l, []), C(a, "auth-unresolved", e), a.status = "partial";
												return;
											}
										}
										let d = l.page?.hints.includes("more") === !0, f = !d && l.page?.hints.includes("finish") === !0, p = !d && l.rawCount === 0, g = l.oldestCreatedAt, v = st({
											since: e.since,
											until: e.until,
											oldestCreatedAt: g,
											cancelled: !1,
											outcomes: (l.relayOutcomes ?? []).map((e) => ({
												...e,
												relayUrl: a.relayUrl,
												oldestCreatedAt: g,
												saturated: e.saturated || !f && !p
											}))
										});
										if (await o(l, v), !y()) return;
										if (f || p) break;
										if (g !== null && g < e.until) {
											e = {
												...e,
												until: g
											}, r = g, s.clear(), l.events.filter(({ event: e }) => e.created_at === g).forEach(({ event: e }) => s.add(e.id));
											continue;
										}
										r !== e.until && (r = e.until, s.clear());
										let b = 0;
										for (let { event: e } of l.events) if (s.has(e.id) || (b++, s.add(e.id)), s.size >= n.maxBoundaryIds) break;
										if (!(b > 0 && s.size < n.maxBoundaryIds)) {
											if (e.since < e.until) {
												let t = e.since + Math.floor((e.until - e.since) / 2);
												i.push({
													...e,
													until: t
												}, {
													...e,
													since: t + 1
												});
											} else C(a, "ambiguous", e);
											break;
										}
									}
								}
								e = r - 1;
							}
							a.status = c.signal.aborted ? "cancelled" : Object.keys(a.issueCounts).length && !jl(a) ? "partial" : "completed";
						} catch {
							c.signal.aborted || (C(a, "storage", {
								since: 0,
								until: i
							}), d = !0, c.abort(), l.forEach((e) => e.cancel())), a.status = u ? "cancelled" : "partial";
						} finally {
							_();
						}
					}, w = 0;
					await Promise.all(Array.from({ length: Math.min(n.concurrency, h.length) }, async () => {
						for (; w < h.length && y() && !d;) await b(h[w++]);
					})), a.isActive() || u || d || v(!0), u || d || (await (this.deps.persistBatch ?? er)([], t(), [], a)).applied !== !1 || u || v(!0);
				} catch {
					d = !0;
					let e = h.find((e) => e.status === "running") ?? h[0];
					e && (C(e, "storage", {
						since: 0,
						until: i
					}), e.status = "partial");
				} finally {
					l.forEach((e) => e.cancel()), x.dispose(), S(), e.signal?.removeEventListener("abort", b), this.activeRuntimes.delete(e.rxNostr);
				}
				h.forEach((e) => {
					e.status === "running" && (e.status = u ? "cancelled" : "partial");
				}), _();
				let a = u ?? (h.length && !d && h.every((e) => e.status === "completed") ? "completed" : (d ? f : p || g.insertedCount > 0) ? "partial" : "failed");
				return {
					...g,
					status: a,
					ownerPubkeyHex: e.ownerPubkeyHex,
					localRevision: m,
					upperBound: i,
					relays: h
				};
			})(),
			cancel: v
		};
	}
}(), Pl = i("<span class=\"close-icon svg-icon svelte-3dbqmx\" aria-hidden=\"true\"></span>"), Fl = i("<!> <!>", 1), Il = i("<div class=\"scan-status svelte-3dbqmx\" role=\"status\"><!> <span> </span></div>"), Ll = i("<div class=\"svelte-3dbqmx\"><dt class=\"svelte-3dbqmx\"> </dt><dd class=\"svelte-3dbqmx\"> </dd></div>"), Rl = i("<div class=\"svelte-3dbqmx\"><dt class=\"svelte-3dbqmx\"> </dt><dd class=\"svelte-3dbqmx\"> </dd></div> <div class=\"svelte-3dbqmx\"><dt class=\"svelte-3dbqmx\"> </dt><dd class=\"svelte-3dbqmx\"> </dd></div> <!>", 1), zl = i("<div class=\"scan-relay-ambiguity-popover svelte-3dbqmx\"><h3 class=\"svelte-3dbqmx\"> </h3> <p class=\"svelte-3dbqmx\"> </p> <p class=\"svelte-3dbqmx\"> </p> <p class=\"svelte-3dbqmx\"> </p></div>"), Bl = i("<span class=\"scan-relay-reason svelte-3dbqmx\"> </span>"), Vl = i("<tr class=\"scan-relay-row svelte-3dbqmx\"><td class=\"svelte-3dbqmx\"><span class=\"scan-relay-host svelte-3dbqmx\"> </span></td><td class=\"scan-relay-state svelte-3dbqmx\"><div class=\"scan-relay-state-line svelte-3dbqmx\"><span class=\"svelte-3dbqmx\"> </span> <!></div> <!></td><td class=\"scan-relay-count svelte-3dbqmx\"> </td></tr>"), Hl = i("<div class=\"scan-results svelte-3dbqmx\"><section class=\"svelte-3dbqmx\"><h3 class=\"svelte-3dbqmx\"> </h3> <dl class=\"svelte-3dbqmx\"><div class=\"svelte-3dbqmx\"><dt class=\"svelte-3dbqmx\"> </dt><dd class=\"svelte-3dbqmx\"> </dd></div> <div class=\"svelte-3dbqmx\"><dt class=\"svelte-3dbqmx\"> </dt><dd class=\"svelte-3dbqmx\"> </dd></div> <div class=\"svelte-3dbqmx\"><dt class=\"svelte-3dbqmx\"> </dt><dd class=\"svelte-3dbqmx\"> </dd></div></dl></section> <section class=\"svelte-3dbqmx\"><h3 class=\"svelte-3dbqmx\"> </h3> <dl class=\"svelte-3dbqmx\"><div class=\"svelte-3dbqmx\"><dt class=\"svelte-3dbqmx\"> </dt><dd class=\"svelte-3dbqmx\"> </dd></div> <div class=\"svelte-3dbqmx\"><dt class=\"svelte-3dbqmx\"> </dt><dd class=\"svelte-3dbqmx\"> </dd></div> <!></dl></section></div> <section class=\"scan-relays svelte-3dbqmx\"><table class=\"svelte-3dbqmx\"><caption class=\"svelte-3dbqmx\"> </caption><thead><tr><th scope=\"col\" class=\"svelte-3dbqmx\"> </th><th scope=\"col\" class=\"svelte-3dbqmx\"> </th><th scope=\"col\" class=\"svelte-3dbqmx\"> </th></tr></thead><tbody></tbody></table></section>", 1), Ul = i("<div class=\"scan-heading svelte-3dbqmx\"><h2 class=\"svelte-3dbqmx\"> </h2> <p class=\"svelte-3dbqmx\"> </p></div> <div class=\"scan-actions svelte-3dbqmx\"><!></div> <!> <!>", 1), Wl = {
	hash: "svelte-3dbqmx",
	code: ".scan-heading.svelte-3dbqmx, .scan-status.svelte-3dbqmx, .scan-results.svelte-3dbqmx {width:100%;}.scan-heading.svelte-3dbqmx {text-align:center;}.scan-heading.svelte-3dbqmx h2:where(.svelte-3dbqmx), .scan-heading.svelte-3dbqmx p:where(.svelte-3dbqmx) {margin:0;}.scan-heading.svelte-3dbqmx h2:where(.svelte-3dbqmx) {font-size:1.25rem;}.scan-heading.svelte-3dbqmx p:where(.svelte-3dbqmx) {margin-top:16px;font-size:0.88rem;line-height:1.5;white-space:pre-line;}.scan-actions.svelte-3dbqmx {box-sizing:border-box;display:flex;flex:0 0 50px;flex-wrap:wrap;align-items:center;justify-content:center;gap:8px;height:50px;margin-top:16px;}.scan-status.svelte-3dbqmx {display:flex;align-items:center;justify-content:center;gap:8px;margin-top:12px;font-size:0.9rem;}.post-history-full-scan-dialog .scan-action {box-sizing:border-box;min-width:50px;min-height:50px;padding:8px 12px;}.post-history-full-scan-dialog .scan-close-action {box-sizing:border-box;min-width:50px;min-height:50px;}.post-history-full-scan-dialog .scan-status .loading-placeholder {width:auto;flex:0 0 auto;justify-content:flex-start;}.close-icon.svelte-3dbqmx {mask-image:var(--ehagaki-icon-636c6f73655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.scan-results.svelte-3dbqmx {display:grid;grid-template-columns:repeat(2, minmax(0, 1fr));gap:8px;margin-top:12px;}.scan-results.svelte-3dbqmx section:where(.svelte-3dbqmx) {min-width:0;padding:10px;border:1px solid var(--border-hr);border-radius:8px;}.scan-results.svelte-3dbqmx h3:where(.svelte-3dbqmx) {margin:0 0 8px;font-size:0.9rem;}.scan-results.svelte-3dbqmx dl:where(.svelte-3dbqmx), .scan-results.svelte-3dbqmx dl:where(.svelte-3dbqmx) div:where(.svelte-3dbqmx) {margin:0;}.scan-results.svelte-3dbqmx dl:where(.svelte-3dbqmx) div:where(.svelte-3dbqmx) {display:flex;justify-content:space-between;gap:8px;padding-block:3px;font-size:0.8rem;}.scan-results.svelte-3dbqmx dt:where(.svelte-3dbqmx) {min-width:0;color:var(--text-muted);overflow-wrap:anywhere;}.scan-results.svelte-3dbqmx dd:where(.svelte-3dbqmx) {margin:0;flex:0 0 auto;font-variant-numeric:tabular-nums;}.scan-relays.svelte-3dbqmx {width:100%;min-width:0;box-sizing:border-box;margin-top:12px;padding:10px;border:1px solid var(--border-hr);border-radius:8px;}.scan-relays.svelte-3dbqmx table:where(.svelte-3dbqmx) {width:100%;table-layout:fixed;border-collapse:collapse;font-size:0.8rem;}.scan-relays.svelte-3dbqmx caption:where(.svelte-3dbqmx) {margin-bottom:8px;text-align:left;font-size:0.9rem;font-weight:600;}.scan-relays.svelte-3dbqmx th:where(.svelte-3dbqmx), .scan-relays.svelte-3dbqmx td:where(.svelte-3dbqmx) {padding:0 4px;text-align:left;overflow-wrap:anywhere;}.scan-relays.svelte-3dbqmx th:where(.svelte-3dbqmx) {color:var(--text-muted);font-weight:500;}.scan-relays.svelte-3dbqmx th:where(.svelte-3dbqmx):first-child {width:45%;}.scan-relays.svelte-3dbqmx th:where(.svelte-3dbqmx):nth-child(2) {width:28%;}.scan-relays.svelte-3dbqmx th:where(.svelte-3dbqmx):last-child, .scan-relays.svelte-3dbqmx td:where(.svelte-3dbqmx):last-child {text-align:right;}.scan-relay-row.svelte-3dbqmx {border-top:1px solid var(--border-hr);}.scan-relay-host.svelte-3dbqmx {display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.scan-relay-state-line.svelte-3dbqmx {display:flex;align-items:center;flex-wrap:wrap;gap:2px;min-width:0;min-height:44px;box-sizing:border-box;}.scan-relay-state-line.svelte-3dbqmx > span:where(.svelte-3dbqmx) {min-width:0;overflow-wrap:anywhere;}.scan-relay-count.svelte-3dbqmx {font-variant-numeric:tabular-nums;}.scan-relay-reason.svelte-3dbqmx {display:block;margin-top:4px;color:var(--text-muted);font-size:0.75rem;}.popover-content:has(.scan-relay-ambiguity-popover) {box-sizing:border-box;inline-size:min(320px, calc(100vw - 24px));max-inline-size:calc(100vw - 24px);max-block-size:min(var(--bits-popover-content-available-height, calc(100vh - 24px)), calc(100vh - 24px));overflow:auto;}.scan-relay-ambiguity-popover.svelte-3dbqmx {overflow-wrap:anywhere;}.scan-relay-ambiguity-popover.svelte-3dbqmx h3:where(.svelte-3dbqmx) {margin:0 0 8px;font-size:1rem;}.scan-relay-ambiguity-popover.svelte-3dbqmx p:where(.svelte-3dbqmx) {margin:0 0 8px;}.scan-relay-ambiguity-popover.svelte-3dbqmx p:where(.svelte-3dbqmx):last-child {margin-bottom:0;}.post-history-full-scan-dialog {max-width:min(760px, calc(100% - 10px));}\n    @media (max-width: 680px) {.scan-results.svelte-3dbqmx {grid-template-columns:1fr;} }"
};
function Gl(n, i) {
	p(i, !0), ee(n, Wl);
	let c = () => R(Ie, "$_", l), [l, f] = ne(), g = L(i, "open", 15), _ = S(() => i.result ?? i.progress), v = S(() => i.running ? `postHistory.fullScanPhase.${i.progress?.phase ?? "fetching"}` : i.result ? `postHistory.fullScanStatus.${i.result.status}` : null), y = S(() => {
		let e = {};
		for (let t of i.result?.relays ?? []) if (!(t.status === "completed" && jl(t))) for (let [n, r] of Object.entries(t.issueCounts)) e[n] = (e[n] ?? 0) + (r ?? 0);
		return Object.entries(e);
	});
	function b(e) {
		let t = Math.floor(e / 1e3);
		return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;
	}
	function C(e) {
		try {
			return new URL(e).host;
		} catch {
			return e;
		}
	}
	function T(e) {
		if (e.status === "running") return e.phase;
		if (e.status === "completed") return e.receivedCount === 0 && !jl(e) ? "empty" : "completed";
		if (e.status === "cancelled") return "cancelled";
		let t = Object.entries(e.issueCounts).filter(([, e]) => (e ?? 0) > 0).map(([e]) => e);
		return t.length && t.every((e) => e === "timeout" || e === "auth-timeout") ? "timeout" : t.length === 1 && t[0] === "error" ? "error" : "partial";
	}
	function D(e) {
		if (e.status !== "partial" || T(e) !== "partial") return null;
		let t = Object.entries(e.issueCounts).filter(([, e]) => (e ?? 0) > 0);
		return t.length === 1 ? t[0][0] : null;
	}
	{
		let l = (e) => {
			var t = h(), n = V(t);
			{
				let e = (e, t) => {
					let n = () => (t?.()).props;
					{
						let t = S(() => c()("global.close"));
						Q(e, x(n, {
							className: "modal-close scan-close-action",
							shape: "square",
							get ariaLabel() {
								return B(t);
							},
							children: (e, t) => {
								var n = Pl();
								m(e, n);
							},
							$$slots: { default: !0 }
						}));
					}
				};
				s(n, () => Ln, (t, n) => {
					n(t, {
						child: e,
						$$slots: { child: !0 }
					});
				});
			}
			m(e, t);
		}, f = S(() => c()("postHistory.fullScanTitle")), p = S(() => c()("postHistory.fullScanDescription"));
		$(n, {
			get onOpenChange() {
				return i.onOpenChange;
			},
			get title() {
				return B(f);
			},
			get description() {
				return B(p);
			},
			contentClass: "post-history-full-scan-dialog",
			footerVariant: "close-button",
			initialFocus: "content",
			get open() {
				return g();
			},
			set open(e) {
				g(e);
			},
			footer: l,
			children: (n, s) => {
				var l = Ul(), f = V(l), p = M(f), h = w(p, !0), g = E(p, 2), x = w(g, !0);
				j(f);
				var O = E(f, 2), k = M(O), A = (n) => {
					var r = Fl(), a = V(r), s = (n) => {
						{
							let r = S(() => !i.canStart);
							Q(n, {
								variant: "primary",
								shape: "square",
								className: "scan-action",
								get disabled() {
									return B(r);
								},
								get onClick() {
									return i.onStart;
								},
								children: (n, r) => {
									e();
									var i = o();
									P((e) => t(i, e), [() => c()("postHistory.fullScanStart")]), m(n, i);
								},
								$$slots: { default: !0 }
							});
						}
					};
					d(a, (e) => {
						i.running || e(s);
					});
					var l = E(a, 2), u = (n) => {
						Q(n, {
							variant: "default",
							shape: "square",
							className: "scan-action",
							get onClick() {
								return i.onCancel;
							},
							children: (n, r) => {
								e();
								var i = o();
								P((e) => t(i, e), [() => c()("postHistory.fullScanCancel")]), m(n, i);
							},
							$$slots: { default: !0 }
						});
					};
					d(l, (e) => {
						i.running && e(u);
					}), m(n, r);
				};
				d(k, (e) => {
					i.result || e(A);
				}), j(O);
				var ee = E(O, 2), N = (e) => {
					var n = Il(), r = M(n), a = (e) => {
						Be(e, {
							showLoader: !0,
							loaderSize: 20
						});
					};
					d(r, (e) => {
						i.running && e(a);
					});
					var o = E(r, 2), s = w(o, !0);
					j(n), P((e) => t(s, e), [() => c()(B(v))]), m(e, n);
				};
				d(ee, (e) => {
					B(v) && e(N);
				});
				var te = E(ee, 2), ne = (e) => {
					var n = Hl(), o = V(n), s = M(o), l = M(s), f = w(l, !0), p = E(l, 2), h = M(p), g = M(h), v = w(g, !0), x = E(g), O = w(x);
					j(h);
					var k = E(h, 2), A = M(k), ee = w(A, !0), N = E(A), te = w(N, !0);
					j(k);
					var ne = E(k, 2), F = M(ne), I = w(F, !0), L = E(F), re = w(L, !0);
					j(ne), j(p), j(s);
					var R = E(s, 2), z = M(R), ie = w(z, !0), oe = E(z, 2), se = M(oe), ce = M(se), le = w(ce, !0), ue = E(ce), de = w(ue, !0);
					j(se);
					var H = E(se, 2), U = M(H), fe = w(U, !0), pe = E(U), me = w(pe, !0);
					j(H);
					var he = E(H, 2), ge = (e) => {
						var n = Rl(), o = V(n), s = M(o), l = w(s, !0), d = E(s), f = w(d, !0);
						j(o);
						var p = E(o, 2), h = M(p), g = w(h, !0), _ = E(h), v = w(_, !0);
						j(p);
						var b = E(p, 2);
						r(b, 17, () => B(y), a, (e, n) => {
							var r = S(() => u(B(n), 2));
							let i = () => B(r)[0], a = () => B(r)[1];
							var o = Ll(), s = M(o), l = w(s, !0), d = E(s), f = w(d, !0);
							j(o), P((e) => {
								t(l, e), t(f, a());
							}, [() => c()(`postHistory.fullScanIssue.${i()}`)]), m(e, o);
						}), P((e, n, r, i) => {
							t(l, e), t(f, n), t(g, r), t(v, i);
						}, [
							() => c()("postHistory.fullScanCompletedRelays"),
							() => i.result.relays.filter((e) => e.status === "completed").length,
							() => c()("postHistory.fullScanIncompleteRelays"),
							() => i.result.relays.filter((e) => e.status !== "completed").length
						]), m(e, n);
					};
					d(he, (e) => {
						i.result && e(ge);
					}), j(oe), j(R), j(o);
					var W = E(o, 2), _e = M(W), ve = M(_e), ye = w(ve, !0), be = E(ve), xe = M(be), Se = M(xe), Ce = w(Se, !0), we = E(Se), G = w(we, !0), Te = E(we), K = w(Te, !0);
					j(xe), j(be);
					var Ee = E(be);
					r(Ee, 21, () => B(_).relays, (e) => e.relayUrl, (e, n) => {
						let r = S(() => D(B(n))), i = S(() => B(n).status === "completed" && jl(B(n)));
						var a = Vl(), o = M(a), s = M(o), l = w(s, !0);
						j(o);
						var u = E(o), f = M(u), p = M(f), h = w(p, !0), g = E(p, 2), _ = (e) => {
							{
								let n = S(() => c()("postHistory.fullScanAmbiguityInfo.label"));
								Vr(e, {
									side: "top",
									sideOffset: 4,
									get ariaLabel() {
										return B(n);
									},
									children: (e, n) => {
										var r = zl(), i = M(r), a = w(i, !0), o = E(i, 2), s = w(o, !0), l = E(o, 2), u = w(l, !0), d = E(l, 2), f = w(d, !0);
										j(r), P((e, n, r, i) => {
											t(a, e), t(s, n), t(u, r), t(f, i);
										}, [
											() => c()("postHistory.fullScanAmbiguityInfo.title"),
											() => c()("postHistory.fullScanAmbiguityInfo.bodyCompletion"),
											() => c()("postHistory.fullScanAmbiguityInfo.bodyEose"),
											() => c()("postHistory.fullScanAmbiguityInfo.bodyStatus")
										]), m(e, r);
									},
									$$slots: { default: !0 }
								});
							}
						};
						d(g, (e) => {
							B(i) && e(_);
						}), j(f);
						var v = E(f, 2), y = (e) => {
							var n = Bl(), i = w(n, !0);
							P((e) => t(i, e), [() => c()(`postHistory.fullScanIssue.${B(r)}`)]), m(e, n);
						};
						d(v, (e) => {
							B(r) && e(y);
						}), j(u);
						var b = E(u), x = w(b, !0);
						j(a), P((e, r) => {
							ae(a, "data-relay-url", B(n).relayUrl), ae(s, "title", B(n).relayUrl), t(l, e), t(h, r), t(x, B(n).receivedCount);
						}, [() => C(B(n).relayUrl), () => c()(`postHistory.fullScanRelayStatus.${T(B(n))}`)]), m(e, a);
					}), j(Ee), j(_e), j(W), P((e, n, r, i, a, o, s, c, l, u, d, p) => {
						t(f, e), t(v, n), t(O, `${B(_).finishedRelayCount ?? ""} / ${B(_).targetRelayCount ?? ""}`), t(ee, r), t(te, B(_).receivedCount), t(I, i), t(re, a), t(ie, o), t(le, s), t(de, B(_).insertedCount), t(fe, c), t(me, B(_).updatedCount), t(ye, l), t(Ce, u), t(G, d), t(K, p);
					}, [
						() => c()("postHistory.fullScanRetrieval"),
						() => c()("postHistory.fullScanRelays"),
						() => c()("postHistory.fullScanReceived"),
						() => c()("postHistory.importElapsedTime"),
						() => b(i.elapsedMs),
						() => c()("postHistory.fullScanSaved"),
						() => c()("postHistory.importInserted"),
						() => c()("postHistory.fullScanUpdated"),
						() => c()("postHistory.fullScanRelayProgress"),
						() => c()("postHistory.fullScanRelayHost"),
						() => c()("postHistory.fullScanRelayState"),
						() => c()("postHistory.fullScanReceived")
					]), m(e, n);
				};
				d(te, (e) => {
					B(_) && e(ne);
				}), P((e, n) => {
					t(h, e), t(x, n);
				}, [() => c()("postHistory.fullScanTitle"), () => c()("postHistory.fullScanDescription")]), m(n, l);
			},
			$$slots: {
				footer: !0,
				default: !0
			}
		});
	}
	se(), f();
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/hooks/usePostHistoryRelayFullScan.svelte.ts
function Kl(e) {
	let t = F({
		open: !1,
		running: !1,
		progress: null,
		result: null,
		elapsedMs: 0
	}), n = null, r = null, i = "", a = !1, o = 0, s;
	function c() {
		o++, u(), clearInterval(s), n = null, r = null, t.running = !1, t.open = !1;
	}
	let l = null;
	function u(e) {
		l?.(), l = null, n?.cancel(e);
	}
	let d = () => {
		let t = e.getScope();
		return !!r && r.ownerPubkeyHex === t.ownerPubkeyHex && r.rxNostr === t.rxNostr && i === ln(t.relayConfig);
	};
	function f(e) {
		e || u(), e && !n && (t.result = null, t.progress = null, t.elapsedMs = 0), t.open = e;
	}
	async function p() {
		let c = e.getScope();
		if (a || n || !c.ownerPubkeyHex || !c.rxNostr || !e.getShow()) return;
		let u = o;
		r = c, i = ln(c.relayConfig), t.running = !0, t.result = null, t.progress = null, t.elapsedMs = 0;
		let f = performance.now(), p = setInterval(() => {
			u === o && e.getShow() && (t.elapsedMs = performance.now() - f);
		}, 1e3);
		s = p;
		let m = dl.acquire();
		l = m;
		try {
			let r = Nl.start({
				ownerPubkeyHex: c.ownerPubkeyHex,
				rxNostr: c.rxNostr,
				relayConfig: c.relayConfig,
				getCurrentScope: e.getScope,
				onProgress: (n) => {
					!a && u === o && e.getShow() && (t.progress = n);
				}
			});
			n = r;
			let i = await r.promise;
			if (a || u !== o || !e.getShow()) return;
			t.result = i, t.elapsedMs = performance.now() - f, d() && e.getShow() && i.status !== "stale-cancelled" && await e.onSettled(i);
		} finally {
			m(), l === m && (l = null), clearInterval(p), u === o && (n = null, a || (t.running = !1));
		}
	}
	return z(() => {
		let a = e.getShow(), o = e.getScope(), s = ln(o.relayConfig);
		re(() => {
			n && r && (o.ownerPubkeyHex !== r.ownerPubkeyHex || o.rxNostr !== r.rxNostr || s !== i) && u(!0), !a && n ? c() : a || (t.open = !1);
		});
	}), ie(() => {
		a = !0, u();
	}), {
		state: t,
		setOpen: f,
		start: p,
		suspend: c,
		cancel: () => u()
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostHistoryThreadToggleButton.svelte
var ql = i("<span class=\"post-history-thread-toggle-spinner post-history-thread-action-spinner svelte-cenxtw\" aria-hidden=\"true\"></span>"), Jl = i("<span class=\"post-history-thread-toggle-icon-wrapper svelte-cenxtw\" aria-hidden=\"true\"><span></span></span>"), Yl = i("<!> <span class=\"post-history-thread-toggle-label\"> </span>", 1), Xl = {
	hash: "svelte-cenxtw",
	code: ".post-history-thread-node-top-actions {width:100%;height:28px;}\n            .post-history-context-actions .post-history-thread-toggle-button,\n            .post-history-thread-node-top-actions\n                .post-history-thread-toggle-button\n         {position:relative;width:auto;padding:0 8px;gap:4px;white-space:nowrap;height:28px;min-height:28px;background:inherit;}.post-history-thread-toggle-icon-wrapper.svelte-cenxtw {position:relative;display:inline-flex;align-items:center;justify-content:center;flex:0 0 22px;}.post-history-thread-toggle-icon.svelte-cenxtw {--icon-size: 24px;}.post-history-thread-toggle-icon-arrow-top-right.svelte-cenxtw {mask-image:var(--ehagaki-icon-6172726f775f746f705f72696768745f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.post-history-thread-toggle-icon-collapse.svelte-cenxtw {--icon-size: 28px;mask-image:var(--ehagaki-icon-636f6c6c617073655f636f6e74656e745f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.post-history-thread-toggle-spinner.svelte-cenxtw {width:22px;height:22px;border:2px solid currentColor;border-right-color:transparent;border-radius:50%;\n        animation: svelte-cenxtw-post-history-thread-toggle-spinner 0.8s linear infinite;}\n\n    @media (prefers-reduced-motion: reduce) {.post-history-thread-toggle-spinner.svelte-cenxtw {\n            animation: none;}\n    }\n\n    @keyframes svelte-cenxtw-post-history-thread-toggle-spinner {\n        to {\n            rotate: 360deg;\n        }\n    }"
};
function Zl(e, n) {
	p(n, !0), ee(e, Xl);
	let r = () => R(Ie, "$_", i), [i, a] = ne(), o = L(n, "title", 19, () => n.ariaLabel), s = L(n, "loading", 3, !1), c = S(() => [s() ? "is-loading" : ""].filter(Boolean).join(" "));
	{
		let i = S(() => `post-history-thread-toggle-button ${B(c)}`.trim());
		Q(e, {
			type: "button",
			get className() {
				return B(i);
			},
			get ariaLabel() {
				return n.ariaLabel;
			},
			get title() {
				return o();
			},
			contentLayout: "iconText",
			shape: "rounded",
			get selected() {
				return n.expanded;
			},
			get disabled() {
				return s();
			},
			get onClick() {
				return n.onClick;
			},
			children: (e, i) => {
				var a = Yl(), o = V(a), c = (e) => {
					var t = ql();
					m(e, t);
				}, l = (e) => {
					var t = Jl(), r = w(t);
					P(() => oe(r, 1, `post-history-thread-toggle-icon ${n.expanded ? "post-history-thread-toggle-icon-collapse" : "post-history-thread-toggle-icon-arrow-top-right"} svg-icon`, "svelte-cenxtw")), m(e, t);
				};
				d(o, (e) => {
					s() ? e(c) : e(l, -1);
				});
				var u = E(o, 2), f = w(u, !0);
				P((e) => t(f, e), [() => r()("postHistory.replyTargetLabel")]), m(e, a);
			},
			$$slots: { default: !0 }
		});
	}
	se(), a();
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostHistoryStatusPill.svelte
var Ql = i("<span> </span>"), $l = {
	hash: "svelte-1uufmpv",
	code: ".post-history-status-pill.svelte-1uufmpv {display:inline-flex;align-items:center;justify-content:center;min-height:18px;padding:0 8px;border:1px solid color-mix(in srgb, currentColor 18%, transparent);border-radius:999px;background:color-mix(in srgb, currentColor 8%, transparent);font-size:0.72rem;line-height:1;white-space:nowrap;}.post-history-status-pill-muted.svelte-1uufmpv {color:var(--text-muted, currentColor);}.post-history-status-pill-danger.svelte-1uufmpv {color:var(--destructive-fg, currentColor);}"
};
function eu(e, n) {
	p(n, !0), ee(e, $l);
	let r = L(n, "className", 3, "");
	var i = Ql(), a = w(i, !0);
	P((e) => {
		oe(i, 1, e, "svelte-1uufmpv"), ae(i, "aria-label", n.label), ae(i, "title", n.label), t(a, n.label);
	}, [() => f(`post-history-status-pill post-history-status-pill-${n.tone} ${r()}`.trim())]), m(e, i), se();
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostHistoryDeletionLifecycleStatusBadge.svelte
function tu(e, t) {
	p(t, !0);
	let n = () => R(Ie, "$_", r), [r, i] = ne(), a = S(() => {
		if (t.eventId) return hn[t.eventId];
	});
	function o(e) {
		return e === "pending" || e === "processing" ? n()("postHistory.deleteSending") : e === "failed" ? n()("postHistory.deleteFailed") : null;
	}
	let s = S(() => o(B(a)));
	var c = h(), l = V(c), u = (e) => {
		{
			let t = S(() => B(a) === "failed" ? "danger" : "muted"), n = S(() => `post-history-deletion-lifecycle-status ${B(a) ?? ""}`.trim());
			eu(e, {
				get label() {
					return B(s);
				},
				get tone() {
					return B(t);
				},
				get className() {
					return B(n);
				}
			});
		}
	};
	d(l, (e) => {
		B(s) && e(u);
	}), m(e, c), se(), i();
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostHistoryThreadNode.svelte
function nu(e, t) {
	p(t, !0);
	let n = L(t, "model", 3, void 0), r = L(t, "loadSensitiveBody", 3, void 0), i = L(t, "emojiLoadStateByUrl", 19, () => ({})), a = L(t, "emojiImageMetaByUrl", 19, () => ({})), o = L(t, "scrollRoot", 3, null), s = L(t, "onImageOpen", 3, void 0), c = L(t, "topActions", 3, void 0), l = L(t, "footerLeftExtras", 3, void 0), u = L(t, "footerActions", 3, void 0), d = L(t, "footerDetails", 3, void 0), f = L(t, "footerMenu", 3, void 0);
	pr(e, {
		get event() {
			return t.node.event;
		},
		get profile() {
			return t.node.profile;
		},
		get model() {
			return n();
		},
		get loadSensitiveBody() {
			return r();
		},
		get emojiLoadStateByUrl() {
			return i();
		},
		get emojiImageMetaByUrl() {
			return a();
		},
		get scrollRoot() {
			return o();
		},
		get onImageOpen() {
			return s();
		},
		get topActions() {
			return c();
		},
		get footerLeftExtras() {
			return l();
		},
		get footerActions() {
			return u();
		},
		get footerDetails() {
			return d();
		},
		get footerMenu() {
			return f();
		}
	}), se();
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostHistoryThreadGraphNodeView.svelte
var ru = i("<span class=\"post-history-context-deleted-label svelte-1kez5et\"> </span>"), iu = i("<p class=\"post-history-context-message svelte-1kez5et\"> </p>"), au = i("<p class=\"post-history-context-message post-history-context-error svelte-1kez5et\"> </p> <!>", 1), ou = i("<div class=\"post-history-thread-node-parent svelte-1kez5et\"><!></div>"), su = i("<div class=\"post-history-thread-node-top-actions\"><!></div>"), cu = i("<div class=\"open-in-new-icon svg-icon\" aria-hidden=\"true\"></div> <span> </span>", 1), lu = i("<!> <!>", 1), uu = i("<div class=\"find_in_page-icon svg-icon\" aria-hidden=\"true\"></div> <span> </span>", 1), du = i("<!> <!> <!>", 1), fu = i("<p role=\"status\"> </p>"), pu = i("<div class=\"post-history-thread-node-children svelte-1kez5et\"></div>"), mu = i("<div class=\"post-history-thread-node-view svelte-1kez5et\"><!> <div class=\"post-history-thread-node-anchor svelte-1kez5et\"><!></div> <!> <!></div>"), hu = {
	hash: "svelte-1kez5et",
	code: ".post-history-thread-node-view.svelte-1kez5et {display:grid;gap:1px;}.post-history-thread-node-parent.svelte-1kez5et,\n    .post-history-thread-node-children.svelte-1kez5et {display:grid;gap:2px;}.post-history-thread-node-parent.svelte-1kez5et {padding-inline-start:0;}.post-history-thread-node-anchor.svelte-1kez5et {display:grid;min-width:0;}.post-history-thread-node-children.svelte-1kez5et {padding-inline-start:0;}.post-history-context-button {min-height:28px;padding:2px 6px;color:var(--text-muted);background:var(--btn-bg);font-size:0.82rem;}.post-history-context-message.svelte-1kez5et {margin:0;color:var(--text-muted);font-size:0.82rem;}.post-history-context-deleted-label.svelte-1kez5et {width:fit-content;min-height:28px;padding:2px 6px;color:var(--text-muted);background-color:transparent;border:1px solid var(--btn-border);font-size:0.82rem;font-weight:normal;cursor:default;user-select:none;display:flex;align-items:center;}.post-history-context-error.svelte-1kez5et {color:var(--danger);}"
};
function gu(n, i) {
	p(i, !0), ee(n, hu);
	let a = () => R(Ie, "$_", c), [c, l] = ne(), u = L(i, "previewModelByEventId", 19, () => ({})), f = L(i, "getSensitiveBodyLoader", 3, void 0), g = L(i, "emojiLoadStateByUrl", 19, () => ({})), _ = L(i, "emojiImageMetaByUrl", 19, () => ({})), v = L(i, "scrollRoot", 3, null), y = L(i, "onImageOpen", 3, void 0), b = L(i, "buildPostRecordForNode", 3, void 0), x = L(i, "onReplyPost", 3, void 0), C = L(i, "onQuotePost", 3, void 0), T = L(i, "onReactionPost", 3, void 0), D = L(i, "getReactionReadModel", 3, void 0), O = L(i, "isReactionExpanded", 3, void 0), k = L(i, "getReactionLabel", 3, void 0), A = L(i, "onToggleReaction", 3, void 0), N = L(i, "onToggleParent", 3, void 0), te = L(i, "onRetryParent", 3, void 0), F = L(i, "onRefreshRelatedEvents", 3, void 0), I = L(i, "onToggleChildren", 3, void 0), re = L(i, "onRetryChildren", 3, void 0), z = L(i, "onCopyPointerDown", 3, void 0), ie = L(i, "onCopyNevent", 3, void 0), oe = L(i, "externalClientLabel", 3, void 0), ce = L(i, "onOpenExternalClient", 3, void 0), le = L(i, "isCopyFailed", 3, void 0), ue = L(i, "onShowRawJson", 3, void 0), de = L(i, "onBroadcastPointerDown", 3, void 0), H = L(i, "onBroadcastPost", 3, void 0), U = L(i, "isBroadcastSending", 3, void 0), fe = L(i, "canDeleteNodePost", 3, void 0), pe = L(i, "isDeletionSending", 3, void 0), me = L(i, "onOpenDeleteConfirm", 3, void 0), he = S(() => rn(i.state.node.event.created_at * 1e3)), ge = S(() => i.state.repliesActionState.status === "loaded" && i.state.repliesActionState.replyCount > 0), W = S(() => le()?.(i.state.node.eventId) ?? !1), _e = S(() => U()?.(i.state.node.eventId) ?? !1), ve = S(() => fe()?.(i.state) ?? !1), ye = S(() => pe()?.(i.state.node.eventId) ?? !1);
	function be() {
		let e = i.state.repliesActionState;
		if (e.status === "loading") return a()("postHistory.checkingReplies");
		if (e.status === "failed") return a()("postHistory.recheckReplies");
		if (e.status === "loaded") {
			let t = e.replyCount;
			return t === 0 ? a()("postHistory.recheckReplies") : e.visible ? a()("postHistory.hideReplies") : a()("postHistory.showRepliesWithCount", { values: { count: t } });
		}
		return a()("postHistory.checkReplies");
	}
	function xe() {
		let e = i.state.repliesActionState;
		e.status === "failed" || e.status === "loaded" && e.replyCount === 0 ? re()?.(i.state.node.eventId) : I()?.(i.state.node.eventId);
	}
	function Se(e) {
		z()?.(i.state, e);
	}
	function Ce(e) {
		ie()?.(i.state, e);
	}
	function we() {
		ue()?.(i.state);
	}
	function G(e) {
		de()?.(i.state, e);
	}
	function Te(e) {
		H()?.(i.state, e);
	}
	function K() {
		me()?.(i.state);
	}
	var Ee = mu(), De = M(Ee), Oe = (n) => {
		var r = ou(), s = M(r), c = (e) => {
			gu(e, {
				get state() {
					return i.state.parentNodeState;
				},
				get previewModelByEventId() {
					return u();
				},
				get getSensitiveBodyLoader() {
					return f();
				},
				get emojiLoadStateByUrl() {
					return g();
				},
				get emojiImageMetaByUrl() {
					return _();
				},
				get scrollRoot() {
					return v();
				},
				get onImageOpen() {
					return y();
				},
				get buildPostRecordForNode() {
					return b();
				},
				get onReplyPost() {
					return x();
				},
				get onQuotePost() {
					return C();
				},
				get onReactionPost() {
					return T();
				},
				get getReactionReadModel() {
					return D();
				},
				get isReactionExpanded() {
					return O();
				},
				get getReactionLabel() {
					return k();
				},
				get onToggleReaction() {
					return A();
				},
				get onToggleParent() {
					return N();
				},
				get onRetryParent() {
					return te();
				},
				get onRefreshRelatedEvents() {
					return F();
				},
				get onToggleChildren() {
					return I();
				},
				get onRetryChildren() {
					return re();
				},
				get onCopyPointerDown() {
					return z();
				},
				get onCopyNevent() {
					return ie();
				},
				get externalClientLabel() {
					return oe();
				},
				get onOpenExternalClient() {
					return ce();
				},
				get isCopyFailed() {
					return le();
				},
				get onShowRawJson() {
					return ue();
				},
				get onBroadcastPointerDown() {
					return de();
				},
				get onBroadcastPost() {
					return H();
				},
				get isBroadcastSending() {
					return U();
				},
				get canDeleteNodePost() {
					return fe();
				},
				get isDeletionSending() {
					return pe();
				},
				get onOpenDeleteConfirm() {
					return me();
				}
			});
		}, l = (e) => {
			var n = ru(), r = w(n, !0);
			P((e) => t(r, e), [() => a()("postHistory.replyTargetDeleted")]), m(e, n);
		}, p = (e) => {
			var n = iu(), r = w(n, !0);
			P((e) => t(r, e), [() => a()("postHistory.contextNotFound")]), m(e, n);
		}, h = (n) => {
			var r = au(), s = V(r), c = w(s, !0), l = E(s, 2);
			Q(l, {
				type: "button",
				className: "post-history-context-button post-history-context-retry-button",
				onClick: () => te()?.(i.state.node.eventId),
				children: (n, r) => {
					e();
					var i = o();
					P((e) => t(i, e), [() => a()("postHistory.contextRetry")]), m(n, i);
				},
				$$slots: { default: !0 }
			}), P((e) => t(c, e), [() => a()("postHistory.contextFetchFailed")]), m(n, r);
		};
		d(s, (e) => {
			i.state.parentExpansion.visibleParent && i.state.parentNodeState ? e(c) : i.state.parentExpansion.visibleParent && i.state.parentExpansion.parentDeleted ? e(l, 1) : i.state.parentExpansion.visibleParent && i.state.parentExpansion.parentMissing ? e(p, 2) : i.state.parentExpansion.visibleParent && i.state.parentExpansion.parentError && e(h, 3);
		}), j(r), m(n, r);
	};
	d(De, (e) => {
		i.state.parentTargetId && e(Oe);
	});
	var ke = E(De, 2), Ae = M(ke);
	{
		let e = (e) => {
			var t = h(), n = V(t), r = (e) => {
				var t = su(), n = M(t);
				{
					let e = S(() => i.state.parentExpansion.visibleParent ? a()("postHistory.hideReplyTarget") : a()("postHistory.showReplyTarget")), t = S(() => i.state.parentExpansion.visibleParent ? a()("postHistory.hideReplyTarget") : a()("postHistory.showReplyTarget")), r = S(() => i.state.parentExpansion.visibleParent && i.state.parentExpansion.showParentLoadingIndicator);
					Zl(n, {
						get ariaLabel() {
							return B(e);
						},
						get title() {
							return B(t);
						},
						get expanded() {
							return i.state.parentExpansion.visibleParent;
						},
						get loading() {
							return B(r);
						},
						onClick: () => N()?.(i.state.node.eventId)
					});
				}
				j(t), m(e, t);
			};
			d(n, (e) => {
				i.state.parentTargetId && !i.state.parentAlreadyInPath && !(i.state.parentExpansion.visibleParent && i.state.parentExpansion.parentDeleted) && e(r);
			}), m(e, t);
		}, n = (e) => {
			tu(e, { get eventId() {
				return i.state.node.eventId;
			} });
		}, r = (e) => {
			var t = h(), n = V(t), r = (e) => {
				{
					let t = (e) => {
						var t = h(), n = V(t), r = (e) => {
							{
								let t = S(be), n = S(be);
								Ir(e, {
									get count() {
										return i.state.repliesActionState.replyCount;
									},
									get selected() {
										return i.state.repliesActionState.visible;
									},
									get ariaLabel() {
										return B(t);
									},
									get tooltipContent() {
										return B(n);
									},
									onClick: xe
								});
							}
						};
						d(n, (e) => {
							B(ge) && e(r);
						}), m(e, t);
					}, n = (e) => {
						let t = S(() => D()?.(i.state.node.eventId));
						var n = h(), r = V(n), a = (e) => {
							{
								let n = S(() => O()?.(i.state.node.eventId) ?? !1), r = S(() => k()?.(i.state.node.eventId) ?? "");
								gr(e, {
									get count() {
										return B(t).totalCount;
									},
									get expanded() {
										return B(n);
									},
									get ariaLabel() {
										return B(r);
									},
									onToggle: () => A()?.(i.state.node.eventId)
								});
							}
						};
						d(r, (e) => {
							B(t) && B(t).totalCount > 0 && e(a);
						}), m(e, n);
					}, r = S(() => b()(i.state)), a = S(() => i.state.node.event.kind === 42 ? void 0 : x()), o = S(() => i.state.node.event.kind === 42 ? void 0 : C());
					cr(e, {
						get onReactionPost() {
							return T();
						},
						get post() {
							return B(r);
						},
						get onReplyPost() {
							return B(a);
						},
						get onQuotePost() {
							return B(o);
						},
						replyExtras: t,
						reactionExtras: n,
						$$slots: {
							replyExtras: !0,
							reactionExtras: !0
						}
					});
				}
			};
			d(n, (e) => {
				b() && e(r);
			}), m(e, t);
		}, o = (e) => {
			let t = S(() => D()?.(i.state.node.eventId));
			var n = h(), r = V(n), a = (e) => {
				jr(e, {
					get readModel() {
						return B(t);
					},
					get emojiLoadStateByUrl() {
						return g();
					},
					get emojiImageMetaByUrl() {
						return _();
					}
				});
			}, o = S(() => B(t) && B(t).totalCount > 0 && (O()?.(i.state.node.eventId) ?? !1));
			d(r, (e) => {
				B(o) && e(a);
			}), m(e, n);
		}, c = (e) => {
			let n = S(() => a()("common.showActions"));
			zr(e, {
				get triggerAriaLabel() {
					return B(n);
				},
				get tooltipContent() {
					return B(n);
				},
				enableTooltip: !0,
				get timestamp() {
					return B(he);
				},
				items: (e) => {
					var n = du(), r = V(n), o = (e) => {
						var n = lu(), r = V(n);
						s(r, () => On, (e, n) => {
							n(e, {
								class: "menu-action-button",
								onSelect: () => ce()?.(i.state),
								children: (e, n) => {
									var r = cu(), i = E(V(r), 2), a = w(i, !0);
									P(() => t(a, oe())), m(e, r);
								},
								$$slots: { default: !0 }
							});
						});
						var a = E(r, 2);
						s(a, () => kn, (e, t) => {
							t(e, { class: "post-history-menu-separator" });
						}), m(e, n);
					};
					d(r, (e) => {
						oe() && ce() && e(o);
					});
					var c = E(r, 2);
					{
						let e = S(() => i.state.relatedEventsStatus === "loading");
						s(c, () => On, (n, r) => {
							r(n, {
								class: "menu-action-button",
								get disabled() {
									return B(e);
								},
								onSelect: () => F()?.(i.state.node.eventId),
								children: (e, n) => {
									var r = uu(), i = E(V(r), 2), o = w(i, !0);
									P((e) => t(o, e), [() => a()("postHistory.checkRelatedEvents")]), m(e, r);
								},
								$$slots: { default: !0 }
							});
						});
					}
					ol(E(c, 2), {
						order: "raw-json-first",
						get copyFailed() {
							return B(W);
						},
						showBroadcast: !0,
						get broadcastSending() {
							return B(_e);
						},
						get showDelete() {
							return B(ve);
						},
						showDeleteSeparator: !0,
						get deletionSending() {
							return B(ye);
						},
						onCopyPointerDown: Se,
						onCopyNevent: Ce,
						onShowRawJson: we,
						onBroadcastPointerDown: G,
						onBroadcastPost: Te,
						onOpenDeleteConfirm: K
					}), m(e, n);
				},
				$$slots: { items: !0 }
			});
		}, l = S(() => f()?.(i.state.node.event));
		nu(Ae, {
			get node() {
				return i.state.node;
			},
			get model() {
				return u()[i.state.node.eventId];
			},
			get loadSensitiveBody() {
				return B(l);
			},
			get emojiLoadStateByUrl() {
				return g();
			},
			get emojiImageMetaByUrl() {
				return _();
			},
			get scrollRoot() {
				return v();
			},
			get onImageOpen() {
				return y();
			},
			topActions: e,
			footerLeftExtras: n,
			footerActions: r,
			footerDetails: o,
			footerMenu: c,
			$$slots: {
				topActions: !0,
				footerLeftExtras: !0,
				footerActions: !0,
				footerDetails: !0,
				footerMenu: !0
			}
		});
	}
	j(ke);
	var je = E(ke, 2), Me = (e) => {
		var n = fu(), r = w(n, !0);
		P((e) => t(r, e), [() => a()("postHistory.relatedEventsFailed")]), m(e, n);
	};
	d(je, (e) => {
		i.state.relatedEventsStatus === "failed" && e(Me);
	});
	var Ne = E(je, 2), q = (e) => {
		var t = pu();
		r(t, 21, () => i.state.replyNodeStates, (e) => e.node.eventId, (e, t) => {
			gu(e, {
				get state() {
					return B(t);
				},
				get previewModelByEventId() {
					return u();
				},
				get getSensitiveBodyLoader() {
					return f();
				},
				get emojiLoadStateByUrl() {
					return g();
				},
				get emojiImageMetaByUrl() {
					return _();
				},
				get scrollRoot() {
					return v();
				},
				get onImageOpen() {
					return y();
				},
				get buildPostRecordForNode() {
					return b();
				},
				get onReplyPost() {
					return x();
				},
				get onQuotePost() {
					return C();
				},
				get onReactionPost() {
					return T();
				},
				get getReactionReadModel() {
					return D();
				},
				get isReactionExpanded() {
					return O();
				},
				get getReactionLabel() {
					return k();
				},
				get onToggleReaction() {
					return A();
				},
				get onToggleParent() {
					return N();
				},
				get onRetryParent() {
					return te();
				},
				get onRefreshRelatedEvents() {
					return F();
				},
				get onToggleChildren() {
					return I();
				},
				get onRetryChildren() {
					return re();
				},
				get onCopyPointerDown() {
					return z();
				},
				get onCopyNevent() {
					return ie();
				},
				get externalClientLabel() {
					return oe();
				},
				get onOpenExternalClient() {
					return ce();
				},
				get isCopyFailed() {
					return le();
				},
				get onShowRawJson() {
					return ue();
				},
				get onBroadcastPointerDown() {
					return de();
				},
				get onBroadcastPost() {
					return H();
				},
				get isBroadcastSending() {
					return U();
				},
				get canDeleteNodePost() {
					return fe();
				},
				get isDeletionSending() {
					return pe();
				},
				get onOpenDeleteConfirm() {
					return me();
				}
			});
		}), j(t), m(e, t);
	};
	d(Ne, (e) => {
		i.state.repliesActionState.visible && i.state.replyNodeStates.length > 0 && e(q);
	}), j(Ee), P(() => {
		ae(ke, "data-post-history-thread-anchor-scope-id", i.state.anchorEventId), ae(ke, "data-post-history-thread-anchor-event-id", i.state.node.eventId);
	}), m(n, Ee), se(), l();
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostHistoryThreadGraphPanel.svelte
var _u = i("<span class=\"post-history-context-deleted-label post-history-thread-direct-parent-context svelte-nb00ha\"> </span>"), vu = i("<p class=\"post-history-context-message post-history-thread-direct-parent-context svelte-nb00ha\"> </p>"), yu = i("<p class=\"post-history-context-message post-history-context-error post-history-thread-direct-parent-context svelte-nb00ha\"> </p> <!>", 1), bu = i("<div class=\"post-history-thread-parent-panel svelte-nb00ha\"><!> <div class=\"post-history-context-actions svelte-nb00ha\"><!></div></div>"), xu = i("<div class=\"post-history-thread-replies-panel svelte-nb00ha\"><div class=\"post-history-thread-replies-list svelte-nb00ha\"></div></div>"), Su = {
	hash: "svelte-nb00ha",
	code: ".post-history-thread-parent-panel.svelte-nb00ha,\n    .post-history-thread-replies-panel.svelte-nb00ha {display:grid;gap:6px;}.post-history-thread-parent-panel.svelte-nb00ha {padding-bottom:4px;}.post-history-thread-replies-list.svelte-nb00ha {display:grid;}.post-history-context-actions.svelte-nb00ha {display:flex;flex-wrap:wrap;gap:6px;}.post-history-thread-direct-parent-context {margin-inline-start:var(--thread-direct-parent-indent);}.post-history-context-button {min-height:28px;padding:2px 6px;color:var(--text-muted);background:transparent;font-size:0.82rem;}\n\n    @media (hover: hover) and (pointer: fine) {.post-history-context-button:hover:not(:disabled) {color:var(--theme);background:color-mix(in srgb, var(--theme) 10%, transparent);}\n    }.post-history-context-message.svelte-nb00ha {margin:0;color:var(--text-muted);font-size:0.82rem;}.post-history-context-deleted-label.svelte-nb00ha {width:fit-content;min-height:28px;padding:2px 6px;color:var(--text-muted);background-color:transparent;border:1px solid var(--btn-border);font-size:0.82rem;font-weight:normal;cursor:default;user-select:none;display:flex;align-items:center;}.post-history-context-error.svelte-nb00ha {color:var(--danger);}"
};
function Cu(i, a) {
	p(a, !0), ee(i, Su);
	let s = () => R(Ie, "$_", c), [c, l] = ne(), u = L(a, "previewModelByEventId", 19, () => ({})), f = L(a, "getSensitiveBodyLoader", 3, void 0), g = L(a, "emojiLoadStateByUrl", 19, () => ({})), _ = L(a, "emojiImageMetaByUrl", 19, () => ({})), v = L(a, "scrollRoot", 3, null), y = L(a, "onImageOpen", 3, void 0), b = L(a, "buildPostRecordForNode", 3, void 0), x = L(a, "onReplyPost", 3, void 0), C = L(a, "onQuotePost", 3, void 0), T = L(a, "onReactionPost", 3, void 0), D = L(a, "getReactionReadModel", 3, void 0), O = L(a, "isReactionExpanded", 3, void 0), k = L(a, "getReactionLabel", 3, void 0), A = L(a, "onToggleReaction", 3, void 0), N = L(a, "onToggleParent", 3, void 0), te = L(a, "onRetryParent", 3, void 0), F = L(a, "onToggleNodeParent", 3, void 0), I = L(a, "onRetryNodeParent", 3, void 0), re = L(a, "onRefreshRelatedEvents", 3, void 0), z = L(a, "onToggleNodeChildren", 3, void 0), ie = L(a, "onRetryNodeChildren", 3, void 0), ae = L(a, "onCopyPointerDown", 3, void 0), oe = L(a, "onCopyNevent", 3, void 0), ce = L(a, "externalClientLabel", 3, void 0), le = L(a, "onOpenExternalClient", 3, void 0), ue = L(a, "isCopyFailed", 3, void 0), de = L(a, "onShowRawJson", 3, void 0), H = L(a, "onBroadcastPointerDown", 3, void 0), U = L(a, "onBroadcastPost", 3, void 0), fe = L(a, "isBroadcastSending", 3, void 0), pe = L(a, "canDeleteNodePost", 3, void 0), me = L(a, "isDeletionSending", 3, void 0), he = L(a, "onOpenDeleteConfirm", 3, void 0), ge = `${rr(-1)}rem`, W = S(() => a.state.parentNode ? {
		anchorEventId: a.state.anchorEventId,
		node: a.state.parentNode,
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
	var _e = h(), ve = V(_e), ye = (r) => {
		var i = bu(), c = M(i), l = (e) => {
			gu(e, {
				get state() {
					return a.state.parentNodeState;
				},
				get previewModelByEventId() {
					return u();
				},
				get getSensitiveBodyLoader() {
					return f();
				},
				get emojiLoadStateByUrl() {
					return g();
				},
				get emojiImageMetaByUrl() {
					return _();
				},
				get scrollRoot() {
					return v();
				},
				get onImageOpen() {
					return y();
				},
				get buildPostRecordForNode() {
					return b();
				},
				get onReplyPost() {
					return x();
				},
				get onQuotePost() {
					return C();
				},
				get onReactionPost() {
					return T();
				},
				get getReactionReadModel() {
					return D();
				},
				get isReactionExpanded() {
					return O();
				},
				get getReactionLabel() {
					return k();
				},
				get onToggleReaction() {
					return A();
				},
				get onToggleParent() {
					return F();
				},
				get onRetryParent() {
					return I();
				},
				get onRefreshRelatedEvents() {
					return re();
				},
				get onToggleChildren() {
					return z();
				},
				get onRetryChildren() {
					return ie();
				},
				get onCopyPointerDown() {
					return ae();
				},
				get onCopyNevent() {
					return oe();
				},
				get externalClientLabel() {
					return ce();
				},
				get onOpenExternalClient() {
					return le();
				},
				get isCopyFailed() {
					return ue();
				},
				get onShowRawJson() {
					return de();
				},
				get onBroadcastPointerDown() {
					return H();
				},
				get onBroadcastPost() {
					return U();
				},
				get isBroadcastSending() {
					return fe();
				},
				get canDeleteNodePost() {
					return pe();
				},
				get isDeletionSending() {
					return me();
				},
				get onOpenDeleteConfirm() {
					return he();
				}
			});
		}, p = (e) => {
			gu(e, {
				get state() {
					return B(W);
				},
				get previewModelByEventId() {
					return u();
				},
				get getSensitiveBodyLoader() {
					return f();
				},
				get emojiLoadStateByUrl() {
					return g();
				},
				get emojiImageMetaByUrl() {
					return _();
				},
				get scrollRoot() {
					return v();
				},
				get onImageOpen() {
					return y();
				},
				get buildPostRecordForNode() {
					return b();
				},
				get onReplyPost() {
					return x();
				},
				get onQuotePost() {
					return C();
				},
				get onReactionPost() {
					return T();
				},
				get getReactionReadModel() {
					return D();
				},
				get isReactionExpanded() {
					return O();
				},
				get getReactionLabel() {
					return k();
				},
				get onToggleReaction() {
					return A();
				},
				get onToggleParent() {
					return F();
				},
				get onRetryParent() {
					return I();
				},
				get onRefreshRelatedEvents() {
					return re();
				},
				get onToggleChildren() {
					return z();
				},
				get onRetryChildren() {
					return ie();
				},
				get onCopyPointerDown() {
					return ae();
				},
				get onCopyNevent() {
					return oe();
				},
				get externalClientLabel() {
					return ce();
				},
				get onOpenExternalClient() {
					return le();
				},
				get isCopyFailed() {
					return ue();
				},
				get onShowRawJson() {
					return de();
				},
				get onBroadcastPointerDown() {
					return H();
				},
				get onBroadcastPost() {
					return U();
				},
				get isBroadcastSending() {
					return fe();
				},
				get canDeleteNodePost() {
					return pe();
				},
				get isDeletionSending() {
					return me();
				},
				get onOpenDeleteConfirm() {
					return he();
				}
			});
		}, h = (e) => {
			var n = _u(), r = w(n, !0);
			P((e) => t(r, e), [() => s()("postHistory.replyTargetDeleted")]), m(e, n);
		}, ee = (e) => {
			var n = vu(), r = w(n, !0);
			P((e) => t(r, e), [() => s()("postHistory.contextNotFound")]), m(e, n);
		}, ne = (n) => {
			var r = yu(), i = V(r), a = w(i, !0), c = E(i, 2);
			Q(c, {
				type: "button",
				className: "post-history-context-button post-history-context-retry-button",
				onClick: () => te()?.(),
				children: (n, r) => {
					e();
					var i = o();
					P((e) => t(i, e), [() => s()("postHistory.contextRetry")]), m(n, i);
				},
				$$slots: { default: !0 }
			}), P((e) => t(a, e), [() => s()("postHistory.contextFetchFailed")]), m(n, r);
		};
		d(c, (e) => {
			a.state.parentExpansion.visibleParent && a.state.parentNodeState ? e(l) : a.state.parentExpansion.visibleParent && B(W) ? e(p, 1) : a.state.parentExpansion.visibleParent && a.state.parentExpansion.parentDeleted ? e(h, 2) : a.state.parentExpansion.visibleParent && a.state.parentExpansion.parentMissing ? e(ee, 3) : a.state.parentExpansion.visibleParent && a.state.parentExpansion.parentError && e(ne, 4);
		});
		var L = E(c, 2), R = M(L), se = (e) => {
			{
				let t = S(() => a.state.parentExpansion.visibleParent ? s()("postHistory.hideReplyTarget") : s()("postHistory.showReplyTarget")), n = S(() => a.state.parentExpansion.visibleParent ? s()("postHistory.hideReplyTarget") : s()("postHistory.showReplyTarget")), r = S(() => a.state.parentExpansion.visibleParent && a.state.parentExpansion.showParentLoadingIndicator);
				Zl(e, {
					get ariaLabel() {
						return B(t);
					},
					get title() {
						return B(n);
					},
					get expanded() {
						return a.state.parentExpansion.visibleParent;
					},
					get loading() {
						return B(r);
					},
					onClick: () => N()?.()
				});
			}
		};
		d(R, (e) => {
			a.state.parentExpansion.visibleParent && a.state.parentExpansion.parentDeleted || e(se);
		}), j(L), j(i), P(() => n(i, `--thread-direct-parent-indent: ${ge}`)), m(r, i);
	}, be = (e) => {
		var t = xu(), n = M(t);
		r(n, 21, () => a.state.replyNodeStates, (e) => e.node.eventId, (e, t) => {
			gu(e, {
				get state() {
					return B(t);
				},
				get previewModelByEventId() {
					return u();
				},
				get getSensitiveBodyLoader() {
					return f();
				},
				get emojiLoadStateByUrl() {
					return g();
				},
				get emojiImageMetaByUrl() {
					return _();
				},
				get scrollRoot() {
					return v();
				},
				get onImageOpen() {
					return y();
				},
				get buildPostRecordForNode() {
					return b();
				},
				get onReplyPost() {
					return x();
				},
				get onQuotePost() {
					return C();
				},
				get onReactionPost() {
					return T();
				},
				get getReactionReadModel() {
					return D();
				},
				get isReactionExpanded() {
					return O();
				},
				get getReactionLabel() {
					return k();
				},
				get onToggleReaction() {
					return A();
				},
				get onToggleParent() {
					return F();
				},
				get onRetryParent() {
					return I();
				},
				get onRefreshRelatedEvents() {
					return re();
				},
				get onToggleChildren() {
					return z();
				},
				get onRetryChildren() {
					return ie();
				},
				get onCopyPointerDown() {
					return ae();
				},
				get onCopyNevent() {
					return oe();
				},
				get externalClientLabel() {
					return ce();
				},
				get onOpenExternalClient() {
					return le();
				},
				get isCopyFailed() {
					return ue();
				},
				get onShowRawJson() {
					return de();
				},
				get onBroadcastPointerDown() {
					return H();
				},
				get onBroadcastPost() {
					return U();
				},
				get isBroadcastSending() {
					return fe();
				},
				get canDeleteNodePost() {
					return pe();
				},
				get isDeletionSending() {
					return me();
				},
				get onOpenDeleteConfirm() {
					return he();
				}
			});
		}), j(n), j(t), m(e, t);
	};
	d(ve, (e) => {
		a.section === "parent" && a.state.parentTargetId ? e(ye) : a.section === "children" && a.state.repliesActionState.visible && a.state.replyNodeStates.length > 0 && e(be, 1);
	}), m(i, _e), se(), l();
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/hooks/usePostHistoryCopyNevent.svelte.ts
function wu() {
	let e = 0, t = /* @__PURE__ */ new Set(), n = b(F({})), r = b(!1), i = b(0), a = b(0), o, s = b(void 0);
	function c(e) {
		return Nt(e, Ot.value);
	}
	function l() {
		o &&= (clearTimeout(o), void 0), k(r, !1), k(s, void 0);
	}
	function u(e, t) {
		k(s, {
			eventId: e.eventId,
			...It(t.clientX, t.clientY)
		}, !0);
	}
	function d(e, t) {
		if (B(s)?.eventId === e.eventId) return {
			x: B(s).x,
			y: B(s).y
		};
		let n = t.currentTarget, r = n instanceof HTMLElement ? n.getBoundingClientRect() : null;
		return It(r ? r.left + r.width / 2 : 0, r ? r.bottom + 8 : 0);
	}
	function f(e, t) {
		o && clearTimeout(o), k(i, e, !0), k(a, t, !0), k(r, !0), o = setTimeout(() => {
			k(r, !1), o = void 0;
		}, 1800);
	}
	async function p(r, i) {
		let a = e, o = d(r, i), s = c(r), l = s ? await En(s, "nevent", navigator, window) : !1;
		if (a !== e) return;
		if (l) {
			k(n, {
				...B(n),
				[r.eventId]: void 0
			}, !0), f(o.x, o.y);
			return;
		}
		k(n, {
			...B(n),
			[r.eventId]: "failed"
		}, !0);
		let u = setTimeout(() => {
			t.delete(u), a === e && k(n, {
				...B(n),
				[r.eventId]: void 0
			}, !0);
		}, 1800);
		t.add(u);
	}
	function m() {
		e++, t.forEach(clearTimeout), t.clear(), k(n, {}, !0), l();
	}
	return {
		get copyState() {
			return B(n);
		},
		get showCopyFloatingMessage() {
			return B(r);
		},
		get copyFloatingMessageX() {
			return B(i);
		},
		get copyFloatingMessageY() {
			return B(a);
		},
		captureCopyPointerPosition: u,
		hideCopyFloatingMessage: l,
		handleCopyNevent: p,
		resetState: m
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryQuoteUtils.ts
var Tu = /nostr:[^\s<>"']+/gi, Eu = /[),.!?:;\]\u3001\u3002\uff01\uff08\uff09\uff0c\uff0e\uff1a\uff1b\u300d\u300f\u3011]+$/u, Du = /^[\s),.!?:;\]\u3001\u3002\uff01\uff08\uff09\uff0c\uff0e\uff1a\uff1b\u300d\u300f\u3011]+$/u;
function Ou(e) {
	return fe.sanitizeExternalRelayUrls(typeof e == "string" && e.length > 0 ? [e] : [], { limit: 1 })[0] ?? null;
}
function ku(e) {
	let t = e.match(Eu);
	if (!t) return {
		uri: e,
		trailingText: ""
	};
	let n = t[0];
	return {
		uri: e.slice(0, -n.length),
		trailingText: n
	};
}
function Au(e) {
	if (!e.toLowerCase().startsWith("nostr:")) return null;
	try {
		let t = U.decode(e.slice(6));
		return t.type === "note" ? t.data : t.type === "nevent" ? t.data.id : null;
	} catch {
		return null;
	}
}
function ju(e) {
	let t = e.replace(/[ \t]{2,}/g, " ").trim();
	return t.length === 0 || Du.test(t) ? null : t;
}
function Mu(e) {
	if (!e) return [];
	let t = /* @__PURE__ */ new Map();
	for (let n of e.tags) {
		if (!Array.isArray(n) || n[0] !== "q") continue;
		let e = n[1];
		if (!me(e)) continue;
		let r = Ou(n[2]), i = me(n[3]) ? n[3] : null, a = t.get(e);
		a ? (!a.relayHint && r && (a.relayHint = r), !a.authorHint && i && (a.authorHint = i)) : t.set(e, {
			eventId: e,
			relayHint: r,
			authorHint: i
		});
	}
	return Array.from(t.values());
}
function Nu(e) {
	if (!e || typeof e.content != "string" || e.content.length === 0) return e?.content ?? "";
	let t = Mu(e);
	if (t.length === 0) return e.content;
	let n = new Set(t.map((e) => e.eventId)), r = !1, i = e.content.split(/\r?\n/).map((e) => {
		if (!e) return e;
		let t = "", i = 0, a = !1;
		for (let o of e.matchAll(Tu)) {
			let s = o.index ?? -1, c = o[0] ?? "";
			if (s < 0 || !c) continue;
			let { uri: l, trailingText: u } = ku(c), d = Au(l);
			d && n.has(d) && (a = !0, r = !0, t += e.slice(i, s), t += u, i = s + c.length);
		}
		return a ? (t += e.slice(i), ju(t)) : e;
	});
	return r ? i.filter((e) => e !== null).join("\n") : e.content;
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryRelatedTargetDiscoveryAdapter.ts
var Pu = 8, Fu = {
	byPostId: {},
	contextsByEventId: {}
};
function Iu(e) {
	return fe.sanitizeExternalRelayUrls(e, { limit: Pu });
}
function Lu(e) {
	return {
		sourceEventId: e.sourceEventId,
		targetEventId: e.targetEventId,
		relationKind: e.relationKind,
		relayHints: Iu(e.relayHints),
		authorHint: e.authorHint,
		scopeKey: e.scopeKey
	};
}
var Ru = {
	buildIndex(e) {
		let t = {}, n = {};
		for (let r of e) {
			let e = Mu(r);
			if (e.length !== 0) {
				t[r.eventId] = e;
				for (let t of e) {
					let e = n[t.eventId];
					n[t.eventId] = {
						eventId: t.eventId,
						sourceEventId: e?.sourceEventId ?? r.eventId,
						authorHint: e?.authorHint ?? t.authorHint,
						relayHints: Iu([
							...e?.relayHints ?? [],
							...t.relayHint ? [t.relayHint] : [],
							...r.relayHints,
							...r.acceptedRelays,
							...r.fetchedRelays ?? []
						])
					};
				}
			}
		}
		return {
			byPostId: t,
			contextsByEventId: n
		};
	},
	toDescriptor(e, t) {
		return Lu({
			sourceEventId: e.sourceEventId,
			targetEventId: e.eventId,
			relationKind: "quote",
			relayHints: e.relayHints,
			authorHint: e.authorHint,
			scopeKey: t
		});
	}
}, zu = {
	getRelayHints(e, t) {
		let n = ge(t.event);
		return Iu([
			...n.replyRelayHint ? [n.replyRelayHint] : [],
			...n.rootRelayHint ? [n.rootRelayHint] : [],
			...t.relayUrls,
			...n.relayHints,
			...e.relayHints,
			...e.acceptedRelays,
			...e.fetchedRelays ?? []
		]);
	},
	getAuthorHint(e) {
		let t = ge(e.event);
		return t.parentId ? t.parentId === t.replyId ? t.replyAuthorHint : t.parentId === t.rootId ? t.rootAuthorHint : t.replyAuthorHint ?? t.rootAuthorHint : null;
	},
	buildContext(e, t, n) {
		return n.parentEventId ? {
			sourceEventId: t,
			targetEventId: n.parentEventId,
			authorHint: this.getAuthorHint(n),
			relayHints: this.getRelayHints(e, n)
		} : null;
	},
	toDescriptor(e, t) {
		return Lu({
			sourceEventId: e.sourceEventId,
			targetEventId: e.targetEventId,
			relationKind: "reply-parent",
			relayHints: e.relayHints,
			authorHint: e.authorHint,
			scopeKey: t
		});
	}
}, Bu = 0;
function Vu(e) {
	switch (e) {
		case void 0: return "idle";
		case "resolved":
		case "not-found":
		case "deleted":
		case "error": return e;
		default: return "loading";
	}
}
function Hu(e, t) {
	let n = Vu(t?.status);
	switch (n) {
		case "idle": return {
			eventId: e,
			status: n
		};
		case "loading": return {
			eventId: e,
			status: n
		};
		case "resolved": return t?.event ? {
			eventId: e,
			status: n,
			event: t.event,
			profile: t.profile ?? null,
			relayHints: t.relayHints
		} : {
			eventId: e,
			status: "error",
			errorCode: t?.errorCode ?? "fetch_failed"
		};
		case "not-found": return {
			eventId: e,
			status: n
		};
		case "deleted": return {
			eventId: e,
			status: n
		};
		case "error": return {
			eventId: e,
			status: n,
			errorCode: t?.errorCode ?? null
		};
	}
}
function Uu({ getShow: e, getPosts: t, getRxNostr: n, getRelayConfig: r, postHistoryRepositoryImpl: i = Z, contextFetchService: a = $t, deletionRequestsRepositoryImpl: o = tn, deletionFetchService: s = nn, profileSyncCoordinator: c = void 0, relatedTargetResolver: l = void 0 }) {
	let u = l ?? Lr({
		getShow: e,
		getRxNostr: n,
		getRelayConfig: r,
		postHistoryRepositoryImpl: i,
		contextFetchService: a,
		deletionRequestsRepositoryImpl: o,
		deletionFetchService: s,
		profileSyncCoordinator: c
	}), d = !l, f = `post-history-quote-preview:${++Bu}`, p = b(0), m = null, h = Fu;
	function g() {
		let n = t();
		return n !== m && (m = n, h = Ru.buildIndex(n)), e() ? h : Fu;
	}
	function _() {
		d && u.reset();
	}
	function v(e) {
		return B(p), (g().byPostId[e.eventId] ?? []).map((e) => Hu(e.eventId, u.getTargetSnapshot(e.eventId)));
	}
	function y(t) {
		if (!e()) return;
		let n = g().contextsByEventId[t];
		n && u.retryTarget(Ru.toDescriptor(n, f));
	}
	async function x(t) {
		if (!e()) return;
		let n = Ru.buildIndex(t), r = Object.values(n.contextsByEventId);
		r.length !== 0 && await u.ensureTargets(r.map((e) => Ru.toDescriptor(e, f)), { force: !0 });
	}
	return z(() => {
		e() && k(p, u.getScopeRevision(f), !0);
	}), z(() => {
		if (!e()) return;
		n(), r();
		let t = Object.values(g().contextsByEventId);
		t.length !== 0 && u.ensureTargets(t.map((e) => Ru.toDescriptor(e, f)));
	}), ie(() => {
		u.invalidateScope(f), _();
	}), {
		getQuotePreviews: v,
		retryQuotePreview: y,
		refreshQuotePreviews: x,
		suspend: () => u.invalidateScope(f)
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryBrowsingContinuity.ts
function Wu(e, t, n = []) {
	return ct([
		...e,
		...t,
		...n
	]);
}
function Gu(e, t, n, r = null) {
	let i = ct(e), a = i.find((e) => e.since <= t && e.until >= t), o = a ? a.since - 1 : t;
	if (o < 0) return null;
	let s = i.filter((e) => e.until < o).at(-1), c = r !== null && r <= o ? r : Math.max(0, o - n);
	return {
		since: Math.max(c, s ? s.until + 1 : 0),
		until: o
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryDialogViewState.ts
var Ku = {
	currentPage: 1,
	searchPage: 1,
	searchInput: "",
	searchQuery: ""
}, qu = /* @__PURE__ */ new Map();
function Ju(e) {
	if (typeof e != "string") return null;
	let t = e.trim();
	return t.length > 0 ? t : null;
}
function Yu(e) {
	return typeof e != "number" || !Number.isFinite(e) ? 1 : Math.max(1, Math.trunc(e));
}
function Xu(e) {
	return {
		currentPage: e.currentPage,
		searchPage: e.searchPage,
		searchInput: e.searchInput,
		searchQuery: e.searchQuery
	};
}
function Zu(e) {
	let t = Ju(e);
	return Xu(t ? qu.get(t) ?? Ku : Ku);
}
function Qu(e, t) {
	let n = Ju(e);
	if (!n) return Xu(Ku);
	let r = qu.get(n) ?? Ku, i = {
		currentPage: Yu(t.currentPage ?? r.currentPage),
		searchPage: Yu(t.searchPage ?? r.searchPage),
		searchInput: t.searchInput ?? r.searchInput,
		searchQuery: t.searchQuery ?? r.searchQuery
	};
	return qu.set(n, i), Xu(i);
}
function $u(e) {
	let t = Ju(e);
	t && qu.delete(t);
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryDialogOpenRefreshDecision.ts
function ed(e) {
	let t = e.nextVisibleUntil !== e.previousVisibleUntil, n = e.insertedCount + e.updatedCount > 0 || t;
	return n ? e.searchQuery.length > 0 ? {
		didVisibleMateriallyChange: t,
		didMateriallyChange: n,
		applyAction: "reload-search-page"
	} : e.loadedPostsLength === 0 || !e.hasNewerLocal ? {
		didVisibleMateriallyChange: t,
		didMateriallyChange: n,
		applyAction: "load-latest-visible-posts"
	} : {
		didVisibleMateriallyChange: t,
		didMateriallyChange: n,
		applyAction: "refresh-count-and-availability"
	} : {
		didVisibleMateriallyChange: t,
		didMateriallyChange: n,
		applyAction: "none"
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryLocalSearchService.ts
var td = 2e3;
function nd(e) {
	return Number.isFinite(e) ? Math.max(1, Math.trunc(e)) : 1;
}
function rd(e) {
	return Number.isFinite(e) ? Math.max(1, Math.trunc(e)) : 50;
}
function id(e) {
	return e.trim().toLowerCase().split(/\s+/).filter(Boolean);
}
function ad(e) {
	return e.join(" ");
}
function od(e) {
	return {
		postHistory: wt(e),
		channelMetadata: at()
	};
}
function sd(e, t) {
	return e.postHistory === t.postHistory && e.channelMetadata === t.channelMetadata;
}
function cd(e) {
	let t = et(e.kind) && Tt(e);
	return t && e.repostTarget ? $e(e.repostTarget.rawEvent, t)?.event : null;
}
function ld(e, t) {
	return et(e.kind) ? t ? ve(t).channelEventId : void 0 : e.channelEventId;
}
function ud(e, t, n = "", r = null) {
	return [
		et(e.kind) ? "" : e.content,
		...r ? [
			r.content,
			r.id,
			r.pubkey,
			r.tags.flat().join(" "),
			...qe(r).flatMap((e) => [e.url, e.alt ?? ""])
		] : [],
		n,
		e.eventId,
		String(e.kind),
		e.tags.flat().join(" "),
		...e.media.flatMap((e) => [e.url, e.alt ?? ""]),
		ld(e, r) ?? "",
		e.relayHints.join(" "),
		e.acceptedRelays.join(" "),
		e.fetchedRelays?.join(" ") ?? "",
		t?.name ?? "",
		t?.about ?? ""
	].join("\n").toLowerCase();
}
function dd(e, t) {
	return Array.from(new Set(e.map((e) => ld(e, t.get(e.eventId))).filter((e) => typeof e == "string" && e.length > 0)));
}
var fd = new class {
	postHistoryRepositoryImpl;
	channelMetadataRepositoryImpl;
	sensitivePayloadRepositoryImpl;
	resolvedCacheEntry = null;
	inFlightEntry = null;
	runtimeCacheToken = 0;
	constructor(e = Z, t = qt, n = bt) {
		this.postHistoryRepositoryImpl = e, this.channelMetadataRepositoryImpl = t, this.sensitivePayloadRepositoryImpl = n;
	}
	clearCache() {
		this.resolvedCacheEntry = null, this.inFlightEntry = null, this.runtimeCacheToken += 1;
	}
	isResolvedCacheEntryCurrent(e, t, n, r) {
		return e.pubkeyHex === t && e.normalizedQueryKey === n && sd(e.revision, r);
	}
	assertBuildActive(e) {
		if (this.inFlightEntry !== e || this.runtimeCacheToken !== e.runtimeCacheToken) throw new DOMException("Post history search was superseded", "AbortError");
	}
	async notifyListener(e, t, n = "partial") {
		this.assertBuildActive(e);
		let r = Math.min(t.pageSize, e.filteredPosts.length);
		n === "partial" && r <= t.publishedCount || (t.publishedCount = r, await t.onProgress({
			phase: n,
			items: e.filteredPosts.slice(0, r)
		}));
	}
	async filterBatch(e, t, n, r) {
		let i = new Map(t.map((e) => [e.eventId, cd(e)])), a = t.flatMap((e) => {
			if (!he(e.rawEvent, e)) return [];
			let t = et(e.kind) ? i.get(e.eventId) : e.rawEvent;
			if (!t) return [];
			let n = Ye(t);
			return n ? [{
				structure: t,
				payloadId: n.eventId,
				historyEventId: e.eventId
			}] : [];
		}), o = a.length > 0 ? await this.sensitivePayloadRepositoryImpl.getByIds(a.map(({ payloadId: e }) => e)) : [];
		this.assertBuildActive(e);
		let s = new Map(o.map((e) => [e.id, e])), c = /* @__PURE__ */ new Map();
		for (let { structure: e, payloadId: t, historyEventId: n } of a) {
			let r = s.get(t);
			if (!r || r.deletedAt !== void 0) continue;
			let i = r.rawEvent;
			nt(e, i, t) && c.set(n, i.content);
		}
		let l = dd(t, i).filter((e) => !r.has(e));
		if (l.length > 0) {
			let t = await this.channelMetadataRepositoryImpl.getMany(l);
			this.assertBuildActive(e), l.forEach((e) => r.set(e, null)), t.forEach((e) => {
				r.set(e.channelEventId, e);
			});
		}
		return t.filter((e) => {
			let t = i.get(e.eventId), a = ld(e, t), o = ud(e, a ? r.get(a) ?? null : null, c.get(e.eventId) ?? "", t);
			return n.every((e) => o.includes(e));
		});
	}
	async buildFilteredPosts(e, t, n) {
		let r = /* @__PURE__ */ new Map(), i;
		for (;;) {
			this.assertBuildActive(e);
			let a = await this.postHistoryRepositoryImpl.getSearchScanChunk({
				pubkeyHex: e.pubkeyHex,
				cursor: i,
				limit: td
			});
			this.assertBuildActive(e);
			let o = await this.filterBatch(e, a.items, t, r), s = sd(e.revision, od(e.pubkeyHex));
			if (!s && n) break;
			if (e.filteredPosts.push(...o), s) for (let t of e.listeners) await this.notifyListener(e, t);
			if (this.assertBuildActive(e), !a.hasMore || !a.nextCursor) break;
			i = a.nextCursor;
		}
		return e.filteredPosts;
	}
	startFilteredPostsBuild(e, t, n, r) {
		let i = Symbol("post-history-local-search"), a = this.runtimeCacheToken, o = {
			identity: i,
			runtimeCacheToken: a,
			pubkeyHex: e,
			normalizedQueryKey: t,
			revision: r,
			promise: Promise.resolve([]),
			filteredPosts: [],
			listeners: /* @__PURE__ */ new Set()
		};
		return this.inFlightEntry = o, o.promise = (async () => {
			let s = r;
			for (let r = 0; r < 2; r += 1) {
				let c = await this.buildFilteredPosts(o, n, r === 0);
				this.assertBuildActive(o);
				let l = od(e), u = sd(s, l);
				if (u && this.inFlightEntry?.identity === i && this.runtimeCacheToken === a && (this.resolvedCacheEntry = {
					pubkeyHex: e,
					normalizedQueryKey: t,
					revision: s,
					filteredPosts: c
				}), u || r === 1) return c;
				s = l, this.inFlightEntry?.identity === i && this.runtimeCacheToken === a && (o.revision = s), o.filteredPosts = [];
				for (let e of o.listeners) await this.notifyListener(o, e, "reset");
			}
			return [];
		})().finally(() => {
			this.inFlightEntry?.identity === i && (this.inFlightEntry = null);
		}), this.inFlightEntry = o, o;
	}
	async searchLocalPosts(e) {
		let t = id(e.query);
		if (!e.pubkeyHex || t.length === 0) return {
			items: [],
			total: 0,
			hasNext: !1
		};
		let n = nd(e.page), r = rd(e.pageSize), i = e.pubkeyHex, a = ad(t), o = od(i);
		this.inFlightEntry && (this.inFlightEntry.pubkeyHex !== i || this.inFlightEntry.normalizedQueryKey !== a || !sd(this.inFlightEntry.revision, o)) && (this.inFlightEntry = null);
		let s = this.resolvedCacheEntry, c = s && this.isResolvedCacheEntryCurrent(s, i, a, o) ? s.filteredPosts : await (async () => {
			let s = this.inFlightEntry, c = s && s.runtimeCacheToken === this.runtimeCacheToken && s.pubkeyHex === i && s.normalizedQueryKey === a && sd(s.revision, o) ? s : this.startFilteredPostsBuild(i, a, t, o), l = n === 1 && e.onProgress ? {
				pageSize: r,
				publishedCount: 0,
				onProgress: e.onProgress
			} : null;
			l && c.listeners.add(l);
			try {
				let [e] = await Promise.all([c.promise, l ? this.notifyListener(c, l) : Promise.resolve()]);
				return e;
			} finally {
				l && c.listeners.delete(l);
			}
		})(), l = (n - 1) * r, u = l + r;
		return {
			items: c.slice(l, u),
			total: c.length,
			hasNext: u < c.length
		};
	}
}(), pd = 12, md = 3600, hd = class extends Error {
	phase;
	phaseStartedAt;
	errorClass;
	constructor(e, t, n) {
		super(e), this.name = "PostHistoryCurrentViewRefetchFailure", this.phase = e, this.phaseStartedAt = n, this.errorClass = t instanceof Error ? t.name : typeof t, this.cause = t;
	}
};
function gd(e, t) {
	return e.status === "timeout" || e.status === "error" || e.status === "cancelled" ? e.status : typeof e.coverageComplete == "boolean" ? e.coverageComplete && !e.coverageSaturated ? "complete" : "partial" : e.hasMore || e.perRelayCounts.some((e) => e.rawCount >= t) ? "partial" : "complete";
}
function _d(e) {
	return e === "partial" || e === "timeout" || e === "error";
}
function vd(e, t) {
	return typeof e.coverageSaturated == "boolean" ? e.coverageSaturated : e.hasMore || e.perRelayCounts.some((e) => e.rawCount >= t);
}
function yd(e) {
	return typeof e.since == "number" && typeof e.until == "number" && e.until - e.since > md;
}
function bd(e) {
	if (!yd(e)) return [];
	let t = Math.floor((e.since + e.until) / 2);
	return t < e.since || t + 1 > e.until ? [] : [{
		...e,
		until: t,
		splitDepth: e.splitDepth + 1
	}, {
		...e,
		since: t + 1,
		splitDepth: e.splitDepth + 1
	}];
}
var xd = new class {
	postHistoryRelayFetchService;
	postHistoryRepository;
	setTimeoutFn;
	clearTimeoutFn;
	console;
	now;
	constructor(e = {}) {
		this.postHistoryRelayFetchService = e.postHistoryRelayFetchService ?? pn, this.postHistoryRepository = e.postHistoryRepository ?? Z, this.setTimeoutFn = e.setTimeoutFn ?? setTimeout, this.clearTimeoutFn = e.clearTimeoutFn ?? clearTimeout, this.console = e.console ?? (globalThis.console === void 0 ? { debug: () => void 0 } : globalThis.console), this.now = e.now ?? Date.now;
	}
	async waitBetweenFetches(e) {
		await new Promise((t) => {
			let n = this.setTimeoutFn(() => {
				e(null), t();
			}, 500);
			e(() => {
				this.clearTimeoutFn(n), e(null), t();
			});
		});
	}
	refetchAroundCurrentView(e, t) {
		let n = !1, r = null, i = null, a = t.preferredRanges.map((e) => ({
			kinds: [...e.kinds],
			rangeUnit: e.rangeUnit,
			...typeof e.since == "number" ? { since: e.since } : {},
			...typeof e.until == "number" ? { until: e.until } : {},
			limit: e.limit,
			splitDepth: 0
		}));
		return {
			promise: (async () => {
				let o = 0, s = 0, c = 0, l = 0, u = !1, d = !1, f = !1, p = !1, m = !1, h = 0, g = 0, _ = 0, v = 0, y = 0, b = !0, x = [];
				for (; a.length > 0;) {
					let S = a.shift();
					if (n || (l > 0 && await this.waitBetweenFetches((e) => {
						i = e;
					}), n)) break;
					let C = await Kn({
						ownerPubkeyHex: t.pubkeyHex,
						rxNostr: e,
						kinds: S.kinds,
						relayConfig: t.relayConfig,
						getRelayConfig: t.getRelayConfig ?? (() => t.relayConfig),
						isActive: () => !n && t.isActive?.() !== !1
					});
					if (!C.isActive()) {
						n = !0;
						break;
					}
					let w = this.postHistoryRelayFetchService.fetchLatest(e, {
						pubkeyHex: t.pubkeyHex,
						relayConfig: t.relayConfig,
						reason: "repair-visible-range",
						kinds: S.kinds,
						limit: S.limit || 250,
						timeoutMs: bn,
						...typeof S.since == "number" ? { since: S.since } : {},
						...typeof S.until == "number" ? { until: S.until } : {}
					});
					r = w;
					let T = this.now(), E;
					try {
						E = await w.promise;
					} catch (e) {
						let t = this.now();
						throw _ += Math.max(0, t - T), new hd("primary-fetch", e, T);
					}
					if (_ += Math.max(0, this.now() - T), r = null, !C.isActive() || E.status === "cancelled") {
						n = !0;
						break;
					}
					l += 1, g += E.events.length, f ||= E.status === "error", p ||= E.status === "timeout";
					let D = typeof E.coverageComplete == "boolean", O = E.events.length === 0 && (D ? E.allCoverageRelaysFailed === !0 : !E.hasAnyRelayResponse && (E.allRelaysFailed || E.status === "error"));
					b &&= O;
					let k = 0, A = 0, j = 0;
					if (E.events.length > 0 || E.relayFetchCoverage?.length) {
						let e = this.now();
						y += 1;
						let r;
						try {
							if (r = await Qn(E, C, this.postHistoryRepository), r.applied === !1) {
								n = !0;
								break;
							}
						} catch (t) {
							throw v += Math.max(0, this.now() - e), new hd("primary-persist", t, e);
						}
						v += Math.max(0, this.now() - e), k = r.insertedCount, A = r.updatedCount, j = r.unchangedCount, o += k, s += A, c += j, await t.onProgress?.({
							insertedCount: k,
							updatedCount: A,
							unchangedCount: j,
							processedRangeCount: x.length + 1,
							attemptedRangeCount: l,
							addedCount: o,
							totalUpdatedCount: s,
							totalUnchangedCount: c
						});
					}
					let ee = vd(E, S.limit);
					d ||= ee;
					let M = ee ? bd(S) : [], N = M.length > 0 && x.length + 1 + a.length + M.length <= pd, te = ee ? "limit" : gd(E, S.limit);
					if (x.push({
						source: "preferred",
						rangeUnit: S.rangeUnit,
						...typeof S.since == "number" ? { since: S.since } : {},
						...typeof S.until == "number" ? { until: S.until } : {},
						requestedRelayUrls: [...E.requestedRelayUrls],
						observedRelayUrls: [...E.observedRelayUrls],
						eventRelayUrls: [...E.eventRelayUrls],
						eoseRelayUrls: [...E.eoseRelayUrls],
						closedRelayUrls: [...E.closedRelayUrls],
						errorRelayUrls: [...E.errorRelayUrls],
						downRelayUrls: [...E.downRelayUrls],
						completedByRxNostr: E.completedByRxNostr,
						completedByLocalTimeout: E.completedByLocalTimeout,
						hasAnyRelayResponse: E.hasAnyRelayResponse,
						allRelaysFailed: E.allRelaysFailed,
						...typeof E.coverageComplete == "boolean" ? {
							coverageRelayUrls: [...E.coverageRelayUrls ?? []],
							coverageEoseRelayUrls: [...E.coverageEoseRelayUrls ?? []],
							bestEffortRelayUrls: [...E.bestEffortRelayUrls ?? []],
							coverageComplete: E.coverageComplete,
							coverageSaturated: E.coverageSaturated ?? !1,
							allCoverageRelaysFailed: E.allCoverageRelaysFailed ?? !1
						} : {},
						status: te,
						rawCount: E.rawCount,
						uniqueCount: E.uniqueCount,
						duplicateCount: E.duplicateCount,
						insertedCount: k,
						updatedCount: A,
						unchangedCount: j
					}), ee && N ? (h += M.length, a.unshift(...M)) : ee && (m = !0), (_d(te) || O || ee && !N) && (u = !0), n || !C.isActive()) {
						n = !0;
						break;
					}
				}
				let S = !n && l > 0 && g === 0 && b, C = u || m || S, w = {
					status: n ? "cancelled" : C ? "partial" : "success",
					addedCount: o,
					updatedCount: s,
					unchangedCount: c,
					processedRangeCount: x.length,
					attemptedRangeCount: l,
					hadFailures: C,
					limitReached: d,
					hadFetchError: f,
					fetchFailed: S,
					hadTimeout: p,
					hadUnfinishedRanges: m,
					splitRetryCount: h,
					processedRanges: x,
					timing: {
						primaryFetchDurationMs: _,
						primaryPersistDurationMs: v,
						primaryPersistAttemptCount: y
					}
				};
				return this.console.debug("post_history_current_view_refetch_summary", {
					pubkeyHex: t.pubkeyHex,
					processedRangeCount: w.processedRangeCount,
					addedCount: w.addedCount,
					updatedCount: w.updatedCount,
					hadFailures: w.hadFailures,
					limitReached: w.limitReached,
					hadFetchError: w.hadFetchError,
					fetchFailed: w.fetchFailed,
					hadTimeout: w.hadTimeout,
					hadUnfinishedRanges: w.hadUnfinishedRanges,
					splitRetryCount: w.splitRetryCount,
					processedRanges: w.processedRanges
				}), w;
			})(),
			cancel: () => {
				n = !0, i?.(), r?.cancel();
			}
		};
	}
}(), Sd = 3e5;
function Cd(e, t, n) {
	let r = new Set(n.map((e) => e.eventId)), i = /* @__PURE__ */ new Map();
	for (let n of t) [
		1,
		42,
		1111
	].includes(n.kind) && n.pubkeyHex === e && r.has(n.eventId) && !i.has(n.eventId) && i.set(n.eventId, n);
	return Array.from(i.values());
}
function wd(e, t, n, r, i = Sd) {
	return e.filter((e) => {
		if (n.has(e)) return !1;
		let a = t.get(e);
		return typeof a != "number" || r - a >= i;
	});
}
function Td(e, t) {
	return {
		status: t ? e.status : "cancelled",
		savedDirectReplyCount: e.savedDirectReplyCount
	};
}
function Ed({ getShow: e, getPubkeyHex: t, getRxNostr: n, getRelayConfig: r, getLoadedPosts: i, onChildInteractionBadgeRefreshRequested: a, onQuoteVisibleRangeRefreshRequested: o, quoteVisibleRangeRepairExecutor: s, relationRepairService: c = Nr, triggerDeletionLifecycle: l = Un, now: u = Date.now }) {
	let d = null, f = 0, p = 0, m = !1, h = /* @__PURE__ */ new Set(), g = /* @__PURE__ */ new Map(), _ = /* @__PURE__ */ new Set();
	function v(e, t) {
		return !m && e === f && t();
	}
	function y(r, i, a) {
		return !m && r === p && e() && t() === i && n() === a;
	}
	function b(e) {
		let t = i();
		t.length !== 0 && e.length !== 0 && Promise.resolve(a(t, e)).catch(() => void 0);
	}
	async function x(e) {
		let t = i();
		t.length !== 0 && e.length !== 0 && await a(t, e);
	}
	function S(e) {
		e.length !== 0 && Promise.resolve(o(e)).catch(() => void 0);
	}
	async function C(e) {
		if (!e.isActive()) return;
		let t = Dr(e.source, {
			relationKinds: e.result.relationKinds,
			savedParentEventIds: e.result.savedParentEventIds,
			checkedParentEventIds: e.result.checkedParentEventIds,
			quoteRepairApplied: e.result.quoteRepairApplied,
			status: e.result.status
		});
		t.shouldRefreshQuotePreviews && e.isActive() && S(e.quoteRefreshPosts), t.parentEventIds.length !== 0 && e.isActive() && (e.awaitBadgeRefresh ? await x(t.parentEventIds) : b(t.parentEventIds));
	}
	function w(e) {
		return c.repairVisibleRangeRelations(e.rxNostr, {
			ownerPubkeyHex: e.ownerPubkeyHex,
			visiblePosts: e.visiblePosts,
			relationKinds: yr,
			quoteVisibleRangeRepairExecutor: s,
			relayConfig: r(),
			isActive: e.isActive
		});
	}
	function T(e, t, n, i) {
		t.length !== 0 && l({
			source: e,
			parentEventIds: t,
			rxNostr: n,
			relayConfig: r(),
			isActive: i
		}).then((e) => {
			e.status === "cancelled" || e.deletedReactionEventIds.length === 0 && e.deletedReplyEventIds.length === 0 || !i() || b(e.checkedParentEventIds);
		}).catch(() => void 0);
	}
	async function E(e) {
		if (e.visiblePosts.length === 0) return {
			status: "success",
			savedDirectReplyCount: 0
		};
		let t = ++f, n = () => v(t, e.isActive);
		T("listing-current-view", e.visiblePosts.map((e) => e.eventId), e.rxNostr, n);
		let r = w({
			...e,
			isActive: n
		}), i = u();
		d = r;
		try {
			let t = await r.promise, a = Math.max(0, u() - i), o = n();
			if (d === r && (d = null), t.status === "cancelled" || !o) return Td(t, !1);
			let s = u();
			try {
				await C({
					source: "listing-manual-refetch",
					result: t,
					quoteRefreshPosts: e.visiblePosts,
					isActive: n,
					awaitBadgeRefresh: !0
				});
			} catch (e) {
				return {
					status: n() ? "partial" : "cancelled",
					savedDirectReplyCount: t.savedDirectReplyCount,
					relationRepairDurationMs: a,
					failurePhase: "badge-refresh",
					failureDurationMs: Math.max(0, u() - s),
					failureErrorClass: e instanceof Error ? e.name : typeof e
				};
			}
			return {
				...Td(t, n()),
				relationRepairDurationMs: a,
				badgeRefreshDurationMs: Math.max(0, u() - s)
			};
		} catch (e) {
			return d === r && (d = null), {
				status: n() ? "partial" : "cancelled",
				savedDirectReplyCount: 0,
				failurePhase: "relation-repair",
				failureDurationMs: Math.max(0, u() - i),
				failureErrorClass: e instanceof Error ? e.name : typeof e
			};
		}
	}
	async function D(e) {
		if (e.visiblePosts.length !== 0) try {
			T("listing-current-view", e.visiblePosts.map((e) => e.eventId), e.rxNostr, e.isActive);
			let t = await w(e).promise;
			if (t.status === "cancelled" || !e.isActive()) return;
			await C({
				source: "listing-current-view",
				result: t,
				quoteRefreshPosts: e.visiblePosts,
				isActive: e.isActive,
				awaitBadgeRefresh: !0
			});
		} catch {}
	}
	function O(e) {
		let r = t(), a = n(), o = p;
		if (!r || e.length === 0) return;
		let s = Cd(r, e, i());
		if (s.length === 0) return;
		let c = s.map((e) => e.eventId);
		if (!a) return;
		let l = () => y(o, r, a);
		T("listing-older-reveal", c, a, l);
		let d = wd(c, g, _, u()), f = new Set(d), m = s.filter((e) => f.has(e.eventId));
		if (m.length === 0) return;
		m.forEach((e) => {
			_.add(e.eventId);
		});
		let v = w({
			ownerPubkeyHex: r,
			rxNostr: a,
			visiblePosts: m,
			isActive: l
		});
		h.add(v), v.promise.then((e) => {
			l() && e.status !== "cancelled" && (C({
				source: "listing-older-reveal",
				result: e,
				quoteRefreshPosts: m,
				isActive: l,
				awaitBadgeRefresh: !1
			}), e.checkedParentEventIds.length > 0 && e.checkedParentEventIds.forEach((e) => {
				g.set(e, u());
			}));
		}).catch(() => void 0).finally(() => {
			o === p && (h.delete(v), m.forEach((e) => {
				_.delete(e.eventId);
			}));
		});
	}
	function k() {
		f += 1, d?.cancel(), d = null;
	}
	function A() {
		p += 1, h.forEach((e) => e.cancel()), h.clear(), g.clear(), _.clear();
	}
	function j() {
		k(), A();
	}
	function ee() {
		m = !0, j();
	}
	return {
		repairCurrentView: E,
		repairJump: D,
		scheduleOlderRevealRepair: O,
		cancelCurrentViewRepair: k,
		resetOlderRevealRepairContext: A,
		resetAllRepairs: j,
		dispose: ee
	};
}
function Dd(e) {
	if (!e || typeof e != "object") return !1;
	let t = e;
	return Number.isFinite(t.centerCreatedAt) && Number.isFinite(t.radiusSec) && (t.radiusSec ?? 0) > 0 && Number.isFinite(t.fetchedAt);
}
function Od(e) {
	if (!e || typeof e != "object") return !1;
	let t = e;
	return typeof t.pubkeyHex == "string" && Array.isArray(t.anchors) && t.anchors.every((e) => Dd(e));
}
function kd(e, t, n, r) {
	let i = t - Math.max(0, Math.trunc(n));
	return e.filter((e) => Number.isFinite(e.centerCreatedAt) && Number.isFinite(e.radiusSec) && e.radiusSec > 0 && Number.isFinite(e.fetchedAt) && e.fetchedAt >= i).sort((e, t) => t.fetchedAt - e.fetchedAt).slice(0, Math.max(1, Math.trunc(r)));
}
function Ad(e, t, n) {
	return e.findIndex((e) => Math.abs(e.centerCreatedAt - t) <= Math.max(e.radiusSec, n));
}
var jd = new class {
	db;
	now;
	constructor(e = We, t = Date.now) {
		this.db = e, this.now = t;
	}
	async getForPubkey(e, t = {}) {
		let n = t.ttlMs ?? 2592e6, r = t.maxCount ?? 200, i = await this.db.postHistoryJumpAnchors.get(e);
		return !i || !Od(i.value) ? [] : kd(i.value.anchors, this.now(), n, r);
	}
	async addForPubkey(e) {
		let t = e.ttlMs ?? 2592e6, n = e.maxCount ?? 200, r = Number.isFinite(e.fetchedAt) ? Math.trunc(e.fetchedAt ?? 0) : this.now(), i = Number.isFinite(e.centerCreatedAt) ? Math.trunc(e.centerCreatedAt) : 0, a = Number.isFinite(e.radiusSec) ? Math.max(1, Math.trunc(e.radiusSec ?? 1)) : 1, o = await this.getForPubkey(e.pubkeyHex, {
			ttlMs: t,
			maxCount: n
		}), s = Ad(o, i, a), c = [...o];
		if (s >= 0) {
			let e = c[s];
			c[s] = {
				centerCreatedAt: i,
				radiusSec: Math.max(e.radiusSec, a),
				fetchedAt: Math.max(e.fetchedAt, r)
			};
		} else c.unshift({
			centerCreatedAt: i,
			radiusSec: a,
			fetchedAt: r
		});
		let l = kd(c, this.now(), t, n);
		return await this.db.transaction("rw", this.db.postHistoryJumpAnchors, this.db.postHistoryWriteGeneration, async () => {
			await lt(this.db, e.localWriteScope), await this.db.postHistoryJumpAnchors.put({
				id: e.pubkeyHex,
				value: {
					pubkeyHex: e.pubkeyHex,
					anchors: l
				},
				updatedAt: this.now()
			});
		}), l;
	}
	async hasNearbyAnchorForPubkey(e) {
		let t = Number.isFinite(e.targetCreatedAt) ? Math.trunc(e.targetCreatedAt) : 0;
		return (await this.getForPubkey(e.pubkeyHex, {
			ttlMs: e.ttlMs,
			maxCount: e.maxCount
		})).some((e) => Math.abs(t - e.centerCreatedAt) <= e.radiusSec);
	}
	async reconcileWithFrontier(e) {
		let t = Number.isFinite(e.frontierVisibleUntil) ? Math.trunc(e.frontierVisibleUntil) : 0, n = Number.isFinite(e.toleranceSec) ? Math.max(0, Math.trunc(e.toleranceSec ?? 0)) : 0, r = e.ttlMs ?? 2592e6, i = e.maxCount ?? 200, a = await this.getForPubkey(e.pubkeyHex, {
			ttlMs: r,
			maxCount: i
		}), o = a.filter((e) => {
			let r = e.centerCreatedAt + e.radiusSec;
			return Math.max(0, t - r) <= n;
		}), s = a.filter((e) => !o.includes(e)), c = o.length > 0 ? Math.min(t, ...o.map((e) => Math.max(0, e.centerCreatedAt - e.radiusSec))) : t;
		return o.length > 0 && await this.db.postHistoryJumpAnchors.put({
			id: e.pubkeyHex,
			value: {
				pubkeyHex: e.pubkeyHex,
				anchors: s
			},
			updatedAt: this.now()
		}), {
			nextVisibleUntil: c,
			removedCount: o.length,
			anchors: s
		};
	}
	async clearForPubkey(e) {
		e && await this.db.postHistoryJumpAnchors.delete(e);
	}
}();
// D:/ドキュメント/GitHub/ehagaki/src/lib/hooks/usePostHistoryListing.svelte.ts
function Md(e) {
	let t = e.error, n = e.errorClass ?? (t instanceof Error ? t.name : t === void 0 ? void 0 : typeof t);
	return {
		phase: e.phase,
		durationMs: e.durationMs ?? Math.max(0, (e.finishedAt ?? Date.now()) - e.startedAt),
		...n ? { errorClass: n } : {},
		...e.counts ?? {}
	};
}
function Nd(e) {
	let t = Md(e);
	"errorClass" in t ? console.warn("post_history_manual_repair_phase", t) : console.debug("post_history_manual_repair_phase", t);
}
function Pd(e) {
	return e.map((e) => e.event?.id).filter((e) => !!e);
}
function Fd({ currentPosts: e, olderPosts: t, anchorEventId: n = null, maxVisiblePosts: r, keepAbove: i }) {
	let a = [...e, ...t];
	if (a.length <= r) return {
		posts: a,
		didTrimForOlderAppend: !1,
		didDeferOlderPosts: !1
	};
	if (e.length < r) {
		let n = Math.max(0, r - e.length), i = t.slice(0, n);
		return {
			posts: [...e, ...i],
			didTrimForOlderAppend: !1,
			didDeferOlderPosts: i.length < t.length
		};
	}
	let o = typeof n == "string" ? a.findIndex((e) => e.eventId === n) : -1, s = (n) => {
		let i = a.slice(n, n + r);
		return {
			posts: i,
			didTrimForOlderAppend: !0,
			didDeferOlderPosts: Math.max(0, i.length - Math.max(0, e.length - n)) < t.length
		};
	};
	if (o < 0) return s(a.length - r);
	let c = Math.max(0, a.length - r);
	return s(Math.min(c, Math.max(0, o - i)));
}
function Id(e, t) {
	let n = new Set(e.map((e) => e.eventId));
	return t.filter((e) => !n.has(e.eventId));
}
var Ld = {
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
}, Rd = Xn([...Ze]), zd = 86400, Bd = 259200, Vd = 100;
function Hd(e, t) {
	if (e.length === 0) return !0;
	let n = e[e.length - 1]?.createdAt;
	return !Number.isFinite(n) || (n ?? 0) > t;
}
var Ud = 43200, Wd = 3600, Gd = [
	43200,
	86400,
	259200,
	604800,
	1209600,
	2592e3
], Kd = 6, qd = 2592e3;
function Jd({ status: e, changed: t, didCursorAdvanceOlder: n, hitLimit: r, continuedWithinWindow: i, attemptIndex: a, maxAttempts: o, totalVisibleAdded: s, targetVisibleAdded: c, exploredSeconds: l, maxExploreSeconds: u }) {
	return e === "success" ? n ? r && !i ? {
		shouldContinue: !1,
		reason: "hit-limit-continuation-unavailable"
	} : s >= c ? {
		shouldContinue: !1,
		reason: "target-visible-added-reached"
	} : l >= u ? {
		shouldContinue: !1,
		reason: "max-explore-seconds-reached"
	} : a >= o ? {
		shouldContinue: !1,
		reason: "max-attempts-reached"
	} : {
		shouldContinue: !0,
		reason: t ? "small-batch-continue" : "empty-window-continue"
	} : {
		shouldContinue: !1,
		reason: "cursor-not-advanced"
	} : {
		shouldContinue: !1,
		reason: `status-${e}`
	};
}
var Yd = /* @__PURE__ */ new Map();
async function Xd({ nextUntil: e, visibleOldestCreatedAt: t, pubkeyHex: n, getOldestCreatedAt: r, getNowSeconds: i = () => Math.floor(Date.now() / 1e3) }) {
	if (typeof e == "number") return e;
	if (typeof t == "number") return t;
	let a = await r(n);
	if (typeof a == "number") return a;
	let o = i();
	return Number.isFinite(o) ? o : null;
}
function Zd(e) {
	if (typeof e != "string") return null;
	let t = e.trim();
	return t.length > 0 ? t : null;
}
function Qd(e) {
	return {
		loadedPosts: [...e.loadedPosts],
		searchPosts: [...e.searchPosts],
		searchQuery: e.searchQuery ?? "",
		totalCount: e.totalCount,
		totalCountKnown: e.totalCountKnown ?? e.totalCount > 0,
		totalCountFailed: e.totalCountFailed ?? !1,
		searchTotalCount: e.searchTotalCount,
		searchTotalCountKnown: e.searchTotalCountKnown ?? e.searchTotalCount > 0,
		searchHasNext: e.searchHasNext,
		hasMoreRemote: e.hasMoreRemote,
		nextUntil: e.nextUntil,
		lastDialogOpenRefreshAt: e.lastDialogOpenRefreshAt,
		visibleUntil: e.visibleUntil,
		coverageAnchorCreatedAt: e.coverageAnchorCreatedAt ?? null,
		hasJumpCacheAnchors: e.hasJumpCacheAnchors ?? !1,
		hasOlderLocal: e.hasOlderLocal,
		hasNewerLocal: e.hasNewerLocal
	};
}
function $d(e) {
	let t = Zd(e);
	return Qd(t ? Yd.get(t) ?? Ld : Ld);
}
function ef(e, t) {
	let n = Zd(e);
	n && Yd.set(n, Qd(t));
}
function tf(e) {
	let t = Zd(e);
	t && Yd.delete(t);
}
function nf({ getShow: e, getSessionOpen: t = e, getPubkeyHex: n, getRxNostr: r, getRelayConfig: i, getSessionScrollState: a = () => null, onSessionScrollStateInvalidated: o = () => {}, onSavedAuthoredPosts: s = () => void 0, onLocalHistoryChanged: c = (e) => e(), onChildInteractionBadgeRefreshRequested: l = () => void 0, onQuoteVisibleRangeRefreshRequested: u = () => void 0, quoteVisibleRangeRepairExecutor: d = void 0, pageSize: f = 50, searchDebounceMs: p = 250 }) {
	let m = Zu(n()), h = $d(n()), g = h.searchQuery === m.searchQuery && m.searchQuery.length > 0, _ = h.totalCountKnown ?? h.totalCount > 0, v = h.totalCountFailed ? "failed" : _ ? "ready" : "unknown", y = F({
		loadedPosts: h.loadedPosts,
		searchPosts: g ? h.searchPosts : [],
		searchInput: m.searchInput,
		searchQuery: m.searchQuery,
		currentPage: 1,
		searchPage: g ? m.searchPage : 1,
		totalCount: h.totalCount,
		totalCountKnown: _,
		totalCountStatus: v,
		searchTotalCount: h.searchTotalCount,
		searchTotalCountKnown: g && (h.searchTotalCountKnown ?? h.searchTotalCount > 0),
		searchHasNext: h.searchHasNext,
		syncStatus: "idle",
		currentViewRefetchStatus: "idle",
		currentViewRefetchMessageKey: null,
		currentViewRefetchMessageValues: null,
		hasMoreRemote: h.hasMoreRemote,
		nextUntil: h.nextUntil,
		lastDialogOpenRefreshAt: h.lastDialogOpenRefreshAt,
		visibleUntil: h.visibleUntil,
		hasJumpCacheAnchors: h.hasJumpCacheAnchors,
		hasOlderLocal: h.hasOlderLocal,
		hasNewerLocal: h.hasNewerLocal,
		listingMode: "contiguous",
		sparseSource: null,
		hasSavedPostsOutsideVisibleRange: !1,
		latestOlderBackfillUiResult: null
	}), x = b(F(h.coverageAnchorCreatedAt ?? null)), C = b(F([])), w = b(F([])), T = b(F([])), E = null, D = null, O = b(F(sn.getSessionGeneration())), A = S(() => Wu(B(C), B(w))), j = S(() => Wu(B(C), B(w), B(T))), ee = null, M, N = ln(i()), ne = n(), P = r(), I = 0, L = !1, R = 0, V = !1, ae = b(!1), oe = b(null), se = null, ce = 0, ue = null, de = 0, H = b(!1), U = b("idle"), fe = !1, pe = !1, me = !1, he = null, ge = b("idle"), W = 0, ve = Zd(n()), ye = b(F(ve)), be = null, xe = null, Se = null, Ce = 0, we = b(null), G = b(!0), Te = b(!1), K = Rt.localRelayUrl, Ee = r(), De = sn.getSessionGeneration(), Oe = b(!1), ke = 0, Ae = Promise.resolve(), je = null, Me = b(!1), Ne = 0, q = null, J = null, Pe = null, Fe = null, Ie = r(), Le = g ? m.searchQuery : "", Re = !g, ze = F({
		windowSeconds: Ud,
		nextUntil: null,
		consecutiveEmptyCount: 0,
		lastRange: null,
		continuationSince: null,
		exhausted: !1
	}), Y = Math.max(f * 3, f), Be = Ed({
		getShow: e,
		getPubkeyHex: n,
		getRxNostr: r,
		getRelayConfig: i,
		getLoadedPosts: () => y.loadedPosts,
		onChildInteractionBadgeRefreshRequested: l,
		onQuoteVisibleRangeRefreshRequested: u,
		quoteVisibleRangeRepairExecutor: d
	}), X = S(() => y.searchQuery.length > 0), Ve = S(() => y.currentViewRefetchStatus === "refetching"), He = S(() => B(X) ? y.searchPosts : y.loadedPosts), Ue = S(() => B(X) ? y.searchPage : 1), Ke = S(() => B(X) ? y.searchTotalCount : y.totalCount), qe = S(() => B(X) ? Math.max(1, Math.ceil(y.searchTotalCount / f)) : 1), Je = S(() => !B(Ve) && B(X) && y.searchPage > 1), Ye = S(() => B(Je)), Xe = S(() => !B(Ve) && !B(H) && B(X) && y.searchHasNext), Qe = S(() => B(Xe)), $e = S(() => !1), et = S(() => !B(Ve) && (B(X) ? !B(H) && y.searchHasNext : y.hasOlderLocal)), tt = S(() => !B(Ve) && !B(X) && y.hasNewerLocal), nt = S(() => !B(X) && !B(Ve) && (y.listingMode === "sparse" || y.hasNewerLocal)), rt = S(() => B(He)[0]?.createdAt ?? null), it = S(() => B(He).length > 0 ? B(He)[B(He).length - 1]?.createdAt ?? null : null), at = S(() => !B(X) && !B(Ve) && y.hasOlderLocal && (y.listingMode === "sparse" || !(typeof B(it) == "number" && (y.visibleUntil === null ? y.hasJumpCacheAnchors : B(it) < y.visibleUntil)))), ot = S(() => !B(X) && !!n() && !B(Ve) && (je !== null || y.syncStatus !== "syncing" && y.syncStatus !== "older-syncing") && (!!r() && !B(Oe) && !ze.exhausted || !!Rt.localRelayUrl && B(O) === sn.getSessionGeneration() && !B(Te) && B(G) && sn.isConfigured(n()))), st = S(() => !B(X) && y.syncStatus === "older-syncing"), lt = S(() => !B(X) && (y.syncStatus === "syncing" || y.syncStatus === "older-syncing")), ut = S(() => !B(X) && y.listingMode === "contiguous" && y.loadedPosts.length > 0 && !y.hasOlderLocal && y.syncStatus !== "syncing"), dt = S(() => !B(X) && y.syncStatus !== "syncing" && y.listingMode === "contiguous" && typeof y.visibleUntil == "number" && y.loadedPosts.length > 0 && !y.hasOlderLocal && y.hasSavedPostsOutsideVisibleRange), ft = S(() => B(He).length), mt = S(() => !!n() && !!r() && !B(X) && y.loadedPosts.length > 0 && !B(Ve) && y.syncStatus !== "syncing" && y.syncStatus !== "older-syncing"), ht = S(() => B(X) || y.syncStatus === "idle" ? null : y.syncStatus === "syncing" || y.syncStatus === "older-syncing" ? "postHistory.syncing" : y.syncStatus === "synced" ? "postHistory.synced" : y.syncStatus === "no-more" ? null : "postHistory.syncFailed"), gt = S(() => !B(X) && (y.syncStatus === "syncing" || y.syncStatus === "older-syncing")), bt = S(() => B(gt) || B(Ve)), Ct = S(() => y.currentViewRefetchStatus === "refetching" ? "postHistory.repairing" : y.currentViewRefetchMessageKey), Tt = S(() => y.currentViewRefetchStatus === "refetching" ? null : y.currentViewRefetchMessageValues);
	function Dt() {
		k(Me, !1), je?.resolve(!1), je = null, ke += 1, k(Oe, !1), k(Te, !1), Ce += 1, Se?.cancel(), Se = null, ee = null, M = void 0, Ne += 1, xe?.cancel(), xe = null, y.syncStatus === "older-syncing" && (y.syncStatus = "idle");
	}
	function Ot(e, t, n = !1) {
		k(Me, n, !0), je?.resolve(!1);
		let r, i = new Promise((e) => {
			r = e;
		}), a = {
			pending: t,
			succeeded: !1,
			changed: !1,
			resolve: r,
			promise: i
		};
		return je = a, y.syncStatus = e, a;
	}
	function kt(t, n, r) {
		--t.pending, t.succeeded ||= n, t.changed ||= n && r, (n || t.pending === 0) && t.resolve(t.changed), je === t && !L && e() && (t.succeeded ? y.syncStatus = t.changed ? "synced" : "idle" : t.pending === 0 && (y.syncStatus = "failed"), Jt());
	}
	function At(e) {
		let t = Ae.then(e);
		return Ae = t.catch(() => void 0), t;
	}
	function Mt() {
		Ce += 1, Se?.cancel(), Se = null, k(Te, !1), k(T, [], !0), E = null, k(we, null), k(G, !0), Q();
	}
	function Nt(t, i = {}, a = {}) {
		let o = n();
		if (L || !e() || !o || !sn.isConfigured(o)) return null;
		if (Se) return Se;
		if (t === "older-backfill" && !B(G)) return null;
		let l = ++Ce, u = r(), d = Rt.localRelayUrl, p = sn.getSessionGeneration(), m = B(we), h = () => !L && e() && n() === o && r() === u && l === Ce && Rt.localRelayUrl === d && sn.getSessionGeneration() === p, g = sn.read({
			pubkeyHex: o,
			reason: t,
			...t === "older-backfill" && m === null ? {} : i,
			limit: t === "dialog-open-refresh" ? 30 : t === "repair-visible-range" ? 250 : 150,
			targets: y.loadedPosts.flatMap((e) => _e(e.rawEvent) ? [e.rawEvent] : []),
			isActive: h
		});
		k(Te, !0);
		let _ = {
			cancel: g.cancel,
			promise: g.promise.then(async (e) => {
				if (!e || !h() || e.sessionGeneration !== p || await vt.getLocalRevision(o) !== e.localRevision || !h()) return null;
				t !== "repair-visible-range" && (t !== "dialog-open-refresh" || m === null) && (k(G, e.hasMore && (t !== "older-backfill" || m === null || e.nextUntil !== null && e.nextUntil < m), !0), e.nextUntil !== null && k(we, Math.min(B(we) ?? e.nextUntil, e.nextUntil), !0));
				let n = !1;
				return await At(() => h() ? c(async () => {
					if (!h() || await vt.getLocalRevision(o) !== e.localRevision || !h()) return;
					E = e.localRevision;
					let r = Wu(B(T), e.browsingRanges);
					if (n = JSON.stringify(r) !== JSON.stringify(B(T)), k(T, r, !0), Q(), B(x) === null) {
						let e = await Z.getLatestVisibleChunk({
							pubkeyHex: o,
							visibleUntil: null,
							limit: f
						});
						if (!h()) return;
						k(x, e.at(-1)?.createdAt ?? null, !0);
					}
					if (await $(o), h()) {
						if (t === "older-backfill" && y.loadedPosts.length) await gr({
							anchorEventId: a.anchorEventId,
							relayFetchViewportCommit: a.viewportCommit,
							useContiguousProgress: !1
						});
						else if (!y.loadedPosts.length || y.loadedPosts.length <= f && !y.hasNewerLocal && y.sparseSource === null) await lr({ forceTotalCount: !0 });
						else {
							let e = await Promise.all(y.loadedPosts.map((e) => Z.getByEventId(e.eventId)));
							if (!h()) return;
							y.loadedPosts = e.flatMap((e) => e?.pubkeyHex === o ? [e] : []);
						}
						h() && (rr({ force: !0 }), await cr(o), h() && await ir(o, y.visibleUntil));
					}
				}) : Promise.resolve()), !h() || await vt.getLocalRevision(o) !== e.localRevision ? null : (h() && e.eventIds.length && await s(e.eventIds), {
					...e,
					changed: e.changed || n
				});
			}).catch(() => null).finally(() => {
				Se === _ && (Se = null, k(Te, !1));
			})
		};
		return Se = _, _;
	}
	function Q() {
		J = null;
	}
	function Pt(e, t) {
		return !!e && !!t && e.postedAt === t.postedAt && e.createdAt === t.createdAt && e.eventId === t.eventId;
	}
	function Ft(e) {
		return e === Ne;
	}
	function It(t, r) {
		return e() && n() === t && r === R;
	}
	function Lt() {
		V = !1, k(ae, !1), k(oe, null), se = null;
	}
	async function zt(e, t, n) {
		return await te(), t() ? V ? (k(oe, Zd(e), !0), !0) : n() ? (await new Promise((e) => {
			requestAnimationFrame(() => requestAnimationFrame(() => e()));
		}), t() ? (V = !0, k(oe, Zd(e), !0), k(ae, !0), !0) : !1) : (V = !0, k(oe, Zd(e), !0), k(ae, !0), !0) : !1;
	}
	function Bt() {
		q?.cancel(), q = null, Be.cancelCurrentViewRepair(), y.currentViewRefetchStatus === "refetching" && (y.currentViewRefetchStatus = "idle"), Vt();
	}
	function Vt() {
		Pe !== null && (clearTimeout(Pe), Pe = null);
	}
	function Ut() {
		Fe !== null && (clearTimeout(Fe), Fe = null);
	}
	function Gt() {
		ze.windowSeconds = Ud, ze.nextUntil = null, ze.consecutiveEmptyCount = 0, ze.lastRange = null, ze.continuationSince = null, ze.exhausted = !1;
	}
	function Kt() {
		y.currentViewRefetchMessageKey = null, y.currentViewRefetchMessageValues = null, Vt();
	}
	function qt() {
		Vt();
		let e = /* @__PURE__ */ new Set([
			"postHistory.repairNoChanges",
			"postHistory.repairAdded",
			"postHistory.repairChildInteractionsAdded",
			"postHistory.repairFetchFailed"
		]);
		e.has(y.currentViewRefetchMessageKey ?? "") && (Pe = setTimeout(() => {
			y.currentViewRefetchMessageKey !== null && e.has(y.currentViewRefetchMessageKey) && (y.currentViewRefetchMessageKey = null, y.currentViewRefetchMessageValues = null), Pe = null;
		}, 3500));
	}
	function Jt() {
		Ut(), (y.syncStatus === "synced" || y.syncStatus === "failed") && (Fe = setTimeout(() => {
			(y.syncStatus === "synced" || y.syncStatus === "failed") && (y.syncStatus = "idle"), Fe = null;
		}, 3500));
	}
	function Yt() {
		de += 1, k(H, !1), k(U, "idle"), fd.clearCache?.(), Lt(), y.searchInput = "", y.searchQuery = "", y.searchPage = 1, y.searchPosts = [], y.searchTotalCount = 0, y.searchTotalCountKnown = !1, y.searchHasNext = !1, Le = "", Qt(), $t();
	}
	function Xt() {
		Q(), tr(), y.loadedPosts = [], er({
			known: !1,
			status: "unknown"
		}), y.currentPage = 1, y.syncStatus = "idle", y.hasMoreRemote = !1, y.nextUntil = null, y.lastDialogOpenRefreshAt = null, y.visibleUntil = null, k(x, null), k(C, [], !0), k(w, [], !0), y.hasJumpCacheAnchors = !1, y.hasOlderLocal = !1, y.hasNewerLocal = !1, y.listingMode = "contiguous", y.sparseSource = null, y.hasSavedPostsOutsideVisibleRange = !1, y.latestOlderBackfillUiResult = null, Yt();
	}
	function Zt() {
		let e = Zd(n());
		return !!e && e === B(ye);
	}
	function Qt() {
		Zt() && Qu(n(), {
			searchInput: y.searchInput,
			searchQuery: y.searchQuery,
			currentPage: y.currentPage,
			searchPage: y.searchPage
		});
	}
	function $t() {
		Zt() && ef(n(), {
			loadedPosts: y.loadedPosts,
			searchPosts: y.searchPosts,
			searchQuery: y.searchQuery,
			totalCount: y.totalCount,
			totalCountKnown: y.totalCountKnown,
			totalCountFailed: y.totalCountStatus === "failed",
			searchTotalCount: y.searchTotalCount,
			searchTotalCountKnown: y.searchTotalCountKnown,
			searchHasNext: y.searchHasNext,
			hasMoreRemote: y.hasMoreRemote,
			nextUntil: y.nextUntil,
			lastDialogOpenRefreshAt: y.lastDialogOpenRefreshAt,
			visibleUntil: y.visibleUntil,
			coverageAnchorCreatedAt: B(x),
			hasJumpCacheAnchors: y.hasJumpCacheAnchors,
			hasOlderLocal: y.hasOlderLocal,
			hasNewerLocal: y.hasNewerLocal
		});
	}
	function en(e) {
		k(ye, Zd(e), !0);
	}
	function tn() {
		Mt(), k(x, null), k(C, [], !0), k(w, [], !0), Q(), tr(), Be.resetOlderRevealRepairContext(), y.loadedPosts = [], y.searchPosts = [], er({
			count: 0,
			known: !0,
			status: "ready"
		}), y.searchTotalCount = 0, y.searchTotalCountKnown = !1, y.searchHasNext = !1, y.currentPage = 1, y.searchPage = 1, y.hasMoreRemote = !1, y.nextUntil = null, y.lastDialogOpenRefreshAt = null, y.visibleUntil = null, y.hasJumpCacheAnchors = !1, y.hasOlderLocal = !1, y.hasNewerLocal = !1, y.listingMode = "contiguous", y.sparseSource = null, y.hasSavedPostsOutsideVisibleRange = !1, y.syncStatus = "idle", Gt(), Kt(), Ut(), Yt(), fe = !0;
	}
	function nn() {
		return y.listingMode === "sparse" && (y.sparseSource === "saved" || y.sparseSource === "jump");
	}
	function rn() {
		if (!nn()) return !1;
		let e = n();
		return Xt(), Gt(), Kt(), Ut(), $u(e), ef(e, { ...Ld }), !0;
	}
	function an() {
		Q(), R += 1, de += 1, k(H, !1), k(U, "idle");
	}
	function cn() {
		I++, Dt(), Bt(), an(), tr(), W++, B(ge) === "loading" && (k(ge, "idle"), me = !1), y.syncStatus = "idle", Kt(), Ut(), Be.resetOlderRevealRepairContext();
	}
	function un() {
		Mt(), I += 1;
		let e = rn();
		return Dt(), Bt(), an(), tr(), fd.clearCache?.(), Be.resetOlderRevealRepairContext(), e;
	}
	function fn() {
		Mt(), I += 1, rn(), Dt(), Bt(), an(), tr(), fd.clearCache?.(), Be.resetOlderRevealRepairContext(), y.syncStatus = "idle", Gt(), Kt(), Ut(), fe = !1, pe = !1, me = !1, he = null, W += 1, k(ge, "idle"), Re = !1;
	}
	function mn(e) {
		let t = Tn(e);
		y.hasMoreRemote = t, y.nextUntil = t ? e.nextUntil : null;
	}
	function hn(e) {
		Tn(e) && y.nextUntil === null && (y.hasMoreRemote = !0, y.nextUntil = e.nextUntil);
	}
	async function gn(e, t = y.visibleUntil) {
		return (!B(T).length || $n(y.visibleUntil)) && typeof B(it) == "number" && (t === null ? y.hasJumpCacheAnchors : B(it) < t) ? B(it) : typeof ze.nextUntil == "number" ? ze.nextUntil : Xd({
			nextUntil: y.nextUntil,
			visibleOldestCreatedAt: B(it),
			pubkeyHex: e,
			getOldestCreatedAt: (e) => Z.getOldestCreatedAt(e)
		});
	}
	function yn(e) {
		if (!Number.isFinite(e)) return null;
		let t = Math.trunc(e) - 1;
		return t < 0 ? null : {
			since: (typeof ze.continuationSince == "number" && ze.continuationSince <= t ? ze.continuationSince : null) ?? Math.max(0, t - ze.windowSeconds),
			until: t,
			windowSeconds: ze.windowSeconds
		};
	}
	function bn(e, t) {
		let n = [];
		return e.hasMore && n.push("hasMore"), e.rawCount >= t && n.push("rawCount"), e.perRelayCounts.some((e) => e.rawCount >= t) && n.push("perRelayRawCount"), n;
	}
	function xn(e) {
		return typeof e.oldestCreatedAt == "number" ? e.oldestCreatedAt : e.events.reduce((e, t) => {
			let n = t.event.created_at;
			return Number.isFinite(n) && (e === null || n < e) ? Math.trunc(n) : e;
		}, null);
	}
	function Cn(e, t) {
		ze.nextUntil = e, ze.continuationSince = t, ze.exhausted = e === null, y.nextUntil = e, y.hasMoreRemote = e !== null;
	}
	function wn(e, t, n) {
		bn(t, n);
		let r = xn(t);
		typeof r == "number" && r - e.since, t.rawCount ?? t.events.length, t.uniqueCount ?? t.events.length, typeof ze.nextUntil == "number" && yn(ze.nextUntil);
	}
	function En() {
		if (y.searchQuery) return [];
		let e = y.loadedPosts.map((e) => e.createdAt).filter((e) => Number.isFinite(e)).map((e) => Math.trunc(e));
		if (e.length === 0) return [];
		let t = Math.min(...e), n = Math.max(...e);
		return [{
			kinds: [...Ze],
			rangeUnit: "custom",
			since: Math.max(0, t - zd),
			until: n + zd,
			limit: 250
		}];
	}
	async function Dn(e) {
		let t = On();
		return We.transaction("r", St(We), async () => {
			let n = await yt(We, e);
			return [
				await vt.get(e, Rd),
				await ml.get(e, Rd),
				n,
				t ? await pt.get(e, Rd, t) : null,
				t
			];
		});
	}
	function On() {
		return le().runtimeKind === "standalone" ? jt(Rt.localRelayUrl ?? "") : null;
	}
	function kn(e) {
		e && e.localRelayUrl === On() && e.localRevision === D && (k(T, Wu(E === e.localRevision ? B(T) : [], e.browsingRanges), !0), E = e.localRevision, e.resumeHint && k(we, B(we) === null ? e.resumeHint.nextUntil : Math.min(B(we), e.resumeHint.nextUntil), !0));
	}
	async function An(t) {
		if (L) return [];
		let r = I, a = vn(i()), [o, s, c, l, u] = await Dn(t), d = xt(o.relays, a), f = await vt.getLocalRevision(t);
		return f !== c || f !== s.localRevision || L || r !== I || !e() || n() !== t ? [] : (k(C, d, !0), k(w, s.ranges, !0), D !== null && D !== f && Mt(), D = f, u === On() && kn(l), Wu(d, s.ranges));
	}
	async function jn(e) {
		return Wu(await An(e), E === D && On() ? B(T) : []);
	}
	async function Mn(e) {
		return B(x) === null ? Pn(e) : _t(await An(e), B(x));
	}
	async function Nn(e) {
		return (await Jn.get(e, Rd))?.visibleUntil ?? null;
	}
	async function Pn(e) {
		if (B(x) === null) return Nn(e);
		let t = B(x);
		return _t(await jn(e), t);
	}
	async function Fn(e) {
		let t = y.loadedPosts[0]?.createdAt;
		if (typeof t == "number") {
			let n = ct(await An(e)).find((e) => e.since <= t && e.until >= t)?.since;
			if (typeof n == "number") return n;
		}
		return J?.pubkeyHex === e && typeof J.visibleUntil == "number" ? J.visibleUntil : $(e);
	}
	async function In(t, a, o, s = [...Ze]) {
		let c = i(), l = I;
		return Kn({
			ownerPubkeyHex: t,
			rxNostr: a,
			kinds: s,
			relayConfig: c,
			getRelayConfig: i,
			isActive: () => l === I && Ft(o) && e() && n() === t && r() === a
		});
	}
	async function $(t, r = null) {
		let i = I, a = await Pn(t);
		return !L && i === I && e() && n() === t && (r === null || r === R) && (y.visibleUntil = a), a;
	}
	async function Ln(t, r = null) {
		let i = (await jd.getForPubkey(t, { maxCount: 1 })).length > 0;
		return e() && n() === t && (r === null || r === R) && (y.hasJumpCacheAnchors = i), i;
	}
	async function Rn(t, r) {
		let i = I, a = Ne, o = () => !L && i === I && a === Ne && e() && n() === t;
		if (B(x) === null) {
			let e = await Z.getLatestVisibleChunk({
				pubkeyHex: t,
				visibleUntil: null,
				limit: f
			});
			if (!o()) return null;
			k(x, e.length ? Math.min(...e.map((e) => e.createdAt)) : null, !0);
		}
		let s = await Pn(t);
		return o() && (y.visibleUntil = s), s;
	}
	async function zn(e, t) {
		return Rn(e, t);
	}
	async function Bn(t, r, i) {
		let a = I, o = q, s = await Pn(t);
		return !L && a === I && o === q && e() && n() === t && (y.visibleUntil = s), s;
	}
	async function Hn(e, t) {
		return typeof t == "number" ? Z.countVisibleForPubkey(e, t) : Z.countForPubkey(e);
	}
	async function Un(e, t) {
		if (typeof t == "number") return Z.countVisibleForPubkey(e, t);
		let n = ue;
		return n?.pubkeyHex === e && (await n.promise, y.totalCountKnown) || y.totalCountKnown ? y.totalCount : Z.countForPubkey(e);
	}
	function Gn(e, t) {
		return B(X) || y.listingMode !== "contiguous" || y.sparseSource !== null || n() !== e || y.visibleUntil !== t.visibleUntil ? !1 : Pt(ar(y.loadedPosts[y.loadedPosts.length - 1]), t.oldestCursor);
	}
	async function qn(t, r) {
		let i = J;
		if (!i || i.pubkeyHex !== t) return null;
		let a = await $(t, r);
		if (!e() || n() !== t || r !== R || !Gn(t, i)) return null;
		let [o, s] = await Promise.all([Promise.resolve(wt(t)), Un(t, a)]);
		return !Gn(t, i) || o !== i.revision || s !== i.totalVisibleCount ? null : i;
	}
	async function Yn(t, r, i, a, o) {
		if (Q(), i.length === 0 || !e() || n() !== t || r !== R || y.listingMode !== "contiguous" || y.sparseSource !== null) return !1;
		let s = await Un(t, a), c = y.visibleUntil, l = wt(t);
		if (l !== o || c !== a || !e() || n() !== t || r !== R || y.listingMode !== "contiguous" || y.sparseSource !== null || y.loadedPosts[0]?.eventId !== i[0]?.eventId || y.loadedPosts[y.loadedPosts.length - 1]?.eventId !== i[i.length - 1]?.eventId) return !1;
		let u = ar(i[i.length - 1]);
		return u ? (J = {
			pubkeyHex: t,
			visibleUntil: a,
			revision: l,
			totalVisibleCount: s,
			reachedVisibleCount: i.length,
			oldestCursor: u,
			latestEventId: i[0]?.eventId ?? null
		}, !0) : !1;
	}
	async function Xn(t, r, i) {
		let a = J;
		if (!a || a.pubkeyHex !== t || B(X) || y.listingMode !== "contiguous" || y.sparseSource !== null || n() !== t || !i.preserveReachedVisibleCount) return !1;
		let o = ar(y.loadedPosts[y.loadedPosts.length - 1]);
		if (!Pt(o, a.oldestCursor)) return !1;
		let s = await Un(t, r);
		return !e() || n() !== t || !Pt(o, ar(y.loadedPosts[y.loadedPosts.length - 1])) ? !1 : (J = {
			...a,
			visibleUntil: r,
			revision: wt(t),
			totalVisibleCount: s
		}, !0);
	}
	async function Zn() {
		Q(), await lr();
	}
	function $n(e, t = y.loadedPosts) {
		if (y.listingMode === "sparse" || y.hasJumpCacheAnchors) return !0;
		let n = t.length > 0 ? t[t.length - 1]?.createdAt ?? null : null;
		return typeof n == "number" ? e === null ? y.hasJumpCacheAnchors : n < e : !1;
	}
	function er({ count: e, known: t, status: n }) {
		typeof e == "number" && (y.totalCount = e), y.totalCountKnown = t, y.totalCountStatus = n;
	}
	function tr() {
		ce += 1, ue = null, er({
			known: y.totalCountKnown,
			status: y.totalCountKnown ? "ready" : "unknown"
		});
	}
	function nr(t, { force: r = !1 } = {}) {
		if (!e() || n() !== t || !r && ue?.pubkeyHex === t) return;
		let i = ++ce;
		er({
			known: y.totalCountKnown,
			status: y.totalCountKnown ? "refreshing" : "loading"
		}), ue = {
			requestId: i,
			pubkeyHex: t,
			promise: Z.countForPubkey(t).then((r) => {
				i === ce && e() && n() === t && er({
					count: r,
					known: !0,
					status: "ready"
				});
			}).catch(() => {
				i === ce && e() && n() === t && er({
					known: y.totalCountKnown,
					status: "failed"
				});
			}).finally(() => {
				ue?.requestId === i && (ue = null);
			})
		};
	}
	function rr({ force: t = !1 } = {}) {
		let r = n();
		r && e() && nr(r, { force: t });
	}
	async function ir(t, r, i = null, a = null) {
		let o = typeof r == "number" && await Z.hasPostsBeforeCreatedAt(t, r);
		!e() || n() !== t || i !== null && i !== R || a !== null && !Ft(a) || (y.hasSavedPostsOutsideVisibleRange = o);
	}
	function ar(e) {
		return e ? {
			eventId: e.eventId,
			postedAt: e.postedAt,
			createdAt: e.createdAt
		} : null;
	}
	function or(e, t) {
		return e.length <= Y ? e : t === "older" ? e.slice(e.length - Y) : e.slice(0, Y);
	}
	function sr(e, t, n) {
		return Fd({
			currentPosts: e,
			olderPosts: t,
			anchorEventId: n,
			maxVisiblePosts: Y,
			keepAbove: f
		});
	}
	async function cr(t, r = y.loadedPosts, i = null, a = {}) {
		let o = I, s = Ne;
		if (L || !e() || a.deferDuringOlderRelayFetch && B(st)) return;
		if (r.length === 0) {
			e() && n() === t && (i === null || i === R) && (y.hasOlderLocal = !1, y.hasNewerLocal = !1);
			return;
		}
		let c = ar(r[0]), l = ar(r[r.length - 1]), u = y.visibleUntil, d = y.sparseSource === "saved" && typeof u == "number" ? c ? Z.getSparseChunk({
			pubkeyHex: t,
			visibleUntil: u,
			cursor: c,
			direction: "newer",
			limit: 1
		}) : Promise.resolve([]) : c ? Z.getNewerVisibleChunk({
			pubkeyHex: t,
			visibleUntil: u,
			cursor: c,
			limit: 1
		}) : Promise.resolve([]), f = a.skipOlderCheck ? Promise.resolve([]) : y.sparseSource === "saved" && typeof u == "number" ? l ? Z.getSparseChunk({
			pubkeyHex: t,
			visibleUntil: u,
			cursor: l,
			direction: "older",
			limit: 1
		}) : Promise.resolve([]) : y.sparseSource === "jump" ? l ? Z.getOlderVisibleChunk({
			pubkeyHex: t,
			visibleUntil: null,
			cursor: l,
			limit: 1
		}) : Promise.resolve([]) : l ? Z.getOlderVisibleChunk({
			pubkeyHex: t,
			visibleUntil: u,
			cursor: l,
			limit: 1
		}) : Promise.resolve([]), [p, m] = await Promise.all([d, f]), h = r[0]?.eventId ?? null, g = r[r.length - 1]?.eventId ?? null, _ = y.loadedPosts, v = !L && e() && n() === t, b = i === null || i === R, x = b ? i : null;
		if (_.length !== r.length || (_[0]?.eventId ?? null) !== h || (_[_.length - 1]?.eventId ?? null) !== g || u !== y.visibleUntil) return a.retried || !v ? void 0 : cr(t, _, x, {
			...a,
			retried: !0
		});
		let S = v && b, C = a.deferDuringOlderRelayFetch && (B(st) || s !== Ne);
		if (o !== I && !a.retried && v && !C) return cr(t, y.loadedPosts, x, {
			...a,
			retried: !0
		});
		if (!b && !a.retried && v && !C) return cr(t, y.loadedPosts, null, {
			...a,
			retried: !0
		});
		S && o === I && !C && (y.hasNewerLocal = p.length > 0, a.skipOlderCheck || (y.hasOlderLocal = m.length > 0));
	}
	async function lr({ forceTotalCount: t = !1, skipTotalCountRefresh: r = !1, skipOlderAvailabilityCheck: i = !1, awaitProgress: a = !1, awaitAvailability: o = !1 } = {}) {
		Q();
		let s = n();
		if (!s) {
			k(ye, null), Xt();
			return;
		}
		let c = ++R, l = await $(s, c), u = wt(s), d = await Z.getLatestVisibleChunk({
			pubkeyHex: s,
			limit: f,
			visibleUntil: l
		});
		if (!e() || n() !== s || c !== R) return;
		en(s), y.listingMode = "contiguous", y.sparseSource = null, y.loadedPosts = d, y.hasNewerLocal = !1;
		let p = d.length > 0 ? Math.min(...d.map((e) => e.createdAt)) : null, m = B(x) !== p;
		if (k(x, p, !0), !await zt(s, () => It(s, c), () => y.loadedPosts.length > 0) || m && (l = await $(s, c), !It(s, c))) return;
		r || rr({ force: t }), Ln(s, c).catch(() => {});
		let h = Yn(s, c, d, l, u), g = !1;
		a ? g = await h.catch(() => (Q(), !1)) : h.catch(() => {
			Q();
		});
		let _ = i && g;
		i && !_ ? y.hasOlderLocal = !1 : _ && J && (y.hasOlderLocal = J.totalVisibleCount > J.reachedVisibleCount);
		let v = ir(s, l, c).catch(() => {}), b = cr(s, d, c, { skipOlderCheck: _ }).then(() => {
			e() && n() === s && c === R && Mr(s, d);
		}).catch(() => {});
		o && await Promise.all([v, b]);
	}
	async function ur({ skipTotalCountRefresh: t = !1 } = {}) {
		Q();
		let r = n();
		if (!r || y.loadedPosts.length === 0) {
			await lr({ skipTotalCountRefresh: t });
			return;
		}
		let i = y.loadedPosts[0], a = ar(i);
		if (!a) {
			await lr({ skipTotalCountRefresh: t });
			return;
		}
		let o = ++R, s = await $(r), c = $n(s, y.loadedPosts) ? await Z.getVisibleChunkFromCreatedAt({
			pubkeyHex: r,
			visibleUntil: s,
			createdAt: i.createdAt,
			limit: y.loadedPosts.length,
			query: { contiguous: !1 }
		}) : await (y.loadedPosts.length > 1 ? Z.getOlderVisibleChunk({
			pubkeyHex: r,
			visibleUntil: s,
			cursor: a,
			limit: y.loadedPosts.length - 1
		}).then((e) => [i, ...e]) : Promise.resolve([i]));
		e() && o === R && (y.loadedPosts = c, await zt(r, () => It(r, o), () => y.loadedPosts.length > 0) && (t || rr(), await cr(r, c, o)));
	}
	function dr(e, t) {
		return !!e && (!t || e.requestedAt > t.savedAt);
	}
	async function fr(t, r) {
		Q();
		let i = n(), a = y.loadedPosts, s = ar(a[0]), c = ar(a[a.length - 1]);
		if (!i || !e() || a.length === 0) return;
		let l = ++R, u = await $(i), [d, f] = await Promise.all([s ? Z.getNewerVisibleChunk({
			pubkeyHex: i,
			visibleUntil: u,
			cursor: s,
			limit: 1
		}) : Promise.resolve([]), c ? Z.getOlderVisibleChunk({
			pubkeyHex: i,
			visibleUntil: u,
			cursor: c,
			limit: 1
		}) : Promise.resolve([])]);
		e() && l === R && (dr(r, t) ? (o(), await lr()) : (y.hasNewerLocal = d.length > 0, y.hasOlderLocal = f.length > 0, await zt(i, () => It(i, l), () => y.loadedPosts.length > 0) && (rr(), await cr(i, y.loadedPosts, l), It(i, l) && Mr(i, y.loadedPosts))));
	}
	function pr() {
		let e = a();
		return !e || e.mode !== "normal" || e.pubkeyHex !== n() ? null : e;
	}
	function mr(e) {
		return B(X) || y.loadedPosts.length === 0 || !e ? !1 : y.loadedPosts.some((t) => t.eventId === e.anchor.eventId);
	}
	async function hr(t) {
		Q();
		let r = n();
		if (!r || !e()) return !1;
		let i = ++R, a = await $(r), s = await Z.getVisibleChunkAroundEventId({
			pubkeyHex: r,
			visibleUntil: a,
			eventId: t.anchor.eventId,
			limit: Y,
			keepAbove: f
		});
		return !e() || i !== R ? !1 : s.length === 0 ? (o(), await lr(), !1) : (y.loadedPosts = s, !await zt(r, () => It(r, i), () => y.loadedPosts.length > 0) || (rr(), await cr(r, s, i), !It(r, i)) ? !1 : (Mr(r, s), !0));
	}
	async function gr(t = {}) {
		let r = y.loadedPosts, i = t.metrics;
		i && (i.loadedPostsBeforeLength = r.length, i.loadedPostsAfterLength = r.length, i.olderPostsLength = 0, i.visibleOldestBefore = r.length > 0 ? r[r.length - 1]?.createdAt ?? null : null, i.visibleOldestAfter = r.length > 0 ? r[r.length - 1]?.createdAt ?? null : null, i.didTrimForOlderAppend = !1, i.didDeferOlderPosts = !1, i.maxVisiblePosts = Y);
		let a = n(), o = ar(y.loadedPosts[y.loadedPosts.length - 1]);
		if (!a || !o) return await lr(), i && (i.loadedPostsAfterLength = y.loadedPosts.length, i.olderPostsLength = y.loadedPosts.length, i.visibleOldestAfter = y.loadedPosts.length > 0 ? y.loadedPosts[y.loadedPosts.length - 1]?.createdAt ?? null : null), y.loadedPosts.length > 0;
		let s = t.useContiguousProgress !== !1 && J !== null, c = t.preserveContiguousProgressAfterDatabaseChange ? J : null, l = ++R, u = s ? await qn(a, l) : null;
		if (s && !u) return await Zn(), i && (i.loadedPostsAfterLength = y.loadedPosts.length, i.visibleOldestAfter = y.loadedPosts.length > 0 ? y.loadedPosts[y.loadedPosts.length - 1]?.createdAt ?? null : null), !1;
		let d = u?.visibleUntil ?? await $(a, l), p = u ? Math.max(0, u.totalVisibleCount - u.reachedVisibleCount) : f;
		if (u && p === 0) return y.hasOlderLocal = !1, i && (i.loadedPostsAfterLength = y.loadedPosts.length, i.visibleOldestAfter = y.loadedPosts.length > 0 ? y.loadedPosts[y.loadedPosts.length - 1]?.createdAt ?? null : null), await cr(a, y.loadedPosts, l, { skipOlderCheck: !0 }), !1;
		let m = Math.min(f, p), h = await Z.getOlderVisibleChunk({
			pubkeyHex: a,
			visibleUntil: d,
			cursor: o,
			limit: m
		});
		if (i && (i.olderPostsLength = h.length), !e() || l !== R) return !1;
		let g = u ? await qn(a, l) : null;
		if (u && !g) return await Zn(), !1;
		if (h.length === 0) return u ? await Zn() : y.hasOlderLocal = !1, i && (i.loadedPostsAfterLength = y.loadedPosts.length, i.visibleOldestAfter = y.loadedPosts.length > 0 ? y.loadedPosts[y.loadedPosts.length - 1]?.createdAt ?? null : null), !1;
		let _ = t.autoLoadViewportCommit ? t.autoLoadViewportCommit.captureAnchorEventId() : null;
		if (t.autoLoadViewportCommit && !_) return !1;
		let v = t.relayFetchViewportCommit?.captureAnchorEventId(), b = sr(r, h, _ ?? v ?? t.anchorEventId), x = t.reason === "normal-older-reveal" ? Id(r, b.posts) : [];
		if (t.autoLoadViewportCommit && (!_ || !b.posts.some((e) => e.eventId === _) || x.length === 0) || t.autoLoadViewportCommit && !t.autoLoadViewportCommit.canCommitWindowChange("older", r, b.posts)) return !1;
		y.loadedPosts = b.posts, x.length > 0 && Be.scheduleOlderRevealRepair(x), b.didDeferOlderPosts && (y.hasOlderLocal = !0), b.didTrimForOlderAppend && (y.hasNewerLocal = !0);
		let S = x.length;
		g ? J = {
			...g,
			reachedVisibleCount: Math.min(g.totalVisibleCount, g.reachedVisibleCount + S),
			oldestCursor: ar(b.posts[b.posts.length - 1]) ?? g.oldestCursor
		} : !s && c && wt(a) === c.revision && (Pt(o, c.oldestCursor) ? J = {
			...c,
			reachedVisibleCount: Math.min(c.totalVisibleCount, c.reachedVisibleCount + S),
			oldestCursor: ar(b.posts[b.posts.length - 1]) ?? c.oldestCursor
		} : Q());
		let C = s && g !== null && J !== null, w = !!J && J.reachedVisibleCount >= J.totalVisibleCount;
		return C && J && (y.hasOlderLocal = J.totalVisibleCount > J.reachedVisibleCount), i && (i.loadedPostsAfterLength = b.posts.length, i.visibleOldestAfter = b.posts.length > 0 ? b.posts[b.posts.length - 1]?.createdAt ?? null : null, i.didTrimForOlderAppend = b.didTrimForOlderAppend, i.didDeferOlderPosts = b.didDeferOlderPosts), t.autoLoadViewportCommit?.onCommitted(), t.relayFetchViewportCommit?.onCommitted(), C ? (cr(a, b.posts, l, { skipOlderCheck: !0 }).catch(() => void 0), !0) : (await cr(a, b.posts, l, { skipOlderCheck: s && w }), !0);
	}
	async function _r(t, n, r = {}) {
		Q();
		let i = y.loadedPosts, a = i.length > 0 ? i[i.length - 1]?.createdAt ?? null : null;
		if (typeof a != "number") return !1;
		let o = await Z.getVisibleChunkFromCreatedAt({
			pubkeyHex: t,
			visibleUntil: y.visibleUntil,
			createdAt: Math.max(0, a - 1),
			limit: f,
			query: { contiguous: !1 }
		});
		if (!e() || n !== R) return !1;
		if (o.length === 0) return y.hasOlderLocal = !1, !1;
		let s = sr(i, o, r.relayFetchViewportCommit?.captureAnchorEventId() ?? r.anchorEventId);
		return y.loadedPosts = s.posts, r.relayFetchViewportCommit && s.didTrimForOlderAppend && (y.hasNewerLocal = !0), r.relayFetchViewportCommit?.onCommitted(), await cr(t, s.posts, n), s.didDeferOlderPosts && (y.hasOlderLocal = !0), !0;
	}
	async function vr(t, n, r = {}) {
		Q();
		let i = y.loadedPosts;
		if (typeof y.visibleUntil != "number") return !1;
		let a = ar(i[i.length - 1]);
		if (!a) return !1;
		let o = await Z.getSparseChunk({
			pubkeyHex: t,
			visibleUntil: y.visibleUntil,
			cursor: a,
			direction: "older",
			limit: f
		});
		if (!e() || n !== R) return !1;
		if (o.length === 0) return y.hasOlderLocal = !1, !1;
		let s = sr(i, o, r.relayFetchViewportCommit?.captureAnchorEventId() ?? r.anchorEventId);
		return y.loadedPosts = s.posts, r.relayFetchViewportCommit && s.didTrimForOlderAppend && (y.hasNewerLocal = !0), r.relayFetchViewportCommit?.onCommitted(), await cr(t, s.posts, n), s.didDeferOlderPosts && (y.hasOlderLocal = !0), !0;
	}
	async function yr(t) {
		let r = n(), i = ar(y.loadedPosts[0]);
		if (!r || !i) return !1;
		let a = ++R, o = J, s = o ? await qn(r, a) : null;
		if (o && !s) return await Zn(), !1;
		let c = s?.visibleUntil ?? await $(r, a), l = await Z.getNewerVisibleChunk({
			pubkeyHex: r,
			visibleUntil: c,
			cursor: i,
			limit: f
		});
		if (!e() || a !== R) return !1;
		if (l.length === 0) return y.hasNewerLocal = !1, !1;
		if (s && !await qn(r, a)) return await Zn(), !1;
		let u = t?.captureAnchorEventId();
		if (t && !u) return !1;
		let d = y.loadedPosts, p = or([...l, ...d], "newer");
		if (t && !p.some((e) => e.eventId === u) || t && !t.canCommitWindowChange("newer", d, p)) return !1;
		y.loadedPosts = p;
		let m = Math.max(0, d.length + l.length - p.length);
		return s && (J = {
			...s,
			reachedVisibleCount: Math.max(0, s.reachedVisibleCount - m),
			oldestCursor: ar(p[p.length - 1]) ?? s.oldestCursor
		}), t && m > 0 && (y.hasOlderLocal = !0), t?.onCommitted(), await cr(r, p, a), !(!e() || a !== R);
	}
	async function br(t) {
		Q();
		let a = n();
		if (!a) return !1;
		let o = ++R, s = await $(a), c = await Z.getVisibleChunkFromCreatedAt({
			pubkeyHex: a,
			visibleUntil: s,
			createdAt: t,
			limit: f
		});
		if (!e() || o !== R) return !1;
		if (c.length === 0) return rr(), y.loadedPosts = [], y.hasOlderLocal = !1, y.hasNewerLocal = !1, !1;
		if (!Hd(c, t) || t <= 0) return rr(), y.listingMode = "contiguous", y.sparseSource = null, y.loadedPosts = c, Gt(), await cr(a, c, o), !0;
		let l = await jd.hasNearbyAnchorForPubkey({
			pubkeyHex: a,
			targetCreatedAt: t
		});
		if (!e() || o !== R) return !1;
		if (l) {
			let n = await Z.getVisibleChunkFromCreatedAt({
				pubkeyHex: a,
				visibleUntil: s,
				createdAt: t,
				limit: f,
				query: { contiguous: !1 }
			});
			if (!e() || o !== R) return !1;
			if (!Hd(n, t)) return rr(), y.listingMode = "sparse", y.sparseSource = "jump", y.loadedPosts = n, Gt(), await cr(a, n, o), !0;
		}
		let u = r();
		if (!u) return rr(), y.listingMode = "contiguous", y.sparseSource = null, y.loadedPosts = c, Gt(), await cr(a, c, o), !0;
		Dt();
		let d = ++Ne;
		y.syncStatus = "syncing";
		let p = Math.max(0, t - Bd), m = t, h = await yt(We, a), g = await In(a, u, d);
		if (!g.isActive()) return !1;
		let _ = pn.fetchLatest(u, {
			pubkeyHex: a,
			relayConfig: i(),
			reason: "repair-visible-range",
			limit: Vd,
			since: p,
			until: m
		});
		xe = _;
		let v = await _.promise;
		if (!Ft(d) || xe !== _) return !1;
		if (xe = null, !g.isActive() || v.status === "cancelled") return y.syncStatus = "idle", !1;
		if (v.events.length > 0 || v.relayFetchCoverage?.length) {
			if ((await Qn(v, g)).applied === !1 || !g.isActive()) return !1;
			await jd.addForPubkey({
				pubkeyHex: a,
				centerCreatedAt: t,
				radiusSec: Bd,
				fetchedAt: v.fetchedAt,
				localWriteScope: {
					ownerPubkeyHex: a,
					expectedRevision: h,
					isActive: () => g.isActive()
				}
			}), y.hasJumpCacheAnchors = !0;
		}
		if (!e() || o !== R) return y.syncStatus = "idle", !1;
		let b = await Z.getVisibleChunkFromCreatedAt({
			pubkeyHex: a,
			visibleUntil: s,
			createdAt: t,
			limit: f,
			query: { contiguous: !1 }
		});
		return !e() || o !== R ? (y.syncStatus = "idle", !1) : (y.syncStatus = "idle", !Hd(b, t) && (rr({ force: v.events.length > 0 }), y.listingMode = "sparse", y.sparseSource = "jump", y.loadedPosts = b, Gt(), await cr(a, b, o), Be.repairJump({
			ownerPubkeyHex: a,
			rxNostr: u,
			visiblePosts: b,
			isActive: () => e() && n() === a && r() === u && o === R
		}).catch(() => void 0), !0));
	}
	async function xr(t) {
		Q();
		let r = n();
		if (!r || !t) return !1;
		let i = ++R, a = await $(r, i), o = (e) => Z.getVisibleChunkAroundEventId({
			pubkeyHex: r,
			visibleUntil: e,
			eventId: t,
			limit: Y,
			keepAbove: f
		}), s = await o(a);
		if (!e() || i !== R) return !1;
		let c = s.some((e) => e.eventId === t), l = !1;
		return !c && typeof a == "number" && (s = await o(null), l = !0, !e() || i !== R) || !s.some((e) => e.eventId === t) ? !1 : (rr(), y.listingMode = l ? "sparse" : "contiguous", y.sparseSource = l ? "jump" : null, y.loadedPosts = s, y.hasOlderLocal = !1, y.hasNewerLocal = !1, Gt(), cr(r, s, i).catch(() => void 0), !0);
	}
	function Sr(e, t) {
		let n = [...e], r = new Set(e.map((e) => e.eventId));
		for (let e of t) r.has(e.eventId) || (r.add(e.eventId), n.push(e));
		return n;
	}
	function Cr(t, r, i) {
		return t === de && e() && n() === i && r === y.searchQuery;
	}
	async function wr(e, t, r, i = !1) {
		let a = n();
		if (!a || !t) return null;
		let o = { items: null }, s = await fd.searchLocalPosts({
			pubkeyHex: a,
			query: t,
			page: e,
			pageSize: f,
			onProgress: i ? async (e) => {
				Cr(r, t, a) && (o.items = e.items, y.searchPosts = e.items, y.searchTotalCountKnown = !1, y.searchHasNext = !1, e.phase === "partial" && !V && await zt(a, () => Cr(r, t, a), () => y.searchPosts.length > 0));
			} : void 0
		});
		if (!Cr(r, t, a)) return null;
		let c = o.items;
		return c !== null && c.length === s.items.length && s.items.every((e, t) => e === c[t]) ? {
			...s,
			items: y.searchPosts
		} : s;
	}
	async function Tr(e, t) {
		let r = n();
		if (!r || !t) return y.searchPosts = [], y.searchTotalCount = 0, y.searchTotalCountKnown = !1, y.searchHasNext = !1, !1;
		let i = ++de, a = Math.max(1, Math.trunc(e));
		k(H, !0), k(U, "loading"), y.searchTotalCountKnown = !1;
		try {
			let e = await wr(a, t, i, a === 1);
			if (!e) return !1;
			let n = on(a, e.total, f);
			return n === a ? (y.searchTotalCount = e.total, y.searchTotalCountKnown = !0, y.searchPosts = a === 1 ? e.items : Sr(y.searchPosts, e.items), y.searchPage = n, y.searchHasNext = e.hasNext, k(U, "ready"), !(!V && !await zt(r, () => Cr(i, t, r), () => y.searchPosts.length > 0))) : (i === de && Cr(i, t, r) && k(U, "ready"), !1);
		} catch {
			return i === de && k(U, "failed"), !1;
		} finally {
			i === de && k(H, !1);
		}
	}
	async function Er(e, t, r = ++de) {
		let i = n();
		if (!i || !t) return !1;
		let a = Math.max(1, Math.trunc(e));
		k(H, !0), k(U, "loading"), y.searchTotalCountKnown = !1;
		try {
			let e = await wr(1, t, r, a === 1);
			if (!e) return !1;
			let n = on(a, e.total, f), o = e.items, s = e;
			for (let e = 2; e <= n; e += 1) {
				let n = await wr(e, t, r);
				if (!n) return !1;
				o = Sr(o, n.items), s = n;
			}
			return y.searchPosts = o, y.searchTotalCount = e.total, y.searchTotalCountKnown = !0, y.searchPage = n, y.searchHasNext = s.hasNext, k(U, "ready"), !(!V && !await zt(i, () => Cr(r, t, i), () => y.searchPosts.length > 0));
		} catch {
			return r === de && k(U, "failed"), !1;
		} finally {
			r === de && k(H, !1);
		}
	}
	async function Dr() {
		Q();
		let t = n(), a = r();
		if (!t || !a) return;
		Dt();
		let o = ++Ne, c = Nt("bootstrap"), l = Ot("syncing", c ? 2 : 1, !0);
		c && c.promise.then((e) => kt(l, !!e, e?.changed ?? !1));
		let u = ++ke;
		k(Oe, !0);
		let d = !1, p = !1;
		try {
			let r = await $(t);
			if (!Ft(o) || !e() || n() !== t) return;
			let c = await In(t, a, o);
			if (!c.isActive()) return;
			let l = pn.fetchLatest(a, {
				pubkeyHex: t,
				relayConfig: i(),
				reason: "bootstrap",
				limit: 150,
				timeoutMs: Ht
			});
			xe = l;
			let u = await l.promise, m = {
				insertedCount: 0,
				updatedCount: 0,
				unchangedCount: 0,
				appliedDeletionCount: 0
			};
			if (!Ft(o) || xe !== l || (xe = null, !c.isActive() || u.status === "cancelled")) return;
			if (u.events.length > 0 || u.relayFetchCoverage?.length) {
				let e = await Qn(u, c);
				if (e.applied === !1 || !c.isActive()) return;
				m = e;
				let t = Pd(u.events);
				t.length > 0 && await s(t);
			}
			if (!Ft(o) || !e()) return;
			let h = await Rn(t, u);
			if (!Ft(o) || !e()) return;
			let g = h !== r;
			mn(u), await At(async () => {
				c.isActive() && (y.searchQuery ? await Er(y.searchPage, y.searchQuery) : y.loadedPosts.length === 0 || !y.hasNewerLocal && (!B(T).length || y.loadedPosts.length <= f) ? await lr({ forceTotalCount: m.insertedCount + m.updatedCount > 0 }) : (rr({ force: m.insertedCount + m.updatedCount > 0 }), await cr(t)));
			}), d = u.status === "success" && c.isActive(), p = m.insertedCount + m.updatedCount > 0 || g;
		} finally {
			u === ke && k(Oe, !1), kt(l, d, p);
		}
	}
	function Or(e, t) {
		return t === null ? e.at(-1) : e.find((e) => e.since <= t && e.until >= t) ?? e.filter((e) => e.until < t).at(-1) ?? e.at(-1);
	}
	function kr() {
		if (ee === null || M === void 0 && xe === null) return !1;
		let e = Or(B(A), B(x));
		return e !== void 0 && B(w).some((t) => t.since <= e.until && t.until >= e.until) && (M === void 0 || e.until + 1 > M);
	}
	async function Ar() {
		let t = n(), a = r();
		if (!t || !a) return;
		Dt();
		let o = ++Ne;
		ee = o;
		let c = Nt("dialog-open-refresh"), l = Ot("syncing", c ? 2 : 1, !0);
		c && c.promise.then((e) => kt(l, !!e, e?.changed ?? !1));
		let u = ++ke;
		k(Oe, !0);
		let d = !1, p = !1;
		try {
			y.lastDialogOpenRefreshAt = Date.now();
			let c = Math.floor(y.lastDialogOpenRefreshAt / 1e3), l = I, u = i(), m = () => !L && l === I && Ft(o) && e() && n() === t && r() === a, h = await vt.getLocalRevision(t), g = await $(t), _ = await An(t), v = [...B(w)], b = B(x), S = Or(_, b), E = S && B(w).some((e) => e.since <= S.until && e.until >= S.until), D = S ? Math.min(S.until, c) + +!!E : void 0;
			if (M = D, !m()) return;
			if (D !== void 0 && D > c) {
				d = !0, ee = null;
				return;
			}
			let O = c, k = c + 1, A = !1, j, N = {
				insertedCount: 0,
				updatedCount: 0
			};
			for (;;) {
				let e = Wn.runAuthored(a, {
					ownerPubkeyHex: t,
					relayConfig: u,
					getRelayConfig: i,
					isActive: m,
					expectedLocalRevision: h,
					reason: A ? "dialog-open-catchup" : "dialog-open-refresh",
					...D === void 0 ? {} : { since: D },
					until: O,
					limit: A ? 150 : 30,
					timeoutMs: dn,
					onSavedSelfPosts: s
				});
				xe = e;
				let n = await e.promise;
				if (!m() || xe !== e) return;
				if (xe = null, j = n.fetchResult, j.status === "cancelled") {
					ee = null;
					return;
				}
				if (N.insertedCount += n.upsertSummary.insertedCount, N.updatedCount += n.upsertSummary.updatedCount, D === void 0) break;
				let r = await An(t);
				if (!m()) return;
				let o = r.find((e) => e.since <= c && e.until >= c)?.since ?? c + 1;
				if (o <= D || A && o >= k) break;
				k = o, O = Math.min(c, k - 1), A = !0;
			}
			let te = await Rn(t, j);
			if (!Ft(o) || !e()) return;
			let ne = b === null ? te : _t(Wu(B(C), v), b), P = ed({
				insertedCount: N.insertedCount,
				updatedCount: N.updatedCount,
				previousVisibleUntil: g,
				nextVisibleUntil: ne,
				searchQuery: y.searchQuery,
				loadedPostsLength: y.loadedPosts.length,
				hasNewerLocal: y.hasNewerLocal
			});
			if (hn(j), await At(async () => {
				if (m()) {
					if (B(T).length && (y.loadedPosts.length > f || y.hasNewerLocal)) Q(), rr({ force: P.didMateriallyChange }), await cr(t);
					else if (P.applyAction === "reload-search-page") await Er(y.searchPage, y.searchQuery);
					else if (P.applyAction === "load-latest-visible-posts") {
						let e = P.didMateriallyChange && !P.didVisibleMateriallyChange;
						await lr({
							forceTotalCount: P.didMateriallyChange,
							skipOlderAvailabilityCheck: e,
							awaitProgress: e,
							awaitAvailability: !0
						});
					} else P.applyAction === "refresh-count-and-availability" && (P.didMateriallyChange ? await lr({
						forceTotalCount: P.didMateriallyChange,
						skipOlderAvailabilityCheck: !P.didVisibleMateriallyChange,
						awaitProgress: !P.didVisibleMateriallyChange,
						awaitAvailability: !0
					}) : (Q(), rr({ force: P.didMateriallyChange }), await cr(t)));
				}
			}), !m()) return;
			d = j.status === "success", p = P.didMateriallyChange, ee = null;
		} finally {
			u === ke && k(Oe, !1), kt(l, d, p);
		}
	}
	function jr() {
		return typeof y.lastDialogOpenRefreshAt != "number" || Date.now() - y.lastDialogOpenRefreshAt >= Sn;
	}
	function Mr(t, i) {
		if (fe || !e() || n() !== t || !r()) return;
		if (fe = !0, i.length === 0) {
			Dr();
			return;
		}
		let a = B(A).at(-1)?.until, o = B(x), s = a !== void 0 && i.some((e) => e.createdAt > a) || o !== null && !B(A).some((e) => e.since <= o && e.until >= o);
		if (pe || s || jr()) pe = !1, Ar();
		else {
			let e = Nt("dialog-open-refresh");
			if (e) {
				let t = Ot("syncing", 1, !0);
				e.promise.then((e) => kt(t, !!e, e?.changed ?? !1));
			}
		}
	}
	function Nr() {
		return !B(X) || !B(Je) ? !1 : (--y.searchPage, !0);
	}
	function Pr() {
		return !B(X) || !B(Ye) ? !1 : (y.searchPage = 1, !0);
	}
	async function Fr() {
		return !B(X) || !B(Xe) ? !1 : Tr(y.searchPage + 1, y.searchQuery);
	}
	async function Ir() {
		return !B(X) || !B(Qe) ? !1 : (y.searchPage = B(qe), !0);
	}
	async function Lr(t) {
		if (!B(X) && B(T).length) {
			let r = !1, i = n();
			return await At(async () => {
				!L && e() && n() === i && (r = await Rr(t));
			}), r;
		}
		return Rr(t);
	}
	async function Rr(e) {
		if (B(X)) return Fr();
		if (y.sparseSource === "saved") {
			let e = n();
			return e ? vr(e, ++R, { reason: "normal-older-reveal" }) : !1;
		}
		if (y.sparseSource === "jump") {
			let e = n();
			return e ? _r(e, ++R, { reason: "normal-older-reveal" }) : !1;
		}
		return gr({
			reason: "normal-older-reveal",
			autoLoadViewportCommit: e
		});
	}
	async function zr(e) {
		return B(X) ? Promise.resolve(Nr()) : y.sparseSource === "saved" ? qr() : yr(e);
	}
	async function Br() {
		return B(X) ? Promise.resolve(Pr()) : (await lr(), !0);
	}
	async function Vr() {
		let t = n();
		if (!t) return !1;
		let r = await Fn(t);
		if (typeof r != "number") return !1;
		let i = ++R, a = await Z.getSparseChunk({
			pubkeyHex: t,
			visibleUntil: r,
			direction: "latest",
			limit: f
		});
		return !e() || n() !== t || i !== R ? !1 : a.length === 0 ? (y.hasSavedPostsOutsideVisibleRange = !1, !1) : (y.listingMode = "sparse", y.sparseSource = "saved", y.loadedPosts = a, rr(), await cr(t, a, i), await ir(t, r, i), !0);
	}
	async function Hr() {
		if (B(X) || !B(at)) return !1;
		if (y.listingMode === "sparse") {
			Q();
			let t = n();
			if (!t) return !1;
			let r = ++R, i = await Z.getOldestVisibleChunk({
				pubkeyHex: t,
				visibleUntil: y.visibleUntil,
				limit: f,
				query: { contiguous: !1 }
			});
			return !e() || r !== R || i.length === 0 ? !1 : (rr(), y.loadedPosts = i, Gt(), y.hasOlderLocal = !1, await cr(t, i, r, { skipOlderCheck: !0 }), !0);
		}
		Q();
		let t = n();
		if (!t) return !1;
		let r = ++R, i = await $(t, r), a = await Z.getOldestVisibleChunk({
			pubkeyHex: t,
			visibleUntil: i,
			limit: f
		});
		return !e() || r !== R ? !1 : a.length === 0 ? (rr(), y.loadedPosts = [], y.hasOlderLocal = !1, y.hasNewerLocal = !1, !1) : (rr(), y.listingMode = "contiguous", y.sparseSource = null, y.loadedPosts = a, Gt(), y.hasOlderLocal = !1, await cr(t, a, r, { skipOlderCheck: !0 }), !0);
	}
	async function Ur(t = {}) {
		let a = n(), o = r();
		if (!e() || !a || !B(ot)) return !1;
		let s = !!o && !B(Oe) && !ze.exhausted, c = !B(Te) && B(G) && sn.isConfigured(a);
		if (!s && !c) return !1;
		let l = Ot("older-syncing", Number(s) + Number(c)), u = s ? ++Ne : Ne, d = I, f = ln(i()), p = () => !L && d === I && Ft(u) && e() && n() === a && r() === o && ln(i()) === f, m = c ? Nt("older-backfill", { until: B(we) ?? Math.floor(Date.now() / 1e3) }, t) : null;
		if (c && (m?.promise ?? Promise.resolve(null)).then((e) => kt(l, !!e, e?.changed ?? !1)), s && o) {
			let e = ++ke;
			k(Oe, !0);
			let n = !0;
			Wr(a, o, u, p, t, (e) => {
				n = e;
			}).then((e) => kt(l, n && p(), e)).catch(() => kt(l, !1, !1)).finally(() => {
				e === ke && k(Oe, !1);
			});
		}
		return l.promise;
	}
	async function Wr(e, t, n, r, a, o) {
		let s;
		for (; y.listingMode === "contiguous";) {
			let t = await Mn(e);
			if (!r()) return !1;
			let n = ar(y.loadedPosts.at(-1)), i = n ? await Z.hasOlderVisiblePosts({
				pubkeyHex: e,
				visibleUntil: t,
				cursor: n
			}) : !1;
			if (!r()) return !1;
			let o = await Mn(e);
			if (!r()) return !1;
			if (y.listingMode !== "contiguous") break;
			if (!(o !== t || n && !Pt(n, ar(y.loadedPosts.at(-1))))) {
				if (s = t, i) {
					Q();
					let e = !1;
					return await At(async () => {
						r() && (e = await gr({
							anchorEventId: a.anchorEventId,
							relayFetchViewportCommit: a.viewportCommit,
							useContiguousProgress: !1
						}));
					}), e;
				}
				break;
			}
		}
		let c = Kd, l = qd, u = Math.max(1, Math.min(f, 30)), d = null, p = 0, m = 0, h = 0, g = null, _ = null, v = !1, b = 0, x = null;
		for (;;) {
			p += 1;
			let f = await Mn(e), S = g ?? await gn(e, f), C = typeof g == "number", w = p === 1 && s !== void 0 && s === f ? s : f;
			if (!r()) return v;
			let E = typeof w == "number" && !(B(T).length ? $n(y.visibleUntil) : $n(w)) ? w : typeof S == "number" ? C ? S : typeof w == "number" ? Math.min(S, w) : S : w;
			if (typeof E != "number") return v;
			let D = await An(e);
			if (!r()) return v;
			let O = Gd[Math.min(h, Gd.length - 1)], k = Gu(D, Math.trunc(E), O, _);
			if (!k) return Cn(null, null), v;
			let A = {
				...k,
				windowSeconds: O
			}, j = await Hn(e, w);
			if (!r()) return v;
			d === null && (d = j);
			let ee = !1, M = {
				insertedCount: 0,
				updatedCount: 0,
				unchangedCount: 0,
				appliedDeletionCount: 0
			}, N = await In(e, t, n);
			if (!r() || !N.isActive()) return v;
			let te = pn.fetchLatest(t, {
				pubkeyHex: e,
				relayConfig: i(),
				reason: "older-backfill",
				limit: 150,
				timeoutMs: _n,
				since: A.since,
				until: A.until
			});
			xe = te;
			let ne = await te.promise;
			if (!r() || xe !== te || (xe = null, !N.isActive() || ne.status === "cancelled")) return v;
			if (ne.events.length > 0 || ne.relayFetchCoverage?.length) {
				let e = await Qn(ne, N);
				if (e.applied === !1 || !N.isActive()) return v;
				M = e, ee = M.insertedCount + M.updatedCount > 0;
			}
			if (!r()) return v;
			let P = typeof B(it) == "number" && (y.visibleUntil === null ? y.hasJumpCacheAnchors : B(it) < y.visibleUntil), F = P ? w : await zn(e, ne);
			if (!r()) return v;
			let I = F, L = await Hn(e, I);
			if (!r()) return v;
			let re = !1;
			if (P || (re = await Xn(e, I, { preserveReachedVisibleCount: !0 })), await ir(e, I, null, n), !r()) return v;
			let z = L > j, ie = bn(ne, 150).length > 0, V = xn(ne), ae = typeof V == "number" && V > A.since ? V - A.since : 0, oe = ne.status === "success" && ie && typeof V == "number" && V > A.since && ae >= Wd, se = A.since > 0 ? A.since : null, ce = null;
			oe && typeof V == "number" && (se = V, ce = A.since), ze.windowSeconds = O, ze.lastRange = {
				...A,
				hitLimit: ie
			}, ne.status === "success" && ne.events.length === 0 ? ze.consecutiveEmptyCount += 1 : ne.events.length > 0 && (ze.consecutiveEmptyCount = 0);
			let le = await Mn(e);
			if (!r()) return v;
			typeof le == "number" && !P && (se = le), Cn(se, ce), wn(A, ne, 150);
			let ue = !1, de = {
				loadedPostsBeforeLength: y.loadedPosts.length,
				loadedPostsAfterLength: y.loadedPosts.length,
				olderPostsLength: 0,
				visibleOldestBefore: y.loadedPosts.length > 0 ? y.loadedPosts[y.loadedPosts.length - 1]?.createdAt ?? null : null,
				visibleOldestAfter: y.loadedPosts.length > 0 ? y.loadedPosts[y.loadedPosts.length - 1]?.createdAt ?? null : null,
				didTrimForOlderAppend: !1,
				didDeferOlderPosts: !1,
				maxVisiblePosts: Y
			};
			if (await At(async () => {
				r() && (y.searchQuery ? await Er(y.searchPage, y.searchQuery) : (rr({ force: ee }), z || ee ? ue = y.sparseSource === "saved" ? await vr(e, R, {
					anchorEventId: a.anchorEventId,
					relayFetchViewportCommit: a.viewportCommit
				}) : P ? await _r(e, R, {
					anchorEventId: a.anchorEventId,
					relayFetchViewportCommit: a.viewportCommit
				}) : await gr({
					anchorEventId: a.anchorEventId,
					relayFetchViewportCommit: a.viewportCommit,
					metrics: de,
					reason: "normal-older-reveal",
					useContiguousProgress: !1,
					preserveContiguousProgressAfterDatabaseChange: re
				}) : await cr(e)));
			}), !r()) return v;
			let H = ue || z || ee, U = v || H, fe = typeof se == "number" && se < E, pe = L, me = Math.max(0, pe - (d ?? pe)), he = typeof se == "number" ? Math.max(0, E - se) : Math.max(0, E), ge = m + he, W = Jd({
				status: ne.status,
				changed: H,
				didCursorAdvanceOlder: fe,
				hitLimit: ie,
				continuedWithinWindow: oe,
				attemptIndex: p,
				maxAttempts: c,
				totalVisibleAdded: me,
				targetVisibleAdded: u,
				exploredSeconds: ge,
				maxExploreSeconds: l
			}), _e = typeof le == "number" && typeof w == "number" && D.some((e) => e.until < w && le <= e.since), ve = typeof le == "number" && typeof w == "number" && le < w, ye = W.shouldContinue && ve && !y.hasOlderLocal && !_e, be = ye ? b + 1 : b;
			if (m = ge, ye) y.latestOlderBackfillUiResult = {
				changed: U,
				didTrimForOlderAppend: de.didTrimForOlderAppend,
				didDeferOlderPosts: de.didDeferOlderPosts,
				loadedPostsBeforeLength: de.loadedPostsBeforeLength,
				loadedPostsAfterLength: de.loadedPostsAfterLength,
				maxVisiblePosts: de.maxVisiblePosts,
				autoRetryCount: be,
				autoRetryReason: W.reason,
				attemptIndex: p,
				maxAttempts: c,
				clickStartVisibleCount: d ?? pe,
				currentVisibleCount: pe,
				totalVisibleAdded: me,
				targetVisibleAdded: u,
				shouldContinueForSmallBatch: ye,
				exploredSeconds: m,
				maxExploreSeconds: l
			}, b = be, x = W.reason, v = U, g = se, _ = ce, oe || (h = Math.min(h + 1, Gd.length - 1));
			else return x = W.reason, v = U, y.latestOlderBackfillUiResult = {
				changed: v,
				didTrimForOlderAppend: de.didTrimForOlderAppend,
				didDeferOlderPosts: de.didDeferOlderPosts,
				loadedPostsBeforeLength: de.loadedPostsBeforeLength,
				loadedPostsAfterLength: de.loadedPostsAfterLength,
				maxVisiblePosts: de.maxVisiblePosts,
				autoRetryCount: b,
				autoRetryReason: x,
				attemptIndex: p,
				maxAttempts: c,
				clickStartVisibleCount: d ?? pe,
				currentVisibleCount: pe,
				totalVisibleAdded: me,
				targetVisibleAdded: u,
				shouldContinueForSmallBatch: ye,
				exploredSeconds: m,
				maxExploreSeconds: l
			}, ne.status === "success" ? (o(!0), v) : (o(!1), v);
		}
	}
	async function Gr() {
		Q();
		let t = n(), a = r();
		if (!t || !a || !B(mt)) return;
		let o = En();
		if (o.length === 0) return;
		Kt(), y.currentViewRefetchStatus = "refetching";
		let s = null, c, l = Date.now();
		try {
			c = await $(t), Nd({
				phase: "visible-range-state",
				startedAt: l
			});
		} catch (e) {
			Nd({
				phase: "visible-range-state",
				startedAt: l,
				error: e
			}), y.currentViewRefetchStatus = "idle", y.currentViewRefetchMessageKey = "postHistory.repairFetchFailed", y.currentViewRefetchMessageValues = null, qt();
			return;
		}
		let u, d = Date.now();
		try {
			u = xd.refetchAroundCurrentView(a, {
				pubkeyHex: t,
				relayConfig: i(),
				preferredRanges: o,
				getRelayConfig: i,
				isActive: () => e() && n() === t && r() === a,
				onProgress: async () => void 0
			});
		} catch (e) {
			Nd({
				phase: "primary-fetch",
				startedAt: d,
				error: e
			}), y.currentViewRefetchStatus = "idle", y.currentViewRefetchMessageKey = "postHistory.repairFetchFailed", y.currentViewRefetchMessageValues = null, qt();
			return;
		}
		q = u, Nt("repair-visible-range", {
			since: Math.min(...o.map((e) => e.since)),
			until: Math.max(...o.map((e) => e.until))
		});
		let f = !1, p = d;
		try {
			let i = await u.promise;
			if (q !== u) return;
			if (Nd({
				phase: "primary-fetch",
				startedAt: d,
				durationMs: i.timing?.primaryFetchDurationMs ?? 0,
				counts: {
					processedRangeCount: i.processedRangeCount,
					rawCount: i.processedRanges.reduce((e, t) => e + (t.rawCount ?? 0), 0),
					uniqueCount: i.processedRanges.reduce((e, t) => e + (t.uniqueCount ?? 0), 0),
					requestedRelayCount: i.processedRanges.reduce((e, t) => e + (t.requestedRelayUrls?.length ?? 0), 0),
					eoseRelayCount: i.processedRanges.reduce((e, t) => e + (t.eoseRelayUrls?.length ?? 0), 0)
				}
			}), (i.timing?.primaryPersistAttemptCount ?? 0) > 0 && Nd({
				phase: "primary-persist",
				startedAt: d,
				durationMs: i.timing?.primaryPersistDurationMs ?? 0,
				counts: { persistedRangeCount: i.timing?.primaryPersistAttemptCount ?? 0 }
			}), !e() || i.status === "cancelled") {
				q = null, y.currentViewRefetchStatus = "idle";
				return;
			}
			let o = Date.now();
			p = o;
			try {
				await Bn(t, c, i.processedRanges), Nd({
					phase: "visible-range-state",
					startedAt: o,
					counts: { processedRangeCount: i.processedRangeCount }
				});
			} catch (e) {
				throw s = "visible-range-state", Nd({
					phase: "visible-range-state",
					startedAt: o,
					error: e,
					counts: { processedRangeCount: i.processedRangeCount }
				}), e;
			}
			let l = Date.now();
			p = l;
			try {
				y.searchQuery ? await Er(y.searchPage, y.searchQuery) : y.loadedPosts.length === 0 || !y.hasNewerLocal ? await lr({ skipTotalCountRefresh: !0 }) : await ur({ skipTotalCountRefresh: !0 }), Nd({
					phase: "visible-window-reload",
					startedAt: l,
					counts: { processedRangeCount: i.processedRangeCount }
				});
			} catch (e) {
				throw s = "visible-window-reload", Nd({
					phase: "visible-window-reload",
					startedAt: l,
					error: e,
					counts: { processedRangeCount: i.processedRangeCount }
				}), e;
			}
			f = !0;
			let m = null;
			if (q === u && e() && n() === t && r() === a && y.loadedPosts.length > 0) {
				let i = Date.now();
				if (p = i, m = await Be.repairCurrentView({
					ownerPubkeyHex: t,
					rxNostr: a,
					visiblePosts: y.loadedPosts,
					isActive: () => q === u && e() && n() === t && r() === a
				}), q !== u || m.status === "cancelled" || !e()) return;
				Nd({
					phase: "relation-repair",
					startedAt: i,
					durationMs: m.relationRepairDurationMs ?? (m.failurePhase === "relation-repair" ? m.failureDurationMs : void 0),
					errorClass: m.failurePhase === "relation-repair" ? m.failureErrorClass : void 0,
					counts: { savedDirectReplyCount: m.savedDirectReplyCount }
				}), (typeof m.badgeRefreshDurationMs == "number" || m.failurePhase === "badge-refresh") && Nd({
					phase: "badge-refresh",
					startedAt: i,
					durationMs: m.badgeRefreshDurationMs ?? m.failureDurationMs,
					errorClass: m.failurePhase === "badge-refresh" ? m.failureErrorClass : void 0
				});
			}
			if (q !== u || !e() || n() !== t || r() !== a) return;
			y.searchQuery || rr({ force: !0 }), q = null, y.currentViewRefetchStatus = "idle", i.addedCount > 0 ? (y.currentViewRefetchMessageKey = "postHistory.repairAdded", y.currentViewRefetchMessageValues = {
				count: i.addedCount,
				processedRangeCount: i.processedRangeCount,
				updatedCount: i.updatedCount
			}) : (m?.savedDirectReplyCount ?? 0) > 0 ? (y.currentViewRefetchMessageKey = "postHistory.repairChildInteractionsAdded", y.currentViewRefetchMessageValues = { count: m?.savedDirectReplyCount ?? 0 }) : i.fetchFailed ? (y.currentViewRefetchMessageKey = "postHistory.repairFetchFailed", y.currentViewRefetchMessageValues = null) : (y.currentViewRefetchMessageKey = "postHistory.repairNoChanges", y.currentViewRefetchMessageValues = {
				processedRangeCount: i.processedRangeCount,
				updatedCount: i.updatedCount
			}), qt();
		} catch (i) {
			if (q !== u) return;
			let o = typeof i == "object" && i ? i.phase : void 0, c = typeof i == "object" && i && typeof i.phaseStartedAt == "number" ? i.phaseStartedAt : p, l = typeof i == "object" && i && typeof i.errorClass == "string" ? i.errorClass : void 0;
			s || Nd({
				phase: s ?? (o === "primary-fetch" || o === "primary-persist" ? o : f ? "relation-repair" : "primary-fetch"),
				startedAt: c,
				error: i,
				errorClass: l
			}), f && !y.searchQuery && e() && n() === t && r() === a && rr({ force: !0 }), q = null, y.currentViewRefetchStatus = "idle", y.currentViewRefetchMessageKey = f ? "postHistory.repairNoChanges" : "postHistory.repairFetchFailed", y.currentViewRefetchMessageValues = null, qt();
		}
	}
	async function Kr() {
		let t = n();
		if (!t) return !1;
		Dt(), Bt(), an();
		let r = I, i = () => !L && e() && n() === t && r === I;
		return Wn.cancelOwnerTasks(t), (await Promise.allSettled([Z.deleteLocalHistoryForPubkey(t)])).some((e) => e.status === "rejected") ? (i() && (e() && n() === t && (tr(), er({
			known: y.totalCountKnown,
			status: "failed"
		})), Kt(), y.currentViewRefetchMessageKey = "postHistory.deleteLocalHistoryFailed", y.currentViewRefetchMessageValues = null), !1) : ($u(t), tf(t), i() && (an(), tn(), y.currentViewRefetchMessageKey = "postHistory.deleteLocalHistorySuccess", y.currentViewRefetchMessageValues = null, Qu(t, {
			currentPage: 1,
			searchPage: 1,
			searchInput: "",
			searchQuery: ""
		}), ef(t, {
			...Ld,
			totalCount: 0,
			totalCountKnown: !0,
			totalCountFailed: !1
		})), !0);
	}
	async function qr() {
		Q();
		let t = n(), r = ar(y.loadedPosts[0]);
		if (!t || !r || typeof y.visibleUntil != "number") return !1;
		let i = ++R, a = await Z.getSparseChunk({
			pubkeyHex: t,
			visibleUntil: y.visibleUntil,
			cursor: r,
			direction: "newer",
			limit: f
		});
		if (!e() || i !== R) return !1;
		if (a.length === 0) return y.hasNewerLocal = !1, !1;
		let o = or([...a, ...y.loadedPosts], "newer");
		return y.loadedPosts = o, await cr(t, o, i), !0;
	}
	async function Jr(t) {
		let r = n(), i = I, a = R, o = () => !L && e() && n() === r && i === I && a === R;
		if (!r || r !== t.ownerPubkeyHex || !o() || await vt.getLocalRevision(r) !== t.localRevision || !o()) return;
		if (an(), Q(), a = R, y.searchQuery) {
			await Er(y.searchPage, y.searchQuery);
			return;
		}
		let s = y.loadedPosts, c = await Promise.all(s.map((e) => Z.getByEventId(e.eventId)));
		if (!o() || y.loadedPosts !== s) return;
		if (y.loadedPosts = c.flatMap((e) => e?.pubkeyHex === r ? [e] : []), !s.length) {
			await lr({ forceTotalCount: !0 });
			return;
		}
		let l = await $(r);
		o() && (rr({ force: !0 }), await cr(r, y.loadedPosts, a), o() && await ir(r, l, a));
	}
	async function Yr(t) {
		let r = n();
		if (!r || !e()) return;
		let i = I;
		if (t?.localRevision !== void 0 && await vt.getLocalRevision(r) !== t.localRevision || L || i !== I || n() !== r || !e() || (t?.restoredRangeChanged && await jn(r), L || i !== I || n() !== r || !e())) return;
		let a = t?.restoredRangeChanged === !0 && kr();
		if (a && (Dt(), y.syncStatus = "idle"), an(), t?.restoredRangeChanged && t.insertedPostCount + t.updatedPostCount + t.appliedDeletionPostCount === 0 ? (await $(r), await cr(r)) : await Xr(), t?.localRevision !== void 0 && await vt.getLocalRevision(r) !== t.localRevision) return;
		let o = y.loadedPosts[0]?.createdAt, s = o === void 0 ? void 0 : B(A).find((e) => e.since <= o && e.until >= o), c = !B(X) && y.listingMode === "contiguous" && o !== void 0 && B(x) !== null && (!s || s.since > B(x));
		t?.restoredRangeChanged && (a || c && ee === null) && !L && i === I && n() === r && e() && Ar();
	}
	async function Xr() {
		if (Q(), n()) {
			if (y.searchQuery) await Er(y.searchPage, y.searchQuery);
			else if (y.sparseSource === "saved") {
				let e = n();
				if (!e) return;
				let t = await $(e);
				rr({ force: !0 }), await cr(e), await ir(e, t);
			} else await lr({ forceTotalCount: !0 });
		}
	}
	function Zr(e, t, n) {
		let r = (r) => r.map((r) => r.eventId === e ? {
			...r,
			deletedAt: t,
			deletionEventId: n
		} : r);
		y.loadedPosts = r(y.loadedPosts), y.searchPosts = r(y.searchPosts);
	}
	function Qr(t) {
		let r = n(), i = Zd(r);
		if (!r || !i) return;
		let a = ++W;
		k(ge, "loading"), t().then(() => {
			e() && n() === r && he === i && a === W && k(ge, "ready");
		}).catch(() => {
			e() && n() === r && he === i && a === W && k(ge, "failed");
		});
	}
	return z(() => {
		let t = ln(i()), a = n(), o = r(), s = On();
		if ((t !== N || a !== ne || o !== P) && (N = t, ne = a, P = o, I += 1, re(() => {
			Dt(), Bt(), an(), y.syncStatus === "syncing" && (y.syncStatus = "idle");
		})), !e() || !a) return;
		let c = I, l = vn(i()), u = Ge(async () => await Dn(a)).subscribe({
			next: async ([t, r, i, o, u]) => {
				try {
					let e = await vt.getLocalRevision(a);
					if (e !== i || e !== r.localRevision) return;
				} catch {
					return;
				}
				if (L || c !== I || !e() || n() !== a || u !== s || u !== On() || (k(C, xt(t.relays, l), !0), k(w, r.ranges, !0), D !== null && D !== i && Mt(), D = i, kn(o), kr() && Ar(), B(x) === null)) return;
				let d = _t(B(j), B(x));
				d !== y.visibleUntil && (y.visibleUntil = d, Q(), V && cr(a, y.loadedPosts, null, { deferDuringOlderRelayFetch: !0 }));
			},
			error: () => {}
		});
		return () => u.unsubscribe();
	}), z(() => {
		let e = Zd(n());
		e !== ve && (ve = e, Lt(), Mt(), k(ye, null), be = e, Dt(), Bt(), an(), Xt(), Kt(), Ut(), Gt(), Be.resetOlderRevealRepairContext(), fe = !1, pe = !1, me = !1, he = null, W += 1, k(ge, "idle"));
	}), z(() => {
		let e = r();
		e !== Ie && (Ie = e, Be.resetOlderRevealRepairContext());
	}), z(() => {
		Qt();
	}), z(() => {
		$t();
	}), z(() => {
		t() || re(fn);
	}), z(() => {
		let i = Rt.localRelayUrl, a = r();
		if (!e()) return;
		re(() => {
			let e = sn.getSessionGeneration();
			(i !== K || a !== Ee || e !== De) && Mt(), K = i, Ee = a, De = e, k(O, e, !0);
		});
		let o = sn.onSessionInvalidated(() => {
			let t = E !== null || Se !== null;
			Mt(), k(O, sn.getSessionGeneration(), !0), De = B(O);
			let o = n(), s = I, c = () => !L && e() && I === s && n() === o && r() === a && Rt.localRelayUrl === i;
			t && c() && o && $(o).then(() => {
				if (c()) return cr(o);
			}).catch(() => void 0);
		});
		return () => {
			o(), re(() => {
				Ce++, Se?.cancel(), Se = null, k(Te, !1), t() || Mt();
			});
		};
	}), z(() => {
		if (e()) return () => {
			Dt();
		};
	}), z(() => () => {
		Be.dispose();
	}), z(() => {
		if (!e()) Ut();
		else return Jt(), () => {
			Ut();
		};
	}), z(() => {
		if (!e()) return;
		let t = y.searchInput.trim();
		t !== y.searchQuery && k(U, "loading");
		let n = setTimeout(() => {
			y.searchQuery = t;
		}, p);
		return () => {
			clearTimeout(n);
		};
	}), z(() => {
		if (!e() || B(X)) return;
		let t = Zd(n()) ?? "";
		if (me && he === t) return;
		if (me = !0, he = t, be === t) {
			be = null, Qr(lr);
			return;
		}
		let r = pr(), i = Et(n());
		dr(i, r) ? (pe = !0, o(), Qr(lr)) : mr(r) ? Qr(() => fr(r, i)) : Qr(r ? () => hr(r) : lr);
	}), z(() => {
		e() || Lt();
	}), z(() => {
		if (!e() || !B(ae) || B(oe) !== Zd(n())) return;
		let t = B(He);
		if (t.length === 0 || !Vn.canUsePersistentCache()) return;
		let r = Wt(t);
		if (r.length === 0) return;
		let i = [...r].sort().join("\0");
		i !== se && (se = i, Promise.resolve(Vn.prefetchCachedMediaDescriptors(r)).catch(() => {}));
	}), ie(() => {
		L = !0, Mt(), I += 1, Dt(), Bt(), R += 1, de += 1, W += 1, fd.clearCache?.(), k(ge, "idle"), k(oe, null), k(ae, !1);
	}), z(() => {
		if (e()) {
			if (!y.searchQuery) {
				let e = Le !== "";
				if (Lt(), de += 1, k(H, !1), k(U, "idle"), fd.clearCache?.(), Le = "", Re = !1, y.searchPage !== 1) {
					if (y.searchPage = 1, e) {
						let e = n();
						e && zt(e, () => It(e, R), () => y.loadedPosts.length > 0);
					}
					return;
				}
				if (y.searchPosts = [], y.searchTotalCount = 0, y.searchTotalCountKnown = !1, y.searchHasNext = !1, e) {
					let e = n();
					e && zt(e, () => It(e, R), () => y.loadedPosts.length > 0);
				}
			} else if (y.searchQuery !== Le) Lt(), Le === "" && y.searchPosts.length === 0 && (y.searchPosts = y.loadedPosts), Le = y.searchQuery, y.searchPage = 1, Re = !0, Tr(1, y.searchQuery);
			else if (Le = y.searchQuery, !Re) {
				Re = !0;
				let e = n(), t = y.searchQuery, r = ++de, i = y.searchPosts.length > 0;
				e && i && zt(e, () => Cr(r, t, e), () => y.searchPosts.length > 0), Er(y.searchPage, t, r);
			}
		}
	}), {
		state: y,
		get isSearchMode() {
			return B(X);
		},
		get posts() {
			return B(He);
		},
		get displayTotalCount() {
			return B(Ke);
		},
		get displayTotalCountKnown() {
			return B(X) ? y.searchTotalCountKnown : y.totalCountKnown;
		},
		get displayTotalCountStatus() {
			return B(X) ? y.searchTotalCountKnown ? "ready" : B(U) === "failed" ? "failed" : "loading" : y.totalCountStatus;
		},
		get displayPage() {
			return B(Ue);
		},
		get totalPages() {
			return B(qe);
		},
		get canGoPrevious() {
			return B(Je);
		},
		get canGoFirst() {
			return B(Ye);
		},
		get canGoNext() {
			return B(Xe);
		},
		get canGoLast() {
			return B(Qe);
		},
		get showPaging() {
			return B($e);
		},
		get canLoadOlder() {
			return B(et);
		},
		get canLoadNewer() {
			return B(tt);
		},
		get canReturnToLatest() {
			return B(nt);
		},
		get canJumpToOldest() {
			return B(at);
		},
		get canFetchOlderFromRelays() {
			return B(ot);
		},
		get isFetchingOlderFromRelays() {
			return B(st);
		},
		get isFetchingFromRelays() {
			return B(lt);
		},
		get isRefetchingAroundCurrentView() {
			return B(Ve);
		},
		get showLocalExhaustedState() {
			return B(ut);
		},
		get showSavedPostsBoundary() {
			return B(dt);
		},
		get isShowingSavedOlderPosts() {
			return y.listingMode === "sparse" && y.sparseSource === "saved";
		},
		get visibleNewestCreatedAt() {
			return B(rt);
		},
		get visibleOldestCreatedAt() {
			return B(it);
		},
		get visiblePostCount() {
			return B(ft);
		},
		get latestOlderBackfillUiResult() {
			return y.latestOlderBackfillUiResult;
		},
		get isDialogOpenSyncing() {
			return B(Me) && y.syncStatus === "syncing";
		},
		get syncStatus() {
			return y.syncStatus;
		},
		get syncStatusMessageKey() {
			return B(ht);
		},
		get showSyncLoader() {
			return B(gt);
		},
		get showStatusLoader() {
			return B(bt);
		},
		get isSearchPageLoading() {
			return B(H);
		},
		get searchResultStatus() {
			return B(U);
		},
		get initialLocalLoadStatus() {
			return B(ge);
		},
		get canRefetchAroundCurrentView() {
			return B(mt);
		},
		get currentViewRefetchStatusMessageKey() {
			return B(Ct);
		},
		get currentViewRefetchStatusMessageValues() {
			return B(Tt);
		},
		prepareForClose: un,
		suspend: cn,
		cancelCurrentSync: Dt,
		cancelCurrentViewRefetch: Bt,
		loadOlder: Lr,
		loadNewer: zr,
		returnToLatest: Br,
		showSavedOlderPosts: Vr,
		jumpToOldest: Hr,
		jumpToCreatedAt: br,
		jumpToEventId: xr,
		fetchOlderFromRelays: Ur,
		goFirstPage: Pr,
		goPreviousPage: Nr,
		goToNextPage: Fr,
		goToLastPage: Ir,
		refetchAroundCurrentView: Gr,
		resetSearchState: Yt,
		refreshAfterLocalImport: Yr,
		refreshAfterRelayScan: Jr,
		deleteLocalHistory: Kr,
		patchDeletedPost: Zr
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryDialogScrollState.ts
var rf = /* @__PURE__ */ new Map();
function af(e) {
	if (typeof e != "string") return null;
	let t = e.trim();
	return t.length > 0 ? t : null;
}
function of(e) {
	return typeof e == "string" ? e.trim() : "";
}
function sf(e) {
	let t = af(e.pubkeyHex);
	if (!t) return null;
	let n = e.mode === "search" ? of(e.searchQuery) : "";
	return `${t}:${e.mode}:${n}`;
}
function cf(e) {
	let t = sf(e);
	if (!t) return null;
	let n = rf.get(t);
	return n ? {
		...n,
		anchor: { ...n.anchor }
	} : null;
}
function lf(e) {
	let t = sf(e), n = af(e.pubkeyHex);
	t && n && rf.set(t, {
		pubkeyHex: n,
		mode: e.mode,
		searchQuery: e.mode === "search" ? of(e.searchQuery) : "",
		anchor: { ...e.anchor },
		savedAt: e.savedAt ?? Date.now()
	});
}
function uf(e) {
	let t = af(e.pubkeyHex);
	if (t) {
		if (e.mode) {
			let n = sf({
				pubkeyHex: t,
				mode: e.mode,
				searchQuery: e.searchQuery
			});
			n && rf.delete(n);
		} else for (let e of rf.keys()) e.startsWith(`${t}:`) && rf.delete(e);
	}
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/hooks/usePostHistoryDialogViewport.svelte.ts
var df = 1, ff = 2, pf = 12;
function mf(e, t, n, r) {
	return (e === "older" ? t : n) + ff >= r;
}
function hf(e) {
	return `${e.pubkeyHex}:${e.mode}:${e.searchQuery}:${e.anchor.eventId}:${e.savedAt}`;
}
function gf({ getShow: e, getPubkeyHex: t, getPosts: n, getLocale: r, getContainer: i, getIsSearchMode: a, getSearchQuery: o }) {
	let s = 0, c = () => {
		let t = s;
		return () => e() && t === s;
	};
	function l() {
		s++, M();
	}
	ie(l);
	let u = b(null), d = b(!0), f = b(!0), p = null, m = b(null), h = !1, g = null;
	function _() {
		return a() ? "search" : "normal";
	}
	function v() {
		return a() ? o() : "";
	}
	function y() {
		return cf({
			pubkeyHex: t(),
			mode: _(),
			searchQuery: v()
		});
	}
	function x(e) {
		return !!e && n().some((t) => t.eventId === e.anchor.eventId);
	}
	function S() {
		let e = L();
		e && lf({
			pubkeyHex: t(),
			mode: _(),
			searchQuery: v(),
			anchor: e
		});
	}
	function C() {
		uf({
			pubkeyHex: t(),
			mode: _(),
			searchQuery: v()
		}), k(m, null), g = null;
	}
	function w() {
		uf({ pubkeyHex: t() }), k(m, null), g = null;
	}
	function T() {
		let e = i();
		e && (e.scrollTop = 0, D(), O(), N());
	}
	function E() {
		let e = i();
		e && (e.scrollTop = e.scrollHeight, D(), O(), N());
	}
	function D() {
		let e = i();
		e ? k(d, e.scrollTop <= df) : k(d, !0);
	}
	function O() {
		let e = i();
		if (!e) {
			k(f, !0);
			return;
		}
		let t = e.scrollHeight - e.clientHeight - e.scrollTop;
		k(f, t <= ff);
	}
	function A() {
		let e = i();
		if (!e) return null;
		let t = e.getBoundingClientRect(), n = t.top + pf, r = Array.from(e.querySelectorAll("[data-post-history-event-id]")), a = 0, o = r.length, s = t.top + df;
		for (; a < o;) {
			let e = Math.floor((a + o) / 2);
			r[e].getBoundingClientRect().bottom > s ? o = e : a = e + 1;
		}
		let c = null;
		for (let e = a; e < r.length; e += 1) {
			let i = r[e], a = i.getBoundingClientRect();
			if (a.top >= t.bottom - df) break;
			let o = Number(i.dataset.postHistoryPostedAt);
			if (Number.isFinite(o)) {
				if (a.top <= n && a.bottom > n) return o;
				c === null && (c = o);
			}
		}
		return c;
	}
	function j() {
		if (!e() || n().length === 0) {
			k(u, null);
			return;
		}
		let t = A();
		k(u, t === null ? null : an(t, r()), !0);
	}
	function ee() {
		M(), j(), ce();
	}
	function M() {
		p !== null && (cancelAnimationFrame(p), p = null);
	}
	function N() {
		e() && (M(), p = requestAnimationFrame(() => {
			p = null, j();
		}));
	}
	function ne() {
		D(), O(), B(f) ? ee() : N();
	}
	function P() {
		let e = c();
		te().then(() => {
			e() && T();
		});
	}
	function F() {
		let e = c();
		te().then(() => {
			e() && E();
		});
	}
	function I(e) {
		let t = c();
		te().then(() => {
			t() && re({
				eventId: e,
				offsetTop: 0
			});
		});
	}
	function L() {
		let e = i();
		if (!e) return null;
		let t = e.getBoundingClientRect(), n = Array.from(e.querySelectorAll("[data-post-history-event-id]"));
		for (let e of n) {
			let n = e.dataset.postHistoryEventId;
			if (!n) continue;
			let r = e.getBoundingClientRect();
			if (r.bottom > t.top + df && r.top < t.bottom - df) return {
				eventId: n,
				offsetTop: r.top - t.top
			};
		}
		return null;
	}
	function re(t, n = {}) {
		let r = i();
		if (!t || !e() || !r) return !1;
		n.flushUpdates !== !1 && ce();
		let a = Array.from(r.querySelectorAll("[data-post-history-event-id]")).find((e) => e.dataset.postHistoryEventId === t.eventId);
		if (!a) return !1;
		let o = r.getBoundingClientRect(), s = a.getBoundingClientRect().top - o.top;
		return r.scrollTop += s - t.offsetTop, N(), !0;
	}
	function R(e, t, n) {
		let r = i();
		if (!r || t.length === 0) return !1;
		let a = new Set(n.map((e) => e.eventId)), o = new Map(Array.from(r.querySelectorAll(".post-history-item"), (e) => [e.dataset.postHistoryEventId, e])), s = t.map((e) => ({
			post: e,
			element: o.get(e.eventId) ?? null
		}));
		if (s.some(({ element: e }) => !e)) return !1;
		if (e === "older") {
			let e = s.find(({ post: e }) => a.has(e.eventId));
			if (!e?.element) return !1;
			if (e.post.eventId === t[0]?.eventId) return !0;
			let n = s[0]?.element?.getBoundingClientRect(), i = e.element.getBoundingClientRect();
			if (!n || !i) return !1;
			let o = i.top - n.top;
			return mf("older", r.scrollTop, 0, o);
		}
		let c = -1;
		for (let e = 0; e < s.length; e += 1) {
			let t = s[e];
			t && a.has(t.post.eventId) && (c = e);
		}
		if (c < 0 || c === s.length - 1) return c >= 0;
		let l = s[c]?.element, u = s.at(-1)?.element;
		if (!l || !u) return !1;
		let d = l.getBoundingClientRect(), f = u.getBoundingClientRect().bottom - d.bottom;
		return mf("newer", 0, r.scrollHeight - r.clientHeight - r.scrollTop, f);
	}
	function V(e, t) {
		let n = i();
		return n ? Array.from(n.querySelectorAll("[data-post-history-thread-anchor-event-id]")).find((n) => n.dataset.postHistoryThreadAnchorScopeId === e && n.dataset.postHistoryThreadAnchorEventId === t) ?? null : null;
	}
	function ae(e, t) {
		let n = V(e, t);
		return n ? {
			scopeEventId: e,
			eventId: t,
			top: n.getBoundingClientRect().top
		} : null;
	}
	function oe(t) {
		let n = i();
		if (!t || !e() || !n) return !1;
		ce();
		let r = V(t.scopeEventId, t.eventId);
		if (!r) return !1;
		let a = r.getBoundingClientRect().top - t.top;
		return Math.abs(a) < .5 || (n.scrollTop += a, N(), D(), O()), !0;
	}
	async function se(e, t, n) {
		let r = c(), i = ae(e, t), a = n();
		await te(), r() && (oe(i), await a, await te(), r() && oe(i));
	}
	return z(() => {
		e() ? h || (h = !0, k(m, y(), !0), g = null) : (h = !1, k(m, null), g = null, k(u, null), M());
	}), z(() => {
		if (!e() || !x(B(m))) return;
		let t = B(m), n = hf(t);
		if (g === n) return;
		let r = c();
		te().then(() => {
			r() && B(m) === t && (re(t.anchor), g = n, k(m, null));
		});
	}), z(() => {
		if (!e()) {
			k(u, null), M();
			return;
		}
		i(), n(), r();
		let t = c();
		return te().then(() => {
			t() && (j(), D(), O());
		}), () => {
			M();
		};
	}), {
		suspend: l,
		get currentMonthLabel() {
			return B(u);
		},
		get isHistoryScrolledToTop() {
			return B(d);
		},
		get isHistoryScrolledToBottom() {
			return B(f);
		},
		readCurrentSessionScrollState: y,
		saveCurrentSessionScrollAnchor: S,
		clearCurrentSessionScrollAnchor: C,
		clearAllSessionScrollAnchorsForCurrentPubkey: w,
		handleHistoryScroll: ne,
		resetHistoryScrollSoon: P,
		resetHistoryScrollToBottomSoon: F,
		scrollHistoryEventToTopSoon: I,
		captureHistoryScrollAnchor: L,
		canCommitAutoLoadWindowChange: R,
		restoreHistoryScrollAnchor: re,
		preserveThreadParentToggleScroll: se
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryRelatedEventsFetchService.ts
function _f(e, t) {
	let n = t.relayConfig, r = [...t.relayHints, ...t.knownChildren.flatMap((e) => e.relayUrls)], i = n ? [...fe.extractReadRelays(n), ...fe.extractWriteRelays(n)] : [], a = fe.sanitizeExternalRelayUrls([...r, ...i], { limit: 8 }), o = fe.sanitizeExternalRelayUrls(kt(r, 8) ?? (a.length ? a : H), { limit: 8 }), s = {
		eventId: t.event.id,
		targetAuthorPubkey: t.event.pubkey,
		targetKind: t.event.kind
	}, c = Gt({ event: t.event }), l = /* @__PURE__ */ new Map(), u = /* @__PURE__ */ new Map(), d = /* @__PURE__ */ new Set(), f = !1, p = Date.now(), m = new Vt(3e3, () => {
		[...d].forEach((e) => e());
	}), h = (e, t) => {
		let n = e.get(t.event.id);
		(!n || pe(n.event, t.event)) && e.set(t.event.id, {
			event: t.event,
			relayUrls: [.../* @__PURE__ */ new Set([...n?.relayUrls ?? [], ...t.relayUrls])]
		});
	}, g = (e) => {
		if (e.kind === 7) {
			let t = gt(e).reference;
			return !!t && ot(t, s);
		}
		return !!c && Cn({
			child: e,
			parent: c
		}).valid;
	}, _ = (n) => new Promise((r) => {
		let i = `related-${Date.now()}-${Math.random().toString(36).slice(2)}`, a = Bt(i), s, c = /* @__PURE__ */ new Map(), u = !1, f, _, v = (e) => {
			u || (u = !0, f?.unsubscribe(), _?.unsubscribe(), d.delete(y), r(e));
		}, y = () => v("cancelled");
		d.add(y);
		try {
			if (_ = e.createAllMessageObservable().subscribe((e) => {
				Array.isArray(e.message) && e.message[1] === `${i}:0` && e.message[0] === "EVENT" && c.set(e.from, (c.get(e.from) ?? 0) + 1);
			}), f = zt(e, a, { on: { relays: o } }, {
				operation: m,
				deadlineAt: p + 2e3,
				quorum: !1,
				source: (t, n) => dt(e, t, n),
				onEnd: (e) => {
					s = e;
				}
			}).subscribe({
				next: (e) => {
					!u && g(e.event) && h(l, {
						event: e.event,
						relayUrls: [e.from]
					});
				},
				complete: () => v(s?.complete && [...c.values()].every((e) => e < 100) ? "success" : "partial"),
				error: () => v("failed")
			}), u) {
				f.unsubscribe();
				return;
			}
			a.emit({
				kinds: n,
				"#e": [t.event.id],
				limit: 100
			}), a.over();
		} catch {
			v("failed");
		}
	}), v = async (t, r) => {
		if (!t.length) return "success";
		if (r <= 0) return "partial";
		if (f) return "cancelled";
		let i = nn.fetchDeletionRequests(e, {
			targets: t.map((e) => ({ event: e })),
			relayHints: o,
			relayConfig: n,
			requireRelayEose: !0,
			timeoutMs: Math.max(1, r),
			operation: m,
			deadlineAt: Date.now() + r
		});
		d.add(i.cancel);
		let a = await i.promise;
		return d.delete(i.cancel), a.events.forEach((e) => h(u, e)), a.status === "success" ? "success" : a.status === "cancelled" ? "cancelled" : "partial";
	};
	return {
		promise: (async () => {
			let e = [t.event, ...t.knownChildren.filter((e) => g(e.event)).map((e) => e.event)], n = t.event.kind === 42 ? [42] : t.event.kind === 1111 ? [1111] : [1, 1111], r = await Promise.all([
				_(n),
				_([7]),
				v(e, Math.max(0, 2e3 - (Date.now() - p)))
			]), i = new Set(e.map((e) => e.id)), a = [...l.values()].map((e) => e.event).filter((e) => !i.has(e.id));
			return f || r.push(await v(a, Math.min(1e3, Math.max(0, 3e3 - (Date.now() - p))))), m.finish(), {
				status: f ? "cancelled" : r[0] === "failed" && r[1] === "failed" && !l.size && !u.size ? "failed" : r.every((e) => e === "success") ? "success" : "partial",
				events: [...l.values()],
				deletions: [...u.values()],
				targets: [...e, ...a],
				fetchedAt: Date.now(),
				repliesComplete: r[0] === "success"
			};
		})(),
		cancel() {
			f = !0, [...d].forEach((e) => e()), m.finish("cancelled");
		}
	};
}
var vf = 86400, yf = 6e3, bf = 8;
function xf(e) {
	return Number.isFinite(e) ? Math.max(1, Math.trunc(e ?? 100)) : 100;
}
function Sf(e) {
	return Array.from(e.values()).map((e) => ({
		parentEventId: e.parentEventId,
		event: e.event,
		relayUrls: Array.from(e.relayUrls).sort((e, t) => e.localeCompare(t))
	})).sort((e, t) => e.event.created_at === t.event.created_at ? e.event.id.localeCompare(t.event.id) : e.event.created_at - t.event.created_at);
}
function Cf(e) {
	if (e.parents) {
		let t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Set();
		for (let r of e.parents) {
			if (!r.eventId || n.has(r.eventId)) continue;
			let e = t.get(r.eventId);
			e && (e.eventKind !== r.eventKind || e.createdAt !== r.createdAt || e.channelEventId && r.channelEventId && e.channelEventId !== r.channelEventId) ? (t.delete(r.eventId), n.add(r.eventId)) : t.set(r.eventId, {
				...r,
				channelEventId: r.channelEventId ?? e?.channelEventId ?? null,
				relayHints: Array.from(/* @__PURE__ */ new Set([...e?.relayHints ?? [], ...r.relayHints]))
			});
		}
		return Array.from(t.values());
	}
	let t = e.eventIds && e.eventIds.length > 0 ? e.eventIds : [e.eventId];
	return Array.from(new Set(t.filter((e) => !!e))).map((t) => ({
		eventId: t,
		eventKind: 1,
		channelEventId: null,
		createdAt: e.createdAt,
		relayHints: e.relayHints ?? []
	}));
}
var wf = new class {
	console;
	setTimeoutFn;
	clearTimeoutFn;
	now;
	constructor(e = {}) {
		this.console = e.console ?? (typeof console < "u" ? console : {
			log: () => void 0,
			warn: () => void 0,
			error: () => void 0
		}), this.setTimeoutFn = e.setTimeoutFn ?? ((e, t) => setTimeout(e, t)), this.clearTimeoutFn = e.clearTimeoutFn ?? ((e) => clearTimeout(e)), this.now = e.now ?? Date.now;
	}
	fetchDirectReplies(e, t) {
		let n = Bt(), r = Cf(t), i = new Map(r.map((e) => [e.eventId, e])), a = r.map((e) => e.eventId), o = this.resolveRelayUrls([...t.relayHints ?? [], ...r.flatMap((e) => e.relayHints)], t.relayConfig, t.relayLimit), s = xf(t.limit), c = Math.max(0, Math.trunc(Math.min(...r.map((e) => e.createdAt))) - vf), l = /* @__PURE__ */ new Map(), u = !1, d, f, p, m = () => {
			f?.unsubscribe?.(), f = void 0;
		}, h = (e) => ({
			status: e === "failed" && l.size > 0 ? "partial" : e,
			events: Sf(l),
			fetchedAt: this.now(),
			relayUrls: o
		}), g = (e) => (t) => {
			u || (u = !0, m(), e(h(t)));
		};
		return {
			promise: new Promise((u) => {
				let m = g(u);
				p = m;
				try {
					if (a.length === 0) {
						m("success");
						return;
					}
					f = zt(e, n, { on: o.length > 0 ? { relays: o } : { defaultReadRelays: !0 } }, {
						timeoutMs: Math.min(6e3, t.timeoutMs ?? yf),
						quorum: !0,
						source: (t, n) => dt(e, t, n),
						setTimeoutFn: this.setTimeoutFn,
						clearTimeoutFn: this.clearTimeoutFn,
						onEnd: (e) => {
							d = e;
						}
					}).subscribe({
						next: (e) => {
							this.handlePacket(l, i, e);
						},
						complete: () => m(d && !d.complete ? "failed" : "success"),
						error: (e) => {
							this.console.error("post_history_reply_fetch_error", e), m("failed");
						}
					});
					let u = Array.from(new Set(r.flatMap((e) => e.eventKind === 42 ? [42] : e.eventKind === 1 ? [1, 1111] : e.eventKind === 1111 ? [1111] : []))).sort();
					n.emit({
						kinds: u,
						"#e": a,
						since: c,
						limit: s
					}), n.over();
				} catch (e) {
					this.console.error("post_history_reply_fetch_request_error", e), m("failed");
				}
			}),
			cancel: () => {
				p?.("cancelled");
			}
		};
	}
	handlePacket(e, t, n) {
		let r = n.event;
		if (!r?.id || ![
			1,
			42,
			1111
		].includes(r.kind)) return;
		let i = ge(r).parentId, a = i ? t.get(i) : null;
		if (!a || !Cn({
			child: r,
			parent: a
		}).valid) return;
		let o = fe.sanitizeExternalRelayUrls(typeof n.from == "string" ? [n.from] : [], { limit: 1 })[0], s = e.get(r.id);
		s ? pe(s.event, r) ? o && s.relayUrls.add(o) : this.console.warn("post_history_reply_fetch_packet_conflict", r.id) : e.set(r.id, {
			parentEventId: a.eventId,
			event: r,
			relayUrls: new Set(o ? [o] : [])
		});
	}
	resolveRelayUrls(e, t, n) {
		let r = Number.isFinite(n) ? Math.max(1, Math.trunc(n ?? bf)) : bf, i = kt(e, r);
		if (i) return i;
		let a = t ? [...fe.extractReadRelays(t), ...fe.extractWriteRelays(t)] : [], o = fe.sanitizeExternalRelayUrls([...e ?? [], ...a], { limit: r });
		return o.length > 0 ? o : fe.sanitizeExternalRelayUrls(H, { limit: r });
	}
}();
function Tf(e) {
	return typeof e == "number" && Number.isFinite(e);
}
function Ef(e) {
	if (!e || typeof e != "object") return !1;
	let t = e;
	return typeof t.parentEventId == "string" && (t.completeness === "complete" || t.completeness === "partial") && Tf(t.fetchedAt) && Tf(t.requestStartedAt) && t.schemaVersion === 1;
}
function Df(e, t) {
	return e ? e.requestStartedAt > t.requestStartedAt || e.requestStartedAt === t.requestStartedAt && e.completeness === "complete" && t.completeness === "partial" : !1;
}
var Of = new class {
	db;
	now;
	constructor(e = We, t = Date.now) {
		this.db = e, this.now = t;
	}
	async get(e) {
		if (!e) return null;
		let t = await this.db.postHistoryDirectReplyFetchMeta.get(e);
		return !t || !Ef(t.value) ? null : {
			...t.value,
			updatedAt: t.updatedAt
		};
	}
	async getForParentEventIds(e) {
		let t = Array.from(new Set(e.filter((e) => !!e)));
		return t.length === 0 ? [] : (await this.db.postHistoryDirectReplyFetchMeta.bulkGet(t)).flatMap((e) => !e || !Ef(e.value) ? [] : [{
			...e.value,
			updatedAt: e.updatedAt
		}]);
	}
	async save(e) {
		return !e.parentEventId || !Tf(e.fetchedAt) || !Tf(e.requestStartedAt) ? null : this.db.transaction("rw", this.db.postHistoryDirectReplyFetchMeta, async () => {
			let t = await this.get(e.parentEventId);
			if (Df(t, e)) return t;
			let n = this.now(), r = {
				parentEventId: e.parentEventId,
				completeness: e.completeness,
				fetchedAt: e.fetchedAt,
				requestStartedAt: e.requestStartedAt,
				schemaVersion: 1
			};
			return await this.db.postHistoryDirectReplyFetchMeta.put({
				id: e.parentEventId,
				value: r,
				updatedAt: n
			}), {
				...r,
				updatedAt: n
			};
		});
	}
	async clear(e) {
		e && await this.db.postHistoryDirectReplyFetchMeta.delete(e);
	}
}(), kf = {
	totalCount: 0,
	groups: []
};
function Af(e) {
	if (!Rn(e.content)) return;
	let t = zn(e.content);
	if (t) return Bn(e.tags ?? []).get(t)?.url;
}
function jf(e) {
	if (e.length === 0) return kf;
	let t = [], n = /* @__PURE__ */ new Map(), r = 0;
	for (let i of e) {
		if (i.kind !== 7) continue;
		r += 1;
		let e = Af(i), a = n.get(i.content);
		if (a === void 0) {
			n.set(i.content, t.length), t.push(e ? {
				content: i.content,
				count: 1,
				emojiUrl: e
			} : {
				content: i.content,
				count: 1
			});
			continue;
		}
		let o = t[a], s = o.emojiUrl ?? e;
		t[a] = {
			...o,
			count: o.count + 1,
			...s ? { emojiUrl: s } : {}
		};
	}
	return r === 0 ? kf : {
		totalCount: r,
		groups: t
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryThreadGraphTaskTracker.ts
function Mf() {
	let e = 0, t = 0, n = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
	return {
		getRequestId() {
			return e;
		},
		incrementRequestId() {
			return e += 1, e;
		},
		createChildRequestToken(e) {
			return t += 1, n.set(e, t), t;
		},
		getChildRequestToken(e) {
			return n.get(e);
		},
		deleteChildRequestToken(e) {
			n.delete(e);
		},
		clearChildRequestTokens() {
			n.clear();
		},
		replaceChildrenFetchTask(e, t) {
			r.get(e)?.cancel(), r.set(e, t);
		},
		deleteChildrenFetchTask(e) {
			r.delete(e);
		},
		replaceDeletionFetchTask(e, t) {
			i.get(e)?.cancel(), i.set(e, t);
		},
		deleteDeletionFetchTask(e) {
			i.delete(e);
		},
		cancelAndClearFetchTasks() {
			r.forEach((e) => e.cancel()), i.forEach((e) => e.cancel()), r.clear(), i.clear();
		}
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryThreadGraphParentLoadingIndicator.ts
function Nf(e = {}) {
	let t = e.setTimeoutFn ?? ((e, t) => setTimeout(e, t)), n = e.clearTimeoutFn ?? ((e) => clearTimeout(e)), r = /* @__PURE__ */ new Map();
	function i(e) {
		let t = r.get(e);
		t && (n(t), r.delete(e));
	}
	return {
		schedule(e, n, a = 400) {
			i(e);
			let o = t(() => {
				r.delete(e), n();
			}, a);
			r.set(e, o);
		},
		clear: i,
		clearAll() {
			r.forEach((e) => n(e)), r.clear();
		}
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryThreadGraphParentExpansionState.ts
function Pf(e, t) {
	return {
		...e,
		loadingParent: t.showInitialLoading,
		revalidatingParent: !t.showInitialLoading,
		visibleParent: e.visibleParent || t.showInitialLoading,
		parentError: null,
		parentMissing: !1,
		parentDeleted: !1,
		showParentLoadingIndicator: !1
	};
}
function Ff(e, t = {}) {
	return {
		...e,
		loadedParent: !0,
		visibleParent: t.visibleParent ?? e.visibleParent,
		loadingParent: !1,
		revalidatingParent: t.revalidatingParent ?? e.revalidatingParent,
		parentError: t.parentError ?? null,
		parentMissing: t.parentMissing ?? !1,
		parentDeleted: t.parentDeleted ?? !1,
		showParentLoadingIndicator: !1,
		lastFetchedParentAt: t.lastFetchedParentAt ?? e.lastFetchedParentAt
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryThreadGraphChildrenExpansionState.ts
function If(e, t) {
	return {
		...e,
		loadingChildren: t.showInitialLoading,
		revalidatingChildren: !t.showInitialLoading,
		visibleChildren: t.prefetchOnly ? e.visibleChildren : e.visibleChildren || t.showInitialLoading,
		childrenError: null
	};
}
function Lf(e, t = {}) {
	return {
		...e,
		loadedChildren: t.loadedChildren ?? !0,
		visibleChildren: t.visibleChildren ?? e.visibleChildren,
		loadingChildren: !1,
		revalidatingChildren: t.revalidatingChildren ?? e.revalidatingChildren,
		childrenError: null,
		lastFetchedChildrenAt: t.lastFetchedChildrenAt === void 0 ? e.lastFetchedChildrenAt : t.lastFetchedChildrenAt
	};
}
function Rf(e, t) {
	return {
		...e,
		loadingChildren: !1,
		revalidatingChildren: !1,
		visibleChildren: e.visibleChildren,
		childrenError: t.nextError
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryThreadGraphApplyStrategies.ts
function zf(e) {
	return e.status === "deleted" ? "deleted" : e.status === "not-found" ? "not-found" : e.status === "resolved" && e.event ? "resolved" : "failed";
}
function Bf(e) {
	return e.nextRecordsLength > 0 ? "resolved" : e.resultEventsLength > 0 ? "deleted" : "not-found";
}
function Vf(e) {
	return {
		deleted: () => {
			e.snapshot.authorPubkey && (e.hideEvent(e.snapshot.authorPubkey, e.parentEventId), e.markParentDeletedForEvent(e.parentEventId, e.snapshot.authorPubkey, { revealKnownParent: !0 })), e.setParentDeleted();
		},
		"not-found": () => {
			e.updateExpansion((t) => ({ ...Ff(t, {
				revalidatingParent: !1,
				parentMissing: e.showInitialLoading ? !0 : t.parentMissing,
				parentDeleted: !1,
				lastFetchedParentAt: e.snapshot.updatedAt ?? Date.now()
			}) }));
		},
		resolved: () => {
			if (!e.snapshot.event) return;
			if (e.snapshot.authorPubkey && e.isDeletedEvent(e.snapshot.authorPubkey, e.parentEventId)) {
				e.setParentDeleted();
				return;
			}
			let t = e.upsertNode();
			e.upsertParentEdge(t.eventId, t.parentEventId), e.updateExpansion((t) => ({ ...Ff(t, {
				revalidatingParent: !1,
				parentMissing: !1,
				parentDeleted: !1,
				lastFetchedParentAt: e.snapshot.updatedAt ?? Date.now()
			}) }));
		},
		failed: () => {
			e.updateExpansion((t) => ({
				...t,
				loadingParent: !1,
				revalidatingParent: !1,
				visibleParent: t.visibleParent,
				parentError: e.showInitialLoading ? e.snapshot.errorCode ?? "fetch_failed" : t.parentError,
				showParentLoadingIndicator: !1
			}));
		}
	};
}
function Hf(e) {
	let t = () => {
		e.updateExpansion((t) => ({ ...Lf(t, {
			revalidatingChildren: !1,
			lastFetchedChildrenAt: e.fetchedAt
		}) })), e.prefetchOnly || e.prefetchChildReplyCounts();
	};
	return {
		resolved: t,
		"not-found": t,
		deleted: t
	};
}
function Uf(e) {
	e.updateExpansion((t) => ({
		...t,
		loadingParent: !1,
		revalidatingParent: !1,
		visibleParent: t.visibleParent,
		parentError: e.showInitialLoading ? e.errorCode ?? "fetch_failed" : t.parentError,
		showParentLoadingIndicator: !1
	}));
}
function Wf(e) {
	e.updateExpansion((t) => ({ ...Rf(t, { nextError: e.showInitialLoading && !e.prefetchOnly ? e.errorCode ?? "fetch_failed" : t.childrenError }) }));
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryThreadGraphLoadDecision.ts
function Gf(e) {
	return typeof e.lastFetchedAt != "number" || (e.now ?? Date.now()) - e.lastFetchedAt >= e.ttlMs;
}
function Kf(e) {
	return !e.displayedCached || e.force ? !1 : !Gf({
		lastFetchedAt: e.lastFetchedAt,
		ttlMs: e.ttlMs,
		now: e.now
	});
}
function qf(e) {
	let t = Kf(e);
	return {
		skipRevalidate: t,
		shouldShowInitialLoading: !e.displayedCached,
		shouldPrefetchReplyCountsOnSkip: t && !e.prefetchOnly
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryThreadGraphFetchCoordinator.ts
function Jf(e) {
	return !e.loading && !e.revalidating ? !1 : (e.onInFlight(), e.loading && e.onLoadingInFlight?.(), !0);
}
function Yf(e) {
	return e.hasVisibleData ? Gf({
		lastFetchedAt: e.lastFetchedAt,
		ttlMs: e.ttlMs,
		now: e.now
	}) : !1;
}
async function Xf(e) {
	let t = !1, n = () => {
		let n = e.isActive();
		return !n && !t && (t = !0, e.onInactive?.()), n;
	};
	try {
		await e.run({ ensureActive: n });
	} catch (t) {
		n() && await e.onError?.(t);
	} finally {
		e.cleanup?.();
	}
}
async function Zf(e) {
	let t = !1, n = () => {
		let n = e.isActive();
		return !n && !t && (t = !0, e.onInactive?.()), n;
	}, r = /* @__PURE__ */ new Map();
	if (e.prepareItem) for (let t of e.items) r.set(t, e.prepareItem(t));
	try {
		await e.run({ ensureActive: n }), n() && e.completeBatch?.(!0);
	} catch (t) {
		n() && (e.completeBatch?.(!1), await e.onError?.(t));
	} finally {
		if (e.cleanupItem) for (let t of e.items) r.has(t) && e.cleanupItem(t, r.get(t));
		e.cleanup?.();
	}
}
async function Qf(e) {
	let t = e.strategies[e.status] ?? e.fallback;
	t && await t();
}
async function $f(e) {
	if (e.skipRevalidate) return;
	let t = e.runRevalidate({ showInitialLoading: e.shouldShowInitialLoading });
	e.awaitWhenInitialLoading && e.shouldShowInitialLoading && await t;
}
async function ep(e) {
	let t = qf(e);
	return t.shouldPrefetchReplyCountsOnSkip && e.onSkipPrefetchReplyCounts?.(), await $f({
		skipRevalidate: t.skipRevalidate,
		shouldShowInitialLoading: t.shouldShowInitialLoading,
		awaitWhenInitialLoading: e.awaitWhenInitialLoading,
		runRevalidate: e.runRevalidate
	}), t;
}
async function tp(e) {
	if (Jf({
		loading: e.loading,
		revalidating: e.revalidating,
		onInFlight: e.onInFlight,
		onLoadingInFlight: e.onLoadingInFlight
	}) || e.shouldHandleLoadedState && await e.handleLoadedState()) return;
	e.prepareFreshLoadState();
	let t = await e.displayCachedForFreshLoad();
	await ep({
		displayedCached: t.displayedCached,
		force: e.force,
		lastFetchedAt: t.lastFetchedAt,
		ttlMs: e.ttlMs,
		prefetchOnly: e.prefetchOnly,
		now: e.now,
		awaitWhenInitialLoading: e.awaitWhenInitialLoading,
		onSkipPrefetchReplyCounts: e.onSkipPrefetchReplyCounts,
		runRevalidate: e.runRevalidate
	});
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/hooks/usePostHistoryThreadGraph.svelte.ts
function np(e) {
	return fe.sanitizeExternalRelayUrls(e, { limit: 8 });
}
function rp(e) {
	return Array.from(new Set(e));
}
var ip = 20, ap = 12, op = 2, sp = 4, cp = 4, lp = 3e5, up = class extends Error {};
function dp(e) {
	if (e === "failed") throw Error("post_history_reply_fetch_failed");
	if (e === "cancelled") throw new up();
}
function fp(e) {
	return (t) => {
		t instanceof up ? e.updateExpansion((e) => ({ ...Rf(e, { nextError: e.childrenError }) })) : Wf({
			...e,
			errorCode: "fetch_failed"
		});
	};
}
function pp(e) {
	return e === "partial" ? "partial" : "complete";
}
function mp(e) {
	return e?.completeness === "complete" ? e.fetchedAt : null;
}
var hp = 3e5, gp = 0;
function _p(e, t) {
	let n = new Set(e.map((e) => e.eventId));
	return (t && t.length > 0 ? Array.from(new Set(t)) : Array.from(n)).filter((e) => n.has(e));
}
function vp(e) {
	let t = Gt({
		event: e.parentNode.event,
		relayHints: e.parentNode.relayUrls
	});
	return !!t && Cn({
		child: ur(e.record),
		parent: t
	}).valid;
}
function yp(e) {
	if (!e.parentNode) return null;
	let t = Gt({
		event: e.parentNode.event,
		relayHints: e.parentNode.relayUrls
	});
	return t && Cn({
		child: e.childNode.event,
		parent: t
	}).valid ? e.parentNode : null;
}
function bp({ onRelatedEventsRefreshed: e, onDeletedPost: t, relatedEventsFetch: n = _f, getShow: r, getSessionOpen: i = r, getPubkeyHex: a, getRxNostr: o, getRelayConfig: s, postHistoryRepositoryImpl: c = Z, directReplyRecordsAdapterImpl: l = un, reactionRecordsAdapterImpl: u = wn, childInteractionsRepositoryImpl: d = ht, deletionRequestsRepositoryImpl: f = tn, directReplyFetchMetadataRepositoryImpl: p = Of, profileSyncCoordinator: m = void 0, contextFetchService: h = $t, replyFetchService: g = wf, deletionFetchService: _ = nn, relatedTargetResolver: v = void 0 }) {
	let y = m ?? hr({
		getShow: r,
		getRxNostr: o
	}), x = !m, S = v ?? Lr({
		getShow: r,
		getRxNostr: o,
		getRelayConfig: s,
		postHistoryRepositoryImpl: c,
		contextFetchService: h,
		deletionRequestsRepositoryImpl: f,
		deletionFetchService: _,
		profileSyncCoordinator: y
	}), C = !v, w = `post-history-thread-graph-parent:${++gp}`, T = b({}), E = b({}), D = b({}), O = b({}), A = b({}), j = b(0), ee = Nf(), M = /* @__PURE__ */ new Set(), N = /* @__PURE__ */ new Set(), te = /* @__PURE__ */ new Set(), ne = /* @__PURE__ */ new Set(), P = b({}), I = b({}), L = b({}), R = b({}), V = Mf(), ae = b(F({})), oe = /* @__PURE__ */ new Map();
	function se(i, c = i.eventId) {
		let m = oe.get(c);
		if (m) return m.promise;
		let h = xt(i, c), g = o();
		if (!h || !g) return k(ae, {
			...B(ae),
			[c]: "failed"
		}, !0), Promise.resolve();
		let _ = a(), v = V.getRequestId(), y = !1, b, x = () => !y && r() && _ === a() && g === o() && v === V.getRequestId();
		k(ae, {
			...B(ae),
			[c]: "loading"
		}, !0);
		let S = Date.now(), C = {
			cancel() {
				y = !0, b?.cancel();
			},
			promise: Promise.resolve()
		};
		return oe.set(c, C), C.promise = (async () => {
			try {
				let r = await ut(We), [a, o] = await Promise.all([l.getDirectReplyRecords(c), Sr(c, u)]);
				if (!x()) return;
				b = n(g, {
					event: h.event,
					knownChildren: [...a, ...o].map((e) => ({
						event: ur(e),
						relayUrls: e.relayUrls
					})),
					relayHints: G(i, h),
					relayConfig: s()
				});
				let m = await b.promise;
				if (!x() || m.status === "cancelled" || (await f.upsertValidDeletionRequests({
					targetEvents: m.targets,
					deletionEvents: m.deletions,
					fetchedAt: m.fetchedAt
				}), !x()) || (await ze(m.targets), !x())) return;
				for (let e of m.targets) {
					let n = m.deletions.find((t) => Xe(t.event, e));
					if (n) {
						if (await Z.markDeleted(e.id, n.event.id, n.event.created_at * 1e3), !x()) return;
						t?.(e.id, n.event.created_at * 1e3, n.event.id);
					}
				}
				let _ = m.events.filter((e) => !Me(e.event.pubkey, e.event.id));
				if (_.length > 0 && await d.upsertChildInteractions({
					parentEventId: c,
					events: _,
					reactionTarget: {
						eventId: c,
						targetAuthorPubkey: h.event.pubkey,
						targetKind: h.event.kind
					},
					fetchedAt: m.repliesComplete ? m.fetchedAt : null,
					expectedChildGeneration: r
				}), !x() || (await p.save({
					parentEventId: c,
					completeness: m.repliesComplete ? "complete" : "partial",
					fetchedAt: m.fetchedAt,
					requestStartedAt: S
				}), !x()) || (await At([{
					...i,
					id: c,
					eventId: c,
					pubkeyHex: h.event.pubkey,
					kind: h.event.kind,
					content: h.event.content,
					tags: h.event.tags,
					createdAt: h.event.created_at,
					postedAt: h.event.created_at * 1e3,
					rawEvent: h.event
				}], [c], x), !x())) return;
				let v = await X(await l.getDirectReplyRecords(c));
				if (!x() || (await Mt(h, v, ["reply-db"], { resolveProfiles: !1 }), !x())) return;
				U(i.eventId, c, (e) => Lf(e, {
					visibleChildren: !0,
					lastFetchedChildrenAt: m.repliesComplete ? m.fetchedAt : null
				})), k(ae, {
					...B(ae),
					[c]: m.status
				}, !0), e?.(m.status);
			} catch {
				x() && k(ae, {
					...B(ae),
					[c]: "failed"
				}, !0);
			} finally {
				oe.get(c) === C && oe.delete(c);
			}
		})(), C.promise;
	}
	function ce(e) {
		let t = B(I)[e] ?? [];
		k(R, {
			...B(R),
			[e]: Cr(t, B(L))
		});
	}
	function le(e, t) {
		k(L, {
			...B(L),
			[e]: t
		});
		for (let [t, n] of Object.entries(B(I))) n.some((t) => t.authorPubkey === e) && ce(t);
	}
	function ue(e) {
		return B(P)[e] ?? kf;
	}
	function de(e) {
		return B(R)[e] ?? Or;
	}
	function H(e, t) {
		return B(O)[or(e, t)] ?? ar();
	}
	function U(e, t, n) {
		let r = or(e, t);
		k(O, {
			...B(O),
			[r]: n(B(O)[r] ?? ar())
		});
	}
	function pe(e) {
		let t = dr(e), n = Er(B(T)[t.eventId], t);
		return k(T, {
			...B(T),
			[n.eventId]: n
		}), n;
	}
	function me(e, t) {
		t && k(E, {
			...B(E),
			[e]: t
		});
	}
	function he(e, t) {
		let n = B(D)[e] ?? [], r = Tr(rp([...n, ...t]).filter((t) => t !== e && !Ne(t)), B(T));
		k(D, {
			...B(D),
			[e]: r
		});
	}
	function W(e) {
		let t = lr(e);
		return dr({
			event: t,
			relayUrls: np([
				...e.relayHints,
				...e.acceptedRelays,
				...e.fetchedRelays ?? []
			]),
			sources: ["anchor", "history-record"]
		});
	}
	function _e(e) {
		let t = W(e), n = pe({
			event: t.event,
			relayUrls: t.relayUrls,
			sources: t.sources
		});
		return me(n.eventId, n.parentEventId), ye(n.authorPubkey, n.relayUrls), n;
	}
	function ve(e, t) {
		if (!e || !t) return;
		let n = !1, r = { ...B(T) };
		for (let [i, a] of Object.entries(B(T))) a.authorPubkey === e && (r[i] = Er(a, {
			...a,
			profile: t
		}), n = !0);
		n && k(T, r);
	}
	function ye(e, t = []) {
		ve(e, y.ensureProfile(e, t));
	}
	let be = y.subscribe((e, t) => {
		r() && (ve(e, t), le(e, t));
	});
	async function xe(e) {
		let t = np(e.relayUrls ?? []), n = pe({
			...e,
			relayUrls: t
		});
		return ye(e.event.pubkey, t), n;
	}
	function Se(e, t, n) {
		let r = zu.buildContext(e, t, n);
		return r ? zu.toDescriptor(r, w) : null;
	}
	function Ce(e) {
		if (!e) return null;
		let t = S.getTargetSnapshot(e.eventId);
		if (t?.status !== "resolved" || !t.event) return e;
		let n = np([...e.relayUrls, ...t.relayHints]), r = t.profile ?? e.profile ?? null;
		return e.event === t.event && e.profile === r && mt(e.relayUrls, n) ? e : Er(e, {
			...e,
			event: t.event,
			relayUrls: n,
			profile: r
		});
	}
	function we(e, t) {
		return zu.getRelayHints(e, t);
	}
	function G(e, t) {
		let n = ge(t.event);
		return np([
			...t.relayUrls,
			...n.relayHints,
			...e.relayHints,
			...e.acceptedRelays,
			...e.fetchedRelays ?? []
		]);
	}
	function Te(e, t) {
		return fe.sanitizeExternalRelayUrls([
			...t.flatMap((e) => {
				let t = ge(e.event);
				return [...e.relayUrls, ...t.relayHints];
			}),
			...e.relayHints,
			...e.acceptedRelays,
			...e.fetchedRelays ?? []
		], { limit: cp });
	}
	function K(e) {
		ee.clear(e);
	}
	function Ee(e, t) {
		let n = or(e, t);
		ee.schedule(n, () => {
			let n = H(e, t);
			n.loadingParent && n.visibleParent && U(e, t, (e) => ({
				...e,
				showParentLoadingIndicator: !0
			}));
		});
	}
	function De(e, t) {
		return (B(D)[e] ?? []).map((e) => Ce(B(T)[e])).filter((e) => !!e).filter((e) => !Me(e.authorPubkey, e.eventId)).map((e) => ({
			event: e.event,
			profile: e.profile,
			relayUrls: [...e.relayUrls],
			isOwnReply: e.authorPubkey === t
		}));
	}
	function Oe(e) {
		return (B(D)[e] ?? []).filter((e) => {
			let t = B(T)[e];
			return t && !Me(t.authorPubkey, t.eventId);
		});
	}
	function ke(e, t, n) {
		return Oe(e).filter((e) => !t.includes(e) && !n.has(e));
	}
	function Ae(e, t, n, r = [], i = 0, a = /* @__PURE__ */ new Set()) {
		let o = Ce(B(T)[t]);
		if (!o || Me(o.authorPubkey, o.eventId) || r.includes(t) || a.has(t)) return null;
		a.add(t);
		let s = [...r, t], c = H(e, t), l = o.parentEventId, u = l ? r.includes(l) : !1, d = l ? yp({
			childNode: o,
			parentNode: Ce(B(T)[l] ?? null)
		}) : null, f = c.visibleParent && d && !u && i > -20 ? Ae(e, d.eventId, n, s, i - 1, a) : null, p = i < ip ? ke(t, s, a) : [], m = p.length, h = c.visibleChildren && m > 0, g = h ? p.map((t) => Ae(e, t, n, s, i + 1, a)).filter((e) => e !== null) : [];
		return {
			relatedEventsStatus: B(ae)[t],
			anchorEventId: e,
			node: o,
			parentTargetId: l,
			parentNodeState: f,
			parentExpansion: c,
			parentAlreadyInPath: u,
			repliesActionState: {
				status: c.loadingChildren ? "loading" : c.childrenError ? "failed" : c.loadedChildren ? "loaded" : "unloaded",
				visible: h,
				replies: p,
				replyCount: m,
				error: c.childrenError
			},
			replyNodeStates: g,
			isOwnReply: o.authorPubkey === n,
			depthFromAnchor: i,
			cycleDetected: !1
		};
	}
	function je(e) {
		B(j);
		let t = Ce(B(T)[e.eventId]) ?? W(e), n = H(e.eventId, e.eventId), r = a() ?? e.pubkeyHex, i = /* @__PURE__ */ new Set([e.eventId]), o = t.parentEventId, s = o ? Ce(B(T)[o] ?? null) : null, c = s && !Me(s.authorPubkey, s.eventId) ? yp({
			childNode: t,
			parentNode: s
		}) : null, l = c && n.visibleParent ? Ae(e.eventId, c.eventId, r, [e.eventId], -1, i) : null, u = ke(e.eventId, [e.eventId], i), d = new Set(u), f = De(e.eventId, r).filter((e) => d.has(e.event.id)), p = u.length, m = n.visibleChildren && p > 0, h = m ? u.map((t) => Ae(e.eventId, t, r, [e.eventId], 1, i)).filter((e) => e !== null) : [];
		return {
			relatedEventsStatus: B(ae)[e.eventId],
			anchorEventId: e.eventId,
			parentTargetId: o,
			parentNode: c,
			parentNodeState: l,
			parentExpansion: n,
			repliesActionState: {
				status: n.loadingChildren ? "loading" : n.childrenError ? "failed" : n.loadedChildren ? "loaded" : "unloaded",
				visible: m,
				replies: f,
				replyCount: p,
				error: n.childrenError
			},
			reactionSummary: ue(e.eventId),
			reactionReadModel: de(e.eventId),
			replyItems: f,
			replyNodeStates: h
		};
	}
	function Me(e, t) {
		return !e || !t ? !1 : !!B(A)[e]?.[t];
	}
	function Ne(e) {
		let t = B(T)[e];
		return t ? Me(t.authorPubkey, e) : !1;
	}
	function q(e, t) {
		e && t && !Me(e, t) && k(A, {
			...B(A),
			[e]: {
				...B(A)[e] ?? {},
				[t]: !0
			}
		});
	}
	function J(e, t, n = {}) {
		let r = /* @__PURE__ */ new Set();
		for (let [n, i] of Object.entries(B(E))) {
			if (i !== e) continue;
			let a = B(T)[e];
			t && a && a.authorPubkey !== t || r.add(n);
		}
		if (r.size !== 0) for (let [e, t] of Object.entries(B(O))) {
			let i = e.indexOf(":");
			if (i < 0) continue;
			let a = e.slice(0, i), o = e.slice(i + 1);
			r.has(o) && (t?.loadedParent || t?.visibleParent) && U(a, o, (e) => Ff(e, {
				visibleParent: n.revealKnownParent ? !0 : e.visibleParent,
				parentDeleted: !0,
				lastFetchedParentAt: Date.now()
			}));
		}
	}
	function Pe(e, t = {}) {
		for (let [n, r] of e.entries()) for (let e of r) J(e, n, t);
	}
	function Fe(e) {
		let t = B(A), n = !1;
		for (let [r, i] of e.entries()) {
			let e = t[r] ?? {}, a = e;
			for (let e of i) a[e] || (a = {
				...a,
				[e]: !0
			}, n = !0);
			a !== e && (t = {
				...t,
				[r]: a
			});
		}
		n && (k(A, t), Pe(e));
	}
	function Ie(e) {
		let t = {}, n = !1;
		for (let [r, i] of Object.entries(B(D))) {
			let a = i.filter((t) => t !== e);
			t[r] = a, a.length !== i.length && (n = !0);
		}
		if (n && k(D, t), B(E)[e]) {
			let { [e]: t, ...n } = B(E);
			k(E, n);
		}
	}
	async function Le(e, t = {}) {
		if (!e?.id || Me(e.pubkey, e.id)) return !0;
		if (t.checkPostHistoryRepository === !1) return !1;
		try {
			if (typeof (await c.getByEventId(e.id))?.deletedAt == "number") return q(e.pubkey, e.id), Ie(e.id), !0;
		} catch {}
		return !1;
	}
	async function Re(e) {
		Fe(e);
		for (let t of e.values()) for (let e of t) Ie(e), await d.deleteChildInteractionByEventId(e);
	}
	async function ze(e) {
		await Re(await f.getDeletedTargets(e.map((e) => ({
			targetAuthorPubkey: e.pubkey,
			targetEventId: e.id
		}))));
	}
	async function Y(e, t, n, i = "default") {
		if (t.length === 0) return;
		let c = o();
		if (!c) return;
		let l = t.filter((e) => !Me(e.pubkey, e.id));
		if (l.length === 0) return;
		let u = `${e}:deletions:${i}`, d = a(), p = V.getRequestId(), m = () => r() && V.getRequestId() === p && a() === d && o() === c, h = d ? yt(We, d) : Promise.resolve(0), g = _.fetchDeletionRequests(c, {
			targets: l.map((e) => ({
				event: e,
				relayUrls: B(T)[e.id]?.relayUrls ?? []
			})),
			relayHints: n,
			relayConfig: s()
		});
		V.replaceDeletionFetchTask(u, g);
		try {
			let e = await g.promise;
			if (!m() || (await f.upsertValidDeletionRequests({
				targetEvents: l,
				deletionEvents: e.events,
				fetchedAt: e.fetchedAt
			}), !m())) return;
			d && e.events.length && sn.archiveAdoptedAuthored(l.map((e) => ({ event: e })), {
				ownerPubkeyHex: d,
				expectedRevision: await h,
				isActive: m
			});
		} catch {
			return;
		} finally {
			m() && V.deleteDeletionFetchTask(u);
		}
		m() && await ze(l);
	}
	async function Be(e) {
		await ze(e);
		let t = [];
		for (let n of e) await Le(n) ? await d.deleteChildInteractionByEventId(n.id) : t.push(n);
		return t;
	}
	async function X(e) {
		let t = await Be(e.map((e) => ur(e))), n = new Set(t.map((e) => e.id)), r = [];
		for (let t of e) n.has(t.eventId) && r.push(t);
		return r;
	}
	async function Ve(e) {
		let t = await Be(e.map((e) => e.event)), n = new Set(t.map((e) => e.id)), r = [];
		for (let t of e) n.has(t.event.id) && r.push(t);
		return r;
	}
	async function He(e) {
		return await ze([e.event]), !await Le(e.event, { checkPostHistoryRepository: e.checkPostHistoryRepository }) && (Y(e.anchorEventId, [e.event], e.relayHints), !0);
	}
	function Ue(e, t = e) {
		K(or(e, t)), U(e, t, (e) => ({ ...Ff(e, {
			visibleParent: !0,
			parentDeleted: !0,
			lastFetchedParentAt: Date.now()
		}) }));
	}
	function Ge(e, t) {
		K(or(e, t)), U(e, t, (e) => ({
			...e,
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
	async function Ke(e, t, n) {
		let i = n.parentEventId;
		if (!i) return !1;
		let o = S.getTargetSnapshot(i);
		if (o?.status === "deleted") return o.authorPubkey && (q(o.authorPubkey, i), J(i, o.authorPubkey, { revealKnownParent: !0 })), Ue(e.eventId, t), !0;
		let s = Ce(B(T)[i] ?? null);
		if (s) {
			let i = Gt({
				event: s.event,
				relayHints: s.relayUrls
			});
			if (!i || !Cn({
				child: n.event,
				parent: i
			}).valid) return Ge(e.eventId, t), !1;
			let c = np([...s.relayUrls, ...we(e, n)]), l = await He({
				anchorEventId: e.eventId,
				event: s.event,
				relayHints: c,
				checkPostHistoryRepository: s.authorPubkey === a()
			});
			return r() ? l ? (U(e.eventId, t, (e) => ({ ...Ff(e, {
				parentDeleted: e.parentDeleted,
				lastFetchedParentAt: o?.updatedAt ?? e.lastFetchedParentAt
			}) })), !0) : (Ue(e.eventId, t), !0) : !1;
		}
		if (!o) return !1;
		if (o.authorPubkey && Me(o.authorPubkey, i)) return Ue(e.eventId, t), !0;
		if (o.status === "resolved" && o.event) {
			let r = Gt({
				event: o.event,
				relayHints: o.relayHints
			});
			if (!r || !Cn({
				child: n.event,
				parent: r
			}).valid) return Ge(e.eventId, t), !1;
			let i = pe({
				event: o.event,
				relayUrls: o.relayHints,
				sources: ["fetched-parent"],
				profile: o.profile
			});
			return me(i.eventId, i.parentEventId), U(e.eventId, t, (e) => ({ ...Ff(e, {
				parentDeleted: !1,
				lastFetchedParentAt: o.updatedAt ?? e.lastFetchedParentAt
			}) })), !0;
		}
		return o.status === "not-found" && (U(e.eventId, t, (e) => ({ ...Ff(e, {
			parentMissing: !0,
			parentDeleted: !1,
			lastFetchedParentAt: o.updatedAt ?? e.lastFetchedParentAt
		}) })), !0);
	}
	async function qe(e, t, n, i = {}) {
		let a = n.parentEventId;
		if (!a) return;
		let o = V.incrementRequestId(), s = or(e.eventId, t);
		U(e.eventId, t, (e) => ({ ...Pf(e, { showInitialLoading: !!i.showInitialLoading }) })), i.showInitialLoading && Ee(e.eventId, t), await Xf({
			isActive: () => o === V.getRequestId() && r(),
			cleanup: () => {
				K(s);
			},
			onError: () => {
				Uf({
					updateExpansion: (n) => U(e.eventId, t, n),
					showInitialLoading: !!i.showInitialLoading,
					errorCode: "fetch_failed"
				});
			},
			run: async ({ ensureActive: r }) => {
				let o = Se(e, t, n);
				if (!o) return;
				let c = await S.ensureTarget(o, {
					force: !0,
					background: !i.showInitialLoading
				});
				if (!(!r() || (K(s), !c))) {
					if (c.status === "resolved" && c.event) {
						let r = Gt({
							event: c.event,
							relayHints: c.relayHints
						});
						if (!r || !Cn({
							child: n.event,
							parent: r
						}).valid) {
							Ge(e.eventId, t);
							return;
						}
					}
					await Qf({
						status: zf(c),
						strategies: Vf({
							snapshot: c,
							parentEventId: a,
							showInitialLoading: !!i.showInitialLoading,
							updateExpansion: (n) => {
								U(e.eventId, t, n);
							},
							hideEvent: q,
							markParentDeletedForEvent: J,
							setParentDeleted: () => {
								Ue(e.eventId, t);
							},
							isDeletedEvent: Me,
							upsertNode: () => pe({
								event: c.event,
								relayUrls: c.relayHints,
								sources: ["fetched-parent"],
								profile: c.profile
							}),
							upsertParentEdge: me
						})
					});
				}
			}
		});
	}
	async function Je(e, t, n = {}) {
		let r = t === e.eventId ? _e(e) : B(T)[t];
		if (!r?.parentEventId) return;
		let i = H(e.eventId, t);
		await tp({
			loading: i.loadingParent,
			revalidating: i.revalidatingParent,
			onInFlight: () => {
				U(e.eventId, t, (e) => ({
					...e,
					visibleParent: !0,
					showParentLoadingIndicator: !1
				}));
			},
			onLoadingInFlight: () => {
				Ee(e.eventId, t);
			},
			shouldHandleLoadedState: !n.force && i.loadedParent,
			handleLoadedState: async () => i.parentDeleted ? (Ue(e.eventId, t), !0) : (U(e.eventId, t, (e) => ({
				...e,
				visibleParent: !0,
				showParentLoadingIndicator: !1
			})), Yf({
				hasVisibleData: await Ke(e, t, r),
				lastFetchedAt: i.lastFetchedParentAt,
				ttlMs: hp
			}) && qe(e, t, r), !0),
			prepareFreshLoadState: () => {
				U(e.eventId, t, (e) => ({
					...e,
					visibleParent: !0,
					loadingParent: !0,
					parentError: null,
					parentMissing: !1,
					parentDeleted: !1,
					showParentLoadingIndicator: !1
				})), Ee(e.eventId, t);
			},
			displayCachedForFreshLoad: async () => ({
				displayedCached: await Ke(e, t, r),
				lastFetchedAt: H(e.eventId, t).lastFetchedParentAt
			}),
			force: !!n.force,
			ttlMs: hp,
			awaitWhenInitialLoading: !0,
			runRevalidate: ({ showInitialLoading: n }) => qe(e, t, r, { showInitialLoading: n })
		});
	}
	async function Ye(e, t = {}) {
		await Je(e, e.eventId, t);
	}
	function Ze(e) {
		Qe(e.eventId, e.eventId);
	}
	function Qe(e, t) {
		K(or(e, t)), U(e, t, (e) => ({
			...e,
			visibleParent: !1,
			showParentLoadingIndicator: !1
		}));
	}
	async function $e(e) {
		H(e.eventId, e.eventId).visibleParent ? Ze(e) : await Ye(e);
	}
	function et(e) {
		Ye(e, { force: !0 });
	}
	async function tt(e, t) {
		H(e.eventId, t).visibleParent ? Qe(e.eventId, t) : await Je(e, t);
	}
	function nt(e, t) {
		Je(e, t, { force: !0 });
	}
	function rt(e) {
		let t = e.map((e) => e.fetchedAt).filter((e) => Number.isFinite(e));
		return t.length > 0 ? Math.max(...t) : null;
	}
	async function it(e) {
		try {
			return {
				metadata: await p.get(e),
				readFailed: !1
			};
		} catch {
			return {
				metadata: null,
				readFailed: !0
			};
		}
	}
	async function at(e, t) {
		let { metadata: n, readFailed: r } = await it(e);
		return r ? null : n ? n.completeness === "complete" ? n.fetchedAt : null : rt(t);
	}
	async function ot(e, t, n, i = {}) {
		let a = await l.getDirectReplyRecords(t);
		Y(e.eventId, a.map((e) => ur(e)), G(e, n));
		let o = await X(a);
		if (!r() || o.length === 0) return !1;
		let s = await Mt(n, o, ["reply-db"], { resolveProfiles: !i.prefetchOnly });
		if (!r() || s.length === 0) return !1;
		if (!r()) return !0;
		let c = await at(t, s);
		return r() && U(e.eventId, t, (e) => ({ ...Lf(e, {
			visibleChildren: !i.prefetchOnly || e.visibleChildren,
			lastFetchedChildrenAt: c
		}) })), !0;
	}
	async function st(e, t, n, i = {}) {
		let a = or(e.eventId, t), c = V.getRequestId(), u = V.createChildRequestToken(a), f = Date.now();
		U(e.eventId, t, (e) => ({ ...If(e, {
			showInitialLoading: !!i.showInitialLoading,
			prefetchOnly: !!i.prefetchOnly
		}) })), await Xf({
			isActive: () => c === V.getRequestId() && V.getChildRequestToken(a) === u && r(),
			cleanup: () => {
				V.deleteChildrenFetchTask(a), V.deleteChildRequestToken(a), pt(e.eventId, t);
			},
			onError: fp({
				updateExpansion: (n) => U(e.eventId, t, n),
				showInitialLoading: !!i.showInitialLoading,
				prefetchOnly: !!i.prefetchOnly
			}),
			run: async ({ ensureActive: r }) => {
				if (!r()) return;
				let c = o();
				if (!c) {
					U(e.eventId, t, (e) => ({ ...Rf(e, { nextError: i.showInitialLoading && !i.prefetchOnly ? "nostr_not_ready" : null }) }));
					return;
				}
				let u = ut(We), m = g.fetchDirectReplies(c, {
					eventId: t,
					createdAt: n.event.created_at,
					relayHints: G(e, n),
					parents: [Gt({
						event: n.event,
						relayHints: G(e, n)
					})].filter((e) => e !== null),
					relayConfig: s()
				});
				V.replaceChildrenFetchTask(a, m);
				let h = await m.promise;
				if (V.deleteChildrenFetchTask(a), !r()) return;
				dp(h.status), Y(e.eventId, h.events.map((e) => e.event), [...G(e, n), ...h.relayUrls]);
				let _ = await Ve(h.events);
				h.events.length > 0 && await d.upsertChildInteractions({
					parentEventId: t,
					events: _,
					fetchedAt: h.status === "partial" ? null : h.fetchedAt,
					expectedChildGeneration: await u
				});
				let v = mp(await p.save({
					parentEventId: t,
					completeness: pp(h.status),
					fetchedAt: h.fetchedAt,
					requestStartedAt: f
				})), y = await X(await l.getDirectReplyRecords(t));
				r() && (y.length > 0 && await Mt(n, y, ["reply-db", "fetched-child"], { resolveProfiles: !i.prefetchOnly }), await Qf({
					status: Bf({
						nextRecordsLength: y.length,
						resultEventsLength: h.events.length
					}),
					strategies: Hf({
						fetchedAt: v,
						prefetchOnly: !!i.prefetchOnly,
						updateExpansion: (n) => {
							U(e.eventId, t, n);
						},
						prefetchChildReplyCounts: () => {
							wt(e, t);
						}
					})
				}), Ot({
					anchorEventId: e.eventId,
					nodeEventId: t,
					effectiveFetchedAt: v,
					replyCount: y.length
				}));
			}
		});
	}
	function ct(e, t) {
		te.add(or(e, t));
	}
	function lt(e, t) {
		te.delete(or(e, t));
	}
	function dt(e, t) {
		return te.has(or(e, t));
	}
	function ft(e, t) {
		ne.add(or(e, t));
	}
	function pt(e, t) {
		ne.delete(or(e, t));
	}
	function gt(e, t) {
		return ne.has(or(e, t));
	}
	function _t(e) {
		for (let t of ne) t.endsWith(`:${e}`) && ne.delete(t);
	}
	function vt(e, t) {
		if (!gt(e.eventId, t)) return;
		let n = or(e.eventId, t);
		if (V.getChildRequestToken(n) !== void 0) return;
		let i = H(e.eventId, t);
		pt(e.eventId, t), r() && i.visibleChildren && St(e, t, { force: !0 });
	}
	function bt(e, t, n) {
		let r = or(e.eventId, t);
		return V.getChildRequestToken(r) === void 0 && !dt(e.eventId, t) ? !1 : (n || (ft(e.eventId, t), U(e.eventId, t, (e) => ({
			...e,
			visibleChildren: !0
		}))), !0);
	}
	function xt(e, t) {
		return t === e.eventId ? _e(e) : B(T)[t];
	}
	async function St(e, t, n = {}) {
		let r = xt(e, t);
		if (!r || bt(e, t, !!n.prefetchOnly)) return;
		let i = H(e.eventId, t);
		await tp({
			loading: i.loadingChildren,
			revalidating: i.revalidatingChildren,
			onInFlight: n.prefetchOnly ? () => void 0 : () => {
				U(e.eventId, t, (e) => ({
					...e,
					visibleChildren: !0
				}));
			},
			shouldHandleLoadedState: !n.force && i.loadedChildren,
			handleLoadedState: async () => {
				if (n.prefetchOnly) return !0;
				let a = Oe(t).length > 0;
				return U(e.eventId, t, (e) => ({
					...e,
					visibleChildren: a
				})), a && wt(e, t), Yf({
					hasVisibleData: !0,
					lastFetchedAt: i.lastFetchedChildrenAt,
					ttlMs: hp
				}) && st(e, t, r), !0;
			},
			prepareFreshLoadState: () => void 0,
			displayCachedForFreshLoad: async () => ({
				displayedCached: await ot(e, t, r, n),
				lastFetchedAt: H(e.eventId, t).lastFetchedChildrenAt
			}),
			force: !!n.force,
			ttlMs: hp,
			prefetchOnly: !!n.prefetchOnly,
			awaitWhenInitialLoading: !1,
			onSkipPrefetchReplyCounts: () => {
				wt(e, t);
			},
			runRevalidate: ({ showInitialLoading: i }) => st(e, t, r, {
				prefetchOnly: n.prefetchOnly,
				showInitialLoading: i
			})
		});
	}
	async function Ct(e, t = {}) {
		await St(e, e.eventId, t);
	}
	async function wt(e, t) {
		let n = or(e.eventId, t);
		if (!N.has(n)) {
			N.add(n);
			try {
				await Tt(e, t);
			} finally {
				N.delete(n);
			}
		}
	}
	async function Tt(e, t) {
		let n = Date.now(), i = V.getRequestId(), a = Oe(t).filter((t) => {
			let r = H(e.eventId, t), i = typeof r.lastFetchedChildrenAt == "number" && n - r.lastFetchedChildrenAt < lp;
			return !r.loadedChildren && !r.loadingChildren && !r.revalidatingChildren && !i;
		});
		if (a.length === 0) return;
		for (let t of a) ct(e.eventId, t);
		let o = [];
		if (await Promise.all(a.map(async (t) => {
			try {
				if (!r()) {
					lt(e.eventId, t);
					return;
				}
				let n = await Et(e, t), a = H(e.eventId, t), s = typeof a.lastFetchedChildrenAt == "number" && Date.now() - a.lastFetchedChildrenAt < lp, c = !n || a.lastFetchedChildrenAt === null;
				c && i === V.getRequestId() && r() && dt(e.eventId, t) && V.getChildRequestToken(or(e.eventId, t)) === void 0 && !a.loadingChildren && !a.revalidatingChildren && (!a.loadedChildren || a.lastFetchedChildrenAt === null) && !s ? o.push(t) : (lt(e.eventId, t), c ? vt(e, t) : pt(e.eventId, t));
			} catch {
				lt(e.eventId, t), vt(e, t);
			}
		})), o.sort((t, n) => Number(gt(e.eventId, n)) - Number(gt(e.eventId, t))), o.splice(ap).forEach((t) => {
			lt(e.eventId, t), vt(e, t);
		}), !r() || o.length === 0) {
			o.forEach((t) => {
				lt(e.eventId, t), vt(e, t);
			});
			return;
		}
		let s = [];
		for (let e = 0; e < o.length; e += sp) s.push(o.slice(e, e + sp));
		let c = 0, l = Math.min(op, s.length), u = async () => {
			for (; r();) {
				let t = c;
				c += 1;
				let n = s[t];
				if (!n) return;
				await jt(e, n);
			}
		};
		try {
			await Promise.all(Array.from({ length: l }, () => u()));
		} finally {
			a.forEach((t) => lt(e.eventId, t));
		}
	}
	async function Et(e, t) {
		let n = await l.getDirectReplyRecords(t), { metadata: i, readFailed: a } = await it(t);
		if (!r()) return !1;
		let o = await X(n), s = B(T)[t];
		if (!r() || !s || o.length === 0 && !i) return !1;
		let c = await Mt(s, o, ["reply-db"], { resolveProfiles: !1 });
		if (!r() || c.length === 0 && !i) return !1;
		let u = a ? null : i ? i.completeness === "complete" ? i.fetchedAt : null : rt(c);
		return r() && U(e.eventId, t, (e) => ({ ...Lf(e, { lastFetchedChildrenAt: u }) })), !0;
	}
	function Dt(e, t) {
		let n = new Set(t), r = /* @__PURE__ */ new Map();
		for (let t of e) {
			if (!n.has(t.parentEventId)) continue;
			let e = r.get(t.parentEventId) ?? [];
			e.push(t), r.set(t.parentEventId, e);
		}
		for (let e of r.values()) e.sort((e, t) => e.createdAt === t.createdAt ? e.eventId.localeCompare(t.eventId) : e.createdAt - t.createdAt);
		return r;
	}
	function Ot(e) {
		return e.effectiveFetchedAt !== null || e.replyCount > 0 ? !1 : (U(e.anchorEventId, e.nodeEventId, (e) => ({
			...e,
			loadedChildren: !1,
			loadingChildren: !1,
			revalidatingChildren: !1,
			childrenError: null,
			lastFetchedChildrenAt: null
		})), !0);
	}
	function kt(e) {
		let t = { ...B(T) }, n = { ...B(E) }, r = { ...B(D) }, i = { ...B(O) }, a = { ...B(P) }, o = { ...B(I) }, s = { ...B(L) }, c = { ...B(R) }, l = !1, u = !1, d = !1, f = !1, p = /* @__PURE__ */ new Map(), m = (e) => {
			let n = Er(t[e.eventId], e);
			return t[n.eventId] = n, l = !0, n;
		}, h = (e, t) => {
			t && (n[e] = t, u = !0);
		};
		for (let t of e.targetParentIds) {
			let n = e.anchorNodesByParentId.get(t);
			if (!n) continue;
			let r = m(n);
			h(r.eventId, r.parentEventId);
			let i = e.reactionRecordsByParentId.get(t) ?? [];
			a[t] = jf(i), o[t] = i;
		}
		for (let [t, n] of Object.entries(e.cachedReactionProfilesByPubkey)) s[t] = n;
		for (let t of e.targetParentIds) {
			if (!e.anchorNodesByParentId.get(t)) continue;
			let n = [], r = [];
			for (let i of e.directReplyRecordsByParentId.get(t) ?? []) {
				let e = ur(i);
				if (Me(e.pubkey, e.id)) continue;
				let a = m(dr({
					event: e,
					relayUrls: np(i.relayUrls),
					sources: ["reply-db", "inbound-sync"]
				}));
				a.eventId !== t && (h(a.eventId, t), r.push(a.eventId), n.push(i));
			}
			p.set(t, r);
			let a = e.metadataByParentId.get(t) ?? null, o = e.metadataReadFailedParentIds.has(t);
			if (n.length === 0 && !a) continue;
			let s = e.postsByParentId.get(t);
			if (!s) continue;
			let c = or(s.eventId, t), l = i[c] ?? ar();
			i[c] = a?.completeness === "partial" && n.length === 0 ? {
				...l,
				loadedChildren: !1,
				loadingChildren: !1,
				revalidatingChildren: !1,
				childrenError: null,
				lastFetchedChildrenAt: null
			} : Lf(l, { lastFetchedChildrenAt: o ? null : a ? mp(a) : rt(n) }), f = !0;
		}
		for (let [e, n] of p) {
			let i = r[e] ?? [];
			r[e] = Tr(rp([...i, ...n]).filter((t) => t !== e && !Ne(t)), t), d = !0;
		}
		for (let [n, r] of e.knownNodeProfilesByPubkey) if (r) for (let [e, i] of Object.entries(t)) i.authorPubkey === n && (t[e] = Er(i, {
			...i,
			profile: r
		}), l = !0);
		for (let t of e.targetParentIds) c[t] = Cr(o[t] ?? [], s);
		l && k(T, t), u && k(E, n), d && k(D, r), f && k(O, i), k(P, a), k(I, o), k(L, s), k(R, c);
	}
	async function At(e, t, n = () => !0) {
		if (!r() || e.length === 0) return;
		let i = _p(e, t);
		if (i.length === 0) return;
		let a = V.getRequestId(), o = !!t?.length, s = new Map(e.map((e) => [e.eventId, e]));
		await Zf({
			items: i,
			isActive: () => a === V.getRequestId() && r() && n(),
			run: async ({ ensureActive: e }) => {
				let t = i.flatMap((t) => {
					let n = s.get(t);
					if (!n || !e()) return [];
					let r = or(n.eventId, t), i = H(n.eventId, t);
					return !o && (M.has(r) || i.loadedChildren || i.loadingChildren || i.revalidatingChildren) ? (M.add(r), []) : (M.add(r), [{
						parentEventId: t,
						post: n
					}]);
				});
				if (t.length === 0 || !e()) return;
				let n = t.map(({ parentEventId: e }) => e), r = d.getChildInteractionsForParents ? await d.getChildInteractionsForParents(n) : (await Promise.all(n.map(async (e) => {
					let [t, n] = await Promise.all([Sr(e, u), l.getDirectReplyRecords(e)]);
					return [...t, ...n];
				}))).flat();
				if (!e()) return;
				let a = [], c = /* @__PURE__ */ new Set();
				try {
					a = p.getForParentEventIds ? await p.getForParentEventIds(n) : (await Promise.all(n.map((e) => it(e)))).flatMap(({ metadata: e, readFailed: t }, r) => t ? (c.add(n[r]), []) : e ? [e] : []);
				} catch {
					for (let e of n) c.add(e);
				}
				if (!e()) return;
				let f = Dt(await X(r), n);
				if (!e()) return;
				let m = new Map(t.map(({ parentEventId: e, post: t }) => [e, W(t)])), h = /* @__PURE__ */ new Map(), g = /* @__PURE__ */ new Map(), _ = [], v = /* @__PURE__ */ new Set(), b = /* @__PURE__ */ new Map(), x = (e, t) => {
					b.set(e, np([...b.get(e) ?? [], ...t]));
				};
				for (let e of n) {
					let t = m.get(e);
					if (!t) continue;
					x(t.authorPubkey, t.relayUrls);
					let n = [], r = [];
					for (let i of f.get(e) ?? []) i.kind === 7 ? (n.push(i), i.authorPubkey && (v.add(i.authorPubkey), x(i.authorPubkey, t.relayUrls))) : [
						1,
						42,
						1111
					].includes(i.kind) && (vp({
						parentNode: t,
						record: i
					}) ? (r.push(i), x(i.authorPubkey, i.relayUrls)) : _.push(i.eventId));
					h.set(e, n), g.set(e, r);
				}
				if (_.length > 0 && (await Promise.all(_.map((e) => d.deleteChildInteractionByEventId(e))), !e())) return;
				let S = v.size > 0 ? await Kt.getProfiles(Array.from(v), { allowBackgroundRefresh: !1 }) : {};
				if (!e()) return;
				let C = /* @__PURE__ */ new Map();
				for (let [e, t] of b) C.set(e, y.ensureProfile(e, t));
				kt({
					postsByParentId: s,
					targetParentIds: n,
					anchorNodesByParentId: m,
					reactionRecordsByParentId: h,
					directReplyRecordsByParentId: g,
					metadataByParentId: new Map(a.map((e) => [e.parentEventId, e])),
					metadataReadFailedParentIds: c,
					cachedReactionProfilesByPubkey: S,
					knownNodeProfilesByPubkey: C
				});
			}
		});
	}
	async function jt(e, t) {
		let n = t.map((e) => B(T)[e]).filter((e) => !!e);
		if (n.length === 0) return;
		let i = V.getRequestId(), a = Date.now(), c = /* @__PURE__ */ new Map(), u = /* @__PURE__ */ new Map(), f = !1, m = !1, h = `${e.eventId}:children-prefetch:${t.join(",")}`, _ = () => f || i !== V.getRequestId() || !r() ? !1 : t.every((t) => dt(e.eventId, t) && V.getChildRequestToken(or(e.eventId, t)) === c.get(t)), v = (n) => {
			for (let r of t) Wf({
				updateExpansion: (t) => U(e.eventId, r, t),
				showInitialLoading: !1,
				prefetchOnly: !0,
				errorCode: n
			});
		};
		await Zf({
			items: t,
			isActive: _,
			prepareItem: (t) => {
				let n = or(e.eventId, t), r = V.createChildRequestToken(n);
				return c.set(t, r), U(e.eventId, t, (e) => ({ ...If(e, {
					showInitialLoading: !1,
					prefetchOnly: !0
				}) })), r;
			},
			completeBatch: (n) => {
				if (n && _()) for (let r of t) U(e.eventId, r, (e) => ({ ...Lf(e, {
					loadedChildren: n && ((u.get(r) ?? null) !== null || Oe(r).length > 0),
					revalidatingChildren: !1,
					lastFetchedChildrenAt: u.get(r) ?? null
				}) }));
			},
			cleanupItem: (t, n) => {
				let r = or(e.eventId, t);
				V.getChildRequestToken(r) === n && V.deleteChildRequestToken(r), lt(e.eventId, t), m || f ? pt(e.eventId, t) : vt(e, t);
			},
			cleanup: () => {
				V.deleteChildrenFetchTask(h);
			},
			onError: () => {
				v("fetch_failed");
			},
			run: async ({ ensureActive: r }) => {
				if (!r()) return;
				let i = o();
				if (!i) {
					v("nostr_not_ready");
					return;
				}
				let c = ut(We), _ = Te(e, n), y = g.fetchDirectReplies(i, {
					eventId: t[0] ?? "",
					eventIds: t,
					createdAt: Math.min(...n.map((e) => e.event.created_at)),
					relayHints: _,
					parents: n.map((e) => Gt({
						event: e.event,
						relayHints: [...e.relayUrls, ...ge(e.event).relayHints]
					})).filter((e) => e !== null),
					relayConfig: s()
				});
				V.replaceChildrenFetchTask(h, y);
				let b = await y.promise;
				if (V.deleteChildrenFetchTask(h), !r()) return;
				if (b.status === "cancelled") {
					f = !0;
					for (let n of t) U(e.eventId, n, (e) => ({ ...Rf(e, { nextError: e.childrenError }) }));
					return;
				}
				dp(b.status);
				let x = new Set(t), S = b.events.filter((e) => x.has(e.parentEventId) && e.event.id !== e.parentEventId);
				S.length > 0 && await Y(e.eventId, S.map((e) => e.event), [..._, ...b.relayUrls], `children-prefetch:${t.join(",")}`);
				let C = await Ve(S);
				if (!r()) return;
				let w = /* @__PURE__ */ new Map(), E = new Map(S.map((e) => [e.event.id, e.parentEventId]));
				for (let e of C) {
					let t = E.get(e.event.id);
					if (!t || !x.has(t)) continue;
					let n = w.get(t) ?? [];
					n.push(e), w.set(t, n);
				}
				for (let e of t) {
					let t = w.get(e) ?? [];
					if (t.length > 0 && await d.upsertChildInteractions({
						parentEventId: e,
						events: t,
						fetchedAt: b.status === "partial" ? null : b.fetchedAt,
						expectedChildGeneration: await c
					}), !r()) return;
					let n = await p.save({
						parentEventId: e,
						completeness: pp(b.status),
						fetchedAt: b.fetchedAt,
						requestStartedAt: a
					});
					u.set(e, mp(n));
					let i = await X(await l.getDirectReplyRecords(e)), o = B(T)[e];
					o && await Mt(o, i, ["reply-db", "fetched-child"], { resolveProfiles: !1 });
				}
				r() && (m = !0);
			}
		});
	}
	async function Mt(e, t, n, r = {}) {
		let i = e.eventId, a = [], o = [], s = r.resolveProfiles !== !1;
		for (let r of t) {
			let t = ur(r);
			if (!vp({
				parentNode: e,
				record: r
			})) {
				await d.deleteChildInteractionByEventId(r.eventId);
				continue;
			}
			if (Me(t.pubkey, t.id)) continue;
			let c = s ? await xe({
				event: t,
				relayUrls: r.relayUrls,
				sources: n
			}) : pe({
				event: t,
				relayUrls: np(r.relayUrls),
				sources: n
			});
			s || ye(t.pubkey, np(r.relayUrls)), c.eventId !== i && (me(c.eventId, i), a.push(c.eventId), o.push(r));
		}
		return he(i, a), o;
	}
	function Nt(e) {
		Q(e.eventId, e.eventId);
	}
	function Q(e, t) {
		pt(e, t), U(e, t, (e) => ({
			...e,
			visibleChildren: !1
		}));
	}
	function Pt(e) {
		H(e.eventId, e.eventId).visibleChildren ? Nt(e) : Ct(e);
	}
	function Ft(e) {
		Ct(e, { force: !0 });
	}
	function It(e, t) {
		H(e.eventId, t).visibleChildren ? Q(e.eventId, t) : St(e, t);
	}
	function Lt(e, t) {
		St(e, t, { force: !0 });
	}
	async function Rt(e, t = []) {
		if (!e?.id || ![
			1,
			42,
			1111
		].includes(e.kind)) return !0;
		let n = ge(e), i = n.parentId;
		if (!i) return !0;
		let a = t.find((e) => e.eventId === i) ?? null, o = Object.keys(B(O)).filter((e) => e.endsWith(`:${i}`));
		if (!a && o.length === 0) return !1;
		let s = S.getTargetSnapshot(i), c = a ? B(T)[i] ?? dr({
			event: lr(a),
			relayUrls: np([
				...a.relayHints,
				...a.acceptedRelays,
				...a.fetchedRelays ?? []
			]),
			sources: ["history-record"]
		}) : B(T)[i] ?? (s?.status === "resolved" && s.event ? dr({
			event: s.event,
			relayUrls: s.relayHints,
			sources: ["fetched-parent"]
		}) : null);
		if (!c) return !1;
		let u = Gt({
			event: c.event,
			relayHints: c.relayUrls
		});
		if (!u || !Cn({
			child: e,
			parent: u
		}).valid) return !1;
		let f = await ut(We);
		if ((await Be([e])).length === 0) return !1;
		await d.upsertChildInteractions({
			parentEventId: i,
			expectedChildGeneration: f,
			events: [{
				event: e,
				relayUrls: n.relayHints
			}]
		});
		let p = await X(await l.getDirectReplyRecords(i));
		if (!r()) return !1;
		await Mt(c, p, ["reply-db", "posted-reply"]);
		let m = (e, t) => {
			U(e, t, (e) => ({
				...e,
				loadedChildren: !0,
				loadingChildren: !1,
				childrenError: null
			}));
		};
		a && m(a.eventId, a.eventId);
		for (let e of o) {
			let t = e.indexOf(":");
			t < 0 || m(e.slice(0, t), e.slice(t + 1));
		}
		return !0;
	}
	async function zt(e) {
		e.eventId && e.authorPubkey && (_t(e.eventId), q(e.authorPubkey, e.eventId), Ie(e.eventId), J(e.eventId, e.authorPubkey, { revealKnownParent: !0 }), e.deletionEvent && await f.upsertValidDeletionRequests({
			targetEvents: [{
				id: e.eventId,
				pubkey: e.authorPubkey,
				kind: 1,
				content: "",
				tags: [],
				created_at: e.deletionEvent.created_at,
				sig: ""
			}],
			deletionEvents: [{
				event: e.deletionEvent,
				...e.deletionEventAttestation ? { attestation: e.deletionEventAttestation } : {}
			}],
			fetchedAt: Date.now()
		}), await d.deleteChildInteractionByEventId(e.eventId));
	}
	z(() => {
		r() && k(j, S.getScopeRevision(w), !0);
	}), z(() => {
		if (r()) {
			B(j);
			for (let e of Object.keys(B(O))) {
				let [t, n] = e.split(":"), r = B(T)[n]?.parentEventId;
				if (!r) continue;
				let i = S.getTargetSnapshot(r);
				i?.status === "deleted" && (H(t, n).parentDeleted || (i.authorPubkey && (q(i.authorPubkey, r), J(r, i.authorPubkey, { revealKnownParent: !0 })), Ue(t, n)));
			}
		}
	});
	function Bt() {
		oe.forEach((e) => e.cancel()), oe.clear(), k(ae, {}, !0), V.incrementRequestId(), S.invalidateScope(w), V.cancelAndClearFetchTasks(), V.clearChildRequestTokens(), te.clear(), ne.clear(), x && y.reset(), ee.clearAll(), k(O, Object.fromEntries(Object.entries(B(O)).map(([e, t]) => [e, {
			...t,
			loadingParent: !1,
			loadingChildren: !1,
			revalidatingParent: !1,
			revalidatingChildren: !1,
			showParentLoadingIndicator: !1
		}])));
	}
	z(() => (a(), o(), () => {
		oe.forEach((e) => e.cancel()), oe.clear(), k(ae, {}, !0);
	}));
	function Vt() {
		Bt(), C && S.reset(), V.incrementRequestId(), k(T, {}), k(E, {}), k(D, {}), k(O, {}), k(A, {}), k(P, {}), k(I, {}), k(L, {}), M.clear(), N.clear();
	}
	return z(() => {
		i() || re(Vt);
	}), z(() => {
		if (r()) return () => {
			Bt();
		};
	}), ie(() => {
		S.invalidateScope(w), Bt(), be(), C && S.reset(), x && y.dispose();
	}), {
		getAnchorState: je,
		refreshRelatedEvents: se,
		toggleParent: $e,
		retryParent: et,
		toggleNodeParent: tt,
		retryNodeParent: nt,
		toggleChildren: Pt,
		retryChildren: Ft,
		toggleNodeChildren: It,
		retryNodeChildren: Lt,
		recordPostedReply: Rt,
		recordDeletedEvent: zt,
		loadCachedChildInteractionStateForPosts: At,
		cancelCurrentGraphFetches: Bt,
		resetState: Vt
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/hooks/usePostHistoryInboundInteractionsSync.svelte.ts
function xp(e) {
	return !!e && typeof e.use == "function";
}
function Sp({ getShow: e, getPubkeyHex: t, getRxNostr: n, getRelayConfig: r, getPosts: i, onSavedInboundInteractions: a = () => void 0, reconcileDirectReplyCandidates: o }) {
	let s = F({
		status: "idle",
		activePubkeyHex: null,
		hasStartedInitialDialogBootstrap: !1
	}), c = null, l = 0;
	function u() {
		l += 1, c?.cancel(), c = null, s.status = "idle";
	}
	async function d(d) {
		let f = t(), p = n(), m = l, h = () => e() && m === l && t() === f && n() === p;
		if (!e() || !f || !xp(p) || i().length === 0) return;
		if (d === "dialog-open-refresh") {
			let e = await Gn.get(f);
			if (typeof e?.lastDialogRefreshAt == "number" && Date.now() - e.lastDialogRefreshAt < 6e4) return;
		}
		if (!h()) return;
		u();
		let g = ++l;
		s.status = "syncing";
		let _ = d === "dialog-open-refresh" ? Wn.runInbound(p, {
			ownerPubkeyHex: f,
			relayConfig: r(),
			reason: d,
			reconcileDirectReplyCandidates: o
		}) : {
			...tr.syncRecent(p, {
				ownerPubkeyHex: f,
				relayConfig: r(),
				reason: d,
				reconcileDirectReplyCandidates: o
			}),
			joinedExisting: !1
		};
		c = _;
		let v = await _.promise;
		g === l && c === _ && e() && t() === f && (c = null, s.status = "idle", !(_.joinedExisting || v.status === "cancelled" || v.changedParentEventIds.length === 0) && (await a(v.changedParentEventIds), g === l && e() && t() === f && n() === p && Un({
			source: "dialog-inbound-sync",
			parentEventIds: v.changedParentEventIds,
			rxNostr: p,
			relayConfig: r(),
			isActive: () => e() && g === l && t() === f && n() === p
		}).then((r) => {
			if (!(r.status === "cancelled" || r.deletedReactionEventIds.length === 0 && r.deletedReplyEventIds.length === 0 || g !== l || !e() || t() !== f || n() !== p)) return Promise.resolve(a(v.changedParentEventIds)).catch(() => void 0);
		}).catch(() => void 0)));
	}
	async function f() {
		let r = t();
		if (!r) return;
		let i = l, a = n(), o = await Gn.get(r);
		i === l && e() && t() === r && n() === a && await d(o?.lastSyncedAt ? "dialog-open-refresh" : "initial-dialog-bootstrap");
	}
	return z(() => {
		let e = t() ?? null;
		e !== s.activePubkeyHex && (u(), s.activePubkeyHex = e, s.hasStartedInitialDialogBootstrap = !1);
	}), z(() => {
		e() ? t() && xp(n()) && i().length !== 0 && (s.hasStartedInitialDialogBootstrap || (s.hasStartedInitialDialogBootstrap = !0, f())) : (u(), s.hasStartedInitialDialogBootstrap = !1);
	}), {
		state: s,
		cancelCurrentSync: u,
		runSync: d
	};
}
var Cp = {
	status: "valid",
	ruleVersion: 1
}, wp = {
	status: "invalid",
	ruleVersion: 1
};
function Tp(e) {
	return e?.ruleVersion === 1 && (e.status === "valid" || e.status === "invalid");
}
function Ep(e) {
	return e?.status === "valid" && e.ruleVersion === 1;
}
function Dp(e) {
	if (_e(e)) try {
		return `nostr:${Dt(e)}\u0000${e.id}\u0000${e.sig}`;
	} catch {}
	try {
		return `raw:${JSON.stringify(e)}`;
	} catch {
		return "raw:unserializable";
	}
}
function Op(e) {
	if (!_e(e)) return { ...wp };
	try {
		let t = W(e);
		return ue(t) && Dt(t) === t.id && de(t) ? { ...Cp } : { ...wp };
	} catch {
		return { ...wp };
	}
}
async function kp(e, t) {
	for (let { id: n, fingerprint: r, verification: i } of e) {
		let e = await t.get(n);
		e && Dp(e.rawEvent) === r && await t.update(n, { rawEventVerification: i });
	}
}
function Ap(e, t) {
	let n = (e) => ({
		get: async (t) => e.find((e) => e.id === t),
		update: async (t, n) => {
			let r = e.find((e) => e.id === t);
			r && Object.assign(r, n);
		}
	});
	return {
		post: n(e),
		deletion: n(t)
	};
}
async function jp(e, t, n, r) {
	let i = [...e.map((e) => ({
		type: "post",
		record: e
	})), ...t.map((e) => ({
		type: "deletion",
		record: e
	}))].filter((e) => !Tp(e.record.rawEventVerification)), a = i.length;
	if (a === 0) return;
	let o = 0, s = /* @__PURE__ */ new Map(), c = [], l = [];
	async function u() {
		if (c.length > 0) {
			let e = c.splice(0);
			await (n.transaction?.post ?? (async (e) => e()))(() => kp(e, n.post));
		}
		if (l.length > 0) {
			let e = l.splice(0);
			await (n.transaction?.deletion ?? (async (e) => e()))(() => kp(e, n.deletion));
		}
	}
	r?.({
		phase: "verifying",
		processed: o,
		total: a
	});
	for (let e of i) {
		let t = Dp(e.record.rawEvent), n = s.get(t) ?? Op(e.record.rawEvent);
		s.set(t, n), e.record.rawEventVerification = n;
		let i = {
			id: e.record.id,
			fingerprint: t,
			verification: n
		};
		e.type === "post" ? c.push(i) : l.push(i), o += 1, o % 100 == 0 && (await u(), r?.({
			phase: "verifying",
			processed: o,
			total: a
		}));
	}
	await u(), r?.({
		phase: "verifying",
		processed: a,
		total: a
	});
}
function Mp(e, t) {
	if (!_e(e) || e.kind !== t) return !1;
	try {
		return ue(e) && Dt(e) === e.id;
	} catch {
		return !1;
	}
}
function Np(e) {
	return {
		id: e.id,
		pubkey: e.pubkey,
		created_at: e.created_at,
		kind: e.kind,
		tags: e.tags.map((e) => [...e]),
		content: e.content,
		sig: e.sig
	};
}
function Pp(e, t) {
	return e.created_at === t.created_at ? e.id === t.id ? 0 : e.id < t.id ? -1 : 1 : e.created_at - t.created_at;
}
function Fp(e) {
	return e.rawEvent !== null && e.rawEvent !== void 0;
}
function Ip(e, t, n) {
	return !Ep(e.rawEventVerification) || !Mp(t, 5) || t.pubkey !== n || e.targetAuthorPubkey !== n || e.deletionEventPubkey !== n || t.id !== e.deletionEventId ? !1 : Qe(t).includes(e.targetEventId);
}
function Lp() {
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
function Rp(e, t) {
	if (e.length === 0) return {
		blob: new Blob([], { type: "application/x-ndjson;charset=utf-8" }),
		...t ? { jsonl: "" } : {}
	};
	let n = [], r = "";
	for (let t of e) {
		let e = `${JSON.stringify(t)}\n`;
		r.length > 0 && r.length + e.length > 1048576 && (n.push(r), r = ""), r += e;
	}
	return r.length > 0 && n.push(r), {
		blob: new Blob(n, { type: "application/x-ndjson;charset=utf-8" }),
		...t ? { jsonl: n.join("") } : {}
	};
}
async function zp(e, t, n, r = {}) {
	let i = Lp(), a = [], o = [], s = /* @__PURE__ */ new Set(), c = /* @__PURE__ */ new Set(), l = /* @__PURE__ */ new Set(), u = t.filter((t) => t.pubkeyHex === e), d = n.filter((t) => t.targetAuthorPubkey === e), f = new Map((r.sensitivePayloadRecords ?? []).filter((t) => t.pubkeyHex === e && t.deletedAt === void 0).map((e) => [e.id, e])), p = /* @__PURE__ */ new Set();
	for (let e of u) {
		if (!rt(e.kind)) continue;
		if (!Ep(e.rawEventVerification) || !he(e.rawEvent, e) || !Mp(e.rawEvent, e.kind)) {
			i.skippedPostCount += 1;
			continue;
		}
		a.push(Np(e.rawEvent)), s.add(e.eventId), i.exportedPostEventCount += 1;
		let t = e.rawEvent, n = Ye(t);
		if (!n) continue;
		let r = f.get(n.eventId)?.rawEvent;
		!r || !nt(t, r, n.eventId) ? i.missingPayloadEventCount += 1 : p.has(r.id) || (p.add(r.id), a.push(Np(r)), i.exportedPayloadEventCount += 1);
	}
	let m = /* @__PURE__ */ new Map();
	for (let e of d) {
		let t = m.get(e.deletionEventId) ?? [];
		t.push(e), m.set(e.deletionEventId, t);
	}
	for (let t of m.values()) {
		let n = t.find((t) => Ip(t, t.rawEvent, e));
		if (n) {
			let e = Np(n.rawEvent);
			o.push(e);
			for (let t of Qe(e)) c.add(t);
			i.exportedDeletionEventCount += 1;
		} else {
			for (let e of t) l.add(e.targetEventId);
			t.every((e) => !Fp(e)) ? i.missingDeletionRawEventCount += 1 : i.invalidDeletionRawEventCount += 1;
		}
	}
	let h = /* @__PURE__ */ new Set();
	for (let e of u) rt(e.kind) && e.deletedAt !== void 0 && s.has(e.eventId) && !c.has(e.eventId) && !l.has(e.eventId) && h.add(e.eventId);
	i.missingDeletionRawEventCount += h.size, a.sort(Pp), o.sort(Pp);
	let g = [...a, ...o];
	return i.exportedEventCount = g.length, i.isPartial = i.skippedPostCount > 0 || i.missingDeletionRawEventCount > 0 || i.invalidDeletionRawEventCount > 0 || i.missingPayloadEventCount > 0, r.onProgress?.({ phase: "creating" }), {
		result: i,
		...Rp(g, r.includeJsonl === !0)
	};
}
async function Bp(e) {
	let t = e.postRecords.filter((t) => t.pubkeyHex === e.pubkeyHex), n = e.deletionRecords.filter((t) => t.targetAuthorPubkey === e.pubkeyHex);
	return await jp(t, n, e.verificationStores ?? Ap(t, n), e.onProgress), zp(e.pubkeyHex, t, n, e);
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryJsonlExportService.ts
function Vp() {
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
var Hp = new class {
	postHistoryRepository;
	deletionRequestsRepository;
	workerFactory;
	sensitivePayloadRepository;
	constructor(e = {}) {
		this.postHistoryRepository = e.postHistoryRepository ?? Z, this.deletionRequestsRepository = e.deletionRequestsRepository ?? tn, this.workerFactory = e.workerFactory ?? (() => new Worker(new URL(
			/* @vite-ignore */
			new URL("postHistoryJsonlExportWorker-B9jLXpDX.js", import.meta.url).href,
			"" + import.meta.url
		), { type: "module" })), this.sensitivePayloadRepository = e.sensitivePayloadRepository ?? bt;
	}
	exportForPubkeyInWorker(e, t = {}) {
		if (!e) {
			let { jsonl: e, ...t } = Vp();
			return Promise.resolve({
				result: t,
				blob: new Blob([], { type: "application/x-ndjson;charset=utf-8" })
			});
		}
		return new Promise((n, r) => {
			let i = this.workerFactory(), a = !1, o = () => {
				i.onmessage = null, i.onerror = null, t.signal?.removeEventListener("abort", c), i.terminate();
			}, s = (e) => {
				a || (a = !0, o(), r(e));
			}, c = () => s(new DOMException("Export aborted", "AbortError"));
			t.signal?.aborted ? c() : (t.signal?.addEventListener("abort", c, { once: !0 }), i.onmessage = (e) => {
				let r = e.data;
				if (r.type === "progress") t.onProgress?.(r.progress);
				else if (r.type === "error") s(Error(r.message));
				else if (r.type === "complete") {
					if (a) return;
					a = !0, o(), n({
						result: r.result,
						blob: r.blob
					});
				}
			}, i.onerror = () => s(/* @__PURE__ */ Error("post_history_export_worker_failed")), i.postMessage({
				type: "export",
				pubkeyHex: e
			}));
		});
	}
	async exportForPubkey(e) {
		if (!e) return Vp();
		let [t, n, r] = await Promise.all([
			this.postHistoryRepository.getAll({ pubkeyHex: e }),
			this.deletionRequestsRepository.getAllForTargetAuthorPubkey(e),
			this.sensitivePayloadRepository.getAllForPubkey(e)
		]), i = await Bp({
			pubkeyHex: e,
			postRecords: t,
			deletionRecords: n,
			sensitivePayloadRecords: r,
			includeJsonl: !0
		});
		return {
			...i.result,
			jsonl: i.jsonl ?? ""
		};
	}
}(), Up = i("<div> </div>"), Wp = i("<p role=\"status\"> </p>"), Gp = i("<h3 class=\"post-history-current-month-heading svelte-9hvdbo\"><span class=\"post-history-current-month svelte-9hvdbo\"> </span></h3>"), Kp = i("<div class=\"calendar-icon svg-icon\" aria-hidden=\"true\"></div>"), qp = i("<div class=\"repair-icon svg-icon svelte-9hvdbo\" aria-hidden=\"true\"></div>"), Jp = i("<div class=\"search-icon svg-icon svelte-9hvdbo\" aria-hidden=\"true\"></div>"), Yp = i("<div class=\"more-icon svg-icon\"></div>"), Xp = i("<div class=\"post-history-menu-summary\" role=\"presentation\"><span class=\"post-history-summary-line post-history-summary-count svelte-9hvdbo\"> </span></div> <!>", 1), Zp = i("<div class=\"return-to-latest-icon svg-icon\" aria-hidden=\"true\"></div> <span> </span>", 1), Qp = i("<div class=\"jump-to-oldest-icon svg-icon\" aria-hidden=\"true\"></div> <span> </span>", 1), $p = i("<div class=\"export-icon svg-icon\" aria-hidden=\"true\"></div> <span> </span>", 1), em = i("<div class=\"import-icon svg-icon svelte-9hvdbo\" aria-hidden=\"true\"></div> <span> </span>", 1), tm = i("<div class=\"trash-icon svg-icon\" aria-hidden=\"true\"></div> <span> </span>", 1), nm = i("<div class=\"post-history-menu-body\"><!> <!> <!> <!> <!> <!> <!> <!> <!></div>"), rm = i("<!> <!>", 1), im = i("<div class=\"search-icon svg-icon svelte-9hvdbo\"></div>"), am = i("<div class=\"xmark-icon svg-icon svelte-9hvdbo\" aria-hidden=\"true\"></div>"), om = i("<div class=\"post-history-search-row svelte-9hvdbo\"><div><div class=\"post-history-search-leading svelte-9hvdbo\" aria-hidden=\"true\"><!></div> <input class=\"post-history-search-input svelte-9hvdbo\" type=\"search\"/></div> <!></div>"), sm = i("<span class=\"post-history-date-picker-nav-icon post-history-date-picker-nav-icon-left svg-icon svelte-9hvdbo\" aria-hidden=\"true\"></span>"), cm = i("<span class=\"post-history-date-picker-nav-icon post-history-date-picker-nav-icon-right svg-icon svelte-9hvdbo\" aria-hidden=\"true\"></span>"), lm = i("<button type=\"button\" class=\"post-history-date-picker-year-nav\" aria-label=\"Previous year\"><span class=\"post-history-date-picker-year-nav-icon post-history-date-picker-year-nav-icon-left svg-icon\" aria-hidden=\"true\"></span></button> <!> <!> <!> <button type=\"button\" class=\"post-history-date-picker-year-nav\" aria-label=\"Next year\"><span class=\"post-history-date-picker-year-nav-icon post-history-date-picker-year-nav-icon-right svg-icon\" aria-hidden=\"true\"></span></button>", 1), um = i("<!> <!> <!>", 1), dm = i("<div class=\"jump-icon svg-icon svelte-9hvdbo\" aria-hidden=\"true\"></div>"), fm = i("<div class=\"post-history-utility-panel svelte-9hvdbo\"><div class=\"post-history-utility-label svelte-9hvdbo\" id=\"post-history-jump-date-label\"> </div> <div class=\"post-history-utility-controls svelte-9hvdbo\"><!> <!> <!></div></div>"), pm = i("<div class=\"post-history-list-loading svelte-9hvdbo\" aria-hidden=\"true\"><!></div>"), mm = i("<div class=\"empty-state svelte-9hvdbo\"><div class=\"empty-message svelte-9hvdbo\"> </div></div>"), hm = i("<div class=\"keyboard-arrow-up-icon svg-icon\" aria-hidden=\"true\"></div> ", 1), gm = i("<div class=\"post-history-nav-row post-history-nav-row-top svelte-9hvdbo\"><!></div>"), _m = i("<div class=\"post-history-auto-load-sentinel post-history-auto-load-newer-sentinel svelte-9hvdbo\"><!></div>"), vm = i("<div aria-hidden=\"true\"><!></div>"), ym = i("<div class=\"post-history-channel-row svelte-9hvdbo\"><span class=\"channel-icon svg-icon svelte-9hvdbo\" aria-hidden=\"true\"></span> <span class=\"channel-label svelte-9hvdbo\"> </span> <span class=\"channel-name svelte-9hvdbo\"> </span></div>"), bm = i("<span class=\"deleted-badge svelte-9hvdbo\"> </span>"), xm = i("<span class=\"delete-failed svelte-9hvdbo\"> </span>"), Sm = i("<div class=\"post-meta-inline svelte-9hvdbo\"><!> <!></div>"), Cm = i("<div class=\"calendar-icon svg-icon\" aria-hidden=\"true\"></div> <span> </span>", 1), wm = i("<div class=\"post-history-menu-body\"><div class=\"post-history-menu-timestamp\"> </div> <!> <!> <!></div>"), Tm = i("<span class=\"svelte-9hvdbo\"> </span> <!>", 1), Em = i("<div class=\"post-preview-header svelte-9hvdbo\"><!> <div class=\"post-preview-header-right svelte-9hvdbo\"><!> <!></div></div>"), Dm = i("<div class=\"post-preview-quotes svelte-9hvdbo\"></div>"), Om = i("<div class=\"open-in-new-icon svg-icon\" aria-hidden=\"true\"></div> <span class=\"svelte-9hvdbo\"> </span>", 1), km = i("<div class=\"find_in_page-icon svg-icon\" aria-hidden=\"true\"></div> <span class=\"svelte-9hvdbo\"> </span>", 1), Am = i("<div class=\"calendar-icon svg-icon\" aria-hidden=\"true\"></div> <span class=\"svelte-9hvdbo\"> </span>", 1), jm = i("<!> <!> <!> <!> <!>", 1), Mm = i("<p role=\"status\" class=\"svelte-9hvdbo\"> </p>"), Nm = i("<!> <!> <div class=\"post-history-thread-anchor-post svelte-9hvdbo\"><div class=\"post-preview-body svelte-9hvdbo\"><!></div> <!> <!> <!> <!></div>", 1), Pm = i("<li><div class=\"post-history-main svelte-9hvdbo\"><div class=\"post-preview svelte-9hvdbo\"><!></div></div></li>"), Fm = i("<div class=\"post-history-auto-load-sentinel svelte-9hvdbo\"><!></div>"), Im = i("<div class=\"post-history-auto-load-slot svelte-9hvdbo\" aria-hidden=\"true\"><!></div>"), Lm = i("<div class=\"post-history-sparse-state svelte-9hvdbo\" role=\"status\"><p class=\"svelte-9hvdbo\"> </p> <p class=\"svelte-9hvdbo\"> </p></div>"), Rm = i("<div class=\"cloud-download-icon svg-icon\" aria-hidden=\"true\"></div> ", 1), zm = i("<div class=\"keyboard-arrow-down-icon svg-icon\" aria-hidden=\"true\"></div> ", 1), Bm = i("<div class=\"post-history-saved-boundary svelte-9hvdbo\" role=\"status\"><div class=\"post-history-saved-boundary-actions svelte-9hvdbo\"><!> <!></div></div>"), Vm = i("<div class=\"post-history-nav-row post-history-nav-row-bottom svelte-9hvdbo\"><!></div>"), Hm = i("<div class=\"post-history-exhausted-state svelte-9hvdbo\"><!></div>"), Um = i("<div class=\"post-history-search-bottom-spacer svelte-9hvdbo\" aria-hidden=\"true\"></div>"), Wm = i("<!> <!> <ul class=\"post-history-list svelte-9hvdbo\"></ul> <!> <!> <!>", 1), Gm = i("<div class=\"post-history-nav-row post-history-sync-footer svelte-9hvdbo\" role=\"status\"><!></div>"), Km = i("<div class=\"vertical-align-top-icon svg-icon\" aria-hidden=\"true\"></div>"), qm = i("<div class=\"post-history-latest-row svelte-9hvdbo\"><!></div>"), Jm = i("<div class=\"delete-confirm-body svelte-9hvdbo\"><p class=\"delete-confirm-description svelte-9hvdbo\"> </p> <p class=\"delete-confirm-warning svelte-9hvdbo\"> </p></div>"), Ym = i("<div class=\"delete-confirm-body svelte-9hvdbo\"><p class=\"delete-confirm-description svelte-9hvdbo\"> </p></div>"), Xm = i("<div class=\"post-history-tab-content svelte-9hvdbo\"><!> <!> <div class=\"post-history-heading svelte-9hvdbo\"><div class=\"post-history-heading-main svelte-9hvdbo\"><!> <!></div> <div class=\"post-history-heading-actions svelte-9hvdbo\"><!> <!> <!> <!></div></div> <!> <!> <div><!> <!></div> <!> <!> <!> <!> <!></div> <!> <!> <!> <!> <!> <!> <!>", 1), Zm = {
	hash: "svelte-9hvdbo",
	code: ".post-history-tab-content.svelte-9hvdbo {position:relative;display:flex;flex-direction:column;flex:1;min-height:0;overflow:hidden;width:100%;}.post-history-heading.svelte-9hvdbo {display:flex;align-items:stretch;justify-content:space-between;width:100%;height:48px;min-height:48px;flex:0 0 48px;overflow:hidden;padding:0;border-bottom:1px solid var(--border-hr);}.post-history-heading-main.svelte-9hvdbo {display:flex;align-items:center;flex:1 1 auto;min-width:0;align-self:stretch;gap:4px;}.post-history-current-month-heading.svelte-9hvdbo {display:flex;align-items:center;flex:0 1 auto;min-width:0;height:100%;margin:0;}.post-history-current-month.svelte-9hvdbo {display:block;color:var(--text-light);font-size:1.75rem;line-height:1.05;font-weight:600;letter-spacing:-0.04em;min-width:0;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;padding-left:12px;}.post-history-heading-action-button {width:50px;height:50px;min-width:50px;min-height:50px;flex:0 0 50px;padding:0;border:0;color:var(--text-muted);background-color:var(--dialog-bg);--btn-bg: var(--dialog-bg);}.post-history-heading-action-button .svg-icon {width:22px;height:22px;background-color:currentColor;--svg: currentColor;}\n            .post-history-heading-refetch-button .svg-icon,\n            .post-history-heading-search-button .svg-icon\n         {width:24px;height:24px;}.post-history-heading-calendar-button .calendar-icon {mask-image:var(--ehagaki-icon-63616c656e6461725f746f6461795f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.post-history-heading-refetch-button:disabled {opacity:0.45;}.post-history-heading-actions.svelte-9hvdbo {display:flex;align-items:center;justify-content:flex-end;align-self:stretch;flex:0 0 auto;min-width:0;gap:0;white-space:nowrap;}\n            .post-history-action-button,\n            .post-history-thread-toggle-button\n         {color:var(--btn-post-preview-action);}\n            .post-history-action-button .svg-icon,\n            .post-history-thread-toggle-button .svg-icon\n         {--svg: currentColor;}.post-history-menu-summary {padding:8px 12px 4px;color:var(--text-muted);font-size:0.875rem;line-height:1.35;user-select:text;}.post-history-summary-line.svelte-9hvdbo {overflow-wrap:anywhere;}.post-history-summary-count.svelte-9hvdbo {flex:0 0 auto;white-space:nowrap;text-align:end;}.post-history-repair-button {white-space:nowrap;padding:6px 10px;font-size:0.82rem;}.post-history-search-row.svelte-9hvdbo {display:flex;align-items:center;width:100%;}.post-history-search-input-wrapper.svelte-9hvdbo {position:relative;flex:1 1 auto;min-width:0;border:1px solid var(--border-soft);background:var(--background);color:var(--text);font:inherit;border-bottom:1px solid var(--border-hr);}.post-history-search-leading.svelte-9hvdbo {display:flex;position:absolute;inset:0 auto 0 0;width:40px;align-items:center;justify-content:center;color:var(--text-muted);pointer-events:none;}.post-history-search-leading .search-icon,\n    .post-history-search-leading .inline-spinner {width:24px;height:24px;}.post-history-search-leading .loading-placeholder {width:24px;height:24px;flex:0 0 24px;}.post-history-search-active.svelte-9hvdbo {border-bottom-color:color-mix(\n            in srgb,\n            var(--theme),\n            var(--border-hr) 55%\n        );}.post-history-search-input.svelte-9hvdbo {display:block;width:100%;min-width:0;padding:10px 12px 10px 40px;border:0;background:transparent;color:inherit;font:inherit;}.post-history-search-close.square {flex:0 0 auto;min-height:40px;aspect-ratio:1;padding:0;background:var(--btn-bg);.svg-icon {width:28px;height:28px;}}.post-history-search-input.svelte-9hvdbo::placeholder {color:var(--text-muted);}.post-history-utility-panel.svelte-9hvdbo {display:flex;flex-direction:column;padding:6px 16px 6px;border-bottom:1px solid var(--border-hr);gap:2px;}.post-history-utility-label.svelte-9hvdbo {color:var(--text-muted);font-size:0.82rem;}.post-history-utility-controls.svelte-9hvdbo {display:flex;flex-wrap:wrap;gap:4px;align-items:center;}.post-history-date-picker-input {display:inline-flex;align-items:stretch;gap:2px;min-width:0;padding:6px;height:40px;border:1px solid var(--border-hr);background:var(--background);color:var(--text);font:inherit;}.post-history-date-picker-segment {display:inline-flex;align-items:center;justify-content:center;min-width:1ch;height:auto;color:var(--text-muted);&[role=\"spinbutton\"] {min-width:3ch;}&[data-segment=\"year\"] {min-width:5ch;}}.post-history-date-picker-trigger {flex:0 0 auto;min-width:40px;min-height:40px;padding:0;}.post-history-date-picker-trigger .svg-icon {mask-image:var(--ehagaki-icon-63616c656e6461725f746f6461795f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);width:24px;height:24px;}.post-history-date-picker-content {z-index:110;background-color:var(--dialog-bg2);border:1px solid var(--border-soft);border-radius:8px;padding:8px;box-shadow:0 12px 28px rgb(0 0 0 / 0.16);}.post-history-date-picker-calendar {display:flex;flex-direction:column;gap:6px;}.post-history-date-picker-header {display:flex;align-items:center;justify-content:space-between;gap:8px;}.post-history-date-picker-heading {flex:1 1 auto;text-align:center;font-size:0.9rem;font-weight:600;}.post-history-date-picker-nav,\n    .post-history-date-picker-year-nav {display:inline-flex;align-items:center;justify-content:center;width:30px;height:30px;border:1px solid var(--border-soft);border-radius:6px;background-color:var(--btn-bg2);color:var(--text);}.post-history-date-picker-nav-icon,\n    .post-history-date-picker-year-nav-icon {width:24px;height:24px;background-color:currentColor;}.post-history-date-picker-nav-icon-left {margin-inline-end:1px;mask-image:var(--ehagaki-icon-6b6579626f6172645f6172726f775f6c6566745f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.post-history-date-picker-nav-icon-right {margin-inline-start:1px;mask-image:var(--ehagaki-icon-6b6579626f6172645f6172726f775f72696768745f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.post-history-date-picker-year-nav-icon-left {mask-image:var(--ehagaki-icon-6b6579626f6172645f646f75626c655f6172726f775f6c6566745f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.post-history-date-picker-year-nav-icon-right {mask-image:var(--ehagaki-icon-6b6579626f6172645f646f75626c655f6172726f775f72696768745f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.post-history-date-picker-grid {border-collapse:separate;border-spacing:2px;}.post-history-date-picker-weekday {color:var(--text-muted);font-size:0.74rem;font-weight:500;text-align:center;}.post-history-date-picker-day {display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:6px;font-size:0.86rem;}.post-history-date-picker-day[data-selected] {background:color-mix(in srgb, var(--theme), white 10%);color:white;}.post-history-date-picker-day[data-disabled] {opacity:0.45;}.post-history-utility-button {height:auto;min-height:40px;white-space:nowrap;}.post-history-utility-button.post-history-utility-submit-button,\n    .post-history-utility-button.post-history-utility-close-button {min-width:70px;min-height:40px;}.post-history-nav-row.svelte-9hvdbo {display:flex;justify-content:center;width:100%;padding:8px 16px;}.post-history-nav-row-top.svelte-9hvdbo {padding-bottom:0;}.post-history-nav-row-bottom.svelte-9hvdbo {padding-top:0;}.post-history-search-bottom-spacer.svelte-9hvdbo {\n        /* Clear the 50px return-to-latest button and its 12px bottom inset. */height:62px;}.post-history-auto-load-sentinel.svelte-9hvdbo {display:grid;width:100%;min-height:24px;place-items:center;}.post-history-auto-load-slot.svelte-9hvdbo {display:grid;height:24px;min-height:24px;place-items:center;}.post-history-auto-load-newer-slot.svelte-9hvdbo:not(.post-history-auto-load-newer-slot-reserved) {height:0;min-height:0;}.post-history-nav-button.primary {opacity:1;}.post-history-nav-button:not(.primary) {min-height:50px;white-space:nowrap;gap:4px;}.post-history-exhausted-state.svelte-9hvdbo {display:flex;flex-direction:column;gap:10px;align-items:center;padding:0 16px 8px 16px;}.post-history-latest-row.svelte-9hvdbo {position:absolute;inset:auto 16px 12px auto;display:flex;justify-content:flex-end;width:auto;margin:0;padding:0;z-index:3;.post-history-latest-button {min-width:50px;min-height:50px;background-color:color-mix(in srgb, var(--theme) 15%, transparent);backdrop-filter:blur(1px);.vertical-align-top-icon {mask-image:var(--ehagaki-icon-766572746963616c5f616c69676e5f746f705f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);width:26px;height:26px;opacity:0.6;}}}.post-history-container.svelte-9hvdbo {flex:1 1 auto;min-height:0;width:100%;overflow-y:auto;}.post-history-container.post-history-auto-load-enabled.svelte-9hvdbo {overflow-anchor:none;}.empty-state.svelte-9hvdbo {display:grid;gap:8px;min-height:100px;align-content:center;}.post-history-list-loading.svelte-9hvdbo {display:grid;min-height:100px;place-items:center;}.empty-message.svelte-9hvdbo {display:flex;justify-content:center;align-items:center;height:100px;color:var(--text-muted);font-size:1rem;}.status-loading-placeholder {justify-content:flex-end;width:auto;max-width:min(38vw, 240px);min-width:0;overflow:hidden;flex:0 1 auto;white-space:nowrap;column-gap:0;color:var(--text-muted);font-size:0.8rem;line-height:1.3;height:auto;}.post-history-heading-status-placeholder {color:var(--svg);}.status-loading-placeholder .loader-container {.square {background:currentColor;}}.status-loading-placeholder .placeholder-text {color:inherit;font-size:inherit;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.status-error {color:var(--danger);}.post-history-heading-status-placeholder.status-error {color:var(--svg);}.status-loading-placeholder.status-error .square {background-color:var(--danger);}.post-history-list.svelte-9hvdbo {width:100%;margin:0;padding:0;list-style:none;}.post-history-item.svelte-9hvdbo {display:flex;align-items:center;border-bottom:1px solid var(--border-hr-light);padding:6px;}.post-history-item.svelte-9hvdbo:last-child {border-bottom:none;}.post-history-item-deleted.svelte-9hvdbo .post-meta-inline:where(.svelte-9hvdbo) > :where(.svelte-9hvdbo):not(.deleted-badge),\n    .post-history-item-deleted.svelte-9hvdbo .post-preview-body:where(.svelte-9hvdbo) {opacity:0.65;}.post-history-main.svelte-9hvdbo {display:flex;flex-direction:column;flex:1 1 0;min-width:0;gap:2px;}.post-preview-header.svelte-9hvdbo {display:flex;align-items:center;justify-content:space-between;gap:8px;color:var(--text-muted);font-size:0.875rem;line-height:1.3;}.post-preview-header-right.svelte-9hvdbo {display:flex;align-items:center;gap:2px;flex-shrink:0;margin-inline-start:auto;}.post-preview-header-right.svelte-9hvdbo > span:where(.svelte-9hvdbo) {white-space:nowrap;}.post-history-menu-content .menu-action-button .calendar-icon {mask-image:var(--ehagaki-icon-63616c656e6461725f746f6461795f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);background-color:currentColor;}.post-history-menu-content .menu-action-button .find_in_page-icon {mask-image:var(--ehagaki-icon-66696e645f696e5f706167655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);background-color:currentColor;}.post-history-menu-content .menu-action-button .broadcast-icon {mask-image:var(--ehagaki-icon-63656c6c5f746f7765725f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);background-color:currentColor;}.post-history-menu-content .menu-action-button .raw-json-icon {mask-image:var(--ehagaki-icon-646174615f6f626a6563745f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);background-color:currentColor;}.post-history-menu-content .menu-action-button .export-icon {mask-image:var(--ehagaki-icon-75706c6f61645f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);background-color:currentColor;}.post-history-menu-content .menu-action-button .import-icon {mask-image:var(--ehagaki-icon-646f776e6c6f61645f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);background-color:currentColor;}\n            .post-history-menu-content\n                .menu-action-button\n                .collapse-content-icon\n         {mask-image:var(--ehagaki-icon-636f6c6c617073655f636f6e74656e745f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);background-color:currentColor;width:24px;height:24px;}\n            .post-history-menu-content\n                .menu-action-button\n                .return-to-latest-icon\n         {mask-image:var(--ehagaki-icon-766572746963616c5f616c69676e5f746f705f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);background-color:currentColor;}\n            .post-history-menu-content .menu-action-button .jump-to-oldest-icon\n         {mask-image:var(--ehagaki-icon-766572746963616c5f616c69676e5f626f74746f6d5f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);background-color:currentColor;}.post-history-nav-button .keyboard-arrow-up-icon {mask-image:var(--ehagaki-icon-6b6579626f6172645f6172726f775f75705f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);width:28px;height:28px;}.post-history-nav-button .keyboard-arrow-down-icon {mask-image:var(--ehagaki-icon-6b6579626f6172645f6172726f775f646f776e5f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);width:28px;height:28px;}.post-history-nav-button .cloud-download-icon {mask-image:var(--ehagaki-icon-636c6f75645f646f776e6c6f61645f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);width:28px;height:28px;}.post-history-nav-loading-placeholder .loader-container .square {background-color:currentColor;}.post-preview.svelte-9hvdbo {display:flex;flex-direction:column;min-width:0;color:var(--text);font-size:1rem;}.post-history-thread-anchor-post.svelte-9hvdbo {display:flex;flex-direction:column;min-width:0;}.post-history-channel-row.svelte-9hvdbo {display:flex;align-items:center;gap:6px;min-width:0;color:var(--text-muted);font-size:0.875rem;line-height:1.3;}.channel-icon.svelte-9hvdbo {width:18px;height:18px;flex-shrink:0;mask-image:var(--ehagaki-icon-666f72756d5f323464705f3030303030305f46494c4c315f776768743430305f47524144305f6f70737a32342e737667);background-color:currentColor;}.channel-label.svelte-9hvdbo {flex-shrink:0;}.channel-name.svelte-9hvdbo {min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.post-preview-body.svelte-9hvdbo {display:flex;flex-direction:column;padding-inline-start:1rem;gap:4px;.post-preview-quotes:where(.svelte-9hvdbo) {display:flex;flex-direction:column;gap:4px;margin-inline-start:-1rem;}}.post-history-thread-toggle-button.selected {--btn-bg: var(--post-history-preview-footer-surface, var(--dialog-bg));color:var(--text-light);}\n\n    @media (hover: hover) and (pointer: fine) {\n                .post-history-thread-toggle-button.selected:hover:not(:disabled)\n             {background-color:light-dark(\n                color-mix(in srgb, var(--dialog-bg), black 20%),\n                color-mix(in srgb, var(--dialog-bg), white 30%)\n            );color:light-dark(\n                color-mix(in srgb, var(--text), black 20%),\n                color-mix(in srgb, var(--text), white 30%)\n            );}\n    }.post-meta-inline.svelte-9hvdbo {margin-inline-start:auto;display:flex;align-items:center;gap:6px;}.deleted-badge.svelte-9hvdbo {padding:2px 6px;border-radius:999px;background:color-mix(in srgb, var(--danger), transparent 82%);color:var(--danger);font-weight:600;}.delete-failed.svelte-9hvdbo {color:var(--danger);}.delete-confirm-body.svelte-9hvdbo {display:flex;flex-direction:column;justify-content:center;gap:0.5rem;margin:10px 0 30px 0;margin-inline:auto;text-align:start;}.delete-confirm-description.svelte-9hvdbo,\n    .delete-confirm-warning.svelte-9hvdbo {line-height:1.5;margin:0;}.delete-confirm-warning.svelte-9hvdbo {color:var(--text-light);font-size:0.875rem;}.copy-icon {mask-image:var(--ehagaki-icon-66696c655f636f70795f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.search-icon.svelte-9hvdbo {mask-image:var(--ehagaki-icon-7365617263685f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.post-history-search-close .xmark-icon.svelte-9hvdbo {mask-image:var(--ehagaki-icon-636c6f73655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.repair-icon.svelte-9hvdbo {mask-image:var(--ehagaki-icon-726566726573685f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.post-history-saved-boundary.svelte-9hvdbo,\n    .post-history-sparse-state.svelte-9hvdbo {display:grid;gap:8px;margin:16px 0;padding:12px;border:1px solid var(--border-hr);border-radius:10px;color:var(--text-muted);background:color-mix(in srgb, var(--bg-input) 72%, transparent);}.post-history-saved-boundary.svelte-9hvdbo {padding:0;border:0;border-radius:0;background:transparent;}.post-history-saved-boundary.svelte-9hvdbo p:where(.svelte-9hvdbo),\n    .post-history-sparse-state.svelte-9hvdbo p:where(.svelte-9hvdbo) {margin:0;}.post-history-saved-boundary-actions.svelte-9hvdbo {display:flex;width:fit-content;max-width:100%;box-sizing:border-box;justify-self:center;flex-wrap:wrap;justify-content:center;align-items:flex-start;gap:8px;}.post-history-saved-boundary-actions .post-history-nav-button {height:52px;}\n\n    @media (max-width: 600px) {.post-history-saved-boundary-actions.svelte-9hvdbo {width:min(100%, 320px);flex-direction:column;align-items:center;}.post-history-saved-boundary-actions .post-history-nav-button {width:100%;flex:0 0 52px;}\n    }.import-icon.svelte-9hvdbo {mask-image:var(--ehagaki-icon-636c6f75645f646f776e6c6f61645f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.trash-icon {mask-image:var(--ehagaki-icon-64656c6574655f666f72657665725f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.jump-icon.svelte-9hvdbo {mask-image:var(--ehagaki-icon-6b6579626f6172645f7461625f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.post-history-utility-close-button .xmark-icon.svelte-9hvdbo {mask-image:var(--ehagaki-icon-636c6f73655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}"
};
function Qm(n, i) {
	p(i, !0), ee(n, Zm);
	let a = () => R(Ie, "$_", u), l = () => R(Ne, "$locale", u), [u, f] = ne(), _ = (e, t = c) => {
		let n = S(() => ti(t().eventId));
		var r = h(), i = V(r), a = (e) => {
			{
				let r = S(() => $r(t().eventId)), i = S(() => ni(t().eventId));
				gr(e, {
					get count() {
						return B(n).totalCount;
					},
					get expanded() {
						return B(r);
					},
					get ariaLabel() {
						return B(i);
					},
					onToggle: () => ei(t().eventId)
				});
			}
		};
		d(i, (e) => {
			B(n) && B(n).totalCount > 0 && e(a);
		}), m(e, r);
	}, x = (e, t = c) => {
		let n = S(() => ti(t().eventId));
		var r = h(), i = V(r), a = (e) => {
			jr(e, {
				get readModel() {
					return B(n);
				},
				get emojiLoadStateByUrl() {
					return Ln.emojiLoadStateByUrl;
				},
				get emojiImageMetaByUrl() {
					return Ln.emojiImageMetaByUrl;
				}
			});
		}, o = S(() => B(n) && B(n).totalCount > 0 && $r(t().eventId));
		d(i, (e) => {
			B(o) && e(a);
		}), m(e, r);
	}, D = (e, t = c, n = c) => {
		{
			let r = (e) => {
				{
					let n = S(() => Re(t()) ? () => void ze(t()) : void 0), r = S(() => Xe.copyState[t().eventId] === "failed"), i = S(() => Xr(t())), a = S(() => Yr(t())), o = S(() => oi(t())), s = S(() => qr(t())), c = S(Di);
					ol(e, {
						order: "standard",
						get onRepost() {
							return B(n);
						},
						get repostPending() {
							return pe();
						},
						get copyFailed() {
							return B(r);
						},
						get showBroadcast() {
							return B(i);
						},
						get broadcastSending() {
							return B(a);
						},
						get showDelete() {
							return B(o);
						},
						showDeleteSeparator: !0,
						get deletionSending() {
							return B(s);
						},
						onCopyPointerDown: (e) => Xe.captureCopyPointerPosition(t(), e),
						onCopyNevent: (e) => void Xe.handleCopyNevent(t(), e),
						get externalClientLabel() {
							return B(c);
						},
						onOpenExternalClient: () => Oi(t()),
						onShowRawJson: () => _i(t().rawEvent, t().relayHints),
						onBroadcastPointerDown: (e) => ui(t(), e),
						onBroadcastPost: (e) => void ci(t(), e),
						onOpenDeleteConfirm: () => si(t())
					});
				}
			}, i = S(() => Ye.isPostMenuOpen(n())), o = S(() => a()(et(t().kind) ? "repost.outerActions" : "repost.targetActions")), s = S(() => rn(t().postedAt, l()));
			zr(e, {
				get open() {
					return B(i);
				},
				restoreFocusOnClose: !0,
				onOpenChange: (e) => gi(n(), e),
				get triggerAriaLabel() {
					return B(o);
				},
				get timestamp() {
					return B(s);
				},
				items: r,
				$$slots: { items: !0 }
			});
		}
	}, A = le().overlayTarget, N = L(i, "show", 3, !1), I = L(i, "sessionOpen", 3, void 0), ue = L(i, "onInitialReady", 3, void 0), de = L(i, "onReplyPost", 3, void 0), H = L(i, "onQuotePost", 3, void 0), U = L(i, "onReactionPost", 3, void 0), fe = L(i, "onRepostPost", 3, void 0), pe = L(i, "repostPending", 3, !1), me = L(i, "onRetryRepostSave", 3, void 0), ge = L(i, "repostSaveFailure", 3, null), W = L(i, "pubkeyHex", 3, null), _e = L(i, "rxNostr", 3, void 0), ve = L(i, "relayConfig", 3, null), ye = L(i, "latestPostedEvent", 3, null), be = L(i, "inboundInteractionSave", 3, null), xe = L(i, "authoredSelfPostSave", 3, null), Se = L(i, "reconcileInboundDirectReplyCandidates", 3, void 0), Ce = L(i, "notifySavedAuthoredPosts", 3, void 0), we = b(!1), G = S(() => N() && !B(we)), Te = 0, K = !1, Ee = !1;
	function De() {
		Ee = !1, k(we, !1);
	}
	function Oe() {
		B(we) || (Ee || $.saveCurrentSessionScrollAnchor(), k(we, !0), Te++, rt++, Le++, J.suspend(), $.suspend(), In.suspend(), Y.cancelCurrentChannelResolution(), Ue.cancelCurrentGraphFetches(), Ke.suspend(), qe.cancelCurrentSync(), Me.reset(), q.invalidateScope("post-history-listing-quote-visible-range-repair"), X.suspend(), Pe.suspend(), q.invalidateScope("post-history-repost-operation"), Ln.suspend(), Ye.resetDeleteConfirmation(), Ye.closeAllPostItemMenus(), k(ct, !1), lt.suspend(), k(Tt, !1), k(Et, null), k(Qe, !1), k(Z, !1), k(ot, !1), Xe.resetState(), li(), qi(), vt(), ar(), k($t, !1), k(Kt, [], !0), k(qt, -1), k(Nt, {}, !0), k(jt, {}, !0), k(on, !1), k(sn, !1), dn = !1, pn = !1);
	}
	function ke() {
		Oe(), Te++;
	}
	function Ae() {
		return B($t);
	}
	z(() => {
		let e = N();
		re(() => e ? De() : Oe());
	});
	function je() {
		let e = Te, t = W(), n = _e();
		return () => e === Te && B(G) && t === W() && n === _e();
	}
	let Me = hr({
		getShow: () => !K && B(G),
		getRxNostr: () => K ? void 0 : _e()
	}), q = Lr({
		loadRepostTarget: mr,
		getShow: () => !K && B(G),
		getRxNostr: () => K ? void 0 : _e(),
		getRelayConfig: () => K ? null : ve(),
		profileSyncCoordinator: Me
	}), J = nf({
		getShow: () => !K && B(G),
		getSessionOpen: () => I() ?? N(),
		getPubkeyHex: () => K ? null : W(),
		getRxNostr: () => K ? void 0 : _e(),
		getRelayConfig: () => K ? null : ve(),
		getSessionScrollState: () => $.readCurrentSessionScrollState(),
		onSessionScrollStateInvalidated: () => $.clearAllSessionScrollAnchorsForCurrentPubkey(),
		onSavedAuthoredPosts: async (e) => {
			await Ce()?.(e);
		},
		onLocalHistoryChanged: ea,
		onChildInteractionBadgeRefreshRequested: (e, t) => Ue.loadCachedChildInteractionStateForPosts(e, t),
		onQuoteVisibleRangeRefreshRequested: (e) => X.refreshQuotePreviews(e),
		quoteVisibleRangeRepairExecutor: async (e, t) => {
			let n = He(t.visiblePosts);
			n.length !== 0 && await q.ensureTargets(n);
		},
		pageSize: 50
	}), Pe = ir({
		getShow: () => !K && B(G),
		getPubkey: () => K ? null : W(),
		getPosts: () => J.posts,
		resolver: q
	}), Fe = b(null), Le = 0;
	z(() => (B(G), W(), Le++, k(Fe, null), () => q.invalidateScope("post-history-repost-operation")));
	function Re(e) {
		return !!fe() && Je(e.kind) && e.deletedAt === void 0 && he(e.rawEvent, e);
	}
	async function ze(e) {
		if (!fe() || pe() || !Re(e)) return;
		k(Fe, null);
		let t = Le, n = je(), r = await fe()(e, (e, t) => {
			if (!n()) throw new DOMException("History tab suspended", "AbortError");
			return q.prepareRepostTarget({
				relationKind: "repost",
				scopeKey: "post-history-repost-operation",
				targetEventId: e.id,
				authorHint: e.pubkey,
				relayHints: t
			}, e);
		});
		t === Le && B(G) && k(Fe, r, !0);
	}
	let Y = fr({
		getShow: () => !K && B(G),
		getSessionOpen: () => I() ?? N(),
		getPosts: () => [...J.posts, ...J.posts.flatMap((e) => {
			if (!et(e.kind)) return [];
			let t = Pe.getPreview(e);
			return t.status === "resolved" && t.event?.kind === 42 ? [tt(t.event, t.relayHints)] : [];
		})],
		getRxNostr: () => K ? void 0 : _e(),
		getRelayConfig: () => K ? null : ve(),
		getIsSearchMode: () => J.isSearchMode
	}), X = Uu({
		getShow: () => !K && B(G),
		getPosts: () => J.posts,
		getRxNostr: () => K ? void 0 : _e(),
		getRelayConfig: () => K ? null : ve(),
		relatedTargetResolver: q,
		profileSyncCoordinator: Me
	});
	function Ve(e) {
		let t = Pe.getPreview(e);
		return t.status === "resolved" && t.event?.kind === 42 ? Y.getChannelText(tt(t.event, t.relayHints), a()) : null;
	}
	function He(e) {
		let t = Ru.buildIndex(e);
		return Object.values(t.contextsByEventId).map((e) => Ru.toDescriptor(e, "post-history-listing-quote-visible-range-repair"));
	}
	let Ue = bp({
		onRelatedEventsRefreshed: (e) => {
			(e === "success" || e === "partial") && yt();
		},
		onDeletedPost: (e, t, n) => J.patchDeletedPost(e, t, n),
		getShow: () => !K && B(G),
		getSessionOpen: () => I() ?? N(),
		getPubkeyHex: () => K ? null : W(),
		getRxNostr: () => K ? void 0 : _e(),
		getRelayConfig: () => K ? null : ve(),
		relatedTargetResolver: q,
		profileSyncCoordinator: Me
	});
	function We() {
		let e = /* @__PURE__ */ new Map(), t = (t, n) => {
			let r = t.id;
			r && !J.posts.some((e) => e.eventId === r && ![6, 16].includes(e.kind)) && e.set(r, {
				eventId: r,
				targetAuthorPubkey: t.pubkey,
				targetKind: t.kind,
				relayHints: Array.from(/* @__PURE__ */ new Set([...e.get(r)?.relayHints ?? [], ...n]))
			});
		}, n = (e) => {
			e && (t(e.node.event, e.node.relayUrls), n(e.parentNodeState), e.replyNodeStates.forEach(n));
		};
		for (let e of J.posts) {
			let r = [6, 16].includes(e.kind) ? ft(e.rawEvent) : null;
			r && t(r.event, [
				...e.fetchedRelays ?? [],
				...e.acceptedRelays,
				...e.relayHints
			]);
			let i = Pe.getPreview(e);
			i.status === "resolved" && i.event && t(i.event, i.relayHints);
			let a = Ue.getAnchorState(e);
			n(a.parentNodeState), a.replyNodeStates.forEach(n);
			for (let n of X.getQuotePreviews(e)) n.status === "resolved" && t(n.event, n.relayHints);
		}
		return Array.from(e.values());
	}
	let Ge = S(We), Ke = Ar({
		getShow: () => !K && B(G),
		getSessionOpen: () => I() ?? N(),
		getPubkeyHex: () => K ? null : W(),
		getRxNostr: () => K ? void 0 : _e(),
		getRelayConfig: () => K ? null : ve(),
		getTargets: () => B(Ge),
		profileSync: Me
	}), qe = Sp({
		getShow: () => !K && B(G),
		getPubkeyHex: () => K ? null : W(),
		getRxNostr: () => K ? void 0 : _e(),
		getRelayConfig: () => K ? null : ve(),
		getPosts: () => J.posts,
		onSavedInboundInteractions: (e) => Ue.loadCachedChildInteractionStateForPosts(J.posts, e),
		reconcileDirectReplyCandidates: (e) => Se()?.(e) ?? Promise.resolve({
			changedParentEventIds: [],
			savedDirectReplyCount: 0,
			unresolvedParentEventIds: e.map((e) => e.classification.parentEventId).filter((e) => !!e)
		})
	}), Ye = _r(), Xe = wu();
	function Ze() {
		let e = /* @__PURE__ */ new Date();
		return aa(`${`${e.getFullYear()}`}-${`${e.getMonth() + 1}`.padStart(2, "0")}-${`${e.getDate()}`.padStart(2, "0")}`);
	}
	let Qe = b(!1), $e = b("none"), nt = b(!1), rt = 0, it = b(F(Ze())), at = b(F(Ze())), ot = b(!1), st = null, Z = b(!1), ct = b(!1), lt = Kl({
		getShow: () => !K && B(G),
		getScope: () => ({
			ownerPubkeyHex: W(),
			rxNostr: _e(),
			relayConfig: ve()
		}),
		onSettled: Zi
	}), ut = b(!1), dt = b(F({ phase: "loading" })), pt, mt, ht = b(!1), gt = b("postHistory.relatedEventsApplied"), _t;
	function vt() {
		_t !== void 0 && (clearTimeout(_t), _t = void 0), k(ht, !1);
	}
	function yt(e = "postHistory.relatedEventsApplied") {
		vt(), k(gt, e, !0), k(ht, !0), e === "postHistory.relatedEventsApplied" && (_t = setTimeout(vt, 1800));
	}
	async function bt(e, t = e.eventId) {
		let n = je();
		yt("postHistory.relatedEventsChecking");
		try {
			await Ue.refreshRelatedEvents(e, t);
		} finally {
			n() && B(gt) === "postHistory.relatedEventsChecking" && vt();
		}
	}
	let xt = b(!1), St = b("postHistory.exportComplete"), Ct = b(F({})), wt, Tt = b(!1), Et = b(null), Dt = b(F([])), kt = b(0), jt = b(F({})), Nt = b(F({})), Pt = b(!1), zt = b(0), Bt = b(0), Vt = b("postHistory.broadcastSent"), Ht, Wt = b(void 0), Gt = b(F({})), Kt = b(F([])), qt = b(-1), $t = b(!1), tn = b(null), nn = b(null), an = b(null), on = b(!1), sn = b(!1), ln = b(null), un = b(0), dn = !1, pn = !1, hn = !1, _n = !1, vn = null, bn = null, Sn = 0, Cn = null, wn = null, Tn = typeof IntersectionObserver < "u", En = b(!1), Dn = null, jn = b(null), Nn = b(!1), Fn = b(!1), In = Fr({
		getShow: () => !K && B(G),
		getSessionOpen: () => I() ?? N(),
		getPosts: () => J.posts.map((e) => ({
			...e,
			content: Zt(e.content, e.tags)
		})),
		getContainer: () => B(nn)
	}), $ = gf({
		getShow: () => !K && B(G),
		getPubkeyHex: () => K ? null : W(),
		getPosts: () => J.posts,
		getLocale: () => l(),
		getContainer: () => B(nn),
		getIsSearchMode: () => J.isSearchMode,
		getSearchQuery: () => J.state.searchQuery
	}), Ln = yn({
		getShow: () => !K && B(G),
		getSessionOpen: () => I() ?? N(),
		getEmojiUrls: () => B(tr),
		onStateChanged: () => In.remeasure()
	});
	function Rn(e) {
		let t = et(e.kind) ? "" : Zt(e.content, e.tags), n = Nu({
			...e,
			content: t
		});
		return Xt({
			kind: e.kind,
			sourceContent: t,
			displayContent: n,
			tags: e.tags,
			media: e.media
		});
	}
	function zn(e) {
		return xn({
			ownerPubkey: W(),
			structure: e,
			rxNostr: _e(),
			relayConfig: ve()
		});
	}
	let Bn = S(() => {
		let e = {};
		for (let t of J.posts) e[t.eventId] = Rn(t);
		return e;
	}), Vn = S(() => J.currentViewRefetchStatusMessageKey ?? J.syncStatusMessageKey), Wn = S(() => J.currentViewRefetchStatusMessageKey ? J.currentViewRefetchStatusMessageValues : null), Gn = S(() => J.syncStatus === "failed" || J.currentViewRefetchStatusMessageKey === "postHistory.repairFetchFailed"), Kn = b(!1), qn = S(() => B(G) && !lt.state.open && !B(ut) && J.isDialogOpenSyncing && B(Vn) === "postHistory.syncing" && J.posts.length > 0);
	z(() => {
		if (k(Kn, !1), !B(qn)) return;
		let e = setTimeout(() => {
			k(Kn, !0);
		}, 1e3);
		return () => clearTimeout(e);
	});
	let Jn = S(() => J.canReturnToLatest || !$.isHistoryScrolledToTop), Yn = S(() => J.canJumpToOldest || !$.isHistoryScrolledToBottom), Xn = S(() => J.isSearchMode ? J.searchResultStatus === "loading" : J.initialLocalLoadStatus === "loading"), Zn = S(() => J.posts.length === 0 && (J.isSearchMode ? J.searchResultStatus === "ready" : J.initialLocalLoadStatus === "ready"));
	z(() => {
		if (!B(G) || B(Fn) || !ue()) return;
		let e = J.isSearchMode ? J.searchResultStatus : J.initialLocalLoadStatus;
		(!W() || J.posts.length > 0 || e === "ready" || e === "failed") && (k(Fn, !0), ue()());
	});
	function Qn(e, t) {
		t[e.id] || (t[e.id] = Xt({
			kind: e.kind,
			sourceContent: e.content,
			tags: e.tags
		}));
	}
	function $n(e, t, n) {
		if (e && !n.has(e.node.eventId)) {
			n.add(e.node.eventId), Qn(e.node.event, t), $n(e.parentNodeState, t, n);
			for (let r of e.replyNodeStates) $n(r, t, n);
		}
	}
	let er = S(() => {
		let e = {};
		for (let t of J.posts) {
			let n = /* @__PURE__ */ new Set();
			for (let n of Kr(t)) n.status === "resolved" && Qn(n.event, e);
			let r = Ue.getAnchorState(t);
			r.parentNode && Qn(r.parentNode.event, e), $n(r.parentNodeState, e, n);
			for (let t of r.replyNodeStates) $n(t, e, n);
		}
		return e;
	}), tr = S(() => {
		let e = /* @__PURE__ */ new Set();
		for (let t of [...Object.values(B(Bn)), ...Object.values(B(er))]) for (let n of t.previewContent.emojiUrls) e.add(n);
		for (let t of J.posts) {
			let n = Ue.getAnchorState(t);
			if (B(Gt)[t.eventId]) for (let t of n.reactionReadModel.groups) t.emojiUrl && e.add(t.emojiUrl);
		}
		for (let t of B(Ge)) {
			if (!B(Gt)[t.eventId]) continue;
			let n = ti(t.eventId);
			for (let t of n?.groups ?? []) t.emojiUrl && e.add(t.emojiUrl);
		}
		return [...e];
	});
	function rr() {
		rt += 1, Me.reset(), Xe.resetState(), li(), qi(), vt(), Ye.resetDeleteConfirmation(), k(ct, !1), lt.setOpen(!1), k(Tt, !1), k(Et, null), k(Qe, !1), k($e, "none"), k(nt, !1), k(it, Ze(), !0), k(at, Ze(), !0), k(ot, !1), k(Z, !1), k(jt, {}, !0), k(Nt, {}, !0), fn(), k(Gt, {}, !0), Ln.resetState(), k(Kt, [], !0), k(qt, -1), k($t, !1);
	}
	function ar() {
		pt?.abort();
	}
	function or() {
		if (Ee) return;
		Ee = !0, rt += 1;
		let e = J.isSearchMode;
		e && $.clearCurrentSessionScrollAnchor(), J.resetSearchState(), J.prepareForClose() ? $.clearAllSessionScrollAnchorsForCurrentPubkey() : e || $.saveCurrentSessionScrollAnchor(), Y.cancelCurrentChannelResolution(), Ue.cancelCurrentGraphFetches(), Ye.resetDeleteConfirmation(), k(ct, !1), lt.setOpen(!1), k(Tt, !1), k(Et, null), k(Qe, !1), k(Z, !1), Xe.hideCopyFloatingMessage(), li(), qi(), vt(), ar(), k($t, !1), k(Kt, [], !0), k(qt, -1), Te++;
	}
	function lr() {
		or(), i.onClose?.();
	}
	C(() => {
		let e = Tn && !J.isSearchMode && J.state.listingMode === "contiguous" && !B(nt) && J.state.hasNewerLocal;
		re(() => B(En)) !== e && (Dn = { anchor: $.captureHistoryScrollAnchor() }, k(En, e, !0));
	}), z(() => {
		B(En);
		let e = re(() => Dn);
		e && ($.restoreHistoryScrollAnchor(e.anchor), Dn = null);
	}), z(() => {
		(I() ?? N()) || re(() => {
			ar(), rr();
		});
	}), z(() => {
		B(ut) && mt && W() !== mt && ar();
	}), z(() => {
		if (!B(G) || !B(Xn) || ue() && !B(Fn)) {
			k(Nn, !1);
			return;
		}
		k(Nn, !1);
		let e = setTimeout(() => {
			B(G) && B(Xn) && k(Nn, !0);
		}, 200);
		return () => {
			clearTimeout(e);
		};
	}), z(() => {
		let e = B(nn);
		if (!e) {
			vn = null, bn = null, k(ln, null);
			return;
		}
		let t = () => {
			let t = Math.max(0, e.clientHeight);
			vn === e ? bn !== t && (bn = t, k(ln, t, !0), Sn += 1, k(un, Sn, !0)) : (vn = e, bn = t, k(ln, t, !0));
		};
		if (t(), typeof ResizeObserver > "u") return;
		let n = new ResizeObserver(t);
		return n.observe(e), () => {
			n.disconnect(), vn === e && (vn = null, bn = null, k(ln, null));
		};
	}), z(() => {
		let e = B(an), t = B(nn), n = B(ln), r = B(un);
		if (!(B(G) && e && t && n !== null && n > 0 && !J.isSearchMode && J.state.listingMode === "contiguous" && J.state.hasOlderLocal && !J.isFetchingOlderFromRelays && !J.isRefetchingAroundCurrentView) || !Tn) {
			dn = !1, hn = !1, Cn = null;
			return;
		}
		let i = Cn, a = i?.scrollTop, o = i?.root === t && i.sentinel === e && i.resizeGeneration !== r, s = !1, c = !0, l = !1, u = !1, d = t.scrollTop, f = () => {
			let r = t.getBoundingClientRect(), i = e.getBoundingClientRect();
			return i.left < r.right && i.right > r.left && i.top <= r.bottom + n * 2 && i.bottom >= r.top;
		}, p = () => {
			hn = !1, dn = !1, l = !1, u = !1;
		}, m = () => {
			c && !l && Tr() && (B(on) ? u = !0 : dn || (u = !1, Dr()));
		};
		Cn = {
			root: t,
			sentinel: e,
			resizeGeneration: r,
			scrollTop: t.scrollTop,
			reconcileAfterCommit: () => {
				c && (d = t.scrollTop, f() || p());
			},
			resumeAfterLoad: () => {
				c && u && (u = !1, f() ? m() : p());
			}
		};
		let h = () => {
			if (!c) return;
			let e = t.scrollTop, n = e > d;
			d = e, f() ? n && (l = !1, hn = !0, m()) : p();
		}, g = new IntersectionObserver((n) => {
			if (!c) return;
			let r = n.filter((t) => t.target === e);
			for (let [e, n] of r.entries()) {
				let i = !s;
				s = !0;
				let c = t.getBoundingClientRect(), u = c.width > 0 && c.height > 0 ? f() : n.isIntersecting, d = r.slice(e + 1).some((e) => e.isIntersecting);
				!n.isIntersecting && u && !d || n.isIntersecting && !u || (hn = n.isIntersecting, n.isIntersecting ? i && o && typeof a == "number" && t.scrollTop <= a ? l = !0 : (l = !1, m()) : p());
			}
		}, {
			root: t,
			rootMargin: `0px 0px ${n * 2}px 0px`,
			threshold: 0
		});
		return f() || p(), g.observe(e), t.addEventListener("scroll", h, { passive: !0 }), () => {
			c = !1, l = !1, u = !1, t.removeEventListener("scroll", h), g.disconnect();
		};
	}), z(() => {
		let e = B(nn), t = B(ln), n = B(un);
		if (!(B(G) && e && t !== null && t > 0 && !J.isSearchMode && J.state.listingMode === "contiguous" && J.state.hasNewerLocal && B(En) && !B(nt) && !J.isRefetchingAroundCurrentView) || !Tn) {
			pn = !1, _n = !1, wn = null;
			return;
		}
		let r = wn, i = r?.scrollTop, a = !0, o = () => {}, s = null;
		return te().then(() => {
			a && (s = requestAnimationFrame(() => {
				if (s = null, !a) return;
				let c = e.querySelector(".post-history-auto-load-newer-sentinel");
				if (!c || B(nn) !== e) return;
				let l = r?.root === e && r.sentinel === c && r.resizeGeneration !== n, u = !1, d = !1, f = !1, p = e.scrollTop, m = () => {
					let n = e.getBoundingClientRect(), r = c.getBoundingClientRect();
					return r.left < n.right && r.right > n.left && r.bottom >= n.top - t * 2 && r.top <= n.bottom;
				}, h = () => {
					_n = !1, pn = !1, d = !1, f = !1;
				}, g = () => {
					a && !d && !pn && Or() && (B(sn) ? f = !0 : (f = !1, Nr()));
				};
				wn = {
					root: e,
					sentinel: c,
					resizeGeneration: n,
					scrollTop: e.scrollTop,
					reconcileAfterCommit: () => {
						a && (p = e.scrollTop, m() || h());
					},
					resumeAfterLoad: () => {
						a && f && (f = !1, m() ? g() : h());
					}
				};
				let _ = () => {
					if (!a) return;
					let t = e.scrollTop, n = t < p;
					p = t, m() ? n && (d = !1, _n = !0, g()) : h();
				}, v = new IntersectionObserver((t) => {
					if (!a) return;
					let n = t.filter((e) => e.target === c);
					for (let [t, r] of n.entries()) {
						let a = !u;
						u = !0;
						let o = e.getBoundingClientRect(), s = o.width > 0 && o.height > 0 ? m() : r.isIntersecting, c = n.slice(t + 1).some((e) => e.isIntersecting);
						!r.isIntersecting && s && !c || r.isIntersecting && !s || (_n = r.isIntersecting, r.isIntersecting ? a && l && typeof i == "number" && e.scrollTop >= i ? d = !0 : (d = !1, g()) : h());
					}
				}, {
					root: e,
					rootMargin: `${t * 2}px 0px 0px 0px`,
					threshold: 0
				});
				m() || h(), v.observe(c), e.addEventListener("scroll", _, { passive: !0 }), o = () => {
					f = !1, d = !1, e.removeEventListener("scroll", _), v.disconnect();
				};
			}));
		}), () => {
			a = !1, s !== null && cancelAnimationFrame(s), o();
		};
	}), ie(() => {
		K = !0, Te++, rt += 1, ar(), fn(), Me.dispose(), qi(), vt();
	}), z(() => {
		if (!B(G) || !ye()?.id) return;
		let e = ye().id, t = je();
		st !== e && (J.posts, Ue.recordPostedReply(ye(), J.posts).then((n) => {
			n && t() && (st = e);
		}).catch(() => void 0));
	}), z(() => {
		let e = J.posts;
		B(G) && e.length !== 0 && (cn(e.map((e) => e.eventId)).catch(() => void 0), re(() => Ue.loadCachedChildInteractionStateForPosts(e)));
	}), z(() => {
		let e = be()?.revision ?? 0, t = be()?.parentEventIds ?? [], n = J.posts;
		if (!B(G) || e <= 0 || t.length === 0) return;
		re(() => Ke.refreshCachedReactions(t)).catch(() => void 0), re(() => Ue.loadCachedChildInteractionStateForPosts(n, t));
		let r = je();
		Un({
			source: "dialog-inbound-save",
			parentEventIds: t,
			rxNostr: _e(),
			relayConfig: ve(),
			isActive: r
		}).then((e) => {
			if (!(!r() || e.deletedReactionEventIds.length === 0 && e.deletedReplyEventIds.length === 0)) return Ue.loadCachedChildInteractionStateForPosts(J.posts, e.checkedParentEventIds);
		}).catch(() => void 0);
	}), z(() => {
		let e = xe()?.revision ?? 0;
		!B(G) || e <= 0 || J.isSearchMode || J.canReturnToLatest || re(() => J.returnToLatest());
	}), z(() => {
		if (B(G)) return () => {
			Y.cancelCurrentChannelResolution();
		};
	});
	function ur(e) {
		return e ? e.values ? a()(e.key, { values: e.values }) : a()(e.key) : null;
	}
	function dr() {
		return ur(Ut({
			totalCount: J.displayTotalCount,
			totalCountKnown: J.displayTotalCountKnown,
			totalCountStatus: J.displayTotalCountStatus,
			isSearchMode: J.isSearchMode
		}));
	}
	function pr(e) {
		if (!e) return null;
		let t = Number(e.year), n = Number(e.month), r = Number(e.day), i = new Date(t, n - 1, r, 23, 59, 59, 999).getTime();
		return Number.isFinite(i) ? Math.floor(i / 1e3) : null;
	}
	function yr() {
		return a()(mn({
			direction: "older",
			isSearchMode: J.isSearchMode
		}));
	}
	function Sr() {
		return a()(mn({
			direction: "newer",
			isSearchMode: J.isSearchMode
		}));
	}
	async function Cr() {
		let e = je();
		if (!e()) return;
		let t = J.isSearchMode, n = t ? $.captureHistoryScrollAnchor() : null, r = await J.loadOlder();
		e() && r && t && $.restoreHistoryScrollAnchor(n);
	}
	function Tr() {
		return B(G) && !J.isSearchMode && J.state.listingMode === "contiguous" && J.state.hasOlderLocal && !J.isRefetchingAroundCurrentView;
	}
	function Er() {
		let e = null;
		return {
			captureAnchorEventId: () => (e = $.captureHistoryScrollAnchor(), e?.eventId ?? null),
			canCommitWindowChange: (e, t, n) => $.canCommitAutoLoadWindowChange(e, t, n),
			onCommitted: () => {
				ce(), $.restoreHistoryScrollAnchor(e, { flushUpdates: !1 }), Cn?.reconcileAfterCommit(), wn?.reconcileAfterCommit();
			}
		};
	}
	async function Dr() {
		let e = je();
		if (!(B(on) || dn || !Tr())) {
			k(on, !0), dn = !0;
			try {
				let t = await J.loadOlder(Er());
				e() && !t && (dn = !1);
			} finally {
				if (!e()) return;
				k(on, !1), hn || (dn = !1), Cn?.resumeAfterLoad();
			}
		}
	}
	function Or() {
		return B(G) && !J.isSearchMode && J.state.listingMode === "contiguous" && J.state.hasNewerLocal && !B(nt) && !J.isRefetchingAroundCurrentView;
	}
	async function Nr() {
		let e = je();
		if (!(B(sn) || pn || !Or())) {
			k(sn, !0), pn = !0;
			try {
				await J.loadNewer(Er());
			} finally {
				if (!e()) return;
				k(sn, !1), _n || (pn = !1), wn?.resumeAfterLoad();
			}
		}
	}
	async function Rr() {
		let e = je();
		if (!e()) return;
		let t = await J.showSavedOlderPosts();
		e() && t && $.resetHistoryScrollSoon();
	}
	async function Vr() {
		let e = je();
		if (!e()) return;
		let t = $.captureHistoryScrollAnchor(), n = B(nn)?.scrollTop ?? null;
		J.state.loadedPosts.length, B(nn)?.scrollHeight, B(nn)?.clientHeight;
		let r = !1, i = () => {
			e() && n !== null && B(G) && B(nn) && (r = $.restoreHistoryScrollAnchor(t, { flushUpdates: !1 }), r || (B(nn).scrollTop = n));
		}, a = await J.fetchOlderFromRelays({
			anchorEventId: t?.eventId,
			viewportCommit: {
				captureAnchorEventId: () => (t = $.captureHistoryScrollAnchor(), e() ? (t && (n = B(nn)?.scrollTop ?? null), t?.eventId ?? null) : null),
				onCommitted: () => {
					ce(), i();
				}
			}
		});
		e() && (await te(), e() && (a && i(), J.latestOlderBackfillUiResult, B(nn)?.scrollTop, B(nn)?.scrollHeight));
	}
	async function Hr() {
		let e = je();
		if (!e()) return;
		let t = J.isSearchMode ? null : $.captureHistoryScrollAnchor(), n = await J.loadNewer();
		e() && n && (J.isSearchMode ? $.resetHistoryScrollSoon() : $.restoreHistoryScrollAnchor(t));
	}
	async function Ur() {
		let e = je();
		if (!e()) return;
		$.clearAllSessionScrollAnchorsForCurrentPubkey();
		let t = J.canReturnToLatest ? await J.returnToLatest() : !1;
		e() && (k(nt, !1), (t || !$.isHistoryScrolledToTop) && $.resetHistoryScrollSoon());
	}
	async function Wr() {
		let e = je();
		if (!e()) return;
		let t = pr(B(it));
		if (t === null) return;
		$.clearAllSessionScrollAnchorsForCurrentPubkey(), k(nt, !0);
		let n = await J.jumpToCreatedAt(t);
		e() && (n || k(nt, !1), n && (k($e, "none"), k(ot, !1), $.resetHistoryScrollSoon()));
	}
	function Gr(e) {
		return B(Bn)[e.eventId] ?? Rn(e);
	}
	function Kr(e) {
		return X.getQuotePreviews(e);
	}
	function qr(e) {
		return B(jt)[e.eventId] === "sending";
	}
	function Jr(e) {
		return B(jt)[e.eventId] === "failed";
	}
	function Yr(e) {
		return B(Nt)[e.eventId] === "sending";
	}
	function Xr(e) {
		return kr(e) !== null;
	}
	function Zr(e) {
		let t = Ue.getAnchorState(e).repliesActionState;
		return ur(en(t)) ?? "";
	}
	function Qr(e) {
		return !!B(Gt)[e.eventId];
	}
	function $r(e) {
		return !!B(Gt)[e];
	}
	function ei(e) {
		k(Gt, {
			...B(Gt),
			[e]: !B(Gt)[e]
		}, !0);
	}
	function ti(e) {
		let t = J.posts.find((t) => t.eventId === e);
		return t && ![6, 16].includes(t.kind) ? Ue.getAnchorState(t).reactionReadModel : Ke.getReadModel(e);
	}
	function ni(e) {
		let t = ti(e);
		return ur(Qt({
			visible: $r(e),
			reactionCount: t?.totalCount ?? 0
		})) ?? "";
	}
	function ri(e) {
		let t = Ue.getAnchorState(e).reactionSummary.totalCount;
		return ur(Qt({
			visible: Qr(e),
			reactionCount: t
		})) ?? "";
	}
	function ii(e) {
		ei(e.eventId);
	}
	function ai(e) {
		let t = Ue.getAnchorState(e).repliesActionState;
		t.status === "failed" || t.status === "loaded" && t.replyCount === 0 ? Ue.retryChildren(e) : Ue.toggleChildren(e);
	}
	function oi(e) {
		return Mr(e, W());
	}
	function si(e) {
		oi(e) && Ye.openDeleteConfirm(e);
	}
	async function ci(e, t) {
		let n = je();
		if (!B(G) || Yr(e)) return;
		let r = di(e, t);
		k(Nt, {
			...B(Nt),
			[e.eventId]: "sending"
		}, !0);
		let i = await Pr.broadcast({
			post: e,
			rxNostr: _e()
		});
		n() && (k(Nt, {
			...B(Nt),
			[e.eventId]: void 0
		}, !0), fi(r, i));
	}
	function li() {
		Ht &&= (clearTimeout(Ht), void 0), k(Pt, !1), k(Wt, void 0);
	}
	function ui(e, t) {
		k(Wt, {
			eventId: e.eventId,
			...It(t.clientX, t.clientY)
		}, !0);
	}
	function di(e, t) {
		if (B(Wt)?.eventId === e.eventId) return {
			x: B(Wt).x,
			y: B(Wt).y
		};
		let n = t.currentTarget, r = n instanceof HTMLElement ? n.getBoundingClientRect() : null;
		return It(r ? r.left + r.width / 2 : 0, r ? r.bottom + 8 : 0);
	}
	function fi(e, t) {
		Ht && clearTimeout(Ht), k(zt, e.x, !0), k(Bt, e.y, !0), k(Vt, t.success ? "postHistory.broadcastSent" : "postHistory.broadcastFailed", !0), k(Pt, !0), Ht = setTimeout(() => {
			k(Pt, !1), Ht = void 0;
		}, 1800);
	}
	function pi(e) {
		let t = Date.now(), n = e.node.event.created_at * 1e3;
		return {
			id: e.node.eventId,
			eventId: e.node.eventId,
			pubkeyHex: e.node.authorPubkey,
			kind: e.node.event.kind,
			content: e.node.event.content,
			tags: e.node.event.tags.map((e) => [...e]),
			createdAt: n,
			postedAt: n,
			relayHints: [...e.node.relayUrls],
			acceptedRelays: [...e.node.relayUrls],
			fetchedRelays: [...e.node.relayUrls],
			media: [],
			rawEvent: e.node.event,
			updatedAt: t,
			schemaVersion: 1
		};
	}
	function mi(e) {
		let t = Date.now(), n = e.created_at * 1e3;
		return {
			id: e.id,
			eventId: e.id,
			pubkeyHex: e.pubkey,
			kind: e.kind,
			content: e.content,
			tags: e.tags.map((e) => [...e]),
			createdAt: n,
			postedAt: n,
			relayHints: [],
			acceptedRelays: [],
			fetchedRelays: [],
			media: [],
			rawEvent: e,
			updatedAt: t,
			schemaVersion: 1
		};
	}
	function hi(e, t) {
		return `quote-preview:${e}:${t}`;
	}
	function gi(e, t) {
		t && Ye.closeAllPostItemMenus(), Ye.setPostMenuOpen(e, t);
	}
	function _i(e, t = []) {
		k(Et, e, !0), k(Dt, [...t], !0), k(kt, B(kt) + 1), k(Tt, !0);
	}
	function vi(e, t) {
		let n = _e(), r = W();
		return gn({
			structure: e,
			relayHints: B(Dt),
			rxNostr: n,
			relayConfig: ve(),
			signal: t
		}).then((e) => t.aborted || n !== _e() || r !== W() ? null : e);
	}
	function yi(e, t) {
		return zn(e)?.observe?.(t) ?? (() => {});
	}
	function bi(e) {
		_i(e.node.event, e.node.relayUrls);
	}
	function xi(e) {
		return Xe.copyState[e] === "failed";
	}
	function Si(e) {
		return B(Nt)[e] === "sending";
	}
	function Ci(e, t) {
		Xe.captureCopyPointerPosition(pi(e), t);
	}
	function wi(e, t) {
		Xe.handleCopyNevent(pi(e), t);
	}
	function Ti(e) {
		Oi(pi(e));
	}
	function Ei() {
		return {
			client: Rt.externalNostrClient,
			customUrlTemplate: Rt.externalNostrClientCustomUrl
		};
	}
	function Di() {
		let e = Mt(Ei());
		return e ? a()("postHistory.openInExternalClient", { values: { client: e } }) : a()("postHistory.openInExternalClientFallback");
	}
	function Oi(e) {
		let t = At(e, Ei(), Ot.value);
		t && window.open(t, "_blank", "noopener,noreferrer");
	}
	function ki(e, t) {
		ui(pi(e), t);
	}
	function Ai(e, t) {
		ci(pi(e), t);
	}
	function ji(e) {
		return Mr(pi(e), W());
	}
	function Mi(e) {
		return B(jt)[e] === "sending";
	}
	function Ni(e) {
		let t = pi(e);
		oi(t) && Ye.openDeleteConfirm(t);
	}
	async function Pi(e) {
		let t = je();
		if (!B(G)) return !1;
		let n = await U()?.(e) ?? !1;
		return n && t() && lr(), n;
	}
	async function Fi(e) {
		if (!de()) return;
		let t = je();
		await de()(e) !== !1 && t() && lr();
	}
	function Ii(e) {
		H() && (H()(e), lr());
	}
	function Li() {
		Ye.cancelDeleteConfirm();
	}
	async function Ri() {
		let e = je();
		e() && (await te(), e() && B($e) === "search" && B(jn)?.focus({ preventScroll: !0 }));
	}
	function zi() {
		B($e) === "search" ? (Bi(), k(Z, !1)) : (k($e, "search"), k(Z, !1), Ri());
	}
	function Bi() {
		$.clearCurrentSessionScrollAnchor(), k($e, "none"), J.resetSearchState();
	}
	async function Vi(e) {
		let t = ++rt;
		k(nt, !0);
		let n = await J.jumpToEventId(e.eventId);
		t === rt && B(G) && (n ? ($.clearAllSessionScrollAnchorsForCurrentPubkey(), k($e, "none"), J.resetSearchState(), $.scrollHistoryEventToTopSoon(e.eventId)) : k(nt, !1));
	}
	function Hi() {
		let e = B($e) !== "jump-date";
		k($e, e ? "jump-date" : "none", !0), e || k(ot, !1), k(Z, !1);
	}
	function Ui() {
		k($e, "none"), k(ot, !1);
	}
	function Wi(e) {
		let t = B(at) ?? B(it);
		t && e !== 0 && k(at, t.add({ years: e }), !0);
	}
	function Gi() {
		k(Qe, !0), k(Z, !1);
	}
	function Ki() {
		k(ct, !0), k(Z, !1);
	}
	function qi() {
		wt &&= (clearTimeout(wt), void 0), k(xt, !1);
	}
	function Ji() {
		let e = /* @__PURE__ */ new Date();
		return [
			String(e.getFullYear()).padStart(4, "0"),
			String(e.getMonth() + 1).padStart(2, "0"),
			String(e.getDate()).padStart(2, "0")
		].join("-");
	}
	function Yi(e) {
		qi(), k(St, e.isPartial ? "postHistory.exportPartial" : "postHistory.exportComplete", !0), k(Ct, {
			exported: e.exportedEventCount,
			skipped: e.skippedPostCount + e.missingDeletionRawEventCount + e.invalidDeletionRawEventCount
		}, !0), k(xt, !0), wt = setTimeout(() => {
			k(xt, !1), wt = void 0;
		}, 5e3);
	}
	async function Xi() {
		if (!W() || B(ut)) return;
		k(ut, !0), k(dt, { phase: "loading" }, !0);
		let e = new AbortController();
		pt = e, mt = W(), k(Z, !1), qi();
		try {
			let { result: t, blob: n } = await Hp.exportForPubkeyInWorker(W(), {
				signal: e.signal,
				onProgress: (t) => {
					!e.signal.aborted && B(G) && pt === e && k(dt, t, !0);
				}
			});
			if (e.signal.aborted) return;
			let r = URL.createObjectURL(n), i = document.createElement("a");
			i.href = r, i.download = `ehagaki-post-history-${Ji()}.jsonl`, i.style.display = "none", A.appendChild(i), i.click(), setTimeout(() => {
				i.remove(), URL.revokeObjectURL?.(r);
			}, 1e3), Yi(t);
		} catch (t) {
			if (e.signal.aborted || t instanceof DOMException && t.name === "AbortError") return;
			k(St, "postHistory.exportFailed"), k(Ct, {}, !0), k(xt, !0), wt = setTimeout(() => {
				k(xt, !1), wt = void 0;
			}, 5e3);
		} finally {
			pt === e && (pt = void 0, mt = void 0, k(ut, !1));
		}
	}
	async function Zi(e) {
		let t = je();
		if (!t()) return;
		let n = W(), r = rt, i = $.captureHistoryScrollAnchor(), a = B(nn)?.scrollTop ?? null;
		await J.refreshAfterRelayScan(e), await te(), t() && B(G) && W() === n && r === rt && B(nn) && !$.restoreHistoryScrollAnchor(i) && a !== null && (B(nn).scrollTop = a);
	}
	async function Qi(e) {
		await ea(() => J.refreshAfterLocalImport(e));
	}
	let $i = "ehagaki-post-history-coverage-import";
	z(() => {
		if (!globalThis.__POST_HISTORY_COVERAGE__) return;
		let e = (e) => {
			if (!(e instanceof CustomEvent)) return;
			let t = e.detail;
			if (!t?.result || typeof t.resolve != "function") return;
			let n = t.resolve;
			Qi(t.result).finally(n);
		};
		return window.addEventListener($i, e), () => {
			window.removeEventListener($i, e);
		};
	});
	async function ea(e) {
		let t = je();
		if (!t()) return;
		let n = W(), r = rt, i = $.captureHistoryScrollAnchor(), a = B(nn)?.scrollTop ?? null;
		await e(), t() && B(G) && W() === n && r === rt && !J.isSearchMode && B(nn) && !$.restoreHistoryScrollAnchor(i) && a !== null && (B(nn).scrollTop = a);
	}
	function ta() {
		k(Z, !1), J.refetchAroundCurrentView();
	}
	function na() {
		let e = je();
		$.clearAllSessionScrollAnchorsForCurrentPubkey(), k(Z, !1), J.jumpToOldest().then((t) => {
			e() && (t || !$.isHistoryScrolledToBottom) && $.resetHistoryScrollToBottomSoon();
		});
	}
	function ra() {
		k(Z, !1), Ur();
	}
	function ia() {
		k(Qe, !1);
	}
	function oa(e) {
		k(Kt, e.mediaList, !0), k(qt, e.index, !0), k($t, e.mediaList.length > 0 && e.index >= 0, !0);
	}
	function sa(e) {
		k(qt, e, !0);
	}
	function ca() {
		k($t, !1), k(Kt, [], !0), k(qt, -1);
	}
	let la = b(!1);
	z(() => {
		B(G) || k(la, !1);
	});
	async function ua() {
		let e = je(), t = Ye.deleteTargetPost;
		if (!t) return;
		k(jt, {
			...B(jt),
			[t.eventId]: "sending"
		}, !0);
		let n = await wr.requestDeletion({
			post: t,
			rxNostr: _e()
		});
		if (e()) {
			if (k(la, n.success && n.sensitivePayloadOmitted === !0, !0), n.success && typeof n.deletedAt == "number" && n.deletionEventId) {
				if (J.patchDeletedPost(t.eventId, n.deletedAt, n.deletionEventId), Ue.recordDeletedEvent({
					eventId: t.eventId,
					authorPubkey: t.pubkeyHex,
					deletionEvent: n.deletionEvent ?? null,
					deletionEventAttestation: n.deletionEventAttestation
				}).catch(() => void 0), k(jt, {
					...B(jt),
					[t.eventId]: void 0
				}, !0), Je(t.kind)) for (let e of J.posts) et(e.kind) && Pe.retry(e);
			} else k(jt, {
				...B(jt),
				[t.eventId]: "failed"
			}, !0);
			Ye.clearDeleteTarget();
		}
	}
	async function da() {
		let e = W(), t = ++rt, n = await J.deleteLocalHistory();
		B(G) && W() === e && t === rt && n && ($.clearAllSessionScrollAnchorsForCurrentPubkey(), k(Qe, !1), k($e, "none"), $.resetHistoryScrollSoon());
	}
	var fa = {
		activate: De,
		suspend: Oe,
		invalidateSession: ke,
		isFullscreen: Ae,
		prepareClose: or
	}, pa = h(), ma = V(pa), ha = (n) => {
		var i = Xm(), c = V(i), u = M(c);
		Ft(u, {
			get show() {
				return B(ht);
			},
			variant: "parent-top",
			children: (e, n) => {
				var r = Up(), i = w(r, !0);
				P((e) => t(i, e), [() => a()(B(gt))]), m(e, r);
			},
			$$slots: { default: !0 }
		});
		var f = E(u, 2), p = (e) => {
			var n = Wp(), r = w(n, !0);
			P((e) => t(r, e), [() => a()("postHistory.sensitivePayloadDeletionOmitted")]), m(e, n);
		};
		d(f, (e) => {
			B(la) && e(p);
		});
		var b = E(f, 2), C = M(b), ee = M(C), N = (e) => {
			var n = Gp(), r = M(n), i = w(r, !0);
			j(n), P(() => t(i, $.currentMonthLabel)), m(e, n);
		};
		d(ee, (e) => {
			$.currentMonthLabel && e(N);
		});
		var te = E(ee, 2);
		{
			let e = S(() => a()("postHistory.jumpToDate"));
			Q(te, {
				className: "post-history-heading-action-button post-history-heading-calendar-button",
				variant: "default",
				shape: "square",
				contentLayout: "icon",
				get ariaLabel() {
					return B(e);
				},
				onClick: Hi,
				children: (e, t) => {
					var n = Kp();
					m(e, n);
				},
				$$slots: { default: !0 }
			});
		}
		j(C);
		var ne = E(C, 2), F = M(ne), I = (e) => {
			{
				let t = S(() => B(dt).phase === "loading" ? a()("postHistory.exportLoading") : B(dt).phase === "verifying" ? a()("postHistory.exportVerifying", { values: {
					processed: B(dt).processed ?? 0,
					total: B(dt).total ?? 0
				} }) : a()("postHistory.exportCreating"));
				Be(e, {
					get text() {
						return B(t);
					},
					showLoader: !0,
					loaderSize: 30,
					state: "loading",
					customClass: "status-loading-placeholder"
				});
			}
		};
		d(F, (e) => {
			B(ut) && e(I);
		});
		var L = E(F, 2);
		{
			let e = S(() => a()("postHistory.repair")), t = S(() => !J.canRefetchAroundCurrentView);
			Q(L, {
				className: "post-history-heading-action-button post-history-heading-refetch-button",
				variant: "default",
				shape: "square",
				contentLayout: "icon",
				get ariaLabel() {
					return B(e);
				},
				get disabled() {
					return B(t);
				},
				onClick: ta,
				children: (e, t) => {
					var n = qp();
					m(e, n);
				},
				$$slots: { default: !0 }
			});
		}
		var re = E(L, 2);
		{
			let e = S(() => a()(B($e) === "search" ? "postHistory.hideSearch" : "postHistory.showSearch"));
			Q(re, {
				className: "post-history-heading-action-button post-history-heading-search-button",
				variant: "default",
				shape: "square",
				contentLayout: "icon",
				get ariaLabel() {
					return B(e);
				},
				onClick: zi,
				children: (e, t) => {
					var n = Jp();
					m(e, n);
				},
				$$slots: { default: !0 }
			});
		}
		var R = E(re, 2);
		s(R, () => Mn, (e, n) => {
			n(e, {
				get open() {
					return B(Z);
				},
				set open(e) {
					k(Z, e, !0);
				},
				children: (e, n) => {
					var r = rm(), i = V(r);
					{
						let e = S(() => `menu-trigger post-history-menu-trigger post-history-heading-menu-trigger ${B(Z) ? "is-open" : ""}`.trim()), t = S(() => a()("postHistory.openMenu"));
						s(i, () => Pn, (n, r) => {
							r(n, {
								get class() {
									return B(e);
								},
								get "aria-label"() {
									return B(t);
								},
								children: (e, t) => {
									var n = Yp();
									m(e, n);
								},
								$$slots: { default: !0 }
							});
						});
					}
					var o = E(i, 2);
					s(o, () => Lt, (e, n) => {
						n(e, {
							get to() {
								return A;
							},
							children: (e, n) => {
								var r = h(), i = V(r);
								s(i, () => An, (e, n) => {
									n(e, {
										side: "bottom",
										align: "end",
										sideOffset: 8,
										class: "post-history-menu-content",
										trapFocus: !1,
										preventScroll: !1,
										onCloseAutoFocus: (e) => e.preventDefault(),
										children: (e, n) => {
											var r = nm(), i = M(r), o = (e) => {
												var n = Xp(), r = V(n), i = M(r), a = w(i, !0);
												j(r);
												var o = E(r, 2);
												s(o, () => kn, (e, t) => {
													t(e, { class: "post-history-menu-separator" });
												}), P((e) => t(a, e), [() => dr()]), m(e, n);
											}, c = S(() => dr());
											d(i, (e) => {
												B(c) && e(o);
											});
											var l = E(i, 2);
											{
												let e = S(() => !B(Jn));
												s(l, () => On, (n, r) => {
													r(n, {
														class: "menu-action-button",
														get disabled() {
															return B(e);
														},
														onSelect: ra,
														children: (e, n) => {
															var r = Zp(), i = E(V(r), 2), o = w(i, !0);
															P((e) => t(o, e), [() => a()("postHistory.returnToLatest")]), m(e, r);
														},
														$$slots: { default: !0 }
													});
												});
											}
											var u = E(l, 2);
											{
												let e = S(() => !B(Yn));
												s(u, () => On, (n, r) => {
													r(n, {
														class: "menu-action-button",
														get disabled() {
															return B(e);
														},
														onSelect: na,
														children: (e, n) => {
															var r = Qp(), i = E(V(r), 2), o = w(i, !0);
															P((e) => t(o, e), [() => a()("postHistory.jumpToOldest")]), m(e, r);
														},
														$$slots: { default: !0 }
													});
												});
											}
											var f = E(u, 2);
											s(f, () => kn, (e, t) => {
												t(e, { class: "post-history-menu-separator" });
											});
											var p = E(f, 2);
											{
												let e = S(() => !W() || B(ut));
												s(p, () => On, (n, r) => {
													r(n, {
														class: "menu-action-button",
														get disabled() {
															return B(e);
														},
														onSelect: Xi,
														children: (e, n) => {
															var r = $p(), i = E(V(r), 2), o = w(i, !0);
															P((e) => t(o, e), [() => a()("postHistory.export")]), m(e, r);
														},
														$$slots: { default: !0 }
													});
												});
											}
											var h = E(p, 2);
											{
												let e = S(() => !W());
												s(h, () => On, (n, r) => {
													r(n, {
														class: "menu-action-button",
														get disabled() {
															return B(e);
														},
														onSelect: Ki,
														children: (e, n) => {
															var r = em(), i = E(V(r), 2), o = w(i, !0);
															P((e) => t(o, e), [() => a()("postHistory.import")]), m(e, r);
														},
														$$slots: { default: !0 }
													});
												});
											}
											var g = E(h, 2);
											{
												let e = S(() => !W() || !_e());
												s(g, () => On, (n, r) => {
													r(n, {
														class: "menu-action-button",
														get disabled() {
															return B(e);
														},
														onSelect: () => {
															k(Z, !1), lt.setOpen(!0);
														},
														children: (e, n) => {
															var r = em(), i = E(V(r), 2), o = w(i, !0);
															P((e) => t(o, e), [() => a()("postHistory.fullScanTitle")]), m(e, r);
														},
														$$slots: { default: !0 }
													});
												});
											}
											var _ = E(g, 2);
											s(_, () => kn, (e, t) => {
												t(e, { class: "post-history-menu-separator" });
											});
											var v = E(_, 2);
											s(v, () => On, (e, n) => {
												n(e, {
													class: "menu-action-button menu-action-button-danger",
													onSelect: Gi,
													children: (e, n) => {
														var r = tm(), i = E(V(r), 2), o = w(i, !0);
														P((e) => t(o, e), [() => a()("postHistory.deleteLocalHistory")]), m(e, r);
													},
													$$slots: { default: !0 }
												});
											}), j(r), m(e, r);
										},
										$$slots: { default: !0 }
									});
								}), m(e, r);
							},
							$$slots: { default: !0 }
						});
					}), m(e, r);
				},
				$$slots: { default: !0 }
			});
		}), j(ne), j(b), T(b, (e) => k(tn, e), () => B(tn));
		var z = E(b, 2), ie = (e) => {
			var t = om(), n = M(t);
			let r;
			var i = M(n), o = M(i), s = (e) => {
				Be(e, {
					variant: "spinner",
					showLoader: !0,
					loaderSize: 24,
					ariaHidden: !0,
					customClass: "post-history-search-spinner"
				});
			}, c = (e) => {
				var t = im();
				m(e, t);
			};
			d(o, (e) => {
				J.isSearchPageLoading ? e(s) : e(c, -1);
			}), j(i);
			var l = E(i, 2);
			y(l), T(l, (e) => k(jn, e), () => B(jn)), j(n);
			var u = E(n, 2);
			{
				let e = S(() => a()("postHistory.hideSearch"));
				Q(u, {
					type: "button",
					class: "post-history-search-close",
					contentLayout: "icon",
					shape: "square",
					get ariaLabel() {
						return B(e);
					},
					onClick: Bi,
					children: (e, t) => {
						var n = am();
						m(e, n);
					},
					$$slots: { default: !0 }
				});
			}
			j(t), P((e, t) => {
				r = oe(n, 1, "post-history-search-input-wrapper svelte-9hvdbo", null, r, { "post-history-search-active": J.isSearchMode }), ae(l, "placeholder", e), ae(l, "aria-label", t), ae(l, "aria-busy", J.isSearchPageLoading ? "true" : "false");
			}, [() => a()("postHistory.searchPlaceholder"), () => a()("postHistory.search")]), O(l, () => J.state.searchInput, (e) => J.state.searchInput = e), m(e, t);
		};
		d(z, (e) => {
			B($e) === "search" && e(ie);
		});
		var se = E(z, 2), ce = (n) => {
			var i = fm(), c = M(i), u = w(c, !0), d = E(c, 2), f = M(d);
			{
				let n = S(() => l() ?? void 0), i = S(() => a()("postHistory.jumpToDateLabel"));
				s(f, () => Wc, (c, l) => {
					l(c, {
						get locale() {
							return B(n);
						},
						get calendarLabel() {
							return B(i);
						},
						get value() {
							return B(it);
						},
						set value(e) {
							k(it, e, !0);
						},
						get placeholder() {
							return B(at);
						},
						set placeholder(e) {
							k(at, e, !0);
						},
						get open() {
							return B(ot);
						},
						set open(e) {
							k(ot, e, !0);
						},
						children: (n, i) => {
							var c = um(), l = V(c);
							{
								let n = (n, i) => {
									let a = () => (i?.()).segments;
									var c = h(), l = V(c);
									r(l, 19, a, (e, t) => `${e.part}-${t}`, (n, r) => {
										var i = h(), a = V(i);
										s(a, () => Vc, (n, i) => {
											i(n, {
												class: "post-history-date-picker-segment",
												get part() {
													return B(r).part;
												},
												children: (n, i) => {
													e();
													var a = o();
													P(() => t(a, B(r).value)), m(n, a);
												},
												$$slots: { default: !0 }
											});
										}), m(n, i);
									}), m(n, c);
								};
								s(l, () => Rc, (e, t) => {
									t(e, {
										"aria-labelledby": "post-history-jump-date-label",
										class: "post-history-date-picker-input",
										children: n,
										$$slots: { default: !0 }
									});
								});
							}
							var u = E(l, 2);
							{
								let e = S(() => a()("postHistory.jumpToDate"));
								s(u, () => Zc, (t, n) => {
									n(t, {
										class: "post-history-date-picker-trigger",
										get "aria-label"() {
											return B(e);
										},
										children: (e, t) => {
											var n = Kp();
											m(e, n);
										},
										$$slots: { default: !0 }
									});
								});
							}
							var d = E(u, 2);
							s(d, () => Lt, (n, i) => {
								i(n, {
									get to() {
										return A;
									},
									children: (n, i) => {
										var a = h(), c = V(a);
										s(c, () => Yc, (n, i) => {
											i(n, {
												sideOffset: 8,
												class: "post-history-date-picker-content",
												children: (n, i) => {
													var a = h(), c = V(a);
													{
														let n = (n, i) => {
															let a = () => (i?.()).months, c = () => (i?.()).weekdays;
															var l = rm(), u = V(l);
															s(u, () => nc, (e, t) => {
																t(e, {
																	class: "post-history-date-picker-header",
																	children: (e, t) => {
																		var n = lm(), r = V(n), i = E(r, 2);
																		s(i, () => dc, (e, t) => {
																			t(e, {
																				class: "post-history-date-picker-nav",
																				"aria-label": "Previous month",
																				children: (e, t) => {
																					var n = sm();
																					m(e, n);
																				},
																				$$slots: { default: !0 }
																			});
																		});
																		var a = E(i, 2);
																		s(a, () => ac, (e, t) => {
																			t(e, { class: "post-history-date-picker-heading" });
																		});
																		var o = E(a, 2);
																		s(o, () => cc, (e, t) => {
																			t(e, {
																				class: "post-history-date-picker-nav",
																				"aria-label": "Next month",
																				children: (e, t) => {
																					var n = cm();
																					m(e, n);
																				},
																				$$slots: { default: !0 }
																			});
																		});
																		var c = E(o, 2);
																		g("click", r, () => Wi(-1)), g("click", c, () => Wi(1)), m(e, n);
																	},
																	$$slots: { default: !0 }
																});
															});
															var d = E(u, 2);
															r(d, 19, a, (e, t) => `${e.value.toString()}-${t}`, (n, i) => {
																var a = h(), l = V(a);
																s(l, () => Rs, (n, a) => {
																	a(n, {
																		class: "post-history-date-picker-grid",
																		children: (n, a) => {
																			var l = rm(), u = V(l);
																			s(u, () => qs, (n, i) => {
																				i(n, {
																					children: (n, i) => {
																						var a = h(), l = V(a);
																						s(l, () => $s, (n, i) => {
																							i(n, {
																								children: (n, i) => {
																									var a = h(), l = V(a);
																									r(l, 19, c, (e, t) => `${e}-${t}`, (n, r) => {
																										var i = h(), a = V(i);
																										s(a, () => Xs, (n, i) => {
																											i(n, {
																												class: "post-history-date-picker-weekday",
																												children: (n, i) => {
																													e();
																													var a = o();
																													P(() => t(a, B(r))), m(n, a);
																												},
																												$$slots: { default: !0 }
																											});
																										}), m(n, i);
																									}), m(n, a);
																								},
																								$$slots: { default: !0 }
																							});
																						}), m(n, a);
																					},
																					$$slots: { default: !0 }
																				});
																			});
																			var d = E(u, 2);
																			s(d, () => Vs, (n, a) => {
																				a(n, {
																					children: (n, a) => {
																						var c = h(), l = V(c);
																						r(l, 19, () => B(i).weeks, (e, t) => `${B(i).value.toString()}-week-${t}`, (n, a) => {
																							var c = h(), l = V(c);
																							s(l, () => $s, (n, c) => {
																								c(n, {
																									children: (n, c) => {
																										var l = h(), u = V(l);
																										r(u, 19, () => B(a), (e, t) => `${e.toString()}-${t}`, (n, r) => {
																											var a = h(), c = V(a);
																											s(c, () => Ws, (n, a) => {
																												a(n, {
																													get date() {
																														return B(r);
																													},
																													get month() {
																														return B(i).value;
																													},
																													children: (n, i) => {
																														var a = h(), c = V(a);
																														s(c, () => Fs, (n, i) => {
																															i(n, {
																																class: "post-history-date-picker-day",
																																children: (n, i) => {
																																	e();
																																	var a = o();
																																	P(() => t(a, B(r).day)), m(n, a);
																																},
																																$$slots: { default: !0 }
																															});
																														}), m(n, a);
																													},
																													$$slots: { default: !0 }
																												});
																											}), m(n, a);
																										}), m(n, l);
																									},
																									$$slots: { default: !0 }
																								});
																							}), m(n, c);
																						}), m(n, c);
																					},
																					$$slots: { default: !0 }
																				});
																			}), m(n, l);
																		},
																		$$slots: { default: !0 }
																	});
																}), m(n, a);
															}), m(n, l);
														};
														s(c, () => qc, (e, t) => {
															t(e, {
																class: "post-history-date-picker-calendar",
																children: n,
																$$slots: { default: !0 }
															});
														});
													}
													m(n, a);
												},
												$$slots: { default: !0 }
											});
										}), m(n, a);
									},
									$$slots: { default: !0 }
								});
							}), m(n, c);
						},
						$$slots: { default: !0 }
					});
				});
			}
			var p = E(f, 2);
			{
				let e = S(() => a()("postHistory.jumpToDateSubmit"));
				Q(p, {
					type: "button",
					variant: "primary",
					contentLayout: "icon",
					shape: "square",
					get ariaLabel() {
						return B(e);
					},
					className: "post-history-utility-button post-history-utility-submit-button",
					onClick: () => void Wr(),
					children: (e, t) => {
						var n = dm();
						m(e, n);
					},
					$$slots: { default: !0 }
				});
			}
			var _ = E(p, 2);
			{
				let e = S(() => a()("postHistory.hideJumpToDate"));
				Q(_, {
					type: "button",
					variant: "default",
					contentLayout: "icon",
					shape: "square",
					get ariaLabel() {
						return B(e);
					},
					className: "post-history-utility-button post-history-utility-close-button",
					onClick: Ui,
					children: (e, t) => {
						var n = am();
						m(e, n);
					},
					$$slots: { default: !0 }
				});
			}
			j(d), j(i), P((e) => t(u, e), [() => a()("postHistory.jumpToDateLabel")]), m(n, i);
		};
		d(se, (e) => {
			B($e) === "jump-date" && e(ce);
		});
		var le = E(se, 2), ue = M(le), fe = (e) => {
			var t = pm(), n = M(t);
			Be(n, {
				variant: "spinner",
				showLoader: !0,
				loaderSize: 24
			}), j(t), m(e, t);
		}, he = (e) => {
			var n = mm(), r = M(n), i = w(r, !0);
			j(n), P((e) => t(i, e), [() => J.isSearchMode ? a()("postHistory.searchNoResults") : a()("postHistory.empty")]), m(e, n);
		}, ve = (e) => {
			var n = Wm(), i = V(n), o = (e) => {
				var n = gm(), r = M(n);
				{
					let e = S(() => !J.canLoadNewer);
					Q(r, {
						type: "button",
						variant: "default",
						className: "post-history-nav-button",
						contentLayout: "iconText",
						get disabled() {
							return B(e);
						},
						onClick: () => void Hr(),
						children: (e, n) => {
							var r = hm(), i = E(V(r));
							P((e) => t(i, ` ${e ?? ""}`), [() => Sr()]), m(e, r);
						},
						$$slots: { default: !0 }
					});
				}
				j(n), m(e, n);
			};
			d(i, (e) => {
				(J.isSearchMode ? J.canLoadNewer : J.state.hasNewerLocal && (B(nt) || !Tn || J.state.listingMode !== "contiguous")) && e(o);
			});
			var c = E(i, 2), u = (e) => {
				var t = vm();
				let n;
				var r = M(t), i = (e) => {
					var t = _m(), n = M(t), r = (e) => {
						Be(e, {
							variant: "spinner",
							showLoader: !0,
							loaderSize: 24,
							ariaHidden: !0
						});
					};
					d(n, (e) => {
						B(sn) && e(r);
					}), j(t), m(e, t);
				};
				d(r, (e) => {
					B(En) && J.state.hasNewerLocal && e(i);
				}), j(t), P(() => n = oe(t, 1, "post-history-auto-load-slot post-history-auto-load-newer-slot svelte-9hvdbo", null, n, { "post-history-auto-load-newer-slot-reserved": B(En) })), m(e, t);
			};
			d(c, (e) => {
				Tn && !J.isSearchMode && J.state.listingMode === "contiguous" && !B(nt) && e(u);
			});
			var f = E(c, 2);
			r(f, 21, () => J.posts, (e) => e.eventId, (e, n) => {
				let i = S(() => Ue.getAnchorState(B(n)));
				var o = Pm();
				let c;
				var u = M(o), f = M(u), p = M(f), g = (e) => {
					{
						let t = S(() => U() ? Pi : void 0), r = S(() => Pe.getPreview(B(n))), i = S(() => Ve(B(n))), a = S(() => de() ? Fi : void 0), o = S(() => H() ? Ii : void 0), s = S(() => zn(Pe.getPreview(B(n)).event));
						sr(e, {
							get onReactionPost() {
								return B(t);
							},
							get reactionExtras() {
								return _;
							},
							get reactionDetails() {
								return x;
							},
							get post() {
								return B(n);
							},
							get preview() {
								return B(r);
							},
							get channelText() {
								return B(i);
							},
							get menu() {
								return D;
							},
							onRetry: () => Pe.retry(B(n)),
							get onReplyPost() {
								return B(a);
							},
							get onQuotePost() {
								return B(o);
							},
							get loadSensitiveBody() {
								return B(s);
							},
							get scrollRoot() {
								return B(nn);
							},
							onImageOpen: oa,
							get emojiLoadStateByUrl() {
								return Ln.emojiLoadStateByUrl;
							},
							get emojiImageMetaByUrl() {
								return Ln.emojiImageMetaByUrl;
							}
						});
					}
				}, v = S(() => et(B(n).kind)), y = (e) => {
					var o = Nm(), c = V(o), u = (e) => {
						var r = Em(), i = M(r), o = (e) => {
							var r = ym(), i = E(M(r), 2), o = w(i, !0), s = E(i, 2), c = w(s, !0);
							j(r), P((e, n) => {
								t(o, e), t(c, n);
							}, [() => a()("postHistory.channel"), () => Y.getChannelText(B(n), a())]), m(e, r);
						};
						d(i, (e) => {
							B(n).kind === 42 && e(o);
						});
						var c = E(i, 2), u = M(c), f = (e) => {
							var r = Sm(), i = M(r), o = (e) => {
								var n = bm(), r = w(n, !0);
								P((e) => t(r, e), [() => a()("postHistory.deletedBadge")]), m(e, n);
							};
							d(i, (e) => {
								B(n).deletedAt && e(o);
							});
							var s = E(i, 2), c = (e) => {
								var n = xm(), r = w(n, !0);
								P((e) => t(r, e), [() => a()("postHistory.deleteFailed")]), m(e, n);
							}, l = S(() => Jr(B(n)));
							d(s, (e) => {
								B(l) && e(c);
							}), j(r), m(e, r);
						}, p = S(() => B(n).deletedAt || Jr(B(n)));
						d(u, (e) => {
							B(p) && e(f);
						});
						var g = E(u, 2), _ = (e) => {
							var r = Tm(), i = V(r), o = w(i, !0), c = E(i, 2);
							{
								let e = S(() => Ye.isPostMenuOpen(B(n).eventId));
								s(c, () => Mn, (r, i) => {
									i(r, {
										get open() {
											return B(e);
										},
										onOpenChange: (e) => gi(B(n).eventId, e),
										children: (e, r) => {
											var i = rm(), o = V(i);
											s(o, () => Pn, (e, t) => {
												t(e, {
													class: "menu-trigger post-history-menu-trigger",
													"aria-label": "アクションを表示",
													children: (e, t) => {
														var n = Yp();
														m(e, n);
													},
													$$slots: { default: !0 }
												});
											});
											var c = E(o, 2);
											s(c, () => Lt, (e, r) => {
												r(e, {
													get to() {
														return A;
													},
													children: (e, r) => {
														var i = h(), o = V(i);
														s(o, () => An, (e, r) => {
															r(e, {
																side: "bottom",
																align: "start",
																sideOffset: 8,
																class: "post-history-menu-content",
																trapFocus: !1,
																preventScroll: !1,
																onCloseAutoFocus: (e) => e.preventDefault(),
																children: (e, r) => {
																	var i = wm(), o = M(i), c = w(o, !0), u = E(o, 2);
																	s(u, () => kn, (e, t) => {
																		t(e, { class: "post-history-menu-separator" });
																	});
																	var f = E(u, 2), p = (e) => {
																		var r = rm(), i = V(r);
																		s(i, () => On, (e, r) => {
																			r(e, {
																				class: "menu-action-button",
																				onSelect: () => void Vi(B(n)),
																				children: (e, n) => {
																					var r = Cm(), i = E(V(r), 2), o = w(i, !0);
																					P((e) => t(o, e), [() => a()("postHistory.showSurroundingPosts")]), m(e, r);
																				},
																				$$slots: { default: !0 }
																			});
																		});
																		var o = E(i, 2);
																		s(o, () => kn, (e, t) => {
																			t(e, { class: "post-history-menu-separator" });
																		}), m(e, r);
																	};
																	d(f, (e) => {
																		J.isSearchMode && e(p);
																	});
																	var h = E(f, 2);
																	{
																		let e = S(() => Re(B(n)) ? () => void ze(B(n)) : void 0), t = S(() => Xe.copyState[B(n).eventId] === "failed"), r = S(() => Xr(B(n))), i = S(() => Yr(B(n))), a = S(() => oi(B(n))), o = S(() => qr(B(n))), s = S(Di);
																		ol(h, {
																			order: "standard",
																			get onRepost() {
																				return B(e);
																			},
																			get repostPending() {
																				return pe();
																			},
																			get copyFailed() {
																				return B(t);
																			},
																			get showBroadcast() {
																				return B(r);
																			},
																			get broadcastSending() {
																				return B(i);
																			},
																			get showDelete() {
																				return B(a);
																			},
																			showDeleteSeparator: !1,
																			get deletionSending() {
																				return B(o);
																			},
																			onCopyPointerDown: (e) => Xe.captureCopyPointerPosition(B(n), e),
																			onCopyNevent: (e) => void Xe.handleCopyNevent(B(n), e),
																			get externalClientLabel() {
																				return B(s);
																			},
																			onOpenExternalClient: () => Oi(B(n)),
																			onShowRawJson: () => _i(B(n).rawEvent, [
																				...B(n).relayHints,
																				...B(n).acceptedRelays,
																				...B(n).fetchedRelays ?? []
																			]),
																			onBroadcastPointerDown: (e) => ui(B(n), e),
																			onBroadcastPost: (e) => void ci(B(n), e),
																			onOpenDeleteConfirm: () => si(B(n))
																		});
																	}
																	j(i), P((e) => t(c, e), [() => rn(B(n).postedAt, l())]), m(e, i);
																},
																$$slots: { default: !0 }
															});
														}), m(e, i);
													},
													$$slots: { default: !0 }
												});
											}), m(e, i);
										},
										$$slots: { default: !0 }
									});
								});
							}
							P((e) => t(o, e), [() => Yt(B(n).postedAt)]), m(e, r);
						};
						d(g, (e) => {
							de() || H() || e(_);
						}), j(c), j(r), m(e, r);
					}, f = S(() => B(n).kind === 42 || B(n).deletedAt || Jr(B(n)) || !(de() || H()));
					d(c, (e) => {
						B(f) && e(u);
					});
					var p = E(c, 2);
					{
						let e = S(() => U() ? Pi : void 0), t = S(() => de() ? Fi : void 0), r = S(() => H() ? Ii : void 0), a = S(Di);
						Cu(p, {
							onRefreshRelatedEvents: (e) => void bt(B(n), e),
							get onReactionPost() {
								return B(e);
							},
							get state() {
								return B(i);
							},
							section: "parent",
							get previewModelByEventId() {
								return B(er);
							},
							getSensitiveBodyLoader: zn,
							get emojiLoadStateByUrl() {
								return Ln.emojiLoadStateByUrl;
							},
							get emojiImageMetaByUrl() {
								return Ln.emojiImageMetaByUrl;
							},
							get scrollRoot() {
								return B(nn);
							},
							onImageOpen: oa,
							buildPostRecordForNode: pi,
							get onReplyPost() {
								return B(t);
							},
							get onQuotePost() {
								return B(r);
							},
							onToggleParent: () => $.preserveThreadParentToggleScroll(B(n).eventId, B(n).eventId, () => Ue.toggleParent(B(n))),
							onRetryParent: () => Ue.retryParent(B(n)),
							onToggleNodeParent: (e) => $.preserveThreadParentToggleScroll(B(n).eventId, e, () => Ue.toggleNodeParent(B(n), e)),
							onRetryNodeParent: (e) => Ue.retryNodeParent(B(n), e),
							onToggleNodeChildren: (e) => Ue.toggleNodeChildren(B(n), e),
							onRetryNodeChildren: (e) => Ue.retryNodeChildren(B(n), e),
							onCopyPointerDown: Ci,
							onCopyNevent: wi,
							get externalClientLabel() {
								return B(a);
							},
							onOpenExternalClient: Ti,
							isCopyFailed: xi,
							onShowRawJson: bi,
							onBroadcastPointerDown: ki,
							onBroadcastPost: Ai,
							isBroadcastSending: Si,
							canDeleteNodePost: ji,
							isDeletionSending: Mi,
							onOpenDeleteConfirm: Ni
						});
					}
					var g = E(p, 2), _ = M(g), v = M(_);
					{
						let e = (e) => {
							{
								let t = S(() => In.shouldCollapsePost(B(n))), r = S(() => In.isPostExpanded(B(n))), i = S(() => "post-preview-content-" + B(n).eventId);
								br(e, {
									placement: "overlay",
									get visible() {
										return B(t);
									},
									get expanded() {
										return B(r);
									},
									get controls() {
										return B(i);
									},
									onToggle: () => In.togglePostExpanded(B(n).eventId)
								});
							}
						}, t = (e) => {
							var t = h(), i = V(t), o = (e) => {
								var t = Dm();
								r(t, 21, () => Kr(B(n)), (e) => e.eventId, (e, t) => {
									{
										let r = (e) => {
											var n = h(), r = V(n), i = (e) => {
												let n = S(() => mi(B(t).event));
												{
													let r = (e) => {
														let n = S(() => ti(B(t).event.id));
														var r = h(), i = V(r), a = (e) => {
															{
																let r = S(() => $r(B(t).event.id)), i = S(() => ni(B(t).event.id));
																gr(e, {
																	get count() {
																		return B(n).totalCount;
																	},
																	get expanded() {
																		return B(r);
																	},
																	get ariaLabel() {
																		return B(i);
																	},
																	onToggle: () => ei(B(t).event.id)
																});
															}
														};
														d(i, (e) => {
															B(n) && B(n).totalCount > 0 && e(a);
														}), m(e, r);
													}, i = S(() => U() ? Pi : void 0), a = S(() => B(t).event.kind !== 42 && de() ? Fi : void 0), o = S(() => B(t).event.kind !== 42 && H() ? Ii : void 0);
													cr(e, {
														get onReactionPost() {
															return B(i);
														},
														get post() {
															return B(n);
														},
														get onReplyPost() {
															return B(a);
														},
														get onQuotePost() {
															return B(o);
														},
														reactionExtras: r,
														$$slots: { reactionExtras: !0 }
													});
												}
											}, a = S(() => B(t).status === "resolved" && (B(t).event.kind !== 42 || U() || (ti(B(t).event.id)?.totalCount ?? 0) > 0));
											d(r, (e) => {
												B(a) && e(i);
											}), m(e, n);
										}, i = (e) => {
											var n = h(), r = V(n), i = (e) => {
												let n = S(() => ti(B(t).event.id));
												var r = h(), i = V(r), a = (e) => {
													jr(e, {
														get readModel() {
															return B(n);
														},
														get emojiLoadStateByUrl() {
															return Ln.emojiLoadStateByUrl;
														},
														get emojiImageMetaByUrl() {
															return Ln.emojiImageMetaByUrl;
														}
													});
												}, o = S(() => B(n) && B(n).totalCount > 0 && $r(B(t).event.id));
												d(i, (e) => {
													B(o) && e(a);
												}), m(e, r);
											};
											d(r, (e) => {
												B(t).status === "resolved" && e(i);
											}), m(e, n);
										}, o = (e) => {
											var r = h(), i = V(r), o = (e) => {
												let r = S(() => mi(B(t).event)), i = S(() => hi(B(n).eventId, B(r).eventId)), o = S(() => a()("common.showActions"));
												{
													let t = (e) => {
														{
															let t = S(() => Xe.copyState[B(r).eventId] === "failed"), n = S(() => Xr(B(r))), i = S(() => Yr(B(r))), a = S(() => oi(B(r))), o = S(() => qr(B(r))), s = S(Di);
															ol(e, {
																order: "standard",
																get copyFailed() {
																	return B(t);
																},
																get showBroadcast() {
																	return B(n);
																},
																get broadcastSending() {
																	return B(i);
																},
																get showDelete() {
																	return B(a);
																},
																showDeleteSeparator: !0,
																get deletionSending() {
																	return B(o);
																},
																onCopyPointerDown: (e) => Xe.captureCopyPointerPosition(B(r), e),
																onCopyNevent: (e) => void Xe.handleCopyNevent(B(r), e),
																get externalClientLabel() {
																	return B(s);
																},
																onOpenExternalClient: () => Oi(B(r)),
																onShowRawJson: () => _i(B(r).rawEvent, [
																	...B(r).relayHints,
																	...B(r).acceptedRelays,
																	...B(r).fetchedRelays ?? []
																]),
																onBroadcastPointerDown: (e) => ui(B(r), e),
																onBroadcastPost: (e) => void ci(B(r), e),
																onOpenDeleteConfirm: () => si(B(r))
															});
														}
													}, n = S(() => Ye.isPostMenuOpen(B(i))), a = S(() => rn(B(r).postedAt, l()));
													zr(e, {
														get open() {
															return B(n);
														},
														onOpenChange: (e) => gi(B(i), e),
														get triggerAriaLabel() {
															return B(o);
														},
														get tooltipContent() {
															return B(o);
														},
														enableTooltip: !0,
														get timestamp() {
															return B(a);
														},
														items: t,
														$$slots: { items: !0 }
													});
												}
											};
											d(i, (e) => {
												B(t).status === "resolved" && e(o);
											}), m(e, r);
										}, s = S(() => B(t).status === "resolved" ? zn(B(t).event) : void 0), c = S(() => B(t).status === "resolved" ? B(er)[B(t).event.id] : void 0);
										ll(e, {
											get preview() {
												return B(t);
											},
											get loadSensitiveBody() {
												return B(s);
											},
											get model() {
												return B(c);
											},
											get emojiLoadStateByUrl() {
												return Ln.emojiLoadStateByUrl;
											},
											get emojiImageMetaByUrl() {
												return Ln.emojiImageMetaByUrl;
											},
											get scrollRoot() {
												return B(nn);
											},
											onImageOpen: oa,
											onRetry: () => X.retryQuotePreview(B(t).eventId),
											footerActions: r,
											footerDetails: i,
											footerMenu: o,
											$$slots: {
												footerActions: !0,
												footerDetails: !0,
												footerMenu: !0
											}
										});
									}
								}), j(t), m(e, t);
							}, s = S(() => Kr(B(n)).length > 0);
							d(i, (e) => {
								B(s) && e(o);
							}), m(e, t);
						}, i = S(() => Gr(B(n))), o = S(() => zn(B(n).rawEvent)), s = S(() => "post-preview-content-" + B(n).eventId), c = S(() => !In.isPostExpanded(B(n)));
						Jt(v, {
							get model() {
								return B(i);
							},
							get loadSensitiveBody() {
								return B(o);
							},
							resolveSensitiveDisplayContent: (e) => Nu({
								content: e,
								tags: B(n).tags
							}),
							get contentWarningEventId() {
								return B(n).eventId;
							},
							density: "standard",
							get emojiLoadStateByUrl() {
								return Ln.emojiLoadStateByUrl;
							},
							get emojiImageMetaByUrl() {
								return Ln.emojiImageMetaByUrl;
							},
							get scrollRoot() {
								return B(nn);
							},
							get previewCollapseAction() {
								return In.previewRef;
							},
							get previewCollapseEventId() {
								return B(n).eventId;
							},
							get previewContentId() {
								return B(s);
							},
							get isTextCollapsed() {
								return B(c);
							},
							onImageOpen: oa,
							textOverlay: e,
							afterContentAndMedia: t,
							$$slots: {
								textOverlay: !0,
								afterContentAndMedia: !0
							}
						});
					}
					j(_);
					var y = E(_, 2);
					{
						let e = (e) => {
							{
								let t = (e) => {
									var t = h(), r = V(t), a = (e) => {
										{
											let t = S(() => Zr(B(n))), r = S(() => Zr(B(n)));
											Ir(e, {
												get count() {
													return B(i).repliesActionState.replyCount;
												},
												get selected() {
													return B(i).repliesActionState.visible;
												},
												get ariaLabel() {
													return B(t);
												},
												get tooltipContent() {
													return B(r);
												},
												onClick: () => ai(B(n))
											});
										}
									};
									d(r, (e) => {
										B(i).repliesActionState.status === "loaded" && B(i).repliesActionState.replyCount > 0 && e(a);
									}), m(e, t);
								}, r = (e) => {
									var t = h(), r = V(t), a = (e) => {
										{
											let t = S(() => Qr(B(n))), r = S(() => ri(B(n)));
											gr(e, {
												get count() {
													return B(i).reactionSummary.totalCount;
												},
												get expanded() {
													return B(t);
												},
												get ariaLabel() {
													return B(r);
												},
												onToggle: () => ii(B(n))
											});
										}
									};
									d(r, (e) => {
										B(i).reactionSummary.totalCount > 0 && e(a);
									}), m(e, t);
								}, a = S(() => U() ? Pi : void 0), o = S(() => de() ? Fi : void 0), s = S(() => H() ? Ii : void 0);
								cr(e, {
									get onReactionPost() {
										return B(a);
									},
									get post() {
										return B(n);
									},
									get onReplyPost() {
										return B(o);
									},
									get onQuotePost() {
										return B(s);
									},
									replyExtras: t,
									reactionExtras: r,
									$$slots: {
										replyExtras: !0,
										reactionExtras: !0
									}
								});
							}
						}, r = (e) => {
							let r = S(() => a()("common.showActions"));
							var o = h(), c = V(o), u = (e) => {
								{
									let o = (e) => {
										var r = jm(), o = V(r);
										s(o, () => On, (e, r) => {
											r(e, {
												class: "menu-action-button",
												onSelect: () => Oi(B(n)),
												children: (e, n) => {
													var r = Om(), i = E(V(r), 2), a = w(i, !0);
													P((e) => t(a, e), [() => Di()]), m(e, r);
												},
												$$slots: { default: !0 }
											});
										});
										var c = E(o, 2);
										s(c, () => kn, (e, t) => {
											t(e, { class: "post-history-menu-separator" });
										});
										var l = E(c, 2);
										{
											let e = S(() => B(i).relatedEventsStatus === "loading");
											s(l, () => On, (r, i) => {
												i(r, {
													class: "menu-action-button",
													get disabled() {
														return B(e);
													},
													onSelect: () => void bt(B(n)),
													children: (e, n) => {
														var r = km(), i = E(V(r), 2), o = w(i, !0);
														P((e) => t(o, e), [() => a()("postHistory.checkRelatedEvents")]), m(e, r);
													},
													$$slots: { default: !0 }
												});
											});
										}
										var u = E(l, 2), f = (e) => {
											var r = h(), i = V(r);
											s(i, () => On, (e, r) => {
												r(e, {
													class: "menu-action-button",
													onSelect: () => void Vi(B(n)),
													children: (e, n) => {
														var r = Am(), i = E(V(r), 2), o = w(i, !0);
														P((e) => t(o, e), [() => a()("postHistory.showSurroundingPosts")]), m(e, r);
													},
													$$slots: { default: !0 }
												});
											}), m(e, r);
										};
										d(u, (e) => {
											J.isSearchMode && e(f);
										});
										var p = E(u, 2);
										{
											let e = S(() => Re(B(n)) ? () => void ze(B(n)) : void 0), t = S(() => Xe.copyState[B(n).eventId] === "failed"), r = S(() => Xr(B(n))), i = S(() => Yr(B(n))), a = S(() => oi(B(n))), o = S(() => !!(de() || H())), s = S(() => qr(B(n)));
											ol(p, {
												order: "standard",
												get onRepost() {
													return B(e);
												},
												get repostPending() {
													return pe();
												},
												get copyFailed() {
													return B(t);
												},
												get showBroadcast() {
													return B(r);
												},
												get broadcastSending() {
													return B(i);
												},
												get showDelete() {
													return B(a);
												},
												get showDeleteSeparator() {
													return B(o);
												},
												get deletionSending() {
													return B(s);
												},
												onCopyPointerDown: (e) => Xe.captureCopyPointerPosition(B(n), e),
												onCopyNevent: (e) => void Xe.handleCopyNevent(B(n), e),
												onShowRawJson: () => _i(B(n).rawEvent, [
													...B(n).relayHints,
													...B(n).acceptedRelays,
													...B(n).fetchedRelays ?? []
												]),
												onBroadcastPointerDown: (e) => ui(B(n), e),
												onBroadcastPost: (e) => void ci(B(n), e),
												onOpenDeleteConfirm: () => si(B(n))
											});
										}
										m(e, r);
									}, c = S(() => Ye.isPostMenuOpen(B(n).eventId)), u = S(() => rn(B(n).postedAt, l()));
									zr(e, {
										lazy: !0,
										get open() {
											return B(c);
										},
										onOpenChange: (e) => gi(B(n).eventId, e),
										get triggerAriaLabel() {
											return B(r);
										},
										get tooltipContent() {
											return B(r);
										},
										enableTooltip: !0,
										get timestamp() {
											return B(u);
										},
										items: o,
										$$slots: { items: !0 }
									});
								}
							};
							d(c, (e) => {
								(de() || H()) && e(u);
							}), m(e, o);
						}, o = S(() => de() || H() ? Yt(B(n).postedAt) : ""), c = S(() => !!B(n).deletedAt);
						Br(y, {
							get formattedDate() {
								return B(o);
							},
							get dimmed() {
								return B(c);
							},
							actions: e,
							trailing: r,
							$$slots: {
								actions: !0,
								trailing: !0
							}
						});
					}
					var b = E(y, 2), x = (e) => {
						var n = Mm(), r = w(n, !0);
						P((e) => t(r, e), [() => a()("postHistory.relatedEventsFailed")]), m(e, n);
					};
					d(b, (e) => {
						B(i).relatedEventsStatus === "failed" && e(x);
					});
					var C = E(b, 2), T = (e) => {
						jr(e, {
							get readModel() {
								return B(i).reactionReadModel;
							},
							get emojiLoadStateByUrl() {
								return Ln.emojiLoadStateByUrl;
							},
							get emojiImageMetaByUrl() {
								return Ln.emojiImageMetaByUrl;
							}
						});
					}, D = S(() => B(i).reactionSummary.totalCount > 0 && Qr(B(n)));
					d(C, (e) => {
						B(D) && e(T);
					});
					var O = E(C, 2);
					{
						let e = S(() => U() ? Pi : void 0), t = S(() => de() ? Fi : void 0), r = S(() => H() ? Ii : void 0), a = S(Di);
						Cu(O, {
							onRefreshRelatedEvents: (e) => void bt(B(n), e),
							get onReactionPost() {
								return B(e);
							},
							get state() {
								return B(i);
							},
							section: "children",
							get previewModelByEventId() {
								return B(er);
							},
							getSensitiveBodyLoader: zn,
							get emojiLoadStateByUrl() {
								return Ln.emojiLoadStateByUrl;
							},
							get emojiImageMetaByUrl() {
								return Ln.emojiImageMetaByUrl;
							},
							get scrollRoot() {
								return B(nn);
							},
							onImageOpen: oa,
							buildPostRecordForNode: pi,
							get onReplyPost() {
								return B(t);
							},
							get onQuotePost() {
								return B(r);
							},
							getReactionReadModel: ti,
							isReactionExpanded: $r,
							getReactionLabel: ni,
							onToggleReaction: ei,
							onToggleNodeParent: (e) => $.preserveThreadParentToggleScroll(B(n).eventId, e, () => Ue.toggleNodeParent(B(n), e)),
							onRetryNodeParent: (e) => Ue.retryNodeParent(B(n), e),
							onToggleNodeChildren: (e) => Ue.toggleNodeChildren(B(n), e),
							onRetryNodeChildren: (e) => Ue.retryNodeChildren(B(n), e),
							onCopyPointerDown: Ci,
							onCopyNevent: wi,
							get externalClientLabel() {
								return B(a);
							},
							onOpenExternalClient: Ti,
							isCopyFailed: xi,
							onShowRawJson: bi,
							onBroadcastPointerDown: ki,
							onBroadcastPost: Ai,
							isBroadcastSending: Si,
							canDeleteNodePost: ji,
							isDeletionSending: Mi,
							onOpenDeleteConfirm: Ni
						});
					}
					j(g), P(() => {
						ae(g, "data-post-history-thread-anchor-scope-id", B(n).eventId), ae(g, "data-post-history-thread-anchor-event-id", B(n).eventId);
					}), m(e, o);
				};
				d(p, (e) => {
					B(v) ? e(g) : e(y, -1);
				}), j(f), j(u), j(o), P(() => {
					c = oe(o, 1, "post-history-item svelte-9hvdbo", null, c, { "post-history-item-deleted": !!B(n).deletedAt }), ae(o, "data-post-history-event-id", B(n).eventId), ae(o, "data-post-history-posted-at", B(n).postedAt);
				}), m(e, o);
			}), j(f);
			var p = E(f, 2), g = (e) => {
				var t = Im(), n = M(t), r = (e) => {
					var t = Fm(), n = M(t), r = (e) => {
						Be(e, {
							variant: "spinner",
							showLoader: !0,
							loaderSize: 24,
							ariaHidden: !0
						});
					};
					d(n, (e) => {
						B(on) && J.syncStatus !== "syncing" && e(r);
					}), j(t), T(t, (e) => k(an, e), () => B(an)), m(e, t);
				};
				d(n, (e) => {
					J.state.hasOlderLocal && e(r);
				}), j(t), m(e, t);
			};
			d(p, (e) => {
				Tn && !J.isSearchMode && J.state.listingMode === "contiguous" && !J.showSavedPostsBoundary && e(g);
			});
			var v = E(p, 2), y = (e) => {
				var n = Lm(), r = M(n), i = w(r, !0), o = E(r, 2), s = w(o, !0);
				j(n), P((e, n) => {
					t(i, e), t(s, n);
				}, [() => a()("postHistory.savedOlderPostsShowing"), () => a()("postHistory.savedOlderPostsGapNotice")]), m(e, n);
			};
			d(v, (e) => {
				J.isShowingSavedOlderPosts && e(y);
			});
			var b = E(v, 2), C = (e) => {
				var n = Bm(), r = M(n), i = M(r), o = (e) => {
					{
						let n = S(() => !J.canFetchOlderFromRelays || J.isRefetchingAroundCurrentView);
						Q(e, {
							type: "button",
							variant: "primary",
							className: "post-history-nav-button",
							contentLayout: "iconText",
							get disabled() {
								return B(n);
							},
							onClick: () => void Vr(),
							children: (e, n) => {
								var r = h(), i = V(r), o = (e) => {
									{
										let t = S(() => a()("postHistory.fetchOlderFromRelaysLoading"));
										Be(e, {
											get text() {
												return B(t);
											},
											showLoader: !0,
											loaderSize: 28,
											customClass: "post-history-nav-loading-placeholder"
										});
									}
								}, s = (e) => {
									var n = Rm(), r = E(V(n));
									P((e) => t(r, ` ${e ?? ""}`), [() => a()("postHistory.fetchOlderFromRelays")]), m(e, n);
								};
								d(i, (e) => {
									J.isFetchingOlderFromRelays ? e(o) : e(s, -1);
								}), m(e, r);
							},
							$$slots: { default: !0 }
						});
					}
				};
				d(i, (e) => {
					(J.canFetchOlderFromRelays || J.isFetchingFromRelays) && e(o);
				});
				var s = E(i, 2);
				Q(s, {
					type: "button",
					variant: "default",
					className: "post-history-nav-button",
					contentLayout: "iconText",
					onClick: () => void Rr(),
					children: (e, n) => {
						var r = zm(), i = E(V(r));
						P((e) => t(i, ` ${e ?? ""}`), [() => a()("postHistory.showSavedOlderPosts")]), m(e, r);
					},
					$$slots: { default: !0 }
				}), j(r), j(n), m(e, n);
			}, O = (e) => {
				var n = Vm(), r = M(n);
				{
					let e = S(() => !J.canLoadOlder);
					Q(r, {
						type: "button",
						variant: "default",
						className: "post-history-nav-button",
						contentLayout: "iconText",
						get disabled() {
							return B(e);
						},
						onClick: () => void Cr(),
						children: (e, n) => {
							var r = zm(), i = E(V(r));
							P((e) => t(i, ` ${e ?? ""}`), [() => yr()]), m(e, r);
						},
						$$slots: { default: !0 }
					});
				}
				j(n), m(e, n);
			}, ee = (e) => {
				var n = Vm(), r = M(n);
				{
					let e = S(() => !J.canLoadOlder);
					Q(r, {
						type: "button",
						variant: "default",
						className: "post-history-nav-button",
						contentLayout: "iconText",
						get disabled() {
							return B(e);
						},
						onClick: () => void Cr(),
						children: (e, n) => {
							var r = zm(), i = E(V(r));
							P((e) => t(i, ` ${e ?? ""}`), [() => yr()]), m(e, r);
						},
						$$slots: { default: !0 }
					});
				}
				j(n), m(e, n);
			}, N = (e) => {
				var n = Hm(), r = M(n), i = (e) => {
					{
						let n = S(() => !J.canFetchOlderFromRelays || J.isRefetchingAroundCurrentView);
						Q(e, {
							type: "button",
							variant: "primary",
							className: "post-history-nav-button",
							contentLayout: "iconText",
							get disabled() {
								return B(n);
							},
							onClick: () => void Vr(),
							children: (e, n) => {
								var r = h(), i = V(r), o = (e) => {
									{
										let t = S(() => a()("postHistory.fetchOlderFromRelaysLoading"));
										Be(e, {
											get text() {
												return B(t);
											},
											showLoader: !0,
											loaderSize: 28,
											customClass: "post-history-nav-loading-placeholder"
										});
									}
								}, s = (e) => {
									var n = Rm(), r = E(V(n));
									P((e) => t(r, ` ${e ?? ""}`), [() => a()("postHistory.fetchOlderFromRelays")]), m(e, n);
								};
								d(i, (e) => {
									J.isFetchingOlderFromRelays ? e(o) : e(s, -1);
								}), m(e, r);
							},
							$$slots: { default: !0 }
						});
					}
				};
				d(r, (e) => {
					(J.canFetchOlderFromRelays || J.isFetchingFromRelays || J.isRefetchingAroundCurrentView) && e(i);
				}), j(n), m(e, n);
			}, te = (e) => {
				var t = Um();
				m(e, t);
			};
			d(b, (e) => {
				J.showSavedPostsBoundary ? e(C) : J.isSearchMode && J.canLoadOlder ? e(O, 1) : !J.isSearchMode && J.state.hasOlderLocal && (J.state.listingMode === "sparse" || !Tn) ? e(ee, 2) : J.showLocalExhaustedState ? e(N, 3) : J.isSearchMode && J.posts.length > 0 && e(te, 4);
			}), m(e, n);
		};
		d(ue, (e) => {
			J.posts.length === 0 && B(Nn) ? e(fe) : B(Zn) ? e(he, 1) : e(ve, -1);
		});
		var ye = E(ue, 2), be = (e) => {
			var t = Gm(), n = M(t);
			{
				let e = S(() => a()("postHistory.syncing"));
				Be(n, {
					get text() {
						return B(e);
					},
					variant: "spinner",
					showLoader: !0,
					loaderSize: 24
				});
			}
			j(t), m(e, t);
		};
		d(ye, (e) => {
			!J.isSearchMode && J.syncStatus === "syncing" && (J.posts.length > 0 || B(ut)) && e(be);
		}), j(le), T(le, (e) => k(nn, e), () => B(nn));
		var xe = E(le, 2), Se = (e) => {
			var t = qm(), n = M(t);
			{
				let e = S(() => a()("postHistory.returnToLatest"));
				Q(n, {
					type: "button",
					variant: "default",
					shape: "circle",
					className: "post-history-latest-button",
					contentLayout: "icon",
					get ariaLabel() {
						return B(e);
					},
					onClick: () => void Ur(),
					children: (e, t) => {
						var n = Km();
						m(e, n);
					},
					$$slots: { default: !0 }
				});
			}
			j(t), m(e, t);
		};
		d(xe, (e) => {
			B(Jn) && e(Se);
		});
		var Ce = E(xe, 2);
		{
			let e = S(() => !!W() && !!_e());
			Gl(Ce, {
				get open() {
					return lt.state.open;
				},
				get running() {
					return lt.state.running;
				},
				get canStart() {
					return B(e);
				},
				get progress() {
					return lt.state.progress;
				},
				get result() {
					return lt.state.result;
				},
				get elapsedMs() {
					return lt.state.elapsedMs;
				},
				get onOpenChange() {
					return lt.setOpen;
				},
				onStart: () => void lt.start(),
				get onCancel() {
					return lt.cancel;
				}
			});
		}
		var we = E(Ce, 2);
		kl(we, {
			get open() {
				return B(ct);
			},
			get ownerPubkeyHex() {
				return W();
			},
			getCurrentPubkeyHex: () => W(),
			onOpenChange: (e) => k(ct, e, !0),
			onImported: Qi
		});
		var Te = E(we, 2);
		xr(Te, {
			get open() {
				return B(Tt);
			},
			get rawEvent() {
				return B(Et);
			},
			get resetKey() {
				return B(kt);
			},
			loadPayloadEvent: vi,
			observePayloadStatus: yi,
			onOpenChange: (e) => k(Tt, e, !0)
		});
		var K = E(Te, 2);
		vr(K, {
			get result() {
				return B(Fe);
			},
			get saveFailure() {
				return ge();
			},
			get pending() {
				return pe();
			},
			get anchor() {
				return B(tn);
			},
			anchorRightOffset: 16,
			get onRetrySave() {
				return me();
			}
		}), j(c);
		var Ee = E(c, 2);
		{
			let e = S(() => B(G) && !lt.state.open && !B(ut) && !!B(Vn) && !B(Kn)), t = S(() => B(qn) ? 200 : 0), n = S(() => !J.showStatusLoader);
			Ft(Ee, {
				get show() {
					return B(e);
				},
				get fadeOutDuration() {
					return B(t);
				},
				variant: "anchor-center",
				get anchor() {
					return B(tn);
				},
				get showInfoIcon() {
					return B(n);
				},
				children: (e, t) => {
					var n = h(), r = V(n), i = (e) => {
						{
							let t = S(() => B(Wn) ? a()(B(Vn), { values: B(Wn) }) : a()(B(Vn))), n = S(() => J.showStatusLoader ? "loading" : "complete"), r = S(() => `status-loading-placeholder post-history-heading-status-placeholder${B(Gn) ? " status-error" : ""}`);
							Be(e, {
								get text() {
									return B(t);
								},
								get showLoader() {
									return J.showStatusLoader;
								},
								loaderSize: 30,
								get state() {
									return B(n);
								},
								get customClass() {
									return B(r);
								}
							});
						}
					};
					d(r, (e) => {
						B(Vn) && e(i);
					}), m(e, n);
				},
				$$slots: { default: !0 }
			});
		}
		var De = E(Ee, 2);
		{
			let e = (e) => {
				var n = Jm(), r = M(n), i = w(r, !0), o = E(r, 2), s = w(o, !0);
				j(n), P((e, n) => {
					t(i, e), t(s, n);
				}, [() => a()("postHistory.deleteRequestDescription"), () => a()("postHistory.deleteRequestWarning")]), m(e, n);
			}, n = S(() => a()("postHistory.deleteRequestTitle")), r = S(() => a()("postHistory.deleteRequestDescription")), i = S(() => Ye.deleteTargetPost && qr(Ye.deleteTargetPost) ? a()("postHistory.deleteSending") : a()("postHistory.deleteConfirm")), o = S(() => a()("postHistory.deleteCancel")), s = S(() => Ye.deleteTargetPost ? qr(Ye.deleteTargetPost) : !1);
			nr(De, {
				get open() {
					return Ye.deleteConfirmOpen;
				},
				get onOpenChange() {
					return Ye.setDeleteConfirmOpen;
				},
				get title() {
					return B(n);
				},
				get description() {
					return B(r);
				},
				get confirmLabel() {
					return B(i);
				},
				get cancelLabel() {
					return B(o);
				},
				confirmVariant: "danger",
				get confirmDisabled() {
					return B(s);
				},
				onConfirm: ua,
				onCancel: Li,
				contentClass: "post-history-delete-confirm",
				children: e,
				$$slots: { default: !0 }
			});
		}
		var Oe = E(De, 2);
		{
			let e = (e) => {
				var n = Ym(), r = M(n), i = w(r, !0);
				j(n), P((e) => t(i, e), [() => a()("postHistory.deleteLocalHistoryDescription")]), m(e, n);
			}, n = S(() => a()("postHistory.deleteLocalHistoryTitle")), r = S(() => a()("postHistory.deleteLocalHistoryDescription")), i = S(() => a()("postHistory.deleteLocalHistoryConfirm")), o = S(() => a()("postHistory.deleteLocalHistoryCancel"));
			nr(Oe, {
				get title() {
					return B(n);
				},
				get description() {
					return B(r);
				},
				get confirmLabel() {
					return B(i);
				},
				get cancelLabel() {
					return B(o);
				},
				confirmVariant: "danger",
				onConfirm: da,
				onCancel: ia,
				closeOnConfirm: !1,
				preventCloseWhileConfirming: !0,
				showConfirmSpinner: !0,
				contentClass: "post-history-local-delete-confirm",
				get open() {
					return B(Qe);
				},
				set open(e) {
					k(Qe, e, !0);
				},
				children: e,
				$$slots: { default: !0 }
			});
		}
		var ke = E(Oe, 2);
		{
			let e = S(() => B(Kt)[B(qt)]?.src ?? ""), t = S(() => B(Kt)[B(qt)]?.alt ?? "");
			Hn(ke, {
				get src() {
					return B(e);
				},
				get alt() {
					return B(t);
				},
				onClose: ca,
				get mediaList() {
					return B(Kt);
				},
				get currentIndex() {
					return B(qt);
				},
				onNavigate: sa,
				get show() {
					return B($t);
				},
				set show(e) {
					k($t, e, !0);
				}
			});
		}
		var Ae = E(ke, 2);
		Ft(Ae, {
			get show() {
				return Xe.showCopyFloatingMessage;
			},
			get x() {
				return Xe.copyFloatingMessageX;
			},
			get y() {
				return Xe.copyFloatingMessageY;
			},
			children: (e, n) => {
				var r = Up(), i = w(r, !0);
				P((e) => t(i, e), [() => a()("postHistory.copied")]), m(e, r);
			},
			$$slots: { default: !0 }
		});
		var je = E(Ae, 2);
		Ft(je, {
			get show() {
				return B(Pt);
			},
			get x() {
				return B(zt);
			},
			get y() {
				return B(Bt);
			},
			children: (e, n) => {
				var r = Up(), i = w(r, !0);
				P((e) => t(i, e), [() => a()(B(Vt))]), m(e, r);
			},
			$$slots: { default: !0 }
		});
		var Me = E(je, 2);
		Ft(Me, {
			get show() {
				return B(xt);
			},
			variant: "top-right",
			children: (e, n) => {
				var r = Up(), i = w(r, !0);
				P((e) => t(i, e), [() => a()(B(St), { values: B(Ct) })]), m(e, r);
			},
			$$slots: { default: !0 }
		}), P(() => {
			oe(le, 1, `post-history-container${Tn && !J.isSearchMode && J.state.listingMode === "contiguous" ? " post-history-auto-load-enabled" : ""}`, "svelte-9hvdbo"), ae(le, "aria-busy", B(Xn) || B(on) ? "true" : "false");
		}), v("scroll", le, function(...e) {
			$.handleHistoryScroll?.apply(this, e);
		}), m(n, i);
	};
	d(ma, (e) => {
		B(G) && e(ha);
	}), m(n, pa);
	var ga = se(fa);
	return f(), ga;
}
_(["click"]);
export { Qm as default };
