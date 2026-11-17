import { A as e, E as t, Et as n, G as r, I as i, J as a, K as o, L as s, Mt as c, N as l, Nt as u, P as d, Pt as f, Q as p, T as m, Tt as h, V as g, W as _, X as v, Y as y, Z as b, _ as x, a as S, bt as C, ct as w, dt as T, f as E, ft as D, gt as O, h as k, i as A, it as j, jt as M, lt as N, mt as P, n as ee, nt as F, o as te, pt as I, r as L, rt as ne, s as R, st as z, t as re, ut as B, v as V, vt as H, w as ie, xt as U, y as ae, z as W } from "./index-client-XkLzkVYC.js";
import { d as oe, f as se, i as ce, n as G, v as le } from "./relayConfigUtils-B4Q_AO1M.js";
import { n as ue } from "./nostrHexUtils-C4ICTS7z.js";
import { a as K, i as de, n as q, o as fe, r as pe, s as me, u as he } from "./postHistoryEventUtils-CP25bUau.js";
import { B as ge, C as _e, E as ve, F as ye, K as be, M as J, N as xe, Q as Y, S as Se, T as Ce, V as we, W as Te, X as Ee, _ as De, dt as Oe, et as ke, ht as Ae, j as X, l as je, m as Me, o as Ne, pt as Pe, q as Fe, r as Ie, s as Le, st as Z, t as Re, tt as ze, v as Be, w as Ve, x as He } from "./LoadingPlaceholder-lit91akO.js";
import { c as Ue, n as We, v as Ge } from "./ehagakiDb-CqVey46a.js";
import { a as Ke, n as qe, r as Je } from "./query-Bp8561W2.js";
import { $ as Ye, A as Xe, C as Ze, H as Qe, I as $e, J as et, N as tt, O as nt, Q as rt, S as it, T as at, W as ot, X as st, Z as ct, _ as lt, a as ut, c as Q, et as dt, i as ft, it as pt, k as mt, l as ht, lt as gt, m as _t, mt as vt, nt as yt, o as bt, p as xt, rt as St, s as Ct, st as wt, tt as Tt, u as Et, v as Dt, x as Ot, y as kt } from "./nip65RelayDirectory-DWdjnt74.js";
import { f as At, h as jt } from "./relayStore.svelte-Df3SPXmc.js";
import { J as Mt, Ot as Nt, c as Pt, l as Ft, q as It, s as Lt, t as Rt, u as zt } from "./appUtils-BRia-Jm6.js";
import { n as Bt } from "./settingsStore.svelte-Cja5YPJC.js";
import { B as Vt, C as Ht, D as Ut, E as Wt, F as Gt, H as Kt, I as qt, L as Jt, N as Yt, P as Xt, R as Zt, S as Qt, V as $t, _ as en, a as tn, b as nn, c as rn, d as an, g as on, h as sn, i as cn, m as ln, n as un, o as dn, p as fn, r as pn, s as mn, u as hn, w as gn, x as $, y as _n, z as vn } from "./sensitiveContentPayloadReader-CuX74jfk.js";
import { n as yn } from "./sr-only-styles-CUOVv6Ud.js";
import { a as bn, i as xn, n as Sn, o as Cn, r as wn, s as Tn, t as En } from "./menu-trigger-TbDvuZD-.js";
import { t as Dn } from "./hidden-input-DTLOm2Ry.js";
import { o as On } from "./safe-polygon.svelte-NujogFy-.js";
import { t as kn } from "./DialogWrapper-DOH4rn3S.js";
import { t as An } from "./dialog-close-erjPpz45.js";
import { t as jn } from "./arrayUtils-kRQBpBQw.js";
import { c as Mn, d as Nn, t as Pn } from "./customEmoji-DDC4uHz2.js";
import { _ as Fn, a as In, c as Ln, d as Rn, i as zn, l as Bn, s as Vn, t as Hn, u as Un } from "./postHistoryLightweightSyncCoordinator-CTD1fZM2.js";
import { t as Wn } from "./postMediaCacheService-CCnN2yS6.js";
import { J as Gn, b as Kn, c as qn, d as Jn, f as Yn, ft as Xn, gt as Zn, ht as Qn, mt as $n, p as er, u as tr, ut as nr } from "./App-D7-eoDXE.js";
import { C as rr, D as ir, O as ar, S as or, T as sr, _ as cr, a as lr, b as ur, c as dr, d as fr, f as pr, g as mr, h as hr, l as gr, n as _r, o as vr, p as yr, r as br, s as xr, u as Sr, v as Cr, w as wr, x as Tr, y as Er } from "./postBroadcastService-DgDo3AL_.js";
import { a as Dr, c as Or, d as kr, i as Ar, l as jr, n as Mr, o as Nr, r as Pr, s as Fr, t as Ir, u as Lr } from "./usePostHistoryPostActionUiController.svelte-CyEfesdx.js";
import { t as Rr } from "./InfoPopoverButton-Dr3yH3Sl.js";
import { a as zr, c as Br, i as Vr, l as Hr, n as Ur, o as Wr, r as Gr, s as Kr, t as qr, u as Jr } from "./structuralSharing--jDEnYUf.js";
// D:/ドキュメント/GitHub/ehagaki/node_modules/@internationalized/date/dist/utils.mjs
function Yr(e, t) {
	return e - t * Math.floor(e / t);
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/@internationalized/date/dist/GregorianCalendar.mjs
var Xr = 1721426;
function Zr(e, t, n, r) {
	t = $r(e, t);
	let i = t - 1, a = -2;
	return n <= 2 ? a = 0 : Qr(t) && (a = -1), 1721425 + 365 * i + Math.floor(i / 4) - Math.floor(i / 100) + Math.floor(i / 400) + Math.floor((367 * n - 362) / 12 + a + r);
}
function Qr(e) {
	return e % 4 == 0 && (e % 100 != 0 || e % 400 == 0);
}
function $r(e, t) {
	return e === "BC" ? 1 - t : t;
}
function ei(e) {
	let t = "AD";
	return e <= 0 && (t = "BC", e = 1 - e), [t, e];
}
var ti = {
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
}, ni = class {
	fromJulianDay(e) {
		let t = e, n = t - Xr, r = Math.floor(n / 146097), i = Yr(n, 146097), a = Math.floor(i / 36524), o = Yr(i, 36524), s = Math.floor(o / 1461), c = Yr(o, 1461), l = Math.floor(c / 365), [u, d] = ei(r * 400 + a * 100 + s * 4 + l + +(a !== 4 && l !== 4)), f = t - Zr(u, d, 1, 1), p = 2;
		t < Zr(u, d, 3, 1) ? p = 0 : Qr(d) && (p = 1);
		let m = Math.floor(((f + p) * 12 + 373) / 367);
		return new Ta(u, d, m, t - Zr(u, d, m, 1) + 1);
	}
	toJulianDay(e) {
		return Zr(e.era, e.year, e.month, e.day);
	}
	getDaysInMonth(e) {
		return ti[Qr(e.year) ? "leapyear" : "standard"][e.month - 1];
	}
	getMonthsInYear(e) {
		return 12;
	}
	getDaysInYear(e) {
		return Qr(e.year) ? 366 : 365;
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
}, ri = {
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
function ii(e, t) {
	return t = Ii(t, e.calendar), e.era === t.era && e.year === t.year && e.month === t.month && e.day === t.day;
}
function ai(e, t) {
	return t = Ii(t, e.calendar), e = gi(e), t = gi(t), e.era === t.era && e.year === t.year && e.month === t.month;
}
function oi(e, t) {
	return e.isEqual?.call(e, t) ?? t.isEqual?.call(t, e) ?? e.identifier === t.identifier;
}
var si = {
	sun: 0,
	mon: 1,
	tue: 2,
	wed: 3,
	thu: 4,
	fri: 5,
	sat: 6
};
function ci(e, t, n) {
	let r = e.calendar.toJulianDay(e), i = n ? si[n] : xi(t), a = Math.ceil(r + 1 - i) % 7;
	return a < 0 && (a += 7), a;
}
function li(e) {
	return Ni(Date.now(), e);
}
function ui(e) {
	return Pi(li(e));
}
function di(e, t) {
	return e.calendar.toJulianDay(e) - t.calendar.toJulianDay(t);
}
function fi(e, t) {
	return pi(e) - pi(t);
}
function pi(e) {
	return e.hour * 36e5 + e.minute * 6e4 + e.second * 1e3 + e.millisecond;
}
var mi = null;
function hi() {
	return mi ??= new Intl.DateTimeFormat().resolvedOptions().timeZone, mi;
}
function gi(e) {
	return e.subtract({ days: e.day - 1 });
}
function _i(e) {
	return e.add({ days: e.calendar.getDaysInMonth(e) - e.day });
}
var vi = /* @__PURE__ */ new Map(), yi = /* @__PURE__ */ new Map();
function bi(e) {
	if (Intl.Locale) {
		let t = vi.get(e);
		return t || (t = new Intl.Locale(e).maximize().region, t && vi.set(e, t)), t;
	}
	let t = e.split("-")[1];
	return t === "u" ? void 0 : t;
}
function xi(e) {
	let t = yi.get(e);
	if (!t) {
		if (Intl.Locale) {
			let n = new Intl.Locale(e);
			if ("getWeekInfo" in n && (t = n.getWeekInfo(), t)) return yi.set(e, t), t.firstDay;
		}
		let n = bi(e);
		if (e.includes("-fw-")) {
			let n = e.split("-fw-")[1].split("-")[0];
			t = n === "mon" ? { firstDay: 1 } : n === "tue" ? { firstDay: 2 } : n === "wed" ? { firstDay: 3 } : n === "thu" ? { firstDay: 4 } : n === "fri" ? { firstDay: 5 } : n === "sat" ? { firstDay: 6 } : { firstDay: 0 };
		} else t = e.includes("-ca-iso8601") ? { firstDay: 1 } : { firstDay: n && ri[n] || 0 };
		yi.set(e, t);
	}
	return t.firstDay;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/@internationalized/date/dist/conversion.mjs
function Si(e) {
	return e = Ii(e, new ni()), Ci($r(e.era, e.year), e.month, e.day, e.hour, e.minute, e.second, e.millisecond);
}
function Ci(e, t, n, r, i, a, o) {
	let s = /* @__PURE__ */ new Date();
	return s.setUTCHours(r, i, a, o), s.setUTCFullYear(e, t - 1, n), s.getTime();
}
function wi(e, t) {
	if (t === "UTC") return 0;
	if (e > 0 && t === hi()) return new Date(e).getTimezoneOffset() * -6e4;
	let { year: n, month: r, day: i, hour: a, minute: o, second: s } = Ei(e, t);
	return Ci(n, r, i, a, o, s, 0) - Math.floor(e / 1e3) * 1e3;
}
var Ti = /* @__PURE__ */ new Map();
function Ei(e, t) {
	let n = Ti.get(t);
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
	}), Ti.set(t, n));
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
var Di = 864e5;
function Oi(e, t) {
	let n = Si(e);
	return ki(e, t, n - wi(n - Di, t), n - wi(n + Di, t));
}
function ki(e, t, n, r) {
	return (n === r ? [n] : [n, r]).filter((n) => Ai(e, t, n));
}
function Ai(e, t, n) {
	let r = Ei(n, t);
	return e.year === r.year && e.month === r.month && e.day === r.day && e.hour === r.hour && e.minute === r.minute && e.second === r.second;
}
function ji(e, t, n = "compatible") {
	let r = Fi(e);
	if (t === "UTC") return Si(r);
	if (t === hi() && n === "compatible") {
		r = Ii(r, new ni());
		let e = /* @__PURE__ */ new Date(), t = $r(r.era, r.year);
		return e.setFullYear(t, r.month - 1, r.day), e.setHours(r.hour, r.minute, r.second, r.millisecond), e.getTime();
	}
	let i = Si(r), a = wi(i - Di, t), o = wi(i + Di, t), s = ki(r, t, i - a, i - o);
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
function Mi(e, t, n = "compatible") {
	return new Date(ji(e, t, n));
}
function Ni(e, t) {
	let n = wi(e, t), r = new Date(e + n), i = r.getUTCFullYear(), a = r.getUTCMonth() + 1, o = r.getUTCDate(), s = r.getUTCHours(), c = r.getUTCMinutes(), l = r.getUTCSeconds(), u = r.getUTCMilliseconds();
	return new ka(i < 1 ? "BC" : "AD", i < 1 ? -i + 1 : i, a, o, t, n, s, c, l, u);
}
function Pi(e) {
	return new Ta(e.calendar, e.era, e.year, e.month, e.day);
}
function Fi(e, t) {
	let n = 0, r = 0, i = 0, a = 0;
	if ("timeZone" in e) ({hour: n, minute: r, second: i, millisecond: a} = e);
	else if ("hour" in e && !t) return e;
	return t && ({hour: n, minute: r, second: i, millisecond: a} = t), new Da(e.calendar, e.era, e.year, e.month, e.day, n, r, i, a);
}
function Ii(e, t) {
	if (oi(e.calendar, t)) return e;
	let n = t.fromJulianDay(e.calendar.toJulianDay(e)), r = e.copy();
	return r.calendar = t, r.era = n.era, r.year = n.year, r.month = n.month, r.day = n.day, Ki(r), r;
}
function Li(e, t, n) {
	return e instanceof ka ? e.timeZone === t ? e : zi(e, t) : Ni(ji(e, t, n), t);
}
function Ri(e) {
	let t = Si(e) - e.offset;
	return new Date(t);
}
function zi(e, t) {
	return Ii(Ni(Si(e) - e.offset, t), e.calendar);
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/@internationalized/date/dist/manipulation.mjs
var Bi = 36e5;
function Vi(e, t) {
	let n = e.copy(), r = "hour" in n ? ea(n, t) : 0;
	Hi(n, t.years || 0), n.calendar.balanceYearMonth && n.calendar.balanceYearMonth(n, e), n.month += t.months || 0, Ui(n), Gi(n), n.day += (t.weeks || 0) * 7, n.day += t.days || 0, n.day += r, Wi(n), n.calendar.balanceDate && n.calendar.balanceDate(n), n.year < 1 && (n.year = 1, n.month = 1, n.day = 1);
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
function Hi(e, t) {
	var n;
	(n = e.calendar).isInverseEra?.call(n, e) && (t = -t), e.year += t;
}
function Ui(e) {
	for (; e.month < 1;) Hi(e, -1), e.month += e.calendar.getMonthsInYear(e);
	let t = 0;
	for (; e.month > (t = e.calendar.getMonthsInYear(e));) e.month -= t, Hi(e, 1);
}
function Wi(e) {
	for (; e.day < 1;) e.month--, Ui(e), e.day += e.calendar.getDaysInMonth(e);
	for (; e.day > e.calendar.getDaysInMonth(e);) e.day -= e.calendar.getDaysInMonth(e), e.month++, Ui(e);
}
function Gi(e) {
	e.month = Math.max(1, Math.min(e.calendar.getMonthsInYear(e), e.month)), e.day = Math.max(1, Math.min(e.calendar.getDaysInMonth(e), e.day));
}
function Ki(e) {
	e.calendar.constrainDate && e.calendar.constrainDate(e), e.year = Math.max(1, Math.min(e.calendar.getYearsInEra(e), e.year)), Gi(e);
}
function qi(e) {
	let t = {};
	for (let n in e) typeof e[n] == "number" && (t[n] = -e[n]);
	return t;
}
function Ji(e, t) {
	return Vi(e, qi(t));
}
function Yi(e, t) {
	let n = e.copy();
	return t.era != null && (n.era = t.era), t.year != null && (n.year = t.year), t.month != null && (n.month = t.month), t.day != null && (n.day = t.day), Ki(n), n;
}
function Xi(e, t) {
	let n = e.copy();
	return t.hour != null && (n.hour = t.hour), t.minute != null && (n.minute = t.minute), t.second != null && (n.second = t.second), t.millisecond != null && (n.millisecond = t.millisecond), Qi(n), n;
}
function Zi(e) {
	e.second += Math.floor(e.millisecond / 1e3), e.millisecond = $i(e.millisecond, 1e3), e.minute += Math.floor(e.second / 60), e.second = $i(e.second, 60), e.hour += Math.floor(e.minute / 60), e.minute = $i(e.minute, 60);
	let t = Math.floor(e.hour / 24);
	return e.hour = $i(e.hour, 24), t;
}
function Qi(e) {
	e.millisecond = Math.max(0, Math.min(e.millisecond, 1e3)), e.second = Math.max(0, Math.min(e.second, 59)), e.minute = Math.max(0, Math.min(e.minute, 59)), e.hour = Math.max(0, Math.min(e.hour, 23));
}
function $i(e, t) {
	let n = e % t;
	return n < 0 && (n += t), n;
}
function ea(e, t) {
	return e.hour += t.hours || 0, e.minute += t.minutes || 0, e.second += t.seconds || 0, e.millisecond += t.milliseconds || 0, Zi(e);
}
function ta(e, t, n, r) {
	let i = e.copy();
	switch (t) {
		case "era": {
			let t = e.calendar.getEras(), a = t.indexOf(e.era);
			if (a < 0) throw Error("Invalid era: " + e.era);
			a = ra(a, n, 0, t.length - 1, r?.round), i.era = t[a], Ki(i);
			break;
		}
		case "year":
			var a;
			(a = i.calendar).isInverseEra?.call(a, i) && (n = -n), i.year = ra(e.year, n, -Infinity, 9999, r?.round), i.year === -Infinity && (i.year = 1), i.calendar.balanceYearMonth && i.calendar.balanceYearMonth(i, e);
			break;
		case "month":
			i.month = ra(e.month, n, 1, e.calendar.getMonthsInYear(e), r?.round);
			break;
		case "day":
			i.day = ra(e.day, n, 1, e.calendar.getDaysInMonth(e), r?.round);
			break;
		default: throw Error("Unsupported field " + t);
	}
	return e.calendar.balanceDate && e.calendar.balanceDate(i), Ki(i), i;
}
function na(e, t, n, r) {
	let i = e.copy();
	switch (t) {
		case "hour": {
			let t = e.hour, a = 0, o = 23;
			if (r?.hourCycle === 12) {
				let e = t >= 12;
				a = e ? 12 : 0, o = e ? 23 : 11;
			}
			i.hour = ra(t, n, a, o, r?.round);
			break;
		}
		case "minute":
			i.minute = ra(e.minute, n, 0, 59, r?.round);
			break;
		case "second":
			i.second = ra(e.second, n, 0, 59, r?.round);
			break;
		case "millisecond":
			i.millisecond = ra(e.millisecond, n, 0, 999, r?.round);
			break;
		default: throw Error("Unsupported field " + t);
	}
	return i;
}
function ra(e, t, n, r, i = !1) {
	if (i) {
		e += Math.sign(t), e < n && (e = r);
		let i = Math.abs(t);
		e = t > 0 ? Math.ceil(e / i) * i : Math.floor(e / i) * i, e > r && (e = n);
	} else e += t, e < n ? e = r - (n - e - 1) : e > r && (e = n + (e - r - 1));
	return e;
}
function ia(e, t) {
	let n;
	return n = t.years != null && t.years !== 0 || t.months != null && t.months !== 0 || t.weeks != null && t.weeks !== 0 || t.days != null && t.days !== 0 ? ji(Vi(Fi(e), {
		years: t.years,
		months: t.months,
		weeks: t.weeks,
		days: t.days
	}), e.timeZone) : Si(e) - e.offset, n += t.milliseconds || 0, n += (t.seconds || 0) * 1e3, n += (t.minutes || 0) * 6e4, n += (t.hours || 0) * 36e5, Ii(Ni(n, e.timeZone), e.calendar);
}
function aa(e, t) {
	return ia(e, qi(t));
}
function oa(e, t, n, r) {
	switch (t) {
		case "hour": {
			let t = 0, i = 23;
			if (r?.hourCycle === 12) {
				let n = e.hour >= 12;
				t = n ? 12 : 0, i = n ? 23 : 11;
			}
			let a = Fi(e), o = Ii(Xi(a, { hour: t }), new ni()), s = [ji(o, e.timeZone, "earlier"), ji(o, e.timeZone, "later")].filter((t) => Ni(t, e.timeZone).day === o.day)[0], c = Ii(Xi(a, { hour: i }), new ni()), l = [ji(c, e.timeZone, "earlier"), ji(c, e.timeZone, "later")].filter((t) => Ni(t, e.timeZone).day === c.day).pop(), u = Si(e) - e.offset, d = Math.floor(u / Bi), f = u % Bi;
			return u = ra(d, n, Math.floor(s / Bi), Math.floor(l / Bi), r?.round) * Bi + f, Ii(Ni(u, e.timeZone), e.calendar);
		}
		case "minute":
		case "second":
		case "millisecond": return na(e, t, n, r);
		case "era":
		case "year":
		case "month":
		case "day": return Ii(Ni(ji(ta(Fi(e), t, n, r), e.timeZone), e.timeZone), e.calendar);
		default: throw Error("Unsupported field " + t);
	}
}
function sa(e, t, n) {
	let r = Fi(e), i = Xi(Yi(r, t), t);
	return i.compare(r) === 0 ? e : Ii(Ni(ji(i, e.timeZone, n), e.timeZone), e.calendar);
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/@internationalized/date/dist/string.mjs
var ca = /^([+-]\d{6}|\d{4})-(\d{2})-(\d{2})$/, la = /^([+-]\d{6}|\d{4})-(\d{2})-(\d{2})(?:T(\d{2}))?(?::(\d{2}))?(?::(\d{2}))?(\.\d+)?$/, ua = /^([+-]\d{6}|\d{4})-(\d{2})-(\d{2})(?:T(\d{2}))?(?::(\d{2}))?(?::(\d{2}))?(\.\d+)?(?:([+-]\d{2})(?::?(\d{2}))?(?::?(\d{2}))?)?\[(.*?)\]$/, da = /^([+-]\d{6}|\d{4})-(\d{2})-(\d{2})(?:T(\d{2}))?(?::(\d{2}))?(?::(\d{2}))?(\.\d+)?(?:(?:([+-]\d{2})(?::?(\d{2}))?)|Z)$/;
function fa(e) {
	let t = e.match(ca);
	if (!t) throw da.test(e) ? Error(`Invalid ISO 8601 date string: ${e}. Use parseAbsolute() instead.`) : Error("Invalid ISO 8601 date string: " + e);
	let n = new Ta(ha(t[1], 0, 9999), ha(t[2], 1, 12), 1);
	return n.day = ha(t[3], 1, n.calendar.getDaysInMonth(n)), n;
}
function pa(e) {
	let t = e.match(la);
	if (!t) throw da.test(e) ? Error(`Invalid ISO 8601 date time string: ${e}. Use parseAbsolute() instead.`) : Error("Invalid ISO 8601 date time string: " + e);
	let n = ha(t[1], -9999, 9999), r = new Da(n < 1 ? "BC" : "AD", n < 1 ? -n + 1 : n, ha(t[2], 1, 12), 1, t[4] ? ha(t[4], 0, 23) : 0, t[5] ? ha(t[5], 0, 59) : 0, t[6] ? ha(t[6], 0, 59) : 0, t[7] ? ha(t[7], 0, Infinity) * 1e3 : 0);
	return r.day = ha(t[3], 0, r.calendar.getDaysInMonth(r)), r;
}
function ma(e, t) {
	let n = e.match(ua);
	if (!n) throw Error("Invalid ISO 8601 date time string: " + e);
	let r = ha(n[1], -9999, 9999), i = new ka(r < 1 ? "BC" : "AD", r < 1 ? -r + 1 : r, ha(n[2], 1, 12), 1, n[11], 0, n[4] ? ha(n[4], 0, 23) : 0, n[5] ? ha(n[5], 0, 59) : 0, n[6] ? ha(n[6], 0, 59) : 0, n[7] ? ha(n[7], 0, Infinity) * 1e3 : 0);
	i.day = ha(n[3], 0, i.calendar.getDaysInMonth(i));
	let a = Fi(i), o;
	if (n[8]) {
		let e = ha(n[8], -23, 23);
		if (i.offset = Math.sign(e) * (Math.abs(e) * 36e5 + ha(n[9] ?? "0", 0, 59) * 6e4 + ha(n[10] ?? "0", 0, 59) * 1e3), o = Si(i) - i.offset, !Oi(a, i.timeZone).includes(o)) throw Error(`Offset ${ya(i.offset)} is invalid for ${va(i)} in ${i.timeZone}`);
	} else o = ji(Fi(a), i.timeZone, t);
	return Ni(o, i.timeZone);
}
function ha(e, t, n) {
	let r = Number(e);
	if (r < t || r > n) throw RangeError(`Value out of range: ${t} <= ${r} <= ${n}`);
	return r;
}
function ga(e) {
	return `${String(e.hour).padStart(2, "0")}:${String(e.minute).padStart(2, "0")}:${String(e.second).padStart(2, "0")}${e.millisecond ? String(e.millisecond / 1e3).slice(1) : ""}`;
}
function _a(e) {
	let t = Ii(e, new ni()), n;
	return n = t.era === "BC" ? t.year === 1 ? "0000" : "-" + String(Math.abs(1 - t.year)).padStart(6, "00") : String(t.year).padStart(4, "0"), `${n}-${String(t.month).padStart(2, "0")}-${String(t.day).padStart(2, "0")}`;
}
function va(e) {
	return `${_a(e)}T${ga(e)}`;
}
function ya(e) {
	let t = Math.sign(e) < 0 ? "-" : "+";
	e = Math.abs(e);
	let n = Math.floor(e / 36e5), r = Math.floor(e % 36e5 / 6e4), i = Math.floor(e % 36e5 % 6e4 / 1e3), a = `${t}${String(n).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
	return i !== 0 && (a += `:${String(i).padStart(2, "0")}`), a;
}
function ba(e) {
	return `${va(e)}${ya(e.offset)}[${e.timeZone}]`;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/@swc/helpers/esm/_check_private_redeclaration.js
function xa(e, t) {
	if (t.has(e)) throw TypeError("Cannot initialize the same private elements twice on an object");
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/@swc/helpers/esm/_class_private_field_init.js
function Sa(e, t, n) {
	xa(e, t), t.set(e, n);
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/@internationalized/date/dist/CalendarDate.mjs
function Ca(e) {
	let t = typeof e[0] == "object" ? e.shift() : new ni(), n;
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
var wa = /*#__PURE__*/ new WeakMap(), Ta = class e {
	copy() {
		return this.era ? new e(this.calendar, this.era, this.year, this.month, this.day) : new e(this.calendar, this.year, this.month, this.day);
	}
	add(e) {
		return Vi(this, e);
	}
	subtract(e) {
		return Ji(this, e);
	}
	set(e) {
		return Yi(this, e);
	}
	cycle(e, t, n) {
		return ta(this, e, t, n);
	}
	toDate(e) {
		return Mi(this, e);
	}
	toString() {
		return _a(this);
	}
	compare(e) {
		return di(this, e);
	}
	constructor(...e) {
		Sa(this, wa, {
			writable: !0,
			value: void 0
		});
		let [t, n, r, i, a] = Ca(e);
		this.calendar = t, this.era = n, this.year = r, this.month = i, this.day = a, Ki(this);
	}
}, Ea = /*#__PURE__*/ new WeakMap(), Da = class e {
	copy() {
		return this.era ? new e(this.calendar, this.era, this.year, this.month, this.day, this.hour, this.minute, this.second, this.millisecond) : new e(this.calendar, this.year, this.month, this.day, this.hour, this.minute, this.second, this.millisecond);
	}
	add(e) {
		return Vi(this, e);
	}
	subtract(e) {
		return Ji(this, e);
	}
	set(e) {
		return Yi(Xi(this, e), e);
	}
	cycle(e, t, n) {
		switch (e) {
			case "era":
			case "year":
			case "month":
			case "day": return ta(this, e, t, n);
			default: return na(this, e, t, n);
		}
	}
	toDate(e, t) {
		return Mi(this, e, t);
	}
	toString() {
		return va(this);
	}
	compare(e) {
		let t = di(this, e);
		return t === 0 ? fi(this, Fi(e)) : t;
	}
	constructor(...e) {
		Sa(this, Ea, {
			writable: !0,
			value: void 0
		});
		let [t, n, r, i, a] = Ca(e);
		this.calendar = t, this.era = n, this.year = r, this.month = i, this.day = a, this.hour = e.shift() || 0, this.minute = e.shift() || 0, this.second = e.shift() || 0, this.millisecond = e.shift() || 0, Ki(this);
	}
}, Oa = /*#__PURE__*/ new WeakMap(), ka = class e {
	copy() {
		return this.era ? new e(this.calendar, this.era, this.year, this.month, this.day, this.timeZone, this.offset, this.hour, this.minute, this.second, this.millisecond) : new e(this.calendar, this.year, this.month, this.day, this.timeZone, this.offset, this.hour, this.minute, this.second, this.millisecond);
	}
	add(e) {
		return ia(this, e);
	}
	subtract(e) {
		return aa(this, e);
	}
	set(e, t) {
		return sa(this, e, t);
	}
	cycle(e, t, n) {
		return oa(this, e, t, n);
	}
	toDate() {
		return Ri(this);
	}
	toString() {
		return ba(this);
	}
	toAbsoluteString() {
		return this.toDate().toISOString();
	}
	compare(e) {
		return this.toDate().getTime() - Li(e, this.timeZone).toDate().getTime();
	}
	constructor(...e) {
		Sa(this, Oa, {
			writable: !0,
			value: void 0
		});
		let [t, n, r, i, a] = Ca(e), o = e.shift(), s = e.shift();
		this.calendar = t, this.era = n, this.year = r, this.month = i, this.day = a, this.timeZone = o, this.offset = s, this.hour = e.shift() || 0, this.minute = e.shift() || 0, this.second = e.shift() || 0, this.millisecond = e.shift() || 0, Ki(this);
	}
}, Aa = /* @__PURE__ */ new Map(), ja = class {
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
		return La() && (this.resolvedHourCycle ||= Ra(e.locale, this.options), e.hourCycle = this.resolvedHourCycle, e.hour12 = this.resolvedHourCycle === "h11" || this.resolvedHourCycle === "h12"), e.calendar === "ethiopic-amete-alem" && (e.calendar = "ethioaa"), e;
	}
	constructor(e, t = {}) {
		this.formatter = Na(e, t), this.options = t;
	}
}, Ma = {
	true: { ja: "h11" },
	false: {}
};
function Na(e, t = {}) {
	if (typeof t.hour12 == "boolean" && Fa()) {
		t = { ...t };
		let n = Ma[String(t.hour12)][e.split("-")[0]], r = t.hour12 ? "h12" : "h23";
		t.hourCycle = n ?? r, delete t.hour12;
	}
	let n = e + (t ? Object.entries(t).sort((e, t) => e[0] < t[0] ? -1 : 1).join() : "");
	if (Aa.has(n)) return Aa.get(n);
	let r = new Intl.DateTimeFormat(e, t);
	return Aa.set(n, r), r;
}
var Pa = null;
function Fa() {
	return Pa ??= new Intl.DateTimeFormat("en-US", {
		hour: "numeric",
		hour12: !1
	}).format(new Date(2020, 2, 3, 0)) === "24", Pa;
}
var Ia = null;
function La() {
	return Ia ??= new Intl.DateTimeFormat("fr", {
		hour: "numeric",
		hour12: !1
	}).resolvedOptions().hourCycle === "h12", Ia;
}
function Ra(e, t) {
	if (!t.timeStyle && !t.hour) return;
	e = e.replace(/(-u-)?-nu-[a-zA-Z0-9]+/, ""), e += (e.includes("-u-") ? "" : "-u") + "-nu-latn";
	let n = Na(e, {
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
function za(e) {
	if (!je || !e) return null;
	let t = e.querySelector("[data-bits-announcer]"), n = (t) => {
		let n = e.createElement("div");
		return n.role = "log", n.ariaLive = t, n.setAttribute("aria-relevant", "additions"), n;
	};
	if (!Me(t)) {
		let r = e.createElement("div");
		r.style.cssText = yn, r.setAttribute("data-bits-announcer", ""), r.appendChild(n("assertive")), r.appendChild(n("polite")), t = r, e.body.insertBefore(t, e.body.firstChild);
	}
	return { getLog: (e) => {
		if (!Me(t)) return null;
		let n = t.querySelector(`[aria-live="${e}"]`);
		return Me(n) ? n : null;
	} };
}
function Ba(e) {
	let t = za(e);
	function n(n, r = "assertive", i = 7500) {
		if (!t || !je || !e) return;
		let a = t.getLog(r), o = e.createElement("div");
		return n = typeof n == "number" ? n.toString() : n === null ? "Empty" : n.trim(), o.innerText = n, r === "assertive" ? a?.replaceChildren(o) : a?.appendChild(o), setTimeout(() => {
			o.remove();
		}, i);
	}
	return { announce: n };
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/internal/date-time/utils.js
var Va = {
	defaultValue: void 0,
	granularity: "day"
};
function Ha(e) {
	let { defaultValue: t, granularity: n, minValue: r, maxValue: i } = {
		...Va,
		...e
	};
	if (Array.isArray(t) && t.length) return t[t.length - 1];
	if (t && !Array.isArray(t)) return t;
	{
		let e = /* @__PURE__ */ new Date();
		r && e < r.toDate(hi()) ? e = r.toDate(hi()) : i && e > i.toDate(hi()) && (e = i.toDate(hi()));
		let t = e.getFullYear(), a = e.getMonth() + 1, o = e.getDate();
		return [
			"hour",
			"minute",
			"second"
		].includes(n ?? "day") ? new Da(t, a, o, 0, 0, 0) : new Ta(t, a, o);
	}
}
function Ua(e, t) {
	let n;
	return n = t instanceof ka ? ma(e) : t instanceof Da ? pa(e) : fa(e), n.calendar === t.calendar ? n : Ii(n, t.calendar);
}
function Wa(e, t = hi()) {
	return e instanceof ka ? e.toDate() : e.toDate(t);
}
function Ga(e) {
	if (e instanceof Ta) return "date";
	if (e instanceof Da) return "datetime";
	if (e instanceof ka) return "zoneddatetime";
	throw Error("Unknown date type");
}
function Ka(e, t) {
	switch (t) {
		case "date": return fa(e);
		case "datetime": return pa(e);
		case "zoneddatetime": return ma(e);
		default: throw Error(`Unknown date type: ${t}`);
	}
}
function qa(e) {
	return e instanceof Da;
}
function Ja(e) {
	return e instanceof ka;
}
function Ya(e) {
	return qa(e) || Ja(e);
}
function Xa(e) {
	if (e instanceof Date) {
		let t = e.getFullYear(), n = e.getMonth() + 1;
		return new Date(t, n, 0).getDate();
	}
	return e.set({ day: 100 }).day;
}
function Za(e, t) {
	return e.compare(t) < 0;
}
function Qa(e, t) {
	return e.compare(t) > 0;
}
function $a(e, t, n) {
	let r = ci(e, n);
	return t > r ? e.subtract({ days: r + 7 - t }) : t === r ? e : e.subtract({ days: r - t });
}
function eo(e, t, n) {
	let r = ci(e, n), i = t === 0 ? 6 : t - 1;
	return r === i ? e : r > i ? e.add({ days: 7 - r + i }) : e.add({ days: i - r });
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/internal/date-time/field/parts.js
var to = [
	"day",
	"month",
	"year"
], no = [
	"hour",
	"minute",
	"second",
	"dayPeriod"
], ro = ["literal", "timeZoneName"], io = [...to, ...no], ao = [...io, ...ro], oo = [...no, ...ro];
ao.filter((e) => e !== "literal"), oo.filter((e) => e !== "literal");
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/internal/date-time/placeholders.js
var so = /* @__PURE__ */ "ach.af.am.an.ar.ast.az.be.bg.bn.br.bs.ca.cak.ckb.cs.cy.da.de.dsb.el.en.eo.es.et.eu.fa.ff.fi.fr.fy.ga.gd.gl.he.hr.hsb.hu.ia.id.it.ja.ka.kk.kn.ko.lb.lo.lt.lv.meh.ml.ms.nl.nn.no.oc.pl.pt.rm.ro.ru.sc.scn.sk.sl.sr.sv.szl.tg.th.tr.uk.zh-CN.zh-TW".split("."), co = [
	"year",
	"month",
	"day"
], lo = {
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
function uo(e) {
	if (po(e)) return lo[e];
	{
		let t = _o(e);
		return po(t) ? lo[t] : lo.en;
	}
}
function fo(e, t, n) {
	return mo(e) ? uo(n)[e] : go(e) ? t : ho(e) ? "––" : "";
}
function po(e) {
	return so.includes(e);
}
function mo(e) {
	return co.includes(e);
}
function ho(e) {
	return e === "hour" || e === "minute" || e === "second";
}
function go(e) {
	return e === "era" || e === "dayPeriod";
}
function _o(e) {
	return Intl.Locale ? new Intl.Locale(e).language : e.split("-")[0];
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/internal/date-time/field/helpers.js
function vo(e) {
	let t = [
		"hour",
		"minute",
		"second"
	], n = io.map((e) => e === "dayPeriod" ? [e, "AM"] : [e, null]).filter(([n]) => n === "literal" || n === null ? !1 : e !== "day" || !t.includes(n));
	return Object.fromEntries(n);
}
function yo(e) {
	let { segmentValues: t, formatter: n, locale: r, dateRef: i } = e, a = Object.keys(t).reduce((e, n) => {
		if (!To(n)) return e;
		if ("hour" in t && n === "dayPeriod") {
			let i = t[n];
			e[n] = De(i) ? fo(n, "AM", r) : i;
		} else e[n] = o(n);
		return e;
	}, {});
	function o(a) {
		if (a === "day" && De(t.month) && !De(t.day)) {
			let e = Number.parseInt(t.day);
			if (e >= 1 && e <= 31) return t.day.startsWith("0") && `${e}`.length === 1 ? `0${e}` : `${e}`;
		}
		if ("hour" in t) {
			let o = t[a], s = typeof o == "string" && o?.startsWith("0"), c = o === null ? null : Number.parseInt(o);
			if (o === "0" && a !== "year") return "0";
			if (!De(o) && !De(c)) {
				let l = n.part(zo(a, i, t).set({ [a]: o }), a, { hourCycle: e.hourCycle === 24 ? "h23" : void 0 }), u = e.hourCycle === 12 || e.hourCycle === void 0 && Bo(r) === 12;
				if (a === "hour" && u) {
					if (c > 12) {
						let e = c - 12;
						return e === 0 ? "12" : e < 10 ? `0${e}` : `${e}`;
					}
					return c === 0 ? "12" : c < 10 ? `0${c}` : `${c}`;
				}
				return a === "year" ? `${o}` : s && l.length === 1 ? `0${l}` : l;
			}
			return fo(a, "", r);
		}
		if (wo(a)) {
			let e = t[a], o = typeof e == "string" && e?.startsWith("0");
			if (e === "0") return "0";
			if (De(e)) return fo(a, "", r);
			{
				let r = n.part(zo(a, i, t).set({ [a]: e }), a);
				return a === "year" ? `${e}` : o && r.length === 1 ? `0${r}` : r;
			}
		}
		return "";
	}
	return a;
}
function bo(e) {
	let { granularity: t, dateRef: n, formatter: r, contentObj: i, hideTimeZone: a, hourCycle: o } = e;
	return r.toParts(n, So(t, o)).map((e) => [
		"literal",
		"dayPeriod",
		"timeZoneName",
		null
	].includes(e.type) || !To(e.type) ? {
		part: e.type,
		value: e.value
	} : {
		part: e.type,
		value: i[e.type]
	}).filter((e) => !(De(e.part) || De(e.value) || e.part === "timeZoneName" && (!Ja(n) || a)));
}
function xo(e) {
	let t = yo(e);
	return {
		obj: t,
		arr: bo({
			contentObj: t,
			...e
		})
	};
}
function So(e, t) {
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
function Co() {
	return io.reduce((e, t) => (e[t] = {
		lastKeyZero: !1,
		hasLeftFocus: !0,
		updating: null
	}, e), {});
}
function wo(e) {
	return to.includes(e);
}
function To(e) {
	return io.includes(e);
}
function Eo(e) {
	return ao.includes(e);
}
function Do(e) {
	return !je || !e ? [] : Xo(e).map((e) => e.dataset.segment).filter((e) => io.includes(e));
}
var Oo = [
	"year",
	"month",
	"day",
	"hour",
	"minute",
	"second",
	"dayPeriod"
];
function ko(e) {
	let t = Oo.indexOf(e);
	return t === -1 ? Oo.length : t;
}
function Ao(e) {
	let { segmentObj: t, fieldNode: n, dateRef: r } = e, i = Do(n).sort((e, t) => ko(e) - ko(t)), a = r;
	for (let e of i) if ("hour" in t) {
		let n = t[e];
		if (De(n)) continue;
		a = a.set({ [e]: t[e] });
	} else if (wo(e)) {
		let n = t[e];
		if (De(n)) continue;
		a = a.set({ [e]: t[e] });
	}
	return a;
}
function jo(e, t) {
	let n = Do(t);
	for (let t of n) if ("hour" in e) {
		if (e[t] === null) return !1;
	} else if (wo(t) && e[t] === null) return !1;
	return !0;
}
function Mo(e) {
	return typeof e != "object" || !e ? !1 : Object.entries(e).every(([e, t]) => (no.includes(e) || to.includes(e)) && (e === "dayPeriod" ? t === "AM" || t === "PM" || t === null : typeof t == "string" || typeof t == "number" || t === null));
}
function No(e, t) {
	return t || (Ya(e) ? "minute" : "day");
}
function Po(e) {
	return !!([
		"Enter",
		"ArrowUp",
		"ArrowDown",
		"ArrowLeft",
		"ArrowRight",
		"Backspace",
		" "
	].includes(e) || Be(e));
}
function Fo(e, t) {
	if (!je) return !1;
	let n = Xo(t);
	return n.length ? n[0].id === e : !1;
}
function Io(e) {
	let { id: t, formatter: n, value: r, doc: i } = e;
	if (!je) return;
	let a = n.selectedDate(r), o = i.getElementById(t);
	if (o) o.innerText = `Selected Date: ${a}`;
	else {
		let e = i.createElement("div");
		e.style.cssText = ze({ display: "none" }), e.id = t, e.innerText = `Selected Date: ${a}`, i.body.appendChild(e);
	}
}
function Lo(e, t) {
	if (!je) return;
	let n = t.getElementById(e);
	n && t.body.removeChild(n);
}
function Ro(e, t) {
	return e ? Xa(t.set({ month: Number.parseInt(e) })) : 31;
}
function zo(e, t, n) {
	if (e !== "day") return t;
	let r = t;
	return De(n.year) || (r = r.set({ year: Number.parseInt(n.year) })), De(n.month) || (r = r.set({ month: Number.parseInt(n.month) })), r;
}
function Bo(e) {
	return new Intl.DateTimeFormat(e, { hour: "numeric" }).formatToParts(/* @__PURE__ */ new Date("2023-01-01T13:00:00")).find((e) => e.type === "hour")?.value === "1" ? 12 : 24;
}
function Vo(e, t) {
	let n = Number.parseInt(e);
	return Number.isNaN(n) ? e : t === "AM" ? n === 12 ? "0" : `${n}` : n < 12 ? `${n + 12}` : `${n}`;
}
function Ho(e) {
	if (e === null) return e;
	let t = Number.parseInt(e);
	return Number.isNaN(t) ? e : t === 0 ? "12" : t > 12 ? `${t - 12}` : e;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/internal/date-time/field/segments.js
function Uo(e, t) {
	let n = e.currentTarget;
	if (!Me(n)) return;
	let { prev: r, next: i } = Ko(n, t);
	if (e.key === "ArrowLeft") {
		if (!r) return;
		r.focus();
	} else if (e.key === "ArrowRight") {
		if (!i) return;
		i.focus();
	}
}
function Wo(e, t) {
	let n = t.indexOf(e);
	return n === t.length - 1 || n === -1 ? null : t[n + 1];
}
function Go(e, t) {
	let n = t.indexOf(e);
	return n === 0 || n === -1 ? null : t[n - 1];
}
function Ko(e, t) {
	let n = Xo(t);
	return n.length ? {
		next: Wo(e, n),
		prev: Go(e, n)
	} : {
		next: null,
		prev: null
	};
}
function qo(e, t) {
	let n = e.currentTarget;
	if (!Me(n)) return;
	let { next: r } = Ko(n, t);
	r && r.focus();
}
function Jo(e, t) {
	let n = e.currentTarget;
	if (!Me(n)) return;
	let { prev: r } = Ko(n, t);
	r && r.focus();
}
function Yo(e) {
	return e === "ArrowRight" || e === "ArrowLeft";
}
function Xo(e) {
	return e ? Array.from(e.querySelectorAll("[data-segment]")).filter((e) => {
		if (!Me(e)) return !1;
		let t = e.dataset.segment;
		return t === "trigger" || !(!Eo(t) || t === "literal");
	}) : [];
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/internal/date-time/formatter.js
var Zo = {
	year: "numeric",
	month: "numeric",
	day: "numeric",
	hour: "numeric",
	minute: "numeric",
	second: "numeric"
};
function Qo(e) {
	let t = e.initialLocale;
	function n(e) {
		t = e;
	}
	function r() {
		return t;
	}
	function i(e, n) {
		return new ja(t, n).format(e);
	}
	function a(e, t = !0) {
		return Ya(e) && t ? i(Wa(e), {
			dateStyle: "long",
			timeStyle: "long"
		}) : i(Wa(e), { dateStyle: "long" });
	}
	function o(n) {
		return typeof e.monthFormat.current != "function" && typeof e.yearFormat.current != "function" ? new ja(t, {
			month: e.monthFormat.current,
			year: e.yearFormat.current
		}).format(n) : `${typeof e.monthFormat.current == "function" ? e.monthFormat.current(n.getMonth() + 1) : new ja(t, { month: e.monthFormat.current }).format(n)} ${typeof e.yearFormat.current == "function" ? e.yearFormat.current(n.getFullYear()) : new ja(t, { year: e.yearFormat.current }).format(n)}`;
	}
	function s(e) {
		return new ja(t, { month: "long" }).format(e);
	}
	function c(e) {
		return new ja(t, { year: "numeric" }).format(e);
	}
	function l(e, n) {
		return Ja(e) ? new ja(t, {
			...n,
			timeZone: e.timeZone
		}).formatToParts(Wa(e)) : new ja(t, n).formatToParts(Wa(e));
	}
	function u(e, n = "narrow") {
		return new ja(t, { weekday: n }).format(e);
	}
	function d(e, n = void 0) {
		return new ja(t, {
			hour: "numeric",
			minute: "numeric",
			hourCycle: n === 24 ? "h23" : void 0
		}).formatToParts(e).find((e) => e.type === "dayPeriod")?.value === "PM" ? "PM" : "AM";
	}
	function f(e, t, n = {}) {
		let r = l(e, {
			...Zo,
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
function $o(e) {
	return !(!Me(e) || !e.hasAttribute("data-bits-day"));
}
function es(e, t) {
	let n = [], r = e.add({ days: 1 }), i = t;
	for (; r.compare(i) < 0;) n.push(r), r = r.add({ days: 1 });
	return n;
}
function ts(e) {
	let { dateObj: t, weekStartsOn: n, fixedWeeks: r, locale: i } = e, a = Xa(t), o = Array.from({ length: a }, (e, n) => t.set({ day: n + 1 })), s = gi(t), c = _i(t), l = n === void 0 ? $a(s, 0, i) : $a(s, n, "en-US"), u = n === void 0 ? eo(c, 0, i) : eo(c, n, "en-US"), d = es(l.subtract({ days: 1 }), s), f = es(c, u.add({ days: 1 })), p = d.length + o.length + f.length;
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
		weeks: Cn(m, 7)
	};
}
function ns(e) {
	let { numberOfMonths: t, dateObj: n, ...r } = e, i = [];
	if (!t || t === 1) return i.push(ts({
		...r,
		dateObj: n
	})), i;
	i.push(ts({
		...r,
		dateObj: n
	}));
	for (let e = 1; e < t; e++) {
		let t = n.add({ months: e });
		i.push(ts({
			...r,
			dateObj: t
		}));
	}
	return i;
}
function rs(e) {
	return e ? Array.from(e.querySelectorAll("[data-bits-day]:not([data-disabled]):not([data-outside-visible-months])")).filter((e) => Me(e)) : [];
}
function is(e, t) {
	let n = e.getAttribute("data-value");
	n && (t.current = Ua(n, t.current));
}
function as({ node: e, add: t, useCalendarDayOffset: n = !1, placeholder: r, calendarNode: i, isPrevButtonDisabled: a, isNextButtonDisabled: o, months: s, numberOfMonths: c }) {
	let l = rs(i);
	if (!l.length) return;
	if (n) {
		let n = e.getAttribute("data-value");
		if (!n) return;
		let a = Ua(n, r.current).add({ days: t }), o = Array.from(i?.querySelectorAll("[data-bits-day]:not([data-outside-visible-months])") ?? []).map((e) => e.getAttribute("data-value")).filter((e) => e !== null);
		for (; o.includes(a.toString());) {
			let e = l.find((e) => e.getAttribute("data-value") === a.toString());
			if (e) return is(e, r), e.focus();
			a = a.add({ days: t });
		}
	}
	let u = l.indexOf(e) + t;
	if (Tn(u, l)) {
		let e = l[u];
		return is(e, r), e.focus();
	}
	if (u < 0) {
		if (a) return;
		let e = s[0]?.value;
		if (!e) return;
		r.current = e.subtract({ months: c }), be(() => {
			let e = rs(i);
			if (!e.length) return;
			let t = e.length - Math.abs(u);
			if (Tn(t, e)) {
				let n = e[t];
				return is(n, r), n.focus();
			}
		});
	}
	if (u >= l.length) {
		if (o) return;
		let e = s[0]?.value;
		if (!e) return;
		r.current = e.add({ months: c }), be(() => {
			let e = rs(i);
			if (!e.length) return;
			let t = u - l.length;
			if (Tn(t, e)) return e[t].focus();
		});
	}
}
var os = [
	He,
	Ve,
	Se,
	_e
], ss = [ve, " "];
function cs({ event: e, handleCellClick: t, shiftFocus: n, placeholderValue: r }) {
	let i = e.target;
	if (!$o(i) || !os.includes(e.key) && !ss.includes(e.key)) return;
	e.preventDefault();
	let a = {
		[He]: 7,
		[Ve]: -7,
		[Se]: -1,
		[_e]: 1
	};
	if (os.includes(e.key)) {
		let t = a[e.key];
		t !== void 0 && n(i, t);
	}
	if (ss.includes(e.key)) {
		let n = i.getAttribute("data-value");
		if (!n) return;
		t(e, Ua(n, r));
	}
}
function ls({ months: e, setMonths: t, numberOfMonths: n, pagedNavigation: r, weekStartsOn: i, locale: a, fixedWeeks: o, setPlaceholder: s }) {
	let c = e[0]?.value;
	if (c) {
		if (r) s(c.add({ months: n }));
		else {
			let e = c.add({ months: 1 }), r = ns({
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
function us({ months: e, setMonths: t, numberOfMonths: n, pagedNavigation: r, weekStartsOn: i, locale: a, fixedWeeks: o, setPlaceholder: s }) {
	let c = e[0]?.value;
	if (c) {
		if (r) s(c.subtract({ months: n }));
		else {
			let e = c.subtract({ months: 1 }), r = ns({
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
function ds({ months: e, formatter: t, weekdayFormat: n }) {
	if (!e.length) return [];
	let r = e[0].weeks[0];
	return r ? r.map((e) => t.dayOfWeek(Wa(Pi(e)), n)) : [];
}
function fs(e) {
	w(() => {
		let t = e.weekStartsOn.current, n = e.locale.current, r = e.fixedWeeks.current, i = e.numberOfMonths.current;
		j(() => {
			let a = e.placeholder.current;
			if (!a) return;
			let o = {
				weekStartsOn: t,
				locale: n,
				fixedWeeks: r,
				numberOfMonths: i
			};
			e.setMonths(ns({
				...o,
				dateObj: a
			}));
		});
	});
}
function ps({ calendarNode: e, label: t, accessibleHeadingId: n }) {
	let r = Te(e), i = r.createElement("div");
	i.style.cssText = ze({
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
function ms({ placeholder: e, getVisibleMonths: t, weekStartsOn: n, locale: r, fixedWeeks: i, numberOfMonths: a, setMonths: o }) {
	w(() => {
		e.current, j(() => {
			t().some((t) => ai(t, e.current)) || o(ns({
				weekStartsOn: n.current,
				locale: r.current,
				fixedWeeks: i.current,
				numberOfMonths: a.current,
				dateObj: e.current
			}));
		});
	});
}
function hs({ maxValue: e, months: t, disabled: n }) {
	if (!e || !t.length) return !1;
	if (n) return !0;
	let r = t[t.length - 1]?.value;
	return r ? Qa(r.add({ months: 1 }).set({ day: 1 }), e) : !1;
}
function gs({ minValue: e, months: t, disabled: n }) {
	if (!e || !t.length) return !1;
	if (n) return !0;
	let r = t[0]?.value;
	return r ? Za(r.subtract({ months: 1 }).set({ day: 35 }), e) : !1;
}
function _s({ months: e, locale: t, formatter: n }) {
	if (!e.length) return "";
	if (t !== n.getLocale() && n.setLocale(t), e.length === 1) {
		let t = Wa(Pi(e[0].value));
		return `${n.fullMonthAndYear(t)}`;
	}
	let r = Wa(Pi(e[0].value)), i = Wa(Pi(e[e.length - 1].value)), a = n.fullMonth(r), o = n.fullMonth(i), s = n.fullYear(r), c = n.fullYear(i);
	return s === c ? `${a} - ${o} ${c}` : `${a} ${s} - ${o} ${c}`;
}
function vs({ fullCalendarLabel: e, id: t, isInvalid: n, disabled: r, readonly: i }) {
	return {
		id: t,
		role: "application",
		"aria-label": e,
		"data-invalid": X(n),
		"data-disabled": X(r),
		"data-readonly": X(i)
	};
}
function ys(e) {
	if (e.defaultPrevented) return;
	let t = Te(e.target).querySelector("[data-bits-day][data-focused]");
	t && (e.preventDefault(), t?.focus());
}
function bs(e) {
	if (!je) return;
	let t = Array.from(e.querySelectorAll("[data-bits-day]:not([aria-disabled=true])"));
	if (t.length === 0) return;
	let n = t[0], r = n?.getAttribute("data-value"), i = n?.getAttribute("data-type");
	if (r && i) return Ka(r, i);
}
function xs(e, t, n) {
	if (!e || !n(e)) return e;
	for (let e of t) {
		let t = e.dates.find((t) => ai(t, e.value) && !n(t));
		if (t) return t;
	}
	return e;
}
function Ss({ ref: e, placeholder: t, defaultPlaceholder: n, minValue: r, maxValue: i, isDateDisabled: a }) {
	function o(e) {
		return !!(a.current(e) || r.current && Za(e, r.current) || i.current && Za(i.current, e));
	}
	Ee(() => e.current, () => {
		e.current && t.current && ii(t.current, n) && o(n) && (t.current = bs(e.current) ?? n);
	});
}
function Cs(e, t) {
	return !e || !t ? e : Ya(e) && Ya(t) ? e.set({
		hour: t.hour,
		minute: t.minute,
		millisecond: t.millisecond,
		second: t.second
	}) : e;
}
var ws = ye({
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
function Ts(e) {
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
var Es = new Y("Calendar.Root | RangeCalender.Root"), Ds = class e {
	static create(t) {
		return Es.set(new e(t));
	}
	opts;
	#e = U(() => this.months.map((e) => e.value));
	get visibleMonths() {
		return F(this.#e);
	}
	set visibleMonths(e) {
		O(this.#e, e);
	}
	#t = U(() => (this.months, ui(hi())));
	get todayDate() {
		return F(this.#t);
	}
	set todayDate(e) {
		O(this.#t, e);
	}
	formatter;
	accessibleHeadingId = Ie();
	domContext;
	attachment;
	#n = H(P([]));
	get months() {
		return F(this.#n);
	}
	set months(e) {
		O(this.#n, e, !0);
	}
	#r = U(() => xs(this.opts.placeholder.current, this.months, (e) => this.isDateDisabled(e)));
	get tabbableDate() {
		return F(this.#r);
	}
	set tabbableDate(e) {
		O(this.#r, e);
	}
	announcer;
	constructor(e) {
		this.opts = e, this.attachment = ge(this.opts.ref), this.domContext = new we(e.ref), this.announcer = Ba(null), this.formatter = Qo({
			initialLocale: this.opts.locale.current,
			monthFormat: this.opts.monthFormat,
			yearFormat: this.opts.yearFormat
		}), this.setMonths = this.setMonths.bind(this), this.nextPage = this.nextPage.bind(this), this.prevPage = this.prevPage.bind(this), this.prevYear = this.prevYear.bind(this), this.nextYear = this.nextYear.bind(this), this.setYear = this.setYear.bind(this), this.setMonth = this.setMonth.bind(this), this.isOutsideVisibleMonths = this.isOutsideVisibleMonths.bind(this), this.isDateDisabled = this.isDateDisabled.bind(this), this.isDateSelected = this.isDateSelected.bind(this), this.shiftFocus = this.shiftFocus.bind(this), this.handleCellClick = this.handleCellClick.bind(this), this.handleMultipleUpdate = this.handleMultipleUpdate.bind(this), this.handleSingleUpdate = this.handleSingleUpdate.bind(this), this.onkeydown = this.onkeydown.bind(this), this.getBitsAttr = this.getBitsAttr.bind(this), ee(() => {
			this.announcer = Ba(this.domContext.getDocument());
		}), this.months = ns({
			dateObj: this.opts.placeholder.current,
			weekStartsOn: this.opts.weekStartsOn.current,
			locale: this.opts.locale.current,
			fixedWeeks: this.opts.fixedWeeks.current,
			numberOfMonths: this.opts.numberOfMonths.current
		}), this.#s(), this.#c(), this.#l(), ms({
			placeholder: this.opts.placeholder,
			getVisibleMonths: () => this.visibleMonths,
			weekStartsOn: this.opts.weekStartsOn,
			locale: this.opts.locale,
			fixedWeeks: this.opts.fixedWeeks,
			numberOfMonths: this.opts.numberOfMonths,
			setMonths: (e) => this.months = e
		}), fs({
			fixedWeeks: this.opts.fixedWeeks,
			locale: this.opts.locale,
			numberOfMonths: this.opts.numberOfMonths,
			placeholder: this.opts.placeholder,
			setMonths: this.setMonths,
			weekStartsOn: this.opts.weekStartsOn
		}), Ee(() => this.fullCalendarLabel, (e) => {
			let t = this.domContext.getElementById(this.accessibleHeadingId);
			t && (t.textContent = e);
		}), Ee(() => this.opts.value.current, () => {
			let e = this.opts.value.current;
			if (Array.isArray(e) && e.length) {
				let t = e[e.length - 1];
				t && this.opts.placeholder.current !== t && (this.opts.placeholder.current = t);
			} else !Array.isArray(e) && e && this.opts.placeholder.current !== e && (this.opts.placeholder.current = e);
		}), Ss({
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
	#i = U(() => ds({
		months: this.months,
		formatter: this.formatter,
		weekdayFormat: this.opts.weekdayFormat.current
	}));
	get weekdays() {
		return F(this.#i);
	}
	set weekdays(e) {
		O(this.#i, e);
	}
	#a = U(() => j(() => this.opts.placeholder.current.year));
	get initialPlaceholderYear() {
		return F(this.#a);
	}
	set initialPlaceholderYear(e) {
		O(this.#a, e);
	}
	#o = U(() => Ts({
		minValue: this.opts.minValue.current,
		maxValue: this.opts.maxValue.current,
		placeholderYear: this.initialPlaceholderYear
	}));
	get defaultYears() {
		return F(this.#o);
	}
	set defaultYears(e) {
		O(this.#o, e);
	}
	#s() {
		w(() => {
			if (j(() => this.opts.initialFocus.current)) {
				let e = this.opts.ref.current?.querySelector("[data-focused]");
				e && e.focus();
			}
		});
	}
	#c() {
		w(() => {
			if (this.opts.ref.current) return ps({
				calendarNode: this.opts.ref.current,
				label: this.fullCalendarLabel,
				accessibleHeadingId: this.accessibleHeadingId
			});
		});
	}
	#l() {
		N(() => {
			this.formatter.getLocale() !== this.opts.locale.current && this.formatter.setLocale(this.opts.locale.current);
		});
	}
	nextPage() {
		ls({
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
		us({
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
	#u = U(() => hs({
		maxValue: this.opts.maxValue.current,
		months: this.months,
		disabled: this.opts.disabled.current
	}));
	get isNextButtonDisabled() {
		return F(this.#u);
	}
	set isNextButtonDisabled(e) {
		O(this.#u, e);
	}
	#d = U(() => gs({
		minValue: this.opts.minValue.current,
		months: this.months,
		disabled: this.opts.disabled.current
	}));
	get isPrevButtonDisabled() {
		return F(this.#d);
	}
	set isPrevButtonDisabled(e) {
		O(this.#d, e);
	}
	#f = U(() => {
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
		return F(this.#f);
	}
	set isInvalid(e) {
		O(this.#f, e);
	}
	#p = U(() => (this.opts.monthFormat.current, this.opts.yearFormat.current, _s({
		months: this.months,
		formatter: this.formatter,
		locale: this.opts.locale.current
	})));
	get headingValue() {
		return F(this.#p);
	}
	set headingValue(e) {
		O(this.#p, e);
	}
	#m = U(() => `${this.opts.calendarLabel.current} ${this.headingValue}`);
	get fullCalendarLabel() {
		return F(this.#m);
	}
	set fullCalendarLabel(e) {
		O(this.#m, e);
	}
	isOutsideVisibleMonths(e) {
		return !this.visibleMonths.some((t) => ai(e, t));
	}
	isDateDisabled(e) {
		if (this.opts.isDateDisabled.current(e) || this.opts.disabled.current) return !0;
		let t = this.opts.minValue.current, n = this.opts.maxValue.current;
		return !!(t && Za(e, t) || n && Za(n, e));
	}
	isDateSelected(e) {
		let t = this.opts.value.current;
		return Array.isArray(t) ? t.some((t) => ii(t, e)) : t ? ii(t, e) : !1;
	}
	shiftFocus(e, t) {
		return as({
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
			e ? this.announcer.announce(`Selected Date: ${this.formatter.selectedDate(e, !1)}`, "polite") : this.announcer.announce("Selected date is now empty.", "polite", 5e3), this.opts.value.current = Cs(e, n), e !== void 0 && this.opts.onDateSelect?.current?.();
		}
	}
	handleMultipleUpdate(e, t) {
		if (!e) {
			let e = [t];
			return this.#h(e) ? e : [t];
		}
		if (!Array.isArray(e)) return;
		let n = e.findIndex((e) => ii(e, t)), r = this.opts.preventDeselect.current;
		if (n === -1) {
			let n = [...e, t];
			return this.#h(n) ? n : [t];
		}
		if (r) return e;
		{
			let n = e.filter((e) => !ii(e, t));
			if (!n.length) {
				this.opts.placeholder.current = t;
				return;
			}
			return n;
		}
	}
	handleSingleUpdate(e, t) {
		if (!e) return t;
		if (!this.opts.preventDeselect.current && ii(e, t)) this.opts.placeholder.current = t;
		else return t;
	}
	onkeydown(e) {
		cs({
			event: e,
			handleCellClick: this.handleCellClick,
			shiftFocus: this.shiftFocus,
			placeholderValue: this.opts.placeholder.current
		});
	}
	#g = U(() => ({
		months: this.months,
		weekdays: this.weekdays
	}));
	get snippetProps() {
		return F(this.#g);
	}
	set snippetProps(e) {
		O(this.#g, e);
	}
	getBitsAttr = (e) => ws.getAttr(e);
	#_ = U(() => ({
		...vs({
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
		return F(this.#_);
	}
	set props(e) {
		O(this.#_, e);
	}
}, Os = class e {
	static create(t) {
		return new e(t, Es.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = ge(this.opts.ref);
	}
	#e = U(() => ({
		id: this.opts.id.current,
		"aria-hidden": xe(!0),
		"data-disabled": X(this.root.opts.disabled.current),
		"data-readonly": X(this.root.opts.readonly.current),
		[this.root.getBitsAttr("heading")]: "",
		...this.attachment
	}));
	get props() {
		return F(this.#e);
	}
	set props(e) {
		O(this.#e, e);
	}
}, ks = new Y("Calendar.Cell | RangeCalendar.Cell"), As = class e {
	static create(t) {
		return ks.set(new e(t, Es.get()));
	}
	opts;
	root;
	#e = U(() => Wa(Pi(this.opts.date.current)));
	get cellDate() {
		return F(this.#e);
	}
	set cellDate(e) {
		O(this.#e, e);
	}
	#t = U(() => this.root.opts.isDateUnavailable.current(this.opts.date.current));
	get isUnavailable() {
		return F(this.#t);
	}
	set isUnavailable(e) {
		O(this.#t, e);
	}
	#n = U(() => ii(this.opts.date.current, this.root.todayDate));
	get isDateToday() {
		return F(this.#n);
	}
	set isDateToday(e) {
		O(this.#n, e);
	}
	#r = U(() => !ai(this.opts.date.current, this.opts.month.current));
	get isOutsideMonth() {
		return F(this.#r);
	}
	set isOutsideMonth(e) {
		O(this.#r, e);
	}
	#i = U(() => this.root.isOutsideVisibleMonths(this.opts.date.current));
	get isOutsideVisibleMonths() {
		return F(this.#i);
	}
	set isOutsideVisibleMonths(e) {
		O(this.#i, e);
	}
	#a = U(() => this.root.isDateDisabled(this.opts.date.current) || this.isOutsideMonth && this.root.opts.disableDaysOutsideMonth.current);
	get isDisabled() {
		return F(this.#a);
	}
	set isDisabled(e) {
		O(this.#a, e);
	}
	#o = U(() => ii(this.opts.date.current, this.root.opts.placeholder.current));
	get isFocusedDate() {
		return F(this.#o);
	}
	set isFocusedDate(e) {
		O(this.#o, e);
	}
	#s = U(() => this.root.isDateSelected(this.opts.date.current));
	get isSelectedDate() {
		return F(this.#s);
	}
	set isSelectedDate(e) {
		O(this.#s, e);
	}
	#c = U(() => this.root.formatter.custom(this.cellDate, {
		weekday: "long",
		month: "long",
		day: "numeric",
		year: "numeric"
	}));
	get labelText() {
		return F(this.#c);
	}
	set labelText(e) {
		O(this.#c, e);
	}
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = ge(this.opts.ref);
	}
	#l = U(() => ({
		disabled: this.isDisabled,
		unavailable: this.isUnavailable,
		selected: this.isSelectedDate,
		day: `${this.opts.date.current.day}`
	}));
	get snippetProps() {
		return F(this.#l);
	}
	set snippetProps(e) {
		O(this.#l, e);
	}
	#u = U(() => this.isDisabled || this.isOutsideMonth && this.root.opts.disableDaysOutsideMonth.current || this.isUnavailable);
	get ariaDisabled() {
		return F(this.#u);
	}
	set ariaDisabled(e) {
		O(this.#u, e);
	}
	#d = U(() => ({
		"data-unavailable": X(this.isUnavailable),
		"data-today": this.isDateToday ? "" : void 0,
		"data-outside-month": this.isOutsideMonth ? "" : void 0,
		"data-outside-visible-months": this.isOutsideVisibleMonths ? "" : void 0,
		"data-focused": this.isFocusedDate ? "" : void 0,
		"data-selected": X(this.isSelectedDate),
		"data-value": this.opts.date.current.toString(),
		"data-type": Ga(this.opts.date.current),
		"data-disabled": X(this.isDisabled || this.isOutsideMonth && this.root.opts.disableDaysOutsideMonth.current)
	}));
	get sharedDataAttrs() {
		return F(this.#d);
	}
	set sharedDataAttrs(e) {
		O(this.#d, e);
	}
	#f = U(() => ({
		id: this.opts.id.current,
		role: "gridcell",
		"aria-selected": J(this.isSelectedDate),
		"aria-disabled": J(this.ariaDisabled),
		...this.sharedDataAttrs,
		[this.root.getBitsAttr("cell")]: "",
		...this.attachment
	}));
	get props() {
		return F(this.#f);
	}
	set props(e) {
		O(this.#f, e);
	}
}, js = class e {
	static create(t) {
		return new e(t, ks.get());
	}
	opts;
	cell;
	attachment;
	constructor(e, t) {
		this.opts = e, this.cell = t, this.onclick = this.onclick.bind(this), this.attachment = ge(this.opts.ref);
	}
	#e = U(() => this.cell.isOutsideMonth && this.cell.root.opts.disableDaysOutsideMonth.current || this.cell.isDisabled ? void 0 : this.cell.root.tabbableDate && ii(this.cell.opts.date.current, this.cell.root.tabbableDate) ? 0 : -1);
	onclick(e) {
		this.cell.isDisabled || this.cell.root.handleCellClick(e, this.cell.opts.date.current);
	}
	#t = U(() => ({
		disabled: this.cell.isDisabled,
		unavailable: this.cell.isUnavailable,
		selected: this.cell.isSelectedDate,
		day: `${this.cell.opts.date.current.day}`
	}));
	get snippetProps() {
		return F(this.#t);
	}
	set snippetProps(e) {
		O(this.#t, e);
	}
	#n = U(() => ({
		id: this.opts.id.current,
		role: "button",
		"aria-label": this.cell.labelText,
		"aria-disabled": J(this.cell.ariaDisabled),
		...this.cell.sharedDataAttrs,
		tabindex: F(this.#e),
		[this.cell.root.getBitsAttr("day")]: "",
		"data-bits-day": "",
		onclick: this.onclick,
		...this.attachment
	}));
	get props() {
		return F(this.#n);
	}
	set props(e) {
		O(this.#n, e);
	}
}, Ms = class e {
	static create(t) {
		return new e(t, Es.get());
	}
	opts;
	root;
	#e = U(() => this.root.isNextButtonDisabled);
	get isDisabled() {
		return F(this.#e);
	}
	set isDisabled(e) {
		O(this.#e, e);
	}
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.onclick = this.onclick.bind(this), this.attachment = ge(this.opts.ref);
	}
	onclick(e) {
		this.isDisabled || this.root.nextPage();
	}
	#t = U(() => ({
		id: this.opts.id.current,
		role: "button",
		type: "button",
		"aria-label": "Next",
		"aria-disabled": J(this.isDisabled),
		"data-disabled": X(this.isDisabled),
		disabled: this.isDisabled,
		[this.root.getBitsAttr("next-button")]: "",
		onclick: this.onclick,
		...this.attachment
	}));
	get props() {
		return F(this.#t);
	}
	set props(e) {
		O(this.#t, e);
	}
}, Ns = class e {
	static create(t) {
		return new e(t, Es.get());
	}
	opts;
	root;
	#e = U(() => this.root.isPrevButtonDisabled);
	get isDisabled() {
		return F(this.#e);
	}
	set isDisabled(e) {
		O(this.#e, e);
	}
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.onclick = this.onclick.bind(this), this.attachment = ge(this.opts.ref);
	}
	onclick(e) {
		this.isDisabled || this.root.prevPage();
	}
	#t = U(() => ({
		id: this.opts.id.current,
		role: "button",
		type: "button",
		"aria-label": "Previous",
		"aria-disabled": J(this.isDisabled),
		"data-disabled": X(this.isDisabled),
		disabled: this.isDisabled,
		[this.root.getBitsAttr("prev-button")]: "",
		onclick: this.onclick,
		...this.attachment
	}));
	get props() {
		return F(this.#t);
	}
	set props(e) {
		O(this.#t, e);
	}
}, Ps = class e {
	static create(t) {
		return new e(t, Es.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = ge(this.opts.ref);
	}
	#e = U(() => ({
		id: this.opts.id.current,
		tabindex: -1,
		role: "grid",
		"aria-readonly": J(this.root.opts.readonly.current),
		"aria-disabled": J(this.root.opts.disabled.current),
		"data-readonly": X(this.root.opts.readonly.current),
		"data-disabled": X(this.root.opts.disabled.current),
		[this.root.getBitsAttr("grid")]: "",
		...this.attachment
	}));
	get props() {
		return F(this.#e);
	}
	set props(e) {
		O(this.#e, e);
	}
}, Fs = class e {
	static create(t) {
		return new e(t, Es.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = ge(this.opts.ref);
	}
	#e = U(() => ({
		id: this.opts.id.current,
		"data-disabled": X(this.root.opts.disabled.current),
		"data-readonly": X(this.root.opts.readonly.current),
		[this.root.getBitsAttr("grid-body")]: "",
		...this.attachment
	}));
	get props() {
		return F(this.#e);
	}
	set props(e) {
		O(this.#e, e);
	}
}, Is = class e {
	static create(t) {
		return new e(t, Es.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = ge(this.opts.ref);
	}
	#e = U(() => ({
		id: this.opts.id.current,
		"data-disabled": X(this.root.opts.disabled.current),
		"data-readonly": X(this.root.opts.readonly.current),
		[this.root.getBitsAttr("grid-head")]: "",
		...this.attachment
	}));
	get props() {
		return F(this.#e);
	}
	set props(e) {
		O(this.#e, e);
	}
}, Ls = class e {
	static create(t) {
		return new e(t, Es.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = ge(this.opts.ref);
	}
	#e = U(() => ({
		id: this.opts.id.current,
		"data-disabled": X(this.root.opts.disabled.current),
		"data-readonly": X(this.root.opts.readonly.current),
		[this.root.getBitsAttr("grid-row")]: "",
		...this.attachment
	}));
	get props() {
		return F(this.#e);
	}
	set props(e) {
		O(this.#e, e);
	}
}, Rs = class e {
	static create(t) {
		return new e(t, Es.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = ge(this.opts.ref);
	}
	#e = U(() => ({
		id: this.opts.id.current,
		"data-disabled": X(this.root.opts.disabled.current),
		"data-readonly": X(this.root.opts.readonly.current),
		[this.root.getBitsAttr("head-cell")]: "",
		...this.attachment
	}));
	get props() {
		return F(this.#e);
	}
	set props(e) {
		O(this.#e, e);
	}
}, zs = class e {
	static create(t) {
		return new e(t, Es.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = ge(this.opts.ref);
	}
	#e = U(() => ({
		id: this.opts.id.current,
		"data-disabled": X(this.root.opts.disabled.current),
		"data-readonly": X(this.root.opts.readonly.current),
		[this.root.getBitsAttr("header")]: "",
		...this.attachment
	}));
	get props() {
		return F(this.#e);
	}
	set props(e) {
		O(this.#e, e);
	}
}, Bs = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"children",
	"child",
	"ref",
	"id"
]), Vs = o("<div><!></div>");
function Hs(e, t) {
	let i = a();
	n(t, !0);
	let o = L(t, "ref", 15, null), s = L(t, "id", 19, () => Ne(i)), l = A(t, Bs), f = js.create({
		id: Z(() => s()),
		ref: Z(() => o(), (e) => o(e))
	}), p = U(() => ke(l, f.props));
	var m = r(), v = T(m), b = (e) => {
		var n = r(), i = T(n);
		{
			let e = U(() => ({
				props: F(p),
				...f.snippetProps
			}));
			d(i, () => t.child, () => F(e));
		}
		_(e, n);
	}, S = (e) => {
		var n = Vs();
		x(n, () => ({ ...F(p) }));
		var i = B(n), a = (e) => {
			var n = r(), i = T(n);
			d(i, () => t.children ?? u, () => f.snippetProps), _(e, n);
		}, o = (e) => {
			var t = y();
			z(() => g(t, f.cell.opts.date.current.day)), _(e, t);
		};
		W(i, (e) => {
			t.children ? e(a) : e(o, -1);
		}), c(n), _(e, n);
	};
	W(v, (e) => {
		t.child ? e(b) : e(S, -1);
	}), _(e, m), h();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/calendar/components/calendar-grid.svelte
var Us = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"children",
	"child",
	"ref",
	"id"
]), Ws = o("<table><!></table>");
function Gs(e, t) {
	let i = a();
	n(t, !0);
	let o = L(t, "ref", 15, null), s = L(t, "id", 19, () => Ne(i)), l = A(t, Us), f = Ps.create({
		id: Z(() => s()),
		ref: Z(() => o(), (e) => o(e))
	}), p = U(() => ke(l, f.props));
	var m = r(), g = T(m), v = (e) => {
		var n = r(), i = T(n);
		d(i, () => t.child, () => ({ props: F(p) })), _(e, n);
	}, y = (e) => {
		var n = Ws();
		x(n, () => ({ ...F(p) }));
		var r = B(n);
		d(r, () => t.children ?? u), c(n), _(e, n);
	};
	W(g, (e) => {
		t.child ? e(v) : e(y, -1);
	}), _(e, m), h();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/calendar/components/calendar-grid-body.svelte
var Ks = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"children",
	"child",
	"ref",
	"id"
]), qs = o("<tbody><!></tbody>");
function Js(e, t) {
	let i = a();
	n(t, !0);
	let o = L(t, "ref", 15, null), s = L(t, "id", 19, () => Ne(i)), l = A(t, Ks), f = Fs.create({
		id: Z(() => s()),
		ref: Z(() => o(), (e) => o(e))
	}), p = U(() => ke(l, f.props));
	var m = r(), g = T(m), v = (e) => {
		var n = r(), i = T(n);
		d(i, () => t.child, () => ({ props: F(p) })), _(e, n);
	}, y = (e) => {
		var n = qs();
		x(n, () => ({ ...F(p) }));
		var r = B(n);
		d(r, () => t.children ?? u), c(n), _(e, n);
	};
	W(g, (e) => {
		t.child ? e(v) : e(y, -1);
	}), _(e, m), h();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/calendar/components/calendar-cell.svelte
var Ys = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"children",
	"child",
	"ref",
	"id",
	"date",
	"month"
]), Xs = o("<td><!></td>");
function Zs(e, t) {
	let i = a();
	n(t, !0);
	let o = L(t, "ref", 15, null), s = L(t, "id", 19, () => Ne(i)), l = A(t, Ys), f = As.create({
		id: Z(() => s()),
		ref: Z(() => o(), (e) => o(e)),
		date: Z(() => t.date),
		month: Z(() => t.month)
	}), p = U(() => ke(l, f.props));
	var m = r(), g = T(m), v = (e) => {
		var n = r(), i = T(n);
		{
			let e = U(() => ({
				props: F(p),
				...f.snippetProps
			}));
			d(i, () => t.child, () => F(e));
		}
		_(e, n);
	}, y = (e) => {
		var n = Xs();
		x(n, () => ({ ...F(p) }));
		var r = B(n);
		d(r, () => t.children ?? u, () => f.snippetProps), c(n), _(e, n);
	};
	W(g, (e) => {
		t.child ? e(v) : e(y, -1);
	}), _(e, m), h();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/calendar/components/calendar-grid-head.svelte
var Qs = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"children",
	"child",
	"ref",
	"id"
]), $s = o("<thead><!></thead>");
function ec(e, t) {
	let i = a();
	n(t, !0);
	let o = L(t, "ref", 15, null), s = L(t, "id", 19, () => Ne(i)), l = A(t, Qs), f = Is.create({
		id: Z(() => s()),
		ref: Z(() => o(), (e) => o(e))
	}), p = U(() => ke(l, f.props));
	var m = r(), g = T(m), v = (e) => {
		var n = r(), i = T(n);
		d(i, () => t.child, () => ({ props: F(p) })), _(e, n);
	}, y = (e) => {
		var n = $s();
		x(n, () => ({ ...F(p) }));
		var r = B(n);
		d(r, () => t.children ?? u), c(n), _(e, n);
	};
	W(g, (e) => {
		t.child ? e(v) : e(y, -1);
	}), _(e, m), h();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/calendar/components/calendar-head-cell.svelte
var tc = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"children",
	"child",
	"ref",
	"id"
]), nc = o("<th><!></th>");
function rc(e, t) {
	let i = a();
	n(t, !0);
	let o = L(t, "ref", 15, null), s = L(t, "id", 19, () => Ne(i)), l = A(t, tc), f = Rs.create({
		id: Z(() => s()),
		ref: Z(() => o(), (e) => o(e))
	}), p = U(() => ke(l, f.props));
	var m = r(), g = T(m), v = (e) => {
		var n = r(), i = T(n);
		d(i, () => t.child, () => ({ props: F(p) })), _(e, n);
	}, y = (e) => {
		var n = nc();
		x(n, () => ({ ...F(p) }));
		var r = B(n);
		d(r, () => t.children ?? u), c(n), _(e, n);
	};
	W(g, (e) => {
		t.child ? e(v) : e(y, -1);
	}), _(e, m), h();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/calendar/components/calendar-grid-row.svelte
var ic = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"children",
	"child",
	"ref",
	"id"
]), ac = o("<tr><!></tr>");
function oc(e, t) {
	let i = a();
	n(t, !0);
	let o = L(t, "ref", 15, null), s = L(t, "id", 19, () => Ne(i)), l = A(t, ic), f = Ls.create({
		id: Z(() => s()),
		ref: Z(() => o(), (e) => o(e))
	}), p = U(() => ke(l, f.props));
	var m = r(), g = T(m), v = (e) => {
		var n = r(), i = T(n);
		d(i, () => t.child, () => ({ props: F(p) })), _(e, n);
	}, y = (e) => {
		var n = ac();
		x(n, () => ({ ...F(p) }));
		var r = B(n);
		d(r, () => t.children ?? u), c(n), _(e, n);
	};
	W(g, (e) => {
		t.child ? e(v) : e(y, -1);
	}), _(e, m), h();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/calendar/components/calendar-header.svelte
var sc = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"children",
	"child",
	"ref",
	"id"
]), cc = o("<header><!></header>");
function lc(e, t) {
	let i = a();
	n(t, !0);
	let o = L(t, "ref", 15, null), s = L(t, "id", 19, () => Ne(i)), l = A(t, sc), f = zs.create({
		id: Z(() => s()),
		ref: Z(() => o(), (e) => o(e))
	}), p = U(() => ke(l, f.props));
	var m = r(), g = T(m), v = (e) => {
		var n = r(), i = T(n);
		d(i, () => t.child, () => ({ props: F(p) })), _(e, n);
	}, y = (e) => {
		var n = cc();
		x(n, () => ({ ...F(p) }));
		var r = B(n);
		d(r, () => t.children ?? u), c(n), _(e, n);
	};
	W(g, (e) => {
		t.child ? e(v) : e(y, -1);
	}), _(e, m), h();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/calendar/components/calendar-heading.svelte
var uc = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"children",
	"child",
	"ref",
	"id"
]), dc = o("<div><!></div>");
function fc(e, t) {
	let i = a();
	n(t, !0);
	let o = L(t, "ref", 15, null), s = L(t, "id", 19, () => Ne(i)), l = A(t, uc), f = Os.create({
		id: Z(() => s()),
		ref: Z(() => o(), (e) => o(e))
	}), p = U(() => ke(l, f.props));
	var m = r(), v = T(m), b = (e) => {
		var n = r(), i = T(n);
		d(i, () => t.child, () => ({
			props: F(p),
			headingValue: f.root.headingValue
		})), _(e, n);
	}, S = (e) => {
		var n = dc();
		x(n, () => ({ ...F(p) }));
		var i = B(n), a = (e) => {
			var n = r(), i = T(n);
			d(i, () => t.children ?? u, () => ({ headingValue: f.root.headingValue })), _(e, n);
		}, o = (e) => {
			var t = y();
			z(() => g(t, f.root.headingValue)), _(e, t);
		};
		W(i, (e) => {
			t.children ? e(a) : e(o, -1);
		}), c(n), _(e, n);
	};
	W(v, (e) => {
		t.child ? e(b) : e(S, -1);
	}), _(e, m), h();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/calendar/components/calendar-next-button.svelte
var pc = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"children",
	"child",
	"id",
	"ref",
	"tabindex"
]), mc = o("<button><!></button>");
function hc(e, t) {
	let i = a();
	n(t, !0);
	let o = L(t, "id", 19, () => Ne(i)), s = L(t, "ref", 15, null), l = L(t, "tabindex", 3, 0), f = A(t, pc), p = Ms.create({
		id: Z(() => o()),
		ref: Z(() => s(), (e) => s(e))
	}), m = U(() => ke(f, p.props, { tabindex: l() }));
	var g = r(), v = T(g), y = (e) => {
		var n = r(), i = T(n);
		d(i, () => t.child, () => ({ props: F(m) })), _(e, n);
	}, b = (e) => {
		var n = mc();
		x(n, () => ({ ...F(m) }));
		var r = B(n);
		d(r, () => t.children ?? u), c(n), _(e, n);
	};
	W(v, (e) => {
		t.child ? e(y) : e(b, -1);
	}), _(e, g), h();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/calendar/components/calendar-prev-button.svelte
var gc = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"children",
	"child",
	"id",
	"ref",
	"tabindex"
]), _c = o("<button><!></button>");
function vc(e, t) {
	let i = a();
	n(t, !0);
	let o = L(t, "id", 19, () => Ne(i)), s = L(t, "ref", 15, null), l = L(t, "tabindex", 3, 0), f = A(t, gc), p = Ns.create({
		id: Z(() => o()),
		ref: Z(() => s(), (e) => s(e))
	}), m = U(() => ke(f, p.props, { tabindex: l() }));
	var g = r(), v = T(g), y = (e) => {
		var n = r(), i = T(n);
		d(i, () => t.child, () => ({ props: F(m) })), _(e, n);
	}, b = (e) => {
		var n = _c();
		x(n, () => ({ ...F(m) }));
		var r = B(n);
		d(r, () => t.children ?? u), c(n), _(e, n);
	};
	W(v, (e) => {
		t.child ? e(y) : e(b, -1);
	}), _(e, g), h();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/date-field/date-field.svelte.js
var yc = ye({
	component: "date-field",
	parts: [
		"input",
		"label",
		"segment"
	]
}), bc = {
	day: {
		min: 1,
		max: (e) => {
			let t = e.value.current ?? e.placeholder.current;
			return Ro(e.segmentValues.month, t);
		},
		cycle: 1,
		padZero: !0
	},
	month: {
		min: 1,
		max: 12,
		cycle: 1,
		padZero: !0,
		getAnnouncement: (e, t) => t.placeholder.current ? `${e} - ${t.formatter.fullMonth(Wa(t.placeholder.current.set({ month: e })))}` : ""
	},
	year: {
		min: 1,
		max: 9999,
		cycle: 1,
		padZero: !1
	},
	hour: {
		min: (e) => +(e.hourCycle.current === 12),
		max: (e) => e.hourCycle.current === 24 ? 23 : e.hourCycle.current === 12 || Bo(e.locale.current) === 12 ? 12 : 23,
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
}, xc = new Y("DateField.Root"), Sc = class e {
	static create(t, n) {
		return xc.set(new e(t, n));
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
	descriptionId = Ie();
	formatter;
	initialSegments;
	#e = H();
	get segmentValues() {
		return F(this.#e);
	}
	set segmentValues(e) {
		O(this.#e, e, !0);
	}
	announcer;
	#t = U(() => new Set(this.readonlySegments.current));
	get readonlySegmentsSet() {
		return F(this.#t);
	}
	set readonlySegmentsSet(e) {
		O(this.#t, e);
	}
	segmentStates = Co();
	#n = H(null);
	#r = H(null);
	#i = H(null);
	get descriptionNode() {
		return F(this.#i);
	}
	set descriptionNode(e) {
		O(this.#i, e, !0);
	}
	#a = H(null);
	get validationNode() {
		return F(this.#a);
	}
	set validationNode(e) {
		O(this.#a, e, !0);
	}
	states = Co();
	#o = !1;
	#s = H(null);
	get dayPeriodNode() {
		return F(this.#s);
	}
	set dayPeriodNode(e) {
		O(this.#s, e, !0);
	}
	hourInputDayPeriodHint = null;
	rangeRoot = void 0;
	#c = H("");
	get name() {
		return F(this.#c);
	}
	set name(e) {
		O(this.#c, e, !0);
	}
	domContext = new we(() => null);
	constructor(e, t) {
		this.rangeRoot = t, this.value = e.value, this.placeholder = t ? t.opts.placeholder : e.placeholder, this.validate = t ? Oe(void 0) : e.validate, this.minValue = t ? t.opts.minValue : e.minValue, this.maxValue = t ? t.opts.maxValue : e.maxValue, this.disabled = t ? t.opts.disabled : e.disabled, this.readonly = t ? t.opts.readonly : e.readonly, this.granularity = t ? t.opts.granularity : e.granularity, this.readonlySegments = t ? t.opts.readonlySegments : e.readonlySegments, this.hourCycle = t ? t.opts.hourCycle : e.hourCycle, this.locale = t ? t.opts.locale : e.locale, this.hideTimeZone = t ? t.opts.hideTimeZone : e.hideTimeZone, this.required = t ? t.opts.required : e.required, this.onInvalid = t ? t.opts.onInvalid : e.onInvalid, this.errorMessageId = t ? t.opts.errorMessageId : e.errorMessageId, this.isInvalidProp = e.isInvalidProp, this.formatter = Qo({
			initialLocale: this.locale.current,
			monthFormat: Z(() => "long"),
			yearFormat: Z(() => "numeric")
		}), this.initialSegments = vo(this.inferredGranularity), this.segmentValues = this.initialSegments, this.announcer = Ba(null), this.getFieldNode = this.getFieldNode.bind(this), this.updateSegment = this.updateSegment.bind(this), this.handleSegmentClick = this.handleSegmentClick.bind(this), this.getBaseSegmentAttrs = this.getBaseSegmentAttrs.bind(this), w(() => {
			j(() => {
				this.initialSegments = vo(this.inferredGranularity);
			});
		}), ee(() => {
			this.announcer = Ba(this.domContext.getDocument());
		}), Fe(() => {
			t || Lo(this.descriptionId, this.domContext.getDocument());
		}), w(() => {
			this.formatter.getLocale() !== this.locale.current && this.formatter.setLocale(this.locale.current);
		}), w(() => {
			if (t) return;
			this.value.current && Io({
				id: j(() => this.descriptionId),
				formatter: this.formatter,
				value: this.value.current,
				doc: this.domContext.getDocument()
			});
			let e = j(() => this.placeholder.current);
			this.value.current && e !== this.value.current && j(() => {
				this.value.current && (this.placeholder.current = this.value.current);
			});
		}), this.value.current && this.syncSegmentValues(this.value.current), w(() => {
			this.locale.current, this.value.current && this.syncSegmentValues(this.value.current), this.#l();
		}), w(() => {
			if (this.value.current === void 0) {
				if (this.#o) {
					this.#o = !1;
					return;
				}
				this.segmentValues = vo(this.inferredGranularity);
			}
		}), Ee(() => this.validationStatus, () => {
			this.validationStatus !== !1 && this.onInvalid.current?.(this.validationStatus.reason, this.validationStatus.message);
		});
	}
	setName(e) {
		this.name = e;
	}
	setFieldNode(e) {
		O(this.#n, e, !0);
	}
	getFieldNode() {
		return this.rangeRoot ? this.rangeRoot.fieldNode : F(this.#n);
	}
	setLabelNode(e) {
		O(this.#r, e, !0);
	}
	getLabelNode() {
		return this.rangeRoot ? this.rangeRoot.labelNode : F(this.#r);
	}
	#l() {
		this.states.day.updating = null, this.states.month.updating = null, this.states.year.updating = null, this.states.hour.updating = null, this.states.minute.updating = null, this.states.dayPeriod.updating = null;
	}
	setValue(e) {
		this.value.current = e;
	}
	syncSegmentValues(e) {
		let t = to.map((t) => {
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
			let n = no.map((t) => {
				if (t === "dayPeriod") return this.states.dayPeriod.updating ? [t, this.states.dayPeriod.updating] : [t, this.formatter.dayPeriod(Wa(e))];
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
	#u = U(() => {
		let e = this.value.current;
		if (!e) return !1;
		let t = this.validate.current?.(e);
		if (t) return {
			reason: "custom",
			message: t
		};
		let n = this.minValue.current;
		if (n && Za(e, n)) return { reason: "min" };
		let r = this.maxValue.current;
		return r && Za(r, e) ? { reason: "max" } : !1;
	});
	get validationStatus() {
		return F(this.#u);
	}
	set validationStatus(e) {
		O(this.#u, e);
	}
	#d = U(() => this.validationStatus !== !1 && (this.isInvalidProp.current, !0));
	get isInvalid() {
		return F(this.#d);
	}
	set isInvalid(e) {
		O(this.#d, e);
	}
	#f = U(() => this.granularity.current || No(this.placeholder.current, this.granularity.current));
	get inferredGranularity() {
		return F(this.#f);
	}
	set inferredGranularity(e) {
		O(this.#f, e);
	}
	#p = U(() => this.value.current === void 0 ? this.placeholder.current : this.value.current);
	get dateRef() {
		return F(this.#p);
	}
	set dateRef(e) {
		O(this.#p, e);
	}
	#m = U(() => xo({
		segmentValues: this.segmentValues,
		formatter: this.formatter,
		locale: this.locale.current,
		granularity: this.inferredGranularity,
		dateRef: this.dateRef,
		hideTimeZone: this.hideTimeZone.current,
		hourCycle: this.hourCycle.current
	}));
	get allSegmentContent() {
		return F(this.#m);
	}
	set allSegmentContent(e) {
		O(this.#m, e);
	}
	#h = U(() => this.allSegmentContent.arr);
	get segmentContents() {
		return F(this.#h);
	}
	set segmentContents(e) {
		O(this.#h, e);
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
		if (Mo(a)) {
			let n = a[e], r = t;
			if (e === "month") {
				let t = r(n);
				if (this.states.month.updating = t, t !== null && a.day !== null) {
					let e = Xa(Wa(s.set({ month: Number.parseInt(t) })));
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
				let t = this.hourInputDayPeriodHint, i = r(t === null ? n : Ho(a.hour)), c = i !== null && t !== null ? Vo(i, t) : i;
				if (this.states.hour.updating = c, c !== null && a.dayPeriod !== null) {
					if (t !== null) a.dayPeriod = t;
					else {
						let e = this.formatter.dayPeriod(Wa(s.set({ hour: Number.parseInt(c) })), this.hourCycle.current);
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
		} else if (wo(e)) {
			let n = a[e], r = t, i = r(n);
			if (e === "month" && i !== null && a.day !== null) {
				this.states.month.updating = i;
				let t = Xa(Wa(s.set({ month: Number.parseInt(i) })));
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
		this.segmentValues = o, jo(o, F(this.#n)) ? this.setValue(Ao({
			segmentObj: o,
			fieldNode: F(this.#n),
			dateRef: this.placeholder.current
		})) : (this.value.current !== void 0 && (this.#o = !0), this.setValue(void 0), this.segmentValues = o);
	}
	handleSegmentClick(e) {
		this.disabled.current && e.preventDefault();
	}
	getBaseSegmentAttrs(e, t) {
		let n = this.readonlySegmentsSet.has(e), r = {
			"aria-invalid": xe(this.isInvalid),
			"aria-disabled": J(this.disabled.current),
			"aria-readonly": J(this.readonly.current || n),
			"data-invalid": X(this.isInvalid),
			"data-disabled": X(this.disabled.current),
			"data-readonly": X(this.readonly.current || n),
			"data-segment": `${e}`,
			[yc.segment]: ""
		};
		if (e === "literal") return r;
		let i = this.descriptionNode?.id, a = Fo(t, F(this.#n)) && i, o = this.errorMessageId?.current, s = a ? `${i} ${this.isInvalid && o ? o : ""}` : void 0, c = !(this.readonly.current || n || this.disabled.current);
		return {
			...r,
			"aria-labelledby": this.#g(t),
			contenteditable: c ? "true" : void 0,
			"aria-describedby": s,
			tabindex: this.disabled.current ? void 0 : 0
		};
	}
}, Cc = class e {
	static create(t) {
		return new e(t, xc.get());
	}
	opts;
	root;
	domContext;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.domContext = new we(e.ref), this.root.domContext = this.domContext, this.attachment = ge(e.ref, (e) => this.root.setFieldNode(e)), Ee(() => this.opts.name.current, (e) => {
			this.root.setName(e);
		});
	}
	#e = U(() => {
		if (je && this.domContext.getElementById(this.root.descriptionId)) return this.root.descriptionId;
	});
	#t = U(() => ({
		id: this.opts.id.current,
		role: "group",
		"aria-labelledby": this.root.getLabelNode()?.id ?? void 0,
		"aria-describedby": F(this.#e),
		"aria-disabled": J(this.root.disabled.current),
		"data-invalid": this.root.isInvalid ? "" : void 0,
		"data-disabled": X(this.root.disabled.current),
		[yc.input]: "",
		...this.attachment
	}));
	get props() {
		return F(this.#t);
	}
	set props(e) {
		O(this.#t, e);
	}
}, wc = class e {
	static create() {
		return new e(xc.get());
	}
	root;
	#e = U(() => this.root.name !== "");
	get shouldRender() {
		return F(this.#e);
	}
	set shouldRender(e) {
		O(this.#e, e);
	}
	#t = U(() => this.root.value.current ? this.root.value.current.toString() : "");
	get isoValue() {
		return F(this.#t);
	}
	set isoValue(e) {
		O(this.#t, e);
	}
	constructor(e) {
		this.root = e;
	}
	#n = U(() => ({
		name: this.root.name,
		value: this.isoValue,
		required: this.root.required.current
	}));
	get props() {
		return F(this.#n);
	}
	set props(e) {
		O(this.#n, e);
	}
}, Tc = class {
	opts;
	root;
	announcer;
	part;
	config;
	attachment;
	constructor(e, t, n, r) {
		this.opts = e, this.root = t, this.part = n, this.config = r, this.announcer = t.announcer, this.onkeydown = this.onkeydown.bind(this), this.onfocusout = this.onfocusout.bind(this), this.attachment = ge(e.ref);
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
		e.ctrlKey || e.metaKey || this.root.disabled.current || (this.part !== "hour" && this.part !== "minute" && this.part !== "second" || this.part in t) && (e.key !== "Tab" && e.preventDefault(), Po(e.key) && (Lc(e.key) ? this.#i(t) : Rc(e.key) ? this.#a(t) : Be(e.key) ? this.#o(e) : zc(e.key) ? this.#s(e) : Yo(e.key) && Uo(e, this.root.getFieldNode())));
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
		}), n && qo(e, this.root.getFieldNode());
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
		}), n && Jo(e, this.root.getFieldNode());
	}
	onfocusout(e) {
		let t = this.part;
		t in this.root.states && (this.root.states[t].hasLeftFocus = !0), this.config.padZero && this.root.updateSegment(this.part, (e) => e && e.length === 1 ? `0${e}` : e);
	}
	getSegmentProps() {
		let e = this.root.segmentValues, t = this.root.placeholder.current, n = e[this.part] === null, r = wo(this.part) ? zo(this.part, t, e) : t;
		e[this.part] && (r = r.set({ [this.part]: Number.parseInt(e[this.part]) }));
		let i = r[this.part];
		if (this.part === "day" && !De(e.day) && De(e.month)) {
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
	#c = U(() => ({
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
		return F(this.#c);
	}
	set props(e) {
		O(this.#c, e);
	}
}, Ec = class extends Tc {
	#e = [];
	#t = 0;
	constructor(e, t) {
		super(e, t, "year", bc.year);
	}
	onkeydown(e) {
		e.ctrlKey || e.metaKey || this.root.disabled.current || (e.key !== "Tab" && e.preventDefault(), Po(e.key) && (Lc(e.key) || Rc(e.key) ? (this.#n(), super.onkeydown(e)) : Be(e.key) ? this.#i(e) : zc(e.key) ? this.#a(e) : Yo(e.key) && Uo(e, this.root.getFieldNode())));
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
			if (String(i).length < 4) return this.#t > 0 && this.#e.length <= this.#t && r.length <= 4 ? (this.announcer.announce(i), r.length === 4 && (t = !0), r) : (this.announcer.announce(i), Bc(i));
			this.announcer.announce(i), t = !0;
			let a = `${i}`;
			return a.length > 4 ? a.slice(0, 4) : a;
		}), this.#e.length === 4 && (t = !0), t && qo(e, this.root.getFieldNode());
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
		}), t && Jo(e, this.root.getFieldNode());
	}
	onfocusout(e) {
		this.root.states.year.hasLeftFocus = !0, this.#e = [], this.#n(), this.root.updateSegment("year", (e) => e && e.length !== 4 ? Bc(Number.parseInt(e)) : e);
	}
}, Dc = class extends Tc {
	constructor(e, t) {
		super(e, t, "day", bc.day);
	}
}, Oc = class extends Tc {
	constructor(e, t) {
		super(e, t, "month", bc.month);
	}
}, kc = class extends Tc {
	constructor(e, t) {
		super(e, t, "hour", bc.hour);
	}
	onkeydown(e) {
		let t = this.root.segmentValues;
		(Be(e.key) || zc(e.key)) && this.root.dayPeriodNode && Mo(t) && (this.root.hourInputDayPeriodHint = t.dayPeriod), super.onkeydown(e), this.root.hourInputDayPeriodHint = null;
	}
}, Ac = class extends Tc {
	constructor(e, t) {
		super(e, t, "minute", bc.minute);
	}
}, jc = class extends Tc {
	constructor(e, t) {
		super(e, t, "second", bc.second);
	}
}, Mc = class e {
	static create(t) {
		return new e(t, xc.get());
	}
	opts;
	root;
	attachment;
	#e;
	constructor(e, t) {
		this.opts = e, this.root = t, this.#e = this.root.announcer, this.onkeydown = this.onkeydown.bind(this), this.attachment = ge(e.ref, (e) => this.root.dayPeriodNode = e);
	}
	onkeydown(e) {
		e.ctrlKey || e.metaKey || this.root.disabled.current || (e.key !== "Tab" && e.preventDefault(), Ic(e.key) && (Lc(e.key) || Rc(e.key) ? this.root.updateSegment("dayPeriod", (e) => e === "AM" ? (this.#e.announce("PM"), "PM") : (this.#e.announce("AM"), "AM")) : (zc(e.key) && (this.root.states.dayPeriod.hasLeftFocus = !1, this.root.updateSegment("dayPeriod", () => (this.#e.announce("AM"), "AM"))), e.key === "A" || e.key, this.root.updateSegment("dayPeriod", () => {
			let t = e.key === "A" || e.key === "a" ? "AM" : "PM";
			return this.#e.announce(t), t;
		}), Yo(e.key) && Uo(e, this.root.getFieldNode()))));
	}
	#t = U(() => {
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
		return F(this.#t);
	}
	set props(e) {
		O(this.#t, e);
	}
}, Nc = class e {
	static create(t) {
		return new e(t, xc.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = ge(e.ref);
	}
	#e = U(() => ({
		id: this.opts.id.current,
		"aria-hidden": xe(!0),
		...this.root.getBaseSegmentAttrs("literal", this.opts.id.current),
		...this.attachment
	}));
	get props() {
		return F(this.#e);
	}
	set props(e) {
		O(this.#e, e);
	}
}, Pc = class e {
	static create(t) {
		return new e(t, xc.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.onkeydown = this.onkeydown.bind(this), this.attachment = ge(e.ref);
	}
	onkeydown(e) {
		e.key !== "Tab" && e.preventDefault(), !this.root.disabled.current && Yo(e.key) && Uo(e, this.root.getFieldNode());
	}
	#e = U(() => ({
		role: "textbox",
		id: this.opts.id.current,
		"aria-label": "timezone, ",
		style: { caretColor: "transparent" },
		onkeydown: this.onkeydown,
		...this.root.getBaseSegmentAttrs("timeZoneName", this.opts.id.current),
		"data-readonly": X(!0),
		...this.attachment
	}));
	get props() {
		return F(this.#e);
	}
	set props(e) {
		O(this.#e, e);
	}
}, Fc = class {
	static create(e, t) {
		let n = xc.get();
		switch (e) {
			case "day": return new Dc(t, n);
			case "month": return new Oc(t, n);
			case "year": return new Ec(t, n);
			case "hour": return new kc(t, n);
			case "minute": return new Ac(t, n);
			case "second": return new jc(t, n);
			case "dayPeriod": return new Mc(t, n);
			case "literal": return new Nc(t, n);
			case "timeZoneName": return new Pc(t, n);
		}
	}
};
function Ic(e) {
	return Po(e) || e === "A" || e === "P" || e === "a" || e === "p";
}
function Lc(e) {
	return e === Ve;
}
function Rc(e) {
	return e === He;
}
function zc(e) {
	return e === Ce;
}
function Bc(e) {
	let t = 4 - String(e).length;
	return `${"0".repeat(t)}${e}`;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/date-field/components/date-field-hidden-input.svelte
function Vc(e, t) {
	n(t, !0);
	let i = wc.create();
	var a = r(), o = T(a), s = (e) => {
		Dn(e, S(() => i.props));
	};
	W(o, (e) => {
		i.shouldRender && e(s);
	}), _(e, a), h();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/date-field/components/date-field-input.svelte
var Hc = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"id",
	"ref",
	"name",
	"children",
	"child"
]), Uc = o("<div><!></div>"), Wc = o("<!> <!>", 1);
function Gc(e, t) {
	let i = a();
	n(t, !0);
	let o = L(t, "id", 19, () => Ne(i)), s = L(t, "ref", 15, null), l = L(t, "name", 3, ""), f = A(t, Hc), p = Cc.create({
		id: Z(() => o()),
		ref: Z(() => s(), (e) => s(e)),
		name: Z(() => l())
	}), m = U(() => ke(f, p.props));
	var g = Wc(), v = T(g), y = (e) => {
		var n = r(), i = T(n);
		d(i, () => t.child, () => ({
			props: F(m),
			segments: p.root.segmentContents
		})), _(e, n);
	}, b = (e) => {
		var n = Uc();
		x(n, () => ({ ...F(m) }));
		var r = B(n);
		d(r, () => t.children ?? u, () => ({ segments: p.root.segmentContents })), c(n), _(e, n);
	};
	W(v, (e) => {
		t.child ? e(y) : e(b, -1);
	}), Vc(I(v, 2), {}), _(e, g), h();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/date-field/components/date-field-segment.svelte
var Kc = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"id",
	"ref",
	"children",
	"child",
	"part"
]), qc = o("<span><!></span>");
function Jc(e, t) {
	let i = a();
	n(t, !0);
	let o = L(t, "id", 19, () => Ne(i)), s = L(t, "ref", 15, null), l = A(t, Kc), f = Fc.create(j(() => t.part), {
		id: Z(() => o()),
		ref: Z(() => s(), (e) => s(e))
	}), p = U(() => ke(l, f.props));
	var m = r(), g = T(m), v = (e) => {
		var n = r(), i = T(n);
		d(i, () => t.child, () => ({ props: F(p) })), _(e, n);
	}, y = (e) => {
		var n = qc();
		x(n, () => ({ ...F(p) }));
		var r = B(n);
		d(r, () => t.children ?? u), c(n), _(e, n);
	};
	W(g, (e) => {
		t.child ? e(v) : e(y, -1);
	}), _(e, m), h();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/date-picker/date-picker.svelte.js
var Yc = new Y("DatePicker.Root"), Xc = class e {
	static create(t) {
		return Yc.set(new e(t));
	}
	opts;
	constructor(e) {
		this.opts = e;
	}
};
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/date-picker/components/date-picker.svelte
function Zc(e, t) {
	n(t, !0);
	let i = L(t, "open", 15, !1), a = L(t, "onOpenChange", 3, Le), o = L(t, "onOpenChangeComplete", 3, Le), s = L(t, "value", 15), c = L(t, "onValueChange", 3, Le), f = L(t, "placeholder", 15), p = L(t, "onPlaceholderChange", 3, Le), m = L(t, "isDateUnavailable", 3, () => !1), g = L(t, "validate", 3, Le), v = L(t, "onInvalid", 3, Le), y = L(t, "disabled", 3, !1), b = L(t, "readonly", 3, !1), x = L(t, "readonlySegments", 19, () => []), S = L(t, "hideTimeZone", 3, !1), C = L(t, "required", 3, !1), w = L(t, "calendarLabel", 3, "Event"), E = L(t, "disableDaysOutsideMonth", 3, !0), D = L(t, "preventDeselect", 3, !1), O = L(t, "pagedNavigation", 3, !1), k = L(t, "weekdayFormat", 3, "narrow"), A = L(t, "isDateDisabled", 3, () => !1), M = L(t, "fixedWeeks", 3, !1), N = L(t, "numberOfMonths", 3, 1), P = L(t, "closeOnDateSelect", 3, !0), ee = L(t, "initialFocus", 3, !1), F = L(t, "monthFormat", 3, "long"), te = L(t, "yearFormat", 3, "numeric"), I = j(() => Ha({
		granularity: t.granularity,
		defaultValue: s(),
		minValue: t.minValue,
		maxValue: t.maxValue
	}));
	function ne() {
		f() === void 0 && f(I);
	}
	ne(), Ee.pre(() => f(), () => {
		ne();
	});
	function R() {
		P() && i(!1);
	}
	let z = Xc.create({
		open: Z(() => i(), (e) => {
			i(e), a()(e);
		}),
		value: Z(() => s(), (e) => {
			s(e), c()(e);
		}),
		placeholder: Z(() => f() ?? I, (e) => {
			f(e), p()(e);
		}),
		isDateUnavailable: Z(() => m()),
		minValue: Z(() => t.minValue),
		maxValue: Z(() => t.maxValue),
		disabled: Z(() => y()),
		readonly: Z(() => b()),
		granularity: Z(() => t.granularity),
		readonlySegments: Z(() => x()),
		hourCycle: Z(() => t.hourCycle),
		locale: zt(() => t.locale),
		hideTimeZone: Z(() => S()),
		required: Z(() => C()),
		calendarLabel: Z(() => w()),
		disableDaysOutsideMonth: Z(() => E()),
		preventDeselect: Z(() => D()),
		pagedNavigation: Z(() => O()),
		weekStartsOn: Z(() => t.weekStartsOn),
		weekdayFormat: Z(() => k()),
		isDateDisabled: Z(() => A()),
		fixedWeeks: Z(() => M()),
		numberOfMonths: Z(() => N()),
		initialFocus: Z(() => ee()),
		onDateSelect: Z(() => R),
		defaultPlaceholder: I,
		monthFormat: Z(() => F()),
		yearFormat: Z(() => te())
	});
	Zn.create({
		open: z.opts.open,
		onOpenChangeComplete: Z(() => o())
	}), Sc.create({
		value: z.opts.value,
		disabled: z.opts.disabled,
		readonly: z.opts.readonly,
		readonlySegments: z.opts.readonlySegments,
		validate: Z(() => g()),
		onInvalid: Z(() => v()),
		minValue: z.opts.minValue,
		maxValue: z.opts.maxValue,
		granularity: z.opts.granularity,
		hideTimeZone: z.opts.hideTimeZone,
		hourCycle: z.opts.hourCycle,
		locale: z.opts.locale,
		required: z.opts.required,
		placeholder: z.opts.placeholder,
		errorMessageId: Z(() => t.errorMessageId),
		isInvalidProp: Z(() => void 0)
	});
	var re = r(), B = T(re);
	l(B, () => On, (e, n) => {
		n(e, {
			children: (e, n) => {
				var i = r(), a = T(i);
				d(a, () => t.children ?? u), _(e, i);
			},
			$$slots: { default: !0 }
		});
	}), _(e, re), h();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/date-picker/components/date-picker-calendar.svelte
var Qc = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"children",
	"child",
	"id",
	"ref"
]), $c = o("<div><!></div>");
function el(e, t) {
	let i = a();
	n(t, !0);
	let o = L(t, "id", 19, () => Ne(i)), s = L(t, "ref", 15, null), l = A(t, Qc), f = Yc.get(), p = Ds.create({
		id: Z(() => o()),
		ref: Z(() => s(), (e) => s(e)),
		calendarLabel: f.opts.calendarLabel,
		fixedWeeks: f.opts.fixedWeeks,
		isDateDisabled: f.opts.isDateDisabled,
		isDateUnavailable: f.opts.isDateUnavailable,
		locale: f.opts.locale,
		numberOfMonths: f.opts.numberOfMonths,
		pagedNavigation: f.opts.pagedNavigation,
		preventDeselect: f.opts.preventDeselect,
		readonly: f.opts.readonly,
		type: Z(() => "single"),
		weekStartsOn: f.opts.weekStartsOn,
		weekdayFormat: f.opts.weekdayFormat,
		disabled: f.opts.disabled,
		disableDaysOutsideMonth: f.opts.disableDaysOutsideMonth,
		maxValue: f.opts.maxValue,
		minValue: f.opts.minValue,
		placeholder: f.opts.placeholder,
		value: f.opts.value,
		onDateSelect: f.opts.onDateSelect,
		initialFocus: f.opts.initialFocus,
		defaultPlaceholder: f.opts.defaultPlaceholder,
		maxDays: Z(() => void 0),
		monthFormat: f.opts.monthFormat,
		yearFormat: f.opts.yearFormat
	}), m = U(() => ke(l, p.props));
	var g = r(), v = T(g), y = (e) => {
		var n = r(), i = T(n);
		{
			let e = U(() => ({
				props: F(m),
				...p.snippetProps
			}));
			d(i, () => t.child, () => F(e));
		}
		_(e, n);
	}, b = (e) => {
		var n = $c();
		x(n, () => ({ ...F(m) }));
		var r = B(n);
		d(r, () => t.children ?? u, () => p.snippetProps), c(n), _(e, n);
	};
	W(v, (e) => {
		t.child ? e(y) : e(b, -1);
	}), _(e, g), h();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/date-picker/components/date-picker-content.svelte
var tl = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"ref",
	"onOpenAutoFocus"
]);
function nl(e, t) {
	n(t, !0);
	let r = L(t, "ref", 15, null), i = A(t, tl), a = U(() => ke({ onOpenAutoFocus: t.onOpenAutoFocus }, { onOpenAutoFocus: ys }));
	Qn(e, S(() => F(a), () => i, {
		get ref() {
			return r();
		},
		set ref(e) {
			r(e);
		}
	})), h();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/date-picker/components/date-picker-trigger.svelte
var rl = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"ref",
	"onkeydown"
]);
function il(e, t) {
	n(t, !0);
	let r = L(t, "ref", 15, null), i = A(t, rl);
	function a(e) {
		if (Yo(e.key)) {
			let t = e.currentTarget.closest(yc.selector("input"));
			if (!t) return;
			Uo(e, t);
		}
	}
	let o = U(() => ke({ onkeydown: t.onkeydown }, { onkeydown: a }));
	$n(e, S(() => i, { "data-segment": "trigger" }, () => F(o), {
		get ref() {
			return r();
		},
		set ref(e) {
			r(e);
		}
	})), h();
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostHistoryRecordHeader.svelte
var al = o("<div class=\"post-history-channel-row svelte-9wiq8c\"><span class=\"channel-icon svg-icon svelte-9wiq8c\" aria-hidden=\"true\"></span> <span class=\"channel-label svelte-9wiq8c\"> </span> <span class=\"channel-name svelte-9wiq8c\"> </span></div>"), ol = o("<span class=\"deleted-badge svelte-9wiq8c\"> </span>"), sl = o("<span class=\"delete-failed svelte-9wiq8c\"> </span>"), cl = o("<div class=\"post-meta-inline svelte-9wiq8c\"><!> <!></div>"), ll = o("<div class=\"more-icon svg-icon\"></div>"), ul = o("<div class=\"calendar-icon svg-icon\" aria-hidden=\"true\"></div> <span> </span>", 1), dl = o("<!> <!>", 1), fl = o("<div class=\"post-history-menu-body\"><div class=\"post-history-menu-timestamp\"> </div> <!> <!> <!></div>"), pl = o("<span class=\"svelte-9wiq8c\"> </span> <!>", 1), ml = o("<div class=\"post-preview-header svelte-9wiq8c\"><!> <div class=\"post-preview-header-right svelte-9wiq8c\"><!> <!></div></div>"), hl = {
	hash: "svelte-9wiq8c",
	code: ".post-preview-header.svelte-9wiq8c {display:flex;align-items:center;justify-content:space-between;gap:8px;color:var(--text-muted);font-size:0.875rem;line-height:1.3;}.post-preview-header-right.svelte-9wiq8c {display:flex;align-items:center;gap:2px;flex-shrink:0;margin-inline-start:auto;}.post-preview-header-right.svelte-9wiq8c > span:where(.svelte-9wiq8c) {white-space:nowrap;}.post-history-channel-row.svelte-9wiq8c {display:flex;align-items:center;gap:6px;min-width:0;color:var(--text-muted);font-size:0.875rem;line-height:1.3;}.channel-icon.svelte-9wiq8c {width:18px;height:18px;flex-shrink:0;mask-image:var(--ehagaki-icon-666f72756d5f323464705f3030303030305f46494c4c315f776768743430305f47524144305f6f70737a32342e737667);background-color:currentColor;}.channel-label.svelte-9wiq8c {flex-shrink:0;}.channel-name.svelte-9wiq8c {min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.post-meta-inline.svelte-9wiq8c {margin-inline-start:auto;display:flex;align-items:center;gap:6px;}.deleted-badge.svelte-9wiq8c {padding:2px 6px;border-radius:999px;background:color-mix(in srgb, var(--danger), transparent 82%);color:var(--danger);font-weight:600;}.delete-failed.svelte-9wiq8c {color:var(--danger);}.post-history-item-deleted .post-meta-inline.svelte-9wiq8c > :where(.svelte-9wiq8c):not(.deleted-badge) {opacity:0.65;}"
};
function gl(t, i) {
	n(i, !0), e(t, hl);
	let a = () => R(Pe, "$_", s), o = () => R(Ae, "$locale", s), [s, u] = te(), d = le().overlayTarget;
	var f = ml(), p = B(f), m = (e) => {
		var t = al(), n = I(B(t), 2), r = D(n, !0), o = I(n, 2), s = D(o, !0);
		c(t), z((e) => {
			g(r, e), g(s, i.channelText);
		}, [() => a()("postHistory.channel")]), _(e, t);
	};
	W(p, (e) => {
		i.post.kind === 42 && e(m);
	});
	var v = I(p, 2), y = B(v), b = (e) => {
		var t = cl(), n = B(t), r = (e) => {
			var t = ol(), n = D(t, !0);
			z((e) => g(n, e), [() => a()("postHistory.deletedBadge")]), _(e, t);
		};
		W(n, (e) => {
			i.post.deletedAt && e(r);
		});
		var o = I(n, 2), s = (e) => {
			var t = sl(), n = D(t, !0);
			z((e) => g(n, e), [() => a()("postHistory.deleteFailed")]), _(e, t);
		};
		W(o, (e) => {
			i.deletionFailed && e(s);
		}), c(t), _(e, t);
	};
	W(y, (e) => {
		(i.post.deletedAt || i.deletionFailed) && e(b);
	});
	var x = I(y, 2), C = (e) => {
		var t = pl(), n = T(t), s = D(n, !0), u = I(n, 2);
		l(u, () => wn, (e, t) => {
			t(e, {
				get open() {
					return i.menuOpen;
				},
				get onOpenChange() {
					return i.onMenuOpenChange;
				},
				children: (e, t) => {
					var n = dl(), s = T(n);
					{
						let e = U(() => a()("common.showActions"));
						l(s, () => En, (t, n) => {
							n(t, {
								class: "menu-trigger post-history-menu-trigger",
								get "aria-label"() {
									return F(e);
								},
								children: (e, t) => {
									var n = ll();
									_(e, n);
								},
								$$slots: { default: !0 }
							});
						});
					}
					var u = I(s, 2);
					l(u, () => Ft, (e, t) => {
						t(e, {
							get to() {
								return d;
							},
							children: (e, t) => {
								var n = r(), s = T(n);
								l(s, () => Sn, (e, t) => {
									t(e, {
										side: "bottom",
										align: "start",
										sideOffset: 8,
										class: "post-history-menu-content",
										trapFocus: !1,
										preventScroll: !1,
										onCloseAutoFocus: (e) => e.preventDefault(),
										children: (e, t) => {
											let n = U(() => i.getActionItems());
											var r = fl(), s = B(r), u = D(s, !0), d = I(s, 2);
											l(d, () => xn, (e, t) => {
												t(e, { class: "post-history-menu-separator" });
											});
											var f = I(d, 2), p = (e) => {
												var t = dl(), n = T(t);
												l(n, () => bn, (e, t) => {
													t(e, {
														class: "menu-action-button",
														get onSelect() {
															return i.onShowSurroundingPosts;
														},
														children: (e, t) => {
															var n = ul(), r = I(T(n), 2), i = D(r, !0);
															z((e) => g(i, e), [() => a()("postHistory.showSurroundingPosts")]), _(e, n);
														},
														$$slots: { default: !0 }
													});
												});
												var r = I(n, 2);
												l(r, () => xn, (e, t) => {
													t(e, { class: "post-history-menu-separator" });
												}), _(e, t);
											};
											W(f, (e) => {
												i.showSurroundingPostsAction && e(p);
											});
											var m = I(f, 2);
											Br(m, S({
												order: "standard",
												showDeleteSeparator: !1
											}, () => F(n))), c(r), z((e) => g(u, e), [() => Ht(i.post.postedAt, o())]), _(e, r);
										},
										$$slots: { default: !0 }
									});
								}), _(e, n);
							},
							$$slots: { default: !0 }
						});
					}), _(e, n);
				},
				$$slots: { default: !0 }
			});
		}), z((e) => g(s, e), [() => Qt(i.post.postedAt)]), _(e, t);
	};
	W(x, (e) => {
		i.showTimestampMenu && e(C);
	}), c(v), c(f), _(t, f), h(), u();
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostHistoryRecordQuotePreviews.svelte
var _l = o("<div class=\"post-preview-quotes svelte-6zjobi\"></div>"), vl = {
	hash: "svelte-6zjobi",
	code: ".post-preview-body .post-preview-quotes.svelte-6zjobi {display:flex;flex-direction:column;gap:4px;margin-inline-start:-1rem;}"
};
function yl(t, a) {
	n(a, !0), e(t, vl);
	let o = () => R(Pe, "$_", l), s = () => R(Ae, "$locale", l), [l, u] = te();
	var d = r(), f = T(d), p = (e) => {
		var t = _l();
		i(t, 21, () => a.previews, (e) => e.eventId, (e, t) => {
			{
				let n = (e) => {
					var n = r(), i = T(n), o = (e) => {
						let n = U(() => a.buildRecord(F(t).event));
						{
							let i = (e) => {
								let n = U(() => a.getReactionReadModel(F(t).event.id));
								var i = r(), o = T(i), s = (e) => {
									{
										let r = U(() => a.isReactionExpanded(F(t).event.id)), i = U(() => a.getReactionLabel(F(t).event.id));
										Nr(e, {
											get count() {
												return F(n).totalCount;
											},
											get expanded() {
												return F(r);
											},
											get ariaLabel() {
												return F(i);
											},
											onToggle: () => a.onToggleReaction(F(t).event.id)
										});
									}
								};
								W(o, (e) => {
									F(n) && F(n).totalCount > 0 && e(s);
								}), _(e, i);
							}, o = U(() => F(t).event.kind === 42 ? void 0 : a.onReplyPost), s = U(() => F(t).event.kind === 42 ? void 0 : a.onQuotePost);
							sr(e, {
								get onReactionPost() {
									return a.onReactionPost;
								},
								get post() {
									return F(n);
								},
								get onReplyPost() {
									return F(o);
								},
								get onQuotePost() {
									return F(s);
								},
								reactionExtras: i,
								$$slots: { reactionExtras: !0 }
							});
						}
					}, s = U(() => F(t).status === "resolved" && (F(t).event.kind !== 42 || a.onReactionPost || (a.getReactionReadModel(F(t).event.id)?.totalCount ?? 0) > 0));
					W(i, (e) => {
						F(s) && e(o);
					}), _(e, n);
				}, i = (e) => {
					var n = r(), i = T(n), o = (e) => {
						let n = U(() => a.getReactionReadModel(F(t).event.id));
						var i = r(), o = T(i), s = (e) => {
							dr(e, {
								get readModel() {
									return F(n);
								},
								get emojiLoadStateByUrl() {
									return a.emojiLoadStateByUrl;
								},
								get emojiImageMetaByUrl() {
									return a.emojiImageMetaByUrl;
								}
							});
						}, c = U(() => F(n) && F(n).totalCount > 0 && a.isReactionExpanded(F(t).event.id));
						W(o, (e) => {
							F(c) && e(s);
						}), _(e, i);
					};
					W(i, (e) => {
						F(t).status === "resolved" && e(o);
					}), _(e, n);
				}, c = (e) => {
					var n = r(), i = T(n), c = (e) => {
						let n = U(() => a.buildRecord(F(t).event)), r = U(() => a.buildMenuKey(a.parentEventId, F(n).eventId)), i = U(() => o()("common.showActions"));
						{
							let t = (e) => {
								{
									let t = U(() => a.getActionItems(F(n)));
									Br(e, S({
										order: "standard",
										showDeleteSeparator: !0
									}, () => F(t)));
								}
							}, o = U(() => a.isMenuOpen(F(r))), c = U(() => Ht(F(n).postedAt, s()));
							pr(e, {
								get open() {
									return F(o);
								},
								onOpenChange: (e) => a.onMenuOpenChange(F(r), e),
								get triggerAriaLabel() {
									return F(i);
								},
								get tooltipContent() {
									return F(i);
								},
								enableTooltip: !0,
								get timestamp() {
									return F(c);
								},
								items: t,
								$$slots: { items: !0 }
							});
						}
					};
					W(i, (e) => {
						F(t).status === "resolved" && e(c);
					}), _(e, n);
				}, l = U(() => F(t).status === "resolved" ? a.getSensitiveBodyLoader(F(t).event) : void 0), u = U(() => F(t).status === "resolved" ? a.getModel(F(t).event.id) : void 0);
				Wr(e, {
					get preview() {
						return F(t);
					},
					get loadSensitiveBody() {
						return F(l);
					},
					get model() {
						return F(u);
					},
					get emojiLoadStateByUrl() {
						return a.emojiLoadStateByUrl;
					},
					get emojiImageMetaByUrl() {
						return a.emojiImageMetaByUrl;
					},
					get scrollRoot() {
						return a.scrollRoot;
					},
					get onImageOpen() {
						return a.onImageOpen;
					},
					onRetry: () => a.onRetry(F(t).eventId),
					footerActions: n,
					footerDetails: i,
					footerMenu: c,
					$$slots: {
						footerActions: !0,
						footerDetails: !0,
						footerMenu: !0
					}
				});
			}
		}), c(t), _(e, t);
	};
	W(f, (e) => {
		a.previews.length > 0 && e(p);
	}), _(t, d), h(), u();
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostHistoryThreadToggleButton.svelte
var bl = o("<span class=\"post-history-thread-toggle-spinner post-history-thread-action-spinner svelte-cenxtw\" aria-hidden=\"true\"></span>"), xl = o("<span class=\"post-history-thread-toggle-icon-wrapper svelte-cenxtw\" aria-hidden=\"true\"><span></span></span>"), Sl = o("<!> <span class=\"post-history-thread-toggle-label\"> </span>", 1), Cl = {
	hash: "svelte-cenxtw",
	code: ".post-history-thread-node-top-actions {width:100%;height:28px;}\n            .post-history-context-actions .post-history-thread-toggle-button,\n            .post-history-thread-node-top-actions\n                .post-history-thread-toggle-button\n         {position:relative;width:auto;padding:0 8px;gap:4px;white-space:nowrap;height:28px;min-height:28px;background:inherit;}.post-history-thread-toggle-icon-wrapper.svelte-cenxtw {position:relative;display:inline-flex;align-items:center;justify-content:center;flex:0 0 22px;}.post-history-thread-toggle-icon.svelte-cenxtw {--icon-size: 24px;}.post-history-thread-toggle-icon-arrow-top-right.svelte-cenxtw {mask-image:var(--ehagaki-icon-6172726f775f746f705f72696768745f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.post-history-thread-toggle-icon-collapse.svelte-cenxtw {--icon-size: 28px;mask-image:var(--ehagaki-icon-636f6c6c617073655f636f6e74656e745f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.post-history-thread-toggle-spinner.svelte-cenxtw {width:22px;height:22px;border:2px solid currentColor;border-right-color:transparent;border-radius:50%;\n        animation: svelte-cenxtw-post-history-thread-toggle-spinner 0.8s linear infinite;}\n\n    @media (prefers-reduced-motion: reduce) {.post-history-thread-toggle-spinner.svelte-cenxtw {\n            animation: none;}\n    }\n\n    @keyframes svelte-cenxtw-post-history-thread-toggle-spinner {\n        to {\n            rotate: 360deg;\n        }\n    }"
};
function wl(t, r) {
	n(r, !0), e(t, Cl);
	let i = () => R(Pe, "$_", a), [a, o] = te(), s = L(r, "title", 19, () => r.ariaLabel), c = L(r, "loading", 3, !1), l = U(() => [c() ? "is-loading" : ""].filter(Boolean).join(" "));
	{
		let e = U(() => `post-history-thread-toggle-button ${F(l)}`.trim());
		Lt(t, {
			type: "button",
			get className() {
				return F(e);
			},
			get ariaLabel() {
				return r.ariaLabel;
			},
			get title() {
				return s();
			},
			contentLayout: "iconText",
			shape: "rounded",
			get selected() {
				return r.expanded;
			},
			get disabled() {
				return c();
			},
			get onClick() {
				return r.onClick;
			},
			children: (e, t) => {
				var n = Sl(), a = T(n), o = (e) => {
					var t = bl();
					_(e, t);
				}, s = (e) => {
					var t = xl(), n = D(t);
					z(() => m(n, 1, `post-history-thread-toggle-icon ${r.expanded ? "post-history-thread-toggle-icon-collapse" : "post-history-thread-toggle-icon-arrow-top-right"} svg-icon`, "svelte-cenxtw")), _(e, t);
				};
				W(a, (e) => {
					c() ? e(o) : e(s, -1);
				});
				var l = I(a, 2), u = D(l, !0);
				z((e) => g(u, e), [() => i()("postHistory.replyTargetLabel")]), _(e, n);
			},
			$$slots: { default: !0 }
		});
	}
	h(), o();
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostHistoryStatusPill.svelte
var Tl = o("<span> </span>"), El = {
	hash: "svelte-1uufmpv",
	code: ".post-history-status-pill.svelte-1uufmpv {display:inline-flex;align-items:center;justify-content:center;min-height:18px;padding:0 8px;border:1px solid color-mix(in srgb, currentColor 18%, transparent);border-radius:999px;background:color-mix(in srgb, currentColor 8%, transparent);font-size:0.72rem;line-height:1;white-space:nowrap;}.post-history-status-pill-muted.svelte-1uufmpv {color:var(--text-muted, currentColor);}.post-history-status-pill-danger.svelte-1uufmpv {color:var(--destructive-fg, currentColor);}"
};
function Dl(r, i) {
	n(i, !0), e(r, El);
	let a = L(i, "className", 3, "");
	var o = Tl(), s = D(o, !0);
	z((e) => {
		m(o, 1, e, "svelte-1uufmpv"), ae(o, "aria-label", i.label), ae(o, "title", i.label), g(s, i.label);
	}, [() => t(`post-history-status-pill post-history-status-pill-${i.tone} ${a()}`.trim())]), _(r, o), h();
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostHistoryDeletionLifecycleStatusBadge.svelte
function Ol(e, t) {
	n(t, !0);
	let i = () => R(Pe, "$_", a), [a, o] = te(), s = U(() => {
		if (t.eventId) return Jn[t.eventId];
	});
	function c(e) {
		return e === "pending" || e === "processing" ? i()("postHistory.deleteSending") : e === "failed" ? i()("postHistory.deleteFailed") : null;
	}
	let l = U(() => c(F(s)));
	var u = r(), d = T(u), f = (e) => {
		{
			let t = U(() => F(s) === "failed" ? "danger" : "muted"), n = U(() => `post-history-deletion-lifecycle-status ${F(s) ?? ""}`.trim());
			Dl(e, {
				get label() {
					return F(l);
				},
				get tone() {
					return F(t);
				},
				get className() {
					return F(n);
				}
			});
		}
	};
	W(d, (e) => {
		F(l) && e(f);
	}), _(e, u), h(), o();
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostHistoryThreadNode.svelte
function kl(e, t) {
	n(t, !0);
	let r = L(t, "model", 3, void 0), i = L(t, "loadSensitiveBody", 3, void 0), a = L(t, "emojiLoadStateByUrl", 19, () => ({})), o = L(t, "emojiImageMetaByUrl", 19, () => ({})), s = L(t, "scrollRoot", 3, null), c = L(t, "onImageOpen", 3, void 0), l = L(t, "topActions", 3, void 0), u = L(t, "footerLeftExtras", 3, void 0), d = L(t, "footerActions", 3, void 0), f = L(t, "footerDetails", 3, void 0), p = L(t, "footerMenu", 3, void 0);
	ir(e, {
		get event() {
			return t.node.event;
		},
		get profile() {
			return t.node.profile;
		},
		get model() {
			return r();
		},
		get loadSensitiveBody() {
			return i();
		},
		get emojiLoadStateByUrl() {
			return a();
		},
		get emojiImageMetaByUrl() {
			return o();
		},
		get scrollRoot() {
			return s();
		},
		get onImageOpen() {
			return c();
		},
		get topActions() {
			return l();
		},
		get footerLeftExtras() {
			return u();
		},
		get footerActions() {
			return d();
		},
		get footerDetails() {
			return f();
		},
		get footerMenu() {
			return p();
		}
	}), h();
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostHistoryThreadGraphNodeView.svelte
var Al = o("<span class=\"post-history-context-deleted-label svelte-1kez5et\"> </span>"), jl = o("<p class=\"post-history-context-message svelte-1kez5et\"> </p>"), Ml = o("<p class=\"post-history-context-message post-history-context-error svelte-1kez5et\"> </p> <!>", 1), Nl = o("<div class=\"post-history-thread-node-parent svelte-1kez5et\"><!></div>"), Pl = o("<div class=\"post-history-thread-node-top-actions\"><!></div>"), Fl = o("<div class=\"open-in-new-icon svg-icon\" aria-hidden=\"true\"></div> <span> </span>", 1), Il = o("<!> <!>", 1), Ll = o("<div class=\"find_in_page-icon svg-icon\" aria-hidden=\"true\"></div> <span> </span>", 1), Rl = o("<!> <!> <!>", 1), zl = o("<p role=\"status\"> </p>"), Bl = o("<div class=\"post-history-thread-node-children svelte-1kez5et\"></div>"), Vl = o("<div class=\"post-history-thread-node-view svelte-1kez5et\"><!> <div class=\"post-history-thread-node-anchor svelte-1kez5et\"><!></div> <!> <!></div>"), Hl = {
	hash: "svelte-1kez5et",
	code: ".post-history-thread-node-view.svelte-1kez5et {display:grid;gap:1px;}.post-history-thread-node-parent.svelte-1kez5et,\n    .post-history-thread-node-children.svelte-1kez5et {display:grid;gap:2px;}.post-history-thread-node-parent.svelte-1kez5et {padding-inline-start:0;}.post-history-thread-node-anchor.svelte-1kez5et {display:grid;min-width:0;}.post-history-thread-node-children.svelte-1kez5et {padding-inline-start:0;}.post-history-context-button {min-height:28px;padding:2px 6px;color:var(--text-muted);background:var(--btn-bg);font-size:0.82rem;}.post-history-context-message.svelte-1kez5et {margin:0;color:var(--text-muted);font-size:0.82rem;}.post-history-context-deleted-label.svelte-1kez5et {width:fit-content;min-height:28px;padding:2px 6px;color:var(--text-muted);background-color:transparent;border:1px solid var(--btn-border);font-size:0.82rem;font-weight:normal;cursor:default;user-select:none;display:flex;align-items:center;}.post-history-context-error.svelte-1kez5et {color:var(--danger);}"
};
function Ul(t, a) {
	n(a, !0), e(t, Hl);
	let o = () => R(Pe, "$_", s), [s, u] = te(), d = L(a, "previewModelByEventId", 19, () => ({})), f = L(a, "getSensitiveBodyLoader", 3, void 0), p = L(a, "emojiLoadStateByUrl", 19, () => ({})), m = L(a, "emojiImageMetaByUrl", 19, () => ({})), v = L(a, "scrollRoot", 3, null), b = L(a, "onImageOpen", 3, void 0), x = L(a, "buildPostRecordForNode", 3, void 0), S = L(a, "onReplyPost", 3, void 0), C = L(a, "onQuotePost", 3, void 0), w = L(a, "onReactionPost", 3, void 0), E = L(a, "getReactionReadModel", 3, void 0), O = L(a, "isReactionExpanded", 3, void 0), k = L(a, "getReactionLabel", 3, void 0), A = L(a, "onToggleReaction", 3, void 0), j = L(a, "onToggleParent", 3, void 0), N = L(a, "onRetryParent", 3, void 0), P = L(a, "onRefreshRelatedEvents", 3, void 0), ee = L(a, "onToggleChildren", 3, void 0), ne = L(a, "onRetryChildren", 3, void 0), re = L(a, "onCopyPointerDown", 3, void 0), V = L(a, "onCopyNevent", 3, void 0), H = L(a, "externalClientLabel", 3, void 0), ie = L(a, "onOpenExternalClient", 3, void 0), oe = L(a, "isCopyFailed", 3, void 0), se = L(a, "onShowRawJson", 3, void 0), ce = L(a, "onBroadcastPointerDown", 3, void 0), G = L(a, "onBroadcastPost", 3, void 0), le = L(a, "isBroadcastSending", 3, void 0), ue = L(a, "canDeleteNodePost", 3, void 0), K = L(a, "isDeletionSending", 3, void 0), de = L(a, "onOpenDeleteConfirm", 3, void 0), q = U(() => Ht(a.state.node.event.created_at * 1e3)), fe = U(() => a.state.repliesActionState.status === "loaded" && a.state.repliesActionState.replyCount > 0), pe = U(() => oe()?.(a.state.node.eventId) ?? !1), me = U(() => le()?.(a.state.node.eventId) ?? !1), he = U(() => ue()?.(a.state) ?? !1), ge = U(() => K()?.(a.state.node.eventId) ?? !1);
	function _e() {
		let e = a.state.repliesActionState;
		if (e.status === "loading") return o()("postHistory.checkingReplies");
		if (e.status === "failed") return o()("postHistory.recheckReplies");
		if (e.status === "loaded") {
			let t = e.replyCount;
			return t === 0 ? o()("postHistory.recheckReplies") : e.visible ? o()("postHistory.hideReplies") : o()("postHistory.showRepliesWithCount", { values: { count: t } });
		}
		return o()("postHistory.checkReplies");
	}
	function ve() {
		let e = a.state.repliesActionState;
		e.status === "failed" || e.status === "loaded" && e.replyCount === 0 ? ne()?.(a.state.node.eventId) : ee()?.(a.state.node.eventId);
	}
	function ye(e) {
		re()?.(a.state, e);
	}
	function be(e) {
		V()?.(a.state, e);
	}
	function J() {
		se()?.(a.state);
	}
	function xe(e) {
		ce()?.(a.state, e);
	}
	function Y(e) {
		G()?.(a.state, e);
	}
	function Se() {
		de()?.(a.state);
	}
	var Ce = Vl(), we = B(Ce), Te = (e) => {
		var t = Nl(), n = B(t), r = (e) => {
			Ul(e, {
				get state() {
					return a.state.parentNodeState;
				},
				get previewModelByEventId() {
					return d();
				},
				get getSensitiveBodyLoader() {
					return f();
				},
				get emojiLoadStateByUrl() {
					return p();
				},
				get emojiImageMetaByUrl() {
					return m();
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
					return S();
				},
				get onQuotePost() {
					return C();
				},
				get onReactionPost() {
					return w();
				},
				get getReactionReadModel() {
					return E();
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
					return j();
				},
				get onRetryParent() {
					return N();
				},
				get onRefreshRelatedEvents() {
					return P();
				},
				get onToggleChildren() {
					return ee();
				},
				get onRetryChildren() {
					return ne();
				},
				get onCopyPointerDown() {
					return re();
				},
				get onCopyNevent() {
					return V();
				},
				get externalClientLabel() {
					return H();
				},
				get onOpenExternalClient() {
					return ie();
				},
				get isCopyFailed() {
					return oe();
				},
				get onShowRawJson() {
					return se();
				},
				get onBroadcastPointerDown() {
					return ce();
				},
				get onBroadcastPost() {
					return G();
				},
				get isBroadcastSending() {
					return le();
				},
				get canDeleteNodePost() {
					return ue();
				},
				get isDeletionSending() {
					return K();
				},
				get onOpenDeleteConfirm() {
					return de();
				}
			});
		}, i = (e) => {
			var t = Al(), n = D(t, !0);
			z((e) => g(n, e), [() => o()("postHistory.replyTargetDeleted")]), _(e, t);
		}, s = (e) => {
			var t = jl(), n = D(t, !0);
			z((e) => g(n, e), [() => o()("postHistory.contextNotFound")]), _(e, t);
		}, l = (e) => {
			var t = Ml(), n = T(t), r = D(n, !0), i = I(n, 2);
			Lt(i, {
				type: "button",
				className: "post-history-context-button post-history-context-retry-button",
				onClick: () => N()?.(a.state.node.eventId),
				children: (e, t) => {
					M();
					var n = y();
					z((e) => g(n, e), [() => o()("postHistory.contextRetry")]), _(e, n);
				},
				$$slots: { default: !0 }
			}), z((e) => g(r, e), [() => o()("postHistory.contextFetchFailed")]), _(e, t);
		};
		W(n, (e) => {
			a.state.parentExpansion.visibleParent && a.state.parentNodeState ? e(r) : a.state.parentExpansion.visibleParent && a.state.parentExpansion.parentDeleted ? e(i, 1) : a.state.parentExpansion.visibleParent && a.state.parentExpansion.parentMissing ? e(s, 2) : a.state.parentExpansion.visibleParent && a.state.parentExpansion.parentError && e(l, 3);
		}), c(t), _(e, t);
	};
	W(we, (e) => {
		a.state.parentTargetId && e(Te);
	});
	var Ee = I(we, 2), De = B(Ee);
	{
		let e = (e) => {
			var t = r(), n = T(t), i = (e) => {
				var t = Pl(), n = B(t);
				{
					let e = U(() => a.state.parentExpansion.visibleParent ? o()("postHistory.hideReplyTarget") : o()("postHistory.showReplyTarget")), t = U(() => a.state.parentExpansion.visibleParent ? o()("postHistory.hideReplyTarget") : o()("postHistory.showReplyTarget")), r = U(() => a.state.parentExpansion.visibleParent && a.state.parentExpansion.showParentLoadingIndicator);
					wl(n, {
						get ariaLabel() {
							return F(e);
						},
						get title() {
							return F(t);
						},
						get expanded() {
							return a.state.parentExpansion.visibleParent;
						},
						get loading() {
							return F(r);
						},
						onClick: () => j()?.(a.state.node.eventId)
					});
				}
				c(t), _(e, t);
			};
			W(n, (e) => {
				a.state.parentTargetId && !a.state.parentAlreadyInPath && !(a.state.parentExpansion.visibleParent && a.state.parentExpansion.parentDeleted) && e(i);
			}), _(e, t);
		}, t = (e) => {
			Ol(e, { get eventId() {
				return a.state.node.eventId;
			} });
		}, n = (e) => {
			var t = r(), n = T(t), i = (e) => {
				{
					let t = (e) => {
						var t = r(), n = T(t), i = (e) => {
							{
								let t = U(_e), n = U(_e);
								Fr(e, {
									get count() {
										return a.state.repliesActionState.replyCount;
									},
									get selected() {
										return a.state.repliesActionState.visible;
									},
									get ariaLabel() {
										return F(t);
									},
									get tooltipContent() {
										return F(n);
									},
									onClick: ve
								});
							}
						};
						W(n, (e) => {
							F(fe) && e(i);
						}), _(e, t);
					}, n = (e) => {
						let t = U(() => E()?.(a.state.node.eventId));
						var n = r(), i = T(n), o = (e) => {
							{
								let n = U(() => O()?.(a.state.node.eventId) ?? !1), r = U(() => k()?.(a.state.node.eventId) ?? "");
								Nr(e, {
									get count() {
										return F(t).totalCount;
									},
									get expanded() {
										return F(n);
									},
									get ariaLabel() {
										return F(r);
									},
									onToggle: () => A()?.(a.state.node.eventId)
								});
							}
						};
						W(i, (e) => {
							F(t) && F(t).totalCount > 0 && e(o);
						}), _(e, n);
					}, i = U(() => x()(a.state)), o = U(() => a.state.node.event.kind === 42 ? void 0 : S()), s = U(() => a.state.node.event.kind === 42 ? void 0 : C());
					sr(e, {
						get onReactionPost() {
							return w();
						},
						get post() {
							return F(i);
						},
						get onReplyPost() {
							return F(o);
						},
						get onQuotePost() {
							return F(s);
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
			W(n, (e) => {
				x() && e(i);
			}), _(e, t);
		}, i = (e) => {
			let t = U(() => E()?.(a.state.node.eventId));
			var n = r(), i = T(n), o = (e) => {
				dr(e, {
					get readModel() {
						return F(t);
					},
					get emojiLoadStateByUrl() {
						return p();
					},
					get emojiImageMetaByUrl() {
						return m();
					}
				});
			}, s = U(() => F(t) && F(t).totalCount > 0 && (O()?.(a.state.node.eventId) ?? !1));
			W(i, (e) => {
				F(s) && e(o);
			}), _(e, n);
		}, s = (e) => {
			let t = U(() => o()("common.showActions"));
			pr(e, {
				get triggerAriaLabel() {
					return F(t);
				},
				get tooltipContent() {
					return F(t);
				},
				enableTooltip: !0,
				get timestamp() {
					return F(q);
				},
				items: (e) => {
					var t = Rl(), n = T(t), r = (e) => {
						var t = Il(), n = T(t);
						l(n, () => bn, (e, t) => {
							t(e, {
								class: "menu-action-button",
								onSelect: () => ie()?.(a.state),
								children: (e, t) => {
									var n = Fl(), r = I(T(n), 2), i = D(r, !0);
									z(() => g(i, H())), _(e, n);
								},
								$$slots: { default: !0 }
							});
						});
						var r = I(n, 2);
						l(r, () => xn, (e, t) => {
							t(e, { class: "post-history-menu-separator" });
						}), _(e, t);
					};
					W(n, (e) => {
						H() && ie() && e(r);
					});
					var i = I(n, 2);
					{
						let e = U(() => a.state.relatedEventsStatus === "loading");
						l(i, () => bn, (t, n) => {
							n(t, {
								class: "menu-action-button",
								get disabled() {
									return F(e);
								},
								onSelect: () => P()?.(a.state.node.eventId),
								children: (e, t) => {
									var n = Ll(), r = I(T(n), 2), i = D(r, !0);
									z((e) => g(i, e), [() => o()("postHistory.checkRelatedEvents")]), _(e, n);
								},
								$$slots: { default: !0 }
							});
						});
					}
					var s = I(i, 2);
					Br(s, {
						order: "raw-json-first",
						get copyFailed() {
							return F(pe);
						},
						showBroadcast: !0,
						get broadcastSending() {
							return F(me);
						},
						get showDelete() {
							return F(he);
						},
						showDeleteSeparator: !0,
						get deletionSending() {
							return F(ge);
						},
						onCopyPointerDown: ye,
						onCopyNevent: be,
						onShowRawJson: J,
						onBroadcastPointerDown: xe,
						onBroadcastPost: Y,
						onOpenDeleteConfirm: Se
					}), _(e, t);
				},
				$$slots: { items: !0 }
			});
		}, u = U(() => f()?.(a.state.node.event));
		kl(De, {
			get node() {
				return a.state.node;
			},
			get model() {
				return d()[a.state.node.eventId];
			},
			get loadSensitiveBody() {
				return F(u);
			},
			get emojiLoadStateByUrl() {
				return p();
			},
			get emojiImageMetaByUrl() {
				return m();
			},
			get scrollRoot() {
				return v();
			},
			get onImageOpen() {
				return b();
			},
			topActions: e,
			footerLeftExtras: t,
			footerActions: n,
			footerDetails: i,
			footerMenu: s,
			$$slots: {
				topActions: !0,
				footerLeftExtras: !0,
				footerActions: !0,
				footerDetails: !0,
				footerMenu: !0
			}
		});
	}
	c(Ee);
	var Oe = I(Ee, 2), ke = (e) => {
		var t = zl(), n = D(t, !0);
		z((e) => g(n, e), [() => o()("postHistory.relatedEventsFailed")]), _(e, t);
	};
	W(Oe, (e) => {
		a.state.relatedEventsStatus === "failed" && e(ke);
	});
	var Ae = I(Oe, 2), X = (e) => {
		var t = Bl();
		i(t, 21, () => a.state.replyNodeStates, (e) => e.node.eventId, (e, t) => {
			Ul(e, {
				get state() {
					return F(t);
				},
				get previewModelByEventId() {
					return d();
				},
				get getSensitiveBodyLoader() {
					return f();
				},
				get emojiLoadStateByUrl() {
					return p();
				},
				get emojiImageMetaByUrl() {
					return m();
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
					return S();
				},
				get onQuotePost() {
					return C();
				},
				get onReactionPost() {
					return w();
				},
				get getReactionReadModel() {
					return E();
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
					return j();
				},
				get onRetryParent() {
					return N();
				},
				get onRefreshRelatedEvents() {
					return P();
				},
				get onToggleChildren() {
					return ee();
				},
				get onRetryChildren() {
					return ne();
				},
				get onCopyPointerDown() {
					return re();
				},
				get onCopyNevent() {
					return V();
				},
				get externalClientLabel() {
					return H();
				},
				get onOpenExternalClient() {
					return ie();
				},
				get isCopyFailed() {
					return oe();
				},
				get onShowRawJson() {
					return se();
				},
				get onBroadcastPointerDown() {
					return ce();
				},
				get onBroadcastPost() {
					return G();
				},
				get isBroadcastSending() {
					return le();
				},
				get canDeleteNodePost() {
					return ue();
				},
				get isDeletionSending() {
					return K();
				},
				get onOpenDeleteConfirm() {
					return de();
				}
			});
		}), c(t), _(e, t);
	};
	W(Ae, (e) => {
		a.state.repliesActionState.visible && a.state.replyNodeStates.length > 0 && e(X);
	}), c(Ce), z(() => {
		ae(Ee, "data-post-history-thread-anchor-scope-id", a.state.anchorEventId), ae(Ee, "data-post-history-thread-anchor-event-id", a.state.node.eventId);
	}), _(t, Ce), h(), u();
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostHistoryThreadGraphPanel.svelte
var Wl = o("<span class=\"post-history-context-deleted-label post-history-thread-direct-parent-context svelte-nb00ha\"> </span>"), Gl = o("<p class=\"post-history-context-message post-history-thread-direct-parent-context svelte-nb00ha\"> </p>"), Kl = o("<p class=\"post-history-context-message post-history-context-error post-history-thread-direct-parent-context svelte-nb00ha\"> </p> <!>", 1), ql = o("<div class=\"post-history-thread-parent-panel svelte-nb00ha\"><!> <div class=\"post-history-context-actions svelte-nb00ha\"><!></div></div>"), Jl = o("<div class=\"post-history-thread-replies-panel svelte-nb00ha\"><div class=\"post-history-thread-replies-list svelte-nb00ha\"></div></div>"), Yl = {
	hash: "svelte-nb00ha",
	code: ".post-history-thread-parent-panel.svelte-nb00ha,\n    .post-history-thread-replies-panel.svelte-nb00ha {display:grid;gap:6px;}.post-history-thread-parent-panel.svelte-nb00ha {padding-bottom:4px;}.post-history-thread-replies-list.svelte-nb00ha {display:grid;}.post-history-context-actions.svelte-nb00ha {display:flex;flex-wrap:wrap;gap:6px;}.post-history-thread-direct-parent-context {margin-inline-start:var(--thread-direct-parent-indent);}.post-history-context-button {min-height:28px;padding:2px 6px;color:var(--text-muted);background:transparent;font-size:0.82rem;}\n\n    @media (hover: hover) and (pointer: fine) {.post-history-context-button:hover:not(:disabled) {color:var(--theme);background:color-mix(in srgb, var(--theme) 10%, transparent);}\n    }.post-history-context-message.svelte-nb00ha {margin:0;color:var(--text-muted);font-size:0.82rem;}.post-history-context-deleted-label.svelte-nb00ha {width:fit-content;min-height:28px;padding:2px 6px;color:var(--text-muted);background-color:transparent;border:1px solid var(--btn-border);font-size:0.82rem;font-weight:normal;cursor:default;user-select:none;display:flex;align-items:center;}.post-history-context-error.svelte-nb00ha {color:var(--danger);}"
};
function Xl(t, a) {
	n(a, !0), e(t, Yl);
	let o = () => R(Pe, "$_", s), [s, l] = te(), u = L(a, "previewModelByEventId", 19, () => ({})), d = L(a, "getSensitiveBodyLoader", 3, void 0), f = L(a, "emojiLoadStateByUrl", 19, () => ({})), p = L(a, "emojiImageMetaByUrl", 19, () => ({})), m = L(a, "scrollRoot", 3, null), v = L(a, "onImageOpen", 3, void 0), b = L(a, "buildPostRecordForNode", 3, void 0), x = L(a, "onReplyPost", 3, void 0), S = L(a, "onQuotePost", 3, void 0), C = L(a, "onReactionPost", 3, void 0), w = L(a, "getReactionReadModel", 3, void 0), E = L(a, "isReactionExpanded", 3, void 0), O = L(a, "getReactionLabel", 3, void 0), k = L(a, "onToggleReaction", 3, void 0), A = L(a, "onToggleParent", 3, void 0), j = L(a, "onRetryParent", 3, void 0), N = L(a, "onToggleNodeParent", 3, void 0), P = L(a, "onRetryNodeParent", 3, void 0), ee = L(a, "onRefreshRelatedEvents", 3, void 0), ne = L(a, "onToggleNodeChildren", 3, void 0), re = L(a, "onRetryNodeChildren", 3, void 0), V = L(a, "onCopyPointerDown", 3, void 0), H = L(a, "onCopyNevent", 3, void 0), ae = L(a, "externalClientLabel", 3, void 0), oe = L(a, "onOpenExternalClient", 3, void 0), se = L(a, "isCopyFailed", 3, void 0), ce = L(a, "onShowRawJson", 3, void 0), G = L(a, "onBroadcastPointerDown", 3, void 0), le = L(a, "onBroadcastPost", 3, void 0), ue = L(a, "isBroadcastSending", 3, void 0), K = L(a, "canDeleteNodePost", 3, void 0), de = L(a, "isDeletionSending", 3, void 0), q = L(a, "onOpenDeleteConfirm", 3, void 0), fe = `${Tr(-1)}rem`, pe = U(() => a.state.parentNode ? {
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
	var me = r(), he = T(me), ge = (e) => {
		var t = ql(), n = B(t), r = (e) => {
			Ul(e, {
				get state() {
					return a.state.parentNodeState;
				},
				get previewModelByEventId() {
					return u();
				},
				get getSensitiveBodyLoader() {
					return d();
				},
				get emojiLoadStateByUrl() {
					return f();
				},
				get emojiImageMetaByUrl() {
					return p();
				},
				get scrollRoot() {
					return m();
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
					return S();
				},
				get onReactionPost() {
					return C();
				},
				get getReactionReadModel() {
					return w();
				},
				get isReactionExpanded() {
					return E();
				},
				get getReactionLabel() {
					return O();
				},
				get onToggleReaction() {
					return k();
				},
				get onToggleParent() {
					return N();
				},
				get onRetryParent() {
					return P();
				},
				get onRefreshRelatedEvents() {
					return ee();
				},
				get onToggleChildren() {
					return ne();
				},
				get onRetryChildren() {
					return re();
				},
				get onCopyPointerDown() {
					return V();
				},
				get onCopyNevent() {
					return H();
				},
				get externalClientLabel() {
					return ae();
				},
				get onOpenExternalClient() {
					return oe();
				},
				get isCopyFailed() {
					return se();
				},
				get onShowRawJson() {
					return ce();
				},
				get onBroadcastPointerDown() {
					return G();
				},
				get onBroadcastPost() {
					return le();
				},
				get isBroadcastSending() {
					return ue();
				},
				get canDeleteNodePost() {
					return K();
				},
				get isDeletionSending() {
					return de();
				},
				get onOpenDeleteConfirm() {
					return q();
				}
			});
		}, i = (e) => {
			Ul(e, {
				get state() {
					return F(pe);
				},
				get previewModelByEventId() {
					return u();
				},
				get getSensitiveBodyLoader() {
					return d();
				},
				get emojiLoadStateByUrl() {
					return f();
				},
				get emojiImageMetaByUrl() {
					return p();
				},
				get scrollRoot() {
					return m();
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
					return S();
				},
				get onReactionPost() {
					return C();
				},
				get getReactionReadModel() {
					return w();
				},
				get isReactionExpanded() {
					return E();
				},
				get getReactionLabel() {
					return O();
				},
				get onToggleReaction() {
					return k();
				},
				get onToggleParent() {
					return N();
				},
				get onRetryParent() {
					return P();
				},
				get onRefreshRelatedEvents() {
					return ee();
				},
				get onToggleChildren() {
					return ne();
				},
				get onRetryChildren() {
					return re();
				},
				get onCopyPointerDown() {
					return V();
				},
				get onCopyNevent() {
					return H();
				},
				get externalClientLabel() {
					return ae();
				},
				get onOpenExternalClient() {
					return oe();
				},
				get isCopyFailed() {
					return se();
				},
				get onShowRawJson() {
					return ce();
				},
				get onBroadcastPointerDown() {
					return G();
				},
				get onBroadcastPost() {
					return le();
				},
				get isBroadcastSending() {
					return ue();
				},
				get canDeleteNodePost() {
					return K();
				},
				get isDeletionSending() {
					return de();
				},
				get onOpenDeleteConfirm() {
					return q();
				}
			});
		}, s = (e) => {
			var t = Wl(), n = D(t, !0);
			z((e) => g(n, e), [() => o()("postHistory.replyTargetDeleted")]), _(e, t);
		}, l = (e) => {
			var t = Gl(), n = D(t, !0);
			z((e) => g(n, e), [() => o()("postHistory.contextNotFound")]), _(e, t);
		}, h = (e) => {
			var t = Kl(), n = T(t), r = D(n, !0), i = I(n, 2);
			Lt(i, {
				type: "button",
				className: "post-history-context-button post-history-context-retry-button",
				onClick: () => j()?.(),
				children: (e, t) => {
					M();
					var n = y();
					z((e) => g(n, e), [() => o()("postHistory.contextRetry")]), _(e, n);
				},
				$$slots: { default: !0 }
			}), z((e) => g(r, e), [() => o()("postHistory.contextFetchFailed")]), _(e, t);
		};
		W(n, (e) => {
			a.state.parentExpansion.visibleParent && a.state.parentNodeState ? e(r) : a.state.parentExpansion.visibleParent && F(pe) ? e(i, 1) : a.state.parentExpansion.visibleParent && a.state.parentExpansion.parentDeleted ? e(s, 2) : a.state.parentExpansion.visibleParent && a.state.parentExpansion.parentMissing ? e(l, 3) : a.state.parentExpansion.visibleParent && a.state.parentExpansion.parentError && e(h, 4);
		});
		var te = I(n, 2), L = B(te), R = (e) => {
			{
				let t = U(() => a.state.parentExpansion.visibleParent ? o()("postHistory.hideReplyTarget") : o()("postHistory.showReplyTarget")), n = U(() => a.state.parentExpansion.visibleParent ? o()("postHistory.hideReplyTarget") : o()("postHistory.showReplyTarget")), r = U(() => a.state.parentExpansion.visibleParent && a.state.parentExpansion.showParentLoadingIndicator);
				wl(e, {
					get ariaLabel() {
						return F(t);
					},
					get title() {
						return F(n);
					},
					get expanded() {
						return a.state.parentExpansion.visibleParent;
					},
					get loading() {
						return F(r);
					},
					onClick: () => A()?.()
				});
			}
		};
		W(L, (e) => {
			a.state.parentExpansion.visibleParent && a.state.parentExpansion.parentDeleted || e(R);
		}), c(te), c(t), z(() => ie(t, `--thread-direct-parent-indent: ${fe}`)), _(e, t);
	}, _e = (e) => {
		var t = Jl(), n = B(t);
		i(n, 21, () => a.state.replyNodeStates, (e) => e.node.eventId, (e, t) => {
			Ul(e, {
				get state() {
					return F(t);
				},
				get previewModelByEventId() {
					return u();
				},
				get getSensitiveBodyLoader() {
					return d();
				},
				get emojiLoadStateByUrl() {
					return f();
				},
				get emojiImageMetaByUrl() {
					return p();
				},
				get scrollRoot() {
					return m();
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
					return S();
				},
				get onReactionPost() {
					return C();
				},
				get getReactionReadModel() {
					return w();
				},
				get isReactionExpanded() {
					return E();
				},
				get getReactionLabel() {
					return O();
				},
				get onToggleReaction() {
					return k();
				},
				get onToggleParent() {
					return N();
				},
				get onRetryParent() {
					return P();
				},
				get onRefreshRelatedEvents() {
					return ee();
				},
				get onToggleChildren() {
					return ne();
				},
				get onRetryChildren() {
					return re();
				},
				get onCopyPointerDown() {
					return V();
				},
				get onCopyNevent() {
					return H();
				},
				get externalClientLabel() {
					return ae();
				},
				get onOpenExternalClient() {
					return oe();
				},
				get isCopyFailed() {
					return se();
				},
				get onShowRawJson() {
					return ce();
				},
				get onBroadcastPointerDown() {
					return G();
				},
				get onBroadcastPost() {
					return le();
				},
				get isBroadcastSending() {
					return ue();
				},
				get canDeleteNodePost() {
					return K();
				},
				get isDeletionSending() {
					return de();
				},
				get onOpenDeleteConfirm() {
					return q();
				}
			});
		}), c(n), c(t), _(e, t);
	};
	W(he, (e) => {
		a.section === "parent" && a.state.parentTargetId ? e(ge) : a.section === "children" && a.state.repliesActionState.visible && a.state.replyNodeStates.length > 0 && e(_e, 1);
	}), _(t, me), h(), l();
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostHistoryRecordFooter.svelte
var Zl = o("<div class=\"open-in-new-icon svg-icon\" aria-hidden=\"true\"></div> <span> </span>", 1), Ql = o("<div class=\"find_in_page-icon svg-icon\" aria-hidden=\"true\"></div> <span> </span>", 1), $l = o("<div class=\"calendar-icon svg-icon\" aria-hidden=\"true\"></div> <span> </span>", 1), eu = o("<!> <!> <!> <!> <!>", 1), tu = o("<p role=\"status\"> </p>"), nu = o("<!> <!> <!>", 1);
function ru(e, t) {
	n(t, !0);
	let i = () => R(Pe, "$_", o), a = () => R(Ae, "$locale", o), [o, s] = te();
	var c = nu(), u = T(c);
	{
		let e = (e) => {
			sr(e, {
				get onReactionPost() {
					return t.onReactionPost;
				},
				get post() {
					return t.post;
				},
				get onReplyPost() {
					return t.onReplyPost;
				},
				get onQuotePost() {
					return t.onQuotePost;
				},
				replyExtras: (e) => {
					var n = r(), i = T(n), a = (e) => {
						Fr(e, {
							get count() {
								return t.graphState.repliesActionState.replyCount;
							},
							get selected() {
								return t.graphState.repliesActionState.visible;
							},
							get ariaLabel() {
								return t.repliesActionLabel;
							},
							get tooltipContent() {
								return t.repliesActionLabel;
							},
							get onClick() {
								return t.onRepliesAction;
							}
						});
					};
					W(i, (e) => {
						t.graphState.repliesActionState.status === "loaded" && t.graphState.repliesActionState.replyCount > 0 && e(a);
					}), _(e, n);
				},
				reactionExtras: (e) => {
					var n = r(), i = T(n), a = (e) => {
						Nr(e, {
							get count() {
								return t.graphState.reactionSummary.totalCount;
							},
							get expanded() {
								return t.reactionsExpanded;
							},
							get ariaLabel() {
								return t.reactionsActionLabel;
							},
							get onToggle() {
								return t.onToggleReactions;
							}
						});
					};
					W(i, (e) => {
						t.graphState.reactionSummary.totalCount > 0 && e(a);
					}), _(e, n);
				},
				$$slots: {
					replyExtras: !0,
					reactionExtras: !0
				}
			});
		}, n = (e) => {
			let n = U(() => i()("common.showActions"));
			var o = r(), s = T(o), c = (e) => {
				{
					let o = (e) => {
						var n = eu(), a = T(n);
						l(a, () => bn, (e, n) => {
							n(e, {
								class: "menu-action-button",
								get onSelect() {
									return t.onOpenExternalClient;
								},
								children: (e, n) => {
									var r = Zl(), i = I(T(r), 2), a = D(i, !0);
									z(() => g(a, t.externalClientLabel)), _(e, r);
								},
								$$slots: { default: !0 }
							});
						});
						var o = I(a, 2);
						l(o, () => xn, (e, t) => {
							t(e, { class: "post-history-menu-separator" });
						});
						var s = I(o, 2);
						{
							let e = U(() => t.graphState.relatedEventsStatus === "loading");
							l(s, () => bn, (n, r) => {
								r(n, {
									class: "menu-action-button",
									get disabled() {
										return F(e);
									},
									get onSelect() {
										return t.onRefreshRelatedEvents;
									},
									children: (e, t) => {
										var n = Ql(), r = I(T(n), 2), a = D(r, !0);
										z((e) => g(a, e), [() => i()("postHistory.checkRelatedEvents")]), _(e, n);
									},
									$$slots: { default: !0 }
								});
							});
						}
						var c = I(s, 2), u = (e) => {
							var n = r(), a = T(n);
							l(a, () => bn, (e, n) => {
								n(e, {
									class: "menu-action-button",
									get onSelect() {
										return t.onShowSurroundingPosts;
									},
									children: (e, t) => {
										var n = $l(), r = I(T(n), 2), a = D(r, !0);
										z((e) => g(a, e), [() => i()("postHistory.showSurroundingPosts")]), _(e, n);
									},
									$$slots: { default: !0 }
								});
							}), _(e, n);
						};
						W(c, (e) => {
							t.isSearchMode && e(u);
						});
						var d = I(c, 2);
						{
							let e = U(() => !!(t.onReplyPost || t.onQuotePost)), n = U(() => t.getActionItems());
							Br(d, S({
								order: "standard",
								get showDeleteSeparator() {
									return F(e);
								}
							}, () => F(n)));
						}
						_(e, n);
					}, s = U(() => Ht(t.post.postedAt, a()));
					pr(e, {
						lazy: !0,
						get open() {
							return t.menuOpen;
						},
						get onOpenChange() {
							return t.onMenuOpenChange;
						},
						get triggerAriaLabel() {
							return F(n);
						},
						get tooltipContent() {
							return F(n);
						},
						enableTooltip: !0,
						get timestamp() {
							return F(s);
						},
						items: o,
						$$slots: { items: !0 }
					});
				}
			};
			W(s, (e) => {
				(t.onReplyPost || t.onQuotePost) && e(c);
			}), _(e, o);
		}, o = U(() => t.onReplyPost || t.onQuotePost ? Qt(t.post.postedAt) : ""), s = U(() => !!t.post.deletedAt);
		ar(u, {
			get formattedDate() {
				return F(o);
			},
			get dimmed() {
				return F(s);
			},
			actions: e,
			trailing: n,
			$$slots: {
				actions: !0,
				trailing: !0
			}
		});
	}
	var d = I(u, 2), f = (e) => {
		var t = tu(), n = D(t, !0);
		z((e) => g(n, e), [() => i()("postHistory.relatedEventsFailed")]), _(e, t);
	};
	W(d, (e) => {
		t.graphState.relatedEventsStatus === "failed" && e(f);
	});
	var p = I(d, 2), m = (e) => {
		dr(e, {
			get readModel() {
				return t.graphState.reactionReadModel;
			},
			get emojiLoadStateByUrl() {
				return t.emojiLoadStateByUrl;
			},
			get emojiImageMetaByUrl() {
				return t.emojiImageMetaByUrl;
			}
		});
	};
	W(p, (e) => {
		t.graphState.reactionSummary.totalCount > 0 && t.reactionsExpanded && e(m);
	}), _(e, c), h(), s();
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryOperationWakeLock.ts
function iu() {
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
var au = iu();
// D:/ドキュメント/GitHub/ehagaki/src/lib/storage/postHistoryImportedRangesRepository.ts
function ou(e, t, n) {
	return e?.schemaVersion === 1 && e.source === "citrine-backup" && e.ownerPubkeyHex === t && e.kindsKey === n && Array.isArray(e.ranges) ? dt(e.ranges) : [];
}
var su = "postHistoryImportedRanges:", cu = new class {
	db;
	now;
	constructor(e = We, t = Date.now) {
		this.db = e, this.now = t;
	}
	async get(e, t) {
		return this.db.transaction("r", this.db.postHistoryCitrineRanges, this.db.postHistoryWriteGeneration, async () => {
			let n = await pt(this.db, e), r = (await this.db.postHistoryCitrineRanges.get(`${su}${e}:${t}`))?.value, i = ou(r, e, t);
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
			await yt(this.db, e);
			let t = await this.get(e.ownerPubkeyHex, e.kindsKey), n = dt([...t.ranges, e.range]);
			if (JSON.stringify(n) === JSON.stringify(t.ranges)) return !1;
			let r = await pt(this.db, e.ownerPubkeyHex);
			return await this.db.postHistoryCitrineRanges.put({
				id: `${su}${e.ownerPubkeyHex}:${e.kindsKey}`,
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
			}), await yt(this.db, e), !0;
		});
	}
}(), lu = 250;
function uu() {
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
function du(e) {
	return { ...e };
}
function fu(e) {
	return e.tags.filter((e) => e[0] === "e" && ue(e[1])).length;
}
var pu = new class {
	verificationSessionFactory;
	getLocalRevision;
	importedRangesRepository;
	postHistoryRepository;
	deletionRequestsRepository;
	sensitivePayloadRepository;
	constructor(e = {}) {
		this.verificationSessionFactory = e.verificationSessionFactory ?? gt, this.getLocalRevision = e.getLocalRevision ?? ((e) => pt(We, e)), this.importedRangesRepository = e.importedRangesRepository ?? cu, this.postHistoryRepository = e.postHistoryRepository ?? Q, this.deletionRequestsRepository = e.deletionRequestsRepository ?? Xt, this.sensitivePayloadRepository = e.sensitivePayloadRepository ?? Ct;
	}
	async importFile(e) {
		let t = uu(), n = /* @__PURE__ */ new Set(), r = [], i = !1, a = !1, o = !1, s = null, c = null, l = !0, u = 0, d = /^citrine-([1-9]\d*)\.jsonl$/.exec(e.file.name ?? "")?.[1], f = d !== void 0 && Number.isSafeInteger(Number(d)) && Number(d) <= 864e13, p = Math.floor(Math.min(Number(d), Date.now()) / 1e3), m = null, h = Number.isFinite(e.file.size) && e.file.size > 0 ? e.file.size : 0, g = 0, _ = () => t.invalidJsonCount > 0 || t.invalidStructureCount > 0 || t.invalidIdOrSignatureCount > 0, v = () => e.signal?.aborted ? "cancelled" : e.getCurrentPubkeyHex() === e.ownerPubkeyHex ? o ? t.nonEmptyLineCount > 0 ? "partial" : "failed" : a ? "cancelled" : null : "account-changed", y = (n = !1) => {
			if (!e.onProgress) return;
			let r = performance.now();
			!n && m !== null && r - m < lu || (m = r, e.onProgress({
				result: du(t),
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
					if (e instanceof Tt) return a = !0, v();
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
					if (e instanceof Tt) return a = !0, v();
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
						if (e instanceof Tt) return a = !0, v();
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
				if (!oe(n)) return Promise.resolve({
					type: "rejected",
					counter: "invalidStructureCount"
				});
				let r = n;
				return r.pubkey === e.ownerPubkeyHex ? !st(r.kind) && ![36, 5].includes(r.kind) ? Promise.resolve({
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
					else if (st(o.kind)) t.uniquePostEventCount += 1, !Number.isSafeInteger(o.created_at) || o.created_at < 0 || o.created_at >= 2 ** 53 - 1 ? l = !1 : o.created_at <= p && (s = Math.min(s ?? o.created_at, o.created_at), c = Math.max(c ?? o.created_at, o.created_at)), r.push({
						type: "post",
						...a
					});
					else if (o.kind === 5) {
						t.uniqueDeletionEventCount += 1;
						let e = fu(o);
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
			}, M = async (e = !1) => {
				for (; D.length;) await k(e);
			};
			try {
				x = e.file.stream().getReader();
			} catch {
				return t.status = "failed", y(!0), t;
			}
			e.signal?.addEventListener("abort", w, { once: !0 });
			let N = new TextDecoder("utf-8", { fatal: !0 }), P = "", ee = !1, F = (e, t = !1) => {
				try {
					return N.decode(e, { stream: t });
				} catch (e) {
					throw ee = !0, e;
				}
			};
			try {
				for (;;) {
					O();
					let e;
					try {
						e = await x.read();
					} catch (e) {
						throw ee = !0, e;
					}
					if (O(), e.done) {
						P += F(), P.length > 0 && await j(() => E(P.replace(/\r$/, "")));
						break;
					}
					u += e.value.byteLength, P += F(e.value, !0);
					let t = P.split("\n");
					P = t.pop() ?? "";
					for (let e of t) await j(() => E(e.replace(/\r$/, "")));
					let n = e.value.byteLength;
					await j(() => Promise.resolve({
						type: "bytes",
						count: n
					}));
				}
				await M();
			} catch {
				if (w(), await g(), ee && !S && !v()) try {
					await M(!0);
				} catch {}
				D.length = 0;
				let e = v();
				if (e) return t.status = e, r.length = 0, y(!0), t;
				let n = await T();
				return n ? (t.status = n, y(!0), t) : (t.status = "partial", y(!0), t);
			} finally {
				e.signal?.removeEventListener("abort", w), x.releaseLock();
			}
			let te = await T();
			if (te) return t.status = te, y(!0), t;
			if (S) return t.status = "partial", y(!0), t;
			if (t.status = i || _() ? "partial" : "completed", f && t.status === "completed" && u === h && l && s !== null && c !== null && t.insertedPostCount + t.updatedPostCount + t.unchangedPostCount === t.uniquePostEventCount) try {
				t.restoredRangeChanged = await this.importedRangesRepository.record({
					...m,
					kindsKey: Un([...et]),
					isActive: () => m.isActive() && !S,
					range: {
						since: s,
						until: c
					}
				});
			} catch (e) {
				S && !v() ? t.status = "partial" : e instanceof Tt ? (a = !0, t.status = v()) : (t.status = "partial", t.restoredRangeSaveFailed = !0);
			}
			return y(!0), t;
		} finally {
			w(), C?.dispose();
		}
	}
}(), mu = o("<div class=\"xmark-icon svg-icon svelte-1qfqhib\" aria-hidden=\"true\"></div>"), hu = o("<span class=\"import-icon svg-icon svelte-1qfqhib\" aria-hidden=\"true\"></span> <span> </span>", 1), gu = o("<div aria-live=\"polite\"> </div>"), _u = o("<div class=\"import-progress-indicator\"></div>"), vu = o("<div class=\"import-progress svelte-1qfqhib\"><!> <div class=\"import-progress-summary svelte-1qfqhib\"><span class=\"import-progress-metric svelte-1qfqhib\"><span> </span> <span class=\"import-progress-number svelte-1qfqhib\"> </span></span> <span class=\"import-progress-metric svelte-1qfqhib\"><span> </span> <span class=\"import-progress-number svelte-1qfqhib\"> </span></span> <span class=\"import-progress-metric svelte-1qfqhib\"><span> </span> <span class=\"import-progress-number svelte-1qfqhib\"> </span></span></div> <!></div>"), yu = o("<div class=\"import-results svelte-1qfqhib\"><section aria-labelledby=\"post-history-import-input-heading\" class=\"svelte-1qfqhib\"><h3 id=\"post-history-import-input-heading\" class=\"svelte-1qfqhib\"> </h3> <dl class=\"svelte-1qfqhib\"><div class=\"svelte-1qfqhib\"><dt class=\"svelte-1qfqhib\"> </dt><dd class=\"svelte-1qfqhib\"> </dd></div> <div class=\"svelte-1qfqhib\"><dt class=\"svelte-1qfqhib\"> </dt><dd class=\"svelte-1qfqhib\"> </dd></div> <div class=\"svelte-1qfqhib\"><dt class=\"svelte-1qfqhib\"> </dt><dd class=\"svelte-1qfqhib\"> </dd></div> <div class=\"svelte-1qfqhib\"><dt class=\"svelte-1qfqhib\"> </dt><dd class=\"svelte-1qfqhib\"> </dd></div> <div class=\"svelte-1qfqhib\"><dt class=\"svelte-1qfqhib\"> </dt><dd class=\"svelte-1qfqhib\"> </dd></div> <div class=\"svelte-1qfqhib\"><dt class=\"svelte-1qfqhib\"> </dt><dd class=\"svelte-1qfqhib\"> </dd></div> <div class=\"svelte-1qfqhib\"><dt class=\"svelte-1qfqhib\"> </dt><dd class=\"svelte-1qfqhib\"> </dd></div></dl></section> <section aria-labelledby=\"post-history-import-post-heading\" class=\"svelte-1qfqhib\"><h3 id=\"post-history-import-post-heading\" class=\"svelte-1qfqhib\"> </h3> <dl class=\"svelte-1qfqhib\"><div class=\"svelte-1qfqhib\"><dt class=\"svelte-1qfqhib\"> </dt><dd class=\"svelte-1qfqhib\"> </dd></div> <div class=\"svelte-1qfqhib\"><dt class=\"svelte-1qfqhib\"> </dt><dd class=\"svelte-1qfqhib\"> </dd></div> <div class=\"svelte-1qfqhib\"><dt class=\"svelte-1qfqhib\"> </dt><dd class=\"svelte-1qfqhib\"> </dd></div> <div class=\"svelte-1qfqhib\"><dt class=\"svelte-1qfqhib\"> </dt><dd class=\"svelte-1qfqhib\"> </dd></div> <div class=\"svelte-1qfqhib\"><dt class=\"svelte-1qfqhib\"> </dt><dd class=\"svelte-1qfqhib\"> </dd></div> <div class=\"svelte-1qfqhib\"><dt class=\"svelte-1qfqhib\"> </dt><dd class=\"svelte-1qfqhib\"> </dd></div></dl></section> <section aria-labelledby=\"post-history-import-deletion-heading\" class=\"svelte-1qfqhib\"><h3 id=\"post-history-import-deletion-heading\" class=\"svelte-1qfqhib\"> </h3> <dl class=\"svelte-1qfqhib\"><div class=\"svelte-1qfqhib\"><dt class=\"svelte-1qfqhib\"> </dt><dd class=\"svelte-1qfqhib\"> </dd></div> <div class=\"svelte-1qfqhib\"><dt class=\"svelte-1qfqhib\"> </dt><dd class=\"svelte-1qfqhib\"> </dd></div> <div class=\"svelte-1qfqhib\"><dt class=\"svelte-1qfqhib\"> </dt><dd class=\"svelte-1qfqhib\"> </dd></div> <div class=\"svelte-1qfqhib\"><dt class=\"svelte-1qfqhib\"> </dt><dd class=\"svelte-1qfqhib\"> </dd></div> <div class=\"svelte-1qfqhib\"><dt class=\"svelte-1qfqhib\"> </dt><dd class=\"svelte-1qfqhib\"> </dd></div> <div class=\"svelte-1qfqhib\"><dt class=\"svelte-1qfqhib\"> </dt><dd class=\"svelte-1qfqhib\"> </dd></div> <div class=\"svelte-1qfqhib\"><dt class=\"svelte-1qfqhib\"> </dt><dd class=\"svelte-1qfqhib\"> </dd></div></dl></section></div>"), bu = o("<div class=\"import-heading svelte-1qfqhib\"><h2 class=\"svelte-1qfqhib\"> </h2> <p class=\"svelte-1qfqhib\"> </p></div> <input class=\"visually-hidden import-file-input\" type=\"file\"/> <div role=\"presentation\"><!> <p class=\"import-drop-hint svelte-1qfqhib\"> </p></div> <!> <!>", 1), xu = {
	hash: "svelte-1qfqhib",
	code: ".import-heading.svelte-1qfqhib {width:100%;text-align:left;}.import-heading.svelte-1qfqhib h2:where(.svelte-1qfqhib),\n    .import-heading.svelte-1qfqhib p:where(.svelte-1qfqhib) {margin:0;}.import-heading.svelte-1qfqhib h2:where(.svelte-1qfqhib) {font-size:1.1rem;}.import-heading.svelte-1qfqhib p:where(.svelte-1qfqhib) {margin-top:6px;color:var(--text-muted);font-size:0.88rem;line-height:1.5;}.post-history-import-file-button {margin-top:0;}.import-drop-zone.svelte-1qfqhib {width:100%;margin-top:16px;padding:0;border:1px dashed transparent;border-radius:10px;text-align:center;transition:background-color 120ms ease, border-color 120ms ease;}.import-drop-zone-active.svelte-1qfqhib {border-color:var(--accent-color);background:color-mix(in srgb, var(--accent-color), transparent 90%);}.import-drop-hint.svelte-1qfqhib {display:none;margin:8px 0 0;color:var(--text-muted);font-size:0.8rem;}\n\n    @media (hover: hover) and (pointer: fine) {.import-drop-zone.svelte-1qfqhib {min-height:136px;box-sizing:border-box;padding:20px 16px 28px;}.import-drop-hint.svelte-1qfqhib {display:block;}\n    }.import-icon.svelte-1qfqhib {mask-image:var(--ehagaki-icon-636c6f75645f646f776e6c6f61645f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.xmark-icon.svelte-1qfqhib {mask-image:var(--ehagaki-icon-636c6f73655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.import-progress.svelte-1qfqhib {width:100%;margin-top:12px;}.import-progress-status.svelte-1qfqhib {margin-bottom:8px;color:var(--text);font-size:0.9rem;}.import-progress-status-error.svelte-1qfqhib {color:var(--error-color, #d32f2f);}.import-progress-summary.svelte-1qfqhib {display:grid;grid-template-columns:repeat(3, minmax(0, 1fr));gap:8px;margin-bottom:8px;color:var(--text-muted);font-size:0.82rem;font-variant-numeric:tabular-nums;}.import-progress-metric.svelte-1qfqhib {display:flex;flex-direction:column;align-items:center;gap:3px;min-width:0;}.import-progress-number.svelte-1qfqhib {color:var(--text);text-align:center;}.import-progress-root {width:100%;height:12px;border-radius:999px;background-color:color-mix(in srgb, var(--text) 12%, transparent);overflow:hidden;}.import-progress-indicator {width:100%;height:100%;border-radius:inherit;background-color:var(--theme);transition:translate 0.3s ease;}\n\n    @media (prefers-reduced-motion: reduce) {.import-progress-indicator {transition:none;}\n    }.import-results.svelte-1qfqhib {display:grid;grid-template-columns:repeat(3, minmax(0, 1fr));gap:8px;width:100%;margin-top:12px;}.import-results.svelte-1qfqhib section:where(.svelte-1qfqhib) {min-width:0;padding:10px;border:1px solid var(--border-hr);border-radius:8px;}.import-results.svelte-1qfqhib h3:where(.svelte-1qfqhib) {margin:0 0 8px;font-size:0.9rem;}.import-results.svelte-1qfqhib dl:where(.svelte-1qfqhib),\n    .import-results.svelte-1qfqhib dl:where(.svelte-1qfqhib) div:where(.svelte-1qfqhib) {margin:0;}.import-results.svelte-1qfqhib dl:where(.svelte-1qfqhib) div:where(.svelte-1qfqhib) {display:flex;justify-content:space-between;gap:8px;padding-block:3px;font-size:0.8rem;}.import-results.svelte-1qfqhib dt:where(.svelte-1qfqhib) {min-width:0;color:var(--text-muted);}.import-results.svelte-1qfqhib dd:where(.svelte-1qfqhib) {flex:0 0 auto;font-variant-numeric:tabular-nums;}.post-history-import-dialog {max-width:min(760px, calc(100% - 10px));}\n\n    @media (max-width: 680px) {.import-progress-summary.svelte-1qfqhib {grid-template-columns:1fr;}.import-progress-metric.svelte-1qfqhib {flex-direction:row;justify-content:space-between;gap:6px;}.import-progress-number.svelte-1qfqhib {text-align:right;}.import-results.svelte-1qfqhib {grid-template-columns:1fr;}\n    }"
};
function Su(t, i) {
	n(i, !0), e(t, xu);
	let a = () => R(Pe, "$_", o), [o, s] = te(), u = L(i, "open", 15, !1), d = L(i, "onOpenChange", 3, void 0), f = L(i, "onImported", 3, void 0), v = H(null), y = H(!1), x = H(null), C = H(null), k = H(0), A = H(0), j = H(0), M = H(P([])), N = H(0), ee = null, ne = null, V = null, oe = 0, se = null, ce = !1, G = null, le = U(() => F(C)?.processedBytes ?? F(k)), ue = U(() => F(C)?.totalBytes ?? F(A)), K = U(() => F(ue) <= 0 ? 0 : Math.min(100, Math.max(0, Math.round(F(le) / F(ue) * 100)))), de = U(() => {
		let e = F(M)[0], t = F(M).at(-1);
		if (!e || !t || F(M).length < 3 || t.elapsedMs - e.elapsedMs < 2e3 || F(j) - t.elapsedMs > 1e4 || F(le) <= 0 || F(ue) <= 0 || F(le) >= F(ue) || F(j) <= e.elapsedMs) return null;
		let n = (t.bytes - e.bytes) / (F(j) - e.elapsedMs), r = (F(ue) - F(le)) / n;
		return Number.isFinite(r) && r >= 0 ? r : null;
	}), q = U(() => F(y) ? F(de) === null ? a()("postHistory.importRemainingTimeCalculating") : fe(F(de)) : F(x)?.status === "completed" || F(x)?.status === "partial" ? fe(0) : a()("postHistory.importRemainingTimeUnavailable"));
	function fe(e) {
		let t = Math.max(0, Math.floor(e / 1e3)), n = String(t % 60).padStart(2, "0"), r = Math.floor(t / 60), i = r % 60;
		return r < 60 ? `${i}:${n}` : `${Math.floor(r / 60)}:${String(i).padStart(2, "0")}:${n}`;
	}
	function pe() {
		V !== null && O(j, Math.max(0, performance.now() - V), !0);
	}
	function me() {
		ne !== null && (clearInterval(ne), ne = null), V = null;
	}
	function he() {
		me(), O(j, 0), V = performance.now(), ne = setInterval(pe, 1e3);
	}
	function ge() {
		me(), O(C, null), O(k, 0), O(A, 0), O(j, 0), O(M, [], !0);
	}
	function _e(e) {
		if (e.result.insertedPostCount + e.result.updatedPostCount + e.result.unchangedPostCount + e.result.insertedDeletionRequestCount + e.result.updatedDeletionRequestCount + e.result.unchangedDeletionRequestCount + e.result.savedPayloadCandidateCount === 0 || (F(M).at(-1)?.elapsedMs ?? -1) >= F(j)) return;
		let t = [...F(M), {
			elapsedMs: F(j),
			bytes: e.processedBytes
		}];
		for (; t.length > 1 && t[1].elapsedMs <= F(j) - 1e4;) t.shift();
		O(M, t, !0);
	}
	function ve(e) {
		return `translate: -${100 - e}% 0;`;
	}
	let ye = U(() => F(y) ? "postHistory.importReading" : F(x) ? F(x).status === "completed" ? "postHistory.importComplete" : F(x).status === "partial" ? F(x).restoredRangeSaveFailed ? "postHistory.importBackupRangeFailed" : "postHistory.importPartial" : F(x).status === "account-changed" ? "postHistory.importAccountChanged" : F(x).status === "cancelled" ? "postHistory.importCancelled" : "postHistory.importFailed" : null);
	function be() {
		O(x, null), O(y, !1), ge(), O(N, 0), ee = null, F(v) && (F(v).value = "");
	}
	function J() {
		G?.(), G = null, oe += 1, ee?.abort(), ee = null, O(y, !1), ge(), O(N, 0);
	}
	function xe(e) {
		e || J(), d()?.(e);
	}
	function Y() {
		!F(y) && i.ownerPubkeyHex && F(v)?.click();
	}
	function Se(e) {
		return e ? Array.from(e.types).includes("Files") || e.files.length > 0 : !1;
	}
	function Ce(e) {
		Se(e.dataTransfer) && (e.preventDefault(), O(N, F(N) + 1));
	}
	function we(e) {
		e.preventDefault(), Se(e.dataTransfer);
	}
	function Te(e) {
		(F(N) !== 0 || Se(e.dataTransfer)) && O(N, Math.max(0, F(N) - 1), !0);
	}
	function Ee(e) {
		if (e.preventDefault(), !Se(e.dataTransfer)) return;
		O(N, 0);
		let t = e.dataTransfer?.files[0];
		t && De(t);
	}
	async function De(e) {
		if (F(y) || !i.ownerPubkeyHex) return;
		let t = ++oe, n = i.ownerPubkeyHex;
		se = n;
		let r = new AbortController();
		ee = r, O(y, !0), O(x, null), O(C, null), O(k, 0), O(A, Number.isFinite(e.size) && e.size > 0 ? e.size : 0, !0), O(M, [], !0), he();
		let a = au.acquire();
		G = a;
		try {
			let a = await pu.importFile({
				file: e,
				ownerPubkeyHex: n,
				getCurrentPubkeyHex: i.getCurrentPubkeyHex,
				signal: r.signal,
				onProgress: (e) => {
					t === oe && u() && (O(C, {
						result: { ...e.result },
						processedBytes: e.processedBytes,
						totalBytes: e.totalBytes
					}, !0), O(k, e.processedBytes, !0), O(A, e.totalBytes, !0), O(x, { ...e.result }, !0), pe(), _e(e));
				}
			});
			if (t !== oe || !u() || (O(x, a, !0), i.getCurrentPubkeyHex() !== n || i.ownerPubkeyHex !== n)) return;
			if (a.localRevision !== void 0) try {
				if (await pt(We, n) !== a.localRevision) return;
			} catch {
				return;
			}
			if (t !== oe || !u() || i.getCurrentPubkeyHex() !== n) return;
			(a.insertedPostCount + a.updatedPostCount + a.appliedDeletionPostCount > 0 || a.restoredRangeChanged) && await f()?.(a);
		} finally {
			a(), G === a && (G = null), t === oe && (O(y, !1), me(), ee = null);
		}
	}
	async function Oe(e) {
		let t = e.currentTarget, n = t.files?.[0];
		t.value = "", n && await De(n);
	}
	w(() => {
		F(y) && i.ownerPubkeyHex !== se && J();
	}), w(() => {
		u() && !ce ? be() : !u() && ce && J(), ce = u();
	}), re(() => {
		G?.(), G = null, oe += 1, ee?.abort(), me();
	});
	{
		let e = (e) => {
			var t = r(), n = T(t);
			{
				let e = (e, t) => {
					let n = () => (t?.()).props;
					{
						let t = U(() => a()("global.close"));
						Lt(e, S(n, {
							className: "modal-close",
							shape: "square",
							get ariaLabel() {
								return F(t);
							},
							children: (e, t) => {
								var n = mu();
								_(e, n);
							},
							$$slots: { default: !0 }
						}));
					}
				};
				l(n, () => An, (t, n) => {
					n(t, {
						child: e,
						$$slots: { child: !0 }
					});
				});
			}
			_(e, t);
		}, n = U(() => a()("postHistory.importTitle")), o = U(() => a()("postHistory.importDescription"));
		kn(t, {
			onOpenChange: xe,
			get title() {
				return F(n);
			},
			get description() {
				return F(o);
			},
			contentClass: "post-history-import-dialog",
			footerVariant: "close-button",
			initialFocus: "content",
			get open() {
				return u();
			},
			set open(e) {
				u(e);
			},
			footer: e,
			children: (e, t) => {
				var n = bu(), r = T(n), o = B(r), s = D(o, !0), u = I(o, 2), d = D(u, !0);
				c(r);
				var f = I(r, 2);
				E(f, (e) => O(v, e), () => F(v));
				var h = I(f, 2);
				let S;
				var C = B(h);
				{
					let e = U(() => F(y) || !i.ownerPubkeyHex), t = U(() => a()("postHistory.importChooseFile"));
					Lt(C, {
						className: "post-history-import-file-button",
						variant: "default",
						shape: "pill",
						get disabled() {
							return F(e);
						},
						get ariaLabel() {
							return F(t);
						},
						onClick: Y,
						children: (e, t) => {
							var n = hu(), r = I(T(n), 2), i = D(r, !0);
							z((e) => g(i, e), [() => a()("postHistory.importChooseFile")]), _(e, n);
						},
						$$slots: { default: !0 }
					});
				}
				var w = I(C, 2), k = D(w, !0);
				c(h);
				var A = I(h, 2), M = (e) => {
					var t = vu(), n = B(t), r = (e) => {
						var t = gu();
						let n;
						var r = D(t, !0);
						z((e) => {
							n = m(t, 1, "import-progress-status svelte-1qfqhib", null, n, { "import-progress-status-error": F(x)?.status === "failed" }), g(r, e);
						}, [() => a()(F(ye))]), _(e, t);
					};
					W(n, (e) => {
						F(ye) && e(r);
					});
					var i = I(n, 2), o = B(i), s = B(o), u = D(s, !0), d = I(s, 2), f = D(d);
					c(o);
					var p = I(o, 2), h = B(p), v = D(h, !0), y = I(h, 2), b = D(y, !0);
					c(p);
					var S = I(p, 2), C = B(S), w = D(C, !0), T = I(C, 2), E = D(T, !0);
					c(S), c(i);
					var O = I(i, 2);
					{
						let e = U(() => a()("postHistory.importProgressBarLabel")), t = U(() => `${F(K)}%`);
						l(O, () => Xn, (n, r) => {
							r(n, {
								get value() {
									return F(K);
								},
								max: 100,
								get "aria-label"() {
									return F(e);
								},
								get "aria-valuetext"() {
									return F(t);
								},
								class: "import-progress-root",
								children: (e, t) => {
									var n = _u();
									z((e) => ie(n, e), [() => ve(F(K))]), _(e, n);
								},
								$$slots: { default: !0 }
							});
						});
					}
					c(t), z((e, n, r, i, a) => {
						ae(t, "aria-label", e), g(u, n), g(f, `${F(K) ?? ""}%`), g(v, r), g(b, i), g(w, a), g(E, F(q));
					}, [
						() => a()("postHistory.importProgress"),
						() => a()("postHistory.importProgress"),
						() => a()("postHistory.importElapsedTime"),
						() => fe(F(j)),
						() => a()("postHistory.importEstimatedRemainingTime")
					]), _(e, t);
				};
				W(A, (e) => {
					(F(y) || F(x)) && e(M);
				});
				var P = I(A, 2), ee = (e) => {
					var t = yu(), n = B(t), r = B(n), i = D(r, !0), o = I(r, 2), s = B(o), l = B(s), u = D(l, !0), d = I(l), f = D(d, !0);
					c(s);
					var p = I(s, 2), m = B(p), h = D(m, !0), v = I(m), y = D(v, !0);
					c(p);
					var b = I(p, 2), S = B(b), C = D(S, !0), w = I(S), T = D(w, !0);
					c(b);
					var E = I(b, 2), O = B(E), k = D(O, !0), A = I(O), j = D(A, !0);
					c(E);
					var M = I(E, 2), N = B(M), P = D(N, !0), ee = I(N), te = D(ee, !0);
					c(M);
					var L = I(M, 2), ne = B(L), R = D(ne, !0), re = I(ne), V = D(re, !0);
					c(L);
					var H = I(L, 2), ie = B(H), U = D(ie, !0), ae = I(ie), W = D(ae, !0);
					c(H), c(o), c(n);
					var oe = I(n, 2), se = B(oe), ce = D(se, !0), G = I(se, 2), le = B(G), ue = B(le), K = D(ue, !0), de = I(ue), q = D(de, !0);
					c(le);
					var fe = I(le, 2), pe = B(fe), me = D(pe, !0), he = I(pe), ge = D(he, !0);
					c(fe);
					var _e = I(fe, 2), ve = B(_e), ye = D(ve, !0), be = I(ve), J = D(be, !0);
					c(_e);
					var xe = I(_e, 2), Y = B(xe), Se = D(Y, !0), Ce = I(Y), we = D(Ce, !0);
					c(xe);
					var Te = I(xe, 2), Ee = B(Te), De = D(Ee, !0), Oe = I(Ee), ke = D(Oe, !0);
					c(Te);
					var Ae = I(Te, 2), X = B(Ae), je = D(X, !0), Me = I(X), Ne = D(Me, !0);
					c(Ae), c(G), c(oe);
					var Pe = I(oe, 2), Fe = B(Pe), Ie = D(Fe, !0), Le = I(Fe, 2), Z = B(Le), Re = B(Z), ze = D(Re, !0), Be = I(Re), Ve = D(Be, !0);
					c(Z);
					var He = I(Z, 2), Ue = B(He), We = D(Ue, !0), Ge = I(Ue), Ke = D(Ge, !0);
					c(He);
					var qe = I(He, 2), Je = B(qe), Ye = D(Je, !0), Xe = I(Je), Ze = D(Xe, !0);
					c(qe);
					var Qe = I(qe, 2), $e = B(Qe), et = D($e, !0), tt = I($e), nt = D(tt, !0);
					c(Qe);
					var rt = I(Qe, 2), it = B(rt), at = D(it, !0), ot = I(it), st = D(ot, !0);
					c(rt);
					var ct = I(rt, 2), lt = B(ct), ut = D(lt, !0), Q = I(lt), dt = D(Q, !0);
					c(ct);
					var ft = I(ct, 2), pt = B(ft), mt = D(pt, !0), ht = I(pt), gt = D(ht, !0);
					c(ft), c(Le), c(Pe), c(t), z((e, t, n, r, a, o, s, c, l, d, p, m, _, v, b, S, w, E, D, O, A, M, N) => {
						g(i, e), g(u, t), g(f, F(x).nonEmptyLineCount), g(h, n), g(y, F(x).fileDuplicateCount), g(C, r), g(T, F(x).otherAccountCount), g(k, a), g(j, F(x).unsupportedKindCount), g(P, o), g(te, F(x).invalidJsonCount), g(R, s), g(V, F(x).invalidStructureCount), g(U, c), g(W, F(x).invalidIdOrSignatureCount), g(ce, l), g(K, d), g(q, F(x).uniquePostEventCount), g(me, p), g(ge, F(x).insertedPostCount), g(ye, m), g(J, F(x).updatedPostCount), g(Se, _), g(we, F(x).unchangedPostCount), g(De, v), g(ke, F(x).failedPostEventCount), g(je, b), g(Ne, F(x).appliedDeletionPostCount), g(Ie, S), g(ze, w), g(Ve, F(x).uniqueDeletionEventCount), g(We, E), g(Ke, F(x).validDeletionETagCount), g(Ye, D), g(Ze, F(x).insertedDeletionRequestCount), g(et, O), g(nt, F(x).updatedDeletionRequestCount), g(at, A), g(st, F(x).unchangedDeletionRequestCount), g(ut, M), g(dt, F(x).unsupportedDeletionEventCount), g(mt, N), g(gt, F(x).failedDeletionEventCount);
					}, [
						() => a()("postHistory.importInputResults"),
						() => a()("postHistory.importNonEmptyLines"),
						() => a()("postHistory.importFileDuplicates"),
						() => a()("postHistory.importOtherAccount"),
						() => a()("postHistory.importUnsupportedKind"),
						() => a()("postHistory.importInvalidJson"),
						() => a()("postHistory.importInvalidStructure"),
						() => a()("postHistory.importInvalidCrypto"),
						() => a()("postHistory.importPostResults"),
						() => a()("postHistory.importPostEvents"),
						() => a()("postHistory.importInserted"),
						() => a()("postHistory.importUpdated"),
						() => a()("postHistory.importUnchanged"),
						() => a()("postHistory.importPostFailures"),
						() => a()("postHistory.importDeletionApplied"),
						() => a()("postHistory.importDeletionResults"),
						() => a()("postHistory.importDeletionEvents"),
						() => a()("postHistory.importDeletionTags"),
						() => a()("postHistory.importDeletionRequestsInserted"),
						() => a()("postHistory.importDeletionRequestsUpdated"),
						() => a()("postHistory.importDeletionRequestsUnchanged"),
						() => a()("postHistory.importUnsupportedDeletion"),
						() => a()("postHistory.importDeletionFailures")
					]), _(e, t);
				};
				W(P, (e) => {
					F(x) && e(ee);
				}), z((e, t, n, r) => {
					g(s, e), g(d, t), ae(f, "aria-label", n), S = m(h, 1, "import-drop-zone svelte-1qfqhib", null, S, { "import-drop-zone-active": F(N) > 0 }), g(k, r);
				}, [
					() => a()("postHistory.importTitle"),
					() => a()("postHistory.importDescription"),
					() => a()("postHistory.importChooseFile"),
					() => F(N) > 0 ? a()("postHistory.importDropActive") : a()("postHistory.importDropHint")
				]), b("change", f, Oe), p("dragenter", h, Ce), p("dragover", h, we), p("dragleave", h, Te), p("drop", h, Ee), _(e, n);
			},
			$$slots: {
				footer: !0,
				default: !0
			}
		});
	}
	h(), s();
}
v(["change"]);
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryScanAuthObserver.ts
function Cu(e, t, n = Date.now) {
	let r = !1, i = new Map(t.map((e) => [e, {
		ids: /* @__PURE__ */ new Set(),
		successAt: null,
		rejected: !1,
		listeners: /* @__PURE__ */ new Set()
	}])), a = (e) => i.get(G.normalizeExternalRelayUrl(e) ?? ""), o = (e) => {
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
function wu(e) {
	let t = Object.entries(e.issueCounts).filter(([, e]) => (e ?? 0) > 0);
	return t.length === 1 && t[0][0] === "ambiguous";
}
var Tu = {
	windowSeconds: 2592e3,
	limit: 250,
	concurrency: 4,
	pageTimeoutMs: vn,
	authTimeoutMs: 3e4,
	relayTimeoutMs: 18e5,
	operationTimeoutMs: 72e5,
	maxRequests: 1e4,
	maxBoundaryIds: 1e3
}, Eu = new class {
	deps;
	activeRuntimes = /* @__PURE__ */ new WeakSet();
	constructor(e = {}) {
		this.deps = e;
	}
	start(e) {
		if (this.activeRuntimes.has(e.rxNostr)) throw Error("A post-history full scan is already running");
		this.activeRuntimes.add(e.rxNostr);
		let t = this.deps.now ?? Date.now, n = {
			...Tu,
			...this.deps.options
		}, r = t(), i = Math.max(0, Math.floor(r / 1e3)), a = Kt(e.relayConfig), o = $t(e.relayConfig), s = [...et], c = new AbortController(), l = /* @__PURE__ */ new Set(), u = null, d = !1, f = !1, p = !1, m = 0, h = a.map((e) => ({
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
			let t = e.getCurrentScope(), n = t.ownerPubkeyHex === e.ownerPubkeyHex && t.rxNostr === e.rxNostr && $t(t.relayConfig) === o;
			return n || v(!0), n && !c.signal.aborted;
		}, b = () => v();
		e.signal?.addEventListener("abort", b, { once: !0 }), e.signal?.aborted && v();
		let x = Cu(e.rxNostr, a, t), S = () => void 0, C = (e, t, n) => {
			e.issueCounts[t] = (e.issueCounts[t] ?? 0) + 1, e.rangeSamples.length < 16 && e.rangeSamples.push({
				since: n.since,
				until: n.until
			});
		};
		return _(), {
			promise: (async () => {
				try {
					S = wt(e.rxNostr, e.ownerPubkeyHex, s);
					let a = await (this.deps.createScope ?? Vn)({
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
						let n = await (this.deps.persistBatch ?? Ln)(e.events, e.fetchedAt, t, a);
						n.applied === !1 ? !u && !d && v(!0) : (f = !0, g.insertedCount += n.insertedCount, g.updatedCount += n.updatedCount, _());
					}, b = async (a) => {
						let f = t() + n.relayTimeoutMs, m = () => Math.min(f, r + n.operationTimeoutMs) - t(), h = async (t) => {
							for (let r = 0; r < 2 && y() && !d; r++) {
								if (m() <= 0 || a.requestCount >= n.maxRequests) return C(a, "safety-limit", t), null;
								a.requestCount += 1, a.phase = "fetching", _();
								let i;
								try {
									let r = (this.deps.fetchRelayPage ?? Vt.fetchRelayPage.bind(Vt))(e.rxNostr, {
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
										let d = l.page?.hints.includes("more") === !0, f = !d && l.page?.hints.includes("finish") === !0, p = !d && l.rawCount === 0, g = l.oldestCreatedAt, v = ct({
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
							a.status = c.signal.aborted ? "cancelled" : Object.keys(a.issueCounts).length && !wu(a) ? "partial" : "completed";
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
					})), a.isActive() || u || d || v(!0), u || d || (await (this.deps.persistBatch ?? Ln)([], t(), [], a)).applied !== !1 || u || v(!0);
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
}(), Du = o("<span class=\"close-icon svg-icon svelte-3dbqmx\" aria-hidden=\"true\"></span>"), Ou = o("<!> <!>", 1), ku = o("<div class=\"scan-status svelte-3dbqmx\" role=\"status\"><!> <span> </span></div>"), Au = o("<div class=\"svelte-3dbqmx\"><dt class=\"svelte-3dbqmx\"> </dt><dd class=\"svelte-3dbqmx\"> </dd></div>"), ju = o("<div class=\"svelte-3dbqmx\"><dt class=\"svelte-3dbqmx\"> </dt><dd class=\"svelte-3dbqmx\"> </dd></div> <div class=\"svelte-3dbqmx\"><dt class=\"svelte-3dbqmx\"> </dt><dd class=\"svelte-3dbqmx\"> </dd></div> <!>", 1), Mu = o("<div class=\"scan-relay-ambiguity-popover svelte-3dbqmx\"><h3 class=\"svelte-3dbqmx\"> </h3> <p class=\"svelte-3dbqmx\"> </p> <p class=\"svelte-3dbqmx\"> </p> <p class=\"svelte-3dbqmx\"> </p></div>"), Nu = o("<span class=\"scan-relay-reason svelte-3dbqmx\"> </span>"), Pu = o("<tr class=\"scan-relay-row svelte-3dbqmx\"><td class=\"svelte-3dbqmx\"><span class=\"scan-relay-host svelte-3dbqmx\"> </span></td><td class=\"scan-relay-state svelte-3dbqmx\"><div class=\"scan-relay-state-line svelte-3dbqmx\"><span class=\"svelte-3dbqmx\"> </span> <!></div> <!></td><td class=\"scan-relay-count svelte-3dbqmx\"> </td></tr>"), Fu = o("<div class=\"scan-results svelte-3dbqmx\"><section class=\"svelte-3dbqmx\"><h3 class=\"svelte-3dbqmx\"> </h3> <dl class=\"svelte-3dbqmx\"><div class=\"svelte-3dbqmx\"><dt class=\"svelte-3dbqmx\"> </dt><dd class=\"svelte-3dbqmx\"> </dd></div> <div class=\"svelte-3dbqmx\"><dt class=\"svelte-3dbqmx\"> </dt><dd class=\"svelte-3dbqmx\"> </dd></div> <div class=\"svelte-3dbqmx\"><dt class=\"svelte-3dbqmx\"> </dt><dd class=\"svelte-3dbqmx\"> </dd></div></dl></section> <section class=\"svelte-3dbqmx\"><h3 class=\"svelte-3dbqmx\"> </h3> <dl class=\"svelte-3dbqmx\"><div class=\"svelte-3dbqmx\"><dt class=\"svelte-3dbqmx\"> </dt><dd class=\"svelte-3dbqmx\"> </dd></div> <div class=\"svelte-3dbqmx\"><dt class=\"svelte-3dbqmx\"> </dt><dd class=\"svelte-3dbqmx\"> </dd></div> <!></dl></section></div> <section class=\"scan-relays svelte-3dbqmx\"><table class=\"svelte-3dbqmx\"><caption class=\"svelte-3dbqmx\"> </caption><thead><tr><th scope=\"col\" class=\"svelte-3dbqmx\"> </th><th scope=\"col\" class=\"svelte-3dbqmx\"> </th><th scope=\"col\" class=\"svelte-3dbqmx\"> </th></tr></thead><tbody></tbody></table></section>", 1), Iu = o("<div class=\"scan-heading svelte-3dbqmx\"><h2 class=\"svelte-3dbqmx\"> </h2> <p class=\"svelte-3dbqmx\"> </p></div> <div class=\"scan-actions svelte-3dbqmx\"><!></div> <!> <!>", 1), Lu = {
	hash: "svelte-3dbqmx",
	code: ".scan-heading.svelte-3dbqmx, .scan-status.svelte-3dbqmx, .scan-results.svelte-3dbqmx {width:100%;}.scan-heading.svelte-3dbqmx {text-align:center;}.scan-heading.svelte-3dbqmx h2:where(.svelte-3dbqmx), .scan-heading.svelte-3dbqmx p:where(.svelte-3dbqmx) {margin:0;}.scan-heading.svelte-3dbqmx h2:where(.svelte-3dbqmx) {font-size:1.25rem;}.scan-heading.svelte-3dbqmx p:where(.svelte-3dbqmx) {margin-top:16px;font-size:0.88rem;line-height:1.5;white-space:pre-line;}.scan-actions.svelte-3dbqmx {box-sizing:border-box;display:flex;flex:0 0 50px;flex-wrap:wrap;align-items:center;justify-content:center;gap:8px;height:50px;margin-top:16px;}.scan-status.svelte-3dbqmx {display:flex;align-items:center;justify-content:center;gap:8px;margin-top:12px;font-size:0.9rem;}.post-history-full-scan-dialog .scan-action {box-sizing:border-box;min-width:50px;min-height:50px;padding:8px 12px;}.post-history-full-scan-dialog .scan-close-action {box-sizing:border-box;min-width:50px;min-height:50px;}.post-history-full-scan-dialog .scan-status .loading-placeholder {width:auto;flex:0 0 auto;justify-content:flex-start;}.close-icon.svelte-3dbqmx {mask-image:var(--ehagaki-icon-636c6f73655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.scan-results.svelte-3dbqmx {display:grid;grid-template-columns:repeat(2, minmax(0, 1fr));gap:8px;margin-top:12px;}.scan-results.svelte-3dbqmx section:where(.svelte-3dbqmx) {min-width:0;padding:10px;border:1px solid var(--border-hr);border-radius:8px;}.scan-results.svelte-3dbqmx h3:where(.svelte-3dbqmx) {margin:0 0 8px;font-size:0.9rem;}.scan-results.svelte-3dbqmx dl:where(.svelte-3dbqmx), .scan-results.svelte-3dbqmx dl:where(.svelte-3dbqmx) div:where(.svelte-3dbqmx) {margin:0;}.scan-results.svelte-3dbqmx dl:where(.svelte-3dbqmx) div:where(.svelte-3dbqmx) {display:flex;justify-content:space-between;gap:8px;padding-block:3px;font-size:0.8rem;}.scan-results.svelte-3dbqmx dt:where(.svelte-3dbqmx) {min-width:0;color:var(--text-muted);overflow-wrap:anywhere;}.scan-results.svelte-3dbqmx dd:where(.svelte-3dbqmx) {margin:0;flex:0 0 auto;font-variant-numeric:tabular-nums;}.scan-relays.svelte-3dbqmx {width:100%;min-width:0;box-sizing:border-box;margin-top:12px;padding:10px;border:1px solid var(--border-hr);border-radius:8px;}.scan-relays.svelte-3dbqmx table:where(.svelte-3dbqmx) {width:100%;table-layout:fixed;border-collapse:collapse;font-size:0.8rem;}.scan-relays.svelte-3dbqmx caption:where(.svelte-3dbqmx) {margin-bottom:8px;text-align:left;font-size:0.9rem;font-weight:600;}.scan-relays.svelte-3dbqmx th:where(.svelte-3dbqmx), .scan-relays.svelte-3dbqmx td:where(.svelte-3dbqmx) {padding:0 4px;text-align:left;overflow-wrap:anywhere;}.scan-relays.svelte-3dbqmx th:where(.svelte-3dbqmx) {color:var(--text-muted);font-weight:500;}.scan-relays.svelte-3dbqmx th:where(.svelte-3dbqmx):first-child {width:45%;}.scan-relays.svelte-3dbqmx th:where(.svelte-3dbqmx):nth-child(2) {width:28%;}.scan-relays.svelte-3dbqmx th:where(.svelte-3dbqmx):last-child, .scan-relays.svelte-3dbqmx td:where(.svelte-3dbqmx):last-child {text-align:right;}.scan-relay-row.svelte-3dbqmx {border-top:1px solid var(--border-hr);}.scan-relay-host.svelte-3dbqmx {display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.scan-relay-state-line.svelte-3dbqmx {display:flex;align-items:center;flex-wrap:wrap;gap:2px;min-width:0;min-height:44px;box-sizing:border-box;}.scan-relay-state-line.svelte-3dbqmx > span:where(.svelte-3dbqmx) {min-width:0;overflow-wrap:anywhere;}.scan-relay-count.svelte-3dbqmx {font-variant-numeric:tabular-nums;}.scan-relay-reason.svelte-3dbqmx {display:block;margin-top:4px;color:var(--text-muted);font-size:0.75rem;}.popover-content:has(.scan-relay-ambiguity-popover) {box-sizing:border-box;inline-size:min(320px, calc(100vw - 24px));max-inline-size:calc(100vw - 24px);max-block-size:min(var(--bits-popover-content-available-height, calc(100vh - 24px)), calc(100vh - 24px));overflow:auto;}.scan-relay-ambiguity-popover.svelte-3dbqmx {overflow-wrap:anywhere;}.scan-relay-ambiguity-popover.svelte-3dbqmx h3:where(.svelte-3dbqmx) {margin:0 0 8px;font-size:1rem;}.scan-relay-ambiguity-popover.svelte-3dbqmx p:where(.svelte-3dbqmx) {margin:0 0 8px;}.scan-relay-ambiguity-popover.svelte-3dbqmx p:where(.svelte-3dbqmx):last-child {margin-bottom:0;}.post-history-full-scan-dialog {max-width:min(760px, calc(100% - 10px));}\n    @media (max-width: 680px) {.scan-results.svelte-3dbqmx {grid-template-columns:1fr;} }"
};
function Ru(t, a) {
	n(a, !0), e(t, Lu);
	let o = () => R(Pe, "$_", u), [u, d] = te(), p = L(a, "open", 15), m = U(() => a.result ?? a.progress), v = U(() => a.running ? `postHistory.fullScanPhase.${a.progress?.phase ?? "fetching"}` : a.result ? `postHistory.fullScanStatus.${a.result.status}` : null), b = U(() => {
		let e = {};
		for (let t of a.result?.relays ?? []) if (!(t.status === "completed" && wu(t))) for (let [n, r] of Object.entries(t.issueCounts)) e[n] = (e[n] ?? 0) + (r ?? 0);
		return Object.entries(e);
	});
	function x(e) {
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
	function w(e) {
		if (e.status === "running") return e.phase;
		if (e.status === "completed") return e.receivedCount === 0 && !wu(e) ? "empty" : "completed";
		if (e.status === "cancelled") return "cancelled";
		let t = Object.entries(e.issueCounts).filter(([, e]) => (e ?? 0) > 0).map(([e]) => e);
		return t.length && t.every((e) => e === "timeout" || e === "auth-timeout") ? "timeout" : t.length === 1 && t[0] === "error" ? "error" : "partial";
	}
	function E(e) {
		if (e.status !== "partial" || w(e) !== "partial") return null;
		let t = Object.entries(e.issueCounts).filter(([, e]) => (e ?? 0) > 0);
		return t.length === 1 ? t[0][0] : null;
	}
	{
		let e = (e) => {
			var t = r(), n = T(t);
			{
				let e = (e, t) => {
					let n = () => (t?.()).props;
					{
						let t = U(() => o()("global.close"));
						Lt(e, S(n, {
							className: "modal-close scan-close-action",
							shape: "square",
							get ariaLabel() {
								return F(t);
							},
							children: (e, t) => {
								var n = Du();
								_(e, n);
							},
							$$slots: { default: !0 }
						}));
					}
				};
				l(n, () => An, (t, n) => {
					n(t, {
						child: e,
						$$slots: { child: !0 }
					});
				});
			}
			_(e, t);
		}, n = U(() => o()("postHistory.fullScanTitle")), u = U(() => o()("postHistory.fullScanDescription"));
		kn(t, {
			get onOpenChange() {
				return a.onOpenChange;
			},
			get title() {
				return F(n);
			},
			get description() {
				return F(u);
			},
			contentClass: "post-history-full-scan-dialog",
			footerVariant: "close-button",
			initialFocus: "content",
			get open() {
				return p();
			},
			set open(e) {
				p(e);
			},
			footer: e,
			children: (e, t) => {
				var n = Iu(), r = T(n), l = B(r), u = D(l, !0), d = I(l, 2), p = D(d, !0);
				c(r);
				var h = I(r, 2), S = B(h), O = (e) => {
					var t = Ou(), n = T(t), r = (e) => {
						{
							let t = U(() => !a.canStart);
							Lt(e, {
								variant: "primary",
								shape: "square",
								className: "scan-action",
								get disabled() {
									return F(t);
								},
								get onClick() {
									return a.onStart;
								},
								children: (e, t) => {
									M();
									var n = y();
									z((e) => g(n, e), [() => o()("postHistory.fullScanStart")]), _(e, n);
								},
								$$slots: { default: !0 }
							});
						}
					};
					W(n, (e) => {
						a.running || e(r);
					});
					var i = I(n, 2), s = (e) => {
						Lt(e, {
							variant: "default",
							shape: "square",
							className: "scan-action",
							get onClick() {
								return a.onCancel;
							},
							children: (e, t) => {
								M();
								var n = y();
								z((e) => g(n, e), [() => o()("postHistory.fullScanCancel")]), _(e, n);
							},
							$$slots: { default: !0 }
						});
					};
					W(i, (e) => {
						a.running && e(s);
					}), _(e, t);
				};
				W(S, (e) => {
					a.result || e(O);
				}), c(h);
				var k = I(h, 2), A = (e) => {
					var t = ku(), n = B(t), r = (e) => {
						Re(e, {
							showLoader: !0,
							loaderSize: 20
						});
					};
					W(n, (e) => {
						a.running && e(r);
					});
					var i = I(n, 2), s = D(i, !0);
					c(t), z((e) => g(s, e), [() => o()(F(v))]), _(e, t);
				};
				W(k, (e) => {
					F(v) && e(A);
				});
				var j = I(k, 2), N = (e) => {
					var t = Fu(), n = T(t), r = B(n), l = B(r), u = D(l, !0), d = I(l, 2), p = B(d), h = B(p), v = D(h, !0), y = I(h), S = D(y);
					c(p);
					var O = I(p, 2), k = B(O), A = D(k, !0), j = I(k), M = D(j, !0);
					c(O);
					var N = I(O, 2), P = B(N), ee = D(P, !0), te = I(P), L = D(te, !0);
					c(N), c(d), c(r);
					var ne = I(r, 2), R = B(ne), re = D(R, !0), V = I(R, 2), H = B(V), ie = B(H), oe = D(ie, !0), se = I(ie), ce = D(se, !0);
					c(H);
					var G = I(H, 2), le = B(G), ue = D(le, !0), K = I(le), de = D(K, !0);
					c(G);
					var q = I(G, 2), fe = (e) => {
						var t = ju(), n = T(t), r = B(n), l = D(r, !0), u = I(r), d = D(u, !0);
						c(n);
						var p = I(n, 2), m = B(p), h = D(m, !0), v = I(m), y = D(v, !0);
						c(p);
						var x = I(p, 2);
						i(x, 17, () => F(b), s, (e, t) => {
							var n = U(() => f(F(t), 2));
							let r = () => F(n)[0], i = () => F(n)[1];
							var a = Au(), s = B(a), l = D(s, !0), u = I(s), d = D(u, !0);
							c(a), z((e) => {
								g(l, e), g(d, i());
							}, [() => o()(`postHistory.fullScanIssue.${r()}`)]), _(e, a);
						}), z((e, t, n, r) => {
							g(l, e), g(d, t), g(h, n), g(y, r);
						}, [
							() => o()("postHistory.fullScanCompletedRelays"),
							() => a.result.relays.filter((e) => e.status === "completed").length,
							() => o()("postHistory.fullScanIncompleteRelays"),
							() => a.result.relays.filter((e) => e.status !== "completed").length
						]), _(e, t);
					};
					W(q, (e) => {
						a.result && e(fe);
					}), c(V), c(ne), c(n);
					var pe = I(n, 2), me = B(pe), he = B(me), ge = D(he, !0), _e = I(he), ve = B(_e), ye = B(ve), be = D(ye, !0), J = I(ye), xe = D(J, !0), Y = I(J), Se = D(Y, !0);
					c(ve), c(_e);
					var Ce = I(_e);
					i(Ce, 21, () => F(m).relays, (e) => e.relayUrl, (e, t) => {
						let n = U(() => E(F(t))), r = U(() => F(t).status === "completed" && wu(F(t)));
						var i = Pu(), a = B(i), s = B(a), l = D(s, !0);
						c(a);
						var u = I(a), d = B(u), f = B(d), p = D(f, !0), m = I(f, 2), h = (e) => {
							{
								let t = U(() => o()("postHistory.fullScanAmbiguityInfo.label"));
								Rr(e, {
									side: "top",
									sideOffset: 4,
									get ariaLabel() {
										return F(t);
									},
									children: (e, t) => {
										var n = Mu(), r = B(n), i = D(r, !0), a = I(r, 2), s = D(a, !0), l = I(a, 2), u = D(l, !0), d = I(l, 2), f = D(d, !0);
										c(n), z((e, t, n, r) => {
											g(i, e), g(s, t), g(u, n), g(f, r);
										}, [
											() => o()("postHistory.fullScanAmbiguityInfo.title"),
											() => o()("postHistory.fullScanAmbiguityInfo.bodyCompletion"),
											() => o()("postHistory.fullScanAmbiguityInfo.bodyEose"),
											() => o()("postHistory.fullScanAmbiguityInfo.bodyStatus")
										]), _(e, n);
									},
									$$slots: { default: !0 }
								});
							}
						};
						W(m, (e) => {
							F(r) && e(h);
						}), c(d);
						var v = I(d, 2), y = (e) => {
							var t = Nu(), r = D(t, !0);
							z((e) => g(r, e), [() => o()(`postHistory.fullScanIssue.${F(n)}`)]), _(e, t);
						};
						W(v, (e) => {
							F(n) && e(y);
						}), c(u);
						var b = I(u), x = D(b, !0);
						c(i), z((e, n) => {
							ae(i, "data-relay-url", F(t).relayUrl), ae(s, "title", F(t).relayUrl), g(l, e), g(p, n), g(x, F(t).receivedCount);
						}, [() => C(F(t).relayUrl), () => o()(`postHistory.fullScanRelayStatus.${w(F(t))}`)]), _(e, i);
					}), c(Ce), c(me), c(pe), z((e, t, n, r, i, a, o, s, c, l, d, f) => {
						g(u, e), g(v, t), g(S, `${F(m).finishedRelayCount ?? ""} / ${F(m).targetRelayCount ?? ""}`), g(A, n), g(M, F(m).receivedCount), g(ee, r), g(L, i), g(re, a), g(oe, o), g(ce, F(m).insertedCount), g(ue, s), g(de, F(m).updatedCount), g(ge, c), g(be, l), g(xe, d), g(Se, f);
					}, [
						() => o()("postHistory.fullScanRetrieval"),
						() => o()("postHistory.fullScanRelays"),
						() => o()("postHistory.fullScanReceived"),
						() => o()("postHistory.importElapsedTime"),
						() => x(a.elapsedMs),
						() => o()("postHistory.fullScanSaved"),
						() => o()("postHistory.importInserted"),
						() => o()("postHistory.fullScanUpdated"),
						() => o()("postHistory.fullScanRelayProgress"),
						() => o()("postHistory.fullScanRelayHost"),
						() => o()("postHistory.fullScanRelayState"),
						() => o()("postHistory.fullScanReceived")
					]), _(e, t);
				};
				W(j, (e) => {
					F(m) && e(N);
				}), z((e, t) => {
					g(u, e), g(p, t);
				}, [() => o()("postHistory.fullScanTitle"), () => o()("postHistory.fullScanDescription")]), _(e, n);
			},
			$$slots: {
				footer: !0,
				default: !0
			}
		});
	}
	h(), d();
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/hooks/usePostHistoryRelayFullScan.svelte.ts
function zu(e) {
	let t = P({
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
		return !!r && r.ownerPubkeyHex === t.ownerPubkeyHex && r.rxNostr === t.rxNostr && i === $t(t.relayConfig);
	};
	function f(e) {
		e || u(), e && !n && (t.result = null, t.progress = null, t.elapsedMs = 0), t.open = e;
	}
	async function p() {
		let c = e.getScope();
		if (a || n || !c.ownerPubkeyHex || !c.rxNostr || !e.getShow()) return;
		let u = o;
		r = c, i = $t(c.relayConfig), t.running = !0, t.result = null, t.progress = null, t.elapsedMs = 0;
		let f = performance.now(), p = setInterval(() => {
			u === o && e.getShow() && (t.elapsedMs = performance.now() - f);
		}, 1e3);
		s = p;
		let m = au.acquire();
		l = m;
		try {
			let r = Eu.start({
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
	return w(() => {
		let a = e.getShow(), o = e.getScope(), s = $t(o.relayConfig);
		j(() => {
			n && r && (o.ownerPubkeyHex !== r.ownerPubkeyHex || o.rxNostr !== r.rxNostr || s !== i) && u(!0), !a && n ? c() : a || (t.open = !1);
		});
	}), re(() => {
		a = !0, u();
	}), {
		state: t,
		setOpen: f,
		start: p,
		suspend: c,
		cancel: () => u()
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostHistoryJumpDatePanel.svelte
var Bu = o("<div class=\"calendar-icon svg-icon\" aria-hidden=\"true\"></div>"), Vu = o("<span class=\"post-history-date-picker-nav-icon post-history-date-picker-nav-icon-left svg-icon\" aria-hidden=\"true\"></span>"), Hu = o("<span class=\"post-history-date-picker-nav-icon post-history-date-picker-nav-icon-right svg-icon\" aria-hidden=\"true\"></span>"), Uu = o("<button type=\"button\" class=\"post-history-date-picker-year-nav\" aria-label=\"Previous year\"><span class=\"post-history-date-picker-year-nav-icon post-history-date-picker-year-nav-icon-left svg-icon\" aria-hidden=\"true\"></span></button> <!> <!> <!> <button type=\"button\" class=\"post-history-date-picker-year-nav\" aria-label=\"Next year\"><span class=\"post-history-date-picker-year-nav-icon post-history-date-picker-year-nav-icon-right svg-icon\" aria-hidden=\"true\"></span></button>", 1), Wu = o("<!> <!>", 1), Gu = o("<!> <!> <!>", 1), Ku = o("<div class=\"jump-icon svg-icon svelte-jfmj5a\" aria-hidden=\"true\"></div>"), qu = o("<div class=\"xmark-icon svg-icon svelte-jfmj5a\" aria-hidden=\"true\"></div>"), Ju = o("<div class=\"post-history-utility-panel svelte-jfmj5a\"><div class=\"post-history-utility-label svelte-jfmj5a\" id=\"post-history-jump-date-label\"> </div> <div class=\"post-history-utility-controls svelte-jfmj5a\"><!> <!> <!></div></div>"), Yu = {
	hash: "svelte-jfmj5a",
	code: ".post-history-utility-panel.svelte-jfmj5a {display:flex;flex-direction:column;padding:6px 16px 6px;border-bottom:1px solid var(--border-hr);gap:2px;}.post-history-utility-label.svelte-jfmj5a {color:var(--text-muted);font-size:0.82rem;}.post-history-utility-controls.svelte-jfmj5a {display:flex;flex-wrap:wrap;gap:4px;align-items:center;}.post-history-date-picker-input {display:inline-flex;align-items:stretch;gap:2px;min-width:0;padding:6px;height:40px;border:1px solid var(--border-hr);background:var(--background);color:var(--text);font:inherit;}.post-history-date-picker-segment {display:inline-flex;align-items:center;justify-content:center;min-width:1ch;height:auto;color:var(--text-muted);&[role=\"spinbutton\"] {min-width:3ch;}&[data-segment=\"year\"] {min-width:5ch;}}.post-history-date-picker-trigger {flex:0 0 auto;min-width:40px;min-height:40px;padding:0;}.post-history-date-picker-trigger .svg-icon {mask-image:var(--ehagaki-icon-63616c656e6461725f746f6461795f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);width:24px;height:24px;}.post-history-date-picker-content {z-index:110;background-color:var(--dialog-bg2);border:1px solid var(--border-soft);border-radius:8px;padding:8px;box-shadow:0 12px 28px rgb(0 0 0 / 0.16);}.post-history-date-picker-calendar {display:flex;flex-direction:column;gap:6px;}.post-history-date-picker-header {display:flex;align-items:center;justify-content:space-between;gap:8px;}.post-history-date-picker-heading {flex:1 1 auto;text-align:center;font-size:0.9rem;font-weight:600;}.post-history-date-picker-nav,\n    .post-history-date-picker-year-nav {display:inline-flex;align-items:center;justify-content:center;width:30px;height:30px;border:1px solid var(--border-soft);border-radius:6px;background-color:var(--btn-bg2);color:var(--text);}.post-history-date-picker-nav-icon,\n    .post-history-date-picker-year-nav-icon {width:24px;height:24px;background-color:currentColor;}.post-history-date-picker-nav-icon-left {margin-inline-end:1px;mask-image:var(--ehagaki-icon-6b6579626f6172645f6172726f775f6c6566745f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.post-history-date-picker-nav-icon-right {margin-inline-start:1px;mask-image:var(--ehagaki-icon-6b6579626f6172645f6172726f775f72696768745f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.post-history-date-picker-year-nav-icon-left {mask-image:var(--ehagaki-icon-6b6579626f6172645f646f75626c655f6172726f775f6c6566745f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.post-history-date-picker-year-nav-icon-right {mask-image:var(--ehagaki-icon-6b6579626f6172645f646f75626c655f6172726f775f72696768745f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.post-history-date-picker-grid {border-collapse:separate;border-spacing:2px;}.post-history-date-picker-weekday {color:var(--text-muted);font-size:0.74rem;font-weight:500;text-align:center;}.post-history-date-picker-day {display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:6px;font-size:0.86rem;}.post-history-date-picker-day[data-selected] {background:color-mix(in srgb, var(--theme), white 10%);color:white;}.post-history-date-picker-day[data-disabled] {opacity:0.45;}.post-history-utility-button {height:auto;min-height:40px;white-space:nowrap;}.post-history-utility-button.post-history-utility-submit-button,\n    .post-history-utility-button.post-history-utility-close-button {min-width:70px;min-height:40px;}.jump-icon.svelte-jfmj5a {mask-image:var(--ehagaki-icon-6b6579626f6172645f7461625f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.post-history-utility-close-button .xmark-icon.svelte-jfmj5a {mask-image:var(--ehagaki-icon-636c6f73655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}"
};
function Xu(t, a) {
	n(a, !0), e(t, Yu);
	let o = () => R(Pe, "$_", u), s = () => R(Ae, "$locale", u), [u, d] = te(), f = L(a, "value", 15), p = L(a, "placeholder", 15), m = L(a, "open", 15), v = le().overlayTarget;
	function x(e) {
		let t = p() ?? f();
		t && e !== 0 && p(t.add({ years: e }));
	}
	var S = Ju(), C = B(S), w = D(C, !0), E = I(C, 2), O = B(E);
	{
		let e = U(() => s() ?? void 0), t = U(() => o()("postHistory.jumpToDateLabel"));
		l(O, () => Zc, (n, a) => {
			a(n, {
				get locale() {
					return F(e);
				},
				get calendarLabel() {
					return F(t);
				},
				get value() {
					return f();
				},
				set value(e) {
					f(e);
				},
				get placeholder() {
					return p();
				},
				set placeholder(e) {
					p(e);
				},
				get open() {
					return m();
				},
				set open(e) {
					m(e);
				},
				children: (e, t) => {
					var n = Gu(), a = T(n);
					{
						let e = (e, t) => {
							let n = () => (t?.()).segments;
							var a = r(), o = T(a);
							i(o, 19, n, (e, t) => `${e.part}-${t}`, (e, t) => {
								var n = r(), i = T(n);
								l(i, () => Jc, (e, n) => {
									n(e, {
										class: "post-history-date-picker-segment",
										get part() {
											return F(t).part;
										},
										children: (e, n) => {
											M();
											var r = y();
											z(() => g(r, F(t).value)), _(e, r);
										},
										$$slots: { default: !0 }
									});
								}), _(e, n);
							}), _(e, a);
						};
						l(a, () => Gc, (t, n) => {
							n(t, {
								"aria-labelledby": "post-history-jump-date-label",
								class: "post-history-date-picker-input",
								children: e,
								$$slots: { default: !0 }
							});
						});
					}
					var s = I(a, 2);
					{
						let e = U(() => o()("postHistory.jumpToDate"));
						l(s, () => il, (t, n) => {
							n(t, {
								class: "post-history-date-picker-trigger",
								get "aria-label"() {
									return F(e);
								},
								children: (e, t) => {
									var n = Bu();
									_(e, n);
								},
								$$slots: { default: !0 }
							});
						});
					}
					var c = I(s, 2);
					l(c, () => Ft, (e, t) => {
						t(e, {
							get to() {
								return v;
							},
							children: (e, t) => {
								var n = r(), a = T(n);
								l(a, () => nl, (e, t) => {
									t(e, {
										sideOffset: 8,
										class: "post-history-date-picker-content",
										children: (e, t) => {
											var n = r(), a = T(n);
											{
												let e = (e, t) => {
													let n = () => (t?.()).months, a = () => (t?.()).weekdays;
													var o = Wu(), s = T(o);
													l(s, () => lc, (e, t) => {
														t(e, {
															class: "post-history-date-picker-header",
															children: (e, t) => {
																var n = Uu(), r = T(n), i = I(r, 2);
																l(i, () => vc, (e, t) => {
																	t(e, {
																		class: "post-history-date-picker-nav",
																		"aria-label": "Previous month",
																		children: (e, t) => {
																			var n = Vu();
																			_(e, n);
																		},
																		$$slots: { default: !0 }
																	});
																});
																var a = I(i, 2);
																l(a, () => fc, (e, t) => {
																	t(e, { class: "post-history-date-picker-heading" });
																});
																var o = I(a, 2);
																l(o, () => hc, (e, t) => {
																	t(e, {
																		class: "post-history-date-picker-nav",
																		"aria-label": "Next month",
																		children: (e, t) => {
																			var n = Hu();
																			_(e, n);
																		},
																		$$slots: { default: !0 }
																	});
																});
																var s = I(o, 2);
																b("click", r, () => x(-1)), b("click", s, () => x(1)), _(e, n);
															},
															$$slots: { default: !0 }
														});
													});
													var c = I(s, 2);
													i(c, 19, n, (e, t) => `${e.value.toString()}-${t}`, (e, t) => {
														var n = r(), o = T(n);
														l(o, () => Gs, (e, n) => {
															n(e, {
																class: "post-history-date-picker-grid",
																children: (e, n) => {
																	var o = Wu(), s = T(o);
																	l(s, () => ec, (e, t) => {
																		t(e, {
																			children: (e, t) => {
																				var n = r(), o = T(n);
																				l(o, () => oc, (e, t) => {
																					t(e, {
																						children: (e, t) => {
																							var n = r(), o = T(n);
																							i(o, 19, a, (e, t) => `${e}-${t}`, (e, t) => {
																								var n = r(), i = T(n);
																								l(i, () => rc, (e, n) => {
																									n(e, {
																										class: "post-history-date-picker-weekday",
																										children: (e, n) => {
																											M();
																											var r = y();
																											z(() => g(r, F(t))), _(e, r);
																										},
																										$$slots: { default: !0 }
																									});
																								}), _(e, n);
																							}), _(e, n);
																						},
																						$$slots: { default: !0 }
																					});
																				}), _(e, n);
																			},
																			$$slots: { default: !0 }
																		});
																	});
																	var c = I(s, 2);
																	l(c, () => Js, (e, n) => {
																		n(e, {
																			children: (e, n) => {
																				var a = r(), o = T(a);
																				i(o, 19, () => F(t).weeks, (e, n) => `${F(t).value.toString()}-week-${n}`, (e, n) => {
																					var a = r(), o = T(a);
																					l(o, () => oc, (e, a) => {
																						a(e, {
																							children: (e, a) => {
																								var o = r(), s = T(o);
																								i(s, 19, () => F(n), (e, t) => `${e.toString()}-${t}`, (e, n) => {
																									var i = r(), a = T(i);
																									l(a, () => Zs, (e, i) => {
																										i(e, {
																											get date() {
																												return F(n);
																											},
																											get month() {
																												return F(t).value;
																											},
																											children: (e, t) => {
																												var i = r(), a = T(i);
																												l(a, () => Hs, (e, t) => {
																													t(e, {
																														class: "post-history-date-picker-day",
																														children: (e, t) => {
																															M();
																															var r = y();
																															z(() => g(r, F(n).day)), _(e, r);
																														},
																														$$slots: { default: !0 }
																													});
																												}), _(e, i);
																											},
																											$$slots: { default: !0 }
																										});
																									}), _(e, i);
																								}), _(e, o);
																							},
																							$$slots: { default: !0 }
																						});
																					}), _(e, a);
																				}), _(e, a);
																			},
																			$$slots: { default: !0 }
																		});
																	}), _(e, o);
																},
																$$slots: { default: !0 }
															});
														}), _(e, n);
													}), _(e, o);
												};
												l(a, () => el, (t, n) => {
													n(t, {
														class: "post-history-date-picker-calendar",
														children: e,
														$$slots: { default: !0 }
													});
												});
											}
											_(e, n);
										},
										$$slots: { default: !0 }
									});
								}), _(e, n);
							},
							$$slots: { default: !0 }
						});
					}), _(e, n);
				},
				$$slots: { default: !0 }
			});
		});
	}
	var k = I(O, 2);
	{
		let e = U(() => o()("postHistory.jumpToDateSubmit"));
		Lt(k, {
			type: "button",
			variant: "primary",
			contentLayout: "icon",
			shape: "square",
			get ariaLabel() {
				return F(e);
			},
			className: "post-history-utility-button post-history-utility-submit-button",
			get onClick() {
				return a.onSubmit;
			},
			children: (e, t) => {
				var n = Ku();
				_(e, n);
			},
			$$slots: { default: !0 }
		});
	}
	var A = I(k, 2);
	{
		let e = U(() => o()("postHistory.hideJumpToDate"));
		Lt(A, {
			type: "button",
			variant: "default",
			contentLayout: "icon",
			shape: "square",
			get ariaLabel() {
				return F(e);
			},
			className: "post-history-utility-button post-history-utility-close-button",
			get onClick() {
				return a.onClose;
			},
			children: (e, t) => {
				var n = qu();
				_(e, n);
			},
			$$slots: { default: !0 }
		});
	}
	c(E), c(S), z((e) => g(w, e), [() => o()("postHistory.jumpToDateLabel")]), _(t, S), h(), d();
}
v(["click"]);
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryBrowsingContinuity.ts
function Zu(e, t, n = []) {
	return dt([
		...e,
		...t,
		...n
	]);
}
function Qu(e, t, n, r = null) {
	let i = dt(e), a = i.find((e) => e.since <= t && e.until >= t), o = a ? a.since - 1 : t;
	if (o < 0) return null;
	let s = i.filter((e) => e.until < o).at(-1), c = r !== null && r <= o ? r : Math.max(0, o - n);
	return {
		since: Math.max(c, s ? s.until + 1 : 0),
		until: o
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryDialogViewState.ts
var $u = {
	currentPage: 1,
	searchPage: 1,
	searchInput: "",
	searchQuery: ""
}, ed = /* @__PURE__ */ new Map();
function td(e) {
	if (typeof e != "string") return null;
	let t = e.trim();
	return t.length > 0 ? t : null;
}
function nd(e) {
	return typeof e != "number" || !Number.isFinite(e) ? 1 : Math.max(1, Math.trunc(e));
}
function rd(e) {
	return {
		currentPage: e.currentPage,
		searchPage: e.searchPage,
		searchInput: e.searchInput,
		searchQuery: e.searchQuery
	};
}
function id(e) {
	let t = td(e);
	return rd(t ? ed.get(t) ?? $u : $u);
}
function ad(e, t) {
	let n = td(e);
	if (!n) return rd($u);
	let r = ed.get(n) ?? $u, i = {
		currentPage: nd(t.currentPage ?? r.currentPage),
		searchPage: nd(t.searchPage ?? r.searchPage),
		searchInput: t.searchInput ?? r.searchInput,
		searchQuery: t.searchQuery ?? r.searchQuery
	};
	return ed.set(n, i), rd(i);
}
function od(e) {
	let t = td(e);
	t && ed.delete(t);
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryDialogOpenRefreshDecision.ts
function sd(e) {
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
var cd = 2e3;
function ld(e) {
	return Number.isFinite(e) ? Math.max(1, Math.trunc(e)) : 1;
}
function ud(e) {
	return Number.isFinite(e) ? Math.max(1, Math.trunc(e)) : 50;
}
function dd(e) {
	return e.trim().toLowerCase().split(/\s+/).filter(Boolean);
}
function fd(e) {
	return e.join(" ");
}
function pd(e) {
	return {
		postHistory: Dt(e),
		channelMetadata: lt()
	};
}
function md(e, t) {
	return e.postHistory === t.postHistory && e.channelMetadata === t.channelMetadata;
}
function hd(e) {
	let t = it(e.kind) && Ot(e);
	return t && e.repostTarget ? nt(e.repostTarget.rawEvent, t)?.event : null;
}
function gd(e, t) {
	return it(e.kind) ? t ? de(t).channelEventId : void 0 : e.channelEventId;
}
function _d(e, t, n = "", r = null) {
	return [
		it(e.kind) ? "" : e.content,
		...r ? [
			r.content,
			r.id,
			r.pubkey,
			r.tags.flat().join(" "),
			...Xe(r).flatMap((e) => [e.url, e.alt ?? ""])
		] : [],
		n,
		e.eventId,
		String(e.kind),
		e.tags.flat().join(" "),
		...e.media.flatMap((e) => [e.url, e.alt ?? ""]),
		gd(e, r) ?? "",
		e.relayHints.join(" "),
		e.acceptedRelays.join(" "),
		e.fetchedRelays?.join(" ") ?? "",
		t?.name ?? "",
		t?.about ?? ""
	].join("\n").toLowerCase();
}
function vd(e, t) {
	return Array.from(new Set(e.map((e) => gd(e, t.get(e.eventId))).filter((e) => typeof e == "string" && e.length > 0)));
}
var yd = new class {
	postHistoryRepositoryImpl;
	channelMetadataRepositoryImpl;
	sensitivePayloadRepositoryImpl;
	resolvedCacheEntry = null;
	inFlightEntry = null;
	runtimeCacheToken = 0;
	constructor(e = Q, t = Kn, n = Ct) {
		this.postHistoryRepositoryImpl = e, this.channelMetadataRepositoryImpl = t, this.sensitivePayloadRepositoryImpl = n;
	}
	clearCache() {
		this.resolvedCacheEntry = null, this.inFlightEntry = null, this.runtimeCacheToken += 1;
	}
	isResolvedCacheEntryCurrent(e, t, n, r) {
		return e.pubkeyHex === t && e.normalizedQueryKey === n && md(e.revision, r);
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
		let i = new Map(t.map((e) => [e.eventId, hd(e)])), a = t.flatMap((e) => {
			if (!K(e.rawEvent, e)) return [];
			let t = it(e.kind) ? i.get(e.eventId) : e.rawEvent;
			if (!t) return [];
			let n = Qe(t);
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
			ot(e, i, t) && c.set(n, i.content);
		}
		let l = vd(t, i).filter((e) => !r.has(e));
		if (l.length > 0) {
			let t = await this.channelMetadataRepositoryImpl.getMany(l);
			this.assertBuildActive(e), l.forEach((e) => r.set(e, null)), t.forEach((e) => {
				r.set(e.channelEventId, e);
			});
		}
		return t.filter((e) => {
			let t = i.get(e.eventId), a = gd(e, t), o = _d(e, a ? r.get(a) ?? null : null, c.get(e.eventId) ?? "", t);
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
				limit: cd
			});
			this.assertBuildActive(e);
			let o = await this.filterBatch(e, a.items, t, r), s = md(e.revision, pd(e.pubkeyHex));
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
				let l = pd(e), u = md(s, l);
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
		let t = dd(e.query);
		if (!e.pubkeyHex || t.length === 0) return {
			items: [],
			total: 0,
			hasNext: !1
		};
		let n = ld(e.page), r = ud(e.pageSize), i = e.pubkeyHex, a = fd(t), o = pd(i);
		this.inFlightEntry && (this.inFlightEntry.pubkeyHex !== i || this.inFlightEntry.normalizedQueryKey !== a || !md(this.inFlightEntry.revision, o)) && (this.inFlightEntry = null);
		let s = this.resolvedCacheEntry, c = s && this.isResolvedCacheEntryCurrent(s, i, a, o) ? s.filteredPosts : await (async () => {
			let s = this.inFlightEntry, c = s && s.runtimeCacheToken === this.runtimeCacheToken && s.pubkeyHex === i && s.normalizedQueryKey === a && md(s.revision, o) ? s : this.startFilteredPostsBuild(i, a, t, o), l = n === 1 && e.onProgress ? {
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
}(), bd = 12, xd = 3600, Sd = class extends Error {
	phase;
	phaseStartedAt;
	errorClass;
	constructor(e, t, n) {
		super(e), this.name = "PostHistoryCurrentViewRefetchFailure", this.phase = e, this.phaseStartedAt = n, this.errorClass = t instanceof Error ? t.name : typeof t, this.cause = t;
	}
};
function Cd(e, t) {
	return e.status === "timeout" || e.status === "error" || e.status === "cancelled" ? e.status : typeof e.coverageComplete == "boolean" ? e.coverageComplete && !e.coverageSaturated ? "complete" : "partial" : e.hasMore || e.perRelayCounts.some((e) => e.rawCount >= t) ? "partial" : "complete";
}
function wd(e) {
	return e === "partial" || e === "timeout" || e === "error";
}
function Td(e, t) {
	return typeof e.coverageSaturated == "boolean" ? e.coverageSaturated : e.hasMore || e.perRelayCounts.some((e) => e.rawCount >= t);
}
function Ed(e) {
	return typeof e.since == "number" && typeof e.until == "number" && e.until - e.since > xd;
}
function Dd(e) {
	if (!Ed(e)) return [];
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
var Od = new class {
	postHistoryRelayFetchService;
	postHistoryRepository;
	setTimeoutFn;
	clearTimeoutFn;
	console;
	now;
	constructor(e = {}) {
		this.postHistoryRelayFetchService = e.postHistoryRelayFetchService ?? Vt, this.postHistoryRepository = e.postHistoryRepository ?? Q, this.setTimeoutFn = e.setTimeoutFn ?? setTimeout, this.clearTimeoutFn = e.clearTimeoutFn ?? clearTimeout, this.console = e.console ?? (globalThis.console === void 0 ? { debug: () => void 0 } : globalThis.console), this.now = e.now ?? Date.now;
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
					let C = await Vn({
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
						timeoutMs: vn,
						...typeof S.since == "number" ? { since: S.since } : {},
						...typeof S.until == "number" ? { until: S.until } : {}
					});
					r = w;
					let T = this.now(), E;
					try {
						E = await w.promise;
					} catch (e) {
						let t = this.now();
						throw _ += Math.max(0, t - T), new Sd("primary-fetch", e, T);
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
							if (r = await Bn(E, C, this.postHistoryRepository), r.applied === !1) {
								n = !0;
								break;
							}
						} catch (t) {
							throw v += Math.max(0, this.now() - e), new Sd("primary-persist", t, e);
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
					let M = Td(E, S.limit);
					d ||= M;
					let N = M ? Dd(S) : [], P = N.length > 0 && x.length + 1 + a.length + N.length <= bd, ee = M ? "limit" : Cd(E, S.limit);
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
						status: ee,
						rawCount: E.rawCount,
						uniqueCount: E.uniqueCount,
						duplicateCount: E.duplicateCount,
						insertedCount: k,
						updatedCount: A,
						unchangedCount: j
					}), M && P ? (h += N.length, a.unshift(...N)) : M && (m = !0), (wd(ee) || O || M && !P) && (u = !0), n || !C.isActive()) {
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
}();
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryListingRepair.ts
function kd(e) {
	let t = e.error, n = e.errorClass ?? (t instanceof Error ? t.name : t === void 0 ? void 0 : typeof t);
	return {
		phase: e.phase,
		durationMs: e.durationMs ?? Math.max(0, (e.finishedAt ?? Date.now()) - e.startedAt),
		...n ? { errorClass: n } : {},
		...e.counts ?? {}
	};
}
function Ad(e) {
	let t = kd(e);
	"errorClass" in t ? console.warn("post_history_manual_repair_phase", t) : console.debug("post_history_manual_repair_phase", t);
}
var jd = 86400;
function Md(e) {
	let t = e.map((e) => e.createdAt).filter((e) => Number.isFinite(e)).map((e) => Math.trunc(e));
	if (t.length === 0) return [];
	let n = Math.min(...t), r = Math.max(...t);
	return [{
		kinds: [...et],
		rangeUnit: "custom",
		since: Math.max(0, n - jd),
		until: r + jd,
		limit: 250
	}];
}
function Nd(e) {
	return {
		processedRangeCount: e.processedRangeCount,
		rawCount: e.processedRanges.reduce((e, t) => e + (t.rawCount ?? 0), 0),
		uniqueCount: e.processedRanges.reduce((e, t) => e + (t.uniqueCount ?? 0), 0),
		requestedRelayCount: e.processedRanges.reduce((e, t) => e + (t.requestedRelayUrls?.length ?? 0), 0),
		eoseRelayCount: e.processedRanges.reduce((e, t) => e + (t.eoseRelayUrls?.length ?? 0), 0)
	};
}
function Pd(e, t) {
	let n = [{
		phase: "relation-repair",
		startedAt: t,
		durationMs: e.relationRepairDurationMs ?? (e.failurePhase === "relation-repair" ? e.failureDurationMs : void 0),
		errorClass: e.failurePhase === "relation-repair" ? e.failureErrorClass : void 0,
		counts: { savedDirectReplyCount: e.savedDirectReplyCount }
	}];
	return (typeof e.badgeRefreshDurationMs == "number" || e.failurePhase === "badge-refresh") && n.push({
		phase: "badge-refresh",
		startedAt: t,
		durationMs: e.badgeRefreshDurationMs ?? e.failureDurationMs,
		errorClass: e.failurePhase === "badge-refresh" ? e.failureErrorClass : void 0
	}), n;
}
function Fd(e, t) {
	return e.addedCount > 0 ? {
		key: "postHistory.repairAdded",
		values: {
			count: e.addedCount,
			processedRangeCount: e.processedRangeCount,
			updatedCount: e.updatedCount
		}
	} : t > 0 ? {
		key: "postHistory.repairChildInteractionsAdded",
		values: { count: t }
	} : e.fetchFailed ? {
		key: "postHistory.repairFetchFailed",
		values: null
	} : {
		key: "postHistory.repairNoChanges",
		values: {
			processedRangeCount: e.processedRangeCount,
			updatedCount: e.updatedCount
		}
	};
}
function Id({ error: e, activePhaseStartedAt: t, primaryRefetchReloadCompleted: n }) {
	let r = typeof e == "object" && e ? e.phase : void 0, i = typeof e == "object" && e && typeof e.phaseStartedAt == "number" ? e.phaseStartedAt : t, a = typeof e == "object" && e && typeof e.errorClass == "string" ? e.errorClass : void 0;
	return {
		phase: r === "primary-fetch" || r === "primary-persist" ? r : n ? "relation-repair" : "primary-fetch",
		startedAt: i,
		errorClass: a
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryListingRepairController.ts
function Ld(e) {
	let { state: t, getShow: n, getPubkeyHex: r, getRxNostr: i, getRelayConfig: a } = e, o = null, s = null;
	function c() {
		o?.cancel(), o = null, e.cancelCurrentViewRelationRepair(), t.currentViewRefetchStatus === "refetching" && (t.currentViewRefetchStatus = "idle"), l();
	}
	function l() {
		s !== null && (clearTimeout(s), s = null);
	}
	function u() {
		t.currentViewRefetchMessageKey = null, t.currentViewRefetchMessageValues = null, l();
	}
	function d() {
		l();
		let e = /* @__PURE__ */ new Set([
			"postHistory.repairNoChanges",
			"postHistory.repairAdded",
			"postHistory.repairChildInteractionsAdded",
			"postHistory.repairFetchFailed"
		]);
		e.has(t.currentViewRefetchMessageKey ?? "") && (s = setTimeout(() => {
			t.currentViewRefetchMessageKey !== null && e.has(t.currentViewRefetchMessageKey) && (t.currentViewRefetchMessageKey = null, t.currentViewRefetchMessageValues = null), s = null;
		}, 3500));
	}
	function f() {
		return t.searchQuery ? [] : Md(t.loadedPosts);
	}
	async function p() {
		e.clearContiguousProgress();
		let s = r(), c = i();
		if (!s || !c || !e.canRefetchAroundCurrentView()) return;
		let l = f();
		if (l.length === 0) return;
		u(), t.currentViewRefetchStatus = "refetching";
		let p = null, m = Date.now();
		try {
			await e.refreshVisibleUntil(s), Ad({
				phase: "visible-range-state",
				startedAt: m
			});
		} catch (e) {
			Ad({
				phase: "visible-range-state",
				startedAt: m,
				error: e
			}), t.currentViewRefetchStatus = "idle", t.currentViewRefetchMessageKey = "postHistory.repairFetchFailed", t.currentViewRefetchMessageValues = null, d();
			return;
		}
		let h, g = Date.now();
		try {
			h = Od.refetchAroundCurrentView(c, {
				pubkeyHex: s,
				relayConfig: a(),
				preferredRanges: l,
				getRelayConfig: a,
				isActive: () => n() && r() === s && i() === c,
				onProgress: async () => void 0
			});
		} catch (e) {
			Ad({
				phase: "primary-fetch",
				startedAt: g,
				error: e
			}), t.currentViewRefetchStatus = "idle", t.currentViewRefetchMessageKey = "postHistory.repairFetchFailed", t.currentViewRefetchMessageValues = null, d();
			return;
		}
		o = h, e.startLocalRepairRead({
			since: Math.min(...l.map((e) => e.since)),
			until: Math.max(...l.map((e) => e.until))
		});
		let _ = !1, v = g;
		try {
			let a = await h.promise;
			if (o !== h) return;
			if (Ad({
				phase: "primary-fetch",
				startedAt: g,
				durationMs: a.timing?.primaryFetchDurationMs ?? 0,
				counts: Nd(a)
			}), (a.timing?.primaryPersistAttemptCount ?? 0) > 0 && Ad({
				phase: "primary-persist",
				startedAt: g,
				durationMs: a.timing?.primaryPersistDurationMs ?? 0,
				counts: { persistedRangeCount: a.timing?.primaryPersistAttemptCount ?? 0 }
			}), !n() || a.status === "cancelled") {
				o = null, t.currentViewRefetchStatus = "idle";
				return;
			}
			let l = Date.now();
			v = l;
			try {
				let t = o;
				await e.extendVisibleUntilAfterRefetch(s, () => t === o), Ad({
					phase: "visible-range-state",
					startedAt: l,
					counts: { processedRangeCount: a.processedRangeCount }
				});
			} catch (e) {
				throw p = "visible-range-state", Ad({
					phase: "visible-range-state",
					startedAt: l,
					error: e,
					counts: { processedRangeCount: a.processedRangeCount }
				}), e;
			}
			let u = Date.now();
			v = u;
			try {
				t.searchQuery ? await e.rebuildSearchResultsThroughPage(t.searchPage, t.searchQuery) : t.loadedPosts.length === 0 || !t.hasNewerLocal ? await e.loadLatestVisiblePosts({ skipTotalCountRefresh: !0 }) : await e.reloadVisibleWindowFromCurrentNewest({ skipTotalCountRefresh: !0 }), Ad({
					phase: "visible-window-reload",
					startedAt: u,
					counts: { processedRangeCount: a.processedRangeCount }
				});
			} catch (e) {
				throw p = "visible-window-reload", Ad({
					phase: "visible-window-reload",
					startedAt: u,
					error: e,
					counts: { processedRangeCount: a.processedRangeCount }
				}), e;
			}
			_ = !0;
			let f = null;
			if (o === h && n() && r() === s && i() === c && t.loadedPosts.length > 0) {
				let a = Date.now();
				if (v = a, f = await e.repairCurrentViewRelations({
					ownerPubkeyHex: s,
					rxNostr: c,
					visiblePosts: t.loadedPosts,
					isActive: () => o === h && n() && r() === s && i() === c
				}), o !== h || f.status === "cancelled" || !n()) return;
				for (let e of Pd(f, a)) Ad(e);
			}
			if (o !== h || !n() || r() !== s || i() !== c) return;
			t.searchQuery || e.refreshTotalCount({ force: !0 }), o = null, t.currentViewRefetchStatus = "idle";
			let m = Fd(a, f?.savedDirectReplyCount ?? 0);
			t.currentViewRefetchMessageKey = m.key, t.currentViewRefetchMessageValues = m.values, d();
		} catch (a) {
			if (o !== h) return;
			if (!p) {
				let e = Id({
					error: a,
					activePhaseStartedAt: v,
					primaryRefetchReloadCompleted: _
				});
				Ad({
					phase: e.phase,
					startedAt: e.startedAt,
					error: a,
					errorClass: e.errorClass
				});
			}
			_ && !t.searchQuery && n() && r() === s && i() === c && e.refreshTotalCount({ force: !0 }), o = null, t.currentViewRefetchStatus = "idle", t.currentViewRefetchMessageKey = _ ? "postHistory.repairNoChanges" : "postHistory.repairFetchFailed", t.currentViewRefetchMessageValues = null, d();
		}
	}
	return {
		cancelCurrentViewRefetch: c,
		clearCurrentViewRefetchFeedback: u,
		scheduleCurrentViewRefetchMessageClearIfNeeded: d,
		refetchAroundCurrentView: p
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryVisibleRangeRelationRepairCoordinator.ts
var Rd = 3e5;
function zd(e, t, n) {
	let r = new Set(n.map((e) => e.eventId)), i = /* @__PURE__ */ new Map();
	for (let n of t) [
		1,
		42,
		1111
	].includes(n.kind) && n.pubkeyHex === e && r.has(n.eventId) && !i.has(n.eventId) && i.set(n.eventId, n);
	return Array.from(i.values());
}
function Bd(e, t, n, r, i = Rd) {
	return e.filter((e) => {
		if (n.has(e)) return !1;
		let a = t.get(e);
		return typeof a != "number" || r - a >= i;
	});
}
function Vd(e, t) {
	return {
		status: t ? e.status : "cancelled",
		savedDirectReplyCount: e.savedDirectReplyCount
	};
}
function Hd({ getShow: e, getPubkeyHex: t, getRxNostr: n, getRelayConfig: r, getLoadedPosts: i, onChildInteractionBadgeRefreshRequested: a, onQuoteVisibleRangeRefreshRequested: o, quoteVisibleRangeRepairExecutor: s, relationRepairService: c = Pr, triggerDeletionLifecycle: l = qn, now: u = Date.now }) {
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
			relationKinds: Ar,
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
			if (d === r && (d = null), t.status === "cancelled" || !o) return Vd(t, !1);
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
				...Vd(t, n()),
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
		let s = zd(r, e, i());
		if (s.length === 0) return;
		let c = s.map((e) => e.eventId);
		if (!a) return;
		let l = () => y(o, r, a);
		T("listing-older-reveal", c, a, l);
		let d = Bd(c, g, _, u()), f = new Set(d), m = s.filter((e) => f.has(e.eventId));
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
	function M() {
		m = !0, j();
	}
	return {
		repairCurrentView: E,
		repairJump: D,
		scheduleOlderRevealRepair: O,
		cancelCurrentViewRepair: k,
		resetOlderRevealRepairContext: A,
		resetAllRepairs: j,
		dispose: M
	};
}
function Ud(e) {
	if (!e || typeof e != "object") return !1;
	let t = e;
	return Number.isFinite(t.centerCreatedAt) && Number.isFinite(t.radiusSec) && (t.radiusSec ?? 0) > 0 && Number.isFinite(t.fetchedAt);
}
function Wd(e) {
	if (!e || typeof e != "object") return !1;
	let t = e;
	return typeof t.pubkeyHex == "string" && Array.isArray(t.anchors) && t.anchors.every((e) => Ud(e));
}
function Gd(e, t, n, r) {
	let i = t - Math.max(0, Math.trunc(n));
	return e.filter((e) => Number.isFinite(e.centerCreatedAt) && Number.isFinite(e.radiusSec) && e.radiusSec > 0 && Number.isFinite(e.fetchedAt) && e.fetchedAt >= i).sort((e, t) => t.fetchedAt - e.fetchedAt).slice(0, Math.max(1, Math.trunc(r)));
}
function Kd(e, t, n) {
	return e.findIndex((e) => Math.abs(e.centerCreatedAt - t) <= Math.max(e.radiusSec, n));
}
var qd = new class {
	db;
	now;
	constructor(e = We, t = Date.now) {
		this.db = e, this.now = t;
	}
	async getForPubkey(e, t = {}) {
		let n = t.ttlMs ?? 2592e6, r = t.maxCount ?? 200, i = await this.db.postHistoryJumpAnchors.get(e);
		return !i || !Wd(i.value) ? [] : Gd(i.value.anchors, this.now(), n, r);
	}
	async addForPubkey(e) {
		let t = e.ttlMs ?? 2592e6, n = e.maxCount ?? 200, r = Number.isFinite(e.fetchedAt) ? Math.trunc(e.fetchedAt ?? 0) : this.now(), i = Number.isFinite(e.centerCreatedAt) ? Math.trunc(e.centerCreatedAt) : 0, a = Number.isFinite(e.radiusSec) ? Math.max(1, Math.trunc(e.radiusSec ?? 1)) : 1, o = await this.getForPubkey(e.pubkeyHex, {
			ttlMs: t,
			maxCount: n
		}), s = Kd(o, i, a), c = [...o];
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
		let l = Gd(c, this.now(), t, n);
		return await this.db.transaction("rw", this.db.postHistoryJumpAnchors, this.db.postHistoryWriteGeneration, async () => {
			await yt(this.db, e.localWriteScope), await this.db.postHistoryJumpAnchors.put({
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
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryListingOlderBackfill.ts
function Jd(e) {
	return e.map((e) => e.event?.id).filter((e) => !!e);
}
function Yd({ currentPosts: e, olderPosts: t, anchorEventId: n = null, maxVisiblePosts: r, keepAbove: i }) {
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
function Xd(e, t) {
	let n = new Set(e.map((e) => e.eventId));
	return t.filter((e) => !n.has(e.eventId));
}
var Zd = 43200, Qd = [
	43200,
	86400,
	259200,
	604800,
	1209600,
	2592e3
], $d = 2592e3;
function ef({ status: e, changed: t, didCursorAdvanceOlder: n, hitLimit: r, continuedWithinWindow: i, attemptIndex: a, maxAttempts: o, totalVisibleAdded: s, targetVisibleAdded: c, exploredSeconds: l, maxExploreSeconds: u }) {
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
async function tf({ nextUntil: e, visibleOldestCreatedAt: t, pubkeyHex: n, getOldestCreatedAt: r, getNowSeconds: i = () => Math.floor(Date.now() / 1e3) }) {
	if (typeof e == "number") return e;
	if (typeof t == "number") return t;
	let a = await r(n);
	if (typeof a == "number") return a;
	let o = i();
	return Number.isFinite(o) ? o : null;
}
function nf(e, t) {
	let n = [];
	return e.hasMore && n.push("hasMore"), e.rawCount >= t && n.push("rawCount"), e.perRelayCounts.some((e) => e.rawCount >= t) && n.push("perRelayRawCount"), n;
}
function rf(e) {
	return typeof e.oldestCreatedAt == "number" ? e.oldestCreatedAt : e.events.reduce((e, t) => {
		let n = t.event.created_at;
		return Number.isFinite(n) && (e === null || n < e) ? Math.trunc(n) : e;
	}, null);
}
function af({ previousVisibleUntil: e, resolvedFetchUntil: t, usingBatchCursor: n, isSparseListing: r }) {
	return typeof e == "number" && !r() ? e : typeof t == "number" ? n ? t : typeof e == "number" ? Math.min(t, e) : t : e;
}
function of(e) {
	return Qd[Math.min(e, Qd.length - 1)];
}
function sf(e) {
	return Math.min(e + 1, Qd.length - 1);
}
function cf(e, t, n) {
	let r = nf(e, n).length > 0, i = rf(e), a = typeof i == "number" && i > t.since ? i - t.since : 0, o = e.status === "success" && r && typeof i == "number" && i > t.since && a >= 3600, s = t.since > 0 ? t.since : null, c = null;
	return o && typeof i == "number" && (s = i, c = t.since), {
		hitLimit: r,
		canContinueWithinWindow: o,
		nextUntilCursor: s,
		nextContinuationSince: c
	};
}
function lf({ nextUntilCursor: e, effectiveFetchUntil: t, currentVisibleCount: n, clickStartVisibleCount: r, exploredSeconds: i }) {
	return {
		didCursorAdvanceOlder: typeof e == "number" && e < t,
		totalVisibleAdded: Math.max(0, n - (r ?? n)),
		nextExploredSeconds: i + (typeof e == "number" ? Math.max(0, t - e) : Math.max(0, t))
	};
}
function uf({ nextExternalFloor: e, previousVisibleUntil: t, rangesBeforeFetch: n }) {
	return {
		connectedSavedRange: typeof e == "number" && typeof t == "number" && n.some((n) => n.until < t && e <= n.since),
		coverageAdvanced: typeof e == "number" && typeof t == "number" && e < t
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryTimelineCursor.ts
function df(e) {
	return e ? {
		eventId: e.eventId,
		postedAt: e.postedAt,
		createdAt: e.createdAt
	} : null;
}
function ff(e, t) {
	return !!e && !!t && e.postedAt === t.postedAt && e.createdAt === t.createdAt && e.eventId === t.eventId;
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryListingOlderBackfillController.ts
function pf(e, t) {
	return typeof t == "number" ? Q.countVisibleForPubkey(e, t) : Q.countForPubkey(e);
}
function mf(e) {
	let { state: t, olderBackfillSearch: n, getRelayConfig: r } = e;
	function i() {
		n.windowSeconds = Zd, n.nextUntil = null, n.consecutiveEmptyCount = 0, n.lastRange = null, n.continuationSince = null, n.exhausted = !1;
	}
	async function a(r, i = t.visibleUntil) {
		let a = e.coverage.getVisibleOldestCreatedAt();
		return (!e.coverage.hasLocalBrowsingRanges() || e.coverage.isSparseListingContext(t.visibleUntil)) && typeof a == "number" && (i === null ? t.hasJumpCacheAnchors : a < i) ? a : typeof n.nextUntil == "number" ? n.nextUntil : tf({
			nextUntil: t.nextUntil,
			visibleOldestCreatedAt: a,
			pubkeyHex: r,
			getOldestCreatedAt: (e) => Q.getOldestCreatedAt(e)
		});
	}
	function o(e) {
		if (!Number.isFinite(e)) return null;
		let t = Math.trunc(e) - 1;
		return t < 0 ? null : {
			since: (typeof n.continuationSince == "number" && n.continuationSince <= t ? n.continuationSince : null) ?? Math.max(0, t - n.windowSeconds),
			until: t,
			windowSeconds: n.windowSeconds
		};
	}
	function s(e, r) {
		n.nextUntil = e, n.continuationSince = r, n.exhausted = e === null, t.nextUntil = e, t.hasMoreRemote = e !== null;
	}
	function c(e, t, r) {
		nf(t, r);
		let i = rf(t);
		typeof i == "number" && i - e.since, t.rawCount ?? t.events.length, t.uniqueCount ?? t.events.length, typeof n.nextUntil == "number" && o(n.nextUntil);
	}
	async function l(i, o, l, u, d, f) {
		let p;
		for (; t.listingMode === "contiguous";) {
			let n = await e.coverage.readExternalVisibleUntil(i);
			if (!u()) return !1;
			let r = df(t.loadedPosts.at(-1)), a = r ? await Q.hasOlderVisiblePosts({
				pubkeyHex: i,
				visibleUntil: n,
				cursor: r
			}) : !1;
			if (!u()) return !1;
			let o = await e.coverage.readExternalVisibleUntil(i);
			if (!u()) return !1;
			if (t.listingMode !== "contiguous") break;
			if (!(o !== n || r && !ff(r, df(t.loadedPosts.at(-1))))) {
				if (p = n, a) {
					e.contiguousProgress.clear();
					let t = !1;
					return await e.reveal.commitViewport(async () => {
						u() && (t = await e.reveal.loadOlderVisiblePosts({
							anchorEventId: d.anchorEventId,
							relayFetchViewportCommit: d.viewportCommit,
							useContiguousProgress: !1
						}));
					}), t;
				}
				break;
			}
		}
		let m = $d, h = Math.max(1, Math.min(e.pageSize, 30)), g = null, _ = 0, v = 0, y = 0, b = null, x = null, S = !1, C = 0, w = null;
		for (;;) {
			_ += 1;
			let T = await e.coverage.readExternalVisibleUntil(i), E = b ?? await a(i, T), D = typeof b == "number", O = _ === 1 && p !== void 0 && p === T ? p : T;
			if (!u()) return S;
			let k = af({
				previousVisibleUntil: O,
				resolvedFetchUntil: E,
				usingBatchCursor: D,
				isSparseListing: () => e.coverage.hasLocalBrowsingRanges() ? e.coverage.isSparseListingContext(t.visibleUntil) : e.coverage.isSparseListingContext(O)
			});
			if (typeof k != "number") return S;
			let A = await e.coverage.readExternalContinuity(i);
			if (!u()) return S;
			let j = of(y), M = Qu(A, Math.trunc(k), j, x);
			if (!M) return s(null, null), S;
			let N = {
				...M,
				windowSeconds: j
			}, P = await pf(i, O);
			if (!u()) return S;
			g === null && (g = P);
			let ee = !1, F = {
				insertedCount: 0,
				updatedCount: 0,
				unchangedCount: 0,
				appliedDeletionCount: 0
			}, te = await e.createAuthoredScope(i, o, l);
			if (!u() || !te.isActive()) return S;
			let I = Vt.fetchLatest(o, {
				pubkeyHex: i,
				relayConfig: r(),
				reason: "older-backfill",
				limit: 150,
				timeoutMs: Zt,
				since: N.since,
				until: N.until
			});
			e.fetchSlot.set(I);
			let L = await I.promise;
			if (!u() || e.fetchSlot.get() !== I || (e.fetchSlot.set(null), !te.isActive() || L.status === "cancelled")) return S;
			if (L.events.length > 0 || L.relayFetchCoverage?.length) {
				let e = await Bn(L, te);
				if (e.applied === !1 || !te.isActive()) return S;
				F = e, ee = F.insertedCount + F.updatedCount > 0;
			}
			if (!u()) return S;
			let ne = e.coverage.getVisibleOldestCreatedAt(), R = typeof ne == "number" && (t.visibleUntil === null ? t.hasJumpCacheAnchors : ne < t.visibleUntil), z = R ? O : await e.coverage.updateVisibleUntilFromFetch(i, L);
			if (!u()) return S;
			let re = z, B = await pf(i, re);
			if (!u()) return S;
			let V = !1;
			if (R || (V = await e.contiguousProgress.reconcileAfterDatabaseChange(i, re, { preserveReachedVisibleCount: !0 })), await e.reveal.refreshSavedPostsOutsideVisibleRange(i, re, null, l), !u()) return S;
			let H = B > P, ie = cf(L, N, 150), { hitLimit: U, canContinueWithinWindow: ae, nextContinuationSince: W } = ie, oe = ie.nextUntilCursor;
			n.windowSeconds = j, n.lastRange = {
				...N,
				hitLimit: U
			}, L.status === "success" && L.events.length === 0 ? n.consecutiveEmptyCount += 1 : L.events.length > 0 && (n.consecutiveEmptyCount = 0);
			let se = await e.coverage.readExternalVisibleUntil(i);
			if (!u()) return S;
			typeof se == "number" && !R && (oe = se), s(oe, W), c(N, L, 150);
			let ce = !1, G = {
				loadedPostsBeforeLength: t.loadedPosts.length,
				loadedPostsAfterLength: t.loadedPosts.length,
				olderPostsLength: 0,
				visibleOldestBefore: t.loadedPosts.length > 0 ? t.loadedPosts[t.loadedPosts.length - 1]?.createdAt ?? null : null,
				visibleOldestAfter: t.loadedPosts.length > 0 ? t.loadedPosts[t.loadedPosts.length - 1]?.createdAt ?? null : null,
				didTrimForOlderAppend: !1,
				didDeferOlderPosts: !1,
				maxVisiblePosts: e.maxVisiblePosts
			};
			if (await e.reveal.commitViewport(async () => {
				u() && (t.searchQuery ? await e.reveal.rebuildSearchResultsThroughPage(t.searchPage, t.searchQuery) : (e.reveal.refreshTotalCount({ force: ee }), H || ee ? ce = t.sparseSource === "saved" ? await e.reveal.loadOlderSavedPosts(i, e.reveal.getLoadRequestId(), {
					anchorEventId: d.anchorEventId,
					relayFetchViewportCommit: d.viewportCommit
				}) : R ? await e.reveal.loadOlderSparsePosts(i, e.reveal.getLoadRequestId(), {
					anchorEventId: d.anchorEventId,
					relayFetchViewportCommit: d.viewportCommit
				}) : await e.reveal.loadOlderVisiblePosts({
					anchorEventId: d.anchorEventId,
					relayFetchViewportCommit: d.viewportCommit,
					metrics: G,
					reason: "normal-older-reveal",
					useContiguousProgress: !1,
					preserveContiguousProgressAfterDatabaseChange: V
				}) : await e.reveal.refreshTimelineAvailability(i)));
			}), !u()) return S;
			let le = ce || H || ee, ue = S || le, K = B, { didCursorAdvanceOlder: de, totalVisibleAdded: q, nextExploredSeconds: fe } = lf({
				nextUntilCursor: oe,
				effectiveFetchUntil: k,
				currentVisibleCount: K,
				clickStartVisibleCount: g,
				exploredSeconds: v
			}), pe = ef({
				status: L.status,
				changed: le,
				didCursorAdvanceOlder: de,
				hitLimit: U,
				continuedWithinWindow: ae,
				attemptIndex: _,
				maxAttempts: 6,
				totalVisibleAdded: q,
				targetVisibleAdded: h,
				exploredSeconds: fe,
				maxExploreSeconds: m
			}), { connectedSavedRange: me, coverageAdvanced: he } = uf({
				nextExternalFloor: se,
				previousVisibleUntil: O,
				rangesBeforeFetch: A
			}), ge = pe.shouldContinue && he && !t.hasOlderLocal && !me, _e = ge ? C + 1 : C;
			if (v = fe, ge) t.latestOlderBackfillUiResult = {
				changed: ue,
				didTrimForOlderAppend: G.didTrimForOlderAppend,
				didDeferOlderPosts: G.didDeferOlderPosts,
				loadedPostsBeforeLength: G.loadedPostsBeforeLength,
				loadedPostsAfterLength: G.loadedPostsAfterLength,
				maxVisiblePosts: G.maxVisiblePosts,
				autoRetryCount: _e,
				autoRetryReason: pe.reason,
				attemptIndex: _,
				maxAttempts: 6,
				clickStartVisibleCount: g ?? K,
				currentVisibleCount: K,
				totalVisibleAdded: q,
				targetVisibleAdded: h,
				shouldContinueForSmallBatch: ge,
				exploredSeconds: v,
				maxExploreSeconds: m
			}, C = _e, w = pe.reason, S = ue, b = oe, x = W, ae || (y = sf(y));
			else return w = pe.reason, S = ue, t.latestOlderBackfillUiResult = {
				changed: S,
				didTrimForOlderAppend: G.didTrimForOlderAppend,
				didDeferOlderPosts: G.didDeferOlderPosts,
				loadedPostsBeforeLength: G.loadedPostsBeforeLength,
				loadedPostsAfterLength: G.loadedPostsAfterLength,
				maxVisiblePosts: G.maxVisiblePosts,
				autoRetryCount: C,
				autoRetryReason: w,
				attemptIndex: _,
				maxAttempts: 6,
				clickStartVisibleCount: g ?? K,
				currentVisibleCount: K,
				totalVisibleAdded: q,
				targetVisibleAdded: h,
				shouldContinueForSmallBatch: ge,
				exploredSeconds: v,
				maxExploreSeconds: m
			}, L.status === "success" ? (f(!0), S) : (f(!1), S);
		}
	}
	return {
		resetOlderBackfillSearchState: i,
		fetchOlderFromRelaysForRequest: l
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryListingJumpController.ts
var hf = 259200, gf = 100;
function _f(e, t) {
	if (e.length === 0) return !0;
	let n = e[e.length - 1]?.createdAt;
	return !Number.isFinite(n) || (n ?? 0) > t;
}
function vf(e) {
	let { state: t, pageSize: n, maxVisiblePosts: r, getShow: i, getPubkeyHex: a, getRxNostr: o, getRelayConfig: s } = e;
	async function c(r) {
		e.clearContiguousProgress();
		let c = a();
		if (!c) return !1;
		let l = e.beginLoadRequest(), u = await e.refreshVisibleUntil(c), d = await Q.getVisibleChunkFromCreatedAt({
			pubkeyHex: c,
			visibleUntil: u,
			createdAt: r,
			limit: n
		});
		if (!i() || l !== e.getLoadRequestId()) return !1;
		if (d.length === 0) return e.refreshTotalCount(), t.loadedPosts = [], t.hasOlderLocal = !1, t.hasNewerLocal = !1, !1;
		if (!_f(d, r) || r <= 0) return e.refreshTotalCount(), t.listingMode = "contiguous", t.sparseSource = null, t.loadedPosts = d, e.resetOlderBackfillSearchState(), await e.refreshTimelineAvailability(c, d, l), !0;
		let f = await qd.hasNearbyAnchorForPubkey({
			pubkeyHex: c,
			targetCreatedAt: r
		});
		if (!i() || l !== e.getLoadRequestId()) return !1;
		if (f) {
			let a = await Q.getVisibleChunkFromCreatedAt({
				pubkeyHex: c,
				visibleUntil: u,
				createdAt: r,
				limit: n,
				query: { contiguous: !1 }
			});
			if (!i() || l !== e.getLoadRequestId()) return !1;
			if (!_f(a, r)) return e.refreshTotalCount(), t.listingMode = "sparse", t.sparseSource = "jump", t.loadedPosts = a, e.resetOlderBackfillSearchState(), await e.refreshTimelineAvailability(c, a, l), !0;
		}
		let p = o();
		if (!p) return e.refreshTotalCount(), t.listingMode = "contiguous", t.sparseSource = null, t.loadedPosts = d, e.resetOlderBackfillSearchState(), await e.refreshTimelineAvailability(c, d, l), !0;
		e.cancelCurrentSync();
		let m = e.beginFetchRequest();
		t.syncStatus = "syncing";
		let h = Math.max(0, r - hf), g = r, _ = await pt(We, c), v = await e.createAuthoredScope(c, p, m);
		if (!v.isActive()) return !1;
		let y = Vt.fetchLatest(p, {
			pubkeyHex: c,
			relayConfig: s(),
			reason: "repair-visible-range",
			limit: gf,
			since: h,
			until: g
		});
		e.setCurrentFetchTask(y);
		let b = await y.promise;
		if (!e.isCurrentFetchRequest(m) || e.getCurrentFetchTask() !== y) return !1;
		if (e.setCurrentFetchTask(null), !v.isActive() || b.status === "cancelled") return t.syncStatus = "idle", !1;
		if (b.events.length > 0 || b.relayFetchCoverage?.length) {
			if ((await Bn(b, v)).applied === !1 || !v.isActive()) return !1;
			await qd.addForPubkey({
				pubkeyHex: c,
				centerCreatedAt: r,
				radiusSec: hf,
				fetchedAt: b.fetchedAt,
				localWriteScope: {
					ownerPubkeyHex: c,
					expectedRevision: _,
					isActive: () => v.isActive()
				}
			}), t.hasJumpCacheAnchors = !0;
		}
		if (!i() || l !== e.getLoadRequestId()) return t.syncStatus = "idle", !1;
		let x = await Q.getVisibleChunkFromCreatedAt({
			pubkeyHex: c,
			visibleUntil: u,
			createdAt: r,
			limit: n,
			query: { contiguous: !1 }
		});
		return !i() || l !== e.getLoadRequestId() ? (t.syncStatus = "idle", !1) : (t.syncStatus = "idle", !_f(x, r) && (e.refreshTotalCount({ force: b.events.length > 0 }), t.listingMode = "sparse", t.sparseSource = "jump", t.loadedPosts = x, e.resetOlderBackfillSearchState(), await e.refreshTimelineAvailability(c, x, l), e.repairJump({
			ownerPubkeyHex: c,
			rxNostr: p,
			visiblePosts: x,
			isActive: () => i() && a() === c && o() === p && l === e.getLoadRequestId()
		}).catch(() => void 0), !0));
	}
	async function l(o) {
		e.clearContiguousProgress();
		let s = a();
		if (!s || !o) return !1;
		let c = e.beginLoadRequest(), l = await e.refreshVisibleUntil(s, c), u = (e) => Q.getVisibleChunkAroundEventId({
			pubkeyHex: s,
			visibleUntil: e,
			eventId: o,
			limit: r,
			keepAbove: n
		}), d = await u(l);
		if (!i() || c !== e.getLoadRequestId()) return !1;
		let f = d.some((e) => e.eventId === o), p = !1;
		return !f && typeof l == "number" && (d = await u(null), p = !0, !i() || c !== e.getLoadRequestId()) || !d.some((e) => e.eventId === o) ? !1 : (e.refreshTotalCount(), t.listingMode = p ? "sparse" : "contiguous", t.sparseSource = p ? "jump" : null, t.loadedPosts = d, t.hasOlderLocal = !1, t.hasNewerLocal = !1, e.resetOlderBackfillSearchState(), e.refreshTimelineAvailability(s, d, c).catch(() => void 0), !0);
	}
	return {
		jumpToCreatedAt: c,
		jumpToEventId: l
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryListingSearchController.ts
function yf(e) {
	let { state: t, pageSize: n } = e;
	function r(e, t) {
		let n = [...e], r = new Set(e.map((e) => e.eventId));
		for (let e of t) r.has(e.eventId) || (r.add(e.eventId), n.push(e));
		return n;
	}
	function i(n, r, i) {
		return n === e.getSearchLoadRequestId() && e.getShow() && e.getPubkeyHex() === i && r === t.searchQuery;
	}
	async function a(r, a, o, s = !1) {
		let c = e.getPubkeyHex();
		if (!c || !a) return null;
		let l = { items: null }, u = await yd.searchLocalPosts({
			pubkeyHex: c,
			query: a,
			page: r,
			pageSize: n,
			onProgress: s ? async (n) => {
				i(o, a, c) && (l.items = n.items, t.searchPosts = n.items, t.searchTotalCountKnown = !1, t.searchHasNext = !1, n.phase === "partial" && !e.hasCompletedFirstPostPaint() && await e.waitForFirstPostPaint(c, () => i(o, a, c), () => t.searchPosts.length > 0));
			} : void 0
		});
		if (!i(o, a, c)) return null;
		let d = l.items;
		return d !== null && d.length === u.items.length && u.items.every((e, t) => e === d[t]) ? {
			...u,
			items: t.searchPosts
		} : u;
	}
	async function o(o, s) {
		let c = e.getPubkeyHex();
		if (!c || !s) return t.searchPosts = [], t.searchTotalCount = 0, t.searchTotalCountKnown = !1, t.searchHasNext = !1, !1;
		let l = e.beginSearchLoadRequest(), u = Math.max(1, Math.trunc(o));
		e.setSearchPageLoading(!0), e.setSearchResultStatus("loading"), t.searchTotalCountKnown = !1;
		try {
			let o = await a(u, s, l, u === 1);
			if (!o) return !1;
			let d = gn(u, o.total, n);
			return d === u ? (t.searchTotalCount = o.total, t.searchTotalCountKnown = !0, t.searchPosts = u === 1 ? o.items : r(t.searchPosts, o.items), t.searchPage = d, t.searchHasNext = o.hasNext, e.setSearchResultStatus("ready"), !(!e.hasCompletedFirstPostPaint() && !await e.waitForFirstPostPaint(c, () => i(l, s, c), () => t.searchPosts.length > 0))) : (l === e.getSearchLoadRequestId() && i(l, s, c) && e.setSearchResultStatus("ready"), !1);
		} catch {
			return l === e.getSearchLoadRequestId() && e.setSearchResultStatus("failed"), !1;
		} finally {
			l === e.getSearchLoadRequestId() && e.setSearchPageLoading(!1);
		}
	}
	async function s(o, s, c = e.beginSearchLoadRequest()) {
		let l = e.getPubkeyHex();
		if (!l || !s) return !1;
		let u = Math.max(1, Math.trunc(o));
		e.setSearchPageLoading(!0), e.setSearchResultStatus("loading"), t.searchTotalCountKnown = !1;
		try {
			let o = await a(1, s, c, u === 1);
			if (!o) return !1;
			let d = gn(u, o.total, n), f = o.items, p = o;
			for (let e = 2; e <= d; e += 1) {
				let t = await a(e, s, c);
				if (!t) return !1;
				f = r(f, t.items), p = t;
			}
			return t.searchPosts = f, t.searchTotalCount = o.total, t.searchTotalCountKnown = !0, t.searchPage = d, t.searchHasNext = p.hasNext, e.setSearchResultStatus("ready"), !(!e.hasCompletedFirstPostPaint() && !await e.waitForFirstPostPaint(l, () => i(c, s, l), () => t.searchPosts.length > 0));
		} catch {
			return c === e.getSearchLoadRequestId() && e.setSearchResultStatus("failed"), !1;
		} finally {
			c === e.getSearchLoadRequestId() && e.setSearchPageLoading(!1);
		}
	}
	return {
		isCurrentSearchLoad: i,
		loadSearchPage: o,
		rebuildSearchResultsThroughPage: s
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryListingSnapshot.ts
var bf = {
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
}, xf = /* @__PURE__ */ new Map();
function Sf(e) {
	if (typeof e != "string") return null;
	let t = e.trim();
	return t.length > 0 ? t : null;
}
function Cf(e) {
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
function wf(e) {
	let t = Sf(e);
	return Cf(t ? xf.get(t) ?? bf : bf);
}
function Tf(e, t) {
	let n = Sf(e);
	n && xf.set(n, Cf(t));
}
function Ef() {
	xf.clear();
}
er(Ef);
function Df(e) {
	let t = Sf(e);
	t && xf.delete(t);
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryListingDeletion.ts
function Of(e, t, n, r) {
	return e.map((e) => e.eventId === t ? {
		...e,
		deletedAt: n,
		deletionEventId: r
	} : e);
}
function kf(e) {
	od(e), Df(e);
}
function Af(e) {
	ad(e, {
		currentPage: 1,
		searchPage: 1,
		searchInput: "",
		searchQuery: ""
	}), Tf(e, {
		...bf,
		totalCount: 0,
		totalCountKnown: !0,
		totalCountFailed: !1
	});
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/hooks/usePostHistoryListing.svelte.ts
var jf = Un([...et]);
function Mf({ getShow: e, getSessionOpen: t = e, getPubkeyHex: n, getRxNostr: r, getRelayConfig: i, getSessionScrollState: a = () => null, onSessionScrollStateInvalidated: o = () => {}, onSavedAuthoredPosts: s = () => void 0, onLocalHistoryChanged: c = (e) => e(), onChildInteractionBadgeRefreshRequested: l = () => void 0, onQuoteVisibleRangeRefreshRequested: u = () => void 0, quoteVisibleRangeRepairExecutor: d = void 0, pageSize: f = 50, searchDebounceMs: p = 250 }) {
	let m = id(n()), h = wf(n()), g = h.searchQuery === m.searchQuery && m.searchQuery.length > 0, _ = h.totalCountKnown ?? h.totalCount > 0, v = h.totalCountFailed ? "failed" : _ ? "ready" : "unknown", y = P({
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
	}), b = H(P(h.coverageAnchorCreatedAt ?? null)), x = H(P([])), S = H(P([])), C = H(P([])), T = null, E = null, D = H(P(Yt.getSessionGeneration())), k = U(() => Zu(F(x), F(S))), A = U(() => Zu(F(x), F(S), F(C))), M = null, N, ee = $t(i()), te = n(), I = r(), L = 0, R = !1, z = 0, B = !1, V = H(!1), ie = H(null), ae = null, W = 0, oe = null, se = 0, ce = H(!1), G = H("idle"), ue = !1, K = !1, de = !1, q = null, fe = H("idle"), pe = 0, he = Sf(n()), ge = H(P(he)), _e = null, ve = null, ye = null, be = 0, J = H(null), xe = H(!0), Y = H(!1), Se = Bt.localRelayUrl, Ce = r(), we = Yt.getSessionGeneration(), Te = H(!1), Ee = 0, De = Promise.resolve(), Oe = null, ke = H(!1), Ae = 0, X = null, je = null, Me = r(), Ne = g ? m.searchQuery : "", Pe = !g, Fe = P({
		windowSeconds: Zd,
		nextUntil: null,
		consecutiveEmptyCount: 0,
		lastRange: null,
		continuationSince: null,
		exhausted: !1
	}), Ie = Math.max(f * 3, f), { resetOlderBackfillSearchState: Le, fetchOlderFromRelaysForRequest: Z } = mf({
		state: y,
		olderBackfillSearch: Fe,
		pageSize: f,
		maxVisiblePosts: Ie,
		getRelayConfig: i,
		createAuthoredScope: (e, t, n) => Cn(e, t, n),
		fetchSlot: {
			get: () => ve,
			set: (e) => {
				ve = e;
			}
		},
		coverage: {
			readExternalVisibleUntil: yn,
			readExternalContinuity: $,
			updateVisibleUntilFromFetch: (e, t) => En(e, t),
			hasLocalBrowsingRanges: () => F(C).length > 0,
			isSparseListingContext: (e) => Pn(e),
			getVisibleOldestCreatedAt: () => F(lt)
		},
		contiguousProgress: {
			clear: It,
			reconcileAfterDatabaseChange: Mn
		},
		reveal: {
			getLoadRequestId: () => z,
			commitViewport: Mt,
			loadOlderVisiblePosts: tr,
			loadOlderSavedPosts: rr,
			loadOlderSparsePosts: nr,
			rebuildSearchResultsThroughPage: (e, t) => Ve(e, t),
			refreshTotalCount: (e) => zn(e),
			refreshTimelineAvailability: (e) => qn(e),
			refreshSavedPostsOutsideVisibleRange: Un
		}
	}), Re = Hd({
		getShow: e,
		getPubkeyHex: n,
		getRxNostr: r,
		getRelayConfig: i,
		getLoadedPosts: () => y.loadedPosts,
		onChildInteractionBadgeRefreshRequested: l,
		onQuoteVisibleRangeRefreshRequested: u,
		quoteVisibleRangeRepairExecutor: d
	}), { isCurrentSearchLoad: ze, loadSearchPage: Be, rebuildSearchResultsThroughPage: Ve } = yf({
		state: y,
		pageSize: f,
		getShow: e,
		getPubkeyHex: n,
		getSearchLoadRequestId: () => se,
		beginSearchLoadRequest: () => ++se,
		setSearchPageLoading: (e) => {
			O(ce, e, !0);
		},
		setSearchResultStatus: (e) => {
			O(G, e, !0);
		},
		hasCompletedFirstPostPaint: () => B,
		waitForFirstPostPaint: Ht
	}), { jumpToCreatedAt: He, jumpToEventId: Ge } = vf({
		state: y,
		pageSize: f,
		maxVisiblePosts: Ie,
		getShow: e,
		getPubkeyHex: n,
		getRxNostr: r,
		getRelayConfig: i,
		getLoadRequestId: () => z,
		beginLoadRequest: () => ++z,
		beginFetchRequest: () => ++Ae,
		isCurrentFetchRequest: Lt,
		getCurrentFetchTask: () => ve,
		setCurrentFetchTask: (e) => {
			ve = e;
		},
		cancelCurrentSync: Ot,
		clearContiguousProgress: It,
		refreshVisibleUntil: (e, t) => wn(e, t),
		createAuthoredScope: (e, t, n) => Cn(e, t, n),
		refreshTotalCount: (e) => zn(e),
		resetOlderBackfillSearchState: Le,
		refreshTimelineAvailability: (e, t, n) => qn(e, t, n),
		repairJump: (e) => Re.repairJump(e)
	}), Ke = U(() => y.searchQuery.length > 0), { cancelCurrentViewRefetch: qe, clearCurrentViewRefetchFeedback: Je, scheduleCurrentViewRefetchMessageClearIfNeeded: Xe, refetchAroundCurrentView: Ze } = Ld({
		state: y,
		getShow: e,
		getPubkeyHex: n,
		getRxNostr: r,
		getRelayConfig: i,
		canRefetchAroundCurrentView: () => F(yt),
		clearContiguousProgress: It,
		refreshVisibleUntil: (e) => wn(e),
		startLocalRepairRead: (e) => Ft("repair-visible-range", e),
		extendVisibleUntilAfterRefetch: Dn,
		rebuildSearchResultsThroughPage: (e, t) => Ve(e, t),
		loadLatestVisiblePosts: (e) => Jn(e),
		reloadVisibleWindowFromCurrentNewest: (e) => Yn(e),
		repairCurrentViewRelations: (e) => Re.repairCurrentView(e),
		cancelCurrentViewRelationRepair: () => Re.cancelCurrentViewRepair(),
		refreshTotalCount: (e) => zn(e)
	}), Qe = U(() => y.currentViewRefetchStatus === "refetching"), $e = U(() => F(Ke) ? y.searchPosts : y.loadedPosts), tt = U(() => F(Ke) ? y.searchTotalCount : y.totalCount), nt = U(() => !F(Qe) && F(Ke) && y.searchPage > 1), it = U(() => F(nt)), at = U(() => !F(Qe) && !F(ce) && F(Ke) && y.searchHasNext), ot = U(() => !F(Qe) && (F(Ke) ? !F(ce) && y.searchHasNext : y.hasOlderLocal)), st = U(() => !F(Qe) && !F(Ke) && y.hasNewerLocal), ct = U(() => !F(Ke) && !F(Qe) && (y.listingMode === "sparse" || y.hasNewerLocal)), lt = U(() => F($e).length > 0 ? F($e)[F($e).length - 1]?.createdAt ?? null : null), ut = U(() => !F(Ke) && !F(Qe) && y.hasOlderLocal && (y.listingMode === "sparse" || !(typeof F(lt) == "number" && (y.visibleUntil === null ? y.hasJumpCacheAnchors : F(lt) < y.visibleUntil)))), ft = U(() => !F(Ke) && !!n() && !F(Qe) && (Oe !== null || y.syncStatus !== "syncing" && y.syncStatus !== "older-syncing") && (!!r() && !F(Te) && !Fe.exhausted || !!Bt.localRelayUrl && F(D) === Yt.getSessionGeneration() && !F(Y) && F(xe) && Yt.isConfigured(n()))), mt = U(() => !F(Ke) && y.syncStatus === "older-syncing"), gt = U(() => !F(Ke) && (y.syncStatus === "syncing" || y.syncStatus === "older-syncing")), _t = U(() => !F(Ke) && y.listingMode === "contiguous" && y.loadedPosts.length > 0 && !y.hasOlderLocal && y.syncStatus !== "syncing"), vt = U(() => !F(Ke) && y.syncStatus !== "syncing" && y.listingMode === "contiguous" && typeof y.visibleUntil == "number" && y.loadedPosts.length > 0 && !y.hasOlderLocal && y.hasSavedPostsOutsideVisibleRange), yt = U(() => !!n() && !!r() && !F(Ke) && y.loadedPosts.length > 0 && !F(Qe) && y.syncStatus !== "syncing" && y.syncStatus !== "older-syncing"), bt = U(() => F(Ke) || y.syncStatus === "idle" ? null : y.syncStatus === "syncing" || y.syncStatus === "older-syncing" ? "postHistory.syncing" : y.syncStatus === "synced" ? "postHistory.synced" : y.syncStatus === "no-more" ? null : "postHistory.syncFailed"), St = U(() => !F(Ke) && (y.syncStatus === "syncing" || y.syncStatus === "older-syncing")), Ct = U(() => F(St) || F(Qe)), wt = U(() => y.currentViewRefetchStatus === "refetching" ? "postHistory.repairing" : y.currentViewRefetchMessageKey), Tt = U(() => y.currentViewRefetchStatus === "refetching" ? null : y.currentViewRefetchMessageValues);
	function Ot() {
		O(ke, !1), Oe?.resolve(!1), Oe = null, Ee += 1, O(Te, !1), O(Y, !1), be += 1, ye?.cancel(), ye = null, M = null, N = void 0, Ae += 1, ve?.cancel(), ve = null, y.syncStatus === "older-syncing" && (y.syncStatus = "idle");
	}
	function At(e, t, n = !1) {
		O(ke, n, !0), Oe?.resolve(!1);
		let r, i = new Promise((e) => {
			r = e;
		}), a = {
			pending: t,
			succeeded: !1,
			changed: !1,
			resolve: r,
			promise: i
		};
		return Oe = a, y.syncStatus = e, a;
	}
	function jt(t, n, r) {
		--t.pending, t.succeeded ||= n, t.changed ||= n && r, (n || t.pending === 0) && t.resolve(t.changed), Oe === t && !R && e() && (t.succeeded ? y.syncStatus = t.changed ? "synced" : "idle" : t.pending === 0 && (y.syncStatus = "failed"), Wt());
	}
	function Mt(e) {
		let t = De.then(e);
		return De = t.catch(() => void 0), t;
	}
	function Pt() {
		be += 1, ye?.cancel(), ye = null, O(Y, !1), O(C, [], !0), T = null, O(J, null), O(xe, !0), It();
	}
	function Ft(t, i = {}, a = {}) {
		let o = n();
		if (R || !e() || !o || !Yt.isConfigured(o)) return null;
		if (ye) return ye;
		if (t === "older-backfill" && !F(xe)) return null;
		let l = ++be, u = r(), d = Bt.localRelayUrl, p = Yt.getSessionGeneration(), m = F(J), h = () => !R && e() && n() === o && r() === u && l === be && Bt.localRelayUrl === d && Yt.getSessionGeneration() === p, g = Yt.read({
			pubkeyHex: o,
			reason: t,
			...t === "older-backfill" && m === null ? {} : i,
			limit: t === "dialog-open-refresh" ? 30 : t === "repair-visible-range" ? 250 : 150,
			targets: y.loadedPosts.flatMap((e) => me(e.rawEvent) ? [e.rawEvent] : []),
			isActive: h
		});
		O(Y, !0);
		let _ = {
			cancel: g.cancel,
			promise: g.promise.then(async (e) => {
				if (!e || !h() || e.sessionGeneration !== p || await xt.getLocalRevision(o) !== e.localRevision || !h()) return null;
				t !== "repair-visible-range" && (t !== "dialog-open-refresh" || m === null) && (O(xe, e.hasMore && (t !== "older-backfill" || m === null || e.nextUntil !== null && e.nextUntil < m), !0), e.nextUntil !== null && O(J, Math.min(F(J) ?? e.nextUntil, e.nextUntil), !0));
				let n = !1;
				return await Mt(() => h() ? c(async () => {
					if (!h() || await xt.getLocalRevision(o) !== e.localRevision || !h()) return;
					T = e.localRevision;
					let r = Zu(F(C), e.browsingRanges);
					if (n = JSON.stringify(r) !== JSON.stringify(F(C)), O(C, r, !0), It(), F(b) === null) {
						let e = await Q.getLatestVisibleChunk({
							pubkeyHex: o,
							visibleUntil: null,
							limit: f
						});
						if (!h()) return;
						O(b, e.at(-1)?.createdAt ?? null, !0);
					}
					if (await wn(o), h()) {
						if (t === "older-backfill" && y.loadedPosts.length) await tr({
							anchorEventId: a.anchorEventId,
							relayFetchViewportCommit: a.viewportCommit,
							useContiguousProgress: !1
						});
						else if (!y.loadedPosts.length || y.loadedPosts.length <= f && !y.hasNewerLocal && y.sparseSource === null) await Jn({ forceTotalCount: !0 });
						else {
							let e = await Promise.all(y.loadedPosts.map((e) => Q.getByEventId(e.eventId)));
							if (!h()) return;
							y.loadedPosts = e.flatMap((e) => e?.pubkeyHex === o ? [e] : []);
						}
						h() && (zn({ force: !0 }), await qn(o), h() && await Un(o, y.visibleUntil));
					}
				}) : Promise.resolve()), !h() || await xt.getLocalRevision(o) !== e.localRevision ? null : (h() && e.eventIds.length && await s(e.eventIds), {
					...e,
					changed: e.changed || n
				});
			}).catch(() => null).finally(() => {
				ye === _ && (ye = null, O(Y, !1));
			})
		};
		return ye = _, _;
	}
	function It() {
		X = null;
	}
	function Lt(e) {
		return e === Ae;
	}
	function Rt(t, r) {
		return e() && n() === t && r === z;
	}
	function zt() {
		B = !1, O(V, !1), O(ie, null), ae = null;
	}
	async function Ht(e, t, n) {
		return await ne(), t() ? B ? (O(ie, Sf(e), !0), !0) : n() ? (await new Promise((e) => {
			requestAnimationFrame(() => requestAnimationFrame(() => e()));
		}), t() ? (B = !0, O(ie, Sf(e), !0), O(V, !0), !0) : !1) : (B = !0, O(ie, Sf(e), !0), O(V, !0), !0) : !1;
	}
	function Ut() {
		je !== null && (clearTimeout(je), je = null);
	}
	function Wt() {
		Ut(), (y.syncStatus === "synced" || y.syncStatus === "failed") && (je = setTimeout(() => {
			(y.syncStatus === "synced" || y.syncStatus === "failed") && (y.syncStatus = "idle"), je = null;
		}, 3500));
	}
	function Xt() {
		se += 1, O(ce, !1), O(G, "idle"), yd.clearCache?.(), zt(), y.searchInput = "", y.searchQuery = "", y.searchPage = 1, y.searchPosts = [], y.searchTotalCount = 0, y.searchTotalCountKnown = !1, y.searchHasNext = !1, Ne = "", en(), tn();
	}
	function Zt() {
		It(), In(), y.loadedPosts = [], Fn({
			known: !1,
			status: "unknown"
		}), y.currentPage = 1, y.syncStatus = "idle", y.hasMoreRemote = !1, y.nextUntil = null, y.lastDialogOpenRefreshAt = null, y.visibleUntil = null, O(b, null), O(x, [], !0), O(S, [], !0), y.hasJumpCacheAnchors = !1, y.hasOlderLocal = !1, y.hasNewerLocal = !1, y.listingMode = "contiguous", y.sparseSource = null, y.hasSavedPostsOutsideVisibleRange = !1, y.latestOlderBackfillUiResult = null, Xt();
	}
	function Qt() {
		let e = Sf(n());
		return !!e && e === F(ge);
	}
	function en() {
		Qt() && ad(n(), {
			searchInput: y.searchInput,
			searchQuery: y.searchQuery,
			currentPage: y.currentPage,
			searchPage: y.searchPage
		});
	}
	function tn() {
		Qt() && Tf(n(), {
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
			coverageAnchorCreatedAt: F(b),
			hasJumpCacheAnchors: y.hasJumpCacheAnchors,
			hasOlderLocal: y.hasOlderLocal,
			hasNewerLocal: y.hasNewerLocal
		});
	}
	function rn(e) {
		O(ge, Sf(e), !0);
	}
	function an() {
		Pt(), O(b, null), O(x, [], !0), O(S, [], !0), It(), In(), Re.resetOlderRevealRepairContext(), y.loadedPosts = [], y.searchPosts = [], Fn({
			count: 0,
			known: !0,
			status: "ready"
		}), y.searchTotalCount = 0, y.searchTotalCountKnown = !1, y.searchHasNext = !1, y.currentPage = 1, y.searchPage = 1, y.hasMoreRemote = !1, y.nextUntil = null, y.lastDialogOpenRefreshAt = null, y.visibleUntil = null, y.hasJumpCacheAnchors = !1, y.hasOlderLocal = !1, y.hasNewerLocal = !1, y.listingMode = "contiguous", y.sparseSource = null, y.hasSavedPostsOutsideVisibleRange = !1, y.syncStatus = "idle", Le(), Je(), Ut(), Xt(), ue = !0;
	}
	function on() {
		return y.listingMode === "sparse" && (y.sparseSource === "saved" || y.sparseSource === "jump");
	}
	function sn() {
		if (!on()) return !1;
		let e = n();
		return Zt(), Le(), Je(), Ut(), od(e), Tf(e, { ...bf }), !0;
	}
	function cn() {
		It(), z += 1, se += 1, O(ce, !1), O(G, "idle");
	}
	function ln() {
		L++, Ot(), qe(), cn(), In(), pe++, F(fe) === "loading" && (O(fe, "idle"), de = !1), y.syncStatus = "idle", Je(), Ut(), Re.resetOlderRevealRepairContext();
	}
	function un() {
		Pt(), L += 1;
		let e = sn();
		return Ot(), qe(), cn(), In(), yd.clearCache?.(), Re.resetOlderRevealRepairContext(), e;
	}
	function dn() {
		Pt(), L += 1, sn(), Ot(), qe(), cn(), In(), yd.clearCache?.(), Re.resetOlderRevealRepairContext(), y.syncStatus = "idle", Le(), Je(), Ut(), ue = !1, K = !1, de = !1, q = null, pe += 1, O(fe, "idle"), Pe = !1;
	}
	function fn(e) {
		let t = _n(e);
		y.hasMoreRemote = t, y.nextUntil = t ? e.nextUntil : null;
	}
	function pn(e) {
		_n(e) && y.nextUntil === null && (y.hasMoreRemote = !0, y.nextUntil = e.nextUntil);
	}
	async function mn(e) {
		let t = hn();
		return We.transaction("r", Et(We), async () => {
			let n = await pt(We, e);
			return [
				await xt.get(e, jf),
				await cu.get(e, jf),
				n,
				t ? await ht.get(e, jf, t) : null,
				t
			];
		});
	}
	function hn() {
		return le().runtimeKind === "standalone" ? Nt(Bt.localRelayUrl ?? "") : null;
	}
	function gn(e) {
		e && e.localRelayUrl === hn() && e.localRevision === E && (O(C, Zu(T === e.localRevision ? F(C) : [], e.browsingRanges), !0), T = e.localRevision, e.resumeHint && O(J, F(J) === null ? e.resumeHint.nextUntil : Math.min(F(J), e.resumeHint.nextUntil), !0));
	}
	async function $(t) {
		if (R) return [];
		let r = L, a = Kt(i()), [o, s, c, l, u] = await mn(t), d = Ye(o.relays, a), f = await xt.getLocalRevision(t);
		return f !== c || f !== s.localRevision || R || r !== L || !e() || n() !== t ? [] : (O(x, d, !0), O(S, s.ranges, !0), E !== null && E !== f && Pt(), E = f, u === hn() && gn(l), Zu(d, s.ranges));
	}
	async function vn(e) {
		return Zu(await $(e), T === E && hn() ? F(C) : []);
	}
	async function yn(e) {
		return F(b) === null ? xn(e) : rt(await $(e), F(b));
	}
	async function bn(e) {
		return (await Rn.get(e, jf))?.visibleUntil ?? null;
	}
	async function xn(e) {
		if (F(b) === null) return bn(e);
		let t = F(b);
		return rt(await vn(e), t);
	}
	async function Sn(e) {
		let t = y.loadedPosts[0]?.createdAt;
		if (typeof t == "number") {
			let n = dt(await $(e)).find((e) => e.since <= t && e.until >= t)?.since;
			if (typeof n == "number") return n;
		}
		return X?.pubkeyHex === e && typeof X.visibleUntil == "number" ? X.visibleUntil : wn(e);
	}
	async function Cn(t, a, o, s = [...et]) {
		let c = i(), l = L;
		return Vn({
			ownerPubkeyHex: t,
			rxNostr: a,
			kinds: s,
			relayConfig: c,
			getRelayConfig: i,
			isActive: () => l === L && Lt(o) && e() && n() === t && r() === a
		});
	}
	async function wn(t, r = null) {
		let i = L, a = await xn(t);
		return !R && i === L && e() && n() === t && (r === null || r === z) && (y.visibleUntil = a), a;
	}
	async function Tn(t, r = null) {
		let i = (await qd.getForPubkey(t, { maxCount: 1 })).length > 0;
		return e() && n() === t && (r === null || r === z) && (y.hasJumpCacheAnchors = i), i;
	}
	async function En(t, r) {
		let i = L, a = Ae, o = () => !R && i === L && a === Ae && e() && n() === t;
		if (F(b) === null) {
			let e = await Q.getLatestVisibleChunk({
				pubkeyHex: t,
				visibleUntil: null,
				limit: f
			});
			if (!o()) return null;
			O(b, e.length ? Math.min(...e.map((e) => e.createdAt)) : null, !0);
		}
		let s = await xn(t);
		return o() && (y.visibleUntil = s), s;
	}
	async function Dn(t, r) {
		let i = L, a = await xn(t);
		return !R && i === L && r() && e() && n() === t && (y.visibleUntil = a), a;
	}
	async function On(e, t) {
		if (typeof t == "number") return Q.countVisibleForPubkey(e, t);
		let n = oe;
		return n?.pubkeyHex === e && (await n.promise, y.totalCountKnown) || y.totalCountKnown ? y.totalCount : Q.countForPubkey(e);
	}
	function kn(e, t) {
		return F(Ke) || y.listingMode !== "contiguous" || y.sparseSource !== null || n() !== e || y.visibleUntil !== t.visibleUntil ? !1 : ff(df(y.loadedPosts[y.loadedPosts.length - 1]), t.oldestCursor);
	}
	async function An(t, r) {
		let i = X;
		if (!i || i.pubkeyHex !== t) return null;
		let a = await wn(t, r);
		if (!e() || n() !== t || r !== z || !kn(t, i)) return null;
		let [o, s] = await Promise.all([Promise.resolve(Dt(t)), On(t, a)]);
		return !kn(t, i) || o !== i.revision || s !== i.totalVisibleCount ? null : i;
	}
	async function jn(t, r, i, a, o) {
		if (It(), i.length === 0 || !e() || n() !== t || r !== z || y.listingMode !== "contiguous" || y.sparseSource !== null) return !1;
		let s = await On(t, a), c = y.visibleUntil, l = Dt(t);
		if (l !== o || c !== a || !e() || n() !== t || r !== z || y.listingMode !== "contiguous" || y.sparseSource !== null || y.loadedPosts[0]?.eventId !== i[0]?.eventId || y.loadedPosts[y.loadedPosts.length - 1]?.eventId !== i[i.length - 1]?.eventId) return !1;
		let u = df(i[i.length - 1]);
		return u ? (X = {
			pubkeyHex: t,
			visibleUntil: a,
			revision: l,
			totalVisibleCount: s,
			reachedVisibleCount: i.length,
			oldestCursor: u,
			latestEventId: i[0]?.eventId ?? null
		}, !0) : !1;
	}
	async function Mn(t, r, i) {
		let a = X;
		if (!a || a.pubkeyHex !== t || F(Ke) || y.listingMode !== "contiguous" || y.sparseSource !== null || n() !== t || !i.preserveReachedVisibleCount) return !1;
		let o = df(y.loadedPosts[y.loadedPosts.length - 1]);
		if (!ff(o, a.oldestCursor)) return !1;
		let s = await On(t, r);
		return !e() || n() !== t || !ff(o, df(y.loadedPosts[y.loadedPosts.length - 1])) ? !1 : (X = {
			...a,
			visibleUntil: r,
			revision: Dt(t),
			totalVisibleCount: s
		}, !0);
	}
	async function Nn() {
		It(), await Jn();
	}
	function Pn(e, t = y.loadedPosts) {
		if (y.listingMode === "sparse" || y.hasJumpCacheAnchors) return !0;
		let n = t.length > 0 ? t[t.length - 1]?.createdAt ?? null : null;
		return typeof n == "number" ? e === null ? y.hasJumpCacheAnchors : n < e : !1;
	}
	function Fn({ count: e, known: t, status: n }) {
		typeof e == "number" && (y.totalCount = e), y.totalCountKnown = t, y.totalCountStatus = n;
	}
	function In() {
		W += 1, oe = null, Fn({
			known: y.totalCountKnown,
			status: y.totalCountKnown ? "ready" : "unknown"
		});
	}
	function Ln(t, { force: r = !1 } = {}) {
		if (!e() || n() !== t || !r && oe?.pubkeyHex === t) return;
		let i = ++W;
		Fn({
			known: y.totalCountKnown,
			status: y.totalCountKnown ? "refreshing" : "loading"
		}), oe = {
			requestId: i,
			pubkeyHex: t,
			promise: Q.countForPubkey(t).then((r) => {
				i === W && e() && n() === t && Fn({
					count: r,
					known: !0,
					status: "ready"
				});
			}).catch(() => {
				i === W && e() && n() === t && Fn({
					known: y.totalCountKnown,
					status: "failed"
				});
			}).finally(() => {
				oe?.requestId === i && (oe = null);
			})
		};
	}
	function zn({ force: t = !1 } = {}) {
		let r = n();
		r && e() && Ln(r, { force: t });
	}
	async function Un(t, r, i = null, a = null) {
		let o = typeof r == "number" && await Q.hasPostsBeforeCreatedAt(t, r);
		!e() || n() !== t || i !== null && i !== z || a !== null && !Lt(a) || (y.hasSavedPostsOutsideVisibleRange = o);
	}
	function Gn(e, t) {
		return e.length <= Ie ? e : t === "older" ? e.slice(e.length - Ie) : e.slice(0, Ie);
	}
	function Kn(e, t, n) {
		return Yd({
			currentPosts: e,
			olderPosts: t,
			anchorEventId: n,
			maxVisiblePosts: Ie,
			keepAbove: f
		});
	}
	async function qn(t, r = y.loadedPosts, i = null, a = {}) {
		let o = L, s = Ae;
		if (R || !e() || a.deferDuringOlderRelayFetch && F(mt)) return;
		if (r.length === 0) {
			e() && n() === t && (i === null || i === z) && (y.hasOlderLocal = !1, y.hasNewerLocal = !1);
			return;
		}
		let c = df(r[0]), l = df(r[r.length - 1]), u = y.visibleUntil, d = y.sparseSource === "saved" && typeof u == "number" ? c ? Q.getSparseChunk({
			pubkeyHex: t,
			visibleUntil: u,
			cursor: c,
			direction: "newer",
			limit: 1
		}) : Promise.resolve([]) : c ? Q.getNewerVisibleChunk({
			pubkeyHex: t,
			visibleUntil: u,
			cursor: c,
			limit: 1
		}) : Promise.resolve([]), f = a.skipOlderCheck ? Promise.resolve([]) : y.sparseSource === "saved" && typeof u == "number" ? l ? Q.getSparseChunk({
			pubkeyHex: t,
			visibleUntil: u,
			cursor: l,
			direction: "older",
			limit: 1
		}) : Promise.resolve([]) : y.sparseSource === "jump" ? l ? Q.getOlderVisibleChunk({
			pubkeyHex: t,
			visibleUntil: null,
			cursor: l,
			limit: 1
		}) : Promise.resolve([]) : l ? Q.getOlderVisibleChunk({
			pubkeyHex: t,
			visibleUntil: u,
			cursor: l,
			limit: 1
		}) : Promise.resolve([]), [p, m] = await Promise.all([d, f]), h = r[0]?.eventId ?? null, g = r[r.length - 1]?.eventId ?? null, _ = y.loadedPosts, v = !R && e() && n() === t, b = i === null || i === z, x = b ? i : null;
		if (_.length !== r.length || (_[0]?.eventId ?? null) !== h || (_[_.length - 1]?.eventId ?? null) !== g || u !== y.visibleUntil) return a.retried || !v ? void 0 : qn(t, _, x, {
			...a,
			retried: !0
		});
		let S = v && b, C = a.deferDuringOlderRelayFetch && (F(mt) || s !== Ae);
		if (o !== L && !a.retried && v && !C) return qn(t, y.loadedPosts, x, {
			...a,
			retried: !0
		});
		if (!b && !a.retried && v && !C) return qn(t, y.loadedPosts, null, {
			...a,
			retried: !0
		});
		S && o === L && !C && (y.hasNewerLocal = p.length > 0, a.skipOlderCheck || (y.hasOlderLocal = m.length > 0));
	}
	async function Jn({ forceTotalCount: t = !1, skipTotalCountRefresh: r = !1, skipOlderAvailabilityCheck: i = !1, awaitProgress: a = !1, awaitAvailability: o = !1 } = {}) {
		It();
		let s = n();
		if (!s) {
			O(ge, null), Zt();
			return;
		}
		let c = ++z, l = await wn(s, c), u = Dt(s), d = await Q.getLatestVisibleChunk({
			pubkeyHex: s,
			limit: f,
			visibleUntil: l
		});
		if (!e() || n() !== s || c !== z) return;
		rn(s), y.listingMode = "contiguous", y.sparseSource = null, y.loadedPosts = d, y.hasNewerLocal = !1;
		let p = d.length > 0 ? Math.min(...d.map((e) => e.createdAt)) : null, m = F(b) !== p;
		if (O(b, p, !0), !await Ht(s, () => Rt(s, c), () => y.loadedPosts.length > 0) || m && (l = await wn(s, c), !Rt(s, c))) return;
		r || zn({ force: t }), Tn(s, c).catch(() => {});
		let h = jn(s, c, d, l, u), g = !1;
		a ? g = await h.catch(() => (It(), !1)) : h.catch(() => {
			It();
		});
		let _ = i && g;
		i && !_ ? y.hasOlderLocal = !1 : _ && X && (y.hasOlderLocal = X.totalVisibleCount > X.reachedVisibleCount);
		let v = Un(s, l, c).catch(() => {}), x = qn(s, d, c, { skipOlderCheck: _ }).then(() => {
			e() && n() === s && c === z && ur(s, d);
		}).catch(() => {});
		o && await Promise.all([v, x]);
	}
	async function Yn({ skipTotalCountRefresh: t = !1 } = {}) {
		It();
		let r = n();
		if (!r || y.loadedPosts.length === 0) {
			await Jn({ skipTotalCountRefresh: t });
			return;
		}
		let i = y.loadedPosts[0], a = df(i);
		if (!a) {
			await Jn({ skipTotalCountRefresh: t });
			return;
		}
		let o = ++z, s = await wn(r), c = Pn(s, y.loadedPosts) ? await Q.getVisibleChunkFromCreatedAt({
			pubkeyHex: r,
			visibleUntil: s,
			createdAt: i.createdAt,
			limit: y.loadedPosts.length,
			query: { contiguous: !1 }
		}) : await (y.loadedPosts.length > 1 ? Q.getOlderVisibleChunk({
			pubkeyHex: r,
			visibleUntil: s,
			cursor: a,
			limit: y.loadedPosts.length - 1
		}).then((e) => [i, ...e]) : Promise.resolve([i]));
		e() && o === z && (y.loadedPosts = c, await Ht(r, () => Rt(r, o), () => y.loadedPosts.length > 0) && (t || zn(), await qn(r, c, o)));
	}
	function Xn(e, t) {
		return !!e && (!t || e.requestedAt > t.savedAt);
	}
	async function Zn(t, r) {
		It();
		let i = n(), a = y.loadedPosts, s = df(a[0]), c = df(a[a.length - 1]);
		if (!i || !e() || a.length === 0) return;
		let l = ++z, u = await wn(i), [d, f] = await Promise.all([s ? Q.getNewerVisibleChunk({
			pubkeyHex: i,
			visibleUntil: u,
			cursor: s,
			limit: 1
		}) : Promise.resolve([]), c ? Q.getOlderVisibleChunk({
			pubkeyHex: i,
			visibleUntil: u,
			cursor: c,
			limit: 1
		}) : Promise.resolve([])]);
		e() && l === z && (Xn(r, t) ? (o(), await Jn()) : (y.hasNewerLocal = d.length > 0, y.hasOlderLocal = f.length > 0, await Ht(i, () => Rt(i, l), () => y.loadedPosts.length > 0) && (zn(), await qn(i, y.loadedPosts, l), Rt(i, l) && ur(i, y.loadedPosts))));
	}
	function Qn() {
		let e = a();
		return !e || e.mode !== "normal" || e.pubkeyHex !== n() ? null : e;
	}
	function $n(e) {
		return F(Ke) || y.loadedPosts.length === 0 || !e ? !1 : y.loadedPosts.some((t) => t.eventId === e.anchor.eventId);
	}
	async function er(t) {
		It();
		let r = n();
		if (!r || !e()) return !1;
		let i = ++z, a = await wn(r), s = await Q.getVisibleChunkAroundEventId({
			pubkeyHex: r,
			visibleUntil: a,
			eventId: t.anchor.eventId,
			limit: Ie,
			keepAbove: f
		});
		return !e() || i !== z ? !1 : s.length === 0 ? (o(), await Jn(), !1) : (y.loadedPosts = s, !await Ht(r, () => Rt(r, i), () => y.loadedPosts.length > 0) || (zn(), await qn(r, s, i), !Rt(r, i)) ? !1 : (ur(r, s), !0));
	}
	async function tr(t = {}) {
		let r = y.loadedPosts, i = t.metrics;
		i && (i.loadedPostsBeforeLength = r.length, i.loadedPostsAfterLength = r.length, i.olderPostsLength = 0, i.visibleOldestBefore = r.length > 0 ? r[r.length - 1]?.createdAt ?? null : null, i.visibleOldestAfter = r.length > 0 ? r[r.length - 1]?.createdAt ?? null : null, i.didTrimForOlderAppend = !1, i.didDeferOlderPosts = !1, i.maxVisiblePosts = Ie);
		let a = n(), o = df(y.loadedPosts[y.loadedPosts.length - 1]);
		if (!a || !o) return await Jn(), i && (i.loadedPostsAfterLength = y.loadedPosts.length, i.olderPostsLength = y.loadedPosts.length, i.visibleOldestAfter = y.loadedPosts.length > 0 ? y.loadedPosts[y.loadedPosts.length - 1]?.createdAt ?? null : null), y.loadedPosts.length > 0;
		let s = t.useContiguousProgress !== !1 && X !== null, c = t.preserveContiguousProgressAfterDatabaseChange ? X : null, l = ++z, u = s ? await An(a, l) : null;
		if (s && !u) return await Nn(), i && (i.loadedPostsAfterLength = y.loadedPosts.length, i.visibleOldestAfter = y.loadedPosts.length > 0 ? y.loadedPosts[y.loadedPosts.length - 1]?.createdAt ?? null : null), !1;
		let d = u?.visibleUntil ?? await wn(a, l), p = u ? Math.max(0, u.totalVisibleCount - u.reachedVisibleCount) : f;
		if (u && p === 0) return y.hasOlderLocal = !1, i && (i.loadedPostsAfterLength = y.loadedPosts.length, i.visibleOldestAfter = y.loadedPosts.length > 0 ? y.loadedPosts[y.loadedPosts.length - 1]?.createdAt ?? null : null), await qn(a, y.loadedPosts, l, { skipOlderCheck: !0 }), !1;
		let m = Math.min(f, p), h = await Q.getOlderVisibleChunk({
			pubkeyHex: a,
			visibleUntil: d,
			cursor: o,
			limit: m
		});
		if (i && (i.olderPostsLength = h.length), !e() || l !== z) return !1;
		let g = u ? await An(a, l) : null;
		if (u && !g) return await Nn(), !1;
		if (h.length === 0) return u ? await Nn() : y.hasOlderLocal = !1, i && (i.loadedPostsAfterLength = y.loadedPosts.length, i.visibleOldestAfter = y.loadedPosts.length > 0 ? y.loadedPosts[y.loadedPosts.length - 1]?.createdAt ?? null : null), !1;
		let _ = t.autoLoadViewportCommit ? t.autoLoadViewportCommit.captureAnchorEventId() : null;
		if (t.autoLoadViewportCommit && !_) return !1;
		let v = t.relayFetchViewportCommit?.captureAnchorEventId(), b = Kn(r, h, _ ?? v ?? t.anchorEventId), x = t.reason === "normal-older-reveal" ? Xd(r, b.posts) : [];
		if (t.autoLoadViewportCommit && (!_ || !b.posts.some((e) => e.eventId === _) || x.length === 0) || t.autoLoadViewportCommit && !t.autoLoadViewportCommit.canCommitWindowChange("older", r, b.posts)) return !1;
		y.loadedPosts = b.posts, x.length > 0 && Re.scheduleOlderRevealRepair(x), b.didDeferOlderPosts && (y.hasOlderLocal = !0), b.didTrimForOlderAppend && (y.hasNewerLocal = !0);
		let S = x.length;
		g ? X = {
			...g,
			reachedVisibleCount: Math.min(g.totalVisibleCount, g.reachedVisibleCount + S),
			oldestCursor: df(b.posts[b.posts.length - 1]) ?? g.oldestCursor
		} : !s && c && Dt(a) === c.revision && (ff(o, c.oldestCursor) ? X = {
			...c,
			reachedVisibleCount: Math.min(c.totalVisibleCount, c.reachedVisibleCount + S),
			oldestCursor: df(b.posts[b.posts.length - 1]) ?? c.oldestCursor
		} : It());
		let C = s && g !== null && X !== null, w = !!X && X.reachedVisibleCount >= X.totalVisibleCount;
		return C && X && (y.hasOlderLocal = X.totalVisibleCount > X.reachedVisibleCount), i && (i.loadedPostsAfterLength = b.posts.length, i.visibleOldestAfter = b.posts.length > 0 ? b.posts[b.posts.length - 1]?.createdAt ?? null : null, i.didTrimForOlderAppend = b.didTrimForOlderAppend, i.didDeferOlderPosts = b.didDeferOlderPosts), t.autoLoadViewportCommit?.onCommitted(), t.relayFetchViewportCommit?.onCommitted(), C ? (qn(a, b.posts, l, { skipOlderCheck: !0 }).catch(() => void 0), !0) : (await qn(a, b.posts, l, { skipOlderCheck: s && w }), !0);
	}
	async function nr(t, n, r = {}) {
		It();
		let i = y.loadedPosts, a = i.length > 0 ? i[i.length - 1]?.createdAt ?? null : null;
		if (typeof a != "number") return !1;
		let o = await Q.getVisibleChunkFromCreatedAt({
			pubkeyHex: t,
			visibleUntil: y.visibleUntil,
			createdAt: Math.max(0, a - 1),
			limit: f,
			query: { contiguous: !1 }
		});
		if (!e() || n !== z) return !1;
		if (o.length === 0) return y.hasOlderLocal = !1, !1;
		let s = Kn(i, o, r.relayFetchViewportCommit?.captureAnchorEventId() ?? r.anchorEventId);
		return y.loadedPosts = s.posts, r.relayFetchViewportCommit && s.didTrimForOlderAppend && (y.hasNewerLocal = !0), r.relayFetchViewportCommit?.onCommitted(), await qn(t, s.posts, n), s.didDeferOlderPosts && (y.hasOlderLocal = !0), !0;
	}
	async function rr(t, n, r = {}) {
		It();
		let i = y.loadedPosts;
		if (typeof y.visibleUntil != "number") return !1;
		let a = df(i[i.length - 1]);
		if (!a) return !1;
		let o = await Q.getSparseChunk({
			pubkeyHex: t,
			visibleUntil: y.visibleUntil,
			cursor: a,
			direction: "older",
			limit: f
		});
		if (!e() || n !== z) return !1;
		if (o.length === 0) return y.hasOlderLocal = !1, !1;
		let s = Kn(i, o, r.relayFetchViewportCommit?.captureAnchorEventId() ?? r.anchorEventId);
		return y.loadedPosts = s.posts, r.relayFetchViewportCommit && s.didTrimForOlderAppend && (y.hasNewerLocal = !0), r.relayFetchViewportCommit?.onCommitted(), await qn(t, s.posts, n), s.didDeferOlderPosts && (y.hasOlderLocal = !0), !0;
	}
	async function ir(t) {
		let r = n(), i = df(y.loadedPosts[0]);
		if (!r || !i) return !1;
		let a = ++z, o = X, s = o ? await An(r, a) : null;
		if (o && !s) return await Nn(), !1;
		let c = s?.visibleUntil ?? await wn(r, a), l = await Q.getNewerVisibleChunk({
			pubkeyHex: r,
			visibleUntil: c,
			cursor: i,
			limit: f
		});
		if (!e() || a !== z) return !1;
		if (l.length === 0) return y.hasNewerLocal = !1, !1;
		if (s && !await An(r, a)) return await Nn(), !1;
		let u = t?.captureAnchorEventId();
		if (t && !u) return !1;
		let d = y.loadedPosts, p = Gn([...l, ...d], "newer");
		if (t && !p.some((e) => e.eventId === u) || t && !t.canCommitWindowChange("newer", d, p)) return !1;
		y.loadedPosts = p;
		let m = Math.max(0, d.length + l.length - p.length);
		return s && (X = {
			...s,
			reachedVisibleCount: Math.max(0, s.reachedVisibleCount - m),
			oldestCursor: df(p[p.length - 1]) ?? s.oldestCursor
		}), t && m > 0 && (y.hasOlderLocal = !0), t?.onCommitted(), await qn(r, p, a), !(!e() || a !== z);
	}
	async function ar() {
		It();
		let t = n(), a = r();
		if (!t || !a) return;
		Ot();
		let o = ++Ae, c = Ft("bootstrap"), l = At("syncing", c ? 2 : 1, !0);
		c && c.promise.then((e) => jt(l, !!e, e?.changed ?? !1));
		let u = ++Ee;
		O(Te, !0);
		let d = !1, p = !1;
		try {
			let r = await wn(t);
			if (!Lt(o) || !e() || n() !== t) return;
			let c = await Cn(t, a, o);
			if (!c.isActive()) return;
			let l = Vt.fetchLatest(a, {
				pubkeyHex: t,
				relayConfig: i(),
				reason: "bootstrap",
				limit: 150,
				timeoutMs: Gt
			});
			ve = l;
			let u = await l.promise, m = {
				insertedCount: 0,
				updatedCount: 0,
				unchangedCount: 0,
				appliedDeletionCount: 0
			};
			if (!Lt(o) || ve !== l || (ve = null, !c.isActive() || u.status === "cancelled")) return;
			if (u.events.length > 0 || u.relayFetchCoverage?.length) {
				let e = await Bn(u, c);
				if (e.applied === !1 || !c.isActive()) return;
				m = e;
				let t = Jd(u.events);
				t.length > 0 && await s(t);
			}
			if (!Lt(o) || !e()) return;
			let h = await En(t, u);
			if (!Lt(o) || !e()) return;
			let g = h !== r;
			fn(u), await Mt(async () => {
				c.isActive() && (y.searchQuery ? await Ve(y.searchPage, y.searchQuery) : y.loadedPosts.length === 0 || !y.hasNewerLocal && (!F(C).length || y.loadedPosts.length <= f) ? await Jn({ forceTotalCount: m.insertedCount + m.updatedCount > 0 }) : (zn({ force: m.insertedCount + m.updatedCount > 0 }), await qn(t)));
			}), d = u.status === "success" && c.isActive(), p = m.insertedCount + m.updatedCount > 0 || g;
		} finally {
			u === Ee && O(Te, !1), jt(l, d, p);
		}
	}
	function or(e, t) {
		return t === null ? e.at(-1) : e.find((e) => e.since <= t && e.until >= t) ?? e.filter((e) => e.until < t).at(-1) ?? e.at(-1);
	}
	function sr() {
		if (M === null || N === void 0 && ve === null) return !1;
		let e = or(F(k), F(b));
		return e !== void 0 && F(S).some((t) => t.since <= e.until && t.until >= e.until) && (N === void 0 || e.until + 1 > N);
	}
	async function cr() {
		let t = n(), a = r();
		if (!t || !a) return;
		Ot();
		let o = ++Ae;
		M = o;
		let c = Ft("dialog-open-refresh"), l = At("syncing", c ? 2 : 1, !0);
		c && c.promise.then((e) => jt(l, !!e, e?.changed ?? !1));
		let u = ++Ee;
		O(Te, !0);
		let d = !1, p = !1;
		try {
			y.lastDialogOpenRefreshAt = Date.now();
			let c = Math.floor(y.lastDialogOpenRefreshAt / 1e3), l = L, u = i(), m = () => !R && l === L && Lt(o) && e() && n() === t && r() === a, h = await xt.getLocalRevision(t), g = await wn(t), _ = await $(t), v = [...F(S)], w = F(b), T = or(_, w), E = T && F(S).some((e) => e.since <= T.until && e.until >= T.until), D = T ? Math.min(T.until, c) + +!!E : void 0;
			if (N = D, !m()) return;
			if (D !== void 0 && D > c) {
				d = !0, M = null;
				return;
			}
			let O = c, k = c + 1, A = !1, j, P = {
				insertedCount: 0,
				updatedCount: 0
			};
			for (;;) {
				let e = Hn.runAuthored(a, {
					ownerPubkeyHex: t,
					relayConfig: u,
					getRelayConfig: i,
					isActive: m,
					expectedLocalRevision: h,
					reason: A ? "dialog-open-catchup" : "dialog-open-refresh",
					...D === void 0 ? {} : { since: D },
					until: O,
					limit: A ? 150 : 30,
					timeoutMs: qt,
					onSavedSelfPosts: s
				});
				ve = e;
				let n = await e.promise;
				if (!m() || ve !== e) return;
				if (ve = null, j = n.fetchResult, j.status === "cancelled") {
					M = null;
					return;
				}
				if (P.insertedCount += n.upsertSummary.insertedCount, P.updatedCount += n.upsertSummary.updatedCount, D === void 0) break;
				let r = await $(t);
				if (!m()) return;
				let o = r.find((e) => e.since <= c && e.until >= c)?.since ?? c + 1;
				if (o <= D || A && o >= k) break;
				k = o, O = Math.min(c, k - 1), A = !0;
			}
			let ee = await En(t, j);
			if (!Lt(o) || !e()) return;
			let te = w === null ? ee : rt(Zu(F(x), v), w), I = sd({
				insertedCount: P.insertedCount,
				updatedCount: P.updatedCount,
				previousVisibleUntil: g,
				nextVisibleUntil: te,
				searchQuery: y.searchQuery,
				loadedPostsLength: y.loadedPosts.length,
				hasNewerLocal: y.hasNewerLocal
			});
			if (pn(j), await Mt(async () => {
				if (m()) {
					if (F(C).length && (y.loadedPosts.length > f || y.hasNewerLocal)) It(), zn({ force: I.didMateriallyChange }), await qn(t);
					else if (I.applyAction === "reload-search-page") await Ve(y.searchPage, y.searchQuery);
					else if (I.applyAction === "load-latest-visible-posts") {
						let e = I.didMateriallyChange && !I.didVisibleMateriallyChange;
						await Jn({
							forceTotalCount: I.didMateriallyChange,
							skipOlderAvailabilityCheck: e,
							awaitProgress: e,
							awaitAvailability: !0
						});
					} else I.applyAction === "refresh-count-and-availability" && (I.didMateriallyChange ? await Jn({
						forceTotalCount: I.didMateriallyChange,
						skipOlderAvailabilityCheck: !I.didVisibleMateriallyChange,
						awaitProgress: !I.didVisibleMateriallyChange,
						awaitAvailability: !0
					}) : (It(), zn({ force: I.didMateriallyChange }), await qn(t)));
				}
			}), !m()) return;
			d = j.status === "success", p = I.didMateriallyChange, M = null;
		} finally {
			u === Ee && O(Te, !1), jt(l, d, p);
		}
	}
	function lr() {
		return typeof y.lastDialogOpenRefreshAt != "number" || Date.now() - y.lastDialogOpenRefreshAt >= Jt;
	}
	function ur(t, i) {
		if (ue || !e() || n() !== t || !r()) return;
		if (ue = !0, i.length === 0) {
			ar();
			return;
		}
		let a = F(k).at(-1)?.until, o = F(b), s = a !== void 0 && i.some((e) => e.createdAt > a) || o !== null && !F(k).some((e) => e.since <= o && e.until >= o);
		if (K || s || lr()) K = !1, cr();
		else {
			let e = Ft("dialog-open-refresh");
			if (e) {
				let t = At("syncing", 1, !0);
				e.promise.then((e) => jt(t, !!e, e?.changed ?? !1));
			}
		}
	}
	function dr() {
		return !F(Ke) || !F(nt) ? !1 : (--y.searchPage, !0);
	}
	function fr() {
		return !F(Ke) || !F(it) ? !1 : (y.searchPage = 1, !0);
	}
	async function pr() {
		if (!F(Ke) || !F(at)) return !1;
		let e = y.searchPage + 1;
		return Be(e, y.searchQuery);
	}
	async function mr(t) {
		if (!F(Ke) && F(C).length) {
			let r = !1, i = n();
			return await Mt(async () => {
				!R && e() && n() === i && (r = await hr(t));
			}), r;
		}
		return hr(t);
	}
	async function hr(e) {
		if (F(Ke)) return pr();
		if (y.sparseSource === "saved") {
			let e = n();
			return e ? rr(e, ++z, { reason: "normal-older-reveal" }) : !1;
		}
		if (y.sparseSource === "jump") {
			let e = n();
			return e ? nr(e, ++z, { reason: "normal-older-reveal" }) : !1;
		}
		return tr({
			reason: "normal-older-reveal",
			autoLoadViewportCommit: e
		});
	}
	async function gr(e) {
		return F(Ke) ? Promise.resolve(dr()) : y.sparseSource === "saved" ? Sr() : ir(e);
	}
	async function _r() {
		return F(Ke) ? Promise.resolve(fr()) : (await Jn(), !0);
	}
	async function vr() {
		let t = n();
		if (!t) return !1;
		let r = await Sn(t);
		if (typeof r != "number") return !1;
		let i = ++z, a = await Q.getSparseChunk({
			pubkeyHex: t,
			visibleUntil: r,
			direction: "latest",
			limit: f
		});
		return !e() || n() !== t || i !== z ? !1 : a.length === 0 ? (y.hasSavedPostsOutsideVisibleRange = !1, !1) : (y.listingMode = "sparse", y.sparseSource = "saved", y.loadedPosts = a, zn(), await qn(t, a, i), await Un(t, r, i), !0);
	}
	async function yr() {
		if (F(Ke) || !F(ut)) return !1;
		if (y.listingMode === "sparse") {
			It();
			let t = n();
			if (!t) return !1;
			let r = ++z, i = await Q.getOldestVisibleChunk({
				pubkeyHex: t,
				visibleUntil: y.visibleUntil,
				limit: f,
				query: { contiguous: !1 }
			});
			return !e() || r !== z || i.length === 0 ? !1 : (zn(), y.loadedPosts = i, Le(), y.hasOlderLocal = !1, await qn(t, i, r, { skipOlderCheck: !0 }), !0);
		}
		It();
		let t = n();
		if (!t) return !1;
		let r = ++z, i = await wn(t, r), a = await Q.getOldestVisibleChunk({
			pubkeyHex: t,
			visibleUntil: i,
			limit: f
		});
		return !e() || r !== z ? !1 : a.length === 0 ? (zn(), y.loadedPosts = [], y.hasOlderLocal = !1, y.hasNewerLocal = !1, !1) : (zn(), y.listingMode = "contiguous", y.sparseSource = null, y.loadedPosts = a, Le(), y.hasOlderLocal = !1, await qn(t, a, r, { skipOlderCheck: !0 }), !0);
	}
	async function br(t = {}) {
		let a = n(), o = r();
		if (!e() || !a || !F(ft)) return !1;
		let s = !!o && !F(Te) && !Fe.exhausted, c = !F(Y) && F(xe) && Yt.isConfigured(a);
		if (!s && !c) return !1;
		let l = At("older-syncing", Number(s) + Number(c)), u = s ? ++Ae : Ae, d = L, f = $t(i()), p = () => !R && d === L && Lt(u) && e() && n() === a && r() === o && $t(i()) === f, m = c ? Ft("older-backfill", { until: F(J) ?? Math.floor(Date.now() / 1e3) }, t) : null;
		if (c && (m?.promise ?? Promise.resolve(null)).then((e) => jt(l, !!e, e?.changed ?? !1)), s && o) {
			let e = ++Ee;
			O(Te, !0);
			let n = !0;
			Z(a, o, u, p, t, (e) => {
				n = e;
			}).then((e) => jt(l, n && p(), e)).catch(() => jt(l, !1, !1)).finally(() => {
				e === Ee && O(Te, !1);
			});
		}
		return l.promise;
	}
	async function xr() {
		let t = n();
		if (!t) return !1;
		Ot(), qe(), cn();
		let r = L, i = () => !R && e() && n() === t && r === L;
		return Hn.cancelOwnerTasks(t), (await Promise.allSettled([Q.deleteLocalHistoryForPubkey(t)])).some((e) => e.status === "rejected") ? (i() && (e() && n() === t && (In(), Fn({
			known: y.totalCountKnown,
			status: "failed"
		})), Je(), y.currentViewRefetchMessageKey = "postHistory.deleteLocalHistoryFailed", y.currentViewRefetchMessageValues = null), !1) : (kf(t), i() && (cn(), an(), y.currentViewRefetchMessageKey = "postHistory.deleteLocalHistorySuccess", y.currentViewRefetchMessageValues = null, Af(t)), !0);
	}
	async function Sr() {
		It();
		let t = n(), r = df(y.loadedPosts[0]);
		if (!t || !r || typeof y.visibleUntil != "number") return !1;
		let i = ++z, a = await Q.getSparseChunk({
			pubkeyHex: t,
			visibleUntil: y.visibleUntil,
			cursor: r,
			direction: "newer",
			limit: f
		});
		if (!e() || i !== z) return !1;
		if (a.length === 0) return y.hasNewerLocal = !1, !1;
		let o = Gn([...a, ...y.loadedPosts], "newer");
		return y.loadedPosts = o, await qn(t, o, i), !0;
	}
	async function Cr(t) {
		let r = n(), i = L, a = z, o = () => !R && e() && n() === r && i === L && a === z;
		if (!r || r !== t.ownerPubkeyHex || !o() || await xt.getLocalRevision(r) !== t.localRevision || !o()) return;
		if (cn(), It(), a = z, y.searchQuery) {
			await Ve(y.searchPage, y.searchQuery);
			return;
		}
		let s = y.loadedPosts, c = await Promise.all(s.map((e) => Q.getByEventId(e.eventId)));
		if (!o() || y.loadedPosts !== s) return;
		if (y.loadedPosts = c.flatMap((e) => e?.pubkeyHex === r ? [e] : []), !s.length) {
			await Jn({ forceTotalCount: !0 });
			return;
		}
		let l = await wn(r);
		o() && (zn({ force: !0 }), await qn(r, y.loadedPosts, a), o() && await Un(r, l, a));
	}
	async function wr(t) {
		let r = n();
		if (!r || !e()) return;
		let i = L;
		if (t?.localRevision !== void 0 && await xt.getLocalRevision(r) !== t.localRevision || R || i !== L || n() !== r || !e() || (t?.restoredRangeChanged && await vn(r), R || i !== L || n() !== r || !e())) return;
		let a = t?.restoredRangeChanged === !0 && sr();
		if (a && (Ot(), y.syncStatus = "idle"), cn(), t?.restoredRangeChanged && t.insertedPostCount + t.updatedPostCount + t.appliedDeletionPostCount === 0 ? (await wn(r), await qn(r)) : await Tr(), t?.localRevision !== void 0 && await xt.getLocalRevision(r) !== t.localRevision) return;
		let o = y.loadedPosts[0]?.createdAt, s = o === void 0 ? void 0 : F(k).find((e) => e.since <= o && e.until >= o), c = !F(Ke) && y.listingMode === "contiguous" && o !== void 0 && F(b) !== null && (!s || s.since > F(b));
		t?.restoredRangeChanged && (a || c && M === null) && !R && i === L && n() === r && e() && cr();
	}
	async function Tr() {
		if (It(), n()) {
			if (y.searchQuery) await Ve(y.searchPage, y.searchQuery);
			else if (y.sparseSource === "saved") {
				let e = n();
				if (!e) return;
				let t = await wn(e);
				zn({ force: !0 }), await qn(e), await Un(e, t);
			} else await Jn({ forceTotalCount: !0 });
		}
	}
	function Er(e, t, n) {
		let r = (r) => Of(r, e, t, n);
		y.loadedPosts = r(y.loadedPosts), y.searchPosts = r(y.searchPosts);
	}
	function Dr(t) {
		let r = n(), i = Sf(r);
		if (!r || !i) return;
		let a = ++pe;
		O(fe, "loading"), t().then(() => {
			e() && n() === r && q === i && a === pe && O(fe, "ready");
		}).catch(() => {
			e() && n() === r && q === i && a === pe && O(fe, "failed");
		});
	}
	return w(() => {
		let t = $t(i()), a = n(), o = r(), s = hn();
		if ((t !== ee || a !== te || o !== I) && (ee = t, te = a, I = o, L += 1, j(() => {
			Ot(), qe(), cn(), y.syncStatus === "syncing" && (y.syncStatus = "idle");
		})), !e() || !a) return;
		let c = L, l = Kt(i()), u = Ue(async () => await mn(a)).subscribe({
			next: async ([t, r, i, o, u]) => {
				try {
					let e = await xt.getLocalRevision(a);
					if (e !== i || e !== r.localRevision) return;
				} catch {
					return;
				}
				if (R || c !== L || !e() || n() !== a || u !== s || u !== hn() || (O(x, Ye(t.relays, l), !0), O(S, r.ranges, !0), E !== null && E !== i && Pt(), E = i, gn(o), sr() && cr(), F(b) === null)) return;
				let d = rt(F(A), F(b));
				d !== y.visibleUntil && (y.visibleUntil = d, It(), B && qn(a, y.loadedPosts, null, { deferDuringOlderRelayFetch: !0 }));
			},
			error: () => {}
		});
		return () => u.unsubscribe();
	}), w(() => {
		let e = Sf(n());
		e !== he && (he = e, zt(), Pt(), O(ge, null), _e = e, Ot(), qe(), cn(), Zt(), Je(), Ut(), Le(), Re.resetOlderRevealRepairContext(), ue = !1, K = !1, de = !1, q = null, pe += 1, O(fe, "idle"));
	}), w(() => {
		let e = r();
		e !== Me && (Me = e, Re.resetOlderRevealRepairContext());
	}), w(() => {
		en();
	}), w(() => {
		tn();
	}), w(() => {
		t() || j(dn);
	}), w(() => {
		let i = Bt.localRelayUrl, a = r();
		if (!e()) return;
		j(() => {
			let e = Yt.getSessionGeneration();
			(i !== Se || a !== Ce || e !== we) && Pt(), Se = i, Ce = a, we = e, O(D, e, !0);
		});
		let o = Yt.onSessionInvalidated(() => {
			let t = T !== null || ye !== null;
			Pt(), O(D, Yt.getSessionGeneration(), !0), we = F(D);
			let o = n(), s = L, c = () => !R && e() && L === s && n() === o && r() === a && Bt.localRelayUrl === i;
			t && c() && o && wn(o).then(() => {
				if (c()) return qn(o);
			}).catch(() => void 0);
		});
		return () => {
			o(), j(() => {
				be++, ye?.cancel(), ye = null, O(Y, !1), t() || Pt();
			});
		};
	}), w(() => {
		if (e()) return () => {
			Ot();
		};
	}), w(() => () => {
		Re.dispose();
	}), w(() => {
		if (!e()) Ut();
		else return Wt(), () => {
			Ut();
		};
	}), w(() => {
		if (!e()) return;
		let t = y.searchInput.trim();
		t !== y.searchQuery && O(G, "loading");
		let n = setTimeout(() => {
			y.searchQuery = t;
		}, p);
		return () => {
			clearTimeout(n);
		};
	}), w(() => {
		if (!e() || F(Ke)) return;
		let t = Sf(n()) ?? "";
		if (de && q === t) return;
		if (de = !0, q = t, _e === t) {
			_e = null, Dr(Jn);
			return;
		}
		let r = Qn(), i = kt(n());
		Xn(i, r) ? (K = !0, o(), Dr(Jn)) : $n(r) ? Dr(() => Zn(r, i)) : Dr(r ? () => er(r) : Jn);
	}), w(() => {
		e() || zt();
	}), w(() => {
		if (!e() || !F(V) || F(ie) !== Sf(n())) return;
		let t = F($e);
		if (t.length === 0 || !Wn.canUsePersistentCache()) return;
		let r = nn(t);
		if (r.length === 0) return;
		let i = [...r].sort().join("\0");
		i !== ae && (ae = i, Promise.resolve(Wn.prefetchCachedMediaDescriptors(r)).catch(() => {}));
	}), re(() => {
		R = !0, Pt(), L += 1, Ot(), qe(), z += 1, se += 1, pe += 1, yd.clearCache?.(), O(fe, "idle"), O(ie, null), O(V, !1);
	}), w(() => {
		if (e()) {
			if (!y.searchQuery) {
				let e = Ne !== "";
				if (zt(), se += 1, O(ce, !1), O(G, "idle"), yd.clearCache?.(), Ne = "", Pe = !1, y.searchPage !== 1) {
					if (y.searchPage = 1, e) {
						let e = n();
						e && Ht(e, () => Rt(e, z), () => y.loadedPosts.length > 0);
					}
					return;
				}
				if (y.searchPosts = [], y.searchTotalCount = 0, y.searchTotalCountKnown = !1, y.searchHasNext = !1, e) {
					let e = n();
					e && Ht(e, () => Rt(e, z), () => y.loadedPosts.length > 0);
				}
			} else if (y.searchQuery !== Ne) zt(), Ne === "" && y.searchPosts.length === 0 && (y.searchPosts = y.loadedPosts), Ne = y.searchQuery, y.searchPage = 1, Pe = !0, Be(1, y.searchQuery);
			else if (Ne = y.searchQuery, !Pe) {
				Pe = !0;
				let e = n(), t = y.searchQuery, r = ++se, i = y.searchPosts.length > 0;
				e && i && Ht(e, () => ze(r, t, e), () => y.searchPosts.length > 0), Ve(y.searchPage, t, r);
			}
		}
	}), {
		state: y,
		get isSearchMode() {
			return F(Ke);
		},
		get posts() {
			return F($e);
		},
		get displayTotalCount() {
			return F(tt);
		},
		get displayTotalCountKnown() {
			return F(Ke) ? y.searchTotalCountKnown : y.totalCountKnown;
		},
		get displayTotalCountStatus() {
			return F(Ke) ? y.searchTotalCountKnown ? "ready" : F(G) === "failed" ? "failed" : "loading" : y.totalCountStatus;
		},
		get canLoadOlder() {
			return F(ot);
		},
		get canLoadNewer() {
			return F(st);
		},
		get canReturnToLatest() {
			return F(ct);
		},
		get canJumpToOldest() {
			return F(ut);
		},
		get canFetchOlderFromRelays() {
			return F(ft);
		},
		get isFetchingOlderFromRelays() {
			return F(mt);
		},
		get isFetchingFromRelays() {
			return F(gt);
		},
		get isRefetchingAroundCurrentView() {
			return F(Qe);
		},
		get showLocalExhaustedState() {
			return F(_t);
		},
		get showSavedPostsBoundary() {
			return F(vt);
		},
		get isShowingSavedOlderPosts() {
			return y.listingMode === "sparse" && y.sparseSource === "saved";
		},
		get latestOlderBackfillUiResult() {
			return y.latestOlderBackfillUiResult;
		},
		get isDialogOpenSyncing() {
			return F(ke) && y.syncStatus === "syncing";
		},
		get syncStatus() {
			return y.syncStatus;
		},
		get syncStatusMessageKey() {
			return F(bt);
		},
		get showStatusLoader() {
			return F(Ct);
		},
		get isSearchPageLoading() {
			return F(ce);
		},
		get searchResultStatus() {
			return F(G);
		},
		get initialLocalLoadStatus() {
			return F(fe);
		},
		get canRefetchAroundCurrentView() {
			return F(yt);
		},
		get currentViewRefetchStatusMessageKey() {
			return F(wt);
		},
		get currentViewRefetchStatusMessageValues() {
			return F(Tt);
		},
		prepareForClose: un,
		suspend: ln,
		loadOlder: mr,
		loadNewer: gr,
		returnToLatest: _r,
		showSavedOlderPosts: vr,
		jumpToOldest: yr,
		jumpToCreatedAt: He,
		jumpToEventId: Ge,
		fetchOlderFromRelays: br,
		refetchAroundCurrentView: Ze,
		resetSearchState: Xt,
		refreshAfterLocalImport: wr,
		refreshAfterRelayScan: Cr,
		deleteLocalHistory: xr,
		patchDeletedPost: Er
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryDialogScrollState.ts
var Nf = /* @__PURE__ */ new Map();
function Pf(e) {
	if (typeof e != "string") return null;
	let t = e.trim();
	return t.length > 0 ? t : null;
}
function Ff(e) {
	return typeof e == "string" ? e.trim() : "";
}
function If(e) {
	let t = Pf(e.pubkeyHex);
	if (!t) return null;
	let n = e.mode === "search" ? Ff(e.searchQuery) : "";
	return `${t}:${e.mode}:${n}`;
}
function Lf(e) {
	let t = If(e);
	if (!t) return null;
	let n = Nf.get(t);
	return n ? {
		...n,
		anchor: { ...n.anchor }
	} : null;
}
function Rf(e) {
	let t = If(e), n = Pf(e.pubkeyHex);
	t && n && Nf.set(t, {
		pubkeyHex: n,
		mode: e.mode,
		searchQuery: e.mode === "search" ? Ff(e.searchQuery) : "",
		anchor: { ...e.anchor },
		savedAt: e.savedAt ?? Date.now()
	});
}
function zf(e) {
	let t = Pf(e.pubkeyHex);
	if (t) {
		if (e.mode) {
			let n = If({
				pubkeyHex: t,
				mode: e.mode,
				searchQuery: e.searchQuery
			});
			n && Nf.delete(n);
		} else for (let e of Nf.keys()) e.startsWith(`${t}:`) && Nf.delete(e);
	}
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/hooks/usePostHistoryDialogViewport.svelte.ts
var Bf = 1, Vf = 2, Hf = 12;
function Uf(e, t, n, r) {
	return (e === "older" ? t : n) + Vf >= r;
}
function Wf(e) {
	return `${e.pubkeyHex}:${e.mode}:${e.searchQuery}:${e.anchor.eventId}:${e.savedAt}`;
}
function Gf({ getShow: e, getPubkeyHex: t, getPosts: n, getLocale: r, getContainer: i, getIsSearchMode: a, getSearchQuery: o }) {
	let s = 0, c = () => {
		let t = s;
		return () => e() && t === s;
	};
	function l() {
		s++, P();
	}
	re(l);
	let u = H(null), d = H(!0), f = H(!0), p = null, m = H(null), h = !1, g = null;
	function _() {
		return a() ? "search" : "normal";
	}
	function v() {
		return a() ? o() : "";
	}
	function y() {
		return Lf({
			pubkeyHex: t(),
			mode: _(),
			searchQuery: v()
		});
	}
	function b(e) {
		return !!e && n().some((t) => t.eventId === e.anchor.eventId);
	}
	function x() {
		let e = z();
		e && Rf({
			pubkeyHex: t(),
			mode: _(),
			searchQuery: v(),
			anchor: e
		});
	}
	function S() {
		zf({
			pubkeyHex: t(),
			mode: _(),
			searchQuery: v()
		}), O(m, null), g = null;
	}
	function T() {
		zf({ pubkeyHex: t() }), O(m, null), g = null;
	}
	function E() {
		let e = i();
		e && (e.scrollTop = 0, k(), A(), ee());
	}
	function D() {
		let e = i();
		e && (e.scrollTop = e.scrollHeight, k(), A(), ee());
	}
	function k() {
		let e = i();
		e ? O(d, e.scrollTop <= Bf) : O(d, !0);
	}
	function A() {
		let e = i();
		if (!e) {
			O(f, !0);
			return;
		}
		let t = e.scrollHeight - e.clientHeight - e.scrollTop;
		O(f, t <= Vf);
	}
	function j() {
		let e = i();
		if (!e) return null;
		let t = e.getBoundingClientRect(), n = t.top + Hf, r = Array.from(e.querySelectorAll("[data-post-history-event-id]")), a = 0, o = r.length, s = t.top + Bf;
		for (; a < o;) {
			let e = Math.floor((a + o) / 2);
			r[e].getBoundingClientRect().bottom > s ? o = e : a = e + 1;
		}
		let c = null;
		for (let e = a; e < r.length; e += 1) {
			let i = r[e], a = i.getBoundingClientRect();
			if (a.top >= t.bottom - Bf) break;
			let o = Number(i.dataset.postHistoryPostedAt);
			if (Number.isFinite(o)) {
				if (a.top <= n && a.bottom > n) return o;
				c === null && (c = o);
			}
		}
		return c;
	}
	function M() {
		if (!e() || n().length === 0) {
			O(u, null);
			return;
		}
		let t = j();
		O(u, t === null ? null : $(t, r()), !0);
	}
	function N() {
		P(), M(), C();
	}
	function P() {
		p !== null && (cancelAnimationFrame(p), p = null);
	}
	function ee() {
		e() && (P(), p = requestAnimationFrame(() => {
			p = null, M();
		}));
	}
	function te() {
		k(), A(), F(f) ? N() : ee();
	}
	function I() {
		let e = c();
		ne().then(() => {
			e() && E();
		});
	}
	function L() {
		let e = c();
		ne().then(() => {
			e() && D();
		});
	}
	function R(e) {
		let t = c();
		ne().then(() => {
			t() && B({
				eventId: e,
				offsetTop: 0
			});
		});
	}
	function z() {
		let e = i();
		if (!e) return null;
		let t = e.getBoundingClientRect(), n = Array.from(e.querySelectorAll("[data-post-history-event-id]"));
		for (let e of n) {
			let n = e.dataset.postHistoryEventId;
			if (!n) continue;
			let r = e.getBoundingClientRect();
			if (r.bottom > t.top + Bf && r.top < t.bottom - Bf) return {
				eventId: n,
				offsetTop: r.top - t.top
			};
		}
		return null;
	}
	function B(t, n = {}) {
		let r = i();
		if (!t || !e() || !r) return !1;
		n.flushUpdates !== !1 && C();
		let a = Array.from(r.querySelectorAll("[data-post-history-event-id]")).find((e) => e.dataset.postHistoryEventId === t.eventId);
		if (!a) return !1;
		let o = r.getBoundingClientRect(), s = a.getBoundingClientRect().top - o.top;
		return r.scrollTop += s - t.offsetTop, ee(), !0;
	}
	function V(e, t, n) {
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
			return Uf("older", r.scrollTop, 0, o);
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
		return Uf("newer", 0, r.scrollHeight - r.clientHeight - r.scrollTop, f);
	}
	function ie(e, t) {
		let n = i();
		return n ? Array.from(n.querySelectorAll("[data-post-history-thread-anchor-event-id]")).find((n) => n.dataset.postHistoryThreadAnchorScopeId === e && n.dataset.postHistoryThreadAnchorEventId === t) ?? null : null;
	}
	function U(e, t) {
		let n = ie(e, t);
		return n ? {
			scopeEventId: e,
			eventId: t,
			top: n.getBoundingClientRect().top
		} : null;
	}
	function ae(t) {
		let n = i();
		if (!t || !e() || !n) return !1;
		C();
		let r = ie(t.scopeEventId, t.eventId);
		if (!r) return !1;
		let a = r.getBoundingClientRect().top - t.top;
		return Math.abs(a) < .5 || (n.scrollTop += a, ee(), k(), A()), !0;
	}
	async function W(e, t, n) {
		let r = c(), i = U(e, t), a = n();
		await ne(), r() && (ae(i), await a, await ne(), r() && ae(i));
	}
	return w(() => {
		e() ? h || (h = !0, O(m, y(), !0), g = null) : (h = !1, O(m, null), g = null, O(u, null), P());
	}), w(() => {
		if (!e() || !b(F(m))) return;
		let t = F(m), n = Wf(t);
		if (g === n) return;
		let r = c();
		ne().then(() => {
			r() && F(m) === t && (B(t.anchor), g = n, O(m, null));
		});
	}), w(() => {
		if (!e()) {
			O(u, null), P();
			return;
		}
		i(), n(), r();
		let t = c();
		return ne().then(() => {
			t() && (M(), k(), A());
		}), () => {
			P();
		};
	}), {
		suspend: l,
		get currentMonthLabel() {
			return F(u);
		},
		get isHistoryScrolledToTop() {
			return F(d);
		},
		get isHistoryScrolledToBottom() {
			return F(f);
		},
		readCurrentSessionScrollState: y,
		saveCurrentSessionScrollAnchor: x,
		clearCurrentSessionScrollAnchor: S,
		clearAllSessionScrollAnchorsForCurrentPubkey: T,
		handleHistoryScroll: te,
		resetHistoryScrollSoon: I,
		resetHistoryScrollToBottomSoon: L,
		scrollHistoryEventToTopSoon: R,
		captureHistoryScrollAnchor: z,
		canCommitAutoLoadWindowChange: V,
		restoreHistoryScrollAnchor: B,
		preserveThreadParentToggleScroll: W
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/hooks/usePostHistoryAutoLoadRootHeight.svelte.ts
function Kf(e) {
	let t = H(null), n = H(0), r = null, i = null, a = 0;
	return w(() => {
		let o = e.getRoot();
		if (!o) {
			r = null, i = null, O(t, null);
			return;
		}
		let s = () => {
			let e = Math.max(0, o.clientHeight);
			r === o ? i !== e && (i = e, O(t, e, !0), a += 1, O(n, a, !0)) : (r = o, i = e, O(t, e, !0));
		};
		if (s(), typeof ResizeObserver > "u") return;
		let c = new ResizeObserver(s);
		return c.observe(o), () => {
			c.disconnect(), r === o && (r = null, i = null, O(t, null));
		};
	}), {
		get height() {
			return F(t);
		},
		get resizeGeneration() {
			return F(n);
		}
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryAutoLoadSentinelObserver.ts
function qf(e) {
	let { rootRect: t, sentinelRect: n, rootHeight: r } = e, i = n.left < t.right && n.right > t.left;
	return e.direction === "older" ? i && n.top <= t.bottom + r * 2 && n.bottom >= t.top : i && n.bottom >= t.top - r * 2 && n.top <= t.bottom;
}
function Jf(e, t) {
	return e === "older" ? `0px 0px ${t * 2}px 0px` : `${t * 2}px 0px 0px 0px`;
}
function Yf(e) {
	let { direction: t, root: n, sentinel: r, rootHeight: i, resizeGeneration: a, previousContext: o } = e, s = o?.scrollTop, c = o?.root === n && o.sentinel === r && o.resizeGeneration !== a, l = !1, u = !0, d = !1, f = !1, p = n.scrollTop, m = () => qf({
		direction: t,
		rootRect: n.getBoundingClientRect(),
		sentinelRect: r.getBoundingClientRect(),
		rootHeight: i
	}), h = () => {
		e.setSentinelIntersecting(!1), e.clearAwaitingExit(), d = !1, f = !1;
	}, g = () => {
		u && !d && (t === "newer" && e.isAwaitingExit() || e.canAutoLoad() && (e.isAutoLoading() ? f = !0 : t === "older" && e.isAwaitingExit() || (f = !1, e.load())));
	}, _ = (e) => t === "older" ? e > p : e < p, v = {
		root: n,
		sentinel: r,
		resizeGeneration: a,
		scrollTop: n.scrollTop,
		reconcileAfterCommit: () => {
			u && (p = n.scrollTop, m() || h());
		},
		resumeAfterLoad: () => {
			u && f && (f = !1, m() ? g() : h());
		},
		reconcileAfterWindowChange: () => {
			u && l && !d && (m() ? (e.setSentinelIntersecting(!0), g()) : h());
		}
	}, y = () => {
		if (!u) return;
		let t = n.scrollTop, r = _(t);
		p = t, m() ? r && (d = !1, e.setSentinelIntersecting(!0), g()) : h();
	}, b = () => typeof s == "number" && (t === "older" ? n.scrollTop <= s : n.scrollTop >= s), x = new IntersectionObserver((t) => {
		if (!u) return;
		let i = t.filter((e) => e.target === r);
		for (let [t, r] of i.entries()) {
			let a = !l;
			l = !0;
			let o = n.getBoundingClientRect(), s = o.width > 0 && o.height > 0 ? m() : r.isIntersecting, u = i.slice(t + 1).some((e) => e.isIntersecting);
			!r.isIntersecting && s && !u || r.isIntersecting && !s || (e.setSentinelIntersecting(r.isIntersecting), r.isIntersecting ? a && c && b() ? d = !0 : (d = !1, g()) : h());
		}
	}, {
		root: n,
		rootMargin: Jf(t, i),
		threshold: 0
	});
	return m() || h(), x.observe(r), n.addEventListener("scroll", y, { passive: !0 }), {
		context: v,
		dispose: () => {
			u = !1, d = !1, f = !1, n.removeEventListener("scroll", y), x.disconnect();
		}
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryRelatedEventsFetchService.ts
function Xf(e, t) {
	let n = t.relayConfig, r = [...t.relayHints, ...t.knownChildren.flatMap((e) => e.relayUrls)], i = n ? [...G.extractReadRelays(n), ...G.extractWriteRelays(n)] : [], a = G.sanitizeExternalRelayUrls([...r, ...i], { limit: 8 }), o = G.sanitizeExternalRelayUrls(jt(r, 8) ?? (a.length ? a : ce), { limit: 8 }), s = {
		eventId: t.event.id,
		targetAuthorPubkey: t.event.pubkey,
		targetKind: t.event.kind
	}, c = Wt({ event: t.event }), l = /* @__PURE__ */ new Map(), u = /* @__PURE__ */ new Map(), d = /* @__PURE__ */ new Set(), f = !1, p = Date.now(), m = new Je(3e3, () => {
		[...d].forEach((e) => e());
	}), h = (e, t) => {
		let n = e.get(t.event.id);
		(!n || fe(n.event, t.event)) && e.set(t.event.id, {
			event: t.event,
			relayUrls: [.../* @__PURE__ */ new Set([...n?.relayUrls ?? [], ...t.relayUrls])]
		});
	}, g = (e) => {
		if (e.kind === 7) {
			let t = bt(e).reference;
			return !!t && ut(t, s);
		}
		return !!c && Ut({
			child: e,
			parent: c
		}).valid;
	}, _ = (n) => new Promise((r) => {
		let i = `related-${Date.now()}-${Math.random().toString(36).slice(2)}`, a = Ke(i), s, c = /* @__PURE__ */ new Map(), u = !1, f, _, v = (e) => {
			u || (u = !0, f?.unsubscribe(), _?.unsubscribe(), d.delete(y), r(e));
		}, y = () => v("cancelled");
		d.add(y);
		try {
			if (_ = e.createAllMessageObservable().subscribe((e) => {
				Array.isArray(e.message) && e.message[1] === `${i}:0` && e.message[0] === "EVENT" && c.set(e.from, (c.get(e.from) ?? 0) + 1);
			}), f = qe(e, a, { on: { relays: o } }, {
				operation: m,
				deadlineAt: p + 2e3,
				quorum: !1,
				source: (t, n) => vt(e, t, n),
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
		let i = cn.fetchDeletionRequests(e, {
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
var Zf = 86400, Qf = 6e3, $f = 8;
function ep(e) {
	return Number.isFinite(e) ? Math.max(1, Math.trunc(e ?? 100)) : 100;
}
function tp(e) {
	return Array.from(e.values()).map((e) => ({
		parentEventId: e.parentEventId,
		event: e.event,
		relayUrls: Array.from(e.relayUrls).sort((e, t) => e.localeCompare(t))
	})).sort((e, t) => e.event.created_at === t.event.created_at ? e.event.id.localeCompare(t.event.id) : e.event.created_at - t.event.created_at);
}
function np(e) {
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
var rp = new class {
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
		let n = Ke(), r = np(t), i = new Map(r.map((e) => [e.eventId, e])), a = r.map((e) => e.eventId), o = this.resolveRelayUrls([...t.relayHints ?? [], ...r.flatMap((e) => e.relayHints)], t.relayConfig, t.relayLimit), s = ep(t.limit), c = Math.max(0, Math.trunc(Math.min(...r.map((e) => e.createdAt))) - Zf), l = /* @__PURE__ */ new Map(), u = !1, d, f, p, m = () => {
			f?.unsubscribe?.(), f = void 0;
		}, h = (e) => ({
			status: e === "failed" && l.size > 0 ? "partial" : e,
			events: tp(l),
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
					f = qe(e, n, { on: o.length > 0 ? { relays: o } : { defaultReadRelays: !0 } }, {
						timeoutMs: Math.min(6e3, t.timeoutMs ?? Qf),
						quorum: !0,
						source: (t, n) => vt(e, t, n),
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
		let i = he(r).parentId, a = i ? t.get(i) : null;
		if (!a || !Ut({
			child: r,
			parent: a
		}).valid) return;
		let o = G.sanitizeExternalRelayUrls(typeof n.from == "string" ? [n.from] : [], { limit: 1 })[0], s = e.get(r.id);
		s ? fe(s.event, r) ? o && s.relayUrls.add(o) : this.console.warn("post_history_reply_fetch_packet_conflict", r.id) : e.set(r.id, {
			parentEventId: a.eventId,
			event: r,
			relayUrls: new Set(o ? [o] : [])
		});
	}
	resolveRelayUrls(e, t, n) {
		let r = Number.isFinite(n) ? Math.max(1, Math.trunc(n ?? $f)) : $f, i = jt(e, r);
		if (i) return i;
		let a = t ? [...G.extractReadRelays(t), ...G.extractWriteRelays(t)] : [], o = G.sanitizeExternalRelayUrls([...e ?? [], ...a], { limit: r });
		return o.length > 0 ? o : G.sanitizeExternalRelayUrls(ce, { limit: r });
	}
}();
function ip(e) {
	return typeof e == "number" && Number.isFinite(e);
}
function ap(e) {
	if (!e || typeof e != "object") return !1;
	let t = e;
	return typeof t.parentEventId == "string" && (t.completeness === "complete" || t.completeness === "partial") && ip(t.fetchedAt) && ip(t.requestStartedAt) && t.schemaVersion === 1;
}
function op(e, t) {
	return e ? e.requestStartedAt > t.requestStartedAt || e.requestStartedAt === t.requestStartedAt && e.completeness === "complete" && t.completeness === "partial" : !1;
}
var sp = new class {
	db;
	now;
	constructor(e = We, t = Date.now) {
		this.db = e, this.now = t;
	}
	async get(e) {
		if (!e) return null;
		let t = await this.db.postHistoryDirectReplyFetchMeta.get(e);
		return !t || !ap(t.value) ? null : {
			...t.value,
			updatedAt: t.updatedAt
		};
	}
	async getForParentEventIds(e) {
		let t = Array.from(new Set(e.filter((e) => !!e)));
		return t.length === 0 ? [] : (await this.db.postHistoryDirectReplyFetchMeta.bulkGet(t)).flatMap((e) => !e || !ap(e.value) ? [] : [{
			...e.value,
			updatedAt: e.updatedAt
		}]);
	}
	async save(e) {
		return !e.parentEventId || !ip(e.fetchedAt) || !ip(e.requestStartedAt) ? null : this.db.transaction("rw", this.db.postHistoryDirectReplyFetchMeta, async () => {
			let t = await this.get(e.parentEventId);
			if (op(t, e)) return t;
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
}(), cp = {
	totalCount: 0,
	groups: []
};
function lp(e) {
	if (!Mn(e.content)) return;
	let t = Nn(e.content);
	if (t) return Pn(e.tags ?? []).get(t)?.url;
}
function up(e) {
	if (e.length === 0) return cp;
	let t = [], n = /* @__PURE__ */ new Map(), r = 0;
	for (let i of e) {
		if (i.kind !== 7) continue;
		r += 1;
		let e = lp(i), a = n.get(i.content);
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
	return r === 0 ? cp : {
		totalCount: r,
		groups: t
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryThreadGraphDeletionState.ts
function dp(e, t, n) {
	return !t || !n ? !1 : !!e[t]?.[n];
}
function fp(e, t) {
	let n = e;
	for (let [e, r] of t.entries()) {
		let t = n[e] ?? {}, i = t;
		for (let e of r) i[e] || (i = {
			...i,
			[e]: !0
		});
		i !== t && (n = {
			...n,
			[e]: i
		});
	}
	return n;
}
function pp(e, t) {
	let n = {}, r = !1;
	for (let [i, a] of Object.entries(e.childrenByParentId)) {
		let e = a.filter((e) => e !== t);
		n[i] = e, e.length !== a.length && (r = !0);
	}
	let i = e.parentByChildId;
	if (e.parentByChildId[t]) {
		let { [t]: n, ...r } = e.parentByChildId;
		i = r;
	}
	return {
		childrenByParentId: r ? n : e.childrenByParentId,
		parentByChildId: i
	};
}
function mp(e) {
	let t = /* @__PURE__ */ new Set();
	for (let [n, r] of Object.entries(e.parentByChildId)) {
		if (r !== e.eventId) continue;
		let i = e.nodesById[e.eventId];
		e.authorPubkey && i && i.authorPubkey !== e.authorPubkey || t.add(n);
	}
	return t;
}
function hp(e, t, n) {
	let r = [];
	for (let i of e) t.has(n(i)) && r.push(i);
	return r;
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryThreadGraphChildrenExpansionState.ts
function gp(e, t) {
	return {
		...e,
		loadingChildren: t.showInitialLoading,
		revalidatingChildren: !t.showInitialLoading,
		visibleChildren: t.prefetchOnly ? e.visibleChildren : e.visibleChildren || t.showInitialLoading,
		childrenError: null
	};
}
function _p(e, t = {}) {
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
function vp(e, t) {
	return {
		...e,
		loadingChildren: !1,
		revalidatingChildren: !1,
		visibleChildren: e.visibleChildren,
		childrenError: t.nextError
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryThreadGraphCachedChildren.ts
function yp(e) {
	return G.sanitizeExternalRelayUrls(e, { limit: 8 });
}
function bp(e) {
	return Array.from(new Set(e));
}
function xp(e) {
	return e?.completeness === "complete" ? e.fetchedAt : null;
}
function Sp(e) {
	let t = e.map((e) => e.fetchedAt).filter((e) => Number.isFinite(e));
	return t.length > 0 ? Math.max(...t) : null;
}
function Cp(e, t) {
	let n = new Set(t), r = /* @__PURE__ */ new Map();
	for (let t of e) {
		if (!n.has(t.parentEventId)) continue;
		let e = r.get(t.parentEventId) ?? [];
		e.push(t), r.set(t.parentEventId, e);
	}
	for (let e of r.values()) e.sort((e, t) => e.createdAt === t.createdAt ? e.eventId.localeCompare(t.eventId) : e.createdAt - t.createdAt);
	return r;
}
function wp(e) {
	let t = Wt({
		event: e.parentNode.event,
		relayHints: e.parentNode.relayUrls
	});
	return !!t && Ut({
		child: wr(e.record),
		parent: t
	}).valid;
}
function Tp(e) {
	let t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map(), r = [], i = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Map(), o = (e, t) => {
		a.set(e, yp([...a.get(e) ?? [], ...t]));
	};
	for (let a of e.parentEventIds) {
		let s = e.anchorNodesByParentId.get(a);
		if (!s) continue;
		o(s.authorPubkey, s.relayUrls);
		let c = [], l = [];
		for (let t of e.visibleRecordsByParentId.get(a) ?? []) t.kind === 7 ? (c.push(t), t.authorPubkey && (i.add(t.authorPubkey), o(t.authorPubkey, s.relayUrls))) : [
			1,
			42,
			1111
		].includes(t.kind) && (wp({
			parentNode: s,
			record: t
		}) ? (l.push(t), o(t.authorPubkey, t.relayUrls)) : r.push(t.eventId));
		t.set(a, c), n.set(a, l);
	}
	return {
		reactionRecordsByParentId: t,
		directReplyRecordsByParentId: n,
		invalidDirectReplyRecordIds: r,
		reactionAuthorPubkeys: i,
		profileRelayUrlsByPubkey: a
	};
}
function Ep(e, t) {
	let n = (t) => {
		let n = e.nodesById[t];
		return n ? dp(e.deletedEventIdsByPubkey, n.authorPubkey, t) : !1;
	}, r = { ...e.nodesById }, i = { ...e.parentByChildId }, a = { ...e.childrenByParentId }, o = { ...e.expansionByAnchorNodeKey }, s = { ...e.reactionSummaryByParentId }, c = { ...e.reactionRecordsByParentId }, l = { ...e.reactionProfilesByPubkey }, u = { ...e.reactionReadModelByParentId }, d = !1, f = !1, p = !1, m = !1, h = /* @__PURE__ */ new Map(), g = (e) => {
		let t = ur(r[e.eventId], e);
		return r[t.eventId] = t, d = !0, t;
	}, _ = (e, t) => {
		t && (i[e] = t, f = !0);
	};
	for (let e of t.targetParentIds) {
		let n = t.anchorNodesByParentId.get(e);
		if (!n) continue;
		let r = g(n);
		_(r.eventId, r.parentEventId);
		let i = t.reactionRecordsByParentId.get(e) ?? [];
		s[e] = up(i), c[e] = i;
	}
	for (let [e, n] of Object.entries(t.cachedReactionProfilesByPubkey)) l[e] = n;
	for (let n of t.targetParentIds) {
		if (!t.anchorNodesByParentId.get(n)) continue;
		let r = [], i = [];
		for (let a of t.directReplyRecordsByParentId.get(n) ?? []) {
			let t = wr(a);
			if (dp(e.deletedEventIdsByPubkey, t.pubkey, t.id)) continue;
			let o = g(Er({
				event: t,
				relayUrls: yp(a.relayUrls),
				sources: ["reply-db", "inbound-sync"]
			}));
			o.eventId !== n && (_(o.eventId, n), i.push(o.eventId), r.push(a));
		}
		h.set(n, i);
		let a = t.metadataByParentId.get(n) ?? null, s = t.metadataReadFailedParentIds.has(n);
		if (r.length === 0 && !a) continue;
		let c = t.postsByParentId.get(n);
		if (!c) continue;
		let l = cr(c.eventId, n), u = o[l] ?? Cr();
		o[l] = a?.completeness === "partial" && r.length === 0 ? {
			...u,
			loadedChildren: !1,
			loadingChildren: !1,
			revalidatingChildren: !1,
			childrenError: null,
			lastFetchedChildrenAt: null
		} : _p(u, { lastFetchedChildrenAt: s ? null : a ? xp(a) : Sp(r) }), m = !0;
	}
	for (let [e, t] of h) {
		let i = a[e] ?? [];
		a[e] = or(bp([...i, ...t]).filter((t) => t !== e && !n(t)), r), p = !0;
	}
	for (let [e, n] of t.knownNodeProfilesByPubkey) if (n) for (let [t, i] of Object.entries(r)) i.authorPubkey === e && (r[t] = ur(i, {
		...i,
		profile: n
	}), d = !0);
	for (let e of t.targetParentIds) u[e] = Sr(c[e] ?? [], l);
	return {
		nodesById: d ? r : e.nodesById,
		parentByChildId: f ? i : e.parentByChildId,
		childrenByParentId: p ? a : e.childrenByParentId,
		expansionByAnchorNodeKey: m ? o : e.expansionByAnchorNodeKey,
		reactionSummaryByParentId: s,
		reactionRecordsByParentId: c,
		reactionProfilesByPubkey: l,
		reactionReadModelByParentId: u
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryThreadGraphChildPrefetch.ts
function Dp(e) {
	return {
		eventId: e.batchEventIds[0] ?? "",
		eventIds: e.batchEventIds,
		createdAt: Math.min(...e.batchNodes.map((e) => e.event.created_at)),
		relayHints: e.relayHints,
		parents: e.batchNodes.map((e) => Wt({
			event: e.event,
			relayHints: [...e.relayUrls, ...he(e.event).relayHints]
		})).filter((e) => e !== null),
		relayConfig: e.relayConfig
	};
}
function Op(e, t) {
	let n = new Set(t);
	return e.filter((e) => n.has(e.parentEventId) && e.event.id !== e.parentEventId);
}
function kp(e) {
	let t = new Set(e.batchEventIds), n = /* @__PURE__ */ new Map(), r = new Map(e.directReplyItems.map((e) => [e.event.id, e.parentEventId]));
	for (let i of e.visibleItems) {
		let e = r.get(i.event.id);
		if (!e || !t.has(e)) continue;
		let a = n.get(e) ?? [];
		a.push(i), n.set(e, a);
	}
	return n;
}
function Ap(e) {
	return e.effectiveFetchedAt !== null || e.visibleChildCount > 0;
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryThreadGraphTaskTracker.ts
function jp() {
	let e = 0, t = 0, n = /* @__PURE__ */ new Map(), r = 0, i = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map();
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
		createParentRequestToken(e) {
			return r += 1, i.set(e, r), r;
		},
		getParentRequestToken(e) {
			return i.get(e);
		},
		deleteParentRequestToken(e, t) {
			i.get(e) === t && i.delete(e);
		},
		clearParentRequestTokens() {
			i.clear();
		},
		replaceChildrenFetchTask(e, t) {
			a.get(e)?.cancel(), a.set(e, t);
		},
		deleteChildrenFetchTask(e) {
			a.delete(e);
		},
		replaceDeletionFetchTask(e, t) {
			o.get(e)?.cancel(), o.set(e, t);
		},
		deleteDeletionFetchTask(e) {
			o.delete(e);
		},
		cancelAndClearFetchTasks() {
			a.forEach((e) => e.cancel()), o.forEach((e) => e.cancel()), a.clear(), o.clear();
		}
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryThreadGraphParentLoadingIndicator.ts
function Mp(e = {}) {
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
function Np(e, t) {
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
function Pp(e, t = {}) {
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
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryThreadGraphApplyStrategies.ts
function Fp(e) {
	return e.status === "deleted" ? "deleted" : e.status === "not-found" ? "not-found" : e.status === "resolved" && e.event ? "resolved" : "failed";
}
function Ip(e) {
	return e.nextRecordsLength > 0 ? "resolved" : e.resultEventsLength > 0 ? "deleted" : "not-found";
}
function Lp(e) {
	return {
		deleted: () => {
			e.snapshot.authorPubkey && (e.hideEvent(e.snapshot.authorPubkey, e.parentEventId), e.markParentDeletedForEvent(e.parentEventId, e.snapshot.authorPubkey, { revealKnownParent: !0 })), e.setParentDeleted();
		},
		"not-found": () => {
			e.updateExpansion((t) => ({ ...Pp(t, {
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
			e.upsertParentEdge(t.eventId, t.parentEventId), e.updateExpansion((t) => ({ ...Pp(t, {
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
function Rp(e) {
	let t = () => {
		e.updateExpansion((t) => ({ ..._p(t, {
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
function zp(e) {
	e.updateExpansion((t) => ({
		...t,
		loadingParent: !1,
		revalidatingParent: !1,
		visibleParent: t.visibleParent,
		parentError: e.showInitialLoading ? e.errorCode ?? "fetch_failed" : t.parentError,
		showParentLoadingIndicator: !1
	}));
}
function Bp(e) {
	e.updateExpansion((t) => ({ ...vp(t, { nextError: e.showInitialLoading && !e.prefetchOnly ? e.errorCode ?? "fetch_failed" : t.childrenError }) }));
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryThreadGraphLoadDecision.ts
function Vp(e) {
	return typeof e.lastFetchedAt != "number" || (e.now ?? Date.now()) - e.lastFetchedAt >= e.ttlMs;
}
function Hp(e) {
	return !e.displayedCached || e.force ? !1 : !Vp({
		lastFetchedAt: e.lastFetchedAt,
		ttlMs: e.ttlMs,
		now: e.now
	});
}
function Up(e) {
	let t = Hp(e);
	return {
		skipRevalidate: t,
		shouldShowInitialLoading: !e.displayedCached,
		shouldPrefetchReplyCountsOnSkip: t && !e.prefetchOnly
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryThreadGraphFetchCoordinator.ts
function Wp(e) {
	return !e.loading && !e.revalidating ? !1 : (e.onInFlight(), e.loading && e.onLoadingInFlight?.(), !0);
}
function Gp(e) {
	return e.hasVisibleData ? Vp({
		lastFetchedAt: e.lastFetchedAt,
		ttlMs: e.ttlMs,
		now: e.now
	}) : !1;
}
async function Kp(e) {
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
async function qp(e) {
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
async function Jp(e) {
	let t = e.strategies[e.status] ?? e.fallback;
	t && await t();
}
async function Yp(e) {
	if (e.skipRevalidate) return;
	let t = e.runRevalidate({ showInitialLoading: e.shouldShowInitialLoading });
	e.awaitWhenInitialLoading && e.shouldShowInitialLoading && await t;
}
async function Xp(e) {
	let t = Up(e);
	return t.shouldPrefetchReplyCountsOnSkip && e.onSkipPrefetchReplyCounts?.(), await Yp({
		skipRevalidate: t.skipRevalidate,
		shouldShowInitialLoading: t.shouldShowInitialLoading,
		awaitWhenInitialLoading: e.awaitWhenInitialLoading,
		runRevalidate: e.runRevalidate
	}), t;
}
async function Zp(e) {
	if (Wp({
		loading: e.loading,
		revalidating: e.revalidating,
		onInFlight: e.onInFlight,
		onLoadingInFlight: e.onLoadingInFlight
	}) || e.shouldHandleLoadedState && await e.handleLoadedState()) return;
	e.prepareFreshLoadState();
	let t = await e.displayCachedForFreshLoad();
	await Xp({
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
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryThreadGraphStateSharing.ts
function Qp(e, t) {
	return qr(e, t);
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/hooks/usePostHistoryThreadGraph.svelte.ts
var $p = 20, em = 12, tm = 2, nm = 4, rm = 4, im = 3e5, am = class extends Error {};
function om(e) {
	if (e === "failed") throw Error("post_history_reply_fetch_failed");
	if (e === "cancelled") throw new am();
}
function sm(e) {
	return (t) => {
		t instanceof am ? e.updateExpansion((e) => ({ ...vp(e, { nextError: e.childrenError }) })) : Bp({
			...e,
			errorCode: "fetch_failed"
		});
	};
}
function cm(e) {
	return e === "partial" ? "partial" : "complete";
}
var lm = 3e5, um = 0;
function dm(e, t) {
	let n = new Set(e.map((e) => e.eventId));
	return (t && t.length > 0 ? Array.from(new Set(t)) : Array.from(n)).filter((e) => n.has(e));
}
function fm(e) {
	if (!e.parentNode) return null;
	let t = Wt({
		event: e.parentNode.event,
		relayHints: e.parentNode.relayUrls
	});
	return t && Ut({
		child: e.childNode.event,
		parent: t
	}).valid ? e.parentNode : null;
}
function pm({ onRelatedEventsRefreshed: e, onDeletedPost: t, relatedEventsFetch: n = Xf, getShow: r, getSessionOpen: i = r, getPubkeyHex: a, getRxNostr: o, getRelayConfig: s, postHistoryRepositoryImpl: c = Q, directReplyRecordsAdapterImpl: l = tn, reactionRecordsAdapterImpl: u = dn, childInteractionsRepositoryImpl: d = ft, deletionRequestsRepositoryImpl: f = Xt, directReplyFetchMetadataRepositoryImpl: p = sp, profileSyncCoordinator: m = void 0, contextFetchService: h = rn, replyFetchService: g = rp, deletionFetchService: _ = cn, relatedTargetResolver: v = void 0 }) {
	let y = m ?? mr({
		getShow: r,
		getRxNostr: o
	}), b = !m, x = v ?? hr({
		getShow: r,
		getRxNostr: o,
		getRelayConfig: s,
		postHistoryRepositoryImpl: c,
		contextFetchService: h,
		deletionRequestsRepositoryImpl: f,
		deletionFetchService: _,
		profileSyncCoordinator: y
	}), S = !v, C = `post-history-thread-graph-parent:${++um}`, T = H({}), E = H({}), D = H({}), k = H({}), A = H({}), M = H(0), N = Mp(), ee = /* @__PURE__ */ new Set(), te = /* @__PURE__ */ new Set(), I = /* @__PURE__ */ new Set(), L = /* @__PURE__ */ new Set(), ne = H({}), R = H({}), z = H({}), B = H({}), V = jp(), ie = H(P({})), U = /* @__PURE__ */ new Map(), ae = /* @__PURE__ */ new Map();
	function W(i, m = i.eventId) {
		let h = U.get(m);
		if (h) return h.promise;
		let g = bt(i, m), _ = o();
		if (!g || !_) return O(ie, {
			...F(ie),
			[m]: "failed"
		}, !0), Promise.resolve();
		let v = a(), y = V.getRequestId(), b = !1, x, S = () => !b && r() && v === a() && _ === o() && y === V.getRequestId();
		O(ie, {
			...F(ie),
			[m]: "loading"
		}, !0);
		let C = Date.now(), w = {
			cancel() {
				b = !0, x?.cancel();
			},
			promise: Promise.resolve()
		};
		return U.set(m, w), w.promise = (async () => {
			try {
				let r = await St(We), [a, o] = await Promise.all([l.getDirectReplyRecords(m), fr(m, u)]);
				if (!S()) return;
				x = n(_, {
					event: g.event,
					knownChildren: [...a, ...o].map((e) => ({
						event: wr(e),
						relayUrls: e.relayUrls
					})),
					relayHints: Y(i, g),
					relayConfig: s()
				});
				let h = await x.promise;
				if (!S() || h.status === "cancelled" || (await f.upsertValidDeletionRequests({
					targetEvents: h.targets,
					deletionEvents: h.deletions,
					fetchedAt: h.fetchedAt
				}), !S()) || (await Re(h.targets), !S())) return;
				for (let e of h.targets) {
					let n = h.deletions.find((t) => $e(t.event, e));
					if (n) {
						if (await c.markDeleted(e.id, n.event.id, n.event.created_at * 1e3), !S()) return;
						t?.(e.id, n.event.created_at * 1e3, n.event.id);
					}
				}
				let v = h.events.filter((e) => !X(e.event.pubkey, e.event.id));
				if (v.length > 0 && await d.upsertChildInteractions({
					parentEventId: m,
					events: v,
					reactionTarget: {
						eventId: m,
						targetAuthorPubkey: g.event.pubkey,
						targetKind: g.event.kind
					},
					fetchedAt: h.repliesComplete ? h.fetchedAt : null,
					expectedChildGeneration: r
				}), !S() || (await p.save({
					parentEventId: m,
					completeness: h.repliesComplete ? "complete" : "partial",
					fetchedAt: h.fetchedAt,
					requestStartedAt: C
				}), !S()) || (await kt([{
					...i,
					id: m,
					eventId: m,
					pubkeyHex: g.event.pubkey,
					kind: g.event.kind,
					content: g.event.content,
					tags: g.event.tags,
					createdAt: g.event.created_at,
					postedAt: g.event.created_at * 1e3,
					rawEvent: g.event
				}], [m], S), !S())) return;
				let y = await Ve(await l.getDirectReplyRecords(m));
				if (!S() || (await jt(g, y, ["reply-db"], { resolveProfiles: !1 }), !S())) return;
				K(i.eventId, m, (e) => _p(e, {
					visibleChildren: !0,
					lastFetchedChildrenAt: h.repliesComplete ? h.fetchedAt : null
				})), O(ie, {
					...F(ie),
					[m]: h.status
				}, !0), e?.(h.status);
			} catch {
				S() && O(ie, {
					...F(ie),
					[m]: "failed"
				}, !0);
			} finally {
				U.get(m) === w && U.delete(m);
			}
		})(), w.promise;
	}
	function oe(e) {
		let t = F(R)[e] ?? [];
		O(B, {
			...F(B),
			[e]: Sr(t, F(z))
		});
	}
	function se(e, t) {
		O(z, {
			...F(z),
			[e]: t
		});
		for (let [t, n] of Object.entries(F(R))) n.some((t) => t.authorPubkey === e) && oe(t);
	}
	function ce(e) {
		return F(ne)[e] ?? cp;
	}
	function le(e) {
		return F(B)[e] ?? gr;
	}
	function ue(e, t) {
		return F(k)[cr(e, t)] ?? Cr();
	}
	function K(e, t, n) {
		let r = cr(e, t);
		O(k, {
			...F(k),
			[r]: n(F(k)[r] ?? Cr())
		});
	}
	function de(e) {
		let t = Er(e), n = ur(F(T)[t.eventId], t);
		return O(T, {
			...F(T),
			[n.eventId]: n
		}), n;
	}
	function q(e, t) {
		t && O(E, {
			...F(E),
			[e]: t
		});
	}
	function fe(e, t) {
		let n = F(D)[e] ?? [], r = or(bp([...n, ...t]).filter((t) => t !== e && !je(t)), F(T));
		O(D, {
			...F(D),
			[e]: r
		});
	}
	function pe(e) {
		let t = rr(e);
		return Er({
			event: t,
			relayUrls: yp([
				...e.relayHints,
				...e.acceptedRelays,
				...e.fetchedRelays ?? []
			]),
			sources: ["anchor", "history-record"]
		});
	}
	function me(e) {
		let t = pe(e), n = de({
			event: t.event,
			relayUrls: t.relayUrls,
			sources: t.sources
		});
		return q(n.eventId, n.parentEventId), _e(n.authorPubkey, n.relayUrls), n;
	}
	function ge(e, t) {
		if (!e || !t) return;
		let n = !1, r = { ...F(T) };
		for (let [i, a] of Object.entries(F(T))) a.authorPubkey === e && (r[i] = ur(a, {
			...a,
			profile: t
		}), n = !0);
		n && O(T, r);
	}
	function _e(e, t = []) {
		ge(e, y.ensureProfile(e, t));
	}
	let ve = y.subscribe((e, t) => {
		r() && (ge(e, t), se(e, t));
	});
	async function ye(e) {
		let t = yp(e.relayUrls ?? []), n = de({
			...e,
			relayUrls: t
		});
		return _e(e.event.pubkey, t), n;
	}
	function be(e, t, n) {
		let r = zr.buildContext(e, t, n);
		return r ? zr.toDescriptor(r, C) : null;
	}
	function J(e) {
		if (!e) return null;
		let t = x.getTargetSnapshot(e.eventId);
		if (t?.status !== "resolved" || !t.event) return e;
		let n = yp([...e.relayUrls, ...t.relayHints]), r = t.profile ?? e.profile ?? null;
		return e.event === t.event && e.profile === r && _t(e.relayUrls, n) ? e : ur(e, {
			...e,
			event: t.event,
			relayUrls: n,
			profile: r
		});
	}
	function xe(e, t) {
		return zr.getRelayHints(e, t);
	}
	function Y(e, t) {
		let n = he(t.event);
		return yp([
			...t.relayUrls,
			...n.relayHints,
			...e.relayHints,
			...e.acceptedRelays,
			...e.fetchedRelays ?? []
		]);
	}
	function Se(e, t) {
		return G.sanitizeExternalRelayUrls([
			...t.flatMap((e) => {
				let t = he(e.event);
				return [...e.relayUrls, ...t.relayHints];
			}),
			...e.relayHints,
			...e.acceptedRelays,
			...e.fetchedRelays ?? []
		], { limit: rm });
	}
	function Ce(e) {
		N.clear(e);
	}
	function we(e, t) {
		let n = cr(e, t);
		N.schedule(n, () => {
			let n = ue(e, t);
			n.loadingParent && n.visibleParent && K(e, t, (e) => ({
				...e,
				showParentLoadingIndicator: !0
			}));
		});
	}
	function Te(e, t) {
		return (F(D)[e] ?? []).map((e) => J(F(T)[e])).filter((e) => !!e).filter((e) => !X(e.authorPubkey, e.eventId)).map((e) => ({
			event: e.event,
			profile: e.profile,
			relayUrls: [...e.relayUrls],
			isOwnReply: e.authorPubkey === t
		}));
	}
	function Ee(e) {
		return (F(D)[e] ?? []).filter((e) => {
			let t = F(T)[e];
			return t && !X(t.authorPubkey, t.eventId);
		});
	}
	function De(e, t, n) {
		return Ee(e).filter((e) => !t.includes(e) && !n.has(e));
	}
	function Oe(e, t, n, r = [], i = 0, a = /* @__PURE__ */ new Set()) {
		let o = J(F(T)[t]);
		if (!o || X(o.authorPubkey, o.eventId) || r.includes(t) || a.has(t)) return null;
		a.add(t);
		let s = [...r, t], c = ue(e, t), l = o.parentEventId, u = l ? r.includes(l) : !1, d = l ? fm({
			childNode: o,
			parentNode: J(F(T)[l] ?? null)
		}) : null, f = c.visibleParent && d && !u && i > -20 ? Oe(e, d.eventId, n, s, i - 1, a) : null, p = i < $p ? De(t, s, a) : [], m = p.length, h = c.visibleChildren && m > 0, g = h ? p.map((t) => Oe(e, t, n, s, i + 1, a)).filter((e) => e !== null) : [];
		return {
			relatedEventsStatus: F(ie)[t],
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
	function ke(e) {
		let t = Qp(ae.get(e.eventId), Ae(e));
		return ae.set(e.eventId, t), t;
	}
	function Ae(e) {
		F(M);
		let t = J(F(T)[e.eventId]) ?? pe(e), n = ue(e.eventId, e.eventId), r = a() ?? e.pubkeyHex, i = /* @__PURE__ */ new Set([e.eventId]), o = t.parentEventId, s = o ? J(F(T)[o] ?? null) : null, c = s && !X(s.authorPubkey, s.eventId) ? fm({
			childNode: t,
			parentNode: s
		}) : null, l = c && n.visibleParent ? Oe(e.eventId, c.eventId, r, [e.eventId], -1, i) : null, u = De(e.eventId, [e.eventId], i), d = new Set(u), f = Te(e.eventId, r).filter((e) => d.has(e.event.id)), p = u.length, m = n.visibleChildren && p > 0, h = m ? u.map((t) => Oe(e.eventId, t, r, [e.eventId], 1, i)).filter((e) => e !== null) : [];
		return {
			relatedEventsStatus: F(ie)[e.eventId],
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
			reactionSummary: ce(e.eventId),
			reactionReadModel: le(e.eventId),
			replyItems: f,
			replyNodeStates: h
		};
	}
	function X(e, t) {
		return dp(F(A), e, t);
	}
	function je(e) {
		let t = F(T)[e];
		return t ? X(t.authorPubkey, e) : !1;
	}
	function Me(e, t) {
		e && t && !X(e, t) && O(A, {
			...F(A),
			[e]: {
				...F(A)[e] ?? {},
				[t]: !0
			}
		});
	}
	function Ne(e, t, n = {}) {
		let r = mp({
			parentByChildId: F(E),
			nodesById: F(T),
			eventId: e,
			authorPubkey: t
		});
		if (r.size !== 0) for (let [e, t] of Object.entries(F(k))) {
			let i = e.indexOf(":");
			if (i < 0) continue;
			let a = e.slice(0, i), o = e.slice(i + 1);
			r.has(o) && (t?.loadedParent || t?.visibleParent) && K(a, o, (e) => Pp(e, {
				visibleParent: n.revealKnownParent ? !0 : e.visibleParent,
				parentDeleted: !0,
				lastFetchedParentAt: Date.now()
			}));
		}
	}
	function Pe(e, t = {}) {
		for (let [n, r] of e.entries()) for (let e of r) Ne(e, n, t);
	}
	function Fe(e) {
		let t = fp(F(A), e);
		t !== F(A) && (O(A, t), Pe(e));
	}
	function Ie(e) {
		let t = pp({
			childrenByParentId: F(D),
			parentByChildId: F(E)
		}, e);
		t.childrenByParentId !== F(D) && O(D, t.childrenByParentId), t.parentByChildId !== F(E) && O(E, t.parentByChildId);
	}
	async function Le(e, t = {}) {
		if (!e?.id || X(e.pubkey, e.id)) return !0;
		if (t.checkPostHistoryRepository === !1) return !1;
		try {
			if (typeof (await c.getByEventId(e.id))?.deletedAt == "number") return Me(e.pubkey, e.id), Ie(e.id), !0;
		} catch {}
		return !1;
	}
	async function Z(e) {
		Fe(e);
		for (let t of e.values()) for (let e of t) Ie(e), await d.deleteChildInteractionByEventId(e);
	}
	async function Re(e) {
		await Z(await f.getDeletedTargets(e.map((e) => ({
			targetAuthorPubkey: e.pubkey,
			targetEventId: e.id
		}))));
	}
	async function ze(e, t, n, i = "default") {
		if (t.length === 0) return;
		let c = o();
		if (!c) return;
		let l = t.filter((e) => !X(e.pubkey, e.id));
		if (l.length === 0) return;
		let u = `${e}:deletions:${i}`, d = a(), p = V.getRequestId(), m = () => r() && V.getRequestId() === p && a() === d && o() === c, h = d ? pt(We, d) : Promise.resolve(0), g = _.fetchDeletionRequests(c, {
			targets: l.map((e) => ({
				event: e,
				relayUrls: F(T)[e.id]?.relayUrls ?? []
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
			d && e.events.length && Yt.archiveAdoptedAuthored(l.map((e) => ({ event: e })), {
				ownerPubkeyHex: d,
				expectedRevision: await h,
				isActive: m
			});
		} catch {
			return;
		} finally {
			m() && V.deleteDeletionFetchTask(u);
		}
		m() && await Re(l);
	}
	async function Be(e) {
		await Re(e);
		let t = [];
		for (let n of e) await Le(n) ? await d.deleteChildInteractionByEventId(n.id) : t.push(n);
		return t;
	}
	async function Ve(e) {
		let t = await Be(e.map((e) => wr(e)));
		return hp(e, new Set(t.map((e) => e.id)), (e) => e.eventId);
	}
	async function He(e) {
		let t = await Be(e.map((e) => e.event));
		return hp(e, new Set(t.map((e) => e.id)), (e) => e.event.id);
	}
	async function Ue(e) {
		return await Re([e.event]), !await Le(e.event, { checkPostHistoryRepository: e.checkPostHistoryRepository }) && (ze(e.anchorEventId, [e.event], e.relayHints), !0);
	}
	function Ge(e, t = e) {
		Ce(cr(e, t)), K(e, t, (e) => ({ ...Pp(e, {
			visibleParent: !0,
			parentDeleted: !0,
			lastFetchedParentAt: Date.now()
		}) }));
	}
	function Ke(e, t) {
		Ce(cr(e, t)), K(e, t, (e) => ({
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
	async function qe(e, t, n) {
		let i = n.parentEventId;
		if (!i) return !1;
		let o = x.getTargetSnapshot(i);
		if (o?.status === "deleted") return o.authorPubkey && (Me(o.authorPubkey, i), Ne(i, o.authorPubkey, { revealKnownParent: !0 })), Ge(e.eventId, t), !0;
		let s = J(F(T)[i] ?? null);
		if (s) {
			let i = Wt({
				event: s.event,
				relayHints: s.relayUrls
			});
			if (!i || !Ut({
				child: n.event,
				parent: i
			}).valid) return Ke(e.eventId, t), !1;
			let c = yp([...s.relayUrls, ...xe(e, n)]), l = await Ue({
				anchorEventId: e.eventId,
				event: s.event,
				relayHints: c,
				checkPostHistoryRepository: s.authorPubkey === a()
			});
			return r() ? l ? (K(e.eventId, t, (e) => ({ ...Pp(e, {
				parentDeleted: e.parentDeleted,
				lastFetchedParentAt: o?.updatedAt ?? e.lastFetchedParentAt
			}) })), !0) : (Ge(e.eventId, t), !0) : !1;
		}
		if (!o) return !1;
		if (o.authorPubkey && X(o.authorPubkey, i)) return Ge(e.eventId, t), !0;
		if (o.status === "resolved" && o.event) {
			let r = Wt({
				event: o.event,
				relayHints: o.relayHints
			});
			if (!r || !Ut({
				child: n.event,
				parent: r
			}).valid) return Ke(e.eventId, t), !1;
			let i = de({
				event: o.event,
				relayUrls: o.relayHints,
				sources: ["fetched-parent"],
				profile: o.profile
			});
			return q(i.eventId, i.parentEventId), K(e.eventId, t, (e) => ({ ...Pp(e, {
				parentDeleted: !1,
				lastFetchedParentAt: o.updatedAt ?? e.lastFetchedParentAt
			}) })), !0;
		}
		return o.status === "not-found" && (K(e.eventId, t, (e) => ({ ...Pp(e, {
			parentMissing: !0,
			parentDeleted: !1,
			lastFetchedParentAt: o.updatedAt ?? e.lastFetchedParentAt
		}) })), !0);
	}
	async function Je(e, t, n, i = {}) {
		let a = n.parentEventId;
		if (!a) return;
		let o = cr(e.eventId, t), s = V.getRequestId(), c = V.createParentRequestToken(o);
		K(e.eventId, t, (e) => ({ ...Np(e, { showInitialLoading: !!i.showInitialLoading }) })), i.showInitialLoading && we(e.eventId, t), await Kp({
			isActive: () => s === V.getRequestId() && c === V.getParentRequestToken(o) && r(),
			cleanup: () => {
				c === V.getParentRequestToken(o) && (Ce(o), V.deleteParentRequestToken(o, c));
			},
			onError: () => {
				zp({
					updateExpansion: (n) => K(e.eventId, t, n),
					showInitialLoading: !!i.showInitialLoading,
					errorCode: "fetch_failed"
				});
			},
			run: async ({ ensureActive: r }) => {
				let s = be(e, t, n);
				if (!s) return;
				let c = await x.ensureTarget(s, {
					force: !0,
					background: !i.showInitialLoading
				});
				if (!(!r() || (Ce(o), !c))) {
					if (c.status === "resolved" && c.event) {
						let r = Wt({
							event: c.event,
							relayHints: c.relayHints
						});
						if (!r || !Ut({
							child: n.event,
							parent: r
						}).valid) {
							Ke(e.eventId, t);
							return;
						}
					}
					await Jp({
						status: Fp(c),
						strategies: Lp({
							snapshot: c,
							parentEventId: a,
							showInitialLoading: !!i.showInitialLoading,
							updateExpansion: (n) => {
								K(e.eventId, t, n);
							},
							hideEvent: Me,
							markParentDeletedForEvent: Ne,
							setParentDeleted: () => {
								Ge(e.eventId, t);
							},
							isDeletedEvent: X,
							upsertNode: () => de({
								event: c.event,
								relayUrls: c.relayHints,
								sources: ["fetched-parent"],
								profile: c.profile
							}),
							upsertParentEdge: q
						})
					});
				}
			}
		});
	}
	async function Ye(e, t, n = {}) {
		let r = t === e.eventId ? me(e) : F(T)[t];
		if (!r?.parentEventId) return;
		let i = ue(e.eventId, t);
		await Zp({
			loading: i.loadingParent,
			revalidating: i.revalidatingParent,
			onInFlight: () => {
				K(e.eventId, t, (e) => ({
					...e,
					visibleParent: !0,
					showParentLoadingIndicator: !1
				}));
			},
			onLoadingInFlight: () => {
				we(e.eventId, t);
			},
			shouldHandleLoadedState: !n.force && i.loadedParent,
			handleLoadedState: async () => i.parentDeleted ? (Ge(e.eventId, t), !0) : (K(e.eventId, t, (e) => ({
				...e,
				visibleParent: !0,
				showParentLoadingIndicator: !1
			})), Gp({
				hasVisibleData: await qe(e, t, r),
				lastFetchedAt: i.lastFetchedParentAt,
				ttlMs: lm
			}) && Je(e, t, r), !0),
			prepareFreshLoadState: () => {
				K(e.eventId, t, (e) => ({
					...e,
					visibleParent: !0,
					loadingParent: !0,
					parentError: null,
					parentMissing: !1,
					parentDeleted: !1,
					showParentLoadingIndicator: !1
				})), we(e.eventId, t);
			},
			displayCachedForFreshLoad: async () => ({
				displayedCached: await qe(e, t, r),
				lastFetchedAt: ue(e.eventId, t).lastFetchedParentAt
			}),
			force: !!n.force,
			ttlMs: lm,
			awaitWhenInitialLoading: !0,
			runRevalidate: ({ showInitialLoading: n }) => Je(e, t, r, { showInitialLoading: n })
		});
	}
	async function Xe(e, t = {}) {
		await Ye(e, e.eventId, t);
	}
	function Ze(e) {
		Qe(e.eventId, e.eventId);
	}
	function Qe(e, t) {
		Ce(cr(e, t)), K(e, t, (e) => ({
			...e,
			visibleParent: !1,
			showParentLoadingIndicator: !1
		}));
	}
	async function et(e) {
		ue(e.eventId, e.eventId).visibleParent ? Ze(e) : await Xe(e);
	}
	function tt(e) {
		Xe(e, { force: !0 });
	}
	async function nt(e, t) {
		ue(e.eventId, t).visibleParent ? Qe(e.eventId, t) : await Ye(e, t);
	}
	function rt(e, t) {
		Ye(e, t, { force: !0 });
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
		return r ? null : n ? n.completeness === "complete" ? n.fetchedAt : null : Sp(t);
	}
	async function ot(e, t, n, i = {}) {
		let a = await l.getDirectReplyRecords(t);
		ze(e.eventId, a.map((e) => wr(e)), Y(e, n));
		let o = await Ve(a);
		if (!r() || o.length === 0) return !1;
		let s = await jt(n, o, ["reply-db"], { resolveProfiles: !i.prefetchOnly });
		if (!r() || s.length === 0) return !1;
		if (!r()) return !0;
		let c = await at(t, s);
		return r() && K(e.eventId, t, (e) => ({ ..._p(e, {
			visibleChildren: !i.prefetchOnly || e.visibleChildren,
			lastFetchedChildrenAt: c
		}) })), !0;
	}
	async function st(e, t, n, i = {}) {
		let a = cr(e.eventId, t), c = V.getRequestId(), u = V.createChildRequestToken(a), f = Date.now();
		K(e.eventId, t, (e) => ({ ...gp(e, {
			showInitialLoading: !!i.showInitialLoading,
			prefetchOnly: !!i.prefetchOnly
		}) })), await Kp({
			isActive: () => c === V.getRequestId() && V.getChildRequestToken(a) === u && r(),
			cleanup: () => {
				V.deleteChildrenFetchTask(a), V.deleteChildRequestToken(a), mt(e.eventId, t);
			},
			onError: sm({
				updateExpansion: (n) => K(e.eventId, t, n),
				showInitialLoading: !!i.showInitialLoading,
				prefetchOnly: !!i.prefetchOnly
			}),
			run: async ({ ensureActive: r }) => {
				if (!r()) return;
				let c = o();
				if (!c) {
					K(e.eventId, t, (e) => ({ ...vp(e, { nextError: i.showInitialLoading && !i.prefetchOnly ? "nostr_not_ready" : null }) }));
					return;
				}
				let u = St(We), m = g.fetchDirectReplies(c, {
					eventId: t,
					createdAt: n.event.created_at,
					relayHints: Y(e, n),
					parents: [Wt({
						event: n.event,
						relayHints: Y(e, n)
					})].filter((e) => e !== null),
					relayConfig: s()
				});
				V.replaceChildrenFetchTask(a, m);
				let h = await m.promise;
				if (V.deleteChildrenFetchTask(a), !r()) return;
				om(h.status), ze(e.eventId, h.events.map((e) => e.event), [...Y(e, n), ...h.relayUrls]);
				let _ = await He(h.events);
				h.events.length > 0 && await d.upsertChildInteractions({
					parentEventId: t,
					events: _,
					fetchedAt: h.status === "partial" ? null : h.fetchedAt,
					expectedChildGeneration: await u
				});
				let v = xp(await p.save({
					parentEventId: t,
					completeness: cm(h.status),
					fetchedAt: h.fetchedAt,
					requestStartedAt: f
				})), y = await Ve(await l.getDirectReplyRecords(t));
				r() && (y.length > 0 && await jt(n, y, ["reply-db", "fetched-child"], { resolveProfiles: !i.prefetchOnly }), await Jp({
					status: Ip({
						nextRecordsLength: y.length,
						resultEventsLength: h.events.length
					}),
					strategies: Rp({
						fetchedAt: v,
						prefetchOnly: !!i.prefetchOnly,
						updateExpansion: (n) => {
							K(e.eventId, t, n);
						},
						prefetchChildReplyCounts: () => {
							wt(e, t);
						}
					})
				}), Dt({
					anchorEventId: e.eventId,
					nodeEventId: t,
					effectiveFetchedAt: v,
					replyCount: y.length
				}));
			}
		});
	}
	function ct(e, t) {
		I.add(cr(e, t));
	}
	function lt(e, t) {
		I.delete(cr(e, t));
	}
	function ut(e, t) {
		return I.has(cr(e, t));
	}
	function dt(e, t) {
		L.add(cr(e, t));
	}
	function mt(e, t) {
		L.delete(cr(e, t));
	}
	function ht(e, t) {
		return L.has(cr(e, t));
	}
	function gt(e) {
		for (let t of L) t.endsWith(`:${e}`) && L.delete(t);
	}
	function vt(e, t) {
		if (!ht(e.eventId, t)) return;
		let n = cr(e.eventId, t);
		if (V.getChildRequestToken(n) !== void 0) return;
		let i = ue(e.eventId, t);
		mt(e.eventId, t), r() && i.visibleChildren && xt(e, t, { force: !0 });
	}
	function yt(e, t, n) {
		let r = cr(e.eventId, t);
		return V.getChildRequestToken(r) === void 0 && !ut(e.eventId, t) ? !1 : (n || (dt(e.eventId, t), K(e.eventId, t, (e) => ({
			...e,
			visibleChildren: !0
		}))), !0);
	}
	function bt(e, t) {
		return t === e.eventId ? me(e) : F(T)[t];
	}
	async function xt(e, t, n = {}) {
		let r = bt(e, t);
		if (!r || yt(e, t, !!n.prefetchOnly)) return;
		let i = ue(e.eventId, t);
		await Zp({
			loading: i.loadingChildren,
			revalidating: i.revalidatingChildren,
			onInFlight: n.prefetchOnly ? () => void 0 : () => {
				K(e.eventId, t, (e) => ({
					...e,
					visibleChildren: !0
				}));
			},
			shouldHandleLoadedState: !n.force && i.loadedChildren,
			handleLoadedState: async () => {
				if (n.prefetchOnly) return !0;
				let a = Ee(t).length > 0;
				return K(e.eventId, t, (e) => ({
					...e,
					visibleChildren: a
				})), a && wt(e, t), Gp({
					hasVisibleData: !0,
					lastFetchedAt: i.lastFetchedChildrenAt,
					ttlMs: lm
				}) && st(e, t, r), !0;
			},
			prepareFreshLoadState: () => void 0,
			displayCachedForFreshLoad: async () => ({
				displayedCached: await ot(e, t, r, n),
				lastFetchedAt: ue(e.eventId, t).lastFetchedChildrenAt
			}),
			force: !!n.force,
			ttlMs: lm,
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
		await xt(e, e.eventId, t);
	}
	async function wt(e, t) {
		let n = cr(e.eventId, t);
		if (!te.has(n)) {
			te.add(n);
			try {
				await Tt(e, t);
			} finally {
				te.delete(n);
			}
		}
	}
	async function Tt(e, t) {
		let n = Date.now(), i = V.getRequestId(), a = Ee(t).filter((t) => {
			let r = ue(e.eventId, t), i = typeof r.lastFetchedChildrenAt == "number" && n - r.lastFetchedChildrenAt < im;
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
				let n = await Et(e, t), a = ue(e.eventId, t), s = typeof a.lastFetchedChildrenAt == "number" && Date.now() - a.lastFetchedChildrenAt < im, c = !n || a.lastFetchedChildrenAt === null;
				c && i === V.getRequestId() && r() && ut(e.eventId, t) && V.getChildRequestToken(cr(e.eventId, t)) === void 0 && !a.loadingChildren && !a.revalidatingChildren && (!a.loadedChildren || a.lastFetchedChildrenAt === null) && !s ? o.push(t) : (lt(e.eventId, t), c ? vt(e, t) : mt(e.eventId, t));
			} catch {
				lt(e.eventId, t), vt(e, t);
			}
		})), o.sort((t, n) => Number(ht(e.eventId, n)) - Number(ht(e.eventId, t))), o.splice(em).forEach((t) => {
			lt(e.eventId, t), vt(e, t);
		}), !r() || o.length === 0) {
			o.forEach((t) => {
				lt(e.eventId, t), vt(e, t);
			});
			return;
		}
		let s = jn(o, nm), c = 0, l = Math.min(tm, s.length), u = async () => {
			for (; r();) {
				let t = c;
				c += 1;
				let n = s[t];
				if (!n) return;
				await At(e, n);
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
		let o = await Ve(n), s = F(T)[t];
		if (!r() || !s || o.length === 0 && !i) return !1;
		let c = await jt(s, o, ["reply-db"], { resolveProfiles: !1 });
		if (!r() || c.length === 0 && !i) return !1;
		let u = a ? null : i ? i.completeness === "complete" ? i.fetchedAt : null : Sp(c);
		return r() && K(e.eventId, t, (e) => ({ ..._p(e, { lastFetchedChildrenAt: u }) })), !0;
	}
	function Dt(e) {
		return e.effectiveFetchedAt !== null || e.replyCount > 0 ? !1 : (K(e.anchorEventId, e.nodeEventId, (e) => ({
			...e,
			loadedChildren: !1,
			loadingChildren: !1,
			revalidatingChildren: !1,
			childrenError: null,
			lastFetchedChildrenAt: null
		})), !0);
	}
	function Ot(e) {
		let t = Ep({
			nodesById: F(T),
			parentByChildId: F(E),
			childrenByParentId: F(D),
			expansionByAnchorNodeKey: F(k),
			reactionSummaryByParentId: F(ne),
			reactionRecordsByParentId: F(R),
			reactionProfilesByPubkey: F(z),
			reactionReadModelByParentId: F(B),
			deletedEventIdsByPubkey: F(A)
		}, e);
		t.nodesById !== F(T) && O(T, t.nodesById), t.parentByChildId !== F(E) && O(E, t.parentByChildId), t.childrenByParentId !== F(D) && O(D, t.childrenByParentId), t.expansionByAnchorNodeKey !== F(k) && O(k, t.expansionByAnchorNodeKey), O(ne, t.reactionSummaryByParentId), O(R, t.reactionRecordsByParentId), O(z, t.reactionProfilesByPubkey), O(B, t.reactionReadModelByParentId);
	}
	async function kt(e, t, n = () => !0) {
		if (!r() || e.length === 0) return;
		let i = dm(e, t);
		if (i.length === 0) return;
		let a = V.getRequestId(), o = !!t?.length, s = new Map(e.map((e) => [e.eventId, e]));
		await qp({
			items: i,
			isActive: () => a === V.getRequestId() && r() && n(),
			run: async ({ ensureActive: e }) => {
				let t = i.flatMap((t) => {
					let n = s.get(t);
					if (!n || !e()) return [];
					let r = cr(n.eventId, t), i = ue(n.eventId, t);
					return !o && (ee.has(r) || i.loadedChildren || i.loadingChildren || i.revalidatingChildren) ? (ee.add(r), []) : (ee.add(r), [{
						parentEventId: t,
						post: n
					}]);
				});
				if (t.length === 0 || !e()) return;
				let n = t.map(({ parentEventId: e }) => e), r = d.getChildInteractionsForParents ? await d.getChildInteractionsForParents(n) : (await Promise.all(n.map(async (e) => {
					let [t, n] = await Promise.all([fr(e, u), l.getDirectReplyRecords(e)]);
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
				let f = Cp(await Ve(r), n);
				if (!e()) return;
				let m = new Map(t.map(({ parentEventId: e, post: t }) => [e, pe(t)])), { reactionRecordsByParentId: h, directReplyRecordsByParentId: g, invalidDirectReplyRecordIds: _, reactionAuthorPubkeys: v, profileRelayUrlsByPubkey: b } = Tp({
					parentEventIds: n,
					anchorNodesByParentId: m,
					visibleRecordsByParentId: f
				});
				if (_.length > 0 && (await Promise.all(_.map((e) => d.deleteChildInteractionByEventId(e))), !e())) return;
				let x = v.size > 0 ? await mn.getProfiles(Array.from(v), { allowBackgroundRefresh: !1 }) : {};
				if (!e()) return;
				let S = /* @__PURE__ */ new Map();
				for (let [e, t] of b) S.set(e, y.ensureProfile(e, t));
				Ot({
					postsByParentId: s,
					targetParentIds: n,
					anchorNodesByParentId: m,
					reactionRecordsByParentId: h,
					directReplyRecordsByParentId: g,
					metadataByParentId: new Map(a.map((e) => [e.parentEventId, e])),
					metadataReadFailedParentIds: c,
					cachedReactionProfilesByPubkey: x,
					knownNodeProfilesByPubkey: S
				});
			}
		});
	}
	async function At(e, t) {
		let n = t.map((e) => F(T)[e]).filter((e) => !!e);
		if (n.length === 0) return;
		let i = V.getRequestId(), a = Date.now(), c = /* @__PURE__ */ new Map(), u = /* @__PURE__ */ new Map(), f = !1, m = !1, h = `${e.eventId}:children-prefetch:${t.join(",")}`, _ = () => f || i !== V.getRequestId() || !r() ? !1 : t.every((t) => ut(e.eventId, t) && V.getChildRequestToken(cr(e.eventId, t)) === c.get(t)), v = (n) => {
			for (let r of t) Bp({
				updateExpansion: (t) => K(e.eventId, r, t),
				showInitialLoading: !1,
				prefetchOnly: !0,
				errorCode: n
			});
		};
		await qp({
			items: t,
			isActive: _,
			prepareItem: (t) => {
				let n = cr(e.eventId, t), r = V.createChildRequestToken(n);
				return c.set(t, r), K(e.eventId, t, (e) => ({ ...gp(e, {
					showInitialLoading: !1,
					prefetchOnly: !0
				}) })), r;
			},
			completeBatch: (n) => {
				if (n && _()) for (let r of t) K(e.eventId, r, (e) => ({ ..._p(e, {
					loadedChildren: n && Ap({
						effectiveFetchedAt: u.get(r) ?? null,
						visibleChildCount: Ee(r).length
					}),
					revalidatingChildren: !1,
					lastFetchedChildrenAt: u.get(r) ?? null
				}) }));
			},
			cleanupItem: (t, n) => {
				let r = cr(e.eventId, t);
				V.getChildRequestToken(r) === n && V.deleteChildRequestToken(r), lt(e.eventId, t), m || f ? mt(e.eventId, t) : vt(e, t);
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
				let c = St(We), _ = Se(e, n), y = g.fetchDirectReplies(i, Dp({
					batchEventIds: t,
					batchNodes: n,
					relayHints: _,
					relayConfig: s()
				}));
				V.replaceChildrenFetchTask(h, y);
				let b = await y.promise;
				if (V.deleteChildrenFetchTask(h), !r()) return;
				if (b.status === "cancelled") {
					f = !0;
					for (let n of t) K(e.eventId, n, (e) => ({ ...vp(e, { nextError: e.childrenError }) }));
					return;
				}
				om(b.status);
				let x = Op(b.events, t);
				x.length > 0 && await ze(e.eventId, x.map((e) => e.event), [..._, ...b.relayUrls], `children-prefetch:${t.join(",")}`);
				let S = await He(x);
				if (!r()) return;
				let C = kp({
					batchEventIds: t,
					directReplyItems: x,
					visibleItems: S
				});
				for (let e of t) {
					let t = C.get(e) ?? [];
					if (t.length > 0 && await d.upsertChildInteractions({
						parentEventId: e,
						events: t,
						fetchedAt: b.status === "partial" ? null : b.fetchedAt,
						expectedChildGeneration: await c
					}), !r()) return;
					let n = await p.save({
						parentEventId: e,
						completeness: cm(b.status),
						fetchedAt: b.fetchedAt,
						requestStartedAt: a
					});
					u.set(e, xp(n));
					let i = await Ve(await l.getDirectReplyRecords(e)), o = F(T)[e];
					o && await jt(o, i, ["reply-db", "fetched-child"], { resolveProfiles: !1 });
				}
				r() && (m = !0);
			}
		});
	}
	async function jt(e, t, n, r = {}) {
		let i = e.eventId, a = [], o = [], s = r.resolveProfiles !== !1;
		for (let r of t) {
			let t = wr(r);
			if (!wp({
				parentNode: e,
				record: r
			})) {
				await d.deleteChildInteractionByEventId(r.eventId);
				continue;
			}
			if (X(t.pubkey, t.id)) continue;
			let c = s ? await ye({
				event: t,
				relayUrls: r.relayUrls,
				sources: n
			}) : de({
				event: t,
				relayUrls: yp(r.relayUrls),
				sources: n
			});
			s || _e(t.pubkey, yp(r.relayUrls)), c.eventId !== i && (q(c.eventId, i), a.push(c.eventId), o.push(r));
		}
		return fe(i, a), o;
	}
	function Mt(e) {
		Nt(e.eventId, e.eventId);
	}
	function Nt(e, t) {
		mt(e, t), K(e, t, (e) => ({
			...e,
			visibleChildren: !1
		}));
	}
	function Pt(e) {
		ue(e.eventId, e.eventId).visibleChildren ? Mt(e) : Ct(e);
	}
	function Ft(e) {
		Ct(e, { force: !0 });
	}
	function It(e, t) {
		ue(e.eventId, t).visibleChildren ? Nt(e.eventId, t) : xt(e, t);
	}
	function Lt(e, t) {
		xt(e, t, { force: !0 });
	}
	async function Rt(e, t = []) {
		if (!e?.id || ![
			1,
			42,
			1111
		].includes(e.kind)) return !0;
		let n = he(e), i = n.parentId;
		if (!i) return !0;
		let a = t.find((e) => e.eventId === i) ?? null, o = Object.keys(F(k)).filter((e) => e.endsWith(`:${i}`));
		if (!a && o.length === 0) return !1;
		let s = x.getTargetSnapshot(i), c = a ? F(T)[i] ?? Er({
			event: rr(a),
			relayUrls: yp([
				...a.relayHints,
				...a.acceptedRelays,
				...a.fetchedRelays ?? []
			]),
			sources: ["history-record"]
		}) : F(T)[i] ?? (s?.status === "resolved" && s.event ? Er({
			event: s.event,
			relayUrls: s.relayHints,
			sources: ["fetched-parent"]
		}) : null);
		if (!c) return !1;
		let u = Wt({
			event: c.event,
			relayHints: c.relayUrls
		});
		if (!u || !Ut({
			child: e,
			parent: u
		}).valid) return !1;
		let f = await St(We);
		if ((await Be([e])).length === 0) return !1;
		await d.upsertChildInteractions({
			parentEventId: i,
			expectedChildGeneration: f,
			events: [{
				event: e,
				relayUrls: n.relayHints
			}]
		});
		let p = await Ve(await l.getDirectReplyRecords(i));
		if (!r()) return !1;
		await jt(c, p, ["reply-db", "posted-reply"]);
		let m = (e, t) => {
			K(e, t, (e) => ({
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
		e.eventId && e.authorPubkey && (gt(e.eventId), Me(e.authorPubkey, e.eventId), Ie(e.eventId), Ne(e.eventId, e.authorPubkey, { revealKnownParent: !0 }), e.deletionEvent && await f.upsertValidDeletionRequests({
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
	w(() => {
		r() && O(M, x.getScopeRevision(C), !0);
	}), w(() => {
		if (r()) {
			F(M);
			for (let e of Object.keys(F(k))) {
				let [t, n] = e.split(":"), r = F(T)[n]?.parentEventId;
				if (!r) continue;
				let i = x.getTargetSnapshot(r);
				i?.status === "deleted" && (ue(t, n).parentDeleted || (i.authorPubkey && (Me(i.authorPubkey, r), Ne(r, i.authorPubkey, { revealKnownParent: !0 })), Ge(t, n)));
			}
		}
	});
	function Bt() {
		U.forEach((e) => e.cancel()), U.clear(), O(ie, {}, !0), V.incrementRequestId(), x.invalidateScope(C), V.cancelAndClearFetchTasks(), V.clearChildRequestTokens(), V.clearParentRequestTokens(), I.clear(), L.clear(), b && y.reset(), N.clearAll(), O(k, Object.fromEntries(Object.entries(F(k)).map(([e, t]) => [e, {
			...t,
			loadingParent: !1,
			loadingChildren: !1,
			revalidatingParent: !1,
			revalidatingChildren: !1,
			showParentLoadingIndicator: !1
		}])));
	}
	w(() => (a(), o(), () => {
		U.forEach((e) => e.cancel()), U.clear(), O(ie, {}, !0);
	}));
	function Vt() {
		Bt(), S && x.reset(), V.incrementRequestId(), ae.clear(), O(T, {}), O(E, {}), O(D, {}), O(k, {}), O(A, {}), O(ne, {}), O(R, {}), O(z, {}), O(B, {}), ee.clear(), te.clear();
	}
	return w(() => {
		i() || j(Vt);
	}), w(() => {
		if (r()) return () => {
			Bt();
		};
	}), re(() => {
		x.invalidateScope(C), Bt(), ve(), S && x.reset(), b && y.dispose();
	}), {
		getAnchorState: ke,
		refreshRelatedEvents: W,
		toggleParent: et,
		retryParent: tt,
		toggleNodeParent: nt,
		retryNodeParent: rt,
		toggleChildren: Pt,
		retryChildren: Ft,
		toggleNodeChildren: It,
		retryNodeChildren: Lt,
		recordPostedReply: Rt,
		recordDeletedEvent: zt,
		loadCachedChildInteractionStateForPosts: kt,
		cancelCurrentGraphFetches: Bt,
		resetState: Vt
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/hooks/usePostHistoryInboundInteractionsSync.svelte.ts
function mm(e) {
	return !!e && typeof e.use == "function";
}
function hm({ getShow: e, getPubkeyHex: t, getRxNostr: n, getRelayConfig: r, getPosts: i, onSavedInboundInteractions: a = () => void 0, reconcileDirectReplyCandidates: o }) {
	let s = P({
		status: "idle",
		activePubkeyHex: null,
		hasStartedInitialDialogBootstrap: !1
	}), c = null, l = 0;
	function u() {
		l += 1, c?.cancel(), c = null, s.status = "idle";
	}
	async function d(d) {
		let f = t(), p = n(), m = l, h = () => e() && m === l && t() === f && n() === p;
		if (!e() || !f || !mm(p) || i().length === 0) return;
		if (d === "dialog-open-refresh") {
			let e = await In.get(f);
			if (typeof e?.lastDialogRefreshAt == "number" && Date.now() - e.lastDialogRefreshAt < 6e4) return;
		}
		if (!h()) return;
		u();
		let g = ++l;
		s.status = "syncing";
		let _ = d === "dialog-open-refresh" ? Hn.runInbound(p, {
			ownerPubkeyHex: f,
			relayConfig: r(),
			reason: d,
			reconcileDirectReplyCandidates: o
		}) : {
			...zn.syncRecent(p, {
				ownerPubkeyHex: f,
				relayConfig: r(),
				reason: d,
				reconcileDirectReplyCandidates: o
			}),
			joinedExisting: !1
		};
		c = _;
		let v = await _.promise;
		g === l && c === _ && e() && t() === f && (c = null, s.status = "idle", !(_.joinedExisting || v.status === "cancelled" || v.changedParentEventIds.length === 0) && (await a(v.changedParentEventIds), g === l && e() && t() === f && n() === p && qn({
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
		let i = l, a = n(), o = await In.get(r);
		i === l && e() && t() === r && n() === a && await d(o?.lastSyncedAt ? "dialog-open-refresh" : "initial-dialog-bootstrap");
	}
	return w(() => {
		let e = t() ?? null;
		e !== s.activePubkeyHex && (u(), s.activePubkeyHex = e, s.hasStartedInitialDialogBootstrap = !1);
	}), w(() => {
		e() ? t() && mm(n()) && i().length !== 0 && (s.hasStartedInitialDialogBootstrap || (s.hasStartedInitialDialogBootstrap = !0, f())) : (u(), s.hasStartedInitialDialogBootstrap = !1);
	}), {
		state: s,
		cancelCurrentSync: u,
		runSync: d
	};
}
var gm = {
	status: "valid",
	ruleVersion: 1
}, _m = {
	status: "invalid",
	ruleVersion: 1
};
function vm(e) {
	return e?.ruleVersion === 1 && (e.status === "valid" || e.status === "invalid");
}
function ym(e) {
	return e?.status === "valid" && e.ruleVersion === 1;
}
function bm(e) {
	if (me(e)) try {
		return `nostr:${Ge(e)}\u0000${e.id}\u0000${e.sig}`;
	} catch {}
	try {
		return `raw:${JSON.stringify(e)}`;
	} catch {
		return "raw:unserializable";
	}
}
function xm(e) {
	if (!me(e)) return { ..._m };
	try {
		let t = q(e);
		return oe(t) && Ge(t) === t.id && se(t) ? { ...gm } : { ..._m };
	} catch {
		return { ..._m };
	}
}
async function Sm(e, t) {
	for (let { id: n, fingerprint: r, verification: i } of e) {
		let e = await t.get(n);
		e && bm(e.rawEvent) === r && await t.update(n, { rawEventVerification: i });
	}
}
function Cm(e, t) {
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
async function wm(e, t, n, r) {
	let i = [...e.map((e) => ({
		type: "post",
		record: e
	})), ...t.map((e) => ({
		type: "deletion",
		record: e
	}))].filter((e) => !vm(e.record.rawEventVerification)), a = i.length;
	if (a === 0) return;
	let o = 0, s = /* @__PURE__ */ new Map(), c = [], l = [];
	async function u() {
		if (c.length > 0) {
			let e = c.splice(0);
			await (n.transaction?.post ?? (async (e) => e()))(() => Sm(e, n.post));
		}
		if (l.length > 0) {
			let e = l.splice(0);
			await (n.transaction?.deletion ?? (async (e) => e()))(() => Sm(e, n.deletion));
		}
	}
	r?.({
		phase: "verifying",
		processed: o,
		total: a
	});
	for (let e of i) {
		let t = bm(e.record.rawEvent), n = s.get(t) ?? xm(e.record.rawEvent);
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
function Tm(e, t) {
	if (!me(e) || e.kind !== t) return !1;
	try {
		return oe(e) && Ge(e) === e.id;
	} catch {
		return !1;
	}
}
function Em(e, t) {
	return e.created_at === t.created_at ? e.id === t.id ? 0 : e.id < t.id ? -1 : 1 : e.created_at - t.created_at;
}
function Dm(e) {
	return e.rawEvent !== null && e.rawEvent !== void 0;
}
function Om(e, t, n) {
	return !ym(e.rawEventVerification) || !Tm(t, 5) || t.pubkey !== n || e.targetAuthorPubkey !== n || e.deletionEventPubkey !== n || t.id !== e.deletionEventId ? !1 : tt(t).includes(e.targetEventId);
}
function km() {
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
function Am(e, t) {
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
async function jm(e, t, n, r = {}) {
	let i = km(), a = [], o = [], s = /* @__PURE__ */ new Set(), c = /* @__PURE__ */ new Set(), l = /* @__PURE__ */ new Set(), u = t.filter((t) => t.pubkeyHex === e), d = n.filter((t) => t.targetAuthorPubkey === e), f = new Map((r.sensitivePayloadRecords ?? []).filter((t) => t.pubkeyHex === e && t.deletedAt === void 0).map((e) => [e.id, e])), p = /* @__PURE__ */ new Set();
	for (let e of u) {
		if (!st(e.kind)) continue;
		if (!ym(e.rawEventVerification) || !K(e.rawEvent, e) || !Tm(e.rawEvent, e.kind)) {
			i.skippedPostCount += 1;
			continue;
		}
		a.push(q(e.rawEvent)), s.add(e.eventId), i.exportedPostEventCount += 1;
		let t = e.rawEvent, n = Qe(t);
		if (!n) continue;
		let r = f.get(n.eventId)?.rawEvent;
		!r || !ot(t, r, n.eventId) ? i.missingPayloadEventCount += 1 : p.has(r.id) || (p.add(r.id), a.push(q(r)), i.exportedPayloadEventCount += 1);
	}
	let m = /* @__PURE__ */ new Map();
	for (let e of d) {
		let t = m.get(e.deletionEventId) ?? [];
		t.push(e), m.set(e.deletionEventId, t);
	}
	for (let t of m.values()) {
		let n = t.find((t) => Om(t, t.rawEvent, e));
		if (n) {
			let e = q(n.rawEvent);
			o.push(e);
			for (let t of tt(e)) c.add(t);
			i.exportedDeletionEventCount += 1;
		} else {
			for (let e of t) l.add(e.targetEventId);
			t.every((e) => !Dm(e)) ? i.missingDeletionRawEventCount += 1 : i.invalidDeletionRawEventCount += 1;
		}
	}
	let h = /* @__PURE__ */ new Set();
	for (let e of u) st(e.kind) && e.deletedAt !== void 0 && s.has(e.eventId) && !c.has(e.eventId) && !l.has(e.eventId) && h.add(e.eventId);
	i.missingDeletionRawEventCount += h.size, a.sort(Em), o.sort(Em);
	let g = [...a, ...o];
	return i.exportedEventCount = g.length, i.isPartial = i.skippedPostCount > 0 || i.missingDeletionRawEventCount > 0 || i.invalidDeletionRawEventCount > 0 || i.missingPayloadEventCount > 0, r.onProgress?.({ phase: "creating" }), {
		result: i,
		...Am(g, r.includeJsonl === !0)
	};
}
async function Mm(e) {
	let t = e.postRecords.filter((t) => t.pubkeyHex === e.pubkeyHex), n = e.deletionRecords.filter((t) => t.targetAuthorPubkey === e.pubkeyHex);
	return await wm(t, n, e.verificationStores ?? Cm(t, n), e.onProgress), jm(e.pubkeyHex, t, n, e);
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryJsonlExportService.ts
function Nm() {
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
var Pm = new class {
	postHistoryRepository;
	deletionRequestsRepository;
	workerFactory;
	sensitivePayloadRepository;
	constructor(e = {}) {
		this.postHistoryRepository = e.postHistoryRepository ?? Q, this.deletionRequestsRepository = e.deletionRequestsRepository ?? Xt, this.workerFactory = e.workerFactory ?? (() => new Worker(new URL(
			/* @vite-ignore */
			new URL("postHistoryJsonlExportWorker-BA_50uug.js", import.meta.url).href,
			"" + import.meta.url
		), { type: "module" })), this.sensitivePayloadRepository = e.sensitivePayloadRepository ?? Ct;
	}
	exportForPubkeyInWorker(e, t = {}) {
		if (!e) {
			let { jsonl: e, ...t } = Nm();
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
		if (!e) return Nm();
		let [t, n, r] = await Promise.all([
			this.postHistoryRepository.getAll({ pubkeyHex: e }),
			this.deletionRequestsRepository.getAllForTargetAuthorPubkey(e),
			this.sensitivePayloadRepository.getAllForPubkey(e)
		]), i = await Mm({
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
}(), Fm = 5e3;
function Im() {
	let e = /* @__PURE__ */ new Date();
	return [
		String(e.getFullYear()).padStart(4, "0"),
		String(e.getMonth() + 1).padStart(2, "0"),
		String(e.getDate()).padStart(2, "0")
	].join("-");
}
function Lm(e) {
	let t = H(!1), n = H(P({ phase: "loading" })), r, i, a = H(!1), o = H("postHistory.exportComplete"), s = H(P({})), c;
	function l() {
		r?.abort();
	}
	function u() {
		c &&= (clearTimeout(c), void 0), O(a, !1);
	}
	function d(e) {
		u(), O(o, e.isPartial ? "postHistory.exportPartial" : "postHistory.exportComplete", !0), O(s, {
			exported: e.exportedEventCount,
			skipped: e.skippedPostCount + e.missingDeletionRawEventCount + e.invalidDeletionRawEventCount
		}, !0), O(a, !0), c = setTimeout(() => {
			O(a, !1), c = void 0;
		}, Fm);
	}
	async function f() {
		let l = e.getPubkeyHex();
		if (!l || F(t)) return;
		O(t, !0), O(n, { phase: "loading" }, !0);
		let f = new AbortController();
		r = f, i = l, e.onStart?.(), u();
		try {
			let { result: t, blob: i } = await Pm.exportForPubkeyInWorker(l, {
				signal: f.signal,
				onProgress: (t) => {
					!f.signal.aborted && e.getShow() && r === f && O(n, t, !0);
				}
			});
			if (f.signal.aborted) return;
			let a = URL.createObjectURL(i), o = document.createElement("a");
			o.href = a, o.download = `ehagaki-post-history-${Im()}.jsonl`, o.style.display = "none", e.downloadContainer.appendChild(o), o.click(), setTimeout(() => {
				o.remove(), URL.revokeObjectURL?.(a);
			}, 1e3), d(t);
		} catch (e) {
			if (f.signal.aborted || e instanceof DOMException && e.name === "AbortError") return;
			O(o, "postHistory.exportFailed"), O(s, {}, !0), O(a, !0), c = setTimeout(() => {
				O(a, !1), c = void 0;
			}, Fm);
		} finally {
			r === f && (r = void 0, i = void 0, O(t, !1));
		}
	}
	return {
		get running() {
			return F(t);
		},
		get progress() {
			return F(n);
		},
		get ownerPubkeyHex() {
			return i;
		},
		get showMessage() {
			return F(a);
		},
		get messageKey() {
			return F(o);
		},
		get messageValues() {
			return F(s);
		},
		start: f,
		cancel: l,
		hideMessage: u
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostHistoryTabContent.svelte
var Rm = o("<div> </div>"), zm = o("<p role=\"status\"> </p>"), Bm = o("<h3 class=\"post-history-current-month-heading svelte-9hvdbo\"><span class=\"post-history-current-month svelte-9hvdbo\"> </span></h3>"), Vm = o("<div class=\"calendar-icon svg-icon\" aria-hidden=\"true\"></div>"), Hm = o("<div class=\"repair-icon svg-icon svelte-9hvdbo\" aria-hidden=\"true\"></div>"), Um = o("<div class=\"search-icon svg-icon svelte-9hvdbo\" aria-hidden=\"true\"></div>"), Wm = o("<div class=\"more-icon svg-icon\"></div>"), Gm = o("<div class=\"post-history-menu-summary\" role=\"presentation\"><span class=\"post-history-summary-line post-history-summary-count svelte-9hvdbo\"> </span></div> <!>", 1), Km = o("<div class=\"return-to-latest-icon svg-icon\" aria-hidden=\"true\"></div> <span> </span>", 1), qm = o("<div class=\"jump-to-oldest-icon svg-icon\" aria-hidden=\"true\"></div> <span> </span>", 1), Jm = o("<div class=\"export-icon svg-icon\" aria-hidden=\"true\"></div> <span> </span>", 1), Ym = o("<div class=\"import-icon svg-icon svelte-9hvdbo\" aria-hidden=\"true\"></div> <span> </span>", 1), Xm = o("<div class=\"trash-icon svg-icon\" aria-hidden=\"true\"></div> <span> </span>", 1), Zm = o("<div class=\"post-history-menu-body\"><!> <!> <!> <!> <!> <!> <!> <!> <!></div>"), Qm = o("<!> <!>", 1), $m = o("<div class=\"search-icon svg-icon svelte-9hvdbo\"></div>"), eh = o("<div class=\"xmark-icon svg-icon svelte-9hvdbo\" aria-hidden=\"true\"></div>"), th = o("<div class=\"post-history-search-row svelte-9hvdbo\"><div><div class=\"post-history-search-leading svelte-9hvdbo\" aria-hidden=\"true\"><!></div> <input class=\"post-history-search-input svelte-9hvdbo\" type=\"search\"/></div> <!></div>"), nh = o("<div class=\"post-history-list-loading svelte-9hvdbo\" aria-hidden=\"true\"><!></div>"), rh = o("<div class=\"empty-state svelte-9hvdbo\"><div class=\"empty-message svelte-9hvdbo\"> </div></div>"), ih = o("<div class=\"keyboard-arrow-up-icon svg-icon\" aria-hidden=\"true\"></div> ", 1), ah = o("<div class=\"post-history-nav-row post-history-nav-row-top svelte-9hvdbo\"><!></div>"), oh = o("<div class=\"post-history-auto-load-sentinel post-history-auto-load-newer-sentinel svelte-9hvdbo\"><!></div>"), sh = o("<div aria-hidden=\"true\"><!></div>"), ch = o("<!> <!> <div class=\"post-history-thread-anchor-post svelte-9hvdbo\"><div class=\"post-preview-body svelte-9hvdbo\"><!></div> <!> <!></div>", 1), lh = o("<li><div class=\"post-history-main svelte-9hvdbo\"><div class=\"post-preview svelte-9hvdbo\"><!></div></div></li>"), uh = o("<div class=\"post-history-auto-load-sentinel svelte-9hvdbo\"><!></div>"), dh = o("<div class=\"post-history-auto-load-slot svelte-9hvdbo\" aria-hidden=\"true\"><!></div>"), fh = o("<div class=\"post-history-sparse-state svelte-9hvdbo\" role=\"status\"><p class=\"svelte-9hvdbo\"> </p> <p class=\"svelte-9hvdbo\"> </p></div>"), ph = o("<div class=\"cloud-download-icon svg-icon\" aria-hidden=\"true\"></div> ", 1), mh = o("<div class=\"keyboard-arrow-down-icon svg-icon\" aria-hidden=\"true\"></div> ", 1), hh = o("<div class=\"post-history-saved-boundary svelte-9hvdbo\" role=\"status\"><div class=\"post-history-saved-boundary-actions svelte-9hvdbo\"><!> <!></div></div>"), gh = o("<div class=\"post-history-nav-row post-history-nav-row-bottom svelte-9hvdbo\"><!></div>"), _h = o("<div class=\"post-history-exhausted-state svelte-9hvdbo\"><!></div>"), vh = o("<div class=\"post-history-search-bottom-spacer svelte-9hvdbo\" aria-hidden=\"true\"></div>"), yh = o("<!> <!> <ul class=\"post-history-list svelte-9hvdbo\"></ul> <!> <!> <!>", 1), bh = o("<div class=\"post-history-nav-row post-history-sync-footer svelte-9hvdbo\" role=\"status\"><!></div>"), xh = o("<div class=\"vertical-align-top-icon svg-icon\" aria-hidden=\"true\"></div>"), Sh = o("<div class=\"post-history-latest-row svelte-9hvdbo\"><!></div>"), Ch = o("<div class=\"delete-confirm-body svelte-9hvdbo\"><p class=\"delete-confirm-description svelte-9hvdbo\"> </p> <p class=\"delete-confirm-warning svelte-9hvdbo\"> </p></div>"), wh = o("<div class=\"delete-confirm-body svelte-9hvdbo\"><p class=\"delete-confirm-description svelte-9hvdbo\"> </p></div>"), Th = o("<div class=\"post-history-tab-content svelte-9hvdbo\"><!> <!> <div class=\"post-history-heading svelte-9hvdbo\"><div class=\"post-history-heading-main svelte-9hvdbo\"><!> <!></div> <div class=\"post-history-heading-actions svelte-9hvdbo\"><!> <!> <!> <!></div></div> <!> <!> <div><!> <!></div> <!> <!> <!> <!> <!></div> <!> <!> <!> <!> <!> <!> <!>", 1), Eh = {
	hash: "svelte-9hvdbo",
	code: ".post-history-tab-content.svelte-9hvdbo {position:relative;display:flex;flex-direction:column;flex:1;min-height:0;overflow:hidden;width:100%;}.post-history-heading.svelte-9hvdbo {display:flex;align-items:stretch;justify-content:space-between;width:100%;height:48px;min-height:48px;flex:0 0 48px;overflow:hidden;padding:0;border-bottom:1px solid var(--border-hr);}.post-history-heading-main.svelte-9hvdbo {display:flex;align-items:center;flex:1 1 auto;min-width:0;align-self:stretch;gap:4px;}.post-history-current-month-heading.svelte-9hvdbo {display:flex;align-items:center;flex:0 1 auto;min-width:0;height:100%;margin:0;}.post-history-current-month.svelte-9hvdbo {display:block;color:var(--text-light);font-size:1.75rem;line-height:1.05;font-weight:600;letter-spacing:-0.04em;min-width:0;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;padding-left:12px;}.post-history-heading-action-button {width:50px;height:50px;min-width:50px;min-height:50px;flex:0 0 50px;padding:0;border:0;color:var(--text-muted);background-color:var(--dialog-bg);--btn-bg: var(--dialog-bg);}.post-history-heading-action-button .svg-icon {width:22px;height:22px;background-color:currentColor;--svg: currentColor;}\n            .post-history-heading-refetch-button .svg-icon,\n            .post-history-heading-search-button .svg-icon\n         {width:24px;height:24px;}.post-history-heading-calendar-button .calendar-icon {mask-image:var(--ehagaki-icon-63616c656e6461725f746f6461795f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.post-history-heading-refetch-button:disabled {opacity:0.45;}.post-history-heading-actions.svelte-9hvdbo {display:flex;align-items:center;justify-content:flex-end;align-self:stretch;flex:0 0 auto;min-width:0;gap:0;white-space:nowrap;}\n            .post-history-action-button,\n            .post-history-thread-toggle-button\n         {color:var(--btn-post-preview-action);}\n            .post-history-action-button .svg-icon,\n            .post-history-thread-toggle-button .svg-icon\n         {--svg: currentColor;}.post-history-menu-summary {padding:8px 12px 4px;color:var(--text-muted);font-size:0.875rem;line-height:1.35;user-select:text;}.post-history-summary-line.svelte-9hvdbo {overflow-wrap:anywhere;}.post-history-summary-count.svelte-9hvdbo {flex:0 0 auto;white-space:nowrap;text-align:end;}.post-history-repair-button {white-space:nowrap;padding:6px 10px;font-size:0.82rem;}.post-history-search-row.svelte-9hvdbo {display:flex;align-items:center;width:100%;}.post-history-search-input-wrapper.svelte-9hvdbo {position:relative;flex:1 1 auto;min-width:0;border:1px solid var(--border-soft);background:var(--background);color:var(--text);font:inherit;border-bottom:1px solid var(--border-hr);}.post-history-search-leading.svelte-9hvdbo {display:flex;position:absolute;inset:0 auto 0 0;width:40px;align-items:center;justify-content:center;color:var(--text-muted);pointer-events:none;}.post-history-search-leading .search-icon,\n    .post-history-search-leading .inline-spinner {width:24px;height:24px;}.post-history-search-leading .loading-placeholder {width:24px;height:24px;flex:0 0 24px;}.post-history-search-active.svelte-9hvdbo {border-bottom-color:color-mix(\n            in srgb,\n            var(--theme),\n            var(--border-hr) 55%\n        );}.post-history-search-input.svelte-9hvdbo {display:block;width:100%;min-width:0;padding:10px 12px 10px 40px;border:0;background:transparent;color:inherit;font:inherit;}.post-history-search-close.square {flex:0 0 auto;min-height:40px;aspect-ratio:1;padding:0;background:var(--btn-bg);.svg-icon {width:28px;height:28px;}}.post-history-search-input.svelte-9hvdbo::placeholder {color:var(--text-muted);}.post-history-nav-row.svelte-9hvdbo {display:flex;justify-content:center;width:100%;padding:8px 16px;}.post-history-nav-row-top.svelte-9hvdbo {padding-bottom:0;}.post-history-nav-row-bottom.svelte-9hvdbo {padding-top:0;}.post-history-search-bottom-spacer.svelte-9hvdbo {\n        /* Clear the 50px return-to-latest button and its 12px bottom inset. */height:62px;}.post-history-auto-load-sentinel.svelte-9hvdbo {display:grid;width:100%;min-height:24px;place-items:center;}.post-history-auto-load-slot.svelte-9hvdbo {display:grid;height:24px;min-height:24px;place-items:center;}.post-history-auto-load-newer-slot.svelte-9hvdbo:not(.post-history-auto-load-newer-slot-reserved) {height:0;min-height:0;}.post-history-nav-button.primary {opacity:1;}.post-history-nav-button:not(.primary) {min-height:50px;white-space:nowrap;gap:4px;}.post-history-exhausted-state.svelte-9hvdbo {display:flex;flex-direction:column;gap:10px;align-items:center;padding:0 16px 8px 16px;}.post-history-latest-row.svelte-9hvdbo {position:absolute;inset:auto 16px 12px auto;display:flex;justify-content:flex-end;width:auto;margin:0;padding:0;z-index:3;.post-history-latest-button {min-width:50px;min-height:50px;background-color:color-mix(in srgb, var(--theme) 15%, transparent);backdrop-filter:blur(1px);.vertical-align-top-icon {mask-image:var(--ehagaki-icon-766572746963616c5f616c69676e5f746f705f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);width:26px;height:26px;opacity:0.6;}}}.post-history-container.svelte-9hvdbo {flex:1 1 auto;min-height:0;width:100%;overflow-y:auto;}.post-history-container.post-history-auto-load-enabled.svelte-9hvdbo {overflow-anchor:none;}.empty-state.svelte-9hvdbo {display:grid;gap:8px;min-height:100px;align-content:center;}.post-history-list-loading.svelte-9hvdbo {display:grid;min-height:100px;place-items:center;}.empty-message.svelte-9hvdbo {display:flex;justify-content:center;align-items:center;height:100px;color:var(--text-muted);font-size:1rem;}.status-loading-placeholder {justify-content:flex-end;width:auto;max-width:min(38vw, 240px);min-width:0;overflow:hidden;flex:0 1 auto;white-space:nowrap;column-gap:0;color:var(--text-muted);font-size:0.8rem;line-height:1.3;height:auto;}.post-history-heading-status-placeholder {color:var(--svg);}.status-loading-placeholder .loader-container {.square {background:currentColor;}}.status-loading-placeholder .placeholder-text {color:inherit;font-size:inherit;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.status-error {color:var(--danger);}.post-history-heading-status-placeholder.status-error {color:var(--svg);}.status-loading-placeholder.status-error .square {background-color:var(--danger);}.post-history-list.svelte-9hvdbo {width:100%;margin:0;padding:0;list-style:none;}.post-history-item.svelte-9hvdbo {display:flex;align-items:center;border-bottom:1px solid var(--border-hr-light);padding:6px;}.post-history-item.svelte-9hvdbo:last-child {border-bottom:none;}.post-history-item-deleted.svelte-9hvdbo .post-preview-body:where(.svelte-9hvdbo) {opacity:0.65;}.post-history-main.svelte-9hvdbo {display:flex;flex-direction:column;flex:1 1 0;min-width:0;gap:2px;}.post-history-menu-content .menu-action-button .calendar-icon {mask-image:var(--ehagaki-icon-63616c656e6461725f746f6461795f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);background-color:currentColor;}.post-history-menu-content .menu-action-button .find_in_page-icon {mask-image:var(--ehagaki-icon-66696e645f696e5f706167655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);background-color:currentColor;}.post-history-menu-content .menu-action-button .broadcast-icon {mask-image:var(--ehagaki-icon-63656c6c5f746f7765725f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);background-color:currentColor;}.post-history-menu-content .menu-action-button .raw-json-icon {mask-image:var(--ehagaki-icon-646174615f6f626a6563745f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);background-color:currentColor;}.post-history-menu-content .menu-action-button .export-icon {mask-image:var(--ehagaki-icon-75706c6f61645f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);background-color:currentColor;}.post-history-menu-content .menu-action-button .import-icon {mask-image:var(--ehagaki-icon-646f776e6c6f61645f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);background-color:currentColor;}\n            .post-history-menu-content\n                .menu-action-button\n                .collapse-content-icon\n         {mask-image:var(--ehagaki-icon-636f6c6c617073655f636f6e74656e745f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);background-color:currentColor;width:24px;height:24px;}\n            .post-history-menu-content\n                .menu-action-button\n                .return-to-latest-icon\n         {mask-image:var(--ehagaki-icon-766572746963616c5f616c69676e5f746f705f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);background-color:currentColor;}\n            .post-history-menu-content .menu-action-button .jump-to-oldest-icon\n         {mask-image:var(--ehagaki-icon-766572746963616c5f616c69676e5f626f74746f6d5f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);background-color:currentColor;}.post-history-nav-button .keyboard-arrow-up-icon {mask-image:var(--ehagaki-icon-6b6579626f6172645f6172726f775f75705f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);width:28px;height:28px;}.post-history-nav-button .keyboard-arrow-down-icon {mask-image:var(--ehagaki-icon-6b6579626f6172645f6172726f775f646f776e5f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);width:28px;height:28px;}.post-history-nav-button .cloud-download-icon {mask-image:var(--ehagaki-icon-636c6f75645f646f776e6c6f61645f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);width:28px;height:28px;}.post-history-nav-loading-placeholder .loader-container .square {background-color:currentColor;}.post-preview.svelte-9hvdbo {display:flex;flex-direction:column;min-width:0;color:var(--text);font-size:1rem;}.post-history-thread-anchor-post.svelte-9hvdbo {display:flex;flex-direction:column;min-width:0;}.post-preview-body.svelte-9hvdbo {display:flex;flex-direction:column;padding-inline-start:1rem;gap:4px;}.post-history-thread-toggle-button.selected {--btn-bg: var(--post-history-preview-footer-surface, var(--dialog-bg));color:var(--text-light);}\n\n    @media (hover: hover) and (pointer: fine) {\n                .post-history-thread-toggle-button.selected:hover:not(:disabled)\n             {background-color:light-dark(\n                color-mix(in srgb, var(--dialog-bg), black 20%),\n                color-mix(in srgb, var(--dialog-bg), white 30%)\n            );color:light-dark(\n                color-mix(in srgb, var(--text), black 20%),\n                color-mix(in srgb, var(--text), white 30%)\n            );}\n    }.delete-confirm-body.svelte-9hvdbo {display:flex;flex-direction:column;justify-content:center;gap:0.5rem;margin:10px 0 30px 0;margin-inline:auto;text-align:start;}.delete-confirm-description.svelte-9hvdbo,\n    .delete-confirm-warning.svelte-9hvdbo {line-height:1.5;margin:0;}.delete-confirm-warning.svelte-9hvdbo {color:var(--text-light);font-size:0.875rem;}.copy-icon {mask-image:var(--ehagaki-icon-66696c655f636f70795f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.search-icon.svelte-9hvdbo {mask-image:var(--ehagaki-icon-7365617263685f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.post-history-search-close .xmark-icon.svelte-9hvdbo {mask-image:var(--ehagaki-icon-636c6f73655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.repair-icon.svelte-9hvdbo {mask-image:var(--ehagaki-icon-726566726573685f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.post-history-saved-boundary.svelte-9hvdbo,\n    .post-history-sparse-state.svelte-9hvdbo {display:grid;gap:8px;margin:16px 0;padding:12px;border:1px solid var(--border-hr);border-radius:10px;color:var(--text-muted);background:color-mix(in srgb, var(--bg-input) 72%, transparent);}.post-history-saved-boundary.svelte-9hvdbo {padding:0;border:0;border-radius:0;background:transparent;}.post-history-saved-boundary.svelte-9hvdbo p:where(.svelte-9hvdbo),\n    .post-history-sparse-state.svelte-9hvdbo p:where(.svelte-9hvdbo) {margin:0;}.post-history-saved-boundary-actions.svelte-9hvdbo {display:flex;width:fit-content;max-width:100%;box-sizing:border-box;justify-self:center;flex-wrap:wrap;justify-content:center;align-items:flex-start;gap:8px;}.post-history-saved-boundary-actions .post-history-nav-button {height:52px;}\n\n    @media (max-width: 600px) {.post-history-saved-boundary-actions.svelte-9hvdbo {width:min(100%, 320px);flex-direction:column;align-items:center;}.post-history-saved-boundary-actions .post-history-nav-button {width:100%;flex:0 0 52px;}\n    }.import-icon.svelte-9hvdbo {mask-image:var(--ehagaki-icon-636c6f75645f646f776e6c6f61645f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.trash-icon {mask-image:var(--ehagaki-icon-64656c6574655f666f72657665725f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}"
};
function Dh(t, a) {
	n(a, !0), e(t, Eh);
	let o = () => R(Pe, "$_", d), s = () => R(Ae, "$locale", d), [d, f] = te(), v = (e, t = u) => {
		let n = U(() => Yr(t().eventId));
		var i = r(), a = T(i), o = (e) => {
			{
				let r = U(() => Wr(t().eventId)), i = U(() => Xr(t().eventId));
				Nr(e, {
					get count() {
						return F(n).totalCount;
					},
					get expanded() {
						return F(r);
					},
					get ariaLabel() {
						return F(i);
					},
					onToggle: () => qr(t().eventId)
				});
			}
		};
		W(a, (e) => {
			F(n) && F(n).totalCount > 0 && e(o);
		}), _(e, i);
	}, y = (e, t = u) => {
		let n = U(() => Yr(t().eventId));
		var i = r(), a = T(i), o = (e) => {
			dr(e, {
				get readModel() {
					return F(n);
				},
				get emojiLoadStateByUrl() {
					return _n.emojiLoadStateByUrl;
				},
				get emojiImageMetaByUrl() {
					return _n.emojiImageMetaByUrl;
				}
			});
		}, s = U(() => F(n) && F(n).totalCount > 0 && Wr(t().eventId));
		W(a, (e) => {
			F(s) && e(o);
		}), _(e, i);
	}, b = (e, t = u, n = u) => {
		{
			let r = U(() => Ye.isPostMenuOpen(n())), i = U(() => o()(it(t().kind) ? "repost.outerActions" : "repost.targetActions"));
			Kr(e, {
				get open() {
					return F(r);
				},
				onOpenChange: (e) => ui(n(), e),
				get post() {
					return t();
				},
				get owner() {
					return q();
				},
				get rxNostr() {
					return fe();
				},
				get relayConfig() {
					return me();
				},
				get operations() {
					return Ar;
				},
				active: () => F(J) && !Y,
				get triggerLabel() {
					return F(i);
				},
				onDelete: () => ti(t()),
				onRequestRepost: () => void Le(t()),
				onRefresh: () => He.refreshRelatedEvents(t()),
				get onRepost() {
					return ce();
				},
				get repostPending() {
					return G();
				}
			});
		}
	}, x = le().overlayTarget, A = L(a, "show", 3, !1), M = L(a, "sessionOpen", 3, void 0), ee = L(a, "onInitialReady", 3, void 0), ie = L(a, "onReplyPost", 3, void 0), oe = L(a, "onQuotePost", 3, void 0), se = L(a, "onReactionPost", 3, void 0), ce = L(a, "onRepostPost", 3, void 0), G = L(a, "repostPending", 3, !1), ue = L(a, "onRetryRepostSave", 3, void 0), de = L(a, "repostSaveFailure", 3, null), q = L(a, "pubkeyHex", 3, null), fe = L(a, "rxNostr", 3, void 0), me = L(a, "relayConfig", 3, null), he = L(a, "latestPostedEvent", 3, null), ge = L(a, "inboundInteractionSave", 3, null), _e = L(a, "authoredSelfPostSave", 3, null), ve = L(a, "reconcileInboundDirectReplyCandidates", 3, void 0), ye = L(a, "notifySavedAuthoredPosts", 3, void 0), be = H(!1), J = U(() => A() && !F(be)), xe = 0, Y = !1, Se = !1;
	function Ce() {
		Se = !1, O(be, !1);
	}
	function we() {
		F(be) || (Se || $.saveCurrentSessionScrollAnchor(), O(be, !0), xe++, nt++, Ne++, X.suspend(), $.suspend(), gn.suspend(), Z.cancelCurrentChannelResolution(), He.cancelCurrentGraphFetches(), qe.suspend(), Je.cancelCurrentSync(), Oe.reset(), ke.invalidateScope("post-history-listing-quote-visible-range-repair"), ze.suspend(), je.suspend(), ke.invalidateScope("post-history-repost-operation"), _n.suspend(), Ye.resetDeleteConfirmation(), Ye.closeAllPostItemMenus(), O(ut, !1), Q.suspend(), O(yt, !1), O(bt, null), O($e, !1), O(lt, !1), O(st, !1), Xe.resetState(), ri(), dt.hideMessage(), gt(), dt.cancel(), O(Ht, !1), O(zt, [], !0), O(Vt, -1), O(wt, {}, !0), O(Ct, {}, !0), O(Kt, !1), O(qt, !1), Jt = !1, Yt = !1);
	}
	function Te() {
		we(), xe++;
	}
	function Ee() {
		return F(Ht);
	}
	w(() => {
		let e = A();
		j(() => e ? Ce() : we());
	});
	function De() {
		let e = xe, t = q(), n = fe();
		return () => e === xe && F(J) && t === q() && n === fe();
	}
	let Oe = mr({
		getShow: () => !Y && F(J),
		getRxNostr: () => Y ? void 0 : fe()
	}), ke = hr({
		loadRepostTarget: Or,
		getShow: () => !Y && F(J),
		getRxNostr: () => Y ? void 0 : fe(),
		getRelayConfig: () => Y ? null : me(),
		profileSyncCoordinator: Oe
	}), X = Mf({
		getShow: () => !Y && F(J),
		getSessionOpen: () => M() ?? A(),
		getPubkeyHex: () => Y ? null : q(),
		getRxNostr: () => Y ? void 0 : fe(),
		getRelayConfig: () => Y ? null : me(),
		getSessionScrollState: () => $.readCurrentSessionScrollState(),
		onSessionScrollStateInvalidated: () => $.clearAllSessionScrollAnchorsForCurrentPubkey(),
		onSavedAuthoredPosts: async (e) => {
			await ye()?.(e);
		},
		onLocalHistoryChanged: Ui,
		onChildInteractionBadgeRefreshRequested: (e, t) => He.loadCachedChildInteractionStateForPosts(e, t),
		onQuoteVisibleRangeRefreshRequested: (e) => ze.refreshQuotePreviews(e),
		quoteVisibleRangeRepairExecutor: async (e, t) => {
			let n = Ve(t.visiblePosts);
			n.length !== 0 && await ke.ensureTargets(n);
		},
		pageSize: 50
	}), je = jr({
		getShow: () => !Y && F(J),
		getPubkey: () => Y ? null : q(),
		getPosts: () => X.posts,
		resolver: ke
	}), Me = H(null), Ne = 0;
	w(() => (F(J), q(), Ne++, O(Me, null), () => ke.invalidateScope("post-history-repost-operation")));
	function Fe(e, t) {
		return {
			...t.repost === !1 ? {} : {
				onRepost: Ie(e) ? () => void Le(e) : void 0,
				repostPending: G()
			},
			copyFailed: Xe.copyState[e.eventId] === "failed",
			showBroadcast: Pr(e),
			broadcastSending: Dr(e),
			showDelete: ei(e),
			deletionSending: Tr(e),
			onCopyPointerDown: (t) => Xe.captureCopyPointerPosition(e, t),
			onCopyNevent: (t) => void Xe.handleCopyNevent(e, t),
			...t.externalClient ? {
				externalClientLabel: xi(),
				onOpenExternalClient: () => Si(e)
			} : {},
			onShowRawJson: () => di(e.rawEvent, [
				...e.relayHints,
				...e.acceptedRelays,
				...e.fetchedRelays ?? []
			]),
			onBroadcastPointerDown: (t) => ii(e, t),
			onBroadcastPost: (t) => void ni(e, t),
			onOpenDeleteConfirm: () => ti(e)
		};
	}
	function Ie(e) {
		return !!ce() && Ze(e.kind) && e.deletedAt === void 0 && K(e.rawEvent, e);
	}
	async function Le(e) {
		if (!ce() || G() || !Ie(e)) return;
		O(Me, null);
		let t = Ne, n = De(), r = await ce()(e, (e, t) => {
			if (!n()) throw new DOMException("History tab suspended", "AbortError");
			return ke.prepareRepostTarget({
				relationKind: "repost",
				scopeKey: "post-history-repost-operation",
				targetEventId: e.id,
				authorHint: e.pubkey,
				relayHints: t
			}, e);
		});
		t === Ne && F(J) && O(Me, r, !0);
	}
	let Z = Lr({
		getShow: () => !Y && F(J),
		getSessionOpen: () => M() ?? A(),
		getPosts: () => [...X.posts, ...X.posts.flatMap((e) => {
			if (!it(e.kind)) return [];
			let t = je.getPreview(e);
			return t.status === "resolved" && t.event?.kind === 42 ? [at(t.event, t.relayHints)] : [];
		})],
		getRxNostr: () => Y ? void 0 : fe(),
		getRelayConfig: () => Y ? null : me(),
		getIsSearchMode: () => X.isSearchMode
	}), ze = Gr({
		getShow: () => !Y && F(J),
		getPosts: () => X.posts,
		getRxNostr: () => Y ? void 0 : fe(),
		getRelayConfig: () => Y ? null : me(),
		relatedTargetResolver: ke,
		profileSyncCoordinator: Oe
	});
	function Be(e) {
		let t = je.getPreview(e);
		return t.status === "resolved" && t.event?.kind === 42 ? Z.getChannelText(at(t.event, t.relayHints), o()) : null;
	}
	function Ve(e) {
		let t = Vr.buildIndex(e);
		return Object.values(t.contextsByEventId).map((e) => Vr.toDescriptor(e, "post-history-listing-quote-visible-range-repair"));
	}
	let He = pm({
		onRelatedEventsRefreshed: (e) => {
			(e === "success" || e === "partial") && _t();
		},
		onDeletedPost: (e, t, n) => X.patchDeletedPost(e, t, n),
		getShow: () => !Y && F(J),
		getSessionOpen: () => M() ?? A(),
		getPubkeyHex: () => Y ? null : q(),
		getRxNostr: () => Y ? void 0 : fe(),
		getRelayConfig: () => Y ? null : me(),
		relatedTargetResolver: ke,
		profileSyncCoordinator: Oe
	}), Ue = U(() => new Map(X.posts.map((e) => [e.eventId, He.getAnchorState(e)])));
	function We(e) {
		return F(Ue).get(e.eventId) ?? He.getAnchorState(e);
	}
	function Ge() {
		let e = /* @__PURE__ */ new Map(), t = new Set(X.posts.filter((e) => ![6, 16].includes(e.kind)).map((e) => e.eventId)), n = (n, r) => {
			let i = n.id;
			i && !t.has(i) && e.set(i, {
				eventId: i,
				targetAuthorPubkey: n.pubkey,
				targetKind: n.kind,
				relayHints: Array.from(/* @__PURE__ */ new Set([...e.get(i)?.relayHints ?? [], ...r]))
			});
		}, r = (e) => {
			e && (n(e.node.event, e.node.relayUrls), r(e.parentNodeState), e.replyNodeStates.forEach(r));
		};
		for (let e of X.posts) {
			let t = [6, 16].includes(e.kind) ? mt(e.rawEvent) : null;
			t && n(t.event, [
				...e.fetchedRelays ?? [],
				...e.acceptedRelays,
				...e.relayHints
			]);
			let i = je.getPreview(e);
			i.status === "resolved" && i.event && n(i.event, i.relayHints);
			let a = We(e);
			r(a.parentNodeState), a.replyNodeStates.forEach(r);
			for (let t of ze.getQuotePreviews(e)) t.status === "resolved" && n(t.event, t.relayHints);
		}
		return Array.from(e.values());
	}
	let Ke = U(Ge), qe = Mr({
		getShow: () => !Y && F(J),
		getSessionOpen: () => M() ?? A(),
		getPubkeyHex: () => Y ? null : q(),
		getRxNostr: () => Y ? void 0 : fe(),
		getRelayConfig: () => Y ? null : me(),
		getTargets: () => F(Ke),
		profileSync: Oe
	}), Je = hm({
		getShow: () => !Y && F(J),
		getPubkeyHex: () => Y ? null : q(),
		getRxNostr: () => Y ? void 0 : fe(),
		getRelayConfig: () => Y ? null : me(),
		getPosts: () => X.posts,
		onSavedInboundInteractions: (e) => He.loadCachedChildInteractionStateForPosts(X.posts, e),
		reconcileDirectReplyCandidates: (e) => ve()?.(e) ?? Promise.resolve({
			changedParentEventIds: [],
			savedDirectReplyCount: 0,
			unresolvedParentEventIds: e.map((e) => e.classification.parentEventId).filter((e) => !!e)
		})
	}), Ye = Ir(), Xe = Hr();
	function Qe() {
		let e = /* @__PURE__ */ new Date();
		return fa(`${`${e.getFullYear()}`}-${`${e.getMonth() + 1}`.padStart(2, "0")}-${`${e.getDate()}`.padStart(2, "0")}`);
	}
	let $e = H(!1), et = H("none"), tt = H(!1), nt = 0, rt = H(P(Qe())), ot = H(P(Qe())), st = H(!1), ct = null, lt = H(!1), ut = H(!1), Q = zu({
		getShow: () => !Y && F(J),
		getScope: () => ({
			ownerPubkeyHex: q(),
			rxNostr: fe(),
			relayConfig: me()
		}),
		onSettled: Bi
	}), dt = Lm({
		getShow: () => F(J),
		getPubkeyHex: () => q(),
		downloadContainer: x,
		onStart: () => {
			O(lt, !1);
		}
	}), ft = H(!1), pt = H("postHistory.relatedEventsApplied"), ht;
	function gt() {
		ht !== void 0 && (clearTimeout(ht), ht = void 0), O(ft, !1);
	}
	function _t(e = "postHistory.relatedEventsApplied") {
		gt(), O(pt, e, !0), O(ft, !0), e === "postHistory.relatedEventsApplied" && (ht = setTimeout(gt, 1800));
	}
	async function vt(e, t = e.eventId) {
		let n = De();
		_t("postHistory.relatedEventsChecking");
		try {
			await He.refreshRelatedEvents(e, t);
		} finally {
			n() && F(pt) === "postHistory.relatedEventsChecking" && gt();
		}
	}
	let yt = H(!1), bt = H(null), xt = H(P([])), St = H(0), Ct = H(P({})), wt = H(P({})), Tt = H(!1), Et = H(0), Dt = H(0), Ot = H("postHistory.broadcastSent"), kt, jt = H(void 0), Nt = H(P({})), zt = H(P([])), Vt = H(-1), Ht = H(!1), Ut = H(null), Wt = H(null), Gt = H(null), Kt = H(!1), qt = H(!1), Jt = !1, Yt = !1, Xt = !1, Zt = !1, Qt = null, $t = null, tn = typeof IntersectionObserver < "u", nn = H(!1), rn = null, cn = H(null), dn = H(!1), mn = H(!1), gn = lr({
		getShow: () => !Y && F(J),
		getSessionOpen: () => M() ?? A(),
		getPosts: () => X.posts.map((e) => ({
			...e,
			content: en(e.content, e.tags)
		})),
		getContainer: () => F(Wt)
	}), $ = Gf({
		getShow: () => !Y && F(J),
		getPubkeyHex: () => Y ? null : q(),
		getPosts: () => X.posts,
		getLocale: () => s(),
		getContainer: () => F(Wt),
		getIsSearchMode: () => X.isSearchMode,
		getSearchQuery: () => X.state.searchQuery
	}), _n = pn({
		getShow: () => !Y && F(J),
		getSessionOpen: () => M() ?? A(),
		getEmojiUrls: () => F(Hn),
		onStateChanged: () => gn.remeasure()
	});
	function vn(e) {
		let t = it(e.kind) ? "" : en(e.content, e.tags), n = Fn({
			...e,
			content: t
		});
		return on({
			kind: e.kind,
			sourceContent: t,
			displayContent: n,
			tags: e.tags,
			media: e.media
		});
	}
	let yn = Ur();
	function Cn(e) {
		return yn.get(e, {
			ownerPubkey: q(),
			rxNostr: fe(),
			relayConfig: me()
		});
	}
	let Tn = U(() => {
		let e = {};
		for (let t of X.posts) e[t.eventId] = vn(t);
		return e;
	}), Dn = U(() => X.currentViewRefetchStatusMessageKey ?? X.syncStatusMessageKey), On = U(() => X.currentViewRefetchStatusMessageKey ? X.currentViewRefetchStatusMessageValues : null), kn = U(() => X.syncStatus === "failed" || X.currentViewRefetchStatusMessageKey === "postHistory.repairFetchFailed"), An = H(!1), jn = U(() => F(J) && !Q.state.open && !dt.running && X.isDialogOpenSyncing && F(Dn) === "postHistory.syncing" && X.posts.length > 0);
	w(() => {
		if (O(An, !1), !F(jn)) return;
		let e = setTimeout(() => {
			O(An, !0);
		}, 1e3);
		return () => clearTimeout(e);
	});
	let Mn = U(() => X.canReturnToLatest || !$.isHistoryScrolledToTop), Nn = U(() => X.canJumpToOldest || !$.isHistoryScrolledToBottom), Pn = U(() => X.isSearchMode ? X.searchResultStatus === "loading" : X.initialLocalLoadStatus === "loading"), In = U(() => X.posts.length === 0 && (X.isSearchMode ? X.searchResultStatus === "ready" : X.initialLocalLoadStatus === "ready"));
	w(() => {
		if (!F(J) || F(mn) || !ee()) return;
		let e = X.isSearchMode ? X.searchResultStatus : X.initialLocalLoadStatus;
		(!q() || X.posts.length > 0 || e === "ready" || e === "failed") && (O(mn, !0), ee()());
	});
	let Ln = /* @__PURE__ */ new WeakMap(), Rn = {};
	function zn(e, t) {
		if (t[e.id]) return;
		let n = Ln.get(e);
		n || (n = on({
			kind: e.kind,
			sourceContent: e.content,
			tags: e.tags
		}), Ln.set(e, n)), t[e.id] = n;
	}
	function Bn(e, t, n) {
		if (e && !n.has(e.node.eventId)) {
			n.add(e.node.eventId), zn(e.node.event, t), Bn(e.parentNodeState, t, n);
			for (let r of e.replyNodeStates) Bn(r, t, n);
		}
	}
	let Vn = U(() => {
		let e = {};
		for (let t of X.posts) {
			let n = /* @__PURE__ */ new Set();
			for (let n of wr(t)) n.status === "resolved" && zn(n.event, e);
			let r = We(t);
			r.parentNode && zn(r.parentNode.event, e), Bn(r.parentNodeState, e, n);
			for (let t of r.replyNodeStates) Bn(t, e, n);
		}
		let t = Object.keys(e);
		return (t.length !== Object.keys(Rn).length || t.some((t) => e[t] !== Rn[t])) && (Rn = e), Rn;
	}), Hn = U(() => {
		let e = /* @__PURE__ */ new Set();
		for (let t of [...Object.values(F(Tn)), ...Object.values(F(Vn))]) for (let n of t.previewContent.emojiUrls) e.add(n);
		for (let t of X.posts) {
			let n = We(t);
			if (F(Nt)[t.eventId]) for (let t of n.reactionReadModel.groups) t.emojiUrl && e.add(t.emojiUrl);
		}
		for (let t of F(Ke)) {
			if (!F(Nt)[t.eventId]) continue;
			let n = Yr(t.eventId);
			for (let t of n?.groups ?? []) t.emojiUrl && e.add(t.emojiUrl);
		}
		return [...e];
	});
	function Un() {
		nt += 1, Oe.reset(), Xe.resetState(), ri(), dt.hideMessage(), gt(), Ye.resetDeleteConfirmation(), O(ut, !1), Q.setOpen(!1), O(yt, !1), O(bt, null), O($e, !1), O(et, "none"), O(tt, !1), O(rt, Qe(), !0), O(ot, Qe(), !0), O(st, !1), O(lt, !1), O(Ct, {}, !0), O(wt, {}, !0), Yn(), O(Nt, {}, !0), _n.resetState(), O(zt, [], !0), O(Vt, -1), O(Ht, !1);
	}
	function Wn() {
		if (Se) return;
		Se = !0, nt += 1;
		let e = X.isSearchMode;
		e && $.clearCurrentSessionScrollAnchor(), X.resetSearchState(), X.prepareForClose() ? $.clearAllSessionScrollAnchorsForCurrentPubkey() : e || $.saveCurrentSessionScrollAnchor(), Z.cancelCurrentChannelResolution(), He.cancelCurrentGraphFetches(), Ye.resetDeleteConfirmation(), O(ut, !1), Q.setOpen(!1), O(yt, !1), O(bt, null), O($e, !1), O(lt, !1), Xe.hideCopyFloatingMessage(), ri(), dt.hideMessage(), gt(), dt.cancel(), O(Ht, !1), O(zt, [], !0), O(Vt, -1), xe++;
	}
	function Kn() {
		Wn(), a.onClose?.();
	}
	N(() => {
		let e = tn && !X.isSearchMode && X.state.listingMode === "contiguous" && !F(tt) && X.state.hasNewerLocal;
		j(() => F(nn)) !== e && (rn = { anchor: $.captureHistoryScrollAnchor() }, O(nn, e, !0));
	}), w(() => {
		F(nn);
		let e = j(() => rn);
		e && ($.restoreHistoryScrollAnchor(e.anchor), rn = null);
	}), w(() => {
		(M() ?? A()) || j(() => {
			dt.cancel(), Un();
		});
	}), w(() => {
		dt.running && dt.ownerPubkeyHex && q() !== dt.ownerPubkeyHex && dt.cancel();
	}), w(() => {
		if (!F(J) || !F(Pn) || ee() && !F(mn)) {
			O(dn, !1);
			return;
		}
		O(dn, !1);
		let e = setTimeout(() => {
			F(J) && F(Pn) && O(dn, !0);
		}, 200);
		return () => {
			clearTimeout(e);
		};
	});
	let Jn = Kf({ getRoot: () => F(Wt) });
	w(() => {
		let e = F(Gt), t = F(Wt), n = Jn.height, r = Jn.resizeGeneration;
		if (!(F(J) && e && t && n !== null && n > 0 && !X.isSearchMode && X.state.listingMode === "contiguous" && X.state.hasOlderLocal && !X.isFetchingOlderFromRelays && !X.isRefetchingAroundCurrentView) || !tn) {
			Jt = !1, Xt = !1, Qt = null;
			return;
		}
		let i = Yf({
			direction: "older",
			root: t,
			sentinel: e,
			rootHeight: n,
			resizeGeneration: r,
			previousContext: Qt,
			isAutoLoading: () => F(Kt),
			isAwaitingExit: () => Jt,
			clearAwaitingExit: () => {
				Jt = !1;
			},
			setSentinelIntersecting: (e) => {
				Xt = e;
			},
			canAutoLoad: ir,
			load: () => {
				or();
			}
		});
		return Qt = i.context, () => {
			i.dispose();
		};
	}), w(() => {
		X.state.loadedPosts, j(() => Qt?.reconcileAfterWindowChange());
	}), w(() => {
		let e = F(Wt), t = Jn.height, n = Jn.resizeGeneration;
		if (!(F(J) && e && t !== null && t > 0 && !X.isSearchMode && X.state.listingMode === "contiguous" && X.state.hasNewerLocal && F(nn) && !F(tt) && !X.isRefetchingAroundCurrentView) || !tn) {
			Yt = !1, Zt = !1, $t = null;
			return;
		}
		let r = $t, i = !0, a = () => {}, o = null;
		return ne().then(() => {
			i && (o = requestAnimationFrame(() => {
				if (o = null, !i) return;
				let s = e.querySelector(".post-history-auto-load-newer-sentinel");
				if (!s || F(Wt) !== e) return;
				let c = Yf({
					direction: "newer",
					root: e,
					sentinel: s,
					rootHeight: t,
					resizeGeneration: n,
					previousContext: r,
					isAutoLoading: () => F(qt),
					isAwaitingExit: () => Yt,
					clearAwaitingExit: () => {
						Yt = !1;
					},
					setSentinelIntersecting: (e) => {
						Zt = e;
					},
					canAutoLoad: sr,
					load: () => {
						cr();
					}
				});
				$t = c.context, a = c.dispose;
			}));
		}), () => {
			i = !1, o !== null && cancelAnimationFrame(o), a();
		};
	}), re(() => {
		Y = !0, xe++, nt += 1, dt.cancel(), Yn(), Oe.dispose(), dt.hideMessage(), gt();
	}), w(() => {
		if (!F(J) || !he()?.id) return;
		let e = he().id, t = De();
		ct !== e && (X.posts, He.recordPostedReply(he(), X.posts).then((n) => {
			n && t() && (ct = e);
		}).catch(() => void 0));
	}), w(() => {
		let e = X.posts;
		F(J) && e.length !== 0 && (tr(e.map((e) => e.eventId)).catch(() => void 0), j(() => He.loadCachedChildInteractionStateForPosts(e)));
	}), w(() => {
		let e = ge()?.revision ?? 0, t = ge()?.parentEventIds ?? [], n = X.posts;
		if (!F(J) || e <= 0 || t.length === 0) return;
		j(() => qe.refreshCachedReactions(t)).catch(() => void 0), j(() => He.loadCachedChildInteractionStateForPosts(n, t));
		let r = De();
		qn({
			source: "dialog-inbound-save",
			parentEventIds: t,
			rxNostr: fe(),
			relayConfig: me(),
			isActive: r
		}).then((e) => {
			if (!(!r() || e.deletedReactionEventIds.length === 0 && e.deletedReplyEventIds.length === 0)) return He.loadCachedChildInteractionStateForPosts(X.posts, e.checkedParentEventIds);
		}).catch(() => void 0);
	}), w(() => {
		let e = _e()?.revision ?? 0;
		!F(J) || e <= 0 || X.isSearchMode || X.canReturnToLatest || j(() => X.returnToLatest());
	}), w(() => {
		if (F(J)) return () => {
			Z.cancelCurrentChannelResolution();
		};
	});
	function Xn(e) {
		return e ? e.values ? o()(e.key, { values: e.values }) : o()(e.key) : null;
	}
	function Zn() {
		return Xn(hn({
			totalCount: X.displayTotalCount,
			totalCountKnown: X.displayTotalCountKnown,
			totalCountStatus: X.displayTotalCountStatus,
			isSearchMode: X.isSearchMode
		}));
	}
	function Qn(e) {
		if (!e) return null;
		let t = Number(e.year), n = Number(e.month), r = Number(e.day), i = new Date(t, n - 1, r, 23, 59, 59, 999).getTime();
		return Number.isFinite(i) ? Math.floor(i / 1e3) : null;
	}
	function $n() {
		return o()(an({
			direction: "older",
			isSearchMode: X.isSearchMode
		}));
	}
	function er() {
		return o()(an({
			direction: "newer",
			isSearchMode: X.isSearchMode
		}));
	}
	async function rr() {
		let e = De();
		if (!e()) return;
		let t = X.isSearchMode, n = t ? $.captureHistoryScrollAnchor() : null, r = await X.loadOlder();
		e() && r && t && $.restoreHistoryScrollAnchor(n);
	}
	function ir() {
		return F(J) && !X.isSearchMode && X.state.listingMode === "contiguous" && X.state.hasOlderLocal && !X.isRefetchingAroundCurrentView;
	}
	function ar() {
		let e = null;
		return {
			captureAnchorEventId: () => (e = $.captureHistoryScrollAnchor(), e?.eventId ?? null),
			canCommitWindowChange: (e, t, n) => $.canCommitAutoLoadWindowChange(e, t, n),
			onCommitted: () => {
				C(), $.restoreHistoryScrollAnchor(e, { flushUpdates: !1 }), Qt?.reconcileAfterCommit(), $t?.reconcileAfterCommit();
			}
		};
	}
	async function or() {
		let e = De();
		if (!(F(Kt) || Jt || !ir())) {
			O(Kt, !0), Jt = !0;
			try {
				let t = await X.loadOlder(ar());
				e() && !t && (Jt = !1);
			} finally {
				if (!e()) return;
				O(Kt, !1), Xt || (Jt = !1), Qt?.resumeAfterLoad();
			}
		}
	}
	function sr() {
		return F(J) && !X.isSearchMode && X.state.listingMode === "contiguous" && X.state.hasNewerLocal && !F(tt) && !X.isRefetchingAroundCurrentView;
	}
	async function cr() {
		let e = De();
		if (!(F(qt) || Yt || !sr())) {
			O(qt, !0), Yt = !0;
			try {
				await X.loadNewer(ar());
			} finally {
				if (!e()) return;
				O(qt, !1), Zt || (Yt = !1), $t?.resumeAfterLoad();
			}
		}
	}
	async function ur() {
		let e = De();
		if (!e()) return;
		let t = await X.showSavedOlderPosts();
		e() && t && $.resetHistoryScrollSoon();
	}
	async function fr() {
		let e = De();
		if (!e()) return;
		let t = $.captureHistoryScrollAnchor(), n = F(Wt)?.scrollTop ?? null;
		X.state.loadedPosts.length, F(Wt)?.scrollHeight, F(Wt)?.clientHeight;
		let r = !1, i = () => {
			e() && n !== null && F(J) && F(Wt) && (r = $.restoreHistoryScrollAnchor(t, { flushUpdates: !1 }), r || (F(Wt).scrollTop = n));
		}, a = await X.fetchOlderFromRelays({
			anchorEventId: t?.eventId,
			viewportCommit: {
				captureAnchorEventId: () => (t = $.captureHistoryScrollAnchor(), e() ? (t && (n = F(Wt)?.scrollTop ?? null), t?.eventId ?? null) : null),
				onCommitted: () => {
					C(), i();
				}
			}
		});
		e() && (await ne(), e() && (a && i(), X.latestOlderBackfillUiResult, F(Wt)?.scrollTop, F(Wt)?.scrollHeight));
	}
	async function pr() {
		let e = De();
		if (!e()) return;
		let t = X.isSearchMode ? null : $.captureHistoryScrollAnchor(), n = await X.loadNewer();
		e() && n && (X.isSearchMode ? $.resetHistoryScrollSoon() : $.restoreHistoryScrollAnchor(t));
	}
	async function gr() {
		let e = De();
		if (!e()) return;
		$.clearAllSessionScrollAnchorsForCurrentPubkey();
		let t = X.canReturnToLatest ? await X.returnToLatest() : !1;
		e() && (O(tt, !1), (t || !$.isHistoryScrolledToTop) && $.resetHistoryScrollSoon());
	}
	async function Sr() {
		let e = De();
		if (!e()) return;
		let t = Qn(F(rt));
		if (t === null) return;
		$.clearAllSessionScrollAnchorsForCurrentPubkey(), O(tt, !0);
		let n = await X.jumpToCreatedAt(t);
		e() && (n || O(tt, !1), n && (O(et, "none"), O(st, !1), $.resetHistoryScrollSoon()));
	}
	function Cr(e) {
		return F(Tn)[e.eventId] ?? vn(e);
	}
	function wr(e) {
		return ze.getQuotePreviews(e);
	}
	function Tr(e) {
		return F(Ct)[e.eventId] === "sending";
	}
	function Er(e) {
		return F(Ct)[e.eventId] === "failed";
	}
	function Dr(e) {
		return F(wt)[e.eventId] === "sending";
	}
	let Ar = Jr(() => fe(), () => F(J) && !Y, () => `${q()}:${JSON.stringify(me())}`);
	function Pr(e) {
		return _r(e) !== null;
	}
	let Fr = {
		getSensitiveBodyLoader: Cn,
		onImageOpen: Ji,
		buildPostRecordForNode: si,
		onCopyPointerDown: _i,
		onCopyNevent: vi,
		onOpenExternalClient: yi,
		isCopyFailed: hi,
		onShowRawJson: mi,
		onBroadcastPointerDown: Ci,
		onBroadcastPost: wi,
		isBroadcastSending: gi,
		canDeleteNodePost: Ti,
		isDeletionSending: Ei,
		onOpenDeleteConfirm: Di
	};
	function Rr(e) {
		return {
			onRefreshRelatedEvents: (t) => void vt(e, t),
			onToggleNodeParent: (t) => $.preserveThreadParentToggleScroll(e.eventId, t, () => He.toggleNodeParent(e, t)),
			onRetryNodeParent: (t) => He.retryNodeParent(e, t),
			onToggleNodeChildren: (t) => He.toggleNodeChildren(e, t),
			onRetryNodeChildren: (t) => He.retryNodeChildren(e, t)
		};
	}
	function zr(e) {
		let t = We(e).repliesActionState;
		return Xn(ln(t)) ?? "";
	}
	function Br(e) {
		return !!F(Nt)[e.eventId];
	}
	function Wr(e) {
		return !!F(Nt)[e];
	}
	function qr(e) {
		O(Nt, {
			...F(Nt),
			[e]: !F(Nt)[e]
		}, !0);
	}
	function Yr(e) {
		let t = X.posts.find((t) => t.eventId === e);
		return t && ![6, 16].includes(t.kind) ? We(t).reactionReadModel : qe.getReadModel(e);
	}
	function Xr(e) {
		let t = Yr(e);
		return Xn(fn({
			visible: Wr(e),
			reactionCount: t?.totalCount ?? 0
		})) ?? "";
	}
	function Zr(e) {
		let t = We(e).reactionSummary.totalCount;
		return Xn(fn({
			visible: Br(e),
			reactionCount: t
		})) ?? "";
	}
	function Qr(e) {
		qr(e.eventId);
	}
	function $r(e) {
		let t = We(e).repliesActionState;
		t.status === "failed" || t.status === "loaded" && t.replyCount === 0 ? He.retryChildren(e) : He.toggleChildren(e);
	}
	function ei(e) {
		return br(e, q());
	}
	function ti(e) {
		ei(e) && Ye.openDeleteConfirm(e);
	}
	async function ni(e, t) {
		let n = De();
		if (!F(J) || Dr(e)) return;
		let r = ai(e, t);
		O(wt, {
			...F(wt),
			[e.eventId]: "sending"
		}, !0);
		let i = await Ar.broadcast(e) ?? { success: !1 };
		n() && (O(wt, {
			...F(wt),
			[e.eventId]: void 0
		}, !0), oi(r, i));
	}
	function ri() {
		kt &&= (clearTimeout(kt), void 0), O(Tt, !1), O(jt, void 0);
	}
	function ii(e, t) {
		O(jt, {
			eventId: e.eventId,
			...Rt(t.clientX, t.clientY)
		}, !0);
	}
	function ai(e, t) {
		if (F(jt)?.eventId === e.eventId) return {
			x: F(jt).x,
			y: F(jt).y
		};
		let n = t.currentTarget, r = n instanceof HTMLElement ? n.getBoundingClientRect() : null;
		return Rt(r ? r.left + r.width / 2 : 0, r ? r.bottom + 8 : 0);
	}
	function oi(e, t) {
		kt && clearTimeout(kt), O(Et, e.x, !0), O(Dt, e.y, !0), O(Ot, t.success ? "postHistory.broadcastSent" : "postHistory.broadcastFailed", !0), O(Tt, !0), kt = setTimeout(() => {
			O(Tt, !1), kt = void 0;
		}, 1800);
	}
	function si(e) {
		return pe(e.node.event, e.node.relayUrls);
	}
	function ci(e) {
		return pe(e);
	}
	function li(e, t) {
		return `quote-preview:${e}:${t}`;
	}
	function ui(e, t) {
		t && Ye.closeAllPostItemMenus(), Ye.setPostMenuOpen(e, t);
	}
	function di(e, t = []) {
		O(bt, e, !0), O(xt, [...t], !0), O(St, F(St) + 1), O(yt, !0);
	}
	function fi(e, t) {
		let n = fe(), r = q();
		return un({
			structure: e,
			relayHints: F(xt),
			rxNostr: n,
			relayConfig: me(),
			signal: t
		}).then((e) => t.aborted || n !== fe() || r !== q() ? null : e);
	}
	function pi(e, t) {
		return Cn(e)?.observe?.(t) ?? (() => {});
	}
	function mi(e) {
		di(e.node.event, e.node.relayUrls);
	}
	function hi(e) {
		return Xe.copyState[e] === "failed";
	}
	function gi(e) {
		return F(wt)[e] === "sending";
	}
	function _i(e, t) {
		Xe.captureCopyPointerPosition(si(e), t);
	}
	function vi(e, t) {
		Xe.handleCopyNevent(si(e), t);
	}
	function yi(e) {
		Si(si(e));
	}
	function bi() {
		return {
			client: Bt.externalNostrClient,
			customUrlTemplate: Bt.externalNostrClientCustomUrl
		};
	}
	function xi() {
		let e = Mt(bi());
		return e ? o()("postHistory.openInExternalClient", { values: { client: e } }) : o()("postHistory.openInExternalClientFallback");
	}
	function Si(e) {
		let t = It(e, bi(), At.value);
		t && window.open(t, "_blank", "noopener,noreferrer");
	}
	function Ci(e, t) {
		ii(si(e), t);
	}
	function wi(e, t) {
		ni(si(e), t);
	}
	function Ti(e) {
		return br(si(e), q());
	}
	function Ei(e) {
		return F(Ct)[e] === "sending";
	}
	function Di(e) {
		let t = si(e);
		ei(t) && Ye.openDeleteConfirm(t);
	}
	async function Oi(e) {
		let t = De();
		if (!F(J)) return !1;
		let n = await se()?.(e) ?? !1;
		return n && t() && Kn(), n;
	}
	async function ki(e) {
		if (!ie()) return;
		let t = De();
		await ie()(e) !== !1 && t() && Kn();
	}
	function Ai(e) {
		oe() && (oe()(e), Kn());
	}
	function ji() {
		Ye.cancelDeleteConfirm();
	}
	async function Mi() {
		let e = De();
		e() && (await ne(), e() && F(et) === "search" && F(cn)?.focus({ preventScroll: !0 }));
	}
	function Ni() {
		F(et) === "search" ? (Pi(), O(lt, !1)) : (O(et, "search"), O(lt, !1), Mi());
	}
	function Pi() {
		$.clearCurrentSessionScrollAnchor(), O(et, "none"), X.resetSearchState();
	}
	async function Fi(e) {
		let t = ++nt;
		O(tt, !0);
		let n = await X.jumpToEventId(e.eventId);
		t === nt && F(J) && (n ? ($.clearAllSessionScrollAnchorsForCurrentPubkey(), O(et, "none"), X.resetSearchState(), $.scrollHistoryEventToTopSoon(e.eventId)) : O(tt, !1));
	}
	function Ii() {
		let e = F(et) !== "jump-date";
		O(et, e ? "jump-date" : "none", !0), e || O(st, !1), O(lt, !1);
	}
	function Li() {
		O(et, "none"), O(st, !1);
	}
	function Ri() {
		O($e, !0), O(lt, !1);
	}
	function zi() {
		O(ut, !0), O(lt, !1);
	}
	async function Bi(e) {
		let t = De();
		if (!t()) return;
		let n = q(), r = nt, i = $.captureHistoryScrollAnchor(), a = F(Wt)?.scrollTop ?? null;
		await X.refreshAfterRelayScan(e), await ne(), t() && F(J) && q() === n && r === nt && F(Wt) && !$.restoreHistoryScrollAnchor(i) && a !== null && (F(Wt).scrollTop = a);
	}
	async function Vi(e) {
		await Ui(() => X.refreshAfterLocalImport(e));
	}
	let Hi = "ehagaki-post-history-coverage-import";
	w(() => {
		if (!globalThis.__POST_HISTORY_COVERAGE__) return;
		let e = (e) => {
			if (!(e instanceof CustomEvent)) return;
			let t = e.detail;
			if (!t?.result || typeof t.resolve != "function") return;
			let n = t.resolve;
			Vi(t.result).finally(n);
		};
		return window.addEventListener(Hi, e), () => {
			window.removeEventListener(Hi, e);
		};
	});
	async function Ui(e) {
		let t = De();
		if (!t()) return;
		let n = q(), r = nt, i = $.captureHistoryScrollAnchor(), a = F(Wt)?.scrollTop ?? null;
		await e(), t() && F(J) && q() === n && r === nt && !X.isSearchMode && F(Wt) && !$.restoreHistoryScrollAnchor(i) && a !== null && (F(Wt).scrollTop = a);
	}
	function Wi() {
		O(lt, !1), X.refetchAroundCurrentView();
	}
	function Gi() {
		let e = De();
		$.clearAllSessionScrollAnchorsForCurrentPubkey(), O(lt, !1), X.jumpToOldest().then((t) => {
			e() && (t || !$.isHistoryScrolledToBottom) && $.resetHistoryScrollToBottomSoon();
		});
	}
	function Ki() {
		O(lt, !1), gr();
	}
	function qi() {
		O($e, !1);
	}
	function Ji(e) {
		O(zt, e.mediaList, !0), O(Vt, e.index, !0), O(Ht, e.mediaList.length > 0 && e.index >= 0, !0);
	}
	function Yi(e) {
		O(Vt, e, !0);
	}
	function Xi() {
		O(Ht, !1), O(zt, [], !0), O(Vt, -1);
	}
	let Zi = H(!1);
	w(() => {
		F(J) || O(Zi, !1);
	});
	async function Qi() {
		let e = De(), t = Ye.deleteTargetPost;
		if (!t) return;
		O(Ct, {
			...F(Ct),
			[t.eventId]: "sending"
		}, !0);
		let n = await Ar.deletePost(t) ?? { success: !1 };
		if (e()) {
			if (O(Zi, n.success && n.sensitivePayloadOmitted === !0, !0), n.success && typeof n.deletedAt == "number" && n.deletionEventId) {
				if (X.patchDeletedPost(t.eventId, n.deletedAt, n.deletionEventId), He.recordDeletedEvent({
					eventId: t.eventId,
					authorPubkey: t.pubkeyHex,
					deletionEvent: n.deletionEvent ?? null,
					deletionEventAttestation: n.deletionEventAttestation
				}).catch(() => void 0), O(Ct, {
					...F(Ct),
					[t.eventId]: void 0
				}, !0), Ze(t.kind)) for (let e of X.posts) it(e.kind) && je.retry(e);
			} else O(Ct, {
				...F(Ct),
				[t.eventId]: "failed"
			}, !0);
			Ye.clearDeleteTarget();
		}
	}
	async function $i() {
		let e = q(), t = ++nt, n = await X.deleteLocalHistory();
		F(J) && q() === e && t === nt && n && ($.clearAllSessionScrollAnchorsForCurrentPubkey(), O($e, !1), O(et, "none"), $.resetHistoryScrollSoon());
	}
	var ea = {
		activate: Ce,
		suspend: we,
		invalidateSession: Te,
		isFullscreen: Ee,
		prepareClose: Wn
	}, ta = r(), na = T(ta), ra = (e) => {
		var t = Th(), n = T(t), a = B(n);
		Pt(a, {
			get show() {
				return F(ft);
			},
			variant: "parent-top",
			children: (e, t) => {
				var n = Rm(), r = D(n, !0);
				z((e) => g(r, e), [() => o()(F(pt))]), _(e, n);
			},
			$$slots: { default: !0 }
		});
		var s = I(a, 2), u = (e) => {
			var t = zm(), n = D(t, !0);
			z((e) => g(n, e), [() => o()("postHistory.sensitivePayloadDeletionOmitted")]), _(e, t);
		};
		W(s, (e) => {
			F(Zi) && e(u);
		});
		var d = I(s, 2), f = B(d), h = B(f), C = (e) => {
			var t = Bm(), n = B(t), r = D(n, !0);
			c(t), z(() => g(r, $.currentMonthLabel)), _(e, t);
		};
		W(h, (e) => {
			$.currentMonthLabel && e(C);
		});
		var w = I(h, 2);
		{
			let e = U(() => o()("postHistory.jumpToDate"));
			Lt(w, {
				className: "post-history-heading-action-button post-history-heading-calendar-button",
				variant: "default",
				shape: "square",
				contentLayout: "icon",
				get ariaLabel() {
					return F(e);
				},
				onClick: Ii,
				children: (e, t) => {
					var n = Vm();
					_(e, n);
				},
				$$slots: { default: !0 }
			});
		}
		c(f);
		var A = I(f, 2), j = B(A), M = (e) => {
			{
				let t = U(() => dt.progress.phase === "loading" ? o()("postHistory.exportLoading") : dt.progress.phase === "verifying" ? o()("postHistory.exportVerifying", { values: {
					processed: dt.progress.processed ?? 0,
					total: dt.progress.total ?? 0
				} }) : o()("postHistory.exportCreating"));
				Re(e, {
					get text() {
						return F(t);
					},
					showLoader: !0,
					loaderSize: 30,
					state: "loading",
					customClass: "status-loading-placeholder"
				});
			}
		};
		W(j, (e) => {
			dt.running && e(M);
		});
		var N = I(j, 2);
		{
			let e = U(() => o()("postHistory.repair")), t = U(() => !X.canRefetchAroundCurrentView);
			Lt(N, {
				className: "post-history-heading-action-button post-history-heading-refetch-button",
				variant: "default",
				shape: "square",
				contentLayout: "icon",
				get ariaLabel() {
					return F(e);
				},
				get disabled() {
					return F(t);
				},
				onClick: Wi,
				children: (e, t) => {
					var n = Hm();
					_(e, n);
				},
				$$slots: { default: !0 }
			});
		}
		var P = I(N, 2);
		{
			let e = U(() => o()(F(et) === "search" ? "postHistory.hideSearch" : "postHistory.showSearch"));
			Lt(P, {
				className: "post-history-heading-action-button post-history-heading-search-button",
				variant: "default",
				shape: "square",
				contentLayout: "icon",
				get ariaLabel() {
					return F(e);
				},
				onClick: Ni,
				children: (e, t) => {
					var n = Um();
					_(e, n);
				},
				$$slots: { default: !0 }
			});
		}
		var ee = I(P, 2);
		l(ee, () => wn, (e, t) => {
			t(e, {
				get open() {
					return F(lt);
				},
				set open(e) {
					O(lt, e, !0);
				},
				children: (e, t) => {
					var n = Qm(), i = T(n);
					{
						let e = U(() => `menu-trigger post-history-menu-trigger post-history-heading-menu-trigger ${F(lt) ? "is-open" : ""}`.trim()), t = U(() => o()("postHistory.openMenu"));
						l(i, () => En, (n, r) => {
							r(n, {
								get class() {
									return F(e);
								},
								get "aria-label"() {
									return F(t);
								},
								children: (e, t) => {
									var n = Wm();
									_(e, n);
								},
								$$slots: { default: !0 }
							});
						});
					}
					var a = I(i, 2);
					l(a, () => Ft, (e, t) => {
						t(e, {
							get to() {
								return x;
							},
							children: (e, t) => {
								var n = r(), i = T(n);
								l(i, () => Sn, (e, t) => {
									t(e, {
										side: "bottom",
										align: "end",
										sideOffset: 8,
										class: "post-history-menu-content",
										trapFocus: !1,
										preventScroll: !1,
										onCloseAutoFocus: (e) => e.preventDefault(),
										children: (e, t) => {
											var n = Zm(), r = B(n), i = (e) => {
												var t = Gm(), n = T(t), r = B(n), i = D(r, !0);
												c(n);
												var a = I(n, 2);
												l(a, () => xn, (e, t) => {
													t(e, { class: "post-history-menu-separator" });
												}), z((e) => g(i, e), [() => Zn()]), _(e, t);
											}, a = U(() => Zn());
											W(r, (e) => {
												F(a) && e(i);
											});
											var s = I(r, 2);
											{
												let e = U(() => !F(Mn));
												l(s, () => bn, (t, n) => {
													n(t, {
														class: "menu-action-button",
														get disabled() {
															return F(e);
														},
														onSelect: Ki,
														children: (e, t) => {
															var n = Km(), r = I(T(n), 2), i = D(r, !0);
															z((e) => g(i, e), [() => o()("postHistory.returnToLatest")]), _(e, n);
														},
														$$slots: { default: !0 }
													});
												});
											}
											var u = I(s, 2);
											{
												let e = U(() => !F(Nn));
												l(u, () => bn, (t, n) => {
													n(t, {
														class: "menu-action-button",
														get disabled() {
															return F(e);
														},
														onSelect: Gi,
														children: (e, t) => {
															var n = qm(), r = I(T(n), 2), i = D(r, !0);
															z((e) => g(i, e), [() => o()("postHistory.jumpToOldest")]), _(e, n);
														},
														$$slots: { default: !0 }
													});
												});
											}
											var d = I(u, 2);
											l(d, () => xn, (e, t) => {
												t(e, { class: "post-history-menu-separator" });
											});
											var f = I(d, 2);
											{
												let e = U(() => !q() || dt.running);
												l(f, () => bn, (t, n) => {
													n(t, {
														class: "menu-action-button",
														get disabled() {
															return F(e);
														},
														get onSelect() {
															return dt.start;
														},
														children: (e, t) => {
															var n = Jm(), r = I(T(n), 2), i = D(r, !0);
															z((e) => g(i, e), [() => o()("postHistory.export")]), _(e, n);
														},
														$$slots: { default: !0 }
													});
												});
											}
											var p = I(f, 2);
											{
												let e = U(() => !q());
												l(p, () => bn, (t, n) => {
													n(t, {
														class: "menu-action-button",
														get disabled() {
															return F(e);
														},
														onSelect: zi,
														children: (e, t) => {
															var n = Ym(), r = I(T(n), 2), i = D(r, !0);
															z((e) => g(i, e), [() => o()("postHistory.import")]), _(e, n);
														},
														$$slots: { default: !0 }
													});
												});
											}
											var m = I(p, 2);
											{
												let e = U(() => !q() || !fe());
												l(m, () => bn, (t, n) => {
													n(t, {
														class: "menu-action-button",
														get disabled() {
															return F(e);
														},
														onSelect: () => {
															O(lt, !1), Q.setOpen(!0);
														},
														children: (e, t) => {
															var n = Ym(), r = I(T(n), 2), i = D(r, !0);
															z((e) => g(i, e), [() => o()("postHistory.fullScanTitle")]), _(e, n);
														},
														$$slots: { default: !0 }
													});
												});
											}
											var h = I(m, 2);
											l(h, () => xn, (e, t) => {
												t(e, { class: "post-history-menu-separator" });
											});
											var v = I(h, 2);
											l(v, () => bn, (e, t) => {
												t(e, {
													class: "menu-action-button menu-action-button-danger",
													onSelect: Ri,
													children: (e, t) => {
														var n = Xm(), r = I(T(n), 2), i = D(r, !0);
														z((e) => g(i, e), [() => o()("postHistory.deleteLocalHistory")]), _(e, n);
													},
													$$slots: { default: !0 }
												});
											}), c(n), _(e, n);
										},
										$$slots: { default: !0 }
									});
								}), _(e, n);
							},
							$$slots: { default: !0 }
						});
					}), _(e, n);
				},
				$$slots: { default: !0 }
			});
		}), c(A), c(d), E(d, (e) => O(Ut, e), () => F(Ut));
		var te = I(d, 2), L = (e) => {
			var t = th(), n = B(t);
			let r;
			var i = B(n), a = B(i), s = (e) => {
				Re(e, {
					variant: "spinner",
					showLoader: !0,
					loaderSize: 24,
					ariaHidden: !0,
					customClass: "post-history-search-spinner"
				});
			}, l = (e) => {
				var t = $m();
				_(e, t);
			};
			W(a, (e) => {
				X.isSearchPageLoading ? e(s) : e(l, -1);
			}), c(i);
			var u = I(i, 2);
			V(u), E(u, (e) => O(cn, e), () => F(cn)), c(n);
			var d = I(n, 2);
			{
				let e = U(() => o()("postHistory.hideSearch"));
				Lt(d, {
					type: "button",
					class: "post-history-search-close",
					contentLayout: "icon",
					shape: "square",
					get ariaLabel() {
						return F(e);
					},
					onClick: Pi,
					children: (e, t) => {
						var n = eh();
						_(e, n);
					},
					$$slots: { default: !0 }
				});
			}
			c(t), z((e, t) => {
				r = m(n, 1, "post-history-search-input-wrapper svelte-9hvdbo", null, r, { "post-history-search-active": X.isSearchMode }), ae(u, "placeholder", e), ae(u, "aria-label", t), ae(u, "aria-busy", X.isSearchPageLoading ? "true" : "false");
			}, [() => o()("postHistory.searchPlaceholder"), () => o()("postHistory.search")]), k(u, () => X.state.searchInput, (e) => X.state.searchInput = e), _(e, t);
		};
		W(te, (e) => {
			F(et) === "search" && e(L);
		});
		var ne = I(te, 2), R = (e) => {
			Xu(e, {
				onSubmit: () => void Sr(),
				onClose: Li,
				get value() {
					return F(rt);
				},
				set value(e) {
					O(rt, e, !0);
				},
				get placeholder() {
					return F(ot);
				},
				set placeholder(e) {
					O(ot, e, !0);
				},
				get open() {
					return F(st);
				},
				set open(e) {
					O(st, e, !0);
				}
			});
		};
		W(ne, (e) => {
			F(et) === "jump-date" && e(R);
		});
		var re = I(ne, 2), H = B(re), ce = (e) => {
			var t = nh(), n = B(t);
			Re(n, {
				variant: "spinner",
				showLoader: !0,
				loaderSize: 24
			}), c(t), _(e, t);
		}, le = (e) => {
			var t = rh(), n = B(t), r = D(n, !0);
			c(t), z((e) => g(r, e), [() => X.isSearchMode ? o()("postHistory.searchNoResults") : o()("postHistory.empty")]), _(e, t);
		}, K = (e) => {
			var t = yh(), n = T(t), a = (e) => {
				var t = ah(), n = B(t);
				{
					let e = U(() => !X.canLoadNewer);
					Lt(n, {
						type: "button",
						variant: "default",
						className: "post-history-nav-button",
						contentLayout: "iconText",
						get disabled() {
							return F(e);
						},
						onClick: () => void pr(),
						children: (e, t) => {
							var n = ih(), r = I(T(n));
							z((e) => g(r, ` ${e ?? ""}`), [() => er()]), _(e, n);
						},
						$$slots: { default: !0 }
					});
				}
				c(t), _(e, t);
			};
			W(n, (e) => {
				(X.isSearchMode ? X.canLoadNewer : X.state.hasNewerLocal && (F(tt) || !tn || X.state.listingMode !== "contiguous")) && e(a);
			});
			var s = I(n, 2), l = (e) => {
				var t = sh();
				let n;
				var r = B(t), i = (e) => {
					var t = oh(), n = B(t), r = (e) => {
						Re(e, {
							variant: "spinner",
							showLoader: !0,
							loaderSize: 24,
							ariaHidden: !0
						});
					};
					W(n, (e) => {
						F(qt) && e(r);
					}), c(t), _(e, t);
				};
				W(r, (e) => {
					F(nn) && X.state.hasNewerLocal && e(i);
				}), c(t), z(() => n = m(t, 1, "post-history-auto-load-slot post-history-auto-load-newer-slot svelte-9hvdbo", null, n, { "post-history-auto-load-newer-slot-reserved": F(nn) })), _(e, t);
			};
			W(s, (e) => {
				tn && !X.isSearchMode && X.state.listingMode === "contiguous" && !F(tt) && e(l);
			});
			var u = I(s, 2);
			i(u, 21, () => X.posts, (e) => e.eventId, (e, t) => {
				let n = U(() => We(F(t))), r = U(() => Rr(F(t)));
				var i = lh();
				let a;
				var s = B(i), l = B(s), u = B(l), d = (e) => {
					{
						let n = U(() => se() ? Oi : void 0), r = U(() => je.getPreview(F(t))), i = U(() => Be(F(t))), a = U(() => ie() ? ki : void 0), o = U(() => oe() ? Ai : void 0), s = U(() => Cn(je.getPreview(F(t)).event));
						kr(e, {
							get onReactionPost() {
								return F(n);
							},
							get reactionExtras() {
								return v;
							},
							get reactionDetails() {
								return y;
							},
							get post() {
								return F(t);
							},
							get preview() {
								return F(r);
							},
							get channelText() {
								return F(i);
							},
							get menu() {
								return b;
							},
							onRetry: () => je.retry(F(t)),
							get onReplyPost() {
								return F(a);
							},
							get onQuotePost() {
								return F(o);
							},
							get loadSensitiveBody() {
								return F(s);
							},
							get scrollRoot() {
								return F(Wt);
							},
							onImageOpen: Ji,
							get emojiLoadStateByUrl() {
								return _n.emojiLoadStateByUrl;
							},
							get emojiImageMetaByUrl() {
								return _n.emojiImageMetaByUrl;
							}
						});
					}
				}, f = U(() => it(F(t).kind)), p = (e) => {
					var i = ch(), a = T(i), s = (e) => {
						{
							let n = U(() => F(t).kind === 42 ? Z.getChannelText(F(t), o()) : null), r = U(() => Er(F(t))), i = U(() => !(ie() || oe())), a = U(() => Ye.isPostMenuOpen(F(t).eventId));
							gl(e, {
								get post() {
									return F(t);
								},
								get channelText() {
									return F(n);
								},
								get deletionFailed() {
									return F(r);
								},
								get showTimestampMenu() {
									return F(i);
								},
								get menuOpen() {
									return F(a);
								},
								onMenuOpenChange: (e) => ui(F(t).eventId, e),
								get showSurroundingPostsAction() {
									return X.isSearchMode;
								},
								onShowSurroundingPosts: () => void Fi(F(t)),
								getActionItems: () => Fe(F(t), { externalClient: !0 })
							});
						}
					}, l = U(() => F(t).kind === 42 || F(t).deletedAt || Er(F(t)) || !(ie() || oe()));
					W(a, (e) => {
						F(l) && e(s);
					});
					var u = I(a, 2);
					{
						let e = U(xi), i = U(() => se() ? Oi : void 0), a = U(() => ie() ? ki : void 0), o = U(() => oe() ? Ai : void 0);
						Xl(u, S({
							get state() {
								return F(n);
							},
							section: "parent"
						}, () => Fr, () => F(r), {
							get previewModelByEventId() {
								return F(Vn);
							},
							get emojiLoadStateByUrl() {
								return _n.emojiLoadStateByUrl;
							},
							get emojiImageMetaByUrl() {
								return _n.emojiImageMetaByUrl;
							},
							get scrollRoot() {
								return F(Wt);
							},
							get externalClientLabel() {
								return F(e);
							},
							get onReactionPost() {
								return F(i);
							},
							get onReplyPost() {
								return F(a);
							},
							get onQuotePost() {
								return F(o);
							},
							onToggleParent: () => $.preserveThreadParentToggleScroll(F(t).eventId, F(t).eventId, () => He.toggleParent(F(t))),
							onRetryParent: () => He.retryParent(F(t))
						}));
					}
					var d = I(u, 2), f = B(d), p = B(f);
					{
						let e = (e) => {
							{
								let n = U(() => gn.shouldCollapsePost(F(t))), r = U(() => gn.isPostExpanded(F(t))), i = U(() => "post-preview-content-" + F(t).eventId);
								vr(e, {
									placement: "overlay",
									get visible() {
										return F(n);
									},
									get expanded() {
										return F(r);
									},
									get controls() {
										return F(i);
									},
									onToggle: () => gn.togglePostExpanded(F(t).eventId)
								});
							}
						}, n = (e) => {
							{
								let n = U(() => wr(F(t))), r = U(() => se() ? Oi : void 0), i = U(() => ie() ? ki : void 0), a = U(() => oe() ? Ai : void 0);
								yl(e, {
									get parentEventId() {
										return F(t).eventId;
									},
									get previews() {
										return F(n);
									},
									get emojiLoadStateByUrl() {
										return _n.emojiLoadStateByUrl;
									},
									get emojiImageMetaByUrl() {
										return _n.emojiImageMetaByUrl;
									},
									get scrollRoot() {
										return F(Wt);
									},
									getSensitiveBodyLoader: Cn,
									getModel: (e) => F(Vn)[e],
									onImageOpen: Ji,
									onRetry: (e) => ze.retryQuotePreview(e),
									get onReactionPost() {
										return F(r);
									},
									get onReplyPost() {
										return F(i);
									},
									get onQuotePost() {
										return F(a);
									},
									getReactionReadModel: Yr,
									isReactionExpanded: Wr,
									getReactionLabel: Xr,
									onToggleReaction: qr,
									buildRecord: ci,
									buildMenuKey: li,
									isMenuOpen: (e) => Ye.isPostMenuOpen(e),
									onMenuOpenChange: ui,
									getActionItems: (e) => Fe(e, {
										externalClient: !0,
										repost: !1
									})
								});
							}
						}, r = U(() => Cr(F(t))), i = U(() => Cn(F(t).rawEvent)), a = U(() => "post-preview-content-" + F(t).eventId), o = U(() => !gn.isPostExpanded(F(t)));
						sn(p, {
							get model() {
								return F(r);
							},
							get loadSensitiveBody() {
								return F(i);
							},
							resolveSensitiveDisplayContent: (e) => Fn({
								content: e,
								tags: F(t).tags
							}),
							get contentWarningEventId() {
								return F(t).eventId;
							},
							density: "standard",
							get emojiLoadStateByUrl() {
								return _n.emojiLoadStateByUrl;
							},
							get emojiImageMetaByUrl() {
								return _n.emojiImageMetaByUrl;
							},
							get scrollRoot() {
								return F(Wt);
							},
							get previewCollapseAction() {
								return gn.previewRef;
							},
							get previewCollapseEventId() {
								return F(t).eventId;
							},
							get previewContentId() {
								return F(a);
							},
							get isTextCollapsed() {
								return F(o);
							},
							onImageOpen: Ji,
							textOverlay: e,
							afterContentAndMedia: n,
							$$slots: {
								textOverlay: !0,
								afterContentAndMedia: !0
							}
						});
					}
					c(f);
					var m = I(f, 2);
					{
						let e = U(() => se() ? Oi : void 0), r = U(() => ie() ? ki : void 0), i = U(() => oe() ? Ai : void 0), a = U(() => zr(F(t))), o = U(() => Br(F(t))), s = U(() => Zr(F(t))), c = U(() => Ye.isPostMenuOpen(F(t).eventId)), l = U(xi);
						ru(m, {
							get post() {
								return F(t);
							},
							get graphState() {
								return F(n);
							},
							get emojiLoadStateByUrl() {
								return _n.emojiLoadStateByUrl;
							},
							get emojiImageMetaByUrl() {
								return _n.emojiImageMetaByUrl;
							},
							get onReactionPost() {
								return F(e);
							},
							get onReplyPost() {
								return F(r);
							},
							get onQuotePost() {
								return F(i);
							},
							get repliesActionLabel() {
								return F(a);
							},
							onRepliesAction: () => $r(F(t)),
							get reactionsExpanded() {
								return F(o);
							},
							get reactionsActionLabel() {
								return F(s);
							},
							onToggleReactions: () => Qr(F(t)),
							get menuOpen() {
								return F(c);
							},
							onMenuOpenChange: (e) => ui(F(t).eventId, e),
							get externalClientLabel() {
								return F(l);
							},
							onOpenExternalClient: () => Si(F(t)),
							onRefreshRelatedEvents: () => void vt(F(t)),
							get isSearchMode() {
								return X.isSearchMode;
							},
							onShowSurroundingPosts: () => void Fi(F(t)),
							getActionItems: () => Fe(F(t), { externalClient: !1 })
						});
					}
					var h = I(m, 2);
					{
						let e = U(xi), t = U(() => se() ? Oi : void 0), i = U(() => ie() ? ki : void 0), a = U(() => oe() ? Ai : void 0);
						Xl(h, S({
							get state() {
								return F(n);
							},
							section: "children"
						}, () => Fr, () => F(r), {
							get previewModelByEventId() {
								return F(Vn);
							},
							get emojiLoadStateByUrl() {
								return _n.emojiLoadStateByUrl;
							},
							get emojiImageMetaByUrl() {
								return _n.emojiImageMetaByUrl;
							},
							get scrollRoot() {
								return F(Wt);
							},
							get externalClientLabel() {
								return F(e);
							},
							get onReactionPost() {
								return F(t);
							},
							get onReplyPost() {
								return F(i);
							},
							get onQuotePost() {
								return F(a);
							},
							getReactionReadModel: Yr,
							isReactionExpanded: Wr,
							getReactionLabel: Xr,
							onToggleReaction: qr
						}));
					}
					c(d), z(() => {
						ae(d, "data-post-history-thread-anchor-scope-id", F(t).eventId), ae(d, "data-post-history-thread-anchor-event-id", F(t).eventId);
					}), _(e, i);
				};
				W(u, (e) => {
					F(f) ? e(d) : e(p, -1);
				}), c(l), c(s), c(i), z(() => {
					a = m(i, 1, "post-history-item svelte-9hvdbo", null, a, { "post-history-item-deleted": !!F(t).deletedAt }), ae(i, "data-post-history-event-id", F(t).eventId), ae(i, "data-post-history-posted-at", F(t).postedAt);
				}), _(e, i);
			}), c(u);
			var d = I(u, 2), f = (e) => {
				var t = dh(), n = B(t), r = (e) => {
					var t = uh(), n = B(t), r = (e) => {
						Re(e, {
							variant: "spinner",
							showLoader: !0,
							loaderSize: 24,
							ariaHidden: !0
						});
					};
					W(n, (e) => {
						F(Kt) && X.syncStatus !== "syncing" && e(r);
					}), c(t), E(t, (e) => O(Gt, e), () => F(Gt)), _(e, t);
				};
				W(n, (e) => {
					X.state.hasOlderLocal && e(r);
				}), c(t), _(e, t);
			};
			W(d, (e) => {
				tn && !X.isSearchMode && X.state.listingMode === "contiguous" && !X.showSavedPostsBoundary && e(f);
			});
			var p = I(d, 2), h = (e) => {
				var t = fh(), n = B(t), r = D(n, !0), i = I(n, 2), a = D(i, !0);
				c(t), z((e, t) => {
					g(r, e), g(a, t);
				}, [() => o()("postHistory.savedOlderPostsShowing"), () => o()("postHistory.savedOlderPostsGapNotice")]), _(e, t);
			};
			W(p, (e) => {
				X.isShowingSavedOlderPosts && e(h);
			});
			var x = I(p, 2), C = (e) => {
				var t = hh(), n = B(t), i = B(n), a = (e) => {
					{
						let t = U(() => !X.canFetchOlderFromRelays || X.isRefetchingAroundCurrentView);
						Lt(e, {
							type: "button",
							variant: "primary",
							className: "post-history-nav-button",
							contentLayout: "iconText",
							get disabled() {
								return F(t);
							},
							onClick: () => void fr(),
							children: (e, t) => {
								var n = r(), i = T(n), a = (e) => {
									{
										let t = U(() => o()("postHistory.fetchOlderFromRelaysLoading"));
										Re(e, {
											get text() {
												return F(t);
											},
											showLoader: !0,
											loaderSize: 28,
											customClass: "post-history-nav-loading-placeholder"
										});
									}
								}, s = (e) => {
									var t = ph(), n = I(T(t));
									z((e) => g(n, ` ${e ?? ""}`), [() => o()("postHistory.fetchOlderFromRelays")]), _(e, t);
								};
								W(i, (e) => {
									X.isFetchingOlderFromRelays ? e(a) : e(s, -1);
								}), _(e, n);
							},
							$$slots: { default: !0 }
						});
					}
				};
				W(i, (e) => {
					(X.canFetchOlderFromRelays || X.isFetchingFromRelays) && e(a);
				});
				var s = I(i, 2);
				Lt(s, {
					type: "button",
					variant: "default",
					className: "post-history-nav-button",
					contentLayout: "iconText",
					onClick: () => void ur(),
					children: (e, t) => {
						var n = mh(), r = I(T(n));
						z((e) => g(r, ` ${e ?? ""}`), [() => o()("postHistory.showSavedOlderPosts")]), _(e, n);
					},
					$$slots: { default: !0 }
				}), c(n), c(t), _(e, t);
			}, w = (e) => {
				var t = gh(), n = B(t);
				{
					let e = U(() => !X.canLoadOlder);
					Lt(n, {
						type: "button",
						variant: "default",
						className: "post-history-nav-button",
						contentLayout: "iconText",
						get disabled() {
							return F(e);
						},
						onClick: () => void rr(),
						children: (e, t) => {
							var n = mh(), r = I(T(n));
							z((e) => g(r, ` ${e ?? ""}`), [() => $n()]), _(e, n);
						},
						$$slots: { default: !0 }
					});
				}
				c(t), _(e, t);
			}, k = (e) => {
				var t = gh(), n = B(t);
				{
					let e = U(() => !X.canLoadOlder);
					Lt(n, {
						type: "button",
						variant: "default",
						className: "post-history-nav-button",
						contentLayout: "iconText",
						get disabled() {
							return F(e);
						},
						onClick: () => void rr(),
						children: (e, t) => {
							var n = mh(), r = I(T(n));
							z((e) => g(r, ` ${e ?? ""}`), [() => $n()]), _(e, n);
						},
						$$slots: { default: !0 }
					});
				}
				c(t), _(e, t);
			}, A = (e) => {
				var t = _h(), n = B(t), i = (e) => {
					{
						let t = U(() => !X.canFetchOlderFromRelays || X.isRefetchingAroundCurrentView);
						Lt(e, {
							type: "button",
							variant: "primary",
							className: "post-history-nav-button",
							contentLayout: "iconText",
							get disabled() {
								return F(t);
							},
							onClick: () => void fr(),
							children: (e, t) => {
								var n = r(), i = T(n), a = (e) => {
									{
										let t = U(() => o()("postHistory.fetchOlderFromRelaysLoading"));
										Re(e, {
											get text() {
												return F(t);
											},
											showLoader: !0,
											loaderSize: 28,
											customClass: "post-history-nav-loading-placeholder"
										});
									}
								}, s = (e) => {
									var t = ph(), n = I(T(t));
									z((e) => g(n, ` ${e ?? ""}`), [() => o()("postHistory.fetchOlderFromRelays")]), _(e, t);
								};
								W(i, (e) => {
									X.isFetchingOlderFromRelays ? e(a) : e(s, -1);
								}), _(e, n);
							},
							$$slots: { default: !0 }
						});
					}
				};
				W(n, (e) => {
					(X.canFetchOlderFromRelays || X.isFetchingFromRelays || X.isRefetchingAroundCurrentView) && e(i);
				}), c(t), _(e, t);
			}, j = (e) => {
				var t = vh();
				_(e, t);
			};
			W(x, (e) => {
				X.showSavedPostsBoundary ? e(C) : X.isSearchMode && X.canLoadOlder ? e(w, 1) : !X.isSearchMode && X.state.hasOlderLocal && (X.state.listingMode === "sparse" || !tn) ? e(k, 2) : X.showLocalExhaustedState ? e(A, 3) : X.isSearchMode && X.posts.length > 0 && e(j, 4);
			}), _(e, t);
		};
		W(H, (e) => {
			X.posts.length === 0 && F(dn) ? e(ce) : F(In) ? e(le, 1) : e(K, -1);
		});
		var pe = I(H, 2), me = (e) => {
			var t = bh(), n = B(t);
			{
				let e = U(() => o()("postHistory.syncing"));
				Re(n, {
					get text() {
						return F(e);
					},
					variant: "spinner",
					showLoader: !0,
					loaderSize: 24
				});
			}
			c(t), _(e, t);
		};
		W(pe, (e) => {
			!X.isSearchMode && X.syncStatus === "syncing" && (X.posts.length > 0 || dt.running) && e(me);
		}), c(re), E(re, (e) => O(Wt, e), () => F(Wt));
		var he = I(re, 2), ge = (e) => {
			var t = Sh(), n = B(t);
			{
				let e = U(() => o()("postHistory.returnToLatest"));
				Lt(n, {
					type: "button",
					variant: "default",
					shape: "circle",
					className: "post-history-latest-button",
					contentLayout: "icon",
					get ariaLabel() {
						return F(e);
					},
					onClick: () => void gr(),
					children: (e, t) => {
						var n = xh();
						_(e, n);
					},
					$$slots: { default: !0 }
				});
			}
			c(t), _(e, t);
		};
		W(he, (e) => {
			F(Mn) && e(ge);
		});
		var _e = I(he, 2);
		{
			let e = U(() => !!q() && !!fe());
			Ru(_e, {
				get open() {
					return Q.state.open;
				},
				get running() {
					return Q.state.running;
				},
				get canStart() {
					return F(e);
				},
				get progress() {
					return Q.state.progress;
				},
				get result() {
					return Q.state.result;
				},
				get elapsedMs() {
					return Q.state.elapsedMs;
				},
				get onOpenChange() {
					return Q.setOpen;
				},
				onStart: () => void Q.start(),
				get onCancel() {
					return Q.cancel;
				}
			});
		}
		var ve = I(_e, 2);
		Su(ve, {
			get open() {
				return F(ut);
			},
			get ownerPubkeyHex() {
				return q();
			},
			getCurrentPubkeyHex: () => q(),
			onOpenChange: (e) => O(ut, e, !0),
			onImported: Vi
		});
		var ye = I(ve, 2);
		xr(ye, {
			get open() {
				return F(yt);
			},
			get rawEvent() {
				return F(bt);
			},
			get resetKey() {
				return F(St);
			},
			loadPayloadEvent: fi,
			observePayloadStatus: pi,
			onOpenChange: (e) => O(yt, e, !0)
		});
		var be = I(ye, 2);
		yr(be, {
			get result() {
				return F(Me);
			},
			get saveFailure() {
				return de();
			},
			get pending() {
				return G();
			},
			get anchor() {
				return F(Ut);
			},
			anchorRightOffset: 16,
			get onRetrySave() {
				return ue();
			}
		}), c(n);
		var xe = I(n, 2);
		{
			let e = U(() => F(J) && !Q.state.open && !dt.running && !!F(Dn) && !F(An)), t = U(() => F(jn) ? 200 : 0), n = U(() => !X.showStatusLoader);
			Pt(xe, {
				get show() {
					return F(e);
				},
				get fadeOutDuration() {
					return F(t);
				},
				variant: "anchor-center",
				get anchor() {
					return F(Ut);
				},
				get showInfoIcon() {
					return F(n);
				},
				children: (e, t) => {
					var n = r(), i = T(n), a = (e) => {
						{
							let t = U(() => F(On) ? o()(F(Dn), { values: F(On) }) : o()(F(Dn))), n = U(() => X.showStatusLoader ? "loading" : "complete"), r = U(() => `status-loading-placeholder post-history-heading-status-placeholder${F(kn) ? " status-error" : ""}`);
							Re(e, {
								get text() {
									return F(t);
								},
								get showLoader() {
									return X.showStatusLoader;
								},
								loaderSize: 30,
								get state() {
									return F(n);
								},
								get customClass() {
									return F(r);
								}
							});
						}
					};
					W(i, (e) => {
						F(Dn) && e(a);
					}), _(e, n);
				},
				$$slots: { default: !0 }
			});
		}
		var Y = I(xe, 2);
		{
			let e = (e) => {
				var t = Ch(), n = B(t), r = D(n, !0), i = I(n, 2), a = D(i, !0);
				c(t), z((e, t) => {
					g(r, e), g(a, t);
				}, [() => o()("postHistory.deleteRequestDescription"), () => o()("postHistory.deleteRequestWarning")]), _(e, t);
			}, t = U(() => o()("postHistory.deleteRequestTitle")), n = U(() => o()("postHistory.deleteRequestDescription")), r = U(() => Ye.deleteTargetPost && Tr(Ye.deleteTargetPost) ? o()("postHistory.deleteSending") : o()("postHistory.deleteConfirm")), i = U(() => o()("postHistory.deleteCancel")), a = U(() => Ye.deleteTargetPost ? Tr(Ye.deleteTargetPost) : !1);
			nr(Y, {
				get open() {
					return Ye.deleteConfirmOpen;
				},
				get onOpenChange() {
					return Ye.setDeleteConfirmOpen;
				},
				get title() {
					return F(t);
				},
				get description() {
					return F(n);
				},
				get confirmLabel() {
					return F(r);
				},
				get cancelLabel() {
					return F(i);
				},
				confirmVariant: "danger",
				get confirmDisabled() {
					return F(a);
				},
				onConfirm: Qi,
				onCancel: ji,
				contentClass: "post-history-delete-confirm",
				children: e,
				$$slots: { default: !0 }
			});
		}
		var Se = I(Y, 2);
		{
			let e = (e) => {
				var t = wh(), n = B(t), r = D(n, !0);
				c(t), z((e) => g(r, e), [() => o()("postHistory.deleteLocalHistoryDescription")]), _(e, t);
			}, t = U(() => o()("postHistory.deleteLocalHistoryTitle")), n = U(() => o()("postHistory.deleteLocalHistoryDescription")), r = U(() => o()("postHistory.deleteLocalHistoryConfirm")), i = U(() => o()("postHistory.deleteLocalHistoryCancel"));
			nr(Se, {
				get title() {
					return F(t);
				},
				get description() {
					return F(n);
				},
				get confirmLabel() {
					return F(r);
				},
				get cancelLabel() {
					return F(i);
				},
				confirmVariant: "danger",
				onConfirm: $i,
				onCancel: qi,
				closeOnConfirm: !1,
				preventCloseWhileConfirming: !0,
				showConfirmSpinner: !0,
				contentClass: "post-history-local-delete-confirm",
				get open() {
					return F($e);
				},
				set open(e) {
					O($e, e, !0);
				},
				children: e,
				$$slots: { default: !0 }
			});
		}
		var Ce = I(Se, 2);
		{
			let e = U(() => F(zt)[F(Vt)]?.src ?? ""), t = U(() => F(zt)[F(Vt)]?.alt ?? "");
			Gn(Ce, {
				get src() {
					return F(e);
				},
				get alt() {
					return F(t);
				},
				onClose: Xi,
				get mediaList() {
					return F(zt);
				},
				get currentIndex() {
					return F(Vt);
				},
				onNavigate: Yi,
				get show() {
					return F(Ht);
				},
				set show(e) {
					O(Ht, e, !0);
				}
			});
		}
		var we = I(Ce, 2);
		Pt(we, {
			get show() {
				return Xe.showCopyFloatingMessage;
			},
			get x() {
				return Xe.copyFloatingMessageX;
			},
			get y() {
				return Xe.copyFloatingMessageY;
			},
			children: (e, t) => {
				var n = Rm(), r = D(n, !0);
				z((e) => g(r, e), [() => o()("postHistory.copied")]), _(e, n);
			},
			$$slots: { default: !0 }
		});
		var Te = I(we, 2);
		Pt(Te, {
			get show() {
				return F(Tt);
			},
			get x() {
				return F(Et);
			},
			get y() {
				return F(Dt);
			},
			children: (e, t) => {
				var n = Rm(), r = D(n, !0);
				z((e) => g(r, e), [() => o()(F(Ot))]), _(e, n);
			},
			$$slots: { default: !0 }
		});
		var Ee = I(Te, 2);
		Pt(Ee, {
			get show() {
				return dt.showMessage;
			},
			variant: "top-right",
			children: (e, t) => {
				var n = Rm(), r = D(n, !0);
				z((e) => g(r, e), [() => o()(dt.messageKey, { values: dt.messageValues })]), _(e, n);
			},
			$$slots: { default: !0 }
		}), z(() => {
			m(re, 1, `post-history-container${tn && !X.isSearchMode && X.state.listingMode === "contiguous" ? " post-history-auto-load-enabled" : ""}`, "svelte-9hvdbo"), ae(re, "aria-busy", F(Pn) || F(Kt) ? "true" : "false");
		}), p("scroll", re, function(...e) {
			$.handleHistoryScroll?.apply(this, e);
		}), _(e, t);
	};
	W(na, (e) => {
		F(J) && e(ra);
	}), _(t, ta);
	var ia = h(ea);
	return f(), ia;
}
export { Dh as default };
