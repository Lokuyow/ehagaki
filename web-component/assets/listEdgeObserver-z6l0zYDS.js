// D:/ドキュメント/GitHub/ehagaki/src/lib/listEdgeObserver.ts
function e(e, t, n, r) {
	return n.left >= t.right || n.right <= t.left ? !1 : e === "bottom" ? n.top <= t.bottom + r && n.bottom >= t.top : n.bottom >= t.top - r && n.top <= t.bottom;
}
function t(e, t) {
	return e === "bottom" ? `0px 0px ${t}px 0px` : `${t}px 0px 0px 0px`;
}
function n({ root: n, sentinel: r, edge: i, prefetchDistance: a, scrollPrefetchDistance: o = a, onIntersection: s, onScrollApproach: c, onLeaveRegion: l }) {
	let u = !0, d = !1, f = n.scrollTop, p = (t = a, o = n.getBoundingClientRect()) => e(i, o, r.getBoundingClientRect(), t), m = new IntersectionObserver((e) => {
		if (!u) return;
		let t = e.filter((e) => e.target === r);
		for (let [e, r] of t.entries()) {
			if (!u) return;
			let i = !d;
			d = !0;
			let o = n.getBoundingClientRect(), c = o.width > 0 && o.height > 0 ? p(a, o) : r.isIntersecting;
			!r.isIntersecting && c && !t.slice(e + 1).some((e) => e.isIntersecting) || r.isIntersecting && !c || s(r.isIntersecting, i);
		}
	}, {
		root: n,
		rootMargin: t(i, a),
		threshold: 0
	}), h = () => {
		let e = n.scrollTop, t = i === "bottom" ? e > f : e < f;
		f = e, (t || l) && (p(t ? o : a) ? t && c() : l?.());
	};
	return l && !p() && l(), m.observe(r), n.addEventListener("scroll", h, { passive: !0 }), {
		isInRegion: p,
		hasReceivedEntry: () => d,
		syncScrollPosition: () => {
			f = n.scrollTop;
		},
		dispose() {
			u = !1, n.removeEventListener("scroll", h), m.disconnect();
		}
	};
}
function r(e, t, r) {
	if (!e || typeof IntersectionObserver > "u") return;
	let i = !1, a = () => {
		!i && t.isConnected && e.contains(t) && (i = r());
	};
	return n({
		root: e,
		sentinel: t,
		edge: "bottom",
		prefetchDistance: 600,
		onIntersection: (e) => {
			e && a();
		},
		onScrollApproach: a
	}).dispose;
}
export { r as n, n as t };
