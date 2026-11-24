import { m as e } from "./esm-N9TTQGcl.js";
import { a as t } from "./profilePictureUrlUtils-B7zGYkzO.js";
// D:/ドキュメント/GitHub/ehagaki/src/lib/channelPictureUrlUtils.ts
function n(e, n = {}) {
	return t(e, n);
}
function r(t) {
	return e(t);
}
function i({ eventId: e, pictureUrl: t, baseUrl: i, currentOrigin: a }) {
	if (!r(e)) return null;
	let o = n(t, { currentOrigin: a });
	if (!o) return null;
	let s = i.endsWith("/") ? i : `${i}/`, c = new URL(`${s}__ehagaki-image/channel`, a ?? globalThis.location?.origin);
	return c.searchParams.set("eventId", e), c.searchParams.set("url", o), c.toString();
}
export { n, i as t };
