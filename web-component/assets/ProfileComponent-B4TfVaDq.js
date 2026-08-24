import { H as _t, I as y, aX as wt, aC as Oe, ay as Me, K as H, Q as yt, a_ as qt, aZ as W, b1 as kt, V as Ct, $ as Dt, W as Nt, M as At, N as Pt, b7 as St, bb as Re, bc as $t, a as Lt } from "./App-2yO7FIhW.js";
import { a_ as Ht, aQ as Ot, aJ as Mt, aN as Rt, a as e, b as jt, Z as p, b1 as c, b6 as i, b2 as It, aP as r, b3 as q, a$ as Bt, b0 as ne, bd as l, bg as v, b8 as g, ap as je, bf as G, aq as Qt, b4 as Vt, b7 as o, bh as Wt } from "./entry-tn6az_XN.js";
import { I as Zt } from "./InfoPopoverButton-BT529VEw.js";
import { D as Ft, a as Jt } from "./DialogWrapper-DqB9O7tX.js";
var Kt = g('<div class="xmark-icon svg-icon svelte-1qzltz2" aria-hidden="true"></div>'), Tt = g('<div class="copy-icon svg-icon svelte-1qzltz2" aria-hidden="true"></div>'), Xt = g('<div class="profile-info-row svelte-1qzltz2"><div class="profile-info-content svelte-1qzltz2"><span class="profile-info-text svelte-1qzltz2"> </span> <!></div></div>'), Et = g('<div class="copy-icon svg-icon svelte-1qzltz2" aria-hidden="true"></div>'), Gt = g('<div class="profile-info-row svelte-1qzltz2"><div class="profile-info-content svelte-1qzltz2"><span class="profile-info-text svelte-1qzltz2"> </span> <!></div></div>'), Ut = g('<div class="logout-icon svg-icon svelte-1qzltz2" aria-hidden="true"></div> <span> </span>', 1), Yt = g('<div class="recovery-section svelte-1qzltz2"><div class="profile-info-label svelte-1qzltz2"> </div> <div class="recovery-description svelte-1qzltz2"> </div> <!></div>'), eo = g('<span class="active-badge svelte-1qzltz2"> </span>'), to = g('<div class="network-ping-icon svg-icon svelte-1qzltz2" aria-hidden="true"></div> <span> </span>', 1), oo = g('<div class="nip46-connection-status info svelte-1qzltz2"> </div>'), io = g('<div class="nip46-connection-status success svelte-1qzltz2"> </div>'), ao = g('<div class="nip46-connection-status error svelte-1qzltz2"> </div>'), no = g('<div class="nip46-connection-panel svelte-1qzltz2"><div class="nip46-connection-title-row svelte-1qzltz2"><div class="nip46-connection-title svelte-1qzltz2"> </div> <!></div> <!> <!></div>'), ro = g('<div><div class="account-row svelte-1qzltz2"><button class="account-info-button svelte-1qzltz2"><!> <div class="account-details svelte-1qzltz2"><div class="account-name-row svelte-1qzltz2"><span class="account-name svelte-1qzltz2"> </span> <span class="account-npub-short svelte-1qzltz2"> </span></div> <span class="account-type-badge svelte-1qzltz2"><!></span></div> <!></button> <button class="account-logout-button svelte-1qzltz2"><div class="logout-icon svg-icon svelte-1qzltz2"></div></button></div> <!></div>'), lo = g('<div class="plus-icon svg-icon svelte-1qzltz2" aria-hidden="true"></div> <span class="add-account-label svelte-1qzltz2"> </span>', 1), so = g('<div class="accounts-section svelte-1qzltz2"><div class="profile-info-label svelte-1qzltz2"> </div> <div class="account-list svelte-1qzltz2"></div> <!></div>'), co = g('<div class="profile-container svelte-1qzltz2"><div class="current-account-section svelte-1qzltz2"><div class="profile-summary svelte-1qzltz2"><!> <div class="profile-name svelte-1qzltz2"> </div></div> <div class="nostr-ids svelte-1qzltz2"><div class="profile-info-label svelte-1qzltz2"> </div> <div class="profile-info-container svelte-1qzltz2"><!> <!></div></div></div> <!> <!></div>');
const vo = {
  hash: "svelte-1qzltz2",
  code: `.xmark-icon.svelte-1qzltz2 {mask-image:var(--ehagaki-icon-636c6f73655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.profile-container.svelte-1qzltz2 {display:flex;flex-direction:column;align-items:center;gap:28px;width:100%;height:100%;}.current-account-section.svelte-1qzltz2 {display:flex;flex-direction:column;align-items:center;width:100%;gap:16px;padding:8px 0;border-bottom:1px solid var(--border-hr);}.profile-summary.svelte-1qzltz2 {display:flex;flex-direction:column;align-items:center;width:100%;gap:10px;.profile-image-container {width:80px;height:80px;border-radius:50%;overflow:hidden;}.profile-image {width:100%;height:100%;object-fit:cover;}.profile-image-placeholder {width:100%;height:100%;}.profile-name:where(.svelte-1qzltz2) {font-size:1.375rem;font-weight:600;color:var(--text);text-align:center;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}}.nostr-ids.svelte-1qzltz2 {display:flex;flex-direction:column;align-items:flex-start;gap:6px;width:100%;min-width:0;.profile-info-container:where(.svelte-1qzltz2) {display:flex;flex-direction:column;gap:6px;width:100%;min-width:0;.profile-info-row:where(.svelte-1qzltz2) {min-height:50px;width:100%;min-width:0;display:flex;flex-direction:column;.profile-info-content:where(.svelte-1qzltz2) {display:flex;align-items:stretch;background-color:var(--btn-bg);border-radius:8px;overflow:hidden;width:100%;min-width:0;.profile-info-text:where(.svelte-1qzltz2) {flex:1 1 auto;min-width:0;font-family:monospace;font-size:1rem;line-height:1.2;color:var(--text);margin:6px 0 6px 8px;overflow-wrap:anywhere;}}}}}.copy-button {height:auto;width:44px;flex:0 0 44px;background-color:var(--btn-bg);.copy-icon.svelte-1qzltz2 {width:20px;height:20px;mask-image:var(--ehagaki-icon-66696c655f636f70795f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}}.profile-info-label.svelte-1qzltz2 {font-size:0.875rem;font-weight:500;color:var(--text-light);}.accounts-section.svelte-1qzltz2 {display:flex;flex-direction:column;gap:8px;width:100%;.account-list:where(.svelte-1qzltz2) {display:flex;flex-direction:column;gap:4px;}.account-item:where(.svelte-1qzltz2) {display:flex;flex-direction:column;align-items:stretch;gap:8px;padding:0;border-radius:8px;transition:background-color 0.15s;.account-row:where(.svelte-1qzltz2) {display:flex;align-items:center;}&.active {:disabled {opacity:1;}.account-info-button:where(.svelte-1qzltz2) {background-color:transparent;border:solid 1px var(--border);border-inline-end:none;}.account-logout-button:where(.svelte-1qzltz2) {background-color:transparent;border:solid 1px var(--border);border-inline-start:none;}}}.account-avatar {width:38px;height:38px;border-radius:50%;overflow:hidden;flex-shrink:0;}.account-avatar-img {width:100%;height:100%;object-fit:cover;}.account-avatar-placeholder {width:100%;height:100%;}.account-details:where(.svelte-1qzltz2) {display:flex;flex-direction:column;align-items:flex-start;min-width:0;width:100%;gap:4px;}.account-name-row:where(.svelte-1qzltz2) {display:flex;align-items:baseline;gap:6px;min-width:0;width:100%;}.account-name:where(.svelte-1qzltz2) {font-size:1rem;font-weight:500;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0;flex-shrink:1;}.account-npub-short:where(.svelte-1qzltz2) {font-size:0.7rem;color:var(--text-light);font-family:monospace;white-space:nowrap;flex-shrink:0;}.account-type-badge:where(.svelte-1qzltz2) {font-size:0.75rem;color:var(--text-light);}.active-badge:where(.svelte-1qzltz2) {font-size:0.875rem;font-weight:600;color:var(--theme);margin-inline-start:auto;flex-shrink:0;}.account-logout-button:where(.svelte-1qzltz2) {display:flex;align-items:center;justify-content:center;width:50px;height:50px;background-color:var(--btn-bg);border:solid 1px var(--btn-bg);border-inline-start:none;border-radius:0 8px 8px 0;cursor:pointer;flex-shrink:0;color:var(--text-light);transition:background-color 0.15s,
                color 0.15s;

            @media (hover: hover) and (pointer: fine) {&:hover:not(:disabled) {background-color:rgba(239, 68, 68, 0.1);color:#ef4444;}
            }&:disabled {opacity:0.4;cursor:default;}}button.add-account-btn {display:flex;align-items:center;gap:4px;width:100%;height:50px;margin-top:4px;}.add-account-label:where(.svelte-1qzltz2) {font-size:1rem;}.nip46-connection-panel:where(.svelte-1qzltz2) {display:flex;flex-direction:column;gap:2px;padding:8px;border:1px solid var(--border);border-radius:8px;background:color-mix(in srgb, var(--btn-bg), transparent 18%);}.nip46-connection-title-row:where(.svelte-1qzltz2) {display:flex;align-items:center;gap:2px;}.nip46-connection-title:where(.svelte-1qzltz2) {font-size:1rem;font-weight:600;color:var(--text);}.nip46-connection-status:where(.svelte-1qzltz2) {font-size:0.875rem;line-height:1.4;}.nip46-connection-status.info:where(.svelte-1qzltz2) {color:var(--text-light);}.nip46-connection-status.success:where(.svelte-1qzltz2) {color:var(--theme);}.nip46-connection-status.error:where(.svelte-1qzltz2) {color:var(--danger);}button.nip46-connection-button {width:fit-content;min-height:44px;display:inline-flex;align-items:center;gap:8px;}.network-ping-icon.svg-icon:where(.svelte-1qzltz2) {width:26px;height:26px;mask-image:var(--ehagaki-icon-6e6574776f726b5f70696e675f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);background-color:currentColor;flex-shrink:0;}}.logout-icon.svelte-1qzltz2 {mask-image:var(--ehagaki-icon-6c6f676f75745f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);width:26px;height:26px;}.recovery-section.svelte-1qzltz2 {width:100%;display:flex;flex-direction:column;gap:10px;padding:10px;border:1px solid var(--border);border-radius:10px;background:color-mix(in srgb, var(--btn-bg), transparent 18%);.recovery-description:where(.svelte-1qzltz2) {color:var(--text-light);font-size:0.9rem;line-height:1.4;}.recovery-logout-btn {width:100%;min-height:44px;display:inline-flex;align-items:center;gap:8px;}}.account-info-button.svelte-1qzltz2 {display:flex;align-items:center;gap:8px;flex:1;min-width:0;height:50px;padding-inline-start:8px;background-color:var(--btn-bg);border-radius:8px 0 0 8px;cursor:pointer;color:inherit;font:inherit;&:disabled {cursor:default;}}.plus-icon.svg-icon.svelte-1qzltz2 {mask-image:var(--ehagaki-icon-6164645f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);width:26px;height:26px;flex-shrink:0;}`
};
function po(we, m) {
  Ht(m, !0), _t(we, vo);
  const a = () => Ct(Dt, "$_", Ie), [Ie, Be] = yt();
  function Qe(t) {
    try {
      const S = Re(t);
      return $t(S, 9, 4);
    } catch {
      return "";
    }
  }
  function Ve(t) {
    try {
      return Re(t);
    } catch {
      return "";
    }
  }
  let B = y(m, "show", 15, !1), re = y(m, "onClose", 7), le = y(m, "onLogout", 7), U = y(m, "fallbackRecoveryPubkeyHex", 7, ""), se = y(m, "onSwitchAccount", 7), ce = y(m, "onAddAccount", 7), ve = y(m, "onCheckNip46Connection", 7), Z = y(m, "accounts", 23, () => []), de = y(m, "accountProfiles", 23, () => /* @__PURE__ */ new Map()), Q = y(m, "isLoggingOut", 7, !1), O = y(m, "isSwitchingAccount", 7, !1), F = y(m, "nip46ConnectionOperationState", 7, "idle"), Y = y(m, "nip46ConnectionStatus", 7, "idle");
  function pe() {
    B(!1), re()?.();
  }
  wt(() => B(), pe, !0);
  let ye = r(() => Oe.value), ue = r(() => Lt.value), k = Ot(Mt(Oe.value)), ee = r(() => e(ue)?.pubkey || U() || ""), fe = r(() => e(k).npub || (e(ee) ? Ve(e(ee)) : "")), We = r(() => e(k).displayName || e(k).name ? e(k).displayName || e(k).name : a()("profileDialog.profile_image_alt")), qe = r(() => a()("profileDialog.profile_image_fallback")), Ze = r(() => Z().length === 0 && !!e(ee));
  Rt(() => {
    !Q() && e(ye) && jt(k, e(ye), !0);
  });
  function ke(t) {
    const S = t || e(ue)?.pubkey || U() || "";
    S && le()?.(S);
  }
  function Fe(t) {
    se()?.(t), pe();
  }
  function Je(t) {
    ve()?.(t);
  }
  async function Ce(t, S) {
    return St(t, S, navigator, window);
  }
  var Ke = {
    get show() {
      return B();
    },
    set show(t = !1) {
      B(t), q();
    },
    get onClose() {
      return re();
    },
    set onClose(t) {
      re(t), q();
    },
    get onLogout() {
      return le();
    },
    set onLogout(t) {
      le(t), q();
    },
    get fallbackRecoveryPubkeyHex() {
      return U();
    },
    set fallbackRecoveryPubkeyHex(t = "") {
      U(t), q();
    },
    get onSwitchAccount() {
      return se();
    },
    set onSwitchAccount(t) {
      se(t), q();
    },
    get onAddAccount() {
      return ce();
    },
    set onAddAccount(t) {
      ce(t), q();
    },
    get onCheckNip46Connection() {
      return ve();
    },
    set onCheckNip46Connection(t) {
      ve(t), q();
    },
    get accounts() {
      return Z();
    },
    set accounts(t = []) {
      Z(t), q();
    },
    get accountProfiles() {
      return de();
    },
    set accountProfiles(t = /* @__PURE__ */ new Map()) {
      de(t), q();
    },
    get isLoggingOut() {
      return Q();
    },
    set isLoggingOut(t = !1) {
      Q(t), q();
    },
    get isSwitchingAccount() {
      return O();
    },
    set isSwitchingAccount(t = !1) {
      O(t), q();
    },
    get nip46ConnectionOperationState() {
      return F();
    },
    set nip46ConnectionOperationState(t = "idle") {
      F(t), q();
    },
    get nip46ConnectionStatus() {
      return Y();
    },
    set nip46ConnectionStatus(t = "idle") {
      Y(t), q();
    }
  };
  {
    const t = (M) => {
      var ge = Bt(), J = ne(ge);
      {
        const K = (R, V) => {
          let te = () => V?.().props;
          {
            let he = r(() => a()("global.close"));
            W(R, kt(te, {
              className: "modal-close",
              shape: "square",
              get ariaLabel() {
                return e(he);
              },
              children: (oe, ie) => {
                var ze = Kt();
                c(oe, ze);
              },
              $$slots: { default: !0 }
            }));
          }
        };
        qt(J, () => Jt, (R, V) => {
          V(R, { child: K, $$slots: { child: !0 } });
        });
      }
      c(M, ge);
    };
    let S = r(() => a()("profileDialog.title")), Xe = r(() => a()("profileDialog.npub"));
    Ft(we, {
      onOpenChange: (M) => !M && pe(),
      get title() {
        return e(S);
      },
      get description() {
        return e(Xe);
      },
      contentClass: "profile-dialog",
      footerVariant: "close-button",
      get open() {
        return B();
      },
      set open(M) {
        B(M);
      },
      footer: t,
      children: (M, ge) => {
        var J = co(), K = i(J), R = i(K), V = i(R);
        Me(V, {
          get src() {
            return e(k).picture;
          },
          get alt() {
            return e(We);
          },
          rootClassName: "profile-image-container",
          imageClassName: "profile-image",
          fallbackClassName: "profile-image-placeholder",
          get fallbackAriaLabel() {
            return e(qe);
          }
        });
        var te = l(V, 2), he = i(te, !0);
        o(te), o(R);
        var oe = l(R, 2), ie = i(oe), ze = i(ie, !0);
        o(ie);
        var De = l(ie, 2), Ne = i(De);
        {
          var Ee = (u) => {
            var f = Xt(), _ = i(f), D = i(_), N = i(D, !0);
            o(D);
            var j = l(D, 2);
            {
              let w = r(() => a()("profileDialog.copy_npub")), d = r(() => a()("common.copySuccess"));
              W(j, {
                shape: "square",
                className: "copy-button",
                onClick: () => Ce(e(fe), "npub"),
                get ariaLabel() {
                  return e(w);
                },
                get floatingMessage() {
                  return e(d);
                },
                children: (h, $) => {
                  var C = Tt();
                  c(h, C);
                },
                $$slots: { default: !0 }
              });
            }
            o(_), o(f), p(() => v(N, e(fe))), c(u, f);
          };
          H(Ne, (u) => {
            e(fe) && u(Ee);
          });
        }
        var Ge = l(Ne, 2);
        {
          var Ue = (u) => {
            var f = Gt(), _ = i(f), D = i(_), N = i(D, !0);
            o(D);
            var j = l(D, 2);
            {
              let w = r(() => a()("profileDialog.copy_nprofile")), d = r(() => a()("common.copySuccess"));
              W(j, {
                className: "copy-button",
                onClick: () => Ce(e(k).nprofile, "nprofile"),
                get ariaLabel() {
                  return e(w);
                },
                get floatingMessage() {
                  return e(d);
                },
                children: (h, $) => {
                  var C = Et();
                  c(h, C);
                },
                $$slots: { default: !0 }
              });
            }
            o(_), o(f), p(() => v(N, e(k).nprofile)), c(u, f);
          };
          H(Ge, (u) => {
            e(k).nprofile && u(Ue);
          });
        }
        o(De), o(oe), o(K);
        var Ae = l(K, 2);
        {
          var Ye = (u) => {
            var f = Yt(), _ = i(f), D = i(_, !0);
            o(_);
            var N = l(_, 2), j = i(N, !0);
            o(N);
            var w = l(N, 2);
            {
              let d = r(() => Q() || O()), h = r(() => a()("profileDialog.recovery_logout_current"));
              W(w, {
                className: "recovery-logout-btn",
                variant: "danger",
                shape: "rounded",
                get disabled() {
                  return e(d);
                },
                onClick: () => ke(e(ee)),
                get ariaLabel() {
                  return e(h);
                },
                children: ($, C) => {
                  var A = Ut(), T = l(ne(A), 2), X = i(T, !0);
                  o(T), p((I) => v(X, I), [() => a()("profileDialog.recovery_logout_current")]), c($, A);
                },
                $$slots: { default: !0 }
              });
            }
            o(f), p(
              (d, h) => {
                v(D, d), v(j, h);
              },
              [
                () => a()("profileDialog.recovery_title"),
                () => a()("profileDialog.recovery_description")
              ]
            ), c(u, f);
          };
          H(Ae, (u) => {
            e(Ze) && u(Ye);
          });
        }
        var et = l(Ae, 2);
        {
          var tt = (u) => {
            var f = so(), _ = i(f), D = i(_, !0);
            o(_);
            var N = l(_, 2);
            Nt(N, 21, Z, (w) => w.pubkeyHex, (w, d) => {
              const h = r(() => e(d).pubkeyHex === e(ue)?.pubkey), $ = r(() => e(h) && e(d).type === "nip46"), C = r(() => de().get(e(d).pubkeyHex));
              var A = ro();
              let T;
              var X = i(A), I = i(X), Pe = i(I);
              {
                let n = r(() => e(C)?.picture), s = r(() => e(C)?.displayName || e(C)?.name || a()("profileDialog.profile_image_alt"));
                Me(Pe, {
                  get src() {
                    return e(n);
                  },
                  get alt() {
                    return e(s);
                  },
                  rootClassName: "account-avatar",
                  imageClassName: "account-avatar-img",
                  fallbackClassName: "account-avatar-placeholder",
                  get fallbackAriaLabel() {
                    return e(qe);
                  }
                });
              }
              var be = l(Pe, 2), xe = i(be), me = i(xe), ot = i(me, !0);
              o(me);
              var Se = l(me, 2), it = i(Se, !0);
              o(Se), o(xe);
              var $e = l(xe, 2), at = i($e);
              {
                var nt = (n) => {
                  var s = G();
                  p((z) => v(s, z), [() => a()("profileDialog.login_method_nsec")]), c(n, s);
                }, rt = (n) => {
                  var s = G();
                  p((z) => v(s, z), [() => a()("profileDialog.login_method_nip07")]), c(n, s);
                }, lt = (n) => {
                  var s = G();
                  p((z) => v(s, z), [() => a()("profileDialog.login_method_nip46")]), c(n, s);
                }, st = (n) => {
                  var s = G();
                  p((z) => v(s, z), [() => a()("profileDialog.login_method_parent_client")]), c(n, s);
                };
                H(at, (n) => {
                  e(d).type === "nsec" ? n(nt) : e(d).type === "nip07" ? n(rt, 1) : e(d).type === "nip46" ? n(lt, 2) : e(d).type === "parentClient" && n(st, 3);
                });
              }
              o($e), o(be);
              var ct = l(be, 2);
              {
                var vt = (n) => {
                  var s = eo(), z = i(s, !0);
                  o(s), p((E) => v(z, E), [() => a()("profileDialog.active")]), c(n, s);
                };
                H(ct, (n) => {
                  e(h) && n(vt);
                });
              }
              o(I);
              var _e = l(I, 2);
              o(X);
              var dt = l(X, 2);
              {
                var pt = (n) => {
                  var s = no(), z = i(s), E = i(z), ut = i(E, !0);
                  o(E);
                  var ft = l(E, 2);
                  {
                    let b = r(() => a()("profileDialog.nip46_connection_description"));
                    Zt(ft, {
                      side: "bottom",
                      sideOffset: 6,
                      get ariaLabel() {
                        return e(b);
                      },
                      children: (x, L) => {
                        Wt();
                        var P = G();
                        p((ae) => v(P, ae), [() => a()("profileDialog.nip46_connection_description")]), c(x, P);
                      },
                      $$slots: { default: !0 }
                    });
                  }
                  o(z);
                  var Le = l(z, 2);
                  {
                    let b = r(() => Q() || O() || F() !== "idle"), x = r(() => a()("profileDialog.nip46_connection_check"));
                    W(Le, {
                      className: "nip46-connection-button",
                      variant: "secondary",
                      shape: "rounded",
                      get disabled() {
                        return e(b);
                      },
                      onClick: () => Je(e(d).pubkeyHex),
                      get ariaLabel() {
                        return e(x);
                      },
                      children: (L, P) => {
                        var ae = to(), He = l(ne(ae), 2), xt = i(He, !0);
                        o(He), p((mt) => v(xt, mt), [
                          () => F() === "manual-check" ? a()("profileDialog.nip46_connection_checking") : a()("profileDialog.nip46_connection_check")
                        ]), c(L, ae);
                      },
                      $$slots: { default: !0 }
                    });
                  }
                  var gt = l(Le, 2);
                  {
                    var ht = (b) => {
                      var x = oo(), L = i(x, !0);
                      o(x), p((P) => v(L, P), [() => a()("profileDialog.nip46_connection_auto_recovering")]), c(b, x);
                    }, zt = (b) => {
                      var x = io(), L = i(x, !0);
                      o(x), p((P) => v(L, P), [() => a()("profileDialog.nip46_connection_success")]), c(b, x);
                    }, bt = (b) => {
                      var x = ao(), L = i(x, !0);
                      o(x), p((P) => v(L, P), [() => a()("profileDialog.nip46_connection_failed")]), c(b, x);
                    };
                    H(gt, (b) => {
                      F() === "auto-recovery" ? b(ht) : Y() === "success" ? b(zt, 1) : Y() === "failure" && b(bt, 2);
                    });
                  }
                  o(s), p((b) => v(ut, b), [() => a()("profileDialog.nip46_connection_title")]), c(n, s);
                };
                H(dt, (n) => {
                  e($) && n(pt);
                });
              }
              o(A), p(
                (n, s, z) => {
                  T = At(A, 1, "account-item svelte-1qzltz2", null, T, { active: e(h) }), I.disabled = e(h) || O(), v(ot, n), v(it, s), _e.disabled = Q() || O(), Pt(_e, "aria-label", z);
                },
                [
                  () => e(C)?.displayName || e(C)?.name || a()("profileDialog.anonymous"),
                  () => Qe(e(d).pubkeyHex),
                  () => a()("profileDialog.logout_account")
                ]
              ), je("click", I, () => {
                !e(h) && !O() && Fe(e(d).pubkeyHex);
              }), je("click", _e, () => ke(e(d).pubkeyHex)), c(w, A);
            }), o(N);
            var j = l(N, 2);
            W(j, {
              onClick: () => ce()?.(),
              className: "add-account-btn",
              variant: "primary",
              shape: "square",
              children: (w, d) => {
                var h = lo(), $ = l(ne(h), 2), C = i($, !0);
                o($), p((A) => v(C, A), [() => a()("profileDialog.add_account")]), c(w, h);
              },
              $$slots: { default: !0 }
            }), o(f), p((w) => v(D, w), [() => a()("profileDialog.accounts")]), c(u, f);
          };
          H(et, (u) => {
            Z().length > 0 && u(tt);
          });
        }
        o(J), p(
          (u, f) => {
            v(he, u), v(ze, f);
          },
          [
            () => e(k).displayName || e(k).name || a()("profileDialog.anonymous"),
            () => a()("profileDialog.npub")
          ]
        ), c(M, J);
      },
      $$slots: { footer: !0, default: !0 }
    });
  }
  var Te = It(Ke);
  return Be(), Te;
}
Qt(["click"]);
Vt(
  po,
  {
    show: {},
    onClose: {},
    onLogout: {},
    fallbackRecoveryPubkeyHex: {},
    onSwitchAccount: {},
    onAddAccount: {},
    onCheckNip46Connection: {},
    accounts: {},
    accountProfiles: {},
    isLoggingOut: {},
    isSwitchingAccount: {},
    nip46ConnectionOperationState: {},
    nip46ConnectionStatus: {}
  },
  [],
  [],
  { mode: "open" }
);
export {
  po as default
};
