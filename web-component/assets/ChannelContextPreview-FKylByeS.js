import { B as e, Dt as t, Et as n, G as r, H as i, K as a, Nt as o, St as s, _t as c, ct as l, dt as u, ft as d, j as f, mt as p, o as m, pt as h, q as g, r as _, rt as v, s as y, yt as b } from "./index-client-DEFG3Gqk.js";
import { Z as x, t as S } from "./LoadingPlaceholder-YrD8D_td.js";
import { t as C } from "./purify.es-M7btVo5y.js";
import { q as w } from "./App-CW2Ynbk9.js";
import { t as T } from "./ChannelPicture-QKSp9ZxQ.js";
// D:/ドキュメント/GitHub/ehagaki/src/components/ChannelContextPreview.svelte
var E = g("<!> <span class=\"channel-name svelte-xl8smc\"> </span> <!>", 1), D = g("<p class=\"about-text svelte-xl8smc\"> </p>"), O = g("<dl class=\"meta-list svelte-xl8smc\"><div class=\"meta-row svelte-xl8smc\"><dt class=\"svelte-xl8smc\"> </dt> <dd class=\"svelte-xl8smc\"> </dd></div></dl>"), k = g("<p class=\"metadata-status svelte-xl8smc\"> </p>"), A = g("<!> <!> <!>", 1), j = {
	hash: "svelte-xl8smc",
	code: ".channel-context-preview {--preview-meta-gap: 8px;--preview-content-display: grid;--preview-content-gap: 10px;--preview-content-padding: 12px 20px 14px;}.channel-context-preview .channel-loading-inline {width:auto;flex:0 1 auto;justify-content:flex-start;flex-wrap:nowrap;}.channel-context-preview .channel-refreshing-inline {width:auto;flex:0 1 auto;justify-content:flex-start;flex-wrap:nowrap;font-size:0.82rem;}\n            .channel-context-preview .channel-loading-inline .placeholder-text\n         {padding:0;white-space:nowrap;}.channel-context-preview .channel-icon {mask-image:var(--ehagaki-icon-666f72756d5f323464705f3030303030305f46494c4c315f776768743430305f47524144305f6f70737a32342e737667);}.channel-name.svelte-xl8smc {min-width:0;color:var(--text-light);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}.channel-context-preview .channel-loading-block {width:100%;padding:0;}.channel-context-preview .channel-picture {width:42px;height:42px;object-fit:cover;background:var(--dialog-bg);flex-shrink:0;}.about-text.svelte-xl8smc {margin:0;white-space:pre-wrap;line-height:1.45;}.metadata-status.svelte-xl8smc {margin:0;color:var(--text-muted);font-size:0.86rem;}.meta-list.svelte-xl8smc {display:grid;gap:8px;margin:0;}.meta-row.svelte-xl8smc {display:grid;gap:4px;}.meta-row.svelte-xl8smc dt:where(.svelte-xl8smc) {font-size:0.82rem;color:var(--text-muted);}.meta-row.svelte-xl8smc dd:where(.svelte-xl8smc) {margin:0;white-space:pre-wrap;overflow-wrap:anywhere;}"
};
function M(g, M) {
	t(M, !0), f(g, j);
	let N = () => y(x, "$_", P), [P, F] = m(), I = _(M, "runtime", 19, () => ({
		phase: "ready",
		quality: null,
		source: null
	})), L = _(M, "pictureCacheEligible", 3, !1), R = b(!1), z = s(() => I().phase === "loading"), B = s(() => I().phase === "refreshing"), V = s(() => I().phase === "refresh-failed" ? N()("channelComposer.refresh_failed") : I().phase === "unavailable" ? N()("channelComposer.unavailable") : ""), H = s(() => M.channel.name?.trim() || `ID: ${M.channel.eventId}`), U = s(() => M.channel.about ? C.sanitize(M.channel.about, {
		ALLOWED_TAGS: [],
		ALLOWED_ATTR: []
	}) : ""), W = s(() => (M.channel.channelRelays ?? []).join("\n")), G = s(() => v(z) || v(B) || !!v(V) || !!v(U) || !!M.channel.picture || (M.channel.channelRelays?.length ?? 0) > 0), K = s(() => v(G) ? v(R) ? N()("channelComposer.collapse") : N()("channelComposer.expand") : N()("channelComposer.selected_label"));
	function q() {
		v(G) && c(R, !v(R));
	}
	function J() {
		M.onClear(), c(R, !1);
	}
	{
		let t = (t) => {
			var n = a(), o = d(n), c = (e) => {
				{
					let t = s(() => N()("channelComposer.loading"));
					S(e, {
						showLoader: !0,
						get text() {
							return v(t);
						},
						customClass: "channel-loading-inline"
					});
				}
			}, u = (t) => {
				var n = E(), a = d(n), o = (e) => {
					T(e, {
						get eventId() {
							return M.channel.eventId;
						},
						get pictureUrl() {
							return M.channel.picture;
						},
						get cacheEligible() {
							return L();
						},
						get alt() {
							return v(H);
						},
						className: "channel-picture"
					});
				};
				e(a, (e) => {
					M.channel.picture && e(o);
				});
				var c = p(a, 2), u = h(c, !0), f = p(c, 2), m = (e) => {
					{
						let t = s(() => N()("channelComposer.refreshing"));
						S(e, {
							showLoader: !0,
							get text() {
								return v(t);
							},
							customClass: "channel-refreshing-inline"
						});
					}
				};
				e(f, (e) => {
					v(B) && e(m);
				}), l(() => i(u, v(H))), r(t, n);
			};
			e(o, (e) => {
				v(z) ? e(c) : e(u, -1);
			}), r(t, n);
		}, n = (t) => {
			var n = a(), c = d(n), f = (e) => {
				{
					let t = s(() => N()("channelComposer.loading"));
					S(e, {
						showLoader: !0,
						get text() {
							return v(t);
						},
						customClass: "channel-loading-block"
					});
				}
			}, m = (t) => {
				var n = A(), a = d(n), s = (e) => {
					var t = D(), n = h(t, !0);
					l(() => i(n, v(U))), r(e, t);
				};
				e(a, (e) => {
					v(U) && e(s);
				});
				var c = p(a, 2), f = (e) => {
					var t = O(), n = u(t), a = u(n), s = h(a, !0), c = p(a, 2), d = h(c, !0);
					o(n), o(t), l((e) => {
						i(s, e), i(d, v(W));
					}, [() => N()("channelComposer.relays_label")]), r(e, t);
				};
				e(c, (e) => {
					v(W) && e(f);
				});
				var m = p(c, 2), g = (e) => {
					var t = k(), n = h(t, !0);
					l(() => i(n, v(V))), r(e, t);
				};
				e(m, (e) => {
					v(V) && e(g);
				}), r(t, n);
			};
			e(c, (e) => {
				v(z) ? e(f) : e(m, -1);
			}), r(t, n);
		}, c = s(() => N()("channelComposer.selected_label")), f = s(() => N()("channelComposer.clear"));
		w(g, {
			previewClass: "channel-context-preview",
			modeIconClass: "channel-icon",
			get modeLabel() {
				return v(c);
			},
			get expanded() {
				return v(R);
			},
			get canToggleExpand() {
				return v(G);
			},
			get toggleAriaLabel() {
				return v(K);
			},
			get clearAriaLabel() {
				return v(f);
			},
			onToggle: q,
			onClear: J,
			meta: t,
			content: n,
			$$slots: {
				meta: !0,
				content: !0
			}
		});
	}
	n(), F();
}
export { M as default };
