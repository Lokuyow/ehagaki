import { n as e } from "./relayConfigUtils-56ujWwKF.js";
// D:/ドキュメント/GitHub/ehagaki/src/lib/localRelayUrl.ts
function t(t) {
	let n = t.trim();
	if (!/^wss?:\/\//i.test(n)) return null;
	try {
		let t = new URL(n);
		return t.hash || t.username || t.password ? null : e.normalizeExternalRelayUrl(n);
	} catch {
		return null;
	}
}
export { t };
