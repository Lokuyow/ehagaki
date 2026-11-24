import { $ as e, B as t, D as n, Dt as r, E as i, Et as a, G as o, K as s, St as c, _t as l, b as u, ct as d, ft as f, q as p, r as m, rt as h, tt as g, yt as _ } from "./index-client-DEFG3Gqk.js";
import { n as v } from "./appRuntimeEnvironment-Bzv9wJOh.js";
import "./LoadingPlaceholder-YrD8D_td.js";
import { n as y, t as b } from "./channelPictureUrlUtils-BUGaOoNH.js";
// D:/ドキュメント/GitHub/ehagaki/src/components/ChannelPicture.svelte
var x = p("<img/>");
function S(p, S) {
	r(S, !0);
	let C = m(S, "alt", 3, ""), w = m(S, "className", 3, ""), T = v().serviceWorkerEnabled && typeof navigator < "u" && !!navigator.serviceWorker?.controller, E = _(null), D = c(() => y(S.pictureUrl) ?? ""), O = c(() => T && S.cacheEligible && h(D) ? b({
		eventId: S.eventId,
		pictureUrl: h(D),
		baseUrl: "./"
	}) ?? "" : ""), k = c(() => h(O) && h(E) !== h(O) ? h(O) : h(D));
	function A() {
		h(O) && h(k) === h(O) && l(E, h(O), !0);
	}
	var j = s(), M = f(j), N = (t) => {
		var r = x();
		d(() => {
			u(r, "src", h(k)), u(r, "alt", C()), i(r, 1, n(w()));
		}), e("error", r, A), g(r), o(t, r);
	};
	t(M, (e) => {
		h(k) && e(N);
	}), o(p, j), a();
}
export { S as t };
