var c = 1063;
function i(s) {
  const r = {
    content: s.content,
    created_at: Math.floor(Date.now() / 1e3),
    kind: c,
    tags: [
      ["url", s.url],
      ["m", s.m],
      ["x", s.x],
      ["ox", s.ox]
    ]
  };
  return s.size && r.tags.push(["size", s.size]), s.dim && r.tags.push(["dim", s.dim]), s.i && r.tags.push(["i", s.i]), s.blurhash && r.tags.push(["blurhash", s.blurhash]), s.thumb && r.tags.push(["thumb", s.thumb]), s.image && r.tags.push(["image", s.image]), s.summary && r.tags.push(["summary", s.summary]), s.alt && r.tags.push(["alt", s.alt]), s.fallback && s.fallback.forEach((a) => r.tags.push(["fallback", a])), r;
}
function e(s) {
  if (s.kind !== c || !s.content)
    return !1;
  const r = ["url", "m", "x", "ox"];
  for (const n of r)
    if (!s.tags.find(([m]) => m == n))
      return !1;
  const a = s.tags.find(([n]) => n == "size");
  if (a && isNaN(Number(a[1])))
    return !1;
  const u = s.tags.find(([n]) => n == "dim");
  return !(u && !u[1].match(/^\d+x\d+$/));
}
function o(s) {
  if (!e(s))
    throw new Error("Invalid event");
  const r = {
    content: s.content,
    url: "",
    m: "",
    x: "",
    ox: ""
  };
  for (const [a, u] of s.tags)
    switch (a) {
      case "url":
        r.url = u;
        break;
      case "m":
        r.m = u;
        break;
      case "x":
        r.x = u;
        break;
      case "ox":
        r.ox = u;
        break;
      case "size":
        r.size = u;
        break;
      case "dim":
        r.dim = u;
        break;
      case "magnet":
        r.magnet = u;
        break;
      case "i":
        r.i = u;
        break;
      case "blurhash":
        r.blurhash = u;
        break;
      case "thumb":
        r.thumb = u;
        break;
      case "image":
        r.image = u;
        break;
      case "summary":
        r.summary = u;
        break;
      case "alt":
        r.alt = u;
        break;
      case "fallback":
        r.fallback ??= [], r.fallback.push(u);
        break;
    }
  return r;
}
export {
  i as generateEventTemplate,
  o as parseEvent,
  e as validateEvent
};
