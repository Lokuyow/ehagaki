// D:/ドキュメント/GitHub/ehagaki/src/lib/postMediaCacheUtils.ts
function e(e) {
	let t = String(e ?? "").trim();
	if (!t) return "";
	try {
		let e = new URL(t);
		return e.protocol !== "http:" && e.protocol !== "https:" ? "" : (e.hash = "", e.toString());
	} catch {
		return "";
	}
}
function t(e) {
	let t = String(e ?? "").trim();
	if (!t) return "";
	try {
		let e = new URL(t);
		return e.hash = "", e.toString();
	} catch {
		return t.replace(/#.*$/, "");
	}
}
function n(e) {
	let t = e.mimeType?.toLowerCase();
	if (t?.startsWith("image/")) return "image";
	if (t?.startsWith("video/")) return "video";
	if (t?.startsWith("audio/")) return "audio";
	let n = (() => {
		try {
			return new URL(e.url).pathname.toLowerCase();
		} catch {
			return e.url.toLowerCase();
		}
	})();
	return /\.(jpe?g|png|webp|gif|bmp|svg|avif)(?:$|[?#])/i.test(n) ? "image" : /\.(mp4|webm|mov|m4v|ogv)(?:$|[?#])/i.test(n) ? "video" : /\.(mp3|m4a|aac|ogg|oga|wav|flac)(?:$|[?#])/i.test(n) ? "audio" : "unknown";
}
export { t as n, e as r, n as t };
