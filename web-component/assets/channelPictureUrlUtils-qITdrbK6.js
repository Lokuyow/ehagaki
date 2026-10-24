import { a as e } from "./profilePictureUrlUtils-B7zGYkzO.js";
// D:/ドキュメント/GitHub/ehagaki/src/lib/channelPictureUrlUtils.ts
function t(t, n = {}) {
	return e(t, n);
}
function n(e) {
	return /^[0-9a-f]{64}$/.test(e);
}
function r({ eventId: e, pictureUrl: r, baseUrl: i, currentOrigin: a }) {
	if (!n(e)) return null;
	let o = t(r, { currentOrigin: a });
	if (!o) return null;
	let s = i.endsWith("/") ? i : `${i}/`, c = new URL(`${s}__ehagaki-image/channel`, a ?? globalThis.location?.origin);
	return c.searchParams.set("eventId", e), c.searchParams.set("url", o), c.toString();
}
export { t as n, r as t };
