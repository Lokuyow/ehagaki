import { At as e, B as t, G as n, J as r, M as i, Tt as a, U as o, W as s, a as c, bt as l, dt as u, ft as d, jt as f, k as p, lt as m, o as h, ot as g, r as _, s as v, tt as y, ut as b, v as x, wt as S } from "./index-client-57Odq85c.js";
import { pt as C } from "./LoadingPlaceholder-DK5Hrsgb.js";
import { c as w } from "./appUtils-CwuZyofa.js";
import { t as T } from "./useDialogHistory.svelte-BddVYV4P.js";
import { t as E } from "./DialogWrapper-CvCDxqOJ.js";
import { t as D } from "./dialog-close-BfZcAfRJ.js";
import { at as O } from "./App-BWEIk7fu.js";
// D:/ドキュメント/GitHub/ehagaki/src/components/WelcomeDialog.svelte
var k = n("<div class=\"welcome-content svelte-10qljse\"><div class=\"title-section svelte-10qljse\"><img alt=\"ehagaki icon\" class=\"site-icon svelte-10qljse\"/> <h2 class=\"svelte-10qljse\"> </h2></div> <p class=\"svelte-10qljse\"> </p> <pre class=\"features svelte-10qljse\"> </pre></div>"), A = {
	hash: "svelte-10qljse",
	code: ".welcome-content.svelte-10qljse {text-align:center;}.title-section.svelte-10qljse {display:flex;align-items:center;justify-content:center;gap:8px;margin:20px 0 38px 0;}.site-icon.svelte-10qljse {width:38px;height:38px;}h2.svelte-10qljse {color:var(--text-light);margin-bottom:1rem;margin:0;}p.svelte-10qljse {font-size:1.0625rem;margin-bottom:1.5rem;line-height:1.6;}.features.svelte-10qljse {text-align:start;white-space:pre-line;margin-bottom:1rem;padding-inline-start:1rem;border-radius:8px;line-height:1.6;}.welcome-dialog .get-started-btn {width:100%;height:50px;font-size:1.0625rem;}.welcome-dialog .get-started-btn:active {scale:1;}"
};
function j(n, j) {
	a(j, !0), p(n, A);
	let M = () => v(C, "$_", N), [N, P] = h(), F = _(j, "show", 15, !1), I = O("ehagaki_icon.svg");
	function L() {
		F(!1), j.onClose?.();
	}
	T(() => F(), L, !0);
	{
		let a = (n) => {
			var a = s(), l = b(a);
			{
				let n = (n, i) => {
					w(n, c(() => (i?.()).props, {
						variant: "primary",
						shape: "square",
						className: "get-started-btn",
						children: (n, i) => {
							e();
							var a = r();
							g((e) => t(a, e), [() => M()("welcomeDialog.get_started")]), o(n, a);
						},
						$$slots: { default: !0 }
					}));
				};
				i(l, () => D, (e, t) => {
					t(e, {
						child: n,
						$$slots: { child: !0 }
					});
				});
			}
			o(n, a);
		}, p = l(() => M()("welcomeDialog.title")), h = l(() => M()("welcomeDialog.description"));
		E(n, {
			onOpenChange: (e) => !e && L(),
			get title() {
				return y(p);
			},
			get description() {
				return y(h);
			},
			contentClass: "welcome-dialog",
			initialFocus: "content",
			get open() {
				return F();
			},
			set open(e) {
				F(e);
			},
			footer: a,
			children: (e, n) => {
				var r = k(), i = m(r), a = m(i), s = d(a, 2), c = u(s, !0);
				f(i);
				var l = d(i, 2), p = u(l, !0), h = d(l, 2), _ = u(h, !0);
				f(r), g((e, n, r) => {
					x(a, "src", I), t(c, e), t(p, n), t(_, r);
				}, [
					() => M()("welcomeDialog.title"),
					() => M()("welcomeDialog.description"),
					() => M()("welcomeDialog.features")
				]), o(e, r);
			},
			$$slots: {
				footer: !0,
				default: !0
			}
		});
	}
	S(), P();
}
export { j as default };
