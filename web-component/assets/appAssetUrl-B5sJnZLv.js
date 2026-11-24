import { n as e } from "./appRuntimeEnvironment-Bzv9wJOh.js";
// D:/ドキュメント/GitHub/ehagaki/src/lib/appAssetUrl.ts
function t(t) {
	let n = e().assetBase;
	return n ? new URL(t, n).href : `./${t}`;
}
export { t };
