import { n as e } from "./appRuntimeEnvironment-BvtUCHcA.js";
import { a as t, c as n, l as r, n as i, o as a, s as o } from "./legacyImportMarkers-DmJ5w5e4.js";
import s from "./en-BJXomVD0.js";
import c from "./ja-QbsuEIa0.js";
// D:/ドキュメント/GitHub/ehagaki/src/lib/swIndexedDbSchema.ts
function l(e, t, n, r = []) {
	if (e.objectStoreNames.contains(t)) return;
	let i = e.createObjectStore(t, { keyPath: n });
	r.forEach((e) => {
		i.createIndex(e.name, e.keyPath);
	});
}
function u(e, t = "sharedMedia", i) {
	let a = e.objectStoreNames.contains("postHistory");
	if (l(e, "emojiItems", "id", [
		{
			name: "pubkeyHex",
			keyPath: "pubkeyHex"
		},
		{
			name: "identityKey",
			keyPath: "identityKey"
		},
		{
			name: "shortcodeLower",
			keyPath: "shortcodeLower"
		},
		{
			name: "sortIndex",
			keyPath: "sortIndex"
		},
		{
			name: "sourceType",
			keyPath: "sourceType"
		},
		{
			name: "sourceAddress",
			keyPath: "sourceAddress"
		},
		{
			name: "fetchedAt",
			keyPath: "fetchedAt"
		},
		{
			name: "updatedAt",
			keyPath: "updatedAt"
		},
		{
			name: "[pubkeyHex+sortIndex]",
			keyPath: ["pubkeyHex", "sortIndex"]
		},
		{
			name: "[pubkeyHex+identityKey]",
			keyPath: ["pubkeyHex", "identityKey"]
		}
	]), l(e, "emojiCacheMeta", "pubkeyHex", [
		{
			name: "fetchedAt",
			keyPath: "fetchedAt"
		},
		{
			name: "updatedAt",
			keyPath: "updatedAt"
		},
		{
			name: "schemaVersion",
			keyPath: "schemaVersion"
		}
	]), l(e, "drafts", "id", [
		{
			name: "scopeKey",
			keyPath: "scopeKey"
		},
		{
			name: "pubkeyHex",
			keyPath: "pubkeyHex"
		},
		{
			name: "updatedAt",
			keyPath: "updatedAt"
		},
		{
			name: "timestamp",
			keyPath: "timestamp"
		},
		{
			name: "[scopeKey+updatedAt]",
			keyPath: ["scopeKey", "updatedAt"]
		}
	]), l(e, "profiles", "pubkeyHex", [
		{
			name: "fetchedAt",
			keyPath: "fetchedAt"
		},
		{
			name: "updatedAt",
			keyPath: "updatedAt"
		},
		{
			name: "updatedAtFromEvent",
			keyPath: "updatedAtFromEvent"
		},
		{
			name: "schemaVersion",
			keyPath: "schemaVersion"
		}
	]), l(e, "relayConfigs", "pubkeyHex", [
		{
			name: "fetchedAt",
			keyPath: "fetchedAt"
		},
		{
			name: "updatedAt",
			keyPath: "updatedAt"
		},
		{
			name: "updatedAtFromEvent",
			keyPath: "updatedAtFromEvent"
		},
		{
			name: "schemaVersion",
			keyPath: "schemaVersion"
		}
	]), l(e, t, "id", [
		{
			name: "createdAt",
			keyPath: "createdAt"
		},
		{
			name: "updatedAt",
			keyPath: "updatedAt"
		},
		{
			name: "schemaVersion",
			keyPath: "schemaVersion"
		}
	]), l(e, "hashtagHistory", "tagLower", [
		{
			name: "useCount",
			keyPath: "useCount"
		},
		{
			name: "lastUsed",
			keyPath: "lastUsed"
		},
		{
			name: "updatedAt",
			keyPath: "updatedAt"
		},
		{
			name: "schemaVersion",
			keyPath: "schemaVersion"
		}
	]), l(e, "customEmojiUsage", "id", [
		{
			name: "pubkeyHex",
			keyPath: "pubkeyHex"
		},
		{
			name: "shortcodeLower",
			keyPath: "shortcodeLower"
		},
		{
			name: "src",
			keyPath: "src"
		},
		{
			name: "lastUsedAt",
			keyPath: "lastUsedAt"
		},
		{
			name: "count",
			keyPath: "count"
		},
		{
			name: "updatedAt",
			keyPath: "updatedAt"
		},
		{
			name: "schemaVersion",
			keyPath: "schemaVersion"
		},
		{
			name: "[pubkeyHex+lastUsedAt]",
			keyPath: ["pubkeyHex", "lastUsedAt"]
		},
		{
			name: "[pubkeyHex+shortcodeLower+src]",
			keyPath: [
				"pubkeyHex",
				"shortcodeLower",
				"src"
			]
		}
	]), l(e, "customEmojiImageMeta", "url", [
		{
			name: "width",
			keyPath: "width"
		},
		{
			name: "height",
			keyPath: "height"
		},
		{
			name: "aspectRatio",
			keyPath: "aspectRatio"
		},
		{
			name: "fetchedAt",
			keyPath: "fetchedAt"
		},
		{
			name: "lastAccessedAt",
			keyPath: "lastAccessedAt"
		},
		{
			name: "updatedAt",
			keyPath: "updatedAt"
		},
		{
			name: "schemaVersion",
			keyPath: "schemaVersion"
		}
	]), l(e, "uploadDestinations", "id", [
		{
			name: "scopeKey",
			keyPath: "scopeKey"
		},
		{
			name: "pubkeyHex",
			keyPath: "pubkeyHex"
		},
		{
			name: "protocol",
			keyPath: "protocol"
		},
		{
			name: "presetId",
			keyPath: "presetId"
		},
		{
			name: "isDefault",
			keyPath: "isDefault"
		},
		{
			name: "enabled",
			keyPath: "enabled"
		},
		{
			name: "updatedAt",
			keyPath: "updatedAt"
		},
		{
			name: "[scopeKey+isDefault]",
			keyPath: ["scopeKey", "isDefault"]
		},
		{
			name: "[scopeKey+enabled]",
			keyPath: ["scopeKey", "enabled"]
		}
	]), l(e, "postHistory", "id", [
		{
			name: "eventId",
			keyPath: "eventId"
		},
		{
			name: "pubkeyHex",
			keyPath: "pubkeyHex"
		},
		{
			name: "kind",
			keyPath: "kind"
		},
		{
			name: "createdAt",
			keyPath: "createdAt"
		},
		{
			name: "postedAt",
			keyPath: "postedAt"
		},
		{
			name: "updatedAt",
			keyPath: "updatedAt"
		},
		{
			name: "deletedAt",
			keyPath: "deletedAt"
		},
		{
			name: "fetchedAt",
			keyPath: "fetchedAt"
		},
		{
			name: "lastSeenAt",
			keyPath: "lastSeenAt"
		},
		{
			name: "schemaVersion",
			keyPath: "schemaVersion"
		},
		{
			name: "[pubkeyHex+postedAt]",
			keyPath: ["pubkeyHex", "postedAt"]
		},
		{
			name: "[pubkeyHex+createdAt]",
			keyPath: ["pubkeyHex", "createdAt"]
		},
		{
			name: n,
			keyPath: r
		}
	]), l(e, "sensitivePayloads", "id", [
		{
			name: "pubkeyHex",
			keyPath: "pubkeyHex"
		},
		{
			name: "structureKind",
			keyPath: "structureKind"
		},
		{
			name: "createdAt",
			keyPath: "createdAt"
		},
		{
			name: "updatedAt",
			keyPath: "updatedAt"
		},
		{
			name: "deletedAt",
			keyPath: "deletedAt"
		}
	]), a && i) {
		let e = i.objectStore("postHistory");
		e.indexNames?.contains("[pubkeyHex+postedAt+createdAt+eventId]") || e.createIndex(n, r);
	}
	l(e, "postHistoryChildInteractions", "id", [
		{
			name: "eventId",
			keyPath: "eventId"
		},
		{
			name: "parentEventId",
			keyPath: "parentEventId"
		},
		{
			name: "rootEventId",
			keyPath: "rootEventId"
		},
		{
			name: "authorPubkey",
			keyPath: "authorPubkey"
		},
		{
			name: "kind",
			keyPath: "kind"
		},
		{
			name: "createdAt",
			keyPath: "createdAt"
		},
		{
			name: "fetchedAt",
			keyPath: "fetchedAt"
		},
		{
			name: "updatedAt",
			keyPath: "updatedAt"
		},
		{
			name: "schemaVersion",
			keyPath: "schemaVersion"
		},
		{
			name: "[parentEventId+createdAt]",
			keyPath: ["parentEventId", "createdAt"]
		}
	]), l(e, "postHistoryDeletionRequests", "id", [
		{
			name: "targetEventId",
			keyPath: "targetEventId"
		},
		{
			name: "targetAuthorPubkey",
			keyPath: "targetAuthorPubkey"
		},
		{
			name: "deletionEventId",
			keyPath: "deletionEventId"
		},
		{
			name: "fetchedAt",
			keyPath: "fetchedAt"
		},
		{
			name: "[targetAuthorPubkey+targetEventId]",
			keyPath: ["targetAuthorPubkey", "targetEventId"]
		}
	]), l(e, "postMediaCache", "cacheKey", [
		{
			name: "url",
			keyPath: "url"
		},
		{
			name: "normalizedUrl",
			keyPath: "normalizedUrl"
		},
		{
			name: "size",
			keyPath: "size"
		},
		{
			name: "createdAt",
			keyPath: "createdAt"
		},
		{
			name: "lastAccessedAt",
			keyPath: "lastAccessedAt"
		},
		{
			name: "updatedAt",
			keyPath: "updatedAt"
		},
		{
			name: "source",
			keyPath: "source"
		},
		{
			name: "schemaVersion",
			keyPath: "schemaVersion"
		}
	]), l(e, "channelMetadata", "channelEventId", [
		{
			name: "fetchedAt",
			keyPath: "fetchedAt"
		},
		{
			name: "metadataCreatedAt",
			keyPath: "metadataCreatedAt"
		},
		{
			name: "creatorPubkey",
			keyPath: "creatorPubkey"
		},
		{
			name: "updatedAt",
			keyPath: "updatedAt"
		},
		{
			name: "schemaVersion",
			keyPath: "schemaVersion"
		}
	]), l(e, "channelImageCacheMeta", "url", [
		{
			name: "responseType",
			keyPath: "responseType"
		},
		{
			name: "fetchedAt",
			keyPath: "fetchedAt"
		},
		{
			name: "lastAttemptAt",
			keyPath: "lastAttemptAt"
		},
		{
			name: "lastAccessedAt",
			keyPath: "lastAccessedAt"
		},
		{
			name: "schemaVersion",
			keyPath: "schemaVersion"
		}
	]), d(e, "postHistoryExternalCoverage"), d(e, "postHistoryCitrineRanges"), d(e, "postHistoryLocalBrowsingRanges"), d(e, "postHistoryLocalResumeCursor"), d(e, "postHistoryJumpAnchors", !1), d(e, "postHistoryAuthoredSyncCursor", !1), d(e, "postHistoryInboundSyncCursor", !1), d(e, "postHistoryDirectReplyFetchMeta", !1), d(e, "postHistoryWriteGeneration", !1), d(e, "postHistoryChildWriteGeneration", !1), l(e, "postHistoryReactionDeletionAttempts", "id", [{
		name: "parentEventId",
		keyPath: "parentEventId"
	}, {
		name: "updatedAt",
		keyPath: "updatedAt"
	}]), l(e, "postHistoryReplyDeletionAttempts", "id", [{
		name: "parentEventId",
		keyPath: "parentEventId"
	}, {
		name: "updatedAt",
		keyPath: "updatedAt"
	}]), d(e, "legacyImportState", !1);
}
function d(e, t, n = !0) {
	l(e, t, "id", [...n ? [{
		name: "ownerPubkeyHex",
		keyPath: "ownerPubkeyHex"
	}] : [], {
		name: "updatedAt",
		keyPath: "updatedAt"
	}]);
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/storage/ehagakiDbMigration.ts
var f = [
	"postHistory",
	"sensitivePayloads",
	"postHistoryChildInteractions"
];
function p(e, t, n, r = []) {
	let i = e.objectStoreNames.contains("meta"), a = n !== 0 && i && !!t;
	if (a) for (let t of f) e.objectStoreNames.contains(t) && e.deleteObjectStore(t);
	if (u(e, "sharedMedia", t), !a || !t) return;
	e.deleteObjectStore("meta");
	let o = t.objectStore("legacyImportState"), s = Date.now();
	for (let e of r) o.put({
		id: e.id,
		done: !0,
		updatedAt: typeof e.updatedAt == "number" ? e.updatedAt : s
	});
}
function m({ indexedDb: e, version: t, databaseName: n = o, legacyMarkers: r = [], onBlocked: i, onBlockedResolved: a }) {
	return new Promise((o, s) => {
		let c = t == null ? e.open(n) : e.open(n, t), l = !1;
		c.onupgradeneeded = (e) => {
			p(c.result, c.transaction, e.oldVersion, r);
		}, c.onblocked = () => {
			l = !0, i?.();
		}, c.onerror = () => {
			s(c.error ?? /* @__PURE__ */ Error("IndexedDB open failed"));
		}, c.onsuccess = () => {
			l && a?.(), o(c.result);
		};
	});
}
async function h(e, t = {}) {
	let n = t.databaseName ?? "eHagakiDB", r = await _(e, n);
	if (r !== null && !g(r)) return;
	let i = await v(e, n, t);
	g(i.version) && (await m({
		indexedDb: e,
		version: 170,
		databaseName: n,
		legacyMarkers: i.markers,
		onBlocked: t.onBlocked,
		onBlockedResolved: t.onBlockedResolved
	})).close();
}
function g(e) {
	if (e >= 180) throw new DOMException("The database is newer than this page.", "VersionError");
	return e < 170;
}
async function _(e, t) {
	if (typeof e.databases != "function") return null;
	try {
		let n = (await e.databases()).find((e) => e.name === t);
		return n && typeof n.version == "number" && n.version > 0 ? n.version : null;
	} catch {
		return null;
	}
}
async function v(e, t, n) {
	let r = await m({
		indexedDb: e,
		version: null,
		databaseName: t,
		onBlocked: n.onBlocked,
		onBlockedResolved: n.onBlockedResolved
	});
	r.onversionchange = () => {
		r.close();
	};
	try {
		let e = r.version;
		return {
			version: e,
			markers: e >= 170 ? [] : await y(r)
		};
	} finally {
		r.close();
	}
}
async function y(e) {
	if (!e.objectStoreNames.contains("meta")) return [];
	let t = e.transaction("meta", "readonly").objectStore("meta").getAll(), n = await new Promise((e, n) => {
		t.onsuccess = () => {
			e(Array.isArray(t.result) ? t.result : []);
		}, t.onerror = () => {
			n(t.error ?? /* @__PURE__ */ Error("Failed to read legacy import markers"));
		};
	}), r = Date.now(), a = [];
	for (let e of n) {
		if (!e || typeof e != "object") continue;
		let t = e;
		typeof t.key == "string" && t.value === !0 && i(t.key) && a.push({
			id: t.key,
			done: !0,
			updatedAt: typeof t.updatedAt == "number" ? t.updatedAt : r
		});
	}
	return a;
}
var b = "EHAGAKI_DB_CAPABILITY_REPORT", x = "EHAGAKI_DB_UPGRADE_REQUEST", S = "ehagaki-db-gate-notice";
function C(e = window, t = {}) {
	a(() => D(e, t));
}
function w(e = indexedDB, t = o) {
	a(() => h(e, { databaseName: t }));
}
async function T(t) {
	e().serviceWorkerEnabled || await E(t) ? C() : w();
}
async function E(e) {
	return typeof navigator > "u" || !navigator.serviceWorker?.getRegistrations || e.origin !== window.location.origin ? !1 : (await navigator.serviceWorker.getRegistrations()).some((t) => {
		let n = t.active?.scriptURL ?? t.waiting?.scriptURL ?? t.installing?.scriptURL ?? "";
		return n.startsWith(e.origin) && n.endsWith("/sw.js");
	});
}
function D(e, n) {
	let r = n.databaseName ?? "eHagakiDB", i = n.indexedDb ?? e.indexedDB;
	return new Promise((a) => {
		let o = !1, s = !1, c = null, l = () => {
			o || s || (o = !0, j(e.document), t(!1), a());
		}, u = e.navigator.serviceWorker, d = () => {
			o || s || (c ||= h(i, {
				databaseName: r,
				onBlocked: () => {
					A(e, "blocked"), t(!0);
				},
				onBlockedResolved: () => t(!1)
			}).then(() => {
				c = null, l();
			}).catch((t) => {
				c = null, !o && (O(t) ? (s = !0, A(e, "versionError")) : A(e, "retry", () => d()));
			}));
		};
		if (d(), !u || n.serviceWorkerUpgrade === !1) return;
		let f = (e) => {
			let t = e, n = t.data;
			n?.type === "EHAGAKI_DB_CAPABILITY_PROBE" && t.source?.postMessage?.({
				type: b,
				supportedNativeVersion: 170
			}), n?.type === "EHAGAKI_DB_UPGRADE_COMPLETE" && d();
		}, p = () => {
			u.controller?.postMessage({ type: x });
		};
		u.addEventListener("message", f), u.addEventListener("controllerchange", p), p();
	});
}
function O(e) {
	return typeof e == "object" && !!e && "name" in e && e.name === "VersionError";
}
function k(e) {
	return (e?.getItem("locale") ?? "").toLowerCase().startsWith("en") ? s.databaseGate : c.databaseGate;
}
function A(e, t, n) {
	let r = k(e.localStorage), i = e.document.getElementById(S) ?? e.document.createElement("div");
	i.id = S, i.setAttribute("role", "alert"), i.dataset.ehagakiDbGate = t, i.style.position = "fixed", i.style.zIndex = "11000", i.style.left = "16px", i.style.right = "16px", i.style.bottom = "16px", i.style.padding = "12px 16px", i.style.borderRadius = "12px", i.style.background = "var(--dialog-bg, #fff)", i.style.color = "var(--text, #111)", i.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.28)";
	let a = t === "blocked" ? r.blocked : t === "versionError" ? r.versionError : r.retry;
	i.replaceChildren();
	let o = e.document.createElement("p");
	if (o.textContent = a, i.append(o), n && t !== "blocked") {
		let t = e.document.createElement("button");
		t.type = "button", t.textContent = r.retryButton, t.style.height = "auto", t.style.minHeight = "44px", t.style.padding = "8px 0", t.style.justifyContent = "flex-start", t.addEventListener("click", n), i.append(t);
	}
	i.isConnected || e.document.body.append(i);
}
function j(e) {
	e.getElementById(S)?.remove();
}
export { T as installEhagakiDatabaseGateForRuntime };
