import { v as e } from "./relayConfigUtils-B4Q_AO1M.js";
import { c as t, i as n, m as r, r as i } from "./ehagakiDb-DZENFSwt.js";
import a from "./en-BlTB2iGP.js";
import o from "./ja-DmrzFvHG.js";
var s = "EHAGAKI_DB_CAPABILITY_REPORT", c = "EHAGAKI_DB_UPGRADE_REQUEST", l = "ehagaki-db-gate-notice";
function u(e = window, t = {}) {
	n(() => m(e, t));
}
function d(e = indexedDB, i = r) {
	n(() => t(e, { databaseName: i }));
}
async function f(t) {
	e().serviceWorkerEnabled || await p(t) ? u() : d();
}
async function p(e) {
	return typeof navigator > "u" || !navigator.serviceWorker?.getRegistrations || e.origin !== window.location.origin ? !1 : (await navigator.serviceWorker.getRegistrations()).some((t) => {
		let n = t.active?.scriptURL ?? t.waiting?.scriptURL ?? t.installing?.scriptURL ?? "";
		return n.startsWith(e.origin) && n.endsWith("/sw.js");
	});
}
function m(e, n) {
	let r = n.databaseName ?? "eHagakiDB", a = n.indexedDb ?? e.indexedDB;
	return new Promise((o) => {
		let l = !1, u = !1, d = null, f = () => {
			l || u || (l = !0, v(e.document), i(!1), o());
		}, p = e.navigator.serviceWorker, m = () => {
			l || u || (d ||= t(a, {
				databaseName: r,
				onBlocked: () => {
					_(e, "blocked"), i(!0);
				},
				onBlockedResolved: () => i(!1)
			}).then(() => {
				d = null, f();
			}).catch((t) => {
				d = null, !l && (h(t) ? (u = !0, _(e, "versionError")) : _(e, "retry", () => m()));
			}));
		};
		if (m(), !p || n.serviceWorkerUpgrade === !1) return;
		let g = (e) => {
			let t = e, n = t.data;
			n?.type === "EHAGAKI_DB_CAPABILITY_PROBE" && t.source?.postMessage?.({
				type: s,
				supportedNativeVersion: 190
			}), n?.type === "EHAGAKI_DB_UPGRADE_COMPLETE" && m();
		}, y = () => {
			p.controller?.postMessage({ type: c });
		};
		p.addEventListener("message", g), p.addEventListener("controllerchange", y), y();
	});
}
function h(e) {
	return typeof e == "object" && !!e && "name" in e && e.name === "VersionError";
}
function g(e) {
	return (e?.getItem("locale") ?? "").toLowerCase().startsWith("en") ? a.databaseGate : o.databaseGate;
}
function _(e, t, n) {
	let r = g(e.localStorage), i = e.document.getElementById(l) ?? e.document.createElement("div");
	i.id = l, i.setAttribute("role", "alert"), i.dataset.ehagakiDbGate = t, i.style.position = "fixed", i.style.zIndex = "11000", i.style.left = "16px", i.style.right = "16px", i.style.bottom = "16px", i.style.padding = "12px 16px", i.style.borderRadius = "12px", i.style.background = "var(--dialog-bg, #fff)", i.style.color = "var(--text, #111)", i.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.28)";
	let a = t === "blocked" ? r.blocked : t === "versionError" ? r.versionError : r.retry;
	i.replaceChildren();
	let o = e.document.createElement("p");
	if (o.textContent = a, i.append(o), n && t !== "blocked") {
		let t = e.document.createElement("button");
		t.type = "button", t.textContent = r.retryButton, t.style.height = "auto", t.style.minHeight = "44px", t.style.padding = "8px 0", t.style.justifyContent = "flex-start", t.addEventListener("click", n), i.append(t);
	}
	i.isConnected || e.document.body.append(i);
}
function v(e) {
	e.getElementById(l)?.remove();
}
export { f as installEhagakiDatabaseGateForRuntime };
