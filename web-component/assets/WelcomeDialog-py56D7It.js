import { Dt as e, Et as t, G as n, H as r, K as i, Mt as a, Nt as o, P as s, St as c, X as l, a as u, b as d, ct as f, dt as p, ft as m, j as h, mt as g, o as _, pt as v, q as y, r as b, rt as x, s as S } from "./index-client-DEFG3Gqk.js";
import { Z as C } from "./LoadingPlaceholder-YrD8D_td.js";
import { t as w } from "./Button-Cqrg0_jX.js";
import { t as T } from "./useDialogHistory.svelte-pVteCIez.js";
import { t as E } from "./DialogWrapper-DlNV_DwH.js";
import { t as D } from "./dialog-close-DFGIFxm7.js";
import { t as O } from "./appAssetUrl-B5sJnZLv.js";
// D:/ドキュメント/GitHub/ehagaki/src/components/WelcomeDialog.svelte
var k = y("<div class=\"welcome-content svelte-10qljse\"><div class=\"title-section svelte-10qljse\"><img alt=\"ehagaki icon\" class=\"site-icon svelte-10qljse\"/> <h2 class=\"svelte-10qljse\"> </h2></div> <p class=\"svelte-10qljse\"> </p> <pre class=\"features svelte-10qljse\"> </pre></div>"), A = {
	hash: "svelte-10qljse",
	code: ".welcome-content.svelte-10qljse {text-align:center;}.title-section.svelte-10qljse {display:flex;align-items:center;justify-content:center;gap:8px;margin:20px 0 38px 0;}.site-icon.svelte-10qljse {width:38px;height:38px;}h2.svelte-10qljse {color:var(--text-light);margin-bottom:1rem;margin:0;}p.svelte-10qljse {font-size:1.0625rem;margin-bottom:1.5rem;line-height:1.6;}.features.svelte-10qljse {text-align:start;white-space:pre-line;margin-bottom:1rem;padding-inline-start:1rem;border-radius:8px;line-height:1.6;}.welcome-dialog .get-started-btn {width:100%;height:50px;font-size:1.0625rem;}.welcome-dialog .get-started-btn:active {scale:1;}"
};
function j(y, j) {
	e(j, !0), h(y, A);
	let M = () => S(C, "$_", N), [N, P] = _(), F = b(j, "show", 15, !1), I = O("ehagaki_icon.svg");
	function L() {
		F(!1), j.onClose?.();
	}
	T(() => F(), L, !0);
	{
		let e = (e) => {
			var t = i(), o = m(t);
			{
				let e = (e, t) => {
					w(e, u(() => (t?.()).props, {
						variant: "primary",
						shape: "square",
						className: "get-started-btn",
						children: (e, t) => {
							a();
							var i = l();
							f((e) => r(i, e), [() => M()("welcomeDialog.get_started")]), n(e, i);
						},
						$$slots: { default: !0 }
					}));
				};
				s(o, () => D, (t, n) => {
					n(t, {
						child: e,
						$$slots: { child: !0 }
					});
				});
			}
			n(e, t);
		}, t = c(() => M()("welcomeDialog.title")), h = c(() => M()("welcomeDialog.description"));
		E(y, {
			onOpenChange: (e) => !e && L(),
			get title() {
				return x(t);
			},
			get description() {
				return x(h);
			},
			contentClass: "welcome-dialog",
			initialFocus: "content",
			get open() {
				return F();
			},
			set open(e) {
				F(e);
			},
			footer: e,
			children: (e, t) => {
				var i = k(), a = p(i), s = p(a), c = g(s, 2), l = v(c, !0);
				o(a);
				var u = g(a, 2), m = v(u, !0), h = g(u, 2), _ = v(h, !0);
				o(i), f((e, t, n) => {
					d(s, "src", I), r(l, e), r(m, t), r(_, n);
				}, [
					() => M()("welcomeDialog.title"),
					() => M()("welcomeDialog.description"),
					() => M()("welcomeDialog.features")
				]), n(e, i);
			},
			$$slots: {
				footer: !0,
				default: !0
			}
		});
	}
	t(), P();
}
export { j as default };
