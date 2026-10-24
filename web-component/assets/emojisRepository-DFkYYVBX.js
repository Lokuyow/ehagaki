import { c as e } from "./legacyImportMarkers-CZ4J2IrE.js";
import { i as t } from "./customEmoji-Bvbh2sQz.js";
var n = new class {
	db;
	now;
	constructor(t = e, n = Date.now) {
		this.db = t, this.now = n;
	}
	async get(e) {
		if (!e) return null;
		try {
			let t = await this.db.emojiCacheMeta.get(e) ?? null;
			return !t || t.schemaVersion !== 2 ? {
				meta: t,
				items: []
			} : {
				meta: t,
				items: (await this.db.emojiItems.where("pubkeyHex").equals(e).sortBy("sortIndex")).map((e) => ({
					identityKey: e.identityKey,
					shortcode: e.shortcode,
					shortcodeLower: e.shortcodeLower,
					src: e.src,
					setAddress: e.setAddress,
					sortIndex: e.sortIndex,
					sourceType: e.sourceType,
					sourceAddress: e.sourceAddress
				}))
			};
		} catch {
			return null;
		}
	}
	async put(e, n) {
		if (!e) return;
		let r = this.now();
		try {
			await this.db.transaction("rw", this.db.emojiItems, this.db.emojiCacheMeta, async () => {
				await this.db.emojiItems.where("pubkeyHex").equals(e).delete(), await this.db.emojiItems.bulkPut(n.map((n, i) => ({
					id: t(e, n.identityKey),
					pubkeyHex: e,
					identityKey: n.identityKey,
					shortcode: n.shortcode,
					shortcodeLower: n.shortcodeLower,
					src: n.src,
					setAddress: n.setAddress,
					sortIndex: i,
					sourceType: n.sourceType,
					sourceAddress: n.sourceAddress,
					fetchedAt: r,
					updatedAt: r
				}))), await this.db.emojiCacheMeta.put({
					pubkeyHex: e,
					fetchedAt: r,
					updatedAt: r,
					schemaVersion: 2
				});
			});
		} catch {}
	}
	async delete(e) {
		if (e) try {
			await this.db.transaction("rw", this.db.emojiItems, this.db.emojiCacheMeta, async () => {
				await this.db.emojiItems.where("pubkeyHex").equals(e).delete(), await this.db.emojiCacheMeta.delete(e);
			});
		} catch {}
	}
}();
export { n as emojisRepository };
