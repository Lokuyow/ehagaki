import { i as e, t } from "./rolldown-runtime-CwxnZyOB.js";
import { C as n, Ct as r, E as i, Et as a, G as o, H as s, P as c, Q as l, R as u, St as d, Tt as f, U as p, _t as m, bt as h, c as g, ct as _, d as v, et as y, ft as ee, gt as te, ht as b, it as x, jt as ne, k as re, lt as ie, mt as S, nt as ae, o as oe, ot as C, pt as se, r as w, rt as T, s as ce, st as E, tt as D, v as le, w as ue, wt as de } from "./index-client-57Odq85c.js";
import { a as fe, i as pe, n as me, t as O } from "./tslib.es6-j0rGxSfD.js";
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/disclose-version.js
typeof window < "u" && ((window.__svelte ??= {}).v ??= /* @__PURE__ */ new Set()).add("5");
// D:/ドキュメント/GitHub/ehagaki/node_modules/deepmerge/dist/cjs.js
var he = /* @__PURE__ */ t(((e, t) => {
	var n = function(e) {
		return r(e) && !i(e);
	};
	function r(e) {
		return !!e && typeof e == "object";
	}
	function i(e) {
		var t = Object.prototype.toString.call(e);
		return t === "[object RegExp]" || t === "[object Date]" || o(e);
	}
	var a = typeof Symbol == "function" && Symbol.for ? Symbol.for("react.element") : 60103;
	function o(e) {
		return e.$$typeof === a;
	}
	function s(e) {
		return Array.isArray(e) ? [] : {};
	}
	function c(e, t) {
		return t.clone !== !1 && t.isMergeableObject(e) ? g(s(e), e, t) : e;
	}
	function l(e, t, n) {
		return e.concat(t).map(function(e) {
			return c(e, n);
		});
	}
	function u(e, t) {
		if (!t.customMerge) return g;
		var n = t.customMerge(e);
		return typeof n == "function" ? n : g;
	}
	function d(e) {
		return Object.getOwnPropertySymbols ? Object.getOwnPropertySymbols(e).filter(function(t) {
			return Object.propertyIsEnumerable.call(e, t);
		}) : [];
	}
	function f(e) {
		return Object.keys(e).concat(d(e));
	}
	function p(e, t) {
		try {
			return t in e;
		} catch {
			return !1;
		}
	}
	function m(e, t) {
		return p(e, t) && !(Object.hasOwnProperty.call(e, t) && Object.propertyIsEnumerable.call(e, t));
	}
	function h(e, t, n) {
		var r = {};
		return n.isMergeableObject(e) && f(e).forEach(function(t) {
			r[t] = c(e[t], n);
		}), f(t).forEach(function(i) {
			m(e, i) || (r[i] = p(e, i) && n.isMergeableObject(t[i]) ? u(i, n)(e[i], t[i], n) : c(t[i], n));
		}), r;
	}
	function g(e, t, r) {
		r ||= {}, r.arrayMerge = r.arrayMerge || l, r.isMergeableObject = r.isMergeableObject || n, r.cloneUnlessOtherwiseSpecified = c;
		var i = Array.isArray(t);
		return i === Array.isArray(e) ? i ? r.arrayMerge(e, t, r) : h(e, t, r) : c(t, r);
	}
	g.all = function(e, t) {
		if (!Array.isArray(e)) throw Error("first argument should be an array");
		return e.reduce(function(e, n) {
			return g(e, n, t);
		}, {});
	}, t.exports = g;
}));
// D:/ドキュメント/GitHub/ehagaki/node_modules/@formatjs/fast-memoize/lib/index.js
function ge(e, t) {
	var n = t && t.cache ? t.cache : Ee, r = t && t.serializer ? t.serializer : we;
	return (t && t.strategy ? t.strategy : xe)(e, {
		cache: n,
		serializer: r
	});
}
function _e(e) {
	return e == null || typeof e == "number" || typeof e == "boolean";
}
function ve(e, t, n, r) {
	var i = _e(r) ? r : n(r), a = t.get(i);
	return a === void 0 && (a = e.call(this, r), t.set(i, a)), a;
}
function ye(e, t, n) {
	var r = Array.prototype.slice.call(arguments, 3), i = n(r), a = t.get(i);
	return a === void 0 && (a = e.apply(this, r), t.set(i, a)), a;
}
function be(e, t, n, r, i) {
	return n.bind(t, e, r, i);
}
function xe(e, t) {
	var n = e.length === 1 ? ve : ye;
	return be(e, this, n, t.cache.create(), t.serializer);
}
function Se(e, t) {
	return be(e, this, ye, t.cache.create(), t.serializer);
}
function Ce(e, t) {
	return be(e, this, ve, t.cache.create(), t.serializer);
}
var we = function() {
	return JSON.stringify(arguments);
}, Te = function() {
	function e() {
		this.cache = Object.create(null);
	}
	return e.prototype.get = function(e) {
		return this.cache[e];
	}, e.prototype.set = function(e, t) {
		this.cache[e] = t;
	}, e;
}(), Ee = { create: function() {
	return new Te();
} }, De = {
	variadic: Se,
	monadic: Ce
}, k;
(function(e) {
	e[e.EXPECT_ARGUMENT_CLOSING_BRACE = 1] = "EXPECT_ARGUMENT_CLOSING_BRACE", e[e.EMPTY_ARGUMENT = 2] = "EMPTY_ARGUMENT", e[e.MALFORMED_ARGUMENT = 3] = "MALFORMED_ARGUMENT", e[e.EXPECT_ARGUMENT_TYPE = 4] = "EXPECT_ARGUMENT_TYPE", e[e.INVALID_ARGUMENT_TYPE = 5] = "INVALID_ARGUMENT_TYPE", e[e.EXPECT_ARGUMENT_STYLE = 6] = "EXPECT_ARGUMENT_STYLE", e[e.INVALID_NUMBER_SKELETON = 7] = "INVALID_NUMBER_SKELETON", e[e.INVALID_DATE_TIME_SKELETON = 8] = "INVALID_DATE_TIME_SKELETON", e[e.EXPECT_NUMBER_SKELETON = 9] = "EXPECT_NUMBER_SKELETON", e[e.EXPECT_DATE_TIME_SKELETON = 10] = "EXPECT_DATE_TIME_SKELETON", e[e.UNCLOSED_QUOTE_IN_ARGUMENT_STYLE = 11] = "UNCLOSED_QUOTE_IN_ARGUMENT_STYLE", e[e.EXPECT_SELECT_ARGUMENT_OPTIONS = 12] = "EXPECT_SELECT_ARGUMENT_OPTIONS", e[e.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE = 13] = "EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE", e[e.INVALID_PLURAL_ARGUMENT_OFFSET_VALUE = 14] = "INVALID_PLURAL_ARGUMENT_OFFSET_VALUE", e[e.EXPECT_SELECT_ARGUMENT_SELECTOR = 15] = "EXPECT_SELECT_ARGUMENT_SELECTOR", e[e.EXPECT_PLURAL_ARGUMENT_SELECTOR = 16] = "EXPECT_PLURAL_ARGUMENT_SELECTOR", e[e.EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT = 17] = "EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT", e[e.EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT = 18] = "EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT", e[e.INVALID_PLURAL_ARGUMENT_SELECTOR = 19] = "INVALID_PLURAL_ARGUMENT_SELECTOR", e[e.DUPLICATE_PLURAL_ARGUMENT_SELECTOR = 20] = "DUPLICATE_PLURAL_ARGUMENT_SELECTOR", e[e.DUPLICATE_SELECT_ARGUMENT_SELECTOR = 21] = "DUPLICATE_SELECT_ARGUMENT_SELECTOR", e[e.MISSING_OTHER_CLAUSE = 22] = "MISSING_OTHER_CLAUSE", e[e.INVALID_TAG = 23] = "INVALID_TAG", e[e.INVALID_TAG_NAME = 25] = "INVALID_TAG_NAME", e[e.UNMATCHED_CLOSING_TAG = 26] = "UNMATCHED_CLOSING_TAG", e[e.UNCLOSED_TAG = 27] = "UNCLOSED_TAG";
})(k ||= {});
// D:/ドキュメント/GitHub/ehagaki/node_modules/@formatjs/icu-messageformat-parser/lib/types.js
var A;
(function(e) {
	e[e.literal = 0] = "literal", e[e.argument = 1] = "argument", e[e.number = 2] = "number", e[e.date = 3] = "date", e[e.time = 4] = "time", e[e.select = 5] = "select", e[e.plural = 6] = "plural", e[e.pound = 7] = "pound", e[e.tag = 8] = "tag";
})(A ||= {});
var j;
(function(e) {
	e[e.number = 0] = "number", e[e.dateTime = 1] = "dateTime";
})(j ||= {});
function Oe(e) {
	return e.type === A.literal;
}
function ke(e) {
	return e.type === A.argument;
}
function Ae(e) {
	return e.type === A.number;
}
function je(e) {
	return e.type === A.date;
}
function Me(e) {
	return e.type === A.time;
}
function Ne(e) {
	return e.type === A.select;
}
function Pe(e) {
	return e.type === A.plural;
}
function Fe(e) {
	return e.type === A.pound;
}
function Ie(e) {
	return e.type === A.tag;
}
function Le(e) {
	return !!(e && typeof e == "object" && e.type === j.number);
}
function Re(e) {
	return !!(e && typeof e == "object" && e.type === j.dateTime);
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/@formatjs/icu-messageformat-parser/lib/regex.generated.js
var ze = /[ \xA0\u1680\u2000-\u200A\u202F\u205F\u3000]/, Be = /(?:[Eec]{1,6}|G{1,5}|[Qq]{1,5}|(?:[yYur]+|U{1,5})|[ML]{1,5}|d{1,2}|D{1,3}|F{1}|[abB]{1,5}|[hkHK]{1,2}|w{1,2}|W{1}|m{1,2}|s{1,2}|[zZOvVxX]{1,4})(?=([^']*'[^']*')*[^']*$)/g;
function Ve(e) {
	var t = {};
	return e.replace(Be, function(e) {
		var n = e.length;
		switch (e[0]) {
			case "G":
				t.era = n === 4 ? "long" : n === 5 ? "narrow" : "short";
				break;
			case "y":
				t.year = n === 2 ? "2-digit" : "numeric";
				break;
			case "Y":
			case "u":
			case "U":
			case "r": throw RangeError("`Y/u/U/r` (year) patterns are not supported, use `y` instead");
			case "q":
			case "Q": throw RangeError("`q/Q` (quarter) patterns are not supported");
			case "M":
			case "L":
				t.month = [
					"numeric",
					"2-digit",
					"short",
					"long",
					"narrow"
				][n - 1];
				break;
			case "w":
			case "W": throw RangeError("`w/W` (week) patterns are not supported");
			case "d":
				t.day = ["numeric", "2-digit"][n - 1];
				break;
			case "D":
			case "F":
			case "g": throw RangeError("`D/F/g` (day) patterns are not supported, use `d` instead");
			case "E":
				t.weekday = n === 4 ? "long" : n === 5 ? "narrow" : "short";
				break;
			case "e":
				if (n < 4) throw RangeError("`e..eee` (weekday) patterns are not supported");
				t.weekday = [
					"short",
					"long",
					"narrow",
					"short"
				][n - 4];
				break;
			case "c":
				if (n < 4) throw RangeError("`c..ccc` (weekday) patterns are not supported");
				t.weekday = [
					"short",
					"long",
					"narrow",
					"short"
				][n - 4];
				break;
			case "a":
				t.hour12 = !0;
				break;
			case "b":
			case "B": throw RangeError("`b/B` (period) patterns are not supported, use `a` instead");
			case "h":
				t.hourCycle = "h12", t.hour = ["numeric", "2-digit"][n - 1];
				break;
			case "H":
				t.hourCycle = "h23", t.hour = ["numeric", "2-digit"][n - 1];
				break;
			case "K":
				t.hourCycle = "h11", t.hour = ["numeric", "2-digit"][n - 1];
				break;
			case "k":
				t.hourCycle = "h24", t.hour = ["numeric", "2-digit"][n - 1];
				break;
			case "j":
			case "J":
			case "C": throw RangeError("`j/J/C` (hour) patterns are not supported, use `h/H/K/k` instead");
			case "m":
				t.minute = ["numeric", "2-digit"][n - 1];
				break;
			case "s":
				t.second = ["numeric", "2-digit"][n - 1];
				break;
			case "S":
			case "A": throw RangeError("`S/A` (second) patterns are not supported, use `s` instead");
			case "z":
				t.timeZoneName = n < 4 ? "short" : "long";
				break;
			case "Z":
			case "O":
			case "v":
			case "V":
			case "X":
			case "x": throw RangeError("`Z/O/v/V/X/x` (timeZone) patterns are not supported, use `z` instead");
		}
		return "";
	}), t;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/@formatjs/icu-skeleton-parser/lib/regex.generated.js
var He = /[\t-\r \x85\u200E\u200F\u2028\u2029]/i;
// D:/ドキュメント/GitHub/ehagaki/node_modules/@formatjs/icu-skeleton-parser/lib/number.js
function Ue(e) {
	if (e.length === 0) throw Error("Number skeleton cannot be empty");
	for (var t = e.split(He).filter(function(e) {
		return e.length > 0;
	}), n = [], r = 0, i = t; r < i.length; r++) {
		var a = i[r].split("/");
		if (a.length === 0) throw Error("Invalid number skeleton");
		for (var o = a[0], s = a.slice(1), c = 0, l = s; c < l.length; c++) if (l[c].length === 0) throw Error("Invalid number skeleton");
		n.push({
			stem: o,
			options: s
		});
	}
	return n;
}
function We(e) {
	return e.replace(/^(.*?)-/, "");
}
var Ge = /^\.(?:(0+)(\*)?|(#+)|(0+)(#+))$/g, Ke = /^(@+)?(\+|#+)?[rs]?$/g, qe = /(\*)(0+)|(#+)(0+)|(0+)/g, Je = /^(0+)$/;
function Ye(e) {
	var t = {};
	return e[e.length - 1] === "r" ? t.roundingPriority = "morePrecision" : e[e.length - 1] === "s" && (t.roundingPriority = "lessPrecision"), e.replace(Ke, function(e, n, r) {
		return typeof r == "string" ? r === "+" ? t.minimumSignificantDigits = n.length : n[0] === "#" ? t.maximumSignificantDigits = n.length : (t.minimumSignificantDigits = n.length, t.maximumSignificantDigits = n.length + (typeof r == "string" ? r.length : 0)) : (t.minimumSignificantDigits = n.length, t.maximumSignificantDigits = n.length), "";
	}), t;
}
function Xe(e) {
	switch (e) {
		case "sign-auto": return { signDisplay: "auto" };
		case "sign-accounting":
		case "()": return { currencySign: "accounting" };
		case "sign-always":
		case "+!": return { signDisplay: "always" };
		case "sign-accounting-always":
		case "()!": return {
			signDisplay: "always",
			currencySign: "accounting"
		};
		case "sign-except-zero":
		case "+?": return { signDisplay: "exceptZero" };
		case "sign-accounting-except-zero":
		case "()?": return {
			signDisplay: "exceptZero",
			currencySign: "accounting"
		};
		case "sign-never":
		case "+_": return { signDisplay: "never" };
	}
}
function Ze(e) {
	var t;
	if (e[0] === "E" && e[1] === "E" ? (t = { notation: "engineering" }, e = e.slice(2)) : e[0] === "E" && (t = { notation: "scientific" }, e = e.slice(1)), t) {
		var n = e.slice(0, 2);
		if (n === "+!" ? (t.signDisplay = "always", e = e.slice(2)) : n === "+?" && (t.signDisplay = "exceptZero", e = e.slice(2)), !Je.test(e)) throw Error("Malformed concise eng/scientific notation");
		t.minimumIntegerDigits = e.length;
	}
	return t;
}
function Qe(e) {
	return Xe(e) || {};
}
function $e(e) {
	for (var t = {}, n = 0, r = e; n < r.length; n++) {
		var i = r[n];
		switch (i.stem) {
			case "percent":
			case "%":
				t.style = "percent";
				continue;
			case "%x100":
				t.style = "percent", t.scale = 100;
				continue;
			case "currency":
				t.style = "currency", t.currency = i.options[0];
				continue;
			case "group-off":
			case ",_":
				t.useGrouping = !1;
				continue;
			case "precision-integer":
			case ".":
				t.maximumFractionDigits = 0;
				continue;
			case "measure-unit":
			case "unit":
				t.style = "unit", t.unit = We(i.options[0]);
				continue;
			case "compact-short":
			case "K":
				t.notation = "compact", t.compactDisplay = "short";
				continue;
			case "compact-long":
			case "KK":
				t.notation = "compact", t.compactDisplay = "long";
				continue;
			case "scientific":
				t = O(O(O({}, t), { notation: "scientific" }), i.options.reduce(function(e, t) {
					return O(O({}, e), Qe(t));
				}, {}));
				continue;
			case "engineering":
				t = O(O(O({}, t), { notation: "engineering" }), i.options.reduce(function(e, t) {
					return O(O({}, e), Qe(t));
				}, {}));
				continue;
			case "notation-simple":
				t.notation = "standard";
				continue;
			case "unit-width-narrow":
				t.currencyDisplay = "narrowSymbol", t.unitDisplay = "narrow";
				continue;
			case "unit-width-short":
				t.currencyDisplay = "code", t.unitDisplay = "short";
				continue;
			case "unit-width-full-name":
				t.currencyDisplay = "name", t.unitDisplay = "long";
				continue;
			case "unit-width-iso-code":
				t.currencyDisplay = "symbol";
				continue;
			case "scale":
				t.scale = parseFloat(i.options[0]);
				continue;
			case "rounding-mode-floor":
				t.roundingMode = "floor";
				continue;
			case "rounding-mode-ceiling":
				t.roundingMode = "ceil";
				continue;
			case "rounding-mode-down":
				t.roundingMode = "trunc";
				continue;
			case "rounding-mode-up":
				t.roundingMode = "expand";
				continue;
			case "rounding-mode-half-even":
				t.roundingMode = "halfEven";
				continue;
			case "rounding-mode-half-down":
				t.roundingMode = "halfTrunc";
				continue;
			case "rounding-mode-half-up":
				t.roundingMode = "halfExpand";
				continue;
			case "integer-width":
				if (i.options.length > 1) throw RangeError("integer-width stems only accept a single optional option");
				i.options[0].replace(qe, function(e, n, r, i, a, o) {
					if (n) t.minimumIntegerDigits = r.length;
					else if (i && a) throw Error("We currently do not support maximum integer digits");
					else if (o) throw Error("We currently do not support exact integer digits");
					return "";
				});
				continue;
		}
		if (Je.test(i.stem)) t.minimumIntegerDigits = i.stem.length;
		else if (Ge.test(i.stem)) {
			if (i.options.length > 1) throw RangeError("Fraction-precision stems only accept a single optional option");
			i.stem.replace(Ge, function(e, n, r, i, a, o) {
				return r === "*" ? t.minimumFractionDigits = n.length : i && i[0] === "#" ? t.maximumFractionDigits = i.length : a && o ? (t.minimumFractionDigits = a.length, t.maximumFractionDigits = a.length + o.length) : (t.minimumFractionDigits = n.length, t.maximumFractionDigits = n.length), "";
			});
			var a = i.options[0];
			a === "w" ? t = O(O({}, t), { trailingZeroDisplay: "stripIfInteger" }) : a && (t = O(O({}, t), Ye(a)));
		} else if (Ke.test(i.stem)) t = O(O({}, t), Ye(i.stem));
		else {
			var o = Xe(i.stem);
			o && (t = O(O({}, t), o));
			var s = Ze(i.stem);
			s && (t = O(O({}, t), s));
		}
	}
	return t;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/@formatjs/icu-messageformat-parser/lib/time-data.generated.js
var et = {
	"001": ["H", "h"],
	419: [
		"h",
		"H",
		"hB",
		"hb"
	],
	AC: [
		"H",
		"h",
		"hb",
		"hB"
	],
	AD: ["H", "hB"],
	AE: [
		"h",
		"hB",
		"hb",
		"H"
	],
	AF: [
		"H",
		"hb",
		"hB",
		"h"
	],
	AG: [
		"h",
		"hb",
		"H",
		"hB"
	],
	AI: [
		"H",
		"h",
		"hb",
		"hB"
	],
	AL: [
		"h",
		"H",
		"hB"
	],
	AM: ["H", "hB"],
	AO: ["H", "hB"],
	AR: [
		"h",
		"H",
		"hB",
		"hb"
	],
	AS: ["h", "H"],
	AT: ["H", "hB"],
	AU: [
		"h",
		"hb",
		"H",
		"hB"
	],
	AW: ["H", "hB"],
	AX: ["H"],
	AZ: [
		"H",
		"hB",
		"h"
	],
	BA: [
		"H",
		"hB",
		"h"
	],
	BB: [
		"h",
		"hb",
		"H",
		"hB"
	],
	BD: [
		"h",
		"hB",
		"H"
	],
	BE: ["H", "hB"],
	BF: ["H", "hB"],
	BG: [
		"H",
		"hB",
		"h"
	],
	BH: [
		"h",
		"hB",
		"hb",
		"H"
	],
	BI: ["H", "h"],
	BJ: ["H", "hB"],
	BL: ["H", "hB"],
	BM: [
		"h",
		"hb",
		"H",
		"hB"
	],
	BN: [
		"hb",
		"hB",
		"h",
		"H"
	],
	BO: [
		"h",
		"H",
		"hB",
		"hb"
	],
	BQ: ["H"],
	BR: ["H", "hB"],
	BS: [
		"h",
		"hb",
		"H",
		"hB"
	],
	BT: ["h", "H"],
	BW: [
		"H",
		"h",
		"hb",
		"hB"
	],
	BY: ["H", "h"],
	BZ: [
		"H",
		"h",
		"hb",
		"hB"
	],
	CA: [
		"h",
		"hb",
		"H",
		"hB"
	],
	CC: [
		"H",
		"h",
		"hb",
		"hB"
	],
	CD: ["hB", "H"],
	CF: [
		"H",
		"h",
		"hB"
	],
	CG: ["H", "hB"],
	CH: [
		"H",
		"hB",
		"h"
	],
	CI: ["H", "hB"],
	CK: [
		"H",
		"h",
		"hb",
		"hB"
	],
	CL: [
		"h",
		"H",
		"hB",
		"hb"
	],
	CM: [
		"H",
		"h",
		"hB"
	],
	CN: [
		"H",
		"hB",
		"hb",
		"h"
	],
	CO: [
		"h",
		"H",
		"hB",
		"hb"
	],
	CP: ["H"],
	CR: [
		"h",
		"H",
		"hB",
		"hb"
	],
	CU: [
		"h",
		"H",
		"hB",
		"hb"
	],
	CV: ["H", "hB"],
	CW: ["H", "hB"],
	CX: [
		"H",
		"h",
		"hb",
		"hB"
	],
	CY: [
		"h",
		"H",
		"hb",
		"hB"
	],
	CZ: ["H"],
	DE: ["H", "hB"],
	DG: [
		"H",
		"h",
		"hb",
		"hB"
	],
	DJ: ["h", "H"],
	DK: ["H"],
	DM: [
		"h",
		"hb",
		"H",
		"hB"
	],
	DO: [
		"h",
		"H",
		"hB",
		"hb"
	],
	DZ: [
		"h",
		"hB",
		"hb",
		"H"
	],
	EA: [
		"H",
		"h",
		"hB",
		"hb"
	],
	EC: [
		"h",
		"H",
		"hB",
		"hb"
	],
	EE: ["H", "hB"],
	EG: [
		"h",
		"hB",
		"hb",
		"H"
	],
	EH: [
		"h",
		"hB",
		"hb",
		"H"
	],
	ER: ["h", "H"],
	ES: [
		"H",
		"hB",
		"h",
		"hb"
	],
	ET: [
		"hB",
		"hb",
		"h",
		"H"
	],
	FI: ["H"],
	FJ: [
		"h",
		"hb",
		"H",
		"hB"
	],
	FK: [
		"H",
		"h",
		"hb",
		"hB"
	],
	FM: [
		"h",
		"hb",
		"H",
		"hB"
	],
	FO: ["H", "h"],
	FR: ["H", "hB"],
	GA: ["H", "hB"],
	GB: [
		"H",
		"h",
		"hb",
		"hB"
	],
	GD: [
		"h",
		"hb",
		"H",
		"hB"
	],
	GE: [
		"H",
		"hB",
		"h"
	],
	GF: ["H", "hB"],
	GG: [
		"H",
		"h",
		"hb",
		"hB"
	],
	GH: ["h", "H"],
	GI: [
		"H",
		"h",
		"hb",
		"hB"
	],
	GL: ["H", "h"],
	GM: [
		"h",
		"hb",
		"H",
		"hB"
	],
	GN: ["H", "hB"],
	GP: ["H", "hB"],
	GQ: [
		"H",
		"hB",
		"h",
		"hb"
	],
	GR: [
		"h",
		"H",
		"hb",
		"hB"
	],
	GT: [
		"h",
		"H",
		"hB",
		"hb"
	],
	GU: [
		"h",
		"hb",
		"H",
		"hB"
	],
	GW: ["H", "hB"],
	GY: [
		"h",
		"hb",
		"H",
		"hB"
	],
	HK: [
		"h",
		"hB",
		"hb",
		"H"
	],
	HN: [
		"h",
		"H",
		"hB",
		"hb"
	],
	HR: ["H", "hB"],
	HU: ["H", "h"],
	IC: [
		"H",
		"h",
		"hB",
		"hb"
	],
	ID: ["H"],
	IE: [
		"H",
		"h",
		"hb",
		"hB"
	],
	IL: ["H", "hB"],
	IM: [
		"H",
		"h",
		"hb",
		"hB"
	],
	IN: ["h", "H"],
	IO: [
		"H",
		"h",
		"hb",
		"hB"
	],
	IQ: [
		"h",
		"hB",
		"hb",
		"H"
	],
	IR: ["hB", "H"],
	IS: ["H"],
	IT: ["H", "hB"],
	JE: [
		"H",
		"h",
		"hb",
		"hB"
	],
	JM: [
		"h",
		"hb",
		"H",
		"hB"
	],
	JO: [
		"h",
		"hB",
		"hb",
		"H"
	],
	JP: [
		"H",
		"K",
		"h"
	],
	KE: [
		"hB",
		"hb",
		"H",
		"h"
	],
	KG: [
		"H",
		"h",
		"hB",
		"hb"
	],
	KH: [
		"hB",
		"h",
		"H",
		"hb"
	],
	KI: [
		"h",
		"hb",
		"H",
		"hB"
	],
	KM: [
		"H",
		"h",
		"hB",
		"hb"
	],
	KN: [
		"h",
		"hb",
		"H",
		"hB"
	],
	KP: [
		"h",
		"H",
		"hB",
		"hb"
	],
	KR: [
		"h",
		"H",
		"hB",
		"hb"
	],
	KW: [
		"h",
		"hB",
		"hb",
		"H"
	],
	KY: [
		"h",
		"hb",
		"H",
		"hB"
	],
	KZ: ["H", "hB"],
	LA: [
		"H",
		"hb",
		"hB",
		"h"
	],
	LB: [
		"h",
		"hB",
		"hb",
		"H"
	],
	LC: [
		"h",
		"hb",
		"H",
		"hB"
	],
	LI: [
		"H",
		"hB",
		"h"
	],
	LK: [
		"H",
		"h",
		"hB",
		"hb"
	],
	LR: [
		"h",
		"hb",
		"H",
		"hB"
	],
	LS: ["h", "H"],
	LT: [
		"H",
		"h",
		"hb",
		"hB"
	],
	LU: [
		"H",
		"h",
		"hB"
	],
	LV: [
		"H",
		"hB",
		"hb",
		"h"
	],
	LY: [
		"h",
		"hB",
		"hb",
		"H"
	],
	MA: [
		"H",
		"h",
		"hB",
		"hb"
	],
	MC: ["H", "hB"],
	MD: ["H", "hB"],
	ME: [
		"H",
		"hB",
		"h"
	],
	MF: ["H", "hB"],
	MG: ["H", "h"],
	MH: [
		"h",
		"hb",
		"H",
		"hB"
	],
	MK: [
		"H",
		"h",
		"hb",
		"hB"
	],
	ML: ["H"],
	MM: [
		"hB",
		"hb",
		"H",
		"h"
	],
	MN: [
		"H",
		"h",
		"hb",
		"hB"
	],
	MO: [
		"h",
		"hB",
		"hb",
		"H"
	],
	MP: [
		"h",
		"hb",
		"H",
		"hB"
	],
	MQ: ["H", "hB"],
	MR: [
		"h",
		"hB",
		"hb",
		"H"
	],
	MS: [
		"H",
		"h",
		"hb",
		"hB"
	],
	MT: ["H", "h"],
	MU: ["H", "h"],
	MV: ["H", "h"],
	MW: [
		"h",
		"hb",
		"H",
		"hB"
	],
	MX: [
		"h",
		"H",
		"hB",
		"hb"
	],
	MY: [
		"hb",
		"hB",
		"h",
		"H"
	],
	MZ: ["H", "hB"],
	NA: [
		"h",
		"H",
		"hB",
		"hb"
	],
	NC: ["H", "hB"],
	NE: ["H"],
	NF: [
		"H",
		"h",
		"hb",
		"hB"
	],
	NG: [
		"H",
		"h",
		"hb",
		"hB"
	],
	NI: [
		"h",
		"H",
		"hB",
		"hb"
	],
	NL: ["H", "hB"],
	NO: ["H", "h"],
	NP: [
		"H",
		"h",
		"hB"
	],
	NR: [
		"H",
		"h",
		"hb",
		"hB"
	],
	NU: [
		"H",
		"h",
		"hb",
		"hB"
	],
	NZ: [
		"h",
		"hb",
		"H",
		"hB"
	],
	OM: [
		"h",
		"hB",
		"hb",
		"H"
	],
	PA: [
		"h",
		"H",
		"hB",
		"hb"
	],
	PE: [
		"h",
		"H",
		"hB",
		"hb"
	],
	PF: [
		"H",
		"h",
		"hB"
	],
	PG: ["h", "H"],
	PH: [
		"h",
		"hB",
		"hb",
		"H"
	],
	PK: [
		"h",
		"hB",
		"H"
	],
	PL: ["H", "h"],
	PM: ["H", "hB"],
	PN: [
		"H",
		"h",
		"hb",
		"hB"
	],
	PR: [
		"h",
		"H",
		"hB",
		"hb"
	],
	PS: [
		"h",
		"hB",
		"hb",
		"H"
	],
	PT: ["H", "hB"],
	PW: ["h", "H"],
	PY: [
		"h",
		"H",
		"hB",
		"hb"
	],
	QA: [
		"h",
		"hB",
		"hb",
		"H"
	],
	RE: ["H", "hB"],
	RO: ["H", "hB"],
	RS: [
		"H",
		"hB",
		"h"
	],
	RU: ["H"],
	RW: ["H", "h"],
	SA: [
		"h",
		"hB",
		"hb",
		"H"
	],
	SB: [
		"h",
		"hb",
		"H",
		"hB"
	],
	SC: [
		"H",
		"h",
		"hB"
	],
	SD: [
		"h",
		"hB",
		"hb",
		"H"
	],
	SE: ["H"],
	SG: [
		"h",
		"hb",
		"H",
		"hB"
	],
	SH: [
		"H",
		"h",
		"hb",
		"hB"
	],
	SI: ["H", "hB"],
	SJ: ["H"],
	SK: ["H"],
	SL: [
		"h",
		"hb",
		"H",
		"hB"
	],
	SM: [
		"H",
		"h",
		"hB"
	],
	SN: [
		"H",
		"h",
		"hB"
	],
	SO: ["h", "H"],
	SR: ["H", "hB"],
	SS: [
		"h",
		"hb",
		"H",
		"hB"
	],
	ST: ["H", "hB"],
	SV: [
		"h",
		"H",
		"hB",
		"hb"
	],
	SX: [
		"H",
		"h",
		"hb",
		"hB"
	],
	SY: [
		"h",
		"hB",
		"hb",
		"H"
	],
	SZ: [
		"h",
		"hb",
		"H",
		"hB"
	],
	TA: [
		"H",
		"h",
		"hb",
		"hB"
	],
	TC: [
		"h",
		"hb",
		"H",
		"hB"
	],
	TD: [
		"h",
		"H",
		"hB"
	],
	TF: [
		"H",
		"h",
		"hB"
	],
	TG: ["H", "hB"],
	TH: ["H", "h"],
	TJ: ["H", "h"],
	TL: [
		"H",
		"hB",
		"hb",
		"h"
	],
	TM: ["H", "h"],
	TN: [
		"h",
		"hB",
		"hb",
		"H"
	],
	TO: ["h", "H"],
	TR: ["H", "hB"],
	TT: [
		"h",
		"hb",
		"H",
		"hB"
	],
	TW: [
		"hB",
		"hb",
		"h",
		"H"
	],
	TZ: [
		"hB",
		"hb",
		"H",
		"h"
	],
	UA: [
		"H",
		"hB",
		"h"
	],
	UG: [
		"hB",
		"hb",
		"H",
		"h"
	],
	UM: [
		"h",
		"hb",
		"H",
		"hB"
	],
	US: [
		"h",
		"hb",
		"H",
		"hB"
	],
	UY: [
		"h",
		"H",
		"hB",
		"hb"
	],
	UZ: [
		"H",
		"hB",
		"h"
	],
	VA: [
		"H",
		"h",
		"hB"
	],
	VC: [
		"h",
		"hb",
		"H",
		"hB"
	],
	VE: [
		"h",
		"H",
		"hB",
		"hb"
	],
	VG: [
		"h",
		"hb",
		"H",
		"hB"
	],
	VI: [
		"h",
		"hb",
		"H",
		"hB"
	],
	VN: ["H", "h"],
	VU: ["h", "H"],
	WF: ["H", "hB"],
	WS: ["h", "H"],
	XK: [
		"H",
		"hB",
		"h"
	],
	YE: [
		"h",
		"hB",
		"hb",
		"H"
	],
	YT: ["H", "hB"],
	ZA: [
		"H",
		"h",
		"hb",
		"hB"
	],
	ZM: [
		"h",
		"hb",
		"H",
		"hB"
	],
	ZW: ["H", "h"],
	"af-ZA": [
		"H",
		"h",
		"hB",
		"hb"
	],
	"ar-001": [
		"h",
		"hB",
		"hb",
		"H"
	],
	"ca-ES": [
		"H",
		"h",
		"hB"
	],
	"en-001": [
		"h",
		"hb",
		"H",
		"hB"
	],
	"en-HK": [
		"h",
		"hb",
		"H",
		"hB"
	],
	"en-IL": [
		"H",
		"h",
		"hb",
		"hB"
	],
	"en-MY": [
		"h",
		"hb",
		"H",
		"hB"
	],
	"es-BR": [
		"H",
		"h",
		"hB",
		"hb"
	],
	"es-ES": [
		"H",
		"h",
		"hB",
		"hb"
	],
	"es-GQ": [
		"H",
		"h",
		"hB",
		"hb"
	],
	"fr-CA": [
		"H",
		"h",
		"hB"
	],
	"gl-ES": [
		"H",
		"h",
		"hB"
	],
	"gu-IN": [
		"hB",
		"hb",
		"h",
		"H"
	],
	"hi-IN": [
		"hB",
		"h",
		"H"
	],
	"it-CH": [
		"H",
		"h",
		"hB"
	],
	"it-IT": [
		"H",
		"h",
		"hB"
	],
	"kn-IN": [
		"hB",
		"h",
		"H"
	],
	"ml-IN": [
		"hB",
		"h",
		"H"
	],
	"mr-IN": [
		"hB",
		"hb",
		"h",
		"H"
	],
	"pa-IN": [
		"hB",
		"hb",
		"h",
		"H"
	],
	"ta-IN": [
		"hB",
		"h",
		"hb",
		"H"
	],
	"te-IN": [
		"hB",
		"h",
		"H"
	],
	"zu-ZA": [
		"H",
		"hB",
		"hb",
		"h"
	]
};
// D:/ドキュメント/GitHub/ehagaki/node_modules/@formatjs/icu-messageformat-parser/lib/date-time-pattern-generator.js
function tt(e, t) {
	for (var n = "", r = 0; r < e.length; r++) {
		var i = e.charAt(r);
		if (i === "j") {
			for (var a = 0; r + 1 < e.length && e.charAt(r + 1) === i;) a++, r++;
			var o = 1 + (a & 1), s = a < 2 ? 1 : 3 + (a >> 1), c = "a", l = nt(t);
			for ((l == "H" || l == "k") && (s = 0); s-- > 0;) n += c;
			for (; o-- > 0;) n = l + n;
		} else n += i === "J" ? "H" : i;
	}
	return n;
}
function nt(e) {
	var t = e.hourCycle;
	if (t === void 0 && e.hourCycles && e.hourCycles.length && (t = e.hourCycles[0]), t) switch (t) {
		case "h24": return "k";
		case "h23": return "H";
		case "h12": return "h";
		case "h11": return "K";
		default: throw Error("Invalid hourCycle");
	}
	var n = e.language, r;
	return n !== "root" && (r = e.maximize().region), (et[r || ""] || et[n || ""] || et[`${n}-001`] || et["001"])[0];
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/@formatjs/icu-messageformat-parser/lib/parser.js
var rt = RegExp(`^${ze.source}*`), it = RegExp(`${ze.source}*\$`);
function M(e, t) {
	return {
		start: e,
		end: t
	};
}
var at = !!String.prototype.startsWith && "_a".startsWith("a", 1), ot = !!String.fromCodePoint, st = !!Object.fromEntries, ct = !!String.prototype.codePointAt, lt = !!String.prototype.trimStart, ut = !!String.prototype.trimEnd, dt = Number.isSafeInteger ? Number.isSafeInteger : function(e) {
	return typeof e == "number" && isFinite(e) && Math.floor(e) === e && Math.abs(e) <= 9007199254740991;
}, ft = !0;
try {
	ft = yt("([^\\p{White_Space}\\p{Pattern_Syntax}]*)", "yu").exec("a")?.[0] === "a";
} catch {
	ft = !1;
}
var pt = at ? function(e, t, n) {
	return e.startsWith(t, n);
} : function(e, t, n) {
	return e.slice(n, n + t.length) === t;
}, mt = ot ? String.fromCodePoint : function() {
	for (var e = [...arguments], t = "", n = e.length, r = 0, i; n > r;) {
		if (i = e[r++], i > 1114111) throw RangeError(i + " is not a valid code point");
		t += i < 65536 ? String.fromCharCode(i) : String.fromCharCode(((i -= 65536) >> 10) + 55296, i % 1024 + 56320);
	}
	return t;
}, ht = st ? Object.fromEntries : function(e) {
	for (var t = {}, n = 0, r = e; n < r.length; n++) {
		var i = r[n], a = i[0];
		t[a] = i[1];
	}
	return t;
}, gt = ct ? function(e, t) {
	return e.codePointAt(t);
} : function(e, t) {
	var n = e.length;
	if (!(t < 0 || t >= n)) {
		var r = e.charCodeAt(t), i;
		return r < 55296 || r > 56319 || t + 1 === n || (i = e.charCodeAt(t + 1)) < 56320 || i > 57343 ? r : (r - 55296 << 10) + (i - 56320) + 65536;
	}
}, _t = lt ? function(e) {
	return e.trimStart();
} : function(e) {
	return e.replace(rt, "");
}, vt = ut ? function(e) {
	return e.trimEnd();
} : function(e) {
	return e.replace(it, "");
};
function yt(e, t) {
	return new RegExp(e, t);
}
var bt;
if (ft) {
	var xt = yt("([^\\p{White_Space}\\p{Pattern_Syntax}]*)", "yu");
	bt = function(e, t) {
		return xt.lastIndex = t, xt.exec(e)[1] ?? "";
	};
} else bt = function(e, t) {
	for (var n = [];;) {
		var r = gt(e, t);
		if (r === void 0 || Et(r) || Dt(r)) break;
		n.push(r), t += r >= 65536 ? 2 : 1;
	}
	return mt.apply(void 0, n);
};
var St = function() {
	function e(e, t) {
		t === void 0 && (t = {}), this.message = e, this.position = {
			offset: 0,
			line: 1,
			column: 1
		}, this.ignoreTag = !!t.ignoreTag, this.locale = t.locale, this.requiresOtherClause = !!t.requiresOtherClause, this.shouldParseSkeletons = !!t.shouldParseSkeletons;
	}
	return e.prototype.parse = function() {
		if (this.offset() !== 0) throw Error("parser can only be used once");
		return this.parseMessage(0, "", !1);
	}, e.prototype.parseMessage = function(e, t, n) {
		for (var r = []; !this.isEOF();) {
			var i = this.char();
			if (i === 123) {
				var a = this.parseArgument(e, n);
				if (a.err) return a;
				r.push(a.val);
			} else if (i === 125 && e > 0) break;
			else if (i === 35 && (t === "plural" || t === "selectordinal")) {
				var o = this.clonePosition();
				this.bump(), r.push({
					type: A.pound,
					location: M(o, this.clonePosition())
				});
			} else if (i === 60 && !this.ignoreTag && this.peek() === 47) {
				if (n) break;
				return this.error(k.UNMATCHED_CLOSING_TAG, M(this.clonePosition(), this.clonePosition()));
			} else if (i === 60 && !this.ignoreTag && Ct(this.peek() || 0)) {
				var a = this.parseTag(e, t);
				if (a.err) return a;
				r.push(a.val);
			} else {
				var a = this.parseLiteral(e, t);
				if (a.err) return a;
				r.push(a.val);
			}
		}
		return {
			val: r,
			err: null
		};
	}, e.prototype.parseTag = function(e, t) {
		var n = this.clonePosition();
		this.bump();
		var r = this.parseTagName();
		if (this.bumpSpace(), this.bumpIf("/>")) return {
			val: {
				type: A.literal,
				value: `<${r}/>`,
				location: M(n, this.clonePosition())
			},
			err: null
		};
		if (this.bumpIf(">")) {
			var i = this.parseMessage(e + 1, t, !0);
			if (i.err) return i;
			var a = i.val, o = this.clonePosition();
			if (this.bumpIf("</")) {
				if (this.isEOF() || !Ct(this.char())) return this.error(k.INVALID_TAG, M(o, this.clonePosition()));
				var s = this.clonePosition();
				return r === this.parseTagName() ? (this.bumpSpace(), this.bumpIf(">") ? {
					val: {
						type: A.tag,
						value: r,
						children: a,
						location: M(n, this.clonePosition())
					},
					err: null
				} : this.error(k.INVALID_TAG, M(o, this.clonePosition()))) : this.error(k.UNMATCHED_CLOSING_TAG, M(s, this.clonePosition()));
			}
			return this.error(k.UNCLOSED_TAG, M(n, this.clonePosition()));
		}
		return this.error(k.INVALID_TAG, M(n, this.clonePosition()));
	}, e.prototype.parseTagName = function() {
		var e = this.offset();
		for (this.bump(); !this.isEOF() && Tt(this.char());) this.bump();
		return this.message.slice(e, this.offset());
	}, e.prototype.parseLiteral = function(e, t) {
		for (var n = this.clonePosition(), r = "";;) {
			var i = this.tryParseQuote(t);
			if (i) r += i;
			else {
				var a = this.tryParseUnquoted(e, t);
				if (a) r += a;
				else {
					var o = this.tryParseLeftAngleBracket();
					if (o) r += o;
					else break;
				}
			}
		}
		var s = M(n, this.clonePosition());
		return {
			val: {
				type: A.literal,
				value: r,
				location: s
			},
			err: null
		};
	}, e.prototype.tryParseLeftAngleBracket = function() {
		return !this.isEOF() && this.char() === 60 && (this.ignoreTag || !wt(this.peek() || 0)) ? (this.bump(), "<") : null;
	}, e.prototype.tryParseQuote = function(e) {
		if (this.isEOF() || this.char() !== 39) return null;
		switch (this.peek()) {
			case 39: return this.bump(), this.bump(), "'";
			case 123:
			case 60:
			case 62:
			case 125: break;
			case 35:
				if (e === "plural" || e === "selectordinal") break;
				return null;
			default: return null;
		}
		this.bump();
		var t = [this.char()];
		for (this.bump(); !this.isEOF();) {
			var n = this.char();
			if (n === 39) {
				if (this.peek() === 39) t.push(39), this.bump();
				else {
					this.bump();
					break;
				}
			} else t.push(n);
			this.bump();
		}
		return mt.apply(void 0, t);
	}, e.prototype.tryParseUnquoted = function(e, t) {
		if (this.isEOF()) return null;
		var n = this.char();
		return n === 60 || n === 123 || n === 35 && (t === "plural" || t === "selectordinal") || n === 125 && e > 0 ? null : (this.bump(), mt(n));
	}, e.prototype.parseArgument = function(e, t) {
		var n = this.clonePosition();
		if (this.bump(), this.bumpSpace(), this.isEOF()) return this.error(k.EXPECT_ARGUMENT_CLOSING_BRACE, M(n, this.clonePosition()));
		if (this.char() === 125) return this.bump(), this.error(k.EMPTY_ARGUMENT, M(n, this.clonePosition()));
		var r = this.parseIdentifierIfPossible().value;
		if (!r) return this.error(k.MALFORMED_ARGUMENT, M(n, this.clonePosition()));
		if (this.bumpSpace(), this.isEOF()) return this.error(k.EXPECT_ARGUMENT_CLOSING_BRACE, M(n, this.clonePosition()));
		switch (this.char()) {
			case 125: return this.bump(), {
				val: {
					type: A.argument,
					value: r,
					location: M(n, this.clonePosition())
				},
				err: null
			};
			case 44: return this.bump(), this.bumpSpace(), this.isEOF() ? this.error(k.EXPECT_ARGUMENT_CLOSING_BRACE, M(n, this.clonePosition())) : this.parseArgumentOptions(e, t, r, n);
			default: return this.error(k.MALFORMED_ARGUMENT, M(n, this.clonePosition()));
		}
	}, e.prototype.parseIdentifierIfPossible = function() {
		var e = this.clonePosition(), t = this.offset(), n = bt(this.message, t), r = t + n.length;
		return this.bumpTo(r), {
			value: n,
			location: M(e, this.clonePosition())
		};
	}, e.prototype.parseArgumentOptions = function(e, t, n, r) {
		var i = this.clonePosition(), a = this.parseIdentifierIfPossible().value, o = this.clonePosition();
		switch (a) {
			case "": return this.error(k.EXPECT_ARGUMENT_TYPE, M(i, o));
			case "number":
			case "date":
			case "time":
				this.bumpSpace();
				var s = null;
				if (this.bumpIf(",")) {
					this.bumpSpace();
					var c = this.clonePosition(), l = this.parseSimpleArgStyleIfPossible();
					if (l.err) return l;
					var u = vt(l.val);
					if (u.length === 0) return this.error(k.EXPECT_ARGUMENT_STYLE, M(this.clonePosition(), this.clonePosition()));
					s = {
						style: u,
						styleLocation: M(c, this.clonePosition())
					};
				}
				var d = this.tryParseArgumentClose(r);
				if (d.err) return d;
				var f = M(r, this.clonePosition());
				if (s && pt(s?.style, "::", 0)) {
					var p = _t(s.style.slice(2));
					if (a === "number") {
						var l = this.parseNumberSkeletonFromString(p, s.styleLocation);
						return l.err ? l : {
							val: {
								type: A.number,
								value: n,
								location: f,
								style: l.val
							},
							err: null
						};
					}
					if (p.length === 0) return this.error(k.EXPECT_DATE_TIME_SKELETON, f);
					var m = p;
					this.locale && (m = tt(p, this.locale));
					var u = {
						type: j.dateTime,
						pattern: m,
						location: s.styleLocation,
						parsedOptions: this.shouldParseSkeletons ? Ve(m) : {}
					};
					return {
						val: {
							type: a === "date" ? A.date : A.time,
							value: n,
							location: f,
							style: u
						},
						err: null
					};
				}
				return {
					val: {
						type: a === "number" ? A.number : a === "date" ? A.date : A.time,
						value: n,
						location: f,
						style: s?.style ?? null
					},
					err: null
				};
			case "plural":
			case "selectordinal":
			case "select":
				var h = this.clonePosition();
				if (this.bumpSpace(), !this.bumpIf(",")) return this.error(k.EXPECT_SELECT_ARGUMENT_OPTIONS, M(h, O({}, h)));
				this.bumpSpace();
				var g = this.parseIdentifierIfPossible(), _ = 0;
				if (a !== "select" && g.value === "offset") {
					if (!this.bumpIf(":")) return this.error(k.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE, M(this.clonePosition(), this.clonePosition()));
					this.bumpSpace();
					var l = this.tryParseDecimalInteger(k.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE, k.INVALID_PLURAL_ARGUMENT_OFFSET_VALUE);
					if (l.err) return l;
					this.bumpSpace(), g = this.parseIdentifierIfPossible(), _ = l.val;
				}
				var v = this.tryParsePluralOrSelectOptions(e, a, t, g);
				if (v.err) return v;
				var d = this.tryParseArgumentClose(r);
				if (d.err) return d;
				var y = M(r, this.clonePosition());
				return a === "select" ? {
					val: {
						type: A.select,
						value: n,
						options: ht(v.val),
						location: y
					},
					err: null
				} : {
					val: {
						type: A.plural,
						value: n,
						options: ht(v.val),
						offset: _,
						pluralType: a === "plural" ? "cardinal" : "ordinal",
						location: y
					},
					err: null
				};
			default: return this.error(k.INVALID_ARGUMENT_TYPE, M(i, o));
		}
	}, e.prototype.tryParseArgumentClose = function(e) {
		return this.isEOF() || this.char() !== 125 ? this.error(k.EXPECT_ARGUMENT_CLOSING_BRACE, M(e, this.clonePosition())) : (this.bump(), {
			val: !0,
			err: null
		});
	}, e.prototype.parseSimpleArgStyleIfPossible = function() {
		for (var e = 0, t = this.clonePosition(); !this.isEOF();) switch (this.char()) {
			case 39:
				this.bump();
				var n = this.clonePosition();
				if (!this.bumpUntil("'")) return this.error(k.UNCLOSED_QUOTE_IN_ARGUMENT_STYLE, M(n, this.clonePosition()));
				this.bump();
				break;
			case 123:
				e += 1, this.bump();
				break;
			case 125:
				if (e > 0) --e;
				else return {
					val: this.message.slice(t.offset, this.offset()),
					err: null
				};
				break;
			default: this.bump();
		}
		return {
			val: this.message.slice(t.offset, this.offset()),
			err: null
		};
	}, e.prototype.parseNumberSkeletonFromString = function(e, t) {
		var n = [];
		try {
			n = Ue(e);
		} catch {
			return this.error(k.INVALID_NUMBER_SKELETON, t);
		}
		return {
			val: {
				type: j.number,
				tokens: n,
				location: t,
				parsedOptions: this.shouldParseSkeletons ? $e(n) : {}
			},
			err: null
		};
	}, e.prototype.tryParsePluralOrSelectOptions = function(e, t, n, r) {
		for (var i, a = !1, o = [], s = /* @__PURE__ */ new Set(), c = r.value, l = r.location;;) {
			if (c.length === 0) {
				var u = this.clonePosition();
				if (t !== "select" && this.bumpIf("=")) {
					var d = this.tryParseDecimalInteger(k.EXPECT_PLURAL_ARGUMENT_SELECTOR, k.INVALID_PLURAL_ARGUMENT_SELECTOR);
					if (d.err) return d;
					l = M(u, this.clonePosition()), c = this.message.slice(u.offset, this.offset());
				} else break;
			}
			if (s.has(c)) return this.error(t === "select" ? k.DUPLICATE_SELECT_ARGUMENT_SELECTOR : k.DUPLICATE_PLURAL_ARGUMENT_SELECTOR, l);
			c === "other" && (a = !0), this.bumpSpace();
			var f = this.clonePosition();
			if (!this.bumpIf("{")) return this.error(t === "select" ? k.EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT : k.EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT, M(this.clonePosition(), this.clonePosition()));
			var p = this.parseMessage(e + 1, t, n);
			if (p.err) return p;
			var m = this.tryParseArgumentClose(f);
			if (m.err) return m;
			o.push([c, {
				value: p.val,
				location: M(f, this.clonePosition())
			}]), s.add(c), this.bumpSpace(), i = this.parseIdentifierIfPossible(), c = i.value, l = i.location;
		}
		return o.length === 0 ? this.error(t === "select" ? k.EXPECT_SELECT_ARGUMENT_SELECTOR : k.EXPECT_PLURAL_ARGUMENT_SELECTOR, M(this.clonePosition(), this.clonePosition())) : this.requiresOtherClause && !a ? this.error(k.MISSING_OTHER_CLAUSE, M(this.clonePosition(), this.clonePosition())) : {
			val: o,
			err: null
		};
	}, e.prototype.tryParseDecimalInteger = function(e, t) {
		var n = 1, r = this.clonePosition();
		this.bumpIf("+") || this.bumpIf("-") && (n = -1);
		for (var i = !1, a = 0; !this.isEOF();) {
			var o = this.char();
			if (o >= 48 && o <= 57) i = !0, a = a * 10 + (o - 48), this.bump();
			else break;
		}
		var s = M(r, this.clonePosition());
		return i ? (a *= n, dt(a) ? {
			val: a,
			err: null
		} : this.error(t, s)) : this.error(e, s);
	}, e.prototype.offset = function() {
		return this.position.offset;
	}, e.prototype.isEOF = function() {
		return this.offset() === this.message.length;
	}, e.prototype.clonePosition = function() {
		return {
			offset: this.position.offset,
			line: this.position.line,
			column: this.position.column
		};
	}, e.prototype.char = function() {
		var e = this.position.offset;
		if (e >= this.message.length) throw Error("out of bound");
		var t = gt(this.message, e);
		if (t === void 0) throw Error(`Offset ${e} is at invalid UTF-16 code unit boundary`);
		return t;
	}, e.prototype.error = function(e, t) {
		return {
			val: null,
			err: {
				kind: e,
				message: this.message,
				location: t
			}
		};
	}, e.prototype.bump = function() {
		if (!this.isEOF()) {
			var e = this.char();
			e === 10 ? (this.position.line += 1, this.position.column = 1, this.position.offset += 1) : (this.position.column += 1, this.position.offset += e < 65536 ? 1 : 2);
		}
	}, e.prototype.bumpIf = function(e) {
		if (pt(this.message, e, this.offset())) {
			for (var t = 0; t < e.length; t++) this.bump();
			return !0;
		}
		return !1;
	}, e.prototype.bumpUntil = function(e) {
		var t = this.offset(), n = this.message.indexOf(e, t);
		return n >= 0 ? (this.bumpTo(n), !0) : (this.bumpTo(this.message.length), !1);
	}, e.prototype.bumpTo = function(e) {
		if (this.offset() > e) throw Error(`targetOffset ${e} must be greater than or equal to the current offset ${this.offset()}`);
		for (e = Math.min(e, this.message.length);;) {
			var t = this.offset();
			if (t === e) break;
			if (t > e) throw Error(`targetOffset ${e} is at invalid UTF-16 code unit boundary`);
			if (this.bump(), this.isEOF()) break;
		}
	}, e.prototype.bumpSpace = function() {
		for (; !this.isEOF() && Et(this.char());) this.bump();
	}, e.prototype.peek = function() {
		if (this.isEOF()) return null;
		var e = this.char(), t = this.offset();
		return this.message.charCodeAt(t + (e >= 65536 ? 2 : 1)) ?? null;
	}, e;
}();
function Ct(e) {
	return e >= 97 && e <= 122 || e >= 65 && e <= 90;
}
function wt(e) {
	return Ct(e) || e === 47;
}
function Tt(e) {
	return e === 45 || e === 46 || e >= 48 && e <= 57 || e === 95 || e >= 97 && e <= 122 || e >= 65 && e <= 90 || e == 183 || e >= 192 && e <= 214 || e >= 216 && e <= 246 || e >= 248 && e <= 893 || e >= 895 && e <= 8191 || e >= 8204 && e <= 8205 || e >= 8255 && e <= 8256 || e >= 8304 && e <= 8591 || e >= 11264 && e <= 12271 || e >= 12289 && e <= 55295 || e >= 63744 && e <= 64975 || e >= 65008 && e <= 65533 || e >= 65536 && e <= 983039;
}
function Et(e) {
	return e >= 9 && e <= 13 || e === 32 || e === 133 || e >= 8206 && e <= 8207 || e === 8232 || e === 8233;
}
function Dt(e) {
	return e >= 33 && e <= 35 || e === 36 || e >= 37 && e <= 39 || e === 40 || e === 41 || e === 42 || e === 43 || e === 44 || e === 45 || e >= 46 && e <= 47 || e >= 58 && e <= 59 || e >= 60 && e <= 62 || e >= 63 && e <= 64 || e === 91 || e === 92 || e === 93 || e === 94 || e === 96 || e === 123 || e === 124 || e === 125 || e === 126 || e === 161 || e >= 162 && e <= 165 || e === 166 || e === 167 || e === 169 || e === 171 || e === 172 || e === 174 || e === 176 || e === 177 || e === 182 || e === 187 || e === 191 || e === 215 || e === 247 || e >= 8208 && e <= 8213 || e >= 8214 && e <= 8215 || e === 8216 || e === 8217 || e === 8218 || e >= 8219 && e <= 8220 || e === 8221 || e === 8222 || e === 8223 || e >= 8224 && e <= 8231 || e >= 8240 && e <= 8248 || e === 8249 || e === 8250 || e >= 8251 && e <= 8254 || e >= 8257 && e <= 8259 || e === 8260 || e === 8261 || e === 8262 || e >= 8263 && e <= 8273 || e === 8274 || e === 8275 || e >= 8277 && e <= 8286 || e >= 8592 && e <= 8596 || e >= 8597 && e <= 8601 || e >= 8602 && e <= 8603 || e >= 8604 && e <= 8607 || e === 8608 || e >= 8609 && e <= 8610 || e === 8611 || e >= 8612 && e <= 8613 || e === 8614 || e >= 8615 && e <= 8621 || e === 8622 || e >= 8623 && e <= 8653 || e >= 8654 && e <= 8655 || e >= 8656 && e <= 8657 || e === 8658 || e === 8659 || e === 8660 || e >= 8661 && e <= 8691 || e >= 8692 && e <= 8959 || e >= 8960 && e <= 8967 || e === 8968 || e === 8969 || e === 8970 || e === 8971 || e >= 8972 && e <= 8991 || e >= 8992 && e <= 8993 || e >= 8994 && e <= 9e3 || e === 9001 || e === 9002 || e >= 9003 && e <= 9083 || e === 9084 || e >= 9085 && e <= 9114 || e >= 9115 && e <= 9139 || e >= 9140 && e <= 9179 || e >= 9180 && e <= 9185 || e >= 9186 && e <= 9254 || e >= 9255 && e <= 9279 || e >= 9280 && e <= 9290 || e >= 9291 && e <= 9311 || e >= 9472 && e <= 9654 || e === 9655 || e >= 9656 && e <= 9664 || e === 9665 || e >= 9666 && e <= 9719 || e >= 9720 && e <= 9727 || e >= 9728 && e <= 9838 || e === 9839 || e >= 9840 && e <= 10087 || e === 10088 || e === 10089 || e === 10090 || e === 10091 || e === 10092 || e === 10093 || e === 10094 || e === 10095 || e === 10096 || e === 10097 || e === 10098 || e === 10099 || e === 10100 || e === 10101 || e >= 10132 && e <= 10175 || e >= 10176 && e <= 10180 || e === 10181 || e === 10182 || e >= 10183 && e <= 10213 || e === 10214 || e === 10215 || e === 10216 || e === 10217 || e === 10218 || e === 10219 || e === 10220 || e === 10221 || e === 10222 || e === 10223 || e >= 10224 && e <= 10239 || e >= 10240 && e <= 10495 || e >= 10496 && e <= 10626 || e === 10627 || e === 10628 || e === 10629 || e === 10630 || e === 10631 || e === 10632 || e === 10633 || e === 10634 || e === 10635 || e === 10636 || e === 10637 || e === 10638 || e === 10639 || e === 10640 || e === 10641 || e === 10642 || e === 10643 || e === 10644 || e === 10645 || e === 10646 || e === 10647 || e === 10648 || e >= 10649 && e <= 10711 || e === 10712 || e === 10713 || e === 10714 || e === 10715 || e >= 10716 && e <= 10747 || e === 10748 || e === 10749 || e >= 10750 && e <= 11007 || e >= 11008 && e <= 11055 || e >= 11056 && e <= 11076 || e >= 11077 && e <= 11078 || e >= 11079 && e <= 11084 || e >= 11085 && e <= 11123 || e >= 11124 && e <= 11125 || e >= 11126 && e <= 11157 || e === 11158 || e >= 11159 && e <= 11263 || e >= 11776 && e <= 11777 || e === 11778 || e === 11779 || e === 11780 || e === 11781 || e >= 11782 && e <= 11784 || e === 11785 || e === 11786 || e === 11787 || e === 11788 || e === 11789 || e >= 11790 && e <= 11798 || e === 11799 || e >= 11800 && e <= 11801 || e === 11802 || e === 11803 || e === 11804 || e === 11805 || e >= 11806 && e <= 11807 || e === 11808 || e === 11809 || e === 11810 || e === 11811 || e === 11812 || e === 11813 || e === 11814 || e === 11815 || e === 11816 || e === 11817 || e >= 11818 && e <= 11822 || e === 11823 || e >= 11824 && e <= 11833 || e >= 11834 && e <= 11835 || e >= 11836 && e <= 11839 || e === 11840 || e === 11841 || e === 11842 || e >= 11843 && e <= 11855 || e >= 11856 && e <= 11857 || e === 11858 || e >= 11859 && e <= 11903 || e >= 12289 && e <= 12291 || e === 12296 || e === 12297 || e === 12298 || e === 12299 || e === 12300 || e === 12301 || e === 12302 || e === 12303 || e === 12304 || e === 12305 || e >= 12306 && e <= 12307 || e === 12308 || e === 12309 || e === 12310 || e === 12311 || e === 12312 || e === 12313 || e === 12314 || e === 12315 || e === 12316 || e === 12317 || e >= 12318 && e <= 12319 || e === 12320 || e === 12336 || e === 64830 || e === 64831 || e >= 65093 && e <= 65094;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/@formatjs/icu-messageformat-parser/lib/index.js
function Ot(e) {
	e.forEach(function(e) {
		if (delete e.location, Ne(e) || Pe(e)) for (var t in e.options) delete e.options[t].location, Ot(e.options[t].value);
		else Ae(e) && Le(e.style) || (je(e) || Me(e)) && Re(e.style) ? delete e.style.location : Ie(e) && Ot(e.children);
	});
}
function kt(e, t) {
	t === void 0 && (t = {}), t = O({
		shouldParseSkeletons: !0,
		requiresOtherClause: !0
	}, t);
	var n = new St(e, t).parse();
	if (n.err) {
		var r = SyntaxError(k[n.err.kind]);
		throw r.location = n.err.location, r.originalMessage = n.err.message, r;
	}
	return t?.captureLocation || Ot(n.val), n.val;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/intl-messageformat/lib/src/error.js
var N;
(function(e) {
	e.MISSING_VALUE = "MISSING_VALUE", e.INVALID_VALUE = "INVALID_VALUE", e.MISSING_INTL_API = "MISSING_INTL_API";
})(N ||= {});
var At = function(e) {
	me(t, e);
	function t(t, n, r) {
		var i = e.call(this, t) || this;
		return i.code = n, i.originalMessage = r, i;
	}
	return t.prototype.toString = function() {
		return `[formatjs Error: ${this.code}] ${this.message}`;
	}, t;
}(Error), jt = function(e) {
	me(t, e);
	function t(t, n, r, i) {
		return e.call(this, `Invalid values for "${t}": "${n}". Options are "${Object.keys(r).join("\", \"")}"`, N.INVALID_VALUE, i) || this;
	}
	return t;
}(At), Mt = function(e) {
	me(t, e);
	function t(t, n, r) {
		return e.call(this, `Value for "${t}" must be of type ${n}`, N.INVALID_VALUE, r) || this;
	}
	return t;
}(At), Nt = function(e) {
	me(t, e);
	function t(t, n) {
		return e.call(this, `The intl string context variable "${t}" was not provided to the string "${n}"`, N.MISSING_VALUE, n) || this;
	}
	return t;
}(At), P;
(function(e) {
	e[e.literal = 0] = "literal", e[e.object = 1] = "object";
})(P ||= {});
function Pt(e) {
	return e.length < 2 ? e : e.reduce(function(e, t) {
		var n = e[e.length - 1];
		return !n || n.type !== P.literal || t.type !== P.literal ? e.push(t) : n.value += t.value, e;
	}, []);
}
function Ft(e) {
	return typeof e == "function";
}
function It(e, t, n, r, i, a, o) {
	if (e.length === 1 && Oe(e[0])) return [{
		type: P.literal,
		value: e[0].value
	}];
	for (var s = [], c = 0, l = e; c < l.length; c++) {
		var u = l[c];
		if (Oe(u)) s.push({
			type: P.literal,
			value: u.value
		});
		else if (Fe(u)) typeof a == "number" && s.push({
			type: P.literal,
			value: n.getNumberFormat(t).format(a)
		});
		else {
			var d = u.value;
			if (!(i && d in i)) throw new Nt(d, o);
			var f = i[d];
			if (ke(u)) f && typeof f != "string" && typeof f != "number" || (f = typeof f == "string" || typeof f == "number" ? String(f) : ""), s.push({
				type: typeof f == "string" ? P.literal : P.object,
				value: f
			});
			else if (je(u)) {
				var p = typeof u.style == "string" ? r.date[u.style] : Re(u.style) ? u.style.parsedOptions : void 0;
				s.push({
					type: P.literal,
					value: n.getDateTimeFormat(t, p).format(f)
				});
			} else if (Me(u)) {
				var p = typeof u.style == "string" ? r.time[u.style] : Re(u.style) ? u.style.parsedOptions : r.time.medium;
				s.push({
					type: P.literal,
					value: n.getDateTimeFormat(t, p).format(f)
				});
			} else if (Ae(u)) {
				var p = typeof u.style == "string" ? r.number[u.style] : Le(u.style) ? u.style.parsedOptions : void 0;
				p && p.scale && (f *= p.scale || 1), s.push({
					type: P.literal,
					value: n.getNumberFormat(t, p).format(f)
				});
			} else {
				if (Ie(u)) {
					var m = u.children, h = u.value, g = i[h];
					if (!Ft(g)) throw new Mt(h, "function", o);
					var _ = g(It(m, t, n, r, i, a).map(function(e) {
						return e.value;
					}));
					Array.isArray(_) || (_ = [_]), s.push.apply(s, _.map(function(e) {
						return {
							type: typeof e == "string" ? P.literal : P.object,
							value: e
						};
					}));
				}
				if (Ne(u)) {
					var v = u.options[f] || u.options.other;
					if (!v) throw new jt(u.value, f, Object.keys(u.options), o);
					s.push.apply(s, It(v.value, t, n, r, i));
				} else if (Pe(u)) {
					var v = u.options[`=${f}`];
					if (!v) {
						if (!Intl.PluralRules) throw new At("Intl.PluralRules is not available in this environment.\nTry polyfilling it using \"@formatjs/intl-pluralrules\"\n", N.MISSING_INTL_API, o);
						var y = n.getPluralRules(t, { type: u.pluralType }).select(f - (u.offset || 0));
						v = u.options[y] || u.options.other;
					}
					if (!v) throw new jt(u.value, f, Object.keys(u.options), o);
					s.push.apply(s, It(v.value, t, n, r, i, f - (u.offset || 0)));
				}
			}
		}
	}
	return Pt(s);
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/intl-messageformat/lib/src/core.js
function Lt(e, t) {
	return t ? O(O(O({}, e || {}), t || {}), Object.keys(e).reduce(function(n, r) {
		return n[r] = O(O({}, e[r]), t[r] || {}), n;
	}, {})) : e;
}
function Rt(e, t) {
	return t ? Object.keys(e).reduce(function(n, r) {
		return n[r] = Lt(e[r], t[r]), n;
	}, O({}, e)) : e;
}
function zt(e) {
	return { create: function() {
		return {
			get: function(t) {
				return e[t];
			},
			set: function(t, n) {
				e[t] = n;
			}
		};
	} };
}
function Bt(e) {
	return e === void 0 && (e = {
		number: {},
		dateTime: {},
		pluralRules: {}
	}), {
		getNumberFormat: ge(function() {
			for (var e, t = [], n = 0; n < arguments.length; n++) t[n] = arguments[n];
			return new ((e = Intl.NumberFormat).bind.apply(e, fe([void 0], t, !1)))();
		}, {
			cache: zt(e.number),
			strategy: De.variadic
		}),
		getDateTimeFormat: ge(function() {
			for (var e, t = [], n = 0; n < arguments.length; n++) t[n] = arguments[n];
			return new ((e = Intl.DateTimeFormat).bind.apply(e, fe([void 0], t, !1)))();
		}, {
			cache: zt(e.dateTime),
			strategy: De.variadic
		}),
		getPluralRules: ge(function() {
			for (var e, t = [], n = 0; n < arguments.length; n++) t[n] = arguments[n];
			return new ((e = Intl.PluralRules).bind.apply(e, fe([void 0], t, !1)))();
		}, {
			cache: zt(e.pluralRules),
			strategy: De.variadic
		})
	};
}
var Vt = function() {
	function e(t, n, r, i) {
		n === void 0 && (n = e.defaultLocale);
		var a = this;
		if (this.formatterCache = {
			number: {},
			dateTime: {},
			pluralRules: {}
		}, this.format = function(e) {
			var t = a.formatToParts(e);
			if (t.length === 1) return t[0].value;
			var n = t.reduce(function(e, t) {
				return !e.length || t.type !== P.literal || typeof e[e.length - 1] != "string" ? e.push(t.value) : e[e.length - 1] += t.value, e;
			}, []);
			return n.length <= 1 ? n[0] || "" : n;
		}, this.formatToParts = function(e) {
			return It(a.ast, a.locales, a.formatters, a.formats, e, void 0, a.message);
		}, this.resolvedOptions = function() {
			return { locale: a.resolvedLocale?.toString() || Intl.NumberFormat.supportedLocalesOf(a.locales)[0] };
		}, this.getAst = function() {
			return a.ast;
		}, this.locales = n, this.resolvedLocale = e.resolveLocale(n), typeof t == "string") {
			if (this.message = t, !e.__parse) throw TypeError("IntlMessageFormat.__parse must be set to process `message` of type `string`");
			var o = i || {};
			o.formatters;
			var s = pe(o, ["formatters"]);
			this.ast = e.__parse(t, O(O({}, s), { locale: this.resolvedLocale }));
		} else this.ast = t;
		if (!Array.isArray(this.ast)) throw TypeError("A message must be provided as a String or AST.");
		this.formats = Rt(e.formats, r), this.formatters = i && i.formatters || Bt(this.formatterCache);
	}
	return Object.defineProperty(e, "defaultLocale", {
		get: function() {
			return e.memoizedDefaultLocale ||= new Intl.NumberFormat().resolvedOptions().locale, e.memoizedDefaultLocale;
		},
		enumerable: !1,
		configurable: !0
	}), e.memoizedDefaultLocale = null, e.resolveLocale = function(e) {
		if (Intl.Locale !== void 0) {
			var t = Intl.NumberFormat.supportedLocalesOf(e);
			return t.length > 0 ? new Intl.Locale(t[0]) : new Intl.Locale(typeof e == "string" ? e : e[0]);
		}
	}, e.__parse = kt, e.formats = {
		number: {
			integer: { maximumFractionDigits: 0 },
			currency: { style: "currency" },
			percent: { style: "percent" }
		},
		date: {
			short: {
				month: "numeric",
				day: "numeric",
				year: "2-digit"
			},
			medium: {
				month: "short",
				day: "numeric",
				year: "numeric"
			},
			long: {
				month: "long",
				day: "numeric",
				year: "numeric"
			},
			full: {
				weekday: "long",
				month: "long",
				day: "numeric",
				year: "numeric"
			}
		},
		time: {
			short: {
				hour: "numeric",
				minute: "numeric"
			},
			medium: {
				hour: "numeric",
				minute: "numeric",
				second: "numeric"
			},
			long: {
				hour: "numeric",
				minute: "numeric",
				second: "numeric",
				timeZoneName: "short"
			},
			full: {
				hour: "numeric",
				minute: "numeric",
				second: "numeric",
				timeZoneName: "short"
			}
		}
	}, e;
}(), Ht = /* @__PURE__ */ e(he(), 1);
function Ut(e, t) {
	if (t == null) return;
	if (t in e) return e[t];
	let n = t.split("."), r = e;
	for (let e = 0; e < n.length; e++) if (typeof r == "object") {
		if (e > 0) {
			let t = n.slice(e, n.length).join(".");
			if (t in r) {
				r = r[t];
				break;
			}
		}
		r = r[n[e]];
	} else r = void 0;
	return r;
}
var F = {}, Wt = (e, t, n) => n && (t in F || (F[t] = {}), e in F[t] || (F[t][e] = n), n), Gt = (e, t) => {
	if (t == null) return;
	if (t in F && e in F[t]) return F[t][e];
	let n = U(t);
	for (let r = 0; r < n.length; r++) {
		let i = n[r], a = Yt(i, e);
		if (a) return Wt(e, t, a);
	}
}, Kt, I = v({});
function qt(e) {
	return Kt[e] || null;
}
function Jt(e) {
	return e in Kt;
}
function Yt(e, t) {
	return Jt(e) ? Ut(qt(e), t) : null;
}
function Xt(e) {
	if (e == null) return;
	let t = U(e);
	for (let e = 0; e < t.length; e++) {
		let n = t[e];
		if (Jt(n)) return n;
	}
}
function Zt(e, ...t) {
	delete F[e], I.update((n) => (n[e] = Ht.default.all([n[e] || {}, ...t]), n));
}
g([I], ([e]) => Object.keys(e)), I.subscribe((e) => Kt = e);
var L = {};
function Qt(e) {
	L[e] = /* @__PURE__ */ new Set();
}
function $t(e, t) {
	L[e].delete(t), L[e].size === 0 && delete L[e];
}
function R(e) {
	return L[e];
}
function en(e) {
	return U(e).map((e) => {
		let t = R(e);
		return [e, t ? [...t] : []];
	}).filter(([, e]) => e.length > 0);
}
function z(e) {
	return e != null && U(e).some((e) => R(e)?.size);
}
function tn(e, t) {
	return Promise.all(t.map((t) => ($t(e, t), t().then((e) => e.default || e)))).then((t) => Zt(e, ...t));
}
var B = {};
function nn(e) {
	if (!z(e)) return e in B ? B[e] : Promise.resolve();
	let t = en(e);
	return B[e] = Promise.all(t.map(([e, t]) => tn(e, t))).then(() => {
		if (z(e)) return nn(e);
		delete B[e];
	}), B[e];
}
function rn(e, t) {
	R(e) || Qt(e);
	let n = R(e);
	R(e).has(t) || (Jt(e) || I.update((t) => (t[e] = {}, t)), n.add(t));
}
var an = Object.getOwnPropertySymbols, on = Object.prototype.hasOwnProperty, sn = Object.prototype.propertyIsEnumerable, cn = (e, t) => {
	var n = {};
	for (var r in e) on.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
	if (e != null && an) for (var r of an(e)) t.indexOf(r) < 0 && sn.call(e, r) && (n[r] = e[r]);
	return n;
}, ln = {
	number: {
		scientific: { notation: "scientific" },
		engineering: { notation: "engineering" },
		compactLong: {
			notation: "compact",
			compactDisplay: "long"
		},
		compactShort: {
			notation: "compact",
			compactDisplay: "short"
		}
	},
	date: {
		short: {
			month: "numeric",
			day: "numeric",
			year: "2-digit"
		},
		medium: {
			month: "short",
			day: "numeric",
			year: "numeric"
		},
		long: {
			month: "long",
			day: "numeric",
			year: "numeric"
		},
		full: {
			weekday: "long",
			month: "long",
			day: "numeric",
			year: "numeric"
		}
	},
	time: {
		short: {
			hour: "numeric",
			minute: "numeric"
		},
		medium: {
			hour: "numeric",
			minute: "numeric",
			second: "numeric"
		},
		long: {
			hour: "numeric",
			minute: "numeric",
			second: "numeric",
			timeZoneName: "short"
		},
		full: {
			hour: "numeric",
			minute: "numeric",
			second: "numeric",
			timeZoneName: "short"
		}
	}
};
function un({ locale: e, id: t }) {
	console.warn(`[svelte-i18n] The message "${t}" was not found in "${U(e).join("\", \"")}".${z(W()) ? "\n\nNote: there are at least one loader still registered to this locale that wasn't executed." : ""}`);
}
var V = {
	fallbackLocale: null,
	loadingDelay: 200,
	formats: ln,
	warnOnMissingMessages: !0,
	handleMissingMessage: void 0,
	ignoreTag: !0
};
function H() {
	return V;
}
function dn(e) {
	let t = e, { formats: n } = t, r = cn(t, ["formats"]), i = e.fallbackLocale;
	if (e.initialLocale) try {
		Vt.resolveLocale(e.initialLocale) && (i = e.initialLocale);
	} catch {
		console.warn(`[svelte-i18n] The initial locale "${e.initialLocale}" is not a valid locale.`);
	}
	return r.warnOnMissingMessages && (delete r.warnOnMissingMessages, r.handleMissingMessage == null ? r.handleMissingMessage = un : console.warn("[svelte-i18n] The \"warnOnMissingMessages\" option is deprecated. Please use the \"handleMissingMessage\" option instead.")), Object.assign(V, r, { initialLocale: i }), n && ("number" in n && Object.assign(V.formats.number, n.number), "date" in n && Object.assign(V.formats.date, n.date), "time" in n && Object.assign(V.formats.time, n.time)), G.set(i);
}
var fn = v(!1), pn = Object.defineProperty, mn = Object.defineProperties, hn = Object.getOwnPropertyDescriptors, gn = Object.getOwnPropertySymbols, _n = Object.prototype.hasOwnProperty, vn = Object.prototype.propertyIsEnumerable, yn = (e, t, n) => t in e ? pn(e, t, {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: n
}) : e[t] = n, bn = (e, t) => {
	for (var n in t ||= {}) _n.call(t, n) && yn(e, n, t[n]);
	if (gn) for (var n of gn(t)) vn.call(t, n) && yn(e, n, t[n]);
	return e;
}, xn = (e, t) => mn(e, hn(t)), Sn, Cn = v(null);
function wn(e) {
	return e.split("-").map((e, t, n) => n.slice(0, t + 1).join("-")).reverse();
}
function U(e, t = H().fallbackLocale) {
	let n = wn(e);
	return t ? [.../* @__PURE__ */ new Set([...n, ...wn(t)])] : n;
}
function W() {
	return Sn ?? void 0;
}
Cn.subscribe((e) => {
	Sn = e ?? void 0, typeof window < "u" && e != null && document.documentElement.setAttribute("lang", e);
});
var G = xn(bn({}, Cn), { set: (e) => {
	if (e && Xt(e) && z(e)) {
		let { loadingDelay: t } = H(), n;
		return typeof window < "u" && W() != null && t ? n = window.setTimeout(() => fn.set(!0), t) : fn.set(!0), nn(e).then(() => {
			Cn.set(e);
		}).finally(() => {
			clearTimeout(n), fn.set(!1);
		});
	}
	return Cn.set(e);
} }), Tn = () => typeof window > "u" ? null : window.navigator.language || window.navigator.languages[0], En = (e) => {
	let t = /* @__PURE__ */ Object.create(null);
	return (n) => {
		let r = JSON.stringify(n);
		return r in t ? t[r] : t[r] = e(n);
	};
}, Dn = Object.defineProperty, On = Object.getOwnPropertySymbols, kn = Object.prototype.hasOwnProperty, An = Object.prototype.propertyIsEnumerable, jn = (e, t, n) => t in e ? Dn(e, t, {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: n
}) : e[t] = n, Mn = (e, t) => {
	for (var n in t ||= {}) kn.call(t, n) && jn(e, n, t[n]);
	if (On) for (var n of On(t)) An.call(t, n) && jn(e, n, t[n]);
	return e;
}, K = (e, t) => {
	var n = {};
	for (var r in e) kn.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
	if (e != null && On) for (var r of On(e)) t.indexOf(r) < 0 && An.call(e, r) && (n[r] = e[r]);
	return n;
}, q = (e, t) => {
	let { formats: n } = H();
	if (e in n && t in n[e]) return n[e][t];
	throw Error(`[svelte-i18n] Unknown "${t}" ${e} format.`);
}, Nn = En((e) => {
	var t = e, { locale: n, format: r } = t, i = K(t, ["locale", "format"]);
	if (n == null) throw Error("[svelte-i18n] A \"locale\" must be set to format numbers");
	return r && (i = q("number", r)), new Intl.NumberFormat(n, i);
}), Pn = En((e) => {
	var t = e, { locale: n, format: r } = t, i = K(t, ["locale", "format"]);
	if (n == null) throw Error("[svelte-i18n] A \"locale\" must be set to format dates");
	return r ? i = q("date", r) : Object.keys(i).length === 0 && (i = q("date", "short")), new Intl.DateTimeFormat(n, i);
}), Fn = En((e) => {
	var t = e, { locale: n, format: r } = t, i = K(t, ["locale", "format"]);
	if (n == null) throw Error("[svelte-i18n] A \"locale\" must be set to format time values");
	return r ? i = q("time", r) : Object.keys(i).length === 0 && (i = q("time", "short")), new Intl.DateTimeFormat(n, i);
}), In = (e = {}) => {
	var t = e, { locale: n = W() } = t, r = K(t, ["locale"]);
	return Nn(Mn({ locale: n }, r));
}, Ln = (e = {}) => {
	var t = e, { locale: n = W() } = t, r = K(t, ["locale"]);
	return Pn(Mn({ locale: n }, r));
}, Rn = (e = {}) => {
	var t = e, { locale: n = W() } = t, r = K(t, ["locale"]);
	return Fn(Mn({ locale: n }, r));
}, zn = En((e, t = W()) => new Vt(e, t, H().formats, { ignoreTag: H().ignoreTag })), Bn = (e, t = {}) => {
	var n;
	let r = t;
	typeof e == "object" && (r = e, e = r.id);
	let { values: i, locale: a = W(), default: o } = r;
	if (a == null) throw Error("[svelte-i18n] Cannot format a message without first setting the initial locale.");
	let s = Gt(e, a);
	if (!s) s = (n = H()).handleMissingMessage?.call(n, {
		locale: a,
		id: e,
		defaultValue: o
	}) ?? o ?? e;
	else if (typeof s != "string") return console.warn(`[svelte-i18n] Message with id "${e}" must be of type "string", found: "${typeof s}". Gettin its value through the "$format" method is deprecated; use the "json" method instead.`), s;
	if (!i) return s;
	let c = s;
	try {
		c = zn(s, a).format(i);
	} catch (t) {
		t instanceof Error && console.warn(`[svelte-i18n] Message "${e}" has syntax error:`, t.message);
	}
	return c;
}, Vn = (e, t) => Rn(t).format(e), Hn = (e, t) => Ln(t).format(e), Un = (e, t) => In(t).format(e), Wn = (e, t = W()) => Gt(e, t), Gn = g([G, I], () => Bn);
g([G], () => Vn), g([G], () => Hn), g([G], () => Un);
var Kn = g([G, I], () => Wn);
function qn(e) {
	return nn(e || W() || H().initialLocale);
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte-toolbelt/dist/utils/is.js
function Jn(e) {
	return typeof e == "function";
}
function J(e) {
	return typeof e == "object" && !!e;
}
var Yn = [
	"string",
	"number",
	"bigint",
	"boolean"
];
function Xn(e) {
	return e == null || Yn.includes(typeof e) ? !0 : Array.isArray(e) ? e.every((e) => Xn(e)) : typeof e == "object" && Object.getPrototypeOf(e) === Object.prototype;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte-toolbelt/dist/box/box-extras.svelte.js
var Y = Symbol("box"), X = Symbol("is-writable");
function Zn(e, t) {
	let n = h(e);
	return t ? {
		[Y]: !0,
		[X]: !0,
		get current() {
			return D(n);
		},
		set current(e) {
			t(e);
		}
	} : {
		[Y]: !0,
		get current() {
			return e();
		}
	};
}
function Z(e) {
	return J(e) && Y in e;
}
function Qn(e) {
	return Z(e) && X in e;
}
function $n(e) {
	return Z(e) ? e : Jn(e) ? Zn(e) : nr(e);
}
function er(e) {
	return Object.entries(e).reduce((e, [t, n]) => Z(n) ? (Qn(n) ? Object.defineProperty(e, t, {
		get() {
			return n.current;
		},
		set(e) {
			n.current = e;
		}
	}) : Object.defineProperty(e, t, { get() {
		return n.current;
	} }), e) : Object.assign(e, { [t]: n }), {});
}
function tr(e) {
	return Qn(e) ? {
		[Y]: !0,
		get current() {
			return e.current;
		}
	} : e;
}
function nr(e) {
	let t = m(se(e));
	return {
		[Y]: !0,
		[X]: !0,
		get current() {
			return D(t);
		},
		set current(e) {
			b(t, e, !0);
		}
	};
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte-toolbelt/dist/utils/compose-handlers.js
function rr(...e) {
	return function(t) {
		for (let n of e) if (n) {
			if (t.defaultPrevented) return;
			typeof n == "function" ? n.call(this, t) : n.current?.call(this, t);
		}
	};
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/inline-style-parser/esm/index.mjs
var ir = /\/\*[^*]*\*+([^/*][^*]*\*+)*\//g, ar = /\n/g, or = /^\s*/, sr = /^(\*?[-#/*\\\w]+(\[[0-9a-z_-]+\])?)\s*/, cr = /^:\s*/, lr = /^((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^)]*?\)|[^};])+)/, ur = /^[;\s]*/, dr = /^\s+|\s+$/g, fr = "\n", pr = "/", mr = "*", Q = "", hr = "comment", gr = "declaration";
function _r(e, t) {
	if (typeof e != "string") throw TypeError("First argument must be a string");
	if (!e) return [];
	t ||= {};
	var n = 1, r = 1;
	function i(e) {
		var t = e.match(ar);
		t && (n += t.length);
		var i = e.lastIndexOf(fr);
		r = ~i ? e.length - i : r + e.length;
	}
	function a() {
		var e = {
			line: n,
			column: r
		};
		return function(t) {
			return t.position = new o(e), l(), t;
		};
	}
	function o(e) {
		this.start = e, this.end = {
			line: n,
			column: r
		}, this.source = t.source;
	}
	o.prototype.content = e;
	function s(i) {
		var a = /* @__PURE__ */ Error(t.source + ":" + n + ":" + r + ": " + i);
		if (a.reason = i, a.filename = t.source, a.line = n, a.column = r, a.source = e, !t.silent) throw a;
	}
	function c(t) {
		var n = t.exec(e);
		if (n) {
			var r = n[0];
			return i(r), e = e.slice(r.length), n;
		}
	}
	function l() {
		c(or);
	}
	function u(e) {
		var t;
		for (e ||= []; t = d();) t !== !1 && e.push(t);
		return e;
	}
	function d() {
		var t = a();
		if (pr == e.charAt(0) && mr == e.charAt(1)) {
			for (var n = 2; Q != e.charAt(n) && (mr != e.charAt(n) || pr != e.charAt(n + 1));) ++n;
			if (n += 2, Q === e.charAt(n - 1)) return s("End of comment missing");
			var o = e.slice(2, n - 2);
			return r += 2, i(o), e = e.slice(n), r += 2, t({
				type: hr,
				comment: o
			});
		}
	}
	function f() {
		var e = a(), t = c(sr);
		if (t) {
			if (d(), !c(cr)) return s("property missing ':'");
			var n = c(lr), r = e({
				type: gr,
				property: vr(t[0].replace(ir, Q)),
				value: n ? vr(n[0].replace(ir, Q)) : Q
			});
			return c(ur), r;
		}
	}
	function p() {
		var e = [];
		u(e);
		for (var t; t = f();) t !== !1 && (e.push(t), u(e));
		return e;
	}
	return l(), p();
}
function vr(e) {
	return e ? e.replace(dr, Q) : Q;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/style-to-object/esm/index.mjs
function yr(e, t) {
	let n = null;
	if (!e || typeof e != "string") return n;
	let r = _r(e), i = typeof t == "function";
	return r.forEach((e) => {
		if (e.type !== "declaration") return;
		let { property: r, value: a } = e;
		i ? t(r, a, e) : a && (n ||= {}, n[r] = a);
	}), n;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte-toolbelt/dist/utils/strings.js
var br = /\d/, xr = [
	"-",
	"_",
	"/",
	"."
];
function Sr(e = "") {
	if (!br.test(e)) return e !== e.toLowerCase();
}
function Cr(e) {
	let t = [], n = "", r, i;
	for (let a of e) {
		let e = xr.includes(a);
		if (e === !0) {
			t.push(n), n = "", r = void 0;
			continue;
		}
		let o = Sr(a);
		if (i === !1) {
			if (r === !1 && o === !0) {
				t.push(n), n = a, r = o;
				continue;
			}
			if (r === !0 && o === !1 && n.length > 1) {
				let e = n.at(-1);
				t.push(n.slice(0, Math.max(0, n.length - 1))), n = e + a, r = o;
				continue;
			}
		}
		n += a, r = o, i = e;
	}
	return t.push(n), t;
}
function wr(e) {
	return e ? Cr(e).map((e) => Er(e)).join("") : "";
}
function Tr(e) {
	return Dr(wr(e || ""));
}
function Er(e) {
	return e ? e[0].toUpperCase() + e.slice(1) : "";
}
function Dr(e) {
	return e ? e[0].toLowerCase() + e.slice(1) : "";
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte-toolbelt/dist/utils/css-to-style-obj.js
function $(e) {
	if (!e) return {};
	let t = {};
	function n(e, n) {
		e.startsWith("-moz-") || e.startsWith("-webkit-") || e.startsWith("-ms-") || e.startsWith("-o-") ? t[wr(e)] = n : e.startsWith("--") ? t[e] = n : t[Tr(e)] = n;
	}
	return yr(e, n), t;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte-toolbelt/dist/utils/execute-callbacks.js
function Or(...e) {
	return (...t) => {
		for (let n of e) typeof n == "function" && n(...t);
	};
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte-toolbelt/dist/utils/style-to-css.js
function kr(e, t) {
	let n = RegExp(e, "g");
	return (e) => {
		if (typeof e != "string") throw TypeError(`expected an argument of type string, but got ${typeof e}`);
		return e.match(n) ? e.replace(n, t) : e;
	};
}
var Ar = kr(/[A-Z]/, (e) => `-${e.toLowerCase()}`);
function jr(e) {
	if (!e || typeof e != "object" || Array.isArray(e)) throw TypeError(`expected an argument of type object, but got ${typeof e}`);
	return Object.keys(e).map((t) => `${Ar(t)}: ${e[t]};`).join("\n");
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte-toolbelt/dist/utils/style.js
function Mr(e = {}) {
	return jr(e).replace("\n", " ");
}
var Nr = new Set(/* @__PURE__ */ "onabort.onanimationcancel.onanimationend.onanimationiteration.onanimationstart.onauxclick.onbeforeinput.onbeforetoggle.onblur.oncancel.oncanplay.oncanplaythrough.onchange.onclick.onclose.oncompositionend.oncompositionstart.oncompositionupdate.oncontextlost.oncontextmenu.oncontextrestored.oncopy.oncuechange.oncut.ondblclick.ondrag.ondragend.ondragenter.ondragleave.ondragover.ondragstart.ondrop.ondurationchange.onemptied.onended.onerror.onfocus.onfocusin.onfocusout.onformdata.ongotpointercapture.oninput.oninvalid.onkeydown.onkeypress.onkeyup.onload.onloadeddata.onloadedmetadata.onloadstart.onlostpointercapture.onmousedown.onmouseenter.onmouseleave.onmousemove.onmouseout.onmouseover.onmouseup.onpaste.onpause.onplay.onplaying.onpointercancel.onpointerdown.onpointerenter.onpointerleave.onpointermove.onpointerout.onpointerover.onpointerup.onprogress.onratechange.onreset.onresize.onscroll.onscrollend.onsecuritypolicyviolation.onseeked.onseeking.onselect.onselectionchange.onselectstart.onslotchange.onstalled.onsubmit.onsuspend.ontimeupdate.ontoggle.ontouchcancel.ontouchend.ontouchmove.ontouchstart.ontransitioncancel.ontransitionend.ontransitionrun.ontransitionstart.onvolumechange.onwaiting.onwebkitanimationend.onwebkitanimationiteration.onwebkitanimationstart.onwebkittransitionend.onwheel".split("."));
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte-toolbelt/dist/utils/merge-props.js
function Pr(e) {
	return Nr.has(e);
}
function Fr(...e) {
	let t = { ...e[0] };
	for (let n = 1; n < e.length; n++) {
		let r = e[n];
		if (r) {
			for (let e of Object.keys(r)) {
				let n = t[e], a = r[e], o = typeof n == "function", s = typeof a == "function";
				if (o && typeof s && Pr(e)) t[e] = rr(n, a);
				else if (o && s) t[e] = Or(n, a);
				else if (e === "class") {
					let r = Xn(n), o = Xn(a);
					r && o ? t[e] = i(n, a) : r ? t[e] = i(n) : o && (t[e] = i(a));
				} else if (e === "style") {
					let r = typeof n == "object", i = typeof a == "object", o = typeof n == "string", s = typeof a == "string";
					if (r && i) t[e] = {
						...n,
						...a
					};
					else if (r && s) {
						let r = $(a);
						t[e] = {
							...n,
							...r
						};
					} else if (o && i) t[e] = {
						...$(n),
						...a
					};
					else if (o && s) {
						let r = $(n), i = $(a);
						t[e] = {
							...r,
							...i
						};
					} else r ? t[e] = n : i ? t[e] = a : o ? t[e] = n : s && (t[e] = a);
				} else t[e] = a === void 0 ? n : a;
			}
			for (let e of Object.getOwnPropertySymbols(r)) {
				let n = t[e], i = r[e];
				t[e] = i === void 0 ? n : i;
			}
		}
	}
	return typeof t.style == "object" && (t.style = Mr(t.style).replaceAll("\n", " ")), t.hidden === !1 && (t.hidden = void 0, delete t.hidden), t.disabled === !1 && (t.disabled = void 0, delete t.disabled), t;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/runed/dist/internal/configurable-globals.js
var Ir = typeof window < "u" ? window : void 0;
typeof window < "u" && window.document, typeof window < "u" && window.navigator, typeof window < "u" && window.location;
// D:/ドキュメント/GitHub/ehagaki/node_modules/runed/dist/internal/utils/dom.js
function Lr(e) {
	let t = e.activeElement;
	for (; t?.shadowRoot;) {
		let e = t.shadowRoot.activeElement;
		if (e === t) break;
		t = e;
	}
	return t;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/reactivity/map.js
var Rr = class extends Map {
	#e = /* @__PURE__ */ new Map();
	#t = /* @__PURE__ */ m(0);
	#n = /* @__PURE__ */ m(0);
	#r = x || -1;
	constructor(e) {
		if (super(), e) {
			for (var [t, n] of e) super.set(t, n);
			this.#n.v = super.size;
		}
	}
	#i(e) {
		return x === this.#r ? /* @__PURE__ */ m(e) : te(e);
	}
	has(e) {
		var t = this.#e, n = t.get(e);
		if (n === void 0) {
			if (super.has(e)) n = this.#i(0), t.set(e, n);
			else return D(this.#t), !1;
		}
		return D(n), !0;
	}
	forEach(e, t) {
		this.#a(), super.forEach(e, t);
	}
	get(e) {
		var t = this.#e, n = t.get(e);
		if (n === void 0) {
			if (super.has(e)) n = this.#i(0), t.set(e, n);
			else {
				D(this.#t);
				return;
			}
		}
		return D(n), super.get(e);
	}
	getOrInsert(e, t) {
		return super.has(e) || this.set(e, t), this.get(e);
	}
	getOrInsertComputed(e, t) {
		return super.has(e) || this.set(e, t(e)), this.get(e);
	}
	set(e, t) {
		var n = this.#e, r = n.get(e), i = super.get(e), a = super.set(e, t), o = this.#t;
		if (r === void 0) r = this.#i(0), n.set(e, r), b(this.#n, super.size), S(o);
		else if (i !== t) {
			S(r);
			var s = o.reactions === null ? null : new Set(o.reactions);
			s !== null && r.reactions?.every((e) => s.has(e)) || S(o);
		}
		return a;
	}
	delete(e) {
		var t = this.#e, n = t.get(e), r = super.delete(e);
		return n !== void 0 && (t.delete(e), b(n, -1)), r && (b(this.#n, super.size), S(this.#t)), r;
	}
	clear() {
		if (super.size !== 0) {
			super.clear();
			var e = this.#e;
			b(this.#n, 0);
			for (var t of e.values()) b(t, -1);
			S(this.#t), e.clear();
		}
	}
	#a() {
		D(this.#t);
		var e = this.#e;
		if (this.#n.v !== e.size) {
			for (var t of super.keys()) if (!e.has(t)) {
				var n = this.#i(0);
				e.set(t, n);
			}
		}
		for ([, n] of this.#e) D(n);
	}
	keys() {
		return D(this.#t), super.keys();
	}
	values() {
		return this.#a(), super.values();
	}
	entries() {
		return this.#a(), super.entries();
	}
	[Symbol.iterator]() {
		return this.entries();
	}
	get size() {
		return D(this.#n), super.size;
	}
};
new class {
	#e;
	#t;
	constructor(e = {}) {
		let { window: t = Ir, document: n = t?.document } = e;
		t !== void 0 && (this.#e = n, this.#t = s((e) => {
			let n = l(t, "focusin", e), r = l(t, "focusout", e);
			return () => {
				n(), r();
			};
		}));
	}
	get current() {
		return this.#t?.(), this.#e ? Lr(this.#e) : null;
	}
}();
// D:/ドキュメント/GitHub/ehagaki/node_modules/runed/dist/internal/utils/is.js
function zr(e) {
	return typeof e == "function";
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/runed/dist/utilities/extract/extract.svelte.js
function Br(e, t) {
	if (zr(e)) {
		let n = e();
		return n === void 0 ? t : n;
	}
	return e === void 0 ? t : e;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/runed/dist/utilities/context/context.js
var Vr = class {
	#e;
	#t;
	constructor(e) {
		this.#e = e, this.#t = Symbol(e);
	}
	get key() {
		return this.#t;
	}
	exists() {
		return r(this.#t);
	}
	get() {
		let e = d(this.#t);
		if (e === void 0) throw Error(`Context "${this.#e}" not found`);
		return e;
	}
	getOr(e) {
		let t = d(this.#t);
		return t === void 0 ? e : t;
	}
	set(e) {
		return a(this.#t, e);
	}
};
// D:/ドキュメント/GitHub/ehagaki/node_modules/runed/dist/utilities/use-debounce/use-debounce.svelte.js
function Hr(e, t) {
	let n = m(null), r = h(() => Br(t, 250));
	function i(...t) {
		if (D(n)) D(n).timeout && clearTimeout(D(n).timeout);
		else {
			let e, t, r = new Promise((n, r) => {
				e = n, t = r;
			});
			b(n, {
				timeout: null,
				runner: null,
				promise: r,
				resolve: e,
				reject: t
			}, !0);
		}
		return D(n).runner = async () => {
			if (!D(n)) return;
			let r = D(n);
			b(n, null);
			try {
				r.resolve(await e.apply(this, t));
			} catch (e) {
				r.reject(e);
			}
		}, D(n).timeout = setTimeout(D(n).runner, D(r)), D(n).promise;
	}
	return i.cancel = async () => {
		(!D(n) || D(n).timeout === null) && (await new Promise((e) => setTimeout(e, 0)), !D(n) || D(n).timeout === null) || (clearTimeout(D(n).timeout), D(n).reject("Cancelled"), b(n, null));
	}, i.runScheduledNow = async () => {
		(!D(n) || !D(n).timeout) && (await new Promise((e) => setTimeout(e, 0)), !D(n) || !D(n).timeout) || (clearTimeout(D(n).timeout), D(n).timeout = null, await D(n).runner?.());
	}, Object.defineProperty(i, "pending", {
		enumerable: !0,
		get() {
			return !!D(n)?.timeout;
		}
	}), i;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/runed/dist/utilities/watch/watch.svelte.js
function Ur(e, t) {
	switch (e) {
		case "post":
			E(t);
			break;
		case "pre": _(t);
	}
}
function Wr(e, t, n, r = {}) {
	let { lazy: i = !1 } = r, a = !i, o = Array.isArray(e) ? [] : void 0;
	Ur(t, () => {
		let t = Array.isArray(e) ? e.map((e) => e()) : e();
		if (!a) {
			a = !0, o = t;
			return;
		}
		let r = T(() => n(t, o));
		return o = t, r;
	});
}
function Gr(e, t, n) {
	Wr(e, "post", t, n);
}
function Kr(e, t, n) {
	Wr(e, "pre", t, n);
}
Gr.pre = Kr;
// D:/ドキュメント/GitHub/ehagaki/node_modules/runed/dist/internal/utils/get.js
function qr(e) {
	return zr(e) ? e() : e;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/runed/dist/utilities/element-size/element-size.svelte.js
var Jr = class {
	#e = {
		width: 0,
		height: 0
	};
	#t = !1;
	#n;
	#r;
	#i;
	#a = h(() => (D(this.#s)?.(), this.getSize().width));
	#o = h(() => (D(this.#s)?.(), this.getSize().height));
	#s = h(() => {
		let e = qr(this.#r);
		if (e) return s((t) => {
			if (!this.#i) return;
			let n = new this.#i.ResizeObserver((e) => {
				this.#t = !0;
				for (let t of e) {
					let e = this.#n.box === "content-box" ? t.contentBoxSize : t.borderBoxSize, n = Array.isArray(e) ? e : [e];
					this.#e.width = n.reduce((e, t) => Math.max(e, t.inlineSize), 0), this.#e.height = n.reduce((e, t) => Math.max(e, t.blockSize), 0);
				}
				t();
			});
			return n.observe(e), () => {
				this.#t = !1, n.disconnect();
			};
		});
	});
	constructor(e, t = { box: "border-box" }) {
		this.#i = t.window ?? Ir, this.#n = t, this.#r = e, this.#e = {
			width: 0,
			height: 0
		};
	}
	calculateSize() {
		let e = qr(this.#r);
		if (!e || !this.#i) return;
		let t = e.offsetWidth, n = e.offsetHeight;
		if (this.#n.box === "border-box") return {
			width: t,
			height: n
		};
		let r = this.#i.getComputedStyle(e), i = parseFloat(r.paddingLeft) + parseFloat(r.paddingRight), a = parseFloat(r.paddingTop) + parseFloat(r.paddingBottom), o = parseFloat(r.borderLeftWidth) + parseFloat(r.borderRightWidth), s = parseFloat(r.borderTopWidth) + parseFloat(r.borderBottomWidth);
		return {
			width: t - i - o,
			height: n - a - s
		};
	}
	getSize() {
		return this.#t ? this.#e : this.calculateSize() ?? this.#e;
	}
	get current() {
		return D(this.#s)?.(), this.getSize();
	}
	get width() {
		return D(this.#a);
	}
	get height() {
		return D(this.#o);
	}
}, Yr = class {
	#e = m(!1);
	constructor() {
		E(() => (T(() => b(this.#e, !0)), () => {
			b(this.#e, !1);
		}));
	}
	get current() {
		return D(this.#e);
	}
};
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte-toolbelt/dist/utils/on-destroy-effect.svelte.js
function Xr(e) {
	E(() => () => {
		e();
	});
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte-toolbelt/dist/utils/after-tick.js
function Zr(e) {
	ae().then(e);
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte-toolbelt/dist/utils/dom.js
var Qr = 1, $r = 9, ei = 11;
function ti(e) {
	return J(e) && e.nodeType === Qr && typeof e.nodeName == "string";
}
function ni(e) {
	return J(e) && e.nodeType === $r;
}
function ri(e) {
	return J(e) && e.constructor?.name === "VisualViewport";
}
function ii(e) {
	return J(e) && e.nodeType !== void 0;
}
function ai(e) {
	return ii(e) && e.nodeType === ei && "host" in e;
}
function oi(e, t) {
	if (!e || !t || !ti(e) || !ti(t)) return !1;
	let n = t.getRootNode?.();
	if (e === t || e.contains(t)) return !0;
	if (n && ai(n)) {
		let n = t;
		for (; n;) {
			if (e === n) return !0;
			n = n.parentNode || n.host;
		}
	}
	return !1;
}
function si(e) {
	return ni(e) ? e : ri(e) ? e.document : e?.ownerDocument ?? document;
}
function ci(e) {
	return ai(e) ? ci(e.host) : ni(e) ? e.defaultView ?? window : ti(e) ? e.ownerDocument?.defaultView ?? window : window;
}
function li(e) {
	let t = e.activeElement;
	for (; t?.shadowRoot;) {
		let e = t.shadowRoot.activeElement;
		if (e === t) break;
		t = e;
	}
	return t;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte-toolbelt/dist/utils/dom-context.svelte.js
var ui = class {
	element;
	#e = h(() => this.element.current ? this.element.current.getRootNode() ?? document : document);
	get root() {
		return D(this.#e);
	}
	set root(e) {
		b(this.#e, e);
	}
	constructor(e) {
		this.element = typeof e == "function" ? Zn(e) : e;
	}
	getDocument = () => si(this.root);
	getWindow = () => this.getDocument().defaultView ?? window;
	getActiveElement = () => li(this.root);
	isActiveElement = (e) => e === this.getActiveElement();
	getElementById(e) {
		return this.root.getElementById(e);
	}
	querySelector = (e) => this.root ? this.root.querySelector(e) : null;
	querySelectorAll = (e) => this.root ? this.root.querySelectorAll(e) : [];
	setTimeout = (e, t) => this.getWindow().setTimeout(e, t);
	clearTimeout = (e) => this.getWindow().clearTimeout(e);
};
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte-toolbelt/dist/utils/attach-ref.js
function di(e, t) {
	return { [y()]: (n) => Z(e) ? (e.current = n, T(() => t?.(n)), () => {
		"isConnected" in n && n.isConnected || (e.current = null, t?.(null));
	}) : (e(n), T(() => t?.(n)), () => {
		"isConnected" in n && n.isConnected || (e(null), t?.(null));
	}) };
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/internal/attrs.js
function fi(e) {
	return e ? "true" : "false";
}
function pi(e) {
	return e ? "true" : void 0;
}
function mi(e) {
	return e ? "" : void 0;
}
function hi(e) {
	return e ? !0 : void 0;
}
function gi(e) {
	return e ? "open" : "closed";
}
function _i(e) {
	return e ? "checked" : "unchecked";
}
function vi(e) {
	return e === "starting" ? { "data-starting-style": "" } : e === "ending" ? { "data-ending-style": "" } : {};
}
function yi(e, t) {
	return t ? "mixed" : e ? "true" : "false";
}
var bi = class {
	#e;
	#t;
	attrs;
	constructor(e) {
		this.#e = e.getVariant ? e.getVariant() : null, this.#t = this.#e ? `data-${this.#e}-` : `data-${e.component}-`, this.getAttr = this.getAttr.bind(this), this.selector = this.selector.bind(this), this.attrs = Object.fromEntries(e.parts.map((e) => [e, this.getAttr(e)]));
	}
	getAttr(e, t) {
		return t ? `data-${t}-${e}` : `${this.#t}${e}`;
	}
	selector(e, t) {
		return `[${this.getAttr(e, t)}]`;
	}
};
function xi(e) {
	let t = new bi(e);
	return {
		...t.attrs,
		selector: t.selector,
		getAttr: t.getAttr
	};
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/internal/kbd-constants.js
var Si = "ArrowDown", Ci = "ArrowLeft", wi = "ArrowRight", Ti = "ArrowUp", Ei = "Backspace", Di = "Enter", Oi = "Escape", ki = "Home", Ai = "PageDown", ji = "PageUp", Mi = typeof document < "u", Ni = Pi();
function Pi() {
	return Mi && window?.navigator?.userAgent && (/iP(ad|hone|od)/.test(window.navigator.userAgent) || window?.navigator?.maxTouchPoints > 2 && /iPad|Macintosh/.test(window?.navigator.userAgent));
}
function Fi(e) {
	return e instanceof HTMLElement;
}
function Ii(e) {
	return e instanceof Element;
}
function Li(e) {
	return e instanceof Element || e instanceof SVGElement;
}
function Ri(e) {
	return !Number.isNaN(Number(e)) && !Number.isNaN(Number.parseFloat(e));
}
function zi(e) {
	return e === null;
}
function Bi(e) {
	return e?.matches(":disabled") ?? !1;
}
function Vi(e) {
	return e.pointerType === "touch";
}
function Hi(e) {
	return e.matches(":focus-visible");
}
function Ui(e) {
	return e !== null;
}
function Wi(e) {
	return e instanceof HTMLInputElement && "select" in e;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/internal/animations-complete.js
var Gi = class {
	#e;
	#t = null;
	#n = null;
	#r = 0;
	constructor(e) {
		this.#e = e, Xr(() => this.#i());
	}
	#i() {
		this.#t !== null && (window.cancelAnimationFrame(this.#t), this.#t = null), this.#n?.disconnect(), this.#n = null, this.#r++;
	}
	run(e) {
		this.#i();
		let t = this.#r, n = () => {
			t === this.#r && this.#a(e);
		}, r = () => {
			if (t !== this.#r) return;
			let i = this.#e.ref.current;
			if (!i) return;
			if (typeof i.getAnimations != "function") {
				this.#a(e);
				return;
			}
			let a = i.getAnimations();
			a.length === 0 ? n() : Promise.all(a.map((e) => e.finished)).then(() => {
				n();
			}).catch(() => {
				t === this.#r && (i.getAnimations().some((e) => e.pending || e.playState !== "finished") ? r() : n());
			});
		}, i = () => {
			this.#t = window.requestAnimationFrame(() => {
				this.#t = null, r();
			});
		};
		this.#e.afterTick.current ? this.#t = window.requestAnimationFrame(() => {
			this.#t = null;
			let e = "data-starting-style", n = this.#e.ref.current;
			n && (n.hasAttribute(e) ? (this.#n = new MutationObserver(() => {
				t === this.#r && (n.hasAttribute(e) || (this.#n?.disconnect(), this.#n = null, i()));
			}), this.#n.observe(n, {
				attributes: !0,
				attributeFilter: [e]
			})) : i());
		}) : i();
	}
	#a(e) {
		let t = this.#r, n = () => {
			t === this.#r && e();
		};
		this.#e.afterTick.current ? Zr(n) : n();
	}
};
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/internal/noop.js
function Ki() {}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/internal/create-id.js
function qi(e, t) {
	return t === void 0 ? `bits-${e}` : `bits-${e}-${t}`;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/internal/dom.js
function Ji(e) {
	if (!e) return null;
	for (let t of e.childNodes) if (t.nodeType !== Node.COMMENT_NODE) return t;
	return null;
}
function Yi(e, t) {
	let { clientX: n, clientY: r } = e, i = t.getBoundingClientRect();
	return n < i.left || n > i.right || r < i.top || r > i.bottom;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/internal/use-id.js
globalThis.bitsIdCounter ??= { current: 0 };
function Xi(e = "bits") {
	return globalThis.bitsIdCounter.current++, `${e}-${globalThis.bitsIdCounter.current}`;
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/utils/htmlSanitizer.ts
function Zi(e) {
	return e.split("<wbr>").map((e) => e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")).join("<wbr>");
}
// D:/ドキュメント/GitHub/ehagaki/src/components/LoadingPlaceholder.svelte
var Qi = o("<div class=\"loader-container svelte-1yk1wr7\"><div class=\"square svelte-1yk1wr7\"></div> <div class=\"square svelte-1yk1wr7\"></div> <div class=\"square svelte-1yk1wr7\"></div> <div class=\"square svelte-1yk1wr7\"></div> <div class=\"square svelte-1yk1wr7\"></div></div>"), $i = o("<span class=\"inline-spinner svelte-1yk1wr7\" aria-hidden=\"true\"></span>"), ea = o("<span></span>"), ta = o("<div><!> <!> <!></div>"), na = {
	hash: "svelte-1yk1wr7",
	code: "button:disabled.loading {opacity:1;}.loading-placeholder.svelte-1yk1wr7 {display:flex;flex-wrap:wrap;align-items:center;justify-content:center;column-gap:4px;position:relative;width:100%;}.placeholder-text.svelte-1yk1wr7 {padding:0 4px;color:var(--text);opacity:0.8;font-size:0.875rem;font-weight:500;}.primary .loading-placeholder .placeholder-text {color:whitesmoke;opacity:0.9;font-size:inherit;}.loading-text.svelte-1yk1wr7 {\n        animation: svelte-1yk1wr7-pulse-text 1.5s ease-in-out infinite;}\n\n    @keyframes svelte-1yk1wr7-pulse-text {\n        0%,\n        100% {\n            opacity: 0.9;\n        }\n        50% {\n            opacity: 0.6;\n        }\n    }\n    /* shimmer animation for button loading (if needed) */.shimmer {position:absolute;top:0;left:-100%;width:100%;height:100%;background:linear-gradient(\n            90deg,\n            transparent,\n            rgba(255, 255, 255, 0.2),\n            transparent\n        );\n        animation: svelte-1yk1wr7-shimmer 1.5s infinite;pointer-events:none;}\n    @keyframes svelte-1yk1wr7-shimmer {\n        0% {\n            left: -100%;\n        }\n        100% {\n            left: 100%;\n        }\n    }\n    /* 正方形たちをまとめるコンテナ */.loader-container.svelte-1yk1wr7 {position:relative;width:var(--loader-size);height:var(--loader-size);}.inline-spinner.svelte-1yk1wr7 {--spinner-width: clamp(\n            3.5px,\n            calc(var(--loader-size) * 0.16),\n            6px\n        );--spinner-track-opacity: 0.12;--spinner-arc-opacity: 0.64;position:relative;display:block;width:var(--loader-size);height:var(--loader-size);flex:0 0 auto;color:currentColor;border-radius:50%;box-sizing:border-box;}.inline-spinner.svelte-1yk1wr7::before {content:\"\";position:absolute;inset:0;border-radius:inherit;border:var(--spinner-width) solid currentColor;opacity:var(--spinner-track-opacity);box-sizing:border-box;}.inline-spinner.svelte-1yk1wr7::after {content:\"\";position:absolute;inset:0;border-radius:inherit;background:conic-gradient(\n            from -80deg,\n            transparent 0deg,\n            transparent 210deg,\n            currentColor 300deg,\n            currentColor 360deg\n        );-webkit-mask:radial-gradient(\n            farthest-side,\n            transparent calc(100% - var(--spinner-width)),\n            #000 calc(100% - var(--spinner-width) + 0.5px)\n        );mask:radial-gradient(\n            farthest-side,\n            transparent calc(100% - var(--spinner-width)),\n            #000 calc(100% - var(--spinner-width) + 0.5px)\n        );opacity:var(--spinner-arc-opacity);\n        animation: svelte-1yk1wr7-inline-spinner-rotate\n            900ms\n            cubic-bezier(0.55, 0.15, 0.45, 0.85)\n            infinite;transform-origin:center;}:root.dark .ehagaki-app-root .inline-spinner.svelte-1yk1wr7,\n    :host(.dark) .ehagaki-app-root .inline-spinner.svelte-1yk1wr7 {--spinner-track-opacity: 0.14;--spinner-arc-opacity: 0.72;}.ehagaki-app-root :where(.primary, .danger) .inline-spinner.svelte-1yk1wr7 {--spinner-track-opacity: 0.18;--spinner-arc-opacity: 0.82;}.ehagaki-app-root :where(.secondary, .warning) .inline-spinner.svelte-1yk1wr7,\n    :root.light .ehagaki-app-root :where(.header) .inline-spinner.svelte-1yk1wr7,\n    :host(.light) .ehagaki-app-root :where(.header) .inline-spinner.svelte-1yk1wr7 {--spinner-track-opacity: 0.12;--spinner-arc-opacity: 0.64;}\n\n    @keyframes svelte-1yk1wr7-inline-spinner-rotate {\n        to {\n            transform: rotate(360deg);\n        }\n    }\n    /* 正方形の基本スタイル */.square.svelte-1yk1wr7 {position:absolute;top:25%;left:25%;border:none;border-radius:20%;opacity:1;background-color:var(--theme);\n        animation: svelte-1yk1wr7-compactFloatAndRotate 4s infinite ease-in-out;}.primary.loading .loader-container .square {background-color:whitesmoke;}\n\n    /* アニメーションの定義 */\n    @keyframes svelte-1yk1wr7-compactFloatAndRotate {\n        0% {\n            transform: translate(-25%, -25%) scale(1) rotate(0deg);\n        }\n        20% {\n            transform: translate(\n                    calc(var(--loader-size) * 0.3),\n                    calc(var(--loader-size) * 0.25)\n                )\n                scale(0.6) rotate(-170deg);\n        }\n        40% {\n            transform: translate(\n                    calc(var(--loader-size) * 0.2),\n                    calc(var(--loader-size) * -0.05)\n                )\n                scale(1.05) rotate(200deg);\n        }\n        60% {\n            transform: translate(\n                    calc(var(--loader-size) * -0.05),\n                    calc(var(--loader-size) * -0.1)\n                )\n                scale(0.9) rotate(-220deg);\n        }\n        80% {\n            transform: translate(0, calc(var(--loader-size) * 0.3)) scale(0.5)\n                rotate(0deg);\n        }\n        100% {\n            transform: translate(-25%, -25%) scale(1) rotate(360deg);\n        }\n    }\n    /* 各正方形のサイズとアニメーション開始タイミングを個別に設定 */.square.svelte-1yk1wr7:nth-child(1) {width:calc(var(--loader-size) * 0.2);height:calc(var(--loader-size) * 0.2);animation-delay:-4s;}.square.svelte-1yk1wr7:nth-child(2) {width:calc(var(--loader-size) * 0.3);height:calc(var(--loader-size) * 0.3);animation-delay:-3s;}.square.svelte-1yk1wr7:nth-child(3) {width:calc(var(--loader-size) * 0.35);height:calc(var(--loader-size) * 0.35);animation-delay:-1s;}.square.svelte-1yk1wr7:nth-child(4) {width:calc(var(--loader-size) * 0.45);height:calc(var(--loader-size) * 0.45);animation-delay:-2s;}\n\n    @media (prefers-reduced-motion: reduce) {.loading-text.svelte-1yk1wr7 {\n            animation: none;opacity:0.8;}.shimmer {\n            animation: none;left:0;}.square.svelte-1yk1wr7 {\n            animation: none;transform:translate(-25%, -25%) scale(1) rotate(0deg);}.inline-spinner.svelte-1yk1wr7::after {\n            animation: none;transform:rotate(35deg);}\n    }"
};
function ra(e, t) {
	f(t, !0), re(e, na);
	let r = () => ce(Gn, "$_", i), [i, a] = oe(), o = w(t, "text", 3, !1), s = w(t, "showLoader", 3, !1), l = w(t, "customClass", 3, ""), d = w(t, "state", 3, void 0), m = w(t, "loaderSize", 3, 40), g = w(t, "variant", 3, "loader"), _ = w(t, "ariaHidden", 3, !1), v = h(() => typeof o() == "string" ? o() : o() === !0 ? r()("loadingPlaceholder.loading") : ""), y = h(() => Zi(D(v))), te = h(() => d() ? d() === "loading" : s()), b = h(() => typeof m() == "number" ? `${m()}px` : m());
	var x = ta(), S = ie(x), ae = (e) => {
		var t = Qi();
		let r;
		C(() => r = n(t, "", r, { "--loader-size": D(b) })), p(e, t);
	};
	u(S, (e) => {
		D(te) && g() === "loader" && e(ae);
	});
	var se = ee(S, 2), T = (e) => {
		var t = $i();
		let r;
		C(() => r = n(t, "", r, { "--loader-size": D(b) })), p(e, t);
	};
	u(se, (e) => {
		D(te) && g() === "spinner" && e(T);
	});
	var E = ee(se, 2), fe = (e) => {
		var t = ea();
		let n;
		c(t, () => D(y), !0), ne(t), C(() => n = ue(t, 1, "placeholder-text svelte-1yk1wr7", null, n, { "loading-text": D(te) })), p(e, t);
	};
	u(E, (e) => {
		D(v) && e(fe);
	}), ne(x), C(() => {
		ue(x, 1, `loading-placeholder ${l() ?? ""}`, "svelte-1yk1wr7"), le(x, "aria-label", D(v)), le(x, "aria-hidden", _() ? "true" : void 0);
	}), p(e, x), de(), a();
}
export { Rr as $, ji as A, di as B, wi as C, Oi as D, Di as E, xi as F, ci as G, oi as H, yi as I, Yr as J, Zr as K, _i as L, fi as M, pi as N, ki as O, hi as P, Vr as Q, gi as R, Ci as S, Ei as T, li as U, ui as V, si as W, Gr as X, Jr as Y, Hr as Z, zi as _, dn as _t, Yi as a, er as at, Vi as b, Gi as c, Z as ct, Ii as d, nr as dt, Fr as et, Li as f, tr as ft, Ui as g, Tn as gt, Ni as h, G as ht, Ji as i, Y as it, mi as j, Ai as k, Mi as l, Qn as lt, Fi as m, Kn as mt, Zi as n, Or as nt, qi as o, $n as ot, Hi as p, Gn as pt, Xr as q, Xi as r, $ as rt, Ki as s, Zn as st, ra as t, Mr as tt, Bi as u, X as ut, Ri as v, rn as vt, Ti as w, Si as x, Wi as y, qn as yt, vi as z };
