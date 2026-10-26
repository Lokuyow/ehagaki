import { At as e, B as t, Ct as n, G as r, M as i, U as a, W as o, a as s, at as c, ct as l, dt as u, et as d, k as f, kt as p, lt as m, o as h, q as g, r as _, s as v, ut as y, v as b, wt as x, yt as S } from "./index-client-Bdka-Daw.js";
import { pt as C } from "./LoadingPlaceholder-j1_vRYno.js";
import { c as w } from "./appUtils-C7IXsQBk.js";
import { t as T } from "./useDialogHistory.svelte-Bf7sbISs.js";
import { t as E } from "./DialogWrapper-B6dIEHnd.js";
import { t as D } from "./dialog-close-BqMvQbkH.js";
import { at as O } from "./App-CxNETzG6.js";
// D:/ドキュメント/GitHub/ehagaki/src/components/WelcomeDialog.svelte
var k = r("<div class=\"welcome-content svelte-10qljse\"><div class=\"title-section svelte-10qljse\"><img alt=\"ehagaki icon\" class=\"site-icon svelte-10qljse\"/> <h2 class=\"svelte-10qljse\"> </h2></div> <p class=\"svelte-10qljse\"> </p> <pre class=\"features svelte-10qljse\"> </pre></div>"), A = {
	hash: "svelte-10qljse",
	code: ".welcome-content.svelte-10qljse {text-align:center;}.title-section.svelte-10qljse {display:flex;align-items:center;justify-content:center;gap:8px;margin:20px 0 38px 0;}.site-icon.svelte-10qljse {width:38px;height:38px;}h2.svelte-10qljse {color:var(--text-light);margin-bottom:1rem;margin:0;}p.svelte-10qljse {font-size:1.0625rem;margin-bottom:1.5rem;line-height:1.6;}.features.svelte-10qljse {text-align:start;white-space:pre-line;margin-bottom:1rem;padding-inline-start:1rem;border-radius:8px;line-height:1.6;}.welcome-dialog .get-started-btn {width:100%;height:50px;font-size:1.0625rem;}.welcome-dialog .get-started-btn:active {scale:1;}"
};
function j(r, j) {
	x(j, !0), f(r, A);
	let M = () => v(C, "$_", N), [N, P] = h(), F = _(j, "show", 15, !1), I = O("ehagaki_icon.svg");
	function L() {
		F(!1), j.onClose?.();
	}
	T(() => F(), L, !0);
	{
		let n = (e) => {
			var n = o(), r = m(n);
			{
				let e = (e, n) => {
					w(e, s(() => (n?.()).props, {
						variant: "primary",
						shape: "square",
						className: "get-started-btn",
						children: (e, n) => {
							p();
							var r = g();
							c((e) => t(r, e), [() => M()("welcomeDialog.get_started")]), a(e, r);
						},
						$$slots: { default: !0 }
					}));
				};
				i(r, () => D, (t, n) => {
					n(t, {
						child: e,
						$$slots: { child: !0 }
					});
				});
			}
			a(e, n);
		}, f = S(() => M()("welcomeDialog.title")), h = S(() => M()("welcomeDialog.description"));
		E(r, {
			onOpenChange: (e) => !e && L(),
			get title() {
				return d(f);
			},
			get description() {
				return d(h);
			},
			contentClass: "welcome-dialog",
			initialFocus: "content",
			get open() {
				return F();
			},
			set open(e) {
				F(e);
			},
			footer: n,
			children: (n, r) => {
				var i = k(), o = l(i), s = l(o), d = u(s, 2), f = y(d, !0);
				e(o);
				var p = u(o, 2), m = y(p, !0), h = u(p, 2), g = y(h, !0);
				e(i), c((e, n, r) => {
					b(s, "src", I), t(f, e), t(m, n), t(g, r);
				}, [
					() => M()("welcomeDialog.title"),
					() => M()("welcomeDialog.description"),
					() => M()("welcomeDialog.features")
				]), a(n, i);
			},
			$$slots: {
				footer: !0,
				default: !0
			}
		});
	}
	n(), P();
}
export { j as default };
