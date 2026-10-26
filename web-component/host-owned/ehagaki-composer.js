import { N as e, j as t } from "./assets/index-client-CTw9cD2v.js";
import { r as n, t as r } from "./assets/appRuntimeEnvironment-BvtUCHcA.js";
import { t as i } from "./assets/embedComposerContextValidation-CVqyj2Cc.js";
// D:/ドキュメント/GitHub/ehagaki/src/web-component/types.ts
var a = "ehagaki-composer", o = 1, s = Symbol.for("ehagaki-composer.distribution");
function c(e, t) {
	let n = globalThis, r = n[s];
	if (r && r !== e) throw Error(`Cannot import the ${e} eHagaki Composer distribution after ${r} in the same document.`);
	n[s] = e;
	let i = customElements.get(a);
	if (!i) customElements.define(a, t);
	else if (i !== t) throw Error("ehagaki-composer is already defined by a different distribution.");
}
// D:/ドキュメント/GitHub/ehagaki/src/app.css?inline
var l = ":root,:host{--setting-label-icon-gap: 16px;--app-root-height: 100%;--app-root-top: 0px;--app-root-overflow-y: visible;--app-main-height: 100svh;--app-body-position: static;--app-body-inset: auto;--app-body-width: auto;--app-overlay-position: fixed;--app-overscroll-behavior: auto;--footer-height: 66px;--footer-bottom: 0px;--keyboard-height: 0px;--mobile-dialog-viewport-top: 0px;--mobile-dialog-viewport-height: 100dvh;--mobile-dialog-center-y: 43dvh;--keyboard-button-bar-height: 50px;--keyboard-button-bar-bottom: 66px;--main-content-keyboard-adjustment: var(--keyboard-height);--reason-input-base-height: 50px;--reason-input-height: 0px;--reason-input-bottom: 116px;--main-content-top-spacing: 6px;--composer-bottom-reserved-height: 116px;--accent-color-default: hsl(152, 74%, 43%);--accent-color: var( --accent-color-forced, var(--accent-color-user, var(--accent-color-external-default, var(--accent-color-default))) );--accent-color-custom: var( --accent-color-forced, var(--accent-color-user, var(--accent-color-external-default)) );--accent-color-custom-inner: color-mix(in srgb, var(--accent-color-custom) 15%, white 85%);--accent-color-custom-face: color-mix(in srgb, var(--accent-color-custom) 40%, black 60%);--base-color: var( --base-color-forced, var(--base-color-user, var(--base-color-external-default)) );--theme: var(--accent-color);--text-black: hsl(0, 0%, 24%);--nostr-bg: hsl(270, 100%, 98%);--yellow: hsl(50, 100%, 50%);--danger: hsl(0, 84%, 60%);--darker: rgba(0, 0, 0, .8);--dark-gray: hsl(0, 0%, 66%);--light-gray: hsl(0, 0%, 83%);--base-color-surface-bg-light: color-mix(in srgb, var(--base-color) 18%, hsl(0, 0%, 97%));--base-color-surface-bg-dark: color-mix(in srgb, var(--base-color) 18%, hsl(0, 0%, 12%));--base-color-surface-editor-light: color-mix(in srgb, var(--base-color) 6%, hsl(0, 0%, 100%));--base-color-surface-editor-dark: color-mix(in srgb, var(--base-color) 9%, hsl(0, 0%, 22%));--base-color-surface-footer-light: color-mix(in srgb, var(--base-color) 34%, hsl(0, 0%, 86%));--base-color-surface-footer-dark: color-mix(in srgb, var(--base-color) 22%, hsl(0, 0%, 10%));--surface-bg: light-dark( var(--base-color-surface-bg-light, color-mix(in srgb, hsl(0, 0%, 94%) 18%, hsl(0, 0%, 94%))), var(--base-color-surface-bg-dark, color-mix(in srgb, hsl(0, 0%, 12%) 18%, hsl(0, 0%, 12%))) );--surface-input: light-dark( color-mix(in srgb, var(--base-color, hsl(0, 0%, 100%)) 14%, hsl(0, 0%, 100%)), color-mix(in srgb, var(--base-color, hsl(0, 0%, 19%)) 14%, hsl(0, 0%, 19%)) );--surface-editor: light-dark( var(--base-color-surface-editor-light, var(--surface-input)), var(--base-color-surface-editor-dark, var(--surface-input)) );--surface-footer: light-dark( var(--base-color-surface-footer-light, color-mix(in srgb, hsl(0, 0%, 82%) 22%, hsl(0, 0%, 82%))), var(--base-color-surface-footer-dark, color-mix(in srgb, hsl(0, 0%, 10%) 22%, hsl(0, 0%, 10%))) );--surface-buttonbar: light-dark( color-mix(in srgb, var(--base-color, hsl(0, 0%, 91%)) 20%, hsl(0, 0%, 91%)), color-mix(in srgb, var(--base-color, hsl(0, 0%, 28%)) 20%, hsl(0, 0%, 28%)) );--base-color-surface-button: color-mix(in srgb, var(--base-color) 24%, white);--surface-button: light-dark( var(--base-color-surface-button, hsl(0, 0%, 92%)), color-mix(in srgb, var(--base-color, hsl(0, 0%, 25%)) 18%, hsl(0, 0%, 25%)) );--surface-button-border: light-dark( color-mix(in srgb, var(--base-color, hsl(0, 0%, 75%)) 24%, hsl(0, 0%, 75%)), color-mix(in srgb, var(--base-color, hsl(0, 0%, 30%)) 24%, hsl(0, 0%, 30%)) );--surface-button-preview-action: light-dark( color-mix(in srgb, var(--base-color, hsl(0, 0%, 74%)) 22%, hsl(0, 0%, 74%)), color-mix(in srgb, var(--base-color, hsl(0, 0%, 36%)) 22%, hsl(0, 0%, 36%)) );--surface-border: light-dark( color-mix(in srgb, var(--base-color, var(--light-gray)) 24%, var(--light-gray)), color-mix(in srgb, var(--base-color, dimgray) 24%, dimgray) );--surface-border-hr: light-dark( color-mix(in srgb, var(--base-color, hsl(0, 0%, 84%)) 20%, hsl(0, 0%, 84%)), color-mix(in srgb, var(--base-color, hsl(0, 0%, 30%)) 20%, hsl(0, 0%, 30%)) );--surface-border-hr-light: light-dark( color-mix(in srgb, var(--base-color, hsl(0, 0%, 92%)) 16%, hsl(0, 0%, 92%)), color-mix(in srgb, var(--base-color, hsl(0, 0%, 20%)) 16%, hsl(0, 0%, 20%)) );--surface-dialog: light-dark( color-mix(in srgb, var(--base-color, white) 14%, white), color-mix(in srgb, var(--base-color, hsl(0, 0%, 14%)) 14%, hsl(0, 0%, 14%)) );--surface-window: light-dark( color-mix(in srgb, var(--base-color, hsl(0, 0%, 95%)) 14%, hsl(0, 0%, 95%)), color-mix(in srgb, var(--base-color, hsl(0, 0%, 14%)) 14%, hsl(0, 0%, 14%)) );--bg: var(--surface-bg);--bg-input: var(--surface-input);--bg-footer: var(--surface-footer);--bg-translucent: light-dark(#EDEDEDcc, #212121cc);--bg-buttonbar: var(--surface-buttonbar);--base-color-footer-buttonbar-light: var(--base-color-surface-bg-light);--footer-buttonbar-bg: light-dark( var(--base-color-footer-buttonbar-light, var(--bg-buttonbar)), var(--bg-buttonbar) );--btn-bg: var(--surface-button);--btn-bg2: light-dark(color-mix(in srgb, var(--btn-bg), black 6%), color-mix(in srgb, var(--btn-bg), white 10%));--btn-bg3: light-dark(color-mix(in srgb, var(--btn-bg), black 11%), color-mix(in srgb, var(--btn-bg), white 20%));--btn-border: var(--surface-button-border);--btn-hover-bg: light-dark(rgba(50, 50, 50, .12), rgba(255, 255, 255, .12));--btn-post-preview-action: var(--surface-button-preview-action);--border: var(--surface-border);--border-hr: var(--surface-border-hr);--border-hr-light: var(--surface-border-hr-light);--semantic-text: light-dark(hsl(0, 0%, 24%), hsl(0, 0%, 90%));--text: var(--semantic-text);--text-light: light-dark(hsl(0, 0%, 46%), hsl(0, 0%, 75%));--text-muted: light-dark(hsl(0, 0%, 60%), hsl(0, 0%, 55%));--text-red: light-dark(hsl(0, 99%, 45%), hsl(0, 99%, 69%));--text-r: light-dark(#e6e6e6, #3D3D3D);--semantic-link: light-dark(#1a0dab, #99c3ff);--link: var(--semantic-link);--link-visited: light-dark(#681da8, #c58af9);--dialog-bg: var(--surface-dialog);--dialog-bg2: light-dark(color-mix(in srgb, var(--dialog-bg), black 6%), color-mix(in srgb, var(--dialog-bg), white 10%));--dialog-bg3: light-dark(color-mix(in srgb, var(--dialog-bg), black 11%), color-mix(in srgb, var(--dialog-bg), white 16%));--dialog-bg-overlay: light-dark(rgba(0, 0, 0, .6), rgba(0, 0, 0, .8));--window: var(--surface-window);--svg: light-dark(hsl(0, 0%, 36%), hsl(0, 0%, 90%));--svg-light: var(--text-light);--shadow: light-dark(rgba(0, 0, 0, .1), rgba(255, 255, 255, .1));--hagaki: light-dark(hsl(0, 77%, 56%), hsl(5, 99%, 71%));--hashtag-text: light-dark(#106BC7, #65B1FC);--hashtag-bg: light-dark(#106BC71a, #65B1FC1a);--toggle-bg: var(--svg);--toggle-circle: var(--dialog-bg);--message-success-bg: hsl(200, 39%, 96%);--message-success-color: hsl(210, 60%, 40%);--message-success-border: hsl(210, 48%, 70%);--message-error-bg: hsl(351, 99%, 96%);--message-error-color: hsl(351, 99%, 32%);--message-error-border: hsl(351, 99%, 70%);--message-warning-bg: hsl(38, 100%, 95%);--message-warning-color: hsl(30, 90%, 35%);--message-warning-border: hsl(38, 90%, 65%);--message-flavor-bg: hsl(125, 39%, 94%);--message-flavor-color: hsl(123, 46%, 32%);--message-flavor-border: hsl(125, 39%, 70%);--message-tips-bg: hsl(270, 50%, 96%);--message-tips-color: hsl(270, 55%, 38%);--message-tips-border: hsl(270, 45%, 70%);font-family:system-ui,-apple-system,Segoe UI,Hiragino Sans,Hiragino Kaku Gothic ProN,Meiryo,sans-serif;font-weight:400;color-scheme:light dark;color:var(--text);background-color:var(--bg);font-synthesis:none;text-rendering:optimizeLegibility;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}*{font-family:inherit;box-sizing:border-box}html,body,#app{height:var(--app-root-height);overflow-x:hidden;overflow-y:var(--app-root-overflow-y);overscroll-behavior-y:var(--app-overscroll-behavior)}#app{position:var(--app-body-position);top:var(--app-root-top);left:0;right:0;width:var(--app-body-width)}body{margin:0;position:var(--app-body-position);inset:var(--app-body-inset);width:var(--app-body-width);color:var(--text);background-color:var(--bg);overflow-wrap:anywhere;word-break:auto-phrase;line-break:strict}a{--link-hover-color: light-dark(color-mix(in srgb, var(--link), black 30%), color-mix(in srgb, var(--link), white 30%));font-weight:500;color:var(--link);-webkit-tap-highlight-color:transparent;text-decoration:none;border-radius:6px}a:active{opacity:1}h2,h3{color:var(--text-light)}.card{padding:2em}button,[role=button],select{display:inline-flex;align-items:center;justify-content:center;height:100%;padding:0;font-size:1rem;font-weight:500;line-height:normal;color:var(--text);background-color:inherit;border:none;cursor:pointer;text-decoration:none;-webkit-user-select:none;user-select:none;-webkit-tap-highlight-color:transparent;--button-selected-bg: light-dark(color-mix(in srgb, var(--btn-bg), black 18%), color-mix(in srgb, var(--btn-bg), white 22%));--button-hover-bg: light-dark(color-mix(in srgb, var(--btn-bg), black 4%), color-mix(in srgb, var(--btn-bg), white 5%));--button-hover-color: light-dark(color-mix(in srgb, var(--text), black 40%), color-mix(in srgb, var(--text), white 50%));--button-selected-hover-bg: light-dark(color-mix(in srgb, var(--btn-bg), black 20%), color-mix(in srgb, var(--btn-bg), white 30%));--button-selected-hover-color: light-dark(color-mix(in srgb, var(--text), black 20%), color-mix(in srgb, var(--text), white 30%))}:is(button,[role=button],select):disabled{opacity:.3;cursor:not-allowed}:is(button,[role=button],select):disabled.loading{opacity:1}button>*{pointer-events:none}button:active:not(:disabled),[role=button]:active{scale:.98;transition:scale .1s cubic-bezier(0,1,.5,1)}@media(prefers-reduced-motion:reduce){button:active:not(:disabled),[role=button]:active{scale:1;transition:none}}span{-webkit-tap-highlight-color:transparent}select{border-radius:6px}.svg-icon{-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;-webkit-mask-size:contain;mask-size:contain;-webkit-mask-position:center;mask-position:center;background-color:var(--svg);display:inline-block;inline-size:var(--icon-size, 28px);block-size:var(--icon-size, 28px);--icon-hover-color: light-dark(color-mix(in srgb, var(--svg), black 40%), color-mix(in srgb, var(--svg), white 50%));--icon-selected-hover-color: light-dark(color-mix(in srgb, var(--svg), black 20%), color-mix(in srgb, var(--svg), white 30%))}.tooltip-content{--tooltip-padding: 12px;--tooltip-font-size: 1rem;--tooltip-line-height: normal;--tooltip-z-index: 100;--tooltip-max-width: none;background:var(--dialog-bg);color:var(--text);border:1px solid var(--border);border-radius:6px;padding:var(--tooltip-padding);font-size:var(--tooltip-font-size);line-height:var(--tooltip-line-height);z-index:var(--tooltip-z-index);max-width:var(--tooltip-max-width)}.post-preview-tooltip-content{--tooltip-z-index: 10000;z-index:10000!important}:root:is(.light,.dark) button.selected:where(:not(:disabled)),:root:is(.light,.dark) button:where([data-state=active]){background-color:var(--button-selected-bg)}@media(hover:hover)and (pointer:fine){a:hover{text-decoration:underline}:root:is(.light,.dark) button:where(:hover:not(:disabled)),:root:is(.light,.dark) [role=button]:where(:hover:not([aria-disabled=true])),:root:is(.light,.dark) select:where(:hover:not(:disabled)){background-color:var(--button-hover-bg);color:var(--button-hover-color)}:is(:root:is(.light,.dark) button:where(:hover:not(:disabled)),:root:is(.light,.dark) [role=button]:where(:hover:not([aria-disabled=true])),:root:is(.light,.dark) select:where(:hover:not(:disabled))) .svg-icon{background-color:var(--icon-hover-color)}:root:is(.light,.dark) button.selected:where(:hover:not(:disabled)),:root:is(.light,.dark) button:where([data-state=active]:hover:not(:disabled)){background-color:var(--button-selected-hover-bg);color:var(--button-selected-hover-color)}:is(:root:is(.light,.dark) button.selected:where(:hover:not(:disabled)),:root:is(.light,.dark) button:where([data-state=active]:hover:not(:disabled))) .svg-icon{background-color:var(--icon-selected-hover-color)}:root:is(.light,.dark) a:hover{color:var(--link-hover-color)}}.setting-section{display:flex;flex-direction:column}.setting-row{display:flex;flex-direction:row;align-items:stretch;justify-content:space-between;min-height:50px}.setting-label{font-size:1rem;font-weight:500;line-height:1.3;display:flex;align-items:center;justify-content:flex-start;white-space:pre-line}.setting-label-with-icon{display:flex;align-items:center;gap:var(--setting-label-icon-gap);min-width:0}.setting-label-with-icon .setting-label{line-height:24px}.setting-menu-icon{display:inline-block;width:24px;height:24px;flex:0 0 24px;margin-block:1px}.setting-menu-mask-icon{background-color:currentColor;-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;-webkit-mask-position:center;mask-position:center;-webkit-mask-size:contain;mask-size:contain}.setting-control{display:flex;align-items:stretch;justify-content:flex-end;height:auto;margin-block:auto}", u = ".pswp{--pswp-bg: #000;--pswp-placeholder-bg: #222;--pswp-root-z-index: 100000;--pswp-preloader-color: rgba(79, 79, 79, .4);--pswp-preloader-color-secondary: rgba(255, 255, 255, .9);--pswp-icon-color: #fff;--pswp-icon-color-secondary: #4f4f4f;--pswp-icon-stroke-color: #4f4f4f;--pswp-icon-stroke-width: 2px;--pswp-error-text-color: var(--pswp-icon-color)}.pswp{position:fixed;top:0;left:0;width:100%;height:100%;z-index:var(--pswp-root-z-index);display:none;touch-action:none;outline:0;opacity:.003;contain:layout style size;-webkit-tap-highlight-color:rgba(0,0,0,0)}.pswp:focus{outline:0}.pswp *{box-sizing:border-box}.pswp img{max-width:none}.pswp--open{display:block}.pswp,.pswp__bg{transform:translateZ(0);will-change:opacity}.pswp__bg{opacity:.005;background:var(--pswp-bg)}.pswp,.pswp__scroll-wrap{overflow:hidden}.pswp__scroll-wrap,.pswp__bg,.pswp__container,.pswp__item,.pswp__content,.pswp__img,.pswp__zoom-wrap{position:absolute;top:0;left:0;width:100%;height:100%}.pswp__img,.pswp__zoom-wrap{width:auto;height:auto}.pswp--click-to-zoom.pswp--zoom-allowed .pswp__img{cursor:-webkit-zoom-in;cursor:-moz-zoom-in;cursor:zoom-in}.pswp--click-to-zoom.pswp--zoomed-in .pswp__img{cursor:move;cursor:-webkit-grab;cursor:-moz-grab;cursor:grab}.pswp--click-to-zoom.pswp--zoomed-in .pswp__img:active{cursor:-webkit-grabbing;cursor:-moz-grabbing;cursor:grabbing}.pswp--no-mouse-drag.pswp--zoomed-in .pswp__img,.pswp--no-mouse-drag.pswp--zoomed-in .pswp__img:active,.pswp__img{cursor:-webkit-zoom-out;cursor:-moz-zoom-out;cursor:zoom-out}.pswp__container,.pswp__img,.pswp__button,.pswp__counter{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.pswp__item{z-index:1;overflow:hidden}.pswp__hidden{display:none!important}.pswp__content{pointer-events:none}.pswp__content>*{pointer-events:auto}.pswp__error-msg-container{display:grid}.pswp__error-msg{margin:auto;font-size:1em;line-height:1;color:var(--pswp-error-text-color)}.pswp .pswp__hide-on-close{opacity:.005;will-change:opacity;transition:opacity var(--pswp-transition-duration) cubic-bezier(.4,0,.22,1);z-index:10;pointer-events:none}.pswp--ui-visible .pswp__hide-on-close{opacity:1;pointer-events:auto}.pswp__button{position:relative;display:block;width:50px;height:60px;padding:0;margin:0;overflow:hidden;cursor:pointer;background:none;border:0;box-shadow:none;opacity:.85;-webkit-appearance:none;-webkit-touch-callout:none}.pswp__button:hover,.pswp__button:active,.pswp__button:focus{transition:none;padding:0;background:none;border:0;box-shadow:none;opacity:1}.pswp__button:disabled{opacity:.3;cursor:auto}.pswp__icn{fill:var(--pswp-icon-color);color:var(--pswp-icon-color-secondary)}.pswp__icn{position:absolute;top:14px;left:9px;width:32px;height:32px;overflow:hidden;pointer-events:none}.pswp__icn-shadow{stroke:var(--pswp-icon-stroke-color);stroke-width:var(--pswp-icon-stroke-width);fill:none}.pswp__icn:focus{outline:0}div.pswp__img--placeholder,.pswp__img--with-bg{background:var(--pswp-placeholder-bg)}.pswp__top-bar{position:absolute;left:0;top:0;width:100%;height:60px;display:flex;flex-direction:row;justify-content:flex-end;z-index:10;pointer-events:none!important}.pswp__top-bar>*{pointer-events:auto;will-change:opacity}.pswp__button--close{margin-right:6px}.pswp__button--arrow{position:absolute;width:75px;height:100px;top:50%;margin-top:-50px}.pswp__button--arrow:disabled{display:none;cursor:default}.pswp__button--arrow .pswp__icn{top:50%;margin-top:-30px;width:60px;height:60px;background:none;border-radius:0}.pswp--one-slide .pswp__button--arrow{display:none}.pswp--touch .pswp__button--arrow{visibility:hidden}.pswp--has_mouse .pswp__button--arrow{visibility:visible}.pswp__button--arrow--prev{right:auto;left:0}.pswp__button--arrow--next{right:0}.pswp__button--arrow--next .pswp__icn{left:auto;right:14px;transform:scaleX(-1)}.pswp__button--zoom{display:none}.pswp--zoom-allowed .pswp__button--zoom{display:block}.pswp--zoomed-in .pswp__zoom-icn-bar-v{display:none}.pswp__preloader{position:relative;overflow:hidden;width:50px;height:60px;margin-right:auto}.pswp__preloader .pswp__icn{opacity:0;transition:opacity .2s linear;animation:pswp-clockwise .6s linear infinite}.pswp__preloader--active .pswp__icn{opacity:.85}@keyframes pswp-clockwise{0%{transform:rotate(0)}to{transform:rotate(360deg)}}.pswp__counter{height:30px;margin-top:15px;margin-inline-start:20px;font-size:14px;line-height:30px;color:var(--pswp-icon-color);text-shadow:1px 1px 3px var(--pswp-icon-color-secondary);opacity:.85}.pswp--one-slide .pswp__counter{display:none}";
// D:/ドキュメント/GitHub/ehagaki/src/web-component/notificationPort.ts
function d(e) {
	return {
		notifyPostSuccess(t = {}) {
			return e.dispatchSafeEvent("ehagaki-post-success", {
				...t,
				...t.quotedEventIds ? { quotedEventIds: [...t.quotedEventIds] } : {}
			}), !0;
		},
		notifyPostError(t) {
			let n = typeof t == "object" && t?.code ? t.code : "post_failed";
			return e.dispatchSafeEvent("ehagaki-post-error", { code: n }), !0;
		},
		notifyComposerContextApplied() {
			return !0;
		},
		notifyComposerContextError(t) {
			return e.dispatchSafeEvent("ehagaki-initialization-error", {
				code: t.code,
				message: "Composer context could not be applied."
			}), !0;
		},
		notifyComposerContextUpdated(t) {
			return e.dispatchSafeEvent("ehagaki-composer-context-updated", {
				reply: t.reply,
				quotes: [...t.quotes],
				channel: t.channel ?? null
			}), !0;
		},
		notifySettingsApplied() {
			return !0;
		},
		notifySettingsError(t) {
			return e.dispatchSafeEvent("ehagaki-initialization-error", {
				code: t.code,
				message: "Settings could not be applied."
			}), !0;
		}
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/web-component/iconAssets.ts
var f = /--ehagaki-icon-([0-9a-f]+)/g;
function p(e) {
	if (e.length === 0 || e.length % 2 != 0) return null;
	let t = Array.from({ length: e.length / 2 }, (t, n) => String.fromCharCode(Number.parseInt(e.slice(n * 2, n * 2 + 2), 16))).join("");
	return /^[A-Za-z0-9._-]+\.svg$/.test(t) ? t : null;
}
function m(e, t, n) {
	let r = /* @__PURE__ */ new Set();
	for (let t of e.querySelectorAll("style")) for (let e of t.textContent?.matchAll(f) ?? []) r.add(e[0]);
	for (let e of r) {
		let r = p(e.slice(15));
		r && t.style.setProperty(e, `url("${new URL(`icons/${r}`, n).href}")`);
	}
}
// D:/ドキュメント/GitHub/ehagaki/src/web-component/element.ts
var h = null;
function g(e, t) {
	let n = Error(t);
	return n.name = e, n;
}
function _(e, t) {
	let n = Error(t);
	return n.name = e, n;
}
function v(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function y(e) {
	return !v(e) || !Object.hasOwn(e, "preloadedProfiles") ? e : {
		...e,
		preloadedProfiles: i(e.preloadedProfiles)
	};
}
function b(e) {
	if (!v(e)) throw g("initialization_failed", "Invalid settings payload.");
	let t = {
		locale: /* @__PURE__ */ new Set(["ja", "en"]),
		themeMode: /* @__PURE__ */ new Set([
			"system",
			"light",
			"dark"
		]),
		imageQualityLevel: /* @__PURE__ */ new Set([
			"none",
			"low",
			"medium",
			"high"
		]),
		videoQualityLevel: /* @__PURE__ */ new Set([
			"none",
			"low",
			"medium",
			"high"
		]),
		imageCompressionLevel: /* @__PURE__ */ new Set([
			"none",
			"low",
			"medium",
			"high"
		]),
		videoCompressionLevel: /* @__PURE__ */ new Set([
			"none",
			"low",
			"medium",
			"high"
		])
	}, n = /* @__PURE__ */ new Set([
		"clientTagEnabled",
		"quoteNotificationEnabled",
		"replyNotificationEnabled",
		"mediaFreePlacement",
		"showMascot",
		"showFlavorText"
	]), r = /* @__PURE__ */ new Set([
		...Object.keys(t),
		...n,
		"uploadEndpoint"
	]);
	for (let [i, a] of Object.entries(e)) {
		if (!r.has(i)) throw g("initialization_failed", "Invalid settings payload.");
		if (i in t) {
			let e = t[i];
			if (typeof a != "string" || !e.has(a)) throw g("initialization_failed", "Invalid settings payload.");
		} else if (n.has(i) && typeof a != "boolean") throw g("initialization_failed", "Invalid settings payload.");
		else if (i === "uploadEndpoint" && typeof a != "string") throw g("initialization_failed", "Invalid settings payload.");
	}
	return e;
}
function x(e) {
	return e.replaceAll(/:root:is\(\s*\.light\s*,\s*\.dark\s*\)/g, ":host(:is(.light, .dark))").replaceAll(":root", ":host").replace("html,\nbody,\n#app", ":host,\n.ehagaki-web-component-shell").replace("#app {", ".ehagaki-web-component-shell {").replace("body {", ".ehagaki-web-component-shell {");
}
function S() {
	return ":host {\n        display: block;\n        --accent-color-forced: var(--ehagaki-accent-color);\n        --base-color-forced: var(--ehagaki-base-color);\n        --accent-color-external-default: var(--ehagaki-default-accent-color);\n        --base-color-external-default: var(--ehagaki-default-base-color);\n        --bg: var(--ehagaki-background, var(--surface-bg));\n        --text: var(--ehagaki-text, var(--semantic-text));\n        --border: var(--ehagaki-border, var(--surface-border));\n        --link: var(--ehagaki-link, var(--semantic-link));\n        --bg-input: var(--ehagaki-input-background, var(--surface-input));\n        --bg-footer: var(--ehagaki-footer-background, var(--surface-footer));\n        --dialog-bg: var(--ehagaki-dialog-background, var(--surface-dialog));\n        font-family: var(--ehagaki-font-family, system-ui, sans-serif);\n    }\n\n    .ehagaki-web-component-shell {\n        position: relative;\n        container-type: inline-size;\n        background: var(--bg);\n    }\n\n    .ehagaki-web-component-shell,\n    .ehagaki-web-component-app {\n        width: 100%;\n        height: 100%;\n        min-height: 0;\n    }";
}
var C = class extends HTMLElement {
	static get observedAttributes() {
		return ["asset-base", "auto-login"];
	}
	#e = null;
	#t = null;
	#n = null;
	#r = this.createReadyBoundary();
	#i = !1;
	#a = !1;
	#o = null;
	#s = Promise.resolve();
	#c = 0;
	#l = null;
	get editorIsEmpty() {
		return this.#o;
	}
	get assetBase() {
		return this.getAttribute("asset-base");
	}
	set assetBase(e) {
		e === null || e === "" ? this.removeAttribute("asset-base") : this.setAttribute("asset-base", e);
	}
	get autoLogin() {
		return this.hasAttribute("auto-login");
	}
	set autoLogin(e) {
		this.toggleAttribute("auto-login", !!e);
	}
	attributeChangedCallback() {}
	connectedCallback() {
		if (this.onConnectionAttempt(), this.#o = null, this.#a = !1, this.#n) return;
		this.#r.state !== "pending" && (this.#r = this.createReadyBoundary());
		let e = this.#r, t = ++this.#c;
		e.token = t, e.active = !0, this.#i = !0;
		let n = this.getConnectionError();
		if (n) {
			let e = g(n.code, n.message);
			this.fail("initialization_failed", e.message, e);
		} else if (h && h !== this) {
			let e = g("multiple_instances_unsupported", "Only one ehagaki-composer can be connected in a document.");
			this.fail("multiple_instances_unsupported", e.message, e);
		} else h = this, this.#n = this.mountApp(t);
	}
	disconnectedCallback() {
		if (this.#c += 1, this.#r.active = !1, this.#o = null, this.#a = !1, this.onDisconnected(), this.#l?.disconnect(), this.#l = null, h === this && (h = null), this.#t &&= (e(this.#t), null), this.#e = null, this.#n = null, this.#r.state === "pending") {
			this.#r.state = "rejected";
			let e = g("disconnected", "Component was disconnected before it became ready.");
			this.#r.reason = e, this.#r.reject(e);
		}
	}
	whenReady() {
		return this.#r.promise;
	}
	setContext(e) {
		let t = y(e);
		return this.enqueue(async () => {
			await this.requireApp().setEmbedContext(t);
		});
	}
	setSettings(e) {
		return this.enqueue(async () => this.requireApp().setEmbedSettings(b(e)));
	}
	focusEditor() {
		return this.enqueue(async () => {
			this.requireApp().focusEditor();
		});
	}
	blurEditor() {
		return this.enqueue(async () => {
			this.requireApp().blurEditor();
		});
	}
	dispatchSafeEvent(e, t) {
		return this.dispatchEvent(new CustomEvent(e, {
			bubbles: !0,
			composed: !0,
			detail: t
		}));
	}
	createReadyBoundary() {
		let e, t;
		return {
			promise: new Promise((n, r) => {
				e = n, t = r;
			}),
			resolve: e,
			reject: t,
			state: "pending",
			token: null,
			active: !1
		};
	}
	async mountApp(e) {
		try {
			let i = this.shadowRoot ?? this.attachShadow({ mode: "open" });
			i.replaceChildren();
			let a = document.createElement("style");
			a.textContent = `${x(l)}\n${u}\n${S()}`;
			let o = document.createElement("div");
			o.className = "ehagaki-web-component-shell";
			let s = document.createElement("div");
			s.className = "ehagaki-web-component-app";
			let c = document.createElement("div");
			c.className = "ehagaki-web-component-overlays ehagaki-app-root", o.append(s, c), i.append(a, o);
			let f = new URL(this.assetBase ?? "./", import.meta.url);
			this.#l = new MutationObserver(() => {
				m(i, o, f);
			}), this.#l.observe(i, {
				childList: !0,
				subtree: !0
			});
			let { installEhagakiDatabaseGateForRuntime: p } = await import("./assets/ehagakiDbPageGate-DMgPLAun.js");
			r({
				storage: n(window.localStorage),
				window,
				document,
				domRoot: i,
				styleTarget: o,
				layoutTarget: o,
				overlayTarget: c,
				themeTarget: this,
				layoutMode: "container",
				runtimeKind: "web-component",
				assetBase: f,
				serviceWorkerEnabled: !1,
				externalInputEnabled: !1,
				historyEnabled: !1,
				localNsecAuthEnabled: !1,
				autoLoginNip07Enabled: this.isAutoLoginNip07Enabled()
			}), await p(f);
			let { default: h } = await this.loadApp().catch(() => this.loadApp());
			if (!this.isConnected || e !== this.#c || (this.#t = t(h, {
				target: s,
				props: {
					notificationPort: d(this),
					onInitialized: () => {
						this.#u(e);
					},
					...this.getAdditionalMountProps(e),
					onEditorEmptyChange: (t) => {
						this.#d(e, t);
					}
				}
			}), m(i, o, f), this.#e = this.#t, !this.isConnected || e !== this.#c)) return;
		} catch (t) {
			if (!this.isConnected || e !== this.#c) return;
			let n = g("initialization_failed", "eHagaki Composer could not be initialized.");
			n.cause = t, this.fail("initialization_failed", "eHagaki Composer could not be initialized.", n);
		}
	}
	requireApp() {
		if (!this.#e) throw g("initialization_failed", "eHagaki Composer is not ready.");
		return this.#e;
	}
	requireCurrentReadyApp() {
		let e = this.#r;
		if (e.state === "rejected") throw e.reason ?? g("initialization_failed", "eHagaki Composer could not be initialized.");
		if (!this.isConnected) throw this.#i ? g("disconnected", "Component is disconnected.") : _("not_ready", "Call uploadFile() after whenReady() resolves.");
		if (e.state !== "resolved" || !e.active || e.token === null || e.token !== this.#c || !this.#e) throw _("not_ready", "Call uploadFile() after whenReady() resolves.");
		return {
			app: this.#e,
			generation: e.token
		};
	}
	isCurrentConnection(e) {
		return this.isConnected && e === this.#c && this.#r.active && this.#r.token === e && this.#r.state === "resolved";
	}
	onConnectionAttempt() {}
	getConnectionError() {
		return null;
	}
	onDisconnected() {}
	isAutoLoginNip07Enabled() {
		return this.autoLogin;
	}
	getAdditionalMountProps(e) {
		return {};
	}
	notifyPostComponentLoadFailure(e) {
		this.isConnected && e === this.#c && this.#r.state === "pending" && this.fail("initialization_failed", "eHagaki Composer could not be initialized.");
	}
	enqueue(e) {
		let t = this.#r, n = this.#i && !this.isConnected, r = this.#s.then(async () => {
			if (n) throw g("disconnected", "Component is disconnected.");
			if (await t.promise, !t.active || t.token === null || t.token !== this.#c || this.#r !== t || !this.isConnected) throw g("disconnected", "Component was disconnected before the operation could run.");
			return e();
		});
		return this.#s = r.then(() => void 0, () => void 0), r;
	}
	#u(e) {
		this.isConnected && e === this.#c && (this.#a = !0, this.#f(e));
	}
	#d(e, t) {
		this.isConnected && e === this.#c && typeof t == "boolean" && (this.#o === t || (this.#o = t, this.dispatchSafeEvent("ehagaki-editor-empty-change", { isEmpty: t })), this.#f(e));
	}
	#f(e) {
		this.isConnected && e === this.#c && this.#a && this.#o !== null && this.#r.state === "pending" && (this.#r.state = "resolved", this.#r.resolve(), this.dispatchSafeEvent("ehagaki-ready", { apiVersion: 1 }));
	}
	fail(e, t, n = g(e, t)) {
		this.#r.state = "rejected", this.#r.active = !1, this.#r.reason = n, this.#r.reject(n), this.dispatchSafeEvent("ehagaki-initialization-error", {
			code: e,
			message: t
		});
	}
};
// D:/ドキュメント/GitHub/ehagaki/src/web-component/hostOwnedLiteOptions.ts
function w(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function T(e) {
	return typeof e == "number" && Number.isSafeInteger(e) && e > 0;
}
var E = {
	ctrl: 1,
	meta: 2,
	alt: 4,
	shift: 8
}, D = /* @__PURE__ */ new Set([
	"ctrl",
	"meta",
	"ctrlOrMeta",
	"alt",
	"shift"
]);
function O(e) {
	let t = 0, n = e.includes("ctrlOrMeta");
	for (let n of e) n !== "ctrlOrMeta" && (t |= E[n]);
	return n ? [t | E.ctrl, t | E.meta] : [t];
}
function k(e) {
	if (e === void 0) return;
	if (!Array.isArray(e)) throw TypeError("submitShortcuts must be an array when provided.");
	let t = /* @__PURE__ */ new Set(), n = [];
	for (let r of e) {
		if (!w(r)) throw TypeError("Each submitShortcuts item must be an object.");
		if (typeof r.id != "string" || r.id.trim() === "") throw TypeError("Each submitShortcuts item requires a non-blank string id.");
		if (!Array.isArray(r.modifiers) || r.modifiers.length === 0) throw TypeError("Each submitShortcuts item requires a non-empty modifiers array.");
		let e = [], i = /* @__PURE__ */ new Set();
		for (let t of r.modifiers) {
			if (typeof t != "string" || !D.has(t)) throw TypeError("submitShortcuts contains an unknown modifier.");
			if (i.has(t)) throw TypeError("submitShortcuts cannot contain duplicate modifiers.");
			i.add(t), e.push(t);
		}
		if (e.includes("ctrlOrMeta") && (e.includes("ctrl") || e.includes("meta"))) throw TypeError("ctrlOrMeta cannot be combined with ctrl or meta.");
		for (let n of O(e)) {
			if (t.has(n)) throw TypeError("submitShortcuts cannot contain overlapping modifier states.");
			t.add(n);
		}
		n.push(Object.freeze({
			id: r.id,
			modifiers: Object.freeze([...e])
		}));
	}
	return Object.freeze(n);
}
function A(e) {
	if (!w(e) || typeof e.submit != "function") throw TypeError("Host-owned Composer requires a submit handler.");
	if (e.uploadMedia !== void 0 && typeof e.uploadMedia != "function") throw TypeError("uploadMedia must be a function when provided.");
	if (e.contentWarningEnabled !== void 0 && typeof e.contentWarningEnabled != "boolean") throw TypeError("contentWarningEnabled must be a boolean when provided.");
	if (e.hashtagPinEnabled !== void 0 && typeof e.hashtagPinEnabled != "boolean") throw TypeError("hashtagPinEnabled must be a boolean when provided.");
	if (e.keyboardButtonBarEnabled !== void 0 && typeof e.keyboardButtonBarEnabled != "boolean") throw TypeError("keyboardButtonBarEnabled must be a boolean when provided.");
	if (e.editorSubmitButtonEnabled !== void 0 && typeof e.editorSubmitButtonEnabled != "boolean") throw TypeError("editorSubmitButtonEnabled must be a boolean when provided.");
	if (e.enterKeyBehavior !== void 0 && e.enterKeyBehavior !== "newline" && e.enterKeyBehavior !== "submit") throw TypeError("enterKeyBehavior must be \"newline\" or \"submit\" when provided.");
	let t = e.editorMinLines !== void 0;
	if (t !== (e.editorMaxLines !== void 0)) throw TypeError("editorMinLines and editorMaxLines must be provided together.");
	if (t && (!T(e.editorMinLines) || !T(e.editorMaxLines) || e.editorMinLines > e.editorMaxLines)) throw TypeError("editorMinLines and editorMaxLines must be positive safe integers with editorMinLines <= editorMaxLines.");
	let n = e.submit, r = e.uploadMedia, i = e.editorMinLines, a = e.editorMaxLines, o = k(e.submitShortcuts);
	return {
		submit: n,
		...r ? { uploadMedia: r } : {},
		...e.contentWarningEnabled === void 0 ? {} : { contentWarningEnabled: e.contentWarningEnabled },
		...e.hashtagPinEnabled === void 0 ? {} : { hashtagPinEnabled: e.hashtagPinEnabled },
		...e.keyboardButtonBarEnabled === void 0 ? {} : { keyboardButtonBarEnabled: e.keyboardButtonBarEnabled },
		...e.editorSubmitButtonEnabled === void 0 ? {} : { editorSubmitButtonEnabled: e.editorSubmitButtonEnabled },
		...e.enterKeyBehavior === void 0 ? {} : { enterKeyBehavior: e.enterKeyBehavior },
		...o === void 0 ? {} : { submitShortcuts: o },
		...t ? {
			editorMinLines: i,
			editorMaxLines: a
		} : {}
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/web-component/hostOwnedLiteElement.ts
function j(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function M(e) {
	if (typeof e != "string") return !1;
	try {
		let t = new URL(e);
		return t.protocol === "http:" || t.protocol === "https:";
	} catch {
		return !1;
	}
}
function N(e) {
	if (!Array.isArray(e)) throw TypeError("Custom emoji catalog must be an array.");
	let t = /* @__PURE__ */ new Set(), n = [];
	for (let r of e) {
		if (!j(r) || typeof r.shortcode != "string" || !M(r.url)) throw TypeError("Custom emoji catalog contains an invalid item.");
		let e = r.shortcode.replace(/^:+|:+$/g, "").trim();
		if (!/^[\p{L}\p{N}_+-]{1,64}$/u.test(e)) throw TypeError("Custom emoji catalog contains an invalid shortcode.");
		let i = typeof r.setAddress == "string" && r.setAddress.trim() ? r.setAddress.trim() : null, a = `${e.toLowerCase()}\u0000${r.url}\u0000${i ?? ""}`;
		t.has(a) || (t.add(a), n.push({
			shortcode: e,
			url: r.url,
			...i ? { setAddress: i } : {}
		}));
	}
	return n;
}
var P = class extends C {
	#e = null;
	#t = [];
	#n = null;
	#r = !1;
	#i = null;
	#a = 0;
	get preferredHeight() {
		return this.#i;
	}
	configureHostOwned(e) {
		if (this.#r || this.#e) throw new DOMException("Host-owned Composer configuration is immutable after it is set or connected.", "InvalidStateError");
		this.#e = A(e);
	}
	setCustomEmojis(e) {
		if (!this.#e) return Promise.reject(new DOMException("Custom emoji catalogs are available only in Host-owned mode.", "InvalidStateError"));
		let t = N(e);
		return this.#t = t, this.enqueue(async () => {
			let e = this.requireApp();
			if (!("setHostCustomEmojis" in e) || typeof e.setHostCustomEmojis != "function") throw Error("Host-owned Composer app is unavailable.");
			await e.setHostCustomEmojis(t.map((e) => ({ ...e })));
		});
	}
	loadApp() {
		return import("./assets/HostOwnedComposerLiteApp-Bn2yW-a7.js").then((e) => e.t);
	}
	onConnectionAttempt() {
		this.#r = !0, this.#a += 1, this.#i = null;
	}
	getConnectionError() {
		return this.#e ? null : {
			code: "initialization_failed",
			message: "Host-owned Composer Lite requires configureHostOwned() before connection."
		};
	}
	onDisconnected() {
		this.#a += 1, this.#i = null, this.#n?.abort(), this.#n = null;
	}
	isAutoLoginNip07Enabled() {
		return !1;
	}
	getAdditionalMountProps() {
		if (!this.#e) throw Error("Host-owned Composer Lite configuration is missing.");
		this.#n = new AbortController();
		let e = this.#a;
		return {
			hostOwnedConfig: {
				...this.#e,
				customEmojis: this.#t.map((e) => ({ ...e })),
				signal: this.#n.signal
			},
			onPreferredHeightChange: (t) => {
				if (!this.isConnected || e !== this.#a || !Number.isFinite(t) || t <= 0) return;
				let n = Math.ceil(t);
				this.#i !== n && (this.#i = n, this.dispatchSafeEvent("ehagaki-preferred-height-change", { height: n }));
			}
		};
	}
};
// D:/ドキュメント/GitHub/ehagaki/src/web-component/host-owned-entry.ts
c("host-owned-lite", P);
export { o as EHAGAKI_COMPOSER_API_VERSION, a as EHAGAKI_COMPOSER_TAG_NAME, P as EHagakiComposerElement };
