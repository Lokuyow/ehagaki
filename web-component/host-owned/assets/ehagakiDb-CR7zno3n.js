import { i as e, t } from "./rolldown-runtime-CwxnZyOB.js";
import { n, o as r, r as i, s as a, t as o } from "./postHistoryEventUtils-B3ICzKHF.js";
// D:/ドキュメント/GitHub/ehagaki/src/lib/storage/ehagakiDbConstants.ts
var s = "eHagakiDB", c = "[pubkeyHex+postedAt+createdAt+eventId]", l = [
	"pubkeyHex",
	"postedAt",
	"createdAt",
	"eventId"
];
// D:/ドキュメント/GitHub/ehagaki/src/lib/swIndexedDbSchema.ts
function u(e, t, n, r = []) {
	if (e.objectStoreNames.contains(t)) return;
	let i = e.createObjectStore(t, { keyPath: n });
	r.forEach((e) => {
		i.createIndex(e.name, e.keyPath);
	});
}
function d(e, t = "sharedMedia", n) {
	u(e, "events", "id"), u(e, "eventStoreMigration", "id");
	let r = e.objectStoreNames.contains("postHistory");
	if (u(e, "emojiItems", "id", [
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
	]), u(e, "emojiCacheMeta", "pubkeyHex", [
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
	]), u(e, "drafts", "id", [
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
	]), u(e, "profiles", "pubkeyHex", [
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
	]), u(e, "relayConfigs", "pubkeyHex", [
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
	]), u(e, t, "id", [
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
	]), u(e, "hashtagHistory", "tagLower", [
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
	]), u(e, "customEmojiUsage", "id", [
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
	]), u(e, "customEmojiImageMeta", "url", [
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
	]), u(e, "uploadDestinations", "id", [
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
	]), u(e, "postHistory", "id", [
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
			name: c,
			keyPath: l
		}
	]), u(e, "sensitivePayloads", "id", [
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
	]), r && n) {
		let e = n.objectStore("postHistory");
		e.indexNames?.contains("[pubkeyHex+postedAt+createdAt+eventId]") || e.createIndex(c, l);
	}
	u(e, "postHistoryChildInteractions", "id", [
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
	]), u(e, "postHistoryDeletionRequests", "id", [
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
	]), u(e, "postMediaCache", "cacheKey", [
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
	]), u(e, "channelMetadata", "channelEventId", [
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
	]), u(e, "channelImageCacheMeta", "url", [
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
	]), f(e, "postHistoryExternalCoverage"), f(e, "postHistoryCitrineRanges"), f(e, "postHistoryLocalBrowsingRanges"), f(e, "postHistoryLocalResumeCursor"), f(e, "postHistoryJumpAnchors", !1), f(e, "postHistoryAuthoredSyncCursor", !1), f(e, "postHistoryInboundSyncCursor", !1), f(e, "postHistoryDirectReplyFetchMeta", !1), f(e, "postHistoryWriteGeneration", !1), f(e, "postHistoryChildWriteGeneration", !1), u(e, "postHistoryReactionDeletionAttempts", "id", [{
		name: "parentEventId",
		keyPath: "parentEventId"
	}, {
		name: "updatedAt",
		keyPath: "updatedAt"
	}]), u(e, "postHistoryReplyDeletionAttempts", "id", [{
		name: "parentEventId",
		keyPath: "parentEventId"
	}, {
		name: "updatedAt",
		keyPath: "updatedAt"
	}]), u(e, "notifications", "id", [
		{
			name: "ownerPubkeyHex",
			keyPath: "ownerPubkeyHex"
		},
		{
			name: "[ownerPubkeyHex+createdAt+eventId]",
			keyPath: [
				"ownerPubkeyHex",
				"createdAt",
				"eventId"
			]
		},
		{
			name: "[ownerPubkeyHex+unread]",
			keyPath: ["ownerPubkeyHex", "unread"]
		}
	]), f(e, "notificationSyncState"), f(e, "legacyImportState", !1);
}
function f(e, t, n = !0) {
	u(e, t, "id", [...n ? [{
		name: "ownerPubkeyHex",
		keyPath: "ownerPubkeyHex"
	}] : [], {
		name: "updatedAt",
		keyPath: "updatedAt"
	}]);
}
var p = "migrated.localStorage.hashtagHistory.v1", m = "migrated.localStorage.uploadEndpoint.v1.";
function h(e) {
	return `${m}${e}`;
}
function g(e) {
	return e === "migrated.localStorage.drafts.v1" || e === "migrated.localStorage.hashtagHistory.v1" || e.startsWith("migrated.localStorage.uploadEndpoint.v1.");
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/storage/ehagakiDbMigration.ts
function _(e, t, n, r = []) {
	let i = e.objectStoreNames.contains("meta"), a = n !== 0 && i && !!t;
	if (d(e, "sharedMedia", t), !a || !t) return;
	e.deleteObjectStore("meta");
	let o = t.objectStore("legacyImportState"), s = Date.now();
	for (let e of r) o.put({
		id: e.id,
		done: !0,
		updatedAt: typeof e.updatedAt == "number" ? e.updatedAt : s
	});
}
function v({ indexedDb: e, version: t, databaseName: n = s, legacyMarkers: r = [], onBlocked: i, onBlockedResolved: a }) {
	return new Promise((o, s) => {
		let c = t == null ? e.open(n) : e.open(n, t), l = !1;
		c.onupgradeneeded = (e) => {
			_(c.result, c.transaction, e.oldVersion, r);
		}, c.onblocked = () => {
			l = !0, i?.();
		}, c.onerror = () => {
			s(c.error ?? /* @__PURE__ */ Error("IndexedDB open failed"));
		}, c.onsuccess = () => {
			l && a?.();
			let e = c.result;
			e.onversionchange = () => e.close(), o(e);
		};
	});
}
async function y(e, t = {}) {
	let n = t.databaseName ?? "eHagakiDB", r = await x(e, n);
	if (r !== null && !b(r)) return;
	let i = await S(e, n, t);
	b(i.version) && (await v({
		indexedDb: e,
		version: 190,
		databaseName: n,
		legacyMarkers: i.markers,
		onBlocked: t.onBlocked,
		onBlockedResolved: t.onBlockedResolved
	})).close();
}
function b(e) {
	if (e >= 200) throw new DOMException("The database is newer than this page.", "VersionError");
	return e < 190;
}
async function x(e, t) {
	if (typeof e.databases != "function") return null;
	try {
		let n = (await e.databases()).find((e) => e.name === t);
		return n && typeof n.version == "number" && n.version > 0 ? n.version : null;
	} catch {
		return null;
	}
}
async function S(e, t, n) {
	let r = await v({
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
			markers: e >= 190 ? [] : await C(r)
		};
	} finally {
		r.close();
	}
}
async function C(e) {
	if (!e.objectStoreNames.contains("meta")) return [];
	let t = e.transaction("meta", "readonly").objectStore("meta").getAll(), n = await new Promise((e, n) => {
		t.onsuccess = () => {
			e(Array.isArray(t.result) ? t.result : []);
		}, t.onerror = () => {
			n(t.error ?? /* @__PURE__ */ Error("Failed to read legacy import markers"));
		};
	}), r = Date.now(), i = [];
	for (let e of n) {
		if (!e || typeof e != "object") continue;
		let t = e;
		typeof t.key == "string" && t.value === !0 && g(t.key) && i.push({
			id: t.key,
			done: !0,
			updatedAt: typeof t.updatedAt == "number" ? t.updatedAt : r
		});
	}
	return i;
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/storage/eventStorageModel.ts
var ee = [
	"postHistory",
	"postHistoryChildInteractions",
	"sensitivePayloads",
	"postHistoryDeletionRequests",
	"notifications"
];
function te(e, t) {
	return t === "postHistoryDeletionRequests" ? e.deletionEventId : e.eventId ?? e.id;
}
function ne(e, t) {
	let { rawEvent: n, event: r, content: i, tags: a, rawEventVerification: o, fetchedRelays: s, relayUrls: c, repostTarget: l, ...u } = e, d = t === "notifications" ? r : n, f = l?.rawEvent, p = t === "postHistory" || t === "sensitivePayloads" ? {
		deletedAt: e.deletedAt,
		deletionEventId: e.deletionEventId
	} : {};
	return {
		metadata: {
			...u,
			...l ? { repostTarget: {
				eventId: f?.id ?? l.eventId,
				relayHints: l.relayHints
			} } : {}
		},
		items: [...d ? [{
			event: d,
			relayUrls: s ?? c ?? [],
			receivedAt: e.receivedAt ?? e.fetchedAt,
			verification: o,
			...p,
			relatedEventIds: f ? [f.id] : []
		}] : [], ...f ? [{
			event: f,
			relayUrls: l.relayHints,
			verification: l.rawEventVerification
		}] : []]
	};
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/@rx-nostr/crypto/dist/crypto.js
var re = Object.defineProperty, ie = (e, t, n) => t in e ? re(e, t, {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: n
}) : e[t] = n, w = (e, t, n) => ie(e, typeof t == "symbol" ? t : t + "", n);
function ae(e) {
	return e instanceof Uint8Array || ArrayBuffer.isView(e) && e.constructor.name === "Uint8Array" && "BYTES_PER_ELEMENT" in e && e.BYTES_PER_ELEMENT === 1;
}
function oe(e, t = "") {
	if (typeof e != "number") {
		let n = t && `"${t}" `;
		throw TypeError(`${n}expected number, got ${typeof e}`);
	}
	if (!Number.isSafeInteger(e) || e < 0) {
		let n = t && `"${t}" `;
		throw RangeError(`${n}expected integer >= 0, got ${e}`);
	}
}
function se(e, t, n = "") {
	let r = ae(e), i = e?.length, a = t !== void 0;
	if (!r || a && i !== t) {
		let o = n && `"${n}" `, s = a ? ` of length ${t}` : "", c = r ? `length=${i}` : `type=${typeof e}`, l = o + "expected Uint8Array" + s + ", got " + c;
		throw r ? RangeError(l) : TypeError(l);
	}
	return e;
}
function ce(e, t = !0) {
	if (e.destroyed) throw Error("Hash instance has been destroyed");
	if (t && e.finished) throw Error("Hash#digest() has already been called");
}
function le(e, t) {
	se(e, void 0, "digestInto() output");
	let n = t.outputLen;
	if (e.length < n) throw RangeError("\"digestInto() output\" expected to be of length >=" + n);
}
function T(...e) {
	for (let t = 0; t < e.length; t++) e[t].fill(0);
}
function ue(e) {
	return new DataView(e.buffer, e.byteOffset, e.byteLength);
}
function E(e, t) {
	return e << 32 - t | e >>> t;
}
var de = typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", fe = /* @__PURE__ */ Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function pe(e) {
	if (se(e), de) return e.toHex();
	let t = "";
	for (let n = 0; n < e.length; n++) t += fe[e[n]];
	return t;
}
var D = {
	_0: 48,
	_9: 57,
	A: 65,
	F: 70,
	a: 97,
	f: 102
};
function me(e) {
	if (e >= D._0 && e <= D._9) return e - D._0;
	if (e >= D.A && e <= D.F) return e - (D.A - 10);
	if (e >= D.a && e <= D.f) return e - (D.a - 10);
}
function he(e) {
	if (typeof e != "string") throw TypeError("hex string expected, got " + typeof e);
	if (de) try {
		return Uint8Array.fromHex(e);
	} catch (e) {
		throw e instanceof SyntaxError ? RangeError(e.message) : e;
	}
	let t = e.length, n = t / 2;
	if (t % 2) throw RangeError("hex string expected, got unpadded hex of length " + t);
	let r = new Uint8Array(n);
	for (let t = 0, i = 0; t < n; t++, i += 2) {
		let n = me(e.charCodeAt(i)), a = me(e.charCodeAt(i + 1));
		if (n === void 0 || a === void 0) {
			let t = e[i] + e[i + 1];
			throw RangeError("hex string expected, got non-hex character \"" + t + "\" at index " + i);
		}
		r[t] = n * 16 + a;
	}
	return r;
}
function ge(e, t = {}) {
	let n = (t, n) => e(n).update(t).digest(), r = e(void 0);
	return n.outputLen = r.outputLen, n.blockLen = r.blockLen, n.canXOF = r.canXOF, n.create = (t) => e(t), Object.assign(n, t), Object.freeze(n);
}
var O = (e) => ({ oid: Uint8Array.from([
	6,
	9,
	96,
	134,
	72,
	1,
	101,
	3,
	4,
	2,
	e
]) });
function _e(e, t, n) {
	return e & t ^ ~e & n;
}
function k(e, t, n) {
	return e & t ^ e & n ^ t & n;
}
var ve = class {
	constructor(e, t, n, r) {
		w(this, "blockLen"), w(this, "outputLen"), w(this, "canXOF", !1), w(this, "padOffset"), w(this, "isLE"), w(this, "buffer"), w(this, "view"), w(this, "finished", !1), w(this, "length", 0), w(this, "pos", 0), w(this, "destroyed", !1), this.blockLen = e, this.outputLen = t, this.padOffset = n, this.isLE = r, this.buffer = new Uint8Array(e), this.view = ue(this.buffer);
	}
	update(e) {
		ce(this), se(e);
		let { view: t, buffer: n, blockLen: r } = this, i = e.length;
		for (let a = 0; a < i;) {
			let o = Math.min(r - this.pos, i - a);
			if (o === r) {
				let t = ue(e);
				for (; r <= i - a; a += r) this.process(t, a);
			} else n.set(e.subarray(a, a + o), this.pos), this.pos += o, a += o, this.pos === r && (this.process(t, 0), this.pos = 0);
		}
		return this.length += e.length, this.roundClean(), this;
	}
	digestInto(e) {
		ce(this), le(e, this), this.finished = !0;
		let { buffer: t, view: n, blockLen: r, isLE: i } = this, { pos: a } = this;
		t[a++] = 128, T(this.buffer.subarray(a)), this.padOffset > r - a && (this.process(n, 0), a = 0);
		for (let e = a; e < r; e++) t[e] = 0;
		n.setBigUint64(r - 8, BigInt(this.length * 8), i), this.process(n, 0);
		let o = ue(e), s = this.outputLen;
		if (s % 4) throw Error("_sha2: outputLen must be aligned to 32bit");
		let c = s / 4, l = this.get();
		if (c > l.length) throw Error("_sha2: outputLen bigger than state");
		for (let e = 0; e < c; e++) o.setUint32(4 * e, l[e], i);
	}
	digest() {
		let { buffer: e, outputLen: t } = this;
		this.digestInto(e);
		let n = e.slice(0, t);
		return this.destroy(), n;
	}
	_cloneInto(e) {
		e ||= new this.constructor(), e.set(...this.get());
		let { blockLen: t, buffer: n, length: r, finished: i, destroyed: a, pos: o } = this;
		return e.destroyed = a, e.finished = i, e.length = r, e.pos = o, r % t && e.buffer.set(n), e;
	}
	clone() {
		return this._cloneInto();
	}
}, ye = /* @__PURE__ */ Uint32Array.from([
	1779033703,
	3144134277,
	1013904242,
	2773480762,
	1359893119,
	2600822924,
	528734635,
	1541459225
]), be = /* @__PURE__ */ Uint32Array.from([
	1116352408,
	1899447441,
	3049323471,
	3921009573,
	961987163,
	1508970993,
	2453635748,
	2870763221,
	3624381080,
	310598401,
	607225278,
	1426881987,
	1925078388,
	2162078206,
	2614888103,
	3248222580,
	3835390401,
	4022224774,
	264347078,
	604807628,
	770255983,
	1249150122,
	1555081692,
	1996064986,
	2554220882,
	2821834349,
	2952996808,
	3210313671,
	3336571891,
	3584528711,
	113926993,
	338241895,
	666307205,
	773529912,
	1294757372,
	1396182291,
	1695183700,
	1986661051,
	2177026350,
	2456956037,
	2730485921,
	2820302411,
	3259730800,
	3345764771,
	3516065817,
	3600352804,
	4094571909,
	275423344,
	430227734,
	506948616,
	659060556,
	883997877,
	958139571,
	1322822218,
	1537002063,
	1747873779,
	1955562222,
	2024104815,
	2227730452,
	2361852424,
	2428436474,
	2756734187,
	3204031479,
	3329325298
]), xe = /* @__PURE__ */ new Uint32Array(64), Se = class extends ve {
	constructor(e) {
		super(64, e, 8, !1);
	}
	get() {
		let { A: e, B: t, C: n, D: r, E: i, F: a, G: o, H: s } = this;
		return [
			e,
			t,
			n,
			r,
			i,
			a,
			o,
			s
		];
	}
	set(e, t, n, r, i, a, o, s) {
		this.A = e | 0, this.B = t | 0, this.C = n | 0, this.D = r | 0, this.E = i | 0, this.F = a | 0, this.G = o | 0, this.H = s | 0;
	}
	process(e, t) {
		for (let n = 0; n < 16; n++, t += 4) xe[n] = e.getUint32(t, !1);
		for (let e = 16; e < 64; e++) {
			let t = xe[e - 15], n = xe[e - 2], r = E(t, 7) ^ E(t, 18) ^ t >>> 3, i = E(n, 17) ^ E(n, 19) ^ n >>> 10;
			xe[e] = i + xe[e - 7] + r + xe[e - 16] | 0;
		}
		let { A: n, B: r, C: i, D: a, E: o, F: s, G: c, H: l } = this;
		for (let e = 0; e < 64; e++) {
			let t = E(o, 6) ^ E(o, 11) ^ E(o, 25), u = l + t + _e(o, s, c) + be[e] + xe[e] | 0, d = (E(n, 2) ^ E(n, 13) ^ E(n, 22)) + k(n, r, i) | 0;
			l = c, c = s, s = o, o = a + u | 0, a = i, i = r, r = n, n = u + d | 0;
		}
		n = n + this.A | 0, r = r + this.B | 0, i = i + this.C | 0, a = a + this.D | 0, o = o + this.E | 0, s = s + this.F | 0, c = c + this.G | 0, l = l + this.H | 0, this.set(n, r, i, a, o, s, c, l);
	}
	roundClean() {
		T(xe);
	}
	destroy() {
		this.destroyed = !0, this.set(0, 0, 0, 0, 0, 0, 0, 0), T(this.buffer);
	}
}, Ce = class extends Se {
	constructor() {
		super(32), w(this, "A", ye[0] | 0), w(this, "B", ye[1] | 0), w(this, "C", ye[2] | 0), w(this, "D", ye[3] | 0), w(this, "E", ye[4] | 0), w(this, "F", ye[5] | 0), w(this, "G", ye[6] | 0), w(this, "H", ye[7] | 0);
	}
}, we = /* @__PURE__ */ ge(() => new Ce(), /* @__PURE__ */ O(1)), Te = (e, t, n) => se(e, t, n), A = oe, Ee = /* @__PURE__ */ BigInt(0), De = /* @__PURE__ */ BigInt(1);
function Oe(e, t = "") {
	if (typeof e != "boolean") {
		let n = t && `"${t}" `;
		throw TypeError(n + "expected boolean, got type=" + typeof e);
	}
	return e;
}
function ke(e) {
	if (typeof e == "bigint") {
		if (!Le(e)) throw RangeError("positive bigint expected, got " + e);
	} else A(e);
	return e;
}
function Ae(e, t = "") {
	if (typeof e != "number") {
		let n = t && `"${t}" `;
		throw TypeError(n + "expected number, got type=" + typeof e);
	}
	if (!Number.isSafeInteger(e)) {
		let n = t && `"${t}" `;
		throw RangeError(n + "expected safe integer, got " + e);
	}
}
function j(e) {
	let t = ke(e).toString(16);
	return t.length & 1 ? "0" + t : t;
}
function je(e) {
	if (typeof e != "string") throw TypeError("hex string expected, got " + typeof e);
	return e === "" ? Ee : BigInt("0x" + e);
}
function Me(e) {
	return je(pe(e));
}
function Ne(e) {
	return je(pe(Ie(se(e)).reverse()));
}
function Pe(e, t) {
	if (oe(t), t === 0) throw RangeError("zero length");
	e = ke(e);
	let n = e.toString(16);
	if (n.length > t * 2) throw RangeError("number too large");
	return he(n.padStart(t * 2, "0"));
}
function Fe(e, t) {
	return Pe(e, t).reverse();
}
function Ie(e) {
	return Uint8Array.from(Te(e));
}
var Le = (e) => typeof e == "bigint" && Ee <= e;
function M(e) {
	if (e < Ee) throw Error("expected non-negative bigint, got " + e);
	let t = 0;
	for (; e > Ee; e >>= De, t += 1);
	return t;
}
var N = /* @__PURE__ */ BigInt(0), P = /* @__PURE__ */ BigInt(1), F = /* @__PURE__ */ BigInt(2), Re = /* @__PURE__ */ BigInt(3), I = /* @__PURE__ */ BigInt(4), ze = /* @__PURE__ */ BigInt(5), Be = /* @__PURE__ */ BigInt(7), Ve = /* @__PURE__ */ BigInt(8), He = /* @__PURE__ */ BigInt(9), Ue = /* @__PURE__ */ BigInt(16);
function L(e, t) {
	if (t <= N) throw Error("mod: expected positive modulus, got " + t);
	let n = e % t;
	return n >= N ? n : t + n;
}
function R(e, t, n) {
	if (t < N) throw Error("pow2: expected non-negative exponent, got " + t);
	let r = e;
	for (; t-- > N;) r *= r, r %= n;
	return r;
}
function We(e, t) {
	if (e === N) throw Error("invert: expected non-zero number");
	if (t <= N) throw Error("invert: expected positive modulus, got " + t);
	let n = L(e, t), r = t, i = N, a = P;
	for (; n !== N;) {
		let e = r / n, t = r - n * e, o = i - a * e;
		r = n, n = t, i = a, a = o;
	}
	if (r !== P) throw Error("invert: does not exist");
	return L(i, t);
}
function Ge(e, t, n) {
	let r = e;
	if (!r.eql(r.sqr(t), n)) throw Error("Cannot find square root");
}
function Ke(e, t) {
	let n = e, r = (n.ORDER + P) / I, i = n.pow(t, r);
	return Ge(n, i, t), i;
}
function qe(e, t) {
	let n = e, r = (n.ORDER - ze) / Ve, i = n.mul(t, F), a = n.pow(i, r), o = n.mul(t, a), s = n.mul(n.mul(o, F), a), c = n.mul(o, n.sub(s, n.ONE));
	return Ge(n, c, t), c;
}
function z(e) {
	let t = H(e), n = B(e), r = n(t, t.neg(t.ONE)), i = n(t, r), a = n(t, t.neg(r)), o = (e + Be) / Ue;
	return (e, t) => {
		let n = e, s = n.pow(t, o), c = n.mul(s, r), l = n.mul(s, i), u = n.mul(s, a), d = n.eql(n.sqr(c), t), f = n.eql(n.sqr(l), t);
		s = n.cmov(s, c, d), c = n.cmov(u, l, f);
		let p = n.eql(n.sqr(c), t), m = n.cmov(s, c, p);
		return Ge(n, m, t), m;
	};
}
function B(e) {
	if (e < Re) throw Error("sqrt is not defined for small field");
	let t = e - P, n = 0;
	for (; t % F === N;) t /= F, n++;
	let r = F, i = H(e);
	for (; Ze(i, r) === 1;) if (r++ > 1e3) throw Error("Cannot find square root: probably non-prime P");
	if (n === 1) return Ke;
	let a = i.pow(r, t), o = (t + P) / F;
	return function(e, r) {
		let i = e;
		if (i.is0(r)) return r;
		if (Ze(i, r) !== 1) throw Error("Cannot find square root");
		let s = n, c = i.mul(i.ONE, a), l = i.pow(r, t), u = i.pow(r, o);
		for (; !i.eql(l, i.ONE);) {
			if (i.is0(l)) return i.ZERO;
			let e = 1, t = i.sqr(l);
			for (; !i.eql(t, i.ONE);) if (e++, t = i.sqr(t), e === s) throw Error("Cannot find square root");
			let n = P << BigInt(s - e - 1), r = i.pow(c, n);
			s = e, c = i.sqr(r), l = i.mul(l, c), u = i.mul(u, r);
		}
		return u;
	};
}
function Je(e) {
	return e % I === Re ? Ke : e % Ve === ze ? qe : e % Ue === He ? z(e) : B(e);
}
function Ye(e, t, n) {
	let r = e;
	if (n < N) throw Error("invalid exponent, negatives unsupported");
	if (n === N) return r.ONE;
	if (n === P) return t;
	let i = r.ONE, a = t;
	for (; n > N;) n & P && (i = r.mul(i, a)), a = r.sqr(a), n >>= P;
	return i;
}
function Xe(e, t, n = !1) {
	let r = e, i = Array(t.length).fill(n ? r.ZERO : void 0), a = t.reduce((e, t, n) => r.is0(t) ? e : (i[n] = e, r.mul(e, t)), r.ONE), o = r.inv(a);
	return t.reduceRight((e, t, n) => r.is0(t) ? e : (i[n] = r.mul(e, i[n]), r.mul(e, t)), o), i;
}
function Ze(e, t) {
	let n = e, r = (n.ORDER - P) / F, i = n.pow(t, r), a = n.eql(i, n.ONE), o = n.eql(i, n.ZERO), s = n.eql(i, n.neg(n.ONE));
	if (!a && !o && !s) throw Error("invalid Legendre symbol result");
	return a ? 1 : o ? 0 : -1;
}
function Qe(e, t) {
	if (t !== void 0 && A(t), e <= N) throw Error("invalid n length: expected positive n, got " + e);
	if (t !== void 0 && t < 1) throw Error("invalid n length: expected positive bit length, got " + t);
	let n = M(e);
	if (t !== void 0 && t < n) throw Error(`invalid n length: expected bit length (${n}) >= n.length (${t})`);
	let r = t === void 0 ? n : t;
	return {
		nBitLength: r,
		nByteLength: Math.ceil(r / 8)
	};
}
var V = /* @__PURE__ */ new WeakMap(), $e = class {
	constructor(e, t = {}) {
		if (w(this, "ORDER"), w(this, "BITS"), w(this, "BYTES"), w(this, "isLE"), w(this, "ZERO", N), w(this, "ONE", P), w(this, "_lengths"), w(this, "_mod"), e <= P) throw Error("invalid field: expected ORDER > 1, got " + e);
		let n;
		this.isLE = !1, typeof t == "object" && t && (typeof t.BITS == "number" && (n = t.BITS), typeof t.sqrt == "function" && Object.defineProperty(this, "sqrt", {
			value: t.sqrt,
			enumerable: !0
		}), typeof t.isLE == "boolean" && (this.isLE = t.isLE), t.allowedLengths && (this._lengths = Object.freeze(t.allowedLengths.slice())), typeof t.modFromBytes == "boolean" && (this._mod = t.modFromBytes));
		let { nBitLength: r, nByteLength: i } = Qe(e, n);
		if (i > 2048) throw Error("invalid field: expected ORDER of <= 2048 bytes");
		this.ORDER = e, this.BITS = r, this.BYTES = i, Object.freeze(this);
	}
	create(e) {
		return L(e, this.ORDER);
	}
	isValid(e) {
		if (typeof e != "bigint") throw TypeError("invalid field element: expected bigint, got " + typeof e);
		return N <= e && e < this.ORDER;
	}
	is0(e) {
		return e === N;
	}
	isValidNot0(e) {
		return !this.is0(e) && this.isValid(e);
	}
	isOdd(e) {
		return (e & P) === P;
	}
	neg(e) {
		return L(-e, this.ORDER);
	}
	eql(e, t) {
		return e === t;
	}
	sqr(e) {
		return L(e * e, this.ORDER);
	}
	add(e, t) {
		return L(e + t, this.ORDER);
	}
	sub(e, t) {
		return L(e - t, this.ORDER);
	}
	mul(e, t) {
		return L(e * t, this.ORDER);
	}
	pow(e, t) {
		return Ye(this, e, t);
	}
	div(e, t) {
		return L(e * We(t, this.ORDER), this.ORDER);
	}
	sqrN(e) {
		return e * e;
	}
	addN(e, t) {
		return e + t;
	}
	subN(e, t) {
		return e - t;
	}
	mulN(e, t) {
		return e * t;
	}
	inv(e) {
		return We(e, this.ORDER);
	}
	sqrt(e) {
		let t = V.get(this);
		return t || V.set(this, t = Je(this.ORDER)), t(this, e);
	}
	toBytes(e) {
		return this.isLE ? Fe(e, this.BYTES) : Pe(e, this.BYTES);
	}
	fromBytes(e, t = !1) {
		Te(e);
		let { _lengths: n, BYTES: r, isLE: i, ORDER: a, _mod: o } = this;
		if (n) {
			if (e.length < 1 || !n.includes(e.length) || e.length > r) throw Error("Field.fromBytes: expected " + n + " bytes, got " + e.length);
			let t = new Uint8Array(r);
			t.set(e, i ? 0 : t.length - e.length), e = t;
		}
		if (e.length !== r) throw Error("Field.fromBytes: expected " + r + " bytes, got " + e.length);
		let s = i ? Ne(e) : Me(e);
		if (o && (s = L(s, a)), !t && !this.isValid(s)) throw Error("invalid field element: outside of range 0..ORDER");
		return s;
	}
	invertBatch(e) {
		return Xe(this, e);
	}
	cmov(e, t, n) {
		return Oe(n, "condition"), n ? t : e;
	}
};
Object.freeze($e.prototype);
function H(e, t = {}) {
	return new $e(e, t);
}
var U = {
	Err: class extends Error {
		constructor(e = "") {
			super(e);
		}
	},
	_tlv: {
		encode: (e, t) => {
			let { Err: n } = U;
			if (Ae(e, "tag"), e < 0 || e > 255) throw new n("tlv.encode: wrong tag");
			if (typeof t != "string") throw TypeError("\"data\" expected string, got type=" + typeof t);
			if (t.length & 1) throw new n("tlv.encode: unpadded data");
			let r = t.length / 2, i = j(r);
			if (i.length / 2 & 128) throw new n("tlv.encode: long form length too big");
			let a = r > 127 ? j(i.length / 2 | 128) : "";
			return j(e) + a + i + t;
		},
		decode(e, t) {
			let { Err: n } = U;
			t = Te(t, void 0, "DER data");
			let r = 0;
			if (e < 0 || e > 255) throw new n("tlv.encode: wrong tag");
			if (t.length < 2 || t[r++] !== e) throw new n("tlv.decode: wrong tlv");
			let i = t[r++], a = !!(i & 128), o = 0;
			if (!a) o = i;
			else {
				let e = i & 127;
				if (!e) throw new n("tlv.decode(long): indefinite length not supported");
				if (e > 4) throw new n("tlv.decode(long): byte length is too big");
				let a = t.subarray(r, r + e);
				if (a.length !== e) throw new n("tlv.decode: length bytes not complete");
				if (a[0] === 0) throw new n("tlv.decode(long): zero leftmost byte");
				for (let e of a) o = o << 8 | e;
				if (r += e, o < 128) throw new n("tlv.decode(long): not minimal encoding");
			}
			let s = t.subarray(r, r + o);
			if (s.length !== o) throw new n("tlv.decode: wrong value length");
			return {
				v: s,
				l: t.subarray(r + o)
			};
		}
	},
	_int: {
		encode(e) {
			let { Err: t } = U;
			if (ke(e), e < et) throw new t("integer: negative integers are not allowed");
			let n = j(e);
			if (Number.parseInt(n[0], 16) & 8 && (n = "00" + n), n.length & 1) throw new t("unexpected DER parsing assertion: unpadded hex");
			return n;
		},
		decode(e) {
			let { Err: t } = U;
			if (e.length < 1) throw new t("invalid signature integer: empty");
			if (e[0] & 128) throw new t("invalid signature integer: negative");
			if (e.length > 1 && e[0] === 0 && !(e[1] & 128)) throw new t("invalid signature integer: unnecessary leading zero");
			return Me(e);
		}
	},
	toSig(e) {
		let { Err: t, _int: n, _tlv: r } = U, i = Te(e, void 0, "signature"), { v: a, l: o } = r.decode(48, i);
		if (o.length) throw new t("invalid signature: left bytes after parsing");
		let { v: s, l: c } = r.decode(2, a), { v: l, l: u } = r.decode(2, c);
		if (u.length) throw new t("invalid signature: left bytes after parsing");
		return {
			r: n.decode(s),
			s: n.decode(l)
		};
	},
	hexFromSig(e) {
		let { _tlv: t, _int: n } = U, r = t.encode(2, n.encode(e.r)) + t.encode(2, n.encode(e.s));
		return t.encode(48, r);
	}
};
Object.freeze(U._tlv), Object.freeze(U._int), Object.freeze(U);
var et = /* @__PURE__ */ BigInt(0), W = {
	p: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
	n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
	h: BigInt(1),
	a: BigInt(0),
	b: BigInt(7),
	Gx: BigInt("0x79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798"),
	Gy: BigInt("0x483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8")
};
-BigInt("0xe4437ed6010e88286f547fa90abfe4c3");
var tt = /* @__PURE__ */ BigInt(2);
function nt(e) {
	let t = W.p, n = BigInt(3), r = BigInt(6), i = BigInt(11), a = BigInt(22), o = BigInt(23), s = BigInt(44), c = BigInt(88), l = e * e * e % t, u = l * l * e % t, d = R(R(R(u, n, t) * u % t, n, t) * u % t, tt, t) * l % t, f = R(d, i, t) * d % t, p = R(f, a, t) * f % t, m = R(p, s, t) * p % t, h = R(R(R(R(R(R(m, c, t) * m % t, s, t) * p % t, n, t) * u % t, o, t) * f % t, r, t) * l % t, tt, t);
	if (!rt.eql(rt.sqr(h), e)) throw Error("Cannot find square root");
	return h;
}
var rt = H(W.p, { sqrt: nt }), it = new TextEncoder();
function G(e) {
	return pe(we(it.encode(e)));
}
function at(e) {
	return G(JSON.stringify([
		0,
		e.pubkey,
		e.created_at,
		e.kind,
		e.tags,
		e.content
	]));
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/storage/eventStoreMigration.ts
function ot(e) {
	try {
		if (!n(e)) return null;
		let t = o(e);
		return r(t) && at(t) === t.id && a(t) ? { event: t } : null;
	} catch {
		return null;
	}
}
var st = "shared-events-v19", ct = 100, lt = () => ({
	id: st,
	tableIndex: 0,
	lastKey: "",
	done: !1
}), ut = (e) => new Promise((t, n) => {
	e.onsuccess = () => t(e.result), e.onerror = () => n(e.error);
}), dt = (e) => new Promise((t, n) => {
	e.oncomplete = () => t(), e.onabort = e.onerror = () => n(e.error ?? /* @__PURE__ */ Error("event_store_migration_aborted"));
});
async function ft(e) {
	for (;;) {
		let t = e.transaction(["eventStoreMigration", ...ee], "readonly"), n = await ut(t.objectStore("eventStoreMigration").get(st)) ?? lt();
		if (n.done) return;
		let r = ee[n.tableIndex], a = await ut(t.objectStore(r).getAll(n.lastKey ? IDBKeyRange.lowerBound(n.lastKey, !0) : void 0, ct)), o = a.map((e) => ne(e, r)), s = /* @__PURE__ */ new Map();
		for (let e of o.flatMap((e) => e.items)) {
			let t = ot(e.event);
			if (!t) continue;
			let n = s.get(t.event.id), r = e.receivedAt ?? Date.now();
			s.set(t.event.id, {
				id: t.event.id,
				rawEvent: t.event,
				verification: {
					status: "valid",
					ruleVersion: 1
				},
				relayUrls: i.sanitizeExternalRelayUrls([...n?.relayUrls ?? [], ...e.relayUrls ?? []]),
				receivedAt: Math.min(n?.receivedAt ?? r, r),
				lastSeenAt: Math.max(n?.lastSeenAt ?? r, r),
				relatedEventIds: [.../* @__PURE__ */ new Set([
					...n?.relatedEventIds ?? [],
					...e.relatedEventIds ?? [],
					...t.event.tags.flatMap((e) => [
						"e",
						"q",
						"c"
					].includes(e[0]) && /^[0-9a-f]{64}$/.test(e[1] ?? "") ? [e[1]] : [])
				])],
				deletedAt: n?.deletedAt ?? e.deletedAt,
				deletionEventId: n?.deletionEventId ?? e.deletionEventId
			});
		}
		let c = e.transaction([
			"eventStoreMigration",
			"events",
			r
		], "readwrite"), l = dt(c);
		try {
			let e = c.objectStore("eventStoreMigration"), t = await ut(e.get(st)) ?? lt();
			if (t.tableIndex !== n.tableIndex || t.lastKey !== n.lastKey || t.done) {
				await l;
				continue;
			}
			let u = c.objectStore("events");
			for (let e of s.values()) {
				let t = await ut(u.get(e.id));
				u.put({
					...e,
					...t ? {
						rawEvent: t.rawEvent,
						relayUrls: i.sanitizeExternalRelayUrls([...t.relayUrls, ...e.relayUrls]),
						receivedAt: Math.min(t.receivedAt, e.receivedAt),
						lastSeenAt: Math.max(t.lastSeenAt, e.lastSeenAt),
						relatedEventIds: [.../* @__PURE__ */ new Set([...t.relatedEventIds, ...e.relatedEventIds])],
						deletedAt: t.deletedAt ?? e.deletedAt,
						deletionEventId: t.deletionEventId ?? e.deletionEventId
					} : {}
				});
			}
			for (let e = 0; e < o.length; e++) {
				let t = o[e], n = te(t.metadata, r), i = s.has(n) || n && await ut(u.get(n)), l = {
					...a[e],
					...r === "postHistory" || r === "sensitivePayloads" || r === "postHistoryDeletionRequests" ? { rawEventVerification: {
						status: "invalid",
						ruleVersion: 1
					} } : {}
				};
				c.objectStore(r).put(i ? t.metadata : l);
			}
			let d = a.length < ct;
			e.put({
				id: st,
				tableIndex: n.tableIndex + +!!d,
				lastKey: d ? "" : String(a.at(-1).id),
				done: d && n.tableIndex === ee.length - 1
			}), await l;
		} catch (e) {
			try {
				c.abort();
			} catch {}
			throw await l.catch(() => void 0), e;
		}
	}
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/dexie/import-wrapper-prod.mjs
var pt = /* @__PURE__ */ e((/* @__PURE__ */ t(((e, t, n) => {
	((n, r) => {
		typeof e == "object" && t !== void 0 ? t.exports = r() : typeof define == "function" && define.amd ? define(r) : (n = typeof globalThis < "u" ? globalThis : n || self).Dexie = r();
	})(n, function() {
		var e = function(t, n) {
			return (e = Object.setPrototypeOf || ({ __proto__: [] } instanceof Array ? function(e, t) {
				e.__proto__ = t;
			} : function(e, t) {
				for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
			}))(t, n);
		}, t = function() {
			return (t = Object.assign || function(e) {
				for (var t, n = 1, r = arguments.length; n < r; n++) for (var i in t = arguments[n]) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
				return e;
			}).apply(this, arguments);
		};
		function n(e, t, n) {
			if (n || arguments.length === 2) for (var r, i = 0, a = t.length; i < a; i++) !r && i in t || ((r ||= Array.prototype.slice.call(t, 0, i))[i] = t[i]);
			return e.concat(r || Array.prototype.slice.call(t));
		}
		var r = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : global, i = Object.keys, a = Array.isArray;
		function o(e, t) {
			return typeof t == "object" && i(t).forEach(function(n) {
				e[n] = t[n];
			}), e;
		}
		typeof Promise > "u" || r.Promise || (r.Promise = Promise);
		var s = Object.getPrototypeOf, c = {}.hasOwnProperty;
		function l(e, t) {
			return c.call(e, t);
		}
		function u(e, t) {
			typeof t == "function" && (t = t(s(e))), (typeof Reflect > "u" ? i : Reflect.ownKeys)(t).forEach(function(n) {
				f(e, n, t[n]);
			});
		}
		var d = Object.defineProperty;
		function f(e, t, n, r) {
			d(e, t, o(n && l(n, "get") && typeof n.get == "function" ? {
				get: n.get,
				set: n.set,
				configurable: !0
			} : {
				value: n,
				configurable: !0,
				writable: !0
			}, r));
		}
		function p(e) {
			return { from: function(t) {
				return e.prototype = Object.create(t.prototype), f(e.prototype, "constructor", e), { extend: u.bind(null, e.prototype) };
			} };
		}
		var m = Object.getOwnPropertyDescriptor, h = [].slice;
		function g(e, t, n) {
			return h.call(e, t, n);
		}
		function _(e, t) {
			return t(e);
		}
		function v(e) {
			if (!e) throw Error("Assertion Failed");
		}
		function y(e) {
			r.setImmediate ? setImmediate(e) : setTimeout(e, 0);
		}
		function b(e, t) {
			if (typeof t == "string" && l(e, t)) return e[t];
			if (!t) return e;
			if (typeof t != "string") {
				for (var n = [], r = 0, i = t.length; r < i; ++r) {
					var a = b(e, t[r]);
					n.push(a);
				}
				return n;
			}
			var o, s = t.indexOf(".");
			return s === -1 || (o = e[t.substr(0, s)]) == null ? void 0 : b(o, t.substr(s + 1));
		}
		function x(e, t, n) {
			if (e && t !== void 0 && !("isFrozen" in Object && Object.isFrozen(e))) {
				if (typeof t != "string" && "length" in t) {
					v(typeof n != "string" && "length" in n);
					for (var r = 0, i = t.length; r < i; ++r) x(e, t[r], n[r]);
				} else {
					var o = t.indexOf(".");
					if (o !== -1) {
						var s = t.substr(0, o), o = t.substr(o + 1);
						if (o === "") n === void 0 ? a(e) && !isNaN(parseInt(s)) ? e.splice(s, 1) : delete e[s] : e[s] = n;
						else {
							var c = e[s];
							if (!c || !l(e, s)) {
								if (n === void 0) return;
								c = e[s] = {};
							}
							x(c, o, n);
						}
					} else n === void 0 ? a(e) && !isNaN(parseInt(t)) ? e.splice(t, 1) : delete e[t] : e[t] = n;
				}
			}
		}
		function S(e) {
			var t, n = {};
			for (t in e) l(e, t) && (n[t] = e[t]);
			return n;
		}
		var C = [].concat;
		function ee(e) {
			return C.apply([], e);
		}
		var te = "BigUint64Array,BigInt64Array,Array,Boolean,String,Date,RegExp,Blob,File,FileList,FileSystemFileHandle,FileSystemDirectoryHandle,ArrayBuffer,DataView,Uint8ClampedArray,ImageBitmap,ImageData,Map,Set,CryptoKey".split(",").concat(ee([
			8,
			16,
			32,
			64
		].map(function(e) {
			return [
				"Int",
				"Uint",
				"Float"
			].map(function(t) {
				return t + e + "Array";
			});
		}))).filter(function(e) {
			return r[e];
		}), ne = new Set(te.map(function(e) {
			return r[e];
		})), re = null;
		function ie(e) {
			return re = /* @__PURE__ */ new WeakMap(), e = function e(t) {
				if (!t || typeof t != "object") return t;
				var n = re.get(t);
				if (n) return n;
				if (a(t)) {
					n = [], re.set(t, n);
					for (var r = 0, i = t.length; r < i; ++r) n.push(e(t[r]));
				} else if (ne.has(t.constructor)) n = t;
				else {
					var o, c = s(t);
					for (o in n = c === Object.prototype ? {} : Object.create(c), re.set(t, n), t) l(t, o) && (n[o] = e(t[o]));
				}
				return n;
			}(e), re = null, e;
		}
		var w = {}.toString;
		function ae(e) {
			return w.call(e).slice(8, -1);
		}
		var oe = typeof Symbol < "u" ? Symbol.iterator : "@@iterator", se = typeof oe == "symbol" ? function(e) {
			var t;
			return e != null && (t = e[oe]) && t.apply(e);
		} : function() {
			return null;
		};
		function ce(e, t) {
			t = e.indexOf(t), 0 <= t && e.splice(t, 1);
		}
		var le = {};
		function T(e) {
			var t, n, r, i;
			if (arguments.length === 1) {
				if (a(e)) return e.slice();
				if (this === le && typeof e == "string") return [e];
				if (i = se(e)) for (n = []; !(r = i.next()).done;) n.push(r.value);
				else {
					if (e == null || typeof (t = e.length) != "number") return [e];
					for (n = Array(t); t--;) n[t] = e[t];
				}
			} else for (t = arguments.length, n = Array(t); t--;) n[t] = arguments[t];
			return n;
		}
		var ue = typeof Symbol < "u" ? function(e) {
			return e[Symbol.toStringTag] === "AsyncFunction";
		} : function() {
			return !1;
		}, te = [
			"Unknown",
			"Constraint",
			"Data",
			"TransactionInactive",
			"ReadOnly",
			"Version",
			"NotFound",
			"InvalidState",
			"InvalidAccess",
			"Abort",
			"Timeout",
			"QuotaExceeded",
			"Syntax",
			"DataClone"
		], E = [
			"Modify",
			"Bulk",
			"OpenFailed",
			"VersionChange",
			"Schema",
			"Upgrade",
			"InvalidTable",
			"MissingAPI",
			"NoSuchDatabase",
			"InvalidArgument",
			"SubTransaction",
			"Unsupported",
			"Internal",
			"DatabaseClosed",
			"PrematureCommit",
			"ForeignAwait"
		].concat(te), de = {
			VersionChanged: "Database version changed by other database connection",
			DatabaseClosed: "Database has been closed",
			Abort: "Transaction aborted",
			TransactionInactive: "Transaction has already completed or failed",
			MissingAPI: "IndexedDB API missing. Please visit https://tinyurl.com/y2uuvskb"
		};
		function fe(e, t) {
			this.name = e, this.message = t;
		}
		function pe(e, t) {
			return e + ". Errors: " + Object.keys(t).map(function(e) {
				return t[e].toString();
			}).filter(function(e, t, n) {
				return n.indexOf(e) === t;
			}).join("\n");
		}
		function D(e, t, n, r) {
			this.failures = t, this.failedKeys = r, this.successCount = n, this.message = pe(e, t);
		}
		function me(e, t) {
			this.name = "BulkError", this.failures = Object.keys(t).map(function(e) {
				return t[e];
			}), this.failuresByPos = t, this.message = pe(e, this.failures);
		}
		p(fe).from(Error).extend({ toString: function() {
			return this.name + ": " + this.message;
		} }), p(D).from(fe), p(me).from(fe);
		var he = E.reduce(function(e, t) {
			return e[t] = t + "Error", e;
		}, {}), ge = fe, O = E.reduce(function(e, t) {
			var n = t + "Error";
			function r(e, r) {
				this.name = n, e ? typeof e == "string" ? (this.message = `${e}${r ? "\n " + r : ""}`, this.inner = r || null) : typeof e == "object" && (this.message = `${e.name} ${e.message}`, this.inner = e) : (this.message = de[t] || n, this.inner = null);
			}
			return p(r).from(ge), e[t] = r, e;
		}, {}), _e = (O.Syntax = SyntaxError, O.Type = TypeError, O.Range = RangeError, te.reduce(function(e, t) {
			return e[t + "Error"] = O[t], e;
		}, {}));
		te = E.reduce(function(e, t) {
			return [
				"Syntax",
				"Type",
				"Range"
			].indexOf(t) === -1 && (e[t + "Error"] = O[t]), e;
		}, {});
		function k() {}
		function ve(e) {
			return e;
		}
		function ye(e, t) {
			return e == null || e === ve ? t : function(n) {
				return t(e(n));
			};
		}
		function be(e, t) {
			return function() {
				e.apply(this, arguments), t.apply(this, arguments);
			};
		}
		function xe(e, t) {
			return e === k ? t : function() {
				var n = e.apply(this, arguments), r = (n !== void 0 && (arguments[0] = n), this.onsuccess), i = this.onerror, a = (this.onsuccess = null, this.onerror = null, t.apply(this, arguments));
				return r && (this.onsuccess = this.onsuccess ? be(r, this.onsuccess) : r), i && (this.onerror = this.onerror ? be(i, this.onerror) : i), a === void 0 ? n : a;
			};
		}
		function Se(e, t) {
			return e === k ? t : function() {
				e.apply(this, arguments);
				var n = this.onsuccess, r = this.onerror;
				this.onsuccess = this.onerror = null, t.apply(this, arguments), n && (this.onsuccess = this.onsuccess ? be(n, this.onsuccess) : n), r && (this.onerror = this.onerror ? be(r, this.onerror) : r);
			};
		}
		function Ce(e, t) {
			return e === k ? t : function() {
				var n = e.apply(this, arguments), r = (o(arguments[0], n), this.onsuccess), i = this.onerror, a = (this.onsuccess = null, this.onerror = null, t.apply(this, arguments));
				return r && (this.onsuccess = this.onsuccess ? be(r, this.onsuccess) : r), i && (this.onerror = this.onerror ? be(i, this.onerror) : i), n === void 0 ? a === void 0 ? void 0 : a : o(n, a);
			};
		}
		function we(e, t) {
			return e === k ? t : function() {
				return !1 !== t.apply(this, arguments) && e.apply(this, arguments);
			};
		}
		function Te(e, t) {
			return e === k ? t : function() {
				var n = e.apply(this, arguments);
				if (n && typeof n.then == "function") {
					for (var r = this, i = arguments.length, a = Array(i); i--;) a[i] = arguments[i];
					return n.then(function() {
						return t.apply(r, a);
					});
				}
				return t.apply(this, arguments);
			};
		}
		te.ModifyError = D, te.DexieError = fe, te.BulkError = me;
		var A = typeof location < "u" && /^(http|https):\/\/(localhost|127\.0\.0\.1)/.test(location.href);
		function Ee(e) {
			A = e;
		}
		var De = {}, Oe = 100, ke = typeof Promise > "u" ? [] : (E = Promise.resolve(), typeof crypto < "u" && crypto.subtle ? [
			ke = crypto.subtle.digest("SHA-512", new Uint8Array([0])),
			s(ke),
			E
		] : [
			E,
			s(E),
			E
		]), E = ke[0], Ae = ke[1], Ae = Ae && Ae.then, j = E && E.constructor, je = !!ke[2], Me = function(e, t) {
			P.push([e, t]), Pe &&= (queueMicrotask(R), !1);
		}, Ne = !0, Pe = !0, Fe = [], Ie = [], Le = ve, M = {
			id: "global",
			global: !0,
			ref: 0,
			unhandleds: [],
			onunhandled: k,
			pgp: !1,
			env: {},
			finalize: k
		}, N = M, P = [], F = 0, Re = [];
		function I(e) {
			if (typeof this != "object") throw TypeError("Promises must be constructed via new");
			this._listeners = [], this._lib = !1;
			var t = this._PSD = N;
			if (typeof e != "function") {
				if (e !== De) throw TypeError("Not a function");
				this._state = arguments[1], this._value = arguments[2], !1 === this._state && Ve(this, this._value);
			} else this._state = null, this._value = null, ++t.ref, function e(t, n) {
				try {
					n(function(n) {
						if (t._state === null) {
							if (n === t) throw TypeError("A promise cannot be resolved with itself.");
							var r = t._lib && We();
							n && typeof n.then == "function" ? e(t, function(e, t) {
								n instanceof I ? n._then(e, t) : n.then(e, t);
							}) : (t._state = !0, t._value = n, He(t)), r && Ge();
						}
					}, Ve.bind(null, t));
				} catch (e) {
					Ve(t, e);
				}
			}(this, e);
		}
		var ze = {
			get: function() {
				var e = N, t = Ze;
				function n(n, r) {
					var i = this, a = !e.global && (e !== N || t !== Ze), o = a && !H(), s = new I(function(t, s) {
						Ue(i, new Be(rt(n, e, a, o), rt(r, e, a, o), t, s, e));
					});
					return this._consoleTask && (s._consoleTask = this._consoleTask), s;
				}
				return n.prototype = De, n;
			},
			set: function(e) {
				f(this, "then", e && e.prototype === De ? ze : {
					get: function() {
						return e;
					},
					set: ze.set
				});
			}
		};
		function Be(e, t, n, r, i) {
			this.onFulfilled = typeof e == "function" ? e : null, this.onRejected = typeof t == "function" ? t : null, this.resolve = n, this.reject = r, this.psd = i;
		}
		function Ve(e, t) {
			var n, r;
			Ie.push(t), e._state === null && (n = e._lib && We(), t = Le(t), e._state = !1, e._value = t, r = e, Fe.some(function(e) {
				return e._value === r._value;
			}) || Fe.push(r), He(e), n) && Ge();
		}
		function He(e) {
			var t = e._listeners;
			e._listeners = [];
			for (var n = 0, r = t.length; n < r; ++n) Ue(e, t[n]);
			var i = e._PSD;
			--i.ref || i.finalize(), F === 0 && (++F, Me(function() {
				--F == 0 && Ke();
			}, []));
		}
		function Ue(e, t) {
			if (e._state === null) e._listeners.push(t);
			else {
				var n = e._state ? t.onFulfilled : t.onRejected;
				if (n === null) return (e._state ? t.resolve : t.reject)(e._value);
				++t.psd.ref, ++F, Me(L, [
					n,
					e,
					t
				]);
			}
		}
		function L(e, t, n) {
			try {
				var r, i = t._value;
				!t._state && Ie.length && (Ie = []), r = A && t._consoleTask ? t._consoleTask.run(function() {
					return e(i);
				}) : e(i), t._state || Ie.indexOf(i) !== -1 || ((e) => {
					for (var t = Fe.length; t;) if (Fe[--t]._value === e._value) return Fe.splice(t, 1);
				})(t), n.resolve(r);
			} catch (e) {
				n.reject(e);
			} finally {
				--F == 0 && Ke(), --n.psd.ref || n.psd.finalize();
			}
		}
		function R() {
			nt(M, function() {
				We() && Ge();
			});
		}
		function We() {
			var e = Ne;
			return Pe = Ne = !1, e;
		}
		function Ge() {
			var e, t, n;
			do
				for (; 0 < P.length;) for (e = P, P = [], n = e.length, t = 0; t < n; ++t) {
					var r = e[t];
					r[0].apply(null, r[1]);
				}
			while (0 < P.length);
			Pe = Ne = !0;
		}
		function Ke() {
			for (var e = Fe, t = (Fe = [], e.forEach(function(e) {
				e._PSD.onunhandled.call(null, e._value, e);
			}), Re.slice(0)), n = t.length; n;) t[--n]();
		}
		function qe(e) {
			return new I(De, !1, e);
		}
		function z(e, t) {
			var n = N;
			return function() {
				var r = We(), i = N;
				try {
					return W(n, !0), e.apply(this, arguments);
				} catch (e) {
					t && t(e);
				} finally {
					W(i, !1), r && Ge();
				}
			};
		}
		u(I.prototype, {
			then: ze,
			_then: function(e, t) {
				Ue(this, new Be(null, null, e, t, N));
			},
			catch: function(e) {
				var t, n;
				return arguments.length === 1 ? this.then(null, e) : (t = e, n = arguments[1], typeof t == "function" ? this.then(null, function(e) {
					return (e instanceof t ? n : qe)(e);
				}) : this.then(null, function(e) {
					return (e && e.name === t ? n : qe)(e);
				}));
			},
			finally: function(e) {
				return this.then(function(t) {
					return I.resolve(e()).then(function() {
						return t;
					});
				}, function(t) {
					return I.resolve(e()).then(function() {
						return qe(t);
					});
				});
			},
			timeout: function(e, t) {
				var n = this;
				return e < 1 / 0 ? new I(function(r, i) {
					var a = setTimeout(function() {
						return i(new O.Timeout(t));
					}, e);
					n.then(r, i).finally(clearTimeout.bind(null, a));
				}) : this;
			}
		}), typeof Symbol < "u" && Symbol.toStringTag && f(I.prototype, Symbol.toStringTag, "Dexie.Promise"), M.env = tt(), u(I, {
			all: function() {
				var e = T.apply(null, arguments).map(U);
				return new I(function(t, n) {
					e.length === 0 && t([]);
					var r = e.length;
					e.forEach(function(i, a) {
						return I.resolve(i).then(function(n) {
							e[a] = n, --r || t(e);
						}, n);
					});
				});
			},
			resolve: function(e) {
				return e instanceof I ? e : e && typeof e.then == "function" ? new I(function(t, n) {
					e.then(t, n);
				}) : new I(De, !0, e);
			},
			reject: qe,
			race: function() {
				var e = T.apply(null, arguments).map(U);
				return new I(function(t, n) {
					e.map(function(e) {
						return I.resolve(e).then(t, n);
					});
				});
			},
			PSD: {
				get: function() {
					return N;
				},
				set: function(e) {
					return N = e;
				}
			},
			totalEchoes: { get: function() {
				return Ze;
			} },
			newPSD: V,
			usePSD: nt,
			scheduler: {
				get: function() {
					return Me;
				},
				set: function(e) {
					Me = e;
				}
			},
			rejectionMapper: {
				get: function() {
					return Le;
				},
				set: function(e) {
					Le = e;
				}
			},
			follow: function(e, t) {
				return new I(function(n, r) {
					return V(function(t, n) {
						var r = N;
						r.unhandleds = [], r.onunhandled = n, r.finalize = be(function() {
							var e, r = this;
							e = function() {
								r.unhandleds.length === 0 ? t() : n(r.unhandleds[0]);
							}, Re.push(function t() {
								e(), Re.splice(Re.indexOf(t), 1);
							}), ++F, Me(function() {
								--F == 0 && Ke();
							}, []);
						}, r.finalize), e();
					}, t, n, r);
				});
			}
		}), j && (j.allSettled && f(I, "allSettled", function() {
			var e = T.apply(null, arguments).map(U);
			return new I(function(t) {
				e.length === 0 && t([]);
				var n = e.length, r = Array(n);
				e.forEach(function(e, i) {
					return I.resolve(e).then(function(e) {
						return r[i] = {
							status: "fulfilled",
							value: e
						};
					}, function(e) {
						return r[i] = {
							status: "rejected",
							reason: e
						};
					}).then(function() {
						return --n || t(r);
					});
				});
			});
		}), j.any && typeof AggregateError < "u" && f(I, "any", function() {
			var e = T.apply(null, arguments).map(U);
			return new I(function(t, n) {
				e.length === 0 && n(/* @__PURE__ */ AggregateError([]));
				var r = e.length, i = Array(r);
				e.forEach(function(e, a) {
					return I.resolve(e).then(function(e) {
						return t(e);
					}, function(e) {
						i[a] = e, --r || n(AggregateError(i));
					});
				});
			});
		}), j.withResolvers) && (I.withResolvers = j.withResolvers);
		var B = {
			awaits: 0,
			echoes: 0,
			id: 0
		}, Je = 0, Ye = [], Xe = 0, Ze = 0, Qe = 0;
		function V(e, t, n, r) {
			var i = N, a = Object.create(i), t = (a.parent = i, a.ref = 0, a.global = !1, a.id = ++Qe, M.env, a.env = je ? {
				Promise: I,
				PromiseProp: {
					value: I,
					configurable: !0,
					writable: !0
				},
				all: I.all,
				race: I.race,
				allSettled: I.allSettled,
				any: I.any,
				resolve: I.resolve,
				reject: I.reject
			} : {}, t && o(a, t), ++i.ref, a.finalize = function() {
				--this.parent.ref || this.parent.finalize();
			}, nt(a, e, n, r));
			return a.ref === 0 && a.finalize(), t;
		}
		function $e() {
			return B.id ||= ++Je, ++B.awaits, B.echoes += Oe, B.id;
		}
		function H() {
			return !!B.awaits && (--B.awaits == 0 && (B.id = 0), B.echoes = B.awaits * Oe, !0);
		}
		function U(e) {
			return B.echoes && e && e.constructor === j ? ($e(), e.then(function(e) {
				return H(), e;
			}, function(e) {
				return H(), G(e);
			})) : e;
		}
		function et() {
			var e = Ye[Ye.length - 1];
			Ye.pop(), W(e, !1);
		}
		function W(e, t) {
			var n, i, a = N;
			(t ? !B.echoes || Xe++ && e === N : !Xe || --Xe && e === N) || queueMicrotask(t ? function(e) {
				++Ze, B.echoes && --B.echoes != 0 || (B.echoes = B.awaits = B.id = 0), Ye.push(N), W(e, !0);
			}.bind(null, e) : et), e !== N && (N = e, a === M && (M.env = tt()), je) && (n = M.env.Promise, i = e.env, a.global || e.global) && (Object.defineProperty(r, "Promise", i.PromiseProp), n.all = i.all, n.race = i.race, n.resolve = i.resolve, n.reject = i.reject, i.allSettled && (n.allSettled = i.allSettled), i.any) && (n.any = i.any);
		}
		function tt() {
			var e = r.Promise;
			return je ? {
				Promise: e,
				PromiseProp: Object.getOwnPropertyDescriptor(r, "Promise"),
				all: e.all,
				race: e.race,
				allSettled: e.allSettled,
				any: e.any,
				resolve: e.resolve,
				reject: e.reject
			} : {};
		}
		function nt(e, t, n, r, i) {
			var a = N;
			try {
				return W(e, !0), t(n, r, i);
			} finally {
				W(a, !1);
			}
		}
		function rt(e, t, n, r) {
			return typeof e == "function" ? function() {
				var i = N;
				n && $e(), W(t, !0);
				try {
					return e.apply(this, arguments);
				} finally {
					W(i, !1), r && queueMicrotask(H);
				}
			} : e;
		}
		function it(e) {
			Promise === j && B.echoes === 0 ? Xe === 0 ? e() : enqueueNativeMicroTask(e) : setTimeout(e, 0);
		}
		("" + Ae).indexOf("[native code]") === -1 && ($e = H = k);
		var G = I.reject, at = "￿", ot = "Invalid key provided. Keys must be of type string, number, Date or Array<string | number | Date>.", st = "String expected.", ct = "__dbnames", lt = "readonly", ut = "readwrite";
		function dt(e, t) {
			return e ? t ? function() {
				return e.apply(this, arguments) && t.apply(this, arguments);
			} : e : t;
		}
		var ft = {
			type: 3,
			lower: -1 / 0,
			lowerOpen: !1,
			upper: [[]],
			upperOpen: !1
		};
		function pt(e) {
			return typeof e != "string" || /\./.test(e) ? function(e) {
				return e;
			} : function(t) {
				return t[e] === void 0 && e in t && delete (t = ie(t))[e], t;
			};
		}
		function mt() {
			throw O.Type("Entity instances must never be new:ed. Instances are generated by the framework bypassing the constructor.");
		}
		function K(e, t) {
			try {
				var n = ht(e), r = ht(t);
				if (n !== r) return n === "Array" ? 1 : r === "Array" ? -1 : n === "binary" ? 1 : r === "binary" ? -1 : n === "string" ? 1 : r === "string" ? -1 : n === "Date" ? 1 : r === "Date" ? -1 : NaN;
				switch (n) {
					case "number":
					case "Date":
					case "string": return t < e ? 1 : e < t ? -1 : 0;
					case "binary":
						for (var i = gt(e), a = gt(t), o = i.length, s = a.length, c = o < s ? o : s, l = 0; l < c; ++l) if (i[l] !== a[l]) return i[l] < a[l] ? -1 : 1;
						return o === s ? 0 : o < s ? -1 : 1;
					case "Array":
						for (var u = e, d = t, f = u.length, p = d.length, m = f < p ? f : p, h = 0; h < m; ++h) {
							var g = K(u[h], d[h]);
							if (g !== 0) return g;
						}
						return f === p ? 0 : f < p ? -1 : 1;
				}
			} catch {}
			return NaN;
		}
		function ht(e) {
			var t = typeof e;
			return t == "object" && (ArrayBuffer.isView(e) || (t = ae(e)) === "ArrayBuffer") ? "binary" : t;
		}
		function gt(e) {
			return e instanceof Uint8Array ? e : ArrayBuffer.isView(e) ? new Uint8Array(e.buffer, e.byteOffset, e.byteLength) : new Uint8Array(e);
		}
		function _t(e, t, n) {
			var r = e.schema.yProps;
			return r ? (t && 0 < n.numFailures && (t = t.filter(function(e, t) {
				return !n.failures[t];
			})), Promise.all(r.map(function(n) {
				return n = n.updatesTable, t ? e.db.table(n).where("k").anyOf(t).delete() : e.db.table(n).clear();
			})).then(function() {
				return n;
			})) : n;
		}
		yt.prototype.execute = function(e) {
			var t = this["@@propmod"];
			if (t.add !== void 0) {
				var r = t.add;
				if (a(r)) return n(n([], a(e) ? e : [], !0), r, !0).sort();
				if (typeof r == "number") return (Number(e) || 0) + r;
				if (typeof r == "bigint") try {
					return BigInt(e) + r;
				} catch {
					return BigInt(0) + r;
				}
				throw TypeError(`Invalid term ${r}`);
			}
			if (t.remove !== void 0) {
				var i = t.remove;
				if (a(i)) return a(e) ? e.filter(function(e) {
					return !i.includes(e);
				}).sort() : [];
				if (typeof i == "number") return Number(e) - i;
				if (typeof i == "bigint") try {
					return BigInt(e) - i;
				} catch {
					return BigInt(0) - i;
				}
				throw TypeError(`Invalid subtrahend ${i}`);
			}
			return r = (r = t.replacePrefix)?.[0], r && typeof e == "string" && e.startsWith(r) ? t.replacePrefix[1] + e.substring(r.length) : e;
		};
		var vt = yt;
		function yt(e) {
			this["@@propmod"] = e;
		}
		function bt(e, t) {
			for (var n = i(t), r = n.length, a = !1, o = 0; o < r; ++o) {
				var s = n[o], c = t[s], l = b(e, s);
				c instanceof vt ? (x(e, s, c.execute(l)), a = !0) : l !== c && (x(e, s, c), a = !0);
			}
			return a;
		}
		q.prototype._trans = function(e, t, n) {
			var r = this._tx || N.trans, i = this.name, a = A && typeof console < "u" && console.createTask && console.createTask(`Dexie: ${e === "readonly" ? "read" : "write"} ${this.name}`);
			function o(e, n, r) {
				if (r.schema[i]) return t(r.idbtrans, r);
				throw new O.NotFound("Table " + i + " not part of transaction");
			}
			var s = We();
			try {
				var c = r && r.db._novip === this.db._novip ? r === N.trans ? r._promise(e, o, n) : V(function() {
					return r._promise(e, o, n);
				}, {
					trans: r,
					transless: N.transless || N
				}) : function e(t, n, r, i) {
					if (t.idbdb && (t._state.openComplete || N.letThrough || t._vip)) {
						var a = t._createTransaction(n, r, t._dbSchema);
						try {
							a.create(), t._state.PR1398_maxLoop = 3;
						} catch (a) {
							return a.name === he.InvalidState && t.isOpen() && 0 < --t._state.PR1398_maxLoop ? (console.warn("Dexie: Need to reopen db"), t.close({ disableAutoOpen: !1 }), t.open().then(function() {
								return e(t, n, r, i);
							})) : G(a);
						}
						return a._promise(n, function(e, t) {
							return V(function() {
								return N.trans = a, i(e, t, a);
							});
						}).then(function(e) {
							if (n === "readwrite") try {
								a.idbtrans.commit();
							} catch {}
							return n === "readonly" ? e : a._completion.then(function() {
								return e;
							});
						});
					}
					if (t._state.openComplete) return G(new O.DatabaseClosed(t._state.dbOpenError));
					if (!t._state.isBeingOpened) {
						if (!t._state.autoOpen) return G(new O.DatabaseClosed());
						t.open().catch(k);
					}
					return t._state.dbReadyPromise.then(function() {
						return e(t, n, r, i);
					});
				}(this.db, e, [this.name], o);
				return a && (c._consoleTask = a, c = c.catch(function(e) {
					return console.trace(e), G(e);
				})), c;
			} finally {
				s && Ge();
			}
		}, q.prototype.get = function(e, t) {
			var n = this;
			return e && e.constructor === Object ? this.where(e).first(t) : e == null ? G(new O.Type("Invalid argument to Table.get()")) : this._trans("readonly", function(t) {
				return n.core.get({
					trans: t,
					key: e
				}).then(function(e) {
					return n.hook.reading.fire(e);
				});
			}).then(t);
		}, q.prototype.where = function(e) {
			if (typeof e == "string") return new this.db.WhereClause(this, e);
			if (a(e)) return new this.db.WhereClause(this, `[${e.join("+")}]`);
			var t = i(e);
			if (t.length === 1) return this.where(t[0]).equals(e[t[0]]);
			var n = this.schema.indexes.concat(this.schema.primKey).filter(function(e) {
				if (e.compound && t.every(function(t) {
					return 0 <= e.keyPath.indexOf(t);
				})) {
					for (var n = 0; n < t.length; ++n) if (t.indexOf(e.keyPath[n]) === -1) return !1;
					return !0;
				}
				return !1;
			}).sort(function(e, t) {
				return e.keyPath.length - t.keyPath.length;
			})[0];
			if (n && this.db._maxKey !== at) return s = n.keyPath.slice(0, t.length), this.where(s).equals(s.map(function(t) {
				return e[t];
			}));
			!n && A && console.warn(`The query ${JSON.stringify(e)} on ${this.name} would benefit from a compound index [${t.join("+")}]`);
			var r = this.schema.idxByName;
			function o(e, t) {
				return K(e, t) === 0;
			}
			var s = t.reduce(function(t, n) {
				var i = t[0], t = t[1], s = r[n], c = e[n];
				return [i || s, i || !s ? dt(t, s && s.multi ? function(e) {
					return e = b(e, n), a(e) && e.some(function(e) {
						return o(c, e);
					});
				} : function(e) {
					return o(c, b(e, n));
				}) : t];
			}, [null, null]), c = s[0], s = s[1];
			return c ? this.where(c.name).equals(e[c.keyPath]).filter(s) : n ? this.filter(s) : this.where(t).equals("");
		}, q.prototype.filter = function(e) {
			return this.toCollection().and(e);
		}, q.prototype.count = function(e) {
			return this.toCollection().count(e);
		}, q.prototype.offset = function(e) {
			return this.toCollection().offset(e);
		}, q.prototype.limit = function(e) {
			return this.toCollection().limit(e);
		}, q.prototype.each = function(e) {
			return this.toCollection().each(e);
		}, q.prototype.toArray = function(e) {
			return this.toCollection().toArray(e);
		}, q.prototype.toCollection = function() {
			return new this.db.Collection(new this.db.WhereClause(this));
		}, q.prototype.orderBy = function(e) {
			return new this.db.Collection(new this.db.WhereClause(this, a(e) ? `[${e.join("+")}]` : e));
		}, q.prototype.reverse = function() {
			return this.toCollection().reverse();
		}, q.prototype.mapToClass = function(t) {
			for (var n = this.db, r = this.name, i = ((this.schema.mappedClass = t).prototype instanceof mt && (t = ((t) => {
				var i = s, a = t;
				if (typeof a != "function" && a !== null) throw TypeError("Class extends value " + String(a) + " is not a constructor or null");
				function o() {
					this.constructor = i;
				}
				function s() {
					return t !== null && t.apply(this, arguments) || this;
				}
				return e(i, a), i.prototype = a === null ? Object.create(a) : (o.prototype = a.prototype, new o()), Object.defineProperty(s.prototype, "db", {
					get: function() {
						return n;
					},
					enumerable: !1,
					configurable: !0
				}), s.prototype.table = function() {
					return r;
				}, s;
			})(t)), /* @__PURE__ */ new Set()), a = t.prototype; a; a = s(a)) Object.getOwnPropertyNames(a).forEach(function(e) {
				return i.add(e);
			});
			function o(e) {
				if (!e) return e;
				var n, r = Object.create(t.prototype);
				for (n in e) if (!i.has(n)) try {
					r[n] = e[n];
				} catch {}
				return r;
			}
			return this.schema.readHook && this.hook.reading.unsubscribe(this.schema.readHook), this.schema.readHook = o, this.hook("reading", o), t;
		}, q.prototype.defineClass = function() {
			return this.mapToClass(function(e) {
				o(this, e);
			});
		}, q.prototype.add = function(e, t) {
			var n = this, r = this.schema.primKey, i = r.auto, a = r.keyPath, o = e;
			return a && i && (o = pt(a)(e)), this._trans("readwrite", function(e) {
				return n.core.mutate({
					trans: e,
					type: "add",
					keys: t == null ? null : [t],
					values: [o]
				});
			}).then(function(e) {
				return e.numFailures ? I.reject(e.failures[0]) : e.lastResult;
			}).then(function(t) {
				if (a) try {
					x(e, a, t);
				} catch {}
				return t;
			});
		}, q.prototype.upsert = function(e, t) {
			var n = this, r = this.schema.primKey.keyPath;
			return this._trans("readwrite", function(i) {
				return n.core.get({
					trans: i,
					key: e
				}).then(function(a) {
					var o = a ?? {};
					return bt(o, t), r && x(o, r, e), n.core.mutate({
						trans: i,
						type: "put",
						values: [o],
						keys: [e],
						upsert: !0,
						updates: {
							keys: [e],
							changeSpecs: [t]
						}
					}).then(function(e) {
						return e.numFailures ? I.reject(e.failures[0]) : !!a;
					});
				});
			});
		}, q.prototype.update = function(e, t) {
			return typeof e != "object" || a(e) ? this.where(":id").equals(e).modify(t) : (e = b(e, this.schema.primKey.keyPath)) === void 0 ? G(new O.InvalidArgument("Given object does not contain its primary key")) : this.where(":id").equals(e).modify(t);
		}, q.prototype.put = function(e, t) {
			var n = this, r = this.schema.primKey, i = r.auto, a = r.keyPath, o = e;
			return a && i && (o = pt(a)(e)), this._trans("readwrite", function(e) {
				return n.core.mutate({
					trans: e,
					type: "put",
					values: [o],
					keys: t == null ? null : [t]
				});
			}).then(function(e) {
				return e.numFailures ? I.reject(e.failures[0]) : e.lastResult;
			}).then(function(t) {
				if (a) try {
					x(e, a, t);
				} catch {}
				return t;
			});
		}, q.prototype.delete = function(e) {
			var t = this;
			return this._trans("readwrite", function(n) {
				return t.core.mutate({
					trans: n,
					type: "delete",
					keys: [e]
				}).then(function(n) {
					return _t(t, [e], n);
				}).then(function(e) {
					return e.numFailures ? I.reject(e.failures[0]) : void 0;
				});
			});
		}, q.prototype.clear = function() {
			var e = this;
			return this._trans("readwrite", function(t) {
				return e.core.mutate({
					trans: t,
					type: "deleteRange",
					range: ft
				}).then(function(t) {
					return _t(e, null, t);
				});
			}).then(function(e) {
				return e.numFailures ? I.reject(e.failures[0]) : void 0;
			});
		}, q.prototype.bulkGet = function(e) {
			var t = this;
			return this._trans("readonly", function(n) {
				return t.core.getMany({
					keys: e,
					trans: n
				}).then(function(e) {
					return e.map(function(e) {
						return t.hook.reading.fire(e);
					});
				});
			});
		}, q.prototype.bulkAdd = function(e, t, n) {
			var r = this, i = Array.isArray(t) ? t : void 0, a = (n ||= i ? void 0 : t) ? n.allKeys : void 0;
			return this._trans("readwrite", function(t) {
				var n = r.schema.primKey, o = n.auto, n = n.keyPath;
				if (n && i) throw new O.InvalidArgument("bulkAdd(): keys argument invalid on tables with inbound keys");
				if (i && i.length !== e.length) throw new O.InvalidArgument("Arguments objects and keys must have the same length");
				var s = e.length, o = n && o ? e.map(pt(n)) : e;
				return r.core.mutate({
					trans: t,
					type: "add",
					keys: i,
					values: o,
					wantResults: a
				}).then(function(e) {
					var t = e.numFailures, n = e.failures;
					if (t === 0) return a ? e.results : e.lastResult;
					throw new me(`${r.name}.bulkAdd(): ${t} of ${s} operations failed`, n);
				});
			});
		}, q.prototype.bulkPut = function(e, t, n) {
			var r = this, i = Array.isArray(t) ? t : void 0, a = (n ||= i ? void 0 : t) ? n.allKeys : void 0;
			return this._trans("readwrite", function(t) {
				var n = r.schema.primKey, o = n.auto, n = n.keyPath;
				if (n && i) throw new O.InvalidArgument("bulkPut(): keys argument invalid on tables with inbound keys");
				if (i && i.length !== e.length) throw new O.InvalidArgument("Arguments objects and keys must have the same length");
				var s = e.length, o = n && o ? e.map(pt(n)) : e;
				return r.core.mutate({
					trans: t,
					type: "put",
					keys: i,
					values: o,
					wantResults: a
				}).then(function(e) {
					var t = e.numFailures, n = e.failures;
					if (t === 0) return a ? e.results : e.lastResult;
					throw new me(`${r.name}.bulkPut(): ${t} of ${s} operations failed`, n);
				});
			});
		}, q.prototype.bulkUpdate = function(e) {
			var t = this, n = this.core, r = e.map(function(e) {
				return e.key;
			}), i = e.map(function(e) {
				return e.changes;
			}), a = [];
			return this._trans("readwrite", function(o) {
				return n.getMany({
					trans: o,
					keys: r,
					cache: "clone"
				}).then(function(s) {
					var c = [], l = [], u = (e.forEach(function(e, n) {
						var r = e.key, i = e.changes, o = s[n];
						if (o) {
							for (var u = 0, d = Object.keys(i); u < d.length; u++) {
								var f = d[u], p = i[f];
								if (f === t.schema.primKey.keyPath) {
									if (K(p, r) !== 0) throw new O.Constraint("Cannot update primary key in bulkUpdate()");
								} else x(o, f, p);
							}
							a.push(n), c.push(r), l.push(o);
						}
					}), c.length);
					return n.mutate({
						trans: o,
						type: "put",
						keys: c,
						values: l,
						updates: {
							keys: r,
							changeSpecs: i
						}
					}).then(function(e) {
						var n = e.numFailures, r = e.failures;
						if (n === 0) return u;
						for (var i = 0, o = Object.keys(r); i < o.length; i++) {
							var s, c = o[i], l = a[Number(c)];
							l != null && (s = r[c], delete r[c], r[l] = s);
						}
						throw new me(`${t.name}.bulkUpdate(): ${n} of ${u} operations failed`, r);
					});
				});
			});
		}, q.prototype.bulkDelete = function(e) {
			var t = this, n = e.length;
			return this._trans("readwrite", function(n) {
				return t.core.mutate({
					trans: n,
					type: "delete",
					keys: e
				}).then(function(n) {
					return _t(t, e, n);
				});
			}).then(function(e) {
				var r = e.numFailures, i = e.failures;
				if (r === 0) return e.lastResult;
				throw new me(`${t.name}.bulkDelete(): ${r} of ${n} operations failed`, i);
			});
		};
		var xt = q;
		function q() {}
		function St(e) {
			function t(t, r) {
				if (r) {
					for (var i = arguments.length, a = Array(i - 1); --i;) a[i - 1] = arguments[i];
					return n[t].subscribe.apply(null, a), e;
				}
				if (typeof t == "string") return n[t];
			}
			var n = {};
			t.addEventType = s;
			for (var r = 1, o = arguments.length; r < o; ++r) s(arguments[r]);
			return t;
			function s(e, r, o) {
				var c, l;
				if (typeof e != "object") return r ||= we, l = {
					subscribers: [],
					fire: o ||= k,
					subscribe: function(e) {
						l.subscribers.indexOf(e) === -1 && (l.subscribers.push(e), l.fire = r(l.fire, e));
					},
					unsubscribe: function(e) {
						l.subscribers = l.subscribers.filter(function(t) {
							return t !== e;
						}), l.fire = l.subscribers.reduce(r, o);
					}
				}, n[e] = t[e] = l;
				i(c = e).forEach(function(e) {
					var t = c[e];
					if (a(t)) s(e, c[e][0], c[e][1]);
					else {
						if (t !== "asap") throw new O.InvalidArgument("Invalid event config");
						var n = s(e, ve, function() {
							for (var e = arguments.length, t = Array(e); e--;) t[e] = arguments[e];
							n.subscribers.forEach(function(e) {
								y(function() {
									e.apply(null, t);
								});
							});
						});
					}
				});
			}
		}
		function Ct(e, t) {
			return p(t).from({ prototype: e }), t;
		}
		function wt(e, t) {
			return !(e.filter || e.algorithm || e.or) && (t ? e.justLimit : !e.replayFilter);
		}
		function Tt(e, t) {
			e.filter = dt(e.filter, t);
		}
		function Et(e, t, n) {
			var r = e.replayFilter;
			e.replayFilter = r ? function() {
				return dt(r(), t());
			} : t, e.justLimit = n && !r;
		}
		function Dt(e, t) {
			if (e.isPrimKey) return t.primaryKey;
			var n = t.getIndexByKeyPath(e.index);
			if (n) return n;
			throw new O.Schema("KeyPath " + e.index + " on object store " + t.name + " is not indexed");
		}
		function Ot(e, t, n) {
			var r = Dt(e, t.schema);
			return t.openCursor({
				trans: n,
				values: !e.keysOnly,
				reverse: e.dir === "prev",
				unique: !!e.unique,
				query: {
					index: r,
					range: e.range
				}
			});
		}
		function kt(e, t, n, r) {
			var i, a, o = e.replayFilter ? dt(e.filter, e.replayFilter()) : e.filter;
			return e.or ? (i = {}, a = function(e, n, r) {
				var a, s;
				o && !o(n, r, function(e) {
					return n.stop(e);
				}, function(e) {
					return n.fail(e);
				}) || ((s = "" + (a = n.primaryKey)) == "[object ArrayBuffer]" && (s = "" + new Uint8Array(a)), l(i, s)) || (i[s] = !0, t(e, n, r));
			}, Promise.all([e.or._iterate(a, n), At(Ot(e, r, n), e.algorithm, a, !e.keysOnly && e.valueMapper)])) : At(Ot(e, r, n), dt(e.algorithm, o), t, !e.keysOnly && e.valueMapper);
		}
		function At(e, t, n, r) {
			var i = z(r ? function(e, t, i) {
				return n(r(e), t, i);
			} : n);
			return e.then(function(e) {
				if (e) return e.start(function() {
					var n = function() {
						return e.continue();
					};
					t && !t(e, function(e) {
						return n = e;
					}, function(t) {
						e.stop(t), n = k;
					}, function(t) {
						e.fail(t), n = k;
					}) || i(e.value, e, function(e) {
						return n = e;
					}), n();
				});
			});
		}
		J.prototype._read = function(e, t) {
			var n = this._ctx;
			return n.error ? n.table._trans(null, G.bind(null, n.error)) : n.table._trans("readonly", e).then(t);
		}, J.prototype._write = function(e) {
			var t = this._ctx;
			return t.error ? t.table._trans(null, G.bind(null, t.error)) : t.table._trans("readwrite", e, "locked");
		}, J.prototype._addAlgorithm = function(e) {
			var t = this._ctx;
			t.algorithm = dt(t.algorithm, e);
		}, J.prototype._iterate = function(e, t) {
			return kt(this._ctx, e, t, this._ctx.table.core);
		}, J.prototype.clone = function(e) {
			var t = Object.create(this.constructor.prototype), n = Object.create(this._ctx);
			return e && o(n, e), t._ctx = n, t;
		}, J.prototype.raw = function() {
			return this._ctx.valueMapper = null, this;
		}, J.prototype.each = function(e) {
			var t = this._ctx;
			return this._read(function(n) {
				return kt(t, e, n, t.table.core);
			});
		}, J.prototype.count = function(e) {
			var t = this;
			return this._read(function(e) {
				var n, r = t._ctx, i = r.table.core;
				return wt(r, !0) ? i.count({
					trans: e,
					query: {
						index: Dt(r, i.schema),
						range: r.range
					}
				}).then(function(e) {
					return Math.min(e, r.limit);
				}) : (n = 0, kt(r, function() {
					return ++n, !1;
				}, e, i).then(function() {
					return n;
				}));
			}).then(e);
		}, J.prototype.sortBy = function(e, t) {
			var n = e.split(".").reverse(), r = n[0], i = n.length - 1;
			function a(e, t) {
				return t ? a(e[n[t]], t - 1) : e[r];
			}
			var o = this._ctx.dir === "next" ? 1 : -1;
			function s(e, t) {
				return K(a(e, i), a(t, i)) * o;
			}
			return this.toArray(function(e) {
				return e.slice().sort(s);
			}).then(t);
		}, J.prototype.toArray = function(e) {
			var t = this;
			return this._read(function(e) {
				var n, r, i, a = t._ctx;
				return wt(a, !0) && 0 < a.limit ? (n = a.valueMapper, r = Dt(a, a.table.core.schema), a.table.core.query({
					trans: e,
					limit: a.limit,
					values: !0,
					direction: a.dir === "prev" ? "prev" : void 0,
					query: {
						index: r,
						range: a.range
					}
				}).then(function(e) {
					return e = e.result, n ? e.map(n) : e;
				})) : (i = [], kt(a, function(e) {
					return i.push(e);
				}, e, a.table.core).then(function() {
					return i;
				}));
			}, e);
		}, J.prototype.offset = function(e) {
			var t = this._ctx;
			return e <= 0 || (t.offset += e, wt(t) ? Et(t, function() {
				var t = e;
				return function(e, n) {
					return t === 0 || (t === 1 ? --t : n(function() {
						e.advance(t), t = 0;
					}), !1);
				};
			}) : Et(t, function() {
				var t = e;
				return function() {
					return --t < 0;
				};
			})), this;
		}, J.prototype.limit = function(e) {
			return this._ctx.limit = Math.min(this._ctx.limit, e), Et(this._ctx, function() {
				var t = e;
				return function(e, n, r) {
					return --t <= 0 && n(r), 0 <= t;
				};
			}, !0), this;
		}, J.prototype.until = function(e, t) {
			return Tt(this._ctx, function(n, r, i) {
				return !e(n.value) || (r(i), t);
			}), this;
		}, J.prototype.first = function(e) {
			return this.limit(1).toArray(function(e) {
				return e[0];
			}).then(e);
		}, J.prototype.last = function(e) {
			return this.reverse().first(e);
		}, J.prototype.filter = function(e) {
			var t;
			return Tt(this._ctx, function(t) {
				return e(t.value);
			}), (t = this._ctx).isMatch = dt(t.isMatch, e), this;
		}, J.prototype.and = function(e) {
			return this.filter(e);
		}, J.prototype.or = function(e) {
			return new this.db.WhereClause(this._ctx.table, e, this);
		}, J.prototype.reverse = function() {
			return this._ctx.dir = this._ctx.dir === "prev" ? "next" : "prev", this._ondirectionchange && this._ondirectionchange(this._ctx.dir), this;
		}, J.prototype.desc = function() {
			return this.reverse();
		}, J.prototype.eachKey = function(e) {
			var t = this._ctx;
			return t.keysOnly = !t.isMatch, this.each(function(t, n) {
				e(n.key, n);
			});
		}, J.prototype.eachUniqueKey = function(e) {
			return this._ctx.unique = "unique", this.eachKey(e);
		}, J.prototype.eachPrimaryKey = function(e) {
			var t = this._ctx;
			return t.keysOnly = !t.isMatch, this.each(function(t, n) {
				e(n.primaryKey, n);
			});
		}, J.prototype.keys = function(e) {
			var t = this._ctx, n = (t.keysOnly = !t.isMatch, []);
			return this.each(function(e, t) {
				n.push(t.key);
			}).then(function() {
				return n;
			}).then(e);
		}, J.prototype.primaryKeys = function(e) {
			var t = this._ctx;
			if (wt(t, !0) && 0 < t.limit) return this._read(function(e) {
				var n = Dt(t, t.table.core.schema);
				return t.table.core.query({
					trans: e,
					values: !1,
					limit: t.limit,
					direction: t.dir === "prev" ? "prev" : void 0,
					query: {
						index: n,
						range: t.range
					}
				});
			}).then(function(e) {
				return e.result;
			}).then(e);
			t.keysOnly = !t.isMatch;
			var n = [];
			return this.each(function(e, t) {
				n.push(t.primaryKey);
			}).then(function() {
				return n;
			}).then(e);
		}, J.prototype.uniqueKeys = function(e) {
			return this._ctx.unique = "unique", this.keys(e);
		}, J.prototype.firstKey = function(e) {
			return this.limit(1).keys(function(e) {
				return e[0];
			}).then(e);
		}, J.prototype.lastKey = function(e) {
			return this.reverse().firstKey(e);
		}, J.prototype.distinct = function() {
			var e, t = this._ctx, t = t.index && t.table.schema.idxByName[t.index];
			return t && t.multi && (e = {}, Tt(this._ctx, function(t) {
				var t = t.primaryKey.toString(), n = l(e, t);
				return e[t] = !0, !n;
			})), this;
		}, J.prototype.modify = function(e) {
			var t = this, n = this._ctx;
			return this._write(function(r) {
				function a(e, t) {
					var n = t.failures;
					p += e - t.numFailures;
					for (var r = 0, a = i(n); r < a.length; r++) {
						var o = a[r];
						f.push(n[o]);
					}
				}
				var o = typeof e == "function" ? e : function(t) {
					return bt(t, e);
				}, s = n.table.core, c = s.schema.primaryKey, l = c.outbound, u = c.extractKey, d = 200, c = t.db._options.modifyChunkSize, f = (c && (d = typeof c == "object" ? c[s.name] || c["*"] || 200 : c), []), p = 0, m = [], h = e === Mt;
				return t.clone().primaryKeys().then(function(t) {
					function i(f) {
						var p = Math.min(d, t.length - f), m = t.slice(f, f + p);
						return (h ? Promise.resolve([]) : s.getMany({
							trans: r,
							keys: m,
							cache: "immutable"
						})).then(function(g) {
							var _ = [], v = [], y = l ? [] : null, b = h ? m : [];
							if (!h) for (var x = 0; x < p; ++x) {
								var S = g[x], C = {
									value: ie(S),
									primKey: t[f + x]
								};
								!1 !== o.call(C, C.value, C) && (C.value == null ? b.push(t[f + x]) : l || K(u(S), u(C.value)) === 0 ? (v.push(C.value), l && y.push(t[f + x])) : (b.push(t[f + x]), _.push(C.value)));
							}
							return Promise.resolve(0 < _.length && s.mutate({
								trans: r,
								type: "add",
								values: _
							}).then(function(e) {
								for (var t in e.failures) b.splice(parseInt(t), 1);
								a(_.length, e);
							})).then(function() {
								return (0 < v.length || c && typeof e == "object") && s.mutate({
									trans: r,
									type: "put",
									keys: y,
									values: v,
									criteria: c,
									changeSpec: typeof e != "function" && e,
									isAdditionalChunk: 0 < f
								}).then(function(e) {
									return a(v.length, e);
								});
							}).then(function() {
								return (0 < b.length || c && h) && s.mutate({
									trans: r,
									type: "delete",
									keys: b,
									criteria: c,
									isAdditionalChunk: 0 < f
								}).then(function(e) {
									return _t(n.table, b, e);
								}).then(function(e) {
									return a(b.length, e);
								});
							}).then(function() {
								return t.length > f + p && i(f + d);
							});
						});
					}
					var c = wt(n) && n.limit === 1 / 0 && (typeof e != "function" || h) && {
						index: n.index,
						range: n.range
					};
					return i(0).then(function() {
						if (0 < f.length) throw new D("Error modifying one or more objects", f, p, m);
						return t.length;
					});
				});
			});
		}, J.prototype.delete = function() {
			var e = this._ctx, t = e.range;
			return !wt(e) || e.table.schema.yProps || !e.isPrimKey && t.type !== 3 ? this.modify(Mt) : this._write(function(n) {
				var r = e.table.core.schema.primaryKey, i = t;
				return e.table.core.count({
					trans: n,
					query: {
						index: r,
						range: i
					}
				}).then(function(t) {
					return e.table.core.mutate({
						trans: n,
						type: "deleteRange",
						range: i
					}).then(function(e) {
						var n = e.failures, e = e.numFailures;
						if (e) throw new D("Could not delete some values", Object.keys(n).map(function(e) {
							return n[e];
						}), t - e);
						return t - e;
					});
				});
			});
		};
		var jt = J;
		function J() {}
		var Mt = function(e, t) {
			return t.value = null;
		};
		function Nt(e, t) {
			return e < t ? -1 : e === t ? 0 : 1;
		}
		function Pt(e, t) {
			return t < e ? -1 : e === t ? 0 : 1;
		}
		function Y(e, t, n) {
			return e = e instanceof zt ? new e.Collection(e) : e, e._ctx.error = new (n || TypeError)(t), e;
		}
		function Ft(e) {
			return new e.Collection(e, function() {
				return Rt("");
			}).limit(0);
		}
		function It(e, t, n, r) {
			var i, a, o, s, c, l, u, d = n.length;
			if (!n.every(function(e) {
				return typeof e == "string";
			})) return Y(e, st);
			function f(e) {
				i = e === "next" ? function(e) {
					return e.toUpperCase();
				} : function(e) {
					return e.toLowerCase();
				}, a = e === "next" ? function(e) {
					return e.toLowerCase();
				} : function(e) {
					return e.toUpperCase();
				}, o = e === "next" ? Nt : Pt;
				var t = n.map(function(e) {
					return {
						lower: a(e),
						upper: i(e)
					};
				}).sort(function(e, t) {
					return o(e.lower, t.lower);
				});
				s = t.map(function(e) {
					return e.upper;
				}), c = t.map(function(e) {
					return e.lower;
				}), u = (l = e) === "next" ? "" : r;
			}
			f("next");
			var e = new e.Collection(e, function() {
				return Lt(s[0], c[d - 1] + r);
			}), p = (e._ondirectionchange = function(e) {
				f(e);
			}, 0);
			return e._addAlgorithm(function(e, n, r) {
				var i = e.key;
				if (typeof i == "string") {
					var f = a(i);
					if (t(f, c, p)) return !0;
					for (var m = null, h = p; h < d; ++h) {
						var g = ((e, t, n, r, i, a) => {
							for (var o = Math.min(e.length, r.length), s = -1, c = 0; c < o; ++c) {
								var l = t[c];
								if (l !== r[c]) return i(e[c], n[c]) < 0 ? e.substr(0, c) + n[c] + n.substr(c + 1) : i(e[c], r[c]) < 0 ? e.substr(0, c) + r[c] + n.substr(c + 1) : 0 <= s ? e.substr(0, s) + t[s] + n.substr(s + 1) : null;
								i(e[c], l) < 0 && (s = c);
							}
							return o < r.length && a === "next" ? e + n.substr(e.length) : o < e.length && a === "prev" ? e.substr(0, n.length) : s < 0 ? null : e.substr(0, s) + r[s] + n.substr(s + 1);
						})(i, f, s[h], c[h], o, l);
						g === null && m === null ? p = h + 1 : (m === null || 0 < o(m, g)) && (m = g);
					}
					n(m === null ? r : function() {
						e.continue(m + u);
					});
				}
				return !1;
			}), e;
		}
		function Lt(e, t, n, r) {
			return {
				type: 2,
				lower: e,
				upper: t,
				lowerOpen: n,
				upperOpen: r
			};
		}
		function Rt(e) {
			return {
				type: 1,
				lower: e,
				upper: e
			};
		}
		Object.defineProperty(X.prototype, "Collection", {
			get: function() {
				return this._ctx.table.db.Collection;
			},
			enumerable: !1,
			configurable: !0
		}), X.prototype.between = function(e, t, n, r) {
			n = !1 !== n, r = !0 === r;
			try {
				return 0 < this._cmp(e, t) || this._cmp(e, t) === 0 && (n || r) && (!n || !r) ? Ft(this) : new this.Collection(this, function() {
					return Lt(e, t, !n, !r);
				});
			} catch {
				return Y(this, ot);
			}
		}, X.prototype.equals = function(e) {
			return e == null ? Y(this, ot) : new this.Collection(this, function() {
				return Rt(e);
			});
		}, X.prototype.above = function(e) {
			return e == null ? Y(this, ot) : new this.Collection(this, function() {
				return Lt(e, void 0, !0);
			});
		}, X.prototype.aboveOrEqual = function(e) {
			return e == null ? Y(this, ot) : new this.Collection(this, function() {
				return Lt(e, void 0, !1);
			});
		}, X.prototype.below = function(e) {
			return e == null ? Y(this, ot) : new this.Collection(this, function() {
				return Lt(void 0, e, !1, !0);
			});
		}, X.prototype.belowOrEqual = function(e) {
			return e == null ? Y(this, ot) : new this.Collection(this, function() {
				return Lt(void 0, e);
			});
		}, X.prototype.startsWith = function(e) {
			return typeof e == "string" ? this.between(e, e + at, !0, !0) : Y(this, st);
		}, X.prototype.startsWithIgnoreCase = function(e) {
			return e === "" ? this.startsWith(e) : It(this, function(e, t) {
				return e.indexOf(t[0]) === 0;
			}, [e], at);
		}, X.prototype.equalsIgnoreCase = function(e) {
			return It(this, function(e, t) {
				return e === t[0];
			}, [e], "");
		}, X.prototype.anyOfIgnoreCase = function() {
			var e = T.apply(le, arguments);
			return e.length === 0 ? Ft(this) : It(this, function(e, t) {
				return t.indexOf(e) !== -1;
			}, e, "");
		}, X.prototype.startsWithAnyOfIgnoreCase = function() {
			var e = T.apply(le, arguments);
			return e.length === 0 ? Ft(this) : It(this, function(e, t) {
				return t.some(function(t) {
					return e.indexOf(t) === 0;
				});
			}, e, at);
		}, X.prototype.anyOf = function() {
			var e, t, n = this, r = T.apply(le, arguments), i = this._cmp;
			try {
				r.sort(i);
			} catch {
				return Y(this, ot);
			}
			return r.length === 0 ? Ft(this) : ((e = new this.Collection(this, function() {
				return Lt(r[0], r[r.length - 1]);
			}))._ondirectionchange = function(e) {
				i = e === "next" ? n._ascending : n._descending, r.sort(i);
			}, t = 0, e._addAlgorithm(function(e, n, a) {
				for (var o = e.key; 0 < i(o, r[t]);) if (++t === r.length) return n(a), !1;
				return i(o, r[t]) === 0 || (n(function() {
					e.continue(r[t]);
				}), !1);
			}), e);
		}, X.prototype.notEqual = function(e) {
			return this.inAnyRange([[-1 / 0, e], [e, this.db._maxKey]], {
				includeLowers: !1,
				includeUppers: !1
			});
		}, X.prototype.noneOf = function() {
			var e = T.apply(le, arguments);
			if (e.length === 0) return new this.Collection(this);
			try {
				e.sort(this._ascending);
			} catch {
				return Y(this, ot);
			}
			var t = e.reduce(function(e, t) {
				return e ? e.concat([[e[e.length - 1][1], t]]) : [[-1 / 0, t]];
			}, null);
			return t.push([e[e.length - 1], this.db._maxKey]), this.inAnyRange(t, {
				includeLowers: !1,
				includeUppers: !1
			});
		}, X.prototype.inAnyRange = function(e, t) {
			var n = this, r = this._cmp, i = this._ascending, a = this._descending, o = this._min, s = this._max;
			if (e.length === 0) return Ft(this);
			if (!e.every(function(e) {
				return e[0] !== void 0 && e[1] !== void 0 && i(e[0], e[1]) <= 0;
			})) return Y(this, "First argument to inAnyRange() must be an Array of two-value Arrays [lower,upper] where upper must not be lower than lower", O.InvalidArgument);
			var c = !t || !1 !== t.includeLowers, l = t && !0 === t.includeUppers, u, d = i;
			function f(e, t) {
				return d(e[0], t[0]);
			}
			try {
				(u = e.reduce(function(e, t) {
					for (var n = 0, i = e.length; n < i; ++n) {
						var a = e[n];
						if (r(t[0], a[1]) < 0 && 0 < r(t[1], a[0])) {
							a[0] = o(a[0], t[0]), a[1] = s(a[1], t[1]);
							break;
						}
					}
					return n === i && e.push(t), e;
				}, [])).sort(f);
			} catch {
				return Y(this, ot);
			}
			var p = 0, m = l ? function(e) {
				return 0 < i(e, u[p][1]);
			} : function(e) {
				return 0 <= i(e, u[p][1]);
			}, h = c ? function(e) {
				return 0 < a(e, u[p][0]);
			} : function(e) {
				return 0 <= a(e, u[p][0]);
			}, g = m, t = new this.Collection(this, function() {
				return Lt(u[0][0], u[u.length - 1][1], !c, !l);
			});
			return t._ondirectionchange = function(e) {
				d = e === "next" ? (g = m, i) : (g = h, a), u.sort(f);
			}, t._addAlgorithm(function(e, t, r) {
				for (var a, o = e.key; g(o);) if (++p === u.length) return t(r), !1;
				return !m(a = o) && !h(a) || (n._cmp(o, u[p][1]) === 0 || n._cmp(o, u[p][0]) === 0 || t(function() {
					d === i ? e.continue(u[p][0]) : e.continue(u[p][1]);
				}), !1);
			}), t;
		}, X.prototype.startsWithAnyOf = function() {
			var e = T.apply(le, arguments);
			return e.every(function(e) {
				return typeof e == "string";
			}) ? e.length === 0 ? Ft(this) : this.inAnyRange(e.map(function(e) {
				return [e, e + at];
			})) : Y(this, "startsWithAnyOf() only works with strings");
		};
		var zt = X;
		function X() {}
		function Z(e) {
			return z(function(t) {
				return Bt(t), e(t.target.error), !1;
			});
		}
		function Bt(e) {
			e.stopPropagation && e.stopPropagation(), e.preventDefault && e.preventDefault();
		}
		var Vt = "storagemutated", Ht = "x-storagemutated-1", Ut = St(null, Vt), Wt = (Gt.prototype._lock = function() {
			return v(!N.global), ++this._reculock, this._reculock !== 1 || N.global || (N.lockOwnerFor = this), this;
		}, Gt.prototype._unlock = function() {
			if (v(!N.global), --this._reculock == 0) for (N.global || (N.lockOwnerFor = null); 0 < this._blockedFuncs.length && !this._locked();) {
				var e = this._blockedFuncs.shift();
				try {
					nt(e[1], e[0]);
				} catch {}
			}
			return this;
		}, Gt.prototype._locked = function() {
			return this._reculock && N.lockOwnerFor !== this;
		}, Gt.prototype.create = function(e) {
			var t = this;
			if (this.mode) {
				var n = this.db.idbdb, r = this.db._state.dbOpenError;
				if (v(!this.idbtrans), !e && !n) switch (r && r.name) {
					case "DatabaseClosedError": throw new O.DatabaseClosed(r);
					case "MissingAPIError": throw new O.MissingAPI(r.message, r);
					default: throw new O.OpenFailed(r);
				}
				if (!this.active) throw new O.TransactionInactive();
				v(this._completion._state === null), (e = this.idbtrans = e || (this.db.core || n).transaction(this.storeNames, this.mode, { durability: this.chromeTransactionDurability })).onerror = z(function(n) {
					Bt(n), t._reject(e.error);
				}), e.onabort = z(function(n) {
					Bt(n), t.active && t._reject(new O.Abort(e.error)), t.active = !1, t.on("abort").fire(n);
				}), e.oncomplete = z(function() {
					t.active = !1, t._resolve(), "mutatedParts" in e && Ut.storagemutated.fire(e.mutatedParts);
				});
			}
			return this;
		}, Gt.prototype._promise = function(e, t, n) {
			var r, i = this;
			return e === "readwrite" && this.mode !== "readwrite" ? G(new O.ReadOnly("Transaction is readonly")) : this.active ? this._locked() ? new I(function(r, a) {
				i._blockedFuncs.push([function() {
					i._promise(e, t, n).then(r, a);
				}, N]);
			}) : n ? V(function() {
				var e = new I(function(e, n) {
					i._lock();
					var r = t(e, n, i);
					r && r.then && r.then(e, n);
				});
				return e.finally(function() {
					return i._unlock();
				}), e._lib = !0, e;
			}) : ((r = new I(function(e, n) {
				var r = t(e, n, i);
				r && r.then && r.then(e, n);
			}))._lib = !0, r) : G(new O.TransactionInactive());
		}, Gt.prototype._root = function() {
			return this.parent ? this.parent._root() : this;
		}, Gt.prototype.waitFor = function(e) {
			var t, n = this._root(), r = I.resolve(e), i = (n._waitingFor ? n._waitingFor = n._waitingFor.then(function() {
				return r;
			}) : (n._waitingFor = r, n._waitingQueue = [], t = n.idbtrans.objectStore(n.storeNames[0]), function e() {
				for (++n._spinCount; n._waitingQueue.length;) n._waitingQueue.shift()();
				n._waitingFor && (t.get(-1 / 0).onsuccess = e);
			}()), n._waitingFor);
			return new I(function(e, t) {
				r.then(function(t) {
					return n._waitingQueue.push(z(e.bind(null, t)));
				}, function(e) {
					return n._waitingQueue.push(z(t.bind(null, e)));
				}).finally(function() {
					n._waitingFor === i && (n._waitingFor = null);
				});
			});
		}, Gt.prototype.abort = function() {
			this.active && (this.active = !1, this.idbtrans && this.idbtrans.abort(), this._reject(new O.Abort()));
		}, Gt.prototype.table = function(e) {
			var t = this._memoizedTables ||= {};
			if (l(t, e)) return t[e];
			var n = this.schema[e];
			if (n) return (n = new this.db.Table(e, n, this)).core = this.db.core.table(e), t[e] = n;
			throw new O.NotFound("Table " + e + " not part of transaction");
		}, Gt);
		function Gt() {}
		function Kt(e, t, n, r, i, a, o, s) {
			return {
				name: e,
				keyPath: t,
				unique: n,
				multi: r,
				auto: i,
				compound: a,
				src: (n && !o ? "&" : "") + (r ? "*" : "") + (i ? "++" : "") + qt(t),
				type: s
			};
		}
		function qt(e) {
			return typeof e == "string" ? e : e ? "[" + [].join.call(e, "+") + "]" : "";
		}
		function Jt(e, t, n) {
			return {
				name: e,
				primKey: t,
				indexes: n,
				mappedClass: null,
				idxByName: (r = function(e) {
					return [e.name, e];
				}, n.reduce(function(e, t, n) {
					return t = r(t, n), t && (e[t[0]] = t[1]), e;
				}, {}))
			};
			var r;
		}
		var Yt = function(e) {
			try {
				return e.only([[]]), Yt = function() {
					return [[]];
				}, [[]];
			} catch {
				return Yt = function() {
					return at;
				}, at;
			}
		};
		function Xt(e) {
			return e == null ? function() {} : typeof e == "string" ? (t = e).split(".").length === 1 ? function(e) {
				return e[t];
			} : function(e) {
				return b(e, t);
			} : function(t) {
				return b(t, e);
			};
			var t;
		}
		function Zt(e) {
			return [].slice.call(e);
		}
		var Qt = 0;
		function $t(e) {
			return e == null ? ":id" : typeof e == "string" ? e : `[${e.join("+")}]`;
		}
		function en(e, t, n) {
			function r(e) {
				if (e.type === 3) return null;
				if (e.type === 4) throw Error("Cannot convert never type to IDBKeyRange");
				var n = e.lower, r = e.upper, i = e.lowerOpen, e = e.upperOpen;
				return n === void 0 ? r === void 0 ? null : t.upperBound(r, !!e) : r === void 0 ? t.lowerBound(n, !!i) : t.bound(n, r, !!i, !!e);
			}
			function i(e) {
				var t, n, i = e.name;
				return {
					name: i,
					schema: e,
					mutate: function(e) {
						var t = e.trans, n = e.type, a = e.keys, o = e.values, s = e.range;
						return new Promise(function(e, c) {
							e = z(e);
							var l = t.objectStore(i), u = l.keyPath == null, d = n === "put" || n === "add";
							if (!d && n !== "delete" && n !== "deleteRange") throw Error("Invalid operation type: " + n);
							var f, p = (a || o || { length: 1 }).length;
							if (a && o && a.length !== o.length) throw Error("Given keys array must have same length as given values array.");
							if (p === 0) return e({
								numFailures: 0,
								failures: {},
								results: [],
								lastResult: void 0
							});
							function m(e) {
								++_, Bt(e);
							}
							var h = [], g = [], _ = 0;
							if (n === "deleteRange") {
								if (s.type === 4) return e({
									numFailures: _,
									failures: g,
									results: [],
									lastResult: void 0
								});
								s.type === 3 ? h.push(f = l.clear()) : h.push(f = l.delete(r(s)));
							} else {
								var u = d ? u ? [o, a] : [o, null] : [a, null], v = u[0], y = u[1];
								if (d) for (var b = 0; b < p; ++b) h.push(f = y && y[b] !== void 0 ? l[n](v[b], y[b]) : l[n](v[b])), f.onerror = m;
								else for (b = 0; b < p; ++b) h.push(f = l[n](v[b])), f.onerror = m;
							}
							function x(t) {
								t = t.target.result, h.forEach(function(e, t) {
									return e.error != null && (g[t] = e.error);
								}), e({
									numFailures: _,
									failures: g,
									results: n === "delete" ? a : h.map(function(e) {
										return e.result;
									}),
									lastResult: t
								});
							}
							f.onerror = function(e) {
								m(e), x(e);
							}, f.onsuccess = x;
						});
					},
					getMany: function(e) {
						var t = e.trans, n = e.keys;
						return new Promise(function(e, r) {
							e = z(e);
							for (var a, o = t.objectStore(i), s = n.length, c = Array(s), l = 0, u = 0, d = function(t) {
								t = t.target, c[t._pos] = t.result, ++u === l && e(c);
							}, f = Z(r), p = 0; p < s; ++p) n[p] != null && ((a = o.get(n[p]))._pos = p, a.onsuccess = d, a.onerror = f, ++l);
							l === 0 && e(c);
						});
					},
					get: function(e) {
						var t = e.trans, n = e.key;
						return new Promise(function(e, r) {
							e = z(e);
							var a = t.objectStore(i).get(n);
							a.onsuccess = function(t) {
								return e(t.target.result);
							}, a.onerror = Z(r);
						});
					},
					query: (t = c, n = l, function(e) {
						return new Promise(function(a, o) {
							a = z(a);
							var s, c, l, u, d = e.trans, f = e.values, p = e.limit, m = e.query, h = (h = e.direction) ?? "next", g = p === 1 / 0 ? void 0 : p, _ = m.index, m = m.range, d = d.objectStore(i), d = _.isPrimaryKey ? d : d.index(_.name), _ = r(m);
							if (p === 0) return a({ result: [] });
							n ? (m = {
								query: _,
								count: g,
								direction: h
							}, (s = f ? d.getAll(m) : d.getAllKeys(m)).onsuccess = function(e) {
								return a({ result: e.target.result });
							}, s.onerror = Z(o)) : t && h === "next" ? ((s = f ? d.getAll(_, g) : d.getAllKeys(_, g)).onsuccess = function(e) {
								return a({ result: e.target.result });
							}, s.onerror = Z(o)) : (c = 0, l = !f && "openKeyCursor" in d ? d.openKeyCursor(_, h) : d.openCursor(_, h), u = [], l.onsuccess = function() {
								var e = l.result;
								return !e || (u.push(f ? e.value : e.primaryKey), ++c === p) ? a({ result: u }) : void e.continue();
							}, l.onerror = Z(o));
						});
					}),
					openCursor: function(e) {
						var t = e.trans, n = e.values, a = e.query, o = e.reverse, s = e.unique;
						return new Promise(function(e, c) {
							e = z(e);
							var l = a.index, u = a.range, d = t.objectStore(i), d = l.isPrimaryKey ? d : d.index(l.name), l = o ? s ? "prevunique" : "prev" : s ? "nextunique" : "next", f = !n && "openKeyCursor" in d ? d.openKeyCursor(r(u), l) : d.openCursor(r(u), l);
							f.onerror = Z(c), f.onsuccess = z(function(n) {
								var r, i, a, o, s = f.result;
								s ? (s.___id = ++Qt, s.done = !1, r = s.continue.bind(s), i = (i = s.continuePrimaryKey) && i.bind(s), a = s.advance.bind(s), o = function() {
									throw Error("Cursor not stopped");
								}, s.trans = t, s.stop = s.continue = s.continuePrimaryKey = s.advance = function() {
									throw Error("Cursor not started");
								}, s.fail = z(c), s.next = function() {
									var e = this, t = 1;
									return this.start(function() {
										return t-- ? e.continue() : e.stop();
									}).then(function() {
										return e;
									});
								}, s.start = function(e) {
									function t() {
										if (f.result) try {
											e();
										} catch (e) {
											s.fail(e);
										}
										else s.done = !0, s.start = function() {
											throw Error("Cursor behind last entry");
										}, s.stop();
									}
									var n = new Promise(function(e, t) {
										e = z(e), f.onerror = Z(t), s.fail = t, s.stop = function(t) {
											s.stop = s.continue = s.continuePrimaryKey = s.advance = o, e(t);
										};
									});
									return f.onsuccess = z(function(e) {
										f.onsuccess = t, t();
									}), s.continue = r, s.continuePrimaryKey = i, s.advance = a, t(), n;
								}, e(s)) : e(null);
							}, c);
						});
					},
					count: function(e) {
						var t = e.query, n = e.trans, a = t.index, o = t.range;
						return new Promise(function(e, t) {
							var s = n.objectStore(i), s = a.isPrimaryKey ? s : s.index(a.name), c = r(o), c = c ? s.count(c) : s.count();
							c.onsuccess = z(function(t) {
								return e(t.target.result);
							}), c.onerror = Z(t);
						});
					}
				};
			}
			o = n, s = Zt((n = e).objectStoreNames), u = 0 < s.length ? o.objectStore(s[0]) : {};
			var o, n = {
				schema: {
					name: n.name,
					tables: s.map(function(e) {
						return o.objectStore(e);
					}).map(function(e) {
						var t = e.keyPath, n = e.autoIncrement, r = a(t), i = {}, r = {
							name: e.name,
							primaryKey: {
								name: null,
								isPrimaryKey: !0,
								outbound: t == null,
								compound: r,
								keyPath: t,
								autoIncrement: n,
								unique: !0,
								extractKey: Xt(t)
							},
							indexes: Zt(e.indexNames).map(function(t) {
								return e.index(t);
							}).map(function(e) {
								var t = e.name, n = e.unique, r = e.multiEntry, e = e.keyPath, t = {
									name: t,
									compound: a(e),
									keyPath: e,
									unique: n,
									multiEntry: r,
									extractKey: Xt(e)
								};
								return i[$t(e)] = t;
							}),
							getIndexByKeyPath: function(e) {
								return i[$t(e)];
							}
						};
						return i[":id"] = r.primaryKey, t != null && (i[$t(t)] = r.primaryKey), r;
					})
				},
				hasGetAll: 0 < s.length && "getAll" in u && !(typeof navigator < "u" && /Safari/.test(navigator.userAgent) && !/(Chrome\/|Edge\/)/.test(navigator.userAgent) && [].concat(navigator.userAgent.match(/Safari\/(\d*)/))[1] < 604),
				hasIdb3Features: "getAllRecords" in u
			}, s = n.schema, c = n.hasGetAll, l = n.hasIdb3Features, u = s.tables.map(i), d = {};
			return u.forEach(function(e) {
				return d[e.name] = e;
			}), {
				stack: "dbcore",
				transaction: e.transaction.bind(e),
				table: function(e) {
					if (d[e]) return d[e];
					throw Error(`Table '${e}' not found`);
				},
				MIN_KEY: -1 / 0,
				MAX_KEY: Yt(t),
				schema: s
			};
		}
		function tn(e, n, r, i) {
			return r = r.IDBKeyRange, n = en(n, r, i), { dbcore: e.dbcore.reduce(function(e, n) {
				return n = n.create, t(t({}, e), n(e));
			}, n) };
		}
		function nn(e, t) {
			var n = t.db, n = tn(e._middlewares, n, e._deps, t);
			e.core = n.dbcore, e.tables.forEach(function(t) {
				var n = t.name;
				e.core.schema.tables.some(function(e) {
					return e.name === n;
				}) && (t.core = e.core.table(n), e[n] instanceof e.Table) && (e[n].core = t.core);
			});
		}
		function rn(e, t, n, r) {
			n.forEach(function(n) {
				var i = r[n];
				t.forEach(function(t) {
					var r = function e(t, n) {
						return m(t, n) || (t = s(t)) && e(t, n);
					}(t, n);
					(!r || "value" in r && r.value === void 0) && (t === e.Transaction.prototype || t instanceof e.Transaction ? f(t, n, {
						get: function() {
							return this.table(n);
						},
						set: function(e) {
							d(this, n, {
								value: e,
								writable: !0,
								configurable: !0,
								enumerable: !0
							});
						}
					}) : t[n] = new e.Table(n, i));
				});
			});
		}
		function an(e, t) {
			t.forEach(function(t) {
				for (var n in t) t[n] instanceof e.Table && delete t[n];
			});
		}
		function on(e, t) {
			return e._cfg.version - t._cfg.version;
		}
		function sn(e, t, n, r) {
			var a = e._dbSchema, o = (n.objectStoreNames.contains("$meta") && !a.$meta && (a.$meta = Jt("$meta", hn("")[0], []), e._storeNames.push("$meta")), e._createTransaction("readwrite", e._storeNames, a)), s = (o.create(n), o._completion.catch(r), o._reject.bind(o)), c = N.transless || N;
			V(function() {
				if (N.trans = o, N.transless = c, t !== 0) return nn(e, n), l = t, ((r = o).storeNames.includes("$meta") ? r.table("$meta").get("version").then(function(e) {
					return e ?? l;
				}) : I.resolve(l)).then(function(t) {
					var r = e, a = t, s = o, c = n, l = [], t = r._versions, u = r._dbSchema = pn(0, r.idbdb, c);
					return (t = t.filter(function(e) {
						return e._cfg.version >= a;
					})).length === 0 ? I.resolve() : (t.forEach(function(e) {
						l.push(function() {
							var t, n, o, l = u, d = e._cfg.dbschema, f = (mn(r, l, c), mn(r, d, c), u = r._dbSchema = d, ln(l, d)), p = (f.add.forEach(function(e) {
								un(c, e[0], e[1].primKey, e[1].indexes);
							}), f.change.forEach(function(e) {
								if (e.recreate) throw new O.Upgrade("Not yet support for changing primary key");
								var t = c.objectStore(e.name);
								e.add.forEach(function(e) {
									return fn(t, e);
								}), e.change.forEach(function(e) {
									t.deleteIndex(e.name), fn(t, e);
								}), e.del.forEach(function(e) {
									return t.deleteIndex(e);
								});
							}), e._cfg.contentUpgrade);
							if (p && e._cfg.version > a) return nn(r, c), s._memoizedTables = {}, t = S(d), f.del.forEach(function(e) {
								t[e] = l[e];
							}), an(r, [r.Transaction.prototype]), rn(r, [r.Transaction.prototype], i(t), t), s.schema = t, (n = ue(p)) && $e(), d = I.follow(function() {
								var e;
								(o = p(s)) && n && (e = H.bind(null, null), o.then(e, e));
							}), o && typeof o.then == "function" ? I.resolve(o) : d.then(function() {
								return o;
							});
						}), l.push(function(t) {
							var n = e._cfg.dbschema, i = t;
							[].slice.call(i.db.objectStoreNames).forEach(function(e) {
								return n[e] == null && i.db.deleteObjectStore(e);
							}), an(r, [r.Transaction.prototype]), rn(r, [r.Transaction.prototype], r._storeNames, r._dbSchema), s.schema = r._dbSchema;
						}), l.push(function(t) {
							r.idbdb.objectStoreNames.contains("$meta") && (Math.ceil(r.idbdb.version / 10) === e._cfg.version ? (r.idbdb.deleteObjectStore("$meta"), delete r._dbSchema.$meta, r._storeNames = r._storeNames.filter(function(e) {
								return e !== "$meta";
							})) : t.objectStore("$meta").put(e._cfg.version, "version"));
						});
					}), function e() {
						return l.length ? I.resolve(l.shift()(s.idbtrans)).then(e) : I.resolve();
					}().then(function() {
						dn(u, c);
					}));
				}).catch(s);
				var r, l;
				i(a).forEach(function(e) {
					un(n, e, a[e].primKey, a[e].indexes);
				}), nn(e, n), I.follow(function() {
					return e.on.populate.fire(o);
				}).catch(s);
			});
		}
		function cn(e, t) {
			dn(e._dbSchema, t), t.db.version % 10 != 0 || t.objectStoreNames.contains("$meta") || t.db.createObjectStore("$meta").add(Math.ceil(t.db.version / 10 - 1), "version");
			var n = pn(0, e.idbdb, t);
			mn(e, e._dbSchema, t);
			for (var r = 0, i = ln(n, e._dbSchema).change; r < i.length; r++) {
				var a = ((e) => {
					if (e.change.length || e.recreate) return console.warn(`Unable to patch indexes of table ${e.name} because it has changes on the type of index or primary key.`), { value: void 0 };
					var n = t.objectStore(e.name);
					e.add.forEach(function(t) {
						A && console.debug(`Dexie upgrade patch: Creating missing index ${e.name}.${t.src}`), fn(n, t);
					});
				})(i[r]);
				if (typeof a == "object") return a.value;
			}
		}
		function ln(e, t) {
			var n, r = {
				del: [],
				add: [],
				change: []
			};
			for (n in e) t[n] || r.del.push(n);
			for (n in t) {
				var i = e[n], a = t[n];
				if (i) {
					var o = {
						name: n,
						def: a,
						recreate: !1,
						del: [],
						add: [],
						change: []
					};
					if ("" + (i.primKey.keyPath || "") != "" + (a.primKey.keyPath || "") || i.primKey.auto !== a.primKey.auto) o.recreate = !0, r.change.push(o);
					else {
						var s = i.idxByName, c = a.idxByName, l = void 0;
						for (l in s) c[l] || o.del.push(l);
						for (l in c) {
							var u = s[l], d = c[l];
							u ? u.src !== d.src && o.change.push(d) : o.add.push(d);
						}
						(0 < o.del.length || 0 < o.add.length || 0 < o.change.length) && r.change.push(o);
					}
				} else r.add.push([n, a]);
			}
			return r;
		}
		function un(e, t, n, r) {
			var i = e.db.createObjectStore(t, n.keyPath ? {
				keyPath: n.keyPath,
				autoIncrement: n.auto
			} : { autoIncrement: n.auto });
			r.forEach(function(e) {
				return fn(i, e);
			});
		}
		function dn(e, t) {
			i(e).forEach(function(n) {
				t.db.objectStoreNames.contains(n) || (A && console.debug("Dexie: Creating missing table", n), un(t, n, e[n].primKey, e[n].indexes));
			});
		}
		function fn(e, t) {
			e.createIndex(t.name, t.keyPath, {
				unique: t.unique,
				multiEntry: t.multi
			});
		}
		function pn(e, t, n) {
			var r = {};
			return g(t.objectStoreNames, 0).forEach(function(e) {
				for (var t = n.objectStore(e), i = Kt(qt(c = t.keyPath), c || "", !0, !1, !!t.autoIncrement, c && typeof c != "string", !0), a = [], o = 0; o < t.indexNames.length; ++o) {
					var s = t.index(t.indexNames[o]), c = s.keyPath, s = Kt(s.name, c, !!s.unique, !!s.multiEntry, !1, c && typeof c != "string", !1);
					a.push(s);
				}
				r[e] = Jt(e, i, a);
			}), r;
		}
		function mn(e, t, n) {
			for (var i = n.db.objectStoreNames, a = 0; a < i.length; ++a) {
				var o = i[a], s = n.objectStore(o);
				e._hasGetAll = "getAll" in s;
				for (var c = 0; c < s.indexNames.length; ++c) {
					var l, u = s.indexNames[c], d = s.index(u).keyPath, d = typeof d == "string" ? d : "[" + g(d).join("+") + "]";
					t[o] && (l = t[o].idxByName[d]) && (l.name = u, delete t[o].idxByName[d], t[o].idxByName[u] = l);
				}
			}
			typeof navigator < "u" && /Safari/.test(navigator.userAgent) && !/(Chrome\/|Edge\/)/.test(navigator.userAgent) && r.WorkerGlobalScope && r instanceof r.WorkerGlobalScope && [].concat(navigator.userAgent.match(/Safari\/(\d*)/))[1] < 604 && (e._hasGetAll = !1);
		}
		function hn(e) {
			return e.split(",").map(function(e, t) {
				var n = e.split(":"), r = (r = n[1])?.trim(), n = (e = n[0].trim()).replace(/([&*]|\+\+)/g, ""), i = /^\[/.test(n) ? n.match(/^\[(.*)\]$/)[1].split("+") : n;
				return Kt(n, i || null, /\&/.test(e), /\*/.test(e), /\+\+/.test(e), a(i), t === 0, r);
			});
		}
		_n.prototype._createTableSchema = Jt, _n.prototype._parseIndexSyntax = hn, _n.prototype._parseStoresSpec = function(e, t) {
			var n = this;
			i(e).forEach(function(r) {
				if (e[r] !== null) {
					var i = n._parseIndexSyntax(e[r]), a = i.shift();
					if (!a) throw new O.Schema("Invalid schema for table " + r + ": " + e[r]);
					if (a.unique = !0, a.multi) throw new O.Schema("Primary key cannot be multiEntry*");
					i.forEach(function(e) {
						if (e.auto) throw new O.Schema("Only primary key can be marked as autoIncrement (++)");
						if (!e.keyPath) throw new O.Schema("Index must have a name and cannot be an empty string");
					}), a = n._createTableSchema(r, a, i), t[r] = a;
				}
			});
		}, _n.prototype.stores = function(e) {
			var t = this.db, e = (this._cfg.storesSource = this._cfg.storesSource ? o(this._cfg.storesSource, e) : e, t._versions), n = {}, r = {};
			return e.forEach(function(e) {
				o(n, e._cfg.storesSource), r = e._cfg.dbschema = {}, e._parseStoresSpec(n, r);
			}), t._dbSchema = r, an(t, [
				t._allTables,
				t,
				t.Transaction.prototype
			]), rn(t, [
				t._allTables,
				t,
				t.Transaction.prototype,
				this._cfg.tables
			], i(r), r), t._storeNames = i(r), this;
		}, _n.prototype.upgrade = function(e) {
			return this._cfg.contentUpgrade = Te(this._cfg.contentUpgrade || k, e), this;
		};
		var gn = _n;
		function _n() {}
		var vn = (() => {
			var e, t, n;
			return typeof FinalizationRegistry < "u" && typeof WeakRef < "u" ? (e = /* @__PURE__ */ new Set(), t = new FinalizationRegistry(function(t) {
				e.delete(t);
			}), {
				toArray: function() {
					return Array.from(e).map(function(e) {
						return e.deref();
					}).filter(function(e) {
						return e !== void 0;
					});
				},
				add: function(n) {
					var r = new WeakRef(n._novip);
					e.add(r), t.register(n._novip, r, r), e.size > n._options.maxConnections && (r = e.values().next().value, e.delete(r), t.unregister(r));
				},
				remove: function(n) {
					if (n) for (var r = e.values(), i = r.next(); !i.done;) {
						var a = i.value;
						if (a.deref() === n._novip) return e.delete(a), void t.unregister(a);
						i = r.next();
					}
				}
			}) : (n = [], {
				toArray: function() {
					return n;
				},
				add: function(e) {
					n.push(e._novip);
				},
				remove: function(e) {
					e && (e = n.indexOf(e._novip)) !== -1 && n.splice(e, 1);
				}
			});
		})();
		function yn(e, t) {
			var n = e._dbNamesDB;
			return n || (n = e._dbNamesDB = new rr(ct, {
				addons: [],
				indexedDB: e,
				IDBKeyRange: t
			})).version(1).stores({ dbnames: "name" }), n.table("dbnames");
		}
		function bn(e) {
			return e && typeof e.databases == "function";
		}
		function xn(e) {
			return V(function() {
				return N.letThrough = !0, e();
			});
		}
		function Sn(e) {
			return !("from" in e);
		}
		var Q = function(e, t) {
			var n;
			if (!this) return n = new Q(), e && "d" in e && o(n, e), n;
			o(this, arguments.length ? {
				d: 1,
				from: e,
				to: 1 < arguments.length ? t : e
			} : { d: 0 });
		};
		function Cn(e, t, n) {
			var r = K(t, n);
			if (!isNaN(r)) {
				if (0 < r) throw RangeError();
				if (Sn(e)) return o(e, {
					from: t,
					to: n,
					d: 1
				});
				var r = e.l, i = e.r;
				if (K(n, e.from) < 0) return r ? Cn(r, t, n) : e.l = {
					from: t,
					to: n,
					d: 1,
					l: null,
					r: null
				}, Dn(e);
				if (0 < K(t, e.to)) return i ? Cn(i, t, n) : e.r = {
					from: t,
					to: n,
					d: 1,
					l: null,
					r: null
				}, Dn(e);
				K(t, e.from) < 0 && (e.from = t, e.l = null, e.d = i ? i.d + 1 : 1), 0 < K(n, e.to) && (e.to = n, e.r = null, e.d = e.l ? e.l.d + 1 : 1), t = !e.r, r && !e.l && wn(e, r), i && t && wn(e, i);
			}
		}
		function wn(e, t) {
			Sn(t) || function e(t, n) {
				var r = n.from, i = n.l, a = n.r;
				Cn(t, r, n.to), i && e(t, i), a && e(t, a);
			}(e, t);
		}
		function Tn(e, t) {
			var n = En(t), r = n.next();
			if (!r.done) for (var i = r.value, a = En(e), o = a.next(i.from), s = o.value; !r.done && !o.done;) {
				if (K(s.from, i.to) <= 0 && 0 <= K(s.to, i.from)) return !0;
				K(i.from, s.from) < 0 ? i = (r = n.next(s.from)).value : s = (o = a.next(i.from)).value;
			}
			return !1;
		}
		function En(e) {
			var t = Sn(e) ? null : {
				s: 0,
				n: e
			};
			return { next: function(e) {
				for (var n = 0 < arguments.length; t;) switch (t.s) {
					case 0: if (t.s = 1, n) for (; t.n.l && K(e, t.n.from) < 0;) t = {
						up: t,
						n: t.n.l,
						s: 1
					};
					else for (; t.n.l;) t = {
						up: t,
						n: t.n.l,
						s: 1
					};
					case 1: if (t.s = 2, !n || K(e, t.n.to) <= 0) return {
						value: t.n,
						done: !1
					};
					case 2: if (t.n.r) {
						t.s = 3, t = {
							up: t,
							n: t.n.r,
							s: 0
						};
						continue;
					}
					case 3: t = t.up;
				}
				return { done: !0 };
			} };
		}
		function Dn(e) {
			var n, r, i, a = ((a = e.r)?.d || 0) - ((a = e.l)?.d || 0), a = 1 < a ? "r" : a < -1 ? "l" : "";
			a && (n = a == "r" ? "l" : "r", r = t({}, e), i = e[a], e.from = i.from, e.to = i.to, e[a] = i[a], r[a] = i[n], (e[n] = r).d = On(r)), e.d = On(e);
		}
		function On(e) {
			var t = e.r, e = e.l;
			return (t ? e ? Math.max(t.d, e.d) : t.d : e ? e.d : 0) + 1;
		}
		function kn(e, t) {
			return i(t).forEach(function(n) {
				e[n] ? wn(e[n], t[n]) : e[n] = function e(t) {
					var n, r, i = {};
					for (n in t) l(t, n) && (r = t[n], i[n] = !r || typeof r != "object" || ne.has(r.constructor) ? r : e(r));
					return i;
				}(t[n]);
			}), e;
		}
		function An(e, t) {
			return e.all || t.all || Object.keys(e).some(function(n) {
				return t[n] && Tn(t[n], e[n]);
			});
		}
		u(Q.prototype, ((E = {
			add: function(e) {
				return wn(this, e), this;
			},
			addKey: function(e) {
				return Cn(this, e, e), this;
			},
			addKeys: function(e) {
				var t = this;
				return e.forEach(function(e) {
					return Cn(t, e, e);
				}), this;
			},
			hasKey: function(e) {
				var t = En(this).next(e).value;
				return t && K(t.from, e) <= 0 && 0 <= K(t.to, e);
			}
		})[oe] = function() {
			return En(this);
		}, E));
		var jn = {}, Mn = {}, Nn = !1;
		function Pn(e) {
			kn(Mn, e), Nn || (Nn = !0, setTimeout(function() {
				Nn = !1, Fn(Mn, !(Mn = {}));
			}, 0));
		}
		function Fn(e, t) {
			t === void 0 && (t = !1);
			var n = /* @__PURE__ */ new Set();
			if (e.all) for (var r = 0, i = Object.values(jn); r < i.length; r++) In(s = i[r], e, n, t);
			else for (var a in e) {
				var o, s, a = /^idb\:\/\/(.*)\/(.*)\//.exec(a);
				a && (o = a[1], a = a[2], s = jn[`idb://${o}/${a}`]) && In(s, e, n, t);
			}
			n.forEach(function(e) {
				return e();
			});
		}
		function In(e, t, n, r) {
			for (var i = [], a = 0, o = Object.entries(e.queries.query); a < o.length; a++) {
				for (var s = o[a], c = s[0], l = [], u = 0, d = s[1]; u < d.length; u++) {
					var f = d[u];
					An(t, f.obsSet) ? f.subscribers.forEach(function(e) {
						return n.add(e);
					}) : r && l.push(f);
				}
				r && i.push([c, l]);
			}
			if (r) for (var p = 0, m = i; p < m.length; p++) {
				var h = m[p], c = h[0], l = h[1];
				e.queries.query[c] = l;
			}
		}
		function Ln(e) {
			var t = e._state, n = e._deps.indexedDB;
			if (t.isBeingOpened || e.idbdb) return t.dbReadyPromise.then(function() {
				return t.dbOpenError ? G(t.dbOpenError) : e;
			});
			t.isBeingOpened = !0, t.dbOpenError = null, t.openComplete = !1;
			var r = t.openCanceller, a = Math.round(10 * e.verno), o = !1;
			function s() {
				if (t.openCanceller !== r) throw new O.DatabaseClosed("db.open() was cancelled");
			}
			function c() {
				return new I(function(r, l) {
					if (s(), !n) throw new O.MissingAPI();
					var u = e.name, p = t.autoSchema || !a ? n.open(u) : n.open(u, a);
					if (!p) throw new O.MissingAPI();
					p.onerror = Z(l), p.onblocked = z(e._fireOnBlocked), p.onupgradeneeded = z(function(r) {
						var i;
						d = p.transaction, t.autoSchema && !e._options.allowEmptyDB ? (p.onerror = Bt, d.abort(), p.result.close(), (i = n.deleteDatabase(u)).onsuccess = i.onerror = z(function() {
							l(new O.NoSuchDatabase(`Database ${u} doesnt exist`));
						})) : (d.onerror = Z(l), i = r.oldVersion > 2 ** 62 ? 0 : r.oldVersion, f = i < 1, e.idbdb = p.result, o && cn(e, d), sn(e, i / 10, d, l));
					}, l), p.onsuccess = z(function() {
						d = null;
						var n, s, l, m, h, _, v = e.idbdb = p.result, y = g(v.objectStoreNames);
						if (0 < y.length) try {
							var b = v.transaction((h = y).length === 1 ? h[0] : h, "readonly");
							if (t.autoSchema) _ = v, m = b, (l = e).verno = _.version / 10, m = l._dbSchema = pn(0, _, m), l._storeNames = g(_.objectStoreNames, 0), rn(l, [l._allTables], i(m), m);
							else if (mn(e, e._dbSchema, b), s = b, ((s = ln(pn(0, (n = e).idbdb, s), n._dbSchema)).add.length || s.change.some(function(e) {
								return e.add.length || e.change.length;
							})) && !o) return console.warn("Dexie SchemaDiff: Schema was extended without increasing the number passed to db.version(). Dexie will add missing parts and increment native version number to workaround this."), v.close(), a = v.version + 1, o = !0, r(c());
							nn(e, b);
						} catch {}
						vn.add(e), v.onversionchange = z(function(n) {
							t.vcFired = !0, e.on("versionchange").fire(n);
						}), v.onclose = z(function() {
							e.close({ disableAutoOpen: !1 });
						}), f && (y = e._deps, h = u, bn(_ = y.indexedDB) || h === ct || yn(_, y.IDBKeyRange).put({ name: h }).catch(k)), r();
					}, l);
				}).catch(function(e) {
					switch (e?.name) {
						case "UnknownError":
							if (0 < t.PR1398_maxLoop) return t.PR1398_maxLoop--, console.warn("Dexie: Workaround for Chrome UnknownError on open()"), c();
							break;
						case "VersionError": if (0 < a) return a = 0, c();
					}
					return I.reject(e);
				});
			}
			var l, u = t.dbReadyResolve, d = null, f = !1;
			return I.race([r, (typeof navigator > "u" ? I.resolve() : !navigator.userAgentData && /Safari\//.test(navigator.userAgent) && !/Chrom(e|ium)\//.test(navigator.userAgent) && indexedDB.databases ? new Promise(function(e) {
				function t() {
					return indexedDB.databases().finally(e);
				}
				l = setInterval(t, 100), t();
			}).finally(function() {
				return clearInterval(l);
			}) : Promise.resolve()).then(c)]).then(function() {
				return s(), t.onReadyBeingFired = [], I.resolve(xn(function() {
					return e.on.ready.fire(e.vip);
				})).then(function n() {
					var r;
					if (0 < t.onReadyBeingFired.length) return r = t.onReadyBeingFired.reduce(Te, k), t.onReadyBeingFired = [], I.resolve(xn(function() {
						return r(e.vip);
					})).then(n);
				});
			}).finally(function() {
				t.openCanceller === r && (t.onReadyBeingFired = null, t.isBeingOpened = !1);
			}).catch(function(n) {
				t.dbOpenError = n;
				try {
					d && d.abort();
				} catch {}
				return r === t.openCanceller && e._close(), G(n);
			}).finally(function() {
				t.openComplete = !0, u();
			}).then(function() {
				var t;
				return f && (t = {}, e.tables.forEach(function(n) {
					n.schema.indexes.forEach(function(r) {
						r.name && (t[`idb://${e.name}/${n.name}/${r.name}`] = new Q(-1 / 0, [[[]]]));
					}), t[`idb://${e.name}/${n.name}/`] = t[`idb://${e.name}/${n.name}/:dels`] = new Q(-1 / 0, [[[]]]);
				}), Ut(Vt).fire(t), Fn(t, !0)), e;
			});
		}
		function Rn(e) {
			function t(t) {
				return e.next(t);
			}
			var n = i(t), r = i(function(t) {
				return e.throw(t);
			});
			function i(e) {
				return function(t) {
					var t = e(t), i = t.value;
					return t.done ? i : i && typeof i.then == "function" ? i.then(n, r) : a(i) ? Promise.all(i).then(n, r) : n(i);
				};
			}
			return i(t)();
		}
		function zn(e, t, n) {
			for (var r = a(e) ? e.slice() : [e], i = 0; i < n; ++i) r.push(t);
			return r;
		}
		var Bn = {
			stack: "dbcore",
			name: "VirtualIndexMiddleware",
			level: 1,
			create: function(e) {
				return t(t({}, e), { table: function(n) {
					var r = e.table(n), n = r.schema, i = Object.create(null), a = [];
					function o(e, n, r) {
						var s = $t(e), c = i[s] = i[s] || [], l = e == null ? 0 : typeof e == "string" ? 1 : e.length, u = 0 < n, s = t(t({}, r), {
							name: u ? `${s}(virtual-from:${r.name})` : r.name,
							lowLevelIndex: r,
							isVirtual: u,
							keyTail: n,
							keyLength: l,
							extractKey: Xt(e),
							unique: !u && r.unique
						});
						return c.push(s), s.isPrimaryKey || a.push(s), 1 < l && o(l === 2 ? e[0] : e.slice(0, l - 1), n + 1, r), c.sort(function(e, t) {
							return e.keyTail - t.keyTail;
						}), s;
					}
					var s = o(n.primaryKey.keyPath, 0, n.primaryKey);
					i[":id"] = [s];
					for (var c = 0, l = n.indexes; c < l.length; c++) {
						var u = l[c];
						o(u.keyPath, 0, u);
					}
					function d(n) {
						var r, i = n.query.index;
						return i.isVirtual ? t(t({}, n), { query: {
							index: i.lowLevelIndex,
							range: (r = n.query.range, i = i.keyTail, {
								type: r.type === 1 ? 2 : r.type,
								lower: zn(r.lower, r.lowerOpen ? e.MAX_KEY : e.MIN_KEY, i),
								lowerOpen: !0,
								upper: zn(r.upper, r.upperOpen ? e.MIN_KEY : e.MAX_KEY, i),
								upperOpen: !0
							})
						} }) : n;
					}
					return t(t({}, r), {
						schema: t(t({}, n), {
							primaryKey: s,
							indexes: a,
							getIndexByKeyPath: function(e) {
								return (e = i[$t(e)]) && e[0];
							}
						}),
						count: function(e) {
							return r.count(d(e));
						},
						query: function(e) {
							return r.query(d(e));
						},
						openCursor: function(t) {
							var n = t.query.index, i = n.keyTail, a = n.keyLength;
							return n.isVirtual ? r.openCursor(d(t)).then(function(e) {
								return e && o(e);
							}) : r.openCursor(t);
							function o(n) {
								return Object.create(n, {
									continue: { value: function(r) {
										r == null ? t.unique ? n.continue(n.key.slice(0, a).concat(t.reverse ? e.MIN_KEY : e.MAX_KEY, i)) : n.continue() : n.continue(zn(r, t.reverse ? e.MAX_KEY : e.MIN_KEY, i));
									} },
									continuePrimaryKey: { value: function(t, r) {
										n.continuePrimaryKey(zn(t, e.MAX_KEY, i), r);
									} },
									primaryKey: { get: function() {
										return n.primaryKey;
									} },
									key: { get: function() {
										var e = n.key;
										return a === 1 ? e[0] : e.slice(0, a);
									} },
									value: { get: function() {
										return n.value;
									} }
								});
							}
						}
					});
				} });
			}
		};
		function Vn(e, t, n, r) {
			return n ||= {}, r ||= "", i(e).forEach(function(i) {
				var a, o, s;
				l(t, i) ? (a = e[i], o = t[i], typeof a == "object" && typeof o == "object" && a && o ? (s = ae(a)) === ae(o) ? s === "Object" ? Vn(a, o, n, r + i + ".") : a !== o && (n[r + i] = t[i]) : n[r + i] = t[i] : a !== o && (n[r + i] = t[i])) : n[r + i] = void 0;
			}), i(t).forEach(function(i) {
				l(e, i) || (n[r + i] = t[i]);
			}), n;
		}
		function Hn(e, t) {
			return t.type === "delete" ? t.keys : t.keys || t.values.map(e.extractKey);
		}
		var Un = {
			stack: "dbcore",
			name: "HooksMiddleware",
			level: 2,
			create: function(e) {
				return t(t({}, e), { table: function(r) {
					var i = e.table(r), a = i.schema.primaryKey;
					return t(t({}, i), { mutate: function(e) {
						var o = N.trans, s = o.table(r).hook, c = s.deleting, u = s.creating, d = s.updating;
						switch (e.type) {
							case "add":
								if (u.fire === k) break;
								return o._promise("readwrite", function() {
									return f(e);
								}, !0);
							case "put":
								if (u.fire === k && d.fire === k) break;
								return o._promise("readwrite", function() {
									return f(e);
								}, !0);
							case "delete":
								if (c.fire === k) break;
								return o._promise("readwrite", function() {
									return f(e);
								}, !0);
							case "deleteRange":
								if (c.fire === k) break;
								return o._promise("readwrite", function() {
									return function e(n, r, o) {
										return i.query({
											trans: n,
											values: !1,
											query: {
												index: a,
												range: r
											},
											limit: o
										}).then(function(i) {
											var a = i.result;
											return f({
												type: "delete",
												keys: a,
												trans: n
											}).then(function(i) {
												return 0 < i.numFailures ? Promise.reject(i.failures[0]) : a.length < o ? {
													failures: [],
													numFailures: 0,
													lastResult: void 0
												} : e(n, t(t({}, r), {
													lower: a[a.length - 1],
													lowerOpen: !0
												}), o);
											});
										});
									}(e.trans, e.range, 1e4);
								}, !0);
						}
						return i.mutate(e);
						function f(e) {
							var r, o, s, f = N.trans, p = e.keys || Hn(a, e);
							if (p) return (e = e.type === "add" || e.type === "put" ? t(t({}, e), { keys: p }) : t({}, e)).type !== "delete" && (e.values = n([], e.values, !0)), e.keys && (e.keys = n([], e.keys, !0)), r = i, s = p, ((o = e).type === "add" ? Promise.resolve([]) : r.getMany({
								trans: o.trans,
								keys: s,
								cache: "immutable"
							})).then(function(t) {
								var n = p.map(function(n, r) {
									var i, o, s, p = t[r], m = {
										onerror: null,
										onsuccess: null
									};
									return e.type === "delete" ? c.fire.call(m, n, p, f) : e.type === "add" || p === void 0 ? (i = u.fire.call(m, n, e.values[r], f), n == null && i != null && (e.keys[r] = n = i, a.outbound || x(e.values[r], a.keyPath, n))) : (i = Vn(p, e.values[r]), (o = d.fire.call(m, i, n, p, f)) && (s = e.values[r], Object.keys(o).forEach(function(e) {
										l(s, e) ? s[e] = o[e] : x(s, e, o[e]);
									}))), m;
								});
								return i.mutate(e).then(function(r) {
									for (var i = r.failures, a = r.results, o = r.numFailures, r = r.lastResult, s = 0; s < p.length; ++s) {
										var c = (a || p)[s], l = n[s];
										c == null ? l.onerror && l.onerror(i[s]) : l.onsuccess && l.onsuccess(e.type === "put" && t[s] ? e.values[s] : c);
									}
									return {
										failures: i,
										results: a,
										numFailures: o,
										lastResult: r
									};
								}).catch(function(e) {
									return n.forEach(function(t) {
										return t.onerror && t.onerror(e);
									}), Promise.reject(e);
								});
							});
							throw Error("Keys missing");
						}
					} });
				} });
			}
		};
		function Wn(e, t, n) {
			try {
				if (!t || t.keys.length < e.length) return null;
				for (var r = [], i = 0, a = 0; i < t.keys.length && a < e.length; ++i) K(t.keys[i], e[a]) === 0 && (r.push(n ? ie(t.values[i]) : t.values[i]), ++a);
				return r.length === e.length ? r : null;
			} catch {
				return null;
			}
		}
		var Gn = {
			stack: "dbcore",
			level: -1,
			create: function(e) {
				return { table: function(n) {
					var r = e.table(n);
					return t(t({}, r), {
						getMany: function(e) {
							var t;
							return e.cache ? (t = Wn(e.keys, e.trans._cache, e.cache === "clone")) ? I.resolve(t) : r.getMany(e).then(function(t) {
								return e.trans._cache = {
									keys: e.keys,
									values: e.cache === "clone" ? ie(t) : t
								}, t;
							}) : r.getMany(e);
						},
						mutate: function(e) {
							return e.type !== "add" && (e.trans._cache = null), r.mutate(e);
						}
					});
				} };
			}
		};
		function Kn(e, t) {
			return e.trans.mode === "readonly" && !!e.subscr && !e.trans.explicit && e.trans.db._options.cache !== "disabled" && !t.schema.primaryKey.outbound;
		}
		function qn(e, t) {
			switch (e) {
				case "query": return t.values && !t.unique;
				case "get":
				case "getMany":
				case "count":
				case "openCursor": return !1;
			}
		}
		var Jn = {
			stack: "dbcore",
			level: 0,
			name: "Observability",
			create: function(e) {
				var n = e.schema.name, r = new Q(e.MIN_KEY, e.MAX_KEY);
				return t(t({}, e), {
					transaction: function(t, n, r) {
						if (N.subscr && n !== "readonly") throw new O.ReadOnly(`Readwrite transaction in liveQuery context. Querier source: ${N.querier}`);
						return e.transaction(t, n, r);
					},
					table: function(o) {
						function s(t) {
							var t = t.query;
							return [t.index, new Q((t = t.range).lower ?? e.MIN_KEY, t.upper ?? e.MAX_KEY)];
						}
						var c = e.table(o), l = c.schema, u = l.primaryKey, d = l.indexes, f = u.extractKey, p = u.outbound, m = u.autoIncrement && d.filter(function(e) {
							return e.compound && e.keyPath.includes(u.keyPath);
						}), h = t(t({}, c), { mutate: function(t) {
							function i(e) {
								return e = `idb://${n}/${o}/${e}`, h[e] || (h[e] = new Q());
							}
							var s, d, f, p = t.trans, h = t.mutatedParts ||= {}, g = i(""), _ = i(":dels"), v = t.type, y = t.type === "deleteRange" ? [t.range] : t.type === "delete" ? [t.keys] : t.values.length < 50 ? [Hn(u, t).filter(function(e) {
								return e;
							}), t.values] : [], b = y[0], y = y[1], x = t.trans._cache;
							return a(b) ? (g.addKeys(b), (v = v === "delete" || b.length === y.length ? Wn(b, x) : null) || _.addKeys(b), (v || y) && (s = i, d = v, f = y, l.indexes.forEach(function(e) {
								var t = s(e.name || "");
								function n(t) {
									return t == null ? null : e.extractKey(t);
								}
								function r(n) {
									e.multiEntry && a(n) ? n.forEach(function(e) {
										return t.addKey(e);
									}) : t.addKey(n);
								}
								(d || f).forEach(function(e, t) {
									var i = d && n(d[t]), t = f && n(f[t]);
									K(i, t) !== 0 && (i != null && r(i), t != null) && r(t);
								});
							}))) : b ? (y = {
								from: (x = b.lower) ?? e.MIN_KEY,
								to: (v = b.upper) ?? e.MAX_KEY
							}, _.add(y), g.add(y)) : (g.add(r), _.add(r), l.indexes.forEach(function(e) {
								return i(e.name).add(r);
							})), c.mutate(t).then(function(e) {
								return !b || t.type !== "add" && t.type !== "put" || (g.addKeys(e.results), m && m.forEach(function(n) {
									for (var r = t.values.map(function(e) {
										return n.extractKey(e);
									}), a = n.keyPath.findIndex(function(e) {
										return e === u.keyPath;
									}), o = 0, s = e.results.length; o < s; ++o) r[o][a] = e.results[o];
									i(n.name).addKeys(r);
								})), p.mutatedParts = kn(p.mutatedParts || {}, h), e;
							});
						} }), g = {
							get: function(e) {
								return [u, new Q(e.key)];
							},
							getMany: function(e) {
								return [u, new Q().addKeys(e.keys)];
							},
							count: s,
							query: s,
							openCursor: s
						};
						return i(g).forEach(function(e) {
							h[e] = function(i) {
								var a = N.subscr, s = !!a, l = Kn(N, c) && qn(e, i) ? i.obsSet = {} : a;
								if (s) {
									var u, a = function(e) {
										return e = `idb://${n}/${o}/${e}`, l[e] || (l[e] = new Q());
									}, d = a(""), m = a(":dels"), s = g[e](i), h = s[0], s = s[1];
									if ((e === "query" && h.isPrimaryKey && !i.values ? m : a(h.name || "")).add(s), !h.isPrimaryKey) {
										if (e !== "count") return u = e === "query" && p && i.values && c.query(t(t({}, i), { values: !1 })), c[e].apply(this, arguments).then(function(t) {
											if (e === "query") {
												if (p && i.values) return u.then(function(e) {
													return e = e.result, d.addKeys(e), t;
												});
												var n = i.values ? t.result.map(f) : t.result;
												(i.values ? d : m).addKeys(n);
											} else {
												var r, a;
												if (e === "openCursor") return a = i.values, (r = t) && Object.create(r, {
													key: { get: function() {
														return m.addKey(r.primaryKey), r.key;
													} },
													primaryKey: { get: function() {
														var e = r.primaryKey;
														return m.addKey(e), e;
													} },
													value: { get: function() {
														return a && d.addKey(r.primaryKey), r.value;
													} }
												});
											}
											return t;
										});
										m.add(r);
									}
								}
								return c[e].apply(this, arguments);
							};
						}), h;
					}
				});
			}
		};
		function Yn(e, n, r) {
			var i;
			return r.numFailures === 0 ? n : n.type === "deleteRange" || (i = n.keys ? n.keys.length : "values" in n && n.values ? n.values.length : 1, r.numFailures === i) ? null : (i = t({}, n), a(i.keys) && (i.keys = i.keys.filter(function(e, t) {
				return !(t in r.failures);
			})), "values" in i && a(i.values) && (i.values = i.values.filter(function(e, t) {
				return !(t in r.failures);
			})), i);
		}
		function Xn(e, t) {
			return n = e, ((r = t).lower === void 0 || (r.lowerOpen ? 0 < K(n, r.lower) : 0 <= K(n, r.lower))) && (n = e, (r = t).upper === void 0 || (r.upperOpen ? K(n, r.upper) < 0 : K(n, r.upper) <= 0));
			var n, r;
		}
		function Zn(e, t, n, r, i, o) {
			var s, c, l, u, d, f, p;
			return !n || n.length === 0 || (s = t.query.index, c = s.multiEntry, l = t.query.range, u = r.schema.primaryKey.extractKey, d = s.extractKey, f = (s.lowLevelIndex || s).extractKey, (r = n.reduce(function(e, n) {
				var r = e, i = [];
				if (n.type === "add" || n.type === "put") for (var o = new Q(), s = n.values.length - 1; 0 <= s; --s) {
					var f, p = n.values[s], m = u(p);
					!o.hasKey(m) && (f = d(p), c && a(f) ? f.some(function(e) {
						return Xn(e, l);
					}) : Xn(f, l)) && (o.addKey(m), i.push(p));
				}
				switch (n.type) {
					case "add":
						var h = new Q().addKeys(t.values ? e.map(function(e) {
							return u(e);
						}) : e), r = e.concat(t.values ? i.filter(function(e) {
							return e = u(e), !h.hasKey(e) && (h.addKey(e), !0);
						}) : i.map(function(e) {
							return u(e);
						}).filter(function(e) {
							return !h.hasKey(e) && (h.addKey(e), !0);
						}));
						break;
					case "put":
						var g = new Q().addKeys(n.values.map(function(e) {
							return u(e);
						}));
						r = e.filter(function(e) {
							return !g.hasKey(t.values ? u(e) : e);
						}).concat(t.values ? i : i.map(function(e) {
							return u(e);
						}));
						break;
					case "delete":
						var _ = new Q().addKeys(n.keys);
						r = e.filter(function(e) {
							return !_.hasKey(t.values ? u(e) : e);
						});
						break;
					case "deleteRange":
						var v = n.range;
						r = e.filter(function(e) {
							return !Xn(u(e), v);
						});
				}
				return r;
			}, e)) === e) ? e : (p = function(e, t) {
				return K(f(e), f(t)) || K(u(e), u(t));
			}, r.sort(t.direction === "prev" || t.direction === "prevunique" ? function(e, t) {
				return p(t, e);
			} : p), t.limit && t.limit < 1 / 0 && (r.length > t.limit ? r.length = t.limit : e.length === t.limit && r.length < t.limit && (i.dirty = !0)), o ? Object.freeze(r) : r);
		}
		function Qn(e, t) {
			return K(e.lower, t.lower) === 0 && K(e.upper, t.upper) === 0 && !!e.lowerOpen == !!t.lowerOpen && !!e.upperOpen == !!t.upperOpen;
		}
		function $n(e, t) {
			return ((e, t, n, r) => {
				if (e === void 0) return t === void 0 ? 0 : -1;
				if (t === void 0) return 1;
				if ((e = K(e, t)) === 0) {
					if (n && r) return 0;
					if (n) return 1;
					if (r) return -1;
				}
				return e;
			})(e.lower, t.lower, e.lowerOpen, t.lowerOpen) <= 0 && 0 <= ((e, t, n, r) => {
				if (e === void 0) return t === void 0 ? 0 : 1;
				if (t === void 0) return -1;
				if ((e = K(e, t)) === 0) {
					if (n && r) return 0;
					if (n) return -1;
					if (r) return 1;
				}
				return e;
			})(e.upper, t.upper, e.upperOpen, t.upperOpen);
		}
		function er(e, t, n, r) {
			e.subscribers.add(n), r.addEventListener("abort", function() {
				var r, i;
				e.subscribers.delete(n), e.subscribers.size === 0 && (r = e, i = t, setTimeout(function() {
					r.subscribers.size === 0 && ce(i, r);
				}, 3e3));
			});
		}
		var tr = {
			stack: "dbcore",
			level: 0,
			name: "Cache",
			create: function(e) {
				var n = e.schema.name;
				return t(t({}, e), {
					transaction: function(t, r, i) {
						var a, o, s = e.transaction(t, r, i);
						return r === "readwrite" && (i = (a = new AbortController()).signal, s.addEventListener("abort", (o = function(i) {
							return function() {
								if (a.abort(), r === "readwrite") {
									for (var o = /* @__PURE__ */ new Set(), c = 0, l = t; c < l.length; c++) {
										var u = l[c], d = jn[`idb://${n}/${u}`];
										if (d) {
											var f = e.table(u), p = d.optimisticOps.filter(function(e) {
												return e.trans === s;
											});
											if (s._explicit && i && s.mutatedParts) for (var m = 0, h = Object.values(d.queries.query); m < h.length; m++) for (var g = 0, _ = (b = h[m]).slice(); g < _.length; g++) An((x = _[g]).obsSet, s.mutatedParts) && (ce(b, x), x.subscribers.forEach(function(e) {
												return o.add(e);
											}));
											else if (0 < p.length) {
												d.optimisticOps = d.optimisticOps.filter(function(e) {
													return e.trans !== s;
												});
												for (var v = 0, y = Object.values(d.queries.query); v < y.length; v++) for (var b, x, S, C = 0, ee = (b = y[v]).slice(); C < ee.length; C++) (x = ee[C]).res != null && s.mutatedParts && (i && !x.dirty ? (S = Object.isFrozen(x.res), S = Zn(x.res, x.req, p, f, x, S), x.dirty ? (ce(b, x), x.subscribers.forEach(function(e) {
													return o.add(e);
												})) : S !== x.res && (x.res = S, x.promise = I.resolve({ result: S }))) : (x.dirty && ce(b, x), x.subscribers.forEach(function(e) {
													return o.add(e);
												})));
											}
										}
									}
									o.forEach(function(e) {
										return e();
									});
								}
							};
						})(!1), { signal: i }), s.addEventListener("error", o(!1), { signal: i }), s.addEventListener("complete", o(!0), { signal: i })), s;
					},
					table: function(r) {
						var i = e.table(r), a = i.schema.primaryKey;
						return t(t({}, i), {
							mutate: function(e) {
								var o, s = N.trans;
								return !a.outbound && s.db._options.cache !== "disabled" && !s.explicit && s.idbtrans.mode === "readwrite" && (o = jn[`idb://${n}/${r}`]) ? (s = i.mutate(e), e.type !== "add" && e.type !== "put" || !(50 <= e.values.length || Hn(a, e).some(function(e) {
									return e == null;
								})) ? (o.optimisticOps.push(e), e.mutatedParts && Pn(e.mutatedParts), s.then(function(t) {
									0 < t.numFailures && (ce(o.optimisticOps, e), (t = Yn(0, e, t)) && o.optimisticOps.push(t), e.mutatedParts) && Pn(e.mutatedParts);
								}), s.catch(function() {
									ce(o.optimisticOps, e), e.mutatedParts && Pn(e.mutatedParts);
								})) : s.then(function(n) {
									var r = Yn(0, t(t({}, e), { values: e.values.map(function(e, r) {
										var i;
										return n.failures[r] ? e : (x(i = (i = a.keyPath) != null && i.includes(".") ? ie(e) : t({}, e), a.keyPath, n.results[r]), i);
									}) }), n);
									o.optimisticOps.push(r), queueMicrotask(function() {
										return e.mutatedParts && Pn(e.mutatedParts);
									});
								}), s) : i.mutate(e);
							},
							query: function(e) {
								var t, a, o, s, c, l, u;
								return Kn(N, i) && qn("query", e) ? (t = (o = N.trans)?.db._options.cache === "immutable", a = (o = N).requery, o = o.signal, l = ((e, t, n, r) => {
									var i = jn[`idb://${e}/${t}`];
									if (!i) return [];
									if (!(e = i.queries[n])) return [
										null,
										!1,
										i,
										null
									];
									var a = e[(r.query ? r.query.index.name : null) || ""];
									if (!a) return [
										null,
										!1,
										i,
										null
									];
									var o = (s = r.direction) ?? "next", s = a.find(function(e) {
										return e.req.limit === r.limit && e.req.values === r.values && (e.req.direction ?? "next") === o && Qn(e.req.query.range, r.query.range);
									});
									return s ? [
										s,
										!0,
										i,
										a
									] : [
										a.find(function(e) {
											return ("limit" in e.req ? e.req.limit : 1 / 0) >= r.limit && (e.req.direction ?? "next") === o && (!r.values || e.req.values) && $n(e.req.query.range, r.query.range);
										}),
										!1,
										i,
										a
									];
								})(n, r, "query", e), u = l[0], s = l[2], c = l[3], u && l[1] ? u.obsSet = e.obsSet : (l = i.query(e).then(function(e) {
									var n = e.result;
									if (u && (u.res = n), t) {
										for (var r = 0, i = n.length; r < i; ++r) Object.freeze(n[r]);
										Object.freeze(n);
									}
									return e;
								}).catch(function(e) {
									return c && u && ce(c, u), Promise.reject(e);
								}), u = {
									obsSet: e.obsSet,
									promise: l,
									subscribers: /* @__PURE__ */ new Set(),
									type: "query",
									req: e,
									dirty: !1
								}, c ? c.push(u) : (c = [u], (s ||= jn[`idb://${n}/${r}`] = {
									queries: {
										query: {},
										count: {}
									},
									objs: /* @__PURE__ */ new Map(),
									optimisticOps: [],
									unsignaledParts: {}
								}).queries.query[e.query.index.name || ""] = c)), er(u, c, a, o), u.promise.then(function(n) {
									return n = Zn(n.result, e, s?.optimisticOps, i, u, t), { result: t ? n : ie(n) };
								})) : i.query(e);
							}
						});
					}
				});
			}
		};
		function nr(e, t) {
			return new Proxy(e, { get: function(e, n, r) {
				return n === "db" ? t : Reflect.get(e, n, r);
			} });
		}
		$.prototype.version = function(e) {
			if (isNaN(e) || e < .1) throw new O.Type("Given version is not a positive number");
			if (e = Math.round(10 * e) / 10, this.idbdb || this._state.isBeingOpened) throw new O.Schema("Cannot add version when database is open");
			this.verno = Math.max(this.verno, e);
			var t = this._versions, n = t.filter(function(t) {
				return t._cfg.version === e;
			})[0];
			return n || (n = new this.Version(e), t.push(n), t.sort(on), n.stores({}), this._state.autoSchema = !1), n;
		}, $.prototype._whenReady = function(e) {
			var t = this;
			return this.idbdb && (this._state.openComplete || N.letThrough || this._vip) ? e() : new I(function(e, n) {
				if (t._state.openComplete) return n(new O.DatabaseClosed(t._state.dbOpenError));
				if (!t._state.isBeingOpened) {
					if (!t._state.autoOpen) return void n(new O.DatabaseClosed());
					t.open().catch(k);
				}
				t._state.dbReadyPromise.then(e, n);
			}).then(e);
		}, $.prototype.use = function(e) {
			var t = e.stack, n = e.create, r = e.level, e = e.name, i = (e && this.unuse({
				stack: t,
				name: e
			}), this._middlewares[t] || (this._middlewares[t] = []));
			return i.push({
				stack: t,
				create: n,
				level: r ?? 10,
				name: e
			}), i.sort(function(e, t) {
				return e.level - t.level;
			}), this;
		}, $.prototype.unuse = function(e) {
			var t = e.stack, n = e.name, r = e.create;
			return t && this._middlewares[t] && (this._middlewares[t] = this._middlewares[t].filter(function(e) {
				return r ? e.create !== r : !!n && e.name !== n;
			})), this;
		}, $.prototype.open = function() {
			var e = this;
			return nt(M, function() {
				return Ln(e);
			});
		}, $.prototype._close = function() {
			this.on.close.fire(new CustomEvent("close"));
			var e = this._state;
			if (vn.remove(this), this.idbdb) {
				try {
					this.idbdb.close();
				} catch {}
				this.idbdb = null;
			}
			e.isBeingOpened || (e.dbReadyPromise = new I(function(t) {
				e.dbReadyResolve = t;
			}), e.openCanceller = new I(function(t, n) {
				e.cancelOpen = n;
			}));
		}, $.prototype.close = function(e) {
			var e = (e === void 0 ? { disableAutoOpen: !0 } : e).disableAutoOpen, t = this._state;
			e ? (t.isBeingOpened && t.cancelOpen(new O.DatabaseClosed()), this._close(), t.autoOpen = !1, t.dbOpenError = new O.DatabaseClosed()) : (this._close(), t.autoOpen = this._options.autoOpen || t.isBeingOpened, t.openComplete = !1, t.dbOpenError = null);
		}, $.prototype.delete = function(e) {
			var t = this, n = (e === void 0 && (e = { disableAutoOpen: !0 }), 0 < arguments.length && typeof arguments[0] != "object"), r = this._state;
			return new I(function(i, a) {
				function o() {
					t.close(e);
					var n = t._deps.indexedDB.deleteDatabase(t.name);
					n.onsuccess = z(function() {
						var e = t._deps, n = t.name, r;
						bn(r = e.indexedDB) || n === ct || yn(r, e.IDBKeyRange).delete(n).catch(k), i();
					}), n.onerror = Z(a), n.onblocked = t._fireOnBlocked;
				}
				if (n) throw new O.InvalidArgument("Invalid closeOptions argument to db.delete()");
				r.isBeingOpened ? r.dbReadyPromise.then(o) : o();
			});
		}, $.prototype.backendDB = function() {
			return this.idbdb;
		}, $.prototype.isOpen = function() {
			return this.idbdb !== null;
		}, $.prototype.hasBeenClosed = function() {
			var e = this._state.dbOpenError;
			return e && e.name === "DatabaseClosed";
		}, $.prototype.hasFailed = function() {
			return this._state.dbOpenError !== null;
		}, $.prototype.dynamicallyOpened = function() {
			return this._state.autoSchema;
		}, Object.defineProperty($.prototype, "tables", {
			get: function() {
				var e = this;
				return i(this._allTables).map(function(t) {
					return e._allTables[t];
				});
			},
			enumerable: !1,
			configurable: !0
		}), $.prototype.transaction = function() {
			var e = function(e, t, n) {
				var r = arguments.length;
				if (r < 2) throw new O.InvalidArgument("Too few arguments");
				for (var i = Array(r - 1); --r;) i[r - 1] = arguments[r];
				return n = i.pop(), [
					e,
					ee(i),
					n
				];
			}.apply(this, arguments);
			return this._transaction.apply(this, e);
		}, $.prototype._transaction = function(e, t, n) {
			var r, i, a = this, o = N.trans, s = (o && o.db === this && e.indexOf("!") === -1 || (o = null), e.indexOf("?") !== -1);
			e = e.replace("!", "").replace("?", "");
			try {
				if (i = t.map(function(e) {
					if (e = e instanceof a.Table ? e.name : e, typeof e != "string") throw TypeError("Invalid table argument to Dexie.transaction(). Only Table or String are allowed");
					return e;
				}), e == "r" || e === lt) r = lt;
				else {
					if (e != "rw" && e != ut) throw new O.InvalidArgument("Invalid transaction mode: " + e);
					r = ut;
				}
				if (o) {
					if (o.mode === lt && r === ut) {
						if (!s) throw new O.SubTransaction("Cannot enter a sub-transaction with READWRITE mode when parent transaction is READONLY");
						o = null;
					}
					o && i.forEach(function(e) {
						if (o && o.storeNames.indexOf(e) === -1) {
							if (!s) throw new O.SubTransaction("Table " + e + " not included in parent transaction.");
							o = null;
						}
					}), s && o && !o.active && (o = null);
				}
			} catch (e) {
				return o ? o._promise(null, function(t, n) {
					n(e);
				}) : G(e);
			}
			var c = function e(t, n, r, i, a) {
				return I.resolve().then(function() {
					var o = N.transless || N, s = t._createTransaction(n, r, t._dbSchema, i), o = (s.explicit = !0, {
						trans: s,
						transless: o
					});
					if (i) s.idbtrans = i.idbtrans;
					else try {
						s.create(), s.idbtrans._explicit = !0, t._state.PR1398_maxLoop = 3;
					} catch (i) {
						return i.name === he.InvalidState && t.isOpen() && 0 < --t._state.PR1398_maxLoop ? (console.warn("Dexie: Need to reopen db"), t.close({ disableAutoOpen: !1 }), t.open().then(function() {
							return e(t, n, r, null, a);
						})) : G(i);
					}
					var c, l = ue(a), o = (l && $e(), I.follow(function() {
						var e;
						(c = a.call(s, s)) && (l ? (e = H.bind(null, null), c.then(e, e)) : typeof c.next == "function" && typeof c.throw == "function" && (c = Rn(c)));
					}, o));
					return (c && typeof c.then == "function" ? I.resolve(c).then(function(e) {
						return s.active ? e : G(new O.PrematureCommit("Transaction committed too early. See http://bit.ly/2kdckMn"));
					}) : o.then(function() {
						return c;
					})).then(function(e) {
						return i && s._resolve(), s._completion.then(function() {
							return e;
						});
					}).catch(function(e) {
						return s._reject(e), G(e);
					});
				});
			}.bind(null, this, r, i, o, n);
			return o ? o._promise(r, c, "lock") : N.trans ? nt(N.transless, function() {
				return a._whenReady(c);
			}) : this._whenReady(c);
		}, $.prototype.table = function(e) {
			if (l(this._allTables, e)) return this._allTables[e];
			throw new O.InvalidTable(`Table ${e} does not exist`);
		};
		var rr = $;
		function $(e, n) {
			var r, i, a, o, s, c = this, l = (this._middlewares = {}, this.verno = 0, $.dependencies), l = (this._options = n = t({
				addons: $.addons,
				autoOpen: !0,
				indexedDB: l.indexedDB,
				IDBKeyRange: l.IDBKeyRange,
				cache: "cloned",
				maxConnections: 1e3
			}, n), this._deps = {
				indexedDB: n.indexedDB,
				IDBKeyRange: n.IDBKeyRange
			}, n.addons), u = (this._dbSchema = {}, this._versions = [], this._storeNames = [], this._allTables = {}, this.idbdb = null, this._novip = this, {
				dbOpenError: null,
				isBeingOpened: !1,
				onReadyBeingFired: null,
				openComplete: !1,
				dbReadyResolve: k,
				dbReadyPromise: null,
				cancelOpen: k,
				openCanceller: null,
				autoSchema: !0,
				PR1398_maxLoop: 3,
				autoOpen: n.autoOpen
			}), d = (u.dbReadyPromise = new I(function(e) {
				u.dbReadyResolve = e;
			}), u.openCanceller = new I(function(e, t) {
				u.cancelOpen = t;
			}), this._state = u, this.name = e, this.on = St(this, "populate", "blocked", "versionchange", "close", { ready: [Te, k] }), this.once = function(e, t) {
				var n = function() {
					var r = [...arguments];
					c.on(e).unsubscribe(n), t.apply(c, r);
				};
				return c.on(e, n);
			}, this.on.ready.subscribe = _(this.on.ready.subscribe, function(e) {
				return function(t, n) {
					$.vip(function() {
						var r, i = c._state;
						i.openComplete ? (i.dbOpenError || I.resolve().then(t), n && e(t)) : i.onReadyBeingFired ? (i.onReadyBeingFired.push(t), n && e(t)) : (e(t), r = c, n || e(function e() {
							r.on.ready.unsubscribe(t), r.on.ready.unsubscribe(e);
						}));
					});
				};
			}), this.Collection = (r = this, Ct(jt.prototype, function(e, t) {
				this.db = r;
				var n = ft, i = null;
				if (t) try {
					n = t();
				} catch (e) {
					i = e;
				}
				var t = e._ctx, e = t.table, a = e.hook.reading.fire;
				this._ctx = {
					table: e,
					index: t.index,
					isPrimKey: !t.index || e.schema.primKey.keyPath && t.index === e.schema.primKey.name,
					range: n,
					keysOnly: !1,
					dir: "next",
					unique: "",
					algorithm: null,
					filter: null,
					replayFilter: null,
					justLimit: !0,
					isMatch: null,
					offset: 0,
					limit: 1 / 0,
					error: i,
					or: t.or,
					valueMapper: a === ve ? null : a
				};
			})), this.Table = (i = this, Ct(xt.prototype, function(e, t, n) {
				this.db = i, this._tx = n, this.name = e, this.schema = t, this.hook = i._allTables[e] ? i._allTables[e].hook : St(null, {
					creating: [xe, k],
					reading: [ye, ve],
					updating: [Ce, k],
					deleting: [Se, k]
				});
			})), this.Transaction = (a = this, Ct(Wt.prototype, function(e, t, n, r, i) {
				var o = this;
				e !== "readonly" && t.forEach(function(e) {
					e = (e = n[e])?.yProps, e && (t = t.concat(e.map(function(e) {
						return e.updatesTable;
					})));
				}), this.db = a, this.mode = e, this.storeNames = t, this.schema = n, this.chromeTransactionDurability = r, this.idbtrans = null, this.on = St(this, "complete", "error", "abort"), this.parent = i || null, this.active = !0, this._reculock = 0, this._blockedFuncs = [], this._resolve = null, this._reject = null, this._waitingFor = null, this._waitingQueue = null, this._spinCount = 0, this._completion = new I(function(e, t) {
					o._resolve = e, o._reject = t;
				}), this._completion.then(function() {
					o.active = !1, o.on.complete.fire();
				}, function(e) {
					var t = o.active;
					return o.active = !1, o.on.error.fire(e), o.parent ? o.parent._reject(e) : t && o.idbtrans && o.idbtrans.abort(), G(e);
				});
			})), this.Version = (o = this, Ct(gn.prototype, function(e) {
				this.db = o, this._cfg = {
					version: e,
					storesSource: null,
					dbschema: {},
					tables: {},
					contentUpgrade: null
				};
			})), this.WhereClause = (s = this, Ct(zt.prototype, function(e, t, n) {
				if (this.db = s, this._ctx = {
					table: e,
					index: t === ":id" ? null : t,
					or: n
				}, this._cmp = this._ascending = K, this._descending = function(e, t) {
					return K(t, e);
				}, this._max = function(e, t) {
					return 0 < K(e, t) ? e : t;
				}, this._min = function(e, t) {
					return K(e, t) < 0 ? e : t;
				}, this._IDBKeyRange = s._deps.IDBKeyRange, !this._IDBKeyRange) throw new O.MissingAPI();
			})), this.on("versionchange", function(e) {
				0 < e.newVersion ? console.warn(`Another connection wants to upgrade database '${c.name}'. Closing db now to resume the upgrade.`) : console.warn(`Another connection wants to delete database '${c.name}'. Closing db now to resume the delete request.`), c.close({ disableAutoOpen: !1 });
			}), this.on("blocked", function(e) {
				!e.newVersion || e.newVersion < e.oldVersion ? console.warn(`Dexie.delete('${c.name}') was blocked`) : console.warn(`Upgrade '${c.name}' blocked by other connection holding version ${e.oldVersion / 10}`);
			}), this._maxKey = Yt(n.IDBKeyRange), this._createTransaction = function(e, t, n, r) {
				return new c.Transaction(e, t, n, c._options.chromeTransactionDurability, r);
			}, this._fireOnBlocked = function(e) {
				c.on("blocked").fire(e), vn.toArray().filter(function(e) {
					return e.name === c.name && e !== c && !e._state.vcFired;
				}).map(function(t) {
					return t.on("versionchange").fire(e);
				});
			}, this.use(Gn), this.use(tr), this.use(Jn), this.use(Bn), this.use(Un), new Proxy(this, { get: function(e, t, n) {
				var r;
				return t === "_vip" || (t === "table" ? function(e) {
					return nr(c.table(e), d);
				} : (r = Reflect.get(e, t, n)) instanceof xt ? nr(r, d) : t === "tables" ? r.map(function(e) {
					return nr(e, d);
				}) : t === "_createTransaction" ? function() {
					return nr(r.apply(this, arguments), d);
				} : r);
			} }));
			this.vip = d, l.forEach(function(e) {
				return e(c);
			});
		}
		var ir, Ae = typeof Symbol < "u" && "observable" in Symbol ? Symbol.observable : "@@observable", ar = (or.prototype.subscribe = function(e, t, n) {
			return this._subscribe(e && typeof e != "function" ? e : {
				next: e,
				error: t,
				complete: n
			});
		}, or.prototype[Ae] = function() {
			return this;
		}, or);
		function or(e) {
			this._subscribe = e;
		}
		try {
			ir = {
				indexedDB: r.indexedDB || r.mozIndexedDB || r.webkitIndexedDB || r.msIndexedDB,
				IDBKeyRange: r.IDBKeyRange || r.webkitIDBKeyRange
			};
		} catch {
			ir = {
				indexedDB: null,
				IDBKeyRange: null
			};
		}
		function sr(e) {
			var t, n = !1, r = new ar(function(r) {
				var i = ue(e), a, o = !1, s = {}, c = {}, l = {
					get closed() {
						return o;
					},
					unsubscribe: function() {
						o || (o = !0, a && a.abort(), u && Ut.storagemutated.unsubscribe(p));
					}
				}, u = (r.start && r.start(l), !1), d = function() {
					return it(m);
				};
				function f() {
					return An(c, s);
				}
				var p = function(e) {
					kn(s, e), f() && d();
				}, m = function() {
					var l, m, h;
					!o && ir.indexedDB && (s = {}, l = {}, a && a.abort(), a = new AbortController(), h = ((t) => {
						var n = We();
						try {
							i && $e();
							var r = V(e, t);
							return r = i ? r.finally(H) : r;
						} finally {
							n && Ge();
						}
					})(m = {
						subscr: l,
						signal: a.signal,
						requery: d,
						querier: e,
						trans: null
					}), u ||= (Ut.storagemutated.subscribe(p), !0), Promise.resolve(h).then(function(e) {
						n = !0, t = e, o || m.signal.aborted || (f() || (c = l, f()) ? d() : (s = {}, it(function() {
							return !o && r.next && r.next(e);
						})));
					}, function(e) {
						n = !1, ["DatabaseClosedError", "AbortError"].includes(e?.name) || o || it(function() {
							o || r.error && r.error(e);
						});
					}));
				};
				return setTimeout(d, 0), l;
			});
			return r.hasValue = function() {
				return n;
			}, r.getValue = function() {
				return t;
			}, r;
		}
		var cr = rr;
		function lr(e) {
			var t = dr;
			try {
				dr = !0, Ut.storagemutated.fire(e), Fn(e, !0);
			} finally {
				dr = t;
			}
		}
		u(cr, t(t({}, te), {
			delete: function(e) {
				return new cr(e, { addons: [] }).delete();
			},
			exists: function(e) {
				return new cr(e, { addons: [] }).open().then(function(e) {
					return e.close(), !0;
				}).catch("NoSuchDatabaseError", function() {
					return !1;
				});
			},
			getDatabaseNames: function(e) {
				try {
					return t = cr.dependencies, n = t.indexedDB, t = t.IDBKeyRange, (bn(n) ? Promise.resolve(n.databases()).then(function(e) {
						return e.map(function(e) {
							return e.name;
						}).filter(function(e) {
							return e !== ct;
						});
					}) : yn(n, t).toCollection().primaryKeys()).then(e);
				} catch {
					return G(new O.MissingAPI());
				}
				var t, n;
			},
			defineClass: function() {
				return function(e) {
					o(this, e);
				};
			},
			ignoreTransaction: function(e) {
				return N.trans ? nt(N.transless || M, e) : e();
			},
			vip: xn,
			async: function(e) {
				return function() {
					try {
						var t = Rn(e.apply(this, arguments));
						return t && typeof t.then == "function" ? t : I.resolve(t);
					} catch (e) {
						return G(e);
					}
				};
			},
			spawn: function(e, t, n) {
				try {
					var r = Rn(e.apply(n, t || []));
					return r && typeof r.then == "function" ? r : I.resolve(r);
				} catch (e) {
					return G(e);
				}
			},
			currentTransaction: { get: function() {
				return N.trans || null;
			} },
			waitFor: function(e, t) {
				return e = I.resolve(typeof e == "function" ? cr.ignoreTransaction(e) : e).timeout(t || 6e4), N.trans ? N.trans.waitFor(e) : e;
			},
			Promise: I,
			debug: {
				get: function() {
					return A;
				},
				set: function(e) {
					Ee(e);
				}
			},
			derive: p,
			extend: o,
			props: u,
			override: _,
			Events: St,
			on: Ut,
			liveQuery: sr,
			extendObservabilitySet: kn,
			getByKeyPath: b,
			setByKeyPath: x,
			delByKeyPath: function(e, t) {
				typeof t == "string" ? x(e, t, void 0) : "length" in t && [].map.call(t, function(t) {
					x(e, t, void 0);
				});
			},
			shallowClone: S,
			deepClone: ie,
			getObjectDiff: Vn,
			cmp: K,
			asap: y,
			minKey: -1 / 0,
			addons: [],
			connections: { get: vn.toArray },
			errnames: he,
			dependencies: ir,
			cache: jn,
			semVer: "4.4.6",
			version: "4.4.6".split(".").map(function(e) {
				return parseInt(e);
			}).reduce(function(e, t, n) {
				return e + t / 10 ** (2 * n);
			})
		})), cr.maxKey = Yt(cr.dependencies.IDBKeyRange), typeof dispatchEvent < "u" && typeof addEventListener < "u" && (Ut(Vt, function(e) {
			dr ||= (e = new CustomEvent(Ht, { detail: e }), dr = !0, dispatchEvent(e), !1);
		}), addEventListener(Ht, function(e) {
			e = e.detail, dr || lr(e);
		}));
		var ur, dr = !1, fr = function() {};
		return typeof BroadcastChannel < "u" && ((fr = function() {
			(ur = new BroadcastChannel(Ht)).onmessage = function(e) {
				return e.data && lr(e.data);
			};
		})(), typeof ur.unref == "function" && ur.unref(), Ut(Vt, function(e) {
			dr || ur.postMessage(e);
		})), typeof addEventListener < "u" && (addEventListener("pagehide", function(e) {
			if (!rr.disableBfCache && e.persisted) {
				A && console.debug("Dexie: handling persisted pagehide"), ur?.close();
				for (var t = 0, n = vn.toArray(); t < n.length; t++) n[t].close({ disableAutoOpen: !1 });
			}
		}), addEventListener("pageshow", function(e) {
			!rr.disableBfCache && e.persisted && (A && console.debug("Dexie: handling persisted pageshow"), fr(), lr({ all: new Q(-1 / 0, [[]]) }));
		})), I.rejectionMapper = function(e, t) {
			return !e || e instanceof fe || e instanceof TypeError || e instanceof SyntaxError || !e.name || !_e[e.name] ? e : (t = new _e[e.name](t || e.message, e), "stack" in e && f(t, "stack", { get: function() {
				return this.inner.stack;
			} }), t);
		}, Ee(A), t(rr, Object.freeze({
			__proto__: null,
			DEFAULT_MAX_CONNECTIONS: 1e3,
			Dexie: rr,
			Entity: mt,
			PropModification: vt,
			RangeSet: Q,
			add: function(e) {
				return new vt({ add: e });
			},
			cmp: K,
			default: rr,
			liveQuery: sr,
			mergeRanges: wn,
			rangesOverlap: Tn,
			remove: function(e) {
				return new vt({ remove: e });
			},
			replacePrefix: function(e, t) {
				return new vt({ replacePrefix: [e, t] });
			}
		}), { default: rr }), rr;
	});
})))(), 1), mt = Symbol.for("Dexie"), K = globalThis[mt] || (globalThis[mt] = pt.default);
if (pt.default.semVer !== K.semVer) throw Error(`Two different versions of Dexie loaded in the same app: ${pt.default.semVer} and ${K.semVer}`);
var { liveQuery: ht, mergeRanges: gt, rangesOverlap: _t, RangeSet: vt, cmp: yt, Entity: bt, PropModification: xt, replacePrefix: q, add: St, remove: Ct, DexieYProvider: wt } = K, Tt = null;
function Et(e) {
	Tt ||= e();
}
function Dt() {
	return Tt ?? Promise.resolve();
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/storage/ehagakiDb.ts
var Ot = /* @__PURE__ */ new Set(), kt = !1;
function At(e) {
	kt !== e && (kt = e, Ot.forEach((t) => t(e)));
}
var jt = class extends K {
	opening = null;
	emojiItems;
	emojiCacheMeta;
	drafts;
	profiles;
	relayConfigs;
	sharedMedia;
	hashtagHistory;
	customEmojiUsage;
	customEmojiImageMeta;
	uploadDestinations;
	postHistory;
	sensitivePayloads;
	postHistoryChildInteractions;
	postHistoryDeletionRequests;
	postMediaCache;
	channelMetadata;
	channelImageCacheMeta;
	postHistoryExternalCoverage;
	postHistoryCitrineRanges;
	postHistoryLocalBrowsingRanges;
	postHistoryLocalResumeCursor;
	postHistoryJumpAnchors;
	postHistoryAuthoredSyncCursor;
	postHistoryInboundSyncCursor;
	postHistoryDirectReplyFetchMeta;
	postHistoryWriteGeneration;
	postHistoryChildWriteGeneration;
	postHistoryReactionDeletionAttempts;
	postHistoryReplyDeletionAttempts;
	events;
	eventStoreMigration;
	notifications;
	notificationSyncState;
	legacyImportState;
	constructor(e = s, { migrateEvents: t = !0 } = {}) {
		super(e), this.on("blocked", () => {
			At(!0);
		}), this.on("ready", () => At(!1)), t && this.on("ready", () => ft(this.backendDB()), !0), this.version(19).stores({
			events: "id",
			eventStoreMigration: "id",
			emojiItems: "id, pubkeyHex, identityKey, shortcodeLower, sortIndex, sourceType, sourceAddress, fetchedAt, updatedAt, [pubkeyHex+sortIndex], [pubkeyHex+identityKey]",
			emojiCacheMeta: "pubkeyHex, fetchedAt, updatedAt, schemaVersion",
			drafts: "id, scopeKey, pubkeyHex, updatedAt, timestamp, [scopeKey+updatedAt]",
			profiles: "pubkeyHex, fetchedAt, updatedAt, updatedAtFromEvent, schemaVersion",
			relayConfigs: "pubkeyHex, fetchedAt, updatedAt, updatedAtFromEvent, schemaVersion",
			sharedMedia: "id, createdAt, updatedAt, schemaVersion",
			hashtagHistory: "tagLower, useCount, lastUsed, updatedAt, schemaVersion",
			customEmojiUsage: "id, pubkeyHex, shortcodeLower, src, lastUsedAt, count, updatedAt, schemaVersion, [pubkeyHex+lastUsedAt], [pubkeyHex+shortcodeLower+src]",
			customEmojiImageMeta: "url, width, height, aspectRatio, fetchedAt, lastAccessedAt, updatedAt, schemaVersion",
			uploadDestinations: "id, scopeKey, pubkeyHex, protocol, presetId, isDefault, enabled, updatedAt, [scopeKey+isDefault], [scopeKey+enabled]",
			postHistory: `id, eventId, pubkeyHex, kind, createdAt, postedAt, updatedAt, deletedAt, fetchedAt, lastSeenAt, schemaVersion, [pubkeyHex+postedAt], [pubkeyHex+createdAt], ${c}`,
			sensitivePayloads: "id, pubkeyHex, structureKind, createdAt, updatedAt, deletedAt",
			postHistoryChildInteractions: "id, eventId, parentEventId, rootEventId, authorPubkey, kind, createdAt, fetchedAt, updatedAt, schemaVersion, [parentEventId+createdAt]",
			postHistoryDeletionRequests: "id, targetEventId, targetAuthorPubkey, deletionEventId, fetchedAt, [targetAuthorPubkey+targetEventId]",
			postMediaCache: "cacheKey, url, normalizedUrl, size, createdAt, lastAccessedAt, updatedAt, source, schemaVersion",
			channelMetadata: "channelEventId, fetchedAt, metadataCreatedAt, creatorPubkey, updatedAt, schemaVersion",
			channelImageCacheMeta: "url, responseType, fetchedAt, lastAttemptAt, lastAccessedAt, schemaVersion",
			postHistoryExternalCoverage: "id, ownerPubkeyHex, updatedAt",
			postHistoryCitrineRanges: "id, ownerPubkeyHex, updatedAt",
			postHistoryLocalBrowsingRanges: "id, ownerPubkeyHex, updatedAt",
			postHistoryLocalResumeCursor: "id, ownerPubkeyHex, updatedAt",
			postHistoryJumpAnchors: "id, updatedAt",
			postHistoryAuthoredSyncCursor: "id, updatedAt",
			postHistoryInboundSyncCursor: "id, updatedAt",
			postHistoryDirectReplyFetchMeta: "id, updatedAt",
			postHistoryWriteGeneration: "id, updatedAt",
			postHistoryChildWriteGeneration: "id, updatedAt",
			postHistoryReactionDeletionAttempts: "id, parentEventId, updatedAt",
			postHistoryReplyDeletionAttempts: "id, parentEventId, updatedAt",
			notifications: "id, ownerPubkeyHex, [ownerPubkeyHex+createdAt+eventId], [ownerPubkeyHex+unread]",
			notificationSyncState: "id, ownerPubkeyHex, updatedAt",
			legacyImportState: "id, updatedAt"
		});
	}
	open() {
		return this.opening ? this.opening : this.isOpen() ? K.Promise.resolve(this) : (this.opening = K.Promise.resolve(Dt()).then(() => y(K.dependencies.indexedDB, { databaseName: this.name })).then(() => super.open()).finally(() => {
			this.opening = null;
		}), this.opening);
	}
}, J = new jt(), Mt = new jt(s, { migrateEvents: !1 });
export { y as a, s as c, Et as i, Mt as n, p as o, At as r, h as s, J as t };
