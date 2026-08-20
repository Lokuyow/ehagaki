import { dv as r, eV as a, eW as d } from "./App-B-vAJu8d.js";
class c {
  constructor(t = r, s = Date.now) {
    this.db = t, this.now = s;
  }
  async get(t) {
    if (!t) return null;
    try {
      const s = await this.db.emojiCacheMeta.get(t) ?? null;
      if (!s || s.schemaVersion !== a)
        return { meta: s, items: [] };
      const o = await this.db.emojiItems.where("pubkeyHex").equals(t).sortBy("sortIndex");
      return {
        meta: s,
        items: o.map((e) => ({
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
  async put(t, s) {
    if (!t) return;
    const o = this.now();
    try {
      await this.db.transaction("rw", this.db.emojiItems, this.db.emojiCacheMeta, async () => {
        await this.db.emojiItems.where("pubkeyHex").equals(t).delete(), await this.db.emojiItems.bulkPut(
          s.map((e, i) => ({
            id: d(t, e.identityKey),
            pubkeyHex: t,
            identityKey: e.identityKey,
            shortcode: e.shortcode,
            shortcodeLower: e.shortcodeLower,
            src: e.src,
            setAddress: e.setAddress,
            sortIndex: i,
            sourceType: e.sourceType,
            sourceAddress: e.sourceAddress,
            fetchedAt: o,
            updatedAt: o
          }))
        ), await this.db.emojiCacheMeta.put({
          pubkeyHex: t,
          fetchedAt: o,
          updatedAt: o,
          schemaVersion: a
        });
      });
    } catch {
    }
  }
  async delete(t) {
    if (t)
      try {
        await this.db.transaction("rw", this.db.emojiItems, this.db.emojiCacheMeta, async () => {
          await this.db.emojiItems.where("pubkeyHex").equals(t).delete(), await this.db.emojiCacheMeta.delete(t);
        });
      } catch {
      }
  }
}
const m = new c();
export {
  c as DexieEmojisRepository,
  m as emojisRepository
};
