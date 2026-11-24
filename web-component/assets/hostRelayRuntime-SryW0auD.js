import { n as e } from "./relayConfigUtils-56ujWwKF.js";
// D:/ドキュメント/GitHub/ehagaki/src/lib/hostRelayRuntime.ts
var t = null;
function n(e) {
	t = e;
}
function r() {
	t = null;
}
function i() {
	return t !== null;
}
function a() {
	return t ? e.sanitizeExternalRelayUrls(e.extractReadRelays(t)) : [];
}
function o(t, n) {
	if (!i()) return null;
	let r = e.sanitizeExternalRelayUrls(t, { limit: n });
	return e.sanitizeExternalRelayUrls([...a(), ...r]);
}
export { o as a, i, r as n, a as r, n as t };
