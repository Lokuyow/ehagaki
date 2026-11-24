import { n as e } from "./appRuntimeEnvironment-Bzv9wJOh.js";
import { i as t, n, t as r, u as i } from "./ehagakiDbUpgradeState-tA-618gW.js";
var a = {
	en: {
		blocked: "Another eHagaki tab has this database open. Closing that tab lets the update continue. The database will not be deleted.",
		retry: "The database update did not finish. You can try again.",
		retryButton: "Try again",
		versionError: "This database is newer than this page. Reload the page. The database will not be deleted."
	},
	ja: {
		blocked: "他のeHagakiタブがデータベースを開いています。それらのタブを閉じると更新を続けます。データベースは削除しません。",
		retry: "データベースの更新を完了できませんでした。再試行できます。",
		retryButton: "再試行",
		versionError: "このデータベースは、このページより新しいバージョンです。ページを再読み込みしてください。データベースは削除しません。"
	}
}, o = "EHAGAKI_DB_CAPABILITY_REPORT", s = "EHAGAKI_DB_UPGRADE_REQUEST", c = "ehagaki-db-gate-notice";
function l(e = window, t = {}) {
	n(() => p(e, t));
}
function u(e = indexedDB, r = i) {
	n(() => t(e, { databaseName: r }));
}
async function d(t) {
	e().serviceWorkerEnabled || await f(t) ? l() : u();
}
async function f(e) {
	return typeof navigator > "u" || !navigator.serviceWorker?.getRegistrations || e.origin !== window.location.origin ? !1 : (await navigator.serviceWorker.getRegistrations()).some((t) => {
		let n = t.active?.scriptURL ?? t.waiting?.scriptURL ?? t.installing?.scriptURL ?? "";
		return n.startsWith(e.origin) && n.endsWith("/sw.js");
	});
}
function p(e, n) {
	let i = n.databaseName ?? "eHagakiDB", a = n.indexedDb ?? e.indexedDB;
	return new Promise((c) => {
		let l = !1, u = !1, d = null, f = () => {
			l || u || (l = !0, _(e.document), r(!1), c());
		}, p = e.navigator.serviceWorker, h = () => {
			l || u || (d ||= t(a, {
				databaseName: i,
				onBlocked: () => {
					g(e, "blocked"), r(!0);
				},
				onBlockedResolved: () => r(!1)
			}).then(() => {
				d = null, f();
			}).catch((t) => {
				d = null, !l && (m(t) ? (u = !0, g(e, "versionError")) : g(e, "retry", () => h()));
			}));
		};
		if (h(), !p || n.serviceWorkerUpgrade === !1) return;
		let v = (e) => {
			let t = e, n = t.data;
			n?.type === "EHAGAKI_DB_CAPABILITY_PROBE" && t.source?.postMessage?.({
				type: o,
				supportedNativeVersion: 200
			}), n?.type === "EHAGAKI_DB_UPGRADE_COMPLETE" && h();
		}, y = () => {
			p.controller?.postMessage({ type: s });
		};
		p.addEventListener("message", v), p.addEventListener("controllerchange", y), y();
	});
}
function m(e) {
	return typeof e == "object" && !!e && "name" in e && e.name === "VersionError";
}
function h(e) {
	return (e?.getItem("locale") ?? "").toLowerCase().startsWith("en") ? a.en : a.ja;
}
function g(e, t, n) {
	let r = h(e.localStorage), i = e.document.getElementById(c) ?? e.document.createElement("div");
	i.id = c, i.setAttribute("role", "alert"), i.dataset.ehagakiDbGate = t, i.style.position = "fixed", i.style.zIndex = "11000", i.style.left = "16px", i.style.right = "16px", i.style.bottom = "16px", i.style.padding = "12px 16px", i.style.borderRadius = "12px", i.style.background = "var(--dialog-bg, #fff)", i.style.color = "var(--text, #111)", i.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.28)";
	let a = t === "blocked" ? r.blocked : t === "versionError" ? r.versionError : r.retry;
	i.replaceChildren();
	let o = e.document.createElement("p");
	if (o.textContent = a, i.append(o), n && t !== "blocked") {
		let t = e.document.createElement("button");
		t.type = "button", t.textContent = r.retryButton, t.style.height = "auto", t.style.minHeight = "44px", t.style.padding = "8px 0", t.style.justifyContent = "flex-start", t.addEventListener("click", n), i.append(t);
	}
	i.isConnected || e.document.body.append(i);
}
function _(e) {
	e.getElementById(c)?.remove();
}
export { d as installEhagakiDatabaseGateForRuntime };
