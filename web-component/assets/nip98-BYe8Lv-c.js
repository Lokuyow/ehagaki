import { bs as d, bp as g, bw as s, bv as i, bn as o } from "./entry-vGGuKCM6.js";
var n = Symbol("verified"), b = (e) => e instanceof Object;
function p(e) {
  if (!b(e) || typeof e.kind != "number" || typeof e.content != "string" || typeof e.created_at != "number" || typeof e.pubkey != "string" || !e.pubkey.match(/^[a-f0-9]{64}$/) || !Array.isArray(e.tags))
    return !1;
  for (let r = 0; r < e.tags.length; r++) {
    let t = e.tags[r];
    if (!Array.isArray(t))
      return !1;
    for (let a = 0; a < t.length; a++)
      if (typeof t[a] != "string")
        return !1;
  }
  return !0;
}
new TextDecoder("utf-8");
var c = new TextEncoder(), m = class {
  generateSecretKey() {
    return i.utils.randomSecretKey();
  }
  getPublicKey(e) {
    return s(i.getPublicKey(e));
  }
  finalizeEvent(e, r) {
    const t = e;
    return t.pubkey = s(i.getPublicKey(r)), t.id = u(t), t.sig = s(i.sign(o(u(t)), r)), t[n] = !0, t;
  }
  verifyEvent(e) {
    if (typeof e[n] == "boolean")
      return e[n];
    try {
      const r = u(e);
      if (r !== e.id)
        return e[n] = !1, !1;
      const t = i.verify(o(e.sig), o(r), o(e.pubkey));
      return e[n] = t, t;
    } catch {
      return e[n] = !1, !1;
    }
  }
};
function S(e) {
  if (!p(e))
    throw new Error("can't serialize event with wrong or missing properties");
  return JSON.stringify([0, e.pubkey, e.created_at, e.kind, e.tags, e.content]);
}
function u(e) {
  let r = g(c.encode(S(e)));
  return s(r);
}
var f = new m();
f.generateSecretKey;
f.getPublicKey;
f.finalizeEvent;
f.verifyEvent;
var E = 27235, w = "Nostr ";
async function v(e, r, t, a = !1, l) {
  const y = {
    kind: E,
    tags: [
      ["u", e],
      ["method", r]
    ],
    created_at: Math.round((/* @__PURE__ */ new Date()).getTime() / 1e3),
    content: ""
  };
  l && y.tags.push(["payload", k(l)]);
  const h = await t(y);
  return (a ? w : "") + d.encode(c.encode(JSON.stringify(h)));
}
function k(e) {
  const r = g(c.encode(JSON.stringify(e)));
  return s(r);
}
export {
  v as getToken,
  k as hashPayload
};
