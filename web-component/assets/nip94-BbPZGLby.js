function e(e) {
	let t = {
		content: e.content,
		created_at: Math.floor(Date.now() / 1e3),
		kind: 1063,
		tags: [
			["url", e.url],
			["m", e.m],
			["x", e.x],
			["ox", e.ox]
		]
	};
	return e.size && t.tags.push(["size", e.size]), e.dim && t.tags.push(["dim", e.dim]), e.i && t.tags.push(["i", e.i]), e.blurhash && t.tags.push(["blurhash", e.blurhash]), e.thumb && t.tags.push(["thumb", e.thumb]), e.image && t.tags.push(["image", e.image]), e.summary && t.tags.push(["summary", e.summary]), e.alt && t.tags.push(["alt", e.alt]), e.fallback && e.fallback.forEach((e) => t.tags.push(["fallback", e])), t;
}
export { e as generateEventTemplate };
