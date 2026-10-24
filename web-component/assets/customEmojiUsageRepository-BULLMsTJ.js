import { c as e } from "./legacyImportMarkers-CZ4J2IrE.js";
import { n as t, o as n, s as r, t as i } from "./customEmojiUsage-DkSYLWzm.js";
var a = new class {
	db;
	now;
	constructor(t = e, n = Date.now) {
		this.db = t, this.now = n;
	}
	async getUsageHistory(e, t = 100) {
		return !e || t <= 0 ? [] : (await this.db.customEmojiUsage.where("pubkeyHex").equals(e).toArray()).sort(n).slice(0, t).map(r);
	}
	async recordUse(e, n) {
		if (!e) return [];
		let r = this.now(), a = String(n.shortcode ?? "").replace(/^:+|:+$/g, "").trim().toLowerCase();
		if (!a || !n.src) return this.getUsageHistory(e);
		let o = t({
			pubkeyHex: e,
			shortcodeLower: a,
			src: n.src
		}), s = await this.db.customEmojiUsage.get(o), c = i({
			pubkeyHex: e,
			emoji: n,
			existing: s,
			now: r
		});
		return c && await this.db.transaction("rw", this.db.customEmojiUsage, async () => {
			await this.db.customEmojiUsage.put(c), await this.trimToMax(e);
		}), this.getUsageHistory(e);
	}
	async trimToMax(e) {
		let t = (await this.db.customEmojiUsage.where("pubkeyHex").equals(e).toArray()).sort(n).slice(100);
		t.length !== 0 && await this.db.customEmojiUsage.bulkDelete(t.map((e) => e.id));
	}
}();
export { a as customEmojiUsageRepository };
