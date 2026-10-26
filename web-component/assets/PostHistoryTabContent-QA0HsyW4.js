import { At as e, B as t, C as n, Ct as r, F as i, G as a, I as o, J as s, K as c, M as l, Mt as u, N as d, R as f, T as p, U as m, W as h, X as g, Y as _, _ as v, a as y, at as b, ct as x, dt as S, et as C, f as w, ft as T, g as E, gt as D, h as O, i as k, jt as A, k as j, kt as ee, lt as M, mt as N, n as P, nt as F, o as te, ot as I, q as ne, r as L, s as R, st as z, t as re, tt as ie, ut as B, v as ae, vt as oe, w as V, wt as H, yt as U } from "./index-client-Bdka-Daw.js";
import { n as se } from "./appRuntimeEnvironment-BvtUCHcA.js";
import { d as ce, f as W, i as le, l as ue, n as de } from "./relayConfigUtils-DD5f1UAM.js";
import { a as fe, d as pe, i as me, l as he, n as G, o as ge, r as _e } from "./postHistoryEventUtils-CUIBkIiy.js";
import { B as ve, C as ye, E as be, F as xe, K as Se, M as Ce, N as K, Q as we, S as q, T as Te, V as Ee, W as De, X as Oe, _ as ke, dt as Ae, et as je, ht as Me, j as J, l as Y, m as Ne, o as Pe, pt as Fe, q as Ie, r as Le, s as Re, st as X, t as Z, tt as ze, v as Be, w as Ve, x as He } from "./LoadingPlaceholder-j1_vRYno.js";
import { _ as Ue } from "./signedEventResultValidator-vNb8KnFy.js";
import { f as We, h as Ge } from "./relayStore.svelte-BIc4bQdy.js";
import { J as Ke, Tt as qe, Y as Je, Z as Ye, c as Xe, d as Ze, l as Qe, t as $e, u as et } from "./appUtils-C7IXsQBk.js";
import { n as tt } from "./settingsStore.svelte-CSIU6F7z.js";
import { t as nt } from "./rx-nostr-BHeS362x.js";
import { C as rt, D as it, E as at, J as ot, K as st, L as ct, M as lt, N as ut, P as dt, Q as ft, S as pt, T as mt, _ as ht, c as Q, ct as gt, dt as _t, et as vt, ft as yt, g as bt, h as xt, k as St, l as Ct, lt as wt, m as Tt, n as Et, p as Dt, rt as Ot, s as kt, tt as At, u as jt, ut as Mt, v as Nt, x as Pt } from "./nip65RelayDirectory-BTlaIUmx.js";
import { $ as Ft, A as It, B as Lt, C as Rt, D as zt, E as Bt, F as Vt, H as Ht, I as Ut, L as Wt, N as Gt, O as Kt, P as qt, Q as Jt, S as Yt, U as Xt, V as Zt, W as Qt, Z as $t, a as en, at as tn, b as nn, et as rn, h as an, it as on, j as sn, m as cn, n as ln, nt as un, ot as dn, r as fn, rt as pn, t as mn, tt as hn, w as gn, x as _n, z as vn } from "./sensitiveContentPayloadReader-C2SL7kJU.js";
import { c as yn, g as bn } from "./legacyImportMarkers-CZ4J2IrE.js";
import { i as xn } from "./clipboardUtils-CZAthnT_.js";
import { n as Sn } from "./sr-only-styles-BjSIU7_G.js";
import { a as Cn, i as wn, n as Tn, o as En, r as Dn, s as On, t as kn } from "./menu-trigger-DMUMT31S.js";
import { t as An } from "./hidden-input-tPGwDx5-.js";
import { o as $ } from "./safe-polygon.svelte-0GusN-Ja.js";
import { t as jn } from "./DialogWrapper-B6dIEHnd.js";
import { t as Mn } from "./dialog-close-BqMvQbkH.js";
import { c as Nn, d as Pn, t as Fn } from "./customEmoji-Bvbh2sQz.js";
import { t as In } from "./postMediaCacheService-Wfqsb0Vm.js";
import { Y as Ln, _ as Rn, c as zn, d as Bn, f as Vn, ft as Hn, g as Un, gt as Wn, h as Gn, ht as Kn, m as qn, mt as Jn, p as Yn, u as Xn, ut as Zn } from "./App-CxNETzG6.js";
import { A as Qn, C as $n, D as er, E as tr, F as nr, I as rr, M as ir, N as ar, O as or, P as sr, R as cr, S as lr, T as ur, _ as dr, a as fr, b as pr, c as mr, d as hr, f as gr, g as _r, h as vr, i as yr, j as br, k as xr, l as Sr, m as Cr, n as wr, o as Tr, p as Er, r as Dr, s as Or, t as kr, u as Ar, v as jr, w as Mr, x as Nr, y as Pr, z as Fr } from "./postBroadcastService-BSRLV_qg.js";
import { t as Ir } from "./InfoPopoverButton-DfkrAKpI.js";
// D:/ドキュメント/GitHub/ehagaki/node_modules/@internationalized/date/dist/utils.mjs
function Lr(e, t) {
	return e - t * Math.floor(e / t);
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/@internationalized/date/dist/GregorianCalendar.mjs
var Rr = 1721426;
function zr(e, t, n, r) {
	t = Vr(e, t);
	let i = t - 1, a = -2;
	return n <= 2 ? a = 0 : Br(t) && (a = -1), 1721425 + 365 * i + Math.floor(i / 4) - Math.floor(i / 100) + Math.floor(i / 400) + Math.floor((367 * n - 362) / 12 + a + r);
}
function Br(e) {
	return e % 4 == 0 && (e % 100 != 0 || e % 400 == 0);
}
function Vr(e, t) {
	return e === "BC" ? 1 - t : t;
}
function Hr(e) {
	let t = "AD";
	return e <= 0 && (t = "BC", e = 1 - e), [t, e];
}
var Ur = {
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
}, Wr = class {
	fromJulianDay(e) {
		let t = e, n = t - Rr, r = Math.floor(n / 146097), i = Lr(n, 146097), a = Math.floor(i / 36524), o = Lr(i, 36524), s = Math.floor(o / 1461), c = Lr(o, 1461), l = Math.floor(c / 365), [u, d] = Hr(r * 400 + a * 100 + s * 4 + l + +(a !== 4 && l !== 4)), f = t - zr(u, d, 1, 1), p = 2;
		t < zr(u, d, 3, 1) ? p = 0 : Br(d) && (p = 1);
		let m = Math.floor(((f + p) * 12 + 373) / 367);
		return new pa(u, d, m, t - zr(u, d, m, 1) + 1);
	}
	toJulianDay(e) {
		return zr(e.era, e.year, e.month, e.day);
	}
	getDaysInMonth(e) {
		return Ur[Br(e.year) ? "leapyear" : "standard"][e.month - 1];
	}
	getMonthsInYear(e) {
		return 12;
	}
	getDaysInYear(e) {
		return Br(e.year) ? 366 : 365;
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
}, Gr = {
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
function Kr(e, t) {
	return t = wi(t, e.calendar), e.era === t.era && e.year === t.year && e.month === t.month && e.day === t.day;
}
function qr(e, t) {
	return t = wi(t, e.calendar), e = ii(e), t = ii(t), e.era === t.era && e.year === t.year && e.month === t.month;
}
function Jr(e, t) {
	return e.isEqual?.call(e, t) ?? t.isEqual?.call(t, e) ?? e.identifier === t.identifier;
}
var Yr = {
	sun: 0,
	mon: 1,
	tue: 2,
	wed: 3,
	thu: 4,
	fri: 5,
	sat: 6
};
function Xr(e, t, n) {
	let r = e.calendar.toJulianDay(e), i = n ? Yr[n] : li(t), a = Math.ceil(r + 1 - i) % 7;
	return a < 0 && (a += 7), a;
}
function Zr(e) {
	return xi(Date.now(), e);
}
function Qr(e) {
	return Si(Zr(e));
}
function $r(e, t) {
	return e.calendar.toJulianDay(e) - t.calendar.toJulianDay(t);
}
function ei(e, t) {
	return ti(e) - ti(t);
}
function ti(e) {
	return e.hour * 36e5 + e.minute * 6e4 + e.second * 1e3 + e.millisecond;
}
var ni = null;
function ri() {
	return ni ??= new Intl.DateTimeFormat().resolvedOptions().timeZone, ni;
}
function ii(e) {
	return e.subtract({ days: e.day - 1 });
}
function ai(e) {
	return e.add({ days: e.calendar.getDaysInMonth(e) - e.day });
}
var oi = /* @__PURE__ */ new Map(), si = /* @__PURE__ */ new Map();
function ci(e) {
	if (Intl.Locale) {
		let t = oi.get(e);
		return t || (t = new Intl.Locale(e).maximize().region, t && oi.set(e, t)), t;
	}
	let t = e.split("-")[1];
	return t === "u" ? void 0 : t;
}
function li(e) {
	let t = si.get(e);
	if (!t) {
		if (Intl.Locale) {
			let n = new Intl.Locale(e);
			if ("getWeekInfo" in n && (t = n.getWeekInfo(), t)) return si.set(e, t), t.firstDay;
		}
		let n = ci(e);
		if (e.includes("-fw-")) {
			let n = e.split("-fw-")[1].split("-")[0];
			t = n === "mon" ? { firstDay: 1 } : n === "tue" ? { firstDay: 2 } : n === "wed" ? { firstDay: 3 } : n === "thu" ? { firstDay: 4 } : n === "fri" ? { firstDay: 5 } : n === "sat" ? { firstDay: 6 } : { firstDay: 0 };
		} else t = e.includes("-ca-iso8601") ? { firstDay: 1 } : { firstDay: n && Gr[n] || 0 };
		si.set(e, t);
	}
	return t.firstDay;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/@internationalized/date/dist/conversion.mjs
function ui(e) {
	return e = wi(e, new Wr()), di(Vr(e.era, e.year), e.month, e.day, e.hour, e.minute, e.second, e.millisecond);
}
function di(e, t, n, r, i, a, o) {
	let s = /* @__PURE__ */ new Date();
	return s.setUTCHours(r, i, a, o), s.setUTCFullYear(e, t - 1, n), s.getTime();
}
function fi(e, t) {
	if (t === "UTC") return 0;
	if (e > 0 && t === ri()) return new Date(e).getTimezoneOffset() * -6e4;
	let { year: n, month: r, day: i, hour: a, minute: o, second: s } = mi(e, t);
	return di(n, r, i, a, o, s, 0) - Math.floor(e / 1e3) * 1e3;
}
var pi = /* @__PURE__ */ new Map();
function mi(e, t) {
	let n = pi.get(t);
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
	}), pi.set(t, n));
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
var hi = 864e5;
function gi(e, t) {
	let n = ui(e);
	return _i(e, t, n - fi(n - hi, t), n - fi(n + hi, t));
}
function _i(e, t, n, r) {
	return (n === r ? [n] : [n, r]).filter((n) => vi(e, t, n));
}
function vi(e, t, n) {
	let r = mi(n, t);
	return e.year === r.year && e.month === r.month && e.day === r.day && e.hour === r.hour && e.minute === r.minute && e.second === r.second;
}
function yi(e, t, n = "compatible") {
	let r = Ci(e);
	if (t === "UTC") return ui(r);
	if (t === ri() && n === "compatible") {
		r = wi(r, new Wr());
		let e = /* @__PURE__ */ new Date(), t = Vr(r.era, r.year);
		return e.setFullYear(t, r.month - 1, r.day), e.setHours(r.hour, r.minute, r.second, r.millisecond), e.getTime();
	}
	let i = ui(r), a = fi(i - hi, t), o = fi(i + hi, t), s = _i(r, t, i - a, i - o);
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
function bi(e, t, n = "compatible") {
	return new Date(yi(e, t, n));
}
function xi(e, t) {
	let n = fi(e, t), r = new Date(e + n), i = r.getUTCFullYear(), a = r.getUTCMonth() + 1, o = r.getUTCDate(), s = r.getUTCHours(), c = r.getUTCMinutes(), l = r.getUTCSeconds(), u = r.getUTCMilliseconds();
	return new _a(i < 1 ? "BC" : "AD", i < 1 ? -i + 1 : i, a, o, t, n, s, c, l, u);
}
function Si(e) {
	return new pa(e.calendar, e.era, e.year, e.month, e.day);
}
function Ci(e, t) {
	let n = 0, r = 0, i = 0, a = 0;
	if ("timeZone" in e) ({hour: n, minute: r, second: i, millisecond: a} = e);
	else if ("hour" in e && !t) return e;
	return t && ({hour: n, minute: r, second: i, millisecond: a} = t), new ha(e.calendar, e.era, e.year, e.month, e.day, n, r, i, a);
}
function wi(e, t) {
	if (Jr(e.calendar, t)) return e;
	let n = t.fromJulianDay(e.calendar.toJulianDay(e)), r = e.copy();
	return r.calendar = t, r.era = n.era, r.year = n.year, r.month = n.month, r.day = n.day, Pi(r), r;
}
function Ti(e, t, n) {
	return e instanceof _a ? e.timeZone === t ? e : Di(e, t) : xi(yi(e, t, n), t);
}
function Ei(e) {
	let t = ui(e) - e.offset;
	return new Date(t);
}
function Di(e, t) {
	return wi(xi(ui(e) - e.offset, t), e.calendar);
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/@internationalized/date/dist/manipulation.mjs
var Oi = 36e5;
function ki(e, t) {
	let n = e.copy(), r = "hour" in n ? Hi(n, t) : 0;
	Ai(n, t.years || 0), n.calendar.balanceYearMonth && n.calendar.balanceYearMonth(n, e), n.month += t.months || 0, ji(n), Ni(n), n.day += (t.weeks || 0) * 7, n.day += t.days || 0, n.day += r, Mi(n), n.calendar.balanceDate && n.calendar.balanceDate(n), n.year < 1 && (n.year = 1, n.month = 1, n.day = 1);
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
function Ai(e, t) {
	var n;
	(n = e.calendar).isInverseEra?.call(n, e) && (t = -t), e.year += t;
}
function ji(e) {
	for (; e.month < 1;) Ai(e, -1), e.month += e.calendar.getMonthsInYear(e);
	let t = 0;
	for (; e.month > (t = e.calendar.getMonthsInYear(e));) e.month -= t, Ai(e, 1);
}
function Mi(e) {
	for (; e.day < 1;) e.month--, ji(e), e.day += e.calendar.getDaysInMonth(e);
	for (; e.day > e.calendar.getDaysInMonth(e);) e.day -= e.calendar.getDaysInMonth(e), e.month++, ji(e);
}
function Ni(e) {
	e.month = Math.max(1, Math.min(e.calendar.getMonthsInYear(e), e.month)), e.day = Math.max(1, Math.min(e.calendar.getDaysInMonth(e), e.day));
}
function Pi(e) {
	e.calendar.constrainDate && e.calendar.constrainDate(e), e.year = Math.max(1, Math.min(e.calendar.getYearsInEra(e), e.year)), Ni(e);
}
function Fi(e) {
	let t = {};
	for (let n in e) typeof e[n] == "number" && (t[n] = -e[n]);
	return t;
}
function Ii(e, t) {
	return ki(e, Fi(t));
}
function Li(e, t) {
	let n = e.copy();
	return t.era != null && (n.era = t.era), t.year != null && (n.year = t.year), t.month != null && (n.month = t.month), t.day != null && (n.day = t.day), Pi(n), n;
}
function Ri(e, t) {
	let n = e.copy();
	return t.hour != null && (n.hour = t.hour), t.minute != null && (n.minute = t.minute), t.second != null && (n.second = t.second), t.millisecond != null && (n.millisecond = t.millisecond), Bi(n), n;
}
function zi(e) {
	e.second += Math.floor(e.millisecond / 1e3), e.millisecond = Vi(e.millisecond, 1e3), e.minute += Math.floor(e.second / 60), e.second = Vi(e.second, 60), e.hour += Math.floor(e.minute / 60), e.minute = Vi(e.minute, 60);
	let t = Math.floor(e.hour / 24);
	return e.hour = Vi(e.hour, 24), t;
}
function Bi(e) {
	e.millisecond = Math.max(0, Math.min(e.millisecond, 1e3)), e.second = Math.max(0, Math.min(e.second, 59)), e.minute = Math.max(0, Math.min(e.minute, 59)), e.hour = Math.max(0, Math.min(e.hour, 23));
}
function Vi(e, t) {
	let n = e % t;
	return n < 0 && (n += t), n;
}
function Hi(e, t) {
	return e.hour += t.hours || 0, e.minute += t.minutes || 0, e.second += t.seconds || 0, e.millisecond += t.milliseconds || 0, zi(e);
}
function Ui(e, t, n, r) {
	let i = e.copy();
	switch (t) {
		case "era": {
			let t = e.calendar.getEras(), a = t.indexOf(e.era);
			if (a < 0) throw Error("Invalid era: " + e.era);
			a = Gi(a, n, 0, t.length - 1, r?.round), i.era = t[a], Pi(i);
			break;
		}
		case "year":
			var a;
			(a = i.calendar).isInverseEra?.call(a, i) && (n = -n), i.year = Gi(e.year, n, -Infinity, 9999, r?.round), i.year === -Infinity && (i.year = 1), i.calendar.balanceYearMonth && i.calendar.balanceYearMonth(i, e);
			break;
		case "month":
			i.month = Gi(e.month, n, 1, e.calendar.getMonthsInYear(e), r?.round);
			break;
		case "day":
			i.day = Gi(e.day, n, 1, e.calendar.getDaysInMonth(e), r?.round);
			break;
		default: throw Error("Unsupported field " + t);
	}
	return e.calendar.balanceDate && e.calendar.balanceDate(i), Pi(i), i;
}
function Wi(e, t, n, r) {
	let i = e.copy();
	switch (t) {
		case "hour": {
			let t = e.hour, a = 0, o = 23;
			if (r?.hourCycle === 12) {
				let e = t >= 12;
				a = e ? 12 : 0, o = e ? 23 : 11;
			}
			i.hour = Gi(t, n, a, o, r?.round);
			break;
		}
		case "minute":
			i.minute = Gi(e.minute, n, 0, 59, r?.round);
			break;
		case "second":
			i.second = Gi(e.second, n, 0, 59, r?.round);
			break;
		case "millisecond":
			i.millisecond = Gi(e.millisecond, n, 0, 999, r?.round);
			break;
		default: throw Error("Unsupported field " + t);
	}
	return i;
}
function Gi(e, t, n, r, i = !1) {
	if (i) {
		e += Math.sign(t), e < n && (e = r);
		let i = Math.abs(t);
		e = t > 0 ? Math.ceil(e / i) * i : Math.floor(e / i) * i, e > r && (e = n);
	} else e += t, e < n ? e = r - (n - e - 1) : e > r && (e = n + (e - r - 1));
	return e;
}
function Ki(e, t) {
	let n;
	return n = t.years != null && t.years !== 0 || t.months != null && t.months !== 0 || t.weeks != null && t.weeks !== 0 || t.days != null && t.days !== 0 ? yi(ki(Ci(e), {
		years: t.years,
		months: t.months,
		weeks: t.weeks,
		days: t.days
	}), e.timeZone) : ui(e) - e.offset, n += t.milliseconds || 0, n += (t.seconds || 0) * 1e3, n += (t.minutes || 0) * 6e4, n += (t.hours || 0) * 36e5, wi(xi(n, e.timeZone), e.calendar);
}
function qi(e, t) {
	return Ki(e, Fi(t));
}
function Ji(e, t, n, r) {
	switch (t) {
		case "hour": {
			let t = 0, i = 23;
			if (r?.hourCycle === 12) {
				let n = e.hour >= 12;
				t = n ? 12 : 0, i = n ? 23 : 11;
			}
			let a = Ci(e), o = wi(Ri(a, { hour: t }), new Wr()), s = [yi(o, e.timeZone, "earlier"), yi(o, e.timeZone, "later")].filter((t) => xi(t, e.timeZone).day === o.day)[0], c = wi(Ri(a, { hour: i }), new Wr()), l = [yi(c, e.timeZone, "earlier"), yi(c, e.timeZone, "later")].filter((t) => xi(t, e.timeZone).day === c.day).pop(), u = ui(e) - e.offset, d = Math.floor(u / Oi), f = u % Oi;
			return u = Gi(d, n, Math.floor(s / Oi), Math.floor(l / Oi), r?.round) * Oi + f, wi(xi(u, e.timeZone), e.calendar);
		}
		case "minute":
		case "second":
		case "millisecond": return Wi(e, t, n, r);
		case "era":
		case "year":
		case "month":
		case "day": return wi(xi(yi(Ui(Ci(e), t, n, r), e.timeZone), e.timeZone), e.calendar);
		default: throw Error("Unsupported field " + t);
	}
}
function Yi(e, t, n) {
	let r = Ci(e), i = Ri(Li(r, t), t);
	return i.compare(r) === 0 ? e : wi(xi(yi(i, e.timeZone, n), e.timeZone), e.calendar);
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/@internationalized/date/dist/string.mjs
var Xi = /^([+-]\d{6}|\d{4})-(\d{2})-(\d{2})$/, Zi = /^([+-]\d{6}|\d{4})-(\d{2})-(\d{2})(?:T(\d{2}))?(?::(\d{2}))?(?::(\d{2}))?(\.\d+)?$/, Qi = /^([+-]\d{6}|\d{4})-(\d{2})-(\d{2})(?:T(\d{2}))?(?::(\d{2}))?(?::(\d{2}))?(\.\d+)?(?:([+-]\d{2})(?::?(\d{2}))?(?::?(\d{2}))?)?\[(.*?)\]$/, $i = /^([+-]\d{6}|\d{4})-(\d{2})-(\d{2})(?:T(\d{2}))?(?::(\d{2}))?(?::(\d{2}))?(\.\d+)?(?:(?:([+-]\d{2})(?::?(\d{2}))?)|Z)$/;
function ea(e) {
	let t = e.match(Xi);
	if (!t) throw $i.test(e) ? Error(`Invalid ISO 8601 date string: ${e}. Use parseAbsolute() instead.`) : Error("Invalid ISO 8601 date string: " + e);
	let n = new pa(ra(t[1], 0, 9999), ra(t[2], 1, 12), 1);
	return n.day = ra(t[3], 1, n.calendar.getDaysInMonth(n)), n;
}
function ta(e) {
	let t = e.match(Zi);
	if (!t) throw $i.test(e) ? Error(`Invalid ISO 8601 date time string: ${e}. Use parseAbsolute() instead.`) : Error("Invalid ISO 8601 date time string: " + e);
	let n = ra(t[1], -9999, 9999), r = new ha(n < 1 ? "BC" : "AD", n < 1 ? -n + 1 : n, ra(t[2], 1, 12), 1, t[4] ? ra(t[4], 0, 23) : 0, t[5] ? ra(t[5], 0, 59) : 0, t[6] ? ra(t[6], 0, 59) : 0, t[7] ? ra(t[7], 0, Infinity) * 1e3 : 0);
	return r.day = ra(t[3], 0, r.calendar.getDaysInMonth(r)), r;
}
function na(e, t) {
	let n = e.match(Qi);
	if (!n) throw Error("Invalid ISO 8601 date time string: " + e);
	let r = ra(n[1], -9999, 9999), i = new _a(r < 1 ? "BC" : "AD", r < 1 ? -r + 1 : r, ra(n[2], 1, 12), 1, n[11], 0, n[4] ? ra(n[4], 0, 23) : 0, n[5] ? ra(n[5], 0, 59) : 0, n[6] ? ra(n[6], 0, 59) : 0, n[7] ? ra(n[7], 0, Infinity) * 1e3 : 0);
	i.day = ra(n[3], 0, i.calendar.getDaysInMonth(i));
	let a = Ci(i), o;
	if (n[8]) {
		let e = ra(n[8], -23, 23);
		if (i.offset = Math.sign(e) * (Math.abs(e) * 36e5 + ra(n[9] ?? "0", 0, 59) * 6e4 + ra(n[10] ?? "0", 0, 59) * 1e3), o = ui(i) - i.offset, !gi(a, i.timeZone).includes(o)) throw Error(`Offset ${sa(i.offset)} is invalid for ${oa(i)} in ${i.timeZone}`);
	} else o = yi(Ci(a), i.timeZone, t);
	return xi(o, i.timeZone);
}
function ra(e, t, n) {
	let r = Number(e);
	if (r < t || r > n) throw RangeError(`Value out of range: ${t} <= ${r} <= ${n}`);
	return r;
}
function ia(e) {
	return `${String(e.hour).padStart(2, "0")}:${String(e.minute).padStart(2, "0")}:${String(e.second).padStart(2, "0")}${e.millisecond ? String(e.millisecond / 1e3).slice(1) : ""}`;
}
function aa(e) {
	let t = wi(e, new Wr()), n;
	return n = t.era === "BC" ? t.year === 1 ? "0000" : "-" + String(Math.abs(1 - t.year)).padStart(6, "00") : String(t.year).padStart(4, "0"), `${n}-${String(t.month).padStart(2, "0")}-${String(t.day).padStart(2, "0")}`;
}
function oa(e) {
	return `${aa(e)}T${ia(e)}`;
}
function sa(e) {
	let t = Math.sign(e) < 0 ? "-" : "+";
	e = Math.abs(e);
	let n = Math.floor(e / 36e5), r = Math.floor(e % 36e5 / 6e4), i = Math.floor(e % 36e5 % 6e4 / 1e3), a = `${t}${String(n).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
	return i !== 0 && (a += `:${String(i).padStart(2, "0")}`), a;
}
function ca(e) {
	return `${oa(e)}${sa(e.offset)}[${e.timeZone}]`;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/@swc/helpers/esm/_check_private_redeclaration.js
function la(e, t) {
	if (t.has(e)) throw TypeError("Cannot initialize the same private elements twice on an object");
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/@swc/helpers/esm/_class_private_field_init.js
function ua(e, t, n) {
	la(e, t), t.set(e, n);
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/@internationalized/date/dist/CalendarDate.mjs
function da(e) {
	let t = typeof e[0] == "object" ? e.shift() : new Wr(), n;
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
var fa = /*#__PURE__*/ new WeakMap(), pa = class e {
	copy() {
		return this.era ? new e(this.calendar, this.era, this.year, this.month, this.day) : new e(this.calendar, this.year, this.month, this.day);
	}
	add(e) {
		return ki(this, e);
	}
	subtract(e) {
		return Ii(this, e);
	}
	set(e) {
		return Li(this, e);
	}
	cycle(e, t, n) {
		return Ui(this, e, t, n);
	}
	toDate(e) {
		return bi(this, e);
	}
	toString() {
		return aa(this);
	}
	compare(e) {
		return $r(this, e);
	}
	constructor(...e) {
		ua(this, fa, {
			writable: !0,
			value: void 0
		});
		let [t, n, r, i, a] = da(e);
		this.calendar = t, this.era = n, this.year = r, this.month = i, this.day = a, Pi(this);
	}
}, ma = /*#__PURE__*/ new WeakMap(), ha = class e {
	copy() {
		return this.era ? new e(this.calendar, this.era, this.year, this.month, this.day, this.hour, this.minute, this.second, this.millisecond) : new e(this.calendar, this.year, this.month, this.day, this.hour, this.minute, this.second, this.millisecond);
	}
	add(e) {
		return ki(this, e);
	}
	subtract(e) {
		return Ii(this, e);
	}
	set(e) {
		return Li(Ri(this, e), e);
	}
	cycle(e, t, n) {
		switch (e) {
			case "era":
			case "year":
			case "month":
			case "day": return Ui(this, e, t, n);
			default: return Wi(this, e, t, n);
		}
	}
	toDate(e, t) {
		return bi(this, e, t);
	}
	toString() {
		return oa(this);
	}
	compare(e) {
		let t = $r(this, e);
		return t === 0 ? ei(this, Ci(e)) : t;
	}
	constructor(...e) {
		ua(this, ma, {
			writable: !0,
			value: void 0
		});
		let [t, n, r, i, a] = da(e);
		this.calendar = t, this.era = n, this.year = r, this.month = i, this.day = a, this.hour = e.shift() || 0, this.minute = e.shift() || 0, this.second = e.shift() || 0, this.millisecond = e.shift() || 0, Pi(this);
	}
}, ga = /*#__PURE__*/ new WeakMap(), _a = class e {
	copy() {
		return this.era ? new e(this.calendar, this.era, this.year, this.month, this.day, this.timeZone, this.offset, this.hour, this.minute, this.second, this.millisecond) : new e(this.calendar, this.year, this.month, this.day, this.timeZone, this.offset, this.hour, this.minute, this.second, this.millisecond);
	}
	add(e) {
		return Ki(this, e);
	}
	subtract(e) {
		return qi(this, e);
	}
	set(e, t) {
		return Yi(this, e, t);
	}
	cycle(e, t, n) {
		return Ji(this, e, t, n);
	}
	toDate() {
		return Ei(this);
	}
	toString() {
		return ca(this);
	}
	toAbsoluteString() {
		return this.toDate().toISOString();
	}
	compare(e) {
		return this.toDate().getTime() - Ti(e, this.timeZone).toDate().getTime();
	}
	constructor(...e) {
		ua(this, ga, {
			writable: !0,
			value: void 0
		});
		let [t, n, r, i, a] = da(e), o = e.shift(), s = e.shift();
		this.calendar = t, this.era = n, this.year = r, this.month = i, this.day = a, this.timeZone = o, this.offset = s, this.hour = e.shift() || 0, this.minute = e.shift() || 0, this.second = e.shift() || 0, this.millisecond = e.shift() || 0, Pi(this);
	}
}, va = /* @__PURE__ */ new Map(), ya = class {
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
		return Ta() && (this.resolvedHourCycle ||= Ea(e.locale, this.options), e.hourCycle = this.resolvedHourCycle, e.hour12 = this.resolvedHourCycle === "h11" || this.resolvedHourCycle === "h12"), e.calendar === "ethiopic-amete-alem" && (e.calendar = "ethioaa"), e;
	}
	constructor(e, t = {}) {
		this.formatter = xa(e, t), this.options = t;
	}
}, ba = {
	true: { ja: "h11" },
	false: {}
};
function xa(e, t = {}) {
	if (typeof t.hour12 == "boolean" && Ca()) {
		t = { ...t };
		let n = ba[String(t.hour12)][e.split("-")[0]], r = t.hour12 ? "h12" : "h23";
		t.hourCycle = n ?? r, delete t.hour12;
	}
	let n = e + (t ? Object.entries(t).sort((e, t) => e[0] < t[0] ? -1 : 1).join() : "");
	if (va.has(n)) return va.get(n);
	let r = new Intl.DateTimeFormat(e, t);
	return va.set(n, r), r;
}
var Sa = null;
function Ca() {
	return Sa ??= new Intl.DateTimeFormat("en-US", {
		hour: "numeric",
		hour12: !1
	}).format(new Date(2020, 2, 3, 0)) === "24", Sa;
}
var wa = null;
function Ta() {
	return wa ??= new Intl.DateTimeFormat("fr", {
		hour: "numeric",
		hour12: !1
	}).resolvedOptions().hourCycle === "h12", wa;
}
function Ea(e, t) {
	if (!t.timeStyle && !t.hour) return;
	e = e.replace(/(-u-)?-nu-[a-zA-Z0-9]+/, ""), e += (e.includes("-u-") ? "" : "-u") + "-nu-latn";
	let n = xa(e, {
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
function Da(e) {
	if (!Y || !e) return null;
	let t = e.querySelector("[data-bits-announcer]"), n = (t) => {
		let n = e.createElement("div");
		return n.role = "log", n.ariaLive = t, n.setAttribute("aria-relevant", "additions"), n;
	};
	if (!Ne(t)) {
		let r = e.createElement("div");
		r.style.cssText = Sn, r.setAttribute("data-bits-announcer", ""), r.appendChild(n("assertive")), r.appendChild(n("polite")), t = r, e.body.insertBefore(t, e.body.firstChild);
	}
	return { getLog: (e) => {
		if (!Ne(t)) return null;
		let n = t.querySelector(`[aria-live="${e}"]`);
		return Ne(n) ? n : null;
	} };
}
function Oa(e) {
	let t = Da(e);
	function n(n, r = "assertive", i = 7500) {
		if (!t || !Y || !e) return;
		let a = t.getLog(r), o = e.createElement("div");
		return n = typeof n == "number" ? n.toString() : n === null ? "Empty" : n.trim(), o.innerText = n, r === "assertive" ? a?.replaceChildren(o) : a?.appendChild(o), setTimeout(() => {
			o.remove();
		}, i);
	}
	return { announce: n };
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/internal/date-time/utils.js
var ka = {
	defaultValue: void 0,
	granularity: "day"
};
function Aa(e) {
	let { defaultValue: t, granularity: n, minValue: r, maxValue: i } = {
		...ka,
		...e
	};
	if (Array.isArray(t) && t.length) return t[t.length - 1];
	if (t && !Array.isArray(t)) return t;
	{
		let e = /* @__PURE__ */ new Date();
		r && e < r.toDate(ri()) ? e = r.toDate(ri()) : i && e > i.toDate(ri()) && (e = i.toDate(ri()));
		let t = e.getFullYear(), a = e.getMonth() + 1, o = e.getDate();
		return [
			"hour",
			"minute",
			"second"
		].includes(n ?? "day") ? new ha(t, a, o, 0, 0, 0) : new pa(t, a, o);
	}
}
function ja(e, t) {
	let n;
	return n = t instanceof _a ? na(e) : t instanceof ha ? ta(e) : ea(e), n.calendar === t.calendar ? n : wi(n, t.calendar);
}
function Ma(e, t = ri()) {
	return e instanceof _a ? e.toDate() : e.toDate(t);
}
function Na(e) {
	if (e instanceof pa) return "date";
	if (e instanceof ha) return "datetime";
	if (e instanceof _a) return "zoneddatetime";
	throw Error("Unknown date type");
}
function Pa(e, t) {
	switch (t) {
		case "date": return ea(e);
		case "datetime": return ta(e);
		case "zoneddatetime": return na(e);
		default: throw Error(`Unknown date type: ${t}`);
	}
}
function Fa(e) {
	return e instanceof ha;
}
function Ia(e) {
	return e instanceof _a;
}
function La(e) {
	return Fa(e) || Ia(e);
}
function Ra(e) {
	if (e instanceof Date) {
		let t = e.getFullYear(), n = e.getMonth() + 1;
		return new Date(t, n, 0).getDate();
	}
	return e.set({ day: 100 }).day;
}
function za(e, t) {
	return e.compare(t) < 0;
}
function Ba(e, t) {
	return e.compare(t) > 0;
}
function Va(e, t, n) {
	let r = Xr(e, n);
	return t > r ? e.subtract({ days: r + 7 - t }) : t === r ? e : e.subtract({ days: r - t });
}
function Ha(e, t, n) {
	let r = Xr(e, n), i = t === 0 ? 6 : t - 1;
	return r === i ? e : r > i ? e.add({ days: 7 - r + i }) : e.add({ days: i - r });
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/internal/date-time/field/parts.js
var Ua = [
	"day",
	"month",
	"year"
], Wa = [
	"hour",
	"minute",
	"second",
	"dayPeriod"
], Ga = ["literal", "timeZoneName"], Ka = [...Ua, ...Wa], qa = [...Ka, ...Ga], Ja = [...Wa, ...Ga];
qa.filter((e) => e !== "literal"), Ja.filter((e) => e !== "literal");
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/internal/date-time/placeholders.js
var Ya = /* @__PURE__ */ "ach.af.am.an.ar.ast.az.be.bg.bn.br.bs.ca.cak.ckb.cs.cy.da.de.dsb.el.en.eo.es.et.eu.fa.ff.fi.fr.fy.ga.gd.gl.he.hr.hsb.hu.ia.id.it.ja.ka.kk.kn.ko.lb.lo.lt.lv.meh.ml.ms.nl.nn.no.oc.pl.pt.rm.ro.ru.sc.scn.sk.sl.sr.sv.szl.tg.th.tr.uk.zh-CN.zh-TW".split("."), Xa = [
	"year",
	"month",
	"day"
], Za = {
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
function Qa(e) {
	if (eo(e)) return Za[e];
	{
		let t = io(e);
		return eo(t) ? Za[t] : Za.en;
	}
}
function $a(e, t, n) {
	return to(e) ? Qa(n)[e] : ro(e) ? t : no(e) ? "––" : "";
}
function eo(e) {
	return Ya.includes(e);
}
function to(e) {
	return Xa.includes(e);
}
function no(e) {
	return e === "hour" || e === "minute" || e === "second";
}
function ro(e) {
	return e === "era" || e === "dayPeriod";
}
function io(e) {
	return Intl.Locale ? new Intl.Locale(e).language : e.split("-")[0];
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/internal/date-time/field/helpers.js
function ao(e) {
	let t = [
		"hour",
		"minute",
		"second"
	], n = Ka.map((e) => e === "dayPeriod" ? [e, "AM"] : [e, null]).filter(([n]) => n === "literal" || n === null ? !1 : e !== "day" || !t.includes(n));
	return Object.fromEntries(n);
}
function oo(e) {
	let { segmentValues: t, formatter: n, locale: r, dateRef: i } = e, a = Object.keys(t).reduce((e, n) => {
		if (!po(n)) return e;
		if ("hour" in t && n === "dayPeriod") {
			let i = t[n];
			e[n] = ke(i) ? $a(n, "AM", r) : i;
		} else e[n] = o(n);
		return e;
	}, {});
	function o(a) {
		if (a === "day" && ke(t.month) && !ke(t.day)) {
			let e = Number.parseInt(t.day);
			if (e >= 1 && e <= 31) return t.day.startsWith("0") && `${e}`.length === 1 ? `0${e}` : `${e}`;
		}
		if ("hour" in t) {
			let o = t[a], s = typeof o == "string" && o?.startsWith("0"), c = o === null ? null : Number.parseInt(o);
			if (o === "0" && a !== "year") return "0";
			if (!ke(o) && !ke(c)) {
				let l = n.part(Do(a, i, t).set({ [a]: o }), a, { hourCycle: e.hourCycle === 24 ? "h23" : void 0 }), u = e.hourCycle === 12 || e.hourCycle === void 0 && Oo(r) === 12;
				if (a === "hour" && u) {
					if (c > 12) {
						let e = c - 12;
						return e === 0 ? "12" : e < 10 ? `0${e}` : `${e}`;
					}
					return c === 0 ? "12" : c < 10 ? `0${c}` : `${c}`;
				}
				return a === "year" ? `${o}` : s && l.length === 1 ? `0${l}` : l;
			}
			return $a(a, "", r);
		}
		if (fo(a)) {
			let e = t[a], o = typeof e == "string" && e?.startsWith("0");
			if (e === "0") return "0";
			if (ke(e)) return $a(a, "", r);
			{
				let r = n.part(Do(a, i, t).set({ [a]: e }), a);
				return a === "year" ? `${e}` : o && r.length === 1 ? `0${r}` : r;
			}
		}
		return "";
	}
	return a;
}
function so(e) {
	let { granularity: t, dateRef: n, formatter: r, contentObj: i, hideTimeZone: a, hourCycle: o } = e;
	return r.toParts(n, lo(t, o)).map((e) => [
		"literal",
		"dayPeriod",
		"timeZoneName",
		null
	].includes(e.type) || !po(e.type) ? {
		part: e.type,
		value: e.value
	} : {
		part: e.type,
		value: i[e.type]
	}).filter((e) => !(ke(e.part) || ke(e.value) || e.part === "timeZoneName" && (!Ia(n) || a)));
}
function co(e) {
	let t = oo(e);
	return {
		obj: t,
		arr: so({
			contentObj: t,
			...e
		})
	};
}
function lo(e, t) {
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
function uo() {
	return Ka.reduce((e, t) => (e[t] = {
		lastKeyZero: !1,
		hasLeftFocus: !0,
		updating: null
	}, e), {});
}
function fo(e) {
	return Ua.includes(e);
}
function po(e) {
	return Ka.includes(e);
}
function mo(e) {
	return qa.includes(e);
}
function ho(e) {
	return !Y || !e ? [] : Ro(e).map((e) => e.dataset.segment).filter((e) => Ka.includes(e));
}
var go = [
	"year",
	"month",
	"day",
	"hour",
	"minute",
	"second",
	"dayPeriod"
];
function _o(e) {
	let t = go.indexOf(e);
	return t === -1 ? go.length : t;
}
function vo(e) {
	let { segmentObj: t, fieldNode: n, dateRef: r } = e, i = ho(n).sort((e, t) => _o(e) - _o(t)), a = r;
	for (let e of i) if ("hour" in t) {
		let n = t[e];
		if (ke(n)) continue;
		a = a.set({ [e]: t[e] });
	} else if (fo(e)) {
		let n = t[e];
		if (ke(n)) continue;
		a = a.set({ [e]: t[e] });
	}
	return a;
}
function yo(e, t) {
	let n = ho(t);
	for (let t of n) if ("hour" in e) {
		if (e[t] === null) return !1;
	} else if (fo(t) && e[t] === null) return !1;
	return !0;
}
function bo(e) {
	return typeof e != "object" || !e ? !1 : Object.entries(e).every(([e, t]) => (Wa.includes(e) || Ua.includes(e)) && (e === "dayPeriod" ? t === "AM" || t === "PM" || t === null : typeof t == "string" || typeof t == "number" || t === null));
}
function xo(e, t) {
	return t || (La(e) ? "minute" : "day");
}
function So(e) {
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
function Co(e, t) {
	if (!Y) return !1;
	let n = Ro(t);
	return n.length ? n[0].id === e : !1;
}
function wo(e) {
	let { id: t, formatter: n, value: r, doc: i } = e;
	if (!Y) return;
	let a = n.selectedDate(r), o = i.getElementById(t);
	if (o) o.innerText = `Selected Date: ${a}`;
	else {
		let e = i.createElement("div");
		e.style.cssText = ze({ display: "none" }), e.id = t, e.innerText = `Selected Date: ${a}`, i.body.appendChild(e);
	}
}
function To(e, t) {
	if (!Y) return;
	let n = t.getElementById(e);
	n && t.body.removeChild(n);
}
function Eo(e, t) {
	return e ? Ra(t.set({ month: Number.parseInt(e) })) : 31;
}
function Do(e, t, n) {
	if (e !== "day") return t;
	let r = t;
	return ke(n.year) || (r = r.set({ year: Number.parseInt(n.year) })), ke(n.month) || (r = r.set({ month: Number.parseInt(n.month) })), r;
}
function Oo(e) {
	return new Intl.DateTimeFormat(e, { hour: "numeric" }).formatToParts(/* @__PURE__ */ new Date("2023-01-01T13:00:00")).find((e) => e.type === "hour")?.value === "1" ? 12 : 24;
}
function ko(e, t) {
	let n = Number.parseInt(e);
	return Number.isNaN(n) ? e : t === "AM" ? n === 12 ? "0" : `${n}` : n < 12 ? `${n + 12}` : `${n}`;
}
function Ao(e) {
	if (e === null) return e;
	let t = Number.parseInt(e);
	return Number.isNaN(t) ? e : t === 0 ? "12" : t > 12 ? `${t - 12}` : e;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/internal/date-time/field/segments.js
function jo(e, t) {
	let n = e.currentTarget;
	if (!Ne(n)) return;
	let { prev: r, next: i } = Po(n, t);
	if (e.key === "ArrowLeft") {
		if (!r) return;
		r.focus();
	} else if (e.key === "ArrowRight") {
		if (!i) return;
		i.focus();
	}
}
function Mo(e, t) {
	let n = t.indexOf(e);
	return n === t.length - 1 || n === -1 ? null : t[n + 1];
}
function No(e, t) {
	let n = t.indexOf(e);
	return n === 0 || n === -1 ? null : t[n - 1];
}
function Po(e, t) {
	let n = Ro(t);
	return n.length ? {
		next: Mo(e, n),
		prev: No(e, n)
	} : {
		next: null,
		prev: null
	};
}
function Fo(e, t) {
	let n = e.currentTarget;
	if (!Ne(n)) return;
	let { next: r } = Po(n, t);
	r && r.focus();
}
function Io(e, t) {
	let n = e.currentTarget;
	if (!Ne(n)) return;
	let { prev: r } = Po(n, t);
	r && r.focus();
}
function Lo(e) {
	return e === "ArrowRight" || e === "ArrowLeft";
}
function Ro(e) {
	return e ? Array.from(e.querySelectorAll("[data-segment]")).filter((e) => {
		if (!Ne(e)) return !1;
		let t = e.dataset.segment;
		return t === "trigger" || !(!mo(t) || t === "literal");
	}) : [];
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/internal/date-time/formatter.js
var zo = {
	year: "numeric",
	month: "numeric",
	day: "numeric",
	hour: "numeric",
	minute: "numeric",
	second: "numeric"
};
function Bo(e) {
	let t = e.initialLocale;
	function n(e) {
		t = e;
	}
	function r() {
		return t;
	}
	function i(e, n) {
		return new ya(t, n).format(e);
	}
	function a(e, t = !0) {
		return La(e) && t ? i(Ma(e), {
			dateStyle: "long",
			timeStyle: "long"
		}) : i(Ma(e), { dateStyle: "long" });
	}
	function o(n) {
		return typeof e.monthFormat.current != "function" && typeof e.yearFormat.current != "function" ? new ya(t, {
			month: e.monthFormat.current,
			year: e.yearFormat.current
		}).format(n) : `${typeof e.monthFormat.current == "function" ? e.monthFormat.current(n.getMonth() + 1) : new ya(t, { month: e.monthFormat.current }).format(n)} ${typeof e.yearFormat.current == "function" ? e.yearFormat.current(n.getFullYear()) : new ya(t, { year: e.yearFormat.current }).format(n)}`;
	}
	function s(e) {
		return new ya(t, { month: "long" }).format(e);
	}
	function c(e) {
		return new ya(t, { year: "numeric" }).format(e);
	}
	function l(e, n) {
		return Ia(e) ? new ya(t, {
			...n,
			timeZone: e.timeZone
		}).formatToParts(Ma(e)) : new ya(t, n).formatToParts(Ma(e));
	}
	function u(e, n = "narrow") {
		return new ya(t, { weekday: n }).format(e);
	}
	function d(e, n = void 0) {
		return new ya(t, {
			hour: "numeric",
			minute: "numeric",
			hourCycle: n === 24 ? "h23" : void 0
		}).formatToParts(e).find((e) => e.type === "dayPeriod")?.value === "PM" ? "PM" : "AM";
	}
	function f(e, t, n = {}) {
		let r = l(e, {
			...zo,
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
function Vo(e) {
	return !(!Ne(e) || !e.hasAttribute("data-bits-day"));
}
function Ho(e, t) {
	let n = [], r = e.add({ days: 1 }), i = t;
	for (; r.compare(i) < 0;) n.push(r), r = r.add({ days: 1 });
	return n;
}
function Uo(e) {
	let { dateObj: t, weekStartsOn: n, fixedWeeks: r, locale: i } = e, a = Ra(t), o = Array.from({ length: a }, (e, n) => t.set({ day: n + 1 })), s = ii(t), c = ai(t), l = n === void 0 ? Va(s, 0, i) : Va(s, n, "en-US"), u = n === void 0 ? Ha(c, 0, i) : Ha(c, n, "en-US"), d = Ho(l.subtract({ days: 1 }), s), f = Ho(c, u.add({ days: 1 })), p = d.length + o.length + f.length;
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
		weeks: En(m, 7)
	};
}
function Wo(e) {
	let { numberOfMonths: t, dateObj: n, ...r } = e, i = [];
	if (!t || t === 1) return i.push(Uo({
		...r,
		dateObj: n
	})), i;
	i.push(Uo({
		...r,
		dateObj: n
	}));
	for (let e = 1; e < t; e++) {
		let t = n.add({ months: e });
		i.push(Uo({
			...r,
			dateObj: t
		}));
	}
	return i;
}
function Go(e) {
	return e ? Array.from(e.querySelectorAll("[data-bits-day]:not([data-disabled]):not([data-outside-visible-months])")).filter((e) => Ne(e)) : [];
}
function Ko(e, t) {
	let n = e.getAttribute("data-value");
	n && (t.current = ja(n, t.current));
}
function qo({ node: e, add: t, useCalendarDayOffset: n = !1, placeholder: r, calendarNode: i, isPrevButtonDisabled: a, isNextButtonDisabled: o, months: s, numberOfMonths: c }) {
	let l = Go(i);
	if (!l.length) return;
	if (n) {
		let n = e.getAttribute("data-value");
		if (!n) return;
		let a = ja(n, r.current).add({ days: t }), o = Array.from(i?.querySelectorAll("[data-bits-day]:not([data-outside-visible-months])") ?? []).map((e) => e.getAttribute("data-value")).filter((e) => e !== null);
		for (; o.includes(a.toString());) {
			let e = l.find((e) => e.getAttribute("data-value") === a.toString());
			if (e) return Ko(e, r), e.focus();
			a = a.add({ days: t });
		}
	}
	let u = l.indexOf(e) + t;
	if (On(u, l)) {
		let e = l[u];
		return Ko(e, r), e.focus();
	}
	if (u < 0) {
		if (a) return;
		let e = s[0]?.value;
		if (!e) return;
		r.current = e.subtract({ months: c }), Se(() => {
			let e = Go(i);
			if (!e.length) return;
			let t = e.length - Math.abs(u);
			if (On(t, e)) {
				let n = e[t];
				return Ko(n, r), n.focus();
			}
		});
	}
	if (u >= l.length) {
		if (o) return;
		let e = s[0]?.value;
		if (!e) return;
		r.current = e.add({ months: c }), Se(() => {
			let e = Go(i);
			if (!e.length) return;
			let t = u - l.length;
			if (On(t, e)) return e[t].focus();
		});
	}
}
var Jo = [
	He,
	Ve,
	q,
	ye
], Yo = [be, " "];
function Xo({ event: e, handleCellClick: t, shiftFocus: n, placeholderValue: r }) {
	let i = e.target;
	if (!Vo(i) || !Jo.includes(e.key) && !Yo.includes(e.key)) return;
	e.preventDefault();
	let a = {
		[He]: 7,
		[Ve]: -7,
		[q]: -1,
		[ye]: 1
	};
	if (Jo.includes(e.key)) {
		let t = a[e.key];
		t !== void 0 && n(i, t);
	}
	if (Yo.includes(e.key)) {
		let n = i.getAttribute("data-value");
		if (!n) return;
		t(e, ja(n, r));
	}
}
function Zo({ months: e, setMonths: t, numberOfMonths: n, pagedNavigation: r, weekStartsOn: i, locale: a, fixedWeeks: o, setPlaceholder: s }) {
	let c = e[0]?.value;
	if (c) {
		if (r) s(c.add({ months: n }));
		else {
			let e = c.add({ months: 1 }), r = Wo({
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
function Qo({ months: e, setMonths: t, numberOfMonths: n, pagedNavigation: r, weekStartsOn: i, locale: a, fixedWeeks: o, setPlaceholder: s }) {
	let c = e[0]?.value;
	if (c) {
		if (r) s(c.subtract({ months: n }));
		else {
			let e = c.subtract({ months: 1 }), r = Wo({
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
function $o({ months: e, formatter: t, weekdayFormat: n }) {
	if (!e.length) return [];
	let r = e[0].weeks[0];
	return r ? r.map((e) => t.dayOfWeek(Ma(Si(e)), n)) : [];
}
function es(e) {
	I(() => {
		let t = e.weekStartsOn.current, n = e.locale.current, r = e.fixedWeeks.current, i = e.numberOfMonths.current;
		F(() => {
			let a = e.placeholder.current;
			if (!a) return;
			let o = {
				weekStartsOn: t,
				locale: n,
				fixedWeeks: r,
				numberOfMonths: i
			};
			e.setMonths(Wo({
				...o,
				dateObj: a
			}));
		});
	});
}
function ts({ calendarNode: e, label: t, accessibleHeadingId: n }) {
	let r = De(e), i = r.createElement("div");
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
function ns({ placeholder: e, getVisibleMonths: t, weekStartsOn: n, locale: r, fixedWeeks: i, numberOfMonths: a, setMonths: o }) {
	I(() => {
		e.current, F(() => {
			t().some((t) => qr(t, e.current)) || o(Wo({
				weekStartsOn: n.current,
				locale: r.current,
				fixedWeeks: i.current,
				numberOfMonths: a.current,
				dateObj: e.current
			}));
		});
	});
}
function rs({ maxValue: e, months: t, disabled: n }) {
	if (!e || !t.length) return !1;
	if (n) return !0;
	let r = t[t.length - 1]?.value;
	return r ? Ba(r.add({ months: 1 }).set({ day: 1 }), e) : !1;
}
function is({ minValue: e, months: t, disabled: n }) {
	if (!e || !t.length) return !1;
	if (n) return !0;
	let r = t[0]?.value;
	return r ? za(r.subtract({ months: 1 }).set({ day: 35 }), e) : !1;
}
function as({ months: e, locale: t, formatter: n }) {
	if (!e.length) return "";
	if (t !== n.getLocale() && n.setLocale(t), e.length === 1) {
		let t = Ma(Si(e[0].value));
		return `${n.fullMonthAndYear(t)}`;
	}
	let r = Ma(Si(e[0].value)), i = Ma(Si(e[e.length - 1].value)), a = n.fullMonth(r), o = n.fullMonth(i), s = n.fullYear(r), c = n.fullYear(i);
	return s === c ? `${a} - ${o} ${c}` : `${a} ${s} - ${o} ${c}`;
}
function os({ fullCalendarLabel: e, id: t, isInvalid: n, disabled: r, readonly: i }) {
	return {
		id: t,
		role: "application",
		"aria-label": e,
		"data-invalid": J(n),
		"data-disabled": J(r),
		"data-readonly": J(i)
	};
}
function ss(e) {
	if (e.defaultPrevented) return;
	let t = De(e.target).querySelector("[data-bits-day][data-focused]");
	t && (e.preventDefault(), t?.focus());
}
function cs(e) {
	if (!Y) return;
	let t = Array.from(e.querySelectorAll("[data-bits-day]:not([aria-disabled=true])"));
	if (t.length === 0) return;
	let n = t[0], r = n?.getAttribute("data-value"), i = n?.getAttribute("data-type");
	if (r && i) return Pa(r, i);
}
function ls(e, t, n) {
	if (!e || !n(e)) return e;
	for (let e of t) {
		let t = e.dates.find((t) => qr(t, e.value) && !n(t));
		if (t) return t;
	}
	return e;
}
function us({ ref: e, placeholder: t, defaultPlaceholder: n, minValue: r, maxValue: i, isDateDisabled: a }) {
	function o(e) {
		return !!(a.current(e) || r.current && za(e, r.current) || i.current && za(i.current, e));
	}
	Oe(() => e.current, () => {
		e.current && t.current && Kr(t.current, n) && o(n) && (t.current = cs(e.current) ?? n);
	});
}
function ds(e, t) {
	return !e || !t ? e : La(e) && La(t) ? e.set({
		hour: t.hour,
		minute: t.minute,
		millisecond: t.millisecond,
		second: t.second
	}) : e;
}
var fs = xe({
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
function ps(e) {
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
var ms = new we("Calendar.Root | RangeCalender.Root"), hs = class e {
	static create(t) {
		return ms.set(new e(t));
	}
	opts;
	#e = U(() => this.months.map((e) => e.value));
	get visibleMonths() {
		return C(this.#e);
	}
	set visibleMonths(e) {
		N(this.#e, e);
	}
	#t = U(() => (this.months, Qr(ri())));
	get todayDate() {
		return C(this.#t);
	}
	set todayDate(e) {
		N(this.#t, e);
	}
	formatter;
	accessibleHeadingId = Le();
	domContext;
	attachment;
	#n = D(T([]));
	get months() {
		return C(this.#n);
	}
	set months(e) {
		N(this.#n, e, !0);
	}
	#r = U(() => ls(this.opts.placeholder.current, this.months, (e) => this.isDateDisabled(e)));
	get tabbableDate() {
		return C(this.#r);
	}
	set tabbableDate(e) {
		N(this.#r, e);
	}
	announcer;
	constructor(e) {
		this.opts = e, this.attachment = ve(this.opts.ref), this.domContext = new Ee(e.ref), this.announcer = Oa(null), this.formatter = Bo({
			initialLocale: this.opts.locale.current,
			monthFormat: this.opts.monthFormat,
			yearFormat: this.opts.yearFormat
		}), this.setMonths = this.setMonths.bind(this), this.nextPage = this.nextPage.bind(this), this.prevPage = this.prevPage.bind(this), this.prevYear = this.prevYear.bind(this), this.nextYear = this.nextYear.bind(this), this.setYear = this.setYear.bind(this), this.setMonth = this.setMonth.bind(this), this.isOutsideVisibleMonths = this.isOutsideVisibleMonths.bind(this), this.isDateDisabled = this.isDateDisabled.bind(this), this.isDateSelected = this.isDateSelected.bind(this), this.shiftFocus = this.shiftFocus.bind(this), this.handleCellClick = this.handleCellClick.bind(this), this.handleMultipleUpdate = this.handleMultipleUpdate.bind(this), this.handleSingleUpdate = this.handleSingleUpdate.bind(this), this.onkeydown = this.onkeydown.bind(this), this.getBitsAttr = this.getBitsAttr.bind(this), P(() => {
			this.announcer = Oa(this.domContext.getDocument());
		}), this.months = Wo({
			dateObj: this.opts.placeholder.current,
			weekStartsOn: this.opts.weekStartsOn.current,
			locale: this.opts.locale.current,
			fixedWeeks: this.opts.fixedWeeks.current,
			numberOfMonths: this.opts.numberOfMonths.current
		}), this.#s(), this.#c(), this.#l(), ns({
			placeholder: this.opts.placeholder,
			getVisibleMonths: () => this.visibleMonths,
			weekStartsOn: this.opts.weekStartsOn,
			locale: this.opts.locale,
			fixedWeeks: this.opts.fixedWeeks,
			numberOfMonths: this.opts.numberOfMonths,
			setMonths: (e) => this.months = e
		}), es({
			fixedWeeks: this.opts.fixedWeeks,
			locale: this.opts.locale,
			numberOfMonths: this.opts.numberOfMonths,
			placeholder: this.opts.placeholder,
			setMonths: this.setMonths,
			weekStartsOn: this.opts.weekStartsOn
		}), Oe(() => this.fullCalendarLabel, (e) => {
			let t = this.domContext.getElementById(this.accessibleHeadingId);
			t && (t.textContent = e);
		}), Oe(() => this.opts.value.current, () => {
			let e = this.opts.value.current;
			if (Array.isArray(e) && e.length) {
				let t = e[e.length - 1];
				t && this.opts.placeholder.current !== t && (this.opts.placeholder.current = t);
			} else !Array.isArray(e) && e && this.opts.placeholder.current !== e && (this.opts.placeholder.current = e);
		}), us({
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
	#i = U(() => $o({
		months: this.months,
		formatter: this.formatter,
		weekdayFormat: this.opts.weekdayFormat.current
	}));
	get weekdays() {
		return C(this.#i);
	}
	set weekdays(e) {
		N(this.#i, e);
	}
	#a = U(() => F(() => this.opts.placeholder.current.year));
	get initialPlaceholderYear() {
		return C(this.#a);
	}
	set initialPlaceholderYear(e) {
		N(this.#a, e);
	}
	#o = U(() => ps({
		minValue: this.opts.minValue.current,
		maxValue: this.opts.maxValue.current,
		placeholderYear: this.initialPlaceholderYear
	}));
	get defaultYears() {
		return C(this.#o);
	}
	set defaultYears(e) {
		N(this.#o, e);
	}
	#s() {
		I(() => {
			if (F(() => this.opts.initialFocus.current)) {
				let e = this.opts.ref.current?.querySelector("[data-focused]");
				e && e.focus();
			}
		});
	}
	#c() {
		I(() => {
			if (this.opts.ref.current) return ts({
				calendarNode: this.opts.ref.current,
				label: this.fullCalendarLabel,
				accessibleHeadingId: this.accessibleHeadingId
			});
		});
	}
	#l() {
		z(() => {
			this.formatter.getLocale() !== this.opts.locale.current && this.formatter.setLocale(this.opts.locale.current);
		});
	}
	nextPage() {
		Zo({
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
		Qo({
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
	#u = U(() => rs({
		maxValue: this.opts.maxValue.current,
		months: this.months,
		disabled: this.opts.disabled.current
	}));
	get isNextButtonDisabled() {
		return C(this.#u);
	}
	set isNextButtonDisabled(e) {
		N(this.#u, e);
	}
	#d = U(() => is({
		minValue: this.opts.minValue.current,
		months: this.months,
		disabled: this.opts.disabled.current
	}));
	get isPrevButtonDisabled() {
		return C(this.#d);
	}
	set isPrevButtonDisabled(e) {
		N(this.#d, e);
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
		return C(this.#f);
	}
	set isInvalid(e) {
		N(this.#f, e);
	}
	#p = U(() => (this.opts.monthFormat.current, this.opts.yearFormat.current, as({
		months: this.months,
		formatter: this.formatter,
		locale: this.opts.locale.current
	})));
	get headingValue() {
		return C(this.#p);
	}
	set headingValue(e) {
		N(this.#p, e);
	}
	#m = U(() => `${this.opts.calendarLabel.current} ${this.headingValue}`);
	get fullCalendarLabel() {
		return C(this.#m);
	}
	set fullCalendarLabel(e) {
		N(this.#m, e);
	}
	isOutsideVisibleMonths(e) {
		return !this.visibleMonths.some((t) => qr(e, t));
	}
	isDateDisabled(e) {
		if (this.opts.isDateDisabled.current(e) || this.opts.disabled.current) return !0;
		let t = this.opts.minValue.current, n = this.opts.maxValue.current;
		return !!(t && za(e, t) || n && za(n, e));
	}
	isDateSelected(e) {
		let t = this.opts.value.current;
		return Array.isArray(t) ? t.some((t) => Kr(t, e)) : t ? Kr(t, e) : !1;
	}
	shiftFocus(e, t) {
		return qo({
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
			e ? this.announcer.announce(`Selected Date: ${this.formatter.selectedDate(e, !1)}`, "polite") : this.announcer.announce("Selected date is now empty.", "polite", 5e3), this.opts.value.current = ds(e, n), e !== void 0 && this.opts.onDateSelect?.current?.();
		}
	}
	handleMultipleUpdate(e, t) {
		if (!e) {
			let e = [t];
			return this.#h(e) ? e : [t];
		}
		if (!Array.isArray(e)) return;
		let n = e.findIndex((e) => Kr(e, t)), r = this.opts.preventDeselect.current;
		if (n === -1) {
			let n = [...e, t];
			return this.#h(n) ? n : [t];
		}
		if (r) return e;
		{
			let n = e.filter((e) => !Kr(e, t));
			if (!n.length) {
				this.opts.placeholder.current = t;
				return;
			}
			return n;
		}
	}
	handleSingleUpdate(e, t) {
		if (!e) return t;
		if (!this.opts.preventDeselect.current && Kr(e, t)) this.opts.placeholder.current = t;
		else return t;
	}
	onkeydown(e) {
		Xo({
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
		return C(this.#g);
	}
	set snippetProps(e) {
		N(this.#g, e);
	}
	getBitsAttr = (e) => fs.getAttr(e);
	#_ = U(() => ({
		...os({
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
		return C(this.#_);
	}
	set props(e) {
		N(this.#_, e);
	}
}, gs = class e {
	static create(t) {
		return new e(t, ms.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = ve(this.opts.ref);
	}
	#e = U(() => ({
		id: this.opts.id.current,
		"aria-hidden": K(!0),
		"data-disabled": J(this.root.opts.disabled.current),
		"data-readonly": J(this.root.opts.readonly.current),
		[this.root.getBitsAttr("heading")]: "",
		...this.attachment
	}));
	get props() {
		return C(this.#e);
	}
	set props(e) {
		N(this.#e, e);
	}
}, _s = new we("Calendar.Cell | RangeCalendar.Cell"), vs = class e {
	static create(t) {
		return _s.set(new e(t, ms.get()));
	}
	opts;
	root;
	#e = U(() => Ma(Si(this.opts.date.current)));
	get cellDate() {
		return C(this.#e);
	}
	set cellDate(e) {
		N(this.#e, e);
	}
	#t = U(() => this.root.opts.isDateUnavailable.current(this.opts.date.current));
	get isUnavailable() {
		return C(this.#t);
	}
	set isUnavailable(e) {
		N(this.#t, e);
	}
	#n = U(() => Kr(this.opts.date.current, this.root.todayDate));
	get isDateToday() {
		return C(this.#n);
	}
	set isDateToday(e) {
		N(this.#n, e);
	}
	#r = U(() => !qr(this.opts.date.current, this.opts.month.current));
	get isOutsideMonth() {
		return C(this.#r);
	}
	set isOutsideMonth(e) {
		N(this.#r, e);
	}
	#i = U(() => this.root.isOutsideVisibleMonths(this.opts.date.current));
	get isOutsideVisibleMonths() {
		return C(this.#i);
	}
	set isOutsideVisibleMonths(e) {
		N(this.#i, e);
	}
	#a = U(() => this.root.isDateDisabled(this.opts.date.current) || this.isOutsideMonth && this.root.opts.disableDaysOutsideMonth.current);
	get isDisabled() {
		return C(this.#a);
	}
	set isDisabled(e) {
		N(this.#a, e);
	}
	#o = U(() => Kr(this.opts.date.current, this.root.opts.placeholder.current));
	get isFocusedDate() {
		return C(this.#o);
	}
	set isFocusedDate(e) {
		N(this.#o, e);
	}
	#s = U(() => this.root.isDateSelected(this.opts.date.current));
	get isSelectedDate() {
		return C(this.#s);
	}
	set isSelectedDate(e) {
		N(this.#s, e);
	}
	#c = U(() => this.root.formatter.custom(this.cellDate, {
		weekday: "long",
		month: "long",
		day: "numeric",
		year: "numeric"
	}));
	get labelText() {
		return C(this.#c);
	}
	set labelText(e) {
		N(this.#c, e);
	}
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = ve(this.opts.ref);
	}
	#l = U(() => ({
		disabled: this.isDisabled,
		unavailable: this.isUnavailable,
		selected: this.isSelectedDate,
		day: `${this.opts.date.current.day}`
	}));
	get snippetProps() {
		return C(this.#l);
	}
	set snippetProps(e) {
		N(this.#l, e);
	}
	#u = U(() => this.isDisabled || this.isOutsideMonth && this.root.opts.disableDaysOutsideMonth.current || this.isUnavailable);
	get ariaDisabled() {
		return C(this.#u);
	}
	set ariaDisabled(e) {
		N(this.#u, e);
	}
	#d = U(() => ({
		"data-unavailable": J(this.isUnavailable),
		"data-today": this.isDateToday ? "" : void 0,
		"data-outside-month": this.isOutsideMonth ? "" : void 0,
		"data-outside-visible-months": this.isOutsideVisibleMonths ? "" : void 0,
		"data-focused": this.isFocusedDate ? "" : void 0,
		"data-selected": J(this.isSelectedDate),
		"data-value": this.opts.date.current.toString(),
		"data-type": Na(this.opts.date.current),
		"data-disabled": J(this.isDisabled || this.isOutsideMonth && this.root.opts.disableDaysOutsideMonth.current)
	}));
	get sharedDataAttrs() {
		return C(this.#d);
	}
	set sharedDataAttrs(e) {
		N(this.#d, e);
	}
	#f = U(() => ({
		id: this.opts.id.current,
		role: "gridcell",
		"aria-selected": Ce(this.isSelectedDate),
		"aria-disabled": Ce(this.ariaDisabled),
		...this.sharedDataAttrs,
		[this.root.getBitsAttr("cell")]: "",
		...this.attachment
	}));
	get props() {
		return C(this.#f);
	}
	set props(e) {
		N(this.#f, e);
	}
}, ys = class e {
	static create(t) {
		return new e(t, _s.get());
	}
	opts;
	cell;
	attachment;
	constructor(e, t) {
		this.opts = e, this.cell = t, this.onclick = this.onclick.bind(this), this.attachment = ve(this.opts.ref);
	}
	#e = U(() => this.cell.isOutsideMonth && this.cell.root.opts.disableDaysOutsideMonth.current || this.cell.isDisabled ? void 0 : this.cell.root.tabbableDate && Kr(this.cell.opts.date.current, this.cell.root.tabbableDate) ? 0 : -1);
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
		return C(this.#t);
	}
	set snippetProps(e) {
		N(this.#t, e);
	}
	#n = U(() => ({
		id: this.opts.id.current,
		role: "button",
		"aria-label": this.cell.labelText,
		"aria-disabled": Ce(this.cell.ariaDisabled),
		...this.cell.sharedDataAttrs,
		tabindex: C(this.#e),
		[this.cell.root.getBitsAttr("day")]: "",
		"data-bits-day": "",
		onclick: this.onclick,
		...this.attachment
	}));
	get props() {
		return C(this.#n);
	}
	set props(e) {
		N(this.#n, e);
	}
}, bs = class e {
	static create(t) {
		return new e(t, ms.get());
	}
	opts;
	root;
	#e = U(() => this.root.isNextButtonDisabled);
	get isDisabled() {
		return C(this.#e);
	}
	set isDisabled(e) {
		N(this.#e, e);
	}
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.onclick = this.onclick.bind(this), this.attachment = ve(this.opts.ref);
	}
	onclick(e) {
		this.isDisabled || this.root.nextPage();
	}
	#t = U(() => ({
		id: this.opts.id.current,
		role: "button",
		type: "button",
		"aria-label": "Next",
		"aria-disabled": Ce(this.isDisabled),
		"data-disabled": J(this.isDisabled),
		disabled: this.isDisabled,
		[this.root.getBitsAttr("next-button")]: "",
		onclick: this.onclick,
		...this.attachment
	}));
	get props() {
		return C(this.#t);
	}
	set props(e) {
		N(this.#t, e);
	}
}, xs = class e {
	static create(t) {
		return new e(t, ms.get());
	}
	opts;
	root;
	#e = U(() => this.root.isPrevButtonDisabled);
	get isDisabled() {
		return C(this.#e);
	}
	set isDisabled(e) {
		N(this.#e, e);
	}
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.onclick = this.onclick.bind(this), this.attachment = ve(this.opts.ref);
	}
	onclick(e) {
		this.isDisabled || this.root.prevPage();
	}
	#t = U(() => ({
		id: this.opts.id.current,
		role: "button",
		type: "button",
		"aria-label": "Previous",
		"aria-disabled": Ce(this.isDisabled),
		"data-disabled": J(this.isDisabled),
		disabled: this.isDisabled,
		[this.root.getBitsAttr("prev-button")]: "",
		onclick: this.onclick,
		...this.attachment
	}));
	get props() {
		return C(this.#t);
	}
	set props(e) {
		N(this.#t, e);
	}
}, Ss = class e {
	static create(t) {
		return new e(t, ms.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = ve(this.opts.ref);
	}
	#e = U(() => ({
		id: this.opts.id.current,
		tabindex: -1,
		role: "grid",
		"aria-readonly": Ce(this.root.opts.readonly.current),
		"aria-disabled": Ce(this.root.opts.disabled.current),
		"data-readonly": J(this.root.opts.readonly.current),
		"data-disabled": J(this.root.opts.disabled.current),
		[this.root.getBitsAttr("grid")]: "",
		...this.attachment
	}));
	get props() {
		return C(this.#e);
	}
	set props(e) {
		N(this.#e, e);
	}
}, Cs = class e {
	static create(t) {
		return new e(t, ms.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = ve(this.opts.ref);
	}
	#e = U(() => ({
		id: this.opts.id.current,
		"data-disabled": J(this.root.opts.disabled.current),
		"data-readonly": J(this.root.opts.readonly.current),
		[this.root.getBitsAttr("grid-body")]: "",
		...this.attachment
	}));
	get props() {
		return C(this.#e);
	}
	set props(e) {
		N(this.#e, e);
	}
}, ws = class e {
	static create(t) {
		return new e(t, ms.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = ve(this.opts.ref);
	}
	#e = U(() => ({
		id: this.opts.id.current,
		"data-disabled": J(this.root.opts.disabled.current),
		"data-readonly": J(this.root.opts.readonly.current),
		[this.root.getBitsAttr("grid-head")]: "",
		...this.attachment
	}));
	get props() {
		return C(this.#e);
	}
	set props(e) {
		N(this.#e, e);
	}
}, Ts = class e {
	static create(t) {
		return new e(t, ms.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = ve(this.opts.ref);
	}
	#e = U(() => ({
		id: this.opts.id.current,
		"data-disabled": J(this.root.opts.disabled.current),
		"data-readonly": J(this.root.opts.readonly.current),
		[this.root.getBitsAttr("grid-row")]: "",
		...this.attachment
	}));
	get props() {
		return C(this.#e);
	}
	set props(e) {
		N(this.#e, e);
	}
}, Es = class e {
	static create(t) {
		return new e(t, ms.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = ve(this.opts.ref);
	}
	#e = U(() => ({
		id: this.opts.id.current,
		"data-disabled": J(this.root.opts.disabled.current),
		"data-readonly": J(this.root.opts.readonly.current),
		[this.root.getBitsAttr("head-cell")]: "",
		...this.attachment
	}));
	get props() {
		return C(this.#e);
	}
	set props(e) {
		N(this.#e, e);
	}
}, Ds = class e {
	static create(t) {
		return new e(t, ms.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = ve(this.opts.ref);
	}
	#e = U(() => ({
		id: this.opts.id.current,
		"data-disabled": J(this.root.opts.disabled.current),
		"data-readonly": J(this.root.opts.readonly.current),
		[this.root.getBitsAttr("header")]: "",
		...this.attachment
	}));
	get props() {
		return C(this.#e);
	}
	set props(e) {
		N(this.#e, e);
	}
}, Os = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"children",
	"child",
	"ref",
	"id"
]), ks = a("<div><!></div>");
function As(n, i) {
	let a = c();
	H(i, !0);
	let o = L(i, "ref", 15, null), s = L(i, "id", 19, () => Pe(a)), l = k(i, Os), u = ys.create({
		id: X(() => s()),
		ref: X(() => o(), (e) => o(e))
	}), p = U(() => je(l, u.props));
	var g = h(), _ = M(g), v = (e) => {
		var t = h(), n = M(t);
		{
			let e = U(() => ({
				props: C(p),
				...u.snippetProps
			}));
			d(n, () => i.child, () => C(e));
		}
		m(e, t);
	}, y = (n) => {
		var r = ks();
		E(r, () => ({ ...C(p) }));
		var a = x(r), o = (e) => {
			var t = h(), n = M(t);
			d(n, () => i.children ?? A, () => u.snippetProps), m(e, t);
		}, s = (e) => {
			var n = ne();
			b(() => t(n, u.cell.opts.date.current.day)), m(e, n);
		};
		f(a, (e) => {
			i.children ? e(o) : e(s, -1);
		}), e(r), m(n, r);
	};
	f(_, (e) => {
		i.child ? e(v) : e(y, -1);
	}), m(n, g), r();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/calendar/components/calendar-grid.svelte
var js = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"children",
	"child",
	"ref",
	"id"
]), Ms = a("<table><!></table>");
function Ns(t, n) {
	let i = c();
	H(n, !0);
	let a = L(n, "ref", 15, null), o = L(n, "id", 19, () => Pe(i)), s = k(n, js), l = Ss.create({
		id: X(() => o()),
		ref: X(() => a(), (e) => a(e))
	}), u = U(() => je(s, l.props));
	var p = h(), g = M(p), _ = (e) => {
		var t = h(), r = M(t);
		d(r, () => n.child, () => ({ props: C(u) })), m(e, t);
	}, v = (t) => {
		var r = Ms();
		E(r, () => ({ ...C(u) }));
		var i = x(r);
		d(i, () => n.children ?? A), e(r), m(t, r);
	};
	f(g, (e) => {
		n.child ? e(_) : e(v, -1);
	}), m(t, p), r();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/calendar/components/calendar-grid-body.svelte
var Ps = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"children",
	"child",
	"ref",
	"id"
]), Fs = a("<tbody><!></tbody>");
function Is(t, n) {
	let i = c();
	H(n, !0);
	let a = L(n, "ref", 15, null), o = L(n, "id", 19, () => Pe(i)), s = k(n, Ps), l = Cs.create({
		id: X(() => o()),
		ref: X(() => a(), (e) => a(e))
	}), u = U(() => je(s, l.props));
	var p = h(), g = M(p), _ = (e) => {
		var t = h(), r = M(t);
		d(r, () => n.child, () => ({ props: C(u) })), m(e, t);
	}, v = (t) => {
		var r = Fs();
		E(r, () => ({ ...C(u) }));
		var i = x(r);
		d(i, () => n.children ?? A), e(r), m(t, r);
	};
	f(g, (e) => {
		n.child ? e(_) : e(v, -1);
	}), m(t, p), r();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/calendar/components/calendar-cell.svelte
var Ls = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"children",
	"child",
	"ref",
	"id",
	"date",
	"month"
]), Rs = a("<td><!></td>");
function zs(t, n) {
	let i = c();
	H(n, !0);
	let a = L(n, "ref", 15, null), o = L(n, "id", 19, () => Pe(i)), s = k(n, Ls), l = vs.create({
		id: X(() => o()),
		ref: X(() => a(), (e) => a(e)),
		date: X(() => n.date),
		month: X(() => n.month)
	}), u = U(() => je(s, l.props));
	var p = h(), g = M(p), _ = (e) => {
		var t = h(), r = M(t);
		{
			let e = U(() => ({
				props: C(u),
				...l.snippetProps
			}));
			d(r, () => n.child, () => C(e));
		}
		m(e, t);
	}, v = (t) => {
		var r = Rs();
		E(r, () => ({ ...C(u) }));
		var i = x(r);
		d(i, () => n.children ?? A, () => l.snippetProps), e(r), m(t, r);
	};
	f(g, (e) => {
		n.child ? e(_) : e(v, -1);
	}), m(t, p), r();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/calendar/components/calendar-grid-head.svelte
var Bs = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"children",
	"child",
	"ref",
	"id"
]), Vs = a("<thead><!></thead>");
function Hs(t, n) {
	let i = c();
	H(n, !0);
	let a = L(n, "ref", 15, null), o = L(n, "id", 19, () => Pe(i)), s = k(n, Bs), l = ws.create({
		id: X(() => o()),
		ref: X(() => a(), (e) => a(e))
	}), u = U(() => je(s, l.props));
	var p = h(), g = M(p), _ = (e) => {
		var t = h(), r = M(t);
		d(r, () => n.child, () => ({ props: C(u) })), m(e, t);
	}, v = (t) => {
		var r = Vs();
		E(r, () => ({ ...C(u) }));
		var i = x(r);
		d(i, () => n.children ?? A), e(r), m(t, r);
	};
	f(g, (e) => {
		n.child ? e(_) : e(v, -1);
	}), m(t, p), r();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/calendar/components/calendar-head-cell.svelte
var Us = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"children",
	"child",
	"ref",
	"id"
]), Ws = a("<th><!></th>");
function Gs(t, n) {
	let i = c();
	H(n, !0);
	let a = L(n, "ref", 15, null), o = L(n, "id", 19, () => Pe(i)), s = k(n, Us), l = Es.create({
		id: X(() => o()),
		ref: X(() => a(), (e) => a(e))
	}), u = U(() => je(s, l.props));
	var p = h(), g = M(p), _ = (e) => {
		var t = h(), r = M(t);
		d(r, () => n.child, () => ({ props: C(u) })), m(e, t);
	}, v = (t) => {
		var r = Ws();
		E(r, () => ({ ...C(u) }));
		var i = x(r);
		d(i, () => n.children ?? A), e(r), m(t, r);
	};
	f(g, (e) => {
		n.child ? e(_) : e(v, -1);
	}), m(t, p), r();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/calendar/components/calendar-grid-row.svelte
var Ks = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"children",
	"child",
	"ref",
	"id"
]), qs = a("<tr><!></tr>");
function Js(t, n) {
	let i = c();
	H(n, !0);
	let a = L(n, "ref", 15, null), o = L(n, "id", 19, () => Pe(i)), s = k(n, Ks), l = Ts.create({
		id: X(() => o()),
		ref: X(() => a(), (e) => a(e))
	}), u = U(() => je(s, l.props));
	var p = h(), g = M(p), _ = (e) => {
		var t = h(), r = M(t);
		d(r, () => n.child, () => ({ props: C(u) })), m(e, t);
	}, v = (t) => {
		var r = qs();
		E(r, () => ({ ...C(u) }));
		var i = x(r);
		d(i, () => n.children ?? A), e(r), m(t, r);
	};
	f(g, (e) => {
		n.child ? e(_) : e(v, -1);
	}), m(t, p), r();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/calendar/components/calendar-header.svelte
var Ys = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"children",
	"child",
	"ref",
	"id"
]), Xs = a("<header><!></header>");
function Zs(t, n) {
	let i = c();
	H(n, !0);
	let a = L(n, "ref", 15, null), o = L(n, "id", 19, () => Pe(i)), s = k(n, Ys), l = Ds.create({
		id: X(() => o()),
		ref: X(() => a(), (e) => a(e))
	}), u = U(() => je(s, l.props));
	var p = h(), g = M(p), _ = (e) => {
		var t = h(), r = M(t);
		d(r, () => n.child, () => ({ props: C(u) })), m(e, t);
	}, v = (t) => {
		var r = Xs();
		E(r, () => ({ ...C(u) }));
		var i = x(r);
		d(i, () => n.children ?? A), e(r), m(t, r);
	};
	f(g, (e) => {
		n.child ? e(_) : e(v, -1);
	}), m(t, p), r();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/calendar/components/calendar-heading.svelte
var Qs = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"children",
	"child",
	"ref",
	"id"
]), $s = a("<div><!></div>");
function ec(n, i) {
	let a = c();
	H(i, !0);
	let o = L(i, "ref", 15, null), s = L(i, "id", 19, () => Pe(a)), l = k(i, Qs), u = gs.create({
		id: X(() => s()),
		ref: X(() => o(), (e) => o(e))
	}), p = U(() => je(l, u.props));
	var g = h(), _ = M(g), v = (e) => {
		var t = h(), n = M(t);
		d(n, () => i.child, () => ({
			props: C(p),
			headingValue: u.root.headingValue
		})), m(e, t);
	}, y = (n) => {
		var r = $s();
		E(r, () => ({ ...C(p) }));
		var a = x(r), o = (e) => {
			var t = h(), n = M(t);
			d(n, () => i.children ?? A, () => ({ headingValue: u.root.headingValue })), m(e, t);
		}, s = (e) => {
			var n = ne();
			b(() => t(n, u.root.headingValue)), m(e, n);
		};
		f(a, (e) => {
			i.children ? e(o) : e(s, -1);
		}), e(r), m(n, r);
	};
	f(_, (e) => {
		i.child ? e(v) : e(y, -1);
	}), m(n, g), r();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/calendar/components/calendar-next-button.svelte
var tc = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"children",
	"child",
	"id",
	"ref",
	"tabindex"
]), nc = a("<button><!></button>");
function rc(t, n) {
	let i = c();
	H(n, !0);
	let a = L(n, "id", 19, () => Pe(i)), o = L(n, "ref", 15, null), s = L(n, "tabindex", 3, 0), l = k(n, tc), u = bs.create({
		id: X(() => a()),
		ref: X(() => o(), (e) => o(e))
	}), p = U(() => je(l, u.props, { tabindex: s() }));
	var g = h(), _ = M(g), v = (e) => {
		var t = h(), r = M(t);
		d(r, () => n.child, () => ({ props: C(p) })), m(e, t);
	}, y = (t) => {
		var r = nc();
		E(r, () => ({ ...C(p) }));
		var i = x(r);
		d(i, () => n.children ?? A), e(r), m(t, r);
	};
	f(_, (e) => {
		n.child ? e(v) : e(y, -1);
	}), m(t, g), r();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/calendar/components/calendar-prev-button.svelte
var ic = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"children",
	"child",
	"id",
	"ref",
	"tabindex"
]), ac = a("<button><!></button>");
function oc(t, n) {
	let i = c();
	H(n, !0);
	let a = L(n, "id", 19, () => Pe(i)), o = L(n, "ref", 15, null), s = L(n, "tabindex", 3, 0), l = k(n, ic), u = xs.create({
		id: X(() => a()),
		ref: X(() => o(), (e) => o(e))
	}), p = U(() => je(l, u.props, { tabindex: s() }));
	var g = h(), _ = M(g), v = (e) => {
		var t = h(), r = M(t);
		d(r, () => n.child, () => ({ props: C(p) })), m(e, t);
	}, y = (t) => {
		var r = ac();
		E(r, () => ({ ...C(p) }));
		var i = x(r);
		d(i, () => n.children ?? A), e(r), m(t, r);
	};
	f(_, (e) => {
		n.child ? e(v) : e(y, -1);
	}), m(t, g), r();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/date-field/date-field.svelte.js
var sc = xe({
	component: "date-field",
	parts: [
		"input",
		"label",
		"segment"
	]
}), cc = {
	day: {
		min: 1,
		max: (e) => {
			let t = e.value.current ?? e.placeholder.current;
			return Eo(e.segmentValues.month, t);
		},
		cycle: 1,
		padZero: !0
	},
	month: {
		min: 1,
		max: 12,
		cycle: 1,
		padZero: !0,
		getAnnouncement: (e, t) => t.placeholder.current ? `${e} - ${t.formatter.fullMonth(Ma(t.placeholder.current.set({ month: e })))}` : ""
	},
	year: {
		min: 1,
		max: 9999,
		cycle: 1,
		padZero: !1
	},
	hour: {
		min: (e) => +(e.hourCycle.current === 12),
		max: (e) => e.hourCycle.current === 24 ? 23 : e.hourCycle.current === 12 || Oo(e.locale.current) === 12 ? 12 : 23,
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
}, lc = new we("DateField.Root"), uc = class e {
	static create(t, n) {
		return lc.set(new e(t, n));
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
	descriptionId = Le();
	formatter;
	initialSegments;
	#e = D();
	get segmentValues() {
		return C(this.#e);
	}
	set segmentValues(e) {
		N(this.#e, e, !0);
	}
	announcer;
	#t = U(() => new Set(this.readonlySegments.current));
	get readonlySegmentsSet() {
		return C(this.#t);
	}
	set readonlySegmentsSet(e) {
		N(this.#t, e);
	}
	segmentStates = uo();
	#n = D(null);
	#r = D(null);
	#i = D(null);
	get descriptionNode() {
		return C(this.#i);
	}
	set descriptionNode(e) {
		N(this.#i, e, !0);
	}
	#a = D(null);
	get validationNode() {
		return C(this.#a);
	}
	set validationNode(e) {
		N(this.#a, e, !0);
	}
	states = uo();
	#o = !1;
	#s = D(null);
	get dayPeriodNode() {
		return C(this.#s);
	}
	set dayPeriodNode(e) {
		N(this.#s, e, !0);
	}
	hourInputDayPeriodHint = null;
	rangeRoot = void 0;
	#c = D("");
	get name() {
		return C(this.#c);
	}
	set name(e) {
		N(this.#c, e, !0);
	}
	domContext = new Ee(() => null);
	constructor(e, t) {
		this.rangeRoot = t, this.value = e.value, this.placeholder = t ? t.opts.placeholder : e.placeholder, this.validate = t ? Ae(void 0) : e.validate, this.minValue = t ? t.opts.minValue : e.minValue, this.maxValue = t ? t.opts.maxValue : e.maxValue, this.disabled = t ? t.opts.disabled : e.disabled, this.readonly = t ? t.opts.readonly : e.readonly, this.granularity = t ? t.opts.granularity : e.granularity, this.readonlySegments = t ? t.opts.readonlySegments : e.readonlySegments, this.hourCycle = t ? t.opts.hourCycle : e.hourCycle, this.locale = t ? t.opts.locale : e.locale, this.hideTimeZone = t ? t.opts.hideTimeZone : e.hideTimeZone, this.required = t ? t.opts.required : e.required, this.onInvalid = t ? t.opts.onInvalid : e.onInvalid, this.errorMessageId = t ? t.opts.errorMessageId : e.errorMessageId, this.isInvalidProp = e.isInvalidProp, this.formatter = Bo({
			initialLocale: this.locale.current,
			monthFormat: X(() => "long"),
			yearFormat: X(() => "numeric")
		}), this.initialSegments = ao(this.inferredGranularity), this.segmentValues = this.initialSegments, this.announcer = Oa(null), this.getFieldNode = this.getFieldNode.bind(this), this.updateSegment = this.updateSegment.bind(this), this.handleSegmentClick = this.handleSegmentClick.bind(this), this.getBaseSegmentAttrs = this.getBaseSegmentAttrs.bind(this), I(() => {
			F(() => {
				this.initialSegments = ao(this.inferredGranularity);
			});
		}), P(() => {
			this.announcer = Oa(this.domContext.getDocument());
		}), Ie(() => {
			t || To(this.descriptionId, this.domContext.getDocument());
		}), I(() => {
			this.formatter.getLocale() !== this.locale.current && this.formatter.setLocale(this.locale.current);
		}), I(() => {
			if (t) return;
			this.value.current && wo({
				id: F(() => this.descriptionId),
				formatter: this.formatter,
				value: this.value.current,
				doc: this.domContext.getDocument()
			});
			let e = F(() => this.placeholder.current);
			this.value.current && e !== this.value.current && F(() => {
				this.value.current && (this.placeholder.current = this.value.current);
			});
		}), this.value.current && this.syncSegmentValues(this.value.current), I(() => {
			this.locale.current, this.value.current && this.syncSegmentValues(this.value.current), this.#l();
		}), I(() => {
			if (this.value.current === void 0) {
				if (this.#o) {
					this.#o = !1;
					return;
				}
				this.segmentValues = ao(this.inferredGranularity);
			}
		}), Oe(() => this.validationStatus, () => {
			this.validationStatus !== !1 && this.onInvalid.current?.(this.validationStatus.reason, this.validationStatus.message);
		});
	}
	setName(e) {
		this.name = e;
	}
	setFieldNode(e) {
		N(this.#n, e, !0);
	}
	getFieldNode() {
		return this.rangeRoot ? this.rangeRoot.fieldNode : C(this.#n);
	}
	setLabelNode(e) {
		N(this.#r, e, !0);
	}
	getLabelNode() {
		return this.rangeRoot ? this.rangeRoot.labelNode : C(this.#r);
	}
	#l() {
		this.states.day.updating = null, this.states.month.updating = null, this.states.year.updating = null, this.states.hour.updating = null, this.states.minute.updating = null, this.states.dayPeriod.updating = null;
	}
	setValue(e) {
		this.value.current = e;
	}
	syncSegmentValues(e) {
		let t = Ua.map((t) => {
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
			let n = Wa.map((t) => {
				if (t === "dayPeriod") return this.states.dayPeriod.updating ? [t, this.states.dayPeriod.updating] : [t, this.formatter.dayPeriod(Ma(e))];
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
		if (n && za(e, n)) return { reason: "min" };
		let r = this.maxValue.current;
		return r && za(r, e) ? { reason: "max" } : !1;
	});
	get validationStatus() {
		return C(this.#u);
	}
	set validationStatus(e) {
		N(this.#u, e);
	}
	#d = U(() => this.validationStatus !== !1 && (this.isInvalidProp.current, !0));
	get isInvalid() {
		return C(this.#d);
	}
	set isInvalid(e) {
		N(this.#d, e);
	}
	#f = U(() => this.granularity.current || xo(this.placeholder.current, this.granularity.current));
	get inferredGranularity() {
		return C(this.#f);
	}
	set inferredGranularity(e) {
		N(this.#f, e);
	}
	#p = U(() => this.value.current === void 0 ? this.placeholder.current : this.value.current);
	get dateRef() {
		return C(this.#p);
	}
	set dateRef(e) {
		N(this.#p, e);
	}
	#m = U(() => co({
		segmentValues: this.segmentValues,
		formatter: this.formatter,
		locale: this.locale.current,
		granularity: this.inferredGranularity,
		dateRef: this.dateRef,
		hideTimeZone: this.hideTimeZone.current,
		hourCycle: this.hourCycle.current
	}));
	get allSegmentContent() {
		return C(this.#m);
	}
	set allSegmentContent(e) {
		N(this.#m, e);
	}
	#h = U(() => this.allSegmentContent.arr);
	get segmentContents() {
		return C(this.#h);
	}
	set segmentContents(e) {
		N(this.#h, e);
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
		if (bo(a)) {
			let n = a[e], r = t;
			if (e === "month") {
				let t = r(n);
				if (this.states.month.updating = t, t !== null && a.day !== null) {
					let e = Ra(Ma(s.set({ month: Number.parseInt(t) })));
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
				let t = this.hourInputDayPeriodHint, i = r(t === null ? n : Ao(a.hour)), c = i !== null && t !== null ? ko(i, t) : i;
				if (this.states.hour.updating = c, c !== null && a.dayPeriod !== null) {
					if (t !== null) a.dayPeriod = t;
					else {
						let e = this.formatter.dayPeriod(Ma(s.set({ hour: Number.parseInt(c) })), this.hourCycle.current);
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
		} else if (fo(e)) {
			let n = a[e], r = t, i = r(n);
			if (e === "month" && i !== null && a.day !== null) {
				this.states.month.updating = i;
				let t = Ra(Ma(s.set({ month: Number.parseInt(i) })));
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
		this.segmentValues = o, yo(o, C(this.#n)) ? this.setValue(vo({
			segmentObj: o,
			fieldNode: C(this.#n),
			dateRef: this.placeholder.current
		})) : (this.value.current !== void 0 && (this.#o = !0), this.setValue(void 0), this.segmentValues = o);
	}
	handleSegmentClick(e) {
		this.disabled.current && e.preventDefault();
	}
	getBaseSegmentAttrs(e, t) {
		let n = this.readonlySegmentsSet.has(e), r = {
			"aria-invalid": K(this.isInvalid),
			"aria-disabled": Ce(this.disabled.current),
			"aria-readonly": Ce(this.readonly.current || n),
			"data-invalid": J(this.isInvalid),
			"data-disabled": J(this.disabled.current),
			"data-readonly": J(this.readonly.current || n),
			"data-segment": `${e}`,
			[sc.segment]: ""
		};
		if (e === "literal") return r;
		let i = this.descriptionNode?.id, a = Co(t, C(this.#n)) && i, o = this.errorMessageId?.current, s = a ? `${i} ${this.isInvalid && o ? o : ""}` : void 0, c = !(this.readonly.current || n || this.disabled.current);
		return {
			...r,
			"aria-labelledby": this.#g(t),
			contenteditable: c ? "true" : void 0,
			"aria-describedby": s,
			tabindex: this.disabled.current ? void 0 : 0
		};
	}
}, dc = class e {
	static create(t) {
		return new e(t, lc.get());
	}
	opts;
	root;
	domContext;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.domContext = new Ee(e.ref), this.root.domContext = this.domContext, this.attachment = ve(e.ref, (e) => this.root.setFieldNode(e)), Oe(() => this.opts.name.current, (e) => {
			this.root.setName(e);
		});
	}
	#e = U(() => {
		if (Y && this.domContext.getElementById(this.root.descriptionId)) return this.root.descriptionId;
	});
	#t = U(() => ({
		id: this.opts.id.current,
		role: "group",
		"aria-labelledby": this.root.getLabelNode()?.id ?? void 0,
		"aria-describedby": C(this.#e),
		"aria-disabled": Ce(this.root.disabled.current),
		"data-invalid": this.root.isInvalid ? "" : void 0,
		"data-disabled": J(this.root.disabled.current),
		[sc.input]: "",
		...this.attachment
	}));
	get props() {
		return C(this.#t);
	}
	set props(e) {
		N(this.#t, e);
	}
}, fc = class e {
	static create() {
		return new e(lc.get());
	}
	root;
	#e = U(() => this.root.name !== "");
	get shouldRender() {
		return C(this.#e);
	}
	set shouldRender(e) {
		N(this.#e, e);
	}
	#t = U(() => this.root.value.current ? this.root.value.current.toString() : "");
	get isoValue() {
		return C(this.#t);
	}
	set isoValue(e) {
		N(this.#t, e);
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
		return C(this.#n);
	}
	set props(e) {
		N(this.#n, e);
	}
}, pc = class {
	opts;
	root;
	announcer;
	part;
	config;
	attachment;
	constructor(e, t, n, r) {
		this.opts = e, this.root = t, this.part = n, this.config = r, this.announcer = t.announcer, this.onkeydown = this.onkeydown.bind(this), this.onfocusout = this.onfocusout.bind(this), this.attachment = ve(e.ref);
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
		e.ctrlKey || e.metaKey || this.root.disabled.current || (this.part !== "hour" && this.part !== "minute" && this.part !== "second" || this.part in t) && (e.key !== "Tab" && e.preventDefault(), So(e.key) && (Tc(e.key) ? this.#i(t) : Ec(e.key) ? this.#a(t) : Be(e.key) ? this.#o(e) : Dc(e.key) ? this.#s(e) : Lo(e.key) && jo(e, this.root.getFieldNode())));
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
		}), n && Fo(e, this.root.getFieldNode());
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
		}), n && Io(e, this.root.getFieldNode());
	}
	onfocusout(e) {
		let t = this.part;
		t in this.root.states && (this.root.states[t].hasLeftFocus = !0), this.config.padZero && this.root.updateSegment(this.part, (e) => e && e.length === 1 ? `0${e}` : e);
	}
	getSegmentProps() {
		let e = this.root.segmentValues, t = this.root.placeholder.current, n = e[this.part] === null, r = fo(this.part) ? Do(this.part, t, e) : t;
		e[this.part] && (r = r.set({ [this.part]: Number.parseInt(e[this.part]) }));
		let i = r[this.part];
		if (this.part === "day" && !ke(e.day) && ke(e.month)) {
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
		return C(this.#c);
	}
	set props(e) {
		N(this.#c, e);
	}
}, mc = class extends pc {
	#e = [];
	#t = 0;
	constructor(e, t) {
		super(e, t, "year", cc.year);
	}
	onkeydown(e) {
		e.ctrlKey || e.metaKey || this.root.disabled.current || (e.key !== "Tab" && e.preventDefault(), So(e.key) && (Tc(e.key) || Ec(e.key) ? (this.#n(), super.onkeydown(e)) : Be(e.key) ? this.#i(e) : Dc(e.key) ? this.#a(e) : Lo(e.key) && jo(e, this.root.getFieldNode())));
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
			if (String(i).length < 4) return this.#t > 0 && this.#e.length <= this.#t && r.length <= 4 ? (this.announcer.announce(i), r.length === 4 && (t = !0), r) : (this.announcer.announce(i), Oc(i));
			this.announcer.announce(i), t = !0;
			let a = `${i}`;
			return a.length > 4 ? a.slice(0, 4) : a;
		}), this.#e.length === 4 && (t = !0), t && Fo(e, this.root.getFieldNode());
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
		}), t && Io(e, this.root.getFieldNode());
	}
	onfocusout(e) {
		this.root.states.year.hasLeftFocus = !0, this.#e = [], this.#n(), this.root.updateSegment("year", (e) => e && e.length !== 4 ? Oc(Number.parseInt(e)) : e);
	}
}, hc = class extends pc {
	constructor(e, t) {
		super(e, t, "day", cc.day);
	}
}, gc = class extends pc {
	constructor(e, t) {
		super(e, t, "month", cc.month);
	}
}, _c = class extends pc {
	constructor(e, t) {
		super(e, t, "hour", cc.hour);
	}
	onkeydown(e) {
		let t = this.root.segmentValues;
		(Be(e.key) || Dc(e.key)) && this.root.dayPeriodNode && bo(t) && (this.root.hourInputDayPeriodHint = t.dayPeriod), super.onkeydown(e), this.root.hourInputDayPeriodHint = null;
	}
}, vc = class extends pc {
	constructor(e, t) {
		super(e, t, "minute", cc.minute);
	}
}, yc = class extends pc {
	constructor(e, t) {
		super(e, t, "second", cc.second);
	}
}, bc = class e {
	static create(t) {
		return new e(t, lc.get());
	}
	opts;
	root;
	attachment;
	#e;
	constructor(e, t) {
		this.opts = e, this.root = t, this.#e = this.root.announcer, this.onkeydown = this.onkeydown.bind(this), this.attachment = ve(e.ref, (e) => this.root.dayPeriodNode = e);
	}
	onkeydown(e) {
		e.ctrlKey || e.metaKey || this.root.disabled.current || (e.key !== "Tab" && e.preventDefault(), wc(e.key) && (Tc(e.key) || Ec(e.key) ? this.root.updateSegment("dayPeriod", (e) => e === "AM" ? (this.#e.announce("PM"), "PM") : (this.#e.announce("AM"), "AM")) : (Dc(e.key) && (this.root.states.dayPeriod.hasLeftFocus = !1, this.root.updateSegment("dayPeriod", () => (this.#e.announce("AM"), "AM"))), e.key === "A" || e.key, this.root.updateSegment("dayPeriod", () => {
			let t = e.key === "A" || e.key === "a" ? "AM" : "PM";
			return this.#e.announce(t), t;
		}), Lo(e.key) && jo(e, this.root.getFieldNode()))));
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
		return C(this.#t);
	}
	set props(e) {
		N(this.#t, e);
	}
}, xc = class e {
	static create(t) {
		return new e(t, lc.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = ve(e.ref);
	}
	#e = U(() => ({
		id: this.opts.id.current,
		"aria-hidden": K(!0),
		...this.root.getBaseSegmentAttrs("literal", this.opts.id.current),
		...this.attachment
	}));
	get props() {
		return C(this.#e);
	}
	set props(e) {
		N(this.#e, e);
	}
}, Sc = class e {
	static create(t) {
		return new e(t, lc.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.onkeydown = this.onkeydown.bind(this), this.attachment = ve(e.ref);
	}
	onkeydown(e) {
		e.key !== "Tab" && e.preventDefault(), !this.root.disabled.current && Lo(e.key) && jo(e, this.root.getFieldNode());
	}
	#e = U(() => ({
		role: "textbox",
		id: this.opts.id.current,
		"aria-label": "timezone, ",
		style: { caretColor: "transparent" },
		onkeydown: this.onkeydown,
		...this.root.getBaseSegmentAttrs("timeZoneName", this.opts.id.current),
		"data-readonly": J(!0),
		...this.attachment
	}));
	get props() {
		return C(this.#e);
	}
	set props(e) {
		N(this.#e, e);
	}
}, Cc = class {
	static create(e, t) {
		let n = lc.get();
		switch (e) {
			case "day": return new hc(t, n);
			case "month": return new gc(t, n);
			case "year": return new mc(t, n);
			case "hour": return new _c(t, n);
			case "minute": return new vc(t, n);
			case "second": return new yc(t, n);
			case "dayPeriod": return new bc(t, n);
			case "literal": return new xc(t, n);
			case "timeZoneName": return new Sc(t, n);
		}
	}
};
function wc(e) {
	return So(e) || e === "A" || e === "P" || e === "a" || e === "p";
}
function Tc(e) {
	return e === Ve;
}
function Ec(e) {
	return e === He;
}
function Dc(e) {
	return e === Te;
}
function Oc(e) {
	let t = 4 - String(e).length;
	return `${"0".repeat(t)}${e}`;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/date-field/components/date-field-hidden-input.svelte
function kc(e, t) {
	H(t, !0);
	let n = fc.create();
	var i = h(), a = M(i), o = (e) => {
		An(e, y(() => n.props));
	};
	f(a, (e) => {
		n.shouldRender && e(o);
	}), m(e, i), r();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/date-field/components/date-field-input.svelte
var Ac = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"id",
	"ref",
	"name",
	"children",
	"child"
]), jc = a("<div><!></div>"), Mc = a("<!> <!>", 1);
function Nc(t, n) {
	let i = c();
	H(n, !0);
	let a = L(n, "id", 19, () => Pe(i)), o = L(n, "ref", 15, null), s = L(n, "name", 3, ""), l = k(n, Ac), u = dc.create({
		id: X(() => a()),
		ref: X(() => o(), (e) => o(e)),
		name: X(() => s())
	}), p = U(() => je(l, u.props));
	var g = Mc(), _ = M(g), v = (e) => {
		var t = h(), r = M(t);
		d(r, () => n.child, () => ({
			props: C(p),
			segments: u.root.segmentContents
		})), m(e, t);
	}, y = (t) => {
		var r = jc();
		E(r, () => ({ ...C(p) }));
		var i = x(r);
		d(i, () => n.children ?? A, () => ({ segments: u.root.segmentContents })), e(r), m(t, r);
	};
	f(_, (e) => {
		n.child ? e(v) : e(y, -1);
	}), kc(S(_, 2), {}), m(t, g), r();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/date-field/components/date-field-segment.svelte
var Pc = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"id",
	"ref",
	"children",
	"child",
	"part"
]), Fc = a("<span><!></span>");
function Ic(t, n) {
	let i = c();
	H(n, !0);
	let a = L(n, "id", 19, () => Pe(i)), o = L(n, "ref", 15, null), s = k(n, Pc), l = Cc.create(F(() => n.part), {
		id: X(() => a()),
		ref: X(() => o(), (e) => o(e))
	}), u = U(() => je(s, l.props));
	var p = h(), g = M(p), _ = (e) => {
		var t = h(), r = M(t);
		d(r, () => n.child, () => ({ props: C(u) })), m(e, t);
	}, v = (t) => {
		var r = Fc();
		E(r, () => ({ ...C(u) }));
		var i = x(r);
		d(i, () => n.children ?? A), e(r), m(t, r);
	};
	f(g, (e) => {
		n.child ? e(_) : e(v, -1);
	}), m(t, p), r();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/date-picker/date-picker.svelte.js
var Lc = new we("DatePicker.Root"), Rc = class e {
	static create(t) {
		return Lc.set(new e(t));
	}
	opts;
	constructor(e) {
		this.opts = e;
	}
};
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/date-picker/components/date-picker.svelte
function zc(e, t) {
	H(t, !0);
	let n = L(t, "open", 15, !1), i = L(t, "onOpenChange", 3, Re), a = L(t, "onOpenChangeComplete", 3, Re), o = L(t, "value", 15), s = L(t, "onValueChange", 3, Re), c = L(t, "placeholder", 15), u = L(t, "onPlaceholderChange", 3, Re), f = L(t, "isDateUnavailable", 3, () => !1), p = L(t, "validate", 3, Re), g = L(t, "onInvalid", 3, Re), _ = L(t, "disabled", 3, !1), v = L(t, "readonly", 3, !1), y = L(t, "readonlySegments", 19, () => []), b = L(t, "hideTimeZone", 3, !1), x = L(t, "required", 3, !1), S = L(t, "calendarLabel", 3, "Event"), C = L(t, "disableDaysOutsideMonth", 3, !0), w = L(t, "preventDeselect", 3, !1), T = L(t, "pagedNavigation", 3, !1), E = L(t, "weekdayFormat", 3, "narrow"), D = L(t, "isDateDisabled", 3, () => !1), O = L(t, "fixedWeeks", 3, !1), k = L(t, "numberOfMonths", 3, 1), j = L(t, "closeOnDateSelect", 3, !0), ee = L(t, "initialFocus", 3, !1), N = L(t, "monthFormat", 3, "long"), P = L(t, "yearFormat", 3, "numeric"), te = F(() => Aa({
		granularity: t.granularity,
		defaultValue: o(),
		minValue: t.minValue,
		maxValue: t.maxValue
	}));
	function I() {
		c() === void 0 && c(te);
	}
	I(), Oe.pre(() => c(), () => {
		I();
	});
	function ne() {
		j() && n(!1);
	}
	let R = Rc.create({
		open: X(() => n(), (e) => {
			n(e), i()(e);
		}),
		value: X(() => o(), (e) => {
			o(e), s()(e);
		}),
		placeholder: X(() => c() ?? te, (e) => {
			c(e), u()(e);
		}),
		isDateUnavailable: X(() => f()),
		minValue: X(() => t.minValue),
		maxValue: X(() => t.maxValue),
		disabled: X(() => _()),
		readonly: X(() => v()),
		granularity: X(() => t.granularity),
		readonlySegments: X(() => y()),
		hourCycle: X(() => t.hourCycle),
		locale: Ze(() => t.locale),
		hideTimeZone: X(() => b()),
		required: X(() => x()),
		calendarLabel: X(() => S()),
		disableDaysOutsideMonth: X(() => C()),
		preventDeselect: X(() => w()),
		pagedNavigation: X(() => T()),
		weekStartsOn: X(() => t.weekStartsOn),
		weekdayFormat: X(() => E()),
		isDateDisabled: X(() => D()),
		fixedWeeks: X(() => O()),
		numberOfMonths: X(() => k()),
		initialFocus: X(() => ee()),
		onDateSelect: X(() => ne),
		defaultPlaceholder: te,
		monthFormat: X(() => N()),
		yearFormat: X(() => P())
	});
	Wn.create({
		open: R.opts.open,
		onOpenChangeComplete: X(() => a())
	}), uc.create({
		value: R.opts.value,
		disabled: R.opts.disabled,
		readonly: R.opts.readonly,
		readonlySegments: R.opts.readonlySegments,
		validate: X(() => p()),
		onInvalid: X(() => g()),
		minValue: R.opts.minValue,
		maxValue: R.opts.maxValue,
		granularity: R.opts.granularity,
		hideTimeZone: R.opts.hideTimeZone,
		hourCycle: R.opts.hourCycle,
		locale: R.opts.locale,
		required: R.opts.required,
		placeholder: R.opts.placeholder,
		errorMessageId: X(() => t.errorMessageId),
		isInvalidProp: X(() => void 0)
	});
	var z = h(), re = M(z);
	l(re, () => $, (e, n) => {
		n(e, {
			children: (e, n) => {
				var r = h(), i = M(r);
				d(i, () => t.children ?? A), m(e, r);
			},
			$$slots: { default: !0 }
		});
	}), m(e, z), r();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/date-picker/components/date-picker-calendar.svelte
var Bc = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"children",
	"child",
	"id",
	"ref"
]), Vc = a("<div><!></div>");
function Hc(t, n) {
	let i = c();
	H(n, !0);
	let a = L(n, "id", 19, () => Pe(i)), o = L(n, "ref", 15, null), s = k(n, Bc), l = Lc.get(), u = hs.create({
		id: X(() => a()),
		ref: X(() => o(), (e) => o(e)),
		calendarLabel: l.opts.calendarLabel,
		fixedWeeks: l.opts.fixedWeeks,
		isDateDisabled: l.opts.isDateDisabled,
		isDateUnavailable: l.opts.isDateUnavailable,
		locale: l.opts.locale,
		numberOfMonths: l.opts.numberOfMonths,
		pagedNavigation: l.opts.pagedNavigation,
		preventDeselect: l.opts.preventDeselect,
		readonly: l.opts.readonly,
		type: X(() => "single"),
		weekStartsOn: l.opts.weekStartsOn,
		weekdayFormat: l.opts.weekdayFormat,
		disabled: l.opts.disabled,
		disableDaysOutsideMonth: l.opts.disableDaysOutsideMonth,
		maxValue: l.opts.maxValue,
		minValue: l.opts.minValue,
		placeholder: l.opts.placeholder,
		value: l.opts.value,
		onDateSelect: l.opts.onDateSelect,
		initialFocus: l.opts.initialFocus,
		defaultPlaceholder: l.opts.defaultPlaceholder,
		maxDays: X(() => void 0),
		monthFormat: l.opts.monthFormat,
		yearFormat: l.opts.yearFormat
	}), p = U(() => je(s, u.props));
	var g = h(), _ = M(g), v = (e) => {
		var t = h(), r = M(t);
		{
			let e = U(() => ({
				props: C(p),
				...u.snippetProps
			}));
			d(r, () => n.child, () => C(e));
		}
		m(e, t);
	}, y = (t) => {
		var r = Vc();
		E(r, () => ({ ...C(p) }));
		var i = x(r);
		d(i, () => n.children ?? A, () => u.snippetProps), e(r), m(t, r);
	};
	f(_, (e) => {
		n.child ? e(v) : e(y, -1);
	}), m(t, g), r();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/date-picker/components/date-picker-content.svelte
var Uc = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"ref",
	"onOpenAutoFocus"
]);
function Wc(e, t) {
	H(t, !0);
	let n = L(t, "ref", 15, null), i = k(t, Uc), a = U(() => je({ onOpenAutoFocus: t.onOpenAutoFocus }, { onOpenAutoFocus: ss }));
	Kn(e, y(() => C(a), () => i, {
		get ref() {
			return n();
		},
		set ref(e) {
			n(e);
		}
	})), r();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/date-picker/components/date-picker-trigger.svelte
var Gc = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"ref",
	"onkeydown"
]);
function Kc(e, t) {
	H(t, !0);
	let n = L(t, "ref", 15, null), i = k(t, Gc);
	function a(e) {
		if (Lo(e.key)) {
			let t = e.currentTarget.closest(sc.selector("input"));
			if (!t) return;
			jo(e, t);
		}
	}
	let o = U(() => je({ onkeydown: t.onkeydown }, { onkeydown: a }));
	Jn(e, y(() => i, { "data-segment": "trigger" }, () => C(o), {
		get ref() {
			return n();
		},
		set ref(e) {
			n(e);
		}
	})), r();
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostHistoryRecordActionItems.svelte
var qc = a("<div class=\"copy-icon svg-icon\" aria-hidden=\"true\"></div> <span> </span>", 1), Jc = a("<div class=\"raw-json-icon svg-icon\" aria-hidden=\"true\"></div> <span> </span>", 1), Yc = a("<!> <!>", 1), Xc = a("<div class=\"open-in-new-icon svg-icon\" aria-hidden=\"true\"></div> <span> </span>", 1), Zc = a("<div class=\"broadcast-icon svg-icon\" aria-hidden=\"true\"></div> <span> </span>", 1), Qc = a("<div class=\"trash-icon svg-icon\" aria-hidden=\"true\"></div> <span> </span>", 1), $c = a("<!> <!> <!> <!>", 1), el = {
	hash: "svelte-8tu42h",
	code: ".open-in-new-icon {mask-image:var(--ehagaki-icon-6f70656e5f696e5f6e65775f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}"
};
function tl(e, n) {
	H(n, !0), j(e, el);
	let i = () => R(Fe, "$_", a), [a, o] = te(), s = (e) => {
		var r = h(), a = M(r);
		l(a, () => Cn, (e, r) => {
			r(e, {
				class: "menu-action-button",
				get onpointerdown() {
					return n.onCopyPointerDown;
				},
				get onSelect() {
					return n.onCopyNevent;
				},
				children: (e, r) => {
					var a = qc(), o = S(M(a), 2), s = B(o, !0);
					b((e) => t(s, e), [() => n.copyFailed ? i()("postHistory.copyFailed") : i()("postHistory.copyNevent")]), m(e, a);
				},
				$$slots: { default: !0 }
			});
		}), m(e, r);
	}, c = (e) => {
		var r = Yc(), a = M(r), o = (e) => {
			Nr(e, {
				get pending() {
					return g();
				},
				get onSelect() {
					return p();
				}
			});
		};
		f(a, (e) => {
			p() && e(o);
		});
		var s = S(a, 2);
		l(s, () => Cn, (e, r) => {
			r(e, {
				class: "menu-action-button",
				onSelect: () => n.onShowRawJson(),
				children: (e, n) => {
					var r = Jc(), a = S(M(r), 2), o = B(a, !0);
					b((e) => t(o, e), [() => i()("postHistory.rawJson")]), m(e, r);
				},
				$$slots: { default: !0 }
			});
		}), m(e, r);
	}, u = L(n, "externalClientLabel", 3, void 0), d = L(n, "onOpenExternalClient", 3, void 0), p = L(n, "onRepost", 3, void 0), g = L(n, "repostPending", 3, !1);
	var _ = $c(), v = M(_), y = (e) => {
		var n = Yc(), r = M(n);
		l(r, () => Cn, (e, n) => {
			n(e, {
				class: "menu-action-button",
				get onSelect() {
					return d();
				},
				children: (e, n) => {
					var r = Xc(), i = S(M(r), 2), a = B(i, !0);
					b(() => t(a, u())), m(e, r);
				},
				$$slots: { default: !0 }
			});
		});
		var i = S(r, 2);
		l(i, () => wn, (e, t) => {
			t(e, { class: "post-history-menu-separator" });
		}), m(e, n);
	};
	f(v, (e) => {
		u() && d() && e(y);
	});
	var x = S(v, 2), C = (e) => {
		var t = Yc(), n = M(t);
		c(n);
		var r = S(n, 2);
		s(r), m(e, t);
	}, w = (e) => {
		var t = Yc(), n = M(t);
		s(n);
		var r = S(n, 2);
		c(r), m(e, t);
	};
	f(x, (e) => {
		n.order === "raw-json-first" ? e(C) : e(w, -1);
	});
	var T = S(x, 2), E = (e) => {
		var r = h(), a = M(r);
		l(a, () => Cn, (e, r) => {
			r(e, {
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
					var r = Zc(), a = S(M(r), 2), o = B(a, !0);
					b((e) => t(o, e), [() => i()("postHistory.broadcast")]), m(e, r);
				},
				$$slots: { default: !0 }
			});
		}), m(e, r);
	};
	f(T, (e) => {
		n.showBroadcast && e(E);
	});
	var D = S(T, 2), O = (e) => {
		var r = Yc(), a = M(r), o = (e) => {
			var t = h(), n = M(t);
			l(n, () => wn, (e, t) => {
				t(e, { class: "post-history-menu-separator" });
			}), m(e, t);
		};
		f(a, (e) => {
			n.showDeleteSeparator && e(o);
		});
		var s = S(a, 2);
		l(s, () => Cn, (e, r) => {
			r(e, {
				class: "menu-action-button menu-action-button-danger",
				get disabled() {
					return n.deletionSending;
				},
				onSelect: () => n.onOpenDeleteConfirm(),
				children: (e, r) => {
					var a = Qc(), o = S(M(a), 2), s = B(o, !0);
					b((e) => t(s, e), [() => n.deletionSending ? i()("postHistory.deleteSending") : i()("postHistory.delete")]), m(e, a);
				},
				$$slots: { default: !0 }
			});
		}), m(e, r);
	};
	f(D, (e) => {
		n.showDelete && e(O);
	}), m(e, _), r(), o();
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostHistoryQuotePreview.svelte
var nl = a("<article class=\"post-history-quote-status-card svelte-1rnem6w\"><div class=\"post-history-quote-status-body svelte-1rnem6w\"><p> </p> <!></div></article>"), rl = {
	hash: "svelte-1rnem6w",
	code: ".post-history-quote-status-card.svelte-1rnem6w {display:grid;border-inline-start:2px solid\n            color-mix(in srgb, var(--theme), transparent 45%);background:color-mix(in srgb, var(--dialog-bg), var(--border-hr) 24%);color:var(--text);font-size:0.9rem;}.post-history-quote-status-body.svelte-1rnem6w {display:grid;gap:8px;padding:2px 10px 10px;}.post-history-quote-status-message.svelte-1rnem6w {margin:0;color:var(--text-muted);line-height:1.45;}.post-history-quote-status-error.svelte-1rnem6w {color:var(--danger);}.post-history-quote-retry-button {justify-self:start;}"
};
function il(n, i) {
	H(i, !0), j(n, rl);
	let a = () => R(Fe, "$_", o), [o, s] = te(), c = L(i, "model", 3, void 0), l = L(i, "loadSensitiveBody", 3, void 0), u = L(i, "emojiLoadStateByUrl", 19, () => ({})), d = L(i, "emojiImageMetaByUrl", 19, () => ({})), p = L(i, "scrollRoot", 3, null), g = L(i, "onImageOpen", 3, void 0), _ = L(i, "onRetry", 3, void 0), v = L(i, "footerActions", 3, void 0), y = L(i, "footerDetails", 3, void 0), C = L(i, "footerMenu", 3, void 0);
	function w() {
		switch (i.preview.status) {
			case "deleted": return a()("postHistory.quoteDeleted");
			case "not-found": return a()("postHistory.quoteNotFound");
			case "error": return a()("postHistory.quoteFetchFailed");
			default: return a()("postHistory.quoteLoading");
		}
	}
	var T = h(), E = M(T), D = (e) => {
		cr(e, {
			get event() {
				return i.preview.event;
			},
			get profile() {
				return i.preview.profile;
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
				return d();
			},
			get scrollRoot() {
				return p();
			},
			get onImageOpen() {
				return g();
			},
			get footerActions() {
				return v();
			},
			get footerDetails() {
				return y();
			},
			get footerMenu() {
				return C();
			}
		});
	}, O = (n) => {
		var r = nl(), o = x(r), s = x(o);
		let c;
		var l = B(s, !0), u = S(s, 2), d = (e) => {
			Xe(e, {
				type: "button",
				className: "post-history-quote-retry-button",
				onClick: () => _()?.(i.preview.eventId),
				children: (e, n) => {
					ee();
					var r = ne();
					b((e) => t(r, e), [() => a()("postHistory.contextRetry")]), m(e, r);
				},
				$$slots: { default: !0 }
			});
		};
		f(u, (e) => {
			i.preview.status === "error" && e(d);
		}), e(o), e(r), b((e) => {
			c = V(s, 1, "post-history-quote-status-message svelte-1rnem6w", null, c, { "post-history-quote-status-error": i.preview.status === "error" }), t(l, e);
		}, [() => w()]), m(n, r);
	};
	f(E, (e) => {
		i.preview.status === "resolved" ? e(D) : e(O, -1);
	}), m(n, T), r(), s();
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryOperationWakeLock.ts
function al() {
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
var ol = al();
// D:/ドキュメント/GitHub/ehagaki/src/lib/storage/postHistoryImportedRangesRepository.ts
function sl(e, t, n) {
	return e?.schemaVersion === 1 && e.source === "citrine-backup" && e.ownerPubkeyHex === t && e.kindsKey === n && Array.isArray(e.ranges) ? yt(e.ranges) : [];
}
var cl = "postHistoryImportedRanges:", ll = new class {
	db;
	now;
	constructor(e = yn, t = Date.now) {
		this.db = e, this.now = t;
	}
	async get(e, t) {
		return this.db.transaction("r", this.db.postHistoryCitrineRanges, this.db.postHistoryWriteGeneration, async () => {
			let n = await ht(this.db, e), r = (await this.db.postHistoryCitrineRanges.get(`${cl}${e}:${t}`))?.value, i = sl(r, e, t);
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
			await xt(this.db, e);
			let t = await this.get(e.ownerPubkeyHex, e.kindsKey), n = yt([...t.ranges, e.range]);
			if (JSON.stringify(n) === JSON.stringify(t.ranges)) return !1;
			let r = await ht(this.db, e.ownerPubkeyHex);
			return await this.db.postHistoryCitrineRanges.put({
				id: `${cl}${e.ownerPubkeyHex}:${e.kindsKey}`,
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
			}), await xt(this.db, e), !0;
		});
	}
}(), ul = 250, dl = /^[0-9a-f]{64}$/;
function fl() {
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
function pl(e) {
	return { ...e };
}
function ml(e) {
	return e.tags.filter((e) => e[0] === "e" && typeof e[1] == "string" && dl.test(e[1])).length;
}
var hl = new class {
	verificationSessionFactory;
	getLocalRevision;
	importedRangesRepository;
	postHistoryRepository;
	deletionRequestsRepository;
	sensitivePayloadRepository;
	constructor(e = {}) {
		this.verificationSessionFactory = e.verificationSessionFactory ?? Ot, this.getLocalRevision = e.getLocalRevision ?? ((e) => ht(yn, e)), this.importedRangesRepository = e.importedRangesRepository ?? ll, this.postHistoryRepository = e.postHistoryRepository ?? Q, this.deletionRequestsRepository = e.deletionRequestsRepository ?? Jt, this.sensitivePayloadRepository = e.sensitivePayloadRepository ?? kt;
	}
	async importFile(e) {
		let t = fl(), n = /* @__PURE__ */ new Set(), r = [], i = !1, a = !1, o = !1, s = null, c = null, l = !0, u = 0, d = /^citrine-([1-9]\d*)\.jsonl$/.exec(e.file.name ?? "")?.[1], f = d !== void 0 && Number.isSafeInteger(Number(d)) && Number(d) <= 864e13, p = Math.floor(Math.min(Number(d), Date.now()) / 1e3), m = null, h = Number.isFinite(e.file.size) && e.file.size > 0 ? e.file.size : 0, g = 0, _ = () => t.invalidJsonCount > 0 || t.invalidStructureCount > 0 || t.invalidIdOrSignatureCount > 0, v = () => e.signal?.aborted ? "cancelled" : e.getCurrentPubkeyHex() === e.ownerPubkeyHex ? o ? t.nonEmptyLineCount > 0 ? "partial" : "failed" : a ? "cancelled" : null : "account-changed", y = (n = !1) => {
			if (!e.onProgress) return;
			let r = performance.now();
			!n && m !== null && r - m < ul || (m = r, e.onProgress({
				result: pl(t),
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
				if (!ce(n)) return Promise.resolve({
					type: "rejected",
					counter: "invalidStructureCount"
				});
				let r = n;
				return r.pubkey === e.ownerPubkeyHex ? !vt(r.kind) && ![36, 5].includes(r.kind) ? Promise.resolve({
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
					else if (vt(o.kind)) t.uniquePostEventCount += 1, !Number.isSafeInteger(o.created_at) || o.created_at < 0 || o.created_at >= 2 ** 53 - 1 ? l = !1 : o.created_at <= p && (s = Math.min(s ?? o.created_at, o.created_at), c = Math.max(c ?? o.created_at, o.created_at)), r.push({
						type: "post",
						...a
					});
					else if (o.kind === 5) {
						t.uniqueDeletionEventCount += 1;
						let e = ml(o);
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
			let M = new TextDecoder("utf-8", { fatal: !0 }), N = "", P = !1, F = (e, t = !1) => {
				try {
					return M.decode(e, { stream: t });
				} catch (e) {
					throw P = !0, e;
				}
			};
			try {
				for (;;) {
					O();
					let e;
					try {
						e = await x.read();
					} catch (e) {
						throw P = !0, e;
					}
					if (O(), e.done) {
						N += F(), N.length > 0 && await j(() => E(N.replace(/\r$/, "")));
						break;
					}
					u += e.value.byteLength, N += F(e.value, !0);
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
				if (w(), await g(), P && !S && !v()) try {
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
			let te = await T();
			if (te) return t.status = te, y(!0), t;
			if (S) return t.status = "partial", y(!0), t;
			if (t.status = i || _() ? "partial" : "completed", f && t.status === "completed" && u === h && l && s !== null && c !== null && t.insertedPostCount + t.updatedPostCount + t.unchangedPostCount === t.uniquePostEventCount) try {
				t.restoredRangeChanged = await this.importedRangesRepository.record({
					...m,
					kindsKey: Gn([...ft]),
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
}(), gl = a("<div class=\"xmark-icon svg-icon svelte-1qfqhib\" aria-hidden=\"true\"></div>"), _l = a("<span class=\"import-icon svg-icon svelte-1qfqhib\" aria-hidden=\"true\"></span> <span> </span>", 1), vl = a("<div aria-live=\"polite\"> </div>"), yl = a("<div class=\"import-progress-indicator\"></div>"), bl = a("<div class=\"import-progress svelte-1qfqhib\"><!> <div class=\"import-progress-summary svelte-1qfqhib\"><span class=\"import-progress-metric svelte-1qfqhib\"><span> </span> <span class=\"import-progress-number svelte-1qfqhib\"> </span></span> <span class=\"import-progress-metric svelte-1qfqhib\"><span> </span> <span class=\"import-progress-number svelte-1qfqhib\"> </span></span> <span class=\"import-progress-metric svelte-1qfqhib\"><span> </span> <span class=\"import-progress-number svelte-1qfqhib\"> </span></span></div> <!></div>"), xl = a("<div class=\"import-results svelte-1qfqhib\"><section aria-labelledby=\"post-history-import-input-heading\" class=\"svelte-1qfqhib\"><h3 id=\"post-history-import-input-heading\" class=\"svelte-1qfqhib\"> </h3> <dl class=\"svelte-1qfqhib\"><div class=\"svelte-1qfqhib\"><dt class=\"svelte-1qfqhib\"> </dt><dd class=\"svelte-1qfqhib\"> </dd></div> <div class=\"svelte-1qfqhib\"><dt class=\"svelte-1qfqhib\"> </dt><dd class=\"svelte-1qfqhib\"> </dd></div> <div class=\"svelte-1qfqhib\"><dt class=\"svelte-1qfqhib\"> </dt><dd class=\"svelte-1qfqhib\"> </dd></div> <div class=\"svelte-1qfqhib\"><dt class=\"svelte-1qfqhib\"> </dt><dd class=\"svelte-1qfqhib\"> </dd></div> <div class=\"svelte-1qfqhib\"><dt class=\"svelte-1qfqhib\"> </dt><dd class=\"svelte-1qfqhib\"> </dd></div> <div class=\"svelte-1qfqhib\"><dt class=\"svelte-1qfqhib\"> </dt><dd class=\"svelte-1qfqhib\"> </dd></div> <div class=\"svelte-1qfqhib\"><dt class=\"svelte-1qfqhib\"> </dt><dd class=\"svelte-1qfqhib\"> </dd></div></dl></section> <section aria-labelledby=\"post-history-import-post-heading\" class=\"svelte-1qfqhib\"><h3 id=\"post-history-import-post-heading\" class=\"svelte-1qfqhib\"> </h3> <dl class=\"svelte-1qfqhib\"><div class=\"svelte-1qfqhib\"><dt class=\"svelte-1qfqhib\"> </dt><dd class=\"svelte-1qfqhib\"> </dd></div> <div class=\"svelte-1qfqhib\"><dt class=\"svelte-1qfqhib\"> </dt><dd class=\"svelte-1qfqhib\"> </dd></div> <div class=\"svelte-1qfqhib\"><dt class=\"svelte-1qfqhib\"> </dt><dd class=\"svelte-1qfqhib\"> </dd></div> <div class=\"svelte-1qfqhib\"><dt class=\"svelte-1qfqhib\"> </dt><dd class=\"svelte-1qfqhib\"> </dd></div> <div class=\"svelte-1qfqhib\"><dt class=\"svelte-1qfqhib\"> </dt><dd class=\"svelte-1qfqhib\"> </dd></div> <div class=\"svelte-1qfqhib\"><dt class=\"svelte-1qfqhib\"> </dt><dd class=\"svelte-1qfqhib\"> </dd></div></dl></section> <section aria-labelledby=\"post-history-import-deletion-heading\" class=\"svelte-1qfqhib\"><h3 id=\"post-history-import-deletion-heading\" class=\"svelte-1qfqhib\"> </h3> <dl class=\"svelte-1qfqhib\"><div class=\"svelte-1qfqhib\"><dt class=\"svelte-1qfqhib\"> </dt><dd class=\"svelte-1qfqhib\"> </dd></div> <div class=\"svelte-1qfqhib\"><dt class=\"svelte-1qfqhib\"> </dt><dd class=\"svelte-1qfqhib\"> </dd></div> <div class=\"svelte-1qfqhib\"><dt class=\"svelte-1qfqhib\"> </dt><dd class=\"svelte-1qfqhib\"> </dd></div> <div class=\"svelte-1qfqhib\"><dt class=\"svelte-1qfqhib\"> </dt><dd class=\"svelte-1qfqhib\"> </dd></div> <div class=\"svelte-1qfqhib\"><dt class=\"svelte-1qfqhib\"> </dt><dd class=\"svelte-1qfqhib\"> </dd></div> <div class=\"svelte-1qfqhib\"><dt class=\"svelte-1qfqhib\"> </dt><dd class=\"svelte-1qfqhib\"> </dd></div> <div class=\"svelte-1qfqhib\"><dt class=\"svelte-1qfqhib\"> </dt><dd class=\"svelte-1qfqhib\"> </dd></div></dl></section></div>"), Sl = a("<div class=\"import-heading svelte-1qfqhib\"><h2 class=\"svelte-1qfqhib\"> </h2> <p class=\"svelte-1qfqhib\"> </p></div> <input class=\"visually-hidden import-file-input\" type=\"file\"/> <div role=\"presentation\"><!> <p class=\"import-drop-hint svelte-1qfqhib\"> </p></div> <!> <!>", 1), Cl = {
	hash: "svelte-1qfqhib",
	code: ".import-heading.svelte-1qfqhib {width:100%;text-align:left;}.import-heading.svelte-1qfqhib h2:where(.svelte-1qfqhib),\n    .import-heading.svelte-1qfqhib p:where(.svelte-1qfqhib) {margin:0;}.import-heading.svelte-1qfqhib h2:where(.svelte-1qfqhib) {font-size:1.1rem;}.import-heading.svelte-1qfqhib p:where(.svelte-1qfqhib) {margin-top:6px;color:var(--text-muted);font-size:0.88rem;line-height:1.5;}.post-history-import-file-button {margin-top:0;}.import-drop-zone.svelte-1qfqhib {width:100%;margin-top:16px;padding:0;border:1px dashed transparent;border-radius:10px;text-align:center;transition:background-color 120ms ease, border-color 120ms ease;}.import-drop-zone-active.svelte-1qfqhib {border-color:var(--accent-color);background:color-mix(in srgb, var(--accent-color), transparent 90%);}.import-drop-hint.svelte-1qfqhib {display:none;margin:8px 0 0;color:var(--text-muted);font-size:0.8rem;}\n\n    @media (hover: hover) and (pointer: fine) {.import-drop-zone.svelte-1qfqhib {min-height:136px;box-sizing:border-box;padding:20px 16px 28px;}.import-drop-hint.svelte-1qfqhib {display:block;}\n    }.import-icon.svelte-1qfqhib {mask-image:var(--ehagaki-icon-636c6f75645f646f776e6c6f61645f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.xmark-icon.svelte-1qfqhib {mask-image:var(--ehagaki-icon-636c6f73655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.import-progress.svelte-1qfqhib {width:100%;margin-top:12px;}.import-progress-status.svelte-1qfqhib {margin-bottom:8px;color:var(--text);font-size:0.9rem;}.import-progress-status-error.svelte-1qfqhib {color:var(--error-color, #d32f2f);}.import-progress-summary.svelte-1qfqhib {display:grid;grid-template-columns:repeat(3, minmax(0, 1fr));gap:8px;margin-bottom:8px;color:var(--text-muted);font-size:0.82rem;font-variant-numeric:tabular-nums;}.import-progress-metric.svelte-1qfqhib {display:flex;flex-direction:column;align-items:center;gap:3px;min-width:0;}.import-progress-number.svelte-1qfqhib {color:var(--text);text-align:center;}.import-progress-root {width:100%;height:12px;border-radius:999px;background-color:color-mix(in srgb, var(--text) 12%, transparent);overflow:hidden;}.import-progress-indicator {width:100%;height:100%;border-radius:inherit;background-color:var(--theme);transition:translate 0.3s ease;}\n\n    @media (prefers-reduced-motion: reduce) {.import-progress-indicator {transition:none;}\n    }.import-results.svelte-1qfqhib {display:grid;grid-template-columns:repeat(3, minmax(0, 1fr));gap:8px;width:100%;margin-top:12px;}.import-results.svelte-1qfqhib section:where(.svelte-1qfqhib) {min-width:0;padding:10px;border:1px solid var(--border-hr);border-radius:8px;}.import-results.svelte-1qfqhib h3:where(.svelte-1qfqhib) {margin:0 0 8px;font-size:0.9rem;}.import-results.svelte-1qfqhib dl:where(.svelte-1qfqhib),\n    .import-results.svelte-1qfqhib dl:where(.svelte-1qfqhib) div:where(.svelte-1qfqhib) {margin:0;}.import-results.svelte-1qfqhib dl:where(.svelte-1qfqhib) div:where(.svelte-1qfqhib) {display:flex;justify-content:space-between;gap:8px;padding-block:3px;font-size:0.8rem;}.import-results.svelte-1qfqhib dt:where(.svelte-1qfqhib) {min-width:0;color:var(--text-muted);}.import-results.svelte-1qfqhib dd:where(.svelte-1qfqhib) {flex:0 0 auto;font-variant-numeric:tabular-nums;}.post-history-import-dialog {max-width:min(760px, calc(100% - 10px));}\n\n    @media (max-width: 680px) {.import-progress-summary.svelte-1qfqhib {grid-template-columns:1fr;}.import-progress-metric.svelte-1qfqhib {flex-direction:row;justify-content:space-between;gap:6px;}.import-progress-number.svelte-1qfqhib {text-align:right;}.import-results.svelte-1qfqhib {grid-template-columns:1fr;}\n    }"
};
function wl(i, a) {
	H(a, !0), j(i, Cl);
	let o = () => R(Fe, "$_", s), [s, c] = te(), u = L(a, "open", 15, !1), d = L(a, "onOpenChange", 3, void 0), p = L(a, "onImported", 3, void 0), v = D(null), E = D(!1), O = D(null), k = D(null), A = D(0), ee = D(0), P = D(0), F = D(T([])), ne = D(0), z = null, ie = null, oe = null, se = 0, ce = null, W = !1, le = null, ue = U(() => C(k)?.processedBytes ?? C(A)), de = U(() => C(k)?.totalBytes ?? C(ee)), fe = U(() => C(de) <= 0 ? 0 : Math.min(100, Math.max(0, Math.round(C(ue) / C(de) * 100)))), pe = U(() => {
		let e = C(F)[0], t = C(F).at(-1);
		if (!e || !t || C(F).length < 3 || t.elapsedMs - e.elapsedMs < 2e3 || C(P) - t.elapsedMs > 1e4 || C(ue) <= 0 || C(de) <= 0 || C(ue) >= C(de) || C(P) <= e.elapsedMs) return null;
		let n = (t.bytes - e.bytes) / (C(P) - e.elapsedMs), r = (C(de) - C(ue)) / n;
		return Number.isFinite(r) && r >= 0 ? r : null;
	}), me = U(() => C(E) ? C(pe) === null ? o()("postHistory.importRemainingTimeCalculating") : he(C(pe)) : C(O)?.status === "completed" || C(O)?.status === "partial" ? he(0) : o()("postHistory.importRemainingTimeUnavailable"));
	function he(e) {
		let t = Math.max(0, Math.floor(e / 1e3)), n = String(t % 60).padStart(2, "0"), r = Math.floor(t / 60), i = r % 60;
		return r < 60 ? `${i}:${n}` : `${Math.floor(r / 60)}:${String(i).padStart(2, "0")}:${n}`;
	}
	function G() {
		oe !== null && N(P, Math.max(0, performance.now() - oe), !0);
	}
	function ge() {
		ie !== null && (clearInterval(ie), ie = null), oe = null;
	}
	function _e() {
		ge(), N(P, 0), oe = performance.now(), ie = setInterval(G, 1e3);
	}
	function ve() {
		ge(), N(k, null), N(A, 0), N(ee, 0), N(P, 0), N(F, [], !0);
	}
	function ye(e) {
		if (e.result.insertedPostCount + e.result.updatedPostCount + e.result.unchangedPostCount + e.result.insertedDeletionRequestCount + e.result.updatedDeletionRequestCount + e.result.unchangedDeletionRequestCount + e.result.savedPayloadCandidateCount === 0 || (C(F).at(-1)?.elapsedMs ?? -1) >= C(P)) return;
		let t = [...C(F), {
			elapsedMs: C(P),
			bytes: e.processedBytes
		}];
		for (; t.length > 1 && t[1].elapsedMs <= C(P) - 1e4;) t.shift();
		N(F, t, !0);
	}
	function be(e) {
		return `translate: -${100 - e}% 0;`;
	}
	let xe = U(() => C(E) ? "postHistory.importReading" : C(O) ? C(O).status === "completed" ? "postHistory.importComplete" : C(O).status === "partial" ? C(O).restoredRangeSaveFailed ? "postHistory.importBackupRangeFailed" : "postHistory.importPartial" : C(O).status === "account-changed" ? "postHistory.importAccountChanged" : C(O).status === "cancelled" ? "postHistory.importCancelled" : "postHistory.importFailed" : null);
	function Se() {
		N(O, null), N(E, !1), ve(), N(ne, 0), z = null, C(v) && (C(v).value = "");
	}
	function Ce() {
		le?.(), le = null, se += 1, z?.abort(), z = null, N(E, !1), ve(), N(ne, 0);
	}
	function K(e) {
		e || Ce(), d()?.(e);
	}
	function we() {
		!C(E) && a.ownerPubkeyHex && C(v)?.click();
	}
	function q(e) {
		return e ? Array.from(e.types).includes("Files") || e.files.length > 0 : !1;
	}
	function Te(e) {
		q(e.dataTransfer) && (e.preventDefault(), N(ne, C(ne) + 1));
	}
	function Ee(e) {
		e.preventDefault(), q(e.dataTransfer);
	}
	function De(e) {
		(C(ne) !== 0 || q(e.dataTransfer)) && N(ne, Math.max(0, C(ne) - 1), !0);
	}
	function Oe(e) {
		if (e.preventDefault(), !q(e.dataTransfer)) return;
		N(ne, 0);
		let t = e.dataTransfer?.files[0];
		t && ke(t);
	}
	async function ke(e) {
		if (C(E) || !a.ownerPubkeyHex) return;
		let t = ++se, n = a.ownerPubkeyHex;
		ce = n;
		let r = new AbortController();
		z = r, N(E, !0), N(O, null), N(k, null), N(A, 0), N(ee, Number.isFinite(e.size) && e.size > 0 ? e.size : 0, !0), N(F, [], !0), _e();
		let i = ol.acquire();
		le = i;
		try {
			let i = await hl.importFile({
				file: e,
				ownerPubkeyHex: n,
				getCurrentPubkeyHex: a.getCurrentPubkeyHex,
				signal: r.signal,
				onProgress: (e) => {
					t === se && u() && (N(k, {
						result: { ...e.result },
						processedBytes: e.processedBytes,
						totalBytes: e.totalBytes
					}, !0), N(A, e.processedBytes, !0), N(ee, e.totalBytes, !0), N(O, { ...e.result }, !0), G(), ye(e));
				}
			});
			if (t !== se || !u() || (N(O, i, !0), a.getCurrentPubkeyHex() !== n || a.ownerPubkeyHex !== n)) return;
			if (i.localRevision !== void 0) try {
				if (await ht(yn, n) !== i.localRevision) return;
			} catch {
				return;
			}
			if (t !== se || !u() || a.getCurrentPubkeyHex() !== n) return;
			(i.insertedPostCount + i.updatedPostCount + i.appliedDeletionPostCount > 0 || i.restoredRangeChanged) && await p()?.(i);
		} finally {
			i(), le === i && (le = null), t === se && (N(E, !1), ge(), z = null);
		}
	}
	async function Ae(e) {
		let t = e.currentTarget, n = t.files?.[0];
		t.value = "", n && await ke(n);
	}
	I(() => {
		C(E) && a.ownerPubkeyHex !== ce && Ce();
	}), I(() => {
		u() && !W ? Se() : !u() && W && Ce(), W = u();
	}), re(() => {
		le?.(), le = null, se += 1, z?.abort(), ge();
	});
	{
		let r = (e) => {
			var t = h(), n = M(t);
			{
				let e = (e, t) => {
					let n = () => (t?.()).props;
					{
						let t = U(() => o()("global.close"));
						Xe(e, y(n, {
							className: "modal-close",
							shape: "square",
							get ariaLabel() {
								return C(t);
							},
							children: (e, t) => {
								var n = gl();
								m(e, n);
							},
							$$slots: { default: !0 }
						}));
					}
				};
				l(n, () => Mn, (t, n) => {
					n(t, {
						child: e,
						$$slots: { child: !0 }
					});
				});
			}
			m(e, t);
		}, s = U(() => o()("postHistory.importTitle")), c = U(() => o()("postHistory.importDescription"));
		jn(i, {
			onOpenChange: K,
			get title() {
				return C(s);
			},
			get description() {
				return C(c);
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
			footer: r,
			children: (r, i) => {
				var s = Sl(), c = M(s), u = x(c), d = B(u, !0), p = S(u, 2), h = B(p, !0);
				e(c);
				var y = S(c, 2);
				w(y, (e) => N(v, e), () => C(v));
				var T = S(y, 2);
				let D;
				var k = x(T);
				{
					let e = U(() => C(E) || !a.ownerPubkeyHex), n = U(() => o()("postHistory.importChooseFile"));
					Xe(k, {
						className: "post-history-import-file-button",
						variant: "default",
						shape: "pill",
						get disabled() {
							return C(e);
						},
						get ariaLabel() {
							return C(n);
						},
						onClick: we,
						children: (e, n) => {
							var r = _l(), i = S(M(r), 2), a = B(i, !0);
							b((e) => t(a, e), [() => o()("postHistory.importChooseFile")]), m(e, r);
						},
						$$slots: { default: !0 }
					});
				}
				var A = S(k, 2), j = B(A, !0);
				e(T);
				var ee = S(T, 2), F = (r) => {
					var i = bl(), a = x(i), s = (e) => {
						var n = vl();
						let r;
						var i = B(n, !0);
						b((e) => {
							r = V(n, 1, "import-progress-status svelte-1qfqhib", null, r, { "import-progress-status-error": C(O)?.status === "failed" }), t(i, e);
						}, [() => o()(C(xe))]), m(e, n);
					};
					f(a, (e) => {
						C(xe) && e(s);
					});
					var c = S(a, 2), u = x(c), d = x(u), p = B(d, !0), h = S(d, 2), g = B(h);
					e(u);
					var _ = S(u, 2), v = x(_), y = B(v, !0), w = S(v, 2), T = B(w, !0);
					e(_);
					var E = S(_, 2), D = x(E), k = B(D, !0), A = S(D, 2), j = B(A, !0);
					e(E), e(c);
					var ee = S(c, 2);
					{
						let e = U(() => o()("postHistory.importProgressBarLabel")), t = U(() => `${C(fe)}%`);
						l(ee, () => Hn, (r, i) => {
							i(r, {
								get value() {
									return C(fe);
								},
								max: 100,
								get "aria-label"() {
									return C(e);
								},
								get "aria-valuetext"() {
									return C(t);
								},
								class: "import-progress-root",
								children: (e, t) => {
									var r = yl();
									b((e) => n(r, e), [() => be(C(fe))]), m(e, r);
								},
								$$slots: { default: !0 }
							});
						});
					}
					e(i), b((e, n, r, a, o) => {
						ae(i, "aria-label", e), t(p, n), t(g, `${C(fe) ?? ""}%`), t(y, r), t(T, a), t(k, o), t(j, C(me));
					}, [
						() => o()("postHistory.importProgress"),
						() => o()("postHistory.importProgress"),
						() => o()("postHistory.importElapsedTime"),
						() => he(C(P)),
						() => o()("postHistory.importEstimatedRemainingTime")
					]), m(r, i);
				};
				f(ee, (e) => {
					(C(E) || C(O)) && e(F);
				});
				var te = S(ee, 2), I = (n) => {
					var r = xl(), i = x(r), a = x(i), s = B(a, !0), c = S(a, 2), l = x(c), u = x(l), d = B(u, !0), f = S(u), p = B(f, !0);
					e(l);
					var h = S(l, 2), g = x(h), _ = B(g, !0), v = S(g), y = B(v, !0);
					e(h);
					var w = S(h, 2), T = x(w), E = B(T, !0), D = S(T), k = B(D, !0);
					e(w);
					var A = S(w, 2), j = x(A), ee = B(j, !0), M = S(j), N = B(M, !0);
					e(A);
					var P = S(A, 2), F = x(P), te = B(F, !0), I = S(F), ne = B(I, !0);
					e(P);
					var L = S(P, 2), R = x(L), z = B(R, !0), re = S(R), ie = B(re, !0);
					e(L);
					var ae = S(L, 2), oe = x(ae), V = B(oe, !0), H = S(oe), U = B(H, !0);
					e(ae), e(c), e(i);
					var se = S(i, 2), ce = x(se), W = B(ce, !0), le = S(ce, 2), ue = x(le), de = x(ue), fe = B(de, !0), pe = S(de), me = B(pe, !0);
					e(ue);
					var he = S(ue, 2), G = x(he), ge = B(G, !0), _e = S(G), ve = B(_e, !0);
					e(he);
					var ye = S(he, 2), be = x(ye), xe = B(be, !0), Se = S(be), Ce = B(Se, !0);
					e(ye);
					var K = S(ye, 2), we = x(K), q = B(we, !0), Te = S(we), Ee = B(Te, !0);
					e(K);
					var De = S(K, 2), Oe = x(De), ke = B(Oe, !0), Ae = S(Oe), je = B(Ae, !0);
					e(De);
					var Me = S(De, 2), J = x(Me), Y = B(J, !0), Ne = S(J), Pe = B(Ne, !0);
					e(Me), e(le), e(se);
					var Fe = S(se, 2), Ie = x(Fe), Le = B(Ie, !0), Re = S(Ie, 2), X = x(Re), Z = x(X), ze = B(Z, !0), Be = S(Z), Ve = B(Be, !0);
					e(X);
					var He = S(X, 2), Ue = x(He), We = B(Ue, !0), Ge = S(Ue), Ke = B(Ge, !0);
					e(He);
					var qe = S(He, 2), Je = x(qe), Ye = B(Je, !0), Xe = S(Je), Ze = B(Xe, !0);
					e(qe);
					var Qe = S(qe, 2), $e = x(Qe), et = B($e, !0), tt = S($e), nt = B(tt, !0);
					e(Qe);
					var rt = S(Qe, 2), it = x(rt), at = B(it, !0), ot = S(it), st = B(ot, !0);
					e(rt);
					var ct = S(rt, 2), lt = x(ct), ut = B(lt, !0), dt = S(lt), ft = B(dt, !0);
					e(ct);
					var pt = S(ct, 2), mt = x(pt), ht = B(mt, !0), Q = S(mt), gt = B(Q, !0);
					e(pt), e(Re), e(Fe), e(r), b((e, n, r, i, a, o, c, l, u, f, m, h, g, v, b, x, S, w, T, D, A, j, M) => {
						t(s, e), t(d, n), t(p, C(O).nonEmptyLineCount), t(_, r), t(y, C(O).fileDuplicateCount), t(E, i), t(k, C(O).otherAccountCount), t(ee, a), t(N, C(O).unsupportedKindCount), t(te, o), t(ne, C(O).invalidJsonCount), t(z, c), t(ie, C(O).invalidStructureCount), t(V, l), t(U, C(O).invalidIdOrSignatureCount), t(W, u), t(fe, f), t(me, C(O).uniquePostEventCount), t(ge, m), t(ve, C(O).insertedPostCount), t(xe, h), t(Ce, C(O).updatedPostCount), t(q, g), t(Ee, C(O).unchangedPostCount), t(ke, v), t(je, C(O).failedPostEventCount), t(Y, b), t(Pe, C(O).appliedDeletionPostCount), t(Le, x), t(ze, S), t(Ve, C(O).uniqueDeletionEventCount), t(We, w), t(Ke, C(O).validDeletionETagCount), t(Ye, T), t(Ze, C(O).insertedDeletionRequestCount), t(et, D), t(nt, C(O).updatedDeletionRequestCount), t(at, A), t(st, C(O).unchangedDeletionRequestCount), t(ut, j), t(ft, C(O).unsupportedDeletionEventCount), t(ht, M), t(gt, C(O).failedDeletionEventCount);
					}, [
						() => o()("postHistory.importInputResults"),
						() => o()("postHistory.importNonEmptyLines"),
						() => o()("postHistory.importFileDuplicates"),
						() => o()("postHistory.importOtherAccount"),
						() => o()("postHistory.importUnsupportedKind"),
						() => o()("postHistory.importInvalidJson"),
						() => o()("postHistory.importInvalidStructure"),
						() => o()("postHistory.importInvalidCrypto"),
						() => o()("postHistory.importPostResults"),
						() => o()("postHistory.importPostEvents"),
						() => o()("postHistory.importInserted"),
						() => o()("postHistory.importUpdated"),
						() => o()("postHistory.importUnchanged"),
						() => o()("postHistory.importPostFailures"),
						() => o()("postHistory.importDeletionApplied"),
						() => o()("postHistory.importDeletionResults"),
						() => o()("postHistory.importDeletionEvents"),
						() => o()("postHistory.importDeletionTags"),
						() => o()("postHistory.importDeletionRequestsInserted"),
						() => o()("postHistory.importDeletionRequestsUpdated"),
						() => o()("postHistory.importDeletionRequestsUnchanged"),
						() => o()("postHistory.importUnsupportedDeletion"),
						() => o()("postHistory.importDeletionFailures")
					]), m(n, r);
				};
				f(te, (e) => {
					C(O) && e(I);
				}), b((e, n, r, i) => {
					t(d, e), t(h, n), ae(y, "aria-label", r), D = V(T, 1, "import-drop-zone svelte-1qfqhib", null, D, { "import-drop-zone-active": C(ne) > 0 }), t(j, i);
				}, [
					() => o()("postHistory.importTitle"),
					() => o()("postHistory.importDescription"),
					() => o()("postHistory.importChooseFile"),
					() => C(ne) > 0 ? o()("postHistory.importDropActive") : o()("postHistory.importDropHint")
				]), _("change", y, Ae), g("dragenter", T, Te), g("dragover", T, Ee), g("dragleave", T, De), g("drop", T, Oe), m(r, s);
			},
			$$slots: {
				footer: !0,
				default: !0
			}
		});
	}
	r(), c();
}
s(["change"]);
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryScanAuthObserver.ts
function Tl(e, t, n = Date.now) {
	let r = !1, i = new Map(t.map((e) => [e, {
		ids: /* @__PURE__ */ new Set(),
		successAt: null,
		rejected: !1,
		listeners: /* @__PURE__ */ new Set()
	}])), a = (e) => i.get(de.normalizeExternalRelayUrl(e) ?? ""), o = (e) => {
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
function El(e) {
	let t = Object.entries(e.issueCounts).filter(([, e]) => (e ?? 0) > 0);
	return t.length === 1 && t[0][0] === "ambiguous";
}
var Dl = {
	windowSeconds: 2592e3,
	limit: 250,
	concurrency: 4,
	pageTimeoutMs: pn,
	authTimeoutMs: 3e4,
	relayTimeoutMs: 18e5,
	operationTimeoutMs: 72e5,
	maxRequests: 1e4,
	maxBoundaryIds: 1e3
}, Ol = new class {
	deps;
	activeRuntimes = /* @__PURE__ */ new WeakSet();
	constructor(e = {}) {
		this.deps = e;
	}
	start(e) {
		if (this.activeRuntimes.has(e.rxNostr)) throw Error("A post-history full scan is already running");
		this.activeRuntimes.add(e.rxNostr);
		let t = this.deps.now ?? Date.now, n = {
			...Dl,
			...this.deps.options
		}, r = t(), i = Math.max(0, Math.floor(r / 1e3)), a = dn(e.relayConfig), o = tn(e.relayConfig), s = [...ft], c = new AbortController(), l = /* @__PURE__ */ new Set(), u = null, d = !1, f = !1, p = !1, m = 0, h = a.map((e) => ({
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
			let t = e.getCurrentScope(), n = t.ownerPubkeyHex === e.ownerPubkeyHex && t.rxNostr === e.rxNostr && tn(t.relayConfig) === o;
			return n || v(!0), n && !c.signal.aborted;
		}, b = () => v();
		e.signal?.addEventListener("abort", b, { once: !0 }), e.signal?.aborted && v();
		let x = Tl(e.rxNostr, a, t), S = () => void 0, C = (e, t, n) => {
			e.issueCounts[t] = (e.issueCounts[t] ?? 0) + 1, e.rangeSamples.length < 16 && e.rangeSamples.push({
				since: n.since,
				until: n.until
			});
		};
		return _(), {
			promise: (async () => {
				try {
					S = At(e.rxNostr, e.ownerPubkeyHex, s);
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
						let n = await (this.deps.persistBatch ?? Yn)(e.events, e.fetchedAt, t, a);
						n.applied === !1 ? !u && !d && v(!0) : (f = !0, g.insertedCount += n.insertedCount, g.updatedCount += n.updatedCount, _());
					}, b = async (a) => {
						let f = t() + n.relayTimeoutMs, m = () => Math.min(f, r + n.operationTimeoutMs) - t(), h = async (t) => {
							for (let r = 0; r < 2 && y() && !d; r++) {
								if (m() <= 0 || a.requestCount >= n.maxRequests) return C(a, "safety-limit", t), null;
								a.requestCount += 1, a.phase = "fetching", _();
								let i;
								try {
									let r = (this.deps.fetchRelayPage ?? on.fetchRelayPage.bind(on))(e.rxNostr, {
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
										let d = l.page?.hints.includes("more") === !0, f = !d && l.page?.hints.includes("finish") === !0, p = !d && l.rawCount === 0, g = l.oldestCreatedAt, v = wt({
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
							a.status = c.signal.aborted ? "cancelled" : Object.keys(a.issueCounts).length && !El(a) ? "partial" : "completed";
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
					})), a.isActive() || u || d || v(!0), u || d || (await (this.deps.persistBatch ?? Yn)([], t(), [], a)).applied !== !1 || u || v(!0);
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
}(), kl = a("<span class=\"close-icon svg-icon svelte-3dbqmx\" aria-hidden=\"true\"></span>"), Al = a("<!> <!>", 1), jl = a("<div class=\"scan-status svelte-3dbqmx\" role=\"status\"><!> <span> </span></div>"), Ml = a("<div class=\"svelte-3dbqmx\"><dt class=\"svelte-3dbqmx\"> </dt><dd class=\"svelte-3dbqmx\"> </dd></div>"), Nl = a("<div class=\"svelte-3dbqmx\"><dt class=\"svelte-3dbqmx\"> </dt><dd class=\"svelte-3dbqmx\"> </dd></div> <div class=\"svelte-3dbqmx\"><dt class=\"svelte-3dbqmx\"> </dt><dd class=\"svelte-3dbqmx\"> </dd></div> <!>", 1), Pl = a("<div class=\"scan-relay-ambiguity-popover svelte-3dbqmx\"><h3 class=\"svelte-3dbqmx\"> </h3> <p class=\"svelte-3dbqmx\"> </p> <p class=\"svelte-3dbqmx\"> </p> <p class=\"svelte-3dbqmx\"> </p></div>"), Fl = a("<span class=\"scan-relay-reason svelte-3dbqmx\"> </span>"), Il = a("<tr class=\"scan-relay-row svelte-3dbqmx\"><td class=\"svelte-3dbqmx\"><span class=\"scan-relay-host svelte-3dbqmx\"> </span></td><td class=\"scan-relay-state svelte-3dbqmx\"><div class=\"scan-relay-state-line svelte-3dbqmx\"><span class=\"svelte-3dbqmx\"> </span> <!></div> <!></td><td class=\"scan-relay-count svelte-3dbqmx\"> </td></tr>"), Ll = a("<div class=\"scan-results svelte-3dbqmx\"><section class=\"svelte-3dbqmx\"><h3 class=\"svelte-3dbqmx\"> </h3> <dl class=\"svelte-3dbqmx\"><div class=\"svelte-3dbqmx\"><dt class=\"svelte-3dbqmx\"> </dt><dd class=\"svelte-3dbqmx\"> </dd></div> <div class=\"svelte-3dbqmx\"><dt class=\"svelte-3dbqmx\"> </dt><dd class=\"svelte-3dbqmx\"> </dd></div> <div class=\"svelte-3dbqmx\"><dt class=\"svelte-3dbqmx\"> </dt><dd class=\"svelte-3dbqmx\"> </dd></div></dl></section> <section class=\"svelte-3dbqmx\"><h3 class=\"svelte-3dbqmx\"> </h3> <dl class=\"svelte-3dbqmx\"><div class=\"svelte-3dbqmx\"><dt class=\"svelte-3dbqmx\"> </dt><dd class=\"svelte-3dbqmx\"> </dd></div> <div class=\"svelte-3dbqmx\"><dt class=\"svelte-3dbqmx\"> </dt><dd class=\"svelte-3dbqmx\"> </dd></div> <!></dl></section></div> <section class=\"scan-relays svelte-3dbqmx\"><table class=\"svelte-3dbqmx\"><caption class=\"svelte-3dbqmx\"> </caption><thead><tr><th scope=\"col\" class=\"svelte-3dbqmx\"> </th><th scope=\"col\" class=\"svelte-3dbqmx\"> </th><th scope=\"col\" class=\"svelte-3dbqmx\"> </th></tr></thead><tbody></tbody></table></section>", 1), Rl = a("<div class=\"scan-heading svelte-3dbqmx\"><h2 class=\"svelte-3dbqmx\"> </h2> <p class=\"svelte-3dbqmx\"> </p></div> <div class=\"scan-actions svelte-3dbqmx\"><!></div> <!> <!>", 1), zl = {
	hash: "svelte-3dbqmx",
	code: ".scan-heading.svelte-3dbqmx, .scan-status.svelte-3dbqmx, .scan-results.svelte-3dbqmx {width:100%;}.scan-heading.svelte-3dbqmx {text-align:center;}.scan-heading.svelte-3dbqmx h2:where(.svelte-3dbqmx), .scan-heading.svelte-3dbqmx p:where(.svelte-3dbqmx) {margin:0;}.scan-heading.svelte-3dbqmx h2:where(.svelte-3dbqmx) {font-size:1.25rem;}.scan-heading.svelte-3dbqmx p:where(.svelte-3dbqmx) {margin-top:16px;font-size:0.88rem;line-height:1.5;white-space:pre-line;}.scan-actions.svelte-3dbqmx {box-sizing:border-box;display:flex;flex:0 0 50px;flex-wrap:wrap;align-items:center;justify-content:center;gap:8px;height:50px;margin-top:16px;}.scan-status.svelte-3dbqmx {display:flex;align-items:center;justify-content:center;gap:8px;margin-top:12px;font-size:0.9rem;}.post-history-full-scan-dialog .scan-action {box-sizing:border-box;min-width:50px;min-height:50px;padding:8px 12px;}.post-history-full-scan-dialog .scan-close-action {box-sizing:border-box;min-width:50px;min-height:50px;}.post-history-full-scan-dialog .scan-status .loading-placeholder {width:auto;flex:0 0 auto;justify-content:flex-start;}.close-icon.svelte-3dbqmx {mask-image:var(--ehagaki-icon-636c6f73655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.scan-results.svelte-3dbqmx {display:grid;grid-template-columns:repeat(2, minmax(0, 1fr));gap:8px;margin-top:12px;}.scan-results.svelte-3dbqmx section:where(.svelte-3dbqmx) {min-width:0;padding:10px;border:1px solid var(--border-hr);border-radius:8px;}.scan-results.svelte-3dbqmx h3:where(.svelte-3dbqmx) {margin:0 0 8px;font-size:0.9rem;}.scan-results.svelte-3dbqmx dl:where(.svelte-3dbqmx), .scan-results.svelte-3dbqmx dl:where(.svelte-3dbqmx) div:where(.svelte-3dbqmx) {margin:0;}.scan-results.svelte-3dbqmx dl:where(.svelte-3dbqmx) div:where(.svelte-3dbqmx) {display:flex;justify-content:space-between;gap:8px;padding-block:3px;font-size:0.8rem;}.scan-results.svelte-3dbqmx dt:where(.svelte-3dbqmx) {min-width:0;color:var(--text-muted);overflow-wrap:anywhere;}.scan-results.svelte-3dbqmx dd:where(.svelte-3dbqmx) {margin:0;flex:0 0 auto;font-variant-numeric:tabular-nums;}.scan-relays.svelte-3dbqmx {width:100%;min-width:0;box-sizing:border-box;margin-top:12px;padding:10px;border:1px solid var(--border-hr);border-radius:8px;}.scan-relays.svelte-3dbqmx table:where(.svelte-3dbqmx) {width:100%;table-layout:fixed;border-collapse:collapse;font-size:0.8rem;}.scan-relays.svelte-3dbqmx caption:where(.svelte-3dbqmx) {margin-bottom:8px;text-align:left;font-size:0.9rem;font-weight:600;}.scan-relays.svelte-3dbqmx th:where(.svelte-3dbqmx), .scan-relays.svelte-3dbqmx td:where(.svelte-3dbqmx) {padding:0 4px;text-align:left;overflow-wrap:anywhere;}.scan-relays.svelte-3dbqmx th:where(.svelte-3dbqmx) {color:var(--text-muted);font-weight:500;}.scan-relays.svelte-3dbqmx th:where(.svelte-3dbqmx):first-child {width:45%;}.scan-relays.svelte-3dbqmx th:where(.svelte-3dbqmx):nth-child(2) {width:28%;}.scan-relays.svelte-3dbqmx th:where(.svelte-3dbqmx):last-child, .scan-relays.svelte-3dbqmx td:where(.svelte-3dbqmx):last-child {text-align:right;}.scan-relay-row.svelte-3dbqmx {border-top:1px solid var(--border-hr);}.scan-relay-host.svelte-3dbqmx {display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.scan-relay-state-line.svelte-3dbqmx {display:flex;align-items:center;flex-wrap:wrap;gap:2px;min-width:0;min-height:44px;box-sizing:border-box;}.scan-relay-state-line.svelte-3dbqmx > span:where(.svelte-3dbqmx) {min-width:0;overflow-wrap:anywhere;}.scan-relay-count.svelte-3dbqmx {font-variant-numeric:tabular-nums;}.scan-relay-reason.svelte-3dbqmx {display:block;margin-top:4px;color:var(--text-muted);font-size:0.75rem;}.popover-content:has(.scan-relay-ambiguity-popover) {box-sizing:border-box;inline-size:min(320px, calc(100vw - 24px));max-inline-size:calc(100vw - 24px);max-block-size:min(var(--bits-popover-content-available-height, calc(100vh - 24px)), calc(100vh - 24px));overflow:auto;}.scan-relay-ambiguity-popover.svelte-3dbqmx {overflow-wrap:anywhere;}.scan-relay-ambiguity-popover.svelte-3dbqmx h3:where(.svelte-3dbqmx) {margin:0 0 8px;font-size:1rem;}.scan-relay-ambiguity-popover.svelte-3dbqmx p:where(.svelte-3dbqmx) {margin:0 0 8px;}.scan-relay-ambiguity-popover.svelte-3dbqmx p:where(.svelte-3dbqmx):last-child {margin-bottom:0;}.post-history-full-scan-dialog {max-width:min(760px, calc(100% - 10px));}\n    @media (max-width: 680px) {.scan-results.svelte-3dbqmx {grid-template-columns:1fr;} }"
};
function Bl(n, a) {
	H(a, !0), j(n, zl);
	let s = () => R(Fe, "$_", c), [c, d] = te(), p = L(a, "open", 15), g = U(() => a.result ?? a.progress), _ = U(() => a.running ? `postHistory.fullScanPhase.${a.progress?.phase ?? "fetching"}` : a.result ? `postHistory.fullScanStatus.${a.result.status}` : null), v = U(() => {
		let e = {};
		for (let t of a.result?.relays ?? []) if (!(t.status === "completed" && El(t))) for (let [n, r] of Object.entries(t.issueCounts)) e[n] = (e[n] ?? 0) + (r ?? 0);
		return Object.entries(e);
	});
	function w(e) {
		let t = Math.floor(e / 1e3);
		return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;
	}
	function T(e) {
		try {
			return new URL(e).host;
		} catch {
			return e;
		}
	}
	function E(e) {
		if (e.status === "running") return e.phase;
		if (e.status === "completed") return e.receivedCount === 0 && !El(e) ? "empty" : "completed";
		if (e.status === "cancelled") return "cancelled";
		let t = Object.entries(e.issueCounts).filter(([, e]) => (e ?? 0) > 0).map(([e]) => e);
		return t.length && t.every((e) => e === "timeout" || e === "auth-timeout") ? "timeout" : t.length === 1 && t[0] === "error" ? "error" : "partial";
	}
	function D(e) {
		if (e.status !== "partial" || E(e) !== "partial") return null;
		let t = Object.entries(e.issueCounts).filter(([, e]) => (e ?? 0) > 0);
		return t.length === 1 ? t[0][0] : null;
	}
	{
		let r = (e) => {
			var t = h(), n = M(t);
			{
				let e = (e, t) => {
					let n = () => (t?.()).props;
					{
						let t = U(() => s()("global.close"));
						Xe(e, y(n, {
							className: "modal-close scan-close-action",
							shape: "square",
							get ariaLabel() {
								return C(t);
							},
							children: (e, t) => {
								var n = kl();
								m(e, n);
							},
							$$slots: { default: !0 }
						}));
					}
				};
				l(n, () => Mn, (t, n) => {
					n(t, {
						child: e,
						$$slots: { child: !0 }
					});
				});
			}
			m(e, t);
		}, c = U(() => s()("postHistory.fullScanTitle")), d = U(() => s()("postHistory.fullScanDescription"));
		jn(n, {
			get onOpenChange() {
				return a.onOpenChange;
			},
			get title() {
				return C(c);
			},
			get description() {
				return C(d);
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
			footer: r,
			children: (n, r) => {
				var c = Rl(), l = M(c), d = x(l), p = B(d, !0), h = S(d, 2), y = B(h, !0);
				e(l);
				var O = S(l, 2), k = x(O), A = (e) => {
					var n = Al(), r = M(n), i = (e) => {
						{
							let n = U(() => !a.canStart);
							Xe(e, {
								variant: "primary",
								shape: "square",
								className: "scan-action",
								get disabled() {
									return C(n);
								},
								get onClick() {
									return a.onStart;
								},
								children: (e, n) => {
									ee();
									var r = ne();
									b((e) => t(r, e), [() => s()("postHistory.fullScanStart")]), m(e, r);
								},
								$$slots: { default: !0 }
							});
						}
					};
					f(r, (e) => {
						a.running || e(i);
					});
					var o = S(r, 2), c = (e) => {
						Xe(e, {
							variant: "default",
							shape: "square",
							className: "scan-action",
							get onClick() {
								return a.onCancel;
							},
							children: (e, n) => {
								ee();
								var r = ne();
								b((e) => t(r, e), [() => s()("postHistory.fullScanCancel")]), m(e, r);
							},
							$$slots: { default: !0 }
						});
					};
					f(o, (e) => {
						a.running && e(c);
					}), m(e, n);
				};
				f(k, (e) => {
					a.result || e(A);
				}), e(O);
				var j = S(O, 2), N = (n) => {
					var r = jl(), i = x(r), o = (e) => {
						Z(e, {
							showLoader: !0,
							loaderSize: 20
						});
					};
					f(i, (e) => {
						a.running && e(o);
					});
					var c = S(i, 2), l = B(c, !0);
					e(r), b((e) => t(l, e), [() => s()(C(_))]), m(n, r);
				};
				f(j, (e) => {
					C(_) && e(N);
				});
				var P = S(j, 2), F = (n) => {
					var r = Ll(), c = M(r), l = x(c), d = x(l), p = B(d, !0), h = S(d, 2), _ = x(h), y = x(_), O = B(y, !0), k = S(y), A = B(k);
					e(_);
					var j = S(_, 2), ee = x(j), N = B(ee, !0), P = S(ee), F = B(P, !0);
					e(j);
					var te = S(j, 2), I = x(te), ne = B(I, !0), L = S(I), R = B(L, !0);
					e(te), e(h), e(l);
					var z = S(l, 2), re = x(z), ie = B(re, !0), oe = S(re, 2), V = x(oe), H = x(V), se = B(H, !0), ce = S(H), W = B(ce, !0);
					e(V);
					var le = S(V, 2), ue = x(le), de = B(ue, !0), fe = S(ue), pe = B(fe, !0);
					e(le);
					var me = S(le, 2), he = (n) => {
						var r = Nl(), c = M(r), l = x(c), d = B(l, !0), f = S(l), p = B(f, !0);
						e(c);
						var h = S(c, 2), g = x(h), _ = B(g, !0), y = S(g), w = B(y, !0);
						e(h);
						var T = S(h, 2);
						i(T, 17, () => C(v), o, (n, r) => {
							var i = U(() => u(C(r), 2));
							let a = () => C(i)[0], o = () => C(i)[1];
							var c = Ml(), l = x(c), d = B(l, !0), f = S(l), p = B(f, !0);
							e(c), b((e) => {
								t(d, e), t(p, o());
							}, [() => s()(`postHistory.fullScanIssue.${a()}`)]), m(n, c);
						}), b((e, n, r, i) => {
							t(d, e), t(p, n), t(_, r), t(w, i);
						}, [
							() => s()("postHistory.fullScanCompletedRelays"),
							() => a.result.relays.filter((e) => e.status === "completed").length,
							() => s()("postHistory.fullScanIncompleteRelays"),
							() => a.result.relays.filter((e) => e.status !== "completed").length
						]), m(n, r);
					};
					f(me, (e) => {
						a.result && e(he);
					}), e(oe), e(z), e(c);
					var G = S(c, 2), ge = x(G), _e = x(ge), ve = B(_e, !0), ye = S(_e), be = x(ye), xe = x(be), Se = B(xe, !0), Ce = S(xe), K = B(Ce, !0), we = S(Ce), q = B(we, !0);
					e(be), e(ye);
					var Te = S(ye);
					i(Te, 21, () => C(g).relays, (e) => e.relayUrl, (n, r) => {
						let i = U(() => D(C(r))), a = U(() => C(r).status === "completed" && El(C(r)));
						var o = Il(), c = x(o), l = x(c), u = B(l, !0);
						e(c);
						var d = S(c), p = x(d), h = x(p), g = B(h, !0), _ = S(h, 2), v = (n) => {
							{
								let r = U(() => s()("postHistory.fullScanAmbiguityInfo.label"));
								Ir(n, {
									side: "top",
									sideOffset: 4,
									get ariaLabel() {
										return C(r);
									},
									children: (n, r) => {
										var i = Pl(), a = x(i), o = B(a, !0), c = S(a, 2), l = B(c, !0), u = S(c, 2), d = B(u, !0), f = S(u, 2), p = B(f, !0);
										e(i), b((e, n, r, i) => {
											t(o, e), t(l, n), t(d, r), t(p, i);
										}, [
											() => s()("postHistory.fullScanAmbiguityInfo.title"),
											() => s()("postHistory.fullScanAmbiguityInfo.bodyCompletion"),
											() => s()("postHistory.fullScanAmbiguityInfo.bodyEose"),
											() => s()("postHistory.fullScanAmbiguityInfo.bodyStatus")
										]), m(n, i);
									},
									$$slots: { default: !0 }
								});
							}
						};
						f(_, (e) => {
							C(a) && e(v);
						}), e(p);
						var y = S(p, 2), w = (e) => {
							var n = Fl(), r = B(n, !0);
							b((e) => t(r, e), [() => s()(`postHistory.fullScanIssue.${C(i)}`)]), m(e, n);
						};
						f(y, (e) => {
							C(i) && e(w);
						}), e(d);
						var O = S(d), k = B(O, !0);
						e(o), b((e, n) => {
							ae(o, "data-relay-url", C(r).relayUrl), ae(l, "title", C(r).relayUrl), t(u, e), t(g, n), t(k, C(r).receivedCount);
						}, [() => T(C(r).relayUrl), () => s()(`postHistory.fullScanRelayStatus.${E(C(r))}`)]), m(n, o);
					}), e(Te), e(ge), e(G), b((e, n, r, i, a, o, s, c, l, u, d, f) => {
						t(p, e), t(O, n), t(A, `${C(g).finishedRelayCount ?? ""} / ${C(g).targetRelayCount ?? ""}`), t(N, r), t(F, C(g).receivedCount), t(ne, i), t(R, a), t(ie, o), t(se, s), t(W, C(g).insertedCount), t(de, c), t(pe, C(g).updatedCount), t(ve, l), t(Se, u), t(K, d), t(q, f);
					}, [
						() => s()("postHistory.fullScanRetrieval"),
						() => s()("postHistory.fullScanRelays"),
						() => s()("postHistory.fullScanReceived"),
						() => s()("postHistory.importElapsedTime"),
						() => w(a.elapsedMs),
						() => s()("postHistory.fullScanSaved"),
						() => s()("postHistory.importInserted"),
						() => s()("postHistory.fullScanUpdated"),
						() => s()("postHistory.fullScanRelayProgress"),
						() => s()("postHistory.fullScanRelayHost"),
						() => s()("postHistory.fullScanRelayState"),
						() => s()("postHistory.fullScanReceived")
					]), m(n, r);
				};
				f(P, (e) => {
					C(g) && e(F);
				}), b((e, n) => {
					t(p, e), t(y, n);
				}, [() => s()("postHistory.fullScanTitle"), () => s()("postHistory.fullScanDescription")]), m(n, c);
			},
			$$slots: {
				footer: !0,
				default: !0
			}
		});
	}
	r(), d();
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/hooks/usePostHistoryRelayFullScan.svelte.ts
function Vl(e) {
	let t = T({
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
		return !!r && r.ownerPubkeyHex === t.ownerPubkeyHex && r.rxNostr === t.rxNostr && i === tn(t.relayConfig);
	};
	function f(e) {
		e || u(), e && !n && (t.result = null, t.progress = null, t.elapsedMs = 0), t.open = e;
	}
	async function p() {
		let c = e.getScope();
		if (a || n || !c.ownerPubkeyHex || !c.rxNostr || !e.getShow()) return;
		let u = o;
		r = c, i = tn(c.relayConfig), t.running = !0, t.result = null, t.progress = null, t.elapsedMs = 0;
		let f = performance.now(), p = setInterval(() => {
			u === o && e.getShow() && (t.elapsedMs = performance.now() - f);
		}, 1e3);
		s = p;
		let m = ol.acquire();
		l = m;
		try {
			let r = Ol.start({
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
	return I(() => {
		let a = e.getShow(), o = e.getScope(), s = tn(o.relayConfig);
		F(() => {
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
// D:/ドキュメント/GitHub/ehagaki/src/components/PostHistoryThreadToggleButton.svelte
var Hl = a("<span class=\"post-history-thread-toggle-spinner post-history-thread-action-spinner svelte-cenxtw\" aria-hidden=\"true\"></span>"), Ul = a("<span class=\"post-history-thread-toggle-icon-wrapper svelte-cenxtw\" aria-hidden=\"true\"><span></span></span>"), Wl = {
	hash: "svelte-cenxtw",
	code: ".post-history-thread-node-top-actions {width:100%;height:28px;}\r\n            .post-history-context-actions .post-history-thread-toggle-button,\r\n            .post-history-thread-node-top-actions\r\n                .post-history-thread-toggle-button\r\n         {position:relative;width:40px;height:28px;min-height:28px;background:inherit;}.post-history-thread-toggle-icon-wrapper.svelte-cenxtw {position:relative;display:inline-flex;align-items:center;justify-content:center;flex:0 0 22px;}.post-history-thread-toggle-icon.svelte-cenxtw {--icon-size: 24px;}.post-history-thread-toggle-icon-arrow-top-right.svelte-cenxtw {mask-image:var(--ehagaki-icon-6172726f775f746f705f72696768745f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.post-history-thread-toggle-icon-collapse.svelte-cenxtw {--icon-size: 28px;mask-image:var(--ehagaki-icon-636f6c6c617073655f636f6e74656e745f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.post-history-thread-toggle-spinner.svelte-cenxtw {width:22px;height:22px;border:2px solid currentColor;border-right-color:transparent;border-radius:50%;\r\n        animation: svelte-cenxtw-post-history-thread-toggle-spinner 0.8s linear infinite;}\r\n\r\n    @media (prefers-reduced-motion: reduce) {.post-history-thread-toggle-spinner.svelte-cenxtw {\r\n            animation: none;}\r\n    }\r\n\r\n    @keyframes svelte-cenxtw-post-history-thread-toggle-spinner {\r\n        to {\r\n            rotate: 360deg;\r\n        }\r\n    }"
};
function Gl(e, t) {
	H(t, !0), j(e, Wl);
	let n = L(t, "title", 19, () => t.ariaLabel), i = L(t, "loading", 3, !1), a = U(() => [i() ? "is-loading" : ""].filter(Boolean).join(" "));
	{
		let r = U(() => `post-history-thread-toggle-button ${C(a)}`.trim());
		Xe(e, {
			type: "button",
			get className() {
				return C(r);
			},
			get ariaLabel() {
				return t.ariaLabel;
			},
			get title() {
				return n();
			},
			contentLayout: "icon",
			shape: "rounded",
			get selected() {
				return t.expanded;
			},
			get disabled() {
				return i();
			},
			get onClick() {
				return t.onClick;
			},
			children: (e, n) => {
				var r = h(), a = M(r), o = (e) => {
					var t = Hl();
					m(e, t);
				}, s = (e) => {
					var n = Ul(), r = B(n);
					b(() => V(r, 1, `post-history-thread-toggle-icon ${t.expanded ? "post-history-thread-toggle-icon-collapse" : "post-history-thread-toggle-icon-arrow-top-right"} svg-icon`, "svelte-cenxtw")), m(e, n);
				};
				f(a, (e) => {
					i() ? e(o) : e(s, -1);
				}), m(e, r);
			},
			$$slots: { default: !0 }
		});
	}
	r();
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostHistoryStatusPill.svelte
var Kl = a("<span> </span>"), ql = {
	hash: "svelte-1uufmpv",
	code: ".post-history-status-pill.svelte-1uufmpv {display:inline-flex;align-items:center;justify-content:center;min-height:18px;padding:0 8px;border:1px solid color-mix(in srgb, currentColor 18%, transparent);border-radius:999px;background:color-mix(in srgb, currentColor 8%, transparent);font-size:0.72rem;line-height:1;white-space:nowrap;}.post-history-status-pill-muted.svelte-1uufmpv {color:var(--text-muted, currentColor);}.post-history-status-pill-danger.svelte-1uufmpv {color:var(--destructive-fg, currentColor);}"
};
function Jl(e, n) {
	H(n, !0), j(e, ql);
	let i = L(n, "className", 3, "");
	var a = Kl(), o = B(a, !0);
	b((e) => {
		V(a, 1, e, "svelte-1uufmpv"), ae(a, "aria-label", n.label), ae(a, "title", n.label), t(o, n.label);
	}, [() => p(`post-history-status-pill post-history-status-pill-${n.tone} ${i()}`.trim())]), m(e, a), r();
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostHistoryDeletionLifecycleStatusBadge.svelte
function Yl(e, t) {
	H(t, !0);
	let n = () => R(Fe, "$_", i), [i, a] = te(), o = U(() => {
		if (t.eventId) return cn[t.eventId];
	});
	function s(e) {
		return e === "pending" || e === "processing" ? n()("postHistory.deleteSending") : e === "failed" ? n()("postHistory.deleteFailed") : null;
	}
	let c = U(() => s(C(o)));
	var l = h(), u = M(l), d = (e) => {
		{
			let t = U(() => C(o) === "failed" ? "danger" : "muted"), n = U(() => `post-history-deletion-lifecycle-status ${C(o) ?? ""}`.trim());
			Jl(e, {
				get label() {
					return C(c);
				},
				get tone() {
					return C(t);
				},
				get className() {
					return C(n);
				}
			});
		}
	};
	f(u, (e) => {
		C(c) && e(d);
	}), m(e, l), r(), a();
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostHistoryThreadNode.svelte
function Xl(e, t) {
	H(t, !0);
	let n = L(t, "model", 3, void 0), i = L(t, "loadSensitiveBody", 3, void 0), a = L(t, "emojiLoadStateByUrl", 19, () => ({})), o = L(t, "emojiImageMetaByUrl", 19, () => ({})), s = L(t, "scrollRoot", 3, null), c = L(t, "onImageOpen", 3, void 0), l = L(t, "topActions", 3, void 0), u = L(t, "footerLeftExtras", 3, void 0), d = L(t, "footerActions", 3, void 0), f = L(t, "footerDetails", 3, void 0), p = L(t, "footerMenu", 3, void 0);
	cr(e, {
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
	}), r();
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostHistoryThreadGraphNodeView.svelte
var Zl = a("<span class=\"post-history-context-deleted-label svelte-1kez5et\"> </span>"), Ql = a("<p class=\"post-history-context-message svelte-1kez5et\"> </p>"), $l = a("<p class=\"post-history-context-message post-history-context-error svelte-1kez5et\"> </p> <!>", 1), eu = a("<div class=\"post-history-thread-node-parent svelte-1kez5et\"><!></div>"), tu = a("<div class=\"post-history-thread-node-top-actions\"><!></div>"), nu = a("<div class=\"open-in-new-icon svg-icon\" aria-hidden=\"true\"></div> <span> </span>", 1), ru = a("<!> <!>", 1), iu = a("<div aria-hidden=\"true\"></div> <span> </span>", 1), au = a("<!> <!> <!>", 1), ou = a("<div class=\"post-history-thread-node-children svelte-1kez5et\"></div>"), su = a("<div class=\"post-history-thread-node-view svelte-1kez5et\"><!> <div class=\"post-history-thread-node-anchor svelte-1kez5et\"><!></div> <!></div>"), cu = {
	hash: "svelte-1kez5et",
	code: ".post-history-thread-node-view.svelte-1kez5et {display:grid;gap:1px;}.post-history-thread-node-parent.svelte-1kez5et,\n    .post-history-thread-node-children.svelte-1kez5et {display:grid;gap:2px;}.post-history-thread-node-parent.svelte-1kez5et {padding-inline-start:0;}.post-history-thread-node-anchor.svelte-1kez5et {display:grid;min-width:0;}.post-history-thread-node-children.svelte-1kez5et {padding-inline-start:0;}.post-history-context-button {min-height:28px;padding:2px 6px;color:var(--text-muted);background:var(--btn-bg);font-size:0.82rem;}.post-history-context-message.svelte-1kez5et {margin:0;color:var(--text-muted);font-size:0.82rem;}.post-history-context-deleted-label.svelte-1kez5et {width:fit-content;min-height:28px;padding:2px 6px;color:var(--text-muted);background-color:transparent;border:1px solid var(--btn-border);font-size:0.82rem;font-weight:normal;cursor:default;user-select:none;display:flex;align-items:center;}.post-history-context-error.svelte-1kez5et {color:var(--danger);}"
};
function lu(n, a) {
	H(a, !0), j(n, cu);
	let o = () => R(Fe, "$_", s), [s, c] = te(), u = L(a, "previewModelByEventId", 19, () => ({})), d = L(a, "getSensitiveBodyLoader", 3, void 0), p = L(a, "emojiLoadStateByUrl", 19, () => ({})), g = L(a, "emojiImageMetaByUrl", 19, () => ({})), _ = L(a, "scrollRoot", 3, null), v = L(a, "onImageOpen", 3, void 0), y = L(a, "buildPostRecordForNode", 3, void 0), w = L(a, "onReplyPost", 3, void 0), T = L(a, "onQuotePost", 3, void 0), E = L(a, "onReactionPost", 3, void 0), D = L(a, "getReactionReadModel", 3, void 0), O = L(a, "isReactionExpanded", 3, void 0), k = L(a, "getReactionLabel", 3, void 0), A = L(a, "onToggleReaction", 3, void 0), N = L(a, "onToggleParent", 3, void 0), P = L(a, "onRetryParent", 3, void 0), F = L(a, "onToggleChildren", 3, void 0), I = L(a, "onRetryChildren", 3, void 0), z = L(a, "onCopyPointerDown", 3, void 0), re = L(a, "onCopyNevent", 3, void 0), ie = L(a, "externalClientLabel", 3, void 0), oe = L(a, "onOpenExternalClient", 3, void 0), se = L(a, "isCopyFailed", 3, void 0), ce = L(a, "onShowRawJson", 3, void 0), W = L(a, "onBroadcastPointerDown", 3, void 0), le = L(a, "onBroadcastPost", 3, void 0), ue = L(a, "isBroadcastSending", 3, void 0), de = L(a, "canDeleteNodePost", 3, void 0), fe = L(a, "isDeletionSending", 3, void 0), pe = L(a, "onOpenDeleteConfirm", 3, void 0), me = U(() => Xt(a.state.node.event.created_at * 1e3)), he = U(() => a.state.repliesActionState.status === "loaded" && a.state.repliesActionState.replyCount > 0), G = U(() => se()?.(a.state.node.eventId) ?? !1), ge = U(() => ue()?.(a.state.node.eventId) ?? !1), _e = U(() => de()?.(a.state) ?? !1), ve = U(() => fe()?.(a.state.node.eventId) ?? !1);
	function ye() {
		let e = a.state.repliesActionState;
		if (e.status === "loading") return o()("postHistory.checkingReplies");
		if (e.status === "failed") return o()("postHistory.recheckReplies");
		if (e.status === "loaded") {
			let t = e.replyCount;
			return t === 0 ? o()("postHistory.recheckReplies") : e.visible ? o()("postHistory.hideReplies") : o()("postHistory.showRepliesWithCount", { values: { count: t } });
		}
		return o()("postHistory.checkReplies");
	}
	function be() {
		let e = a.state.repliesActionState;
		e.status === "failed" || e.status === "loaded" && e.replyCount === 0 ? I()?.(a.state.node.eventId) : F()?.(a.state.node.eventId);
	}
	function xe(e) {
		z()?.(a.state, e);
	}
	function Se(e) {
		re()?.(a.state, e);
	}
	function Ce() {
		ce()?.(a.state);
	}
	function K(e) {
		W()?.(a.state, e);
	}
	function we(e) {
		le()?.(a.state, e);
	}
	function q() {
		pe()?.(a.state);
	}
	var Te = su(), Ee = x(Te), De = (n) => {
		var r = eu(), i = x(r), s = (e) => {
			lu(e, {
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
					return p();
				},
				get emojiImageMetaByUrl() {
					return g();
				},
				get scrollRoot() {
					return _();
				},
				get onImageOpen() {
					return v();
				},
				get buildPostRecordForNode() {
					return y();
				},
				get onReplyPost() {
					return w();
				},
				get onQuotePost() {
					return T();
				},
				get onReactionPost() {
					return E();
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
					return P();
				},
				get onToggleChildren() {
					return F();
				},
				get onRetryChildren() {
					return I();
				},
				get onCopyPointerDown() {
					return z();
				},
				get onCopyNevent() {
					return re();
				},
				get externalClientLabel() {
					return ie();
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
					return W();
				},
				get onBroadcastPost() {
					return le();
				},
				get isBroadcastSending() {
					return ue();
				},
				get canDeleteNodePost() {
					return de();
				},
				get isDeletionSending() {
					return fe();
				},
				get onOpenDeleteConfirm() {
					return pe();
				}
			});
		}, c = (e) => {
			var n = Zl(), r = B(n, !0);
			b((e) => t(r, e), [() => o()("postHistory.replyTargetDeleted")]), m(e, n);
		}, l = (e) => {
			var n = Ql(), r = B(n, !0);
			b((e) => t(r, e), [() => o()("postHistory.contextNotFound")]), m(e, n);
		}, h = (e) => {
			var n = $l(), r = M(n), i = B(r, !0), s = S(r, 2);
			Xe(s, {
				type: "button",
				className: "post-history-context-button post-history-context-retry-button",
				onClick: () => P()?.(a.state.node.eventId),
				children: (e, n) => {
					ee();
					var r = ne();
					b((e) => t(r, e), [() => o()("postHistory.contextRetry")]), m(e, r);
				},
				$$slots: { default: !0 }
			}), b((e) => t(i, e), [() => o()("postHistory.contextFetchFailed")]), m(e, n);
		};
		f(i, (e) => {
			a.state.parentExpansion.visibleParent && a.state.parentNodeState ? e(s) : a.state.parentExpansion.visibleParent && a.state.parentExpansion.parentDeleted ? e(c, 1) : a.state.parentExpansion.visibleParent && a.state.parentExpansion.parentMissing ? e(l, 2) : a.state.parentExpansion.visibleParent && a.state.parentExpansion.parentError && e(h, 3);
		}), e(r), m(n, r);
	};
	f(Ee, (e) => {
		a.state.parentTargetId && e(De);
	});
	var Oe = S(Ee, 2), ke = x(Oe);
	{
		let n = (t) => {
			var n = h(), r = M(n), i = (t) => {
				var n = tu(), r = x(n);
				{
					let e = U(() => a.state.parentExpansion.visibleParent ? o()("postHistory.hideReplyTarget") : o()("postHistory.showReplyTarget")), t = U(() => a.state.parentExpansion.visibleParent ? o()("postHistory.hideReplyTarget") : o()("postHistory.showReplyTarget")), n = U(() => a.state.parentExpansion.visibleParent && a.state.parentExpansion.showParentLoadingIndicator);
					Gl(r, {
						get ariaLabel() {
							return C(e);
						},
						get title() {
							return C(t);
						},
						get expanded() {
							return a.state.parentExpansion.visibleParent;
						},
						get loading() {
							return C(n);
						},
						onClick: () => N()?.(a.state.node.eventId)
					});
				}
				e(n), m(t, n);
			};
			f(r, (e) => {
				a.state.parentTargetId && !a.state.parentAlreadyInPath && !(a.state.parentExpansion.visibleParent && a.state.parentExpansion.parentDeleted) && e(i);
			}), m(t, n);
		}, r = (e) => {
			Yl(e, { get eventId() {
				return a.state.node.eventId;
			} });
		}, i = (e) => {
			var t = h(), n = M(t), r = (e) => {
				{
					let t = (e) => {
						var t = h(), n = M(t), r = (e) => {
							{
								let t = U(ye), n = U(ye);
								jr(e, {
									get count() {
										return a.state.repliesActionState.replyCount;
									},
									get selected() {
										return a.state.repliesActionState.visible;
									},
									get ariaLabel() {
										return C(t);
									},
									get tooltipContent() {
										return C(n);
									},
									onClick: be
								});
							}
						};
						f(n, (e) => {
							C(he) && e(r);
						}), m(e, t);
					}, n = (e) => {
						let t = U(() => D()?.(a.state.node.eventId));
						var n = h(), r = M(n), i = (e) => {
							{
								let n = U(() => O()?.(a.state.node.eventId) ?? !1), r = U(() => k()?.(a.state.node.eventId) ?? "");
								dr(e, {
									get count() {
										return C(t).totalCount;
									},
									get expanded() {
										return C(n);
									},
									get ariaLabel() {
										return C(r);
									},
									onToggle: () => A()?.(a.state.node.eventId)
								});
							}
						};
						f(r, (e) => {
							C(t) && C(t).totalCount > 0 && e(i);
						}), m(e, n);
					}, r = U(() => y()(a.state)), i = U(() => a.state.node.event.kind === 42 ? void 0 : w()), o = U(() => a.state.node.event.kind === 42 ? void 0 : T());
					rr(e, {
						get onReactionPost() {
							return E();
						},
						get post() {
							return C(r);
						},
						get onReplyPost() {
							return C(i);
						},
						get onQuotePost() {
							return C(o);
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
			f(n, (e) => {
				y() && e(r);
			}), m(e, t);
		}, s = (e) => {
			let t = U(() => D()?.(a.state.node.eventId));
			var n = h(), r = M(n), i = (e) => {
				Er(e, {
					get readModel() {
						return C(t);
					},
					get emojiLoadStateByUrl() {
						return p();
					},
					get emojiImageMetaByUrl() {
						return g();
					}
				});
			}, o = U(() => C(t) && C(t).totalCount > 0 && (O()?.(a.state.node.eventId) ?? !1));
			f(r, (e) => {
				C(o) && e(i);
			}), m(e, n);
		}, c = (e) => {
			let n = U(() => o()("common.showActions"));
			Pr(e, {
				get triggerAriaLabel() {
					return C(n);
				},
				get tooltipContent() {
					return C(n);
				},
				enableTooltip: !0,
				get timestamp() {
					return C(me);
				},
				items: (e) => {
					var n = au(), r = M(n), i = (e) => {
						var n = ru(), r = M(n);
						l(r, () => Cn, (e, n) => {
							n(e, {
								class: "menu-action-button",
								onSelect: () => oe()?.(a.state),
								children: (e, n) => {
									var r = nu(), i = S(M(r), 2), a = B(i, !0);
									b(() => t(a, ie())), m(e, r);
								},
								$$slots: { default: !0 }
							});
						});
						var i = S(r, 2);
						l(i, () => wn, (e, t) => {
							t(e, { class: "post-history-menu-separator" });
						}), m(e, n);
					};
					f(r, (e) => {
						ie() && oe() && e(i);
					});
					var o = S(r, 2);
					{
						let e = U(() => a.state.repliesActionState.status === "loading");
						l(o, () => Cn, (n, r) => {
							r(n, {
								class: "menu-action-button",
								get disabled() {
									return C(e);
								},
								onSelect: be,
								children: (e, n) => {
									var r = iu(), i = M(r), o = S(i, 2), s = B(o, !0);
									b((e) => {
										V(i, 1, `${a.state.repliesActionState.visible ? "collapse-content-icon" : "find_in_page-icon"} svg-icon`, "svelte-1kez5et"), t(s, e);
									}, [() => ye()]), m(e, r);
								},
								$$slots: { default: !0 }
							});
						});
					}
					tl(S(o, 2), {
						order: "raw-json-first",
						get copyFailed() {
							return C(G);
						},
						showBroadcast: !0,
						get broadcastSending() {
							return C(ge);
						},
						get showDelete() {
							return C(_e);
						},
						showDeleteSeparator: !0,
						get deletionSending() {
							return C(ve);
						},
						onCopyPointerDown: xe,
						onCopyNevent: Se,
						onShowRawJson: Ce,
						onBroadcastPointerDown: K,
						onBroadcastPost: we,
						onOpenDeleteConfirm: q
					}), m(e, n);
				},
				$$slots: { items: !0 }
			});
		}, j = U(() => d()?.(a.state.node.event));
		Xl(ke, {
			get node() {
				return a.state.node;
			},
			get model() {
				return u()[a.state.node.eventId];
			},
			get loadSensitiveBody() {
				return C(j);
			},
			get emojiLoadStateByUrl() {
				return p();
			},
			get emojiImageMetaByUrl() {
				return g();
			},
			get scrollRoot() {
				return _();
			},
			get onImageOpen() {
				return v();
			},
			topActions: n,
			footerLeftExtras: r,
			footerActions: i,
			footerDetails: s,
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
	e(Oe);
	var Ae = S(Oe, 2), je = (t) => {
		var n = ou();
		i(n, 21, () => a.state.replyNodeStates, (e) => e.node.eventId, (e, t) => {
			lu(e, {
				get state() {
					return C(t);
				},
				get previewModelByEventId() {
					return u();
				},
				get getSensitiveBodyLoader() {
					return d();
				},
				get emojiLoadStateByUrl() {
					return p();
				},
				get emojiImageMetaByUrl() {
					return g();
				},
				get scrollRoot() {
					return _();
				},
				get onImageOpen() {
					return v();
				},
				get buildPostRecordForNode() {
					return y();
				},
				get onReplyPost() {
					return w();
				},
				get onQuotePost() {
					return T();
				},
				get onReactionPost() {
					return E();
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
					return P();
				},
				get onToggleChildren() {
					return F();
				},
				get onRetryChildren() {
					return I();
				},
				get onCopyPointerDown() {
					return z();
				},
				get onCopyNevent() {
					return re();
				},
				get externalClientLabel() {
					return ie();
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
					return W();
				},
				get onBroadcastPost() {
					return le();
				},
				get isBroadcastSending() {
					return ue();
				},
				get canDeleteNodePost() {
					return de();
				},
				get isDeletionSending() {
					return fe();
				},
				get onOpenDeleteConfirm() {
					return pe();
				}
			});
		}), e(n), m(t, n);
	};
	f(Ae, (e) => {
		a.state.repliesActionState.visible && a.state.replyNodeStates.length > 0 && e(je);
	}), e(Te), b(() => {
		ae(Oe, "data-post-history-thread-anchor-scope-id", a.state.anchorEventId), ae(Oe, "data-post-history-thread-anchor-event-id", a.state.node.eventId);
	}), m(n, Te), r(), c();
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostHistoryThreadGraphPanel.svelte
var uu = a("<span class=\"post-history-context-deleted-label post-history-thread-direct-parent-context svelte-nb00ha\"> </span>"), du = a("<p class=\"post-history-context-message post-history-thread-direct-parent-context svelte-nb00ha\"> </p>"), fu = a("<p class=\"post-history-context-message post-history-context-error post-history-thread-direct-parent-context svelte-nb00ha\"> </p> <!>", 1), pu = a("<div class=\"post-history-thread-parent-panel svelte-nb00ha\"><!> <div class=\"post-history-context-actions svelte-nb00ha\"><!></div></div>"), mu = a("<div class=\"post-history-thread-replies-panel svelte-nb00ha\"><div class=\"post-history-thread-replies-list svelte-nb00ha\"></div></div>"), hu = {
	hash: "svelte-nb00ha",
	code: ".post-history-thread-parent-panel.svelte-nb00ha,\n    .post-history-thread-replies-panel.svelte-nb00ha {display:grid;gap:6px;}.post-history-thread-parent-panel.svelte-nb00ha {padding-bottom:4px;}.post-history-thread-replies-list.svelte-nb00ha {display:grid;}.post-history-context-actions.svelte-nb00ha {display:flex;flex-wrap:wrap;gap:6px;}.post-history-thread-direct-parent-context {margin-inline-start:var(--thread-direct-parent-indent);}.post-history-context-button {min-height:28px;padding:2px 6px;color:var(--text-muted);background:transparent;font-size:0.82rem;}\n\n    @media (hover: hover) and (pointer: fine) {.post-history-context-button:hover:not(:disabled) {color:var(--theme);background:color-mix(in srgb, var(--theme) 10%, transparent);}\n    }.post-history-context-message.svelte-nb00ha {margin:0;color:var(--text-muted);font-size:0.82rem;}.post-history-context-deleted-label.svelte-nb00ha {width:fit-content;min-height:28px;padding:2px 6px;color:var(--text-muted);background-color:transparent;border:1px solid var(--btn-border);font-size:0.82rem;font-weight:normal;cursor:default;user-select:none;display:flex;align-items:center;}.post-history-context-error.svelte-nb00ha {color:var(--danger);}"
};
function gu(a, o) {
	H(o, !0), j(a, hu);
	let s = () => R(Fe, "$_", c), [c, l] = te(), u = L(o, "previewModelByEventId", 19, () => ({})), d = L(o, "getSensitiveBodyLoader", 3, void 0), p = L(o, "emojiLoadStateByUrl", 19, () => ({})), g = L(o, "emojiImageMetaByUrl", 19, () => ({})), _ = L(o, "scrollRoot", 3, null), v = L(o, "onImageOpen", 3, void 0), y = L(o, "buildPostRecordForNode", 3, void 0), w = L(o, "onReplyPost", 3, void 0), T = L(o, "onQuotePost", 3, void 0), E = L(o, "onReactionPost", 3, void 0), D = L(o, "getReactionReadModel", 3, void 0), O = L(o, "isReactionExpanded", 3, void 0), k = L(o, "getReactionLabel", 3, void 0), A = L(o, "onToggleReaction", 3, void 0), N = L(o, "onToggleParent", 3, void 0), P = L(o, "onRetryParent", 3, void 0), F = L(o, "onToggleNodeParent", 3, void 0), I = L(o, "onRetryNodeParent", 3, void 0), z = L(o, "onToggleNodeChildren", 3, void 0), re = L(o, "onRetryNodeChildren", 3, void 0), ie = L(o, "onCopyPointerDown", 3, void 0), ae = L(o, "onCopyNevent", 3, void 0), oe = L(o, "externalClientLabel", 3, void 0), V = L(o, "onOpenExternalClient", 3, void 0), se = L(o, "isCopyFailed", 3, void 0), ce = L(o, "onShowRawJson", 3, void 0), W = L(o, "onBroadcastPointerDown", 3, void 0), le = L(o, "onBroadcastPost", 3, void 0), ue = L(o, "isBroadcastSending", 3, void 0), de = L(o, "canDeleteNodePost", 3, void 0), fe = L(o, "isDeletionSending", 3, void 0), pe = L(o, "onOpenDeleteConfirm", 3, void 0), me = `${Qn(-1)}rem`, he = U(() => o.state.parentNode ? {
		anchorEventId: o.state.anchorEventId,
		node: o.state.parentNode,
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
	var G = h(), ge = M(G), _e = (r) => {
		var i = pu(), a = x(i), c = (e) => {
			lu(e, {
				get state() {
					return o.state.parentNodeState;
				},
				get previewModelByEventId() {
					return u();
				},
				get getSensitiveBodyLoader() {
					return d();
				},
				get emojiLoadStateByUrl() {
					return p();
				},
				get emojiImageMetaByUrl() {
					return g();
				},
				get scrollRoot() {
					return _();
				},
				get onImageOpen() {
					return v();
				},
				get buildPostRecordForNode() {
					return y();
				},
				get onReplyPost() {
					return w();
				},
				get onQuotePost() {
					return T();
				},
				get onReactionPost() {
					return E();
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
				get onToggleChildren() {
					return z();
				},
				get onRetryChildren() {
					return re();
				},
				get onCopyPointerDown() {
					return ie();
				},
				get onCopyNevent() {
					return ae();
				},
				get externalClientLabel() {
					return oe();
				},
				get onOpenExternalClient() {
					return V();
				},
				get isCopyFailed() {
					return se();
				},
				get onShowRawJson() {
					return ce();
				},
				get onBroadcastPointerDown() {
					return W();
				},
				get onBroadcastPost() {
					return le();
				},
				get isBroadcastSending() {
					return ue();
				},
				get canDeleteNodePost() {
					return de();
				},
				get isDeletionSending() {
					return fe();
				},
				get onOpenDeleteConfirm() {
					return pe();
				}
			});
		}, l = (e) => {
			lu(e, {
				get state() {
					return C(he);
				},
				get previewModelByEventId() {
					return u();
				},
				get getSensitiveBodyLoader() {
					return d();
				},
				get emojiLoadStateByUrl() {
					return p();
				},
				get emojiImageMetaByUrl() {
					return g();
				},
				get scrollRoot() {
					return _();
				},
				get onImageOpen() {
					return v();
				},
				get buildPostRecordForNode() {
					return y();
				},
				get onReplyPost() {
					return w();
				},
				get onQuotePost() {
					return T();
				},
				get onReactionPost() {
					return E();
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
				get onToggleChildren() {
					return z();
				},
				get onRetryChildren() {
					return re();
				},
				get onCopyPointerDown() {
					return ie();
				},
				get onCopyNevent() {
					return ae();
				},
				get externalClientLabel() {
					return oe();
				},
				get onOpenExternalClient() {
					return V();
				},
				get isCopyFailed() {
					return se();
				},
				get onShowRawJson() {
					return ce();
				},
				get onBroadcastPointerDown() {
					return W();
				},
				get onBroadcastPost() {
					return le();
				},
				get isBroadcastSending() {
					return ue();
				},
				get canDeleteNodePost() {
					return de();
				},
				get isDeletionSending() {
					return fe();
				},
				get onOpenDeleteConfirm() {
					return pe();
				}
			});
		}, h = (e) => {
			var n = uu(), r = B(n, !0);
			b((e) => t(r, e), [() => s()("postHistory.replyTargetDeleted")]), m(e, n);
		}, j = (e) => {
			var n = du(), r = B(n, !0);
			b((e) => t(r, e), [() => s()("postHistory.contextNotFound")]), m(e, n);
		}, te = (e) => {
			var n = fu(), r = M(n), i = B(r, !0), a = S(r, 2);
			Xe(a, {
				type: "button",
				className: "post-history-context-button post-history-context-retry-button",
				onClick: () => P()?.(),
				children: (e, n) => {
					ee();
					var r = ne();
					b((e) => t(r, e), [() => s()("postHistory.contextRetry")]), m(e, r);
				},
				$$slots: { default: !0 }
			}), b((e) => t(i, e), [() => s()("postHistory.contextFetchFailed")]), m(e, n);
		};
		f(a, (e) => {
			o.state.parentExpansion.visibleParent && o.state.parentNodeState ? e(c) : o.state.parentExpansion.visibleParent && C(he) ? e(l, 1) : o.state.parentExpansion.visibleParent && o.state.parentExpansion.parentDeleted ? e(h, 2) : o.state.parentExpansion.visibleParent && o.state.parentExpansion.parentMissing ? e(j, 3) : o.state.parentExpansion.visibleParent && o.state.parentExpansion.parentError && e(te, 4);
		});
		var L = S(a, 2), R = x(L), H = (e) => {
			{
				let t = U(() => o.state.parentExpansion.visibleParent ? s()("postHistory.hideReplyTarget") : s()("postHistory.showReplyTarget")), n = U(() => o.state.parentExpansion.visibleParent ? s()("postHistory.hideReplyTarget") : s()("postHistory.showReplyTarget")), r = U(() => o.state.parentExpansion.visibleParent && o.state.parentExpansion.showParentLoadingIndicator);
				Gl(e, {
					get ariaLabel() {
						return C(t);
					},
					get title() {
						return C(n);
					},
					get expanded() {
						return o.state.parentExpansion.visibleParent;
					},
					get loading() {
						return C(r);
					},
					onClick: () => N()?.()
				});
			}
		};
		f(R, (e) => {
			o.state.parentExpansion.visibleParent && o.state.parentExpansion.parentDeleted || e(H);
		}), e(L), e(i), b(() => n(i, `--thread-direct-parent-indent: ${me}`)), m(r, i);
	}, ve = (t) => {
		var n = mu(), r = x(n);
		i(r, 21, () => o.state.replyNodeStates, (e) => e.node.eventId, (e, t) => {
			lu(e, {
				get state() {
					return C(t);
				},
				get previewModelByEventId() {
					return u();
				},
				get getSensitiveBodyLoader() {
					return d();
				},
				get emojiLoadStateByUrl() {
					return p();
				},
				get emojiImageMetaByUrl() {
					return g();
				},
				get scrollRoot() {
					return _();
				},
				get onImageOpen() {
					return v();
				},
				get buildPostRecordForNode() {
					return y();
				},
				get onReplyPost() {
					return w();
				},
				get onQuotePost() {
					return T();
				},
				get onReactionPost() {
					return E();
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
				get onToggleChildren() {
					return z();
				},
				get onRetryChildren() {
					return re();
				},
				get onCopyPointerDown() {
					return ie();
				},
				get onCopyNevent() {
					return ae();
				},
				get externalClientLabel() {
					return oe();
				},
				get onOpenExternalClient() {
					return V();
				},
				get isCopyFailed() {
					return se();
				},
				get onShowRawJson() {
					return ce();
				},
				get onBroadcastPointerDown() {
					return W();
				},
				get onBroadcastPost() {
					return le();
				},
				get isBroadcastSending() {
					return ue();
				},
				get canDeleteNodePost() {
					return de();
				},
				get isDeletionSending() {
					return fe();
				},
				get onOpenDeleteConfirm() {
					return pe();
				}
			});
		}), e(r), e(n), m(t, n);
	};
	f(ge, (e) => {
		o.section === "parent" && o.state.parentTargetId ? e(_e) : o.section === "children" && o.state.repliesActionState.visible && o.state.replyNodeStates.length > 0 && e(ve, 1);
	}), m(a, G), r(), l();
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/hooks/usePostHistoryCopyNevent.svelte.ts
function _u() {
	let e = 0, t = /* @__PURE__ */ new Set(), n = D(T({})), r = D(!1), i = D(0), a = D(0), o, s = D(void 0);
	function c(e) {
		return Ye(e, We.value);
	}
	function l() {
		o &&= (clearTimeout(o), void 0), N(r, !1), N(s, void 0);
	}
	function u(e, t) {
		N(s, {
			eventId: e.eventId,
			...$e(t.clientX, t.clientY)
		}, !0);
	}
	function d(e, t) {
		if (C(s)?.eventId === e.eventId) return {
			x: C(s).x,
			y: C(s).y
		};
		let n = t.currentTarget, r = n instanceof HTMLElement ? n.getBoundingClientRect() : null;
		return $e(r ? r.left + r.width / 2 : 0, r ? r.bottom + 8 : 0);
	}
	function f(e, t) {
		o && clearTimeout(o), N(i, e, !0), N(a, t, !0), N(r, !0), o = setTimeout(() => {
			N(r, !1), o = void 0;
		}, 1800);
	}
	async function p(r, i) {
		let a = e, o = d(r, i), s = c(r), l = s ? await xn(s, "nevent", navigator, window) : !1;
		if (a !== e) return;
		if (l) {
			N(n, {
				...C(n),
				[r.eventId]: void 0
			}, !0), f(o.x, o.y);
			return;
		}
		N(n, {
			...C(n),
			[r.eventId]: "failed"
		}, !0);
		let u = setTimeout(() => {
			t.delete(u), a === e && N(n, {
				...C(n),
				[r.eventId]: void 0
			}, !0);
		}, 1800);
		t.add(u);
	}
	function m() {
		e++, t.forEach(clearTimeout), t.clear(), N(n, {}, !0), l();
	}
	return {
		get copyState() {
			return C(n);
		},
		get showCopyFloatingMessage() {
			return C(r);
		},
		get copyFloatingMessageX() {
			return C(i);
		},
		get copyFloatingMessageY() {
			return C(a);
		},
		captureCopyPointerPosition: u,
		hideCopyFloatingMessage: l,
		handleCopyNevent: p,
		resetState: m
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryQuoteUtils.ts
var vu = /nostr:[^\s<>"']+/gi, yu = /[),.!?:;\]\u3001\u3002\uff01\uff08\uff09\uff0c\uff0e\uff1a\uff1b\u300d\u300f\u3011]+$/u, bu = /^[\s),.!?:;\]\u3001\u3002\uff01\uff08\uff09\uff0c\uff0e\uff1a\uff1b\u300d\u300f\u3011]+$/u;
function xu(e) {
	return de.sanitizeExternalRelayUrls(typeof e == "string" && e.length > 0 ? [e] : [], { limit: 1 })[0] ?? null;
}
function Su(e) {
	let t = e.match(yu);
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
function Cu(e) {
	if (!e.toLowerCase().startsWith("nostr:")) return null;
	try {
		let t = ue.decode(e.slice(6));
		return t.type === "note" ? t.data : t.type === "nevent" ? t.data.id : null;
	} catch {
		return null;
	}
}
function wu(e) {
	let t = e.replace(/[ \t]{2,}/g, " ").trim();
	return t.length === 0 || bu.test(t) ? null : t;
}
function Tu(e) {
	if (!e) return [];
	let t = /* @__PURE__ */ new Map();
	for (let n of e.tags) {
		if (!Array.isArray(n) || n[0] !== "q") continue;
		let e = n[1];
		if (!pe(e)) continue;
		let r = xu(n[2]), i = pe(n[3]) ? n[3] : null, a = t.get(e);
		a ? (!a.relayHint && r && (a.relayHint = r), !a.authorHint && i && (a.authorHint = i)) : t.set(e, {
			eventId: e,
			relayHint: r,
			authorHint: i
		});
	}
	return Array.from(t.values());
}
function Eu(e) {
	if (!e || typeof e.content != "string" || e.content.length === 0) return e?.content ?? "";
	let t = Tu(e);
	if (t.length === 0) return e.content;
	let n = new Set(t.map((e) => e.eventId)), r = !1, i = e.content.split(/\r?\n/).map((e) => {
		if (!e) return e;
		let t = "", i = 0, a = !1;
		for (let o of e.matchAll(vu)) {
			let s = o.index ?? -1, c = o[0] ?? "";
			if (s < 0 || !c) continue;
			let { uri: l, trailingText: u } = Su(c), d = Cu(l);
			d && n.has(d) && (a = !0, r = !0, t += e.slice(i, s), t += u, i = s + c.length);
		}
		return a ? (t += e.slice(i), wu(t)) : e;
	});
	return r ? i.filter((e) => e !== null).join("\n") : e.content;
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryRelatedTargetDiscoveryAdapter.ts
var Du = 8, Ou = {
	byPostId: {},
	contextsByEventId: {}
};
function ku(e) {
	return de.sanitizeExternalRelayUrls(e, { limit: Du });
}
function Au(e) {
	return {
		sourceEventId: e.sourceEventId,
		targetEventId: e.targetEventId,
		relationKind: e.relationKind,
		relayHints: ku(e.relayHints),
		authorHint: e.authorHint,
		scopeKey: e.scopeKey
	};
}
var ju = {
	buildIndex(e) {
		let t = {}, n = {};
		for (let r of e) {
			let e = Tu(r);
			if (e.length !== 0) {
				t[r.eventId] = e;
				for (let t of e) {
					let e = n[t.eventId];
					n[t.eventId] = {
						eventId: t.eventId,
						sourceEventId: e?.sourceEventId ?? r.eventId,
						authorHint: e?.authorHint ?? t.authorHint,
						relayHints: ku([
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
		return Au({
			sourceEventId: e.sourceEventId,
			targetEventId: e.eventId,
			relationKind: "quote",
			relayHints: e.relayHints,
			authorHint: e.authorHint,
			scopeKey: t
		});
	}
}, Mu = {
	getRelayHints(e, t) {
		let n = he(t.event);
		return ku([
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
		let t = he(e.event);
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
		return Au({
			sourceEventId: e.sourceEventId,
			targetEventId: e.targetEventId,
			relationKind: "reply-parent",
			relayHints: e.relayHints,
			authorHint: e.authorHint,
			scopeKey: t
		});
	}
}, Nu = 0;
function Pu(e) {
	switch (e) {
		case void 0: return "idle";
		case "resolved":
		case "not-found":
		case "deleted":
		case "error": return e;
		default: return "loading";
	}
}
function Fu(e, t) {
	let n = Pu(t?.status);
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
function Iu({ getShow: e, getPosts: t, getRxNostr: n, getRelayConfig: r, postHistoryRepositoryImpl: i = Q, contextFetchService: a = Kt, deletionRequestsRepositoryImpl: o = Jt, deletionFetchService: s = Yt, profileSyncCoordinator: c = void 0, relatedTargetResolver: l = void 0 }) {
	let u = l ?? Mr({
		getShow: e,
		getRxNostr: n,
		getRelayConfig: r,
		postHistoryRepositoryImpl: i,
		contextFetchService: a,
		deletionRequestsRepositoryImpl: o,
		deletionFetchService: s,
		profileSyncCoordinator: c
	}), d = !l, f = `post-history-quote-preview:${++Nu}`, p = D(0), m = null, h = Ou;
	function g() {
		let n = t();
		return n !== m && (m = n, h = ju.buildIndex(n)), e() ? h : Ou;
	}
	function _() {
		d && u.reset();
	}
	function v(e) {
		return C(p), (g().byPostId[e.eventId] ?? []).map((e) => Fu(e.eventId, u.getTargetSnapshot(e.eventId)));
	}
	function y(t) {
		if (!e()) return;
		let n = g().contextsByEventId[t];
		n && u.retryTarget(ju.toDescriptor(n, f));
	}
	async function b(t) {
		if (!e()) return;
		let n = ju.buildIndex(t), r = Object.values(n.contextsByEventId);
		r.length !== 0 && await u.ensureTargets(r.map((e) => ju.toDescriptor(e, f)), { force: !0 });
	}
	return I(() => {
		e() && N(p, u.getScopeRevision(f), !0);
	}), I(() => {
		if (!e()) return;
		n(), r();
		let t = Object.values(g().contextsByEventId);
		t.length !== 0 && u.ensureTargets(t.map((e) => ju.toDescriptor(e, f)));
	}), re(() => {
		u.invalidateScope(f), _();
	}), {
		getQuotePreviews: v,
		retryQuotePreview: y,
		refreshQuotePreviews: b,
		suspend: () => u.invalidateScope(f)
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryBrowsingContinuity.ts
function Lu(e, t, n = []) {
	return yt([
		...e,
		...t,
		...n
	]);
}
function Ru(e, t, n, r = null) {
	let i = yt(e), a = i.find((e) => e.since <= t && e.until >= t), o = a ? a.since - 1 : t;
	if (o < 0) return null;
	let s = i.filter((e) => e.until < o).at(-1), c = r !== null && r <= o ? r : Math.max(0, o - n);
	return {
		since: Math.max(c, s ? s.until + 1 : 0),
		until: o
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryDialogViewState.ts
var zu = {
	currentPage: 1,
	searchPage: 1,
	searchInput: "",
	searchQuery: ""
}, Bu = /* @__PURE__ */ new Map();
function Vu(e) {
	if (typeof e != "string") return null;
	let t = e.trim();
	return t.length > 0 ? t : null;
}
function Hu(e) {
	return typeof e != "number" || !Number.isFinite(e) ? 1 : Math.max(1, Math.trunc(e));
}
function Uu(e) {
	return {
		currentPage: e.currentPage,
		searchPage: e.searchPage,
		searchInput: e.searchInput,
		searchQuery: e.searchQuery
	};
}
function Wu(e) {
	let t = Vu(e);
	return Uu(t ? Bu.get(t) ?? zu : zu);
}
function Gu(e, t) {
	let n = Vu(e);
	if (!n) return Uu(zu);
	let r = Bu.get(n) ?? zu, i = {
		currentPage: Hu(t.currentPage ?? r.currentPage),
		searchPage: Hu(t.searchPage ?? r.searchPage),
		searchInput: t.searchInput ?? r.searchInput,
		searchQuery: t.searchQuery ?? r.searchQuery
	};
	return Bu.set(n, i), Uu(i);
}
function Ku(e) {
	let t = Vu(e);
	t && Bu.delete(t);
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryDialogOpenRefreshDecision.ts
function qu(e) {
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
var Ju = 2e3;
function Yu(e) {
	return Number.isFinite(e) ? Math.max(1, Math.trunc(e)) : 1;
}
function Xu(e) {
	return Number.isFinite(e) ? Math.max(1, Math.trunc(e)) : 50;
}
function Zu(e) {
	return e.trim().toLowerCase().split(/\s+/).filter(Boolean);
}
function Qu(e) {
	return e.join(" ");
}
function $u(e) {
	return {
		postHistory: pt(e),
		channelMetadata: Pt()
	};
}
function ed(e, t) {
	return e.postHistory === t.postHistory && e.channelMetadata === t.channelMetadata;
}
function td(e) {
	let t = at(e.kind) && mt(e);
	return t && e.repostTarget ? lt(e.repostTarget.rawEvent, t)?.event : null;
}
function nd(e, t) {
	return at(e.kind) ? t ? _e(t).channelEventId : void 0 : e.channelEventId;
}
function rd(e, t, n = "", r = null) {
	return [
		at(e.kind) ? "" : e.content,
		...r ? [
			r.content,
			r.id,
			r.pubkey,
			r.tags.flat().join(" "),
			...dt(r).flatMap((e) => [e.url, e.alt ?? ""])
		] : [],
		n,
		e.eventId,
		String(e.kind),
		e.tags.flat().join(" "),
		...e.media.flatMap((e) => [e.url, e.alt ?? ""]),
		nd(e, r) ?? "",
		e.relayHints.join(" "),
		e.acceptedRelays.join(" "),
		e.fetchedRelays?.join(" ") ?? "",
		t?.name ?? "",
		t?.about ?? ""
	].join("\n").toLowerCase();
}
function id(e, t) {
	return Array.from(new Set(e.map((e) => nd(e, t.get(e.eventId))).filter((e) => typeof e == "string" && e.length > 0)));
}
var ad = new class {
	postHistoryRepositoryImpl;
	channelMetadataRepositoryImpl;
	sensitivePayloadRepositoryImpl;
	resolvedCacheEntry = null;
	inFlightEntry = null;
	runtimeCacheToken = 0;
	constructor(e = Q, t = Bt, n = kt) {
		this.postHistoryRepositoryImpl = e, this.channelMetadataRepositoryImpl = t, this.sensitivePayloadRepositoryImpl = n;
	}
	clearCache() {
		this.resolvedCacheEntry = null, this.inFlightEntry = null, this.runtimeCacheToken += 1;
	}
	isResolvedCacheEntryCurrent(e, t, n, r) {
		return e.pubkeyHex === t && e.normalizedQueryKey === n && ed(e.revision, r);
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
		let i = new Map(t.map((e) => [e.eventId, td(e)])), a = t.flatMap((e) => {
			if (!me(e.rawEvent, e)) return [];
			let t = at(e.kind) ? i.get(e.eventId) : e.rawEvent;
			if (!t) return [];
			let n = st(t);
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
		let l = id(t, i).filter((e) => !r.has(e));
		if (l.length > 0) {
			let t = await this.channelMetadataRepositoryImpl.getMany(l);
			this.assertBuildActive(e), l.forEach((e) => r.set(e, null)), t.forEach((e) => {
				r.set(e.channelEventId, e);
			});
		}
		return t.filter((e) => {
			let t = i.get(e.eventId), a = nd(e, t), o = rd(e, a ? r.get(a) ?? null : null, c.get(e.eventId) ?? "", t);
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
				limit: Ju
			});
			this.assertBuildActive(e);
			let o = await this.filterBatch(e, a.items, t, r), s = ed(e.revision, $u(e.pubkeyHex));
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
				let l = $u(e), u = ed(s, l);
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
		let t = Zu(e.query);
		if (!e.pubkeyHex || t.length === 0) return {
			items: [],
			total: 0,
			hasNext: !1
		};
		let n = Yu(e.page), r = Xu(e.pageSize), i = e.pubkeyHex, a = Qu(t), o = $u(i);
		this.inFlightEntry && (this.inFlightEntry.pubkeyHex !== i || this.inFlightEntry.normalizedQueryKey !== a || !ed(this.inFlightEntry.revision, o)) && (this.inFlightEntry = null);
		let s = this.resolvedCacheEntry, c = s && this.isResolvedCacheEntryCurrent(s, i, a, o) ? s.filteredPosts : await (async () => {
			let s = this.inFlightEntry, c = s && s.runtimeCacheToken === this.runtimeCacheToken && s.pubkeyHex === i && s.normalizedQueryKey === a && ed(s.revision, o) ? s : this.startFilteredPostsBuild(i, a, t, o), l = n === 1 && e.onProgress ? {
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
}(), od = 12, sd = 3600, cd = class extends Error {
	phase;
	phaseStartedAt;
	errorClass;
	constructor(e, t, n) {
		super(e), this.name = "PostHistoryCurrentViewRefetchFailure", this.phase = e, this.phaseStartedAt = n, this.errorClass = t instanceof Error ? t.name : typeof t, this.cause = t;
	}
};
function ld(e, t) {
	return e.status === "timeout" || e.status === "error" || e.status === "cancelled" ? e.status : typeof e.coverageComplete == "boolean" ? e.coverageComplete && !e.coverageSaturated ? "complete" : "partial" : e.hasMore || e.perRelayCounts.some((e) => e.rawCount >= t) ? "partial" : "complete";
}
function ud(e) {
	return e === "partial" || e === "timeout" || e === "error";
}
function dd(e, t) {
	return typeof e.coverageSaturated == "boolean" ? e.coverageSaturated : e.hasMore || e.perRelayCounts.some((e) => e.rawCount >= t);
}
function fd(e) {
	return typeof e.since == "number" && typeof e.until == "number" && e.until - e.since > sd;
}
function pd(e) {
	if (!fd(e)) return [];
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
var md = new class {
	postHistoryRelayFetchService;
	postHistoryRepository;
	setTimeoutFn;
	clearTimeoutFn;
	console;
	now;
	constructor(e = {}) {
		this.postHistoryRelayFetchService = e.postHistoryRelayFetchService ?? on, this.postHistoryRepository = e.postHistoryRepository ?? Q, this.setTimeoutFn = e.setTimeoutFn ?? setTimeout, this.clearTimeoutFn = e.clearTimeoutFn ?? clearTimeout, this.console = e.console ?? (globalThis.console === void 0 ? { debug: () => void 0 } : globalThis.console), this.now = e.now ?? Date.now;
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
						timeoutMs: pn,
						...typeof S.since == "number" ? { since: S.since } : {},
						...typeof S.until == "number" ? { until: S.until } : {}
					});
					r = w;
					let T = this.now(), E;
					try {
						E = await w.promise;
					} catch (e) {
						let t = this.now();
						throw _ += Math.max(0, t - T), new cd("primary-fetch", e, T);
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
							if (r = await qn(E, C, this.postHistoryRepository), r.applied === !1) {
								n = !0;
								break;
							}
						} catch (t) {
							throw v += Math.max(0, this.now() - e), new cd("primary-persist", t, e);
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
					let ee = dd(E, S.limit);
					d ||= ee;
					let M = ee ? pd(S) : [], N = M.length > 0 && x.length + 1 + a.length + M.length <= od, P = ee ? "limit" : ld(E, S.limit);
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
						status: P,
						rawCount: E.rawCount,
						uniqueCount: E.uniqueCount,
						duplicateCount: E.duplicateCount,
						insertedCount: k,
						updatedCount: A,
						unchangedCount: j
					}), ee && N ? (h += M.length, a.unshift(...M)) : ee && (m = !0), (ud(P) || O || ee && !N) && (u = !0), n || !C.isActive()) {
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
}(), hd = 3e5;
function gd(e, t, n) {
	let r = new Set(n.map((e) => e.eventId)), i = /* @__PURE__ */ new Map();
	for (let n of t) [
		1,
		42,
		1111
	].includes(n.kind) && n.pubkeyHex === e && r.has(n.eventId) && !i.has(n.eventId) && i.set(n.eventId, n);
	return Array.from(i.values());
}
function _d(e, t, n, r, i = hd) {
	return e.filter((e) => {
		if (n.has(e)) return !1;
		let a = t.get(e);
		return typeof a != "number" || r - a >= i;
	});
}
function vd(e, t) {
	return {
		status: t ? e.status : "cancelled",
		savedDirectReplyCount: e.savedDirectReplyCount
	};
}
function yd({ getShow: e, getPubkeyHex: t, getRxNostr: n, getRelayConfig: r, getLoadedPosts: i, onChildInteractionBadgeRefreshRequested: a, onQuoteVisibleRangeRefreshRequested: o, quoteVisibleRangeRepairExecutor: s, relationRepairService: c = Or, triggerDeletionLifecycle: l = Rn, now: u = Date.now }) {
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
		let t = Sr(e.source, {
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
			relationKinds: mr,
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
			if (d === r && (d = null), t.status === "cancelled" || !o) return vd(t, !1);
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
				...vd(t, n()),
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
		let s = gd(r, e, i());
		if (s.length === 0) return;
		let c = s.map((e) => e.eventId);
		if (!a) return;
		let l = () => y(o, r, a);
		T("listing-older-reveal", c, a, l);
		let d = _d(c, g, _, u()), f = new Set(d), m = s.filter((e) => f.has(e.eventId));
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
function bd(e) {
	if (!e || typeof e != "object") return !1;
	let t = e;
	return Number.isFinite(t.centerCreatedAt) && Number.isFinite(t.radiusSec) && (t.radiusSec ?? 0) > 0 && Number.isFinite(t.fetchedAt);
}
function xd(e) {
	if (!e || typeof e != "object") return !1;
	let t = e;
	return typeof t.pubkeyHex == "string" && Array.isArray(t.anchors) && t.anchors.every((e) => bd(e));
}
function Sd(e, t, n, r) {
	let i = t - Math.max(0, Math.trunc(n));
	return e.filter((e) => Number.isFinite(e.centerCreatedAt) && Number.isFinite(e.radiusSec) && e.radiusSec > 0 && Number.isFinite(e.fetchedAt) && e.fetchedAt >= i).sort((e, t) => t.fetchedAt - e.fetchedAt).slice(0, Math.max(1, Math.trunc(r)));
}
function Cd(e, t, n) {
	return e.findIndex((e) => Math.abs(e.centerCreatedAt - t) <= Math.max(e.radiusSec, n));
}
var wd = new class {
	db;
	now;
	constructor(e = yn, t = Date.now) {
		this.db = e, this.now = t;
	}
	async getForPubkey(e, t = {}) {
		let n = t.ttlMs ?? 2592e6, r = t.maxCount ?? 200, i = await this.db.postHistoryJumpAnchors.get(e);
		return !i || !xd(i.value) ? [] : Sd(i.value.anchors, this.now(), n, r);
	}
	async addForPubkey(e) {
		let t = e.ttlMs ?? 2592e6, n = e.maxCount ?? 200, r = Number.isFinite(e.fetchedAt) ? Math.trunc(e.fetchedAt ?? 0) : this.now(), i = Number.isFinite(e.centerCreatedAt) ? Math.trunc(e.centerCreatedAt) : 0, a = Number.isFinite(e.radiusSec) ? Math.max(1, Math.trunc(e.radiusSec ?? 1)) : 1, o = await this.getForPubkey(e.pubkeyHex, {
			ttlMs: t,
			maxCount: n
		}), s = Cd(o, i, a), c = [...o];
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
		let l = Sd(c, this.now(), t, n);
		return await this.db.transaction("rw", this.db.postHistoryJumpAnchors, this.db.postHistoryWriteGeneration, async () => {
			await xt(this.db, e.localWriteScope), await this.db.postHistoryJumpAnchors.put({
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
function Td(e) {
	let t = e.error, n = e.errorClass ?? (t instanceof Error ? t.name : t === void 0 ? void 0 : typeof t);
	return {
		phase: e.phase,
		durationMs: e.durationMs ?? Math.max(0, (e.finishedAt ?? Date.now()) - e.startedAt),
		...n ? { errorClass: n } : {},
		...e.counts ?? {}
	};
}
function Ed(e) {
	let t = Td(e);
	"errorClass" in t ? console.warn("post_history_manual_repair_phase", t) : console.debug("post_history_manual_repair_phase", t);
}
function Dd(e) {
	return e.map((e) => e.event?.id).filter((e) => !!e);
}
function Od({ currentPosts: e, olderPosts: t, anchorEventId: n = null, maxVisiblePosts: r, keepAbove: i }) {
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
function kd(e, t) {
	let n = new Set(e.map((e) => e.eventId));
	return t.filter((e) => !n.has(e.eventId));
}
var Ad = {
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
}, jd = Gn([...ft]), Md = 86400, Nd = 259200, Pd = 100;
function Fd(e, t) {
	if (e.length === 0) return !0;
	let n = e[e.length - 1]?.createdAt;
	return !Number.isFinite(n) || (n ?? 0) > t;
}
var Id = 43200, Ld = 3600, Rd = [
	43200,
	86400,
	259200,
	604800,
	1209600,
	2592e3
], zd = 6, Bd = 2592e3;
function Vd({ status: e, changed: t, didCursorAdvanceOlder: n, hitLimit: r, continuedWithinWindow: i, attemptIndex: a, maxAttempts: o, totalVisibleAdded: s, targetVisibleAdded: c, exploredSeconds: l, maxExploreSeconds: u }) {
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
var Hd = /* @__PURE__ */ new Map();
async function Ud({ nextUntil: e, visibleOldestCreatedAt: t, pubkeyHex: n, getOldestCreatedAt: r, getNowSeconds: i = () => Math.floor(Date.now() / 1e3) }) {
	if (typeof e == "number") return e;
	if (typeof t == "number") return t;
	let a = await r(n);
	if (typeof a == "number") return a;
	let o = i();
	return Number.isFinite(o) ? o : null;
}
function Wd(e) {
	if (typeof e != "string") return null;
	let t = e.trim();
	return t.length > 0 ? t : null;
}
function Gd(e) {
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
function Kd(e) {
	let t = Wd(e);
	return Gd(t ? Hd.get(t) ?? Ad : Ad);
}
function qd(e, t) {
	let n = Wd(e);
	n && Hd.set(n, Gd(t));
}
function Jd(e) {
	let t = Wd(e);
	t && Hd.delete(t);
}
function Yd({ getShow: e, getSessionOpen: t = e, getPubkeyHex: n, getRxNostr: r, getRelayConfig: i, getSessionScrollState: a = () => null, onSessionScrollStateInvalidated: o = () => {}, onSavedAuthoredPosts: s = () => void 0, onLocalHistoryChanged: c = (e) => e(), onChildInteractionBadgeRefreshRequested: l = () => void 0, onQuoteVisibleRangeRefreshRequested: u = () => void 0, quoteVisibleRangeRepairExecutor: d = void 0, pageSize: f = 50, searchDebounceMs: p = 250 }) {
	let m = Wu(n()), h = Kd(n()), g = h.searchQuery === m.searchQuery && m.searchQuery.length > 0, _ = h.totalCountKnown ?? h.totalCount > 0, v = h.totalCountFailed ? "failed" : _ ? "ready" : "unknown", y = T({
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
	}), b = D(T(h.coverageAnchorCreatedAt ?? null)), x = D(T([])), S = D(T([])), w = D(T([])), E = null, O = null, k = D(T($t.getSessionGeneration())), A = U(() => Lu(C(x), C(S))), j = U(() => Lu(C(x), C(S), C(w))), ee = null, M, P = tn(i()), te = n(), ne = r(), L = 0, R = !1, z = 0, B = !1, ae = D(!1), oe = D(null), V = null, H = 0, ce = null, W = 0, le = D(!1), ue = D("idle"), de = !1, fe = !1, pe = !1, me = null, he = D("idle"), G = 0, _e = Wd(n()), ve = D(T(_e)), ye = null, be = null, xe = null, Se = 0, Ce = D(null), K = D(!0), we = D(!1), q = tt.localRelayUrl, Te = r(), Ee = $t.getSessionGeneration(), De = D(!1), Oe = 0, ke = Promise.resolve(), Ae = null, je = 0, Me = null, J = null, Y = null, Ne = null, Pe = r(), Fe = g ? m.searchQuery : "", Ie = !g, Le = T({
		windowSeconds: Id,
		nextUntil: null,
		consecutiveEmptyCount: 0,
		lastRange: null,
		continuationSince: null,
		exhausted: !1
	}), Re = Math.max(f * 3, f), X = yd({
		getShow: e,
		getPubkeyHex: n,
		getRxNostr: r,
		getRelayConfig: i,
		getLoadedPosts: () => y.loadedPosts,
		onChildInteractionBadgeRefreshRequested: l,
		onQuoteVisibleRangeRefreshRequested: u,
		quoteVisibleRangeRepairExecutor: d
	}), Z = U(() => y.searchQuery.length > 0), ze = U(() => y.currentViewRefetchStatus === "refetching"), Be = U(() => C(Z) ? y.searchPosts : y.loadedPosts), Ve = U(() => C(Z) ? y.searchPage : 1), He = U(() => C(Z) ? y.searchTotalCount : y.totalCount), Ue = U(() => C(Z) ? Math.max(1, Math.ceil(y.searchTotalCount / f)) : 1), We = U(() => !C(ze) && C(Z) && y.searchPage > 1), Ge = U(() => C(We)), Ke = U(() => !C(ze) && !C(le) && C(Z) && y.searchHasNext), Je = U(() => C(Ke)), Ye = U(() => !1), Xe = U(() => !C(ze) && (C(Z) ? !C(le) && y.searchHasNext : y.hasOlderLocal)), Ze = U(() => !C(ze) && !C(Z) && y.hasNewerLocal), Qe = U(() => !C(Z) && !C(ze) && (y.listingMode === "sparse" || y.hasNewerLocal)), $e = U(() => C(Be)[0]?.createdAt ?? null), et = U(() => C(Be).length > 0 ? C(Be)[C(Be).length - 1]?.createdAt ?? null : null), nt = U(() => !C(Z) && !C(ze) && y.hasOlderLocal && (y.listingMode === "sparse" || !(typeof C(et) == "number" && (y.visibleUntil === null ? y.hasJumpCacheAnchors : C(et) < y.visibleUntil)))), it = U(() => !C(Z) && !!n() && !C(ze) && (Ae !== null || y.syncStatus !== "syncing" && y.syncStatus !== "older-syncing") && (!!r() && !C(De) && !Le.exhausted || !!tt.localRelayUrl && C(k) === $t.getSessionGeneration() && !C(we) && C(K) && $t.isConfigured(n()))), at = U(() => !C(Z) && y.syncStatus === "older-syncing"), ot = U(() => !C(Z) && (y.syncStatus === "syncing" || y.syncStatus === "older-syncing")), st = U(() => !C(Z) && y.listingMode === "contiguous" && y.loadedPosts.length > 0 && !y.hasOlderLocal && y.syncStatus !== "syncing"), ct = U(() => !C(Z) && y.syncStatus !== "syncing" && y.listingMode === "contiguous" && typeof y.visibleUntil == "number" && y.loadedPosts.length > 0 && !y.hasOlderLocal && y.hasSavedPostsOutsideVisibleRange), lt = U(() => C(Be).length), ut = U(() => !!n() && !!r() && !C(Z) && y.loadedPosts.length > 0 && !C(ze) && y.syncStatus !== "syncing" && y.syncStatus !== "older-syncing"), dt = U(() => C(Z) || y.syncStatus === "idle" ? null : y.syncStatus === "syncing" || y.syncStatus === "older-syncing" ? "postHistory.syncing" : y.syncStatus === "synced" ? "postHistory.synced" : y.syncStatus === "no-more" ? null : "postHistory.syncFailed"), mt = U(() => !C(Z) && (y.syncStatus === "syncing" || y.syncStatus === "older-syncing")), gt = U(() => C(mt) || C(ze)), vt = U(() => y.currentViewRefetchStatus === "refetching" ? "postHistory.repairing" : y.currentViewRefetchMessageKey), bt = U(() => y.currentViewRefetchStatus === "refetching" ? null : y.currentViewRefetchMessageValues);
	function xt() {
		Ae?.resolve(!1), Ae = null, Oe += 1, N(De, !1), N(we, !1), Se += 1, xe?.cancel(), xe = null, ee = null, M = void 0, je += 1, be?.cancel(), be = null, y.syncStatus === "older-syncing" && (y.syncStatus = "idle");
	}
	function St(e, t) {
		Ae?.resolve(!1);
		let n, r = new Promise((e) => {
			n = e;
		}), i = {
			pending: t,
			succeeded: !1,
			changed: !1,
			resolve: n,
			promise: r
		};
		return Ae = i, y.syncStatus = e, i;
	}
	function wt(t, n, r) {
		--t.pending, t.succeeded ||= n, t.changed ||= n && r, (n || t.pending === 0) && t.resolve(t.changed), Ae === t && !R && e() && (t.succeeded ? y.syncStatus = t.changed ? "synced" : "idle" : t.pending === 0 && (y.syncStatus = "failed"), Gt());
	}
	function Tt(e) {
		let t = ke.then(e);
		return ke = t.catch(() => void 0), t;
	}
	function Et() {
		Se += 1, xe?.cancel(), xe = null, N(we, !1), N(w, [], !0), E = null, N(Ce, null), N(K, !0), kt();
	}
	function Ot(t, i = {}, a = {}) {
		let o = n();
		if (R || !e() || !o || !$t.isConfigured(o)) return null;
		if (xe) return xe;
		if (t === "older-backfill" && !C(K)) return null;
		let l = ++Se, u = r(), d = tt.localRelayUrl, p = $t.getSessionGeneration(), m = C(Ce), h = () => !R && e() && n() === o && r() === u && l === Se && tt.localRelayUrl === d && $t.getSessionGeneration() === p, g = $t.read({
			pubkeyHex: o,
			reason: t,
			...t === "older-backfill" && m === null ? {} : i,
			limit: t === "dialog-open-refresh" ? 30 : t === "repair-visible-range" ? 250 : 150,
			targets: y.loadedPosts.flatMap((e) => ge(e.rawEvent) ? [e.rawEvent] : []),
			isActive: h
		});
		N(we, !0);
		let _ = {
			cancel: g.cancel,
			promise: g.promise.then(async (e) => {
				if (!e || !h() || e.sessionGeneration !== p || await Dt.getLocalRevision(o) !== e.localRevision || !h()) return null;
				t !== "repair-visible-range" && (t !== "dialog-open-refresh" || m === null) && (N(K, e.hasMore && (t !== "older-backfill" || m === null || e.nextUntil !== null && e.nextUntil < m), !0), e.nextUntil !== null && N(Ce, Math.min(C(Ce) ?? e.nextUntil, e.nextUntil), !0));
				let n = !1;
				return await Tt(() => h() ? c(async () => {
					if (!h() || await Dt.getLocalRevision(o) !== e.localRevision || !h()) return;
					E = e.localRevision;
					let r = Lu(C(w), e.browsingRanges);
					if (n = JSON.stringify(r) !== JSON.stringify(C(w)), N(w, r, !0), kt(), C(b) === null) {
						let e = await Q.getLatestVisibleChunk({
							pubkeyHex: o,
							visibleUntil: null,
							limit: f
						});
						if (!h()) return;
						N(b, e.at(-1)?.createdAt ?? null, !0);
					}
					if (await Fn(o), h()) {
						if (t === "older-backfill" && y.loadedPosts.length) await hr({
							anchorEventId: a.anchorEventId,
							relayFetchViewportCommit: a.viewportCommit,
							useContiguousProgress: !1
						});
						else if (!y.loadedPosts.length || y.loadedPosts.length <= f && !y.hasNewerLocal && y.sparseSource === null) await cr({ forceTotalCount: !0 });
						else {
							let e = await Promise.all(y.loadedPosts.map((e) => Q.getByEventId(e.eventId)));
							if (!h()) return;
							y.loadedPosts = e.flatMap((e) => e?.pubkeyHex === o ? [e] : []);
						}
						h() && (nr({ force: !0 }), await sr(o), h() && await rr(o, y.visibleUntil));
					}
				}) : Promise.resolve()), !h() || await Dt.getLocalRevision(o) !== e.localRevision ? null : (h() && e.eventIds.length && await s(e.eventIds), {
					...e,
					changed: e.changed || n
				});
			}).catch(() => null).finally(() => {
				xe === _ && (xe = null, N(we, !1));
			})
		};
		return xe = _, _;
	}
	function kt() {
		J = null;
	}
	function At(e, t) {
		return !!e && !!t && e.postedAt === t.postedAt && e.createdAt === t.createdAt && e.eventId === t.eventId;
	}
	function Nt(e) {
		return e === je;
	}
	function Pt(t, r) {
		return e() && n() === t && r === z;
	}
	function It() {
		B = !1, N(ae, !1), N(oe, null), V = null;
	}
	async function Rt(e, t, n) {
		return await ie(), t() ? B ? (N(oe, Wd(e), !0), !0) : n() ? (await new Promise((e) => {
			requestAnimationFrame(() => requestAnimationFrame(() => e()));
		}), t() ? (B = !0, N(oe, Wd(e), !0), N(ae, !0), !0) : !1) : (B = !0, N(oe, Wd(e), !0), N(ae, !0), !0) : !1;
	}
	function zt() {
		Me?.cancel(), Me = null, X.cancelCurrentViewRepair(), y.currentViewRefetchStatus === "refetching" && (y.currentViewRefetchStatus = "idle"), Bt();
	}
	function Bt() {
		Y !== null && (clearTimeout(Y), Y = null);
	}
	function Vt() {
		Ne !== null && (clearTimeout(Ne), Ne = null);
	}
	function Ht() {
		Le.windowSeconds = Id, Le.nextUntil = null, Le.consecutiveEmptyCount = 0, Le.lastRange = null, Le.continuationSince = null, Le.exhausted = !1;
	}
	function Ut() {
		y.currentViewRefetchMessageKey = null, y.currentViewRefetchMessageValues = null, Bt();
	}
	function Wt() {
		Bt();
		let e = /* @__PURE__ */ new Set([
			"postHistory.repairNoChanges",
			"postHistory.repairAdded",
			"postHistory.repairChildInteractionsAdded",
			"postHistory.repairFetchFailed"
		]);
		e.has(y.currentViewRefetchMessageKey ?? "") && (Y = setTimeout(() => {
			y.currentViewRefetchMessageKey !== null && e.has(y.currentViewRefetchMessageKey) && (y.currentViewRefetchMessageKey = null, y.currentViewRefetchMessageValues = null), Y = null;
		}, 3500));
	}
	function Gt() {
		Vt(), (y.syncStatus === "synced" || y.syncStatus === "failed") && (Ne = setTimeout(() => {
			(y.syncStatus === "synced" || y.syncStatus === "failed") && (y.syncStatus = "idle"), Ne = null;
		}, 3500));
	}
	function Kt() {
		W += 1, N(le, !1), N(ue, "idle"), ad.clearCache?.(), It(), y.searchInput = "", y.searchQuery = "", y.searchPage = 1, y.searchPosts = [], y.searchTotalCount = 0, y.searchTotalCountKnown = !1, y.searchHasNext = !1, Fe = "", Yt(), Xt();
	}
	function qt() {
		kt(), er(), y.loadedPosts = [], $n({
			known: !1,
			status: "unknown"
		}), y.currentPage = 1, y.syncStatus = "idle", y.hasMoreRemote = !1, y.nextUntil = null, y.lastDialogOpenRefreshAt = null, y.visibleUntil = null, N(b, null), N(x, [], !0), N(S, [], !0), y.hasJumpCacheAnchors = !1, y.hasOlderLocal = !1, y.hasNewerLocal = !1, y.listingMode = "contiguous", y.sparseSource = null, y.hasSavedPostsOutsideVisibleRange = !1, y.latestOlderBackfillUiResult = null, Kt();
	}
	function Jt() {
		let e = Wd(n());
		return !!e && e === C(ve);
	}
	function Yt() {
		Jt() && Gu(n(), {
			searchInput: y.searchInput,
			searchQuery: y.searchQuery,
			currentPage: y.currentPage,
			searchPage: y.searchPage
		});
	}
	function Xt() {
		Jt() && qd(n(), {
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
			coverageAnchorCreatedAt: C(b),
			hasJumpCacheAnchors: y.hasJumpCacheAnchors,
			hasOlderLocal: y.hasOlderLocal,
			hasNewerLocal: y.hasNewerLocal
		});
	}
	function Zt(e) {
		N(ve, Wd(e), !0);
	}
	function en() {
		Et(), N(b, null), N(x, [], !0), N(S, [], !0), kt(), er(), X.resetOlderRevealRepairContext(), y.loadedPosts = [], y.searchPosts = [], $n({
			count: 0,
			known: !0,
			status: "ready"
		}), y.searchTotalCount = 0, y.searchTotalCountKnown = !1, y.searchHasNext = !1, y.currentPage = 1, y.searchPage = 1, y.hasMoreRemote = !1, y.nextUntil = null, y.lastDialogOpenRefreshAt = null, y.visibleUntil = null, y.hasJumpCacheAnchors = !1, y.hasOlderLocal = !1, y.hasNewerLocal = !1, y.listingMode = "contiguous", y.sparseSource = null, y.hasSavedPostsOutsideVisibleRange = !1, y.syncStatus = "idle", Ht(), Ut(), Vt(), Kt(), de = !0;
	}
	function nn() {
		return y.listingMode === "sparse" && (y.sparseSource === "saved" || y.sparseSource === "jump");
	}
	function an() {
		if (!nn()) return !1;
		let e = n();
		return qt(), Ht(), Ut(), Vt(), Ku(e), qd(e, { ...Ad }), !0;
	}
	function sn() {
		kt(), z += 1, W += 1, N(le, !1), N(ue, "idle");
	}
	function cn() {
		L++, xt(), zt(), sn(), er(), G++, C(he) === "loading" && (N(he, "idle"), pe = !1), y.syncStatus = "idle", Ut(), Vt(), X.resetOlderRevealRepairContext();
	}
	function ln() {
		Et(), L += 1;
		let e = an();
		return xt(), zt(), sn(), er(), ad.clearCache?.(), X.resetOlderRevealRepairContext(), e;
	}
	function fn() {
		Et(), L += 1, an(), xt(), zt(), sn(), er(), ad.clearCache?.(), X.resetOlderRevealRepairContext(), y.syncStatus = "idle", Ht(), Ut(), Vt(), de = !1, fe = !1, pe = !1, me = null, G += 1, N(he, "idle"), Ie = !1;
	}
	function pn(e) {
		let t = vn(e);
		y.hasMoreRemote = t, y.nextUntil = t ? e.nextUntil : null;
	}
	function mn(e) {
		vn(e) && y.nextUntil === null && (y.hasMoreRemote = !0, y.nextUntil = e.nextUntil);
	}
	async function gn(e, t = y.visibleUntil) {
		return (!C(w).length || Qn(y.visibleUntil)) && typeof C(et) == "number" && (t === null ? y.hasJumpCacheAnchors : C(et) < t) ? C(et) : typeof Le.nextUntil == "number" ? Le.nextUntil : Ud({
			nextUntil: y.nextUntil,
			visibleOldestCreatedAt: C(et),
			pubkeyHex: e,
			getOldestCreatedAt: (e) => Q.getOldestCreatedAt(e)
		});
	}
	function _n(e) {
		if (!Number.isFinite(e)) return null;
		let t = Math.trunc(e) - 1;
		return t < 0 ? null : {
			since: (typeof Le.continuationSince == "number" && Le.continuationSince <= t ? Le.continuationSince : null) ?? Math.max(0, t - Le.windowSeconds),
			until: t,
			windowSeconds: Le.windowSeconds
		};
	}
	function xn(e, t) {
		let n = [];
		return e.hasMore && n.push("hasMore"), e.rawCount >= t && n.push("rawCount"), e.perRelayCounts.some((e) => e.rawCount >= t) && n.push("perRelayRawCount"), n;
	}
	function Sn(e) {
		return typeof e.oldestCreatedAt == "number" ? e.oldestCreatedAt : e.events.reduce((e, t) => {
			let n = t.event.created_at;
			return Number.isFinite(n) && (e === null || n < e) ? Math.trunc(n) : e;
		}, null);
	}
	function Cn(e, t) {
		Le.nextUntil = e, Le.continuationSince = t, Le.exhausted = e === null, y.nextUntil = e, y.hasMoreRemote = e !== null;
	}
	function wn(e, t, n) {
		xn(t, n);
		let r = Sn(t);
		typeof r == "number" && r - e.since, t.rawCount ?? t.events.length, t.uniqueCount ?? t.events.length, typeof Le.nextUntil == "number" && _n(Le.nextUntil);
	}
	function Tn() {
		if (y.searchQuery) return [];
		let e = y.loadedPosts.map((e) => e.createdAt).filter((e) => Number.isFinite(e)).map((e) => Math.trunc(e));
		if (e.length === 0) return [];
		let t = Math.min(...e), n = Math.max(...e);
		return [{
			kinds: [...ft],
			rangeUnit: "custom",
			since: Math.max(0, t - Md),
			until: n + Md,
			limit: 250
		}];
	}
	async function En(e) {
		let t = Dn();
		return yn.transaction("r", jt(yn), async () => {
			let n = await ht(yn, e);
			return [
				await Dt.get(e, jd),
				await ll.get(e, jd),
				n,
				t ? await Ct.get(e, jd, t) : null,
				t
			];
		});
	}
	function Dn() {
		return se().runtimeKind === "standalone" ? qe(tt.localRelayUrl ?? "") : null;
	}
	function On(e) {
		e && e.localRelayUrl === Dn() && e.localRevision === O && (N(w, Lu(E === e.localRevision ? C(w) : [], e.browsingRanges), !0), E = e.localRevision, e.resumeHint && N(Ce, C(Ce) === null ? e.resumeHint.nextUntil : Math.min(C(Ce), e.resumeHint.nextUntil), !0));
	}
	async function kn(t) {
		if (R) return [];
		let r = L, a = dn(i()), [o, s, c, l, u] = await En(t), d = _t(o.relays, a), f = await Dt.getLocalRevision(t);
		return f !== c || f !== s.localRevision || R || r !== L || !e() || n() !== t ? [] : (N(x, d, !0), N(S, s.ranges, !0), O !== null && O !== f && Et(), O = f, u === Dn() && On(l), Lu(d, s.ranges));
	}
	async function An(e) {
		return Lu(await kn(e), E === O && Dn() ? C(w) : []);
	}
	async function $(e) {
		return C(b) === null ? Mn(e) : Mt(await kn(e), C(b));
	}
	async function jn(e) {
		return (await Un.get(e, jd))?.visibleUntil ?? null;
	}
	async function Mn(e) {
		if (C(b) === null) return jn(e);
		let t = C(b);
		return Mt(await An(e), t);
	}
	async function Nn(e) {
		let t = y.loadedPosts[0]?.createdAt;
		if (typeof t == "number") {
			let n = yt(await kn(e)).find((e) => e.since <= t && e.until >= t)?.since;
			if (typeof n == "number") return n;
		}
		return J?.pubkeyHex === e && typeof J.visibleUntil == "number" ? J.visibleUntil : Fn(e);
	}
	async function Pn(t, a, o, s = [...ft]) {
		let c = i(), l = L;
		return Vn({
			ownerPubkeyHex: t,
			rxNostr: a,
			kinds: s,
			relayConfig: c,
			getRelayConfig: i,
			isActive: () => l === L && Nt(o) && e() && n() === t && r() === a
		});
	}
	async function Fn(t, r = null) {
		let i = L, a = await Mn(t);
		return !R && i === L && e() && n() === t && (r === null || r === z) && (y.visibleUntil = a), a;
	}
	async function Ln(t, r = null) {
		let i = (await wd.getForPubkey(t, { maxCount: 1 })).length > 0;
		return e() && n() === t && (r === null || r === z) && (y.hasJumpCacheAnchors = i), i;
	}
	async function Rn(t, r) {
		let i = L, a = je, o = () => !R && i === L && a === je && e() && n() === t;
		if (C(b) === null) {
			let e = await Q.getLatestVisibleChunk({
				pubkeyHex: t,
				visibleUntil: null,
				limit: f
			});
			if (!o()) return null;
			N(b, e.length ? Math.min(...e.map((e) => e.createdAt)) : null, !0);
		}
		let s = await Mn(t);
		return o() && (y.visibleUntil = s), s;
	}
	async function Bn(e, t) {
		return Rn(e, t);
	}
	async function Hn(t, r, i) {
		let a = L, o = Me, s = await Mn(t);
		return !R && a === L && o === Me && e() && n() === t && (y.visibleUntil = s), s;
	}
	async function Wn(e, t) {
		return typeof t == "number" ? Q.countVisibleForPubkey(e, t) : Q.countForPubkey(e);
	}
	async function Gn(e, t) {
		if (typeof t == "number") return Q.countVisibleForPubkey(e, t);
		let n = ce;
		return n?.pubkeyHex === e && (await n.promise, y.totalCountKnown) || y.totalCountKnown ? y.totalCount : Q.countForPubkey(e);
	}
	function Kn(e, t) {
		return C(Z) || y.listingMode !== "contiguous" || y.sparseSource !== null || n() !== e || y.visibleUntil !== t.visibleUntil ? !1 : At(ir(y.loadedPosts[y.loadedPosts.length - 1]), t.oldestCursor);
	}
	async function Jn(t, r) {
		let i = J;
		if (!i || i.pubkeyHex !== t) return null;
		let a = await Fn(t, r);
		if (!e() || n() !== t || r !== z || !Kn(t, i)) return null;
		let [o, s] = await Promise.all([Promise.resolve(pt(t)), Gn(t, a)]);
		return !Kn(t, i) || o !== i.revision || s !== i.totalVisibleCount ? null : i;
	}
	async function Yn(t, r, i, a, o) {
		if (kt(), i.length === 0 || !e() || n() !== t || r !== z || y.listingMode !== "contiguous" || y.sparseSource !== null) return !1;
		let s = await Gn(t, a), c = y.visibleUntil, l = pt(t);
		if (l !== o || c !== a || !e() || n() !== t || r !== z || y.listingMode !== "contiguous" || y.sparseSource !== null || y.loadedPosts[0]?.eventId !== i[0]?.eventId || y.loadedPosts[y.loadedPosts.length - 1]?.eventId !== i[i.length - 1]?.eventId) return !1;
		let u = ir(i[i.length - 1]);
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
		if (!a || a.pubkeyHex !== t || C(Z) || y.listingMode !== "contiguous" || y.sparseSource !== null || n() !== t || !i.preserveReachedVisibleCount) return !1;
		let o = ir(y.loadedPosts[y.loadedPosts.length - 1]);
		if (!At(o, a.oldestCursor)) return !1;
		let s = await Gn(t, r);
		return !e() || n() !== t || !At(o, ir(y.loadedPosts[y.loadedPosts.length - 1])) ? !1 : (J = {
			...a,
			visibleUntil: r,
			revision: pt(t),
			totalVisibleCount: s
		}, !0);
	}
	async function Zn() {
		kt(), await cr();
	}
	function Qn(e, t = y.loadedPosts) {
		if (y.listingMode === "sparse" || y.hasJumpCacheAnchors) return !0;
		let n = t.length > 0 ? t[t.length - 1]?.createdAt ?? null : null;
		return typeof n == "number" ? e === null ? y.hasJumpCacheAnchors : n < e : !1;
	}
	function $n({ count: e, known: t, status: n }) {
		typeof e == "number" && (y.totalCount = e), y.totalCountKnown = t, y.totalCountStatus = n;
	}
	function er() {
		H += 1, ce = null, $n({
			known: y.totalCountKnown,
			status: y.totalCountKnown ? "ready" : "unknown"
		});
	}
	function tr(t, { force: r = !1 } = {}) {
		if (!e() || n() !== t || !r && ce?.pubkeyHex === t) return;
		let i = ++H;
		$n({
			known: y.totalCountKnown,
			status: y.totalCountKnown ? "refreshing" : "loading"
		}), ce = {
			requestId: i,
			pubkeyHex: t,
			promise: Q.countForPubkey(t).then((r) => {
				i === H && e() && n() === t && $n({
					count: r,
					known: !0,
					status: "ready"
				});
			}).catch(() => {
				i === H && e() && n() === t && $n({
					known: y.totalCountKnown,
					status: "failed"
				});
			}).finally(() => {
				ce?.requestId === i && (ce = null);
			})
		};
	}
	function nr({ force: t = !1 } = {}) {
		let r = n();
		r && e() && tr(r, { force: t });
	}
	async function rr(t, r, i = null, a = null) {
		let o = typeof r == "number" && await Q.hasPostsBeforeCreatedAt(t, r);
		!e() || n() !== t || i !== null && i !== z || a !== null && !Nt(a) || (y.hasSavedPostsOutsideVisibleRange = o);
	}
	function ir(e) {
		return e ? {
			eventId: e.eventId,
			postedAt: e.postedAt,
			createdAt: e.createdAt
		} : null;
	}
	function ar(e, t) {
		return e.length <= Re ? e : t === "older" ? e.slice(e.length - Re) : e.slice(0, Re);
	}
	function or(e, t, n) {
		return Od({
			currentPosts: e,
			olderPosts: t,
			anchorEventId: n,
			maxVisiblePosts: Re,
			keepAbove: f
		});
	}
	async function sr(t, r = y.loadedPosts, i = null, a = {}) {
		let o = L, s = je;
		if (R || !e() || a.deferDuringOlderRelayFetch && C(at)) return;
		if (r.length === 0) {
			e() && n() === t && (i === null || i === z) && (y.hasOlderLocal = !1, y.hasNewerLocal = !1);
			return;
		}
		let c = ir(r[0]), l = ir(r[r.length - 1]), u = y.visibleUntil, d = y.sparseSource === "saved" && typeof u == "number" ? c ? Q.getSparseChunk({
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
		if (_.length !== r.length || (_[0]?.eventId ?? null) !== h || (_[_.length - 1]?.eventId ?? null) !== g || u !== y.visibleUntil) return a.retried || !v ? void 0 : sr(t, _, x, {
			...a,
			retried: !0
		});
		let S = v && b, w = a.deferDuringOlderRelayFetch && (C(at) || s !== je);
		if (o !== L && !a.retried && v && !w) return sr(t, y.loadedPosts, x, {
			...a,
			retried: !0
		});
		if (!b && !a.retried && v && !w) return sr(t, y.loadedPosts, null, {
			...a,
			retried: !0
		});
		S && o === L && !w && (y.hasNewerLocal = p.length > 0, a.skipOlderCheck || (y.hasOlderLocal = m.length > 0));
	}
	async function cr({ forceTotalCount: t = !1, skipTotalCountRefresh: r = !1, skipOlderAvailabilityCheck: i = !1, awaitProgress: a = !1, awaitAvailability: o = !1 } = {}) {
		kt();
		let s = n();
		if (!s) {
			N(ve, null), qt();
			return;
		}
		let c = ++z, l = await Fn(s, c), u = pt(s), d = await Q.getLatestVisibleChunk({
			pubkeyHex: s,
			limit: f,
			visibleUntil: l
		});
		if (!e() || n() !== s || c !== z) return;
		Zt(s), y.listingMode = "contiguous", y.sparseSource = null, y.loadedPosts = d, y.hasNewerLocal = !1;
		let p = d.length > 0 ? Math.min(...d.map((e) => e.createdAt)) : null, m = C(b) !== p;
		if (N(b, p, !0), !await Rt(s, () => Pt(s, c), () => y.loadedPosts.length > 0) || m && (l = await Fn(s, c), !Pt(s, c))) return;
		r || nr({ force: t }), Ln(s, c).catch(() => {});
		let h = Yn(s, c, d, l, u), g = !1;
		a ? g = await h.catch(() => (kt(), !1)) : h.catch(() => {
			kt();
		});
		let _ = i && g;
		i && !_ ? y.hasOlderLocal = !1 : _ && J && (y.hasOlderLocal = J.totalVisibleCount > J.reachedVisibleCount);
		let v = rr(s, l, c).catch(() => {}), x = sr(s, d, c, { skipOlderCheck: _ }).then(() => {
			e() && n() === s && c === z && jr(s, d);
		}).catch(() => {});
		o && await Promise.all([v, x]);
	}
	async function lr({ skipTotalCountRefresh: t = !1 } = {}) {
		kt();
		let r = n();
		if (!r || y.loadedPosts.length === 0) {
			await cr({ skipTotalCountRefresh: t });
			return;
		}
		let i = y.loadedPosts[0], a = ir(i);
		if (!a) {
			await cr({ skipTotalCountRefresh: t });
			return;
		}
		let o = ++z, s = await Fn(r), c = Qn(s, y.loadedPosts) ? await Q.getVisibleChunkFromCreatedAt({
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
		e() && o === z && (y.loadedPosts = c, await Rt(r, () => Pt(r, o), () => y.loadedPosts.length > 0) && (t || nr(), await sr(r, c, o)));
	}
	function ur(e, t) {
		return !!e && (!t || e.requestedAt > t.savedAt);
	}
	async function dr(t, r) {
		kt();
		let i = n(), a = y.loadedPosts, s = ir(a[0]), c = ir(a[a.length - 1]);
		if (!i || !e() || a.length === 0) return;
		let l = ++z, u = await Fn(i), [d, f] = await Promise.all([s ? Q.getNewerVisibleChunk({
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
		e() && l === z && (ur(r, t) ? (o(), await cr()) : (y.hasNewerLocal = d.length > 0, y.hasOlderLocal = f.length > 0, await Rt(i, () => Pt(i, l), () => y.loadedPosts.length > 0) && (nr(), await sr(i, y.loadedPosts, l), Pt(i, l) && jr(i, y.loadedPosts))));
	}
	function fr() {
		let e = a();
		return !e || e.mode !== "normal" || e.pubkeyHex !== n() ? null : e;
	}
	function pr(e) {
		return C(Z) || y.loadedPosts.length === 0 || !e ? !1 : y.loadedPosts.some((t) => t.eventId === e.anchor.eventId);
	}
	async function mr(t) {
		kt();
		let r = n();
		if (!r || !e()) return !1;
		let i = ++z, a = await Fn(r), s = await Q.getVisibleChunkAroundEventId({
			pubkeyHex: r,
			visibleUntil: a,
			eventId: t.anchor.eventId,
			limit: Re,
			keepAbove: f
		});
		return !e() || i !== z ? !1 : s.length === 0 ? (o(), await cr(), !1) : (y.loadedPosts = s, !await Rt(r, () => Pt(r, i), () => y.loadedPosts.length > 0) || (nr(), await sr(r, s, i), !Pt(r, i)) ? !1 : (jr(r, s), !0));
	}
	async function hr(t = {}) {
		let r = y.loadedPosts, i = t.metrics;
		i && (i.loadedPostsBeforeLength = r.length, i.loadedPostsAfterLength = r.length, i.olderPostsLength = 0, i.visibleOldestBefore = r.length > 0 ? r[r.length - 1]?.createdAt ?? null : null, i.visibleOldestAfter = r.length > 0 ? r[r.length - 1]?.createdAt ?? null : null, i.didTrimForOlderAppend = !1, i.didDeferOlderPosts = !1, i.maxVisiblePosts = Re);
		let a = n(), o = ir(y.loadedPosts[y.loadedPosts.length - 1]);
		if (!a || !o) return await cr(), i && (i.loadedPostsAfterLength = y.loadedPosts.length, i.olderPostsLength = y.loadedPosts.length, i.visibleOldestAfter = y.loadedPosts.length > 0 ? y.loadedPosts[y.loadedPosts.length - 1]?.createdAt ?? null : null), y.loadedPosts.length > 0;
		let s = t.useContiguousProgress !== !1 && J !== null, c = t.preserveContiguousProgressAfterDatabaseChange ? J : null, l = ++z, u = s ? await Jn(a, l) : null;
		if (s && !u) return await Zn(), i && (i.loadedPostsAfterLength = y.loadedPosts.length, i.visibleOldestAfter = y.loadedPosts.length > 0 ? y.loadedPosts[y.loadedPosts.length - 1]?.createdAt ?? null : null), !1;
		let d = u?.visibleUntil ?? await Fn(a, l), p = u ? Math.max(0, u.totalVisibleCount - u.reachedVisibleCount) : f;
		if (u && p === 0) return y.hasOlderLocal = !1, i && (i.loadedPostsAfterLength = y.loadedPosts.length, i.visibleOldestAfter = y.loadedPosts.length > 0 ? y.loadedPosts[y.loadedPosts.length - 1]?.createdAt ?? null : null), await sr(a, y.loadedPosts, l, { skipOlderCheck: !0 }), !1;
		let m = Math.min(f, p), h = await Q.getOlderVisibleChunk({
			pubkeyHex: a,
			visibleUntil: d,
			cursor: o,
			limit: m
		});
		if (i && (i.olderPostsLength = h.length), !e() || l !== z) return !1;
		let g = u ? await Jn(a, l) : null;
		if (u && !g) return await Zn(), !1;
		if (h.length === 0) return u ? await Zn() : y.hasOlderLocal = !1, i && (i.loadedPostsAfterLength = y.loadedPosts.length, i.visibleOldestAfter = y.loadedPosts.length > 0 ? y.loadedPosts[y.loadedPosts.length - 1]?.createdAt ?? null : null), !1;
		let _ = t.autoLoadViewportCommit ? t.autoLoadViewportCommit.captureAnchorEventId() : null;
		if (t.autoLoadViewportCommit && !_) return !1;
		let v = t.relayFetchViewportCommit?.captureAnchorEventId(), b = or(r, h, _ ?? v ?? t.anchorEventId), x = t.reason === "normal-older-reveal" ? kd(r, b.posts) : [];
		if (t.autoLoadViewportCommit && (!_ || !b.posts.some((e) => e.eventId === _) || x.length === 0) || t.autoLoadViewportCommit && !t.autoLoadViewportCommit.canCommitWindowChange("older", r, b.posts)) return !1;
		y.loadedPosts = b.posts, x.length > 0 && X.scheduleOlderRevealRepair(x), b.didDeferOlderPosts && (y.hasOlderLocal = !0), b.didTrimForOlderAppend && (y.hasNewerLocal = !0);
		let S = x.length;
		g ? J = {
			...g,
			reachedVisibleCount: Math.min(g.totalVisibleCount, g.reachedVisibleCount + S),
			oldestCursor: ir(b.posts[b.posts.length - 1]) ?? g.oldestCursor
		} : !s && c && pt(a) === c.revision && (At(o, c.oldestCursor) ? J = {
			...c,
			reachedVisibleCount: Math.min(c.totalVisibleCount, c.reachedVisibleCount + S),
			oldestCursor: ir(b.posts[b.posts.length - 1]) ?? c.oldestCursor
		} : kt());
		let C = s && g !== null && J !== null, w = !!J && J.reachedVisibleCount >= J.totalVisibleCount;
		return C && J && (y.hasOlderLocal = J.totalVisibleCount > J.reachedVisibleCount), i && (i.loadedPostsAfterLength = b.posts.length, i.visibleOldestAfter = b.posts.length > 0 ? b.posts[b.posts.length - 1]?.createdAt ?? null : null, i.didTrimForOlderAppend = b.didTrimForOlderAppend, i.didDeferOlderPosts = b.didDeferOlderPosts), t.autoLoadViewportCommit?.onCommitted(), t.relayFetchViewportCommit?.onCommitted(), C ? (sr(a, b.posts, l, { skipOlderCheck: !0 }).catch(() => void 0), !0) : (await sr(a, b.posts, l, { skipOlderCheck: s && w }), !0);
	}
	async function gr(t, n, r = {}) {
		kt();
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
		let s = or(i, o, r.relayFetchViewportCommit?.captureAnchorEventId() ?? r.anchorEventId);
		return y.loadedPosts = s.posts, r.relayFetchViewportCommit && s.didTrimForOlderAppend && (y.hasNewerLocal = !0), r.relayFetchViewportCommit?.onCommitted(), await sr(t, s.posts, n), s.didDeferOlderPosts && (y.hasOlderLocal = !0), !0;
	}
	async function _r(t, n, r = {}) {
		kt();
		let i = y.loadedPosts;
		if (typeof y.visibleUntil != "number") return !1;
		let a = ir(i[i.length - 1]);
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
		let s = or(i, o, r.relayFetchViewportCommit?.captureAnchorEventId() ?? r.anchorEventId);
		return y.loadedPosts = s.posts, r.relayFetchViewportCommit && s.didTrimForOlderAppend && (y.hasNewerLocal = !0), r.relayFetchViewportCommit?.onCommitted(), await sr(t, s.posts, n), s.didDeferOlderPosts && (y.hasOlderLocal = !0), !0;
	}
	async function vr(t) {
		let r = n(), i = ir(y.loadedPosts[0]);
		if (!r || !i) return !1;
		let a = ++z, o = J, s = o ? await Jn(r, a) : null;
		if (o && !s) return await Zn(), !1;
		let c = s?.visibleUntil ?? await Fn(r, a), l = await Q.getNewerVisibleChunk({
			pubkeyHex: r,
			visibleUntil: c,
			cursor: i,
			limit: f
		});
		if (!e() || a !== z) return !1;
		if (l.length === 0) return y.hasNewerLocal = !1, !1;
		if (s && !await Jn(r, a)) return await Zn(), !1;
		let u = t?.captureAnchorEventId();
		if (t && !u) return !1;
		let d = y.loadedPosts, p = ar([...l, ...d], "newer");
		if (t && !p.some((e) => e.eventId === u) || t && !t.canCommitWindowChange("newer", d, p)) return !1;
		y.loadedPosts = p;
		let m = Math.max(0, d.length + l.length - p.length);
		return s && (J = {
			...s,
			reachedVisibleCount: Math.max(0, s.reachedVisibleCount - m),
			oldestCursor: ir(p[p.length - 1]) ?? s.oldestCursor
		}), t && m > 0 && (y.hasOlderLocal = !0), t?.onCommitted(), await sr(r, p, a), !(!e() || a !== z);
	}
	async function yr(t) {
		kt();
		let a = n();
		if (!a) return !1;
		let o = ++z, s = await Fn(a), c = await Q.getVisibleChunkFromCreatedAt({
			pubkeyHex: a,
			visibleUntil: s,
			createdAt: t,
			limit: f
		});
		if (!e() || o !== z) return !1;
		if (c.length === 0) return nr(), y.loadedPosts = [], y.hasOlderLocal = !1, y.hasNewerLocal = !1, !1;
		if (!Fd(c, t) || t <= 0) return nr(), y.listingMode = "contiguous", y.sparseSource = null, y.loadedPosts = c, Ht(), await sr(a, c, o), !0;
		let l = await wd.hasNearbyAnchorForPubkey({
			pubkeyHex: a,
			targetCreatedAt: t
		});
		if (!e() || o !== z) return !1;
		if (l) {
			let n = await Q.getVisibleChunkFromCreatedAt({
				pubkeyHex: a,
				visibleUntil: s,
				createdAt: t,
				limit: f,
				query: { contiguous: !1 }
			});
			if (!e() || o !== z) return !1;
			if (!Fd(n, t)) return nr(), y.listingMode = "sparse", y.sparseSource = "jump", y.loadedPosts = n, Ht(), await sr(a, n, o), !0;
		}
		let u = r();
		if (!u) return nr(), y.listingMode = "contiguous", y.sparseSource = null, y.loadedPosts = c, Ht(), await sr(a, c, o), !0;
		xt();
		let d = ++je;
		y.syncStatus = "syncing";
		let p = Math.max(0, t - Nd), m = t, h = await ht(yn, a), g = await Pn(a, u, d);
		if (!g.isActive()) return !1;
		let _ = on.fetchLatest(u, {
			pubkeyHex: a,
			relayConfig: i(),
			reason: "repair-visible-range",
			limit: Pd,
			since: p,
			until: m
		});
		be = _;
		let v = await _.promise;
		if (!Nt(d) || be !== _) return !1;
		if (be = null, !g.isActive() || v.status === "cancelled") return y.syncStatus = "idle", !1;
		if (v.events.length > 0 || v.relayFetchCoverage?.length) {
			if ((await qn(v, g)).applied === !1 || !g.isActive()) return !1;
			await wd.addForPubkey({
				pubkeyHex: a,
				centerCreatedAt: t,
				radiusSec: Nd,
				fetchedAt: v.fetchedAt,
				localWriteScope: {
					ownerPubkeyHex: a,
					expectedRevision: h,
					isActive: () => g.isActive()
				}
			}), y.hasJumpCacheAnchors = !0;
		}
		if (!e() || o !== z) return y.syncStatus = "idle", !1;
		let b = await Q.getVisibleChunkFromCreatedAt({
			pubkeyHex: a,
			visibleUntil: s,
			createdAt: t,
			limit: f,
			query: { contiguous: !1 }
		});
		return !e() || o !== z ? (y.syncStatus = "idle", !1) : (y.syncStatus = "idle", !Fd(b, t) && (nr({ force: v.events.length > 0 }), y.listingMode = "sparse", y.sparseSource = "jump", y.loadedPosts = b, Ht(), await sr(a, b, o), X.repairJump({
			ownerPubkeyHex: a,
			rxNostr: u,
			visiblePosts: b,
			isActive: () => e() && n() === a && r() === u && o === z
		}).catch(() => void 0), !0));
	}
	async function br(t) {
		kt();
		let r = n();
		if (!r || !t) return !1;
		let i = ++z, a = await Fn(r, i), o = (e) => Q.getVisibleChunkAroundEventId({
			pubkeyHex: r,
			visibleUntil: e,
			eventId: t,
			limit: Re,
			keepAbove: f
		}), s = await o(a);
		if (!e() || i !== z) return !1;
		let c = s.some((e) => e.eventId === t), l = !1;
		return !c && typeof a == "number" && (s = await o(null), l = !0, !e() || i !== z) || !s.some((e) => e.eventId === t) ? !1 : (nr(), y.listingMode = l ? "sparse" : "contiguous", y.sparseSource = l ? "jump" : null, y.loadedPosts = s, y.hasOlderLocal = !1, y.hasNewerLocal = !1, Ht(), sr(r, s, i).catch(() => void 0), !0);
	}
	function xr(e, t) {
		let n = [...e], r = new Set(e.map((e) => e.eventId));
		for (let e of t) r.has(e.eventId) || (r.add(e.eventId), n.push(e));
		return n;
	}
	function Sr(t, r, i) {
		return t === W && e() && n() === i && r === y.searchQuery;
	}
	async function Cr(e, t, r, i = !1) {
		let a = n();
		if (!a || !t) return null;
		let o = { items: null }, s = await ad.searchLocalPosts({
			pubkeyHex: a,
			query: t,
			page: e,
			pageSize: f,
			onProgress: i ? async (e) => {
				Sr(r, t, a) && (o.items = e.items, y.searchPosts = e.items, y.searchTotalCountKnown = !1, y.searchHasNext = !1, e.phase === "partial" && !B && await Rt(a, () => Sr(r, t, a), () => y.searchPosts.length > 0));
			} : void 0
		});
		if (!Sr(r, t, a)) return null;
		let c = o.items;
		return c !== null && c.length === s.items.length && s.items.every((e, t) => e === c[t]) ? {
			...s,
			items: y.searchPosts
		} : s;
	}
	async function wr(e, t) {
		let r = n();
		if (!r || !t) return y.searchPosts = [], y.searchTotalCount = 0, y.searchTotalCountKnown = !1, y.searchHasNext = !1, !1;
		let i = ++W, a = Math.max(1, Math.trunc(e));
		N(le, !0), N(ue, "loading"), y.searchTotalCountKnown = !1;
		try {
			let e = await Cr(a, t, i, a === 1);
			if (!e) return !1;
			let n = Qt(a, e.total, f);
			return n === a ? (y.searchTotalCount = e.total, y.searchTotalCountKnown = !0, y.searchPosts = a === 1 ? e.items : xr(y.searchPosts, e.items), y.searchPage = n, y.searchHasNext = e.hasNext, N(ue, "ready"), !(!B && !await Rt(r, () => Sr(i, t, r), () => y.searchPosts.length > 0))) : (i === W && Sr(i, t, r) && N(ue, "ready"), !1);
		} catch {
			return i === W && N(ue, "failed"), !1;
		} finally {
			i === W && N(le, !1);
		}
	}
	async function Tr(e, t, r = ++W) {
		let i = n();
		if (!i || !t) return !1;
		let a = Math.max(1, Math.trunc(e));
		N(le, !0), N(ue, "loading"), y.searchTotalCountKnown = !1;
		try {
			let e = await Cr(1, t, r, a === 1);
			if (!e) return !1;
			let n = Qt(a, e.total, f), o = e.items, s = e;
			for (let e = 2; e <= n; e += 1) {
				let n = await Cr(e, t, r);
				if (!n) return !1;
				o = xr(o, n.items), s = n;
			}
			return y.searchPosts = o, y.searchTotalCount = e.total, y.searchTotalCountKnown = !0, y.searchPage = n, y.searchHasNext = s.hasNext, N(ue, "ready"), !(!B && !await Rt(i, () => Sr(r, t, i), () => y.searchPosts.length > 0));
		} catch {
			return r === W && N(ue, "failed"), !1;
		} finally {
			r === W && N(le, !1);
		}
	}
	async function Er() {
		kt();
		let t = n(), a = r();
		if (!t || !a) return;
		xt();
		let o = ++je, c = Ot("bootstrap"), l = St("syncing", c ? 2 : 1);
		c && c.promise.then((e) => wt(l, !!e, e?.changed ?? !1));
		let u = ++Oe;
		N(De, !0);
		let d = !1, p = !1;
		try {
			let r = await Fn(t);
			if (!Nt(o) || !e() || n() !== t) return;
			let c = await Pn(t, a, o);
			if (!c.isActive()) return;
			let l = on.fetchLatest(a, {
				pubkeyHex: t,
				relayConfig: i(),
				reason: "bootstrap",
				limit: 150,
				timeoutMs: Ft
			});
			be = l;
			let u = await l.promise, m = {
				insertedCount: 0,
				updatedCount: 0,
				unchangedCount: 0,
				appliedDeletionCount: 0
			};
			if (!Nt(o) || be !== l || (be = null, !c.isActive() || u.status === "cancelled")) return;
			if (u.events.length > 0 || u.relayFetchCoverage?.length) {
				let e = await qn(u, c);
				if (e.applied === !1 || !c.isActive()) return;
				m = e;
				let t = Dd(u.events);
				t.length > 0 && await s(t);
			}
			if (!Nt(o) || !e()) return;
			let h = await Rn(t, u);
			if (!Nt(o) || !e()) return;
			let g = h !== r;
			pn(u), await Tt(async () => {
				c.isActive() && (y.searchQuery ? await Tr(y.searchPage, y.searchQuery) : y.loadedPosts.length === 0 || !y.hasNewerLocal && (!C(w).length || y.loadedPosts.length <= f) ? await cr({ forceTotalCount: m.insertedCount + m.updatedCount > 0 }) : (nr({ force: m.insertedCount + m.updatedCount > 0 }), await sr(t)));
			}), d = u.status === "success" && c.isActive(), p = m.insertedCount + m.updatedCount > 0 || g;
		} finally {
			u === Oe && N(De, !1), wt(l, d, p);
		}
	}
	function Dr(e, t) {
		return t === null ? e.at(-1) : e.find((e) => e.since <= t && e.until >= t) ?? e.filter((e) => e.until < t).at(-1) ?? e.at(-1);
	}
	function Or() {
		if (ee === null || M === void 0 && be === null) return !1;
		let e = Dr(C(A), C(b));
		return e !== void 0 && C(S).some((t) => t.since <= e.until && t.until >= e.until) && (M === void 0 || e.until + 1 > M);
	}
	async function kr() {
		let t = n(), a = r();
		if (!t || !a) return;
		xt();
		let o = ++je;
		ee = o;
		let c = Ot("dialog-open-refresh"), l = St("syncing", c ? 2 : 1);
		c && c.promise.then((e) => wt(l, !!e, e?.changed ?? !1));
		let u = ++Oe;
		N(De, !0);
		let d = !1, p = !1;
		try {
			y.lastDialogOpenRefreshAt = Date.now();
			let c = Math.floor(y.lastDialogOpenRefreshAt / 1e3), l = L, u = i(), m = () => !R && l === L && Nt(o) && e() && n() === t && r() === a, h = await Dt.getLocalRevision(t), g = await Fn(t), _ = await kn(t), v = [...C(S)], T = C(b), E = Dr(_, T), D = E && C(S).some((e) => e.since <= E.until && e.until >= E.until), O = E ? Math.min(E.until, c) + +!!D : void 0;
			if (M = O, !m()) return;
			if (O !== void 0 && O > c) {
				d = !0, ee = null;
				return;
			}
			let k = c, A = c + 1, j = !1, N, P = {
				insertedCount: 0,
				updatedCount: 0
			};
			for (;;) {
				let e = zn.runAuthored(a, {
					ownerPubkeyHex: t,
					relayConfig: u,
					getRelayConfig: i,
					isActive: m,
					expectedLocalRevision: h,
					reason: j ? "dialog-open-catchup" : "dialog-open-refresh",
					...O === void 0 ? {} : { since: O },
					until: k,
					limit: j ? 150 : 30,
					timeoutMs: rn,
					onSavedSelfPosts: s
				});
				be = e;
				let n = await e.promise;
				if (!m() || be !== e) return;
				if (be = null, N = n.fetchResult, N.status === "cancelled") {
					ee = null;
					return;
				}
				if (P.insertedCount += n.upsertSummary.insertedCount, P.updatedCount += n.upsertSummary.updatedCount, O === void 0) break;
				let r = await kn(t);
				if (!m()) return;
				let o = r.find((e) => e.since <= c && e.until >= c)?.since ?? c + 1;
				if (o <= O || j && o >= A) break;
				A = o, k = Math.min(c, A - 1), j = !0;
			}
			let F = await Rn(t, N);
			if (!Nt(o) || !e()) return;
			let te = T === null ? F : Mt(Lu(C(x), v), T), I = qu({
				insertedCount: P.insertedCount,
				updatedCount: P.updatedCount,
				previousVisibleUntil: g,
				nextVisibleUntil: te,
				searchQuery: y.searchQuery,
				loadedPostsLength: y.loadedPosts.length,
				hasNewerLocal: y.hasNewerLocal
			});
			if (mn(N), await Tt(async () => {
				if (m()) {
					if (C(w).length && (y.loadedPosts.length > f || y.hasNewerLocal)) kt(), nr({ force: I.didMateriallyChange }), await sr(t);
					else if (I.applyAction === "reload-search-page") await Tr(y.searchPage, y.searchQuery);
					else if (I.applyAction === "load-latest-visible-posts") {
						let e = I.didMateriallyChange && !I.didVisibleMateriallyChange;
						await cr({
							forceTotalCount: I.didMateriallyChange,
							skipOlderAvailabilityCheck: e,
							awaitProgress: e,
							awaitAvailability: !0
						});
					} else I.applyAction === "refresh-count-and-availability" && (I.didMateriallyChange ? await cr({
						forceTotalCount: I.didMateriallyChange,
						skipOlderAvailabilityCheck: !I.didVisibleMateriallyChange,
						awaitProgress: !I.didVisibleMateriallyChange,
						awaitAvailability: !0
					}) : (kt(), nr({ force: I.didMateriallyChange }), await sr(t)));
				}
			}), !m()) return;
			d = N.status === "success", p = I.didMateriallyChange, ee = null;
		} finally {
			u === Oe && N(De, !1), wt(l, d, p);
		}
	}
	function Ar() {
		return typeof y.lastDialogOpenRefreshAt != "number" || Date.now() - y.lastDialogOpenRefreshAt >= hn;
	}
	function jr(t, i) {
		if (de || !e() || n() !== t || !r()) return;
		if (de = !0, i.length === 0) {
			Er();
			return;
		}
		let a = C(A).at(-1)?.until, o = C(b), s = a !== void 0 && i.some((e) => e.createdAt > a) || o !== null && !C(A).some((e) => e.since <= o && e.until >= o);
		if (fe || s || Ar()) fe = !1, kr();
		else {
			let e = Ot("dialog-open-refresh");
			if (e) {
				let t = St("syncing", 1);
				e.promise.then((e) => wt(t, !!e, e?.changed ?? !1));
			}
		}
	}
	function Mr() {
		return !C(Z) || !C(We) ? !1 : (--y.searchPage, !0);
	}
	function Nr() {
		return !C(Z) || !C(Ge) ? !1 : (y.searchPage = 1, !0);
	}
	async function Pr() {
		return !C(Z) || !C(Ke) ? !1 : wr(y.searchPage + 1, y.searchQuery);
	}
	async function Fr() {
		return !C(Z) || !C(Je) ? !1 : (y.searchPage = C(Ue), !0);
	}
	async function Ir(t) {
		if (!C(Z) && C(w).length) {
			let r = !1, i = n();
			return await Tt(async () => {
				!R && e() && n() === i && (r = await Lr(t));
			}), r;
		}
		return Lr(t);
	}
	async function Lr(e) {
		if (C(Z)) return Pr();
		if (y.sparseSource === "saved") {
			let e = n();
			return e ? _r(e, ++z, { reason: "normal-older-reveal" }) : !1;
		}
		if (y.sparseSource === "jump") {
			let e = n();
			return e ? gr(e, ++z, { reason: "normal-older-reveal" }) : !1;
		}
		return hr({
			reason: "normal-older-reveal",
			autoLoadViewportCommit: e
		});
	}
	async function Rr(e) {
		return C(Z) ? Promise.resolve(Mr()) : y.sparseSource === "saved" ? Kr() : vr(e);
	}
	async function zr() {
		return C(Z) ? Promise.resolve(Nr()) : (await cr(), !0);
	}
	async function Br() {
		let t = n();
		if (!t) return !1;
		let r = await Nn(t);
		if (typeof r != "number") return !1;
		let i = ++z, a = await Q.getSparseChunk({
			pubkeyHex: t,
			visibleUntil: r,
			direction: "latest",
			limit: f
		});
		return !e() || n() !== t || i !== z ? !1 : a.length === 0 ? (y.hasSavedPostsOutsideVisibleRange = !1, !1) : (y.listingMode = "sparse", y.sparseSource = "saved", y.loadedPosts = a, nr(), await sr(t, a, i), await rr(t, r, i), !0);
	}
	async function Vr() {
		if (C(Z) || !C(nt)) return !1;
		if (y.listingMode === "sparse") {
			kt();
			let t = n();
			if (!t) return !1;
			let r = ++z, i = await Q.getOldestVisibleChunk({
				pubkeyHex: t,
				visibleUntil: y.visibleUntil,
				limit: f,
				query: { contiguous: !1 }
			});
			return !e() || r !== z || i.length === 0 ? !1 : (nr(), y.loadedPosts = i, Ht(), y.hasOlderLocal = !1, await sr(t, i, r, { skipOlderCheck: !0 }), !0);
		}
		kt();
		let t = n();
		if (!t) return !1;
		let r = ++z, i = await Fn(t, r), a = await Q.getOldestVisibleChunk({
			pubkeyHex: t,
			visibleUntil: i,
			limit: f
		});
		return !e() || r !== z ? !1 : a.length === 0 ? (nr(), y.loadedPosts = [], y.hasOlderLocal = !1, y.hasNewerLocal = !1, !1) : (nr(), y.listingMode = "contiguous", y.sparseSource = null, y.loadedPosts = a, Ht(), y.hasOlderLocal = !1, await sr(t, a, r, { skipOlderCheck: !0 }), !0);
	}
	async function Hr(t = {}) {
		let a = n(), o = r();
		if (!e() || !a || !C(it)) return !1;
		let s = !!o && !C(De) && !Le.exhausted, c = !C(we) && C(K) && $t.isConfigured(a);
		if (!s && !c) return !1;
		let l = St("older-syncing", Number(s) + Number(c)), u = s ? ++je : je, d = L, f = tn(i()), p = () => !R && d === L && Nt(u) && e() && n() === a && r() === o && tn(i()) === f, m = c ? Ot("older-backfill", { until: C(Ce) ?? Math.floor(Date.now() / 1e3) }, t) : null;
		if (c && (m?.promise ?? Promise.resolve(null)).then((e) => wt(l, !!e, e?.changed ?? !1)), s && o) {
			let e = ++Oe;
			N(De, !0);
			let n = !0;
			Ur(a, o, u, p, t, (e) => {
				n = e;
			}).then((e) => wt(l, n && p(), e)).catch(() => wt(l, !1, !1)).finally(() => {
				e === Oe && N(De, !1);
			});
		}
		return l.promise;
	}
	async function Ur(e, t, n, r, a, o) {
		let s;
		for (; y.listingMode === "contiguous";) {
			let t = await $(e);
			if (!r()) return !1;
			let n = ir(y.loadedPosts.at(-1)), i = n ? await Q.hasOlderVisiblePosts({
				pubkeyHex: e,
				visibleUntil: t,
				cursor: n
			}) : !1;
			if (!r()) return !1;
			let o = await $(e);
			if (!r()) return !1;
			if (y.listingMode !== "contiguous") break;
			if (!(o !== t || n && !At(n, ir(y.loadedPosts.at(-1))))) {
				if (s = t, i) {
					kt();
					let e = !1;
					return await Tt(async () => {
						r() && (e = await hr({
							anchorEventId: a.anchorEventId,
							relayFetchViewportCommit: a.viewportCommit,
							useContiguousProgress: !1
						}));
					}), e;
				}
				break;
			}
		}
		let c = zd, l = Bd, u = Math.max(1, Math.min(f, 30)), d = null, p = 0, m = 0, h = 0, g = null, _ = null, v = !1, b = 0, x = null;
		for (;;) {
			p += 1;
			let f = await $(e), S = g ?? await gn(e, f), T = typeof g == "number", E = p === 1 && s !== void 0 && s === f ? s : f;
			if (!r()) return v;
			let D = typeof E == "number" && !(C(w).length ? Qn(y.visibleUntil) : Qn(E)) ? E : typeof S == "number" ? T ? S : typeof E == "number" ? Math.min(S, E) : S : E;
			if (typeof D != "number") return v;
			let O = await kn(e);
			if (!r()) return v;
			let k = Rd[Math.min(h, Rd.length - 1)], A = Ru(O, Math.trunc(D), k, _);
			if (!A) return Cn(null, null), v;
			let j = {
				...A,
				windowSeconds: k
			}, ee = await Wn(e, E);
			if (!r()) return v;
			d === null && (d = ee);
			let M = !1, N = {
				insertedCount: 0,
				updatedCount: 0,
				unchangedCount: 0,
				appliedDeletionCount: 0
			}, P = await Pn(e, t, n);
			if (!r() || !P.isActive()) return v;
			let F = on.fetchLatest(t, {
				pubkeyHex: e,
				relayConfig: i(),
				reason: "older-backfill",
				limit: 150,
				timeoutMs: un,
				since: j.since,
				until: j.until
			});
			be = F;
			let te = await F.promise;
			if (!r() || be !== F || (be = null, !P.isActive() || te.status === "cancelled")) return v;
			if (te.events.length > 0 || te.relayFetchCoverage?.length) {
				let e = await qn(te, P);
				if (e.applied === !1 || !P.isActive()) return v;
				N = e, M = N.insertedCount + N.updatedCount > 0;
			}
			if (!r()) return v;
			let I = typeof C(et) == "number" && (y.visibleUntil === null ? y.hasJumpCacheAnchors : C(et) < y.visibleUntil), ne = I ? E : await Bn(e, te);
			if (!r()) return v;
			let L = ne, R = await Wn(e, L);
			if (!r()) return v;
			let re = !1;
			if (I || (re = await Xn(e, L, { preserveReachedVisibleCount: !0 })), await rr(e, L, null, n), !r()) return v;
			let ie = R > ee, B = xn(te, 150).length > 0, ae = Sn(te), oe = typeof ae == "number" && ae > j.since ? ae - j.since : 0, V = te.status === "success" && B && typeof ae == "number" && ae > j.since && oe >= Ld, H = j.since > 0 ? j.since : null, U = null;
			V && typeof ae == "number" && (H = ae, U = j.since), Le.windowSeconds = k, Le.lastRange = {
				...j,
				hitLimit: B
			}, te.status === "success" && te.events.length === 0 ? Le.consecutiveEmptyCount += 1 : te.events.length > 0 && (Le.consecutiveEmptyCount = 0);
			let se = await $(e);
			if (!r()) return v;
			typeof se == "number" && !I && (H = se), Cn(H, U), wn(j, te, 150);
			let ce = !1, W = {
				loadedPostsBeforeLength: y.loadedPosts.length,
				loadedPostsAfterLength: y.loadedPosts.length,
				olderPostsLength: 0,
				visibleOldestBefore: y.loadedPosts.length > 0 ? y.loadedPosts[y.loadedPosts.length - 1]?.createdAt ?? null : null,
				visibleOldestAfter: y.loadedPosts.length > 0 ? y.loadedPosts[y.loadedPosts.length - 1]?.createdAt ?? null : null,
				didTrimForOlderAppend: !1,
				didDeferOlderPosts: !1,
				maxVisiblePosts: Re
			};
			if (await Tt(async () => {
				r() && (y.searchQuery ? await Tr(y.searchPage, y.searchQuery) : (nr({ force: M }), ie || M ? ce = y.sparseSource === "saved" ? await _r(e, z, {
					anchorEventId: a.anchorEventId,
					relayFetchViewportCommit: a.viewportCommit
				}) : I ? await gr(e, z, {
					anchorEventId: a.anchorEventId,
					relayFetchViewportCommit: a.viewportCommit
				}) : await hr({
					anchorEventId: a.anchorEventId,
					relayFetchViewportCommit: a.viewportCommit,
					metrics: W,
					reason: "normal-older-reveal",
					useContiguousProgress: !1,
					preserveContiguousProgressAfterDatabaseChange: re
				}) : await sr(e)));
			}), !r()) return v;
			let le = ce || ie || M, ue = v || le, de = typeof H == "number" && H < D, fe = R, pe = Math.max(0, fe - (d ?? fe)), me = typeof H == "number" ? Math.max(0, D - H) : Math.max(0, D), he = m + me, G = Vd({
				status: te.status,
				changed: le,
				didCursorAdvanceOlder: de,
				hitLimit: B,
				continuedWithinWindow: V,
				attemptIndex: p,
				maxAttempts: c,
				totalVisibleAdded: pe,
				targetVisibleAdded: u,
				exploredSeconds: he,
				maxExploreSeconds: l
			}), ge = typeof se == "number" && typeof E == "number" && O.some((e) => e.until < E && se <= e.since), _e = typeof se == "number" && typeof E == "number" && se < E, ve = G.shouldContinue && _e && !y.hasOlderLocal && !ge, ye = ve ? b + 1 : b;
			if (m = he, ve) y.latestOlderBackfillUiResult = {
				changed: ue,
				didTrimForOlderAppend: W.didTrimForOlderAppend,
				didDeferOlderPosts: W.didDeferOlderPosts,
				loadedPostsBeforeLength: W.loadedPostsBeforeLength,
				loadedPostsAfterLength: W.loadedPostsAfterLength,
				maxVisiblePosts: W.maxVisiblePosts,
				autoRetryCount: ye,
				autoRetryReason: G.reason,
				attemptIndex: p,
				maxAttempts: c,
				clickStartVisibleCount: d ?? fe,
				currentVisibleCount: fe,
				totalVisibleAdded: pe,
				targetVisibleAdded: u,
				shouldContinueForSmallBatch: ve,
				exploredSeconds: m,
				maxExploreSeconds: l
			}, b = ye, x = G.reason, v = ue, g = H, _ = U, V || (h = Math.min(h + 1, Rd.length - 1));
			else return x = G.reason, v = ue, y.latestOlderBackfillUiResult = {
				changed: v,
				didTrimForOlderAppend: W.didTrimForOlderAppend,
				didDeferOlderPosts: W.didDeferOlderPosts,
				loadedPostsBeforeLength: W.loadedPostsBeforeLength,
				loadedPostsAfterLength: W.loadedPostsAfterLength,
				maxVisiblePosts: W.maxVisiblePosts,
				autoRetryCount: b,
				autoRetryReason: x,
				attemptIndex: p,
				maxAttempts: c,
				clickStartVisibleCount: d ?? fe,
				currentVisibleCount: fe,
				totalVisibleAdded: pe,
				targetVisibleAdded: u,
				shouldContinueForSmallBatch: ve,
				exploredSeconds: m,
				maxExploreSeconds: l
			}, te.status === "success" ? (o(!0), v) : (o(!1), v);
		}
	}
	async function Wr() {
		kt();
		let t = n(), a = r();
		if (!t || !a || !C(ut)) return;
		let o = Tn();
		if (o.length === 0) return;
		Ut(), y.currentViewRefetchStatus = "refetching";
		let s = null, c, l = Date.now();
		try {
			c = await Fn(t), Ed({
				phase: "visible-range-state",
				startedAt: l
			});
		} catch (e) {
			Ed({
				phase: "visible-range-state",
				startedAt: l,
				error: e
			}), y.currentViewRefetchStatus = "idle", y.currentViewRefetchMessageKey = "postHistory.repairFetchFailed", y.currentViewRefetchMessageValues = null, Wt();
			return;
		}
		let u, d = Date.now();
		try {
			u = md.refetchAroundCurrentView(a, {
				pubkeyHex: t,
				relayConfig: i(),
				preferredRanges: o,
				getRelayConfig: i,
				isActive: () => e() && n() === t && r() === a,
				onProgress: async () => void 0
			});
		} catch (e) {
			Ed({
				phase: "primary-fetch",
				startedAt: d,
				error: e
			}), y.currentViewRefetchStatus = "idle", y.currentViewRefetchMessageKey = "postHistory.repairFetchFailed", y.currentViewRefetchMessageValues = null, Wt();
			return;
		}
		Me = u, Ot("repair-visible-range", {
			since: Math.min(...o.map((e) => e.since)),
			until: Math.max(...o.map((e) => e.until))
		});
		let f = !1, p = d;
		try {
			let i = await u.promise;
			if (Me !== u) return;
			if (Ed({
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
			}), (i.timing?.primaryPersistAttemptCount ?? 0) > 0 && Ed({
				phase: "primary-persist",
				startedAt: d,
				durationMs: i.timing?.primaryPersistDurationMs ?? 0,
				counts: { persistedRangeCount: i.timing?.primaryPersistAttemptCount ?? 0 }
			}), !e() || i.status === "cancelled") {
				Me = null, y.currentViewRefetchStatus = "idle";
				return;
			}
			let o = Date.now();
			p = o;
			try {
				await Hn(t, c, i.processedRanges), Ed({
					phase: "visible-range-state",
					startedAt: o,
					counts: { processedRangeCount: i.processedRangeCount }
				});
			} catch (e) {
				throw s = "visible-range-state", Ed({
					phase: "visible-range-state",
					startedAt: o,
					error: e,
					counts: { processedRangeCount: i.processedRangeCount }
				}), e;
			}
			let l = Date.now();
			p = l;
			try {
				y.searchQuery ? await Tr(y.searchPage, y.searchQuery) : y.loadedPosts.length === 0 || !y.hasNewerLocal ? await cr({ skipTotalCountRefresh: !0 }) : await lr({ skipTotalCountRefresh: !0 }), Ed({
					phase: "visible-window-reload",
					startedAt: l,
					counts: { processedRangeCount: i.processedRangeCount }
				});
			} catch (e) {
				throw s = "visible-window-reload", Ed({
					phase: "visible-window-reload",
					startedAt: l,
					error: e,
					counts: { processedRangeCount: i.processedRangeCount }
				}), e;
			}
			f = !0;
			let m = null;
			if (Me === u && e() && n() === t && r() === a && y.loadedPosts.length > 0) {
				let i = Date.now();
				if (p = i, m = await X.repairCurrentView({
					ownerPubkeyHex: t,
					rxNostr: a,
					visiblePosts: y.loadedPosts,
					isActive: () => Me === u && e() && n() === t && r() === a
				}), Me !== u || m.status === "cancelled" || !e()) return;
				Ed({
					phase: "relation-repair",
					startedAt: i,
					durationMs: m.relationRepairDurationMs ?? (m.failurePhase === "relation-repair" ? m.failureDurationMs : void 0),
					errorClass: m.failurePhase === "relation-repair" ? m.failureErrorClass : void 0,
					counts: { savedDirectReplyCount: m.savedDirectReplyCount }
				}), (typeof m.badgeRefreshDurationMs == "number" || m.failurePhase === "badge-refresh") && Ed({
					phase: "badge-refresh",
					startedAt: i,
					durationMs: m.badgeRefreshDurationMs ?? m.failureDurationMs,
					errorClass: m.failurePhase === "badge-refresh" ? m.failureErrorClass : void 0
				});
			}
			if (Me !== u || !e() || n() !== t || r() !== a) return;
			y.searchQuery || nr({ force: !0 }), Me = null, y.currentViewRefetchStatus = "idle", i.addedCount > 0 ? (y.currentViewRefetchMessageKey = "postHistory.repairAdded", y.currentViewRefetchMessageValues = {
				count: i.addedCount,
				processedRangeCount: i.processedRangeCount,
				updatedCount: i.updatedCount
			}) : (m?.savedDirectReplyCount ?? 0) > 0 ? (y.currentViewRefetchMessageKey = "postHistory.repairChildInteractionsAdded", y.currentViewRefetchMessageValues = { count: m?.savedDirectReplyCount ?? 0 }) : i.fetchFailed ? (y.currentViewRefetchMessageKey = "postHistory.repairFetchFailed", y.currentViewRefetchMessageValues = null) : (y.currentViewRefetchMessageKey = "postHistory.repairNoChanges", y.currentViewRefetchMessageValues = {
				processedRangeCount: i.processedRangeCount,
				updatedCount: i.updatedCount
			}), Wt();
		} catch (i) {
			if (Me !== u) return;
			let o = typeof i == "object" && i ? i.phase : void 0, c = typeof i == "object" && i && typeof i.phaseStartedAt == "number" ? i.phaseStartedAt : p, l = typeof i == "object" && i && typeof i.errorClass == "string" ? i.errorClass : void 0;
			s || Ed({
				phase: s ?? (o === "primary-fetch" || o === "primary-persist" ? o : f ? "relation-repair" : "primary-fetch"),
				startedAt: c,
				error: i,
				errorClass: l
			}), f && !y.searchQuery && e() && n() === t && r() === a && nr({ force: !0 }), Me = null, y.currentViewRefetchStatus = "idle", y.currentViewRefetchMessageKey = f ? "postHistory.repairNoChanges" : "postHistory.repairFetchFailed", y.currentViewRefetchMessageValues = null, Wt();
		}
	}
	async function Gr() {
		let t = n();
		if (!t) return !1;
		xt(), zt(), sn();
		let r = L, i = () => !R && e() && n() === t && r === L;
		return zn.cancelOwnerTasks(t), (await Promise.allSettled([Q.deleteLocalHistoryForPubkey(t)])).some((e) => e.status === "rejected") ? (i() && (e() && n() === t && (er(), $n({
			known: y.totalCountKnown,
			status: "failed"
		})), Ut(), y.currentViewRefetchMessageKey = "postHistory.deleteLocalHistoryFailed", y.currentViewRefetchMessageValues = null), !1) : (Ku(t), Jd(t), i() && (sn(), en(), y.currentViewRefetchMessageKey = "postHistory.deleteLocalHistorySuccess", y.currentViewRefetchMessageValues = null, Gu(t, {
			currentPage: 1,
			searchPage: 1,
			searchInput: "",
			searchQuery: ""
		}), qd(t, {
			...Ad,
			totalCount: 0,
			totalCountKnown: !0,
			totalCountFailed: !1
		})), !0);
	}
	async function Kr() {
		kt();
		let t = n(), r = ir(y.loadedPosts[0]);
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
		let o = ar([...a, ...y.loadedPosts], "newer");
		return y.loadedPosts = o, await sr(t, o, i), !0;
	}
	async function qr(t) {
		let r = n(), i = L, a = z, o = () => !R && e() && n() === r && i === L && a === z;
		if (!r || r !== t.ownerPubkeyHex || !o() || await Dt.getLocalRevision(r) !== t.localRevision || !o()) return;
		if (sn(), kt(), a = z, y.searchQuery) {
			await Tr(y.searchPage, y.searchQuery);
			return;
		}
		let s = y.loadedPosts, c = await Promise.all(s.map((e) => Q.getByEventId(e.eventId)));
		if (!o() || y.loadedPosts !== s) return;
		if (y.loadedPosts = c.flatMap((e) => e?.pubkeyHex === r ? [e] : []), !s.length) {
			await cr({ forceTotalCount: !0 });
			return;
		}
		let l = await Fn(r);
		o() && (nr({ force: !0 }), await sr(r, y.loadedPosts, a), o() && await rr(r, l, a));
	}
	async function Jr(t) {
		let r = n();
		if (!r || !e()) return;
		let i = L;
		if (t?.localRevision !== void 0 && await Dt.getLocalRevision(r) !== t.localRevision || R || i !== L || n() !== r || !e() || (t?.restoredRangeChanged && await An(r), R || i !== L || n() !== r || !e())) return;
		let a = t?.restoredRangeChanged === !0 && Or();
		if (a && (xt(), y.syncStatus = "idle"), sn(), t?.restoredRangeChanged && t.insertedPostCount + t.updatedPostCount + t.appliedDeletionPostCount === 0 ? (await Fn(r), await sr(r)) : await Yr(), t?.localRevision !== void 0 && await Dt.getLocalRevision(r) !== t.localRevision) return;
		let o = y.loadedPosts[0]?.createdAt, s = o === void 0 ? void 0 : C(A).find((e) => e.since <= o && e.until >= o), c = !C(Z) && y.listingMode === "contiguous" && o !== void 0 && C(b) !== null && (!s || s.since > C(b));
		t?.restoredRangeChanged && (a || c && ee === null) && !R && i === L && n() === r && e() && kr();
	}
	async function Yr() {
		if (kt(), n()) {
			if (y.searchQuery) await Tr(y.searchPage, y.searchQuery);
			else if (y.sparseSource === "saved") {
				let e = n();
				if (!e) return;
				let t = await Fn(e);
				nr({ force: !0 }), await sr(e), await rr(e, t);
			} else await cr({ forceTotalCount: !0 });
		}
	}
	function Xr(e, t, n) {
		let r = (r) => r.map((r) => r.eventId === e ? {
			...r,
			deletedAt: t,
			deletionEventId: n
		} : r);
		y.loadedPosts = r(y.loadedPosts), y.searchPosts = r(y.searchPosts);
	}
	function Zr(t) {
		let r = n(), i = Wd(r);
		if (!r || !i) return;
		let a = ++G;
		N(he, "loading"), t().then(() => {
			e() && n() === r && me === i && a === G && N(he, "ready");
		}).catch(() => {
			e() && n() === r && me === i && a === G && N(he, "failed");
		});
	}
	return I(() => {
		let t = tn(i()), a = n(), o = r(), s = Dn();
		if ((t !== P || a !== te || o !== ne) && (P = t, te = a, ne = o, L += 1, F(() => {
			xt(), zt(), sn(), y.syncStatus === "syncing" && (y.syncStatus = "idle");
		})), !e() || !a) return;
		let c = L, l = dn(i()), u = bn(async () => await En(a)).subscribe({
			next: async ([t, r, i, o, u]) => {
				try {
					let e = await Dt.getLocalRevision(a);
					if (e !== i || e !== r.localRevision) return;
				} catch {
					return;
				}
				if (R || c !== L || !e() || n() !== a || u !== s || u !== Dn() || (N(x, _t(t.relays, l), !0), N(S, r.ranges, !0), O !== null && O !== i && Et(), O = i, On(o), Or() && kr(), C(b) === null)) return;
				let d = Mt(C(j), C(b));
				d !== y.visibleUntil && (y.visibleUntil = d, kt(), B && sr(a, y.loadedPosts, null, { deferDuringOlderRelayFetch: !0 }));
			},
			error: () => {}
		});
		return () => u.unsubscribe();
	}), I(() => {
		let e = Wd(n());
		e !== _e && (_e = e, It(), Et(), N(ve, null), ye = e, xt(), zt(), sn(), qt(), Ut(), Vt(), Ht(), X.resetOlderRevealRepairContext(), de = !1, fe = !1, pe = !1, me = null, G += 1, N(he, "idle"));
	}), I(() => {
		let e = r();
		e !== Pe && (Pe = e, X.resetOlderRevealRepairContext());
	}), I(() => {
		Yt();
	}), I(() => {
		Xt();
	}), I(() => {
		t() || F(fn);
	}), I(() => {
		let i = tt.localRelayUrl, a = r();
		if (!e()) return;
		F(() => {
			let e = $t.getSessionGeneration();
			(i !== q || a !== Te || e !== Ee) && Et(), q = i, Te = a, Ee = e, N(k, e, !0);
		});
		let o = $t.onSessionInvalidated(() => {
			let t = E !== null || xe !== null;
			Et(), N(k, $t.getSessionGeneration(), !0), Ee = C(k);
			let o = n(), s = L, c = () => !R && e() && L === s && n() === o && r() === a && tt.localRelayUrl === i;
			t && c() && o && Fn(o).then(() => {
				if (c()) return sr(o);
			}).catch(() => void 0);
		});
		return () => {
			o(), F(() => {
				Se++, xe?.cancel(), xe = null, N(we, !1), t() || Et();
			});
		};
	}), I(() => {
		if (e()) return () => {
			xt();
		};
	}), I(() => () => {
		X.dispose();
	}), I(() => {
		if (!e()) Vt();
		else return Gt(), () => {
			Vt();
		};
	}), I(() => {
		if (!e()) return;
		let t = y.searchInput.trim();
		t !== y.searchQuery && N(ue, "loading");
		let n = setTimeout(() => {
			y.searchQuery = t;
		}, p);
		return () => {
			clearTimeout(n);
		};
	}), I(() => {
		if (!e() || C(Z)) return;
		let t = Wd(n()) ?? "";
		if (pe && me === t) return;
		if (pe = !0, me = t, ye === t) {
			ye = null, Zr(cr);
			return;
		}
		let r = fr(), i = rt(n());
		ur(i, r) ? (fe = !0, o(), Zr(cr)) : pr(r) ? Zr(() => dr(r, i)) : Zr(r ? () => mr(r) : cr);
	}), I(() => {
		e() || It();
	}), I(() => {
		if (!e() || !C(ae) || C(oe) !== Wd(n())) return;
		let t = C(Be);
		if (t.length === 0 || !In.canUsePersistentCache()) return;
		let r = Lt(t);
		if (r.length === 0) return;
		let i = [...r].sort().join("\0");
		i !== V && (V = i, Promise.resolve(In.prefetchCachedMediaDescriptors(r)).catch(() => {}));
	}), re(() => {
		R = !0, Et(), L += 1, xt(), zt(), z += 1, W += 1, G += 1, ad.clearCache?.(), N(he, "idle"), N(oe, null), N(ae, !1);
	}), I(() => {
		if (e()) {
			if (!y.searchQuery) {
				let e = Fe !== "";
				if (It(), W += 1, N(le, !1), N(ue, "idle"), ad.clearCache?.(), Fe = "", Ie = !1, y.searchPage !== 1) {
					if (y.searchPage = 1, e) {
						let e = n();
						e && Rt(e, () => Pt(e, z), () => y.loadedPosts.length > 0);
					}
					return;
				}
				if (y.searchPosts = [], y.searchTotalCount = 0, y.searchTotalCountKnown = !1, y.searchHasNext = !1, e) {
					let e = n();
					e && Rt(e, () => Pt(e, z), () => y.loadedPosts.length > 0);
				}
			} else if (y.searchQuery !== Fe) It(), Fe === "" && y.searchPosts.length === 0 && (y.searchPosts = y.loadedPosts), Fe = y.searchQuery, y.searchPage = 1, Ie = !0, wr(1, y.searchQuery);
			else if (Fe = y.searchQuery, !Ie) {
				Ie = !0;
				let e = n(), t = y.searchQuery, r = ++W, i = y.searchPosts.length > 0;
				e && i && Rt(e, () => Sr(r, t, e), () => y.searchPosts.length > 0), Tr(y.searchPage, t, r);
			}
		}
	}), {
		state: y,
		get isSearchMode() {
			return C(Z);
		},
		get posts() {
			return C(Be);
		},
		get displayTotalCount() {
			return C(He);
		},
		get displayTotalCountKnown() {
			return C(Z) ? y.searchTotalCountKnown : y.totalCountKnown;
		},
		get displayTotalCountStatus() {
			return C(Z) ? y.searchTotalCountKnown ? "ready" : C(ue) === "failed" ? "failed" : "loading" : y.totalCountStatus;
		},
		get displayPage() {
			return C(Ve);
		},
		get totalPages() {
			return C(Ue);
		},
		get canGoPrevious() {
			return C(We);
		},
		get canGoFirst() {
			return C(Ge);
		},
		get canGoNext() {
			return C(Ke);
		},
		get canGoLast() {
			return C(Je);
		},
		get showPaging() {
			return C(Ye);
		},
		get canLoadOlder() {
			return C(Xe);
		},
		get canLoadNewer() {
			return C(Ze);
		},
		get canReturnToLatest() {
			return C(Qe);
		},
		get canJumpToOldest() {
			return C(nt);
		},
		get canFetchOlderFromRelays() {
			return C(it);
		},
		get isFetchingOlderFromRelays() {
			return C(at);
		},
		get isFetchingFromRelays() {
			return C(ot);
		},
		get isRefetchingAroundCurrentView() {
			return C(ze);
		},
		get showLocalExhaustedState() {
			return C(st);
		},
		get showSavedPostsBoundary() {
			return C(ct);
		},
		get isShowingSavedOlderPosts() {
			return y.listingMode === "sparse" && y.sparseSource === "saved";
		},
		get visibleNewestCreatedAt() {
			return C($e);
		},
		get visibleOldestCreatedAt() {
			return C(et);
		},
		get visiblePostCount() {
			return C(lt);
		},
		get latestOlderBackfillUiResult() {
			return y.latestOlderBackfillUiResult;
		},
		get syncStatus() {
			return y.syncStatus;
		},
		get syncStatusMessageKey() {
			return C(dt);
		},
		get showSyncLoader() {
			return C(mt);
		},
		get showStatusLoader() {
			return C(gt);
		},
		get isSearchPageLoading() {
			return C(le);
		},
		get searchResultStatus() {
			return C(ue);
		},
		get initialLocalLoadStatus() {
			return C(he);
		},
		get canRefetchAroundCurrentView() {
			return C(ut);
		},
		get currentViewRefetchStatusMessageKey() {
			return C(vt);
		},
		get currentViewRefetchStatusMessageValues() {
			return C(bt);
		},
		prepareForClose: ln,
		suspend: cn,
		cancelCurrentSync: xt,
		cancelCurrentViewRefetch: zt,
		loadOlder: Ir,
		loadNewer: Rr,
		returnToLatest: zr,
		showSavedOlderPosts: Br,
		jumpToOldest: Vr,
		jumpToCreatedAt: yr,
		jumpToEventId: br,
		fetchOlderFromRelays: Hr,
		goFirstPage: Nr,
		goPreviousPage: Mr,
		goToNextPage: Pr,
		goToLastPage: Fr,
		refetchAroundCurrentView: Wr,
		resetSearchState: Kt,
		refreshAfterLocalImport: Jr,
		refreshAfterRelayScan: qr,
		deleteLocalHistory: Gr,
		patchDeletedPost: Xr
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryDialogScrollState.ts
var Xd = /* @__PURE__ */ new Map();
function Zd(e) {
	if (typeof e != "string") return null;
	let t = e.trim();
	return t.length > 0 ? t : null;
}
function Qd(e) {
	return typeof e == "string" ? e.trim() : "";
}
function $d(e) {
	let t = Zd(e.pubkeyHex);
	if (!t) return null;
	let n = e.mode === "search" ? Qd(e.searchQuery) : "";
	return `${t}:${e.mode}:${n}`;
}
function ef(e) {
	let t = $d(e);
	if (!t) return null;
	let n = Xd.get(t);
	return n ? {
		...n,
		anchor: { ...n.anchor }
	} : null;
}
function tf(e) {
	let t = $d(e), n = Zd(e.pubkeyHex);
	t && n && Xd.set(t, {
		pubkeyHex: n,
		mode: e.mode,
		searchQuery: e.mode === "search" ? Qd(e.searchQuery) : "",
		anchor: { ...e.anchor },
		savedAt: e.savedAt ?? Date.now()
	});
}
function nf(e) {
	let t = Zd(e.pubkeyHex);
	if (t) {
		if (e.mode) {
			let n = $d({
				pubkeyHex: t,
				mode: e.mode,
				searchQuery: e.searchQuery
			});
			n && Xd.delete(n);
		} else for (let e of Xd.keys()) e.startsWith(`${t}:`) && Xd.delete(e);
	}
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/hooks/usePostHistoryDialogViewport.svelte.ts
var rf = 1, af = 2, of = 12;
function sf(e, t, n, r) {
	return (e === "older" ? t : n) + af >= r;
}
function cf(e) {
	return `${e.pubkeyHex}:${e.mode}:${e.searchQuery}:${e.anchor.eventId}:${e.savedAt}`;
}
function lf({ getShow: e, getPubkeyHex: t, getPosts: n, getLocale: r, getContainer: i, getIsSearchMode: a, getSearchQuery: o }) {
	let s = 0, c = () => {
		let t = s;
		return () => e() && t === s;
	};
	function l() {
		s++, M();
	}
	re(l);
	let u = D(null), d = D(!0), f = D(!0), p = null, m = D(null), h = !1, g = null;
	function _() {
		return a() ? "search" : "normal";
	}
	function v() {
		return a() ? o() : "";
	}
	function y() {
		return ef({
			pubkeyHex: t(),
			mode: _(),
			searchQuery: v()
		});
	}
	function b(e) {
		return !!e && n().some((t) => t.eventId === e.anchor.eventId);
	}
	function x() {
		let e = R();
		e && tf({
			pubkeyHex: t(),
			mode: _(),
			searchQuery: v(),
			anchor: e
		});
	}
	function S() {
		nf({
			pubkeyHex: t(),
			mode: _(),
			searchQuery: v()
		}), N(m, null), g = null;
	}
	function w() {
		nf({ pubkeyHex: t() }), N(m, null), g = null;
	}
	function T() {
		let e = i();
		e && (e.scrollTop = 0, O(), k(), P());
	}
	function E() {
		let e = i();
		e && (e.scrollTop = e.scrollHeight, O(), k(), P());
	}
	function O() {
		let e = i();
		e ? N(d, e.scrollTop <= rf) : N(d, !0);
	}
	function k() {
		let e = i();
		if (!e) {
			N(f, !0);
			return;
		}
		let t = e.scrollHeight - e.clientHeight - e.scrollTop;
		N(f, t <= af);
	}
	function A() {
		let e = i();
		if (!e) return null;
		let t = e.getBoundingClientRect(), n = t.top + of, r = Array.from(e.querySelectorAll("[data-post-history-event-id]")), a = 0, o = r.length, s = t.top + rf;
		for (; a < o;) {
			let e = Math.floor((a + o) / 2);
			r[e].getBoundingClientRect().bottom > s ? o = e : a = e + 1;
		}
		let c = null;
		for (let e = a; e < r.length; e += 1) {
			let i = r[e], a = i.getBoundingClientRect();
			if (a.top >= t.bottom - rf) break;
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
			N(u, null);
			return;
		}
		let t = A();
		N(u, t === null ? null : Zt(t, r()), !0);
	}
	function ee() {
		M(), j(), oe();
	}
	function M() {
		p !== null && (cancelAnimationFrame(p), p = null);
	}
	function P() {
		e() && (M(), p = requestAnimationFrame(() => {
			p = null, j();
		}));
	}
	function F() {
		O(), k(), C(f) ? ee() : P();
	}
	function te() {
		let e = c();
		ie().then(() => {
			e() && T();
		});
	}
	function ne() {
		let e = c();
		ie().then(() => {
			e() && E();
		});
	}
	function L(e) {
		let t = c();
		ie().then(() => {
			t() && z({
				eventId: e,
				offsetTop: 0
			});
		});
	}
	function R() {
		let e = i();
		if (!e) return null;
		let t = e.getBoundingClientRect(), n = Array.from(e.querySelectorAll("[data-post-history-event-id]"));
		for (let e of n) {
			let n = e.dataset.postHistoryEventId;
			if (!n) continue;
			let r = e.getBoundingClientRect();
			if (r.bottom > t.top + rf && r.top < t.bottom - rf) return {
				eventId: n,
				offsetTop: r.top - t.top
			};
		}
		return null;
	}
	function z(t, n = {}) {
		let r = i();
		if (!t || !e() || !r) return !1;
		n.flushUpdates !== !1 && oe();
		let a = Array.from(r.querySelectorAll("[data-post-history-event-id]")).find((e) => e.dataset.postHistoryEventId === t.eventId);
		if (!a) return !1;
		let o = r.getBoundingClientRect(), s = a.getBoundingClientRect().top - o.top;
		return r.scrollTop += s - t.offsetTop, P(), !0;
	}
	function B(e, t, n) {
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
			return sf("older", r.scrollTop, 0, o);
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
		return sf("newer", 0, r.scrollHeight - r.clientHeight - r.scrollTop, f);
	}
	function ae(e, t) {
		let n = i();
		return n ? Array.from(n.querySelectorAll("[data-post-history-thread-anchor-event-id]")).find((n) => n.dataset.postHistoryThreadAnchorScopeId === e && n.dataset.postHistoryThreadAnchorEventId === t) ?? null : null;
	}
	function V(e, t) {
		let n = ae(e, t);
		return n ? {
			scopeEventId: e,
			eventId: t,
			top: n.getBoundingClientRect().top
		} : null;
	}
	function H(t) {
		let n = i();
		if (!t || !e() || !n) return !1;
		oe();
		let r = ae(t.scopeEventId, t.eventId);
		if (!r) return !1;
		let a = r.getBoundingClientRect().top - t.top;
		return Math.abs(a) < .5 || (n.scrollTop += a, P(), O(), k()), !0;
	}
	async function U(e, t, n) {
		let r = c(), i = V(e, t), a = n();
		await ie(), r() && (H(i), await a, await ie(), r() && H(i));
	}
	return I(() => {
		e() ? h || (h = !0, N(m, y(), !0), g = null) : (h = !1, N(m, null), g = null, N(u, null), M());
	}), I(() => {
		if (!e() || !b(C(m))) return;
		let t = C(m), n = cf(t);
		if (g === n) return;
		let r = c();
		ie().then(() => {
			r() && C(m) === t && (z(t.anchor), g = n, N(m, null));
		});
	}), I(() => {
		if (!e()) {
			N(u, null), M();
			return;
		}
		i(), n(), r();
		let t = c();
		return ie().then(() => {
			t() && (j(), O(), k());
		}), () => {
			M();
		};
	}), {
		suspend: l,
		get currentMonthLabel() {
			return C(u);
		},
		get isHistoryScrolledToTop() {
			return C(d);
		},
		get isHistoryScrolledToBottom() {
			return C(f);
		},
		readCurrentSessionScrollState: y,
		saveCurrentSessionScrollAnchor: x,
		clearCurrentSessionScrollAnchor: S,
		clearAllSessionScrollAnchorsForCurrentPubkey: w,
		handleHistoryScroll: F,
		resetHistoryScrollSoon: te,
		resetHistoryScrollToBottomSoon: ne,
		scrollHistoryEventToTopSoon: L,
		captureHistoryScrollAnchor: R,
		canCommitAutoLoadWindowChange: B,
		restoreHistoryScrollAnchor: z,
		preserveThreadParentToggleScroll: U
	};
}
var uf = 86400, df = 6e3, ff = 8;
function pf(e) {
	return Number.isFinite(e) ? Math.max(1, Math.trunc(e ?? 100)) : 100;
}
function mf(e) {
	return Array.from(e.values()).map((e) => ({
		parentEventId: e.parentEventId,
		event: e.event,
		relayUrls: Array.from(e.relayUrls).sort((e, t) => e.localeCompare(t))
	})).sort((e, t) => e.event.created_at === t.event.created_at ? e.event.id.localeCompare(t.event.id) : e.event.created_at - t.event.created_at);
}
function hf(e) {
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
var gf = new class {
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
		let n = nt(), r = hf(t), i = new Map(r.map((e) => [e.eventId, e])), a = r.map((e) => e.eventId), o = this.resolveRelayUrls([...t.relayHints ?? [], ...r.flatMap((e) => e.relayHints)], t.relayConfig, t.relayLimit), s = pf(t.limit), c = Math.max(0, Math.trunc(Math.min(...r.map((e) => e.createdAt))) - uf), l = /* @__PURE__ */ new Map(), u = !1, d, f, p, m = () => {
			f !== void 0 && (this.clearTimeoutFn(f), f = void 0), d?.unsubscribe?.(), d = void 0;
		}, h = (e) => ({
			status: e === "failed" && l.size > 0 ? "partial" : e,
			events: mf(l),
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
					d = gt(e, n, { on: o.length > 0 ? { relays: o } : { defaultReadRelays: !0 } }).subscribe({
						next: (e) => {
							this.handlePacket(l, i, e);
						},
						complete: () => m("success"),
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
					}), n.over(), f = this.setTimeoutFn(() => {
						this.console.warn("post_history_reply_fetch_timeout", a.join(",")), m("failed");
					}, t.timeoutMs ?? df);
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
		if (!a || !gn({
			child: r,
			parent: a
		}).valid) return;
		let o = de.sanitizeExternalRelayUrls(typeof n.from == "string" ? [n.from] : [], { limit: 1 })[0], s = e.get(r.id);
		s ? fe(s.event, r) ? o && s.relayUrls.add(o) : this.console.warn("post_history_reply_fetch_packet_conflict", r.id) : e.set(r.id, {
			parentEventId: a.eventId,
			event: r,
			relayUrls: new Set(o ? [o] : [])
		});
	}
	resolveRelayUrls(e, t, n) {
		let r = Number.isFinite(n) ? Math.max(1, Math.trunc(n ?? ff)) : ff, i = Ge(e, r);
		if (i) return i;
		let a = t ? [...de.extractReadRelays(t), ...de.extractWriteRelays(t)] : [], o = de.sanitizeExternalRelayUrls([...e ?? [], ...a], { limit: r });
		return o.length > 0 ? o : de.sanitizeExternalRelayUrls(le, { limit: r });
	}
}();
function _f(e) {
	return typeof e == "number" && Number.isFinite(e);
}
function vf(e) {
	if (!e || typeof e != "object") return !1;
	let t = e;
	return typeof t.parentEventId == "string" && (t.completeness === "complete" || t.completeness === "partial") && _f(t.fetchedAt) && _f(t.requestStartedAt) && t.schemaVersion === 1;
}
function yf(e, t) {
	return e ? e.requestStartedAt > t.requestStartedAt || e.requestStartedAt === t.requestStartedAt && e.completeness === "complete" && t.completeness === "partial" : !1;
}
var bf = new class {
	db;
	now;
	constructor(e = yn, t = Date.now) {
		this.db = e, this.now = t;
	}
	async get(e) {
		if (!e) return null;
		let t = await this.db.postHistoryDirectReplyFetchMeta.get(e);
		return !t || !vf(t.value) ? null : {
			...t.value,
			updatedAt: t.updatedAt
		};
	}
	async getForParentEventIds(e) {
		let t = Array.from(new Set(e.filter((e) => !!e)));
		return t.length === 0 ? [] : (await this.db.postHistoryDirectReplyFetchMeta.bulkGet(t)).flatMap((e) => !e || !vf(e.value) ? [] : [{
			...e.value,
			updatedAt: e.updatedAt
		}]);
	}
	async save(e) {
		return !e.parentEventId || !_f(e.fetchedAt) || !_f(e.requestStartedAt) ? null : this.db.transaction("rw", this.db.postHistoryDirectReplyFetchMeta, async () => {
			let t = await this.get(e.parentEventId);
			if (yf(t, e)) return t;
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
}(), xf = {
	totalCount: 0,
	groups: []
};
function Sf(e) {
	if (!Nn(e.content)) return;
	let t = Pn(e.content);
	if (t) return Fn(e.tags ?? []).get(t)?.url;
}
function Cf(e) {
	if (e.length === 0) return xf;
	let t = [], n = /* @__PURE__ */ new Map(), r = 0;
	for (let i of e) {
		if (i.kind !== 7) continue;
		r += 1;
		let e = Sf(i), a = n.get(i.content);
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
	return r === 0 ? xf : {
		totalCount: r,
		groups: t
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryThreadGraphTaskTracker.ts
function wf() {
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
function Tf(e = {}) {
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
function Ef(e, t) {
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
function Df(e, t = {}) {
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
function Of(e, t) {
	return {
		...e,
		loadingChildren: t.showInitialLoading,
		revalidatingChildren: !t.showInitialLoading,
		visibleChildren: t.prefetchOnly ? e.visibleChildren : e.visibleChildren || t.showInitialLoading,
		childrenError: null
	};
}
function kf(e, t = {}) {
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
function Af(e, t) {
	return {
		...e,
		loadingChildren: !1,
		revalidatingChildren: !1,
		visibleChildren: e.visibleChildren,
		childrenError: t.nextError
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryThreadGraphApplyStrategies.ts
function jf(e) {
	return e.status === "deleted" ? "deleted" : e.status === "not-found" ? "not-found" : e.status === "resolved" && e.event ? "resolved" : "failed";
}
function Mf(e) {
	return e.nextRecordsLength > 0 ? "resolved" : e.resultEventsLength > 0 ? "deleted" : "not-found";
}
function Nf(e) {
	return {
		deleted: () => {
			e.snapshot.authorPubkey && (e.hideEvent(e.snapshot.authorPubkey, e.parentEventId), e.markParentDeletedForEvent(e.parentEventId, e.snapshot.authorPubkey, { revealKnownParent: !0 })), e.setParentDeleted();
		},
		"not-found": () => {
			e.updateExpansion((t) => ({ ...Df(t, {
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
			e.upsertParentEdge(t.eventId, t.parentEventId), e.updateExpansion((t) => ({ ...Df(t, {
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
function Pf(e) {
	let t = () => {
		e.updateExpansion((t) => ({ ...kf(t, {
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
function Ff(e) {
	e.updateExpansion((t) => ({
		...t,
		loadingParent: !1,
		revalidatingParent: !1,
		visibleParent: t.visibleParent,
		parentError: e.showInitialLoading ? e.errorCode ?? "fetch_failed" : t.parentError,
		showParentLoadingIndicator: !1
	}));
}
function If(e) {
	e.updateExpansion((t) => ({ ...Af(t, { nextError: e.showInitialLoading && !e.prefetchOnly ? e.errorCode ?? "fetch_failed" : t.childrenError }) }));
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryThreadGraphLoadDecision.ts
function Lf(e) {
	return typeof e.lastFetchedAt != "number" || (e.now ?? Date.now()) - e.lastFetchedAt >= e.ttlMs;
}
function Rf(e) {
	return !e.displayedCached || e.force ? !1 : !Lf({
		lastFetchedAt: e.lastFetchedAt,
		ttlMs: e.ttlMs,
		now: e.now
	});
}
function zf(e) {
	let t = Rf(e);
	return {
		skipRevalidate: t,
		shouldShowInitialLoading: !e.displayedCached,
		shouldPrefetchReplyCountsOnSkip: t && !e.prefetchOnly
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryThreadGraphFetchCoordinator.ts
function Bf(e) {
	return !e.loading && !e.revalidating ? !1 : (e.onInFlight(), e.loading && e.onLoadingInFlight?.(), !0);
}
function Vf(e) {
	return e.hasVisibleData ? Lf({
		lastFetchedAt: e.lastFetchedAt,
		ttlMs: e.ttlMs,
		now: e.now
	}) : !1;
}
async function Hf(e) {
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
async function Uf(e) {
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
async function Wf(e) {
	let t = e.strategies[e.status] ?? e.fallback;
	t && await t();
}
async function Gf(e) {
	if (e.skipRevalidate) return;
	let t = e.runRevalidate({ showInitialLoading: e.shouldShowInitialLoading });
	e.awaitWhenInitialLoading && e.shouldShowInitialLoading && await t;
}
async function Kf(e) {
	let t = zf(e);
	return t.shouldPrefetchReplyCountsOnSkip && e.onSkipPrefetchReplyCounts?.(), await Gf({
		skipRevalidate: t.skipRevalidate,
		shouldShowInitialLoading: t.shouldShowInitialLoading,
		awaitWhenInitialLoading: e.awaitWhenInitialLoading,
		runRevalidate: e.runRevalidate
	}), t;
}
async function qf(e) {
	if (Bf({
		loading: e.loading,
		revalidating: e.revalidating,
		onInFlight: e.onInFlight,
		onLoadingInFlight: e.onLoadingInFlight
	}) || e.shouldHandleLoadedState && await e.handleLoadedState()) return;
	e.prepareFreshLoadState();
	let t = await e.displayCachedForFreshLoad();
	await Kf({
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
function Jf(e) {
	return de.sanitizeExternalRelayUrls(e, { limit: 8 });
}
function Yf(e) {
	return Array.from(new Set(e));
}
var Xf = 20, Zf = 12, Qf = 2, $f = 4, ep = 4, tp = 3e5, np = class extends Error {};
function rp(e) {
	if (e === "failed") throw Error("post_history_reply_fetch_failed");
	if (e === "cancelled") throw new np();
}
function ip(e) {
	return (t) => {
		t instanceof np ? e.updateExpansion((e) => ({ ...Af(e, { nextError: e.childrenError }) })) : If({
			...e,
			errorCode: "fetch_failed"
		});
	};
}
function ap(e) {
	return e === "partial" ? "partial" : "complete";
}
function op(e) {
	return e?.completeness === "complete" ? e.fetchedAt : null;
}
var sp = 3e5, cp = 0;
function lp(e, t) {
	let n = new Set(e.map((e) => e.eventId));
	return (t && t.length > 0 ? Array.from(new Set(t)) : Array.from(n)).filter((e) => n.has(e));
}
function up(e) {
	let t = Rt({
		event: e.parentNode.event,
		relayHints: e.parentNode.relayUrls
	});
	return !!t && gn({
		child: ar(e.record),
		parent: t
	}).valid;
}
function dp(e) {
	if (!e.parentNode) return null;
	let t = Rt({
		event: e.parentNode.event,
		relayHints: e.parentNode.relayUrls
	});
	return t && gn({
		child: e.childNode.event,
		parent: t
	}).valid ? e.parentNode : null;
}
function fp({ getShow: e, getSessionOpen: t = e, getPubkeyHex: n, getRxNostr: r, getRelayConfig: i, postHistoryRepositoryImpl: a = Q, directReplyRecordsAdapterImpl: o = nn, reactionRecordsAdapterImpl: s = _n, childInteractionsRepositoryImpl: c = Et, deletionRequestsRepositoryImpl: l = Jt, directReplyFetchMetadataRepositoryImpl: u = bf, profileSyncCoordinator: d = void 0, contextFetchService: f = Kt, replyFetchService: p = gf, deletionFetchService: m = Yt, relatedTargetResolver: h = void 0 }) {
	let g = d ?? ur({
		getShow: e,
		getRxNostr: r
	}), _ = !d, v = h ?? Mr({
		getShow: e,
		getRxNostr: r,
		getRelayConfig: i,
		postHistoryRepositoryImpl: a,
		contextFetchService: f,
		deletionRequestsRepositoryImpl: l,
		deletionFetchService: m,
		profileSyncCoordinator: g
	}), y = !h, b = `post-history-thread-graph-parent:${++cp}`, x = D({}), S = D({}), w = D({}), T = D({}), E = D({}), O = D(0), k = Tf(), A = /* @__PURE__ */ new Set(), j = /* @__PURE__ */ new Set(), ee = /* @__PURE__ */ new Set(), M = /* @__PURE__ */ new Set(), P = D({}), te = D({}), ne = D({}), L = D({}), R = wf();
	function z(e) {
		let t = C(te)[e] ?? [];
		N(L, {
			...C(L),
			[e]: vr(t, C(ne))
		});
	}
	function ie(e, t) {
		N(ne, {
			...C(ne),
			[e]: t
		});
		for (let [t, n] of Object.entries(C(te))) n.some((t) => t.authorPubkey === e) && z(t);
	}
	function B(e) {
		return C(P)[e] ?? xf;
	}
	function ae(e) {
		return C(L)[e] ?? Cr;
	}
	function oe(e, t) {
		return C(T)[tr(e, t)] ?? er();
	}
	function V(e, t, n) {
		let r = tr(e, t);
		N(T, {
			...C(T),
			[r]: n(C(T)[r] ?? er())
		});
	}
	function H(e) {
		let t = or(e), n = xr(C(x)[t.eventId], t);
		return N(x, {
			...C(x),
			[n.eventId]: n
		}), n;
	}
	function U(e, t) {
		t && N(S, {
			...C(S),
			[e]: t
		});
	}
	function se(e, t) {
		let n = C(w)[e] ?? [], r = br(Yf([...n, ...t]).filter((t) => t !== e && !Te(t)), C(x));
		N(w, {
			...C(w),
			[e]: r
		});
	}
	function ce(e) {
		let t = ir(e);
		return or({
			event: t,
			relayUrls: Jf([
				...e.relayHints,
				...e.acceptedRelays,
				...e.fetchedRelays ?? []
			]),
			sources: ["anchor", "history-record"]
		});
	}
	function W(e) {
		let t = ce(e), n = H({
			event: t.event,
			relayUrls: t.relayUrls,
			sources: t.sources
		});
		return U(n.eventId, n.parentEventId), ue(n.authorPubkey, n.relayUrls), n;
	}
	function le(e, t) {
		if (!e || !t) return;
		let n = !1, r = { ...C(x) };
		for (let [i, a] of Object.entries(C(x))) a.authorPubkey === e && (r[i] = xr(a, {
			...a,
			profile: t
		}), n = !0);
		n && N(x, r);
	}
	function ue(e, t = []) {
		le(e, g.ensureProfile(e, t));
	}
	let fe = g.subscribe((t, n) => {
		e() && (le(t, n), ie(t, n));
	});
	async function pe(e) {
		let t = Jf(e.relayUrls ?? []), n = H({
			...e,
			relayUrls: t
		});
		return ue(e.event.pubkey, t), n;
	}
	function me(e, t, n) {
		let r = Mu.buildContext(e, t, n);
		return r ? Mu.toDescriptor(r, b) : null;
	}
	function G(e) {
		if (!e) return null;
		let t = v.getTargetSnapshot(e.eventId);
		if (t?.status !== "resolved" || !t.event) return e;
		let n = Jf([...e.relayUrls, ...t.relayHints]), r = t.profile ?? e.profile ?? null;
		return e.event === t.event && e.profile === r && Nt(e.relayUrls, n) ? e : xr(e, {
			...e,
			event: t.event,
			relayUrls: n,
			profile: r
		});
	}
	function ge(e, t) {
		return Mu.getRelayHints(e, t);
	}
	function _e(e, t) {
		let n = he(t.event);
		return Jf([
			...t.relayUrls,
			...n.relayHints,
			...e.relayHints,
			...e.acceptedRelays,
			...e.fetchedRelays ?? []
		]);
	}
	function ve(e, t) {
		return de.sanitizeExternalRelayUrls([
			...t.flatMap((e) => {
				let t = he(e.event);
				return [...e.relayUrls, ...t.relayHints];
			}),
			...e.relayHints,
			...e.acceptedRelays,
			...e.fetchedRelays ?? []
		], { limit: ep });
	}
	function ye(e) {
		k.clear(e);
	}
	function be(e, t) {
		let n = tr(e, t);
		k.schedule(n, () => {
			let n = oe(e, t);
			n.loadingParent && n.visibleParent && V(e, t, (e) => ({
				...e,
				showParentLoadingIndicator: !0
			}));
		});
	}
	function xe(e, t) {
		return (C(w)[e] ?? []).map((e) => G(C(x)[e])).filter((e) => !!e).filter((e) => !q(e.authorPubkey, e.eventId)).map((e) => ({
			event: e.event,
			profile: e.profile,
			relayUrls: [...e.relayUrls],
			isOwnReply: e.authorPubkey === t
		}));
	}
	function Se(e) {
		return (C(w)[e] ?? []).filter((e) => {
			let t = C(x)[e];
			return t && !q(t.authorPubkey, t.eventId);
		});
	}
	function Ce(e, t, n) {
		return Se(e).filter((e) => !t.includes(e) && !n.has(e));
	}
	function K(e, t, n, r = [], i = 0, a = /* @__PURE__ */ new Set()) {
		let o = G(C(x)[t]);
		if (!o || q(o.authorPubkey, o.eventId) || r.includes(t) || a.has(t)) return null;
		a.add(t);
		let s = [...r, t], c = oe(e, t), l = o.parentEventId, u = l ? r.includes(l) : !1, d = l ? dp({
			childNode: o,
			parentNode: G(C(x)[l] ?? null)
		}) : null, f = c.visibleParent && d && !u && i > -20 ? K(e, d.eventId, n, s, i - 1, a) : null, p = i < Xf ? Ce(t, s, a) : [], m = p.length, h = c.visibleChildren && m > 0, g = h ? p.map((t) => K(e, t, n, s, i + 1, a)).filter((e) => e !== null) : [];
		return {
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
	function we(e) {
		C(O);
		let t = G(C(x)[e.eventId]) ?? ce(e), r = oe(e.eventId, e.eventId), i = n() ?? e.pubkeyHex, a = /* @__PURE__ */ new Set([e.eventId]), o = t.parentEventId, s = o ? G(C(x)[o] ?? null) : null, c = s && !q(s.authorPubkey, s.eventId) ? dp({
			childNode: t,
			parentNode: s
		}) : null, l = c && r.visibleParent ? K(e.eventId, c.eventId, i, [e.eventId], -1, a) : null, u = Ce(e.eventId, [e.eventId], a), d = new Set(u), f = xe(e.eventId, i).filter((e) => d.has(e.event.id)), p = u.length, m = r.visibleChildren && p > 0, h = m ? u.map((t) => K(e.eventId, t, i, [e.eventId], 1, a)).filter((e) => e !== null) : [];
		return {
			anchorEventId: e.eventId,
			parentTargetId: o,
			parentNode: c,
			parentNodeState: l,
			parentExpansion: r,
			repliesActionState: {
				status: r.loadingChildren ? "loading" : r.childrenError ? "failed" : r.loadedChildren ? "loaded" : "unloaded",
				visible: m,
				replies: f,
				replyCount: p,
				error: r.childrenError
			},
			reactionSummary: B(e.eventId),
			reactionReadModel: ae(e.eventId),
			replyItems: f,
			replyNodeStates: h
		};
	}
	function q(e, t) {
		return !e || !t ? !1 : !!C(E)[e]?.[t];
	}
	function Te(e) {
		let t = C(x)[e];
		return t ? q(t.authorPubkey, e) : !1;
	}
	function Ee(e, t) {
		e && t && !q(e, t) && N(E, {
			...C(E),
			[e]: {
				...C(E)[e] ?? {},
				[t]: !0
			}
		});
	}
	function De(e, t, n = {}) {
		let r = /* @__PURE__ */ new Set();
		for (let [n, i] of Object.entries(C(S))) {
			if (i !== e) continue;
			let a = C(x)[e];
			t && a && a.authorPubkey !== t || r.add(n);
		}
		if (r.size !== 0) for (let [e, t] of Object.entries(C(T))) {
			let i = e.indexOf(":");
			if (i < 0) continue;
			let a = e.slice(0, i), o = e.slice(i + 1);
			r.has(o) && (t?.loadedParent || t?.visibleParent) && V(a, o, (e) => Df(e, {
				visibleParent: n.revealKnownParent ? !0 : e.visibleParent,
				parentDeleted: !0,
				lastFetchedParentAt: Date.now()
			}));
		}
	}
	function Oe(e, t = {}) {
		for (let [n, r] of e.entries()) for (let e of r) De(e, n, t);
	}
	function ke(e) {
		let t = C(E), n = !1;
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
		n && (N(E, t), Oe(e));
	}
	function Ae(e) {
		let t = {}, n = !1;
		for (let [r, i] of Object.entries(C(w))) {
			let a = i.filter((t) => t !== e);
			t[r] = a, a.length !== i.length && (n = !0);
		}
		if (n && N(w, t), C(S)[e]) {
			let { [e]: t, ...n } = C(S);
			N(S, n);
		}
	}
	async function je(e, t = {}) {
		if (!e?.id || q(e.pubkey, e.id)) return !0;
		if (t.checkPostHistoryRepository === !1) return !1;
		try {
			if (typeof (await a.getByEventId(e.id))?.deletedAt == "number") return Ee(e.pubkey, e.id), Ae(e.id), !0;
		} catch {}
		return !1;
	}
	async function Me(e) {
		ke(e);
		for (let t of e.values()) for (let e of t) Ae(e), await c.deleteChildInteractionByEventId(e);
	}
	async function J(e) {
		await Me(await l.getDeletedTargets(e.map((e) => ({
			targetAuthorPubkey: e.pubkey,
			targetEventId: e.id
		}))));
	}
	async function Y(t, a, o, s = "default") {
		if (a.length === 0) return;
		let c = r();
		if (!c) return;
		let u = a.filter((e) => !q(e.pubkey, e.id));
		if (u.length === 0) return;
		let d = `${t}:deletions:${s}`, f = n(), p = R.getRequestId(), h = () => e() && R.getRequestId() === p && n() === f && r() === c, g = f ? ht(yn, f) : Promise.resolve(0), _ = m.fetchDeletionRequests(c, {
			targets: u.map((e) => ({
				event: e,
				relayUrls: C(x)[e.id]?.relayUrls ?? []
			})),
			relayHints: o,
			relayConfig: i()
		});
		R.replaceDeletionFetchTask(d, _);
		try {
			let e = await _.promise;
			if (!h() || (await l.upsertValidDeletionRequests({
				targetEvents: u,
				deletionEvents: e.events,
				fetchedAt: e.fetchedAt
			}), !h())) return;
			f && e.events.length && $t.archiveAdoptedAuthored(u.map((e) => ({ event: e })), {
				ownerPubkeyHex: f,
				expectedRevision: await g,
				isActive: h
			});
		} catch {
			return;
		} finally {
			h() && R.deleteDeletionFetchTask(d);
		}
		h() && await J(u);
	}
	async function Ne(e) {
		await J(e);
		let t = [];
		for (let n of e) await je(n) ? await c.deleteChildInteractionByEventId(n.id) : t.push(n);
		return t;
	}
	async function Pe(e) {
		let t = await Ne(e.map((e) => ar(e))), n = new Set(t.map((e) => e.id)), r = [];
		for (let t of e) n.has(t.eventId) && r.push(t);
		return r;
	}
	async function Fe(e) {
		let t = await Ne(e.map((e) => e.event)), n = new Set(t.map((e) => e.id)), r = [];
		for (let t of e) n.has(t.event.id) && r.push(t);
		return r;
	}
	async function Ie(e) {
		return await J([e.event]), !await je(e.event, { checkPostHistoryRepository: e.checkPostHistoryRepository }) && (Y(e.anchorEventId, [e.event], e.relayHints), !0);
	}
	function Le(e, t = e) {
		ye(tr(e, t)), V(e, t, (e) => ({ ...Df(e, {
			visibleParent: !0,
			parentDeleted: !0,
			lastFetchedParentAt: Date.now()
		}) }));
	}
	function Re(e, t) {
		ye(tr(e, t)), V(e, t, (e) => ({
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
	async function X(t, r, i) {
		let a = i.parentEventId;
		if (!a) return !1;
		let o = v.getTargetSnapshot(a);
		if (o?.status === "deleted") return o.authorPubkey && (Ee(o.authorPubkey, a), De(a, o.authorPubkey, { revealKnownParent: !0 })), Le(t.eventId, r), !0;
		let s = G(C(x)[a] ?? null);
		if (s) {
			let a = Rt({
				event: s.event,
				relayHints: s.relayUrls
			});
			if (!a || !gn({
				child: i.event,
				parent: a
			}).valid) return Re(t.eventId, r), !1;
			let c = Jf([...s.relayUrls, ...ge(t, i)]), l = await Ie({
				anchorEventId: t.eventId,
				event: s.event,
				relayHints: c,
				checkPostHistoryRepository: s.authorPubkey === n()
			});
			return e() ? l ? (V(t.eventId, r, (e) => ({ ...Df(e, {
				parentDeleted: e.parentDeleted,
				lastFetchedParentAt: o?.updatedAt ?? e.lastFetchedParentAt
			}) })), !0) : (Le(t.eventId, r), !0) : !1;
		}
		if (!o) return !1;
		if (o.authorPubkey && q(o.authorPubkey, a)) return Le(t.eventId, r), !0;
		if (o.status === "resolved" && o.event) {
			let e = Rt({
				event: o.event,
				relayHints: o.relayHints
			});
			if (!e || !gn({
				child: i.event,
				parent: e
			}).valid) return Re(t.eventId, r), !1;
			let n = H({
				event: o.event,
				relayUrls: o.relayHints,
				sources: ["fetched-parent"],
				profile: o.profile
			});
			return U(n.eventId, n.parentEventId), V(t.eventId, r, (e) => ({ ...Df(e, {
				parentDeleted: !1,
				lastFetchedParentAt: o.updatedAt ?? e.lastFetchedParentAt
			}) })), !0;
		}
		return o.status === "not-found" && (V(t.eventId, r, (e) => ({ ...Df(e, {
			parentMissing: !0,
			parentDeleted: !1,
			lastFetchedParentAt: o.updatedAt ?? e.lastFetchedParentAt
		}) })), !0);
	}
	async function Z(t, n, r, i = {}) {
		let a = r.parentEventId;
		if (!a) return;
		let o = R.incrementRequestId(), s = tr(t.eventId, n);
		V(t.eventId, n, (e) => ({ ...Ef(e, { showInitialLoading: !!i.showInitialLoading }) })), i.showInitialLoading && be(t.eventId, n), await Hf({
			isActive: () => o === R.getRequestId() && e(),
			cleanup: () => {
				ye(s);
			},
			onError: () => {
				Ff({
					updateExpansion: (e) => V(t.eventId, n, e),
					showInitialLoading: !!i.showInitialLoading,
					errorCode: "fetch_failed"
				});
			},
			run: async ({ ensureActive: e }) => {
				let o = me(t, n, r);
				if (!o) return;
				let c = await v.ensureTarget(o, {
					force: !0,
					background: !i.showInitialLoading
				});
				if (!(!e() || (ye(s), !c))) {
					if (c.status === "resolved" && c.event) {
						let e = Rt({
							event: c.event,
							relayHints: c.relayHints
						});
						if (!e || !gn({
							child: r.event,
							parent: e
						}).valid) {
							Re(t.eventId, n);
							return;
						}
					}
					await Wf({
						status: jf(c),
						strategies: Nf({
							snapshot: c,
							parentEventId: a,
							showInitialLoading: !!i.showInitialLoading,
							updateExpansion: (e) => {
								V(t.eventId, n, e);
							},
							hideEvent: Ee,
							markParentDeletedForEvent: De,
							setParentDeleted: () => {
								Le(t.eventId, n);
							},
							isDeletedEvent: q,
							upsertNode: () => H({
								event: c.event,
								relayUrls: c.relayHints,
								sources: ["fetched-parent"],
								profile: c.profile
							}),
							upsertParentEdge: U
						})
					});
				}
			}
		});
	}
	async function ze(e, t, n = {}) {
		let r = t === e.eventId ? W(e) : C(x)[t];
		if (!r?.parentEventId) return;
		let i = oe(e.eventId, t);
		await qf({
			loading: i.loadingParent,
			revalidating: i.revalidatingParent,
			onInFlight: () => {
				V(e.eventId, t, (e) => ({
					...e,
					visibleParent: !0,
					showParentLoadingIndicator: !1
				}));
			},
			onLoadingInFlight: () => {
				be(e.eventId, t);
			},
			shouldHandleLoadedState: !n.force && i.loadedParent,
			handleLoadedState: async () => i.parentDeleted ? (Le(e.eventId, t), !0) : (V(e.eventId, t, (e) => ({
				...e,
				visibleParent: !0,
				showParentLoadingIndicator: !1
			})), Vf({
				hasVisibleData: await X(e, t, r),
				lastFetchedAt: i.lastFetchedParentAt,
				ttlMs: sp
			}) && Z(e, t, r), !0),
			prepareFreshLoadState: () => {
				V(e.eventId, t, (e) => ({
					...e,
					visibleParent: !0,
					loadingParent: !0,
					parentError: null,
					parentMissing: !1,
					parentDeleted: !1,
					showParentLoadingIndicator: !1
				})), be(e.eventId, t);
			},
			displayCachedForFreshLoad: async () => ({
				displayedCached: await X(e, t, r),
				lastFetchedAt: oe(e.eventId, t).lastFetchedParentAt
			}),
			force: !!n.force,
			ttlMs: sp,
			awaitWhenInitialLoading: !0,
			runRevalidate: ({ showInitialLoading: n }) => Z(e, t, r, { showInitialLoading: n })
		});
	}
	async function Be(e, t = {}) {
		await ze(e, e.eventId, t);
	}
	function Ve(e) {
		He(e.eventId, e.eventId);
	}
	function He(e, t) {
		ye(tr(e, t)), V(e, t, (e) => ({
			...e,
			visibleParent: !1,
			showParentLoadingIndicator: !1
		}));
	}
	async function Ue(e) {
		oe(e.eventId, e.eventId).visibleParent ? Ve(e) : await Be(e);
	}
	function We(e) {
		Be(e, { force: !0 });
	}
	async function Ge(e, t) {
		oe(e.eventId, t).visibleParent ? He(e.eventId, t) : await ze(e, t);
	}
	function Ke(e, t) {
		ze(e, t, { force: !0 });
	}
	function qe(e) {
		let t = e.map((e) => e.fetchedAt).filter((e) => Number.isFinite(e));
		return t.length > 0 ? Math.max(...t) : null;
	}
	async function Je(e) {
		try {
			return {
				metadata: await u.get(e),
				readFailed: !1
			};
		} catch {
			return {
				metadata: null,
				readFailed: !0
			};
		}
	}
	async function Ye(e, t) {
		let { metadata: n, readFailed: r } = await Je(e);
		return r ? null : n ? n.completeness === "complete" ? n.fetchedAt : null : qe(t);
	}
	async function Xe(t, n, r, i = {}) {
		let a = await o.getDirectReplyRecords(n);
		Y(t.eventId, a.map((e) => ar(e)), _e(t, r));
		let s = await Pe(a);
		if (!e() || s.length === 0) return !1;
		let c = await yt(r, s, ["reply-db"], { resolveProfiles: !i.prefetchOnly });
		if (!e() || c.length === 0) return !1;
		if (!e()) return !0;
		let l = await Ye(n, c);
		return e() && V(t.eventId, n, (e) => ({ ...kf(e, {
			visibleChildren: !i.prefetchOnly || e.visibleChildren,
			lastFetchedChildrenAt: l
		}) })), !0;
	}
	async function Ze(t, n, a, s = {}) {
		let l = tr(t.eventId, n), d = R.getRequestId(), f = R.createChildRequestToken(l), m = Date.now();
		V(t.eventId, n, (e) => ({ ...Of(e, {
			showInitialLoading: !!s.showInitialLoading,
			prefetchOnly: !!s.prefetchOnly
		}) })), await Hf({
			isActive: () => d === R.getRequestId() && R.getChildRequestToken(l) === f && e(),
			cleanup: () => {
				R.deleteChildrenFetchTask(l), R.deleteChildRequestToken(l), nt(t.eventId, n);
			},
			onError: ip({
				updateExpansion: (e) => V(t.eventId, n, e),
				showInitialLoading: !!s.showInitialLoading,
				prefetchOnly: !!s.prefetchOnly
			}),
			run: async ({ ensureActive: e }) => {
				if (!e()) return;
				let d = r();
				if (!d) {
					V(t.eventId, n, (e) => ({ ...Af(e, { nextError: s.showInitialLoading && !s.prefetchOnly ? "nostr_not_ready" : null }) }));
					return;
				}
				let f = bt(yn), h = p.fetchDirectReplies(d, {
					eventId: n,
					createdAt: a.event.created_at,
					relayHints: _e(t, a),
					parents: [Rt({
						event: a.event,
						relayHints: _e(t, a)
					})].filter((e) => e !== null),
					relayConfig: i()
				});
				R.replaceChildrenFetchTask(l, h);
				let g = await h.promise;
				if (R.deleteChildrenFetchTask(l), !e()) return;
				rp(g.status), Y(t.eventId, g.events.map((e) => e.event), [..._e(t, a), ...g.relayUrls]);
				let _ = await Fe(g.events);
				g.events.length > 0 && await c.upsertChildInteractions({
					parentEventId: n,
					events: _,
					fetchedAt: g.status === "partial" ? null : g.fetchedAt,
					expectedChildGeneration: await f
				});
				let v = op(await u.save({
					parentEventId: n,
					completeness: ap(g.status),
					fetchedAt: g.fetchedAt,
					requestStartedAt: m
				})), y = await Pe(await o.getDirectReplyRecords(n));
				e() && (y.length > 0 && await yt(a, y, ["reply-db", "fetched-child"], { resolveProfiles: !s.prefetchOnly }), await Wf({
					status: Mf({
						nextRecordsLength: y.length,
						resultEventsLength: g.events.length
					}),
					strategies: Pf({
						fetchedAt: v,
						prefetchOnly: !!s.prefetchOnly,
						updateExpansion: (e) => {
							V(t.eventId, n, e);
						},
						prefetchChildReplyCounts: () => {
							ut(t, n);
						}
					})
				}), mt({
					anchorEventId: t.eventId,
					nodeEventId: n,
					effectiveFetchedAt: v,
					replyCount: y.length
				}));
			}
		});
	}
	function Qe(e, t) {
		ee.add(tr(e, t));
	}
	function $e(e, t) {
		ee.delete(tr(e, t));
	}
	function et(e, t) {
		return ee.has(tr(e, t));
	}
	function tt(e, t) {
		M.add(tr(e, t));
	}
	function nt(e, t) {
		M.delete(tr(e, t));
	}
	function rt(e, t) {
		return M.has(tr(e, t));
	}
	function it(e) {
		for (let t of M) t.endsWith(`:${e}`) && M.delete(t);
	}
	function at(t, n) {
		if (!rt(t.eventId, n)) return;
		let r = tr(t.eventId, n);
		if (R.getChildRequestToken(r) !== void 0) return;
		let i = oe(t.eventId, n);
		nt(t.eventId, n), e() && i.visibleChildren && ct(t, n, { force: !0 });
	}
	function ot(e, t, n) {
		let r = tr(e.eventId, t);
		return R.getChildRequestToken(r) === void 0 && !et(e.eventId, t) ? !1 : (n || (tt(e.eventId, t), V(e.eventId, t, (e) => ({
			...e,
			visibleChildren: !0
		}))), !0);
	}
	function st(e, t) {
		return t === e.eventId ? W(e) : C(x)[t];
	}
	async function ct(e, t, n = {}) {
		let r = st(e, t);
		if (!r || ot(e, t, !!n.prefetchOnly)) return;
		let i = oe(e.eventId, t);
		await qf({
			loading: i.loadingChildren,
			revalidating: i.revalidatingChildren,
			onInFlight: n.prefetchOnly ? () => void 0 : () => {
				V(e.eventId, t, (e) => ({
					...e,
					visibleChildren: !0
				}));
			},
			shouldHandleLoadedState: !n.force && i.loadedChildren,
			handleLoadedState: async () => {
				if (n.prefetchOnly) return !0;
				let a = Se(t).length > 0;
				return V(e.eventId, t, (e) => ({
					...e,
					visibleChildren: a
				})), a && ut(e, t), Vf({
					hasVisibleData: !0,
					lastFetchedAt: i.lastFetchedChildrenAt,
					ttlMs: sp
				}) && Ze(e, t, r), !0;
			},
			prepareFreshLoadState: () => void 0,
			displayCachedForFreshLoad: async () => ({
				displayedCached: await Xe(e, t, r, n),
				lastFetchedAt: oe(e.eventId, t).lastFetchedChildrenAt
			}),
			force: !!n.force,
			ttlMs: sp,
			prefetchOnly: !!n.prefetchOnly,
			awaitWhenInitialLoading: !1,
			onSkipPrefetchReplyCounts: () => {
				ut(e, t);
			},
			runRevalidate: ({ showInitialLoading: i }) => Ze(e, t, r, {
				prefetchOnly: n.prefetchOnly,
				showInitialLoading: i
			})
		});
	}
	async function lt(e, t = {}) {
		await ct(e, e.eventId, t);
	}
	async function ut(e, t) {
		let n = tr(e.eventId, t);
		if (!j.has(n)) {
			j.add(n);
			try {
				await dt(e, t);
			} finally {
				j.delete(n);
			}
		}
	}
	async function dt(t, n) {
		let r = Date.now(), i = R.getRequestId(), a = Se(n).filter((e) => {
			let n = oe(t.eventId, e), i = typeof n.lastFetchedChildrenAt == "number" && r - n.lastFetchedChildrenAt < tp;
			return !n.loadedChildren && !n.loadingChildren && !n.revalidatingChildren && !i;
		});
		if (a.length === 0) return;
		for (let e of a) Qe(t.eventId, e);
		let o = [];
		if (await Promise.all(a.map(async (n) => {
			try {
				if (!e()) {
					$e(t.eventId, n);
					return;
				}
				let r = await ft(t, n), a = oe(t.eventId, n), s = typeof a.lastFetchedChildrenAt == "number" && Date.now() - a.lastFetchedChildrenAt < tp, c = !r || a.lastFetchedChildrenAt === null;
				c && i === R.getRequestId() && e() && et(t.eventId, n) && R.getChildRequestToken(tr(t.eventId, n)) === void 0 && !a.loadingChildren && !a.revalidatingChildren && (!a.loadedChildren || a.lastFetchedChildrenAt === null) && !s ? o.push(n) : ($e(t.eventId, n), c ? at(t, n) : nt(t.eventId, n));
			} catch {
				$e(t.eventId, n), at(t, n);
			}
		})), o.sort((e, n) => Number(rt(t.eventId, n)) - Number(rt(t.eventId, e))), o.splice(Zf).forEach((e) => {
			$e(t.eventId, e), at(t, e);
		}), !e() || o.length === 0) {
			o.forEach((e) => {
				$e(t.eventId, e), at(t, e);
			});
			return;
		}
		let s = [];
		for (let e = 0; e < o.length; e += $f) s.push(o.slice(e, e + $f));
		let c = 0, l = Math.min(Qf, s.length), u = async () => {
			for (; e();) {
				let e = c;
				c += 1;
				let n = s[e];
				if (!n) return;
				await vt(t, n);
			}
		};
		try {
			await Promise.all(Array.from({ length: l }, () => u()));
		} finally {
			a.forEach((e) => $e(t.eventId, e));
		}
	}
	async function ft(t, n) {
		let r = await o.getDirectReplyRecords(n), { metadata: i, readFailed: a } = await Je(n);
		if (!e()) return !1;
		let s = await Pe(r), c = C(x)[n];
		if (!e() || !c || s.length === 0 && !i) return !1;
		let l = await yt(c, s, ["reply-db"], { resolveProfiles: !1 });
		if (!e() || l.length === 0 && !i) return !1;
		let u = a ? null : i ? i.completeness === "complete" ? i.fetchedAt : null : qe(l);
		return e() && V(t.eventId, n, (e) => ({ ...kf(e, { lastFetchedChildrenAt: u }) })), !0;
	}
	function pt(e, t) {
		let n = new Set(t), r = /* @__PURE__ */ new Map();
		for (let t of e) {
			if (!n.has(t.parentEventId)) continue;
			let e = r.get(t.parentEventId) ?? [];
			e.push(t), r.set(t.parentEventId, e);
		}
		for (let e of r.values()) e.sort((e, t) => e.createdAt === t.createdAt ? e.eventId.localeCompare(t.eventId) : e.createdAt - t.createdAt);
		return r;
	}
	function mt(e) {
		return e.effectiveFetchedAt !== null || e.replyCount > 0 ? !1 : (V(e.anchorEventId, e.nodeEventId, (e) => ({
			...e,
			loadedChildren: !1,
			loadingChildren: !1,
			revalidatingChildren: !1,
			childrenError: null,
			lastFetchedChildrenAt: null
		})), !0);
	}
	function gt(e) {
		let t = { ...C(x) }, n = { ...C(S) }, r = { ...C(w) }, i = { ...C(T) }, a = { ...C(P) }, o = { ...C(te) }, s = { ...C(ne) }, c = { ...C(L) }, l = !1, u = !1, d = !1, f = !1, p = /* @__PURE__ */ new Map(), m = (e) => {
			let n = xr(t[e.eventId], e);
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
			a[t] = Cf(i), o[t] = i;
		}
		for (let [t, n] of Object.entries(e.cachedReactionProfilesByPubkey)) s[t] = n;
		for (let t of e.targetParentIds) {
			if (!e.anchorNodesByParentId.get(t)) continue;
			let n = [], r = [];
			for (let i of e.directReplyRecordsByParentId.get(t) ?? []) {
				let e = ar(i);
				if (q(e.pubkey, e.id)) continue;
				let a = m(or({
					event: e,
					relayUrls: Jf(i.relayUrls),
					sources: ["reply-db", "inbound-sync"]
				}));
				a.eventId !== t && (h(a.eventId, t), r.push(a.eventId), n.push(i));
			}
			p.set(t, r);
			let a = e.metadataByParentId.get(t) ?? null, o = e.metadataReadFailedParentIds.has(t);
			if (n.length === 0 && !a) continue;
			let s = e.postsByParentId.get(t);
			if (!s) continue;
			let c = tr(s.eventId, t), l = i[c] ?? er();
			i[c] = a?.completeness === "partial" && n.length === 0 ? {
				...l,
				loadedChildren: !1,
				loadingChildren: !1,
				revalidatingChildren: !1,
				childrenError: null,
				lastFetchedChildrenAt: null
			} : kf(l, { lastFetchedChildrenAt: o ? null : a ? op(a) : qe(n) }), f = !0;
		}
		for (let [e, n] of p) {
			let i = r[e] ?? [];
			r[e] = br(Yf([...i, ...n]).filter((t) => t !== e && !Te(t)), t), d = !0;
		}
		for (let [n, r] of e.knownNodeProfilesByPubkey) if (r) for (let [e, i] of Object.entries(t)) i.authorPubkey === n && (t[e] = xr(i, {
			...i,
			profile: r
		}), l = !0);
		for (let t of e.targetParentIds) c[t] = vr(o[t] ?? [], s);
		l && N(x, t), u && N(S, n), d && N(w, r), f && N(T, i), N(P, a), N(te, o), N(ne, s), N(L, c);
	}
	async function _t(t, n) {
		if (!e() || t.length === 0) return;
		let r = lp(t, n);
		if (r.length === 0) return;
		let i = R.getRequestId(), a = !!n?.length, l = new Map(t.map((e) => [e.eventId, e]));
		await Uf({
			items: r,
			isActive: () => i === R.getRequestId() && e(),
			run: async ({ ensureActive: e }) => {
				let t = r.flatMap((t) => {
					let n = l.get(t);
					if (!n || !e()) return [];
					let r = tr(n.eventId, t), i = oe(n.eventId, t);
					return !a && (A.has(r) || i.loadedChildren || i.loadingChildren || i.revalidatingChildren) ? (A.add(r), []) : (A.add(r), [{
						parentEventId: t,
						post: n
					}]);
				});
				if (t.length === 0 || !e()) return;
				let n = t.map(({ parentEventId: e }) => e), i = c.getChildInteractionsForParents ? await c.getChildInteractionsForParents(n) : (await Promise.all(n.map(async (e) => {
					let [t, n] = await Promise.all([_r(e, s), o.getDirectReplyRecords(e)]);
					return [...t, ...n];
				}))).flat();
				if (!e()) return;
				let d = [], f = /* @__PURE__ */ new Set();
				try {
					d = u.getForParentEventIds ? await u.getForParentEventIds(n) : (await Promise.all(n.map((e) => Je(e)))).flatMap(({ metadata: e, readFailed: t }, r) => t ? (f.add(n[r]), []) : e ? [e] : []);
				} catch {
					for (let e of n) f.add(e);
				}
				if (!e()) return;
				let p = pt(await Pe(i), n);
				if (!e()) return;
				let m = new Map(t.map(({ parentEventId: e, post: t }) => [e, ce(t)])), h = /* @__PURE__ */ new Map(), _ = /* @__PURE__ */ new Map(), v = [], y = /* @__PURE__ */ new Set(), b = /* @__PURE__ */ new Map(), x = (e, t) => {
					b.set(e, Jf([...b.get(e) ?? [], ...t]));
				};
				for (let e of n) {
					let t = m.get(e);
					if (!t) continue;
					x(t.authorPubkey, t.relayUrls);
					let n = [], r = [];
					for (let i of p.get(e) ?? []) i.kind === 7 ? (n.push(i), i.authorPubkey && (y.add(i.authorPubkey), x(i.authorPubkey, t.relayUrls))) : [
						1,
						42,
						1111
					].includes(i.kind) && (up({
						parentNode: t,
						record: i
					}) ? (r.push(i), x(i.authorPubkey, i.relayUrls)) : v.push(i.eventId));
					h.set(e, n), _.set(e, r);
				}
				if (v.length > 0 && (await Promise.all(v.map((e) => c.deleteChildInteractionByEventId(e))), !e())) return;
				let S = y.size > 0 ? await zt.getProfiles(Array.from(y), { allowBackgroundRefresh: !1 }) : {};
				if (!e()) return;
				let C = /* @__PURE__ */ new Map();
				for (let [e, t] of b) C.set(e, g.ensureProfile(e, t));
				gt({
					postsByParentId: l,
					targetParentIds: n,
					anchorNodesByParentId: m,
					reactionRecordsByParentId: h,
					directReplyRecordsByParentId: _,
					metadataByParentId: new Map(d.map((e) => [e.parentEventId, e])),
					metadataReadFailedParentIds: f,
					cachedReactionProfilesByPubkey: S,
					knownNodeProfilesByPubkey: C
				});
			}
		});
	}
	async function vt(t, n) {
		let a = n.map((e) => C(x)[e]).filter((e) => !!e);
		if (a.length === 0) return;
		let s = R.getRequestId(), l = Date.now(), d = /* @__PURE__ */ new Map(), f = /* @__PURE__ */ new Map(), m = !1, h = !1, g = `${t.eventId}:children-prefetch:${n.join(",")}`, _ = () => m || s !== R.getRequestId() || !e() ? !1 : n.every((e) => et(t.eventId, e) && R.getChildRequestToken(tr(t.eventId, e)) === d.get(e)), v = (e) => {
			for (let r of n) If({
				updateExpansion: (e) => V(t.eventId, r, e),
				showInitialLoading: !1,
				prefetchOnly: !0,
				errorCode: e
			});
		};
		await Uf({
			items: n,
			isActive: _,
			prepareItem: (e) => {
				let n = tr(t.eventId, e), r = R.createChildRequestToken(n);
				return d.set(e, r), V(t.eventId, e, (e) => ({ ...Of(e, {
					showInitialLoading: !1,
					prefetchOnly: !0
				}) })), r;
			},
			completeBatch: (e) => {
				if (e && _()) for (let r of n) V(t.eventId, r, (t) => ({ ...kf(t, {
					loadedChildren: e && ((f.get(r) ?? null) !== null || Se(r).length > 0),
					revalidatingChildren: !1,
					lastFetchedChildrenAt: f.get(r) ?? null
				}) }));
			},
			cleanupItem: (e, n) => {
				let r = tr(t.eventId, e);
				R.getChildRequestToken(r) === n && R.deleteChildRequestToken(r), $e(t.eventId, e), h || m ? nt(t.eventId, e) : at(t, e);
			},
			cleanup: () => {
				R.deleteChildrenFetchTask(g);
			},
			onError: () => {
				v("fetch_failed");
			},
			run: async ({ ensureActive: e }) => {
				if (!e()) return;
				let s = r();
				if (!s) {
					v("nostr_not_ready");
					return;
				}
				let d = bt(yn), _ = ve(t, a), y = p.fetchDirectReplies(s, {
					eventId: n[0] ?? "",
					eventIds: n,
					createdAt: Math.min(...a.map((e) => e.event.created_at)),
					relayHints: _,
					parents: a.map((e) => Rt({
						event: e.event,
						relayHints: [...e.relayUrls, ...he(e.event).relayHints]
					})).filter((e) => e !== null),
					relayConfig: i()
				});
				R.replaceChildrenFetchTask(g, y);
				let b = await y.promise;
				if (R.deleteChildrenFetchTask(g), !e()) return;
				if (b.status === "cancelled") {
					m = !0;
					for (let e of n) V(t.eventId, e, (e) => ({ ...Af(e, { nextError: e.childrenError }) }));
					return;
				}
				rp(b.status);
				let S = new Set(n), w = b.events.filter((e) => S.has(e.parentEventId) && e.event.id !== e.parentEventId);
				w.length > 0 && await Y(t.eventId, w.map((e) => e.event), [..._, ...b.relayUrls], `children-prefetch:${n.join(",")}`);
				let T = await Fe(w);
				if (!e()) return;
				let E = /* @__PURE__ */ new Map(), D = new Map(w.map((e) => [e.event.id, e.parentEventId]));
				for (let e of T) {
					let t = D.get(e.event.id);
					if (!t || !S.has(t)) continue;
					let n = E.get(t) ?? [];
					n.push(e), E.set(t, n);
				}
				for (let t of n) {
					let n = E.get(t) ?? [];
					if (n.length > 0 && await c.upsertChildInteractions({
						parentEventId: t,
						events: n,
						fetchedAt: b.status === "partial" ? null : b.fetchedAt,
						expectedChildGeneration: await d
					}), !e()) return;
					let r = await u.save({
						parentEventId: t,
						completeness: ap(b.status),
						fetchedAt: b.fetchedAt,
						requestStartedAt: l
					});
					f.set(t, op(r));
					let i = await Pe(await o.getDirectReplyRecords(t)), a = C(x)[t];
					a && await yt(a, i, ["reply-db", "fetched-child"], { resolveProfiles: !1 });
				}
				e() && (h = !0);
			}
		});
	}
	async function yt(e, t, n, r = {}) {
		let i = e.eventId, a = [], o = [], s = r.resolveProfiles !== !1;
		for (let r of t) {
			let t = ar(r);
			if (!up({
				parentNode: e,
				record: r
			})) {
				await c.deleteChildInteractionByEventId(r.eventId);
				continue;
			}
			if (q(t.pubkey, t.id)) continue;
			let l = s ? await pe({
				event: t,
				relayUrls: r.relayUrls,
				sources: n
			}) : H({
				event: t,
				relayUrls: Jf(r.relayUrls),
				sources: n
			});
			s || ue(t.pubkey, Jf(r.relayUrls)), l.eventId !== i && (U(l.eventId, i), a.push(l.eventId), o.push(r));
		}
		return se(i, a), o;
	}
	function xt(e) {
		St(e.eventId, e.eventId);
	}
	function St(e, t) {
		nt(e, t), V(e, t, (e) => ({
			...e,
			visibleChildren: !1
		}));
	}
	function Ct(e) {
		oe(e.eventId, e.eventId).visibleChildren ? xt(e) : lt(e);
	}
	function wt(e) {
		lt(e, { force: !0 });
	}
	function Tt(e, t) {
		oe(e.eventId, t).visibleChildren ? St(e.eventId, t) : ct(e, t);
	}
	function Dt(e, t) {
		ct(e, t, { force: !0 });
	}
	async function Ot(t, n = []) {
		if (!t?.id || ![
			1,
			42,
			1111
		].includes(t.kind)) return !0;
		let r = he(t), i = r.parentId;
		if (!i) return !0;
		let a = n.find((e) => e.eventId === i) ?? null, s = Object.keys(C(T)).filter((e) => e.endsWith(`:${i}`));
		if (!a && s.length === 0) return !1;
		let l = v.getTargetSnapshot(i), u = a ? C(x)[i] ?? or({
			event: ir(a),
			relayUrls: Jf([
				...a.relayHints,
				...a.acceptedRelays,
				...a.fetchedRelays ?? []
			]),
			sources: ["history-record"]
		}) : C(x)[i] ?? (l?.status === "resolved" && l.event ? or({
			event: l.event,
			relayUrls: l.relayHints,
			sources: ["fetched-parent"]
		}) : null);
		if (!u) return !1;
		let d = Rt({
			event: u.event,
			relayHints: u.relayUrls
		});
		if (!d || !gn({
			child: t,
			parent: d
		}).valid) return !1;
		let f = await bt(yn);
		if ((await Ne([t])).length === 0) return !1;
		await c.upsertChildInteractions({
			parentEventId: i,
			expectedChildGeneration: f,
			events: [{
				event: t,
				relayUrls: r.relayHints
			}]
		});
		let p = await Pe(await o.getDirectReplyRecords(i));
		if (!e()) return !1;
		await yt(u, p, ["reply-db", "posted-reply"]);
		let m = (e, t) => {
			V(e, t, (e) => ({
				...e,
				loadedChildren: !0,
				loadingChildren: !1,
				childrenError: null
			}));
		};
		a && m(a.eventId, a.eventId);
		for (let e of s) {
			let t = e.indexOf(":");
			t < 0 || m(e.slice(0, t), e.slice(t + 1));
		}
		return !0;
	}
	async function kt(e) {
		e.eventId && e.authorPubkey && (it(e.eventId), Ee(e.authorPubkey, e.eventId), Ae(e.eventId), De(e.eventId, e.authorPubkey, { revealKnownParent: !0 }), e.deletionEvent && await l.upsertValidDeletionRequests({
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
		}), await c.deleteChildInteractionByEventId(e.eventId));
	}
	I(() => {
		e() && N(O, v.getScopeRevision(b), !0);
	}), I(() => {
		if (e()) {
			C(O);
			for (let e of Object.keys(C(T))) {
				let [t, n] = e.split(":"), r = C(x)[n]?.parentEventId;
				if (!r) continue;
				let i = v.getTargetSnapshot(r);
				i?.status === "deleted" && (oe(t, n).parentDeleted || (i.authorPubkey && (Ee(i.authorPubkey, r), De(r, i.authorPubkey, { revealKnownParent: !0 })), Le(t, n)));
			}
		}
	});
	function At() {
		R.incrementRequestId(), v.invalidateScope(b), R.cancelAndClearFetchTasks(), R.clearChildRequestTokens(), ee.clear(), M.clear(), _ && g.reset(), k.clearAll(), N(T, Object.fromEntries(Object.entries(C(T)).map(([e, t]) => [e, {
			...t,
			loadingParent: !1,
			loadingChildren: !1,
			revalidatingParent: !1,
			revalidatingChildren: !1,
			showParentLoadingIndicator: !1
		}])));
	}
	function jt() {
		At(), y && v.reset(), R.incrementRequestId(), N(x, {}), N(S, {}), N(w, {}), N(T, {}), N(E, {}), N(P, {}), N(te, {}), N(ne, {}), A.clear(), j.clear();
	}
	return I(() => {
		t() || F(jt);
	}), I(() => {
		if (e()) return () => {
			At();
		};
	}), re(() => {
		v.invalidateScope(b), At(), fe(), y && v.reset(), _ && g.dispose();
	}), {
		getAnchorState: we,
		toggleParent: Ue,
		retryParent: We,
		toggleNodeParent: Ge,
		retryNodeParent: Ke,
		toggleChildren: Ct,
		retryChildren: wt,
		toggleNodeChildren: Tt,
		retryNodeChildren: Dt,
		recordPostedReply: Ot,
		recordDeletedEvent: kt,
		loadCachedChildInteractionStateForPosts: _t,
		cancelCurrentGraphFetches: At,
		resetState: jt
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/hooks/usePostHistoryInboundInteractionsSync.svelte.ts
function pp(e) {
	return !!e && typeof e.use == "function";
}
function mp({ getShow: e, getPubkeyHex: t, getRxNostr: n, getRelayConfig: r, getPosts: i, onSavedInboundInteractions: a = () => void 0, reconcileDirectReplyCandidates: o }) {
	let s = T({
		status: "idle",
		activePubkeyHex: null,
		hasStartedInitialDialogBootstrap: !1
	}), c = null, l = 0;
	function u() {
		l += 1, c?.cancel(), c = null, s.status = "idle";
	}
	async function d(d) {
		let f = t(), p = n(), m = l, h = () => e() && m === l && t() === f && n() === p;
		if (!e() || !f || !pp(p) || i().length === 0) return;
		if (d === "dialog-open-refresh") {
			let e = await Bn.get(f);
			if (typeof e?.lastDialogRefreshAt == "number" && Date.now() - e.lastDialogRefreshAt < 6e4) return;
		}
		if (!h()) return;
		u();
		let g = ++l;
		s.status = "syncing";
		let _ = d === "dialog-open-refresh" ? zn.runInbound(p, {
			ownerPubkeyHex: f,
			relayConfig: r(),
			reason: d,
			reconcileDirectReplyCandidates: o
		}) : {
			...Xn.syncRecent(p, {
				ownerPubkeyHex: f,
				relayConfig: r(),
				reason: d,
				reconcileDirectReplyCandidates: o
			}),
			joinedExisting: !1
		};
		c = _;
		let v = await _.promise;
		g === l && c === _ && e() && t() === f && (c = null, s.status = "idle", !(_.joinedExisting || v.status === "cancelled" || v.changedParentEventIds.length === 0) && (await a(v.changedParentEventIds), g === l && e() && t() === f && n() === p && Rn({
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
		let i = l, a = n(), o = await Bn.get(r);
		i === l && e() && t() === r && n() === a && await d(o?.lastSyncedAt ? "dialog-open-refresh" : "initial-dialog-bootstrap");
	}
	return I(() => {
		let e = t() ?? null;
		e !== s.activePubkeyHex && (u(), s.activePubkeyHex = e, s.hasStartedInitialDialogBootstrap = !1);
	}), I(() => {
		e() ? t() && pp(n()) && i().length !== 0 && (s.hasStartedInitialDialogBootstrap || (s.hasStartedInitialDialogBootstrap = !0, f())) : (u(), s.hasStartedInitialDialogBootstrap = !1);
	}), {
		state: s,
		cancelCurrentSync: u,
		runSync: d
	};
}
var hp = {
	status: "valid",
	ruleVersion: 1
}, gp = {
	status: "invalid",
	ruleVersion: 1
};
function _p(e) {
	return e?.ruleVersion === 1 && (e.status === "valid" || e.status === "invalid");
}
function vp(e) {
	return e?.status === "valid" && e.ruleVersion === 1;
}
function yp(e) {
	if (ge(e)) try {
		return `nostr:${Ue(e)}\u0000${e.id}\u0000${e.sig}`;
	} catch {}
	try {
		return `raw:${JSON.stringify(e)}`;
	} catch {
		return "raw:unserializable";
	}
}
function bp(e) {
	if (!ge(e)) return { ...gp };
	try {
		let t = G(e);
		return ce(t) && Ue(t) === t.id && W(t) ? { ...hp } : { ...gp };
	} catch {
		return { ...gp };
	}
}
async function xp(e, t) {
	for (let { id: n, fingerprint: r, verification: i } of e) {
		let e = await t.get(n);
		e && yp(e.rawEvent) === r && await t.update(n, { rawEventVerification: i });
	}
}
function Sp(e, t) {
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
async function Cp(e, t, n, r) {
	let i = [...e.map((e) => ({
		type: "post",
		record: e
	})), ...t.map((e) => ({
		type: "deletion",
		record: e
	}))].filter((e) => !_p(e.record.rawEventVerification)), a = i.length;
	if (a === 0) return;
	let o = 0, s = /* @__PURE__ */ new Map(), c = [], l = [];
	async function u() {
		if (c.length > 0) {
			let e = c.splice(0);
			await (n.transaction?.post ?? (async (e) => e()))(() => xp(e, n.post));
		}
		if (l.length > 0) {
			let e = l.splice(0);
			await (n.transaction?.deletion ?? (async (e) => e()))(() => xp(e, n.deletion));
		}
	}
	r?.({
		phase: "verifying",
		processed: o,
		total: a
	});
	for (let e of i) {
		let t = yp(e.record.rawEvent), n = s.get(t) ?? bp(e.record.rawEvent);
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
function wp(e, t) {
	if (!ge(e) || e.kind !== t) return !1;
	try {
		return ce(e) && Ue(e) === e.id;
	} catch {
		return !1;
	}
}
function Tp(e) {
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
function Ep(e, t) {
	return e.created_at === t.created_at ? e.id === t.id ? 0 : e.id < t.id ? -1 : 1 : e.created_at - t.created_at;
}
function Dp(e) {
	return e.rawEvent !== null && e.rawEvent !== void 0;
}
function Op(e, t, n) {
	return !vp(e.rawEventVerification) || !wp(t, 5) || t.pubkey !== n || e.targetAuthorPubkey !== n || e.deletionEventPubkey !== n || t.id !== e.deletionEventId ? !1 : ct(t).includes(e.targetEventId);
}
function kp() {
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
function Ap(e, t) {
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
async function jp(e, t, n, r = {}) {
	let i = kp(), a = [], o = [], s = /* @__PURE__ */ new Set(), c = /* @__PURE__ */ new Set(), l = /* @__PURE__ */ new Set(), u = t.filter((t) => t.pubkeyHex === e), d = n.filter((t) => t.targetAuthorPubkey === e), f = new Map((r.sensitivePayloadRecords ?? []).filter((t) => t.pubkeyHex === e && t.deletedAt === void 0).map((e) => [e.id, e])), p = /* @__PURE__ */ new Set();
	for (let e of u) {
		if (!vt(e.kind)) continue;
		if (!vp(e.rawEventVerification) || !me(e.rawEvent, e) || !wp(e.rawEvent, e.kind)) {
			i.skippedPostCount += 1;
			continue;
		}
		a.push(Tp(e.rawEvent)), s.add(e.eventId), i.exportedPostEventCount += 1;
		let t = e.rawEvent, n = st(t);
		if (!n) continue;
		let r = f.get(n.eventId)?.rawEvent;
		!r || !ot(t, r, n.eventId) ? i.missingPayloadEventCount += 1 : p.has(r.id) || (p.add(r.id), a.push(Tp(r)), i.exportedPayloadEventCount += 1);
	}
	let m = /* @__PURE__ */ new Map();
	for (let e of d) {
		let t = m.get(e.deletionEventId) ?? [];
		t.push(e), m.set(e.deletionEventId, t);
	}
	for (let t of m.values()) {
		let n = t.find((t) => Op(t, t.rawEvent, e));
		if (n) {
			let e = Tp(n.rawEvent);
			o.push(e);
			for (let t of ct(e)) c.add(t);
			i.exportedDeletionEventCount += 1;
		} else {
			for (let e of t) l.add(e.targetEventId);
			t.every((e) => !Dp(e)) ? i.missingDeletionRawEventCount += 1 : i.invalidDeletionRawEventCount += 1;
		}
	}
	let h = /* @__PURE__ */ new Set();
	for (let e of u) vt(e.kind) && e.deletedAt !== void 0 && s.has(e.eventId) && !c.has(e.eventId) && !l.has(e.eventId) && h.add(e.eventId);
	i.missingDeletionRawEventCount += h.size, a.sort(Ep), o.sort(Ep);
	let g = [...a, ...o];
	return i.exportedEventCount = g.length, i.isPartial = i.skippedPostCount > 0 || i.missingDeletionRawEventCount > 0 || i.invalidDeletionRawEventCount > 0 || i.missingPayloadEventCount > 0, r.onProgress?.({ phase: "creating" }), {
		result: i,
		...Ap(g, r.includeJsonl === !0)
	};
}
async function Mp(e) {
	let t = e.postRecords.filter((t) => t.pubkeyHex === e.pubkeyHex), n = e.deletionRecords.filter((t) => t.targetAuthorPubkey === e.pubkeyHex);
	return await Cp(t, n, e.verificationStores ?? Sp(t, n), e.onProgress), jp(e.pubkeyHex, t, n, e);
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryJsonlExportService.ts
function Np() {
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
var Pp = new class {
	postHistoryRepository;
	deletionRequestsRepository;
	workerFactory;
	sensitivePayloadRepository;
	constructor(e = {}) {
		this.postHistoryRepository = e.postHistoryRepository ?? Q, this.deletionRequestsRepository = e.deletionRequestsRepository ?? Jt, this.workerFactory = e.workerFactory ?? (() => new Worker(new URL(
			/* @vite-ignore */
			new URL("postHistoryJsonlExportWorker-B9jLXpDX.js", import.meta.url).href,
			"" + import.meta.url
		), { type: "module" })), this.sensitivePayloadRepository = e.sensitivePayloadRepository ?? kt;
	}
	exportForPubkeyInWorker(e, t = {}) {
		if (!e) {
			let { jsonl: e, ...t } = Np();
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
		if (!e) return Np();
		let [t, n, r] = await Promise.all([
			this.postHistoryRepository.getAll({ pubkeyHex: e }),
			this.deletionRequestsRepository.getAllForTargetAuthorPubkey(e),
			this.sensitivePayloadRepository.getAllForPubkey(e)
		]), i = await Mp({
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
}(), Fp = a("<p role=\"status\"> </p>"), Ip = a("<h3 class=\"post-history-current-month-heading svelte-9hvdbo\"><span class=\"post-history-current-month svelte-9hvdbo\"> </span></h3>"), Lp = a("<div class=\"calendar-icon svg-icon\" aria-hidden=\"true\"></div>"), Rp = a("<div class=\"repair-icon svg-icon svelte-9hvdbo\" aria-hidden=\"true\"></div>"), zp = a("<div class=\"search-icon svg-icon svelte-9hvdbo\" aria-hidden=\"true\"></div>"), Bp = a("<div class=\"more-icon svg-icon\"></div>"), Vp = a("<div class=\"post-history-menu-summary\" role=\"presentation\"><span class=\"post-history-summary-line post-history-summary-count svelte-9hvdbo\"> </span></div> <!>", 1), Hp = a("<div class=\"return-to-latest-icon svg-icon\" aria-hidden=\"true\"></div> <span> </span>", 1), Up = a("<div class=\"jump-to-oldest-icon svg-icon\" aria-hidden=\"true\"></div> <span> </span>", 1), Wp = a("<div class=\"export-icon svg-icon\" aria-hidden=\"true\"></div> <span> </span>", 1), Gp = a("<div class=\"import-icon svg-icon svelte-9hvdbo\" aria-hidden=\"true\"></div> <span> </span>", 1), Kp = a("<div class=\"trash-icon svg-icon\" aria-hidden=\"true\"></div> <span> </span>", 1), qp = a("<div class=\"post-history-menu-body\"><!> <!> <!> <!> <!> <!> <!> <!> <!></div>"), Jp = a("<!> <!>", 1), Yp = a("<div class=\"search-icon svg-icon svelte-9hvdbo\"></div>"), Xp = a("<div class=\"xmark-icon svg-icon svelte-9hvdbo\" aria-hidden=\"true\"></div>"), Zp = a("<div class=\"post-history-search-row svelte-9hvdbo\"><div><div class=\"post-history-search-leading svelte-9hvdbo\" aria-hidden=\"true\"><!></div> <input class=\"post-history-search-input svelte-9hvdbo\" type=\"search\"/></div> <!></div>"), Qp = a("<span class=\"post-history-date-picker-nav-icon post-history-date-picker-nav-icon-left svg-icon svelte-9hvdbo\" aria-hidden=\"true\"></span>"), $p = a("<span class=\"post-history-date-picker-nav-icon post-history-date-picker-nav-icon-right svg-icon svelte-9hvdbo\" aria-hidden=\"true\"></span>"), em = a("<button type=\"button\" class=\"post-history-date-picker-year-nav\" aria-label=\"Previous year\"><span class=\"post-history-date-picker-year-nav-icon post-history-date-picker-year-nav-icon-left svg-icon\" aria-hidden=\"true\"></span></button> <!> <!> <!> <button type=\"button\" class=\"post-history-date-picker-year-nav\" aria-label=\"Next year\"><span class=\"post-history-date-picker-year-nav-icon post-history-date-picker-year-nav-icon-right svg-icon\" aria-hidden=\"true\"></span></button>", 1), tm = a("<!> <!> <!>", 1), nm = a("<div class=\"jump-icon svg-icon svelte-9hvdbo\" aria-hidden=\"true\"></div>"), rm = a("<div class=\"post-history-utility-panel svelte-9hvdbo\"><div class=\"post-history-utility-label svelte-9hvdbo\" id=\"post-history-jump-date-label\"> </div> <div class=\"post-history-utility-controls svelte-9hvdbo\"><!> <!> <!></div></div>"), im = a("<div class=\"post-history-list-loading svelte-9hvdbo\" aria-hidden=\"true\"><!></div>"), am = a("<div class=\"empty-state svelte-9hvdbo\"><div class=\"empty-message svelte-9hvdbo\"> </div></div>"), om = a("<div class=\"keyboard-arrow-up-icon svg-icon\" aria-hidden=\"true\"></div> ", 1), sm = a("<div class=\"post-history-nav-row post-history-nav-row-top svelte-9hvdbo\"><!></div>"), cm = a("<div class=\"post-history-auto-load-sentinel post-history-auto-load-newer-sentinel svelte-9hvdbo\"><!></div>"), lm = a("<div aria-hidden=\"true\"><!></div>"), um = a("<div class=\"post-history-channel-row svelte-9hvdbo\"><span class=\"channel-icon svg-icon svelte-9hvdbo\" aria-hidden=\"true\"></span> <span class=\"channel-label svelte-9hvdbo\"> </span> <span class=\"channel-name svelte-9hvdbo\"> </span></div>"), dm = a("<span class=\"deleted-badge svelte-9hvdbo\"> </span>"), fm = a("<span class=\"delete-failed svelte-9hvdbo\"> </span>"), pm = a("<div class=\"post-meta-inline svelte-9hvdbo\"><!> <!></div>"), mm = a("<div class=\"calendar-icon svg-icon\" aria-hidden=\"true\"></div> <span> </span>", 1), hm = a("<div class=\"post-history-menu-body\"><div class=\"post-history-menu-timestamp\"> </div> <!> <!> <!></div>"), gm = a("<span class=\"svelte-9hvdbo\"> </span> <!>", 1), _m = a("<div class=\"post-preview-header svelte-9hvdbo\"><!> <div class=\"post-preview-header-right svelte-9hvdbo\"><!> <!></div></div>"), vm = a("<div class=\"post-preview-quotes svelte-9hvdbo\"></div>"), ym = a("<div class=\"open-in-new-icon svg-icon\" aria-hidden=\"true\"></div> <span class=\"svelte-9hvdbo\"> </span>", 1), bm = a("<div aria-hidden=\"true\"></div> <span class=\"svelte-9hvdbo\"> </span>", 1), xm = a("<div class=\"calendar-icon svg-icon\" aria-hidden=\"true\"></div> <span class=\"svelte-9hvdbo\"> </span>", 1), Sm = a("<!> <!> <!> <!> <!>", 1), Cm = a("<!> <!> <div class=\"post-history-thread-anchor-post svelte-9hvdbo\"><div class=\"post-preview-body svelte-9hvdbo\"><!></div> <!> <!> <!></div>", 1), wm = a("<li><div class=\"post-history-main svelte-9hvdbo\"><div class=\"post-preview svelte-9hvdbo\"><!></div></div></li>"), Tm = a("<div class=\"post-history-auto-load-sentinel svelte-9hvdbo\"><!></div>"), Em = a("<div class=\"post-history-auto-load-slot svelte-9hvdbo\" aria-hidden=\"true\"><!></div>"), Dm = a("<div class=\"post-history-sparse-state svelte-9hvdbo\" role=\"status\"><p class=\"svelte-9hvdbo\"> </p> <p class=\"svelte-9hvdbo\"> </p></div>"), Om = a("<div class=\"cloud-download-icon svg-icon\" aria-hidden=\"true\"></div> ", 1), km = a("<div class=\"keyboard-arrow-down-icon svg-icon\" aria-hidden=\"true\"></div> ", 1), Am = a("<div class=\"post-history-saved-boundary svelte-9hvdbo\" role=\"status\"><div class=\"post-history-saved-boundary-actions svelte-9hvdbo\"><!> <!></div></div>"), jm = a("<div class=\"post-history-nav-row post-history-nav-row-bottom svelte-9hvdbo\"><!></div>"), Mm = a("<div class=\"post-history-exhausted-state svelte-9hvdbo\"><!></div>"), Nm = a("<div class=\"post-history-search-bottom-spacer svelte-9hvdbo\" aria-hidden=\"true\"></div>"), Pm = a("<!> <!> <ul class=\"post-history-list svelte-9hvdbo\"></ul> <!> <!> <!>", 1), Fm = a("<div class=\"post-history-nav-row post-history-sync-footer svelte-9hvdbo\" role=\"status\"><!></div>"), Im = a("<div class=\"vertical-align-top-icon svg-icon\" aria-hidden=\"true\"></div>"), Lm = a("<div class=\"post-history-latest-row svelte-9hvdbo\"><!></div>"), Rm = a("<div class=\"delete-confirm-body svelte-9hvdbo\"><p class=\"delete-confirm-description svelte-9hvdbo\"> </p> <p class=\"delete-confirm-warning svelte-9hvdbo\"> </p></div>"), zm = a("<div class=\"delete-confirm-body svelte-9hvdbo\"><p class=\"delete-confirm-description svelte-9hvdbo\"> </p></div>"), Bm = a("<div> </div>"), Vm = a("<div class=\"post-history-tab-content svelte-9hvdbo\"><!> <div class=\"post-history-heading svelte-9hvdbo\"><div class=\"post-history-heading-main svelte-9hvdbo\"><!> <!></div> <div class=\"post-history-heading-actions svelte-9hvdbo\"><!> <!> <!> <!></div></div> <!> <!> <div><!> <!></div> <!> <!> <!> <!> <!></div> <!> <!> <!> <!> <!> <!> <!>", 1), Hm = {
	hash: "svelte-9hvdbo",
	code: ".post-history-tab-content.svelte-9hvdbo {display:flex;flex-direction:column;flex:1;min-height:0;overflow:hidden;width:100%;}.post-history-heading.svelte-9hvdbo {display:flex;align-items:stretch;justify-content:space-between;width:100%;height:48px;min-height:48px;flex:0 0 48px;overflow:hidden;padding:0;border-bottom:1px solid var(--border-hr);}.post-history-heading-main.svelte-9hvdbo {display:flex;align-items:center;flex:1 1 auto;min-width:0;align-self:stretch;gap:4px;}.post-history-current-month-heading.svelte-9hvdbo {display:flex;align-items:center;flex:0 1 auto;min-width:0;height:100%;margin:0;}.post-history-current-month.svelte-9hvdbo {display:block;color:var(--text-light);font-size:1.75rem;line-height:1.05;font-weight:600;letter-spacing:-0.04em;min-width:0;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;padding-left:12px;}.post-history-heading-action-button {width:50px;height:50px;min-width:50px;min-height:50px;flex:0 0 50px;padding:0;border:0;color:var(--text-muted);background-color:var(--dialog-bg);--btn-bg: var(--dialog-bg);}.post-history-heading-action-button .svg-icon {width:22px;height:22px;background-color:currentColor;--svg: currentColor;}\n            .post-history-heading-refetch-button .svg-icon,\n            .post-history-heading-search-button .svg-icon\n         {width:24px;height:24px;}.post-history-heading-calendar-button .calendar-icon {mask-image:var(--ehagaki-icon-63616c656e6461725f746f6461795f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.post-history-heading-refetch-button:disabled {opacity:0.45;}.post-history-heading-actions.svelte-9hvdbo {display:flex;align-items:center;justify-content:flex-end;align-self:stretch;flex:0 0 auto;min-width:0;gap:0;white-space:nowrap;}\n            .post-history-action-button,\n            .post-history-thread-toggle-button\n         {color:var(--btn-post-preview-action);}\n            .post-history-action-button .svg-icon,\n            .post-history-thread-toggle-button .svg-icon\n         {--svg: currentColor;}.post-history-menu-summary {padding:8px 12px 4px;color:var(--text-muted);font-size:0.875rem;line-height:1.35;user-select:text;}.post-history-summary-line.svelte-9hvdbo {overflow-wrap:anywhere;}.post-history-summary-count.svelte-9hvdbo {flex:0 0 auto;white-space:nowrap;text-align:end;}.post-history-repair-button {white-space:nowrap;padding:6px 10px;font-size:0.82rem;}.post-history-search-row.svelte-9hvdbo {display:flex;align-items:center;width:100%;}.post-history-search-input-wrapper.svelte-9hvdbo {position:relative;flex:1 1 auto;min-width:0;border:1px solid var(--border-soft);background:var(--background);color:var(--text);font:inherit;border-bottom:1px solid var(--border-hr);}.post-history-search-leading.svelte-9hvdbo {display:flex;position:absolute;inset:0 auto 0 0;width:40px;align-items:center;justify-content:center;color:var(--text-muted);pointer-events:none;}.post-history-search-leading .search-icon,\n    .post-history-search-leading .inline-spinner {width:24px;height:24px;}.post-history-search-leading .loading-placeholder {width:24px;height:24px;flex:0 0 24px;}.post-history-search-active.svelte-9hvdbo {border-bottom-color:color-mix(\n            in srgb,\n            var(--theme),\n            var(--border-hr) 55%\n        );}.post-history-search-input.svelte-9hvdbo {display:block;width:100%;min-width:0;padding:10px 12px 10px 40px;border:0;background:transparent;color:inherit;font:inherit;}.post-history-search-close.square {flex:0 0 auto;min-height:40px;aspect-ratio:1;padding:0;background:var(--btn-bg);.svg-icon {width:28px;height:28px;}}.post-history-search-input.svelte-9hvdbo::placeholder {color:var(--text-muted);}.post-history-utility-panel.svelte-9hvdbo {display:flex;flex-direction:column;padding:6px 16px 6px;border-bottom:1px solid var(--border-hr);gap:2px;}.post-history-utility-label.svelte-9hvdbo {color:var(--text-muted);font-size:0.82rem;}.post-history-utility-controls.svelte-9hvdbo {display:flex;flex-wrap:wrap;gap:4px;align-items:center;}.post-history-date-picker-input {display:inline-flex;align-items:stretch;gap:2px;min-width:0;padding:6px;height:40px;border:1px solid var(--border-hr);background:var(--background);color:var(--text);font:inherit;}.post-history-date-picker-segment {display:inline-flex;align-items:center;justify-content:center;min-width:1ch;height:auto;color:var(--text-muted);&[role=\"spinbutton\"] {min-width:3ch;}&[data-segment=\"year\"] {min-width:5ch;}}.post-history-date-picker-trigger {flex:0 0 auto;min-width:40px;min-height:40px;padding:0;}.post-history-date-picker-trigger .svg-icon {mask-image:var(--ehagaki-icon-63616c656e6461725f746f6461795f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);width:24px;height:24px;}.post-history-date-picker-content {z-index:110;background-color:var(--dialog-bg2);border:1px solid var(--border-soft);border-radius:8px;padding:8px;box-shadow:0 12px 28px rgb(0 0 0 / 0.16);}.post-history-date-picker-calendar {display:flex;flex-direction:column;gap:6px;}.post-history-date-picker-header {display:flex;align-items:center;justify-content:space-between;gap:8px;}.post-history-date-picker-heading {flex:1 1 auto;text-align:center;font-size:0.9rem;font-weight:600;}.post-history-date-picker-nav,\n    .post-history-date-picker-year-nav {display:inline-flex;align-items:center;justify-content:center;width:30px;height:30px;border:1px solid var(--border-soft);border-radius:6px;background-color:var(--btn-bg2);color:var(--text);}.post-history-date-picker-nav-icon,\n    .post-history-date-picker-year-nav-icon {width:24px;height:24px;background-color:currentColor;}.post-history-date-picker-nav-icon-left {margin-inline-end:1px;mask-image:var(--ehagaki-icon-6b6579626f6172645f6172726f775f6c6566745f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.post-history-date-picker-nav-icon-right {margin-inline-start:1px;mask-image:var(--ehagaki-icon-6b6579626f6172645f6172726f775f72696768745f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.post-history-date-picker-year-nav-icon-left {mask-image:var(--ehagaki-icon-6b6579626f6172645f646f75626c655f6172726f775f6c6566745f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.post-history-date-picker-year-nav-icon-right {mask-image:var(--ehagaki-icon-6b6579626f6172645f646f75626c655f6172726f775f72696768745f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.post-history-date-picker-grid {border-collapse:separate;border-spacing:2px;}.post-history-date-picker-weekday {color:var(--text-muted);font-size:0.74rem;font-weight:500;text-align:center;}.post-history-date-picker-day {display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:6px;font-size:0.86rem;}.post-history-date-picker-day[data-selected] {background:color-mix(in srgb, var(--theme), white 10%);color:white;}.post-history-date-picker-day[data-disabled] {opacity:0.45;}.post-history-utility-button {height:auto;min-height:40px;white-space:nowrap;}.post-history-utility-button.post-history-utility-submit-button,\n    .post-history-utility-button.post-history-utility-close-button {min-width:70px;min-height:40px;}.post-history-nav-row.svelte-9hvdbo {display:flex;justify-content:center;width:100%;padding:8px 16px;}.post-history-nav-row-top.svelte-9hvdbo {padding-bottom:0;}.post-history-nav-row-bottom.svelte-9hvdbo {padding-top:0;}.post-history-search-bottom-spacer.svelte-9hvdbo {\n        /* Clear the 50px return-to-latest button and its 12px bottom inset. */height:62px;}.post-history-auto-load-sentinel.svelte-9hvdbo {display:grid;width:100%;min-height:24px;place-items:center;}.post-history-auto-load-slot.svelte-9hvdbo {display:grid;height:24px;min-height:24px;place-items:center;}.post-history-auto-load-newer-slot.svelte-9hvdbo:not(.post-history-auto-load-newer-slot-reserved) {height:0;min-height:0;}.post-history-nav-button.primary {opacity:1;}.post-history-nav-button:not(.primary) {min-height:50px;white-space:nowrap;gap:4px;}.post-history-exhausted-state.svelte-9hvdbo {display:flex;flex-direction:column;gap:10px;align-items:center;padding:0 16px 8px 16px;}.post-history-latest-row.svelte-9hvdbo {position:absolute;inset:auto 16px 12px auto;display:flex;justify-content:flex-end;width:auto;margin:0;padding:0;z-index:3;.post-history-latest-button {min-width:50px;min-height:50px;background-color:color-mix(in srgb, var(--theme) 15%, transparent);backdrop-filter:blur(1px);.vertical-align-top-icon {mask-image:var(--ehagaki-icon-766572746963616c5f616c69676e5f746f705f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);width:26px;height:26px;opacity:0.6;}}}.post-history-container.svelte-9hvdbo {flex:1 1 auto;min-height:0;width:100%;overflow-y:auto;}.post-history-container.post-history-auto-load-enabled.svelte-9hvdbo {overflow-anchor:none;}.empty-state.svelte-9hvdbo {display:grid;gap:8px;min-height:100px;align-content:center;}.post-history-list-loading.svelte-9hvdbo {display:grid;min-height:100px;place-items:center;}.empty-message.svelte-9hvdbo {display:flex;justify-content:center;align-items:center;height:100px;color:var(--text-muted);font-size:1rem;}.status-loading-placeholder {justify-content:flex-end;width:auto;max-width:min(38vw, 240px);min-width:0;overflow:hidden;flex:0 1 auto;white-space:nowrap;column-gap:0;color:var(--text-muted);font-size:0.8rem;line-height:1.3;height:auto;}.post-history-heading-status-placeholder {color:var(--svg);}.status-loading-placeholder .loader-container {.square {background:currentColor;}}.status-loading-placeholder .placeholder-text {color:inherit;font-size:inherit;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.status-error {color:var(--danger);}.post-history-heading-status-placeholder.status-error {color:var(--svg);}.status-loading-placeholder.status-error .square {background-color:var(--danger);}.post-history-list.svelte-9hvdbo {width:100%;margin:0;padding:0;list-style:none;}.post-history-item.svelte-9hvdbo {display:flex;align-items:center;border-bottom:1px solid var(--border-hr-light);padding:6px;}.post-history-item.svelte-9hvdbo:last-child {border-bottom:none;}.post-history-item-deleted.svelte-9hvdbo .post-meta-inline:where(.svelte-9hvdbo) > :where(.svelte-9hvdbo):not(.deleted-badge),\n    .post-history-item-deleted.svelte-9hvdbo .post-preview-body:where(.svelte-9hvdbo) {opacity:0.65;}.post-history-main.svelte-9hvdbo {display:flex;flex-direction:column;flex:1 1 0;min-width:0;gap:2px;}.post-preview-header.svelte-9hvdbo {display:flex;align-items:center;justify-content:space-between;gap:8px;color:var(--text-muted);font-size:0.875rem;line-height:1.3;}.post-preview-header-right.svelte-9hvdbo {display:flex;align-items:center;gap:2px;flex-shrink:0;margin-inline-start:auto;}.post-preview-header-right.svelte-9hvdbo > span:where(.svelte-9hvdbo) {white-space:nowrap;}.post-history-menu-content .menu-action-button .calendar-icon {mask-image:var(--ehagaki-icon-63616c656e6461725f746f6461795f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);background-color:currentColor;}.post-history-menu-content .menu-action-button .find_in_page-icon {mask-image:var(--ehagaki-icon-66696e645f696e5f706167655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);background-color:currentColor;}.post-history-menu-content .menu-action-button .broadcast-icon {mask-image:var(--ehagaki-icon-63656c6c5f746f7765725f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);background-color:currentColor;}.post-history-menu-content .menu-action-button .raw-json-icon {mask-image:var(--ehagaki-icon-646174615f6f626a6563745f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);background-color:currentColor;}.post-history-menu-content .menu-action-button .export-icon {mask-image:var(--ehagaki-icon-75706c6f61645f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);background-color:currentColor;}.post-history-menu-content .menu-action-button .import-icon {mask-image:var(--ehagaki-icon-646f776e6c6f61645f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);background-color:currentColor;}\n            .post-history-menu-content\n                .menu-action-button\n                .collapse-content-icon\n         {mask-image:var(--ehagaki-icon-636f6c6c617073655f636f6e74656e745f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);background-color:currentColor;width:24px;height:24px;}\n            .post-history-menu-content\n                .menu-action-button\n                .return-to-latest-icon\n         {mask-image:var(--ehagaki-icon-766572746963616c5f616c69676e5f746f705f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);background-color:currentColor;}\n            .post-history-menu-content .menu-action-button .jump-to-oldest-icon\n         {mask-image:var(--ehagaki-icon-766572746963616c5f616c69676e5f626f74746f6d5f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);background-color:currentColor;}.post-history-nav-button .keyboard-arrow-up-icon {mask-image:var(--ehagaki-icon-6b6579626f6172645f6172726f775f75705f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);width:28px;height:28px;}.post-history-nav-button .keyboard-arrow-down-icon {mask-image:var(--ehagaki-icon-6b6579626f6172645f6172726f775f646f776e5f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);width:28px;height:28px;}.post-history-nav-button .cloud-download-icon {mask-image:var(--ehagaki-icon-636c6f75645f646f776e6c6f61645f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);width:28px;height:28px;}.post-history-nav-loading-placeholder .loader-container .square {background-color:currentColor;}.post-preview.svelte-9hvdbo {display:flex;flex-direction:column;min-width:0;color:var(--text);font-size:1rem;}.post-history-thread-anchor-post.svelte-9hvdbo {display:flex;flex-direction:column;min-width:0;}.post-history-channel-row.svelte-9hvdbo {display:flex;align-items:center;gap:6px;min-width:0;color:var(--text-muted);font-size:0.875rem;line-height:1.3;}.channel-icon.svelte-9hvdbo {width:18px;height:18px;flex-shrink:0;mask-image:var(--ehagaki-icon-666f72756d5f323464705f3030303030305f46494c4c315f776768743430305f47524144305f6f70737a32342e737667);background-color:currentColor;}.channel-label.svelte-9hvdbo {flex-shrink:0;}.channel-name.svelte-9hvdbo {min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.post-preview-body.svelte-9hvdbo {display:flex;flex-direction:column;padding-inline-start:1rem;gap:4px;.post-preview-content:where(.svelte-9hvdbo) {overflow-wrap:anywhere;white-space:pre-wrap;font-size:1rem;line-height:1.5;}.post-preview-media:where(.svelte-9hvdbo) {display:block;}.post-preview-quotes:where(.svelte-9hvdbo) {display:flex;flex-direction:column;gap:4px;margin-inline-start:-1rem;}}.post-history-thread-toggle-button.selected {--btn-bg: var(--post-history-preview-footer-surface, var(--dialog-bg));color:var(--text-light);}\n\n    @media (hover: hover) and (pointer: fine) {\n                .post-history-thread-toggle-button.selected:hover:not(:disabled)\n             {background-color:light-dark(\n                color-mix(in srgb, var(--dialog-bg), black 20%),\n                color-mix(in srgb, var(--dialog-bg), white 30%)\n            );color:light-dark(\n                color-mix(in srgb, var(--text), black 20%),\n                color-mix(in srgb, var(--text), white 30%)\n            );}\n    }.post-meta-inline.svelte-9hvdbo {margin-inline-start:auto;display:flex;align-items:center;gap:6px;}.deleted-badge.svelte-9hvdbo {padding:2px 6px;border-radius:999px;background:color-mix(in srgb, var(--danger), transparent 82%);color:var(--danger);font-weight:600;}.delete-failed.svelte-9hvdbo {color:var(--danger);}.delete-confirm-body.svelte-9hvdbo {display:flex;flex-direction:column;justify-content:center;gap:0.5rem;margin:10px 0 30px 0;margin-inline:auto;text-align:start;}.delete-confirm-description.svelte-9hvdbo,\n    .delete-confirm-warning.svelte-9hvdbo {line-height:1.5;margin:0;}.delete-confirm-warning.svelte-9hvdbo {color:var(--text-light);font-size:0.875rem;}.copy-icon {mask-image:var(--ehagaki-icon-66696c655f636f70795f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.search-icon.svelte-9hvdbo {mask-image:var(--ehagaki-icon-7365617263685f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.post-history-search-close .xmark-icon.svelte-9hvdbo {mask-image:var(--ehagaki-icon-636c6f73655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.repair-icon.svelte-9hvdbo {mask-image:var(--ehagaki-icon-726566726573685f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.post-history-saved-boundary.svelte-9hvdbo,\n    .post-history-sparse-state.svelte-9hvdbo {display:grid;gap:8px;margin:16px 0;padding:12px;border:1px solid var(--border-hr);border-radius:10px;color:var(--text-muted);background:color-mix(in srgb, var(--bg-input) 72%, transparent);}.post-history-saved-boundary.svelte-9hvdbo {padding:0;border:0;border-radius:0;background:transparent;}.post-history-saved-boundary.svelte-9hvdbo p:where(.svelte-9hvdbo),\n    .post-history-sparse-state.svelte-9hvdbo p:where(.svelte-9hvdbo) {margin:0;}.post-history-saved-boundary-actions.svelte-9hvdbo {display:flex;width:fit-content;max-width:100%;box-sizing:border-box;justify-self:center;flex-wrap:wrap;justify-content:center;align-items:flex-start;gap:8px;}.post-history-saved-boundary-actions .post-history-nav-button {height:52px;}\n\n    @media (max-width: 600px) {.post-history-saved-boundary-actions.svelte-9hvdbo {width:min(100%, 320px);flex-direction:column;align-items:center;}.post-history-saved-boundary-actions .post-history-nav-button {width:100%;flex:0 0 52px;}\n    }.import-icon.svelte-9hvdbo {mask-image:var(--ehagaki-icon-636c6f75645f646f776e6c6f61645f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.trash-icon {mask-image:var(--ehagaki-icon-64656c6574655f666f72657665725f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.jump-icon.svelte-9hvdbo {mask-image:var(--ehagaki-icon-6b6579626f6172645f7461625f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.post-history-utility-close-button .xmark-icon.svelte-9hvdbo {mask-image:var(--ehagaki-icon-636c6f73655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}"
};
function Um(n, a) {
	H(a, !0), j(n, Hm);
	let o = () => R(Fe, "$_", c), s = () => R(Me, "$locale", c), [c, u] = te(), d = (e, t = A) => {
		let n = U(() => Yr(t().eventId));
		var r = h(), i = M(r), a = (e) => {
			{
				let r = U(() => qr(t().eventId)), i = U(() => Xr(t().eventId));
				dr(e, {
					get count() {
						return C(n).totalCount;
					},
					get expanded() {
						return C(r);
					},
					get ariaLabel() {
						return C(i);
					},
					onToggle: () => Jr(t().eventId)
				});
			}
		};
		f(i, (e) => {
			C(n) && C(n).totalCount > 0 && e(a);
		}), m(e, r);
	}, p = (e, t = A) => {
		let n = U(() => Yr(t().eventId));
		var r = h(), i = M(r), a = (e) => {
			Er(e, {
				get readModel() {
					return C(n);
				},
				get emojiLoadStateByUrl() {
					return jn.emojiLoadStateByUrl;
				},
				get emojiImageMetaByUrl() {
					return jn.emojiImageMetaByUrl;
				}
			});
		}, o = U(() => C(n) && C(n).totalCount > 0 && qr(t().eventId));
		f(i, (e) => {
			C(o) && e(a);
		}), m(e, r);
	}, y = (e, t = A, n = A) => {
		{
			let r = (e) => {
				{
					let n = U(() => Le(t()) ? () => void Re(t()) : void 0), r = U(() => nt.copyState[t().eventId] === "failed"), i = U(() => Wr(t())), a = U(() => Ur(t())), o = U(() => ei(t())), s = U(() => Vr(t())), c = U(xi);
					tl(e, {
						order: "standard",
						get onRepost() {
							return C(n);
						},
						get repostPending() {
							return fe();
						},
						get copyFailed() {
							return C(r);
						},
						get showBroadcast() {
							return C(i);
						},
						get broadcastSending() {
							return C(a);
						},
						get showDelete() {
							return C(o);
						},
						showDeleteSeparator: !0,
						get deletionSending() {
							return C(s);
						},
						onCopyPointerDown: (e) => nt.captureCopyPointerPosition(t(), e),
						onCopyNevent: (e) => void nt.handleCopyNevent(t(), e),
						get externalClientLabel() {
							return C(c);
						},
						onOpenExternalClient: () => Si(t()),
						onShowRawJson: () => di(t().rawEvent, t().relayHints),
						onBroadcastPointerDown: (e) => ii(t(), e),
						onBroadcastPost: (e) => void ni(t(), e),
						onOpenDeleteConfirm: () => ti(t())
					});
				}
			}, i = U(() => Ze.isPostMenuOpen(n())), a = U(() => o()(at(t().kind) ? "repost.outerActions" : "repost.targetActions")), c = U(() => Xt(t().postedAt, s()));
			Pr(e, {
				get open() {
					return C(i);
				},
				restoreFocusOnClose: !0,
				onOpenChange: (e) => ui(n(), e),
				get triggerAriaLabel() {
					return C(a);
				},
				get timestamp() {
					return C(c);
				},
				items: r,
				$$slots: { items: !0 }
			});
		}
	}, E = se().overlayTarget, k = L(a, "show", 3, !1), P = L(a, "sessionOpen", 3, void 0), ce = L(a, "onInitialReady", 3, void 0), W = L(a, "onReplyPost", 3, void 0), le = L(a, "onQuotePost", 3, void 0), ue = L(a, "onReactionPost", 3, void 0), de = L(a, "onRepostPost", 3, void 0), fe = L(a, "repostPending", 3, !1), pe = L(a, "onRetryRepostSave", 3, void 0), he = L(a, "repostSaveFailure", 3, null), G = L(a, "pubkeyHex", 3, null), ge = L(a, "rxNostr", 3, void 0), _e = L(a, "relayConfig", 3, null), ve = L(a, "latestPostedEvent", 3, null), ye = L(a, "inboundInteractionSave", 3, null), be = L(a, "authoredSelfPostSave", 3, null), xe = L(a, "reconcileInboundDirectReplyCandidates", 3, void 0), Se = L(a, "notifySavedAuthoredPosts", 3, void 0), Ce = D(!1), K = U(() => k() && !C(Ce)), we = 0, q = !1, Te = !1;
	function Ee() {
		Te = !1, N(Ce, !1);
	}
	function De() {
		C(Ce) || (Te || $.saveCurrentSessionScrollAnchor(), N(Ce, !0), we++, lt++, Ie++, Y.suspend(), $.suspend(), An.suspend(), X.cancelCurrentChannelResolution(), He.cancelCurrentGraphFetches(), qe.suspend(), Ye.cancelCurrentSync(), je.reset(), J.invalidateScope("post-history-listing-quote-visible-range-repair"), ze.suspend(), Ne.suspend(), J.invalidateScope("post-history-repost-operation"), jn.suspend(), Ze.resetDeleteConfirmation(), Ze.closeAllPostItemMenus(), N(Q, !1), gt.suspend(), N(Et, !1), N(Dt, null), N(ot, !1), N(ht, !1), N(pt, !1), nt.resetState(), ri(), Vi(), Qn(), N(Jt, !1), N(Bt, [], !0), N(Kt, -1), N(jt, {}, !0), N(At, {}, !0), N($t, !1), N(tn, !1), on = !1, cn = !1);
	}
	function Oe() {
		De(), we++;
	}
	function ke() {
		return C(Jt);
	}
	I(() => {
		let e = k();
		F(() => e ? Ee() : De());
	});
	function Ae() {
		let e = we, t = G(), n = ge();
		return () => e === we && C(K) && t === G() && n === ge();
	}
	let je = ur({
		getShow: () => !q && C(K),
		getRxNostr: () => q ? void 0 : ge()
	}), J = Mr({
		loadRepostTarget: lr,
		getShow: () => !q && C(K),
		getRxNostr: () => q ? void 0 : ge(),
		getRelayConfig: () => q ? null : _e(),
		profileSyncCoordinator: je
	}), Y = Yd({
		getShow: () => !q && C(K),
		getSessionOpen: () => P() ?? k(),
		getPubkeyHex: () => q ? null : G(),
		getRxNostr: () => q ? void 0 : ge(),
		getRelayConfig: () => q ? null : _e(),
		getSessionScrollState: () => $.readCurrentSessionScrollState(),
		onSessionScrollStateInvalidated: () => $.clearAllSessionScrollAnchorsForCurrentPubkey(),
		onSavedAuthoredPosts: async (e) => {
			await Se()?.(e);
		},
		onLocalHistoryChanged: Ji,
		onChildInteractionBadgeRefreshRequested: (e, t) => He.loadCachedChildInteractionStateForPosts(e, t),
		onQuoteVisibleRangeRefreshRequested: (e) => ze.refreshQuotePreviews(e),
		quoteVisibleRangeRepairExecutor: async (e, t) => {
			let n = Ve(t.visiblePosts);
			n.length !== 0 && await J.ensureTargets(n);
		},
		pageSize: 50
	}), Ne = $n({
		getShow: () => !q && C(K),
		getPubkey: () => q ? null : G(),
		getPosts: () => Y.posts,
		resolver: J
	}), Pe = D(null), Ie = 0;
	I(() => (C(K), G(), Ie++, N(Pe, null), () => J.invalidateScope("post-history-repost-operation")));
	function Le(e) {
		return !!de() && it(e.kind) && e.deletedAt === void 0 && me(e.rawEvent, e);
	}
	async function Re(e) {
		if (!de() || fe() || !Le(e)) return;
		N(Pe, null);
		let t = Ie, n = Ae(), r = await de()(e, (e, t) => {
			if (!n()) throw new DOMException("History tab suspended", "AbortError");
			return J.prepareRepostTarget({
				relationKind: "repost",
				scopeKey: "post-history-repost-operation",
				targetEventId: e.id,
				authorHint: e.pubkey,
				relayHints: t
			}, e);
		});
		t === Ie && C(K) && N(Pe, r, !0);
	}
	let X = sr({
		getShow: () => !q && C(K),
		getSessionOpen: () => P() ?? k(),
		getPosts: () => [...Y.posts, ...Y.posts.flatMap((e) => {
			if (!at(e.kind)) return [];
			let t = Ne.getPreview(e);
			return t.status === "resolved" && t.event?.kind === 42 ? [St(t.event, t.relayHints)] : [];
		})],
		getRxNostr: () => q ? void 0 : ge(),
		getRelayConfig: () => q ? null : _e(),
		getIsSearchMode: () => Y.isSearchMode
	}), ze = Iu({
		getShow: () => !q && C(K),
		getPosts: () => Y.posts,
		getRxNostr: () => q ? void 0 : ge(),
		getRelayConfig: () => q ? null : _e(),
		relatedTargetResolver: J,
		profileSyncCoordinator: je
	});
	function Be(e) {
		let t = Ne.getPreview(e);
		return t.status === "resolved" && t.event?.kind === 42 ? X.getChannelText(St(t.event, t.relayHints), o()) : null;
	}
	function Ve(e) {
		let t = ju.buildIndex(e);
		return Object.values(t.contextsByEventId).map((e) => ju.toDescriptor(e, "post-history-listing-quote-visible-range-repair"));
	}
	let He = fp({
		getShow: () => !q && C(K),
		getSessionOpen: () => P() ?? k(),
		getPubkeyHex: () => q ? null : G(),
		getRxNostr: () => q ? void 0 : ge(),
		getRelayConfig: () => q ? null : _e(),
		relatedTargetResolver: J,
		profileSyncCoordinator: je
	});
	function Ue() {
		let e = /* @__PURE__ */ new Map(), t = (t, n) => {
			let r = t.id;
			r && !Y.posts.some((e) => e.eventId === r && ![6, 16].includes(e.kind)) && e.set(r, {
				eventId: r,
				targetAuthorPubkey: t.pubkey,
				targetKind: t.kind,
				relayHints: Array.from(/* @__PURE__ */ new Set([...e.get(r)?.relayHints ?? [], ...n]))
			});
		}, n = (e) => {
			e && (t(e.node.event, e.node.relayUrls), n(e.parentNodeState), e.replyNodeStates.forEach(n));
		};
		for (let e of Y.posts) {
			let r = [6, 16].includes(e.kind) ? ut(e.rawEvent) : null;
			r && t(r.event, [
				...e.fetchedRelays ?? [],
				...e.acceptedRelays,
				...e.relayHints
			]);
			let i = Ne.getPreview(e);
			i.status === "resolved" && i.event && t(i.event, i.relayHints);
			let a = He.getAnchorState(e);
			n(a.parentNodeState), a.replyNodeStates.forEach(n);
			for (let n of ze.getQuotePreviews(e)) n.status === "resolved" && t(n.event, n.relayHints);
		}
		return Array.from(e.values());
	}
	let Ge = U(Ue), qe = Tr({
		getShow: () => !q && C(K),
		getSessionOpen: () => P() ?? k(),
		getPubkeyHex: () => q ? null : G(),
		getRxNostr: () => q ? void 0 : ge(),
		getRelayConfig: () => q ? null : _e(),
		getTargets: () => C(Ge),
		profileSync: je
	}), Ye = mp({
		getShow: () => !q && C(K),
		getPubkeyHex: () => q ? null : G(),
		getRxNostr: () => q ? void 0 : ge(),
		getRelayConfig: () => q ? null : _e(),
		getPosts: () => Y.posts,
		onSavedInboundInteractions: (e) => He.loadCachedChildInteractionStateForPosts(Y.posts, e),
		reconcileDirectReplyCandidates: (e) => xe()?.(e) ?? Promise.resolve({
			changedParentEventIds: [],
			savedDirectReplyCount: 0,
			unresolvedParentEventIds: e.map((e) => e.classification.parentEventId).filter((e) => !!e)
		})
	}), Ze = fr(), nt = _u();
	function rt() {
		let e = /* @__PURE__ */ new Date();
		return ea(`${`${e.getFullYear()}`}-${`${e.getMonth() + 1}`.padStart(2, "0")}-${`${e.getDate()}`.padStart(2, "0")}`);
	}
	let ot = D(!1), st = D("none"), ct = D(!1), lt = 0, dt = D(T(rt())), ft = D(T(rt())), pt = D(!1), mt = null, ht = D(!1), Q = D(!1), gt = Vl({
		getShow: () => !q && C(K),
		getScope: () => ({
			ownerPubkeyHex: G(),
			rxNostr: ge(),
			relayConfig: _e()
		}),
		onSettled: Gi
	}), _t = D(!1), vt = D(T({ phase: "loading" })), yt, bt, xt = D(!1), Ct = D("postHistory.exportComplete"), wt = D(T({})), Tt, Et = D(!1), Dt = D(null), Ot = D(T([])), kt = D(0), At = D(T({})), jt = D(T({})), Mt = D(!1), Nt = D(0), Pt = D(0), Ft = D("postHistory.broadcastSent"), Lt, Rt = D(void 0), zt = D(T({})), Bt = D(T([])), Kt = D(-1), Jt = D(!1), Yt = D(null), Zt = D(null), Qt = D(null), $t = D(!1), tn = D(!1), nn = D(null), rn = D(0), on = !1, cn = !1, un = !1, dn = !1, pn = null, hn = null, gn = 0, _n = null, vn = null, yn = typeof IntersectionObserver < "u", bn = D(!1), xn = null, Sn = D(null), En = D(!1), On = D(!1), An = Ar({
		getShow: () => !q && C(K),
		getSessionOpen: () => P() ?? k(),
		getPosts: () => Y.posts.map((e) => ({
			...e,
			content: Wt(e.content, e.tags)
		})),
		getContainer: () => C(Zt)
	}), $ = lf({
		getShow: () => !q && C(K),
		getPubkeyHex: () => q ? null : G(),
		getPosts: () => Y.posts,
		getLocale: () => s(),
		getContainer: () => C(Zt),
		getIsSearchMode: () => Y.isSearchMode,
		getSearchQuery: () => Y.state.searchQuery
	}), jn = fn({
		getShow: () => !q && C(K),
		getSessionOpen: () => P() ?? k(),
		getEmojiUrls: () => C(Yn),
		onStateChanged: () => An.remeasure()
	});
	function Mn(e) {
		let t = at(e.kind) ? "" : Wt(e.content, e.tags), n = Eu({
			...e,
			content: t
		});
		return Ut({
			kind: e.kind,
			sourceContent: t,
			displayContent: n,
			tags: e.tags,
			media: e.media
		});
	}
	function Nn(e) {
		return mn({
			ownerPubkey: G(),
			structure: e,
			rxNostr: ge(),
			relayConfig: _e()
		});
	}
	let Pn = U(() => {
		let e = {};
		for (let t of Y.posts) e[t.eventId] = Mn(t);
		return e;
	}), Fn = U(() => Y.currentViewRefetchStatusMessageKey ?? Y.syncStatusMessageKey), In = U(() => Y.currentViewRefetchStatusMessageKey ? Y.currentViewRefetchStatusMessageValues : null), zn = U(() => Y.syncStatus === "failed" || Y.currentViewRefetchStatusMessageKey === "postHistory.repairFetchFailed"), Bn = D(!1), Vn = U(() => C(K) && !gt.state.open && !C(_t) && Y.syncStatus === "syncing" && C(Fn) === "postHistory.syncing" && Y.posts.length > 0);
	I(() => {
		if (N(Bn, !1), !C(Vn)) return;
		let e = setTimeout(() => {
			N(Bn, !0);
		}, 1e3);
		return () => clearTimeout(e);
	});
	let Hn = U(() => Y.canReturnToLatest || !$.isHistoryScrolledToTop), Un = U(() => Y.canJumpToOldest || !$.isHistoryScrolledToBottom), Wn = U(() => Y.isSearchMode ? Y.searchResultStatus === "loading" : Y.initialLocalLoadStatus === "loading"), Gn = U(() => Y.posts.length === 0 && (Y.isSearchMode ? Y.searchResultStatus === "ready" : Y.initialLocalLoadStatus === "ready"));
	I(() => {
		if (!C(K) || C(On) || !ce()) return;
		let e = Y.isSearchMode ? Y.searchResultStatus : Y.initialLocalLoadStatus;
		(!G() || Y.posts.length > 0 || e === "ready" || e === "failed") && (N(On, !0), ce()());
	});
	function Kn(e, t) {
		t[e.id] || (t[e.id] = Ut({
			kind: e.kind,
			sourceContent: e.content,
			tags: e.tags
		}));
	}
	function qn(e, t, n) {
		if (e && !n.has(e.node.eventId)) {
			n.add(e.node.eventId), Kn(e.node.event, t), qn(e.parentNodeState, t, n);
			for (let r of e.replyNodeStates) qn(r, t, n);
		}
	}
	let Jn = U(() => {
		let e = {};
		for (let t of Y.posts) {
			let n = /* @__PURE__ */ new Set();
			for (let n of Br(t)) n.status === "resolved" && Kn(n.event, e);
			let r = He.getAnchorState(t);
			r.parentNode && Kn(r.parentNode.event, e), qn(r.parentNodeState, e, n);
			for (let t of r.replyNodeStates) qn(t, e, n);
		}
		return e;
	}), Yn = U(() => {
		let e = /* @__PURE__ */ new Set();
		for (let t of [...Object.values(C(Pn)), ...Object.values(C(Jn))]) for (let n of t.previewContent.emojiUrls) e.add(n);
		for (let t of Y.posts) {
			let n = He.getAnchorState(t);
			if (C(zt)[t.eventId]) for (let t of n.reactionReadModel.groups) t.emojiUrl && e.add(t.emojiUrl);
		}
		for (let t of C(Ge)) {
			if (!C(zt)[t.eventId]) continue;
			let n = Yr(t.eventId);
			for (let t of n?.groups ?? []) t.emojiUrl && e.add(t.emojiUrl);
		}
		return [...e];
	});
	function Xn() {
		lt += 1, je.reset(), nt.resetState(), ri(), Vi(), Ze.resetDeleteConfirmation(), N(Q, !1), gt.setOpen(!1), N(Et, !1), N(Dt, null), N(ot, !1), N(st, "none"), N(ct, !1), N(dt, rt(), !0), N(ft, rt(), !0), N(pt, !1), N(ht, !1), N(At, {}, !0), N(jt, {}, !0), an(), N(zt, {}, !0), jn.resetState(), N(Bt, [], !0), N(Kt, -1), N(Jt, !1);
	}
	function Qn() {
		yt?.abort();
	}
	function er() {
		if (Te) return;
		Te = !0, lt += 1;
		let e = Y.isSearchMode;
		e && $.clearCurrentSessionScrollAnchor(), Y.resetSearchState(), Y.prepareForClose() ? $.clearAllSessionScrollAnchorsForCurrentPubkey() : e || $.saveCurrentSessionScrollAnchor(), X.cancelCurrentChannelResolution(), He.cancelCurrentGraphFetches(), Ze.resetDeleteConfirmation(), N(Q, !1), gt.setOpen(!1), N(Et, !1), N(Dt, null), N(ot, !1), N(ht, !1), nt.hideCopyFloatingMessage(), ri(), Vi(), Qn(), N(Jt, !1), N(Bt, [], !0), N(Kt, -1), we++;
	}
	function tr() {
		er(), a.onClose?.();
	}
	z(() => {
		let e = yn && !Y.isSearchMode && Y.state.listingMode === "contiguous" && !C(ct) && Y.state.hasNewerLocal;
		F(() => C(bn)) !== e && (xn = { anchor: $.captureHistoryScrollAnchor() }, N(bn, e, !0));
	}), I(() => {
		C(bn);
		let e = F(() => xn);
		e && ($.restoreHistoryScrollAnchor(e.anchor), xn = null);
	}), I(() => {
		(P() ?? k()) || F(() => {
			Qn(), Xn();
		});
	}), I(() => {
		C(_t) && bt && G() !== bt && Qn();
	}), I(() => {
		if (!C(K) || !C(Wn) || ce() && !C(On)) {
			N(En, !1);
			return;
		}
		N(En, !1);
		let e = setTimeout(() => {
			C(K) && C(Wn) && N(En, !0);
		}, 200);
		return () => {
			clearTimeout(e);
		};
	}), I(() => {
		let e = C(Zt);
		if (!e) {
			pn = null, hn = null, N(nn, null);
			return;
		}
		let t = () => {
			let t = Math.max(0, e.clientHeight);
			pn === e ? hn !== t && (hn = t, N(nn, t, !0), gn += 1, N(rn, gn, !0)) : (pn = e, hn = t, N(nn, t, !0));
		};
		if (t(), typeof ResizeObserver > "u") return;
		let n = new ResizeObserver(t);
		return n.observe(e), () => {
			n.disconnect(), pn === e && (pn = null, hn = null, N(nn, null));
		};
	}), I(() => {
		let e = C(Qt), t = C(Zt), n = C(nn), r = C(rn);
		if (!(C(K) && e && t && n !== null && n > 0 && !Y.isSearchMode && Y.state.listingMode === "contiguous" && Y.state.hasOlderLocal && !Y.isFetchingOlderFromRelays && !Y.isRefetchingAroundCurrentView) || !yn) {
			on = !1, un = !1, _n = null;
			return;
		}
		let i = _n, a = i?.scrollTop, o = i?.root === t && i.sentinel === e && i.resizeGeneration !== r, s = !1, c = !0, l = !1, u = !1, d = t.scrollTop, f = () => {
			let r = t.getBoundingClientRect(), i = e.getBoundingClientRect();
			return i.left < r.right && i.right > r.left && i.top <= r.bottom + n * 2 && i.bottom >= r.top;
		}, p = () => {
			un = !1, on = !1, l = !1, u = !1;
		}, m = () => {
			c && !l && vr() && (C($t) ? u = !0 : on || (u = !1, xr()));
		};
		_n = {
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
			d = e, f() ? n && (l = !1, un = !0, m()) : p();
		}, g = new IntersectionObserver((n) => {
			if (!c) return;
			let r = n.filter((t) => t.target === e);
			for (let [e, n] of r.entries()) {
				let i = !s;
				s = !0;
				let c = t.getBoundingClientRect(), u = c.width > 0 && c.height > 0 ? f() : n.isIntersecting, d = r.slice(e + 1).some((e) => e.isIntersecting);
				!n.isIntersecting && u && !d || n.isIntersecting && !u || (un = n.isIntersecting, n.isIntersecting ? i && o && typeof a == "number" && t.scrollTop <= a ? l = !0 : (l = !1, m()) : p());
			}
		}, {
			root: t,
			rootMargin: `0px 0px ${n * 2}px 0px`,
			threshold: 0
		});
		return f() || p(), g.observe(e), t.addEventListener("scroll", h, { passive: !0 }), () => {
			c = !1, l = !1, u = !1, t.removeEventListener("scroll", h), g.disconnect();
		};
	}), I(() => {
		let e = C(Zt), t = C(nn), n = C(rn);
		if (!(C(K) && e && t !== null && t > 0 && !Y.isSearchMode && Y.state.listingMode === "contiguous" && Y.state.hasNewerLocal && C(bn) && !C(ct) && !Y.isRefetchingAroundCurrentView) || !yn) {
			cn = !1, dn = !1, vn = null;
			return;
		}
		let r = vn, i = r?.scrollTop, a = !0, o = () => {}, s = null;
		return ie().then(() => {
			a && (s = requestAnimationFrame(() => {
				if (s = null, !a) return;
				let c = e.querySelector(".post-history-auto-load-newer-sentinel");
				if (!c || C(Zt) !== e) return;
				let l = r?.root === e && r.sentinel === c && r.resizeGeneration !== n, u = !1, d = !1, f = !1, p = e.scrollTop, m = () => {
					let n = e.getBoundingClientRect(), r = c.getBoundingClientRect();
					return r.left < n.right && r.right > n.left && r.bottom >= n.top - t * 2 && r.top <= n.bottom;
				}, h = () => {
					dn = !1, cn = !1, d = !1, f = !1;
				}, g = () => {
					a && !d && !cn && Sr() && (C(tn) ? f = !0 : (f = !1, Cr()));
				};
				vn = {
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
					p = t, m() ? n && (d = !1, dn = !0, g()) : h();
				}, v = new IntersectionObserver((t) => {
					if (!a) return;
					let n = t.filter((e) => e.target === c);
					for (let [t, r] of n.entries()) {
						let a = !u;
						u = !0;
						let o = e.getBoundingClientRect(), s = o.width > 0 && o.height > 0 ? m() : r.isIntersecting, c = n.slice(t + 1).some((e) => e.isIntersecting);
						!r.isIntersecting && s && !c || r.isIntersecting && !s || (dn = r.isIntersecting, r.isIntersecting ? a && l && typeof i == "number" && e.scrollTop >= i ? d = !0 : (d = !1, g()) : h());
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
	}), re(() => {
		q = !0, we++, lt += 1, Qn(), an(), je.dispose(), Vi();
	}), I(() => {
		if (!C(K) || !ve()?.id) return;
		let e = ve().id, t = Ae();
		mt !== e && (Y.posts, He.recordPostedReply(ve(), Y.posts).then((n) => {
			n && t() && (mt = e);
		}).catch(() => void 0));
	}), I(() => {
		let e = Y.posts;
		C(K) && e.length !== 0 && (en(e.map((e) => e.eventId)).catch(() => void 0), F(() => He.loadCachedChildInteractionStateForPosts(e)));
	}), I(() => {
		let e = ye()?.revision ?? 0, t = ye()?.parentEventIds ?? [], n = Y.posts;
		if (!C(K) || e <= 0 || t.length === 0) return;
		F(() => qe.refreshCachedReactions(t)).catch(() => void 0), F(() => He.loadCachedChildInteractionStateForPosts(n, t));
		let r = Ae();
		Rn({
			source: "dialog-inbound-save",
			parentEventIds: t,
			rxNostr: ge(),
			relayConfig: _e(),
			isActive: r
		}).then((e) => {
			if (!(!r() || e.deletedReactionEventIds.length === 0 && e.deletedReplyEventIds.length === 0)) return He.loadCachedChildInteractionStateForPosts(Y.posts, e.checkedParentEventIds);
		}).catch(() => void 0);
	}), I(() => {
		let e = be()?.revision ?? 0;
		!C(K) || e <= 0 || Y.isSearchMode || Y.canReturnToLatest || F(() => Y.returnToLatest());
	}), I(() => {
		if (C(K)) return () => {
			X.cancelCurrentChannelResolution();
		};
	});
	function ir(e) {
		return e ? e.values ? o()(e.key, { values: e.values }) : o()(e.key) : null;
	}
	function ar() {
		return ir(It({
			totalCount: Y.displayTotalCount,
			totalCountKnown: Y.displayTotalCountKnown,
			totalCountStatus: Y.displayTotalCountStatus,
			isSearchMode: Y.isSearchMode
		}));
	}
	function or(e) {
		if (!e) return null;
		let t = Number(e.year), n = Number(e.month), r = Number(e.day), i = new Date(t, n - 1, r, 23, 59, 59, 999).getTime();
		return Number.isFinite(i) ? Math.floor(i / 1e3) : null;
	}
	function cr() {
		return o()(sn({
			direction: "older",
			isSearchMode: Y.isSearchMode
		}));
	}
	function mr() {
		return o()(sn({
			direction: "newer",
			isSearchMode: Y.isSearchMode
		}));
	}
	async function _r() {
		let e = Ae();
		if (!e()) return;
		let t = Y.isSearchMode, n = t ? $.captureHistoryScrollAnchor() : null, r = await Y.loadOlder();
		e() && r && t && $.restoreHistoryScrollAnchor(n);
	}
	function vr() {
		return C(K) && !Y.isSearchMode && Y.state.listingMode === "contiguous" && Y.state.hasOlderLocal && !Y.isRefetchingAroundCurrentView;
	}
	function br() {
		let e = null;
		return {
			captureAnchorEventId: () => (e = $.captureHistoryScrollAnchor(), e?.eventId ?? null),
			canCommitWindowChange: (e, t, n) => $.canCommitAutoLoadWindowChange(e, t, n),
			onCommitted: () => {
				oe(), $.restoreHistoryScrollAnchor(e, { flushUpdates: !1 }), _n?.reconcileAfterCommit(), vn?.reconcileAfterCommit();
			}
		};
	}
	async function xr() {
		let e = Ae();
		if (!(C($t) || on || !vr())) {
			N($t, !0), on = !0;
			try {
				let t = await Y.loadOlder(br());
				e() && !t && (on = !1);
			} finally {
				if (!e()) return;
				N($t, !1), un || (on = !1), _n?.resumeAfterLoad();
			}
		}
	}
	function Sr() {
		return C(K) && !Y.isSearchMode && Y.state.listingMode === "contiguous" && Y.state.hasNewerLocal && !C(ct) && !Y.isRefetchingAroundCurrentView;
	}
	async function Cr() {
		let e = Ae();
		if (!(C(tn) || cn || !Sr())) {
			N(tn, !0), cn = !0;
			try {
				await Y.loadNewer(br());
			} finally {
				if (!e()) return;
				N(tn, !1), dn || (cn = !1), vn?.resumeAfterLoad();
			}
		}
	}
	async function Or() {
		let e = Ae();
		if (!e()) return;
		let t = await Y.showSavedOlderPosts();
		e() && t && $.resetHistoryScrollSoon();
	}
	async function Nr() {
		let e = Ae();
		if (!e()) return;
		let t = $.captureHistoryScrollAnchor(), n = C(Zt)?.scrollTop ?? null;
		Y.state.loadedPosts.length, C(Zt)?.scrollHeight, C(Zt)?.clientHeight;
		let r = !1, i = () => {
			e() && n !== null && C(K) && C(Zt) && (r = $.restoreHistoryScrollAnchor(t, { flushUpdates: !1 }), r || (C(Zt).scrollTop = n));
		}, a = await Y.fetchOlderFromRelays({
			anchorEventId: t?.eventId,
			viewportCommit: {
				captureAnchorEventId: () => (t = $.captureHistoryScrollAnchor(), e() ? (t && (n = C(Zt)?.scrollTop ?? null), t?.eventId ?? null) : null),
				onCommitted: () => {
					oe(), i();
				}
			}
		});
		e() && (await ie(), e() && (a && i(), Y.latestOlderBackfillUiResult, C(Zt)?.scrollTop, C(Zt)?.scrollHeight));
	}
	async function Ir() {
		let e = Ae();
		if (!e()) return;
		let t = Y.isSearchMode ? null : $.captureHistoryScrollAnchor(), n = await Y.loadNewer();
		e() && n && (Y.isSearchMode ? $.resetHistoryScrollSoon() : $.restoreHistoryScrollAnchor(t));
	}
	async function Lr() {
		let e = Ae();
		if (!e()) return;
		$.clearAllSessionScrollAnchorsForCurrentPubkey();
		let t = Y.canReturnToLatest ? await Y.returnToLatest() : !1;
		e() && (N(ct, !1), (t || !$.isHistoryScrolledToTop) && $.resetHistoryScrollSoon());
	}
	async function Rr() {
		let e = Ae();
		if (!e()) return;
		let t = or(C(dt));
		if (t === null) return;
		$.clearAllSessionScrollAnchorsForCurrentPubkey(), N(ct, !0);
		let n = await Y.jumpToCreatedAt(t);
		e() && (n || N(ct, !1), n && (N(st, "none"), N(pt, !1), $.resetHistoryScrollSoon()));
	}
	function zr(e) {
		return C(Pn)[e.eventId] ?? Mn(e);
	}
	function Br(e) {
		return ze.getQuotePreviews(e);
	}
	function Vr(e) {
		return C(At)[e.eventId] === "sending";
	}
	function Hr(e) {
		return C(At)[e.eventId] === "failed";
	}
	function Ur(e) {
		return C(jt)[e.eventId] === "sending";
	}
	function Wr(e) {
		return wr(e) !== null;
	}
	function Gr(e) {
		let t = He.getAnchorState(e).repliesActionState;
		return ir(qt(t)) ?? "";
	}
	function Kr(e) {
		return !!C(zt)[e.eventId];
	}
	function qr(e) {
		return !!C(zt)[e];
	}
	function Jr(e) {
		N(zt, {
			...C(zt),
			[e]: !C(zt)[e]
		}, !0);
	}
	function Yr(e) {
		let t = Y.posts.find((t) => t.eventId === e);
		return t && ![6, 16].includes(t.kind) ? He.getAnchorState(t).reactionReadModel : qe.getReadModel(e);
	}
	function Xr(e) {
		let t = Yr(e);
		return ir(Gt({
			visible: qr(e),
			reactionCount: t?.totalCount ?? 0
		})) ?? "";
	}
	function Zr(e) {
		let t = He.getAnchorState(e).reactionSummary.totalCount;
		return ir(Gt({
			visible: Kr(e),
			reactionCount: t
		})) ?? "";
	}
	function Qr(e) {
		Jr(e.eventId);
	}
	function $r(e) {
		let t = He.getAnchorState(e).repliesActionState;
		t.status === "failed" || t.status === "loaded" && t.replyCount === 0 ? He.retryChildren(e) : He.toggleChildren(e);
	}
	function ei(e) {
		return Dr(e, G());
	}
	function ti(e) {
		ei(e) && Ze.openDeleteConfirm(e);
	}
	async function ni(e, t) {
		let n = Ae();
		if (!C(K) || Ur(e)) return;
		let r = ai(e, t);
		N(jt, {
			...C(jt),
			[e.eventId]: "sending"
		}, !0);
		let i = await kr.broadcast({
			post: e,
			rxNostr: ge()
		});
		n() && (N(jt, {
			...C(jt),
			[e.eventId]: void 0
		}, !0), oi(r, i));
	}
	function ri() {
		Lt &&= (clearTimeout(Lt), void 0), N(Mt, !1), N(Rt, void 0);
	}
	function ii(e, t) {
		N(Rt, {
			eventId: e.eventId,
			...$e(t.clientX, t.clientY)
		}, !0);
	}
	function ai(e, t) {
		if (C(Rt)?.eventId === e.eventId) return {
			x: C(Rt).x,
			y: C(Rt).y
		};
		let n = t.currentTarget, r = n instanceof HTMLElement ? n.getBoundingClientRect() : null;
		return $e(r ? r.left + r.width / 2 : 0, r ? r.bottom + 8 : 0);
	}
	function oi(e, t) {
		Lt && clearTimeout(Lt), N(Nt, e.x, !0), N(Pt, e.y, !0), N(Ft, t.success ? (t.rejectedRelays?.length ?? 0) > 0 || (t.timedOutRelays?.length ?? 0) > 0 ? "postHistory.broadcastPartial" : "postHistory.broadcastSent" : "postHistory.broadcastFailed", !0), N(Mt, !0), Lt = setTimeout(() => {
			N(Mt, !1), Lt = void 0;
		}, 1800);
	}
	function si(e) {
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
	function ci(e) {
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
	function li(e, t) {
		return `quote-preview:${e}:${t}`;
	}
	function ui(e, t) {
		t && Ze.closeAllPostItemMenus(), Ze.setPostMenuOpen(e, t);
	}
	function di(e, t = []) {
		N(Dt, e, !0), N(Ot, [...t], !0), N(kt, C(kt) + 1), N(Et, !0);
	}
	function fi(e, t) {
		let n = ge(), r = G();
		return ln({
			structure: e,
			relayHints: C(Ot),
			rxNostr: n,
			relayConfig: _e(),
			signal: t
		}).then((e) => t.aborted || n !== ge() || r !== G() ? null : e);
	}
	function pi(e, t) {
		return Nn(e)?.observe?.(t) ?? (() => {});
	}
	function mi(e) {
		di(e.node.event, e.node.relayUrls);
	}
	function hi(e) {
		return nt.copyState[e] === "failed";
	}
	function gi(e) {
		return C(jt)[e] === "sending";
	}
	function _i(e, t) {
		nt.captureCopyPointerPosition(si(e), t);
	}
	function vi(e, t) {
		nt.handleCopyNevent(si(e), t);
	}
	function yi(e) {
		Si(si(e));
	}
	function bi() {
		return {
			client: tt.externalNostrClient,
			customUrlTemplate: tt.externalNostrClientCustomUrl
		};
	}
	function xi() {
		let e = Je(bi());
		return e ? o()("postHistory.openInExternalClient", { values: { client: e } }) : o()("postHistory.openInExternalClientFallback");
	}
	function Si(e) {
		let t = Ke(e, bi(), We.value);
		t && window.open(t, "_blank", "noopener,noreferrer");
	}
	function Ci(e, t) {
		ii(si(e), t);
	}
	function wi(e, t) {
		ni(si(e), t);
	}
	function Ti(e) {
		return Dr(si(e), G());
	}
	function Ei(e) {
		return C(At)[e] === "sending";
	}
	function Di(e) {
		let t = si(e);
		ei(t) && Ze.openDeleteConfirm(t);
	}
	async function Oi(e) {
		let t = Ae();
		if (!C(K)) return !1;
		let n = await ue()?.(e) ?? !1;
		return n && t() && tr(), n;
	}
	async function ki(e) {
		if (!W()) return;
		let t = Ae();
		await W()(e) !== !1 && t() && tr();
	}
	function Ai(e) {
		le() && (le()(e), tr());
	}
	function ji() {
		Ze.cancelDeleteConfirm();
	}
	async function Mi() {
		let e = Ae();
		e() && (await ie(), e() && C(st) === "search" && C(Sn)?.focus({ preventScroll: !0 }));
	}
	function Ni() {
		C(st) === "search" ? (Pi(), N(ht, !1)) : (N(st, "search"), N(ht, !1), Mi());
	}
	function Pi() {
		$.clearCurrentSessionScrollAnchor(), N(st, "none"), Y.resetSearchState();
	}
	async function Fi(e) {
		let t = ++lt;
		N(ct, !0);
		let n = await Y.jumpToEventId(e.eventId);
		t === lt && C(K) && (n ? ($.clearAllSessionScrollAnchorsForCurrentPubkey(), N(st, "none"), Y.resetSearchState(), $.scrollHistoryEventToTopSoon(e.eventId)) : N(ct, !1));
	}
	function Ii() {
		let e = C(st) !== "jump-date";
		N(st, e ? "jump-date" : "none", !0), e || N(pt, !1), N(ht, !1);
	}
	function Li() {
		N(st, "none"), N(pt, !1);
	}
	function Ri(e) {
		let t = C(ft) ?? C(dt);
		t && e !== 0 && N(ft, t.add({ years: e }), !0);
	}
	function zi() {
		N(ot, !0), N(ht, !1);
	}
	function Bi() {
		N(Q, !0), N(ht, !1);
	}
	function Vi() {
		Tt &&= (clearTimeout(Tt), void 0), N(xt, !1);
	}
	function Hi() {
		let e = /* @__PURE__ */ new Date();
		return [
			String(e.getFullYear()).padStart(4, "0"),
			String(e.getMonth() + 1).padStart(2, "0"),
			String(e.getDate()).padStart(2, "0")
		].join("-");
	}
	function Ui(e) {
		Vi(), N(Ct, e.isPartial ? "postHistory.exportPartial" : "postHistory.exportComplete", !0), N(wt, {
			exported: e.exportedEventCount,
			skipped: e.skippedPostCount + e.missingDeletionRawEventCount + e.invalidDeletionRawEventCount
		}, !0), N(xt, !0), Tt = setTimeout(() => {
			N(xt, !1), Tt = void 0;
		}, 5e3);
	}
	async function Wi() {
		if (!G() || C(_t)) return;
		N(_t, !0), N(vt, { phase: "loading" }, !0);
		let e = new AbortController();
		yt = e, bt = G(), N(ht, !1), Vi();
		try {
			let { result: t, blob: n } = await Pp.exportForPubkeyInWorker(G(), {
				signal: e.signal,
				onProgress: (t) => {
					!e.signal.aborted && C(K) && yt === e && N(vt, t, !0);
				}
			});
			if (e.signal.aborted) return;
			let r = URL.createObjectURL(n), i = document.createElement("a");
			i.href = r, i.download = `ehagaki-post-history-${Hi()}.jsonl`, i.style.display = "none", E.appendChild(i), i.click(), setTimeout(() => {
				i.remove(), URL.revokeObjectURL?.(r);
			}, 1e3), Ui(t);
		} catch (t) {
			if (e.signal.aborted || t instanceof DOMException && t.name === "AbortError") return;
			N(Ct, "postHistory.exportFailed"), N(wt, {}, !0), N(xt, !0), Tt = setTimeout(() => {
				N(xt, !1), Tt = void 0;
			}, 5e3);
		} finally {
			yt === e && (yt = void 0, bt = void 0, N(_t, !1));
		}
	}
	async function Gi(e) {
		let t = Ae();
		if (!t()) return;
		let n = G(), r = lt, i = $.captureHistoryScrollAnchor(), a = C(Zt)?.scrollTop ?? null;
		await Y.refreshAfterRelayScan(e), await ie(), t() && C(K) && G() === n && r === lt && C(Zt) && !$.restoreHistoryScrollAnchor(i) && a !== null && (C(Zt).scrollTop = a);
	}
	async function Ki(e) {
		await Ji(() => Y.refreshAfterLocalImport(e));
	}
	let qi = "ehagaki-post-history-coverage-import";
	I(() => {
		if (!globalThis.__POST_HISTORY_COVERAGE__) return;
		let e = (e) => {
			if (!(e instanceof CustomEvent)) return;
			let t = e.detail;
			if (!t?.result || typeof t.resolve != "function") return;
			let n = t.resolve;
			Ki(t.result).finally(n);
		};
		return window.addEventListener(qi, e), () => {
			window.removeEventListener(qi, e);
		};
	});
	async function Ji(e) {
		let t = Ae();
		if (!t()) return;
		let n = G(), r = lt, i = $.captureHistoryScrollAnchor(), a = C(Zt)?.scrollTop ?? null;
		await e(), t() && C(K) && G() === n && r === lt && !Y.isSearchMode && C(Zt) && !$.restoreHistoryScrollAnchor(i) && a !== null && (C(Zt).scrollTop = a);
	}
	function Yi() {
		N(ht, !1), Y.refetchAroundCurrentView();
	}
	function Xi() {
		let e = Ae();
		$.clearAllSessionScrollAnchorsForCurrentPubkey(), N(ht, !1), Y.jumpToOldest().then((t) => {
			e() && (t || !$.isHistoryScrolledToBottom) && $.resetHistoryScrollToBottomSoon();
		});
	}
	function Zi() {
		N(ht, !1), Lr();
	}
	function Qi() {
		N(ot, !1);
	}
	function $i(e) {
		N(Bt, e.mediaList, !0), N(Kt, e.index, !0), N(Jt, e.mediaList.length > 0 && e.index >= 0, !0);
	}
	function ta(e) {
		N(Kt, e, !0);
	}
	function na() {
		N(Jt, !1), N(Bt, [], !0), N(Kt, -1);
	}
	let ra = D(!1);
	I(() => {
		C(K) || N(ra, !1);
	});
	async function ia() {
		let e = Ae(), t = Ze.deleteTargetPost;
		if (!t) return;
		N(At, {
			...C(At),
			[t.eventId]: "sending"
		}, !0);
		let n = await yr.requestDeletion({
			post: t,
			rxNostr: ge()
		});
		if (e()) {
			if (N(ra, n.success && n.sensitivePayloadOmitted === !0, !0), n.success && typeof n.deletedAt == "number" && n.deletionEventId) {
				if (Y.patchDeletedPost(t.eventId, n.deletedAt, n.deletionEventId), He.recordDeletedEvent({
					eventId: t.eventId,
					authorPubkey: t.pubkeyHex,
					deletionEvent: n.deletionEvent ?? null,
					deletionEventAttestation: n.deletionEventAttestation
				}).catch(() => void 0), N(At, {
					...C(At),
					[t.eventId]: void 0
				}, !0), it(t.kind)) for (let e of Y.posts) at(e.kind) && Ne.retry(e);
			} else N(At, {
				...C(At),
				[t.eventId]: "failed"
			}, !0);
			Ze.clearDeleteTarget();
		}
	}
	async function aa() {
		let e = G(), t = ++lt, n = await Y.deleteLocalHistory();
		C(K) && G() === e && t === lt && n && ($.clearAllSessionScrollAnchorsForCurrentPubkey(), N(ot, !1), N(st, "none"), $.resetHistoryScrollSoon());
	}
	var oa = {
		activate: Ee,
		suspend: De,
		invalidateSession: Oe,
		isFullscreen: ke,
		prepareClose: er
	}, sa = h(), ca = M(sa), la = (n) => {
		var r = Vm(), a = M(r), c = x(a), u = (e) => {
			var n = Fp(), r = B(n, !0);
			b((e) => t(r, e), [() => o()("postHistory.sensitivePayloadDeletionOmitted")]), m(e, n);
		};
		f(c, (e) => {
			C(ra) && e(u);
		});
		var T = S(c, 2), D = x(T), k = x(D), A = (n) => {
			var r = Ip(), i = x(r), a = B(i, !0);
			e(r), b(() => t(a, $.currentMonthLabel)), m(n, r);
		};
		f(k, (e) => {
			$.currentMonthLabel && e(A);
		});
		var j = S(k, 2);
		{
			let e = U(() => o()("postHistory.jumpToDate"));
			Xe(j, {
				className: "post-history-heading-action-button post-history-heading-calendar-button",
				variant: "default",
				shape: "square",
				contentLayout: "icon",
				get ariaLabel() {
					return C(e);
				},
				onClick: Ii,
				children: (e, t) => {
					var n = Lp();
					m(e, n);
				},
				$$slots: { default: !0 }
			});
		}
		e(D);
		var P = S(D, 2), F = x(P), te = (e) => {
			{
				let t = U(() => C(vt).phase === "loading" ? o()("postHistory.exportLoading") : C(vt).phase === "verifying" ? o()("postHistory.exportVerifying", { values: {
					processed: C(vt).processed ?? 0,
					total: C(vt).total ?? 0
				} }) : o()("postHistory.exportCreating"));
				Z(e, {
					get text() {
						return C(t);
					},
					showLoader: !0,
					loaderSize: 30,
					state: "loading",
					customClass: "status-loading-placeholder"
				});
			}
		};
		f(F, (e) => {
			C(_t) && e(te);
		});
		var I = S(F, 2);
		{
			let e = U(() => o()("postHistory.repair")), t = U(() => !Y.canRefetchAroundCurrentView);
			Xe(I, {
				className: "post-history-heading-action-button post-history-heading-refetch-button",
				variant: "default",
				shape: "square",
				contentLayout: "icon",
				get ariaLabel() {
					return C(e);
				},
				get disabled() {
					return C(t);
				},
				onClick: Yi,
				children: (e, t) => {
					var n = Rp();
					m(e, n);
				},
				$$slots: { default: !0 }
			});
		}
		var L = S(I, 2);
		{
			let e = U(() => o()(C(st) === "search" ? "postHistory.hideSearch" : "postHistory.showSearch"));
			Xe(L, {
				className: "post-history-heading-action-button post-history-heading-search-button",
				variant: "default",
				shape: "square",
				contentLayout: "icon",
				get ariaLabel() {
					return C(e);
				},
				onClick: Ni,
				children: (e, t) => {
					var n = zp();
					m(e, n);
				},
				$$slots: { default: !0 }
			});
		}
		var R = S(L, 2);
		l(R, () => Dn, (n, r) => {
			r(n, {
				get open() {
					return C(ht);
				},
				set open(e) {
					N(ht, e, !0);
				},
				children: (n, r) => {
					var i = Jp(), a = M(i);
					{
						let e = U(() => `menu-trigger post-history-menu-trigger post-history-heading-menu-trigger ${C(ht) ? "is-open" : ""}`.trim()), t = U(() => o()("postHistory.openMenu"));
						l(a, () => kn, (n, r) => {
							r(n, {
								get class() {
									return C(e);
								},
								get "aria-label"() {
									return C(t);
								},
								children: (e, t) => {
									var n = Bp();
									m(e, n);
								},
								$$slots: { default: !0 }
							});
						});
					}
					var s = S(a, 2);
					l(s, () => et, (n, r) => {
						r(n, {
							get to() {
								return E;
							},
							children: (n, r) => {
								var i = h(), a = M(i);
								l(a, () => Tn, (n, r) => {
									r(n, {
										side: "bottom",
										align: "end",
										sideOffset: 8,
										class: "post-history-menu-content",
										trapFocus: !1,
										preventScroll: !1,
										onCloseAutoFocus: (e) => e.preventDefault(),
										children: (n, r) => {
											var i = qp(), a = x(i), s = (n) => {
												var r = Vp(), i = M(r), a = x(i), o = B(a, !0);
												e(i);
												var s = S(i, 2);
												l(s, () => wn, (e, t) => {
													t(e, { class: "post-history-menu-separator" });
												}), b((e) => t(o, e), [() => ar()]), m(n, r);
											}, c = U(() => ar());
											f(a, (e) => {
												C(c) && e(s);
											});
											var u = S(a, 2);
											{
												let e = U(() => !C(Hn));
												l(u, () => Cn, (n, r) => {
													r(n, {
														class: "menu-action-button",
														get disabled() {
															return C(e);
														},
														onSelect: Zi,
														children: (e, n) => {
															var r = Hp(), i = S(M(r), 2), a = B(i, !0);
															b((e) => t(a, e), [() => o()("postHistory.returnToLatest")]), m(e, r);
														},
														$$slots: { default: !0 }
													});
												});
											}
											var d = S(u, 2);
											{
												let e = U(() => !C(Un));
												l(d, () => Cn, (n, r) => {
													r(n, {
														class: "menu-action-button",
														get disabled() {
															return C(e);
														},
														onSelect: Xi,
														children: (e, n) => {
															var r = Up(), i = S(M(r), 2), a = B(i, !0);
															b((e) => t(a, e), [() => o()("postHistory.jumpToOldest")]), m(e, r);
														},
														$$slots: { default: !0 }
													});
												});
											}
											var p = S(d, 2);
											l(p, () => wn, (e, t) => {
												t(e, { class: "post-history-menu-separator" });
											});
											var h = S(p, 2);
											{
												let e = U(() => !G() || C(_t));
												l(h, () => Cn, (n, r) => {
													r(n, {
														class: "menu-action-button",
														get disabled() {
															return C(e);
														},
														onSelect: Wi,
														children: (e, n) => {
															var r = Wp(), i = S(M(r), 2), a = B(i, !0);
															b((e) => t(a, e), [() => o()("postHistory.export")]), m(e, r);
														},
														$$slots: { default: !0 }
													});
												});
											}
											var g = S(h, 2);
											{
												let e = U(() => !G());
												l(g, () => Cn, (n, r) => {
													r(n, {
														class: "menu-action-button",
														get disabled() {
															return C(e);
														},
														onSelect: Bi,
														children: (e, n) => {
															var r = Gp(), i = S(M(r), 2), a = B(i, !0);
															b((e) => t(a, e), [() => o()("postHistory.import")]), m(e, r);
														},
														$$slots: { default: !0 }
													});
												});
											}
											var _ = S(g, 2);
											{
												let e = U(() => !G() || !ge());
												l(_, () => Cn, (n, r) => {
													r(n, {
														class: "menu-action-button",
														get disabled() {
															return C(e);
														},
														onSelect: () => {
															N(ht, !1), gt.setOpen(!0);
														},
														children: (e, n) => {
															var r = Gp(), i = S(M(r), 2), a = B(i, !0);
															b((e) => t(a, e), [() => o()("postHistory.fullScanTitle")]), m(e, r);
														},
														$$slots: { default: !0 }
													});
												});
											}
											var v = S(_, 2);
											l(v, () => wn, (e, t) => {
												t(e, { class: "post-history-menu-separator" });
											});
											var y = S(v, 2);
											l(y, () => Cn, (e, n) => {
												n(e, {
													class: "menu-action-button menu-action-button-danger",
													onSelect: zi,
													children: (e, n) => {
														var r = Kp(), i = S(M(r), 2), a = B(i, !0);
														b((e) => t(a, e), [() => o()("postHistory.deleteLocalHistory")]), m(e, r);
													},
													$$slots: { default: !0 }
												});
											}), e(i), m(n, i);
										},
										$$slots: { default: !0 }
									});
								}), m(n, i);
							},
							$$slots: { default: !0 }
						});
					}), m(n, i);
				},
				$$slots: { default: !0 }
			});
		}), e(P), e(T), w(T, (e) => N(Yt, e), () => C(Yt));
		var z = S(T, 2), re = (t) => {
			var n = Zp(), r = x(n);
			let i;
			var a = x(r), s = x(a), c = (e) => {
				Z(e, {
					variant: "spinner",
					showLoader: !0,
					loaderSize: 24,
					ariaHidden: !0,
					customClass: "post-history-search-spinner"
				});
			}, l = (e) => {
				var t = Yp();
				m(e, t);
			};
			f(s, (e) => {
				Y.isSearchPageLoading ? e(c) : e(l, -1);
			}), e(a);
			var u = S(a, 2);
			v(u), w(u, (e) => N(Sn, e), () => C(Sn)), e(r);
			var d = S(r, 2);
			{
				let e = U(() => o()("postHistory.hideSearch"));
				Xe(d, {
					type: "button",
					class: "post-history-search-close",
					contentLayout: "icon",
					shape: "square",
					get ariaLabel() {
						return C(e);
					},
					onClick: Pi,
					children: (e, t) => {
						var n = Xp();
						m(e, n);
					},
					$$slots: { default: !0 }
				});
			}
			e(n), b((e, t) => {
				i = V(r, 1, "post-history-search-input-wrapper svelte-9hvdbo", null, i, { "post-history-search-active": Y.isSearchMode }), ae(u, "placeholder", e), ae(u, "aria-label", t), ae(u, "aria-busy", Y.isSearchPageLoading ? "true" : "false");
			}, [() => o()("postHistory.searchPlaceholder"), () => o()("postHistory.search")]), O(u, () => Y.state.searchInput, (e) => Y.state.searchInput = e), m(t, n);
		};
		f(z, (e) => {
			C(st) === "search" && e(re);
		});
		var ie = S(z, 2), oe = (n) => {
			var r = rm(), a = x(r), c = B(a, !0), u = S(a, 2), d = x(u);
			{
				let e = U(() => s() ?? void 0), n = U(() => o()("postHistory.jumpToDateLabel"));
				l(d, () => zc, (r, a) => {
					a(r, {
						get locale() {
							return C(e);
						},
						get calendarLabel() {
							return C(n);
						},
						get value() {
							return C(dt);
						},
						set value(e) {
							N(dt, e, !0);
						},
						get placeholder() {
							return C(ft);
						},
						set placeholder(e) {
							N(ft, e, !0);
						},
						get open() {
							return C(pt);
						},
						set open(e) {
							N(pt, e, !0);
						},
						children: (e, n) => {
							var r = tm(), a = M(r);
							{
								let e = (e, n) => {
									let r = () => (n?.()).segments;
									var a = h(), o = M(a);
									i(o, 19, r, (e, t) => `${e.part}-${t}`, (e, n) => {
										var r = h(), i = M(r);
										l(i, () => Ic, (e, r) => {
											r(e, {
												class: "post-history-date-picker-segment",
												get part() {
													return C(n).part;
												},
												children: (e, r) => {
													ee();
													var i = ne();
													b(() => t(i, C(n).value)), m(e, i);
												},
												$$slots: { default: !0 }
											});
										}), m(e, r);
									}), m(e, a);
								};
								l(a, () => Nc, (t, n) => {
									n(t, {
										"aria-labelledby": "post-history-jump-date-label",
										class: "post-history-date-picker-input",
										children: e,
										$$slots: { default: !0 }
									});
								});
							}
							var s = S(a, 2);
							{
								let e = U(() => o()("postHistory.jumpToDate"));
								l(s, () => Kc, (t, n) => {
									n(t, {
										class: "post-history-date-picker-trigger",
										get "aria-label"() {
											return C(e);
										},
										children: (e, t) => {
											var n = Lp();
											m(e, n);
										},
										$$slots: { default: !0 }
									});
								});
							}
							var c = S(s, 2);
							l(c, () => et, (e, n) => {
								n(e, {
									get to() {
										return E;
									},
									children: (e, n) => {
										var r = h(), a = M(r);
										l(a, () => Wc, (e, n) => {
											n(e, {
												sideOffset: 8,
												class: "post-history-date-picker-content",
												children: (e, n) => {
													var r = h(), a = M(r);
													{
														let e = (e, n) => {
															let r = () => (n?.()).months, a = () => (n?.()).weekdays;
															var o = Jp(), s = M(o);
															l(s, () => Zs, (e, t) => {
																t(e, {
																	class: "post-history-date-picker-header",
																	children: (e, t) => {
																		var n = em(), r = M(n), i = S(r, 2);
																		l(i, () => oc, (e, t) => {
																			t(e, {
																				class: "post-history-date-picker-nav",
																				"aria-label": "Previous month",
																				children: (e, t) => {
																					var n = Qp();
																					m(e, n);
																				},
																				$$slots: { default: !0 }
																			});
																		});
																		var a = S(i, 2);
																		l(a, () => ec, (e, t) => {
																			t(e, { class: "post-history-date-picker-heading" });
																		});
																		var o = S(a, 2);
																		l(o, () => rc, (e, t) => {
																			t(e, {
																				class: "post-history-date-picker-nav",
																				"aria-label": "Next month",
																				children: (e, t) => {
																					var n = $p();
																					m(e, n);
																				},
																				$$slots: { default: !0 }
																			});
																		});
																		var s = S(o, 2);
																		_("click", r, () => Ri(-1)), _("click", s, () => Ri(1)), m(e, n);
																	},
																	$$slots: { default: !0 }
																});
															});
															var c = S(s, 2);
															i(c, 19, r, (e, t) => `${e.value.toString()}-${t}`, (e, n) => {
																var r = h(), o = M(r);
																l(o, () => Ns, (e, r) => {
																	r(e, {
																		class: "post-history-date-picker-grid",
																		children: (e, r) => {
																			var o = Jp(), s = M(o);
																			l(s, () => Hs, (e, n) => {
																				n(e, {
																					children: (e, n) => {
																						var r = h(), o = M(r);
																						l(o, () => Js, (e, n) => {
																							n(e, {
																								children: (e, n) => {
																									var r = h(), o = M(r);
																									i(o, 19, a, (e, t) => `${e}-${t}`, (e, n) => {
																										var r = h(), i = M(r);
																										l(i, () => Gs, (e, r) => {
																											r(e, {
																												class: "post-history-date-picker-weekday",
																												children: (e, r) => {
																													ee();
																													var i = ne();
																													b(() => t(i, C(n))), m(e, i);
																												},
																												$$slots: { default: !0 }
																											});
																										}), m(e, r);
																									}), m(e, r);
																								},
																								$$slots: { default: !0 }
																							});
																						}), m(e, r);
																					},
																					$$slots: { default: !0 }
																				});
																			});
																			var c = S(s, 2);
																			l(c, () => Is, (e, r) => {
																				r(e, {
																					children: (e, r) => {
																						var a = h(), o = M(a);
																						i(o, 19, () => C(n).weeks, (e, t) => `${C(n).value.toString()}-week-${t}`, (e, r) => {
																							var a = h(), o = M(a);
																							l(o, () => Js, (e, a) => {
																								a(e, {
																									children: (e, a) => {
																										var o = h(), s = M(o);
																										i(s, 19, () => C(r), (e, t) => `${e.toString()}-${t}`, (e, r) => {
																											var i = h(), a = M(i);
																											l(a, () => zs, (e, i) => {
																												i(e, {
																													get date() {
																														return C(r);
																													},
																													get month() {
																														return C(n).value;
																													},
																													children: (e, n) => {
																														var i = h(), a = M(i);
																														l(a, () => As, (e, n) => {
																															n(e, {
																																class: "post-history-date-picker-day",
																																children: (e, n) => {
																																	ee();
																																	var i = ne();
																																	b(() => t(i, C(r).day)), m(e, i);
																																},
																																$$slots: { default: !0 }
																															});
																														}), m(e, i);
																													},
																													$$slots: { default: !0 }
																												});
																											}), m(e, i);
																										}), m(e, o);
																									},
																									$$slots: { default: !0 }
																								});
																							}), m(e, a);
																						}), m(e, a);
																					},
																					$$slots: { default: !0 }
																				});
																			}), m(e, o);
																		},
																		$$slots: { default: !0 }
																	});
																}), m(e, r);
															}), m(e, o);
														};
														l(a, () => Hc, (t, n) => {
															n(t, {
																class: "post-history-date-picker-calendar",
																children: e,
																$$slots: { default: !0 }
															});
														});
													}
													m(e, r);
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
				});
			}
			var f = S(d, 2);
			{
				let e = U(() => o()("postHistory.jumpToDateSubmit"));
				Xe(f, {
					type: "button",
					variant: "primary",
					contentLayout: "icon",
					shape: "square",
					get ariaLabel() {
						return C(e);
					},
					className: "post-history-utility-button post-history-utility-submit-button",
					onClick: () => void Rr(),
					children: (e, t) => {
						var n = nm();
						m(e, n);
					},
					$$slots: { default: !0 }
				});
			}
			var p = S(f, 2);
			{
				let e = U(() => o()("postHistory.hideJumpToDate"));
				Xe(p, {
					type: "button",
					variant: "default",
					contentLayout: "icon",
					shape: "square",
					get ariaLabel() {
						return C(e);
					},
					className: "post-history-utility-button post-history-utility-close-button",
					onClick: Li,
					children: (e, t) => {
						var n = Xp();
						m(e, n);
					},
					$$slots: { default: !0 }
				});
			}
			e(u), e(r), b((e) => t(c, e), [() => o()("postHistory.jumpToDateLabel")]), m(n, r);
		};
		f(ie, (e) => {
			C(st) === "jump-date" && e(oe);
		});
		var H = S(ie, 2), se = x(H), ce = (t) => {
			var n = im(), r = x(n);
			Z(r, {
				variant: "spinner",
				showLoader: !0,
				loaderSize: 24
			}), e(n), m(t, n);
		}, de = (n) => {
			var r = am(), i = x(r), a = B(i, !0);
			e(r), b((e) => t(a, e), [() => Y.isSearchMode ? o()("postHistory.searchNoResults") : o()("postHistory.empty")]), m(n, r);
		}, me = (n) => {
			var r = Pm(), a = M(r), c = (n) => {
				var r = sm(), i = x(r);
				{
					let e = U(() => !Y.canLoadNewer);
					Xe(i, {
						type: "button",
						variant: "default",
						className: "post-history-nav-button",
						contentLayout: "iconText",
						get disabled() {
							return C(e);
						},
						onClick: () => void Ir(),
						children: (e, n) => {
							var r = om(), i = S(M(r));
							b((e) => t(i, ` ${e ?? ""}`), [() => mr()]), m(e, r);
						},
						$$slots: { default: !0 }
					});
				}
				e(r), m(n, r);
			};
			f(a, (e) => {
				(Y.isSearchMode ? Y.canLoadNewer : Y.state.hasNewerLocal && (C(ct) || !yn || Y.state.listingMode !== "contiguous")) && e(c);
			});
			var u = S(a, 2), g = (t) => {
				var n = lm();
				let r;
				var i = x(n), a = (t) => {
					var n = cm(), r = x(n), i = (e) => {
						Z(e, {
							variant: "spinner",
							showLoader: !0,
							loaderSize: 24,
							ariaHidden: !0
						});
					};
					f(r, (e) => {
						C(tn) && e(i);
					}), e(n), m(t, n);
				};
				f(i, (e) => {
					C(bn) && Y.state.hasNewerLocal && e(a);
				}), e(n), b(() => r = V(n, 1, "post-history-auto-load-slot post-history-auto-load-newer-slot svelte-9hvdbo", null, r, { "post-history-auto-load-newer-slot-reserved": C(bn) })), m(t, n);
			};
			f(u, (e) => {
				yn && !Y.isSearchMode && Y.state.listingMode === "contiguous" && !C(ct) && e(g);
			});
			var _ = S(u, 2);
			i(_, 21, () => Y.posts, (e) => e.eventId, (n, r) => {
				let a = U(() => He.getAnchorState(C(r)));
				var c = wm();
				let u;
				var g = x(c), _ = x(g), v = x(_), w = (e) => {
					{
						let t = U(() => ue() ? Oi : void 0), n = U(() => Ne.getPreview(C(r))), i = U(() => Be(C(r))), a = U(() => W() ? ki : void 0), o = U(() => le() ? Ai : void 0), s = U(() => Nn(Ne.getPreview(C(r)).event));
						nr(e, {
							get onReactionPost() {
								return C(t);
							},
							get reactionExtras() {
								return d;
							},
							get reactionDetails() {
								return p;
							},
							get post() {
								return C(r);
							},
							get preview() {
								return C(n);
							},
							get channelText() {
								return C(i);
							},
							get menu() {
								return y;
							},
							onRetry: () => Ne.retry(C(r)),
							get onReplyPost() {
								return C(a);
							},
							get onQuotePost() {
								return C(o);
							},
							get loadSensitiveBody() {
								return C(s);
							},
							get scrollRoot() {
								return C(Zt);
							},
							onImageOpen: $i,
							get emojiLoadStateByUrl() {
								return jn.emojiLoadStateByUrl;
							},
							get emojiImageMetaByUrl() {
								return jn.emojiImageMetaByUrl;
							}
						});
					}
				}, T = U(() => at(C(r).kind)), D = (n) => {
					var c = Cm(), u = M(c), d = (n) => {
						var i = _m(), a = x(i), c = (n) => {
							var i = um(), a = S(x(i), 2), s = B(a, !0), c = S(a, 2), l = B(c, !0);
							e(i), b((e, n) => {
								t(s, e), t(l, n);
							}, [() => o()("postHistory.channel"), () => X.getChannelText(C(r), o())]), m(n, i);
						};
						f(a, (e) => {
							C(r).kind === 42 && e(c);
						});
						var u = S(a, 2), d = x(u), p = (n) => {
							var i = pm(), a = x(i), s = (e) => {
								var n = dm(), r = B(n, !0);
								b((e) => t(r, e), [() => o()("postHistory.deletedBadge")]), m(e, n);
							};
							f(a, (e) => {
								C(r).deletedAt && e(s);
							});
							var c = S(a, 2), l = (e) => {
								var n = fm(), r = B(n, !0);
								b((e) => t(r, e), [() => o()("postHistory.deleteFailed")]), m(e, n);
							}, u = U(() => Hr(C(r)));
							f(c, (e) => {
								C(u) && e(l);
							}), e(i), m(n, i);
						}, g = U(() => C(r).deletedAt || Hr(C(r)));
						f(d, (e) => {
							C(g) && e(p);
						});
						var _ = S(d, 2), v = (n) => {
							var i = gm(), a = M(i), c = B(a, !0), u = S(a, 2);
							{
								let n = U(() => Ze.isPostMenuOpen(C(r).eventId));
								l(u, () => Dn, (i, a) => {
									a(i, {
										get open() {
											return C(n);
										},
										onOpenChange: (e) => ui(C(r).eventId, e),
										children: (n, i) => {
											var a = Jp(), c = M(a);
											l(c, () => kn, (e, t) => {
												t(e, {
													class: "menu-trigger post-history-menu-trigger",
													"aria-label": "アクションを表示",
													children: (e, t) => {
														var n = Bp();
														m(e, n);
													},
													$$slots: { default: !0 }
												});
											});
											var u = S(c, 2);
											l(u, () => et, (n, i) => {
												i(n, {
													get to() {
														return E;
													},
													children: (n, i) => {
														var a = h(), c = M(a);
														l(c, () => Tn, (n, i) => {
															i(n, {
																side: "bottom",
																align: "start",
																sideOffset: 8,
																class: "post-history-menu-content",
																trapFocus: !1,
																preventScroll: !1,
																onCloseAutoFocus: (e) => e.preventDefault(),
																children: (n, i) => {
																	var a = hm(), c = x(a), u = B(c, !0), d = S(c, 2);
																	l(d, () => wn, (e, t) => {
																		t(e, { class: "post-history-menu-separator" });
																	});
																	var p = S(d, 2), h = (e) => {
																		var n = Jp(), i = M(n);
																		l(i, () => Cn, (e, n) => {
																			n(e, {
																				class: "menu-action-button",
																				onSelect: () => void Fi(C(r)),
																				children: (e, n) => {
																					var r = mm(), i = S(M(r), 2), a = B(i, !0);
																					b((e) => t(a, e), [() => o()("postHistory.showSurroundingPosts")]), m(e, r);
																				},
																				$$slots: { default: !0 }
																			});
																		});
																		var a = S(i, 2);
																		l(a, () => wn, (e, t) => {
																			t(e, { class: "post-history-menu-separator" });
																		}), m(e, n);
																	};
																	f(p, (e) => {
																		Y.isSearchMode && e(h);
																	});
																	var g = S(p, 2);
																	{
																		let e = U(() => Le(C(r)) ? () => void Re(C(r)) : void 0), t = U(() => nt.copyState[C(r).eventId] === "failed"), n = U(() => Wr(C(r))), i = U(() => Ur(C(r))), a = U(() => ei(C(r))), o = U(() => Vr(C(r))), s = U(xi);
																		tl(g, {
																			order: "standard",
																			get onRepost() {
																				return C(e);
																			},
																			get repostPending() {
																				return fe();
																			},
																			get copyFailed() {
																				return C(t);
																			},
																			get showBroadcast() {
																				return C(n);
																			},
																			get broadcastSending() {
																				return C(i);
																			},
																			get showDelete() {
																				return C(a);
																			},
																			showDeleteSeparator: !1,
																			get deletionSending() {
																				return C(o);
																			},
																			onCopyPointerDown: (e) => nt.captureCopyPointerPosition(C(r), e),
																			onCopyNevent: (e) => void nt.handleCopyNevent(C(r), e),
																			get externalClientLabel() {
																				return C(s);
																			},
																			onOpenExternalClient: () => Si(C(r)),
																			onShowRawJson: () => di(C(r).rawEvent, [
																				...C(r).relayHints,
																				...C(r).acceptedRelays,
																				...C(r).fetchedRelays ?? []
																			]),
																			onBroadcastPointerDown: (e) => ii(C(r), e),
																			onBroadcastPost: (e) => void ni(C(r), e),
																			onOpenDeleteConfirm: () => ti(C(r))
																		});
																	}
																	e(a), b((e) => t(u, e), [() => Xt(C(r).postedAt, s())]), m(n, a);
																},
																$$slots: { default: !0 }
															});
														}), m(n, a);
													},
													$$slots: { default: !0 }
												});
											}), m(n, a);
										},
										$$slots: { default: !0 }
									});
								});
							}
							b((e) => t(c, e), [() => Ht(C(r).postedAt)]), m(n, i);
						};
						f(_, (e) => {
							W() || le() || e(v);
						}), e(u), e(i), m(n, i);
					}, p = U(() => C(r).kind === 42 || C(r).deletedAt || Hr(C(r)) || !(W() || le()));
					f(u, (e) => {
						C(p) && e(d);
					});
					var g = S(u, 2);
					{
						let e = U(() => ue() ? Oi : void 0), t = U(() => W() ? ki : void 0), n = U(() => le() ? Ai : void 0), i = U(xi);
						gu(g, {
							get onReactionPost() {
								return C(e);
							},
							get state() {
								return C(a);
							},
							section: "parent",
							get previewModelByEventId() {
								return C(Jn);
							},
							getSensitiveBodyLoader: Nn,
							get emojiLoadStateByUrl() {
								return jn.emojiLoadStateByUrl;
							},
							get emojiImageMetaByUrl() {
								return jn.emojiImageMetaByUrl;
							},
							get scrollRoot() {
								return C(Zt);
							},
							onImageOpen: $i,
							buildPostRecordForNode: si,
							get onReplyPost() {
								return C(t);
							},
							get onQuotePost() {
								return C(n);
							},
							onToggleParent: () => $.preserveThreadParentToggleScroll(C(r).eventId, C(r).eventId, () => He.toggleParent(C(r))),
							onRetryParent: () => He.retryParent(C(r)),
							onToggleNodeParent: (e) => $.preserveThreadParentToggleScroll(C(r).eventId, e, () => He.toggleNodeParent(C(r), e)),
							onRetryNodeParent: (e) => He.retryNodeParent(C(r), e),
							onToggleNodeChildren: (e) => He.toggleNodeChildren(C(r), e),
							onRetryNodeChildren: (e) => He.retryNodeChildren(C(r), e),
							onCopyPointerDown: _i,
							onCopyNevent: vi,
							get externalClientLabel() {
								return C(i);
							},
							onOpenExternalClient: yi,
							isCopyFailed: hi,
							onShowRawJson: mi,
							onBroadcastPointerDown: Ci,
							onBroadcastPost: wi,
							isBroadcastSending: gi,
							canDeleteNodePost: Ti,
							isDeletionSending: Ei,
							onOpenDeleteConfirm: Di
						});
					}
					var _ = S(g, 2), v = x(_), y = x(v);
					{
						let t = (e) => {
							{
								let t = U(() => An.shouldCollapsePost(C(r))), n = U(() => An.isPostExpanded(C(r))), i = U(() => "post-preview-content-" + C(r).eventId);
								hr(e, {
									placement: "overlay",
									get visible() {
										return C(t);
									},
									get expanded() {
										return C(n);
									},
									get controls() {
										return C(i);
									},
									onToggle: () => An.togglePostExpanded(C(r).eventId)
								});
							}
						}, n = (t) => {
							var n = h(), a = M(n), c = (t) => {
								var n = vm();
								i(n, 21, () => Br(C(r)), (e) => e.eventId, (e, t) => {
									{
										let n = (e) => {
											var n = h(), r = M(n), i = (e) => {
												let n = U(() => ci(C(t).event));
												{
													let r = (e) => {
														let n = U(() => Yr(C(t).event.id));
														var r = h(), i = M(r), a = (e) => {
															{
																let r = U(() => qr(C(t).event.id)), i = U(() => Xr(C(t).event.id));
																dr(e, {
																	get count() {
																		return C(n).totalCount;
																	},
																	get expanded() {
																		return C(r);
																	},
																	get ariaLabel() {
																		return C(i);
																	},
																	onToggle: () => Jr(C(t).event.id)
																});
															}
														};
														f(i, (e) => {
															C(n) && C(n).totalCount > 0 && e(a);
														}), m(e, r);
													}, i = U(() => ue() ? Oi : void 0), a = U(() => C(t).event.kind !== 42 && W() ? ki : void 0), o = U(() => C(t).event.kind !== 42 && le() ? Ai : void 0);
													rr(e, {
														get onReactionPost() {
															return C(i);
														},
														get post() {
															return C(n);
														},
														get onReplyPost() {
															return C(a);
														},
														get onQuotePost() {
															return C(o);
														},
														reactionExtras: r,
														$$slots: { reactionExtras: !0 }
													});
												}
											}, a = U(() => C(t).status === "resolved" && (C(t).event.kind !== 42 || ue() || (Yr(C(t).event.id)?.totalCount ?? 0) > 0));
											f(r, (e) => {
												C(a) && e(i);
											}), m(e, n);
										}, i = (e) => {
											var n = h(), r = M(n), i = (e) => {
												let n = U(() => Yr(C(t).event.id));
												var r = h(), i = M(r), a = (e) => {
													Er(e, {
														get readModel() {
															return C(n);
														},
														get emojiLoadStateByUrl() {
															return jn.emojiLoadStateByUrl;
														},
														get emojiImageMetaByUrl() {
															return jn.emojiImageMetaByUrl;
														}
													});
												}, o = U(() => C(n) && C(n).totalCount > 0 && qr(C(t).event.id));
												f(i, (e) => {
													C(o) && e(a);
												}), m(e, r);
											};
											f(r, (e) => {
												C(t).status === "resolved" && e(i);
											}), m(e, n);
										}, a = (e) => {
											var n = h(), i = M(n), a = (e) => {
												let n = U(() => ci(C(t).event)), i = U(() => li(C(r).eventId, C(n).eventId)), a = U(() => o()("common.showActions"));
												{
													let t = (e) => {
														{
															let t = U(() => nt.copyState[C(n).eventId] === "failed"), r = U(() => Wr(C(n))), i = U(() => Ur(C(n))), a = U(() => ei(C(n))), o = U(() => Vr(C(n))), s = U(xi);
															tl(e, {
																order: "standard",
																get copyFailed() {
																	return C(t);
																},
																get showBroadcast() {
																	return C(r);
																},
																get broadcastSending() {
																	return C(i);
																},
																get showDelete() {
																	return C(a);
																},
																showDeleteSeparator: !0,
																get deletionSending() {
																	return C(o);
																},
																onCopyPointerDown: (e) => nt.captureCopyPointerPosition(C(n), e),
																onCopyNevent: (e) => void nt.handleCopyNevent(C(n), e),
																get externalClientLabel() {
																	return C(s);
																},
																onOpenExternalClient: () => Si(C(n)),
																onShowRawJson: () => di(C(n).rawEvent, [
																	...C(n).relayHints,
																	...C(n).acceptedRelays,
																	...C(n).fetchedRelays ?? []
																]),
																onBroadcastPointerDown: (e) => ii(C(n), e),
																onBroadcastPost: (e) => void ni(C(n), e),
																onOpenDeleteConfirm: () => ti(C(n))
															});
														}
													}, r = U(() => Ze.isPostMenuOpen(C(i))), o = U(() => Xt(C(n).postedAt, s()));
													Pr(e, {
														get open() {
															return C(r);
														},
														onOpenChange: (e) => ui(C(i), e),
														get triggerAriaLabel() {
															return C(a);
														},
														get tooltipContent() {
															return C(a);
														},
														enableTooltip: !0,
														get timestamp() {
															return C(o);
														},
														items: t,
														$$slots: { items: !0 }
													});
												}
											};
											f(i, (e) => {
												C(t).status === "resolved" && e(a);
											}), m(e, n);
										}, c = U(() => C(t).status === "resolved" ? Nn(C(t).event) : void 0), l = U(() => C(t).status === "resolved" ? C(Jn)[C(t).event.id] : void 0);
										il(e, {
											get preview() {
												return C(t);
											},
											get loadSensitiveBody() {
												return C(c);
											},
											get model() {
												return C(l);
											},
											get emojiLoadStateByUrl() {
												return jn.emojiLoadStateByUrl;
											},
											get emojiImageMetaByUrl() {
												return jn.emojiImageMetaByUrl;
											},
											get scrollRoot() {
												return C(Zt);
											},
											onImageOpen: $i,
											onRetry: () => ze.retryQuotePreview(C(t).eventId),
											footerActions: n,
											footerDetails: i,
											footerMenu: a,
											$$slots: {
												footerActions: !0,
												footerDetails: !0,
												footerMenu: !0
											}
										});
									}
								}), e(n), m(t, n);
							}, l = U(() => Br(C(r)).length > 0);
							f(a, (e) => {
								C(l) && e(c);
							}), m(t, n);
						}, a = U(() => zr(C(r))), c = U(() => Nn(C(r).rawEvent)), l = U(() => "post-preview-content-" + C(r).eventId), u = U(() => !An.isPostExpanded(C(r)));
						Vt(y, {
							get model() {
								return C(a);
							},
							get loadSensitiveBody() {
								return C(c);
							},
							resolveSensitiveDisplayContent: (e) => Eu({
								content: e,
								tags: C(r).tags
							}),
							get contentWarningEventId() {
								return C(r).eventId;
							},
							density: "standard",
							get emojiLoadStateByUrl() {
								return jn.emojiLoadStateByUrl;
							},
							get emojiImageMetaByUrl() {
								return jn.emojiImageMetaByUrl;
							},
							get scrollRoot() {
								return C(Zt);
							},
							get previewCollapseAction() {
								return An.previewRef;
							},
							get previewCollapseEventId() {
								return C(r).eventId;
							},
							get previewContentId() {
								return C(l);
							},
							get isTextCollapsed() {
								return C(u);
							},
							onImageOpen: $i,
							textOverlay: t,
							afterContentAndMedia: n,
							$$slots: {
								textOverlay: !0,
								afterContentAndMedia: !0
							}
						});
					}
					e(v);
					var w = S(v, 2);
					{
						let e = (e) => {
							{
								let t = (e) => {
									var t = h(), n = M(t), i = (e) => {
										{
											let t = U(() => Gr(C(r))), n = U(() => Gr(C(r)));
											jr(e, {
												get count() {
													return C(a).repliesActionState.replyCount;
												},
												get selected() {
													return C(a).repliesActionState.visible;
												},
												get ariaLabel() {
													return C(t);
												},
												get tooltipContent() {
													return C(n);
												},
												onClick: () => $r(C(r))
											});
										}
									};
									f(n, (e) => {
										C(a).repliesActionState.status === "loaded" && C(a).repliesActionState.replyCount > 0 && e(i);
									}), m(e, t);
								}, n = (e) => {
									var t = h(), n = M(t), i = (e) => {
										{
											let t = U(() => Kr(C(r))), n = U(() => Zr(C(r)));
											dr(e, {
												get count() {
													return C(a).reactionSummary.totalCount;
												},
												get expanded() {
													return C(t);
												},
												get ariaLabel() {
													return C(n);
												},
												onToggle: () => Qr(C(r))
											});
										}
									};
									f(n, (e) => {
										C(a).reactionSummary.totalCount > 0 && e(i);
									}), m(e, t);
								}, i = U(() => ue() ? Oi : void 0), o = U(() => W() ? ki : void 0), s = U(() => le() ? Ai : void 0);
								rr(e, {
									get onReactionPost() {
										return C(i);
									},
									get post() {
										return C(r);
									},
									get onReplyPost() {
										return C(o);
									},
									get onQuotePost() {
										return C(s);
									},
									replyExtras: t,
									reactionExtras: n,
									$$slots: {
										replyExtras: !0,
										reactionExtras: !0
									}
								});
							}
						}, n = (e) => {
							let n = U(() => o()("common.showActions"));
							var i = h(), c = M(i), u = (e) => {
								{
									let i = (e) => {
										var n = Sm(), i = M(n);
										l(i, () => Cn, (e, n) => {
											n(e, {
												class: "menu-action-button",
												onSelect: () => Si(C(r)),
												children: (e, n) => {
													var r = ym(), i = S(M(r), 2), a = B(i, !0);
													b((e) => t(a, e), [() => xi()]), m(e, r);
												},
												$$slots: { default: !0 }
											});
										});
										var s = S(i, 2);
										l(s, () => wn, (e, t) => {
											t(e, { class: "post-history-menu-separator" });
										});
										var c = S(s, 2);
										{
											let e = U(() => C(a).repliesActionState.status === "loading");
											l(c, () => Cn, (n, i) => {
												i(n, {
													class: "menu-action-button",
													get disabled() {
														return C(e);
													},
													onSelect: () => $r(C(r)),
													children: (e, n) => {
														var i = bm(), o = M(i), s = S(o, 2), c = B(s, !0);
														b((e) => {
															V(o, 1, `${C(a).repliesActionState.visible ? "collapse-content-icon" : "find_in_page-icon"} svg-icon`, "svelte-9hvdbo"), t(c, e);
														}, [() => Gr(C(r))]), m(e, i);
													},
													$$slots: { default: !0 }
												});
											});
										}
										var u = S(c, 2), d = (e) => {
											var n = h(), i = M(n);
											l(i, () => Cn, (e, n) => {
												n(e, {
													class: "menu-action-button",
													onSelect: () => void Fi(C(r)),
													children: (e, n) => {
														var r = xm(), i = S(M(r), 2), a = B(i, !0);
														b((e) => t(a, e), [() => o()("postHistory.showSurroundingPosts")]), m(e, r);
													},
													$$slots: { default: !0 }
												});
											}), m(e, n);
										};
										f(u, (e) => {
											Y.isSearchMode && e(d);
										});
										var p = S(u, 2);
										{
											let e = U(() => Le(C(r)) ? () => void Re(C(r)) : void 0), t = U(() => nt.copyState[C(r).eventId] === "failed"), n = U(() => Wr(C(r))), i = U(() => Ur(C(r))), a = U(() => ei(C(r))), o = U(() => !!(W() || le())), s = U(() => Vr(C(r)));
											tl(p, {
												order: "standard",
												get onRepost() {
													return C(e);
												},
												get repostPending() {
													return fe();
												},
												get copyFailed() {
													return C(t);
												},
												get showBroadcast() {
													return C(n);
												},
												get broadcastSending() {
													return C(i);
												},
												get showDelete() {
													return C(a);
												},
												get showDeleteSeparator() {
													return C(o);
												},
												get deletionSending() {
													return C(s);
												},
												onCopyPointerDown: (e) => nt.captureCopyPointerPosition(C(r), e),
												onCopyNevent: (e) => void nt.handleCopyNevent(C(r), e),
												onShowRawJson: () => di(C(r).rawEvent, [
													...C(r).relayHints,
													...C(r).acceptedRelays,
													...C(r).fetchedRelays ?? []
												]),
												onBroadcastPointerDown: (e) => ii(C(r), e),
												onBroadcastPost: (e) => void ni(C(r), e),
												onOpenDeleteConfirm: () => ti(C(r))
											});
										}
										m(e, n);
									}, c = U(() => Ze.isPostMenuOpen(C(r).eventId)), u = U(() => Xt(C(r).postedAt, s()));
									Pr(e, {
										lazy: !0,
										get open() {
											return C(c);
										},
										onOpenChange: (e) => ui(C(r).eventId, e),
										get triggerAriaLabel() {
											return C(n);
										},
										get tooltipContent() {
											return C(n);
										},
										enableTooltip: !0,
										get timestamp() {
											return C(u);
										},
										items: i,
										$$slots: { items: !0 }
									});
								}
							};
							f(c, (e) => {
								(W() || le()) && e(u);
							}), m(e, i);
						}, i = U(() => W() || le() ? Ht(C(r).postedAt) : ""), c = U(() => !!C(r).deletedAt);
						Fr(w, {
							get formattedDate() {
								return C(i);
							},
							get dimmed() {
								return C(c);
							},
							actions: e,
							trailing: n,
							$$slots: {
								actions: !0,
								trailing: !0
							}
						});
					}
					var T = S(w, 2), D = (e) => {
						Er(e, {
							get readModel() {
								return C(a).reactionReadModel;
							},
							get emojiLoadStateByUrl() {
								return jn.emojiLoadStateByUrl;
							},
							get emojiImageMetaByUrl() {
								return jn.emojiImageMetaByUrl;
							}
						});
					}, O = U(() => C(a).reactionSummary.totalCount > 0 && Kr(C(r)));
					f(T, (e) => {
						C(O) && e(D);
					});
					var k = S(T, 2);
					{
						let e = U(() => ue() ? Oi : void 0), t = U(() => W() ? ki : void 0), n = U(() => le() ? Ai : void 0), i = U(xi);
						gu(k, {
							get onReactionPost() {
								return C(e);
							},
							get state() {
								return C(a);
							},
							section: "children",
							get previewModelByEventId() {
								return C(Jn);
							},
							getSensitiveBodyLoader: Nn,
							get emojiLoadStateByUrl() {
								return jn.emojiLoadStateByUrl;
							},
							get emojiImageMetaByUrl() {
								return jn.emojiImageMetaByUrl;
							},
							get scrollRoot() {
								return C(Zt);
							},
							onImageOpen: $i,
							buildPostRecordForNode: si,
							get onReplyPost() {
								return C(t);
							},
							get onQuotePost() {
								return C(n);
							},
							getReactionReadModel: Yr,
							isReactionExpanded: qr,
							getReactionLabel: Xr,
							onToggleReaction: Jr,
							onToggleNodeParent: (e) => $.preserveThreadParentToggleScroll(C(r).eventId, e, () => He.toggleNodeParent(C(r), e)),
							onRetryNodeParent: (e) => He.retryNodeParent(C(r), e),
							onToggleNodeChildren: (e) => He.toggleNodeChildren(C(r), e),
							onRetryNodeChildren: (e) => He.retryNodeChildren(C(r), e),
							onCopyPointerDown: _i,
							onCopyNevent: vi,
							get externalClientLabel() {
								return C(i);
							},
							onOpenExternalClient: yi,
							isCopyFailed: hi,
							onShowRawJson: mi,
							onBroadcastPointerDown: Ci,
							onBroadcastPost: wi,
							isBroadcastSending: gi,
							canDeleteNodePost: Ti,
							isDeletionSending: Ei,
							onOpenDeleteConfirm: Di
						});
					}
					e(_), b(() => {
						ae(_, "data-post-history-thread-anchor-scope-id", C(r).eventId), ae(_, "data-post-history-thread-anchor-event-id", C(r).eventId);
					}), m(n, c);
				};
				f(v, (e) => {
					C(T) ? e(w) : e(D, -1);
				}), e(_), e(g), e(c), b(() => {
					u = V(c, 1, "post-history-item svelte-9hvdbo", null, u, { "post-history-item-deleted": !!C(r).deletedAt }), ae(c, "data-post-history-event-id", C(r).eventId), ae(c, "data-post-history-posted-at", C(r).postedAt);
				}), m(n, c);
			}), e(_);
			var v = S(_, 2), T = (t) => {
				var n = Em(), r = x(n), i = (t) => {
					var n = Tm(), r = x(n), i = (e) => {
						Z(e, {
							variant: "spinner",
							showLoader: !0,
							loaderSize: 24,
							ariaHidden: !0
						});
					};
					f(r, (e) => {
						C($t) && Y.syncStatus !== "syncing" && e(i);
					}), e(n), w(n, (e) => N(Qt, e), () => C(Qt)), m(t, n);
				};
				f(r, (e) => {
					Y.state.hasOlderLocal && e(i);
				}), e(n), m(t, n);
			};
			f(v, (e) => {
				yn && !Y.isSearchMode && Y.state.listingMode === "contiguous" && !Y.showSavedPostsBoundary && e(T);
			});
			var D = S(v, 2), O = (n) => {
				var r = Dm(), i = x(r), a = B(i, !0), s = S(i, 2), c = B(s, !0);
				e(r), b((e, n) => {
					t(a, e), t(c, n);
				}, [() => o()("postHistory.savedOlderPostsShowing"), () => o()("postHistory.savedOlderPostsGapNotice")]), m(n, r);
			};
			f(D, (e) => {
				Y.isShowingSavedOlderPosts && e(O);
			});
			var k = S(D, 2), A = (n) => {
				var r = Am(), i = x(r), a = x(i), s = (e) => {
					{
						let n = U(() => !Y.canFetchOlderFromRelays || Y.isRefetchingAroundCurrentView);
						Xe(e, {
							type: "button",
							variant: "primary",
							className: "post-history-nav-button",
							contentLayout: "iconText",
							get disabled() {
								return C(n);
							},
							onClick: () => void Nr(),
							children: (e, n) => {
								var r = h(), i = M(r), a = (e) => {
									{
										let t = U(() => o()("postHistory.fetchOlderFromRelaysLoading"));
										Z(e, {
											get text() {
												return C(t);
											},
											showLoader: !0,
											loaderSize: 28,
											customClass: "post-history-nav-loading-placeholder"
										});
									}
								}, s = (e) => {
									var n = Om(), r = S(M(n));
									b((e) => t(r, ` ${e ?? ""}`), [() => o()("postHistory.fetchOlderFromRelays")]), m(e, n);
								};
								f(i, (e) => {
									Y.isFetchingOlderFromRelays ? e(a) : e(s, -1);
								}), m(e, r);
							},
							$$slots: { default: !0 }
						});
					}
				};
				f(a, (e) => {
					(Y.canFetchOlderFromRelays || Y.isFetchingFromRelays) && e(s);
				});
				var c = S(a, 2);
				Xe(c, {
					type: "button",
					variant: "default",
					className: "post-history-nav-button",
					contentLayout: "iconText",
					onClick: () => void Or(),
					children: (e, n) => {
						var r = km(), i = S(M(r));
						b((e) => t(i, ` ${e ?? ""}`), [() => o()("postHistory.showSavedOlderPosts")]), m(e, r);
					},
					$$slots: { default: !0 }
				}), e(i), e(r), m(n, r);
			}, j = (n) => {
				var r = jm(), i = x(r);
				{
					let e = U(() => !Y.canLoadOlder);
					Xe(i, {
						type: "button",
						variant: "default",
						className: "post-history-nav-button",
						contentLayout: "iconText",
						get disabled() {
							return C(e);
						},
						onClick: () => void _r(),
						children: (e, n) => {
							var r = km(), i = S(M(r));
							b((e) => t(i, ` ${e ?? ""}`), [() => cr()]), m(e, r);
						},
						$$slots: { default: !0 }
					});
				}
				e(r), m(n, r);
			}, ee = (n) => {
				var r = jm(), i = x(r);
				{
					let e = U(() => !Y.canLoadOlder);
					Xe(i, {
						type: "button",
						variant: "default",
						className: "post-history-nav-button",
						contentLayout: "iconText",
						get disabled() {
							return C(e);
						},
						onClick: () => void _r(),
						children: (e, n) => {
							var r = km(), i = S(M(r));
							b((e) => t(i, ` ${e ?? ""}`), [() => cr()]), m(e, r);
						},
						$$slots: { default: !0 }
					});
				}
				e(r), m(n, r);
			}, P = (n) => {
				var r = Mm(), i = x(r), a = (e) => {
					{
						let n = U(() => !Y.canFetchOlderFromRelays || Y.isRefetchingAroundCurrentView);
						Xe(e, {
							type: "button",
							variant: "primary",
							className: "post-history-nav-button",
							contentLayout: "iconText",
							get disabled() {
								return C(n);
							},
							onClick: () => void Nr(),
							children: (e, n) => {
								var r = h(), i = M(r), a = (e) => {
									{
										let t = U(() => o()("postHistory.fetchOlderFromRelaysLoading"));
										Z(e, {
											get text() {
												return C(t);
											},
											showLoader: !0,
											loaderSize: 28,
											customClass: "post-history-nav-loading-placeholder"
										});
									}
								}, s = (e) => {
									var n = Om(), r = S(M(n));
									b((e) => t(r, ` ${e ?? ""}`), [() => o()("postHistory.fetchOlderFromRelays")]), m(e, n);
								};
								f(i, (e) => {
									Y.isFetchingOlderFromRelays ? e(a) : e(s, -1);
								}), m(e, r);
							},
							$$slots: { default: !0 }
						});
					}
				};
				f(i, (e) => {
					(Y.canFetchOlderFromRelays || Y.isFetchingFromRelays || Y.isRefetchingAroundCurrentView) && e(a);
				}), e(r), m(n, r);
			}, F = (e) => {
				var t = Nm();
				m(e, t);
			};
			f(k, (e) => {
				Y.showSavedPostsBoundary ? e(A) : Y.isSearchMode && Y.canLoadOlder ? e(j, 1) : !Y.isSearchMode && Y.state.hasOlderLocal && (Y.state.listingMode === "sparse" || !yn) ? e(ee, 2) : Y.showLocalExhaustedState ? e(P, 3) : Y.isSearchMode && Y.posts.length > 0 && e(F, 4);
			}), m(n, r);
		};
		f(se, (e) => {
			Y.posts.length === 0 && C(En) ? e(ce) : C(Gn) ? e(de, 1) : e(me, -1);
		});
		var _e = S(se, 2), ve = (t) => {
			var n = Fm(), r = x(n);
			{
				let e = U(() => o()("postHistory.syncing"));
				Z(r, {
					get text() {
						return C(e);
					},
					variant: "spinner",
					showLoader: !0,
					loaderSize: 24
				});
			}
			e(n), m(t, n);
		};
		f(_e, (e) => {
			!Y.isSearchMode && Y.syncStatus === "syncing" && (Y.posts.length > 0 || C(_t)) && e(ve);
		}), e(H), w(H, (e) => N(Zt, e), () => C(Zt));
		var ye = S(H, 2), be = (t) => {
			var n = Lm(), r = x(n);
			{
				let e = U(() => o()("postHistory.returnToLatest"));
				Xe(r, {
					type: "button",
					variant: "default",
					shape: "circle",
					className: "post-history-latest-button",
					contentLayout: "icon",
					get ariaLabel() {
						return C(e);
					},
					onClick: () => void Lr(),
					children: (e, t) => {
						var n = Im();
						m(e, n);
					},
					$$slots: { default: !0 }
				});
			}
			e(n), m(t, n);
		};
		f(ye, (e) => {
			C(Hn) && e(be);
		});
		var xe = S(ye, 2);
		{
			let e = U(() => !!G() && !!ge());
			Bl(xe, {
				get open() {
					return gt.state.open;
				},
				get running() {
					return gt.state.running;
				},
				get canStart() {
					return C(e);
				},
				get progress() {
					return gt.state.progress;
				},
				get result() {
					return gt.state.result;
				},
				get elapsedMs() {
					return gt.state.elapsedMs;
				},
				get onOpenChange() {
					return gt.setOpen;
				},
				onStart: () => void gt.start(),
				get onCancel() {
					return gt.cancel;
				}
			});
		}
		var Se = S(xe, 2);
		wl(Se, {
			get open() {
				return C(Q);
			},
			get ownerPubkeyHex() {
				return G();
			},
			getCurrentPubkeyHex: () => G(),
			onOpenChange: (e) => N(Q, e, !0),
			onImported: Ki
		});
		var Ce = S(Se, 2);
		gr(Ce, {
			get open() {
				return C(Et);
			},
			get rawEvent() {
				return C(Dt);
			},
			get resetKey() {
				return C(kt);
			},
			loadPayloadEvent: fi,
			observePayloadStatus: pi,
			onOpenChange: (e) => N(Et, e, !0)
		});
		var we = S(Ce, 2);
		pr(we, {
			get result() {
				return C(Pe);
			},
			get saveFailure() {
				return he();
			},
			get pending() {
				return fe();
			},
			get anchor() {
				return C(Yt);
			},
			anchorRightOffset: 16,
			get onRetrySave() {
				return pe();
			}
		}), e(a);
		var q = S(a, 2);
		{
			let e = U(() => C(K) && !gt.state.open && !C(_t) && !!C(Fn) && !C(Bn)), t = U(() => C(Vn) ? 200 : 0), n = U(() => !Y.showStatusLoader);
			Qe(q, {
				get show() {
					return C(e);
				},
				get fadeOutDuration() {
					return C(t);
				},
				variant: "anchor-center",
				get anchor() {
					return C(Yt);
				},
				get showInfoIcon() {
					return C(n);
				},
				children: (e, t) => {
					var n = h(), r = M(n), i = (e) => {
						{
							let t = U(() => C(In) ? o()(C(Fn), { values: C(In) }) : o()(C(Fn))), n = U(() => Y.showStatusLoader ? "loading" : "complete"), r = U(() => `status-loading-placeholder post-history-heading-status-placeholder${C(zn) ? " status-error" : ""}`);
							Z(e, {
								get text() {
									return C(t);
								},
								get showLoader() {
									return Y.showStatusLoader;
								},
								loaderSize: 30,
								get state() {
									return C(n);
								},
								get customClass() {
									return C(r);
								}
							});
						}
					};
					f(r, (e) => {
						C(Fn) && e(i);
					}), m(e, n);
				},
				$$slots: { default: !0 }
			});
		}
		var Te = S(q, 2);
		{
			let n = (n) => {
				var r = Rm(), i = x(r), a = B(i, !0), s = S(i, 2), c = B(s, !0);
				e(r), b((e, n) => {
					t(a, e), t(c, n);
				}, [() => o()("postHistory.deleteRequestDescription"), () => o()("postHistory.deleteRequestWarning")]), m(n, r);
			}, r = U(() => o()("postHistory.deleteRequestTitle")), i = U(() => o()("postHistory.deleteRequestDescription")), a = U(() => Ze.deleteTargetPost && Vr(Ze.deleteTargetPost) ? o()("postHistory.deleteSending") : o()("postHistory.deleteConfirm")), s = U(() => o()("postHistory.deleteCancel")), c = U(() => Ze.deleteTargetPost ? Vr(Ze.deleteTargetPost) : !1);
			Zn(Te, {
				get open() {
					return Ze.deleteConfirmOpen;
				},
				get onOpenChange() {
					return Ze.setDeleteConfirmOpen;
				},
				get title() {
					return C(r);
				},
				get description() {
					return C(i);
				},
				get confirmLabel() {
					return C(a);
				},
				get cancelLabel() {
					return C(s);
				},
				confirmVariant: "danger",
				get confirmDisabled() {
					return C(c);
				},
				onConfirm: ia,
				onCancel: ji,
				contentClass: "post-history-delete-confirm",
				children: n,
				$$slots: { default: !0 }
			});
		}
		var Ee = S(Te, 2);
		{
			let n = (n) => {
				var r = zm(), i = x(r), a = B(i, !0);
				e(r), b((e) => t(a, e), [() => o()("postHistory.deleteLocalHistoryDescription")]), m(n, r);
			}, r = U(() => o()("postHistory.deleteLocalHistoryTitle")), i = U(() => o()("postHistory.deleteLocalHistoryDescription")), a = U(() => o()("postHistory.deleteLocalHistoryConfirm")), s = U(() => o()("postHistory.deleteLocalHistoryCancel"));
			Zn(Ee, {
				get title() {
					return C(r);
				},
				get description() {
					return C(i);
				},
				get confirmLabel() {
					return C(a);
				},
				get cancelLabel() {
					return C(s);
				},
				confirmVariant: "danger",
				onConfirm: aa,
				onCancel: Qi,
				closeOnConfirm: !1,
				preventCloseWhileConfirming: !0,
				showConfirmSpinner: !0,
				contentClass: "post-history-local-delete-confirm",
				get open() {
					return C(ot);
				},
				set open(e) {
					N(ot, e, !0);
				},
				children: n,
				$$slots: { default: !0 }
			});
		}
		var De = S(Ee, 2);
		{
			let e = U(() => C(Bt)[C(Kt)]?.src ?? ""), t = U(() => C(Bt)[C(Kt)]?.alt ?? "");
			Ln(De, {
				get src() {
					return C(e);
				},
				get alt() {
					return C(t);
				},
				onClose: na,
				get mediaList() {
					return C(Bt);
				},
				get currentIndex() {
					return C(Kt);
				},
				onNavigate: ta,
				get show() {
					return C(Jt);
				},
				set show(e) {
					N(Jt, e, !0);
				}
			});
		}
		var Oe = S(De, 2);
		Qe(Oe, {
			get show() {
				return nt.showCopyFloatingMessage;
			},
			get x() {
				return nt.copyFloatingMessageX;
			},
			get y() {
				return nt.copyFloatingMessageY;
			},
			children: (e, n) => {
				var r = Bm(), i = B(r, !0);
				b((e) => t(i, e), [() => o()("postHistory.copied")]), m(e, r);
			},
			$$slots: { default: !0 }
		});
		var ke = S(Oe, 2);
		Qe(ke, {
			get show() {
				return C(Mt);
			},
			get x() {
				return C(Nt);
			},
			get y() {
				return C(Pt);
			},
			children: (e, n) => {
				var r = Bm(), i = B(r, !0);
				b((e) => t(i, e), [() => o()(C(Ft))]), m(e, r);
			},
			$$slots: { default: !0 }
		});
		var Ae = S(ke, 2);
		Qe(Ae, {
			get show() {
				return C(xt);
			},
			variant: "top-right",
			children: (e, n) => {
				var r = Bm(), i = B(r, !0);
				b((e) => t(i, e), [() => o()(C(Ct), { values: C(wt) })]), m(e, r);
			},
			$$slots: { default: !0 }
		}), b(() => {
			V(H, 1, `post-history-container${yn && !Y.isSearchMode && Y.state.listingMode === "contiguous" ? " post-history-auto-load-enabled" : ""}`, "svelte-9hvdbo"), ae(H, "aria-busy", C(Wn) || C($t) ? "true" : "false");
		}), g("scroll", H, function(...e) {
			$.handleHistoryScroll?.apply(this, e);
		}), m(n, r);
	};
	f(ca, (e) => {
		C(K) && e(la);
	}), m(n, sa);
	var ua = r(oa);
	return u(), ua;
}
s(["click"]);
export { Um as default };
