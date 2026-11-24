import { i as e, t } from "./rolldown-runtime-CwxnZyOB.js";
import { B as n, Dt as r, E as i, Et as a, G as o, I as s, Nt as c, O as l, Ot as u, St as d, T as f, Tt as p, W as m, _t as h, at as g, b as _, c as v, ct as y, d as b, dt as ee, et as te, gt as x, ht as ne, j as re, lt as ie, mt as ae, nt as oe, o as se, ot as S, q as C, r as w, rt as T, s as ce, ut as le, vt as ue, wt as E, yt as D } from "./index-client-DEFG3Gqk.js";
import { l as de, o as O, t as k, u as fe } from "./tslib.es6-BgJxuhU8.js";
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/internal/disclose-version.js
typeof window < "u" && ((window.__svelte ??= {}).v ??= /* @__PURE__ */ new Set()).add("5");
// D:/ドキュメント/GitHub/ehagaki/node_modules/deepmerge/dist/cjs.js
var pe = /* @__PURE__ */ t(((e, t) => {
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
function me(e, t) {
	var n = t && t.cache ? t.cache : we, r = t && t.serializer ? t.serializer : Se;
	return (t && t.strategy ? t.strategy : ye)(e, {
		cache: n,
		serializer: r
	});
}
function he(e) {
	return e == null || typeof e == "number" || typeof e == "boolean";
}
function ge(e, t, n, r) {
	var i = he(r) ? r : n(r), a = t.get(i);
	return a === void 0 && (a = e.call(this, r), t.set(i, a)), a;
}
function _e(e, t, n) {
	var r = Array.prototype.slice.call(arguments, 3), i = n(r), a = t.get(i);
	return a === void 0 && (a = e.apply(this, r), t.set(i, a)), a;
}
function ve(e, t, n, r, i) {
	return n.bind(t, e, r, i);
}
function ye(e, t) {
	var n = e.length === 1 ? ge : _e;
	return ve(e, this, n, t.cache.create(), t.serializer);
}
function be(e, t) {
	return ve(e, this, _e, t.cache.create(), t.serializer);
}
function xe(e, t) {
	return ve(e, this, ge, t.cache.create(), t.serializer);
}
var Se = function() {
	return JSON.stringify(arguments);
}, Ce = function() {
	function e() {
		this.cache = Object.create(null);
	}
	return e.prototype.get = function(e) {
		return this.cache[e];
	}, e.prototype.set = function(e, t) {
		this.cache[e] = t;
	}, e;
}(), we = { create: function() {
	return new Ce();
} }, Te = {
	variadic: be,
	monadic: xe
}, A;
(function(e) {
	e[e.EXPECT_ARGUMENT_CLOSING_BRACE = 1] = "EXPECT_ARGUMENT_CLOSING_BRACE", e[e.EMPTY_ARGUMENT = 2] = "EMPTY_ARGUMENT", e[e.MALFORMED_ARGUMENT = 3] = "MALFORMED_ARGUMENT", e[e.EXPECT_ARGUMENT_TYPE = 4] = "EXPECT_ARGUMENT_TYPE", e[e.INVALID_ARGUMENT_TYPE = 5] = "INVALID_ARGUMENT_TYPE", e[e.EXPECT_ARGUMENT_STYLE = 6] = "EXPECT_ARGUMENT_STYLE", e[e.INVALID_NUMBER_SKELETON = 7] = "INVALID_NUMBER_SKELETON", e[e.INVALID_DATE_TIME_SKELETON = 8] = "INVALID_DATE_TIME_SKELETON", e[e.EXPECT_NUMBER_SKELETON = 9] = "EXPECT_NUMBER_SKELETON", e[e.EXPECT_DATE_TIME_SKELETON = 10] = "EXPECT_DATE_TIME_SKELETON", e[e.UNCLOSED_QUOTE_IN_ARGUMENT_STYLE = 11] = "UNCLOSED_QUOTE_IN_ARGUMENT_STYLE", e[e.EXPECT_SELECT_ARGUMENT_OPTIONS = 12] = "EXPECT_SELECT_ARGUMENT_OPTIONS", e[e.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE = 13] = "EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE", e[e.INVALID_PLURAL_ARGUMENT_OFFSET_VALUE = 14] = "INVALID_PLURAL_ARGUMENT_OFFSET_VALUE", e[e.EXPECT_SELECT_ARGUMENT_SELECTOR = 15] = "EXPECT_SELECT_ARGUMENT_SELECTOR", e[e.EXPECT_PLURAL_ARGUMENT_SELECTOR = 16] = "EXPECT_PLURAL_ARGUMENT_SELECTOR", e[e.EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT = 17] = "EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT", e[e.EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT = 18] = "EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT", e[e.INVALID_PLURAL_ARGUMENT_SELECTOR = 19] = "INVALID_PLURAL_ARGUMENT_SELECTOR", e[e.DUPLICATE_PLURAL_ARGUMENT_SELECTOR = 20] = "DUPLICATE_PLURAL_ARGUMENT_SELECTOR", e[e.DUPLICATE_SELECT_ARGUMENT_SELECTOR = 21] = "DUPLICATE_SELECT_ARGUMENT_SELECTOR", e[e.MISSING_OTHER_CLAUSE = 22] = "MISSING_OTHER_CLAUSE", e[e.INVALID_TAG = 23] = "INVALID_TAG", e[e.INVALID_TAG_NAME = 25] = "INVALID_TAG_NAME", e[e.UNMATCHED_CLOSING_TAG = 26] = "UNMATCHED_CLOSING_TAG", e[e.UNCLOSED_TAG = 27] = "UNCLOSED_TAG";
})(A ||= {});
// D:/ドキュメント/GitHub/ehagaki/node_modules/@formatjs/icu-messageformat-parser/lib/types.js
var j;
(function(e) {
	e[e.literal = 0] = "literal", e[e.argument = 1] = "argument", e[e.number = 2] = "number", e[e.date = 3] = "date", e[e.time = 4] = "time", e[e.select = 5] = "select", e[e.plural = 6] = "plural", e[e.pound = 7] = "pound", e[e.tag = 8] = "tag";
})(j ||= {});
var M;
(function(e) {
	e[e.number = 0] = "number", e[e.dateTime = 1] = "dateTime";
})(M ||= {});
function Ee(e) {
	return e.type === j.literal;
}
function De(e) {
	return e.type === j.argument;
}
function Oe(e) {
	return e.type === j.number;
}
function ke(e) {
	return e.type === j.date;
}
function Ae(e) {
	return e.type === j.time;
}
function je(e) {
	return e.type === j.select;
}
function Me(e) {
	return e.type === j.plural;
}
function Ne(e) {
	return e.type === j.pound;
}
function Pe(e) {
	return e.type === j.tag;
}
function Fe(e) {
	return !!(e && typeof e == "object" && e.type === M.number);
}
function Ie(e) {
	return !!(e && typeof e == "object" && e.type === M.dateTime);
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/@formatjs/icu-messageformat-parser/lib/regex.generated.js
var Le = /[ \xA0\u1680\u2000-\u200A\u202F\u205F\u3000]/, Re = /(?:[Eec]{1,6}|G{1,5}|[Qq]{1,5}|(?:[yYur]+|U{1,5})|[ML]{1,5}|d{1,2}|D{1,3}|F{1}|[abB]{1,5}|[hkHK]{1,2}|w{1,2}|W{1}|m{1,2}|s{1,2}|[zZOvVxX]{1,4})(?=([^']*'[^']*')*[^']*$)/g;
function ze(e) {
	var t = {};
	return e.replace(Re, function(e) {
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
var Be = /[\t-\r \x85\u200E\u200F\u2028\u2029]/i;
// D:/ドキュメント/GitHub/ehagaki/node_modules/@formatjs/icu-skeleton-parser/lib/number.js
function Ve(e) {
	if (e.length === 0) throw Error("Number skeleton cannot be empty");
	for (var t = e.split(Be).filter(function(e) {
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
function He(e) {
	return e.replace(/^(.*?)-/, "");
}
var Ue = /^\.(?:(0+)(\*)?|(#+)|(0+)(#+))$/g, We = /^(@+)?(\+|#+)?[rs]?$/g, Ge = /(\*)(0+)|(#+)(0+)|(0+)/g, Ke = /^(0+)$/;
function qe(e) {
	var t = {};
	return e[e.length - 1] === "r" ? t.roundingPriority = "morePrecision" : e[e.length - 1] === "s" && (t.roundingPriority = "lessPrecision"), e.replace(We, function(e, n, r) {
		return typeof r == "string" ? r === "+" ? t.minimumSignificantDigits = n.length : n[0] === "#" ? t.maximumSignificantDigits = n.length : (t.minimumSignificantDigits = n.length, t.maximumSignificantDigits = n.length + (typeof r == "string" ? r.length : 0)) : (t.minimumSignificantDigits = n.length, t.maximumSignificantDigits = n.length), "";
	}), t;
}
function Je(e) {
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
function Ye(e) {
	var t;
	if (e[0] === "E" && e[1] === "E" ? (t = { notation: "engineering" }, e = e.slice(2)) : e[0] === "E" && (t = { notation: "scientific" }, e = e.slice(1)), t) {
		var n = e.slice(0, 2);
		if (n === "+!" ? (t.signDisplay = "always", e = e.slice(2)) : n === "+?" && (t.signDisplay = "exceptZero", e = e.slice(2)), !Ke.test(e)) throw Error("Malformed concise eng/scientific notation");
		t.minimumIntegerDigits = e.length;
	}
	return t;
}
function Xe(e) {
	return Je(e) || {};
}
function Ze(e) {
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
				t.style = "unit", t.unit = He(i.options[0]);
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
				t = k(k(k({}, t), { notation: "scientific" }), i.options.reduce(function(e, t) {
					return k(k({}, e), Xe(t));
				}, {}));
				continue;
			case "engineering":
				t = k(k(k({}, t), { notation: "engineering" }), i.options.reduce(function(e, t) {
					return k(k({}, e), Xe(t));
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
				i.options[0].replace(Ge, function(e, n, r, i, a, o) {
					if (n) t.minimumIntegerDigits = r.length;
					else if (i && a) throw Error("We currently do not support maximum integer digits");
					else if (o) throw Error("We currently do not support exact integer digits");
					return "";
				});
				continue;
		}
		if (Ke.test(i.stem)) t.minimumIntegerDigits = i.stem.length;
		else if (Ue.test(i.stem)) {
			if (i.options.length > 1) throw RangeError("Fraction-precision stems only accept a single optional option");
			i.stem.replace(Ue, function(e, n, r, i, a, o) {
				return r === "*" ? t.minimumFractionDigits = n.length : i && i[0] === "#" ? t.maximumFractionDigits = i.length : a && o ? (t.minimumFractionDigits = a.length, t.maximumFractionDigits = a.length + o.length) : (t.minimumFractionDigits = n.length, t.maximumFractionDigits = n.length), "";
			});
			var a = i.options[0];
			a === "w" ? t = k(k({}, t), { trailingZeroDisplay: "stripIfInteger" }) : a && (t = k(k({}, t), qe(a)));
		} else if (We.test(i.stem)) t = k(k({}, t), qe(i.stem));
		else {
			var o = Je(i.stem);
			o && (t = k(k({}, t), o));
			var s = Ye(i.stem);
			s && (t = k(k({}, t), s));
		}
	}
	return t;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/@formatjs/icu-messageformat-parser/lib/time-data.generated.js
var Qe = {
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
function $e(e, t) {
	for (var n = "", r = 0; r < e.length; r++) {
		var i = e.charAt(r);
		if (i === "j") {
			for (var a = 0; r + 1 < e.length && e.charAt(r + 1) === i;) a++, r++;
			var o = 1 + (a & 1), s = a < 2 ? 1 : 3 + (a >> 1), c = "a", l = et(t);
			for ((l == "H" || l == "k") && (s = 0); s-- > 0;) n += c;
			for (; o-- > 0;) n = l + n;
		} else n += i === "J" ? "H" : i;
	}
	return n;
}
function et(e) {
	var t = e.hourCycle;
	if (t === void 0 && e.hourCycles && e.hourCycles.length && (t = e.hourCycles[0]), t) switch (t) {
		case "h24": return "k";
		case "h23": return "H";
		case "h12": return "h";
		case "h11": return "K";
		default: throw Error("Invalid hourCycle");
	}
	var n = e.language, r;
	return n !== "root" && (r = e.maximize().region), (Qe[r || ""] || Qe[n || ""] || Qe[`${n}-001`] || Qe["001"])[0];
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/@formatjs/icu-messageformat-parser/lib/parser.js
var tt = RegExp(`^${Le.source}*`), nt = RegExp(`${Le.source}*\$`);
function N(e, t) {
	return {
		start: e,
		end: t
	};
}
var rt = !!String.prototype.startsWith && "_a".startsWith("a", 1), it = !!String.fromCodePoint, at = !!Object.fromEntries, ot = !!String.prototype.codePointAt, st = !!String.prototype.trimStart, ct = !!String.prototype.trimEnd, lt = Number.isSafeInteger ? Number.isSafeInteger : function(e) {
	return typeof e == "number" && isFinite(e) && Math.floor(e) === e && Math.abs(e) <= 9007199254740991;
}, ut = !0;
try {
	ut = _t("([^\\p{White_Space}\\p{Pattern_Syntax}]*)", "yu").exec("a")?.[0] === "a";
} catch {
	ut = !1;
}
var dt = rt ? function(e, t, n) {
	return e.startsWith(t, n);
} : function(e, t, n) {
	return e.slice(n, n + t.length) === t;
}, ft = it ? String.fromCodePoint : function() {
	for (var e = [...arguments], t = "", n = e.length, r = 0, i; n > r;) {
		if (i = e[r++], i > 1114111) throw RangeError(i + " is not a valid code point");
		t += i < 65536 ? String.fromCharCode(i) : String.fromCharCode(((i -= 65536) >> 10) + 55296, i % 1024 + 56320);
	}
	return t;
}, pt = at ? Object.fromEntries : function(e) {
	for (var t = {}, n = 0, r = e; n < r.length; n++) {
		var i = r[n], a = i[0];
		t[a] = i[1];
	}
	return t;
}, mt = ot ? function(e, t) {
	return e.codePointAt(t);
} : function(e, t) {
	var n = e.length;
	if (!(t < 0 || t >= n)) {
		var r = e.charCodeAt(t), i;
		return r < 55296 || r > 56319 || t + 1 === n || (i = e.charCodeAt(t + 1)) < 56320 || i > 57343 ? r : (r - 55296 << 10) + (i - 56320) + 65536;
	}
}, ht = st ? function(e) {
	return e.trimStart();
} : function(e) {
	return e.replace(tt, "");
}, gt = ct ? function(e) {
	return e.trimEnd();
} : function(e) {
	return e.replace(nt, "");
};
function _t(e, t) {
	return new RegExp(e, t);
}
var vt;
if (ut) {
	var yt = _t("([^\\p{White_Space}\\p{Pattern_Syntax}]*)", "yu");
	vt = function(e, t) {
		return yt.lastIndex = t, yt.exec(e)[1] ?? "";
	};
} else vt = function(e, t) {
	for (var n = [];;) {
		var r = mt(e, t);
		if (r === void 0 || wt(r) || Tt(r)) break;
		n.push(r), t += r >= 65536 ? 2 : 1;
	}
	return ft.apply(void 0, n);
};
var bt = function() {
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
					type: j.pound,
					location: N(o, this.clonePosition())
				});
			} else if (i === 60 && !this.ignoreTag && this.peek() === 47) {
				if (n) break;
				return this.error(A.UNMATCHED_CLOSING_TAG, N(this.clonePosition(), this.clonePosition()));
			} else if (i === 60 && !this.ignoreTag && xt(this.peek() || 0)) {
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
				type: j.literal,
				value: `<${r}/>`,
				location: N(n, this.clonePosition())
			},
			err: null
		};
		if (this.bumpIf(">")) {
			var i = this.parseMessage(e + 1, t, !0);
			if (i.err) return i;
			var a = i.val, o = this.clonePosition();
			if (this.bumpIf("</")) {
				if (this.isEOF() || !xt(this.char())) return this.error(A.INVALID_TAG, N(o, this.clonePosition()));
				var s = this.clonePosition();
				return r === this.parseTagName() ? (this.bumpSpace(), this.bumpIf(">") ? {
					val: {
						type: j.tag,
						value: r,
						children: a,
						location: N(n, this.clonePosition())
					},
					err: null
				} : this.error(A.INVALID_TAG, N(o, this.clonePosition()))) : this.error(A.UNMATCHED_CLOSING_TAG, N(s, this.clonePosition()));
			}
			return this.error(A.UNCLOSED_TAG, N(n, this.clonePosition()));
		}
		return this.error(A.INVALID_TAG, N(n, this.clonePosition()));
	}, e.prototype.parseTagName = function() {
		var e = this.offset();
		for (this.bump(); !this.isEOF() && Ct(this.char());) this.bump();
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
		var s = N(n, this.clonePosition());
		return {
			val: {
				type: j.literal,
				value: r,
				location: s
			},
			err: null
		};
	}, e.prototype.tryParseLeftAngleBracket = function() {
		return !this.isEOF() && this.char() === 60 && (this.ignoreTag || !St(this.peek() || 0)) ? (this.bump(), "<") : null;
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
		return ft.apply(void 0, t);
	}, e.prototype.tryParseUnquoted = function(e, t) {
		if (this.isEOF()) return null;
		var n = this.char();
		return n === 60 || n === 123 || n === 35 && (t === "plural" || t === "selectordinal") || n === 125 && e > 0 ? null : (this.bump(), ft(n));
	}, e.prototype.parseArgument = function(e, t) {
		var n = this.clonePosition();
		if (this.bump(), this.bumpSpace(), this.isEOF()) return this.error(A.EXPECT_ARGUMENT_CLOSING_BRACE, N(n, this.clonePosition()));
		if (this.char() === 125) return this.bump(), this.error(A.EMPTY_ARGUMENT, N(n, this.clonePosition()));
		var r = this.parseIdentifierIfPossible().value;
		if (!r) return this.error(A.MALFORMED_ARGUMENT, N(n, this.clonePosition()));
		if (this.bumpSpace(), this.isEOF()) return this.error(A.EXPECT_ARGUMENT_CLOSING_BRACE, N(n, this.clonePosition()));
		switch (this.char()) {
			case 125: return this.bump(), {
				val: {
					type: j.argument,
					value: r,
					location: N(n, this.clonePosition())
				},
				err: null
			};
			case 44: return this.bump(), this.bumpSpace(), this.isEOF() ? this.error(A.EXPECT_ARGUMENT_CLOSING_BRACE, N(n, this.clonePosition())) : this.parseArgumentOptions(e, t, r, n);
			default: return this.error(A.MALFORMED_ARGUMENT, N(n, this.clonePosition()));
		}
	}, e.prototype.parseIdentifierIfPossible = function() {
		var e = this.clonePosition(), t = this.offset(), n = vt(this.message, t), r = t + n.length;
		return this.bumpTo(r), {
			value: n,
			location: N(e, this.clonePosition())
		};
	}, e.prototype.parseArgumentOptions = function(e, t, n, r) {
		var i = this.clonePosition(), a = this.parseIdentifierIfPossible().value, o = this.clonePosition();
		switch (a) {
			case "": return this.error(A.EXPECT_ARGUMENT_TYPE, N(i, o));
			case "number":
			case "date":
			case "time":
				this.bumpSpace();
				var s = null;
				if (this.bumpIf(",")) {
					this.bumpSpace();
					var c = this.clonePosition(), l = this.parseSimpleArgStyleIfPossible();
					if (l.err) return l;
					var u = gt(l.val);
					if (u.length === 0) return this.error(A.EXPECT_ARGUMENT_STYLE, N(this.clonePosition(), this.clonePosition()));
					s = {
						style: u,
						styleLocation: N(c, this.clonePosition())
					};
				}
				var d = this.tryParseArgumentClose(r);
				if (d.err) return d;
				var f = N(r, this.clonePosition());
				if (s && dt(s?.style, "::", 0)) {
					var p = ht(s.style.slice(2));
					if (a === "number") {
						var l = this.parseNumberSkeletonFromString(p, s.styleLocation);
						return l.err ? l : {
							val: {
								type: j.number,
								value: n,
								location: f,
								style: l.val
							},
							err: null
						};
					}
					if (p.length === 0) return this.error(A.EXPECT_DATE_TIME_SKELETON, f);
					var m = p;
					this.locale && (m = $e(p, this.locale));
					var u = {
						type: M.dateTime,
						pattern: m,
						location: s.styleLocation,
						parsedOptions: this.shouldParseSkeletons ? ze(m) : {}
					};
					return {
						val: {
							type: a === "date" ? j.date : j.time,
							value: n,
							location: f,
							style: u
						},
						err: null
					};
				}
				return {
					val: {
						type: a === "number" ? j.number : a === "date" ? j.date : j.time,
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
				if (this.bumpSpace(), !this.bumpIf(",")) return this.error(A.EXPECT_SELECT_ARGUMENT_OPTIONS, N(h, k({}, h)));
				this.bumpSpace();
				var g = this.parseIdentifierIfPossible(), _ = 0;
				if (a !== "select" && g.value === "offset") {
					if (!this.bumpIf(":")) return this.error(A.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE, N(this.clonePosition(), this.clonePosition()));
					this.bumpSpace();
					var l = this.tryParseDecimalInteger(A.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE, A.INVALID_PLURAL_ARGUMENT_OFFSET_VALUE);
					if (l.err) return l;
					this.bumpSpace(), g = this.parseIdentifierIfPossible(), _ = l.val;
				}
				var v = this.tryParsePluralOrSelectOptions(e, a, t, g);
				if (v.err) return v;
				var d = this.tryParseArgumentClose(r);
				if (d.err) return d;
				var y = N(r, this.clonePosition());
				return a === "select" ? {
					val: {
						type: j.select,
						value: n,
						options: pt(v.val),
						location: y
					},
					err: null
				} : {
					val: {
						type: j.plural,
						value: n,
						options: pt(v.val),
						offset: _,
						pluralType: a === "plural" ? "cardinal" : "ordinal",
						location: y
					},
					err: null
				};
			default: return this.error(A.INVALID_ARGUMENT_TYPE, N(i, o));
		}
	}, e.prototype.tryParseArgumentClose = function(e) {
		return this.isEOF() || this.char() !== 125 ? this.error(A.EXPECT_ARGUMENT_CLOSING_BRACE, N(e, this.clonePosition())) : (this.bump(), {
			val: !0,
			err: null
		});
	}, e.prototype.parseSimpleArgStyleIfPossible = function() {
		for (var e = 0, t = this.clonePosition(); !this.isEOF();) switch (this.char()) {
			case 39:
				this.bump();
				var n = this.clonePosition();
				if (!this.bumpUntil("'")) return this.error(A.UNCLOSED_QUOTE_IN_ARGUMENT_STYLE, N(n, this.clonePosition()));
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
			n = Ve(e);
		} catch {
			return this.error(A.INVALID_NUMBER_SKELETON, t);
		}
		return {
			val: {
				type: M.number,
				tokens: n,
				location: t,
				parsedOptions: this.shouldParseSkeletons ? Ze(n) : {}
			},
			err: null
		};
	}, e.prototype.tryParsePluralOrSelectOptions = function(e, t, n, r) {
		for (var i, a = !1, o = [], s = /* @__PURE__ */ new Set(), c = r.value, l = r.location;;) {
			if (c.length === 0) {
				var u = this.clonePosition();
				if (t !== "select" && this.bumpIf("=")) {
					var d = this.tryParseDecimalInteger(A.EXPECT_PLURAL_ARGUMENT_SELECTOR, A.INVALID_PLURAL_ARGUMENT_SELECTOR);
					if (d.err) return d;
					l = N(u, this.clonePosition()), c = this.message.slice(u.offset, this.offset());
				} else break;
			}
			if (s.has(c)) return this.error(t === "select" ? A.DUPLICATE_SELECT_ARGUMENT_SELECTOR : A.DUPLICATE_PLURAL_ARGUMENT_SELECTOR, l);
			c === "other" && (a = !0), this.bumpSpace();
			var f = this.clonePosition();
			if (!this.bumpIf("{")) return this.error(t === "select" ? A.EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT : A.EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT, N(this.clonePosition(), this.clonePosition()));
			var p = this.parseMessage(e + 1, t, n);
			if (p.err) return p;
			var m = this.tryParseArgumentClose(f);
			if (m.err) return m;
			o.push([c, {
				value: p.val,
				location: N(f, this.clonePosition())
			}]), s.add(c), this.bumpSpace(), i = this.parseIdentifierIfPossible(), c = i.value, l = i.location;
		}
		return o.length === 0 ? this.error(t === "select" ? A.EXPECT_SELECT_ARGUMENT_SELECTOR : A.EXPECT_PLURAL_ARGUMENT_SELECTOR, N(this.clonePosition(), this.clonePosition())) : this.requiresOtherClause && !a ? this.error(A.MISSING_OTHER_CLAUSE, N(this.clonePosition(), this.clonePosition())) : {
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
		var s = N(r, this.clonePosition());
		return i ? (a *= n, lt(a) ? {
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
		var t = mt(this.message, e);
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
		if (dt(this.message, e, this.offset())) {
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
		for (; !this.isEOF() && wt(this.char());) this.bump();
	}, e.prototype.peek = function() {
		if (this.isEOF()) return null;
		var e = this.char(), t = this.offset();
		return this.message.charCodeAt(t + (e >= 65536 ? 2 : 1)) ?? null;
	}, e;
}();
function xt(e) {
	return e >= 97 && e <= 122 || e >= 65 && e <= 90;
}
function St(e) {
	return xt(e) || e === 47;
}
function Ct(e) {
	return e === 45 || e === 46 || e >= 48 && e <= 57 || e === 95 || e >= 97 && e <= 122 || e >= 65 && e <= 90 || e == 183 || e >= 192 && e <= 214 || e >= 216 && e <= 246 || e >= 248 && e <= 893 || e >= 895 && e <= 8191 || e >= 8204 && e <= 8205 || e >= 8255 && e <= 8256 || e >= 8304 && e <= 8591 || e >= 11264 && e <= 12271 || e >= 12289 && e <= 55295 || e >= 63744 && e <= 64975 || e >= 65008 && e <= 65533 || e >= 65536 && e <= 983039;
}
function wt(e) {
	return e >= 9 && e <= 13 || e === 32 || e === 133 || e >= 8206 && e <= 8207 || e === 8232 || e === 8233;
}
function Tt(e) {
	return e >= 33 && e <= 35 || e === 36 || e >= 37 && e <= 39 || e === 40 || e === 41 || e === 42 || e === 43 || e === 44 || e === 45 || e >= 46 && e <= 47 || e >= 58 && e <= 59 || e >= 60 && e <= 62 || e >= 63 && e <= 64 || e === 91 || e === 92 || e === 93 || e === 94 || e === 96 || e === 123 || e === 124 || e === 125 || e === 126 || e === 161 || e >= 162 && e <= 165 || e === 166 || e === 167 || e === 169 || e === 171 || e === 172 || e === 174 || e === 176 || e === 177 || e === 182 || e === 187 || e === 191 || e === 215 || e === 247 || e >= 8208 && e <= 8213 || e >= 8214 && e <= 8215 || e === 8216 || e === 8217 || e === 8218 || e >= 8219 && e <= 8220 || e === 8221 || e === 8222 || e === 8223 || e >= 8224 && e <= 8231 || e >= 8240 && e <= 8248 || e === 8249 || e === 8250 || e >= 8251 && e <= 8254 || e >= 8257 && e <= 8259 || e === 8260 || e === 8261 || e === 8262 || e >= 8263 && e <= 8273 || e === 8274 || e === 8275 || e >= 8277 && e <= 8286 || e >= 8592 && e <= 8596 || e >= 8597 && e <= 8601 || e >= 8602 && e <= 8603 || e >= 8604 && e <= 8607 || e === 8608 || e >= 8609 && e <= 8610 || e === 8611 || e >= 8612 && e <= 8613 || e === 8614 || e >= 8615 && e <= 8621 || e === 8622 || e >= 8623 && e <= 8653 || e >= 8654 && e <= 8655 || e >= 8656 && e <= 8657 || e === 8658 || e === 8659 || e === 8660 || e >= 8661 && e <= 8691 || e >= 8692 && e <= 8959 || e >= 8960 && e <= 8967 || e === 8968 || e === 8969 || e === 8970 || e === 8971 || e >= 8972 && e <= 8991 || e >= 8992 && e <= 8993 || e >= 8994 && e <= 9e3 || e === 9001 || e === 9002 || e >= 9003 && e <= 9083 || e === 9084 || e >= 9085 && e <= 9114 || e >= 9115 && e <= 9139 || e >= 9140 && e <= 9179 || e >= 9180 && e <= 9185 || e >= 9186 && e <= 9254 || e >= 9255 && e <= 9279 || e >= 9280 && e <= 9290 || e >= 9291 && e <= 9311 || e >= 9472 && e <= 9654 || e === 9655 || e >= 9656 && e <= 9664 || e === 9665 || e >= 9666 && e <= 9719 || e >= 9720 && e <= 9727 || e >= 9728 && e <= 9838 || e === 9839 || e >= 9840 && e <= 10087 || e === 10088 || e === 10089 || e === 10090 || e === 10091 || e === 10092 || e === 10093 || e === 10094 || e === 10095 || e === 10096 || e === 10097 || e === 10098 || e === 10099 || e === 10100 || e === 10101 || e >= 10132 && e <= 10175 || e >= 10176 && e <= 10180 || e === 10181 || e === 10182 || e >= 10183 && e <= 10213 || e === 10214 || e === 10215 || e === 10216 || e === 10217 || e === 10218 || e === 10219 || e === 10220 || e === 10221 || e === 10222 || e === 10223 || e >= 10224 && e <= 10239 || e >= 10240 && e <= 10495 || e >= 10496 && e <= 10626 || e === 10627 || e === 10628 || e === 10629 || e === 10630 || e === 10631 || e === 10632 || e === 10633 || e === 10634 || e === 10635 || e === 10636 || e === 10637 || e === 10638 || e === 10639 || e === 10640 || e === 10641 || e === 10642 || e === 10643 || e === 10644 || e === 10645 || e === 10646 || e === 10647 || e === 10648 || e >= 10649 && e <= 10711 || e === 10712 || e === 10713 || e === 10714 || e === 10715 || e >= 10716 && e <= 10747 || e === 10748 || e === 10749 || e >= 10750 && e <= 11007 || e >= 11008 && e <= 11055 || e >= 11056 && e <= 11076 || e >= 11077 && e <= 11078 || e >= 11079 && e <= 11084 || e >= 11085 && e <= 11123 || e >= 11124 && e <= 11125 || e >= 11126 && e <= 11157 || e === 11158 || e >= 11159 && e <= 11263 || e >= 11776 && e <= 11777 || e === 11778 || e === 11779 || e === 11780 || e === 11781 || e >= 11782 && e <= 11784 || e === 11785 || e === 11786 || e === 11787 || e === 11788 || e === 11789 || e >= 11790 && e <= 11798 || e === 11799 || e >= 11800 && e <= 11801 || e === 11802 || e === 11803 || e === 11804 || e === 11805 || e >= 11806 && e <= 11807 || e === 11808 || e === 11809 || e === 11810 || e === 11811 || e === 11812 || e === 11813 || e === 11814 || e === 11815 || e === 11816 || e === 11817 || e >= 11818 && e <= 11822 || e === 11823 || e >= 11824 && e <= 11833 || e >= 11834 && e <= 11835 || e >= 11836 && e <= 11839 || e === 11840 || e === 11841 || e === 11842 || e >= 11843 && e <= 11855 || e >= 11856 && e <= 11857 || e === 11858 || e >= 11859 && e <= 11903 || e >= 12289 && e <= 12291 || e === 12296 || e === 12297 || e === 12298 || e === 12299 || e === 12300 || e === 12301 || e === 12302 || e === 12303 || e === 12304 || e === 12305 || e >= 12306 && e <= 12307 || e === 12308 || e === 12309 || e === 12310 || e === 12311 || e === 12312 || e === 12313 || e === 12314 || e === 12315 || e === 12316 || e === 12317 || e >= 12318 && e <= 12319 || e === 12320 || e === 12336 || e === 64830 || e === 64831 || e >= 65093 && e <= 65094;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/@formatjs/icu-messageformat-parser/lib/index.js
function Et(e) {
	e.forEach(function(e) {
		if (delete e.location, je(e) || Me(e)) for (var t in e.options) delete e.options[t].location, Et(e.options[t].value);
		else Oe(e) && Fe(e.style) || (ke(e) || Ae(e)) && Ie(e.style) ? delete e.style.location : Pe(e) && Et(e.children);
	});
}
function Dt(e, t) {
	t === void 0 && (t = {}), t = k({
		shouldParseSkeletons: !0,
		requiresOtherClause: !0
	}, t);
	var n = new bt(e, t).parse();
	if (n.err) {
		var r = SyntaxError(A[n.err.kind]);
		throw r.location = n.err.location, r.originalMessage = n.err.message, r;
	}
	return t?.captureLocation || Et(n.val), n.val;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/intl-messageformat/lib/src/error.js
var P;
(function(e) {
	e.MISSING_VALUE = "MISSING_VALUE", e.INVALID_VALUE = "INVALID_VALUE", e.MISSING_INTL_API = "MISSING_INTL_API";
})(P ||= {});
var Ot = function(e) {
	O(t, e);
	function t(t, n, r) {
		var i = e.call(this, t) || this;
		return i.code = n, i.originalMessage = r, i;
	}
	return t.prototype.toString = function() {
		return `[formatjs Error: ${this.code}] ${this.message}`;
	}, t;
}(Error), kt = function(e) {
	O(t, e);
	function t(t, n, r, i) {
		return e.call(this, `Invalid values for "${t}": "${n}". Options are "${Object.keys(r).join("\", \"")}"`, P.INVALID_VALUE, i) || this;
	}
	return t;
}(Ot), At = function(e) {
	O(t, e);
	function t(t, n, r) {
		return e.call(this, `Value for "${t}" must be of type ${n}`, P.INVALID_VALUE, r) || this;
	}
	return t;
}(Ot), jt = function(e) {
	O(t, e);
	function t(t, n) {
		return e.call(this, `The intl string context variable "${t}" was not provided to the string "${n}"`, P.MISSING_VALUE, n) || this;
	}
	return t;
}(Ot), F;
(function(e) {
	e[e.literal = 0] = "literal", e[e.object = 1] = "object";
})(F ||= {});
function Mt(e) {
	return e.length < 2 ? e : e.reduce(function(e, t) {
		var n = e[e.length - 1];
		return !n || n.type !== F.literal || t.type !== F.literal ? e.push(t) : n.value += t.value, e;
	}, []);
}
function Nt(e) {
	return typeof e == "function";
}
function Pt(e, t, n, r, i, a, o) {
	if (e.length === 1 && Ee(e[0])) return [{
		type: F.literal,
		value: e[0].value
	}];
	for (var s = [], c = 0, l = e; c < l.length; c++) {
		var u = l[c];
		if (Ee(u)) s.push({
			type: F.literal,
			value: u.value
		});
		else if (Ne(u)) typeof a == "number" && s.push({
			type: F.literal,
			value: n.getNumberFormat(t).format(a)
		});
		else {
			var d = u.value;
			if (!(i && d in i)) throw new jt(d, o);
			var f = i[d];
			if (De(u)) f && typeof f != "string" && typeof f != "number" || (f = typeof f == "string" || typeof f == "number" ? String(f) : ""), s.push({
				type: typeof f == "string" ? F.literal : F.object,
				value: f
			});
			else if (ke(u)) {
				var p = typeof u.style == "string" ? r.date[u.style] : Ie(u.style) ? u.style.parsedOptions : void 0;
				s.push({
					type: F.literal,
					value: n.getDateTimeFormat(t, p).format(f)
				});
			} else if (Ae(u)) {
				var p = typeof u.style == "string" ? r.time[u.style] : Ie(u.style) ? u.style.parsedOptions : r.time.medium;
				s.push({
					type: F.literal,
					value: n.getDateTimeFormat(t, p).format(f)
				});
			} else if (Oe(u)) {
				var p = typeof u.style == "string" ? r.number[u.style] : Fe(u.style) ? u.style.parsedOptions : void 0;
				p && p.scale && (f *= p.scale || 1), s.push({
					type: F.literal,
					value: n.getNumberFormat(t, p).format(f)
				});
			} else {
				if (Pe(u)) {
					var m = u.children, h = u.value, g = i[h];
					if (!Nt(g)) throw new At(h, "function", o);
					var _ = g(Pt(m, t, n, r, i, a).map(function(e) {
						return e.value;
					}));
					Array.isArray(_) || (_ = [_]), s.push.apply(s, _.map(function(e) {
						return {
							type: typeof e == "string" ? F.literal : F.object,
							value: e
						};
					}));
				}
				if (je(u)) {
					var v = u.options[f] || u.options.other;
					if (!v) throw new kt(u.value, f, Object.keys(u.options), o);
					s.push.apply(s, Pt(v.value, t, n, r, i));
				} else if (Me(u)) {
					var v = u.options[`=${f}`];
					if (!v) {
						if (!Intl.PluralRules) throw new Ot("Intl.PluralRules is not available in this environment.\nTry polyfilling it using \"@formatjs/intl-pluralrules\"\n", P.MISSING_INTL_API, o);
						var y = n.getPluralRules(t, { type: u.pluralType }).select(f - (u.offset || 0));
						v = u.options[y] || u.options.other;
					}
					if (!v) throw new kt(u.value, f, Object.keys(u.options), o);
					s.push.apply(s, Pt(v.value, t, n, r, i, f - (u.offset || 0)));
				}
			}
		}
	}
	return Mt(s);
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/intl-messageformat/lib/src/core.js
function Ft(e, t) {
	return t ? k(k(k({}, e || {}), t || {}), Object.keys(e).reduce(function(n, r) {
		return n[r] = k(k({}, e[r]), t[r] || {}), n;
	}, {})) : e;
}
function It(e, t) {
	return t ? Object.keys(e).reduce(function(n, r) {
		return n[r] = Ft(e[r], t[r]), n;
	}, k({}, e)) : e;
}
function Lt(e) {
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
function Rt(e) {
	return e === void 0 && (e = {
		number: {},
		dateTime: {},
		pluralRules: {}
	}), {
		getNumberFormat: me(function() {
			for (var e, t = [], n = 0; n < arguments.length; n++) t[n] = arguments[n];
			return new ((e = Intl.NumberFormat).bind.apply(e, fe([void 0], t, !1)))();
		}, {
			cache: Lt(e.number),
			strategy: Te.variadic
		}),
		getDateTimeFormat: me(function() {
			for (var e, t = [], n = 0; n < arguments.length; n++) t[n] = arguments[n];
			return new ((e = Intl.DateTimeFormat).bind.apply(e, fe([void 0], t, !1)))();
		}, {
			cache: Lt(e.dateTime),
			strategy: Te.variadic
		}),
		getPluralRules: me(function() {
			for (var e, t = [], n = 0; n < arguments.length; n++) t[n] = arguments[n];
			return new ((e = Intl.PluralRules).bind.apply(e, fe([void 0], t, !1)))();
		}, {
			cache: Lt(e.pluralRules),
			strategy: Te.variadic
		})
	};
}
var zt = function() {
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
				return !e.length || t.type !== F.literal || typeof e[e.length - 1] != "string" ? e.push(t.value) : e[e.length - 1] += t.value, e;
			}, []);
			return n.length <= 1 ? n[0] || "" : n;
		}, this.formatToParts = function(e) {
			return Pt(a.ast, a.locales, a.formatters, a.formats, e, void 0, a.message);
		}, this.resolvedOptions = function() {
			return { locale: a.resolvedLocale?.toString() || Intl.NumberFormat.supportedLocalesOf(a.locales)[0] };
		}, this.getAst = function() {
			return a.ast;
		}, this.locales = n, this.resolvedLocale = e.resolveLocale(n), typeof t == "string") {
			if (this.message = t, !e.__parse) throw TypeError("IntlMessageFormat.__parse must be set to process `message` of type `string`");
			var o = i || {};
			o.formatters;
			var s = de(o, ["formatters"]);
			this.ast = e.__parse(t, k(k({}, s), { locale: this.resolvedLocale }));
		} else this.ast = t;
		if (!Array.isArray(this.ast)) throw TypeError("A message must be provided as a String or AST.");
		this.formats = It(e.formats, r), this.formatters = i && i.formatters || Rt(this.formatterCache);
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
	}, e.__parse = Dt, e.formats = {
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
}(), Bt = /* @__PURE__ */ e(pe(), 1);
function Vt(e, t) {
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
var I = {}, Ht = (e, t, n) => n && (t in I || (I[t] = {}), e in I[t] || (I[t][e] = n), n), Ut = (e, t) => {
	if (t == null) return;
	if (t in I && e in I[t]) return I[t][e];
	let n = U(t);
	for (let r = 0; r < n.length; r++) {
		let i = n[r], a = qt(i, e);
		if (a) return Ht(e, t, a);
	}
}, Wt, L = b({});
function Gt(e) {
	return Wt[e] || null;
}
function Kt(e) {
	return e in Wt;
}
function qt(e, t) {
	return Kt(e) ? Vt(Gt(e), t) : null;
}
function Jt(e) {
	if (e == null) return;
	let t = U(e);
	for (let e = 0; e < t.length; e++) {
		let n = t[e];
		if (Kt(n)) return n;
	}
}
function Yt(e, ...t) {
	delete I[e], L.update((n) => (n[e] = Bt.default.all([n[e] || {}, ...t]), n));
}
v([L], ([e]) => Object.keys(e)), L.subscribe((e) => Wt = e);
var R = {};
function Xt(e) {
	R[e] = /* @__PURE__ */ new Set();
}
function Zt(e, t) {
	R[e].delete(t), R[e].size === 0 && delete R[e];
}
function z(e) {
	return R[e];
}
function Qt(e) {
	return U(e).map((e) => {
		let t = z(e);
		return [e, t ? [...t] : []];
	}).filter(([, e]) => e.length > 0);
}
function $t(e) {
	return e != null && U(e).some((e) => z(e)?.size);
}
function en(e, t) {
	return Promise.all(t.map((t) => (Zt(e, t), t().then((e) => e.default || e)))).then((t) => Yt(e, ...t));
}
var B = {};
function tn(e) {
	if (!$t(e)) return e in B ? B[e] : Promise.resolve();
	let t = Qt(e);
	return B[e] = Promise.all(t.map(([e, t]) => en(e, t))).then(() => {
		if ($t(e)) return tn(e);
		delete B[e];
	}), B[e];
}
function nn(e, t) {
	z(e) || Xt(e);
	let n = z(e);
	z(e).has(t) || (Kt(e) || L.update((t) => (t[e] = {}, t)), n.add(t));
}
var rn = Object.getOwnPropertySymbols, an = Object.prototype.hasOwnProperty, on = Object.prototype.propertyIsEnumerable, sn = (e, t) => {
	var n = {};
	for (var r in e) an.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
	if (e != null && rn) for (var r of rn(e)) t.indexOf(r) < 0 && on.call(e, r) && (n[r] = e[r]);
	return n;
}, cn = {
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
function ln({ locale: e, id: t }) {
	console.warn(`[svelte-i18n] The message "${t}" was not found in "${U(e).join("\", \"")}".${$t(W()) ? "\n\nNote: there are at least one loader still registered to this locale that wasn't executed." : ""}`);
}
var V = {
	fallbackLocale: null,
	loadingDelay: 200,
	formats: cn,
	warnOnMissingMessages: !0,
	handleMissingMessage: void 0,
	ignoreTag: !0
};
function H() {
	return V;
}
function un(e) {
	let t = e, { formats: n } = t, r = sn(t, ["formats"]), i = e.fallbackLocale;
	if (e.initialLocale) try {
		zt.resolveLocale(e.initialLocale) && (i = e.initialLocale);
	} catch {
		console.warn(`[svelte-i18n] The initial locale "${e.initialLocale}" is not a valid locale.`);
	}
	return r.warnOnMissingMessages && (delete r.warnOnMissingMessages, r.handleMissingMessage == null ? r.handleMissingMessage = ln : console.warn("[svelte-i18n] The \"warnOnMissingMessages\" option is deprecated. Please use the \"handleMissingMessage\" option instead.")), Object.assign(V, r, { initialLocale: i }), n && ("number" in n && Object.assign(V.formats.number, n.number), "date" in n && Object.assign(V.formats.date, n.date), "time" in n && Object.assign(V.formats.time, n.time)), G.set(i);
}
var dn = b(!1), fn = Object.defineProperty, pn = Object.defineProperties, mn = Object.getOwnPropertyDescriptors, hn = Object.getOwnPropertySymbols, gn = Object.prototype.hasOwnProperty, _n = Object.prototype.propertyIsEnumerable, vn = (e, t, n) => t in e ? fn(e, t, {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: n
}) : e[t] = n, yn = (e, t) => {
	for (var n in t ||= {}) gn.call(t, n) && vn(e, n, t[n]);
	if (hn) for (var n of hn(t)) _n.call(t, n) && vn(e, n, t[n]);
	return e;
}, bn = (e, t) => pn(e, mn(t)), xn, Sn = b(null);
function Cn(e) {
	return e.split("-").map((e, t, n) => n.slice(0, t + 1).join("-")).reverse();
}
function U(e, t = H().fallbackLocale) {
	let n = Cn(e);
	return t ? [.../* @__PURE__ */ new Set([...n, ...Cn(t)])] : n;
}
function W() {
	return xn ?? void 0;
}
Sn.subscribe((e) => {
	xn = e ?? void 0, typeof window < "u" && e != null && document.documentElement.setAttribute("lang", e);
});
var G = bn(yn({}, Sn), { set: (e) => {
	if (e && Jt(e) && $t(e)) {
		let { loadingDelay: t } = H(), n;
		return typeof window < "u" && W() != null && t ? n = window.setTimeout(() => dn.set(!0), t) : dn.set(!0), tn(e).then(() => {
			Sn.set(e);
		}).finally(() => {
			clearTimeout(n), dn.set(!1);
		});
	}
	return Sn.set(e);
} }), wn = () => typeof window > "u" ? null : window.navigator.language || window.navigator.languages[0], K = (e) => {
	let t = /* @__PURE__ */ Object.create(null);
	return (n) => {
		let r = JSON.stringify(n);
		return r in t ? t[r] : t[r] = e(n);
	};
}, Tn = Object.defineProperty, En = Object.getOwnPropertySymbols, Dn = Object.prototype.hasOwnProperty, On = Object.prototype.propertyIsEnumerable, kn = (e, t, n) => t in e ? Tn(e, t, {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: n
}) : e[t] = n, An = (e, t) => {
	for (var n in t ||= {}) Dn.call(t, n) && kn(e, n, t[n]);
	if (En) for (var n of En(t)) On.call(t, n) && kn(e, n, t[n]);
	return e;
}, q = (e, t) => {
	var n = {};
	for (var r in e) Dn.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
	if (e != null && En) for (var r of En(e)) t.indexOf(r) < 0 && On.call(e, r) && (n[r] = e[r]);
	return n;
}, J = (e, t) => {
	let { formats: n } = H();
	if (e in n && t in n[e]) return n[e][t];
	throw Error(`[svelte-i18n] Unknown "${t}" ${e} format.`);
}, jn = K((e) => {
	var t = e, { locale: n, format: r } = t, i = q(t, ["locale", "format"]);
	if (n == null) throw Error("[svelte-i18n] A \"locale\" must be set to format numbers");
	return r && (i = J("number", r)), new Intl.NumberFormat(n, i);
}), Mn = K((e) => {
	var t = e, { locale: n, format: r } = t, i = q(t, ["locale", "format"]);
	if (n == null) throw Error("[svelte-i18n] A \"locale\" must be set to format dates");
	return r ? i = J("date", r) : Object.keys(i).length === 0 && (i = J("date", "short")), new Intl.DateTimeFormat(n, i);
}), Nn = K((e) => {
	var t = e, { locale: n, format: r } = t, i = q(t, ["locale", "format"]);
	if (n == null) throw Error("[svelte-i18n] A \"locale\" must be set to format time values");
	return r ? i = J("time", r) : Object.keys(i).length === 0 && (i = J("time", "short")), new Intl.DateTimeFormat(n, i);
}), Pn = (e = {}) => {
	var t = e, { locale: n = W() } = t, r = q(t, ["locale"]);
	return jn(An({ locale: n }, r));
}, Fn = (e = {}) => {
	var t = e, { locale: n = W() } = t, r = q(t, ["locale"]);
	return Mn(An({ locale: n }, r));
}, In = (e = {}) => {
	var t = e, { locale: n = W() } = t, r = q(t, ["locale"]);
	return Nn(An({ locale: n }, r));
}, Ln = K((e, t = W()) => new zt(e, t, H().formats, { ignoreTag: H().ignoreTag })), Rn = (e, t = {}) => {
	var n;
	let r = t;
	typeof e == "object" && (r = e, e = r.id);
	let { values: i, locale: a = W(), default: o } = r;
	if (a == null) throw Error("[svelte-i18n] Cannot format a message without first setting the initial locale.");
	let s = Ut(e, a);
	if (!s) s = (n = H()).handleMissingMessage?.call(n, {
		locale: a,
		id: e,
		defaultValue: o
	}) ?? o ?? e;
	else if (typeof s != "string") return console.warn(`[svelte-i18n] Message with id "${e}" must be of type "string", found: "${typeof s}". Gettin its value through the "$format" method is deprecated; use the "json" method instead.`), s;
	if (!i) return s;
	let c = s;
	try {
		c = Ln(s, a).format(i);
	} catch (t) {
		t instanceof Error && console.warn(`[svelte-i18n] Message "${e}" has syntax error:`, t.message);
	}
	return c;
}, zn = (e, t) => In(t).format(e), Bn = (e, t) => Fn(t).format(e), Vn = (e, t) => Pn(t).format(e), Hn = (e, t = W()) => Ut(e, t), Un = v([G, L], () => Rn);
v([G], () => zn), v([G], () => Bn), v([G], () => Vn);
var Wn = v([G, L], () => Hn);
function Gn(e) {
	return tn(e || W() || H().initialLocale);
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte-toolbelt/dist/utils/is.js
function Kn(e) {
	return typeof e == "function";
}
function Y(e) {
	return typeof e == "object" && !!e;
}
var qn = [
	"string",
	"number",
	"bigint",
	"boolean"
];
function Jn(e) {
	return e == null || qn.includes(typeof e) ? !0 : Array.isArray(e) ? e.every((e) => Jn(e)) : typeof e == "object" && Object.getPrototypeOf(e) === Object.prototype;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte-toolbelt/dist/box/box-extras.svelte.js
var X = Symbol("box"), Yn = Symbol("is-writable");
function Xn(e, t) {
	let n = d(e);
	return t ? {
		[X]: !0,
		[Yn]: !0,
		get current() {
			return T(n);
		},
		set current(e) {
			t(e);
		}
	} : {
		[X]: !0,
		get current() {
			return e();
		}
	};
}
function Z(e) {
	return Y(e) && X in e;
}
function Zn(e) {
	return Z(e) && Yn in e;
}
function Qn(e) {
	return Z(e) ? e : Kn(e) ? Xn(e) : tr(e);
}
function $n(e) {
	return Object.entries(e).reduce((e, [t, n]) => Z(n) ? (Zn(n) ? Object.defineProperty(e, t, {
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
function er(e) {
	return Zn(e) ? {
		[X]: !0,
		get current() {
			return e.current;
		}
	} : e;
}
function tr(e) {
	let t = D(ne(e));
	return {
		[X]: !0,
		[Yn]: !0,
		get current() {
			return T(t);
		},
		set current(e) {
			h(t, e, !0);
		}
	};
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte-toolbelt/dist/utils/compose-handlers.js
function nr(...e) {
	return function(t) {
		for (let n of e) if (n) {
			if (t.defaultPrevented) return;
			typeof n == "function" ? n.call(this, t) : n.current?.call(this, t);
		}
	};
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/inline-style-parser/esm/index.mjs
var rr = /\/\*[^*]*\*+([^/*][^*]*\*+)*\//g, ir = /\n/g, ar = /^\s*/, or = /^(\*?[-#/*\\\w]+(\[[0-9a-z_-]+\])?)\s*/, sr = /^:\s*/, cr = /^((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^)]*?\)|[^};])+)/, lr = /^[;\s]*/, ur = /^\s+|\s+$/g, dr = "\n", fr = "/", pr = "*", Q = "", mr = "comment", hr = "declaration";
function gr(e, t) {
	if (typeof e != "string") throw TypeError("First argument must be a string");
	if (!e) return [];
	t ||= {};
	var n = 1, r = 1;
	function i(e) {
		var t = e.match(ir);
		t && (n += t.length);
		var i = e.lastIndexOf(dr);
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
		c(ar);
	}
	function u(e) {
		var t;
		for (e ||= []; t = d();) t !== !1 && e.push(t);
		return e;
	}
	function d() {
		var t = a();
		if (fr == e.charAt(0) && pr == e.charAt(1)) {
			for (var n = 2; Q != e.charAt(n) && (pr != e.charAt(n) || fr != e.charAt(n + 1));) ++n;
			if (n += 2, Q === e.charAt(n - 1)) return s("End of comment missing");
			var o = e.slice(2, n - 2);
			return r += 2, i(o), e = e.slice(n), r += 2, t({
				type: mr,
				comment: o
			});
		}
	}
	function f() {
		var e = a(), t = c(or);
		if (t) {
			if (d(), !c(sr)) return s("property missing ':'");
			var n = c(cr), r = e({
				type: hr,
				property: _r(t[0].replace(rr, Q)),
				value: n ? _r(n[0].replace(rr, Q)) : Q
			});
			return c(lr), r;
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
function _r(e) {
	return e ? e.replace(ur, Q) : Q;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/style-to-object/esm/index.mjs
function vr(e, t) {
	let n = null;
	if (!e || typeof e != "string") return n;
	let r = gr(e), i = typeof t == "function";
	return r.forEach((e) => {
		if (e.type !== "declaration") return;
		let { property: r, value: a } = e;
		i ? t(r, a, e) : a && (n ||= {}, n[r] = a);
	}), n;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte-toolbelt/dist/utils/strings.js
var yr = /\d/, br = [
	"-",
	"_",
	"/",
	"."
];
function xr(e = "") {
	if (!yr.test(e)) return e !== e.toLowerCase();
}
function Sr(e) {
	let t = [], n = "", r, i;
	for (let a of e) {
		let e = br.includes(a);
		if (e === !0) {
			t.push(n), n = "", r = void 0;
			continue;
		}
		let o = xr(a);
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
function Cr(e) {
	return e ? Sr(e).map((e) => Tr(e)).join("") : "";
}
function wr(e) {
	return Er(Cr(e || ""));
}
function Tr(e) {
	return e ? e[0].toUpperCase() + e.slice(1) : "";
}
function Er(e) {
	return e ? e[0].toLowerCase() + e.slice(1) : "";
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte-toolbelt/dist/utils/css-to-style-obj.js
function $(e) {
	if (!e) return {};
	let t = {};
	function n(e, n) {
		e.startsWith("-moz-") || e.startsWith("-webkit-") || e.startsWith("-ms-") || e.startsWith("-o-") ? t[Cr(e)] = n : e.startsWith("--") ? t[e] = n : t[wr(e)] = n;
	}
	return vr(e, n), t;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte-toolbelt/dist/utils/execute-callbacks.js
function Dr(...e) {
	return (...t) => {
		for (let n of e) typeof n == "function" && n(...t);
	};
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte-toolbelt/dist/utils/style-to-css.js
function Or(e, t) {
	let n = RegExp(e, "g");
	return (e) => {
		if (typeof e != "string") throw TypeError(`expected an argument of type string, but got ${typeof e}`);
		return e.match(n) ? e.replace(n, t) : e;
	};
}
var kr = Or(/[A-Z]/, (e) => `-${e.toLowerCase()}`);
function Ar(e) {
	if (!e || typeof e != "object" || Array.isArray(e)) throw TypeError(`expected an argument of type object, but got ${typeof e}`);
	return Object.keys(e).map((t) => `${kr(t)}: ${e[t]};`).join("\n");
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte-toolbelt/dist/utils/style.js
function jr(e = {}) {
	return Ar(e).replace("\n", " ");
}
var Mr = new Set(/* @__PURE__ */ "onabort.onanimationcancel.onanimationend.onanimationiteration.onanimationstart.onauxclick.onbeforeinput.onbeforetoggle.onblur.oncancel.oncanplay.oncanplaythrough.onchange.onclick.onclose.oncompositionend.oncompositionstart.oncompositionupdate.oncontextlost.oncontextmenu.oncontextrestored.oncopy.oncuechange.oncut.ondblclick.ondrag.ondragend.ondragenter.ondragleave.ondragover.ondragstart.ondrop.ondurationchange.onemptied.onended.onerror.onfocus.onfocusin.onfocusout.onformdata.ongotpointercapture.oninput.oninvalid.onkeydown.onkeypress.onkeyup.onload.onloadeddata.onloadedmetadata.onloadstart.onlostpointercapture.onmousedown.onmouseenter.onmouseleave.onmousemove.onmouseout.onmouseover.onmouseup.onpaste.onpause.onplay.onplaying.onpointercancel.onpointerdown.onpointerenter.onpointerleave.onpointermove.onpointerout.onpointerover.onpointerup.onprogress.onratechange.onreset.onresize.onscroll.onscrollend.onsecuritypolicyviolation.onseeked.onseeking.onselect.onselectionchange.onselectstart.onslotchange.onstalled.onsubmit.onsuspend.ontimeupdate.ontoggle.ontouchcancel.ontouchend.ontouchmove.ontouchstart.ontransitioncancel.ontransitionend.ontransitionrun.ontransitionstart.onvolumechange.onwaiting.onwebkitanimationend.onwebkitanimationiteration.onwebkitanimationstart.onwebkittransitionend.onwheel".split("."));
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte-toolbelt/dist/utils/merge-props.js
function Nr(e) {
	return Mr.has(e);
}
function Pr(...e) {
	let t = { ...e[0] };
	for (let n = 1; n < e.length; n++) {
		let r = e[n];
		if (r) {
			for (let e of Object.keys(r)) {
				let n = t[e], i = r[e], a = typeof n == "function", o = typeof i == "function";
				if (a && typeof o && Nr(e)) t[e] = nr(n, i);
				else if (a && o) t[e] = Dr(n, i);
				else if (e === "class") {
					let r = Jn(n), a = Jn(i);
					r && a ? t[e] = l(n, i) : r ? t[e] = l(n) : a && (t[e] = l(i));
				} else if (e === "style") {
					let r = typeof n == "object", a = typeof i == "object", o = typeof n == "string", s = typeof i == "string";
					if (r && a) t[e] = {
						...n,
						...i
					};
					else if (r && s) {
						let r = $(i);
						t[e] = {
							...n,
							...r
						};
					} else if (o && a) t[e] = {
						...$(n),
						...i
					};
					else if (o && s) {
						let r = $(n), a = $(i);
						t[e] = {
							...r,
							...a
						};
					} else r ? t[e] = n : a ? t[e] = i : o ? t[e] = n : s && (t[e] = i);
				} else t[e] = i === void 0 ? n : i;
			}
			for (let e of Object.getOwnPropertySymbols(r)) {
				let n = t[e], i = r[e];
				t[e] = i === void 0 ? n : i;
			}
		}
	}
	return typeof t.style == "object" && (t.style = jr(t.style).replaceAll("\n", " ")), t.hidden === !1 && (t.hidden = void 0, delete t.hidden), t.disabled === !1 && (t.disabled = void 0, delete t.disabled), t;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/runed/dist/internal/configurable-globals.js
var Fr = typeof window < "u" ? window : void 0;
typeof window < "u" && window.document, typeof window < "u" && window.navigator, typeof window < "u" && window.location;
// D:/ドキュメント/GitHub/ehagaki/node_modules/runed/dist/internal/utils/dom.js
function Ir(e) {
	let t = e.activeElement;
	for (; t?.shadowRoot;) {
		let e = t.shadowRoot.activeElement;
		if (e === t) break;
		t = e;
	}
	return t;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte/src/reactivity/set.js
var Lr = [
	"forEach",
	"isDisjointFrom",
	"isSubsetOf",
	"isSupersetOf"
], Rr = [
	"difference",
	"intersection",
	"symmetricDifference",
	"union"
], zr = !1, Br = class e extends Set {
	#e = /* @__PURE__ */ new Map();
	#t = /* @__PURE__ */ D(0);
	#n = /* @__PURE__ */ D(0);
	#r = S || -1;
	constructor(e) {
		if (super(), e) {
			for (var t of e) super.add(t);
			this.#n.v = super.size;
		}
		zr || this.#a();
	}
	#i(e) {
		return S === this.#r ? /* @__PURE__ */ D(e) : ue(e);
	}
	#a() {
		zr = !0;
		var t = e.prototype, n = Set.prototype;
		for (let e of Lr) t[e] = function(...t) {
			return T(this.#t), n[e].apply(this, t);
		};
		for (let r of Rr) t[r] = function(...t) {
			T(this.#t);
			var i = n[r].apply(this, t);
			return new e(i);
		};
	}
	has(e) {
		var t = super.has(e), n = this.#e, r = n.get(e);
		if (r === void 0) {
			if (!t) return T(this.#t), !1;
			r = this.#i(!0), n.set(e, r);
		}
		return T(r), t;
	}
	add(e) {
		return super.has(e) || (super.add(e), h(this.#n, super.size), x(this.#t)), this;
	}
	delete(e) {
		var t = super.delete(e), n = this.#e, r = n.get(e);
		return r !== void 0 && (n.delete(e), h(r, !1)), t && (h(this.#n, super.size), x(this.#t)), t;
	}
	clear() {
		if (super.size !== 0) {
			super.clear();
			var e = this.#e;
			for (var t of e.values()) h(t, !1);
			e.clear(), h(this.#n, 0), x(this.#t);
		}
	}
	keys() {
		return this.values();
	}
	values() {
		return T(this.#t), super.values();
	}
	entries() {
		return T(this.#t), super.entries();
	}
	[Symbol.iterator]() {
		return this.keys();
	}
	get size() {
		return T(this.#n);
	}
}, Vr = class extends Map {
	#e = /* @__PURE__ */ new Map();
	#t = /* @__PURE__ */ D(0);
	#n = /* @__PURE__ */ D(0);
	#r = S || -1;
	constructor(e) {
		if (super(), e) {
			for (var [t, n] of e) super.set(t, n);
			this.#n.v = super.size;
		}
	}
	#i(e) {
		return S === this.#r ? /* @__PURE__ */ D(e) : ue(e);
	}
	has(e) {
		var t = this.#e, n = t.get(e);
		if (n === void 0) {
			if (super.has(e)) n = this.#i(0), t.set(e, n);
			else return T(this.#t), !1;
		}
		return T(n), !0;
	}
	forEach(e, t) {
		this.#a(), super.forEach(e, t);
	}
	get(e) {
		var t = this.#e, n = t.get(e);
		if (n === void 0) {
			if (super.has(e)) n = this.#i(0), t.set(e, n);
			else {
				T(this.#t);
				return;
			}
		}
		return T(n), super.get(e);
	}
	getOrInsert(e, t) {
		return super.has(e) || this.set(e, t), this.get(e);
	}
	getOrInsertComputed(e, t) {
		return super.has(e) || this.set(e, t(e)), this.get(e);
	}
	set(e, t) {
		var n = this.#e, r = n.get(e), i = super.get(e), a = super.set(e, t), o = this.#t;
		if (r === void 0) r = this.#i(0), n.set(e, r), h(this.#n, super.size), x(o);
		else if (i !== t) {
			x(r);
			var s = o.reactions === null ? null : new Set(o.reactions);
			s !== null && r.reactions?.every((e) => s.has(e)) || x(o);
		}
		return a;
	}
	delete(e) {
		var t = this.#e, n = t.get(e), r = super.delete(e);
		return n !== void 0 && (t.delete(e), h(n, -1)), r && (h(this.#n, super.size), x(this.#t)), r;
	}
	clear() {
		if (super.size !== 0) {
			super.clear();
			var e = this.#e;
			h(this.#n, 0);
			for (var t of e.values()) h(t, -1);
			x(this.#t), e.clear();
		}
	}
	#a() {
		T(this.#t);
		var e = this.#e;
		if (this.#n.v !== e.size) {
			for (var t of super.keys()) if (!e.has(t)) {
				var n = this.#i(0);
				e.set(t, n);
			}
		}
		for ([, n] of this.#e) T(n);
	}
	keys() {
		return T(this.#t), super.keys();
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
		return T(this.#n), super.size;
	}
};
new class {
	#e;
	#t;
	constructor(e = {}) {
		let { window: t = Fr, document: n = t?.document } = e;
		t !== void 0 && (this.#e = n, this.#t = m((e) => {
			let n = te(t, "focusin", e), r = te(t, "focusout", e);
			return () => {
				n(), r();
			};
		}));
	}
	get current() {
		return this.#t?.(), this.#e ? Ir(this.#e) : null;
	}
}();
// D:/ドキュメント/GitHub/ehagaki/node_modules/runed/dist/internal/utils/is.js
function Hr(e) {
	return typeof e == "function";
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/runed/dist/utilities/extract/extract.svelte.js
function Ur(e, t) {
	if (Hr(e)) {
		let n = e();
		return n === void 0 ? t : n;
	}
	return e === void 0 ? t : e;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/runed/dist/utilities/context/context.js
var Wr = class {
	#e;
	#t;
	constructor(e) {
		this.#e = e, this.#t = Symbol(e);
	}
	get key() {
		return this.#t;
	}
	exists() {
		return p(this.#t);
	}
	get() {
		let e = E(this.#t);
		if (e === void 0) throw Error(`Context "${this.#e}" not found`);
		return e;
	}
	getOr(e) {
		let t = E(this.#t);
		return t === void 0 ? e : t;
	}
	set(e) {
		return u(this.#t, e);
	}
};
// D:/ドキュメント/GitHub/ehagaki/node_modules/runed/dist/utilities/use-debounce/use-debounce.svelte.js
function Gr(e, t) {
	let n = D(null), r = d(() => Ur(t, 250));
	function i(...t) {
		if (T(n)) T(n).timeout && clearTimeout(T(n).timeout);
		else {
			let e, t, r = new Promise((n, r) => {
				e = n, t = r;
			});
			h(n, {
				timeout: null,
				runner: null,
				promise: r,
				resolve: e,
				reject: t
			}, !0);
		}
		return T(n).runner = async () => {
			if (!T(n)) return;
			let r = T(n);
			h(n, null);
			try {
				r.resolve(await e.apply(this, t));
			} catch (e) {
				r.reject(e);
			}
		}, T(n).timeout = setTimeout(T(n).runner, T(r)), T(n).promise;
	}
	return i.cancel = async () => {
		(!T(n) || T(n).timeout === null) && (await new Promise((e) => setTimeout(e, 0)), !T(n) || T(n).timeout === null) || (clearTimeout(T(n).timeout), T(n).reject("Cancelled"), h(n, null));
	}, i.runScheduledNow = async () => {
		(!T(n) || !T(n).timeout) && (await new Promise((e) => setTimeout(e, 0)), !T(n) || !T(n).timeout) || (clearTimeout(T(n).timeout), T(n).timeout = null, await T(n).runner?.());
	}, Object.defineProperty(i, "pending", {
		enumerable: !0,
		get() {
			return !!T(n)?.timeout;
		}
	}), i;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/runed/dist/utilities/watch/watch.svelte.js
function Kr(e, t) {
	switch (e) {
		case "post":
			ie(t);
			break;
		case "pre": le(t);
	}
}
function qr(e, t, n, r = {}) {
	let { lazy: i = !1 } = r, a = !i, o = Array.isArray(e) ? [] : void 0;
	Kr(t, () => {
		let t = Array.isArray(e) ? e.map((e) => e()) : e();
		if (!a) {
			a = !0, o = t;
			return;
		}
		let r = g(() => n(t, o));
		return o = t, r;
	});
}
function Jr(e, t, n) {
	qr(e, "post", t, n);
}
function Yr(e, t, n) {
	qr(e, "pre", t, n);
}
Jr.pre = Yr;
// D:/ドキュメント/GitHub/ehagaki/node_modules/runed/dist/internal/utils/get.js
function Xr(e) {
	return Hr(e) ? e() : e;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/runed/dist/utilities/element-size/element-size.svelte.js
var Zr = class {
	#e = {
		width: 0,
		height: 0
	};
	#t = !1;
	#n;
	#r;
	#i;
	#a = d(() => (T(this.#s)?.(), this.getSize().width));
	#o = d(() => (T(this.#s)?.(), this.getSize().height));
	#s = d(() => {
		let e = Xr(this.#r);
		if (e) return m((t) => {
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
		this.#i = t.window ?? Fr, this.#n = t, this.#r = e, this.#e = {
			width: 0,
			height: 0
		};
	}
	calculateSize() {
		let e = Xr(this.#r);
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
		return T(this.#s)?.(), this.getSize();
	}
	get width() {
		return T(this.#a);
	}
	get height() {
		return T(this.#o);
	}
}, Qr = class {
	#e = D(!1);
	constructor() {
		ie(() => (g(() => h(this.#e, !0)), () => {
			h(this.#e, !1);
		}));
	}
	get current() {
		return T(this.#e);
	}
}, $r = 1, ei = 9, ti = 11;
function ni(e) {
	return Y(e) && e.nodeType === $r && typeof e.nodeName == "string";
}
function ri(e) {
	return Y(e) && e.nodeType === ei;
}
function ii(e) {
	return Y(e) && e.constructor?.name === "VisualViewport";
}
function ai(e) {
	return Y(e) && e.nodeType !== void 0;
}
function oi(e) {
	return ai(e) && e.nodeType === ti && "host" in e;
}
function si(e, t) {
	if (!e || !t || !ni(e) || !ni(t)) return !1;
	let n = t.getRootNode?.();
	if (e === t || e.contains(t)) return !0;
	if (n && oi(n)) {
		let n = t;
		for (; n;) {
			if (e === n) return !0;
			n = n.parentNode || n.host;
		}
	}
	return !1;
}
function ci(e) {
	return ri(e) ? e : ii(e) ? e.document : e?.ownerDocument ?? document;
}
function li(e) {
	return oi(e) ? li(e.host) : ri(e) ? e.defaultView ?? window : ni(e) ? e.ownerDocument?.defaultView ?? window : window;
}
function ui(e) {
	let t = e.activeElement;
	for (; t?.shadowRoot;) {
		let e = t.shadowRoot.activeElement;
		if (e === t) break;
		t = e;
	}
	return t;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte-toolbelt/dist/utils/dom-context.svelte.js
var di = class {
	element;
	#e = d(() => this.element.current ? this.element.current.getRootNode() ?? document : document);
	get root() {
		return T(this.#e);
	}
	set root(e) {
		h(this.#e, e);
	}
	constructor(e) {
		this.element = typeof e == "function" ? Xn(e) : e;
	}
	getDocument = () => ci(this.root);
	getWindow = () => this.getDocument().defaultView ?? window;
	getActiveElement = () => ui(this.root);
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
function fi(e, t) {
	return { [oe()]: (n) => Z(e) ? (e.current = n, g(() => t?.(n)), () => {
		"isConnected" in n && n.isConnected || (e.current = null, t?.(null));
	}) : (e(n), g(() => t?.(n)), () => {
		"isConnected" in n && n.isConnected || (e(null), t?.(null));
	}) };
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/internal/attrs.js
function pi(e) {
	return e ? "true" : "false";
}
function mi(e) {
	return e ? "true" : void 0;
}
function hi(e) {
	return e ? "" : void 0;
}
function gi(e) {
	return e ? !0 : void 0;
}
function _i(e) {
	return e ? "open" : "closed";
}
function vi(e) {
	return e ? "checked" : "unchecked";
}
function yi(e) {
	return e === "starting" ? { "data-starting-style": "" } : e === "ending" ? { "data-ending-style": "" } : {};
}
function bi(e, t) {
	return t ? "mixed" : e ? "true" : "false";
}
var xi = class {
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
function Si(e) {
	let t = new xi(e);
	return {
		...t.attrs,
		selector: t.selector,
		getAttr: t.getAttr
	};
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/internal/is.js
var Ci = typeof document < "u", wi = Ti();
function Ti() {
	return Ci && window?.navigator?.userAgent && (/iP(ad|hone|od)/.test(window.navigator.userAgent) || window?.navigator?.maxTouchPoints > 2 && /iPad|Macintosh/.test(window?.navigator.userAgent));
}
function Ei(e) {
	return e instanceof HTMLElement;
}
function Di(e) {
	return e instanceof Element;
}
function Oi(e) {
	return e instanceof Element || e instanceof SVGElement;
}
function ki(e) {
	return !Number.isNaN(Number(e)) && !Number.isNaN(Number.parseFloat(e));
}
function Ai(e) {
	return e === null;
}
function ji(e) {
	return e?.matches(":disabled") ?? !1;
}
function Mi(e) {
	return e.pointerType === "touch";
}
function Ni(e) {
	return e.matches(":focus-visible");
}
function Pi(e) {
	return e !== null;
}
function Fi(e) {
	return e instanceof HTMLInputElement && "select" in e;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/internal/create-id.js
function Ii(e, t) {
	return t === void 0 ? `bits-${e}` : `bits-${e}-${t}`;
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/utils/htmlSanitizer.ts
function Li(e) {
	return e.split("<wbr>").map((e) => e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")).join("<wbr>");
}
// D:/ドキュメント/GitHub/ehagaki/src/components/LoadingPlaceholder.svelte
var Ri = C("<div class=\"loader-container svelte-1yk1wr7\"><div class=\"square svelte-1yk1wr7\"></div> <div class=\"square svelte-1yk1wr7\"></div> <div class=\"square svelte-1yk1wr7\"></div> <div class=\"square svelte-1yk1wr7\"></div> <div class=\"square svelte-1yk1wr7\"></div></div>"), zi = C("<span class=\"inline-spinner svelte-1yk1wr7\" aria-hidden=\"true\"></span>"), Bi = C("<span></span>"), Vi = C("<div><!> <!> <!></div>"), Hi = {
	hash: "svelte-1yk1wr7",
	code: "button:disabled.loading {opacity:1;}.loading-placeholder.svelte-1yk1wr7 {display:flex;flex-wrap:wrap;align-items:center;justify-content:center;column-gap:4px;position:relative;width:100%;}.placeholder-text.svelte-1yk1wr7 {padding:0 4px;color:var(--text);opacity:0.8;font-size:0.875rem;font-weight:500;}.primary .loading-placeholder .placeholder-text {color:whitesmoke;opacity:0.9;font-size:inherit;}.loading-text.svelte-1yk1wr7 {\n        animation: svelte-1yk1wr7-pulse-text 1.5s ease-in-out infinite;}\n\n    @keyframes svelte-1yk1wr7-pulse-text {\n        0%,\n        100% {\n            opacity: 0.9;\n        }\n        50% {\n            opacity: 0.6;\n        }\n    }\n    /* shimmer animation for button loading (if needed) */.shimmer {position:absolute;top:0;left:-100%;width:100%;height:100%;background:linear-gradient(\n            90deg,\n            transparent,\n            rgba(255, 255, 255, 0.2),\n            transparent\n        );\n        animation: svelte-1yk1wr7-shimmer 1.5s infinite;pointer-events:none;}\n    @keyframes svelte-1yk1wr7-shimmer {\n        0% {\n            left: -100%;\n        }\n        100% {\n            left: 100%;\n        }\n    }\n    /* 正方形たちをまとめるコンテナ */.loader-container.svelte-1yk1wr7 {position:relative;width:var(--loader-size);height:var(--loader-size);}.inline-spinner.svelte-1yk1wr7 {--spinner-width: clamp(\n            3.5px,\n            calc(var(--loader-size) * 0.16),\n            6px\n        );--spinner-track-opacity: 0.12;--spinner-arc-opacity: 0.64;position:relative;display:block;width:var(--loader-size);height:var(--loader-size);flex:0 0 auto;color:currentColor;border-radius:50%;box-sizing:border-box;}.inline-spinner.svelte-1yk1wr7::before {content:\"\";position:absolute;inset:0;border-radius:inherit;border:var(--spinner-width) solid currentColor;opacity:var(--spinner-track-opacity);box-sizing:border-box;}.inline-spinner.svelte-1yk1wr7::after {content:\"\";position:absolute;inset:0;border-radius:inherit;background:conic-gradient(\n            from -80deg,\n            transparent 0deg,\n            transparent 210deg,\n            currentColor 300deg,\n            currentColor 360deg\n        );-webkit-mask:radial-gradient(\n            farthest-side,\n            transparent calc(100% - var(--spinner-width)),\n            #000 calc(100% - var(--spinner-width) + 0.5px)\n        );mask:radial-gradient(\n            farthest-side,\n            transparent calc(100% - var(--spinner-width)),\n            #000 calc(100% - var(--spinner-width) + 0.5px)\n        );opacity:var(--spinner-arc-opacity);\n        animation: svelte-1yk1wr7-inline-spinner-rotate\n            900ms\n            cubic-bezier(0.55, 0.15, 0.45, 0.85)\n            infinite;transform-origin:center;}:root.dark .ehagaki-app-root .inline-spinner.svelte-1yk1wr7,\n    :host(.dark) .ehagaki-app-root .inline-spinner.svelte-1yk1wr7 {--spinner-track-opacity: 0.14;--spinner-arc-opacity: 0.72;}.ehagaki-app-root :where(.primary, .danger) .inline-spinner.svelte-1yk1wr7 {--spinner-track-opacity: 0.18;--spinner-arc-opacity: 0.82;}.ehagaki-app-root :where(.secondary, .warning) .inline-spinner.svelte-1yk1wr7,\n    :root.light .ehagaki-app-root :where(.header) .inline-spinner.svelte-1yk1wr7,\n    :host(.light) .ehagaki-app-root :where(.header) .inline-spinner.svelte-1yk1wr7 {--spinner-track-opacity: 0.12;--spinner-arc-opacity: 0.64;}\n\n    @keyframes svelte-1yk1wr7-inline-spinner-rotate {\n        to {\n            transform: rotate(360deg);\n        }\n    }\n    /* 正方形の基本スタイル */.square.svelte-1yk1wr7 {position:absolute;top:25%;left:25%;border:none;border-radius:20%;opacity:1;background-color:var(--theme);\n        animation: svelte-1yk1wr7-compactFloatAndRotate 4s infinite ease-in-out;}.primary.loading .loader-container .square {background-color:whitesmoke;}\n\n    /* アニメーションの定義 */\n    @keyframes svelte-1yk1wr7-compactFloatAndRotate {\n        0% {\n            transform: translate(-25%, -25%) scale(1) rotate(0deg);\n        }\n        20% {\n            transform: translate(\n                    calc(var(--loader-size) * 0.3),\n                    calc(var(--loader-size) * 0.25)\n                )\n                scale(0.6) rotate(-170deg);\n        }\n        40% {\n            transform: translate(\n                    calc(var(--loader-size) * 0.2),\n                    calc(var(--loader-size) * -0.05)\n                )\n                scale(1.05) rotate(200deg);\n        }\n        60% {\n            transform: translate(\n                    calc(var(--loader-size) * -0.05),\n                    calc(var(--loader-size) * -0.1)\n                )\n                scale(0.9) rotate(-220deg);\n        }\n        80% {\n            transform: translate(0, calc(var(--loader-size) * 0.3)) scale(0.5)\n                rotate(0deg);\n        }\n        100% {\n            transform: translate(-25%, -25%) scale(1) rotate(360deg);\n        }\n    }\n    /* 各正方形のサイズとアニメーション開始タイミングを個別に設定 */.square.svelte-1yk1wr7:nth-child(1) {width:calc(var(--loader-size) * 0.2);height:calc(var(--loader-size) * 0.2);animation-delay:-4s;}.square.svelte-1yk1wr7:nth-child(2) {width:calc(var(--loader-size) * 0.3);height:calc(var(--loader-size) * 0.3);animation-delay:-3s;}.square.svelte-1yk1wr7:nth-child(3) {width:calc(var(--loader-size) * 0.35);height:calc(var(--loader-size) * 0.35);animation-delay:-1s;}.square.svelte-1yk1wr7:nth-child(4) {width:calc(var(--loader-size) * 0.45);height:calc(var(--loader-size) * 0.45);animation-delay:-2s;}\n\n    @media (prefers-reduced-motion: reduce) {.loading-text.svelte-1yk1wr7 {\n            animation: none;opacity:0.8;}.shimmer {\n            animation: none;left:0;}.square.svelte-1yk1wr7 {\n            animation: none;transform:translate(-25%, -25%) scale(1) rotate(0deg);}.inline-spinner.svelte-1yk1wr7::after {\n            animation: none;transform:rotate(35deg);}\n    }"
};
function Ui(e, t) {
	r(t, !0), re(e, Hi);
	let l = () => ce(Un, "$_", u), [u, p] = se(), m = w(t, "text", 3, !1), h = w(t, "showLoader", 3, !1), g = w(t, "customClass", 3, ""), v = w(t, "state", 3, void 0), b = w(t, "loaderSize", 3, 40), te = w(t, "variant", 3, "loader"), x = w(t, "ariaHidden", 3, !1), ne = d(() => typeof m() == "string" ? m() : m() === !0 ? l()("loadingPlaceholder.loading") : ""), ie = d(() => Li(T(ne))), oe = d(() => v() ? v() === "loading" : h()), S = d(() => typeof b() == "number" ? `${b()}px` : b());
	var C = Vi(), le = ee(C), ue = (e) => {
		var t = Ri();
		let n;
		y(() => n = f(t, "", n, { "--loader-size": T(S) })), o(e, t);
	};
	n(le, (e) => {
		T(oe) && te() === "loader" && e(ue);
	});
	var E = ae(le, 2), D = (e) => {
		var t = zi();
		let n;
		y(() => n = f(t, "", n, { "--loader-size": T(S) })), o(e, t);
	};
	n(E, (e) => {
		T(oe) && te() === "spinner" && e(D);
	});
	var de = ae(E, 2), O = (e) => {
		var t = Bi();
		let n;
		s(t, () => T(ie), !0), c(t), y(() => n = i(t, 1, "placeholder-text svelte-1yk1wr7", null, n, { "loading-text": T(oe) })), o(e, t);
	};
	n(de, (e) => {
		T(ne) && e(O);
	}), c(C), y(() => {
		i(C, 1, `loading-placeholder ${g() ?? ""}`, "svelte-1yk1wr7"), _(C, "aria-label", T(ne)), _(C, "aria-hidden", x() ? "true" : void 0);
	}), o(e, C), a(), p();
}
export { G as $, li as A, Dr as B, _i as C, si as D, di as E, Wr as F, Xn as G, X as H, Vr as I, Yn as J, Z as K, Br as L, Zr as M, Jr as N, ui as O, Gr as P, Wn as Q, Pr as R, vi as S, fi as T, $n as U, $ as V, Qn as W, er as X, tr as Y, Un as Z, pi as _, ji as a, Si as b, Ni as c, Pi as d, wn as et, Ai as f, hi as g, Mi as h, Ci as i, Qr as j, ci as k, Ei as l, Fi as m, Li as n, nn as nt, Di as o, ki as p, Zn as q, Ii as r, Gn as rt, Oi as s, Ui as t, un as tt, wi as u, mi as v, yi as w, bi as x, gi as y, jr as z };
