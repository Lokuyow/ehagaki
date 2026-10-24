// D:/ドキュメント/GitHub/ehagaki/src/lib/appStorage.ts
var e, t = /* @__PURE__ */ new Map(), n = {
	get length() {
		return t.size;
	},
	clear() {
		t.clear();
	},
	getItem(e) {
		return t.get(e) ?? null;
	},
	key(e) {
		return [...t.keys()][e] ?? null;
	},
	removeItem(e) {
		t.delete(e);
	},
	setItem(e, n) {
		t.set(e, String(n));
	}
};
function r() {
	if (typeof globalThis < "u") {
		let e = globalThis.localStorage;
		if (e) return e;
	}
	return n;
}
function i() {
	return e ?? r();
}
function a(t) {
	e = t;
}
function o(e, t) {
	let n = [];
	for (let r = 0; r < e.length; r += 1) {
		let i = e.key(r);
		i?.startsWith(t) && n.push(i.slice(t.length));
	}
	return n;
}
function s(e, t) {
	return {
		get length() {
			return o(e, t).length;
		},
		clear() {
			let n = o(e, t);
			for (let r of n) e.removeItem(`${t}${r}`);
		},
		getItem(n) {
			return e.getItem(`${t}${n}`);
		},
		key(n) {
			return o(e, t)[n] ?? null;
		},
		removeItem(n) {
			e.removeItem(`${t}${n}`);
		},
		setItem(n, r) {
			e.setItem(`${t}${n}`, String(r));
		}
	};
}
function c(e) {
	return s(e, "ehagaki.web-component.v1:");
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/appRuntimeEnvironment.ts
function l() {
	return { style: {
		setProperty: () => void 0,
		removeProperty: () => "",
		getPropertyValue: () => ""
	} };
}
function u() {
	let e = typeof window < "u" ? window : void 0, t = e?.document, n = t?.documentElement ?? l(), r = t?.body ?? n;
	return {
		storage: i(),
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
var d = u();
function f(e) {
	return d = {
		...d,
		...e
	}, a(d.storage), d;
}
function p() {
	return d;
}
export { i, p as n, c as r, f as t };
