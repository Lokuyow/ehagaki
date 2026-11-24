// D:/ドキュメント/GitHub/ehagaki/src/lib/appStorage.ts
var e, t = "ehagaki.web-component.v1:", n = /* @__PURE__ */ new Map(), r = {
	get length() {
		return n.size;
	},
	clear() {
		n.clear();
	},
	getItem(e) {
		return n.get(e) ?? null;
	},
	key(e) {
		return [...n.keys()][e] ?? null;
	},
	removeItem(e) {
		n.delete(e);
	},
	setItem(e, t) {
		n.set(e, String(t));
	}
};
function i() {
	if (typeof globalThis < "u") {
		let e = globalThis.localStorage;
		if (e) return e;
	}
	return r;
}
function a() {
	return e ?? i();
}
function o(t) {
	e = t;
}
function s(e, t) {
	let n = [];
	for (let r = 0; r < e.length; r += 1) {
		let i = e.key(r);
		i?.startsWith(t) && n.push(i.slice(t.length));
	}
	return n;
}
function c(e, t) {
	return {
		get length() {
			return s(e, t).length;
		},
		clear() {
			let n = s(e, t);
			for (let r of n) e.removeItem(`${t}${r}`);
		},
		getItem(n) {
			return e.getItem(`${t}${n}`);
		},
		key(n) {
			return s(e, t)[n] ?? null;
		},
		removeItem(n) {
			e.removeItem(`${t}${n}`);
		},
		setItem(n, r) {
			e.setItem(`${t}${n}`, String(r));
		}
	};
}
function l(e) {
	return c(e, t);
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/appRuntimeEnvironment.ts
function u() {
	return { style: {
		setProperty: () => void 0,
		removeProperty: () => "",
		getPropertyValue: () => ""
	} };
}
function d() {
	let e = typeof window < "u" ? window : void 0, t = e?.document, n = t?.documentElement ?? u(), r = t?.body ?? n;
	return {
		storage: a(),
		window: e,
		document: t,
		domRoot: t,
		styleTarget: n,
		layoutTarget: r,
		overlayTarget: r,
		themeTarget: n,
		layoutMode: "viewport",
		runtimeKind: "standalone",
		appHomeHref: "./",
		assetBase: e?.location?.href ? new URL(".", e.location.href) : void 0,
		serviceWorkerEnabled: !0,
		externalInputEnabled: !0,
		historyEnabled: !0,
		localNsecAuthEnabled: !0,
		autoLoginNip07Enabled: !1
	};
}
var f = d();
function p(e) {
	return f = {
		...f,
		...e
	}, o(f.storage), f;
}
function m() {
	return f;
}
export { a, l as i, m as n, t as r, p as t };
