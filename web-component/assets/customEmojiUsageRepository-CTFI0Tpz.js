import { d4 as m, ex as a, ey as i, ez as g, eA as d, eB as h } from "./App-B15rbX3S.js";
class u {
  constructor(s = m, t = Date.now) {
    this.db = s, this.now = t;
  }
  async getUsageHistory(s, t = a) {
    return !s || t <= 0 ? [] : (await this.db.customEmojiUsage.where("pubkeyHex").equals(s).toArray()).sort(i).slice(0, t).map(g);
  }
  async recordUse(s, t) {
    if (!s) return [];
    const o = this.now(), e = String(t.shortcode ?? "").replace(/^:+|:+$/g, "").trim().toLowerCase();
    if (!e || !t.src) return this.getUsageHistory(s);
    const c = d({
      pubkeyHex: s,
      shortcodeLower: e,
      src: t.src
    }), n = await this.db.customEmojiUsage.get(c), r = h({
      pubkeyHex: s,
      emoji: t,
      existing: n,
      now: o
    });
    return r ? (await this.db.transaction("rw", this.db.customEmojiUsage, async () => {
      await this.db.customEmojiUsage.put(r), await this.trimToMax(s);
    }), this.getUsageHistory(s)) : this.getUsageHistory(s);
  }
  async trimToMax(s) {
    const o = (await this.db.customEmojiUsage.where("pubkeyHex").equals(s).toArray()).sort(i).slice(a);
    o.length !== 0 && await this.db.customEmojiUsage.bulkDelete(
      o.map((e) => e.id)
    );
  }
}
const E = new u();
export {
  u as DexieCustomEmojiUsageRepository,
  E as customEmojiUsageRepository
};
