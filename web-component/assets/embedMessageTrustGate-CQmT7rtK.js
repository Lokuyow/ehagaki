import { m as e } from "./signedEventResultValidator-vNb8KnFy.js";
// D:/ドキュメント/GitHub/ehagaki/src/lib/embedMessageTrustGate.ts
function t(t, n, r) {
	return !n || !e(t.data) || t.source !== n.parent || r && t.origin !== r ? null : t.data;
}
export { t };
