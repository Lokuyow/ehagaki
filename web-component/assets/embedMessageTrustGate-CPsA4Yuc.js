import { m as e } from "./signedEventResultValidator-BsR3Zf_8.js";
// D:/ドキュメント/GitHub/ehagaki/src/lib/embedMessageTrustGate.ts
function t(t, n, r) {
	return !n || !e(t.data) || t.source !== n.parent || r && t.origin !== r ? null : t.data;
}
export { t };
