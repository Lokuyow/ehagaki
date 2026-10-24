// D:/ドキュメント/GitHub/ehagaki/node_modules/@floating-ui/utils/dist/floating-ui.utils.mjs
var e = [
	"top",
	"right",
	"bottom",
	"left"
], t = Math.min, n = Math.max, r = Math.round, i = Math.floor, a = (e) => ({
	x: e,
	y: e
}), o = {
	left: "right",
	right: "left",
	bottom: "top",
	top: "bottom"
};
function s(e, r, i) {
	return n(e, t(r, i));
}
function c(e, t) {
	return typeof e == "function" ? e(t) : e;
}
function l(e) {
	return e.split("-")[0];
}
function u(e) {
	return e.split("-")[1];
}
function d(e) {
	return e === "x" ? "y" : "x";
}
function f(e) {
	return e === "y" ? "height" : "width";
}
function p(e) {
	let t = e[0];
	return t === "t" || t === "b" ? "y" : "x";
}
function m(e) {
	return d(p(e));
}
function h(e, t, n) {
	n === void 0 && (n = !1);
	let r = u(e), i = m(e), a = f(i), o = i === "x" ? r === (n ? "end" : "start") ? "right" : "left" : r === "start" ? "bottom" : "top";
	return t.reference[a] > t.floating[a] && (o = w(o)), [o, w(o)];
}
function g(e) {
	let t = w(e);
	return [
		_(e),
		t,
		_(t)
	];
}
function _(e) {
	return e.includes("start") ? e.replace("start", "end") : e.replace("end", "start");
}
var v = ["left", "right"], y = ["right", "left"], b = ["top", "bottom"], x = ["bottom", "top"];
function S(e, t, n) {
	switch (e) {
		case "top":
		case "bottom": return n ? t ? y : v : t ? v : y;
		case "left":
		case "right": return t ? b : x;
		default: return [];
	}
}
function C(e, t, n, r) {
	let i = u(e), a = S(l(e), n === "start", r);
	return i && (a = a.map((e) => e + "-" + i), t && (a = a.concat(a.map(_)))), a;
}
function w(e) {
	let t = l(e);
	return o[t] + e.slice(t.length);
}
function T(e) {
	return {
		top: e.top ?? 0,
		right: e.right ?? 0,
		bottom: e.bottom ?? 0,
		left: e.left ?? 0
	};
}
function E(e) {
	return typeof e == "number" ? {
		top: e,
		right: e,
		bottom: e,
		left: e
	} : T(e);
}
function D(e) {
	let { x: t, y: n, width: r, height: i } = e;
	return {
		width: r,
		height: i,
		top: n,
		left: t,
		right: t + r,
		bottom: n + i,
		x: t,
		y: n
	};
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/@floating-ui/core/dist/floating-ui.core.mjs
function O(e, t, n) {
	let { reference: r, floating: i } = e, a = p(t), o = m(t), s = f(o), c = l(t), d = a === "y", h = r.x + r.width / 2 - i.width / 2, g = r.y + r.height / 2 - i.height / 2, _ = r[s] / 2 - i[s] / 2, v;
	switch (c) {
		case "top":
			v = {
				x: h,
				y: r.y - i.height
			};
			break;
		case "bottom":
			v = {
				x: h,
				y: r.y + r.height
			};
			break;
		case "right":
			v = {
				x: r.x + r.width,
				y: g
			};
			break;
		case "left":
			v = {
				x: r.x - i.width,
				y: g
			};
			break;
		default: v = {
			x: r.x,
			y: r.y
		};
	}
	let y = u(t);
	return y && (v[o] += _ * (y === "end" ? 1 : -1) * (n && d ? -1 : 1)), v;
}
async function k(e, t) {
	t === void 0 && (t = {});
	let { x: n, y: r, platform: i, rects: a, elements: o, strategy: s } = e, { boundary: l = "clippingAncestors", rootBoundary: u = "viewport", elementContext: d = "floating", altBoundary: f = !1, padding: p = 0 } = c(t, e), m = E(p), h = o[f ? d === "floating" ? "reference" : "floating" : d], g = D(await i.getClippingRect({
		element: await (i.isElement == null ? void 0 : i.isElement(h)) ?? !0 ? h : h.contextElement || await (i.getDocumentElement == null ? void 0 : i.getDocumentElement(o.floating)),
		boundary: l,
		rootBoundary: u,
		strategy: s
	})), _ = d === "floating" ? {
		x: n,
		y: r,
		width: a.floating.width,
		height: a.floating.height
	} : a.reference, v = await (i.getOffsetParent == null ? void 0 : i.getOffsetParent(o.floating)), y = await (i.isElement == null ? void 0 : i.isElement(v)) && await (i.getScale == null ? void 0 : i.getScale(v)) || {
		x: 1,
		y: 1
	}, b = D(i.convertOffsetParentRelativeRectToViewportRelativeRect ? await i.convertOffsetParentRelativeRectToViewportRelativeRect({
		elements: o,
		rect: _,
		offsetParent: v,
		strategy: s
	}) : _);
	return {
		top: (g.top - b.top + m.top) / y.y,
		bottom: (b.bottom - g.bottom + m.bottom) / y.y,
		left: (g.left - b.left + m.left) / y.x,
		right: (b.right - g.right + m.right) / y.x
	};
}
var A = 50, j = async (e, t, n) => {
	let { placement: r = "bottom", strategy: i = "absolute", middleware: a = [], platform: o } = n, s = o.detectOverflow ? o : {
		...o,
		detectOverflow: k
	}, c = await (o.isRTL == null ? void 0 : o.isRTL(t)), l = await o.getElementRects({
		reference: e,
		floating: t,
		strategy: i
	}), { x: u, y: d } = O(l, r, c), f = r, p = 0, m = {};
	for (let n = 0; n < a.length; n++) {
		let h = a[n];
		if (!h) continue;
		let { name: g, fn: _ } = h, { x: v, y, data: b, reset: x } = await _({
			x: u,
			y: d,
			initialPlacement: r,
			placement: f,
			strategy: i,
			middlewareData: m,
			rects: l,
			platform: s,
			elements: {
				reference: e,
				floating: t
			}
		});
		u = v ?? u, d = y ?? d, m[g] = {
			...m[g],
			...b
		}, x && p < A && (p++, typeof x == "object" && (x.placement && (f = x.placement), x.rects && (l = x.rects === !0 ? await o.getElementRects({
			reference: e,
			floating: t,
			strategy: i
		}) : x.rects), {x: u, y: d} = O(l, f, c)), n = -1);
	}
	return {
		x: u,
		y: d,
		placement: f,
		strategy: i,
		middlewareData: m
	};
}, M = (e) => ({
	name: "arrow",
	options: e,
	async fn(n) {
		let { x: r, y: i, placement: a, rects: o, platform: l, elements: d, middlewareData: p } = n, { element: h, padding: g = 0 } = c(e, n) || {};
		if (h == null) return {};
		let _ = E(g), v = {
			x: r,
			y: i
		}, y = m(a), b = f(y), x = await l.getDimensions(h), S = y === "y", C = S ? "top" : "left", w = S ? "bottom" : "right", T = S ? "clientHeight" : "clientWidth", D = o.reference[b] + o.reference[y] - v[y] - o.floating[b], O = v[y] - o.reference[y], k = await (l.getOffsetParent == null ? void 0 : l.getOffsetParent(h)), A = k ? k[T] : 0;
		A && await (l.isElement == null ? void 0 : l.isElement(k)) || (A = d.floating[T] || o.floating[b]);
		let j = D / 2 - O / 2, M = A / 2 - x[b] / 2 - 1, N = t(_[C], M), ee = t(_[w], M), P = A - x[b] - ee, F = A / 2 - x[b] / 2 + j, I = s(N, F, P), te = !p.arrow && u(a) != null && F !== I && o.reference[b] / 2 - (F < N ? N : ee) - x[b] / 2 < 0, L = te ? F < N ? F - N : F - P : 0;
		return {
			[y]: v[y] + L,
			data: {
				[y]: I,
				centerOffset: F - I - L,
				...te && { alignmentOffset: L }
			},
			reset: te
		};
	}
}), N = function(e) {
	return e === void 0 && (e = {}), {
		name: "flip",
		options: e,
		async fn(t) {
			var n;
			let { placement: r, middlewareData: i, rects: a, initialPlacement: o, platform: s, elements: u } = t, { mainAxis: d = !0, crossAxis: f = !0, fallbackPlacements: m, fallbackStrategy: _ = "bestFit", fallbackAxisSideDirection: v = "none", flipAlignment: y = !0, ...b } = c(e, t);
			if ((n = i.arrow) != null && n.alignmentOffset) return {};
			let x = l(r), S = p(o), T = l(o) === o, E = await (s.isRTL == null ? void 0 : s.isRTL(u.floating)), D = m || (T || !y ? [w(o)] : g(o)), O = v !== "none";
			!m && O && D.push(...C(o, y, v, E));
			let k = [o, ...D], A = await s.detectOverflow(t, b), j = [], M = i.flip?.overflows || [];
			if (d && j.push(A[x]), f) {
				let e = h(r, a, E);
				j.push(A[e[0]], A[e[1]]);
			}
			if (M = [...M, {
				placement: r,
				overflows: j
			}], !j.every((e) => e <= 0)) {
				let e = (i.flip?.index || 0) + 1, t = k[e];
				if (t && (f !== "alignment" || S === p(t) || M.every((e) => p(e.placement) !== S || e.overflows[0] > 0))) return {
					data: {
						index: e,
						overflows: M
					},
					reset: { placement: t }
				};
				let n = M.filter((e) => e.overflows[0] <= 0).sort((e, t) => e.overflows[1] - t.overflows[1])[0]?.placement;
				if (!n) switch (_) {
					case "bestFit": {
						let e = M.filter((e) => {
							if (O) {
								let t = p(e.placement);
								return t === S || t === "y";
							}
							return !0;
						}).map((e) => [e.placement, e.overflows.filter((e) => e > 0).reduce((e, t) => e + t, 0)]).sort((e, t) => e[1] - t[1])[0]?.[0];
						e && (n = e);
						break;
					}
					case "initialPlacement": n = o;
				}
				if (r !== n) return { reset: { placement: n } };
			}
			return {};
		}
	};
};
function ee(e, t) {
	return {
		top: e.top - t.height,
		right: e.right - t.width,
		bottom: e.bottom - t.height,
		left: e.left - t.width
	};
}
function P(t) {
	return e.some((e) => t[e] >= 0);
}
var F = function(e) {
	return e === void 0 && (e = {}), {
		name: "hide",
		options: e,
		async fn(t) {
			let { rects: n, platform: r } = t, { strategy: i = "referenceHidden", ...a } = c(e, t);
			switch (i) {
				case "referenceHidden": {
					let e = ee(await r.detectOverflow(t, {
						...a,
						elementContext: "reference"
					}), n.reference);
					return { data: {
						referenceHiddenOffsets: e,
						referenceHidden: P(e)
					} };
				}
				case "escaped": {
					let e = ee(await r.detectOverflow(t, {
						...a,
						altBoundary: !0
					}), n.floating);
					return { data: {
						escapedOffsets: e,
						escaped: P(e)
					} };
				}
				default: return {};
			}
		}
	};
}, I = /*#__PURE__*/ new Set(["left", "top"]);
async function te(e, t) {
	let { placement: n, platform: r, elements: i } = e, a = await (r.isRTL == null ? void 0 : r.isRTL(i.floating)), o = l(n), s = u(n), d = p(n) === "y", f = I.has(o) ? -1 : 1, m = a && d ? -1 : 1, h = c(t, e), { mainAxis: g, crossAxis: _, alignmentAxis: v } = typeof h == "number" ? {
		mainAxis: h,
		crossAxis: 0,
		alignmentAxis: null
	} : {
		mainAxis: h.mainAxis || 0,
		crossAxis: h.crossAxis || 0,
		alignmentAxis: h.alignmentAxis
	};
	return s && typeof v == "number" && (_ = s === "end" ? v * -1 : v), d ? {
		x: _ * m,
		y: g * f
	} : {
		x: g * f,
		y: _ * m
	};
}
var L = function(e) {
	return e === void 0 && (e = 0), {
		name: "offset",
		options: e,
		async fn(t) {
			var n;
			let { x: r, y: i, placement: a, middlewareData: o } = t, s = await te(t, e);
			return a === o.offset?.placement && (n = o.arrow) != null && n.alignmentOffset ? {} : {
				x: r + s.x,
				y: i + s.y,
				data: {
					...s,
					placement: a
				}
			};
		}
	};
}, ne = function(e) {
	return e === void 0 && (e = {}), {
		name: "shift",
		options: e,
		async fn(t) {
			let { x: n, y: r, placement: i, platform: a } = t, { mainAxis: o = !0, crossAxis: l = !1, limiter: u = { fn: (e) => {
				let { x: t, y: n } = e;
				return {
					x: t,
					y: n
				};
			} }, ...f } = c(e, t), m = {
				x: n,
				y: r
			}, h = await a.detectOverflow(t, f), g = p(i), _ = d(g), v = m[_], y = m[g], b = (e, t) => s(t + h[e === "y" ? "top" : "left"], t, t - h[e === "y" ? "bottom" : "right"]);
			o && (v = b(_, v)), l && (y = b(g, y));
			let x = u.fn({
				...t,
				[_]: v,
				[g]: y
			});
			return {
				...x,
				data: {
					x: x.x - n,
					y: x.y - r,
					enabled: {
						[_]: o,
						[g]: l
					}
				}
			};
		}
	};
}, re = function(e) {
	return e === void 0 && (e = {}), {
		options: e,
		fn(t) {
			let { x: n, y: r, placement: i, rects: a, middlewareData: o } = t, { offset: s = 0, mainAxis: u = !0, crossAxis: f = !0 } = c(e, t), m = {
				x: n,
				y: r
			}, h = p(i), g = d(h), _ = m[g], v = m[h], y = c(s, t), b = typeof y == "number" ? {
				mainAxis: y,
				crossAxis: 0
			} : {
				mainAxis: y.mainAxis ?? 0,
				crossAxis: y.crossAxis ?? 0
			};
			if (u) {
				let e = g === "y" ? "height" : "width", t = a.reference[g] - a.floating[e] + b.mainAxis, n = a.reference[g] + a.reference[e] - b.mainAxis;
				_ < t ? _ = t : _ > n && (_ = n);
			}
			if (f) {
				let e = g === "y" ? "width" : "height", t = I.has(l(i)), n = a.reference[h] - a.floating[e] + (t && o.offset?.[h] || 0) + (t ? 0 : b.crossAxis), r = a.reference[h] + a.reference[e] + (t ? 0 : o.offset?.[h] || 0) - (t ? b.crossAxis : 0);
				v < n ? v = n : v > r && (v = r);
			}
			return {
				[g]: _,
				[h]: v
			};
		}
	};
}, ie = function(e) {
	return e === void 0 && (e = {}), {
		name: "size",
		options: e,
		async fn(r) {
			let { placement: i, rects: a, platform: o, elements: s } = r, { apply: d = () => {}, ...f } = c(e, r), m = await o.detectOverflow(r, f), h = l(i), g = u(i), _ = p(i) === "y", { width: v, height: y } = a.floating, b, x;
			h === "top" || h === "bottom" ? (b = h, x = g === (await (o.isRTL == null ? void 0 : o.isRTL(s.floating)) ? "start" : "end") ? "left" : "right") : (x = h, b = g === "end" ? "top" : "bottom");
			let S = y - m.top - m.bottom, C = v - m.left - m.right, w = t(y - m[b], S), T = t(v - m[x], C), E = r.middlewareData.shift, D = !E, O = w, k = T;
			E != null && E.enabled.x && (k = C), E != null && E.enabled.y && (O = S), D && !g && (_ ? k = v - 2 * n(m.left, m.right) : O = y - 2 * n(m.top, m.bottom)), await d({
				...r,
				availableWidth: k,
				availableHeight: O
			});
			let A = await o.getDimensions(s.floating);
			return v !== A.width || y !== A.height ? { reset: { rects: !0 } } : {};
		}
	};
};
// D:/ドキュメント/GitHub/ehagaki/node_modules/@floating-ui/utils/dist/floating-ui.utils.dom.mjs
function R() {
	return typeof window < "u";
}
function z(e) {
	return ae(e) ? (e.nodeName || "").toLowerCase() : "#document";
}
function B(e) {
	var t;
	return (e == null || (t = e.ownerDocument) == null ? void 0 : t.defaultView) || window;
}
function V(e) {
	return ((ae(e) ? e.ownerDocument : e.document) || window.document)?.documentElement;
}
function ae(e) {
	return R() ? e instanceof Node || e instanceof B(e).Node : !1;
}
function H(e) {
	return R() ? e instanceof Element || e instanceof B(e).Element : !1;
}
function U(e) {
	return R() ? e instanceof HTMLElement || e instanceof B(e).HTMLElement : !1;
}
function oe(e) {
	return !R() || typeof ShadowRoot > "u" ? !1 : e instanceof ShadowRoot || e instanceof B(e).ShadowRoot;
}
function W(e) {
	let { overflow: t, overflowX: n, overflowY: r, display: i } = J(e);
	return /auto|scroll|overlay|hidden|clip/.test(t + r + n) && i !== "inline" && i !== "contents";
}
function se(e) {
	return /^(table|td|th)$/.test(z(e));
}
function G(e) {
	try {
		if (e.matches(":popover-open")) return !0;
	} catch {}
	try {
		return e.matches(":modal");
	} catch {
		return !1;
	}
}
var ce = /transform|translate|scale|rotate|perspective|filter/, le = /paint|layout|strict|content/, K = (e) => !!e && e !== "none", ue;
function de(e) {
	let t = H(e) ? J(e) : e;
	return K(t.transform) || K(t.translate) || K(t.scale) || K(t.rotate) || K(t.perspective) || !pe() && (K(t.backdropFilter) || K(t.filter)) || ce.test(t.willChange || "") || le.test(t.contain || "");
}
function fe(e) {
	let t = X(e);
	for (; U(t) && !q(t);) {
		if (de(t)) return t;
		if (G(t)) return null;
		t = X(t);
	}
	return null;
}
function pe() {
	return ue ??= typeof CSS < "u" && CSS.supports && CSS.supports("-webkit-backdrop-filter", "none"), ue;
}
function q(e) {
	return /^(html|body|#document)$/.test(z(e));
}
function J(e) {
	return B(e).getComputedStyle(e);
}
function Y(e) {
	return H(e) ? {
		scrollLeft: e.scrollLeft,
		scrollTop: e.scrollTop
	} : {
		scrollLeft: e.scrollX,
		scrollTop: e.scrollY
	};
}
function X(e) {
	if (z(e) === "html") return e;
	let t = e.assignedSlot || e.parentNode || oe(e) && e.host || V(e);
	return oe(t) ? t.host : t;
}
function me(e) {
	let t = X(e);
	return q(t) ? (e.ownerDocument || e).body : U(t) && W(t) ? t : me(t);
}
function Z(e, t, n) {
	t === void 0 && (t = []), n === void 0 && (n = !0);
	let r = me(e), i = r === e.ownerDocument?.body, a = B(r);
	if (i) {
		let e = he(a);
		return t.concat(a, a.visualViewport || [], W(r) ? r : [], e && n ? Z(e) : []);
	}
	return t.concat(r, Z(r, [], n));
}
function he(e) {
	return e.parent && Object.getPrototypeOf(e.parent) ? e.frameElement : null;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/@floating-ui/dom/dist/floating-ui.dom.mjs
function ge(e) {
	let t = J(e), n = parseFloat(t.width) || 0, i = parseFloat(t.height) || 0, a = U(e), o = a ? e.offsetWidth : n, s = a ? e.offsetHeight : i, c = r(n) !== o || r(i) !== s;
	return c && (n = o, i = s), {
		width: n,
		height: i,
		$: c
	};
}
function _e(e) {
	return H(e) ? e : e.contextElement;
}
function Q(e) {
	let t = _e(e);
	if (!U(t)) return a(1);
	let n = t.getBoundingClientRect(), { width: i, height: o, $: s } = ge(t), c = (s ? r(n.width) : n.width) / i, l = (s ? r(n.height) : n.height) / o;
	return c && Number.isFinite(c) || (c = 1), l && Number.isFinite(l) || (l = 1), {
		x: c,
		y: l
	};
}
var ve = /*#__PURE__*/ a(0);
function ye(e) {
	let t = B(e);
	return !pe() || !t.visualViewport ? ve : {
		x: t.visualViewport.offsetLeft,
		y: t.visualViewport.offsetTop
	};
}
function be(e, t, n) {
	return t === void 0 && (t = !1), !!n && t && n === B(e);
}
function $(e, t, n, r) {
	t === void 0 && (t = !1), n === void 0 && (n = !1);
	let i = e.getBoundingClientRect(), o = _e(e), s = a(1);
	t && (r ? H(r) && (s = Q(r)) : s = Q(e));
	let c = be(o, n, r) ? ye(o) : a(0), l = (i.left + c.x) / s.x, u = (i.top + c.y) / s.y, d = i.width / s.x, f = i.height / s.y;
	if (o && r) {
		let e = B(o), t = H(r) ? B(r) : r, n = e, i = he(n);
		for (; i && t !== n;) {
			let e = Q(i), t = i.getBoundingClientRect(), r = J(i), a = t.left + (i.clientLeft + parseFloat(r.paddingLeft)) * e.x, o = t.top + (i.clientTop + parseFloat(r.paddingTop)) * e.y;
			l *= e.x, u *= e.y, d *= e.x, f *= e.y, l += a, u += o, n = B(i), i = he(n);
		}
	}
	return D({
		width: d,
		height: f,
		x: l,
		y: u
	});
}
function xe(e, t) {
	let n = Y(e).scrollLeft;
	return t ? t.left + n : $(V(e)).left + n;
}
function Se(e, t) {
	let n = e.getBoundingClientRect();
	return {
		x: n.left + t.scrollLeft - xe(e, n),
		y: n.top + t.scrollTop
	};
}
function Ce(e) {
	let { elements: t, rect: n, offsetParent: r, strategy: i } = e, o = i === "fixed", s = V(r), c = t ? G(t.floating) : !1;
	if (r === s || c && o) return n;
	let l = {
		scrollLeft: 0,
		scrollTop: 0
	}, u = a(1), d = a(0), f = U(r);
	if ((f || !o) && ((z(r) !== "body" || W(s)) && (l = Y(r)), f)) {
		let e = $(r);
		u = Q(r), d.x = e.x + r.clientLeft, d.y = e.y + r.clientTop;
	}
	let p = s && !f && !o ? Se(s, l) : a(0);
	return {
		width: n.width * u.x,
		height: n.height * u.y,
		x: n.x * u.x - l.scrollLeft * u.x + d.x + p.x,
		y: n.y * u.y - l.scrollTop * u.y + d.y + p.y
	};
}
function we(e) {
	return e.getClientRects ? Array.from(e.getClientRects()) : [];
}
function Te(e) {
	let t = Y(e), r = e.ownerDocument.body, i = n(e.scrollWidth, e.clientWidth, r.scrollWidth, r.clientWidth), a = n(e.scrollHeight, e.clientHeight, r.scrollHeight, r.clientHeight), o = -t.scrollLeft + xe(e), s = -t.scrollTop;
	return J(r).direction === "rtl" && (o += n(e.clientWidth, r.clientWidth) - i), {
		width: i,
		height: a,
		x: o,
		y: s
	};
}
var Ee = 25;
function De(e, t, n) {
	n === void 0 && (n = "viewport");
	let r = n === "layoutViewport", i = B(e), a = V(e), o = i.visualViewport, s = a.clientWidth, c = a.clientHeight, l = 0, u = 0;
	if (o) {
		let e = !pe() || t === "fixed";
		r ? e || (l = -o.offsetLeft, u = -o.offsetTop) : (s = o.width, c = o.height, e && (l = o.offsetLeft, u = o.offsetTop));
	}
	if (xe(a) <= 0) {
		let e = a.ownerDocument, t = e.body, n = getComputedStyle(t), r = e.compatMode === "CSS1Compat" && parseFloat(n.marginLeft) + parseFloat(n.marginRight) || 0, i = Math.abs(a.clientWidth - t.clientWidth - r), o = getComputedStyle(a).scrollbarGutter === "stable both-edges" ? i / 2 : i;
		o <= Ee && (s -= o);
	}
	return {
		width: s,
		height: c,
		x: l,
		y: u
	};
}
function Oe(e, t) {
	let n = $(e, !0, t === "fixed"), r = n.top + e.clientTop, i = n.left + e.clientLeft, a = Q(e);
	return {
		width: e.clientWidth * a.x,
		height: e.clientHeight * a.y,
		x: i * a.x,
		y: r * a.y
	};
}
function ke(e, t, n) {
	let r;
	if (t === "viewport" || t === "layoutViewport") r = De(e, n, t);
	else if (t === "document") r = Te(V(e));
	else if (H(t)) r = Oe(t, n);
	else {
		let n = ye(e);
		r = {
			x: t.x - n.x,
			y: t.y - n.y,
			width: t.width,
			height: t.height
		};
	}
	return D(r);
}
function Ae(e, t) {
	let n = t.get(e);
	if (n) return n;
	let r = Z(e, [], !1).filter((e) => H(e) && z(e) !== "body"), i = null, a = J(e).position === "fixed", o = a ? X(e) : e;
	for (; H(o) && !q(o);) {
		let e = J(o), t = de(o), n = i ? i.position : a ? "fixed" : "";
		!t && (n === "fixed" || n === "absolute" && e.position === "static") ? r = r.filter((e) => e !== o) : i = e, o = X(o);
	}
	return t.set(e, r), r;
}
function je(e) {
	let { element: r, boundary: i, rootBoundary: a, strategy: o } = e, s = [...i === "clippingAncestors" ? G(r) ? [] : Ae(r, this._c) : [].concat(i), a], c = ke(r, s[0], o), l = c.top, u = c.right, d = c.bottom, f = c.left;
	for (let e = 1; e < s.length; e++) {
		let i = ke(r, s[e], o);
		l = n(i.top, l), u = t(i.right, u), d = t(i.bottom, d), f = n(i.left, f);
	}
	return {
		width: u - f,
		height: d - l,
		x: f,
		y: l
	};
}
function Me(e) {
	let { width: t, height: n } = ge(e);
	return {
		width: t,
		height: n
	};
}
function Ne(e, t, n) {
	let r = U(t), i = V(t), o = n === "fixed", s = $(e, !0, o, t), c = {
		scrollLeft: 0,
		scrollTop: 0
	}, l = a(0);
	if ((r || !o) && ((z(t) !== "body" || W(i)) && (c = Y(t)), r)) {
		let e = $(t, !0, o, t);
		l.x = e.x + t.clientLeft, l.y = e.y + t.clientTop;
	}
	!r && i && (l.x = xe(i));
	let u = i && !r && !o ? Se(i, c) : a(0);
	return {
		x: s.left + c.scrollLeft - l.x - u.x,
		y: s.top + c.scrollTop - l.y - u.y,
		width: s.width,
		height: s.height
	};
}
function Pe(e) {
	return J(e).position === "static";
}
function Fe(e, t) {
	if (!U(e) || J(e).position === "fixed") return null;
	if (t) return t(e);
	let n = e.offsetParent;
	return V(e) === n && (n = n.ownerDocument.body), n;
}
function Ie(e, t) {
	let n = B(e);
	if (G(e)) return n;
	if (!U(e)) {
		let t = X(e);
		for (; t && !q(t);) {
			if (H(t) && !Pe(t)) return t;
			t = X(t);
		}
		return n;
	}
	let r = Fe(e, t);
	for (; r && se(r) && Pe(r);) r = Fe(r, t);
	return r && q(r) && Pe(r) && !de(r) ? n : r || fe(e) || n;
}
var Le = async function(e) {
	let t = this.getOffsetParent || Ie, n = this.getDimensions, r = await n(e.floating);
	return {
		reference: Ne(e.reference, await t(e.floating), e.strategy),
		floating: {
			x: 0,
			y: 0,
			width: r.width,
			height: r.height
		}
	};
};
function Re(e) {
	return J(e).direction === "rtl";
}
var ze = {
	convertOffsetParentRelativeRectToViewportRelativeRect: Ce,
	getDocumentElement: V,
	getClippingRect: je,
	getOffsetParent: Ie,
	getElementRects: Le,
	getClientRects: we,
	getDimensions: Me,
	getScale: Q,
	isElement: H,
	isRTL: Re
};
function Be(e, t) {
	return e.x === t.x && e.y === t.y && e.width === t.width && e.height === t.height;
}
function Ve(e, r, a) {
	let o = null, s, c = V(e);
	function l() {
		var e;
		clearTimeout(s), (e = o) == null || e.disconnect(), o = null;
	}
	function u(a, d) {
		a === void 0 && (a = !1), d === void 0 && (d = 1), l();
		let f = e.getBoundingClientRect(), { left: p, top: m, width: h, height: g } = f;
		if (a || r(), !h || !g) return;
		let _ = i(m), v = i(c.clientWidth - (p + h)), y = i(c.clientHeight - (m + g)), b = i(p), x = {
			rootMargin: -_ + "px " + -v + "px " + -y + "px " + -b + "px",
			threshold: n(0, t(1, d)) || 1
		}, S = !0;
		function C(t) {
			let n = t[0].intersectionRatio;
			if (!Be(f, e.getBoundingClientRect())) return u();
			if (n !== d) {
				if (!S) return u();
				n ? u(!1, n) : s = setTimeout(() => {
					u(!1, 1e-7);
				}, 1e3);
			}
			S = !1;
		}
		try {
			o = new IntersectionObserver(C, {
				...x,
				root: c.ownerDocument
			});
		} catch {
			o = new IntersectionObserver(C, x);
		}
		o.observe(e);
	}
	let d = B(e), f = () => u(a);
	return d.addEventListener("resize", f), u(!0), () => {
		d.removeEventListener("resize", f), l();
	};
}
function He(e, t, n, r) {
	r === void 0 && (r = {});
	let { ancestorScroll: i = !0, ancestorResize: a = !0, elementResize: o = typeof ResizeObserver == "function", layoutShift: s = typeof IntersectionObserver == "function", animationFrame: c = !1 } = r, l = _e(e), u = i || a ? [...l ? Z(l) : [], ...t ? Z(t) : []] : [];
	u.forEach((e) => {
		i && e.addEventListener("scroll", n), a && e.addEventListener("resize", n);
	});
	let d = l && s ? Ve(l, n, a) : null, f = -1, p = null;
	o && (p = new ResizeObserver((e) => {
		let [r] = e;
		r && r.target === l && p && t && (p.unobserve(t), cancelAnimationFrame(f), f = requestAnimationFrame(() => {
			var e;
			(e = p) == null || e.observe(t);
		})), n();
	}), l && !c && p.observe(l), t && p.observe(t));
	let m, h = c ? $(e) : null;
	c && g();
	function g() {
		let t = $(e);
		h && !Be(h, t) && n(), h = t, m = requestAnimationFrame(g);
	}
	return n(), () => {
		var e;
		u.forEach((e) => {
			i && e.removeEventListener("scroll", n), a && e.removeEventListener("resize", n);
		}), d?.(), (e = p) == null || e.disconnect(), p = null, c && cancelAnimationFrame(m);
	};
}
var Ue = L, We = ne, Ge = N, Ke = ie, qe = F, Je = M, Ye = re, Xe = (e, t, n) => {
	let r = /* @__PURE__ */ new Map(), i = n ?? {}, a = {
		...ze,
		...i.platform,
		_c: r
	};
	return j(e, t, {
		...i,
		platform: a
	});
};
export { qe as a, We as c, Ge as i, Ke as l, He as n, Ye as o, Xe as r, Ue as s, Je as t };
