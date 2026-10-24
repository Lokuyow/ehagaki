import { s as e } from "./signedEventResultValidator-BsR3Zf_8.js";
import { c as t } from "./legacyImportMarkers-CZ4J2IrE.js";
function n(e) {
	return {
		...e,
		eventIds: [...e.eventIds]
	};
}
function r(e, t) {
	return Array.from(new Set([...e, ...t].filter(Boolean)));
}
var i = new class {
	db;
	now;
	constructor(e = t, n = Date.now) {
		this.db = e, this.now = n;
	}
	async getByCacheKey(e) {
		if (!e) return null;
		let t = await this.db.postMediaCache.get(e);
		return t ? n(t) : null;
	}
	async getByUrl(t) {
		let r = e(t);
		if (!r) return null;
		let i = await this.db.postMediaCache.where("normalizedUrl").equals(r).first();
		return i ? n(i) : null;
	}
	async listByLastAccessed() {
		return (await this.db.postMediaCache.orderBy("lastAccessedAt").toArray()).map(n);
	}
	async upsert(t) {
		let i = this.now(), a = t.normalizedUrl ?? e(t.url), o = await this.db.postMediaCache.get(t.cacheKey), s = t.createdAt ?? o?.createdAt ?? i, c = t.lastAccessedAt ?? o?.lastAccessedAt ?? s, l = {
			cacheKey: t.cacheKey,
			url: t.url,
			normalizedUrl: a,
			size: t.size,
			mimeType: t.mimeType ?? o?.mimeType,
			createdAt: s,
			lastAccessedAt: c,
			source: t.source,
			eventIds: r(o?.eventIds ?? [], t.eventIds ?? []),
			updatedAt: i,
			schemaVersion: 1
		};
		return await this.db.postMediaCache.put(l), n(l);
	}
	async touch(e, t = this.now()) {
		if (!e) return;
		let n = await this.db.postMediaCache.get(e);
		n && await this.db.postMediaCache.put({
			...n,
			lastAccessedAt: t,
			updatedAt: t
		});
	}
	async linkEventIdByUrls(t) {
		if (!t.eventId) return;
		let n = Array.from(new Set(t.urls.map(e).filter(Boolean)));
		if (n.length === 0) return;
		let i = this.now();
		await this.db.transaction("rw", this.db.postMediaCache, async () => {
			for (let e of n) {
				let n = await this.db.postMediaCache.where("normalizedUrl").equals(e).first();
				if (!n) continue;
				let a = r(n.eventIds, [t.eventId]);
				a.length !== n.eventIds.length && await this.db.postMediaCache.put({
					...n,
					eventIds: a,
					updatedAt: i
				});
			}
		});
	}
	async deleteByCacheKey(e) {
		e && await this.db.postMediaCache.delete(e);
	}
}();
export { i as t };
