import { A as e, Et as t, G as n, K as r, Mt as i, N as a, Tt as o, V as s, W as c, Y as l, a as u, dt as d, ft as f, jt as p, nt as m, o as h, pt as g, r as _, s as v, st as y, ut as b, xt as x, y as S } from "./index-client-XkLzkVYC.js";
import { pt as C } from "./LoadingPlaceholder-lit91akO.js";
import { s as w } from "./appUtils-BRia-Jm6.js";
import { t as T } from "./useDialogHistory.svelte-BgJftJRE.js";
import { t as E } from "./DialogWrapper-DOH4rn3S.js";
import { t as D } from "./dialog-close-erjPpz45.js";
import { nt as O } from "./App-D7-eoDXE.js";
// D:/ドキュメント/GitHub/ehagaki/src/components/WelcomeDialog.svelte
var k = r("<div class=\"welcome-content svelte-10qljse\"><div class=\"title-section svelte-10qljse\"><img alt=\"ehagaki icon\" class=\"site-icon svelte-10qljse\"/> <h2 class=\"svelte-10qljse\"> </h2></div> <p class=\"svelte-10qljse\"> </p> <pre class=\"features svelte-10qljse\"> </pre></div>"), A = {
	hash: "svelte-10qljse",
	code: ".welcome-content.svelte-10qljse {text-align:center;}.title-section.svelte-10qljse {display:flex;align-items:center;justify-content:center;gap:8px;margin:20px 0 38px 0;}.site-icon.svelte-10qljse {width:38px;height:38px;}h2.svelte-10qljse {color:var(--text-light);margin-bottom:1rem;margin:0;}p.svelte-10qljse {font-size:1.0625rem;margin-bottom:1.5rem;line-height:1.6;}.features.svelte-10qljse {text-align:start;white-space:pre-line;margin-bottom:1rem;padding-inline-start:1rem;border-radius:8px;line-height:1.6;}.welcome-dialog .get-started-btn {width:100%;height:50px;font-size:1.0625rem;}.welcome-dialog .get-started-btn:active {scale:1;}"
};
function j(r, j) {
	t(j, !0), e(r, A);
	let M = () => v(C, "$_", N), [N, P] = h(), F = _(j, "show", 15, !1), I = O("ehagaki_icon.svg");
	function L() {
		F(!1), j.onClose?.();
	}
	T(() => F(), L, !0);
	{
		let e = (e) => {
			var t = n(), r = d(t);
			{
				let e = (e, t) => {
					w(e, u(() => (t?.()).props, {
						variant: "primary",
						shape: "square",
						className: "get-started-btn",
						children: (e, t) => {
							p();
							var n = l();
							y((e) => s(n, e), [() => M()("welcomeDialog.get_started")]), c(e, n);
						},
						$$slots: { default: !0 }
					}));
				};
				a(r, () => D, (t, n) => {
					n(t, {
						child: e,
						$$slots: { child: !0 }
					});
				});
			}
			c(e, t);
		}, t = x(() => M()("welcomeDialog.title")), o = x(() => M()("welcomeDialog.description"));
		E(r, {
			onOpenChange: (e) => !e && L(),
			get title() {
				return m(t);
			},
			get description() {
				return m(o);
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
				var n = k(), r = b(n), a = b(r), o = g(a, 2), l = f(o, !0);
				i(r);
				var u = g(r, 2), d = f(u, !0), p = g(u, 2), m = f(p, !0);
				i(n), y((e, t, n) => {
					S(a, "src", I), s(l, e), s(d, t), s(m, n);
				}, [
					() => M()("welcomeDialog.title"),
					() => M()("welcomeDialog.description"),
					() => M()("welcomeDialog.features")
				]), c(e, n);
			},
			$$slots: {
				footer: !0,
				default: !0
			}
		});
	}
	o(), P();
}
export { j as default };
