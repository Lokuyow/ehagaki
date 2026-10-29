import { c as e } from "./legacyImportMarkers-CZ4J2IrE.js";
import { s as t } from "./signedEventResultValidator-DEUEqBPK.js";
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
	constructor(t = e, n = Date.now) {
		this.db = t, this.now = n;
	}
	async getByCacheKey(e) {
		if (!e) return null;
		let t = await this.db.postMediaCache.get(e);
		return t ? n(t) : null;
	}
	async getByUrl(e) {
		let r = t(e);
		if (!r) return null;
		let i = await this.db.postMediaCache.where("normalizedUrl").equals(r).first();
		return i ? n(i) : null;
	}
	async listByLastAccessed() {
		return (await this.db.postMediaCache.orderBy("lastAccessedAt").toArray()).map(n);
	}
	async upsert(e) {
		let i = this.now(), a = e.normalizedUrl ?? t(e.url), o = await this.db.postMediaCache.get(e.cacheKey), s = e.createdAt ?? o?.createdAt ?? i, c = e.lastAccessedAt ?? o?.lastAccessedAt ?? s, l = {
			cacheKey: e.cacheKey,
			url: e.url,
			normalizedUrl: a,
			size: e.size,
			mimeType: e.mimeType ?? o?.mimeType,
			createdAt: s,
			lastAccessedAt: c,
			source: e.source,
			eventIds: r(o?.eventIds ?? [], e.eventIds ?? []),
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
	async linkEventIdByUrls(e) {
		if (!e.eventId) return;
		let n = Array.from(new Set(e.urls.map(t).filter(Boolean)));
		if (n.length === 0) return;
		let i = this.now();
		await this.db.transaction("rw", this.db.postMediaCache, async () => {
			for (let t of n) {
				let n = await this.db.postMediaCache.where("normalizedUrl").equals(t).first();
				if (!n) continue;
				let a = r(n.eventIds, [e.eventId]);
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
